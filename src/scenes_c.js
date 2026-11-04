/* Scenes 6–7 + master timeline */

/* ====================== SCENE 6 — KAZAKHSTAN (43–53s → local 0–10) ====================== */
const S6 = (() => {
  const K = 34.4, COS = Math.cos(48 * Math.PI / 180);
  const P = (lon, lat) => [(lon - 46.5) * COS * K, (55.6 - lat) * K];
  const border = [[46.5, 48.4], [47.0, 49.7], [48.5, 50.1], [50.7, 51.6], [53.0, 51.5], [55.7, 50.6], [57.0, 51.1], [60.0, 50.8], [61.5, 51.5], [61.0, 53.0], [65.0, 54.2], [69.0, 55.3], [73.0, 54.1], [76.5, 54.1], [77.8, 53.2], [80.0, 51.2], [83.0, 51.1], [85.5, 49.6], [87.3, 49.1], [85.2, 47.0], [83.0, 47.2], [82.2, 45.5], [80.2, 45.0], [80.4, 42.9], [78.0, 42.9], [73.5, 42.9], [70.9, 42.3], [68.0, 41.0], [66.2, 42.0], [63.0, 43.6], [61.0, 44.2], [58.5, 45.5], [56.0, 45.0], [56.0, 41.3], [53.0, 42.0], [52.8, 44.0], [51.3, 44.6], [50.3, 45.3], [49.0, 46.5], [47.5, 47.5], [46.8, 48.0]].map(p => P(p[0], p[1]));
  const CITIES = [
    ['Астана', 71.4, 51.2, 1], ['Алматы', 76.9, 43.25, 1], ['Шымкент', 69.6, 42.3, 0], ['Караганда', 73.1, 49.8, 0], ['Актобе', 57.2, 50.3, 0],
    ['Атырау', 51.9, 47.1, 0], ['Актау', 51.2, 43.65, 0], ['Павлодар', 76.9, 52.3, 0], ['Костанай', 63.6, 53.2, 0]
  ].map(c => ({ n: c[0], p: P(c[1], c[2]), hub: c[3] }));
  const hub = CITIES[0];
  const crowd = [
    { x: 150, o: { hat: 'kalpak', beard: '#E6E1D6', coat: '#4A5D52', shirt: '#4A5D52', pants: '#2A2F3A', skin: SKINS[2], hair: '#555', mood: 1 } },
    { x: 330, o: { coat: '#F4F4F4', shirt: '#F4F4F4', pants: '#3A4A5A', glasses: true, skin: SKINS[0], hair: '#2A1B14', hairStyle: 'bun', dress: null } },
    { x: 540, o: { helmet: '#FFC400', vest: '#FF7A1A', shirt: '#3A4A5A', pants: '#2F3540', skin: SKINS[1], hair: '#2A1B14' } },
    { x: 750, o: { shirt: '#7A5BD6', dress: '#3D6A9E', hairStyle: 'long', hair: '#2A1B14', skin: SKINS[0], glasses: true } },
    { x: 930, o: { shirt: '#E9B44C', pants: '#233350', skin: SKINS[1], hair: '#1E140F', backpack: PAL.green } }
  ];
  return function (c, t) {
    greenBackdrop(c, t, { top: '#0B5A3B', bot: '#04180F' });
    const mk = E.io(prog(t, 0, 8.8)), z = lerp(1.55, .98, mk), fx = 470, fy = lerp(430, 258, mk);
    c.save(); c.translate(540, 980); c.scale(z, z); c.translate(-fx, -fy);
    const reveal = E.out(prog(t, .1, 1.2));
    // land
    c.save(); c.globalAlpha = reveal;
    c.beginPath(); border.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
    c.shadowColor = 'rgba(0,255,150,.7)'; c.shadowBlur = 50; c.fillStyle = lg(c, 0, 0, 0, 520, [[0, '#17B56C'], [1, '#07643A']]); c.fill(); c.shadowColor = 'transparent';
    c.save(); c.clip();
    c.fillStyle = 'rgba(255,255,255,.10)'; for (let x = 0; x < 960; x += 22) for (let y = 0; y < 530; y += 22) { c.beginPath(); c.arc(x + ((y / 22) % 2) * 11, y, 1.7, 0, 7); c.fill(); }
    glow(c, 470, 260, 380, 'rgba(160,255,200,.25)');
    c.restore();
    c.beginPath(); border.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.lineJoin = 'round'; c.strokeStyle = 'rgba(190,255,220,.95)'; c.lineWidth = 3.5 / z; c.stroke();
    c.restore();
    // routes
    CITIES.forEach((ct, i) => {
      if (ct === hub) return; const t0 = 1.2 + i * .28, d = E.io(prog(t, t0, t0 + 1.0)); if (d <= 0) return;
      const mx = (hub.p[0] + ct.p[0]) / 2, my = (hub.p[1] + ct.p[1]) / 2 - 36 - (i % 3) * 14;
      flowLine(c, [hub.p, [mx, my], ct.p], t + i * .17, { draw: d, width: 3 / z, pulses: 2, speed: .28 + i * .015, col: '#E7FFF2' });
    });
    // cities
    CITIES.forEach((ct, i) => {
      const t0 = .9 + i * .24, p = E.back(prog(t, t0, t0 + .6)); if (p <= 0) return;
      const r = (ct.hub ? 11 : 7.5) / z * 1.0; const pulse = (t * .9 + i * .3) % 1;
      c.save(); c.translate(ct.p[0], ct.p[1]); c.scale(p, p);
      glow(c, 0, 0, r * 6, 'rgba(160,255,200,.9)');
      c.strokeStyle = `rgba(255,255,255,${.8 * (1 - pulse)})`; c.lineWidth = 2.5 / z; c.beginPath(); c.arc(0, 0, r + pulse * r * 3.5, 0, 7); c.stroke();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.fillStyle = PAL.green; c.beginPath(); c.arc(0, 0, r * .5, 0, 7); c.fill();
      c.restore();
      txt(c, ct.n, ct.p[0], ct.p[1] + (ct.n === 'Астана' || ct.n === 'Павлодар' ? -(r + 22 / z) : r + 22 / z), { size: 26 / z, weight: 800, alpha: p, stroke: { w: 5 / z, c: 'rgba(3,40,25,.85)' }, shadow: false, maxW: 400 / z });
    });
    c.restore();
    // bottom fade + crowd
    const g = lg(c, 0, 1380, 0, 1920, [[0, 'rgba(4,24,15,0)'], [.5, 'rgba(4,24,15,.9)'], [1, 'rgba(4,24,15,1)']]); c.fillStyle = g; c.fillRect(0, 1380, W, 540);
    c.fillStyle = 'rgba(140,240,181,.25)'; rr(c, 60, 1836, 960, 10, 5); c.fill();
    crowd.forEach((p, i) => {
      const u = E.back(prog(t, 3.2 + i * .35, 3.9 + i * .35)); if (u <= 0) return;
      c.save(); c.globalAlpha = Math.min(1, u); person(c, p.x, 1836 + (1 - u) * 80, { ...p.o, s: .9, t: t + i, pose: i === 2 ? 'wave' : 'stand', mood: 1 }); c.restore();
    });
    // captions
    ['Технологии.', 'Доверие.', 'Возможности.'].forEach((l, i) => {
      const u = t - .3 - i * 2.3, p = E.out(prog(u, 0, .6)); if (p <= 0) return; const y = 190 + i * 96;
      txt(c, l, 540, y + (1 - p) * 30, { size: 78, alpha: p, color: i === 1 ? PAL.light : '#fff', maxW: 860 });
    });
    c.fillStyle = PAL.green; rr(c, 480, 478, 120 * E.out(prog(t, .3, 1.1)), 8, 4); c.fill();
  };
})();

