# Halyk Bank — 60-second 2D animated spot (9:16, 1080×1920, 30 fps)

Premium vector motion-graphics commercial, fully procedural (Canvas 2D → frames → ffmpeg). Russian on-screen text and narration script, cinematic electronic score, synced SFX, and a reserved clean zone for the official logo.

## Deliverables (`output/`)
| File | What it is |
|---|---|
| `halyk_bank_60s_1080x1920_no-vo.mp4` | **Master picture + music + SFX, no voice.** Drop a real narrator on top (see `docs/VOICEOVER.md`). |
| `halyk_bank_60s_1080x1920_guide-vo.mp4` | Same, with a **synthetic guide voice** (espeak-ng) timed to the scenes — for timing review only, not release quality. |
| `clips/clip1…clip7_*.mp4` | The same video split into the 7 scene clips at the exact scene timings (0–7, 7–15, 15–23, 23–33, 33–43, 43–53, 53–60 s). |

> **Honest note on the voice:** the sandbox has no access to a neural Russian TTS model, so the "deep, confident male narrator" must be recorded/generated separately. `docs/VOICEOVER.md` has the script with per-line time windows; the guide track proves every line fits its scene.
> **Logo:** the final scene reserves a 520×300 px clean zone at (540, 800) marked only by subtle corner brackets. Place the official Halyk logo there (e.g. `ffmpeg overlay`, see `docs/PROJECT.md`). No logo, app UI, statistics or awards are invented; app screens are generic illustrations.

## Project structure
```
src/            index.html (canvas shell) · lib.js (easing, type, characters, props, icons)
                scenes_a.js (S1–S3) · scenes_b.js (S4–S5) · scenes_c.js (S6–S7 + master timeline & transitions)
audio/          make_audio.py — procedural score, SFX, timed guide VO, mixes
tools/          render.js (parallel Playwright frame renderer) · build.sh (full pipeline) · stills.js / contact.py (QA)
docs/           PROJECT.md (structure + timeline) · VOICEOVER.md (RU script) · AUDIO_CUES.md (music + SFX cue sheet)
output/         final MP4s + 7 clips
```

## Rebuild
```bash
npm i -g playwright   # chromium preinstalled in the cloud image; ffmpeg + python3 + numpy + espeak-ng required
tools/build.sh /tmp/halyk_build
```
Open `src/index.html` in a browser for a live looping preview, or `src/index.html?t=12.5` for a single frame.
