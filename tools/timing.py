#!/usr/bin/env python3
"""Computes scene windows, sentence start times and subtitle cues -> data/timing.json"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
script = json.load(open(f"{ROOT}/voiceover/script.json", encoding="utf-8"))
L = json.load(open(f"{ROOT}/voiceover/lengths.json"))
LEAD, GAP, TAIL, FINAL_TAIL = 0.45, 0.30, 0.55, 2.2
HIL = re.compile(r"^(пте|птэ|пэ|ошибк|безопасн|надёжн|давлени|температур|защит|турбин|генератор|пар\b|правил|электроэнерг|ответственност|дисциплин|котёл|котельн|вод[аыуе]|оборудовани)", re.I)
def chunks(text, maxc=40):
    words = text.split(); out = []; cur = []
    for w in words:
        if cur and len(" ".join(cur + [w])) > maxc:
            out.append(cur); cur = []
        cur.append(w)
        if re.search(r"[,.;—]$", w) and len(" ".join(cur)) > 18:
            out.append(cur); cur = []
    if cur: out.append(cur)
    # merge tiny trailing chunk
    if len(out) > 1 and len(" ".join(out[-1])) < 10:
        last = out.pop(); out[-1] = out[-1] + last
    return out
t = 0.0; scenes = []; cues = []; sent_tl = []
for sc in script["scenes"]:
    start = t; cur = start + LEAD
    for i, s in enumerate(sc["sentences"]):
        d = L[f"s{sc['id']}_{i}"]
        sent_tl.append({"key": f"s{sc['id']}_{i}", "start": round(cur, 3), "dur": d})
        ch = chunks(s)
        wts = [len(" ".join(c)) + (6 if re.search(r"[,.—]$", c[-1]) else 0) for c in ch]
        tot = sum(wts); p = cur
        for c, w in zip(ch, wts):
            cd = d * w / tot
            cues.append({"start": round(p, 3), "end": round(p + cd, 3),
                         "words": [{"t": x, "hl": bool(HIL.match(re.sub(r"[^\w]", "", x)))} for x in c]})
            p += cd
        cur += d + GAP
    end = cur - GAP + (FINAL_TAIL if sc["id"] == 8 else TAIL)
    scenes.append({"id": sc["id"], "start": round(start, 3), "dur": round(end - start, 3)})
    t = end
# extend each cue to just before next (avoid flicker) but cap hold
for a, b in zip(cues, cues[1:]):
    if b["start"] - a["end"] < 0.6: a["end"] = round(b["start"] - 0.02, 3)
json.dump({"total": round(t, 3), "scenes": scenes, "sentences": sent_tl, "cues": cues},
          open(f"{ROOT}/data/timing.json", "w"), ensure_ascii=False, indent=1)
print("total", round(t, 2)); [print(s) for s in scenes]
