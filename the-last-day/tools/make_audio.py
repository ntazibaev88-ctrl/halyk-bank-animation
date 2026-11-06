"""Synthesize the score and every sound effect for THE LAST DAY - EPISODE 1.

Run: python3 tools/make_audio.py
Writes assets/audio/music/score.wav (60 s, cut to the picture) and assets/audio/sfx/*.wav.
Everything is seeded, so a re-run gives identical files.
"""
import os
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
ROOT = os.path.join(os.path.dirname(__file__), "..", "assets", "audio")
rng = np.random.default_rng(1337)


# ---------- building blocks ----------
def t_axis(d):
    return np.arange(int(d * SR)) / SR


def noise(d, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    return r.standard_normal(int(d * SR))


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="high", fs=SR, output="sos"), x)


def reson(x, f, q):
    b, a = signal.iirpeak(f, q, fs=SR)
    return signal.lfilter(b, a, x)


def expenv(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay)


def place(buf, x, at, gain=1.0):
    i = int(at * SR)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[: j - i] * gain


def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l, x * r], 1)


def reverb(x, size=2.0, wet=0.3, damp=4000, seed=7):
    """Stereo convolution reverb from decaying filtered noise."""
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    n = int(size * SR)
    r = np.random.default_rng(seed)
    out = np.zeros((len(x) + n - 1, 2))
    for c in range(2):
        ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR / (size / 6.5))
        ir = lp(ir, damp)
        ir[: int(0.012 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, c] = signal.fftconvolve(x[:, c], ir)
    dry = np.zeros_like(out)
    dry[: len(x)] = x
    return dry * (1 - wet) + out * wet


def saw_add(f, t, nh=10, phase_seed=0):
    """Band-limited-ish saw from harmonics; f may be an array (glide)."""
    ph = 2 * np.pi * np.cumsum(f) / SR
    r = np.random.default_rng(phase_seed)
    out = np.zeros_like(t)
    for h in range(1, nh + 1):
        out += np.sin(h * ph + r.uniform(0, 6.28)) / h
    return out


def norm(x, peak_db=-1.0):
    p = np.max(np.abs(x)) + 1e-9
    return x / p * 10 ** (peak_db / 20)


def save(name, x, sub="sfx", peak_db=-1.0, fade=0.01):
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = norm(x, peak_db)
    nf = int(fade * SR)
    if nf:
        x[-nf:] *= np.linspace(1, 0, nf)[:, None]
    path = os.path.join(ROOT, sub, name + ".wav")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    wavfile.write(path, SR, (x * 32767).astype(np.int16))
    print("wrote", sub, name, round(len(x) / SR, 2), "s")


# ---------- voices of the city ----------
def scream(d=1.8, f0=620, seed=3, distance=1.0):
    t = t_axis(d)
    r = np.random.default_rng(seed)
    glide = f0 * (1 + 0.55 * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.7)
    jitter = lp(r.standard_normal(len(t)), 30) * 0.4
    f = glide * (1 + 0.025 * np.sin(2 * np.pi * 6.3 * t) + 0.02 * jitter)
    src = saw_add(f, t, nh=24, phase_seed=seed) + 0.25 * r.standard_normal(len(t))
    v = reson(src, 900, 4) + 0.8 * reson(src, 1350, 6) + 0.5 * reson(src, 2800, 8) + 0.2 * reson(src, 3800, 10)
    env = np.clip(t / 0.08, 0, 1) * np.clip((d - t) / 0.5, 0, 1)
    v = np.tanh(v * env * 1.5)
    if distance > 0.5:
        v = lp(v, 2600)
        return reverb(v, size=3.0, wet=0.65, damp=2500, seed=seed)
    return reverb(v, size=1.6, wet=0.25, seed=seed)


def growl(d=1.6, seed=11, base=72):
    t = t_axis(d)
    r = np.random.default_rng(seed)
    pulses = (np.sin(2 * np.pi * (34 + 8 * np.sin(2 * np.pi * 1.3 * t)) * t) > 0.6).astype(float)
    rasp = r.standard_normal(len(t)) * (0.3 + lp(pulses, 400))
    tone = saw_add(base * (1 + 0.08 * lp(r.standard_normal(len(t)), 8) * 10), t, nh=30, phase_seed=seed)
    src = rasp + 0.6 * tone
    v = reson(src, 420, 3) + 0.7 * reson(src, 780, 4) + 0.35 * reson(src, 2300, 6)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.6
    return np.tanh(v * env * 2.2)


def siren(d=8.0, seed=5):
    t = t_axis(d)
    f = 900 + 380 * np.sin(2 * np.pi * t / 3.6)
    s = saw_add(f, t, nh=6, phase_seed=seed)
    s = lp(s, 2200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t))
    s *= np.clip(t / 1.5, 0, 1) * np.clip((d - t) / 1.5, 0, 1)
    return reverb(s, size=3.5, wet=0.7, damp=2000, seed=seed)


