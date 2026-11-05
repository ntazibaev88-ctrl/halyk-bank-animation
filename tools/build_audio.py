#!/usr/bin/env python3
"""Procedural score + sound design (numpy only, no samples needed).

Writes audio/music.wav (ducked under the narration) and audio/sfx.wav, both 48 kHz stereo,
timed to script/timing.json.  Every cue below mirrors an animation cue in src/scenes/*.html.
"""
import json, os, subprocess, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
T = json.load(open(f"{ROOT}/script/timing.json"))
TOTAL = T["duration"]
N = int((TOTAL + 1.0) * SR)
S = {s["id"]: s["start"] for s in T["scenes"]}
DUR = {s["id"]: s["duration"] for s in T["scenes"]}
CHS = {}
for c in T["chunks"]:
    CHS.setdefault(c["scene"], []).append((round(c["start"] - S[c["scene"]], 3), round(c["end"] - S[c["scene"]], 3)))
def CH(sc, i): return S[sc] + CHS[sc][i][0]
def CE(sc, i): return S[sc] + CHS[sc][i][1]
def A(sc, rel): return S[sc] + rel

rs = np.random.RandomState(2045)

# ------------------------------------------------------------------ primitives
def tt(d): return np.arange(int(d * SR)) / SR
def noise(d): return rs.uniform(-1, 1, int(d * SR)).astype(np.float32)
def lp(x, fc):
    """one-pole low-pass; fc scalar or per-sample array (Hz)"""
    fc = np.broadcast_to(np.asarray(fc, dtype=np.float32), x.shape)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y
def hp(x, fc): return x - lp(x, fc)
def env(d, a=.005, dec=8.0):
    t = tt(d); e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t * dec); return e.astype(np.float32)
def fade(x, a=.01, r=.05):
    n = len(x); e = np.ones(n, dtype=np.float32); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return x * e
def sine(f, d, ph=0): return np.sin(2 * np.pi * f * tt(d) + ph).astype(np.float32)
def saw(f, d):
    t = tt(d); return (2 * ((t * f) % 1) - 1).astype(np.float32)
def sweep(f0, f1, d, expo=True):
    t = tt(d); k = t / d
    f = f0 * (f1 / f0) ** k if expo else f0 + (f1 - f0) * k
    return np.sin(2 * np.pi * np.cumsum(f) / SR).astype(np.float32)

class Bus:
    def __init__(self): self.b = np.zeros((N, 2), dtype=np.float32)
    def add(self, x, at, g=1.0, pan=0.0):
        i = int(at * SR)
        if i >= N or i + len(x) <= 0: return
        if i < 0: x = x[-i:]; i = 0
        x = x[: N - i]
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.b[i:i + len(x), 0] += x * g * l * 1.414; self.b[i:i + len(x), 1] += x * g * r * 1.414
def reverb(b, secs, wet, seed=7):
    r = np.random.RandomState(seed); n = int(secs * SR)
    ir = (r.uniform(-1, 1, (n, 2)) * np.exp(-np.arange(n) / SR * (6.9 / secs))[:, None]).astype(np.float32)
    ir = np.stack([lp(ir[:, 0], 5000), lp(ir[:, 1], 5000)], 1)
    out = np.zeros_like(b); m = len(b) + n
    for c in range(2):
        F = np.fft.rfft(b[:, c], m) * np.fft.rfft(ir[:, c], m)
        out[:, c] = np.fft.irfft(F, m)[: len(b)]
    out *= wet / (np.abs(out).max() + 1e-9) * np.abs(b).max()
    return b * (1 - wet * .35) + out

# ------------------------------------------------------------------ SFX vocabulary
def click(): return fade(noise(.02) * env(.02, .0005, 160), 0, .005)
def blip(f=1200, d=.14, g=1): return fade(sine(f, d) * env(d, .004, 22), 0, .01) * g
def chirp(f0=700, f1=2400, d=.18): return fade(sweep(f0, f1, d) * env(d, .006, 9), 0, .02)
def whoosh(d=1.0, f0=300, f1=6000):
    k = tt(d) / d
    fc = f0 * (f1 / f0) ** np.sin(np.pi * k)          # filter opens then closes
    y = lp(noise(d), np.clip(fc, 80, 12000)) * np.sin(np.pi * k) ** 1.6
    return y.astype(np.float32)
