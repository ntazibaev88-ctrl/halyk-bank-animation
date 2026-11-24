"""Prepare every footage shot as a graded 2160x3840 / 30 fps clip with FFmpeg.

mode 'full'   : crop to 9:16 (horizontal position cx 0..1) and scale to 2160x3840
mode 'framed' : whole frame kept (archival / low-res), placed over a blurred copy of itself
grade         : 'cine' (warm highlights, natural skin, deeper shadows), 'archival' (toned
                monochrome-ish film look), 'night' (cool winter night), 'soft' (gentle).
"""
import os, subprocess, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shots import resolve
SHOTS = resolve()

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
RAW = "media/raw"
OUT = "assets/shots"
W, H = 2160, 3840

GRADES = {
    # lift/gamma/gain feel via curves + eq; warm highlights, slightly teal shadows
    "cine": "eq=contrast=1.06:saturation=1.08:gamma=0.98,"
            "curves=r='0/0 0.25/0.23 0.75/0.79 1/1':g='0/0 0.25/0.24 0.75/0.76 1/0.98':b='0/0.02 0.25/0.26 0.75/0.72 1/0.93',"
            "colorbalance=rs=-0.02:bs=0.03:rh=0.04:bh=-0.04",
    "soft": "eq=contrast=1.03:saturation=1.04,colorbalance=rh=0.03:bh=-0.03",
    "archival": "hqdn3d=2:2:4:4,eq=contrast=1.12:saturation=0.25:gamma=0.95,"
                "colorchannelmixer=rr=0.95:rg=0.05:gg=0.92:gb=0.04:bb=0.80:br=0.06,"
                "curves=all='0/0.04 0.5/0.48 1/0.94'",
    "night": "eq=contrast=1.08:saturation=0.7:gamma=0.92,colorbalance=rs=-0.06:bs=0.10:rm=-0.04:bm=0.06",
}

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2000:]); raise SystemExit(1)

def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "json", path], capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"]

def locate(name):
    for d in ("media/raw", "media/mixkit", "media/nasa"):
        if os.path.exists(f"{d}/{name}"):
            return f"{d}/{name}"
    return None

def prep(s, force=False):
    out = f"{OUT}/{s['id']}.mp4"
    if os.path.exists(out) and not force:
        return
    src = locate(s["src"])
    if src is None and s.get("fallback"):
        print("  ", s["id"], "source", s["src"], "not downloaded; using fallback", s["fallback"])
        s = dict(s, src=s["fallback"], src_in=s.get("fb_in", 1.0), label=None)
        src = locate(s["src"])
    if src is None:
        print("  ", s["id"], "MISSING source", s["src"]); return
    dur = s["end"] + s.get("tail", 0) - s["start"] + 0.4
    w, h = probe(src)
    mode = s.get("mode", "framed" if s.get("archival") or (w < 1000 and s.get("mode") != "full") else "full")
    grade = GRADES[s.get("grade", "archival" if s.get("archival") else "cine")]
    pre = "yadif=deint=interlaced," if s.get("archival") else ""
    speed = s.get("speed", 1.0)
    ts = f"setpts={1/speed:.4f}*PTS," if speed != 1.0 else ""
    if mode == "full":
        cx = s.get("cx", 0.5)
        # crop the largest 9:16 window, then scale with lanczos and a gentle sharpen
        cw = min(w, int(h * 9 / 16)) // 2 * 2
        ch = min(h, int(cw * 16 / 9)) // 2 * 2
        zoom = s.get("zoom", 1.0)
        cw2, ch2 = int(cw / zoom) // 2 * 2, int(ch / zoom) // 2 * 2
        x = int((w - cw2) * cx); y = int((h - ch2) * s.get("cy", 0.5))
        vf = (f"{pre}{ts}fps=30,crop={cw2}:{ch2}:{x}:{y},scale={W}:{H}:flags=lanczos,{grade},"
              f"unsharp=5:5:0.45:5:5:0.0,format=yuv420p")
        cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(s["src_in"]), "-i", src, "-t", f"{dur:.3f}", "-an", "-vf", vf]
    else:
        fw = 2040
        fh = int(fw * h / w) // 2 * 2
        fc = (f"[0:v]{pre}{ts}fps=30,split[a][b];"
              f"[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=40:3,eq=brightness=-0.22:saturation=0.5,{grade}[bg];"
              f"[b]scale={fw}:{fh}:flags=lanczos,{grade},unsharp=5:5:0.35:5:5:0.0,"
              f"vignette=angle=0.5[fg];"
              f"[bg][fg]overlay=(W-w)/2:(H-h)/2-{s.get('fy', 80)},format=yuv420p")
        cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(s["src_in"]), "-i", src, "-t", f"{dur:.3f}", "-an", "-filter_complex", fc]
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "15", "-g", "30", "-r", "30", "-pix_fmt", "yuv420p", out]
    run(cmd)
    print("prepared", s["id"], mode, f"{w}x{h}", "->", out)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[1:]
    for s in SHOTS:
        if s["kind"] == "video" and (not only or s["id"] in only):
            prep(s, force=bool(only))
