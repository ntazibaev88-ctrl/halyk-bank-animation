#!/usr/bin/env python3
"""Builds hf/index.html (HyperFrames composition) for the KZ35 documentary.

Inputs:
  voice/timeline.json   – narration sentences with absolute word timestamps
  hf/assets_map.json    – Kazakhstan map / globe SVG paths (Natural Earth 1:50m)
  edl.json              – shot list (for on-screen source labels) – optional
Outputs:
  hf/index.html, out/KAZAKHSTAN_SUBTITLES.srt, research/subs.json
"""
import json, re, html, os, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
DUR = 120.0
W, H = 2160, 3840

T = json.load(open(P('voice/timeline.json')))
MAP = json.load(open(P('hf/assets_map.json')))
EDL = json.load(open(P('edl.json'))) if os.path.exists(P('edl.json')) else {"shots": []}

# ----------------------------------------------------------------------------
# 1. Subtitles: align display words with spoken (TTS) word boundaries
# ----------------------------------------------------------------------------
SPOKEN = {"1986": 5, "1991": 5, "16": 2}
GOLD = {"тәуелсіздік", "арманы", "тарихы", "1986", "желтоқсаны", "желтоқсан", "жастар", "мәңгі",
        "1991", "16", "тәуелсіздігі", "дәуірдің", "дербес", "валютамызды", "халықаралық",
        "елордамыз", "астана", "символына", "халқы", "бірлігімен", "татулықта", "бірлікте",
        "мүмкіндіктер", "технологияға", "биігіміз", "ұрпақ", "болашағын", "тәуелсіздігіміз",
        "қазақстан", "жасай", "берсін", "аманаты", "еңбегімен", "білімімен", "мемлекет",
        "жарияланды", "қаһармандары", "өзгерді", "білімі", "арманы"}
MAXLINE = 26


def norm(w):
    return re.sub(r"[^\wәғқңөұүһіӘҒҚҢӨҰҮҺІ]", "", w.lower())


def align(sent):
    """Return list of (display_token, t_start, t_end)."""
    toks = [t for t in sent['text'].split() if t != '—']
    spoken = sent['words_abs']
    out, k = [], 0
    dash_before = set()
    raw = sent['text'].split()
    # remember which tokens are preceded by an em dash so we can re-insert it
    for i, t in enumerate(raw):
        if t == '—' and i + 1 < len(raw):
            dash_before.add(len([x for x in raw[:i + 1] if x != '—']))
    for i, tok in enumerate(toks):
        n = SPOKEN.get(norm(tok), 1)
        ws = spoken[k:k + n]
        k += n
        if not ws:
            ws = [spoken[-1]]
        disp = ('— ' if i in dash_before else '') + tok
        out.append((disp, ws[0]['t'], ws[-1]['t'] + ws[-1]['d']))
    assert k == len(spoken), (sent['text'], k, len(spoken))
    return out


def chunk(words):
    """Group aligned words into cues of max two lines of MAXLINE chars."""
    cues, cur = [], []

    def length(ws):
        return len(' '.join(w[0] for w in ws))

    for w in words:
        if cur and length(cur + [w]) > MAXLINE * 2 - 4:
            cues.append(cur); cur = []
        cur.append(w)
        # prefer to break after strong punctuation if the cue is already long enough
        if re.search(r'[,.!?…]$', w[0]) and length(cur) > MAXLINE + 4:
            cues.append(cur); cur = []
    if cur:
        # avoid an orphan one-word last cue
        if cues and len(cur) == 1 and length(cues[-1] + cur) <= MAXLINE * 2 + 2:
            cues[-1] += cur
        elif cues and len(cur) == 1:
            prev = cues[-1]
            cut = max((i for i, w in enumerate(prev[:-1]) if re.search(r',$', w[0])), default=None)
            if cut is not None:
                cues[-1], cur = prev[:cut + 1], prev[cut + 1:] + cur
            cues.append(cur)
        else:
            cues.append(cur)
    return cues


def lines_of(ws):
    """Split a cue into ≤2 balanced lines."""
    text = [w[0] for w in ws]
    if len(' '.join(text)) <= MAXLINE:
        return [ws]
    best, bi = 1e9, 1
    for i in range(1, len(ws)):
        a, b = len(' '.join(text[:i])), len(' '.join(text[i:]))
        score = max(a, b) + (0 if a <= MAXLINE and b <= MAXLINE else 100)
        if score < best:
            best, bi = score, i
    return [ws[:bi], ws[bi:]]


cues = []
for s in T:
    for c in chunk(align(s)):
        cues.append(dict(words=c, start=c[0][1] - 0.08, end=c[-1][2] + 0.12, scene=s['scene']))
