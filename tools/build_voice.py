#!/usr/bin/env python3
"""Russian documentary narration: neural TTS + ASR-verified takes + word-accurate timing.

Input : script/narration.json
Output: audio/voiceover_ru.wav  (48 kHz mono, broadcast-processed narration)
        script/timing.json      (scene slots, narration chunks, per-word timestamps)
        script/voice_qc.json    (per-sentence take selection + recognition check)

Voice      : Piper VITS neural voice "ru_RU-ruslan-medium" (native Russian male).
Verification: every take is transcribed back by GigaAM-v2 (Russian ASR, sherpa-onnx);
             the take with the lowest word error rate wins, its word timestamps drive
             the subtitles. Stress errors of the phonemizer are fixed at phoneme level.

Models are expected in $TTS_DIR (default /opt/tts), see README "Озвучка".
To use a recorded human voice instead, see README: the same ASR alignment re-times
subtitles to any audio file (tools/align_voice.py).
"""
import json, os, re, subprocess, wave, difflib
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TTS_DIR = os.environ.get("TTS_DIR", "/opt/tts")
VOICE = os.environ.get("TTS_VOICE", "ru_RU-ruslan-medium")
TAKES = int(os.environ.get("TTS_TAKES", 6))
# base delivery speed in syllables/second (~6.0 s/s of Russian ~= 140 words/min while speaking)
BASE_SPS = float(os.environ.get("TTS_SPS", 6.5))
NOISE_RNG = np.random.default_rng(45)
SR = 48000
TMP = os.path.join(os.environ.get("TMPDIR", "/tmp"), "vo_takes")
os.makedirs(TMP, exist_ok=True)

from piper import PiperVoice, SynthesisConfig
import sherpa_onnx

PV = PiperVoice.load(f"{TTS_DIR}/vits-piper-{VOICE}/{VOICE}.onnx")
VSR = PV.config.sample_rate
G = f"{TTS_DIR}/sherpa-onnx-nemo-ctc-giga-am-v2-russian-2025-04-19"
ASR = sherpa_onnx.OfflineRecognizer.from_nemo_ctc(model=f"{G}/model.int8.onnx", tokens=f"{G}/tokens.txt", num_threads=4)


def norm(w):
    return re.sub(r"[^а-яё0-9]", "", w.lower()).replace("ё", "е")


def words_of(text):
    return [w for w in (norm(x) for x in text.replace("*", "").split()) if w]


def synth(text, ls, fixes):
    ph = "".join(sum(PV.phonemize(text), []))
    for a, b in fixes.items():
        ph = ph.replace(a, b)
    a = PV.phoneme_ids_to_audio(PV.phonemes_to_ids(list(ph)), SynthesisConfig(length_scale=ls, noise_scale=0.7, noise_w_scale=0.85))
    x = np.asarray(a, dtype=np.float32)
    idx = np.where(np.abs(x) > 0.02)[0]
    x = x[max(0, idx[0] - int(.03 * VSR)): idx[-1] + int(.12 * VSR)]
    return x, ph


VOW = set("аеёиоуыэюяАЕЁИОУЫЭЮЯ")
def syll(text):
    return sum(ch in VOW for ch in text)


def recognise(x):
    s = ASR.create_stream(); s.accept_waveform(VSR, x); ASR.decode_stream(s)
    r = s.result
    ws, cur, t0, t1 = [], "", None, None
    for tok, ts in zip(r.tokens, r.timestamps):
        if tok.strip() in ("", "▁") or tok == " ":
            if cur: ws.append((cur, t0, t1)); cur = ""
            continue
        tok = tok.replace("▁", "")
        if not cur: t0 = ts
        cur += tok; t1 = ts + 0.06
    if cur: ws.append((cur, t0, t1))
    return [(norm(w), a, b) for w, a, b in ws if norm(w)]


def wer(ref, hyp):
    d = list(range(len(hyp) + 1))
    for i, x in enumerate(ref, 1):
        p = d[:]; d[0] = i
        for j, y in enumerate(hyp, 1):
            d[j] = min(p[j] + 1, d[j - 1] + 1, p[j - 1] + (x != y))
    return d[-1] / max(1, len(ref))


