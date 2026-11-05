/* Almaty — five procedural "cinematic" shots: mountains, Kok Tobe, streets, parks, skyline. */
(function () {
  const { W, H, clamp, lerp, ease, prog, rng, hex, mix, rgb, canvas, gradient, sky, clouds, ridge, skyline, canopy, drawLayer, layerPoint, firs, glow } = KIT;
  const S = {};
  const at = (c, d, oy, extra) => Object.assign({ c, d, oy }, extra || {});

  function init() {
    // ---- shot 1: dawn over the Trans-Ili Alatau ----
    S.s1 = {
      sky: sky(1300, 1920, [[0, '#13254a'], [.3, '#35588a'], [.55, '#d98f86'], [.72, '#ffcf9c'], [1, '#ffe7c4']], { x: 650, y: 1060, r: 760, c0: 'rgba(255,240,205,.95)', c1: 'rgba(255,190,130,.35)' }),
      cl: clouds(2600, 520, 11, { color: [255, 214, 196], alpha: .55, density: .5 }),
      far: ridge({ w: 1500, h: 1050, base: 980, amp: 560, freq: .0042, seed: 21, rock: ['#4b5f8a', '#aebde0'], snowAlt: 330, hazeAmt: .5, haze: [230, 170, 160] }),
      mid: ridge({ w: 1500, h: 1000, base: 940, amp: 420, freq: .0058, seed: 5, rock: ['#233a5a', '#7592b8'], snowAlt: 260, hazeAmt: .28, haze: [120, 130, 170] }),
      hills: ridge({ w: 1500, h: 760, base: 700, amp: 190, freq: .005, seed: 9, rough: 3, rock: ['#0b241c', '#2c6a4a'], hazeAmt: .12, haze: [60, 90, 90], sharp: .3 }),
      firs: firs(1500, 560, 420, 31, '#04100d', 90, 230, 70, '#08201a'),
    };
    // ---- shot 2: Kok Tobe at golden hour ----
    const hill = ridge({ w: 1500, h: 1100, base: 940, amp: 560, freq: .0021, seed: 44, rough: 3, rock: ['#2c2616', '#8a9a48'], hazeAmt: .08, haze: [255, 170, 100], sharp: .15 });
    let ax = 700, ay = 9e9; for (let i = 450; i < 1050; i++) { const y = hill.topAt(i); if (y < ay) { ay = y; ax = i; } }
    S.s2 = {
      sky: sky(1300, 1920, [[0, '#2a2a63'], [.28, '#8a4a7a'], [.5, '#f08a62'], [.7, '#ffc77a'], [1, '#ffe6a8']], { x: 400, y: 1000, r: 800, c0: 'rgba(255,230,160,.95)', c1: 'rgba(255,150,80,.4)' }),
      far: ridge({ w: 1500, h: 900, base: 800, amp: 360, freq: .0045, seed: 61, rock: ['#6b5a86', '#e1b4a4'], snowAlt: 400, hazeAmt: .55, haze: [255, 190, 140] }),
      city: skyline({ w: 1500, h: 600, seed: 8, baseY: 420, minW: 30, maxW: 70, minH: 50, maxH: 190, body: ['#3a2f4c', '#1b1630'], win: ['#ffc870', '#ffa84a'], winDensity: .22 }),
      hill, ax, ay,
      trees: firs(1500, 560, 260, 77, '#0b1a10', 60, 150, 50, '#142a14'),
    };
    // ---- shot 4: park ----
    const r = rng(404);
    const mk = (w, h, n, seed, pal, rmin, rmax, y0, y1) => { const c = canvas(w, h), x = c.getContext('2d'), q = rng(seed);
      for (let i = 0; i < n; i++) { const px = q() * w, py = lerp(y0, y1, q()), rr = lerp(rmin, rmax, q()); canopy(x, px, py, rr, pal, seed * 100 + i); } return c; };
    S.s4 = {
      sky: sky(1300, 1920, [[0, '#4aa8e8'], [.45, '#a8dcf2'], [.72, '#f6efc9'], [1, '#fff4cf']], { x: 820, y: 560, r: 700, c0: 'rgba(255,252,220,1)', c1: 'rgba(255,240,170,.35)' }),
      far: ridge({ w: 1500, h: 900, base: 760, amp: 340, freq: .005, seed: 71, rock: ['#6f8fb7', '#cfe0f0'], snowAlt: 380, hazeAmt: .6, haze: [200, 225, 240] }),
      row: mk(1500, 520, 26, 3, [[36, 90, 50], [70, 140, 70], [150, 200, 90]], 70, 120, 280, 420),
      mid: mk(1600, 900, 22, 4, [[16, 60, 34], [40, 110, 56], [110, 170, 70]], 120, 210, 300, 800),
      near: mk(1900, 1300, 11, 5, [[6, 36, 22], [24, 80, 40], [76, 130, 50]], 230, 380, 300, 1000),
      cl: clouds(2600, 460, 19, { color: [255, 255, 255], alpha: .75, density: .54 }),
    };
    // ---- shot 5: skyline at blue hour ----
    S.s5 = {
      sky: sky(1300, 1920, [[0, '#0a1230'], [.35, '#233c78'], [.6, '#8a68a0'], [.78, '#ffa87a'], [1, '#ffd29c']], { x: 330, y: 1130, r: 700, c0: 'rgba(255,214,150,.9)', c1: 'rgba(255,130,100,.3)' }),
      far: ridge({ w: 1500, h: 1000, base: 920, amp: 600, freq: .004, seed: 91, rock: ['#17234a', '#6279b0'], snowAlt: 360, hazeAmt: .42, haze: [200, 140, 150] }),
      b1: skyline({ w: 1700, h: 900, seed: 15, baseY: 760, minW: 44, maxW: 90, minH: 120, maxH: 420, body: ['#1d2a52', '#0b1330'], win: ['#ffd88a', '#9ad6ff'], winDensity: .3, edge: 'rgba(255,190,140,.35)' }),
      b2: skyline({ w: 1800, h: 1000, seed: 27, baseY: 880, minW: 60, maxW: 120, minH: 200, maxH: 760, body: ['#0e1630', '#050913'], win: ['#ffcf7a', '#8fd0ff'], winDensity: .38, edge: 'rgba(255,170,120,.3)' }),
    };
  }

  // ---------- per-frame dynamic helpers ----------
  function birds(ctx, t, seed, n, y0, spd) { const r = rng(seed); ctx.save(); ctx.strokeStyle = 'rgba(20,20,40,.7)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) { const x = ((r() * 1400 + t * spd * (.7 + r() * .6)) % 1500) - 200, y = y0 + r() * 220 + Math.sin(t * 1.2 + i) * 14, f = Math.sin(t * 9 + i * 2) * 5, s = 9 + r() * 9;
      ctx.beginPath(); ctx.moveTo(x - s, y - f); ctx.quadraticCurveTo(x - s / 2, y - s / 2 + f, x, y); ctx.quadraticCurveTo(x + s / 2, y - s / 2 + f, x + s, y - f); ctx.stroke(); } ctx.restore(); }
  function rays(ctx, t, x, y, a, col) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const ang = -1.2 + i * .34 + Math.sin(t * .4 + i) * .03; const g = ctx.createLinearGradient(x, y, x + Math.cos(ang) * 1800, y - Math.sin(ang) * -1800);
      g.addColorStop(0, rgb(col, a)); g.addColorStop(1, rgb(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang - .05) * 2200, y + Math.sin(ang - .05) * 2200); ctx.lineTo(x + Math.cos(ang + .05) * 2200, y + Math.sin(ang + .05) * 2200); ctx.fill(); } ctx.restore(); }

  // ---------- shot 1 ----------
  function shot1(ctx, t, d) {
    const p = t / d, cam = { x: lerp(-40, 50, ease.io(p)), y: lerp(30, -40, ease.io(p)), z: lerp(0, .2, ease.io(p)) };
    drawLayer(ctx, at(S.s1.sky, 0, 0), cam);
    drawLayer(ctx, at(S.s1.cl, .05, 380, { ox: -400 - t * 22 }), cam);
    drawLayer(ctx, at(S.s1.far, .2, 360), cam);
    drawLayer(ctx, at(S.s1.cl, .15, 760, { ox: -900 + t * 30, a: .55 }), cam);
    drawLayer(ctx, at(S.s1.mid, .42, 640), cam);
    birds(ctx, t, 3, 6, 900, 60);
    drawLayer(ctx, at(S.s1.hills, .7, 1020), cam);
    drawLayer(ctx, at(S.s1.firs, 1, 1430), cam);
    rays(ctx, t, 640 - cam.x * .1, 1100, .05, [255, 220, 160]);
  }
  // ---------- shot 2: Kok Tobe ----------
  function shot2(ctx, t, d) {
    const p = t / d, e = ease.io(p), cam = { x: lerp(120, -80, e), y: lerp(-20, 40, e), z: lerp(.02, .22, e) };
    drawLayer(ctx, at(S.s2.sky, 0, 0), cam);
    drawLayer(ctx, at(S.s2.far, .18, 520), cam);
    const cityL = at(S.s2.city, .38, 1090); drawLayer(ctx, cityL, cam);
    const hillL = at(S.s2.hill, .65, 520); ctx.fillStyle = '#0b1a10'; ctx.fillRect(0, 1500, W, 420); drawLayer(ctx, hillL, cam);
    // tower + cable car on the hill apex
    const [tx, ty, sc] = layerPoint(hillL, cam, S.s2.ax, S.s2.ay + 10);
    ctx.save(); ctx.translate(tx, ty); ctx.scale(sc, sc);
    const mast = 430; ctx.strokeStyle = '#1a1420'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-4, -mast * .8); ctx.moveTo(18, 0); ctx.lineTo(4, -mast * .8); ctx.stroke();
    ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k < 9; k++) { const y = -k * mast * .09, w = lerp(18, 4, k / 9); ctx.moveTo(-w, y); ctx.lineTo(w, y - mast * .045); ctx.moveTo(w, y); ctx.lineTo(-w, y - mast * .045); } ctx.stroke();
    ctx.fillStyle = '#241c2c'; ctx.beginPath(); ctx.ellipse(0, -mast * .62, 34, 14, 0, 0, 7); ctx.fill(); ctx.fillRect(-10, -mast * .66, 20, 18);
    ctx.lineWidth = 5; for (let k = 0; k < 4; k++) { ctx.strokeStyle = k % 2 ? '#e8e0e0' : '#d0332e'; ctx.beginPath(); ctx.moveTo(-2, -mast * (.8 + k * .055)); ctx.lineTo(-2, -mast * (.855 + k * .055)); ctx.stroke(); }
    const blink = .5 + .5 * Math.sin(t * 5); glow(ctx, 0, -mast * 1.03, 36, [255, 60, 50], .5 + .5 * blink); ctx.fillStyle = '#ff5a4a'; ctx.beginPath(); ctx.arc(0, -mast * 1.03, 4, 0, 7); ctx.fill();
    ctx.restore();
    // cable car from lower-left to apex
    const [bx, by] = layerPoint(hillL, cam, 140, S.s2.hill.topAt(140) + 20);
    ctx.save(); ctx.strokeStyle = 'rgba(30,24,30,.9)'; ctx.lineWidth = 2.2 * sc; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx - 12 * sc, ty - 40 * sc); ctx.stroke();
    for (let k = 0; k < 2; k++) { const u = ((t * .11 + k * .5) % 1), x = lerp(bx, tx - 12 * sc, u), y = lerp(by, ty - 40 * sc, u) + 3 * sc; ctx.fillStyle = k ? '#e63f3a' : '#f2c14a'; ctx.beginPath(); ctx.roundRect(x - 14 * sc, y, 28 * sc, 24 * sc, 4 * sc); ctx.fill(); ctx.strokeStyle = '#1b1620'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 9 * sc); ctx.stroke(); }
    ctx.restore();
    drawLayer(ctx, at(S.s2.trees, 1, 1480), cam);
    birds(ctx, t, 8, 5, 700, 40);
    rays(ctx, t, 330 - cam.x * .1, 1050, .05, [255, 200, 130]);
  }
  // ---------- shot 3: street drive ----------
  const bldg = (() => { const r = rng(303), a = []; for (let i = 0; i < 40; i++) a.push({ h: 420 + r() * 1100, depth: 260 + r() * 220, c: r(), win: r(), gap: r() }); return a; })();
  function shot3(ctx, t, d) {
    const hy = 760, f = 2.4, cx = 540 + Math.sin(t * .6) * 24, L = 7200;
    ctx.fillStyle = gradient(ctx, 0, 0, 0, hy + 80, [[0, '#2a2f66'], [.5, '#9b5f8e'], [.85, '#ffb27c'], [1, '#ffd9a0']]); ctx.fillRect(0, 0, W, H);
    glow(ctx, cx, hy, 600, [255, 190, 120], .7);
    // distant mountains
    ctx.fillStyle = 'rgba(60,64,110,.55)'; ctx.beginPath(); ctx.moveTo(0, hy); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, hy - 120 - 90 * Math.abs(Math.sin(x * .006 + 1)) - 40 * Math.sin(x * .021)); ctx.lineTo(W, hy); ctx.fill();
    // road + sidewalks
    const P = (X, Y, z) => [cx + X / z * f, hy + Y / z * f];
    ctx.fillStyle = gradient(ctx, 0, hy, 0, H, [[0, '#4a3b52'], [1, '#161420']]); ctx.fillRect(0, hy, W, H - hy);
    const quad = (p) => { ctx.beginPath(); ctx.moveTo(...p[0]); for (let i = 1; i < p.length; i++) ctx.lineTo(...p[i]); ctx.closePath(); };
    for (const sd of [-1, 1]) { quad([P(sd * 560, 300, 1), P(sd * 900, 300, 1), P(sd * 900, 300, 60), P(sd * 560, 300, 60)]); ctx.fillStyle = '#6a5a6c'; ctx.fill(); }
    const cz = (t * 520);
    // lane dashes
    ctx.fillStyle = 'rgba(255,230,190,.85)'; for (let k = 0; k < 40; k++) { const z0 = ((k * 150 - cz) % 6000 + 6000) % 6000 / 100 + .9, z1 = z0 + .75; if (z1 > 60) continue; quad([P(-9, 300, z0), P(9, 300, z0), P(9, 300, z1), P(-9, 300, z1)]); ctx.fill(); }
    // buildings both sides, far -> near
    const items = []; for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 28; i++) { const b = bldg[(i + (side > 0 ? 11 : 0)) % 40]; const zn = (((i * 260 - cz * 1.0) % 7280) + 7280) % 7280; items.push({ side, b, z: zn / 100 + 1.0, dz: 2.35 + b.gap * .6, i }); }
    items.sort((a, b) => b.z - a.z);
    for (const it of items) { const { side, b } = it, z0 = it.z, z1 = it.z + it.dz; if (z0 > 58) continue; const X = side * (640 + b.depth * .3);
      const a = P(X, 300, z0), a2 = P(X, 300, z1), t0 = P(X, 300 - b.h, z0), t1 = P(X, 300 - b.h, z1);
      const fog = clamp(z0 / 58); const tone = mix(b.c < .5 ? [92, 70, 100] : [124, 88, 98], [200, 130, 130], fog * .8 + .05);
      ctx.fillStyle = rgb(mix(tone, [20, 14, 30], .35)); quad([a, a2, t1, t0]); ctx.fill();
      // windows
      const cols = 4, rows = Math.floor(b.h / 130); ctx.fillStyle = 'rgba(255,214,140,.8)';
      for (let rr = 1; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) { if ((rr * 7 + cc * 3 + it.i) % 5 < 2) continue; const zz0 = z0 + (cc + .2) / cols * it.dz, zz1 = z0 + (cc + .75) / cols * it.dz, y0 = 300 - rr * 130, y1 = y0 - 70; quad([P(X, y0, zz0), P(X, y0, zz1), P(X, y1, zz1), P(X, y1, zz0)]); ctx.globalAlpha = .4 + .5 * b.win; ctx.fill(); }
      ctx.globalAlpha = 1;
      // front face of building (toward camera) when its near edge is visible
      const fx0 = P(X, 300, z0), fx1 = P(X - side * b.depth, 300, z0), ft1 = P(X - side * b.depth, 300 - b.h, z0), ft0 = P(X, 300 - b.h, z0);
      ctx.fillStyle = rgb(mix(tone, [255, 190, 130], .1)); quad([fx0, fx1, ft1, ft0]); ctx.fill();
      // trees on the sidewalk at gaps
      if (it.i % 2 === 0) { const [tx, ty] = P(side * 600, 300, z0 + 1.0), r = 1 / (z0 + 1.0) * f; ctx.fillStyle = '#2a1b22'; ctx.fillRect(tx - 6 * r, ty - 130 * r, 12 * r, 130 * r); const cc = ctx.createRadialGradient(tx, ty - 320 * r, 10, tx, ty - 300 * r, 230 * r); cc.addColorStop(0, '#6fb45c'); cc.addColorStop(1, '#1d4a33'); ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(tx, ty - 300 * r, 190 * r, 0, 7); ctx.fill(); }
    }
    // cars in lanes
    const car = (lane, k, spd, col, head) => { const z = (((k * 11 - t * spd * 1.0) % 55) + 55) % 55 + 3.2, X = lane, w = 150, [x, y] = P(X, 300, z), s = f / z; if (z > 54) return;
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - w * s / 2, y - 120 * s, w * s, 105 * s, 12 * s); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(x - w * s * .38, y - 118 * s, w * s * .76, 36 * s);
      const lc = head ? [255, 245, 215] : [255, 40, 30]; for (const sx of [-1, 1]) glow(ctx, x + sx * w * s * .36, y - 42 * s, 55 * s + 6, lc, .9);
      ctx.fillStyle = rgb(lc); for (const sx of [-1, 1]) ctx.fillRect(x + sx * w * s * .36 - 10 * s, y - 50 * s, 20 * s, 10 * s); };
    for (let k = 0; k < 4; k++) car(-170, k, 4 + k, ['#2a3a5c', '#8c2f3a', '#d8d8dc', '#1e2a2e'][k], false);
    for (let k = 0; k < 4; k++) car(210, k + 2, -5 - k, ['#d8d0c0', '#32465e', '#7e3a2e', '#202228'][k], true);
    // lamp glow along edges
    for (let k = 0; k < 12; k++) for (const sd of [-1, 1]) { const z = (((k * 5 - t * 5.2) % 60) + 60) % 60 + 1.5, [x, y] = P(sd * 580, 300, z), s = f / z; ctx.fillStyle = '#2a2230'; ctx.fillRect(x - 3 * s * .4, y - 520 * s / 1.0 * 0.9, 6 * s * .4, 520 * s * .9); glow(ctx, x, y - 520 * s * .9, 110 * s + 4, [255, 205, 130], .8); }
  }
  // ---------- shot 4: park ----------
  function shot4(ctx, t, d) {
    const p = t / d, e = ease.io(p), cam = { x: lerp(-120, 100, e), y: lerp(40, -20, e), z: lerp(0, .3, e) };
    drawLayer(ctx, at(S.s4.sky, 0, 0), cam);
    drawLayer(ctx, at(S.s4.cl, .05, 300, { ox: -300 + t * 26 }), cam);
    drawLayer(ctx, at(S.s4.far, .15, 480), cam);
    // grass plane
    ctx.save(); const g = ctx.createLinearGradient(0, 1050, 0, H); g.addColorStop(0, '#6fb04a'); g.addColorStop(1, '#1f5b2c'); ctx.fillStyle = g; ctx.fillRect(0, 1050 + cam.y * .3, W, H); ctx.restore();
    drawLayer(ctx, at(S.s4.row, .3, 780), cam);
    // winding path (perspective)
    ctx.save(); const hy = 1060; ctx.fillStyle = 'rgba(236,214,164,.95)'; ctx.beginPath(); const sway = x => 540 + Math.sin(x * 2.2 + t * .0) * 40 - cam.x * .5;
    ctx.moveTo(sway(0) - 14, hy); for (let k = 0; k <= 20; k++) { const q = k / 20, y = lerp(hy, H + 80, q * q), w = lerp(14, 560, q * q * (.4 + .6 * q)); ctx.lineTo(540 + Math.sin(q * 2.4) * 120 * q - cam.x * .5 - w, y); }
    for (let k = 20; k >= 0; k--) { const q = k / 20, y = lerp(hy, H + 80, q * q), w = lerp(14, 560, q * q * (.4 + .6 * q)); ctx.lineTo(540 + Math.sin(q * 2.4) * 120 * q - cam.x * .5 + w, y); } ctx.fill(); ctx.restore();
    drawLayer(ctx, at(S.s4.mid, .55, 640), cam);
    rays(ctx, t, 860 - cam.x * .2, 520, .06, [255, 244, 190]);
    drawLayer(ctx, at(S.s4.near, 1, 560), cam);
    // falling leaves + bokeh
    const r = rng(77); for (let i = 0; i < 26; i++) { const x0 = r() * W, sp = 60 + r() * 100, ph = r() * 6, x = (x0 + Math.sin(t * 1.3 + ph) * 60 + t * 30) % (W + 100), y = ((r() * H + t * sp) % (H + 100)) - 50, s = 6 + r() * 12; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + ph); ctx.fillStyle = r() < .5 ? 'rgba(176,220,92,.85)' : 'rgba(250,212,92,.8)'; ctx.beginPath(); ctx.ellipse(0, 0, s, s * .45, 0, 0, 7); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rr = rng(5); for (let i = 0; i < 14; i++) { const x = (rr() * W + t * 8 * (i % 3 + 1)) % W, y = rr() * 900 + 100; glow(ctx, x, y, 60 + rr() * 60, [255, 245, 190], .12); } ctx.restore();
  }
  // ---------- shot 5: skyline ----------
  function shot5(ctx, t, d) {
    const p = t / d, e = ease.io(p), cam = { x: lerp(110, -110, e), y: lerp(160, -30, e), z: lerp(.02, .16, e) };
    drawLayer(ctx, at(S.s5.sky, 0, 0), cam);
    drawLayer(ctx, at(S.s5.far, .16, 420), cam);
    drawLayer(ctx, at(S.s5.b1, .42, 830), cam);
    drawLayer(ctx, at(S.s5.b2, .75, 950), cam);
    // moving traffic lights along boulevard
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = rng(9); for (let i = 0; i < 46; i++) { const dir = i % 2 ? 1 : -1, y = 1760 + (i % 2) * 40 + cam.y * -.6, x = ((r() * 1300 + t * (180 + r() * 160) * dir) % 1400 + 1400) % 1400 - 160, c = dir > 0 ? [255, 244, 220] : [255, 60, 50]; glow(ctx, x, y, 34, c, .9); ctx.fillStyle = rgb(c, .6); ctx.fillRect(x - 40 * dir, y - 2, 80, 4); } ctx.restore();
    // twinkle
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const q = rng(12); for (let i = 0; i < 60; i++) { const x = q() * W, y = 1000 + q() * 700; const a = .5 + .5 * Math.sin(t * 3 + i * 1.7); glow(ctx, x - cam.x * .75, y - cam.y * .75, 14, [255, 214, 140], .35 * a); } ctx.restore();
  }
  window.ShotsAlmaty = { init, draw: (i, ctx, t, d) => [shot1, shot2, shot3, shot4, shot5][i](ctx, t, d) };
})();
