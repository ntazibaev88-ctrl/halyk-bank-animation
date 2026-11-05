/* KIT — deterministic procedural graphics toolkit for the "Almaty vs Astana" film.
   Everything is a pure function of time/seed (no Math.random / Date), so frames are reproducible. */
(function () {
  const W = 1080, H = 1920;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = {
    io: t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out: t => 1 - Math.pow(1 - clamp(t), 3),
    in: t => clamp(t) ** 3,
    outq: t => 1 - Math.pow(1 - clamp(t), 5),
  };
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // ---- value noise ----
  function makeNoise(seed) {
    const r = rng(seed), P = new Uint8Array(512), V = new Float32Array(256);
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
    for (let i = 0; i < 256; i++) V[i] = r();
    const sm = t => t * t * (3 - 2 * t);
    const n2 = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
      const a = V[P[(xi & 255) + P[yi & 255]]], b = V[P[((xi + 1) & 255) + P[yi & 255]]], c = V[P[(xi & 255) + P[(yi + 1) & 255]]], d = V[P[((xi + 1) & 255) + P[(yi + 1) & 255]]];
      return lerp(lerp(a, b, xf), lerp(c, d, xf), yf); };
    const fbm = (x, y, o = 4) => { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += a * n2(x * f, y * f); n += a; a *= .5; f *= 2.03; } return s / n; };
    return { n2, fbm };
  }
  // ---- colour ----
  const hex = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  function gradient(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }

  // ---- sky with sun glow ----
  function sky(w, h, stops, sun) {
    const c = canvas(w, h), x = c.getContext('2d');
    x.fillStyle = gradient(x, 0, 0, 0, h, stops); x.fillRect(0, 0, w, h);
    if (sun) { const g = x.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.r); g.addColorStop(0, sun.c0); g.addColorStop(.25, sun.c1); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    return c;
  }
  function stars(w, h, n, seed, maxY) { const c = canvas(w, h), x = c.getContext('2d'), r = rng(seed);
    for (let i = 0; i < n; i++) { const a = .25 + r() * .75, s = r() < .1 ? 2.2 : 1.2; x.fillStyle = `rgba(255,255,255,${a})`; x.beginPath(); x.arc(r() * w, r() * (maxY || h), s, 0, 7); x.fill(); } return c; }
  // ---- soft clouds (wide, scroll horizontally) ----
  function clouds(w, h, seed, { color = [255, 255, 255], alpha = .8, density = .55, scale = 1, sharp = 3.2 } = {}) {
    const c = canvas(w, h), x = c.getContext('2d'), id = x.createImageData(w, h), nz = makeNoise(seed);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const fy = 1 - Math.abs(j / h - .5) * 2; // fade top/bottom
      let n = nz.fbm(i / (260 * scale), j / (120 * scale), 5); n = clamp((n - density) * sharp) * fy * fy;
      const k = (j * w + i) * 4; const shade = .8 + .2 * nz.fbm(i / 90 + 9, j / 60, 3);
      id.data[k] = color[0] * shade; id.data[k + 1] = color[1] * shade; id.data[k + 2] = color[2]; id.data[k + 3] = n * 255 * alpha; }
    x.putImageData(id, 0, 0); return c;
  }
  // ---- mountain ridge with lighting, gullies, snow caps and atmospheric haze ----
  function ridge(o) {
    const { w, h, base, amp, freq = .004, seed = 1, rock = ['#1c2d44', '#5b7494'], snowAlt = 1e9, snow = ['#c9d6ee', '#ffffff'], haze = [10, 20, 40], hazeAmt = .35, sunDir = 1, sharp = 1.0, rough = 5 } = o;
    const c = canvas(w, h), x = c.getContext('2d'), nz = makeNoise(seed), id = x.createImageData(w, h), d = id.data;
    const top = new Float32Array(w + 16);
    for (let i = -8; i < w + 8; i++) { let n = nz.fbm(i * freq, 3.1, rough); const rg = 1 - Math.abs(n * 2 - 1); top[i + 8] = base - amp * Math.pow(lerp(n, rg, .55 * sharp), 1.35); }
    const rs = hex(rock[0]), rl = hex(rock[1]), ss = hex(snow[0]), sl = hex(snow[1]);
    for (let i = 0; i < w; i++) {
      const ty = top[i + 8], sl_ = (top[Math.max(0,i + 8 - 14)] - top[Math.min(w+15,i + 8 + 14)]) / 28 * sunDir; const lit = clamp(.5 + sl_ * .55);
      for (let j = Math.max(0, ty | 0); j < h; j++) {
        const dep = j - ty, g = nz.fbm(i * .011 + j * .012, j * .011 - i * .004, 4);
        const L = clamp(lit + (g - .5) * .8 * clamp(dep / 60, 0, 1) - dep * .0004);
        let col = mix(rs, rl, L);
        const alt = base - j + (nz.fbm(i * .02, j * .02, 3) - .5) * 160;
        if (alt > snowAlt) { const sm = clamp((alt - snowAlt) / 40); const sc = mix(ss, sl, clamp(L * 1.15)); col = mix(col, sc, sm * clamp(1.2 - g * .6)); }
        const hz = clamp(dep / Math.max(60, h - ty)) ; col = mix(col, haze, hazeAmt * (1 - hz * .55));
        const k = (j * w + i) * 4; d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = clamp(dep / 1.5) * 255;
      }
    }
    x.putImageData(id, 0, 0); c.topAt = i => top[clamp(i | 0, 0, w - 1) + 8]; return c;
  }
  // ---- buildings ----
  function skyline(o) {
    const { w, h, seed = 1, baseY, minW = 40, maxW = 110, minH = 80, maxH = 300, body = ['#16233a', '#0c1626'], win = ['#ffd98a', '#8fd0ff'], winDensity = .35, gap = 0, roof = true, edge = null } = o;
    const c = canvas(w, h), x = c.getContext('2d'), r = rng(seed); let px = -20;
    while (px < w + 20) {
      const bw = lerp(minW, maxW, r()), bh = lerp(minH, maxH, Math.pow(r(), 1.4)), by = baseY - bh;
      x.fillStyle = gradient(x, 0, by, 0, baseY, [[0, body[0]], [1, body[1]]]); x.fillRect(px, by, bw, bh + (h - baseY));
      if (edge) { x.fillStyle = edge; x.fillRect(px, by, 2, bh); }
      const cw = 9, ch = 14, gx = 6, gy = 8;
      for (let yy = by + 12; yy < baseY - 10; yy += ch + gy) for (let xx = px + 8; xx < px + bw - 12; xx += cw + gx) {
        if (r() < winDensity) { x.fillStyle = win[r() < .75 ? 0 : 1]; x.globalAlpha = .45 + r() * .55; x.fillRect(xx, yy, cw, ch); } }
      x.globalAlpha = 1;
      if (roof && r() < .35) { x.fillStyle = body[0]; x.fillRect(px + bw * .45, by - 36 * r() - 12, 3, 40); }
      px += bw + gap + (r() < .2 ? 10 : 0);
    }
    return c;
  }
  // ---- tree canopy cluster (for parks) ----
  function canopy(ctx, cx, cy, rad, pal, seed) {
    const r = rng(seed);
    for (let i = 0; i < 26; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * rad * .8, rr = rad * (.28 + r() * .3), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .8;
      const g = ctx.createRadialGradient(x - rr * .3, y - rr * .35, rr * .1, x, y, rr);
      const t = (y - cy) / rad * .5 + .5; g.addColorStop(0, rgb(mix(pal[2], pal[1], clamp(t)))); g.addColorStop(1, rgb(mix(pal[1], pal[0], clamp(t + .2))));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill(); }
  }

  // screen position of a point (px,py) in layer space
  function layerPoint(L, cam, px, py) {
    const d = L.d, s = (L.s || 1) * (1 + cam.z * (.25 + .9 * d)), cx = W / 2, cy = H / 2;
    const ox = L.ox !== undefined ? L.ox : -(L.c.width - W) / 2, oy = L.oy !== undefined ? L.oy : -(L.c.height - H) / 2;
    return [cx + (ox - cx) * s - cam.x * d * (1 + cam.z * .3) + px * s, cy + (oy - cy) * s - cam.y * d + py * s, s];
  }
  // stand of fir trees along a baseline (silhouette)
  function firs(w, h, baseY, seed, color, minH, maxH, n, tint) {
    const c = canvas(w, h), x = c.getContext('2d'), r = rng(seed);
    x.fillStyle = color; x.fillRect(0, baseY, w, h - baseY);
    for (let i = 0; i < n; i++) { const px = r() * w, th = lerp(minH, maxH, r()), tw = th * .28; let y = baseY + 6; x.fillStyle = tint && r() < .3 ? tint : color;
      for (let k = 0; k < 5; k++) { const lw = tw * (1 - k * .16), ly = y - th * .2 * (k + 1); x.beginPath(); x.moveTo(px - lw, ly + th * .22); x.lineTo(px, ly - th * .06); x.lineTo(px + lw, ly + th * .22); x.closePath(); x.fill(); } }
    return c;
  }
  // ---- grade: vignette, grain, light leak, bloom-ish overlay ----
  let grainTiles = null;
  function grain() { if (grainTiles) return grainTiles; grainTiles = []; for (let k = 0; k < 4; k++) { const c = canvas(270, 480), x = c.getContext('2d'), id = x.createImageData(270, 480), r = rng(900 + k);
      for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 26; } x.putImageData(id, 0, 0); grainTiles.push(c); } return grainTiles; }
  let vig = null;
  function grade(ctx, t, { vignette = .55, grainAmt = 1, tint = null } = {}) {
    if (!vig) { vig = canvas(W, H); const x = vig.getContext('2d'); const g = x.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    ctx.save(); ctx.globalAlpha = vignette; ctx.drawImage(vig, 0, 0); ctx.restore();
    if (tint) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (grainAmt) { const g = grain()[Math.floor(t * 24) % 4]; ctx.save(); ctx.globalAlpha = grainAmt; ctx.globalCompositeOperation = 'overlay'; const pat = ctx.createPattern(g, 'repeat'); ctx.scale(4, 4); ctx.fillStyle = pat; ctx.fillRect(0, 0, W / 4, H / 4); ctx.restore(); }
  }
  // ---- camera rig: draw parallax layers ----
  // layer: {c: canvas, d: depth 0(far)..1(near), ox, oy (canvas top-left on screen @cam0), s}
  function drawLayer(ctx, L, cam) {
    const d = L.d, s = (L.s || 1) * (1 + cam.z * (.25 + .9 * d)), cx = W / 2, cy = H / 2;
    const ox = L.ox !== undefined ? L.ox : -(L.c.width - W) / 2, oy = L.oy !== undefined ? L.oy : -(L.c.height - H) / 2;
    const tx = cx + (ox - cx) * s - cam.x * d * (1 + cam.z * .3), ty = cy + (oy - cy) * s - cam.y * d;
    ctx.save(); ctx.transform(s, 0, 0, s, tx, ty); if (L.a !== undefined) ctx.globalAlpha = L.a; ctx.drawImage(L.c, 0, 0); ctx.restore();
  }
  function glow(ctx, x, y, r, c, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgb(c, a)); g.addColorStop(1, rgb(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  // partial polyline stroke (animated architectural outlines)
  function strokeProgress(ctx, pts, p) {
    if (p <= 0) return; let tot = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
    let rem = tot * clamp(p); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length && rem > 0; i++) { const l = seg[i - 1]; if (rem >= l) { ctx.lineTo(pts[i][0], pts[i][1]); rem -= l; } else { const k = rem / l; ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); rem = 0; } }
    ctx.stroke();
  }
  // whip-pan / crossfade between shots inside a scene canvas
  function shotMix(ctx, lt, shots, drawShot, xfade = .3) {
    // shots: [{a,b}] local-time windows; drawShot(i, ctx, local, dur)
    let drew = 0;
    shots.forEach((s, i) => {
      const inN = i > 0 ? prog(lt, s.a - xfade / 2, s.a + xfade / 2) : 1, outN = i < shots.length - 1 ? 1 - prog(lt, s.b - xfade / 2, s.b + xfade / 2) : 1;
      const vis = Math.min(inN, outN); if (lt < s.a - xfade / 2 || lt > s.b + xfade / 2) return;
      const dir = (i % 2 ? -1 : 1);
      const off = (1 - inN) * 220 * dir - (1 - outN) * 220 * dir;
      ctx.save(); ctx.globalAlpha = ease.io(vis);
      if (vis < 1) { ctx.filter = `blur(${((1 - vis) * 14).toFixed(1)}px)`; }
      ctx.translate(off, 0); ctx.beginPath(); ctx.rect(-300, 0, W + 600, H); ctx.clip();
      drawShot(i, ctx, lt - s.a, s.b - s.a); ctx.restore(); drew++; });
  }
  // fixed-step canvas bridge: drive draw(t) from a GSAP tween so seeking is exact
  function bind(tl, canvasEl, dur, draw, at = 0) {
    const ctx = canvasEl.getContext('2d'), st = { t: 0 };
    tl.fromTo(st, { t: 0 }, { t: dur, duration: dur, ease: 'none', onUpdate() { draw(ctx, st.t); } }, at);
    draw(ctx, 0);
  }
  window.KIT = { W, H, clamp, lerp, ease, prog, rng, makeNoise, hex, mix, rgb, canvas, gradient, sky, stars, clouds, ridge, skyline, canopy, grade, drawLayer, layerPoint, firs, glow, strokeProgress, shotMix, bind };
})();
