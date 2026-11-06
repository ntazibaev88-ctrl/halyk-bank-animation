"""
NOIRX — USA VS CHINA
Procedural sound design: cinematic geopolitical score + sound effects,
synchronised to src/data/timeline.json. Everything is synthesised here,
so the project has no third-party audio licensing issues.

Outputs (48 kHz stereo):
  public/audio/music.wav  score, already ducked under the narration
  public/audio/sfx.wav    sound effects and ambiences
"""
import json
import os
import wave

import numpy as np
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(7)

TL = json.load(open(os.path.join(ROOT, "src", "data", "timeline.json"), encoding="utf-8"))
FPS = TL["fps"]
TOTAL = TL["totalFrames"] / FPS
S = {s["id"]: s["start"] / FPS for s in TL["scenes"]}
D = {s["id"]: s["frames"] / FPS for s in TL["scenes"]}
N = int(TOTAL * SR)


# ----------------------------------------------------------------- helpers
def tt(d):
    return np.arange(int(d * SR)) / SR


def sos_filter(x, kind, f, order=2):
    if kind == "bp":
        sos = signal.butter(order, [f[0] / (SR / 2), f[1] / (SR / 2)], "bandpass", output="sos")
    else:
        sos = signal.butter(order, f / (SR / 2), kind, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, o=2):
    return sos_filter(x, "lowpass", f, o)


def hp(x, f, o=2):
    return sos_filter(x, "highpass", f, o)


def bp(x, lo, hi, o=2):
    return sos_filter(x, "bp", (lo, hi), o)


def noise(d):
    return rng.standard_normal(int(d * SR))


def brown(d):
    x = np.cumsum(rng.standard_normal(int(d * SR)))
    x = hp(x, 20)
    return x / (np.abs(x).max() + 1e-9)


def adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    e = np.ones(n) * s
    if a: e[:min(a, n)] = np.linspace(0, 1, a)[:min(a, n)]
    if d and a < n: e[a:min(a + d, n)] = np.linspace(1, s, d)[:max(0, min(a + d, n) - a)]
    if r and r < n: e[-r:] *= np.linspace(1, 0, r)
    return e


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(freq, t, phase=0.0):
    return signal.sawtooth(2 * np.pi * freq * t + phase)


class Bus:
    def __init__(self):
        self.L = np.zeros(N)
        self.R = np.zeros(N)

    def add(self, x, at, gain=1.0, pan=0.0):
        if x.ndim == 2:
            xl, xr = x[0], x[1]
        else:
            xl = xr = x
        i0 = int(at * SR)
        if i0 < 0:
            xl, xr = xl[-i0:], xr[-i0:]
            i0 = 0
        n = min(len(xl), N - i0)
        if n <= 0:
            return
        gl = gain * np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
        gr = gain * np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        self.L[i0:i0 + n] += xl[:n] * gl
        self.R[i0:i0 + n] += xr[:n] * gr


def write_wav(path, L, R):
    st = np.stack([L, R], axis=1)
    st = np.clip(st, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def reverb(x, decay=1.8, mix=0.25, pre=0.02):
    """Cheap stereo convolution reverb with an exponentially decaying noise IR."""
    n = int(decay * SR)
    t = np.arange(n) / SR
    irL = rng.standard_normal(n) * np.exp(-6.9 * t / decay)
    irR = rng.standard_normal(n) * np.exp(-6.9 * t / decay)
    irL = lp(irL, 6000); irR = lp(irR, 6000)
    pad = np.zeros(int(pre * SR))
    irL = np.concatenate([pad, irL]); irR = np.concatenate([pad, irR])
    irL /= np.sqrt((irL ** 2).sum()); irR /= np.sqrt((irR ** 2).sum())
    wl = signal.fftconvolve(x, irL)[: len(x)]
    wr = signal.fftconvolve(x, irR)[: len(x)]
    return np.stack([x * (1 - mix) + wl * mix, x * (1 - mix) + wr * mix])


# ----------------------------------------------------------------- SFX synths
def boom(d=3.0, f0=70, f1=28, click=0.6):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 6)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 1.6)
    n = lp(noise(d), 900) * np.exp(-t * 14) * click
    sub = np.sin(2 * np.pi * 32 * t) * np.exp(-t * 1.0) * 0.5
    x = body + n + sub
    return x / np.abs(x).max()


