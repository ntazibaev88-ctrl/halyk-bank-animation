"""Automated checks on the rendered film: format, duration, black frames, frozen frames, loudness,
and a contact sheet of one frame every 2 seconds for visual review."""
import json, os, re, subprocess, sys
f = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", f]))
v = [s for s in pr["streams"] if s["codec_type"] == "video"][0]
a = [s for s in pr["streams"] if s["codec_type"] == "audio"]
dur = float(pr["format"]["duration"])
print(f"video: {v['codec_name']} {v['profile']} {v['width']}x{v['height']} {v['r_frame_rate']} {v['pix_fmt']}")
print(f"audio: {a[0]['codec_name']} {a[0]['sample_rate']}Hz ch={a[0]['channels']}" if a else "audio: MISSING")
print(f"duration: {dur:.2f}s  size: {int(pr['format']['size'])/2**20:.1f} MB")
ok = v["codec_name"] == "h264" and v["width"] == 1080 and v["height"] == 1920 and v["r_frame_rate"] == "30/1" and a

def filt(vf, af=None):
    cmd = ["ffmpeg", "-v", "info", "-i", f]
    cmd += (["-vf", vf, "-an"] if vf else ["-af", af, "-vn"]) + ["-f", "null", "-"]
    return subprocess.run(cmd, capture_output=True, text=True).stderr

bl = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", filt("blackdetect=d=0.2:pix_th=0.06"))
print("black segments >0.2s:", bl if bl else "none")
fr = re.findall(r"freeze_start: ([\d.]+)|freeze_duration: ([\d.]+)", filt("freezedetect=n=0.001:d=1.2"))
print("frozen segments >1.2s:", [x for x in fr if any(x)] or "none")
ln = filt(None, "ebur128=peak=true")
m = re.search(r"Integrated loudness:\s+I:\s+(-?[\d.]+) LUFS.*?True peak:\s+Peak:\s+(-?[\d.]+) dBFS", ln, re.S)
if m: print(f"loudness: {m.group(1)} LUFS integrated, true peak {m.group(2)} dBFS")
os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
sheet = os.path.join(ROOT, "out", "contact_sheet.jpg")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-vf", "fps=1/2,scale=216:-1,tile=10x6:padding=4", "-frames:v", "1", "-q:v", "3", sheet])
print("contact sheet:", sheet)
print("FORMAT OK" if ok else "FORMAT PROBLEM")
