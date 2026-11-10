"""Kazakh male voiceover with word-level timings.

Voice: Microsoft neural voice kk-KZ-DauletNeural (the native Kazakh male voice), tuned towards a
calm documentary baritone: lower pitch, unhurried rate, one request per sentence so every sentence
gets a clean start, and deliberate pauses between sentences (longer after the key statements).
The joined take is then mastered for warmth and levelled to -17 LUFS.

Usage: python3 tools/tts.py [rate] [pitch]      defaults: -10%  -12Hz
       python3 tools/tts.py --sample             writes renders/voice-sample.mp3 (scene 1 only)"""
import asyncio, json, os, re, subprocess, sys
import numpy as np
import edge_tts
args = [a for a in sys.argv[1:] if not a.startswith("--")]
RATE = args[0] if args else "-10%"
PITCH = args[1] if len(args) > 1 else "-12Hz"
SAMPLE = "--sample" in sys.argv
VOICE = "kk-KZ-DauletNeural"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 24000
PAUSE, PAUSE_LONG = 0.6, 0.85          # seconds of silence between sentences
MASTER = ("highpass=f=60,bass=g=3:f=150:w=0.7,equalizer=f=320:t=q:w=1.2:g=-1.5,equalizer=f=3200:t=q:w=1:g=1.5,"
          "acompressor=threshold=-20dB:ratio=2.5:attack=12:release=180:makeup=2,loudnorm=I=-17:TP=-1.5:LRA=9")

async def synth(text):
    c = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH, proxy=os.environ.get("HTTPS_PROXY"), boundary="WordBoundary")
    words, audio = [], b""
    async for ch in c.stream():
        if ch["type"] == "audio": audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"text": ch["text"], "start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7})
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], input=audio, stdout=subprocess.PIPE, check=True).stdout
    x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    # trim the engine's own leading/trailing silence so the pauses are the ones we choose
    env = np.abs(x) > 0.012
    a = max(0, int(np.argmax(env)) - int(0.03 * SR)); b = min(len(x), len(x) - int(np.argmax(env[::-1])) + int(0.08 * SR))
    for w in words: w["start"] -= a / SR; w["end"] -= a / SR
    return x[a:b], words

async def one(item):
    text = item.get("tts", item["text"])
    sents = [s.strip() for s in re.findall(r"[^.!?]+[.!?]", text)]
    long_after = set(item.get("long_pause_after", []))
    out, words, t = [], [], 0.08
    out.append(np.zeros(int(t * SR), np.float32))
    for i, s in enumerate(sents):
        x, ws = await synth(s)
        for w in ws: words.append({"text": w["text"], "start": round(t + w["start"], 3), "end": round(t + w["end"], 3)})
        out.append(x); t += len(x) / SR
        if i + 1 < len(sents):
            p = PAUSE_LONG if i in long_after else PAUSE
            out.append(np.zeros(int(p * SR), np.float32)); t += p
    out.append(np.zeros(int(0.25 * SR), np.float32))
    pcm = (np.clip(np.concatenate(out), -1, 1) * 32767).astype(np.int16).tobytes()
    dst = f"{ROOT}/renders/voice-sample.mp3" if SAMPLE else f"{ROOT}/assets/audio/vo-{item['id']}.mp3"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "pipe:0", "-af", MASTER, "-ar", "48000", "-b:a", "192k", dst], input=pcm, check=True)
    return {"id": item["id"], "text": item["text"], "words": words, "voice": VOICE, "rate": RATE, "pitch": PITCH}

async def main():
    items = json.load(open(f"{ROOT}/tools/narration.json", encoding="utf-8"))
    if SAMPLE: await one(items[0]); return
    out = [await one(i) for i in items]
    json.dump(out, open(f"{ROOT}/tools/vo-words.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
asyncio.run(main())
