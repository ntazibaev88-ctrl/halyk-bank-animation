#!/usr/bin/env bash
# Normalise the rendered film's loudness for social platforms (-14 LUFS, -1.5 dBTP).
# Also re-encodes the picture to a phone-friendly H.264 size.
set -euo pipefail
IN=${1:-renders/almaty-raw.mp4}
OUT=${2:-renders/almaty-kk.mp4}
STATS=$(ffmpeg -hide_banner -nostats -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$STATS" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -hide_banner -loglevel error -i "$IN" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -r 30 -profile:v high \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart "$OUT"
echo "wrote $OUT"
