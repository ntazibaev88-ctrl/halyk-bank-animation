"""Procedural score: orchestral strings, horns, choir, timpani and Kazakh dombra.

Everything is synthesised with numpy/scipy so the build needs no samples.
Grid: 4/4 at 120 BPM, one bar = 2 s, so every chapter boundary
(14, 30, 46, 64, 80, 96, 112, 130 s) falls on a bar line.

Writes build/out/music.wav (48 kHz stereo).
"""
import os
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
LENGTH = 134.0                      # 130 s + reverb tail (trimmed in the mix)
N = int(SR * LENGTH)
BAR, BEAT = 2.0, 0.5
rng = np.random.default_rng(1991)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "out")

dry = np.zeros((2, N))
wet = np.zeros((2, N))              # reverb send


def t_of(bar, beat=0.0):
    return bar * BAR + beat * BEAT


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7,
        "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def n(name):
    """'D4' -> midi."""
    p, o = name[:-1], int(name[-1])
    return 12 * (o + 1) + NOTE[p]


def place(sig, t0, gain=1.0, pan=0.0, send=0.3):
    """Mix a mono signal into the stereo buses at time t0 (seconds)."""
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    dry[0, i:i + len(sig)] += sig * l * (1 - send * 0.5)
    dry[1, i:i + len(sig)] += sig * r * (1 - send * 0.5)
    wet[0, i:i + len(sig)] += sig * l * send
    wet[1, i:i + len(sig)] += sig * r * send


def env_adsr(length, a, d, s, r, curve=1.0):
    t = np.arange(length) / SR
    dur = length / SR
    e = np.where(t < a, (t / max(a, 1e-4)) ** curve,
                 np.where(t < a + d, 1 - (1 - s) * (t - a) / max(d, 1e-4), s))
    rel_start = max(dur - r, a)
    e = np.where(t > rel_start, e * np.clip(1 - (t - rel_start) / max(r, 1e-4), 0, 1), e)
    return e


# ---------------------------------------------------------------- oscillators
TABLE = 4096
_tables = {}


def saw_table(max_freq):
    """Band-limited saw cycle for fundamentals up to max_freq."""
    key = int(max_freq)
    if key not in _tables:
        h = max(1, int((SR / 2 * 0.9) / max_freq))
        ph = np.arange(TABLE) / TABLE * 2 * np.pi
        w = np.zeros(TABLE)
        for k in range(1, h + 1):
            w += np.sin(k * ph) / k
        _tables[key] = w / np.abs(w).max()
    return _tables[key]


def saw(freq):
    """freq: array of instantaneous frequency (Hz)."""
    fmax = float(np.max(freq))
    tab = saw_table(2 ** np.ceil(np.log2(fmax)))
    phase = (np.cumsum(freq) / SR + rng.random()) % 1.0
    idx = phase * TABLE
    i0 = idx.astype(int)
    frac = idx - i0
    return tab[i0] * (1 - frac) + tab[(i0 + 1) % TABLE] * frac


def lowpass(x, fc, order=2):
    b, a = signal.butter(order, min(fc, SR * 0.45) / (SR / 2))
    return signal.lfilter(b, a, x)


def highpass(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), btype="high")
    return signal.lfilter(b, a, x)


def bandpass(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], btype="band")
    return signal.lfilter(b, a, x)


