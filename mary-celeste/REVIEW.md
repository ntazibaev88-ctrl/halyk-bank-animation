# REVIEW — render verification report

Final file: `renders/mary-celeste.mp4` (rendered with HyperFrames 0.8.190, audio mastered by `tools/master.sh`).

## Measured on the final MP4 (`tools/verify.sh`)

| Check | Result |
|---|---|
| Resolution / aspect | 1080 × 1920, 9:16 ✔ |
| Frame rate / frames | 30 fps constant, 2549 frames ✔ |
| Duration | 85.0 s (target 75–85 s) ✔ |
| Video | H.264, ~8.3 Mbps, faststart |
| Audio | AAC 256 kb/s, 48 kHz stereo |
| Loudness | −15.1 LUFS integrated, LRA 5.1 LU, peak −1.4 dBFS (social target −16…−14) ✔ |
| Voice sync | final mix vs. voice track cross-correlation: 0 ms offset → subtitles (built from the same word timings) are in sync ✔ |
| Voice over music | ducking lane: music 0.36 under every speech region, 0.85 in gaps; average mix while speaking −17.5 dBFS RMS |
| Frozen stretches ≥ 1.5 s | none (ffmpeg freezedetect) ✔ |
| Black stretches | none before the final 1.1 s fade to black ✔ |
| `hyperframes check` | lint, runtime, layout: 0 errors ✔ |
| Russian text | narration and every caption line checked word-for-word against the voice timing by `tools/build.py`; on-screen titles proofread |

Sample frames from the rendered file: `renders/verify/contact-sheet.jpg` (28 frames, 0.05 s → 84.9 s).

## Creative calls

- The hook follows the brief literally: near-black first second with a sonar ring finding the ship (the ship is faintly visible on frame 0, so the thumbnail is not black), red radar sweep and "10 ЧЕЛОВЕК ИСЧЕЗЛИ." at 1.0 s, impact + lightning + "КОРАБЛЬ ОСТАЛСЯ. ЛЮДИ — НЕТ." at 2.0 s. Narration starts at 2.6 s.
- One illustrated brigantine (the Mary Celeste's actual rig) is reused at every distance so the ship is always recognisable; the *Dei Gratia* is the same rig, dark and out of focus in the foreground.
- Scenes are cut on the narration's sentence boundaries (`tools/scenes.py`), so storyboard lengths moved: S1 12.7 s (hook + three sentences), S4 5.2 s, S7 15.1 s (three theories plus the abandon-ship premise they share).
- Fact discipline: documented details carry the board header "Материалы дела · 1872–1873 · Задокументировано"; drawn people and the cabin are labelled "художественная реконструкция". The evidence board shows what was missing (lifeboat, sextant, chronometer) as well as what stayed, so it never implies everything aboard was untouched. No supernatural or invented events.
- The time-span graphic counts 1872 → 2026 ("154 лет без ответа") to visualise "более полутора веков".

## What was measured vs. only looked at

- Measured: format, duration, loudness, peaks, freeze/black detection, voice sync, layout/lint.
- Looked at: every scene via snapshots and the final contact sheet.
- **Not heard by a person.** The voice, score and effects were measured, not listened to. The score and most effects are synthesized in code (no music library was reachable from this environment), so they are dark ambient textures rather than an orchestral recording.

## Kept on purpose

- `line_unread` on the hook title "10 человек исчезли." (0.93 s): it is the 1-second beat the brief specifies, and the line repeats in meaning on the next title and the 10 → 0 counter.
- `duplicate_media_discovery_risk`: two `<img>` of the same ship SVG in one scene (two ships) — not media clips, no effect on render.

## Weakest moments / with more time

1. Score: replace the synthesized bed with a licensed orchestral track (HeyGen catalog or the person's own), keep the ducking lane.
2. Voice: Edge neural voice `ru-RU-DmitryNeural` at −3% rate and −6 Hz pitch. A human narrator or a cloned voice would be deeper; swap by replacing `assets/audio/voice.wav` and re-running `tools/build.py` after re-timing (`tools/tts.py` shows the pipeline).
3. The cabin interior (S5) is the simplest illustration in the film; it would gain from a second angle.
4. Stress/pronunciation of «Мэри Селеста», «Бриггс», «Генуя» was not verified by ear.
