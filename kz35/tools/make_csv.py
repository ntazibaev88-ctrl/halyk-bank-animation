#!/usr/bin/env python3
"""Writes out/KAZAKHSTAN_SCENE_TIMELINE.csv from edl.json, narration timeline, subtitles and the mix plan."""
import csv, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)
EDL = json.load(open('edl.json'))['shots']
SUBS = json.load(open('research/subs.json'))
SCENES = {1: 'THE OPENING', 2: 'THE DECEMBER EVENTS OF 1986', 3: 'INDEPENDENCE', 4: 'BUILDING A NEW COUNTRY',
          5: 'THE NEW CAPITAL', 6: 'THE PEOPLE OF KAZAKHSTAN', 7: 'MODERN KAZAKHSTAN', 8: 'THE NEXT GENERATION',
          9: 'EMOTIONAL FINALE'}
SC = [(0, 1), (13.07, 2), (30.37, 3), (46.46, 4), (60.05, 5), (73.06, 6), (87.68, 7), (101.47, 8), (113.01, 9)]
SFX_NAMES = {
    (0.0, 14.5): 'steppe wind ambience', (12.6, 30.6): 'deep wind hum', (12.75, 13.8): 'soft deep impact',
    (27.9, 30.5): 'cinematic riser', (30.3, 31.5): 'soft impact (1991 card)', (46.05, 46.6): 'whoosh',
    (59.6, 61.0): 'windy swoosh', (60.0, 73.5): 'city ambience (Astana)', (97.85, 101.65): 'real Soyuz lift-off sound',
    (101.3, 108.3): 'children outdoors ambience', (113.0, 120.0): 'wind', (116.95, 119.95): 'soft cinematic hit (final title)'}
GFX = [(0.9, 7.7, 'Title: ТӘУЕЛСІЗДІК / 35 ЖЫЛ / 1991—2026'), (13.42, 20.4, 'Year card: 1986 ЖЫЛ / ЖЕЛТОҚСАН ОҚИҒАСЫ'),
       (16.46, 20.95, 'Animated map of Kazakhstan, pin: Алматы'), (13.47, 72.86, 'Historical timeline strip 1986–2026'),
       (30.67, 38.37, 'Date card: 16 ЖЕЛТОҚСАН 1991 ЖЫЛ / ҚАЗАҚСТАН — ТӘУЕЛСІЗ МЕМЛЕКЕТ'),
       (41.7, 46.8, 'Animated globe locating Kazakhstan'), (50.97, 52.79, 'Card: 1993 — ҰЛТТЫҚ ВАЛЮТА: ТЕҢГЕ'),
       (52.79, 56.95, 'Card: 1992 — БҰҰ-ҒА МҮШЕ БОЛУ'), (60.35, 66.17, 'Title: ЖАҢА АСТАНА / ЖАҢА БЕЛЕС'),
       (62.57, 67.17, 'Animated map: Алматы → Астана (capital moved 1997)'),
       (73.36, 78.99, 'Title: БІЗДІҢ БАСТЫ БАЙЛЫҒЫМЫЗ — ХАЛЫҚ'), (87.98, 93.0, 'Title: ҚАЗАҚСТАН — БҮГІН ЖӘНЕ ЕРТЕҢ'),
       (101.77, 106.68, 'Title: БОЛАШАҚ — ЖАСТАРДЫҢ ҚОЛЫНДА'),
       (116.45, 120.0, 'Final title: 16 ЖЕЛТОҚСАН / ТӘУЕЛСІЗДІК КҮНІ / 35 ЖЫЛ. БІР ЕЛ. БІР БОЛАШАҚ.')]


def ts(t):
    m, s = divmod(t, 60)
    return f"{int(m):02d}:{s:06.3f}"


def scene_of(t):
    n = 1
    for st, k in SC:
        if t >= st - 1e-6:
            n = k
    return n


rows = []
for s in EDL:
    a, b = s['start'], s['end']
    subs = [x['text'].replace('\n', ' ') for x in SUBS if x['end'] > a + 0.05 and x['start'] < b - 0.05]
    sfx = [n for (x0, x1), n in SFX_NAMES.items() if x1 > a and x0 < b]
    gfx = [n for x0, x1, n in GFX if x1 > a + 0.1 and x0 < b - 0.1]
    trans = {'cut': 'hard cut', 'fade': f"cross-dissolve {s.get('tdur', 0.45):.2f}s", 'dip': f"dip to black {s.get('tdur'):.2f}s"}[s.get('tin', 'fade')]
    src_file = os.path.basename(s['src'])
    rows.append({
        'Start': ts(a), 'End': ts(b), 'Duration_s': f"{b - a:.2f}", 'Scene': f"{scene_of(a)} — {SCENES[scene_of(a)]}",
        'Shot_ID': s['id'], 'Narration (exact sentence/fragment)': s.get('narr', ''),
        'Video asset (prepared shot)': f"hf/media/shots/{s['id']}.{'mp4' if s['type'] == 'video' else 'jpg'}",
        'Source file': src_file + (f" @ {s['in']:.1f}s" if s['type'] == 'video' else ' (still, camera move)'),
        'Visual description': s.get('desc', ''), 'On-screen context label': s.get('label', ''),
        'Motion graphics': ' | '.join(gfx), 'Subtitle text': ' / '.join(subs),
        'Audio cue': 'VO (dominant) + music bed "Silent Descent" (ducked)' + ('; ' + '; '.join(sfx) if sfx else ''),
        'Transition in': trans, 'Origin / authenticity': s.get('origin', ''), 'Credit / license': s.get('credit', ''),
    })
with open('out/KAZAKHSTAN_SCENE_TIMELINE.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)
print(len(rows), 'rows')
