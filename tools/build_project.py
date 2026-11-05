#!/usr/bin/env python3
"""Assemble the Hyperframes project from editable sources.

  src/scenes/sceneN.html  --(+ src/shared/base.css, fx.js, timing)-->  compositions/sceneN.html
  script/narration.json + script/timing.json  -->  compositions/subs.html, compositions/fx.html,
                                                   compositions/hud.html, index.html,
                                                   subtitles_ru.srt, voiceover_ru.txt

Run after `build_voice.py` (timing) and whenever a source file changes.
"""
import json, os, re, math, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
T = json.load(open(P("script", "timing.json")))
N = json.load(open(P("script", "narration.json")))
TOTAL = T["duration"]
SCENES = T["scenes"]
W, H = 1080, 1920


def rd(path):
    return open(path, encoding="utf-8").read()


def wr(path, s):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(s)


# --------------------------------------------------------------------------- scenes
def build_scenes():
    base_css, fx_js = rd(P("src/shared/base.css")), rd(P("src/shared/fx.js"))
    for sc in SCENES:
        src = P("src/scenes", sc["id"] + ".html")
        if not os.path.exists(src):
            continue
        body = rd(src)
        chunks = [c for c in T["chunks"] if c["scene"] == sc["id"]]
        rel = [round(c["start"] - sc["start"], 3) for c in chunks]
        rel_end = [round(c["end"] - sc["start"], 3) for c in chunks]
        m = re.search(r"<script>(.*)</script>", body, re.S)
        js = m.group(1)
        prelude = (
            f"const D = {sc['duration']}; // scene length (s)\n"
            f"const CH = {json.dumps(rel)}; // narration chunk starts, scene-relative\n"
            f"const CE = {json.dumps(rel_end)}; // narration chunk ends, scene-relative\n"
        )
        script = "<script>\n(function(){\n" + fx_js + "\n" + prelude + js + "\n})();\n</script>"
        body = body[: m.start()] + script + body[m.end():]
        out = "<template>\n<style>\n" + base_css + "\n</style>\n" + body + "\n</template>\n"
        wr(P("compositions", sc["id"] + ".html"), out)


# --------------------------------------------------------------------------- subtitles
def tokens(text):
    out, hl = [], False
    for part in re.split(r"(\*)", text):
        if part == "*":
            hl = not hl
            continue
        words = part.split()
        glued = bool(part) and not part[0].isspace()
        for k, w in enumerate(words):
            if k == 0 and glued and out and (not w[0].isalnum()):
                out[-1] = (out[-1][0] + w, out[-1][1])   # punctuation sticks to the previous word
            else:
                out.append((w, hl))
    return out


def split_cues(chunk, maxc=54):
    toks = tokens(chunk["text"])
    total = sum(len(w) + 1 for w, _ in toks) - 1
    n = max(1, math.ceil(total / maxc))
    target = total / n
    groups, cur, cl = [], [], 0
    for w, h in toks:
        if cur and cl + len(w) + 1 > target * 1.12 and len(groups) < n - 1:
            groups.append(cur); cur, cl = [], 0
        cur.append((w, h)); cl += len(w) + 1
    groups.append(cur)
    words = chunk.get("words")
    if words and len(words) == len(toks):
        # real word timestamps from the ASR alignment: each cue starts/ends exactly on its words
        cues, i = [], 0
        for g in groups:
            ws = words[i: i + len(g)]; i += len(g)
            cues.append({"toks": g, "start": ws[0]["s"], "end": ws[-1]["e"], "first": not cues})
        return cues
    lens = [sum(len(w) + 1 for w, _ in g) for g in groups]
    s, e = chunk["start"], chunk["end"]
    span = e - s
    acc, cues = 0, []
    for g, l in zip(groups, lens):
        a = s + span * acc / sum(lens)
        acc += l
        b = s + span * acc / sum(lens)
        cues.append({"toks": g, "start": a, "end": b, "first": not cues})
    return cues


def line_break(toks):
    txt_len = sum(len(w) + 1 for w, _ in toks) - 1
    if txt_len <= 24 or len(toks) < 2:
        return [toks]
    best, bi = 1e9, 1
    for i in range(1, len(toks)):
        a = sum(len(w) + 1 for w, _ in toks[:i]) - 1
        b = sum(len(w) + 1 for w, _ in toks[i:]) - 1
        if abs(a - b) < best:
            best, bi = abs(a - b), i
    return [toks[:bi], toks[bi:]]


