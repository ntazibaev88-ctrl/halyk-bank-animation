"""Procedural score + sound design for «Астана — даладан дүниежүзілік елордаға дейін».

Everything is synthesised (no samples) so the project has no licensing issues.
Sections follow the storyboard:
  S1 wind + drone, title impact      S5 modern tech pulse
  S2 dombra gallop + kobyz drone     S6 bright inspiring strings
  S3 building orchestra + timpani    S7 golden build
  S4 warm piano + strings            S8 orchestral climax (D major)
The music is side-chain ducked under the voiceover so narration stays clear.
Outputs assets/audio/score.wav (stereo, 48 kHz).
"""
import json, os
import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = os.path.join(os.path.dirname(__file__), "..")
SR = 48000
T = 120.0
N = int(T * SR)
rng = np.random.default_rng(2026)

dry = np.zeros((2, N))      # music bus (gets reverb)
fx = np.zeros((2, N))       # sfx bus (less reverb)
amb = np.zeros((2, N))      # ambience (no ducking of wind beyond light)


def m2f(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}


def nm(s):
    """'D3' -> midi"""
    name, octv = s[:-1], int(s[-1])
    return 12 * (octv + 1) + NOTE[name]


def place(bus, sig, t0, pan=0.0, gain=1.0):
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    if sig.ndim == 1:
        l = sig * np.cos((pan + 1) * np.pi / 4) * gain
        r = sig * np.sin((pan + 1) * np.pi / 4) * gain
        sig = np.vstack([l, r]) * np.sqrt(2)
    else:
        sig = sig * gain
    i1 = min(N, i0 + sig.shape[1])
    bus[:, i0:i1] += sig[:, : i1 - i0]


def env_adsr(n, a, d, s, r, sustain_len=None):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    hold = max(0, n - a_n - d_n - r_n)
    e = np.concatenate([
        np.linspace(0, 1, max(1, a_n)) ** 1.5,
        np.linspace(1, s, max(1, d_n)),
        np.full(hold, s),
        np.linspace(s, 0, max(1, r_n)) ** 1.2,
    ])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


# ---------------------------------------------------------------- wavetables
TBL = 4096


def make_table(nharm, tilt):
    x = np.arange(TBL) / TBL
    w = np.zeros(TBL)
    for k in range(1, nharm + 1):
        w += np.sin(2 * np.pi * k * x) / k ** tilt
    return w / np.max(np.abs(w))


SAW_BRIGHT = make_table(48, 1.0)
SAW_SOFT = make_table(24, 1.35)
SAW_DARK = make_table(12, 1.7)
SQUAREISH = sum(np.sin(2 * np.pi * k * np.arange(TBL) / TBL) / k for k in range(1, 30, 2))
SQUAREISH /= np.max(np.abs(SQUAREISH))


def osc(table, freq, n, vib_rate=5.0, vib_depth=0.0, phase0=0.0, drift=0.0):
    t = np.arange(n) / SR
    f = freq * (1 + vib_depth * np.sin(2 * np.pi * vib_rate * t + phase0) + drift * np.sin(2 * np.pi * 0.13 * t + phase0 * 3))
    ph = (phase0 / (2 * np.pi) + np.cumsum(f) / SR) % 1.0
    idx = ph * TBL
    i0 = idx.astype(int)
    frac = idx - i0
    return table[i0] * (1 - frac) + table[(i0 + 1) % TBL] * frac


