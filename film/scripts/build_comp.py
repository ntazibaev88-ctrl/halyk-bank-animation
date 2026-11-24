"""Generate the HyperFrames composition (index.html) and SHOT_TIMELINE.csv from shots.py."""
import csv, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shots import resolve, DIPS, SCENES
SHOTS = resolve()

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
DUR = 120.0

def norm(s, i):
    s = dict(s)
    s["in"] = s.pop("in_", None)
    if "move" in s:
        s["move"] = {"from": s["move"]["from_"], "to": s["move"]["to"]}
    s.setdefault("tail", 0.0)
    s["z"] = 10 + i
    s["seed"] = (i * 1.7) % 6.28
    return s

def main():
    shots = [norm(s, i) for i, s in enumerate(SHOTS)]
    cues = json.load(open("build/cues.json"))
    data = {"shots": [{k: v for k, v in s.items() if k not in ("desc",)} for s in shots], "cues": cues, "dips": DIPS, "duration": DUR}

    els = []
    for s in shots:
        vis = round(s["end"] + s["tail"] - s["start"], 3)
        if s["kind"] == "video":
            els.append(f'  <video id="{s["id"]}" class="clip shot" src="assets/shots/{s["id"]}.mp4" muted playsinline data-start="{s["start"]}" data-duration="{vis}" data-media-start="0" style="z-index:{s["z"]};display:none"></video>')
        elif s["kind"] in ("gfx",):
            els.append(f'  <div id="{s["id"]}" class="clip gfx" data-start="{s["start"]}" data-duration="{vis}" style="z-index:{s["z"]};display:none"></div>')
        elif s["kind"] == "endcard":
            els.append(f'  <div id="{s["id"]}" class="clip gfx" data-start="{s["start"]}" data-duration="{vis}" style="z-index:900;display:none"></div>')
    html = f'''<!doctype html>
<html lang="kk" data-resolution="portrait-4k">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=2160, height=3840" />
<title>АТАНЫҢ АМАНАТЫ</title>
<link rel="stylesheet" href="assets/fonts/fonts.css" />
<link rel="stylesheet" href="assets/film.css" />
<script src="assets/js/gsap.min.js"></script>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="2160" data-height="3840" data-fps="30">
{chr(10).join(els)}
  <div id="interior" class="clip scene" data-start="0" data-duration="{DUR}" style="display:none"></div>
  <div id="dawn" class="clip scene" data-start="0" data-duration="{DUR}" style="display:none"></div>
  <div id="vignette" class="clip" data-start="0" data-duration="{DUR}"></div>
  <div id="grain" class="clip" data-start="0" data-duration="{DUR}"></div>
  <div id="flash" class="clip" data-start="0" data-duration="{DUR}"></div>
  <div id="label" class="clip" data-start="0" data-duration="{DUR}"><div class="bar"></div><div class="txt"></div></div>
  <div id="subs" class="clip" data-start="0" data-duration="{DUR}"></div>
  <div id="fadeblack" class="clip" data-start="0" data-duration="{DUR}"></div>
  <audio id="mix" src="assets/audio/final_mix.wav" data-start="0" data-duration="{DUR}" data-volume="1"></audio>
</div>
<script>window.FILM_DATA = {json.dumps(data, ensure_ascii=False)};</script>
<script src="assets/js/characters.js"></script>
<script src="assets/js/flag.js"></script>
<script src="assets/js/scenes.js"></script>
<script src="assets/js/graphics.js"></script>
<script src="assets/js/film.js"></script>
<script>
  window.__timelines = window.__timelines || {{}};
  FILM.init();
  const clock = {{ t: 0 }};
  const tl = gsap.timeline({{ paused: true }});
  tl.to(clock, {{ t: {DUR}, duration: {DUR}, ease: "none", onUpdate: () => FILM.render(clock.t) }}, 0);
  window.__timelines["main"] = tl;
  window.__filmReady = FLAG.load("assets/img/flag_kz.svg").then(() => {{ FILM.render(0); tl.seek(0); }});
  FILM.render(0);
</script>
</body>
</html>
'''
    open("index.html", "w").write(html)

    # Shot timeline CSV
    os.makedirs("../deliverables", exist_ok=True)
    with open("../deliverables/SHOT_TIMELINE.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["shot", "scene", "scene_title", "start_s", "end_s", "duration_s", "type", "transition_in", "on_screen_label", "description", "source", "source_in_s", "license"])
        lic = json.load(open("build/sources.json")) if os.path.exists("build/sources.json") else {}
        for s in shots:
            src = s.get("src", "")
            L = lic.get(src, {})
            kind = {"video": "footage", "interior": "animated scene (HyperFrames)", "dawn": "animated scene (HyperFrames)",
                    "gfx": "motion graphics (HyperFrames)", "endcard": "end titles (HyperFrames)"}[s["kind"]]
            tr = (s["in"] or {}).get("type", "cut")
            w.writerow([s["id"], s["scene"], SCENES[s["scene"]], f'{s["start"]:.2f}', f'{s["end"]:.2f}', f'{s["end"] - s["start"]:.2f}', kind, tr,
                        s.get("label", ""), s["desc"], L.get("title", src), s.get("src_in", ""), (L.get("lic", "") + " — " + L.get("artist", "")) if L else ""])
    print("wrote index.html and SHOT_TIMELINE.csv with", len(shots), "shots")

if __name__ == "__main__":
    main()
