# ПОСЛЕДНИЙ ДЕНЬ — Эпизод 1 / THE LAST DAY — Episode 1

A 60-second vertical (1080×1920, 30 fps) zombie-horror short for TikTok, built as a
[HyperFrames](https://hyperframes.heygen.com) project. Russian narration, Russian subtitles,
original score and sound design on separate layers. Ends on a hard cut to black.

- Render: `renders/the-last-day-ep1-tiktok.mp4` (H.264 + AAC, ~33 MB, -14.8 LUFS). The full-quality master (~119 MB) is too big for GitHub; rebuild it with the command below.
- Preview / edit: `npx hyperframes preview` (Studio), or the HyperFrames desktop app
- Re-render: `npm run render` (or `npx hyperframes render -q delivery -o renders/the-last-day-ep1-master.mp4`)

## Story and shot list

| Time | Scene (composition) | Shots |
| --- | --- | --- |
| 0:00–0:05 | `s1` street attack (hook) | wide wet street, a woman runs at camera, shapes shamble behind → side: a zombie lunges, impact flash → its face snaps into lens → crane-high wide, title card «ПОСЛЕДНИЙ ДЕНЬ / ЭПИЗОД 1» |
| 0:05–0:12 | `s2` emergency broadcast | the TV glows in the dark flat, hero asleep on the couch → push into the broadcast: banner, city map bleeding red, ticker → «НЕ ВЫХОДИТЕ ИЗ ДОМА», signal breaks to static |
| 0:12–0:22 | `s3` wake / window | extreme close-up: his eye opens → from behind, he walks to the window → POV through the blinds: smoke, fires, searchlight → looking down: the street is full of them |
| 0:22–0:32 | `s4` the door | hallway to the steel door, a shadow stops under it, soft knocks → over his shoulder → the door is pounded, jumps, dust falls → close-up: his hand slides the bolt home |
| 0:32–0:45 | `s5` knife / hide | the knife comes out of the block → light switch, the lamp dies → floor level behind the island, knife up → high wide of the dark flat; the pounding stops, the shadow walks away |
| 0:45–0:55 | `s6` the message | phone buzzes on the floor → messenger: «Не открывай дверь.» … «Я уже внутри.» → his face in the phone light |
| 0:55–1:00 | `s7` the reveal | behind him: deep in the room someone has been standing there all along → lightning: it is right behind him → **hard cut to black** at 58.95 s |

Continuity: one hero (≈22, short messy hair, charcoal hoodie with the hood down, pale
drawstrings), one apartment (window with half-open blinds, grey steel door with bolt, chain and
peephole, dark couch, TV on a low cabinet, kitchen island with a knife block). These are drawn by
the same functions in every shot (`assets/lib/film-rig.js`, `assets/lib/film-apartment.js`).

## Narration (Russian, as spoken)

| Start | Line | Subtitle highlights (red) |
| --- | --- | --- |
| 3.10 | В ту ночь город умер. | умер |
| 5.50 | По всем каналам — экстренный выпуск. | |
| 8.15 | Неизвестный вирус. | вирус |
| 9.70 | Заражённые нападают на людей. | Заражённые, нападают |
| 12.70 | Я проснулся от тишины. | |
| 15.00 | Подошёл к окну… | |
| 16.30 | и понял: города больше нет. | нет |
| 19.00 | Только дым… сирены… И они. | они |
| 23.40 | А потом в дверь постучали. | постучали |
| 25.70 | Сначала тихо. | |
| 27.30 | Потом — так, будто её хотели выбить. | выбить |
| 30.00 | Я закрыл дверь на засов. | |
| 32.90 | Я схватил нож. | нож |
| 34.25 | Выключил свет. | |
| 36.20 | Спрятался в темноте. И ждал. | темноте |
| 41.00 | Стук прекратился. | |
| 43.00 | И стало только страшнее. | страшнее |
| 45.90 | Телефон завибрировал. | |
| 48.00 | Неизвестный номер. | Неизвестный |
| 50.05 | «Не открывай дверь.» | дверь |
| 52.35 | «Я уже внутри.» | внутри |
| 55.50 | Я медленно обернулся… | обернулся |

## Layers

| Layer | Where |
| --- | --- |
| Picture (7 scenes) | `compositions/s1.html` … `s7.html`; each draws `assets/scenes/sN.js` on a canvas from scene time |
| Subtitles | `compositions/captions.html` (one captions track; white Montserrat Black, black shadow, horror words in red, inside the TikTok safe band) |
| Narration | `assets/audio/vo/l01.wav` … `l22.wav`, one `<audio>` per line |
| Music | `assets/audio/music/score.wav` (original drone/strings score, cut at the hard cut) |
| Ambience | `assets/audio/sfx/amb_city.wav`, `amb_room.wav` |
| Sound effects | `assets/audio/sfx/*.wav` (synthesised: screams, growls, sirens, TV static, emergency tone, knocks, door pounding, bolt, knife, phone buzz, heartbeat, breathing, footsteps, creaks, sub hits, string sting) + a few Pixabay-licensed hits from the HyperFrames skill bundle (`CREDITS.md`) |

## Rebuilding the media

```bash
# voice: Piper neural TTS, Russian male voice "ruslan" (offline)
#   model: https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ru_RU-ruslan-medium.tar.bz2
pip install piper-tts scipy
python3 tools/make_vo.py /path/to/ru_RU-ruslan-medium.onnx
python3 tools/make_audio.py      # score + every sound effect
python3 tools/build_project.py   # index.html, compositions/*.html (timings, subtitles, audio placement)
npx hyperframes check
```

`tools/build_project.py` holds the master timing tables (narration starts, subtitle groups,
every SFX placement). Editing the HTML in Studio also works; re-running the builder overwrites
those edits.

## Notes

- The picture is procedural (canvas-drawn) cinematic imagery — silhouettes, volumetric fog, light
  cones, rain, film grain, blue-grey grade — not photographic footage. Each scene is its own
  composition, so any scene can be swapped for live-action or AI-generated video by dropping a
  `<video>` into that slot.
- The narration voice is Piper `ru_RU-ruslan-medium` (neural, natural Russian). Its pronunciation
  was checked by transcribing every line back with Whisper; stress on «го́рода» is forced with a
  stress mark. For a human-actor quality read, replace `assets/audio/vo/lXX.wav` with recorded
  takes of the same lines — timings and subtitles stay valid if each take is a similar length.