# extend each cue to the next one when the gap is short so text does not flicker
for a, b in zip(cues, cues[1:]):
    if b['start'] - a['end'] < 0.45:
        a['end'] = b['start'] - 0.02
    else:
        a['end'] = min(a['end'] + 0.3, b['start'] - 0.05)
cues[-1]['end'] = min(cues[-1]['end'] + 0.3, 117.25)


def cue_html(c):
    rows = []
    for ln in lines_of(c['words']):
        parts = []
        for disp, *_ in ln:
            pre = ''
            if disp.startswith('— '):
                pre, disp = '— ', disp[2:]
            core = re.match(r'^(.*?)([,.!?…»]*)$', disp)
            word, punct = core.group(1), core.group(2)
            if norm(word) in GOLD:
                parts.append(f'{html.escape(pre)}<span class="g">{html.escape(word)}</span>{html.escape(punct)}')
            else:
                parts.append(html.escape(pre + disp))
        rows.append(' '.join(parts))
    for i in range(1, len(rows)):
        if rows[i].startswith('— '):
            rows[i-1] += ' —'; rows[i] = rows[i][2:]
    return '<br>'.join(rows)


def plain(c):
    rows = [' '.join(w[0] for w in ln) for ln in lines_of(c['words'])]
    for i in range(1, len(rows)):
        if rows[i].startswith('— '):
            rows[i-1] += ' —'; rows[i] = rows[i][2:]
    return '\n'.join(rows)


