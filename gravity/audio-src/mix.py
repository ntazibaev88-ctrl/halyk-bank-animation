"""Builds the three audio stems for the film (48 kHz stereo, exactly 90 s):
assets/audio/vo.wav     processed narration
assets/audio/music.wav  synthesized score + ambience, ducked under the voice
assets/audio/sfx.wav    sound effects on visual events
Run from the project root after place.py has written audio-src/vo_raw.wav."""
import subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 90.0
N = int(SR * DUR)
rng = np.random.default_rng(90)


def t_axis(n):
    return np.arange(n) / SR


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, "low", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def env_adsr(n, a, r, sustain=1.0):
    e = np.ones(n) * sustain
    na, nr = int(a * SR), int(r * SR)
    na = min(na, n); nr = min(nr, n - na)
    if na > 0: e[:na] = np.linspace(0, sustain, na) ** 1.5
    if nr > 0: e[n - nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def nm(s):
    name, octv = s[:-1], int(s[-1])
    return 12 * (octv + 1) + NOTE[name]


def place(buf, x, t0, gain=1.0, pan=0.0):
    """Add mono or stereo x into stereo buf at time t0 with equal-power pan."""
    i = int(round(t0 * SR))
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], 1)
    if i < 0: x = x[-i:]; i = 0
    j = min(N, i + len(x))
    if j > i: buf[i:j] += x[: j - i] * gain


def reverb(x, secs=3.2, wet=0.3, seed=1):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    e = np.exp(-6.9 * t_axis(n) / secs)
    ir = np.stack([lp(r.standard_normal(n), 6000) * e, lp(r.standard_normal(n), 6000) * e], 1)
    ir /= np.sqrt((ir ** 2).sum(0))
    out = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return x * (1 - wet) + out * wet * 2.2


# ---------------------------------------------------------------- music
def pad(notes, t0, dur, amp, a=1.6, r=2.2, cutoff=1400, bright=0.0, width=0.6):
    n = int((dur + r) * SR)
    tt = t_axis(n)
    out = np.zeros((n, 2))
    for k, s in enumerate(notes):
        f0 = mtof(nm(s) if isinstance(s, str) else s)
        for d, p in ((-6, -width), (0, 0.0), (7, width)):
            f = f0 * 2 ** (d / 1200)
            ph = rng.random()
            saw = 2 * ((tt * f + ph) % 1) - 1
            tri = 2 * np.abs(saw) - 1
            v = (1 - bright) * tri + bright * saw
            l, rr = np.cos((p + 1) * np.pi / 4), np.sin((p + 1) * np.pi / 4)
            out[:, 0] += v * l; out[:, 1] += v * rr
    out = np.stack([lp(out[:, c], cutoff, 2) for c in range(2)], 1)
    out *= (env_adsr(n, a, r) * amp / len(notes))[:, None]
    return out


def drone(midi, t0, dur, amp, a=2.0, r=2.5):
    n = int((dur + r) * SR); tt = t_axis(n)
    f = mtof(midi)
    v = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt + 0.3) + 0.12 * np.sin(2 * np.pi * 3 * f * tt)
    v *= 1 + 0.08 * np.sin(2 * np.pi * 0.17 * tt)
    return v * env_adsr(n, a, r) * amp


def pluck(midi, amp, decay=1.8):
    n = int(decay * 1.5 * SR); tt = t_axis(n)
    f = mtof(midi)
    v = np.sin(2 * np.pi * f * tt) * 0.8 + 0.2 * np.sin(2 * np.pi * 2 * f * tt)
    return v * np.exp(-tt / decay * 2.5) * np.minimum(1, tt / 0.01) * amp


def thump(amp, f0=90, f1=42, decay=0.45):
    n = int(decay * 2 * SR); tt = t_axis(n)
    f = f1 + (f0 - f1) * np.exp(-tt / 0.06)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt / decay * 3) * np.minimum(1, tt / 0.004) * amp


def noise_swell(dur, lo, hi, amp, a_frac=0.7, seed=3):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    x = bp(r.standard_normal(n), lo, hi)
    e = np.concatenate([np.linspace(0, 1, int(n * a_frac)) ** 2, np.linspace(1, 0, n - int(n * a_frac)) ** 1.5])
    return x * e * amp / (np.std(x) + 1e-9)


