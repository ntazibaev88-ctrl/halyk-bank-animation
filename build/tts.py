"""Generate Kazakh narration clips with Microsoft neural TTS (edge-tts).

Writes build/out/vo/NN_M.mp3 and build/out/vo_durations.json.
"""
import asyncio, json, os, ssl, subprocess, sys
import edge_tts.communicate as _c

# The sandbox proxy re-signs TLS; trust its bundle if present.
CA = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA):
    _c._SSL_CTX = ssl.create_default_context(cafile=CA)
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "out", "vo")
RATE = os.environ.get("VO_RATE", "-10%")
PITCH = os.environ.get("VO_PITCH", "-4Hz")


def duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", path], capture_output=True, text=True)
    return float(r.stdout.strip())


async def main():
    script = json.load(open(os.path.join(ROOT, "script", "script.json")))
    os.makedirs(OUT, exist_ok=True)
    durs = {}
    for ch in script["chapters"]:
        for i, line in enumerate(ch["lines"]):
            key = f"{ch['id']:02d}_{i}"
            path = os.path.join(OUT, key + ".mp3")
            if not os.path.exists(path) or "--force" in sys.argv:
                await edge_tts.Communicate(line["kk"], script["voice"], rate=RATE, pitch=PITCH).save(path)
            durs[key] = duration(path)
            print(key, round(durs[key], 2), line["kk"])
    json.dump(durs, open(os.path.join(ROOT, "build", "out", "vo_durations.json"), "w"), indent=1)

asyncio.run(main())
