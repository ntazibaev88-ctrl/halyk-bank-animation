#!/bin/bash
# Polite sequential Commons downloader. usage: dl.sh listfile   (lines: "name url")
UA="FilmResearchBot/1.0 (educational project)"
while read name url; do
  [ -z "$name" ] && continue
  [ -s "$name" ] && { echo "SKIP $name"; continue; }
  for attempt in 1 2 3 4 5 6; do
    hdr=$(mktemp)
    code=$(curl -s -A "$UA" -D "$hdr" -o "$name.part" -w "%{http_code}" "$url")
    if [ "$code" = "200" ]; then mv "$name.part" "$name"; echo "OK $name $(stat -c%s "$name")"; rm -f "$hdr"; break; fi
    ra=$(grep -i '^retry-after:' "$hdr" | tr -dc 0-9); rm -f "$hdr" "$name.part"
    wait=${ra:-30}; [ "$wait" -gt 900 ] && wait=900
    echo "HTTP $code for $name, waiting ${wait}s (attempt $attempt)"; sleep "$wait"
  done
  sleep 15
done < "$1"
