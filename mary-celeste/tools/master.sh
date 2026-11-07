#!/usr/bin/env bash
# Master the rendered film's audio for social platforms: two-pass EBU R128 loudness
# normalisation to -15 LUFS integrated, -1.5 dBTP true peak. The video stream is copied untouched.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=${1:-renders/mary-celeste.raw.mp4}
OUT=${2:-renders/mary-celeste.mp4}
TARGET="I=-15:TP=-1.5:LRA=9"
M=$(ffmpeg -nostats -hide_banner -i "$IN" -af "loudnorm=$TARGET:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$M" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$IN" -c:v copy \
  -af "loudnorm=$TARGET:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart "$OUT"
echo "mastered → $OUT"
