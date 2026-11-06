"""Synthesize the music bed and the sound-effects stem for the 90 s film.

Music: an atmospheric pad in D minor that follows the story (dark hook → curious
pulse → night music-box → mechanical tick → playful → hopeful F-major lift),
ducked under the narration. SFX: whooshes, impacts, pops, ticks, rewinds,
glitches, a crack, one riser into the transformation — each placed on its
on-screen action (times = scene start + local beat, see compositions/).
Deterministic: every random source is seeded.

Writes video/assets/audio/music.wav and video/assets/audio/sfx.wav (48 kHz stereo)."""
import json, os, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = os.path.dirname(os.path.abspath(__file__)) + "/.."
OUT = ROOT + "/video/assets/audio"
SR, DUR = 48000, 90.0
N = int(SR * DUR)
T = json.load(open(ROOT + "/video/assets/timing.json"))
SC = {s["id"]: s["start"] for s in T["scenes"]}
rng = np.random.default_rng(7)

def f(m): return 440.0 * 2 ** ((m - 69) / 12)
def env_adsr(n, a, r, sus=1.0):
    e = np.ones(n) * sus; ia, ir = int(a * SR), int(r * SR)
    e[:ia] = np.linspace(0, sus, ia) if ia else e[:ia]
    if ir: e[-ir:] *= np.linspace(1, 0, ir)
    return e
def lp(x, fc, order=2): return sosfilt(butter(order, fc, "low", fs=SR, output="sos"), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)
def place(buf, x, t, gain=1.0, pan=0.0):
    i = int(t * SR); j = min(len(buf), i + len(x))
    if j <= i: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += x[: j - i] * gain * l * 1.414; buf[i:j, 1] += x[: j - i] * gain * r * 1.414
def reverb(x, secs=2.6, mix=0.3, seed=1):
    g = np.random.default_rng(seed); n = int(secs * SR)
    ir = g.standard_normal((n, 2)) * np.exp(-np.linspace(0, 7, n))[:, None]
    ir[:, 0] = lp(ir[:, 0], 6000); ir[:, 1] = lp(ir[:, 1], 6000); ir /= np.sqrt((ir ** 2).sum(0))
    wet = np.stack([fftconvolve(x[:, k], ir[:, k])[: len(x)] for k in range(2)], 1)
    return x * (1 - mix) + wet * mix

# ------------------------------------------------------------------ MUSIC
music = np.zeros((N, 2))
t_all = np.arange(N) / SR

def pad_note(m, dur, amp, bright=1800, seed=0):
    n = int(dur * SR); tt = np.arange(n) / SR; out = np.zeros(n)
    for k, det in enumerate([-0.11, 0.0, 0.13]):  # three detuned voices
        fr = f(m) * 2 ** (det / 12)
        ph = np.random.default_rng(seed + k).uniform(0, 6.28)
        for h in range(1, 7):  # soft saw-ish stack
            out += np.sin(2 * np.pi * fr * h * tt + ph * h) / h ** 1.3
    out = lp(out, bright) * env_adsr(n, min(1.6, dur * 0.4), min(1.8, dur * 0.45))
    return out * amp / 6

