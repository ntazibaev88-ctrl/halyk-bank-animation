"""QC: back-transcribe each narration clause with a Russian ASR model, report
mismatches, and refine word start/end times in timing.json from ASR token timestamps."""
import json, re, difflib, subprocess, numpy as np, sherpa_onnx, os
ROOT = os.path.dirname(os.path.abspath(__file__)) + "/.."
M = "/home/user/tts/sherpa-onnx-zipformer-ru-2024-09-18"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.onnx", joiner=f"{M}/joiner.int8.onnx",
    tokens=f"{M}/tokens.txt", num_threads=4, decoding_method="greedy_search")
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", ROOT + "/video/assets/audio/voice.wav",
                      "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.float32); SR = 16000
T = json.load(open(ROOT + "/video/assets/timing.json"))
norm = lambda w: re.sub(r"[^а-яё]", "", w.lower().replace("ё", "е"))
words_out, bad = [], 0
for c in T["clauses"]:
    a, b = c["start"] - 0.05, c["end"] + 0.1
    s = rec.create_stream(); s.accept_waveform(SR, audio[int(a * SR):int(b * SR)])
    rec.decode_stream(s); r = s.result
    # tokens -> words with start times
    hyp, cur = [], None
    for tok, ts in zip(r.tokens, r.timestamps):
        if tok.startswith((" ", "▁")) or cur is None:
            cur = {"t": tok.lstrip(" ▁"), "s": a + ts}; hyp.append(cur)
        else: cur["t"] += tok
    script = [w for w in c["text"].split() if norm(w)]
    sm = difflib.SequenceMatcher(None, [norm(w) for w in script], [norm(h["t"]) for h in hyp])
    ratio = sm.ratio(); flag = "" if ratio > 0.8 else "  <-- CHECK"
    if flag: bad += 1
    print(f"{ratio:.2f} | {c['text']}\n     | {' '.join(h['t'] for h in hyp)}{flag}")
    starts = [None] * len(script)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): starts[blk.a + k] = hyp[blk.b + k]["s"]
    # fill gaps by interpolation between known anchors and clause bounds
    known = [(-1, c["start"])] + [(i, x) for i, x in enumerate(starts) if x is not None] + [(len(script), c["end"])]
    for (i0, t0), (i1, t1) in zip(known, known[1:]):
        for k in range(i0 + 1, i1): starts[k] = t0 + (t1 - t0) * (k - i0) / (i1 - i0) if i0 >= 0 else c["start"] + (t1 - c["start"]) * (k + 1) / (i1 + 1) * 0.9
    starts[0] = min(starts[0], c["start"] + 0.08) if starts[0] else c["start"]
    for i, w in enumerate(script):
        end = starts[i + 1] if i + 1 < len(script) else c["end"]
        words_out.append({"scene": c["scene"], "text": w, "start": round(max(starts[i], c["start"]), 3), "end": round(end, 3)})
T["words"] = words_out
json.dump(T, open(ROOT + "/video/assets/timing.json", "w"), ensure_ascii=False, indent=1)
print("clauses needing a listen:", bad)
