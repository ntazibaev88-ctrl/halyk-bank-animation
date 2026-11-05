# АЛМАТЫ vs АСТАНА — два города, два мира

80-секундный вертикальный (1080×1920, 30 fps) документальный motion-ролик. Собран на **HyperFrames** (HTML → MP4) + **GSAP** (таймлайны), графика — процедурная 2D (canvas/SVG), закадровый голос — RHVoice (муж. «Артемий»), музыка и SFX — синтезированы кодом.

## Структура
| Путь | Назначение |
|---|---|
| `index.html` | мастер-таймлайн: сцены, субтитры, переходы, аудио |
| `compositions/*.html` | по одной сцене: opening, map, almaty, astana, climate, lifestyle, board, finale + subtitles, transitions |
| `lib/kit.js` | ядро графики: шум, горы, небо, здания, камера-параллакс, grade (виньетка, зерно) |
| `lib/shots-*.js`, `lib/landmarks.js`, `lib/aerial.js` | шоты Алматы/Астаны, Байтерек, Хан Шатыр, аэросъёмка |
| `lib/ui.js`, `lib/hud.js`, `styles/*.css` | подписи, HUD, мини-карта, дизайн-токены |
| `tools/script.json`, `make_vo.py` | текст дикторского сценария → озвучка + `timings.json` |
| `tools/make_subs.py` | субтитры (пофразово, пословная подсветка) из таймингов |
| `tools/make_music.py` | саундтрек + переходы, приглушение под голосом |
| `tools/make_map.mjs` | контур Казахстана из Natural Earth (`world-atlas`) |

## Сборка
```bash
npm i
python3 tools/make_vo.py 90 && python3 tools/make_subs.py && python3 tools/make_music.py
npx hyperframes check
npx hyperframes render -o renders/almaty-vs-astana.mp4 -w 4 -q high
```
(нужны ffmpeg, `rhvoice rhvoice-russian`, Python: numpy, scipy.)
