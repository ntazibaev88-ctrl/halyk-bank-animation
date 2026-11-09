#!/bin/bash
# name lat lon width_km height_km out_w out_h [months]
cd "$(dirname "$0")/.."
while read -r n la lo w h ow oh mo; do
  [ -z "$n" ] && continue; [ -f "assets/sat/$n.jpg" ] && continue
  python3 tools/sentinel.py $n $la $lo $w $h $ow $oh $mo 2>&1 | grep -E "saved|no clear|Error" | tail -1
done <<LIST
astana_wide 51.14 71.44 33.75 60 1215 2160
almaty 43.215 76.905 27 48 1350 2400
shymkent 42.32 69.60 18 32 1080 1920
turkistan 43.297 68.268 9 16 1080 1920
karaganda 49.82 73.10 20.25 36 1080 1920
aktau 43.66 51.19 16.2 28.8 1080 1920
oskemen 49.96 82.62 18 32 1080 1920
tengiz 46.13 53.42 27 48 1080 1920
ekibastuz 51.80 75.35 27 48 1080 1920
zhezkazgan 47.80 67.75 27 48 1080 1920
balkhash 46.86 74.98 18 32 1080 1920
temirtau 50.06 72.98 13.5 24 1080 1920
khorgos 44.19 80.33 13.5 24 1080 1920
charyn 43.355 79.075 9 16 1080 1920
bigalmaty 43.052 76.985 9 16 1080 1920
kolsai 42.95 78.33 9 16 1080 1920
burabay 53.08 70.30 18 32 1080 1920
bozzhyra 43.42 54.07 13.5 24 1080 1920
wheat 53.55 64.40 18 32 1080 1920 2024-08,2025-08,2024-07,2025-07
wheat2 52.40 70.60 13.5 24 1080 1920 2024-08,2025-08,2024-07,2025-07
alatau_drape 43.08 77.00 30 30 1800 1800
LIST
echo FETCH_DONE
