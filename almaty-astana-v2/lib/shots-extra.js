/* Additional shots: Medeu rink, EXPO (Nur Alem), Ishim river panorama, modern glass towers. */
(function () {
  const { W, H, clamp, lerp, ease, prog, rng, mix, rgb, canvas, gradient, sky, clouds, ridge, skyline, drawLayer, layerPoint, firs, glow } = KIT;
  const X = {}, at = (c, d, oy, e) => Object.assign({ c, d, oy }, e || {});
  function init() {
    X.me = { sky: sky(1300, 1920, [[0, '#3a86d6'], [.35, '#8cc3ee'], [.62, '#dcecf6'], [1, '#f6f1e2']], { x: 800, y: 520, r: 600, c0: 'rgba(255,252,230,.95)', c1: 'rgba(255,240,190,.3)' }),
      cl: clouds(2600, 460, 77, { color: [255, 255, 255], alpha: .8, density: .52 }),
      far: ridge({ w: 1500, h: 1100, base: 1020, amp: 780, freq: .0034, seed: 303, rock: ['#4b6088', '#dce8fa'], snowAlt: 380, hazeAmt: .38, haze: [205, 225, 248] }),
      midL: ridge({ w: 1100, h: 1000, base: 940, amp: 640, freq: .0058, seed: 312, rock: ['#2b3c4e', '#869cb0'], snowAlt: 520, hazeAmt: .18, haze: [150, 176, 204] }),
      midR: ridge({ w: 1100, h: 1000, base: 940, amp: 600, freq: .0058, seed: 322, rock: ['#2b3c4e', '#869cb0'], snowAlt: 520, hazeAmt: .18, haze: [150, 176, 204], sunDir: -1 }),
      fir: firs(1500, 520, 400, 91, '#0a1e19', 110, 280, 80, '#10302a') };
    X.ex = { sky: sky(1300, 1920, [[0, '#101f4d'], [.3, '#4a4690'], [.55, '#d4688a'], [.75, '#ffab7c'], [1, '#ffd89a']], { x: 650, y: 1060, r: 760, c0: 'rgba(255,225,170,.95)', c1: 'rgba(255,120,110,.35)' }),
      cl: clouds(2600, 480, 88, { color: [255, 170, 160], alpha: .5, density: .5 }),
      city: skyline({ w: 1700, h: 500, seed: 31, baseY: 420, minW: 40, maxW: 90, minH: 40, maxH: 150, body: ['#3a2f5a', '#1a1636'], win: ['#ffc880', '#ffa850'], winDensity: .22 }) };
    X.rv = { sky: sky(1300, 1920, [[0, '#0c1b44'], [.3, '#43498c'], [.55, '#c56a92'], [.75, '#ff9f7a'], [1, '#ffd29a']], { x: 600, y: 1000, r: 800, c0: 'rgba(255,225,170,.95)', c1: 'rgba(255,130,100,.35)' }),
      cl: clouds(2600, 480, 99, { color: [255, 190, 170], alpha: .45, density: .52 }),
      b1: skyline({ w: 1700, h: 700, seed: 44, baseY: 620, minW: 44, maxW: 96, minH: 90, maxH: 340, body: ['#2c2a58', '#12122e'], win: ['#ffd08a', '#9ad6ff'], winDensity: .3, edge: 'rgba(255,170,130,.4)' }),
      b2: skyline({ w: 1800, h: 800, seed: 55, baseY: 700, minW: 60, maxW: 130, minH: 140, maxH: 480, body: ['#161a40', '#080a1e'], win: ['#ffc870', '#7ed0ff'], winDensity: .34, edge: 'rgba(255,170,130,.35)' }) };
    X.tw = { sky: sky(1300, 1920, [[0, '#0e3a86'], [.45, '#3a86d0'], [.8, '#a9d6f2'], [1, '#e8f3f8']], { x: 700, y: 400, r: 700, c0: 'rgba(255,255,240,.9)', c1: 'rgba(255,240,200,.25)' }), cl: clouds(2600, 520, 111, { color: [255, 255, 255], alpha: .8, density: .5 }) };
  }
  // ---- Medeu ----
  function medeu(ctx, t, d) {
    const e = ease.io(t / d), cam = { x: lerp(-40, 40, e), y: lerp(40, -30, e), z: lerp(0, .22, e) };
    drawLayer(ctx, at(X.me.sky, 0, 0), cam); drawLayer(ctx, at(X.me.cl, .05, 340, { ox: -300 + t * 20 }), cam);
    drawLayer(ctx, at(X.me.far, .2, 420), cam);
    drawLayer(ctx, at(X.me.midL, .45, 560, { ox: -600 }), cam); drawLayer(ctx, at(X.me.midR, .45, 560, { ox: 590 }), cam);
    // stone dam + staircase
    const dy = 1180 - cam.y * .6; ctx.fillStyle = gradient(ctx, 0, dy, 0, dy + 120, [[0, '#8f9aa8'], [1, '#5c6572']]); ctx.beginPath(); ctx.moveTo(-60, dy + 60); ctx.lineTo(W + 60, dy - 30); ctx.lineTo(W + 60, dy + 120); ctx.lineTo(-60, dy + 150); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 40; i++) { const x = i * 30 + 10, y = dy + 60 - (x / W) * 90; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10, y + 90); ctx.stroke(); }
    drawLayer(ctx, at(X.me.fir, .62, 1000), cam);
    // ice rink in perspective
    const cy = 1580 - cam.y * .5; ctx.save(); ctx.translate(540, cy); const rx = 640, ry = 230;
    const ice = ctx.createRadialGradient(0, -40, 40, 0, 0, rx); ice.addColorStop(0, '#f2fbff'); ice.addColorStop(.6, '#cfe8f6'); ice.addColorStop(1, '#8fb6d2'); ctx.fillStyle = ice; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(30,60,90,.45)'; ctx.lineWidth = 3; for (const k of [.82, .62]) { ctx.beginPath(); ctx.ellipse(0, 0, rx * k, ry * k, 0, 0, 7); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(Math.sin(i * 2) * 60, 10, rx * (.3 + i * .1), ry * (.3 + i * .1), 0, .3 + i, 1.7 + i); ctx.stroke(); }
    // skaters
    for (let i = 0; i < 14; i++) { const a = (t * (.28 + (i % 3) * .05) + i / 14) * 6.283, k = .62 + (i % 4) * .08, x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k, s = .55 + (y / ry + 1) * .35; ctx.fillStyle = ['#e8453c', '#2f6fe8', '#f2c230', '#1c1c28', '#2fcf8f'][i % 5]; ctx.fillRect(x - 5 * s, y - 28 * s, 10 * s, 24 * s); ctx.fillStyle = '#f0d0b0'; ctx.beginPath(); ctx.arc(x, y - 33 * s, 5 * s, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x, y, 8 * s, 3 * s, 0, 0, 7); ctx.fill(); }
    ctx.restore();
    // foreground rail + sun rays
    ctx.fillStyle = 'rgba(20,28,40,.9)'; ctx.fillRect(0, 1840 - cam.y * .3, W, 90);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const g = ctx.createLinearGradient(820, 520, 820 - 500 + i * 200, 1600); g.addColorStop(0, 'rgba(255,248,210,.10)'); g.addColorStop(1, 'rgba(255,248,210,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(820, 520); ctx.lineTo(820 - 700 + i * 260, 1700); ctx.lineTo(820 - 560 + i * 260, 1700); ctx.fill(); } ctx.restore();
  }
  // ---- EXPO / Nur Alem ----
  function expo(ctx, t, d) {
    const e = ease.io(t / d), cam = { x: lerp(40, -40, e), y: lerp(60, -20, e), z: lerp(.02, .24, e) };
    drawLayer(ctx, at(X.ex.sky, 0, 0), cam); drawLayer(ctx, at(X.ex.cl, .06, 340, { ox: -360 + t * 24 }), cam); drawLayer(ctx, at(X.ex.city, .25, 1060), cam);
    const g = 1480 - cam.y * .7; ctx.fillStyle = gradient(ctx, 0, g, 0, H, [[0, '#5a4660'], [1, '#150f26']]); ctx.fillRect(0, g, W, H - g);
    // reflecting pool
    const px = 540 - cam.x * .6, sc = 1 + cam.z * .5, cy = g - 520 * sc, R = 270 * sc;
    ctx.save(); ctx.globalAlpha = .35; ctx.translate(px, g + 6); ctx.scale(1, -.6); ctx.translate(-px, -(g + 6)); glow(ctx, px, cy, R * 1.3, [255, 150, 110], .5); ctx.restore();
    glow(ctx, px, cy, R * 1.8, [255, 170, 110], .45);
    // pavilions
    for (const [dx, w, h] of [[-420, 220, 120], [-250, 180, 90], [300, 200, 100], [470, 180, 140]]) { ctx.fillStyle = '#241c3c'; ctx.beginPath(); ctx.moveTo(px + dx * sc - w / 2, g); ctx.lineTo(px + dx * sc - w * .3, g - h * sc); ctx.lineTo(px + dx * sc + w * .3, g - h * sc); ctx.lineTo(px + dx * sc + w / 2, g); ctx.fill(); ctx.fillStyle = 'rgba(255,200,130,.55)'; ctx.fillRect(px + dx * sc - w * .18, g - h * sc * .55, w * .36, 8); }
    // glass sphere with rotating ribs
    const sg = ctx.createRadialGradient(px - R * .35, cy - R * .4, R * .1, px, cy, R); sg.addColorStop(0, '#ffe6bd'); sg.addColorStop(.45, '#e8845e'); sg.addColorStop(.8, '#6a3868'); sg.addColorStop(1, '#2b1d52'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(px, cy, R, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(px, cy, R, 0, 7); ctx.clip(); ctx.strokeStyle = 'rgba(255,238,210,.5)'; ctx.lineWidth = 2.2;
    for (let i = 0; i < 12; i++) { const a = (i / 12 + t * .03) * 6.283, rx = Math.abs(Math.cos(a)) * R; ctx.beginPath(); ctx.ellipse(px, cy, Math.max(2, rx), R, 0, 0, 7); ctx.stroke(); }
    for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.ellipse(px, cy + k * R * .21, R * Math.sqrt(1 - (k * .21) ** 2), R * .05, 0, 0, 7); ctx.stroke(); }
    ctx.restore(); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.ellipse(px - R * .38, cy - R * .5, R * .06, R * .035, -.6, 0, 7); ctx.fill();
    // support structure
    ctx.fillStyle = '#17112c'; ctx.beginPath(); ctx.moveTo(px - R * .6, g); ctx.lineTo(px - R * .2, cy + R * .95); ctx.lineTo(px + R * .2, cy + R * .95); ctx.lineTo(px + R * .6, g); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = rng(7); for (let i = 0; i < 46; i++) { const x = r() * W, y = g + 20 + r() * 340, a = .5 + .5 * Math.sin(t * 3 + i * 1.4); glow(ctx, x, y, 16, [255, 200, 130], .5 * a); } ctx.restore();
  }
  // ---- Ishim river panorama (dusk) ----
  function river(ctx, t, d) {
    const e = ease.io(t / d), cam = { x: lerp(120, -120, e), y: lerp(60, -20, e), z: lerp(.02, .14, e) };
    drawLayer(ctx, at(X.rv.sky, 0, 0), cam); drawLayer(ctx, at(X.rv.cl, .06, 380, { ox: -300 + t * 22 }), cam);
    const b1 = at(X.rv.b1, .35, 860), b2 = at(X.rv.b2, .6, 800); drawLayer(ctx, b1, cam); drawLayer(ctx, b2, cam);
    const [bx, by, bs] = layerPoint(b2, cam, 900, 700); LM.baiterek(ctx, bx, by, .5 * bs, .6, t);
    const ry = 1380 - cam.y * .5; ctx.fillStyle = gradient(ctx, 0, ry, 0, H, [[0, '#35365e'], [.4, '#171a3c'], [1, '#080a1c']]); ctx.fillRect(0, ry, W, H - ry);
    // reflection: mirrored skyline slices with ripple
    ctx.save(); ctx.beginPath(); ctx.rect(0, ry, W, H - ry); ctx.clip(); ctx.globalAlpha = .38;
    for (let i = 0; i < 90; i++) { const y = ry + i * 6, sy = ry - i * 6 * .9; ctx.save(); ctx.translate(Math.sin(t * 1.6 + i * .5) * (4 + i * .1), 0); ctx.drawImage(KIT._cv, 0, sy - 6, W, 6, 0, y, W, 6); ctx.restore(); } ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = rng(5); for (let i = 0; i < 70; i++) { const x = r() * W, y = ry + 12 + r() * 380, w = 40 + r() * 140, a = .4 + .4 * Math.sin(t * 2 + i); ctx.fillStyle = rgb(r() < .5 ? [255, 190, 120] : [120, 200, 255], .2 * a); ctx.fillRect(x - w / 2 + Math.sin(t + i) * 12, y, w, 3); } ctx.restore();
    // embankment trees & lamps
    ctx.fillStyle = '#0a0c1c'; ctx.fillRect(0, ry + 380, W, H); for (let i = 0; i < 9; i++) { const x = i * 140 + 40 - cam.x * .9, y = ry + 380; ctx.fillRect(x - 3, y - 190, 6, 190); glow(ctx, x, y - 195, 80, [255, 214, 150], .85); }
  }
  // ---- modern glass towers (tilt-up) ----
  function towers(ctx, t, d) {
    const e = ease.io(t / d), tilt = lerp(-520, 260, e);
    drawLayer(ctx, at(X.tw.sky, 0, 0), { x: 0, y: tilt * .25, z: 0 }); drawLayer(ctx, at(X.tw.cl, .05, 300, { ox: -300 + t * 36 }), { x: 0, y: tilt * .25, z: 0 });
    const specs = [[40, 360, 1900, 0], [270, 300, 2300, 1], [520, 340, 1700, 2], [770, 300, 2100, 3], [-120, 260, 1500, 4], [930, 280, 1600, 5]];
    specs.sort((a, b) => a[2] - b[2]);
    specs.forEach(([x, w, h, k]) => { const base = 1720 + tilt, top = base - h, ph = (k * .13 + t * .02) % 1;
      const g = ctx.createLinearGradient(x, top, x + w, base); g.addColorStop(0, '#d6ecfa'); g.addColorStop(.35, '#6fa6d6'); g.addColorStop(.7, '#2a5a92'); g.addColorStop(1, '#10284a'); ctx.fillStyle = g; ctx.fillRect(x, top, w, h + 400);
      ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; for (let yy = top; yy < base + 400; yy += 46) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); } for (let xx = x; xx <= x + w; xx += 52) { ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xx, base + 400); ctx.stroke(); }
      const sh = ctx.createLinearGradient(x - 200 + ph * (w + 400), 0, x + 80 + ph * (w + 400), 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.22)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); ctx.save(); ctx.beginPath(); ctx.rect(x, top, w, h + 400); ctx.clip(); ctx.fillStyle = sh; ctx.fillRect(x, top, w, h + 400); ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x, top, w, 6); });
    ctx.fillStyle = gradient(ctx, 0, 1700 + tilt, 0, 1920, [[0, 'rgba(8,16,30,0)'], [1, 'rgba(8,16,30,.9)']]); ctx.fillRect(0, 1560 + tilt, W, 600);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(780, 300, 0, 780, 300, 700); g.addColorStop(0, 'rgba(255,250,220,.45)'); g.addColorStop(1, 'rgba(255,250,220,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 1100); ctx.restore();
  }
  window.ShotsExtra = { init, medeu, expo, river, towers };
})();
