"""Build the placed Kazakh voiceover track and the subtitle cues.

Reads audio/vo/L*.mp3 + word timings (edge-tts WordBoundary), cleans and warms the
voice with FFmpeg, cuts L5/L8 at sentence boundaries, places every segment on the
120 s film timeline and writes:
  audio/vo_track.wav            48 kHz stereo, exactly 120 s
  build/cues.json               subtitle cues (with gold keyword flags) for the film
  ../deliverables/KAZAKH_SUBTITLES.srt
The written dialogue is used verbatim; subtitles are substrings of it.
"""
import json, os, re, subprocess, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SR = 48000
FILM = 120.0
LINES = {l["id"]: l for l in json.load(open("scripts_lines.json"))}

# (segment id, line, src_from, src_to, film_time)
SEGMENTS = [
    ("L1", "L1", 0.0, None, 5.20),
    ("L2", "L2", 0.0, None, 13.40),
    ("L3", "L3", 0.0, None, 28.10),
    ("L4", "L4", 0.0, None, 44.20),
    ("L5a", "L5", 0.0, 2.30, 58.60),
    ("L5b", "L5", 2.60, 4.95, 62.30),
    ("L5c", "L5", 5.20, 8.55, 65.80),
    ("L5d", "L5", 8.80, None, 69.80),
    ("L6", "L6", 0.0, None, 74.70),
    ("L7", "L7", 0.0, None, 93.00),
    ("L8a", "L8", 0.0, 1.75, 106.40),
    ("L8b", "L8", 2.05, 3.75, 108.10),
    ("L8c", "L8", 4.10, 5.80, 109.80),
    ("L8d", "L8", 6.10, None, 111.50),
]

GOLD = ["тәуелсіздік", "тәуелсіздігін", "тәуелсіз", "1986", "желтоқсанында", "алматы", "жастар", "1991", "16",
        "қазақстан", "туымызды", "теңгемізді", "әлемге", "ортақ", "үйіміз", "ұрпақ", "ұрпаққа", "азат", "аманат",
        "қорғау", "дамыту", "қадірлеу", "өткенді", "бүгінді", "болашаққа", "жауапкершілік", "арманы", "тағдыры"]

# Manual subtitle chunking (verbatim text split points) — at most two lines each.
CHUNKS = {
    "L1": ["Ата, тәуелсіздік деген не?"],
    "L2": ["Тәуелсіздік дегеніміз — жай ғана сөз емес, балам.",
           "Оның артында тұтас бір халықтың арманы мен тағдыры жатыр."],
    "L3": ["1986 жылдың желтоқсанында Алматы алаңына шыққан жастар",
           "елдің ертеңі үшін өз үнін жеткізді.",
           "Бұл — халқымыздың тарихындағы маңызды әрі ауыр кезеңдердің бірі."],
    "L4": ["Ал 1991 жылдың 16 желтоқсанында Қазақстан",
           "өзінің мемлекеттік тәуелсіздігін жариялады.",
           "Сол күннен бастап еліміздің жаңа тарихы басталды."],
    "L5": ["Біз өз туымызды көтердік.", "Өз теңгемізді енгіздік.",
           "Әлемге тәуелсіз мемлекет ретінде танылдық.", "Алдымызда жаңа жол ашылды."],
    "L6": ["Бүгінгі Қазақстан — біздің ортақ үйіміз.",
           "Оның әрбір жетістігінің артында еңбек еткен халық,",
           "армандаған жастар және болашаққа сенген ұрпақ тұр."],
    "L7": ["Балам, біз сендерге азат елді аманат еттік.",
           "Енді сол елді қорғау, дамыту, қадірлеу —",
           "сендердің қолдарыңда."],
    "L8": ["Өткенді ұмытпа.", "Бүгінді бағала.", "Болашаққа сен.",
           "Тәуелсіздік — атадан қалған аманат,", "ұрпаққа жүктелген жауапкершілік."],
}

def norm(w):
    return re.sub(r"[^\w]", "", w.lower())

