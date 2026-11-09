# Қазақстан. Тәуелсіздік жолы — 130-second animated documentary

A 2D documentary animation about Kazakhstan with Kazakh narration, Kazakh subtitles,
and an orchestral score with dombra. Everything (picture, music, mix) is generated from
code in this repository, so it can be edited and rebuilt.

**Final video:** `output/kazakhstan_documentary.mp4` (1920×1080, 30 fps, 130 s, AAC stereo, −14 LUFS)

## Structure (8 chapters, 130 s)

| # | Time | Chapter | Picture |
|---|------|---------|---------|
| 1 | 0–14 s | Ұлы дала — emotional introduction | Dawn over the steppe and mountains, galloping herd, eagle, title |
| 2 | 14–30 s | Тәуелсіздік — independence, 16 Dec 1991 | Snowy night, date medallion, sunrise with 32-ray sun, people raising their arms |
| 3 | 30–46 s | Астана | "1997" over empty steppe, the city rises on the Yesil (Baiterek, Ak Orda, Khan Shatyr, Hazret Sultan, Palace of Peace), dusk lights |
| 4 | 46–64 s | Еңбек пен береке — economy | Pumpjacks & gas flare → open-pit mine → molten metal → wind turbines & power lines → wheat harvest |
| 5 | 64–80 s | Білім мен ғылым — education, science, technology | Launch from Baikonur → holographic globe, university, graduates' caps |
| 6 | 80–96 s | Спорт пен мәдениет — sport & culture | Runner in a stadium, podium with the flag → aul with yurts → dombra close-up |
| 7 | 96–112 s | Табиғат пен мұра — nature & heritage | Alatau & snow leopard, Charyn, Caspian, Burabay → Yasawi mausoleum (Turkistan), Tamgaly petroglyphs |
| 8 | 112–130 s | Мәңгілік ел — patriotic finale | Family on a hill as the flag is raised, flag close-up with eagle, closing title; full orchestra + dombra |

The full Kazakh script with English glosses is in `script/script.json`.

### Facts used (kept deliberately conservative)
- Kazakhstan proclaimed state independence on 16 December 1991.
- In 1997 the capital moved to the city on the Yesil (Ishim) river, today Astana.
- The Baikonur Cosmodrome is located in Kazakhstan.
- The Khoja Ahmed Yasawi mausoleum (Turkistan) and the Tamgaly (Таңбалы) petroglyphs are national heritage sites.
- Alatau, Charyn canyon, the Caspian Sea and Burabay are places in Kazakhstan.

No statistics, records, rankings or named achievements are claimed.

## Building

Requirements: Python 3 with `numpy`, `scipy`, `edge-tts`; Node 18+ with `playwright` (Chromium); `ffmpeg`.

```bash
python3 build/tts.py          # Kazakh narration (Microsoft neural voice kk-KZ-DauletNeural) -> build/out/vo/
python3 build/timeline.py     # trims clips, lays them on the timeline -> animation/timeline.js
python3 build/music.py        # procedural score (strings, horns, choir, timpani, dombra) -> build/out/music.wav
python3 build/mix.py          # narration + ducked score, loudness-normalised -> output/documentary_audio.*
node build/render.js 4 30     # renders frames in headless Chromium and muxes -> output/kazakhstan_documentary.mp4
```

Preview interactively by opening `animation/index.html` in a browser (click to play/pause with the audio, drag the bar to scrub).
`node build/preview.js <dir> 12.5 40 ...` renders stills at given timestamps.

### Editing
- Text and timing: edit `script/script.json`, then re-run `tts.py --force`, `timeline.py`, `mix.py`, `render.js`.
- Picture: each chapter is one function in `animation/js/scene*.js`; shared drawing helpers and the palette live in `animation/js/core.js`.
- Music: arrangement per chapter is in `build()` in `build/music.py` (one bar = 2 s, so chapters start on bar lines).

Fonts: Cormorant Garamond and Montserrat (SIL Open Font License), vendored in `animation/fonts/`.
