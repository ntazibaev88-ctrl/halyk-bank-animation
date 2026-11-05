#!/usr/bin/env python3
"""Synthesise the Russian narration and compute the master timeline.

Input : script/narration.json
Output: audio/voiceover_ru.wav  (48 kHz mono, processed "deep narrator" voice)
        script/timing.json      (scene slots + per-subtitle-chunk start/end)

Voice engine: espeak-ng (the only offline Russian TTS available in this
environment).  It is deliberately post-processed (pitch down, bass, compression,
slight room) to sound like a deeper narrator.  To use a real human / neural
voice instead, drop a recording at audio/voiceover_ru.wav and edit the chunk
start/end times in script/timing.json (see README, "Replacing the voice").
"""
import json, subprocess, wave, sys, os
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
SPEED = int(os.environ.get("TTS_SPEED", 212))   # espeak words/min
PITCH = 18
TMP = os.environ.get("TMPDIR", "/tmp") + "/vo_chunks"
os.makedirs(TMP, exist_ok=True)


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_wav(path):
    with wave.open(path) as w:
        n = w.getnframes()
        raw = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
        return raw, w.getframerate()


def synth(idx, text):
    raw = f"{TMP}/c{idx:03d}_raw.wav"
    out = f"{TMP}/c{idx:03d}.wav"
    run(["espeak-ng", "-v", "ru+m3", "-s", str(SPEED), "-p", str(PITCH), "-g", "2", "-a", "180", "-w", raw, text])
    # deeper timbre: pitch down ~12% (tempo compensated), warm EQ, compression
    af = (
        f"aresample={SR},asetrate={SR}*0.88,aresample={SR},atempo=1.1364,"
        "highpass=f=70,equalizer=f=110:t=q:w=1.0:g=6,equalizer=f=260:t=q:w=1.0:g=2,"
        "equalizer=f=3400:t=q:w=1.2:g=2.5,lowpass=f=9500,"
        "acompressor=threshold=-24dB:ratio=3.5:attack=8:release=120:makeup=4"
    )
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", af, "-ac", "1", out])
    x, sr = read_wav(out)
    assert sr == SR
    # trim leading/trailing silence, keep 30 ms / 90 ms air
    thr = 0.012
    idxs = np.where(np.abs(x) > thr)[0]
    a = max(0, idxs[0] - int(0.03 * SR))
    b = min(len(x), idxs[-1] + int(0.09 * SR))
    return x[a:b]


def main():
    data = json.load(open(f"{ROOT}/script/narration.json"))
    t = 0.0
    timeline = {"fps": 30, "scenes": [], "chunks": []}
    pieces = []  # (start_sample, audio)
    n = 0
    for sc in data["scenes"]:
        s_start = t
        t += sc.get("lead", 0.5)
        first = True
        for c in sc["chunks"]:
            text = c.get("tts") or c["t"].replace("*", "")
            audio = synth(n, text)
            dur = len(audio) / SR
            timeline["chunks"].append({
                "scene": sc["id"], "text": c["t"],
                "start": round(t, 3), "end": round(t + dur, 3),
            })
            pieces.append((int(t * SR), audio))
            t += dur + c.get("gap", 0.16)
            n += 1
        t = t - 0.16 + sc.get("tail", 0.5) if sc["chunks"] else t
        timeline["scenes"].append({"id": sc["id"], "name": sc["name"], "start": round(s_start, 3)})
    total = t
    # round total to a whole frame count
    total = np.ceil(total * 30) / 30
    for i, sc in enumerate(timeline["scenes"]):
        end = timeline["scenes"][i + 1]["start"] if i + 1 < len(timeline["scenes"]) else total
        sc["end"] = round(end, 3)
        sc["duration"] = round(end - sc["start"], 3)
    timeline["duration"] = round(total, 3)

    buf = np.zeros(int((total + 0.5) * SR), dtype=np.float32)
    for s, a in pieces:
        buf[s:s + len(a)] += a[: len(buf) - s]
    pre = f"{TMP}/voice_pre.wav"
    with wave.open(pre, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
    # light room + loudness target for dialogue
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", pre, "-af",
         "aecho=0.85:0.5:55|140:0.16|0.08,loudnorm=I=-15:TP=-1.5:LRA=7",
         "-ar", str(SR), "-ac", "1", f"{ROOT}/audio/voiceover_ru.wav"])
    json.dump(timeline, open(f"{ROOT}/script/timing.json", "w"), ensure_ascii=False, indent=2)
    print(f"chunks={n} total={timeline['duration']}s")
    for sc in timeline["scenes"]:
        print(f"  {sc['id']}: {sc['start']:7.2f} -> {sc['end']:7.2f}  ({sc['duration']:.2f}s)")


if __name__ == "__main__":
    main()
