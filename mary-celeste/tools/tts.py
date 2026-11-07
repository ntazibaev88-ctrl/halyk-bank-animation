"""Voiceover: synthesize each narration segment with edge-tts (word boundaries),
join with controlled pauses, post-process, and write assets/audio/voice.wav +
assets/data/timing.json (segment and word timings in film seconds).

Display text may contain {shown|spoken} tokens, e.g. {1872|тысяча ...}."""
import asyncio, hashlib, json, re, subprocess, sys, tempfile, os, time
import numpy as np, soundfile as sf
import edge_tts, ssl
import edge_tts.communicate as _ec
if os.environ.get("SSL_CERT_FILE"): _ec._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
cfg = json.load(open(os.path.join(ROOT, "tools/narration.json"), encoding="utf-8"))
TOK = re.compile(r"\{([^|}]+)\|([^}]+)\}")

def spoken(text):  return TOK.sub(lambda m: m.group(2), text)
def display(text): return TOK.sub(lambda m: m.group(1), text)
def letters(s):    return re.sub(r"[^0-9a-zа-я]", "", s.lower().replace("ё", "е"))

def display_tokens(text):
    """[(shown_word, letters_of_spoken_form)] ; punctuation-only tokens glue to previous."""
    out = []
    for part in re.split(r"(\{[^}]+\})|\s+", text):
        if not part: continue
        m = TOK.fullmatch(part)
        shown, say = (m.group(1), m.group(2)) if m else (part, part)
        if not letters(shown) and out:
            out[-1] = (out[-1][0] + " " + shown if shown in "—–" else out[-1][0] + shown, out[-1][1]); continue
        if out and m is None and part[0] in ".,!?:;»" :
            out[-1] = (out[-1][0] + part, out[-1][1]); continue
        out.append((shown, letters(say)))
    return out

async def synth(text, path):
    c = edge_tts.Communicate(text, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"], boundary="WordBoundary")
    words = []
    with open(path, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"text": ch["text"], "start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7})
    return words

def load(path):
    wav = os.path.join(tempfile.gettempdir(), os.path.basename(path) + ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", path, "-ar", str(SR), "-ac", "1", wav], check=True)
    a, _ = sf.read(wav); return a

def main():
    tmp = tempfile.mkdtemp()
    t = cfg["start"]; pieces = [np.zeros(int(SR * t))]; segs = []
    for s in cfg["segments"]:
        key = hashlib.sha1(json.dumps([spoken(s["text"]), cfg["voice"], cfg["rate"], cfg["pitch"]]).encode()).hexdigest()[:10]
        cache = os.path.join(ROOT, "assets/audio/vo", f'{s["id"]}-{key}')
        os.makedirs(os.path.dirname(cache), exist_ok=True)
        mp3 = cache + ".mp3"
        if os.path.exists(cache + ".json"):
            bw = json.load(open(cache + ".json"))
        else:
          for attempt in range(12):
            try: bw = asyncio.run(synth(spoken(s["text"]), mp3)); json.dump(bw, open(cache + ".json", "w")); break
            except Exception as e:
                print("retry", s["id"], e, file=sys.stderr); time.sleep(min(2 * (attempt + 1), 10))
          else: sys.exit("TTS failed for " + s["id"])
        a = load(mp3)
        # trim leading/trailing silence, keep 30 ms of air
        nz = np.where(np.abs(a) > 0.003)[0]
        lead = max(0, nz[0] - int(0.03 * SR)); tail = min(len(a), nz[-1] + int(0.06 * SR))
        a = a[lead:tail]; off = lead / SR
        # align boundary words to display words by letters
        toks = display_tokens(s["text"]); words = []; bi = 0
        for shown, need in toks:
            acc = ""; st = None; en = None
            while bi < len(bw) and len(acc) < len(need):
                if st is None: st = bw[bi]["start"]
                acc += letters(bw[bi]["text"]); en = bw[bi]["end"]; bi += 1
            if st is None: st = en = words[-1]["end"] - off + t if words else 0
            words.append({"text": shown, "start": round(t + max(0, st - off), 3), "end": round(t + max(0, en - off), 3)})
        dur = len(a) / SR
        segs.append({"id": s["id"], "text": display(s["text"]), "start": round(t, 3), "end": round(t + dur, 3), "words": words})
        if bi != len(bw): print("WARN alignment", s["id"], bi, len(bw), file=sys.stderr)
        pieces += [a, np.zeros(int(SR * s["pause"]))]
        t += dur + s["pause"]
    voice = np.concatenate(pieces + [np.zeros(int(SR * 0.5))])
    raw = os.path.join(tmp, "raw.wav"); sf.write(raw, voice, SR)
    out = os.path.join(ROOT, "assets/audio/voice.wav")
    # warmth + presence, gentle compression, loudness to -16 LUFS, peak -1.5 dBTP
    af = ("highpass=f=70,equalizer=f=140:t=q:w=0.9:g=2.5,equalizer=f=3200:t=q:w=1:g=1.5,"
          "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,"
          "loudnorm=I=-16:TP=-1.5:LRA=7")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", af, "-ar", str(SR), "-ac", "1", out], check=True)
    json.dump({"voiceEnd": round(t, 3), "segments": segs}, open(os.path.join(ROOT, "assets/data/timing.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for s in segs: print(f'{s["id"]} {s["start"]:6.2f}-{s["end"]:6.2f}  {s["text"]}')
    print("voice ends", round(t, 2))

main()