/* ====================== SCENE 7 — GRAND FINALE (53–60s → local 0–7) ====================== */
const S7 = (() => {
  const N = 560, CX = 540, CY = 800, R = 340;
  const r = rng(99), P = [];
  for (let i = 0; i < N; i++) {
    const a = r() * 6.283, rad = 900 + r() * 700, kind = i % 5;
    let tx, ty;
    if (kind < 3) { const ta = r() * 6.283, tr = R + (r() - .5) * 10; tx = CX + Math.cos(ta) * tr; ty = CY + Math.sin(ta) * tr; }
    else if (kind === 3) { tx = 130 + r() * 820; ty = 1420 + (r() - .5) * 4; }
    else { const ta = r() * 6.283, tr = R + 40 + r() * 90; tx = CX + Math.cos(ta) * tr; ty = CY + Math.sin(ta) * tr; }
    P.push({ sx: CX + Math.cos(a) * rad, sy: CY + Math.sin(a) * rad, tx, ty, d: r() * 1.3, sz: 2 + r() * 4, g: r() > .45, sw: (r() - .5) * 2.4, ta: Math.atan2(ty - CY, tx - CX), kind });
  }
  return function (c, t) {
    c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#0D6A44'], [.5, '#08492F'], [1, '#031A11']]); c.fillRect(0, 0, W, H);
    glow(c, CX, CY, 1100, `rgba(0,200,110,${.35 + .1 * Math.sin(t * 1.5)})`);
    // light beams
    c.save(); c.translate(CX, CY); c.rotate(t * .08); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 8; i++) { c.rotate(Math.PI / 4); c.fillStyle = rg(c, 0, -500, 0, 900, [[0, 'rgba(120,255,190,.07)'], [1, 'rgba(120,255,190,0)']]); c.beginPath(); c.moveTo(0, 0); c.lineTo(-120, -1500); c.lineTo(120, -1500); c.fill(); } c.restore();
    // particles
    const form = prog(t, .1, 3.5);
    c.save(); c.globalCompositeOperation = 'lighter';
    P.forEach(p => {
      const u = E.io(clamp((t - .1 - p.d * .8) / 2.6)); const sw = (1 - u) * p.sw * 1.6;
      let ang = Math.atan2(p.sy - CY, p.sx - CX) + sw, rad = lerp(Math.hypot(p.sx - CX, p.sy - CY), Math.hypot(p.tx - CX, p.ty - CY), u);
      let x, y;
      if (p.kind === 3) { x = lerp(CX + Math.cos(ang) * rad, p.tx, u); y = lerp(CY + Math.sin(ang) * rad, p.ty, u); }
      else { const spin = t > 3.4 ? (t - 3.4) * .25 : 0; const a2 = lerp(ang, p.ta, u) + spin * u; x = CX + Math.cos(a2) * rad; y = CY + Math.sin(a2) * rad; }
      const tw = .6 + .4 * Math.sin(t * 4 + p.d * 20), a = (.35 + .65 * u) * tw;
      c.fillStyle = p.g ? `rgba(120,255,190,${a})` : `rgba(255,255,255,${a})`; c.beginPath(); c.arc(x, y, p.sz * (1 + (1 - u) * .8), 0, 7); c.fill();
      if (u < .98) { c.strokeStyle = p.g ? `rgba(120,255,190,${a * .35})` : `rgba(255,255,255,${a * .3})`; c.lineWidth = p.sz * .7; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (p.sx - x) * .035, y + (p.sy - y) * .035); c.stroke(); }
    });
    c.restore();
    // ring glow once formed
    const rf = prog(t, 2.8, 3.8);
    if (rf > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(160,255,210,${.35 * rf})`; c.lineWidth = 3; c.beginPath(); c.arc(CX, CY, R, 0, 7); c.stroke(); c.lineWidth = 1.5; c.beginPath(); c.arc(CX, CY, R + 70, 0, 7); c.stroke(); c.restore(); }
    // flash pulse at formation
    const fp = prog(t, 3.4, 4.4); if (fp > 0 && fp < 1) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(200,255,225,${1 - fp})`; c.lineWidth = 16 * (1 - fp) + 2; c.beginPath(); c.arc(CX, CY, R * .6 + fp * 900, 0, 7); c.stroke(); c.restore(); glow(c, CX, CY, 700, `rgba(200,255,225,${.5 * (1 - fp)})`); }
    // reserved logo zone: clean corner brackets (logo to be added separately)
    const lz = E.out(prog(t, 3.2, 4.0)); if (lz > 0) {
      const w = 520, h = 300, x = CX - w / 2, y = CY - h / 2, L = 46; c.save(); c.globalAlpha = .55 * lz; c.strokeStyle = '#fff'; c.lineWidth = 4; c.lineCap = 'round';
      for (const [px, py, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { c.beginPath(); c.moveTo(px + dx * L, py); c.lineTo(px, py); c.lineTo(px, py + dy * L); c.stroke(); }
      c.fillStyle = `rgba(255,255,255,${.05})`; rr(c, x, y, w, h, 30); c.fill(); c.restore();
    }
    // texts
    const t1 = E.out(prog(t, 3.9, 4.8)), t2 = E.out(prog(t, 4.7, 5.5));
    if (t1 > 0) txt(c, 'HALYK BANK', 540, 1180 + (1 - t1) * 36, { size: 124, weight: 900, alpha: t1, ls: 10, maxW: 940, shadow: true });
    if (t2 > 0) { c.fillStyle = PAL.green2; rr(c, 540 - 60 * t2, 1244, 120 * t2, 6, 3); c.fill(); txt(c, 'Вместе с людьми.', 540, 1318 + (1 - t2) * 30, { size: 66, weight: 600, alpha: t2, color: PAL.mint, maxW: 900 }); }
    // sparkles
    const sp = rng(31); for (let i = 0; i < 26; i++) { const x = sp() * W, y = 300 + sp() * 1300, ph = sp() * 6.28, a = Math.max(0, Math.sin(t * 2.4 + ph)) ** 6 * prog(t, 3.5, 4.5); if (a > .02) { c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x, y); c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-14, 0); c.lineTo(14, 0); c.moveTo(0, -14); c.lineTo(0, 14); c.stroke(); c.restore(); } }
    vignette(c, .4);
    const fo = prog(t, 6.55, 7); if (fo > 0) { c.fillStyle = `rgba(3,26,17,${fo})`; c.fillRect(0, 0, W, H); }
  };
})();

