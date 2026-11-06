#!/usr/bin/env bash
# Voice: clean-up EQ + compression. Music: ducked under the voice (sidechain). Master: loudness -14 LUFS, -1.5 dBTP.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -v error -i build/voice.wav -i build/music.wav -filter_complex "
[0:a]aformat=sample_rates=48000:channel_layouts=mono,highpass=f=80,lowpass=f=11000,equalizer=f=250:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1.0:g=3,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=4,aecho=0.8:0.5:40:0.08,pan=stereo|c0=c0|c1=c0,asplit=2[v][sc];
[1:a]volume=0.9[m];
[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450:makeup=1[md];
[v][md]amix=inputs=2:weights='1 0.55':normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000[out]" -map "[out]" -c:a pcm_s16le build/mix.wav
