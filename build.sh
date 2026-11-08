#!/usr/bin/env bash
# Full pipeline: Kazakh narration -> timeline -> music -> mix -> HyperFrames composition -> render -> final MP4.
# Requirements: python3 + numpy + edge-tts (pip install edge-tts; needs access to the Microsoft speech service),
#   ffmpeg, Node >= 22. HyperFrames and GSAP are pinned in hyperframes/package.json.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build out
SSL_CERT_FILE=${SSL_CERT_FILE:-/root/.ccr/ca-bundle.crt} python3 tools/build_audio_kk.py   # voice, timeline, Kazakh SRT
python3 tools/music.py                    # build/music.wav
tools/mix_audio.sh                        # build/mix.wav (voice + ducked music, -14 LUFS)
(cd hyperframes && npm install --no-audit --no-fund)
tools/make_hyperframes.sh                 # hyperframes/index.html + assets
(cd hyperframes && npx hyperframes check --json > /dev/null && npx hyperframes render -o ../build/hf_render.mp4 --workers 4 --quality delivery --fps 30)
# add the Kazakh subtitle track (subtitles are also drawn into the picture)
ffmpeg -y -v error -i build/hf_render.mp4 -i out/subtitles_kk.srt -map 0:v -map 0:a -map 1:s -c:v copy -c:a copy -c:s mov_text \
  -metadata title="Астана 1997–2026: Елорданың өзгеру жолы" -metadata:s:a:0 language=kaz -metadata:s:s:0 language=kaz \
  -movflags +faststart out/astana_1997_2026_kk.mp4
echo "done: out/astana_1997_2026_kk.mp4"
