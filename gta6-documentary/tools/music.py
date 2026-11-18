"""Original procedural score for the 80 s documentary (no third-party samples).

120 BPM grid (beat = 0.5 s, bar = 2 s) so every whole second of the edit lands
on a beat. D minor, dark/modern synth palette. Sections follow the narration:

  0-10   intro: sub drone, dark pad, heartbeat pulse
  10-23  characters: chord pad + soft 16th pluck arp
  23-37  Vice City: half-time groove, bass, brighter arp
  37-51  world: groove variation, wider chords
  51-66  expectations: breakdown -> build, rising filter, snare roll
  66-80  final: big pad, slow pulse, last hit, tail

Writes audio/music.wav (48 kHz stereo).
"""
import os
import numpy as np
from dsp import *

DUR = 80.0
BEAT = 0.5
BAR = 2.0
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "audio", "music.wav")
rng = np.random.default_rng(1)

N = int(DUR * SR)
T = np.arange(N) / SR

CHORDS = {
    "Dm": ["D3", "F3", "A3", "D4", "F4"],
    "Bb": ["Bb2", "D3", "F3", "Bb3", "D4"],
    "F":  ["F2", "C3", "F3", "A3", "C4"],
    "C":  ["C3", "E3", "G3", "C4", "E4"],
    "Gm": ["G2", "D3", "G3", "Bb3", "D4"],
    "A":  ["A2", "E3", "A3", "C#4", "E4"],
    "Am": ["A2", "E3", "A3", "C4", "E4"],
}
ROOT = {"Dm": "D1", "Bb": "Bb0", "F": "F1", "C": "C1", "Gm": "G1", "A": "A0", "Am": "A0"}

# Section downbeats follow the edit (first shot of each section), snapped to the beat grid.
import json as _json
_tlp = os.path.join(HERE, "..", "build", "timeline.json")
_secs = {x["id"]: x["start"] for x in _json.load(open(_tlp))["sections"]} if os.path.exists(_tlp) else {}
_q = lambda v: round(v / BEAT) * BEAT
T1 = _q(_secs.get("characters", 10.0) + 0.27)   # +0.27: section start -> first cut
T2 = _q(_secs.get("vicecity", 23.0) + 0.2)
T3 = _q(_secs.get("world", 37.0) + 0.2)
T4 = _q(_secs.get("expectations", 51.0) + 0.2)
T5 = _q(_secs.get("final", 66.0) + 0.2)
TB = _q(T4 + (T5 - T4) * 0.55)                  # build starts inside the expectations section

# (start, end, chord)
PROG = []
def fill(a, b, chords):
    n = len(chords)
    step = max(BEAT, _q((b - a) / n))
    t = a
    for k, c in enumerate(chords):
        e = b if k == n - 1 else min(b, t + step)
        PROG.append((t, e, c))
        t = e

fill(0, T1, ["Dm"])
fill(T1, T2, ["Bb", "F", "C", "Dm"])
fill(T2, T3, ["Dm", "Bb", "F", "C", "Dm", "Gm"])
fill(T3, T4, ["Bb", "Gm", "Dm", "A", "Bb", "Gm", "A"])
fill(T4, T5, ["Bb", "F", "Gm", "Dm", "Bb", "C", "A"])
fill(T5, DUR, ["Dm", "Bb", "Gm", "A", "Dm", "Dm"])

def chord_at(tt):
    for s, e, c in PROG:
        if s <= tt < e:
            return c
    return "Dm"


def stereo():
    return np.zeros((N, 2))


# ------------------------------------------------------------------ layers
def drone():
    """Sub + low fifth drone, slowly breathing."""
    out = stereo()
    d = midi_hz(n2m("D1"))
    x = 0.55 * sine(d, DUR) + 0.25 * sine(d * 1.5, DUR) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * T))
    x += 0.18 * lp(saw(d * 2 * (1 + 0.002 * np.sin(2 * np.pi * 0.11 * T)), DUR), 220)
    g = np.interp(T, [0, 1.5, T1, T2, T3, T4, TB, T5, T5 + 0.5, 77, 80],
                  [0, 1.0, 0.9, 0.55, 0.5, 0.7, 0.9, 1.0, 1.0, 0.8, 0])
    out += np.stack([x * g, x * g], 1)
    return out


