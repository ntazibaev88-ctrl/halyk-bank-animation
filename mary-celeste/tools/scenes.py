"""Scene plan derived from the voiceover timing: every builder (audio, captions,
index) imports plan() so scene cuts always follow the recorded narration."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def plan():
    t = json.load(open(os.path.join(ROOT, "assets/data/timing.json"), encoding="utf-8"))
    seg = {s["id"]: s for s in t["segments"]}
    r = lambda x: round(x, 2)
    cuts = [0.0,
            seg["n04"]["start"] - 0.35,   # S2 voyage
            seg["n06"]["start"] - 0.3,    # S3 people
            seg["n07"]["start"] - 0.3,    # S4 discovery
            seg["n08"]["start"] - 0.3,    # S5 empty ship
            seg["n10"]["start"] - 0.3,    # S6 evidence
            seg["n12"]["start"] - 0.35,   # S7 theories
            seg["n15"]["start"] - 0.3,    # S8 investigation
            seg["n17"]["start"] - 0.3,    # S9 final question
            seg["n17"]["end"] + 0.9]      # S10 ending
    total = r(cuts[-1] + 5.9)
    ids = ["s01-mystery", "s02-voyage", "s03-people", "s04-discovery", "s05-empty-ship",
           "s06-evidence", "s07-theories", "s08-investigation", "s09-question", "s10-ending"]
    scenes = []
    for i, sid in enumerate(ids):
        st = cuts[i]; en = cuts[i + 1] if i + 1 < len(cuts) else total
        scenes.append({"id": sid, "start": r(st), "duration": r(en - st)})
    return {"total": total, "scenes": scenes, "segments": t["segments"], "seg": seg}

if __name__ == "__main__":
    p = plan()
    for s in p["scenes"]: print(f'{s["id"]:20s} {s["start"]:6.2f} +{s["duration"]:5.2f}')
    print("total", p["total"])
