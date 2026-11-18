"""Synthesized sound design locked to the edit (build/timeline.json).

Impacts, whooshes, risers and sub drops on the key cuts; city ambience,
waves, club thump, engine pass and a distant siren under the matching shots.
Everything is generated here (no third-party samples). Writes audio/sfx.wav.
"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from dsp import *

ROOT = os.path.join(HERE, "..")
tl = json.load(open(os.path.join(ROOT, "build", "timeline.json")))
DUR = tl["duration"]
N = int(DUR * SR)
shot = {s["id"]: s for s in tl["shots"]}
ir = make_ir(3.0, 0.9, seed=11)
rng = np.random.default_rng(5)


def impact(size=1.0):
    d = 3.0
    t = t_axis(d)
    f = 30 + 70 * np.exp(-t / 0.08)
    boom = sine(f, d) * env_exp(len(t), 0.55)
    crack = bp(noise(d, seed=1), 200, 5000) * env_exp(len(t), 0.03)
    body = lp(noise(d, seed=2), 400) * env_exp(len(t), 0.25)
    x = soft_clip(0.9 * boom + 0.35 * crack + 0.5 * body, 1.4) * size
    return reverb(x, ir, 0.3)


def whoosh(d=0.7, up=True, p_from=-0.6, p_to=0.6, seed=0):
    t = t_axis(d)
    x = noise(d, seed=seed)
    k = np.linspace(0, 1, len(t))
    fc = (300 + 4500 * k ** 1.5) if up else (4800 - 4300 * k ** 0.7)
    y = sweep_filter(x, fc, kind="band", q=1.4)
    env = np.sin(np.pi * k) ** 2.2
    y = y * env
    out = np.zeros((len(t), 2))
    for i0 in range(0, len(t), 512):
        p = p_from + (p_to - p_from) * (i0 / len(t))
        seg = y[i0:i0 + 512]
        out[i0:i0 + len(seg)] = pan(seg, p)
    return out / (np.max(np.abs(out)) + 1e-9)


def riser(d=2.5):
    t = t_axis(d)
    k = t / d
    nz = sweep_filter(noise(d, seed=9), 400 + 7000 * k ** 2, kind="band", q=1.0)
    tone = sine(110 * 2 ** (2.5 * k), d) * 0.25 + sine(165 * 2 ** (2.5 * k), d) * 0.15
    x = (nz / (np.max(np.abs(nz)) + 1e-9) * 0.6 + tone) * (k ** 2.2)
    x[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))
    return reverb(x, ir, 0.35)


def sub_drop(d=1.6):
    t = t_axis(d)
    return sine(70 * np.exp(-t / 0.5) + 28, d) * env_exp(len(t), 0.6)


def text_hit():
    d = 0.6
    t = t_axis(d)
    x = sine(55 + 40 * np.exp(-t / 0.03), d) * env_exp(len(t), 0.18) + 0.25 * hp(noise(d, seed=4), 3000) * env_exp(len(t), 0.02)
    return reverb(x, ir, 0.2)


def ambience(d, seed=0):
    """City bed: low traffic rumble + air + occasional distant horn."""
    t = t_axis(d)
    rumble = lp(noise(d, seed=seed), 180, order=2) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.13 * t))
    air = bp(noise(d, seed=seed + 1), 500, 2500) * 0.15 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t + 1))
    x = np.stack([rumble + air, lp(noise(d, seed=seed + 2), 180) + air], 1)
    for k in range(int(d // 4)):
        tt = rng.uniform(0.5, d - 1.2)
        hd = 0.55
        f0 = rng.choice([392.0, 440.0, 349.0])
        h = (saw(f0, hd) + saw(f0 * 1.26, hd)) * env_adsr(int(round(hd * SR)), 0.02, 0.1, 0.8, 0.15)
        h = lp(h, 1500) * 0.05
        place(x, pan(h, rng.uniform(-0.8, 0.8)), tt)
    return reverb(x / (np.max(np.abs(x)) + 1e-9), ir, 0.35)


def waves(d):
    t = t_axis(d)
    sw = 0.5 + 0.5 * np.sin(2 * np.pi * t / 2.6 - np.pi / 2)
    x = np.stack([lp(noise(d, seed=21), 900) * sw, lp(noise(d, seed=22), 900) * np.roll(sw, int(0.3 * SR))], 1)
    return reverb(x / (np.max(np.abs(x)) + 1e-9), ir, 0.3)


def club_thump(d):
    out = np.zeros((int(round(d * SR)), 2))
    t = 0.0
    while t < d:
        k = t_axis(0.3)
        kick = sine(50 + 60 * np.exp(-k / 0.03), 0.3) * env_exp(len(k), 0.12)
        place(out, kick, t)
        t += 60 / 124
    return lp(out, 220) * 1.0


def engine_pass(d=2.6):
    t = t_axis(d)
    k = t / d
    rpm = 55 + 70 * k + 25 * np.sin(np.pi * k)
    doppler = 1 + 0.08 * np.tanh((0.5 - k) * 6)
    f = rpm * doppler
    x = saw(f, d) * 0.6 + saw(f * 2.01, d) * 0.3 + sine(f / 2, d) * 0.5
    x = soft_clip(lp(x, 900) * 2.5, 2.0)
    amp = np.exp(-((k - 0.5) ** 2) / 0.06)
    out = np.zeros((len(t), 2))
    for i0 in range(0, len(t), 512):
        seg = x[i0:i0 + 512] * amp[i0:i0 + 512]
        out[i0:i0 + len(seg)] = pan(seg, -0.9 + 1.8 * i0 / len(t))
    return reverb(out, ir, 0.2)


def siren(d=2.8):
    t = t_axis(d)
    f = 750 + 450 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 1.4))
    x = sine(f, d) * 0.6 + sine(f * 2, d) * 0.15
    x = lp(x, 1800) * env_adsr(len(t), 0.4, 0.2, 1.0, 0.8)
    return reverb(x, make_ir(2.5, 1.2, seed=31), 0.55)


def build():
    out = np.zeros((N, 2))
    S = lambda i: shot[i]["start"]
    wt = lambda sid, w: next(x["start"] for x in tl["words"] if x["sid"] == sid and x["w"] == w)

    def add(x, t, gain_db):
        place(out, (x if x.ndim == 2 else np.stack([x, x], 1)) * db(gain_db), t)

    # opening
    add(impact(1.0), 0.05, -6)
    add(sub_drop(), 0.05, -8)
    # title hit on GTA 6
    add(riser(1.6), S("S04") - 1.6, -16)
    add(impact(1.0), S("S04"), -7)
    add(text_hit(), S("S04") + 0.02, -12)
    # characters
    add(whoosh(0.6, seed=1), S("S06") - 0.35, -18)
    add(text_hit(), wt("s04", "Джейсон"), -16)
    add(text_hit(), wt("s04", "Люсия."), -16)
    add(sub_drop(1.2), S("S09"), -12)
    add(siren(min(3.0, shot["S10"]["dur"] + 0.8)), S("S10") - 0.2, -22)
    add(impact(0.8), S("S11"), -11)
    # Vice City
    add(riser(2.0), S("S12") - 2.0, -15)
    add(impact(1.0), S("S12"), -7)
    add(whoosh(0.8, seed=2), S("S12") - 0.4, -16)
    add(ambience(S("S18") - S("S12") + 1.5, seed=3) * np.linspace(1, 0, int(round((S("S18") - S("S12") + 1.5) * SR)))[:, None] ** 0.5, S("S12"), -27)
    add(engine_pass(shot["S14"]["dur"] + 0.6), S("S14") - 0.2, -18)
    add(waves(shot["S15"]["dur"] * 0.5 + 0.6), S("S15") - 0.2, -25)
    add(club_thump(shot["S15"]["dur"] * 0.55 + 0.2), wt("s07", "ночная"), -17)
    # world
    add(whoosh(0.9, up=False, seed=3), S("S18") - 0.45, -18)
    add(text_hit(), S("S19") + 0.1, -16)
    add(ambience(shot["S21"]["dur"] + 1.0, seed=7), S("S21"), -26)
    add(text_hit(), S("S21") + 0.1, -17)
    # expectations
    add(impact(0.9), S("S24"), -9)
    add(sub_drop(), S("S24"), -10)
    add(whoosh(0.7, seed=4), S("S25") - 0.35, -19)
    add(riser(3.0), S("S29") - 3.0, -14)
    add(siren(2.5), S("S27"), -26)
    # final
    add(impact(1.0), S("S29"), -6)
    add(sub_drop(2.0), S("S29"), -9)
    add(whoosh(0.7, seed=5), S("S32") - 0.35, -19)
    end_word = tl["words"][-1]["end"]
    add(impact(1.0), end_word + 0.25, -7)
    out = hp(out, 25)
    return out


if __name__ == "__main__":
    x = build()
    write_wav(os.path.join(ROOT, "audio", "sfx.wav"), np.clip(x, -1, 1))
    print("wrote audio/sfx.wav peak", np.max(np.abs(x)))