def wind_rain(d, seed=21, rain=True):
    r = np.random.default_rng(seed)
    w = lp(r.standard_normal(int(d * SR)), 500)
    mod = 0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t_axis(d) + 1) * np.sin(2 * np.pi * 0.17 * t_axis(d))
    out = w * mod * 2
    if rain:
        hiss = hp(r.standard_normal(int(d * SR)), 2500) * 0.25
        drops = np.zeros(int(d * SR))
        idx = r.integers(0, len(drops), int(d * 160))
        drops[idx] = r.uniform(0.2, 1, len(idx))
        drops = bp(drops, 1500, 7000) * 3
        out = out + hiss + drops
    rumble = lp(r.standard_normal(int(d * SR)), 70) * 4
    return np.stack([out + rumble, np.roll(out, 900) + rumble], 1)


# ---------- foley ----------
def thud(d=0.5, f=60, seed=0, wood=True):
    t = t_axis(d)
    r = np.random.default_rng(seed)
    body = np.sin(2 * np.pi * (f + 50 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.09)
    hit = lp(r.standard_normal(len(t)), 1800) * np.exp(-t / 0.012)
    x = body * 1.4 + hit
    if wood:
        n = r.standard_normal(len(t)) * np.exp(-t / 0.004)
        x += 1.5 * (reson(n, 190, 6) + 0.8 * reson(n, 340, 8) + 0.5 * reson(n, 620, 10)) * np.exp(-t / 0.12)
    return x


def knock(seed=0, soft=True):
    if soft:
        x = thud(0.35, 90, seed) * 0.6
        return reverb(lp(x, 3000), size=0.6, wet=0.2, seed=seed)
    x = thud(0.9, 52, seed) * 1.6
    r = np.random.default_rng(seed + 100)
    # chain and frame rattle after the slam
    rat = np.zeros(int(0.9 * SR))
    for k in range(9):
        at = int((0.02 + k * 0.035 + r.uniform(0, 0.02)) * SR)
        tt = np.arange(int(0.05 * SR)) / SR
        ping = sum(np.sin(2 * np.pi * fr * tt) for fr in r.uniform(2500, 6000, 3)) * np.exp(-tt / 0.012)
        rat[at: at + len(ping)] += ping * 0.25 * np.exp(-k / 4)
    x = np.tanh(x * 1.6) + rat
    return reverb(x, size=0.9, wet=0.22, seed=seed)


def footstep(seed=0, heavy=True):
    x = thud(0.4, 48 if heavy else 85, seed, wood=heavy)
    r = np.random.default_rng(seed)
    scuff = bp(r.standard_normal(int(0.4 * SR)), 300, 2500) * expenv(int(0.4 * SR), 0.03, 0.08) * 0.4
    return lp(x + scuff, 2500 if heavy else 5000)


def creak(d=1.1, seed=4):
    t = t_axis(d)
    rate = 28 + 50 * np.sin(np.pi * t / d)
    ph = np.cumsum(rate) / SR
    pulses = (np.diff(np.floor(ph), prepend=0) > 0).astype(float)
    x = reson(pulses, 520, 12) + 0.7 * reson(pulses, 930, 14) + 0.4 * reson(pulses, 1450, 16)
    x *= np.sin(np.pi * t / d) ** 0.5
    return reverb(x, size=1.2, wet=0.3, seed=seed)


def bolt():
    d = 0.75
    n = int(d * SR)
    t = t_axis(d)
    slide = bp(noise(d, 31), 1500, 4800) * np.clip(t / 0.05, 0, 1) * np.clip((0.42 - t) / 0.05, 0, 1)
    slide *= 0.6 + 0.4 * (lp(noise(d, 32), 40) * 6)
    clack = np.zeros(n)
    i = int(0.43 * SR)
    tt = t[: n - i]
    clack[i:] = sum(a * np.sin(2 * np.pi * f * tt) for f, a in [(2150, 1), (3420, 0.7), (5230, 0.5), (190, 1.2)]) * np.exp(-tt / 0.05)
    return reverb(slide * 0.5 + clack, size=0.7, wet=0.25)


def knife_draw():
    d = 1.4
    t = t_axis(d)
    sweep = bp(noise(d, 41), 2500, 9000) * np.clip(t / 0.05, 0, 1) * np.exp(-np.maximum(t - 0.25, 0) / 0.08)
    ring = sum(a * np.sin(2 * np.pi * f * t) for f, a in [(4230, 1), (6710, 0.6), (9080, 0.35), (2890, 0.5)])
    ring *= np.clip((t - 0.2) / 0.02, 0, 1) * np.exp(-np.maximum(t - 0.2, 0) / 0.35)
    return reverb(sweep * 0.8 + ring * 0.35, size=1.4, wet=0.35)


def phone_buzz(pattern=((0, 0.45), (0.65, 0.45), (1.6, 0.45), (2.25, 0.45))):
    d = 3.0
    t = t_axis(d)
    gate = np.zeros(len(t))
    for s, l in pattern:
        gate += ((t >= s) & (t < s + l)) * np.clip((t - s) / 0.01, 0, 1)
    motor = signal.square(2 * np.pi * 172 * t) * 0.5 + np.sin(2 * np.pi * 172 * t)
    rattle = bp(noise(d, 51), 900, 3500) * (0.5 + 0.5 * signal.square(2 * np.pi * 86 * t))
    x = lp(motor, 1200) + 0.35 * rattle
    return x * lp(gate, 60)


def heartbeat(n=6, bpm=96, seed=0):
    beat = 60 / bpm
    out = np.zeros(int((n * beat + 0.6) * SR))
    for k in range(n):
        for off, g in [(0, 1.0), (0.17, 0.65)]:
            t = t_axis(0.35)
            th = np.sin(2 * np.pi * (48 + 30 * np.exp(-t / 0.03)) * t) * np.exp(-t / 0.07)
            i = int((k * beat + off) * SR)
            out[i: i + len(th)] += th * g
    return lp(out, 200)


def breathing(d=4.0, seed=61):
    t = t_axis(d)
    r = np.random.default_rng(seed)
    src = r.standard_normal(len(t))
    v = reson(src, 650, 2) + 0.7 * reson(src, 1700, 3) + 0.3 * hp(src, 3000)
    cyc = 1.35
    ph = (t % cyc) / cyc
    env = np.where(ph < 0.42, np.sin(np.pi * ph / 0.42) * 0.55, np.sin(np.pi * (ph - 0.42) / 0.58) * 0.9)
    env *= 1 + 0.35 * np.sin(2 * np.pi * 9 * t)  # shaking
    env *= np.clip(t / 0.3, 0, 1) * np.clip((d - t) / 0.4, 0, 1)
    return reverb(lp(v * env, 4500), size=0.5, wet=0.15)


def tv_static(d=7.0, seed=71):
    t = t_axis(d)
    r = np.random.default_rng(seed)
    s = bp(r.standard_normal(len(t)), 800, 9000)
    crackle = np.zeros(len(t))
    idx = r.integers(0, len(t), int(d * 300))
    crackle[idx] = r.uniform(-1, 1, len(idx))
    hum = 0.25 * np.sin(2 * np.pi * 50 * t) + 0.1 * np.sin(2 * np.pi * 100 * t)
    return s * 0.5 + bp(crackle, 1000, 8000) * 2 + hum


def eas_tone(d=1.6):
    t = t_axis(d)
    x = np.sin(2 * np.pi * 853 * t) + np.sin(2 * np.pi * 960 * t)
    x *= np.clip(t / 0.01, 0, 1) * np.clip((d - t) / 0.01, 0, 1)
    return lp(x, 3500)


def sub_boom(d=3.0, f0=95, f1=32):
    t = t_axis(d)
    f = f1 + (f0 - f1) * np.exp(-t / 0.25)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9)
    x += lp(noise(d, 81), 300) * np.exp(-t / 0.08) * 0.8
    return reverb(np.tanh(x * 1.3), size=2.5, wet=0.3, damp=1500)


