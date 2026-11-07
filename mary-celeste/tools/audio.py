"""Score, ambience and synthesized sound effects, all seeded and derived from the
scene plan (tools/scenes.py), so they follow the recorded narration.

Writes:
  assets/audio/music.mp3     dark ambient score (D minor), no ducking baked in
  assets/audio/ambience.mp3  ocean + wind bed with per-scene levels baked in
  assets/audio/sfx/*.wav     sonar, creaks, thunder, paper, clock tick, sub boom
"""
import os, subprocess, sys
import numpy as np, soundfile as sf
from scipy import signal
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scenes import plan

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(1872)
P = plan()
TOTAL = P["total"]
SC = {s["id"]: s for s in P["scenes"]}
SEG = P["seg"]
N = int(TOTAL * SR)

def st(sid): return SC[sid]["start"]
def en(sid): return SC[sid]["start"] + SC[sid]["duration"]
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def t_axis(n): return np.arange(n) / SR
def lp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, "low", fs=SR, output="sos"), x, axis=0)
def hp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, "high", fs=SR, output="sos"), x, axis=0)
def bp(x, lo, hi, order=2): return signal.sosfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)
def smooth(x): x = np.clip(x, 0, 1); return x * x * (3 - 2 * x)

def env_points(points, n=N):
    """Piecewise-linear envelope from [(t, v), ...]."""
    ts, vs = zip(*points)
    return np.interp(t_axis(n), ts, vs)

def reverb(x, rt=4.0, mix=0.35, seed=7, damp=3500):
    r = np.random.default_rng(seed); n = int(rt * SR)
    tt = t_axis(n)
    ir = r.normal(0, 1, (n, 2)) * np.exp(-6.9 * tt / rt)[:, None]
    ir = lp(ir, damp); ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    ir /= np.sqrt((ir ** 2).sum(0, keepdims=True))
    if x.ndim == 1: x = np.stack([x, x], 1)
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return x * (1 - mix) + wet * mix * 1.6

def saw(f, n, phase=0.0, harm=24):
    tt = t_axis(n); out = np.zeros(n)
    for k in range(1, harm + 1):
        if f * k > 9000: break
        out += np.sin(2 * np.pi * f * k * tt + phase * k) / k
    return out

def write_mp3(name, x, br="256k"):
    wav = os.path.join(ROOT, "assets/audio", name.replace(".mp3", ".tmp.wav"))
    sf.write(wav, x.astype(np.float32), SR)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", br, os.path.join(ROOT, "assets/audio", name)], check=True)
    os.remove(wav)

def normalize(x, peak_db=-1.5):
    return x * (10 ** (peak_db / 20) / (np.abs(x).max() + 1e-9))

# ───────────────────────────── music ─────────────────────────────
def pad_layer():
    """Slow chord pad: detuned saws through a breathing low-pass, long crossfades."""
    Dm = [38, 45, 50, 53, 57]; Bb = [34, 46, 50, 53, 58]; Gm = [31, 43, 50, 55, 58]
    Asus = [33, 45, 50, 52, 57]; Dm2 = [38, 50, 53, 57, 62]
    prog = [(0, Dm), (st("s02-voyage"), Bb), (st("s02-voyage") + 5, Dm), (st("s03-people"), Gm),
            (st("s04-discovery"), Asus), (st("s05-empty-ship"), Dm), (st("s06-evidence"), Bb),
            (st("s07-theories"), Gm), (st("s07-theories") + 8, Asus), (st("s08-investigation"), Bb),
            (st("s08-investigation") + 5.5, Gm), (st("s09-question"), Dm), (st("s10-ending"), Dm2)]
    out = np.zeros((N, 2)); xf = 2.8
    for i, (t0, chord) in enumerate(prog):
        t1 = prog[i + 1][0] if i + 1 < len(prog) else TOTAL
        a, b = max(0, t0 - xf / 2), min(TOTAL, t1 + xf / 2)
        n = int((b - a) * SR); s = int(a * SR)
        e = np.ones(n); fx = int(xf * SR)
        if i > 0: e[:fx] = smooth(np.linspace(0, 1, fx))
        if i + 1 < len(prog): e[-fx:] = smooth(np.linspace(1, 0, fx))
        for m in chord:
            for c, det in enumerate((-0.07, 0.06)):
                for d2 in (0.0, 0.11):
                    f = midi(m + det + d2 * (1 if c else -1))
                    out[s:s + n, c] += saw(f, n, phase=rng.random() * 6.28, harm=16) * e * (0.6 if m < 40 else 0.32)
    cutoff = 520 + 260 * np.sin(2 * np.pi * t_axis(N) / 11.0)  # breathing filter via 3 fixed bands
    lo, mid, air = lp(out, 650), bp(out, 650, 2000), bp(out, 2000, 5000)
    w = np.clip((cutoff - 260) / 520, 0, 1)[:, None]
    return hp(lo, 110) + mid * (0.55 + 0.45 * w) + air * 0.12 * w

