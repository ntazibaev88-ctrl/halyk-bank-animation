/* Core helpers shared by every scene: time math, keyframes, seeded noise,
   hand-drawn "boiling" outlines, camera with parallax, text and glow helpers.
   Everything is a pure function of time t, so any frame renders identically. */
(function () {
  const TAU = Math.PI * 2;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inv = (a, b, x) => clamp((x - a) / (b - a));

  const E = {
    lin: (t) => t,
    in: (t) => t * t,
    out: (t) => 1 - (1 - t) * (1 - t),
    io: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    in3: (t) => t * t * t,
    out3: (t) => 1 - Math.pow(1 - t, 3),
    io3: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out5: (t) => 1 - Math.pow(1 - t, 5),
    expo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    back: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    back2: (t) => { const c1 = 2.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    elastic: (t) => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (TAU / 3)) + 1),
    hold: (t) => (t < 1 ? 0 : 1),
  };
  // exact 0 and 1 at the ends (overshoot curves otherwise leave 1e-16 at t = 0)
  Object.keys(E).forEach((k) => { const f = E[k]; E[k] = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : f(t)); });

  /* Keyframes: K(t, [[t0, v0], [t1, v1, "ease"], ...]); the ease belongs to the
     segment that arrives at that key. Values may be numbers or arrays. */
  function K(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t < keys[i][0]) {
        const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i];
        const u = (E[e || "io"])((t - t0) / (t1 - t0));
        if (Array.isArray(v0)) return v0.map((v, j) => lerp(v, v1[j], u));
        return lerp(v0, v1, u);
      }
    }
    return keys[keys.length - 1][1];
  }
  /* Discrete states (mouth shapes, eye modes): last key at or before t. */
  function S(t, keys) { let v = keys[0][1]; for (const k of keys) if (t >= k[0]) v = k[1]; return v; }
  /* 0→1 pop with overshoot that starts at t0 and lasts d. */
  const pop = (t, t0, d = 0.35, e = "back") => (t < t0 ? 0 : t >= t0 + d ? 1 : E[e]((t - t0) / d));
  /* window: fades in over fi at a, out over fo at b. */
  const win = (t, a, b, fi = 0.2, fo = 0.2) => Math.min(inv(a, a + fi, t), 1 - inv(b - fo, b, t));

  /* Seeded randomness (no Math.random anywhere). */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(i) { i = (i << 13) ^ i; return 1 - ((i * (i * i * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824; }
  function noise(x, seed = 0) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return lerp(hash(i + seed * 1013), hash(i + 1 + seed * 1013), u);
  }

  /* Colour helpers */
  function hex(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mix(a, b, t) { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))).toString(16).padStart(2, "0")).join(""); }
  function rgba(h, a) { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; }

  const PAL = {
    ink: "#0D0B26", navy0: "#070A1F", navy: "#0E1338", navy2: "#18205A", indigo: "#2A2475",
    purple: "#4E2A8E", violet: "#7B45D6", lav: "#B996FF", lilac: "#E3D3FF",
    yellow: "#FFC93C", gold: "#FFB01F", amber: "#F08A1C", cream: "#FFF4D6", white: "#FFFDF6",
    pink: "#FF8FBF", rose: "#E2588F", teal: "#58E1D2", skin: "#F4C29C", skinS: "#DE9C78",
  };

  /* Hand-drawn line boil: outlines are redrawn 12x per second with a seeded wobble. */
  let BOIL_T = 0;
  const setBoil = (t) => { BOIL_T = Math.floor(t * 12); };
  function boil(pts, amp = 1.6, seed = 1) {
    if (!amp) return pts;
    return pts.map((p, k) => [p[0] + hash(BOIL_T * 131 + k * 17 + seed * 7919) * amp, p[1] + hash(BOIL_T * 197 + k * 29 + seed * 104729) * amp]);
  }
  /* Smooth closed/open Catmull-Rom path through points. */
  function smooth(ctx, pts, closed = true, tension = 1) {
    const n = pts.length; if (n < 2) return;
    const P = (i) => (closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
    ctx.moveTo(pts[0][0], pts[0][1]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const k = tension / 6;
      ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k, p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k, p2[0], p2[1]);
    }
    if (closed) ctx.closePath();
  }
  function ellipsePts(cx, cy, rx, ry, n = 20, f) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU; const k = f ? f(a) : 1;
      out.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return out;
  }
  /* Filled shape with ink outline, optional cel shadow and rim light. */
  function shape(ctx, pts, o) {
    const lw = o.lw ?? 7;
    const P = boil(pts, o.boil ?? 1.5, o.seed ?? 1);
    ctx.beginPath(); smooth(ctx, P, o.closed !== false, o.tension ?? 1);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.shade) {
      ctx.save(); ctx.clip();
      ctx.beginPath(); smooth(ctx, P.map((p) => [p[0] + o.shade[1], p[1] + o.shade[2]]), true, o.tension ?? 1);
      ctx.rect(-5000, -5000, 10000, 10000);
      ctx.fillStyle = o.shade[0]; ctx.fill("evenodd");
      ctx.restore();
    }
    if (o.rim) {
      ctx.save(); ctx.beginPath(); smooth(ctx, P, true, o.tension ?? 1); ctx.clip();
      ctx.beginPath(); smooth(ctx, P.map((p) => [p[0] - o.rim[1], p[1] - o.rim[2]]), true, o.tension ?? 1);
      ctx.rect(-5000, -5000, 10000, 10000);
      ctx.fillStyle = o.rim[0]; ctx.fill("evenodd"); ctx.restore();
    }
    if (lw > 0) {
      ctx.beginPath(); smooth(ctx, P, o.closed !== false, o.tension ?? 1);
      ctx.lineWidth = lw; ctx.strokeStyle = o.stroke || PAL.ink; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
    }
  }
  function line(ctx, pts, lw, color, o = {}) {
    const P = boil(pts, o.boil ?? 1.2, o.seed ?? 3);
    ctx.beginPath(); smooth(ctx, P, false, o.tension ?? 1);
    ctx.lineWidth = lw; ctx.strokeStyle = color; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
  }
  function circle(ctx, x, y, r, fill, lw = 0, stroke = PAL.ink) {
    ctx.beginPath(); ctx.arc(x, y, Math.max(0.01, r), 0, TAU);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  function rrect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2); ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function glow(ctx, x, y, r, color, a = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, a)); g.addColorStop(0.45, rgba(color, a * 0.35)); g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  /* Text with heavy outline. o: size, weight, family, color, stroke, sw, align, track, alpha */
  function text(ctx, str, x, y, o = {}) {
    const size = o.size || 80;
    ctx.save();
    ctx.font = `${o.weight || 900} ${size}px ${o.family || "BrainDisplay"}`;
    ctx.textAlign = o.align || "center"; ctx.textBaseline = "middle";
    if (o.track) ctx.letterSpacing = `${o.track}px`;
    ctx.globalAlpha *= o.alpha ?? 1;
    if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = o.blur ?? 30; }
    if (o.stroke) { ctx.lineWidth = o.sw || size * 0.16; ctx.strokeStyle = o.stroke; ctx.lineJoin = "round"; ctx.strokeText(str, x, y); ctx.shadowBlur = 0; }
    ctx.fillStyle = o.color || PAL.white; ctx.fillText(str, x, y);
    ctx.restore();
  }

  /* Camera: scene units are the 1080x1920 frame; depth < 1 moves less (parallax). */
  function cam(ctx, c, depth = 1) {
    const z = 1 + (c.z - 1) * depth;
    ctx.translate(540 + (c.sx || 0), 960 + (c.sy || 0));
    ctx.rotate((c.r || 0) * depth);
    ctx.scale(z, z);
    ctx.translate(-540 - c.x * depth, -960 - c.y * depth);
  }
  function withCam(ctx, c, depth, fn) { ctx.save(); cam(ctx, c, depth); fn(); ctx.restore(); }
  function shake(t, amp, freq = 18, seed = 5) { return [noise(t * freq, seed) * amp, noise(t * freq, seed + 9) * amp]; }

  /* Backgrounds */
  function vgrad(ctx, stops, x = 0, y = 0, w = 1080, h = 1920) {
    const g = ctx.createLinearGradient(x, y, x, y + h);
    stops.forEach(([o, c]) => g.addColorStop(o, c)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }
  function stars(ctx, t, seed, n, area, o = {}) {
    const R = rng(seed);
    for (let i = 0; i < n; i++) {
      const x = area[0] + R() * area[2], y = area[1] + R() * area[3], r = (o.r || 2.4) * (0.4 + R()), ph = R() * TAU;
      const a = (o.a || 0.8) * (0.5 + 0.5 * Math.sin(t * (1.5 + R() * 2) + ph));
      circle(ctx, x, y, r, rgba(o.color || PAL.lilac, a));
    }
  }
  function bokeh(ctx, t, seed, n, o = {}) {
    const R = rng(seed);
    for (let i = 0; i < n; i++) {
      const x = R() * 1300 - 110 + Math.sin(t * 0.3 + i) * 30, y = R() * 2100 - 90 - t * (o.rise || 12) * (0.5 + R());
      const yy = ((y % 2100) + 2100) % 2100 - 90;
      const r = (o.r || 40) * (0.5 + R());
      glow(ctx, x, yy, r, R() > 0.6 ? (o.c2 || PAL.yellow) : (o.c1 || PAL.violet), (o.a || 0.18) * (0.5 + R()));
    }
  }
  /* Dust motes that drift in light. */
  function motes(ctx, t, seed, n, area, color = PAL.cream, a = 0.5) {
    const R = rng(seed);
    for (let i = 0; i < n; i++) {
      const bx = R() * area[2], by = R() * area[3], sp = 10 + R() * 25, ph = R() * 100;
      const x = area[0] + ((bx + noise(t * 0.4 + ph, i) * 60) % area[2]);
      const y = area[1] + (((by - t * sp) % area[3]) + area[3]) % area[3];
      circle(ctx, x, y, 1.5 + R() * 3, rgba(color, a * (0.4 + 0.6 * Math.abs(Math.sin(t + ph)))));
    }
  }
  function vignette(ctx, a = 0.55, color = "#03040F") {
    const g = ctx.createRadialGradient(540, 900, 380, 540, 960, 1250);
    g.addColorStop(0, rgba(color, 0)); g.addColorStop(1, rgba(color, a));
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  }
  /* Speed lines radiating from a point (impact / realisation beats). */
  function speedLines(ctx, t, cx, cy, a, seed = 3, color = PAL.white) {
    if (a <= 0) return;
    const R = rng(seed + Math.floor(t * 15));
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < 46; i++) {
      const ang = R() * TAU, r0 = 420 + R() * 260, r1 = r0 + 300 + R() * 900, w = 2 + R() * 7;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang - 0.006 * w) * r0, cy + Math.sin(ang - 0.006 * w) * r0);
      ctx.lineTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
      ctx.lineTo(cx + Math.cos(ang + 0.006 * w) * r0, cy + Math.sin(ang + 0.006 * w) * r0);
      ctx.fillStyle = color; ctx.fill();
    }
    ctx.restore();
  }
  /* Neuron network texture: nodes, links and pulses travelling along them. */
  function neurons(ctx, t, seed, area, a = 0.5, color = "#9B7BFF") {
    const R = rng(seed), n = 26, pts = [];
    for (let i = 0; i < n; i++) pts.push([area[0] + R() * area[2], area[1] + R() * area[3], R()]);
    ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = 2.5;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (d > 230) continue;
      ctx.strokeStyle = rgba(color, 0.35 * (1 - d / 230)); ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke();
      const k = (t * (0.4 + pts[i][2] * 0.6) + pts[j][2]) % 1;
      if ((i + j) % 3 === 0) glow(ctx, lerp(pts[i][0], pts[j][0], k), lerp(pts[i][1], pts[j][1], k), 18, "#FFD86B", 0.9);
    }
    pts.forEach(([x, y, r]) => { glow(ctx, x, y, 26, color, 0.6); circle(ctx, x, y, 4 + r * 4, rgba("#E3D3FF", 0.9)); });
    ctx.restore();
  }

  /* Transitions drawn by each scene at its edges. */
  function irisIn(ctx, t, t0, d, cx = 540, cy = 960, color = PAL.navy0) {
    const u = inv(t0, t0 + d, t); if (u >= 1) return;
    const r = E.out3(u) * 1400;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, 1920); ctx.arc(cx, cy, Math.max(0.1, r), 0, TAU, true);
    ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }
  function flash(ctx, t, t0, d = 0.25, color = PAL.cream, a = 0.85) {
    const u = inv(t0, t0 + d, t); if (u <= 0 || u >= 1) return;
    ctx.save(); ctx.globalAlpha = a * (1 - u) * (1 - u); ctx.fillStyle = color; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
  }
  function wipe(ctx, t, t0, d, color = PAL.yellow, dir = 1) {
    /* diagonal band crossing the frame; covers frame at the midpoint */
    const u = inv(t0, t0 + d, t); if (u <= 0 || u >= 1) return;
    const e = E.io3(u);
    ctx.save(); ctx.translate(540, 960); ctx.rotate(-0.35 * dir);
    const h = 2600, x = lerp(-2100, 2100, e) * dir;
    ctx.fillStyle = color; ctx.fillRect(x - 1050, -h / 2, 2100, h);
    ctx.fillStyle = PAL.navy0; ctx.fillRect(x - 1050 + 120 * dir, -h / 2, 1860, h);
    ctx.restore();
  }

  /* Chapter tag: small numbered label in the safe band under the platform UI. */
  function chapter(ctx, t, num, title, t0 = 0.15, t1 = 2.6) {
    const a = win(t, t0, t1, 0.25, 0.35); if (a <= 0) return;
    const sl = E.out3(inv(t0, t0 + 0.45, t));
    ctx.save(); ctx.globalAlpha = a;
    ctx.translate(lerp(-60, 0, sl), 0);
    ctx.font = "900 30px BrainDisplay"; const w = ctx.measureText(title).width;
    rrect(ctx, 70, 196, 96 + w + 40, 64, 32); ctx.fillStyle = rgba(PAL.navy0, 0.72); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = rgba(PAL.yellow, 0.9); ctx.stroke();
    text(ctx, num, 118, 229, { size: 30, color: PAL.yellow });
    text(ctx, title, 166, 229, { size: 30, align: "left", color: PAL.cream, track: 2 });
    ctx.restore();
  }

  window.HF = { TAU, clamp, lerp, inv, E, K, S, pop, win, rng, hash, noise, hex, mix, rgba, PAL, setBoil, boil, smooth, ellipsePts, shape, line, circle, rrect, glow, text, cam, withCam, shake, vgrad, stars, bokeh, motes, vignette, speedLines, neurons, irisIn, flash, wipe, chapter };
})();
