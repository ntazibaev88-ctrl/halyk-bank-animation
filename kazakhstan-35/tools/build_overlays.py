"""Builds the title overlays (compositions/o1..o7.html) that sit over the 3D plate.
Edit the SPEC below (absolute film seconds), then run: python3 tools/build_overlays.py"""
import html, json, os

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(R, "script/timeline.json")))

# (id, in, out, kind, text, top_px)   kinds: year | kicker | title | big | chip | fact | goal | box | years
SPEC = {
 "o1": (0, 10.4, [
    ("o1-year", 0.0, 10.25, "year", "1991.", 236),
    ("o1-date", 3.15, 5.7, "kicker", "16 ЖЕЛТОҚСАН", 430),
    ("o1-title", 6.35, 10.25, "title", "ЖАҢА ДӘУІРДІҢ|*БАСТАЛУЫ*", 420),
 ]),
 "o2": (10.0, 23.4, [
    ("o2-head", 10.45, 12.75, "title", "АЛҒАШҚЫ|*ҚАДАМДАР*", 250),
    ("o2-y1", 12.95, 16.5, "year", "1992", 236),
    ("o2-k1", 13.2, 16.5, "kicker", "2 НАУРЫЗ · НЬЮ-ЙОРК", 410),
    ("o2-c1", 14.3, 16.5, "chip", "БІРІККЕН ҰЛТТАР ҰЙЫМЫНА МҮШЕЛІК", 470),
    ("o2-y2", 16.65, 19.4, "year", "1992", 236),
    ("o2-k2", 16.8, 19.4, "kicker", "4 МАУСЫМ", 410),
    ("o2-c2", 17.0, 19.4, "chip", "МЕМЛЕКЕТТІК РӘМІЗДЕР: ТУ ЖӘНЕ ЕЛТАҢБА", 470),
    ("o2-y3", 19.55, 23.2, "year", "1993", 236),
    ("o2-k3", 19.7, 23.2, "kicker", "15 ҚАРАША", 410),
    ("o2-c3", 20.65, 23.2, "chip", "ҰЛТТЫҚ ВАЛЮТА — ТЕҢГЕ", 470),
 ]),
 "o3": (23.0, 35.4, [
    ("o3-y", 23.6, 27.2, "year", "1997", 236),
    ("o3-k", 23.8, 27.2, "kicker", "10 ЖЕЛТОҚСАН", 410),
    ("o3-c", 24.95, 27.2, "chip", "ЕЛОРДА АЛМАТЫДАН АҚМОЛАҒА КӨШТІ", 470),
    ("o3-k2", 27.6, 30.9, "kicker", "1998 · ЖАҢА ЕЛОРДА", 260),
    ("o3-big", 29.2, 30.9, "big", "АСТАНА", 310),
    ("o3-c2", 31.1, 35.2, "chip", "БӘЙТЕРЕК", 300),
 ]),
 "o4": (35.0, 51.4, [
    ("o4-k", 35.5, 38.6, "kicker", "ТӘУЕЛСІЗДІК ЖЫЛДАРЫ", 260),
    ("o4-t", 36.4, 38.6, "title", "*ЭКОНОМИКА*", 310),
    ("o4-c0", 35.9, 38.6, "chip", "МҰНАЙ · ГАЗ", 1010),
    ("o4-c1", 39.0, 41.5, "chip", "МЕТАЛЛУРГИЯ", 300),
    ("o4-c2", 41.75, 43.0, "chip", "ТАУ-КЕН ӨНДІРІСІ", 300),
    ("o4-f", 41.9, 43.0, "fact", "ҚАЗАҚСТАН — ӘЛЕМДЕГІ №1 УРАН ӨНДІРУШІ (2009 ЖЫЛДАН БЕРІ)", 372),
    ("o4-c3", 43.25, 44.5, "chip", "АСТЫҚ · АУЫЛ ШАРУАШЫЛЫҒЫ", 300),
    ("o4-c4", 44.75, 47.5, "chip", "ТЕМІР ЖОЛ · КӨЛІК ДӘЛІЗДЕРІ", 300),
    ("o4-t2", 47.75, 51.2, "title", "ЕҢБЕКҚОР|*ХАЛЫҚ*", 260),
 ]),
 "o5": (51.0, 64.8, [
    ("o5-t", 51.6, 55.7, "title", "ЭКСПО-*2017*", 250),
    ("o5-k", 53.4, 55.7, "kicker", "АСТАНА · 10.06 — 10.09.2017", 360),
    ("o5-t2", 55.95, 58.6, "title", "«БОЛАШАҚ|*ЭНЕРГИЯСЫ*»", 250),
    ("o5-c", 57.55, 60.5, "chip", "100-ДЕН АСТАМ МЕМЛЕКЕТ", 450),
    ("o5-c2", 60.75, 64.6, "chip", "ӘЛЕМГЕ АШЫҚ", 260),
    ("o5-c3", 61.95, 64.6, "chip", "СЕНІМДІ СЕРІКТЕС", 340),
 ]),
 "o6": (64.4, 86.8, [
    ("o6-k", 65.1, 67.6, "kicker", "БҮГІНГІ ҚАЗАҚСТАН", 260),
    ("o6-t", 66.0, 67.6, "title", "ЦИФРЛЫҚ|*ДӘУІР*", 310),
    ("o6-c1", 67.95, 70.1, "chip", "ЖАСАНДЫ ИНТЕЛЛЕКТ", 280),
    ("o6-c2", 69.1, 70.1, "chip", "ЭЛЕКТРОНДЫҚ ҮКІМЕТ", 360),
    ("o6-c3", 70.4, 71.6, "chip", "ЗАМАНАУИ УНИВЕРСИТЕТТЕР", 280),
    ("o6-c4", 71.8, 72.75, "chip", "ЖАҢА ЗАУЫТТАР", 280),
    ("o6-c5", 72.9, 77.1, "chip", "КҮН МЕН ЖЕЛ ЭНЕРГИЯСЫ", 280),
    ("o6-f", 74.6, 77.1, "fact", "БҮГІН ЖҮЗЕГЕ АСЫП ЖАТЫР", 360),
    ("o6-r1", 79.5, 83.2, "role", "ИНЖЕНЕРЛЕР", 300),
    ("o6-r2", 80.35, 83.2, "role", "БАҒДАРЛАМАШЫЛАР", 372),
    ("o6-r3", 81.3, 83.2, "role", "ҒАЛЫМДАР", 444),
    ("o6-r4", 81.98, 83.2, "role", "КӘСІПКЕРЛЕР", 516),
    ("o6-sen", 83.45, 86.6, "big", "*СЕН!*", 330),
 ]),
 "o7": (86.4, 109.0, [
    ("o7-gh", 96.15, 98.5, "kicker", "АЛДАҒЫ МАҚСАТТАР", 280),
    ("o7-g1", 96.35, 98.5, "goal", "2030|ЖАҢАРТЫЛАТЫН ЭНЕРГИЯ — 15%", 340),
    ("o7-g2", 96.6, 98.5, "goal", "2060|КӨМІРТЕГІ БЕЙТАРАПТЫҒЫ", 430),
    ("o7-t1", 98.8, 109.0, "title", "ҚАЗАҚСТАН —|*35 ЖЫЛ*", 236),
    ("o7-w1", 100.9, 109.0, "word", "БІРЛІК.", 468),
    ("o7-w2", 101.4, 109.0, "word", "ЕҢБЕК.", 468),
    ("o7-w3", 102.79, 109.0, "word", "БОЛАШАҚ.", 468),
    ("o7-box", 103.95, 109.0, "box", "*16 ЖЕЛТОҚСАН —*|ТӘУЕЛСІЗДІК КҮНІ|*ҚҰТТЫ БОЛСЫН!*", 1180),
    ("o7-yrs", 105.4, 109.0, "years", "1991 — 2026", 560),
 ]),
}

