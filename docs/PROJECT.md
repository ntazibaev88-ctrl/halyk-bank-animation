# Animation project structure & scene-by-scene timing

**Canvas:** 1080×1920 (9:16) · 30 fps · 1800 frames · H.264 yuv420p · AAC 48 kHz stereo.
**Palette:** Halyk green `#00A651`, bright green `#12C06A`, mint `#8CF0B5`, dark green `#0A3B2A` / `#06241A`, white; warm sunrise accents in S1, sepia grade in S2.
**Type:** Inter (Cyrillic), 800–900 weight captions on dark-green pills, kept inside the central safe area (y ≈ 150–1750, x ≈ 90–990; no text in the bottom ~170 px / platform UI zone).
**Characters:** one flat-vector rig (`person()` in `lib.js`) with walk cycle, blinking, expressive brows/mouth; the same skin/hair/clothing families recur across scenes (young man with green backpack S1→S5→S6, woman with long hair S4 etc.).
**Transitions:** green circular iris wipe with glow ring, 0.9 s centred on each scene boundary (scene B is revealed *inside* the circle while scene A keeps playing).

| # | Time | Clip | Visual beats | On-screen text (RU) |
|---|---|---|---|---|
| 1 | 0–7 | The Hook | Flash-open on a rising sun; crane-down reveal as skyline grows; Baiterek-inspired landmark; cars, pedestrians; young man raises phone (2.4 s), screen glows green, green wave sweeps the city (2.7 s); exponential zoom into the phone (4.3–7 s) flooding to green | «Финансы меняют наш мир» (1.2–3.9 s) |
| 2 | 7–15 | The History | Iris into sepia 1923 street: savings-office façade, lamp posts, vintage pedestrians walk in and enter the door; wall calendar pops (3.7 s) and flips 1923→1941→1965→1991→2008→2026 (4.4–6.9 s); sepia grade melts to full colour | «История Halyk Bank начинается в 1923 году» |
| 3 | 15–23 | Evolution | A green scan-line rebuilds the old façade into a modern glass bank (0.5–3.0 s); it collapses into a medallion that cycles paper documents → teller counter → bank card → computer → smartphone with ring pulses and a progress timeline; the phone grows into the next scene | «Более 100 лет развития» |
| 4 | 23–33 | Digital Banking | Floating phone with generic illustrative UI; six icons pop in with flowing lines: cards, transfers, QR payments, utility payments, online banking, digital shopping (0.8–3 s); icons collapse into the phone (5.5 s); a woman pays contactless at a terminal, success badge «Оплачено», coin burst (7.1–8.9 s) | «Банк в твоём смартфоне» |
| 5 | 33–43 | People & Everyday Life | Three cards with green connector lines & flowing pulses: student pays for coffee; family plans a purchase (house/car thought bubble); shop owner serves a customer («ОТКРЫТО» sign) | «Для жизни. Для бизнеса. Для будущего.» (line per story) |
| 6 | 43–53 | Kazakhstan | Stylised map, glowing city nodes (Астана, Алматы, Шымкент, Караганда, Актобе, Атырау, Актау, Павлодар, Костанай), animated routes from Astana; camera drifts up and out to reveal the whole country; five people of different generations/professions appear | «Технологии. Доверие. Возможности.» (line per word) |
| 7 | 53–60 | Grand Finale | 560 green/white particles spiral inward and form a ring around the reserved logo zone; flash-pulse; wordmark text; sparkles; fade to deep green | «HALYK BANK» / «Вместе с людьми.» |

Opening 3 seconds: white-gold flash, sunburst rays, crane-down camera, skyline growing building-by-building with a staggered rise, dust particles.

## Where to add the official logo
Logo zone: centre (540, 800), 520×300 px, safe margin ~60 px. Example:
```bash
ffmpeg -i output/halyk_bank_60s_1080x1920_no-vo.mp4 -i halyk_logo.png \
  -filter_complex "[1]scale=-1:240[l];[0][l]overlay=x=(W-w)/2:y=800-h/2:enable='between(t,56.2,60)':format=auto" \
  -c:a copy out_with_logo.mp4
```
(Fade the logo in with `fade=in:st=56.2:d=0.6:alpha=1` on `[l]` if desired. Logo reveal is timed after the particle ring completes at ≈ 56.4 s.)

## Compliance checklist
- No invented statistics, awards, endorsements or app screens (UI is generic; "1923" and "Более 100 лет" come from the brief).
- Historic sign «СБЕРЕГАТЕЛЬНАЯ КАССА» is a generic period illustration, not a real facsimile.
- Map is a stylised approximation, not a cartographic source.
