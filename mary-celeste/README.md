# «Мэри Селеста» — корабль-призрак

Vertical (9:16) cinematic documentary short about the 1872 *Mary Celeste* mystery, built with
[HyperFrames](https://hyperframes.heygen.com) (HTML + GSAP rendered frame by frame to MP4).

| | |
|---|---|
| Format | 1080 × 1920, 30 fps, H.264 + AAC |
| Length | 84.96 s |
| Language | Russian voiceover + burned-in Russian subtitles |
| Final video | `renders/mary-celeste.mp4` |
| Sidecar subtitles | `subtitles.srt`, `subtitles.vtt` |

## Layout

```
index.html                 root composition (generated): scene hosts, overlay, captions, voice/music/ambience
compositions/
  s01-mystery.html         hook (sonar, radar, titles) + storm, callouts, 10 → 0 counter
  s02-voyage.html          Atlantic chart: date, ship name, New York → Genoa route, live coordinates
  s03-people.html          cameo silhouettes (labelled reconstruction), 10 people aboard
  s04-discovery.html       second ship in fog, parallax pan, radar lock + coordinates
  s05-empty-ship.html      sails from the deck, empty cabin (food & water), "НИ ОДНОГО ЧЕЛОВЕКА."
  s06-evidence.html        evidence board: missing lifeboat, cargo, missing instruments
  s07-theories.html        three theories: storm, alcohol fumes, pumps → recap
  s08-investigation.html   desk: chart, log, crew list, stamp, 1872 → 2026 timeline
  s09-question.html        aerial pull-back, fog closes, final question
  s10-ending.html          emblem, closing line, CTA, fade to black
  overlay.html             film grain + vignette over everything
  captions.html            (generated) caption groups synced word by word
assets/
  js/mc.js                 shared motion helpers (seeded RNG, layered sea, motes, title entrances, keyframes)
  vendor/gsap.min.js       GSAP 3.13 (local; renders never fetch)
  fonts/                   Oswald, Inter, Playfair Display, JetBrains Mono — Cyrillic + Latin subsets (OFL)
  img/                     brigantine.svg, atlantic-land.svg (Natural Earth), fog/grain/paper/wood textures
  audio/voice.wav          final mixed-ready voiceover (−16 LUFS)
  audio/vo/                per-sentence TTS takes + word timings (cache)
  audio/music.mp3          score, ambience.mp3 ocean/wind bed, sfx/
  data/timing.json         segment + word timings of the voiceover (film seconds)
tools/                     the generators below
SPEC.md / REVIEW.md        creative brief and the render verification report
```

## Rebuild

```bash
npm install                                     # hyperframes 0.8.190, gsap, fontsource fonts
python3 -m venv .venv && .venv/bin/pip install edge-tts numpy scipy soundfile pillow

.venv/bin/python tools/tts.py       # voiceover → assets/audio/voice.wav + assets/data/timing.json
.venv/bin/python tools/audio.py     # score, ambience, synthesized SFX (follows the scene plan)
python3 tools/build.py              # index.html, captions, scene cue times, .srt/.vtt, fonts
npx hyperframes check               # lint + layout + craft checks
npx hyperframes preview             # live Studio preview
npx hyperframes render -o renders/mary-celeste.mp4 --fps 30 --video-bitrate 8M
```

Everything time-related follows the recorded narration: `tools/scenes.py` cuts scenes at sentence
boundaries, `tools/build.py` writes each scene's cue block (`<script id="sNN-cues">`) with the
scene-local word times, so re-recording the voice re-times the whole film.

The narration text and the caption line breaks live in `tools/narration.json` (`cap` uses `|` for
breaks; the build checks every caption word against the voice timing).

## Sources and licences

- Voice: Microsoft Edge neural TTS, voice `ru-RU-DmitryNeural` (via the `edge-tts` client). Check the
  service terms before commercial use; the voice can be swapped by editing `tools/narration.json`.
- Coastlines: Natural Earth 1:10m land (public domain).
- Fonts: SIL Open Font License (via @fontsource).
- Bundled SFX (`impact-bass-*`, `whoosh-*`, `riser`, `key-press`): Pixabay Content License
  (see `assets/audio/sfx/CREDITS-pixabay.md`). Sonar, creaks, thunder, paper, ticks, boom, the
  score and the ambience are synthesized by `tools/audio.py`.
- Facts used on screen: departure from New York (7 Nov 1872), 10 people aboard (captain Benjamin
  Briggs, wife Sarah, daughter Sophia aged 2, 7 crew), found 4 Dec 1872 by the *Dei Gratia* near
  38°20′N 17°15′W, lifeboat missing, 1,701 barrels of alcohol aboard (9 found empty at Genoa),
  sextant and chronometer missing, last log entry 25 Nov 1872, about 3.5 ft of water in the hold and
  one pump dismantled, six months of food and water aboard. Ship, people and interiors are drawn
  reconstructions and are labelled as such on screen.
