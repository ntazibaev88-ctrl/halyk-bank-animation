"""Lay out the narration on the 80 s timeline and derive everything from it.

Reads   script/narration.json, script/shots.json, audio/vo_parts/*
Writes  audio/voiceover.wav           processed narration, 48 kHz, exactly 80 s
        build/timeline.json           words, subtitle cues, shots (machine-readable)
        deliverables/GTA6_subtitles.srt
        deliverables/GTA6_scene_timeline.md / .csv
"""
import csv, json, os, re, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from dsp import SR, read_audio, write_wav, make_ir, reverb, db

ROOT = os.path.abspath(os.path.join(HERE, ".."))
DUR = 80.0
FPS = 30
CUT_LEAD = 4 / FPS          # cut lands 4 frames before the anchor word
SENT_GAP = 0.22             # extra pause between sentences (clips already carry ~0.34 s of natural edge)
Q_GAP = 0.40                # pause after a question
SEC_GAP = 0.45              # pause between sections (before any surplus is shared out)
SECTION_LEAD = {"hook": 0.55}
DEFAULT_LEAD = 0.30
END_TAIL = 1.6              # music/end-card room after the last word

nar = json.load(open(os.path.join(ROOT, "script", "narration.json")))
shots_spec = json.load(open(os.path.join(ROOT, "script", "shots.json")))["shots"]
parts = os.path.join(ROOT, "audio", "vo_parts")
os.makedirs(os.path.join(ROOT, "build"), exist_ok=True)
os.makedirs(os.path.join(ROOT, "deliverables"), exist_ok=True)


def display_tokens(text):
    """Words as written (punctuation attached); stand-alone dashes merge left."""
    toks = []
    for tok in text.split():
        if re.fullmatch(r"[—–\-:,.!?]+", tok) and toks:
            toks[-1] += " " + tok
        else:
            toks.append(tok)
    return toks


def voice_chain(path):
    """Decode + broadcast-style voice processing via ffmpeg -> float stereo 48k."""
    af = ("aresample=48000:resampler=soxr,highpass=f=75,"
          "equalizer=f=160:t=q:w=1.0:g=2.0,equalizer=f=320:t=q:w=1.2:g=-1.5,"
          "equalizer=f=3200:t=q:w=1.0:g=2.0,equalizer=f=9000:t=h:w=0.7:g=1.5,"
          "deesser=i=0.35,acompressor=threshold=-22dB:ratio=3:attack=6:release=90:makeup=3dB")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-af", af, "-f", "f32le", "-ac", "1",
                          "-ar", str(SR), "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def atempo(x, factor):
    if abs(factor - 1) < 1e-3:
        return x
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f64le", "-ar", str(SR), "-ac", "1", "-i", "-",
                        "-af", f"rubberband=tempo={factor}:transients=smooth:formant=preserved",
                        "-f", "f64le", "-"], input=x.astype(np.float64).tobytes(), check=True, capture_output=True)
    return np.frombuffer(p.stdout, dtype=np.float64)


# ---------------------------------------------------------------- load parts
sentences = []
for sec in nar["sections"]:
    for s in sec["sentences"]:
        words = json.load(open(os.path.join(parts, s["id"] + ".json")))
        audio = voice_chain(os.path.join(parts, s["id"] + ".mp3"))
        toks = display_tokens(s["text"])
        if len(toks) != len(words):
            raise SystemExit(f"{s['id']}: {len(toks)} display tokens vs {len(words)} spoken words\n{toks}\n{[w['w'] for w in words]}")
        # trim to speech (+ small pads); keep word times relative to the trimmed clip
        head = max(0.0, words[0]["t"] - 0.06)
        tail = min(len(audio) / SR, words[-1]["t"] + words[-1]["d"] + 0.28)
        clip = audio[int(head * SR):int(tail * SR)]
        ws = [{"w": toks[i], "spoken": w["w"], "t": w["t"] - head, "d": w["d"]} for i, w in enumerate(words)]
        sentences.append({"id": s["id"], "section": sec["id"], "text": s["text"], "audio": clip,
                          "words": ws, "highlight": s.get("highlight", [])})

# ---------------------------------------------------------------- layout
by_sec = {}
for s in sentences:
    by_sec.setdefault(s["section"], []).append(s)

