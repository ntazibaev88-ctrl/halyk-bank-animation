"""Original score + sound design for the Almaty film, synthesised from scratch
(no samples, no copyrighted music).

Outputs (48 kHz stereo WAV):
  assets/audio/music.wav  cinematic score, already ducked under the voiceover
  assets/audio/fx.wav     ambience beds + whooshes / impacts at the cuts
"""
import json, pathlib, subprocess
import numpy as np
from scipy import signal

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
cuts = json.loads((ROOT / "data/cuts.json").read_text())
DUR = cuts["duration"]
N = int(DUR * SR) + SR * 4
rng = np.random.default_rng(1985)
scenes = {s["id"]: s for s in cuts["scenes"]}

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    sus = max(n - a - d - r, 0)
    e = np.concatenate([np.linspace(0, 1, a, endpoint=False) ** 1.6, np.linspace(1, s, d, endpoint=False),
                        np.full(sus, s), np.linspace(s, 0, r) ** 1.4])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))
def place(buf, x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= buf.shape[1]: return
    x = x[: buf.shape[1] - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i:i + len(x)] += x * gain * l * 1.414
    buf[1, i:i + len(x)] += x * gain * r * 1.414
def place_ch(buf, ch, x, at, gain=1.0):
    i = int(at * SR)
    if i >= buf.shape[1]: return
    x = x[: buf.shape[1] - i]
    buf[ch, i:i + len(x)] += x * gain
def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "bandpass", fs=SR, output="sos"), x)
def lp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, "lowpass", fs=SR, output="sos"), x)
def hp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, "highpass", fs=SR, output="sos"), x)

# ------------------------------------------------------------------ instruments
def saw_pad(freq, dur, bright=1.0, detune=(-7, 0, 7)):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for c in detune:
        f = freq * 2 ** (c / 1200); ph = rng.random() * 6.28
        for k in range(1, int(min(14, 7000 / f)) + 1):
            out += np.sin(2 * np.pi * f * k * t + ph * k) / k * np.exp(-k / (3.2 * bright))
    return out / len(detune)
def piano(freq, dur=3.2, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n); B = 0.00035
    for k in range(1, 11):
        fk = k * freq * np.sqrt(1 + B * k * k)
        if fk > 12000: break
        out += np.sin(2 * np.pi * fk * t) * (1 / k ** 1.2) * np.exp(-t * (0.9 + 0.55 * k) * (1 + freq / 1400))
    att = np.minimum(t / 0.004, 1)
    ham = lp(rng.standard_normal(n) * np.exp(-t * 90), 2500) * 0.08
    return (out * att + ham) * vel * 0.5
def strings(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(t / 1.5, 1)
    phase = 2 * np.pi * freq * np.cumsum(vib) / SR
    out = sum(np.sin(phase * k) / k ** 1.1 * np.exp(-k / 4) for k in range(1, 9))
    return lp(out, 3200)
def kick():
    t = np.arange(int(0.6 * SR)) / SR
    f = 45 + 70 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5) + lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 200) * 0.2
def clap():
    t = np.arange(int(0.5 * SR)) / SR
    e = sum(np.exp(-np.maximum(t - d, 0) * 60) * (t >= d) for d in (0, 0.011, 0.022)) + np.exp(-t * 14) * 0.4
    return bp(rng.standard_normal(len(t)), 900, 4200) * e * 0.5
def shaker():
    t = np.arange(int(0.09 * SR)) / SR
    return hp(rng.standard_normal(len(t)), 6500) * np.exp(-t * 55) * 0.25
def tom(f0=110):
    t = np.arange(int(0.8 * SR)) / SR
    f = f0 * (0.75 + 0.25 * np.exp(-t * 12))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5)

# ------------------------------------------------------------------ harmony
BPM = 80; BEAT = 60 / BPM; BAR = 4 * BEAT
CH = {  # (bass, pad voicing)
    "Bm": (47, [54, 59, 62, 66, 73]), "G": (43, [55, 59, 62, 67, 69]), "D": (50, [54, 57, 62, 66, 69]),
    "A": (45, [52, 57, 61, 64, 71]), "Em": (40, [55, 59, 62, 64, 71]), "Asus": (45, [52, 57, 62, 64, 69]),
}
PROG = ["Bm", "G", "D", "A"]

