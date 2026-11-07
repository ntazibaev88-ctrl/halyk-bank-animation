// Scenes: equip, before, monitor, forbid, permit, emergency, fire, rules, final

function hallBG(svg) { // turbine hall interior with perspective floor
  let cols = '';
  for (let i = 0; i < 7; i++) cols += `<rect x="${i * 180 - 20}" y="380" width="44" height="1000" fill="#122a57"/><rect x="${i * 180 - 20}" y="380" width="12" height="1000" fill="#1b3a73"/>`;
  let floor = '';
  for (let i = -8; i <= 8; i++) floor += `<line x1="540" y1="1150" x2="${540 + i * 260}" y2="1920" stroke="#2f86ff" stroke-opacity="0.18" stroke-width="2"/>`;
  for (let k = 0; k < 8; k++) { const y = 1150 + Math.pow(k / 7, 1.8) * 770; floor += `<line x1="0" y1="${y.toFixed(0)}" x2="1080" y2="${y.toFixed(0)}" stroke="#2f86ff" stroke-opacity="0.15" stroke-width="2"/>`; }
  layer(svg, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>${cols}
    <rect x="0" y="420" width="1080" height="26" fill="#1b3a73"/><rect x="0" y="446" width="1080" height="8" fill="#ff8a1f" opacity="0.5"/>
    <rect x="0" y="1150" width="1080" height="770" fill="#081329"/>${floor}
    ${[...Array(6)].map((_, i) => `<circle cx="${90 + i * 180}" cy="470" r="70" fill="url(#glowY)" opacity="0.25"/>`).join('')}`);
}

// ======================= EQUIPMENT =======================
SCENES.equip = {
  build(root, info) {
    const svg = stage(root); hallBG(svg);
    const c = {};
    c.H = header(root, '03', 'ТЭЦ-тің негізгі<br><span class="o">жабдықтары</span>', null, { chip: 'ЖАБДЫҚТАР' });
    c.plat = layer(svg, `<ellipse cx="540" cy="1340" rx="380" ry="60" fill="url(#glowB)" opacity="0.6"/><ellipse cx="540" cy="1340" rx="330" ry="44" fill="none" stroke="#2f86ff" stroke-width="4" opacity="0.6"/>`);
    // intro: boiler -> turbine -> generator overview
    c.intro = layer(svg, '');
    c.introParts = [0, 1, 2].map(i => { const g = document.createElementNS(SVGNS, 'g'); c.intro.appendChild(g); const u = EQUIP[i].build(g); return { g, u }; });
    c.introArrows = layer(c.intro, `${arrow(375, 1000, 0, '#ff8a1f', 1.3)}${arrow(705, 1000, 0, '#ff8a1f', 1.3)}`);
    c.items = EQUIP.map((eq, i) => { const g = layer(svg, ''); const inner = document.createElementNS(SVGNS, 'g'); g.appendChild(inner); const u = eq.build(inner); return { g, inner, u }; });
    c.card = html(`<div class="card" style="left:70px;right:70px;top:470px;height:180px;padding:22px 30px;display:flex;gap:28px;align-items:center">
      <div data-k="num" style="flex:none;width:120px;height:120px;border-radius:30px;background:linear-gradient(140deg,#ff8a1f,#e0600a);display:grid;place-items:center;font-weight:900;font-size:64px;color:#1a0d00">1</div>
      <div style="flex:1;min-width:0"><div data-k="name" style="font-weight:900;font-size:58px;color:#ff8a1f;line-height:1">ҚАЗАНДЫҚ</div>
        <div data-k="desc" style="font-weight:700;font-size:32px;line-height:1.2;margin-top:10px;color:#fff">Бу өндіреді</div>
        <div data-k="dots" style="display:flex;gap:10px;margin-top:14px">${EQUIP.map(() => '<i style="width:22px;height:8px;border-radius:4px;background:rgba(255,255,255,.25);display:block"></i>').join('')}</div></div></div>`);
    root.appendChild(c.card); c.cr = refs(c.card); c.dots = [...c.cr.dots.children]; c.cur = -1;
    c.dust = new Dust(svg, 26, { a: 0.35, speed: 14, seed: 6 });
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const ts = EQUIP.map((_, i) => info.cue('e' + (i + 1)) - 0.35);
    // intro overview
    const io = 1 - ep(lt, ts[0] - 0.5, 0.4, E.inCubic);
    O(c.intro, Math.min(ep(lt, 0.5, 0.4), io));
    c.introParts.forEach((p, i) => { const k = ep(lt, 0.6 + i * 0.35, 0.6, E.outBack); T(p.g, 210 + i * 330, 1000 + (1 - k) * 80, 0.36 * k); p.u(lt); });
    O(c.introArrows, ep(lt, 1.6, 0.4));
    // card
    let idx = -1; ts.forEach((t, i) => { if (lt >= t) idx = i; });
    popIn(c.card, lt, ts[0] - 0.1, { dy: -40, s0: 0.9 });
    if (idx !== c.cur && idx >= 0) { c.cur = idx; c.cr.num.textContent = idx + 1; c.cr.name.textContent = EQUIP[idx].name; c.cr.desc.textContent = EQUIP[idx].desc; c.dots.forEach((d, i) => d.style.background = i <= idx ? '#ff8a1f' : 'rgba(255,255,255,.25)'); }
    if (idx >= 0) { const k = ep(lt, ts[idx], 0.5, E.outBack); c.cr.name.style.transform = `translateX(${(1 - k) * 60}px)`; c.cr.name.style.opacity = ep(lt, ts[idx], 0.3); c.cr.desc.style.opacity = ep(lt, ts[idx] + 0.15, 0.3); T(c.cr.num, 0, 0, lerp(0.5, 1, k), (1 - k) * -90); }
    O(c.plat, ep(lt, ts[0], 0.5));
    c.items.forEach((it, i) => {
      const a = ts[i], b = i < 9 ? ts[i + 1] : info.dur + 1;
      if (lt < a - 0.05 || lt > b + 0.6) { O(it.g, 0); return; }
      const kin = ep(lt, a, 0.65, E.outCubic), kout = ep(lt, b, 0.55, E.inCubic);
      const x = 540 + (1 - kin) * 760 - kout * 760;
      T(it.g, x, 1045 + Math.sin(lt * 1.2) * 6, 0.98 * lerp(0.7, 1, kin) * lerp(1, 0.7, kout), (1 - kin) * 8 - kout * 8, Math.min(kin * 1.5, 1 - kout));
      it.u(lt - a);
    });
    c.dust.update(lt);
  },
};

// ======================= BEFORE WORK =======================
SCENES.before = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>`);
    const c = {};
    // locker room wall
    let lk = '';
    for (let i = 0; i < 9; i++) lk += `<rect x="${i * 122 + 6}" y="880" width="112" height="440" rx="8" fill="#132d5e"/><rect x="${i * 122 + 16}" y="900" width="92" height="12" rx="4" fill="#1d3f7c"/><rect x="${i * 122 + 16}" y="920" width="92" height="12" rx="4" fill="#1d3f7c"/><rect x="${i * 122 + 92}" y="1080" width="8" height="50" rx="4" fill="#5d93dc"/>`;
    layer(svg, `${lk}<rect x="0" y="1320" width="1080" height="600" fill="#081329"/><rect x="0" y="1316" width="1080" height="8" fill="#1f5fbf"/>`);
    bgGlow(svg, 330, 1100, 380, 'spot', 1);
    c.H = header(root, '04', 'Жұмыс басталар<br><span class="o">алдында</span>', null, { chip: 'ДАЙЫНДЫҚ' });
    const items = [['helmet', 'Дулыға мен<br>арнайы киім'], ['eye', 'Жұмыс орны<br>мен жабдық'], ['gauge', 'Қысым мен<br>температура'], ['doc', 'Ауысымды<br>қабылдау']];
    c.items = items.map(([ic, tx], i) => {
      const el = html(`<div class="pill" style="left:${70 + (i % 2) * 480}px;top:${500 + Math.floor(i / 2) * 170}px;width:460px;height:150px;font-size:32px;padding:14px 20px;gap:18px">
        <div class="ic" style="width:78px;height:78px"><svg viewBox="-50 -50 100 100">${ICON[ic]}</svg></div><div style="flex:1">${tx}</div>
        <div data-k="box" style="flex:none;width:52px;height:52px;border-radius:14px;border:4px solid rgba(255,255,255,.5);display:grid;place-items:center">
        <svg data-k="ck" width="40" height="40" viewBox="-50 -50 100 100"><path d="M-30 0 L-8 22 L32 -22" stroke="#2ecc71" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg></div></div>`);
      root.appendChild(el); return { el, r: refs(el) };
    });
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'bw');
    c.jr = c.w.prop('R', `<g data-k="book" transform="translate(-6 120) rotate(-10)"><rect x="-40" y="-52" width="80" height="104" rx="8" fill="#ff8a1f"/><rect x="-32" y="-44" width="64" height="88" rx="4" fill="#fff3e3"/><text y="6" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="15" fill="#1a0d00">ЖУРНАЛ</text></g>`);
    // right-side vignettes
    c.v2 = layer(svg, ''); const pg = document.createElementNS(SVGNS, 'g'); c.v2.appendChild(pg); c.pumpU = EQUIP[3].build(pg); T(pg, 790, 1140, 0.5);
    c.mag = layer(c.v2, `<g><circle r="70" fill="#9fd2ff" fill-opacity="0.18" stroke="#fff" stroke-width="12"/><rect x="48" y="44" width="26" height="90" rx="12" fill="#ff8a1f" transform="rotate(-45 48 44)"/></g>`);
    c.v3 = layer(svg, `<g transform="translate(690 1110)">${gaugeSVG('bg', 120)}</g>
      <g transform="translate(930 1110)"><rect x="-34" y="-150" width="68" height="250" rx="34" fill="#f4f7fb"/><circle cy="110" r="50" fill="#f4f7fb"/><circle cy="110" r="36" fill="#e8262b"/>
      <rect data-k="merc" x="-14" y="-120" width="28" height="230" rx="14" fill="#e8262b"/>${[...Array(8)].map((_, i) => `<line x1="14" x2="30" y1="${-110 + i * 26}" y2="${-110 + i * 26}" stroke="#14213d" stroke-width="4"/>`).join('')}</g>
      <g data-k="ok" transform="translate(810 1310)"><rect x="-120" y="-34" width="240" height="64" rx="32" fill="#2ecc71"/><text y="12" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="#06311a">✓ НОРМА</text></g>`);
    c.v3r = refs(c.v3);
    c.w2g = layer(svg, ''); c.w2 = new Worker(c.w2g, 'pw', { helmet: '#2f86ff', helmetSh: '#1f5fbf', glove: '#d8dee8' });
    c.bub = html(`<div class="abs" style="left:640px;top:930px;padding:16px 26px;border-radius:26px;background:#fff;color:#0a1630;font-weight:800;font-size:30px;line-height:1.2;box-shadow:0 10px 30px rgba(0,0,0,.4)">Жабдық күйі,<br>ақаулар, ескертпелер</div>`);
    root.appendChild(c.bub);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const cs = [1, 2, 3, 4].map(i => info.cue('s' + i));
    c.items.forEach((it, i) => {
      popIn(it.el, lt, 0.8 + i * 0.12, { dy: 40 });
      const done = ep(lt, (i < 3 ? cs[i + 1] : info.dur - 1.2) - 0.5, 0.4);
      draw(it.r.ck.querySelector('path'), done);
      it.el.style.borderColor = lt >= cs[i] && done < 1 ? 'rgba(255,138,31,0.95)' : done >= 1 ? 'rgba(46,204,113,0.7)' : 'rgba(99,179,255,0.35)';
      it.r.box.style.borderColor = done > 0 ? '#2ecc71' : 'rgba(255,255,255,.5)';
    });
    // worker poses per step
    const hel = ep(lt, cs[0] + 0.2, 0.6, E.outBack);
    const lookDown = env(lt, cs[0] + 1.0, cs[1] - 0.2, 0.4, 0.4);
    const point = env(lt, cs[1], cs[2] - 0.1, 0.4, 0.3);
    const give = ep(lt, cs[3] + 0.6, 0.5);
    const slide = ep(lt, cs[3] - 0.2, 0.6, E.inOutCubic);
    c.w.set({ x: lerp(340, 300, slide), y: 1375, s: 0.8, helmet: hel, glasses: ep(lt, cs[0] + 1.0, 0.4), blink: blinkAt(lt), mouth: 0,
      tilt: lookDown * 12 - point * 6, lookY: lookDown * 6, look: point * 6 + give * 6,
      aL: [lerp(10, 30, lookDown), lerp(0, -60, lookDown)], aR: [lerp(-10, -95, point) + lerp(0, -40, give), lerp(0, -10, point) + lerp(0, -30, give)] });
    O(c.jr.book, give);
    // vignette: equipment inspection
    const v2 = env(lt, cs[1], cs[2], 0.4, 0.3);
    O(c.v2, v2); c.pumpU(lt);
    T(c.mag, 0, 0, 1); T(c.mag.firstChild, 700 + Math.sin(lt * 1.6) * 110, 1130 + Math.cos(lt * 2.1) * 60, 1);
    const v3 = env(lt, cs[2], cs[3], 0.4, 0.3);
    T(c.v3, (1 - ep(lt, cs[2], 0.5, E.outBack)) * 200, 0, 1, 0, v3);
    T(c.v3r.bgneedle, 0, 0, 1, needleRot(lerp(0, 0.45 + 0.03 * Math.sin(lt * 3), ep(lt, cs[2] + 0.3, 1.0, E.outElastic))));
    const mh = lerp(10, 150, ep(lt, cs[2] + 0.3, 1.2)); c.v3r.merc.setAttribute('y', 110 - mh); c.v3r.merc.setAttribute('height', mh);
    popIn(c.v3r.ok, lt, cs[2] + 1.6, { x: 810, y: 1310, dy: 20, s0: 0.5 });
    // previous shift colleague
    const w2 = ep(lt, cs[3] - 0.2, 0.7, E.outCubic);
    c.w2.set({ x: lerp(1250, 820, w2), y: 1375, s: 0.78, flip: true, o: w2, blink: blinkAt(lt, 1.3), mouth: lt > cs[3] + 0.8 ? 0.5 * pulse(lt, 3) : 0,
      aL: [10, 0], aR: [lerp(-10, -60, give), lerp(0, -40, give)], tilt: 3 });
    popIn(c.bub, lt, cs[3] + 0.9, { dy: 20, s0: 0.6 });
  },
};

