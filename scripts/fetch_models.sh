#!/usr/bin/env bash
# Downloads the offline Russian voice (Piper "ruslan", male) and the Russian ASR model
# used for word-level subtitle alignment. Both come from sherpa-onnx GitHub releases.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p models && cd models
base=https://github.com/k2-fsa/sherpa-onnx/releases/download
[ -d vits-piper-ru_RU-ruslan-medium ] || curl -sSL "$base/tts-models/vits-piper-ru_RU-ruslan-medium.tar.bz2" | tar xj
[ -d sherpa-onnx-small-zipformer-ru-2024-09-18 ] || curl -sSL "$base/asr-models/sherpa-onnx-small-zipformer-ru-2024-09-18.tar.bz2" | tar xj
echo "models ready"
