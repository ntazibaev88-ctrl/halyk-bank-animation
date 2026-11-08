# АСТАНА — даладан елордаға дейін (2D)

A 120-second vertical (1080×1920, 30 fps, H.264) 2D motion-graphics documentary
about Astana, built with **HyperFrames + GSAP**. Everything on screen and in the
audio is in Kazakh.

**Deliverables**
- `renders/astana-2d.mp4` — final film
- `cover.png` — TikTok cover (1080×1920)
- `assets/audio/vo.wav` — voiceover only · `assets/audio/score.wav` — music + SFX only
- `NARRATION_KK.md` — full Kazakh narration with timings
- `subtitles_kk.srt` — Kazakh subtitles with timestamps
- `SOUND_PLACEMENT.md` — music and sound-effect placement
- `SOURCES.md` — every figure, its date and source

## How it is built

- `index.html` — the root composition (audio + stage + UI layers)
- `src/scenes/s1-hook.js … s8-finale.js` — one reusable component per scene;
  each adds its tweens to the single paused GSAP timeline at absolute times
- `src/lib/art.js` — SVG illustration library (sky, steppe, Ishim, fortress,
  yurts, riders, Soviet blocks, skyline, Baiterek, Khan Shatyr, Ak Orda, flag…)
- `src/lib/maps.js` — Kazakhstan outline and Astana district map
- `src/ui/` — kinetic typography, counters, subtitles (`content.js` holds all text)
- `src/data/` — voice word timings (`subtitles.json`) and the cue sheet (`cues.json`);
  every reveal is anchored to the spoken word it illustrates
- `tools/` — voice (edge-tts), cue sheet, music synthesis, render scripts

Motion is seek-safe: only `fromTo`/`set`/`to` tweens at absolute positions on the
paused timeline, yoyo loops for sway, sampled keyframes for paths; counters and
subtitles are computed from the seek time.

## Edit and render

```bash
npm install
npx esbuild src/main.js --bundle --format=iife --minify --loader:.json=json --outfile=app.bundle.js
npx hyperframes preview          # live studio
tools/snap.sh out.png 3,10,25    # quick stills
tools/render.sh                  # renders/astana-2d.mp4
```

To change text or numbers, edit `src/ui/content.js`. To change the narration,
edit `tools/narration.py`, then run `make_vo.py`, `build_vo.py`, `make_cues.py`,
`make_music.py` (Python with edge-tts, numpy, scipy) and rebuild.
