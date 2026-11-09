// Chapter 7 — Табиғат пен мұра, 96–112 s: Alatau, Charyn, Caspian, Burabay, Yasawi, Tamgaly.
const Scene7 = (() => {
  const buf = makeBuffer();
  const alatau = new Ridge({ seed: 121, base: 640, amp: 430, scale: 300, step: 4, kind: 'ridged', pow: 1.6 });
  const alatau2 = new Ridge({ seed: 122, base: 700, amp: 240, scale: 220, step: 5, kind: 'ridged', pow: 1.3 });
  const forestHill = new Ridge({ seed: 123, base: 760, amp: 120, scale: 260, step: 6 });
  const spruce = Array.from({ length: 90 }, (_, i) => [hash(i) * (W + 200) - 100, hash(i + 0.4), 0.6 + hash(i + 0.8) * 0.8]);
  const pines = Array.from({ length: 260 }, (_, i) => [hash(i + 50) * (W + 300) - 150, hash(i + 50.4), 0.5 + hash(i + 50.8) * 0.7]);
  const burHill = [new Ridge({ seed: 131, base: 620, amp: 150, scale: 380, step: 6 }), new Ridge({ seed: 132, base: 680, amp: 110, scale: 300, step: 6 })];

  function tree(c, x, y, h, col) {
    c.fillStyle = col; c.beginPath();
    c.moveTo(x, y - h);
    for (let k = 1; k <= 4; k++) { const yy = y - h + (h * k) / 4.4, w = h * 0.1 * k; c.lineTo(x + w, yy); c.lineTo(x + w * 0.45, yy - h * 0.04); }
    for (let k = 4; k >= 1; k--) { const yy = y - h + (h * k) / 4.4, w = h * 0.1 * k; c.lineTo(x - w * 0.45, yy - h * 0.04); c.lineTo(x - w, yy); }
    c.closePath(); c.fill();
    c.fillRect(x - h * 0.02, y - h * 0.12, h * 0.04, h * 0.14);
  }

  function snowLeopard(c, x, y, s, t) {
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#9aa2ac';
    c.beginPath(); c.moveTo(-90, -40); c.bezierCurveTo(-60, -78, 40, -80, 70, -56); c.bezierCurveTo(90, -40, 84, -14, 60, -10);
    c.lineTo(-80, -10); c.bezierCurveTo(-100, -16, -104, -30, -90, -40); c.fill();                    // body
    c.beginPath(); c.ellipse(96, -78, 26, 22, -0.2, 0, TAU); c.fill();                                  // head
    c.beginPath(); c.moveTo(86, -96); c.lineTo(90, -112); c.lineTo(100, -98); c.fill();
    c.beginPath(); c.moveTo(70, -60); c.lineTo(84, -84); c.lineTo(104, -64); c.fill();                  // neck
    c.lineCap = 'round'; c.strokeStyle = '#9aa2ac';
    for (const [lx, d] of [[-70, 0], [-50, 0.5], [40, 0.25], [58, 0.75]]) {
      c.lineWidth = 16; c.beginPath(); c.moveTo(lx, -24); c.lineTo(lx + Math.sin(t * 1.2 + d * TAU) * 4, 10); c.stroke();
    }
    c.lineWidth = 22; c.beginPath(); c.moveTo(-92, -36);                                                 // the long thick tail
    c.bezierCurveTo(-170, -20, -200, 40 + Math.sin(t * 1.3) * 8, -150, 60 + Math.sin(t * 1.1) * 10); c.stroke();
    c.fillStyle = 'rgba(40,44,54,0.75)';                                                                  // rosettes
    for (let k = 0; k < 26; k++) { c.beginPath(); c.arc(-80 + hash(k) * 150, -66 + hash(k + 1) * 48, 4 + hash(k + 2) * 4, 0, TAU); c.fill(); }
    c.fillStyle = '#d8dde2'; c.beginPath(); c.ellipse(-10, -16, 70, 8, 0, 0, TAU); c.fill();              // pale belly
    c.restore();
  }

  function alatauShot(c, t, u) {
    sky(c, [[0, '#2a5a8c'], [0.45, '#8ebfe0'], [0.62, '#e8eef0'], [1, '#b8d6dc']]);
    c.save(); c.translate(-50 * u, 0);
    for (let i = 0; i < 4; i++) cloud(c, 300 + i * 480 + t * 14, 250 + (i % 2) * 70, 300, 40, '#ffffff', 0.55);
    alatau.fillGrad(c, '#ffffff', '#4a6a8a', 0.42);
    haze(c, 380, 640, '#dce8f0', 0.6);
    alatau2.fillGrad(c, '#f2f6fa', '#2e4e6a', 0.3);
    forestHill.fill(c, rgba('#1d3a3a'));
    for (const [x, d, sc] of spruce) tree(c, x, forestHill.yAt(x) + 20 + d * 120, 70 * sc + d * 40, rgba(mix('#1e4038', '#0e2420', d)));
    // turquoise lake with mirrored peaks
    const ly = 820;
    const lg = c.createLinearGradient(0, ly, 0, H); lg.addColorStop(0, '#2fb7b4'); lg.addColorStop(1, '#0f5a62');
    c.fillStyle = lg; c.fillRect(-100, ly, W + 300, 400);
    c.save(); c.beginPath(); c.rect(-100, ly, W + 300, 400); c.clip();
    c.translate(0, 2 * ly); c.scale(1, -1); c.globalAlpha = 0.28;
    alatau.fillGrad(c, '#ffffff', '#2e6a7a', 0.42, 0, 180);
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 1.5;
    for (let k = 0; k < 30; k++) { const y = ly + 10 + hash(k) * 240, x = (hash(k + 1) * W + t * 15) % W; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 60, y); c.stroke(); }
    c.restore();
    // snow leopard on a rock in the foreground
    c.fillStyle = '#121822'; c.beginPath(); c.moveTo(-50, H); c.lineTo(-50, 760); c.quadraticCurveTo(200, 700, 480, 790); c.lineTo(560, H); c.fill();
    snowLeopard(c, 250 + 20 * u, 735, 1.15, t);
  }

  function canyon(c, t, u) {
    sky(c, [[0, '#3a6ea0'], [0.5, '#a8cbe0'], [1, '#f2d6b0']]);
    c.save(); c.translate(-120 * u, 0);
    const layers = [[0.35, 520, '#d98a5c', '#b0603c', 11], [0.65, 610, '#c4552e', '#8a3a22', 23], [1, 720, '#a8401f', '#5e2414', 37]];
    for (const [k, base, lit, dark, seed] of layers) {
      const r = mulberry32(seed);
      let x = -200;
      while (x < W + 300) {
        const w = 90 + r() * 240, h = (60 + r() * 300) * k;
        const top = base - h;
        const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, lit); g.addColorStop(1, dark);
        c.fillStyle = g;
        const j1 = r() * 40 - 20, j2 = r() * 50, j3 = r() * 30 - 15;
        c.beginPath(); c.moveTo(x - 6, H); c.lineTo(x + w * 0.12, top + 20 + j3); c.lineTo(x + w * 0.3, top + j1); c.lineTo(x + w * 0.55, top + 8);
        c.lineTo(x + w * 0.7, top - j2 * 0.4); c.lineTo(x + w * 0.88, top + 26 + j1); c.lineTo(x + w + 6, H); c.fill();
        c.strokeStyle = rgba(dark, 0.6); c.lineWidth = 1.5;                     // strata
        for (let s = 0; s < 6; s++) { const yy = top + 30 + s * 28 * k; c.beginPath(); c.moveTo(x + 4, yy); c.lineTo(x + w - 4, yy + 4); c.stroke(); }
        x += w * (0.55 + r() * 0.5);
      }
      haze(c, base - 200, base + 80, '#f2c8a0', 0.25);
    }
    const rg = c.createLinearGradient(0, 900, 0, H); rg.addColorStop(0, '#3ab0a8'); rg.addColorStop(1, '#1a6a6a');
    c.fillStyle = rg; c.beginPath(); c.moveTo(-200, 930); c.quadraticCurveTo(W / 2, 880, W + 300, 940); c.lineTo(W + 300, H + 10); c.lineTo(-200, H + 10); c.fill();
    c.restore();
  }

  function caspian(c, t, u) {
    sky(c, [[0, '#2c3a6a'], [0.4, '#c46f6a'], [0.52, '#ffb070'], [0.56, '#ffd8a0']]);
    const hy = 590, sx = 860;
    glow(c, sx, hy - 60, 700, P.amber, 0.5);
    c.fillStyle = rgba(P.sun); c.beginPath(); c.arc(sx, hy - 60, 60, 0, TAU); c.fill();
    const sea = c.createLinearGradient(0, hy, 0, H); sea.addColorStop(0, '#d0805a'); sea.addColorStop(0.3, '#4a5a7a'); sea.addColorStop(1, '#1a2440');
    c.fillStyle = sea; c.fillRect(0, hy, W, H - hy);
    c.save(); c.globalCompositeOperation = 'lighter';                         // glitter path
    for (let k = 0; k < 160; k++) {
      const y = hy + 6 + Math.pow(hash(k), 1.6) * (H - hy), spread = 30 + (y - hy) * 0.5;
      const x = sx + (hash(k + 3) - 0.5) * spread * 2 + Math.sin(t * 2 + k) * 6;
      c.fillStyle = `rgba(255,214,150,${0.5 * (0.5 + 0.5 * Math.sin(t * 5 + k * 2))})`; c.fillRect(x, y, 10 + (y - hy) * 0.08, 2);
    }
    c.restore();
    for (let k = 0; k < 9; k++) {                                             // rolling waves
      const p = (t * 0.25 + k / 9) % 1, y = hy + 20 + Math.pow(p, 2.2) * (H - hy);
      c.strokeStyle = `rgba(255,236,210,${0.15 + 0.35 * p})`; c.lineWidth = 1 + p * 3;
      c.beginPath(); for (let x = -20; x <= W + 20; x += 30) c.lineTo(x, y + Math.sin(x * 0.01 + k + t) * 4 * (1 + p * 3)); c.stroke();
    }
    // chalk cliffs of the eastern shore
    c.fillStyle = '#e8d2b8'; c.beginPath(); c.moveTo(1420, H); c.lineTo(1440, 520); c.lineTo(1560, 500); c.lineTo(1600, 470); c.lineTo(W + 40, 460); c.lineTo(W + 40, H); c.fill();
    c.fillStyle = 'rgba(160,100,80,0.5)'; c.beginPath(); c.moveTo(1420, H); c.lineTo(1440, 520); c.lineTo(1500, 520); c.lineTo(1480, H); c.fill();
    for (let k = 0; k < 5; k++) {                                             // gulls
      const gx = (300 + k * 170 + t * 40) % W, gy = 300 + k * 30 + Math.sin(t + k) * 10, f = Math.sin(t * 6 + k) * 8;
      c.strokeStyle = '#2a1e28'; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - 18, gy - f); c.quadraticCurveTo(gx - 8, gy - 6, gx, gy); c.quadraticCurveTo(gx + 8, gy - 6, gx + 18, gy - f); c.stroke();
    }
  }

  function burabay(c, t, u) {
    sky(c, [[0, '#5a86b0'], [0.5, '#cfe0e8'], [1, '#f2ead6']]);
    c.save(); const z = 1.04 - 0.04 * u; c.translate(W / 2, 600); c.scale(z, z); c.translate(-W / 2, -600);
    burHill[0].fill(c, rgba('#5f7a72'));
    haze(c, 470, 640, '#e8eee8', 0.5);
    burHill[1].fill(c, rgba('#2f4a3c'));
    for (const [x, d, sc] of pines) tree(c, x, burHill[1].yAt(x) + 20 + d * 90, 40 * sc + d * 30, rgba(mix('#2a4a36', '#122a1e', d)));
    const ly = 760;
    const lg = c.createLinearGradient(0, ly, 0, H); lg.addColorStop(0, '#9ab8c4'); lg.addColorStop(1, '#3a5a6a');
    c.fillStyle = lg; c.fillRect(-100, ly, W + 300, 400);
    // granite rock rising from the lake, reflected
    // granite formation rising from the lake; sgn = -1 draws its reflection
    const rock = (sgn, a) => {
      c.save(); c.globalAlpha = a; c.translate(1240, ly); c.scale(1, sgn);
      const g = c.createLinearGradient(-120, 0, 120, 0); g.addColorStop(0, '#5a524e'); g.addColorStop(0.4, '#a8988a'); g.addColorStop(1, '#4a4440');
      c.fillStyle = g;
      c.beginPath(); c.moveTo(-150, 0); c.bezierCurveTo(-150, -60, -110, -90, -100, -140); c.bezierCurveTo(-110, -190, -70, -220, -60, -250);
      c.bezierCurveTo(-60, -300, -20, -330, 10, -320); c.bezierCurveTo(50, -310, 60, -270, 50, -240); c.bezierCurveTo(90, -210, 80, -170, 70, -150);
      c.bezierCurveTo(120, -120, 130, -60, 170, 0); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(40,30,30,0.45)'; c.lineWidth = 3;
      for (const [x0, y0, x1, y1] of [[-100, -140, 60, -150], [-60, -250, 40, -240], [-130, -60, 120, -70], [-20, -320, -30, -170]]) { c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + 12, x1, y1); c.stroke(); }
      c.fillStyle = '#1e3a2a'; for (const [tx, ty, th] of [[-80, -230, 34], [30, -300, 26], [80, -150, 30]]) tree(c, tx, ty, th, '#1e3a2a');
      c.restore();
    };
    rock(1, 1); rock(-1, 0.3);
    c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 1.2;
    for (let k = 0; k < 24; k++) { const y = ly + 12 + hash(k) * 260, x = (hash(k + 1) * W + t * 10) % W; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 70, y); c.stroke(); }
    for (let i = 0; i < 4; i++) cloud(c, (i * 520 + t * 30) % (W + 600) - 300, 700 + i * 10, 420, 30, '#ffffff', 0.35);
    c.restore();
  }

  function yasawi(c, t, u) {
    sky(c, [[0, '#2a3a6a'], [0.45, '#d9876a'], [0.66, '#ffcf8a'], [1, '#e8a868']]);
    glow(c, 1520, 620, 700, P.amber, 0.5);
    c.save(); const z = 1.08 - 0.08 * u; c.translate(W / 2, 760); c.scale(z, z); c.translate(-W / 2, -760);
    const gy = 860, brick = '#c79a68', shade = '#8a6240', tile = '#2aa6b4';
    // big ribbed dome behind on the right
    c.fillStyle = shade; c.fillRect(1090, 470, 330, 120);
    const dg = c.createLinearGradient(1090, 0, 1420, 0); dg.addColorStop(0, '#1e7c8a'); dg.addColorStop(0.5, '#4ad0d4'); dg.addColorStop(1, '#1a6a78');
    c.fillStyle = dg; c.beginPath(); c.moveTo(1100, 480); c.bezierCurveTo(1100, 300, 1410, 300, 1410, 480); c.fill();
    c.strokeStyle = 'rgba(10,60,70,0.6)'; c.lineWidth = 2;
    for (let k = 1; k < 12; k++) { const x = lerp(1100, 1410, k / 12); c.beginPath(); c.moveTo(x, 480); c.quadraticCurveTo((x + 1255) / 2, 340, 1255, 345); c.stroke(); }
    // main body
    c.fillStyle = brick; c.fillRect(380, 560, 1160, gy - 560);
    c.fillStyle = shade; c.fillRect(380, 560, 1160, 14);
    for (let k = 0; k < 9; k++) { c.fillStyle = 'rgba(80,50,30,0.35)'; c.fillRect(1040 + k * 54, 600, 30, 200); }
    // monumental portal (peshtak) with flanking towers
    c.fillStyle = '#d6aa76'; c.fillRect(560, 330, 420, gy - 330);
    c.fillStyle = shade; for (const x of [560, 940]) { c.beginPath(); c.moveTo(x, gy); c.lineTo(x + 6, 320); c.lineTo(x + 34, 320); c.lineTo(x + 40, gy); c.fill(); }
    c.fillStyle = '#6a4428'; c.beginPath(); c.moveTo(650, gy); c.lineTo(650, 520); c.quadraticCurveTo(650, 410, 770, 380); c.quadraticCurveTo(890, 410, 890, 520); c.lineTo(890, gy); c.fill();
    c.fillStyle = tile; c.fillRect(600, 350, 340, 10); c.fillRect(600, 372, 340, 4);
    c.strokeStyle = tile; c.lineWidth = 0.12;
    for (let k = 0; k < 6; k++) { c.save(); c.translate(620 + k * 60, 470); ramHorn(c, 18); c.restore(); }
    // small dome on the left
    c.fillStyle = '#3ab4bc'; c.beginPath(); c.moveTo(400, 560); c.bezierCurveTo(400, 470, 520, 470, 520, 560); c.fill();
    c.fillStyle = '#a07a50'; c.fillRect(-100, gy, W + 200, 300);
    c.restore();
    for (let k = 0; k < 6; k++) {                                   // birds over the dome
      const bx = (k * 180 + t * 50) % (W + 200) - 100, by = 260 + Math.sin(t * 0.8 + k) * 30 + k * 12, f = Math.sin(t * 7 + k) * 6;
      c.strokeStyle = '#2a1a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(bx - 12, by - f); c.lineTo(bx, by); c.lineTo(bx + 12, by - f); c.stroke();
    }
    label(c, 'ТҮРКІСТАН', t, 105.6, 108.4);
  }

  function petro(c, t, u) {
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2a1a1e'); bg.addColorStop(1, '#120c0c');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.save(); c.translate(-40 * u, 0);
    const rocks = [[460, 520, 520, 380, '#4a2e2a'], [1180, 470, 600, 420, '#563428'], [860, 860, 820, 280, '#3e2622']];
    for (const [x, y, rx, ry, col] of rocks) {
      const g = c.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 20, x, y, rx);
      g.addColorStop(0, '#7a4a38'); g.addColorStop(1, col);
      c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, 0.05, 0, TAU); c.fill();
      c.save(); c.clip();
      for (let k = 0; k < 40; k++) { c.fillStyle = `rgba(20,10,10,${0.08 + hash(k + x) * 0.12})`; c.beginPath(); c.ellipse(x + (hash(k + y) - 0.5) * rx * 1.8, y + (hash(k * 3 + x) - 0.5) * ry * 1.8, 20 + hash(k) * 70, 10 + hash(k + 2) * 30, hash(k) * 3, 0, TAU); c.fill(); }
      c.strokeStyle = 'rgba(15,8,8,0.5)'; c.lineWidth = 2;
      for (let k = 0; k < 6; k++) { const cx = x + (hash(k + x * 2) - 0.5) * rx * 1.6, cy = y + (hash(k + y * 2) - 0.5) * ry * 1.4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 40, cy + 30 * hash(k)); c.lineTo(cx + 90, cy + 10); c.stroke(); }
      c.restore();
    }
    // carved figures revealed one by one, glowing gold
    const figs = [
      [700, 420, (g) => { g.beginPath(); g.arc(0, -60, 22, 0, TAU); g.stroke(); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.beginPath(); g.moveTo(Math.cos(a) * 28, -60 + Math.sin(a) * 28); g.lineTo(Math.cos(a) * 42, -60 + Math.sin(a) * 42); g.stroke(); }
        g.beginPath(); g.moveTo(0, -36); g.lineTo(0, 30); g.moveTo(-34, -14); g.lineTo(0, -6); g.lineTo(34, -14); g.moveTo(0, 30); g.lineTo(-22, 70); g.moveTo(0, 30); g.lineTo(22, 70); g.stroke(); }],
      [1120, 380, (g) => { g.beginPath(); g.moveTo(-60, 0); g.lineTo(50, 0); g.moveTo(-50, 0); g.lineTo(-56, 50); g.moveTo(-36, 0); g.lineTo(-30, 50); g.moveTo(30, 0); g.lineTo(26, 50); g.moveTo(44, 0); g.lineTo(50, 50);
        g.moveTo(50, 0); g.lineTo(70, -30); g.lineTo(84, -26); g.moveTo(66, -30); g.quadraticCurveTo(40, -110, 0, -80); g.moveTo(74, -34); g.quadraticCurveTo(90, -110, 50, -110); g.stroke(); }],
      [1360, 560, (g) => { g.beginPath(); g.moveTo(-50, 0); g.lineTo(40, 0); g.moveTo(-40, 0); g.lineTo(-44, 40); g.moveTo(30, 0); g.lineTo(34, 40); g.moveTo(40, 0); g.lineTo(60, -26); g.moveTo(-50, 0); g.lineTo(-64, 20);
        g.moveTo(0, 0); g.lineTo(-4, -46); g.moveTo(-4, -46); g.arc(-4, -56, 9, Math.PI / 2, Math.PI / 2 + TAU); g.stroke(); }],
      [420, 560, (g) => { for (let k = 0; k < 3; k++) { g.save(); g.translate(k * 56 - 56, 0); g.beginPath(); g.arc(0, -50, 10, 0, TAU); g.moveTo(0, -40); g.lineTo(0, 10); g.moveTo(-26, -40); g.lineTo(0, -26); g.lineTo(26, -40); g.moveTo(0, 10); g.lineTo(-16, 46); g.moveTo(0, 10); g.lineTo(16, 46); g.stroke(); g.restore(); } }],
      [960, 640, (g) => { g.beginPath(); g.moveTo(-60, 0); g.quadraticCurveTo(-20, -40, 0, -10); g.quadraticCurveTo(20, -50, 50, -6); g.lineTo(70, -30); g.moveTo(-50, 0); g.lineTo(-50, 40); g.moveTo(-30, 0); g.lineTo(-30, 40); g.moveTo(30, 0); g.lineTo(30, 40); g.moveTo(44, 0); g.lineTo(44, 40); g.stroke(); }],
    ];
    figs.forEach(([x, y, draw], i) => {
      const a = smooth(108.4 + i * 0.55, 109.4 + i * 0.55, t);
      if (a <= 0) return;
      glow(c, x, y - 20, 160, P.gold, 0.35 * a);
      c.save(); c.translate(x, y); c.globalAlpha = a;
      c.strokeStyle = rgba(P.goldL); c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
      c.shadowColor = 'rgba(255,190,80,0.9)'; c.shadowBlur = 18; draw(c);
      c.restore();
    });
    c.restore();
    // a warm beam of light sweeping across the rock
    c.save(); c.globalCompositeOperation = 'lighter';
    const bx = lerp(-300, W + 300, inv(107.8, 112.6, t));
    const bg2 = c.createLinearGradient(bx - 300, 0, bx + 300, 0);
    bg2.addColorStop(0, 'rgba(255,190,110,0)'); bg2.addColorStop(0.5, 'rgba(255,190,110,0.16)'); bg2.addColorStop(1, 'rgba(255,190,110,0)');
    c.fillStyle = bg2; c.fillRect(0, 0, W, H); c.restore();
    motes(c, 71, 60, t, P.goldL, 0.5, [0, 0, W, H], 8, 2);
    label(c, 'ТАҢБАЛЫ', t, 108.6, 111.6);
  }

  function label(c, text, t, a0, a1) {
    const a = smooth(a0, a0 + 0.6, t) * (1 - smooth(a1 - 0.6, a1, t));
    if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.textAlign = 'right'; c.fillStyle = rgba(P.cream);
    c.font = '500 26px "Montserrat"'; c.letterSpacing = '10px'; c.fillText(text, W - 120, 150);
    c.strokeStyle = rgba(P.gold, 0.85); c.lineWidth = 1.5; c.beginPath(); c.moveTo(W - 120 - 230, 168); c.lineTo(W - 120, 168); c.stroke();
    c.restore();
  }

  const list = [{ s: 96, e: 99.0, fn: alatauShot }, { s: 99.0, e: 100.8, fn: canyon }, { s: 100.8, e: 102.4, fn: caspian },
    { s: 102.4, e: 105.4, fn: burabay }, { s: 105.4, e: 108.6, fn: yasawi }, { s: 108.6, e: 112.6, fn: petro }];
  return function (ctx, t) { shots(ctx, t, list, buf, 0.4); };
})();

