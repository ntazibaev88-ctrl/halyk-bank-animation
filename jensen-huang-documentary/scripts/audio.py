"""Builds the full soundtrack: original synthesized score (no third-party music), transition SFX,
ambience, the narration placed on the timeline, voice-driven ducking and final loudness.
Output: public/audio/mix.wav (48 kHz stereo)."""
import json, os, re, subprocess
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SR = 48000
TL = json.load(open(os.path.join(ROOT, "src", "timeline.json")))
DUR = TL["duration"]
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def sec(k): return TL["sections"][str(k)]

# ── shots / transitions parsed from src/shots.tsx ──
shots_src = open(os.path.join(ROOT, "src", "shots.tsx"), encoding="utf-8").read()
SHOTS = []
for m in re.finditer(r"id: '([^']+)', start: ([\d.]+), end: ([\d.]+), transition: '(\w+)'", shots_src):
    SHOTS.append({"id": m.group(1), "start": float(m.group(2)), "end": float(m.group(3)), "tr": m.group(4)})

# keep only the shot variants that are active (photo version vs. fallback), mirroring src/shots.tsx
HAS = json.load(open(os.path.join(ROOT, "src", "assets.generated.json")))
groups = [
    (HAS["tainan_1960s"] and HAS["taipei_night_1960s"], {"tainan", "taipei-night"}, {"taiwan-map"}),
    (HAS["dennys_1970s"] and HAS["dennys_oregon"] and HAS["diner_doyles"] and HAS["diner_salem"],
     {"dennys-archive", "diner-interior", "diner-counter", "diner-street", "dennys-sign"},
     {"diner-street-a", "first-job", "diner-street-b", "jensen-recalls"}),
    (HAS["gf256_die_a"], {"gf256-die"}, {"gpu-die-video"}),
    (HAS["dennys_1970s"], {"callback-diner"}, {"callback-street"}),
]
inactive = set()
for on, photo, fb in groups:
    inactive |= (fb if on else photo)
SHOTS = [s for s in SHOTS if s["id"] not in inactive]
print("active shots", len(SHOTS))

def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR / 2 - 100) / (SR / 2), "low", output="sos"), x)
def hp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), "high", output="sos"), x)
def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo / (SR / 2), hi / (SR / 2)], "band", output="sos"), x)

def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i < 0: sig = sig[-i:]; i = 0
    j = min(len(buf), i + len(sig))
    if j > i: buf[i:j] += sig[: j - i] * gain

def note_hz(n):  # midi -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def saw(f, n, detune=0.0, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * (1 + detune) * t + phase) % 1.0) - 1

def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na) ** 1.5
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e

# ── intensity curve (0..1) over time ──
def intensity(t):
    pts = [(0, .55), (2.2, .7), (9.6, .9), (12.2, .25), (25.2, .35), (38.3, .45), (44, .6), (50.9, .85),
           (53.1, .75), (67.4, .95), (83.5, .3), (86.3, .5), (97.3, 1.0), (100.5, .6), (DUR, .2)]
    xs, ys = zip(*pts)
    return np.interp(t, xs, ys)

# ── harmony ──  D minor: Dm, Bb, F, C  (i–VI–III–VII)
CH = {"Dm": [50, 57, 62, 65, 69], "Bb": [46, 53, 58, 62, 65], "F": [41, 53, 57, 60, 65], "C": [48, 55, 60, 64, 67],
      "Gm": [43, 55, 58, 62, 67], "Dm9": [50, 57, 64, 65, 69]}
BEAT = 0.6  # 100 bpm
BAR = BEAT * 4
prog = ["Dm", "Bb", "F", "C"]
chords = []
t = 0.0
i = 0
while t < 97.3:
    chords.append((t, prog[i % 4]))
    t += BAR * 1.5; i += 1
chords = [c for c in chords if c[0] < 95.0]
chords += [(95.0, "Bb"), (96.2, "C"), (97.3, "Dm9")]