placed = []
secs = nar["sections"]
gaps_in = {sec["id"]: [Q_GAP if s["text"].endswith("?") else SENT_GAP for s in by_sec[sec["id"]][:-1]] for sec in secs}
speech = sum(len(s["audio"]) / SR for s in sentences)
fixed = SECTION_LEAD.get(secs[0]["id"], DEFAULT_LEAD) + sum(sum(g) for g in gaps_in.values()) + SEC_GAP * (len(secs) - 1)
avail = DUR - END_TAIL
tempo = 1.0
if speech + fixed > avail:
    tempo = (speech + fixed) / avail          # uniform, gentle; refuse anything audible
    if tempo > 1.06:
        raise SystemExit(f"narration needs x{tempo:.3f} to fit 80 s - too fast, shorten the script")
surplus = max(0.0, avail - (speech / tempo + fixed / tempo))
extra_sec_gap = min(1.2, surplus / max(1, len(secs) - 1))

t = SECTION_LEAD.get(secs[0]["id"], DEFAULT_LEAD)
for i, sec in enumerate(secs):
    ss = by_sec[sec["id"]]
    if i > 0:
        t += (SEC_GAP + extra_sec_gap) / tempo
    sec["speech_start"] = t
    for k, s in enumerate(ss):
        a = atempo(s["audio"], tempo)
        s["audio_out"], s["start"], s["tempo"] = a, t, tempo
        for w in s["words"]:
            w["T"] = t + w["t"] / tempo
            w["D"] = w["d"] / tempo
        t += len(a) / SR
        if k < len(ss) - 1:
            t += gaps_in[sec["id"]][k] / tempo
        placed.append(s)
    sec["speech_end"], sec["tempo"] = t, tempo
cursor = t
# visual/musical section boundaries follow the speech (cut a beat before it starts)
for i, sec in enumerate(secs):
    sec["nominal"] = [sec["start"], sec["end"]]
    sec["start"] = 0.0 if i == 0 else round(sec["speech_start"] - DEFAULT_LEAD, 3)
for i, sec in enumerate(secs):
    sec["end"] = secs[i + 1]["start"] if i + 1 < len(secs) else DUR

if cursor > DUR - 0.8:
    raise SystemExit(f"narration overflows the 80 s timeline (ends {cursor:.2f}s)")

# ---------------------------------------------------------------- voiceover.wav
vo = np.zeros(int(DUR * SR))
for s in placed:
    i = int(round(s["start"] * SR))
    a = s["audio_out"]
    n = min(len(a), len(vo) - i)
    fade = int(0.012 * SR)
    a = a.copy()
    a[:fade] *= np.linspace(0, 1, fade)
    a[-fade:] *= np.linspace(1, 0, fade)
    vo[i:i + n] += a[:n]
# very light room so the voice sits in the mix (not an effect)
ir = make_ir(0.9, 0.35, damp=5000, seed=3)
vo_st = reverb(vo, ir, wet=0.07)
vo_st *= db(-1.0) / (np.max(np.abs(vo_st)) + 1e-9)
write_wav(os.path.join(ROOT, "audio", "voiceover.wav"), vo_st)

# ---------------------------------------------------------------- words
all_words = []
for s in placed:
    for w in s["words"]:
        all_words.append({"sid": s["id"], "w": w["w"], "start": round(w["T"], 3), "end": round(w["T"] + w["D"], 3),
                          "hl": w["w"] in s["highlight"]})


def norm(w):
    return re.sub(r"[^\wё\-]", "", w.lower())


def find_word(anchor):
    sid, word = anchor.split(":", 1)
    for w in all_words:
        if w["sid"] == sid and norm(w["w"]) == norm(word):
            return w
    raise SystemExit(f"anchor not found: {anchor}")


# ---------------------------------------------------------------- subtitles
MAX_CHARS = 38
LINE_CHARS = 19
# words that must not end a cue or a line (prepositions, conjunctions, particles)
FUNC = {"в", "во", "и", "а", "но", "по", "на", "из", "не", "с", "со", "к", "о", "об", "от", "до", "за",
        "что", "как", "ли", "уже", "в", "том,", "это", "этот", "весь", "самых", "одним", "такие", "всему"}


def bare(w):
    return re.sub(r"[^\wё\-]", "", w.lower())


def is_func(w):
    return bare(w) in FUNC and not re.search(r"[,.:;?!]$", w)


