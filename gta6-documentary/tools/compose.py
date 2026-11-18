"""Generate the HyperFrames composition (index.html) from build/timeline.json.

Every shot slot uses footage/cut/<SHOT>.mp4 when it exists (prepared by
prep_footage.py from official GTA VI footage). A slot without footage renders
as a clearly labelled animatic slate so the cut, VO, subtitles, typography and
sound can be reviewed — it never pretends to be game footage.
"""
import html, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
tl = json.load(open(os.path.join(ROOT, "build", "timeline.json")))
DUR = tl["duration"]
W, H = 2160, 3840
FADE = 0.5

PAL = {
    "hook": ("#ff6a3d", "#6d1b7b", "#140a14"),
    "characters": ("#ffb347", "#1f6f8b", "#0c1014"),
    "vicecity": ("#ff2d95", "#00d9ff", "#0b0716"),
    "world": ("#2ec4b6", "#ffd166", "#071311"),
    "expectations": ("#7b5cff", "#00b4d8", "#0a0a1a"),
    "final": ("#ffcf33", "#ff4d4d", "#140c06"),
}
CHAPTERS = {"characters": ("01", "ГЕРОИ"), "world": ("03", "ЖИВОЙ МИР"), "expectations": ("04", "ОЖИДАНИЯ"),
            "final": ("05", "ФИНАЛ")}


def section_of(t):
    for s in tl["sections"]:
        if s["start"] - 0.6 <= t < s["end"] - 0.6:
            return s["id"]
    return tl["sections"][-1]["id"]


