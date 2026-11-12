#!/bin/bash
# usage: scripts/stills.sh out.jpg t1 t2 ... (seconds)
out=$1; shift; dir=/tmp/claude-0/work/stills; rm -f $dir/tmp_*.png; i=0
for t in "$@"; do f=$(python3 -c "print(round($t*30))"); npx remotion still src/index.ts Documentary $dir/tmp_$(printf %02d $i).png --frame=$f --browser-executable=/opt/pw-browsers/chromium --scale=0.4 --log=error >/dev/null 2>&1 || echo "fail $t"; i=$((i+1)); done
n=$(ls $dir/tmp_*.png | wc -l)
ffmpeg -v error -y -pattern_type glob -i "$dir/tmp_*.png" -vf "tile=${n}x1" -frames:v 1 -update 1 $out