def section(t):
    for sid in ["s7", "s6", "s5", "s4", "s3", "s2", "s1"]:
        if t + 1.0 >= scenes[sid]["start"]: return sid
    return "s1"
INT = {"s1": 0.55, "s2": 0.7, "s3": 0.6, "s4": 0.85, "s5": 1.0, "s6": 0.72, "s7": 0.6}

music = np.zeros((2, N))
final_t = cuts["final"]
nbars = int(np.ceil((DUR + 2) / BAR))
for b in range(nbars):
    t = b * BAR
    if t > DUR: break
    sec = section(t)
    inten = INT[sec]
    final_chord = t + BAR > final_t - 0.2 and sec == "s7"
    name = "D" if final_chord else PROG[b % 4]
    if sec == "s7" and not final_chord and b % 4 == 3: name = "Asus"
    bass, voicing = CH[name]
    hold = (DUR - t + 2.5) if final_chord else BAR + 2.2
    # pad
    for j, m in enumerate(voicing):
        x = saw_pad(midi(m), hold, bright=0.8 + 0.5 * inten) * env_adsr(int(hold * SR), 1.1, 0.5, 0.85, 2.0)
        place(music, x, t, 0.05 * (0.7 + 0.5 * inten), pan=(j - 2) * 0.28)
    # strings in mountains / sunset / finale
    if sec in ("s3", "s5", "s7"):
        for j, m in enumerate([voicing[2] + 12, voicing[4] + 12]):
            x = strings(midi(m), hold) * env_adsr(int(hold * SR), 1.6, 0.4, 0.9, 2.2)
            place(music, x, t, 0.035 * inten, pan=-0.4 + j * 0.8)
    # bass
    if sec in ("s2", "s4", "s5", "s6") or final_chord:
        x = (np.sin(2 * np.pi * midi(bass - 12) * np.arange(int(hold * SR)) / SR) * 0.9 +
             np.sin(4 * np.pi * midi(bass - 12) * np.arange(int(hold * SR)) / SR) * 0.25) * env_adsr(int(hold * SR), 0.05, 0.4, 0.8, 1.2)
        place(music, x, t, 0.13 * inten)
    # piano arpeggio
    arp = [voicing[1], voicing[2] + 12, voicing[3], voicing[4] + 12, voicing[2], voicing[3] + 12, voicing[4], voicing[1] + 12]
    step = {"s1": 0.5, "s2": 0.5, "s3": 1.0, "s4": 0.5, "s5": 0.5, "s6": 0.5, "s7": 1.0}[sec]
    if final_chord:
        for k, m in enumerate([62, 66, 69, 74, 78]):
            place(music, piano(midi(m), 7, 0.7), t + k * 0.18, 0.16, pan=-0.3 + k * 0.15)
    else:
        for k in range(int(4 / step)):
            m = arp[k % len(arp)]
            place(music, piano(midi(m), 2.6, 0.55 + 0.25 * ((k % 2) == 0)), t + k * BEAT * step, 0.11 * (0.7 + 0.4 * inten), pan=0.25 * np.sin(k))
    # melody (sunset + finale)
    if sec == "s5":
        mel = {0: [(0, 78), (1.5, 76), (2, 74), (3, 76)], 1: [(0, 74), (2, 71)], 2: [(0, 73), (1, 74), (2, 76), (3, 78)], 3: [(0, 76), (2, 73)]}[b % 4]
        for at, m in mel: place(music, piano(midi(m), 3.5, 0.9), t + at * BEAT, 0.14, pan=0.1)
    # drums
    if sec in ("s2", "s4", "s5", "s6") and not final_chord:
        kpat = {"s2": [0, 2], "s4": [0, 1.5, 2, 3.5], "s5": [0, 1, 2, 3], "s6": [0, 2]}[sec]
        for k in kpat: place(music, kick(), t + k * BEAT, 0.3 * inten)
        if sec in ("s4", "s5"):
            for k in (1, 3): place(music, clap(), t + k * BEAT, 0.12 * inten, pan=0.05)
        if sec in ("s2", "s5", "s6"):
            for k in range(16): place(music, shaker(), t + k * BEAT / 4, (0.08 if k % 2 else 0.05) * inten, pan=0.35)