def sub_drone():
    tt = t_axis(N)
    d = np.sin(2 * np.pi * midi(26) * tt) * 0.5 + np.sin(2 * np.pi * midi(38) * tt + 1) * 0.25
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * tt / 9.0)
    e = env_points([(0, 0.0), (0.4, 0.7), (st("s02-voyage"), 0.55), (st("s05-empty-ship"), 0.7),
                    (st("s09-question"), 0.85), (TOTAL - 2.5, 0.6), (TOTAL, 0)])
    x = d * lfo * e
    return np.stack([x, x], 1)

def braam(t0, dur=2.6, gain=1.0, root=26):
    """Low brassy hit: stacked saws with a fast-opening, slow-closing filter."""
    n = int(dur * SR); tt = t_axis(n)
    x = sum(saw(midi(m) * (1 + 0.003 * k), n, rng.random() * 6, 30) for k, m in enumerate([root, root + 12, root + 19, root + 24]))
    lo = lp(x, 180); hi = lp(x, 1400)
    open_ = np.clip(tt / 0.06, 0, 1) * np.exp(-tt / 0.35)
    y = hp(lo, 45) * 0.4 + (hi - lo) * (0.25 + open_) * 0.9
    y *= np.minimum(1, tt / 0.012) * np.exp(-tt / (dur * 0.42))
    out = np.zeros((N, 2)); s = int(t0 * SR); m = min(n, N - s)
    out[s:s + m] += np.stack([y[:m], y[:m]], 1) * gain
    return out

def bell_motif(t0, notes=(74, 77, 76, 69), gap=0.72, gain=0.22):
    out = np.zeros((N, 2))
    for i, m in enumerate(notes):
        f = midi(m); n = int(4.0 * SR); tt = t_axis(n)
        idx = 2.2 * np.exp(-tt / 0.5)
        y = np.sin(2 * np.pi * f * tt + idx * np.sin(2 * np.pi * f * 1.41 * tt)) * np.exp(-tt / 1.4)
        y *= np.minimum(1, tt / 0.004)
        s = int((t0 + i * gap) * SR); m2 = min(n, N - s)
        if m2 <= 0: continue
        pan = 0.35 * (-1) ** i
        out[s:s + m2, 0] += y[:m2] * gain * (1 - pan); out[s:s + m2, 1] += y[:m2] * gain * (1 + pan)
    return out

def pulse(t0, t1, bpm=66, gain=0.5, ramp=(0.4, 1.0)):
    out = np.zeros((N, 2)); beat = 60 / bpm; k = 0
    while True:
        t = t0 + k * beat
        if t >= t1: break
        n = int(0.9 * SR); tt = t_axis(n)
        f = 48 + 40 * np.exp(-tt / 0.04)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.32)
        y += bp(rng.normal(0, 1, n), 150, 2500) * np.exp(-tt / 0.03) * 0.45
        g = gain * np.interp(t, [t0, t1], ramp) * (1.0 if k % 2 == 0 else 0.62)
        s = int(t * SR); m = min(n, N - s)
        out[s:s + m] += np.stack([y[:m], y[:m]], 1) * g
        k += 1
    return out

