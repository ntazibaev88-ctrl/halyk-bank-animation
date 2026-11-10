"""Generate the Kazakh male voiceover (Microsoft neural voice kk-KZ-DauletNeural via edge-tts)
with word-level timings. Usage: python3 tools/tts.py [rate]   e.g. -4%"""
import asyncio, json, os, sys, edge_tts
RATE = sys.argv[1] if len(sys.argv) > 1 else "+0%"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def one(item):
    c = edge_tts.Communicate(item.get("tts", item["text"]), "kk-KZ-DauletNeural", rate=RATE,
                             proxy=os.environ.get("HTTPS_PROXY"), boundary="WordBoundary")
    words, audio = [], b""
    async for ch in c.stream():
        if ch["type"] == "audio": audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"text": ch["text"], "start": ch["offset"]/1e7, "end": (ch["offset"]+ch["duration"])/1e7})
    open(f"{ROOT}/assets/audio/vo-{item['id']}.mp3", "wb").write(audio)
    return {"id": item["id"], "text": item["text"], "words": words}
async def main():
    items = json.load(open(f"{ROOT}/tools/narration.json", encoding="utf-8"))
    out = [await one(i) for i in items]
    json.dump(out, open(f"{ROOT}/tools/vo-words.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
asyncio.run(main())