def riser(d=1.2, f0=200, f1=9000):
    x = noise(d); k = tt(d) / d; y = lp(x, f0 * (f1 / f0) ** k) * (k ** 2.2)
    y += .35 * sweep(180, 900, d) * k ** 3
    return fade(y.astype(np.float32), .02, .01)
def impact(d=1.6, f=48):
    t = tt(d)
    ph = 2 * np.pi * np.cumsum(f * (1 + 2.2 * np.exp(-t * 18))) / SR
    body = np.sin(ph) * np.exp(-t * 3.2)
    air = lp(noise(d), 1800) * np.exp(-t * 6) * .5 + hp(noise(d), 4000) * np.exp(-t * 14) * .25
    return fade((body + air).astype(np.float32), 0, .1)
def servo(d=.9, f0=140, f1=260):
    x = sweep(f0, f1, d, False) * .5 + saw(f0 * 2.01, d) * .12
    x = lp(x + noise(d) * .05, 1800) * np.sin(np.pi * np.clip(tt(d) / d, 0, 1)) ** .7
    return fade(x.astype(np.float32), .03, .06)
def crackle(d=.4):
    x = noise(d) * (rs.uniform(0, 1, int(d * SR)) > .985); return hp(x.astype(np.float32), 2000) * env(d, .001, 7) * 3
def thump(f=55, d=.35, g=1):
    t = tt(d); ph = 2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t * 30))) / SR; return (np.sin(ph) * np.exp(-t * 9) * g).astype(np.float32)
def chime(f=880, d=1.4, g=1):
    t = tt(d); x = (sine(f, d) + .5 * sine(f * 2.01, d) + .25 * sine(f * 3.99, d) + .12 * sine(f * 5.4, d)) * np.exp(-t * 3.4) * np.minimum(1, t / .003)
    return (x * .35 * g).astype(np.float32)
def glitch(d=.5):
    x = noise(d); steps = (np.floor(tt(d) * 40) % 3 == 0)
    return (hp(x, 1500) * steps * env(d, .001, 2.5)).astype(np.float32) + sine(90, d) * .3 * steps

sfx = Bus()
R = lambda lo, hi: lo + (hi - lo) * rs.rand()

# ---- transitions between scenes
bounds = [S[f"scene{i}"] for i in range(2, 10)]
for b in bounds:
    sfx.add(riser(1.0), b - 1.0, .55)
    sfx.add(whoosh(.9), b - .55, .8)
    sfx.add(impact(1.8), b - .02, 1.0 if b != S["scene9"] else .9)
    sfx.add(hp(noise(.6), 3000) * env(.6, .001, 8), b - .02, .25)

# ---- scene 1: the clock, the city waking
for k in range(13): sfx.add(click() * (1 + .6 * k / 13), .18 + k * .125, .5 + .04 * k, pan=-.2 + .03 * k)
sfx.add(chime(1318, 2.4, 1), 1.74, .9); sfx.add(impact(2.4, 40), 1.74, 1.0); sfx.add(riser(1.6, 150, 5000), .15, .35)
for k in range(26): sfx.add(blip(rs.choice([880, 1175, 1568, 1760, 2093]), .16, .35), A("scene1", 2.2 + k * .17 + R(0, .08)), .2, pan=R(-.8, .8))
sfx.add(whoosh(1.2, 400, 7000), CH("scene1", 1) - .5, .55)