def strings(t0, t1, notes=(69, 70, 74), gain=0.07):
    n = int((t1 - t0) * SR); tt = t_axis(n); out = np.zeros((N, 2))
    x = np.zeros((n, 2))
    for i, m in enumerate(notes):
        for c in range(2):
            x[:, c] += saw(midi(m) * (1 + (c - 0.5) * 0.004 + i * 0.0007), n, rng.random() * 6, 20)
    trem = 0.8 + 0.2 * np.sin(2 * np.pi * 6.2 * tt)
    e = smooth(tt / 4.0) * smooth((t1 - t0 - tt) / 2.0) * (0.5 + 0.5 * tt / tt[-1])
    x = bp(x, 300, 3200) * (trem * e)[:, None] * gain
    out[int(t0 * SR):int(t0 * SR) + n] += x
    return out

def build_music():
    s10 = st("s10-ending")
    m = pad_layer() * 0.2 + sub_drone() * 0.14
    m += braam(1.0, 2.4, 0.38) + braam(2.0, 3.2, 0.55, root=26)
    m += braam(st("s06-evidence") + SEG["n11"]["start"] - st("s06-evidence") - 0.02, 2.6, 0.28, root=29)
    m += braam(s10 + 0.9, 4.5, 0.42, root=26)
    m += bell_motif(st("s02-voyage") + 0.35)
    m += bell_motif(st("s04-discovery") + 0.4, notes=(69, 74, 72), gain=0.16)
    m += bell_motif(st("s09-question") + 0.6, notes=(74, 77, 76, 69), gain=0.2)
    m += bell_motif(s10 + 2.2, notes=(74, 69, 62), gap=0.9, gain=0.2)
    m += pulse(st("s06-evidence") + 0.4, SEG["n14"]["start"] - 0.2, gain=0.55)
    m += pulse(st("s08-investigation") + 0.3, st("s09-question") - 0.3, bpm=60, gain=0.35, ramp=(0.6, 1.0))
    m += strings(st("s07-theories"), st("s09-question") + 1.5)
    m = reverb(hp(m, 32), rt=4.5, mix=0.32)
    m *= env_points([(0, 0), (0.05, 1), (TOTAL - 3.2, 1), (TOTAL - 0.2, 0), (TOTAL, 0)])[:, None]
    return normalize(m, -3.0)

# ──────────────────────────── ambience ────────────────────────────
def colored(n, beta, seed):
    r = np.random.default_rng(seed); X = np.fft.rfft(r.normal(0, 1, n))
    f = np.fft.rfftfreq(n, 1 / SR); f[0] = f[1]
    y = np.fft.irfft(X / f ** (beta / 2), n); return y / np.abs(y).max()

