"""Derive visual + music cue times from the voiceover word timings.

Every reveal (titles, year markers, counters, stat cards, landmark cuts) is
anchored to the spoken word it illustrates. Output: src/data/cues.json
"""
import json, os
ROOT = os.path.join(os.path.dirname(__file__), "..")
subs = json.load(open(os.path.join(ROOT, "src/data/subtitles.json")))
seg = {s["id"]: s for s in subs}

def word(sid, text, nth=0):
    hits = [w for c in seg[sid]["chunks"] for w in c["words"] if w["w"].strip(",.!—").lower().startswith(text.lower())]
    return hits[nth]

def chunk(sid, needle):
    return next(c for c in seg[sid]["chunks"] if needle in c["text"])

r = lambda x: round(x, 3)
cues = {
    "scenes": [0, 10, 30, 47, 62, 80, 100, 112, 120],
    "title1": r(word("s1", "Астана")["t0"]),
    "years": {
        "1830": r(chunk("s2", "1830")["t0"]),
        "1862": r(chunk("s2", "маңызды орталығына")["t0"]),
        "1961": r(word("s2", "Целиноград")["t0"]),
        "1994": r(chunk("s2", "1997")["t0"] - 0.35),
        "1997": r(word("s2", "тоқсан", 0)["t0"]),
        "1998": r(chunk("s2", "1998")["t0"]),
    },
    "pop2017": r(chunk("s4", "2017")["t0"]),
    "popCount": r(chunk("s4", "2026")["t0"]),
    "popFinal": r(chunk("s4", "538")["t1"]),
    "grp": r(chunk("s5", "18 триллион")["t0"]),
    "budget": r(chunk("s5", "1 триллион 700")["t0"]),
    "landmarkCuts": [
        r(word("s6", "Бәйтерек")["t0"] - 0.15),
        r(word("s6", "Хан")["t0"] - 0.1),
        r(word("s6", "ЭКСПО")["t0"] - 0.1),
        r(word("s6", "Ұлттық")["t0"] - 0.1),
        r(chunk("s6", "танымал")["t0"] - 0.05),
        r(chunk("s6", "2025")["t0"] - 0.2),
    ],
    "tourists": r(chunk("s6", "600 мыңнан")["t0"]),
    "foreign": r(word("s6", "үш")["t0"]),
    "title8": r(chunk("s8", "Астана — бұл")["t0"]),
    "finalChord": r(chunk("s8", "болашаққа")["t0"]),
}
json.dump(cues, open(os.path.join(ROOT, "src/data/cues.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(cues, ensure_ascii=False))
