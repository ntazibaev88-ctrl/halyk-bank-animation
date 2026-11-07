"""Copy Cyrillic+Latin font subsets from @fontsource into assets/fonts and write
the same @font-face block into every <style data-fonts> in index.html and
compositions/*.html (lint wants faces declared in the file that uses them)."""
import glob, os, re, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACES = [  # family, package, file stem, weights
    ("MC Display", "oswald", "oswald", [400, 500, 600, 700]),
    ("MC Sans", "inter", "inter", [400, 500, 600, 700, 800]),
    ("MC Serif", "playfair-display", "playfair-display", [400, 600, 700]),
    ("MC Mono", "jetbrains-mono", "jetbrains-mono", [400, 600]),
]
RANGES = {
    "latin": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    "cyrillic": "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
}
css = []
for fam, pkg, stem, weights in FACES:
    for w in weights:
        for sub, rng in RANGES.items():
            name = f"{stem}-{sub}-{w}-normal.woff2"
            src = os.path.join(ROOT, "node_modules/@fontsource", pkg, "files", name)
            shutil.copy(src, os.path.join(ROOT, "assets/fonts", name))
            css.append(f"@font-face{{font-family:'{fam}';font-weight:{w};font-display:block;src:url('assets/fonts/{name}') format('woff2');unicode-range:{rng}}}")
block = "\n".join(css)
for f in [os.path.join(ROOT, "index.html")] + glob.glob(os.path.join(ROOT, "compositions/*.html")):
    if not os.path.exists(f): continue
    s = open(f, encoding="utf-8").read()
    n = re.sub(r"(<style data-fonts>)(.*?)(</style>)", lambda m: m.group(1) + "\n" + block + "\n" + m.group(3), s, flags=re.S)
    if n != s: open(f, "w", encoding="utf-8").write(n); print("fonts →", os.path.relpath(f, ROOT))
