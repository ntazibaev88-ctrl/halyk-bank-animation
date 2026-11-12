"""Cut source segments (native resolution, video only, H.264 near-lossless) from NASA (remote, seekable
through scripts/rangeproxy.py on :8899) or downloaded Commons files.  Spec: footage/segments.json"""
import json, os, subprocess, sys, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = json.load(open(os.path.join(ROOT, "footage/segments.json"), encoding="utf-8"))
out_dir = os.path.join(ROOT, "footage/seg"); os.makedirs(out_dir, exist_ok=True)
only = set(sys.argv[1:])

def nasa_url(nid, variant):
    q = urllib.parse.quote(nid)
    return f"https://images-assets.nasa.gov/video/{q}/{q}~{variant}.mp4"

for key, s in spec["segments"].items():
    if only and key not in only: continue
    out = os.path.join(out_dir, key + ".mp4")
    if os.path.exists(out) and not only: continue
    src = s["src"]
    if src.startswith("nasa:"):
        url = nasa_url(src[5:], s.get("variant", "large"))
        inp = "http://127.0.0.1:8899/?u=" + urllib.parse.quote(url, safe="")
    else:
        inp = os.path.join(ROOT, "footage/raw", src)
        if not os.path.exists(inp):
            print("missing", key, src); continue
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(s["start"]), "-i", inp, "-t", str(s["dur"]), "-an",
           "-vf", "scale='min(3840,iw)':-2,fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-crf", "14", out]
    r = subprocess.run(cmd)
    print(("ok  " if r.returncode == 0 else "FAIL"), key)
