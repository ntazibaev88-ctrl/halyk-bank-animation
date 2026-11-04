/* Scenes 4–5 */

/* ====================== SCENE 4 — DIGITAL BANKING (23–33s → local 0–10) ====================== */
const S4 = (() => {
  const nodes = [
    ['card', 'Карты', 165, 720], ['transfer', 'Переводы', 165, 1020], ['qr', 'QR-оплата', 165, 1320],
    ['bulb', 'Коммунальные платежи', 915, 720], ['web', 'Онлайн-банкинг', 915, 1020], ['bag', 'Цифровые покупки', 915, 1320]
  ];
  function label(c, s, x, y, a) {
    const words = s.split(' ');
    const lines = s.length > 13 && words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [s];
    lines.forEach((l, i) => txt(c, l, x, y + i * 32, { size: 27, weight: 700, alpha: a, maxW: 200, shadow: false }));
  }
  function pos(c, t) {
    const a = E.out(prog(t, 5.6, 6.6));
    return a;
  }
  return function (c, t) {
    greenBackdrop(c, t);
    const collapse = E.in(prog(t, 5.5, 6.4)); // icons into phone
    const pay = E.io(prog(t, 6.2, 7.0));       // payment scene in
    // --- phase A: phone + icons
    c.save();
    const phA = 1 - pay;
    if (phA > 0) {
      c.globalAlpha = phA;
      const k = E.back(prog(t, .1, 1.0)), bob = Math.sin(t * 1.8) * 16, sc = k * lerp(1, .85, collapse);
      // nodes
      nodes.forEach((n, i) => {
        const t0 = .8 + i * .38, p = E.back(prog(t, t0, t0 + .6)); if (p <= 0) return;
        const side = n[2] < 540 ? 1 : -1, nx = lerp(n[2], 540, collapse), ny = lerp(n[3], 980, collapse) + Math.sin(t * 1.6 + i) * 10 * (1 - collapse);
        flowLine(c, [[nx + side * 86, ny], [lerp(nx + side * 160, 540, collapse), ny], [540 - side * 200 * (1 - collapse), 980 + (ny - 980) * .6 * (1 - collapse)]], t + i * .3, { draw: E.out(prog(t, t0 + .2, t0 + 1.0)), alpha: 1 - collapse, pulses: 2, speed: .4 + i * .02, width: 4 });
        c.save(); c.translate(nx, ny); c.scale(p * (1 - collapse * .9), p * (1 - collapse * .9));
        glow(c, 0, 0, 150, 'rgba(0,230,130,.35)');
        c.fillStyle = lg(c, 0, -84, 0, 84, [[0, '#18C46E'], [1, '#07703F']]); c.beginPath(); c.arc(0, 0, 84, 0, 7); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.stroke();
        icon(c, n[0], 0, 0, 56, '#fff', t); c.restore();
        if (collapse < .3) label(c, n[1], nx, ny + 118, p * (1 - collapse * 3));
      });
      // phone
      c.save(); c.translate(540, 980 + bob); c.rotate(Math.sin(t * .9) * .03); c.scale(sc, sc);
      glow(c, 0, 0, 560, 'rgba(0,255,150,.28)');
      // ring halos
      for (let i = 0; i < 3; i++) { const r = 330 + ((t * 60 + i * 80) % 240); c.strokeStyle = `rgba(140,240,181,${.25 * (1 - (r - 330) / 240)})`; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); }
      phoneBody(c, 0, 0, 400, 820, { t, on: prog(t, .3, .9) });
      c.restore();
    }
    c.restore();
    // --- phase B: payment
    if (pay > 0) {
      c.save(); c.globalAlpha = pay;
      // shop background
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#0E5B3C'], [1, '#052418']]); c.fillRect(0, 0, W, H);
      const rb = rng(8); for (let i = 0; i < 18; i++) { const x = rb() * W, y = 700 + rb() * 700, r = 30 + rb() * 70; glow(c, x + Math.sin(t + i) * 10, y, r * 2, 'rgba(120,255,190,.25)'); }
      c.save(); c.translate(0, 120 * (1 - E.out(pay)));
      // counter
      c.fillStyle = '#0B3A2A'; c.fillRect(0, 1480, W, 440); c.fillStyle = lg(c, 0, 1470, 0, 1500, [[0, '#2FC47F'], [1, '#12875A']]); c.fillRect(0, 1462, W, 30);
      c.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 8; i++) c.fillRect(i * 150, 1492, 4, 430);
      // terminal
      c.save(); c.translate(380, 1462); c.fillStyle = '#17252C'; rr(c, -76, -60, 152, 62, 12); c.fill(); c.save(); c.transform(1, 0, -.4, 1, 0, 0);
      c.fillStyle = '#1E3640'; rr(c, -48, -178, 112, 126, 14); c.fill(); const paid = prog(t, 7.5, 7.8); c.fillStyle = paid > .5 ? PAL.green2 : '#0B1E26'; rr(c, -40, -168, 96, 62, 8); c.fill(); if (paid > .5) icon(c, 'check', 8, -137, 26, '#fff'); else { c.fillStyle = 'rgba(255,255,255,.5)'; rr(c, -26, -146, 70, 8, 4); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 9; i++) c.fillRect(-40 + (i % 3) * 34, -96 + Math.floor(i / 3) * 14, 26, 8);
      c.restore(); c.restore();
      // person
      const approach = E.out(prog(t, 6.4, 7.3));
      const hand = person(c, lerp(980, 735, approach), 1700, { s: 1.65, flip: true, pose: t > 6.9 ? 'out' : 'phone', phone: true, phoneOn: true, phoneRot: -.25, skin: SKINS[1], hair: '#2A1B14', hairStyle: 'long', shirt: '#F4F0E6', dress: '#1F3A52', t, ph: approach < .98 ? t * 6 : 0, amp: approach < .98 ? 1 : 0, mood: 1, look: -.6 });
      // contactless waves + success
      const wt = t - 7.1;
      if (wt > 0) {
        for (let i = 0; i < 3; i++) { const u = ((wt * 1.6 + i / 3) % 1); c.strokeStyle = `rgba(160,255,210,${(1 - u) * .9})`; c.lineWidth = 6; c.beginPath(); c.arc(hand[0] - 20, hand[1] - 10, 20 + u * 90, Math.PI * .65, Math.PI * 1.35); c.stroke(); }
      }
      const ok = E.back(prog(t, 7.5, 8.1));
      if (ok > 0) {
        const bx = 330, by = 1000 + (1 - ok) * 30;
        glow(c, bx, by, 360 * ok, 'rgba(0,255,150,.45)');
        c.save(); c.translate(bx, by); c.scale(ok, ok); c.fillStyle = PAL.green2; c.beginPath(); c.arc(0, 0, 96, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 8; c.stroke(); icon(c, 'check', 0, 0, 68, '#fff'); c.restore();
        txt(c, 'Оплачено', bx, by + 150, { size: 56, alpha: ok > 1 ? 1 : ok });
        // coins burst
        const r = rng(12); for (let i = 0; i < 14; i++) { const a = r() * 6.28, sp = 150 + r() * 260, u = prog(t, 7.5, 8.9); if (u <= 0 || u >= 1) continue; const x = bx + Math.cos(a) * sp * u, y = by + Math.sin(a) * sp * u + 260 * u * u; c.globalAlpha = pay * (1 - u); c.fillStyle = i % 2 ? PAL.gold : PAL.light; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
      }
      c.restore(); c.restore();
    }
    caption(c, ['Банк в твоём', 'смартфоне'], 330, t - .3, { size: 72, out: 9.3 });
  };
})();

