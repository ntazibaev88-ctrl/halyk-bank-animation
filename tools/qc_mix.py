#!/usr/bin/env python3
"""QC: transcribe the narration straight out of a mixed file (video or audio) and compare with the script, sentence by sentence.
usage: python3 tools/qc_mix.py final_video.mp4"""
import sys, json, wave, subprocess, os, numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(ROOT, "tools"))
src = sys.argv[1]; sys.argv = sys.argv[:1]
import align_voice as A
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-ar", "16000", "-ac", "1", "/tmp/qc16.wav"], check=True)
w = wave.open("/tmp/qc16.wav"); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; sr = 16000
T = json.load(open(f"{ROOT}/script/timing.json")); N = json.load(open(f"{ROOT}/script/narration.json"))
chunks = [c for sc in N["scenes"] for c in sc["chunks"]]; groups = []
for c, t in zip(chunks, T["chunks"]):
    if c.get("join") and groups: groups[-1][0].append(c); groups[-1][1].append(t)
    else: groups.append(([c], [t]))
ok = 0
for cs, ts in groups:
    a, b = int((ts[0]["start"] - .25) * sr), int((ts[-1]["end"] + .25) * sr)
    s = A.ASR.create_stream(); s.accept_waveform(sr, x[a:b]); A.ASR.decode_stream(s)
    hyp = [A.norm(t) for t in s.result.text.split() if A.norm(t)]; ref = sum([A.words_of(c.get("tts") or c["t"]) for c in cs], [])
    ok += hyp == ref
    if hyp != ref: print("MISMATCH:", " ".join(ref), "| heard:", " ".join(hyp))
print(f"{src}: {ok}/{len(groups)} sentences word-perfect")