def lp(x, fc, order=2):
    fc = min(fc, SR / 2 * 0.95)
    b, a = signal.butter(order, fc / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, f0, f1, order=2):
    b, a = signal.butter(order, [f0 / (SR / 2), min(f1, SR / 2 * 0.95) / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def tv_band(x, fc_of, lo=0.5, hi=1.8, blk=512):
    """Time-varying band-pass with filter state carried between blocks (click-free)."""
    x = np.atleast_2d(x)
    out = np.zeros_like(x)
    n = x.shape[1]
    zi = None
    for i in range(0, n, blk):
        fc = fc_of(i / n, i / SR)
        b, a = signal.butter(2, [max(20, fc * lo) / (SR / 2), min(fc * hi, SR / 2 * 0.9) / (SR / 2)], "band")
        if zi is None:
            zi = np.zeros((x.shape[0], max(len(a), len(b)) - 1))
        out[:, i:i + blk], zi = signal.lfilter(b, a, x[:, i:i + blk], zi=zi)
    return out


# ---------------------------------------------------------------- instruments
def strings(notes, t0, dur, amp=0.12, attack=0.9, release=1.6, bright=2800, table=SAW_SOFT, voices=5, bus=None, spread=0.7):
    bus = dry if bus is None else bus
    n = int((dur + release) * SR)
    for j, m in enumerate(notes):
        f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
        for v in range(voices):
            det = (v - (voices - 1) / 2) * 0.0035
            s = osc(table, f * (1 + det), n, vib_rate=4.6 + 0.37 * v, vib_depth=0.0022, phase0=rng.uniform(0, 6.28), drift=0.0006)
            s = lp(s, bright)
            e = env_adsr(n, attack, 0.3, 0.85, release)
            pan = spread * ((v / max(1, voices - 1)) * 2 - 1) * (0.6 + 0.4 * ((j % 2) * 2 - 1) * 0.5)
            place(bus, s * e * amp / voices, t0, pan=float(np.clip(pan, -1, 1)))


def brass(notes, t0, dur, amp=0.10, attack=0.35, release=1.0):
    n = int((dur + release) * SR)
    for m in notes:
        f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
        s = sum(osc(SAW_BRIGHT, f * (1 + d), n, vib_rate=5.2, vib_depth=0.002, phase0=rng.uniform(0, 6.28)) for d in (-0.003, 0, 0.004)) / 3
        e = env_adsr(n, attack, 0.5, 0.8, release)
        dark, bright = lp(s, 700), lp(s, 3200)
        mix = dark * (1 - e * 0.7) + bright * (e * 0.7)
        place(dry, mix * e * amp, t0, pan=rng.uniform(-0.3, 0.3))


def pluck(m, t0, amp=0.25, decay=0.996, bright=0.5, pan=0.0, length=2.2, bus=None):
    """Karplus-Strong string (dombra-like when bright and short)."""
    bus = dry if bus is None else bus
    f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
    n = int(length * SR)
    L = SR / f
    Li = int(L)
    exc = np.zeros(n)
    burst = rng.uniform(-1, 1, Li)
    burst = lp(burst, 1500 + 6000 * bright)
    exc[:Li] = burst
    a = np.zeros(Li + 2)
    a[0] = 1
    a[Li] = -decay * 0.5
    a[Li + 1] = -decay * 0.5
    y = signal.lfilter([1.0], a, exc)
    # body resonance for a wooden instrument
    y = y + 0.5 * bp(y, 180, 420) + 0.3 * bp(y, 900, 1800)
    y *= np.exp(-np.arange(n) / SR / (length * 0.5))
    y /= np.max(np.abs(y)) + 1e-9
    place(bus, y * amp, t0, pan=pan)


def bell(m, t0, amp=0.12, length=3.0, pan=0.0):
    f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
    n = int(length * SR)
    t = np.arange(n) / SR
    parts = [(1, 1.0, 1.6), (2.0, 0.45, 0.9), (3.01, 0.22, 0.6), (4.2, 0.1, 0.35), (5.43, 0.05, 0.25)]
    y = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (d * length / 3)) for r, a, d in parts)
    y *= np.minimum(1, t / 0.004)
    place(dry, y * amp, t0, pan=pan)


def timpani(m, t0, amp=0.5, length=2.5, pan=0.0):
    f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
    n = int(length * SR)
    t = np.arange(n) / SR
    fr = f * (1 + 0.08 * np.exp(-t / 0.05))
    body = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.7)
    body += 0.4 * np.sin(2 * np.pi * np.cumsum(fr * 1.5) / SR) * np.exp(-t / 0.35)
    noise = lp(rng.standard_normal(n), 900) * np.exp(-t / 0.04) * 0.6
    place(dry, (body + noise) * amp, t0, pan=pan)


