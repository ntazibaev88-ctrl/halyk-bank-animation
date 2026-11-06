"""Build the narration track (voice.wav) and timing.json.

Voice profile v2 — a young (20–25) Russian documentary presenter:
Piper "Ruslan" (the most natural and expressive Russian male voice available
offline), spoken ~10 % faster than v1, then lifted +1 semitone toward a
younger timbre, with no bass boost, a presence lift and a light, dry room.

Every clause starts exactly where it started in the timeline the animation
was authored against (video/assets/timing_anim.json); a faster clause simply
leaves a longer pause after it. For each clause several takes are generated
and the most expressive take (pitch movement) that the Russian ASR model
transcribes word-for-word is kept."""
import json, re, hashlib, difflib, os, subprocess, numpy as np, soundfile as sf, sherpa_onnx
from ru_tts import Voice, text_to_phonemes
from narration import SCENES

ROOT = os.path.dirname(os.path.abspath(__file__)) + "/.."
OUT = ROOT + "/video/assets/audio"
CACHE = ROOT + "/scripts/voice_cache"; os.makedirs(CACHE, exist_ok=True)
TOTAL = 90.0
VOICE = "ruslan"
TAKES = 8
PACE = {"s1": 0.95, "s2": 1.03, "s3": 1.1, "s4": 1.08, "s5": 1.1, "s6": 1.14}  # Piper length_scale per scene
REF = json.load(open(ROOT + "/video/assets/timing_anim.json"))

V = Voice(VOICE); SR = V.sr
M = "/home/user/tts/sherpa-onnx-zipformer-ru-2024-09-18"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.onnx",
      joiner=f"{M}/joiner.int8.onnx", tokens=f"{M}/tokens.txt", num_threads=4)
norm = lambda s: re.sub(r"[^а-яё ]", "", s.lower().replace("ё", "е").replace("-", " ")).split()
# unstressed endings the recogniser cannot tell apart are not counted as errors
SAME = {"используют": "использует", "ожидание": "ожидания", "решение": "решения", "интерпретируют": "интерпретирует", "замечала": "замечал"}

def trim(x, thr=0.012, keep=0.03):
    idx = np.where(np.abs(x) > thr)[0]; k = int(keep * SR)
    return x[max(0, idx[0] - k):idx[-1] + k]
def asr_score(text, x):
    y = np.interp(np.arange(0, len(x), SR / 16000), np.arange(len(x)), x).astype(np.float32)
    s = rec.create_stream(); s.accept_waveform(16000, y); rec.decode_stream(s)
    hyp = [SAME.get(w, w) for w in norm(s.result.text)]
    return difflib.SequenceMatcher(None, [SAME.get(w, w) for w in norm(text)], hyp).ratio()
def pitch_var(x):
    fr, hop, f = int(0.04 * SR), int(0.01 * SR), []
    for i in range(0, len(x) - fr, hop):
        s = x[i:i + fr]
        if np.sqrt((s ** 2).mean()) < 0.03: continue
        s = s - s.mean(); ac = np.correlate(s, s, "full")[fr - 1:]
        lo, hi = int(SR / 320), int(SR / 65); k = lo + np.argmax(ac[lo:hi])
        if ac[k] > 0.35 * ac[0]: f.append(SR / k)
    f = np.array(f); return float((12 * np.log2(f / np.median(f))).std()) if len(f) > 5 else 0.0

def best_take(text, ls, max_dur):
    best = None
    for k in range(TAKES):
        key = hashlib.sha1(f"v2|{VOICE}|{text}|{ls:.3f}|{k}".encode()).hexdigest()[:16]
        p = f"{CACHE}/{key}.wav"
        if os.path.exists(p): x = sf.read(p, dtype="float32")[0]
        else: x = trim(V.synth(text_to_phonemes(text), length_scale=ls)); sf.write(p, x, SR)
        d = len(x) / SR
        score = 100 * asr_score(text, x) + pitch_var(x) - (50 if d > max_dur else 0)
        if not best or score > best[0]: best = (score, x)
    return best[1]

track = np.zeros(int(TOTAL * SR), np.float32)
ref_cl = REF["clauses"]; ci = 0
timing = {"scenes": REF["scenes"], "clauses": [], "words": []}
for sid, _a, _b, clauses in SCENES:
    scene = next(s for s in REF["scenes"] if s["id"] == sid)
    for j, (text, _pause) in enumerate(clauses):
        rc = ref_cl[ci]; assert rc["text"] == text, (rc["text"], text)
        nxt = ref_cl[ci + 1]["start"] if ci + 1 < len(ref_cl) and ref_cl[ci + 1]["scene"] == sid else scene["end"] - 0.25
        max_dur = min(nxt - rc["start"] - 0.1, (rc["end"] - rc["start"]) * 1.04)
        ls = PACE[sid]
        x = best_take(text, ls, max_dur)
        for _ in range(3):  # too long for its slot: speak it a little faster
            if len(x) / SR <= max_dur: break
            ls = round(ls * max_dur / (len(x) / SR) * 0.98, 3); x = best_take(text, ls, max_dur)
        i = int(rc["start"] * SR); track[i:i + len(x)] += x
        timing["clauses"].append({"scene": sid, "text": text, "start": rc["start"], "end": round(rc["start"] + len(x) / SR, 3)})
        print(f"{sid} {rc['start']:6.2f} {len(x)/SR:5.2f}s (was {rc['end']-rc['start']:5.2f}s, ls {ls}) {text}")
        ci += 1
# provisional word times (asr_check.py replaces them with recognised ones)
for c in timing["clauses"]:
    ws = c["text"].split(); n = len(ws)
    for k, w in enumerate(ws):
        timing["words"].append({"scene": c["scene"], "text": w, "start": round(c["start"] + (c["end"] - c["start"]) * k / n, 3), "end": round(c["start"] + (c["end"] - c["start"]) * (k + 1) / n, 3)})
sf.write(OUT + "/voice_raw.wav", track, SR)
json.dump(timing, open(ROOT + "/video/assets/timing.json", "w"), ensure_ascii=False, indent=1)

# Master: +1 semitone (younger timbre), no bass boost, presence + air, light compression, small dry room, -16 LUFS.
chain = ("aresample=48000,rubberband=pitch=1.0595:pitchq=quality,"
         "highpass=f=90,equalizer=f=180:t=q:w=1.0:g=-1.5,equalizer=f=400:t=q:w=1.2:g=-1.0,"
         "equalizer=f=3500:t=q:w=1.2:g=3.0,highshelf=f=9000:g=2.0,"
         "acompressor=threshold=-18dB:ratio=2.2:attack=10:release=150:makeup=1.5,"
         "aecho=0.85:0.9:18|31:0.05|0.03,"
         "loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", OUT + "/voice_raw.wav", "-af", chain,
                "-ac", "2", "-t", str(TOTAL), OUT + "/voice.wav"], check=True)
print("written", OUT + "/voice.wav")
