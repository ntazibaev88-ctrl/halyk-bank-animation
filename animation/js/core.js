// Shared math, colour and drawing primitives. Everything is deterministic in t.
const W = 1920, H = 1080, TAU = Math.PI * 2;

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const smooth = (a, b, x) => { const t = inv(a, b, x); return t * t * (3 - 2 * t); };
const fadeWin = (t, a, b, f = 0.5) => Math.min(smooth(a, a + f, t), 1 - smooth(b - f, b, t));

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function vnoise(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 101.3), hash(i + 1 + seed * 101.3), u);
}
function fbm(x, seed = 0, oct = 5) {
  let s = 0, a = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, seed + i * 7); norm += a; a *= 0.5; f *= 2.03; }
  return s / norm;
}
function ridged(x, seed = 0, oct = 4) {
  let s = 0, a = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { const v = 1 - Math.abs(2 * vnoise(x * f, seed + i * 13) - 1); s += a * v * v; norm += a; a *= 0.5; f *= 2.1; }
  return s / norm;
}

// ---------------------------------------------------------------- colour
const _hexCache = {};
function hex(c) {
  if (Array.isArray(c)) return c;
  if (_hexCache[c]) return _hexCache[c];
  const v = parseInt(c.slice(1), 16);
  return (_hexCache[c] = [(v >> 16) & 255, (v >> 8) & 255, v & 255]);
}
function mix(a, b, t) { a = hex(a); b = hex(b); return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function rgba(c, a = 1) { c = hex(c); return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`; }

// Palette shared by every chapter so the film reads as one piece.
const P = {
  night: '#0a1630', navy: '#10284a', deep: '#163a63', blue: '#00afca', teal: '#6fd0dc',
  gold: '#f4c247', goldL: '#ffe39a', amber: '#f0a04b', sun: '#fff1c4', rose: '#e38b6f',
  cream: '#f6eedb', sand: '#d8b673', ochre: '#b98a45', earth: '#6e5233', ink: '#141a26', snow: '#eef3f8',
};

// ---------------------------------------------------------------- primitives
// Soft atmospheric haze: transparent at y0, colour c at alpha a by y1.
function haze(ctx, y0, y1, c, a) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, rgba(c, 0)); g.addColorStop(1, rgba(c, a));
  ctx.fillStyle = g; ctx.fillRect(-W, y0, 3 * W, y1 - y0 + 400);
}
function sky(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  for (const [o, c] of stops) g.addColorStop(o, rgba(c));
  ctx.fillStyle = g;
  ctx.fillRect(-W, -H, 3 * W, 3 * H);
}

function glow(ctx, x, y, r, c, a, mode = 'lighter') {
  if (a <= 0 || r <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = mode;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(c, a));
  g.addColorStop(0.35, rgba(c, a * 0.35));
  g.addColorStop(1, rgba(c, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  ctx.restore();
}

function godRays(ctx, x, y, n, len, spread, c, a, rot = 0) {
  if (a <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, len);
  g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const ang = rot + (i / n) * TAU + Math.sin(i * 7.3) * 0.08;
    const w = spread * (0.6 + 0.4 * hash(i * 3.1));
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang - w) * len, y + Math.sin(ang - w) * len);
    ctx.lineTo(x + Math.cos(ang + w) * len, y + Math.sin(ang + w) * len);
    ctx.closePath();
  }
  ctx.fill();
  ctx.restore();
}

// Stylised sun of the national flag: disc with 32 rays.
function flagSun(ctx, x, y, r, c, a = 1, rot = 0) {
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = rgba(c);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < 32; i++) {
    const ang = (i / 32) * TAU;
    const r0 = r * 1.13, r1 = r * 1.62, w = TAU / 32 * 0.32;
    ctx.moveTo(Math.cos(ang - w) * r0, Math.sin(ang - w) * r0);
    ctx.lineTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
    ctx.lineTo(Math.cos(ang + w) * r0, Math.sin(ang + w) * r0);
  }
  ctx.fill();
  ctx.restore();
}

class Ridge {
  constructor({ seed = 1, base = 700, amp = 200, scale = 300, step = 8, width = W + 600, x0 = -300, kind = 'fbm', pow = 1 }) {
    this.pts = [];
    for (let x = x0; x <= x0 + width; x += step) {
      let h = kind === 'ridged' ? ridged(x / scale, seed) : fbm(x / scale, seed);
      h = Math.pow(h, pow);
      this.pts.push([x, base - h * amp]);
    }
    this.base = base; this.amp = amp;
    this.top = Math.min(...this.pts.map(p => p[1]));
  }
  path(ctx, offX = 0, offY = 0, bottom = H * 2) {
    const p = this.pts;
    ctx.beginPath();
    ctx.moveTo(p[0][0] + offX, bottom);
    for (let i = 0; i < p.length; i++) ctx.lineTo(p[i][0] + offX, p[i][1] + offY);
    ctx.lineTo(p[p.length - 1][0] + offX, bottom);
    ctx.closePath();
  }
  fill(ctx, color, offX = 0, offY = 0) { this.path(ctx, offX, offY); ctx.fillStyle = color; ctx.fill(); }
  // Fill with a vertical gradient so the highest peaks catch snow / light.
  fillGrad(ctx, topC, botC, snowLine = 0.35, offX = 0, offY = 0, a = 1) {
    const g = ctx.createLinearGradient(0, this.top + offY, 0, this.base + offY);
    g.addColorStop(0, rgba(topC, a)); g.addColorStop(snowLine, rgba(topC, a));
    g.addColorStop(Math.min(1, snowLine + 0.18), rgba(botC, a)); g.addColorStop(1, rgba(botC, a));
    this.fill(ctx, g, offX, offY);
  }
  yAt(x) {
    const p = this.pts, i = clamp(Math.floor((x - p[0][0]) / (p[1][0] - p[0][0])), 0, p.length - 2);
    const f = clamp((x - p[i][0]) / (p[i + 1][0] - p[i][0]));
    return lerp(p[i][1], p[i + 1][1], f);
  }
}

function makeGrass(seed, n, x0, x1, y0, y1, h0, h1) {
  const r = mulberry32(seed), out = [];
  for (let i = 0; i < n; i++) {
    const y = lerp(y0, y1, Math.pow(r(), 0.8));
    const depth = inv(y0, y1, y);
    out.push({ x: lerp(x0, x1, r()), y, h: lerp(h0, h1, depth) * (0.6 + 0.6 * r()), lean: (r() - 0.5) * 0.5,
      ph: r() * TAU, w: lerp(1, 3.2, depth) * (0.7 + 0.5 * r()), d: depth, c: r() });
  }
  return out.sort((a, b) => a.y - b.y);
}

function drawGrass(ctx, blades, t, cDark, cLight, wind = 1, offX = 0, tipA = 0.8) {
  ctx.lineCap = 'round';
  for (const b of blades) {
    const sway = (Math.sin(t * 1.6 + b.ph + b.x * 0.004) * 0.35 + Math.sin(t * 0.7 + b.x * 0.002) * 0.4 + 0.35) * wind;
    const x = b.x + offX, tx = x + (b.lean + sway) * b.h * 0.6, ty = b.y - b.h * (1 - 0.15 * Math.abs(sway));
    ctx.strokeStyle = rgba(mix(cDark, cLight, b.c * 0.5 + b.d * 0.2));
    ctx.lineWidth = b.w;
    ctx.beginPath(); ctx.moveTo(x, b.y);
    ctx.quadraticCurveTo(x + b.lean * b.h * 0.2, b.y - b.h * 0.6, tx, ty); ctx.stroke();
    if (b.c > 0.55) {          // silvery feather-grass plume catching light
      ctx.strokeStyle = rgba(cLight, tipA * b.c);
      ctx.lineWidth = b.w * 1.6;
      ctx.beginPath(); ctx.moveTo(tx, ty);
      ctx.lineTo(tx + (sway + 0.4) * b.h * 0.22, ty + b.h * 0.12); ctx.stroke();
    }
  }
}

function makeStars(seed, n, yMax = H * 0.7) {
  const r = mulberry32(seed), s = [];
  for (let i = 0; i < n; i++) s.push({ x: r() * W * 1.2 - W * 0.1, y: r() * yMax, s: Math.pow(r(), 3) * 2.2 + 0.4, ph: r() * TAU });
  return s;
}
function drawStars(ctx, stars, t, a) {
  if (a <= 0) return;
  for (const s of stars) {
    const tw = 0.65 + 0.35 * Math.sin(t * 2.3 + s.ph);
    ctx.fillStyle = `rgba(255,248,230,${a * tw})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, TAU); ctx.fill();
  }
}

