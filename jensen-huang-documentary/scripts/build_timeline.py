"""Place narration sentences on an absolute timeline with natural pauses -> src/timeline.json"""
import json, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
nar = json.load(open(os.path.join(root, "src", "narration.generated.json")))
FPS = 30
LEAD, GAP, SECTION_GAP, TAIL = 0.6, 0.36, 0.8, 5.4
t = LEAD; out = []; sections = {}
for i, s in enumerate(nar):
    if i > 0:
        t += SECTION_GAP if s["section"] != nar[i - 1]["section"] else GAP
    speech = s["speechEnd"] - s["speechStart"]
    off = t - s["speechStart"]  # where the mp3 file begins
    words = [{"w": w["w"], "hl": w["hl"], "s": round(w["s"] + off, 3), "e": round(w["e"] + off, 3)} for w in s["words"]]
    out.append({"i": i, "section": s["section"], "file": s["file"], "fileStart": round(off, 3),
                "start": round(t, 3), "end": round(t + speech, 3), "words": words})
    sec = sections.setdefault(s["section"], {"start": t, "end": t + speech})
    sec["end"] = t + speech
    t += speech
total = t + TAIL
# section visual boundaries: cut between sections in the middle of the pause
keys = sorted(sections)
bounds = {}
for k in keys:
    a = 0 if k == keys[0] else (sections[k - 1]["end"] + sections[k]["start"]) / 2
    b = total if k == keys[-1] else (sections[k]["end"] + sections[k + 1]["start"]) / 2
    bounds[k] = {"start": round(a, 3), "end": round(b, 3), "voiceStart": round(sections[k]["start"], 3), "voiceEnd": round(sections[k]["end"], 3)}
json.dump({"fps": FPS, "duration": round(total, 3), "durationInFrames": int(round(total * FPS)), "sentences": out, "sections": bounds},
          open(os.path.join(root, "src", "timeline.json"), "w"), ensure_ascii=False, indent=1)
print("total", round(total, 2))
for k, v in bounds.items(): print(k, v)
for s in out: print(s["i"], s["start"], s["end"])