# tom build into the sunset
s5 = scenes["s5"]["start"]
for k, (dt, f) in enumerate([(-1.5, 150), (-1.125, 140), (-0.75, 120), (-0.5, 110), (-0.25, 95)]):
    place(music, tom(f), s5 + dt, 0.22, pan=-0.3 + k * 0.15)

# ---------- reverb ----------
def reverb(x, secs=3.4, mix=0.32):
    n = int(secs * SR); t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t * 6.9 / secs)
        ir = lp(ir, 5200) ; ir[: int(0.012 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = signal.oaconvolve(x[ch], ir)[: x.shape[1]]
    return x * (1 - mix) + out * mix * 1.6
music = reverb(music)

# ---------- ducking under the voiceover ----------
vo = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(ROOT / "assets/audio/voiceover.wav"), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                                  check=True, capture_output=True).stdout, dtype=np.float32)
vo_env = np.sqrt(np.abs(lp(np.pad(vo, (0, max(0, N - len(vo))))[:N] ** 2, 6)))
vo_env = np.clip(vo_env / (np.percentile(vo_env[vo_env > 1e-4], 90) + 1e-9), 0, 1)
# smooth: fast attack, slow release
sm = np.zeros_like(vo_env); a, r = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.5 * SR)); v = 0.0
step = 32
for i in range(0, N, step):
    x = vo_env[i]; v = a * v + (1 - a) * x if x > v else r * v + (1 - r) * x
    sm[i:i + step] = v
duck = 1 - 0.5 * np.clip(sm * 1.6, 0, 1)  # about -6 dB under speech
music *= duck

def finish(x, peak):
    end = int((DUR) * SR)
    x = x[:, :end]
    fade = int(0.04 * SR)
    x[:, :fade] *= np.linspace(0, 1, fade)
    x = np.tanh(x * 1.1) / 1.1
    return x / (np.max(np.abs(x)) + 1e-9) * peak

# ------------------------------------------------------------------ sound design
fx = np.zeros((2, N))
def noise(n): return rng.standard_normal(n)
def bed(kind, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    if kind == "city":
        rumble = lp(np.cumsum(noise(n)) * 0.02, 260) ; rumble -= np.mean(rumble)
        murmur = bp(noise(n), 300, 2600) * (0.55 + 0.45 * lp(np.abs(noise(n)), 4) * 3)
        x = rumble * 0.6 + murmur * 0.06
        for k in range(int(dur / 4)):  # passing cars
            at = rng.random() * dur; m = np.exp(-((t - at) ** 2) / (2 * 0.9 ** 2))
            x += bp(noise(n), 200, 1600) * m * 0.12
        return x
    if kind == "wind":
        sweep = 500 + 300 * np.sin(2 * np.pi * t / 7.3)
        x = np.zeros(n); blk = SR // 4
        for i in range(0, n, blk):
            f = sweep[i]; x[i:i + blk] = 1
        w = bp(noise(n), 250, 1400) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 5.1) * np.sin(2 * np.pi * t / 3.3))
        return w * 0.25
    if kind == "birds":
        x = np.zeros(n)
        for k in range(int(dur * 0.9)):
            at = rng.random() * (dur - 0.5); f0 = 2600 + rng.random() * 2400
            for j in range(rng.integers(2, 5)):
                cl = np.arange(int(0.09 * SR)) / SR
                ch = np.sin(2 * np.pi * (f0 + 900 * np.sin(np.pi * cl / 0.09)) * cl) * np.sin(np.pi * cl / 0.09) ** 2
                i = int((at + j * 0.13) * SR)
                if i + len(ch) < n: x[i:i + len(ch)] += ch * 0.05
        return x
    if kind == "crickets":
        car = np.sin(2 * np.pi * 4600 * t)
        am = (np.sin(2 * np.pi * 32 * t) > 0.2) * (np.sin(2 * np.pi * 0.9 * t + 1) > -0.1)
        return lp(car * am, 7000) * 0.02
    if kind == "water":
        return bp(noise(n), 400, 3800) * (0.7 + 0.3 * lp(noise(n), 8) * 4) * 0.05
    return np.zeros(n)