/* ====================== MASTER TIMELINE ====================== */
const SCENES = [
  { name: 'S1_hook', start: 0, end: 7, fn: S1 },
  { name: 'S2_history', start: 7, end: 15, fn: S2 },
  { name: 'S3_evolution', start: 15, end: 23, fn: S3 },
  { name: 'S4_digital', start: 23, end: 33, fn: S4 },
  { name: 'S5_people', start: 33, end: 43, fn: S5 },
  { name: 'S6_kazakhstan', start: 43, end: 53, fn: S6 },
  { name: 'S7_finale', start: 53, end: 60, fn: S7 }
];
const TW = .45; // half-width of transition (s)
function drawFrame(c, t) {
  let i = SCENES.findIndex(s => t < s.end); if (i < 0) i = SCENES.length - 1;
  const A = SCENES[i];
  let nextIdx = -1;
  for (let k = 0; k < SCENES.length - 1; k++) { const b = SCENES[k].end; if (t > b - TW && t < b + TW) { nextIdx = k; break; } }
  if (nextIdx >= 0) {
    const a = SCENES[nextIdx], b = SCENES[nextIdx + 1], u = E.io(prog(t, a.end - TW, a.end + TW));
    a.fn(c, t - a.start);
    const r = u * 1650;
    c.save(); c.beginPath(); c.arc(540, 960, r, 0, 7); c.clip(); b.fn(c, Math.max(0, t - b.start)); c.restore();
    c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(140,255,200,${Math.sin(u * Math.PI) * .9})`; c.lineWidth = 34 * Math.sin(u * Math.PI) + 2; c.beginPath(); c.arc(540, 960, r, 0, 7); c.stroke(); c.restore();
    c.save(); c.strokeStyle = `rgba(255,255,255,${Math.sin(u * Math.PI)})`; c.lineWidth = 6; c.beginPath(); c.arc(540, 960, r, 0, 7); c.stroke(); c.restore();
  } else A.fn(c, t - A.start);
}
