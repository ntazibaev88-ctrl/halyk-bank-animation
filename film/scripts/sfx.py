"""Synthesised sound design elements (deterministic). Writes audio/sfx/*.wav at 48 kHz."""
import os, wave
import numpy as np

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "audio", "sfx")
rng = np.random.default_rng(1986)

def save(name, x):
    x = np.asarray(x, dtype=np.float32)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / max(1e-9, np.abs(x).max()) * 0.89
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s = (1 - a) * x[i] + a * s; y[i] = s
    return y

def fft_band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = ((f >= lo) & (f <= hi)).astype(float)
    # soft edges
    m = np.convolve(m, np.hanning(64) / np.hanning(64).sum(), mode="same")
    return np.fft.irfft(X * m, len(x))

def snow_step(level=1.0, dur=0.22):
    n = int(dur * SR); t = np.arange(n) / SR
    env = (1 - np.exp(-t / 0.012)) * np.exp(-t / (dur * 0.35))
    noise = rng.normal(0, 1, n)
    # crunch = dense random crackles (compressed snow crystals)
    crackle = np.zeros(n); k = rng.integers(0, n, int(380 * dur * 10))
    crackle[k] = rng.uniform(-1, 1, len(k)) * rng.uniform(0.3, 1, len(k))
    c = fft_band(crackle * 3 + noise * 0.4, 900, 7500)
    low = fft_band(noise, 80, 400) * 0.5
    return (c + low) * env * level

def footsteps(total, walkers):
    out = np.zeros((int(total * SR), 2))
    for (rate, pan, lvl, t0) in walkers:
        t = t0
        while t < total - 0.4:
            s = snow_step(lvl * rng.uniform(0.75, 1.1), rng.uniform(0.18, 0.28))
            i = int(t * SR); j = min(len(out), i + len(s))
            out[i:j, 0] += s[: j - i] * (1 - pan) ; out[i:j, 1] += s[: j - i] * pan
            t += 60 / rate * rng.uniform(0.93, 1.07)
    return out

def room_tone(total):
    n = int(total * SR)
    b = np.cumsum(rng.normal(0, 1, n)); b -= onepole_lp(b, 3)  # brown noise, DC removed
    b = fft_band(b, 40, 900)
    hiss = fft_band(rng.normal(0, 1, n), 2000, 9000) * 0.02
    return np.stack([b + hiss, np.roll(b, 977) + hiss], 1)

def swell(dur, lo=200, hi=6000, rise=0.75):
    """Filtered-noise swell (transition 'whoosh' into light)."""
    n = int(dur * SR); t = np.arange(n) / SR
    env = np.where(t < dur * rise, (t / (dur * rise)) ** 2.2, np.exp(-(t - dur * rise) / (dur * 0.12)))
    x = rng.normal(0, 1, n)
    y = np.zeros(n)
    # sweep the band upward in 16 chunks
    chunks = 16
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        f0 = lo * (hi / lo) ** (c / chunks)
        seg = fft_band(x[max(0, a - 2048): b + 2048], f0 * 0.6, f0 * 2.2)
        y[a:b] = seg[(a - max(0, a - 2048)):(a - max(0, a - 2048)) + (b - a)]
    shimmer = fft_band(rng.normal(0, 1, n), 5000, 12000) * 0.25
    return (y + shimmer) * env

def impact(dur=4.0, f=42):
    """Soft low cinematic hit: sine drop + noise thump + long tail."""
    n = int(dur * SR); t = np.arange(n) / SR
    freq = f * (1 + 1.2 * np.exp(-t / 0.05))
    ph = 2 * np.pi * np.cumsum(freq) / SR
    body = np.sin(ph) * np.exp(-t / 1.1)
    thump = fft_band(rng.normal(0, 1, n), 30, 260) * np.exp(-t / 0.08) * 0.8
    air = fft_band(rng.normal(0, 1, n), 300, 3000) * np.exp(-t / 0.9) * 0.05
    return body + thump + air

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    save("steps_snow_crowd.wav", footsteps(15.0, [(102, 0.35, 1.0, 0.2), (96, 0.6, 0.7, 0.45), (110, 0.25, 0.5, 0.1),
                                                  (92, 0.75, 0.45, 0.6), (105, 0.5, 0.35, 0.3), (99, 0.15, 0.3, 0.8)]))
    save("room_tone.wav", room_tone(30.0))
    save("swell_4s.wav", swell(4.0))
    save("swell_2s.wav", swell(2.2, 300, 8000))
    save("impact.wav", impact())
    print("sfx written:", sorted(os.listdir(OUT)))

