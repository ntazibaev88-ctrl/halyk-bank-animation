#!/usr/bin/env bash
# Render all frames in parallel chunks, then mux with mixed audio and subtitles.
set -euo pipefail
cd "$(dirname "$0")/.."
N=${WORKERS:-4}
TOTAL=$(python3 -c "import json;t=json.load(open('build/timeline.json'));print(int(round(t['total']*t['fps'])))")
STEP=$(( (TOTAL + N - 1) / N ))
rm -f build/chunk_*.mp4 build/chunks.txt
for i in $(seq 0 $((N-1))); do
  A=$((i*STEP)); B=$(( (i+1)*STEP < TOTAL ? (i+1)*STEP : TOTAL ))
  node tools/render_frames.js $A $B build/chunk_$i.mp4 &
  echo "file 'chunk_$i.mp4'" >> build/chunks.txt
done
wait
ffmpeg -y -v error -f concat -safe 0 -i build/chunks.txt -c copy build/video.mp4
