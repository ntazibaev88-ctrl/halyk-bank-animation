# От мойщика посуды до революции ИИ — документальный ролик о Дженсене Хуанге

Вертикальный (9:16, 1080×1920, 30 fps, H.264) документальный ролик на русском языке для TikTok / Instagram Reels,
собранный в [Remotion](https://www.remotion.dev/).

**Готовое видео:** `out/jensen-huang-documentary.mp4`

## Как устроено

| Шаг | Файл |
|---|---|
| Текст закадра (разметка: `*слово*` — подсветка зелёным, `[показ\|произношение]`) | `scripts/narration.json` |
| Озвучка (edge-tts, `ru-RU-DmitryNeural`, естественная скорость) + тайминги слов | `scripts/tts.py` |
| Раскладка фраз по таймлайну с паузами | `scripts/build_timeline.py` → `src/timeline.json` |
| Оригинальная музыка, SFX, эмбиент, дакинг, громкость −14 LUFS | `scripts/audio.py` → `public/audio/mix.wav` |
| Монтажный лист (38 планов, переходы, камера, подписи источников) | `src/shots.tsx` |
| Субтитры по словам, титры, оверлеи (зерно, виньетка, блики, HUD) | `src/components/*` |
| Моушн-графика: глобус, сооснователи, салфетка-реконструкция, 3D-эволюция, нейросеть | `src/mg/*` |
| Поиск/загрузка/кадрирование материалов Wikimedia Commons | `scripts/media/*` |

```bash
npm install
python3 scripts/tts.py && python3 scripts/build_timeline.py && python3 scripts/audio.py
npm run render   # → out/jensen-huang-documentary.mp4
```

Исходные материалы (`public/media`) — фрагменты видео и фото с Wikimedia Commons по лицензиям CC BY / CC0 / Public Domain;
полный список авторов и ссылок — в [CREDITS.md](CREDITS.md).