def string_stab(d=2.5, seed=91):
    """Dissonant string cluster stab - horror 'sting'."""
    t = t_axis(d)
    notes = [196.0, 207.65, 277.18, 293.66, 415.3, 440.0, 587.33, 622.25, 1174.7, 1244.5]
    x = sum(saw_add(f * (1 + 0.006 * np.sin(2 * np.pi * (5 + i * 0.3) * t)), t, nh=14, phase_seed=i)
            for i, f in enumerate(notes))
    x += 0.4 * hp(noise(d, seed), 3000)
    x = lp(x, 6000) * np.clip(t / 0.015, 0, 1) * np.exp(-t / 0.9)
    return reverb(np.tanh(x * 0.5), size=3.0, wet=0.35)


def whoosh_dark(d=1.2, seed=101):
    t = t_axis(d)
    env = np.sin(np.pi * t / d) ** 2
    fc = 300 + 2500 * env
    x = noise(d, seed)
    out = np.zeros_like(x)
    # time-varying bandpass in blocks
    blk = 1024
    for i in range(0, len(x), blk):
        f = fc[min(i, len(fc) - 1)]
        out[i: i + blk] = bp(x[max(0, i - 4096): i + blk], f * 0.6, min(f * 1.6, 20000))[-len(x[i: i + blk]):]
    return out * env


