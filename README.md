# FACTUM · Шымкент — город, которому более 2200 лет

Вертикальный (9:16, 1080×1920, 30 fps) документальный ролик на ~105 с. Remotion (React) + FFmpeg.

## Статус

| Часть | Статус |
|---|---|
| Проект, таймлайн, 10 сцен / 30 кадров | ✅ готово |
| Субтитры (RU, 2 строки, золотые акценты, safe-zone, без наложений) | ✅ готово, тайминг пересчитывается по реальному VO |
| Моушн-графика: титры сцен, счётчик 2200, схема Шёлкового пути, №3, логотип FACTUM | ✅ готово |
| Микс: музыка с авто-дакингом под голос, loudnorm −14 LUFS | ✅ готово |
| **Реальный футаж Шымкента** (26 клипов) | ❌ нужно добавить в `footage/` |
| **Закадровый голос** (10 файлов) | ❌ нужно добавить в `audio/vo/` |
| Музыка | ⚠ только синтетический placeholder; положить лицензионный трек в `audio/music/` |

Футаж и голос не подделаны: боевой рендер (`render:final`) **отказывается запускаться**, пока чего-то не хватает.
Точный список — `ASSETS_CHECKLIST.md`.

## Структура

```
data/timeline.json   сцены, дикторский текст, титры, кадры (редактировать здесь)
footage/             sSS_NN_*.mp4  (имя начинается с ID кадра, напр. s03_02_towers.mp4)
audio/vo/            scene_01.wav … scene_10.wav  (+ необязательно scene_XX.cues.json)
audio/music/         один трек ≥105 с
src/components/      Subtitles, SceneTitle, ShotLayer, Graphics, Grade, BrandBug
src/Factum.tsx       сборка: слои, звук, дакинг
scripts/             build-project, render.sh, verify, make-placeholder-music
```

## Команды

```bash
npm install
npm run check            # сканирует assets, пересобирает субтитры, пишет ASSETS_CHECKLIST.md
npm run studio           # превью в Remotion Studio
npm run render:preview   # out/FACTUM_SHYMKENT_PREVIEW_NO_FOOTAGE.mp4 (заглушки вместо футажа, с подписью)
npm run render:final     # FACTUM_SHYMKENT_105SEC.mp4 — только если все ассеты на месте
node scripts/verify.mjs FACTUM_SHYMKENT_105SEC.mp4
```

Шрифты (Montserrat, Playfair Display, OFL) лежат в `public/fonts`. Если Chromium лежит не в `/opt/pw-browsers`, задайте `CHROME_PATH`.

## Как довести до финала

1. Положить 26 клипов в `footage/` (см. чек-лист; ≥ длина кадра + 0.9 с, ≥1080 по короткой стороне).
2. Записать/сгенерировать VO по сценам. Субтитры автоматически растянутся по длительности файла. Для точной синхронизации по словам — `audio/vo/scene_XX.cues.json` (`[{"start":0.0,"end":1.8}, …]`, секунды от начала файла, по числу кусков текста, см. `src/generated/project.json`).
3. Положить музыку в `audio/music/` и удалить placeholder.
4. `npm run render:final`.

## Известные риски

- Плотность текста в сценах 1, 2, 6 — 18–19 зн/с (спокойный диктор ≈ 15–16). Либо сократить фразы, либо удлинить сцены на 1–2 с (общая длина уйдёт за 105 с).
- Подпись «Шымқала» взята из ТЗ; перед публикацией сверить название и внешний вид комплекса на реальных кадрах.
