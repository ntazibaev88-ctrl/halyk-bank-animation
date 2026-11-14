# Қазақстан — тәуелсіздікке 35 жыл

Vertical (1080×1920, 30 fps, ~120 s) documentary short in Kazakh.
Final film: `film/output/kazakhstan_35.mp4`.

- `film/build/timeline.md` — shot-by-shot timeline (narration, timing, clip, subject, source) and subtitle timing
- `film/CREDITS.md` — footage licences/attribution, music, voice
- `film/script.json` — narration and on-screen titles

## Rebuild

```
cd film
python3 gen_vo.py "-6%"        # narration (TTS) -> vo/
python3 build_timeline.py      # narration timeline + voice track
python3 compose.py             # original score (FluidSynth + FluidR3_GM)
python3 mix_audio.py           # voice + music + wind -> build/audio.wav
python3 make_plan.py           # shots.json + timeline -> plan, timeline.md, subtitles.srt
python3 prepare_shots.py       # conform/grade source clips to 1080x1920
cd remotion && npm i && npx remotion render src/index.ts Film ../build/film_video.mp4 --crf=17
```

Raw source clips are not committed (size); `film/footage/tools/gett.py` re-downloads them from Wikimedia Commons.