// ======================= MONITORING =======================
SCENES.monitor = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/><rect width="1080" height="1920" fill="url(#gridS)"/>`);
    const c = {};
    c.H = header(root, '05', 'Жабдықты<br><span class="o">бақылау</span>', null, { chip: 'БАҚЫЛАУ' });
    const tiles = [['gauge', 'Қысым', 'p'], ['thermo', 'Температура', 't'], ['wave', 'Діріл', 'v'], ['ear', 'Шу', 'n'], ['drop', 'Ағу', 'l'], ['level', 'Су деңгейі', 'w'], ['status', 'Жай-күйі', 's']];
    c.tiles = tiles.map(([ic, tx, k], i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const x = row === 0 ? 70 + col * 240 : 190 + col * 240;
      const el = html(`<div class="card" style="left:${x}px;top:${500 + row * 250}px;width:220px;height:230px;padding:18px;text-align:center">
        <div class="ic" style="width:74px;height:74px;margin:0 auto;border-radius:20px;display:grid;place-items:center;background:linear-gradient(140deg,#2f86ff,#1f5fbf)"><svg width="50" height="50" viewBox="-50 -50 100 100">${ICON[ic]}</svg></div>
        <div style="font-weight:800;font-size:27px;margin-top:12px;white-space:nowrap">${tx}</div>
        <div data-k="val" style="font-weight:900;font-size:36px;margin-top:6px;color:#2ecc71">—</div></div>`);
      root.appendChild(el); return { el, r: refs(el), k, ic: el.querySelector('.ic') };
    });
    // equipment line
    c.line = layer(svg, `
      <rect x="0" y="1238" width="1080" height="56" fill="url(#pipeB)"/>
      <rect x="590" y="1218" width="30" height="96" rx="6" fill="#5c7fb5"/>
      <g transform="translate(860 1180)"><rect x="-90" y="-120" width="180" height="240" rx="20" fill="url(#tankV)"/><circle cy="-10" r="60" fill="#0a1630"/><g data-k="imp">${vanes(6, 10, 52, 40, 9, '#9db6d6')}</g></g>`);
    c.lr = refs(c.line);
    c.leak = new Puffs(svg, 18, { x: 605, y: 1216, life: 1.2, rise: 220, wind: 40, r0: 12, r1: 70, a: 0.85, spread: 16, seed: 51 });
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'mw');
    c.tab = c.w.prop('L', `<g data-k="tab" transform="translate(30 100) rotate(-20)"><rect x="-50" y="-36" width="100" height="72" rx="10" fill="#14213d" stroke="#9db6d6" stroke-width="4"/><path d="M-36 14 L-14 -6 L4 8 L34 -20" stroke="#2ecc71" stroke-width="6" fill="none"/></g>`);
    c.radio = c.w.prop('R', `<g data-k="radio" transform="translate(0 100)"><rect x="-18" y="-40" width="36" height="66" rx="8" fill="#222a36"/><rect x="6" y="-70" width="7" height="32" rx="3" fill="#222a36"/><rect x="-11" y="-30" width="22" height="16" rx="3" fill="#2ecc71"/></g>`);
    c.waves = layer(svg, `<g transform="translate(355 1000)" stroke="#ffd23f" stroke-width="7" fill="none" stroke-linecap="round">
      <path d="M0 -26 Q20 0 0 26"/><path d="M22 -48 Q56 0 22 48"/><path d="M44 -70 Q92 0 44 70"/></g>`);
    c.red = layer(svg, `<rect width="1080" height="1920" fill="none" stroke="#ff2b2b" stroke-width="40"/><rect width="1080" height="1920" fill="#ff1e1e" opacity="0.08"/>`);
    c.warn = layer(svg, `<g transform="translate(700 1060)">${warnSign(ICON.alert.replace(/fill="#fff"/g, 'fill="#1a1a1a"').replace(/stroke="#fff"/g, 'stroke="#1a1a1a"'), 80)}</g>`);
    c.boss = html(`<div class="pill" style="left:450px;top:1010px;width:560px;font-size:30px;border-color:#ffd23f"><div class="ic" style="background:linear-gradient(140deg,#ffd23f,#e0a800)"><svg viewBox="-50 -50 100 100">${ICON.radio}</svg></div><div>Ауысым бастығына<br><b style="color:#ffd23f">ДЕРЕУ ХАБАРЛА!</b></div></div>`);
    root.appendChild(c.boss);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const m1 = info.cue('m1'), m2 = info.cue('m2'), m3 = info.cue('m3'), al = info.cue('alarm'), rp = info.cue('report');
    const group = { p: m1, t: m1, v: m2, n: m2, l: m3, w: m3, s: m3 };
    const alarm = ep(lt, al, 0.3);
    c.tiles.forEach((tl, i) => {
      popIn(tl.el, lt, 0.7 + i * 0.08, { dy: 40, s0: 0.8 });
      const act = lt >= group[tl.k] && lt < group[tl.k] + 2.4;
      tl.el.style.borderColor = act ? 'rgba(255,138,31,0.95)' : 'rgba(99,179,255,0.35)';
      tl.el.style.transform += act ? ' scale(1.05)' : '';
      let v = '', bad = false;
      const j = Math.sin(lt * 7 + i) * 0.5;
      switch (tl.k) {
        case 'p': v = (lerp(1.42, 2.31, alarm) + j * 0.01).toFixed(2) + ' МПа'; bad = alarm > 0.5; break;
        case 't': v = Math.round(lerp(140, 168, alarm) + j) + '°C'; break;
        case 'v': v = (2.1 + j * 0.2).toFixed(1) + ' мм/с'; break;
        case 'n': v = Math.round(78 + j * 2) + ' дБ'; break;
        case 'l': v = alarm > 0.5 ? 'ИӘ!' : 'ЖОҚ'; bad = alarm > 0.5; break;
        case 'w': v = Math.round(52 + j * 2) + '%'; break;
        case 's': v = alarm > 0.5 ? 'АҚАУ' : 'ҚАЛЫПТЫ'; bad = alarm > 0.5; break;
      }
      tl.r.val.textContent = v; tl.r.val.style.color = bad ? '#ff4d4d' : '#2ecc71';
      tl.r.val.style.fontSize = v.length > 7 ? '28px' : '36px';
      if (bad) { tl.el.classList.add('warn'); tl.el.style.borderColor = pulse(lt, 2) > 0.5 ? '#ff4d4d' : 'rgba(255,90,90,0.4)'; tl.ic.style.background = 'linear-gradient(140deg,#ff4d4d,#b31b1b)'; }
      else { tl.el.classList.remove('warn'); tl.ic.style.background = 'linear-gradient(140deg,#2f86ff,#1f5fbf)'; }
    });
    O(c.line, ep(lt, 0.8, 0.5));
    T(c.lr.imp, 0, -10, 1, lt * 300);
    c.leak.update(lt, alarm);
    const rep = ep(lt, rp, 0.5, E.outBack);
    c.w.set({ x: 230, y: 1375, s: 0.66, blink: blinkAt(lt), o: ep(lt, 0.9, 0.4), tilt: alarm * 6 - rep * 4, look: 5,
      aL: [lerp(30, 15, alarm), lerp(-90, -20, alarm)], aR: [lerp(-10, -20, rep), lerp(0, -150, rep)], mouth: lt > rp + 0.3 ? 0.5 * pulse(lt, 4) : 0 });
    O(c.tab.tab, 1 - alarm * 0.0);
    O(c.radio.radio, rep);
    const wv = lt > rp + 0.3 ? 1 : 0;
    [...c.waves.firstChild.children].forEach((p, i) => O(p, wv * pulse(lt * 1.5 - i * 0.2, 1)));
    O(c.red, alarm * (1 - ep(lt, rp + 1.5, 0.8)) * (0.4 + 0.6 * pulse(lt, 1.5)));
    T(c.warn, 0, 0, 1, 0, 0);
    const wk = ep(lt, al + 0.1, 0.5, E.outBack);
    T(c.warn.firstChild, 700, 1060 - (1 - wk) * 60, wk * (1 + 0.05 * pulse(lt, 2)), 0, ep(lt, al + 0.1, 0.2) * (1 - ep(lt, rp - 0.2, 0.3)));
    popIn(c.boss, lt, rp + 0.1, { dx: 120, dy: 0, s0: 0.9 });
  },
};

// ======================= PROHIBITED =======================
SCENES.forbid = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgRed)"/><rect width="1080" height="1920" fill="url(#gridS)" opacity="0.5"/>`);
    const c = {};
    bgGlow(svg, 540, 900, 600, 'glowR', 0.18);
    layer(svg, `<rect x="0" y="1360" width="1080" height="30" fill="url(#hazard)" opacity="0.8"/>`);
    c.H = header(root, '06', 'Тыйым салынған<br><span class="o" style="color:#ff4d4d">әрекеттер</span>', null, { chip: 'ТЫЙЫМ' });
    c.H.chip.style.cssText = 'background:rgba(255,59,59,.14);border-color:rgba(255,80,80,.6);color:#ff8080';
    const items = [['doc', 'Наряд-рұқсатсыз<br>жұмыс'], ['guard', 'Қорғаныш қоршауын<br>алу'], ['rotate', 'Айналатын бөлшекке<br>қол тигізу'], ['pipe', 'Қысымдағы құбырды<br>ашу'], ['height', 'Биіктікте белбеусіз<br>жұмыс'], ['start', 'Жабдықты рұқсатсыз<br>іске қосу']];
    c.cards = items.map(([ic, tx], i) => {
      const el = html(`<div class="card warn" style="left:${70 + (i % 2) * 480}px;top:${500 + Math.floor(i / 2) * 285}px;width:460px;height:265px;text-align:center;padding-top:16px">
        <svg width="150" height="150" viewBox="-110 -110 220 220"><g data-k="sg">${noSign(`<g transform="scale(1)">${ICON[ic]}</g>`, 100).replace('<circle r="100" fill="#fff"/>', '<circle r="100" fill="#13264a"/>')}</g></svg>
        <div style="font-weight:800;font-size:28px;line-height:1.15;margin-top:6px">${tx}</div>
        <div data-k="st" class="abs" style="right:14px;top:14px;padding:6px 14px;border:4px solid #ff4d4d;border-radius:10px;color:#ff4d4d;font-weight:900;font-size:22px;transform:rotate(8deg)">БОЛМАЙДЫ</div></div>`);
      root.appendChild(el); return { el, r: refs(el) };
    });
    c.banner = html(`<div class="abs" style="left:50px;right:50px;top:760px;padding:40px 30px;border-radius:34px;text-align:center;background:linear-gradient(160deg,#e8262b,#8f0f14);
       box-shadow:0 30px 90px rgba(0,0,0,.6);border:6px solid #ffd23f">
       <svg width="120" height="120" viewBox="-110 -110 220 220">${noSign(ICON.hand.replace('fill="#fff"', 'fill="#14213d"'), 100)}</svg>
       <div style="font-weight:900;font-size:62px;line-height:1.08;margin-top:14px">ҚАУІПСІЗДІК ЕРЕЖЕЛЕРІН<br><span style="color:#ffd23f">БҰЗУҒА БОЛМАЙДЫ!</span></div></div>`);
    root.appendChild(c.banner);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const cs = [1, 2, 3, 4, 5, 6].map(i => info.cue('f' + i)), fin = info.cue('final');
    c.cards.forEach((cd, i) => {
      const a = cs[i] - 0.1, b = (i < 5 ? cs[i + 1] : fin) - 0.15;
      const slotX = 70 + (i % 2) * 480, slotY = 500 + Math.floor(i / 2) * 285;
      // zoom-in at center, then dock into slot
      const kin = ep(lt, a, 0.45, E.outBack), kd = ep(lt, b, 0.5, E.inOutCubic);
      const cx = 540 - 230 - slotX, cy = 930 - 132 - slotY;
      const s = lerp(lerp(0.4, 1.55, kin), 1, kd);
      const zoomed = cs.some((t, j) => j !== i && lt > t - 0.1 && lt < (j < 5 ? cs[j + 1] : fin) - 0.15 + 0.3);
      T(cd.el, cx * (1 - kd), cy * (1 - kd), s, 0, ep(lt, a, 0.2) * (1 - 0.65 * ep(lt, fin, 0.4)) * (zoomed && kd >= 1 ? 0.45 : 1));
      cd.el.style.zIndex = lt < b + 0.5 ? 5 : 1;
      const st = ep(lt, a + 0.45, 0.3, E.outBack);
      cd.r.st.style.transform = `rotate(8deg) scale(${lerp(2.5, 1, st)})`; cd.r.st.style.opacity = st;
      const shake = lt > a + 0.45 && lt < a + 0.85 ? Math.sin(lt * 70) * 6 * (1 - (lt - a - 0.45) / 0.4) : 0;
      T(cd.r.sg, shake, 0, 1);
    });
    const bk = ep(lt, fin - 0.05, 0.5, E.outBack);
    T(c.banner, 0, (1 - bk) * 40, lerp(1.6, 1, bk), 0, ep(lt, fin - 0.05, 0.2));
    c.banner.style.zIndex = 10;
  },
};

