"""Export the same Kazakh subtitle cues the video burns in (<=2 lines, <=25 chars/line) as an .srt file."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
MAXCH = 25
cues = []
for sc in TL['scenes']:
    for seg in sc['segments']:
        lines, cur, ln = [], [], 0
        for w in seg['words']:
            add = len(w['w']) + (1 if cur else 0)
            if cur and ln + add > MAXCH:
                lines.append(cur); cur, ln = [], 0
            cur.append(w); ln += len(w['w']) + (1 if len(cur) > 1 else 0)
        if cur: lines.append(cur)
        for i in range(1, len(lines)):
            if lines[i] and lines[i][0]['w'] == '—':
                lines[i - 1].append(lines[i].pop(0))
        for i in range(0, len(lines), 2):
            ls = [l for l in lines[i:i + 2] if l]
            ws = [w for l in ls for w in l]
            cues.append([ws[0]['s'] - 0.08, ws[-1]['e'] + 0.25, '\n'.join(' '.join(w['w'] for w in l) for l in ls)])
for i in range(len(cues) - 1):
    if cues[i + 1][0] - cues[i][1] < 0.6:
        cues[i][1] = max(cues[i][1], cues[i + 1][0] - 0.02)
ts = lambda t: f'{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d},{int(round(t % 1 * 1000)) % 1000:03d}'
os.makedirs(os.path.join(ROOT, 'output'), exist_ok=True)
with open(os.path.join(ROOT, 'output', 'PTE_TB_TEC_kk.srt'), 'w', encoding='utf-8') as f:
    for i, (a, b, txt) in enumerate(cues, 1):
        f.write(f'{i}\n{ts(max(0, a))} --> {ts(b)}\n{txt}\n\n')
print(len(cues), 'cues')
