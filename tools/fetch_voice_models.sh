#!/bin/bash
# Downloads the Russian neural voice (Piper ru_RU-ruslan-medium) and the Russian ASR (GigaAM-v2) used for QC/alignment.
set -e
D=${TTS_DIR:-/opt/tts}; mkdir -p "$D"; cd "$D"
R=https://github.com/k2-fsa/sherpa-onnx/releases/download
[ -d vits-piper-ru_RU-ruslan-medium ] || { curl -sSL -o v.tar.bz2 $R/tts-models/vits-piper-ru_RU-ruslan-medium.tar.bz2 && tar xjf v.tar.bz2 && rm v.tar.bz2; }
[ -d sherpa-onnx-nemo-ctc-giga-am-v2-russian-2025-04-19 ] || { curl -sSL -o g.tar.bz2 $R/asr-models/sherpa-onnx-nemo-ctc-giga-am-v2-russian-2025-04-19.tar.bz2 && tar xjf g.tar.bz2 && rm g.tar.bz2; }
echo "models ready in $D"
