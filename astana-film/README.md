# АСТАНА — шағын бекіністен заманауи мегаполиске дейін

A 120-second vertical (1080×1920, 30 fps, H.264) 3D documentary about Astana,
with Kazakh narration, Kazakh subtitles, an original score, and verified data.

Output: `renders/astana-documentary.mp4` · separate voiceover: `assets/audio/vo.wav`.

## How it is made

| Layer | Tool | Files |
|---|---|---|
| 3D world (steppe, Ishim, 1830 fortress, Tselinograd, modern city, landmarks) | three.js, rendered in headless Chromium | `src/three/` |
| Per-scene 3D plates (8 videos with 0.5 s handles) | HyperFrames | `s1.plate.html` … `s8.plate.html` → `plates/out/` |
| Titles, timeline, stats, captions, subtitles | HTML/CSS, HyperFrames | `index.html`, `src/overlay/` |
| Voiceover (Kazakh, male, kk-KZ-DauletNeural) + word timings | edge-tts | `tools/narration.py`, `tools/make_vo.py`, `tools/build_vo.py` |
| Cue sheet (every reveal is tied to a spoken word) | Python | `tools/make_cues.py` → `src/data/cues.json` |
| Score + sound design, ducked under the voice | numpy/scipy synthesis | `tools/make_music.py` |

Scene components: each scene is a list of shots in `src/three/scenes.js`
(camera move, light, grade) over one shared, reusable world
(`src/three/world/*`). Landmarks carry completion years, so the 2000→2025
time-lapse builds them in historical order.

## Rebuild

```bash
npm install
# audio (Python venv with edge-tts numpy scipy)
python tools/make_vo.py && python tools/build_vo.py && python tools/make_cues.py && python tools/make_music.py
# 3D + overlay bundles
npm run build
# render the 8 plates (slow on CPU: ~1 h with software WebGL), then the film
tools/render_plates.sh
npm run render
```

`node tools/stills.mjs <dir> <t1> <t2> …` renders quick 3D stills at film times,
and `node tools/overlay_stills.mjs <dir> <bg.png> <t…>` previews the graphics.

Facts, sources and one deliberate deviation from the brief (the budget figure):
see `SOURCES.md`.
