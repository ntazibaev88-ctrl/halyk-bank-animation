"""Generate the Russian narration with Piper (ru_RU-ruslan-medium) and word timings.

Usage: python3 tts_generate.py <model.onnx> <script_ru.json> <out_dir>
Writes scene_<id>.wav (raw TTS) and timings.json (per-word start/end, seconds).
"""
import json, re, sys, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig

# Pronunciation fixes: subtitle spelling -> stressed respelling for espeak (U+0301 = stress).
FIX = {
    "Kaspi": "Ка́спи",
    "Halyk": "Халы́к",
    "тенге": "тэнгэ́",
    "стороны": "сто́роны",
    "счетах": "счета́х",
}
LENGTH = {1: 1.0}          # per-scene length_scale (1.0 = natural pace)
DEFAULT_LENGTH = 1.07

model, script, out = sys.argv[1:4]
voice = PiperVoice.load(model, include_alignments=True)
sr = voice.config.sample_rate
data = json.load(open(script))
timings = {"sample_rate": sr, "scenes": []}

def tts_text(text):
    def rep(m):
        w = m.group(0)
        return FIX.get(w, w)
    return re.sub(r"[A-Za-zА-Яа-яЁё]+", rep, text)

for sc in data["scenes"]:
    text = " ".join(sc["lines"])
    cfg = SynthesisConfig(length_scale=LENGTH.get(sc["id"], DEFAULT_LENGTH), noise_scale=0.6, noise_w_scale=0.75)
    audio, words_t = [], []
    words = re.findall(r"\S+", text)
    # words that carry phonemes (a lone dash does not)
    spoken = [w for w in words if re.search(r"[A-Za-zА-Яа-яЁё0-9]", w)]
    pos = 0
    cur = None
    for chunk in voice.synthesize(tts_text(text), syn_config=cfg, include_alignments=True):
        a = chunk.audio_int16_array
        t = pos
        for al in chunk.phoneme_alignments or []:
            dur = al.num_samples
            ph = al.phoneme
            is_letter = re.search(r"\w", ph) is not None or ph in "ˈˌ"
            if ph == " " or not is_letter:
                if cur is not None:
                    words_t.append(cur); cur = None
            else:
                if cur is None:
                    cur = [t, t + dur]
                else:
                    cur[1] = t + dur
            t += dur
        if cur is not None:
            words_t.append(cur); cur = None
        audio.append(a)
        # short natural breath between sentences
        gap = np.zeros(int(sr * 0.28), dtype=np.int16)
        audio.append(gap)
        pos += len(a) + len(gap)
    audio = np.concatenate(audio[:-1])
    with wave.open(f"{out}/scene_{sc['id']}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(audio.tobytes())
    if len(words_t) != len(spoken):
        print("WARN word count mismatch scene", sc["id"], len(words_t), len(spoken))
    timings["scenes"].append({
        "id": sc["id"], "duration": len(audio) / sr,
        "words": [{"w": w, "s": round(a / sr, 3), "e": round(b / sr, 3)} for w, (a, b) in zip(spoken, words_t)],
    })
    print(sc["id"], "dur %.2f" % (len(audio) / sr), "window", sc["end"] - sc["start"], len(words_t), len(spoken))

json.dump(timings, open(f"{out}/timings.json", "w"), ensure_ascii=False, indent=1)
