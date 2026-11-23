#!/usr/bin/env python3
"""Final audio mix: VO + ducked music + ambience/SFX -> out/mix_master.wav (48 kHz, 24-bit, 120.000 s)."""
import subprocess, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
DUR = 120.0

# (file, film_start, source_in, length, gain_dB, fade_in, fade_out)
SFX = [
    ('assets/sfx/s2658.mp3', 0.0, 3.0, 14.5, -27, 2.0, 3.0),     # steppe wind under the opening
    ('assets/sfx/s1177.mp3', 12.6, 2.0, 18.0, -30, 1.5, 3.0),    # deep wind hum, December 1986
    ('assets/sfx/s1143.mp3', 12.75, 0.0, 4.0, -22, 0.0, 1.0),    # soft deep impact on the dip to 1986
    ('assets/sfx/s790.mp3', 27.9, 0.0, 2.6, -26, 0.4, 0.2),      # riser into 16 December 1991
    ('assets/sfx/s1143.mp3', 30.30, 0.0, 4.0, -20, 0.0, 1.2),    # impact on the 1991 card
    ('assets/sfx/s1471.mp3', 46.05, 0.0, 1.5, -24, 0.0, 0.4),    # whoosh into chapter 4
    ('assets/sfx/s1474.mp3', 59.6, 0.0, 3.0, -26, 0.0, 0.8),     # windy swoosh into Astana
    ('assets/sfx/s2465.mp3', 60.0, 5.0, 13.5, -33, 2.0, 2.5),    # city ambience, Astana
    ('assets/nasa/n3.mp4', 97.85, 3204.5, 3.8, -21, 0.3, 0.8),   # real Soyuz lift-off sound, Baikonur
    ('assets/sfx/s2264.mp3', 101.3, 4.0, 7.0, -36, 1.5, 2.0),    # children outdoors, next generation
    ('assets/sfx/s2658.mp3', 113.0, 20.0, 7.0, -30, 2.0, 2.0),   # wind under the finale
    ('assets/sfx/s788.mp3', 116.95, 0.0, 3.0, -21, 0.0, 2.0),    # soft cinematic hit on the final title
]
MUSIC = ('assets/music/m614.mp3', 7.0)   # Mixkit "Silent Descent", starts 7 s into the track

inputs = ['-i', 'out/KAZAKHSTAN_VOICEOVER.wav', '-i', MUSIC[0]]
for f, *_ in SFX:
    inputs += ['-i', f]

flt = []
flt.append("[0:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[vo][key]")
flt.append(f"[1:a]atrim=start={MUSIC[1]}:duration={DUR},asetpts=PTS-STARTPTS,aresample=48000,"
           f"aformat=channel_layouts=stereo,volume=-6dB,afade=t=in:d=2.5,afade=t=out:st={DUR - 2.4}:d=2.4[mraw]")
# music ducks ~7 dB under the narrator, recovers between sentences
flt.append("[mraw][key]sidechaincompress=threshold=0.025:ratio=5:attack=25:release=450:makeup=1[mus]")
labels = ['[vo]', '[mus]']
for i, (f, st, sin, ln, g, fi, fo) in enumerate(SFX):
    d = int(st * 1000)
    flt.append(f"[{i + 2}:a]atrim=start={sin}:duration={ln},asetpts=PTS-STARTPTS,aresample=48000,"
               f"aformat=channel_layouts=stereo,volume={g}dB,afade=t=in:d={max(fi, 0.01)},"
               f"afade=t=out:st={ln - fo:.3f}:d={max(fo, 0.01)},adelay={d}|{d}[s{i}]")
    labels.append(f'[s{i}]')
flt.append(''.join(labels) + f"amix=inputs={len(labels)}:normalize=0:dropout_transition=0[mix]")
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(flt), '-map', '[mix]',
                '-c:a', 'pcm_s24le', '-ar', '48000', 'voice/mix_pre.wav'], check=True)

# loudness: -14 LUFS integrated, true peak <= -1 dBTP (gain + limiter, no time shift)
o = subprocess.run(['ffmpeg', '-i', 'voice/mix_pre.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1])
gain = -14.0 - I
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'voice/mix_pre.wav', '-af',
                f"volume={gain:.2f}dB,alimiter=limit=0.85:attack=2:release=60:level=0,asetpts=N/SR/TB,"
                f"apad=whole_len={int(DUR * 48000)},atrim=end_sample={int(DUR * 48000)}",
                '-c:a', 'pcm_s24le', '-ar', '48000', 'out/mix_master.wav'], check=True)
o = subprocess.run(['ffmpeg', '-i', 'out/mix_master.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
print('pre I', I, 'gain', round(gain, 2))
print('\n'.join(l.strip() for l in o.splitlines()[-12:] if any(k in l for k in ('I:', 'LRA:', 'Peak:'))))
