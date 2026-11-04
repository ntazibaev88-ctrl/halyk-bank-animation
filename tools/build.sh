#!/usr/bin/env bash
# Full pipeline: render frames -> audio -> encode masters + 7 scene clips.
# usage: tools/build.sh <workdir>
set -euo pipefail
W=${1:-/tmp/halyk_build}; R=$(cd "$(dirname "$0")/.." && pwd); mkdir -p "$W/frames" "$W/audio" "$R/output/clips"
[ "$(ls "$W/frames" | wc -l)" -ge 1800 ] || node "$R/tools/render.js" "$W/frames" 0 1800 --workers 4
python3 "$R/audio/make_audio.py" "$W/audio" > /dev/null
enc() { ffmpeg -y -v error -framerate 30 -i "$W/frames/f%05d.jpg" -i "$W/audio/$1.wav" -t 60 -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 192k -shortest "$2"; }
enc mix_guide "$R/output/halyk_bank_60s_1080x1920_guide-vo.mp4"
enc mix_novo  "$R/output/halyk_bank_60s_1080x1920_no-vo.mp4"
i=1; for r in "S1_hook 0 7" "S2_history 7 15" "S3_evolution 15 23" "S4_digital 23 33" "S5_people 33 43" "S6_kazakhstan 43 53" "S7_finale 53 60"; do set -- $r
  ffmpeg -y -v error -ss $2 -t $(( $3 - $2 )) -i "$R/output/halyk_bank_60s_1080x1920_guide-vo.mp4" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k "$R/output/clips/clip${i}_$1.mp4" 2>/dev/null || true
  i=$((i+1)); done
