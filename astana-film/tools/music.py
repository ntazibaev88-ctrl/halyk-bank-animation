"""Original score for the film, synthesised from scratch (no samples, no existing melodies):
string pad, dombra-style plucked ostinato (Karplus-Strong), bowed lead phrases between the
narration blocks, soft frame drum on scene changes, quiet city ambience, and a finale swell.
The bed is pre-ducked under the voiceover using the word clock from tools/timing.json.
Usage: python3 tools/music.py  -> assets/audio/music.mp3"""
import json, os, subprocess
import numpy as np
from scipy.signal import lfilter, butter, fftconvolve
from scipy.io import wavfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
timing = json.load(open(f"{ROOT}/tools/timing.json", encoding="utf-8"))
TOTAL = sum(s["dur"] for s in timing.values())
N = int(TOTAL * SR)
rng = np.random.default_rng(1997)
BAR, BEAT, STEP = 3.0, 0.75, 0.1875
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
L, R = np.zeros(N + SR * 6), np.zeros(N + SR * 6)
def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i < 0: sig = sig[-i:]; i = 0
    sig = sig[: max(0, len(L) - i)]; n = len(sig); pan = float(np.clip(pan, -0.9, 0.9))
    L[i:i + n] += sig * gain * np.sqrt(0.5 * (1 - pan)); R[i:i + n] += sig * gain * np.sqrt(0.5 * (1 + pan))
def lp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "high"); return lfilter(b, a, x)

scene_starts = [s["start"] for s in timing.values()]
FIN = timing["s8"]["start"]
# harmony: two bars per chord, D minor; the finale lifts to D major
CH = {"Dm": [38, 45, 50, 53, 57, 62], "Bb": [34, 41, 46, 50, 53, 58], "F": [29, 41, 48, 53, 57, 60], "C": [36, 43, 48, 52, 55, 60],
      "Gm": [31, 43, 46, 50, 55, 58], "D": [38, 45, 50, 54, 57, 62, 66]}
LOOP = ["Dm", "Dm", "Bb", "Bb", "F", "F", "C", "C", "Dm", "Dm", "Gm", "Gm", "Bb", "Bb", "C", "C"]
nbars = int(np.ceil(TOTAL / BAR)) + 1
fin_bar = int(round(FIN / BAR))
chords = [LOOP[b % 16] for b in range(nbars)]
for k, c in enumerate(["Dm", "Bb", "C", "D", "D", "D"]):
    if fin_bar + k < nbars: chords[fin_bar + k] = c

def energy(t):  # arrangement curve 0..1
    if t < timing["s2"]["start"]: return 0.55
    if t >= FIN: return 0.85 + 0.15 * min(1, (t - FIN) / 8)
    return 0.7

