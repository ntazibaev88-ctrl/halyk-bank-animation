"""Original cinematic score + sound design + final mix (all synthesized here: copyright-safe).

Reads src/timeline.json (built by build_timeline.py) and writes public/audio/master.wav:
  * dark documentary underscore (pads, sub pulse, tension ostinato) following scene moods
  * impacts on title cards, whooshes on cuts, rocket rumble under launch shots, risers
  * voiceover placed on the timeline, music side-chain ducked under the voice
  * loudness normalised to about -14 LUFS (social-media standard), true-peak safe
"""
import json, os, subprocess
import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
tl = json.load(open(os.path.join(ROOT, "src/timeline.json"), encoding="utf-8"))
T = tl["durationInFrames"] / tl["fps"]
N = int(T * SR) + SR
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def lp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "low")
    return signal.lfilter(b, a, x, axis=0)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x, axis=0)


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band")
    return signal.lfilter(b, a, x, axis=0)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def stereo(x, width=0.0):
    if x.ndim == 2:
        return x
    return np.stack([x, x], axis=1)


def add(buf, x, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i : i + len(x)] += x


# ---------------------------------------------------------------- music bed
music = np.zeros((N, 2))
scenes = tl["scenes"]

# chord per scene (MIDI notes), mood intensity 0..1
MOOD = {
    "hook": ([38, 45, 50, 53, 57], 0.9),          # Dm add9-ish, dark
    "childhood": ([41, 48, 53, 57, 60], 0.35),    # F, warmer/nostalgic
    "paypal": ([43, 50, 55, 58, 62], 0.5),        # Gm
    "spacex": ([34, 41, 46, 50, 53, 57], 1.0),    # Bb maj7 lift
    "tesla": ([36, 43, 48, 52, 55, 59], 0.75),    # C maj7 drive
    "ai": ([38, 45, 50, 53, 56, 60], 0.7),        # D m(b13) mysterious
    "controversy": ([37, 44, 49, 52, 56], 0.8),   # C# dim-ish tension
    "ending": ([34, 41, 46, 50, 53, 58, 62], 1.0),  # Bb add9 big
}


