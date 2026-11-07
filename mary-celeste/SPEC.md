# SPEC — The Mary Celeste

GOAL:    the viewer ends on an open question — why would ten people leave an intact ship mid-ocean? — and wants the next story.
OUTPUT:  HyperFrames, 1080 × 1920, 30 fps.
TIME:    84.96 s × 30 = 2549 frames. Voice is the clock (no beat grid). Voice 2.6 → 78.2 s.

LOOK
- Ground: deep navy `#0a1622` → abyss `#04070b`; charcoal for night; aged paper (`paper.jpg`, darkened 0.6) for human/document beats; dark wood desk for the investigation.
- Ink: `#f3f5f7`. Accent red `#e0392f` only for loss/absence (10, ЛЮДИ — НЕТ, ИСЧЕЗЛА, ОТСУТСТВУЮТ, the question). Gold `#d2ad62` only for historical facts (dates, names, the route, documented numbers).
- Type: display Oswald 600–700 uppercase (titles 88–236 px); Inter 600–800 for labels and subtitles (subtitles 56 px bold, white, dark shadow, 2 lines max); Playfair Display for names and documents; JetBrains Mono for coordinates. Nothing read under 28 px.
- Light: storm key from upper left (lightning), moon rim in the final scene, lamp pool on the desk. Film grain 16 % overlay at 24 fps cadence, vignette 55 % at the corners.

OBJECTS
- Brigantine (Mary Celeste's rig): square-rigged foremast, gaff mainsail, jibs on a bowsprit, dark hull with boot-top stripe — one SVG reused at every distance.
- Sea: 7–8 parallax wave layers with sharp crests and foam; the hull rides a mid layer.
- People: Victorian cameo profiles (generic, labelled reconstruction), then 10 busts (family gold, crew dark).
- Evidence: deck plan with the yawl's empty place, cargo card, instruments card, logbook card, crew list, chart of the Azores with the discovery X.

MOTION
- Arrivals expo.out / power3.out; camera moves power2/3.inOut; exits power2.in, 40–50 % shorter.
- Titles: slam (scale 1.35 → 1, blur 16 → 0, 0.3 s), per-word blur-in (0.08–0.14 s stagger), per-letter for names, wipe for labels. Landed titles hold still.
- Continuous motion lives in the world (waves, fog, rain, dust, lamp swing, magnifier), never on titles.

SHOTS (film seconds)
1. 0.0–12.7 Hook & storm — sonar finds the ship (0.1), push + red sweep + "10 ЧЕЛОВЕК ИСЧЕЗЛИ." (1.0), impact + lightning + "КОРАБЛЬ ОСТАЛСЯ. ЛЮДИ — НЕТ." (2.0), close-up callouts "КОРПУС ЦЕЛ / ГРУЗ НА МЕСТЕ" on the words, deck scan with 10 → 0 counter. Out: fog flood.
2. 12.7–22.6 Voyage — Atlantic chart, "ДЕКАБРЬ 1872", dive to New York (7 Nov 1872), ship name, route draws to Genoa while live coordinates update, pull back to the whole route. Out: whip into paper.
3. 22.6–29.5 People — captain cameo + name, wife and daughter join, pull back to 10 figures counting 3 → 10. Out: whip.
4. 29.5–34.7 Discovery — Dei Gratia in the foreground, pan through fog, radar lock on the Mary Celeste, "4 ДЕКАБРЯ 1872 ГОДА", 38°20′ N · 17°15′ W. Out: zoom through.
5. 34.7–41.5 Empty ship — set sails from the deck, cabin with food and water (six months), porthole beam and dust, "НИ ОДНОГО ЧЕЛОВЕКА." Out: dip.
6. 41.5–47.1 Evidence — deck plan, yawl outline, "ИСЧЕЗЛА" stamp, cargo stayed, instruments missing; "ГРУЗ ОСТАЛСЯ. ЭКИПАЖ ИСЧЕЗ." on "Что случилось?". Out: blur swap.
7. 47.1–62.2 Theories — storm (lightning, heeling ship), abandon-ship beat (yawl on a line), alcohol fumes (hold section, vapour, 9 empty barrels), pumps (water rising, pump crossed out), recap "ТРИ ВЕРСИИ. НИ ОДНОГО ТОЧНОГО ОТВЕТА." Out: drop.
8. 62.2–72.3 Investigation — desk pull-back from the chart's X, documents slide in, red strings, "ПРОПАЛИ БЕЗ ВЕСТИ" stamp, 1872 → 2026 timeline, "154 лет без ответа", "ТАЙНА ОСТАЛАСЬ НЕРАЗГАДАННОЙ." Out: dark.
9. 72.3–79.1 Final question — iris opens on a night ocean, aerial pull-back, fog closes, "ЧТО НА САМОМ ДЕЛЕ ПРОИЗОШЛО?". Riser into the ending hit.
10. 79.1–85.0 Ending — emblem draws, MARY CELESTE, "ИСТОРИЯ НЕ ЗАБЫВАЕТ ТАЙНЫ.", CTA, 1.1 s fade to black with audio fades.

SOUND
- Voice −16 LUFS. Music: D-minor pad score, braams on the hook hits, "Что случилось?" and the ending, bell motif on the voyage/discovery/question/ending, low pulse from the evidence through the investigation, tension strings in the theories; ducked to 0.36 under speech, 0.85 in gaps. Ambience follows the scene (storm, fog, hull-muffled sea, quiet desk, night sea).

BANNED
- Supernatural creatures, attacks or invented events shown as fact; identifiable "portraits"; photos presented as authentic.
- Titles that drift after landing; every element fading up; glow orbs; generic three-card KPI rows.
- Text in the bottom 590 px or under the right-hand action rail.

QA
- 0.05 s: ship faintly visible in the dark with a sonar ring (thumbnail is not a black frame).
- 2.4 s: both hook lines readable; 8.6 s: two callouts; 11.2 s: counter.
- Each scene's first and middle frames; every caption inside 1120–1320 px; final frame black, audio silent.
