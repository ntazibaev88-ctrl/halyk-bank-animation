# Review — «Твой мозг тебе врёт»

## Creative calls

- **One storyline, six visual worlds.** Each scene has its own look so no two shots repeat: a close-up with the brain looming (S1), a synthwave grid floor → maze → calendar (S2), a top-down night bed (S3), a dark "inside the edit" world (camcorder, street spotlight, monster/coat, puzzle, CRT) (S4), a birthday party split down the middle (S5), dawn on a hill (S6).
- **The brain is a character, not a diagram.** Sinister violet with glowing slit eyes until the final beat, where a sparkle poof turns it into a small pink sidekick that waves and high-fives Tim.
- **Visual gags carry the claims:** puppet strings + an AUTOPILOT lever (automatic decisions), a maze shortcut, a stamp printing identical days (templates), a remote with «ПОВТОР ×99» while the clock runs to 03:07 (rumination), REC crossed out → «МОНТАЖ!», a monster that is a coat (interpretation), made-up puzzle pieces (filling gaps), a WANTED poster for the «хитрый обманщик».
- **Timing follows the voice.** Scene boundaries are set by the narration (lead-in + a held reaction beat), not by the brief's fixed windows; scenes 4–6 start 4–9 s earlier than the brief, the total is exactly 90.0 s, and no stretch is longer than ~3.5 s without a line or a new visual.

## Measured vs. looked at

- `hyperframes check`: passes (0 errors). Warnings kept on purpose: two scene files over 300 lines (one file per scene keeps Studio editing simple); canvases touching the frame edge (full-bleed by design).
- Snapshots of every scene, `snapshot --review` (scene starts/middles, the 5 cuts, phone width): all reviewed; fixed a missing flash on the S1→S2 cut, a non-clearing canvas in S4, labels colliding with the subtitle band, a speech bubble overflowing the frame, a floating character, an easing curve that leaked a frame early.
- **Narration:** stress checked word by word from espeak-ng phonemes (fixed «уже», «по-разному», spelled-out prepositions); the whole track was back-transcribed with a Russian ASR model and matches the script except unstressed endings that sound identical in speech. Not heard by a human.
- **Sound:** measured, not heard. Final mix −15.0 LUFS integrated, −1.3 dBTP (the render came out at −17 LUFS; the delivered MP4 got +2 dB on the audio with the picture stream copied, and the same +2 dB is set in `index.html` volumes). Narration −16.5 LUFS before that gain; music bed ~14 dB under it and ducked further while the voice speaks; SFX peaks land one frame after their picture. Music and effects are synthesized in code because no music/SFX source was reachable from this machine.

- **Render:** 1080×1920, 30 fps, H.264 + AAC, 90.00 s, 56 MB (capped at 5 Mbit/s for upload and git).

## Weakest parts / next steps

1. **The voice** is good TTS, not a voice actor. Swapping in a recorded narrator is the biggest quality upgrade: replace `video/assets/audio/voice.wav`, run `scripts/asr_check.py` to re-derive word timings, then `npm run captions`.
2. **The music** is a functional synthesized pad/arp bed; a licensed cinematic track would lift the whole film.
3. S4's camcorder shot is the plainest frame of the film; it would benefit from a background (a desk, a lens flare) and a stronger tape gag.
4. Character acting is pose-to-pose with eased keys; a few more in-between "takes" (anticipation before head turns) would add polish.
