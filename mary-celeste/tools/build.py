"""Rebuild everything that depends on the voiceover timing.

  index.html              root: scene hosts, overlay, captions host, voice/music/ambience
  compositions/captions.html   caption groups (Russian), synced to word timings
  compositions/*.html     <script id="sNN-cues"> blocks rewritten with scene-local cue times
  subtitles.srt / .vtt    sidecar subtitles

Run after tools/tts.py (and tools/audio.py). Scene files are hand-written; only
their cue block and @font-face block are touched here."""
import html, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scenes import plan

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = plan()
TOTAL = P["total"]
r3 = lambda x: round(x, 3)

# ───────────── cues for each scene ─────────────
for sc in P["scenes"]:
    a, b = sc["start"], sc["start"] + sc["duration"]
    segs = {}
    for s in P["segments"]:
        if s["end"] > a and s["start"] < b:
            segs[s["id"]] = {"s": r3(s["start"] - a), "e": r3(s["end"] - a),
                             "w": [[w["text"], r3(w["start"] - a), r3(w["end"] - a)] for w in s["words"]]}
    cues = {"dur": sc["duration"], "seg": segs}
    f = os.path.join(ROOT, "compositions", sc["id"] + ".html")
    if not os.path.exists(f): print("missing scene", sc["id"]); continue
    src = open(f, encoding="utf-8").read()
    key = sc["id"][:3]
    new = re.sub(r'(<script type="application/json" id="%s-cues">)(.*?)(</script>)' % key,
                 lambda m: m.group(1) + json.dumps(cues, ensure_ascii=False) + m.group(3), src, flags=re.S)
    if new == src and '"%s-cues"' % key not in src: print("no cue block in", sc["id"])
    open(f, "w", encoding="utf-8").write(new)

# ───────────── caption groups ─────────────
HIGHLIGHT = {  # (segment, first word, number of words) -> colour class
    ("n02", "цел.", 1): "gold", ("n03", "ни", 3): "red", ("n04", "1872", 1): "gold",
    ("n05", "«Мэри", 2): "gold", ("n06", "Бенджамин", 2): "gold", ("n09", "людей", 3): "red",
    ("n10", "спасательная", 2): "red", ("n11", "Что", 2): "red", ("n12", "непогода.", 1): "gold",
    ("n13", "грузом", 1): "gold", ("n13", "насосов.", 1): "gold", ("n14", "версии.", 1): "red",
    ("n15", "никто", 3): "red", ("n16", "полутора", 2): "gold", ("n17", "десять", 2): "red",
}
CAPS = {x["id"]: x["cap"] for x in json.load(open(os.path.join(ROOT, "tools/narration.json"), encoding="utf-8"))["segments"]}

def groups_for(seg):
    """Caption groups as authored in narration.json ("|" = break), checked word for word."""
    ws = [dict(w) for w in seg["words"]]
    for (sid, first, n), cls in HIGHLIGHT.items():
        if sid != seg["id"]: continue
        for i, w in enumerate(ws):
            if w["text"] == first:
                for k in range(i, i + n): ws[k]["hl"] = cls
                break
        else: raise SystemExit(f"highlight word not found: {sid} {first}")
    out, i = [], 0
    for piece in CAPS[seg["id"]].split("|"):
        words = piece.split()
        g = ws[i:i + len(words)]
        if [w["text"] for w in g] != words: raise SystemExit(f"caption mismatch in {seg['id']}: {words} vs {[w['text'] for w in g]}")
        out.append(g); i += len(words)
    if i != len(ws): raise SystemExit(f"caption words missing in {seg['id']}")
    return out

groups = []
for seg in P["segments"]:
    for g in groups_for(seg): groups.append(g)
