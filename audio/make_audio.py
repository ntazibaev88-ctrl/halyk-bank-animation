#!/usr/bin/env python3
"""Procedural score + SFX + timed guide voice-over for the Halyk Bank 60s spot.
Outputs (in OUT dir): music.wav, sfx.wav, vo_guide.wav, mix_novo.wav, mix_guide.wav  (48 kHz stereo)
Voice: espeak-ng Russian is a *guide track only* — replace with a real narrator (vo/ slot) for release."""
import numpy as np, wave, subprocess, sys, os, json
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
SR = 48000; DUR = 60.0; N = int(SR * DUR)
rng = np.random.default_rng(7)
t = np.arange(N) / SR

def wavwrite(path, x):
    x = np.clip(x, -1, 1); y = (x * 32767).astype('<i2')
    with wave.open(path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
def env(n, a, d, s=0.0, r=0.0, sus=None):
    e = np.ones(n); na, nd = int(a * SR), int(d * SR)
    e[:na] = np.linspace(0, 1, max(na, 1));
    if nd: e[na:na + nd] = np.linspace(1, s if s else 0, nd)[:max(0, n - na)] if s or True else e[na:na + nd]
    if nd and na + nd < n: e[na + nd:] = s
    nr = int(r * SR)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    # vectorised one-pole via lfilter-free approach (cumulative) — chunked python loop is too slow; use FFT filter
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (f / fc) ** 4); return np.fft.irfft(X, len(x))
def highpass(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 - 1 / (1 + (f / fc) ** 4); return np.fft.irfft(X, len(x))
def place(buf, x, at, gain=1.0, pan=0.0):
    i = int(at * SR); n = min(len(x), buf.shape[1] - i)
    if n <= 0 or i < 0: return
    buf[0, i:i + n] += x[:n] * gain * (1 - max(0, pan)); buf[1, i:i + n] += x[:n] * gain * (1 + min(0, pan))
def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ------------------------------------------------------------ MUSIC (C major / A minor feel, 100 BPM)
BPM = 100; beat = 60 / BPM
music = np.zeros((2, N))
prog_ = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]   # Am F C G
bar = 4 * beat
def pad(notes, dur, detune=.003):
    n = int(dur * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    for m in notes:
        f = midi(m)
        for d in (-1, 0, 1):
            y += np.sin(2 * np.pi * f * (1 + d * detune) * tt) + .35 * np.sin(2 * np.pi * 2 * f * (1 + d * detune) * tt) + .15 * np.sin(2 * np.pi * 3 * f * tt)
    y *= env(n, .8, 0, 1, .6) if False else np.minimum(1, np.minimum(tt / 1.0, (dur - tt) / .8))
    return y / (len(notes) * 3)
def pluck(m, dur=.45):
    n = int(dur * SR); tt = np.arange(n) / SR; f = midi(m)
    y = (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * 2 * f * tt) + .25 * np.sin(2 * np.pi * 3 * f * tt)) * np.exp(-tt * 9)
    return y
def kick():
    n = int(.35 * SR); tt = np.arange(n) / SR; f = 45 + 110 * np.exp(-tt * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 9)
def hat(open_=False):
    n = int((.25 if open_ else .06) * SR); y = highpass(rng.standard_normal(n), 7000); return y * np.exp(-np.arange(n) / SR * (14 if open_ else 70))
def bass(m, dur):
    n = int(dur * SR); tt = np.arange(n) / SR; f = midi(m); y = np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * 2 * f * tt)
    return y * np.minimum(1, np.minimum(tt / .02, (dur - tt) / .08)) * .8

nbars = int(DUR / bar) + 1
# energy sections (seconds): intro 0-7, verse 7-23, build 23-43, drive 43-53, finale 53-60
def lvl(sec):
    return {'pad': 1.0, 'arp': 0 if sec < 3 else 1, 'beat': 0 if sec < 7 else 1, 'bass': 0 if sec < 7 else 1, 'hat': 0 if sec < 23 else 1}
for b in range(nbars):
    t0 = b * bar
    if t0 >= 58.5: break
    root, ch = prog_[b % 4]
    L = lvl(t0)
    place(music, pad([n + 12 for n in ch] + [root - 12], min(bar + 1.2, DUR - t0)), t0, .20)
    if t0 >= 1 and t0 < 56.5:
        seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24, ch[2] + 12, ch[1] + 12, ch[0] + 24, ch[1] + 12]
        for k, m in enumerate(seq):
            ga = .10 * min(1, (t0 - 1) / 6) + (.05 if t0 >= 23 else 0)
            place(music, pluck(m), t0 + k * beat / 2, ga, pan=((k % 4) - 1.5) * .25)
    if L['bass'] and t0 < 56.5:
        for k in range(4): place(music, bass(root - 12, beat * .9), t0 + k * beat, .32)
    if L['beat'] and t0 < 53:
        for k in range(4):
            place(music, kick(), t0 + k * beat, .55 if t0 >= 23 else .38)
            if L['hat']:
                place(music, hat(), t0 + k * beat + beat / 2, .10); place(music, hat(), t0 + k * beat + beat / 4, .04)
        if t0 >= 23:
            for k in (1, 3): n = int(.18 * SR); sn = lowpass(highpass(rng.standard_normal(n), 1500), 7000) * np.exp(-np.arange(n) / SR * 22); place(music, sn, t0 + k * beat, .22)