CSS = """
    @font-face { font-family: "KZ Sans"; src: url("assets/fonts/Montserrat-Black.woff2") format("woff2"); font-weight: 900; }
    @font-face { font-family: "KZ Sans"; src: url("assets/fonts/Montserrat-Bold.woff2") format("woff2"); font-weight: 700; }
    @font-face { font-family: "KZ Serif"; src: url("assets/fonts/PlayfairDisplay-Black.woff2") format("woff2"); font-weight: 900; }
    #root { position: absolute; inset: 0; pointer-events: none; }
    .ov { position: absolute; left: 0; right: 0; text-align: center; }
    .ov > div { display: inline-block; }
    .year { font-family: "KZ Serif", serif; font-weight: 900; font-size: 150px; line-height: 1; letter-spacing: .01em;
      background: linear-gradient(180deg, #FFF3CC 0%, #F6C453 48%, #B47B22 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
      filter: drop-shadow(0 6px 24px rgba(0,0,0,.55)); }
    .kicker { font-family: "KZ Sans", sans-serif; font-weight: 700; font-size: 32px; letter-spacing: .28em; color: #FFE6A3; text-shadow: 0 2px 14px rgba(0,0,0,.8), 0 0 2px rgba(0,0,0,.6); }
    .title { font-family: "KZ Sans", sans-serif; font-weight: 900; font-size: 84px; line-height: 1.02; color: #FFFFFF; letter-spacing: .015em;
      text-shadow: 0 4px 30px rgba(0,0,0,.65), 0 1px 3px rgba(0,0,0,.6); }
    .big { font-family: "KZ Sans", sans-serif; font-weight: 900; font-size: 150px; line-height: 1; color: #FFFFFF; letter-spacing: .08em; text-shadow: 0 8px 40px rgba(0,0,0,.6); }
    .g { color: #F6C453; }
    .chip { font-family: "KZ Sans", sans-serif; font-weight: 700; font-size: 32px; letter-spacing: .08em; color: #FFFFFF; padding: 14px 26px; border-radius: 40px;
      background: rgba(6,16,36,.62); border: 1.5px solid rgba(246,196,83,.85); box-shadow: 0 10px 30px rgba(0,0,0,.35); max-width: 900px; }
    .fact { font-family: "KZ Sans", sans-serif; font-weight: 900; font-size: 30px; letter-spacing: .04em; color: #06122A; padding: 12px 22px; border-radius: 12px;
      background: linear-gradient(180deg, #FFE6A3, #F6C453); max-width: 900px; }
    .role { font-family: "KZ Sans", sans-serif; font-weight: 900; font-size: 46px; letter-spacing: .08em; color: #FFFFFF; text-shadow: 0 4px 24px rgba(0,0,0,.8); }
    .role::before { content: ""; display: inline-block; width: 34px; height: 4px; margin: 0 18px 12px 0; background: #F6C453; vertical-align: middle; }
    .goal { font-family: "KZ Sans", sans-serif; font-weight: 700; font-size: 30px; letter-spacing: .03em; color: #FFFFFF; text-align: left; padding: 16px 24px; border-radius: 18px;
      background: rgba(6,16,36,.7); border: 1.5px solid rgba(246,196,83,.75); width: 880px; }
    .goal b { font-weight: 900; color: #F6C453; margin-right: 16px; }
    .goal i { float: right; font-style: normal; color: #6FE3F2; }
    .word { font-family: "KZ Sans", sans-serif; font-weight: 900; font-size: 60px; letter-spacing: .08em; color: #F6C453; text-shadow: 0 4px 24px rgba(0,0,0,.7); }
    .box { font-family: "KZ Sans", sans-serif; font-weight: 900; font-size: 46px; line-height: 1.16; color: #FFFFFF; padding: 22px 34px 24px; border-radius: 26px;
      background: rgba(6,16,36,.66); border: 2px solid rgba(246,196,83,.9); box-shadow: 0 16px 50px rgba(0,0,0,.4); }
    .years { font-family: "KZ Sans", sans-serif; font-weight: 700; font-size: 32px; letter-spacing: .4em; color: #FFFFFF; text-shadow: 0 2px 16px rgba(0,0,0,.8); }
"""