def timp_roll(m, t0, dur, amp=0.25):
    k = 0
    t = t0
    while t < t0 + dur:
        p = (t - t0) / dur
        timpani(m, t, amp=amp * (0.25 + 0.75 * p ** 2) * rng.uniform(0.8, 1.0), length=1.2, pan=0.2 * (-1) ** k)
        t += 0.065
        k += 1


def boom(t0, amp=0.9):
    n = int(4.0 * SR)
    t = np.arange(n) / SR
    f = 30 + 55 * np.exp(-t / 0.25)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 1.1)
    hit = lp(rng.standard_normal(n), 2500) * np.exp(-t / 0.08)
    tail = lp(rng.standard_normal(n), 400) * np.exp(-t / 1.2) * 0.25
    place(fx, (sub + 0.35 * hit + tail) * amp, t0)


def cymbal(t0, amp=0.25, length=4.0, reverse=False):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = hp(rng.standard_normal((2, n)), 5000, 2) + 0.4 * bp(rng.standard_normal((2, n)), 3000, 9000)
    e = np.exp(-t / (length / 4))
    if reverse:
        e = (t / length) ** 3
    sig = x * e * amp
    place(fx, sig, t0 - (length if reverse else 0))


def riser(t_end, length=3.0, amp=0.2, f0=200, f1=2400):
    n = int(length * SR)
    t = np.arange(n) / SR
    p = t / length
    noise = rng.standard_normal((2, n))
    out = tv_band(noise, lambda q, ts: f0 * (f1 / f0) ** q, 0.6, 1.6)
    tone = np.sin(2 * np.pi * np.cumsum(f0 / 2 * (f1 / f0) ** p) / SR) * 0.15
    sig = (out + tone) * p ** 2.2 * amp
    place(fx, sig, t_end - length)


def whoosh(t_mid, length=1.1, amp=0.18, pan_from=-0.7, pan_to=0.7):
    n = int(length * SR)
    t = np.arange(n) / SR
    p = t / length
    noise = rng.standard_normal(n)
    out = tv_band(noise, lambda q, ts: 300 + 3500 * np.sin(np.pi * q) ** 2)[0]
    e = np.sin(np.pi * p) ** 2
    pan = pan_from + (pan_to - pan_from) * p
    sig = np.vstack([out * e * np.cos((pan + 1) * np.pi / 4), out * e * np.sin((pan + 1) * np.pi / 4)]) * np.sqrt(2)
    place(fx, sig * amp, t_mid - length / 2)


def hat(t0, amp=0.05, length=0.07, pan=0.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 7000) * np.exp(-t / (length / 4))
    place(dry, x * amp, t0, pan=pan)


def frame_drum(t0, amp=0.25, pan=0.0):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = 95 * (1 + 0.5 * np.exp(-t / 0.02))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16) + 0.3 * bp(rng.standard_normal(n), 200, 1600) * np.exp(-t / 0.03)
    place(dry, x * amp, t0, pan=pan)


def sub_pulse(m, t0, amp=0.22, length=0.5):
    f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
    n = int(length * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / (length / 3)) * np.minimum(1, t / 0.005)
    place(dry, x * amp, t0)


def synth_arp(m, t0, amp=0.06, length=0.22, cutoff=2200, pan=0.0):
    f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
    n = int(length * SR)
    s = 0.6 * osc(SQUAREISH, f, n) + 0.4 * osc(SAW_BRIGHT, f * 1.005, n)
    t = np.arange(n) / SR
    s = lp(s, cutoff) * np.exp(-t / (length / 3)) * np.minimum(1, t / 0.003)
    place(dry, s * amp, t0, pan=pan)


