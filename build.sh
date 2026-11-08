#!/usr/bin/env bash
# Full pipeline: narration -> timeline -> music -> mix -> frames -> final MP4.
# Requirements: python3 + numpy + edge-tts (pip install edge-tts; needs network access to the Microsoft speech service),
#   ffmpeg, node + playwright (Chromium).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
SSL_CERT_FILE=${SSL_CERT_FILE:-/root/.ccr/ca-bundle.crt} python3 tools/build_audio_kk.py   # Kazakh voice + build/timeline.json + out/subtitles_kk.srt
python3 tools/music.py            # build/music.wav
tools/mix_audio.sh                # build/mix.wav
tools/render_video.sh             # build/video.mp4 (1080x1920, 30 fps)
ffmpeg -y -v error -i build/video.mp4 -i build/mix.wav -i out/subtitles_kk.srt \
  -map 0:v -map 1:a -map 2:s -c:v copy -c:a aac -b:a 192k -c:s mov_text \
  -metadata title="Астана 1997–2026: Елорданың өзгеру жолы" -metadata:s:a:0 language=kaz -metadata:s:s:0 language=kaz \
  -af apad -t 110 -movflags +faststart out/astana_1997_2026_kk.mp4
echo "done: out/astana_1997_2026_kk.mp4"
