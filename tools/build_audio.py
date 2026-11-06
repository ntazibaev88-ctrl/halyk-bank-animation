"""Synthesize narration, lay out a 150 s timeline, write build/timeline.json + build/voice.wav + out/subtitles.srt."""
import json, subprocess, wave, re, os
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
TOTAL = 150.0
SR = 48000
HEAD = 1.0          # music-only intro before first word
TAIL_MIN = 3.0      # end card after last word
SENT_GAP = 0.28     # pause between sentences inside a scene

script = json.load(open('narration/script.json'))
os.makedirs('build/tts', exist_ok=True)

def synth(text, path):
    raw = path.replace('.wav', '_raw.wav')
    subprocess.run(['RHVoice-test', '-p', script['voice'], '-r', str(script['rate']), '-o', raw],
                   input=text.encode(), check=True)
    # resample to 48k mono float
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-ar', str(SR), '-ac', '1', '-f', 'f32le', path + '.f32'], check=True)
    x = np.fromfile(path + '.f32', np.float32)
    os.remove(path + '.f32')
    idx = np.where(np.abs(x) > 0.012)[0]
    a, b = max(idx[0] - int(0.03 * SR), 0), min(idx[-1] + int(0.08 * SR), len(x))
    return x[a:b]

clips = []
for seg in script['segments']:
    for i, s in enumerate(seg['sentences']):
        clips.append((seg['id'], i, synth(s['tts'], f"build/tts/{seg['id']}_{i}.wav")))

speech = sum(len(c[2]) for c in clips) / SR
n_seg = len(script['segments'])
inner_gaps = sum(len(s['sentences']) - 1 for s in script['segments']) * SENT_GAP
spare = TOTAL - HEAD - TAIL_MIN - speech - inner_gaps
scene_gap = min(spare / (n_seg - 1), 1.4)
tail = TOTAL - HEAD - speech - inner_gaps - scene_gap * (n_seg - 1)
assert scene_gap > 0.3, f'speech too long: {speech:.1f}s'
print(f'speech {speech:.1f}s  scene gap {scene_gap:.2f}s  tail {tail:.2f}s')

def chunk(text, limit=62):
    """Split a sentence into subtitle cards of <= limit chars, preferring punctuation breaks."""
    if len(text) <= limit:
        return [text]
    words = text.split(' ')
    best = None
    for k in range(1, len(words)):
        left, right = ' '.join(words[:k]), ' '.join(words[k:])
        if len(left) > limit:
            break
        score = abs(len(left) - len(right))
        if re.search(r'[,—:;]$', left) or right.startswith('—'):
            score -= 25
        if best is None or score < best[0]:
            best = (score, left, right)
    return [best[1]] + chunk(best[2], limit)

voice = np.zeros(int(TOTAL * SR), np.float32)
t = HEAD
scenes, subs = [], []
ci = 0
for si, seg in enumerate(script['segments']):
    if si:
        t += scene_gap
    sc = {'id': seg['id'], 'year': seg['year'], 'speechStart': t, 'sentences': []}
    for i, s in enumerate(seg['sentences']):
        if i:
            t += SENT_GAP
        x = clips[ci][2]; ci += 1
        st = int(round(t * SR)); voice[st:st + len(x)] += x
        d = len(x) / SR
        sc['sentences'].append({'start': round(t, 3), 'end': round(t + d, 3), 'sub': s['sub']})
        parts = chunk(s['sub'])
        total_chars = sum(len(p) for p in parts)
        u = t
        for p in parts:
            pd = d * len(p) / total_chars
            subs.append({'start': round(u, 3), 'end': round(u + pd, 3), 'text': p})
            u += pd
        t += d
    sc['speechEnd'] = t
    scenes.append(sc)

# scene boundaries: centred in the gaps between speech blocks
for i, sc in enumerate(scenes):
    sc['start'] = 0.0 if i == 0 else round((scenes[i - 1]['speechEnd'] + sc['speechStart']) / 2, 3)
for i, sc in enumerate(scenes):
    sc['end'] = TOTAL if i == len(scenes) - 1 else scenes[i + 1]['start']
    sc['speechStart'] = round(sc['speechStart'], 3); sc['speechEnd'] = round(sc['speechEnd'], 3)

# keep each card on screen a touch longer when there is silence after it (max +0.6 s)
for i, s in enumerate(subs):
    nxt = subs[i + 1]['start'] if i + 1 < len(subs) else TOTAL
    s['end'] = round(min(s['end'] + 0.6, nxt - 0.04), 3)

json.dump({'total': TOTAL, 'fps': 30, 'title': script['title'], 'scenes': scenes, 'subs': subs},
          open('build/timeline.json', 'w'), ensure_ascii=False, indent=1)
voice.astype(np.float32).tofile('build/voice.f32')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'build/voice.f32',
                'build/voice.wav'], check=True)
os.remove('build/voice.f32')

def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
os.makedirs('out', exist_ok=True)
with open('out/subtitles_ru.srt', 'w') as f:
    for i, s in enumerate(subs, 1):
        f.write(f"{i}\n{ts(s['start'])} --> {ts(s['end'])}\n{s['text']}\n\n")
for sc in scenes:
    print(f"{sc['id']:12} {sc['start']:7.2f} - {sc['end']:7.2f}  ({sc['end']-sc['start']:.1f}s)")
