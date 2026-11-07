// Scenes: hook, pte, tb
window.SCENES = window.SCENES || {};

function stage(root, bg) {
  const s = document.createElementNS(SVGNS, 'svg');
  s.setAttribute('class', 'art'); s.setAttribute('viewBox', '0 0 1080 1920');
  if (bg) s.innerHTML = bg;
  root.appendChild(s);
  return s;
}
function layer(parent, markup = '') { const g = svgFrag(markup); parent.appendChild(g); return g; }
function header(root, num, title, sub, opt = {}) {
  const h = html(`<div class="hdr" style="${opt.style || ''}">
    ${num ? `<div class="chip"><b>${num}</b>${opt.chip || 'ПТЭ · ТБ'}</div>` : ''}
    <div class="htitle" style="${opt.tstyle || ''}">${title}</div>${sub ? `<div class="hsub">${sub}</div>` : ''}<div class="uline"></div></div>`);
  root.appendChild(h);
  return { h, chip: h.querySelector('.chip'), title: h.querySelector('.htitle'), sub: h.querySelector('.hsub'), ul: h.querySelector('.uline') };
}
function animHeader(H, lt, at = 0.35) {
  if (H.chip) popIn(H.chip, lt, at, { dy: -30, s0: 0.7 });
  popIn(H.title, lt, at + 0.12, { dy: 60, s0: 0.92, d: 0.7, ease: E.outExpo });
  if (H.sub) popIn(H.sub, lt, at + 0.3, { dy: 30, s0: 1 });
  H.ul.style.transform = `scaleX(${ep(lt, at + 0.45, 0.6, E.outExpo).toFixed(3)})`;
}
function bgGlow(svg, cx, cy, r, grad = 'spot', o = 1) {
  return layer(svg, `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r}" fill="url(#${grad})" opacity="${o}"/>`);
}
// html pill with icon
function pill(root, x, y, w, iconSvg, text, cls = '') {
  const el = html(`<div class="pill ${cls}" style="left:${x}px;top:${y}px;width:${w}px"><div class="ic"><svg viewBox="-50 -50 100 100">${iconSvg}</svg></div><div>${text}</div></div>`);
  root.appendChild(el); return el;
}