# ---- scene 2: smart home
sc = "scene2"
sfx.add(servo(1.1, 90, 170), A(sc, .55), .5); sfx.add(servo(1.1, 90, 170), A(sc, .6), .35, pan=.5)
sfx.add(chirp(500, 1800, .5), A(sc, .9), .35)
for i in range(5): sfx.add(click(), CH(sc, 1) + .15 + i * .32, .8, pan=-.5 + i * .25); sfx.add(blip(440 * 2 ** (i / 5), .25, .6), CH(sc, 1) + .17 + i * .32, .25, pan=-.5 + i * .25)
for t in (A(sc, 1.2), CH(sc, 1) + .1, CH(sc, 2) + .6): sfx.add(chirp(600, 2600, .25), t, .4); sfx.add(blip(1760, .2, 1), t + .25, .3)
sfx.add(servo(1.0, 120, 220), CH(sc, 2) - .8, .45, pan=.6); sfx.add(servo(1.0, 120, 220), CH(sc, 2) + 1.9, .45, pan=.6); sfx.add(servo(1.1, 220, 120), CH(sc, 2) + 3.6, .4, pan=.6)
sfx.add(lp(noise(1.2), 900) * (np.sin(tt(1.2) * 70) * .3 + .7) * np.sin(np.pi * tt(1.2) / 1.2), CH(sc, 2) - .2, .35, pan=.3)
sfx.add(chime(1568, 1.2, .9), CH(sc, 2) + 1.2, .5, pan=.3)
sfx.add(blip(990, .18), CH(sc, 3) + .4, .3); sfx.add(blip(1320, .25), CH(sc, 3) + .55, .3)

# ---- scene 3: autonomous transport
sc = "scene3"; SW = CH(sc, 2) - .25
car = lp(saw(46, SW + 1), 260) * .5 + sine(92, SW + 1) * .25; car *= (1 + .08 * np.sin(2 * np.pi * 7 * tt(SW + 1)))
sfx.add(fade(car.astype(np.float32), 1.0, .4), S[sc] + .1, .4)
for k in range(4): sfx.add(whoosh(.7, 500, 5000), A(sc, 1.6 + k * 2.1), .35, pan=R(-.5, .5))
for k in range(8): sfx.add(chirp(900 + k * 80, 2400, .12), CH(sc, 1) + .1 + k * .38, .32, pan=.4 - k * .1)
sfx.add(whoosh(.9, 300, 4000), SW - .2, .7); sfx.add(thump(60, .5), SW, .5)
sfx.add(sweep(300, 2400, 3.0) * np.linspace(0, 1, int(3 * SR)).astype(np.float32) * .12, SW + 1.0, 1.0)
for k in range(6): sfx.add(blip(1200 + 140 * k, .15), SW + .6 + k * .12, .25)
sfx.add(chime(1046, 1.8), S[sc] + DUR[sc] - 1.3, .5); sfx.add(chime(1568, 1.8), S[sc] + DUR[sc] - 1.15, .4)

# ---- scene 4: robots & work
sc = "scene4"; t0 = CH(sc, 1) - .3
for t, x in [(t0, 1), (t0 + 1.6, 1), (t0 + 3.1, 1), (t0 + 4.3, 1)]: sfx.add(servo(.9, 130, 240), t, .5, pan=-.4)
for t in (t0 + .8, t0 + 2.4, t0 + 3.8, t0 + 5.0): sfx.add(servo(.9, 240, 130), t, .5, pan=.4)
for t in (t0 + 1.0, t0 + 1.8, t0 + 2.5, t0 + 3.4, t0 + 4.2): sfx.add(crackle(.5), t, .7, pan=R(-.5, .5)); sfx.add(chirp(2400, 4800, .08), t, .15)
for k in range(int(DUR[sc] / .42)): sfx.add(click() * .9, A(sc, .2 + k * .42), .35, pan=-.3 if k % 2 else .3); sfx.add(thump(110, .08, .5), A(sc, .2 + k * .42), .25)
sfx.add(lp(noise(DUR[sc]), 300) * .25, S[sc], .35)
for t in (CH(sc, 3) - .1, CH(sc, 2) + .1): sfx.add(chirp(700, 2000, .2), t, .35); sfx.add(blip(1568, .3), t + .22, .3)

