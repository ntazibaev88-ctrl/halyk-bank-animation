# «АТАНЫҢ АМАНАТЫ» — production project

Vertical 2160×3840, 30 fps, 120 s short film for the 35th anniversary of Kazakhstan's Independence.
Rendered with [HyperFrames](https://hyperframes.heygen.com) (HTML → video) and FFmpeg.

## Pipeline

| Step | Script | Output |
|---|---|---|
| Shot list (single source of truth) | `scripts/shots.py` | — |
| Kazakh voiceover (Azure neural TTS, word timings) | `scripts/tts.py` | `audio/vo/L*.mp3`, `*.words.json` |
| Place VO on the timeline + subtitle cues | `scripts/vo_build.py` | `audio/vo_track.wav`, `build/cues.json`, `../deliverables/KAZAKH_SUBTITLES.srt` |
| Synthesised SFX and dombra | `scripts/sfx.py`, `scripts/dombra.py 155.56 audio/sfx` | `audio/sfx/*.wav` |
| Final mix (rider/ducking, −14 LUFS, −1 dBTP) | `scripts/mix.py` | `assets/audio/final_mix.wav`, `../deliverables/KAZAKH_VOICEOVER.wav` |
| Grade/crop footage to 2160×3840 | `scripts/prep_shots.py` | `assets/shots/S*.mp4` |
| Generate composition + shot timeline | `scripts/build_comp.py` | `index.html`, `../deliverables/SHOT_TIMELINE.csv` |
| Credits / licenses | `scripts/credits.py` | `../deliverables/CREDITS.md` |
| Render | `npx hyperframes render -o out.mp4 -q looks -w 3` | MP4 |

Animated scenes (silhouettes of Ata and Bala, the Kazakh home, the dawn steppe, the waving flag) live in
`assets/js/characters.js`, `scenes.js`, `flag.js`; typography in `graphics.js`; the clock-driven runtime in `film.js`.

Raw footage is downloaded into `media/` (not committed). A shot whose preferred source has not been
downloaded falls back to the `alt` shot defined next to it in `shots.py`.
