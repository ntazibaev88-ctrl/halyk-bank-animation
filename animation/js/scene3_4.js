// Chapter 3 — Астана, 30–46 s: the capital rises on the banks of the Yesil.
const Scene3 = (() => {
  const GY = 760, RIVER = 792;
  const city = makeBuffer(W, RIVER + 10);
  const cc = city.getContext('2d');
  const r = mulberry32(1997);
  const far = Array.from({ length: 34 }, (_, i) => ({ x: 40 + i * 56 + r() * 30, w: 34 + r() * 40, h: 70 + r() * 170, d: r() * 1.5 }));
  const towers = [[520, 70, 300, 0.4], [600, 56, 230, 0.7], [1265, 64, 330, 0.9], [1330, 52, 260, 1.2], [1560, 80, 360, 0.6], [1860, 70, 290, 1.0], [210, 60, 210, 1.3]]
    .map(([x, w, h, d]) => ({ x, w, h, d, win: Array.from({ length: 60 }, () => [r(), r(), r()]) }));
  const ridge = new Ridge({ seed: 66, base: GY - 6, amp: 26, scale: 500, step: 12 });

  function grow(t, d, dur = 2.4) { return easeOut(inv(36.4 + d, 36.4 + d + dur, t)); }

  function glassTower(c, b, g, night, t) {
    const h = b.h * g; if (h < 1) return;
    const x = b.x - b.w / 2, y = GY - h;
    const gr = c.createLinearGradient(x, 0, x + b.w, 0);
    gr.addColorStop(0, rgba(mix('#4a7fa4', '#1a2c48', night))); gr.addColorStop(0.5, rgba(mix('#9fd6e8', '#2c4870', night)));
    gr.addColorStop(1, rgba(mix('#2e5878', '#131f36', night)));
    c.fillStyle = gr;
    c.beginPath(); c.moveTo(x, GY); c.lineTo(x, y + 12); c.lineTo(x + b.w * 0.5, y); c.lineTo(x + b.w, y + 18); c.lineTo(x + b.w, GY); c.fill();
    c.strokeStyle = rgba('#ffffff', 0.12); c.lineWidth = 1;
    for (let k = 1; k < 5; k++) { c.beginPath(); c.moveTo(x + (b.w * k) / 5, y + 16); c.lineTo(x + (b.w * k) / 5, GY); c.stroke(); }
    if (night > 0.05) {
      for (const [u, v, on] of b.win) {
        if (on > night * 1.1) continue;
        const wy = y + 20 + v * (h - 30);
        c.fillStyle = `rgba(255,214,140,${0.85 * night})`; c.fillRect(x + 4 + u * (b.w - 10), wy, 4, 3);
      }
    }
  }

  function baiterek(c, x, t, night) {
    const g1 = easeOut(inv(37.6, 40.0, t)), g2 = easeOut(inv(39.4, 41.0, t)), g3 = smooth(40.4, 41.4, t);
    const trunkH = 380 * g1, top = GY - trunkH;
    if (g1 <= 0) return;
    c.fillStyle = rgba(mix('#f4f6f8', '#c8d2e6', night));
    c.beginPath(); c.moveTo(x - 24, GY); c.lineTo(x - 12, top); c.lineTo(x + 12, top); c.lineTo(x + 24, GY); c.fill();
    c.strokeStyle = rgba('#9aa7b8', 0.6); c.lineWidth = 1.5;
    for (let k = 0; k < 18; k++) { const yy = GY - (k / 18) * trunkH; const hw = lerp(24, 12, k / 18); c.beginPath(); c.moveTo(x - hw, yy); c.lineTo(x + hw, yy - trunkH / 18); c.stroke(); }
    if (g2 > 0) {
      c.strokeStyle = rgba(mix('#f6f8fa', '#d8e0ee', night)); c.lineWidth = 6; c.lineCap = 'round';
      for (let k = -4; k <= 4; k++) {
        const ex = x + k * 16 * g2, ey = top - 92 * g2;
        c.beginPath(); c.moveTo(x + k * 2, top + 6); c.bezierCurveTo(x + k * 18 * g2, top - 20 * g2, ex + k * 4, ey + 30 * g2, ex, ey); c.stroke();
      }
    }
    if (g3 > 0) {
      const sy = top - 66;
      glow(c, x, sy, 160, P.goldL, 0.25 * g3 + 0.45 * night);
      const sg = c.createRadialGradient(x - 12, sy - 14, 4, x, sy, 42);
      sg.addColorStop(0, '#fff6cf'); sg.addColorStop(0.5, '#f2bf3d'); sg.addColorStop(1, '#a9741c');
      c.fillStyle = sg; c.globalAlpha = g3; c.beginPath(); c.arc(x, sy, 40 * g3, 0, TAU); c.fill(); c.globalAlpha = 1;
    }
  }

  function landmarks(c, t, night) {
    const white = rgba(mix('#f3efe6', '#b7bed2', night)), gold = mix('#e9b949', '#c79a3c', night);
    // Hazret Sultan mosque
    let g = grow(t, 0.2);
    if (g > 0) {
      c.save(); c.translate(380, GY); c.scale(1, g); c.fillStyle = white;
      c.fillRect(-150, -90, 300, 90);
      c.beginPath(); c.ellipse(0, -90, 82, 112, 0, Math.PI, TAU); c.fill();
      c.beginPath(); c.ellipse(-100, -90, 36, 46, 0, Math.PI, TAU); c.ellipse(100, -90, 36, 46, 0, Math.PI, TAU); c.fill();
      for (const mx of [-176, -132, 132, 176]) { c.fillRect(mx - 6, -250, 12, 250); c.beginPath(); c.moveTo(mx - 8, -250); c.lineTo(mx, -284); c.lineTo(mx + 8, -250); c.fill(); }
      c.fillStyle = rgba(gold); c.fillRect(-2, -232, 4, 30); c.fillRect(-150, -60, 300, 4);
      c.restore();
    }
    // Ak Orda: blue dome and golden spire
    g = grow(t, 0.5);
    if (g > 0) {
      c.save(); c.translate(720, GY); c.scale(1, g); c.fillStyle = white;
      c.fillRect(-140, -120, 280, 120); c.fillRect(-50, -170, 100, 50);
      c.fillStyle = rgba(mix('#3a8fd0', '#2a4e86', night)); c.beginPath(); c.ellipse(0, -170, 58, 70, 0, Math.PI, TAU); c.fill();
      c.fillStyle = rgba(gold); c.fillRect(-3, -320, 6, 82); c.beginPath(); c.arc(0, -246, 9, 0, TAU); c.fill();
      c.fillStyle = rgba('#000', 0.18); for (let k = -6; k <= 6; k++) c.fillRect(k * 20 - 3, -110, 6, 100);
      c.restore();
    }
    // twin golden towers
    for (const [tx, d] of [[880, 0.8], [948, 0.95]]) {
      g = grow(t, d);
      if (g <= 0) continue;
      const h = 290 * g, gr = c.createLinearGradient(tx - 24, 0, tx + 24, 0);
      gr.addColorStop(0, rgba(mix('#8a6420', '#4a3a26', night))); gr.addColorStop(0.45, rgba(mix('#ffd77a', '#9a7a3a', night))); gr.addColorStop(1, rgba(mix('#7a561a', '#3a2c1c', night)));
      c.fillStyle = gr; c.beginPath(); c.moveTo(tx - 24, GY); c.lineTo(tx - 24, GY - h + 10); c.quadraticCurveTo(tx, GY - h - 8, tx + 24, GY - h + 10); c.lineTo(tx + 24, GY); c.fill();
    }
    // Palace of Peace and Reconciliation (pyramid)
    g = grow(t, 1.1);
    if (g > 0) {
      c.save(); c.translate(1440, GY); c.scale(g, g);
      c.fillStyle = rgba(mix('#d9d2c2', '#7f8296', night)); c.beginPath(); c.moveTo(-120, 0); c.lineTo(0, -200); c.lineTo(120, 0); c.fill();
      c.fillStyle = rgba(mix('#7ec8e0', '#ffd88a', night)); c.beginPath(); c.moveTo(-36, -140); c.lineTo(0, -200); c.lineTo(36, -140); c.fill();
      c.restore();
    }
    // Khan Shatyr: tilted translucent tent
    g = grow(t, 1.4);
    if (g > 0) {
      const ax = 1720 + 30, ay = GY - 330 * g;
      const gr = c.createLinearGradient(0, ay, 0, GY);
      gr.addColorStop(0, rgba(mix('#e8eef2', '#ffe0a8', night))); gr.addColorStop(1, rgba(mix('#a9c0cc', '#c08a50', night)));
      c.fillStyle = gr;
      c.beginPath(); c.moveTo(1560, GY); c.quadraticCurveTo(1650, GY - 60 * g, ax, ay); c.quadraticCurveTo(1810, GY - 80 * g, 1880, GY); c.fill();
      c.strokeStyle = rgba('#ffffff', 0.35); c.lineWidth = 1.2;
      for (let k = 1; k < 9; k++) { const bx = lerp(1560, 1880, k / 9); c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, GY); c.stroke(); }
      if (night > 0) glow(c, 1720, GY - 80, 220, '#ffcf80', 0.35 * night);
    }
  }

  function crane(c, x, h, t, d) {
    const a = smooth(36.2 + d, 36.9 + d, t) * (1 - smooth(40.6, 41.4, t));
    if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.strokeStyle = rgba('#e7a83a'); c.lineWidth = 4;
    c.beginPath(); c.moveTo(x, GY); c.lineTo(x, GY - h); c.stroke();
    const sw = Math.cos(t * 0.9 + d * 3);
    c.beginPath(); c.moveTo(x - 50 * sw, GY - h); c.lineTo(x + 170 * sw, GY - h); c.stroke();
    c.lineWidth = 1; c.beginPath(); c.moveTo(x + 120 * sw, GY - h); c.lineTo(x + 120 * sw, GY - h + 70); c.stroke();
    c.restore();
  }

  return function (ctx, t) {
    const u = inv(30, 46, t);
    const sunAng = lerp(0.12, 1.02, u) * Math.PI;
    const sx = lerp(260, 1700, u), sy = 720 - Math.sin(sunAng) * 520;
    const day = Math.sin(clamp(sunAng, 0, Math.PI)), dusk = smooth(41, 44.5, t), night = smooth(42.6, 45.5, t);
    // build the city layer
    cc.setTransform(1, 0, 0, 1, 0, 0);
    cc.clearRect(0, 0, city.width, city.height);
    sky(cc, [[0, mix(mix('#3b6fa6', '#2a78c0', day), '#1b2550', dusk)], [0.5, mix(mix('#8ab6d8', '#a7d4ee', day), '#c46f6a', dusk)],
      [0.7, mix('#f2d6a8', '#ffb070', dusk)], [1, mix('#f6e6c4', '#ff9a5a', dusk)]]);
    glow(cc, sx, sy, 600, P.amber, 0.3 + 0.3 * dusk);
    cc.fillStyle = rgba(P.sun, 0.95 * (1 - night)); cc.beginPath(); cc.arc(sx, sy, 46, 0, TAU); cc.fill();
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 330 + t * 110 * (0.6 + 0.1 * i)) % (W + 900)) - 450;
      cloud(cc, cx, 140 + (i % 4) * 70, 260, 34, mix('#ffffff', '#f2a07a', dusk), 0.5 * (1 - night * 0.7));
    }
    // the "1997" caption floats in the sky while the steppe is still empty
    const ya = smooth(31, 32.2, t) * (1 - smooth(35.6, 36.8, t));
    if (ya > 0) {
      cc.save(); cc.globalAlpha = ya; cc.textAlign = 'center'; cc.fillStyle = rgba('#ffffff', 0.92);
      cc.shadowColor = 'rgba(20,40,80,0.4)'; cc.shadowBlur = 20;
      cc.font = '600 210px "Cormorant Garamond"'; cc.letterSpacing = '18px'; cc.fillText('1997', W / 2 + 9, 400);
      cc.restore();
      ornamentLine(cc, W / 2, 450, 420, inv(31.2, 32.8, t) * ya, '#ffffff', 0.9);
    }
    ridge.fill(cc, rgba(mix('#b9a27a', '#5a4a52', dusk)));
    for (const b of far) {
      const g = grow(t, b.d, 3); if (g <= 0) continue;
      cc.fillStyle = rgba(mix('#9fb6c8', '#3d4a6a', dusk), 0.85); cc.fillRect(b.x, GY - b.h * g * 0.8, b.w, b.h * g * 0.8);
      if (night > 0.1) { cc.fillStyle = `rgba(255,210,140,${0.5 * night})`; for (let k = 0; k < 4; k++) cc.fillRect(b.x + 6 + (k % 2) * 12, GY - b.h * g * 0.8 + 10 + k * 18, 3, 3); }
    }
    for (const b of towers) glassTower(cc, b, grow(t, b.d), night, t);
    landmarks(cc, t, night);
    baiterek(cc, 1110, t, night);
    for (const [x, h, d] of [[1000, 420, 0], [1500, 380, 0.4], [620, 360, 0.8]]) crane(cc, x, h, t, d);
    cc.fillStyle = rgba(mix('#c9b48a', '#3a3440', dusk)); cc.fillRect(0, GY, W, RIVER - GY + 10);
    cc.fillStyle = rgba(mix('#e7dcc4', '#6a6070', dusk)); cc.fillRect(0, RIVER - 8, W, 4);

    // camera: slow pull-back with a slight rise
    ctx.save();
    const z = lerp(1.12, 1.0, ease(u));
    ctx.translate(W / 2, H * 0.62); ctx.scale(z, z); ctx.translate(-W / 2, -H * 0.62);
    ctx.drawImage(city, 0, 0);
    // river Yesil with rippled reflection
    const rg = ctx.createLinearGradient(0, RIVER, 0, H);
    rg.addColorStop(0, rgba(mix('#6a9cbc', '#2a2b4a', dusk))); rg.addColorStop(1, rgba(mix('#1f4766', '#0c1226', dusk)));
    ctx.fillStyle = rg; ctx.fillRect(-100, RIVER, W + 200, H - RIVER + 200);
    ctx.globalAlpha = 0.55;
    for (let y = RIVER; y < H + 100; y += 4) {
      const src = 2 * RIVER - y - 8;
      if (src < 0) break;
      const off = Math.sin(y * 0.11 - t * 2.4) * (1 + (y - RIVER) * 0.008);
      ctx.drawImage(city, 0, src, W, 4, off, y, W, 4);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = rgba('#ffffff', 0.12); ctx.lineWidth = 1.5;
    for (let k = 0; k < 40; k++) {
      const y = RIVER + 20 + hash(k) * 260, x = (hash(k + 4) * W + t * 20) % W;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40 + hash(k + 2) * 80, y); ctx.stroke();
    }
    ctx.restore();
    const ea = smooth(32.4, 33.4, t) * (1 - smooth(35.6, 36.6, t));
    if (ea > 0) {
      ctx.save(); ctx.globalAlpha = ea * 0.9; ctx.fillStyle = rgba(P.cream); ctx.font = '500 26px "Montserrat"'; ctx.letterSpacing = '10px';
      ctx.textAlign = 'center'; ctx.fillText('ЕСІЛ', W / 2, 850); ctx.restore();
    }
    motes(ctx, 31, 40, t, P.goldL, 0.4 * night, [0, 300, W, 800], 8, 2);
  };
})();

