#!/usr/bin/env bash
# Full pipeline: narration -> timeline -> music -> mix -> frames -> final MP4.
# Requirements: python3 + numpy, ffmpeg, node + playwright (Chromium), RHVoice with the Russian voices
#   (Ubuntu: apt-get install rhvoice rhvoice-russian).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
python3 tools/build_audio.py      # voice + build/timeline.json + out/subtitles_ru.srt
python3 tools/music.py            # build/music.wav
tools/mix_audio.sh                # build/mix.wav
tools/render_video.sh             # build/video.mp4 (1080x1920, 30 fps)
ffmpeg -y -v error -i build/video.mp4 -i build/mix.wav -i out/subtitles_ru.srt \
  -map 0:v -map 1:a -map 2:s -c:v copy -c:a aac -b:a 192k -c:s mov_text \
  -metadata title="Астана 1997–2026: преображение столицы" -metadata:s:a:0 language=rus -metadata:s:s:0 language=rus \
  -af apad -t 150 -movflags +faststart out/astana_1997_2026.mp4
echo "done: out/astana_1997_2026.mp4"
