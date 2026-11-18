"""Generate the narration, one sentence per file, with word timings.

Output: audio/vo_parts/<id>.mp3 + <id>.json (word boundaries, seconds).
Existing parts are kept (delete a file to regenerate it). Voice:
Microsoft Edge neural TTS (ru-RU-DmitryNeural) — synthetic speech.
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from edge_tts_client import synth

ROOT = os.path.join(HERE, "..")
nar = json.load(open(os.path.join(ROOT, "script", "narration.json")))
out_dir = os.path.join(ROOT, "audio", "vo_parts")
os.makedirs(out_dir, exist_ok=True)


def tts_text(text):
    for k, v in nar.get("tts_substitutions", {}).items():
        text = text.replace(k, v)
    return text


for sec in nar["sections"]:
    for s in sec["sentences"]:
        mp3 = os.path.join(out_dir, s["id"] + ".mp3")
        js = os.path.join(out_dir, s["id"] + ".json")
        if os.path.exists(mp3) and os.path.exists(js):
            continue
        words = synth(tts_text(s["text"]), mp3, voice=nar["voice"], rate=nar.get("tts_rate", "+0%"),
                      pitch=nar.get("tts_pitch", "+0Hz"), tries=60)
        json.dump(words, open(js, "w"), ensure_ascii=False, indent=1)
        print(s["id"], "ok", len(words), "words", flush=True)
print("all narration parts present")
