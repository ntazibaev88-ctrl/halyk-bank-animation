# world3d — the 3D film plate

The 3D picture of «Қазақстан — 35 жыл» is a deterministic Three.js film: `renderAt(t)` draws film time `t`, so any frame renders on its own. It is baked to `assets/plate/plate.mp4` and HyperFrames composites the titles, captions and audio on top.

| File | What |
| --- | --- |
| `engine.js` | Renderer + one-pass cinematic post (depth of field, bloom, god rays, lens ghosts, ACES tone map, colour grade, halation, grain, vignette); procedural sky with clouds; water with real reflections; verlet **cloth simulation** for the flag (deterministic, cached per frame); extruded gold glyphs |
| `assets.js` | Models: Baiterek (lattice + gold glass sphere), Khan Shatyr, Palace of Peace and Reconciliation, Ak Orda, Hazret Sultan, Nur Alem, procedural Astana (setback towers, boulevard, roads, merged per material), Soviet panel blocks, pumpjacks, refinery, wheat, combine, train, wind turbines, solar field, people; terrain from real Alatau elevation |
| `shots.js` | The 24 shots and their timing, cameras, light and per-era grade |
| `main.js`, `index.html` | Boot page; exposes `window.renderAt(t)` and `window.grab(t)` |
| `render_plate.mjs` | Renders frames with headless Chromium: `node render_plate.mjs <scale> <from> <to> <outdir>` (resumable) |
| `preview.mjs` | Look-dev stills: `node preview.mjs 0.3 2.5,33,104 /tmp/prev` |

## Re-render the plate
```bash
# from the repository root, serve files over http
python3 -m http.server 8765 &
cd kazakhstan-35/world3d
node render_plate.mjs 0.8 0 3270 /tmp/plate          # ~1 h on 4 CPU cores (software WebGL)
ffmpeg -framerate 30 -i /tmp/plate/f_%05d.jpg -vf "scale=1080:1920:flags=lanczos,unsharp=5:5:0.4" \
  -c:v libx264 -crf 16 -pix_fmt yuv420p ../assets/plate/plate.mp4
cd .. && npx hyperframes@0.9.20 render -o renders/kazakhstan-35-years-3d.mp4
```
With a real GPU, use `scale=1` (full 1080×1920).

## Eras (grade per period)
1991 dawn — warm, desaturated, halation and heavy grain · 1992–93 archival — cool-warm, soft · 1997–2010 golden hour construction · industry — teal/orange sunset · 2017 EXPO — blue hour, bloom · 2026 — clean, cool, crisp · finale — sunrise gold over blue.

## Data and licences
- Terrain: AWS Terrain Tiles (Mapzen terrarium; SRTM/public data), Zailiysky Alatau around Almaty.
- HDR skies and water normals: Poly Haven (CC0) via the three.js examples; Earth textures: three.js examples (NASA-derived).
- three.js: MIT (`vendor/three/LICENSE`).