function cloud(ctx, x, y, w, h, c, a) {
  ctx.save();
  ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(x, y, 0, x, y, w);
  g.addColorStop(0, rgba(c, 0.85)); g.addColorStop(0.5, rgba(c, 0.35)); g.addColorStop(1, rgba(c, 0));
  ctx.fillStyle = g;
  ctx.translate(x, y); ctx.scale(1, h / w); ctx.translate(-x, -y);
  ctx.beginPath(); ctx.arc(x, y, w, 0, TAU); ctx.fill();
  ctx.restore();
}

// Particles drifting through light; deterministic per index.
function motes(ctx, seed, n, t, c, a, area = [0, 0, W, H], speed = 12, size = 2.5) {
  const [x0, y0, x1, y1] = area;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const r1 = hash(seed + i * 1.7), r2 = hash(seed + i * 2.9), r3 = hash(seed + i * 4.3);
    const x = x0 + ((r1 * (x1 - x0) + t * speed * (0.5 + r3) + Math.sin(t * 0.6 + i) * 20) % (x1 - x0) + (x1 - x0)) % (x1 - x0);
    const y = y0 + ((r2 * (y1 - y0) - t * speed * 0.6 * r3) % (y1 - y0) + (y1 - y0)) % (y1 - y0);
    const tw = 0.5 + 0.5 * Math.sin(t * 2 + i * 3.1);
    ctx.fillStyle = rgba(c, a * tw);
    ctx.beginPath(); ctx.arc(x, y, size * (0.4 + r3), 0, TAU); ctx.fill();
  }
  ctx.restore();
}

