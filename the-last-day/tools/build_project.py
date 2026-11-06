"""Write index.html, compositions/s1..s7.html and compositions/captions.html.

The HTML it writes is the editable source (Studio edits it). Re-run this only to regenerate
everything from the tables below: python3 tools/build_project.py
"""
import json, os, re, html, subprocess

ROOT = os.path.join(os.path.dirname(__file__), "..")
VO = json.load(open(os.path.join(ROOT, "assets/audio/vo/vo_meta.json")))
CUT = 58.95  # hard cut to black

SCENES = [  # id, start, duration, what
    ("s1", 0.0, 5.0, "Street attack (hook) + title"),
    ("s2", 5.0, 7.0, "Emergency broadcast"),
    ("s3", 12.0, 10.0, "Wakes up, the window, the city"),
    ("s4", 22.0, 10.0, "Knocking, pounding, the bolt"),
    ("s5", 32.0, 13.0, "Knife, lights out, hiding"),
    ("s6", 45.0, 10.0, "The message"),
    ("s7", 55.0, 5.0, "The reveal, hard cut to black"),
]

# narration: key -> start (s). Subtitle groups: '|' splits groups, *word* = red horror word.
NARRATION = [
    ("l01", 3.25, "В ту ночь | город *умер.*"),
    ("l02", 5.50, "По всем каналам — | экстренный выпуск."),
    ("l03", 8.15, "Неизвестный *вирус.*"),
    ("l04", 9.70, "*Заражённые* | *нападают* на людей."),
    ("l05", 12.70, "Я проснулся | от тишины."),
    ("l06", 15.00, "Подошёл к окну..."),
    ("l07", 16.30, "и понял: | города больше *нет.*"),
    ("l08", 19.00, "Только дым... сирены... | И *они.*"),
    ("l09", 23.40, "А потом | в дверь *постучали.*"),
    ("l10", 25.70, "Сначала тихо."),
    ("l11", 27.30, "Потом — так, | будто её хотели *выбить.*"),
    ("l12", 30.00, "Я закрыл дверь | на засов."),
    ("l13", 32.90, "Я схватил *нож.*"),
    ("l14", 34.25, "Выключил свет."),
    ("l15", 36.20, "Спрятался в *темноте.* | И ждал."),
    ("l16", 41.00, "Стук прекратился."),
    ("l17", 43.00, "И стало только | *страшнее.*"),
    ("l18", 45.90, "Телефон завибрировал."),
    ("l19", 48.00, "*Неизвестный* номер."),
    ("l20", 50.05, "«Не открывай *дверь.*»"),
    ("l21", 52.35, "«Я уже *внутри.*»"),
    ("l22", 55.50, "Я медленно *обернулся...*"),
]