def tc(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


def esc(s):
    return html.escape(s, quote=True)


shots = tl["shots"]
missing = []
els, js = [], []
z = 10

# ------------------------------------------------------------------ shots
for i, s in enumerate(shots):
    start, dur = s["start"], s["dur"]
    nxt = shots[i + 1] if i + 1 < len(shots) else None
    if nxt and nxt.get("trans_in") == "fade":
        dur += FADE                     # hold under the incoming cross-fade
    if nxt and nxt.get("trans_in") == "dip":
        dur += 0.0
    sec = section_of(s["start"])
    has = os.path.exists(os.path.join(ROOT, s["file"]))
    sid = f"shot_{s['id']}"
    common = f'id="{sid}" class="clip shot" data-start="{start:.3f}" data-duration="{dur:.3f}" style="z-index:{z + i}"'
    if has:
        els.append(f'<video {common} src="{s["file"]}" muted playsinline data-has-audio="false"></video>')
    else:
        missing.append(s["id"])
        a, b, bg = PAL[sec]
        els.append(f'''<div {common}>
  <div class="slate" style="--a:{a};--b:{b};--bg:{bg}">
    <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
    <div class="scan"></div>
    <div class="frame"><i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i></div>
    <div class="slate-box">
      <div class="slate-id">{s['id']} <span>·</span> {tc(s['start'])} → {tc(s['end'])}</div>
      <div class="slate-label">{esc(s['slate'])}</div>
      <div class="slate-note">СЛОТ ДЛЯ ОФИЦИАЛЬНОГО ВИДЕО GTA VI</div>
    </div>
  </div>
</div>''')
        js.append(f'tl.fromTo("#{sid} .b1",{{x:-120,y:-60}},{{x:140,y:90,duration:{dur:.3f},ease:"none"}},{start:.3f});')
        js.append(f'tl.fromTo("#{sid} .b2",{{x:100,y:80}},{{x:-160,y:-40,duration:{dur:.3f},ease:"none"}},{start:.3f});')
        js.append(f'tl.fromTo("#{sid} .b3",{{scale:0.9}},{{scale:1.15,duration:{dur:.3f},ease:"none"}},{start:.3f});')
    # camera move on the whole shot
    mv = s.get("move", "push")
    tgt = f"#{sid}"
    if mv == "push":
        js.append(f'tl.fromTo("{tgt}",{{scale:1.0}},{{scale:1.07,duration:{dur:.3f},ease:"none"}},{start:.3f});')
    elif mv == "pull":
        js.append(f'tl.fromTo("{tgt}",{{scale:1.09}},{{scale:1.0,duration:{dur:.3f},ease:"power1.out"}},{start:.3f});')
    elif mv == "drift":
        js.append(f'tl.fromTo("{tgt}",{{scale:1.06,x:-50}},{{scale:1.06,x:50,duration:{dur:.3f},ease:"none"}},{start:.3f});')
    elif mv == "shake":
        kf = ",".join(f'{{x:{x},y:{y},duration:{dur / 8:.3f}}}' for x, y in
                      [(8, -6), (-10, 5), (6, 9), (-7, -8), (10, 4), (-5, -6), (7, 7), (0, 0)])
        js.append(f'tl.set("{tgt}",{{scale:1.08}},{start:.3f});tl.to("{tgt}",{{keyframes:[{kf}],ease:"none"}},{start:.3f});')
    if s.get("trans_in") == "fade":
        js.append(f'tl.fromTo("{tgt}",{{opacity:0}},{{opacity:1,duration:{FADE},ease:"power1.inOut"}},{start:.3f});')

# ------------------------------------------------------------------ overlays (grade helpers)
els.append('<div class="vignette" style="z-index:200"></div>')
els.append('<div class="shade-top" style="z-index:201"></div>')
els.append('<div class="shade-bottom" style="z-index:201"></div>')

# transitions
for s in shots:
    t = s["start"]
    if s.get("trans_in") == "flash":
        els.append(f'<div id="fl_{s["id"]}" class="clip flash" data-start="{t - 0.04:.3f}" data-duration="0.4" style="z-index:400"></div>')
        js.append(f'tl.fromTo("#fl_{s["id"]}",{{opacity:0.85}},{{opacity:0,duration:0.36,ease:"power2.out"}},{t - 0.04:.3f});')
    if s.get("trans_in") == "dip":
        els.append(f'<div id="dp_{s["id"]}" class="clip dip" data-start="{t - 0.22:.3f}" data-duration="0.6" style="z-index:400"></div>')
        js.append(f'tl.fromTo("#dp_{s["id"]}",{{opacity:0}},{{opacity:0.82,duration:0.2,ease:"power1.in"}},{t - 0.22:.3f});')
        js.append(f'tl.to("#dp_{s["id"]}",{{opacity:0,duration:0.36,ease:"power1.out"}},{t:.3f});')

# chapter labels
for sec in tl["sections"]:
    if sec["id"] in CHAPTERS:
        first = min((s for s in shots if s["start"] >= sec["start"] - 0.6), key=lambda s: s["start"])
        t = first["start"] + 0.15
        num, name = CHAPTERS[sec["id"]]
        cid = f"ch_{sec['id']}"
        els.append(f'<div id="{cid}" class="clip chapter" data-start="{t:.3f}" data-duration="2.6" style="z-index:300">'
                   f'<span class="num">{num}</span><span class="bar"></span><span class="name">{name}</span></div>')
        js.append(f'tl.fromTo("#{cid}",{{opacity:0,x:-40}},{{opacity:1,x:0,duration:0.45,ease:"power3.out"}},{t:.3f});')
        js.append(f'tl.fromTo("#{cid} .bar",{{scaleX:0}},{{scaleX:1,duration:0.6,ease:"power3.out"}},{t + 0.1:.3f});')
        js.append(f'tl.to("#{cid}",{{opacity:0,duration:0.35}},{t + 2.2:.3f});')

# ------------------------------------------------------------------ motion typography
W_ = {(w["sid"], w["w"]): w for w in tl["words"]}
shot = {s["id"]: s for s in shots}


def word(sid, w):
    return W_[(sid, w)]


# 13 ЛЕТ
t0 = word("s01", "Тринадцать")["start"] - 0.05
t1 = shot["S02"]["start"] - 0.1
els.append(f'<div id="mt13" class="clip mt mt13" data-start="{t0:.3f}" data-duration="{t1 - t0:.3f}" style="z-index:310">'
           f'<div class="big">13</div><div class="sub">ЛЕТ ОЖИДАНИЯ</div></div>')
js += [f'tl.fromTo("#mt13 .big",{{opacity:0,scale:1.3}},{{opacity:1,scale:1,duration:0.6,ease:"power3.out"}},{t0:.3f});',
       f'tl.to("#mt13 .big",{{scale:0.94,duration:{t1 - t0 - 0.6:.3f},ease:"none"}},{t0 + 0.6:.3f});',
       f'tl.fromTo("#mt13 .sub",{{opacity:0,scaleX:1.35}},{{opacity:1,scaleX:1,duration:0.9,ease:"power2.out"}},{word("s01", "ожидания.")["start"] - 0.1:.3f});',
       f'tl.to("#mt13",{{opacity:0,y:-60,duration:0.3,ease:"power2.in"}},{t1 - 0.3:.3f});']

# GTA VI title
t0 = shot["S04"]["start"]
t1 = word("s03", "событий")["start"] - 0.1
els.append(f'<div id="mtgta" class="clip mt mtgta" data-start="{t0:.3f}" data-duration="{t1 - t0:.3f}" style="z-index:310">'
           f'<div class="rule l"></div><div class="big">GTA&nbsp;VI</div><div class="rule r"></div></div>')
js += [f'tl.fromTo("#mtgta .big",{{opacity:0,scale:0.86}},{{opacity:1,scale:1,duration:0.5,ease:"power3.out"}},{t0:.3f});',
       f'tl.to("#mtgta .big",{{scale:1.05,duration:{t1 - t0 - 0.5:.3f},ease:"none"}},{t0 + 0.5:.3f});',
       f'tl.fromTo("#mtgta .rule",{{scaleX:0}},{{scaleX:1,duration:0.7,ease:"power3.out"}},{t0 + 0.1:.3f});',
       f'tl.to("#mtgta",{{opacity:0,duration:0.25}},{t1 - 0.25:.3f});']

# name tags
for sid, name, role, w in (("S06", "ДЖЕЙСОН", "ГЛАВНЫЙ ГЕРОЙ", "Джейсон"), ("S07", "ЛЮСИЯ", "ГЛАВНАЯ ГЕРОИНЯ", "Люсия.")):
    t0, t1 = word("s04", w)["start"] - 0.05, shot[sid]["end"]
    nid = f"nm_{sid}"
    els.append(f'<div id="{nid}" class="clip nametag" data-start="{t0:.3f}" data-duration="{t1 - t0:.3f}" style="z-index:310">'
               f'<div class="tagbar"></div><div><div class="nm">{name}</div><div class="role">{role}</div></div></div>')
    js += [f'tl.fromTo("#{nid}",{{opacity:0,x:-90}},{{opacity:1,x:0,duration:0.4,ease:"power3.out"}},{t0:.3f});',
           f'tl.fromTo("#{nid} .tagbar",{{scaleY:0}},{{scaleY:1,duration:0.35,ease:"power3.out"}},{t0:.3f});',
           f'tl.to("#{nid}",{{opacity:0,x:-40,duration:0.2}},{t1 - 0.2:.3f});']

# Vice City title
t0, t1 = shot["S12"]["start"] + 0.1, shot["S13"]["start"]
els.append(f'<div id="mtvc" class="clip mt mtvc" data-start="{t0:.3f}" data-duration="{t1 - t0:.3f}" style="z-index:310">'
           f'<div class="pre">ДОБРО ПОЖАЛОВАТЬ В</div><div class="big">ВАЙС-СИТИ</div></div>')
js += [f'tl.fromTo("#mtvc .pre",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.5,ease:"power2.out"}},{t0:.3f});',
       f'tl.fromTo("#mtvc .big",{{opacity:0,scaleX:1.3}},{{opacity:1,scaleX:1,duration:1.0,ease:"power3.out"}},{word("s06", "Вайс-Сити.")["start"] - 0.2:.3f});',
       f'tl.to("#mtvc",{{opacity:0,scale:1.04,duration:0.3}},{t1 - 0.3:.3f});']

# word tags
for sid, text in (("S19", "ДЕТАЛИ"), ("S21", "ЖИВОЙ ГОРОД")):
    t0, t1 = shot[sid]["start"] + 0.1, shot[sid]["end"] - 0.05
    wid = f"wt_{sid}"
    els.append(f'<div id="{wid}" class="clip mt wordtag" data-start="{t0:.3f}" data-duration="{t1 - t0:.3f}" style="z-index:310">'
               f'<div class="big">{text}</div></div>')
    js += [f'tl.fromTo("#{wid} .big",{{opacity:0,scaleX:1.3}},{{opacity:1,scaleX:1,duration:0.7,ease:"power3.out"}},{t0:.3f});',
           f'tl.to("#{wid}",{{opacity:0,duration:0.25}},{t1 - 0.25:.3f});']

# end card
last = tl["words"][-1]["end"]
t0 = shot["S35"]["start"]
els.append(f'<div id="endshade" class="clip endshade" data-start="{t0:.3f}" data-duration="{DUR - t0:.3f}" style="z-index:250"></div>')
js.append(f'tl.fromTo("#endshade",{{opacity:0}},{{opacity:0.62,duration:{DUR - t0:.3f},ease:"power1.in"}},{t0:.3f});')
els.append(f'<div id="endcard" class="clip mt endcard" data-start="{t0 + 0.3:.3f}" data-duration="{DUR - t0 - 0.3:.3f}" style="z-index:320">'
           f'<div class="big">GTA&nbsp;VI</div><div class="q">ПРЕВЗОЙТИ ЛЕГЕНДУ?</div></div>')
js += [f'tl.fromTo("#endcard .big",{{opacity:0,scale:1.12}},{{opacity:1,scale:1,duration:1.2,ease:"power2.out"}},{t0 + 0.3:.3f});',
       f'tl.fromTo("#endcard .q",{{opacity:0,y:40}},{{opacity:1,y:0,duration:0.6,ease:"power3.out"}},{last + 0.15:.3f});']

# animatic watermark (only while slots are empty)
if missing:
    els.append(f'<div class="clip wm" data-start="0" data-duration="{DUR}" style="z-index:500">АНИМАТИК · ЧЕРНОВОЙ МОНТАЖ</div>')

# ------------------------------------------------------------------ subtitles
for k, c in enumerate(tl["subtitles"]):
    cid = f"sub{k:02d}"
    lines = []
    for ln in c["lines"]:
        spans = "".join(f'<span class="w{" hl" if w["hl"] else ""}">{esc(w["w"])}</span>' for w in ln)
        lines.append(f'<div class="ln">{spans}</div>')
    els.append(f'<div id="{cid}" class="clip sub" data-start="{c["start"]:.3f}" data-duration="{c["end"] - c["start"]:.3f}" style="z-index:350">'
               + "".join(lines) + "</div>")
    js.append(f'tl.fromTo("#{cid}",{{opacity:0,y:24}},{{opacity:1,y:0,duration:0.14,ease:"power2.out"}},{c["start"]:.3f});')
# pop each highlighted word as it is spoken
sub_words = []
for k, c in enumerate(tl["subtitles"]):
    idx = 0
    for ln in c["lines"]:
        for w in ln:
            sub_words.append((k, idx, w))
            idx += 1
cue_words = [w for w in tl["words"]]
for (k, idx, w), tw in zip(sub_words, cue_words):
    if w["hl"]:
        sel = f'#sub{k:02d} .w:nth-of-type({idx + 1})'
        js.append(f'tl.fromTo(document.querySelectorAll("#sub{k:02d} .w")[{idx}],{{scale:1}},{{scale:1.1,duration:0.12,yoyo:true,repeat:1,ease:"power1.out"}},{tw["start"]:.3f});')

els.append(f'<audio id="mix" src="audio/mix.wav" data-start="0" data-duration="{DUR}" data-volume="1"></audio>')

CSS = open(os.path.join(HERE, "style.css")).read()
page = f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<title>GTA 6 — The Game That Changed Everything?</title>
<style>
{CSS}
</style></head>
<body>
<div id="root" data-composition-id="root" data-width="{W}" data-height="{H}" data-fps="30" data-start="0" data-duration="{DUR}">
{chr(10).join(els)}
</div>
<script src="assets/vendor/gsap.min.js"></script>
<script>
const tl = gsap.timeline({{paused: true}});
{chr(10).join(js)}
tl.set({{}}, {{}}, {DUR});
window.__timelines = window.__timelines || {{}};
window.__timelines["root"] = tl;
</script>
</body></html>
'''
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(page)
json.dump({"missing_footage": missing, "shots": len(shots)}, open(os.path.join(ROOT, "build", "compose_report.json"), "w"), indent=1)
print(f"index.html written: {len(shots)} shots, {len(shots) - len(missing)} with footage, {len(missing)} animatic slates")