// Chapter 4 — Еңбек пен береке, 46–64 s: oil & gas, mining, metallurgy, energy, agriculture.
const Scene4 = (() => {
  const buf = makeBuffer();
  const dunes = [new Ridge({ seed: 71, base: 700, amp: 60, scale: 500, step: 10 }), new Ridge({ seed: 72, base: 790, amp: 80, scale: 420, step: 10 }), new Ridge({ seed: 73, base: 900, amp: 70, scale: 380, step: 10, width: W + 1000 })];
  const steppe = new Ridge({ seed: 81, base: 760, amp: 40, scale: 700, step: 12, width: W + 1000 });
  const wheat = makeGrass(91, 1500, -100, W + 100, 720, 1120, 40, 190);

  function goldenSky(c, sunX, sunY, warm = 1) {
    sky(c, [[0, '#2f4f7e'], [0.42, mix('#7fa7c8', '#e9a46a', warm * 0.6)], [0.62, '#f6c98a'], [0.72, '#ffe0a8'], [1, '#d9a160']]);
    glow(c, sunX, sunY, 800, P.amber, 0.4);
    glow(c, sunX, sunY, 200, P.sun, 0.8);
    c.fillStyle = rgba(P.sun); c.beginPath(); c.arc(sunX, sunY, 52, 0, TAU); c.fill();
  }

  function pumpjack(c, x, y, s, t, ph, col) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 10; c.beginPath(); c.moveTo(-60, 0); c.lineTo(0, -150); c.lineTo(50, 0); c.stroke();      // samson post
    c.fillRect(-150, -6, 330, 12);
    const a = Math.sin(t * 2.2 + ph) * 0.26;
    c.save(); c.translate(0, -150); c.rotate(a);
    c.fillRect(-130, -8, 260, 16);                                    // walking beam
    c.beginPath(); c.moveTo(-130, -8); c.quadraticCurveTo(-178, 10, -150, 70); c.lineTo(-134, 66); c.quadraticCurveTo(-150, 20, -118, 8); c.fill();   // horse head
    c.restore();
    const bx = Math.cos(a) * 120, by = -150 + Math.sin(a) * 120;
    const crank = t * 2.2 + ph - Math.PI / 2, cx = 120 + Math.cos(crank) * 34, cy = -50 + Math.sin(crank) * 34;
    c.lineWidth = 6; c.beginPath(); c.moveTo(bx, by); c.lineTo(cx, cy); c.stroke();                       // pitman arm
    c.beginPath(); c.arc(120, -50, 44, 0, TAU); c.fill();                                                      // counterweight
    c.lineWidth = 3; const hx = -Math.cos(a) * 150, hy = -150 - Math.sin(a) * 150 + 70;
    c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx, 0); c.stroke();                                              // polished rod
    c.restore();
  }

  function oil(c, t, u) {
    goldenSky(c, 380, 560);
    c.save(); c.translate(-80 * u, 0);
    dunes[0].fill(c, rgba('#c79a64'));
    const fx = 1480, fy = dunes[0].yAt(fx) - 150;                                // gas flare stack
    c.fillStyle = rgba('#5a3c2a'); c.fillRect(fx - 4, fy, 8, 160);
    const fl = 1 + 0.2 * Math.sin(t * 17) + 0.1 * Math.sin(t * 31);
    glow(c, fx, fy - 30, 140, '#ff9a3a', 0.6);
    c.fillStyle = 'rgba(255,190,90,0.95)'; c.beginPath(); c.ellipse(fx + 6, fy - 26 * fl, 12, 30 * fl, 0.2, 0, TAU); c.fill();
    dunes[1].fill(c, rgba('#a8733f'));
    pumpjack(c, 1180, dunes[1].yAt(1180) + 6, 0.55, t, 1.0, rgba('#4a2e1e'));
    pumpjack(c, 1620, dunes[1].yAt(1620) + 6, 0.45, t, 2.4, rgba('#4a2e1e'));
    // pipeline on supports
    c.fillStyle = rgba('#3a2418'); for (let x = -100; x < W + 200; x += 120) c.fillRect(x, 860, 6, 40);
    c.fillStyle = rgba('#6a4a32'); c.fillRect(-100, 846, W + 300, 16);
    dunes[2].fill(c, rgba('#6e4526'));
    pumpjack(c, 520, dunes[2].yAt(520) + 10, 1.25, t, 0, rgba('#22140c'));
    c.restore();
    motes(c, 41, 40, t, P.goldL, 0.4, [0, 400, W, H], 20, 2);
  }

  function mine(c, t, u) {
    goldenSky(c, 1500, 380);
    c.save(); const z = 1.08 - 0.08 * u; c.translate(W / 2, 600); c.scale(z, z); c.translate(-W / 2, -600);
    steppe.fill(c, rgba('#b7854a'));
    const cx = W / 2, top = 690;
    for (let k = 0; k < 9; k++) {                                     // benches of the open pit
      const w = 1500 - k * 140, y = top + k * 44;
      c.fillStyle = rgba(mix('#8a5a34', '#2a1810', k / 9));             // shadowed bench face
      c.beginPath(); c.moveTo(cx - w / 2, y); c.lineTo(cx + w / 2, y); c.lineTo(cx + w / 2 - 60, y + 44); c.lineTo(cx - w / 2 + 60, y + 44); c.fill();
      c.fillStyle = rgba(mix('#e8b878', '#6a4a30', k / 9));             // lit bench floor
      c.beginPath(); c.moveTo(cx - w / 2, y); c.lineTo(cx + w / 2, y); c.lineTo(cx + w / 2 - 18, y + 14); c.lineTo(cx - w / 2 + 18, y + 14); c.fill();
      c.fillStyle = rgba('#fff0c8', 0.5); c.fillRect(cx - w / 2, y, w, 2);
    }
    // haul trucks working the benches
    for (const [k, sp, ph, sc] of [[2, 0.07, 0, 1.6], [4, 0.09, 0.5, 1.2], [6, 0.06, 0.2, 0.9]]) {
      const wk = 1500 - k * 140, tp = (t * sp + ph) % 1;
      const tx = cx - wk / 2 + 90 + tp * (wk - 180), ty = top + k * 44 + 12;
      c.save(); c.translate(tx, ty); c.scale(sc, sc);
      c.fillStyle = rgba('#f2b134'); c.beginPath(); c.moveTo(-40, -36); c.lineTo(22, -36); c.lineTo(28, -14); c.lineTo(-40, -14); c.fill();
      c.fillStyle = rgba('#d08a1c'); c.fillRect(22, -40, 22, 26); c.fillStyle = rgba('#ffe7b0', 0.8); c.fillRect(30, -36, 10, 8);
      c.fillStyle = rgba('#1a120c'); c.beginPath(); c.arc(-24, -8, 10, 0, TAU); c.arc(30, -8, 10, 0, TAU); c.fill();
      c.restore();
      cloud(c, tx - 50 * sc, ty - 10, 50 * sc, 18 * sc, '#f0c890', 0.35);
    }
    // excavator on the lower bench
    const ex = cx - 220, ey = top + 7 * 44 + 10, arm = Math.sin(t * 1.4) * 0.25;
    c.save(); c.translate(ex, ey); c.fillStyle = rgba('#e0a020');
    c.fillRect(-40, -40, 80, 30); c.fillRect(-10, -62, 34, 24);
    c.fillStyle = rgba('#1a120c'); c.fillRect(-46, -12, 92, 14);
    c.strokeStyle = rgba('#d09018'); c.lineWidth = 9; c.lineCap = 'round';
    c.beginPath(); c.moveTo(30, -40); c.lineTo(30 + Math.cos(-0.9 + arm) * 80, -40 + Math.sin(-0.9 + arm) * 80);
    const jx = 30 + Math.cos(-0.9 + arm) * 80, jy = -40 + Math.sin(-0.9 + arm) * 80;
    c.lineTo(jx + Math.cos(1.2 + arm) * 70, jy + Math.sin(1.2 + arm) * 70); c.stroke();
    c.restore();
    // conveyor and plant on the rim
    c.strokeStyle = rgba('#3a2a20'); c.lineWidth = 8; c.beginPath(); c.moveTo(1300, 760); c.lineTo(1640, 600); c.stroke();
    c.fillStyle = rgba('#3a2a20'); c.fillRect(1600, 540, 180, 160); c.fillRect(1660, 470, 30, 80);
    c.restore();
    motes(c, 42, 60, t, '#f2c48a', 0.35, [0, 500, W, H], 30, 3);
  }

  function metal(c, t, u) {
    sky(c, [[0, '#1d1a2a'], [0.6, '#5a2e2a'], [1, '#2a1410']]);
    c.save(); c.translate(-60 * u, 0);
    c.fillStyle = rgba('#140c0c');
    c.fillRect(100, 380, 900, 600); c.fillRect(1000, 300, 500, 700); c.fillRect(1500, 460, 600, 600);
    for (const [x, h] of [[300, 300], [420, 360], [1180, 420], [1320, 380], [1700, 300]]) {
      c.fillRect(x, 380 - h + 80, 34, h);
      for (let k = 0; k < 6; k++) {                                    // drifting smoke
        const age = (t * 0.25 + k / 6 + x * 0.001) % 1;
        cloud(c, x + 17 + age * 160, 380 - h + 70 - age * 260, 50 + age * 110, 40 + age * 70, '#8a7a7a', 0.35 * (1 - age));
      }
    }
    c.restore();
    glow(c, 960, 760, 900, '#ff7a20', 0.45);
    // ladle pouring molten metal
    const lx = 640, ly = 470, tilt = 0.55 + 0.05 * Math.sin(t * 0.8);
    c.strokeStyle = '#120a08'; c.lineWidth = 6;
    c.beginPath(); c.moveTo(lx - 60, 0); c.lineTo(lx - 30, ly - 60); c.moveTo(lx + 90, 0); c.lineTo(lx + 40, ly - 60); c.stroke();
    c.fillStyle = '#120a08'; c.fillRect(lx - 160, 0, 400, 26);
    c.save(); c.translate(lx, ly); c.rotate(tilt);
    const lg = c.createLinearGradient(-170, 0, 170, 0); lg.addColorStop(0, '#120a08'); lg.addColorStop(0.7, '#3a2018'); lg.addColorStop(1, '#6a2c14');
    c.fillStyle = lg;
    c.beginPath(); c.moveTo(-170, -120); c.lineTo(170, -120); c.bezierCurveTo(165, 60, 120, 150, 0, 150); c.bezierCurveTo(-120, 150, -165, 60, -170, -120); c.fill();
    c.fillStyle = '#2a1610'; c.fillRect(-182, -132, 364, 22);
    c.fillStyle = '#ffcf6a'; c.fillRect(-170, -126, 340, 6);
    c.fillStyle = '#120a08'; c.beginPath(); c.arc(-176, -40, 16, 0, TAU); c.arc(176, -40, 16, 0, TAU); c.fill();
    c.restore();
    const lipX = lx + Math.cos(tilt) * 170 + Math.sin(tilt) * 120, lipY = ly + Math.sin(tilt) * 170 - Math.cos(tilt) * 120;
    const sg = c.createLinearGradient(lipX, lipY, lipX, 1000);
    sg.addColorStop(0, '#fff3c0'); sg.addColorStop(0.4, '#ffb030'); sg.addColorStop(1, '#ff6a10');
    c.fillStyle = sg;
    c.beginPath(); c.moveTo(lipX - 6, lipY);
    for (let y = lipY; y < 960; y += 20) c.lineTo(lipX + 30 * inv(lipY, 960, y) ** 0.5 * 3 - 14 + Math.sin(y * 0.05 - t * 12) * 3, y);
    for (let y = 960; y > lipY; y -= 20) c.lineTo(lipX + 30 * inv(lipY, 960, y) ** 0.5 * 3 + 14 + Math.sin(y * 0.05 - t * 12) * 3, y);
    c.fill();
    glow(c, lipX + 60, 940, 380, '#ffb040', 0.8);
    c.fillStyle = '#ff8a20'; c.fillRect(0, 960, W, 140);
    c.fillStyle = 'rgba(255,230,160,0.5)'; c.fillRect(0, 958, W, 4);
    // sparks
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 160; i++) {
      const life = (t * 0.9 + hash(i)) % 1, ang = -Math.PI / 2 + (hash(i + 3) - 0.5) * 2.6, sp = 300 + hash(i + 7) * 500;
      const x = lipX + 60 + Math.cos(ang) * sp * life, y = 950 + Math.sin(ang) * sp * life + 500 * life * life;
      c.strokeStyle = `rgba(255,${180 + hash(i) * 60 | 0},90,${1 - life})`; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x - Math.cos(ang) * 14, y - Math.sin(ang) * 14 - 8 * life); c.stroke();
    }
    c.restore();
  }

  function turbine(c, x, y, s, t, ph) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#f2f0ea';
    c.beginPath(); c.moveTo(-7, 0); c.lineTo(-3, -300); c.lineTo(3, -300); c.lineTo(7, 0); c.fill();
    c.fillRect(-10, -308, 26, 14);
    c.translate(0, -302);
    const a = t * 1.3 + ph;
    for (let k = 0; k < 3; k++) {
      c.save(); c.rotate(a + (k * TAU) / 3);
      c.beginPath(); c.moveTo(0, -5); c.quadraticCurveTo(26, -60, 6, -150); c.lineTo(-4, -150); c.lineTo(-5, -5); c.fill();
      c.restore();
    }
    c.beginPath(); c.arc(0, 0, 7, 0, TAU); c.fill();
    c.restore();
  }

  function energy(c, t, u) {
    goldenSky(c, 1350, 620);
    c.save(); c.translate(-90 * u, 0);
    steppe.fill(c, rgba('#c59a5c'), 0, -20);
    for (const [x, s, ph] of [[300, 0.55, 0], [560, 0.7, 1], [880, 0.5, 2], [1180, 0.85, 3], [1560, 0.62, 4], [1860, 0.5, 5]]) turbine(c, x, steppe.yAt(x) - 10 + (1 - s) * 60, s, t, ph);
    // pylons and catenary wires
    const py = [[-120, 1], [420, 1.0], [960, 1.0], [1500, 1.0], [2040, 1]];
    c.strokeStyle = '#3a2c22'; c.lineWidth = 4;
    for (const [x] of py) { c.beginPath(); c.moveTo(x - 30, 920); c.lineTo(x, 640); c.lineTo(x + 30, 920); c.moveTo(x - 44, 690); c.lineTo(x + 44, 690); c.moveTo(x - 30, 740); c.lineTo(x + 30, 740); c.stroke(); }
    c.lineWidth = 1.5;
    for (let i = 0; i < py.length - 1; i++) for (const [dx, dy] of [[-44, 690], [44, 690], [-30, 740], [30, 740]]) {
      const x0 = py[i][0] + dx, x1 = py[i + 1][0] + dx;
      c.beginPath(); c.moveTo(x0, dy); c.quadraticCurveTo((x0 + x1) / 2, dy + 70, x1, dy); c.stroke();
    }
    // solar rows glinting
    for (let row = 0; row < 4; row++) for (let k = 0; k < 14; k++) {
      const x = 80 + k * 140 + row * 30, y = 930 + row * 40;
      c.fillStyle = rgba(mix('#1d3a5c', '#ffd890', 0.25 + 0.25 * Math.sin(t * 2 + k * 0.6 + row)));
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 120, y); c.lineTo(x + 108, y + 26); c.lineTo(x - 12, y + 26); c.fill();
    }
    c.restore();
  }

  function farm(c, t, u) {
    goldenSky(c, 1450, 520);
    c.save(); const z = 1 + 0.06 * u; c.translate(W / 2, 760); c.scale(z, z); c.translate(-W / 2, -760);
    steppe.fill(c, rgba('#d9a85a'), 0, -40);
    for (const [x, h] of [[1580, 170], [1650, 200], [1720, 170]]) {                  // grain elevator
      c.fillStyle = rgba('#c9b08a'); c.fillRect(x, 720 - h, 62, h); c.beginPath(); c.ellipse(x + 31, 720 - h, 31, 10, 0, 0, TAU); c.fill();
    }
    c.fillStyle = rgba('#e3b465'); c.fillRect(-200, 720, W + 400, 500);
    // combine harvester, backlit, moving through the field
    const hx = lerp(-200, 1100, u), hy = 744;
    for (let k = 0; k < 7; k++) cloud(c, hx - 60 - k * 70, hy - 50 - k * 12, 70 + k * 24, 34 + k * 6, '#f6d898', 0.28);
    c.save(); c.translate(hx, hy);
    c.fillStyle = rgba('#2e3a22');
    roundRect(c, -120, -120, 220, 100, 14); c.fill();                  // body
    c.fillRect(-100, -150, 120, 34);                                    // grain tank
    c.fillStyle = rgba('#24301c'); c.fillRect(40, -186, 70, 70);         // cab
    c.fillStyle = 'rgba(255,226,150,0.75)'; c.fillRect(50, -178, 52, 40);
    c.strokeStyle = rgba('#2e3a22'); c.lineWidth = 10; c.beginPath(); c.moveTo(-90, -140); c.lineTo(-170, -200); c.lineTo(-200, -196); c.stroke();
    c.fillStyle = rgba('#1c2414'); c.fillRect(100, -54, 150, 30);       // header
    c.save(); c.translate(180, -70);                                    // rotating reel
    c.strokeStyle = rgba('#1c2414'); c.lineWidth = 5;
    for (let k = 0; k < 5; k++) { const a = t * 3 + (k * TAU) / 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 34, Math.sin(a) * 34); c.stroke(); }
    c.restore();
    c.fillStyle = rgba('#141a10'); c.beginPath(); c.arc(-50, -14, 40, 0, TAU); c.fill(); c.beginPath(); c.arc(70, -4, 26, 0, TAU); c.fill();
    c.restore();
    drawGrass(c, wheat, t, '#b88a3c', '#ffeaa8', 0.8, 0, 1);
    c.restore();
    motes(c, 44, 80, t, P.goldL, 0.5, [0, 300, W, H], 18, 2.5);
  }

  const list = [{ s: 46, e: 52.4, fn: oil }, { s: 52.4, e: 54.3, fn: mine }, { s: 54.3, e: 56.2, fn: metal }, { s: 56.2, e: 58.8, fn: energy }, { s: 58.8, e: 64.6, fn: farm }];
  return function (ctx, t) { shots(ctx, t, list, buf); };
})();
