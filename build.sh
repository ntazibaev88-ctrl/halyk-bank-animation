#!/usr/bin/env bash
# Full build: Kazakh voiceover -> timeline -> score/SFX mix -> frame render -> final MP4 (1080x1920, 30 fps)
set -euo pipefail
cd "$(dirname "$0")"
pip install -q edge-tts numpy >/dev/null
python3 tools/tts.py            # narration + word timings (kk-KZ-DauletNeural)
python3 tools/timeline_js.py    # timeline for the animation page
python3 tools/audio.py          # original music + sound effects + ducked mix
node tools/render.js --workers "${WORKERS:-3}"
mkdir -p output
ffmpeg -y -v error -i build/video_noaudio.mp4 -i build/mix_raw.wav \
  -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart -shortest output/PTE_TB_TEC_kk_1080x1920.mp4
python3 tools/srt.py            # Kazakh subtitles as a separate .srt as well
echo "Done: output/PTE_TB_TEC_kk_1080x1920.mp4"