def wind(total, base=400, gust=0.6, seed=0):
    """Wind: noise through a slowly wandering band-pass, with gusts (FFT block processing)."""
    r = np.random.default_rng(seed)
    n = int(total * SR); out = np.zeros(n); blk = 4096; hop = 2048
    win = np.hanning(blk)
    lfo_t = np.arange(0, total + 2, 0.5)
    lfo = np.cumsum(r.normal(0, 0.25, len(lfo_t))); lfo = (lfo - lfo.min()) / (np.ptp(lfo) + 1e-9)
    f = np.fft.rfftfreq(blk, 1 / SR)
    for i in range(0, n - blk, hop):
        tt = i / SR; g = np.interp(tt, lfo_t, lfo)
        fc = base * (0.6 + 1.4 * g)
        X = np.fft.rfft(r.normal(0, 1, blk) * win)
        resp = np.exp(-0.5 * (np.log(f + 1) - np.log(fc)) ** 2 / 0.35) + 0.15 * np.exp(-0.5 * (np.log(f + 1) - np.log(fc * 3.2)) ** 2 / 0.2)
        out[i:i + blk] += np.fft.irfft(X * resp, blk) * (0.35 + gust * g)
    return np.stack([out, np.roll(out, 1543)], 1)

def flutter(total, rate=9.0, seed=3):
    """Cloth flag flapping in the wind: modulated filtered noise."""
    r = np.random.default_rng(seed); n = int(total * SR); t = np.arange(n) / SR
    x = fft_band(r.normal(0, 1, n), 300, 4000)
    ph = 2 * np.pi * np.cumsum(rate * (1 + 0.25 * np.sin(2 * np.pi * 0.3 * t))) / SR
    am = (0.5 + 0.5 * np.sin(ph)) ** 6 + 0.15
    return x * am

def drone(total, root=77.78, seed=5):
    """Dark string-like pad (Eb minor: Eb, Bb, Gb) with slow swells; detuned saw stack, low-passed."""
    r = np.random.default_rng(seed); n = int(total * SR); t = np.arange(n) / SR
    out = np.zeros((n, 2))
    voices = [(root, 1.0), (root * 1.5, 0.6), (root * 2, 0.55), (root * 2 * 2 ** (3 / 12), 0.35), (root * 3, 0.25), (root * 4 * 2 ** (3 / 12), 0.12)]
    for f0, a in voices:
        for d, pan in [(-0.11, 0.2), (0.0, 0.5), (0.13, 0.8)]:
            f = f0 * 2 ** (d / 12) * (1 + 0.0015 * np.sin(2 * np.pi * (0.13 + r.random() * 0.1) * t + r.random() * 6))
            ph = np.cumsum(f) / SR
            saw = 2 * (ph - np.floor(ph + 0.5))
            out[:, 0] += saw * a * (1 - pan); out[:, 1] += saw * a * pan
    for c in range(2):
        out[:, c] = fft_band(out[:, c], 30, 1400)
    env = 0.55 + 0.45 * np.sin(2 * np.pi * t / 11.0 - 1.2) ** 2
    att = np.minimum(1, t / 4.0)
    return out * (env * att)[:, None]

def tick(total, bpm=60):
    """Quiet mechanical clock (fallback if no recording)."""
    n = int(total * SR); out = np.zeros(n); r = np.random.default_rng(11)
    for k, tt in enumerate(np.arange(0.3, total, 60 / bpm)):
        i = int(tt * SR); m = int(0.03 * SR)
        click = fft_band(r.normal(0, 1, m), 2500 if k % 2 else 1800, 9000) * np.exp(-np.arange(m) / (0.004 * SR))
        out[i:i + m] += click[: n - i]
    return out

if __name__ == "__main__":
    save("wind_soft.wav", wind(40, 380, 0.5, 1))
    save("wind_winter.wav", wind(20, 650, 0.9, 2))
    save("flag_flutter.wav", flutter(20))
    save("drone_eb.wav", drone(34))
    save("clock.wav", tick(30))
    print("extra sfx written")
