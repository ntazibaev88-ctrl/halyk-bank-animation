#!/usr/bin/env python3
"""Re-time the whole film to ANY replacement narration (human voice actor or another Russian neural TTS).

    python3 tools/align_voice.py path/to/my_voiceover.wav
    python3 tools/build_audio.py && python3 tools/build_project.py && npx hyperframes render ...

The recording is copied to audio/voiceover_ru.wav (48 kHz mono, loudness-normalised), transcribed
with the GigaAM-v2 Russian recogniser, and force-aligned word by word to script/narration.json.
Scene slots, subtitle cues and every animation cue (they read CH/CE from timing.json) follow the
new performance automatically. Record the text exactly as in voiceover_ru.txt; pauses are free.
"""
import json, os, re, subprocess, sys, wave, difflib
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TTS_DIR = os.environ.get("TTS_DIR", "/opt/tts")
import sherpa_onnx

G = f"{TTS_DIR}/sherpa-onnx-nemo-ctc-giga-am-v2-russian-2025-04-19"
ASR = sherpa_onnx.OfflineRecognizer.from_nemo_ctc(model=f"{G}/model.int8.onnx", tokens=f"{G}/tokens.txt", num_threads=4)


def norm(w): return re.sub(r"[^а-яё0-9]", "", w.lower()).replace("ё", "е")
def words_of(t): return [w for w in (norm(x) for x in t.replace("*", "").split()) if w]


def main(src):
    out = f"{ROOT}/audio/voiceover_ru.wav"
    if os.path.abspath(src) != os.path.abspath(out):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", "highpass=f=60,loudnorm=I=-16:TP=-2:LRA=7",
                        "-ar", "48000", "-ac", "1", out], check=True)
    tmp = "/tmp/align16k.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", out, "-ar", "16000", "-ac", "1", tmp], check=True)
    w = wave.open(tmp); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; sr = 16000
    # split on pauses >= 0.25 s so each piece is a phrase
    hop = int(.02 * sr); e = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, "same"))[::hop]
    voiced = e > max(.01, np.percentile(e, 95) * .06)
    segs, i = [], 0
    while i < len(voiced):
        if voiced[i]:
            j = i
            while j < len(voiced) and (voiced[j] or voiced[j:j + 13].any()): j += 1
            segs.append((max(0, i * hop - 1600), min(len(x), j * hop + 1600))); i = j
        else: i += 1
    hyp = []
    for a, b in segs:
        s = ASR.create_stream(); s.accept_waveform(sr, x[a:b]); ASR.decode_stream(s); r = s.result
        cur, t0, t1 = "", 0, 0
        for tok, ts in list(zip(r.tokens, r.timestamps)) + [(" ", 0)]:
            if tok.strip() in ("", "▁"):
                if cur and norm(cur): hyp.append((norm(cur), a / sr + t0, a / sr + t1))
                cur = ""; continue
            if not cur: t0 = ts
            cur += tok.replace("▁", ""); t1 = ts + .06
    data = json.load(open(f"{ROOT}/script/narration.json"))
    chunks = [(sc, c) for sc in data["scenes"] for c in sc["chunks"]]
    ref, owner = [], []
    for k, (sc, c) in enumerate(chunks):
        ws = words_of(c.get("tts") or c["t"]); ref += ws; owner += [k] * len(ws)
    sm = difflib.SequenceMatcher(a=ref, b=[h[0] for h in hyp], autojunk=False)
    t = [None] * len(ref)
    for blk in sm.get_matching_blocks():
        for q in range(blk.size): t[blk.a + q] = hyp[blk.b + q][1:]
    known = [i for i, v in enumerate(t) if v]
    if len(known) < .8 * len(ref):
        sys.exit(f"only {len(known)}/{len(ref)} words recognised — is the recording the text of voiceover_ru.txt?")
    for i in range(len(t)):
        if t[i] is None:
            p = max([k for k in known if k < i], default=None); n = min([k for k in known if k > i], default=None)
            a = t[p][1] if p is not None else 0; b = t[n][0] if n is not None else a + .4
            t[i] = (a, max(a + .05, b))
    tl = {"fps": 30, "scenes": [], "chunks": []}
    for k, (sc, c) in enumerate(chunks):
        idx = [i for i, o in enumerate(owner) if o == k]
        ct = [t[i] for i in idx]
        disp = c["t"].replace("*", "").split()
        dn = [norm(d) for d in disp]; sw = [ref[i] for i in idx]
        dt = [None] * len(disp)
        for blk in difflib.SequenceMatcher(a=dn, b=sw, autojunk=False).get_matching_blocks():
            for q in range(blk.size): dt[blk.a + q] = ct[blk.b + q]
        for q in range(len(dt)):
            if dt[q] is None:
                a = dt[q - 1][1] if q and dt[q - 1] else ct[0][0]
                nx = next((dt[r] for r in range(q + 1, len(dt)) if dt[r]), None)
                dt[q] = (a, max(a, nx[0] if nx else ct[-1][1]))
        tl["chunks"].append({"scene": sc["id"], "text": c["t"], "start": round(ct[0][0], 3), "end": round(ct[-1][1], 3),
                             "words": [{"w": d, "s": round(a, 3), "e": round(b, 3)} for d, (a, b) in zip(disp, dt)]})
    for i, sc in enumerate(data["scenes"]):
        first = next(c for c in tl["chunks"] if c["scene"] == sc["id"])
        tl["scenes"].append({"id": sc["id"], "name": sc["name"], "start": 0.0 if i == 0 else round(max(0, first["start"] - sc.get("lead", .3)), 3)})
    last = tl["chunks"][-1]["end"] + data["scenes"][-1].get("tail", 4.4)
    total = float(np.ceil(max(last, len(x) / sr) * 30) / 30)
    for i, s in enumerate(tl["scenes"]):
        end = tl["scenes"][i + 1]["start"] if i + 1 < len(tl["scenes"]) else total
        s["end"] = round(end, 3); s["duration"] = round(end - s["start"], 3)
    tl["duration"] = round(total, 3)
    json.dump(tl, open(f"{ROOT}/script/timing.json", "w"), ensure_ascii=False, indent=1)
    print(f"aligned {len(known)}/{len(ref)} words directly, total {total:.2f}s")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/audio/voiceover_ru.wav")
