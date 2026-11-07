// Machinery & repair (mech1..mech5) and alcohol/drugs (alc)

function machineHallBG(svg) {
  let cols = '';
  for (let i = 0; i < 7; i++) cols += `<rect x="${i * 180 - 10}" y="300" width="30" height="1100" fill="#11244c"/>`;
  layer(svg, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>${cols}
    <rect x="0" y="1240" width="1080" height="680" fill="#0b1833"/><rect x="0" y="1236" width="1080" height="8" fill="#ffd23f" opacity="0.7"/>
    ${[...Array(8)].map((_, k) => { const y = 1244 + Math.pow(k / 7, 1.6) * 670; return `<line x1="0" y1="${y.toFixed(0)}" x2="1080" y2="${y.toFixed(0)}" stroke="#3d7fd9" stroke-opacity="0.14" stroke-width="2"/>`; }).join('')}`);
  bgGlow(svg, 540, 980, 520, 'spot', 1);
}
function htmlTile(root, x, y, w, inner, extra = '') {
  const el = html(`<div class="card" style="left:${x}px;top:${y}px;width:${w}px;${extra}">${inner}</div>`); root.appendChild(el); return el;
}
function partLabel(svg, x, y, x2, y2, txt) {
  return layer(svg, `<path d="M${x} ${y} L${x2} ${y2}" stroke="#ffd23f" stroke-width="3"/><circle cx="${x}" cy="${y}" r="7" fill="#ffd23f"/>${lbl(x2, y2, txt, '#ffd23f', 24)}`);
}
function tickList(root, x, y, w, items, rowH = 70, fs = 30) {
  const el = html(`<div class="card" style="left:${x}px;top:${y}px;width:${w}px;padding:12px 24px">${items.map((it, j) => `<div style="display:flex;align-items:center;gap:16px;height:${rowH}px">
     <div data-k="b${j}" style="flex:none;width:48px;height:48px;border-radius:13px;border:4px solid rgba(255,255,255,.45);display:grid;place-items:center">
     <svg width="36" height="36" viewBox="-50 -50 100 100"><path data-k="c${j}" pathLength="1" d="M-30 0 L-8 22 L32 -22" stroke="#2ecc71" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
     <div data-k="t${j}" style="font-weight:800;font-size:${fs}px;line-height:1.15">${it}</div></div>`).join('')}</div>`);
  root.appendChild(el); return { el, r: refs(el), n: items.length };
}
function animTicks(L, lt, times) {
  for (let j = 0; j < L.n; j++) { const k = ep(lt, times[j], 0.3); draw(L.r['c' + j], k); L.r['b' + j].style.borderColor = k > 0 ? '#2ecc71' : 'rgba(255,255,255,.45)'; L.r['t' + j].style.opacity = lt > times[j] - 0.5 ? 1 : 0.55; }
}
const segSpread = (seg, n, off = 0.65) => [...Array(n)].map((_, j) => seg.s + (j + off) / n * (seg.e - seg.s));

// ======================= 15.1 MECHANISMS & HOW THEY WORK =======================
SCENES.mech1 = {
  build(root, info) {
    const svg = stage(root); machineHallBG(svg);
    const c = {};
    c.H = header(root, '15', 'Механизмдер<br><span class="o">және жөндеу</span>', null, { chip: 'МЕХАНИЗМДЕР' });
    const mini = [[3, 'Насос', 'Су айдайды'], [5, 'Желдеткіш', 'Ауа береді'], [4, 'Дымосос', 'Түтінді шығарады'], [1, 'Турбина', 'Білікті айналдырады'], [2, 'Генератор', 'Электр өндіреді']];
    c.mini = mini.map(([ei, n, d], i) => {
      const x = 70 + (i % 3) * 320 + (i >= 3 ? 160 : 0), y = 490 + Math.floor(i / 3) * 330;
      const card = htmlTile(root, x, y, 300, `<div style="height:190px"></div><div style="font-weight:900;font-size:32px;color:#ff8a1f;text-align:center">${n}</div><div data-k="d" style="font-weight:700;font-size:24px;text-align:center;margin-top:4px">${d}</div>`, 'height:300px;padding:10px');
      const g = layer(svg, ''); const inner = document.createElementNS(SVGNS, 'g'); g.appendChild(inner); const u = EQUIP[ei].build(inner);
      return { card, g, u, x: x + 150, y: y + 105, d: card.querySelector('[data-k=d]') };
    });
    c.pg = layer(svg, ''); c.pu = new PumpUnit(c.pg, 'm1');
    c.labels = [['электр', -265, -112, -265, -240, 'ЭЛЕКТР ҚОЗҒАЛТҚЫШ'], ['муфта', -36, 70, -200, 200, 'МУФТА'], ['білік', 160, 0, 120, -200, 'БІЛІК'],
      ['мойынтіректер', 70, 62, 100, 270, 'МОЙЫНТІРЕКТЕР'], ['жұмыс', 330, 60, 360, 200, 'ЖҰМЫС ДОҢҒАЛАҒЫ']].map(([w, x, y, x2, y2, t]) => ({ w, g: partLabel(c.pg.firstChild ? c.pg : svg, x, y, x2, y2, t) }));
    c.labels.forEach(l => c.pu.k('root').appendChild(l.g));
    c.chain = html(`<div class="abs" style="left:60px;right:60px;top:1250px;display:flex;justify-content:center;align-items:center;gap:14px;font-weight:800;font-size:28px">
      ${[['bolt', 'Электр'], ['rotate', 'Айналу'], ['drop', 'Су ағыны']].map(([ic, t], i) => `${i ? '<span data-k="ar' + i + '" style="color:#ffd23f;font-size:44px">→</span>' : ''}<div data-k="ch${i}" style="display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:20px;background:rgba(15,33,71,.92);border:3px solid #ff8a1f"><svg width="44" height="44" viewBox="-50 -50 100 100">${ICON[ic]}</svg>${t}</div>`).join('')}</div>`);
    root.appendChild(c.chain); c.chr = refs(c.chain);
    c.guardBadge = html(`<div class="abs" style="left:110px;right:110px;top:560px;padding:18px 24px;border-radius:24px;text-align:center;background:linear-gradient(140deg,#ff8a1f,#c95f0a);color:#1a0d00;font-weight:900;font-size:34px;line-height:1.15;box-shadow:0 18px 50px rgba(0,0,0,.45)">
      ✓ Айналатын бөлшектер —<br>ҚОРҒАНЫШ ҚОРШАУЫНЫҢ АСТЫНДА</div>`);
    root.appendChild(c.guardBadge);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const L = info.cue('list'), P = info.cue('purp'), parts = info.cue('parts'), how = info.cue('how'), gd = info.cue('guard');
    const miniOut = ep(lt, parts - 0.4, 0.45, E.inCubic);
    const names = ['насостар', 'желдеткіштер', 'дымосостар', 'турбина', 'генератор'];
    c.mini.forEach((m, i) => {
      const a = Math.min(info.word('list', names[i], 1 + i * 0.6), L + 0.4 + i * 0.6) - 0.15;
      const k = ep(lt, a, 0.5, E.outBack);
      T(m.card, 0, (1 - k) * 60 - miniOut * 60, lerp(0.6, 1, k), 0, ep(lt, a, 0.25) * (1 - miniOut));
      T(m.g, m.x, m.y + (1 - k) * 60 - miniOut * 60, 0.27 * lerp(0.6, 1, k), 0, ep(lt, a, 0.25) * (1 - miniOut));
      m.u(lt);
      O(m.d, ep(lt, i < 3 ? info.word('purp', ['суды', 'ауа', 'түтін'][i], i * 1.5) : P + 4.5, 0.3));
    });
    // pump unit
    const pk = ep(lt, parts - 0.2, 0.7, E.outCubic);
    const sp = spinAngle(lt, [[how, how + 1.6, 0, 520]]);
    c.pu.set({ t: lt, x: 560, y: 960 + (1 - pk) * 80, s: 0.92, o: pk, ang: sp.ang, speed: sp.speed, guard: 1 });
    c.labels.forEach((l, i) => O(l.g, ep(lt, info.word('parts', l.w, 2 + i), 0.3) * (1 - 0.6 * ep(lt, gd, 0.3))));
    [0, 1, 2].forEach(i => popIn(c.chr['ch' + i], lt, how + 0.2 + i * 0.9, { dy: 20, s0: 0.6 }));
    [1, 2].forEach(i => O(c.chr['ar' + i], ep(lt, how + i * 0.9, 0.3)));
    O(c.chain, 1 - ep(lt, gd - 0.2, 0.3));
    popIn(c.guardBadge, lt, gd + 0.1, { dy: -30, s0: 0.8 });
    O(c.pu.k('guard'), lt > gd ? 0.6 + 0.4 * pulse(lt, 1.6) : 1);
  },
};

// ======================= 15.2 START-UP / SHUT-DOWN =======================
SCENES.mech2 = {
  build(root, info) {
    const svg = stage(root); machineHallBG(svg);
    const c = {};
    c.H = header(root, '15', 'Іске қосу<br><span class="o">және тоқтату</span>', null, { chip: 'НҰСҚАУЛЫҚ' });
    c.panel = html(`<div class="card" style="left:60px;right:60px;top:480px;height:280px;padding:22px;display:flex;gap:22px;align-items:center">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:14px"><div data-k="lamp" style="width:34px;height:34px;border-radius:50%;background:#e8262b;box-shadow:0 0 20px #e8262b"></div>
          <div data-k="st" style="font-weight:900;font-size:32px">ТОҚТАП ТҰР</div></div>
        <div style="display:flex;gap:16px;margin-top:22px">
          <div data-k="bStart" style="padding:16px 22px;border-radius:18px;background:#1a8a52;font-weight:900;font-size:28px;box-shadow:0 8px 0 #0c4a2c">▶ ІСКЕ ҚОСУ</div>
          <div data-k="bStop" style="padding:16px 22px;border-radius:18px;background:#c9161c;font-weight:900;font-size:28px;box-shadow:0 8px 0 #6e0b0f">■ ТОҚТАТУ</div></div>
        <div style="margin-top:22px;height:18px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden"><div data-k="rpm" style="height:100%;width:0;background:linear-gradient(90deg,#2ecc71,#ffd23f)"></div></div>
        <div style="font-weight:700;font-size:22px;color:#a9c4ea;margin-top:6px">Айналым жылдамдығы</div></div>
      <svg width="180" height="230" viewBox="-110 -140 220 280"><g transform="translate(0 -40) scale(0.4)">${gaugeSVG('g1', 220)}</g><text y="70" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="24" fill="#fff">Қысым</text>
        <g transform="translate(0 0)"></g></svg>
      <svg width="180" height="230" viewBox="-110 -140 220 280"><g transform="translate(0 -40) scale(0.4)">${gaugeSVG('g2', 220, { unit: 'А' })}</g><text y="70" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="24" fill="#fff">Тоқ күші</text></svg></div>`);
    root.appendChild(c.panel); c.pr = refs(c.panel);
    c.pre = tickList(root, 60, 790, 960, ['Жөндеу аяқталды', 'Қауіпті аймақта адам жоқ', 'Қорғаныш қоршаулары орнында', 'Ысырмалар дұрыс күйде'], 66, 32);
    c.runChips = html(`<div class="abs" style="left:60px;right:60px;top:800px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${['Қысым', 'Тоқ күші', 'Діріл', 'Шу'].map((t, i) => `<div data-k="r${i}" style="padding:18px;border-radius:20px;background:rgba(15,33,71,.92);border:3px solid #2ecc71;font-weight:800;font-size:30px;display:flex;justify-content:space-between"><span>${t}</span><span style="color:#2ecc71">✓ бақылауда</span></div>`).join('')}</div>`);
    root.appendChild(c.runChips); c.rr = refs(c.runChips);
    c.pg = layer(svg, ''); c.pu = new PumpUnit(c.pg, 'm2');
    c.zero = html(`<div class="abs" style="left:90px;right:90px;top:800px;padding:24px;border-radius:28px;text-align:center;background:linear-gradient(140deg,#1f5fbf,#0c1c3d);border:4px solid #ffd23f;font-weight:900;font-size:38px;line-height:1.15">
      <svg width="80" height="80" viewBox="-50 -50 100 100">${ICON.eye}</svg><br>Толық тоқтағанын көзбен тексер —<br><span style="color:#ffd23f">ТОҚТАҒАНША ЖАҚЫНДАМА!</span></div>`);
    root.appendChild(c.zero);
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'm2w');
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const pre = info.segs.find(s => s.cue === 'pre'), run = info.cue('run'), stop = info.cue('stop'), zero = info.cue('zero');
    popIn(c.panel, lt, 0.6, { dy: 40, s0: 0.95 });
    const tStart = run - 0.2, tStop = stop + 0.2;
    const sp = spinAngle(lt, [[tStart + 0.3, tStart + 2.3, 0, 560], [tStop + 0.2, tStop + 3.2, 560, 0]]);
    const runK = clamp(sp.speed / 560);
    c.pr.rpm.style.width = (runK * 100).toFixed(1) + '%';
    const state = lt < tStart + 0.3 ? 0 : lt < tStop + 0.2 ? 1 : runK > 0.01 ? 2 : 3;
    const st = ['ТОҚТАП ТҰР', 'ЖҰМЫС ІСТЕП ТҰР', 'ТОҚТАТЫЛУДА…', 'ТОЛЫҚ ТОҚТАДЫ'][state];
    if (c.pr.st.textContent !== st) c.pr.st.textContent = st;
    const col = ['#e8262b', '#2ecc71', '#ffd23f', '#e8262b'][state];
    c.pr.lamp.style.background = col; c.pr.lamp.style.boxShadow = `0 0 ${state === 2 ? 10 + 14 * pulse(lt, 2) : 20}px ${col}`;
    const press = (el, t0) => { const d = lt - t0; el.style.transform = d > 0 && d < 0.35 ? 'translateY(6px)' : ''; el.style.boxShadow = d > 0 && d < 0.35 ? 'none' : ''; el.style.outline = d > 0 && d < 1.2 ? '4px solid #ffd23f' : 'none'; };
    press(c.pr.bStart, tStart); press(c.pr.bStop, tStop);
    T(c.pr.g1needle, 0, 0, 1, needleRot(0.05 + 0.45 * runK + 0.01 * Math.sin(lt * 9) * runK));
    T(c.pr.g2needle, 0, 0, 1, needleRot(0.04 + (lt > tStart + 0.3 && lt < tStart + 1.2 ? 0.75 : 0.4) * runK));
    popIn(c.pre.el, lt, pre.s - 0.3, { dy: 40, out: run - 0.4 });
    animTicks(c.pre, lt, segSpread(pre, 4));
    O(c.runChips, env(lt, run + 0.6, stop, 0.3, 0.3));
    [0, 1, 2, 3].forEach(i => popIn(c.rr['r' + i], lt, run + 0.8 + i * 0.35, { dy: 20, s0: 0.8 }));
    c.pu.set({ t: lt, x: 560, y: 1200, s: 0.6, ang: sp.ang, speed: sp.speed, o: ep(lt, 0.9, 0.4) });
    popIn(c.zero, lt, zero - 0.1, { dy: 40, s0: 0.8 });
    // operator at the panel side, keeps distance from the machine
    c.w.set({ x: 110, y: 1370, s: 0.55, o: ep(lt, 1.0, 0.4), blink: blinkAt(lt), look: 6, aL: [10, 0], aR: [-30, -60] });
  },
};