def decode(path, extra=""):
    """Decode to mono float32 at 48 kHz with voice processing."""
    cmd = ["ffmpeg", "-v", "error", "-i", path, "-af",
           "aresample=48000," + (extra + "," if extra else "") +
           "highpass=f=75,equalizer=f=160:t=q:w=0.9:g=2.2,equalizer=f=380:t=q:w=1.2:g=-1.5,"
           "equalizer=f=3200:t=q:w=1.0:g=1.6,deesser=i=0.35,"
           "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=160:makeup=2",
           "-ac", "1", "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).copy()

def main():
    os.makedirs("build", exist_ok=True)
    os.makedirs("../deliverables", exist_ok=True)
    audio = {}
    for lid, l in LINES.items():
        extra = "rubberband=pitch=1.16:formant=shifted:pitchq=quality" if l["who"] == "grandson" else ""
        audio[lid] = decode(f"audio/vo/{lid}.mp3", extra)
    track = np.zeros(int(FILM * SR), dtype=np.float32)
    placed = []  # (line, src_from, src_to, film_time)
    for sid, lid, a, b, at in SEGMENTS:
        x = audio[lid]
        i0 = int(a * SR); i1 = len(x) if b is None else int(b * SR)
        seg = x[i0:i1].copy()
        f = int(0.012 * SR)  # tiny fades at cut points
        seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
        j = int(at * SR)
        track[j:j + len(seg)] += seg[: len(track) - j]
        placed.append((lid, a, a + len(seg) / SR, at))
    # loudness: peak-normalise voice to -3 dBFS (final mix does LUFS)
    track *= 10 ** (-3 / 20) / max(1e-6, np.abs(track).max())
    st = np.stack([track, track], 1)
    with wave.open("audio/vo_track.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())

    # ---- subtitle cues ----
    def film_time(lid, src_t):
        for l2, a, b, at in placed:
            if l2 == lid and a - 0.05 <= src_t <= b + 0.05:
                return at + (src_t - a)
        raise ValueError((lid, src_t))

    cues = []
    for lid, chunks in CHUNKS.items():
        words = json.load(open(f"audio/vo/{lid}.words.json"))
        assert " ".join(chunks).replace("  ", " ") == LINES[lid]["text"], (lid, "chunks must equal the script")
        wi = 0
        for ch in chunks:
            toks = [t for t in ch.split() if norm(t)]
            ws = words[wi: wi + len(toks)]
            for t, w in zip(toks, ws):
                assert norm(t) == norm(w["w"]), (lid, t, w["w"])
            wi += len(toks)
            start = film_time(lid, ws[0]["t"]) - 0.12
            end = film_time(lid, ws[-1]["t"] + ws[-1]["d"]) + 0.35
            parts = []
            for tok in ch.split():
                parts.append({"t": tok, "gold": norm(tok) in GOLD})
            cues.append({"line": lid, "who": LINES[lid]["who"], "start": round(start, 3), "end": round(end, 3), "text": ch, "words": parts})
        assert wi == len(words), (lid, wi, len(words))
    cues.sort(key=lambda c: c["start"])
    for a, b in zip(cues, cues[1:]):  # never overlap
        if a["end"] > b["start"] - 0.04:
            a["end"] = round(b["start"] - 0.04, 3)
    json.dump(cues, open("build/cues.json", "w"), ensure_ascii=False, indent=1)

    def ts(x):
        ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    with open("../deliverables/KAZAKH_SUBTITLES.srt", "w", encoding="utf-8") as f:
        for i, c in enumerate(cues, 1):
            f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{wrap(c['text'])}\n\n")
    print(len(cues), "cues; last ends", cues[-1]["end"])
    for lid, a, b, at in placed:
        print(f"{lid} src {a:.2f}-{b:.2f} -> film {at:.2f}-{at + b - a:.2f}")

def wrap(text, maxc=30):
    """Two balanced lines for SRT readability."""
    if len(text) <= maxc:
        return text
    words = text.split(); best = None
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        score = max(len(a), len(b))
        if best is None or score < best[0]:
            best = (score, a + "\n" + b)
    return best[1]

if __name__ == "__main__":
    main()
