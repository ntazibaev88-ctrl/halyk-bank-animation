#!/bin/bash
# Quality control of a rendered film: specs, duration, black/frozen frames, loudness, per-shot frames.
# usage: scripts/qc.sh film.mp4 out_dir
set -e
F="$1"; O="${2:-build/qc}"; mkdir -p "$O"
echo "== streams"
ffprobe -v error -show_entries stream=index,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels,nb_frames -show_entries format=duration,size,bit_rate -of default=nw=1 "$F"
echo "== black segments (>0.4 s, pic<0.98)"
ffmpeg -v info -i "$F" -vf "scale=270:480,blackdetect=d=0.4:pix_th=0.06" -an -f null - 2>&1 | grep -o "black_start.*" || echo "none"
echo "== frozen segments (>2.5 s)"
ffmpeg -v info -i "$F" -vf "scale=270:480,freezedetect=n=0.002:d=2.5" -an -f null - 2>&1 | grep -oE "freeze_(start|duration|end): [0-9.]+" | paste - - - || echo "none"
echo "== loudness"
ffmpeg -hide_banner -i "$F" -vn -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):"
echo "== silence (>3 s at -50 dB)"
ffmpeg -hide_banner -i "$F" -vn -af silencedetect=n=-50dB:d=3 -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+" || echo "none"
# one frame per second, as a contact sheet (10 x 12)
ffmpeg -v error -y -i "$F" -vf "fps=1,scale=216:384,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=12x10" -frames:v 1 "$O/sheet_1fps.png"
echo "sheet: $O/sheet_1fps.png"