// ======================= 15.3 FAULT SIGNS =======================
SCENES.mech3 = {
  build(root, info) {
    const svg = stage(root); machineHallBG(svg);
    const c = {};
    c.H = header(root, '15', 'Ақауды<br><span class="o">анықтау</span>', null, { chip: 'АҚАУ БЕЛГІЛЕРІ' });
    c.zone = layer(svg, `<ellipse cx="560" cy="780" rx="500" ry="260" fill="#e8262b" fill-opacity="0.08" stroke="#ff3b3b" stroke-width="6" stroke-dasharray="26 16"/>`);
    c.pg = layer(svg, ''); c.pu = new PumpUnit(c.pg, 'm3');
    c.snd = layer(svg, `<g transform="translate(470 700)" stroke="#ffd23f" stroke-width="6" fill="none" stroke-linecap="round">${[0, 1, 2].map(i => `<path d="M${-20 - i * 22} ${-30 - i * 18} Q${-40 - i * 30} -10 ${-20 - i * 22} ${10 + i * 18}" transform="scale(-1 1) translate(-120 0)"/>`).join('')}</g>`);
    c.mini = layer(svg, `<g transform="translate(905 560)"><g transform="scale(0.3)">${gaugeSVG('m3g', 220)}</g></g>`);
    c.mr = refs(c.mini);
    const sy = [['wave', 'Күшті діріл'], ['ear', 'Бөгде шу, тықылдақ'], ['thermo', 'Мойынтірек қызады'], ['steam', 'Ағу, түтін, иіс'], ['gauge', 'Қысым, тоқ ауытқуы']];
    c.chips = sy.map(([ic, t], i) => {
      const el = html(`<div class="abs" style="left:${60 + (i % 2) * 490}px;top:${1060 + Math.floor(i / 2) * 104}px;width:${i === 4 ? 960 : 470}px;padding:14px 20px;border-radius:22px;display:flex;align-items:center;gap:16px;background:rgba(40,8,12,.9);border:3px solid rgba(255,90,90,.7);font-weight:800;font-size:30px">
        <div style="flex:none;width:58px;height:58px;border-radius:16px;display:grid;place-items:center;background:#c9161c"><svg width="40" height="40" viewBox="-50 -50 100 100">${ICON[ic]}</svg></div>${t}</div>`);
      root.appendChild(el); return el;
    });
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'm3w');
    c.radio = radioProp(c.w);
    c.waves = wavesLayer(svg, 213, 1095);
    c.away = html(`<div class="abs" style="left:420px;right:60px;top:1060px;padding:18px 22px;border-radius:24px;background:linear-gradient(140deg,#e8262b,#8f0f14);border:4px solid #ffd23f;font-weight:900;font-size:32px;line-height:1.15">
      ✗ Механизмге жақындама<br>✗ Өз бетіңше жөндеме</div>`);
    root.appendChild(c.away);
    c.boss = html(`<div class="pill" style="left:420px;top:1060px;width:600px;font-size:30px;border-color:#ffd23f"><div class="ic" style="background:linear-gradient(140deg,#ffd23f,#e0a800)"><svg viewBox="-50 -50 100 100">${ICON.radio}</svg></div><div>Ауысым басшысына<br><b style="color:#ffd23f">ДЕРЕУ ХАБАРЛА</b></div></div>`);
    root.appendChild(c.boss);
    c.log = html(`<div class="card" style="left:420px;right:60px;top:1060px;padding:18px 22px;border-color:#ffd23f">
      <div style="font-weight:900;font-size:28px;color:#ffd23f">АҚАУЛАР ЖУРНАЛЫ</div>
      <svg width="560" height="120" viewBox="0 0 560 120">${[0, 1, 2].map(i => `<path data-k="ln${i}" pathLength="1" d="M10 ${24 + i * 36} L${520 - i * 120} ${24 + i * 36}" stroke="#a9c4ea" stroke-width="10" stroke-linecap="round"/>`).join('')}</svg></div>`);
    root.appendChild(c.log); c.lr = refs(c.log);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const s = [1, 2, 3, 4, 5].map(i => info.cue('s' + i)), away = info.cue('away'), rep = info.cue('report'), log = info.cue('log');
    const on = (i) => ep(lt, s[i] - 0.1, 0.4) * (1 - 0.0 * ep(lt, away, 0.4));
    const sp = spinAngle(lt, [[0, 0.01, 520, 520]]);
    c.pu.set({ t: lt, x: 560, y: 760, s: 0.84, o: ep(lt, 0.4, 0.5), ang: sp.ang, speed: sp.speed, vib: on(0) * (lt < s[1] + 0.5 ? 1 : 0.4), heat: on(2), leak: on(3), smoke: on(3) });
    O(c.snd, on(1) * (0.5 + 0.5 * pulse(lt, 2.5)));
    O(c.mini, ep(lt, 0.6, 0.4));
    T(c.mr.m3gneedle, 0, 0, 1, needleRot(0.45 + on(4) * (0.3 * Math.sin(lt * 3.2) + 0.08 * Math.sin(lt * 11))));
    O(c.zone, ep(lt, away, 0.4) * (0.6 + 0.4 * pulse(lt, 1.2)));
    c.chips.forEach((ch, i) => popIn(ch, lt, s[i] - 0.15, { dx: i % 2 ? 80 : -80, dy: 0, out: away - 0.3 }));
    // worker keeps distance, reports by radio
    const wk = ep(lt, away - 0.1, 0.5);
    const rr = ep(lt, rep + 0.1, 0.5, E.outBack);
    c.w.set({ x: 170, y: 1375, s: 0.55, o: wk, blink: blinkAt(lt), look: 6, aL: [10, 0], aR: [lerp(-10, -20, rr), lerp(0, -150, rr)], mouth: rr > 0.9 && lt < log ? 0.5 * pulse(lt, 4) : 0 });
    O(c.radio.radio, rr);
    animWaves(c.waves, lt, rr > 0.9 && lt < log);
    popIn(c.away, lt, away + 0.1, { dx: 100, dy: 0, out: rep - 0.2 });
    popIn(c.boss, lt, rep + 0.1, { dx: 100, dy: 0, out: log - 0.2 });
    popIn(c.log, lt, log, { dx: 100, dy: 0 });
    [0, 1, 2].forEach(i => draw(c.lr['ln' + i], ep(lt, log + 0.5 + i * 0.5, 0.5)));
  },
};

