// Animated scenes for «АТАНЫҢ АМАНАТЫ»: the Kazakh home interior and the dawn steppe.
// Scene units: 1080 x 1920 (rendered at 2160 x 3840). Everything is a pure function of time.
(function (global) {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 1080, H = 1920, PX = 2; // scene unit -> output pixels
  const lerp = (a, b, k) => a + (b - a) * k;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // easeInOutCubic
  const smooth = k => k * k * (3 - 2 * k);
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (c1, c2, k) => { // hex colours
    const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    const r = Math.round(lerp(a >> 16, b >> 16, k)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, k)), bl = Math.round(lerp(a & 255, b & 255, k));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  };
  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function svgLayer(host, id) {
    const s = el('svg', { id, width: W * PX, height: H * PX, viewBox: `0 0 ${W} ${H}`, class: 'layer' });
    host.appendChild(s);
    return s;
  }
  function canvasLayer(host, id) {
    const c = document.createElement('canvas');
    c.width = W * PX; c.height = H * PX; c.className = 'layer'; c.id = id;
    host.appendChild(c);
    return c;
  }
  // 2-bone IK: returns elbow point for shoulder S, hand target T, bone lengths a,b; bend sign
  function ik(S, T, a, b, bend = 1) {
    const dx = T[0] - S[0], dy = T[1] - S[1];
    let d = Math.hypot(dx, dy); d = Math.min(d, a + b - 0.01);
    const ang = Math.atan2(dy, dx);
    const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
    const A = ang + bend * Math.acos(cosA);
    return [S[0] + a * Math.cos(A), S[1] + a * Math.sin(A)];
  }

  // ---------------- MOODS ----------------
  const MOODS = {
    sunset: { sky: ['#2c3c6b', '#b8577a', '#f19a52', '#ffd38a'], sun: '#fff0c2', sunGlow: 0.95, hill: '#3a2230', hill2: '#5b2f33',
      wall: '#2a160c', wallLit: '#6e3a18', rim: '#ffc27a', glow: '#ff9a4a', shaft: 0.42, lamp: 0 },
    dusk: { sky: ['#0d1434', '#2a2f63', '#7a4a6e', '#d98a5a'], sun: '#ffb77a', sunGlow: 0.35, hill: '#141226', hill2: '#241a30',
      wall: '#160d0a', wallLit: '#3b2014', rim: '#f0b27a', glow: '#c9764a', shaft: 0.12, lamp: 1 },
    night: { sky: ['#03060f', '#0b1530', '#1a2748', '#2b3a5c'], sun: '#9fb4d8', sunGlow: 0.05, hill: '#05070d', hill2: '#0a0e18',
      wall: '#0a0807', wallLit: '#1c1410', rim: '#9fb4d8', glow: '#4a5f88', shaft: 0.0, lamp: 0.7 }
  };
  function moodAt(m1, m2, k) {
    const a = MOODS[m1], b = MOODS[m2 || m1], o = {};
    for (const key in a) {
      if (Array.isArray(a[key])) o[key] = a[key].map((c, i) => mix(c, b[key][i], k));
      else if (typeof a[key] === 'string') o[key] = mix(a[key], b[key], k);
      else o[key] = lerp(a[key], b[key], k);
    }
    return o;
  }

  // ---------------- INTERIOR ----------------
  const WIN = { x: 250, y: 420, w: 580, h: 720 };
  const ATA = { x: 420, y: 772, s: 1.0 };
  const BALA = { x: 742, y: 930, s: 0.92 };

  function buildInterior(host) {
    const C = global.CHARS;
    const S = {};
    // 1 outside world
    const out = svgLayer(host, 'int-out');
    const defs = el('defs', {}, out);
    const sky = el('linearGradient', { id: 'skyG', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    S.skyStops = [0, 0.45, 0.78, 1].map(o => el('stop', { offset: o }, sky));
    const sunG = el('radialGradient', { id: 'sunG' }, defs);
    S.sunStops = [el('stop', { offset: 0 }, sunG), el('stop', { offset: 0.18 }, sunG), el('stop', { offset: 1, 'stop-opacity': 0 }, sunG)];
    S.camOut = el('g', {}, out);
    el('rect', { x: 0, y: 0, width: W, height: 1160, fill: 'url(#skyG)' }, S.camOut);
    S.sun = el('circle', { cx: 640, cy: 1000, r: 420, fill: 'url(#sunG)' }, S.camOut);
    // far hills, near hills, a small aul with a yurt
    S.hill2 = el('path', { d: 'M0 1010 C 120 985 240 992 360 1004 C 480 1016 560 990 690 985 C 820 980 940 1000 1080 994 L1080 1200 L0 1200 Z' }, S.camOut);
    S.hill = el('path', { d: 'M0 1060 C 160 1040 300 1046 420 1056 C 540 1066 660 1038 800 1040 C 920 1042 1000 1052 1080 1048 L1080 1200 L0 1200 Z' }, S.camOut);
    const aul = el('g', {}, S.camOut);
    // yurt (kiyiz uy) silhouette
    el('path', { d: 'M 330 1050 L 330 1030 C 330 1020 345 1010 362 1004 C 372 998 388 998 398 1004 C 415 1010 430 1020 430 1030 L 430 1050 Z' }, aul);
    el('path', { d: 'M 470 1052 L 470 1036 L 520 1036 L 520 1052 Z M 466 1037 L 495 1022 L 524 1037 Z' }, aul); // small house
    S.aul = aul;
    // 2 flag outside (canvas)
    S.flagCv = canvasLayer(host, 'int-flag');
    // 3 room: wall with window hole, frame, carpet, dombra
    const room = svgLayer(host, 'int-room');
    const rdefs = el('defs', {}, room);
    const wallG = el('radialGradient', { id: 'wallG', cx: 0.5, cy: 0.38, r: 0.75 }, rdefs);
    S.wallStops = [el('stop', { offset: 0 }, wallG), el('stop', { offset: 1 }, wallG)];
    const pat = el('pattern', { id: 'orn', width: 60, height: 60, patternUnits: 'userSpaceOnUse' }, rdefs);
    // koshkar-muiz (ram's horn) ornament: a rhombus with outward-curling horns
    el('path', { d: 'M30 14 L42 30 L30 46 L18 30 Z', fill: 'none', stroke: '#c8873e', 'stroke-width': 2.2 }, pat);
    el('path', { d: 'M30 14 C30 6 38 2 44 6 C49 10 46 16 41 15 M30 14 C30 6 22 2 16 6 C11 10 14 16 19 15 M30 46 C30 54 38 58 44 54 C49 50 46 44 41 45 M30 46 C30 54 22 58 16 54 C11 50 14 44 19 45', fill: 'none', stroke: '#c8873e', 'stroke-width': 2, 'stroke-linecap': 'round' }, pat);
    el('circle', { cx: 30, cy: 30, r: 3, fill: '#c8873e' }, pat);
    S.camRoom = el('g', {}, room);
    el('path', { d: `M-400 -400 H${W + 400} V${H + 400} H-400 Z M${WIN.x} ${WIN.y} V${WIN.y + WIN.h} H${WIN.x + WIN.w} V${WIN.y} Z`, fill: 'url(#wallG)', 'fill-rule': 'evenodd' }, S.camRoom);
    // tus kiiz wall carpet (left) and its ornament
    S.carpet = el('g', { opacity: 0.55 }, S.camRoom);
    el('rect', { x: -60, y: 260, width: 250, height: 1060, rx: 8, fill: '#4a1812' }, S.carpet);
    el('rect', { x: -40, y: 280, width: 210, height: 1020, fill: 'url(#orn)', opacity: 0.7 }, S.carpet);
    el('rect', { x: -40, y: 280, width: 210, height: 1020, fill: 'none', stroke: '#c8873e', 'stroke-width': 4, opacity: 0.7 }, S.carpet);
    // dombra hanging on the right wall
    S.dombra = el('g', { transform: 'translate(985 470) rotate(6) scale(0.82)' }, S.camRoom);
    el('rect', { x: -7, y: 0, width: 14, height: 330, rx: 5, fill: '#1a0d07' }, S.dombra);
    el('path', { d: 'M0 300 C 48 300 70 360 70 430 C 70 520 40 570 0 570 C -40 570 -70 520 -70 430 C -70 360 -48 300 0 300 Z', fill: '#2a140a', stroke: '#7a4421', 'stroke-width': 3 }, S.dombra);
    el('circle', { cx: 0, cy: 440, r: 14, fill: '#120904' }, S.dombra);
    el('path', { d: 'M -3 10 L -3 540 M 3 10 L 3 540', stroke: '#b98a55', 'stroke-width': 0.8, opacity: 0.8 }, S.dombra);
    // window frame
    const f = el('g', { fill: '#1a0e08' }, S.camRoom);
    el('rect', { x: WIN.x - 26, y: WIN.y - 26, width: WIN.w + 52, height: 26 }, f);
    el('rect', { x: WIN.x - 26, y: WIN.y + WIN.h, width: WIN.w + 52, height: 34 }, f);
    el('rect', { x: WIN.x - 26, y: WIN.y, width: 26, height: WIN.h }, f);
    el('rect', { x: WIN.x + WIN.w, y: WIN.y, width: 26, height: WIN.h }, f);
    el('rect', { x: WIN.x + WIN.w / 2 - 9, y: WIN.y, width: 18, height: WIN.h }, f);
    el('rect', { x: WIN.x, y: WIN.y + 210, width: WIN.w, height: 16 }, f);
    // sill highlight
    S.sill = el('rect', { x: WIN.x - 26, y: WIN.y + WIN.h, width: WIN.w + 52, height: 4, fill: '#ffb36b', opacity: 0.5 }, S.camRoom);
    // glass bloom + light shafts
    const ldefs = rdefs;
    const shG = el('linearGradient', { id: 'shG', x1: 0, y1: 0, x2: 0, y2: 1 }, ldefs);
    S.shStops = [el('stop', { offset: 0 }, shG), el('stop', { offset: 1, 'stop-opacity': 0 }, shG)];
    S.shafts = el('g', { style: 'mix-blend-mode:screen' }, S.camRoom);
    S.shaftPaths = [
      'M 300 640 L 520 640 L 760 1920 L 120 1920 Z',
      'M 560 640 L 800 640 L 1180 1920 L 520 1920 Z',
      'M 270 430 L 520 430 L 380 1920 L -120 1920 Z'
    ].map(d => el('path', { d, fill: 'url(#shG)' }, S.shafts));
    // lamp glow (dusk) - warm light from the right
    const lampG = el('radialGradient', { id: 'lampG' }, ldefs);
    el('stop', { offset: 0, 'stop-color': '#ffb15c', 'stop-opacity': 0.55 }, lampG);
    el('stop', { offset: 1, 'stop-color': '#ff8a3a', 'stop-opacity': 0 }, lampG);
    S.lamp = el('circle', { cx: 1060, cy: 1500, r: 700, fill: 'url(#lampG)', style: 'mix-blend-mode:screen' }, S.camRoom);
    // 4 dust (canvas)
    S.dustCv = canvasLayer(host, 'int-dust');
    // 5 characters
    const ch = svgLayer(host, 'int-chars');
    const cdefs = el('defs', {}, ch);
    const flt = el('filter', { id: 'rim', x: '-30%', y: '-30%', width: '160%', height: '160%' }, cdefs);
    el('feOffset', { in: 'SourceAlpha', dx: 0.8, dy: 3.2, result: 'sh' }, flt);
    el('feComposite', { in: 'SourceAlpha', in2: 'sh', operator: 'out', result: 'edge' }, flt);
    el('feGaussianBlur', { in: 'edge', stdDeviation: 0.9, result: 'edgeb' }, flt);
    S.rimFlood = el('feFlood', { 'flood-color': '#ffc27a', 'flood-opacity': 0.85 }, flt);
    el('feComposite', { in2: 'edgeb', operator: 'in', result: 'rim' }, flt);
    el('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: 14, result: 'g0' }, flt);
    S.glowFlood = el('feFlood', { 'flood-color': '#ff9a4a', 'flood-opacity': 0.32 }, flt);
    el('feComposite', { in2: 'g0', operator: 'in', result: 'glow' }, flt);
    const mg = el('feMerge', {}, flt);
    el('feMergeNode', { in: 'glow' }, mg); el('feMergeNode', { in: 'SourceGraphic' }, mg); el('feMergeNode', { in: 'rim' }, mg);
    S.camChars = el('g', {}, ch);
    S.charsG = el('g', { filter: 'url(#rim)', fill: '#0f0905' }, S.camChars);
    // grandson (behind grandfather's arm)
    S.bala = el('g', {}, S.charsG);
    S.balaBody = el('path', { d: C.bala.body }, S.bala);
    S.balaHead = el('path', { d: C.bala.head }, S.bala);
    // grandfather
    S.ata = el('g', {}, S.charsG);
    S.ataBody = el('path', { d: C.ata.body }, S.ata);
    S.ataHead = el('path', { d: C.ata.head }, S.ata);
    S.cane = el('path', { d: C.ata.cane }, S.ata);
    el('path', { d: 'M -10 270 L 40 290 L 66 360 L 70 420 L -10 420 Z' }, S.ata);
    // arm drawn in world space (IK) so the hand can reach the boy's shoulder
    S.arm = el('path', { fill: '#0f0905', stroke: '#0f0905', 'stroke-width': 58, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S.charsG);
    S.hand = el('ellipse', { rx: 34, ry: 24 }, S.charsG);
    // 6 foreground haze / vignette inside the room
    const fg = svgLayer(host, 'int-fg');
    const fdefs = el('defs', {}, fg);
    const vg = el('radialGradient', { id: 'vigI', cx: 0.5, cy: 0.42, r: 0.8 }, fdefs);
    el('stop', { offset: 0.55, 'stop-color': '#000', 'stop-opacity': 0 }, vg);
    el('stop', { offset: 1, 'stop-color': '#000', 'stop-opacity': 0.75 }, vg);
    el('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#vigI)' }, fg);
    const gr = el('linearGradient', { id: 'groundI', x1: 0, y1: 0, x2: 0, y2: 1 }, fdefs);
    el('stop', { offset: 0.5, 'stop-color': '#050302', 'stop-opacity': 0 }, gr);
    el('stop', { offset: 1, 'stop-color': '#050302', 'stop-opacity': 0.92 }, gr);
    el('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#groundI)' }, fg);
    S.host = host;
    return S;
  }

  // p: { t (local seconds), dur, cam:{from:[cx,cy,zoom], to:[...]}, mood, mood2, moodK,
  //      balaAsk:[t0,t1], ataLook:[t0,t1], hand:[t0,t1], focus:'flag'|'chars', speak:[[t0,t1],...] }
  function drawInterior(S, gt, p) {
    const t = p.t, k = p.dur ? ease(clamp(t / p.dur)) : 0;
    const M = moodAt(p.mood || 'sunset', p.mood2, p.moodK || 0);
    // camera: centre point and zoom in scene units
    const a = p.cam.from, b = p.cam.to || p.cam.from;
    const cx = lerp(a[0], b[0], k), cy = lerp(a[1], b[1], k), z = lerp(a[2], b[2], k);
    // handheld drift
    const hx = (Math.sin(gt * 0.71) * 1.6 + Math.sin(gt * 1.37 + 1) * 0.9) * (p.handheld ?? 1);
    const hy = (Math.sin(gt * 0.53 + 2) * 1.4 + Math.sin(gt * 1.11) * 0.7) * (p.handheld ?? 1);
    const tf = (par) => `translate(${W / 2} ${H / 2}) scale(${z}) translate(${-cx - hx * par} ${-cy - hy * par})`;
    S.camOut.setAttribute('transform', tf(0.5) + ' ');
    S.camRoom.setAttribute('transform', tf(1));
    S.camChars.setAttribute('transform', tf(1.25));
    // outside parallax: the world beyond the window moves less
    S.skyStops.forEach((s, i) => s.setAttribute('stop-color', M.sky[i]));
    S.sunStops[0].setAttribute('stop-color', M.sun); S.sunStops[1].setAttribute('stop-color', M.sun);
    S.sunStops[0].setAttribute('stop-opacity', M.sunGlow); S.sunStops[1].setAttribute('stop-opacity', M.sunGlow * 0.55);
    S.sunStops[2].setAttribute('stop-color', M.sky[2]);
    S.sun.setAttribute('cy', 1000 + (p.sunSink || 0) * t);
    S.hill.setAttribute('fill', M.hill); S.hill2.setAttribute('fill', M.hill2); S.aul.setAttribute('fill', M.hill);
    S.wallStops[0].setAttribute('stop-color', M.wallLit); S.wallStops[1].setAttribute('stop-color', M.wall);
    S.shStops[0].setAttribute('stop-color', M.sun);
    S.shStops[0].setAttribute('stop-opacity', M.shaft * (0.85 + 0.15 * Math.sin(gt * 0.9)));
    S.shaftPaths.forEach((pp, i) => pp.setAttribute('opacity', 0.55 + 0.45 * Math.sin(gt * (0.37 + i * 0.13) + i * 2)));
    S.lamp.setAttribute('opacity', M.lamp);
    S.sill.setAttribute('fill', M.rim);
    S.rimFlood.setAttribute('flood-color', M.rim);
    S.glowFlood.setAttribute('flood-color', M.glow);
    S.glowFlood.setAttribute('flood-opacity', 0.12 + 0.25 * M.sunGlow);

    // --- characters ---
    const breathA = Math.sin(gt * 2 * Math.PI / 4.6), breathB = Math.sin(gt * 2 * Math.PI / 3.4 + 1);
    // grandson head: looks up while asking, small speech nods
    let balaTilt = -4;
    if (p.balaAsk) {
      const [b0, b1] = p.balaAsk;
      balaTilt = -4 - 7 * smooth(clamp((t - b0 + 0.6) / 0.8));
      if (t > b0 && t < b1) balaTilt += 1.6 * Math.sin((t - b0) * 11) * Math.sin(Math.PI * (t - b0) / (b1 - b0));
    }
    if (p.balaLookUp) balaTilt = -11 + 1.0 * breathB;
    if (p.balaListen) balaTilt = -9 - 2 * smooth(clamp((t - p.balaListen) / 1.5));
    S.bala.setAttribute('transform', `translate(${BALA.x} ${BALA.y}) scale(${-BALA.s * 0 + BALA.s})`);
    S.balaBody.setAttribute('transform', `translate(0 ${breathB * 1.2}) scale(1 ${1 + 0.004 * breathB})`);
    S.balaHead.setAttribute('transform', `translate(0 ${breathB * 1.2}) rotate(${-balaTilt} 6 180)`);
    // grandfather: lifts gaze toward window / flag; speech nods
    let ataTilt = 0;
    if (p.ataLook) { const [l0, l1] = p.ataLook; ataTilt = -7 * smooth(clamp((t - l0) / (l1 - l0))); }
    if (p.ataLookHold) ataTilt = -7;
    if (p.ataBow) ataTilt = 6 * smooth(clamp((t - p.ataBow) / 2));
    for (const [s0, s1] of (p.speak || [])) {
      if (t > s0 && t < s1) ataTilt += 1.2 * Math.sin((t - s0) * 7.5) * Math.sin(Math.PI * (t - s0) / (s1 - s0));
    }
    S.ata.setAttribute('transform', `translate(${ATA.x} ${ATA.y}) scale(${ATA.s})`);
    S.ataBody.setAttribute('transform', `translate(0 ${breathA * 1.5}) scale(1 ${1 + 0.005 * breathA})`);
    S.ataHead.setAttribute('transform', `translate(0 ${breathA * 1.5}) rotate(${ataTilt} -10 270)`);
    // arm IK (world space). Shoulder is inside the robe, hand rests on the cane head.
    const sh = [ATA.x - 30, ATA.y + 360 + breathA * 1.5];
    const rest = [ATA.x + 196, ATA.y + 515];
    const boyShoulder = [BALA.x - 92 * BALA.s, BALA.y + 236 * BALA.s + breathB * 1.2];
    let hk = 0;
    if (p.hand) { const [h0, h1] = p.hand; hk = ease(clamp((t - h0) / (h1 - h0))); }
    if (p.handHold) hk = 1;
    const lift = Math.sin(Math.PI * hk) * 70; // arc of the gesture
    const T = [lerp(rest[0], boyShoulder[0], hk), lerp(rest[1], boyShoulder[1], hk) - lift];
    const E = ik(sh, T, 190, 175, 1);
    S.arm.setAttribute('d', `M ${sh[0]} ${sh[1]} L ${E[0].toFixed(1)} ${E[1].toFixed(1)} L ${T[0].toFixed(1)} ${T[1].toFixed(1)} L ${(T[0] - 20).toFixed(1)} ${(T[1] + 60).toFixed(1)} L ${E[0].toFixed(1)} ${(E[1] + 160).toFixed(1)} L ${(sh[0] + 10).toFixed(1)} ${(sh[1] + 260).toFixed(1)} Z`);
    const handAng = Math.atan2(T[1] - E[1], T[0] - E[0]) * 180 / Math.PI;
    S.hand.setAttribute('transform', `translate(${T[0] + 10} ${T[1] + 4}) rotate(${handAng})`);

    // --- flag outside + dust (canvas, same camera) ---
    const ctx = S.flagCv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W * PX, H * PX);
    const camMat = (par) => {
      const ox = -cx - hx * par, oy = -cy - hy * par;
      ctx.setTransform(PX * z, 0, 0, PX * z, PX * (W / 2 + z * ox), PX * (H / 2 + z * oy));
    };
    camMat(0.5);
    ctx.save();
    ctx.beginPath(); ctx.rect(WIN.x - 2, WIN.y - 2, WIN.w + 4, WIN.h + 4); ctx.clip(); // flag only seen through the window
    global.FLAG.pole(ctx, 655, 640, 1062, 3.2, '#1c1418', 'rgba(255,200,140,0.6)');
    global.FLAG.draw(ctx, 656.5, 642, 150, gt, { wind: 0.75, light: 0.5 });
    ctx.restore();
    // rack focus: blur either the flag (outside) or the characters
    const fb = p.focus === 'flag' ? 0 : (p.flagBlur ?? 2.2);
    S.flagCv.style.filter = fb > 0.05 ? `blur(${fb * z}px)` : 'none';
    document.getElementById('int-out').style.filter = fb > 0.05 ? `blur(${fb * z * 0.8}px)` : 'none';
    const cb = p.focus === 'flag' ? (p.charBlur ?? 6) : 0;
    document.getElementById('int-chars').style.filter = cb > 0.05 ? `blur(${cb}px)` : 'none';

    const d = S.dustCv.getContext('2d');
    d.setTransform(1, 0, 0, 1, 0, 0); d.clearRect(0, 0, W * PX, H * PX);
    if (M.shaft > 0.02) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const ox = -cx - hx, oy = -cy - hy;
      d.setTransform(PX * z, 0, 0, PX * z, PX * (W / 2 + z * ox), PX * (H / 2 + z * oy));
      for (let i = 0; i < 170; i++) {
        const x0 = 200 + hash(i) * 760, y0 = 600 + hash(i + 50) * 1300;
        const x = x0 + Math.sin(gt * (0.15 + hash(i + 7) * 0.3) + i) * 30 + gt * 2.5 * (hash(i + 3) - 0.5);
        const y = ((y0 - gt * (3 + hash(i + 9) * 6)) % 1300 + 1300) % 1300 + 600;
        const r = 0.8 + hash(i + 11) * 2.2;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(gt * (0.8 + hash(i + 13)) + i));
        d.fillStyle = `rgba(255,214,160,${(0.22 + 0.5 * hash(i + 17)) * tw * M.shaft * 2})`;
        d.beginPath(); d.arc(x, y, r, 0, Math.PI * 2); d.fill();
      }
    }
  }

  // ---------------- DAWN STEPPE (scene 8) ----------------
  function buildDawn(host) {
    const S = {};
    const sv = svgLayer(host, 'dawn-bg');
    const defs = el('defs', {}, sv);
    const sky = el('linearGradient', { id: 'dSky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    S.sky = [[0, '#0b1a3d'], [0.35, '#24427a'], [0.62, '#5f78a8'], [0.8, '#e7a46a'], [0.9, '#ffcf8a'], [1, '#ffe2a8']].map(([o, c]) => el('stop', { offset: o, 'stop-color': c }, sky));
    const sunG = el('radialGradient', { id: 'dSun' }, defs);
    el('stop', { offset: 0, 'stop-color': '#fffbe8', 'stop-opacity': 1 }, sunG);
    el('stop', { offset: 0.08, 'stop-color': '#fff1c4', 'stop-opacity': 0.95 }, sunG);
    el('stop', { offset: 0.3, 'stop-color': '#ffc77a', 'stop-opacity': 0.45 }, sunG);
    el('stop', { offset: 1, 'stop-color': '#ff9f5a', 'stop-opacity': 0 }, sunG);
    const cl = el('filter', { id: 'cloudBlur', x: '-20%', y: '-50%', width: '140%', height: '200%' }, defs);
    el('feGaussianBlur', { stdDeviation: 18 }, cl);
    S.cam = el('g', {}, sv);
    // tall sky: scene extends upward to y = -2600 for the crane-up
    el('rect', { x: -200, y: -2700, width: W + 400, height: 4100, fill: 'url(#dSky)', transform: 'translate(0 0)' }, S.cam);
    S.sun = el('circle', { cx: 700, cy: 1330, r: 900, fill: 'url(#dSun)' }, S.cam);
    // soft clouds lit from below
    S.clouds = el('g', { filter: 'url(#cloudBlur)' }, S.cam);
    for (let i = 0; i < 14; i++) {
      const y = 1100 - i * 230 - hash(i) * 120, x = hash(i + 4) * 1200 - 100;
      el('ellipse', { cx: x, cy: y, rx: 220 + hash(i + 8) * 260, ry: 26 + hash(i + 9) * 30,
        fill: i < 4 ? '#ffc99a' : (i < 8 ? '#c98f9a' : '#6b7fb0'), opacity: 0.35 + hash(i + 2) * 0.3 }, S.clouds);
    }
    // steppe layers
    el('path', { d: 'M-200 1370 C 0 1340 200 1352 380 1362 C 560 1372 760 1338 980 1346 C 1100 1350 1200 1356 1300 1352 L1300 2400 L-200 2400 Z', fill: '#6e5a6e', opacity: 0.85 }, S.cam);
    el('path', { d: 'M-200 1440 C 100 1410 300 1420 520 1436 C 700 1450 900 1420 1300 1428 L1300 2400 L-200 2400 Z', fill: '#3d3346' }, S.cam);
    S.near = el('path', { d: 'M-200 1640 C 100 1560 360 1520 560 1530 C 760 1540 960 1600 1300 1660 L1300 2400 L-200 2400 Z', fill: '#16121c' }, S.cam);
    // grass tufts on the near hill
    let gd = '';
    for (let i = 0; i < 120; i++) {
      const x = -150 + i * 12.5 + hash(i) * 8; const base = 1530 + Math.pow((x - 560) / 760, 2) * 120 + 6;
      const hgt = 14 + hash(i + 30) * 26, lean = (hash(i + 60) - 0.4) * 14;
      gd += `M ${x} ${base} Q ${x + lean * 0.4} ${base - hgt * 0.6} ${x + lean} ${base - hgt} Q ${x + 2 + lean * 0.3} ${base - hgt * 0.5} ${x + 4} ${base} Z `;
    }
    S.grass = el('path', { d: gd, fill: '#16121c' }, S.cam);
    S.flagCv = canvasLayer(host, 'dawn-flag');
    const fg = svgLayer(host, 'dawn-fg');
    const fdefs = el('defs', {}, fg);
    const flt = el('filter', { id: 'rimD', x: '-30%', y: '-30%', width: '160%', height: '160%' }, fdefs);
    el('feMorphology', { in: 'SourceAlpha', operator: 'erode', radius: 1.6, result: 'er' }, flt);
    el('feComposite', { in: 'SourceAlpha', in2: 'er', operator: 'out', result: 'edge' }, flt);
    el('feFlood', { 'flood-color': '#ffd59a', 'flood-opacity': 0.9 }, flt);
    el('feComposite', { in2: 'edge', operator: 'in', result: 'rim' }, flt);
    const mg = el('feMerge', {}, flt); el('feMergeNode', { in: 'SourceGraphic' }, mg); el('feMergeNode', { in: 'rim' }, mg);
    S.camFg = el('g', {}, fg);
    S.boy = el('path', { d: global.CHARS.bala.back, fill: '#120e16', filter: 'url(#rimD)' }, S.camFg);
    return S;
  }

  // p: { t, dur, cam:{from:[cx,cy,z],to:[...]}, sunRise }
  function drawDawn(S, gt, p) {
    const t = p.t, k = p.dur ? ease(clamp(t / p.dur)) : 0;
    const a = p.cam.from, b = p.cam.to || a;
    const cx = lerp(a[0], b[0], k), cy = lerp(a[1], b[1], k), z = lerp(a[2], b[2], k);
    const hx = Math.sin(gt * 0.6) * 1.2, hy = Math.sin(gt * 0.45 + 1) * 1.0;
    const tf = `translate(${W / 2} ${H / 2}) scale(${z}) translate(${-cx - hx} ${-cy - hy})`;
    S.cam.setAttribute('transform', tf);
    S.camFg.setAttribute('transform', tf);
    const sr = p.sunRise ?? 0;
    S.sun.setAttribute('cy', 1400 - sr * (p.gt0 !== undefined ? (gt - p.gt0) : t));
    S.clouds.setAttribute('transform', `translate(${gt * 6} 0)`);
    // boy stands on the near hill, slight breathing / weight shift
    const bx = 610, by = 1528 - 640 * 0.62;
    S.boy.setAttribute('transform', `translate(${bx + Math.sin(gt * 0.8) * 0.8} ${by}) scale(0.62 ${0.62 * (1 + 0.004 * Math.sin(gt * 1.9))})`);
    // flag on its pole beside him
    const ctx = S.flagCv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W * PX, H * PX);
    ctx.setTransform(PX * z, 0, 0, PX * z, PX * (W / 2 + z * (-cx - hx)), PX * (H / 2 + z * (-cy - hy)));
    global.FLAG.pole(ctx, 330, 560, 1556, 9, '#1b1820', 'rgba(255,214,150,0.8)');
    global.FLAG.draw(ctx, 334, 566, 470, gt, { wind: 0.95, light: 0.6 });
  }

  global.SCENES = { buildInterior, drawInterior, buildDawn, drawDawn, W, H, PX, ease, clamp, lerp, smooth, hash };
})(window);
