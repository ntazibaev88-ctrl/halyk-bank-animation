# REVIEW — «Қазақстан — 35 жылдағы даму жолы»

## Creative calls
- **Theme**: how Kazakhstan has changed in 35 years, told in three chapters (1991–2000, 2000–2017, 2017–2026) across the eight scenes of the brief. No December 16 references anywhere.
- **Real imagery first**: stock photo/footage sites are blocked in this sandbox, so the film uses **real Copernicus Sentinel-2 satellite imagery** (2024–2025) of Astana, Almaty, Shymkent, Turkistan, Karaganda, Aktau, Oskemen, Tengiz, Ekibastuz, Balkhash, Temirtau, Khorgos, Charyn, Burabay, the northern wheat belt and the Alatau. Landmark pins (Бәйтерек, Хан Шатыр, Ақорда, ЭКСПО, Yasawi mausoleum) are placed from real coordinates. The opening, nature and finale 3D shots drape real Sentinel-2 imagery over real elevation (AWS Terrain Tiles), so the mountains are the actual Alatau, not invented terrain.
- **No fake archive**: history (1991 independence, 1992 UN membership, 1993 tenge, 1997 capital) is told with maps, a timeline, the flag and typography, not with generated "archival" photos.
- **Illustrations are labelled**: the AI/data-centre and renewable-energy shots are generic 3D illustrations and carry an on-screen «ИЛЛЮСТРАЦИЯ» label.
- **People, culture, sport**: with no access to real photos or footage, these are told through elegant gold line art (book, dombra, medal), the national ornament, the UNESCO-listed Yasawi mausoleum from orbit, Kazakhstan's night lights ("its people") and typography. Real footage of people can be dropped into `tools/build_scenes.py` as `clip` layers.
- **Narration**: the client's Kazakh script, verbatim (numbers spoken as words for correct pronunciation, numerals in the captions). Voice: Microsoft neural `kk-KZ-DauletNeural`, +5 Hz pitch for a younger timbre, a slightly slower, unhurried pace. It is a synthetic voice; a human narrator can replace the per-line files.
- **Music**: original score written in code: a dombra kui-like motif (plucked-string physical model, 6/8 strumming), kobyz phrases (bowed, raspy, vibrato), strings, piano, frame drum and taiko, a subtle electronic pulse in the modern section, and an orchestral climax resolving to D major. Ducked ~6 dB under the voice.

## Facts used
1991 independence · 2 March 1992 UN membership · 15 November 1993 tenge · 1997 capital moved to Akmola (Astana) · EXPO-2017 in Astana · world's largest uranium producer since 2009 · Yasawi mausoleum UNESCO World Heritage (2003). Copper is shown at Balkhash, coal and energy at Ekibastuz, metallurgy at Temirtau, oil and gas at Tengiz, rail at Khorgos. No economic statistics are claimed.

## Measured vs looked at
- `hyperframes check` / `lint`: 0 errors; warnings kept: dense tracks (generated scenes), short holds on city coordinates in the 1-second city montage.
- Draft preview rendered and reviewed frame by frame; fixed: crowded timeline labels, overlapping Astana labels, magenta tint in the farmland imagery (re-fetched August scenes with a colour-neutral grade), the finale "35" overlapping the captions, low-contrast final words.
- Loudness −13.5 LUFS integrated, −1.0 dBFS peak; no black frames. The sound was measured, not heard.

## Limits / next steps
- Zhezkazgan and Kolsai had no cloud-free summer scenes; Balkhash and Burabay were used instead.
- Satellite views are 10 m/px, so close zooms soften; real drone footage would add ground-level detail.
- A recorded young Kazakh narrator and live dombra/kobyz players would lift the film further.
