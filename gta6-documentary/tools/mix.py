"""Final mix: voice on top, music ducked under speech, SFX bed.

Voice-activity envelope (from the word timeline) drives music ducking with
smooth attack/release so there are no pumps or spikes. Output is loudness
normalised for social (-14 LUFS integrated, -1.5 dBTP) with ffmpeg loudnorm
(two-pass, linear). Writes audio/mix.wav (48 kHz stereo, exactly 80 s).
"""
import json, os, re, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from dsp import SR, read_audio, write_wav, db, lp

ROOT = os.path.join(HERE, "..")
tl = json.load(open(os.path.join(ROOT, "build", "timeline.json")))
DUR = tl["duration"]
N = int(DUR * SR)


def fit(x):
    if len(x) >= N:
        return x[:N]
    return np.pad(x, ((0, N - len(x)), (0, 0)))


vo = fit(read_audio(os.path.join(ROOT, "audio", "voiceover.wav")))
mu = fit(read_audio(os.path.join(ROOT, "audio", "music.wav")))
fx = fit(read_audio(os.path.join(ROOT, "audio", "sfx.wav")))

# speech envelope from sentence spans (a sentence is one continuous phrase)
gate = np.zeros(N)
for s in tl["sentences"]:
    a, b = int((s["start"] - 0.12) * SR), int((s["end"] + 0.05) * SR)
    gate[max(a, 0):min(b, N)] = 1.0
# smooth: ~150 ms attack, ~450 ms release (one-pole on a decimated control signal)
ctrl = gate[::480]
sm = np.zeros_like(ctrl)
for i in range(1, len(ctrl)):
    coef = 0.75 if ctrl[i] > sm[i - 1] else 0.92  # 100 Hz control rate
    sm[i] = coef * sm[i - 1] + (1 - coef) * ctrl[i]
duck = np.interp(np.arange(N), np.arange(len(sm)) * 480, sm)

MUSIC_BED = db(-15.5)     # music level while the narrator speaks
MUSIC_OPEN = db(-8.0)     # music level in the gaps
music_gain = MUSIC_OPEN + (MUSIC_BED - MUSIC_OPEN) * duck
# carve a little 1-4 kHz space in the music under speech (simple split-band)
mu_low = lp(mu, 900)
mu_high = mu - mu_low
mu_carved = mu_low + mu_high * (1 - 0.35 * duck)[:, None]

sfx_gain = db(-2.0) * (1 - 0.35 * duck)
mix = vo * db(0.0) + mu_carved * music_gain[:, None] + fx * sfx_gain[:, None]
mix[:int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))[:, None]
mix[-int(0.4 * SR):] *= np.linspace(1, 0, int(0.4 * SR))[:, None] ** 0.5

pre = os.path.join(ROOT, "build", "mix_pre.wav")
peak = np.max(np.abs(mix))
write_wav(pre, mix / max(1.0, peak / 0.98))

# two-pass loudnorm to -14 LUFS / -1.5 dBTP
TARGET = "I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", pre, "-af", f"loudnorm={TARGET}:print_format=json", "-f", "null", "-"],
                   capture_output=True, text=True)
m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S).group(0))
af = (f"loudnorm={TARGET}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
out = os.path.join(ROOT, "audio", "mix.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af", af, "-t", str(DUR), "-ar", "48000", "-c:a", "pcm_s24le", out],
               check=True)
print("mix written:", out)
print("pre-norm loudness:", m["input_i"], "LUFS, TP", m["input_tp"])