// Chapter 8 — Мәңгілік ел, 112–130 s: the patriotic finale.
const Scene8 = (() => {
  const buf = makeBuffer();
  const flag = makeFlagCanvas(1000, 500);
  const hill = new Ridge({ seed: 141, base: 900, amp: 90, scale: 900, step: 10, width: W + 900 });
  const far = new Ridge({ seed: 142, base: 760, amp: 60, scale: 500, step: 10 });
  const grass = makeGrass(143, 420, -150, W + 150, 930, 1120, 40, 130);

  function finaleSky(c, t, k = 1) {
    sky(c, [[0, '#1d3a6a'], [0.35, '#6a7ab0'], [0.55, '#f0a070'], [0.68, '#ffd08a'], [0.78, '#ffe6b0'], [1, '#c8884a']]);
  }

  function skyline(c, a) {
    c.save(); c.globalAlpha = a; c.fillStyle = '#6a4a5a';
    const r = mulberry32(9);
    for (let x = 160; x < 820; x += 26 + r() * 30) { const h = 20 + r() * 70; c.fillRect(x, 760 - h, 18 + r() * 14, h); }
    c.fillRect(470, 610, 8, 150);                                           // Baiterek on the horizon
    c.beginPath(); c.arc(474, 600, 14, 0, TAU); c.fill();
    c.fillStyle = '#ffd68a'; c.beginPath(); c.arc(474, 600, 9, 0, TAU); c.fill();
    c.restore();
  }

  const family = [
    [790, 165, { hat: 'kalpak', robe: true, staff: true }], [850, 150, { hat: 'kimeshek', robe: true }],
    [940, 185, { armL: 0.4, armR: -2.6 }], [1000, 160, { hair: true, robe: true, armL: 0.3 }], [1052, 110, { armR: -2.4 }],
    [1110, 120, { hair: true, armL: 2.5 }], [1180, 175, {}], [1236, 160, { hair: true, robe: true }],
  ];

  function people(c, y0, t, col) {
    for (const [x, h, pose] of family) {
      const yy = hill.yAt(x) + 18;
      const p = Object.assign({}, pose);
      if (p.armR && p.armR < -2) p.armR += Math.sin(t * 2.2 + x) * 0.15;
      if (p.armL && p.armL > 2) p.armL += Math.sin(t * 2.4 + x) * 0.15;
      person(c, x, yy + y0, h, p, col);
      if (x === 940) person(c, x - 4, yy + y0 - 168, 80, { armL: 2.4, armR: -2.4 }, col);   // child on father's shoulders
    }
  }

  function wide(c, t, u) {
    finaleSky(c, t);
    const sx = 1200, sy = 640;
    glow(c, sx, sy, 1000, P.amber, 0.5); glow(c, sx, sy, 300, P.sun, 0.9);
    c.fillStyle = rgba(P.sun); c.beginPath(); c.arc(sx, sy, 64, 0, TAU); c.fill();
    godRays(c, sx, sy, 24, 1500, 0.025, P.goldL, 0.08, t * 0.03);
    c.save(); const z = 1 + 0.06 * ease(u); c.translate(W / 2, 800); c.scale(z, z); c.translate(-W / 2, -800);
    far.fill(c, rgba('#9a6a6a'));
    skyline(c, 0.9);
    haze(c, 640, 800, '#ffcf9a', 0.45);
    hill.fill(c, rgba('#4a3020'));
    // flag hoisted on the hill
    const px = 1400, py = hill.yAt(1400) + 10;
    c.fillStyle = '#e8e2d6'; c.fillRect(px - 4, py - 520, 8, 520);
    glow(c, px, py - 524, 20, '#fff', 0.8);
    const fy = lerp(py - 120, py - 520, ease(inv(112.4, 116.4, t)));
    wavingFlag(c, flag, px + 4, fy, 420, 210, t, 1);
    people(c, 0, t, '#1c120e');
    c.restore();
    c.fillStyle = '#2a1a10'; c.fillRect(0, 1000, W, 100);
    drawGrass(c, grass, t, '#2a1a10', '#ffd890', 1.1, 0, 0.7);
    motes(c, 81, 70, t, P.goldL, 0.6, [0, 200, W, H], 16, 2.4);
  }

  function flagClose(c, t, u) {
    finaleSky(c, t);
    const sx = 1300 - 120 * u, sy = 480;
    glow(c, sx, sy, 1100, P.amber, 0.55); glow(c, sx, sy, 380, P.sun, 0.95);
    godRays(c, sx, sy, 32, 1800, 0.022, P.goldL, 0.12, t * 0.04);
    c.save(); const z = 1.1 + 0.08 * u; c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    c.fillStyle = '#efe8dc'; c.fillRect(250, 120, 14, 1000);
    wavingFlag(c, flag, 264, 200, 1300, 650, t * 0.9, 1.6);
    c.restore();
    glow(c, sx, sy, 420, '#fff6dc', 0.35);
    const ep = inv(121.0, 125.6, t);                                          // eagle crossing toward the sun
    if (ep > 0 && ep < 1) eagle(c, lerp(-200, sx + 60, easeOut(ep)), lerp(700, sy + 20, easeOut(ep)), lerp(1.3, 0.35, ep), t, '#1c120e', -0.5, 0.7);
    motes(c, 82, 90, t, P.goldL, 0.7, [0, 0, W, H], 20, 2.6);
  }

  function final(c, t, u) {
    finaleSky(c, t);
    const sx = W / 2, sy = 470;
    glow(c, sx, sy, 1200, P.amber, 0.6);
    glow(c, sx, sy, 420, P.sun, 0.85);
    godRays(c, sx, sy, 32, 1800, 0.02, P.goldL, 0.14, t * 0.05);
    flagSun(c, sx, sy, 92, '#ffe6a0', smooth(125.2, 126.6, t), t * 0.06);
    c.save(); c.translate(0, 120);
    hill.fill(c, rgba('#2a1a12'));
    people(c, 0, t, '#160e0a');
    c.restore();
    c.fillStyle = '#160e0a'; c.fillRect(0, 1040, W, 60);
    motes(c, 83, 110, t, P.goldL, 0.8, [0, 0, W, H], 24, 2.6);
    // closing title
    const ta = smooth(125.5, 126.6, t);
    if (ta > 0) {
      c.save(); c.textAlign = 'center';
      glow(c, W / 2, 250, 760, '#20162a', 0.5 * ta, 'source-over');
      c.globalAlpha = ta;
      c.fillStyle = rgba(P.cream); c.font = '500 34px "Montserrat"'; c.letterSpacing = '16px';
      c.fillText('МӘҢГІ ЖАСА,', W / 2 + 8, 168);
      c.shadowColor = 'rgba(40,20,0,0.7)'; c.shadowBlur = 30;
      c.letterSpacing = `${lerp(40, 22, easeOut(inv(125.5, 128.5, t)))}px`;
      c.font = '600 168px "Cormorant Garamond"';
      const tg = c.createLinearGradient(0, 180, 0, 320); tg.addColorStop(0, '#fff6dc'); tg.addColorStop(1, '#f2c45a');
      c.fillStyle = tg; c.fillText('ҚАЗАҚСТАН!', W / 2 + 11, 320);
      c.shadowBlur = 0; c.letterSpacing = '0px';
      ornamentLine(c, W / 2, 372, 700, inv(125.9, 127.4, t), P.goldL);
      c.restore();
    }
    ornamentFrame(c, 60, 60, W - 120, H - 120, inv(125.6, 127.6, t), P.goldL, 0.8);
  }

  const list = [{ s: 112, e: 120.6, fn: wide }, { s: 120.6, e: 125.4, fn: flagClose }, { s: 125.4, e: 130.5, fn: final }];
  return function (ctx, t) { shots(ctx, t, list, buf, 0.6); };
})();