def pad():
    """Detuned saw pad following the chords, slow filter movement."""
    out = stereo()
    for s, e, c in PROG:
        dur = e - s + 1.2
        n = int(round(dur * SR))
        seg = np.zeros((n, 2))
        for k, note in enumerate(CHORDS[c]):
            f = midi_hz(n2m(note))
            for det, p in ((-0.11, -0.7), (0.0, 0.0), (0.12, 0.7)):
                ff = f * 2 ** (det / 12)
                v = saw(ff * (1 + 0.0015 * np.sin(2 * np.pi * (0.2 + 0.05 * k) * t_axis(dur))), dur,
                        phase=rng.random())
                seg += pan(v, p * 0.8) * 0.06
        tt = t_axis(dur) + s
        cut = np.interp(tt, [0, T1, T2, T3, T4, TB, T5 - 0.1, T5, 75, 80],
                        [500, 900, 1400, 1800, 700, 1600, 3800, 2400, 1200, 500])
        seg[:, 0] = sweep_filter(seg[:, 0], cut, q=0.8)
        seg[:, 1] = sweep_filter(seg[:, 1], cut, q=0.8)
        seg *= env_adsr(n, 0.6, 0.3, 0.85, 1.2)[:, None]
        place(out, seg, s)
    return out


def pluck_arp(start, end, octave_up=0, bright=1800, level=0.11):
    """16th-note arpeggio of chord tones, plucky envelope."""
    out = stereo()
    step = BEAT / 4
    pattern = [0, 2, 1, 3, 2, 4, 3, 1]
    i = 0
    tt = start
    while tt < end - 1e-6:
        c = chord_at(tt)
        notes = CHORDS[c][1:]
        m = n2m(notes[pattern[i % len(pattern)] % len(notes)]) + 12 + 12 * octave_up
        dur = 0.32
        f = midi_hz(m)
        x = 0.6 * saw(f, dur) + 0.4 * tri(f * 2, dur)
        e = env_exp(len(x), 0.09)
        acc = 1.0 if i % 4 == 0 else 0.7
        x = lp(x * e, bright * (0.6 + 0.4 * acc)) * acc
        place(out, pan(x, 0.35 * np.sin(i * 0.7)), tt)
        tt += step
        i += 1
    out = delay(out, BEAT * 0.75, fb=0.4, mix=0.35)
    return out * level


def kick(level=1.0):
    d = 0.45
    tt = t_axis(d)
    f = 45 + 95 * np.exp(-tt / 0.035)
    x = sine(f, d) * env_exp(len(tt), 0.17)
    x += 0.4 * lp(noise(d, seed=3), 3000) * env_exp(len(tt), 0.004)
    return soft_clip(x * 1.4, 1.5) * level


def snare(level=1.0, seed=0):
    d = 0.35
    tt = t_axis(d)
    nz = bp(noise(d, seed=seed), 900, 6500) * env_exp(len(tt), 0.07)
    body = sine(185 * (1 + 0.3 * np.exp(-tt / 0.01)), d) * env_exp(len(tt), 0.05)
    # clap-style multi-burst
    burst = np.zeros(len(tt))
    for k, off in enumerate((0, 0.011, 0.023)):
        i = int(off * SR)
        burst[i:] += bp(noise(d, seed=seed + k + 10), 1100, 3200)[: len(tt) - i] * env_exp(len(tt) - i, 0.012)
    return (0.55 * nz + 0.35 * body + 0.5 * burst) * level


def hat(level=1.0, open_=False, seed=0):
    d = 0.25 if open_ else 0.07
    x = hp(noise(d, seed=seed), 7500, order=3) * env_exp(int(round(d * SR)), 0.06 if open_ else 0.014)
    return x * level


def drums(start, end, kick_pat, snare_beats, hats=True, level=1.0, skip_kick_after=None):
    out = stereo()
    kick_env = np.zeros(N)
    b = 0
    tt = start
    while tt < end - 1e-6:
        beat_in_bar = b % 4
        if (beat_in_bar in kick_pat) and not (skip_kick_after and tt >= skip_kick_after):
            place(out, kick(0.9) * level, tt)
            i = int(tt * SR)
            n = min(int(0.4 * SR), N - i)
            kick_env[i:i + n] = np.maximum(kick_env[i:i + n], np.exp(-np.arange(n) / (0.12 * SR)))
        if beat_in_bar in snare_beats:
            place(out, pan(snare(0.55, seed=b), 0.05) * level, tt)
        if hats:
            for k in range(2):
                place(out, pan(hat(0.16 if k == 0 else 0.1, seed=b * 3 + k), 0.3) * level, tt + k * BEAT / 2)
            if b % 8 == 7:
                place(out, pan(hat(0.12, open_=True, seed=b), -0.3) * level, tt + BEAT * 0.5)
        tt += BEAT
        b += 1
    return out, kick_env


