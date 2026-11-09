"""Original cinematic score for "Қазақстан — 35 жыл", synthesised from scratch (no samples, no licences needed).
Soft piano + dombra motif -> strings -> percussion & ostinato -> full climax on "35" -> final D-major chord.
Writes assets/music/score_raw.wav (dry mix) and assets/music/score.wav (ducked under the voice, -1 dBTP).
Usage: python3 tools/compose_score.py   (needs numpy, scipy, soundfile)"""
import json, os
import numpy as np
import soundfile as sf
from scipy import signal

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(R, *a)
TL = json.load(open(P("script/timeline.json")))
SR = 48000
DUR = TL["duration"]
N = int(DUR * SR)
rng = np.random.default_rng(1991)
mix = {k: np.zeros((N, 2)) for k in ["piano", "strings", "low", "choir", "brass", "perc", "fx", "pluck"]}

def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)

NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
def nm(s):  # "F#4" -> midi
    return NOTE[s[:-1]] + 12 * (int(s[-1]) + 1)

def place(bus, t0, x, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N or i + len(x) <= 0:
        return
    if i < 0:
        x = x[-i:]; i = 0
    x = x[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[bus][i:i + len(x), 0] += x * gain * l * 1.414
    mix[bus][i:i + len(x), 1] += x * gain * r * 1.414

def env_adsr(n, a, d, s, rel, total):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    rel_start = total - rel
    e = np.where(t > rel_start, e * np.clip(1 - (t - rel_start) / max(rel, 1e-4), 0, 1), e)
    return e

def lp(x, fc, order=2):
    b, a = signal.butter(order, min(fc / (SR / 2), 0.99))
    return signal.lfilter(b, a, x)

def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x)

def saw(f, n, detune_cents=0.0, vib=0.0, phase=0.0):
    t = np.arange(n) / SR
    ff = f * 2 ** (detune_cents / 1200) * (1 + vib * np.sin(2 * np.pi * 5.2 * t + phase))
    ph = np.cumsum(ff) / SR + phase
    return 2 * (ph % 1.0) - 1

# ---------------- instruments ----------------
def piano(note, t0, dur, vel=0.6, pan=0.0):
    f = midi(note); n = int((dur + 2.5) * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(1, 11):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        if fk > 12000: break
        x += (1 / k ** 1.25) * np.sin(2 * np.pi * fk * t + k) * np.exp(-t * (0.7 + 0.45 * k) * (f / 260) ** 0.3)
    x *= np.minimum(t / 0.004, 1)
    off = np.clip(1 - (t - dur) / 0.35, 0, 1)
    x *= np.where(t > dur, off, 1)
    ham = lp(rng.standard_normal(int(0.02 * SR)), 2500) * np.exp(-np.arange(int(0.02 * SR)) / (0.004 * SR)) * 0.15
    x[: len(ham)] += ham
    place("piano", t0, x * vel * 0.32, pan)

def strings(notes, t0, dur, vel=0.5, att=0.9, rel=1.4, bright=2600, bus="strings"):
    n = int((dur + rel) * SR)
    e = env_adsr(n, att, 2.0, 0.85, rel, dur + rel)
    for j, note in enumerate(notes):
        f = midi(note)
        for c, pan in [(-7, -0.6), (-2, -0.2), (3, 0.25), (8, 0.6)]:
            x = saw(f, n, c, 0.0035, phase=rng.random())
            x = lp(x, bright, 2)
            place(bus, t0, x * e * vel * 0.055, pan + (j - len(notes) / 2) * 0.04)

def brass(notes, t0, dur, vel=0.5):
    n = int((dur + 0.6) * SR); t = np.arange(n) / SR
    e = env_adsr(n, 0.25, 1.5, 0.8, 0.6, dur + 0.6)
    for note in notes:
        f = midi(note)
        x = saw(f, n, 0, 0.002) + saw(f, n, 5, 0.002)
        # opening filter: segment-wise
        out = np.zeros(n); seg = int(0.05 * SR)
        for s0 in range(0, n, seg):
            fc = 500 + 2600 * min(1, (s0 / SR) / 0.7)
            out[s0:s0 + seg] = lp(x[max(0, s0 - 200):s0 + seg], fc)[-len(out[s0:s0 + seg]):]
        place("brass", t0, out * e * vel * 0.06, 0.0)

def choir(notes, t0, dur, vel=0.5):
    n = int((dur + 2) * SR)
    e = env_adsr(n, 1.4, 2.0, 0.9, 2.0, dur + 2)
    for note in notes:
        f = midi(note)
        x = sum(saw(f, n, c, 0.006, phase=rng.random()) for c in (-9, 0, 9))
        y = np.zeros(n)
        for fc, q, g in [(730, 6, 1.0), (1090, 7, 0.6), (2440, 9, 0.25)]:
            b, a = signal.iirpeak(fc / (SR / 2), q)
            y += signal.lfilter(b, a, x) * g
        place("choir", t0, y * e * vel * 0.03, 0.0)

def low(note, t0, dur, vel=0.6):
    n = int((dur + 0.8) * SR)
    e = env_adsr(n, 0.04, 0.4, 0.7, 0.5, dur + 0.8)
    f = midi(note)
    x = lp(saw(f, n) + 0.6 * np.sin(2 * np.pi * f / 2 * np.arange(n) / SR), 900)
    place("low", t0, x * e * vel * 0.12, 0.0)

def timpani(note, t0, vel=0.8, decay=1.6):
    f = midi(note); n = int((decay + 0.5) * SR); t = np.arange(n) / SR
    fr = f * (1 + 0.06 * np.exp(-t * 20))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) + 0.5 * np.sin(1.5 * ph) * np.exp(-t * 3) + 0.3 * np.sin(2 * ph) * np.exp(-t * 4)
    x *= np.exp(-t / decay * 2.2)
    x += lp(rng.standard_normal(n), 1800) * np.exp(-t * 40) * 0.6
    place("perc", t0, x * vel * 0.5, 0.0)

def taiko(t0, vel=0.7, f=62):
    n = int(0.9 * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.7 * np.exp(-t * 30))) / SR
    x = np.sin(ph) * np.exp(-t * 6) + lp(rng.standard_normal(n), 900) * np.exp(-t * 25) * 0.5
    place("perc", t0, x * vel * 0.55, 0.0)

