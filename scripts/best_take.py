"""Re-synthesize chosen clauses several times and keep the take the Russian ASR hears best.
Usage: python3 best_take.py "<clause text>" ...  (length_scale taken from gen_voice.PACE)"""
import sys, re, hashlib, difflib, numpy as np, soundfile as sf, sherpa_onnx, os
from ru_tts import Voice, text_to_phonemes
from narration import SCENES
sys.argv, args = sys.argv[:1], sys.argv[1:]
import importlib.util
src = open(os.path.dirname(os.path.abspath(__file__)) + "/gen_voice.py").read()
PACE = eval(re.search(r"PACE = (\{.*?\})\n", src, re.S).group(1))
CACHE = os.path.dirname(os.path.abspath(__file__)) + "/voice_cache"
M = "/home/user/tts/sherpa-onnx-zipformer-ru-2024-09-18"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.onnx",
      joiner=f"{M}/joiner.int8.onnx", tokens=f"{M}/tokens.txt", num_threads=4)
V = Voice("ruslan")
norm = lambda s: re.sub(r"[^а-яё ]", "", s.lower().replace("ё", "е")).split()
def trim(x, thr=0.012, keep=0.03):
    idx = np.where(np.abs(x) > thr)[0]; k = int(keep * V.sr)
    return x[max(0, idx[0] - k):idx[-1] + k]
for text in args:
    sid = next(s[0] for s in SCENES if any(c[0] == text for c in s[3]))
    ls = PACE[sid][0]
    best = None
    for i in range(10):
        x = trim(V.synth(text_to_phonemes(text), length_scale=ls))
        y = np.interp(np.arange(0, len(x), V.sr / 16000), np.arange(len(x)), x).astype(np.float32)
        s = rec.create_stream(); s.accept_waveform(16000, y); rec.decode_stream(s)
        score = difflib.SequenceMatcher(None, norm(text), norm(s.result.text)).ratio()
        if not best or score > best[0]: best = (score, x, s.result.text)
        if score == 1.0: break
    key = hashlib.sha1(f"{text}|{ls}".encode()).hexdigest()[:16]
    sf.write(f"{CACHE}/{key}.wav", best[1], V.sr)
    print(f"{best[0]:.2f} after {i+1} takes | {text} -> {best[2]}")