// ======================= HOOK =======================
SCENES.hook = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#skyNight)"/>`);
    const c = {};
    // stars
    let st = '';
    for (let i = 0; i < 90; i++) st += `<circle data-k="st${i}" cx="${(rnd(i) * 1080).toFixed(0)}" cy="${(rnd(i + 50) * 900).toFixed(0)}" r="${(0.8 + rnd(i + 9) * 2.2).toFixed(1)}" fill="#cfe3ff"/>`;
    c.stars = layer(svg, st);
    layer(svg, `<circle cx="830" cy="330" r="230" fill="url(#glowB)" opacity="0.35"/><circle cx="830" cy="330" r="46" fill="#e7f0ff" opacity="0.9"/><circle cx="846" cy="322" r="42" fill="#0b1a3e" opacity="0.18"/>`);
    c.cam = layer(svg, '');
    // far plant
    c.plantG = layer(c.cam, '');
    c.plant = new Plant(c.plantG, 'hk', 'night');
    T(c.plantG, -20, 1230, 1);
    // mid catwalk
    c.mid = layer(c.cam, `
      <rect x="-40" y="1230" width="1160" height="700" fill="#081633"/>
      <rect x="-40" y="1226" width="1160" height="18" fill="#1d3b72"/>
      <g stroke="#2a5296" stroke-width="6">${[...Array(15)].map((_, i) => `<line x1="${i * 80}" y1="1226" x2="${i * 80}" y2="1150"/>`).join('')}
      <line x1="-40" y1="1150" x2="1120" y2="1150"/><line x1="-40" y1="1188" x2="1120" y2="1188"/></g>`);
    c.walkG = layer(c.cam, '');
    c.walker = new Walker(c.walkG, 'hkw');
    // beacons
    const beacon = (x, y, k) => `<g transform="translate(${x} ${y})">
        <rect x="-8" y="0" width="16" height="140" fill="#1d3b72"/>
        <g data-k="${k}beam"><path d="M0 0 L620 -120 L620 120Z" fill="url(#beamY)"/><path d="M0 0 L-620 -120 L-620 120Z" fill="url(#beamY)" transform="scale(1 1)"/></g>
        <circle data-k="${k}glow" r="120" fill="url(#glowO)"/>
        <rect x="-22" y="-26" width="44" height="34" rx="12" fill="#ff8a1f"/><rect x="-26" y="6" width="52" height="12" rx="3" fill="#333"/>
      </g>`;
    c.beacons = layer(c.cam, beacon(110, 1010, 'bA') + beacon(975, 1040, 'bB'));
    c.rb = refs(c.beacons);
    // foreground pipe + leaking flange
    c.fg = layer(svg, `
      <rect x="0" y="1560" width="1080" height="360" fill="url(#grate)"/>
      <rect x="0" y="1540" width="1080" height="24" fill="#1d3b72"/>
      <rect x="-20" y="1330" width="1120" height="110" rx="55" fill="url(#pipeB)"/>
      <rect x="610" y="1310" width="46" height="150" rx="8" fill="#5c7fb5"/><rect x="596" y="1316" width="74" height="138" rx="10" fill="#3b5f99"/>
      ${[0, 1, 2, 3].map(i => `<circle cx="633" cy="${1330 + i * 34}" r="6" fill="#a9c0dd"/>`).join('')}
      <rect x="230" y="1440" width="60" height="110" fill="#1d3b72"/><rect x="820" y="1440" width="60" height="110" fill="#1d3b72"/>
      <path d="M0 1700 Q300 1650 1080 1720 L1080 1920 L0 1920Z" fill="#050d22" opacity="0.6"/>`);
    c.leak = new Puffs(svg, 18, { x: 640, y: 1312, life: 1.6, rise: 260, wind: 30, r0: 12, r1: 70, a: 0.55, spread: 20, seed: 21 });
    // alarm wash
    c.red = layer(svg, `<rect width="1080" height="1920" fill="#ff1e1e"/>`);
    c.redV = layer(svg, `<rect width="1080" height="1920" fill="url(#glowR)" opacity="1" transform="translate(540 960) scale(1.4 1.1) translate(-540 -960)"/>`);
    // title
    c.title = html(`<div class="abs" style="left:50px;right:50px;top:250px;text-align:center">
      <div data-k="tri" style="display:inline-block"><svg width="150" height="132" viewBox="0 0 150 132"><path d="M75 6 L144 126 L6 126Z" fill="#ffd23f" stroke="#1a1a1a" stroke-width="8" stroke-linejoin="round"/><rect x="68" y="44" width="14" height="48" rx="6" fill="#1a1a1a"/><circle cx="75" cy="106" r="8" fill="#1a1a1a"/></svg></div>
      <div data-k="l1" style="font-weight:900;font-size:84px;line-height:1.02;letter-spacing:-1px;margin-top:16px;text-shadow:0 8px 40px rgba(0,0,0,.6)">ТЭЦ-ТЕГІ БІР ҚАТЕ —</div>
      <div data-k="l2" style="font-weight:900;font-size:70px;line-height:1.06;margin-top:14px;color:#ff8a1f;text-shadow:0 8px 40px rgba(0,0,0,.6)">АДАМ ӨМІРІНЕ ҚАУІП<br>ТӨНДІРУІ МҮМКІН!</div></div>`);
    root.appendChild(c.title); c.tr = refs(c.title);
    // PTE + TB badges
    c.badges = html(`<div class="abs" style="left:0;right:0;top:820px;display:flex;justify-content:center;gap:40px">
      <div data-k="b1" class="card" style="position:relative;padding:26px 46px;font-weight:900;font-size:92px;color:#fff;border-color:#ff8a1f">ПТЭ</div>
      <div data-k="plus" style="font-weight:900;font-size:90px;color:#ffd23f;align-self:center">+</div>
      <div data-k="b2" class="card" style="position:relative;padding:26px 56px;font-weight:900;font-size:92px;color:#fff;border-color:#ff8a1f">ТБ</div></div>`);
    root.appendChild(c.badges); c.br = refs(c.badges);
    return c;
  },
  update(c, lt, info) {
    const alarmT = 2.6, s3 = info.segs[2].s;
    // camera push-in + shake at alarm
    const shake = lt > alarmT && lt < alarmT + 0.6 ? (1 - (lt - alarmT) / 0.6) * 10 : 0;
    const zs = lerp(1.0, 1.1, E.inOutSine(clamp(lt / info.dur)));
    T(c.cam, 540 - 540 * zs + Math.sin(lt * 60) * shake, 1200 - 1200 * zs + Math.cos(lt * 53) * shake, zs);
    c.plant.update(lt);
    c.stars.querySelectorAll('circle').forEach((s, i) => s.setAttribute('opacity', (0.3 + 0.7 * pulse(lt, 0.3 + rnd(i) * 0.5)).toFixed(2)));
    // walker crosses the catwalk then stops to look up
    const wk = ep(lt, 0, 3.4, E.inOutSine);
    const walking = lt < 3.4;
    c.walker.set({ x: lerp(-80, 560, wk), y: 1226, s: 0.42, phase: lt * 1.25, amp: walking ? 1 - ep(lt, 3.0, 0.4) : 0, tilt: -ep(lt, 3.0, 0.5) * 14 });
    // beacons
    const on = ep(lt, alarmT - 0.2, 0.3);
    [['bA', 1], ['bB', -1]].forEach(([k, d], i) => {
      T(c.rb[k + 'beam'], 0, 0, 1, (lt * 220 * d + i * 90) % 360, on * 0.9);
      O(c.rb[k + 'glow'], on * (0.55 + 0.45 * pulse(lt, 1.6)));
    });
    // red alarm wash
    const alarmEnv = on * (1 - ep(lt, s3 + 1.5, 1.5));
    O(c.red, alarmEnv * 0.16 * Math.pow(pulse(lt - alarmT, 1.25), 2));
    O(c.redV, alarmEnv * 0.25 * pulse(lt - alarmT, 1.25));
    c.leak.update(lt, 0.4 + 0.6 * on);
    // title slam
    const k = ep(lt, alarmT + 0.15, 0.45, E.outBack);
    T(c.tr.tri, 0, 0, lerp(2.2, 1, ep(lt, alarmT, 0.4, E.outBack)) * (1 + 0.06 * pulse(lt, 2) * on), 0, ep(lt, alarmT, 0.2));
    T(c.tr.l1, 0, 0, lerp(1.6, 1, k), 0, ep(lt, alarmT + 0.15, 0.2));
    T(c.tr.l2, 0, (1 - ep(lt, alarmT + 0.55, 0.5, E.outExpo)) * 80, 1, 0, ep(lt, alarmT + 0.55, 0.3));
    // badges for the third line
    popIn(c.br.b1, lt, info.word(2, 'пт', 1.5) - 0.1, { dy: 60, s0: 0.5 });
    popIn(c.br.plus, lt, info.word(2, 'пт', 1.5) + 0.25, { dy: 0, s0: 0.2 });
    popIn(c.br.b2, lt, info.word(2, 'тб', 2.0) - 0.1, { dy: 60, s0: 0.5 });
  },
};