# --- string pad ---
def pad_note(m, dur, bright):
    n = int((dur + 2.2) * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for det in (-5, 4):
        f = hz(m) * 2 ** (det / 1200); vib = 1 + 0.003 * np.sin(2 * np.pi * 4.6 * t + rng.uniform(0, 6))
        ph = 2 * np.pi * np.cumsum(f * vib) / SR + rng.uniform(0, 6)
        for h in range(1, 7): out += np.sin(h * ph) / h ** (2.1 - bright)
    env = np.minimum(1, t / 1.1) * np.minimum(1, np.maximum(0, (dur + 2.2 - t) / 2.0))
    return out * env
for b in range(nbars):
    if b % 2 and chords[b] == chords[b - 1]: continue
    span = BAR * (2 if b + 1 < nbars and chords[b + 1] == chords[b] else 1)
    t0 = b * BAR; e = energy(t0)
    for i, m in enumerate(CH[chords[b]]):
        if t0 < FIN and i >= 5: continue
        add(pad_note(m, span, 0.5 * e), t0 - 0.5, 0.05 * e * (1.3 if i == 0 else 1), pan=(-0.6 + 0.3 * i))
    add(pad_note(CH[chords[b]][0] - 12, span, 0.0), t0 - 0.5, 0.09)   # bass
    if t0 >= FIN:
        for m in CH[chords[b]][3:]: add(pad_note(m + 12, span, 0.8), t0 - 0.5, 0.03, pan=0.3)

# --- dombra ostinato (Karplus-Strong) ---
ks_cache = {}
def pluck(m, dur=0.9):
    if m in ks_cache: return ks_cache[m]
    P = int(SR / hz(m)); n = int(dur * SR)
    x = np.zeros(n); x[:P] = lp(rng.uniform(-1, 1, P), 5200)
    a = np.zeros(P + 2); a[0] = 1; a[P] = -0.498; a[P + 1] = -0.498
    y = lfilter([1], a, x) * np.exp(-np.arange(n) / SR * 3.0)
    ks_cache[m] = y; return y
GALLOP = [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1]
for b in range(nbars):
    t0 = b * BAR
    if t0 < timing["s2"]["start"] - 0.01 or t0 > FIN + 9: continue
    root = CH[chords[b]][1]  # around A2..G3
    seq = [root, root + 7, root + 12, root + 7]
    for s in range(16):
        if not GALLOP[s]: continue
        acc = 1.0 if s % 4 == 0 else 0.55
        m = seq[(s // 4) % 4] if s % 4 == 0 else (root + 12 if s % 4 == 2 else root + 7)
        add(pluck(m), t0 + s * STEP, 0.085 * acc, pan=-0.25)
        if s % 4 == 0: add(pluck(m + 7), t0 + s * STEP + 0.012, 0.05, pan=-0.15)  # two-string fifth

# --- bowed lead (qobyz-like) in the gaps between narration blocks ---
def bow(m, dur):
    n = int((dur + 0.5) * SR); t = np.arange(n) / SR
    vib = 1 + 0.006 * np.minimum(1, t / 0.5) * np.sin(2 * np.pi * 5.2 * t)
    ph = 2 * np.pi * np.cumsum(hz(m) * vib) / SR
    x = sum(np.sin(h * ph) / h ** 1.25 for h in range(1, 10))
    env = np.minimum(1, t / 0.14) * np.minimum(1, np.maximum(0, (dur + 0.5 - t) / 0.5))
    return lp(x, 2600) * env
PENT = [62, 65, 67, 69, 72, 74, 77]  # D minor pentatonic
def phrase(t0, idx, gain=0.06):
    shapes = [[3, 4, 5, 4], [5, 4, 3, 1], [1, 2, 3, 5], [4, 3, 2, 3], [3, 5, 6, 5], [5, 3, 4, 2], [2, 3, 5, 4]]
    durs = [0.375, 0.375, 0.75, 1.1]
    t = t0
    for k, d in zip(shapes[idx % len(shapes)], durs):
        add(bow(PENT[k], d), t, gain, pan=0.2); t += d
phrase(0.1, 0, 0.07)
for i, st in enumerate(scene_starts[1:]):
    phrase(st - 1.3, i + 1)
# finale melody over the major lift
for k, (m, d) in enumerate([(69, 0.75), (74, 0.75), (78, 1.5), (76, 0.75), (74, 0.75), (78, 3.0)]):
    add(bow(m, d), (fin_bar + 3) * BAR - 1.5 + sum(x for _, x in [(69, 0.75), (74, 0.75), (78, 1.5), (76, 0.75), (74, 0.75), (78, 3.0)][:k]), 0.075, pan=0.1)

# --- frame drum on scene changes, soft shaker, finale swell ---
def drum(f0=92):
    n = int(0.9 * SR); t = np.arange(n) / SR
    f = 46 + (f0 - 46) * np.exp(-t * 18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) + 0.25 * lp(rng.normal(0, 1, n), 900) * np.exp(-t * 30)
for st in scene_starts[1:]:
    add(drum(), st, 0.5); add(drum(70), st + 0.375, 0.22)
tick = hp(rng.normal(0, 1, int(0.05 * SR)), 6000) * np.exp(-np.arange(int(0.05 * SR)) / SR * 90)
for s in range(int(TOTAL / (STEP * 2))):
    t = s * STEP * 2
    if timing["s3"]["start"] <= t < FIN: add(tick, t, 0.02 if s % 2 else 0.035, pan=0.5)
sw_t = FIN + 8.0
n = int(4.5 * SR); t = np.arange(n) / SR
add(hp(rng.normal(0, 1, n), 3500) * (t / 4.5) ** 3, sw_t - 4.5, 0.09)
n = int(4 * SR); t = np.arange(n) / SR
add(hp(rng.normal(0, 1, n), 4500) * np.exp(-t * 1.3), sw_t, 0.1); add(drum(110), sw_t, 0.75)

# --- reverb ---
irn = int(2.6 * SR); it = np.arange(irn) / SR
def reverb(x, seed):
    ir = np.random.default_rng(seed).normal(0, 1, irn) * np.exp(-it * 2.6); ir = lp(ir, 5000)
    return fftconvolve(x, ir)[: len(x)] / 28
L2, R2 = L + 0.55 * reverb(L, 1), R + 0.55 * reverb(R, 2)

# --- quiet city ambience (after reverb, stays dry) ---
amb = lp(rng.normal(0, 1, len(L2)), 700, 2); amb *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * np.arange(len(L2)) / SR)
L2 += amb * 0.012; R2 += np.roll(amb, 4000) * 0.012

# --- duck under the narrator, fades, limiter ---
g = np.ones(len(L2))
for s in timing.values():
    a = int((s["start"] + s["words"][0]["t"] - 0.25) * SR); b = int((s["start"] + s["words"][-1]["e"] + 0.3) * SR)
    g[a:b] = 0.32
k = int(0.5 * SR); g = np.convolve(g, np.hanning(k) / np.hanning(k).sum(), "same")
out = np.stack([L2, R2], 1)[:N] * g[:N, None]
fade = np.ones(N); f = int(2.6 * SR); fade[-f:] = np.linspace(1, 0, f) ** 1.5; fade[: int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
out *= fade[:, None]
out = np.tanh(out / np.abs(out).max() * 1.6) / np.tanh(1.6) * 0.84
wavfile.write(f"{ROOT}/tools/music.wav", SR, (out * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{ROOT}/tools/music.wav", "-b:a", "192k", f"{ROOT}/assets/audio/music.mp3"], check=True)
os.remove(f"{ROOT}/tools/music.wav")
print("music", TOTAL, "s")