def build_ambience():
    tt = t_axis(N)
    ocean = np.stack([colored(N, 1.6, 1), colored(N, 1.6, 2)], 1)
    ocean = bp(ocean, 90, 900)
    swell = 0.55 + 0.45 * smooth(0.5 + 0.5 * np.sin(2 * np.pi * tt / 7.3) * np.sin(2 * np.pi * tt / 3.1 + 1))
    surf = hp(np.stack([colored(N, 1.0, 3), colored(N, 1.0, 4)], 1), 500)
    surf = lp(surf, 4000) * (smooth(np.sin(2 * np.pi * tt / 7.3 + 0.6)) ** 3)[:, None]
    wind = np.zeros((N, 2))
    for i, (lo, hi) in enumerate([(250, 600), (500, 1100), (900, 1900)]):
        layer = bp(np.stack([colored(N, 0.5, 10 + i), colored(N, 0.5, 20 + i)], 1), lo, hi)
        g = 0.5 + 0.5 * np.sin(2 * np.pi * tt / (5.1 + 2.3 * i) + i * 2)
        wind += layer * (g ** 2)[:, None]
    wind /= np.abs(wind).max()
    rumble = lp(np.stack([colored(N, 2.0, 30), colored(N, 2.0, 31)], 1), 120)
    sea = ocean * swell[:, None] * 0.8 + surf * 1.1
    S = lambda sid, d=0.0: st(sid) + d
    sea_e = env_points([(0, 0.0), (0.3, 0.75), (S("s02-voyage") - 0.3, 0.85), (S("s02-voyage") + 0.6, 0.18),
                        (S("s04-discovery") - 0.4, 0.2), (S("s04-discovery") + 0.6, 0.8), (S("s05-empty-ship"), 0.75),
                        (S("s05-empty-ship") + 0.6, 0.0), (S("s06-evidence"), 0.0), (S("s06-evidence") + 0.5, 0.12),
                        (S("s08-investigation"), 0.1), (S("s08-investigation") + 0.6, 0.05),
                        (S("s09-question") - 0.4, 0.05), (S("s09-question") + 1.2, 0.9), (S("s10-ending"), 0.8),
                        (S("s10-ending") + 2.5, 0.3), (TOTAL - 0.3, 0.0), (TOTAL, 0)])
    wind_e = env_points([(0, 0), (0.6, 0.9), (S("s02-voyage") - 0.3, 0.8), (S("s02-voyage") + 0.6, 0.1),
                         (S("s04-discovery"), 0.1), (S("s04-discovery") + 0.8, 0.35), (S("s05-empty-ship"), 0.3),
                         (S("s05-empty-ship") + 0.6, 0.12), (S("s06-evidence") + 0.5, 0.05),
                         (S("s07-theories") + 0.3, 0.05), (S("s07-theories") + 1.0, 0.75), (S("s07-theories") + 4.0, 0.7),
                         (S("s07-theories") + 5.0, 0.08), (S("s08-investigation"), 0.04), (S("s09-question"), 0.05),
                         (S("s09-question") + 1.5, 0.55), (TOTAL - 0.3, 0), (TOTAL, 0)])
    # inside the hull: the sea heard through wood
    hull = lp(sea, 260) * 2.2
    hull_e = env_points([(0, 0), (S("s05-empty-ship"), 0), (S("s05-empty-ship") + 0.4, 0.9),
                         (S("s06-evidence") - 0.2, 0.8), (S("s06-evidence") + 0.4, 0), (TOTAL, 0)])
    rumble_e = env_points([(0, 0.0), (0.2, 1.0), (2.4, 0.7), (S("s02-voyage"), 0.3), (S("s02-voyage") + 0.6, 0.1),
                           (S("s09-question"), 0.2), (S("s09-question") + 2, 0.6), (TOTAL - 0.3, 0), (TOTAL, 0)])
    amb = sea * sea_e[:, None] + wind * wind_e[:, None] * 0.9 + hull * hull_e[:, None] + rumble * rumble_e[:, None] * 0.3
    return normalize(amb, -3.0)

# ──────────────────────────── sound effects ────────────────────────────
def sfx_sonar(seed=0, f0=1150):
    n = int(3.2 * SR); tt = t_axis(n)
    f = f0 * (1 - 0.015 * (1 - np.exp(-tt / 0.3)))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.55) * np.minimum(1, tt / 0.006)
    y += 0.25 * np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR) * np.exp(-tt / 0.25)
    d = int(0.42 * SR); echo = np.zeros(n); echo[d:] = lp(y, 2500)[:-d] * 0.35
    out = reverb(y + echo, rt=2.8, mix=0.45, seed=seed)
    return normalize(out, -2)

def sfx_creak(seed, dur=1.1, f_from=26, f_peak=70, f_to=34):
    r = np.random.default_rng(seed); n = int(dur * SR); tt = t_axis(n)
    rate = np.interp(tt, [0, dur * 0.45, dur], [f_from, f_peak, f_to]) * (1 + 0.15 * r.normal(0, 1, n).cumsum() / np.sqrt(n) )
    ph = np.cumsum(rate) / SR; imp = np.zeros(n)
    idx = np.where(np.diff(np.floor(ph)) > 0)[0]; imp[idx] = 1 + 0.4 * r.normal(0, 1, len(idx))
    res = np.zeros(int(0.12 * SR)); rt_ = t_axis(len(res))
    for fr, dec, g in [(190, 0.05, 1.0), (360, 0.035, 0.8), (640, 0.025, 0.6), (1180, 0.015, 0.4), (2300, 0.008, 0.2)]:
        res += g * np.sin(2 * np.pi * fr * (1 + 0.03 * r.random()) * rt_) * np.exp(-rt_ / dec)
    y = signal.fftconvolve(imp, res)[:n]
    y *= smooth(tt / 0.15) * smooth((dur - tt) / 0.25)
    y = hp(y, 120)
    return normalize(reverb(y, rt=1.6, mix=0.3, seed=seed + 50), -3)