def align(ref, hyp):
    """time for each ref word from the recognised words (interpolate gaps)"""
    sm = difflib.SequenceMatcher(a=ref, b=[h[0] for h in hyp], autojunk=False)
    t = [None] * len(ref)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            t[blk.a + k] = (hyp[blk.b + k][1], hyp[blk.b + k][2])
    known = [i for i, v in enumerate(t) if v]
    for i in range(len(t)):
        if t[i] is None:
            prev = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
            a = t[prev][1] if prev is not None else 0.0
            b = t[nxt][0] if nxt is not None else (t[prev][1] + .4 if prev is not None else .4)
            t[i] = (a, max(a + .05, b))
    return t


def main():
    data = json.load(open(f"{ROOT}/script/narration.json"))
    fixes = data.get("stress_fixes", {})
    # group chunks into sentences (a chunk with join=true continues the previous sentence)
    timeline = {"fps": 30, "scenes": [], "chunks": []}
    qc, pieces, t = [], [], 0.0
    for sc in data["scenes"]:
        s_start = t
        t += sc.get("lead", .4)
        sents = []
        for c in sc["chunks"]:
            if c.get("join") and sents: sents[-1].append(c)
            else: sents.append([c])
        for si, group in enumerate(sents):
            spoken = " ".join((c.get("tts") or c["t"]).replace("*", "") for c in group)
            ref = words_of(spoken)
            # pace: per-scene mood factor x base syllable rate; calibrate length_scale on a probe take
            mood = group[0].get("pace", sc.get("pace", 1.0))
            target = BASE_SPS * mood
            ls = 0.9
            for _ in range(3):
                r = np.mean([syll(spoken) / (len(synth(spoken, ls, fixes)[0]) / VSR) for _ in range(2)])
                ls = float(np.clip(ls * r / target, .65, 1.45))
            best = None
            for k in range(TAKES * 3):           # keep recording takes until one is word-perfect (max 3x)
                if k >= TAKES and best[0] == 0: break
                x, ph = synth(spoken, ls, fixes)
                hyp = recognise(x)
                e = wer(ref, [h[0] for h in hyp])
                dev = abs(syll(spoken) / (len(x) / VSR) - target) / target
                # intelligibility margin: the take must also survive pink-ish noise at -20 dB (as under music)
                nz = np.cumsum(NOISE_RNG.standard_normal(len(x)).astype(np.float32)); nz -= np.convolve(nz, np.ones(400) / 400, "same")
                nz *= np.sqrt((x ** 2).mean()) / (np.sqrt((nz ** 2).mean()) + 1e-9) * 0.1
                e2 = wer(ref, [h[0] for h in recognise(x + nz)])
                cand = (e + e2, dev, k, x, hyp, e2)
                if best is None or (cand[0], dev) < (best[0], best[1]): best = cand
            _, dev, k, x, hyp, e2 = best
            e = wer(ref, [h[0] for h in hyp])
            # level-match every sentence (RMS of voiced frames) so the narration sits at one consistent level
            fr = x[: len(x) // 512 * 512].reshape(-1, 512); rms = np.sqrt((fr ** 2).mean(1))
            x = x * (0.09 / (np.sqrt((fr[rms > rms.max() * .15] ** 2).mean()) + 1e-9))
            dur = len(x) / VSR
            qc.append({"scene": sc["id"], "text": spoken, "take": k + 1, "rate_dev": round(dev, 3), "wer_in_noise": round(e2, 3), "wer": round(e, 3), "length_scale": round(ls, 3),
                       "syll_per_s": round(syll(spoken) / dur, 2),
                       "heard": " ".join(h[0] for h in hyp), "dur": round(dur, 2),
                       "wpm": round(len(ref) / dur * 60)})
            times = align(ref, hyp)
            # map each chunk's display tokens onto the spoken word times
            wi = 0
            for c in group:
                sw = words_of(c.get("tts") or c["t"])
                ct = times[wi: wi + len(sw)]; wi += len(sw)
                disp = c["t"].replace("*", "").split()
                dnorm = [norm(d) for d in disp]
                sm = difflib.SequenceMatcher(a=dnorm, b=sw, autojunk=False)
                dt = [None] * len(disp)
                for blk in sm.get_matching_blocks():
                    for q in range(blk.size): dt[blk.a + q] = ct[blk.b + q]
                for q in range(len(dt)):          # tokens like "2045" or "—": span the unmatched audio
                    if dt[q] is None:
                        a = dt[q - 1][1] if q and dt[q - 1] else ct[0][0]
                        nx = next((dt[r] for r in range(q + 1, len(dt)) if dt[r]), None)
                        b = nx[0] if nx else ct[-1][1]
                        dt[q] = (a, max(a, b))
                words = [{"w": d, "s": round(t + a, 3), "e": round(t + b, 3)} for d, (a, b) in zip(disp, dt)]
                timeline["chunks"].append({"scene": sc["id"], "text": c["t"],
                                           "start": round(t + ct[0][0], 3), "end": round(t + ct[-1][1], 3), "words": words})
            pieces.append((t, x))
            t += dur + group[-1].get("gap", .45)
        t = t - sents[-1][-1].get("gap", .45) + sc.get("tail", .5)
        timeline["scenes"].append({"id": sc["id"], "name": sc["name"], "start": round(s_start, 3)})
    total = float(np.ceil(t * 30) / 30)
    for i, s in enumerate(timeline["scenes"]):
        end = timeline["scenes"][i + 1]["start"] if i + 1 < len(timeline["scenes"]) else total
        s["end"] = round(end, 3); s["duration"] = round(end - s["start"], 3)
    timeline["duration"] = round(total, 3)

    buf = np.zeros(int((total + .5) * VSR), dtype=np.float32)
    for st, x in pieces:
        i = int(st * VSR); buf[i:i + len(x)] += x[: len(buf) - i]
    raw = f"{TMP}/voice_raw.wav"
    with wave.open(raw, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(VSR)
        w.writeframes((np.clip(buf * min(1.0, .8 / (np.abs(buf).max() + 1e-9)), -1, 1) * 32767).astype(np.int16).tobytes())
    # broadcast voice chain: clean low end, warmth, de-mud, presence, de-ess, compression, limiting, loudness
    chain = ("aresample=48000:resampler=soxr,highpass=f=70:poles=2,lowpass=f=11500,"
             "equalizer=f=120:t=q:w=0.9:g=3,equalizer=f=320:t=q:w=1.2:g=-2,"
             "equalizer=f=3300:t=q:w=1.0:g=2.5,equalizer=f=6500:t=q:w=1.4:g=1,"
             "deesser=i=0.35:m=0.5:f=0.5,"
             "acompressor=threshold=-22dB:ratio=3:attack=6:release=120:knee=4:makeup=2,"
             "loudnorm=I=-16:TP=-2:LRA=6,alimiter=limit=0.84:attack=3:release=60:level=disabled")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", chain, "-ar", str(SR), "-ac", "1",
                    f"{ROOT}/audio/voiceover_ru.wav"], check=True)
    json.dump(timeline, open(f"{ROOT}/script/timing.json", "w"), ensure_ascii=False, indent=1)
    json.dump(qc, open(f"{ROOT}/script/voice_qc.json", "w"), ensure_ascii=False, indent=1)
    nw = sum(len(words_of(q["text"])) for q in qc); sp = sum(q["dur"] for q in qc)
    print(f"total {total:.2f}s | words {nw} | speech {sp:.1f}s -> {nw / sp * 60:.0f} wpm while speaking, "
          f"{nw / (total - 2.0 - 4.6) * 60:.0f} wpm incl. pauses | worst WER {max(q['wer'] for q in qc):.3f}")
    for s in timeline["scenes"]:
        print(f"  {s['id']}: {s['start']:6.2f} -> {s['end']:6.2f} ({s['duration']:.2f}s)")
    for q in qc:
        if q["wer"] > 0: print("  !", q["wer"], "|", q["text"], "| heard:", q["heard"])


if __name__ == "__main__":
    main()