def all_cues():
    cues = []
    for c in T["chunks"]:
        cues += split_cues(c)
    for i, c in enumerate(cues):
        c["show"] = max(0.0, c["start"] - (0.06 if c["first"] else 0.0))
        c["hide"] = c["end"] + 0.28
    for i in range(len(cues) - 1):          # never overlap: the next cue owns the screen
        if cues[i]["hide"] > cues[i + 1]["show"] - 0.02:
            cues[i]["hide"] = max(cues[i]["end"] - 0.02, cues[i + 1]["show"] - 0.02)
    cues[-1]["hide"] = min(cues[-1]["hide"], TOTAL)
    return cues


def srt_time(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def build_subs():
    cues = all_cues()
    srt, items, js = [], [], []
    for i, c in enumerate(cues):
        lines = line_break(c["toks"])
        srt.append(f"{i+1}\n{srt_time(c['show'])} --> {srt_time(c['hide'])}\n" +
                   "\n".join(" ".join(w for w, _ in ln) for ln in lines) + "\n")
        inner = "<br>".join(
            " ".join(f'<span class="hl">{html.escape(w)}</span>' if h else html.escape(w) for w, h in ln)
            for ln in lines)
        dur = round(c["hide"] - c["show"], 3)
        items.append(f'    <div id="sub{i}" class="clip sub" data-start="{c["show"]:.3f}" data-duration="{dur}" data-track-index="1"><p>{inner}</p></div>')
        js.append(f'    sub({i}, {c["show"]:.3f}, {dur}, {"true" if any(h for _, h in c["toks"]) else "false"});')
    wr(P("subtitles_ru.srt"), "\n".join(srt))
    page = f"""<template>
<style>
@font-face{{font-family:"F45 Text";font-weight:700;src:url("assets/fonts/inter-cyrillic-700-normal.woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}}
@font-face{{font-family:"F45 Text";font-weight:700;src:url("assets/fonts/inter-latin-700-normal.woff2");unicode-range:U+0000-00FF,U+2000-206F,U+2212}}
#root{{position:absolute;inset:0;pointer-events:none}}
.shade{{position:absolute;left:0;right:0;bottom:0;height:760px;background:linear-gradient(0deg,rgba(0,4,12,.78),rgba(0,4,12,.42) 55%,rgba(0,4,12,0))}}
.sub{{position:absolute;left:60px;width:960px;top:1290px;height:230px;display:flex;align-items:flex-end;justify-content:center;text-align:center}}
.sub p{{margin:0;font:700 62px/1.2 "F45 Text","Inter",sans-serif;color:#fff;letter-spacing:-.005em;text-shadow:0 3px 18px rgba(0,0,0,.95),0 0 3px rgba(0,0,0,.9)}}
.sub .hl{{color:#22e4ff;text-shadow:0 0 26px rgba(34,228,255,.75),0 3px 14px rgba(0,0,0,.9)}}
</style>
<div id="root" data-composition-id="subs" data-width="{W}" data-height="{H}">
  <div class="shade"></div>
{chr(10).join(items)}
</div>
<script>
(function(){{
  const tl = gsap.timeline({{ paused: true }});
  function sub(i, at, dur, hasHl) {{
    const p = "#sub" + i + " p", h = "#sub" + i + " .hl";
    tl.fromTo(p, {{ opacity: 0, y: 30, filter: "blur(10px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: .24, ease: "power3.out" }}, at);
    if (hasHl) tl.fromTo(h, {{ scale: 1 }}, {{ scale: 1.07, duration: .18, ease: "power2.out", yoyo: true, repeat: 1 }}, at + .16);
    tl.to(p, {{ opacity: 0, y: -12, filter: "blur(6px)", duration: .16, ease: "power2.in" }}, at + dur - .17);
  }}
{chr(10).join(js)}
  window.__timelines["subs"] = tl;
}})();
</script>
</template>
"""
    wr(P("compositions", "subs.html"), page)
    return cues


# --------------------------------------------------------------------------- fx + hud
def build_fx():
    bounds = [s["start"] for s in SCENES[1:]]
    els, js = [], []
    for i, b in enumerate(bounds):
        a = max(0.0, b - 0.5)
        els.append(f'''  <div id="fx{i}" class="clip fxb" data-start="{a:.3f}" data-duration="1.3" data-track-index="2">
    <div id="fx{i}-flash" class="flash"></div><div id="fx{i}-beam" class="beam"></div>
    <div id="fx{i}-s1" class="streak" style="top:560px"></div><div id="fx{i}-s2" class="streak" style="top:1010px"></div><div id="fx{i}-s3" class="streak" style="top:1340px"></div>
  </div>''')
        js.append(f"""  (function(){{ const t={a:.3f}, k="#fx{i}";
    tl.fromTo(k+"-flash",{{opacity:0}},{{opacity:.92,duration:.2,ease:"power2.in"}},t+.3);
    tl.to(k+"-flash",{{opacity:0,duration:.55,ease:"power2.out"}},t+.52);
    tl.fromTo(k+"-beam",{{x:-1500,opacity:1}},{{x:1700,duration:.9,ease:"power3.inOut"}},t+.1);
    ["-s1","-s2","-s3"].forEach(function(s,j){{
      tl.fromTo(k+s,{{scaleX:0,opacity:1,transformOrigin:j%2?"100% 50%":"0% 50%"}},{{scaleX:1,duration:.3,ease:"power3.out"}},t+.2+j*.04);
      tl.to(k+s,{{opacity:0,duration:.3,ease:"power2.in"}},t+.5+j*.04);
    }});
  }})();""")
    page = f"""<template>
<style>
#root{{position:absolute;inset:0;pointer-events:none}}
.fxb{{position:absolute;inset:0}}
.flash{{position:absolute;inset:0;opacity:0;background:radial-gradient(70% 45% at 50% 50%,#fff 0%,#bff6ff 30%,#22e4ff 70%,#0a5fb0 100%)}}
.beam{{position:absolute;left:0;top:-300px;width:260px;height:2600px;opacity:0;transform:rotate(18deg);background:linear-gradient(90deg,rgba(34,228,255,0),rgba(190,250,255,.95),rgba(34,228,255,0));box-shadow:0 0 120px 40px rgba(34,228,255,.5)}}
.streak{{position:absolute;left:0;width:1080px;height:3px;opacity:0;background:linear-gradient(90deg,rgba(34,228,255,0),#bff6ff 40%,#fff 60%,rgba(34,228,255,0));box-shadow:0 0 18px #22e4ff}}
</style>
<div id="root" data-composition-id="fx" data-width="{W}" data-height="{H}">
{chr(10).join(els)}
</div>
<script>
(function(){{
  const tl = gsap.timeline({{ paused: true }});
{chr(10).join(js)}
  window.__timelines["fx"] = tl;
}})();
</script>
</template>
"""
    wr(P("compositions", "fx.html"), page)


def build_hud():
    n = len(SCENES)
    labels = "".join(
        f'<div id="hud-ch{i}" class="clip ch" data-start="{s["start"]:.3f}" data-duration="{s["duration"]:.3f}" data-track-index="1">{i+1:02d}<em> / {n:02d}</em></div>'
        for i, s in enumerate(SCENES))
    ticks = "".join(f'<i class="tick" style="left:{s["start"]/TOTAL*100:.3f}%"></i>' for s in SCENES[1:])
    page = f"""<template>
<style>
@font-face{{font-family:"F45 Mono";font-weight:600;src:url("assets/fonts/jetbrains-mono-cyrillic-600-normal.woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}}
@font-face{{font-family:"F45 Mono";font-weight:600;src:url("assets/fonts/jetbrains-mono-latin-600-normal.woff2");unicode-range:U+0000-00FF,U+2000-206F,U+2212,U+25A0-25FF}}
#root{{position:absolute;inset:0;pointer-events:none;font-family:"F45 Mono",monospace;font-weight:600}}
.brand{{position:absolute;left:90px;top:92px;font-size:22px;letter-spacing:.3em;color:#7fa6c4;white-space:nowrap}}
.brand b{{color:#22e4ff;font-weight:600}}
.rec{{position:absolute;left:90px;top:128px;font-size:18px;letter-spacing:.24em;color:#7fa6c4;white-space:nowrap}}
.ch{{position:absolute;right:90px;top:90px;font-size:30px;color:#22e4ff;letter-spacing:.12em;text-shadow:0 0 14px rgba(34,228,255,.7)}}
.ch em{{font-style:normal;color:#7fa6c4}}
.bar{{position:absolute;left:90px;right:90px;top:1722px;height:3px;background:rgba(127,166,196,.22)}}
.fillbar{{position:absolute;left:0;top:0;height:3px;width:100%;background:linear-gradient(90deg,#2f7bff,#22e4ff);box-shadow:0 0 14px #22e4ff;transform-origin:0 50%}}
.tick{{position:absolute;top:-6px;width:2px;height:15px;background:rgba(127,166,196,.55)}}
.time{{position:absolute;left:90px;top:1744px;font-size:20px;letter-spacing:.2em;color:#7fa6c4}}
.corner{{position:absolute;width:44px;height:44px;border:0 solid rgba(34,228,255,.55)}}
</style>
<div id="root" data-composition-id="hud" data-width="{W}" data-height="{H}">
  <div class="brand"><b>◼</b> FUTURE&nbsp;2045 <span style="color:#7fa6c4">//</span> DOC</div>
  <div class="rec">ДОКУМЕНТАЛЬНЫЙ ФИЛЬМ · 9:16</div>
  {labels}
  <div class="bar"><div id="hud-fill" class="fillbar"></div>{ticks}</div>
  <div class="corner" style="left:50px;top:50px;border-top-width:2px;border-left-width:2px"></div>
  <div class="corner" style="right:50px;top:50px;border-top-width:2px;border-right-width:2px"></div>
  <div class="corner" style="left:50px;bottom:50px;border-bottom-width:2px;border-left-width:2px"></div>
  <div class="corner" style="right:50px;bottom:50px;border-bottom-width:2px;border-right-width:2px"></div>
</div>
<script>
(function(){{
  const tl = gsap.timeline({{ paused: true }});
  tl.fromTo("#hud-fill",{{scaleX:0}},{{scaleX:1,duration:{TOTAL},ease:"none"}},0);
  window.__timelines["hud"] = tl;
}})();
</script>
</template>
"""
    wr(P("compositions", "hud.html"), page)


# --------------------------------------------------------------------------- index
def build_index():
    hosts = []
    for i, s in enumerate(SCENES):
        hosts.append(f'''    <div id="{s["id"]}" class="clip" data-composition-id="{s["id"]}" data-composition-src="compositions/{s["id"]}.html"
         data-start="{s["start"]:.3f}" data-duration="{s["duration"]:.3f}" data-track-index="0" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>''')
    def host(i, extra=""):
        return (f'''    <div id="{i}" class="clip" data-composition-id="{i}" data-composition-src="compositions/{i}.html"
         data-start="0" data-duration="{TOTAL}" data-track-index="{extra}" data-width="{W}" data-height="{H}"></div>''')
    page = f"""<!doctype html>
<html lang="ru" data-resolution="portrait">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width={W}, height={H}" />
  <title>2045: Мир, который думает за тебя</title>
  <script src="assets/vendor/gsap.min.js"></script>
  <style>
    html, body {{ margin:0; width:{W}px; height:{H}px; overflow:hidden; background:#01040b; }}
    #root {{ position:relative; width:{W}px; height:{H}px; overflow:hidden; background:#01040b; }}
    #root > .clip {{ position:absolute; left:0; top:0; width:{W}px; height:{H}px; }}
    #scene1{{z-index:1}} #scene2{{z-index:2}} #scene3{{z-index:3}} #scene4{{z-index:4}} #scene5{{z-index:5}}
    #scene6{{z-index:6}} #scene7{{z-index:7}} #scene8{{z-index:8}} #scene9{{z-index:9}}
    #fx{{z-index:50}} #hud{{z-index:60}} #subs{{z-index:70}}
  </style>
</head>
<body>
  <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="{W}" data-height="{H}" data-fps="30">
{chr(10).join(hosts)}
{host("fx", 2).replace('class="clip"', 'class="clip" data-track-kind="graphics"')}
{host("hud", 3).replace('class="clip"', 'class="clip" data-track-kind="graphics"')}
{host("subs", 4).replace('class="clip"', 'class="clip" data-track-kind="captions"')}

    <audio id="vo"    src="audio/voiceover_ru.wav" data-start="0" data-duration="{TOTAL}" data-track-index="5" data-volume="1"></audio>
    <audio id="music" src="audio/music.wav"        data-start="0" data-duration="{TOTAL}" data-track-index="6" data-volume="0.5"></audio>
    <audio id="sfx"   src="audio/sfx.wav"          data-start="0" data-duration="{TOTAL}" data-track-index="7" data-volume="0.45"></audio>
  </div>
  <script>
    window.__timelines = window.__timelines || {{}};
    window.__timelines["main"] = gsap.timeline({{ paused: true }});
  </script>
</body>
</html>
"""
    wr(P("index.html"), page)


STRESS = {  # stress marks (U+0301) for the words a narrator / TTS most often gets wrong
    "2045": "две ты́сячи со́рок пя́том", "году": "году́", "искусственный": "иску́сственный", "интеллект": "интелле́кт",
    "беспилотный": "беспило́тный", "транспорт": "тра́нспорт", "инфраструктурой": "инфраструкту́рой", "маршруты": "маршру́ты",
    "самостоятельно": "самостоя́тельно", "интеллектуальные": "интеллектуа́льные", "сети": "се́ти", "энергетика": "энерге́тика",
    "ветряные": "ветряны́е", "балансировать": "баланси́ровать", "электричества": "электри́чества", "производство": "произво́дство",
    "потребление": "потребле́ние", "становится": "стано́вится", "признаки": "при́знаки", "медицина": "медици́на",
    "виртуальной": "виртуа́льной", "объединяться": "объединя́ться", "окончательные": "оконча́тельные", "планирует": "плани́рует",
    "прикосновения": "прикоснове́ния", "регулирует": "регули́рует", "товары": "това́ры", "сортируют": "сортиру́ют",
    "технологиями": "техноло́гиями", "ограничивается": "ограни́чивается", "контролирует": "контроли́рует", "произойдёт": "произойдёт",
    "самостоятельно?": "самостоя́тельно?", "разумными": "разу́мными", "умными": "у́мными", "управлять": "управля́ть",
}
DIRECTION = {
    "scene1": "медленно, низко, с лёгкой загадкой; пауза после «2045 году»",
    "scene2": "тепло, уверенно, объясняюще",
    "scene3": "уверенно, ровный поступательный ритм",
    "scene4": "уверенно; акцент на «управляет»",
    "scene5": "серьёзно; смысловой акцент на «человеческого контроля»",
    "scene6": "живо, с интересом",
    "scene7": "уверенно, с подъёмом к «интеллектуальные сети»",
    "scene8": "медленнее, серьёзно, с напряжением; паузы после каждого вопроса",
    "scene9": "очень медленно, тихо и весомо; длинная пауза перед «А останемся ли мы…»; финальный вопрос — с сильным эмоциональным акцентом",
}


def stressed(text):
    out = []
    for w in text.replace("*", "").split():
        core = re.sub(r"^[«(]+|[»),.:;!?—]+$", "", w)
        key = core.lower().replace("ё", "ё")
        rep = STRESS.get(key) or STRESS.get(core)
        if rep:
            rep = rep if core[:1].islower() or core.isdigit() else rep[:1].upper() + rep[1:]
            w = w.replace(core, rep)
        out.append(w)
    return " ".join(out)


def build_text():
    def mmss(x): return f"{int(x//60):02d}:{x%60:05.2f}"
    L = ["2045: МИР, КОТОРЫЙ ДУМАЕТ ЗА ТЕБЯ — сценарий для записи диктора (готов к озвучке)",
         "",
         "Голос: глубокий, тёплый мужской, нормативное (московское) произношение, документальная подача.",
         "Темп: 125–140 слов в минуту. Ударения отмечены знаком «´». Паузы: / — короткая (≈0,4 с), // — драматическая (≈0,8–1 с).",
         "Окончания произносить полностью, согласные — чётко. Цифры читать словами.",
         "Замена голоса: запишите текст ниже и выполните `python3 tools/align_voice.py ваш_файл.wav` — монтаж и субтитры подстроятся сами.",
         ""]
    narr = {sc["id"]: sc for sc in N["scenes"]}
    for i, s in enumerate(SCENES):
        L.append(f"СЦЕНА {i+1} — {s['name'].upper()}   [{mmss(s['start'])} – {mmss(s['end'])}]")
        L.append(f"Подача: {DIRECTION.get(s['id'], '')}")
        line = []
        for c in narr[s["id"]]["chunks"]:
            line.append(stressed(c["t"]))
            g = c.get("gap")
            if g: line.append("//" if g >= .6 else "/")
        L.append(" ".join(line).replace(" / //", " //"))
        L.append("Тайм-коды реплик в ролике:")
        for c in T["chunks"]:
            if c["scene"] == s["id"]: L.append(f"   {mmss(c['start'])}–{mmss(c['end'])}  {c['text'].replace('*', '')}")
        L.append("")
    L.append("ФИНАЛЬНЫЙ ЭКРАН (без озвучки — тишина, сердцебиение, финальный удар): «БУДУЩЕЕ СОЗДАЁМ МЫ.»  Малый текст: «Ты готов к 2045 году?»")
    wr(P("voiceover_ru.txt"), "\n".join(L) + "\n")


if __name__ == "__main__":
    build_scenes()
    cues = build_subs()
    build_fx()
    build_hud()
    build_index()
    build_text()
    print(f"built: {len(cues)} subtitle cues, total {TOTAL}s")