// ======================= PTE =======================
SCENES.pte = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/><rect width="1080" height="1920" fill="url(#gridS)"/><rect width="1080" height="1920" fill="url(#grid)"/>`);
    const c = {};
    bgGlow(svg, 540, 760, 520, 'spot', 1);
    // blueprint turbine drawing (draw-on lines)
    c.bp = layer(svg, `<g transform="translate(540 770)" fill="none" stroke="#5aa2ff" stroke-width="3" stroke-opacity="0.55">
      <path pathLength="1" d="M-420 -90 L-300 -150 L300 -150 L420 -90 L420 90 L300 150 L-300 150 L-420 90Z"/>
      <path pathLength="1" d="M-470 0 L470 0" stroke-dasharray="1 1"/>
      ${[...Array(9)].map((_, i) => `<path pathLength="1" d="M${-240 + i * 60} ${-120 + Math.abs(4 - i) * 4} L${-240 + i * 60} ${120 - Math.abs(4 - i) * 4}"/>`).join('')}
      <circle pathLength="1" cx="0" cy="0" r="60"/></g>`);
    c.bpPaths = [...c.bp.querySelectorAll('[pathLength]')];
    // gears + rule book
    c.ill = layer(svg, `<g transform="translate(540 780)">
        <g data-k="gear1" ><path d="${gearD(0, 0, 150, 118, 12)}" fill="#1f5fbf"/><circle r="56" fill="#0d1f45"/><circle r="30" fill="#2f86ff"/></g>
        <g transform="translate(205 -110)"><g data-k="gear2"><path d="${gearD(0, 0, 92, 72, 9)}" fill="#ff8a1f"/><circle r="30" fill="#0d1f45"/></g></g>
        <g transform="translate(-210 110)"><g data-k="gear3"><path d="${gearD(0, 0, 80, 62, 8)}" fill="#2f86ff" opacity="0.8"/><circle r="26" fill="#0d1f45"/></g></g>
        <g data-k="book" transform="translate(0 20)">
          <path d="M-190 -110 Q-95 -140 0 -105 L0 125 Q-95 90 -190 120Z" fill="url(#paper)"/>
          <path d="M190 -110 Q95 -140 0 -105 L0 125 Q95 90 190 120Z" fill="#dfe7f2"/>
          <path d="M-190 120 Q-95 90 0 125 Q95 90 190 120 L190 136 Q95 106 0 141 Q-95 106 -190 136Z" fill="#1f5fbf"/>
          ${[0, 1, 2, 3, 4].map(i => `<path data-k="bl${i}" pathLength="1" d="M-160 ${-70 + i * 36} Q-95 ${-90 + i * 36} -30 ${-66 + i * 36}" stroke="#7a8ca8" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
          <text x="95" y="-20" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="64" fill="#1f5fbf">ПТЭ</text>
          <path d="M60 30 L84 54 L130 8" stroke="#ff8a1f" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" data-k="tick" pathLength="1"/>
          <g data-k="page"><path d="M0 -105 Q95 -140 190 -110 L190 120 Q95 90 0 125Z" fill="#f4f7fb"/></g>
        </g></g>`);
    c.ir = refs(c.ill);
    c.H = header(root, '01', '<span class="o">ПТЭ</span> —', 'Техникалық пайдалану қағидалары', { chip: 'ТЕХНИКАЛЫҚ ПАЙДАЛАНУ', tstyle: 'font-size:110px' });
    c.H.sub.style.cssText = 'font-size:52px;font-weight:800;color:#fff;text-transform:uppercase;line-height:1.1;margin-top:6px';
    const items = [['gearCheck', 'Жабдықты дұрыс пайдалану'], ['shield', 'Сенімді жұмыс'], ['gauge', 'Жұмыс параметрлерін сақтау'], ['wrench', 'Ақаулардың алдын алу']];
    c.pills = items.map(([ic, tx], i) => pill(root, 80 + (i % 2) * 0, 1040 + i * 88, 920, ICON[ic], tx));
    c.pills.forEach(p => { p.style.padding = '10px 24px'; p.style.fontSize = '36px'; p.querySelector('.ic').style.cssText = 'width:66px;height:66px;border-radius:18px'; });
    c.dust = new Dust(svg, 30, { a: 0.4, r: 3, speed: 18, seed: 4 });
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    c.bpPaths.forEach((p, i) => draw(p, ep(lt, 0.3 + i * 0.08, 1.4)));
    T(c.ir.gear1, 0, 0, ep(lt, 0.5, 0.8, E.outBack), lt * 25);
    T(c.ir.gear2, 0, 0, ep(lt, 0.7, 0.8, E.outBack), -lt * 25 * 150 / 92 + 10);
    T(c.ir.gear3, 0, 0, ep(lt, 0.8, 0.8, E.outBack), -lt * 25 * 150 / 80);
    const bk = ep(lt, 1.0, 0.8, E.outBack);
    T(c.ir.book, 0, 20 + (1 - bk) * 120, lerp(0.4, 1, bk), 0, ep(lt, 1.0, 0.3));
    // page flip: scaleX from 1 to -1 around spine
    const pf = ep(lt, 1.6, 0.9, E.inOutCubic);
    T(c.ir.page, 0, 0, [Math.cos(pf * Math.PI), 1], 0, pf < 1 ? 1 : 0);
    for (let i = 0; i < 5; i++) draw(c.ir['bl' + i], ep(lt, 2.2 + i * 0.15, 0.5));
    draw(c.ir.tick, ep(lt, 3.0, 0.5));
    c.pills.forEach((p, i) => popIn(p, lt, info.cue('b' + (i + 1)) - 0.1, { dx: i % 2 ? 120 : -120, dy: 0, s0: 0.9 }));
    // active pill glow
    c.pills.forEach((p, i) => {
      const a = info.cue('b' + (i + 1)), nx = i < 3 ? info.cue('b' + (i + 2)) : 1e9;
      p.style.borderColor = lt >= a && lt < nx ? 'rgba(255,138,31,0.9)' : 'rgba(99,179,255,0.35)';
    });
    c.dust.update(lt);
  },
};

