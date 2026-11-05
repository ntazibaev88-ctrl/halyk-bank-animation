"""Narration v2: phrase-level synthesis (RHVoice 'aleksandr-hq', SSML), natural pauses, exact timings -> timeline.
Outputs: assets/vo/narration.wav, tools/timeline.json, lib/timeline.js (window.TL), lib/subs.js (window.SUBS)."""
import json, re, subprocess, wave, os, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RATE = int(sys.argv[1]) if len(sys.argv) > 1 else 84
VOICE = "aleksandr-hq"
script = json.load(open(f"{R}/tools/script2.json"))
GAP_COMMA, GAP_DASH, GAP_SENT, GAP_SCENE = 0.24, 0.28, 0.55, 1.2
SCENE_MIN = {"opening": 6.5, "map": 10.0, "almaty": 18.0, "astana": 18.0, "climate": 9.0, "life": 8.0, "board": 9.0, "finale": 8.0}
LEAD = {"opening": 1.5}
TAIL = {"finale": 2.8}

def phrases(text):
    """split a segment into phrases at commas/dashes/sentence ends; keep trailing punctuation for prosody."""
    parts = re.findall(r"[^,.:?!—]+(?:[,.:?!]|\s—|—)?", text.replace(" — ", " —|").replace("—|", "— "))
    out, buf = [], ""
    for p in re.split(r"(?<=[,.:?!—])\s+", text):
        buf = (buf + " " + p).strip()
        if len(re.findall(r"\w+", re.sub(r"\+", "", buf))) >= 3 or p.endswith((".", "?", "!")):
            out.append(buf); buf = ""
    if buf: (out.__setitem__(len(out) - 1, out[-1] + " " + buf) if out else out.append(buf))
    return out

def ssml(ph):
    t = ph.replace("&", "&amp;")
    t = re.sub(r"\*([^*]+)\*", r'<emphasis level="moderate">\1</emphasis>', t)
    t = t.replace(" —", ",").replace("—", ",") if False else t
    return f'<speak><prosody rate="{RATE}%">{t}</prosody></speak>'

def synth(i, ph):
    f = f"/tmp/vo2_{i}.wav"
    subprocess.run(["RHVoice-test", "-s", "-p", VOICE, "-q", "max", "-o", f], input=ssml(ph).encode(), check=True, stderr=subprocess.DEVNULL)
    g = f.replace(".wav", "_t.wav")  # trim leading/trailing silence so timing = real speech
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-af", "silenceremove=start_periods=1:start_threshold=-46dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-46dB,areverse", g], check=True)
    w = wave.open(g); return g, w.getnframes() / w.getframerate()

items = []  # all phrases flat with timing
n = 0
for s in script:
    s["phr"] = []
    for ph in phrases(s["text"]):
        f, d = synth(n, ph); n += 1
        s["phr"].append({"f": f, "d": d, "spoken": ph})
# subtitle display phrases: split sub text with same phrase count/ratios -> split sub at same boundaries
def split_like(sub, spoken_phr):
    words = sub.split(); counts = [len(re.sub(r"[+*]", "", p).split()) for p in spoken_phr]
    if sum(counts) != len(words):  # spoken uses number words etc. -> distribute proportionally
        tot = sum(counts); k = []; acc = 0
        for c in counts[:-1]: acc += round(len(words) * c / tot); k.append(acc)
        counts = [b - a for a, b in zip([0] + k, k + [len(words)])]
    out, i = [], 0
    for c in counts: out.append(" ".join(words[i:i + c])); i += c
    return out
t = 0.0; prev_scene = None
for s in script:
    first = prev_scene != s["scene"]
    if first: t += (GAP_SCENE if prev_scene else LEAD.get(s["scene"], .6) + .4)
    elif s is not script[0]: t += GAP_SENT
    subs = split_like(s["sub"], [p["spoken"] for p in s["phr"]])
    for k, p in enumerate(s["phr"]):
        p["a"] = round(t, 3); p["b"] = round(t + p["d"], 3); p["sub"] = subs[k]
        t = p["b"] + (0 if k == len(s["phr"]) - 1 else (GAP_DASH if "—" in p["spoken"][-3:] or p["spoken"].endswith("—") else GAP_COMMA))
    s["a"], s["b"] = s["phr"][0]["a"], s["phr"][-1]["b"]
    prev_scene = s["scene"]
