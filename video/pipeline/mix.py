"""Place narration sentences on the timeline, process voice, duck music, write final mix."""
import json, subprocess
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
TL = json.load(open('timeline.json'))
music, _ = sf.read('music.wav')
N = len(music)
vo = np.zeros(N)


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


for s in TL['sentences']:
    a = decode(f"vo/{s['id']}.mp3")
    i0 = int(s['audioAt'] * SR)
    if i0 < 0:
        a = a[-i0:]; i0 = 0
    n = min(len(a), N - i0)
    vo[i0:i0 + n] += a[:n]

# voice: gentle warmth + presence, light compression, small room
low = sosfilt(butter(2, 180, 'lowpass', fs=SR, output='sos'), vo)
pres = sosfilt(butter(2, [2500, 5000], 'bandpass', fs=SR, output='sos'), vo)
vo = vo + 0.25 * low + 0.18 * pres
vo = sosfilt(butter(2, 70, 'highpass', fs=SR, output='sos'), vo)
env = np.sqrt(np.convolve(vo ** 2, np.ones(441) / 441, 'same')) + 1e-6
thr = 0.08
gain = np.where(env > thr, (thr / env) ** 0.45, 1.0)
gain = np.convolve(gain, np.ones(220) / 220, 'same')
vo = vo * gain
vo /= np.abs(vo).max()
ir_t = np.arange(int(0.5 * SR)) / SR
ir = np.random.default_rng(1).standard_normal(len(ir_t)) * np.exp(-ir_t / 0.09)
ir = sosfilt(butter(1, 4000, 'lowpass', fs=SR, output='sos'), ir); ir /= np.sqrt((ir ** 2).sum())
vo = vo + 0.10 * fftconvolve(vo, ir)[:N]
vo /= np.abs(vo).max()

# ducking envelope: smooth attack 80ms / release 600ms
speech = np.convolve(np.abs(vo), np.ones(2205) / 2205, 'same') > 0.02
duck = np.where(speech, 1.0, 0.0)
att = int(0.25 * SR)
duck = np.convolve(duck, np.ones(att) / att, 'same')
duck = np.clip(duck * 1.8, 0, 1)
music_gain = 10 ** ((-6.0 * duck) / 20)  # music drops 6 dB further under speech
mus = music * music_gain[:, None] * 0.40   # music bed sits well under narration

mix = mus + 0.80 * vo[:, None] * np.array([[1.0, 1.0]])
mix /= max(1.0, np.abs(mix).max() / 0.95)
sf.write('mix_pre.wav', mix, SR, subtype='PCM_24')
sf.write('vo_only.wav', vo * 0.8, SR, subtype='PCM_24')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'mix_pre.wav', '-af',
                'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', 'final_mix.wav'], check=True)
# report levels
for name, sig in [('vo', vo), ('music', mus.mean(1))]:
    act = sig[np.abs(sig) > 1e-4]
    print(name, 'rms dB', round(20 * np.log10(np.sqrt((act ** 2).mean())), 1))
print('done')