def blip(t0, amp=0.08, f=1760):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t / 0.05)
    place(fx, x * amp, t0)
    place(fx, x * amp * 0.5, t0 + 0.09, pan=0.4)


def kobyz(m, t0, dur, amp=0.07):
    """Bowed, nasal, slightly rough drone (kobyz-like)."""
    f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
    n = int((dur + 1.0) * SR)
    s = osc(SAW_BRIGHT, f, n, vib_rate=5.5, vib_depth=0.006, drift=0.002)
    s = bp(s, 500, 2600) + 0.4 * lp(s, 400)
    s += 0.05 * bp(rng.standard_normal(n), 1500, 5000)  # bow noise
    e = env_adsr(n, 1.2, 0.5, 0.8, 1.0)
    place(dry, s * e * amp, t0, pan=-0.2)


def wind(t0, t1, amp=0.25):
    n = int((t1 - t0) * SR)
    t = np.arange(n) / SR
    out = np.zeros((2, n))
    for ch in range(2):
        w = np.cumsum(rng.standard_normal(n))  # brown
        w = hp(w, 40)
        w /= np.max(np.abs(w))
        y = tv_band(w, lambda q, ts: 430 + 200 * np.sin(2 * np.pi * 0.11 * ts + ch) + 120 * np.sin(2 * np.pi * 0.29 * ts + 1.7 * ch), 0.4, 2.2, 2048)[0]
        gust = 0.55 + 0.45 * np.sin(2 * np.pi * 0.09 * t + ch * 0.8) ** 2
        out[ch] = y / (np.max(np.abs(y)) + 1e-9) * gust
    fade = np.minimum(1, t / 1.5) * np.minimum(1, (t[-1] - t) / 2.0)
    place(amb, out * fade * amp, t0)


def reverb(x, seconds=2.8, wet=0.28, seed=4):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = r.standard_normal(n) * np.exp(-t / (seconds / 6.5))
        ir = lp(ir, 5200)
        ir[: int(0.012 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = signal.fftconvolve(x[ch], ir)[: x.shape[1]]
    return x * (1 - wet * 0.5) + out * wet


# ---------------------------------------------------------------- score
subs = json.load(open(os.path.join(ROOT, "src/data/subtitles.json")))
cue = json.load(open(os.path.join(ROOT, "src/data/cues.json")))


def chord(root_name, quality, octave=3):
    r = nm(root_name + str(octave))
    iv = {"min": [0, 3, 7], "maj": [0, 4, 7], "sus2": [0, 2, 7], "min9": [0, 3, 7, 14], "add9": [0, 4, 7, 14], "maj7": [0, 4, 7, 11]}[quality]
    return [r + i for i in iv]


def piano(m, t0, amp=0.1, length=3.5, pan=0.0):
    f = m2f(m) if not isinstance(m, str) else m2f(nm(m))
    n = int(length * SR)
    t = np.arange(n) / SR
    B = 0.0004
    y = np.zeros(n)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + B * k * k)
        if fk > SR / 2.2:
            break
        y += np.sin(2 * np.pi * fk * t + k) * (1 / k ** 1.25) * np.exp(-t * (0.9 + 0.55 * k))
    y += lp(rng.standard_normal(n), 3000) * np.exp(-t / 0.006) * 0.08
    y *= np.minimum(1, t / 0.003)
    place(dry, y * amp, t0, pan=pan)


def toms(t0, amp=0.35, f=70, pan=0.0):
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    fr = f * (1 + 0.6 * np.exp(-t / 0.03))
    y = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.35)
    y += 0.45 * lp(rng.standard_normal(n), 1200) * np.exp(-t / 0.05)
    place(dry, y * amp, t0, pan=pan)


