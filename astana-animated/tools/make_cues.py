"""Cue sheet for «Даладан — елордаға дейін»: every reveal is anchored to a spoken word."""
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
    "scenes": [0, 12, 30, 45, 60, 77, 92, 107, 120],
    "title1": r(word("s1", "Астана")["t0"]),
    "years": {
        "1830": r(chunk("s2", "1830")["t0"]),
        "1862": r(chunk("s2", "1862")["t0"]),
        "1961": r(word("s2", "Целиноград")["t0"]),
        "1997": r(chunk("s2", "1997")["t0"]),
        "1998": r(chunk("s2", "1998")["t0"]),
    },
    "newCapital": r(chunk("s3", "Содан")["t0"]),
    "fastGrowth": r(chunk("s3", "көшелер")["t0"]),
    "pop2017": r(chunk("s4", "2017")["t0"]),
    "popCount": r(chunk("s4", "2026")["t0"]),
    "popFinal": r(chunk("s4", "700 мыңнан")["t1"]),
    "grp": r(chunk("s5", "18,9")["t0"]),
    "budget": r(chunk("s6", "647")["t0"]),
    "budgetFlow": r(chunk("s6", "Бұл қаражат")["t0"]),
    "tourCuts": [
        r(chunk("s7", "сәулет")["t0"] - 0.1),
        r(chunk("s7", "мәдени")["t0"] - 0.1),
        r(chunk("s7", "іс-шаралар")["t0"] - 0.1),
        r(chunk("s7", "демалыс")["t0"] - 0.1),
        r(chunk("s7", "2025")["t0"] - 0.15),
    ],
    "tourists": r(chunk("s7", "604")["t0"]),
    "foreign": r(chunk("s7", "380")["t0"]),
    "title8": r(chunk("s8", "Оның дамуы")["t0"]),
    "finalChord": r(chunk("s8", "ертеңгі")["t0"]),
}
json.dump(cues, open(os.path.join(ROOT, "src/data/cues.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(cues, ensure_ascii=False))
