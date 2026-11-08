"""Procedural score: ambient pads + arpeggio + soft pulse, whoosh on every scene cut. Writes build/music.wav."""
import json, os, subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
tl = json.load(open('build/timeline.json'))
SR, T = 48000, tl['total']
N = int(SR * T)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, start, gain=1.0, pan=0.0):
    a = int(start * SR); off = max(0, -a); a = max(a, 0); b = min(a + len(sig) - off, N)
    if b <= a: return
    s = sig[off:off + b - a] * gain
    L[a:b] += s * np.sqrt((1 - pan) / 2) * 1.41; R[a:b] += s * np.sqrt((1 + pan) / 2) * 1.41
def env(n, att, rel):
    e = np.ones(n); a = int(att * SR); r = int(rel * SR)
    e[:a] = np.linspace(0, 1, a) ** 2; e[n - r:] *= np.linspace(1, 0, r) ** 2; return e
BPM = 96; beat = 60 / BPM; bar = 4 * beat
# chord roots/voicings (Dm  Bb  F  C) then brighter (Bb  F  C  Dm->D sus) — 2 bars each
prog = [[50, 62, 65, 69], [46, 58, 62, 65], [53, 60, 65, 69], [48, 60, 64, 67]]
chord_len = 2 * bar
n_chords = int(np.ceil(T / chord_len)) + 1

def section_level(t):
    """energy curve driven by scenes: intro soft, build through history, peak on population/LRT, resolve."""
    pts = [(0, .6), (7, .55), (18, .7), (40, .8), (53, .85), (67, .9), (82, 1.0), (99, .85), (107, .6), (110, .4)]
    pts = [(x * T / 110, y) for x, y in pts]
    xs, ys = zip(*pts); return np.interp(t, xs, ys)

# Pads
for k in range(n_chords):
    st = k * chord_len; notes = prog[k % 4]
    n = int((chord_len + 1.5) * SR); tt = np.arange(n) / SR
    sig = np.zeros(n)
    for m in notes:
        for det in (-0.07, 0.0, 0.07):
            f = midi(m + det)
            for h, amp in ((1, 1), (2, .35), (3, .15), (4, .07)):
                sig += amp * np.sin(2 * np.pi * f * h * tt + rng.uniform(0, 6.28))
    sig *= env(n, 1.2, 1.6) * 0.012 * (0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * tt))
    add(sig, st - 0.3, section_level(st), pan=rng.uniform(-.3, .3))

# Arpeggio (8ths) from 11 s
pluck_cache = {}
def pluck(m, dur=0.6):
    if m in pluck_cache: return pluck_cache[m]
    n = int(dur * SR); tt = np.arange(n) / SR; f = midi(m)
    s = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt) + .12 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 7)
    s[:120] *= np.linspace(0, 1, 120); pluck_cache[m] = s; return s
pattern = [0, 1, 2, 3, 2, 1, 2, 3]
t0 = 7.0
k = 0
while t0 + k * beat / 2 < T - 3:
    t = t0 + k * beat / 2
    notes = prog[int(t // chord_len) % 4]
    m = notes[pattern[k % 8]] + 12
    add(pluck(m), t, 0.05 * section_level(t), pan=0.35 if k % 2 else -0.35)
    k += 1

# Sub bass + soft kick from 19.8 s
def kick():
    n = int(0.35 * SR); tt = np.arange(n) / SR
    f = 42 + 60 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
K = kick()
t = 7.0
while t < T - 4:
    lvl = section_level(t)
    add(K, t, 0.22 * lvl)
    if t > 40: add(K, t + 2 * beat, 0.16 * lvl)
    t += bar
for k in range(n_chords):
    st = k * chord_len
    if st < 7.0 or st > T - 3: continue
    n = int(chord_len * SR); tt = np.arange(n) / SR
    root = midi(prog[k % 4][0] - 12)
    add(np.sin(2 * np.pi * root * tt) * env(n, .3, .6) * 0.05, st, section_level(st))

# Soft shaker (hi-hat-ish noise) in the busy part
hat = rng.standard_normal(int(0.06 * SR)) * np.exp(-np.arange(int(0.06 * SR)) / SR * 70)
hat = np.diff(hat, prepend=0)
t = 40.2
while t < T - 5:
    add(hat, t + beat / 2, 0.02 * section_level(t), pan=0.4); t += beat

# Whooshes on scene cuts + impact on title & end card
def whoosh(d=1.1):
    n = int(d * SR); x = rng.standard_normal(n)
    x = np.diff(np.diff(x, prepend=0), prepend=0)
    x = np.convolve(x, np.ones(6) / 6, 'same')
    e = np.sin(np.linspace(0, np.pi, n)) ** 3
    return x * e
for sc in tl['scenes'][1:]:
    add(whoosh(), sc['start'] - 0.6, 0.05, pan=rng.uniform(-.6, .6))
def boom():
    n = int(3 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * (38 + 30 * np.exp(-tt * 6)) * tt) * np.exp(-tt * 1.6) + 0.15 * rng.standard_normal(n) * np.exp(-tt * 8))
add(boom(), 0.05, 0.35); add(boom(), tl['scenes'][-1]['speechEnd'] + 0.2, 0.3)

# Simple stereo reverb (FFT convolution with decaying noise)
irn = int(2.2 * SR); ir_t = np.arange(irn) / SR
for ch, seed in ((L, 1), (R, 2)):
    ir = np.random.default_rng(seed).standard_normal(irn) * np.exp(-ir_t * 3.0); ir[0] = 0
    ir /= np.sqrt((ir ** 2).sum()) * 4
    nfft = 1 << int(np.ceil(np.log2(N + irn)))
    wet = np.fft.irfft(np.fft.rfft(ch, nfft) * np.fft.rfft(ir, nfft), nfft)[:N]
    ch += wet

# Global fade in/out
fade = np.ones(N); fade[:int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR)); fade[-int(2.5 * SR):] *= np.linspace(1, 0, int(2.5 * SR))
st = np.stack([L * fade, R * fade], 1)
st /= np.abs(st).max() * 1.12
st.astype(np.float32).tofile('build/music.f32')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'build/music.f32', 'build/music.wav'], check=True)
os.remove('build/music.f32')
print('music ok')