// ======================= WORK PERMIT =======================
SCENES.permit = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/><rect width="1080" height="1920" fill="url(#grid)" opacity="0.6"/>`);
    const c = {};
    c.H = header(root, '07', 'Наряд-рұқсат<br><span class="o">және ажырату</span>', null, { chip: 'РӘСІМ' });
    // document
    c.doc = layer(svg, `<g transform="translate(300 820) rotate(-4)">
      <rect x="-225" y="-300" width="450" height="600" rx="14" fill="#000" opacity="0.3" transform="translate(12 16)"/>
      <rect x="-225" y="-300" width="450" height="600" rx="14" fill="url(#paper)"/>
      <rect x="-225" y="-300" width="450" height="86" rx="14" fill="#1f5fbf"/><rect x="-225" y="-230" width="450" height="16" fill="#1f5fbf"/>
      <text x="0" y="-246" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="38" fill="#fff">НАРЯД-РҰҚСАТ</text>
      <text x="0" y="-178" text-anchor="middle" font-family="Montserrat" font-weight="700" font-size="22" fill="#5c6b80">№ 047 · ЖӨНДЕУ ЖҰМЫСЫ</text>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="-190" y="${-140 + i * 62}" width="26" height="26" rx="6" fill="none" stroke="#1f5fbf" stroke-width="4"/>
        <path data-k="dk${i}" pathLength="1" d="M-186 ${-127 + i * 62} L-178 ${-119 + i * 62} L-166 ${-135 + i * 62}" stroke="#2ecc71" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path data-k="dl${i}" pathLength="1" d="M-140 ${-127 + i * 62} L${120 - (i % 2) * 70} ${-127 + i * 62}" stroke="#9aa8bd" stroke-width="10" stroke-linecap="round"/>`).join('')}
      <path data-k="sig" pathLength="1" d="M-170 230 Q-150 180 -130 228 Q-112 260 -96 210 Q-84 186 -70 232 Q-50 250 -20 214" stroke="#1f3f7a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <line x1="-180" y1="246" x2="0" y2="246" stroke="#9aa8bd" stroke-width="3"/>
      <g data-k="stamp" transform="translate(110 200) rotate(-14)"><rect x="-110" y="-46" width="220" height="92" rx="12" fill="none" stroke="#2ecc71" stroke-width="7"/>
        <text y="-6" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="28" fill="#2ecc71">РҰҚСАТ</text><text y="28" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="28" fill="#2ecc71">ЕТІЛДІ ✓</text></g>
    </g>`);
    c.dr = refs(c.doc);
    const steps = [['power', 'Ажырату'], ['lock', 'Бұғаттау'], ['alert', 'Белгілер орнату'], ['check', 'Тексеру'], ['doc', 'Ресми рұқсат']];
    c.steps = steps.map(([ic, tx], i) => { const p = pill(root, 580, 520 + i * 106, 440, ICON[ic], tx); p.style.fontSize = '32px'; p.style.padding = '10px 18px'; p.querySelector('.ic').style.cssText = 'width:70px;height:70px'; return p; });
    // lockout panel
    c.lock = layer(svg, `<g transform="translate(250 1250)">
      <rect x="-170" y="-110" width="340" height="230" rx="18" fill="#2a3e5f"/><rect x="-150" y="-90" width="300" height="190" rx="10" fill="#1b2a44"/>
      <rect x="-40" y="-70" width="80" height="150" rx="10" fill="#0d1628"/>
      <g data-k="lever"><rect x="-20" y="-60" width="40" height="70" rx="8" fill="#e8262b"/></g>
      <text x="0" y="-122" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="28" fill="#2ecc71" data-k="on">ҚОСУЛЫ</text>
      <text x="0" y="-122" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="28" fill="#ff6b6b" data-k="off">АЖЫРАТЫЛДЫ</text>
      <g data-k="pad" transform="translate(100 40)"><path d="M-22 0 L-22 -26 A22 22 0 0 1 22 -26 L22 0" stroke="#c9d3e0" stroke-width="10" fill="none"/><rect x="-34" y="-4" width="68" height="56" rx="10" fill="#ff8a1f"/><circle cy="18" r="7" fill="#1a0d00"/></g>
    </g>`);
    c.lr = refs(c.lock);
    c.sign = layer(svg, `<g transform="translate(760 1135)"><g data-k="sw"><line x1="0" y1="-20" x2="0" y2="20" stroke="#c9d3e0" stroke-width="5"/>
      <rect x="-210" y="20" width="420" height="200" rx="12" fill="#fff" stroke="#e8262b" stroke-width="10"/>
      <rect x="-200" y="30" width="400" height="80" fill="#e8262b"/>
      <text y="86" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="50" fill="#fff">ҚОСПАҢЫЗ!</text>
      <text y="152" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="30" fill="#14213d">АДАМДАР</text>
      <text y="192" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="30" fill="#14213d">ЖҰМЫС ІСТЕУДЕ</text></g></g>`);
    c.sr = refs(c.sign);
    c.badge = html(`<div class="abs" style="left:150px;right:150px;top:760px;padding:34px;border-radius:34px;background:linear-gradient(160deg,#1f5fbf,#0c1c3d);border:5px solid #ffd23f;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.6)">
      <svg width="130" height="130" viewBox="-50 -50 100 100"><rect x="-38" y="-46" width="76" height="92" rx="10" fill="#fff"/><rect x="-12" y="-52" width="24" height="12" rx="4" fill="#ffd23f"/><circle cy="-14" r="15" fill="#1f5fbf"/><path d="M-24 20 Q0 -4 24 20" fill="#1f5fbf"/><rect x="-24" y="28" width="48" height="6" rx="3" fill="#ff8a1f"/></svg>
      <div style="font-weight:900;font-size:46px;line-height:1.1;margin-top:12px">ТЕК <span style="color:#ffd23f">ӨКІЛЕТТІ</span><br>ҚЫЗМЕТКЕРЛЕР</div></div>`);
    root.appendChild(c.badge);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const p1 = info.cue('p1'), p2 = info.cue('p2'), p3 = info.cue('p3'), p4 = info.cue('p4');
    const dk = ep(lt, 0.5, 0.7, E.outBack);
    T(c.doc, (1 - dk) * -500, 0, 1, 0, ep(lt, 0.5, 0.3));
    for (let i = 0; i < 5; i++) draw(c.dr['dl' + i], ep(lt, 1.2 + i * 0.25, 0.5));
    const tk = [p1 + 0.3, p1 + 1.4, p2 + 0.4, p2 + 1.8, p3 + 0.5];
    tk.forEach((t, i) => draw(c.dr['dk' + i], ep(lt, t, 0.3)));
    draw(c.dr.sig, ep(lt, p3 + 0.2, 1.0));
    const st = ep(lt, p3 + 0.8, 0.35, E.outBack);
    T(c.dr.stamp, 110, 200, lerp(2.4, 1, st), -14, st);
    c.steps.forEach((p, i) => { popIn(p, lt, tk[i] - 0.2, { dx: 140, dy: 0 }); p.style.borderColor = lt > tk[i] + 0.3 ? 'rgba(46,204,113,.8)' : 'rgba(99,179,255,0.35)'; });
    // lockout
    O(c.lock, ep(lt, p1 - 0.3, 0.4));
    const lv = ep(lt, p1 + 0.3, 0.4, E.outBack);
    T(c.lr.lever, 0, lv * 70, 1);
    O(c.lr.on, 1 - lv); O(c.lr.off, lv);
    const pd = ep(lt, p1 + 1.3, 0.5, E.outBack);
    T(c.lr.pad, 100, 40 - (1 - pd) * 160, 1, 0, ep(lt, p1 + 1.3, 0.2));
    const sk = ep(lt, p2, 0.6, E.outBack);
    T(c.sign, 0, -(1 - sk) * 300, 1, 0, ep(lt, p2, 0.2));
    T(c.sr.sw, 0, 0, 1, Math.sin((lt - p2) * 4) * 8 * Math.exp(-(Math.max(0, lt - p2)) * 1.2));
    const bd = ep(lt, p4 - 0.05, 0.5, E.outBack);
    T(c.badge, 0, (1 - bd) * 60, lerp(0.6, 1, bd), 0, ep(lt, p4 - 0.05, 0.25));
  },
};

