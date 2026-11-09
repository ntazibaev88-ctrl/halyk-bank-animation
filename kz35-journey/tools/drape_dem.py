"""Builds a height grid aligned to a fetched Sentinel image (AWS Terrain Tiles, terrarium, zoom 12).
python3 tools/drape_dem.py <name> [grid=384]  -> world3d/assets/<name>_dem.f32 + <name>_dem.json"""
import sys, os, json, math, io, urllib.request, ssl, subprocess
import numpy as np
from pyproj import Transformer
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name = sys.argv[1]; G = int(sys.argv[2]) if len(sys.argv) > 2 else 384
meta = json.load(open(os.path.join(R, "assets/sat", name + ".json")))
x0, y0, x1, y1 = meta["bbox_utm"]
tr = Transformer.from_crs(meta["crs"], "EPSG:4326", always_xy=True)
xs = np.linspace(x0, x1, G); ys = np.linspace(y1, y0, G)   # row 0 = north
X, Y = np.meshgrid(xs, ys); LON, LAT = tr.transform(X, Y)
Z = 12; n = 2 ** Z
fx = (LON + 180) / 360 * n; fy = (1 - np.log(np.tan(np.radians(LAT)) + 1 / np.cos(np.radians(LAT))) / math.pi) / 2 * n
ctx = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt"); cache = {}
def tile(tx, ty):
    if (tx, ty) not in cache:
        raw = urllib.request.urlopen(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{tx}/{ty}.png", context=ctx, timeout=60).read()
        px = subprocess.run(["ffmpeg", "-v", "error", "-i", "-", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], input=raw, capture_output=True).stdout
        a = np.frombuffer(px, np.uint8).reshape(256, 256, 3).astype(np.float64)
        cache[(tx, ty)] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    return cache[(tx, ty)]
H = np.zeros_like(LON)
for i in range(G):
    for j in range(G):
        px, py = fx[i, j] * 256, fy[i, j] * 256
        tx, ty = int(px // 256), int(py // 256); u, v = px - tx * 256, py - ty * 256
        t = tile(tx, ty); u0, v0 = min(int(u), 254), min(int(v), 254); du, dv = u - u0, v - v0
        H[i, j] = (t[v0, u0] * (1 - du) + t[v0, u0 + 1] * du) * (1 - dv) + (t[v0 + 1, u0] * (1 - du) + t[v0 + 1, u0 + 1] * du) * dv
out = os.path.join(R, "world3d/assets", name + "_dem")
H.astype(np.float32).tofile(out + ".f32")
json.dump({"grid": G, "width_m": x1 - x0, "height_m": y1 - y0, "min": float(H.min()), "max": float(H.max())}, open(out + ".json", "w"))
print(name, "dem", H.min(), H.max())
