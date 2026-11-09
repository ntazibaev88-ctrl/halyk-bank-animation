"""Fetch real Copernicus Sentinel-2 L2A true-colour imagery (AWS open data) for a place.
python3 tools/sentinel.py <name> <lat> <lon> <width_km> <height_km> <out_w> <out_h> [months e.g. 2024-07,2024-08]
Writes assets/sat/<name>.jpg (graded) and <name>.json (scene id, date, bbox, pixel mapping)."""
import os, sys, json, math, urllib.request, ssl
import numpy as np, rasterio, mgrs
from rasterio.windows import from_bounds
from rasterio.enums import Resampling
from pyproj import Transformer
os.environ.update({"AWS_NO_SIGN_REQUEST": "YES", "GDAL_DISABLE_READDIR_ON_OPEN": "EMPTY_DIR", "CPL_VSIL_CURL_ALLOWED_EXTENSIONS": ".tif",
                   "CURL_CA_BUNDLE": "/root/.ccr/ca-bundle.crt", "GDAL_HTTP_MULTIRANGE": "YES", "GDAL_HTTP_MERGE_CONSECUTIVE_RANGES": "YES"})
B = "https://sentinel-cogs.s3.us-west-2.amazonaws.com"
ctx = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
def get(u): return urllib.request.urlopen(u, context=ctx, timeout=60).read().decode()
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name = sys.argv[1]; lat, lon, wk, hk, ow, oh = map(float, sys.argv[2:8])
ow, oh = int(ow), int(oh)
months = (sys.argv[8] if len(sys.argv) > 8 else "2024-07,2024-08,2025-07,2025-08,2024-06,2025-06,2024-09").split(",")
M = mgrs.MGRS(); dlat = hk / 222.0; dlon = wk / (222.0 * math.cos(math.radians(lat)))
tiles = []
for la2, lo2 in [(lat, lon), (lat + dlat, lon - dlon), (lat + dlat, lon + dlon), (lat - dlat, lon - dlon), (lat - dlat, lon + dlon), (lat, lon - 2 * dlon), (lat, lon + 2 * dlon)]:
    tt = M.toMGRS(la2, lo2, MGRSPrecision=0)
    if tt not in tiles: tiles.append(tt)
cands = []
for tile in tiles:
  zone, band, sq = tile[:2], tile[2], tile[3:5]
  for ym in months:
    y, m = ym.split("-"); pre = f"sentinel-s2-l2a-cogs/{int(zone)}/{band}/{sq}/{y}/{int(m)}/"
    xml = get(f"{B}/?list-type=2&prefix={pre}&delimiter=/")
    for p in xml.split("<Prefix>")[2:]:
        sid = p.split("</Prefix>")[0].rstrip("/").split("/")[-1]
        try:
            st = json.loads(get(f"{B}/{pre}{sid}/{sid}.json")); cc = st["properties"].get("eo:cloud_cover", 100)
            cands.append((cc, sid, pre, st["properties"].get("datetime", "")))
        except Exception as e:
            pass
cands.sort()
best = None
for cc, sid, pre, dt in cands[:30]:
    url = f"/vsicurl/{B}/{pre}{sid}/TCI.tif"
    with rasterio.open(url) as src:
        tr = Transformer.from_crs("EPSG:4326", src.crs, always_xy=True)
        cx, cy = tr.transform(lon, lat)
        bx = (cx - wk * 500, cy - hk * 500, cx + wk * 500, cy + hk * 500)
        b = src.bounds
        if bx[2] - bx[0] > b.right - b.left or bx[3] - bx[1] > b.top - b.bottom: continue
        dx = max(0, b.left - bx[0]) - max(0, bx[2] - b.right); dy = max(0, b.bottom - bx[1]) - max(0, bx[3] - b.top)
        if abs(dx) > wk * 300 or abs(dy) > hk * 300: continue   # never shift more than 30 % of the window
        bx = (bx[0] + dx, bx[1] + dy, bx[2] + dx, bx[3] + dy)
        tpx = ((cx - bx[0]) / (bx[2] - bx[0]) * ow, (bx[3] - cy) / (bx[3] - bx[1]) * oh)
        win = from_bounds(*bx, transform=src.transform)
        # quick cloud/nodata test on a small read of SCL
        with rasterio.open(f"/vsicurl/{B}/{pre}{sid}/SCL.tif") as scl:
            w2 = from_bounds(*bx, transform=scl.transform)
            s = scl.read(1, window=w2, out_shape=(120, int(120 * wk / hk)), resampling=Resampling.nearest)
        bad = np.isin(s, [0, 1, 3, 8, 9, 10]).mean()
        print(name, sid, "tile cloud", cc, "window bad", round(float(bad), 4))
        if bad < 0.02:
            arr = src.read(window=win, out_shape=(3, oh, ow), resampling=Resampling.lanczos)
            best = (sid, dt, bx, src.crs.to_string(), arr, tpx); break
if not best:
    sys.exit(f"no clear scene for {name}")
sid, dt, bx, crs, arr, tpx = best
img = arr.transpose(1, 2, 0).astype(np.float32) / 255.0
# documentary grade: auto levels per channel (0.5–99.7 %), gentle S-curve, a little saturation
lum = img.mean(2)
lo, hi = np.percentile(lum, 0.5), np.percentile(lum, 99.6)   # one stretch for all channels keeps natural colour
img = np.clip((img - lo) / (hi - lo + 1e-6), 0, 1)
img = img ** 0.92
img = 0.5 + (img - 0.5) * 1.08
l = img.mean(2, keepdims=True); img = np.clip(l + (img - l) * 1.12, 0, 1)
os.makedirs(os.path.join(R, "assets/sat"), exist_ok=True)
out = os.path.join(R, "assets/sat", name)
import subprocess
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{ow}x{oh}", "-i", "-", "-q:v", "2", out + ".jpg"], input=(img * 255).astype(np.uint8).tobytes(), check=True)
json.dump({"name": name, "scene": sid, "date": dt[:10], "lat": lat, "lon": lon, "bbox_utm": bx, "crs": crs, "width_km": wk, "height_km": hk, "px": [ow, oh], "target_px": [round(tpx[0], 1), round(tpx[1], 1)],
           "credit": f"Contains modified Copernicus Sentinel data {dt[:4]}"}, open(out + ".json", "w"), indent=1)
print("saved", out + ".jpg", sid, dt[:10])
