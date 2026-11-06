"""Compare Russian voices on the full script: pitch, pitch variation, bass weight, ASR accuracy."""
import sys, re, difflib, numpy as np, sherpa_onnx
from ru_tts import Voice, text_to_phonemes
from narration import SCENES
M = "/home/user/tts/sherpa-onnx-zipformer-ru-2024-09-18"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.onnx", joiner=f"{M}/joiner.int8.onnx", tokens=f"{M}/tokens.txt", num_threads=4)
norm = lambda s: re.sub(r"[^а-яё ]", "", s.lower().replace("ё", "е").replace("-", " ")).split()
def f0_track(x, sr):
    fr, hop, out = int(0.04 * sr), int(0.01 * sr), []
    for i in range(0, len(x) - fr, hop):
        s = x[i:i + fr]
        if np.sqrt((s ** 2).mean()) < 0.03: continue
        s = s - s.mean(); ac = np.correlate(s, s, "full")[fr - 1:]
        lo, hi = int(sr / 320), int(sr / 65); k = lo + np.argmax(ac[lo:hi])
        if ac[k] > 0.35 * ac[0]: out.append(sr / k)
    return np.array(out)
clauses = [c[0] for s in SCENES for c in s[3]]
for spec in sys.argv[1:]:
    name, ns, nw = spec.split(":"); ns, nw = float(ns), float(nw)
    V = Voice(name); hits = tot = 0; f0s = []; lowr = []; dur = 0
    for txt in clauses:
        x = V.synth(text_to_phonemes(txt), noise_scale=ns, noise_w=nw); dur += len(x) / V.sr
        f = f0_track(x, V.sr); f0s.append(f)
        X = np.abs(np.fft.rfft(x)) ** 2; fr = np.fft.rfftfreq(len(x), 1 / V.sr); lowr.append(X[fr < 200].sum() / X[(fr >= 200) & (fr < 4000)].sum())
        y = np.interp(np.arange(0, len(x), V.sr / 16000), np.arange(len(x)), x).astype(np.float32)
        s = rec.create_stream(); s.accept_waveform(16000, y); rec.decode_stream(s)
        a, b = norm(txt), norm(s.result.text); sm = difflib.SequenceMatcher(None, a, b)
        hits += sum(bl.size for bl in sm.get_matching_blocks()); tot += len(a)
    F = np.concatenate(f0s); st = 12 * np.log2(F / np.median(F))
    print(f"{spec:22s} F0 median {np.median(F):5.0f} Hz | variation {st.std():.2f} st | bass ratio {np.median(lowr):.3f} | ASR words {hits}/{tot} ({100*hits/tot:.1f}%) | speech {dur:.1f}s")
