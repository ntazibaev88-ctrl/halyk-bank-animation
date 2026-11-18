#!/usr/bin/env bash
# One-command build: voice -> timeline/subtitles -> music -> SFX -> mix ->
# footage prep -> HyperFrames composition -> 4K render -> finishing -> QC.
# Requires: python3 (numpy, scipy, edge-tts), ffmpeg, node >= 22, hyperframes.
set -euo pipefail
cd "$(dirname "$0")"
HF=${HF:-"npx hyperframes"}
NAME=${1:-GTA6_CINEMATIC_DOCUMENTARY_4K}
python3 tools/tts.py            # cached in audio/vo_parts (delete a part to regenerate)
python3 tools/timeline.py       # voiceover.wav, timeline.json, SRT, scene timeline
python3 tools/music.py          # original score, arranged to the section cuts
python3 tools/sfx.py            # sound design locked to the cuts
python3 tools/mix.py            # ducked mix, -14 LUFS / -1.5 dBTP
python3 tools/prep_footage.py   # footage/clips.json -> footage/cut/*.mp4
python3 tools/compose.py        # index.html (HyperFrames)
mkdir -p renders deliverables
$HF lint . >/dev/null
$HF render . -o renders/master_hf.mp4 --crf 12 --workers 4 --quiet
# never give an animatic the final film's name
if python3 -c "import json,sys; sys.exit(0 if json.load(open('build/compose_report.json'))['missing_footage'] else 1)"; then
  NAME="${NAME}_ANIMATIC"
fi
python3 tools/finish.py renders/master_hf.mp4 "deliverables/${NAME}.mp4"
cp audio/voiceover.wav deliverables/GTA6_voiceover.wav
python3 tools/verify.py "deliverables/${NAME}.mp4"
