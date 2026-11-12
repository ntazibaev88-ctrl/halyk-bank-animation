# ИЛОН МАСК — ЧЕЛОВЕК, КОТОРЫЙ ХОЧЕТ ИЗМЕНИТЬ МИР

Vertical (9:16) cinematic documentary short in Russian, built with **Remotion** (React video) and a small
Python toolchain for voice, footage and sound.

**Output:** `out/elon-musk-documentary.mp4` (H.264, 1080×1920, 30 fps, AAC 48 kHz)

## Structure

| Scene | On-screen text | Footage (all real, NASA public domain unless marked) |
|---|---|---|
| 1 Hook | ЧЕЛОВЕК, КОТОРЫЙ ХОЧЕТ ИЗМЕНИТЬ МИР / ИЛОН МАСК | Musk at LC-39A (2019), Falcon Heavy liftoff, Tesla Model X, supercomputer boards, Falcon 9 booster landing |
| 2 Childhood | 12 ЛЕТ — ПЕРВЫЙ ПРОЕКТ | Earth from ISS + *illustrative* retro-computer reconstruction (labelled ИЛЛЮСТРАЦИЯ) |
| 3 PayPal | PAYPAL — ПЕРВЫЙ БОЛЬШОЙ УСПЕХ | NASA Ames (Silicon Valley), *illustrative* 90s web payment, server racks + payment-network graphic |
| 4 SpaceX | SPACEX — ПУТЬ К МАРСУ | Falcon 9 on pad, Musk with Demo-2 crew (2020), Falcon Heavy, booster landing, Starship seen from ISS, Earth→Mars graphic |
| 5 Tesla | TESLA — БУДУЩЕЕ АВТОМОБИЛЕЙ | Tesla Model X carrying the Demo-2 astronauts (NASA 2020), battery graphic |
| 6 AI | AI. NEURALINK. TECHNOLOGIES. | NASA Ames supercomputer, neural-network / brain⇄computer graphic |
| 7 Controversy | ГЕНИЙ ИЛИ ПРОВОКАТОР? | Musk at NASA press conference (2020), generic social-feed graphic (no real posts) |
| 8 Ending | ОН ИЗМЕНЯЕТ БУДУЩЕЕ. НО КАКОЙ БУДЕТ ЕГО СЛЕДУЮЩАЯ ЦЕЛЬ? + CTA | Falcon Heavy climbing, Earth from ISS, Musk silhouette at the pad, Falcon 9 at night |

Every scene length is driven by the narration (never sped up to fit). Full sourcing in [CREDITS.md](CREDITS.md).

## Pipeline

```bash
npm install
pip install edge-tts numpy scipy requests
./scripts/make.sh
```

1. `scripts/gen_voice.py` — Russian male neural voice (`ru-RU-DmitryNeural`), one file per sentence, word timings.
2. `scripts/cut_segments.py` — cuts source segments straight from the NASA library (`footage/segments.json`).
3. `scripts/build_timeline.py` — shot plan + narration ⇒ `src/timeline.json` (shots, transitions, titles,
   subtitles aligned to word timings, graphics, sound-design cues).
4. `scripts/prep_shots.py` — 2:3 crop around the subject, single colour grade, 1280×1920 clips.
5. `scripts/gen_audio.py` — original score (pads, pulse, ostinato), impacts / whooshes / rocket rumble /
   risers, voice polish, side-chain ducking, loudness normalisation to −14 LUFS.
6. `npx remotion render …` — final H.264 render.
7. `scripts/qa.py` — format, duration, black/frozen-frame detection, loudness, contact sheet.

`npm run studio` opens the Remotion Studio for frame-accurate preview.

## Fact notes

- Born 28 June 1971, Pretoria, South Africa. Wrote and sold the game *Blastar* (~$500) at 12.
- PayPal: grew out of X.com (1999) merging with Confinity; eBay bought PayPal in 2002.
- SpaceX founded 2002. Tesla: Musk led the 2004 funding round (early investor/chairman), CEO since 2008 —
  he is **not** described as Tesla's founder.
- Mars missions are presented as a goal/ambition, not an achievement.
