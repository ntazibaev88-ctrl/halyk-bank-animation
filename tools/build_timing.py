"""Turn per-scene TTS word timings into absolute film times for the composition.

Writes project/data/vo.js (window.VO) used by subtitles and animation cues.
"""
import json, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
# Where each scene's narration starts, relative to the scene start (seconds).
VO_OFFSET = {1: 0.15, 2: 0.45, 3: 0.5, 4: 0.45, 5: 0.9, 6: 0.6, 7: 0.4}

script = json.load(open(f"{ROOT}/voiceover/script_ru.json"))
tim = json.load(open(f"{ROOT}/voiceover/timings.json"))
out = {"scenes": []}
for sc, t in zip(script["scenes"], tim["scenes"]):
    st = sc["start"] + VO_OFFSET[sc["id"]]
    end = st + t["duration"]
    assert end <= sc["end"] - 0.05, (sc["id"], end)
    words = [dict(w) for w in t["words"]]
    # re-attach dashes (not spoken, so they have no timing) to the previous word for the subtitles
    toks = " ".join(sc["lines"]).split()
    k = 0
    for tok in toks:
        if tok == "—":
            words[k - 1]["w"] += " —"
        else:
            k += 1
    out["scenes"].append({
        "id": sc["id"], "start": sc["start"], "end": sc["end"], "vo": round(st, 3), "voEnd": round(end, 3),
        "words": [{"w": w["w"], "s": round(st + w["s"], 3), "e": round(st + w["e"], 3)} for w in words],
    })
open(f"{ROOT}/project/data/vo.js", "w").write("window.VO = " + json.dumps(out, ensure_ascii=False) + ";\n")
json.dump({str(s["id"]): s["vo"] for s in out["scenes"]}, open(f"{ROOT}/voiceover/vo_starts.json", "w"))
for s in out["scenes"]:
    print(s["id"], "vo %.2f–%.2f (scene %.0f–%.0f)" % (s["vo"], s["voEnd"], s["start"], s["end"]))
