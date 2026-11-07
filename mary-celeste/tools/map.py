"""Project Natural Earth 10m land (public domain) into a Mercator chart for the
North Atlantic and write assets/data/atlantic.json: land path, graticule and
named points in chart pixels. Source: github.com/nvkelso/natural-earth-vector."""
import json, math, sys
SRC = sys.argv[1]
LON0, LON1, LAT0, LAT1 = -84.0, 18.0, 20.0, 57.0
PXDEG = 40.0
def merc(lat): return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))
YTOP = merc(LAT1)
def P(lon, lat): return ((lon - LON0) * PXDEG, (YTOP - merc(lat)) * PXDEG)
W, H = P(LON1, LAT0)

def dp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; n = math.hypot(dx, dy) or 1e-9
    i, dmax = 0, -1
    for k in range(1, len(pts) - 1):
        d = abs(dy * pts[k][0] - dx * pts[k][1] + x2 * y1 - y2 * x1) / n
        if d > dmax: i, dmax = k, d
    if dmax > eps: return dp(pts[:i + 1], eps)[:-1] + dp(pts[i:], eps)
    return [pts[0], pts[-1]]

sys.setrecursionlimit(100000)
paths = []
for f in json.load(open(SRC))["features"]:
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        for ring in poly:
            lons = [p[0] for p in ring]; lats = [p[1] for p in ring]
            if max(lons) < LON0 - 5 or min(lons) > LON1 + 5 or max(lats) < LAT0 - 5 or min(lats) > LAT1 + 5: continue
            pts = [P(max(LON0 - 6, min(LON1 + 6, x)), max(LAT0 - 6, min(LAT1 + 6, y))) for x, y in ring]
            h = len(pts) // 2
            pts = dp(pts[:h + 1], 0.9)[:-1] + dp(pts[h:], 0.9)
            if len(pts) < 3: continue
            paths.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z")

grat = []
for lon in range(-80, 20, 10):
    (x, _), = [P(lon, 0)]; grat.append({"lon": lon, "x": round(x, 1)})
lats = []
for lat in range(25, 60, 5):
    lats.append({"lat": lat, "y": round(P(0, lat)[1], 1)})

named = {
    "newyork": (-74.01, 40.71), "genoa": (8.93, 44.41), "gibraltar": (-5.6, 35.95),
    "santamaria": (-25.1, 36.97), "discovery": (-17.25, 38.333),
}
route_planned = [(-74.01, 40.71), (-71.5, 40.2), (-60, 39.4), (-45, 38.4), (-33, 37.6), (-25.0, 37.08),
                 (-17.25, 38.333), (-9.8, 36.9), (-5.6, 35.95), (0.5, 37.3), (5.5, 40.6), (8.93, 44.41)]
out = {
    "width": round(W, 1), "height": round(H, 1), "pxPerDeg": PXDEG,
    "land": "".join(paths),
    "meridians": grat, "parallels": lats,
    "points": {k: [round(c, 1) for c in P(*v)] for k, v in named.items()},
    "route": [[round(c, 1) for c in P(*v)] for v in route_planned],
    "discoveryIndex": 6,
}
json.dump(out, open("assets/data/atlantic.json", "w"))
print(W, H, len(paths), len(out["land"]) // 1024, "KB", out["points"])

# Static chart artwork: land with layered "water-line" strokes like an engraved chart.
land = out["land"]
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W:.0f}" height="{H:.0f}" viewBox="0 0 {W:.0f} {H:.0f}">
<defs><path id="l" d="{land}"/></defs>
<g fill="none" stroke-linejoin="round">
<use href="#l" stroke="#8fa6bd" stroke-opacity="0.05" stroke-width="34"/>
<use href="#l" stroke="#8fa6bd" stroke-opacity="0.07" stroke-width="18"/>
<use href="#l" stroke="#a9bccf" stroke-opacity="0.12" stroke-width="7"/>
</g>
<use href="#l" fill="#2c3846" stroke="#d3dde6" stroke-opacity="0.8" stroke-width="1.6"/>
</svg>'''
open("assets/img/atlantic-land.svg", "w").write(svg)
del out["land"]
json.dump(out, open("assets/data/atlantic.json", "w"), indent=1)
