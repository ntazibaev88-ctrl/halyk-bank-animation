#!/usr/bin/env python3
"""Assembles index.html (root) and compositions/sN.html from src/ + data/timing.json.
Scene sources use: {{CSS}} {{JS}} (shared helpers) and @@ (unique id prefix, e.g. s3-)."""
import json, os, re, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()
T = json.load(open(f"{ROOT}/data/timing.json"))
CSS, JS = rd("src/shared/common.css"), rd("src/shared/common.js")
os.makedirs(f"{ROOT}/compositions", exist_ok=True)
scenes_html, wipes, ticks, wjs = [], [], [], []
total = T["total"]
for sc in T["scenes"]:
    i = sc["id"]
    sp = f"{ROOT}/src/scenes/s{i}.html"
    if not os.path.exists(sp):
        src = ('<template><style>{{CSS}}</style><div id="root" data-composition-id="s%d" data-width="1080" data-height="1920"></div>'
               '<script>(function(){const tl=gsap.timeline({paused:true});window.__timelines["s%d"]=tl})();</script></template>' % (i, i))
    else:
        src = rd(f"src/scenes/s{i}.html")
    inc = lambda m: rd(f"src/shared/{m.group(1)}.svgfrag").replace("##", m.group(2) or "")
    src = re.sub(r"\{\{include:(\w+)(?::(\w+))?\}\}", inc, src)
    src = src.replace("{{CSS}}", CSS).replace("{{JS}}", JS).replace("@@", f"s{i}-").replace("{{DUR}}", str(sc["dur"]))
    open(f"{ROOT}/compositions/s{i}.html", "w", encoding="utf-8").write(src)
    scenes_html.append(
        f'<div id="s{i}" class="clip sc" data-composition-id="s{i}" data-composition-src="compositions/s{i}.html" '
        f'data-start="{sc["start"]}" data-duration="{sc["dur"]}" data-track-index="1" data-track-kind="graphics" '
        f'data-width="1080" data-height="1920"></div>')
    ticks.append(f'<u style="left:{sc["start"]/total*940:.1f}px"></u>')
    if i > 1:
        b = sc["start"]
        wipes.append(f'<div id="wipe{i}" class="wipe clip" data-start="{b-0.4:.3f}" data-duration="0.9" data-track-index="7">'
                     f'<div class="flash" id="wf{i}"></div><div class="bar" id="wb{i}"></div></div>')
        wjs.append(f'tl.fromTo("#wb{i}",{{x:0}},{{x:2100,duration:.8,ease:"power2.inOut"}},{b-0.4:.3f});'
                   f'tl.fromTo("#wf{i}",{{opacity:0}},{{keyframes:[{{opacity:.55,duration:.2}},{{opacity:0,duration:.35}}],ease:"none"}},{b-0.2:.3f});')
cues = []
for k, c in enumerate(T["cues"]):
    words = c["words"]; d = max(0.3, c["end"] - c["start"])
    wts = [len(w["t"]) + 1 for w in words]; tot = sum(wts); acc = 0; spans = []
    for j, (w, wt) in enumerate(zip(words, wts)):
        spans.append(f'<span id="c{k}w{j}"{" class=hl" if w["hl"] else ""}>{w["t"]}</span>')
        wjs.append(f'tl.to("#c{k}w{j}",{{opacity:1,duration:.12,ease:"none"}},{c["start"] + d*0.92*acc/tot:.3f});')
        acc += wt
    cues.append(f'<div id="cue{k}" class="cue clip" data-start="{c["start"]}" data-duration="{d:.3f}" data-track-index="8">'
                f'<div class="cuebox" id="cb{k}">{" ".join(spans)}</div></div>')
    wjs.append(f'tl.fromTo("#cb{k}",{{y:14,opacity:0}},{{y:0,opacity:1,duration:.14,ease:"power2.out"}},{c["start"]:.3f});')
out = rd("src/root.tpl.html")
for a, b in {"{{TOTAL}}": str(round(total, 3)), "{{SCENES}}": "\n".join(scenes_html), "{{WIPES}}": "\n".join(wipes),
             "{{TICKS}}": "".join(ticks), "{{CUES}}": "\n".join(cues), "{{ROOTJS}}": "\n ".join(wjs)}.items():
    out = out.replace(a, b)
open(f"{ROOT}/index.html", "w", encoding="utf-8").write(out)
print("built", len(T["scenes"]), "scenes,", len(T["cues"]), "cues, total", total)