# ---- scene 5: medicine
sc = "scene5"
for k in range(int((DUR[sc] - 1) / .83)): sfx.add(blip(1100, .08, 1), A(sc, 1.0 + k * .83), .22, pan=.6); sfx.add(thump(70, .2, .6), A(sc, .9 + k * .83), .2)
sfx.add(sweep(300, 1800, 3.2) * np.sin(np.pi * tt(3.2) / 3.2) * .12, A(sc, .6), 1.0)
for t in (CH(sc, 1) - .3, CH(sc, 2) + .5): sfx.add(chirp(600, 2600, .25), t, .4); sfx.add(blip(1760, .2), t + .25, .3)
for k in range(6): sfx.add(blip(1320 + (k % 3) * 220, .1), CH(sc, 1) + 2.0 + k * .1, .25)
sfx.add(chime(1245, 1.4), CH(sc, 2) - .2, .45)
sfx.add(servo(1.2, 100, 240), CH(sc, 3) - .6, .5, pan=-.5); sfx.add(servo(1.2, 100, 240), CH(sc, 3) - .4, .5, pan=.5)
sfx.add(hp(noise(1.6), 2500) * (np.sin(tt(1.6) * 140) > 0) * .3 * env(1.6, .01, 1.2), CH(sc, 3) + .8, .35)
sfx.add(chime(1318, 2.0), CH(sc, 3) + 1.4, .7); sfx.add(chime(1975, 2.0), CH(sc, 3) + 1.55, .5)

# ---- scene 6: education
sc = "scene6"
for k in range(6): sfx.add(thump(70 + 6 * k, .5, 1.2), CH(sc, 0) + 1.2 + k * .12, .25, pan=-.6 + k * .24)
sfx.add(whoosh(1.4, 200, 6000), CH(sc, 0) + 1.2, .6)
sfx.add(sweep(180, 1400, 1.6) * np.sin(np.pi * tt(1.6) / 1.6) * .22, CH(sc, 0) + 1.5, 1.0)
sfx.add(chime(784, 2.2), CH(sc, 0) + 1.7, .5); sfx.add(chime(1175, 2.2), CH(sc, 0) + 1.85, .4)
fl = 0
for t in np.arange(CH(sc, 1), S[sc] + DUR[sc] - .5, .55):
    if fl % 3 == 0: sfx.add(glitch(.08), t, .2, pan=.5)
    fl += 1
for t in (CH(sc, 1) - .4, CH(sc, 1) + .4, CH(sc, 2) + .2): sfx.add(chirp(700, 2400, .22), t, .4); sfx.add(blip(1568, .22), t + .22, .3)
sfx.add(chime(1568, 1.6), CH(sc, 3) + .3, .4)

# ---- scene 7: energy
sc = "scene7"
wind = lp(noise(DUR[sc]), 500 + 300 * np.sin(2 * np.pi * .35 * tt(DUR[sc]))) * (.6 + .4 * np.sin(2 * np.pi * .5 * tt(DUR[sc]))); sfx.add(fade(wind.astype(np.float32), 1, .5), S[sc], .65)
for i, t in enumerate((.1, 1.1, 2.0)): sfx.add(chirp(800, 2800, .22), CH(sc, 1) + t, .45, pan=[-.6, .6, 0][i]); sfx.add(chime(1046 * 2 ** (i / 3), 1.0), CH(sc, 1) + t + .2, .35)
for i in range(7):
    sfx.add(chirp(300, 3200, .35) * (1 + .5 * (i % 2)), CH(sc, 2) - .1 + i * .2, .4, pan=-.6 + .2 * i); sfx.add(crackle(.25), CH(sc, 2) - .1 + i * .2, .4, pan=-.6 + .2 * i)
sfx.add(sine(120, 3.0) * np.linspace(0, 1, int(3 * SR)).astype(np.float32) * .2, CH(sc, 2), 1.0)
sfx.add(chirp(600, 2400, .3), CH(sc, 2) + .4, .4); sfx.add(chime(1318, 2.4), CH(sc, 3) + 2.0, .6); sfx.add(chime(1975, 2.4), CH(sc, 3) + 2.2, .4)