# risers + impacts
def riser(dur, f0=300, f1=6000):
    n = int(dur * SR); tt = np.arange(n) / SR; nz = rng.standard_normal(n); nz = highpass(nz, 600)
    sweep = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / SR)
    return (nz * .5 + sweep * .5) * (tt / dur) ** 2.2
def impact(dur=2.5):
    n = int(dur * SR); tt = np.arange(n) / SR; f = 55 * np.exp(-tt * 1.2) + 28; y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.6)
    nz = lowpass(rng.standard_normal(n), 3000) * np.exp(-tt * 3.5) * .4; return y + nz
place(music, riser(4.0), 49.0, .22); place(music, riser(3.0), 20.0, .08); place(music, riser(1.0), 6.0, .12)
for tt_ in (7.0, 15.0, 23.0, 33.0, 43.0, 53.0): place(music, impact(2.5 if tt_ < 53 else 4.0), tt_ - .05, .35 if tt_ < 53 else .6)
# finale: bright resolving chord C major add9 with long tail
place(music, pad([60, 64, 67, 72, 74, 79], 7.0, .004), 53.0, .26)
for k, m in enumerate([72, 76, 79, 84, 79, 76, 72, 79, 84, 88]): place(music, pluck(m, .9), 53.2 + k * .22, .09, pan=(k % 3 - 1) * .3)
place(music, pluck(84, 3.0), 56.6, .12); place(music, pluck(91, 3.0), 56.9, .08)
# reverb tail (synthetic IR)
ir_n = int(2.2 * SR); ir = rng.standard_normal((2, ir_n)) * np.exp(-np.arange(ir_n) / SR * 2.4); ir[:, :int(.02 * SR)] *= np.linspace(0, 1, int(.02 * SR))
for ch_ in (0, 1):
    X = np.fft.rfft(music[ch_], N + ir_n); R = np.fft.rfft(ir[ch_], N + ir_n); wet = np.fft.irfft(X * R, N + ir_n)[:N]
    music[ch_] = music[ch_] * .78 + wet * .0075
# master fade-out of music
music *= np.minimum(1, (DUR - t) / 1.2)
music = np.tanh(music * 1.1)
wavwrite(os.path.join(OUT, 'music.wav'), music * .9)

# ------------------------------------------------------------ SFX
sfx = np.zeros((2, N))
def whoosh(dur=.9, up=True):
    n = int(dur * SR); tt = np.arange(n) / SR; nz = rng.standard_normal(n)
    bands = lowpass(highpass(nz, 400), 5000); e = np.sin(np.pi * tt / dur) ** 1.5
    fm = np.sin(2 * np.pi * np.cumsum(np.linspace(200, 1800, n) if up else np.linspace(1800, 200, n)) / SR) * .25
    return (bands * .6 + fm) * e
def ding(m=88, dur=1.2):
    n = int(dur * SR); tt = np.arange(n) / SR; f = midi(m); return (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * 2.76 * f * tt)) * np.exp(-tt * 4.5)
def pop(m=76):
    n = int(.18 * SR); tt = np.arange(n) / SR; f = midi(m) * (1 + .5 * np.exp(-tt * 40)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22)
def click(n_=.02):
    n = int(n_ * SR); return highpass(rng.standard_normal(n), 2500) * np.exp(-np.arange(n) / SR * 160)
def coin(m=96):
    n = int(.5 * SR); tt = np.arange(n) / SR; f = midi(m); return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) + .5 * np.sin(2 * np.pi * f * 1.5 * tt) * np.exp(-tt * 12))