# ---------- the score ----------
def score():
    D = 60.0
    n = int(D * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))

    def seg(a, b, fade_in=1.0, fade_out=1.0):
        return np.clip((t - a) / fade_in, 0, 1) * np.clip((b - t) / fade_out, 0, 1)

    # 1. sub drone through the whole film (A1/Bb1 rub), with mid harmonics for phone speakers
    drone = (saw_add(np.full(n, 55.0), t, 8, 1) + 0.8 * saw_add(np.full(n, 58.27), t, 8, 2)
             + 0.5 * saw_add(np.full(n, 110.3), t, 6, 3))
    drone = lp(drone, 420) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.05 * t))
    drone_env = seg(0, 58.95, 0.05, 0.01) * (0.5 + 0.5 * seg(12, 58.95, 6, 0.01))
    out += stereo(drone * drone_env * 0.5)

    # 2. opening: high screeching strings 0-2.6 s, then tense pulse under the title
    sc = saw_add(1480 * (1 + 0.012 * np.sin(2 * np.pi * 7 * t)), t, 6, 4) + saw_add(1568 * (1 + 0.01 * np.sin(2 * np.pi * 6.1 * t)), t, 6, 5)
    out += stereo(lp(sc, 5000) * seg(0, 2.55, 0.05, 0.05) * 0.16, -0.3)

    # 3. eerie pad (minor-second cluster) from the broadcast through the window, with slow swells
    pad_freqs = [220.0, 233.08, 329.63, 349.23, 440.0, 466.16]
    pad = sum(saw_add(f * (1 + 0.004 * np.sin(2 * np.pi * (0.2 + 0.07 * i) * t)), t, 9, 10 + i)
              for i, f in enumerate(pad_freqs))
    pad = lp(pad, 1600) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 7.0) ** 2)
    out += stereo(pad * seg(5.2, 32.5, 2.5, 1.5) * 0.06, 0.2)

    # 4. pulse ostinato from the knocking, accelerating until the knocking stops at 40.8 s
    k_t = 22.6
    period = 0.95
    while k_t < 40.7:
        env_x = sub_boom(0.6, 80, 40)[:, 0]
        place(out, env_x, k_t, 0.22 * min(1, (k_t - 22) / 6 + 0.3))
        k_t += period
        period = max(0.42, period * 0.965)

    # 5. rising tension strings 32-40.8 (gliss cluster), hard stop when the knocking stops
    rise = sum(saw_add(f * (1 + 0.35 * np.clip((t - 32) / 8.8, 0, 1)) * (1 + 0.006 * np.sin(2 * np.pi * 5.5 * t)), t, 8, 20 + i)
               for i, f in enumerate([392.0, 415.3, 587.3]))
    out += stereo(lp(rise, 4000) * seg(32.0, 40.85, 3.0, 0.02) * np.clip((t - 32) / 8.8, 0, 1) * 0.07, -0.2)

    # 6. thin high tone in the silence 40.8-45 (fragile)
    thin = np.sin(2 * np.pi * 2093 * t) * (1 + 0.003 * np.sin(2 * np.pi * 4 * t))
    out += stereo(thin * seg(41.0, 45.4, 1.5, 0.8) * 0.018)

    # 7. Shepard-like endless rise 45-58.4 into the reveal
    rise_t = np.clip((t - 45) / 13.4, 0, 1)
    shep = np.zeros(n)
    for k in range(7):
        pos = (k / 7 + rise_t * 0.9) % 1.0
        f = 55 * 2 ** (pos * 7)
        amp = np.exp(-((pos - 0.5) ** 2) / 0.06)
        shep += np.sin(2 * np.pi * np.cumsum(f) / SR) * amp
    out += stereo(lp(shep, 3000) * seg(45.0, 58.42, 2.0, 0.02) * (0.3 + 0.7 * rise_t) * 0.12)

    # 8. final clusters crescendo, cut at the impact; everything stops at the hard cut (58.95)
    cl = sum(saw_add(np.full(n, f), t, 10, 40 + i) for i, f in enumerate([146.8, 155.6, 207.7, 311.1]))
    out += stereo(lp(cl, 2500) * seg(55.0, 58.42, 3.0, 0.02) * np.clip((t - 55) / 3.4, 0, 1) ** 2 * 0.09)

    out[int(58.95 * SR):] = 0
    return out


