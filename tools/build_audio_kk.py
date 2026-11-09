"""Kazakh narration: synthesize every sentence with a neural voice (edge-tts) at a calm rate, lay them out with natural
pauses so the film lands on the target length, time subtitle cards from word boundaries.
Writes build/timeline.json, build/voice.wav, out/subtitles_kk.srt."""
import asyncio, json, os, subprocess, sys
import numpy as np
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SR = 48000
HEAD, TAIL = 0.5, 3.8
script = json.load(open('narration/script_kk.json'))
TARGET = script['target']
PROXY = os.environ.get('HTTPS_PROXY')
os.makedirs('build/tts_kk', exist_ok=True)

async def synth(text, rate, path):
    """Returns (samples, [(char_offset, start_s), ...]) with leading/trailing silence trimmed.
    Clips are cached (audio + word timings) so re-running keeps the exact same voice recording."""
    meta = path + '.json'
    key = {'text': text, 'rate': rate, 'pitch': script.get('pitch', 0), 'voice': script['voice']}
    if os.path.exists(path) and os.path.exists(meta) and json.load(open(meta))['key'] == key:
        words = [tuple(w) for w in json.load(open(meta))['words']]
        return decode(path, text, words)
    for attempt in range(4):
        try:
            c = edge_tts.Communicate(text, script['voice'], rate=f'{rate:+d}%', pitch=f"{script.get('pitch', 0):+d}Hz", proxy=PROXY, boundary='WordBoundary')
            audio, words = bytearray(), []
            async for ch in c.stream():
                if ch['type'] == 'audio': audio += ch['data']
                elif ch['type'] == 'WordBoundary': words.append((ch['offset'] / 1e7, ch['text']))
            break
        except Exception as e:
            print('retry', e); await asyncio.sleep(2 ** attempt)
    open(path, 'wb').write(audio)
    json.dump({'key': key, 'words': words}, open(meta, 'w'), ensure_ascii=False)
    return decode(path, text, words)

def decode(path, text, words):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, np.float32)
    idx = np.where(np.abs(x) > 0.01)[0]
    a, b = max(idx[0] - int(0.03 * SR), 0), min(idx[-1] + int(0.1 * SR), len(x))
    # map each boundary word to its character offset in the text
    pos, marks = 0, []
    for t, w in words:
        k = text.find(w, pos)
        if k < 0: continue
        marks.append((k, t - a / SR)); pos = k + len(w)
    return x[a:b].copy(), marks

def sentence_text(cards): return ' '.join(c['tts'] for c in cards)

async def main():
    rate = script['rate']
    clips = {}
    for sc in script['scenes']:
        for i, cards in enumerate(sc['sentences']):
            clips[(sc['id'], i)] = await synth(sentence_text(cards), rate, f"build/tts_kk/{sc['id']}_{i}.mp3")
    speech = sum(len(c[0]) for c in clips.values()) / SR
    n_sent = len(clips); n_sc = len(script['scenes'])
    n_inner = n_sent - n_sc
    # pauses: a breath between sentences, a longer beat between scenes; scaled together to hit the target
    base_inner, base_scene = 0.6, 1.2
    k = (TARGET - HEAD - TAIL - speech) / (n_inner * base_inner + (n_sc - 1) * base_scene)
    k = max(0.6, min(k, 1.6))
    sent_gap, scene_gap = base_inner * k, base_scene * k
    TOTAL = round(HEAD + speech + n_inner * sent_gap + (n_sc - 1) * scene_gap + TAIL, 1)
    print(f'rate {rate:+d}%  speech {speech:.1f}s  sentence pause {sent_gap:.2f}s  scene pause {scene_gap:.2f}s  total {TOTAL}s')
    globals()['TOTAL'] = TOTAL
    voice = np.zeros(int((TOTAL + 1) * SR), np.float32)
    scenes, subs = [], []
    t = HEAD
    for si, sc in enumerate(script['scenes']):
        if si: t += scene_gap
        cur = {'id': sc['id'], 'year': sc['year'], 'speechStart': t, 'sentences': []}
        scenes.append(cur)
        for i, cards in enumerate(sc['sentences']):
            if i: t += sent_gap
            x, marks = clips[(sc['id'], i)]
            st = int(round(t * SR)); voice[st:st + len(x)] += x
            d = len(x) / SR
            cur['sentences'].append({'start': round(t, 3), 'end': round(t + d, 3), 'sub': ' '.join(c['sub'] for c in cards)})
            off, starts = 0, []
            for c in cards:
                m = next((tt for kk, tt in marks if kk >= off), 0.0)
                starts.append(0.0 if not starts else max(m - 0.05, 0)); off += len(c['tts']) + 1
            for j, c in enumerate(cards):
                e = starts[j + 1] if j + 1 < len(cards) else d
                subs.append({'start': round(t + starts[j], 3), 'end': round(t + e, 3), 'text': c['sub']})
            t += d
        cur['speechEnd'] = round(t, 3)
    voice = voice[:int(TOTAL * SR)]
    # scene boundaries: sections are fixed; scenes inside a section split at the middle of the pause
    for i, sc in enumerate(scenes):
        sc['start'] = 0.0 if i == 0 else round((scenes[i - 1]['speechEnd'] + sc['speechStart']) / 2, 3)
    for i, sc in enumerate(scenes):
        sc['end'] = TOTAL if i == len(scenes) - 1 else scenes[i + 1]['start']
        sc['speechStart'] = round(sc['speechStart'], 3)
    for i, s in enumerate(subs):
        nxt = subs[i + 1]['start'] if i + 1 < len(subs) else TOTAL
        s['end'] = round(min(s['end'] + 0.5, nxt - 0.04), 3)
    json.dump({'total': TOTAL, 'fps': 30, 'title': script['title'], 'scenes': scenes, 'subs': subs},
              open('build/timeline.json', 'w'), ensure_ascii=False, indent=1)
    voice.tofile('build/voice.f32')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'build/voice.f32', 'build/voice.wav'], check=True)
    # the approved narration master is kept in the repo; use it when present so the voice never changes
    if os.path.exists('narration/voice_kk.wav'):
        import shutil; shutil.copy('narration/voice_kk.wav', 'build/voice.wav')
        print('using approved narration master narration/voice_kk.wav')
    os.remove('build/voice.f32')
    def ts(x):
        ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
        return f'{h:02}:{m:02}:{s:02},{ms:03}'
    with open('out/subtitles_kk.srt', 'w') as f:
        for i, s in enumerate(subs, 1): f.write(f"{i}\n{ts(s['start'])} --> {ts(s['end'])}\n{s['text']}\n\n")
    for sc in scenes: print(f"  {sc['id']:12} {sc['start']:7.2f} - {sc['end']:7.2f}  speech {sc['speechStart']:.2f}-{sc['speechEnd']:.2f}")

asyncio.run(main())