music = np.zeros((N, 2))
# 0–7.5 waking: D minor bed
place(music, drone(nm("D2"), 0, 7.4, 0.16, a=0.05), 0.0)
place(music, pad(["D3", "F3", "A3", "D4"], 0, 6.8, 0.22, a=0.4, cutoff=900), 0.0)
place(music, pad(["D3", "A3", "E4", "F4"], 0, 2.6, 0.18, a=0.2, cutoff=1300), 5.0)
# 7–20 floating: Dm – Bb – F – C, soft plucks above
prog = [(7.0, ["D3", "F3", "A3", "D4"]), (10.2, ["Bb2", "D3", "F3", "A3"]), (13.0, ["F2", "C3", "F3", "A3"]), (15.9, ["C3", "E3", "G3", "D4"])]
for i, (t, ch) in enumerate(prog):
    end = prog[i + 1][0] if i + 1 < len(prog) else 19.8
    place(music, pad(ch, t, end - t + 0.4, 0.26, a=0.9, r=1.6, cutoff=1500, bright=0.15), t)
    place(music, drone(nm(ch[0]) - 12, t, end - t, 0.10, a=0.8, r=1.2), t)
pl_r = np.random.default_rng(11)
t = 7.4
while t < 19.6:
    ch = [c for tt_, c in prog if tt_ <= t][-1]
    m = nm(pl_r.choice(ch)) + 24
    place(music, pluck(m, 0.05 + 0.03 * pl_r.random()), t, pan=pl_r.uniform(-0.6, 0.6))
    t += 0.355 * (1 + (pl_r.random() < 0.3))
# 20–34 city: tension pulse, cluster, rising air
place(music, pad(["D3", "A3", "Eb4", "D4"], 20, 13.6, 0.2, a=1.0, cutoff=1100, bright=0.3), 20.0)
place(music, drone(nm("D1"), 20, 14, 0.2, a=0.5), 20.0)
t = 20.25; k = 0
while t < 33.6:
    place(music, thump(0.22 + 0.25 * (t - 20) / 14, f0=110, f1=45), t)
    t += 0.6 if t < 29.7 else 0.3; k += 1
place(music, noise_swell(4.6, 300, 3000, 0.10), 29.6)
# 34–48 space: wide open fifths, then Bb, Gm, A
place(music, pad(["D2", "A2", "D3", "A3", "E4"], 34, 7.0, 0.32, a=0.8, r=1.5, cutoff=1800), 34.0)
place(music, pad(["Bb1", "F2", "Bb2", "D3", "F3"], 41, 3.3, 0.32, a=0.9, r=1.4, cutoff=1700), 40.9)
place(music, pad(["G2", "D3", "G3", "Bb3", "D4"], 44.3, 2.8, 0.32, a=0.8, r=1.2, cutoff=1700), 44.2)
place(music, pad(["A2", "E3", "A3", "C#4", "E4"], 47.0, 1.3, 0.34, a=0.5, r=1.0, cutoff=2200), 46.9)
place(music, drone(nm("D1"), 34, 14, 0.14), 34.0)
# 48–63 the planet: dark drone, cluster, rumble
place(music, drone(nm("D1"), 48, 15, 0.24, a=0.6), 48.0)
place(music, pad(["C#3", "D3", "A3"], 48, 14.5, 0.2, a=1.5, cutoff=800, bright=0.4), 48.0)
place(music, pad(["F3", "Ab3", "D4"], 56.9, 6.0, 0.16, a=2.0, cutoff=1200, bright=0.4), 56.9)
t = 58.0
while t < 62.8:
    place(music, thump(0.35, f0=120, f1=38, decay=0.5), t); t += 0.5
