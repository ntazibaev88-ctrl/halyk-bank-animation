"""Builds the processed voice clips, full voiceover, word timeline, SRT/VTT subtitles
and compositions/captions.html from script/narration.json + script/timeline.json.
Run after tools/tts.py.  python3 tools/build_voice_captions.py"""
import json, os, re, subprocess, html
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(R, *a)
nar = json.load(open(P("script/narration.json"), encoding="utf-8"))
tl = json.load(open(P("script/timeline.json"), encoding="utf-8"))
SR = 48000

# 1. Voice clean-up: high-pass, gentle warmth + presence, light compression, loudness to -16 LUFS each.
VF = ("highpass=f=75,equalizer=f=180:t=q:w=1.0:g=1.5,equalizer=f=3200:t=q:w=1.2:g=2.0,"
      "equalizer=f=7500:t=q:w=2:g=-1.5,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,"
      "aecho=0.8:0.25:28|47:0.10|0.06,loudnorm=I=-16:TP=-1.5:LRA=7")
os.makedirs(P("assets/voice"), exist_ok=True)
for line in nar["lines"]:
    src, dst = P("assets/voice/raw", line["id"] + ".mp3"), P("assets/voice", line["id"] + ".wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-af", VF, "-ar", str(SR), "-ac", "1", dst], check=True)

def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)

# 2. Full voiceover track at film time.
inputs, filt = [], []
for i, line in enumerate(nar["lines"]):
    inputs += ["-i", P("assets/voice", line["id"] + ".wav")]
    ms = int(tl["voice"][line["id"]] * 1000)
    filt.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
n = len(nar["lines"])
filt.append("".join(f"[a{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0,apad=whole_dur={tl['duration']}[out]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[out]", "-t", str(tl["duration"]), "-ar", str(SR), P("assets/voice/voiceover_full.wav")], check=True)

# 3. Caption groups = narration chunks, timed by the voice's own word boundaries.
def words_of(s):
    return [w for w in s.split() if re.search(r"\w", w)]
groups, transcript = [], []
for line in nar["lines"]:
    wb = json.load(open(P("assets/voice/raw", line["id"] + ".words.json"), encoding="utf-8"))
    off = tl["voice"][line["id"]]
    k = 0
    for c in line["chunks"]:
        nw = len(words_of(c["say"]))
        ws = wb[k:k + nw]
        assert len(ws) == nw, (line["id"], c["say"], [w["text"] for w in wb])
        for w in ws:
            transcript.append({"text": w["text"], "start": round(off + w["start"], 3), "end": round(off + w["end"], 3)})
        groups.append({"line": line["id"], "show": c["show"], "start": off + ws[0]["start"], "end": off + ws[-1]["end"]})
        k += nw
    assert k == len(wb), (line["id"], k, len(wb))
json.dump(transcript, open(P("assets/data/transcript.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
# open a little before the first word, hold until next group (max +0.6 s)
for g in groups:
    g["in"] = round(max(0.1, g["start"] - 0.12), 3)
for i, g in enumerate(groups):
    nxt = groups[i + 1]["in"] if i + 1 < len(groups) else tl["duration"]
    g["out"] = round(min(g["end"] + 0.6, nxt - 0.02), 3)

def ts(t, sep=","):
    h, m = int(t // 3600), int(t % 3600 // 60); s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)):03d}"
plain = lambda s: s.replace("*", "")
with open(P("subtitles/kz35-journey.kk.srt"), "w", encoding="utf-8") as f:
    for i, g in enumerate(groups, 1):
        f.write(f"{i}\n{ts(g['in'])} --> {ts(g['out'])}\n{plain(g['show'])}\n\n")
with open(P("subtitles/kz35-journey.kk.vtt"), "w", encoding="utf-8") as f:
    f.write("WEBVTT\n\n")
    for i, g in enumerate(groups, 1):
        f.write(f"{ts(g['in'], '.')} --> {ts(g['out'], '.')}\n{plain(g['show'])}\n\n")

# 4. Caption composition (burned-in). Lines whose words are the finale titles are left to the titles.
skip = set(tl.get("titlesAreCaptions", []))
def markup(s):
    out = []
    for part in re.split(r"(\*[^*]+\*)", s):
        if part.startswith("*"):
            out.append(f'<span class="hl">{html.escape(part[1:-1])}</span>')
        else:
            out.append(html.escape(part))
    return "".join(out)
items, js = [], []
for i, g in enumerate(groups):
    if g["line"] in skip:
        continue
    gid = f"cap-{i:02d}"
    d = round(g["out"] - g["in"], 3)
    items.append(f'    <div id="{gid}" class="clip cap" data-start="{g["in"]}" data-duration="{d}" data-track-index="0"><p class="cap-text">{markup(g["show"])}</p></div>')
    js.append(f'  capIn("#{gid}", {g["in"]}, {g["out"]});')
dur_total = tl["duration"]
page = f'''<template>
  <style>
    @font-face {{ font-family: "KZ Sans"; src: url("assets/fonts/Montserrat-ExtraBold.woff2") format("woff2"); font-weight: 800; }}
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    .cap {{ position: absolute; left: 0; right: 0; top: 1112px; height: 216px; display: flex; align-items: flex-end; justify-content: center; overflow: visible; }}
    .cap-text {{ margin: 0; width: 880px; text-align: center; font-family: "KZ Sans", sans-serif; font-weight: 800; font-size: 50px; line-height: 1.2;
      color: #FFFFFF; letter-spacing: -0.005em; text-wrap: balance;
      text-shadow: 0 2px 0 rgba(3,10,26,.55), 0 0 18px rgba(3,10,26,.85), 0 6px 28px rgba(3,10,26,.6);
      -webkit-text-stroke: 1.5px rgba(3,10,26,.35); paint-order: stroke fill; }}
    .hl {{ color: #F6C453; }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920" data-duration="{dur_total}">
{chr(10).join(items)}
  </div>
  <script>
  const tl = gsap.timeline({{ paused: true }});
  function capIn(sel, a, b) {{
    const t = document.querySelector(sel + " .cap-text");
    tl.fromTo(t, {{ opacity: 0, y: 14, filter: "blur(6px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.22, ease: "power3.out" }}, a);
    tl.to(t, {{ opacity: 0, filter: "blur(4px)", duration: 0.14, ease: "power2.in" }}, b - 0.14);
  }}
{chr(10).join(js)}
  window.__timelines["captions"] = tl;
  </script>
</template>
'''
open(P("compositions/captions.html"), "w", encoding="utf-8").write(page)
json.dump(groups, open(P("assets/data/caption-groups.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for g in groups:
    print(f"{g['in']:7.2f} {g['out']:7.2f}  {plain(g['show'])}")
print("voice ends:", max(tl["voice"][l["id"]] + dur(P("assets/voice", l["id"] + ".wav")) for l in nar["lines"]))