def city(t0, t1, amp=0.05):
    n = int((t1 - t0) * SR)
    t = np.arange(n) / SR
    hum = lp(np.cumsum(rng.standard_normal((2, n)), axis=1), 120)
    hum /= np.max(np.abs(hum)) + 1e-9
    traffic = bp(rng.standard_normal((2, n)), 250, 1400)
    traffic *= (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + np.array([[0], [1.3]])) ** 2)
    traffic /= np.max(np.abs(traffic)) + 1e-9
    sig = 0.6 * hum + 0.4 * traffic
    fade = np.minimum(1, t / 1.5) * np.minimum(1, (t[-1] - t) / 1.5)
    place(amb, sig * fade * amp, t0)


D2, A2, D3, A3, D4 = nm("D2"), nm("A2"), nm("D3"), nm("A3"), nm("D4")
BPM = 84
beat = 60 / BPM
bar = beat * 4
s16 = beat / 4

# ---- S1 0-12: steppe sunrise — gentle piano and strings, a breath of wind
wind(0, 9.5, amp=0.12)
prog1 = [("D", "maj"), ("A", "maj"), ("B", "min"), ("G", "maj")]
t = 0.4
i = 0
while t < 9.6:
    r, q = prog1[i % 4]
    ch = chord(r, q, 4)
    arp = [ch[0] - 12, ch[1], ch[2], ch[0] + 12, ch[2], ch[1]]
    for j in range(6):
        piano(arp[j], t + j * beat * 0.66, amp=0.075 if j else 0.095, length=3.2, pan=-0.2 + 0.08 * j)
    if t > 1.5:
        strings(chord(r, q, 3), t, bar, amp=0.045 + 0.03 * (t / 9.6), attack=1.2, release=1.4, bright=1800)
    t += bar
    i += 1
cymbal(cue["title1"], amp=0.16, length=2.4, reverse=True)
boom(cue["title1"], amp=0.6)
timpani(D2, cue["title1"], amp=0.45)
strings(chord("D", "add9", 3) + [D2], cue["title1"], 2.6, amp=0.11, attack=0.05, release=1.8, bright=2600)
bell(nm("A5"), cue["title1"] + 0.2, amp=0.05, length=3)

