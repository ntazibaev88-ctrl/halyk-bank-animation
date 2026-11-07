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

# ---------------- arrangement ----------------
BPM = 84.0
beat = 60 / BPM
bar = beat * 4
def chord_tones(root, quality):
    r = nm(root)
    return [r, r + (3 if quality == "m" else 4), r + 7]

# section map (seconds)
S = {s["id"]: s for s in TL["scenes"]}
prog_a = [("B3", "m"), ("G3", ""), ("D3", ""), ("A3", "")]          # Bm G D A
prog_b = [("D3", ""), ("A3", ""), ("B3", "m"), ("G3", "")]          # D A Bm G
prog_c = [("G3", ""), ("D3", ""), ("A3", ""), ("B3", "m")]          # G D A Bm

def chord_at(t, prog, t0, dur_per=2 * bar):
    i = int((t - t0) // dur_per) % len(prog)
    return prog[i]

# 0–10: dombra motif + soft piano + low drone
motif = [("A3", 0.0), ("D4", 0.22), ("E4", 0.44), ("F#4", 0.66), ("E4", 1.1), ("D4", 1.32), ("A3", 1.76), ("B3", 2.2), ("D4", 2.42)]
for nt, dt in motif:
    pluck(nm(nt), 0.15 + dt, 0.55, -0.25)
for nt, dt in motif[:6]:
    pluck(nm(nt) + 12 if nt != "A3" else nm(nt), 5.3 + dt, 0.35, 0.3)
strings([nm("D2"), nm("A2")], 0.0, 10.5, 0.45, att=2.5, rel=2.0, bright=900, bus="low")
t = 2.6
while t < 23.0:
    root, q = chord_at(t, prog_a, 2.6)
    tones = chord_tones(root, q)
    pat = [tones[0] + 12, tones[1] + 12, tones[2] + 12, tones[1] + 24, tones[2] + 12, tones[1] + 12]
    for k, nn in enumerate(pat):
        piano(nn, t + k * beat / 1.5, beat * 1.4, 0.45 + 0.1 * (k == 0), pan=-0.3 + 0.12 * k)
    piano(tones[0] - 12, t, bar * 2, 0.4)
    t += 2 * bar

# 10–35: strings bed, enters at the first-steps chapter
t = 10.0
while t < 35.0:
    root, q = chord_at(t, prog_a, 10.0)
    tones = chord_tones(root, q)
    strings([tones[0], tones[1] + 12, tones[2] + 12], t, 2 * bar, 0.42 if t < 23 else 0.5, att=1.1, rel=1.3, bright=2200)
    low(tones[0] - 12, t, 2 * bar - 0.1, 0.45)
    t += 2 * bar
# 23–35: piano carries on, gentle pulse
t = 23.0
while t < 35.0:
    root, q = chord_at(t, prog_a, 23.0)
    tones = chord_tones(root, q)
    for k in range(8):
        piano(tones[k % 3] + 24, t + k * beat / 2, beat / 2, 0.3, pan=0.35)
    for k in range(8):
        low(tones[0] - 12, t + k * beat, beat * 0.45, 0.35)
    t += 2 * bar
# 35–64: industry + EXPO — percussion and string ostinato
t = 35.0
while t < 64.4:
    root, q = chord_at(t, prog_b, 35.0)
    tones = chord_tones(root, q)
    strings([tones[0], tones[1] + 12, tones[2] + 12, tones[0] + 24], t, 2 * bar, 0.55, att=0.5, rel=1.0, bright=3200)
    for k in range(16):
        low(tones[0] - 12 + (12 if k % 4 == 2 else 0), t + k * beat / 2, beat * 0.32, 0.5)
    for k in range(8):
        taiko(t + k * beat, 0.75 if k % 4 == 0 else 0.45, 58 if k % 2 == 0 else 70)
        shaker(t + k * beat + beat / 2, 0.25, 0.4 if k % 2 else -0.4)
    if t >= 51.0:
        brass([tones[0], tones[2]], t, 2 * bar - 0.3, 0.45)
        for k in range(16):
            piano(tones[k % 3] + 24 + (12 if k % 8 == 7 else 0), t + k * beat / 2, beat / 2, 0.28, pan=-0.35)
    t += 2 * bar
# 64.4–86.4: modern Kazakhstan — bright arpeggios, fuller drums
t = 64.4
while t < 86.4:
    root, q = chord_at(t, prog_c, 64.4)
    tones = chord_tones(root, q)
    strings([tones[0], tones[1] + 12, tones[2] + 12, tones[1] + 24], t, 2 * bar, 0.55, att=0.4, rel=0.9, bright=3800)
    for k in range(32):
        nn = [tones[0] + 24, tones[1] + 24, tones[2] + 24, tones[1] + 36][k % 4]
        pluck(nn, t + k * beat / 4, 0.22, 0.45 if k % 2 else -0.45, dur=0.6)
    for k in range(16):
        low(tones[0] - 12, t + k * beat / 2, beat * 0.3, 0.55)
    for k in range(8):
        taiko(t + k * beat, 0.8 if k % 2 == 0 else 0.5, 60)
        shaker(t + k * beat + beat / 2, 0.3, 0.4)
        shaker(t + k * beat + beat / 4, 0.15, -0.4)
    if t + 2 * bar > 77.0:
        brass([tones[0], tones[1], tones[2]], t, 2 * bar - 0.3, 0.5)
    t += 2 * bar
# 86.4: breath — the emotional opening of the finale
strings([nm("D3"), nm("F#3"), nm("A3"), nm("D4")], 86.4, 6.0, 0.5, att=1.5, rel=2.0, bright=2400)
choir([nm("D4"), nm("F#4"), nm("A4")], 86.6, 5.6, 0.45)
for k, nn in enumerate([nm("A4"), nm("F#4"), nm("D5"), nm("A4"), nm("E5"), nm("D5"), nm("F#5"), nm("E5")]):
    piano(nn, 86.6 + k * beat * 0.75, beat, 0.4, pan=0.2)
# 92–98.6: build
prog_d = [("G3", ""), ("D3", ""), ("A3", "")]
for i, (root, q) in enumerate(prog_d):
    t0 = 92.2 + i * 2.15
    tones = chord_tones(root, q)
    strings([tones[0], tones[1] + 12, tones[2] + 12, tones[0] + 24], t0, 2.15, 0.6, att=0.4, rel=0.6, bright=3500)
    choir([tones[0] + 12, tones[1] + 12, tones[2] + 12], t0, 2.15, 0.45 + 0.1 * i)
    for k in range(int(2.15 / (beat / 2))):
        low(tones[0] - 12, t0 + k * beat / 2, beat * 0.3, 0.55)
        if k % 2 == 0: taiko(t0 + k * beat / 2, 0.55 + 0.1 * i, 60)
# timpani roll + riser into the "35" hit
hit = 98.68
for k in range(40):
    tt = hit - 2.4 + k * 0.06
    timpani(nm("D2"), tt, 0.12 + 0.5 * (k / 40) ** 2, decay=0.5)
swell(hit, 3.0, 0.8)
# 98.68: CLIMAX — "Қазақстан — 35 жыл"
boom(hit, 1.0); crash(hit, 0.8); timpani(nm("D2"), hit, 1.0, 2.2)
climax = [("D3", ""), ("A3", ""), ("B3", "m"), ("G3", "")]
for i, (root, q) in enumerate(climax):
    t0 = hit + i * 1.55
    tones = chord_tones(root, q)
    strings([tones[0] - 12, tones[0], tones[1] + 12, tones[2] + 12, tones[0] + 24], t0, 1.55, 0.75, att=0.08, rel=0.6, bright=4500)
    brass([tones[0], tones[1], tones[2]], t0, 1.4, 0.65)
    choir([tones[0] + 12, tones[1] + 12, tones[2] + 12], t0, 1.55, 0.6)
    for k in range(4):
        taiko(t0 + k * 1.55 / 4, 0.85 if k == 0 else 0.5, 58)
        low(tones[0] - 12, t0 + k * 1.55 / 4, 0.3, 0.6)
# words of unity land on hits
for tt in [100.9, 101.4, 102.79]:
    timpani(nm("A2"), tt, 0.55, 1.2)
# 104.9: final D-major chord, resolves and rings out to the end
fin = hit + 4 * 1.55
D = DUR - fin
strings([nm("D2"), nm("D3"), nm("F#3"), nm("A3"), nm("D4"), nm("F#4"), nm("A4")], fin, D - 1.6, 0.75, att=0.15, rel=1.5, bright=4200)
choir([nm("D4"), nm("F#4"), nm("A4"), nm("D5")], fin, D - 1.6, 0.6)
brass([nm("D3"), nm("A3"), nm("D4")], fin, D - 2.0, 0.55)
timpani(nm("D2"), fin, 1.0, 2.6); crash(fin, 0.7); boom(fin, 0.7)
for k, nn in enumerate([nm("D5"), nm("F#5"), nm("A5"), nm("D6")]):
    piano(nn, fin + 0.4 + k * 0.25, 2.5, 0.35, pan=0.3)
# soft transition hits on the scene changes (light before sound: peak ~1 frame after the cut)
for s in TL["scenes"][1:]:
    if s["start"] < 86:
        timpani(nm("D2"), s["start"] + 0.04, 0.45, 1.4)
        swell(s["start"] + 0.02, 1.4, 0.35)

# ---------------- mix ----------------
def reverb_ir(seconds=2.6, damp=3500):
    n = int(seconds * SR); t = np.arange(n) / SR
    ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-t * 6.9 / seconds)[:, None]
    ir[:, 0] = lp(ir[:, 0], damp); ir[:, 1] = lp(ir[:, 1], damp)
    ir[: int(0.012 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum(0)).max()

IR = reverb_ir()
gains = {"piano": 1.1, "strings": 1.0, "low": 0.5, "choir": 1.0, "brass": 0.9, "perc": 0.75, "fx": 0.8, "pluck": 1.0}
sends = {"piano": 0.35, "strings": 0.45, "low": 0.1, "choir": 0.6, "brass": 0.3, "perc": 0.2, "fx": 0.3, "pluck": 0.35}
dry = np.zeros((N, 2)); wet_in = np.zeros((N, 2))
for k, v in mix.items():
    dry += v * gains[k]; wet_in += v * gains[k] * sends[k]
wet = np.stack([signal.fftconvolve(wet_in[:, c], IR[:, c])[:N] for c in range(2)], 1)
out = dry + wet * 0.8
out = hp(out.T, 55).T
b_, a_ = signal.iirpeak(2800 / (SR / 2), 1.2); out = out + 0.15 * signal.lfilter(b_, a_, out, axis=0)  # a little presence so it reads on phones
# gentle bus glue (soft clip) and normalise to -1 dBTP
out = np.tanh(out / np.abs(out).max() * 1.4) / np.tanh(1.4)
fade = np.ones(N); fl = int(1.2 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 1.5
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
