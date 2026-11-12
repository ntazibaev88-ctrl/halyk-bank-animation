"""Prepare every shot in footage/prep_jobs.json: trim from its segment, crop a 2:3 window around
the subject, scale to 1280x1920, apply the film's single colour grade, encode H.264 for Remotion.
Usage: python3 scripts/prep_shots.py [--force] [ids...]"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
jobs = json.load(open(os.path.join(ROOT, "footage/prep_jobs.json"), encoding="utf-8"))
out_dir = os.path.join(ROOT, "public/shots"); os.makedirs(out_dir, exist_ok=True)
force = "--force" in sys.argv
only = {a for a in sys.argv[1:] if not a.startswith("--")}


def probe(path):
    o = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height",
                                 "-of", "csv=p=0", path]).decode().strip().split(",")
    return int(o[0]), int(o[1])


def run(j):
    out = os.path.join(out_dir, j["id"] + ".mp4")
    if os.path.exists(out) and not force and not only:
        return j["id"], "skip"
    src = os.path.join(ROOT, "footage/seg", j["seg"] + ".mp4")
    w, h = probe(src)
    cw = int(round(h * 2 / 3 / 2) * 2)
    x = int(min(max(0, j["fx"] * w - cw / 2), w - cw))
    up = 1920 / h
    sharpen = ",unsharp=5:5:0.55:5:5:0.0" if up > 1.6 else (",unsharp=3:3:0.3" if up > 1.0 else "")
    # one consistent documentary grade: slightly lifted contrast, restrained saturation,
    # cool shadows / warm highlights, gentle roll-off
    grade = (f"eq=contrast=1.08:brightness=-0.015:saturation={j['sat']}:gamma=0.97,"
             "colorbalance=rs=-0.035:gs=-0.005:bs=0.045:rm=0.0:bm=0.0:rh=0.045:gh=0.012:bh=-0.035,"
             "curves=all='0/0.02 0.25/0.22 0.5/0.5 0.78/0.8 1/0.97'")
    vf = f"crop={cw}:{h}:{x}:0,scale=1280:1920:flags=lanczos{sharpen},{grade},format=yuv420p"
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{j['in']:.3f}", "-i", src, "-t", f"{j['dur']:.3f}", "-an", "-vf", vf,
           "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-g", "15", "-movflags", "+faststart", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    # guard against segments that are too short (would freeze on the last frame)
    seg_dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]).decode())
    warn = " SHORT-SOURCE" if j["in"] + j["dur"] > seg_dur + 0.01 else ""
    return j["id"], ("ok" if r.returncode == 0 else "FAIL " + r.stderr[-300:]) + warn


sel = [j for j in jobs if not only or j["id"] in only]
with ThreadPoolExecutor(3) as ex:
    for jid, status in ex.map(run, sel):
        print(f"{status:6s} {jid}", flush=True)