# ---------------------------------------------------------------- instruments
def strings(midi, dur, att=0.6, rel=0.9, bright=2600, voices=5, vib=0.12):
    L = int((dur + rel) * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    out = np.zeros(L)
    for v in range(voices):
        det = (v - (voices - 1) / 2) * 0.07          # semitones spread
        vrate = 5.0 + rng.random() * 0.8
        vdepth = vib * np.clip((t - 0.35) / 0.6, 0, 1)
        f = f0 * 2 ** ((det + vdepth * np.sin(2 * np.pi * vrate * t + rng.random() * 6)) / 12)
        out += saw(f)
    out = lowpass(out, bright, 2) + 0.35 * lowpass(out, bright * 0.35, 1)
    out *= env_adsr(L, att, 0.3, 0.85, rel, curve=1.6)
    return out / voices


def staccato(midi, dur=0.22, bright=3200):
    L = int((dur + 0.15) * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    out = sum(saw(np.full(L, f0 * 2 ** (d / 1200))) for d in (-8, 0, 7))
    out = lowpass(out, bright, 2)
    e = np.minimum(t / 0.012, 1) * np.exp(-t * 7)
    return out * e / 3


def brass(midi, dur, att=0.18, rel=0.5):
    L = int((dur + rel) * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    vib = 0.06 * np.clip((t - 0.4) / 0.5, 0, 1) * np.sin(2 * np.pi * 5.3 * t)
    raw = sum(saw(f0 * 2 ** ((vib + d) / 12)) for d in (-0.05, 0.0, 0.06)) / 3
    e = env_adsr(L, att, 0.4, 0.8, rel, curve=1.3)
    dull, bright = lowpass(raw, 700, 2), lowpass(raw, 2400, 2)
    out = dull * (1 - e) + bright * e
    return out * e


def choir(midi, dur, att=1.0, rel=1.4):
    L = int((dur + rel) * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    src = np.zeros(L)
    for v in range(6):
        d = (v - 2.5) * 0.06
        src += saw(f0 * 2 ** ((d + 0.1 * np.sin(2 * np.pi * (4.6 + v * 0.2) * t)) / 12))
    src /= 6
    out = np.zeros(L)
    for fc, bw, g in ((730, 90, 1.0), (1090, 110, 0.6), (2440, 160, 0.25), (3400, 250, 0.1)):
        out += g * bandpass(src, fc - bw, fc + bw, 2)
    out = out + 0.15 * lowpass(src, 500)
    return out * env_adsr(L, att, 0.5, 0.9, rel, curve=1.5) * 2.2


def dombra(midi, dur=1.6, bright=1.0, pos=0.18):
    """Plucked two-string lute: modal synthesis with pick transient and body."""
    L = int(dur * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    out = np.zeros(L)
    for k in range(1, 28):
        fk = f0 * k * (1 + 0.0004 * k * k)
        if fk > SR * 0.45:
            break
        amp = abs(np.sin(np.pi * k * pos)) / k ** (1.05 - 0.25 * bright)
        decay = 2.2 + 0.55 * k ** 1.3
        out += amp * np.sin(2 * np.pi * fk * t + rng.random() * 0.3) * np.exp(-decay * t)
    pick = rng.standard_normal(L) * np.exp(-t * 180) * 0.25
    out += highpass(pick, 1500)
    # wooden body resonances
    body = bandpass(out, 180, 320) * 0.5 + bandpass(out, 420, 620) * 0.35
    out = out + body
    fade = np.minimum(1, (L - np.arange(L)) / (0.03 * SR))
    return out * fade * 0.5


def timpani(midi, strength=1.0, dur=3.0):
    L = int(dur * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    out = np.zeros(L)
    for ratio, amp, dec in ((1, 1, 1.6), (1.5, 0.55, 2.5), (1.99, 0.35, 3.2), (2.44, 0.2, 4.0), (2.9, 0.12, 5.0)):
        out += amp * np.sin(2 * np.pi * f0 * ratio * t * (1 + 0.02 * np.exp(-t * 20))) * np.exp(-dec * t)
    thud = lowpass(rng.standard_normal(L), 300) * np.exp(-t * 25) * 0.8
    return (out + thud) * strength * 0.6


def timp_roll(midi, dur, start_gain=0.05, end_gain=0.8):
    L = int(dur * SR)
    sig = np.zeros(L + 3 * SR)
    hits = np.arange(0, dur, 1 / 14)
    for h in hits:
        g = start_gain + (end_gain - start_gain) * (h / dur) ** 2
        tm = timpani(midi, g * (0.85 + 0.3 * rng.random()), 1.2)
        i = int(h * SR)
        sig[i:i + len(tm)] += tm
    return sig


def drum(pitch=70, strength=1.0, dur=1.2):
    L = int(dur * SR)
    t = np.arange(L) / SR
    f = pitch * (1 + 1.2 * np.exp(-t * 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
    skin = bandpass(rng.standard_normal(L), 200, 1800) * np.exp(-t * 40) * 0.5
    return (body + skin) * strength


def bell(midi, dur=2.5, gain=1.0):
    L = int(dur * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    out = np.zeros(L)
    for ratio, amp, dec in ((1, 1, 1.4), (2.0, 0.4, 2.2), (3.01, 0.22, 3.0), (4.17, 0.12, 4.5), (5.43, 0.07, 6)):
        out += amp * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-dec * t)
    return out * np.minimum(t / 0.003, 1) * gain * 0.4


def flute(midi, dur, att=0.12, rel=0.35):
    L = int((dur + rel) * SR)
    t = np.arange(L) / SR
    f0 = mtof(midi)
    vib = 0.18 * np.clip((t - 0.25) / 0.4, 0, 1) * np.sin(2 * np.pi * 5.4 * t)
    scoop = -0.6 * np.exp(-t * 18)                      # sybyzgy-style slide into the note
    f = f0 * 2 ** ((vib + scoop) / 12)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = bandpass(rng.standard_normal(L), f0 * 0.8, min(f0 * 4, 9000)) * 0.12
    e = env_adsr(L, att, 0.2, 0.85, rel, curve=1.4)
    return (tone + breath) * e * 0.5


def noise_swell(dur, lo=800, hi=9000):
    """Reverse-cymbal style riser."""
    L = int(dur * SR)
    t = np.arange(L) / SR
    x = bandpass(rng.standard_normal(L), lo, hi)
    return x * (t / dur) ** 3


def boom(dur=4.0):
    L = int(dur * SR)
    t = np.arange(L) / SR
    sub = np.sin(2 * np.pi * np.cumsum(45 * (1 + 0.8 * np.exp(-t * 8))) / SR) * np.exp(-t * 1.3)
    hit = lowpass(rng.standard_normal(L), 900) * np.exp(-t * 9) * 0.6
    return sub + hit


def wind(dur, gain=1.0):
    L = int(dur * SR)
    t = np.arange(L) / SR
    x = rng.standard_normal(L)
    a = lowpass(x, 500, 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t + 1))
    b = bandpass(x, 900, 2400) * 0.25 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t))
    e = np.minimum(t / 2.5, 1) * np.minimum((dur - t) / 2.5, 1)
    return (a + b) * e * gain


def rumble(dur):
    L = int(dur * SR)
    t = np.arange(L) / SR
    x = lowpass(rng.standard_normal(L), 160, 2) * 3 + lowpass(rng.standard_normal(L), 1200) * 0.4
    e = np.minimum(t / 0.6, 1) * np.clip((dur - t) / (dur * 0.6), 0, 1)
    return x * e


# ---------------------------------------------------------------- harmony
CHORDS = {
    "Dm": ["D", "F", "A"], "Bb": ["Bb", "D", "F"], "F": ["F", "A", "C"], "C": ["C", "E", "G"],
    "Gm": ["G", "Bb", "D"], "A": ["A", "C#", "E"], "Am": ["A", "C", "E"], "D": ["D", "F#", "A"],
}


def chord_midi(name, low=55):
    """Close voicing of the chord at or above `low`."""
    pcs = [NOTE[x] for x in CHORDS[name]]
    out = []
    for pc in pcs:
        m = low + ((pc - low) % 12)
        out.append(m)
    return sorted(out)


def bass_note(name, octave=2):
    return 12 * (octave + 1) + NOTE[CHORDS[name][0]]


# One chord per bar (2 s). 65 bars = 130 s.
PROG = (
    ["Dm", "Dm", "Bb", "Bb", "F", "C", "C"]                    # 1 intro       0-14
    + ["Dm", "Bb", "F", "C", "Dm", "Bb", "Gm", "A"]            # 2 independence 14-30
    + ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"]              # 3 Astana      30-46
    + ["Dm", "Dm", "Bb", "Bb", "C", "C", "Dm", "Bb", "A"]      # 4 economy     46-64
    + ["Bb", "F", "C", "Dm", "Bb", "F", "C", "C"]              # 5 science     64-80
    + ["Dm", "C", "Bb", "A", "Dm", "C", "Bb", "A"]             # 6 sport/culture 80-96
    + ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"]              # 7 nature      96-112
    + ["Bb", "C", "Dm", "Bb", "F", "C", "Bb", "C", "F"]        # 8 finale      112-130
)
assert len(PROG) == 65


def section(bar):
    edges = [0, 7, 15, 23, 32, 40, 48, 56, 65]
    for i in range(8):
        if edges[i] <= bar < edges[i + 1]:
            return i + 1
    return 8


# ---------------------------------------------------------------- arrangement
def pads():
    """Sustained string bed + basses following the progression."""
    for bar, ch in enumerate(PROG):
        sec = section(bar)
        t0 = t_of(bar)
        level = {1: 0.30, 2: 0.34, 3: 0.40, 4: 0.40, 5: 0.34, 6: 0.38, 7: 0.32, 8: 0.55}[sec]
        if sec == 8 and bar < 58:
            level = 0.38 + 0.08 * (bar - 56)
        dur = BAR + 0.15
        if bar == 64:
            dur = 5.0                                      # final chord rings out
        voicing = chord_midi(ch, 57 if sec != 5 else 62)
        for i, m in enumerate(voicing):
            place(strings(m, dur, att=0.5 if bar % 2 else 0.7, bright=2200 if sec in (1, 7) else 3000),
                  t0, level, pan=(i - 1) * 0.45, send=0.45)
        place(strings(bass_note(ch, 2), dur, att=0.4, bright=900, voices=3), t0, level * 1.3, pan=0, send=0.3)
        if sec in (3, 4, 6, 8):
            place(strings(bass_note(ch, 1), dur, att=0.4, bright=500, voices=3), t0, level * 0.8, send=0.2)
        # high violins in the bigger sections
        if sec in (3, 8) or (sec == 2 and bar >= 11):
            top = chord_midi(ch, 74)
            for m in top[1:]:
                place(strings(m, dur, att=0.8, bright=4200, vib=0.16), t0, level * 0.45, pan=0.6, send=0.6)


def ostinato(bars, pattern, level, octave_low=50):
    """Staccato string figure on chord tones; pattern = list of (beat, tone index)."""
    for bar in bars:
        ch = PROG[bar]
        notes = chord_midi(ch, octave_low)
        notes = notes + [notes[0] + 12]
        for beat, idx in pattern:
            place(staccato(notes[idx]), t_of(bar, beat), level * (1.15 if beat == 0 else 1), pan=-0.3, send=0.25)


THEME = [  # (bar offset, beat, beats, note)
    (0, 0, 1.5, "A4"), (0, 1.5, 0.5, "D5"), (0, 2, 1, "E5"), (0, 3, 1, "F5"),
    (1, 0, 1, "E5"), (1, 1, 0.5, "D5"), (1, 1.5, 0.5, "C5"), (1, 2, 2, "D5"),
    (2, 0, 1.5, "C5"), (2, 1.5, 0.5, "F5"), (2, 2, 1, "A5"), (2, 3, 1, "G5"),
    (3, 0, 1, "F5"), (3, 1, 1, "E5"), (3, 2, 2, "C5"),
    (4, 0, 1.5, "D5"), (4, 1.5, 0.5, "E5"), (4, 2, 1, "F5"), (4, 3, 1, "A5"),
    (5, 0, 2, "G5"), (5, 2, 1, "F5"), (5, 3, 1, "D5"),
    (6, 0, 1, "E5"), (6, 1, 1, "G5"), (6, 2, 2, "E5"),
    (7, 0, 4, "D5"),
]

FINALE = [
    (0, 0, 1, "F4"), (0, 1, 1, "Bb4"), (0, 2, 2, "D5"),
    (1, 0, 1, "E5"), (1, 1, 1, "D5"), (1, 2, 2, "C5"),
    (2, 0, 1.5, "D5"), (2, 1.5, 0.5, "E5"), (2, 2, 2, "F5"),
    (3, 0, 1, "F5"), (3, 1, 1, "G5"), (3, 2, 1, "F5"), (3, 3, 1, "D5"),
    (4, 0, 2, "A5"), (4, 2, 1, "G5"), (4, 3, 1, "F5"),
    (5, 0, 2, "G5"), (5, 2, 1, "E5"), (5, 3, 1, "C5"),
    (6, 0, 1.5, "D5"), (6, 1.5, 0.5, "F5"), (6, 2, 2, "Bb5"),
    (7, 0, 2, "A5"), (7, 2, 2, "G5"),
    (8, 0, 8, "F5"),
]


def melody(seq, start_bar, inst, level, shift=0, pan=0.1, send=0.45, max_bars=99):
    for bo, beat, beats, name in seq:
        if bo >= max_bars:
            continue
        m = n(name) + shift
        t0 = t_of(start_bar + bo, beat)
        d = beats * BEAT
        if inst == "strings":
            s = strings(m, d, att=0.15, rel=0.5, bright=3800, voices=6, vib=0.2)
        elif inst == "brass":
            s = brass(m, d)
        elif inst == "flute":
            s = flute(m, d)
        elif inst == "choir":
            s = choir(m, d, att=0.4, rel=1.0)
        place(s, t0, level, pan=pan, send=send)


def dombra_phrase(notes, level=0.9, pan=-0.15):
    """notes: (time_s, midi, dur). Each pluck also rings the open drone string."""
    for t0, m, d in notes:
        place(dombra(m, d, bright=1.0), t0, level, pan=pan, send=0.3)


def dombra_strum(bars, level, melody_notes=None):
    """Kuy-style gallop strum: hits on 0, .5, .75 of every beat (down, up, down)."""
    for bar in bars:
        ch = PROG[bar]
        root = 12 * 4 + NOTE[CHORDS[ch][0]]                 # octave 3
        if root > n("G3"):
            root -= 12
        fifth = root + 7
        for beat in range(4):
            for k, (off, g) in enumerate(((0, 1.0), (0.5, 0.6), (0.75, 0.75))):
                t0 = t_of(bar, beat + off)
                acc = 1.15 if (beat in (0, 2) and k == 0) else 1.0
                up = k == 1
                place(dombra(root, 0.5, bright=0.6), t0 + (0.012 if up else 0), level * g * acc * 0.8, pan=-0.25, send=0.22)
                place(dombra(fifth + 12 if bar % 2 else fifth, 0.5, bright=0.9), t0 + (0 if up else 0.012),
                      level * g * acc, pan=-0.1, send=0.22)


def build():
    # ------------------------------------------------ 1. Intro (bars 0-6)
    place(wind(16, 0.5), 0.0, 0.5, send=0.2)
    pads()
    intro = [(2.0, "A4", 1.2), (2.75, "D5", 1.0), (3.5, "E5", 0.8), (4.0, "F5", 1.4), (5.0, "E5", 0.8), (5.5, "D5", 1.8),
             (7.0, "C5", 1.0), (7.5, "D5", 0.9), (8.0, "A4", 1.6), (9.5, "G4", 0.8), (10.0, "A4", 2.2),
             (11.5, "D5", 0.9), (12.0, "C5", 0.9), (12.5, "A4", 1.8)]
    dombra_phrase([(t, n(m), d) for t, m, d in intro], level=0.85)
    dombra_phrase([(t, n("D4"), 1.4) for t in (2.0, 4.0, 5.5, 8.0, 10.0, 12.5)], level=0.35, pan=-0.3)
    place(noise_swell(2.6, 600, 7000), 11.4, 0.12, send=0.6)
    place(timp_roll(n("D2"), 1.8, 0.03, 0.45), 12.2, 0.7, send=0.4)

    # ------------------------------------------------ 2. Independence (bars 7-14)
    place(boom(5), 14.0, 0.55, send=0.5)
    place(timpani(n("D2"), 1.0), 14.0, 0.8, send=0.4)
    for bar in range(7, 15):                                 # winter sparkle
        for beat in (0, 1.5, 2.5, 3.5):
            ch = chord_midi(PROG[bar], 79)
            place(bell(ch[int(rng.integers(3))], 2.5), t_of(bar, beat), 0.16, pan=rng.uniform(-0.6, 0.6), send=0.7)
    melody(THEME, 11, "brass", 0.32, shift=-12, max_bars=4, pan=0.15)
    place(timp_roll(n("A1"), 1.9, 0.05, 0.6), 28.0, 0.7, send=0.4)
    place(noise_swell(2.0), 28.0, 0.15, send=0.6)

    # ------------------------------------------------ 3. Astana (bars 15-22)
    place(timpani(n("F2"), 0.9), 30.0, 0.7, send=0.4)
    ostinato(range(15, 23), [(0, 0), (0.5, 1), (1, 2), (1.5, 1), (2, 0), (2.5, 1), (3, 2), (3.5, 3)], 0.18)
    for bar in range(15, 23):
        notes = chord_midi(PROG[bar], 72) + [chord_midi(PROG[bar], 72)[0] + 12]
        for i, beat in enumerate((0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5)):
            place(bell(notes[(i * 3) % 4], 1.6), t_of(bar, beat), 0.09, pan=0.4, send=0.5)
    melody(THEME, 19, "strings", 0.16, pan=0.25, max_bars=4)
    place(noise_swell(2.0), 44.0, 0.13, send=0.6)

    # ------------------------------------------------ 4. Economy (bars 23-31)
    place(boom(4), 46.0, 0.45, send=0.4)
    ostinato(range(23, 32), [(b * 0.25, (0, 0, 1, 0, 2, 0, 1, 0)[int(b) % 8]) for b in range(16)], 0.16, octave_low=45)
    for bar in range(23, 32):
        for beat in (0, 2):
            place(drum(62, 1.0), t_of(bar, beat), 0.32, send=0.25)
        place(drum(90, 0.6), t_of(bar, 3), 0.22, pan=0.3, send=0.25)
        place(drum(90, 0.5), t_of(bar, 3.5), 0.16, pan=0.3, send=0.25)
        if bar % 2 == 1:
            m = bass_note(PROG[bar], 3)
            place(brass(m, 0.6, att=0.04, rel=0.3), t_of(bar, 0), 0.22, send=0.35)
            place(brass(m + 7, 0.6, att=0.04, rel=0.3), t_of(bar, 0), 0.18, send=0.35)
    melody(THEME, 27, "brass", 0.24, shift=-12, max_bars=4, pan=-0.1)
    place(noise_swell(2.0), 62.0, 0.14, send=0.6)

    # ------------------------------------------------ 5. Science (bars 32-39)
    place(rumble(6.5), 64.6, 0.45, send=0.3)               # rocket launch
    for bar in range(32, 40):
        notes = chord_midi(PROG[bar], 69)
        arp = notes + [notes[0] + 12, notes[1] + 12, notes[2] + 12]
        seq = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3]
        for i, k in enumerate(seq):
            place(bell(arp[k], 1.2), t_of(bar, i * 0.25), 0.075, pan=np.sin(i) * 0.5, send=0.55)
    melody(THEME, 36, "choir", 0.18, max_bars=4, pan=0.0, send=0.7)
    place(noise_swell(2.0), 78.0, 0.14, send=0.6)

    # ------------------------------------------------ 6. Sports & culture (bars 40-47)
    place(timpani(n("D2"), 1.0), 80.0, 0.8, send=0.4)
    dombra_strum(range(40, 48), 0.42)
    for bar in range(40, 48):
        for beat, p, g in ((0, 64, 1.0), (1.5, 80, 0.6), (2, 64, 0.9), (3, 80, 0.7), (3.5, 80, 0.5)):
            place(drum(p, g), t_of(bar, beat), 0.3 if bar < 44 else 0.18, pan=0.2, send=0.25)
    melody(THEME, 40, "strings", 0.15, pan=0.3, max_bars=4)
    tune = [(0, 0, 1, "D5"), (0, 1, 0.5, "F5"), (0, 1.5, 0.5, "E5"), (0, 2, 2, "D5"),
            (1, 0, 1, "C5"), (1, 1, 1, "E5"), (1, 2, 2, "G5"),
            (2, 0, 1, "F5"), (2, 1, 0.5, "E5"), (2, 1.5, 0.5, "D5"), (2, 2, 2, "F5"),
            (3, 0, 2, "E5"), (3, 2, 2, "C#5")]
    dombra_phrase([(t_of(44 + bo, b + s * 0.25), n(m), 0.7) for bo, b, bl, m in tune for s in range(int(bl * 4))], 0.32, pan=0.1)
    place(noise_swell(2.0), 94.0, 0.12, send=0.6)

    # ------------------------------------------------ 7. Nature & heritage (bars 48-55)
    place(wind(16, 0.35), 96.0, 0.35, send=0.3)
    melody(THEME, 48, "flute", 0.42, pan=-0.05, send=0.55)
    for bar in range(48, 56):
        notes = chord_midi(PROG[bar], 62)
        for i, beat in enumerate((0, 0.75, 1.5, 2.25, 3.0)):
            place(dombra(notes[i % 3] + (12 if i > 2 else 0), 1.4, bright=0.5), t_of(bar, beat), 0.22, pan=0.35, send=0.5)

    # ------------------------------------------------ 8. Finale (bars 56-64)
    place(timp_roll(n("F2"), 4.0, 0.05, 0.7), 112.0, 0.75, send=0.4)
    place(noise_swell(4.0), 112.0, 0.16, send=0.6)
    place(boom(5), 116.0, 0.6, send=0.5)
    for bar in range(58, 65):
        place(timpani(bass_note(PROG[bar], 2), 1.0), t_of(bar), 0.75, send=0.4)
        if bar < 64:
            place(timpani(bass_note(PROG[bar], 2), 0.6), t_of(bar, 2.5), 0.5, send=0.4)
    melody(FINALE, 56, "strings", 0.36, pan=0.2, send=0.5)
    melody([(bo, b, l, x) for bo, b, l, x in FINALE if bo >= 2], 56, "brass", 0.26, shift=-12, pan=-0.2, send=0.5)
    for bar in range(58, 65):
        for m in chord_midi(PROG[bar], 64):
            place(choir(m, BAR + (3 if bar == 64 else 0.2), att=0.6), t_of(bar), 0.16, send=0.7)
    dombra_strum(range(57, 64), 0.5)
    for t0, m in ((t_of(64), "F3"), (t_of(64), "C4"), (t_of(64, 0.02), "F4")):
        place(dombra(n(m), 3.0, bright=1.0), t0, 0.8, send=0.5)
    place(boom(5), 128.0, 0.5, send=0.6)


def reverb_ir(seconds=2.8):
    L = int(seconds * SR)
    t = np.arange(L) / SR
    ir = np.zeros((2, L))
    for c in range(2):
        x = rng.standard_normal(L) * np.exp(-t * 6.9 / seconds)
        x = lowpass(x, 6000, 1)
        x[: int(0.012 * SR)] = 0                           # pre-delay
        ir[c] = x / np.sqrt(np.sum(x ** 2))
    return ir


def main():
    build()
    ir = reverb_ir()
    rev = np.stack([signal.fftconvolve(wet[c], ir[c])[:N] for c in range(2)])
    mix = dry + rev * 0.9
    mix = highpass(mix, 28, 2)
    peak = np.abs(mix).max()
    mix = mix / peak * 0.89
    os.makedirs(OUT, exist_ok=True)
    wavfile.write(os.path.join(OUT, "music.wav"), SR, (mix.T * 32767).astype(np.int16))
    print("music.wav written, peak normalised from", round(float(peak), 3))


if __name__ == "__main__":
    main()
