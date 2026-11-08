"""Generate the Kazakh voiceover (Microsoft neural voice kk-KZ-DauletNeural).

Each sentence is synthesised separately so we get exact word timings, then
placed on the film timeline with natural pauses. Scenes stretch to fit the
narration (the voice is never sped up).

Outputs:
  assets/audio/voiceover.wav   full narration track, 48 kHz mono
  data/timeline.json           scene starts/ends + every word's start/end
"""
import asyncio, json, os, ssl, subprocess, sys, pathlib
import numpy as np
import edge_tts, edge_tts.communicate as cm

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
CACHE = ROOT / "data" / "vo_cache"
CACHE.mkdir(parents=True, exist_ok=True)

# The sandbox proxy re-signs TLS; trust its bundle when present.
ca = "/root/.ccr/ca-bundle.crt"
if os.path.exists(ca):
    cm._SSL_CTX = ssl.create_default_context(cafile=ca)

SENT_GAP = 0.55      # pause between sentences inside a scene
TAIL = 0.9           # breathing room after a scene's last sentence


async def synth(text, cfg, idx):
    mp3 = CACHE / f"{idx:02d}.mp3"
    meta = CACHE / f"{idx:02d}.json"
    key = {"text": text, "voice": cfg["voice"], "rate": cfg["rate"], "pitch": cfg["pitch"]}
    if mp3.exists() and meta.exists() and json.loads(meta.read_text())["key"] == key:
        return mp3, json.loads(meta.read_text())["words"]
    c = edge_tts.Communicate(text, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"],
                             boundary="WordBoundary", proxy=os.environ.get("HTTPS_PROXY"))
    audio, words = bytearray(), []
    async for ch in c.stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"w": ch["text"], "s": ch["offset"] / 1e7, "e": (ch["offset"] + ch["duration"]) / 1e7})
    mp3.write_bytes(audio)
    meta.write_text(json.dumps({"key": key, "words": words}, ensure_ascii=False))
    return mp3, words


def decode(mp3):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp3), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def trim(x, thr=0.004):
    """Return (leading_silence_seconds, trimmed_audio)."""
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return 0.0, x
    a, b = max(idx[0] - int(0.02 * SR), 0), min(idx[-1] + int(0.08 * SR), len(x))
    return a / SR, x[a:b]


async def main():
    cfg = json.loads((ROOT / "data" / "script.json").read_text())
    t = 0.0
    clips, scenes, sentences = [], [], []
    n = 0
    for sc in cfg["scenes"]:
        start = t
        cur = start + sc.get("lead", 0.8)
        for text in sc["sentences"]:
            mp3, words = await synth(text, cfg, n)
            n += 1
            lead, audio = trim(decode(mp3))
            dur = len(audio) / SR
            clips.append((cur, audio))
            sentences.append({
                "scene": sc["id"], "text": text, "start": round(cur, 3), "end": round(cur + dur, 3),
                "words": [{"w": w["w"], "s": round(cur + w["s"] - lead, 3), "e": round(cur + w["e"] - lead, 3)} for w in words],
            })
            cur += dur + sc.get("gap", SENT_GAP)
        end = max(start + sc["minDur"], cur - sc.get("gap", SENT_GAP) + sc.get("tail", TAIL))
        scenes.append({"id": sc["id"], "name": sc["name"], "start": round(start, 3), "end": round(end, 3)})
        t = end
    total = t
    track = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for at, a in clips:
        i = int(at * SR)
        track[i:i + len(a)] += a
    track = track[: int(total * SR)]
    peak = np.max(np.abs(track))
    track = track / peak * 0.89  # about -1 dBFS peak
    out = ROOT / "assets" / "audio" / "voiceover.wav"
    pcm = (np.clip(track, -1, 1) * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", str(out)],
                   input=pcm, check=True)
    (ROOT / "data" / "timeline.json").write_text(json.dumps(
        {"duration": round(total, 3), "scenes": scenes, "sentences": sentences}, ensure_ascii=False, indent=1))
    for s in scenes:
        print(f"{s['id']} {s['start']:7.2f} -> {s['end']:7.2f}  ({s['end']-s['start']:.1f}s)  {s['name']}")
    print(f"total {total:.2f}s")


asyncio.run(main())