def pad_voice(freq, dur, seed):
    """Warm detuned additive pad note (stereo)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    out = np.zeros((n, 2))
    for k, det in enumerate([-0.11, 0.0, 0.09]):
        f = freq * 2 ** (det / 12)
        ph = r.uniform(0, 2 * np.pi)
        vib = 1 + 0.0015 * np.sin(2 * np.pi * (0.13 + 0.05 * k) * t + ph)
        x = np.zeros(n)
        for h in range(1, 7):
            x += np.sin(2 * np.pi * f * h * np.cumsum(vib) / SR + ph * h) / (h ** 1.6)
        pan = (k - 1) * 0.6
        out[:, 0] += x * (1 - pan) * 0.5
        out[:, 1] += x * (1 + pan) * 0.5
    return out


for idx, sc in enumerate(scenes):
    notes, inten = MOOD.get(sc["id"], MOOD["hook"])
    s0 = max(0.0, sc["start"] - 0.8)
    s1 = min(T, sc["end"] + 1.2)
    dur = s1 - s0
    n = int(dur * SR)
    seg = np.zeros((n, 2))
    for j, m in enumerate(notes):
        seg += pad_voice(midi(m), dur, idx * 31 + j) * (0.9 if m < 45 else 0.55)
    # slow filter swell
    seg = lp(seg, 900 + 1400 * inten)
    env = np.ones(n)
    a, r_ = int(1.2 * SR), int(1.6 * SR)
    env[:a] = np.linspace(0, 1, a) ** 1.5
    env[-r_:] *= np.linspace(1, 0, r_) ** 1.5
    seg *= env[:, None] * (0.05 + 0.03 * inten)
    add(music, seg, s0)

    # sub "heartbeat" pulse (cinematic documentary ticking)
    bpm = 72 if sc["id"] in ("hook", "controversy") else 84 if sc["id"] in ("spacex", "tesla", "ai", "ending") else 0
    if bpm and inten >= 0.6:
        beat = 60 / bpm
        tt = sc["start"] + 0.2
        root = midi(notes[0] - 12 if notes[0] > 30 else notes[0])
        k = 0
        while tt < sc["end"] - 0.3:
            ln = int(0.55 * SR)
            u = np.arange(ln) / SR
            f = root * (1 + 1.5 * np.exp(-u * 40))
            kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-u * 7.5)
            amp = 0.20 * inten * (1.0 if k % 2 == 0 else 0.62)
            add(music, stereo(kick * amp), tt)
            # ticking hats for tech / tension sections
            if sc["id"] in ("ai", "tesla", "controversy", "spacex"):
                for off in (0.5, 0.75) if sc["id"] == "ai" else (0.5,):
                    hl = int(0.06 * SR)
                    hat = hp(rng.standard_normal(hl), 7000) * np.exp(-np.arange(hl) / SR * 70) * 0.03
                    add(music, stereo(hat), tt + beat * off)
            tt += beat
            k += 1

    # ostinato arpeggio (soft pluck) in drive sections
    if sc["id"] in ("spacex", "tesla", "ai", "ending", "paypal"):
        step = 60 / 84 / 2
        pattern = [notes[2], notes[3], notes[4 if len(notes) > 4 else 3] + 12, notes[3]]
        tt = sc["start"] + 0.4
        k = 0
        while tt < sc["end"] - 0.4:
            f = midi(pattern[k % 4])
            ln = int(0.5 * SR)
            u = np.arange(ln) / SR
            pl = (np.sin(2 * np.pi * f * u) + 0.3 * np.sin(4 * np.pi * f * u)) * np.exp(-u * 6)
            pan = 0.35 * np.sin(k * 0.7)
            add(music, np.stack([pl * (1 - pan), pl * (1 + pan)], 1) * 0.022 * (0.6 + 0.5 * inten), tt)
            tt += step
            k += 1

# simple stereo "room" reverb: a few decaying taps
rev = np.zeros_like(music)
for d_ms, g in [(37, 0.35), (61, 0.3), (89, 0.25), (131, 0.2), (197, 0.15), (263, 0.1)]:
    d = int(d_ms / 1000 * SR)
    rev[d:, 0] += music[:-d, 1] * g
    rev[d:, 1] += music[:-d, 0] * g
music = music + lp(rev, 3000)

# ---------------------------------------------------------------- sound design
sfx = np.zeros((N, 2))


def impact(strength=1.0):
    ln = int(2.6 * SR)
    u = np.arange(ln) / SR
    f = 52 * (1 + 2.5 * np.exp(-u * 18))
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-u * 2.2)
    noise = lp(rng.standard_normal(ln), 900) * np.exp(-u * 9) * 0.6
    tail = lp(rng.standard_normal(ln), 300) * np.exp(-u * 1.6) * 0.25
    x = (boom * 0.9 + noise + tail) * strength
    return stereo(x)


def whoosh(dur=0.9, up=True, strength=1.0):
    ln = int(dur * SR)
    u = np.linspace(0, 1, ln)
    nz = rng.standard_normal((ln, 2))
    out = np.zeros((ln, 2))
    # swept band-pass via short overlapping blocks
    blocks = 24
    for b in range(blocks):
        a0, a1 = int(b * ln / blocks), int((b + 1) * ln / blocks)
        p = (b + 0.5) / blocks
        fc = 300 + (3500 if up else 2500) * (p if up else 1 - p) ** 1.5
        seg = bp(nz[a0:a1], max(80, fc * 0.6), min(16000, fc * 1.6))
        out[a0:a1] = seg
    env = np.sin(np.pi * u) ** 2 if not up else (u ** 2.5) * (1 - np.clip((u - 0.92) / 0.08, 0, 1))
    out *= env[:, None]
    pan = np.linspace(-0.6, 0.6, ln)
    out[:, 0] *= 1 - pan
    out[:, 1] *= 1 + pan
    return out * 0.22 * strength


def rumble(dur):
    ln = int(dur * SR)
    u = np.arange(ln) / SR
    brown = np.cumsum(rng.standard_normal((ln, 2)), axis=0)
    brown = hp(brown, 20)
    brown /= np.max(np.abs(brown)) + 1e-9
    crackle = bp(rng.standard_normal((ln, 2)), 150, 1200) * (0.4 + 0.6 * np.abs(np.sin(u * 23))[:, None])
    x = lp(brown, 160) * 1.6 + crackle * 0.08
    env = np.minimum(1, u / 0.7) * np.minimum(1, (dur - u) / 0.9)
    return x * env[:, None] * 0.55


def riser(dur):
    ln = int(dur * SR)
    u = np.arange(ln) / SR
    f = 110 * 2 ** (u / dur * 2.5)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.2
    nz = hp(rng.standard_normal(ln), 2000) * 0.3
    env = (u / dur) ** 2.2
    return stereo((tone + nz) * env * 0.12)


for e in tl["sfx"]:
    k = e["type"]
    if k == "impact":
        add(sfx, impact(e.get("gain", 1.0)) * 0.42, e["at"])
    elif k == "whoosh":
        d = e.get("dur", 0.8)
        add(sfx, whoosh(d, up=True, strength=e.get("gain", 1.0)), e["at"] - d * 0.85)
    elif k == "rumble":
        add(sfx, rumble(e["dur"]) * e.get("gain", 1.0), e["at"])
    elif k == "riser":
        add(sfx, riser(e["dur"]), e["at"])

# ---------------------------------------------------------------- voice
vo = np.zeros(N)
for v in tl["vo"]:
    sr, x = wavfile.read(os.path.join(ROOT, "public", v["file"]))
    x = x.astype(np.float64) / 32768.0
    if x.ndim == 2:
        x = x.mean(1)
    a, b = int(v["trimStart"] * sr), int(v["trimEnd"] * sr)
    x = x[a:b]
    fade = int(0.02 * SR)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    add(vo, x, v["start"])

# voice polish: gentle high-pass, presence lift, light compression
vo = hp(vo, 70)
pres = bp(vo, 2500, 6000) * 0.25
low_body = bp(vo, 110, 250) * 0.18
vo = vo + pres + low_body
env = np.abs(signal.hilbert(lp(np.abs(vo), 30, 1))) if False else lp(np.abs(vo), 12, 1)
thr = 0.12
gain = np.where(env > thr, (thr + (env - thr) / 3) / np.maximum(env, 1e-9), 1.0)
vo = vo * gain
vo = vo / (np.max(np.abs(vo)) + 1e-9) * 0.9

# side-chain duck music under voice
venv = lp(np.abs(vo), 4, 1)
venv = venv / (venv.max() + 1e-9)
duck = 1.0 - 0.62 * np.clip(venv * 6, 0, 1)
duck = lp(duck, 3, 1)

music_n = music / (np.max(np.abs(music)) + 1e-9)
sfx_n = sfx / (np.max(np.abs(sfx)) + 1e-9)
mix = music_n * 0.30 * duck[:, None] + sfx_n * 0.42 * (0.55 + 0.45 * duck[:, None]) + stereo(vo) * 0.82

# master fades
fi, fo = int(0.05 * SR), int(1.5 * SR)
mix[:fi] *= np.linspace(0, 1, fi)[:, None]
endi = int(T * SR)
mix[endi - fo : endi] *= np.linspace(1, 0, fo)[:, None]
mix = mix[:endi]

os.makedirs(os.path.join(ROOT, "public/audio"), exist_ok=True)
raw = os.path.join(ROOT, "public/audio/_premaster.wav")
wavfile.write(raw, SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
# also export stems for review
for name, x in (("music", music_n * 0.3), ("sfx", sfx_n * 0.4)):
    wavfile.write(os.path.join(ROOT, f"public/audio/stem_{name}.wav"), SR, (np.clip(x[:endi], -1, 1) * 32767).astype(np.int16))

out = os.path.join(ROOT, "public/audio/master.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", out], check=True)
os.remove(raw)
print("wrote", out, f"{T:.2f}s")
