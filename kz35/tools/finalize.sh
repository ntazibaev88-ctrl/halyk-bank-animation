#!/usr/bin/env bash
# Mux the final mix onto the HyperFrames render and encode the HEVC master + 1080p preview.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=out/render/video_4k_silent.mp4
OUT=out/KAZAKHSTAN_INDEPENDENCE_35_YEARS_4K.mp4
ffmpeg -v error -stats -y -i "$SRC" -i out/mix_master.wav -map 0:v:0 -map 1:a:0 -t 120 \
  -c:v libx265 -preset medium -b:v 42M -maxrate 55M -bufsize 84M -pix_fmt yuv420p -tag:v hvc1 \
  -x265-params "keyint=60:min-keyint=30:aq-mode=3:log-level=error" \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a aac -b:a 320k -ar 48000 -movflags +faststart \
  -metadata title="ТӘУЕЛСІЗДІК — ЕҢ ҚЫМБАТ ҚҰНДЫЛЫҚ" -metadata language=kaz "$OUT"
ffmpeg -v error -y -i "$OUT" -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -preset slow -crf 21 -maxrate 6M -bufsize 12M \
  -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/KAZAKHSTAN_INDEPENDENCE_35_YEARS_1080p_preview.mp4
ls -la out/*.mp4
