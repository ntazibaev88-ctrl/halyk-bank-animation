#!/usr/bin/env python3
"""Candidate Russian male voice-overs with RHVoice (offline), fitted to the EXISTING timing.

Nothing in the film changes: every sentence is fitted to its original slot length
(voiceover/lengths.json) and placed at its original start (data/timing.json), so scenes,
subtitles and music stay exactly as they are.

usage: python3 tools/voice_rhvoice.py vitaliy mikhail
out:   voiceover/candidates/<voice>/sentences/*.wav
       voiceover/candidates/<voice>/voice_<voice>.wav|.mp3     (voice only, full length)
       voiceover/candidates/<voice>/preview_mix_<voice>.mp3    (voice + existing music/ambience/sfx)
       voiceover/candidates/<voice>/report.json
Requires: apt-get install rhvoice rhvoice-russian ffmpeg; pip install numpy
"""
import json, os, subprocess, sys, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
SCRIPT = json.load(open(f"{ROOT}/voiceover/script.json", encoding="utf-8"))
SLOTS = json.load(open(f"{ROOT}/voiceover/lengths.json"))
T = json.load(open(f"{ROOT}/data/timing.json"))
STARTS = {s["key"]: s["start"] for s in T["sentences"]}
TOTAL = T["total"] + 0.5            # same length as audio/voice.wav
VIDEO_LEN = 113.033                 # rendered film length
TARGET_LUFS = -17.0                 # loudness of the current voice track -> mix balance unchanged

# Voice settings (RHVoice percentages; 100 = voice default)
PROFILE = {"vitaliy": {"pitch": 94, "rate": 100}, "mikhail": {"pitch": 96, "rate": 100}}
# Warm documentary chain: rumble cut, chest warmth, clarity, gentle glue compression
CHAIN = ("highpass=f=65,equalizer=f=140:t=q:w=1.0:g=2.5,equalizer=f=320:t=q:w=1.2:g=-1.5,"
         "equalizer=f=3200:t=q:w=1.4:g=2,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=160:makeup=2")
MIN_TEMPO, MAX_TEMPO = 0.94, 1.10   # never stretch outside this range


def tts_text(s):
    """Spoken form for the synthesiser only: the script text itself is not changed."""
    for k, v in SCRIPT["pronounce"].items():
        s = s.replace(k, v)
    # natural breath pause on dashes (RHVoice SSML)
    s = s.replace(" — ", ' <break time="220ms"/> ')
    return f"<speak>{s}</speak>"


def read(p):
    with wave.open(p) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
        return x, w.getframerate()


def write(p, x):
    with wave.open(p, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def trim(x, thr=0.004):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(0.02 * SR)); b = min(len(x), idx[-1] + int(0.08 * SR))
    return x[a:b]


def ff(src, dst, af):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", af, "-ar", str(SR), "-ac", "1", dst], check=True)


def build(voice):
    out = f"{ROOT}/voiceover/candidates/{voice}"
    os.makedirs(f"{out}/sentences", exist_ok=True)
    tmp = f"{out}/.tmp"; os.makedirs(tmp, exist_ok=True)
    prof = PROFILE.get(voice, {"pitch": 100, "rate": 100})
    track = np.zeros(int(TOTAL * SR)); report = []
    for sc in SCRIPT["scenes"]:
        for i, s in enumerate(sc["sentences"]):
            key = f"s{sc['id']}_{i}"; slot = SLOTS[key]
            raw = f"{tmp}/{key}_raw.wav"
            subprocess.run(["RHVoice-test", "-p", voice, "-s", "-R", "24000", "-t", str(prof["pitch"]),
                            "-r", str(prof["rate"]), "-o", raw], input=tts_text(s).encode(), check=True)
            ff(raw, f"{tmp}/{key}_44.wav", CHAIN)
            x, _ = read(f"{tmp}/{key}_44.wav"); x = trim(x)
            nat = len(x) / SR
            # fit to slot: speed up only if longer, slow slightly if much shorter, pad the rest
            tempo = min(MAX_TEMPO, max(MIN_TEMPO, nat * 1.012 / slot))  # 1.2% safety margin
            if abs(tempo - 1) > 0.005:
                write(f"{tmp}/{key}_t.wav", x)
                ff(f"{tmp}/{key}_t.wav", f"{tmp}/{key}_t2.wav", f"atempo={tempo:.4f}")
                x, _ = read(f"{tmp}/{key}_t2.wav")
            n = int(round(slot * SR))
            fitted = len(x) <= n
            x = np.concatenate([x, np.zeros(max(0, n - len(x)))])[:n]
            fade = int(0.03 * SR); x[-fade:] *= np.linspace(1, 0, fade)
            write(f"{out}/sentences/{key}.wav", x)
            i0 = int(round(STARTS[key] * SR)); track[i0:i0 + n] += x
            report.append({"key": key, "slot_s": slot, "natural_s": round(nat, 3), "tempo": round(tempo, 3),
                           "fits_without_cut": fitted})
    write(f"{tmp}/track.wav", track)
    # loudness-match the current voice track so the mix balance stays identical
    ff(f"{tmp}/track.wav", f"{out}/voice_{voice}.wav", f"loudnorm=I={TARGET_LUFS}:TP=-1.5:LRA=9:linear=true")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{out}/voice_{voice}.wav", "-c:a", "libmp3lame",
                    "-b:a", "192k", f"{out}/voice_{voice}.mp3"], check=True)
    # preview in context: same gains as index.html (voice 1, music .62, ambience .42, sfx .62)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{out}/voice_{voice}.wav", "-i", f"{ROOT}/audio/music.mp3",
                    "-i", f"{ROOT}/audio/ambience.mp3", "-i", f"{ROOT}/audio/sfx.mp3", "-filter_complex",
                    "[0]volume=1[a];[1]volume=0.62[b];[2]volume=0.42[c];[3]volume=0.62[d];"
                    "[a][b][c][d]amix=inputs=4:normalize=0,alimiter=limit=0.95",
                    "-t", str(VIDEO_LEN), "-ac", "2", "-ar", "48000", "-c:a", "libmp3lame", "-b:a", "256k",
                    f"{out}/preview_mix_{voice}.mp3"], check=True)
    json.dump(report, open(f"{out}/report.json", "w"), indent=1)
    subprocess.run(["rm", "-rf", tmp])
    worst = max(report, key=lambda r: r["tempo"])
    print(f"{voice}: {len(report)} sentences, tempo range {min(r['tempo'] for r in report)}–{worst['tempo']},"
          f" all fit: {all(r['fits_without_cut'] for r in report)}")


if __name__ == "__main__":
    for v in sys.argv[1:] or ["vitaliy", "mikhail"]:
        build(v)