# 63–77 space, a person: near silence
place(music, pad(["A4", "E5"], 63, 9.6, 0.07, a=2.5, r=3.0, cutoff=3000), 63.0)
place(music, drone(nm("D2"), 63, 9.6, 0.07, a=1.5, r=2.0), 63.0)
n = int(4.4 * SR); tt = t_axis(n)
hi = np.sin(2 * np.pi * mtof(nm("A5")) * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * 3.1 * tt)) * env_adsr(n, 1.5, 1.6) * 0.025
place(music, hi, 72.7)
# 77–85 resolution swell, then the open question
n = int(8.2 * SR)
sw = pad(["D2", "A2", "D3", "F3", "A3", "E4"], 77, 7.6, 0.4, a=4.5, r=1.4, cutoff=1900, bright=0.1)
place(music, sw, 77.0)
place(music, drone(nm("D1"), 77, 7.5, 0.16, a=3.0, r=1.2), 77.0)
place(music, pad(["Bb2", "D3", "F3", "A3", "E4"], 85.7, 3.6, 0.3, a=0.9, r=1.0, cutoff=2400), 85.65)
place(music, drone(nm("Bb1"), 85.7, 3.4, 0.12, a=0.3, r=1.0), 85.65)
music = reverb(music, 3.4, 0.32)
# fade to black: music fades with the picture, silence before the question
t_ = t_axis(N)
g = np.ones(N)
g[(t_ > 84.5) & (t_ < 85.4)] = np.linspace(1, 0.02, ((t_ > 84.5) & (t_ < 85.4)).sum())
g[(t_ >= 85.4) & (t_ < 85.65)] = 0.02
g[t_ > 89.0] *= np.linspace(1, 0, (t_ > 89.0).sum())
music *= g[:, None]

# ---------------------------------------------------------------- voice
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio-src/vo_raw.wav", "-af",
                "aresample=48000,highpass=f=75,equalizer=f=170:t=q:w=1:g=2,equalizer=f=3000:t=q:w=1.2:g=2.5,"
                "equalizer=f=7200:t=q:w=1:g=-2,acompressor=threshold=-22dB:ratio=3:attack=4:release=90:makeup=4dB,"
                "aecho=0.88:0.5:23|41:0.09|0.05,alimiter=limit=0.35:attack=2:release=60:level=disabled", "-ac", "2", "-ar", "48000", "audio-src/vo_proc.wav"], check=True)
vo, _ = sf.read("audio-src/vo_proc.wav")
vo = np.pad(vo, ((0, max(0, N - len(vo))), (0, 0)))[:N]

# duck the music under the voice (envelope follower, ~5 dB)
lev = np.abs(vo).mean(1)
k = int(0.03 * SR)
lev = np.convolve(lev, np.ones(k) / k, "same")
on = (lev > 0.01).astype(float)
rel = int(0.35 * SR)
on = np.maximum.accumulate(np.where(on > 0, np.arange(N), 0))
since = np.arange(N) - on
speech = np.clip(1 - since / rel, 0, 1)
speech = np.convolve(speech, np.ones(int(0.08 * SR)) / int(0.08 * SR), "same")
music *= (1 - 0.45 * speech)[:, None]

# ---------------------------------------------------------------- sfx
sfx = np.zeros((N, 2))


def lib(name):
    x, _ = sf.read(f"audio-src/sfx/{name}.wav")
    return x


def at_peak(name, t_hit, gain, fade=None, trim=None):
    x = lib(name)
    if trim: x = x[: int(trim * SR)]
    if fade:
        nf = int(fade * SR); x[-nf:] *= np.linspace(1, 0, nf)[:, None]
    pk = np.argmax(np.abs(x).max(1)) / SR
    place(sfx, x, t_hit + 1 / 30 - pk, gain)


def whoosh(t_peak, dur, gain, lo=200, hi=4000, pan=0.0, seed=5):
    x = noise_swell(dur, lo, hi, 1.0, a_frac=0.65, seed=seed)
    place(sfx, x, t_peak - dur * 0.65, gain, pan)


def rumble(t0, dur, gain, a_frac=0.5, seed=8):
    r = np.random.default_rng(seed); n = int(dur * SR); tt = t_axis(n)
    x = lp(r.standard_normal(n), 120, 4) * 6 + 0.6 * np.sin(2 * np.pi * 38 * tt)
    e = np.concatenate([np.linspace(0, 1, int(n * a_frac)) ** 2, np.linspace(1, 0, n - int(n * a_frac))])
    place(sfx, x * e / np.max(np.abs(x * e)), t0, gain)


