"""Generate the Kazakh voiceover (edge-tts, kk-KZ-DauletNeural) with word timings."""
import asyncio, json, re, ssl, sys, subprocess, os
import edge_tts.communicate as c
c._SSL_CTX = ssl.create_default_context(cafile=os.environ.get("CA_BUNDLE", "/root/.ccr/ca-bundle.crt"))
import edge_tts
sys.path.insert(0, os.path.dirname(__file__))
from narration import SEGMENTS, spoken

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "audio", "vo")
VOICE = "kk-KZ-DauletNeural"
RATE = os.environ.get("VO_RATE", "-6%")
PITCH = os.environ.get("VO_PITCH", "+0Hz")

async def synth(seg):
    text = " ".join(spoken(ch) for ch in seg["chunks"])
    com = edge_tts.Communicate(text, VOICE, rate=seg.get("rate", RATE), pitch=PITCH, boundary="WordBoundary")
    words, mp3 = [], os.path.join(OUT, seg["id"] + ".raw.mp3")
    with open(mp3, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"w": ch["text"], "t0": ch["offset"] / 1e7, "t1": (ch["offset"] + ch["duration"]) / 1e7})
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]))
    return {"id": seg["id"], "words": words, "duration": dur}

async def main():
    os.makedirs(OUT, exist_ok=True)
    res = await asyncio.gather(*[synth(s) for s in SEGMENTS])
    for r in res:
        print(f'{r["id"]}: {r["duration"]:.2f}s, {len(r["words"])} words, speech {r["words"][0]["t0"]:.2f}-{r["words"][-1]["t1"]:.2f}')
    json.dump(res, open(os.path.join(OUT, "raw_timings.json"), "w"), ensure_ascii=False, indent=1)

asyncio.run(main())
