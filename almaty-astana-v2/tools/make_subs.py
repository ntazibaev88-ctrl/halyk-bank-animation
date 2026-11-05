"""Build lib/subs.js from narration timings: phrase chunks with per-word times (weighted by characters + punctuation pauses)."""
import json, re, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
segs = json.load(open(f"{R}/tools/timings.json")); chunks = []
def words_of(text): return text.split()
for s in segs:
    ws = words_of(s["text"]); wt = []
    for w in ws:
        base = len(re.sub(r"[^\wё]", "", w, flags=re.I)) + 1.5
        if w.endswith(("—",)): base += 1
        pause = 4.0 if w[-1] in ".?!" else (2.2 if w[-1] == "," else (1.6 if w == "—" else 0))
        wt.append((base, pause))
    total = sum(b + p for b, p in wt); span = s["end"] - s["start"]; t = s["start"]; timed = []
    for w, (b, p) in zip(ws, wt):
        d = span * b / total; timed.append([w, round(t, 3), round(t + d, 3)]); t += d + span * p / total
    # merge standalone dashes into the previous word, then split sentence-wise, balanced
    m = []
    for w in timed:
        if w[0] == "—" and m: m[-1][0] += " —"; m[-1][2] = w[2]
        else: m.append(w)
    sents, cur = [], []
    for w in m:
        cur.append(w)
        if w[0][-1] in ".?!": sents.append(cur); cur = []
    if cur: sents.append(cur)
    def split(ws):
        txt = " ".join(x[0] for x in ws)
        if len(txt) <= 38 or len(ws) < 2: return [ws]
        best, bs = 1, 1e9
        for i in range(1, len(ws)):
            l = len(" ".join(x[0] for x in ws[:i])); r = len(txt) - l
            score = abs(l - r) - (12 if ws[i-1][0][-1] in ",—" else 0)
            if score < bs: bs, best = score, i
        return split(ws[:best]) + split(ws[best:])
    for sen in sents:
        for ch in split(sen): chunks.append({"a": ch[0][1], "b": ch[-1][2], "w": ch})
open(f"{R}/lib/subs.js", "w").write("window.SUBS=" + json.dumps(chunks, ensure_ascii=False) + ";")
print(len(chunks), "chunks")
for c in chunks: print(round(c["a"],2), round(c["b"],2), " ".join(x[0] for x in c["w"]))