def city_bed():
    d = 22.0
    x = wind_rain(d, 21, rain=True) * 0.35
    s = siren(9.0, 5)
    place(x, s[:, 0], 0.4, 0.25)
    place(x, scream(1.6, 700, 8)[:, 0], 6.0, 0.2)
    x[:, 1] = np.roll(x[:, 1], 300)
    return x


def main():
    save("score", score(), sub="music", peak_db=-1.0)

    # street / window ambience
    save("amb_city", city_bed(), peak_db=-6)
    save("amb_room", wind_rain(25, 23, rain=True) * 0.6, peak_db=-6)
    save("siren_far", siren(10.0, 6), peak_db=-3)
    # opening attack
    save("scream_close", scream(1.4, 760, 9, distance=0), peak_db=-1)
    save("scream_far_1", scream(1.7, 640, 3), peak_db=-2)
    save("scream_far_2", scream(1.3, 820, 12), peak_db=-2)
    save("growl_1", reverb(growl(1.6, 11, 70), 1.2, 0.25), peak_db=-1)
    save("growl_2", reverb(growl(1.1, 13, 82), 1.0, 0.2), peak_db=-1)
    save("growl_close", growl(2.0, 17, 64), peak_db=-1)
    run = np.zeros(int(2.0 * SR))
    for k in range(6):
        place_mono = footstep(k, heavy=False) * (0.5 + k * 0.1)
        i = int(k * 0.29 * SR)
        run[i: i + len(place_mono)] += place_mono[: len(run) - i]
    save("steps_run", run, peak_db=-3)
    for k in range(3):
        save(f"step_heavy_{k + 1}", reverb(footstep(20 + k, heavy=True), 1.0, 0.25, seed=k), peak_db=-1)
    # broadcast
    save("tv_static", tv_static(7.0), peak_db=-4)
    save("static_burst", tv_static(0.5, 72) * np.linspace(1, 0.2, int(0.5 * SR)), peak_db=-2)
    save("eas_tone", eas_tone(1.6), peak_db=-4)
    # door
    for k in range(3):
        save(f"knock_soft_{k + 1}", knock(k, soft=True), peak_db=-1)
    for k in range(3):
        save(f"door_pound_{k + 1}", knock(30 + k, soft=False), peak_db=-1)
    save("bolt", bolt(), peak_db=-1)
    save("creak", creak(), peak_db=-2)
    # knife, phone, body
    save("knife_draw", knife_draw(), peak_db=-2)
    save("phone_buzz", phone_buzz(), peak_db=-2)
    save("heartbeat", heartbeat(7, 92), peak_db=-1)
    save("breathing", breathing(5.5), peak_db=-2)
    # hits
    save("sub_boom", sub_boom(3.0), peak_db=-1)
    save("sting", string_stab(2.5), peak_db=-1)
    save("whoosh_dark", whoosh_dark(1.0), peak_db=-2)


if __name__ == "__main__":
    main()
