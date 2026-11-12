"""Generate per-sentence Russian voiceover with edge-tts (ru-RU-DmitryNeural) + word timings.
Usage: python3 scripts/gen_voice.py [rate] [pitch]
Writes public/vo/<scene>_<i>.mp3 and scripts/vo_timings.json"""
import ssl, asyncio, json, os, sys, subprocess
import edge_tts.communicate as c
ca = "/root/.ccr/ca-bundle.crt"
if os.path.exists(ca):
    c._SSL_CTX = ssl.create_default_context(cafile=ca)
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(os.path.join(ROOT, "scripts/narration.json"), encoding="utf-8"))
rate = sys.argv[1] if len(sys.argv) > 1 else cfg["rate"]
pitch = sys.argv[2] if len(sys.argv) > 2 else cfg["pitch"]
outdir = os.environ.get("VO_OUT") or os.path.join(ROOT, "public/vo"); os.makedirs(outdir, exist_ok=True)

def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode())

async def synth(text, path):
    for attempt in range(15):
        try:
            com = edge_tts.Communicate(text, cfg["voice"], rate=rate, pitch=pitch, boundary="WordBoundary")
            words = []
            with open(path + ".mp3", "wb") as f:
                async for ch in com.stream():
                    if ch["type"] == "audio": f.write(ch["data"])
                    elif ch["type"] == "WordBoundary":
                        words.append({"t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7, "w": ch["text"]})
            # decode to wav 48k for clean, frame-accurate mixing
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", path + ".mp3", "-ar", "48000", "-ac", "1", path + ".wav"], check=True)
            os.remove(path + ".mp3")
            return words
        except Exception as e:
            print("retry", e, flush=True); await asyncio.sleep(4 + attempt * 2)
    raise RuntimeError("TTS failed")

async def main():
    out = {"rate": rate, "pitch": pitch, "scenes": []}
    total = 0
    for sc in cfg["scenes"]:
        s_out = []
        for i, s in enumerate(sc["sentences"]):
            p = os.path.join(outdir, f"{sc['id']}_{i}")
            cache = p + ".json"
            key = {"tts": s["tts"], "rate": rate, "pitch": pitch, "voice": cfg["voice"]}
            if os.path.exists(cache) and os.path.exists(p + ".wav") and json.load(open(cache, encoding="utf-8"))["key"] == key:
                words = json.load(open(cache, encoding="utf-8"))["words"]
            else:
                words = await synth(s["tts"], p)
                json.dump({"key": key, "words": words}, open(cache, "w", encoding="utf-8"), ensure_ascii=False)
            d = dur(p + ".wav"); total += d
            s_out.append({"file": f"vo/{sc['id']}_{i}.wav", "duration": d, "words": words, "tts": s["tts"], "subs": s["subs"]})
            print(f"{sc['id']}_{i}: {d:.2f}s", flush=True)
        out["scenes"].append({"id": sc["id"], "sentences": s_out})
    print(f"TOTAL speech audio: {total:.1f}s")
    json.dump(out, open(os.environ.get("VO_TIMINGS") or os.path.join(ROOT, "scripts/vo_timings.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

asyncio.run(main())
