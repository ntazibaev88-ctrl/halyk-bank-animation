"""Mix narration over the score: voice EQ/compression, music ducking, loudness to -14 LUFS.

Writes build/out/documentary_audio.wav (for muxing) and output/documentary_audio.m4a.
"""
import json, os, subprocess
import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, DUR = 48000, 130.0
N = int(SR * DUR)
OUT = os.path.join(ROOT, "output")
os.makedirs(OUT, exist_ok=True)

sr, music = wavfile.read(os.path.join(ROOT, "build", "out", "music.wav"))
music = music[:N].astype(float).T / 32767
events = json.load(open(os.path.join(ROOT, "build", "out", "vo_events.json")))

voice = np.zeros(N)
for ev in events:
    _, clip = wavfile.read(os.path.join(ROOT, "build", "out", "vo", ev["key"] + ".wav"))
    clip = clip.astype(float) / 32767
    i = int(ev["start"] * SR)
    voice[i:i + len(clip)] += clip[: N - i]

# voice: rumble cut, gentle presence lift, soft compression
b, a = signal.butter(2, 80 / (SR / 2), "high"); voice = signal.lfilter(b, a, voice)
b, a = signal.butter(2, [2500 / (SR / 2), 6000 / (SR / 2)], "band"); voice = voice + 0.25 * signal.lfilter(b, a, voice)
env = np.sqrt(signal.lfilter([0.002], [1, -0.998], voice ** 2) + 1e-9)
gain = np.minimum(1, (0.12 / env) ** 0.4)
voice = voice * gain
voice = voice / (np.abs(voice).max() + 1e-9) * 0.8
# a touch of room so the narrator sits inside the score
t = np.arange(int(0.6 * SR)) / SR
ir = np.random.default_rng(3).standard_normal(len(t)) * np.exp(-t * 11)
room = signal.fftconvolve(voice, ir)[:N]
voice = voice + room / np.abs(room).max() * 0.06

# ducking envelope from narration activity (fast attack, slow release)
act = (np.abs(voice) > 0.02).astype(float)
k = int(0.35 * SR)
act = np.convolve(act, np.ones(k) / k, mode="same")
act = np.clip(act * 3, 0, 1)
MUSIC_DB = -4.0                                                  # overall score level vs. narration
duck_db = np.where(np.arange(N) / SR < 113.0, -8.0, -6.5)        # finale ducks less so it stays big
music_gain = 10 ** ((MUSIC_DB + duck_db * act) / 20)
mix = music * music_gain + voice[None, :] * 0.95
# fade in / out
fade = np.ones(N)
fi, fo = int(0.8 * SR), int(2.5 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
mix *= fade
mix = mix / np.abs(mix).max() * 0.9
raw = os.path.join(ROOT, "build", "out", "mix_raw.wav")
wavfile.write(raw, SR, (mix.T * 32767).astype(np.int16))
wav = os.path.join(ROOT, "build", "out", "documentary_audio.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000", wav], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", wav, "-c:a", "aac", "-b:a", "192k", os.path.join(OUT, "documentary_audio.m4a")], check=True)
print("audio mixed:", wav)
