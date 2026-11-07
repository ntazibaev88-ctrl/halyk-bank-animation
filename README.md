# ПТЭ және ТБ — Жылу электр орталығында қауіпсіз және дұрыс жұмыс істеу

Vertical (9:16, 1080×1920, 30 fps) 2D animated explainer in Kazakh, ~3:54.

**Finished video:** `output/PTE_TB_TEC_kk_1080x1920.mp4`
**Subtitles (separate):** `output/PTE_TB_TEC_kk.srt` (also burned into the video)

## Scenes
| # | Scene | What's animated |
|---|-------|-----------------|
| — | Hook | Night CHP plant, steam plumes, worker walking the catwalk, rotating warning beacons, red alarm, title slam |
| 1 | ПТЭ | Blueprint drawing, gears, rule book page flip, 4 key points synced to narration |
| 2 | ТБ | Worker gets PPE item by item (helmet, gloves, glasses, boots, uniform) with callouts |
| 3 | Equipment | 10 animated cutaways: boiler, turbine, generator, pump, induced-draft fan, fan, deaerator, economizer, condenser, pressure gauge |
| 4 | Before work | Checklist, helmet on, inspection, gauges, shift handover with colleague |
| 5 | Monitoring | Live dashboard (pressure, temperature, vibration, noise, leak, level, condition), alarm, radio report |
| 6 | Prohibited | 6 prohibition cards stamped "БОЛМАЙДЫ", final banner |
| 7 | Permit & isolation | Work permit filled and stamped, breaker switched off and padlocked, "ҚОСПАҢЫЗ!" sign, authorized personnel only |
| 8 | Emergencies | Steam leak, burst pipe, pump failure, fire, power loss; worker moves away and reports |
| 9 | Fire safety | Extinguisher types and fire classes, evacuation route, 101 / 112 |
| 10 | 10 golden rules | Rules appear one by one with icons |
| — | Final | Plant in normal operation, worker, closing title |

## How it's built
Everything is generated from code in this repo — no stock footage, images or music.

- `script/scenes.json` — Kazakh narration, split into segments that drive visual cues.
- `tools/tts.py` — narration with Microsoft neural voice `kk-KZ-DauletNeural` (young adult male) via `edge-tts`, plus word timings → `build/timeline.json`.
- `src/` — the animation: HTML/SVG vector art driven by a deterministic `seek(t)` (`lib.js`, `art_*.js`, `scenes_*.js`, `main.js`). Subtitles are rendered from word timings (max 2 lines, keywords in orange).
- `tools/audio.py` — original procedurally synthesized score (D minor cinematic, intensity per section) and sound effects (steam, alarms, turbine/pump hum, whooshes, stamps, chimes), ducked under the voice.
- `tools/render.js` — renders every frame with headless Chromium (Playwright) and encodes with ffmpeg.

Rebuild everything: `./build.sh` (needs Python 3, Node with Playwright/Chromium, ffmpeg and network access to `speech.platform.bing.com` for the voice).

Preview single frames: `node tools/shot.js <out_dir> 5 30 60` (times in seconds).