// ======================= 15.4 SAFE PREPARATION FOR REPAIR (isolation) =======================
SCENES.mech4 = {
  build(root, info) {
    const svg = stage(root); machineHallBG(svg);
    const c = {};
    c.H = header(root, '15', 'Жөндеуге<br><span class="o">дайындық</span>', null, { chip: 'АЖЫРАТУ · БҰҒАТТАУ' });
    const src = [['bolt', 'Электр'], ['steam', 'Бу'], ['drop', 'Су'], ['gauge', 'Қысым']];
    c.src = src.map(([ic, t], i) => {
      const el = html(`<div class="card" style="left:${60 + (i % 2) * 490}px;top:${480 + Math.floor(i / 2) * 140}px;width:470px;height:122px;display:flex;align-items:center;gap:16px;padding:0 18px">
        <div data-k="ic" style="flex:none;width:76px;height:76px;border-radius:20px;display:grid;place-items:center;background:#1a8a52"><svg width="50" height="50" viewBox="-50 -50 100 100">${ICON[ic]}</svg></div>
        <div style="flex:1"><div style="font-weight:900;font-size:32px">${t}</div><div data-k="st" style="font-weight:800;font-size:24px;color:#2ecc71">● ҚОСУЛЫ</div></div>
        <svg data-k="lk" width="56" height="56" viewBox="-50 -50 100 100" style="opacity:0">${ICON.lock}</svg></div>`);
      root.appendChild(el); return { el, r: refs(el), on: true };
    });
    // stage vignettes (y 780..1370)
    c.v1 = layer(svg, `<g transform="translate(300 1050)">
      <rect x="-150" y="-170" width="300" height="320" rx="18" fill="#2a3e5f"/><rect x="-130" y="-150" width="260" height="280" rx="10" fill="#1b2a44"/>
      <text y="-110" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="26" fill="#a9c4ea">АЖЫРАТҚЫШ</text>
      <rect x="-40" y="-80" width="80" height="150" rx="10" fill="#0d1628"/><g data-k="lev"><rect x="-22" y="-70" width="44" height="70" rx="8" fill="#e8262b"/></g>
      <g data-k="pad" transform="translate(0 100)"><path d="M-24 0 L-24 -28 A24 24 0 0 1 24 -28 L24 0" stroke="#c9d3e0" stroke-width="11" fill="none"/><rect x="-38" y="-4" width="76" height="60" rx="10" fill="#ff8a1f"/><circle cy="20" r="8" fill="#1a0d00"/></g></g>
      <g transform="translate(770 900)"><g data-k="sw"><line x1="0" y1="-20" x2="0" y2="20" stroke="#c9d3e0" stroke-width="5"/>
        <rect x="-220" y="20" width="440" height="210" rx="12" fill="#fff" stroke="#e8262b" stroke-width="10"/><rect x="-210" y="30" width="420" height="84" fill="#e8262b"/>
        <text y="88" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="52" fill="#fff">ҚОСПАҢЫЗ!</text>
        <text y="158" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="32" fill="#14213d">АДАМДАР</text><text y="200" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="32" fill="#14213d">ЖҰМЫС ІСТЕУДЕ</text></g></g>`);
    c.v1r = refs(c.v1);
    c.v2 = layer(svg, ''); c.pu = new PumpUnit(c.v2, 'm4');
    c.zeroBadge = html(`<div class="abs" style="left:300px;width:480px;top:820px;padding:14px;border-radius:22px;text-align:center;background:#1a8a52;border:4px solid #b8ffd0;font-weight:900;font-size:32px">✓ ТОЛЫҚ ТОҚТАДЫ</div>`);
    root.appendChild(c.zeroBadge);
    c.v3 = layer(svg, `<g transform="translate(300 1090)"><rect x="-80" y="-170" width="160" height="300" rx="30" fill="#ffd23f"/><rect x="-60" y="-140" width="120" height="80" rx="10" fill="#14213d"/>
        <text y="-86" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="46" fill="#2ecc71">0 В</text><circle cy="20" r="26" fill="#2b2f36"/>
        <path d="M-40 130 L-60 230 M40 130 L60 230" stroke="#e8262b" stroke-width="10"/></g>
      <g transform="translate(760 1060)"><circle r="110" fill="#1a8a52" stroke="#0c4a2c" stroke-width="16"/><text y="-4" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="#fff">ІСКЕ</text><text y="34" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" fill="#fff">ҚОСУ</text>
        <g data-k="x" opacity="0"><circle r="126" fill="none" stroke="#e8262b" stroke-width="16"/><path d="M-80 -80 L80 80" stroke="#e8262b" stroke-width="16"/></g></g>`);
    c.v3r = refs(c.v3);
    c.v3t = html(`<div class="abs" style="left:560px;width:420px;top:1240px;text-align:center;font-weight:900;font-size:32px;color:#ff6b6b">✗ ІСКЕ ҚОСЫЛМАЙДЫ</div>`);
    root.appendChild(c.v3t);
    c.ban = warnCard(root, 'Жұмыс істеп тұрған механизмді жөндеуге, тазалауға, ұстауға<br><span style="color:#ffd23f">ҚАТАҢ ТЫЙЫМ САЛЫНАДЫ!</span>', 840);
    c.ban.querySelector('div').style.fontSize = '36px';
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const el = info.cue('el'), en = info.cue('en'), lock = info.cue('lock'), st0 = info.cue('stop0'), test = info.cue('test'), ban = info.cue('ban');
    const offT = [el + 0.6, info.word('en', 'бу', 0.2), info.word('en', 'су', 0.8), info.word('en', 'қысым', 1.4)];
    c.src.forEach((s, i) => {
      popIn(s.el, lt, 0.6 + i * 0.12, { dy: 30 });
      const off = lt > offT[i];
      if (off === s.on) { s.on = !off; s.r.st.textContent = off ? (i ? '● ЖАБЫЛДЫ' : '● АЖЫРАТЫЛДЫ') : '● ҚОСУЛЫ'; s.r.st.style.color = off ? '#ff6b6b' : '#2ecc71'; s.r.ic.style.background = off ? '#8f0f14' : '#1a8a52'; }
      const lk = ep(lt, lock + 0.6 + i * 0.15, 0.4, E.outBack);
      s.r.lk.style.opacity = lk; s.r.lk.style.transform = `scale(${lerp(0.3, 1, lk)})`;
      s.el.style.borderColor = lt > offT[i] && lt < offT[i] + 1 ? '#ffd23f' : 'rgba(99,179,255,0.35)';
    });
    // vignette 1: breaker + lock + sign (lock cue). Shown from el (lever down) to stop0.
    O(c.v1, env(lt, el, st0 - 0.1, 0.4, 0.3));
    T(c.v1r.lev, 0, ep(lt, el + 0.5, 0.4, E.outBack) * 75, 1);
    T(c.v1r.pad, 0, 100 - (1 - ep(lt, lock + 0.4, 0.5, E.outBack)) * 180, 1, 0, ep(lt, lock + 0.4, 0.2));
    const sk = ep(lt, info.word('lock', 'қоспаңыз', 1.5), 0.6, E.outBack);
    T(c.v1r.sw.parentNode, 770, 900 - (1 - sk) * 300, 1, 0, ep(lt, info.word('lock', 'қоспаңыз', 1.5), 0.2));
    T(c.v1r.sw, 0, 0, 1, Math.sin((lt - lock) * 4) * 7 * Math.exp(-Math.max(0, lt - lock) * 1.2));
    // vignette 2: rotation coasting to zero (the motor was switched off at "el")
    const sp = spinAngle(lt, [[0, 0.01, 500, 500], [el + 0.6, st0 + 1.6, 500, 0]]);
    O(c.v2, env(lt, st0 - 0.1, test - 0.1, 0.4, 0.3));
    c.pu.set({ t: lt, x: 560, y: 1110, s: 0.78, ang: sp.ang, speed: sp.speed });
    popIn(c.zeroBadge, lt, st0 + 1.7, { dy: 20, s0: 0.6, out: test - 0.2 });
    // vignette 3: no voltage + start attempt blocked
    O(c.v3, env(lt, test, ban - 0.1, 0.4, 0.3));
    const press = ep(lt, info.word('test', 'кездейсоқ', 2.0), 0.3);
    T(c.v3r.x, 0, 0, lerp(1.4, 1, press), 0, press);
    popIn(c.v3t, lt, info.word('test', 'кездейсоқ', 2.0) + 0.2, { dy: 20, s0: 0.7, out: ban - 0.2 });
    popIn(c.ban, lt, ban - 0.05, { dy: 50, s0: 0.85 });
  },
};

