"""
NOIRX — USA VS CHINA
Generates the Russian male voiceover (offline Piper voice "ruslan") and the
master timeline (scene timing + word-level subtitle timing) used by Remotion.

Outputs:
  public/audio/voiceover.wav   full-length narration track (48 kHz, mono)
  src/data/timeline.json       scenes, subtitle phrases, word timings

Script markup:
  |      subtitle phrase break
  *word  highlighted (yellow) word in the subtitles
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import wave
import difflib

import numpy as np
import librosa
import sherpa_onnx
from piper import PiperVoice, SynthesisConfig

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(ROOT, "models")
VOICE_DIR = os.path.join(MODELS, "vits-piper-ru_RU-ruslan-medium")
ASR_DIR = os.path.join(MODELS, "sherpa-onnx-small-zipformer-ru-2024-09-18")
FPS = 30
SR = 48000

# Pronunciation fixes: display text -> spoken text
SPOKEN = {"XXI": "двадцать первого"}

SEGMENTS = [
    {"id": "hook", "min": 7.0, "lead": 0.55,
     "text": "Представь: | две страны борются | не просто за *деньги | или *территории. | Они борются за *влияние | на *будущее всего мира."},
    {"id": "usa", "min": 7.0, "lead": 0.3,
     "text": "*Америка десятилетиями | удерживает мировое *лидерство | благодаря *доллару, | мощной *армии | и *технологическим *компаниям."},
    {"id": "china", "min": 7.0, "lead": 0.3,
     "text": "Но *Китай стремительно | сокращает *разрыв. | Его *заводы, *электромобили | и *технологии | меняют мировую *экономику."},
    {"id": "chips", "min": 7.0, "lead": 0.3,
     "text": "Сегодня одно из главных | *полей *битвы — *микрочипы. | Именно они становятся *ключом | к технологиям *будущего."},
    {"id": "ai", "min": 7.0, "lead": 0.3,
     "text": "*Искусственный *интеллект | превращается в новую *арену | *соперничества двух держав."},
    {"id": "trade", "min": 7.0, "lead": 0.3,
     "text": "*Миллионы *товаров | пересекают *океаны. | А мировая *торговля | всё ещё тесно *связывает | эти экономики."},
    {"id": "resources", "min": 7.0, "lead": 0.3,
     "text": "Особую роль играют | *редкоземельные *металлы — | важное *сырьё | для современной *электроники | и *промышленности."},
    {"id": "interdependence", "min": 7.0, "lead": 0.3,
     "text": "И вот *парадокс: | *соперники одновременно | остаются важными участниками | *одной мировой | экономической системы."},
    {"id": "question", "min": 7.0, "lead": 0.3,
     "text": "*Америка сохраняет | огромные *преимущества. | *Китай становится всё более | серьёзным *технологическим | и *экономическим конкурентом."},
    {"id": "final", "min": 9.0, "lead": 0.45, "tail": 3.4,
     "text": "Так кто определит | *будущее *XXI *века? | *Америка или *Китай? | А *ты как думаешь?"},
]

PAUSE_AFTER = {":": 0.42, ".": 0.38, "?": 0.45, "!": 0.4, "—": 0.12}


def norm(w):
    w = w.lower().replace("ё", "е")
    return re.sub(r"[^a-zа-я0-9]", "", w)


def split_utterances(plain):
    """Split on sentence enders and colons so pauses are controlled precisely."""
    parts = re.findall(r"[^.:?!]+[.:?!]?", plain)
    return [p.strip() for p in parts if p.strip()]


def load_asr():
    return sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=os.path.join(ASR_DIR, "encoder.int8.onnx"),
        decoder=os.path.join(ASR_DIR, "decoder.onnx"),
        joiner=os.path.join(ASR_DIR, "joiner.int8.onnx"),
        tokens=os.path.join(ASR_DIR, "tokens.txt"),
        num_threads=4,
    )


def asr_words(rec, audio, sr):
    y = librosa.resample(audio, orig_sr=sr, target_sr=16000)
    s = rec.create_stream()
    s.accept_waveform(16000, y)
    rec.decode_stream(s)
    toks, ts = s.result.tokens, s.result.timestamps
    words = []
    for tok, t in zip(toks, ts):
        if tok.startswith((" ", "▁")) or not words:
            words.append({"w": tok.replace("▁", "").strip(), "start": float(t)})
        else:
            words[-1]["w"] += tok
    return s.result.text, words


def speech_end(audio, sr):
    env = np.abs(audio)
    idx = np.where(env > 0.02 * env.max())[0]
    return (idx[-1] / sr) if len(idx) else len(audio) / sr


def main():
    voice = PiperVoice.load(
        os.path.join(VOICE_DIR, "ru_RU-ruslan-medium.onnx"),
        config_path=os.path.join(VOICE_DIR, "ru_RU-ruslan-medium.onnx.json"),
    )
    vsr = voice.config.sample_rate
    syn = SynthesisConfig(length_scale=1.05, noise_scale=0.55, noise_w_scale=0.75)
    rec = load_asr()

    segments_out = []
    seg_audio = []
    report = []
    for seg in SEGMENTS:
        # Parse markup into display words with phrase ids and highlight flags
        words = []
        for pi, phrase in enumerate(seg["text"].split("|")):
            for raw in phrase.split():
                hl = raw.startswith("*")
                words.append({"text": raw.lstrip("*"), "hl": hl, "phrase": pi})
        display_plain = " ".join(w["text"] for w in words)
        spoken_plain = display_plain
        for k, v in SPOKEN.items():
            spoken_plain = spoken_plain.replace(k, v)

        # Synthesize utterance by utterance with controlled pauses
        pieces = []
        t = 0.0
        asr_all = []
        asr_text = []
        for utt in split_utterances(spoken_plain):
            chunks = list(voice.synthesize(utt, syn_config=syn))
            a = np.concatenate([c.audio_float_array for c in chunks]).astype(np.float32)
            # trim leading/trailing silence
            nz = np.where(np.abs(a) > 0.01)[0]
            a = a[max(0, nz[0] - int(0.02 * vsr)): min(len(a), nz[-1] + int(0.06 * vsr))]
            txt, ws = asr_words(rec, a, vsr)
            asr_text.append(txt)
            for w in ws:
                w["start"] += t
            asr_all.extend(ws)
            pieces.append(a)
            t += len(a) / vsr
            pause = PAUSE_AFTER.get(utt.strip()[-1], 0.25)
            pieces.append(np.zeros(int(pause * vsr), dtype=np.float32))
            t += pause
        # drop final pause
        pieces = pieces[:-1]
        audio = np.concatenate(pieces)
        dur = len(audio) / vsr

        # Align ASR words to spoken words, then map spoken words back to display words
        spoken_words = []  # (display_index)
        for di, w in enumerate(words):
            sp = SPOKEN.get(w["text"].strip("?.,!:—"), None)
            n = len(sp.split()) if sp else 1
            for j in range(n):
                spoken_words.append((di, sp.split()[j] if sp else w["text"]))
        a_norm = [norm(w["w"]) for w in asr_all]
        s_norm = [norm(w) for _, w in spoken_words]
        sm = difflib.SequenceMatcher(a=s_norm, b=a_norm, autojunk=False)
        starts = [None] * len(spoken_words)
        for blk in sm.get_matching_blocks():
            for k in range(blk.size):
                starts[blk.a + k] = asr_all[blk.b + k]["start"]
        # fuzzy fill for unmatched words using opcodes (replace blocks of equal length)
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag == "replace":
                for k in range(i2 - i1):
                    jj = j1 + min(k * (j2 - j1) // max(1, i2 - i1), j2 - j1 - 1)
                    starts[i1 + k] = asr_all[jj]["start"]
        # interpolate any remaining gaps
        known = [i for i, s in enumerate(starts) if s is not None]
        for i in range(len(starts)):
            if starts[i] is None:
                prev = max([k for k in known if k < i], default=None)
                nxt = min([k for k in known if k > i], default=None)
                p = starts[prev] if prev is not None else 0.0
                n = starts[nxt] if nxt is not None else dur
                pi_ = prev if prev is not None else -1
                ni_ = nxt if nxt is not None else len(starts)
                starts[i] = p + (n - p) * (i - pi_) / (ni_ - pi_)
        # monotonic
        for i in range(1, len(starts)):
            starts[i] = max(starts[i], starts[i - 1] + 0.05)

        for w in words:
            w["start"] = None
        for (di, _), s in zip(spoken_words, starts):
            if words[di]["start"] is None:
                words[di]["start"] = s
        for i, w in enumerate(words):
            w["end"] = words[i + 1]["start"] if i + 1 < len(words) else dur

        lead = seg["lead"]
        tail = seg.get("tail", 0.6)
        length = max(seg["min"], lead + dur + tail)
        frames = int(round(length * FPS))
        segments_out.append({
            "id": seg["id"], "frames": frames, "lead": lead, "voDuration": dur,
            "words": words, "text": display_plain,
        })
        seg_audio.append((audio, lead, frames))
        report.append((seg["id"], round(dur, 2), round(length, 2), " ".join(asr_text)))

    # Assemble full timeline
    total_frames = sum(s["frames"] for s in segments_out)
    full = np.zeros(int(total_frames / FPS * vsr) + vsr, dtype=np.float32)
    start_f = 0
    for s, (audio, lead, frames) in zip(segments_out, seg_audio):
        s["start"] = start_f
        vo0 = start_f / FPS + lead
        s["voStart"] = round(vo0, 3)
        i0 = int(vo0 * vsr)
        full[i0:i0 + len(audio)] += audio
        # absolute word timings in seconds + phrases
        phrases = {}
        for w in s["words"]:
            w["start"] = round(vo0 + w["start"], 3)
            w["end"] = round(vo0 + w["end"], 3)
            phrases.setdefault(w["phrase"], []).append(w)
        s["phrases"] = [
            {"start": ws[0]["start"], "end": ws[-1]["end"],
             "words": [{"t": w["text"], "hl": w["hl"], "s": w["start"], "e": w["end"]} for w in ws]}
            for _, ws in sorted(phrases.items())
        ]
        del s["words"]
        start_f += s["frames"]
    full = full[: int(total_frames / FPS * vsr)]

    with tempfile.TemporaryDirectory() as td:
        raw = os.path.join(td, "raw.wav")
        with wave.open(raw, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(vsr)
            w.writeframes((np.clip(full, -1, 1) * 32767).astype(np.int16).tobytes())
        out = os.path.join(ROOT, "public", "audio", "voiceover.wav")
        # Documentary voice chain: clean low end, warmth, presence, gentle compression, loudness
        chain = ("highpass=f=70,equalizer=f=130:t=q:w=1.0:g=3,equalizer=f=320:t=q:w=1.2:g=-1.5,"
                 "equalizer=f=3200:t=q:w=1.4:g=2,deesser=i=0.3,"
                 "acompressor=threshold=-22dB:ratio=3:attack=8:release=160:makeup=2,"
                 "aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=7")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", chain,
                        "-ar", str(SR), "-ac", "1", out], check=True)

    timeline = {"fps": FPS, "width": 1080, "height": 1920, "totalFrames": total_frames,
                "scenes": segments_out}
    with open(os.path.join(ROOT, "src", "data", "timeline.json"), "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=1)

    for r in report:
        print(f"{r[0]:16s} vo={r[1]:5.2f}s scene={r[2]:5.2f}s | ASR: {r[3]}")
    print("TOTAL", total_frames, "frames =", round(total_frames / FPS, 2), "s")


if __name__ == "__main__":
    main()