function snowfall(ctx, seed, n, t, a, wind = 30) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const r1 = hash(seed + i * 1.3), r2 = hash(seed + i * 2.1), r3 = hash(seed + i * 5.7);
    const depth = 0.3 + r3 * 0.7, sp = 40 + 90 * depth;
    const y = ((r2 * (H + 40) + t * sp) % (H + 40)) - 20;
    const x = ((r1 * (W + 200) + t * wind * depth + Math.sin(t * (0.8 + r3) + i) * 18) % (W + 200)) - 100;
    ctx.fillStyle = `rgba(245,250,255,${a * (0.35 + 0.6 * depth)})`;
    ctx.beginPath(); ctx.arc(x, y, 1 + depth * 2.6, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- figures
// Eagle seen from below: head points along +x before rotation.
function eagle(ctx, x, y, s, t, c = P.ink, rot = 0, flapAmt = 1) {
  const flap = Math.sin(t * 5.5) * 0.18 * flapAmt;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = rgba(c);
  for (const side of [-1, 1]) {
    const span = 1 - Math.abs(flap) * 0.4, dip = flap * 40;
    ctx.beginPath();
    ctx.moveTo(14, side * 8);
    ctx.bezierCurveTo(30, side * 60, 16, side * 120 * span, 6 + dip * 0.3, side * 170 * span);
    // primary feather "fingers"
    for (let k = 0; k < 5; k++) {
      const yy = side * (170 - k * 9) * span, xx = 6 + dip * 0.3 - k * 9;
      ctx.lineTo(xx - 16, yy + side * 6);
      ctx.lineTo(xx - 10, yy - side * 4);
    }
    ctx.bezierCurveTo(-46, side * 110 * span, -34, side * 50, -22, side * 10);
    ctx.closePath(); ctx.fill();
  }
  // body, head, tail
  ctx.beginPath(); ctx.ellipse(0, 0, 40, 13, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(42, 0, 12, 9, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(52, -4); ctx.lineTo(62, 2); ctx.lineTo(50, 5); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-34, -9); ctx.lineTo(-74, -22); ctx.quadraticCurveTo(-80, 0, -74, 22); ctx.lineTo(-34, 9); ctx.fill();
  ctx.restore();
}

// Galloping horse in profile facing -x (running left). p = gait phase.
function horse(ctx, x, y, s, p, c = P.ink, maneC = null) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(-s, s);         // drawn facing +x, flipped to run left
  const bob = Math.sin(p * TAU * 2) * 3;
  ctx.translate(0, bob);
  ctx.fillStyle = rgba(c); ctx.strokeStyle = rgba(c); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const legs = [[-40, 0.0], [-34, 0.1], [36, 0.5], [42, 0.62]];
  for (const [lx, off] of legs) {
    const ph = (p + off) * TAU, front = lx > 0;
    const a1 = Math.sin(ph) * (front ? 0.75 : 0.65) + (front ? 0.1 : -0.1);
    const bend = Math.max(0, Math.sin(ph + (front ? 1.2 : -0.9))) * (front ? -1.4 : 1.2);
    const kx = lx + Math.sin(a1) * 32, ky = 18 + Math.cos(a1) * 32;
    const a2 = a1 + bend;
    const hx = kx + Math.sin(a2) * 34, hy = ky + Math.cos(a2) * 34;
    ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(lx, 10); ctx.lineTo(kx, ky); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(hx, hy); ctx.stroke();
  }
  // torso
  ctx.beginPath();
  ctx.moveTo(-56, -6); ctx.bezierCurveTo(-50, -30, 30, -34, 50, -22);
  ctx.bezierCurveTo(62, -8, 58, 22, 40, 24); ctx.bezierCurveTo(10, 30, -30, 30, -50, 20);
  ctx.bezierCurveTo(-64, 12, -62, 0, -56, -6); ctx.fill();
  // neck & head (stretched forward at gallop)
  const nod = Math.sin(p * TAU) * 0.08;
  ctx.save(); ctx.translate(46, -18); ctx.rotate(-0.55 + nod);
  ctx.beginPath(); ctx.moveTo(-10, 12); ctx.lineTo(-6, -14); ctx.bezierCurveTo(10, -26, 34, -30, 44, -28);
  ctx.lineTo(70, -18); ctx.quadraticCurveTo(76, -10, 66, -6); ctx.lineTo(38, -4); ctx.bezierCurveTo(26, 4, 14, 14, 6, 22); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, -27); ctx.lineTo(36, -40); ctx.lineTo(46, -29); ctx.fill();   // ear
  if (maneC) { ctx.strokeStyle = rgba(maneC, 0.5); ctx.lineWidth = 3; }
  for (let k = 0; k < 6; k++) {                 // flowing mane
    ctx.beginPath(); ctx.moveTo(-4 + k * 7, -16 - k * 2);
    ctx.quadraticCurveTo(-14 + k * 6, -26 - k * 2 + Math.sin(p * TAU * 2 + k) * 4, -26 + k * 5, -18 - k);
    ctx.lineWidth = 4; ctx.stroke();
  }
  ctx.restore();
  // tail
  ctx.lineWidth = 7; ctx.strokeStyle = rgba(c);
  ctx.beginPath(); ctx.moveTo(-56, -6);
  ctx.bezierCurveTo(-80, -12 + Math.sin(p * TAU * 2) * 6, -96, 4, -110, -2 + Math.sin(p * TAU * 2 + 1) * 10); ctx.stroke();
  ctx.restore();
}

