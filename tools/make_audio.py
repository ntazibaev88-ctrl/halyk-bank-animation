"""Build the full 90 s soundtrack: original synthesized score + sound effects + processed narration.

Usage: python3 tools/make_audio.py <repo_root>
Reads   voiceover/scene_*.wav, project/data/vo.js
Writes  project/audio/soundtrack_premaster.wav (48 kHz stereo); loudness is finished with ffmpeg loudnorm.
Everything is generated here: no stock music or samples.
"""
import json, sys
import numpy as np
from scipy import signal
import soundfile as sf

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
SR = 48000
DUR = 90.0
N = int(SR * DUR)
rng = np.random.default_rng(2026)

VO = json.loads(open(f"{ROOT}/project/data/vo.js").read().split("=", 1)[1].strip().rstrip(";"))["scenes"]


def W(scene, prefix, n=0):
    ws = [w for w in VO[scene - 1]["words"] if "".join(ch for ch in w["w"] if ch.isalnum() or ch == "-").lower().startswith(prefix.lower())]
    return ws[n]["s"]


def tvec(n):
    return np.arange(n) / SR


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "low")
    return signal.lfilter(b, a, x, axis=0)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x, axis=0)


def bp(x, f1, f2, order=2):
    b, a = signal.butter(order, [f1 / (SR / 2), f2 / (SR / 2)], "band")
    return signal.lfilter(b, a, x, axis=0)


def peaking(x, f0, gain_db, q=1.0):
    A = 10 ** (gain_db / 40); w0 = 2 * np.pi * f0 / SR; al = np.sin(w0) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w0), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w0), 1 - al / A]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


def lowshelf(x, f0, gain_db):
    A = 10 ** (gain_db / 40); w0 = 2 * np.pi * f0 / SR; al = np.sin(w0) / 2 * np.sqrt(2)
    c = np.cos(w0); s = 2 * np.sqrt(A) * al
    b = [A * ((A + 1) - (A - 1) * c + s), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - s)]
    a = [(A + 1) + (A - 1) * c + s, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - s]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


def saw(f, n, detune=0.0):
    f = f * (2 ** (detune / 1200))
    dt = f / SR
    ph = (rng.random() + np.cumsum(np.full(n, dt))) % 1.0
    y = 2 * ph - 1
    m = ph < dt; x = ph[m] / dt; y[m] -= x + x - x * x - 1
    m = ph > 1 - dt; x = (ph[m] - 1) / dt; y[m] -= x * x + x + x + 1
    return y


def env_adsr(n, a, r, sustain=1.0):
    e = np.full(n, sustain)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, sustain, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def add(buf, t, sig, gain=1.0, pan=0.0):
    """Mix a mono or stereo signal into a stereo buffer at time t (s)."""
    i = int(round(t * SR))
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    if i < 0:
        sig = sig[-i:]; i = 0
    j = min(N, i + len(sig))
    if j > i:
        buf[i:j] += sig[: j - i] * gain


def reverb_ir(seconds=2.4, decay=0.55, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR); t = tvec(n)
    ir = r.standard_normal((n, 2)) * np.exp(-t / decay)[:, None]
    ir = lp(ir, 6000)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    return ir / np.sqrt((ir ** 2).sum(0)).max()


def convolve(x, ir):
    out = np.zeros_like(x)
    for c in range(2):
        out[:, c] = signal.fftconvolve(x[:, c], ir[:, c])[: len(x)]
    return out


