/* THE LAST DAY — shared drawing kit.
 * Every function draws from time alone (seek-safe). Randomness is seeded.
 * Canvas is 1080x1920. Colour world: blue-grey night, warm accents only for fire/hazards. */
(function () {
  const W = 1080, H = 1920;
  const F = (window.FILM = { W, H });

  // ---------- math ----------
  F.rng = function (a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const clamp = (F.clamp = (v, a, b) => Math.max(a, Math.min(b, v)));
  F.lerp = (a, b, t) => a + (b - a) * t;
  F.seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  F.smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  F.easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  F.easeIn = (t) => Math.pow(clamp(t, 0, 1), 3);
  F.easeInOut = (t) => { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  // smooth pseudo-noise from sines, for handheld camera and flicker
  F.wobble = (t, seed = 0) =>
    Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 2.9 + seed * 2.1) * 0.3 + Math.sin(t * 5.3 + seed * 3.7) * 0.2;
  F.flicker = (t, seed = 0) => {
    const k = Math.floor(t * 24);
    const r = F.rng(k * 7919 + seed * 104729)();
    return r;
  };

  function mk(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  F.mk = mk;

  // ---------- textures (built once, deterministic) ----------
  function noiseField(size, seed, octaves, base) {
    const r = F.rng(seed);
    const out = new Float32Array(size * size);
    let amp = 1, total = 0;
    for (let o = 0; o < octaves; o++) {
      const g = base << o;
      const grid = new Float32Array(g * g);
      for (let i = 0; i < g * g; i++) grid[i] = r();
      for (let y = 0; y < size; y++) {
        const gy = (y / size) * g, iy = Math.floor(gy), fy = F.smooth(gy - iy);
        for (let x = 0; x < size; x++) {
          const gx = (x / size) * g, ix = Math.floor(gx), fx = F.smooth(gx - ix);
          const a = grid[(iy % g) * g + (ix % g)], b = grid[(iy % g) * g + ((ix + 1) % g)];
          const c = grid[((iy + 1) % g) * g + (ix % g)], d = grid[((iy + 1) % g) * g + ((ix + 1) % g)];
          out[y * size + x] += amp * F.lerp(F.lerp(a, b, fx), F.lerp(c, d, fx), fy);
        }
      }
      total += amp; amp *= 0.5;
    }
    for (let i = 0; i < out.length; i++) out[i] /= total;
    return out;
  }
  const texCache = {};
  // soft fog sheet, tileable, tinted
  F.fogTex = function (seed = 1, rgb = [168, 184, 204], contrast = 2.2) {
    const key = seed + ":" + rgb.join(",") + ":" + contrast;
    if (texCache[key]) return texCache[key];
    const S = 256, f = noiseField(S, seed, 5, 3);
    const c = mk(S, S), x = c.getContext("2d"), im = x.createImageData(S, S);
    for (let i = 0; i < S * S; i++) {
      const v = clamp((f[i] - 0.5) * contrast + 0.5, 0, 1);
      im.data[i * 4] = rgb[0]; im.data[i * 4 + 1] = rgb[1]; im.data[i * 4 + 2] = rgb[2];
      im.data[i * 4 + 3] = Math.pow(v, 1.6) * 255;
    }
    x.putImageData(im, 0, 0);
    return (texCache[key] = c);
  };
  // film grain frames
  F.grainFrames = (function () {
    let frames = null;
    return function () {
      if (frames) return frames;
      frames = [];
      for (let k = 0; k < 6; k++) {
        const c = mk(360, 640), x = c.getContext("2d"), im = x.createImageData(360, 640), r = F.rng(900 + k);
        for (let i = 0; i < 360 * 640; i++) {
          const v = (r() + r() + r()) / 3 * 255;
          im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255;
        }
        x.putImageData(im, 0, 0); frames.push(c);
      }
      return frames;
    };
  })();

  // ---------- atmosphere ----------
  // drifting fog band. y0..y1 screen band; scale = texture px -> screen px
  F.fog = function (ctx, t, o) {
    const tex = F.fogTex(o.seed || 1, o.rgb || [168, 184, 204], o.contrast || 2.2);
    const sc = o.scale || 4, tw = 256 * sc, th = 256 * sc;
    const y0 = o.y0 ?? 0, y1 = o.y1 ?? H, bandH = Math.max(1, Math.round(y1 - y0));
    if (!F._fogBuf) F._fogBuf = mk(W, H);
    const b = F._fogBuf, bx = b.getContext("2d");
    bx.setTransform(1, 0, 0, 1, 0, 0); bx.globalCompositeOperation = "source-over"; bx.globalAlpha = 1;
    bx.clearRect(0, 0, W, bandH);
    const ox = (((t * (o.speed || 20) + (o.offset || 0)) % tw) + tw) % tw;
    const oy = (((t * (o.rise || 0)) % th) + th) % th;
    for (let x = -ox - tw; x < W + tw; x += tw)
      for (let y = -oy - th; y < bandH + th; y += th) bx.drawImage(tex, x, y, tw, th);
    // feather the band so it has no hard edges
    if (o.y0 != null || o.y1 != null) {
      const fe = o.feather ?? 0.35;
      const g = bx.createLinearGradient(0, 0, 0, bandH);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(fe, "rgba(0,0,0,1)");
      g.addColorStop(1 - fe, "rgba(0,0,0,1)"); g.addColorStop(1, "rgba(0,0,0,0)");
      bx.globalCompositeOperation = "destination-in"; bx.fillStyle = g; bx.fillRect(0, 0, W, bandH);
    }
    ctx.save();
    ctx.globalAlpha = o.alpha ?? 0.3;
    ctx.globalCompositeOperation = o.mode || "screen";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(b, 0, 0, W, bandH, 0, y0, W, bandH);
    ctx.restore();
  };
  F.glow = function (ctx, x, y, r, color, alpha = 1, mode = "screen") {
    ctx.save();
    ctx.globalCompositeOperation = mode; ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  };
  // volumetric light cone from (x,y) pointing at angle (0 = down)
  F.cone = function (ctx, t, x, y, ang, spread, len, rgb, alpha, seed = 3) {
    const a1 = ang - spread, a2 = ang + spread;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x + Math.sin(a1) * len, y + Math.cos(a1) * len);
    ctx.lineTo(x + Math.sin(a2) * len, y + Math.cos(a2) * len);
    ctx.closePath(); ctx.clip();
    ctx.globalCompositeOperation = "screen";
    const g = ctx.createRadialGradient(x, y, 0, x, y, len);
    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(0.5, `rgba(${rgb},${alpha * 0.35})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - len, y - len, len * 2, len * 2);
    F.fog(ctx, t, { seed, alpha: alpha * 0.9, scale: 2.5, speed: 14, rgb: rgb.split(",").map(Number) });
    ctx.restore();
  };
  // slanted rain streaks, seed-placed and moving with t
  F.rain = function (ctx, t, o = {}) {
    const n = o.count || 260, r = F.rng(o.seed || 77), vy = o.speed || 2600, slant = o.slant || 0.12;
    ctx.save();
    ctx.strokeStyle = o.color || "rgba(190,205,225,0.22)";
    ctx.lineWidth = o.width || 1.6;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x0 = r() * (W + 400) - 200, y0 = r() * H, len = (o.len || 60) * (0.5 + r()), sp = vy * (0.7 + r() * 0.6);
      const y = ((y0 + t * sp) % (H + 200)) - 100, x = x0 + y * slant;
      ctx.moveTo(x, y); ctx.lineTo(x - len * slant, y - len);
    }
    ctx.stroke();
    ctx.restore();
  };
  // dust / ash particles floating in light
  F.dust = function (ctx, t, o = {}) {
    const n = o.count || 80, r = F.rng(o.seed || 55);
    ctx.save(); ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < n; i++) {
      const bx = r() * W, by = r() * H, sz = 1 + r() * (o.size || 3), ph = r() * 6.28;
      const x = bx + Math.sin(t * 0.4 + ph) * 30 + t * (o.dx || 6);
      const y = ((by + t * (o.dy ?? 14) + Math.cos(t * 0.3 + ph) * 20) % H + H) % H;
      const a = (0.25 + 0.75 * Math.abs(Math.sin(t * 0.7 + ph))) * (o.alpha || 0.5);
      ctx.fillStyle = `rgba(${o.rgb || "200,210,225"},${a})`;
      ctx.beginPath(); ctx.arc(x % W, y, sz, 0, 6.283); ctx.fill();
    }
    ctx.restore();
  };

  // ---------- finishing: grade, vignette, grain, flashes ----------
  F.finish = function (ctx, t, o = {}) {
    ctx.save();
    // cool grade: crush toward steel blue
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = o.tint || "#aebdd0"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = o.lift || "rgba(6,9,14,1)"; ctx.fillRect(0, 0, W, H);
    // vignette
    ctx.globalCompositeOperation = "source-over";
    const v = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.18, W / 2, H * 0.5, H * 0.72);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, `rgba(0,0,0,${o.vignette ?? 0.78})`);
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    // grain (24 fps boil)
    const fr = F.grainFrames(), k = (Math.floor(t * 24) + (o.seed || 0)) % fr.length;
    ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = o.grain ?? 0.22;
    ctx.drawImage(fr[k], 0, 0, W, H);
    ctx.restore();
    if (o.flash) { ctx.save(); ctx.fillStyle = o.flash; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  };
  // RGB split for impact frames: draws the canvas onto itself offset in red/cyan
  F.chroma = function (ctx, amt) {
    if (amt < 0.5) return;
    if (!F._tmp) F._tmp = mk(W, H);
    const tx = F._tmp.getContext("2d");
    tx.globalCompositeOperation = "copy"; tx.drawImage(ctx.canvas, 0, 0);
    // tint the copy red, then add it offset
    tx.globalCompositeOperation = "multiply"; tx.fillStyle = "#ff3a2a"; tx.fillRect(0, 0, W, H);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "screen"; ctx.globalAlpha = 0.55;
    ctx.drawImage(F._tmp, amt, 0); ctx.globalAlpha = 0.3; ctx.drawImage(F._tmp, -amt * 0.6, amt * 0.3); ctx.restore();
  };
  // motion blur: blend previous-looking smear by drawing canvas shifted copies
  F.smear = function (ctx, dx, dy, n = 5, alpha = 0.22) {
    if (Math.abs(dx) + Math.abs(dy) < 1) return;
    if (!F._tmp2) F._tmp2 = mk(W, H);
    const tx = F._tmp2.getContext("2d");
    tx.globalCompositeOperation = "copy"; tx.drawImage(ctx.canvas, 0, 0);
    ctx.save(); ctx.globalAlpha = alpha;
    for (let i = 1; i <= n; i++) ctx.drawImage(F._tmp2, (dx * i) / n, (dy * i) / n);
    ctx.restore();
  };
  // handheld camera: returns {x,y,r}
  F.handheld = function (t, amp = 1, seed = 0) {
    return { x: F.wobble(t * 0.9, seed) * 9 * amp, y: F.wobble(t * 0.8, seed + 5) * 7 * amp, r: F.wobble(t * 0.6, seed + 9) * 0.004 * amp };
  };
  // impact shake (decays after time 'at')
  F.shake = function (t, at, strength = 30, decay = 0.25) {
    const d = t - at;
    if (d < 0 || d > decay * 5) return { x: 0, y: 0 };
    const e = Math.exp(-d / decay) * strength;
    return { x: Math.sin(d * 91) * e, y: Math.cos(d * 73) * e * 0.8 };
  };
  F.applyCam = function (ctx, cam) {
    ctx.translate(W / 2 + (cam.x || 0), H / 2 + (cam.y || 0));
    ctx.rotate(cam.r || 0);
    const z = cam.z || 1; ctx.scale(z, z);
    ctx.translate(-W / 2 - (cam.px || 0), -H / 2 - (cam.py || 0));
  };
  F.clear = function (ctx, color = "#05070a") {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.filter = "none";
    ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  };

  // ---------- simple perspective for streets ----------
  F.persp = function (o) {
    // o: {vx, vy, f, camH}
    return {
      x: (X, Z) => o.vx + (X * o.f) / Z,
      y: (Y, Z) => o.vy + ((o.camH - Y) * o.f) / Z,
      s: (Z) => o.f / Z,
    };
  };
})();