def srt_time(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


os.makedirs(P('out'), exist_ok=True)
with open(P('out/KAZAKHSTAN_SUBTITLES.srt'), 'w', encoding='utf-8') as f:
    for i, c in enumerate(cues, 1):
        f.write(f"{i}\n{srt_time(c['start'])} --> {srt_time(c['end'])}\n{plain(c)}\n\n")
json.dump([dict(start=round(c['start'], 3), end=round(c['end'], 3), text=plain(c), scene=c['scene']) for c in cues],
          open(P('research/subs.json'), 'w'), ensure_ascii=False, indent=1)


# ----------------------------------------------------------------------------
# helpers to find narration timing of a word
# ----------------------------------------------------------------------------
def word_t(scene, idx, word):
    s = [x for x in T if x['scene'] == scene and x['idx'] == idx][0]
    for w in s['words_abs']:
        if norm(w['w']).startswith(norm(word)):
            return w['t']
    raise KeyError(word)


def sent(scene, idx):
    s = [x for x in T if x['scene'] == scene and x['idx'] == idx][0]
    return s['start'], s['end']


SC = {}  # visual scene starts (≈0.55s before first narration of the scene)
for s in T:
    if s['idx'] == 0:
        SC[s['scene']] = 0.0 if s['scene'] == 1 else round(s['start'] - 0.6, 2)
SC[10] = DUR

# ----------------------------------------------------------------------------
# 2. Overlay elements
# ----------------------------------------------------------------------------
els, anim = [], []  # html strings, js strings


def clip(id_, start, dur, inner, cls='', style=''):
    els.append(f'<div id="{id_}" class="clip {cls}" data-start="{start:.3f}" data-duration="{dur:.3f}" '
               f'style="{style}">{inner}</div>')


# ---- Scene titles -------------------------------------------------------
def title(id_, start, end, lines, kind='scene', top=900):
    inner = ''.join(lines)
    clip(id_, start, end - start, inner, cls=f'title {kind}', style=f'top:{top}px')
    anim.append(f"""
  tl.fromTo('#{id_} .ln', {{opacity:0, y:40, filter:'blur(14px)'}}, {{opacity:1, y:0, filter:'blur(0px)', duration:1.1, ease:'power3.out', stagger:0.22}}, {start + 0.05:.3f});
  tl.fromTo('#{id_} .rule', {{scaleX:0}}, {{scaleX:1, duration:1.2, ease:'power2.inOut'}}, {start + 0.25:.3f});
  tl.to('#{id_}', {{opacity:0, y:-20, filter:'blur(10px)', duration:0.7, ease:'power2.in'}}, {end - 0.7:.3f});""")


# Opening title
t0 = 0.9
title('t1', t0, 7.7, [
    '<div class="ln kicker">ҚАЗАҚСТАН РЕСПУБЛИКАСЫ</div>',
    '<div class="ln hero">ТӘУЕЛСІЗДІК</div>',
    '<div class="rule"></div>',
    '<div class="ln hero2"><span class="num">35</span> ЖЫЛ</div>',
    '<div class="ln years">1991 — 2026</div>'], kind='open', top=980)

# 1986 card
a, _ = sent(2, 0)
title('t2', a - 0.25, 20.4, [
    '<div class="ln year">1986 <span>ЖЫЛ</span></div>',
    '<div class="rule"></div>',
    '<div class="ln sub">ЖЕЛТОҚСАН ОҚИҒАСЫ</div>'], kind='hist', top=760)

# 16 December 1991 card
a, _ = sent(3, 0)
title('t3', a - 0.3, sent(3, 1)[1] + 0.6, [
    '<div class="ln date"><span class="num">16</span> ЖЕЛТОҚСАН</div>',
    '<div class="ln year small">1991 <span>ЖЫЛ</span></div>',
    '<div class="rule"></div>',
    '<div class="ln sub">ҚАЗАҚСТАН — ТӘУЕЛСІЗ МЕМЛЕКЕТ</div>'], kind='hist', top=700)

# 1992 / 1993 milestones (timed to the words in narration)
t_val = word_t(4, 1, 'ұлттық') - 0.2
t_int = word_t(4, 1, 'халықаралық') - 0.2
title('t4a', t_val, t_int - 0.05, [
    '<div class="ln year mid">1993</div>',
    '<div class="rule"></div>',
    '<div class="ln sub">ҰЛТТЫҚ ВАЛЮТА: ТЕҢГЕ</div>'], kind='hist', top=640)
title('t4b', t_int, sent(4, 1)[1] + 0.5, [
    '<div class="ln year mid">1992</div>',
    '<div class="rule"></div>',
    '<div class="ln sub">БҰҰ-ҒА МҮШЕ БОЛУ</div>'], kind='hist', top=640)

a, _ = sent(5, 0)
title('t5', a - 0.3, sent(5, 1)[0] + 3.2, [
    '<div class="ln big">ЖАҢА АСТАНА</div>',
    '<div class="rule"></div>',
    '<div class="ln sub">ЖАҢА БЕЛЕС</div>'], kind='scene', top=700)

a, _ = sent(6, 0)
title('t6', a - 0.3, sent(6, 1)[0] + 2.4, [
    '<div class="ln mid2">БІЗДІҢ БАСТЫ<br>БАЙЛЫҒЫМЫЗ —</div>',
    '<div class="rule"></div>',
    '<div class="ln big gold">ХАЛЫҚ</div>'], kind='scene', top=580)

a, _ = sent(7, 0)
title('t7', a - 0.3, sent(7, 1)[0] + 2.2, [
    '<div class="ln big">ҚАЗАҚСТАН</div>',
    '<div class="rule"></div>',
    '<div class="ln sub">БҮГІН ЖӘНЕ ЕРТЕҢ</div>'], kind='scene', top=580)

a, _ = sent(8, 0)
title('t8', a - 0.3, sent(8, 1)[0] + 1.4, [
    '<div class="ln big">БОЛАШАҚ —</div>',
    '<div class="rule"></div>',
    '<div class="ln sub">ЖАСТАРДЫҢ ҚОЛЫНДА</div>'], kind='scene', top=580)

# Final card (after last narration line)
fin = 117.05
clip('fin', fin - 0.6, DUR - fin + 0.6, '''
  <div class="fin-inner">
    <svg class="sun" viewBox="-100 -100 200 200">{rays}<circle r="34" fill="none" stroke="#E8C15A" stroke-width="2.2"/></svg>
    <div class="ln f1"><span class="num">16</span> ЖЕЛТОҚСАН</div>
    <div class="ln f2">ТӘУЕЛСІЗДІК КҮНІ</div>
    <div class="rule"></div>
    <div class="ln f3">35 ЖЫЛ. БІР ЕЛ. БІР БОЛАШАҚ.</div>
  </div>'''.replace('{rays}', ''.join(
    f'<line x1="0" y1="-44" x2="0" y2="-{58 + (6 if i % 2 else 0)}" stroke="#E8C15A" stroke-width="2.2" stroke-linecap="round" transform="rotate({i * 360 / 32:.2f})"/>'
    for i in range(32))), cls='final')
anim.append(f"""
  tl.fromTo('#fin', {{opacity:0}}, {{opacity:1, duration:0.9, ease:'power1.out'}}, {fin - 0.6:.3f});
  tl.fromTo('#fin .sun', {{opacity:0, scale:0.6, rotation:-20}}, {{opacity:1, scale:1, rotation:0, duration:2.2, ease:'power3.out'}}, {fin - 0.4:.3f});
  tl.fromTo('#fin .ln', {{opacity:0, y:30, filter:'blur(12px)'}}, {{opacity:1, y:0, filter:'blur(0px)', duration:1.0, ease:'power3.out', stagger:0.28}}, {fin - 0.2:.3f});
  tl.fromTo('#fin .rule', {{scaleX:0}}, {{scaleX:1, duration:1.1, ease:'power2.inOut'}}, {fin + 0.3:.3f});""")

# ---- Historical timeline strip -------------------------------------------
YEARS = [("1986", "ЖЕЛТОҚСАН"), ("1991", "ТӘУЕЛСІЗДІК"), ("1992", "БҰҰ"), ("1993", "ТЕҢГЕ"),
         ("1997", "ЕЛОРДА"), ("2026", "35 ЖЫЛ")]
strip_items = ''.join(f'<div class="yr" id="yr{y}"><div class="dot"></div><div class="y">{y}</div><div class="c">{c}</div></div>'
                      for y, c in YEARS)
strip_start, strip_end = SC[2] + 0.4, SC[6] - 0.2
clip('strip', strip_start, strip_end - strip_start,
     f'<div class="track"><div class="fill"></div></div><div class="yrs">{strip_items}</div>', cls='strip')
pos = {y: i / (len(YEARS) - 1) for i, (y, _) in enumerate(YEARS)}
marks = [("1986", sent(2, 0)[0]), ("1991", sent(3, 0)[0]), ("1993", t_val + 0.2), ("1992", t_int + 0.2),
         ("1997", sent(5, 1)[0])]
anim.append("tl.set('#strip .fill', {scaleX:0}, 0);")
anim.append(f"tl.fromTo('#strip', {{opacity:0, y:20}}, {{opacity:1, y:0, duration:0.8, ease:'power2.out'}}, {strip_start:.3f});")
anim.append(f"tl.to('#strip', {{opacity:0, duration:0.6}}, {strip_end - 0.6:.3f});")
for y, t in marks:
    anim.append(f"tl.to('#strip .fill', {{scaleX:{max(pos[y], 0.001):.3f}, duration:0.9, ease:'power2.inOut'}}, {t - 0.3:.3f});")
    anim.append(f"tl.to('#yr{y}', {{className:'yr on'}}, {t:.3f});")
    anim.append(f"tl.fromTo('#yr{y} .dot', {{scale:1}}, {{scale:1.9, duration:0.35, yoyo:true, repeat:1, ease:'sine.inOut'}}, {t:.3f});")

# ---- Map: Kazakhstan with Almaty pin (scene 2) and Almaty→Astana arc (scene 5)
ax, ay = MAP['almaty']; sx, sy = MAP['astana']
nb = ''.join(f'<path d="{d}"/>' for d in MAP['neighbours'])
arc_mid = ((ax + sx) / 2 - 220, (ay + sy) / 2)
map_svg = f'''<svg viewBox="0 0 {MAP['w']} {MAP['h']}" class="mapsvg">
  <g class="nb">{nb}</g>
  <path class="kz" d="{MAP['kz']}"/>
  <path class="kzline" d="{MAP['kz']}" pathLength="1"/>
  <g class="pinA" transform="translate({ax:.1f},{ay:.1f})"><circle class="pulse" r="18"/><circle r="11"/><text x="26" y="12">АЛМАТЫ</text></g>
  <path class="arc" d="M{ax:.1f},{ay:.1f} Q{arc_mid[0]:.1f},{arc_mid[1]:.1f} {sx:.1f},{sy:.1f}" pathLength="1"/>
  <g class="pinS" transform="translate({sx:.1f},{sy:.1f})"><circle class="pulse" r="18"/><circle r="11"/><text x="26" y="-14">АСТАНА</text></g>
</svg>'''
m1s, m1e = sent(2, 1)[0] - 0.2, sent(2, 1)[1] + 0.3
clip('map1', m1s, m1e - m1s, map_svg.replace('class="mapsvg"', 'class="mapsvg m1"'), cls='map')
anim.append(f"""
  tl.fromTo('#map1', {{opacity:0, scale:1.06}}, {{opacity:1, scale:1, duration:1.0, ease:'power2.out'}}, {m1s:.3f});
  tl.fromTo('#map1 .kzline', {{strokeDashoffset:1}}, {{strokeDashoffset:0, duration:2.2, ease:'power2.inOut'}}, {m1s:.3f});
  tl.fromTo('#map1 .pinA', {{opacity:0}}, {{opacity:1, duration:0.4}}, {m1s + 0.9:.3f});
  tl.fromTo('#map1 .pinA .pulse', {{scale:1, opacity:0.9}}, {{scale:3.2, opacity:0, duration:1.4, repeat:1, ease:'sine.out'}}, {m1s + 1.0:.3f});
  tl.set('#map1 .pinS, #map1 .arc', {{opacity:0}}, {m1s:.3f});
  tl.to('#map1', {{opacity:0, duration:0.5}}, {m1e - 0.5:.3f});""")

m2s = sent(5, 1)[0] - 0.4; m2e = m2s + 4.6
clip('map2', m2s, m2e - m2s, map_svg.replace('class="mapsvg"', 'class="mapsvg m2"'), cls='map')
anim.append(f"""
  tl.fromTo('#map2', {{opacity:0}}, {{opacity:1, duration:0.7, ease:'power2.out'}}, {m2s:.3f});
  tl.set('#map2 .kzline', {{strokeDashoffset:0}}, {m2s:.3f});
  tl.fromTo('#map2 .arc', {{strokeDashoffset:1}}, {{strokeDashoffset:0, duration:1.8, ease:'power2.inOut'}}, {m2s + 0.6:.3f});
  tl.fromTo('#map2 .pinS', {{opacity:0, scale:0.4, transformOrigin:'50% 50%'}}, {{opacity:1, scale:1, duration:0.5, ease:'back.out(2)'}}, {m2s + 2.2:.3f});
  tl.fromTo('#map2 .pinS .pulse', {{scale:1, opacity:0.9}}, {{scale:3.2, opacity:0, duration:1.4, repeat:1, ease:'sine.out'}}, {m2s + 2.3:.3f});
  tl.to('#map2', {{opacity:0, duration:0.6}}, {m2e - 0.6:.3f});""")

# ---- Globe: "Қазақстан әлем картасында" (scene 3, sentence 3)
g0, g1 = sent(3, 3)[0] - 0.35, sent(3, 3)[1] + 0.9
gl = MAP['globe']
globe_layers = ''.join(f'<g class="gl gl{i}"><path class="sph" d="{g["sphere"]}"/><path class="grat" d="{g["grat"]}"/>'
                       f'<path class="land" d="{g["land"]}"/><path class="gkz" d="{g["kz"]}"/></g>' for i, g in enumerate(gl))
clip('globe', g0, g1 - g0, f'<svg viewBox="0 0 1600 1600" class="globesvg">{globe_layers}</svg>'
     f'<div class="glabel">ҚАЗАҚСТАН</div>', cls='globe')
step = (g1 - g0 - 1.4) / (len(gl) - 1)
anim.append(f"tl.fromTo('#globe', {{opacity:0, scale:0.92}}, {{opacity:1, scale:1, duration:1.0, ease:'power2.out'}}, {g0:.3f});")
anim.append(f"tl.set('#globe .gl', {{opacity:0}}, {g0:.3f}); tl.set('#globe .gl0', {{opacity:1}}, {g0:.3f});")
for i in range(1, len(gl)):
    anim.append(f"tl.to('#globe .gl{i}', {{opacity:1, duration:{step:.3f}, ease:'none'}}, {g0 + step * (i - 1) + 0.3:.3f});")
    anim.append(f"tl.to('#globe .gl{i - 1}', {{opacity:0, duration:{step:.3f}, ease:'none'}}, {g0 + step * (i - 1) + 0.3:.3f});")
anim.append(f"tl.fromTo('#globe .gkz', {{fillOpacity:0.55}}, {{fillOpacity:1, duration:1.0, ease:'sine.inOut'}}, {g1 - 1.9:.3f});")
anim.append(f"tl.fromTo('#globe .glabel', {{opacity:0, y:20}}, {{opacity:1, y:0, duration:0.8}}, {g1 - 1.8:.3f});")
anim.append(f"tl.to('#globe', {{opacity:0, duration:0.6}}, {g1 - 0.6:.3f});")

# ---- Source / context labels from EDL ----------------------------------
for i, s in enumerate(EDL.get('shots', [])):
    if not s.get('label'):
        continue
    st, en = s['start'] + 0.25, s['end'] - 0.15
    if en - st < 1.2:
        continue
    clip(f'lb{i}', st, en - st, f'<span class="bar"></span>{html.escape(s["label"])}', cls='srclabel')
    anim.append(f"tl.fromTo('#lb{i}', {{opacity:0, x:-16}}, {{opacity:1, x:0, duration:0.5, ease:'power2.out'}}, {st:.3f});")
    anim.append(f"tl.to('#lb{i}', {{opacity:0, duration:0.35}}, {en - 0.35:.3f});")

# ---- Subtitles -----------------------------------------------------------
for i, c in enumerate(cues):
    clip(f'sb{i}', c['start'], c['end'] - c['start'], f'<div class="sbt">{cue_html(c)}</div>', cls='sub')
    anim.append(f"tl.fromTo('#sb{i} .sbt', {{opacity:0, y:14}}, {{opacity:1, y:0, duration:0.22, ease:'power2.out'}}, {c['start']:.3f});")

# ---- Footage layer (from EDL) ---------------------------------------------
shot_els, shot_anim = [], []
SH = EDL.get('shots', [])
for i, s in enumerate(SH):
    tin = s.get('tin', 'fade') if i > 0 else 'cut'
    td = s.get('tdur', 0.45)
    nxt = SH[i + 1] if i + 1 < len(SH) else None
    vis0 = s['start'] - (td / 2 if tin == 'fade' else 0)
    vis1 = s['end']
    if nxt is not None and nxt.get('tin', 'fade') == 'fade':
        vis1 = s['end'] + nxt.get('tdur', 0.45) / 2
    vis1 = min(vis1, DUR)
    # media must start at the source in-point when the clip becomes visible
    media_off = 0.0 if tin != 'fade' else 0.0
    sid = s['id']
    if s['type'] == 'video':
        shot_els.append(f'<video id="{sid}" class="clip shot" src="media/shots/{sid}.mp4" data-start="{vis0:.3f}" '
                        f'data-duration="{vis1 - vis0:.3f}" data-media-start="{media_off:.3f}" muted playsinline></video>')
    else:
        shot_els.append(f'<img id="{sid}" class="clip shot img" src="media/shots/{sid}.jpg" data-start="{vis0:.3f}" '
                        f'data-duration="{vis1 - vis0:.3f}" alt=""/>')
    s0, s1, x0, x1, y0, y1 = s.get('mv', [1, 1.05, 0, 0, 0, 0])
    shot_anim.append(f"tl.fromTo('#{sid}', {{scale:{s0}, x:{x0}, y:{y0}}}, {{scale:{s1}, x:{x1}, y:{y1}, duration:{vis1 - vis0:.3f}, ease:'sine.inOut'}}, {vis0:.3f});")
    if tin == 'fade':
        shot_anim.append(f"tl.fromTo('#{sid}', {{opacity:0}}, {{opacity:1, duration:{td:.3f}, ease:'sine.inOut'}}, {vis0:.3f});")
    elif tin == 'dip':
        shot_anim.append(f"tl.fromTo('#{sid}', {{opacity:0}}, {{opacity:1, duration:{td:.3f}, ease:'sine.out'}}, {vis0:.3f});")
        if i > 0:
            p = SH[i - 1]['id']
            shot_anim.append(f"tl.to('#{p}', {{opacity:0, duration:{td:.3f}, ease:'sine.in'}}, {s['start'] - td:.3f});")
    if s.get('dim'):
        shot_els.append(f'<div id="dim{i}" class="clip dim" data-start="{s["start"]:.3f}" data-duration="{s["end"] - s["start"]:.3f}"></div>')
        shot_anim.append(f"tl.fromTo('#dim{i}', {{opacity:0}}, {{opacity:{s['dim']}, duration:0.6}}, {s['start']:.3f});")
        shot_anim.append(f"tl.to('#dim{i}', {{opacity:0, duration:0.4}}, {s['end'] - 0.4:.3f});")
anim[:0] = shot_anim

# ---- Global opening/closing fades -----------------------------------------
anim.append("tl.fromTo('#fadein', {opacity:1}, {opacity:0, duration:1.6, ease:'power1.inOut'}, 0);")

# ----------------------------------------------------------------------------
# 3. Assemble HTML
# ----------------------------------------------------------------------------
fonts = []
for fam, file, weights in [('Montserrat', 'montserrat', (500, 600, 700, 800)), ('Cormorant Garamond', 'cormorant-garamond', (500, 600, 700))]:
    for w in weights:
        for sub, rng in [('latin', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'),
                         ('cyrillic', 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'),
                         ('cyrillic-ext', 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F')]:
            fonts.append(f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:normal;font-display:block;"
                         f"src:url(fonts/{file}-{sub}-{w}-normal.woff2) format('woff2');unicode-range:{rng};}}")

CSS = r"""
:root{--gold:#E8C15A;--gold2:#F3D98B;--sky:#14B4D2;--ink:#F7F4EC;--night:#07131F;}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:2160px;height:3840px;overflow:hidden;background:#000}
#root{position:relative;width:2160px;height:3840px;overflow:hidden;background:#000;font-family:'Montserrat',sans-serif;color:var(--ink)}
.clip{position:absolute;left:0;width:2160px}
#root .shot{position:absolute;left:0;top:0;width:2160px;height:3840px;object-fit:cover;transform-origin:50% 50%}
#root .shot.img{left:-108px;top:-192px;width:2376px;height:4224px}
.dim{top:0;height:3840px;background:#000}
#grain{position:absolute;left:0;top:0;width:2160px;height:3840px;object-fit:cover;mix-blend-mode:overlay;opacity:.16}
#vign{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 85% 62% at 50% 48%,rgba(0,0,0,0) 55%,rgba(0,0,0,.42) 100%),
  linear-gradient(180deg,rgba(0,0,0,.40) 0%,rgba(0,0,0,0) 16%,rgba(0,0,0,0) 58%,rgba(0,0,0,.55) 82%,rgba(0,0,0,.70) 100%);}
#fadein{position:absolute;inset:0;background:#000}
/* titles */
.title{display:flex;flex-direction:column;align-items:center;text-align:center;text-shadow:0 6px 40px rgba(0,0,0,.65),0 2px 8px rgba(0,0,0,.5)}
.title .rule{width:520px;height:5px;margin:46px 0 40px;background:linear-gradient(90deg,rgba(232,193,90,0),var(--gold) 20%,var(--gold) 80%,rgba(232,193,90,0));transform-origin:50% 50%}
.title .kicker{font-weight:600;font-size:56px;letter-spacing:.42em;color:var(--gold2);margin-bottom:40px;padding-left:.42em}
.title .hero{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:252px;letter-spacing:.06em;line-height:1;padding-left:.06em}
.title .hero2{font-weight:800;font-size:150px;letter-spacing:.2em;padding-left:.2em;line-height:1}
.title .hero2 .num,.title .date .num{color:var(--gold);font-family:'Cormorant Garamond',serif;font-weight:700;font-size:1.45em;letter-spacing:0}
.title .years{margin-top:34px;font-weight:500;font-size:60px;letter-spacing:.3em;padding-left:.3em;opacity:.92}
.title .year{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:330px;line-height:.9;color:var(--gold);letter-spacing:.02em}
.title .year span{font-family:'Montserrat';font-weight:700;font-size:96px;letter-spacing:.24em;color:var(--ink);vertical-align:.9em;margin-left:18px}
.title .year.small{font-size:200px}
.title .year.small span{font-size:72px;vertical-align:.7em}
.title .year.mid{font-size:260px}
.title .date{font-weight:800;font-size:132px;letter-spacing:.12em;padding-left:.12em;line-height:1.1}
.title .sub{font-weight:700;font-size:76px;letter-spacing:.2em;padding-left:.2em;line-height:1.3}
.title .big{font-weight:800;font-size:150px;letter-spacing:.14em;padding-left:.14em;line-height:1.05}
.title .mid2{font-weight:700;font-size:96px;letter-spacing:.16em;padding-left:.16em;line-height:1.25}
.title .gold{color:var(--gold)}
/* timeline strip */
.strip{top:2420px;height:220px;padding:0 170px}
.strip .track{position:absolute;left:230px;right:230px;top:46px;height:3px;background:rgba(255,255,255,.25)}
.strip .fill{position:absolute;inset:0;background:var(--gold);transform-origin:0 50%}
.strip .yrs{position:absolute;left:170px;right:170px;top:0;display:flex;justify-content:space-between}
.strip .yr{width:120px;display:flex;flex-direction:column;align-items:center;opacity:.55;text-shadow:0 2px 10px rgba(0,0,0,.8)}
.strip .yr.on{opacity:1}
.strip .dot{width:22px;height:22px;border-radius:50%;background:#fff;margin-top:37px;box-shadow:0 0 0 6px rgba(0,0,0,.25)}
.strip .yr.on .dot{background:var(--gold)}
.strip .y{margin-top:20px;font-weight:700;font-size:46px;letter-spacing:.06em}
.strip .yr.on .y{color:var(--gold2)}
.strip .c{margin-top:6px;font-weight:600;font-size:26px;letter-spacing:.14em;opacity:.85;white-space:nowrap}
/* maps */
.map{top:1290px;height:1100px;display:flex;justify-content:center}
.mapsvg{width:1620px;height:1080px;overflow:visible;filter:drop-shadow(0 10px 40px rgba(0,0,0,.6))}
.mapsvg .nb path{fill:rgba(10,24,38,.35);stroke:rgba(255,255,255,.18);stroke-width:1.4}
.mapsvg .kz{fill:rgba(20,180,210,.30)}
.mapsvg .kzline{fill:none;stroke:var(--gold);stroke-width:4.5;stroke-dasharray:1;stroke-linejoin:round}
.mapsvg circle{fill:var(--gold)}
.mapsvg .pulse{fill:none;stroke:var(--gold);stroke-width:3}
.mapsvg text{fill:#fff;font-family:'Montserrat';font-weight:700;font-size:44px;letter-spacing:.12em;paint-order:stroke;stroke:rgba(0,0,0,.6);stroke-width:8px}
.mapsvg .arc{fill:none;stroke:var(--gold2);stroke-width:5;stroke-dasharray:1;stroke-linecap:round}
.globe{top:900px;height:1800px;display:flex;flex-direction:column;align-items:center}
.globesvg{width:1640px;height:1640px;position:relative}
.globesvg .gl{}
.globesvg .sph{fill:rgba(4,20,34,.55);stroke:rgba(232,193,90,.55);stroke-width:3}
.globesvg .grat{fill:none;stroke:rgba(255,255,255,.10);stroke-width:1.5}
.globesvg .land{fill:rgba(255,255,255,.16);stroke:rgba(255,255,255,.25);stroke-width:1}
.globesvg .gkz{fill:var(--gold);stroke:#fff;stroke-width:2.5}
.glabel{margin-top:10px;font-weight:800;font-size:84px;letter-spacing:.3em;padding-left:.3em;color:var(--gold2);text-shadow:0 4px 24px rgba(0,0,0,.7)}
/* source labels */
.srclabel{top:560px;left:150px;width:auto;max-width:1600px;display:flex;align-items:center;gap:22px;
  font-weight:600;font-size:42px;letter-spacing:.14em;color:rgba(255,255,255,.9);text-shadow:0 2px 10px rgba(0,0,0,.85)}
.srclabel .bar{display:inline-block;width:8px;height:46px;background:var(--gold)}
/* subtitles */
.sub{top:2580px;height:420px;display:flex;align-items:center;justify-content:center;padding:0 230px 0 190px}
.sbt{font-weight:700;font-size:86px;line-height:1.24;text-align:center;color:#fff;letter-spacing:.005em;
  text-shadow:0 0 18px rgba(0,0,0,.85),0 4px 12px rgba(0,0,0,.9),0 0 3px rgba(0,0,0,1)}
.sbt .g{color:var(--gold2)}
/* final */
.final{top:0;height:3840px;background:radial-gradient(ellipse 80% 55% at 50% 45%,rgba(7,30,48,.62),rgba(0,0,0,.86));display:flex;align-items:center;justify-content:center;text-align:center}
.fin-inner{display:flex;flex-direction:column;align-items:center;margin-top:-260px}
.final .sun{width:420px;height:420px;margin-bottom:60px}
.final .f1{font-weight:800;font-size:150px;letter-spacing:.12em;padding-left:.12em}
.final .f1 .num{font-family:'Cormorant Garamond',serif;color:var(--gold);font-size:1.5em;letter-spacing:0}
.final .f2{margin-top:20px;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:150px;letter-spacing:.08em;color:var(--gold2)}
.final .rule{width:620px;height:5px;margin:60px 0;background:linear-gradient(90deg,rgba(232,193,90,0),var(--gold) 20%,var(--gold) 80%,rgba(232,193,90,0));transform-origin:50% 50%}
.final .f3{font-weight:700;font-size:70px;letter-spacing:.2em;padding-left:.2em}
"""

plate = EDL.get('plate', 'media/plate.mp4')
html_doc = f'''<!doctype html>
<html lang="kk" data-resolution="portrait-4k">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width={W}, height={H}"/>
<title>ТӘУЕЛСІЗДІК — ЕҢ ҚЫМБАТ ҚҰНДЫЛЫҚ</title>
<script src="vendor/gsap.min.js"></script>
<style>
{''.join(fonts)}
{CSS}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="{W}" data-height="{H}" data-fps="30">
  {chr(10).join(shot_els)}
  <video id="grain" class="clip" src="media/grain.mp4" data-start="0" data-duration="{DUR}" muted playsinline></video>
  <div id="vign" class="clip" data-start="0" data-duration="{DUR}"></div>
  {chr(10).join(els)}
  <div id="fadein" class="clip" data-start="0" data-duration="2"></div>
</div>
<script>
  window.__timelines = window.__timelines || {{}};
  const tl = gsap.timeline({{paused:true}});
  {chr(10).join(anim)}
  window.__timelines["main"] = tl;
  tl.seek(0);
</script>
</body>
</html>
'''
open(P('hf/index.html'), 'w', encoding='utf-8').write(html_doc)
print('cues', len(cues), 'elements', len(els), 'scene starts', SC)