# ------------------------------------------------------------------ score
BEAT = 60 / 96            # 96 BPM
BAR = BEAT * 4            # 2.5 s
CH = {  # (bass midi, chord midi)
    "Am": (45, [57, 60, 64, 69]), "F": (41, [57, 60, 65, 69]), "C": (48, [55, 60, 64, 67]),
    "G": (43, [55, 59, 62, 67]), "Em": (40, [55, 59, 64, 67]), "Dm": (38, [57, 62, 65, 69]),
}
prog = []
main = ["Am", "F", "C", "G"]
for i in range(int(78.0 // BAR) + 1):          # bars of the main loop up to 78 s
    if i * BAR < 78.0 - 1e-6:
        prog.append((i * BAR, main[i % 4]))
# emotional ending from 78 s: F G Am Em F G, then C on the final title hit
for i, c in enumerate(["F", "G", "Am", "Em", "F", "G"]):
    prog.append((78.0 + i * (86.25 - 78.0) / 6, c))
prog = [(round(a, 4), c) for a, c in prog]
prog.append((86.25, "C"))


def section(t):
    if t < 3.28: return "intro"
    if t < 8: return "hook"
    if t < 34: return "finance"
    if t < 48: return "tech"
    if t < 64: return "service"
    if t < 78: return "score"
    if t < 86.25: return "emotion"
    return "final"


music = np.zeros((N, 2))
pad = np.zeros((N, 2))
for k, (t0, name) in enumerate(prog):
    t1 = prog[k + 1][0] if k + 1 < len(prog) else DUR
    bass, notes = CH[name]
    seg = t1 - t0 + 0.9
    n = int(seg * SR)
    sec = section(t0)
    if sec == "final":
        notes = notes + [72, 76]          # open up the final chord
    y = np.zeros((n, 2))
    for j, m in enumerate(notes):
        f = mtof(m)
        for d, pan in ((-7, -0.6), (6, 0.6)):
            v = saw(f, n, d + (j - 1.5))
            y[:, 0] += v * (0.5 - pan * 0.4); y[:, 1] += v * (0.5 + pan * 0.4)
    cutoff = {"intro": 500, "hook": 900, "finance": 1100, "tech": 1900, "service": 1300, "score": 1500, "emotion": 1600, "final": 2600}[sec]
    y = lp(y, cutoff, 2)
    att = 1.4 if sec in ("emotion", "final") else 0.35
    e = env_adsr(n, att, 0.9)
    add(pad, t0, y * e[:, None], 0.05)
    # sub bass
    if sec != "intro":
        bn = int((t1 - t0 + 0.3) * SR)
        bt = tvec(bn)
        b = np.sin(2 * np.pi * mtof(bass) * bt) + 0.25 * np.sin(2 * np.pi * mtof(bass + 12) * bt)
        if sec in ("finance", "tech", "service", "score"):
            pulse = np.exp(-((bt % BEAT) / 0.22))      # pulsing on each beat
            b *= 0.35 + 0.65 * pulse
        b = np.tanh(b * 1.4) * env_adsr(bn, 0.03, 0.3)
        add(music, t0, b, 0.11)

# intro drone + hook pad lift
n = int(3.4 * SR); tt = tvec(n)
drone = (saw(mtof(33), n) + saw(mtof(40), n, 5)) * np.linspace(0, 1, n) ** 1.5
add(music, 0.0, lp(drone, 300), 0.09)
music += pad

# pluck arpeggios
ARP = {"finance": (2, 0.16, 0.05), "tech": (4, 0.11, 0.06), "service": (2, 0.2, 0.05), "score": (2, 0.14, 0.055), "emotion": (1, 0.45, 0.05), "hook": (2, 0.14, 0.035)}
arp = np.zeros((N, 2))
step_i = 0
for k, (t0, name) in enumerate(prog):
    t1 = prog[k + 1][0] if k + 1 < len(prog) else DUR
    sec = section(t0)
    if sec not in ARP: continue
    div, tau, g = ARP[sec]
    step = BEAT / div
    notes = [m + 12 for m in CH[name][1]]
    pattern = [0, 2, 1, 3, 2, 1, 3, 2] if sec != "emotion" else [0, 1, 2, 3]
    tt0 = max(t0, 3.3) if sec == "hook" else t0
    s = np.ceil(tt0 / step) * step
    while s < t1 - 1e-6:
        m = notes[pattern[step_i % len(pattern)]] + (12 if (sec == "tech" and step_i % 8 == 7) else 0)
        f = mtof(m); nn = int(tau * 6 * SR); x = tvec(nn)
        if sec == "tech":
            v = np.sin(2 * np.pi * f * x) + 0.33 * np.sin(2 * np.pi * 3 * f * x) + 0.2 * np.sin(2 * np.pi * 5 * f * x)
        else:
            v = np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x / (tau * 0.4))
        v *= np.exp(-x / tau) * np.minimum(1, x / 0.004)
        add(arp, s, v, g, pan=0.35 * np.sin(step_i * 1.3))
        s += step; step_i += 1
# ping-pong echo on the arp
d = int(BEAT * 0.75 * SR)
echo = np.zeros_like(arp); echo[d:, 0] = arp[:-d, 1] * 0.35; echo[2 * d:, 1] = arp[:-2 * d, 0] * 0.25
music += arp + echo

# drums
drums = np.zeros((N, 2))
kn = int(0.35 * SR); kx = tvec(kn)
kick = np.sin(2 * np.pi * np.cumsum(45 + 75 * np.exp(-kx / 0.035)) / SR) * np.exp(-kx / 0.11)
kick = np.tanh(kick * 1.5)
hn = int(0.05 * SR)
for bi in range(int(DUR / BEAT) + 1):
    t0 = bi * BEAT
    sec = section(t0)
    if sec in ("finance", "tech", "service", "score") and not (20.6 < t0 < 21.2 or 47.6 < t0 < 48.3):
        if bi % 2 == 0 or sec == "tech":
            add(drums, t0, kick, 0.20 if sec != "tech" else 0.17)
        hat = hp(rng.standard_normal(hn), 7000) * np.exp(-tvec(hn) / 0.012)
        add(drums, t0 + BEAT / 2, hat, 0.06, pan=0.3)
        if sec == "tech":
            add(drums, t0 + BEAT / 4, hat, 0.035, pan=-0.3); add(drums, t0 + 3 * BEAT / 4, hat, 0.035, pan=-0.3)
        if sec == "score" and bi % 2 == 1:
            cn = int(0.18 * SR)
            clap = bp(rng.standard_normal(cn), 900, 3500) * np.exp(-tvec(cn) / 0.05)
            add(drums, t0, clap, 0.10)
music += drums

# master fade at the very end + room
music = music * 1.0
ir = reverb_ir(2.6, 0.6)
music = music * 0.82 + convolve(music, ir) * 0.28
fade = np.ones(N); fn = int(1.2 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 1.5
music *= fade[:, None]

# ------------------------------------------------------------------ sound effects
sfx = np.zeros((N, 2))


def boom(length=2.6, f0=62, f1=28):
    n = int(length * SR); x = tvec(n)
    f = f1 + (f0 - f1) * np.exp(-x / 0.25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.7)
    nz = lp(rng.standard_normal(n), 900) * np.exp(-x / 0.08) * 0.8
    return np.tanh((s + nz) * 1.6)


def whoosh(length=0.6, lo=500, hi=4500, peak=0.6):
    n = int(length * SR); x = np.linspace(0, 1, n)
    e = np.where(x < peak, (x / peak) ** 2, ((1 - x) / (1 - peak)) ** 1.5)
    nz = rng.standard_normal(n)
    # crossfade between a low band and a high band to fake a sweep
    a, b = bp(nz, lo, lo * 3), bp(nz, hi / 3, hi)
    y = (a * (1 - x) + b * x) * e
    return np.stack([y * (1 - 0.6 * x), y * (0.4 + 0.6 * x)], 1)


def riser(length=1.3, f0=180, f1=1400):
    n = int(length * SR); x = np.linspace(0, 1, n)
    f = f0 * (f1 / f0) ** x
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + hp(rng.standard_normal(n), 2500) * 0.6
    return s * x ** 2.2


def clink(f=2300):
    n = int(0.5 * SR); x = tvec(n)
    parts = [(1.0, 1.0, 0.12), (2.76, 0.6, 0.08), (5.4, 0.35, 0.05), (8.93, 0.2, 0.03)]
    y = sum(a * np.sin(2 * np.pi * f * m * x) * np.exp(-x / d) for m, a, d in parts)
    return y * np.minimum(1, x / 0.001)


def pop(f=700, f2=1300, length=0.12):
    n = int(length * SR); x = tvec(n)
    fr = f + (f2 - f) * (x / length)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-x / (length / 3)) * np.minimum(1, x / 0.002)


def blip(f=1500, length=0.07):
    n = int(length * SR); x = tvec(n)
    y = np.sign(np.sin(2 * np.pi * f * x)) * 0.5 + np.sin(2 * np.pi * f * 1.5 * x) * 0.5
    return lp(y * np.exp(-x / 0.025), 6000)


def thud(length=0.35):
    n = int(length * SR); x = tvec(n)
    s = np.sin(2 * np.pi * np.cumsum(95 * np.exp(-x / 0.08) + 40) / SR) * np.exp(-x / 0.09)
    c = hp(rng.standard_normal(n), 1500) * np.exp(-x / 0.008) * 0.6
    return np.tanh((s + c) * 2)


def click(length=0.03):
    n = int(length * SR)
    return hp(rng.standard_normal(n), 2500) * np.exp(-tvec(n) / 0.004)


def shimmer(length=1.6, base=2093):
    y = np.zeros(int(length * SR))
    for i, m in enumerate([0, 4, 7, 12, 16, 19]):
        n = len(y) - int(i * 0.07 * SR); x = tvec(n)
        y[int(i * 0.07 * SR):] += np.sin(2 * np.pi * base * 2 ** (m / 12) * x) * np.exp(-x / 0.4) * 0.3
    return y


def step():
    n = int(0.09 * SR); x = tvec(n)
    return lp(rng.standard_normal(n), 900) * np.exp(-x / 0.02)


# scene 1
add(sfx, 0.12, boom(2.8, 55, 26), 0.32)
add(sfx, 0.42, boom(2.2, 60, 30), 0.18)
add(sfx, 1.5, whoosh(0.75, 400, 5000, 0.7), 0.30, )
add(sfx, 1.9, whoosh(0.75, 400, 5000, 0.7)[:, ::-1], 0.30)
add(sfx, 1.95, riser(1.33), 0.16)
add(sfx, 3.28, boom(3.2, 70, 28), 0.55)
add(sfx, 3.28, hp(rng.standard_normal(int(0.4 * SR)), 1200) * np.exp(-tvec(int(0.4 * SR)) / 0.06), 0.18)
add(sfx, 5.0, pop(500, 900, 0.18), 0.12)
add(sfx, W(1, "kaspi"), shimmer(1.0, 1760), 0.10, pan=-0.5)
add(sfx, W(1, "halyk"), shimmer(1.0, 2093), 0.10, pan=0.5)
# transitions (doors close on the cut)
for B in [8, 21, 34, 48, 64, 78]:
    add(sfx, B - 0.42, whoosh(0.5, 300, 4000, 0.82), 0.28)
    add(sfx, B, thud(0.3), 0.16)
    add(sfx, B + 0.04, whoosh(0.45, 2500, 6000, 0.2)[:, ::-1], 0.10)
# scene 2 — vaults and coins
for k in range(18):
    add(sfx, 8.9 + k * 0.06, click(0.025), 0.10, pan=-0.3 if k % 2 else 0.3)
add(sfx, 10.0, thud(0.5), 0.30); add(sfx, 10.05, clink(420) * 0.6, 0.18)
add(sfx, 10.35, shimmer(1.8, 1568), 0.10)
r2 = np.random.default_rng(7)
for k in range(22):
    add(sfx, 10.6 + r2.random() * 9.6, clink(2000 + r2.random() * 1600), 0.045, pan=r2.uniform(-0.8, 0.8))
tA = W(2, "активы") - 0.25; tE = W(2, "капитал") - 0.45
for t0 in (tA + 0.25, tE + 0.25):
    for k in range(12):
        add(sfx, t0 + k * 0.12, blip(1800 + k * 40, 0.04), 0.025)
add(sfx, W(2, "удивить") - 0.15, pop(600, 1400, 0.2), 0.16)
add(sfx, W(2, "удивить") - 0.12, shimmer(1.2, 2349), 0.10)
# scene 3 — factories and chart
for k in range(16):
    add(sfx, 21.5 + k * 0.25, click(0.02), 0.05, pan=-0.6 if k % 2 else 0.6)
for i in range(3):
    add(sfx, 25.7 + i * 0.6, pop(400 + i * 120, 800 + i * 160, 0.14), 0.12)
    add(sfx, 25.82 + i * 0.6, pop(460 + i * 120, 900 + i * 160, 0.14), 0.10)
add(sfx, 27.8, pop(800, 1600, 0.16), 0.12)
tG = W(3, "зарабатывает") - 0.2
add(sfx, tG, pop(700, 1100), 0.10); add(sfx, tG + 0.3, pop(760, 1200), 0.10)
tR = W(3, "расходов") - 0.1
add(sfx, tR, whoosh(0.4, 600, 4000), 0.12); add(sfx, tR + 0.25, whoosh(0.4, 600, 4000)[:, ::-1], 0.12)
for k in range(10):
    add(sfx, tR + 0.2 + k * 0.13, clink(2600 + k * 60), 0.025)
# scene 4 — tech
for k in range(10):
    add(sfx, 35.1 + k * 0.17, blip(1200 + (k % 4) * 300, 0.06), 0.06, pan=0.4 * np.sin(k))
for w in ["технологии", "приложения", "безопасность", "развитие"]:
    add(sfx, W(4, w) - 0.05, pop(900, 1800, 0.14), 0.12); add(sfx, W(4, w), blip(2400, 0.05), 0.05)
add(sfx, 36.6, whoosh(0.35, 800, 5000), 0.10)
tT = W(4, "но") - 0.15
add(sfx, tT, whoosh(0.6, 300, 3000, 0.5), 0.12)
for i in range(3):
    add(sfx, tT + 0.2 + i * 1.0, whoosh(0.35, 600, 3500), 0.10)
    add(sfx, tT + 0.85 + i * 1.0, thud(0.3), 0.15)
# scene 5 — services
for k in range(8):
    add(sfx, 48.4 + k * 0.3 + 0.12, step(), 0.10, pan=-0.2 if k % 2 else 0.2)
for k in range(8):
    add(sfx, 48.6 + k * 0.1 + 0.15, pop(600 + k * 50, 1000 + k * 60, 0.1), 0.06)
for k in range(5):
    add(sfx, 49.8 + k * 1.35 + 0.8, clink(2400), 0.04, pan=-0.6)
    add(sfx, 50.0 + k * 1.05 + 0.7, clink(2700), 0.035, pan=0.6)
tGrid = 56.45
add(sfx, tGrid, whoosh(0.55, 300, 3000, 0.5), 0.12)
for i in range(7):
    t0 = tGrid + 0.5 + i * 0.72
    add(sfx, t0 + 0.32, pop(880, 1320, 0.1), 0.09, pan=-0.3)
    add(sfx, t0 + 0.5, pop(990, 1480, 0.1), 0.09, pan=0.3)
# scene 6 — stamps
for i in range(6):
    t0 = 65.7 + i * 1.25 + 0.28
    add(sfx, t0, thud(0.4), 0.30); add(sfx, t0, click(0.04), 0.12)
add(sfx, 73.4, whoosh(0.5, 400, 4000), 0.12)
add(sfx, 73.7, pop(500, 1000, 0.16), 0.13); add(sfx, 73.95, pop(500, 1000, 0.16), 0.13)
add(sfx, 74.3, shimmer(1.6, 1760), 0.09)
# scene 7 — verdict
tTurn = W(7, "так") + 0.45
add(sfx, tTurn, whoosh(0.3, 1500, 6000, 0.5), 0.08)
add(sfx, W(7, "финансовая") - 0.1, pop(600, 1000, 0.15), 0.10)
add(sfx, W(7, "удобство") - 0.1, pop(700, 1150, 0.15), 0.10)
tF = 86.25
add(sfx, tF - 1.5, riser(1.5, 150, 1800), 0.18)
add(sfx, tF, boom(3.6, 72, 26), 0.55)
add(sfx, tF + 0.02, shimmer(2.5, 1568), 0.16)
for k in range(14):
    add(sfx, tF + 0.1 + k * 0.11, clink(2600 + (k % 5) * 300), 0.03, pan=np.sin(k))
add(sfx, 87.2, pop(500, 1200, 0.2), 0.15)
sfx = sfx + convolve(sfx, reverb_ir(1.8, 0.4, 3)) * 0.22

# ------------------------------------------------------------------ narration
voice = np.zeros((N, 2))
vmono = np.zeros(N)
for sc in VO:
    x, sr = sf.read(f"{ROOT}/voiceover/scene_{sc['id']}.wav")
    x = signal.resample_poly(x, 320, 147)                 # 22050 -> 48000
    x = hp(x, 70, 2)
    x = lowshelf(x, 170, 2.5)                              # warmth
    x = peaking(x, 320, -1.5, 1.2)                         # less boxiness
    x = peaking(x, 3200, 2.0, 0.9)                         # articulation
    # gentle compressor
    envl = np.sqrt(signal.lfilter([0.002], [1, -0.998], x ** 2) + 1e-9)
    thr = 10 ** (-20 / 20)
    g = np.where(envl > thr, (envl / thr) ** (1 / 3 - 1), 1.0)
    x = x * g
    x = x / np.max(np.abs(x)) * 0.7
    i = int(round(sc["vo"] * SR))
    vmono[i:i + len(x)] += x[: N - i]
voice = np.stack([vmono, vmono], 1)
voice = voice * 0.92 + convolve(voice, reverb_ir(0.9, 0.18, 5)) * 0.10   # small room

# ducking: music dips under the voice
venv = np.abs(vmono)
a_att, a_rel = np.exp(-1 / (0.03 * SR)), np.exp(-1 / (0.45 * SR))
sm = np.zeros(N); acc = 0.0
# fast peak follower (vectorised in chunks is overkill; plain loop over a decimated signal)
dec = 48
vd = venv[: N // dec * dec].reshape(-1, dec).max(1)
out = np.zeros_like(vd); acc = 0.0
aa, ar = np.exp(-dec / (0.03 * SR)), np.exp(-dec / (0.45 * SR))
for k, v in enumerate(vd):
    acc = aa * acc + (1 - aa) * v if v > acc else ar * acc + (1 - ar) * v
    out[k] = acc
duck = np.repeat(np.clip(out / 0.25, 0, 1), dec)
duck = np.concatenate([duck, np.zeros(N - len(duck))])
music_gain = 1 - 0.7 * duck            # about -10 dB under speech
sfx_gain = 1 - 0.45 * duck

MUSIC_BUS, SFX_BUS = 0.42, 0.55
mix = voice * 1.0 + music * music_gain[:, None] * MUSIC_BUS + sfx * sfx_gain[:, None] * SFX_BUS
mix = hp(mix, 25, 2)
peak = np.max(np.abs(mix))
mix = mix / peak * 0.89
sf.write(f"{ROOT}/project/audio/soundtrack_premaster.wav", mix.astype(np.float32), SR, subtype="FLOAT")
for name, s in [("voice", voice), ("music", music * music_gain[:, None] * MUSIC_BUS), ("sfx", sfx * sfx_gain[:, None] * SFX_BUS)]:
    sf.write(f"{ROOT}/project/audio/stem_{name}.wav", (s / peak * 0.89).astype(np.float32), SR, subtype="FLOAT")
print("premaster written, peak normaliser", round(float(peak), 3))