def shimmer(dur=1.5):
    n = int(dur * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    for k in range(8): y += np.sin(2 * np.pi * midi(84 + [0, 4, 7, 12][k % 4]) * tt) * np.exp(-((tt - k * .12) ** 2) * 30) * .3
    return y
def pulse(f=420, dur=.35):
    n = int(dur * SR); tt = np.arange(n) / SR; return np.sin(2 * np.pi * f * tt) * np.sin(np.pi * tt / dur) ** 2
for b in (7.0, 15.0, 23.0, 33.0, 43.0, 53.0): place(sfx, whoosh(1.0, True), b - .5, .55)
place(sfx, shimmer(), .1, .3); place(sfx, pulse(520), 2.7, .35); place(sfx, whoosh(1.4, True), 2.7, .25)          # S1 phone lights, green wave
place(sfx, whoosh(2.3, True), 4.5, .35)                                                                         # camera zoom into phone
for i, tt_ in enumerate([4.4, 4.9, 5.4, 5.9, 6.4]): place(sfx, click(.03), 7 + tt_ + .0, .8)                    # calendar flips (S2 t=4.4..)
for k in range(5): place(sfx, click(.03), 7 + 4.4 + k * .5, .0)
place(sfx, pop(70), 7 + 3.7, .4)
place(sfx, whoosh(1.2, True), 15.5, .4)                                                                          # S3 scan
for k in range(5): place(sfx, pop(64 + k * 3), 15 + 3.7 + k * .8, .5); place(sfx, click(), 15 + 3.7 + k * .8, .5)  # evolution steps
for i in range(6): place(sfx, pop(72 + i * 2), 23 + .8 + i * .38 + .1, .45, pan=(-.4 if i < 3 else .4))          # S4 icons
place(sfx, whoosh(1.0, False), 23 + 5.5, .45)
place(sfx, pulse(880, .2), 23 + 7.15, .4); place(sfx, ding(88), 23 + 7.5, .5); place(sfx, coin(96), 23 + 7.55, .4); place(sfx, coin(100), 23 + 7.7, .3); place(sfx, coin(103), 23 + 7.85, .25)
for i, s in enumerate([.2, 3.5, 6.8]): place(sfx, whoosh(.7, True), 33 + s, .35); place(sfx, pop(72 + i * 4), 33 + s + .45, .5)
place(sfx, ding(91), 33 + 2.3, .35); place(sfx, ding(93), 33 + 3.8 + 2.0, .0); place(sfx, ding(95), 33 + 4.0 + 3.6, .3)
for i in range(9): place(sfx, pop(72 + i), 43 + .9 + i * .24, .3, pan=(i % 5 - 2) * .25)                       # S6 city pings
place(sfx, whoosh(2.0, True), 43 + 1.2, .3)
place(sfx, whoosh(3.2, True), 53.0, .5); place(sfx, shimmer(2.0), 53 + 3.4, .5); place(sfx, ding(96, 3.0), 53 + 3.9, .35); place(sfx, ding(91, 3.0), 53 + 4.7, .25)
wavwrite(os.path.join(OUT, 'sfx.wav'), sfx * .9)

# ------------------------------------------------------------ GUIDE VO (espeak-ng, Russian) — timed to scenes
VO = [
 (0.6, 6.2, 'Каждый день миллионы людей совершают выбор, который приближает их к новым возможностям.'),
 (7.6, 14.6, 'История Halyk Bank началась в далёком тысяча девятьсот двадцать третьем году. С тех пор банк прошёл большой путь вместе с Казахстаном.'),
 (15.6, 22.6, 'От первых сберегательных касс до современных цифровых решений — время меняет технологии, но потребность людей в удобстве остаётся.'),
 (23.7, 32.4, 'Сегодня цифровые сервисы Halyk помогают оплачивать услуги, переводить деньги и пользоваться банковскими возможностями онлайн.'),
 (33.6, 42.4, 'За каждой финансовой операцией стоит человек. Его планы, мечты, работа и стремление двигаться вперёд.'),
 (43.7, 52.4, 'Развивая технологии и финансовую экосистему, Halyk продолжает быть частью повседневной жизни Казахстана.'),
 (54.2, 59.2, 'Halyk Bank. История, которая продолжается вместе с людьми.'),
]
vo = np.zeros((2, N)); report = []
for i, (a, b, text) in enumerate(VO):
    wp = os.path.join(OUT, f'_vo{i}.wav'); sp = 150
    for _ in range(6):
        subprocess.run(['espeak-ng', '-v', 'ru', '-p', '18', '-s', str(sp), '-g', '1', '-w', wp, text], check=True)
        with wave.open(wp) as w: dur = w.getnframes() / w.getframerate()
        if dur <= (b - a): break
        sp = int(sp * dur / (b - a) * 1.03)
    with wave.open(wp) as w: sr0 = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768
    # resample to 48k
    xi = np.interp(np.arange(int(len(x) * SR / sr0)) / SR * sr0, np.arange(len(x)), x)
    xi = lowpass(xi, 5200); xi += .25 * np.roll(lowpass(xi, 500), 0)  # add body
    xi /= max(1e-6, np.abs(xi).max()); place(vo, xi, a, .9); report.append({'i': i + 1, 'start': a, 'end': round(a + len(xi) / SR, 2), 'speed': sp, 'text': text})
    os.remove(wp)
json.dump(report, open(os.path.join(OUT, 'vo_timing.json'), 'w'), ensure_ascii=False, indent=1)
wavwrite(os.path.join(OUT, 'vo_guide.wav'), vo)

# ------------------------------------------------------------ MIX
def duck_env():
    e = np.ones(N)
    for a, b, _ in VO:
        i0, i1 = int((a - .2) * SR), int(min(b + .5, DUR) * SR); e[i0:i1] = .42
    k = int(.25 * SR); return np.convolve(e, np.ones(k) / k, mode='same')
dk = duck_env()
mix_novo = music * .85 + sfx * .8
mix_guide = music * .85 * dk + sfx * .8 + vo * 1.15
for name, m in (('mix_novo', mix_novo), ('mix_guide', mix_guide)):
    pk = np.abs(m).max(); m = m / pk * .89; wavwrite(os.path.join(OUT, name + '.wav'), m)
print(json.dumps(report, ensure_ascii=False))