# ---- scene 8: the dark side
sc = "scene8"
dark = (saw(41.2, DUR[sc]) * .3 + saw(43.6, DUR[sc]) * .25 + sine(87, DUR[sc]) * .2) * (1 + .4 * np.sin(2 * np.pi * 5 * tt(DUR[sc])))
sfx.add(fade(lp(dark.astype(np.float32), 240), 1, .5), S[sc], .75)
for k in range(int(DUR[sc] / .95)): sfx.add(thump(52, .5, 1.3), A(sc, .4 + k * .95), .5); sfx.add(thump(52, .5, 1.0), A(sc, .4 + k * .95 + .26), .35)
for t in (CH(sc, 1) + .1, CH(sc, 1) + .7, CH(sc, 2) + .3, CH(sc, 3) + .5): sfx.add(blip(220, .3, 1) + blip(233, .3, 1), t, .5, pan=R(-.5, .5)); sfx.add(chirp(2000, 600, .2), t - .02, .25)
sfx.add(chirp(400, 3000, 1.2) * .6, CH(sc, 1) - .8, .35)
G = CE(sc, 2) + .12
for k in range(3): sfx.add(glitch(.32), G + k * .1, .7, pan=R(-1, 1))
sfx.add(impact(1.0, 38), G, .7); sfx.add(sine(60, .7) * np.exp(-tt(.7) * 4), G + .1, .4)
for k in range(10): sfx.add(blip(rs.choice([1500, 2200, 3100]), .06), A(sc, 1.2 + k * .35 + R(0, .1)), .15, pan=R(-1, 1))

# ---- scene 9: the dramatic finale
sc = "scene9"
T_VANISH = CE(sc, 1) + .55; T_ZOOM = T_VANISH + .35; T_EYE = CH(sc, 3) - .5; T_UI = CH(sc, 3) + .2; T_END = CE(sc, 3) + 1.2
hum = (sine(200, T_VANISH - S[sc]) * .1 + sine(300.7, T_VANISH - S[sc]) * .08) * (1 + .5 * np.sin(2 * np.pi * 6 * tt(T_VANISH - S[sc])))
sfx.add(fade(hum.astype(np.float32), .8, .05), S[sc], .4)
for k in range(10): sfx.add(blip(rs.choice([1568, 2093, 2637, 3136]), .1), A(sc, .4 + k * .28), .18, pan=R(-1, 1))
for k in range(5): sfx.add(glitch(.12), CH(sc, 1) + .2 + k * .4, .3, pan=R(-1, 1))
sfx.add(sweep(1400, 40, .55) * env(.55, .003, 3.5), T_VANISH, .9); sfx.add(impact(2.8, 34), T_VANISH + .26, 1.1)
sfx.add(hp(noise(.3), 3000) * env(.3, .001, 20), T_VANISH + .26, .7)
hb_t = T_VANISH + .9
while hb_t < T_END - .3:
    sfx.add(thump(48, .45, 1.6), hb_t, .8); sfx.add(thump(48, .4, 1.1), hb_t + .27, .55); hb_t += 1.15
tense = np.zeros(int((T_EYE - T_ZOOM + .5) * SR), dtype=np.float32); d = len(tense) / SR
for f0 in (110, 165, 220, 330): tense += sweep(f0, f0 * 2.6, d, True) * (.3 / (f0 / 110) ** .3)
sfx.add(fade(lp(tense, 2200) * np.linspace(0, 1, len(tense)) ** 2, .1, .02), T_ZOOM, .35)
sfx.add(riser(T_EYE - T_ZOOM, 120, 7000), T_ZOOM, .5)
sfx.add(impact(2.2, 42), T_EYE, 1.0); sfx.add(whoosh(.7, 400, 6000), T_EYE - .25, .7)
sfx.add(thump(60, .3, 1.5), T_EYE + .15, .8); sfx.add(thump(60, .3, 1.5), T_EYE + .3, .6)
for k, f in enumerate((1568, 2093, 2637, 3136, 4186)): sfx.add(blip(f, .22) , T_UI + k * .08, .3, pan=-.6 + .3 * k)
sfx.add(chime(1975, 2.6), T_UI + .45, .5)
# end card: huge hit, then a bright shimmer
sfx.add(impact(4.5, 36), T_END + .5, 1.3); sfx.add(whoosh(1.0, 300, 9000), T_END - .1, .8)
sfx.add(riser(.9, 200, 9000), T_END - .8, .6)
for k, f in enumerate((220, 330, 440, 659)): sfx.add(fade((sine(f, 5.5) + .4 * sine(f * 2, 5.5)).astype(np.float32) * np.minimum(1, tt(5.5) / 1.4) * np.exp(-tt(5.5) * .55), .5, 1.5) * .12, T_END + .5, 1.0, pan=-.6 + .4 * k)
for k in range(3): sfx.add(blip(2093 * 2 ** (k / 3), .4), T_END + .8 + k * .26, .2)
sfx.add(chime(1318, 3.5), T_END + 2.1, .5)
sfx.b = reverb(sfx.b, 1.6, .22, seed=11)

