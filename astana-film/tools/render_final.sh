#!/bin/bash
# Render the final film (plates + graphics + audio) and deliver H.264 MP4.
set -e
cd "$(dirname "$0")/.."
export HYPERFRAMES_BROWSER_PATH=${HYPERFRAMES_BROWSER_PATH:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
export HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1 HYPERFRAMES_NO_AUTO_INSTALL=1
mkdir -p renders
for p in s1 s2 s3 s4 s5 s6 s7 s8; do [ -f plates/out/$p.mp4 ] || { echo "missing plates/out/$p.mp4"; exit 1; }; done
./node_modules/.bin/hyperframes render . -o renders/master.mp4 -w ${WORKERS:-4} --crf 12 -q delivery 2>&1 | grep -E "rendered in|Error|error" | head -5
# Delivery: H.264 High, 1080x1920, 30 fps, yuv420p, AAC 48 kHz; loudness -14 LUFS (mobile)
ffmpeg -v error -y -i renders/master.mp4 \
  -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -r 30 -crf 19 -maxrate 6M -bufsize 12M -movflags +faststart \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  renders/astana-documentary.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate renders/astana-documentary.mp4