// ======================= EMERGENCY =======================
SCENES.emergency = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgRed)"/>`);
    const c = {};
    c.flash = layer(svg, `<rect width="1080" height="1920" fill="url(#glowR)" transform="translate(540 900) scale(1.5) translate(-540 -540)"/>`);
    c.H = header(root, '08', 'Апаттық<br><span class="o" style="color:#ff4d4d">жағдайлар</span>', null, { chip: 'АПАТ' });
    c.H.chip.style.cssText = 'background:rgba(255,59,59,.14);border-color:rgba(255,80,80,.6);color:#ff8080';
    const V = [];
    // 1 steam leak
    V.push(layer(svg, `<g transform="translate(540 900)"><rect x="-420" y="-40" width="840" height="80" fill="url(#pipeB)"/><rect x="-30" y="-62" width="60" height="124" rx="8" fill="#5c7fb5"/></g>`));
    V[0].puffs = new Puffs(V[0], 26, { x: 540, y: 838, life: 1.0, rise: 360, wind: 80, r0: 14, r1: 110, a: 0.9, spread: 12, seed: 61 });
    // 2 water pipe damage
    V.push(layer(svg, `<g transform="translate(540 880)"><rect x="-420" y="-40" width="840" height="80" fill="url(#pipeB)"/><path d="M-20 -40 L0 -10 L-10 10 L10 40" stroke="#081329" stroke-width="8" fill="none"/>
       <ellipse cx="0" cy="250" rx="260" ry="34" fill="#2f86ff" opacity="0.5"/></g><g data-k="drops"></g>`));
    V[1].drops = [...Array(30)].map(() => { const e = document.createElementNS(SVGNS, 'ellipse'); e.setAttribute('rx', 7); e.setAttribute('ry', 11); e.setAttribute('fill', '#7cc4ff'); V[1].querySelector('[data-k=drops]').appendChild(e); return e; });
    // 3 pump failure
    V.push(layer(svg, '')); { const g = document.createElementNS(SVGNS, 'g'); V[2].appendChild(g); EQUIP[3].build(g); T(g, 500, 900, 0.75); V[2].appendChild(svgFrag(`<g data-k="x" transform="translate(500 900)"><circle r="130" fill="#e8262b" opacity="0.85"/><path d="M-60 -60 L60 60 M60 -60 L-60 60" stroke="#fff" stroke-width="26" stroke-linecap="round"/></g>`));
      V[2].puffs = new Puffs(V[2], 12, { x: 640, y: 800, life: 2.2, rise: 260, wind: 50, r0: 16, r1: 70, a: 0.6, fill: 'url(#smoke)', spread: 40, seed: 62 }); }
    // 4 fire warning
    V.push(layer(svg, `<g transform="translate(540 900)"><circle r="260" fill="url(#glowO)" data-k="fg"/>
       ${[0, 1, 2, 3, 4].map(i => `<path data-k="f${i}" d="M${-160 + i * 80} 150 Q${-200 + i * 80} 40 ${-150 + i * 80} -60 Q${-120 + i * 80} 10 ${-110 + i * 80} -10 Q${-100 + i * 80} -140 ${-60 + i * 80} -200 Q${-40 + i * 80} 0 ${-80 + i * 80} 150Z" fill="url(#flame)"/>`).join('')}
       <g transform="translate(260 -170)"><circle r="70" fill="#e8262b"/><path d="M-30 20 L-30 -6 A30 30 0 0 1 30 -6 L30 20 L40 30 L-40 30Z" fill="#fff"/><circle cy="40" r="10" fill="#fff"/></g></g>`));
    // 5 power outage
    V.push(layer(svg, `<g transform="translate(540 880)"><g data-k="bulb"><circle cy="-40" r="200" fill="url(#glowY)" data-k="bg"/><path d="M-90 -40 A90 90 0 1 1 90 -40 Q90 10 50 50 L50 100 L-50 100 L-50 50 Q-90 10 -90 -40Z" fill="#ffe27a" data-k="gl"/>
       <rect x="-50" y="100" width="100" height="50" rx="10" fill="#9aa5b5"/></g>
       <g data-k="nx" transform="translate(0 -20)">${noSign(ICON.power.replace(/stroke="#fff"/g, 'stroke="#14213d"'), 110).replace('<circle r="110" fill="#fff"/>', '<circle r="110" fill="#fff" opacity="0.9"/>')}</g></g>`));
    c.V = V;
    const labels = ['Бу ағуы', 'Құбыр зақымдануы', 'Насос ақауы', 'Өрт белгісі', 'Қуаттың өшуі'];
    const icons = ['steam', 'drop', 'gearCheck', 'fire', 'noPower'];
    c.chips = labels.map((l, i) => { const el = html(`<div class="abs" style="left:${40 + i * 202}px;top:1170px;width:192px;height:170px;border-radius:24px;background:rgba(40,8,12,.85);border:3px solid rgba(255,90,90,.6);text-align:center;padding-top:14px">
       <svg width="70" height="70" viewBox="-50 -50 100 100">${ICON[icons[i]]}</svg><div style="font-weight:800;font-size:22px;line-height:1.15;margin-top:8px;padding:0 8px">${l}</div></div>`); root.appendChild(el); return el; });
    // response
    c.walkG = layer(svg, ''); c.walker = new Walker(c.walkG, 'ew');
    c.danger = new Puffs(svg, 20, { x: 1000, y: 1330, life: 1.4, rise: 500, wind: -60, r0: 20, r1: 120, a: 0.8, spread: 40, seed: 64 });
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'ew2');
    c.radio = c.w.prop('R', `<g transform="translate(0 100)"><rect x="-18" y="-40" width="36" height="66" rx="8" fill="#222a36"/><rect x="6" y="-70" width="7" height="32" rx="3" fill="#222a36"/><rect x="-11" y="-30" width="22" height="16" rx="3" fill="#2ecc71"/></g>`);
    c.waves = layer(svg, `<g transform="translate(330 985)" stroke="#ffd23f" stroke-width="7" fill="none" stroke-linecap="round"><path d="M0 -26 Q20 0 0 26"/><path d="M22 -48 Q56 0 22 48"/><path d="M44 -70 Q92 0 44 70"/></g>`);
    const acts = [['noEntry', 'Жұмысты<br><b style="color:#ffd23f">ТОҚТАТ</b>'], ['people', 'Адамдарды<br><b style="color:#ffd23f">ҚАУІПСІЗ ЖЕРГЕ</b>'], ['radio', 'Басшыға<br><b style="color:#ffd23f">ДЕРЕУ ХАБАРЛА</b>']];
    c.acts = acts.map(([ic, tx], i) => { const p = pill(root, 480, 560 + i * 150, 540, ICON[ic], `<span style="font-size:32px">${tx}</span>`); p.style.borderColor = '#ffd23f'; return p; });
    c.nums = c.acts.map((p, i) => { const n = html(`<div style="position:absolute;left:-18px;top:-18px;width:48px;height:48px;border-radius:50%;background:#ffd23f;color:#1a0d00;font-weight:900;font-size:28px;display:grid;place-items:center">${i + 1}</div>`); p.appendChild(n); return n; });
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const tw = [info.word('x1', 'бу'), info.word('x1', 'су'), info.word('x1', 'насос'), info.word('x2', 'өрт'), info.word('x2', 'электр')];
    tw[0] = Math.min(tw[0], info.cue('x1'));
    const a1 = info.cue('act1'), a2 = info.cue('act2');
    O(c.flash, (0.25 + 0.25 * pulse(lt, 1.2)) * (1 - ep(lt, a1, 0.5)));
    c.V.forEach((v, i) => {
      const a = tw[i] - 0.15, b = i < 4 ? tw[i + 1] - 0.15 : a1 - 0.2;
      const k = ep(lt, a, 0.4, E.outBack), ko = ep(lt, b - 0.1, 0.22, E.inCubic);
      T(v, 540 * (1 - lerp(0.7, 1, k)) + ko * -200, 900 * (1 - lerp(0.7, 1, k)), lerp(0.7, 1, k), 0, Math.min(ep(lt, a + 0.1, 0.2), 1 - ko));
      const ll = lt - a;
      if (v.puffs) v.puffs.update(ll);
      if (v.drops) v.drops.forEach((d, j) => { const ph = (ll * 1.1 + j / 30) % 1; const ang = (rnd(j) - 0.5) * 2.2; d.setAttribute('cx', (540 + Math.sin(ang) * ph * 320).toFixed(0)); d.setAttribute('cy', (860 - Math.cos(ang) * 200 * ph + 500 * ph * ph).toFixed(0)); d.setAttribute('opacity', (1 - ph).toFixed(2)); });
    });
    const r3 = refs(c.V[2]); T(r3.x, 500, 900, ep(lt, tw[2] + 0.3, 0.4, E.outBack) * (1 + 0.06 * pulse(lt, 2)), 0, 0.9);
    const r4 = refs(c.V[3]); for (let i = 0; i < 5; i++) T(r4['f' + i], 0, 150 * (1 - (0.8 + 0.2 * Math.sin(lt * 10 + i * 1.7))), [1, 0.8 + 0.2 * Math.sin(lt * 10 + i * 1.7)]);
    const r5 = refs(c.V[4]); const off = ep(lt, tw[4] + 0.5, 0.15); const flick = off < 1 && lt > tw[4] + 0.2 && Math.sin(lt * 50) > 0 ? 0.4 : 1;
    O(r5.bg, (1 - off) * flick); r5.gl.setAttribute('fill', off > 0.5 ? '#3a4250' : '#ffe27a'); O(r5.nx, ep(lt, tw[4] + 0.8, 0.3));
    c.chips.forEach((ch, i) => { popIn(ch, lt, tw[i] + 0.2, { dy: 40, s0: 0.6, out: a1 - 0.3 }); });
    // response part
    const wk = ep(lt, a1, 2.2, E.inOutSine);
    c.danger.update(lt, ep(lt, a1 - 0.2, 0.4) * (1 - ep(lt, a2 + 0.5, 0.5)));
    c.walker.set({ x: lerp(820, 260, wk), y: 1370, s: -0.62, phase: lt * 1.4, amp: lt < a1 + 2.2 ? 1 : 0, o: ep(lt, a1 - 0.2, 0.3) * (1 - ep(lt, a1 + 2.2, 0.25)) });
    T(c.walker.r.root, lerp(820, 260, wk), 1370, [-0.62, 0.62], 0, ep(lt, a1 - 0.2, 0.3) * (1 - ep(lt, a1 + 2.2, 0.25)));
    const st = ep(lt, a1 + 2.2, 0.3);
    const rr = ep(lt, info.word('act2', 'басшыға', 2) - 0.2, 0.5, E.outBack);
    c.w.set({ x: 240, y: 1375, s: 0.66, o: st, blink: blinkAt(lt), aL: [10, 0], aR: [lerp(-10, -20, rr), lerp(0, -150, rr)], look: -4, mouth: rr > 0.9 ? 0.5 * pulse(lt, 4) : 0 });
    [...c.waves.firstChild.children].forEach((p, i) => O(p, (rr > 0.9 ? 1 : 0) * pulse(lt * 1.5 - i * 0.2, 1)));
    const at = [a1 + 0.1, info.word('act2', 'адамдардың', 0.2) - 0.1, info.word('act2', 'басшыға', 2) - 0.1];
    c.acts.forEach((p, i) => popIn(p, lt, at[i], { dx: 140, dy: 0 }));
  },
};