# section plan: (start, end, chords [(root-midi list)], bar seconds, style)
DM, BB, F_, C_, GM, AM = [50, 57, 62, 65], [46, 58, 62, 65], [41, 57, 60, 65], [48, 55, 60, 64], [43, 58, 62, 67], [45, 57, 61, 64]
FMAJ, BBM, CM, DMIN = [41, 60, 65, 69], [46, 62, 65, 70], [48, 60, 64, 67], [50, 62, 65, 69]
plan = [
    (0.0, SC["s2"], [DM, BB], 2.64, "dark"),
    (SC["s2"], SC["s3"], [DM, BB, F_, C_], 2.67, "pulse"),
    (SC["s3"], SC["s4"], [DM, GM, BB, AM], 3.5, "night"),
    (SC["s4"], SC["s5"], [DM, BB, GM, AM], 2.67, "tick"),
    (SC["s5"], SC["s6"], [F_, C_, DM, BB], 2.67, "play"),
    (SC["s6"], SC["s6"] + 13.76, [DM, BB, F_, C_], 2.67, "build"),
    (SC["s6"] + 13.76, DUR, [FMAJ, CM, DMIN, BBM], 2.6, "hope"),
]
for (a, b, chords, bar, style) in plan:
    t, i = a, 0
    bright = {"dark": 900, "pulse": 1500, "night": 1100, "tick": 1300, "play": 2000, "build": 1400, "hope": 2600}[style]
    amp = {"dark": 0.5, "pulse": 0.45, "night": 0.45, "tick": 0.42, "play": 0.45, "build": 0.5, "hope": 0.6}[style]
    while t < b - 0.05:
        ch = chords[i % len(chords)]; d = min(bar * 2, b - t + 1.2)
        for k, m in enumerate(ch):
            x = pad_note(m, d, amp * (1.2 if k == 0 else 0.8), bright, seed=int(t * 10) + k)
            place(music, x, t, 1.0, pan=[-0.5, -0.15, 0.2, 0.55][k])
        # sub bass under the root
        n = int(d * SR); tt = np.arange(n) / SR
        place(music, np.sin(2 * np.pi * f(ch[0] - 12) * tt) * env_adsr(n, 0.4, 0.8) * 0.35 * amp, t)
        # rhythmic layers
        beat = bar / 4
        for q in range(8):
            bt = t + q * beat
            if bt >= b: break
            if style in ("pulse", "play", "hope"):  # soft plucked arpeggio, eighths
                for e in range(2):
                    m = ch[1 + (q * 2 + e) % 3] + 12 + (12 if style == "hope" and e else 0)
                    nn = int(0.6 * SR); tt2 = np.arange(nn) / SR
                    pl = (np.sin(2 * np.pi * f(m) * tt2) + 0.3 * np.sin(4 * np.pi * f(m) * tt2)) * np.exp(-tt2 * 7)
                    place(music, pl, bt + e * beat / 2, 0.11 if style != "hope" else 0.13, pan=0.4 * np.sin(q + e))
            if style == "night" and q % 2 == 0:  # slow music-box
                m = ch[1 + (q // 2) % 3] + 24; nn = int(1.2 * SR); tt2 = np.arange(nn) / SR
                mb = (np.sin(2 * np.pi * f(m) * tt2) + 0.25 * np.sin(2 * np.pi * f(m) * 3.01 * tt2)) * np.exp(-tt2 * 4)
                place(music, mb, bt, 0.08, pan=-0.3 + 0.2 * q / 8)
            if style in ("dark", "build") and q % 4 == 0:  # heartbeat
                nn = int(0.35 * SR); tt2 = np.arange(nn) / SR
                hb = np.sin(2 * np.pi * (55 - 15 * tt2) * tt2) * np.exp(-tt2 * 14)
                place(music, hb, bt, 0.55); place(music, hb, bt + 0.28, 0.35)
            if style == "tick":  # clock-like tick
                nn = int(0.05 * SR); tk = hp(rng.standard_normal(nn), 3000) * np.exp(-np.arange(nn) / SR * 120)
                place(music, tk, bt, 0.05 if q % 2 else 0.08, pan=0.3 if q % 2 else -0.3)
        t += bar * 2; i += 1

# air: slow filtered-noise swell
air = lp(hp(rng.standard_normal(N), 300), 2500) * (0.5 + 0.5 * np.sin(2 * np.pi * t_all / 11)) * 0.02
music[:, 0] += air; music[:, 1] += np.roll(air, 4000)
music = reverb(music, 3.0, 0.35, seed=3)

# duck under the voice
vo, vsr = sf.read(OUT + "/voice.wav"); vo = vo.mean(1) if vo.ndim > 1 else vo
vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
venv = np.sqrt(np.clip(lp(vo ** 2, 6), 0, None))  # smooth envelope
venv = np.convolve(np.abs(venv), np.ones(int(0.25 * SR)) / int(0.25 * SR), "same")
duck = 1 - 0.55 * np.clip(venv / (venv.max() * 0.25), 0, 1)
duck = np.convolve(duck, np.ones(int(0.12 * SR)) / int(0.12 * SR), "same")
music *= duck[:, None]
fade = np.ones(N); fade[: int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR)); fade[-int(2.5 * SR):] = np.linspace(1, 0, int(2.5 * SR)) ** 1.5
music *= fade[:, None]
music *= 0.2 / np.max(np.abs(music))
sf.write(OUT + "/music.wav", music.astype(np.float32), SR, subtype="PCM_16")

# ------------------------------------------------------------------ SFX
sfx = np.zeros((N, 2))
def noise(n, seed): return np.random.default_rng(seed).standard_normal(n)
def whoosh(d=0.5, seed=0, up=True):
    n = int(d * SR); x = noise(n, seed); out = np.zeros(n); seg = 256
    for k in range(0, n, seg):
        u = k / n; fc = (400 + 3600 * (u if up else 1 - u)); out[k:k + seg] = bp(x[max(0, k - 2048):k + seg], fc * 0.6, min(fc * 1.6, 20000))[-len(x[k:k + seg]):]
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return out * e
def impact(seed=0, low=70, d=1.2):
    n = int(d * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * (low * np.exp(-tt * 3) + 28) * tt) * np.exp(-tt * 4)
    crack = lp(noise(n, seed), 3000) * np.exp(-tt * 30) * 0.6
    return body + crack
def pop(seed=0, f0=900):
    n = int(0.12 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * (f0 * np.exp(-tt * 18) + 200) * tt) * np.exp(-tt * 40)
def tick(seed=0):
    n = int(0.03 * SR); return hp(noise(n, seed), 2500) * np.exp(-np.arange(n) / SR * 200)
def thump(seed=0): return impact(seed, 110, 0.4) * 0.8
def rewind(seed=0):
    n = int(0.25 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * (2400 - 6000 * tt) * tt) * 0.4 + bp(noise(n, seed), 1500, 6000) * 0.5) * np.sin(np.pi * tt / tt[-1])