# ------------------------------------------------------------------ MUSIC
mus = Bus()
BPM = 78; BEAT = 60 / BPM
def mt(n): return np.arange(n) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
# chord per scene: (bass, [pad notes], arp scale)
CH_ = {
 "scene1": (33, [57, 60, 64], [57, 60, 64, 67]), "scene2": (29, [53, 57, 60], [57, 60, 65, 69]), "scene3": (36, [55, 60, 64], [55, 60, 64, 67]),
 "scene4": (31, [55, 59, 62], [59, 62, 67, 71]), "scene5": (33, [57, 60, 64], [60, 64, 69, 72]), "scene6": (29, [53, 57, 60], [57, 60, 65, 69]),
 "scene7": (36, [55, 60, 64], [64, 67, 72, 76]), "scene8": (34, [58, 57, 64], [58, 61, 64, 70]), "scene9": (33, [57, 60, 64], [57, 64, 69, 76])}
vol = {"scene1": .5, "scene2": .6, "scene3": .7, "scene4": .8, "scene5": .8, "scene6": .85, "scene7": .95, "scene8": .65, "scene9": .45}
for sc, (bass, pad, arp) in CH_.items():
    st, du = S[sc], DUR[sc]
    if sc == "scene9": du = (T_VANISH - st) + .1
    n = int((du + 1.2) * SR); k = mt(n) / SR
    envp = np.minimum(1, k / 1.4) * np.minimum(1, np.maximum(0, (du + 1.0 - k)) / 1.0)
    t_ = np.arange(n) / SR; pd = np.zeros(n, dtype=np.float32)
    for m in pad:
        for dt in (-.09, 0, .09):
            f = hz(m) * 2 ** (dt / 12)
            pd += (np.sin(2 * np.pi * f * t_) + .5 * np.sin(4 * np.pi * f * t_ + .3) + .25 * np.sin(6 * np.pi * f * t_)).astype(np.float32) * .05 * (1 + .25 * np.sin(2 * np.pi * (.13 + .02 * m % 5) * t_))
    mus.add(pd * envp, st - .6, .55 * vol[sc], pan=0)
    bs = sine(hz(bass), n / SR)[:n] + .4 * sine(hz(bass + 12), n / SR)[:n]
    mus.add((bs * envp * (1 + .15 * np.sin(2 * np.pi * .2 * t_))).astype(np.float32), st - .6, .55 * vol[sc] if sc != "scene9" else .5)
# rhythmic layers
def kick(): return thump(52, .5, 1.4)
def arp_note(m, d=.5): return fade((sine(hz(m), d) + .3 * sine(hz(m) * 2, d)) * env(d, .004, 7.5), 0, .02)
def hat(): return hp(noise(.07), 6000) * env(.07, .001, 55)
for i, sc in enumerate(["scene2", "scene3", "scene4", "scene5", "scene6", "scene7"]):
    st, du = S[sc], DUR[sc]; arp = CH_[sc][2]; g = [.35, .4, .5, .5, .55, .6][i]
    k = 0; t = st + .2
    while t < st + du - .1:
        m = arp[[0, 1, 2, 3, 2, 1, 3, 2][k % 8]]; mus.add(arp_note(m + (12 if k % 16 > 7 else 0)), t, g * .5, pan=-.4 + .8 * ((k % 8) / 8)); t += BEAT / 2; k += 1
    if i >= 2:
        t = st
        while t < st + du - .2: mus.add(kick(), t, .45 * g * 1.3); t += BEAT
    if i >= 3:
        t = st + BEAT / 2
        while t < st + du - .2: mus.add(hat(), t, .35 * g, pan=.3); t += BEAT