def impact(d=3.5):
    x = boom(d, 90, 30, 1.0)
    t = tt(d)
    metal = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) * a
                for f, k, a in [(180, 5, .25), (431, 7, .15), (797, 9, .1), (1290, 12, .06)])
    crack = hp(noise(d), 2500) * np.exp(-t * 30) * 0.35
    y = x + metal + crack
    return reverb(y / np.abs(y).max(), 2.4, 0.3)


def whoosh(d=0.9, up=True, lo=200, hi=5000):
    n = int(d * SR)
    t = np.arange(n) / n
    bands = np.geomspace(lo, hi, 7)
    if not up:
        bands = bands[::-1]
    out = np.zeros(n)
    base = noise(d)
    for i, c in enumerate(bands):
        centre = (i + 0.5) / len(bands)
        g = np.exp(-((t - centre) ** 2) / 0.02)
        out += bp(base, c * 0.7, min(c * 1.4, SR / 2 - 100)) * g
    env = np.sin(np.pi * t) ** 1.5
    out *= env
    out /= np.abs(out).max() + 1e-9
    L = out
    R = np.roll(out, int(0.004 * SR))
    return np.stack([L, R])


def zap(d=0.35, f=900):
    t = tt(d)
    fm = f * (1 + 0.5 * np.sin(2 * np.pi * 37 * t)) * np.exp(-t * 3)
    x = signal.square(2 * np.pi * np.cumsum(fm) / SR) * 0.4 + noise(d) * 0.3
    x = bp(x, 400, 6000) * np.exp(-t * 9)
    return x / np.abs(x).max()


def blip(f=1200, d=0.09, kind="sine"):
    t = tt(d)
    w = np.sin(2 * np.pi * f * t) if kind == "sine" else signal.square(2 * np.pi * f * t) * 0.5
    return w * np.exp(-t * 40) * adsr(len(t), 0.002, 0, 1, 0.01)


def servo(d=0.7, f0=180, f1=420):
    t = tt(d)
    f = f0 + (f1 - f0) * (0.5 - 0.5 * np.cos(np.pi * np.clip(t / d, 0, 1)))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sin(3.01 * ph) + 0.15 * bp(noise(d), 1500, 4000)
    x *= adsr(len(t), 0.05, 0, 1, 0.12)
    return x / np.abs(x).max()


def clank(f=320, d=0.9):
    t = tt(d)
    x = sum(np.sin(2 * np.pi * f * r * t) * np.exp(-t * k) * a
            for r, k, a in [(1, 6, 1), (2.76, 9, .6), (5.4, 13, .4), (8.93, 18, .25)])
    x += hp(noise(d), 1500) * np.exp(-t * 50) * 0.8
    return x / np.abs(x).max()


def ting(f=1800, d=1.4):
    t = tt(d)
    x = sum(np.sin(2 * np.pi * f * r * t) * np.exp(-t * k) * a
            for r, k, a in [(1, 3, 1), (2.0, 4, .4), (3.01, 6, .2), (4.2, 8, .1)])
    return x * adsr(len(t), 0.003, 0, 1, 0.05)


def horn(d=2.4, f=62):
    t = tt(d)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
    x = saw(f * vib, t) + 0.8 * saw(f * 1.498 * vib, t) + 0.4 * saw(f * 2.002 * vib, t)
    x = lp(x, 700, 4) * adsr(len(t), 0.25, 0.2, 0.85, 0.7)
    return reverb(x / np.abs(x).max(), 2.8, 0.35)


def ocean(d):
    t = tt(d)
    base = lp(brown(d), 700)
    swell = 0.55 + 0.45 * np.sin(2 * np.pi * t / 4.3) ** 2
    foam = hp(noise(d), 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 4.3 + 1.0)) ** 4 * 0.15
    x = base * swell + foam
    return np.stack([x, np.roll(x, int(0.37 * SR))])


def traffic(d):
    t = tt(d)
    x = lp(brown(d), 380) * 0.8
    for k in range(int(d / 1.3)):
        c = 0.4 + k * 1.3 + rng.uniform(-0.2, 0.2)
        g = np.exp(-((t - c) ** 2) / 0.18)
        x += bp(noise(d), 250, 1400) * g * 0.35
    return x


