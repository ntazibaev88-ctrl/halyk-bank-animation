"""Generate Kazakh narration (edge-tts, kk-KZ-DauletNeural) and the master timeline.

Outputs:
  build/voice/<hash>.mp3      cached per-segment audio
  build/voice.wav             full narration track, 48 kHz mono
  build/timeline.json         scene/segment/word timings used by the animation
"""
import asyncio, hashlib, json, os, re, subprocess, sys, wave
import numpy as np
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
GAP = 0.32        # pause between sentences
GAP_COMMA = 0.12  # pause after a segment that ends with a comma


async def synth(text, voice, rate, pitch, path):
    proxy = os.environ.get("HTTPS_PROXY") or None
    words = []
    for attempt in range(5):
        try:
            com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=proxy, boundary="WordBoundary")
            audio = bytearray()
            words = []
            async for ch in com.stream():
                if ch["type"] == "audio":
                    audio += ch["data"]
                elif ch["type"] == "WordBoundary":
                    words.append({"w": ch["text"], "s": ch["offset"] / 1e7, "e": (ch["offset"] + ch["duration"]) / 1e7})
            open(path, "wb").write(audio)
            json.dump(words, open(path + ".json", "w"), ensure_ascii=False)
            return
        except Exception as e:  # network hiccup: retry with backoff
            print("  retry", attempt, e, file=sys.stderr)
            await asyncio.sleep(2 ** attempt)
    raise RuntimeError("TTS failed for: " + text)


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def trim(x, thr=0.004):
    """Return (start, end) sample indices of the voiced part."""
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return 0, len(x)
    return max(0, idx[0] - int(0.03 * SR)), min(len(x), idx[-1] + int(0.08 * SR))


def norm(s):
    return re.sub(r"[^\w]", "", s.lower())


def align(display_text, words, seg_len):
    """Map display tokens to times. Uses word boundaries when they line up, otherwise
    distributes time proportionally to token length."""
    toks = [t for t in display_text.split()]
    out = []
    if words and len(words) == len([t for t in toks if norm(t)]):
        wi = 0
        for t in toks:
            if norm(t):
                out.append({"w": t, "s": words[wi]["s"], "e": words[wi]["e"]})
                wi += 1
            else:  # dash etc. glued to previous timing
                prev = out[-1] if out else {"s": 0, "e": 0}
                out.append({"w": t, "s": prev["e"], "e": prev["e"]})
        return out, True
    # proportional fallback
    lens = [max(1, len(norm(t))) + 1 for t in toks]
    tot = sum(lens)
    t0, span = 0.05, max(0.1, seg_len - 0.1)
    acc = 0
    for t, l in zip(toks, lens):
        s = t0 + span * acc / tot
        acc += l
        out.append({"w": t, "s": s, "e": t0 + span * acc / tot})
    return out, False


async def main():
    cfg = json.load(open(os.path.join(ROOT, "script", "scenes.json")))
    vdir = os.path.join(ROOT, "build", "voice")
    os.makedirs(vdir, exist_ok=True)
    jobs = []
    for sc in cfg["scenes"]:
        for seg in sc["segments"]:
            say = seg.get("say", seg["text"])
            h = hashlib.sha1(f'{cfg["voice"]}|{cfg["rate"]}|{cfg["pitch"]}|{say}'.encode()).hexdigest()[:12]
            seg["_path"] = os.path.join(vdir, h + ".mp3")
            if not os.path.exists(seg["_path"] + ".json"):
                jobs.append((say, seg["_path"]))
    sem = asyncio.Semaphore(4)

    async def run(say, p):
        async with sem:
            print("TTS:", say)
            await synth(say, cfg["voice"], cfg["rate"], cfg["pitch"], p)
    await asyncio.gather(*[run(*j) for j in jobs])

    t = 0.0
    track = []
    timeline = {"scenes": [], "highlight": cfg["highlight"]}
    for sc in cfg["scenes"]:
        s_start = t
        t += sc.get("padBefore", 0.5)
        segs = []
        for i, seg in enumerate(sc["segments"]):
            x = decode(seg["_path"])
            a, b = trim(x)
            x = x[a:b]
            words = json.load(open(seg["_path"] + ".json"))
            for w in words:
                w["s"] -= a / SR
                w["e"] -= a / SR
            seg_len = len(x) / SR
            aligned, exact = align(seg["text"], words, seg_len)
            track.append((t, x))
            segs.append({"text": seg["text"], "cue": seg.get("cue"), "start": round(t, 3), "end": round(t + seg_len, 3),
                         "words": [{"w": w["w"], "s": round(t + w["s"], 3), "e": round(t + w["e"], 3)} for w in aligned],
                         "exact": exact})
            t += seg_len
            if i < len(sc["segments"]) - 1:
                t += GAP_COMMA if seg["text"].rstrip().endswith(",") else sc.get("gap", GAP)
        t += sc.get("padAfter", 0.5)
        timeline["scenes"].append({"id": sc["id"], "start": round(s_start, 3), "end": round(t, 3), "segments": segs})
    timeline["duration"] = round(t, 3)

    out = np.zeros(int((t + 0.5) * SR), dtype=np.float32)
    for st, x in track:
        i = int(st * SR)
        out[i:i + len(x)] += x
    peak = np.max(np.abs(out)) or 1
    out = out / peak * 0.89
    with wave.open(os.path.join(ROOT, "build", "voice.wav"), "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((out * 32767).astype(np.int16).tobytes())
    json.dump(timeline, open(os.path.join(ROOT, "build", "timeline.json"), "w"), ensure_ascii=False, indent=1)
    for sc in timeline["scenes"]:
        print(f'{sc["id"]:10s} {sc["start"]:7.2f} -> {sc["end"]:7.2f}  ({sc["end"]-sc["start"]:.1f}s)')
    print("TOTAL", timeline["duration"])


if __name__ == "__main__":
    asyncio.run(main())
