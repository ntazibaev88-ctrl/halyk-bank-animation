/* Scenes 1–3 */

/* ====================== SCENE 1 — THE HOOK (0–7s) ====================== */
const S1 = (() => {
  const mk = (seed, minH, maxH, minW, maxW) => { const r = rng(seed), a = []; let x = -60; while (x < W + 80) { const w = minW + r() * (maxW - minW); a.push({ x, w, h: minH + r() * (maxH - minH), r: r(), r2: r() }); x += w + r() * 8; } return a; };
  const far = mk(1, 180, 460, 70, 130), mid = mk(2, 260, 640, 90, 170), near = mk(3, 330, 820, 110, 200);
  const GROUND = 1360, PH = [411, 1433];
  const walkers = [
    { x0: 120, y: 1700, v: 62, s: 1.15, shirt: '#E9B44C', pants: '#2B3A55', skin: 1, hair: '#2A1B14', style: 'short' },
    { x0: 900, y: 1650, v: -48, s: 1.0, shirt: '#E4572E', pants: '#3A3F4B', skin: 0, hair: '#5A3A22', style: 'long', dress: '#3D6A9E' },
    { x0: 700, y: 1830, v: -70, s: 1.4, shirt: '#4B8BD0', pants: '#1F2A44', skin: 2, hair: '#1A1210', style: 'short' },
    { x0: 40, y: 1620, v: 40, s: .95, shirt: '#7A5BD6', pants: '#2A2F3A', skin: 0, hair: '#7A4A22', style: 'bun', dress: '#4F8F6A' }
  ];
  function layer(c, arr, base, col, t, t0, windows, lit) {
    arr.forEach((b, i) => {
      const k = E.out(prog(t, t0 + i * .028, t0 + 1.1 + i * .028)); const h = b.h * k; if (h < 1) return;
      c.fillStyle = col; c.fillRect(b.x, base - h, b.w, h);
      c.fillStyle = 'rgba(255,190,120,.16)'; c.fillRect(b.x, base - h, b.w * .22, h);
      if (windows) {
        const cols = Math.floor(b.w / 26), rows = Math.floor(h / 34);
        for (let ix = 0; ix < cols; ix++) for (let iy = 0; iy < rows; iy++) {
          const hash = (ix * 7 + iy * 13 + i * 31) % 10; if (hash > lit) continue;
          c.fillStyle = hash < 3 ? 'rgba(255,214,140,.85)' : 'rgba(150,215,255,.4)'; c.fillRect(b.x + 8 + ix * 26, base - h + 14 + iy * 34, 12, 18);
        }
      }
    });
  }
  function draw(c, t) {
    c.save();
    const crane = (1 - E.io(prog(t, 0, 3.2))) * 330; c.translate(0, crane);
    // sky
    c.fillStyle = lg(c, 0, -500, 0, GROUND, [[0, '#26306B'], [.35, '#8B5CA8'], [.65, '#FF8A5B'], [1, '#FFD08A']]); c.fillRect(0, -600, W, GROUND + 600);
    const sunY = lerp(1250, 930, E.out(prog(t, 0, 3.4)));
    // rays
    c.save(); c.translate(540, sunY); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) { c.rotate(Math.PI * 2 / 14); c.fillStyle = rg(c, 0, -600, 0, 800, [[0, 'rgba(255,220,150,.10)'], [1, 'rgba(255,220,150,0)']]); c.beginPath(); c.moveTo(0, 0); c.lineTo(-70, -1500); c.lineTo(70, -1500); c.fill(); }
    c.restore();
    glow(c, 540, sunY, 700, 'rgba(255,190,110,.75)');
    c.fillStyle = '#FFF1C9'; c.beginPath(); c.arc(540, sunY, 120, 0, 7); c.fill();
    glow(c, 540, sunY, 220, 'rgba(255,255,255,.9)');
    // clouds
    for (let i = 0; i < 4; i++) { const cx = ((i * 330 + t * 14) % 1500) - 200, cy = 520 + i * 90; c.fillStyle = 'rgba(255,200,170,.28)'; rr(c, cx, cy, 300, 34, 17); c.fill(); rr(c, cx + 60, cy - 20, 180, 34, 17); c.fill(); }
    // skyline
    layer(c, far, GROUND - 20, '#7E5C93', t, .05, false, 0);
    layer(c, mid, GROUND - 6, '#4D3F77', t, .2, true, 4);
    // Baiterek-inspired landmark
    const tk = E.out(prog(t, .4, 2));
    if (tk > 0) {
      c.save(); c.translate(780, GROUND - 6); c.scale(1, tk);
      c.fillStyle = '#E8D9E8'; c.beginPath(); c.moveTo(-26, 0); c.lineTo(-10, -560); c.lineTo(10, -560); c.lineTo(26, 0); c.fill();
      c.fillStyle = 'rgba(255,170,110,.35)'; c.beginPath(); c.moveTo(-26, 0); c.lineTo(-10, -560); c.lineTo(-2, -560); c.lineTo(-4, 0); c.fill();
      c.strokeStyle = '#E8D9E8'; c.lineWidth = 12; for (const k of [-1, 1]) { c.beginPath(); c.moveTo(k * 110, 0); c.quadraticCurveTo(k * 40, -240, 0, -300); c.stroke(); }
      c.fillStyle = PAL.gold; c.beginPath(); c.arc(0, -620, 70, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.arc(-22, -644, 26, 0, 7); c.fill();
      glow(c, 0, -620, 200, 'rgba(255,200,100,.7)'); c.restore();
    }
    layer(c, near, GROUND, '#2D2557', t, .35, true, 5);
    // road
    c.fillStyle = lg(c, 0, GROUND, 0, 1580, [[0, '#2A2A3A'], [1, '#1B1B28']]); c.fillRect(0, GROUND, W, 220);
    c.fillStyle = 'rgba(255,255,255,.35)'; for (let i = -1; i < 12; i++) c.fillRect(((i * 150 - t * 160) % 1800 + 1800) % 1800 - 150, 1478, 80, 7);
    // cars
    const cars = [['#E4572E', 1, 190, 1450, .9, 0], ['#F4F0E6', -1, 150, 1530, 1.05, 700], ['#2E86DE', 1, 230, 1420, .7, 1100]];
    cars.forEach(([col, dir, v, y, s, off]) => { const x = dir > 0 ? ((t * v + off) % (W + 500)) - 250 : W + 250 - ((t * v + off) % (W + 500)); carShape(c, x, y + 80, col, dir, s); });
    // sidewalk
    c.fillStyle = lg(c, 0, 1580, 0, 1920, [[0, '#9E8FB0'], [1, '#C7B3C8']]); c.fillRect(0, 1580, W, 400);
    c.fillStyle = 'rgba(255,255,255,.1)'; for (let i = 0; i < 12; i++) c.fillRect(i * 100 - 40, 1580, 3, 400);
    tree(c, 80, 1600, 1.2, '#2F7D52', t); tree(c, 980, 1590, 1.3, '#2F7D52', t);
    // walkers
    walkers.forEach(w => {
      const x = ((w.x0 + t * w.v + 300) % 1700 + 1700) % 1700 - 300;
      person(c, x, w.y, { s: w.s, flip: w.v < 0, ph: t * 6.5 + w.x0, amp: 1, skin: SKINS[w.skin], shirt: w.shirt, pants: w.pants, hair: w.hair, hairStyle: w.style, dress: w.dress, t });
    });
    // hero
    const phOn = prog(t, 2.4, 2.9);
    person(c, 360, 1790, { s: 1.45, pose: 'phone', phone: true, phoneOn: phOn > .5, look: .6, t, shirt: '#FFFFFF', pants: '#233350', hair: '#1E140F', skin: SKINS[1], mood: 1, backpack: PAL.green });
    if (phOn > 0) glow(c, PH[0], PH[1], 60 + 120 * E.out(phOn), 'rgba(0,255,140,.7)');
    // green wave
    const wt = t - 2.7;
    if (wt > 0) for (let i = 0; i < 3; i++) {
      const r = (wt - i * .35) * 1000; if (r <= 0) continue; const a = clamp(1 - r / 2400);
      c.save(); c.globalCompositeOperation = 'lighter'; c.lineWidth = 26 - i * 6; c.strokeStyle = `rgba(60,255,160,${.7 * a})`; c.beginPath(); c.arc(PH[0], PH[1], r, 0, 7); c.stroke();
      c.fillStyle = rg(c, PH[0], PH[1], r * .6, r, [[0, 'rgba(0,200,110,0)'], [1, `rgba(0,220,120,${.22 * a})`]]); c.beginPath(); c.arc(PH[0], PH[1], r, 0, 7); c.fill(); c.restore();
    }
    // floating dust
    particles(c, t, { n: 50, seed: 3, col: '#FFD9A0', speed: 22, size: 4, area: [0, 300, W, 1500], alpha: .5 });
    c.restore();
    return PH;
  }
  return function (c, t) {
    const k = E.io(prog(t, 4.3, 7));
    c.save();
    const z = Math.exp(lerp(0, Math.log(30), k)), kk = E.out(k), sx = lerp(PH_X(), 540, kk), sy = lerp(PH_Y(), 960, kk), fx = PH_X() - (sx - 540) / z, fy = PH_Y() - (sy - 960) / z;
    c.translate(540, 960); c.scale(z, z); c.translate(-fx, -fy);
    // pre-roll push-in on intro
    draw(c, t);
    c.restore();
    // end flood into green phone screen
    const fl = prog(t, 6.2, 6.9); if (fl > 0) { c.fillStyle = `rgba(8,150,80,${E.io(fl)})`; c.fillRect(0, 0, W, H); }
    // flash on open
    const f0 = 1 - prog(t, 0, .5); if (f0 > 0) { c.fillStyle = `rgba(255,240,210,${f0 * .8})`; c.fillRect(0, 0, W, H); }
    caption(c, ['Финансы меняют', 'наш мир'], 420, t - 1.2, { size: 78, out: 3.9, pill: true });
    vignette(c, .35);
  };
  function PH_X() { return 411; } function PH_Y() { return 1433 + 0; }
})();