# sound effects: (file, start, volume, duration or None, fade_out). Starts put each peak 1 frame after its picture.
F = 1 / 30
SFX = [
    # 1 street attack
    ("sfx/steps_run.wav", 0.0, 0.55, None, 0),
    ("sfx/scream_far_1.wav", 0.15, 0.35, None, 0),
    ("sfx/growl_1.wav", 0.55, 0.45, None, 0),
    ("sfx/whoosh_dark.wav", 1.30, 0.6, None, 0),
    ("sfx/growl_close.wav", 1.75, 0.85, 1.25, 0.25),
    ("sfx/sub_boom.wav", 2.26 - 0.376 + F, 0.9, 1.35, 0.4),
    ("sfx/scream_close.wav", 2.26 - 0.128 + F, 0.75, 0.95, 0.3),
    ("sfx/impact-bass-1.mp3", 2.26 - 0.073 + F, 0.8, None, 0),
    ("sfx/glitch-1.mp3", 2.30, 0.45, 0.75, 0.2),
    ("sfx/sting.wav", 2.50 - 0.178 + F, 0.75, 0.85, 0.3),
    ("sfx/impact-bass-2.mp3", 3.05 - 1.986 + F, 0.55, 2.3, 0.3),
    ("sfx/siren_far.wav", 4.4, 0.28, 7.6, 1.5),
    # 2 broadcast
    ("sfx/static_burst.wav", 4.97, 0.6, None, 0),
    ("sfx/tv_static.wav", 5.0, 0.16, 7.0, 0.3),
    ("sfx/eas_tone.wav", 5.08, 0.22, None, 0),
    ("sfx/static_burst.wav", 7.98, 0.5, None, 0),
    ("sfx/static_burst.wav", 11.30, 0.5, None, 0),
    ("sfx/glitch-2.mp3", 11.40, 0.35, 0.6, 0.2),
    # 3 wake, window
    ("sfx/breathing.wav", 12.40, 0.28, 2.6, 0.4),
    ("sfx/siren_far.wav", 13.0, 0.28, 9.0, 1.0),
    ("sfx/creak.wav", 14.60, 0.35, None, 0),
    ("sfx/whoosh_dark.wav", 17.0 - 0.512 + F, 0.45, None, 0),
    ("sfx/scream_far_2.wav", 18.40, 0.3, None, 0),
    ("sfx/whoosh_dark.wav", 19.4 - 0.512 + F, 0.4, None, 0),
    ("sfx/growl_2.wav", 19.80, 0.4, None, 0),
    ("sfx/growl_1.wav", 20.60, 0.3, None, 0),
    # 4 the door (soft knocks / pounding mirror s4.js SOFT and POUND, +22 s)
    ("sfx/step_heavy_1.wav", 21.95, 0.35, None, 0),
    ("sfx/step_heavy_2.wav", 22.18, 0.35, None, 0),
    ("sfx/knock_soft_1.wav", 22.40 + F, 0.8, None, 0),
    ("sfx/knock_soft_2.wav", 22.75 + F, 0.8, None, 0),
    ("sfx/knock_soft_3.wav", 23.10 + F, 0.8, None, 0),
    ("sfx/breathing.wav", 25.0, 0.3, 5.5, 0.5),
    ("sfx/knock_soft_2.wav", 25.40 + F, 0.85, None, 0),
    ("sfx/knock_soft_1.wav", 25.80 + F, 0.85, None, 0),
    ("sfx/door_pound_1.wav", 26.90 + F, 0.9, None, 0),
    ("sfx/door_pound_2.wav", 27.50 + F, 0.9, None, 0),
    ("sfx/door_pound_3.wav", 28.00 + F, 0.9, None, 0),
    ("sfx/door_pound_1.wav", 28.40 + F, 0.95, None, 0),
    ("sfx/door_pound_2.wav", 28.80 + F, 0.95, None, 0),
    ("sfx/door_pound_3.wav", 29.20 + F, 1.0, None, 0),
    ("sfx/bolt.wav", 30.60 - 0.433 + F, 0.9, None, 0),
    # 5 knife, lights out, hiding (pounding mirrors s5.js POUND, +32 s)
    ("sfx/knife_draw.wav", 33.0 - 0.224 + F, 0.7, None, 0),
    ("sfx/click.mp3", 34.35 - 0.073 + F, 0.9, None, 0),
    ("sfx/sub_boom.wav", 34.35 - 0.376 + F, 0.35, None, 0),
    ("sfx/heartbeat.wav", 35.60, 0.6, None, 0),
    ("sfx/breathing.wav", 36.0, 0.3, 4.8, 0.5),
    ("sfx/door_pound_1.wav", 36.00 + F, 0.65, None, 0),
    ("sfx/door_pound_2.wav", 36.60 + F, 0.65, None, 0),
    ("sfx/door_pound_3.wav", 37.30 + F, 0.7, None, 0),
    ("sfx/door_pound_1.wav", 38.10 + F, 0.7, None, 0),
    ("sfx/door_pound_2.wav", 39.00 + F, 0.75, None, 0),
    ("sfx/door_pound_3.wav", 40.00 + F, 0.8, None, 0),
    ("sfx/door_pound_1.wav", 40.70 + F, 0.85, None, 0),
    ("sfx/step_heavy_2.wav", 42.20, 0.3, None, 0),
    ("sfx/step_heavy_3.wav", 42.90, 0.25, None, 0),
    ("sfx/step_heavy_1.wav", 43.60, 0.18, None, 0),
    # 6 the message
    ("sfx/phone_buzz.wav", 45.30, 0.75, None, 0),
    ("sfx/notification.mp3", 50.0 - 0.229 + F, 0.45, None, 0),
    ("sfx/heartbeat.wav", 50.40, 0.55, None, 0),
    ("sfx/notification.mp3", 52.3 - 0.229 + F, 0.45, None, 0),
    ("sfx/impact-bass-1.mp3", 52.3 - 0.073 + F, 0.6, None, 0),
    # 7 the reveal, everything stops at the hard cut
    ("sfx/creak.wav", 55.10, 0.5, None, 0),
    ("sfx/breathing.wav", 55.20, 0.25, 3.0, 0.3),
    ("sfx/riser.mp3", 58.4 - 3.472, 0.45, None, 0),
    ("sfx/step_heavy_1.wav", 56.60, 0.45, None, 0),
    ("sfx/growl_2.wav", 57.40, 0.35, None, 0),
    ("sfx/impact-bass-2.mp3", 58.4 - 1.986 + F, 0.9, None, 0),
    ("sfx/sub_boom.wav", 58.4 - 0.376 + F, 1.0, None, 0),
    ("sfx/sting.wav", 58.4 - 0.178 + F, 0.95, None, 0),
    ("sfx/scream_close.wav", 58.4 - 0.128 + F, 0.85, None, 0),
    ("sfx/growl_close.wav", 58.30, 0.8, None, 0),
]
AMBIENCE = [  # file, start, volume, duration, media_start
    ("sfx/amb_city.wav", 0.0, 0.4, 5.2, 0.0),
    ("sfx/amb_room.wav", 5.0, 0.22, 25.0, 0.0),
    ("sfx/amb_city.wav", 17.0, 0.45, 5.0, 6.0),
    ("sfx/amb_room.wav", 30.0, 0.22, 25.0, 0.0),
    ("sfx/amb_room.wav", 55.0, 0.2, CUT - 55.0, 3.0),
]

