# ТӘУЕЛСІЗДІК — ЕҢ ҚЫМБАТ ҚҰНДЫЛЫҚ
**Қазақстан: Тәуелсіздікке 35 жыл · 16 Желтоқсан** — 120-second vertical documentary (Kazakh)

This folder holds the project source, the build pipeline, and the deliverables (`out/`).
Large media (source footage, prepared shots, renders) are not committed. See *Rebuilding*.

## Deliverables (`out/`)
| File | What it is |
|---|---|
| `KAZAKHSTAN_INDEPENDENCE_35_YEARS_4K.mp4` | Final film, 2160×3840, 30 fps, HEVC/H.265 + AAC 48 kHz, exactly 120.000 s (not committed: too large for Git) |
| `KAZAKHSTAN_INDEPENDENCE_35_YEARS_1080p_preview.mp4` | Light preview of the same master (1080×1920, H.264) |
| `KAZAKHSTAN_VOICEOVER.wav` | Narration stem, 48 kHz / 24-bit, 120.000 s, −16 LUFS, sentence timing as used in the film |
| `KAZAKHSTAN_SUBTITLES.srt` | Kazakh subtitles, timed from the synthesiser's word boundaries, ≤ 2 lines per cue |
| `KAZAKHSTAN_SCENE_TIMELINE.csv` | Shot-by-shot timeline: start/end, exact narration, asset file, visual description, on-screen label, motion graphics, subtitle text, audio cue, transition, origin/authenticity, licence |
| `mix_master.wav` | Final mix (VO + ducked music + SFX), −14 LUFS integrated |
| `CREDITS.md` | Sources and licences |
| `QC_REPORT.md` | Technical verification of the rendered file |

## Pipeline
1. **Voice:** `tools/tts.py`, `tools/build_voice.py`, `tools/layout_voice.py`. Microsoft neural Kazakh voice *kk-KZ-DauletNeural* (male) synthesises each sentence. Years are written out for correct reading (*мың тоғыз жүз сексен алтыншы…*). Sentences are laid out at natural speed (no time-stretch) with 0.5 s pauses inside scenes and 1.2 s between scenes, giving narration from 1.0 s to 117.0 s.
2. **Edit decision list:** `tools/make_edl.py` → `edl.json`. 38 shots, each cut on the narration's word timestamps.
3. **Shot preparation:** `tools/prep.py` (FFmpeg). Trim, slow-motion where useful, per-shot grade (doc / warm / cold-1986 / night / archival), and a 9:16 reframe at 2160×3840. Low-res 16:9 people footage uses a "framed" documentary treatment (sharp band over a blurred plate) instead of a blurry full-bleed blow-up.
4. **Composition:** `tools/build_comp.py` → `hf/index.html` (**HyperFrames** + GSAP). Footage layer with cross-dissolves and dips to black, camera moves, film grain, vignette, titles, the 1986→2026 timeline strip, an animated Kazakhstan map (Natural Earth outline, Almaty pin, Almaty→Astana arc for the 1997 capital move), an animated globe, context labels, and subtitles with gold key-words. Fonts: Montserrat + Cormorant Garamond (checked for every Kazakh letter: ә ғ қ ң ө ұ ү һ і).
5. **Audio:** `tools/mix.py`. Music is sidechain-ducked under the voice, plus SFX/ambience, normalised to −14 LUFS with true peak ≤ −1 dBTP.
6. **Render:** `npx hyperframes render` (2160×3840, 30 fps). The mix is muxed in and the master is encoded to HEVC with FFmpeg. QC: `tools/qc.sh`.

## Honest notes on sources and limits
* **Voice is AI-synthesised**, not a human recording (Azure neural TTS, Kazakh male voice). Pronunciation was not reviewed by a native speaker. That review, or a human re-record using the same timings, is recommended before publication.
* **No authentic moving footage of December 1986 or 16 December 1991 was reachable** from this environment. Those chapters use present-day photographs of the actual sites and memorials, each labelled on screen ("ҚАЗІРГІ КӨРІНІС", monument names, "2001" commemoration photo), plus motion graphics. Nothing is presented as original 1986/1991 recording.
* **Stills are used more than the brief allows:** 14 of 38 shots (≈ 43 s of 120 s) are photographs with camera moves. They cover 1986, 1991, the 1993 tenge and Astana. Reason: Wikimedia Commons, the only reachable source of Kazakhstan-specific video (Astana drone footage, Orda/Zhaltyrkol steppe drone footage, 1992 archival footage of the President's Washington visit, Kazpost workers, Astana children), rate-limited this environment (HTTP 429, `retry-after: 600`) for the entire session. The Pexels key saved in the environment is rejected by Pexels (401; Pexels expects the raw key with no "Bearer" prefix).
* **Illustrative stock:** 9 shots are generic Mixkit footage (wheat, harvesters, steel, students' hands, children from behind). They are not filmed in Kazakhstan and are marked "illustrative stock" in the timeline CSV.
* **"1992 — БҰҰ-ға мүше болу"** is shown over 2026 footage of the Kazakhstan flag at Baikonur. Its label says so ("БАЙҚОҢЫР · ХАЛЫҚАРАЛЫҚ ЫНТЫМАҚТАСТЫҚ"). No UN footage was available.
* **Resolution:** the file is 2160×3840, but it is **not native 4K**. Most video sources are 1280×720 or 1920×1080. After the vertical crop, footage is upscaled about 3.5–5×. Stills are 1280–3840 px. Motion graphics and text are rendered natively at 4K.
* **No dombra layer:** no licensed dombra recording was reachable (the Commons dombra recordings are behind the same rate limit). The music is an orchestral/cinematic bed only.

## Rebuilding
```
pip install edge-tts brotli fonttools pillow
python3 tools/build_voice.py "+0%" && python3 tools/layout_voice.py
python3 tools/make_edl.py && python3 tools/prep.py
python3 tools/build_comp.py && python3 tools/mix.py && python3 tools/make_csv.py
cd hf && npx hyperframes render . -o ../out/render/video_4k_silent.mp4 --fps 30 --quality delivery --video-bitrate 48M
bash tools/finalize.sh
```
Source media must be re-downloaded into `assets/` (URLs in `research/` and `CREDITS.md`).
