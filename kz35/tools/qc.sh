#!/usr/bin/env bash
# Technical QC of the final master. Writes out/QC_REPORT.md and research/frames/qc_*.jpg
set -uo pipefail
cd "$(dirname "$0")/.."
F=${1:-out/KAZAKHSTAN_INDEPENDENCE_35_YEARS_4K.mp4}
R=out/QC_REPORT.md
{
echo "# QC report — $(basename "$F")"; echo; echo '```'
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_name,profile,width,height,r_frame_rate,avg_frame_rate,pix_fmt,sample_rate,channels,nb_frames,duration -of default=nw=1 "$F"
echo '```'; echo
echo "## Black frames (blackdetect d≥0.10s, pic_th=0.98)"; echo '```'
ffmpeg -v info -i "$F" -vf "blackdetect=d=0.10:pic_th=0.98:pix_th=0.06" -an -f null - 2>&1 | grep -o "black_start.*" || echo "none"
echo '```'
echo "## Frozen video (freezedetect n=-60dB d≥1.0s)"; echo '```'
ffmpeg -v info -i "$F" -vf "freezedetect=n=-60dB:d=1.0" -an -f null - 2>&1 | grep -oE "freeze_(start|duration|end).*" || echo "none"
echo '```'
echo "## Loudness (EBU R128)"; echo '```'
ffmpeg -nostats -i "$F" -vn -af ebur128=peak=true -f null - 2>&1 | grep -A20 "Summary" | grep -E "I:|LRA:|Peak:|Threshold" 
echo '```'
echo "## Audio peak (volumedetect)"; echo '```'
ffmpeg -nostats -i "$F" -vn -af volumedetect -f null - 2>&1 | grep -E "max_volume|mean_volume"
echo '```'
echo "## Full decode integrity"; echo '```'
N=$(ffmpeg -v error -i "$F" -map 0:v -f framemd5 - 2>/tmp/qc_dec.err | grep -vc "^#")
echo "decoded video frames: $N (expected 3600)"; echo "decoder errors: $(grep -c '' /tmp/qc_dec.err)"
echo '```'
} > "$R"
mkdir -p research/frames
ffmpeg -v error -y -i "$F" -vf "fps=1/2,scale=216:384,tile=10x6" -frames:v 1 research/frames/qc_sheet.jpg
cat "$R"
