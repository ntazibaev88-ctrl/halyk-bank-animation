"""Generate per-sentence Russian narration (edge-tts, ru-RU-DmitryNeural) with word timings.
Markup in narration.json: *word* = highlight in green; [display|spoken] = show `display`, speak `spoken`."""
import asyncio, json, re, subprocess, sys, os
import edge_tts
VOICE, RATE, PITCH = "ru-RU-DmitryNeural", "+0%", "-4Hz"
root = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(root, "..", "public", "audio", "vo")
os.makedirs(out, exist_ok=True)
items = json.load(open(os.path.join(root, "narration.json")))

def parse(text):
    """Return list of display tokens [(word, highlight, n_spoken_words)] and spoken text."""
    toks, spoken = [], []
    for m in re.finditer(r"\[([^\]|]+)\|([^\]]+)\]|(\S+)", text):
        if m.group(3):
            w = m.group(3)
            if w == "—":
                spoken.append(w)
                if toks: toks[-1][0] += " —"
                continue
            hl = w.startswith("*")
            toks.append([w.replace("*", ""), hl, 1]); spoken.append(w.replace("*", ""))
        else:
            disp = m.group(1).split(); sp = m.group(2)
            n = len([x for x in sp.split() if x != "—"])
            for j, d in enumerate(disp):
                toks.append([d.replace("*", ""), d.startswith("*"), n if j == len(disp) - 1 else 0])
            spoken.append(sp)
    return toks, " ".join(spoken)

async def synth(spoken, mp3):
    for attempt in range(6):
        try:
            c = edge_tts.Communicate(spoken, VOICE, rate=RATE, pitch=PITCH, boundary="WordBoundary")
            wb = []
            with open(mp3, "wb") as f:
                async for ch in c.stream():
                    if ch["type"] == "audio": f.write(ch["data"])
                    elif ch["type"] == "WordBoundary": wb.append((ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7, ch["text"]))
            return wb
        except Exception as e:
            print("retry", attempt, e, file=sys.stderr); await asyncio.sleep(3 * (attempt + 1))
    raise RuntimeError("TTS failed")

async def gen(i, it):
    toks, spoken = parse(it["text"])
    mp3 = os.path.join(out, f"s{i:02d}.mp3")
    wb = await synth(spoken, mp3)
    need = sum(t[2] for t in toks)
    if need != len(wb):
        print("MISMATCH", i, need, len(wb), [w[2] for w in wb], file=sys.stderr)
    words, k = [], 0
    for w, hl, n in toks:
        n_eff = n
        if k >= len(wb): seg = [wb[-1]]
        elif n_eff == 0: seg = [wb[k]]
        else: seg = wb[k:k + n_eff]
        words.append({"w": w, "hl": hl, "s": round(seg[0][0], 3), "e": round(seg[-1][1], 3)})
        k += n_eff
    # fix display words that share a spoken span (n=0): split evenly
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]))
    return {"i": i, "section": it["section"], "file": f"audio/vo/s{i:02d}.mp3", "dur": round(dur, 3),
            "speechStart": round(wb[0][0], 3), "speechEnd": round(wb[-1][1], 3), "words": words, "spoken": spoken}

async def main():
    res = [await gen(i, it) for i, it in enumerate(items)]
    json.dump(res, open(os.path.join(root, "..", "src", "narration.generated.json"), "w"), ensure_ascii=False, indent=1)
    for r in res: print(r["i"], r["dur"], r["speechStart"], r["speechEnd"], " ".join(w["w"] for w in r["words"]))
    print("total speech", sum(r["speechEnd"] - r["speechStart"] for r in res))
asyncio.run(main())
