"""Synthesize the Russian narration with Piper (ru_RU-ruslan-medium) and master each line.

Usage: python3 tools/make_vo.py /path/to/ru_RU-ruslan-medium.onnx
Each line is a list of (text, pause_after_seconds) parts so "..." pauses are real silences.
U+0301 marks stress where espeak guesses wrong; subtitles use their own text (captions.json).
"""
import json, subprocess, sys, wave, os
import numpy as np
from piper import PiperVoice, SynthesisConfig

MODEL = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "audio", "vo")
os.makedirs(OUT, exist_ok=True)

LINES = {
    "l01": ([("В ту ночь город умер.", 0)], 1.15),
    "l02": ([("По всем каналам — экстренный выпуск.", 0)], 1.08),
    "l03": ([("Неизвестный вирус.", 0)], 1.12),
    "l04": ([("Заражённые нападают на людей.", 0)], 1.10),
    "l05": ([("Я проснулся от тишины.", 0)], 1.14),
    "l06": ([("Подошёл к окну", 0)], 1.16),
    "l07": ([("и понял: го́рода больше нет.", 0)], 1.14),
    "l08": ([("Только дым... сирены...", 0.25), ("И они.", 0)], 1.16),
    "l09": ([("А потом в дверь постучали.", 0)], 1.10),
    "l10": ([("Сначала тихо.", 0)], 1.14),
    "l11": ([("Потом — так, будто её хотели выбить.", 0)], 1.06),
    "l12": ([("Я закрыл дверь на засов.", 0)], 1.10),
    "l13": ([("Я схватил нож.", 0)], 1.12),
    "l14": ([("Выключил свет.", 0)], 1.12),
    "l15": ([("Спрятался в темноте.", 0.35), ("И ждал.", 0)], 1.16),
    "l16": ([("Стук прекратился.", 0)], 1.14),
    "l17": ([("И стало только страшнее.", 0)], 1.16),
    "l18": ([("Телефон завибрировал.", 0)], 1.10),
    "l19": ([("Неизвестный номер.", 0)], 1.12),
    "l20": ([("Не открывай дверь.", 0)], 1.28),
    "l21": ([("Я уже внутри.", 0)], 1.32),
    "l22": ([("Я медленно обернулся.", 0)], 1.22),
}
WHISPER = {"l20", "l21"}

voice = PiperVoice.load(MODEL)
sr = voice.config.sample_rate
meta = {}
for key, (parts, ls) in LINES.items():
    cfg = SynthesisConfig(length_scale=ls, noise_scale=0.62, noise_w_scale=0.75)
    chunks, part_times, t = [], [], 0.0
    for text, pause in parts:
        audio = np.concatenate([c.audio_int16_array for c in voice.synthesize(text, syn_config=cfg)])
        # trim leading/trailing near-silence so pauses are controlled here
        nz = np.where(np.abs(audio) > 300)[0]
        audio = audio[max(0, nz[0] - 200): nz[-1] + 400]
        part_times.append([round(t, 3), round(t + len(audio) / sr, 3)])
        pause = pause or 0.12
        t += len(audio) / sr + pause
        chunks += [audio, np.zeros(int(pause * sr), np.int16)]
    raw = os.path.join("/tmp", f"{key}_raw.wav")
    with wave.open(raw, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(np.concatenate(chunks).tobytes())
    if key in WHISPER:
        # darker, closer, doubled an octave-ish lower underneath: the message "speaks"
        fx = ("[0:a]asplit[a][b];[b]asetrate=%d,aresample=%d,volume=0.55[low];"
              "[a][low]amix=inputs=2:weights=1 0.35,highpass=f=90,lowpass=f=7000,"
              "aecho=0.8:0.6:60|140:0.25|0.15,acompressor=threshold=-22dB:ratio=4,"
              "apad=pad_dur=0.6" % (int(sr * 0.9), sr))
    else:
        fx = ("[0:a]highpass=f=75,equalizer=f=180:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.5:g=1.5,"
              "deesser,acompressor=threshold=-20dB:ratio=3:attack=8:release=120,"
              "aecho=0.85:0.5:38|71:0.12|0.07,apad=pad_dur=0.35")
    out = os.path.join(OUT, f"{key}.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-filter_complex",
                    fx + ",aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", "48000", "-ac", "2", out], check=True)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                         "-of", "csv=p=0", out]).decode())
    meta[key] = {"duration": round(dur, 3), "speech": round(t, 3), "parts": part_times,
                 "text": [p[0].replace("́", "") for p in parts]}
    print(key, meta[key]["speech"], meta[key]["text"])
json.dump(meta, open(os.path.join(OUT, "vo_meta.json"), "w"), ensure_ascii=False, indent=1)
