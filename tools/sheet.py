import sys, glob
from PIL import Image
fs = sys.argv[2:]
ims = [Image.open(f) for f in fs]
w, h = ims[0].size; cols = min(4, len(ims)); rows = (len(ims) + cols - 1) // cols
out = Image.new('RGB', (w * cols, h * rows))
for i, im in enumerate(ims): out.paste(im, ((i % cols) * w, (i // cols) * h))
out.save(sys.argv[1])
