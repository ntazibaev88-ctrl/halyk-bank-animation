# АЛМАТЫ vs АСТАНА — v2 (107 с, narration-driven timeline)

Новая версия; v1 (`../almaty-astana`) сохранена без изменений.

Что изменилось: голос синтезируется **по фразам** (RHVoice `aleksandr-hq`, SSML, ударения `+`), паузы расставлены явно, длительность каждой сцены вычисляется из реальной длины озвучки (`tools/make_vo2.py` → `timeline.json`). Шоты привязаны к фразам диктора (`lib/tl.js`, `compositions/*.html`). Добавлены шоты Медеу, ЭКСПО (Нур Алем), набережная Ишима, башни; bloom-грейдинг; живой фон инфографики.

Сборка: `python3 tools/make_vo2.py 98 && python3 tools/make_music.py && python3 tools/build_index.py && npx hyperframes render -o renders/almaty-vs-astana-v2.mp4 -w 4 -q high`

Реального видео в проекте нет: все кадры — процедурная графика (песочница не имеет доступа к стоковым сайтам).