def glitch(seed=0, d=0.18):
    n = int(d * SR); x = noise(n, seed); x = np.round(x * 3) / 3  # crushed
    g = (np.random.default_rng(seed).random(n // 400 + 1) > 0.4).repeat(400)[:n]
    return hp(x, 800) * g * 0.5
def crack(seed=0):
    n = int(0.5 * SR); tt = np.arange(n) / SR
    clicks = np.zeros(n); g = np.random.default_rng(seed)
    for k in g.integers(0, n // 2, 30): clicks[k:k + 60] += g.standard_normal(60) * np.exp(-np.arange(60) / 10)
    return hp(clicks, 1500) * np.exp(-tt * 6)
def riser(d=1.2, seed=0):
    n = int(d * SR); tt = np.arange(n) / SR; u = tt / d
    tone = np.sin(2 * np.pi * (200 + 900 * u ** 2) * tt) * 0.3
    return (bp(noise(n, seed), 500, 8000) * 0.5 + tone) * u ** 2
def splat(seed=0):
    n = int(0.5 * SR); tt = np.arange(n) / SR
    return lp(noise(n, seed), 900) * np.exp(-tt * 9) + np.sin(2 * np.pi * 90 * tt) * np.exp(-tt * 12)
def shimmer(seed=0, d=1.0):
    n = int(d * SR); tt = np.arange(n) / SR
    return bp(noise(n, seed), 5000, 12000) * np.exp(-tt * 3) * 0.6
def clunk(seed=0):
    n = int(0.25 * SR); tt = np.arange(n) / SR
    return (lp(noise(n, seed), 1200) * np.exp(-tt * 25) + np.sin(2 * np.pi * 160 * tt) * np.exp(-tt * 20)) * 0.8
def rain(d, seed=0):
    n = int(d * SR); x = bp(noise(n, seed), 1500, 7000) * 0.25
    e = np.ones(n); r = int(0.6 * SR); e[:r] = np.linspace(0, 1, r); e[-r:] = np.linspace(1, 0, r)
    return x * e
def rumble(d, seed=0):
    n = int(d * SR); tt = np.arange(n) / SR
    return lp(noise(n, seed), 120) * 3 * np.sin(np.pi * tt / d)

W = lambda d=0.5, s=0, up=True: whoosh(d, s, up)
s1, s2, s3, s4, s5, s6 = (SC[k] for k in ["s1", "s2", "s3", "s4", "s5", "s6"])
E = []  # (time, sound, gain, pan) — the sound's peak lands on the action
E += [(0.0, impact(1, 60), 0.5, 0), (0.85, shimmer(2), 0.35, 0.3), (3.3, impact(3, 75), 0.9, 0), (3.3, W(0.45, 4), 0.5, 0),
      (4.05, W(0.35, 5, False), 0.35, -0.5), (4.12, W(0.35, 6, False), 0.35, 0.5), (4.7, riser(0.58, 7), 0.4, 0)]
E += [(s2 - 0.1, W(0.5, 8), 0.6, 0)]
E += [(s2 + t0, pop(10 + i, 700 + 120 * i), 0.45, [-0.5, 0.5, -0.5, 0.5][i]) for i, t0 in enumerate([0.3, 0.65, 1.0, 1.35])]
E += [(s2 + 0.3 + k * 0.09 * (1 + k * 0.08), tick(20 + k), 0.25, 0) for k in range(20) if 0.3 + k * 0.09 * (1 + k * 0.08) < 2.5]
E += [(s2 + 2.35 + i * 0.08, pop(30 + i, 1300), 0.3, [-0.5, 0.5, -0.5, 0.5][i]) for i in range(4)]
E += [(s2 + 3.2, W(0.4, 34), 0.45, 0), (s2 + 3.78, thump(35), 0.7, 0), (s2 + 5.42, clunk(36), 0.7, 0.3), (s2 + 5.5, shimmer(37, 0.8), 0.3, 0),
      (s2 + 6.8, W(0.45, 38), 0.55, 0), (s2 + 8.45, W(0.7, 39), 0.45, 0.4), (s2 + 9.42, pop(40, 600), 0.5, 0), (s2 + 10.9, W(0.4, 41), 0.5, -0.3)]
E += [(s2 + st, thump(50 + i), 0.55 if i < 3 else 0.35, (i % 3 - 1) * 0.4) for i, st in enumerate([11.45, 12.02, 12.74, 13.12, 13.38, 13.62, 13.84, 14.02, 14.18])]
E += [(s2 + 13.0, impact(60, 90, 0.8), 0.5, 0), (s2 + 14.25, W(0.45, 61, False), 0.35, 0)]
E += [(s3 + 1.05, pop(70, 500), 0.4, 0), (s3 + 3.9, impact(71, 80, 0.8), 0.7, 0), (s3 + 3.88, W(0.3, 72), 0.4, 0), (s3 + 5.9, pop(73, 1000), 0.55, 0.4), (s3 + 5.9, impact(74, 100, 0.5), 0.4, 0.3),
      (s3 + 6.95, pop(75, 650), 0.45, -0.5)]
E += [(s3 + p, tick(80 + i), 0.45, -0.4) for i, p in enumerate([8.11, 8.75, 9.19, 9.55, 9.85, 10.12, 10.38, 10.62, 10.86])]
E += [(s3 + p + 0.01, rewind(90 + i), 0.35 if i < 3 else 0.2, 0) for i, p in enumerate([8.11, 8.75, 9.19, 9.55, 9.85, 10.12, 10.38, 10.62, 10.86])]
E += [(s3 + 13.35, W(0.6, 99), 0.55, 0)]
E += [(s4 + 0.0, shimmer(100, 0.6), 0.3, 0), (s4 + 1.95, thump(101), 0.55, 0), (s4 + 2.24, pop(102, 1100), 0.45, 0.4), (s4 + 3.1, W(0.5, 103), 0.35, -0.3),
      (s4 + 4.16, crack(104) * 0.8, 0.6, 0.3), (s4 + 4.2, pop(105, 800), 0.4, 0), (s4 + 5.15, W(0.4, 106), 0.5, 0), (s4 + 5.4, W(0.35, 107, False), 0.25, 0.3),
      (s4 + 5.75, pop(108, 900), 0.4, 0.2), (s4 + 6.3, W(0.35, 109, False), 0.25, -0.3), (s4 + 6.6, pop(110, 900), 0.4, -0.3), (s4 + 7.15, W(0.4, 111), 0.5, 0),
      (s4 + 7.3, rumble(1.2, 112), 0.6, 0), (s4 + 8.5, clunk(113), 0.6, 0.2), (s4 + 8.6, pop(114, 1000), 0.4, 0), (s4 + 8.95, W(0.4, 115), 0.5, 0)]
E += [(s4 + tf, pop(120 + i, 750), 0.45, 0.3) for i, tf in enumerate([9.25, 9.76, 10.29])]
E += [(s4 + 11.3, W(0.5, 124), 0.4, 0), (s4 + 14.4, pop(125, 600), 0.5, 0), (s4 + 14.4, impact(126, 90, 0.6), 0.35, 0)]
E += [(s4 + 13.66 + k * 0.37, glitch(130 + k, 0.12 + 0.05 * (k % 3)), 0.5, (k % 3 - 1) * 0.5) for k in range(10)]
E += [(s4 + 15.6, hp(noise(int(1.4 * SR), 140), 1500) * np.linspace(0, 0.35, int(1.4 * SR)), 0.6, 0), (s4 + 17.0, glitch(141, 0.44), 0.7, 0)]
E += [(s5 + 0.1, W(0.4, 150, False), 0.4, 0), (s5 + 2.78, splat(151), 0.8, 0), (s5 + 2.78, impact(152, 80, 0.6), 0.4, 0), (s5 + 3.25, W(0.6, 153), 0.6, 0),
      (s5 + 3.6, pop(154, 700), 0.35, 0), (s5 + 4.5, pop(155, 500), 0.45, -0.5), (s5 + 5.6, pop(156, 1200), 0.45, 0.5), (s5 + 3.6, rain(9.2, 157), 0.35, -0.6),
      (s5 + 7.8, pop(158, 900), 0.4, -0.4), (s5 + 7.85, pop(159, 1000), 0.4, 0.4)]
E += [(s5 + t0 - 0.05, pop(160 + i, 800 + 150 * i), 0.5, 0) for i, t0 in enumerate([9.31, 10.26, 12.26])]
E += [(s5 + 12.9, pop(170, 1400), 0.35, -0.4), (s5 + 12.95, pop(171, 1500), 0.35, 0.4), (s5 + 13.95, W(0.6, 172), 0.6, 0)]
E += [(s6 + 0.0, W(0.5, 180, False), 0.35, 0), (s6 + 2.6, W(0.7, 181), 0.4, 0.4)]
E += [(s6 + w - 0.04, pop(190 + i, 650 + 80 * i), 0.35, 0.3) for i, w in enumerate([4.34, 4.53, 5.05, 5.37])]
E += [(s6 + 6.41, crack(195), 0.6, 0.2), (s6 + 6.41, impact(196, 90, 0.6), 0.5, 0), (s6 + 7.61, crack(197), 0.7, 0), (s6 + 7.61, W(0.4, 198, False), 0.35, 0),
      (s6 + 8.9, W(0.8, 199), 0.5, 0), (s6 + 10.5, impact(200, 70, 1.0), 0.75, 0), (s6 + 12.4, W(0.6, 201, False), 0.45, 0),
      (s6 + 12.56, riser(1.2, 202), 0.55, 0), (s6 + 13.76, impact(203, 65, 1.3), 0.6, 0), (s6 + 13.7, shimmer(204, 1.4), 0.5, 0),
      (s6 + 16.6, pop(205, 900), 0.3, 0), (s6 + 18.6, pop(206, 700), 0.5, 0), (s6 + 19.3, impact(207, 80, 0.8), 0.45, 0), (s6 + 19.3, shimmer(208, 1.0), 0.35, 0),
      (s6 + 20.48, hp(noise(int(0.15 * SR), 209), 1200) * np.exp(-np.arange(int(0.15 * SR)) / SR * 40), 0.6, 0.3)]

for t0, x, g, pan in E:
    # nudge so the sound's peak lands one frame after the picture
    pk = int(np.argmax(np.abs(x))) / SR
    place(sfx, x, max(0.0, t0 - pk + 1 / 30), g, pan)
sfx = reverb(sfx, 1.4, 0.18, seed=9)
sfx *= 0.5 / np.max(np.abs(sfx))
sf.write(OUT + "/sfx.wav", sfx.astype(np.float32), SR, subtype="PCM_16")
print("music + sfx written;", len(E), "effects")