def crackle(t0, dur, gain, density=40, seed=9):
    r = np.random.default_rng(seed); n = int(dur * SR); x = np.zeros(n)
    for _ in range(int(density * dur)):
        i = r.integers(0, n - 4000); L = int(r.uniform(0.004, 0.03) * SR)
        x[i:i + L] += r.standard_normal(L) * np.exp(-np.arange(L) / (L / 4)) * r.uniform(0.3, 1)
    x = hp(x, 900) * np.linspace(0.3, 1, n)
    place(sfx, x / (np.max(np.abs(x)) + 1e-9), t0, gain, pan=r.uniform(-0.3, 0.3))


def buzz(t0, gain):
    n = int(0.22 * SR); tt = t_axis(n)
    x = np.sign(np.sin(2 * np.pi * 150 * tt)) * np.sin(np.pi * tt / 0.22)
    x = lp(x, 900)
    for k in range(3): place(sfx, x, t0 + k * 0.32, gain)


def heartbeat(t0, gain, f=55):
    place(sfx, thump(1.0, f0=f * 1.6, f1=f, decay=0.25), t0, gain)
    place(sfx, thump(0.7, f0=f * 1.5, f1=f * 0.9, decay=0.22), t0 + 0.27, gain)


# scene 1
at_peak("impact-bass-1", 0.0, 0.32, fade=0.8)
buzz(3.32, 0.10)
whoosh(4.6, 0.45, 0.10, 400, 6000, seed=21)
at_peak("impact-bass-2", 5.42, 0.36, fade=1.2)
rumble(5.4, 2.2, 0.20)
whoosh(6.4, 1.6, 0.06, 300, 2500, pan=-0.3, seed=22)
# scene 2
whoosh(7.15, 0.6, 0.06, 500, 5000, seed=23)
whoosh(8.9, 1.6, 0.04, 200, 1500, seed=24)
whoosh(10.6, 0.5, 0.09, 600, 7000, seed=25)
place(sfx, thump(0.5, f0=160, f1=60, decay=0.3), 11.95)
at_peak("glitch-1", 11.94, 0.05, trim=1.2, fade=0.3)
whoosh(13.6, 1.4, 0.04, 300, 3000, pan=0.4, seed=26)
whoosh(16.1, 1.0, 0.12, 200, 5000, seed=27)
whoosh(20.0, 0.9, 0.14, 150, 6000, seed=28)
# scene 3
at_peak("impact-bass-1", 20.12, 0.22, fade=0.8)
whoosh(20.9, 1.6, 0.10, 400, 4000, pan=-0.5, seed=29)
whoosh(21.9, 2.6, 0.06, 200, 1200, pan=-0.2, seed=30)
at_peak("glitch-2", 22.7, 0.05, trim=0.6, fade=0.2)
rumble(23.6, 2.0, 0.10, seed=31)
whoosh(25.9, 0.5, 0.10, 500, 6000, pan=-0.4, seed=32)
whoosh(27.8, 1.2, 0.05, 300, 3000, pan=0.3, seed=33)
jet = noise_swell(4.6, 250, 2200, 1.0, a_frac=0.45, seed=34) + lp(np.random.default_rng(35).standard_normal(int(4.6 * SR)), 180) * 0.6
jt = t_axis(len(jet))
jet *= 1 + 0.35 * np.sin(2 * np.pi * 1.8 * jt) * (jt > 1.0)
panL = np.clip(1 - jt / 4.6 * 2, -1, 1)
st = np.stack([jet * np.cos((panL + 1) * np.pi / 4), jet * np.sin((panL + 1) * np.pi / 4)], 1) * 1.4
place(sfx, st / np.max(np.abs(st)), 29.8, 0.13)
at_peak("glitch-2", 31.5, 0.05, trim=0.6, fade=0.2)
riser = lib("riser")[: int(4.0 * SR)]
nf = int(0.3 * SR); riser[-nf:] *= np.linspace(1, 0, nf)[:, None]
place(sfx, riser, 33.95 - 3.6, 0.10)
# scene 4
at_peak("whoosh-cinematic", 34.05, 0.18)
at_peak("impact-bass-2", 34.1, 0.22, fade=1.4)
whoosh(43.0, 10.6, 0.05, 1500, 9000, seed=36)
crackle(41.3, 7.0, 0.035, density=60, seed=37)
whoosh(48.0, 0.9, 0.12, 150, 5000, seed=38)
# scene 5
at_peak("impact-bass-1", 48.15, 0.24, fade=1.0)
whoosh(48.9, 0.9, 0.07, 400, 5000, seed=39)
for tq in (50.7, 51.8, 52.9, 54.0):
    place(sfx, thump(0.55, f0=100, f1=40, decay=0.4), tq)