# scene 1: sparse pulse; scene 8: tense tremolo + pulse; scene 9: choir-like swell at the end
for k in range(int(DUR["scene1"] / (BEAT * 2))):
    t = S["scene1"] + 1.8 + k * BEAT * 2
    if t < S["scene2"] - .5: mus.add(arp_note(57 + 12 * (k % 2), .8), t, .22, pan=.2)
sc = "scene8"; st, du = S[sc], DUR[sc]
for k in range(int(du / (BEAT / 2))): mus.add(arp_note([58, 61, 64, 70][k % 4] + 12, .35), st + .1 + k * BEAT / 2, .22, pan=-.5 + (k % 4) * .33)
t_ = np.arange(int((du + .5) * SR)) / SR
trem = (sine(hz(70), du + .5) * .1 + sine(hz(71), du + .5) * .1)[: len(t_)] * (.5 + .5 * np.sin(2 * np.pi * 6.5 * t_))
mus.add(fade(trem.astype(np.float32), 1.5, .5), st, .7)
# final: after the vanish only a distant drone remains, then a bloom at the title
sc = "scene9"
dr = (sine(hz(33), 12) + .5 * sine(hz(45), 12) + .3 * sine(hz(40), 12)) * np.minimum(1, tt(12) / 2.5)
mus.add(fade((dr * .35).astype(np.float32), 1.0, 1.0), T_VANISH + .4, .8)
bloom = np.zeros(int(7 * SR), dtype=np.float32); tb = tt(7)
for m in (45, 52, 57, 60, 64, 69, 76):
    bloom += (sine(hz(m), 7) + .5 * sine(hz(m) * 2.003, 7)) * .1
bloom *= np.minimum(1, tb / 1.8) * np.exp(-np.maximum(0, tb - 2.0) * .35)
mus.add(bloom.astype(np.float32), T_END + .4, .9)
mus.add(sweep(110, 880, 2.0) * np.linspace(0, 1, int(2 * SR)).astype(np.float32) ** 2 * .3, T_END - 1.6, .5)
mus.b = reverb(mus.b, 2.8, .35, seed=3)
mus.b[int((TOTAL) * SR):] = 0

# ------------------------------------------------------------------ write + duck + mix helpers
def write(path, b, peak=.89):
    b = b[: int(TOTAL * SR)]; m = np.abs(b).max() + 1e-9; b = b / m * peak
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(b, -1, 1) * 32767).astype(np.int16).tobytes())
sfx.b = np.tanh(sfx.b * 1.1)
write(f"{ROOT}/audio/sfx_raw.wav", sfx.b, .85)
write(f"{ROOT}/audio/music_raw.wav", mus.b, .85)
# duck the music under the narration (sidechain), keep the score alive between lines
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{ROOT}/audio/music_raw.wav", "-i", f"{ROOT}/audio/voiceover_ru.wav",
    "-filter_complex", "[0:a][1:a]sidechaincompress=threshold=0.015:ratio=10:attack=20:release=500:makeup=1,volume=0.9[out]",
    "-map", "[out]", "-ar", str(SR), "-ac", "2", f"{ROOT}/audio/music.wav"], check=True)
# effects also step back under the voice (gentler than the music), so no word is ever masked
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{ROOT}/audio/sfx_raw.wav", "-i", f"{ROOT}/audio/voiceover_ru.wav",
    "-filter_complex", "[0:a][1:a]sidechaincompress=threshold=0.02:ratio=6:attack=10:release=300,volume=0.9[out]",
    "-map", "[out]", "-ar", str(SR), "-ac", "2", f"{ROOT}/audio/sfx.wav"], check=True)
os.remove(f"{ROOT}/audio/music_raw.wav"); os.remove(f"{ROOT}/audio/sfx_raw.wav")
print("audio ok", round(TOTAL, 2), "s")
