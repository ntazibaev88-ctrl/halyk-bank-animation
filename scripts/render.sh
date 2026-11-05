#!/usr/bin/env bash
# usage: scripts/render.sh preview|final
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:-preview}"
node scripts/build-project.mjs --report
mkdir -p out
if [ "$MODE" = "final" ]; then
  MISSING=$(node -e 'const p=require("./src/generated/project.json");const m=p.scenes.flatMap(s=>s.shots).filter(x=>x.kind==="footage"&&!x.file).map(x=>x.id);const v=p.scenes.filter(s=>!s.vo).map(s=>"vo"+s.id);console.log([...m,...v].join(" "))')
  if [ -n "$MISSING" ]; then echo "REFUSING final render. Missing assets: $MISSING"; echo "See ASSETS_CHECKLIST.md"; exit 2; fi
  RAW=out/raw_final.mp4; MASTER=FACTUM_SHYMKENT_105SEC.mp4
else
  RAW=out/raw_preview.mp4; MASTER=out/FACTUM_SHYMKENT_PREVIEW_NO_FOOTAGE.mp4
fi
npx remotion render src/index.ts Factum "$RAW" --props="{\"mode\":\"$MODE\"}" --concurrency=4 --log=warn
# FFmpeg master pass: loudness-normalise (-14 LUFS, platform standard), AAC 192k, faststart for upload
ffmpeg -y -v error -i "$RAW" -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 16 -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -af "loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$MASTER"
echo "wrote $MASTER"
node scripts/verify.mjs "$MASTER"