whoosh(55.6, 2.4, 0.06, 150, 1500, seed=40)
rumble(56.8, 6.6, 0.24, a_frac=0.85, seed=41)
at_peak("glitch-1", 58.75, 0.05, trim=1.0, fade=0.3)
crackle(59.3, 3.9, 0.14, density=70, seed=42)
at_peak("impact-bass-2", 60.42, 0.20, fade=1.5)
# scene 6
at_peak("whoosh-cinematic", 63.2, 0.11)
n = int(1.2 * SR); hs = hp(np.random.default_rng(43).standard_normal(n), 2500) * np.exp(-t_axis(n) / 0.35)
place(sfx, hs / np.max(np.abs(hs)), 66.45, 0.07, pan=0.3)
tb = 68.85
for gap, gn in ((0.85, 0.30), (0.95, 0.27), (1.05, 0.24), (1.2, 0.2), (1.35, 0.15), (1.6, 0.1)):
    heartbeat(tb, gn); tb += gap
# scene 7
at_peak("whoosh-cinematic", 77.15, 0.12)
whoosh(79.9, 3.0, 0.03, 300, 2500, pan=0.4, seed=44)
at_peak("impact-bass-1", 85.75, 0.26, fade=1.4)
at_peak("impact-bass-2", 87.32, 0.12, fade=1.6)

import pyloudnorm as pyln
meter = pyln.Meter(SR)
def lufs(x): return meter.integrated_loudness(x)
# voice to -16 LUFS on its own, then the bed and effects ride relative to it
vo *= 10 ** ((-16 - lufs(vo)) / 20)
def limit(x, ceil_db=-4.0, look=0.004, rel=0.08):
    from scipy.ndimage import minimum_filter1d
    c = 10 ** (ceil_db / 20); a = np.abs(x).max(1)
    g = np.minimum(1, c / (a + 1e-9))
    g = minimum_filter1d(g, int(look * SR) * 2 + 1)
    k = int(rel * SR); w = np.hanning(k) / np.hanning(k).sum()
    g = np.minimum(g, np.convolve(g, w, "same"))
    return x * g[:, None]
vo *= 10 ** ((-16 - lufs(vo)) / 20); vo = limit(vo, -5.0); vo *= 10 ** ((-16 - lufs(vo)) / 20)
music *= 10 ** ((-31.0 - lufs(music)) / 20)
sfx *= 10 ** ((-25.5 - lufs(sfx)) / 20)
c = 0.30; sfx = np.where(np.abs(sfx) > c, np.sign(sfx) * (c + (1 - c) * np.tanh((np.abs(sfx) - c) / (1 - c))), sfx)
print("vo", round(lufs(vo), 1), "music", round(lufs(music), 1), "sfx", round(lufs(sfx), 1))
mix = vo + music + sfx
L = lufs(mix); tgt = -14.5
gain = 10 ** ((tgt - L) / 20)
pk = np.max(np.abs(mix)) * gain
if pk > 0.88: gain *= 0.88 / pk
print("music under voice (dB):", round(20*np.log10(np.sqrt(np.mean(music[speech>0.5]**2))/np.sqrt(np.mean(vo[speech>0.5]**2))),1))
for name, x in (("vo", vo), ("music", music), ("sfx", sfx)):
    sf.write(f"assets/audio/{name}.wav", (x * gain).astype(np.float32), SR, subtype="PCM_16")
mix *= gain
print("mix LUFS", round(lufs(mix), 1), "peak dBFS", round(20 * np.log10(np.max(np.abs(mix))), 2), "gain", round(20*np.log10(gain),1))
sf.write("audio-src/mix_preview.wav", mix.astype(np.float32), SR, subtype="PCM_16")
