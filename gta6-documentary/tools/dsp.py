"""Small DSP toolkit used by the music and SFX generators (numpy/scipy only)."""
import numpy as np
from scipy import signal

SR = 48000


def t_axis(dur, sr=SR):
    return np.arange(int(round(dur * sr))) / sr


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6,
        "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def n2m(name):
    """'D3' -> midi number."""
    pitch, octave = name[:-1], int(name[-1])
    return 12 * (octave + 1) + NOTE[pitch]


def saw(freq, dur, sr=SR, phase=0.0, os=4):
    """Anti-aliased-ish saw: naive saw rendered at `os`x then decimated."""
    n = int(round(dur * sr)) * os
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n // os,))
    f = np.repeat(f, os)
    ph = (phase + np.cumsum(f) / (sr * os)) % 1.0
    x = 2.0 * ph - 1.0
    return signal.resample_poly(x, 1, os)[: n // os]


def sine(freq, dur, sr=SR, phase=0.0):
    n = int(round(dur * sr))
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    return np.sin(2 * np.pi * (phase + np.cumsum(f) / sr))


def tri(freq, dur, sr=SR):
    n = int(round(dur * sr))
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    ph = np.cumsum(f) / sr % 1.0
    return 4 * np.abs(ph - 0.5) - 1


def noise(dur, sr=SR, seed=None):
    rng = np.random.default_rng(seed)
    return rng.standard_normal(int(round(dur * sr)))


def lp(x, fc, order=2, sr=SR):
    sos = signal.butter(order, min(fc, sr * 0.45), "low", fs=sr, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def hp(x, fc, order=2, sr=SR):
    sos = signal.butter(order, fc, "high", fs=sr, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def bp(x, lo, hi, order=2, sr=SR):
    sos = signal.butter(order, [lo, min(hi, sr * 0.45)], "band", fs=sr, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def sweep_filter(x, fc_curve, kind="low", q=0.9, block=256, sr=SR):
    """Time-varying resonant biquad (RBJ), coefficients updated per block."""
    y = np.zeros_like(x)
    z1 = z2 = 0.0
    n = len(x)
    for s in range(0, n, block):
        e = min(n, s + block)
        fc = float(np.clip(fc_curve[min(s, len(fc_curve) - 1)], 20, sr * 0.45))
        w0 = 2 * np.pi * fc / sr
        alpha = np.sin(w0) / (2 * q)
        cw = np.cos(w0)
        if kind == "low":
            b = np.array([(1 - cw) / 2, 1 - cw, (1 - cw) / 2])
        elif kind == "high":
            b = np.array([(1 + cw) / 2, -(1 + cw), (1 + cw) / 2])
        else:  # band
            b = np.array([alpha, 0, -alpha])
        a = np.array([1 + alpha, -2 * cw, 1 - alpha])
        b, a = b / a[0], a / a[0]
        seg, zf = signal.lfilter(b, a, x[s:e], zi=np.array([z1, z2]))
        z1, z2 = zf
        y[s:e] = seg
    return y


def env_adsr(n, a, d, s, r, sr=SR):
    a_n, d_n, r_n = int(a * sr), int(d * sr), int(r * sr)
    s_n = max(0, n - a_n - d_n - r_n)
    e = np.concatenate([
        np.linspace(0, 1, max(a_n, 1)),
        np.linspace(1, s, max(d_n, 1)),
        np.full(s_n, s),
        np.linspace(s, 0, max(r_n, 1)),
    ])
    if len(e) < n:
        e = np.pad(e, (0, n - len(e)))
    return e[:n]


def env_exp(n, decay, sr=SR):
    return np.exp(-np.arange(n) / (decay * sr))


def pan(x, p):
    """p in [-1, 1] -> stereo (equal power)."""
    ang = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(ang), x * np.sin(ang)], axis=1)


def place(buf, x, t, sr=SR):
    """Add mono/stereo clip `x` into stereo `buf` at time t (seconds)."""
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    i = int(round(t * sr))
    if i < 0:
        x = x[-i:]
        i = 0
    e = min(len(buf), i + len(x))
    if e > i:
        buf[i:e] += x[: e - i]


def make_ir(dur=3.2, decay=0.9, sr=SR, seed=7, damp=6000):
    rng = np.random.default_rng(seed)
    n = int(dur * sr)
    t = np.arange(n) / sr
    ir = rng.standard_normal((n, 2)) * np.exp(-t / decay * 3.0)[:, None]
    ir = lp(ir, damp, order=1)
    ir[: int(0.012 * sr)] *= np.linspace(0, 1, int(0.012 * sr))[:, None]
    return ir / np.sqrt(np.sum(ir ** 2, axis=0, keepdims=True))


def reverb(x, ir, wet=0.25):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    out = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x * (1 - wet) + out * wet


def delay(x, t, fb=0.35, mix=0.25, sr=SR, pingpong=True):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    d = int(t * sr)
    y = x.copy()
    tap = x.copy()
    for k in range(1, 6):
        tap = np.roll(tap, d, axis=0)
        tap[:d] = 0
        g = (fb ** k) * mix
        if pingpong:
            sh = tap[:, ::-1] if k % 2 else tap
            y += sh * g
        else:
            y += tap * g
    return y


def soft_clip(x, drive=1.0):
    return np.tanh(x * drive) / np.tanh(drive)


def db(v):
    return 10 ** (v / 20.0)


def normalize_peak(x, peak_db=-1.0):
    m = np.max(np.abs(x)) + 1e-12
    return x * (db(peak_db) / m)


def write_wav(path, x, sr=SR):
    from scipy.io import wavfile
    x = np.clip(x, -1, 1)
    wavfile.write(path, sr, (x * 32767).astype(np.int16))


def read_audio(path, sr=SR):
    """Decode any audio file through ffmpeg to float stereo at sr."""
    import subprocess
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(sr), "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