pad = np.zeros(N)
for k, (t0, name) in enumerate(chords):
    t1 = chords[k + 1][0] if k + 1 < len(chords) else DUR + 0.5
    n = int((t1 - t0 + 1.6) * SR)
    sig = np.zeros(n)
    for m in CH[name]:
        f = note_hz(m)
        for d in (-0.006, -0.002, 0.003, 0.007):
            sig += saw(f, n, d, rng.random()) * 0.06
    sig *= env_adsr(n, 0.9, 1.6)
    place(pad, sig, t0)
# filter sweep driven by intensity (process in blocks)
pad_f = np.zeros(N)
blk = SR // 4
zi_cut = None
for b in range(0, N, blk):
    seg = pad[max(0, b - blk): b + blk]
    fc = 350 + 2600 * float(intensity(np.array([b / SR]))[0]) ** 1.6
    y = lp(seg, fc, 2)
    off = b - max(0, b - blk)
    pad_f[b: b + blk] = y[off: off + blk][: len(pad_f[b: b + blk])]
pad = pad_f * 0.55

# ── sub bass ──
bass = np.zeros(N)
for k, (t0, name) in enumerate(chords):
    t1 = chords[k + 1][0] if k + 1 < len(chords) else DUR
    n = int((t1 - t0 + 0.4) * SR)
    f = note_hz(CH[name][0] - 12)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)
    place(bass, s * env_adsr(n, 0.4, 0.5) * 0.32, t0)
bass *= np.clip((intensity(t_all) - 0.25) * 1.6, 0.15, 1.0)

# ── arpeggio pluck (sections 4–6 and final build) ──
arp = np.zeros(N)
def pluck(f, dur=0.45, bright=2500):
    n = int(dur * SR)
    s = saw(f, n, 0, rng.random()) + 0.5 * saw(f * 2, n, 0.001, rng.random())
    s = lp(s, bright)
    return s * np.exp(-np.arange(n) / SR * 9)
arp_ranges = [(1.2, 12.0, 0.5), (41.3, 53.0, 0.7), (53.1, 67.3, 0.9), (67.4, 83.4, 1.0), (89.3, 97.2, 0.8)]
def chord_at(t):
    name = chords[0][1]
    for t0, nm in chords:
        if t0 <= t: name = nm
    return name
for a, b, g in arp_ranges:
    t = a
    step = BEAT / 2
    k = 0
    while t < b:
        notes = CH[chord_at(t)]
        pat = [notes[2] + 12, notes[3] + 12, notes[4] + 12, notes[3] + 12, notes[2] + 12, notes[1] + 12, notes[3], notes[4]]
        f = note_hz(pat[k % len(pat)])
        place(arp, pluck(f, bright=1800 + 2200 * float(intensity(np.array([t]))[0])), t, 0.13 * g)
        t += step; k += 1
# delay echo on arp
d = int(BEAT * 0.75 * SR)
arp_d = arp.copy()
for r in range(1, 4):
    arp_d[d * r:] += arp[:-d * r] * (0.38 ** r)
arp = arp_d

# ── piano-like motif (emotional sections) ──
piano = np.zeros(N)
def pnote(f, dur=2.6, vel=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * h * tt) * (0.6 ** (h - 1)) * np.exp(-tt * (1.6 + h * 0.9)) for h in range(1, 6))
    s *= np.minimum(1, tt / 0.004)
    return s * vel
motif = [(0, 74), (0.6, 72), (1.2, 69), (2.4, 67), (3.0, 69), (3.6, 65)]
for base in [12.6, 18.0, 25.8, 31.2, 83.9, 89.3]:
    for dt, m in motif:
        place(piano, pnote(note_hz(m), vel=0.9), base + dt * 1.2, 0.11)
# final chord on the portrait
for m in [62, 69, 74, 76, 81]:
    place(piano, pnote(note_hz(m), dur=4.5, vel=1), 97.3, 0.09)

# ── percussion ──
perc = np.zeros(N)
def kick():
    n = int(0.5 * SR); tt = np.arange(n) / SR
    f = 45 + 80 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 7) * 0.9
def hat():
    n = int(0.06 * SR)
    return hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 70) * 0.25
