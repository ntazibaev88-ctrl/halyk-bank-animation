#!/bin/bash
# usage: tools/snap.sh out.png t1,t2,...   -> contact strip of HyperFrames snapshots
cd "$(dirname "$0")/.."
export HYPERFRAMES_BROWSER_PATH=${HYPERFRAMES_BROWSER_PATH:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell} HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_NO_UPDATE_CHECK=1
D=$(mktemp -d)
./node_modules/.bin/hyperframes snapshot . --at "$2" --no-end -o "$D" >/dev/null 2>&1
N=$(ls $D/frame-*.png | wc -l)
ffmpeg -v error -y -pattern_type glob -i "$D/frame-*.png" -vf "scale=216:384,tile=${N}x1" "$1"
rm -rf "$D"