// Human silhouette. pose: {armL, armR (radians from down), legL, legR, lean, hat, child, kimeshek}
function person(ctx, x, y, h, pose = {}, c = P.ink) {
  const s = h / 170;
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(pose.lean || 0);
  ctx.fillStyle = rgba(c); ctx.strokeStyle = rgba(c); ctx.lineCap = 'round';
  const legL = pose.legL || 0.08, legR = pose.legR || -0.08;
  ctx.lineWidth = 15;
  for (const [a, k] of [[legL, pose.kneeL || 0], [legR, pose.kneeR || 0]]) {
    const kx = Math.sin(a) * 42, ky = -86 + Math.cos(a) * 42;
    ctx.beginPath(); ctx.moveTo(0, -86); ctx.lineTo(kx, ky);
    ctx.lineTo(kx + Math.sin(a - k) * 44, ky + Math.cos(a - k) * 44); ctx.stroke();
  }
  // torso (robe flares slightly)
  ctx.beginPath(); ctx.moveTo(-15, -140); ctx.lineTo(15, -140); ctx.lineTo(pose.robe ? 26 : 14, pose.robe ? -40 : -82);
  ctx.lineTo(pose.robe ? -26 : -14, pose.robe ? -40 : -82); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -138, 17, 8, 0, 0, TAU); ctx.fill();
  ctx.lineWidth = 11;
  for (const [a, sx, el] of [[pose.armL ?? 0.15, -14, pose.elbowL || 0], [pose.armR ?? -0.15, 14, pose.elbowR || 0]]) {
    const ax = sx - Math.sin(a) * 34, ay = -134 + Math.cos(a) * 34;
    ctx.beginPath(); ctx.moveTo(sx, -134); ctx.lineTo(ax, ay);
    ctx.lineTo(ax - Math.sin(a + el) * 32, ay + Math.cos(a + el) * 32); ctx.stroke();
  }
  // head
  ctx.beginPath(); ctx.arc(0, -160, 14, 0, TAU); ctx.fill();
  if (pose.hat === 'kalpak') {
    ctx.beginPath(); ctx.moveTo(-16, -166); ctx.lineTo(-5, -204); ctx.lineTo(7, -200); ctx.lineTo(17, -166); ctx.closePath(); ctx.fill();
    ctx.fillRect(-18, -170, 36, 6);
  } else if (pose.hat === 'kimeshek') {
    ctx.beginPath(); ctx.ellipse(0, -165, 19, 21, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-18, -160); ctx.lineTo(-22, -120); ctx.lineTo(22, -120); ctx.lineTo(18, -160); ctx.fill();
  } else if (pose.hat === 'cap') {      // graduation cap
    ctx.beginPath(); ctx.moveTo(-26, -176); ctx.lineTo(0, -186); ctx.lineTo(26, -176); ctx.lineTo(0, -168); ctx.closePath(); ctx.fill();
  } else if (pose.hair) {
    ctx.beginPath(); ctx.ellipse(-4, -156, 16, 22, 0.2, 0, TAU); ctx.fill();
  }
  if (pose.staff) { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-30, -150); ctx.stroke(); }
  ctx.restore();
}

