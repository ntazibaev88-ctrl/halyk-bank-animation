"""Procedural soundtrack: original cinematic score + sound effects, synced to build/timeline.json,
then mixed under the narration with ducking. Output: build/mix.wav (48 kHz stereo)."""
import json, os, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(7)
TL = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
DUR = TL['duration'] + 0.5
N = int(DUR * SR)
SC = {s['id']: s for s in TL['scenes']}


def cue(scene, name):
    for g in SC[scene]['segments']:
        if g.get('cue') == name:
            return g['start']
    return None


def word(scene, cuename, prefix, nth=0):
    for g in SC[scene]['segments']:
        if g.get('cue') == cuename or cuename is None:
            ws = [w for w in g['words'] if w['w'].lower().startswith(prefix)]
            if len(ws) > nth:
                return ws[nth]['s']
    return None


def t_arr(d):
    return np.arange(int(d * SR)) / SR


def lp(x, fc, order=2):
    """FFT brick-ish lowpass with smooth rolloff (fast for long signals)."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X, n)


def hp(x, fc, order=2):
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR) + 1e-9
    X *= 1 / np.sqrt(1 + (fc / f) ** (2 * order))
    return np.fft.irfft(X, n)


def reverb(x, dur=2.4, mix=0.35):
    L = int(dur * SR)
    ir = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * (6.9 / dur))
    ir = lp(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    n = len(x) + L
    nf = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(ir, nf), nf)[:len(x)]
    return x * (1 - mix) + y * mix * 1.6


def add(buf, t0, x, g=1.0):
    i = int(t0 * SR)
    if i < 0:
        x = x[-i:]; i = 0
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[:j - i] * g


def note_hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------- SCORE ----------------
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
# D minor: Dm - Bb - F - C   (midi roots)
PROG = [(50, [62, 65, 69]), (46, [58, 62, 65]), (53, [60, 65, 69]), (48, [60, 64, 67])]
# brighter for finale: Bb - C - Dm - F ... resolve on F
PROG_END = [(46, [62, 65, 70]), (48, [64, 67, 72]), (50, [62, 65, 69]), (53, [65, 69, 72])]

hook_end = SC['hook']['end']
fin_start = SC['final2']['start']


def intensity(t):
    """0..1 music energy by section"""
    for sid, v in [('hook', 0.5), ('pte', 0.55), ('tb', 0.55), ('equip', 0.65), ('before', 0.55), ('monitor', 0.65),
                   ('forbid', 0.8), ('permit', 0.6), ('emergency', 0.85), ('fire', 0.7), ('rules', 0.8), ('final', 0.85),
                   ('module2', 0.75), ('pipes', 0.55), ('cooling', 0.6), ('light', 0.65), ('tools', 0.6), ('move', 0.7),
                   ('checklist', 0.65), ('mech1', 0.6), ('mech2', 0.6), ('mech3', 0.75), ('mech4', 0.65), ('mech5', 0.6), ('alc', 0.7), ('final2', 0.9)]:
        if SC[sid]['start'] <= t < SC[sid]['end'] + 0.01:
            return v
    return 0.5


def saw_pad(freq, d):
    t = t_arr(d)
    y = np.zeros_like(t)
    for det in (-0.12, 0.0, 0.11):
        f = freq * 2 ** (det / 12)
        for h in range(1, 9):
            y += np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28)) / h * (0.8 ** h)
    return y / 3


pad = np.zeros(N); bass = np.zeros(N); arp = np.zeros(N); drums = np.zeros(N)
t = 0.0
bar_i = 0
while t < DUR:
    prog = PROG_END if t >= fin_start else PROG
    root, chord = prog[(bar_i // 2) % 4]
    d = 2 * BAR
    # pad chord with soft envelope
    seg = sum(saw_pad(note_hz(m), d + 0.6) for m in chord) + 0.6 * saw_pad(note_hz(chord[0] - 12), d + 0.6)
    env = np.minimum(1, t_arr(d + 0.6) / 0.6) * np.minimum(1, (d + 0.6 - t_arr(d + 0.6)) / 0.6)
    add(pad, t, seg * env, 0.05)
    # bass pulses on 1 and 3
    for b in range(8):
        bt = t + b * BEAT
        if b % 2 == 0 and bt < DUR:
            tt = t_arr(BEAT * 1.8)
            f = note_hz(root - 12)
            add(bass, bt, (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 2.2) * np.minimum(1, tt / 0.01), 0.32)
    # arpeggio 8ths
    tones = chord + [chord[0] + 12, chord[1] + 12]
    for k in range(16):
        at = t + k * BEAT / 2
        if at >= DUR:
            break
        m = tones[[0, 1, 2, 3, 2, 1, 4, 2][k % 8]] + 12
        tt = t_arr(0.5)
        f = note_hz(m)
        y = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 9) * np.minimum(1, tt / 0.004)
        g = 0.07 if at > hook_end - 0.5 else 0.0
        add(arp, at, y, g * (0.6 + 0.6 * intensity(at)))
    # drums
    for b in range(8):
        bt = t + b * BEAT
        if bt >= DUR:
            break
        inten = intensity(bt)
        if bt < hook_end - 0.5 and bt < 2.6:
            continue
        if b % 2 == 0:  # kick
            tt = t_arr(0.45)
            f = 50 + 90 * np.exp(-tt * 30)
            k_ = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
            add(drums, bt, k_, 0.42 * inten)
        if b % 4 == 2 and inten >= 0.6:  # soft clap/snare
            tt = t_arr(0.3)
            sn = hp(rng.standard_normal(len(tt)), 1200) * np.exp(-tt * 18)
            add(drums, bt, sn, 0.07 * inten)
        for h in range(2):  # hats
            ht = bt + h * BEAT / 2
            tt = t_arr(0.08)
            hh = hp(rng.standard_normal(len(tt)), 7000) * np.exp(-tt * 70)
            add(drums, ht, hh, 0.025 * inten * (1.3 if h else 0.8))
    t += d
    bar_i += 2

pad = lp(pad, 1800)
music = reverb(pad + arp, 2.6, 0.4) + bass + drums
# section dynamics envelope
tt = np.arange(N) / SR
ienv = np.array([intensity(x) for x in np.arange(0, DUR, 0.05)])
ienv = np.interp(tt, np.arange(len(ienv)) * 0.05, ienv)
ienv = np.convolve(ienv, np.ones(SR // 2) / (SR // 2), mode='same')
music *= 0.55 + 0.6 * ienv
# intro fade-in, quiet before the title slam, fade-out
music *= np.clip(tt / 1.5, 0, 1)
music *= 1 - 0.55 * ((tt > 0) & (tt < 2.6))
music *= np.clip((DUR - 0.3 - tt) / 3.0, 0, 1)

# ---------------- SFX ----------------
sfx = np.zeros(N)


def whoosh(d=0.75, f0=300, f1=3000):
    n = rng.standard_normal(int(d * SR))
    tt = t_arr(d)
    env = np.sin(np.pi * tt / d) ** 2
    # sweep via mixing high and low bands
    lo = lp(n, f0 * 3); hi = hp(n, f1)
    k = tt / d
    return (lo * (1 - k) + hi * k * 0.6 + lp(n, 1500) * 0.5) * env


def impact():
    tt = t_arr(2.5)
    f = 38 + 70 * np.exp(-tt * 8)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.8)
    noise = lp(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 5) * 0.6
    brass = sum(np.sin(2 * np.pi * note_hz(m) * tt * (1 + 0.002 * np.sin(tt * 30))) for m in (38, 45, 50)) * np.exp(-tt * 1.2) * np.minimum(1, tt / 0.05) * 0.25
    return reverb(boom + noise + brass, 2.0, 0.3)


def alarm(d, f1=880, f2=660, rate=1.25):
    tt = t_arr(d)
    f = np.where((tt * rate * 2) % 2 < 1, f1, f2)
    y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3 + np.sin(2 * np.pi * np.cumsum(f) / SR)
    y = lp(y, 2500)
    return y * np.minimum(1, tt / 0.1) * np.minimum(1, (d - tt) / 0.5)


def hiss(d, fc=4000):
    tt = t_arr(d)
    n = hp(rng.standard_normal(len(tt)), fc)
    return n * np.minimum(1, tt / 0.15) * np.minimum(1, (d - tt) / 0.4) * (0.8 + 0.2 * np.sin(tt * 13))


def hum(d, f=55, harm=(1, 2, 3, 4), wob=0.0):
    tt = t_arr(d)
    y = sum(np.sin(2 * np.pi * f * h * tt) / h for h in harm)
    y *= 1 + wob * np.sin(2 * np.pi * 6 * tt)
    return y * np.minimum(1, tt / 0.4) * np.minimum(1, (d - tt) / 0.4)


def blip(f=1200, d=0.18):
    tt = t_arr(d)
    return (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.5 * tt)) * np.exp(-tt * 22) * np.minimum(1, tt / 0.003)


def chime(f=880):
    tt = t_arr(1.2)
    y = sum(np.sin(2 * np.pi * f * r * tt) * a for r, a in ((1, 1), (2, 0.4), (2.76, 0.2), (5.4, 0.08)))
    return reverb(y * np.exp(-tt * 4) * np.minimum(1, tt / 0.003), 1.2, 0.3)


def thud():
    tt = t_arr(0.5)
    f = 60 + 120 * np.exp(-tt * 40)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 12) + lp(rng.standard_normal(len(tt)), 800) * np.exp(-tt * 30) * 0.7)


def click():
    tt = t_arr(0.08)
    return hp(rng.standard_normal(len(tt)), 2000) * np.exp(-tt * 90) + np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 80) * 0.5


def buzzer(d=0.35):
    tt = t_arr(d)
    y = np.sign(np.sin(2 * np.pi * 140 * tt)) + np.sign(np.sin(2 * np.pi * 147 * tt))
    return lp(y, 1800) * np.minimum(1, tt / 0.01) * np.minimum(1, (d - tt) / 0.05) * 0.5


def splash(d=1.5):
    tt = t_arr(d)
    n = lp(hp(rng.standard_normal(len(tt)), 600), 6000)
    gr = (rng.random(len(tt)) < 0.004) * rng.standard_normal(len(tt)) * 3
    return (n * 0.6 + lp(gr, 3000)) * np.minimum(1, tt / 0.05) * np.minimum(1, (d - tt) / 0.5)


def powerdown():
    tt = t_arr(1.4)
    f = 220 * np.exp(-tt * 2.2) + 20
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * (1 - tt / 1.4) * 0.8


def ring(d=2.0):
    tt = t_arr(d)
    on = ((tt % 1.0) < 0.6).astype(float)
    y = (np.sin(2 * np.pi * 1000 * tt) + np.sin(2 * np.pi * 1250 * tt)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 20 * tt)))
    return y * on * 0.4


# transitions
for s in TL['scenes'][1:]:
    add(sfx, s['start'] - 0.42, whoosh(0.85), 0.16)

# hook
h0 = SC['hook']['start']
add(sfx, 0, hum(SC['hook']['end'] + 0.3, 45, (1, 2, 3, 5), 0.05), 0.05)
add(sfx, 0, lp(rng.standard_normal(int(12 * SR)), 300) * np.minimum(1, t_arr(12) / 1.5) * np.minimum(1, (12 - t_arr(12)) / 1), 0.12)
add(sfx, 0.3, hiss(9.0, 3500), 0.035)
add(sfx, 2.65, impact(), 0.55)
add(sfx, 2.5, alarm(5.5), 0.06)

# PTE pops
for i in range(1, 5):
    add(sfx, SC['pte']['start'] + 0 + (cue('pte', f'b{i}') - SC['pte']['start']) - 0.1, blip(900 + i * 120), 0.12)
add(sfx, SC['pte']['start'] + 1.6, whoosh(0.6, 500, 4000), 0.06)  # page flip
# TB items
for pre, nth in (('дулыға', 0), ('қолғап', 0), ('қорғаныш', 0)):
    w = word('tb', 'ppe1', pre, nth)
    if w: add(sfx, w + 0.1, click(), 0.25); add(sfx, w + 0.35, blip(1400), 0.08)
w = word('tb', 'ppe2', 'арнайы', 0); add(sfx, w + 0.1, thud(), 0.25)
w = word('tb', 'ppe2', 'арнайы', 1); add(sfx, w + 0.2, chime(1046), 0.12)
add(sfx, cue('tb', 'protect'), chime(660), 0.1)

# equipment
e = {i: cue('equip', f'e{i}') for i in range(1, 11)}
for i in range(1, 11):
    add(sfx, e[i] - 0.35, whoosh(0.6, 400, 3000), 0.08)
    add(sfx, e[i] - 0.05, blip(700 + i * 40, 0.2), 0.07)
nx = lambda i: e[i + 1] - 0.3 if i < 10 else SC['equip']['end']
add(sfx, e[1], hum(nx(1) - e[1], 40, (1, 2, 3, 5, 7), 0.25) + hp(rng.standard_normal(int((nx(1) - e[1]) * SR)), 400) * 0.3, 0.06)  # furnace
add(sfx, e[2], hum(nx(2) - e[2], 110, (1, 2, 3, 4, 6)) + hiss(nx(2) - e[2], 2500) * 0.5, 0.05)  # turbine whine
add(sfx, e[3], hum(nx(3) - e[3], 100, (1, 2, 3)), 0.06)  # generator 50Hz-ish hum
add(sfx, e[4], hum(nx(4) - e[4], 75, (1, 2, 3, 4), 0.3), 0.06)  # pump
add(sfx, e[5], hum(nx(5) - e[5], 60, (1, 2, 4)) + lp(rng.standard_normal(int((nx(5) - e[5]) * SR)), 600) * 0.8, 0.06)
add(sfx, e[6], lp(rng.standard_normal(int((nx(6) - e[6]) * SR)), 900) * np.minimum(1, t_arr(nx(6) - e[6]) / 0.4), 0.12)
add(sfx, e[7], hiss(nx(7) - e[7], 5000), 0.03)
add(sfx, e[9], hiss(nx(9) - e[9], 3000), 0.03)
for k in range(4):
    add(sfx, e[10] + 0.3 + k * 0.5, click(), 0.06)

# before work: checks
bs = [cue('before', f's{i}') for i in range(1, 5)]
add(sfx, bs[0] + 0.5, thud(), 0.18)
for i in range(4):
    tchk = (bs[i + 1] if i < 3 else SC['before']['end'] - 1.2) - 0.5
    add(sfx, tchk, chime(784 + i * 98), 0.09)

# monitoring
al = cue('monitor', 'alarm'); rp = cue('monitor', 'report')
for k, c in enumerate(('m1', 'm2', 'm3')):
    add(sfx, cue('monitor', c), blip(1000 + k * 150), 0.08)
add(sfx, al, alarm(rp - al + 1.4, 988, 740, 1.6), 0.07)
add(sfx, al, hiss(rp - al + 1.8, 2500), 0.08)
add(sfx, rp + 0.2, blip(1800, 0.12), 0.12); add(sfx, rp + 0.35, blip(1800, 0.12), 0.12)
add(sfx, rp + 0.4, hp(rng.standard_normal(int(0.25 * SR)), 1500) * np.exp(-t_arr(0.25) * 8), 0.05)  # radio squelch

# forbidden: stamp + buzzer
for i in range(1, 7):
    c = cue('forbid', f'f{i}')
    add(sfx, c - 0.1, whoosh(0.5, 400, 3000), 0.07)
    add(sfx, c + 0.35, thud(), 0.3)
    add(sfx, c + 0.4, buzzer(), 0.05)
add(sfx, cue('forbid', 'final'), impact(), 0.4)

# permit
p1, p2, p3, p4 = (cue('permit', f'p{i}') for i in range(1, 5))
add(sfx, p1 + 0.3, thud(), 0.3); add(sfx, p1 + 0.35, click(), 0.3)
add(sfx, p1 + 1.6, click(), 0.35); add(sfx, p1 + 1.7, click(), 0.25)
add(sfx, p2 + 0.2, click(), 0.2)
for t_ in (p1 + 0.3, p1 + 1.4, p2 + 0.4, p2 + 1.8, p3 + 0.5):
    add(sfx, t_, blip(1500, 0.12), 0.06)
add(sfx, p3 + 0.15, hp(rng.standard_normal(int(0.9 * SR)), 3000) * 0.3 * np.exp(-((t_arr(0.9) - 0.45) ** 2) * 20), 0.08)  # pen
add(sfx, p3 + 1.0, thud(), 0.45)
add(sfx, p4, chime(988), 0.12)

# emergency
ex = [word('emergency', 'x1', 'бу'), word('emergency', 'x1', 'су'), word('emergency', 'x1', 'насос'), word('emergency', 'x2', 'өрт'), word('emergency', 'x2', 'электр')]
add(sfx, ex[0] - 0.1, hiss(1.6, 2500), 0.16)
add(sfx, ex[1], splash(1.5), 0.15)
add(sfx, ex[2] + 0.2, buzzer(0.6), 0.07); add(sfx, ex[2] + 0.2, thud(), 0.3)
add(sfx, ex[3], alarm(1.4, 1200, 1200, 8) * 0.8, 0.06)
add(sfx, ex[3], lp(rng.standard_normal(int(1.6 * SR)), 1200) * np.minimum(1, t_arr(1.6) / 0.2) * np.minimum(1, (1.6 - t_arr(1.6)) / 0.3), 0.12)
add(sfx, ex[4] + 0.4, powerdown(), 0.2)
a1 = cue('emergency', 'act1'); a2 = cue('emergency', 'act2')
for k in range(5):
    add(sfx, a1 + 0.1 + k * 0.42, thud() * 0.5, 0.12)  # footsteps
add(sfx, a1 - 0.2, hiss(a2 - a1 + 1.2, 2800), 0.05)
for i, pre in enumerate(('адамдардың', 'басшыға')):
    w = word('emergency', 'act2', pre)
    if w: add(sfx, w - 0.1, blip(1300 + i * 200), 0.1)
add(sfx, a1 + 0.1, blip(1100), 0.1)

# fire
add(sfx, cue('fire', 'ext'), whoosh(0.6), 0.08)
for k in range(3):
    add(sfx, cue('fire', 'ext') - 0.1 + k * 0.25, thud() * 0.6, 0.12)
add(sfx, cue('fire', 'exit'), chime(740), 0.08)
add(sfx, cue('fire', 'call') + 0.3, ring(2.4), 0.05)

# rules
for i in range(1, 11):
    add(sfx, cue('rules', f'r{i}') - 0.15, chime(523.25 * 2 ** ([0, 2, 4, 5, 7, 9, 11, 12, 14, 16][i - 1] / 12)), 0.08)
    add(sfx, cue('rules', f'r{i}') - 0.15, whoosh(0.4, 600, 4000), 0.04)

# final
add(sfx, SC['final']['start'] + 0.5, impact() * 0.6, 0.3)
add(sfx, cue('final', 'slogan'), chime(1046.5), 0.12)
add(sfx, cue('final', 'slogan') + 0.1, chime(1318.5), 0.08)

# ---------------- PRACTICAL MODULE ----------------
add(sfx, SC['module2']['start'] + 0.4, impact() * 0.6, 0.3)
for i in range(7):
    add(sfx, cue('module2', 'topic') + i * 0.18, blip(800 + i * 90), 0.06)
# pipes
for pre in ('ø32', 'ø40', 'ø50', 'ø60'):
    w = word('pipes', 'sizes', pre)
    if w: add(sfx, w, click(), 0.2)
for c_ in ('dia', 'wall', 'dn'):
    add(sfx, cue('pipes', c_), blip(1100), 0.08)
add(sfx, cue('pipes', 'doc'), thud(), 0.2)
add(sfx, cue('pipes', 'route') - 0.2, whoosh(1.2, 300, 2500), 0.08)
for pre in ('тіректер', 'қамытпен', 'фланец', 'дәнекерлеу', 'оқшаулағышпен'):
    w = word('pipes', None, pre)
    if w: add(sfx, w, click(), 0.18)
add(sfx, cue('pipes', 'warn'), buzzer(0.5), 0.07); add(sfx, cue('pipes', 'warn'), thud(), 0.3)
# cooling: water flow + pump hum + tower
k2 = cue('cooling', 'k2'); ce = SC['cooling']['end']
add(sfx, k2, hum(ce - k2, 75, (1, 2, 3, 4), 0.25), 0.05)
add(sfx, cue('cooling', 'k3'), splash(ce - cue('cooling', 'k3')) * 0.6, 0.06)
add(sfx, cue('cooling', 'k5'), buzzer(0.5), 0.07); add(sfx, cue('cooling', 'k5'), thud(), 0.3)
# light: flicker, stop, radio, lamp on
L0 = SC['light']['start']
for k in range(4):
    add(sfx, L0 + 0.5 + k * 0.17, click(), 0.12)
add(sfx, L0 + 1.2, powerdown(), 0.15)
w = word('light', 'l1', 'болмайды'); add(sfx, (w or cue('light', 'l1') + 2.5), thud(), 0.3)
l2 = cue('light', 'l2'); add(sfx, l2 + 0.3, blip(1800, 0.12), 0.12); add(sfx, l2 + 0.45, blip(1800, 0.12), 0.12)
l3 = cue('light', 'l3'); add(sfx, l3 + 0.8, click(), 0.35); add(sfx, l3 + 0.85, chime(1046), 0.1); add(sfx, l3 + 1.6, chime(784), 0.08)
# tools
for i in range(1, 11):
    add(sfx, cue('tools', f't{i}') - 0.15, click(), 0.18); add(sfx, cue('tools', f't{i}') - 0.1, blip(900 + i * 60, 0.15), 0.05)
add(sfx, cue('tools', 'check') + 0.6, chime(988), 0.08)
add(sfx, cue('tools', 'check') + 1.4, buzzer(0.4), 0.06)
add(sfx, cue('tools', 'bad'), thud(), 0.3)
# movement: forklift engine + reverse beeper-ish horn, crane hum
m0 = SC['move']['start']; me = SC['move']['end']
add(sfx, m0, hum(me - m0, 48, (1, 2, 3, 5), 0.15) * 0.8, 0.05)
add(sfx, m0, hum(me - m0, 120, (1, 2), 0.0) * 0.3, 0.03)
for k in range(int((me - m0) / 1.1)):
    add(sfx, m0 + 0.5 + k * 1.1, blip(1500, 0.2), 0.025)
for c_ in ('v1', 'v2', 'v3'):
    add(sfx, cue('move', c_), chime(880), 0.07)
# checklist ticks
for c_ in ('c1', 'c2', 'c3'):
    g = [x for x in SC['checklist']['segments'] if x.get('cue') == c_][0]
    n = {'c1': 8, 'c2': 7, 'c3': 6}[c_]
    for j in range(n):
        add(sfx, g['start'] + (j + 0.7) / n * (g['end'] - g['start']), blip(1000 + j * 70, 0.14), 0.07)
    add(sfx, g['start'] - 0.3, whoosh(0.6, 400, 3000), 0.07)
add(sfx, cue('checklist', 'c4'), chime(1046.5), 0.12)
# machinery & repair
def motor(d, ramps, f=90):
    """motor hum whose level/pitch follows a speed profile (list of (t0,t1,v0,v1) in scene seconds, v 0..1)"""
    tt = t_arr(d)
    v = np.zeros_like(tt)
    for a_, b_, v0, v1 in ramps:
        m = tt >= b_; v[m] = v1
        m = (tt >= a_) & (tt < b_); v[m] = v0 + (v1 - v0) * (tt[m] - a_) / max(1e-3, b_ - a_)
    ph = np.cumsum(2 * np.pi * f * (0.4 + 0.6 * v) / SR)
    y = (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)) * v + lp(rng.standard_normal(len(tt)), 700) * 0.3 * v
    return y
M = {k: SC[k] for k in ('mech1', 'mech2', 'mech3', 'mech4', 'mech5', 'alc')}
rel = lambda sc_, c_: cue(sc_, c_) - M[sc_]['start']
d1 = M['mech1']['end'] - M['mech1']['start']; h_ = rel('mech1', 'how')
add(sfx, M['mech1']['start'], motor(d1, [(h_, h_ + 1.6, 0, 1)]), 0.06)
for i, n in enumerate(('насостар', 'желдеткіштер', 'дымосостар', 'турбина', 'генератор')):
    w = word('mech1', 'list', n)
    if w: add(sfx, w - 0.1, blip(900 + i * 80), 0.07)
for n in ('электр', 'муфта', 'білік', 'мойынтіректер', 'жұмыс'):
    w = word('mech1', 'parts', n)
    if w: add(sfx, w, click(), 0.18)
add(sfx, cue('mech1', 'guard'), chime(880), 0.09)
d2 = M['mech2']['end'] - M['mech2']['start']; r_ = rel('mech2', 'run') - 0.2; s_ = rel('mech2', 'stop') + 0.2
add(sfx, M['mech2']['start'], motor(d2, [(r_ + 0.3, r_ + 2.3, 0, 1), (s_ + 0.2, s_ + 3.2, 1, 0)]), 0.07)
add(sfx, cue('mech2', 'run') - 0.2, click(), 0.35); add(sfx, cue('mech2', 'stop') + 0.2, click(), 0.35)
g_ = [x for x in SC['mech2']['segments'] if x.get('cue') == 'pre'][0]
for j in range(4): add(sfx, g_['start'] + (j + 0.65) / 4 * (g_['end'] - g_['start']), blip(1000 + j * 90, 0.14), 0.07)
add(sfx, cue('mech2', 'zero'), chime(784), 0.08)
d3 = M['mech3']['end'] - M['mech3']['start']
add(sfx, M['mech3']['start'], motor(d3, [(0, 0.01, 1, 1)]), 0.06)
s1 = cue('mech3', 's1'); add(sfx, s1, hum(2.2, 23, (1, 2, 3), 0.6), 0.12)
s2 = cue('mech3', 's2')
for k in range(8): add(sfx, s2 + k * 0.22, click(), 0.14)
add(sfx, cue('mech3', 's4'), hiss(2.0, 3000), 0.06)
for k, c_ in enumerate(('s1', 's2', 's3', 's4', 's5')): add(sfx, cue('mech3', c_) - 0.1, buzzer(0.25), 0.04)
add(sfx, cue('mech3', 'away'), alarm(1.6, 880, 660, 1.6), 0.05)
rp = cue('mech3', 'report'); add(sfx, rp + 0.2, blip(1800, 0.12), 0.12); add(sfx, rp + 0.35, blip(1800, 0.12), 0.12)
add(sfx, cue('mech3', 'log') + 0.5, hp(rng.standard_normal(int(1.4 * SR)), 3000) * 0.3 * np.exp(-((t_arr(1.4) - 0.7) ** 2) * 6), 0.07)
d4 = M['mech4']['end'] - M['mech4']['start']; e_ = rel('mech4', 'el') + 0.6; z_ = rel('mech4', 'stop0') + 1.6
add(sfx, M['mech4']['start'], motor(d4, [(0, 0.01, 1, 1), (e_, z_, 1, 0)]), 0.05)
add(sfx, cue('mech4', 'el') + 0.5, thud(), 0.3); add(sfx, cue('mech4', 'el') + 0.55, click(), 0.3)
for n, f0 in (('бу', 0.2), ('су', 0.8), ('қысым', 1.4)):
    w = word('mech4', 'en', n) or cue('mech4', 'en') + f0
    add(sfx, w, click(), 0.25); add(sfx, w + 0.05, hiss(0.6, 2500), 0.05)
lk = cue('mech4', 'lock')
for k in range(4): add(sfx, lk + 0.6 + k * 0.15, click(), 0.25)
add(sfx, lk + 0.45, thud(), 0.25)
add(sfx, cue('mech4', 'stop0') + 1.7, chime(784), 0.09)
w = word('mech4', 'test', 'кездейсоқ') or cue('mech4', 'test') + 2
add(sfx, w, click(), 0.3); add(sfx, w + 0.15, buzzer(0.4), 0.07)
add(sfx, cue('mech4', 'ban'), thud(), 0.35); add(sfx, cue('mech4', 'ban'), buzzer(0.5), 0.06)
d5 = M['mech5']['end'] - M['mech5']['start']; t5 = rel('mech5', 'test')
add(sfx, M['mech5']['start'], motor(d5, [(t5 + 0.8, t5 + 2.6, 0, 1)]), 0.06)
for k in range(3): add(sfx, M['mech5']['start'] + 1.2 + k * 0.7, click(), 0.12)
for n in ('құралдар', 'қорғаныш', 'адамдар', 'бұғаттарды'):
    w = word('mech5', None, n)
    if w: add(sfx, w + 0.5, blip(1100, 0.14), 0.07)
for n in ('қысым', 'діріл', 'шу', 'температура'):
    w = word('mech5', 'params', n)
    if w: add(sfx, w + 0.5, blip(1300, 0.14), 0.07)
add(sfx, cue('mech5', 'ok') + 0.3, thud(), 0.35); add(sfx, cue('mech5', 'ok') + 0.35, chime(1046.5), 0.1)
# alcohol & drugs
for k, c_ in enumerate(('a1', 'a2', 'a3')):
    add(sfx, cue('alc', c_) - 0.1, whoosh(0.5, 400, 3000), 0.06)
    add(sfx, cue('alc', c_) + 0.5, thud(), 0.3)
a4 = cue('alc', 'a4')
for k in range(5): add(sfx, a4 + 0.1 + k * 0.45, thud() * 0.5, 0.1)
add(sfx, a4 + 2.3, blip(1500, 0.2), 0.1); add(sfx, a4 + 2.4, chime(988), 0.1)
w = word('alc', 'a5', 'басшыға') or cue('alc', 'a5') + 2.5
add(sfx, w, blip(1800, 0.12), 0.12); add(sfx, w + 0.15, blip(1800, 0.12), 0.12)
add(sfx, cue('alc', 'a6'), chime(1046.5), 0.1); add(sfx, cue('alc', 'a6') + 0.12, chime(1318.5), 0.07)

# final 2
add(sfx, SC['final2']['start'] + 0.5, impact() * 0.6, 0.3)
add(sfx, cue('final2', 'slogan'), chime(1046.5), 0.12)
add(sfx, cue('final2', 'slogan') + 0.1, chime(1318.5), 0.08)

# ---------------- MIX ----------------
with wave.open(os.path.join(ROOT, 'build', 'voice.wav')) as wf:
    voice = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float64) / 32768
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
# ducking envelope from the voice
a = np.abs(voice)
# smooth: attack fast, release slow (computed on 10ms blocks)
blk = SR // 100
lv = np.array([a[i:i + blk].mean() for i in range(0, N, blk)])
duck = np.zeros_like(lv); cur = 0
for i, v in enumerate(lv):
    target = 1.0 if v > 0.02 else 0.0
    cur = cur + (target - cur) * (0.5 if target > cur else 0.04)
    duck[i] = cur
duck = np.repeat(duck, blk)[:N]
music_g = 0.32 * (1 - 0.5 * duck)  # music ~ -10dB, ducked further ~ -6dB under voice
sfx_g = 0.7 * (1 - 0.25 * duck)
music /= np.max(np.abs(music)) + 1e-9
sfx /= np.percentile(np.abs(sfx), 99.99) + 1e-9
mixL = voice * 1.0 + music * music_g + sfx * sfx_g * 0.5
# subtle stereo width: music/sfx slightly decorrelated
d = int(0.012 * SR)
music_r = np.concatenate([np.zeros(d), music[:-d]])
mixR = voice * 1.0 + music_r * music_g + sfx * sfx_g * 0.5
st = np.stack([mixL, mixR], 1)
st /= np.max(np.abs(st)) / 0.95
with wave.open(os.path.join(ROOT, 'build', 'mix_raw.wav'), 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    wf.writeframes((st * 32767).astype(np.int16).tobytes())
# keep stems for inspection
for name, sig in (('music', music * music_g), ('sfx', sfx * sfx_g * 0.5)):
    with wave.open(os.path.join(ROOT, 'build', f'{name}.wav'), 'wb') as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((np.clip(sig, -1, 1) * 32767).astype(np.int16).tobytes())
print('ok', DUR)
