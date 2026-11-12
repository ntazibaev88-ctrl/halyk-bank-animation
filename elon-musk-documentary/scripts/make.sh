#!/usr/bin/env bash
# Full pipeline. Requires: python3 (numpy, scipy, edge-tts, requests), ffmpeg, node 18+.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/rangeproxy.py & RP=$!; trap 'kill $RP 2>/dev/null || true' EXIT; sleep 1
[ -f scripts/vo_timings.json ] || python3 scripts/gen_voice.py      # 1. Russian voice-over + word timings
python3 scripts/cut_segments.py                                      # 2. NASA source segments
python3 scripts/build_timeline.py                                    # 3. narration-driven edit decision list
python3 scripts/prep_shots.py                                        # 4. vertical crop + grade per shot
python3 scripts/gen_audio.py                                         # 5. score, SFX, ducking, loudness
npx remotion render src/index.ts ElonDoc out/elon-musk-documentary.mp4 \
  --codec=h264 --crf=17 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=256k  # 6. render
python3 scripts/qa.py out/elon-musk-documentary.mp4                  # 7. automated checks