// ======================= 15.5 REPAIR BY AUTHORISED STAFF + TEST =======================
SCENES.mech5 = {
  build(root, info) {
    const svg = stage(root); machineHallBG(svg);
    const c = {};
    c.H = header(root, '15', 'Жөндеу<br><span class="o">және сынақ</span>', null, { chip: 'ЖӨНДЕУ' });
    c.pg = layer(svg, ''); c.pu = new PumpUnit(c.pg, 'm5');
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'm5a');
    c.held = c.w.prop('R', `<g transform="translate(0 120) rotate(-60) scale(0.8)">${TOOLS[0].svg.replace('data-k="m"', '')}</g>`);
    c.w2g = layer(svg, ''); c.w2 = new Worker(c.w2g, 'm5b', { helmet: '#2f86ff', helmetSh: '#1f5fbf', glove: '#d8dee8' });
    c.tabs = html(`<div class="abs" style="left:60px;right:60px;top:480px;display:flex;gap:16px;justify-content:center">
      <div data-k="t1" style="padding:12px 20px;border-radius:18px;background:#8f0f14;border:3px solid #ff6b6b;font-weight:900;font-size:26px">БҰҒАТТАЛҒАН</div>
      <div data-k="t2" style="padding:12px 20px;border-radius:18px;background:#8f0f14;border:3px solid #ff6b6b;font-weight:900;font-size:26px">■ ТОҚТАТЫЛҒАН</div>
      <div data-k="t3" style="padding:12px 20px;border-radius:18px;background:#1f5fbf;border:3px solid #ffd23f;font-weight:900;font-size:26px">✓ РҰҚСАТЫ БАР</div></div>`);
    root.appendChild(c.tabs); c.tr = refs(c.tabs);
    c.after = tickList(root, 60, 1010, 960, ['Құралдар жиналды', 'Қорғаныш қоршаулары орнында', 'Адамдар қауіпті аймақтан шықты', 'Бұғатты жауапты адам алды'], 82, 32);
    c.params = html(`<div class="abs" style="left:60px;right:60px;top:1010px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${['Қысым', 'Діріл', 'Шу', 'Температура'].map((t, i) => `<div data-k="p${i}" style="padding:20px;border-radius:22px;background:rgba(15,33,71,.92);border:3px solid rgba(255,255,255,.3);font-weight:800;font-size:27px;white-space:nowrap;display:flex;justify-content:space-between"><span>${t}</span><span data-k="v${i}" style="color:#a9c4ea">тексерілуде…</span></div>`).join('')}</div>`);
    root.appendChild(c.params); c.par = refs(c.params);
    c.stamp = html(`<div class="abs" style="left:150px;right:150px;top:1250px;padding:14px;border-radius:24px;text-align:center;border:7px solid #2ecc71;color:#2ecc71;font-weight:900;font-size:42px;background:rgba(6,30,18,.9)">✓ ЖҰМЫСҚА ҚАБЫЛДАНДЫ</div>`);
    root.appendChild(c.stamp);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const auth = info.cue('auth'), after = info.segs.find(s => s.cue === 'after'), unlock = info.segs.find(s => s.cue === 'unlock'), test = info.cue('test'), params = info.cue('params'), ok = info.cue('ok');
    const sp = spinAngle(lt, [[test + 0.8, test + 2.6, 0, 520]]);
    const guardBack = ep(lt, info.word('after', 'қорғаныш', 1.5), 0.5);
    c.pu.set({ t: lt, x: 600, y: 770, s: 0.66, ang: sp.ang, speed: sp.speed, guard: lerp(0.15, 1, guardBack), o: ep(lt, 0.4, 0.4) });
    // repair team only while stopped & locked; they leave before the test run
    const leave = ep(lt, unlock.s, 1.2, E.inOutCubic);
    c.w.set({ x: lerp(160, -150, leave), y: 990, s: 0.58, o: ep(lt, 0.6, 0.4), blink: blinkAt(lt), look: 6, tilt: 6 * (1 - leave), aL: [10, 0], aR: [-50 * (1 - leave) - 10, -70 * (1 - leave)] });
    c.w2.set({ x: lerp(960, 1250, leave), y: 990, s: 0.58, flip: true, o: ep(lt, 0.8, 0.4), blink: blinkAt(lt, 1.1), aL: [10, 0], aR: [-10, 0] });
    popIn(c.tr.t1, lt, 0.7, { dy: -20, s0: 0.6 }); popIn(c.tr.t2, lt, 0.9, { dy: -20, s0: 0.6 }); popIn(c.tr.t3, lt, auth + 0.4, { dy: -20, s0: 0.6 });
    const unl = info.word('unlock', 'бұғаттарды', 1.5);
    if (lt > unl + 0.4) { c.tr.t1.textContent = 'БҰҒАТ АЛЫНДЫ'; c.tr.t1.style.background = '#1a8a52'; c.tr.t1.style.borderColor = '#b8ffd0'; } else { c.tr.t1.textContent = 'БҰҒАТТАЛҒАН'; c.tr.t1.style.background = '#8f0f14'; c.tr.t1.style.borderColor = '#ff6b6b'; }
    const running = sp.speed > 5;
    c.tr.t2.textContent = running ? '▶ СЫНАҚ ЖҮРУДЕ' : '■ ТОҚТАТЫЛҒАН'; c.tr.t2.style.background = running ? '#1f5fbf' : '#8f0f14';
    popIn(c.after.el, lt, after.s - 0.3, { dy: 40, out: test - 0.3 });
    animTicks(c.after, lt, [info.word('after', 'құралдар', 0.5) + 0.4, info.word('after', 'қорғаныш', 1.5) + 0.6, info.word('unlock', 'адамдар', 0.2) + 1.0, unl + 0.5]);
    O(c.params, ep(lt, test, 0.4));
    const pw = ['қысым', 'діріл', 'шу', 'температура'].map((p, i) => info.word('params', p, i * 0.6));
    [0, 1, 2, 3].forEach(i => {
      popIn(c.par['p' + i], lt, test + 0.2 + i * 0.12, { dy: 20, s0: 0.8 });
      const g = lt > pw[i] + 0.5;
      c.par['v' + i].textContent = g ? '✓ ҚАЛЫПТЫ' : 'тексерілуде…'; c.par['v' + i].style.color = g ? '#2ecc71' : '#a9c4ea';
      c.par['p' + i].style.borderColor = g ? '#2ecc71' : 'rgba(255,255,255,.3)';
    });
    const sk = ep(lt, ok + 0.3, 0.4, E.outBack);
    T(c.stamp, 0, 0, lerp(1.8, 1, sk), -3, sk);
  },
};

