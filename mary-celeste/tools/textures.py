"""Procedural textures (seeded): film grain, fog, aged paper, dark wood."""
import numpy as np
from PIL import Image, ImageFilter
rng = np.random.default_rng(1872)
OUT = "assets/img/"

def fbm(h, w, octaves=6, base=4, seed=0, tile_x=True):
    r = np.random.default_rng(seed); acc = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        gh, gw = base * 2 ** o, base * 2 ** o * w // h
        g = r.random((gh + 1, gw + 1))
        if tile_x: g[:, -1] = g[:, 0]
        img = Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += amp * np.asarray(img, dtype=np.float32) / 255; tot += amp; amp *= 0.5
    return acc / tot

# 1. grain: 512² monochrome noise, mid-grey centred (for overlay blend)
g = rng.normal(0.5, 0.16, (512, 512)).clip(0, 1)
Image.fromarray((g * 255).astype(np.uint8), "L").save(OUT + "grain.png", optimize=True)

# 2. fog: tileable horizontally, white with alpha from fBm
for i, (h, w, base) in enumerate([(1024, 2048, 2), (1024, 2048, 3)]):
    n = fbm(h, w, 7, base, seed=10 + i)
    a = np.clip((n - 0.42) * 2.6, 0, 1) ** 1.6
    yy = np.linspace(0, 1, h)[:, None]; e = np.clip(np.minimum(yy, 1 - yy) / 0.3, 0, 1); a *= e * e * (3 - 2 * e)  # soft top/bottom
    rgba = np.dstack([np.full((h, w), c, np.uint8) for c in (214, 224, 234)] + [(a * 255).astype(np.uint8)])
    Image.fromarray(rgba, "RGBA").save(OUT + f"fog-{i + 1}.png", optimize=True)

# 3. aged paper 1200x1600
h, w = 1600, 1200
n1 = fbm(h, w, 7, 3, seed=31, tile_x=False); n2 = fbm(h, w, 5, 8, seed=32, tile_x=False)
base = np.array([196, 178, 142], np.float32)
img = base[None, None, :] * (0.86 + 0.22 * n1[..., None]) - 34 * np.clip((n2[..., None] - 0.55) / 0.25, 0, 1) ** 2
fib = rng.normal(0, 1, (h, w)); fib = np.asarray(Image.fromarray(((fib * 30) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), np.float32) - 128
img += fib[..., None] * 0.35
yy, xx = np.mgrid[0:h, 0:w]; d = np.maximum(np.abs(xx / w - 0.5), np.abs(yy / h - 0.5)) * 2
img *= (1 - 0.35 * np.clip(d - 0.55, 0, 1) ** 1.2 / 0.45 ** 1.2)[..., None]
Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGB").save(OUT + "paper.jpg", quality=88)

# 4. dark wood 1080x1920 (planks run vertically)
h, w = 1920, 1080
n = fbm(h, w, 6, 2, seed=41, tile_x=False)
xx = np.arange(w)[None, :].astype(np.float32)
warp = (n - 0.5) * 60
warp = (n - 0.5) * 140
rings = np.sin((xx + warp) * 0.045 + 6 * np.sin((np.arange(h)[:, None]) * 0.0016 + xx * 0.01)) * 0.5 + 0.5
streak = fbm(h, w, 6, 1, seed=42, tile_x=False)
v = 0.6 + 0.16 * rings + 0.5 * (streak - 0.5)
plank = (xx % 270 < 3).astype(np.float32); v = v * (1 - 0.6 * plank)
col = np.array([58, 38, 24], np.float32)
img = col[None, None, :] * v[..., None]
Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGB").save(OUT + "wood.jpg", quality=86)
print("ok")