for a, b, every in [(0.0, 9.6, 2), (44.0, 50.6, 2), (53.1, 67.3, 1), (67.4, 83.3, 1), (91.9, 97.1, 1)]:
    t = a; k = 0
    while t < b:
        if k % every == 0: place(perc, kick(), t, 0.55)
        if t > 53 and t < 83.3: place(perc, hat(), t + BEAT / 2, 0.5)
        t += BEAT; k += 1

# ── SFX ──
sfx = np.zeros(N)
def boom(len_s=2.2, f0=58):
    n = int(len_s * SR); tt = np.arange(n) / SR
    f = f0 * (1 - 0.45 * (1 - np.exp(-tt * 3)))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2)
    s += lp(rng.standard_normal(n), 300) * np.exp(-tt * 6) * 0.6
    return s
def whoosh(len_s=0.55, lo=300, hi=5000):
    n = int(len_s * SR); tt = np.arange(n) / SR
    noise = rng.standard_normal(n)
    e = np.sin(np.pi * np.clip(tt / len_s, 0, 1)) ** 2
    return bp(noise, lo, hi) * e
def riser(len_s=1.6):
    n = int(len_s * SR); tt = np.arange(n) / SR
    out = np.zeros(n); blk = 2400
    for b in range(0, n, blk):
        fc = 300 + 6000 * (b / n) ** 2
        out[b:b + blk] = bp(rng.standard_normal(min(blk, n - b) + 2000), fc * 0.7, fc * 1.3)[2000:]
    return out * (tt / len_s) ** 2
def shimmer():
    n = int(1.4 * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * tt) for f in (1760, 2637, 3520, 4186)) * np.exp(-tt * 4)
    return s * 0.25
def glitch():
    n = int(0.3 * SR)
    s = rng.standard_normal(n)
    s = np.round(s * 3) / 3  # crush
    gate = (np.floor(np.arange(n) / (SR * 0.025)) % 2)
    return bp(s * gate, 800, 6000) * 0.5
def tick():
    n = int(0.03 * SR)
    return hp(rng.standard_normal(n), 3000) * np.exp(-np.arange(n) / SR * 200)

for s in SHOTS:
    t0 = s["start"]
    if s["tr"] == "whip": place(sfx, whoosh(0.5, 400, 6000), t0 - 0.3, 0.35)
    elif s["tr"] == "zoom": place(sfx, whoosh(0.7, 200, 3000), t0 - 0.45, 0.3); place(sfx, boom(1.2, 50), t0, 0.25)
    elif s["tr"] == "flash": place(sfx, shimmer(), t0, 0.5); place(sfx, boom(1.6, 55), t0, 0.45)
    elif s["tr"] == "glitch": place(sfx, glitch(), t0 - 0.15, 0.45)
    elif s["tr"] == "dip": place(sfx, whoosh(1.2, 120, 1200), t0 - 0.8, 0.2)
    elif s["tr"] == "fade": place(sfx, whoosh(0.9, 150, 1500), t0 - 0.55, 0.1)
# big hits: hook opening, main title, section starts, wordmark, final portrait
for t0, g in [(0.02, 0.8), (9.65, 0.9), (sec(4)["start"], 0.5), (50.9, 0.8), (sec(5)["start"], 0.6), (sec(6)["start"], 0.8), (97.3, 1.0)]:
    place(sfx, boom(2.6, 52), t0, g)
for t0 in [9.65, 50.9, 67.426, 97.3]:
    r = riser(1.8); place(sfx, r, t0 - len(r) / SR, 0.18)
# typing-like ticks on the napkin reconstruction & wordmark letters
for k in range(6): place(sfx, tick(), 50.95 + 0.05 + k * 0.07, 0.35)

# ── ambience ──
amb = np.zeros(N)
def load_audio(path, ss=0, t=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(ss), "-i", path]
    if t: cmd += ["-t", str(t)]
    cmd += ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.check_output(cmd), dtype=np.float32).astype(np.float64)
raw_diner = os.path.join("/tmp/claude-0/work/raw/diner_st.mp4")
if os.path.exists(raw_diner):
    try:
        a = load_audio(raw_diner, 2.0)
        a = a / (np.abs(a).max() + 1e-9)
        n = len(a); e = env_adsr(n, 0.8, 0.8)
        place(amb, a * e, 33.4 - 0.6, 0.12)  # real street ambience under the diner street shot
    except Exception as ex:
        print("ambience skipped", ex)
