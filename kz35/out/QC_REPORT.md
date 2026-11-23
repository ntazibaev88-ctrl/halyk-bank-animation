# QC report — KAZAKHSTAN_INDEPENDENCE_35_YEARS_4K.mp4

```
index=0
codec_name=hevc
profile=Main
width=2160
height=3840
pix_fmt=yuv420p
r_frame_rate=30/1
avg_frame_rate=30/1
duration=120.000000
nb_frames=3600
index=1
codec_name=aac
profile=LC
sample_rate=48000
channels=2
r_frame_rate=0/0
avg_frame_rate=0/0
duration=120.000000
nb_frames=5626
duration=120.000000
size=634940129
bit_rate=42329341
```

## Black frames (blackdetect d≥0.10s, pic_th=0.98)
```
black_start:0 black_end:0.333333 black_duration:0.333333
```
## Frozen video (freezedetect n=-60dB d≥1.0s)
```
none
```
## Loudness (EBU R128)
```
    I:         -14.0 LUFS
    Threshold: -24.4 LUFS
    LRA:         2.5 LU
    Threshold: -34.3 LUFS
    Peak:       -1.4 dBFS
```
## Audio peak (volumedetect)
```
[Parsed_volumedetect_0 @ 0x55a678c03d40] mean_volume: -16.8 dB
[Parsed_volumedetect_0 @ 0x55a678c03d40] max_volume: -1.4 dB
```
## Full decode integrity
```
decoded video frames: 3600 (expected 3600)
decoder errors: 0
```

## Notes
* The only black interval (0.000–0.333 s) is the intentional fade-in from black at the head of the film.
* Narration onset in the final file: first word at ≈1.0 s, matching `voice/timeline.json` (A/V sync verified against the subtitle/word timings).
* Picture: rendered by HyperFrames at 2160×3840/30 fps (3600 frames, verified decode of the intermediate: 0 errors), then encoded to HEVC Main 8-bit, closed GOP (2 s), ~42 Mbps, BT.709.
* Resolution honesty: the container is native 2160×3840 and all text/graphics are rendered at 4K, but most footage is upscaled from 720p/1080p sources (≈3.5–5× after the vertical crop). It is **not** native-4K footage.
* Visual review: full-film contact sheet (one frame every 2 s) and targeted 4K snapshots were reviewed for every chapter.