// Kazakh "qoshqar müiz" (ram's horn) ornament unit, centred at origin, size ~1.
function ramHorn(ctx, s = 1) {
  ctx.save(); ctx.scale(s, s);
  ctx.beginPath();
  for (const side of [-1, 1]) {
    ctx.moveTo(0, 0.55);
    ctx.bezierCurveTo(0, 0.1, side * 0.05, -0.25, side * 0.35, -0.35);
    ctx.bezierCurveTo(side * 0.75, -0.45, side * 0.95, -0.05, side * 0.7, 0.12);
    ctx.bezierCurveTo(side * 0.5, 0.25, side * 0.35, 0.02, side * 0.48, -0.08);
  }
  ctx.stroke();
  ctx.restore();
}

// Horizontal ornament divider that "draws itself" with progress p.
function ornamentLine(ctx, cx, y, width, p, c = P.gold, a = 1) {
  if (p <= 0) return;
  ctx.save();
  ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 2; ctx.lineCap = 'round';
  const half = (width / 2) * easeOut(p);
  ctx.beginPath(); ctx.moveTo(cx - half, y); ctx.lineTo(cx - 34, y); ctx.moveTo(cx + 34, y); ctx.lineTo(cx + half, y); ctx.stroke();
  ctx.globalAlpha *= smooth(0.3, 1, p);
  ctx.lineWidth = 2.4 / 26;
  ctx.translate(cx, y); ramHorn(ctx, 26);
  ctx.restore();
}