# ---- S2 12-30: history — dombra gallop, strings, frame drum
mel = ["D4", "F#4", "A4", "B4", "A4", "F#4", "E4", "D4", "D4", "F#4", "A4", "D5", "B4", "A4", "F#4", "A4"]
t = 12.1
k = 0
while t < 25.8:
    bp_ = k % 4
    if bp_ != 1:
        m = mel[(k // 4) % len(mel)] if bp_ == 0 else ("D4" if bp_ == 2 else "A3")
        acc = 1.0 if bp_ == 0 else 0.7
        fade = min(1.0, (t - 12.1) / 1.2) * min(1.0, (25.8 - t) / 2.0)
        pluck(m, t, amp=0.14 * acc * fade, decay=0.994, bright=0.75, pan=-0.25, length=0.9)
        pluck("D3" if bp_ != 3 else "A2", t + 0.012, amp=0.08 * acc * fade, decay=0.993, bright=0.6, pan=0.2, length=0.8)
    t += s16
    k += 1
for i in range(7):
    frame_drum(12.1 + i * bar, amp=0.15, pan=0.1)
strings(chord("B", "min", 2) + [nm("F#3")], 12.1, 5.0, amp=0.06, bright=1300, attack=1.4)
strings(chord("G", "maj", 2) + [nm("D3")], 17.1, 3.6, amp=0.06, bright=1300)
strings(chord("E", "min", 3), 20.7, 1.6, amp=0.06, bright=1100)
strings(chord("A", "maj", 2) + [nm("E3")], 22.2, 4.4, amp=0.075, bright=1800)
strings(chord("D", "add9", 3), 26.6, 3.8, amp=0.09, bright=2600)
brass([nm("D2"), nm("A2")], 26.6, 3.4, amp=0.05)
timpani(D2, 26.6, amp=0.35)
riser(30.0, length=2.6, amp=0.1)

# ---- S3 30-45: the city transforms — cinematic percussion + ostinato
prog3 = [("B", "min"), ("G", "maj"), ("D", "maj"), ("A", "maj")]
t = 30.0
i = 0
cymbal(30.0, amp=0.12, length=2.5)
while t < 45.0:
    r, q = prog3[i % 4]
    p = (t - 30) / 15
    oc = 2 if r in ("G", "A") else 3
    strings(chord(r, q, oc) + [chord(r, q, oc)[0] + 12], t, bar, amp=0.06 + 0.06 * p, attack=0.35, release=0.9, bright=1600 + 2600 * p)
    for e8 in range(8):
        root = chord(r, q, 2)[0]
        pluck(root + (12 if e8 % 2 else 0), t + e8 * beat / 2, amp=0.05 + 0.06 * p, decay=0.99, bright=0.35, pan=0.3 if e8 % 2 else -0.3, length=0.5)
    # taiko-style pattern: 1 . . 1 . 1 1 .
    for b8 in [0, 3, 5, 6]:
        toms(t + b8 * beat / 2, amp=(0.18 + 0.22 * p) * (1.2 if b8 == 0 else 0.8), f=62 if b8 == 0 else 78, pan=(-0.2, 0.2)[b8 % 2])
    if t >= 37.5:
        brass(chord(r, q, 2)[:2], t, bar * 0.95, amp=0.04 + 0.05 * p)
        timpani(chord(r, q, 2)[0], t, amp=0.3 + 0.2 * p)
    t += bar
    i += 1
riser(45.0, length=3.0, amp=0.12)
timp_roll(D2, 43.0, 2.0, amp=0.22)
cymbal(45.0, amp=0.14, length=3.0)

# ---- S4 45-60: a city of people — warm piano + strings, soft city air
city(45.0, 77.0, amp=0.045)
prog4 = [("G", "maj"), ("D", "maj"), ("A", "maj"), ("B", "min")]
t = 45.0
i = 0
while t < 60.0:
    r, q = prog4[i % 4]
    ch = chord(r, q, 4)
    strings(chord(r, q, 3), t, bar, amp=0.055, attack=0.8, release=1.2, bright=1900)
    arp = [ch[0], ch[1], ch[2], ch[0] + 12, ch[2], ch[1], ch[0], ch[1]]
    for j in range(8):
        piano(arp[j], t + j * beat / 2, amp=0.06 if j else 0.075, length=2.6, pan=-0.3 + 0.6 * (j % 2))
    t += bar
    i += 1
blip(cue["pop2017"], amp=0.05, f=1318)
for k in range(14):
    hat(cue["popCount"] + k * 0.45, amp=0.03, pan=0.2)
bell(nm("D6"), cue["popFinal"], amp=0.06, length=3)
timpani(nm("D2"), cue["popFinal"], amp=0.3)

# ---- S5 60-77: economy — modern pulse
prog5 = [("B", "min"), ("G", "maj"), ("D", "maj"), ("A", "maj")]
t = 60.0
i = 0
whoosh(60.0, amp=0.12)
while t < 77.0:
    r, q = prog5[i % 4]
    ch = chord(r, q, 4)
    p = min(1, (t - 60) / 5)
    strings(chord(r, q, 3), t, bar, amp=0.04, attack=0.6, release=1.0, bright=1500, table=SAW_DARK)
    for j in range(16):
        tt = t + j * s16
        synth_arp([ch[0], ch[1], ch[2], ch[0] + 12][j % 4], tt, amp=0.032 * p, cutoff=1300 + 1800 * ((j % 8) / 8), pan=0.35 * np.sin(j))
        if j % 2 == 1:
            hat(tt, amp=0.03 * p, pan=0.3)
    for b4 in range(4):
        sub_pulse(chord(r, q, 1)[0], t + b4 * beat, amp=0.18 * p)
    toms(t, amp=0.15 * p, f=60)
    t += bar
    i += 1
blip(cue["grp"], amp=0.08)
boom(cue["grp"], amp=0.4)
riser(77.0, length=2.2, amp=0.08)

# ---- S6 77-92: budget — light, flowing, gentle infographic chimes
prog6 = [("G", "maj"), ("D", "maj"), ("E", "min"), ("A", "maj")]
t = 77.0
i = 0
while t < 92.0:
    r, q = prog6[i % 4]
    ch = chord(r, q, 4)
    strings(chord(r, q, 3) + [ch[0] + 12], t, bar, amp=0.05, attack=0.7, release=1.2, bright=2400)
    for j in range(8):
        pluck([ch[0], ch[2], ch[1] + 12, ch[2]][j % 4], t + j * beat / 2, amp=0.05, decay=0.996, bright=0.8, pan=-0.4 + 0.8 * (j % 2), length=1.3)
    t += bar
    i += 1
bell(nm("A5"), cue["budget"], amp=0.07, length=3)
bell(nm("D6"), cue["budget"] + 0.12, amp=0.05, length=3)
for k, note in enumerate(["D6", "E6", "F#6", "A6", "B6", "D7"]):
    bell(nm(note), cue["budgetFlow"] + 0.4 + k * 0.62, amp=0.035, length=1.6, pan=-0.5 + 0.2 * k)

# ---- S7 92-107: tourism — bright and inspiring
city(92.0, 107.0, amp=0.04)
prog7 = [("D", "maj"), ("A", "maj"), ("B", "min"), ("G", "maj")]
t = 92.0
i = 0
cymbal(92.0, amp=0.12, length=3)
while t < 107.0:
    r, q = prog7[i % 4]
    ch = chord(r, q, 4)
    strings(chord(r, q, 3) + [ch[0] + 12], t, bar, amp=0.065, attack=0.5, release=1.2, bright=3200)
    for j in range(8):
        pluck([ch[0], ch[2], ch[1] + 12, ch[2]][j % 4], t + j * beat / 2, amp=0.065, decay=0.996, bright=0.8, pan=-0.4 + 0.8 * (j % 2), length=1.4)
        hat(t + j * beat / 2 + beat / 4, amp=0.02, pan=-0.2)
    frame_drum(t, amp=0.12)
    frame_drum(t + beat * 2, amp=0.09)
    t += bar
    i += 1
for tc in cue["tourCuts"]:
    whoosh(tc, length=0.8, amp=0.08, pan_from=-0.5, pan_to=0.5)
blip(cue["tourists"], amp=0.06, f=1760)
blip(cue["foreign"], amp=0.06, f=2093)
timpani(nm("D2"), cue["tourists"], amp=0.28)

# ---- S8 107-120: the future — emotional climax
strings(chord("G", "maj", 2) + chord("G", "maj", 3), 107.0, 3.0, amp=0.09, attack=1.0, release=0.8, bright=2600)
strings(chord("A", "maj", 2) + chord("A", "maj", 3), 109.9, 2.8, amp=0.11, attack=0.6, release=0.8, bright=3200)
for k in range(8):
    piano(chord("D", "maj", 5)[k % 3], 107.0 + k * beat, amp=0.045, length=2.5, pan=-0.3 + 0.1 * k)
F8 = cue["title8"]
boom(F8, amp=0.55)
cymbal(F8, amp=0.2, length=3)
strings(chord("B", "min", 2) + chord("B", "min", 3) + [nm("F#5")], F8, cue["finalChord"] - F8, amp=0.13, attack=0.1, release=0.6, bright=4000, voices=6)
brass(chord("B", "min", 2), F8, cue["finalChord"] - F8, amp=0.08)
timp_roll(D2, cue["finalChord"] - 1.6, 1.6, amp=0.3)
cymbal(cue["finalChord"], amp=0.16, length=1.6, reverse=True)
final_t = cue["finalChord"]
strings(chord("D", "maj", 2) + chord("D", "maj", 3) + chord("D", "maj", 4) + [nm("A5")], final_t, 120 - final_t, amp=0.17, attack=0.1, release=1.5, bright=4600, voices=6)
brass(chord("D", "maj", 2) + [nm("A3")], final_t, 120 - final_t, amp=0.11)
timpani(D2, final_t, amp=0.7)
boom(final_t, amp=0.6)
cymbal(final_t, amp=0.28, length=5)
bell(nm("D6"), final_t, amp=0.06, length=4)
bell(nm("A5"), final_t + 0.4, amp=0.05, length=4)
for k in range(6):
    piano(chord("D", "maj", 5)[k % 3] + (12 if k > 2 else 0), final_t + 0.8 + k * beat / 2, amp=0.04, length=3)

# ---------------------------------------------------------------- mix
music = reverb(dry, 2.9, wet=0.32) + reverb(fx, 1.8, wet=0.18, seed=9) + amb

# bus compression so the bed has steady presence (hits do not set the level)
def block_env(x, blk, att_s, rel_s):
    pk = np.sqrt(np.mean(x[: len(x) // blk * blk].reshape(-1, blk) ** 2, axis=1))
    a_b, r_b = np.exp(-blk / (att_s * SR)), np.exp(-blk / (rel_s * SR))
    out = np.zeros_like(pk); acc = pk[0]
    for i, v in enumerate(pk):
        acc = a_b * acc + (1 - a_b) * v if v > acc else r_b * acc + (1 - r_b) * v
        out[i] = acc
    return out

mono = music.mean(0)
cenv = block_env(mono, 240, 0.08, 0.6) + 1e-6
target = np.median(cenv[cenv > np.percentile(cenv, 30)])
thr = target * 1.0
cg = np.where(cenv > thr, (thr * (cenv / thr) ** (1 / 3.0)) / cenv, 1.0)
# gentle upward lift for very quiet passages (max +6 dB)
cg *= np.clip((target * 0.5 / cenv) ** 0.5, 1.0, 2.0)
cg = np.repeat(cg, 240); cg = np.pad(cg, (0, N - len(cg)), constant_values=cg[-1])
music *= cg

music *= 10 ** (-16.5 / 20) / np.sqrt(np.mean(music ** 2))

# adaptive side-chain ducking: keep music >= MARGIN dB under the voice
MARGIN = 12.0
sr_vo, vo = wavfile.read(os.path.join(ROOT, "assets/audio/vo.wav"))
vo = vo.astype(np.float64) / 32768
vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
blk = 480  # 10 ms
nb = N // blk
def rms_db(x, win):
    p = np.mean(x[: nb * blk].reshape(nb, blk) ** 2, axis=1)
    k = np.ones(win) / win
    return 10 * np.log10(np.convolve(p, k, mode="same") + 1e-12)
vo_db = rms_db(vo, 30)                 # 300 ms
mu_db = rms_db(music.mean(0), 30)
active = vo_db > -42
need = np.where(active, np.minimum(0.0, (vo_db - MARGIN) - mu_db), 0.0)
need = np.minimum(need, np.where(active, -3.0, 0.0))  # always a little room for the voice
need = np.maximum(need, -20.0)
# look-ahead / hold: duck slightly before and after words
from scipy.ndimage import minimum_filter1d
need = minimum_filter1d(need, size=35)
g = np.zeros_like(need); acc = 0.0
for i, v in enumerate(need):
    acc = v if v < acc else acc + (v - acc) * (1 - np.exp(-1 / 40))  # 400 ms release
    g[i] = acc
g = np.convolve(g, np.ones(8) / 8, mode="same")  # smooth attack
gain = np.repeat(10 ** (g / 20), blk)
gain = np.pad(gain, (0, N - len(gain)), constant_values=1.0)
music *= gain

# final fade and soft limit
t = np.arange(N) / SR
music *= np.minimum(1, t / 0.4) * np.clip((120 - t) / 1.6, 0, 1) ** 1.3
music = np.tanh(music * 1.6) / 1.6
music = np.clip(music, -0.89, 0.89)
wavfile.write(os.path.join(ROOT, "assets/audio/score.wav"), SR, (music.T * 32767).astype(np.int16))
print("score written", music.shape, "peak", np.max(np.abs(music)))
