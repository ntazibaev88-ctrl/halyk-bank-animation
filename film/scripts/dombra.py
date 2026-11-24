"""Synthesised two-string dombra (Karplus-Strong strings + wooden body resonances).

Plays short kui-like figures over a drone in a given key; used subtly under the score.
usage: python3 dombra.py <root_hz> <out_dir>
"""
import os, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(16121991)

def ks(f, dur, bright=0.6, decay=0.996):
    n = int(dur * SR); p = int(SR / f)
    buf = rng.uniform(-1, 1, p)
    # pick position comb: softer attack like a finger/plectrum on gut/nylon
    buf = buf - 0.6 * np.roll(buf, p // 7)
    y = np.zeros(n)
    frac = SR / f - p
    for i in range(n):
        j = i % p
        y[i] = buf[j]
        nxt = buf[(j + 1) % p]
        buf[j] = decay * (bright * buf[j] + (1 - bright) * nxt) * (1 - frac * 0.02)
    return y

def body(x):
    """Wooden body: parallel resonant biquads."""
    out = x * 0.4
    for f0, q, g in [(190, 6, 0.9), (380, 5, 0.6), (1150, 4, 0.35), (2600, 3, 0.15)]:
        w0 = 2 * np.pi * f0 / SR; al = np.sin(w0) / (2 * q)
        b0, b2 = al, -al; a0, a1, a2 = 1 + al, -2 * np.cos(w0), 1 - al
        y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
        for i in range(len(x)):
            v = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0
            x2, x1 = x1, x[i]; y2, y1 = y1, v; y[i] = v
        out = out + y * g
    return out

def note(f, dur, vel=1.0, bright=0.55):
    x = ks(f, dur, bright) * vel
    a = int(0.003 * SR); x[:a] *= np.linspace(0, 1, a)
    return x

def render(events, total):
    """events: (time, freq, vel, dur)"""
    y = np.zeros(int(total * SR) + SR)
    for t, f, v, d in events:
        x = note(f, d, v); i = int(t * SR)
        y[i:i + len(x)] += x[: len(y) - i]
    return body(y)[: int(total * SR)]

def save(path, x, pan=0.5):
    x = x / max(1e-9, np.abs(x).max()) * 0.85
    st = np.stack([x * (1.1 - pan), x * (0.1 + pan)], 1)
    st /= np.abs(st).max() / 0.85
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

if __name__ == "__main__":
    root = float(sys.argv[1]); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    st = lambda n: root * 2 ** (n / 12)          # semitone helper
    low, high = st(0), st(5)                     # dombra tuned in fourths
    # minor-pentatonic-ish kui steps on the upper string, relative to root
    scale = [0, 3, 5, 7, 10, 12, 15]
    # 1) "memory" figure: sparse plucks, rubato (scene 1 / 7)
    ev = []; t = 0.0
    phrase = [(5, 1.0), (7, 0.5), (10, 0.5), (7, 1.0), (5, 0.75), (3, 0.5), (0, 1.75), (3, 0.6), (5, 0.6), (7, 1.6)]
    for n, d in phrase:
        ev.append((t, st(n + 12 if n < 5 else n), 0.8, 2.5))
        ev.append((t + 0.004, low, 0.35, 2.5))
        t += d * 0.9
    save(os.path.join(out, "dombra_memory.wav"), render(ev, t + 3), 0.45)
    # 2) strummed kui pulse (finale): down-up triplet strums on both strings, 92 bpm
    ev = []; beat = 60 / 92; t = 0.0
    melody = [5, 5, 7, 5, 3, 0, 3, 5, 7, 10, 7, 5, 3, 5, 0, 0]
    for b, m in enumerate(melody):
        for k, (dt, v) in enumerate([(0, 0.9), (beat / 3, 0.45), (2 * beat / 3, 0.6)]):
            ev.append((t + dt, low, v * 0.6, 1.2))
            ev.append((t + dt + 0.006, st(m + 12) if k == 0 else high * 2 / 2, v, 1.2))
        t += beat
    save(os.path.join(out, "dombra_strum.wav"), render(ev, t + 2), 0.55)
    print("dombra rendered at root", root)
