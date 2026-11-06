# ТВОЙ МОЗГ ТЕБЕ ВРЁТ — «Your Brain Is Lying to You»

A 90-second vertical (1080×1920, 30 fps) 2D animated explainer in Russian about how the brain decides, remembers and edits reality. Built as a [HyperFrames](https://hyperframes.heygen.com) project (HTML + GSAP timelines + seek-driven canvas, rendered frame-exact to MP4).

**Video:** [`renders/your-brain-is-lying-to-you.mp4`](renders/your-brain-is-lying-to-you.mp4)

| | |
| --- | --- |
| Narration script (RU, with timecodes) | [`deliverables/narration_ru.md`](deliverables/narration_ru.md) |
| Subtitles | [`deliverables/subtitles_ru.srt`](deliverables/subtitles_ru.srt) · [`.vtt`](deliverables/subtitles_ru.vtt) (also burned into the video) |
| Characters (reusable rigs + sheet) | [`design/CHARACTERS.md`](design/CHARACTERS.md) · [`design/character-sheet.png`](design/character-sheet.png) |
| Review notes | [`REVIEW.md`](REVIEW.md) |

## Story

| # | Time (s) | Scene | What happens |
| --- | --- | --- | --- |
| 1 | 0.00–5.28 | The hook | Tim stares at you; the brain behind him wakes up and drops puppet strings onto his hands. |
| 2 | 5.28–19.93 | The illusion | Decision cards and a counter → the brain flips AUTOPILOT and works Tim's hands → maze shortcut → energy-saving mode → a stamp prints the same day over and over. |
| 3 | 19.93–33.90 | The memory trap | Night, top-down bed. A "5 years ago" flashback of waving at someone who wasn't waving at you. КРИНЖ. The brain hits replay ×99 while the clock runs to 03:07. |
| 4 | 33.90–51.34 | The hidden mechanism | REC crossed out → «МОНТАЖ!»; a spotlight picks what matters; a monster that is a coat; made-up puzzle pieces; a memory TV that glitches: ПАМЯТЬ ≠ ВИДЕО. |
| 5 | 51.34–65.82 | The surprise | One cake disaster, two memories: Tim's «ПОЗОР» vs Anya's «УМОРА»; emotions, expectations and experience as tinted lenses. |
| 6 | 65.82–90.00 | The final message | Dawn. «Я точно всё помню» cracks — «ПРОВЕРЬ!»; a WANTED poster; the brain shrinks into a friendly sidekick; comment prompt and title card. |

Scene boundaries follow the narration (lead-in + a visual beat after each line), so scenes 4–6 start up to ~9 s earlier than in the original brief; the total is exactly 90 s.

## Project layout

```
video/                     HyperFrames project (render this)
  index.html               root: 6 scene hosts, grain overlay, captions, 3 audio tracks
  compositions/s1…s6-*.html  one scene per file (canvas drawn from the scene timeline)
  compositions/captions.html  kinetic subtitles (generated)
  compositions/fx.html     film grain
  lib/core.js              keyframes, easing, seeded noise, line boil, camera/parallax, text
  lib/characters.js        Tim, Anya and Brain rigs
  lib/props.js             phone, burger, cards, bubbles, battery, stamp bits…
  lib/gsap.min.js, fonts.css, assets/fonts/   vendored GSAP 3.13 and Cyrillic fonts
  assets/audio/            voice.wav, music.wav, sfx.wav
  assets/timing.json       clause + word timestamps (drive captions and choreography)
scripts/
  narration.py             the Russian script, split into clauses with pauses
  ru_tts.py                espeak-ng phonemes (with stress fixes) → Piper "Ruslan" ONNX voice
  gen_voice.py             builds voice.wav + timing.json (per-clause cache)
  asr_check.py, best_take.py  back-transcribe with a Russian ASR; refine word times; pick best takes
  build_captions.py        captions.html + SRT/VTT from timing.json
  gen_audio.py             music bed (ducked under the voice) + SFX stem
design/                    character sheet + docs
deliverables/              narration script, subtitles
renders/                   final MP4
```

## Rebuild

```bash
npm install                       # hyperframes CLI (pinned 0.9.19), gsap, fonts
pip install -r scripts/requirements.txt
# voice models (GitHub release assets from k2-fsa/sherpa-onnx) go in /home/user/tts:
#   tts-models/vits-piper-ru_RU-ruslan-medium.tar.bz2, asr-models/sherpa-onnx-zipformer-ru-2024-09-18.tar.bz2
npm run voice      # only if the script changes (re-times every scene)
npm run captions
npm run audio
npm run check
npm run render     # → renders/your-brain-is-lying-to-you.mp4
```

Live preview / editing: `cd video && npx hyperframes preview` (or open the folder in the HyperFrames desktop app).

## Notes

- **Voice** is a local neural TTS (Piper «Ruslan», ru_RU), pitched down ~1.4 semitones with formants preserved and lightly mastered. Stress was checked word by word (espeak-ng phonemes) and fixed where needed; a Russian speech recognizer transcribes the track back to the script. It is clear and natural for TTS, but it is not a human voice actor — for a release, a recorded narrator (or a premium cloud voice) can replace `video/assets/audio/voice.wav` and `npm run voice` timings can be re-derived with `asr_check.py`.
- **Music and SFX** are synthesized in code (`scripts/gen_audio.py`) because no music/SFX library was reachable from the build machine. Levels were measured, not listened to: final mix −15.0 LUFS integrated, −1.3 dBTP true peak; the music bed sits ~14 dB under the voice and ducks further during speech.
- Fonts: Unbounded and Montserrat (SIL Open Font License), via @fontsource.