# timing: open at first word, close at next group's start or 0.45 s after the last word
for i, g in enumerate(groups):
    st = g[0]["start"] - 0.06
    nxt = groups[i + 1][0]["start"] - 0.06 if i + 1 < len(groups) else TOTAL
    en = min(nxt, g[-1]["end"] + 0.45)
    if nxt - g[-1]["end"] < 0.7: en = nxt  # continuous speech: hand straight over
    g_meta = {"start": r3(max(0.1, st)), "end": r3(en)}
    groups[i] = (g, g_meta)

cap_html, cap_data = [], []
for i, (g, m) in enumerate(groups):
    spans = []
    for k, w in enumerate(g):
        cls = "cw" + (" hl-" + w["hl"] if "hl" in w else "")
        spans.append(f'<span class="{cls}">{html.escape(w["text"])}</span>')
    cap_html.append(f'      <div id="cap-{i:02d}" class="cap">{" ".join(spans)}</div>')
    cap_data.append({"id": f"cap-{i:02d}", "s": m["start"], "e": m["end"], "w": [r3(w["start"]) for w in g]})

captions = f'''<template>
  <style data-fonts></style>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    #cap-band {{ position: absolute; left: 64px; right: 156px; bottom: 600px; height: 200px; }}
    .cap {{
      position: absolute; left: 0; right: 0; bottom: 0; opacity: 0; visibility: hidden;
      text-align: center; text-wrap: balance;
      font-family: "MC Sans", sans-serif; font-weight: 700; font-size: 56px; line-height: 1.2;
      letter-spacing: -0.005em; color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 0 18px rgba(0, 0, 0, 0.75), 0 0 42px rgba(0, 0, 0, 0.5);
    }}
    .cw {{ display: inline-block; }}
    .hl-red {{ color: #ff5a4e; }}
    .hl-gold {{ color: #e2bf72; }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
    <div id="cap-band">
{chr(10).join(cap_html)}
    </div>
  </div>
  <script type="application/json" id="cap-data">{json.dumps(cap_data, ensure_ascii=False)}</script>
  <script>
    (function () {{
      const groups = JSON.parse(document.getElementById("cap-data").textContent);
      const tl = gsap.timeline({{ paused: true }});
      groups.forEach((g) => {{
        const el = document.getElementById(g.id);
        const words = el.querySelectorAll(".cw");
        tl.set(el, {{ visibility: "visible" }}, g.s);
        tl.fromTo(el, {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.14, ease: "power2.out" }}, g.s);
        // words not yet spoken sit slightly dimmer, each lights up as it is said
        words.forEach((w, k) => tl.fromTo(w, {{ opacity: 0.62 }}, {{ opacity: 1, duration: 0.08, ease: "none" }}, Math.max(g.s, g.w[k] - 0.02)));
        tl.to(el, {{ opacity: 0, duration: 0.12, ease: "power2.in" }}, g.e - 0.12);
        tl.set(el, {{ opacity: 0, visibility: "hidden" }}, g.e);
      }});
      window.__timelines["captions"] = tl;
    }})();
  </script>
</template>
'''
open(os.path.join(ROOT, "compositions/captions.html"), "w", encoding="utf-8").write(captions)

def ts(t, sep=","):
    h, rem = divmod(t, 3600); m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d}{sep}{int(round((s % 1) * 1000)) % 1000:03d}"
srt, vtt = [], ["WEBVTT", ""]
for i, (g, m) in enumerate(groups):
    text = " ".join(w["text"] for w in g)
    srt += [str(i + 1), f"{ts(m['start'])} --> {ts(m['end'])}", text, ""]
    vtt += [f"{ts(m['start'], '.')} --> {ts(m['end'], '.')}", text, ""]
open(os.path.join(ROOT, "subtitles.srt"), "w", encoding="utf-8").write("\n".join(srt))
open(os.path.join(ROOT, "subtitles.vtt"), "w", encoding="utf-8").write("\n".join(vtt))