/* ====================== SCENE 2 — HISTORY, 1923 (7–15s → local 0–8) ====================== */
function oldBank(c, cx, base, pal, t = 0) {
  const w = 800; c.save(); c.translate(cx, base);
  const { stone, shade, roof, door, glass } = pal;
  c.fillStyle = shade; c.fillRect(-w / 2 - 50, -26, w + 100, 26); c.fillStyle = stone; c.fillRect(-w / 2 - 28, -52, w + 56, 26);
  c.fillStyle = stone; c.fillRect(-w / 2, -470, w, 420);
  c.fillStyle = shade; c.fillRect(-w / 2, -470, w, 22); c.fillRect(-w / 2, -498, w, 28);
  c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(-w / 2, -448, w, 396);
  // pediment
  c.fillStyle = stone; c.beginPath(); c.moveTo(-w / 2 - 20, -498); c.lineTo(0, -640); c.lineTo(w / 2 + 20, -498); c.closePath(); c.fill();
  c.fillStyle = shade; c.beginPath(); c.moveTo(-w / 2 + 50, -512); c.lineTo(0, -616); c.lineTo(w / 2 - 50, -512); c.closePath(); c.fill();
  c.fillStyle = stone; c.beginPath(); c.arc(0, -548, 34, 0, 7); c.fill(); c.strokeStyle = shade; c.lineWidth = 5; c.stroke();
  // sign band
  c.fillStyle = roof; rr(c, -w / 2 + 60, -480, w - 120, 40, 6); c.fill();
  txt(c, 'СБЕРЕГАТЕЛЬНАЯ КАССА', 0, -460, { size: 26, weight: 700, color: '#F3E7C8', shadow: false, ls: 3, maxW: 560 });
  // columns
  for (let i = 0; i < 6; i++) {
    const x = -w / 2 + 70 + i * ((w - 140) / 5); c.fillStyle = lg(c, x - 22, 0, x + 22, 0, [[0, shade], [.4, '#F6EBD0'], [1, shade]]); c.fillRect(x - 20, -430, 40, 380);
    c.fillStyle = stone; c.fillRect(x - 28, -440, 56, 14); c.fillRect(x - 28, -62, 56, 12);
  }
  // door + windows
  c.fillStyle = door; rr(c, -62, -250, 124, 198, 10); c.fill(); c.beginPath(); c.arc(0, -250, 62, Math.PI, 0); c.fill();
  c.fillStyle = 'rgba(255,220,140,.35)'; rr(c, -48, -236, 42, 178, 6); c.fill(); rr(c, 6, -236, 42, 178, 6); c.fill();
  for (const sx of [-1, 1]) for (const k of [0, 1]) { const x = sx * (k ? 270 : 170) - 34; c.fillStyle = glass; rr(c, x, -330, 68, 130, 8); c.fill(); c.strokeStyle = shade; c.lineWidth = 5; c.stroke(); c.beginPath(); c.moveTo(x + 34, -330); c.lineTo(x + 34, -200); c.moveTo(x, -265); c.lineTo(x + 68, -265); c.stroke(); }
  c.restore();
}
function sepiaTone(c, a) {
  if (a <= 0) return;
  c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'saturation'; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'multiply'; c.fillStyle = '#E8D2A6'; c.fillRect(0, 0, W, H); c.restore();
}
const S2 = (() => {
  const folk = [
    { x0: -120, dir: 1, d: .2, v: 190, o: { shirt: '#5A4636', pants: '#2B2B2B', coat: '#4B3B2E', hat: 'flat', hatCol: '#3B2F26', skin: SKINS[0], hair: '#2A2118' } },
    { x0: 1200, dir: -1, d: .6, v: 170, o: { shirt: '#8A6A55', dress: '#6B4A3A', hairStyle: 'scarf', scarf: '#B58A5A', skin: SKINS[1], hair: '#2A1B14' } },
    { x0: -240, dir: 1, d: 1.1, v: 160, o: { shirt: '#6A5848', pants: '#33302B', coat: '#554434', hat: 'kalpak', skin: SKINS[2], hair: '#2A2118', beard: '#D8D2C4' } },
    { x0: 1320, dir: -1, d: 1.5, v: 200, o: { shirt: '#7A6048', pants: '#2F2A24', coat: '#5A4A38', hat: 'flat', hatCol: '#2A2420', skin: SKINS[1], hair: '#2A2118' } },
    { x0: -340, dir: 1, d: 2.1, v: 150, o: { shirt: '#9A7A5A', dress: '#7A5A44', hairStyle: 'long', skin: SKINS[0], hair: '#3A2418' } },
    { x0: 1440, dir: -1, d: 2.6, v: 175, o: { shirt: '#5E4F40', pants: '#2A2A2A', coat: '#4A3B2F', hat: 'cap', hatCol: '#3A322A', skin: SKINS[2], hair: '#2A2118' } }
  ];
  const years = [1923, 1941, 1965, 1991, 2008, 2026];
  function page(c, y, x, yy, w, h, green) {
    c.fillStyle = '#FBF7EC'; rr(c, x, yy, w, h, 14); c.fill();
    c.fillStyle = green ? PAL.green : '#A6402F'; c.save(); rr(c, x, yy, w, 62, 14); c.clip(); c.fillRect(x, yy, w, 62); c.restore();
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(x + 60, yy + 31, 8, 0, 7); c.arc(x + w - 60, yy + 31, 8, 0, 7); c.fill();
    txt(c, String(y), x + w / 2, yy + h / 2 + 34, { size: 128, weight: 900, color: green ? PAL.dark : '#3B2F26', shadow: false, maxW: w - 40 });
    c.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 3; i++) c.fillRect(x + 40, yy + h - 46 + i * 0, w - 80, 3);
  }
  return function (c, t) {
    const sep = 1 - E.io(prog(t, 5.0, 7.0));
    // sky
    c.fillStyle = lg(c, 0, 0, 0, 1500, [[0, '#7FA9C9'], [.5, '#CFE3E8'], [1, '#F6E9C8']]); c.fillRect(0, 0, W, 1500);
    // far old town silhouettes
    const r = rng(9); c.fillStyle = '#B9AE98'; for (let i = 0; i < 9; i++) { const w = 90 + r() * 90, h = 160 + r() * 200; c.fillRect(i * 125 - 20, 1330 - h, w, h); c.beginPath(); c.moveTo(i * 125 - 24, 1330 - h); c.lineTo(i * 125 + w / 2 - 20, 1330 - h - 40); c.lineTo(i * 125 + w + 4, 1330 - h); c.fill(); }
    // street
    c.fillStyle = lg(c, 0, 1500, 0, 1920, [[0, '#B8A584'], [1, '#8E7C5E']]); c.fillRect(0, 1500, W, 420);
    c.strokeStyle = 'rgba(60,40,20,.18)'; c.lineWidth = 3; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(0, 1520 + i * 56); c.lineTo(W, 1520 + i * 56); c.stroke(); }
    const rc = rng(4); for (let i = 0; i < 160; i++) { c.fillStyle = 'rgba(70,50,30,.12)'; c.beginPath(); c.ellipse(rc() * W, 1530 + rc() * 380, 14 + rc() * 12, 6, 0, 0, 7); c.fill(); }
    lampPost(c, 100, 1560, 1.5, '#3A3028'); lampPost(c, 980, 1560, -1.5, '#3A3028');
    const zoom = 1 + .05 * prog(t, 0, 8); c.save(); c.translate(540, 1500); c.scale(zoom, zoom); c.translate(-540, -1500);
    oldBank(c, 540, 1560, { stone: '#D8C7A0', shade: '#B09A72', roof: '#5A3E2B', door: '#4A3020', glass: '#8DB1C0' });
    c.restore();
    // folk
    folk.forEach(f => {
      const tt = t - f.d; if (tt < 0) return; const doorX = 540 + (f.dir > 0 ? -22 : 22) * (1 + (f.d % 2)); const total = Math.abs(doorX - f.x0) / f.v;
      const x = f.x0 + f.dir * Math.min(tt, total) * f.v, enter = prog(tt, total, total + .8);
      const y = lerp(1760 - (f.d % 3) * 30, 1570, E.io(enter)), s = lerp(1.25, .85, enter);
      c.save(); c.globalAlpha = 1 - clamp((enter - .6) / .4);
      person(c, x, y, { ...f.o, s, flip: f.dir < 0, ph: tt < total ? tt * 6.2 : 0, amp: tt < total ? 1 : 0, t, mood: .9 }); c.restore();
    });
    // calendar
    const cal = E.back(prog(t, 3.7, 4.3));
    if (cal > 0) {
      c.save(); c.translate(540, 690); c.scale(cal, cal); c.rotate((1 - cal) * -.2);
      c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 40; c.shadowOffsetY = 18; c.fillStyle = '#2E2A26'; rr(c, -208, -190, 416, 380, 22); c.fill(); c.shadowColor = 'transparent';
      const bx = -190, by = -170, bw = 380, bh = 340;
      // flips
      const f0 = 4.4, fd = .5; let idx = clamp(Math.floor((t - f0) / fd), -1, 4);
      const base = Math.min(5, idx + 1 + (((t - f0) % fd) >= 0 && t >= f0 ? 0 : 0));
      const cur = t < f0 ? 0 : Math.min(5, Math.floor((t - f0) / fd) + 1);
      page(c, years[cur], bx, by, bw, bh, cur === 5);
      if (t >= f0 && cur <= 5 && Math.floor((t - f0) / fd) < 5) {
        const p = ((t - f0) % fd) / fd; const old = cur - 1; if (old >= 0) {
          c.save(); c.beginPath(); c.rect(bx - 20, by - 20, bw + 40, bh + 40); c.clip();
          c.translate(0, by); c.scale(1, 1 - E.in(p)); c.translate(0, -by); page(c, years[old], bx, by, bw, bh, false);
          c.fillStyle = `rgba(0,0,0,${p * .35})`; c.fillRect(bx, by, bw, bh); c.restore();
        }
      }
      c.restore();
    }
    // tone
    sepiaTone(c, sep);
    // grain + vignette
    if (sep > .02) {
      const g = rng(Math.floor(t * 24) + 77); c.save(); c.globalAlpha = .22 * sep;
      for (let i = 0; i < 380; i++) { c.fillStyle = g() > .5 ? '#fff' : '#000'; c.fillRect(g() * W, g() * H, 2 + g() * 2, 2 + g() * 2); }
      if (g() > .8) { c.fillStyle = '#fff'; c.fillRect(g() * W, 0, 2, H); } c.restore();
      c.save(); c.globalAlpha = sep; vignette(c, .6); c.restore();
    }
    glow(c, 540, 1000, 600, 'rgba(255,230,160,.15)');
    caption(c, ['История Halyk Bank', 'начинается в 1923 году'], 320, t - .3, { size: 60, out: 7.3 });
  };
})();