def bass(start, end, level=0.32):
    out = stereo()
    rhythm = [0, 0.75, 1.5, 2.0, 3.0, 3.5]  # beats within the bar (syncopated)
    bar_t = start
    while bar_t < end - 1e-6:
        for r in rhythm:
            tt = bar_t + r * BEAT
            if tt >= end:
                break
            c = chord_at(tt)
            f = midi_hz(n2m(ROOT[c]) + 12)
            d = 0.42
            x = 0.6 * saw(f, d) + 0.7 * sine(f / 2 * 2, d)
            x = lp(x, 520) * env_adsr(len(x), 0.005, 0.12, 0.6, 0.08)
            place(out, x * level, tt)
        bar_t += BAR
    return soft_clip(out, 1.2)


def snare_roll(start, end, level=0.4):
    out = stereo()
    tt, k = start, 0
    while tt < end:
        frac = (tt - start) / (end - start)
        place(out, pan(snare(level * (0.25 + 0.75 * frac), seed=200 + k), 0.0), tt)
        step = BEAT / 2 if frac < 0.5 else BEAT / 4 if frac < 0.8 else BEAT / 8
        tt += step
        k += 1
    return out


def heartbeat(start, end, level=0.5):
    out = stereo()
    tt = start
    while tt < end:
        place(out, kick(level), tt)
        place(out, kick(level * 0.6), tt + 0.22)
        tt += BAR
    return lp(out, 400)


def bell_motif(times_notes, level=0.12):
    """Sparse glassy bell notes (FM) for mystery."""
    out = stereo()
    for tt, note in times_notes:
        f = midi_hz(n2m(note))
        d = 3.0
        ta = t_axis(d)
        mod = sine(f * 3.5, d) * 2.2 * env_exp(len(ta), 0.5)
        x = np.sin(2 * np.pi * f * ta + mod) * env_exp(len(ta), 0.9)
        place(out, pan(x, rng.uniform(-0.5, 0.5)) * level, tt)
    return out


# ------------------------------------------------------------------ arrange
def build():
    ir = make_ir(3.6, 1.0)
    mix = stereo()

    mix += drone() * 0.55
    p = pad()
    mix_pad = p * 0.9

    mix += heartbeat(0.0, T1 - 0.5, 0.55)
    mix += bell_motif([(0.2, "A5"), (2.2, "F5"), (4.2, "D5"), (6.2, "E5"), (8.0, "A4"),
                       (T4 + 0.2, "A5"), (T4 + 2.2, "G5"), (T4 + 4.2, "F5"), (T4 + 6.2, "E5"),
                       (T5 + 0.2, "D6"), (T5 + 4.2, "A5"), (T5 + 8.2, "F5")], 0.09)

    arp = pluck_arp(T1, T2 - 1.0, 0, 1500, 0.08)
    arp += pluck_arp(T2, T4 - 0.5, 0, 2600, 0.10)
    arp += pluck_arp(TB - 2.0, T5 - 0.2, 1, 3200, 0.07)
    arp += pluck_arp(T5, 77.5, 0, 2000, 0.06)

    dr1, ke1 = drums(T2, T4, kick_pat=(0,), snare_beats=(2,), level=0.9)
    # extra syncopated kick on the "and" of 2
    dr1b, ke1b = drums(T2 + BEAT * 1.5, T4, kick_pat=(0,), snare_beats=(), hats=False, level=0.55)
    dr_build, keb = drums(TB, T5, kick_pat=(0, 2), snare_beats=(2,), level=0.8)
    dr_final, kef = drums(T5, 77.0, kick_pat=(0,), snare_beats=(), hats=False, level=0.85)
    kick_env = np.maximum.reduce([ke1, ke1b * 0.6, keb, kef])

    # sidechain pump on pad/arp from the kick
    duck = 1.0 - 0.45 * kick_env
    mix_pad *= duck[:, None]
    arp *= (1.0 - 0.3 * kick_env)[:, None]

    b = bass(T2, T4) + bass(TB, T5, 0.28) + bass(T5, 76.0, 0.3)
    b *= (1.0 - 0.5 * kick_env)[:, None]

    roll = snare_roll(T5 - 3.0, T5, 0.35)

    mus = mix + mix_pad + arp + b
    mus = reverb(mus, ir, wet=0.22)
    mus += (dr1 + dr1b * 0.8 + dr_build + dr_final) + reverb(roll, ir, 0.3)

    # global arrangement envelope (breakdown dips, final tail)
    g = np.interp(T, [0, 0.05, T4 - 0.4, T4, T4 + 0.6, TB, T5 - 0.2, T5, 76, 79.2, 80],
                  [0, 1, 1, 0.55, 0.7, 0.85, 1.0, 1.0, 0.95, 0.15, 0.0])
    mus *= g[:, None]
    mus = hp(mus, 28)
    mus = soft_clip(mus * 0.9, 1.1)
    return normalize_peak(mus, -3.0)


if __name__ == "__main__":
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    m = build()
    write_wav(OUT, m)
    print("wrote", OUT, m.shape[0] / SR, "s")