# ───────────── music ducking lane from speech regions ─────────────
regions = []
for s in P["segments"]:
    if regions and s["start"] - regions[-1][1] < 1.0: regions[-1][1] = s["end"]
    else: regions.append([s["start"], s["end"]])
HIGH, LOW = 0.85, 0.36
pts = [{"t": 0, "v": HIGH}]
for a, b in regions:
    pts += [{"t": r3(a - 0.35), "v": HIGH}, {"t": r3(a - 0.05), "v": LOW}, {"t": r3(b + 0.1), "v": LOW}, {"t": r3(b + 0.5), "v": HIGH}]
pts.append({"t": TOTAL, "v": HIGH})
duck = json.dumps({"version": 1, "lanes": [{"target": "volume", "points": pts}]}).replace('"', "&quot;")

# ───────────── root composition ─────────────
hosts = []
for i, sc in enumerate(P["scenes"]):
    hosts.append(f'''      <div id="{sc['id']}" data-composition-id="{sc['id']}" data-composition-src="compositions/{sc['id']}.html"
        data-start="{sc['start']}" data-duration="{sc['duration']}" data-track-index="1" data-track-kind="graphics"
        data-width="1080" data-height="1920" style="z-index: {10 + i}"></div>''')
index = f'''<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Мэри Селеста — корабль-призрак</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <script src="assets/js/mc.js"></script>
    <style data-fonts></style>
    <style>
      :root {{
        --abyss: #04070b; --navy: #0a1622; --navy-2: #13263a; --steel: #3c5266;
        --grey: #8d99a6; --mist: #c6d0d9; --ink: #f3f5f7; --red: #e0392f; --gold: #d2ad62;
      }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: var(--abyss); }}
      #root {{ position: relative; width: 1080px; height: 1920px; overflow: hidden; background: var(--abyss); }}
      /* shared type system */
      .mc-display {{ font-family: "MC Display", sans-serif; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.01em; line-height: 0.98; color: var(--ink); }}
      .mc-display em, .mc-red {{ font-style: normal; color: var(--red); }}
      .mc-gold {{ color: var(--gold); font-style: normal; }}
      .mc-label {{ font-family: "MC Sans", sans-serif; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.16em; font-size: 28px; color: var(--mist); }}
      .mc-mono {{ font-family: "MC Mono", monospace; font-weight: 400; letter-spacing: 0.04em; }}
      .mc-serif {{ font-family: "MC Serif", serif; }}
      .w, .l {{ display: inline-block; white-space: pre; }}
      .mc-shadow {{ text-shadow: 0 4px 18px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.8); }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
{chr(10).join(hosts)}
      <div id="overlay" data-composition-id="overlay" data-composition-src="compositions/overlay.html"
        data-start="0" data-duration="{TOTAL}" data-track-index="2" data-track-kind="graphics"
        data-width="1080" data-height="1920" style="z-index: 50"></div>
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html"
        data-start="0" data-duration="{TOTAL}" data-track-index="3" data-track-kind="captions"
        data-width="1080" data-height="1920" style="z-index: 60"></div>

      <audio id="voice" class="clip" src="assets/audio/voice.wav" data-start="0" data-track-index="4"
        data-volume="1" data-audio-group="voiceover"></audio>
      <audio id="music" class="clip" src="assets/audio/music.mp3" data-start="0" data-duration="{TOTAL}" data-track-index="5"
        data-volume="1" data-fade-out="2.5" data-audio-group="music" data-timeline-role="music"
        data-automation="{duck}"></audio>
      <audio id="ambience" class="clip" src="assets/audio/ambience.mp3" data-start="0" data-duration="{TOTAL}" data-track-index="6"
        data-volume="0.75" data-fade-out="2" data-audio-group="sfx"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(index)
subprocess.run([sys.executable, os.path.join(ROOT, "tools/fonts.py")], check=True)
print(f"built: total {TOTAL}s, {len(groups)} caption groups, {len(regions)} speech regions")
