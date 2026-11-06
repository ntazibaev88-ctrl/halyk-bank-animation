# NOIRX — USA VS CHINA: КТО БУДЕТ ПРАВИТЬ МИРОМ?

A fully animated 2D cartoon documentary for the NOIRX brand, built with [Remotion](https://www.remotion.dev/).

- Vertical 9:16, 1080×1920, 30 fps, ~79 s
- Russian male voiceover (offline neural voice), word-synced Russian subtitles
- Procedurally generated cinematic score and sound effects
- 100% vector/SVG illustration, every scene individually animated

**Final video:** `final/noirx-usa-vs-china.mp4`

## Scenes

| # | Scene | What moves |
|---|-------|-----------|
| 01 | Hook — globe in space | camera rush-in, rotating globe with drifting clouds, waving US/China flags, energy arcs, satellite, title slam «США VS КИТАЙ» |
| 02 | America | Washington → New York camera pan with parallax, rising skyscrapers, elevated train, taxis and buses, fighter-jet flyover, USD chart panel, tech icons |
| 03 | China | twilight Shanghai skyline (Oriental Pearl, Jin Mao, SWFC, Shanghai Tower), drone light show, EVs with light trails, cut-away EV factory with welding robots |
| 04 | Microchips | chip assembly (substrate, pins, die, lid), components snapping in, glowing circuit traces (blue/red/gold), rotating wafer, tug-of-war meter, key, future-tech icons |
| 05 | Artificial intelligence | AI lab, server racks, expanding neural network with signal pulses, rivalry split, robotic arms, live monitors, data flowing along cables |
| 06 | Global trade | world map with animated sea routes and ships, US⇄China link, cargo ship crossing the ocean, port crane, waves, seagulls |
| 07 | Rare-earth metals | open-pit mine, excavator, dump truck, conveyor of minerals, processing plant, element tiles (La, Ce, Pr, Nd, Tb, Dy), supply-chain strip |
| 08 | Interdependence | two factories exchanging products along arcs, spinning globe, «ПАРАДОКС» stamp, «ОДНА МИРОВАЯ ЭКОНОМИКА» ring, VS → ⇄ |
| 09 | The big question | night globe with city lights, US and Chinese landmark platforms, searchlights, advantage icons |
| 10 | Final | globe settles, «КТО ПОБЕДИТ? / США ИЛИ КИТАЙ?», NOIRX logo reveal, comment CTA |

## Project layout

```
scripts/
  fetch_models.sh   download the offline voice + ASR models (into models/, git-ignored)
  narration.py      synthesise the voiceover, align words, write src/data/timeline.json
  sound.py          synthesise music.wav + sfx.wav synced to the timeline
  stills.mjs        render QC stills: node scripts/stills.mjs <outDir> <frame...>
public/
  audio/            voiceover.wav, music.wav (ducked), sfx.wav
  fonts/            Montserrat + Russo One (Cyrillic), SIL Open Font License
src/
  Root.tsx          main composition + one preview composition per scene
  Video.tsx         scene sequencing, cut flashes, HUD, subtitles, audio
  data/timeline.json  scene timing and word-level subtitle timing (generated)
  components/       Globe, Flag, Buildings, Vehicles, Robot, Logo, Subtitles, HUD…
  scenes/           Scene01Hook … Scene10Final
```

The timeline is driven by the narration: each scene lasts at least 7 s and
is extended only as much as the voice needs (the voice is never sped up).

## Rebuild

```bash
npm install
pip install piper-tts sherpa-onnx librosa soundfile scipy numpy
./scripts/fetch_models.sh
python3 scripts/narration.py   # voiceover + timeline
python3 scripts/sound.py       # music + sfx
npm run studio                 # preview (each scene also has its own composition)
npm run render                 # -> out/noirx-usa-vs-china.mp4
```

`remotion.config.ts` points at the pre-installed Chromium in the build
container (`/opt/pw-browsers/chromium`); remove that line to let Remotion
download its own browser elsewhere.

## Credits

- Voice: Piper `ru_RU-ruslan-medium` (via sherpa-onnx releases)
- Word alignment: sherpa-onnx `small-zipformer-ru`
- Map data: Natural Earth via `world-atlas`
- Music and sound effects: synthesised in `scripts/sound.py`
