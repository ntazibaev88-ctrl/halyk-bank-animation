// Animated 2D stand-ins for footage slots that have no clip yet.
// Everything is deterministic (seeded) and driven by the GSAP timeline, so it is seek-safe.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const W = 1080, H = 1920;

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function E(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  function hex(c) { c = c.replace("#", ""); return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)); }
  function mix(a, b, t) {
    const A = hex(a), B = hex(b);
    return "#" + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, "0")).join("");
  }
  const f1 = (n) => Math.round(n * 10) / 10;

  const PAL = {
    golden: { sky: ["#2b3a64", "#8a6c8a", "#f0a66a", "#ffd79a"], sun: "#fff1cf", glow: "#ffb766", far: "#a08aa6", snow: "#ffe9d6", rock: "#6d5b7c", mid: "#4f4266", near: "#2d2742", city: "#3c3046", cityHaze: "#e2a07e", win: "#ffd58a", lit: 0.12, haze: "#ffc79a", tree: "#2c3a33", ground: "#3a3040" },
    day: { sky: ["#2f6fb6", "#5d9bd6", "#a9cfee", "#e6f1f7"], sun: "#ffffff", glow: "#fff4d6", far: "#a3b8d2", snow: "#ffffff", rock: "#7891ad", mid: "#5d7a90", near: "#3a5660", city: "#7a8798", cityHaze: "#c8d9e8", win: "#e3f1ff", lit: 0, haze: "#e2edf5", tree: "#2f5a3c", ground: "#6b6f75" },
    warm: { sky: ["#4a78a8", "#8fb3cf", "#f2d6b3", "#ffe6c4"], sun: "#fff6e0", glow: "#ffd49a", far: "#aaa7be", snow: "#fff6ec", rock: "#837d98", mid: "#606982", near: "#3c4658", city: "#857a7a", cityHaze: "#e9c7a6", win: "#ffe2a8", lit: 0.1, haze: "#ffe0b8", tree: "#3d5c36", ground: "#9a8a78" },
    alpine: { sky: ["#1f5ea8", "#4f8fd0", "#9fc9ec", "#e3f0f8"], sun: "#ffffff", glow: "#fffbe8", far: "#aec1d9", snow: "#ffffff", rock: "#62779a", mid: "#3f5d6a", near: "#1f3a33", city: "#55606e", cityHaze: "#cfe0ee", win: "#d9ecff", lit: 0, haze: "#e9f3fa", tree: "#1d4634", ground: "#2a4a3a" },
    winter: { sky: ["#2a6ab8", "#5c9ad8", "#a7d0f0", "#eef7fc"], sun: "#ffffff", glow: "#fffbe8", far: "#c6d6e8", snow: "#ffffff", rock: "#8399b3", mid: "#dfe9f3", near: "#f4f8fb", city: "#55606e", cityHaze: "#e6f0f8", win: "#d9ecff", lit: 0, haze: "#f2f8fc", tree: "#24453b", ground: "#e9f1f8" },
    sunset: { sky: ["#1d1838", "#5a3264", "#c4545a", "#f59a52", "#ffd08a"], sun: "#fff0c8", glow: "#ff9a4a", far: "#7a5272", snow: "#ffc6a6", rock: "#5a3a5c", mid: "#3a2846", near: "#1d1526", city: "#22182c", cityHaze: "#c0605a", win: "#ffcf7a", lit: 0.45, haze: "#ff9e70", tree: "#1d1a24", ground: "#1a1420" },
    dusk: { sky: ["#0d1330", "#2b2d5c", "#7a4a74", "#e0855e", "#f6b77a"], sun: "#ffe2b0", glow: "#f08a5a", far: "#4c4a72", snow: "#e2c4d6", rock: "#3b3a5e", mid: "#252646", near: "#12132a", city: "#151530", cityHaze: "#8a5070", win: "#ffd27a", lit: 0.6, haze: "#c2708a", tree: "#11122a", ground: "#101024" },
    night: { sky: ["#03060f", "#0a1430", "#1d2a55", "#3d3a66"], sun: "#dfe6ff", glow: "#5a6aa8", far: "#2a3156", snow: "#9aa5cc", rock: "#222a4c", mid: "#151b38", near: "#0a0e20", city: "#080b18", cityHaze: "#262a50", win: "#ffd27a", lit: 0.8, haze: "#3a3f78", tree: "#080a16", ground: "#070a14" },
  };

  // ---------- noise + shapes ----------
  function noise1(r) {
    const n = 97, v = Array.from({ length: n }, r);
    return (x) => {
      const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
      const a = v[((i % n) + n) % n], b = v[(((i + 1) % n) + n) % n];
      return a * (1 - u) + b * u;
    };
  }
  function ridge(r, o) {
    const x0 = o.x0 ?? -360, x1 = o.x1 ?? 1440, step = o.step ?? 8;
    const oct = o.oct || [[0.0035, 1], [0.009, 0.5], [0.025, 0.2], [0.07, 0.07]];
    const ns = oct.map(() => noise1(r));
    const pts = [];
    for (let x = x0; x <= x1; x += step) {
      let h = 0, tot = 0;
      oct.forEach(([f, a], k) => {
        let v = ns[k](x * f + 40);
        if (o.sharp !== false && k < 2) v = 1 - Math.abs(2 * v - 1);
        h += v * a; tot += a;
      });
      let y = o.base - o.amp * (h / tot);
      if (o.shape) y += o.shape(x);
      pts.push([x, y]);
    }
    return pts;
  }
  const ptsD = (pts) => pts.map((p, i) => (i ? "L" : "M") + f1(p[0]) + "," + f1(p[1])).join("");
  function closedBelow(pts, bottom = H + 600) {
    return ptsD(pts) + `L${pts[pts.length - 1][0]},${bottom}L${pts[0][0]},${bottom}Z`;
  }
  function yAt(pts, x) {
    for (let i = 1; i < pts.length; i++) if (pts[i][0] >= x) {
      const t = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
      return lerp(pts[i - 1][1], pts[i][1], t);
    }
    return pts[pts.length - 1][1];
  }
  function fir(x, y, h) {
    const w = h * 0.34;
    return `M${f1(x)},${f1(y - h)}L${f1(x + w * 0.5)},${f1(y - h * 0.58)}L${f1(x + w * 0.28)},${f1(y - h * 0.58)}L${f1(x + w * 0.8)},${f1(y - h * 0.22)}L${f1(x + w * 0.42)},${f1(y - h * 0.22)}L${f1(x + w)},${f1(y)}L${f1(x - w)},${f1(y)}L${f1(x - w * 0.42)},${f1(y - h * 0.22)}L${f1(x - w * 0.8)},${f1(y - h * 0.22)}L${f1(x - w * 0.28)},${f1(y - h * 0.58)}L${f1(x - w * 0.5)},${f1(y - h * 0.58)}Z`;
  }
  const circ = (cx, cy, r) => `M${f1(cx - r)},${f1(cy)}a${f1(r)},${f1(r)} 0 1,0 ${f1(2 * r)},0a${f1(r)},${f1(r)} 0 1,0 ${f1(-2 * r)},0Z`;
  function person(h) {
    const hr = h * 0.085, bw = h * 0.15;
    return circ(0, -h + hr, hr) +
      `M${f1(-bw)},${f1(-h * 0.78)}Q0,${f1(-h * 0.84)} ${f1(bw)},${f1(-h * 0.78)}L${f1(bw * 0.85)},${f1(-h * 0.42)}L${f1(bw * 0.55)},0L${f1(bw * 0.1)},0L0,${f1(-h * 0.36)}L${f1(-bw * 0.1)},0L${f1(-bw * 0.55)},0L${f1(-bw * 0.85)},${f1(-h * 0.42)}Z`;
  }

  // ---------- scene context ----------
  function makeCtx(svg, spec, tl, t0, D) {
    const P = svg.id + "_";
    const pal = PAL[spec.pal] || PAL.day;
    const defs = E("defs", {}, svg);
    const r = rng(spec.seed || 1);
    const cam = E("g", {}, svg);
    const layers = [];
    const ctx = {
      svg, spec, tl, t0, D, P, pal, defs, r, cam, layers,
      layer(depth) { const g = E("g", {}, cam); layers.push({ g, depth }); return g; },
      grad(id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, user) {
        const g = E("linearGradient", { id: P + id, x1, y1, x2, y2, ...(user ? { gradientUnits: "userSpaceOnUse" } : {}) }, defs);
        stops.forEach(([o, c, a = 1]) => E("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g));
        return `url(#${P}${id})`;
      },
      radial(id, stops, cx = 0.5, cy = 0.5, rr = 0.5) {
        const g = E("radialGradient", { id: P + id, cx, cy, r: rr }, defs);
        stops.forEach(([o, c, a = 1]) => E("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g));
        return `url(#${P}${id})`;
      },
      // tween helpers (absolute film time)
      move(el, from, to, opts = {}) { tl.fromTo(el, from, { ...to, duration: opts.d ?? D, ease: opts.ease ?? "none" }, t0 + (opts.at ?? 0)); },
      loop(el, from, to, period, ease = "sine.inOut", at = 0) {
        const n = Math.max(1, Math.ceil((D - at) / period));
        tl.fromTo(el, from, { ...to, duration: period, ease, repeat: n, yoyo: true }, t0 + at);
      },
      path(el, pts, opts = {}) { // keyframed motion along points
        const per = (opts.d ?? D) / (pts.length - 1);
        tl.set(el, { x: pts[0][0], y: pts[0][1], ...(pts[0][2] != null ? { scale: pts[0][2] } : {}) }, t0 + (opts.at ?? 0));
        tl.to(el, { keyframes: pts.slice(1).map((p) => ({ x: p[0], y: p[1], ...(p[2] != null ? { scale: p[2] } : {}), duration: per, ease: "none" })) }, t0 + (opts.at ?? 0));
      },
    };
    return ctx;
  }

  // ---------- shared building blocks ----------
  function sky(c, g, extra = 0) {
    const s = c.pal.sky;
    const fill = c.grad("sky", s.map((col, i) => [i / (s.length - 1), col]));
    E("rect", { x: -400, y: -600, width: W + 800, height: H + 1200 + extra, fill }, g);
  }
  function sun(c, g, x, y, rad, big = 2.6) {
    E("circle", { cx: x, cy: y, r: rad * big * 3, fill: c.radial("glow", [[0, c.pal.glow, 0.75], [0.35, c.pal.glow, 0.25], [1, c.pal.glow, 0]]) }, g);
    return E("circle", { cx: x, cy: y, r: rad, fill: c.pal.sun }, g);
  }
  function clouds(c, g, n, y0, y1, scale = 1, alpha = 0.75, speed = 1, color = "#ffffff") {
    const fill = c.radial("cl" + Math.round(y0), [[0, color, alpha], [0.55, color, alpha * 0.55], [1, color, 0]]);
    for (let i = 0; i < n; i++) {
      const cg = E("g", {}, g);
      const cx = lerp(-200, W + 200, c.r()), cy = lerp(y0, y1, c.r());
      const parts = 5 + Math.floor(c.r() * 5);
      for (let k = 0; k < parts; k++) {
        E("ellipse", { cx: cx + (k - parts / 2) * 70 * scale + c.r() * 40, cy: cy + (c.r() - 0.5) * 40 * scale, rx: (110 + c.r() * 120) * scale, ry: (50 + c.r() * 50) * scale, fill }, cg);
      }
      const dx = (60 + c.r() * 90) * speed * (c.D / 6);
      c.move(cg, { x: -dx / 2 }, { x: dx / 2 });
    }
  }
  function mountain(c, g, o) {
    const pts = ridge(c.r, o);
    const minY = Math.min(...pts.map((p) => p[1]));
    const sl = o.snowline ?? 0.3;
    const fill = o.flat ? o.color : c.grad("m" + Math.round(o.base) + Math.round(o.amp), [
      [0, o.snow ?? c.pal.snow], [sl, o.snow ?? c.pal.snow], [sl + 0.1, o.color], [1, mix(o.color, "#000000", 0.25)],
    ], 0, minY, 0, o.base + 60, true);
    E("path", { d: closedBelow(pts), fill }, g);
    if (o.rim) E("path", { d: ptsD(pts), fill: "none", stroke: o.rim, "stroke-width": 2.5, "stroke-opacity": 0.55 }, g);
    if (o.haze) E("rect", { x: -400, y: o.base - o.amp * 0.6, width: W + 800, height: o.amp * 0.6 + 900, fill: c.grad("hz" + Math.round(o.base), [[0, c.pal.haze, 0], [0.45, c.pal.haze, o.haze], [1, c.pal.haze, o.haze]]) }, g);
    return pts;
  }
  function forestOn(c, g, pts, o) {
    let d = "";
    for (let x = pts[0][0]; x < pts[pts.length - 1][0]; x += o.gap * (0.6 + c.r() * 0.8)) {
      const y = yAt(pts, x) + (o.drop ?? 0) + c.r() * (o.jitter ?? 10);
      d += fir(x, y, o.h * (0.6 + c.r() * 0.7));
    }
    E("path", { d, fill: o.color }, g);
    if (o.fillBelow) E("path", { d: closedBelow(pts.map(([x, y]) => [x, y + (o.drop ?? 0) + 4])), fill: o.color }, g);
  }
  function cityRows(c, g, o) {
    const rows = o.rows, lit = o.lit ?? c.pal.lit;
    for (let k = 0; k < rows; k++) {
      const z = (k + 1) / rows;
      const y = lerp(o.y0, o.y1, Math.pow(z, 1.7));
      const bw = lerp(o.minW ?? 8, o.maxW ?? 90, Math.pow(z, 1.4));
      const bh = lerp(o.minH ?? 8, o.maxH ?? 240, Math.pow(z, 1.6));
      let d = "", wd = "";
      const cell = Math.max(2.2, bw / 7);
      for (let x = (o.x0 ?? -360) + c.r() * bw; x < (o.x1 ?? 1440);) {
        const w = bw * (0.6 + c.r() * 0.9);
        let h = bh * (0.35 + c.r() * 1.1);
        if (c.r() < 0.05) h *= 2.4;
        d += `M${f1(x)},${f1(y)}h${f1(w)}v${f1(-h)}h${f1(-w)}Z`;
        if (lit > 0) {
          for (let wy = y - cell * 1.6; wy > y - h + cell; wy -= cell * 1.5)
            for (let wx = x + cell * 0.6; wx < x + w - cell; wx += cell * 1.4)
              if (c.r() < lit * 0.55) wd += `M${f1(wx)},${f1(wy)}h${f1(cell * 0.7)}v${f1(-cell * 0.8)}h${f1(-cell * 0.7)}Z`;
        }
        x += w + bw * 0.08 * c.r();
      }
      const col = mix(o.color ?? c.pal.city, o.haze ?? c.pal.cityHaze, Math.pow(1 - z, 1.3) * (o.hazeAmt ?? 0.85));
      E("path", { d, fill: col }, g);
      if (wd) E("path", { d: wd, fill: c.pal.win, opacity: lerp(0.55, 0.95, z) }, g);
      if (o.roofGlow && k < rows - 1) E("rect", { x: -400, y: y - 3, width: W + 800, height: 3, fill: c.pal.glow, opacity: 0.08 }, g);
    }
  }
  function tvTower(c, g, x, base, h, lit) {
    const w = h * 0.05;
    const col = c.pal.near;
    E("path", { d: `M${x - w},${base}L${x - w * 0.18},${base - h * 0.78}L${x + w * 0.18},${base - h * 0.78}L${x + w},${base}Z`, fill: col }, g);
    E("rect", { x: x - w * 0.5, y: base - h * 0.8, width: w, height: h * 0.05, fill: col }, g);
    E("rect", { x: x - w * 0.09, y: base - h, width: w * 0.18, height: h * 0.2, fill: col }, g);
    let lat = "";
    for (let k = 1; k < 9; k++) {
      const t0 = k / 9, t1 = (k + 1) / 9;
      const yA = base - h * 0.78 * t0, yB = base - h * 0.78 * Math.min(t1, 1);
      const wA = lerp(w, w * 0.18, t0), wB = lerp(w, w * 0.18, Math.min(t1, 1));
      lat += `M${x - wA},${yA}L${x + wB},${yB}M${x + wA},${yA}L${x - wB},${yB}`;
    }
    E("path", { d: lat, stroke: mix(col, "#ffffff", 0.15), "stroke-width": 1.5, fill: "none" }, g);
    if (lit) {
      const red = E("circle", { cx: x, cy: base - h, r: 6, fill: "#ff4a3a" }, g);
      c.loop(red, { opacity: 1 }, { opacity: 0.15 }, 0.8);
      for (let k = 1; k < 5; k++) E("circle", { cx: x, cy: base - h * 0.78 * (k / 5), r: 3.5, fill: "#ff6a4a", opacity: 0.85 }, g);
      E("rect", { x: x - w * 0.5, y: base - h * 0.8, width: w, height: h * 0.05, fill: c.pal.win, opacity: 0.55 }, g);
    }
  }
  function birds(c, g, n, y0, color) {
    const fg = E("g", {}, g);
    for (let i = 0; i < n; i++) {
      const b = E("path", { d: "M-10,0 Q-5,-6 0,0 Q5,-6 10,0", fill: "none", stroke: color, "stroke-width": 2.4, "stroke-linecap": "round" }, fg);
      const bx = c.r() * 160, by = y0 + c.r() * 120;
      c.move(b, { x: -200 + bx, y: by }, { x: 650 + bx, y: by - 60 - c.r() * 50 });
      c.loop(b, { scaleY: 1 }, { scaleY: 0.4 }, 0.22 + c.r() * 0.1);
    }
  }
  function people(c, g, n, o) {
    for (let i = 0; i < n; i++) {
      const h = o.h * (0.85 + c.r() * 0.3);
      const pg = E("g", {}, g);
      const col = o.colors ? o.colors[Math.floor(c.r() * o.colors.length)] : o.color;
      E("path", { d: person(h), fill: col }, pg);
      const dir = c.r() < 0.5 ? -1 : 1;
      const x0 = lerp(o.x0, o.x1, c.r()), y = o.y + (c.r() - 0.5) * (o.dy ?? 20);
      const dist = (o.speed ?? 40) * c.D * (0.6 + c.r() * 0.6);
      c.move(pg, { x: x0, y }, { x: x0 + dir * dist, y });
      const bob = E("g", {}, pg);
      pg.firstChild && bob.appendChild(pg.firstChild);
      c.loop(bob, { y: 0 }, { y: -h * 0.03 }, 0.27 + c.r() * 0.06);
    }
  }
  function decid(c, cx, cy, rad) {
    let d = circ(cx, cy, rad);
    for (let k = 0; k < 5; k++) d += circ(cx + (c.r() - 0.5) * rad * 1.3, cy + (c.r() - 0.6) * rad, rad * (0.5 + c.r() * 0.35));
    return d;
  }
  function particles(c, g, n, o) {
    for (let i = 0; i < n; i++) {
      const p = E("circle", { cx: 0, cy: 0, r: o.r * (0.5 + c.r()), fill: o.color, opacity: o.alpha * (0.4 + c.r() * 0.6) }, g);
      const x = c.r() * W, y = lerp(o.y0, o.y1, c.r());
      c.move(p, { x, y }, { x: x + (o.dx ?? 0) * (0.5 + c.r()), y: y + (o.dy ?? 0) * (0.5 + c.r()) });
      if (o.twinkle) c.loop(p, { opacity: 0.1 }, { opacity: o.alpha }, 0.6 + c.r() * 1.2, "sine.inOut", c.r());
    }
  }
  function stars(c, g, n, y1) { particles(c, g, n, { r: 1.6, color: "#ffffff", alpha: 0.9, y0: -200, y1, twinkle: true }); }

  // ---------- scene kinds ----------
  const KINDS = {};

  KINDS.aerial = (c) => {
    const { pal, spec } = c;
    const dusk = spec.pal === "dusk" || spec.pal === "night";
    sky(c, c.layer(0.02));
    const s0 = c.layer(0.05);
    if (dusk) stars(c, s0, 60, 500);
    sun(c, s0, 760, dusk ? 980 : 780, dusk ? 60 : 64);
    const cl = c.layer(0.1);
    clouds(c, cl, 4, 200, 640, 1.1, dusk ? 0.35 : 0.55, 1, dusk ? "#f4b8a0" : "#ffe7cc");
    mountain(c, c.layer(0.15), { base: 1010, amp: 470, color: pal.far, snowline: 0.34, rim: pal.glow, haze: 0.35 });
    const midPts = mountain(c, c.layer(0.25), { base: 1080, amp: 230, color: pal.mid, snowline: 0.12, haze: 0.25 });
    const fh = c.layer(0.35);
    const foot = mountain(c, fh, { base: 1130, amp: 90, color: pal.near, flat: true, sharp: false });
    forestOn(c, fh, foot, { gap: 11, h: 26, color: mix(pal.tree, pal.near, 0.3), drop: 6 });
    tvTower(c, fh, 930, yAt(foot, 930) + 4, 230, dusk);
    const cityFar = c.layer(0.5), cityNear = c.layer(0.85);
    cityRows(c, cityFar, { y0: 1120, y1: 1460, rows: 6, minW: 6, maxW: 26, minH: 5, maxH: 50 });
    cityRows(c, cityNear, { y0: 1470, y1: 2050, rows: 5, minW: 28, maxW: 95, minH: 50, maxH: 260, hazeAmt: 0.5 });
    if (dusk) {
      const tr = c.layer(0.7);
      for (let k = 0; k < 4; k++) {
        const y = 1380 + k * 120;
        const p = E("path", { d: `M-300,${y} C200,${y - 40} 700,${y + 30} 1400,${y - 20}`, fill: "none", stroke: k % 2 ? "#ffb35a" : "#fff1d0", "stroke-width": 2 + k, "stroke-dasharray": "18 46", opacity: 0.75 }, tr);
        c.move(p, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": (k % 2 ? 1 : -1) * 64 * 6 } });
      }
    }
    birds(c, c.layer(0.6), 5, 560, dusk ? "#1a1428" : "#3a2a3a");
    const pb = spec.pullback;
    return { cam: pb ? { s0: 1.22, s1: 1.0, y0: -80, y1: 20, x0: 0, x1: 0 } : { s0: 1.0, s1: 1.13, y0: 0, y1: -50, x0: 30, x1: -30 } };
  };

  KINDS.panorama = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    sun(c, c.layer(0.05), 220, 700, 58);
    clouds(c, c.layer(0.12), 5, 180, 700, 1.2, 0.5, 0.8, "#ffe7cc");
    mountain(c, c.layer(0.18), { base: 1120, amp: 620, color: pal.far, snowline: 0.36, rim: pal.glow, haze: 0.3, x0: -520, x1: 1600 });
    mountain(c, c.layer(0.3), { base: 1180, amp: 300, color: pal.mid, snowline: 0.1, haze: 0.2, x0: -520, x1: 1600 });
    const fh = c.layer(0.45);
    const foot = mountain(c, fh, { base: 1240, amp: 110, color: pal.near, flat: true, sharp: false, x0: -520, x1: 1600 });
    forestOn(c, fh, foot, { gap: 12, h: 30, color: mix(pal.tree, pal.near, 0.3), drop: 6 });
    cityRows(c, c.layer(0.7), { y0: 1240, y1: 2060, rows: 8, minW: 8, maxW: 90, minH: 6, maxH: 230, x0: -520, x1: 1600 });
    birds(c, c.layer(0.6), 4, 620, "#3a2a3a");
    return { cam: { s0: 1.06, s1: 1.1, x0: 190, x1: -190, y0: 0, y1: -20 } };
  };

  function streetScene(c, walk) {
    const { pal, r } = c;
    const VX = 540, VY = 880;
    sky(c, c.layer(0.02));
    const far = c.layer(0.08);
    clouds(c, far, 3, 160, 520, 0.9, 0.55);
    mountain(c, far, { base: 900, amp: 300, color: pal.far, snowline: 0.4, haze: 0.3 });
    const g = c.layer(0.6);
    // ground
    const groundCol = walk ? "#a8957f" : "#4c5058";
    E("path", { d: `M${VX - 70},${VY}L${VX + 70},${VY}L${W + 700},${H + 200}L${-700},${H + 200}Z`, fill: c.grad("road", [[0, mix(groundCol, pal.haze, 0.5)], [1, groundCol]]) }, g);
    if (walk) {
      let d = "";
      for (let k = 1; k < 14; k++) { const t = Math.pow(k / 14, 2.2); const y = lerp(VY, H + 200, t); const hw = lerp(70, 1400, t); d += `M${VX - hw},${f1(y)}L${VX + hw},${f1(y)}`; }
      for (let k = -6; k <= 6; k++) d += `M${VX + k * 12},${VY}L${VX + k * 230},${H + 200}`;
      E("path", { d, stroke: "#8a7865", "stroke-width": 2, fill: "none", opacity: 0.6 }, g);
    } else {
      E("path", { d: `M${VX - 70},${VY}L${VX - 120},${VY}L${-900},${H + 200}L${-700},${H + 200}Z`, fill: "#9a9690" }, g);
      E("path", { d: `M${VX + 70},${VY}L${VX + 120},${VY}L${W + 900},${H + 200}L${W + 700},${H + 200}Z`, fill: "#9a9690" }, g);
      for (const s of [-1, 1]) {
        const dash = E("path", { d: `M${VX + s * 18},${VY}L${VX + s * 360},${H + 200}`, stroke: "#f2efe6", "stroke-width": 9, "stroke-dasharray": "30 60", fill: "none", opacity: 0.85 }, g);
        c.move(dash, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -90 * 8 } });
      }
    }
    // facades on both sides, buildings shrinking toward the vanishing point
    for (const side of [-1, 1]) {
      let u = 0;
      const nearX = side < 0 ? -260 : W + 260;
      for (let b = 0; b < 9; b++) {
        const u1 = u + (1 - u) * (0.28 + r() * 0.12);
        const hf = 0.55 + r() * 0.5;
        const px = (t) => lerp(nearX, VX + side * 100, t);
        const top = (t) => lerp(VY - 1500 * hf, VY - 40 * hf, t);
        const bot = (t) => lerp(H + 40, VY + 6, t);
        const col = [mix("#d8c7ae", pal.haze, 0.2), "#c7b49b", "#e5dccc", "#b9a68f", "#cfc5b8"][b % 5];
        const shade = side < 0 ? 0.0 : 0.12;
        E("path", { d: `M${f1(px(u))},${f1(top(u))}L${f1(px(u1))},${f1(top(u1))}L${f1(px(u1))},${f1(bot(u1))}L${f1(px(u))},${f1(bot(u))}Z`, fill: mix(mix(col, "#000000", shade), pal.haze, u * 0.6) }, g);
        let wd = "";
        const floors = 6 + Math.floor(r() * 6), cols = 3 + Math.floor(r() * 3);
        for (let fl = 0; fl < floors; fl++) for (let cc = 0; cc < cols; cc++) {
          const ta = lerp(u, u1, (cc + 0.25) / cols), tb = lerp(u, u1, (cc + 0.7) / cols);
          const va = (fl + 0.3) / floors, vb = (fl + 0.75) / floors;
          const y = (t, v) => lerp(top(t), bot(t) - (bot(t) - top(t)) * 0.12, v);
          wd += `M${f1(px(ta))},${f1(y(ta, va))}L${f1(px(tb))},${f1(y(tb, va))}L${f1(px(tb))},${f1(y(tb, vb))}L${f1(px(ta))},${f1(y(ta, vb))}Z`;
        }
        E("path", { d: wd, fill: walk ? "#5a4a3c" : "#3c4a5a", opacity: lerp(0.75, 0.3, u) }, g);
        u = u1;
      }
    }
    // trees along both sidewalks
    const tg = c.layer(0.75);
    for (const side of [-1, 1]) for (let k = 0; k < 7; k++) {
      const t = 1 - Math.pow(0.72, k + 1);
      const x = lerp(side < 0 ? 60 : W - 60, VX + side * 120, t), y = lerp(H - 120, VY + 10, t), s = lerp(1, 0.04, t);
      E("rect", { x: x - 14 * s, y: y - 520 * s, width: 28 * s, height: 520 * s, fill: "#3a2e26" }, tg);
      E("path", { d: decid(c, x, y - 620 * s, 190 * s), fill: mix(pal.tree, pal.haze, t * 0.5), opacity: 0.96 }, tg);
    }
    if (walk) {
      const lg = c.layer(0.8);
      for (let k = 0; k < 6; k++) {
        const t = 1 - Math.pow(0.7, k + 1), y = lerp(260, VY - 60, t), x0 = lerp(-60, VX - 120, t), x1 = lerp(W + 60, VX + 120, t), sag = lerp(140, 8, t);
        E("path", { d: `M${x0},${y}Q${VX},${y + sag * 2} ${x1},${y}`, stroke: "#2a2018", "stroke-width": lerp(3, 0.6, t), fill: "none" }, lg);
        for (let b = 1; b < 14; b++) {
          const q = b / 14, bx = (1 - q) * (1 - q) * x0 + 2 * (1 - q) * q * VX + q * q * x1, by = (1 - q) * (1 - q) * y + 2 * (1 - q) * q * (y + sag * 2) + q * q * y;
          const bulb = E("circle", { cx: bx, cy: by + 6 * (1 - t), r: lerp(9, 1.5, t), fill: "#ffd98a" }, lg);
          if (b % 3 === k % 3) c.loop(bulb, { opacity: 1 }, { opacity: 0.55 }, 0.9 + (b % 4) * 0.2);
        }
      }
    }
    // pedestrians (approaching and receding) on sidewalks / street
    const pg = c.layer(0.9);
    const n = walk ? 16 : 9;
    const cols = walk ? ["#2a2430", "#5a2e3a", "#2e3e5a", "#3a3a2a", "#6a4a3a"] : ["#22262e", "#3a2e2e", "#2e3646"];
    for (let i = 0; i < n; i++) {
      const lane = walk ? lerp(-0.85, 0.85, c.r()) : (c.r() < 0.5 ? -1 : 1) * (0.78 + c.r() * 0.12);
      const toward = c.r() < 0.55;
      const ph = c.r();
      const tA = toward ? 0.08 + ph * 0.3 : 0.55 + ph * 0.3, tB = toward ? Math.min(0.98, tA + 0.45) : Math.max(0.05, tA - 0.4);
      const pos = (t) => [lerp(VX + lane * 70, VX + lane * 640, t), lerp(VY, H + 80, t), lerp(0.08, 2.3, Math.pow(t, 1.15))];
      const el = E("g", {}, pg);
      const body = E("path", { d: person(170), fill: cols[i % cols.length] }, el);
      const kf = Array.from({ length: 7 }, (_, k) => pos(lerp(tA, tB, Math.pow(k / 6, toward ? 1.6 : 0.7))));
      c.path(el, kf);
      c.loop(body, { y: 0 }, { y: -5 }, 0.28 + c.r() * 0.05);
    }
    if (!walk) {
      for (let i = 0; i < 3; i++) {
        const lane = i % 2 ? 0.22 : -0.22, toward = i % 2 === 1;
        const el = E("g", {}, pg);
        E("path", { d: "M-60,0L-60,-38Q-50,-70 -20,-72L25,-72Q52,-70 60,-38L60,0Z", fill: ["#c23b32", "#e8e6e1", "#2a3a52"][i] }, el);
        E("rect", { x: -48, y: -66, width: 96, height: 22, rx: 6, fill: "#9cc0dc", opacity: 0.8 }, el);
        E("circle", { cx: -42, cy: -14, r: 7, fill: toward ? "#fff6d0" : "#ff4a3a" }, el);
        E("circle", { cx: 42, cy: -14, r: 7, fill: toward ? "#fff6d0" : "#ff4a3a" }, el);
        const pos = (t) => [lerp(VX + lane * 60, VX + lane * 900, t), lerp(VY + 4, H + 120, t), lerp(0.1, 3.2, t)];
        const a = toward ? 0.05 + i * 0.1 : 0.7, b = toward ? 0.75 : 0.12 + i * 0.05;
        c.path(el, Array.from({ length: 7 }, (_, k) => pos(lerp(a, b, Math.pow(k / 6, toward ? 1.8 : 0.6)))), {});
      }
    }
    return { cam: { s0: 1.0, s1: 1.12, x0: 0, x1: 0, y0: 0, y1: 0, origin: `${VX} ${VY}` } };
  }
  KINDS.street = (c) => streetScene(c, c.spec.variant === "walk");

  KINDS.towers = (c) => {
    const { r } = c;
    sky(c, c.layer(0.02));
    const sl = c.layer(0.05);
    sun(c, sl, 880, 260, 70, 3);
    clouds(c, c.layer(0.15), 5, 100, 1100, 1.2, 0.7, 2.2);
    const g = c.layer(0.6);
    const towers = [
      { bx: -120, bw: 520, tx: 160, tw: 150, ty: 380 },
      { bx: 360, bw: 380, tx: 470, tw: 120, ty: 120 },
      { bx: 640, bw: 560, tx: 760, tw: 170, ty: 520 },
    ];
    towers.forEach((t, i) => {
      const d = `M${t.bx},${H + 100}L${t.tx},${t.ty}L${t.tx + t.tw},${t.ty - (i === 1 ? 70 : 20)}L${t.bx + t.bw},${H + 100}Z`;
      E("path", { d, fill: c.grad("tw" + i, [[0, i === 1 ? "#8cc4ec" : "#5a8cc0"], [0.45, i === 1 ? "#3a6a9a" : "#2a4f78"], [1, "#16263a"]], i === 2 ? 1 : 0, 0, i === 2 ? 0 : 1, 0.2) }, g);
      let ln = "";
      for (let k = 1; k < 9; k++) { const q = k / 9; ln += `M${lerp(t.bx, t.bx + t.bw, q)},${H + 100}L${lerp(t.tx, t.tx + t.tw, q)},${t.ty - (i === 1 ? 70 * q : 20 * q)}`; }
      for (let k = 1; k < 40; k++) {
        const q = 1 - Math.pow(1 - k / 40, 1.8), y = lerp(H + 100, t.ty, q);
        ln += `M${lerp(t.bx, t.tx, q)},${y}L${lerp(t.bx + t.bw, t.tx + t.tw, q)},${y - lerp(0, i === 1 ? 70 : 20, q)}`;
      }
      E("path", { d: ln, stroke: "#cfe6f8", "stroke-width": 1.2, opacity: 0.35, fill: "none" }, g);
      const glint = E("path", { d, fill: c.grad("gl" + i, [[0, "#ffffff", 0], [0.48, "#ffffff", 0], [0.5, "#ffffff", 0.35], [0.56, "#ffffff", 0], [1, "#ffffff", 0]], 0, 1, 1, 0) }, g);
      c.move(glint, { opacity: 0.2 }, { opacity: 0.9 });
    });
    const fl = c.layer(0.1);
    [[0.3, 46], [0.48, 22], [0.62, 70]].forEach(([q, rr]) => E("circle", { cx: lerp(880, 300, q), cy: lerp(260, 1400, q), r: rr, fill: "#fff3d0", opacity: 0.18 }, fl));
    birds(c, c.layer(0.3), 3, 700, "#1a2430");
    return { cam: { s0: 1.06, s1: 1.14, y0: 140, y1: -60, x0: -20, x1: 20, rot0: -1.5, rot1: 1 } };
  };

  KINDS.park = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    sun(c, c.layer(0.05), 300, 640, 60);
    mountain(c, c.layer(0.1), { base: 980, amp: 330, color: pal.far, snowline: 0.35, haze: 0.4 });
    const bg = c.layer(0.3);
    for (let k = 0; k < 18; k++) E("path", { d: decid(c, -300 + k * 100 + c.r() * 40, 1060 + c.r() * 60, 90 + c.r() * 40), fill: mix(pal.tree, pal.haze, 0.45) }, bg);
    const gr = c.layer(0.5);
    E("rect", { x: -500, y: 1100, width: W + 1000, height: 1300, fill: c.grad("lawn", [[0, "#7d9a52"], [1, "#4d6a35"]]) }, gr);
    E("path", { d: "M-500,1500 C100,1380 500,1300 1600,1240 L1600,1330 C600,1390 200,1470 -500,1640Z", fill: "#d8c4a4" }, gr);
    // cafe kiosk with string lights
    E("rect", { x: 620, y: 1060, width: 300, height: 170, fill: "#e8dccb" }, gr);
    E("path", { d: "M600,1060L940,1060L920,1010L620,1010Z", fill: "#b84a3a" }, gr);
    for (let k = 0; k < 6; k++) { E("rect", { x: 600 + k * 66, y: 1200 + (k % 2) * 30, width: 50, height: 6, fill: "#5a4030" }, gr); }
    const lights = c.layer(0.55);
    E("path", { d: "M-100,880 Q350,1000 760,900 T1500,940", stroke: "#2a2018", "stroke-width": 2, fill: "none" }, lights);
    for (let k = 0; k < 26; k++) {
      const q = k / 25, x = lerp(-100, 1500, q), y = 880 + Math.sin(q * Math.PI * 2) * 40 + 60 * Math.sin(q * Math.PI);
      const b = E("circle", { cx: x, cy: y + 8, r: 8, fill: "#ffd98a" }, lights);
      c.loop(b, { opacity: 1 }, { opacity: 0.6 }, 0.8 + (k % 5) * 0.15);
    }
    people(c, c.layer(0.62), 9, { x0: -200, x1: 1200, y: 1400, dy: 120, h: 190, speed: 38, colors: ["#3a2e3a", "#5a3a2e", "#2e3a4a", "#6a5a3a", "#8a3a3a"] });
    const fg = c.layer(1.4);
    for (const x of [-60, 1120]) {
      E("rect", { x: x - 30, y: 0, width: 60, height: H + 200, fill: "#2a2018" }, fg);
      E("path", { d: decid(c, x, 120, 280), fill: mix(pal.tree, "#000000", 0.35) }, fg);
    }
    particles(c, c.layer(0.9), 18, { r: 10, color: "#ffe2a8", alpha: 0.28, y0: 300, y1: 1600, dx: 40, dy: -60 });
    return { cam: { s0: 1.08, s1: 1.12, x0: 120, x1: -120, y0: 0, y1: -20 } };
  };

  KINDS.peaks = (c) => {
    const { pal, spec } = c;
    const dusk = spec.pal === "dusk";
    sky(c, c.layer(0.02));
    const s0 = c.layer(0.05);
    if (dusk) stars(c, s0, 70, 700); else sun(c, s0, 830, 420, 54, 3);
    if (dusk) sun(c, s0, 300, 1250, 70, 3.4);
    clouds(c, c.layer(0.1), 3, 300, 650, 1.3, 0.55, 0.7, dusk ? "#f2a890" : "#ffffff");
    mountain(c, c.layer(0.2), { base: 1260, amp: 940, color: dusk ? pal.far : pal.rock, snowline: dusk ? 0.2 : 0.42, rim: dusk ? "#ffb88a" : "#ffffff", haze: dusk ? 0.2 : 0.12, oct: [[0.0028, 1], [0.008, 0.55], [0.022, 0.22], [0.06, 0.08]], flat: dusk });
    clouds(c, c.layer(0.3), 4, 980, 1220, 1.6, dusk ? 0.35 : 0.85, 1.4, dusk ? "#c08aa0" : "#ffffff");
    const mid = c.layer(0.4);
    const mp = mountain(c, mid, { base: 1560, amp: 520, color: pal.mid, snowline: dusk ? 0 : 0.18, haze: 0.18, flat: dusk });
    if (!dusk) forestOn(c, mid, mp.map(([x, y]) => [x, y + 220]), { gap: 9, h: 34, color: pal.tree, drop: 0, jitter: 30 });
    clouds(c, c.layer(0.55), 3, 1350, 1500, 1.8, dusk ? 0.3 : 0.75, 2, dusk ? "#a07090" : "#ffffff");
    const near = c.layer(0.75);
    const np = mountain(c, near, { base: 1900, amp: 300, color: pal.near, flat: true, sharp: false });
    forestOn(c, near, np, { gap: 16, h: 90, color: dusk ? "#0c0c1e" : mix(pal.tree, "#000000", 0.3), drop: 10, jitter: 14 });
    if (!dusk) {
      const rays = c.layer(0.08);
      for (let k = 0; k < 4; k++) {
        const ray = E("path", { d: `M830,420L${-200 + k * 260},${H}L${-80 + k * 260},${H}Z`, fill: "#ffffff", opacity: 0.05 }, rays);
        c.loop(ray, { opacity: 0.02 }, { opacity: 0.08 }, 2.5 + k * 0.4);
      }
    }
    if (dusk) birds(c, c.layer(0.5), 4, 900, "#14142a");
    return { cam: { s0: 1.0, s1: 1.1, x0: -40, x1: 40, y0: 30, y1: -30 } };
  };

  KINDS.forest = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    sun(c, c.layer(0.05), 260, 360, 56, 3);
    mountain(c, c.layer(0.1), { base: 900, amp: 520, color: pal.rock, snowline: 0.45, haze: 0.2 });
    for (let k = 0; k < 5; k++) {
      const depth = 0.22 + k * 0.2;
      const g = c.layer(depth);
      const base = 900 + k * 230, col = mix(pal.tree, pal.haze, 0.62 - k * 0.15);
      const pts = ridge(c.r, { base, amp: 240 - k * 20, sharp: false, oct: [[0.003, 1], [0.01, 0.4]] });
      forestOn(c, g, pts, { gap: 7 + k * 4, h: 40 + k * 34, color: col, drop: 0, jitter: 8 + k * 6, fillBelow: true });
      const mist = E("rect", { x: -500, y: base - 60, width: W + 1000, height: 200, fill: c.grad("mist" + k, [[0, "#ffffff", 0], [0.5, "#ffffff", 0.32 - k * 0.04], [1, "#ffffff", 0]]) }, g);
      c.move(mist, { x: -80 }, { x: 80 });
    }
    birds(c, c.layer(0.4), 3, 700, "#1d2a24");
    return { cam: { s0: 1.04, s1: 1.14, x0: 0, x1: 0, y0: 160, y1: -160 } };
  };

  KINDS.rink = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    sun(c, c.layer(0.05), 820, 330, 50, 3);
    mountain(c, c.layer(0.12), { base: 1000, amp: 760, color: pal.rock, snowline: 0.55, rim: "#ffffff", haze: 0.15, shape: (x) => -Math.abs(x - 540) * 0.25 + 100 });
    const sl = c.layer(0.25);
    const left = `M-400,700 C0,800 200,1000 420,1180 L-400,1300Z`, right = `M1480,640 C1080,780 860,1000 660,1180 L1480,1300Z`;
    E("path", { d: left, fill: c.grad("sl", [[0, "#ffffff"], [1, "#c8d8e8"]]) }, sl);
    E("path", { d: right, fill: "#d4e2ef" }, sl);
    forestOn(c, sl, [[-400, 900], [0, 1000], [300, 1150], [420, 1220]].flatMap((p, i, a) => (i ? Array.from({ length: 20 }, (_, k) => [lerp(a[i - 1][0], p[0], k / 20), lerp(a[i - 1][1], p[1], k / 20)]) : [])), { gap: 18, h: 40, color: pal.tree, drop: 0, jitter: 60 });
    forestOn(c, sl, [[1480, 860], [1100, 960], [800, 1120], [660, 1220]].flatMap((p, i, a) => (i ? Array.from({ length: 20 }, (_, k) => [lerp(a[i - 1][0], p[0], k / 20), lerp(a[i - 1][1], p[1], k / 20)]) : [])).sort((a, b) => a[0] - b[0]), { gap: 18, h: 40, color: pal.tree, drop: 0, jitter: 60 });
    const g = c.layer(0.6);
    // stands
    for (let k = 0; k < 7; k++) E("ellipse", { cx: 540, cy: 1420, rx: 700 - k * 18, ry: 330 - k * 12, fill: k % 2 ? "#2e4a6a" : "#3a5a7e" }, g);
    E("ellipse", { cx: 540, cy: 1430, rx: 560, ry: 240, fill: c.grad("ice", [[0, "#f4fbff"], [1, "#bcd8ee"]]) }, g);
    E("ellipse", { cx: 540, cy: 1430, rx: 470, ry: 190, fill: "none", stroke: "#8fb6d8", "stroke-width": 3, opacity: 0.7 }, g);
    E("ellipse", { cx: 540, cy: 1430, rx: 380, ry: 140, fill: "none", stroke: "#e05a5a", "stroke-width": 3, opacity: 0.5 }, g);
    const sk = c.layer(0.62);
    const cols = ["#c0392b", "#1f3a5a", "#2a2a2a", "#e0a020", "#5a2a6a", "#1a6a5a"];
    for (let i = 0; i < 16; i++) {
      const rx = 420 + c.r() * 90, ry = 165 + c.r() * 40, ph = c.r() * Math.PI * 2, laps = (c.D / 9) * (0.8 + c.r() * 0.5);
      const el = E("g", {}, sk);
      E("path", { d: person(46), fill: cols[i % cols.length] }, el);
      const pts = Array.from({ length: 40 }, (_, k) => { const a = ph - (k / 39) * laps * Math.PI * 2; const y = 1430 + Math.sin(a) * ry; return [540 + Math.cos(a) * rx, y, lerp(0.75, 1.15, (y - 1240) / 380)]; });
      c.path(el, pts);
    }
    particles(c, c.layer(0.9), 40, { r: 3, color: "#ffffff", alpha: 0.8, y0: -100, y1: 1400, dx: 40, dy: 500 });
    return { cam: { s0: 1.02, s1: 1.1, x0: 50, x1: -50, y0: 0, y1: -30 } };
  };

  KINDS.cablecar = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    sun(c, c.layer(0.05), 220, 300, 52, 3);
    mountain(c, c.layer(0.15), { base: 1100, amp: 800, color: pal.rock, snowline: 0.5, rim: "#ffffff", haze: 0.12 });
    const sl = c.layer(0.35);
    const slope = ridge(c.r, { base: 1700, amp: 300, sharp: false, shape: (x) => -x * 0.55 + 200 });
    E("path", { d: closedBelow(slope), fill: c.grad("snow", [[0, "#ffffff"], [1, "#cfe0ef"]]) }, sl);
    for (let k = 0; k < 4; k++) forestOn(c, sl, slope.map(([x, y]) => [x, y + 120 + k * 150]), { gap: 26, h: 50 + k * 14, color: pal.tree, jitter: 60 });
    const g = c.layer(0.6);
    const A = [-200, 1640], B = [1300, 260];
    for (const off of [0, 70]) E("path", { d: `M${A[0]},${A[1] + off}Q${540},${1050 + off} ${B[0]},${B[1] + off}`, stroke: "#2a2f38", "stroke-width": 3, fill: "none" }, g);
    const qp = (q, off) => { const x = (1 - q) * (1 - q) * A[0] + 2 * (1 - q) * q * 540 + q * q * B[0]; const y = (1 - q) * (1 - q) * (A[1] + off) + 2 * (1 - q) * q * (1050 + off) + q * q * (B[1] + off); return [x, y]; };
    for (const q of [0.22, 0.62]) {
      const [x, y] = qp(q, 35);
      E("path", { d: `M${x - 60},${y + 900}L${x - 10},${y - 20}L${x + 10},${y - 20}L${x + 60},${y + 900}Z`, fill: "#3a4048" }, g);
      E("rect", { x: x - 70, y: y - 30, width: 140, height: 14, fill: "#3a4048" }, g);
    }
    const cg = c.layer(0.62);
    for (let i = 0; i < 6; i++) {
      const up = i % 2 === 0, off = up ? 0 : 70;
      const el = E("g", {}, cg);
      E("line", { x1: 0, y1: 0, x2: 0, y2: 46, stroke: "#2a2f38", "stroke-width": 4 }, el);
      E("rect", { x: -44, y: 46, width: 88, height: 84, rx: 16, fill: ["#d63a2f", "#f2b632", "#e8e8e8"][i % 3] }, el);
      E("rect", { x: -34, y: 58, width: 68, height: 34, rx: 6, fill: "#9cc8e8", opacity: 0.9 }, el);
      const q0 = (i / 6 + (up ? 0 : 0.08)) % 1, span = 0.22 * (c.D / 5.5);
      const pts = Array.from({ length: 12 }, (_, k) => { const q = up ? q0 + span * (k / 11) : q0 + span - span * (k / 11); const [x, y] = qp(Math.min(Math.max(q, -0.1), 1.1), off); return [x, y]; });
      c.path(el, pts);
    }
    particles(c, c.layer(0.9), 25, { r: 2.6, color: "#ffffff", alpha: 0.8, y0: -100, y1: 1500, dx: 60, dy: 400 });
    return { cam: { s0: 1.04, s1: 1.12, x0: 60, x1: -60, y0: 40, y1: -40 } };
  };

  KINDS.slopes = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    sun(c, c.layer(0.05), 780, 360, 56, 3.2);
    mountain(c, c.layer(0.15), { base: 1050, amp: 820, color: pal.rock, snowline: 0.62, rim: "#ffffff", haze: 0.1, oct: [[0.003, 1], [0.009, 0.5], [0.03, 0.2], [0.08, 0.06]] });
    const sl = c.layer(0.35);
    const p1 = ridge(c.r, { base: 1250, amp: 280, sharp: false });
    E("path", { d: closedBelow(p1), fill: c.grad("sn", [[0, "#ffffff"], [1, "#d8e6f2"]]) }, sl);
    E("path", { d: "M300,1100 C380,1300 260,1500 420,1900 M640,1080 C560,1300 700,1550 620,1900", stroke: "#c6d8ea", "stroke-width": 26, fill: "none", opacity: 0.8 }, sl);
    forestOn(c, sl, p1.map(([x, y]) => [x, y + 240]).filter(([x]) => x < 220 || x > 760), { gap: 20, h: 70, color: pal.tree, jitter: 120 });
    const lift = c.layer(0.4);
    E("line", { x1: 900, y1: 1900, x2: 980, y2: 1000, stroke: "#2a2f38", "stroke-width": 3 }, lift);
    for (let i = 0; i < 7; i++) {
      const ch = E("g", {}, lift);
      E("path", { d: "M0,0 L0,30 M-16,30 h32 v12 h-32Z", stroke: "#2a2f38", "stroke-width": 3, fill: "#2a2f38" }, ch);
      const a = i / 7;
      c.move(ch, { x: lerp(900, 980, a), y: lerp(1900, 1000, a) }, { x: lerp(900, 980, a + 0.12), y: lerp(1900, 1000, a + 0.12) });
    }
    const sk = c.layer(0.5);
    for (let i = 0; i < 9; i++) {
      const el = E("g", {}, sk);
      E("path", { d: person(40), fill: ["#d63a2f", "#1f3a8a", "#f2b632", "#2a2a2a"][i % 4] }, el);
      E("line", { x1: -16, y1: 0, x2: 16, y2: 2, stroke: "#222", "stroke-width": 3 }, el);
      const lane = i % 2 ? 640 : 330, start = 1080 + c.r() * 200;
      const pts = Array.from({ length: 10 }, (_, k) => { const y = start + k * 70 * (c.D / 6); return [lane + Math.sin(k * 1.4 + i) * 70, y, lerp(0.8, 1.8, (y - 1080) / 900)]; });
      c.path(el, pts);
    }
    const ch = c.layer(0.8);
    for (let k = 0; k < 4; k++) {
      const x = -40 + k * 140;
      E("path", { d: `M${x},1900L${x},1760L${x + 60},1700L${x + 120},1760L${x + 120},1900Z`, fill: "#7a4a32" }, ch);
      E("path", { d: `M${x - 14},1768L${x + 60},1690L${x + 134},1768L${x + 120},1772L${x + 60},1712L${x},1772Z`, fill: "#ffffff" }, ch);
    }
    particles(c, c.layer(0.6), 30, { r: 2.5, color: "#ffffff", alpha: 1, y0: 1200, y1: 1900, twinkle: true });
    return { cam: { s0: 1.03, s1: 1.12, x0: -30, x1: 30, y0: 0, y1: -40 } };
  };

  KINDS.viewpoint = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    const sg = c.layer(0.06);
    const s = sun(c, sg, 380, 980, 80, 3.4);
    c.move(s, { y: 0 }, { y: 60 });
    clouds(c, c.layer(0.1), 4, 300, 900, 1.3, 0.4, 0.7, "#ffb08a");
    E("rect", { x: -400, y: 1050, width: W + 800, height: 40, fill: pal.cityHaze, opacity: 0.6 }, c.layer(0.15));
    cityRows(c, c.layer(0.35), { y0: 1060, y1: 1560, rows: 9, minW: 5, maxW: 40, minH: 4, maxH: 90, lit: 0.35 });
    const hill = c.layer(0.8);
    E("path", { d: "M-400,1560 C200,1500 700,1540 1480,1500 L1480,2400 L-400,2400Z", fill: pal.near }, hill);
    tvTower(c, hill, 120, 1560, 1250, true);
    E("path", { d: "M-400,1600 L1480,1585", stroke: "#0e0a14", "stroke-width": 8 }, hill);
    for (let k = 0; k < 20; k++) E("rect", { x: -380 + k * 95, y: 1590 - k * 0.8, width: 7, height: 90, fill: "#0e0a14" }, hill);
    E("path", { d: "M-400,1660 L1480,1645", stroke: "#0e0a14", "stroke-width": 6 }, hill);
    const pp = c.layer(0.85);
    const spots = [[420, 1700, 210], [500, 1700, 190], [760, 1710, 220], [930, 1705, 200]];
    spots.forEach(([x, y, h], i) => {
      const el = E("g", {}, pp);
      E("path", { d: person(h), fill: "#0c0810" }, el);
      c.move(el, { x, y }, { x: x + (i === 2 ? -40 : 6), y });
    });
    people(c, pp, 2, { x0: 100, x1: 1000, y: 1790, h: 260, speed: 45, color: "#0a070e" });
    birds(c, c.layer(0.4), 5, 760, "#1a1020");
    return { cam: { s0: 1.0, s1: 1.1, x0: 40, x1: -60, y0: 0, y1: -30 } };
  };

  KINDS.sunsetcity = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    const sg = c.layer(0.06);
    const s = sun(c, sg, 600, 1080, 130, 3);
    c.move(s, { y: -40 }, { y: 120 });
    clouds(c, c.layer(0.1), 4, 500, 1000, 1.5, 0.35, 0.6, "#ffa070");
    mountain(c, c.layer(0.15), { base: 1260, amp: 380, color: pal.far, flat: true, x0: -400, x1: 600, shape: (x) => (x > 200 ? (x - 200) * 0.9 : 0) });
    const g = c.layer(0.5);
    cityRows(c, g, { y0: 1250, y1: 2000, rows: 7, minW: 10, maxW: 110, minH: 30, maxH: 520, hazeAmt: 0.4 });
    tvTower(c, c.layer(0.4), 900, 1330, 700, true);
    birds(c, c.layer(0.3), 7, 900, "#1a1020");
    return { cam: { s0: 1.0, s1: 1.12, x0: 0, x1: 0, y0: 0, y1: -40 } };
  };

  KINDS.nightcity = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    stars(c, c.layer(0.04), 110, 900);
    const moon = E("circle", { cx: 800, cy: 360, r: 34, fill: "#eef0ff" }, c.layer(0.05));
    E("circle", { cx: 800, cy: 360, r: 140, fill: c.radial("moon", [[0, "#9aa8ff", 0.35], [1, "#9aa8ff", 0]]) }, c.layer(0.05));
    mountain(c, c.layer(0.12), { base: 1000, amp: 520, color: pal.far, snowline: 0.3, haze: 0.15 });
    tvTower(c, c.layer(0.3), 230, 1060, 560, true);
    const g = c.layer(0.55);
    cityRows(c, g, { y0: 1050, y1: 2020, rows: 10, minW: 6, maxW: 100, minH: 6, maxH: 300, lit: 0.85 });
    const tr = c.layer(0.6);
    for (let k = 0; k < 6; k++) {
      const y = 1180 + k * 130;
      for (const [col, dir] of [["#fff2d6", 1], ["#ff5a3a", -1]]) {
        const p = E("path", { d: `M-400,${y + (dir > 0 ? 0 : 10)} C200,${y - 30} 800,${y + 40} 1500,${y}`, fill: "none", stroke: col, "stroke-width": 2 + k * 0.9, "stroke-dasharray": `${40 + k * 10} ${50 + k * 12}`, opacity: 0.85 }, tr);
        c.move(p, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": dir * (90 + k * 22) * 5 } });
      }
    }
    E("rect", { x: -400, y: 980, width: W + 800, height: 300, fill: c.grad("glow", [[0, "#ff9a4a", 0], [0.6, "#ff9a4a", 0.18], [1, "#ff9a4a", 0]]) }, c.layer(0.2));
    return { cam: { s0: 1.0, s1: 1.1, x0: -50, x1: 50, y0: 0, y1: -40 } };
  };

  KINDS.cathedral = (c) => {
    const { pal } = c;
    sky(c, c.layer(0.02));
    sun(c, c.layer(0.05), 860, 380, 54, 3);
    clouds(c, c.layer(0.1), 4, 200, 800, 1.2, 0.8, 1);
    const g = c.layer(0.4);
    const wall = "#f1d38c", trim = "#ffffff", roof = "#4d8a6a", dome = "#d9a441";
    E("rect", { x: 180, y: 1080, width: 720, height: 520, fill: wall }, g);
    E("rect", { x: 180, y: 1080, width: 720, height: 18, fill: trim }, g);
    E("path", { d: "M160,1080 L540,930 L920,1080Z", fill: roof }, g);
    for (let k = 0; k < 6; k++) {
      const x = 220 + k * 115;
      E("path", { d: `M${x},1500 v-200 a35,35 0 0 1 70,0 v200Z`, fill: "#6a90b8" }, g);
      E("path", { d: `M${x - 8},1300 a43,43 0 0 1 86,0`, fill: "none", stroke: trim, "stroke-width": 8 }, g);
    }
    E("rect", { x: 440, y: 1380, width: 200, height: 220, fill: "#8a5a3a" }, g);
    E("path", { d: "M430,1380 a110,110 0 0 1 220,0Z", fill: trim }, g);
    const tower = (x, base, w, h, domeR) => {
      E("rect", { x: x - w / 2, y: base - h, width: w, height: h, fill: wall }, g);
      E("rect", { x: x - w / 2, y: base - h, width: w, height: 12, fill: trim }, g);
      E("path", { d: `M${x - w * 0.3},${base - h * 0.35} v-${h * 0.3} a${w * 0.3},${w * 0.3} 0 0 1 ${w * 0.6},0 v${h * 0.3}Z`, fill: "#6a90b8" }, g);
      E("rect", { x: x - w * 0.4, y: base - h - domeR * 0.6, width: w * 0.8, height: domeR * 0.6, fill: wall }, g);
      E("path", { d: `M${x - domeR},${base - h - domeR * 0.6} C${x - domeR},${base - h - domeR * 2} ${x},${base - h - domeR * 2.1} ${x},${base - h - domeR * 2.6} C${x},${base - h - domeR * 2.1} ${x + domeR},${base - h - domeR * 2} ${x + domeR},${base - h - domeR * 0.6}Z`, fill: dome }, g);
      const top = base - h - domeR * 2.6;
      E("path", { d: `M${x},${top} v-60 M${x - 18},${top - 42} h36 M${x - 12},${top - 22} h24`, stroke: "#e8b84a", "stroke-width": 6 }, g);
    };
    tower(540, 1080, 230, 420, 92);
    tower(250, 1080, 120, 120, 54);
    tower(830, 1080, 120, 120, 54);
    E("rect", { x: -400, y: 1600, width: W + 800, height: 900, fill: c.grad("plaza", [[0, "#cfc2ae"], [1, "#9a8b76"]]) }, g);
    const tg = c.layer(0.7);
    for (const [x, y, r0] of [[-80, 1300, 300], [1140, 1260, 320], [80, 1560, 180], [1000, 1580, 170]]) {
      E("rect", { x: x - 18, y, width: 36, height: 500, fill: "#3a2a20" }, tg);
      E("path", { d: decid(c, x, y - 40, r0), fill: mix(pal.tree, "#000000", 0.15) }, tg);
    }
    people(c, c.layer(0.8), 10, { x0: 0, x1: 1080, y: 1800, dy: 160, h: 240, speed: 40, colors: ["#2a2430", "#5a2e3a", "#2e3e5a", "#4a4a3a"] });
    const pig = c.layer(0.5);
    birds(c, pig, 6, 820, "#3a3a44");
    return { cam: { s0: 1.0, s1: 1.1, x0: 0, x1: 0, y0: 120, y1: -60 } };
  };

  function build(svg, spec, tl, t0, D) {
    const c = makeCtx(svg, spec, tl, t0, D);
    const kind = KINDS[spec.kind] || KINDS.aerial;
    const out = kind(c) || {};
    const cam = out.cam || { s0: 1, s1: 1.08, x0: 0, x1: 0, y0: 0, y1: 0 };
    const origin = cam.origin || "540 960";
    for (const { g, depth } of c.layers) {
      const d = Math.min(depth, 1.6);
      tl.fromTo(g,
        { x: cam.x0 * d, y: cam.y0 * d, scale: 1 + (cam.s0 - 1) * (0.4 + 0.6 * d), rotation: (cam.rot0 || 0) * d, svgOrigin: origin },
        { x: cam.x1 * d, y: cam.y1 * d, scale: 1 + (cam.s1 - 1) * (0.4 + 0.6 * d), rotation: (cam.rot1 || 0) * d, svgOrigin: origin, duration: D, ease: "sine.inOut" },
        t0);
    }
  }

  window.Illus = { build };
})();