PHRASES = [("ночная", "жизнь"), ("новый", "уровень"), ("открытого", "мира"), ("живого", "города"),
           ("игра", "сможет"), ("сможет", "оправдать"), ("неправильный", "шаг"), ("мелочи", "заставляют"),
           ("игроков", "возвращаться"), ("самых", "обсуждаемых"), ("стала", "одним"),
           ("окружающий", "мир"), ("превзойти", "собственную"), ("собственную", "легенду")]


def glued(a, b):
    """True if a break between words a and b is forbidden."""
    return bare(a) == "gta" or bare(b) in ("ли", "6") or (bare(a), bare(b)) in PHRASES


def cue_cost(ws, final, nxt=None):
    text = " ".join(w["w"] for w in ws)
    if len(text) > MAX_CHARS and len(ws) > 1:
        return 1e9
    c = (MAX_CHARS - len(text)) * 0.12                     # prefer fuller cues
    last = ws[-1]["w"]
    if not final and not re.search(r"[,.:;?!—]$", last):
        c += 9                                             # break mid-phrase
    if not final and is_func(last):
        c += 40                                            # never end on "в", "по", "и" ...
    if nxt is not None and glued(last, nxt["w"]):
        c += 1000
    if len(text) < 9 and not final:
        c += 10                                            # orphan fragment
    if len(text) < 9 and final and len(ws) == 1:
        c += 7                                             # dangling last word
    if ws[-1]["end"] - ws[0]["start"] > 3.4:
        c += 8
    return c


cues = []
for s in placed:
    ws = [w for w in all_words if w["sid"] == s["id"]]
    n = len(ws)
    best = [0.0] + [1e18] * n
    prev = [0] * (n + 1)
    for j in range(1, n + 1):
        for i in range(max(0, j - 8), j):
            c = best[i] + cue_cost(ws[i:j], j == n, ws[j] if j < n else None)
            if c < best[j]:
                best[j], prev[j] = c, i
    cuts, j = [], n
    while j > 0:
        cuts.append((prev[j], j))
        j = prev[j]
    for i, j in reversed(cuts):
        cues.append(ws[i:j])


def split_lines(words):
    text = " ".join(w["w"] for w in words)
    if len(text) <= LINE_CHARS or len(words) == 1:
        return [words]
    best, best_k = None, 1
    for k in range(1, len(words)):
        a = len(" ".join(w["w"] for w in words[:k]))
        b = len(" ".join(w["w"] for w in words[k:]))
        score = abs(a - b) + (0 if a <= b + 6 else 3)
        if is_func(words[k - 1]["w"]):
            score += 30
        if glued(words[k - 1]["w"], words[k]["w"]):
            score += 1000
        if re.search(r"[,.:;?!—]$", words[k - 1]["w"]):
            score -= 4
        if min(a, b) < 7:
            score += 12
        if max(a, b) > 22:
            score += 20
        if best is None or score < best:
            best, best_k = score, k
    return [words[:best_k], words[best_k:]]


sub_cues = []
for k, c in enumerate(cues):
    start = c[0]["start"] - 0.05
    end = c[-1]["end"] + 0.30
    sub_cues.append({"start": start, "end": end, "lines": [[{"w": w["w"], "hl": w["hl"]} for w in ln] for ln in split_lines(c)]})
for a, b in zip(sub_cues, sub_cues[1:]):
    if a["end"] > b["start"] - 0.04:
        a["end"] = b["start"] - 0.04
    if b["start"] - a["end"] < 0.25:   # close tiny gaps so text doesn't blink
        a["end"] = b["start"] - 0.04
for c in sub_cues:
    c["start"], c["end"] = round(c["start"], 3), round(c["end"], 3)


