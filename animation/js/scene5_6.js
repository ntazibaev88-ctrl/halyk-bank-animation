// Chapter 5 — Білім мен ғылым, 64–80 s: Baikonur launch, then knowledge & technology.
const Scene5 = (() => {
  const buf = makeBuffer();
  const stars = makeStars(55, 420, H * 1.6);
  const smoke = Array.from({ length: 70 }, (_, i) => ({ dir: hash(i) < 0.5 ? -1 : 1, sp: 60 + hash(i + 1) * 260, r: 40 + hash(i + 2) * 90, d: hash(i + 3) * 1.6, dy: hash(i + 4) * 60 }));
  const GROUND = 800;

  function rocket(c, x, y, s) {                      // y = base of the core stage
    c.save(); c.translate(x, y); c.scale(s, s);
    const body = c.createLinearGradient(-20, 0, 20, 0);
    body.addColorStop(0, '#9aa4b4'); body.addColorStop(0.45, '#f4f6f8'); body.addColorStop(1, '#8a94a6');
    c.fillStyle = body;
    c.fillRect(-15, -250, 30, 250);
    c.beginPath(); c.moveTo(-18, -250); c.lineTo(-18, -300); c.quadraticCurveTo(0, -350, 18, -300); c.lineTo(18, -250); c.fill();
    for (const sx of [-1, 1]) {                       // conical strap-on boosters
      c.beginPath(); c.moveTo(sx * 15, -120); c.quadraticCurveTo(sx * 30, -60, sx * 34, 0); c.lineTo(sx * 15, 0); c.fill();
    }
    c.fillStyle = '#d8573a'; c.fillRect(-15, -232, 30, 8);
    c.fillStyle = '#5a6476'; c.fillRect(-15, -150, 30, 4);
    c.restore();
  }

  function launch(c, t, u) {
    const lift = Math.max(0, t - 66.0), alt = 0.5 * 150 * lift * lift;
    const cam = Math.max(0, alt - 260) * 0.75;
    sky(c, [[0, '#040a1c'], [0.55, '#0b1c3c'], [0.8, '#1d3a5a'], [1, '#2a4a62']]);
    c.save(); c.translate(0, cam * 0.25);
    drawStars(c, stars, t, 0.9);
    c.restore();
    c.save(); c.translate(0, cam);
    const ig = smooth(64.9, 65.6, t), fx = W / 2, fy = GROUND - alt;
    glow(c, fx, Math.min(fy + 80, GROUND), 1100, '#ff9a40', 0.5 * ig);
    // ground & launch pad
    c.fillStyle = '#0c1220'; c.fillRect(-100, GROUND, W + 200, 900);
    c.fillStyle = 'rgba(255,170,90,' + (0.3 * ig) + ')'; c.fillRect(-100, GROUND, W + 200, 12);
    c.fillStyle = '#0a0e18'; c.fillRect(fx - 160, GROUND - 30, 320, 30);
    // service towers fold away before lift-off
    const open = easeOut(inv(65.2, 66.6, t));
    c.strokeStyle = '#141c2c'; c.lineWidth = 8;
    for (const sx of [-1, 1]) {
      c.save(); c.translate(fx + sx * 110, GROUND - 30); c.rotate(sx * open * 0.45);
      c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -300); c.stroke();
      c.lineWidth = 3; for (let k = 0; k < 10; k++) { c.beginPath(); c.moveTo(-10, -k * 30); c.lineTo(10, -k * 30 - 30); c.stroke(); }
      c.lineWidth = 8;
      c.restore();
    }
    // exhaust plume
    if (ig > 0) {
      const len = 120 + 300 * smooth(65.6, 67.5, t) + 40 * Math.sin(t * 40);
      const pg = c.createLinearGradient(0, fy, 0, fy + len);
      pg.addColorStop(0, 'rgba(255,255,240,1)'); pg.addColorStop(0.3, 'rgba(255,214,120,0.95)'); pg.addColorStop(1, 'rgba(255,120,40,0)');
      c.fillStyle = pg; c.globalAlpha = ig;
      c.beginPath(); c.moveTo(fx - 30, fy); c.quadraticCurveTo(fx - 46, fy + len * 0.4, fx, fy + len); c.quadraticCurveTo(fx + 46, fy + len * 0.4, fx + 30, fy); c.fill();
      c.globalAlpha = 1;
      glow(c, fx, fy + 40, 260, '#fff0c0', 0.9 * ig);
    }
    // smoke billowing out from the pad
    for (const p of smoke) {
      const age = Math.max(0, t - 65.2 - p.d * 0.6);
      if (age <= 0) continue;
      const k = 1 - Math.exp(-age * 0.7);
      const x = fx + p.dir * p.sp * 3.2 * k, y = GROUND - 20 - p.dy - age * 14;
      const r = p.r * (0.4 + k * 1.6);
      const lit = Math.exp(-Math.abs(x - fx) / 500) * (1 - smooth(67, 71, t) * 0.6);
      cloud(c, x, y, r, r * 0.8, mix('#4a5468', '#ffb070', lit), 0.75);
    }
    // vapour trail behind the climbing rocket
    if (lift > 0) {
      const tg = c.createLinearGradient(0, fy, 0, GROUND);
      tg.addColorStop(0, 'rgba(255,220,170,0.55)'); tg.addColorStop(1, 'rgba(160,170,190,0.15)');
      c.fillStyle = tg; c.beginPath(); c.moveTo(fx - 8, fy + 60); c.lineTo(fx - 40, GROUND); c.lineTo(fx + 40, GROUND); c.lineTo(fx + 8, fy + 60); c.fill();
    }
    rocket(c, fx, fy, 1.35);
    c.restore();
    const la = smooth(65.4, 66.4, t) * (1 - smooth(69.4, 70.4, t));
    if (la > 0) {
      c.save(); c.globalAlpha = la * 0.9; c.fillStyle = rgba(P.cream); c.font = '500 26px "Montserrat"'; c.letterSpacing = '10px';
      c.textAlign = 'center'; c.fillText('БАЙҚОҢЫР', W / 2 + 330, 470); c.restore();
      c.save(); c.globalAlpha = la; c.strokeStyle = rgba(P.gold, 0.8); c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(W / 2 + 220, 486); c.lineTo(W / 2 + 440, 486); c.stroke(); c.restore();
    }
  }

  function globe(c, x, y, r, t, a) {
    c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'lighter';
    c.strokeStyle = rgba(P.teal, 0.35); c.lineWidth = 1.5;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    for (let k = 0; k < 8; k++) {
      const ang = (k / 8) * Math.PI + t * 0.25, rx = Math.abs(Math.cos(ang)) * r;
      c.beginPath(); c.ellipse(x, y, rx, r, 0, 0, TAU); c.stroke();
    }
    for (let k = 1; k < 6; k++) { const yy = -r + (k * 2 * r) / 6, rr = Math.sqrt(r * r - yy * yy); c.beginPath(); c.ellipse(x, y + yy, rr, rr * 0.18, 0, 0, TAU); c.stroke(); }
    const nodes = [];
    for (let i = 0; i < 26; i++) {
      const lon = hash(i) * TAU + t * 0.25, lat = (hash(i + 9) - 0.5) * 2.6;
      const z = Math.cos(lat) * Math.cos(lon);
      nodes.push([x + Math.cos(lat) * Math.sin(lon) * r, y + Math.sin(lat) * r * 0.95, z]);
    }
    for (let i = 0; i < nodes.length; i++) {
      const [nx, ny, nz] = nodes[i];
      if (nz < -0.2) continue;
      const j = (i * 7 + 3) % nodes.length, [mx, my] = nodes[j];
      c.strokeStyle = rgba(P.goldL, 0.35); c.beginPath(); c.moveTo(nx, ny); c.quadraticCurveTo((nx + mx) / 2, (ny + my) / 2 - 60, mx, my); c.stroke();
      c.fillStyle = rgba(P.goldL, 0.9); c.beginPath(); c.arc(nx, ny, 3.5, 0, TAU); c.fill();
    }
    for (let k = 0; k < 3; k++) {                    // orbit rings with travelling sparks
      c.save(); c.translate(x, y); c.rotate(k * 1.05 + 0.3);
      c.strokeStyle = rgba(P.blue, 0.35); c.beginPath(); c.ellipse(0, 0, r * 1.45, r * 0.42, 0, 0, TAU); c.stroke();
      const e = t * (0.9 + k * 0.3) + k * 2;
      glow(c, Math.cos(e) * r * 1.45, Math.sin(e) * r * 0.42, 26, P.teal, 0.9);
      c.restore();
    }
    c.restore();
  }

  const students = Array.from({ length: 9 }, (_, i) => ({ x: 560 + i * 100 + (hash(i) - 0.5) * 30, h: 190 + hash(i + 2) * 30, d: hash(i + 5) * 0.5, hair: hash(i + 7) < 0.5 }));

  function campus(c, t, u) {
    sky(c, [[0, '#071630'], [0.5, '#123a66'], [0.75, '#2a6a8c'], [1, '#4a8aa0']]);
    glow(c, W / 2, 900, 1100, '#7ad0e0', 0.25);
    drawStars(c, stars, t, 0.5 * (1 - u));
    c.save(); const z = 1.05 - 0.05 * u; c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    globe(c, W / 2, 330, 210, t, smooth(71.2, 72.6, t));
    // modern university building with ornament frieze
    const by = 640;
    c.fillStyle = '#0d2238'; c.fillRect(260, by, 1400, 300);
    c.fillStyle = '#122e4a'; c.fillRect(260, by - 20, 1400, 24);
    c.strokeStyle = rgba(P.gold, 0.6); c.lineWidth = 0.08;
    for (let k = 0; k < 24; k++) { c.save(); c.translate(300 + k * 58, by - 8); ramHorn(c, 14); c.restore(); }
    for (let k = 0; k < 16; k++) {
      const wx = 300 + k * 84;
      const on = 0.4 + 0.6 * smooth(72 + hash(k) * 3, 73 + hash(k) * 3, t);
      const wg = c.createLinearGradient(0, by + 30, 0, by + 280);
      wg.addColorStop(0, `rgba(140,220,235,${0.55 * on})`); wg.addColorStop(1, `rgba(255,214,150,${0.35 * on})`);
      c.fillStyle = wg; c.fillRect(wx, by + 30, 60, 250);
    }
    // glowing data lines flowing out across the plaza
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 14; k++) {
      const yy = 960 + k * 9, p = (t * 0.5 + hash(k)) % 1;
      c.strokeStyle = rgba(P.teal, 0.12); c.lineWidth = 1; c.beginPath(); c.moveTo(0, yy); c.lineTo(W, yy); c.stroke();
      glow(c, p * W, yy, 40, P.teal, 0.5);
    }
    c.restore();
    c.fillStyle = '#081424'; c.fillRect(-50, 940, W + 100, 200);
    // students — caps fly at the end
    for (const s of students) {
      const cheer = easeOut(inv(76.2 + s.d, 77.2 + s.d, t));
      person(c, s.x, 960, s.h, { armL: lerp(0.15, 2.7, cheer), armR: lerp(-0.15, -2.7, cheer), hat: cheer > 0.6 ? null : 'cap', hair: s.hair, robe: true }, '#050b16');
      if (cheer > 0.6) {
        const ft = t - (76.2 + s.d + 0.6);
        const cx = s.x + Math.sin(s.x) * 60 * ft, cy = 960 - s.h - 30 - 520 * ft + 220 * ft * ft;
        c.save(); c.translate(cx, cy); c.rotate(ft * (3 + hash(s.x) * 4)); c.fillStyle = '#050b16';
        c.beginPath(); c.moveTo(-24, 0); c.lineTo(0, -10); c.lineTo(24, 0); c.lineTo(0, 10); c.fill(); c.restore();
      }
    }
    c.restore();
    motes(c, 57, 60, t, P.teal, 0.5, [0, 0, W, H], 10, 2);
  }

  const list = [{ s: 64, e: 71.6, fn: launch }, { s: 71.6, e: 80.6, fn: campus }];
  return function (ctx, t) { shots(ctx, t, list, buf, 0.6); };
})();