// ======================= FIRE =======================
function extinguisher(label, col, nozzle) {
  return `<rect x="-52" y="-150" width="104" height="300" rx="46" fill="${col}"/><rect x="-38" y="-140" width="18" height="270" rx="9" fill="#fff" opacity="0.25"/>
    <rect x="-46" y="-40" width="92" height="80" rx="8" fill="#fff"/><text y="12" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="#14213d">${label}</text>
    <rect x="-16" y="-186" width="32" height="40" fill="#2b2f36"/><path d="M-30 -186 L40 -200 L44 -190 L-26 -176Z" fill="#2b2f36"/>
    ${nozzle}`;
}
SCENES.fire = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>`);
    const c = {};
    bgGlow(svg, 540, 760, 520, 'glowO', 0.25);
    c.H = header(root, '09', 'Өрт<br><span class="o">қауіпсіздігі</span>', null, { chip: 'ӨРТ' });
    const ex = [['ОП', 'Ұнтақты', '#e8262b', '<path d="M30 -190 Q90 -170 80 -60 L80 40" stroke="#2b2f36" stroke-width="12" fill="none"/>', 'A B C E'],
                ['ОУ', 'Көмірқышқыл', '#e8262b', '<path d="M30 -190 Q90 -170 86 -80" stroke="#2b2f36" stroke-width="12" fill="none"/><path d="M70 -90 L102 -90 L120 -20 L52 -20Z" fill="#2b2f36"/>', 'B C E'],
                ['ОВП', 'Көбікті', '#e8262b', '<path d="M30 -190 Q90 -170 80 -60 L80 20" stroke="#2b2f36" stroke-width="12" fill="none"/><rect x="70" y="10" width="20" height="40" rx="6" fill="#2b2f36"/>', 'A B']];
    c.ex = ex.map(([l, n, col, nz, cls], i) => {
      const g = layer(svg, `<g transform="translate(${220 + i * 320} 760)"><g data-k="e">${extinguisher(l, col, nz)}</g></g>`);
      const t = html(`<div class="abs" style="left:${220 + i * 320 - 150}px;width:300px;top:935px;text-align:center"><div style="font-weight:800;font-size:30px">${n}</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">${cls.split(' ').map(k => `<b style="width:44px;height:44px;border-radius:10px;display:grid;place-items:center;background:${{ A: '#2ecc71', B: '#ff8a1f', C: '#2f86ff', E: '#ffd23f' }[k]};color:#14213d;font-size:26px">${k}</b>`).join('')}</div></div>`);
      root.appendChild(t); return { g, t, r: refs(g) };
    });
    // exit sign + evacuation route
    c.exit = layer(svg, `<g transform="translate(540 1150)">
      <rect x="-440" y="-80" width="880" height="160" rx="18" fill="#0f2147" stroke="#2f86ff" stroke-width="3" opacity="0.9"/>
      <path data-k="route" pathLength="1" d="M-400 30 L-150 30 L-150 -30 L150 -30 L150 20 L196 20" stroke="#2ecc71" stroke-width="8" fill="none" stroke-dasharray="1 1"/>
      <circle data-k="dot" r="14" fill="#2ecc71"/>
      <g transform="translate(320 0)"><rect x="-120" y="-60" width="240" height="120" rx="12" fill="#14a35a"/>
      <g transform="translate(-72 -4) scale(0.75)">${ICON.exit}</g><text x="36" y="13" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="#fff">ШЫҒУ</text></g></g>`);
    c.er = refs(c.exit);
    c.call = html(`<div class="abs" style="left:50px;right:50px;top:1250px;height:140px;border-radius:30px;background:linear-gradient(120deg,#e8262b,#a3141a);display:flex;align-items:center;gap:24px;padding:0 30px;box-shadow:0 20px 60px rgba(0,0,0,.5);border:4px solid #ffd23f">
      <div data-k="ph" style="flex:none;width:96px;height:96px;border-radius:50%;background:#fff;display:grid;place-items:center"><svg width="60" height="60" viewBox="-50 -50 100 100">${ICON.phone.replace('fill="#fff"', 'fill="#e8262b"')}</svg></div>
      <div style="font-weight:900;font-size:44px;line-height:1.1">ӨРТ КЕЗІНДЕ:<br><span style="color:#ffd23f;font-size:56px">101</span> НЕМЕСЕ <span style="color:#ffd23f;font-size:56px">112</span></div></div>`);
    root.appendChild(c.call); c.cr = refs(c.call);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const e = info.cue('ext'), x = info.cue('exit'), cl = info.cue('call');
    c.ex.forEach((it, i) => {
      const k = ep(lt, e - 0.2 + i * 0.25, 0.5, E.outBack);
      const sel = Math.floor(Math.max(0, lt - e - 1.0) / 0.8) % 3 === i && lt > e + 1.0 && lt < x;
      T(it.r.e, 0, (1 - k) * 200 - (sel ? 16 : 0), sel ? 1.08 : 1, 0, ep(lt, e - 0.2 + i * 0.25, 0.2));
      popIn(it.t, lt, e + 0.2 + i * 0.25, { dy: 30 });
    });
    O(c.exit, ep(lt, x - 0.2, 0.4));
    const rk = ep(lt, x + 0.2, 2.0, E.inOutCubic);
    c.er.route.setAttribute('stroke-dashoffset', (1 - rk).toFixed(3));
    const pt = c.er.route.getPointAtLength(rk * c.er.route.getTotalLength());
    c.er.dot.setAttribute('cx', pt.x); c.er.dot.setAttribute('cy', pt.y);
    popIn(c.call, lt, cl - 0.1, { dy: 60, s0: 0.8 });
    T(c.cr.ph, 0, 0, 1, lt > cl + 0.3 ? Math.sin(lt * 40) * 12 * pulse(lt, 1.2) : 0);
  },
};

