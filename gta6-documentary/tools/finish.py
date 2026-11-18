"""Finishing pass: fine film grain + delivery encode + final audio mux.

master (HyperFrames render) + audio/mix.wav -> deliverables/<name>.mp4
H.264 High@5.2, 2160x3840, 30 fps CFR, yuv420p BT.709, ~45-60 Mb/s VBR,
AAC-LC 320 kb/s 48 kHz, exactly 80.000 s.
"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
master = sys.argv[1]
out = sys.argv[2]
subprocess.run([
    "ffmpeg", "-v", "error", "-stats", "-y", "-i", master, "-i", os.path.join(ROOT, "audio", "mix.wav"),
    "-map", "0:v:0", "-map", "1:a:0",
    "-vf", "noise=c0s=4:c0f=t+u,format=yuv420p",
    "-r", "30", "-fps_mode", "cfr",
    "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-maxrate", "70M", "-bufsize", "140M",
    "-profile:v", "high", "-level:v", "5.2", "-g", "60", "-bf", "2",
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv",
    "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
    "-t", "80", "-movflags", "+faststart", out], check=True)
print("wrote", out)
