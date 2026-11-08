# АЛМАТЫ — жүректе қалатын қала

A 106-second vertical (1080×1920, 30 fps) Kazakh-language documentary short about Almaty,
built with [HyperFrames](https://hyperframes.heygen.com) (HTML + GSAP rendered to MP4).

Output: `renders/almaty-kk.mp4`

## What is in the film

| # | Scene | Time | On screen |
|---|---|---|---|
| 1 | Hook | 0:00–0:13 | Title «АЛМАТЫ / ТАУЛАР МЕН АРМАНДАР ҚАЛАСЫ», location pin, coordinates, topographic lines, animated Kazakhstan map with Almaty highlighted |
| 2 | City atmosphere | 0:13–0:28 | Streets, modern architecture, parks; chapter + location labels |
| 3 | Mountains | 0:28–0:46 | Topographic map of the Trans-Ili Alatau zooming into the ridge (Talgar peak 4979 m), peaks, fir forest |
| 4 | Medeu & Shymbulak | 0:46–1:02 | Medeu (1691 m), split screen with an animated Medeu → Shymbulak (2260 m) cable-car route |
| 5 | Kok Tobe | 1:02–1:17 | Kok Tobe viewpoint, sunset, animated city map, «КЕШКІ АЛМАТЫ» |
| 6 | Culture | 1:17–1:31 | Panfilov Park, Ascension Cathedral («1907»), pedestrian street |
| 7 | Ending | 1:31–1:46 | Dusk, slow pull-back, closing title «АЛМАТЫ — ЖҮРЕКТЕ ҚАЛАТЫН ҚАЛА.», fade out |

- **Voice:** Microsoft neural voice `kk-KZ-DauletNeural` (young Kazakh male), natural pace
  (−5 %), slightly lowered pitch. Each sentence is synthesised separately; scenes stretch to
  fit the narration, the voice is never sped up.
- **Subtitles:** generated from the voice's own word timings, so they are exactly in sync;
  1–2 lines, words light up as they are spoken, place names and key words in gold, kept
  inside the TikTok/Reels safe area.
- **Music & sound:** an original score (pads, piano, strings, soft percussion) and sound
  design (whooshes, impacts, wind, city, birds, crickets), all synthesised in
  `scripts/audio.py` — no samples, nothing copyrighted. Music ducks about 6 dB under the
  voice; the final mix is normalised to −14 LUFS.
- **Footage:** 17 slots, 4–7 s each (the split-screen and closing shots run longer). Until a real
  clip is added, each slot shows an animated 2D stand-in. See [`footage/README.md`](footage/README.md)
  for what each slot needs.

## Rebuild

Requires Node 22+, Python 3 with `numpy scipy edge-tts`, and FFmpeg.

```bash
npm install
npm run voiceover   # Kazakh narration + word timings  -> assets/audio/voiceover.wav, data/timeline.json
npm run build       # composition                       -> index.html (+ data/cuts.json)
npm run audio       # score + sound design             -> assets/audio/music.wav, fx.wav
npm run check       # HyperFrames lint
npm run render      # renders/almaty-raw.mp4 -> loudness-normalised renders/almaty-kk.mp4
```

Edit the narration in `data/script.json`, the footage slots in `data/shots.json`, the look in
`assets/film.css`, and the animation in `assets/film.js` / `assets/illustrations.js`.