def lay(kind, start, end, gain, pan=0.0, fade=1.2):
    d = end - start
    x = bed(kind, d)
    e = np.ones(len(x)); f = int(fade * SR)
    e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
    for c, p in ((0, -0.3), (1, 0.3)):
        y = np.roll(x, int(SR * 0.013) * c)
        place_ch(fx, c, y * e, start, gain * (1 if c == 0 else 0.95))

S = lambda k: scenes[k]
lay("wind", 0, S("s1")["end"] + 0.5, 0.5); lay("city", 0.8, S("s1")["end"] + 0.5, 0.25)
lay("city", S("s2")["start"] - 0.5, S("s2")["end"] + 0.5, 0.8); lay("birds", S("s2")["start"] + 9, S("s2")["end"], 0.5)
lay("wind", S("s3")["start"] - 0.4, S("s3")["end"] + 0.5, 0.75); lay("birds", S("s3")["start"] + 4, S("s3")["end"], 0.9); lay("water", S("s3")["start"] + 10, S("s3")["end"] + 0.4, 0.6)
lay("wind", S("s4")["start"] - 0.4, S("s4")["end"] + 0.5, 0.6)
lay("city", S("s5")["start"] - 0.4, S("s5")["end"] + 0.5, 0.4); lay("wind", S("s5")["start"] - 0.4, S("s5")["start"] + 7, 0.4); lay("crickets", S("s5")["start"] + 6, S("s5")["end"] + 0.5, 0.8)
lay("city", S("s6")["start"] - 0.4, S("s6")["end"] + 0.5, 0.7); lay("birds", S("s6")["start"], S("s6")["start"] + 8, 0.8)
lay("wind", S("s7")["start"] - 0.4, DUR, 0.55); lay("city", S("s7")["start"], DUR - 1, 0.2)

def whoosh(dur=1.1, up=True):
    n = int(dur * SR); t = np.arange(n) / SR
    x = noise(n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        q = i / n; fc = 300 + 3200 * (q if up else 1 - q) ** 1.5
        out[i:i + blk] = bp(x[max(0, i - 2048):i + blk], fc * 0.7, min(fc * 1.4, 20000))[-len(out[i:i + blk]):]
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2.2
    return out * e
def impact():
    t = np.arange(int(2.5 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 40 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.4)
    return boom * 0.8 + lp(noise(len(t)), 900) * np.exp(-t * 7) * 0.3
def riser(dur=2.5):
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(noise(n), 1500, 7000) * (t / dur) ** 2.5 * 0.6 + np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / dur) ** 2) / SR) * (t / dur) ** 3 * 0.08
def shimmer():
    t = np.arange(int(3 * SR)) / SR
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 1.6) for f in (1760, 2217, 2637, 3520)) * 0.08

for c in cuts["sceneCuts"]:
    w = whoosh(1.3, up=True)
    for ch, d in ((0, 0), (1, 0.02)): place_ch(fx, ch, w, c - 0.75 + d, 0.55)
    place(fx, impact(), c - 0.02, 0.18)
for c in cuts["shotCuts"]:
    if any(abs(c - s) < 0.5 for s in cuts["sceneCuts"]): continue
    place(fx, whoosh(0.8, up=False), c - 0.4, 0.16, pan=0.3)
place(fx, impact(), 1.35, 0.35)          # title lands
place(fx, shimmer(), 1.5, 0.5)
place(fx, riser(2.2), cuts["final"] - 2.2, 0.35)
place(fx, impact(), cuts["final"] - 0.1, 0.4)
place(fx, shimmer(), cuts["final"], 0.6)

def write(name, x):
    pcm = (np.clip(x.T, -1, 1) * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", str(ROOT / "assets/audio" / name)], input=pcm, check=True)

music = finish(music, 0.5)
fx_out = finish(fx, 0.45)
# end-of-film fade on both beds
fl = int(3.0 * SR)
for x in (music, fx_out): x[:, -fl:] *= np.linspace(1, 0, fl) ** 1.5
write("music.wav", music)
write("fx.wav", fx_out)
print("music.wav + fx.wav written", round(DUR, 2), "s")