speech_end = script[-1]["b"]
# scene windows: boundary = middle of the silence between scenes
order = []; [order.append(s["scene"]) for s in script if s["scene"] not in order]
sc = {}
for sid in order:
    ss = [s for s in script if s["scene"] == sid]; sc[sid] = {"a": ss[0]["a"], "b": ss[-1]["b"]}
starts = {}
for i, sid in enumerate(order):
    starts[sid] = 0.0 if i == 0 else round((sc[order[i - 1]]["b"] + sc[sid]["a"]) / 2, 3)
# enforce minimum scene durations by shifting later content? -> instead verify and report
total = round(speech_end + TAIL["finale"], 3)
scenes = []
for i, sid in enumerate(order):
    a = starts[sid]; b = starts[order[i + 1]] if i + 1 < len(order) else total
    scenes.append({"id": sid, "start": a, "dur": round(b - a, 3), "speech": [round(sc[sid]["a"] - a, 3), round(sc[sid]["b"] - a, 3)]})
    if b - a < SCENE_MIN[sid]: print(f"WARN scene {sid} {b-a:.1f}s < {SCENE_MIN[sid]}s min")
segs = {s["id"]: {"scene": s["scene"], "a": s["a"], "b": s["b"], "phr": [[p["a"], p["b"], p["sub"]] for p in s["phr"]]} for s in script}
for s in scenes:
    for k, v in segs.items():
        if v["scene"] == s["id"]: v["la"], v["lb"] = round(v["a"] - s["start"], 3), round(v["b"] - s["start"], 3)
TLd = {"total": total, "scenes": scenes, "segs": segs}
json.dump(TLd, open(f"{R}/tools/timeline.json", "w"), ensure_ascii=False, indent=1)
open(f"{R}/lib/timeline.js", "w").write("window.TL=" + json.dumps(TLd, ensure_ascii=False) + ";")
# subtitle chunks (phrase-level, per-word timing by weight)
chunks = []
for s in script:
    for p in s["phr"]:
        ws = p["sub"].split(); w = [len(re.sub(r"\W", "", x)) + 1.2 for x in ws]; tot = sum(w); tt = p["a"]; timed = []
        for x, ww in zip(ws, w): d = (p["b"] - p["a"]) * ww / tot; timed.append([x, round(tt, 3), round(tt + d, 3)]); tt += d
        # split long phrases into <= 2 balanced display chunks
        txt = p["sub"]
        if len(txt) > 40 and len(ws) > 3:
            best = min(range(1, len(ws)), key=lambda i: abs(len(" ".join(ws[:i])) - len(" ".join(ws[i:]))))
            for part in (timed[:best], timed[best:]): chunks.append({"a": part[0][1], "b": part[-1][2], "w": part})
        else: chunks.append({"a": timed[0][1], "b": timed[-1][2], "w": timed})
open(f"{R}/lib/subs.js", "w").write("window.SUBS=" + json.dumps(chunks, ensure_ascii=False) + ";")
# mix the phrase wavs
inputs, filt, lab = [], [], ""
k = 0
for s in script:
    for p in s["phr"]:
        inputs += ["-i", p["f"]]; filt.append(f"[{k}]adelay={int(p['a']*1000)}:all=1[a{k}]"); lab += f"[a{k}]"; k += 1
chain = (";".join(filt) + f";{lab}amix=inputs={k}:normalize=0,apad=whole_dur={total},atrim=0:{total},"
  "rubberband=pitch=0.91:formant=preserved,highpass=f=65,equalizer=f=130:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=2,"
  "acompressor=threshold=-21dB:ratio=2.6:attack=10:release=160:makeup=3,aecho=0.8:0.4:70:0.10,loudnorm=I=-14:TP=-1.5:LRA=6[v]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", chain, "-map", "[v]", "-ar", "48000", f"{R}/assets/vo/narration.wav"], check=True)
print("total", total, "speech end", speech_end, "phrases", k, "chunks", len(chunks))
for s in scenes: print(f"{s['id']:8s} start {s['start']:7.2f} dur {s['dur']:6.2f} speech {s['speech']}")