def sfx_thunder(seed, dur=4.5):
    r = np.random.default_rng(seed); n = int(dur * SR); tt = t_axis(n)
    crack = hp(r.normal(0, 1, n), 1200) * np.exp(-tt / 0.07) * 0.5
    rum = lp(colored(n, 1.8, seed), 160) * (smooth(tt / 0.25) * np.exp(-tt / 1.4))
    rolls = 0.7 + 0.3 * np.sin(2 * np.pi * tt * 2.3) * np.sin(2 * np.pi * tt * 0.9)
    y = crack * smooth(1 - tt / 0.5) + rum * rolls * 1.4
    return normalize(reverb(lp(y, 3000), rt=3.5, mix=0.4, seed=seed), -2)

def sfx_paper(seed, dur=0.55):
    r = np.random.default_rng(seed); n = int(dur * SR); tt = t_axis(n)
    x = bp(r.normal(0, 1, n), 1800, 7000)
    grains = np.zeros(n)
    for _ in range(26):
        c = r.random() * dur * 0.85; w = 0.004 + r.random() * 0.02
        grains += np.exp(-((tt - c) / w) ** 2) * (0.4 + r.random())
    y = x * (0.15 + grains) * smooth(tt / 0.04) * smooth((dur - tt) / 0.12)
    return normalize(np.stack([y, np.roll(y, 40)], 1), -4)

def sfx_tick(seed, pitch=3200):
    n = int(0.12 * SR); tt = t_axis(n)
    y = np.sin(2 * np.pi * pitch * tt) * np.exp(-tt / 0.006) + bp(np.random.default_rng(seed).normal(0, 1, n), 2000, 8000) * np.exp(-tt / 0.003) * 0.6
    return normalize(reverb(y, rt=0.6, mix=0.2, seed=seed), -6)

def sfx_boom(seed=3):
    n = int(4 * SR); tt = t_axis(n)
    f = 38 + 50 * np.exp(-tt / 0.08)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.9)
    y += lp(np.random.default_rng(seed).normal(0, 1, n), 400) * np.exp(-tt / 0.12) * 0.4
    return normalize(reverb(y, rt=3.0, mix=0.35, seed=seed), -1.5)

if __name__ == "__main__":
    os.makedirs(os.path.join(ROOT, "assets/audio/sfx"), exist_ok=True)
    W = lambda name, x: sf.write(os.path.join(ROOT, "assets/audio/sfx", name), x.astype(np.float32), SR)
    W("sonar-1.wav", sfx_sonar(1)); W("sonar-2.wav", sfx_sonar(2, f0=980))
    W("creak-1.wav", sfx_creak(11)); W("creak-2.wav", sfx_creak(12, 1.4, 20, 55, 28)); W("creak-3.wav", sfx_creak(13, 0.8, 35, 90, 45))
    W("thunder-1.wav", sfx_thunder(21)); W("thunder-2.wav", sfx_thunder(22, 5.5))
    W("paper-1.wav", sfx_paper(31)); W("paper-2.wav", sfx_paper(32, 0.7)); W("paper-3.wav", sfx_paper(33, 0.45))
    W("tick-1.wav", sfx_tick(41)); W("tick-2.wav", sfx_tick(42, 2600))
    W("boom.wav", sfx_boom())
    print("sfx ok")
    write_mp3("music.mp3", build_music()); print("music ok")
    write_mp3("ambience.mp3", build_ambience()); print("ambience ok", TOTAL)
