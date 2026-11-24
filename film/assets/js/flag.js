// Waving flag of the Republic of Kazakhstan, rendered from the official SVG
// (sky-blue field, golden sun with 32 rays, steppe eagle, national ornament).
// Deterministic: the picture depends only on the time passed to draw().
(function (global) {
  const FLAG_W = 1000, FLAG_H = 500; // SVG aspect 2:1
  let src = null, ready = false;

  function load(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = FLAG_W * 2; c.height = FLAG_H * 2;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        src = c; ready = true; resolve();
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  }

  // Draw a flag whose hoist (pole side) top corner is at (x, y), width w.
  // t: seconds; wind: 0..1 strength; light: direction of light (-1..1)
  function draw(ctx, x, y, w, t, opts = {}) {
    if (!ready) return;
    const wind = opts.wind ?? 0.8, alpha = opts.alpha ?? 1, lightBias = opts.light ?? 0.3;
    const h = w / 2;
    const sw = src.width, sh = src.height;
    const strip = Math.max(1, w / 600);
    const amp = h * 0.075 * wind;
    const k1 = 2 * Math.PI / (w * 0.62), k2 = 2 * Math.PI / (w * 0.29);
    const om1 = 4.2 * (0.6 + wind * 0.6), om2 = 6.9 * (0.6 + wind * 0.6);
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let dx = 0; dx < w; dx += strip) {
      const u = dx / w;                // 0 at hoist, 1 at fly end
      const pin = Math.pow(u, 0.85);   // pinned at the pole
      const ph1 = k1 * dx - om1 * t, ph2 = k2 * dx - om2 * t + 1.3;
      const off = amp * pin * (Math.sin(ph1) + 0.35 * Math.sin(ph2));
      const slope = pin * (Math.cos(ph1) * 0.9 + 0.35 * Math.cos(ph2) * (k2 / k1));
      const sag = h * 0.04 * u * u * (1 - wind * 0.5); // fly end droops slightly
      const squeeze = 1 - 0.035 * pin * Math.abs(Math.sin(ph1));
      const hh = h * squeeze;
      const yy = y + off + sag + (h - hh) / 2;
      ctx.drawImage(src, u * sw, 0, Math.max(1, sw * strip / w), sh, x + dx, yy, strip + 0.75, hh);
      // fold shading
      const s = (slope + lightBias) * 0.5;
      if (s > 0) { ctx.fillStyle = `rgba(255,248,225,${Math.min(0.28, s * 0.32)})`; }
      else { ctx.fillStyle = `rgba(4,16,40,${Math.min(0.42, -s * 0.48)})`; }
      ctx.fillRect(x + dx, yy, strip, hh);
    }
    ctx.restore();
  }

  function pole(ctx, x, top, bottom, width, color = '#2a2a2e', hi = 'rgba(255,220,170,0.55)') {
    const g = ctx.createLinearGradient(x - width / 2, 0, x + width / 2, 0);
    g.addColorStop(0, color); g.addColorStop(0.35, hi); g.addColorStop(0.6, color); g.addColorStop(1, '#0d0d10');
    ctx.fillStyle = g;
    ctx.fillRect(x - width / 2, top, width, bottom - top);
    ctx.beginPath(); ctx.arc(x, top, width * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = '#c9a54a'; ctx.fill();
  }

  global.FLAG = { load, draw, pole, isReady: () => ready };
})(window);
