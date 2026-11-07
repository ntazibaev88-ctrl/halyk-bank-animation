/* Shared vector art for "Қазақстан — 35 жыл".
   Everything here is deterministic (seeded) and synchronous, so any frame renders on its own. */
(function () {
  const KZ = {};
  KZ.C = {
    navy950: "#030915", navy900: "#06122A", navy800: "#0A1E40", navy700: "#0F2C5A",
    blue: "#00AFCA", blueDeep: "#0086A8", blueLight: "#6FE3F2",
    gold: "#F6C453", goldDeep: "#C8922E", goldLight: "#FFE6A3", flagGold: "#FEC50C", white: "#F4F8FC"
  };

  /* ---------- seeded random ---------- */
  KZ.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const f1 = (n) => Math.round(n * 10) / 10;

  /* ---------- flag of Kazakhstan (1:2) as primitives usable by SVG and canvas ---------- */
  function sunPrims(cx, cy, H) {
    const p = [];
    const rDisk = 0.128 * H, r1 = 0.152 * H, r2 = 0.258 * H, n = 32;
    p.push({ d: circle(cx, cy, rDisk), fill: "gold" });
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2, w = (Math.PI * 2 / n) * 0.36;
      const bx1 = cx + Math.cos(a - w) * r1, by1 = cy + Math.sin(a - w) * r1;
      const bx2 = cx + Math.cos(a + w) * r1, by2 = cy + Math.sin(a + w) * r1;
      const mr = (r1 + r2) * 0.5, mw = w * 0.62;
      const m1x = cx + Math.cos(a - mw) * mr, m1y = cy + Math.sin(a - mw) * mr;
      const m2x = cx + Math.cos(a + mw) * mr, m2y = cy + Math.sin(a + mw) * mr;
      const tx = cx + Math.cos(a) * r2, ty = cy + Math.sin(a) * r2;
      p.push({ d: `M${f1(bx1)},${f1(by1)} Q${f1(m1x)},${f1(m1y)} ${f1(tx)},${f1(ty)} Q${f1(m2x)},${f1(m2y)} ${f1(bx2)},${f1(by2)} Z`, fill: "gold" });
    }
    return p;
  }
  function circle(cx, cy, r) {
    return `M${f1(cx - r)},${f1(cy)} a${f1(r)},${f1(r)} 0 1,0 ${f1(2 * r)},0 a${f1(r)},${f1(r)} 0 1,0 ${f1(-2 * r)},0 Z`;
  }
  KZ.circle = circle;
  /* Steppe eagle (berkut), wings spread, head turned to the hoist. Unit: half wingspan = 1. */
  const EAGLE_R = [
    [0.07, -0.10], [0.20, -0.20], [0.38, -0.27], [0.58, -0.28], [0.78, -0.23], [0.93, -0.15], [1.00, -0.09],
    [0.93, -0.06], [0.99, -0.01], [0.88, 0.01], [0.93, 0.07], [0.80, 0.07], [0.83, 0.13], [0.68, 0.11],
    [0.69, 0.17], [0.55, 0.13], [0.54, 0.19], [0.42, 0.13], [0.39, 0.18], [0.29, 0.11], [0.25, 0.15],
    [0.16, 0.08], [0.10, 0.12], [0.08, 0.22], [0.13, 0.33], [0.06, 0.31], [0.04, 0.38], [0.0, 0.33]
  ];
  KZ.eaglePath = function (cx, cy, s) {
    const R = EAGLE_R.map(([x, y]) => [cx + x * s, cy + y * s]);
    const L = EAGLE_R.slice(0, -1).reverse().map(([x, y]) => [cx - x * s, cy + y * s]);
    // head (turned left) between the left shoulder and the right shoulder
    const head = [[-0.07, -0.10], [-0.06, -0.17], [-0.10, -0.205], [-0.16, -0.20], [-0.135, -0.18], [-0.10, -0.165], [-0.09, -0.15], [-0.05, -0.24], [0.02, -0.25], [0.06, -0.19]]
      .map(([x, y]) => [cx + x * s, cy + y * s]);
    const pts = R.concat(L, head);
    return "M" + pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" L") + " Z";
  };
  /* national ornament (qoshqar müiiz) — one cell centred at (cx,cy), height h */
  function ornamentCell(cx, cy, h) {
    const u = h, P = (x, y) => `${f1(cx + x * u)},${f1(cy + y * u)}`;
    const strokes = [];
    for (const sx of [1, -1]) for (const sy of [1, -1]) {
      const q = (x, y) => P(x * sx, y * sy);
      strokes.push(`M${q(0.05, -0.04)} C${q(0.16, -0.46)} ${q(0.50, -0.44)} ${q(0.44, -0.22)} C${q(0.40, -0.08)} ${q(0.24, -0.12)} ${q(0.29, -0.25)}`);
    }
    return {
      fill: `M${P(0, -0.5)} L${P(0.1, -0.06)} L${P(0, 0)} L${P(-0.1, -0.06)} Z M${P(0, 0.5)} L${P(0.1, 0.06)} L${P(0, 0)} L${P(-0.1, 0.06)} Z`,
      stroke: strokes.join(" ")
    };
  }
  KZ.flagPrims = function (W) {
    const H = W / 2, prims = [];
    prims.push({ d: `M0,0 H${W} V${H} H0 Z`, fill: "field" });
    // ornament band along the hoist
    const ox = W * 0.068, ch = H / 4.2;
    for (let i = 0; i < 5; i++) {
      const c = ornamentCell(ox, H * 0.5 + (i - 2) * ch, ch * 0.98);
      prims.push({ d: c.fill, fill: "gold" });
      prims.push({ d: c.stroke, stroke: "gold", lw: ch * 0.075 });
    }
    const cx = W * 0.5, cy = H * 0.405;
    sunPrims(cx, cy, H).forEach((p) => prims.push(p));
    prims.push({ d: KZ.eaglePath(cx, H * 0.70, H * 0.37), fill: "gold" });
    return prims;
  };
  KZ.flagSVG = function (W, opts) {
    opts = opts || {};
    const field = opts.field || "#00AFCA", gold = opts.gold || "#FEC50C";
    return KZ.flagPrims(W).map((p) => p.fill
      ? `<path d="${p.d}" fill="${p.fill === "field" ? field : gold}"/>`
      : `<path d="${p.d}" fill="none" stroke="${gold}" stroke-width="${f1(p.lw)}" stroke-linecap="round"/>`).join("");
  };
  /* Paint the flag once to an offscreen canvas (sync). */
  KZ.flagCanvas = function (W) {
    const c = document.createElement("canvas");
    c.width = W; c.height = W / 2;
    const g = c.getContext("2d");
    for (const p of KZ.flagPrims(W)) {
      const path = new Path2D(p.d);
      if (p.fill) { g.fillStyle = p.fill === "field" ? "#00AFCA" : "#FEC50C"; g.fill(path); }
      else { g.strokeStyle = "#FEC50C"; g.lineWidth = p.lw; g.lineCap = "round"; g.stroke(path); }
    }
    // subtle cloth texture
    const r = KZ.rng(7); g.globalAlpha = 0.035;
    for (let i = 0; i < 900; i++) { g.fillStyle = r() > 0.5 ? "#fff" : "#000"; g.fillRect(r() * W, r() * W / 2, 1 + r() * 3, 1); }
    g.globalAlpha = 1;
    return c;
  };
  /* A waving-flag renderer bound to a visible canvas. draw(t) is a pure function of t (seconds). */
  KZ.WavingFlag = function (canvas, opts) {
    opts = opts || {};
    const src = KZ.flagCanvas(opts.res || 1200);
    const g = canvas.getContext("2d");
    const W = canvas.width, Hc = canvas.height;
    const fw = opts.flagW || W * 0.92, fh = fw / 2;
    const top = opts.top != null ? opts.top : (Hc - fh) / 2;
    const amp = opts.amp != null ? opts.amp : fh * 0.055;
    const k = (Math.PI * 2) / (opts.wavelength || fw * 0.62);
    const speed = opts.speed || 4.2;
    const strip = 3;
    this.draw = function (t, lift) {
      g.clearRect(0, 0, W, Hc);
      const sw = src.width, sh = src.height;
      for (let x = 0; x < fw; x += strip) {
        const u = x / fw;
        const ph = k * x - speed * t;
        const env = Math.pow(u, 0.85);
        const dy = Math.sin(ph) * amp * env + Math.sin(ph * 0.47 + 1.3) * amp * 0.4 * env;
        const slope = Math.cos(ph) * env;
        const sx = u * sw;
        const shrink = 1 - 0.035 * env * (0.5 + 0.5 * Math.sin(ph + 0.6));
        const h = fh * shrink;
        const y = top + dy + (fh - h) * 0.5 * u;
        g.drawImage(src, sx, 0, Math.max(1, (strip / fw) * sw) + 0.6, sh, x, y, strip + 0.6, h);
        const shade = slope * 0.22;
        g.fillStyle = shade > 0 ? `rgba(255,255,255,${shade.toFixed(3)})` : `rgba(0,16,40,${(-shade * 1.25).toFixed(3)})`;
        g.fillRect(x, y, strip + 0.6, h);
      }
    };
  };

  /* ---------- state emblem (stylised) ---------- */
  KZ.emblemSVG = function (R) {
    const s = R / 100, P = (n) => f1(n * s);
    let o = `<defs><radialGradient id="emb-blue" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#1FC3DC"/><stop offset="1" stop-color="#0079A0"/></radialGradient>
      <linearGradient id="emb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7A1"/><stop offset=".5" stop-color="#F6C453"/><stop offset="1" stop-color="#B9822A"/></linearGradient></defs>`;
    o += `<circle r="${P(100)}" fill="url(#emb-gold)"/><circle r="${P(91)}" fill="url(#emb-blue)"/>`;
    // uyks (rays of the shanyrak)
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2, w = 0.035;
      const r1 = 33, r2 = 86;
      o += `<path class="emb-ray" d="M${P(Math.cos(a - w) * r1)},${P(Math.sin(a - w) * r1)} L${P(Math.cos(a) * r2)},${P(Math.sin(a) * r2)} L${P(Math.cos(a + w) * r1)},${P(Math.sin(a + w) * r1)} Z" fill="url(#emb-gold)"/>`;
    }
    // tulpar wings on both sides
    for (const sx of [-1, 1]) {
      let wing = "";
      for (let j = 0; j < 6; j++) {
        const y0 = 62 - j * 17, x0 = 40 + j * 2.5, x1 = 84 - j * 3, y1 = 30 - j * 19;
        wing += `M${P(sx * x0)},${P(y0)} Q${P(sx * (x1 + 6))},${P(y0 - 4)} ${P(sx * x1)},${P(y1)} Q${P(sx * (x0 + 18))},${P(y0 - 10)} ${P(sx * x0)},${P(y0)} Z `;
      }
      o += `<path class="emb-wing" d="${wing}" fill="url(#emb-gold)" opacity=".95"/>`;
    }
    // shanyrak
    o += `<circle class="emb-shan" r="${P(31)}" fill="#0A6D8F" stroke="url(#emb-gold)" stroke-width="${P(6)}"/>`;
    let bars = "";
    for (const v of [-11, 0, 11]) {
      const h = Math.sqrt(28 * 28 - v * v);
      bars += `M${P(v)},${P(-h)} Q${P(v * 1.25)},0 ${P(v)},${P(h)} M${P(-h)},${P(v)} Q0,${P(v * 1.25)} ${P(h)},${P(v)} `;
    }
    o += `<path class="emb-bars" d="${bars}" fill="none" stroke="url(#emb-gold)" stroke-width="${P(3.6)}" stroke-linecap="round"/>`;
    // star
    let st = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 6.5 : 15;
      st += (i ? "L" : "M") + `${P(Math.cos(a) * r)},${P(-96 + Math.sin(a) * r)} `;
    }
    o += `<path class="emb-star" d="${st}Z" fill="url(#emb-gold)" stroke="#8a5d17" stroke-width="${P(0.8)}"/>`;
    return o;
  };

  /* ---------- tenge sign ---------- */
  KZ.tengePath = function (cx, cy, h) {
    const w = h * 0.78, t = h * 0.15, P = (x, y) => `${f1(cx + x)},${f1(cy + y)}`;
    return `M${P(-w / 2, -h / 2)} H${f1(cx + w / 2)} V${f1(cy - h / 2 + t)} H${f1(cx - w / 2)} Z ` +
      `M${P(-w / 2, -h / 2 + t * 1.9)} H${f1(cx + w / 2)} V${f1(cy - h / 2 + t * 2.9)} H${f1(cx + t / 2)} V${f1(cy + h / 2)} H${f1(cx - t / 2)} V${f1(cy - h / 2 + t * 2.9)} H${f1(cx - w / 2)} Z`;
  };

  /* ---------- Astana landmarks (ground at y=0, x centred) ---------- */
  const L = {};
  L.baiterek = function (h, o) {
    o = o || {};
    const trunk = o.trunk || "#E8EEF6", gold = o.sphere || "url(#gold-sphere)", line = o.line || "rgba(30,60,100,.35)";
    const P = (x, y) => `${f1(x * h)},${f1(-y * h)}`;
    let s = `<path d="M${P(-0.07, 0)} C${P(-0.05, 0.2)} ${P(-0.022, 0.45)} ${P(-0.02, 0.6)} C${P(-0.02, 0.7)} ${P(-0.06, 0.76)} ${P(-0.115, 0.83)} L${P(-0.09, 0.84)} C${P(-0.05, 0.8)} ${P(-0.03, 0.78)} ${P(0, 0.765)} C${P(0.03, 0.78)} ${P(0.05, 0.8)} ${P(0.09, 0.84)} L${P(0.115, 0.83)} C${P(0.06, 0.76)} ${P(0.02, 0.7)} ${P(0.02, 0.6)} C${P(0.022, 0.45)} ${P(0.05, 0.2)} ${P(0.07, 0)} Z" fill="${trunk}"/>`;
    // lattice lines
    for (const x of [-0.03, -0.012, 0.006, 0.024]) s += `<path d="M${P(x * 1.8, 0)} C${P(x * 1.2, 0.3)} ${P(x * 0.8, 0.5)} ${P(x * 0.9, 0.62)}" stroke="${line}" stroke-width="${f1(h * 0.004)}" fill="none"/>`;
    // cradle branches
    for (const a of [-1, -0.55, 0.55, 1]) s += `<path d="M${P(a * 0.02, 0.72)} Q${P(a * 0.09, 0.78)} ${P(a * 0.105, 0.9)}" stroke="${trunk}" stroke-width="${f1(h * 0.012)}" fill="none" stroke-linecap="round"/>`;
    s += `<circle cx="0" cy="${f1(-0.885 * h)}" r="${f1(0.083 * h)}" fill="${gold}"/>`;
    s += `<ellipse cx="${f1(-0.025 * h)}" cy="${f1(-0.91 * h)}" rx="${f1(0.03 * h)}" ry="${f1(0.022 * h)}" fill="rgba(255,255,255,.55)"/>`;
    s += `<rect x="${f1(-0.13 * h)}" y="${f1(-0.02 * h)}" width="${f1(0.26 * h)}" height="${f1(0.02 * h)}" fill="${trunk}"/>`;
    return s;
  };
  L.khanShatyr = function (h, o) {
    o = o || {};
    const fill = o.fill || "rgba(190,215,240,.85)", line = o.line || "rgba(255,255,255,.5)";
    const P = (x, y) => `${f1(x * h)},${f1(-y * h)}`;
    let s = `<path d="M${P(-0.62, 0)} Q${P(-0.3, 0.42)} ${P(0.06, 1)} L${P(0.1, 1.04)} L${P(0.13, 1)} Q${P(0.42, 0.45)} ${P(0.66, 0)} Z" fill="${fill}"/>`;
    for (let i = 1; i < 7; i++) {
      const x = -0.62 + i * 0.18;
      s += `<path d="M${P(0.1, 1)} Q${P(x * 0.5 + 0.05, 0.4)} ${P(x, 0)}" stroke="${line}" stroke-width="${f1(h * 0.006)}" fill="none"/>`;
    }
    for (let j = 1; j < 5; j++) {
      const y = j * 0.2, k = 1 - y;
      s += `<path d="M${P(-0.6 * k + 0.08 * y, y)} Q${P(0.05, y + 0.05)} ${P(0.64 * k + 0.1 * y, y)}" stroke="${line}" stroke-width="${f1(h * 0.005)}" fill="none"/>`;
    }
    return s;
  };
  L.pyramid = function (h, o) {
    o = o || {};
    const P = (x, y) => `${f1(x * h)},${f1(-y * h)}`;
    return `<path d="M${P(-0.62, 0)} L${P(0, 1)} L${P(0.62, 0)} Z" fill="${o.fill || "#C9D6E6"}"/>` +
      `<path d="M${P(0, 0)} L${P(0, 1)} L${P(0.62, 0)} Z" fill="${o.shade || "rgba(10,30,60,.28)"}"/>` +
      `<path d="M${P(-0.12, 0.8)} L${P(0, 1)} L${P(0.12, 0.8)} Z" fill="${o.apex || "#F6C453"}"/>`;
  };
  L.akOrda = function (h, o) {
    o = o || {};
    const P = (x, y) => `${f1(x * h)},${f1(-y * h)}`, wall = o.wall || "#E9EEF5", dome = o.dome || "#2F8FD8", gold = o.gold || "#F6C453";
    let s = `<rect x="${f1(-0.7 * h)}" y="${f1(-0.36 * h)}" width="${f1(1.4 * h)}" height="${f1(0.36 * h)}" fill="${wall}"/>`;
    for (let i = 0; i < 9; i++) s += `<rect x="${f1((-0.62 + i * 0.15) * h)}" y="${f1(-0.3 * h)}" width="${f1(0.035 * h)}" height="${f1(0.26 * h)}" fill="${o.col || "rgba(20,50,90,.25)"}"/>`;
    s += `<rect x="${f1(-0.22 * h)}" y="${f1(-0.46 * h)}" width="${f1(0.44 * h)}" height="${f1(0.1 * h)}" fill="${wall}"/>`;
    s += `<path d="M${P(-0.2, 0.46)} C${P(-0.2, 0.7)} ${P(0.2, 0.7)} ${P(0.2, 0.46)} Z" fill="${dome}"/>`;
    s += `<rect x="${f1(-0.008 * h)}" y="${f1(-0.92 * h)}" width="${f1(0.016 * h)}" height="${f1(0.3 * h)}" fill="${gold}"/>`;
    s += `<circle cx="0" cy="${f1(-0.64 * h)}" r="${f1(0.025 * h)}" fill="${gold}"/>`;
    return s;
  };
  L.mosque = function (h, o) {
    o = o || {};
    const P = (x, y) => `${f1(x * h)},${f1(-y * h)}`, wall = o.wall || "#EEF2F7", dome = o.dome || "#5FB7E8";
    let s = `<rect x="${f1(-0.55 * h)}" y="${f1(-0.3 * h)}" width="${f1(1.1 * h)}" height="${f1(0.3 * h)}" fill="${wall}"/>`;
    s += `<path d="M${P(-0.3, 0.3)} C${P(-0.32, 0.72)} ${P(0.32, 0.72)} ${P(0.3, 0.3)} Z" fill="${dome}"/>`;
    s += `<rect x="${f1(-0.006 * h)}" y="${f1(-0.78 * h)}" width="${f1(0.012 * h)}" height="${f1(0.1 * h)}" fill="${o.gold || "#F6C453"}"/>`;
    for (const x of [-0.72, -0.6, 0.6, 0.72]) s += `<path d="M${P(x - 0.025, 0)} L${P(x - 0.025, 0.85)} L${P(x, 0.98)} L${P(x + 0.025, 0.85)} L${P(x + 0.025, 0)} Z" fill="${wall}"/>`;
    return s;
  };
  L.tower = function (w, h, o) {
    o = o || {};
    const fill = o.fill || "#1B3A66";
    let s = `<rect x="${f1(-w / 2)}" y="${f1(-h)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}"/>`;
    if (o.crown === "slant") s += `<path d="M${f1(-w / 2)},${f1(-h)} L${f1(w / 2)},${f1(-h - w * 0.6)} L${f1(w / 2)},${f1(-h)} Z" fill="${fill}"/>`;
    if (o.crown === "spire") s += `<path d="M${f1(-w * 0.18)},${f1(-h)} L0,${f1(-h - w * 1.4)} L${f1(w * 0.18)},${f1(-h)} Z" fill="${o.spire || fill}"/>`;
    if (o.crown === "round") s += `<path d="M${f1(-w / 2)},${f1(-h)} Q0,${f1(-h - w * 0.7)} ${f1(w / 2)},${f1(-h)} Z" fill="${fill}"/>`;
    if (o.windows) {
      const r = KZ.rng(o.seed || 1), cols = Math.max(2, Math.floor(w / 9)), rows = Math.floor(h / 13);
      let win = "";
      for (let i = 0; i < cols; i++) for (let j = 1; j < rows; j++) {
        if (r() < (o.lit || 0.45)) win += `M${f1(-w / 2 + 3 + i * (w - 6) / cols)},${f1(-h + j * 13)}h${f1((w - 6) / cols - 3)}v5h${f1(-((w - 6) / cols - 3))}Z`;
      }
      s += `<path class="lit" d="${win}" fill="${o.windows}"/>`;
    }
    return s;
  };
  L.northernLights = function (h, o) {
    o = o || {};
    let s = "";
    [[-0.22, 0.82], [0, 1], [0.22, 0.9]].forEach(([x, k]) => {
      const P = (a, b) => `${f1((x + a) * h)},${f1(-b * h * k)}`;
      s += `<path d="M${P(-0.07, 0)} C${P(-0.09, 0.5)} ${P(-0.02, 0.85)} ${P(0.03, 1)} C${P(0.05, 0.8)} ${P(0.06, 0.4)} ${P(0.06, 0)} Z" fill="${o.fill || "#2A5A8E"}"/>`;
    });
    return s;
  };
  L.crane = function (h, o) {
    o = o || {};
    const c = o.color || "#F6C453", P = (x, y) => `${f1(x * h)},${f1(-y * h)}`;
    let s = `<path d="M${P(-0.02, 0)} V${f1(-h)} M${P(0.02, 0)} V${f1(-h)}" stroke="${c}" stroke-width="${f1(h * 0.012)}"/>`;
    for (let i = 0; i < 10; i++) s += `<path d="M${P(-0.02, i * 0.1)} L${P(0.02, i * 0.1 + 0.1)}" stroke="${c}" stroke-width="${f1(h * 0.006)}"/>`;
    s += `<g class="jib"><path d="M${P(-0.25, 1)} H${f1(0.7 * h)} M${P(-0.25, 0.97)} H${f1(0.7 * h)}" stroke="${c}" stroke-width="${f1(h * 0.01)}"/>`;
    s += `<path d="M${P(0.5, 0.97)} V${f1(-0.7 * h)}" stroke="${c}" stroke-width="${f1(h * 0.004)}"/><rect x="${f1(-0.25 * h)}" y="${f1(-0.99 * h)}" width="${f1(0.1 * h)}" height="${f1(0.06 * h)}" fill="${c}"/></g>`;
    return s;
  };
  KZ.L = L;

  /* Modern Astana skyline as one SVG string, ground at y=0, spanning x 0..W. mode: "day" | "night" | "silhouette" */
  KZ.skyline = function (W, mode, seed) {
    const r = KZ.rng(seed || 11), night = mode !== "day", sil = mode === "silhouette";
    const far = sil ? "#13284A" : night ? "#132D55" : "#7FA7CF";
    const mid = sil ? "#0B1C38" : night ? "#1B3A66" : "#5C86B5";
    const win = sil ? "rgba(255,200,110,.55)" : night ? "rgba(255,214,140,.85)" : "rgba(255,255,255,.35)";
    let back = "", front = "";
    for (let x = 0; x < W; x += 34 + r() * 30) {
      const w = 26 + r() * 40, h = 90 + r() * 170;
      back += `<g transform="translate(${f1(x)},0)">${L.tower(w, h, { fill: far, windows: win, seed: Math.floor(r() * 1e6), lit: 0.25 })}</g>`;
    }
    const cx = W / 2;
    const items = [
      [cx - 420, L.tower(48, 300, { fill: mid, crown: "slant", windows: win, seed: 3 })],
      [cx - 350, L.northernLights(330, { fill: sil ? "#0E2244" : night ? "#24508A" : "#4D7FB4" })],
      [cx - 250, L.mosque(150, sil ? { wall: "#0C1D3A", dome: "#0C1D3A" } : night ? { wall: "#C9D6EA", dome: "#3D8ED0" } : {})],
      [cx - 120, L.khanShatyr(200, sil ? { fill: "#102446", line: "rgba(255,255,255,.08)" } : {})],
      [cx + 0, L.baiterek(360, sil ? { trunk: "#0E2142", line: "rgba(255,255,255,0)" } : {})],
      [cx + 150, L.akOrda(170, sil ? { wall: "#0C1D3A", dome: "#0C1D3A", col: "rgba(0,0,0,0)" } : {})],
      [cx + 270, L.tower(56, 390, { fill: mid, crown: "spire", spire: "#9FB8D8", windows: win, seed: 5 })],
      [cx + 330, L.tower(40, 270, { fill: mid, crown: "round", windows: win, seed: 6 })],
      [cx + 410, L.pyramid(150, sil ? { fill: "#0E2142", shade: "rgba(0,0,0,.2)", apex: "#F6C453" } : {})]
    ];
    for (const [x, svg] of items) front += `<g class="lm" transform="translate(${f1(x)},0)">${svg}</g>`;
    return { back, front };
  };

  /* Soviet-era Akmola (old town) row, ground at y=0 */
  KZ.oldTown = function (W, seed) {
    const r = KZ.rng(seed || 4);
    let s = "";
    for (let x = 0; x < W;) {
      const kind = r();
      if (kind < 0.45) {
        const w = 120 + r() * 90, h = 70 + r() * 30;
        s += `<g class="old" transform="translate(${f1(x)},0)"><rect x="0" y="${f1(-h)}" width="${f1(w)}" height="${f1(h)}" fill="#3A4A5E"/>`;
        let wn = "";
        for (let i = 0; i < Math.floor(w / 18); i++) for (let j = 0; j < 5; j++) if (r() < 0.5) wn += `M${f1(6 + i * 18)},${f1(-h + 8 + j * 13)}h8v6h-8Z`;
        s += `<path d="${wn}" fill="rgba(255,205,120,.5)"/></g>`;
        x += w + 8;
      } else if (kind < 0.8) {
        const w = 50 + r() * 30, h = 26 + r() * 10;
        s += `<g class="old" transform="translate(${f1(x)},0)"><rect x="0" y="${f1(-h)}" width="${f1(w)}" height="${f1(h)}" fill="#46536A"/><path d="M-4,${f1(-h)} L${f1(w / 2)},${f1(-h - 18)} L${f1(w + 4)},${f1(-h)} Z" fill="#2E394A"/><rect x="${f1(w * 0.3)}" y="${f1(-h + 8)}" width="9" height="9" fill="rgba(255,205,120,.6)"/></g>`;
        x += w + 10;
      } else {
        const w = 70, h = 150;
        s += `<g class="old" transform="translate(${f1(x)},0)"><rect x="0" y="${f1(-h)}" width="${w}" height="${h}" fill="#4A5568"/>`;
        for (let i = 0; i < 4; i++) s += `<rect x="${4 + i * 16}" y="${-h + 10}" width="12" height="${h - 10}" rx="6" fill="#56627A"/>`;
        s += `<rect x="20" y="${-h - 36}" width="30" height="36" fill="#4A5568"/></g>`;
        x += w + 14;
      }
    }
    return s;
  };

  /* Simple shapes */
  KZ.pumpjack = function (s) {
    // ground at y=0; the beam group is rotated around (0,-0.62s)
    const P = (x, y) => `${f1(x * s)},${f1(-y * s)}`;
    return {
      base: `<path d="M${P(-0.55, 0)} H${f1(0.55 * s)} V${f1(-0.05 * s)} H${f1(-0.55 * s)} Z M${P(-0.12, 0.05)} L${P(0, 0.62)} L${P(0.12, 0.05)} Z" fill="currentColor"/><path d="M${P(0.42, 0.05)} V${f1(-0.3 * s)} h${f1(0.1 * s)} V${f1(-0.05 * s)}Z" fill="currentColor"/>`,
      beam: `<path d="M${P(-0.6, 0.6)} H${f1(0.45 * s)} V${f1(-0.66 * s)} H${f1(-0.6 * s)} Z" fill="currentColor"/><path d="M${P(-0.78, 0.74)} Q${P(-0.62, 0.66)} ${P(-0.6, 0.54)} L${P(-0.66, 0.5)} Q${P(-0.68, 0.62)} ${P(-0.78, 0.66)} Z" fill="currentColor"/><path d="M${P(-0.7, 0.5)} V${f1(-0.08 * s)}" stroke="currentColor" stroke-width="${f1(s * 0.012)}"/>`
    };
  };
  KZ.turbine = function (h) {
    const P = (x, y) => `${f1(x * h)},${f1(-y * h)}`;
    const tower = `<path d="M${P(-0.018, 0)} L${P(-0.008, 1)} L${P(0.008, 1)} L${P(0.018, 0)} Z" fill="currentColor"/>`;
    let blades = "";
    for (let i = 0; i < 3; i++) blades += `<path transform="rotate(${i * 120})" d="M0,0 L${f1(-0.012 * h)},${f1(-0.06 * h)} Q${f1(-0.02 * h)},${f1(-0.3 * h)} 0,${f1(-0.48 * h)} Q${f1(0.012 * h)},${f1(-0.25 * h)} ${f1(0.012 * h)},0 Z" fill="currentColor"/>`;
    blades += `<circle r="${f1(0.022 * h)}" fill="currentColor"/><circle r="${f1(0.5 * h)}" fill="none" stroke="none"/>`;
    return { tower, blades, hubY: -h };
  };
  /* bust silhouette for portrait cards; kind: engineer | coder | scientist | founder */
  KZ.bust = function (kind) {
    const body = `<path d="M-150,260 C-150,150 -95,108 -40,96 L-26,62 L26,62 L40,96 C95,108 150,150 150,260 Z" fill="url(#bust-fill)"/>`;
    let head = `<path d="M-46,-10 C-50,-70 -24,-96 2,-96 C30,-96 52,-70 47,-12 C45,30 26,62 0,64 C-26,62 -44,30 -46,-10 Z" fill="url(#bust-fill)"/>`;
    let extra = "";
    if (kind === "engineer") extra = `<path d="M-60,-40 C-58,-104 58,-104 60,-40 L72,-34 L-72,-34 Z" fill="#F6C453"/><path d="M-6,-98 h12 v58 h-12z" fill="#D9A23A"/>`;
    if (kind === "coder") extra = `<path d="M-56,-20 C-60,-118 60,-118 56,-20" fill="none" stroke="#6FE3F2" stroke-width="9"/><rect x="-68" y="-34" width="20" height="40" rx="9" fill="#6FE3F2"/><rect x="48" y="-34" width="20" height="40" rx="9" fill="#6FE3F2"/><path d="M-120,250 L-90,170 H90 L120,250 Z" fill="#0E2A52" stroke="#6FE3F2" stroke-width="3"/><circle cx="0" cy="210" r="8" fill="#6FE3F2"/>`;
    if (kind === "scientist") {
      head = `<path d="M-48,-6 C-56,-78 -24,-100 2,-100 C32,-100 56,-76 48,-8 C50,40 60,70 44,90 C30,70 20,64 0,64 C-20,64 -30,70 -44,90 C-60,70 -50,40 -48,-6 Z" fill="url(#bust-fill)"/><circle cx="0" cy="-104" r="22" fill="url(#bust-fill)"/>`;
      extra = `<path d="M-40,96 L0,200 L40,96 L70,104 L20,260 H-20 L-70,104 Z" fill="#E8EEF6" opacity=".9"/><path d="M96,150 h26 v40 l22,50 h-70 l22,-50z" fill="none" stroke="#6FE3F2" stroke-width="5"/>`;
    }
    if (kind === "founder") extra = `<path d="M-40,96 L0,150 L40,96 L56,100 L14,260 H-14 L-56,100 Z" fill="#E8EEF6"/><path d="M-9,150 L0,140 L9,150 L4,230 L0,240 L-4,230 Z" fill="#F6C453"/><rect x="70" y="150" width="70" height="96" rx="8" fill="#0E2A52" stroke="#F6C453" stroke-width="3" transform="rotate(-12 105 198)"/>`;
    return body + head + extra;
  };
  window.KZ = KZ;
})();
