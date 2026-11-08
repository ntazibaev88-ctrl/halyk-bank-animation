"""Assemble the 120 s voiceover track and the subtitle timing file.

1. Reads raw per-segment TTS (tools/make_vo.py output).
2. Shortens long sentence pauses to MAX_PAUSE so each segment fits its scene.
3. Applies gentle broadcast processing (warmth EQ, compression, short room).
4. Places segments at their start times, writes assets/audio/vo.wav and
   src/data/subtitles.json (chunk-level and word-level times).
"""
import json, os, subprocess, sys
import numpy as np
from scipy import signal
sys.path.insert(0, os.path.dirname(__file__))
from narration import SEGMENTS, spoken

ROOT = os.path.join(os.path.dirname(__file__), "..")
SR = 48000
TOTAL = 120.0
MAX_PAUSE = 0.45

def load(mp3):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", mp3, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, np.float32).copy()

def trim_pauses(x, words):
    """Cut the middle of any gap between words longer than MAX_PAUSE."""
    out, new_words, cursor, shift = [], [], 0, 0.0
    for i, w in enumerate(words):
        if i > 0:
            gap = w["t0"] - words[i - 1]["t1"]
            if gap > MAX_PAUSE:
                cut = gap - MAX_PAUSE
                mid = words[i - 1]["t1"] + MAX_PAUSE / 2
                a, b = int(mid * SR), int((mid + cut) * SR)
                out.append(x[cursor:a]); cursor = b; shift += cut
        new_words.append({"w": w["w"], "t0": w["t0"] - shift, "t1": w["t1"] - shift})
    out.append(x[cursor:])
    y = np.concatenate(out)
    # end of speech + short tail
    end = int((new_words[-1]["t1"] + 0.35) * SR)
    y = y[:end]
    fade = int(0.08 * SR); y[-fade:] *= np.linspace(1, 0, fade)
    return y, new_words

def process(x):
    # high-pass rumble, warmth shelf, slight presence, de-harsh
    b, a = signal.butter(2, 70 / (SR / 2), "high"); x = signal.lfilter(b, a, x)
    def shelf(x, f, g, kind):
        A = 10 ** (g / 40); w0 = 2 * np.pi * f / SR; al = np.sin(w0) / 2 * np.sqrt(2); c = np.cos(w0)
        if kind == "low":
            b = [A*((A+1)-(A-1)*c+2*np.sqrt(A)*al), 2*A*((A-1)-(A+1)*c), A*((A+1)-(A-1)*c-2*np.sqrt(A)*al)]
            a = [(A+1)+(A-1)*c+2*np.sqrt(A)*al, -2*((A-1)+(A+1)*c), (A+1)+(A-1)*c-2*np.sqrt(A)*al]
        else:
            b = [A*((A+1)+(A-1)*c+2*np.sqrt(A)*al), -2*A*((A-1)+(A+1)*c), A*((A+1)+(A-1)*c-2*np.sqrt(A)*al)]
            a = [(A+1)-(A-1)*c+2*np.sqrt(A)*al, 2*((A-1)-(A+1)*c), (A+1)-(A-1)*c-2*np.sqrt(A)*al]
        return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x)
    x = shelf(x, 180, 2.5, "low")      # warmth / depth
    x = shelf(x, 7500, -1.5, "high")   # soften TTS sibilance
    # gentle RMS compressor
    env = np.sqrt(signal.lfilter([1 - 0.995], [1, -0.995], x ** 2) + 1e-9)
    thr = 10 ** (-24 / 20); ratio = 2.5
    gain = np.where(env > thr, (thr * (env / thr) ** (1 / ratio)) / env, 1.0)
    x = x * gain
    # small room (very subtle) so it sits in the mix
    n = int(0.35 * SR); t = np.arange(n) / SR
    rng = np.random.default_rng(7)
    ir = rng.standard_normal(n) * np.exp(-t / 0.07); ir[0] = 0
    wet = signal.fftconvolve(x, ir)[: len(x)]
    wet *= 0.06 * np.std(x) / (np.std(wet) + 1e-9)
    return x + wet

def main():
    raw = {r["id"]: r for r in json.load(open(os.path.join(ROOT, "assets/audio/vo/raw_timings.json")))}
    track = np.zeros(int(TOTAL * SR) + SR, np.float32)
    subs = []
    for seg in SEGMENTS:
        x = load(os.path.join(ROOT, "assets/audio/vo", seg["id"] + ".raw.mp3"))
        y, words = trim_pauses(x, raw[seg["id"]]["words"])
        y = process(y)
        st = seg["start"]
        i0 = int(st * SR); track[i0:i0 + len(y)] += y.astype(np.float32)
        # map words onto subtitle chunks
        wi, chunks = 0, []
        for ch in seg["chunks"]:
            n = len([t for t in spoken(ch).split() if any(c.isalnum() for c in t)])
            ws = words[wi:wi + n]; wi += n
            assert len(ws) == n, (seg["id"], ch, n, len(ws))
            chunks.append({"text": ch[0], "t0": round(st + ws[0]["t0"], 3), "t1": round(st + ws[-1]["t1"], 3),
                           "words": [{"w": w["w"], "t0": round(st + w["t0"], 3), "t1": round(st + w["t1"], 3)} for w in ws]})
        assert wi == len(words), (seg["id"], wi, len(words))
        end = st + words[-1]["t1"]
        print(f'{seg["id"]}: {st:6.2f} -> {end:6.2f}  ({end-st:.2f}s)')
        subs.append({"id": seg["id"], "start": st, "end": round(end, 3), "chunks": chunks})
    # loudness: normalise speech peaks, then let the mixer set final level
    track = track[: int(TOTAL * SR)]
    track *= 0.89 / np.max(np.abs(track))
    os.makedirs(os.path.join(ROOT, "src/data"), exist_ok=True)
    from scipy.io import wavfile
    wavfile.write(os.path.join(ROOT, "assets/audio/vo.wav"), SR, (track * 32767).astype(np.int16))
    json.dump(subs, open(os.path.join(ROOT, "src/data/subtitles.json"), "w"), ensure_ascii=False, indent=1)
    # check overlaps between segments
    for a, b in zip(subs, subs[1:]):
        if b["start"] < a["end"] + 0.2:
            print("WARNING overlap/tight:", a["id"], a["end"], "->", b["id"], b["start"])

main()
