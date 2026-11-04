/* Halyk Bank 60s — core drawing library (vector 2D, Canvas) */
const W = 1080, H = 1920, FPS = 30;
const PAL = {
  green: '#00A651', green2: '#12C06A', light: '#8CF0B5', mint: '#D9FBE8',
  dark: '#0A3B2A', darker: '#06241A', ink: '#0B1F18', white: '#FFFFFF',
  gold: '#FFC86B', sun: '#FFB347', sky: '#FF8A5B'
};
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  out5: t => 1 - Math.pow(1 - t, 5),
  in: t => t * t * t,
  io: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  elastic: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1
};
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const FONT = 'Inter, "Inter Display", "DejaVu Sans", sans-serif';

function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2); c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function lg(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function rg(c, x, y, r0, r1, stops) { const g = c.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function glow(c, x, y, r, col, a = 1) {
  c.save(); c.globalAlpha *= a; c.fillStyle = rg(c, x, y, 0, r, [[0, col], [1, 'rgba(0,0,0,0)']]);
  c.globalCompositeOperation = 'lighter'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore();
}

/* ---------- typography ---------- */
function fitFont(c, s, size, weight, maxW) {
  c.font = `${weight} ${size}px ${FONT}`;
  const w = c.measureText(s).width;
  return w > maxW ? size * maxW / w : size;
}
function txt(c, s, x, y, o = {}) {
  const { size = 64, weight = 800, color = '#fff', align = 'center', alpha = 1, maxW = 920, stroke = null, shadow = true, ls = 0 } = o;
  const sz = fitFont(c, s, size, weight, maxW);
  c.save(); c.globalAlpha *= alpha; c.font = `${weight} ${sz}px ${FONT}`; c.textAlign = align; c.textBaseline = 'middle';
  if (ls) c.letterSpacing = ls + 'px';
  if (shadow) { c.shadowColor = 'rgba(0,20,10,.55)'; c.shadowBlur = 24; c.shadowOffsetY = 6; }
  if (stroke) { c.lineWidth = stroke.w; c.strokeStyle = stroke.c; c.lineJoin = 'round'; c.strokeText(s, x, y); }
  c.fillStyle = color; c.fillText(s, x, y); c.restore();
  return sz;
}
/* animated caption: lines rise + fade in, with soft pill backing. t = local time since caption start */
function caption(c, lines, y, t, o = {}) {
  const { size = 66, gap = 0.28, lh = 1.22, out = null, pill = true, color = '#fff', maxW = 900 } = o;
  const n = lines.length; const total = size * lh * n;
  let aOut = 1; if (out !== null) aOut = 1 - E.io(prog(t, out, out + 0.5));
  if (aOut <= 0) return;
  c.save(); c.globalAlpha *= aOut;
  const a0 = E.out(prog(t, 0, 0.5));
  if (pill) {
    let mw = 0; c.font = `800 ${size}px ${FONT}`;
    lines.forEach(l => { mw = Math.max(mw, Math.min(maxW, c.measureText(l).width)); });
    const pw = mw + 90, ph = total + 56, py = y - ph / 2;
    c.globalAlpha *= a0 * 0.72; c.fillStyle = PAL.darker; rr(c, 540 - pw / 2, py, pw * a0 + .01, ph, 36); c.fill();
    c.globalAlpha = aOut * a0; c.fillStyle = PAL.green; rr(c, 540 - pw / 2, py + 22, 8, ph - 44, 4); c.fill();
  }
  lines.forEach((l, i) => {
    const p = E.out(prog(t, 0.12 + i * gap, 0.12 + i * gap + 0.6));
    txt(c, l, 540, y - total / 2 + size * lh * (i + .5) + (1 - p) * 34, { size, color, alpha: p, maxW, shadow: !pill });
  });
  c.restore();
}

/* ---------- ambient helpers ---------- */
function particles(c, t, o = {}) {
  const { n = 60, seed = 5, col = PAL.light, speed = 40, size = 5, area = [0, 0, W, H], up = true, alpha = .6 } = o;
  const r = rng(seed); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x0 = lerp(area[0], area[2], r()), y0 = lerp(area[1], area[3], r()), sp = (.4 + r()) * speed, ph = r() * 6.28, sz = (.4 + r()) * size;
    const hh = area[3] - area[1]; let y = ((y0 - area[1] + (up ? -1 : 1) * sp * t) % hh + hh) % hh + area[1];
    const x = x0 + Math.sin(t * .8 + ph) * 18; const tw = .5 + .5 * Math.sin(t * 2 + ph);
    c.globalAlpha = alpha * tw; c.fillStyle = rg(c, x, y, 0, sz * 3, [[0, col], [1, 'rgba(0,0,0,0)']]);
    c.beginPath(); c.arc(x, y, sz * 3, 0, 7); c.fill();
  }
  c.restore();
}
function greenBackdrop(c, t, o = {}) {
  const { top = '#0F5A3C', bot = PAL.darker } = o;
  c.fillStyle = lg(c, 0, 0, 0, H, [[0, top], [1, bot]]); c.fillRect(0, 0, W, H);
  glow(c, 540 + Math.sin(t * .5) * 120, 700, 900, 'rgba(0,166,81,.45)');
  c.save(); c.strokeStyle = 'rgba(140,240,181,.07)'; c.lineWidth = 2;
  for (let i = -2; i < 14; i++) { const x = i * 100 + (t * 14) % 100; c.beginPath(); c.moveTo(x, 0); c.lineTo(x - 300, H); c.stroke(); }
  c.restore();
  particles(c, t, { n: 70, seed: 11 });
}
function vignette(c, a = .45) {
  c.save(); c.fillStyle = rg(c, 540, 960, 600, 1250, [[0, 'rgba(0,0,0,0)'], [1, `rgba(0,0,0,${a})`]]); c.fillRect(0, 0, W, H); c.restore();
}
/* flowing line with travelling pulses */
function flowLine(c, pts, t, o = {}) {
  const { col = PAL.light, width = 5, pulses = 3, speed = .35, alpha = 1, draw = 1 } = o;
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); if (pts.length === 3) c.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]); else if (pts.length === 4) c.bezierCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1]); else pts.slice(1).forEach(p => c.lineTo(p[0], p[1])); };
  const at = u => { // sample bezier
    const a = pts; const v = 1 - u;
    if (a.length === 3) return [v * v * a[0][0] + 2 * v * u * a[1][0] + u * u * a[2][0], v * v * a[0][1] + 2 * v * u * a[1][1] + u * u * a[2][1]];
    if (a.length === 4) return [v ** 3 * a[0][0] + 3 * v * v * u * a[1][0] + 3 * v * u * u * a[2][0] + u ** 3 * a[3][0], v ** 3 * a[0][1] + 3 * v * v * u * a[1][1] + 3 * v * u * u * a[2][1] + u ** 3 * a[3][1]];
    return [lerp(a[0][0], a[1][0], u), lerp(a[0][1], a[1][1], u)];
  };
  c.save(); c.globalAlpha *= alpha; c.lineCap = 'round';
  c.setLineDash([2000]); c.lineDashOffset = 2000 * (1 - draw);
  c.strokeStyle = 'rgba(0,166,81,.35)'; c.lineWidth = width * 3; path(); c.stroke();
  c.strokeStyle = col; c.lineWidth = width; path(); c.stroke(); c.setLineDash([]);
  if (draw > .98) for (let i = 0; i < pulses; i++) {
    const u = ((t * speed + i / pulses) % 1); const [x, y] = at(u);
    glow(c, x, y, 34, '#fff', .9); c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill();
  }
  c.restore();
}

