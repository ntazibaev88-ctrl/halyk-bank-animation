# Review — «Что, если завтра исчезнет гравитация Земли?»

## Creative calls
- No narration script was supplied with the brief, so the Russian narration in `audio-src/script.json`
  was written for this film (183 words, ~73 s of speech). Each claim was checked against the brief's
  science notes: no instant upward acceleration (objects drift by inertia while the rotating ground
  curves away), the atmosphere and oceans leave because nothing holds them, Earth's self-gravity
  goes too (slow break-up, explicitly not an instant explosion), the Sun's gravity stays.
- Voice: Piper "ruslan" (offline Russian male voice, median pitch ≈ 121 Hz). Chosen over "dmitri"
  (≈ 186 Hz, too high) and "denis". It is a neural TTS, not a human presenter.
- Subtitles come from the TTS phoneme alignment, so each word appears exactly when it is spoken.
  The spoken title (0:00–0:03) and final question (1:26) are shown as on-screen type instead of subtitles.
- Score and most effects are synthesized (D minor; tension rising through the city and planet scenes,
  near-silence in space, an open unresolved chord under the final question). Impacts, whooshes and
  the riser are the bundled Pixabay-licensed HyperFrames SFX.

## Measured
- `hyperframes check`: 0 errors. Kept warnings: two long generated files (captions, s3), the 15 px
  "07:00" on the phone prop (decorative), one leftover type-floor note.
- Mix: −14.8 LUFS integrated, true peak ≈ −1.1 dBFS; music sits ≈ 12.5 dB under the voice and is
  ducked a further ~5 dB while he speaks.
- Speech recognizer (sherpa-onnx Russian zipformer) on the final voice track: 163/183 words recognised;
  misses are mostly the small model (e.g. «отпола» for «от пола»), a few are soft consonant clusters
  in the TTS («нет сцепления», «недра сжаты»).

## Final render
- `renders/gravity_tiktok_1080x1920.mp4`: H.264 High, 1080×1920, 30 fps, 2700 frames, exactly 90.0 s,
  AAC 256 kb/s 48 kHz stereo, 184 MB. Measured −14.9 LUFS integrated, −1.3 dBFS peak, LRA 2.4 LU.
- Frames sampled from the encoded file match the snapshots; subtitles stay inside the 168–1330 px band.

## Not checked by ear
The audio was measured, not listened to. The voice naturalness and the score's taste need a human pass.

## Weakest parts / next steps
- The voice: an offline TTS cannot fully match a professional young presenter. Swap in a recorded
  or premium TTS read of `audio-src/script.json`, then re-run `place.py`-style timing (or
  `hyperframes transcribe`) to re-sync subtitles.
- Characters are flat vector rigs; hands/faces are simple.
- Music is synthesized; a licensed cinematic track would lift it.
