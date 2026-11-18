# GTA 6 — The Game That Changed Everything?

80-second vertical (9:16, 2160×3840, 30 fps) Russian-language documentary short, built with
[HyperFrames](https://github.com/heygen-com/hyperframes) (HTML → video) plus Python/ffmpeg tooling.

## Status

| Part | State |
|---|---|
| Narration (16 lines, Russian male voice) | done — `deliverables/GTA6_voiceover.wav` |
| Scene timeline (35 shots, every cut on its word) | done — `deliverables/GTA6_scene_timeline.md` / `.csv` |
| Subtitles (Russian, ≤ 2 lines, keyword highlights) | done — `deliverables/GTA6_subtitles.srt` + burned in |
| Original music score + sound design | done — synthesized in `tools/music.py`, `tools/sfx.py` |
| Mix (voice-forward, ducked, −14 LUFS, −1.5 dBTP) | done — `audio/mix.wav` |
| Motion typography, chapter labels, transitions, grade | done — `index.html` (generated) |
| **Official GTA VI footage** | **missing** — 35 slots render as labelled animatic slates |

The current export is an **animatic**: final cut, sound and graphics, with every picture slot marked
«СЛОТ ДЛЯ ОФИЦИАЛЬНОГО ВИДЕО GTA VI» and a corner tag «АНИМАТИК · ЧЕРНОВОЙ МОНТАЖ».
No stock footage, GTA V footage or generated imitation of Rockstar footage is used.

### About the voice

The narrator is **Microsoft Edge neural TTS, voice `ru-RU-DmitryNeural`** — synthetic speech, not a
human recording. It is processed (EQ, de-ess, compression, light room) but its source is a 24 kHz
stream. To use a real narrator, record the 16 lines in `script/narration.json`, save them as
`audio/vo_parts/sNN.mp3` with matching `sNN.json` word timings (or re-time by hand), and rebuild.

## QC of the current export

`deliverables/QC_report.md` — `GTA6_CINEMATIC_DOCUMENTARY_4K_ANIMATIC.mp4` (not in git, 519 MB):
80.000 s · 2160×3840 · 30/1 fps CFR · 2400 frames · H.264 High@5.2 ~52 Mb/s · AAC 48 kHz 320 kb/s ·
−14.0 LUFS / −1.4 dBTP · no black frames · no frozen frames · 35 cues ≤ 2 lines, no overlaps ·
35 shots (avg 2.29 s). Only warning: 35/35 picture slots are animatic slates.

## Finishing the film with real footage

1. Put official GTA VI videos (Rockstar trailers / officially released footage you are allowed to use)
   in `footage/raw/`. A 4K 16:9 source gives a 1215×2160 native 9:16 crop, i.e. ×1.78 upscale to
   2160×3840; `prep_footage.py` reports this per clip rather than hiding it.
2. Copy `footage/clips.example.json` → `footage/clips.json` and add one entry per shot
   (`S01`…`S35`) with source file, in-point, horizontal crop focus and optional speed (slow-mo).
   What each slot needs is in `deliverables/GTA6_scene_timeline.md` («Needs» column).
3. Run `./render.sh` → `deliverables/GTA6_CINEMATIC_DOCUMENTARY_4K.mp4` + QC report.
   Slots without an entry stay as slates, so it can be filled in stages.

## Pipeline

```
script/narration.json ─ tts.py ─► audio/vo_parts ─┐
script/shots.json ────────────────────────────────┴ timeline.py ─► voiceover.wav, timeline.json, SRT, scene timeline
                                       music.py ─► music.wav (arranged to the section cuts)
                                         sfx.py ─► sfx.wav   (impacts/whooshes/ambience on the cuts)
                                         mix.py ─► mix.wav   (ducked, loudness-normalised)
footage/clips.json ─ prep_footage.py ─► footage/cut/Sxx.mp4 (9:16 crop, grade, handles)
                                     compose.py ─► index.html (HyperFrames composition)
                    hyperframes render ─► finish.py (grain, H.264 High 5.2, AAC 320k) ─► verify.py (QC)
```

Requirements: Python 3 with `numpy scipy edge-tts`, ffmpeg (with rubberband), Node ≥ 22, `hyperframes`.
Fonts: Montserrat and Unbounded (SIL OFL), bundled in `assets/fonts`. GSAP bundled in `assets/vendor`.
