"""Build the 90 s narration track + timing JSON (clauses and words, absolute seconds)."""
import json, re, hashlib, numpy as np, soundfile as sf, subprocess, os
from ru_tts import Voice, text_to_phonemes
from narration import SCENES

ROOT = os.path.dirname(os.path.abspath(__file__)) + "/.."
OUT = ROOT + "/video/assets/audio"; os.makedirs(OUT, exist_ok=True)
CACHE = ROOT + "/scripts/voice_cache"; os.makedirs(CACHE, exist_ok=True)  # one wav per clause: edits re-synthesize only what changed
TOTAL = 90.0
# per scene: (length_scale, lead-in seconds after the scene starts)
# per scene: (length_scale, lead-in after scene start, visual beat held after the last word)
PACE = {"s1": (0.97, 0.1, 0.35), "s2": (1.14, 0.35, 1.3), "s3": (1.24, 0.6, 2.3),
        "s4": (1.22, 0.45, 1.6), "s5": (1.26, 0.45, 1.7), "s6": (1.34, 0.6, None)}

V = Voice("ruslan"); SR = V.sr
track = np.zeros(int(TOTAL * SR), np.float32)

def trim(x, thr=0.012, keep=0.03):
    idx = np.where(np.abs(x) > thr)[0]
    a = max(0, idx[0] - int(keep * SR)); b = min(len(x), idx[-1] + int(keep * SR))
    return x[a:b]

VOW = set("аеёиоуыэюяАЕЁИОУЫЭЮЯ")
def word_weights(words):
    w = []
    for t in words:
        letters = re.sub(r"[^А-Яа-яЁё]", "", t)
        v = sum(c in VOW for c in letters)
        w.append(max(1, v) + 0.18 * (len(letters) - v) + 0.15)
    return np.array(w)

timing = {"scenes": [], "clauses": [], "words": []}
scene_start = 0.0
for sid, _s0, _s1, clauses in SCENES:
    ls, lead, tail = PACE[sid]
    s0 = scene_start
    t = s0 + lead
    for text, pause in clauses:
        key = hashlib.sha1(f"{text}|{ls}".encode()).hexdigest()[:16]
        cpath = f"{CACHE}/{key}.wav"
        if os.path.exists(cpath): x = sf.read(cpath, dtype="float32")[0]
        else:
            x = trim(V.synth(text_to_phonemes(text), length_scale=ls)); sf.write(cpath, x, SR)
        i = int(t * SR); track[i:i + len(x)] += x
        d = len(x) / SR
        timing["clauses"].append({"scene": sid, "text": text, "start": round(t, 3), "end": round(t + d, 3)})
        words = text.split()
        ww = word_weights(words); edges = np.concatenate([[0], np.cumsum(ww)]) / ww.sum()
        inner = 0.04  # trimmed padding at each edge
        for k, wd in enumerate(words):
            a = t + inner + edges[k] * (d - 2 * inner); b = t + inner + edges[k + 1] * (d - 2 * inner)
            timing["words"].append({"scene": sid, "text": wd, "start": round(a, 3), "end": round(b, 3)})
        t += d + pause
    s1 = round(t + tail, 2) if tail is not None else TOTAL
    timing["scenes"].append({"id": sid, "start": round(s0, 2), "end": s1, "voice_end": round(t, 2)})
    print(sid, "scene", round(s0, 2), "->", s1, "voice ends", round(t, 2))
    scene_start = s1

sf.write(OUT + "/voice_raw.wav", track, SR)
json.dump(timing, open(ROOT + "/video/assets/timing.json", "w"), ensure_ascii=False, indent=1)

# Master: deeper pitch (formants kept), warmth, presence, gentle compression, small room, -16 LUFS.
chain = ("aresample=48000,rubberband=pitch=0.92:formant=preserved:pitchq=quality,"
         "highpass=f=65,equalizer=f=140:t=q:w=1.0:g=3.5,equalizer=f=320:t=q:w=1.2:g=-1.5,"
         "equalizer=f=3200:t=q:w=1.2:g=2.5,equalizer=f=7000:t=q:w=2:g=-2,"
         "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,"
         "aecho=0.9:0.9:28|47:0.10|0.06,"
         "loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", OUT + "/voice_raw.wav", "-af", chain,
                "-ac", "2", "-t", str(TOTAL), OUT + "/voice.wav"], check=True)
print("written", OUT + "/voice.wav")
