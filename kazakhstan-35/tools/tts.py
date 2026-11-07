"""Generate the Kazakh voiceover, one file per narration line, with word timings.
Usage: python3 tools/tts.py [--rate +6%] [--pitch +0Hz]
Needs: pip install edge-tts. Writes assets/voice/raw/<id>.mp3 and <id>.words.json"""
import asyncio, json, sys, os, argparse
try:
    import certifi
    if os.path.exists("/root/.ccr/ca-bundle.crt"):
        certifi.where = lambda: "/root/.ccr/ca-bundle.crt"  # sandbox proxy CA
except ImportError:
    pass
import edge_tts

ap = argparse.ArgumentParser()
ap.add_argument("--rate", default="+6%")
ap.add_argument("--pitch", default="+0Hz")
ap.add_argument("--only", default=None)
a = ap.parse_args()

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = json.load(open(os.path.join(root, "script/narration.json"), encoding="utf-8"))
out = os.path.join(root, "assets/voice/raw"); os.makedirs(out, exist_ok=True)

async def one(line):
    text = " ".join(c["say"] for c in line["chunks"])
    com = edge_tts.Communicate(text, spec["voice"], rate=line.get("rate", a.rate), pitch=spec.get("pitch", a.pitch), boundary="WordBoundary")
    audio, words = bytearray(), []
    async for ch in com.stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"text": ch["text"], "start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7})
    open(os.path.join(out, line["id"] + ".mp3"), "wb").write(audio)
    json.dump(words, open(os.path.join(out, line["id"] + ".words.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(line["id"], len(words), "words", round(words[-1]["end"], 2) if words else 0, "s")

async def main():
    for line in spec["lines"]:
        if a.only and line["id"] not in a.only.split(","):
            continue
        for attempt in range(4):
            try:
                await one(line); break
            except Exception as e:
                print("retry", line["id"], e); await asyncio.sleep(2 ** attempt)

asyncio.run(main())
