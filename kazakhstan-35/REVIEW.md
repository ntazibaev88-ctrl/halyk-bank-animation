# REVIEW — «Қазақстан — 35 жыл»

## Creative calls
- **Storyline**: built the brief's seven-scene structure as given (1991 → first steps → new capital → economy → EXPO-2017 → modern Kazakhstan → the future). No alternative storylines were explored because the brief fixed the story.
- **Narration**: the brief referred to "the complete Kazakh narration supplied in the project brief", but none was attached. I wrote an original Kazakh script (`script/narration_kk.md`), 26 lines, ~87 s of speech. Numbers are written as words in the spoken text so the voice reads them correctly; captions show numerals.
- **Voice**: Microsoft neural voice `kk-KZ-DauletNeural` (native Kazakh, male), pitch +5 Hz for a younger timbre (measured median F0 ≈ 115 Hz before the lift), slightly faster pace in scenes 2–6 and slightly slower, weightier pace in the finale. Processed with EQ, light compression and a small room. It is a synthetic voice — good pronunciation, but not a human actor; a recorded narrator can drop in per line (`assets/voice/lNN.wav`).
- **Music**: no music library was reachable (HeyGen catalogue needs sign-in; HuggingFace/MusicGen blocked in this sandbox), so the score is **original and synthesised in code** (`tools/compose_score.py`): dombra-like plucks + soft piano → strings → taiko & ostinato → choir/brass climax on "35" → final D-major chord. It is ducked ~6 dB under the voice. It is a credible cinematic bed, but a licensed orchestral track will sound richer — swap `assets/music/score.wav`.
- **Accuracy**: dates used — 16.12.1991 independence; 02.03.1992 UN membership; 04.06.1992 state symbols; 15.11.1993 tenge; 10.12.1997 capital moved to Akmola; 1998 renamed Astana; EXPO-2017 10.06–10.09.2017, 100+ countries; Kazakhstan the world's #1 uranium producer since 2009. Future items are shown under **«АЛДАҒЫ МАҚСАТТАР»** (future goals), not as achievements: 2030 renewables share 15 %, 2060 carbon neutrality. Please double-check these two targets against the latest official documents before publishing.
- **Symbols**: the flag is drawn to the real layout (sun with 32 rays, steppe eagle, hoist ornament). The emblem (Елтаңба) is a **stylised** rendition (shanyrak, uyks, wings, star) — not an official reproduction. Banknotes are generic, not copies of real notes. Foreign flags at the UN/EXPO are generic colour banners.

## Measured vs looked at
- `hyperframes check`: passes (runtime, layout, motion, contrast, audio); one warning kept on purpose — all captions sit in one captions composition (46 groups), as the skill recommends.
- Review sheets (`snapshot --review`), phone-width sheet, and per-scene snapshots were inspected.
- Sound was **measured, not heard**: section loudness of the score (−18.6 LUFS intro → −12.7 LUFS climax), spectrogram, rendered-file loudness. Nobody has listened to the mix.

## Weakest shots / with more time
- Scene 4 split screen (oil + steel): the ladle reads as a simple shape; a more detailed steel-mill illustration would help.
- The emblem is stylised; for an official release use the official vector of the State Emblem.
- Portrait cards in scene 6 are silhouettes; commissioned illustrations of real young professionals would be warmer.
- A human narrator and a licensed orchestral score would lift the whole piece the most.