def shaker(t0, vel=0.2, pan=0.3):
    n = int(0.12 * SR); t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 6000) * np.exp(-t * 45)
    place("perc", t0, x * vel * 0.25, pan)

def crash(t0, vel=0.6):
    n = int(3.5 * SR); t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 4000) * np.exp(-t * 1.4)
    place("fx", t0, x * vel * 0.18, -0.2); place("fx", t0, np.roll(x, 400) * vel * 0.18, 0.2)

def swell(t_end, length=2.5, vel=0.5):
    n = int(length * SR); t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 3000) * (t / length) ** 3
    place("fx", t_end - length, x * vel * 0.22, -0.15); place("fx", t_end - length, np.roll(x, 300) * vel * 0.22, 0.15)

def boom(t0, vel=0.9):
    n = int(3.0 * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(46 * (1 + 1.5 * np.exp(-t * 12))) / SR
    x = np.sin(ph) * np.exp(-t * 1.6) + lp(rng.standard_normal(n), 400) * np.exp(-t * 8) * 0.6
    place("fx", t0, x * vel * 0.55, 0.0)

def pluck(note, t0, vel=0.5, pan=-0.2, dur=1.6):
    """Karplus-Strong string — a dombra-like voice."""
    f = midi(note); n = int(dur * SR); L = int(SR / f)
    buf = lp(rng.standard_normal(L), 5000) * 0.8
    out = np.zeros(n); b = buf.copy()
    for i in range(0, n, L):
        seg = b[: min(L, n - i)]
        out[i:i + len(seg)] = seg
        b = 0.996 * 0.5 * (b + np.roll(b, 1))
    out = lp(out, 3800) * np.exp(-np.arange(n) / SR * 1.8)
    place("pluck", t0, out * vel * 0.5, pan)

# ---------------- new instruments ----------------
mix["kobyz"] = np.zeros((N, 2)); mix["dombra"] = np.zeros((N, 2)); mix["synth"] = np.zeros((N, 2)); mix["wind"] = np.zeros((N, 2))
def kobyz(note, t0, dur, vel=0.5, glide_from=None, pan=0.15):
    """Bowed horsehair fiddle: raspy saw + bow noise through nasal formants, slow vibrato."""
    n = int((dur + 0.4) * SR); t = np.arange(n) / SR
    f1 = midi(note); f0 = midi(glide_from) if glide_from is not None else f1
    f = f1 + (f0 - f1) * np.exp(-t / 0.12)
    vib = 1 + 0.008 * np.sin(2 * np.pi * 5.6 * t) * np.clip(t / 0.6, 0, 1)
    ph = np.cumsum(f * vib) / SR
    x = (2 * (ph % 1.0) - 1) * 0.8 + np.sign(np.sin(2 * np.pi * ph)) * 0.25
    x += lp(rng.standard_normal(n), 3500) * 0.18 * (0.6 + 0.4 * np.sin(2 * np.pi * 3.1 * t))
    y = np.zeros(n)
    for fc, q, g in [(560, 4, 1.0), (1350, 5, 0.7), (2900, 6, 0.35)]:
        bq, aq = signal.iirpeak(fc / (SR / 2), q); y += signal.lfilter(bq, aq, x) * g
    e = env_adsr(n, 0.18, 1.0, 0.85, 0.35, dur + 0.4)
    place("kobyz", t0, y * e * vel * 0.05, pan)
def dombra(note, t0, vel=0.6, pan=-0.1, dur=1.3, drone=None):
    """Two-string plucked lute (Karplus-Strong) with a bright attack; optional open-string drone."""
    for k, nt in enumerate([note] + ([drone] if drone is not None else [])):
        f = midi(nt); n = int(dur * SR); L = max(2, int(round(SR / f)))
        buf = lp(rng.standard_normal(L), 6500) * 0.9
        out = np.zeros(n); b = buf.copy()
        for i in range(0, n, L):
            seg = b[: min(L, n - i)]; out[i:i + len(seg)] = seg
            b = 0.997 * 0.5 * (b + np.roll(b, 1))
        body = signal.lfilter(*signal.iirpeak(260 / (SR / 2), 2.5), out) * 0.6 + out
        body = lp(body, 5200) * np.exp(-np.arange(n) / SR * 2.2)
        place("dombra", t0 + k * 0.012, body * vel * (0.55 if k else 0.75) * 0.5, pan + k * 0.1)
def framedrum(t0, vel=0.6):
    n = int(0.7 * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(88 * (1 + 0.35 * np.exp(-t * 25))) / SR
    x = np.sin(ph) * np.exp(-t * 7) + hp(rng.standard_normal(n), 1800) * np.exp(-t * 30) * 0.35
    place("perc", t0, x * vel * 0.42, 0.05)
def arp(note, t0, vel=0.3, pan=0.0):
    n = int(0.32 * SR); t = np.arange(n) / SR; f = midi(note)
    x = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + saw(f, n, 7) * 0.5
    x = (lp(x, 1600) + lp(x, 5000) * np.exp(-t * 14) * 0.6) * np.exp(-t * 9)
    place("synth", t0, x * vel * 0.09, pan)
def wind(t0, dur, vel=0.4):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); y = np.zeros(n); seg = int(0.05 * SR)
    for s0 in range(0, n, seg):
        fc = 700 + 300 * np.sin(s0 / SR * 0.7) + 150 * np.sin(s0 / SR * 1.9)
        bq, aq = signal.iirpeak(fc / (SR / 2), 3); y[s0:s0 + seg] = signal.lfilter(bq, aq, x[max(0, s0 - 400):s0 + seg])[-len(y[s0:s0 + seg]):]
    e = np.minimum(1, t / 2.0) * np.minimum(1, (dur - t) / 2.0)
    place("wind", t0, y * e * vel * 0.12, -0.3); place("wind", t0, np.roll(y, 9000) * e * vel * 0.12, 0.3)

# ---------------- arrangement ----------------
BPM = 96.0; beat = 60 / BPM; u = beat / 3      # 6/8 feel: three strokes per beat
bar = beat * 2
def chord(root, q): r = nm(root); return [r, r + (3 if q == "m" else 4), r + 7]
PROG = [("D3", "m"), ("A#2", ""), ("F3", ""), ("C3", "")]     # Dm – Bb – F – C
def prog_at(t, t0, per=2 * bar): return PROG[int((t - t0) // per) % 4]
# kui-like dombra motifs in D minor/Dorian, durations in strokes (u)
MA = [("D4", 2), ("E4", 1), ("F4", 2), ("G4", 1), ("A4", 3), ("G4", 1), ("F4", 1), ("E4", 1), ("D4", 2), ("C4", 1), ("D4", 3), ("A3", 3), ("D4", 3)]
MB = [("F4", 2), ("G4", 1), ("A4", 2), ("C5", 1), ("D5", 3), ("C5", 1), ("A4", 2), ("G4", 2), ("F4", 1), ("E4", 2), ("D4", 1), ("D4", 6)]
def play_motif(m, t0, vel=0.6, octave=0, drone="D3", pan=-0.1, swing=0.0):
    t = t0
    for i, (nt, d) in enumerate(m):
        dombra(nm(nt) + 12 * octave, t + (swing if i % 2 else 0), vel * (1.0 if i % 3 == 0 else 0.82), pan, dur=1.2, drone=nm(drone) if drone and i % 3 == 0 else None)
        t += d * u
    return t
def strum(t0, t1, root, vel=0.4):  # rhythmic double-string strumming (қағыс)
    t = t0; k = 0
    pat = [1.0, 0.45, 0.7, 0.4, 0.85, 0.45]
    while t < t1:
        a = pat[k % 6]
        dombra(nm(root) + 12, t, vel * a, -0.15, dur=0.5, drone=nm(root) + 7 + 12 if k % 3 == 0 else None)
        t += u; k += 1

S = [s["start"] for s in TL["scenes"]]
# A · opening 0–13.9: wind, drone, solo dombra, piano enters on "1991"
wind(0.0, 16.0, 0.7)
strings([nm("D2"), nm("A2")], 0.0, 14.5, 0.35, att=3.0, rel=2.5, bright=700, bus="low")
t = play_motif(MA, 0.35, 0.62); t = play_motif(MB, t + u, 0.58)
for i, (r, q) in enumerate([("D3", "m"), ("A#2", ""), ("F3", ""), ("C3", "")]):
    tt = 8.2 + i * 1.5; c = chord(r, q)
    for k, nn in enumerate([c[0] + 12, c[1] + 12, c[2] + 12, c[1] + 24]): piano(nn, tt + k * 0.18, 1.4, 0.32, pan=0.2)
# B · 13.9–31.5: kobyz voice, soft strings, heartbeat frame drum
t = S[1]
while t < S[2]:
    r, q = prog_at(t, S[1]); c = chord(r, q)
    strings([c[0], c[1] + 12, c[2] + 12], t, 2 * bar, 0.4, att=1.2, rel=1.2, bright=2000)
    low(c[0] - 12, t, 2 * bar - 0.1, 0.35)
    framedrum(t, 0.45); framedrum(t + beat * 2, 0.3)
    t += 2 * bar
for (nt, t0, d, gl) in [("A4", 14.6, 2.4, "G4"), ("G4", 17.2, 1.2, None), ("F4", 18.5, 2.2, "E4"), ("D4", 21.0, 2.6, "C4"), ("A4", 24.0, 1.8, None), ("C5", 26.0, 1.4, "A4"), ("A4", 27.6, 3.4, None)]:
    kobyz(nm(nt), t0, d, 0.5, nm(gl) if gl else None)
t = play_motif(MA, 19.2, 0.4, pan=-0.35)
# C · 31.5–43.5: Astana and the cities — strings swell, piano arps, then dombra strumming
t = S[2]
while t < S[3]:
    r, q = prog_at(t, S[2]); c = chord(r, q)
    strings([c[0], c[1] + 12, c[2] + 12, c[0] + 24], t, 2 * bar, 0.5, att=0.6, rel=1.0, bright=3000)
    for k in range(12): piano([c[0], c[1], c[2]][k % 3] + 24, t + k * u * 2, u * 2, 0.26, pan=0.3)
    if t >= 37.0: strum(t, t + 2 * bar, ["D3", "A#2", "F3", "C3"][PROG.index((r, q))], 0.42)
    framedrum(t, 0.5)
    t += 2 * bar
# D · 43.5–62.3: natural wealth and industry — percussion, ostinato, brass swells
boom(S[3], 0.7); crash(S[3], 0.4)
t = S[3]
while t < S[4]:
    r, q = prog_at(t, S[3]); c = chord(r, q)
    strings([c[0], c[1] + 12, c[2] + 12, c[0] + 24], t, 2 * bar, 0.55, att=0.3, rel=0.8, bright=3600)
    for k in range(12): low(c[0] - 12 + (12 if k % 3 == 2 else 0), t + k * u * 2, u * 1.4, 0.5)
    for k in range(4):
        taiko(t + k * beat, 0.8 if k % 2 == 0 else 0.5, 60); framedrum(t + k * beat + u * 2, 0.35)
    if t >= 50: brass([c[0], c[2]], t, 2 * bar - 0.3, 0.42)
    strum(t, t + 2 * bar, ["D3", "A#2", "F3", "C3"][PROG.index((r, q))], 0.3)
    t += 2 * bar
# E · 62.3–71.8: agriculture — warm, light: piano, strings, dombra motif B
t = S[4]
while t < S[5]:
    r, q = prog_at(t, S[4]); c = chord(r, q)
    strings([c[0], c[1] + 12, c[2] + 12], t, 2 * bar, 0.45, att=0.8, rel=1.0, bright=2600)
    for k in range(6): piano([c[0], c[2], c[1] + 12][k % 3] + 12, t + k * beat * 0.66, beat, 0.3, pan=-0.2)
    framedrum(t, 0.35)
    t += 2 * bar
play_motif(MB, S[4] + 0.4, 0.5, pan=0.1); play_motif(MA, S[4] + 5.2, 0.45, pan=0.1)
# F · 71.8–84.2: education and culture — the dombra leads, the kobyz answers
t = S[5]
while t < S[6]:
    r, q = prog_at(t, S[5]); c = chord(r, q)
    strings([c[0], c[2] + 12], t, 2 * bar, 0.32, att=1.0, rel=1.0, bright=1800)
    framedrum(t, 0.4); framedrum(t + beat, 0.25)
    t += 2 * bar
t = play_motif(MA, S[5] + 0.2, 0.7, pan=-0.05); t = play_motif(MB, t + u, 0.66, pan=-0.05)
for (nt, t0, d, gl) in [("D5", 79.0, 1.6, "C5"), ("A4", 80.8, 1.4, None), ("C5", 82.4, 1.6, "A#4")]: kobyz(nm(nt), t0, d, 0.45, nm(gl) if gl else None)
# G · 84.2–94.0: modern Kazakhstan — electronic pulse blended with orchestra and dombra
t = S[6]
while t < S[7]:
    r, q = prog_at(t, S[6]); c = chord(r, q)
    strings([c[0], c[1] + 12, c[2] + 12, c[1] + 24], t, 2 * bar, 0.5, att=0.4, rel=0.8, bright=3800)
    for k in range(24): arp([c[0] + 24, c[1] + 24, c[2] + 24, c[0] + 36][k % 4], t + k * u, 0.35, 0.4 if k % 2 else -0.4)
    for k in range(12): low(c[0] - 12, t + k * u * 2, u * 1.2, 0.5)
    for k in range(4): taiko(t + k * beat, 0.7 if k % 2 == 0 else 0.45, 62); shaker(t + k * beat + u, 0.25, 0.3)
    t += 2 * bar
# H · 94.0–110.8: people and the path — emotional build
t = S[7]
while t < 110.8:
    r, q = prog_at(t, S[7]); c = chord(r, q)
    strings([c[0], c[1] + 12, c[2] + 12, c[0] + 24], t, 2 * bar, 0.55 + 0.1 * (t > 103), att=0.6, rel=0.9, bright=3200)
    choir([c[0] + 12, c[1] + 12, c[2] + 12], t, 2 * bar, 0.35 + 0.15 * (t > 103))
    for k in range(6): piano([c[0], c[1], c[2]][k % 3] + 24, t + k * beat * 0.66, beat, 0.28, pan=0.25)
    framedrum(t, 0.45)
    if t > 103: taiko(t, 0.6, 58); taiko(t + beat * 2, 0.45, 60)
    t += 2 * bar
play_motif(MB, 98.2, 0.5, pan=-0.2)
hit = 110.8
for k in range(36): timpani(nm("D2"), hit - 2.2 + k * 0.06, 0.1 + 0.45 * (k / 36) ** 2, decay=0.5)
swell(hit, 3.0, 0.7)
# I · 110.8–120: the climax — full orchestra, dombra on top, final D major
boom(hit, 0.9); crash(hit, 0.7); timpani(nm("D2"), hit, 1.0, 2.2)
CL = [("A#2", ""), ("F3", ""), ("C3", "")]
for i, (r, q) in enumerate(CL):
    t0 = hit + i * bar; c = chord(r, q)
    strings([c[0] - 12, c[0], c[1] + 12, c[2] + 12, c[0] + 24], t0, bar, 0.72, att=0.08, rel=0.5, bright=4500)
    brass([c[0], c[1], c[2]], t0, bar - 0.15, 0.6); choir([c[0] + 12, c[1] + 12, c[2] + 12], t0, bar, 0.55)
    for k in range(4): taiko(t0 + k * bar / 4, 0.8 if k == 0 else 0.45, 58)
play_motif(MB, hit + 0.1, 0.75, pan=0.0)
fin = hit + 3 * bar
D = DUR - fin
strings([nm("D2"), nm("D3"), nm("F#3"), nm("A3"), nm("D4"), nm("F#4"), nm("A4")], fin, D - 1.4, 0.7, att=0.15, rel=1.6, bright=4200)
choir([nm("D4"), nm("F#4"), nm("A4"), nm("D5")], fin, D - 1.6, 0.55); brass([nm("D3"), nm("A3"), nm("D4")], fin, D - 2.2, 0.5)
timpani(nm("D2"), fin, 1.0, 2.6); crash(fin, 0.6); boom(fin, 0.6)
for k, nn in enumerate(["D4", "F#4", "A4", "D5"]): dombra(nm(nn), fin + 0.3 + k * 0.21, 0.7, 0.0, dur=2.0)
dombra(nm("D4"), fin + 1.4, 0.8, 0.0, dur=3.0, drone=nm("A3"))
# soft transition accents at scene changes
for s in TL["scenes"][1:]:
    if s["start"] < 110: swell(s["start"] + 0.02, 1.2, 0.3)

# ---------------- mix ----------------
def reverb_ir(seconds=2.6, damp=3500):
    n = int(seconds * SR); t = np.arange(n) / SR
    ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-t * 6.9 / seconds)[:, None]
    ir[:, 0] = lp(ir[:, 0], damp); ir[:, 1] = lp(ir[:, 1], damp)
    ir[: int(0.012 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum(0)).max()

IR = reverb_ir()
gains = {"piano": 1.0, "strings": 1.0, "low": 0.5, "choir": 0.9, "brass": 0.85, "perc": 0.75, "fx": 0.7, "pluck": 1.0, "kobyz": 1.0, "dombra": 1.25, "synth": 0.8, "wind": 0.8}
sends = {"piano": 0.35, "strings": 0.45, "low": 0.1, "choir": 0.6, "brass": 0.3, "perc": 0.2, "fx": 0.3, "pluck": 0.35, "kobyz": 0.4, "dombra": 0.3, "synth": 0.25, "wind": 0.5}
dry = np.zeros((N, 2)); wet_in = np.zeros((N, 2))
for k, v in mix.items():
    dry += v * gains[k]; wet_in += v * gains[k] * sends[k]
wet = np.stack([signal.fftconvolve(wet_in[:, c], IR[:, c])[:N] for c in range(2)], 1)
out = dry + wet * 0.8
out = hp(out.T, 70, 4).T
b_, a_ = signal.iirpeak(2800 / (SR / 2), 1.2); out = out + 0.15 * signal.lfilter(b_, a_, out, axis=0)  # a little presence so it reads on phones
# gentle bus glue (soft clip) and normalise to -1 dBTP
out = np.tanh(out / np.abs(out).max() * 1.4) / np.tanh(1.4)
fade = np.ones(N); fl = int(2.0 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
fi = int(0.05 * SR); fade[:fi] = np.linspace(0, 1, fi)
out *= fade[:, None]
out *= 10 ** (-1.0 / 20) / np.abs(out).max()
os.makedirs(P("assets/music"), exist_ok=True)
sf.write(P("assets/music/score_raw.wav"), out.astype(np.float32), SR, subtype="PCM_24")

# ---------------- duck under the voice ----------------
v, vsr = sf.read(P("assets/voice/voiceover_full.wav"))
if v.ndim > 1: v = v.mean(1)
if vsr != SR: v = signal.resample_poly(v, SR, vsr)
v = np.pad(v, (0, max(0, N - len(v))))[:N]
win = int(0.03 * SR)
envv = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, mode="same"))
active = (envv > 0.02).astype(float)
# attack 60 ms, release 450 ms
g = np.zeros(N); a_c, r_c = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.45 * SR)); y = 0.0
for i in range(0, N, 48):
    tgt = active[i]
    c = a_c ** 48 if tgt > y else r_c ** 48
    y = tgt + (y - tgt) * c
    g[i:i + 48] = y
duck = 1 - 0.5 * g   # about -6 dB under speech
bed = out * duck[:, None]
sf.write(P("assets/music/score.wav"), bed.astype(np.float32), SR, subtype="PCM_24")
print("score written", out.shape, "peak", np.abs(bed).max())