# room tone for diner section (soft filtered noise) + server hum for AI section
rt = lp(rng.standard_normal(int(13 * SR)), 900) * env_adsr(int(13 * SR), 1.0, 1.0)
place(amb, rt, sec(3)["start"], 0.02)
nh = int((sec(6)["end"] - sec(6)["start"]) * SR)
tt = np.arange(nh) / SR
hum = (np.sin(2 * np.pi * 120 * tt) * 0.3 + np.sin(2 * np.pi * 240 * tt) * 0.1 + bp(rng.standard_normal(nh), 300, 2500) * 0.6) * env_adsr(nh, 1.2, 1.2)
place(amb, hum, sec(6)["start"], 0.035)

# ── reverb ──
def reverb(x, secs=2.8, wet=0.3, seed=1):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / secs))
    ir = lp(ir, 5000)
    ir /= np.sqrt((ir ** 2).sum())
    return x * (1 - wet) + fftconvolve(x, ir)[: len(x)] * wet * 2.2

music_L = pad + bass + arp + piano + perc
music_R = pad * 0.98 + bass + np.roll(arp, int(0.012 * SR)) + np.roll(piano, int(0.008 * SR)) + perc
music_L = reverb(music_L, 3.2, 0.32, 1)
music_R = reverb(music_R, 3.2, 0.32, 2)
sfx_L = reverb(sfx, 2.4, 0.25, 3)
sfx_R = reverb(sfx, 2.4, 0.25, 4)

# ── narration ──
voice = np.zeros(N)
for s in TL["sentences"]:
    v = load_audio(os.path.join(ROOT, "public", s["file"]))
    place(voice, v, s["fileStart"])
# gentle voice EQ: low cut + presence, then compression-ish normalisation
voice = hp(voice, 80)
voice = voice + 0.25 * bp(voice, 2500, 6000)
vpk = np.percentile(np.abs(voice[np.abs(voice) > 1e-4]), 99.5)
voice = np.tanh(voice / vpk * 0.9) * 0.62

# ── ducking ──
env = np.abs(voice)
win = int(0.05 * SR)
env = np.convolve(env, np.ones(win) / win, mode="same")
active = (env > 0.02).astype(float)
# attack 60ms, release 450ms smoothing
sm = np.zeros_like(active)
a_c, r_c = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.45 * SR))
prev = 0.0
for i in range(0, N, 64):
    target = active[i]
    c = a_c if target > prev else r_c
    prev = target + (prev - target) * (c ** 64)
    sm[i:i + 64] = prev
duck = 1 - 0.62 * sm  # about -8.4 dB under voice

music_gain = 0.42
L = music_L * music_gain * duck + sfx_L * 0.5 * (1 - 0.35 * sm) + amb + voice
R = music_R * music_gain * duck + sfx_R * 0.5 * (1 - 0.35 * sm) + amb + voice

# fade edges
fade_in = int(0.05 * SR); fade_out = int(1.2 * SR)
end_i = int(DUR * SR)
for ch in (L, R):
    ch[:fade_in] *= np.linspace(0, 1, fade_in)
    ch[end_i - fade_out:end_i] *= np.linspace(1, 0, fade_out)
    ch[end_i:] = 0
stereo = np.stack([L[:end_i], R[:end_i]], 1)
stereo /= np.abs(stereo).max() / 0.89
tmp = os.path.join(ROOT, "public", "audio", "mix_pre.wav")
from scipy.io import wavfile
wavfile.write(tmp, SR, (stereo * 32767).astype(np.int16))
# loudness to -14 LUFS / -1.5 dBTP (TikTok / Reels friendly)
out = os.path.join(ROOT, "public", "audio", "mix.wav")
subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", str(SR), out])
os.remove(tmp)
# also export stems for inspection
wavfile.write(os.path.join("/tmp/claude-0/work", "voice_only.wav"), SR, (voice[:end_i] * 32767 / max(1e-9, np.abs(voice).max())).astype(np.int16))
print("mix written", out, "shots parsed", len(SHOTS))