def subway(d=3.2):
    t = tt(d)
    rumble = lp(brown(d), 160) * 1.2 + bp(noise(d), 300, 900) * 0.12
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.2
    x = rumble * env
    for c in np.arange(0.15, d - 0.2, 0.55):
        for off in (0, 0.11):
            i = int((c + off) * SR)
            k = clank(140, 0.25) * 0.35
            x[i:i + len(k)] += k[: max(0, len(x) - i)] * env[min(i, len(env) - 1)]
    return x


def machinery(d):
    t = tt(d)
    hum = sum(np.sin(2 * np.pi * 50 * h * t) / h for h in range(1, 7)) * 0.25
    thump_env = np.exp(-((t % 0.5) * 18))
    thump = lp(noise(d), 200) * thump_env * 0.9
    hiss = hp(noise(d), 3000) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t)) * 0.05
    return hum + thump + hiss


def ev_whine(d=2.2, f0=300, f1=900):
    t = tt(d)
    f = f0 + (f1 - f0) * t / d
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sin(ph) + 0.3 * np.sin(2 * ph)) * np.sin(np.pi * t / d) ** 2
    return x * 0.6


def riser(d=3.0):
    t = tt(d)
    f = 120 * 2 ** (3 * t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = (np.sin(ph) + 0.5 * np.sin(1.5 * ph)) * 0.3
    nz = hp(noise(d), 1200) * 0.6
    env = (t / d) ** 2.2
    x = (tone + nz) * env
    return reverb(x / np.abs(x).max(), 1.5, 0.3)


def heartbeat():
    a = boom(0.5, 75, 40, 0.2) * 0.9
    out = np.zeros(int(0.8 * SR))
    out[: len(a)] += a
    i = int(0.24 * SR)
    out[i:i + len(a)] += a[: len(out) - i] * 0.7
    return out


def shimmer(d=4.0):
    t = tt(d)
    x = sum(np.sin(2 * np.pi * f * t + p) * (0.6 + 0.4 * np.sin(2 * np.pi * (3 + i) * t))
            for i, (f, p) in enumerate([(1174.7, 0), (1760, 1), (2349, 2), (2637, 3)]))
    x *= adsr(len(t), 0.05, 0.3, 0.6, 2.5) * np.exp(-t * 0.6)
    return reverb(x / np.abs(x).max(), 3.0, 0.5)


def data_chirps(d, rate=9, lo=1400, hi=3600):
    out = np.zeros(int(d * SR))
    for k in range(int(d * rate)):
        at = k / rate + rng.uniform(0, 0.4 / rate)
        b = blip(rng.uniform(lo, hi), 0.05, rng.choice(["sine", "square"])) * rng.uniform(0.3, 0.8)
        i = int(at * SR)
        out[i:i + len(b)] += b[: max(0, len(out) - i)]
    return out


# ----------------------------------------------------------------- SFX timeline
def build_sfx():
    b = Bus()
    # transitions between every scene
    ids = [s["id"] for s in TL["scenes"]]
    for sid in ids[1:]:
        b.add(whoosh(0.9, True), S[sid] - 0.6, 0.32)
        b.add(boom(1.6, 60, 30, 0.3), S[sid], 0.22)

    # 01 HOOK
    h = S["hook"]
    b.add(boom(4.0, 50, 24, 0.4), h + 0.02, 0.55)
    b.add(whoosh(1.4, True, 120, 3000), h + 0.0, 0.3)
    b.add(impact(), h + 1.2, 0.6)                     # title slam
    b.add(whoosh(0.5, True, 400, 6000), h + 2.05, 0.25, -0.6)  # US flag
    b.add(whoosh(0.5, True, 400, 6000), h + 2.35, 0.25, 0.6)   # CN flag
    for k, at in enumerate([3.0, 3.3, 3.65, 4.1, 4.6]):
        b.add(zap(0.4, 700 + 120 * k), h + at, 0.16, -0.5 + 0.25 * k)
    b.add(riser(1.4), h + D["hook"] - 1.4, 0.25)

    # 02 USA — city ambience, subway, taxis, financial ticks
    u = S["usa"]
    b.add(traffic(D["usa"]), u, 0.22)
    b.add(subway(3.4), u + 1.6, 0.35, 0.3)
    hornbeep = lp(signal.square(2 * np.pi * 415 * tt(0.22)) + signal.square(2 * np.pi * 523 * tt(0.22)), 2500) * adsr(int(0.22 * SR), 0.01, 0, 1, 0.05)
    b.add(hornbeep, u + 2.7, 0.05, -0.6)
    b.add(hornbeep, u + 3.0, 0.04, -0.6)
    b.add(data_chirps(2.2, 7, 1800, 2600), u + 4.2, 0.07, 0.4)

    # 03 CHINA — city + EVs + robots
    c = S["china"]
    b.add(traffic(D["china"]) * 0.6, c, 0.18)
    b.add(ev_whine(2.4, 280, 820), c + 0.8, 0.12, -0.7)
    b.add(ev_whine(2.4, 300, 900), c + 2.4, 0.1, 0.7)
    b.add(machinery(D["china"] - 3.5), c + 3.5, 0.12)
    for at, (f0, f1), pan in [(3.7, (160, 420), -0.4), (4.5, (420, 200), 0.4), (5.3, (180, 460), -0.3), (6.1, (440, 210), 0.3)]:
        b.add(servo(0.65, f0, f1), c + at, 0.14, pan)
        b.add(clank(520, 0.5), c + at + 0.6, 0.08, pan)

    # 04 CHIPS — assembly clicks, circuits
    ch = S["chips"]
    for k, at in enumerate([0.5, 0.85, 1.2, 1.55, 1.9, 2.25]):
        b.add(clank(900 + 60 * k, 0.35), ch + at, 0.13, (-1) ** k * 0.4)
        b.add(blip(2200 + 140 * k, 0.07), ch + at + 0.05, 0.12)
    b.add(zap(0.6, 600), ch + 2.6, 0.18)
    b.add(data_chirps(D["chips"] - 3.2, 10), ch + 3.0, 0.08, -0.2)
    b.add(whoosh(0.7, True, 600, 9000), ch + 3.0, 0.15)

    # 05 AI — servos, beeps, data
    a = S["ai"]
    for at, (f0, f1), pan in [(0.6, (200, 520), -0.5), (2.0, (520, 240), -0.5), (3.6, (220, 560), 0.5), (5.0, (560, 260), 0.5)]:
        b.add(servo(0.9, f0, f1), a + at, 0.13, pan)
    b.add(data_chirps(D["ai"] - 0.5, 12, 1600, 4200), a + 0.3, 0.07, 0.2)
    b.add(shimmer(3.0), a + 2.4, 0.1)

    # 06 TRADE — ocean, ship horn, containers
    tr = S["trade"]
    b.add(ocean(D["trade"] + 0.4), tr - 0.2, 0.3)
    b.add(horn(2.6, 62), tr + 0.9, 0.3, -0.2)
    for k, at in enumerate([3.6, 4.3, 5.0, 5.7]):
        b.add(clank(210 + 15 * k, 1.0), tr + at, 0.16, 0.5)

    # 07 RESOURCES — mining machinery, conveyor, minerals
    r = S["resources"]
    b.add(machinery(D["resources"]), r, 0.2)
    for k in range(int(D["resources"] / 0.5)):
        b.add(clank(260, 0.3), r + 0.25 + k * 0.5, 0.05, 0.3)
    for k, at in enumerate([0.8, 1.4, 2.0, 2.6, 3.2]):
        b.add(ting(1500 + 220 * k, 1.2), r + at, 0.07, -0.5 + 0.25 * k)
    b.add(whoosh(0.8, True, 300, 6000), r + 4.6, 0.14)

    # 08 INTERDEPENDENCE — products travelling
    it = S["interdependence"]
    for k, at in enumerate([0.9, 1.9, 2.9, 3.9, 4.9]):
        b.add(whoosh(0.7, k % 2 == 0, 300, 5000), it + at, 0.15, -0.6 if k % 2 == 0 else 0.6)
        b.add(ting(1318 if k % 2 == 0 else 1568, 1.0), it + at + 0.6, 0.06, 0.6 if k % 2 == 0 else -0.6)

    # 09 QUESTION — tension
    q = S["question"]
    for k in range(9):
        b.add(heartbeat(), q + 0.4 + k * 0.92, 0.22 + 0.02 * k)
    b.add(riser(3.2), S["final"] - 3.2, 0.32)

    # 10 FINAL — impacts, logo reveal
    f = S["final"]
    b.add(impact(), f + 0.0, 0.6)
    b.add(whoosh(0.6, True, 300, 6000), f + 0.35, 0.18)
    b.add(boom(2.0, 80, 35, 0.6), f + 4.27, 0.3)          # США ИЛИ КИТАЙ?
    logo_t = f + 7.15
    b.add(whoosh(1.2, True, 150, 8000), logo_t - 1.0, 0.28)
    b.add(impact(), logo_t, 0.7)
    b.add(shimmer(4.5), logo_t + 0.05, 0.22)
    b.add(blip(1760, 0.12), f + 8.0, 0.1)
    return b


# ----------------------------------------------------------------- music
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
# D minor: i - VI - III - VII  (Dm, Bb, F, C)
PROG = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]]
ROOTS = [38, 34, 41, 36]