// ======================= 10 GOLDEN RULES =======================
SCENES.rules = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>`);
    const c = {};
    bgGlow(svg, 540, 300, 520, 'glowY', 0.18);
    // light rays
    c.rays = layer(svg, `<g transform="translate(540 300)">${[...Array(14)].map((_, i) => `<path d="M0 0 L${pol(0, 0, 1400, i * 360 / 14 - 3).join(' ')} L${pol(0, 0, 1400, i * 360 / 14 + 3).join(' ')}Z" fill="#ffd23f" opacity="0.05"/>`).join('')}</g>`);
    c.H = header(root, null, '<span class="o" style="color:#ffd23f">10</span> алтын ереже', null, {});
    c.H.title.style.fontSize = '84px';
    const rules = [['vest', 'Арнайы киім ки'], ['shield', 'Қауіпсіздік талаптарын сақта'], ['doc', 'Рұқсатсыз жұмыс істеме'], ['start', 'Жабдықты өз бетіңше қоспа'], ['pipe', 'Қысым астындағы құбырды ашпа'],
      ['helmet', 'Қорғаныс құралдарын пайдалан'], ['radio', 'Ақаулар туралы хабарла'], ['gauge', 'Қысым мен температураны бақыла'], ['calm', 'Апат кезінде сабыр сақта'], ['heart', 'Адам өмірін бірінші орынға қой']];
    c.rows = rules.map(([ic, tx], i) => {
      const el = html(`<div class="abs" style="left:60px;right:60px;top:${370 + i * 100}px;height:88px;border-radius:22px;display:flex;align-items:center;gap:18px;padding:0 18px 0 12px;
        background:linear-gradient(120deg,rgba(20,45,95,.92),rgba(10,22,48,.92));border:2px solid rgba(255,210,63,.3)">
        <div style="flex:none;width:58px;height:58px;border-radius:50%;background:linear-gradient(140deg,#ffd23f,#ff8a1f);color:#1a0d00;font-weight:900;font-size:28px;display:grid;place-items:center">${i + 1}</div>
        <div style="flex:none;width:62px;height:62px;border-radius:16px;background:linear-gradient(140deg,#2f86ff,#1f5fbf);display:grid;place-items:center"><svg width="42" height="42" viewBox="-50 -50 100 100">${ICON[ic]}</svg></div>
        <div style="flex:1;font-weight:800;font-size:34px;white-space:nowrap">${tx}</div>
        <svg data-k="ck" width="44" height="44" viewBox="-50 -50 100 100"><circle r="46" fill="#2ecc71"/><path d="M-22 0 L-6 16 L24 -16" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`);
      root.appendChild(el); return { el, r: refs(el) };
    });
    c.spark = new Dust(svg, 40, { a: 0.6, r: 4, speed: 30, seed: 9, color: '#ffd23f' });
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt, 0.2);
    T(c.rays.firstChild, 540, 300, 1, lt * 6);
    const cs = c.rows.map((_, i) => info.cue('r' + (i + 1)));
    c.rows.forEach((rw, i) => {
      const a = cs[i] - 0.15, nx = i < 9 ? cs[i + 1] - 0.15 : info.dur + 1;
      const k = ep(lt, a, 0.5, E.outBack);
      const act = lt >= a && lt < nx;
      T(rw.el, (1 - k) * 700, 0, act ? lerp(1, 1.04, ep(lt, a, 0.3)) : 1, 0, ep(lt, a, 0.25));
      rw.el.style.borderColor = act ? '#ffd23f' : 'rgba(255,210,63,0.3)';
      rw.el.style.boxShadow = act ? '0 0 40px rgba(255,210,63,0.35)' : 'none';
      const ck = ep(lt, nx - 0.1, 0.35, E.outBack);
      T(rw.r.ck, 0, 0, ck, 0, ck);
    });
    c.spark.update(lt);
  },
};

// ======================= FINAL =======================
SCENES.final = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#skyDusk)"/>`);
    const c = {};
    layer(svg, `<circle cx="540" cy="1120" r="420" fill="url(#glowY)" opacity="0.55"/><circle cx="540" cy="1120" r="110" fill="#fff4cf" opacity="0.9"/>`);
    c.cam = layer(svg, '');
    c.pg = layer(c.cam, ''); c.plant = new Plant(c.pg, 'fp', 'day'); T(c.pg, -20, 1250, 1);
    c.leds = layer(c.cam, [...Array(6)].map((_, i) => `<circle cx="${100 + i * 140}" cy="${1100 - (i % 2) * 40}" r="22" fill="url(#glowG)"/><circle cx="${100 + i * 140}" cy="${1100 - (i % 2) * 40}" r="6" fill="#b8ffd0"/>`).join(''));
    layer(svg, `<rect x="0" y="1240" width="1080" height="680" fill="#0b1d45"/><rect x="0" y="1236" width="1080" height="10" fill="#ff8a1f" opacity="0.7"/><rect x="0" y="1246" width="1080" height="674" fill="url(#grate)" opacity="0.5"/>`);
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'fw');
    c.title = html(`<div class="abs" style="left:50px;right:50px;top:200px;text-align:center">
      <div data-k="t1" style="font-weight:900;font-size:96px;line-height:1;color:#ffd23f;text-shadow:0 10px 40px rgba(0,0,0,.5)">ҚАУІПСІЗДІК —</div>
      <div data-k="t2" style="font-weight:900;font-size:62px;line-height:1.1;margin-top:18px;text-shadow:0 10px 40px rgba(0,0,0,.5)">ӘР ЖҰМЫСШЫНЫҢ<br>ЖАУАПКЕРШІЛІГІ!</div></div>`);
    root.appendChild(c.title); c.tr = refs(c.title);
    c.ok = html(`<div class="abs" style="left:340px;top:560px;width:400px;padding:12px 0;border-radius:40px;background:rgba(46,204,113,.18);border:3px solid #2ecc71;text-align:center;font-weight:800;font-size:30px;color:#b8ffd0">● ТЭЦ ҚАЛЫПТЫ ЖҰМЫС ІСТЕУДЕ</div>`);
    c.ok.style.width = '680px'; c.ok.style.left = '200px'; c.ok.style.whiteSpace = 'nowrap';
    root.appendChild(c.ok);
    c.end = html(`<div class="abs" style="left:60px;right:60px;top:1420px;text-align:center">
      <div style="display:inline-flex;gap:14px;align-items:center;font-weight:900;font-size:44px;letter-spacing:6px"><i style="width:22px;height:22px;border-radius:50%;background:#ff8a1f;display:block"></i>ПТЭ · ТБ</div>
      <div style="font-weight:800;font-size:44px;margin-top:16px;line-height:1.2">Қауіпсіз жұмыс —<br><span style="color:#ff8a1f">баршамызға ортақ міндет!</span></div></div>`);
    root.appendChild(c.end);
    c.black = html(`<div class="abs" style="inset:0;background:#040915;z-index:50"></div>`); root.appendChild(c.black);
    return c;
  },
  update(c, lt, info) {
    const zs = lerp(1.08, 1.0, E.outCubic(clamp(lt / 6)));
    T(c.cam, 540 - 540 * zs, 1250 - 1250 * zs, zs);
    c.plant.update(lt);
    [...c.leds.children].forEach((l, i) => O(l, 0.5 + 0.5 * pulse(lt, 0.8 + (i % 3) * 0.2)));
    const wk = ep(lt, 0.3, 0.9, E.outBack);
    const thumbs = ep(lt, info.cue('slogan'), 0.5, E.outBack);
    c.w.set({ x: 540, y: 1400 + (1 - wk) * 60, s: 1.05, o: ep(lt, 0.3, 0.4), blink: blinkAt(lt), tilt: Math.sin(lt * 0.8) * 2,
      aL: [lerp(28, 20, thumbs), lerp(-70, -150, thumbs)], aR: [lerp(-28, -20, thumbs), lerp(70, 150, thumbs)], thumbL: thumbs > 0.5, thumbR: thumbs > 0.5 });
    const k1 = ep(lt, 0.5, 0.6, E.outBack);
    T(c.tr.t1, 0, 0, lerp(1.5, 1, k1), 0, ep(lt, 0.5, 0.25));
    popIn(c.tr.t2, lt, 0.9, { dy: 60 });
    popIn(c.ok, lt, 1.6, { dy: 20, s0: 0.8 });
    const endA = info.segs[info.segs.length - 1].e + 0.4;
    popIn(c.end, lt, endA, { dy: 40 });
    O(c.black, ep(lt, info.dur - 0.9, 0.8, E.inOutSine));
  },
};
