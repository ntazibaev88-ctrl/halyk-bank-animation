# KASPI VS HALYK — КТО СИЛЬНЕЕ В 2026 ГОДУ?

90-second vertical (1080×1920, 30 fps, H.264/AAC) 2D animated financial documentary in Russian.

**Final video:** [`FINAL_KASPI_VS_HALYK_2026.mp4`](FINAL_KASPI_VS_HALYK_2026.mp4)

| Folder | What's inside |
|---|---|
| `project/` | Hyperframes composition: `index.html` (layout + styles), `js/art.js` (original vector art: the main character, bank towers, cards, vaults, factories, tech props, icons), `js/scenes.js` (GSAP timeline for all 7 scenes, subtitles, transitions), `data/vo.js` (narration word timings), `audio/soundtrack.wav` (final mix), local fonts and GSAP |
| `voiceover/` | `VOICEOVER_SCRIPT_RU.md` (final Russian script with timings), `script_ru.json`, raw narration per scene (`scene_*.wav`), word timings |
| `research/` | `FINANCIAL_DATA_RU.md` — every figure shown on screen, with source, reporting date and comparability notes |
| `tools/` | `tts_generate.py` (narration + word alignment), `build_timing.py`, `make_audio.py` (original score, sound effects, voice processing, ducking) |

## Rebuild

```bash
pip install piper-tts onnx numpy scipy soundfile
# voice model: github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ru_RU-ruslan-medium.tar.bz2
python3 tools/tts_generate.py <ruslan.onnx> voiceover/script_ru.json voiceover
python3 tools/build_timing.py .
python3 tools/make_audio.py .        # writes project/audio/soundtrack_premaster.wav
ffmpeg -i project/audio/soundtrack_premaster.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a pcm_s16le project/audio/soundtrack.wav
cd project && npx hyperframes render . -o ../FINAL_KASPI_VS_HALYK_2026.mp4 -q delivery -f 30
```

## Notes
- All figures: FY2025 audited IFRS, consolidated groups, balance sheet at 31.12.2025 (see `research/`).
- Bank logos are not reproduced; names are set as text in brand colours.
- Music and sound effects are synthesized from scratch in `tools/make_audio.py` — no stock audio or footage.
