#!/usr/bin/env python3
"""Russian male voice-over generator.

ENGINE integration point: set VO_ENGINE=espeak (default, offline) or `external`.
With `external`, drop one WAV per sentence into voiceover/external/s{scene}_{n}.wav
(e.g. rendered with Piper ru_RU-dmitri/denis, Silero 'aidar', ElevenLabs, Yandex SpeechKit...)
and the same timing/subtitle pipeline is used.
Outputs: voiceover/sentences/*.wav, voiceover/lengths.json
"""
import json, os, subprocess, sys, wave, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, "voiceover")
os.makedirs(V + "/sentences", exist_ok=True)
script = json.load(open(V + "/script.json", encoding="utf-8"))
engine = os.environ.get("VO_ENGINE", "espeak")
SPEED = os.environ.get("VO_SPEED", "185")
lengths = {}
def dur(p):
    with wave.open(p) as w: return w.getnframes() / w.getframerate()
for sc in script["scenes"]:
    for i, s in enumerate(sc["sentences"]):
        key = f"s{sc['id']}_{i}"
        out = f"{V}/sentences/{key}.wav"
        if engine == "espeak":
            t = s
            for k, v in script["pronounce"].items(): t = t.replace(k, v)
            raw = out + ".raw.wav"
            subprocess.run(["espeak-ng", "-v", "ru+m3", "-s", SPEED, "-p", "18", "-g", "2", "-a", "180",
                            "-w", raw, t], check=True)
            # deepen + warm + glue: lower formants/pitch, EQ, compress, subtle room
            af = ("asetrate=22050*0.90,aresample=44100,atempo=1.0,"
                  "highpass=f=70,lowshelf=g=6:f=180,equalizer=f=2800:t=q:w=1.2:g=2,"
                  "acompressor=threshold=-20dB:ratio=3:attack=5:release=120,"
                  "aecho=0.8:0.5:35:0.12,loudnorm=I=-16:TP=-1.5:LRA=7")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", af, "-ar", "44100", "-ac", "1", out], check=True)
            os.remove(raw)
        else:
            src = f"{V}/external/{key}.wav"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ar", "44100", "-ac", "1", out], check=True)
        lengths[key] = round(dur(out), 3)
json.dump(lengths, open(V + "/lengths.json", "w"), indent=1)
print(json.dumps(lengths, indent=1))
tot = {}
for k, v in lengths.items(): tot[k.split("_")[0]] = tot.get(k.split("_")[0], 0) + v
print("per scene:", {k: round(v, 1) for k, v in tot.items()}, "total", round(sum(tot.values()), 1))
