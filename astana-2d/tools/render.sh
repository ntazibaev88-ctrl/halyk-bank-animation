#!/bin/bash
# Render the film with HyperFrames, then deliver H.264 MP4 at -14 LUFS.
set -e
cd "$(dirname "$0")/.."
export HYPERFRAMES_BROWSER_PATH=${HYPERFRAMES_BROWSER_PATH:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
export HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1 HYPERFRAMES_NO_AUTO_INSTALL=1
mkdir -p renders
./node_modules/.bin/hyperframes render . -o renders/master.mp4 -w ${WORKERS:-4} --crf 14 -q delivery 2>&1 | grep -E "rendered in|rror" | head -5
ffmpeg -v error -y -i renders/master.mp4 -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -r 30 -crf 19 -maxrate 5.6M -bufsize 11M -movflags +faststart \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -c:a aac -b:a 192k -ar 48000 renders/astana-2d.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate renders/astana-2d.mp4