// Decorative frame corners made of ram-horn curls.
function ornamentFrame(ctx, x, y, w, h, p, c = P.gold, a = 0.8) {
  if (p <= 0) return;
  ctx.save();
  ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 2;
  const L = Math.min(w, h) * 0.22 * easeOut(p);
  const corners = [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]];
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath(); ctx.moveTo(cx + sx * L, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * L); ctx.stroke();
    ctx.save(); ctx.translate(cx + sx * 26, cy + sy * 26); ctx.rotate(Math.atan2(sy, sx) + Math.PI / 4 + Math.PI / 2);
    ctx.globalAlpha *= smooth(0.4, 1, p); ctx.lineWidth = 2 / 22; ramHorn(ctx, 22); ctx.restore();
  }
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// Kazakhstan state flag drawn into an offscreen canvas (sky blue, sun, eagle, ornament).
function makeFlagCanvas(w = 1000, h = 500) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = '#00afca'; g.fillRect(0, 0, w, h);
  const gold = '#fec50c';
  flagSun(g, w * 0.5, h * 0.4, h * 0.145, gold);
  // steppe eagle beneath the sun, wings spread
  g.save(); g.translate(w * 0.5, h * 0.73); g.fillStyle = gold;
  for (const side of [-1, 1]) {
    g.beginPath(); g.moveTo(0, -6);
    g.bezierCurveTo(side * 60, -40, side * 140, -34, side * 200, -20);
    for (let k = 0; k < 6; k++) { g.lineTo(side * (200 - k * 22), -20 + 14 + k * 3); g.lineTo(side * (190 - k * 22), -14 + k * 3); }
    g.bezierCurveTo(side * 70, 0, side * 30, 20, 0, 24); g.fill();
  }
  g.beginPath(); g.ellipse(0, 6, 18, 26, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(-14, 26); g.lineTo(0, 54); g.lineTo(14, 26); g.fill();
  g.restore();
  // national ornament stripe at the hoist
  g.strokeStyle = gold; g.lineWidth = 4 / 34;
  for (let i = 0; i < 7; i++) {
    g.save(); g.translate(w * 0.065, h * (0.07 + i * 0.143)); g.rotate(i % 2 ? Math.PI : 0); g.lineWidth = 0.13; ramHorn(g, 34); g.restore();
  }
  g.fillStyle = gold; g.fillRect(w * 0.12, 0, 3, h);
  return c;
}

// Waving flag: slices of the flag canvas displaced by a travelling wave.
function wavingFlag(ctx, flag, x, y, w, h, t, amp = 1, reveal = 1) {
  const n = 90, sw = w / n;
  const vis = Math.max(1, Math.round(n * reveal));
  for (let i = 0; i < vis; i++) {
    const u = i / n;
    const ph = u * 7 - t * 4.2;
    const dy = Math.sin(ph) * 22 * amp * u + Math.sin(ph * 0.5 + 1) * 8 * amp * u;
    const shade = Math.cos(ph) * 0.18 * amp * Math.min(1, u * 4);
    const hy = h * (1 - 0.04 * Math.abs(Math.sin(ph)) * u);
    ctx.drawImage(flag, u * flag.width, 0, flag.width / n + 1, flag.height, x + i * sw, y + dy, sw + 1, hy);
    ctx.fillStyle = shade > 0 ? `rgba(255,255,255,${shade})` : `rgba(0,20,40,${-shade * 1.4})`;
    ctx.fillRect(x + i * sw, y + dy, sw + 1, hy);
  }
}

function grainPatterns(ctx) {
  const pats = [];
  for (let k = 0; k < 4; k++) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'), img = g.createImageData(256, 256), r = mulberry32(77 + k);
    for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
    pats.push(ctx.createPattern(c, 'repeat'));
  }
  return pats;
}

// Sequence of sub-shots inside one chapter, cross-dissolved at the joins.
// shots: [{s, e, fn(ctx, t, u)}], u = 0..1 progress through that shot.
function shots(ctx, t, list, buf, xf = 0.45) {
  let i = list.findIndex(s => t < s.e);
  if (i < 0) i = list.length - 1;
  const run = (c, k) => { const s = list[k]; c.save(); s.fn(c, t, inv(s.s - xf, s.e + xf, t)); c.restore(); };
  run(ctx, i);
  const n = list[i + 1];
  if (n && t > n.s - xf) {
    const b = buf.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); run(b, i + 1);
    ctx.save(); ctx.globalAlpha = smooth(n.s - xf, n.s + xf, t); ctx.drawImage(buf, 0, 0); ctx.restore();
  }
  const p = list[i - 1];
  if (p && t < list[i].s + xf) {
    const b = buf.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); run(b, i - 1);
    ctx.save(); ctx.globalAlpha = 1 - smooth(list[i].s - xf, list[i].s + xf, t); ctx.drawImage(buf, 0, 0); ctx.restore();
  }
}
function makeBuffer(w = W, h = H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