def markup(text):
    lines = []
    for line in text.split("|"):
        parts = line.split("*")
        lines.append("".join(f'<span class="g">{html.escape(p)}</span>' if i % 2 else html.escape(p) for i, p in enumerate(parts)))
    return "<br />".join(lines)

def build(cid, start, end, items):
    D = round(end - start, 3)
    body, js = [], []
    words_row = [it for it in items if it[3] == "word"]
    for (iid, a, b, kind, text, top) in items:
        la, lb = round(a - start, 3), round(min(b, end) - start, 3)
        if kind == "goal":
            year, label = text.split("|"); inner = f"<b>{html.escape(year)}</b>{html.escape(label)}<i>МАҚСАТ</i>"
        else:
            inner = markup(text)
        if kind == "word":
            continue
        body.append(f'    <div id="{iid}" class="clip ov" data-start="{la}" data-duration="{round(lb - la, 3)}" data-track-index="1" style="top:{top}px"><div class="{kind}">{inner}</div></div>')
        hold = lb >= D - 0.01
        js.append(f'  inOut("#{iid} > div", {la}, {lb}, "{kind}", {str(hold).lower()});')
    if words_row:
        a0 = min(w[1] for w in words_row) - start; top = words_row[0][5]
        spans = "".join(f'<span id="{w[0]}" class="word" style="display:inline-block;margin:0 12px">{html.escape(w[4])}</span>' for w in words_row)
        body.append(f'    <div id="{cid}-words" class="clip ov" data-start="{round(a0, 3)}" data-duration="{round(D - a0, 3)}" data-track-index="1" style="top:{top}px"><div>{spans}</div></div>')
        for w in words_row:
            js.append(f'  tl.fromTo("#{w[0]}", {{ opacity: 0, y: 26, filter: "blur(8px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "expo.out" }}, {round(w[1] - start, 3)});')
    return f'''<template>
  <style>{CSS}  </style>
  <div id="root" data-composition-id="{cid}" data-width="1080" data-height="1920" data-duration="{D}">
{chr(10).join(body)}
  </div>
  <script>
  const tl = gsap.timeline({{ paused: true }});
  function inOut(sel, a, b, kind, hold) {{
    const big = kind === "year" || kind === "big" || kind === "title";
    tl.fromTo(sel, {{ opacity: 0, y: big ? 0 : 18, scale: big ? 1.12 : 1, filter: "blur(10px)" }}, {{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: big ? 0.6 : 0.4, ease: "expo.out" }}, a);
    if (!hold) tl.to(sel, {{ opacity: 0, filter: "blur(6px)", duration: 0.22, ease: "power2.in" }}, b - 0.24);
  }}
{chr(10).join(js)}
  window.__timelines["{cid}"] = tl;
  </script>
</template>
'''

for cid, (a, b, items) in SPEC.items():
    open(os.path.join(R, "compositions", f"{cid}.html"), "w", encoding="utf-8").write(build(cid, a, b, items))
    print(cid, len(items))
