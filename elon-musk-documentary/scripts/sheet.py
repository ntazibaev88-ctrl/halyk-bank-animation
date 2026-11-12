"""Contact sheet: sheet.py <url-or-file> <out.jpg> [start] [end] [n] [cols]"""
import sys, subprocess, urllib.parse, os, tempfile, concurrent.futures as cf
src, out = sys.argv[1], sys.argv[2]
if src.startswith("http"):
    src = "http://127.0.0.1:8899/?u=" + urllib.parse.quote(src, safe="")
dur = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",src]).decode().strip().split("\n")[0])
s = float(sys.argv[3]) if len(sys.argv) > 3 else 0
e = float(sys.argv[4]) if len(sys.argv) > 4 and float(sys.argv[4]) > 0 else dur
n = int(sys.argv[5]) if len(sys.argv) > 5 else 16
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 4
td = tempfile.mkdtemp()
ts = [s + (e - s) * (i + 0.5) / n for i in range(n)]
def grab(i_t):
    i, t = i_t
    p = f"{td}/{i:03d}.jpg"
    subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{t:.2f}","-i",src,"-frames:v","1","-vf",
        f"scale=400:-2,drawtext=text='{t:.1f}s':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6","-q:v","4",p])
    return p
with cf.ThreadPoolExecutor(6) as ex: list(ex.map(grab, enumerate(ts)))
subprocess.run(["ffmpeg","-v","error","-y","-i",f"{td}/%03d.jpg","-vf",f"tile={cols}x{(n+cols-1)//cols}:padding=4","-frames:v","1",out])
print(f"dur={dur:.1f}s ->", out)