/* ---------- characters ---------- */
function arm(c, sx, sy, a1, a2, col, skin, w = 24, L1 = 58, L2 = 54) {
  const ex = sx + Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1, hx = ex + Math.sin(a2) * L2, hy = ey + Math.cos(a2) * L2;
  c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col; c.lineWidth = w;
  c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
  c.fillStyle = skin; c.beginPath(); c.arc(hx, hy, 12, 0, 7); c.fill();
  return [hx, hy];
}
const SKINS = ['#F2C7A5', '#E3A982', '#C98B63', '#A96F4B'];
/* o: {s, flip, ph, amp, pose, skin, hair, hairStyle, shirt, pants, shoes, dress, hat, glasses, t, phone, phoneOn, hs, coat, apron, vest, helmet, mood} */
function person(c, x, y, o = {}) {
  const s = o.s || 1, d = o.flip ? -1 : 1, ph = o.ph || 0, amp = o.amp === undefined ? (o.ph ? 1 : 0) : o.amp, t = o.t || 0;
  const skin = o.skin || SKINS[0], shirt = o.shirt || PAL.green, pants = o.pants || '#25364A', shoes = o.shoes || '#14202B', hair = o.hair || '#2A1B14';
  const bob = Math.abs(Math.sin(ph)) * 7 * amp + Math.sin(t * 2.2) * 1.5, hs = o.hs || 1, hipY = -150 - bob;
  c.save(); c.translate(x, y); c.scale(s * d, s);
  c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(0, 2, 62, 11, 0, 0, 7); c.fill();
  // legs
  for (const k of [-1, 1]) {
    const a = Math.sin(ph + (k > 0 ? 0 : Math.PI)) * .5 * amp, hx = k * 19, fx = hx + Math.sin(a) * 148, fy = Math.min(-8, hipY + Math.cos(a) * 148 - Math.max(0, -Math.cos(ph + (k > 0 ? 0 : Math.PI))) * 14 * amp);
    c.lineCap = 'round'; c.strokeStyle = o.dress ? skin : pants; c.lineWidth = 30; c.beginPath(); c.moveTo(hx, hipY); c.lineTo(fx, fy); c.stroke();
    c.fillStyle = shoes; c.beginPath(); c.ellipse(fx + 9, fy + 2, 26, 12, 0, 0, 7); c.fill();
  }
  if (o.dress) { c.fillStyle = o.dress; c.beginPath(); c.moveTo(-44, hipY - 30); c.lineTo(44, hipY - 30); c.lineTo(62 + Math.sin(ph) * 6 * amp, hipY + 62); c.lineTo(-62 + Math.sin(ph) * 6 * amp, hipY + 62); c.closePath(); c.fill(); }
  // back arm (left)
  const sy = hipY - 98;
  const poses = {
    stand: [[-.14, -.1], [.14, .1]],
    walk: [[-.1 + Math.sin(ph) * .55 * amp, -.1 + Math.sin(ph) * .75 * amp], [.1 - Math.sin(ph) * .55 * amp, .1 - Math.sin(ph) * .75 * amp]],
    phone: [[-.14, -.1], [.45, -2.55]],
    wave: [[-.14, -.1], [2.7 + Math.sin(t * 9) * .25, 3.1 + Math.sin(t * 9) * .4]],
    up: [[-2.8, -3.1], [2.8, 3.1]],
    hold: [[-.35, 1.9], [.35, -1.9]],
    point: [[-.14, -.1], [1.35, 1.5]],
    out: [[-.14, -.1], [1.0, 1.3]]
  };
  const P = poses[o.pose || 'stand'];
  const armCol = o.coat || shirt;
  arm(c, -40, sy, P[0][0], P[0][1], armCol, skin);
  // torso
  c.fillStyle = shirt; rr(c, -44, sy - 22, 88, 126, 30); c.fill();
  c.fillStyle = 'rgba(255,255,255,.1)'; rr(c, -44, sy - 22, 40, 126, 20); c.fill();
  if (o.coat) { c.fillStyle = o.coat; rr(c, -46, sy - 22, 92, 140, 28); c.fill(); c.fillStyle = 'rgba(255,255,255,.12)'; rr(c, -46, sy - 22, 36, 140, 18); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, sy - 10); c.lineTo(0, sy + 110); c.stroke(); }
  if (o.apron) { c.fillStyle = o.apron; rr(c, -30, sy + 10, 60, 100, 14); c.fill(); c.fillRect(-30, sy - 18, 8, 30); c.fillRect(22, sy - 18, 8, 30); }
  if (o.vest) { c.fillStyle = o.vest; rr(c, -44, sy - 22, 88, 126, 30); c.fill(); c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(-44, sy + 40, 88, 10); }
  if (o.tie) { c.fillStyle = o.tie; c.beginPath(); c.moveTo(-8, sy - 18); c.lineTo(8, sy - 18); c.lineTo(5, sy + 50); c.lineTo(-5, sy + 50); c.fill(); }
  if (o.backpack) { c.fillStyle = o.backpack; rr(c, -58, sy - 6, 22, 86, 10); c.fill(); }
  // neck + head
  c.fillStyle = skin; c.fillRect(-10, sy - 40, 20, 26);
  const hy = sy - 66;
  if (o.hairStyle === 'long' || o.hairStyle === 'scarf') { c.fillStyle = o.hairStyle === 'scarf' ? (o.scarf || '#B9453B') : hair; rr(c, -42 * hs, hy - 6, 84 * hs, 92, 36); c.fill(); }
  c.fillStyle = skin; c.beginPath(); c.arc(0, hy, 36 * hs, 0, 7); c.fill();
  // ears
  c.beginPath(); c.arc(-35 * hs, hy + 4, 7, 0, 7); c.arc(35 * hs, hy + 4, 7, 0, 7); c.fill();
  const hsty = o.hairStyle || 'short';
  c.fillStyle = hair;
  if (hsty === 'short' || hsty === 'long' || hsty === 'bun') { c.beginPath(); c.arc(0, hy - 4, 38 * hs, Math.PI * 1.02, Math.PI * 1.98); c.quadraticCurveTo(10, hy - 26 * hs, -38 * hs, hy - 4); c.fill(); if (hsty === 'bun') { c.beginPath(); c.arc(0, hy - 46 * hs, 15, 0, 7); c.fill(); } }
  if (hsty === 'scarf') { c.fillStyle = o.scarf || '#B9453B'; c.beginPath(); c.arc(0, hy - 4, 40 * hs, Math.PI * 1.0, Math.PI * 2); c.lineTo(34 * hs, hy + 14); c.quadraticCurveTo(0, hy - 20, -34 * hs, hy + 14); c.closePath(); c.fill(); }
  if (hsty === 'bald') { /* none */ }
  if (o.hat === 'cap') { c.fillStyle = o.hatCol || '#3A3F4B'; c.beginPath(); c.arc(0, hy - 8, 38 * hs, Math.PI, 0); c.fill(); c.fillRect(-4, hy - 12, 56, 9); }
  if (o.hat === 'flat') { c.fillStyle = o.hatCol || '#4B3B2E'; c.beginPath(); c.ellipse(0, hy - 24, 44, 14, 0, 0, 7); c.fill(); c.beginPath(); c.arc(0, hy - 10, 37, Math.PI * 1.05, Math.PI * 1.95); c.fill(); }
  if (o.hat === 'kalpak') { c.fillStyle = '#F4F0E6'; c.beginPath(); c.moveTo(-38, hy - 6); c.quadraticCurveTo(-36, hy - 66, 0, hy - 62); c.quadraticCurveTo(36, hy - 66, 38, hy - 6); c.closePath(); c.fill(); c.fillStyle = '#1D2A24'; rr(c, -40, hy - 22, 80, 16, 6); c.fill(); }
  if (o.helmet) { c.fillStyle = o.helmet; c.beginPath(); c.arc(0, hy - 6, 40, Math.PI, 0); c.fill(); c.fillRect(-46, hy - 8, 92, 9); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-6, hy - 44, 12, 38); }
  // face
  const look = o.look || 0, blink = (t % 3.4) > 3.28 ? .12 : 1, mood = o.mood === undefined ? 1 : o.mood;
  c.fillStyle = '#1B1412';
  for (const k of [-1, 1]) { c.beginPath(); c.ellipse(k * 14 * hs + look * 3, hy + 3, 4.6, 5.4 * blink, 0, 0, 7); c.fill(); }
  c.strokeStyle = hsty === 'bald' || o.hat === 'kalpak' ? '#6B5B4B' : hair; c.lineWidth = 3.4; c.lineCap = 'round';
  for (const k of [-1, 1]) { c.beginPath(); c.moveTo(k * 14 * hs - 8, hy - 11 - mood * 1.5); c.quadraticCurveTo(k * 14 * hs, hy - 15 - mood * 2, k * 14 * hs + 8, hy - 11); c.stroke(); }
  c.strokeStyle = '#7A3B2E'; c.lineWidth = 3.4; c.beginPath(); c.arc(0 + look * 2, hy + 14, 11 * (.7 + .3 * mood), .15 * Math.PI, .85 * Math.PI); c.stroke();
  c.fillStyle = 'rgba(255,120,110,.28)'; c.beginPath(); c.arc(-24 * hs, hy + 14, 7, 0, 7); c.arc(24 * hs, hy + 14, 7, 0, 7); c.fill();
  if (o.glasses) { c.strokeStyle = '#1B1412'; c.lineWidth = 3; c.beginPath(); c.arc(-14 * hs, hy + 3, 11, 0, 7); c.moveTo(25 * hs - 2, hy + 3); c.arc(14 * hs, hy + 3, 11, 0, 7); c.moveTo(-3, hy + 3); c.lineTo(3, hy + 3); c.stroke(); }
  if (o.beard) { c.fillStyle = o.beard; c.beginPath(); c.arc(0, hy + 12, 34 * hs, .05 * Math.PI, .95 * Math.PI); c.quadraticCurveTo(0, hy + 24, -33 * hs, hy + 14); c.fill(); c.strokeStyle = '#7A3B2E'; c.lineWidth = 3; c.beginPath(); c.arc(0, hy + 18, 7, .1 * Math.PI, .9 * Math.PI); c.stroke(); }
  // front arm (right)
  const [hx, hy2] = arm(c, 40, sy, P[1][0], P[1][1], armCol, skin);
  if (o.phone) {
    c.save(); c.translate(hx, hy2 - 6); c.rotate(o.phoneRot === undefined ? -.12 : o.phoneRot);
    c.fillStyle = '#10161A'; rr(c, -15, -34, 30, 58, 6); c.fill();
    c.fillStyle = o.phoneOn ? PAL.green2 : '#1B2A33'; rr(c, -12, -30, 24, 50, 4); c.fill();
    if (o.phoneOn) glow(c, 0, -6, 90, 'rgba(0,255,140,.55)');
    c.restore(); c.fillStyle = skin; c.beginPath(); c.arc(hx + 9, hy2 + 8, 8, 0, 7); c.fill();
  }
  c.restore();
  return [x + d * hx * s, y + hy2 * s];
}
/* ---------- props ---------- */
function phoneBody(c, x, y, w, h, o = {}) {
  const { screen = true, on = 1, rot = 0, sheen = true } = o;
  c.save(); c.translate(x, y); c.rotate(rot);
  c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 50; c.shadowOffsetY = 30;
  c.fillStyle = '#0D1418'; rr(c, -w / 2, -h / 2, w, h, w * .14); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 3; rr(c, -w / 2 + 1, -h / 2 + 1, w - 2, h - 2, w * .14); c.stroke();
  const sw = w * .92, sh = h * .955;
  c.save(); rr(c, -sw / 2, -sh / 2, sw, sh, w * .115); c.clip();
  c.fillStyle = on > .01 ? lg(c, 0, -sh / 2, 0, sh / 2, [[0, '#0E7A48'], [1, '#04301F']]) : '#05090B'; c.fillRect(-sw / 2, -sh / 2, sw, sh);
  if (screen && on > .01) { c.globalAlpha = on; ui(c, sw, sh, o.t || 0); c.globalAlpha = 1; }
  if (sheen) { c.fillStyle = lg(c, -sw / 2, -sh / 2, sw / 2, sh / 2, [[0, 'rgba(255,255,255,.16)'], [.35, 'rgba(255,255,255,0)']]); c.fillRect(-sw / 2, -sh / 2, sw, sh); }
  c.restore();
  c.fillStyle = '#05090B'; rr(c, -w * .13, -sh / 2 + 10, w * .26, w * .055, w * .03); c.fill();
  c.restore();
}
/* generic (illustrative) banking UI — no real app elements */
function ui(c, w, h, t) {
  const u = w / 100; c.save(); c.translate(-w / 2, -h / 2);
  c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(10 * u, 14 * u, 4.2 * u, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,.75)'; rr(c, 18 * u, 11 * u, 30 * u, 2.6 * u, u); c.fill(); rr(c, 18 * u, 15.5 * u, 20 * u, 2 * u, u); c.fill();
  c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(90 * u, 14 * u, 4.2 * u, 0, 7); c.fill();
  // card
  const cy = 26 * u; c.fillStyle = lg(c, 8 * u, cy, 92 * u, cy + 30 * u, [[0, '#19D07A'], [1, '#00A651']]); rr(c, 8 * u, cy, 84 * u, 34 * u, 5 * u); c.fill();
  c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.arc(78 * u, cy + 8 * u, 9 * u, 0, 7); c.fill(); c.beginPath(); c.arc(68 * u, cy + 8 * u, 9 * u, 0, 7); c.fill();
  c.fillStyle = '#FFE3A1'; rr(c, 14 * u, cy + 14 * u, 9 * u, 7 * u, 1.5 * u); c.fill();
  c.fillStyle = 'rgba(255,255,255,.85)'; rr(c, 14 * u, cy + 26 * u, 30 * u, 2.6 * u, u); c.fill();
  // actions
  for (let i = 0; i < 4; i++) { const x = (16 + i * 23) * u; c.fillStyle = 'rgba(255,255,255,.16)'; rr(c, x - 7 * u, 66 * u, 14 * u, 14 * u, 4 * u); c.fill(); c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(x, 73 * u, 2.6 * u, 0, 7); c.fill(); rr(c, x - 5 * u, 83 * u, 10 * u, 1.8 * u, u); c.fill(); }
  // list
  for (let i = 0; i < 3; i++) { const y = (89 + i * 0) * u; }
  c.fillStyle = 'rgba(255,255,255,.12)'; rr(c, 8 * u, 90 * u, 84 * u, 10 * u, 3 * u); c.fill();
  c.fillStyle = 'rgba(255,255,255,.7)'; rr(c, 22 * u, 93 * u, 30 * u, 2.2 * u, u); c.fill();
  c.restore();
}
/* icon set: drawn centred at 0,0 within ~radius r */
function icon(c, kind, x, y, r, col = '#fff', t = 0) {
  c.save(); c.translate(x, y); const k = r / 50; c.scale(k, k);
  c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 7; c.strokeStyle = col; c.fillStyle = col;
  switch (kind) {
    case 'card': rr(c, -34, -22, 68, 44, 8); c.stroke(); c.fillRect(-34, -9, 68, 10); rr(c, -26, 8, 20, 6, 3); c.fill(); break;
    case 'transfer': c.beginPath(); c.moveTo(-30, -10); c.lineTo(28, -10); c.moveTo(14, -24); c.lineTo(30, -10); c.lineTo(14, 4); c.moveTo(30, 18); c.lineTo(-28, 18); c.moveTo(-14, 4); c.lineTo(-30, 18); c.lineTo(-14, 32); c.stroke(); break;
    case 'qr': { c.lineWidth = 6; for (const [a, b] of [[-32, -32], [10, -32], [-32, 10]]) { rr(c, a, b, 22, 22, 4); c.stroke(); c.fillRect(a + 7, b + 7, 8, 8); } const r2 = rng(7); for (let i = 0; i < 9; i++) c.fillRect(8 + (i % 3) * 10, 8 + Math.floor(i / 3) * 10, r2() > .35 ? 7 : 0, 7); break; }
    case 'bulb': c.beginPath(); c.arc(0, -8, 22, Math.PI * .8, Math.PI * .2 + Math.PI * 2); c.lineTo(10, 24); c.lineTo(-10, 24); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(-9, 34); c.lineTo(9, 34); c.stroke(); c.beginPath(); c.moveTo(-6, 10); c.lineTo(0, -6); c.lineTo(6, 10); c.stroke(); break;
    case 'web': rr(c, -36, -28, 72, 56, 9); c.stroke(); c.beginPath(); c.moveTo(-36, -14); c.lineTo(36, -14); c.stroke(); c.beginPath(); c.arc(0, 6, 13, 0, 7); c.moveTo(-13, 6); c.lineTo(13, 6); c.moveTo(0, -7); c.quadraticCurveTo(-8, 6, 0, 19); c.moveTo(0, -7); c.quadraticCurveTo(8, 6, 0, 19); c.lineWidth = 4.5; c.stroke(); break;
    case 'bag': c.beginPath(); c.moveTo(-28, -12); c.lineTo(28, -12); c.lineTo(32, 32); c.lineTo(-32, 32); c.closePath(); c.stroke(); c.beginPath(); c.arc(0, -12, 14, Math.PI, 0); c.stroke(); break;
    case 'check': c.lineWidth = 11; c.beginPath(); c.moveTo(-22, 2); c.lineTo(-6, 18); c.lineTo(24, -16); c.stroke(); break;
    case 'house': c.beginPath(); c.moveTo(-34, 0); c.lineTo(0, -32); c.lineTo(34, 0); c.moveTo(-26, -6); c.lineTo(-26, 30); c.lineTo(26, 30); c.lineTo(26, -6); c.stroke(); rr(c, -8, 8, 16, 22, 3); c.stroke(); break;
    case 'car': c.beginPath(); c.moveTo(-36, 12); c.lineTo(-30, -6); c.lineTo(-16, -22); c.lineTo(16, -22); c.lineTo(30, -6); c.lineTo(38, 2); c.lineTo(38, 14); c.lineTo(-36, 14); c.closePath(); c.stroke(); for (const xx of [-20, 22]) { c.beginPath(); c.arc(xx, 16, 9, 0, 7); c.fillStyle = col; c.fill(); } break;
    case 'coin': c.beginPath(); c.arc(0, 0, 30, 0, 7); c.stroke(); c.font = `800 38px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('₸', 0, 3); break;
    case 'doc': rr(c, -26, -36, 52, 72, 6); c.stroke(); for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-14, -18 + i * 14); c.lineTo(i === 3 ? 2 : 14, -18 + i * 14); c.lineWidth = 5; c.stroke(); } break;
    case 'counter': rr(c, -38, -4, 76, 40, 4); c.stroke(); c.beginPath(); c.arc(0, -22, 12, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-22, -4); c.quadraticCurveTo(0, -18, 22, -4); c.stroke(); c.beginPath(); c.moveTo(-38, 12); c.lineTo(38, 12); c.stroke(); break;
    case 'pc': rr(c, -38, -32, 76, 50, 6); c.stroke(); c.beginPath(); c.moveTo(-14, 34); c.lineTo(14, 34); c.moveTo(0, 18); c.lineTo(0, 34); c.stroke(); c.beginPath(); c.moveTo(-26, 8); c.lineTo(-12, -6); c.lineTo(0, 2); c.lineTo(22, -18); c.lineWidth = 5; c.stroke(); break;
    case 'phone': rr(c, -20, -36, 40, 72, 9); c.stroke(); c.beginPath(); c.moveTo(-6, -27); c.lineTo(6, -27); c.moveTo(-6, 28); c.lineTo(6, 28); c.lineWidth = 5; c.stroke(); break;
  }
  c.restore();
}

/* ---------- city props ---------- */
function carShape(c, x, y, col, dir = 1, s = 1) {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 4, 90, 10, 0, 0, 7); c.fill();
  c.fillStyle = col; c.beginPath(); c.moveTo(-86, -8); c.quadraticCurveTo(-88, -40, -60, -42); c.lineTo(-30, -44); c.quadraticCurveTo(-10, -86, 30, -80); c.lineTo(48, -44); c.quadraticCurveTo(84, -40, 86, -12); c.lineTo(86, -6); c.lineTo(-86, -6); c.closePath(); c.fill();
  c.fillStyle = 'rgba(190,230,255,.85)'; c.beginPath(); c.moveTo(-22, -46); c.quadraticCurveTo(-8, -74, 26, -72); c.lineTo(40, -46); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(-86, -26, 172, 5);
  c.fillStyle = '#FFF3B0'; c.beginPath(); c.arc(80, -22, 6, 0, 7); c.fill();
  for (const xx of [-52, 52]) { c.fillStyle = '#111'; c.beginPath(); c.arc(xx, -6, 17, 0, 7); c.fill(); c.fillStyle = '#9AA5AB'; c.beginPath(); c.arc(xx, -6, 8, 0, 7); c.fill(); }
  c.restore();
}
function tree(c, x, y, s = 1, col = '#1E7F4F', t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#5B3B28'; c.fillRect(-7, -90, 14, 90);
  const sw = Math.sin(t * 1.3 + x) * 3; c.fillStyle = col;
  for (const [dx, dy, r] of [[0, -130, 46], [-30, -100, 34], [30, -100, 34]]) { c.beginPath(); c.arc(dx + sw, dy, r, 0, 7); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(-10 + sw, -140, 22, 0, 7); c.fill(); c.restore();
}
function lampPost(c, x, y, s = 1, col = '#2B3A42') {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.fillRect(-5, -240, 10, 240); c.fillRect(-5, -240, 44, 8);
  c.fillStyle = '#FFE9A8'; c.beginPath(); c.ellipse(36, -228, 16, 8, 0, 0, 7); c.fill(); glow(c, 36, -224, 90, 'rgba(255,230,160,.5)'); c.restore();
}
