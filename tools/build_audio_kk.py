"""Kazakh narration: synthesize with a neural voice (edge-tts), fit every section into its fixed time window,
time subtitle cards from word boundaries, write build/timeline.json, build/voice.wav, out/subtitles_kk.srt."""
import asyncio, json, os, subprocess, sys
import numpy as np
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SR = 48000
LEAD, TAIL, SENT_GAP = 0.35, 0.35, 0.22
script = json.load(open('narration/script_kk.json'))
TOTAL = script['total']
PROXY = os.environ.get('HTTPS_PROXY')
os.makedirs('build/tts_kk', exist_ok=True)

async def synth(text, rate, path):
    """Returns (samples, [(char_offset, start_s), ...]) with leading/trailing silence trimmed."""
    for attempt in range(4):
        try:
            c = edge_tts.Communicate(text, script['voice'], rate=f'{rate:+d}%', proxy=PROXY, boundary='WordBoundary')
            audio, words = bytearray(), []
            async for ch in c.stream():
                if ch['type'] == 'audio': audio += ch['data']
                elif ch['type'] == 'WordBoundary': words.append((ch['offset'] / 1e7, ch['text']))
            break
        except Exception as e:
            print('retry', e); await asyncio.sleep(2 ** attempt)
    open(path, 'wb').write(audio)
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
    voice = np.zeros(int(TOTAL * SR), np.float32)
    scenes, subs = [], []
    for si, sec in enumerate(script['sections']):
        sents = [(sc, i, s) for sc in sec['scenes'] for i, s in enumerate(sec['scenes'][sec['scenes'].index(sc)]['sentences'])]
        window = sec['end'] - sec['start']
        n_gaps = len(sents) - 1
        rate = 0
        for it in range(5):
            clips = [await synth(sentence_text(s), rate, f"build/tts_kk/{sc['id']}_{i}.mp3") for sc, i, s in sents]
            speech = sum(len(c[0]) for c in clips) / SR
            budget = window - LEAD - TAIL - n_gaps * SENT_GAP
            if speech <= budget or rate >= 30: break
            rate = min(30, rate + int(np.ceil((speech / budget - 1) * 100)) + 2)
        assert speech <= budget + 0.05, f'section {si} does not fit: {speech:.2f}s > {budget:.2f}s'
        slack = budget - speech
        # split slack: extra breathing room between scenes of a section and between sentences
        n_scene_gaps = len(sec['scenes']) - 1
        last = si == len(script['sections']) - 1
        scene_extra = min(slack * 0.7 / n_scene_gaps, 0.8) if n_scene_gaps else 0
        sent_extra = 0 if last else (min(slack * (0.3 if n_scene_gaps else 0.6) / n_gaps, 0.45) if n_gaps else 0)
        print(f"section {si} [{sec['start']}-{sec['end']}] rate {rate:+d}%  speech {speech:.2f}s  slack {slack:.2f}s")
        t = sec['start'] + LEAD
        prev_scene, cur = None, None
        for (sc, i, cards), (x, marks) in zip(sents, clips):
            if sc is not prev_scene:
                if prev_scene is not None: t += SENT_GAP + scene_extra
                cur = {'id': sc['id'], 'year': sc['year'], 'speechStart': t, 'sentences': [], 'section': si}
                scenes.append(cur); prev_scene = sc
            else:
                t += SENT_GAP + sent_extra
            st = int(round(t * SR)); voice[st:st + len(x)] += x
            d = len(x) / SR
            cur['sentences'].append({'start': round(t, 3), 'end': round(t + d, 3), 'sub': ' '.join(c['sub'] for c in cards)})
            # card start = time of first word at/after the card's first character
            text, off, starts = sentence_text(cards), 0, []
            for c in cards:
                m = next((tt for k, tt in marks if k >= off), 0.0)
                starts.append(0.0 if not starts else max(m - 0.05, 0)); off += len(c['tts']) + 1
            for j, c in enumerate(cards):
                e = starts[j + 1] if j + 1 < len(cards) else d
                subs.append({'start': round(t + starts[j], 3), 'end': round(t + e, 3), 'text': c['sub']})
            t += d
            cur['speechEnd'] = round(t, 3)
    # scene boundaries: sections are fixed; scenes inside a section split at the middle of the pause
    for i, sc in enumerate(scenes):
        sec = script['sections'][sc['section']]
        first = i == 0 or scenes[i - 1]['section'] != sc['section']
        sc['start'] = sec['start'] if first else round((scenes[i - 1]['speechEnd'] + sc['speechStart']) / 2, 3)
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
    os.remove('build/voice.f32')
    def ts(x):
        ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
        return f'{h:02}:{m:02}:{s:02},{ms:03}'
    with open('out/subtitles_kk.srt', 'w') as f:
        for i, s in enumerate(subs, 1): f.write(f"{i}\n{ts(s['start'])} --> {ts(s['end'])}\n{s['text']}\n\n")
    for sc in scenes: print(f"  {sc['id']:12} {sc['start']:7.2f} - {sc['end']:7.2f}  speech {sc['speechStart']:.2f}-{sc['speechEnd']:.2f}")

asyncio.run(main())