/* ====================== SCENE 5 — PEOPLE & EVERYDAY LIFE (33–43s → local 0–10) ====================== */
const S5 = (() => {
  const PY = [470, 900, 1330], PHh = 390, PX = 70, PW = 940, starts = [.2, 3.5, 6.8];
  function panelFrame(c, i, t, drawInner) {
    const u = t - starts[i], k = E.back(prog(u, 0, .7)); if (k <= 0) return;
    c.save(); c.translate(540, PY[i] + PHh / 2); c.scale(lerp(.9, 1, Math.min(k, 1)), lerp(.9, 1, Math.min(k, 1))); c.translate(-540, -(PY[i] + PHh / 2));
    c.globalAlpha = clamp(k); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 40; c.shadowOffsetY = 20; c.fillStyle = '#000'; rr(c, PX, PY[i], PW, PHh, 44); c.fill(); c.shadowColor = 'transparent';
    c.save(); rr(c, PX, PY[i], PW, PHh, 44); c.clip(); c.translate(PX, PY[i]); drawInner(c, Math.max(0, u)); c.restore();
    c.strokeStyle = 'rgba(140,240,181,.7)'; c.lineWidth = 4; rr(c, PX, PY[i], PW, PHh, 44); c.stroke();
    c.restore();
  }
  function steam(c, x, y, t) { c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 5; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { c.beginPath(); const o = Math.sin(t * 2 + i) * 6; c.moveTo(x + i * 14 - 14, y); c.bezierCurveTo(x + i * 14 - 14 + o, y - 14, x + i * 14 - 14 - o, y - 28, x + i * 14 - 14, y - 44); c.stroke(); } }
  return function (c, t) {
    c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#0F5A3C'], [1, '#04201A']]); c.fillRect(0, 0, W, H);
    greenBackdrop(c, t, { top: 'rgba(15,90,60,.0)', bot: 'rgba(4,32,26,0)' });
    // titles
    ['Для жизни.', 'Для бизнеса.', 'Для будущего.'].forEach((l, i) => {
      const u = t - starts[i] - .25, p = E.out(prog(u, 0, .6)); const y = 170 + i * 92;
      txt(c, l, 540, y + (1 - p) * 30, { size: 74, alpha: p, color: i === 1 ? PAL.light : '#fff', maxW: 860 });
    });
    c.fillStyle = PAL.green; rr(c, 480, 438, 120 * E.out(prog(t, .2, 1)), 8, 4); c.fill();
    // panel 1: student
    panelFrame(c, 0, t, (c, u) => {
      c.fillStyle = lg(c, 0, 0, 0, PHh, [[0, '#F5E7C8'], [1, '#E0C79A']]); c.fillRect(0, 0, PW, PHh);
      c.fillStyle = '#3F7D62'; c.fillRect(0, 0, PW, 120); for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(255,255,255,.18)'; rr(c, 40 + i * 150, 30, 100, 54, 10); c.fill(); }
      c.fillStyle = '#7A5638'; c.fillRect(0, PHh - 112, PW, 112); c.fillStyle = '#A87B50'; c.fillRect(0, PHh - 120, PW, 16);
      // cup + terminal
      c.fillStyle = '#fff'; rr(c, 560, PHh - 190, 70, 70, 10); c.fill(); c.fillStyle = '#B9453B'; c.fillRect(560, PHh - 160, 70, 14); steam(c, 595, PHh - 196, u);
      c.fillStyle = '#17252C'; rr(c, 700, PHh - 168, 90, 52, 10); c.fill(); const paid = u > 2.3; c.fillStyle = paid ? PAL.green2 : '#0B1E26'; rr(c, 710, PHh - 160, 60, 28, 6); c.fill(); if (paid) icon(c, 'check', 740, PHh - 146, 14, '#fff');
      const hp = person(c, 440 + Math.sin(u * 1.4) * 4, PHh - 14, { s: 1.0, pose: u < 1.4 ? 'phone' : 'out', phone: true, phoneOn: true, shirt: '#E9B44C', pants: '#2B3A55', hair: '#2A1B14', skin: SKINS[1], t: u, backpack: PAL.green, look: .5, phoneRot: -.2 });
      if (u > 1.9) for (let i = 0; i < 3; i++) { const q = ((u * 1.5 + i / 3) % 1); c.strokeStyle = `rgba(0,166,81,${(1 - q) * .9})`; c.lineWidth = 5; c.beginPath(); c.arc(hp[0] + 36, hp[1], 14 + q * 50, -.7, .7); c.stroke(); }
      if (paid) { const p = E.back(prog(u, 2.3, 2.9)); c.save(); c.translate(560, 120); c.scale(p, p); c.fillStyle = PAL.green2; c.beginPath(); c.arc(0, 0, 40, 0, 7); c.fill(); icon(c, 'check', 0, 0, 28, '#fff'); c.restore(); }
    });
    // panel 2: family
    panelFrame(c, 1, t, (c, u) => {
      c.fillStyle = lg(c, 0, 0, 0, PHh, [[0, '#FFE9C9'], [1, '#F3C99A']]); c.fillRect(0, 0, PW, PHh);
      c.fillStyle = '#BFE4F2'; rr(c, 90, 36, 190, 150, 12); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 8; c.stroke(); c.beginPath(); c.moveTo(185, 36); c.lineTo(185, 186); c.moveTo(90, 111); c.lineTo(280, 111); c.stroke();
      c.fillStyle = '#6E8F7C'; rr(c, 180, PHh - 150, 590, 110, 34); c.fill(); c.fillStyle = '#5A7A68'; rr(c, 160, PHh - 110, 630, 70, 28); c.fill();
      c.fillStyle = '#A87B50'; c.fillRect(0, PHh - 36, PW, 36);
      const ju = Math.abs(Math.sin(u * 4)) * (u > 3 ? 26 : 8);
      person(c, 330, PHh - 30, { s: 1.0, pose: 'stand', shirt: '#3D6A9E', pants: '#2A2F3A', hair: '#2A1B14', skin: SKINS[0], t: u, beard: null });
      person(c, 470, PHh - 30, { s: .95, pose: 'phone', phone: true, phoneOn: true, dress: '#B9453B', shirt: '#F4F0E6', hairStyle: 'long', hair: '#3A2418', skin: SKINS[1], t: u, look: -.3, phoneRot: -.2 });
      person(c, 590, PHh - 30 - ju, { s: .62, hs: 1.22, pose: 'up', shirt: '#E9B44C', pants: '#3A3F4B', hair: '#2A1B14', skin: SKINS[0], t: u, mood: 1 });
      // thought bubble
      const bp = E.back(prog(u, 1.0, 1.6));
      if (bp > 0) { c.save(); c.translate(700, 120); c.scale(bp, bp); c.fillStyle = '#fff'; rr(c, -90, -90, 360, 170, 70); c.fill(); for (const [x, y, r] of [[-40, 100, 16], [-70, 130, 10]]) { c.beginPath(); c.arc(x, y - 20, r, 0, 7); c.fill(); }
        const a1 = E.back(prog(u, 1.4, 2.0)), a2 = E.back(prog(u, 2.0, 2.6)); c.save(); c.translate(0, -5); c.scale(a1, a1); icon(c, 'house', 0, 0, 52, PAL.green); c.restore(); c.save(); c.translate(150, -5); c.scale(a2, a2); icon(c, 'car', 0, 0, 52, PAL.green); c.restore(); c.restore(); }
    });
    // panel 3: shop owner
    panelFrame(c, 2, t, (c, u) => {
      c.fillStyle = lg(c, 0, 0, 0, PHh, [[0, '#E8F6EE'], [1, '#BFE0CE']]); c.fillRect(0, 0, PW, PHh);
      const rs = rng(5); for (let r = 0; r < 2; r++) { c.fillStyle = '#8A6A4A'; c.fillRect(30, 110 + r * 100, 500, 8); for (let i = 0; i < 9; i++) { c.fillStyle = ['#E4572E', '#2E86DE', '#E9B44C', '#7A5BD6', '#00A651'][Math.floor(rs() * 5)]; const h = 38 + rs() * 26; rr(c, 44 + i * 54, 110 + r * 100 - h, 40, h, 6); c.fill(); } }
      // open sign
      const flick = .75 + .25 * Math.sin(u * 8); c.fillStyle = '#0A2A1E'; rr(c, 730, 40, 200, 64, 16); c.fill(); c.strokeStyle = `rgba(80,255,170,${flick})`; c.lineWidth = 4; rr(c, 737, 47, 186, 50, 12); c.stroke(); txt(c, 'ОТКРЫТО', 830, 73, { size: 34, color: `rgba(140,255,200,${flick})`, shadow: false, maxW: 200 });
      c.fillStyle = '#EDE6D6'; c.fillRect(0, PHh - 36, PW, 36);
      // owner behind counter
      person(c, 600, PHh - 70, { s: .8, pose: u < 2 ? 'wave' : 'stand', apron: '#00A651', shirt: '#F4F0E6', pants: '#2A2F3A', hair: '#2A1B14', skin: SKINS[2], t: u, mood: 1, beard: '#2A1B14' });
      // customer
      const cu = E.out(prog(u, .4, 2.2)); person(c, lerp(-60, 330, cu), PHh - 40, { s: .85, flip: false, ph: cu < .99 ? u * 6 : 0, amp: cu < .99 ? 1 : 0, pose: cu < .99 ? 'walk' : (u > 3 ? 'out' : 'stand'), phone: cu >= .99 && u > 3, phoneOn: true, dress: '#7A5BD6', shirt: '#fff', hairStyle: 'bun', hair: '#2A1B14', skin: SKINS[0], t: u });
      // counter
      c.fillStyle = '#0B5C3A'; rr(c, 120, PHh - 130, 560, 130, 16); c.fill(); c.fillStyle = '#12875A'; rr(c, 110, PHh - 142, 580, 22, 10); c.fill();
      c.fillStyle = '#17252C'; rr(c, 470, PHh - 192, 70, 50, 8); c.fill(); c.fillStyle = u > 3.8 ? PAL.green2 : '#0B1E26'; rr(c, 478, PHh - 184, 54, 22, 5); c.fill();
      if (u > 3.8) icon(c, 'check', 505, PHh - 173, 12, '#fff');
      // bag
      const bg = E.out(prog(u, 4, 4.6)); if (bg > 0) { c.save(); c.translate(260, PHh - 170 - bg * 14); icon(c, 'bag', 0, 0, 36, '#8A6A4A'); c.restore(); }
    });
    // connecting green lines (gutters)
    const cl = [[[PX + PW - 10, PY[0] + 195], [1062, PY[0] + 300], [1062, PY[1] + 90], [PX + PW - 10, PY[1] + 195]], [[PX + 10, PY[1] + 195], [18, PY[1] + 300], [18, PY[2] + 90], [PX + 10, PY[2] + 195]]];
    cl.forEach((p, i) => { const s = starts[i + 1] + .3, d = E.io(prog(t, s, s + 1.0)); if (d > 0) flowLine(c, p, t + i, { draw: d, pulses: 3, width: 6, speed: .3 }); });
    [0, 1, 2].forEach(i => { const p = E.back(prog(t, starts[i] + .5, starts[i] + 1)); if (p > 0) { const x = i === 1 ? 70 : 1010, y = PY[i] + 195; c.save(); c.translate(i === 1 ? 70 : 1010, y); c.scale(p, p); glow(c, 0, 0, 50, 'rgba(0,255,150,.7)'); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 12, 0, 7); c.fill(); c.restore(); } });
    [[1, 1010], [2, 70]].forEach(([i, x]) => { const p = E.back(prog(t, starts[i] + .8, starts[i] + 1.3)); if (p > 0) { c.save(); c.translate(x, PY[i] + 195); c.scale(p, p); glow(c, 0, 0, 50, 'rgba(0,255,150,.7)'); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 12, 0, 7); c.fill(); c.restore(); } });
    particles(c, t, { n: 40, seed: 22, alpha: .5 });
  };
})();