// Chapter 6 — Спорт пен мәдениет, 80–96 s: athletes, the yurt and the dombra.
const Scene6 = (() => {
  const buf = makeBuffer();
  const flag = makeFlagCanvas(600, 300);
  const crowd = Array.from({ length: 600 }, (_, i) => [hash(i) * W, 300 + hash(i + 0.3) * 260, hash(i + 0.7)]);
  const steppe = new Ridge({ seed: 101, base: 760, amp: 60, scale: 600, step: 10, width: W + 800 });
  const mts = new Ridge({ seed: 102, base: 700, amp: 200, scale: 280, step: 6, kind: 'ridged', pow: 1.4 });
  const grass = makeGrass(103, 300, -100, W + 100, 900, 1100, 30, 90);

  function stadium(c, t) {
    sky(c, [[0, '#050a18'], [0.6, '#0e1e3a'], [1, '#18304e']]);
    c.fillStyle = '#0a1426';
    c.beginPath(); c.moveTo(-100, 620); c.quadraticCurveTo(W / 2, 200, W + 100, 620); c.lineTo(W + 100, 700); c.lineTo(-100, 700); c.fill();
    for (const [x, y, k] of crowd) {                  // crowd & camera flashes
      if (y < 620 - 420 * Math.sin((x / W) * Math.PI) * 0.9 + 40) continue;
      const flash = hash(Math.floor(t * 6) + k * 100) > 0.985;
      c.fillStyle = flash ? 'rgba(255,255,255,0.95)' : `rgba(${120 + k * 80 | 0},${130 + k * 60 | 0},170,0.35)`;
      c.fillRect(x, y, flash ? 3 : 2, flash ? 3 : 2);
    }
    for (const lx of [180, 700, 1220, 1740]) {         // floodlights
      c.fillStyle = '#0a1222'; c.fillRect(lx - 4, 120, 8, 500);
      c.fillStyle = '#fffbe8'; c.fillRect(lx - 30, 110, 60, 16);
      c.save(); c.globalCompositeOperation = 'lighter';
      const g = c.createLinearGradient(0, 120, 0, 900); g.addColorStop(0, 'rgba(255,250,220,0.22)'); g.addColorStop(1, 'rgba(255,250,220,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(lx - 30, 120); c.lineTo(lx - 260 + (lx - W / 2) * -0.2, 900); c.lineTo(lx + 260 + (lx - W / 2) * -0.2, 900); c.lineTo(lx + 30, 120); c.fill();
      c.restore();
      glow(c, lx, 118, 120, '#fffbe8', 0.6);
    }
  }

  function race(c, t, u) {
    stadium(c, t);
    c.fillStyle = '#a2412c'; c.fillRect(-100, 700, W + 200, 400);
    c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 3;
    for (let k = 0; k < 7; k++) { const y = 720 + k * k * 9 + k * 30; c.beginPath(); c.moveTo(-100, y); c.lineTo(W + 100, y); c.stroke(); }
    const scroll = (t * 900) % 240;                  // lane markings stream past
    c.lineWidth = 4;
    for (let x = -scroll; x < W + 240; x += 240) { c.beginPath(); c.moveTo(x, 1000); c.lineTo(x + 70, 1000); c.stroke(); }
    const ph = t * 1.55 * TAU, s = Math.sin(ph);
    const rx = lerp(780, 1060, u);
    c.save(); c.globalAlpha = 0.35; c.fillStyle = '#000'; c.beginPath(); c.ellipse(rx, 942, 70, 10, 0, 0, TAU); c.fill(); c.restore();
    person(c, rx, 940 - Math.abs(Math.cos(ph)) * 14, 330, {
      legL: 0.75 * s, legR: -0.75 * s, kneeL: s > 0 ? 0.2 : 1.3, kneeR: s > 0 ? 1.3 : 0.2,
      armL: -0.9 * s + 0.1, armR: 0.9 * s - 0.1, elbowL: -1.3, elbowR: 1.3, lean: 0.14,
    }, '#0a0d14');
    motes(c, 61, 40, t, '#ffffff', 0.4, [0, 0, W, 700], 40, 1.5);
  }

  function podium(c, t, u) {
    stadium(c, t);
    c.fillStyle = '#0c1424'; c.fillRect(-100, 820, W + 200, 400);
    const rise = easeOut(inv(83.2, 84.6, t));
    // flag raised behind the podium
    c.fillStyle = '#c9ced8'; c.fillRect(1287, 160, 6, 640);
    wavingFlag(c, flag, 1293, lerp(560, 190, ease(inv(83.6, 86.4, t))), 330, 165, t, 0.6);
    const tiers = [[760, 200, 150, '2'], [960, 200, 230, '1'], [1160, 200, 110, '3']];
    for (const [x, w, h, n] of tiers) {
      const g = c.createLinearGradient(0, 860 - h, 0, 860);
      g.addColorStop(0, '#e9edf3'); g.addColorStop(1, '#9aa3b4');
      c.fillStyle = g; c.fillRect(x - w / 2, 860 - h, w, h);
      c.fillStyle = '#5a6478'; c.font = '600 54px "Cormorant Garamond"'; c.textAlign = 'center'; c.fillText(n, x, 860 - h + 64);
    }
    person(c, 960, 630, 260, { armL: lerp(0.2, 2.8, rise), armR: lerp(-0.2, -2.8, rise), robe: false }, '#0a0d14');
    const glint = 0.6 + 0.4 * Math.sin(t * 6);
    glow(c, 960, 470, 50, P.goldL, 0.9 * rise * glint);
    c.fillStyle = rgba(P.gold); c.beginPath(); c.arc(960, 470, 13, 0, TAU); c.fill();
    person(c, 760, 710, 230, { armL: 0.6, armR: -0.3 }, '#0a0d14');
    person(c, 1160, 750, 230, { armL: 0.3, armR: -0.6 }, '#0a0d14');
    c.save();                                       // confetti in flag colours
    for (let i = 0; i < 180; i++) {
      const life = ((t - 83.4) * 0.35 + hash(i)) % 1;
      if (t < 83.4) break;
      const x = hash(i + 2) * W + Math.sin(t * 2 + i) * 30, y = -20 + life * (H + 40);
      c.save(); c.translate(x, y); c.rotate(t * 4 + i);
      c.fillStyle = i % 2 ? '#00afca' : '#fec50c'; c.fillRect(-6, -3, 12 * Math.abs(Math.cos(t * 5 + i)), 6); c.restore();
    }
    c.restore();
  }

  function yurt(c, x, y, s, t, warm) {
    c.save(); c.translate(x, y); c.scale(s, s);
    const felt = c.createLinearGradient(-200, 0, 200, 0);
    felt.addColorStop(0, rgba(mix('#c8b894', '#8a6a4a', 0.3))); felt.addColorStop(0.6, '#f4ead4'); felt.addColorStop(1, '#fff3da');
    c.fillStyle = felt;
    c.beginPath(); c.moveTo(-200, 0); c.lineTo(-200, -120); c.quadraticCurveTo(-170, -270, 0, -290); c.quadraticCurveTo(170, -270, 200, -120); c.lineTo(200, 0); c.fill();
    c.fillStyle = '#9e2b25'; c.fillRect(-200, -126, 400, 22);                  // decorative band
    c.strokeStyle = '#f4ead4'; c.lineWidth = 0.12;
    for (let k = 0; k < 11; k++) { c.save(); c.translate(-180 + k * 36, -115); ramHorn(c, 14); c.restore(); }
    c.fillStyle = '#7a3a1a'; c.fillRect(-36, -100, 72, 100);                   // carved door
    c.strokeStyle = '#f2c247'; c.lineWidth = 0.1; c.save(); c.translate(0, -60); ramHorn(c, 24); c.restore();
    c.fillStyle = '#6a5038'; c.beginPath(); c.ellipse(0, -288, 42, 8, 0, 0, TAU); c.fill();   // shanyrak
    c.restore();
    for (let k = 0; k < 6; k++) {                     // smoke from the shanyrak
      const age = (t * 0.22 + k / 6) % 1;
      cloud(c, x + age * 90 * s, y - 300 * s - age * 220, 20 + age * 60, 16 + age * 40, '#e8dcc8', 0.35 * (1 - age));
    }
  }

  function aul(c, t, u) {
    sky(c, [[0, '#355a86'], [0.5, '#e7a874'], [0.7, '#ffd69a'], [1, '#d99a5a']]);
    glow(c, 1500, 560, 700, P.amber, 0.45);
    c.fillStyle = rgba(P.sun); c.beginPath(); c.arc(1500, 560, 50, 0, TAU); c.fill();
    c.save(); const pan = -60 * u; c.translate(pan, 0);
    mts.fillGrad(c, '#f3dcc4', '#9a7a7a', 0.25);
    haze(c, 480, 720, '#ffd2a0', 0.5);
    steppe.fill(c, rgba('#c99a58'));
    yurt(c, 1260, 800, 0.62, t);
    yurt(c, 520, 840, 0.8, t);
    yurt(c, 920, 880, 1.05, t);
    person(c, 1500, 900, 170, { hat: 'kalpak', robe: true, staff: true }, '#2a1a10');
    person(c, 1580, 905, 150, { hat: 'kimeshek', robe: true }, '#2a1a10');
    horse(c, 280, 860, 0.7, 0.15, '#2a1a10');
    c.fillStyle = '#b07a3e'; c.fillRect(-100, 930, W + 200, 200);
    drawGrass(c, grass, t, '#7a5328', '#ffe2a6', 0.7);
    c.restore();
    ornamentFrame(c, 70, 70, W - 140, H - 140, inv(87.2, 89, t), P.goldL, 0.75);
    motes(c, 66, 50, t, P.goldL, 0.5, [0, 300, W, H], 12, 2);
  }

  function dombra(c, t, u) {
    const bg = c.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1100);
    bg.addColorStop(0, '#4a2412'); bg.addColorStop(1, '#120806'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    // slowly turning ornament mandala
    c.save(); c.translate(W / 2 + 120, H / 2); c.rotate(t * 0.05);
    c.strokeStyle = rgba(P.gold, 0.25);
    for (let ring = 0; ring < 3; ring++) {
      const R = 240 + ring * 150, n = 12 + ring * 6;
      c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, R - 50, 0, TAU); c.stroke();
      for (let k = 0; k < n; k++) { c.save(); c.rotate((k / n) * TAU); c.translate(0, -R); c.lineWidth = 2 / (34 + ring * 6); ramHorn(c, 34 + ring * 6); c.restore(); }
    }
    c.restore();
    // sound waves
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 6; k++) {
      const age = (t * 0.6 + k / 6) % 1;
      c.strokeStyle = rgba(P.goldL, 0.35 * (1 - age)); c.lineWidth = 2;
      c.beginPath(); c.arc(840, 640, 160 + age * 700, -1.2, 0.4); c.stroke();
    }
    c.restore();
    // the dombra itself, lying diagonally
    c.save(); c.translate(820, 660); c.rotate(-0.52 + 0.02 * Math.sin(t * 0.7)); c.scale(1.05 + 0.04 * u, 1.05 + 0.04 * u);
    const wood = c.createLinearGradient(0, -130, 0, 130);
    wood.addColorStop(0, '#d48a44'); wood.addColorStop(0.5, '#a65a24'); wood.addColorStop(1, '#5a2a10');
    c.fillStyle = '#3a1a0a'; c.fillRect(140, -24, 760, 48);                   // neck
    c.fillStyle = '#5a2c12'; c.beginPath(); c.moveTo(900, -26); c.lineTo(1010, -34); c.lineTo(1010, 34); c.lineTo(900, 26); c.fill();
    c.fillStyle = '#e8d2a0'; for (const py of [-46, 40]) { c.beginPath(); c.ellipse(960, py, 8, 14, 0, 0, TAU); c.fill(); }
    c.strokeStyle = 'rgba(240,210,150,0.55)'; c.lineWidth = 2;
    for (let k = 0; k < 13; k++) { const fx = 220 + k * 52 - k * k * 1.2; c.beginPath(); c.moveTo(fx, -22); c.lineTo(fx, 22); c.stroke(); }
    c.fillStyle = wood;
    c.beginPath(); c.moveTo(160, -30); c.bezierCurveTo(60, -40, -60, -150, -250, -120); c.bezierCurveTo(-360, -100, -360, 100, -250, 120);
    c.bezierCurveTo(-60, 150, 60, 40, 160, 30); c.closePath(); c.fill();
    c.strokeStyle = rgba(P.goldL, 0.8); c.lineWidth = 0.1;
    for (const [ox, oy, sc, r] of [[-180, 0, 46, Math.PI / 2], [-60, -46, 22, 0.3], [-60, 46, 22, Math.PI - 0.3]]) { c.save(); c.translate(ox, oy); c.rotate(r); ramHorn(c, sc); c.restore(); }
    c.fillStyle = '#2a1206'; c.fillRect(-300, -26, 14, 52);                   // bridge
    // two vibrating strings
    for (const [sy, ph] of [[-9, 0], [9, 1.7]]) {
      const pluck = Math.exp(-((t * 4 + ph) % 1) * 3);
      c.strokeStyle = 'rgba(255,240,210,0.9)'; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(-292, sy);
      for (let x = -292; x <= 950; x += 20) c.lineTo(x, sy + Math.sin(((x + 292) / 1242) * Math.PI) * Math.sin(t * 90 + ph) * 3.5 * pluck);
      c.stroke();
    }
    c.restore();
    glow(c, 600, 740, 400, '#ffb060', 0.25);
    motes(c, 67, 70, t, P.goldL, 0.7, [0, 0, W, H], 16, 2.2);
  }

  const list = [{ s: 80, e: 83.4, fn: race }, { s: 83.4, e: 87.2, fn: podium }, { s: 87.2, e: 91.8, fn: aul }, { s: 91.8, e: 96.6, fn: dombra }];
  return function (ctx, t) { shots(ctx, t, list, buf, 0.5); };
})();
