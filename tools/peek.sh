#!/bin/bash
# usage: tools/peek.sh <scene-start-offset> t1,t2,... [out.png]   (times relative to scene; offset = global scene start)
# Renders snapshots at offset+t and tiles them into one PNG for quick visual review.
OFF=$1; TS=$2; OUT=${3:-/tmp/peek.png}
export HYPERFRAMES_NO_TELEMETRY=1
G=$(python3 -c "print(','.join(str(round($OFF+float(t),3)) for t in '$TS'.split(',')))")
L=$(npx hyperframes snapshot --at "$G" 2>&1 | grep -oE '/[^ ]+frame-[0-9]+-at-[^ ]+\.png' | head -n $(echo $TS | tr ',' '\n' | wc -l))
N=$(echo "$L" | wc -l); IN=""; FC=""; i=0
for f in $L; do IN="$IN -i $f"; FC="$FC[$i]scale=300:-1[s$i];"; i=$((i+1)); done
ST=""; for ((j=0;j<N;j++)); do ST="$ST[s$j]"; done
ffmpeg -loglevel error -y $IN -filter_complex "${FC}${ST}hstack=$N" $OUT && echo $OUT