/* ====================== SCENE 3 — EVOLUTION (15–23s → local 0–8) ====================== */
function modernBank(c, cx, base, t = 0) {
  c.save(); c.translate(cx, base);
  // podium
  c.fillStyle = lg(c, -380, -260, 380, 0, [[0, '#BFEBD5'], [1, '#2A8A63']]); c.fillRect(-380, -260, 760, 260);
  c.fillStyle = PAL.green; c.fillRect(-380, -270, 760, 14);
  c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 3; for (let i = 1; i < 9; i++) { c.beginPath(); c.moveTo(-380 + i * 84.4, -256); c.lineTo(-380 + i * 84.4, 0); c.stroke(); }
  // tower
  c.fillStyle = lg(c, -190, -980, 210, -260, [[0, '#E4FBEF'], [.5, '#6FCFA0'], [1, '#14724E']]); c.fillRect(-190, -980, 400, 720);
  c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 3;
  for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(-190 + i * 50, -980); c.lineTo(-190 + i * 50, -260); c.stroke(); }
  for (let i = 1; i < 18; i++) { c.beginPath(); c.moveTo(-190, -980 + i * 40); c.lineTo(210, -980 + i * 40); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(-190, -980); c.lineTo(-60, -980); c.lineTo(-190, -640); c.fill(); c.beginPath(); c.moveTo(60, -980); c.lineTo(210, -980); c.lineTo(-100, -260); c.lineTo(-190, -260); c.fill();
  c.fillStyle = PAL.green; c.fillRect(150, -980, 14, 720); glow(c, 157, -620, 220, 'rgba(0,255,140,.35)');
  c.fillStyle = '#0A3B2A'; c.fillRect(-190, -992, 400, 14); c.fillRect(8, -1060, 6, 70);
  c.restore();
}
const S3 = (() => {
  const items = ['doc', 'counter', 'card', 'pc', 'phone'], labels = ['Документы', 'Кассы', 'Карты', 'Компьютеры', 'Смартфоны'];
  function item(c, k, x, y, s, t) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (k === 'doc') {
      for (let i = 2; i >= 0; i--) { c.save(); c.rotate((i - 1) * .12 + Math.sin(t * 1.2 + i) * .02); c.translate(i * 14 - 14, i * 6); c.fillStyle = i === 0 ? '#FFF8E6' : '#EBDDB8'; c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 24; rr(c, -120, -160, 240, 320, 12); c.fill(); c.shadowColor = 'transparent';
        if (i === 0) { c.fillStyle = '#5B4B38'; for (let j = 0; j < 7; j++) rr(c, -88, -118 + j * 26, j % 3 === 2 ? 110 : 176, 8, 4), c.fill(); c.strokeStyle = 'rgba(0,166,81,.85)'; c.lineWidth = 7; c.beginPath(); c.arc(50, 80, 38, 0, 7); c.stroke(); c.beginPath(); c.arc(50, 80, 26, 0, 7); c.lineWidth = 3; c.stroke(); } c.restore(); }
    } else if (k === 'counter') {
      c.fillStyle = '#6A4A32'; rr(c, -200, -170, 400, 330, 16); c.fill(); c.fillStyle = '#E9D9B5'; rr(c, -170, -140, 340, 190, 10); c.fill();
      c.fillStyle = 'rgba(160,210,225,.5)'; rr(c, -150, -120, 300, 150, 8); c.fill();
      person(c, 0, 20, { s: .52, shirt: '#8A6A55', pants: '#333', skin: SKINS[0], hair: '#2A1B14', tie: '#9A3B2E', t, mood: 1 });
      c.fillStyle = '#4A3222'; rr(c, -220, 40, 440, 120, 12); c.fill(); c.fillStyle = '#8A6240'; rr(c, -220, 30, 440, 24, 10); c.fill();
      c.fillStyle = PAL.gold; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(-90 + i * 26, 22, 18, 7, 0, 0, 7); c.fill(); }
    } else if (k === 'card') {
      c.rotate(-.18 + Math.sin(t * 1.4) * .03); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 40; c.shadowOffsetY = 20;
      c.fillStyle = lg(c, -190, -120, 190, 120, [[0, '#26D283'], [1, '#00793B']]); rr(c, -190, -120, 380, 240, 26); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = 'rgba(255,255,255,.16)'; c.beginPath(); c.arc(150, -40, 110, 0, 7); c.fill(); c.beginPath(); c.arc(90, -40, 110, 0, 7); c.fill();
      c.fillStyle = '#FFE3A1'; rr(c, -150, -50, 70, 54, 10); c.fill(); c.strokeStyle = 'rgba(160,110,20,.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-150, -23); c.lineTo(-80, -23); c.moveTo(-115, -50); c.lineTo(-115, 4); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 4; i++) rr(c, -150 + i * 62, 60, 46, 12, 6), c.fill();
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 6; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(130, -76, 10 + i * 12, -.9, .9); c.stroke(); }
    } else if (k === 'pc') {
      c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 30; c.shadowOffsetY = 16; c.fillStyle = '#1B262B'; rr(c, -210, -170, 420, 270, 18); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = lg(c, 0, -156, 0, 86, [[0, '#0E7A48'], [1, '#05301F']]); rr(c, -196, -156, 392, 242, 10); c.fill();
      for (let i = 0; i < 6; i++) { const h = (40 + 100 * (.5 + .5 * Math.sin(t * 1.6 + i * 1.1))) ; c.fillStyle = i === 5 ? PAL.light : 'rgba(255,255,255,.6)'; rr(c, -160 + i * 56, 66 - h, 34, h, 6); c.fill(); }
      c.fillStyle = '#2A3A40'; c.fillRect(-26, 100, 52, 50); rr(c, -90, 146, 180, 18, 9); c.fill(); c.fillStyle = '#C9D4D7'; rr(c, -170, 170, 340, 40, 12); c.fill();
    } else if (k === 'phone') {
      phoneBody(c, 0, 0, 230, 470, { on: 1, t });
    }
    c.restore();
  }
  return function (c, t) {
    const night = E.io(prog(t, 3.0, 4.2));
    c.fillStyle = lg(c, 0, 0, 0, H, [[0, lerpCol([207, 232, 226], [15, 90, 60], night)], [1, lerpCol([246, 236, 214], [6, 36, 26], night)]]); c.fillRect(0, 0, W, H);
    if (night > 0) { c.save(); c.globalAlpha = night; greenBackdrop(c, t); c.restore(); }
    // clouds
    c.fillStyle = `rgba(255,255,255,${.55 * (1 - night)})`; for (let i = 0; i < 4; i++) { const x = ((i * 380 + t * 20) % 1500) - 250; rr(c, x, 560 + i * 120, 280, 40, 20); c.fill(); rr(c, x + 50, 536 + i * 120, 160, 40, 20); c.fill(); }
    // building morph
    const bk = 1 - E.in(prog(t, 3.0, 4.0));
    if (bk > .01) {
      c.save(); c.globalAlpha = bk; c.translate(540, 1500); const sc = lerp(.3, 1, bk); c.scale(sc, sc); c.translate(-540, -1500);
      const scan = E.io(prog(t, .5, 3.0)); const sy = 1500 - 1000 * scan;
      c.fillStyle = lg(c, 0, 1500, 0, 1920, [[0, '#9DB59A'], [1, '#6F8F78']]); c.fillRect(-200, 1500, W + 400, 700);
      c.save(); c.beginPath(); c.rect(0, sy, W, 2000); c.clip(); modernBank(c, 540, 1500, t); c.restore();
      c.save(); c.beginPath(); c.rect(0, 0, W, sy); c.clip(); oldBank(c, 540, 1500, { stone: '#D8C7A0', shade: '#B09A72', roof: '#5A3E2B', door: '#4A3020', glass: '#8DB1C0' }); c.restore();
      if (scan > 0 && scan < 1) {
        c.fillStyle = lg(c, 0, sy - 30, 0, sy + 30, [[0, 'rgba(0,255,150,0)'], [.5, 'rgba(160,255,210,.95)'], [1, 'rgba(0,255,150,0)']]); c.fillRect(0, sy - 30, W, 60);
        const r = rng(3); for (let i = 0; i < 40; i++) { const x = 150 + r() * 780, ph = r() * 5; glow(c, x, sy - ((t * 120 + ph * 60) % 120), 18, 'rgba(120,255,190,.9)'); }
      }
      c.restore();
    }
    // evolution stage
    const st = prog(t, 3.3, 3.9);
    if (st > 0) {
      c.save(); c.globalAlpha = st;
      const step = clamp((t - 3.7) / .8, 0, 4.999), cur = Math.floor(step), fr = step - cur;
      // medallion
      c.fillStyle = 'rgba(255,255,255,.07)'; c.beginPath(); c.arc(540, 930, 400 * E.back(st), 0, 7); c.fill();
      c.lineWidth = 3; c.strokeStyle = 'rgba(140,240,181,.35)'; c.beginPath(); c.arc(540, 930, 400 * E.back(st), 0, 7); c.stroke();
      c.save(); c.translate(540, 930); c.rotate(t * .4); c.setLineDash([6, 22]); c.lineWidth = 6; c.strokeStyle = PAL.light; c.beginPath(); c.arc(0, 0, 440, 0, 7); c.stroke(); c.restore();
      glow(c, 540, 930, 520, 'rgba(0,200,110,.3)');
      const sw = fr > .6 && cur < 4 ? E.io((fr - .6) / .4) : 0; // outgoing
      const showIdx = cur; const inK = E.back(clamp(fr / .45));
      const prev = cur - 1;
      if (prev >= 0 && fr < .35) { const o = fr / .35; c.save(); c.globalAlpha = 1 - o; item(c, items[prev], 540 - o * 120, 930, 1.35 * (1 - o * .5), t); c.restore(); }
      c.save(); c.globalAlpha = clamp(fr / .25 + (cur === 0 ? 1 : 0)); item(c, items[showIdx], 540, 930 + (1 - inK) * 60, 1.35 * (cur === 0 ? E.back(prog(t, 3.5, 4.1)) : inK), t); c.restore();
      // ring pulse on swap
      if (cur > 0 && fr < .5) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(120,255,190,${.8 * (1 - fr * 2)})`; c.lineWidth = 12; c.beginPath(); c.arc(540, 930, 120 + fr * 2 * 620, 0, 7); c.stroke(); c.restore(); }
      // timeline
      const ty = 1560; c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,.2)'; c.lineWidth = 8; c.beginPath(); c.moveTo(130, ty); c.lineTo(950, ty); c.stroke();
      c.strokeStyle = PAL.light; c.beginPath(); c.moveTo(130, ty); c.lineTo(130 + 820 * (step / 4), ty); c.stroke();
      items.forEach((k, i) => { const x = 130 + i * 205, on = step >= i - .001; c.fillStyle = on ? PAL.green2 : 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(x, ty, on ? 26 : 16, 0, 7); c.fill(); if (on) { icon(c, 'check', x, ty, 14, '#fff'); } txt(c, labels[i], x, ty + 62, { size: 27, weight: 700, alpha: on ? 1 : .5, maxW: 190, shadow: false }); });
      c.restore();
    }
    caption(c, ['Более 100 лет', 'развития'], 320, t - .35, { size: 70, out: 7.4 });
    // ending bloom to phone
    const eb = prog(t, 7.2, 8); if (eb > 0) { glow(c, 540, 960, 900 * eb, 'rgba(120,255,190,.7)'); }
  };
})();
function lerpCol(a, b, k) { return `rgb(${Math.round(lerp(a[0], b[0], k))},${Math.round(lerp(a[1], b[1], k))},${Math.round(lerp(a[2], b[2], k))})`; }
