/* Astana — five procedural shots: Baiterek, Khan Shatyr, architecture blueprint, avenue, night skyline. */
(function () {
  const { W, H, clamp, lerp, ease, prog, rng, hex, mix, rgb, canvas, gradient, sky, stars, clouds, ridge, skyline, drawLayer, glow } = KIT;
  const S = {}, at = (c, d, oy, e) => Object.assign({ c, d, oy }, e || {});
  function init() {
    S.d1 = { sky: sky(1300, 1920, [[0, '#1c5fa8'], [.4, '#64b0e0'], [.7, '#f4d9a8'], [1, '#ffe9bd']], { x: 760, y: 1050, r: 760, c0: 'rgba(255,248,215,.95)', c1: 'rgba(255,200,130,.3)' }),
      cl: clouds(2600, 520, 31, { color: [255, 255, 255], alpha: .85, density: .5 }),
      city: skyline({ w: 1700, h: 600, seed: 3, baseY: 520, minW: 40, maxW: 90, minH: 60, maxH: 240, body: ['#7a8fb0', '#4a5a7a'], win: ['#dfe9f5', '#cfe0f0'], winDensity: .15 }) };
    S.d2 = { sky: sky(1300, 1920, [[0, '#1a2b66'], [.35, '#6a4c9a'], [.6, '#f0806c'], [.8, '#ffc27a'], [1, '#ffe2a0']], { x: 650, y: 1150, r: 760, c0: 'rgba(255,225,160,.95)', c1: 'rgba(255,130,90,.35)' }),
      cl: clouds(2600, 480, 41, { color: [255, 190, 170], alpha: .5, density: .52 }),
      city: skyline({ w: 1700, h: 600, seed: 13, baseY: 520, minW: 40, maxW: 90, minH: 50, maxH: 200, body: ['#3a3258', '#1a1636'], win: ['#ffcc80', '#ffb050'], winDensity: .25 }) };
    S.d3 = { sky: sky(1300, 1920, [[0, '#050c20'], [.5, '#0b1f44'], [1, '#12315e']], null), st: stars(1300, 1200, 150, 5, 1100) };
    S.d4 = { sky: sky(1300, 1920, [[0, '#14336e'], [.4, '#4f7fc0'], [.65, '#f2c08a'], [1, '#ffe0a8']], { x: 540, y: 820, r: 700, c0: 'rgba(255,240,200,.9)', c1: 'rgba(255,190,120,.3)' }) };
    S.d5 = { sky: sky(1300, 1920, [[0, '#02050f'], [.5, '#0a1a3c'], [.8, '#1b3a6e'], [1, '#2a4f86']], null), st: stars(1300, 1000, 220, 8, 900),
      b1: skyline({ w: 1700, h: 700, seed: 55, baseY: 600, minW: 46, maxW: 100, minH: 90, maxH: 330, body: ['#0e1a3a', '#060c1e'], win: ['#ffcf80', '#8ed8ff'], winDensity: .32, edge: 'rgba(120,200,255,.25)' }),
      b2: skyline({ w: 1800, h: 900, seed: 66, baseY: 760, minW: 60, maxW: 130, minH: 160, maxH: 560, body: ['#08122c', '#030712'], win: ['#ffc870', '#7ed0ff'], winDensity: .36, edge: 'rgba(120,200,255,.3)' }) };
  }
  const flat = (ctx, y, c0, c1) => { ctx.fillStyle = gradient(ctx, 0, y, 0, H, [[0, c0], [1, c1]]); ctx.fillRect(0, y, W, H - y); };
  function plaza(ctx, y, t, col) { // reflective paving lines converging
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 12, y); ctx.lineTo(540 + i * 220, H); ctx.stroke(); }
    for (let k = 0; k < 14; k++) { const q = ((k + t * .5) % 14) / 14, yy = y + (H - y) * q * q; ctx.globalAlpha = .6 * q; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); } ctx.restore(); }
  function fountain(ctx, x, y, t, s) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 2.5 * s; for (let i = -6; i <= 6; i++) { ctx.beginPath(); const h = (60 + 40 * Math.sin(t * 3 + i)) * s; ctx.moveTo(x + i * 10 * s, y); ctx.quadraticCurveTo(x + i * 16 * s, y - h, x + i * 24 * s, y); ctx.stroke(); } ctx.restore(); }

  function shot1(ctx, t, d) { const e = ease.io(t / d), cam = { x: lerp(-30, 30, e), y: lerp(220, 0, e), z: lerp(0, .25, e) };
    drawLayer(ctx, at(S.d1.sky, 0, 0), cam); drawLayer(ctx, at(S.d1.cl, .06, 300, { ox: -300 + t * 30 }), cam);
    drawLayer(ctx, at(S.d1.city, .3, 1000), cam);
    const g = 1500 - cam.y * .8; flat(ctx, g, '#a9b8c8', '#5d6e86'); plaza(ctx, g, t, 'rgba(255,255,255,.25)');
    LM.baiterek(ctx, 540 - cam.x * .6, g + 30, 1.3 * (1 + cam.z * .5), 0, t); fountain(ctx, 540, g + 100, t, 1.0);
    drawLayer(ctx, at(S.d1.cl, .5, 1100, { ox: -1100 + t * 60, a: .35 }), cam); }
  function shot2(ctx, t, d) { const e = ease.io(t / d), cam = { x: lerp(60, -60, e), y: lerp(100, -20, e), z: lerp(.04, .28, e) };
    drawLayer(ctx, at(S.d2.sky, 0, 0), cam); drawLayer(ctx, at(S.d2.cl, .08, 360, { ox: -400 + t * 22 }), cam); drawLayer(ctx, at(S.d2.city, .3, 1060), cam);
    const g = 1500 - cam.y * .7; flat(ctx, g, '#4a3a52', '#171428'); plaza(ctx, g, t, 'rgba(255,200,150,.22)');
    LM.khanShatyr(ctx, 540 - cam.x * .6, g + 20, 1.35 * (1 + cam.z * .4), .8, t);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = rng(2); for (let i = 0; i < 40; i++) { const x = r() * W, y = g + 30 + r() * 300, a = .5 + .5 * Math.sin(t * 3 + i * 1.3); glow(ctx, x, y, 18, [255, 200, 120], .5 * a); } ctx.restore(); }
  function shot3(ctx, t, d) { const e = ease.io(t / d), cam = { x: lerp(40, -40, e), y: 0, z: lerp(0, .12, e) };
    drawLayer(ctx, at(S.d3.sky, 0, 0), cam); drawLayer(ctx, at(S.d3.st, .05, 100), cam);
    // blueprint grid
    ctx.save(); ctx.strokeStyle = 'rgba(88,200,255,.10)'; ctx.lineWidth = 1.5; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore();
    const gy = 1380; ctx.fillStyle = 'rgba(88,200,255,.35)'; ctx.fillRect(0, gy, W, 2);
    const items = [['pyramid', 240, 1], ['mosque', 810, 1.15], ['nurAlem', 540, 1.45], ['tower', 120, .9], ['shatyr', 700, .75], ['baiterek', 400, .8]];
    // each outline draws in sequence, then fills softly
    const spec = [['tower', 130, 1, 0, '#58c8ff'], ['pyramid', 330, 1.05, .35, '#58c8ff'], ['mosque', 820, 1.2, .7, '#ffb43c'], ['nurAlem', 540, 1.5, 1.05, '#ffb43c'], ['shatyr', 880, .7, 1.35, '#58c8ff'], ['baiterek', 560, .9, 1.7, '#ffb43c']];
    spec.forEach(([n, x, s, a, col], i) => { const p = ease.io(prog(t, a, a + 1.5)); const y = gy - (n === 'nurAlem' ? 270 * s : 0);
      LM.drawOutline(ctx, n, x - cam.x * .5, i % 2 ? gy : gy, s, p, col, 4);
      if (p > .98) { ctx.save(); ctx.globalAlpha = clamp((t - a - 1.5) * 2) * .22; ctx.fillStyle = col; ctx.translate(x - cam.x * .5, gy); ctx.scale(s, s); ctx.beginPath(); LM.outlines[n].forEach((q, k) => k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.fill(); ctx.restore(); } });
    // scanning line
    const sx = ((t * 520) % (W + 400)) - 200; const g2 = ctx.createLinearGradient(sx - 90, 0, sx, 0); g2.addColorStop(0, 'rgba(88,200,255,0)'); g2.addColorStop(1, 'rgba(88,200,255,.22)'); ctx.fillStyle = g2; ctx.fillRect(sx - 90, 700, 90, gy - 700);
  }
  function shot4(ctx, t, d) { // avenue toward Baiterek
    const hy = 780, f = 2.6, cx = 540, cz = t * 520; ctx.drawImage(S.d4.sky, -110, 0);
    glow(ctx, cx, hy + 20, 520, [255, 215, 150], .6);
    const P = (X, Y, z) => [cx + X / z * f, hy + Y / z * f]; const quad = p => { ctx.beginPath(); ctx.moveTo(...p[0]); for (let i = 1; i < p.length; i++) ctx.lineTo(...p[i]); ctx.closePath(); };
    ctx.fillStyle = gradient(ctx, 0, hy, 0, H, [[0, '#5a6a86'], [1, '#232838']]); ctx.fillRect(0, hy, W, H - hy);
    const grow = 1 + ease.io(t / d) * .35; LM.baiterek(ctx, cx, hy + 12, .36 * grow, 0, t);
    const items = []; for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 24; i++) { const zn = (((i * 300 - cz) % 7200) + 7200) % 7200; items.push({ side, z: zn / 100 + 1.2, i, h: 500 + ((i * 53 + (side > 0 ? 17 : 0)) % 9) * 120 }); }
    items.sort((a, b) => b.z - a.z);
    for (const it of items) { if (it.z > 62) continue; const X = it.side * 800, z0 = it.z, z1 = it.z + 2.6, fog = clamp(z0 / 62);
      const col = mix([120, 160, 205], [200, 205, 225], fog); const a = P(X, 300, z0), a2 = P(X, 300, z1), t0 = P(X, 300 - it.h, z0), t1 = P(X, 300 - it.h, z1);
      ctx.fillStyle = rgb(mix(col, [30, 40, 70], .45)); quad([a, a2, t1, t0]); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.18)'; for (let rr = 1; rr < it.h / 110; rr++) { const y0 = 300 - rr * 110; quad([P(X, y0, z0), P(X, y0, z1), P(X, y0 - 8, z1), P(X, y0 - 8, z0)]); ctx.fill(); }
      const fa = P(X, 300, z0), fb = P(X - it.side * 300, 300, z0), fc = P(X - it.side * 300, 300 - it.h, z0), fd = P(X, 300 - it.h, z0); ctx.fillStyle = rgb(mix(col, [255, 220, 170], .15)); quad([fa, fb, fc, fd]); ctx.fill(); }
    // lamps
    for (let k = 0; k < 14; k++) for (const sd of [-1, 1]) { const z = (((k * 5 - t * 5.2) % 70) + 70) % 70 + 1.5, [x, y] = P(sd * 560, 300, z), s = f / z; ctx.fillStyle = '#2b3246'; ctx.fillRect(x - 2 * s, y - 380 * s, 4 * s, 380 * s); glow(ctx, x, y - 380 * s, 90 * s + 4, [255, 225, 160], .8); }
    // lane lines
    ctx.fillStyle = 'rgba(255,255,255,.7)'; for (const lx of [-210, 210]) for (let k = 0; k < 40; k++) { const z0 = ((k * 150 - cz) % 6000 + 6000) % 6000 / 100 + 1, z1 = z0 + .8; if (z1 > 60) continue; quad([P(lx - 8, 300, z0), P(lx + 8, 300, z0), P(lx + 8, 300, z1), P(lx - 8, 300, z1)]); ctx.fill(); }
    // cars
    for (let k = 0; k < 6; k++) { const lane = [-340, -90, 90, 340][k % 4], dir = lane < 0 ? 1 : -1, z = (((k * 9 - t * 5 * dir) % 55) + 55) % 55 + 3.4, [x, y] = P(lane, 300, z), s = f / z, w = 150; ctx.fillStyle = ['#d8dce6', '#2a3556', '#8a2f3c', '#1f2430'][k % 4]; ctx.beginPath(); ctx.roundRect(x - w * s / 2, y - 118 * s, w * s, 104 * s, 12 * s); ctx.fill(); const lc = dir > 0 ? [255, 40, 30] : [255, 246, 220]; for (const sx of [-1, 1]) glow(ctx, x + sx * w * s * .36, y - 42 * s, 50 * s + 6, lc, .9); }
  }
  function shot5(ctx, t, d) { const e = ease.io(t / d), cam = { x: lerp(-80, 80, e), y: lerp(120, -40, e), z: lerp(.02, .2, e) };
    drawLayer(ctx, at(S.d5.sky, 0, 0), cam); drawLayer(ctx, at(S.d5.st, .04, 60), cam);
    drawLayer(ctx, at(S.d5.b1, .35, 870), cam); drawLayer(ctx, at(S.d5.b2, .6, 840), cam);
    // river reflection
    const ry = 1480 - cam.y * .5; ctx.fillStyle = gradient(ctx, 0, ry, 0, H, [[0, '#071a3a'], [1, '#020611']]); ctx.fillRect(0, ry, W, H - ry);
    LM.baiterek(ctx, 560 - cam.x * .45, ry + 4, 1.05, 1, t); LM.khanShatyr(ctx, 160 - cam.x * .45, ry + 4, .55, 1, t);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = rng(4); for (let i = 0; i < 70; i++) { const x = r() * W, y = ry + 14 + r() * (H - ry), w = 30 + r() * 120, a = .3 + .3 * Math.sin(t * 2 + i * 1.7), c = r() < .5 ? [255, 200, 110] : [100, 200, 255]; ctx.fillStyle = rgb(c, .18 * a); ctx.fillRect(x - w / 2 + Math.sin(t * 1.4 + i) * 10, y, w, 3); } ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const q = rng(21); for (let i = 0; i < 80; i++) { const x = q() * W, y = 900 + q() * 560, a = .5 + .5 * Math.sin(t * 3 + i * 1.9); glow(ctx, x - cam.x * .5, y - cam.y * .5, 12, [255, 214, 140], .35 * a); } ctx.restore(); }
  window.ShotsAstana = { init, draw: (i, ctx, t, d) => [shot1, shot2, shot3, shot4, shot5][i](ctx, t, d) };
})();
