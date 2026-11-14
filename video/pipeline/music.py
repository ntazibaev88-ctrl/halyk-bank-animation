"""Original procedural score for "Kazakhstan - 35 years of independence".

Everything is synthesized here (no samples), so the music is fully copyright-free.
Instruments: string ensemble (additive, chorused), low cello drone, Karplus-like
dombra plucks (additive pluck model), soft piano, formant choir, timpani/taiko,
risers and steppe wind. Sections follow the scene boundaries in timeline.json.
"""
import json
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import soundfile as sf

SR = 44100
rng = np.random.default_rng(35)
TL = json.load(open('timeline.json'))
SC = {s['scene']: s for s in TL['scenes']}
TOTAL = TL['total'] + 3.0
N = int(TOTAL * SR)
L = np.zeros(N); R = np.zeros(N)
BEAT = 60 / 80.0


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def m(name):  # 'D3', 'Bb2', 'F#4'
    n = NOTE[name[0]]; i = 1
    if name[i] == 'b': n -= 1; i += 1
    elif name[i] == '#': n += 1; i += 1
    return 12 * (int(name[i:]) + 1) + n


def add(sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N: return
    if i0 < 0:
        sig = sig[-i0:]; i0 = 0
    n = min(len(sig), N - i0)
    gl = gain * np.cos((pan + 1) * np.pi / 4); gr = gain * np.sin((pan + 1) * np.pi / 4)
    L[i0:i0 + n] += sig[:n] * gl; R[i0:i0 + n] += sig[:n] * gr


def env_adsr(n, a, r, sustain_shape=None):
    e = np.ones(n)
    na = min(n, int(a * SR)); nr = min(n - na, int(r * SR))
    if na: e[:na] = np.sin(np.linspace(0, np.pi / 2, na)) ** 2
    if nr: e[n - nr:] *= np.cos(np.linspace(0, np.pi / 2, nr)) ** 2
    return e


def string_note(freq, dur, bright=10.0, attack=0.7, release=1.4, vib=0.0035):
    n = int((dur + release) * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    vibr = 1 + vib * np.sin(2 * np.pi * (4.6 + rng.random()) * t + rng.random() * 6)
    for det in (-0.0045, 0.0, 0.0052):
        f = freq * (1 + det)
        phase = 2 * np.pi * np.cumsum(f * vibr) / SR
        K = int(min(5000 / f, 40))
        for k in range(1, K + 1):
            out += np.sin(k * phase + rng.random() * 6.28) * (1.0 / k) * np.exp(-k / bright)
    out /= 3
    return out * env_adsr(n, attack, release)


def pluck(freq, dur=2.2, bright=1.0, pos=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    K = int(min(7000 / freq, 30))
    for k in range(1, K + 1):
        amp = abs(np.sin(k * np.pi * pos)) / k ** 1.05 * bright ** (k / 8)
        decay = 1.6 + 0.9 * k
        inharm = 1 + 0.0004 * k * k
        out += amp * np.sin(2 * np.pi * freq * k * inharm * t) * np.exp(-decay * t)
    click = rng.standard_normal(int(0.006 * SR)) * np.linspace(1, 0, int(0.006 * SR)) * 0.25
    out[:len(click)] += click
    # wooden body resonance
    sos = butter(2, [180, 3200], 'bandpass', fs=SR, output='sos')
    out = 0.6 * out + 0.6 * sosfilt(sos, out)
    return out * np.minimum(1, t / 0.002)


def piano(freq, dur=3.5):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for k, a in enumerate([1, 0.45, 0.22, 0.12, 0.06, 0.03], start=1):
        out += a * np.sin(2 * np.pi * freq * k * (1 + 0.0003 * k * k) * t) * np.exp(-t * (0.9 + 0.7 * k))
    return out * np.minimum(1, t / 0.004)


FORM = [(800, 80, 1.0), (1150, 90, 0.5), (2900, 120, 0.12)]  # vowel "a"


def choir_note(freq, dur, attack=1.2, release=2.0):
    n = int((dur + release) * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.006, 0.0, 0.007):
        f = freq * (1 + det)
        ph = 2 * np.pi * np.cumsum(f * (1 + 0.004 * np.sin(2 * np.pi * 5.2 * t + rng.random() * 6))) / SR
        for k in range(1, int(4000 / f) + 1):
            fk = f * k
            a = sum(g * np.exp(-((fk - F) / (bw * 2.5)) ** 2) for F, bw, g in FORM) + 0.02 / k
            out += a * np.sin(k * ph)
    return out / 3 * env_adsr(n, attack, release)


def drum(freq=55, dur=1.6, noise=0.35, punch=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = freq * (1 + 0.9 * np.exp(-t * 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    nz = rng.standard_normal(n) * np.exp(-t * 18) * noise
    nz = sosfilt(butter(2, 900, 'lowpass', fs=SR, output='sos'), nz)
    return (body + nz) * punch


def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    out = np.zeros(n); seg = int(0.05 * SR)
    for i in range(0, n, seg):
        fc = 300 + 6000 * (i / n) ** 2
        sos = butter(2, [fc * 0.7, min(fc * 1.4, 18000)], 'bandpass', fs=SR, output='sos')
        out[i:i + seg] = sosfilt(sos, nz[i:i + seg])
    return out * (t / dur) ** 2.2


def boom(t0, g=1.0):
    add(drum(43, 3.0, 0.5), t0, 0.9 * g)
    add(riser(0.01) if False else drum(31, 3.5, 0.2), t0, 0.6 * g)


# ---------------------------------------------------------------- harmony
PROG_MIN = [['D3', 'A3', 'D4', 'F4'], ['Bb2', 'F3', 'D4', 'F4'], ['F2', 'C4', 'F4', 'A4'], ['C3', 'G3', 'C4', 'E4']]
PROG_LIFT = [['Bb2', 'F3', 'D4', 'F4'], ['F2', 'C4', 'F4', 'A4'], ['C3', 'G3', 'E4', 'G4'], ['D3', 'A3', 'D4', 'F4']]
BAR = 4 * BEAT


def strings(t0, t1, prog, gain, bright=9.0, bass=True):
    t = t0; i = 0
    while t < t1 - 0.2:
        d = min(BAR, t1 - t)
        ch = prog[i % len(prog)]
        for j, nm in enumerate(ch):
            add(string_note(hz(m(nm)), d, bright=bright), t, gain * (0.9 if j else 1.1), pan=[-0.5, -0.2, 0.25, 0.55][j])
        if bass:
            add(string_note(hz(m(ch[0]) - 12), d, bright=5, attack=0.4), t, gain * 0.9, 0)
        t += BAR; i += 1


def dombra_kui(t0, t1, gain, fast=False):
    """Rhythmic two-string strumming (кағыс): triplet pattern with accents."""
    pattern = [(0, 1.0, 'd'), (1 / 3, 0.55, 'u'), (2 / 3, 0.7, 'd')]
    melody = ['D4', 'D4', 'F4', 'E4', 'D4', 'C4', 'A3', 'C4', 'D4', 'F4', 'G4', 'A4', 'G4', 'F4', 'E4', 'D4']
    beat = BEAT / (2 if fast else 1)
    t = t0; k = 0
    while t < t1:
        for off, acc, dirn in pattern:
            tt = t + off * beat
            if tt >= t1: break
            mel = melody[(k // 3) % len(melody)]
            lo = 'A3'
            spread = 0.012 if dirn == 'd' else -0.012
            add(pluck(hz(m(lo)), 1.4, 0.9), tt, gain * acc * 0.7, -0.15)
            add(pluck(hz(m(mel)), 1.6, 1.0), tt + max(spread, 0), gain * acc, 0.15)
            k += 1
        t += beat


def dombra_phrase(t0, notes, gain, step=BEAT / 2):
    for i, nm in enumerate(notes):
        if nm: add(pluck(hz(m(nm)), 2.4, 1.0), t0 + i * step, gain, 0.2)


def piano_motif(t0, t1, gain):
    seq = ['A4', 'D5', 'E5', 'F5', 'E5', 'D5', 'C5', 'A4']
    t = t0; i = 0
    while t < t1:
        add(piano(hz(m(seq[i % len(seq)]))), t, gain, 0.1)
        if i % 4 == 0: add(piano(hz(m(seq[i % len(seq)]) - 24)), t, gain * 0.6, -0.2)
        t += BEAT; i += 1


def ostinato(t0, t1, gain, roots=('D3', 'Bb2', 'F3', 'C3')):
    step = BEAT / 2; t = t0; i = 0
    while t < t1:
        root = m(roots[int((t - t0) // BAR) % len(roots)])
        nn = root + (12 if i % 4 == 2 else 0)
        add(string_note(hz(nn), step * 0.8, bright=7, attack=0.01, release=0.15), t, gain * (1.0 if i % 2 == 0 else 0.7), -0.3 if i % 2 else 0.3)
        t += step; i += 1


def drums(t0, t1, gain, dense=False):
    t = t0; i = 0
    while t < t1:
        b = i % 8
        if b in (0, 3, 6) or (dense and b in (5, 7)):
            add(drum(52 if b == 0 else 64, 1.2, 0.4), t, gain * (1.0 if b == 0 else 0.6), 0)
        t += BEAT / 2; i += 1


def wind(t0, t1, gain):
    n = int((t1 - t0) * SR)
    nz = np.cumsum(rng.standard_normal(n)); nz -= np.convolve(nz, np.ones(4410) / 4410, 'same')
    nz = sosfilt(butter(2, [120, 900], 'bandpass', fs=SR, output='sos'), nz)
    nz /= np.abs(nz).max() + 1e-9
    tt = np.arange(n) / SR
    nz *= (0.6 + 0.4 * np.sin(2 * np.pi * 0.09 * tt)) * env_adsr(n, 2.0, 2.5)
    add(nz, t0, gain, -0.3); add(np.roll(nz, 9000), t0, gain, 0.3)


def choir(t0, t1, prog, gain):
    t = t0; i = 0
    while t < t1 - 0.3:
        d = min(BAR, t1 - t)
        for j, nm in enumerate(prog[i % len(prog)][1:]):
            add(choir_note(hz(m(nm)), d), t, gain, [-0.4, 0, 0.4][j])
        t += BAR; i += 1


s = SC
# ---- Scene 1: opening — wind, low drone, rising strings, dombra harmonics
wind(0, s[2]['start'] + 3, 0.05)
strings(0.0, s[1]['end'], PROG_MIN, 0.016, bright=5)
add(string_note(hz(m('D2')), s[1]['end'] + 2, bright=4, attack=3), 0, 0.05)
dombra_phrase(1.6, ['D5', None, 'A4', None, 'D5', 'E5', 'D5', None, 'A4'], 0.10, BEAT / 2)
add(riser(1.5), 0.2, 0.05)
boom(1.75, 0.7)
add(riser(2.2), s[2]['start'] - 2.2, 0.06)
# ---- Scene 2: heritage — dombra kui + low strings
boom(s[2]['start'], 0.6)
dombra_kui(s[2]['start'], s[2]['end'], 0.075)
strings(s[2]['start'], s[2]['end'], PROG_MIN, 0.014, bright=5)
# ---- Scene 3: 1991 — solemn
boom(s[3]['start'] + 0.25, 1.1)
strings(s[3]['start'], s[3]['end'], PROG_MIN, 0.022, bright=7)
choir(s[3]['start'] + 3.0, s[3]['end'], PROG_MIN, 0.010)
add(riser(2.0), s[4]['start'] - 2.0, 0.05)
# ---- Scene 4: building — ostinato + light drums
ostinato(s[4]['start'], s[4]['end'], 0.020)
strings(s[4]['start'], s[4]['end'], PROG_MIN, 0.016, bright=8, bass=False)
drums(s[4]['start'] + BAR, s[4]['end'], 0.25)
# ---- Scene 5: new capital — lift to major
boom(s[5]['start'], 0.9)
strings(s[5]['start'], s[5]['end'], PROG_LIFT, 0.024, bright=11)
ostinato(s[5]['start'], s[5]['end'], 0.016, roots=('Bb2', 'F2', 'C3', 'D3'))
drums(s[5]['start'], s[5]['end'], 0.30)
# ---- Scene 6: people — warm piano + strings
piano_motif(s[6]['start'], s[6]['end'], 0.06)
strings(s[6]['start'], s[6]['end'], PROG_LIFT, 0.016, bright=7)
add(riser(2.0), s[7]['start'] - 2.0, 0.06)
# ---- Scene 7: modern — driving
boom(s[7]['start'], 0.8)
ostinato(s[7]['start'], s[7]['end'], 0.024)
strings(s[7]['start'], s[7]['end'], PROG_MIN, 0.016, bright=10, bass=False)
drums(s[7]['start'], s[7]['end'], 0.38, dense=True)
# ---- Scene 8: achievements — fast dombra + drums
dombra_kui(s[8]['start'], s[8]['end'], 0.07, fast=True)
strings(s[8]['start'], s[8]['end'], PROG_LIFT, 0.018, bright=10)
drums(s[8]['start'], s[8]['end'], 0.40, dense=True)
add(riser(2.0), s[9]['start'] - 2.0, 0.05)
# ---- Scene 9: next generation — emotional, softer
piano_motif(s[9]['start'], s[9]['end'], 0.05)
strings(s[9]['start'], s[9]['end'], PROG_LIFT, 0.022, bright=8)
choir(s[9]['start'] + BAR, s[9]['end'], PROG_LIFT, 0.008)
add(riser(3.0), s[10]['start'] - 3.0, 0.07)
# ---- Scene 10: finale — full climax, resolve to D major
f0, f1 = s[10]['start'], s[10]['end']
boom(f0, 1.2)
strings(f0, f1 - 5.5, PROG_LIFT, 0.028, bright=12)
choir(f0, f1 - 5.5, PROG_LIFT, 0.014)
ostinato(f0, f1 - 5.5, 0.018, roots=('Bb2', 'F2', 'C3', 'D3'))
drums(f0, f1 - 6.0, 0.45, dense=True)
dombra_kui(f0 + BAR, f1 - 6.0, 0.05)
fin = f1 - 6.6
boom(fin, 1.4)
for j, nm in enumerate(['D2', 'D3', 'A3', 'D4', 'F#4', 'A4', 'D5']):
    add(string_note(hz(m(nm)), 4.5, bright=10, attack=0.3, release=3.5), fin, 0.03, [-.6, -.4, -.2, 0, .2, .4, .6][j])
for nm in ['A3', 'D4', 'F#4']:
    add(choir_note(hz(m(nm)), 4.2, attack=0.6, release=3.0), fin, 0.016)
dombra_phrase(fin + 0.4, ['D5', 'A4', 'F#4', 'D4'], 0.08, BEAT)

# ---------------------------------------------------------------- reverb + master
mix = np.stack([L, R])
ir_len = int(3.2 * SR); tt = np.arange(ir_len) / SR
irs = []
for c in range(2):
    ir = rng.standard_normal(ir_len) * np.exp(-tt / 0.75)
    ir = sosfilt(butter(1, 5000, 'lowpass', fs=SR, output='sos'), ir)
    ir[:int(0.02 * SR)] = 0
    irs.append(ir / np.sqrt((ir ** 2).sum()))
wet = np.stack([fftconvolve(mix[c], irs[c])[:N] for c in range(2)])
out = mix * 0.75 + wet * 0.55
out = sosfilt(butter(2, 28, 'highpass', fs=SR, output='sos'), out)
# fade in/out
fade_out = int(2.5 * SR)
out[:, -fade_out:] *= np.linspace(1, 0, fade_out)
out /= np.abs(out).max() + 1e-9
out = np.tanh(out * 1.3) / np.tanh(1.3) * 0.89
sf.write('music.wav', out.T, SR, subtype='PCM_24')
print('music.wav', out.shape[1] / SR, 's')