def pad_note(m, d, bright=1200, det=0.006):
    t = tt(d)
    f = midi(m)
    L = saw(f * (1 - det), t) + saw(f * (1 + det * 0.5), t, 1.0)
    R = saw(f * (1 + det), t, 2.0) + saw(f * (1 - det * 0.5), t, 0.5)
    env = adsr(len(t), min(0.9, d / 3), 0.3, 0.85, min(1.4, d / 2.5))
    return np.stack([lp(L, bright) * env, lp(R, bright) * env]) * 0.25


def string_note(m, d):
    t = tt(d)
    f = midi(m) * (1 + 0.003 * np.sin(2 * np.pi * 5.2 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = signal.sawtooth(ph) + 0.6 * signal.sawtooth(ph * 1.003 + 1)
    x = lp(x, 2200, 2) * adsr(len(t), min(0.5, d / 3), 0.2, 0.9, min(1.0, d / 2))
    return x * 0.22


def pluck(m, d=0.5):
    t = tt(d)
    f = midi(m)
    x = saw(f, t) * 0.6 + signal.square(2 * np.pi * f * t) * 0.25
    cutoff_env = np.exp(-t * 9)
    # two-stage filter approximating a decaying cutoff
    bright = lp(x, 3500) * cutoff_env
    dark = lp(x, 700) * np.exp(-t * 4)
    return (bright * 0.7 + dark * 0.5) * adsr(len(t), 0.003, 0, 1, 0.08) * 0.5


def bass_note(m, d):
    t = tt(d)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * lp(saw(f, t), 300)
    return x * adsr(len(t), 0.005, 0.1, 0.7, 0.05) * np.exp(-t * 2.5) * 0.6


def taiko(big=False):
    x = boom(1.4 if big else 0.9, 110 if big else 140, 48 if big else 60, 0.9)
    return reverb(x, 1.6, 0.28)


def hat(d=0.05):
    t = tt(d)
    return hp(noise(d), 7000) * np.exp(-t * 80)


def section_intensity(t):
    """Returns which layers are active at time t."""
    return {
        "pulse": S["usa"] - 0.1 <= t < S["question"] + D["question"] - 0.2,
        "pluck": (S["china"] <= t < S["resources"]) or (S["interdependence"] <= t < S["question"]),
        "hats": S["chips"] <= t < S["trade"],
        "taiko": (S["china"] <= t < S["ai"]) or (S["resources"] <= t < S["interdependence"]),
        "strings": (S["trade"] <= t < S["resources"]) or (S["interdependence"] <= t < S["final"] + 2),
    }


def build_music():
    b = Bus()
    # Low drone across the whole piece
    d = TOTAL
    t = tt(d)
    drone = (np.sin(2 * np.pi * midi(26) * t) * 0.6 + lp(saw(midi(38), t), 220) * 0.25)
    drone *= np.minimum(1, t / 3.0) * np.clip((TOTAL - t) / 3.0, 0, 1)
    swell = 0.7 + 0.3 * np.sin(2 * np.pi * t / 11.0)
    b.add(drone * swell, 0, 0.32)

    bars = int(np.ceil(TOTAL / BAR))
    for k in range(bars):
        t0 = k * BAR
        if t0 >= S["final"] - 0.05:
            break
        ci = k % 4
        bar_d = min(BAR, S["final"] - t0) + 0.6
        for m in PROG[ci]:
            b.add(pad_note(m, bar_d + 0.4, 900 if t0 < S["usa"] else 1400), t0, 0.5)
        for beat in range(8):  # eighth notes
            tb = t0 + beat * BEAT / 2
            if tb >= S["final"]:
                break
            L = section_intensity(tb)
            if L["pulse"]:
                acc = 1.0 if beat % 2 == 0 else 0.65
                b.add(bass_note(ROOTS[ci], BEAT / 2 * 0.95), tb, 0.55 * acc)
            if L["pluck"]:
                arp = PROG[ci] + [PROG[ci][0] + 12]
                b.add(pluck(arp[[0, 2, 1, 3, 2, 0, 3, 1][beat]] + 12, 0.45), tb, 0.33, 0.35 * (-1) ** beat)
            if L["hats"]:
                b.add(hat(), tb, 0.12 if beat % 2 else 0.2, 0.4)
                b.add(hat(0.03), tb + BEAT / 4, 0.07, -0.4)
            if L["taiko"] and beat in (0, 4):
                b.add(taiko(beat == 0), tb, 0.38)
            if L["taiko"] and beat == 7 and S["resources"] <= tb:
                b.add(taiko(False), tb, 0.25)
        if section_intensity(t0 + 0.01)["strings"]:
            mel = [69, 65, 67, 62][ci]
            b.add(string_note(mel, BAR * 0.98), t0, 0.45, -0.25)
            b.add(string_note(mel - 12, BAR * 0.98), t0, 0.3, 0.25)

    # Question: rising string tension
    q = S["question"]
    for i, m in enumerate([62, 64, 65, 67, 69]):
        b.add(string_note(m, 2.2), q + 0.3 + i * 1.7, 0.32, -0.2 + 0.1 * i)

    # Final: big sustained chord, then bright resolution on the logo
    f = S["final"]
    for m in [38, 50, 53, 57, 62]:
        b.add(pad_note(m, TOTAL - f, 1600), f, 0.55)
        b.add(string_note(m + 12, TOTAL - f - 0.2), f + 0.1, 0.25)
    logo_t = f + 7.15
    for m in [62, 64, 69, 74]:
        b.add(pad_note(m, TOTAL - logo_t, 3000, 0.004), logo_t, 0.35)
    b.add(taiko(True), f, 0.6)
    b.add(taiko(True), logo_t, 0.7)

    # master fade at end
    fade = np.clip((TOTAL - np.arange(N) / SR) / 2.2, 0, 1)
    b.L *= fade; b.R *= fade
    return b


def vo_envelope():
    path = os.path.join(ROOT, "public", "audio", "voiceover.wav")
    with wave.open(path) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    if sr != SR:
        x = signal.resample_poly(x, SR, sr)
    x = np.pad(x, (0, max(0, N - len(x))))[:N]
    env = np.sqrt(lp(x ** 2, 6, 1).clip(0))
    env = env / (env.max() + 1e-9)
    # smooth attack/release
    env = lp(env, 2.5, 1)
    return np.clip(env * 3, 0, 1)


def normalise(b, peak):
    m = max(np.abs(b.L).max(), np.abs(b.R).max())
    b.L *= peak / m; b.R *= peak / m


def main():
    music = build_music()
    normalise(music, 0.5)
    duck = 1 - 0.45 * vo_envelope()      # ~ -5 dB under the voice
    music.L *= duck; music.R *= duck
    sfx = build_sfx()
    normalise(sfx, 0.6)
    write_wav(os.path.join(ROOT, "public", "audio", "music.wav"), music.L, music.R)
    write_wav(os.path.join(ROOT, "public", "audio", "sfx.wav"), sfx.L, sfx.R)
    print("music + sfx written,", round(TOTAL, 2), "s")


if __name__ == "__main__":
    main()
