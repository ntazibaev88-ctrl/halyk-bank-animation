# Review notes — «Астана — болашақтың қаласы»

## Creative calls

- Style: the chosen "Option 2 — premium modern 2D animation". Flat vector illustration, navy / sky blue / white / gold with turquoise and warm orange accents; every scene has its own palette and composition (sunrise river, navy history board, daylight architecture pan, top-down city map, business district, embankment, teal future city, gold night finale).
- The narrator is the clock: scene lengths follow the recorded voice (136 s total instead of the nominal 10/20/…/10 split), and on-screen events are anchored to spoken words (`assets/js/timing.js`).
- Seams are caused by something on screen: sunrise flood → gold curtain, rising night-blue, camera whip, dive into the map, colour bands, nightfall, tilt to the stars.
- Scene 8 keeps the requested copy but stacks it: «АСТАНА —» / «ТӘУЕЛСІЗДІКТІҢ БЕЛГІСІ» / «БОЛАШАҚҚА БАСТАР ҚАЛА».
- Landmarks are stylised drawings, not traced from photographs.

## What was measured

- `hyperframes check`: 0 errors, 0 warnings (lint, runtime, layout, contrast, craft, audio).
- Frames inspected on contact sheets at ~60 timestamps across all scenes and seams.
- Final file: 1080×1920, 30 fps, 4080 frames, 136.0 s, H.264 + AAC stereo.
- Audio: integrated loudness −16.0 LUFS, peak −1.0 dBFS (ffmpeg `ebur128`); the music-only ending sits around −22 LUFS. **The sound was measured, not heard** — nobody has listened to the narration or the score.

## What nobody checked

- Pronunciation of the synthetic narrator (Microsoft `kk-KZ-DauletNeural`). «EXPO» is fed to the voice as «ЭКСПО» so it is not spelled out; the reading of «1997» was not auditioned.
- The score is synthesised in code (`tools/music.py`); its musical quality is unverified by ear.
- The statistics could not be opened on stat.gov.kz from the build environment (host not reachable); they come from search results quoting the Bureau of National Statistics. Re-check before publishing.

## Weakest shots / next steps

- Scene 3 gives Хан Шатыр, EXPO, the Palace of Peace and Hazret Sultan about 1.6 s each — the narration leaves no more room.
- Scene 2's timeline rows 2019 and 2022 arrive after the narrator has moved on to "уақыт өте келе"; they are visual-only facts.
- A human voice actor and a licensed orchestral track would lift the film most.
