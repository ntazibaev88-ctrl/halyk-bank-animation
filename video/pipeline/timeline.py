import json
segs = json.load(open('narration.json'))
START = 1.8; IN_GAP = 0.5; SCENE_GAP = 1.2
extra = {'s1a': 0.6, 's1d': 0.3, 's3a': 0.4, 's10b': 0.5, 's10c': 0.2}
t = START; out = []; prev_scene = None
for s in segs:
    w = json.load(open(f"vo/{s['id']}.words.json"))
    if prev_scene is not None:
        t += SCENE_GAP if s['scene'] != prev_scene else IN_GAP
    speech_start = t
    offset = speech_start - w[0]['start']        # where to place mp3 file start
    words = [{'w': x['w'], 'start': round(x['start'] + offset, 3), 'end': round(x['end'] + offset, 3)} for x in w]
    end = words[-1]['end'] + 0.15
    out.append({**s, 'audioAt': round(offset, 3), 'start': round(speech_start, 3), 'end': round(end, 3), 'words': words})
    t = end + extra.get(s['id'], 0); prev_scene = s['scene']
# scene ranges: scene starts slightly before its first sentence
scenes = {}
for o in out:
    sc = scenes.setdefault(o['scene'], {'scene': o['scene'], 'vstart': o['start'], 'vend': o['end']})
    sc['vend'] = o['end']
sl = [scenes[k] for k in sorted(scenes)]
for i, sc in enumerate(sl):
    sc['start'] = 0 if i == 0 else round((sl[i-1]['vend'] + sc['vstart']) / 2, 3)
for i, sc in enumerate(sl):
    sc['end'] = sl[i+1]['start'] if i + 1 < len(sl) else round(sc['vend'] + 7.0, 3)
total = sl[-1]['end']
json.dump({'fps': 30, 'total': total, 'sentences': out, 'scenes': sl}, open('timeline.json', 'w'), ensure_ascii=False, indent=1)
for sc in sl: print(sc['scene'], sc['start'], sc['end'], round(sc['end'] - sc['start'], 1))
print('total', total)
