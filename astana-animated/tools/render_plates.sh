#!/bin/bash
# Render 3D background plates with HyperFrames (headless Chromium, software WebGL).
# usage: tools/render_plates.sh s1 s2 ...   (default: all)
cd "$(dirname "$0")/.."
export HYPERFRAMES_BROWSER_PATH=${HYPERFRAMES_BROWSER_PATH:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
export HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1 HYPERFRAMES_NO_AUTO_INSTALL=1
IDS=${@:-s1 s2 s3 s4 s5 s6 s7 s8}
for id in $IDS; do
  echo "=== plate $id $(date +%T)"
  ./node_modules/.bin/hyperframes render plate-project -c $id.html -o "$PWD/plates/out/$id.mp4" -w ${WORKERS:-4} --crf 14 -q delivery 2>&1 | grep -E "rendered in|Error|error|✗" | head -5
done
echo "=== done $(date +%T)"
