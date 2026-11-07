# ПТЭ және ТБ — Жылу электр орталығында қауіпсіз және дұрыс жұмыс істеу

Vertical (9:16, 1080×1920, 30 fps) 2D animated explainer in Kazakh, ~10:29 (part 1: PTE/TB basics, part 2: practical boiler-room module).

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
| — | Part 1 close | Plant in normal operation, worker, title (bridges into part 2) |
| — | Part 2 card | "Практикалық бөлім": boiler room work and industrial safety, topic overview |
| 11 | Pipes Ø32–60 mm | Pipe sizes, outer/inner diameter, wall thickness s = (Dн − Dв)/2, DN; routing, slope, supports, clamps, flange/weld, expansion loop, insulation; dimensions only from approved drawings |
| 12 | Cooling system | Animated loop: pump → condenser → heat exchanger → cooling tower → back; hot/cold water flow |
| 13 | Insufficient lighting | Dark boiler room, worker stops and reports to shift supervisor, approved portable work light |
| 14 | Tools | 10 tools with Kazakh names (Russian in parentheses) and purpose; pre-use inspection, defective tool rejected |
| 15.1 | Mechanisms | Main mechanisms and purposes; pump unit cutaway: motor, coupling, shaft, bearings, impeller; how torque reaches the water; guards over rotating parts |
| 15.2 | Start-up / shut-down | Control panel, pre-start checks, start, monitoring pressure/current/vibration/noise, stop, wait for full standstill |
| 15.3 | Fault signs | Vibration, knocking noise, bearing heat, leak/smoke/smell, pressure/current deviation; keep away, report, fault log |
| 15.4 | Preparing for repair | Work permit, electrical and other energy sources isolated, lock & tag, rotation to zero, no-voltage check, start attempt blocked, ban on touching running machinery |
| 15.5 | Repair & test | Only qualified authorised staff on a stopped, locked unit; tools collected, guards back, people out, locks removed by responsible person, test run, accepted |
| 16 | Moving around site | Walkway, forklift, overhead crane with suspended load and danger zone, rotating machinery, restricted area |
| 17 | Alcohol & drugs | Bans on alcohol, drugs/psychotropic substances, operating equipment while impaired; arrive sober; report feeling unwell |
| 18 | Safety checklist | Before / during / after work, every box ticked in sync with narration |
| — | Final | Clean, safely operating boiler room, worker, "Қауіпсіздік өзіңнен басталады!" |

## How it's built
Everything is generated from code in this repo — no stock footage, images or music.

- `script/scenes.json` — Kazakh narration, split into segments that drive visual cues.
- `tools/tts.py` — narration with Microsoft neural voice `kk-KZ-DauletNeural` (young adult male) via `edge-tts`, plus word timings → `build/timeline.json`.
- `src/` — the animation: HTML/SVG vector art driven by a deterministic `seek(t)` (`lib.js`, `art_*.js`, `scenes_*.js`, `main.js`). Subtitles are rendered from word timings (max 2 lines, keywords in orange).
- `tools/audio.py` — original procedurally synthesized score (D minor cinematic, intensity per section) and sound effects (steam, alarms, turbine/pump hum, whooshes, stamps, chimes), ducked under the voice.
- `tools/render.js` — renders every frame with headless Chromium (Playwright) and encodes with ffmpeg.

Rebuild everything: `./build.sh` (needs Python 3, Node with Playwright/Chromium, ffmpeg and network access to `speech.platform.bing.com` for the voice).

Preview single frames: `node tools/shot.js <out_dir> 5 30 60` (times in seconds).
