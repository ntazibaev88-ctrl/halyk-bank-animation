#!/usr/bin/env python3
"""Procedural audio: voice track assembly, cinematic-industrial music (ducked under VO),
machinery ambience and SFX stem.  Everything is synthesised (no licensed material).
Outputs -> audio/{voice,music,ambience,sfx}.wav (44.1 kHz mono 16-bit)."""
import json, os, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
T = json.load(open(f"{ROOT}/data/timing.json"))
TOTAL = T["total"] + 0.5
N = int(TOTAL * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)  # seeded: deterministic builds

def lp(x, f, o=2): return sosfilt(butter(o, f, "lp", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "hp", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], "bp", fs=SR, output="sos"), x)
def saw(f, tt): return 2 * ((f * tt) % 1.0) - 1
def write(name, x):
    x = np.clip(x, -1, 1)
    with wave.open(f"{ROOT}/audio/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
def put(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if i < len(buf): buf[i:j] += x[: j - i]
def env(n, a=0.01, r=0.2):
    e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def smooth_env(x, w=0.12):
    k = int(w * SR); return np.sqrt(np.maximum(fftconvolve(x * x, np.ones(k) / k, mode="same"), 0))
def sec(a, b): return (t >= a) & (t < b)

# ---------------- voice ----------------
voice = np.zeros(N)
for s in T["sentences"]:
    with wave.open(f"{ROOT}/voiceover/sentences/{s['key']}.wav") as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768.0
    put(voice, x * env(len(x), 0.02, 0.06), s["start"])
write("voice", voice * 0.95)

# ---------------- music ----------------
S = {s["id"]: s for s in T["scenes"]}
def midi(m): return 440 * 2 ** ((m - 69) / 12)
BPM = 96; beat = 60 / BPM; bar = 4 * beat
chords = [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])]  # Am F C G
mus = np.zeros(N)
nbars = int(TOTAL / bar) + 1
inten = np.interp(t, [0, 8, 13, 25, 40, 55, 69, 82, 96, 104, TOTAL], [0.35, 0.5, 0.55, 0.62, 0.72, 0.78, 0.74, 0.8, 0.95, 1.0, 0.6])
for b in range(nbars):
    root, notes = chords[(b // 2) % 4]
    t0 = b * bar
    n = int(bar * SR)
    if t0 >= TOTAL: break
    tt = np.arange(n) / SR
    # sub bass
    sub = np.sin(2 * np.pi * midi(root - 12) * tt) * 0.5 * env(n, 0.05, 0.4)
    # pad (detuned saws)
    pad = np.zeros(n)
    for m in notes:
        for d in (-0.15, 0.0, 0.15):
            pad += saw(midi(m + d / 12 * 12 * 0.01 + d * 0.1), tt + d)  # tiny detune
    pad = lp(pad / 9, 900) * 0.55 * env(n, 0.6, 0.8)
    # pulsing bass 8ths
    pb = np.zeros(n)
    for k in range(8):
        i = int(k * beat / 2 * SR); L = int(beat / 2 * SR)
        q = np.arange(L) / SR
        pb[i:i + L] += lp(saw(midi(root), q), 260) * np.exp(-q * 9) * 0.55
    seg = sub + pad + pb * np.interp(t0, [0, 12, 24], [0, 0.0, 1])
    put(mus, seg, t0)
# arpeggio (electronic, from scene 2)
arp = np.zeros(N)
for b in range(nbars):
    root, notes = chords[(b // 2) % 4]
    for k in range(8):
        at = b * bar + k * beat / 2
        if at < S[2]["start"] or at > TOTAL - 1: continue
        m = notes[[0, 1, 2, 1, 0, 2, 1, 2][k]] + 12
        q = np.arange(int(0.35 * SR)) / SR
        put(arp, lp(saw(midi(m), q), 2400) * np.exp(-q * 10) * 0.16, at)
dl = int(beat * 0.75 * SR)
arp = arp + np.concatenate([np.zeros(dl), arp[:-dl]]) * 0.45
mus += arp * np.clip((t - S[2]["start"]) / 4, 0, 1)
# kick + hat pulse
kick = np.zeros(N); hat = np.zeros(N)
q = np.arange(int(0.4 * SR)) / SR
kk = np.sin(2 * np.pi * (45 + 90 * np.exp(-q * 25)) * q) * np.exp(-q * 8) * 0.9
hh = hp(rng.standard_normal(int(0.06 * SR)), 7000) * np.exp(-np.arange(int(0.06 * SR)) / SR * 70) * 0.12
for k in range(int(TOTAL / beat)):
    at = k * beat
    if at >= S[2]["start"] + 1: put(kick, kk, at); put(hat, hh, at + beat / 2)
mus += kick * 0.55 + hat
# opening: riser tension
rs = sec(0, 8)
ris = lp(rng.standard_normal(N), 4000) * np.where(rs, (t / 8) ** 2.2, 0) * 0.35
mus += ris
mus *= inten
# final swell + impact (hit at final title)
FT = S[8]["start"] + 6.6
q = np.arange(int(4.5 * SR)) / SR
imp = (np.sin(2 * np.pi * (38 + 70 * np.exp(-q * 6)) * q) * np.exp(-q * 1.1) * 1.0
       + lp(rng.standard_normal(len(q)), 1800) * np.exp(-q * 2.2) * 0.5)
put(mus, imp, FT)
sw = sec(FT - 3.5, FT)
mus += lp(saw(110, t) + saw(110.7, t) + saw(165, t), 1500) * np.where(sw, ((t - (FT - 3.5)) / 3.5) ** 2, 0) * 0.2
# final fade
mus *= np.clip((TOTAL - t) / 2.5, 0, 1)
# ducking under narration
ve = smooth_env(voice, 0.15); ve = ve / (ve.max() + 1e-9)
duck = 1 - 0.62 * np.clip(ve * 4, 0, 1)
duck = lp(duck, 6, 1)
mus = hp(mus, 28) * duck
mus = mus / np.abs(mus).max() * 0.5
write("music", mus)

# ---------------- ambience ----------------
amb = np.zeros(N)
hum = np.sin(2 * np.pi * 50 * t) * 0.35 + np.sin(2 * np.pi * 100 * t) * 0.2 + np.sin(2 * np.pi * 150 * t + 1) * 0.08
rum = lp(rng.standard_normal(N), 160) * 2.2
air = bp(rng.standard_normal(N), 600, 2200) * 0.05
amb = hum + rum + air
# machinery thump (turbine-ish rhythm) louder in turbine/aux scenes
mach = np.zeros(N)
ph = np.sin(2 * np.pi * 7.5 * t)
mach = lp(rng.standard_normal(N), 300) * (0.5 + 0.5 * ph) * 0.35
lvl = np.interp(t, [0, 24, S[4]["start"], S[6]["start"], S[7]["start"], S[8]["start"], TOTAL],
                [0.7, 0.8, 1.0, 0.8, 0.6, 0.8, 0.5])
amb = (amb + mach * lvl) * lvl
amb *= np.clip(t / 1.5, 0, 1) * np.clip((TOTAL - t) / 2, 0, 1)
amb = amb / np.abs(amb).max() * 0.45
write("ambience", amb)

# ---------------- SFX ----------------
sfx = np.zeros(N)
def siren(at, dur, f1=620, f2=880, rate=2.2, g=0.28):
    q = np.arange(int(dur * SR)) / SR
    f = np.where(np.sin(2 * np.pi * rate * q) > 0, f1, f2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = lp(np.sign(np.sin(ph)) * 0.6 + np.sin(ph) * 0.4, 3000) * g * env(len(q), 0.02, 0.15)
    put(sfx, x, at)
def steam(at, dur, g=0.35):
    q = np.arange(int(dur * SR)) / SR
    x = hp(lp(rng.standard_normal(len(q)), 9000), 2500) * g * np.exp(-q * 1.6 / max(dur, .1)) * env(len(q), 0.02, dur * 0.5)
    put(sfx, x, at)
def beep(at, f=1760, d=0.09, g=0.18, n=1, gap=0.14):
    for k in range(n):
        q = np.arange(int(d * SR)) / SR
        put(sfx, np.sin(2 * np.pi * f * q) * g * env(len(q), 0.004, 0.03), at + k * gap)
def clunk(at, g=0.5):
    q = np.arange(int(0.35 * SR)) / SR
    x = (np.sin(2 * np.pi * 95 * q) * np.exp(-q * 14) + lp(rng.standard_normal(len(q)), 1200) * np.exp(-q * 40) * 0.8
         + np.sin(2 * np.pi * 420 * q) * np.exp(-q * 30) * 0.3)
    put(sfx, x * g, at)
def whoosh(at, dur=0.9, g=0.3):
    q = np.arange(int(dur * SR)) / SR
    x = bp(rng.standard_normal(len(q)), 300, 3500) * np.sin(np.pi * q / dur) ** 2 * g
    put(sfx, x, at)
def spool(at, dur, f0=40, f1=380, g=0.2):
    q = np.arange(int(dur * SR)) / SR
    f = f0 + (f1 - f0) * (q / dur) ** 1.6
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)) * 0.5
    x += hp(rng.standard_normal(len(q)), 3000) * 0.08 * (q / dur)
    put(sfx, x * g * env(len(q), 0.4, 0.8), at)
def hum_zap(at, dur, g=0.12):
    q = np.arange(int(dur * SR)) / SR
    put(sfx, (np.sin(2 * np.pi * 100 * q) + 0.4 * rng.standard_normal(len(q)) * np.sin(2 * np.pi * 50 * q) ** 2) * g * env(len(q), 0.05, 0.3), at)

a = {i: S[i]["start"] for i in S}
# Scene 1 hook
for k, at in enumerate([0.8, 1.9, 3.0, 3.9]): beep(at, 1320 + 220 * k, n=1, g=0.14)
steam(1.2, 1.4, .3); steam(3.2, 1.6, .3)
whoosh(0.2, 1.2, .25); whoosh(2.5, 1.0, .25)
siren(4.6, 3.6)
q = np.arange(int(1.6 * SR)) / SR
put(sfx, (np.sin(2 * np.pi * (60 + 80 * np.exp(-q * 14)) * q) * np.exp(-q * 3.2) * 0.9), 6.3)
# Scene 2
whoosh(a[2] + 0.3, 1.0, .3); beep(a[2] + 3.0, 1568, n=3, g=0.12); whoosh(a[2] + 5.0, .8, .22)
# Scene 3 boiler
steam(a[3] + 3.5, 2.5, .35); beep(a[3] + 6.5, 1400, n=2, g=.14); steam(a[3] + 9.5, 2.5, .3); beep(a[3] + 11.5, 1900, n=1, g=.12)
# Scene 4 turbine
steam(a[4] + 0.5, 1.8, .35); spool(a[4] + 1.2, 11.0, 35, 360, .2); hum_zap(a[4] + 8.5, 6.0, .12)
# Scene 5 aux
for k, off in enumerate([0.9, 2.8, 4.8, 6.6, 8.4, 10.2, 12.0]):
    whoosh(a[5] + off - 0.25, 0.5, .2); beep(a[5] + off + 0.15, 1500 + 120 * k, n=1, g=.11)
clunk(a[5] + 3.1); steam(a[5] + 5.6, 1.5, .3)
# Scene 6 safety
siren(a[6] + 2.4, 2.2, 700, 940, 3.0, .18); clunk(a[6] + 6.1); clunk(a[6] + 8.3, .6); beep(a[6] + 9.6, 1000, n=2, g=.14)
# Scene 7 operator
for k in range(6): beep(a[7] + 1.0 + k * 1.9, 1800, n=1, g=.09)
beep(a[7] + 6.5, 1250, n=3, g=.12)
# Scene 8 final
whoosh(a[8] + 0.3, 1.5, .3); steam(a[8] + 2.0, 2.2, .25); whoosh(FT - 0.6, 0.9, .35)
sfx = sfx / max(1e-9, np.abs(sfx).max()) * 0.7
write("sfx", sfx)

# preview mix + loudness sanity check
mix = voice * 1.0 + mus * 0.6 + amb * 0.35 + sfx * 0.55
print("peak", round(float(np.abs(mix).max()), 2), "voice rms", round(float(np.sqrt((voice**2).mean())), 3),
      "music rms", round(float(np.sqrt(((mus*.6)**2).mean())), 3))