def srt_time(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


with open(os.path.join(ROOT, "deliverables", "GTA6_subtitles.srt"), "w", encoding="utf-8") as f:
    for i, c in enumerate(sub_cues, 1):
        lines = "\n".join(" ".join(w["w"] for w in ln) for ln in c["lines"])
        f.write(f"{i}\n{srt_time(c['start'])} --> {srt_time(c['end'])}\n{lines}\n\n")

# ---------------------------------------------------------------- shots
shots = []
for sp in shots_spec:
    if sp["at"] == "start":
        t0 = 0.0
        anchor_word = None
    else:
        w = find_word(sp["at"])
        t0 = max(0.0, round((w["start"] - CUT_LEAD) * FPS) / FPS)
        anchor_word = w
    shots.append(dict(sp, start=t0, anchor_word=anchor_word["w"] if anchor_word else None))
shots.sort(key=lambda s: s["start"])
for a, b in zip(shots, shots[1:]):
    a["end"] = b["start"]
shots[-1]["end"] = DUR
for s in shots:
    s["dur"] = round(s["end"] - s["start"], 3)
    # narration spoken during the shot
    s["narration"] = " ".join(w["w"] for w in all_words if s["start"] <= w["start"] < s["end"])
    s["subtitle"] = " / ".join(" ".join(" ".join(x["w"] for x in ln) for ln in c["lines"])
                               for c in sub_cues if c["start"] < s["end"] and c["end"] > s["start"])
    s["file"] = f"footage/cut/{s['id']}.mp4"

warn = [f"{s['id']} {s['dur']:.2f}s" for s in shots if s["dur"] < 1.3 or s["dur"] > 4.6]

sections = [{"id": s["id"], "title": s["title"], "start": s["start"], "end": s["end"], "nominal": s["nominal"],
             "speech_start": round(s["speech_start"], 3), "speech_end": round(s["speech_end"], 3),
             "tempo": round(s["tempo"], 3)} for s in nar["sections"]]
sent_out = [{"id": s["id"], "section": s["section"], "text": s["text"], "start": round(s["start"], 3),
             "end": round(s["start"] + len(s["audio_out"]) / SR, 3)} for s in placed]
json.dump({"duration": DUR, "fps": FPS, "sections": sections, "sentences": sent_out, "words": all_words,
           "subtitles": sub_cues, "shots": shots}, open(os.path.join(ROOT, "build", "timeline.json"), "w"),
          ensure_ascii=False, indent=1)


# ---------------------------------------------------------------- human timeline
def tc(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


with open(os.path.join(ROOT, "deliverables", "GTA6_scene_timeline.csv"), "w", newline="", encoding="utf-8") as f:
    wr = csv.writer(f)
    wr.writerow(["shot", "start", "end", "duration_s", "narration", "video_file", "visual", "footage_needed", "subtitle"])
    for s in shots:
        wr.writerow([s["id"], tc(s["start"]), tc(s["end"]), f"{s['dur']:.2f}", s["narration"], s["file"],
                     s["visual"], s["need"], s["subtitle"]])

with open(os.path.join(ROOT, "deliverables", "GTA6_scene_timeline.md"), "w", encoding="utf-8") as f:
    f.write("# GTA 6 — The Game That Changed Everything? · Scene timeline\n\n")
    f.write(f"80.00 s · 2160×3840 · 30 fps · {len(shots)} shots · cuts land {int(CUT_LEAD * FPS)} frames before the anchor word.\n\n")
    for sec in sections:
        f.write(f"## {sec['title']} — {tc(sec['start'])}–{tc(sec['end'])} (speech {tc(sec['speech_start'])}–{tc(sec['speech_end'])})\n\n")
        f.write("| Shot | Start | End | Dur | Narration (spoken in shot) | Video file | Visual | Subtitle |\n|---|---|---|---|---|---|---|---|\n")
        for s in shots:
            if sec["start"] - 0.5 <= s["start"] < sec["end"] - 0.5 or (sec is sections[0] and s["start"] < 0.5):
                if any(s is x for x in shots) and not s.get("_w"):
                    s["_w"] = True
                    f.write(f"| {s['id']} | {tc(s['start'])} | {tc(s['end'])} | {s['dur']:.2f}s | {s['narration']} | `{s['file']}` | {s['visual']}. **Needs:** {s['need']} | {s['subtitle']} |\n")
        f.write("\n")
for s in shots:
    s.pop("_w", None)

print(f"speech ends at {cursor:.2f}s; sections:")
for s in sections:
    print(f"  {s['id']:13s} window {s['start']:5.1f}-{s['end']:5.1f}  speech {s['speech_start']:6.2f}-{s['speech_end']:6.2f}  tempo x{s['tempo']}")
print(f"{len(shots)} shots, {len(sub_cues)} subtitle cues; avg shot {DUR / len(shots):.2f}s")
if warn:
    print("shot length warnings:", ", ".join(warn))