// ======================= 17. ALCOHOL & DRUGS =======================
SCENES.alc = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>`);
    const c = {};
    bgGlow(svg, 540, 760, 560, 'glowR', 0.12);
    c.H = header(root, '17', 'Алкоголь мен<br><span class="o" style="color:#ff4d4d">есірткіге тыйым</span>', null, { chip: 'СЕРГЕКТІК' });
    c.H.chip.style.cssText = 'background:rgba(255,59,59,.14);border-color:rgba(255,80,80,.6);color:#ff8080';
    const signs = [['bottle', 'Алкоголь'], ['pills', 'Есірткі, психотроптық заттар'], ['lever', 'Масаң күйде жабдықты басқару']];
    c.signs = signs.map(([ic, t], i) => {
      const el = html(`<div class="card warn" style="left:${60 + i * 330}px;top:480px;width:300px;height:330px;text-align:center;padding-top:20px">
        <svg width="190" height="190" viewBox="-110 -110 220 220">${noSign(`<g transform="scale(1.05)">${ICON[ic]}</g>`, 100).replace('<circle r="100" fill="#fff"/>', '<circle r="100" fill="#13264a"/>')}</svg>
        <div style="font-weight:800;font-size:26px;line-height:1.15;margin-top:10px;padding:0 12px">${t}</div>
        <div data-k="st" class="abs" style="right:12px;top:12px;padding:4px 10px;border:4px solid #ff4d4d;border-radius:10px;color:#ff4d4d;font-weight:900;font-size:20px;transform:rotate(8deg)">ТЫЙЫМ</div></div>`);
      root.appendChild(el); return { el, st: el.querySelector('[data-k=st]') };
    });
    // centre stage for a1..a3
    c.big = [['bottle', 'Алкогольдік мас күйде<br>жұмысқа рұқсат жоқ'], ['pills', 'Есірткі мен масаңдыратын<br>заттарға қатаң тыйым']].map(([ic, t]) => {
      const el = html(`<div class="abs" style="left:0;right:0;top:860px;text-align:center"><svg width="330" height="330" viewBox="-130 -130 260 260"><circle data-k="ring" r="120" fill="none" stroke="#ff3b3b" stroke-width="8" opacity="0.5"/>
        ${noSign(`<g transform="scale(1.1)">${ICON[ic]}</g>`, 100).replace('<circle r="100" fill="#fff"/>', '<circle r="100" fill="#13264a"/>')}</svg>
        <div style="font-weight:900;font-size:40px;line-height:1.15;margin-top:6px">${t}</div></div>`);
      root.appendChild(el); return { el, ring: el.querySelector('[data-k=ring]') };
    });
    c.mg = layer(svg, ''); c.mpu = new PumpUnit(c.mg, 'alp');
    c.mx = layer(svg, `<g transform="translate(540 1050)"><circle r="190" fill="none" stroke="#e8262b" stroke-width="22"/><path d="M-134 -134 L134 134" stroke="#e8262b" stroke-width="22"/></g>`);
    c.mtxt = html(`<div class="abs" style="left:60px;right:60px;top:1260px;text-align:center;font-weight:900;font-size:34px;color:#ff6b6b">Мас күйде жабдықты басқаруға болмайды!</div>`);
    root.appendChild(c.mtxt);
    // checkpoint: arrive sober
    c.gate = layer(svg, `<g transform="translate(720 1370)">
      <rect x="-30" y="-330" width="60" height="330" fill="#2a3e5f"/><rect x="-60" y="-360" width="300" height="40" rx="8" fill="#1d3b72"/>
      <rect x="30" y="-200" width="190" height="20" rx="8" fill="#9db6d6" data-k="arm"/>
      <rect x="-20" y="-300" width="40" height="70" rx="8" fill="#0a1630"/><circle data-k="led" cx="0" cy="-265" r="12" fill="#2ecc71"/></g>`);
    c.gr = refs(c.gate);
    c.wkg = layer(svg, ''); c.wk = new Walker(c.wkg, 'alw');
    c.ok = html(`<div class="abs" style="left:360px;right:60px;top:860px;padding:18px;border-radius:24px;text-align:center;background:linear-gradient(140deg,#1a8a52,#0c4a2c);border:4px solid #b8ffd0;font-weight:900;font-size:34px;line-height:1.15">✓ СЕРГЕК<br>ЖҰМЫСҚА ДАЙЫН</div>`);
    root.appendChild(c.ok);
    // feeling unwell → report
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'alw2');
    c.radio = radioProp(c.w);
    c.bub = html(`<div class="abs" style="left:110px;top:840px;width:150px;height:150px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 10px 30px rgba(0,0,0,.4)"><svg width="100" height="100" viewBox="-50 -50 100 100">${ICON.sick.replace('fill="#fff"', 'fill="#ffe7c7"')}</svg></div>`);
    root.appendChild(c.bub);
    c.waves = wavesLayer(svg, 445, 1095);
    c.boss = html(`<div class="pill" style="left:520px;top:900px;width:500px;font-size:30px;border-color:#ffd23f"><div class="ic" style="background:linear-gradient(140deg,#ffd23f,#e0a800)"><svg viewBox="-50 -50 100 100">${ICON.radio}</svg></div><div>Нашар сезінсең —<br><b style="color:#ffd23f">БАСШЫҒА ХАБАРЛА</b></div></div>`);
    root.appendChild(c.boss);
    // team
    c.team = layer(svg, `<ellipse cx="540" cy="1150" rx="460" ry="300" fill="url(#glowG)" opacity="0.25"/>`);
    c.tg = layer(svg, '');
    c.t1 = new Worker(c.tg, 'alt1', { helmet: '#2f86ff', helmetSh: '#1f5fbf' });
    c.t2 = new Worker(c.tg, 'alt2');
    c.t3 = new Worker(c.tg, 'alt3', { helmet: '#ffd23f', helmetSh: '#d9a800' });
    c.teamTxt = html(`<div class="abs" style="left:60px;right:60px;top:860px;text-align:center;font-weight:900;font-size:40px;line-height:1.15">Сергектік —<br><span style="color:#2ecc71">барлығымыздың қауіпсіздігі</span></div>`);
    root.appendChild(c.teamTxt);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const a = [1, 2, 3, 4, 5, 6].map(i => info.cue('a' + i));
    c.signs.forEach((s, i) => {
      const k = ep(lt, a[i] - 0.1, 0.5, E.outBack);
      T(s.el, 0, (1 - k) * 60, lerp(0.5, 1, k) * (lt > a[i] && lt < (a[i + 1] || 1e9) ? 1.04 : 1), 0, ep(lt, a[i] - 0.1, 0.25) * (lt > a[3] - 0.2 ? 0.45 : 1));
      const st = ep(lt, a[i] + 0.5, 0.3, E.outBack); s.st.style.opacity = st; s.st.style.transform = `rotate(8deg) scale(${lerp(2.4, 1, st)})`;
    });
    c.big.forEach((B, i) => { popIn(B.el, lt, a[i] + 0.2, { dy: 40, s0: 0.6, out: a[i + 1] - 0.25 }); B.ring.setAttribute('r', (110 + 14 * pulse(lt, 1.2)).toFixed(1)); });
    const m3 = env(lt, a[2] + 0.1, a[3] - 0.15, 0.4, 0.3);
    const msp = spinAngle(lt, [[0, 0.01, 480, 480]]);
    c.mpu.set({ t: lt, x: 560, y: 1030, s: 0.62, ang: msp.ang, speed: msp.speed, o: m3 });
    T(c.mx, 0, 0, 1, 0, m3 * ep(lt, a[2] + 0.6, 0.3) * (0.7 + 0.3 * pulse(lt, 1.5)));
    popIn(c.mtxt, lt, a[2] + 0.7, { dy: 20, out: a[3] - 0.2 });
    // part a4: arrive sober through the gate
    const g4 = env(lt, a[3] - 0.2, a[4] - 0.1, 0.4, 0.3);
    O(c.gate, g4);
    const wk = ep(lt, a[3], 2.4, E.inOutSine);
    c.wk.set({ x: lerp(80, 560, wk), y: 1370, s: 0.55, phase: lt * 1.4, amp: wk < 1 ? 1 : 0, o: g4 });
    const open = ep(lt, a[3] + 2.2, 0.5);
    T(c.gr.arm, 0, 0, 1, -80 * open);
    popIn(c.ok, lt, a[3] + 2.4, { dy: 30, s0: 0.7, out: a[4] - 0.2 });
    // part a5: unwell → report
    const g5 = env(lt, a[4] - 0.1, a[5] - 0.1, 0.4, 0.3);
    const rep = ep(lt, info.word('a5', 'басшыға', 2.5) - 0.1, 0.5, E.outBack);
    const sick = 1 - rep;
    c.w.set({ x: 300, y: 1370, s: 0.75, o: g5, blink: lt % 1.6 > 1.2 ? 1 : 0, tilt: 8 * sick * Math.sin(lt * 1.4), look: -2,
      aL: [lerp(30, 10, rep), lerp(-150, 0, rep)], aR: [lerp(-10, -20, rep), lerp(0, -150, rep)], mouth: rep > 0.9 && lt < a[5] ? 0.5 * pulse(lt, 4) : 0 });
    O(c.radio.radio, rep * g5);
    animWaves(c.waves, lt, rep > 0.9 && g5 > 0.5);
    popIn(c.bub, lt, a[4] + 0.6, { dy: 20, s0: 0.5, out: info.word('a5', 'басшыға', 2.5) + 0.3 });
    popIn(c.boss, lt, info.word('a5', 'басшыға', 2.5), { dx: 100, dy: 0, out: a[5] - 0.2 });
    // part a6: team
    const g6 = ep(lt, a[5] - 0.1, 0.5);
    O(c.team, g6);
    [[c.t1, 260, 0.62, 1.7], [c.t3, 820, 0.62, 2.3], [c.t2, 540, 0.72, 0]].forEach(([w, x, s, sd], i) => {
      const k = ep(lt, a[5] + i * 0.15, 0.6, E.outBack);
      w.set({ x, y: 1380 + (1 - k) * 60, s, o: g6 * ep(lt, a[5] + i * 0.15, 0.3), blink: blinkAt(lt, sd), aL: [10, 0], aR: i === 2 ? [-20, -150] : [-10, 0], thumbR: i === 2 });
    });
    popIn(c.teamTxt, lt, a[5] + 0.4, { dy: 30 });
  },
};