// ======================= TB =======================
SCENES.tb = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>`);
    const c = {};
    // hexagon pattern backdrop
    let hex = '';
    for (let r = 0; r < 16; r++) for (let q = 0; q < 9; q++) {
      const x = q * 130 + (r % 2) * 65, y = 420 + r * 75;
      hex += `<path d="M${x} ${y - 40} L${x + 35} ${y - 20} L${x + 35} ${y + 20} L${x} ${y + 40} L${x - 35} ${y + 20} L${x - 35} ${y - 20}Z" fill="none" stroke="#2f86ff" stroke-opacity="${(0.05 + 0.1 * rnd(r * 9 + q)).toFixed(2)}" stroke-width="3"/>`;
    }
    layer(svg, hex);
    bgGlow(svg, 540, 1000, 560, 'spot', 1);
    c.shield = layer(svg, `<g transform="translate(540 1000)">
      <path d="M0 -380 L300 -280 Q300 160 0 380 Q-300 160 -300 -280Z" fill="none" stroke="#2f86ff" stroke-width="10" stroke-opacity="0.6"/>
      <path d="M0 -380 L300 -280 Q300 160 0 380 Q-300 160 -300 -280Z" fill="#2f86ff" opacity="0.08"/></g>`);
    c.ring = layer(svg, `<ellipse cx="540" cy="1372" rx="220" ry="40" fill="none" stroke="#ff8a1f" stroke-width="6"/>`);
    c.wg = layer(svg, '');
    c.w = new Worker(c.wg, 'tw');
    c.shine = layer(svg, `<rect x="-200" y="600" width="120" height="800" fill="#fff" opacity="0.18" transform="skewX(-20)"/>`);
    // callout tags (svg lines + html tags)
    const tags = [
      ['helmet', 'Дулыға', 700, 690, 380, 'R'], ['gloves', 'Қолғап', 1150, 1060, 240, 'L'], ['glasses', 'Көзілдірік', 780, 820, 380, 'L'],
      ['boots', 'Арнайы аяқ киім', 1330, 1290, 300, 'R'], ['uniform', 'Арнайы киім', 950, 900, 330, 'R'],
    ];
    c.tags = tags.map(([k, txt, y1, ty, len, side]) => {
      const x0 = side === 'R' ? 620 : 460, x1 = side === 'R' ? (k === 'boots' ? 680 : 760) : 320;
      const ln = layer(svg, `<path pathLength="1" d="M${x0} ${y1} L${x1} ${ty}" stroke="#ff8a1f" stroke-width="4" fill="none"/><circle cx="${x0}" cy="${y1}" r="9" fill="#ff8a1f"/>`);
      const el = html(`<div class="tag" style="white-space:nowrap;top:${ty - 30}px;${side === 'R' ? 'left:' + (x1) + 'px' : 'right:' + (1080 - x1) + 'px'};display:flex;gap:10px;align-items:center">
         <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="17" fill="#1a0d00"/><path d="M9 17 L15 23 L26 11" stroke="#ff8a1f" stroke-width="4.5" fill="none" stroke-linecap="round"/></svg>${txt}</div>`);
      root.appendChild(el);
      return { k, ln, el, path: ln.querySelector('path') };
    });
    c.H = header(root, '02', '<span class="o">ТБ</span> —', 'Қауіпсіздік техникасы', { chip: 'ҚАУІПСІЗДІК', tstyle: 'font-size:110px' });
    c.H.sub.style.cssText = 'font-size:52px;font-weight:800;color:#fff;text-transform:uppercase;margin-top:6px';
    c.dust = new Dust(svg, 24, { a: 0.35, r: 3, speed: 16, seed: 5, color: '#ffd9a8' });
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const tHel = info.word('ppe1', 'дулыға'), tGlo = info.word('ppe1', 'қолғап'), tGla = info.word('ppe1', 'қорғаныш');
    const aw = info.segs.find(s => s.cue === 'ppe2').words.filter(w => w.w.startsWith('арнайы'));
    const tBoo = aw[0].s - info.start, tU = (aw[1] || aw[0]).s - info.start + 0.2;
    const enter = ep(lt, 0.3, 0.8, E.outBack);
    const prot = info.cue('protect');
    c.w.set({ x: 540, y: 1370 + (1 - enter) * 80, s: 1.2, o: ep(lt, 0.3, 0.4), uniform: ep(lt, tU, 0.5), helmet: ep(lt, tHel - 0.1, 0.55, E.outBack),
      glasses: ep(lt, tGla, 0.4, E.outBack), gloves: ep(lt, tGlo, 0.3), boots: ep(lt, tBoo, 0.3), blink: blinkAt(lt),
      aL: [10 + ep(lt, tGlo, 0.3) * 6 * Math.sin(lt * 3), -ep(lt, tGlo - 0.2, 0.4) * 20], aR: [-10, 0],
      thumbR: lt > tU + 0.6, tilt: Math.sin(lt * 0.9) * 2 });
    if (lt > tU + 0.6) c.w.set({ x: 540, y: 1370, s: 1.2, uniform: 1, helmet: 1, glasses: 1, gloves: 1, boots: 1, blink: blinkAt(lt),
      aL: [10, 0], aR: [lerp(-10, -30, ep(lt, tU + 0.6, 0.4, E.outBack)), lerp(0, -120, ep(lt, tU + 0.6, 0.4, E.outBack))], thumbR: true, tilt: Math.sin(lt * 0.9) * 2 });
    const sh = ep(lt, prot, 0.7, E.outBack);
    T(c.shield, 540 * (1 - sh), 1000 * (1 - sh), sh, 0, sh * (0.7 + 0.3 * pulse(lt, 0.5)));
    T(c.ring, 540 * (1 - sh), 1372 * (1 - sh), sh, 0, sh);
    const shx = ep(lt, tU, 0.8, E.inOutCubic);
    T(c.shine, lerp(-200, 1400, shx), 0, 1, 0, shx > 0 && shx < 1 ? 1 : 0);
    const when = { helmet: tHel, gloves: tGlo, glasses: tGla, boots: tBoo, uniform: tU };
    c.tags.forEach(tg => { const a = when[tg.k] + 0.25; draw(tg.path, ep(lt, a, 0.3)); O(tg.ln, ep(lt, a, 0.1)); popIn(tg.el, lt, a + 0.2, { dy: 0, s0: 0.6 }); });
    c.dust.update(lt);
  },
};
