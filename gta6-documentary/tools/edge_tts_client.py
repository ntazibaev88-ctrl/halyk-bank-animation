"""Thin wrapper around edge-tts with retries and word boundaries.

The cloud TTS endpoint answers intermittently with an empty stream, so every
request is retried with backoff. Uses the system/proxy CA bundle if present.
"""
import asyncio, os, ssl, time, random
import edge_tts
import edge_tts.communicate as _c

_CA = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
if os.path.exists(_CA):
    _c._SSL_CTX = ssl.create_default_context(cafile=_CA)


async def _once(text, voice, rate, pitch, out_path):
    com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    audio = bytearray()
    words = []
    async for ch in com.stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7, "w": ch["text"]})
    with open(out_path, "wb") as f:
        f.write(audio)
    return words


def synth(text, out_path, voice="ru-RU-DmitryNeural", rate="+0%", pitch="+0Hz", tries=12):
    last = None
    for i in range(tries):
        try:
            return asyncio.run(_once(text, voice, rate, pitch, out_path))
        except Exception as e:  # NoAudioReceived / transient network
            last = e
            time.sleep(0.6 + random.random() * 0.8)
    raise RuntimeError(f"TTS failed after {tries} tries: {last!r} for {text!r}")