FONTS = """    @font-face { font-family: "Oswald"; font-weight: 200 700; src: url("assets/fonts/oswald-cyr.woff2") format("woff2"); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
    @font-face { font-family: "Oswald"; font-weight: 200 700; src: url("assets/fonts/oswald-lat.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
    @font-face { font-family: "Montserrat"; font-weight: 100 900; src: url("assets/fonts/montserrat-cyr.woff2") format("woff2"); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
    @font-face { font-family: "Montserrat"; font-weight: 100 900; src: url("assets/fonts/montserrat-lat.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }"""


def scene_file(sid, dur, what):
    title = ""
    tl_extra = ""
    if sid == "s1":
        title = """
    <div id="s1-title" class="s1-title">
      <div id="s1-title-main" class="s1-title-main">ПОСЛЕДНИЙ<br />ДЕНЬ</div>
      <div id="s1-title-ghost" class="s1-title-main s1-ghost" data-layout-allow-overlap>ПОСЛЕДНИЙ<br />ДЕНЬ</div>
      <div id="s1-title-ep" class="s1-title-ep">ЭПИЗОД 1</div>
    </div>"""
        tl_extra = """
      // title card over the high wide (3.05 s): hard in with a glitch, holds, out at the cut
      tl.fromTo("#s1-title-main", { opacity: 0, scale: 1.18, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "power4.out" }, 3.15);
      tl.fromTo("#s1-title-ghost", { opacity: 0, x: 0 }, { opacity: 0.7, x: 14, duration: 0.06, ease: "none" }, 3.15);
      tl.to("#s1-title-ghost", { opacity: 0, x: -10, duration: 0.12, ease: "none" }, 3.24);
      tl.fromTo("#s1-title-ghost", { opacity: 0 }, { opacity: 0.55, x: 8, duration: 0.05, ease: "none", immediateRender: false }, 4.1);
      tl.to("#s1-title-ghost", { opacity: 0, duration: 0.08, ease: "none" }, 4.16);
      tl.fromTo("#s1-title-ep", { opacity: 0, scaleX: 1.25 }, { opacity: 1, scaleX: 1, duration: 0.8, ease: "power2.out" }, 3.5);
      tl.to("#s1-title", { opacity: 0, duration: 0.15, ease: "power2.in" }, 4.83);"""
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; background: #000; overflow: hidden; }}
    #root canvas {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }}
    .s1-title {{ position: absolute; left: 0; top: 600px; width: 1080px; text-align: center; }}
    .s1-title-main {{ position: absolute; left: 0; top: 0; width: 1080px; font-family: "Oswald", sans-serif; font-weight: 700; font-size: 156px; line-height: 0.98; letter-spacing: 0.03em; white-space: nowrap; color: #e9edf2; text-shadow: 0 4px 30px rgba(0,0,0,0.9), 0 0 2px #000; }}
    .s1-ghost {{ color: #d0141c; mix-blend-mode: screen; }}
    .s1-title-ep {{ position: absolute; left: 0; top: 345px; width: 1080px; font-family: "Oswald", sans-serif; font-weight: 500; font-size: 40px; letter-spacing: 0.55em; color: #ff4a4a; text-shadow: 0 2px 12px rgba(0,0,0,0.9); }}
  </style>
  <!-- {what}. Picture is drawn by FILM.scenes.{sid} (assets/scenes/{sid}.js) from scene time. -->
  <div id="root" data-composition-id="{sid}" data-width="1080" data-height="1920">
    <canvas id="{sid}-cv" width="1080" height="1920"></canvas>{title}
  </div>
  <script>
    (function () {{
      const cv = document.getElementById("{sid}-cv"), ctx = cv.getContext("2d");
      const D = {dur};
      // GSAP drives a getter/setter, so every seek redraws the canvas at exactly that time
      const clock = {{ _t: 0, t(v) {{ if (v === undefined) return this._t; this._t = v; window.FILM.scenes.{sid}(ctx, v); }} }};
      const tl = gsap.timeline({{ paused: true }});
      tl.fromTo(clock, {{ t: 0 }}, {{ t: D, duration: D, ease: "none" }}, 0);{tl_extra}
      window.FILM.scenes.{sid}(ctx, 0);
      window.__timelines["{sid}"] = tl;
    }})();
  </script>
</template>
"""


def caption_groups():
    groups = []
    for key, start, text in NARRATION:
        meta = VO[key]
        parts_text = [p.strip() for p in text.split("|")]
        speech = meta["speech"]
        n = len(parts_text)
        if len(meta["parts"]) == n and n > 1:
            spans = [(start + a, start + b) for a, b in meta["parts"]]
        else:
            lens = [len(re.sub(r"[*«»]", "", p)) for p in parts_text]
            tot = sum(lens)
            spans, acc = [], 0.0
            for L in lens:
                a = start + speech * acc / tot
                acc += L
                spans.append((a, start + speech * acc / tot))
        for p, (a, b) in zip(parts_text, spans):
            groups.append({"text": p, "start": round(a, 3), "end": round(b, 3)})
    # each group shows from its first word until the next group (max 0.6 s after its last word)
    for i, g in enumerate(groups):
        nxt = groups[i + 1]["start"] if i + 1 < len(groups) else 99
        g["show"] = round(max(0.05, g["start"] - 0.04), 3)
        g["hide"] = round(min(nxt - 0.02, g["end"] + 0.6, CUT - 0.01), 3)
    return groups


def captions_file(groups):
    rows = []
    for i, g in enumerate(groups):
        words = []
        for w in g["text"].split():
            red = w.startswith("*") or "*" in w
            clean = html.escape(w.replace("*", ""))
            cls = "w red" if red else "w"
            words.append(f'<span class="{cls}">{clean}</span>')
        rows.append(f'    <div id="cap-{i:02d}" class="cap" data-show="{g["show"]}" data-hide="{g["hide"]}">{" ".join(words)}</div>')
    body = "\n".join(rows)
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    /* bottom of the safe band (168-1330 px), clear of the right-hand action rail */
    .cap {{ position: absolute; left: 0; top: 1150px; width: 1080px; padding: 0 130px; text-align: center;
      font-family: "Montserrat", sans-serif; font-weight: 900; font-size: 66px; line-height: 1.12; color: #ffffff;
      letter-spacing: -0.01em; opacity: 0; overflow: visible;
      text-shadow: 0 3px 10px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9); }}
    .cap .w {{ display: inline-block; }}
    .cap .red {{ color: #ff2a2a; text-shadow: 0 0 18px rgba(255,20,20,0.45), 0 3px 10px rgba(0,0,0,0.9); }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920" data-layout-allow-caption-zone>
{body}
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      document.querySelectorAll("[data-composition-id='captions'] .cap").forEach((el) => {{
        const a = parseFloat(el.dataset.show), b = parseFloat(el.dataset.hide);
        tl.fromTo(el, {{ opacity: 0, y: 14, filter: "blur(6px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.14, ease: "power3.out" }}, a);
        el.querySelectorAll(".red").forEach((w) => {{
          tl.fromTo(w, {{ scale: 1.22 }}, {{ scale: 1, duration: 0.32, ease: "power3.out" }}, a + 0.05);
        }});
        tl.to(el, {{ opacity: 0, duration: 0.1, ease: "power2.in" }}, b - 0.1);
        tl.set(el, {{ opacity: 0, visibility: "hidden" }}, b);
      }});
      window.__timelines["captions"] = tl;
    }})();
  </script>
</template>
"""


_DUR = {}


def file_dur(src):
    if src not in _DUR:
        _DUR[src] = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(ROOT, "assets/audio", src)]).decode())
    return _DUR[src]


def audio_tag(id_, src, start, vol, dur=None, media_start=0, fade_out=0, track=10):
    a = f'      <audio id="{id_}" class="clip" src="assets/audio/{src}" data-start="{start:.3f}"'
    if dur:
        a += f' data-duration="{dur:.3f}"'
    if media_start:
        a += f' data-media-start="{media_start:.3f}"'
    a += f' data-volume="{vol}"'
    if fade_out:
        a += f' data-fade-out="{fade_out}"'
    return a + f' data-track-index="{track}"></audio>'


def index_file():
    hosts = []
    for i, (sid, start, dur, what) in enumerate(SCENES):
        hosts.append(f'''      <!-- {start:.0f}-{start + dur:.0f}s: {what} -->
      <div id="{sid}" class="clip scene" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html"
        data-start="{start}" data-duration="{dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index: {i + 1}"></div>''')
    hosts.append('''      <!-- Russian subtitles, synced to the narration -->
      <div id="captions" class="clip" data-composition-id="captions" data-composition-src="compositions/captions.html"
        data-start="0" data-duration="60" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index: 20"></div>''')
    audio = ["      <!-- MUSIC: original score (tools/make_audio.py), cut dead at the hard cut -->",
             audio_tag("music-score", "music/score.wav", 0, 0.36, 60, track=3)]
    audio.append("      <!-- NARRATION: Russian voiceover, one clip per line -->")
    for n, (key, start, _) in enumerate(NARRATION):
        audio.append(audio_tag(f"vo-{key}", f"vo/{key}.wav", start, 1, round(file_dur(f"vo/{key}.wav"), 3), track=4 + n % 2))
    audio.append("      <!-- AMBIENCE -->")
    for i, (src, start, vol, dur, ms) in enumerate(AMBIENCE):
        audio.append(audio_tag(f"amb-{i + 1:02d}", src, start, vol, dur, ms, 0.3, track=6 + i % 2))
    audio.append("      <!-- SOUND EFFECTS (each lane holds non-overlapping clips) -->")
    lanes = []  # end time per lane
    for i, (src, start, vol, dur, fo) in enumerate(sorted(SFX, key=lambda x: x[1])):
        d = min(dur or file_dur(src), file_dur(src), CUT - start)
        lane = next((k for k, e in enumerate(lanes) if e <= start), None)
        if lane is None:
            lanes.append(0); lane = len(lanes) - 1
        lanes[lane] = start + d
        name = os.path.splitext(os.path.basename(src))[0].replace("_", "-")
        audio.append(audio_tag(f"sfx-{i + 1:02d}-{name}", src, start, vol, round(d, 3), 0, fo, track=10 + lane))
    return f"""<!doctype html>
<html lang="ru" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>ПОСЛЕДНИЙ ДЕНЬ — Эпизод 1</title>
    <script src="assets/lib/gsap.min.js"></script>
    <script src="assets/lib/film-core.js"></script>
    <script src="assets/lib/film-rig.js"></script>
    <script src="assets/lib/film-apartment.js"></script>
    <script>window.FILM.scenes = {{}};</script>
    <script src="assets/scenes/s1.js"></script>
    <script src="assets/scenes/s2.js"></script>
    <script src="assets/scenes/s3.js"></script>
    <script src="assets/scenes/s4.js"></script>
    <script src="assets/scenes/s5.js"></script>
    <script src="assets/scenes/s6.js"></script>
    <script src="assets/scenes/s7.js"></script>
    <style>
{FONTS}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #000; }}
      #root {{ position: relative; width: 1080px; height: 1920px; background: #000; }}
      .scene {{ position: absolute; inset: 0; }}
      /* warms the font cache so canvas text (TV, phone) draws in the right face on frame 1 */
      .font-warm {{ position: absolute; left: -2000px; top: 0; font-family: "Oswald"; font-weight: 700; }}
      .font-warm b {{ font-family: "Montserrat"; font-weight: 800; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="60" data-width="1080" data-height="1920">
{chr(10).join(hosts)}
{chr(10).join(audio)}
    </div>
    <div class="font-warm" aria-hidden="true">ЭКСТРЕННОЕ <b>Неизвестный номер</b></div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""


def main():
    os.makedirs(os.path.join(ROOT, "compositions"), exist_ok=True)
    for sid, start, dur, what in SCENES:
        open(os.path.join(ROOT, "compositions", f"{sid}.html"), "w").write(scene_file(sid, dur, what))
    groups = caption_groups()
    open(os.path.join(ROOT, "compositions", "captions.html"), "w").write(captions_file(groups))
    open(os.path.join(ROOT, "index.html"), "w").write(index_file())
    json.dump(groups, open(os.path.join(ROOT, "assets", "captions.json"), "w"), ensure_ascii=False, indent=1)
    print(len(groups), "caption groups;", len(SFX), "sfx;", len(NARRATION), "vo lines")


if __name__ == "__main__":
    main()
