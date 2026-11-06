# «Что, если завтра исчезнет гравитация Земли?»

90-second vertical (1080×1920, 30 fps) Russian science short, built with HyperFrames.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Root composition: 7 scene hosts, film grain, subtitles, 3 audio stems |
| `compositions/*.html` | Generated scene files (do not hand-edit; edit `build/` and rebuild) |
| `build/components.mjs` | Reusable parts: character rig SVG, bedroom set, HUD styles, fonts |
| `build/scenes/s1…s7.mjs` | One module per scene; times in the code are absolute film seconds |
| `build/scenes/captions.mjs` | Subtitle groups built from the TTS word timings |
| `assets/lib/kit.js` | Runtime kit: seeded RNG, camera helper, rig poses, Earth globe renderer (d3-geo + Natural Earth land) |
| `audio-src/script.json` | The narration text, per scene (`[...]` marks words highlighted in orange) |
| `audio-src/synth.py` → `place.py` → `mix.py` | Voice synthesis → placement on the timeline → score, SFX and final stems |

## Rebuild

```bash
npm install
# narration (Piper "ruslan" Russian voice, needs piper-tts + onnx; models in ../voices)
cd audio-src && python3 synth.py && python3 place.py && cd ..
python3 audio-src/mix.py          # writes assets/audio/{vo,music,sfx}.wav
node build/build.mjs              # writes compositions/*.html
npx hyperframes check
npx hyperframes render -q delivery -o renders/gravity.mp4
```

Re-running `synth.py` re-randomises the voice slightly, so always run `place.py` and the
build after it: the subtitles and scene timings come from `audio-src/timing.json`.
