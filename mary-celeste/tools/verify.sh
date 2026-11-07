#!/usr/bin/env bash
# Verify the rendered MP4: format, duration, loudness, frozen stretches, sample frames.
set -euo pipefail
cd "$(dirname "$0")/.."
V=${1:-renders/mary-celeste.mp4}
OUT=${2:-renders/verify}
mkdir -p "$OUT"

echo "== stream info"
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,nb_frames,sample_rate,channels,display_aspect_ratio \
  -show_entries format=duration,size,bit_rate -of default=nw=1 "$V"

echo "== loudness (EBU R128)"
ffmpeg -nostats -i "$V" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|LRA:|Peak:)" | tr -s ' '

echo "== frozen stretches (no visible change for >= 1.5 s)"
ffmpeg -nostats -i "$V" -vf "scale=270:480,freezedetect=n=0.0008:d=1.5" -map 0:v -f null - 2>&1 | grep -E "freeze_(start|duration)" || echo "none"

echo "== black stretches"
ffmpeg -nostats -i "$V" -vf "blackdetect=d=0.3:pix_th=0.06" -an -f null - 2>&1 | grep -E "black_start" || echo "none"

echo "== sample frames"
for t in 0.05 1.3 2.4 8.6 11.2 16.5 20.0 25.5 28.9 32.6 36.0 40.6 43.5 46.3 49.0 53.5 56.6 58.6 61.2 64.5 67.0 70.0 71.6 75.5 78.4 81.5 83.8 84.9; do
  ffmpeg -v error -y -ss "$t" -i "$V" -frames:v 1 -vf scale=360:640 "$OUT/f-$t.jpg"
done
python3 - "$OUT" <<'PY'
import sys, glob, os, subprocess
d = sys.argv[1]
files = sorted(glob.glob(os.path.join(d, "f-*.jpg")), key=lambda p: float(os.path.basename(p)[2:-4]))
n = len(files); cols = 7
args = []
for f in files: args += ["-i", f]
rows = (n + cols - 1) // cols
layout = "|".join(f"{(i % cols) * 360}_{(i // cols) * 640}" for i in range(n))
subprocess.run(["ffmpeg", "-v", "error", "-y", *args, "-filter_complex",
                f"xstack=inputs={n}:layout={layout}:fill=black", os.path.join(d, "contact-sheet.jpg")], check=True)
print("contact sheet:", os.path.join(d, "contact-sheet.jpg"), n, "frames")
PY
