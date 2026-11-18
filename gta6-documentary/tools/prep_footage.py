"""Cut, reframe (16:9 -> 9:16) and grade official GTA VI footage into shot slots.

Reads footage/clips.json (see footage/clips.example.json) and build/timeline.json.
Writes footage/cut/<SHOT>.mp4 at 2160x3840, 30 fps, graded, with 0.5 s handles,
and footage/cut/report.json with each clip's native resolution and upscale factor
(a 9:16 crop of a 3840x2160 source is 1215x2160 native pixels -> x1.78 upscale;
this is reported, never hidden).
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
W, H, FPS = 2160, 3840, 30
GRADE = ("eq=contrast=1.06:saturation=1.08:gamma=0.98,"
         "colorbalance=rs=-0.02:gs=0.0:bs=0.035:rh=0.035:gh=0.01:bh=-0.03,"
         "curves=all='0/0.015 0.25/0.22 0.5/0.5 0.8/0.81 1/0.95'")


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height,r_frame_rate", "-of", "json", path],
                         check=True, capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"]


def main():
    cfg_path = os.path.join(ROOT, "footage", "clips.json")
    if not os.path.exists(cfg_path):
        print("no footage/clips.json - nothing to prepare (all shots stay animatic slates)")
        return
    cfg = json.load(open(cfg_path))
    tl = json.load(open(os.path.join(ROOT, "build", "timeline.json")))
    shots = {s["id"]: s for s in tl["shots"]}
    os.makedirs(os.path.join(ROOT, "footage", "cut"), exist_ok=True)
    report = {}
    for sid, c in cfg.items():
        if sid.startswith("_"):
            continue
        if sid not in shots:
            sys.exit(f"{sid}: not a shot in the timeline")
        src = os.path.join(ROOT, "footage", c["src"])
        sw, sh = probe(src)
        speed = float(c.get("speed", 1.0))
        need = shots[sid]["dur"] + 0.6                 # shot + handle for fades
        crop_w = min(sw, round(sh * 9 / 16 / 2) * 2)
        crop_h = sh if crop_w < sw else round(sw * 16 / 9 / 2) * 2
        fx = float(c.get("focus_x", 0.5))
        x = int(max(0, min(sw - crop_w, fx * sw - crop_w / 2)))
        y = int((sh - crop_h) / 2)
        up = W / crop_w
        vf = (f"setpts=PTS/{speed},fps={FPS},crop={crop_w}:{crop_h}:{x}:{y},"
              f"scale={W}:{H}:flags=lanczos,{GRADE},format=yuv420p")
        out = os.path.join(ROOT, "footage", "cut", f"{sid}.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(c.get("in", 0)), "-t", f"{need * speed:.3f}",
                        "-i", src, "-an", "-vf", vf, "-t", f"{need:.3f}", "-c:v", "libx264", "-preset", "slow",
                        "-crf", "14", "-g", str(FPS), "-movflags", "+faststart", out], check=True)
        report[sid] = {"src": c["src"], "in": c.get("in", 0), "native_crop": f"{crop_w}x{crop_h}",
                       "upscale": round(up, 2), "speed": speed, "note": c.get("note", "")}
        flag = "  (upscaled - source is below native 4K for a vertical crop)" if up > 1.01 else ""
        print(f"{sid}: {c['src']} @ {c.get('in', 0)}s crop {crop_w}x{crop_h} -> {W}x{H} x{up:.2f}{flag}")
    json.dump(report, open(os.path.join(ROOT, "footage", "cut", "report.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
