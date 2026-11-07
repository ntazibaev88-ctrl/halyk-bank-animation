// Practical module: module2, pipes, cooling, light, tools, move, checklist, quiz, final2

function warnCard(root, html_, top = 1080) {
  const el = html(`<div class="abs" style="left:60px;right:60px;top:${top}px;padding:22px 26px;border-radius:28px;display:flex;gap:22px;align-items:center;
    background:linear-gradient(140deg,#e8262b,#8f0f14);border:5px solid #ffd23f;box-shadow:0 24px 70px rgba(0,0,0,.55)">
    <svg width="110" height="110" viewBox="-110 -110 220 220" style="flex:none">${noSign('<g></g>', 100)}</svg>
    <div style="font-weight:900;font-size:40px;line-height:1.12">${html_}</div></div>`);
  root.appendChild(el); return el;
}
function radioProp(w) {
  return w.prop('R', `<g data-k="radio" transform="translate(0 100)"><rect x="-18" y="-40" width="36" height="66" rx="8" fill="#222a36"/><rect x="6" y="-70" width="7" height="32" rx="3" fill="#222a36"/><rect x="-11" y="-30" width="22" height="16" rx="3" fill="#2ecc71"/></g>`);
}
function wavesLayer(svg, x, y) {
  return layer(svg, `<g transform="translate(${x} ${y})" stroke="#ffd23f" stroke-width="7" fill="none" stroke-linecap="round"><path d="M0 -26 Q20 0 0 26"/><path d="M22 -48 Q56 0 22 48"/><path d="M44 -70 Q92 0 44 70"/></g>`);
}
function animWaves(g, lt, on) { [...g.firstChild.children].forEach((p, i) => O(p, (on ? 1 : 0) * pulse(lt * 1.5 - i * 0.2, 1))); }

// ======================= MODULE 2 TITLE CARD =======================
SCENES.module2 = {
  build(root, info) {
    const svg = stage(root);
    const c = {};
    c.room = new BoilerRoom(svg, 'm2r');
    layer(svg, `<rect width="1080" height="1920" fill="#060d20" opacity="0.72"/>`);
    bgGlow(svg, 540, 900, 560, 'glowO', 0.22);
    c.card = html(`<div class="abs" style="left:60px;right:60px;top:430px;text-align:center">
      <div data-k="chip" class="chip" style="font-size:34px"><b style="width:56px;height:56px;font-size:30px">2</b>БӨЛІМ · ПРАКТИКА</div>
      <div data-k="t1" style="font-weight:900;font-size:88px;line-height:1.02;margin-top:30px">ПРАКТИКАЛЫҚ<br><span style="color:#ff8a1f">БӨЛІМ</span></div>
      <div data-k="t2" style="font-weight:700;font-size:38px;line-height:1.25;margin-top:24px;color:#cfe0f7">Қазандық цехындағы жұмыс<br>және өнеркәсіптік қауіпсіздік<br><span style="font-size:28px;color:#8fa9cf">(котельный цех)</span></div></div>`);
    root.appendChild(c.card); c.cr = refs(c.card);
    const topics = [['pipe', 'Құбырлар'], ['cool', 'Салқындату'], ['bulb', 'Жарық'], ['wrench', 'Құралдар'], ['gearCheck', 'Механизмдер'], ['walk', 'Қозғалыс'], ['shield', 'Сергектік'], ['list', 'Чек-парақ']];
    c.topics = topics.map(([ic, tx], i) => {
      const el = html(`<div class="abs" style="left:${70 + (i % 4) * 240}px;top:${1000 + Math.floor(i / 4) * 190}px;width:220px;text-align:center">
        <div style="width:96px;height:96px;margin:0 auto;border-radius:26px;display:grid;place-items:center;background:linear-gradient(140deg,#ff8a1f,#e0600a);box-shadow:0 10px 30px rgba(0,0,0,.4)"><svg width="62" height="62" viewBox="-50 -50 100 100">${ICON[ic]}</svg></div>
        <div style="font-weight:800;font-size:28px;margin-top:10px">${11 + i} · ${tx}</div></div>`);
      root.appendChild(el); return el;
    });
    return c;
  },
  update(c, lt, info) {
    c.room.update(lt);
    popIn(c.cr.chip, lt, 0.3, { dy: -30, s0: 0.6 });
    popIn(c.cr.t1, lt, 0.45, { dy: 60, s0: 0.85, ease: E.outExpo });
    popIn(c.cr.t2, lt, 0.8, { dy: 30 });
    const tp = info.cue('topic');
    c.topics.forEach((el, i) => popIn(el, lt, Math.min(tp, 2.2) + i * 0.18, { dy: 50, s0: 0.5 }));
  },
};

// ======================= 11. PIPES =======================
SCENES.pipes = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/><rect width="1080" height="1920" fill="url(#gridS)"/><rect width="1080" height="1920" fill="url(#grid)" opacity="0.5"/>`);
    const c = {};
    c.H = header(root, '11', 'Ø32–60 мм<br><span class="o">құбырлар</span>', null, { chip: 'ҚҰБЫРЛАР' });
    // phase A: four pipe sizes (proportional), not to any wall thickness
    const sizes = [32, 40, 50, 60];
    let xs = 150;
    c.sizes = sizes.map((d, i) => {
      const r = d * 1.45, x = xs + r; xs += 2 * r + 46;
      const g = layer(svg, `<g transform="translate(${x} 590)"><g data-k="s">
        <rect x="${-r}" y="0" width="${2 * r}" height="120" fill="url(#steelV)"/>
        <ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.42}" fill="#c9d3e0"/><ellipse cx="0" cy="0" rx="${r * 0.8}" ry="${r * 0.42 * 0.8}" fill="#0a1630"/>
        <text y="${170 + 4}" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="38" fill="#ff8a1f">Ø${d}</text>
        <text y="${206}" text-anchor="middle" font-family="Montserrat" font-weight="700" font-size="24" fill="#a9c4ea">мм</text></g></g>`);
      return refs(g).s;
    });
    // cross-section diagram
    c.xs = layer(svg, `<g transform="translate(330 1110)">
      <circle r="190" fill="url(#steelV)"/><circle r="150" fill="#0a1630"/>
      <circle r="150" fill="url(#glowB)" opacity="0.35"/>
      <g data-k="dout"><line x1="-190" y1="-232" x2="190" y2="-232" stroke="#ffd23f" stroke-width="5"/><line x1="-190" y1="-250" x2="-190" y2="-200" stroke="#ffd23f" stroke-width="4"/><line x1="190" y1="-250" x2="190" y2="-200" stroke="#ffd23f" stroke-width="4"/>
        <rect x="-60" y="-262" width="120" height="44" rx="10" fill="#0a1630"/><text y="-230" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="32" fill="#ffd23f">Dн</text></g>
      <g data-k="din"><line x1="-150" y1="0" x2="150" y2="0" stroke="#5ab4ff" stroke-width="5"/><path d="M-150 0 L-130 -10 L-130 10Z M150 0 L130 -10 L130 10Z" fill="#5ab4ff"/>
        <rect x="-50" y="-26" width="100" height="44" rx="10" fill="#0a1630"/><text y="6" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="32" fill="#5ab4ff">Dв</text></g>
      <g data-k="ds"><line x1="150" y1="60" x2="190" y2="60" stroke="#ff8a1f" stroke-width="6"/><circle cx="150" cy="60" r="6" fill="#ff8a1f"/><circle cx="190" cy="60" r="6" fill="#ff8a1f"/>
        <text x="172" y="110" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="36" fill="#ff8a1f">s</text></g>
    </g>`);
    c.xr = refs(c.xs);
    c.legend = html(`<div class="abs" style="left:560px;right:50px;top:930px;font-weight:700;font-size:28px;line-height:1.25">
      <div data-k="l1" style="margin-bottom:16px"><b style="color:#ffd23f">Dн</b> — сыртқы диаметр<br><span style="color:#8fa9cf;font-size:22px">(наружный диаметр)</span></div>
      <div data-k="l2" style="margin-bottom:16px"><b style="color:#5ab4ff">Dв</b> — ішкі диаметр<br><span style="color:#8fa9cf;font-size:22px">(внутренний диаметр)</span></div>
      <div data-k="l3" style="margin-bottom:16px"><b style="color:#ff8a1f">s</b> — қабырға қалыңдығы<br><span style="font-size:30px;font-weight:900">s = (Dн − Dв) / 2</span></div>
      <div data-k="l4"><b style="color:#2ecc71">DN</b> — шартты өту диаметрі<br><span style="color:#8fa9cf;font-size:22px">(условный проход, номинал)</span></div></div>`);
    root.appendChild(c.legend); c.lr = refs(c.legend);
    c.doc = html(`<div class="card" style="left:90px;right:90px;top:820px;padding:30px;text-align:center;border-color:#ffd23f">
      <svg width="120" height="120" viewBox="-50 -50 100 100">${ICON.doc}</svg>
      <div style="font-weight:900;font-size:40px;line-height:1.15;margin-top:10px">Нақты өлшемдер —<br><span style="color:#ffd23f">тек бекітілген жобадан</span><br>және техникалық құжаттамадан</div>
      <div style="font-weight:700;font-size:26px;color:#a9c4ea;margin-top:12px">(проект, исполнительная документация)</div></div>`);
    root.appendChild(c.doc);
    // phase B: routing diagram
    const D = 'M60 770 L400 800 L400 640 L600 640 L600 818 L1020 852';
    c.route = layer(svg, `
      <rect x="0" y="1010" width="1080" height="8" fill="#2f86ff" opacity="0.4"/>
      ${[160, 300, 740, 900].map((x, i) => { const y = 770 + (x - 60) * (82 / 960); return `<g data-k="sup${i}"><path d="M${x - 34} 1010 L${x} ${y + 18} L${x + 34} 1010Z" fill="#1f5fbf" opacity="0.9"/><rect x="${x - 40}" y="${y + 18}" width="80" height="12" fill="#5d93dc"/></g>`; }).join('')}
      <path data-k="pd" pathLength="1" d="${D}" stroke="#4f6c95" stroke-width="34" fill="none" stroke-linejoin="round"/>
      <path data-k="pl" pathLength="1" d="${D}" stroke="#a9c0dd" stroke-width="10" fill="none" stroke-linejoin="round" transform="translate(0 -8)"/>
      <path data-k="heat" d="${D}" stroke="#ff8a1f" stroke-width="34" fill="none" stroke-linejoin="round" opacity="0"/>
      <g data-k="ins"><path d="M640 822 L1000 851" stroke="#c9d3e0" stroke-width="54" fill="none"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${660 + i * 60}" y1="${800 + i * 4.9}" x2="${660 + i * 60}" y2="${852 + i * 4.9}" stroke="#8a9ab0" stroke-width="4"/>`).join('')}
        <path d="M960 822 L1000 825 L1000 878 L960 875Z" fill="#ffd23f"/></g>
      ${[160, 300, 740, 900].map((x, i) => { const y = 770 + (x - 60) * (82 / 960); return `<path data-k="cl${i}" d="M${x - 24} ${y + 18} L${x - 24} ${y - 6} A24 24 0 0 1 ${x + 24} ${y - 6} L${x + 24} ${y + 18}" stroke="#ff8a1f" stroke-width="7" fill="none" opacity="0"/>`; }).join('')}
      <g data-k="fl"><rect x="232" y="752" width="14" height="70" rx="3" fill="#7f9cc4"/><rect x="250" y="753" width="14" height="70" rx="3" fill="#7f9cc4"/>${[0, 1, 2].map(i => `<circle cx="248" cy="${762 + i * 25}" r="5" fill="#ffd23f"/>`).join('')}</g>
      <g data-k="wd"><path d="M520 818 l6 -10 l6 10 l6 -10 l6 10" transform="translate(52 0) rotate(90 538 812)" stroke="#ffd23f" stroke-width="5" fill="none"/></g>
      <g data-k="slope" transform="translate(80 700)"><path d="M0 0 L200 18" stroke="#2ecc71" stroke-width="5" stroke-dasharray="12 8"/><path d="M200 18 L180 6 L184 24Z" fill="#2ecc71"/></g>
      <g data-k="exp"><path d="M380 600 L330 600 M380 600 L364 588 M380 600 L364 612 M620 600 L670 600 M620 600 L636 588 M620 600 L636 612" stroke="#ff8a1f" stroke-width="6" fill="none"/></g>
      ${lbl(180, 660, 'КӨЛБЕУЛІК (уклон)', '#2ecc71', 24)}
      ${lbl(500, 580, 'КОМПЕНСАТОР', '#ff8a1f', 24)}`);
    c.rr = refs(c.route);
    c.rlabels = [['ТІРЕК (опора)', 160, 1060, '#7cc4ff', 'тіректер'], ['ҚАМЫТ (хомут)', 300, 720, '#ff8a1f', 'қамытпен'], ['ДӘНЕКЕРЛЕУ', 720, 770, '#ffd23f', 'дәнекерлеу'],
      ['ФЛАНЕЦ', 255, 870, '#ffd23f', 'фланец'], ['ЖЫЛУ ОҚШАУЛАУ (изоляция)', 800, 950, '#c9d3e0', 'оқшаулағышпен']].map(([t, x, y, col, w]) => ({ g: layer(svg, lbl(x, y, t, col, 24)), w }));
    c.chips = ['Бағыт', 'Көлбеулік', 'Тіректер', 'Жылулық ұлғаю'].map((t, i) => {
      const el = html(`<div class="abs" style="left:${60 + i * 245}px;top:1130px;width:225px;padding:16px 8px;border-radius:20px;text-align:center;font-weight:800;font-size:28px;background:rgba(15,33,71,.9);border:3px solid rgba(46,204,113,.6)">✓ ${t}</div>`);
      root.appendChild(el); return el;
    });
    c.warn = warnCard(root, 'Құбыр бағытын<br><span style="color:#ffd23f">ӨЗ БЕТІҢШЕ ӨЗГЕРТУГЕ БОЛМАЙДЫ!</span>', 1150);
    c.alt = layer(svg, `<path d="M400 800 L400 960 L600 960 L600 818" stroke="#ff3b3b" stroke-width="12" fill="none" stroke-dasharray="22 14"/><g transform="translate(500 960)"><circle r="40" fill="#e8262b"/><path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g>`);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const route = info.cue('route'), dia = info.cue('dia'), wall = info.cue('wall'), dn = info.cue('dn'), doc = info.cue('doc'), parts = info.cue('parts'), warn = info.cue('warn');
    const A = 1 - ep(lt, route - 0.4, 0.4);
    const sw = ['ø32', 'ø40', 'ø50', 'ø60'].map((p, i) => Math.min(info.word('sizes', p, i * 0.6), info.cue('sizes') + i * 0.8));
    c.sizes.forEach((s, i) => { const k = ep(lt, Math.min(0.9 + i * 0.15, sw[i] - 0.1), 0.5, E.outBack); T(s, 0, (1 - k) * 80, lerp(0.4, 1, k) * (lt > sw[i] && lt < sw[i] + 0.6 ? 1.1 : 1), 0, ep(lt, Math.min(0.9 + i * 0.15, sw[i] - 0.1), 0.25) * A); });
    O(c.xs, ep(lt, dia - 0.2, 0.4) * A * (1 - 0.8 * env(lt, doc - 0.1, route - 0.5, 0.3, 0.3)));
    O(c.xr.dout, ep(lt, dia + 0.1, 0.3)); O(c.xr.din, ep(lt, info.word('dia', 'ішкі', 2), 0.3)); O(c.xr.ds, ep(lt, wall, 0.3) * (lt > wall && lt < wall + 2 ? 0.6 + 0.4 * pulse(lt, 2) : 1));
    const ls = [dia + 0.1, info.word('dia', 'ішкі', 2), wall, dn];
    ['l1', 'l2', 'l3', 'l4'].forEach((k, i) => popIn(c.lr[k], lt, ls[i], { dx: 60, dy: 0, s0: 1 }));
    O(c.legend, A * (1 - 0.85 * env(lt, doc - 0.1, route - 0.5, 0.3, 0.3)));
    popIn(c.doc, lt, doc - 0.1, { dy: 50, s0: 0.85, out: route - 0.5 });
    // phase B
    const B = ep(lt, route - 0.3, 0.4);
    O(c.route, B);
    draw(c.rr.pd, ep(lt, route - 0.2, 1.4, E.inOutCubic)); draw(c.rr.pl, ep(lt, route - 0.2, 1.4, E.inOutCubic));
    for (let i = 0; i < 4; i++) T(c.rr['sup' + i], 0, (1 - ep(lt, info.word('route', 'тіректер', 2) + i * 0.1, 0.4, E.outBack)) * 40, 1, 0, ep(lt, info.word('route', 'тіректер', 2) + i * 0.1, 0.2));
    O(c.rr.slope, ep(lt, info.word('route', 'көлбеулік', 1.5), 0.3));
    const tw = info.word('route', 'жылулық', 3);
    const heat = ep(lt, tw, 0.6);
    O(c.rr.heat, heat * (0.25 + 0.2 * pulse(lt, 0.8)) * (1 - ep(lt, warn, 0.4)));
    const exp = heat * (0.5 + 0.5 * Math.sin((lt - tw) * 2.5));
    T(c.rr.exp, 0, 0, 1, 0, heat * (0.6 + 0.4 * pulse(lt, 1.2)));
    O(c.rr.ins, ep(lt, info.word('parts', 'оқшаулағышпен', 4), 0.4));
    O(c.rr.fl, ep(lt, info.word('parts', 'фланец', 3), 0.3)); O(c.rr.wd, ep(lt, info.word('parts', 'дәнекерлеу', 2.5), 0.3));
    for (let i = 0; i < 4; i++) O(c.rr['cl' + i], ep(lt, info.word('parts', 'қамытпен', 1.2) + i * 0.1, 0.3));
    c.rlabels.forEach(({ g, w }, i) => { const t0 = w === 'тіректер' ? info.word('route', 'тіректер', 2) : info.word('parts', w, 1 + i); O(g, ep(lt, t0 + 0.1, 0.3) * B * (1 - 0.6 * ep(lt, warn, 0.3))); });
    const cw = ['бағыт', 'көлбеулік', 'тіректер', 'жылулық'].map((p, i) => info.word('route', p, 1 + i));
    c.chips.forEach((el, i) => popIn(el, lt, cw[i], { dy: 30, s0: 0.7, out: warn - 0.3 }));
    // expansion: subtle stretch of the loop
    T(c.rr.pd, 0, 0, 1); c.rr.pd.setAttribute('d', `M60 770 L${(400 - 6 * exp).toFixed(1)} 800 L${(400 - 6 * exp).toFixed(1)} 640 L${(600 + 6 * exp).toFixed(1)} 640 L${(600 + 6 * exp).toFixed(1)} 818 L1020 852`);
    popIn(c.warn, lt, warn - 0.1, { dy: 50, s0: 0.8 });
    O(c.alt, ep(lt, warn + 0.3, 0.3) * (lt > warn ? 0.6 + 0.4 * pulse(lt, 1.5) : 0));
  },
};

// ======================= 12. COOLING =======================
SCENES.cooling = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/><rect width="1080" height="1920" fill="url(#grid)" opacity="0.6"/>`);
    const c = {};
    c.H = header(root, '12', 'Салқындату<br><span class="o">жүйесі</span>', null, { chip: 'САЛҚЫНДАТУ' });
    // pipe loop paths
    const cold = 'M830 1290 L230 1290 L230 1210 M230 1120 L230 720 L190 720';
    const hot = 'M330 680 L560 680 M760 680 L960 680 L960 980 L900 980';
    c.pipes = layer(svg, `
      <path d="${cold}" stroke="#123a7a" stroke-width="34" fill="none" stroke-linejoin="round"/><path d="${cold}" stroke="#2f86ff" stroke-width="20" fill="none" stroke-linejoin="round"/>
      <path d="${hot}" stroke="#7a2f05" stroke-width="34" fill="none" stroke-linejoin="round"/><path d="${hot}" stroke="#ff8a1f" stroke-width="20" fill="none" stroke-linejoin="round"/>
      <path data-k="fc" d="M830 1290 L230 1290 L230 720 L240 720" fill="none"/><path data-k="fh" d="M330 680 L960 680 L960 980 L900 980" fill="none"/>`);
    c.pr = refs(c.pipes);
    c.nodes = layer(svg, `
      <g data-k="pump" transform="translate(230 1165)"><circle r="62" fill="url(#tankV)"/><circle r="44" fill="#0a1630"/><g data-k="imp">${vanes(6, 8, 40, 40, 8, '#9db6d6')}</g><rect x="50" y="-30" width="70" height="60" rx="10" fill="#1f5fbf"/></g>
      <g data-k="cond" transform="translate(260 680)"><rect x="-100" y="-70" width="200" height="140" rx="50" fill="url(#tankH)"/><rect x="-80" y="-50" width="160" height="100" rx="34" fill="#0a1630"/>
        ${[0, 1, 2].map(r => [0, 1, 2, 3, 4].map(i => `<circle cx="${-56 + i * 28}" cy="${-24 + r * 24}" r="8" fill="#2f86ff" stroke="#9fd2ff" stroke-width="2"/>`).join('')).join('')}
        <rect x="-26" y="-150" width="52" height="80" fill="url(#tankV)"/></g>
      <g data-k="hx" transform="translate(660 680)"><rect x="-100" y="-80" width="200" height="160" rx="18" fill="url(#tankV)"/><rect x="-82" y="-62" width="164" height="124" rx="10" fill="#0a1630"/>
        <path d="M-70 -40 H70 V-14 H-70 V12 H70 V38" stroke="#ff8a1f" stroke-width="10" fill="none"/></g>
      <g data-k="tower" transform="translate(830 1180)"><path d="M-120 110 C-96 20 -80 -40 -96 -150 L96 -150 C80 -40 96 20 120 110Z" fill="#2a56a0"/><path d="M0 110 L0 -150 L96 -150 C80 -40 96 20 120 110Z" fill="#1f4688"/>
        <rect x="-130" y="100" width="260" height="24" rx="8" fill="#13264a"/><rect x="-118" y="90" width="236" height="16" fill="#2f86ff" opacity="0.6"/><g data-k="rain"></g></g>`);
    c.nr = refs(c.nodes);
    c.rain = [...Array(16)].map(() => { const e = document.createElementNS(SVGNS, 'line'); e.setAttribute('stroke', '#9fd2ff'); e.setAttribute('stroke-width', 4); e.setAttribute('stroke-linecap', 'round'); c.nr.rain.appendChild(e); return e; });
    c.plume = new Puffs(svg, 18, { x: 830, y: 1020, life: 3, rise: 300, wind: 60, r0: 30, r1: 110, a: 0.55, spread: 120, seed: 71 });
    c.fc = new Flow(svg, c.pr.fc, 26, { r: 8, color: '#bfe3ff', speed: 0.22 });
    c.fh = new Flow(svg, c.pr.fh, 20, { r: 8, color: '#ffd9a8', speed: 0.26 });
    c.heat = layer(svg, [[260, 560], [660, 570]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[-30, 0, 30].map(dx => `<path d="M${dx} 0 q10 -16 0 -32 q-10 -16 0 -32" stroke="#ff5a2a" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}</g>`).join(''));
    c.labels = [lbl(230, 1270 - 190, 'НАСОС', '#7cc4ff', 26), lbl(260, 830, 'КОНДЕНСАТОР', '#fff', 24), lbl(660, 830, 'ЖЫЛУ АЛМАСТЫРҒЫШ', '#fff', 24),
      lbl(830, 1350, 'САЛҚЫНДАТУ МҰНАРАСЫ (градирня)', '#7cc4ff', 22), lbl(540, 1240, 'САЛҚЫН СУ', '#7cc4ff', 22), lbl(880, 636, 'ЫСТЫҚ СУ', '#ffb347', 22), lbl(260, 500, 'ЖЫЛУ', '#ff8a1f', 22)].map(s => layer(svg, s));
    c.warn = warnCard(root, 'Ыстық құбырды өз бетіңше<br><span style="color:#ffd23f">СУМЕН САЛҚЫНДАТУҒА БОЛМАЙДЫ!</span>', 1150);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const k2 = info.cue('k2'), k3 = info.cue('k3'), k4 = info.cue('k4'), k5 = info.cue('k5');
    O(c.pipes, ep(lt, 0.6, 0.5));
    const on = ep(lt, k2 - 0.2, 0.6);
    T(c.nr.imp, 0, 0, 1, lt * 300 * on);
    c.fc.update(lt, on); c.fh.update(lt, ep(lt, k3, 0.6));
    const pop = (g, at, s) => { const k = ep(lt, at, 0.5, E.outBack); const [x, y] = g.getAttribute('data-base') ? g.getAttribute('data-base').split(',').map(Number) : (() => { const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(g.getAttribute('transform')); g.setAttribute('data-base', m[1] + ',' + m[2]); return [+m[1], +m[2]]; })(); T(g, x, y, lerp(0.5, 1, k) * (s || 1), 0, ep(lt, at, 0.25)); };
    pop(c.nr.cond, 0.8); pop(c.nr.hx, 1.0); pop(c.nr.tower, 1.2); pop(c.nr.pump, 1.4, lt > k2 && lt < k3 ? 1.08 : 1);
    O(c.heat, ep(lt, 0.9, 0.4) * (0.6 + 0.4 * pulse(lt, 1.3)));
    c.rain.forEach((e, i) => { const ph = (lt * 1.4 + i / 16) % 1; const x = -90 + (i * 37) % 180; const y = -140 + ph * 220; e.setAttribute('x1', x); e.setAttribute('x2', x); e.setAttribute('y1', y.toFixed(0)); e.setAttribute('y2', (y + 18).toFixed(0)); e.setAttribute('opacity', (Math.sin(Math.PI * ph) * ep(lt, k3, 0.5)).toFixed(2)); });
    c.plume.update(lt, ep(lt, k3, 0.8));
    const la = [k2, 1.0, 1.2, 1.4, k4, k3, 0.9];
    c.labels.forEach((g, i) => O(g, ep(lt, la[i] + 0.2, 0.3) * (1 - 0.6 * ep(lt, k5, 0.3))));
    popIn(c.warn, lt, k5 - 0.1, { dy: 50, s0: 0.8 });
  },
};

// ======================= 13. INSUFFICIENT LIGHTING =======================
SCENES.light = {
  build(root, info) {
    const svg = stage(root);
    const c = {};
    c.room = new BoilerRoom(svg, 'lr');
    // hidden hazards
    c.hz = layer(svg, `<g transform="translate(820 1330)"><ellipse rx="120" ry="34" fill="#02050d"/><rect x="-130" y="-8" width="260" height="10" fill="url(#hazard)" opacity="0"/></g>
      <g data-k="mk1" transform="translate(820 1240)">${warnSign(ICON.alert.replace(/fill="#fff"/g, 'fill="#1a1a1a"').replace(/stroke="#fff"/g, 'stroke="#1a1a1a"'), 44)}</g>
      <g data-k="mk2" transform="translate(220 1190)">${warnSign(ICON.fire.replace(/fill="#fff"/g, 'fill="#1a1a1a"'), 44)}</g>`);
    c.hr = refs(c.hz);
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'lw');
    c.radio = radioProp(c.w);
    c.lamp = layer(svg, `<g transform="translate(860 1300)"><path d="M0 0 L-60 0 M0 0 L60 0 M0 0 L0 -170" stroke="#2b2f36" stroke-width="8"/><path d="M-40 0 L0 -170 L40 0" stroke="#2b2f36" stroke-width="6" fill="none"/>
      <g transform="translate(0 -200)"><g data-k="beam"><path d="M-60 -10 L-560 -260 L-560 340 L-60 30Z" fill="url(#beamY)" transform="scale(1 1)"/><circle r="260" fill="url(#glowY)"/></g>
      <rect x="-70" y="-46" width="140" height="92" rx="12" fill="#ffb21f"/><rect x="-56" y="-34" width="112" height="68" rx="6" fill="#fff6d0" data-k="led"/><rect x="-8" y="46" width="16" height="30" fill="#2b2f36"/></g></g>`);
    c.lr = refs(c.lamp);
    // darkness overlay with soft hole around the worker
    c.dark = layer(svg, `<defs><radialGradient id="holeG"><stop offset="0" stop-color="#000"/><stop offset="0.6" stop-color="#000" stop-opacity="0.7"/><stop offset="1" stop-color="#fff"/></radialGradient>
      <mask id="lmask"><rect width="1080" height="1920" fill="#fff"/><circle data-k="hole" cx="430" cy="1060" r="300" fill="url(#holeG)"/></mask></defs>
      <rect width="1080" height="1920" fill="#01030a" mask="url(#lmask)"/>`);
    c.dr = refs(c.dark);
    c.H = header(root, '13', 'Жарық<br><span class="o">жеткіліксіз</span>', null, { chip: 'ЖАРЫҚТАНДЫРУ' });
    c.stop = html(`<div class="abs" style="left:600px;top:620px;width:400px;padding:20px;border-radius:26px;text-align:center;background:linear-gradient(140deg,#e8262b,#8f0f14);border:4px solid #ffd23f;font-weight:900;font-size:40px;line-height:1.1">
      <svg width="90" height="90" viewBox="-50 -50 100 100">${ICON.noEntry}</svg><br>ЖҰМЫСТЫ<br>ТОҚТАТ!</div>`);
    root.appendChild(c.stop);
    c.boss = html(`<div class="pill" style="left:520px;top:860px;width:500px;font-size:30px;border-color:#ffd23f"><div class="ic" style="background:linear-gradient(140deg,#ffd23f,#e0a800)"><svg viewBox="-50 -50 100 100">${ICON.radio}</svg></div><div>Ауысым басшысына<br><b style="color:#ffd23f">ХАБАРЛА</b></div></div>`);
    root.appendChild(c.boss);
    c.ok = html(`<div class="abs" style="left:60px;right:60px;top:500px;padding:18px;border-radius:24px;text-align:center;font-weight:800;font-size:32px;background:rgba(46,204,113,.18);border:3px solid #2ecc71;color:#d8ffe6">✓ Рұқсат етілген өнеркәсіптік<br>тасымалы шам</div>`);
    root.appendChild(c.ok);
    c.waves = wavesLayer(svg, 525, 945);
    return c;
  },
  update(c, lt, info) {
    const l1 = info.cue('l1'), l2 = info.cue('l2'), l3 = info.cue('l3');
    const lampOn = ep(lt, l3 + 0.8, 0.5);
    const roomOn = ep(lt, l3 + 1.6, 0.8);
    c.room.update(lt, { light: lt < 0.8 ? 1 : roomOn, flicker: lt > 0.5 && lt < 1.2 });
    animHeader(c.H, lt);
    // darkness
    const dark = ep(lt, 0.8, 0.6) * (1 - 0.92 * Math.max(lampOn * 0.75, roomOn));
    O(c.dark, dark * 0.9);
    c.dr.hole.setAttribute('r', (300 + 30 * Math.sin(lt * 2)).toFixed(0));
    // worker: working, then stops, then radios
    const stopT = info.word('l1', 'болмайды', 3);
    const stopK = ep(lt, Math.min(stopT, l1 + 2.5), 0.4);
    const rr = ep(lt, l2 + 0.2, 0.5, E.outBack);
    const workArm = (1 - stopK) * (0.5 + 0.5 * Math.sin(lt * 5));
    c.w.set({ x: 430, y: 1360, s: 0.85, blink: blinkAt(lt), tilt: -4 + stopK * 6, look: 6 - stopK * 10,
      aL: [lerp(30, 10, stopK), lerp(-80 + 10 * workArm, 0, stopK)], aR: [lerp(-60, -20, rr) + (1 - rr) * -30 * (1 - stopK), lerp(-60 + 10 * workArm, -150, rr)], mouth: rr > 0.9 && lt < l3 ? 0.5 * pulse(lt, 4) : 0 });
    O(c.radio.radio, rr);
    animWaves(c.waves, lt, rr > 0.9 && lt < l3 + 0.5);
    popIn(c.stop, lt, Math.min(stopT, l1 + 2.5), { dy: 30, s0: 0.6, out: l2 + 0.4 });
    popIn(c.boss, lt, l2 + 0.2, { dx: 120, dy: 0, out: l3 + 0.3 });
    // portable lamp
    const lk = ep(lt, l3, 0.6, E.outBack);
    T(c.lamp, (1 - lk) * 400, 0, 1, 0, ep(lt, l3, 0.3));
    O(c.lr.beam, lampOn * (0.85 + 0.15 * pulse(lt, 0.5)));
    c.lr.led.setAttribute('fill', lampOn > 0.5 ? '#fffbe8' : '#7a7f8a');
    popIn(c.ok, lt, l3 + 1.0, { dy: -30 });
    T(c.hr.mk1, 820, 1240 - (1 - ep(lt, l3 + 1.8, 0.5, E.outBack)) * 40, 1, 0, ep(lt, l3 + 1.8, 0.3));
    T(c.hr.mk2, 220, 1190 - (1 - ep(lt, l3 + 2.0, 0.5, E.outBack)) * 40, 1, 0, ep(lt, l3 + 2.0, 0.3));
  },
};

// ======================= 14. TOOLS =======================
SCENES.tools = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>`);
    const c = {};
    // pegboard
    let holes = '';
    for (let r = 0; r < 26; r++) for (let q = 0; q < 18; q++) holes += `<circle cx="${30 + q * 60}" cy="${440 + r * 38}" r="4" fill="#173468"/>`;
    layer(svg, `<rect x="0" y="420" width="1080" height="980" fill="#0f2350"/>${holes}`);
    c.H = header(root, '14', 'Құралдар мен<br><span class="o">өлшеу аспаптары</span>', null, { chip: 'ҚҰРАЛДАР' });
    c.tiles = TOOLS.map((tl, i) => {
      const el = html(`<div class="card" style="left:${60 + (i % 2) * 490}px;top:${470 + Math.floor(i / 2) * 178}px;width:470px;height:162px;display:flex;align-items:center;gap:12px;padding:0 16px">
        <div style="flex:none;width:150px;height:120px;border-radius:18px;background:rgba(8,19,41,.8);display:grid;place-items:center"><svg width="144" height="90" viewBox="-85 -52 170 104">${tl.svg}</svg></div>
        <div style="min-width:0"><div style="font-weight:900;font-size:25px;color:#ff8a1f;line-height:1.05;white-space:nowrap">${tl.kk}</div><div style="font-weight:600;font-size:17px;color:#8fa9cf;margin-top:4px;white-space:nowrap">(${tl.ru})</div>
        <div style="font-weight:700;font-size:20px;margin-top:6px;line-height:1.15">${tl.use}</div></div>
        <div class="abs" style="left:-10px;top:-10px;width:40px;height:40px;border-radius:50%;background:#ff8a1f;color:#1a0d00;font-weight:900;font-size:20px;display:grid;place-items:center">${i + 1}</div></div>`);
      root.appendChild(el); return { el, m: el.querySelector('[data-k=m]') };
    });
    // inspection part
    c.insp = layer(svg, '');
    c.wg = layer(c.insp, ''); c.w = new Worker(c.wg, 'tw2');
    c.held = c.w.prop('L', `<g data-k="wr" transform="translate(10 120) rotate(-70) scale(0.9)">${TOOLS[0].svg.replace('data-k="m"', '')}</g>`);
    c.mag = layer(c.insp, `<g><circle r="58" fill="#9fd2ff" fill-opacity="0.18" stroke="#fff" stroke-width="10"/><rect x="40" y="36" width="22" height="80" rx="10" fill="#ff8a1f" transform="rotate(-45 40 36)"/></g>`);
    c.good = html(`<div class="card" style="left:600px;top:560px;width:420px;height:260px;text-align:center;border-color:#2ecc71">
      <svg width="220" height="140" viewBox="-85 -52 170 104">${TOOLS[2].svg.replace('data-k="m"', '')}</svg>
      <div style="font-weight:900;font-size:34px;color:#2ecc71">✓ ЖАРАМДЫ</div></div>`);
    c.bad = html(`<div class="card warn" style="left:600px;top:860px;width:420px;height:300px;text-align:center">
      <svg width="220" height="140" viewBox="-85 -52 170 104"><g transform="rotate(-20)"><rect x="-70" y="-7" width="46" height="14" rx="7" fill="#ff8a1f" transform="rotate(14 -24 0)"/><rect x="-20" y="-7" width="60" height="14" rx="4" fill="#ff8a1f"/><path d="M-26 -10 L-18 0 L-26 10" stroke="#1a0d00" stroke-width="4" fill="none"/>
        <path d="M36 -30 L66 -30 L66 30 L36 30 Z" fill="#7f9cc4"/><path d="M48 -30 L54 -6 L46 6 L52 30" stroke="#14213d" stroke-width="4" fill="none"/></g></svg>
      <div style="font-weight:900;font-size:34px;color:#ff6b6b">✗ ЖАРАМСЫЗ</div><div style="font-weight:700;font-size:24px">Сынған сап, жарылған бас</div></div>`);
    root.appendChild(c.good); root.appendChild(c.bad);
    c.ban = warnCard(root, 'Ақаулы құралды<br><span style="color:#ffd23f">ҚОЛДАНУҒА БОЛМАЙДЫ!</span>', 1200);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const ts = TOOLS.map((_, i) => info.cue('t' + (i + 1))), chk = info.cue('check'), bad = info.cue('bad');
    const gridOut = ep(lt, chk - 0.3, 0.5, E.inCubic);
    c.tiles.forEach((tl, i) => {
      const a = ts[i] - 0.15, nx = i < 9 ? ts[i + 1] - 0.15 : chk - 0.3;
      const k = ep(lt, Math.min(a, 0.7 + i * 0.12), 0.5, E.outBack);
      const act = lt >= a && lt < nx;
      const sc = lerp(0.6, 1, k) * (act ? lerp(1, 1.06, ep(lt, a, 0.25, E.outBack)) : 1) * (1 - 0.3 * gridOut);
      T(tl.el, 0, (1 - k) * 60 - gridOut * 80, sc, 0, ep(lt, Math.min(a, 0.7 + i * 0.12), 0.25) * (1 - gridOut) * (lt > ts[0] - 0.2 && !act && lt < chk ? 0.55 : 1));
      tl.el.style.borderColor = act ? '#ff8a1f' : 'rgba(99,179,255,0.35)';
      tl.el.style.zIndex = act ? 3 : 1;
      const u = act ? lt - a : 0, m = tl.m;
      if (!m) return;
      switch (i) {
        case 0: T(m, 0, 0, 1, -25 + 20 * Math.sin(u * 4)); break;
        case 1: T(m, -8 * pulse(u, 0.8), 6 * pulse(u, 0.8), 1); break;
        case 2: T(m, 0, 0, 1, Math.min(70, u * 50)); break;
        case 3: T(m, 0, 0, [1, 1 - 0.25 * Math.abs(Math.sin(u * 6))]); break;
        case 4: T(m, 0, 0, 1, -10 * pulse(u, 1)); break;
        case 5: T(m, 0, 0, [lerp(0.3, 1, ep(u, 0, 1.2)), 1]); break;
        case 6: T(m, 70 * pulse(u - 0.25, 0.5), 0, 1); break;
        case 7: T(m, 12 * Math.sin(u * 2.4) * Math.exp(-u * 0.4), 0, 1); break;
        case 8: O(m, act ? 0.6 + 0.4 * pulse(u, 2) : 0.3); break;
        case 9: T(m, 0, 0, 1, -20 - 18 * Math.max(0, Math.sin(u * 7))); break;
      }
    });
    const ins = ep(lt, chk - 0.1, 0.5);
    O(c.insp, ins);
    c.w.set({ x: 300, y: 1370, s: 0.8, blink: blinkAt(lt), tilt: 8, look: 6, lookY: 4, aL: [30, -110], aR: [-40, -60] });
    T(c.mag.firstChild, 330 + Math.sin(lt * 1.8) * 40, 1010 + Math.cos(lt * 2.2) * 30, 1);
    popIn(c.good, lt, chk + 0.6, { dx: 140, dy: 0 });
    popIn(c.bad, lt, chk + 1.4, { dx: 140, dy: 0 });
    const shake = lt > bad && lt < bad + 0.5 ? Math.sin(lt * 70) * 8 : 0;
    c.bad.style.transform += ` translateX(${shake.toFixed(1)}px)`;
    popIn(c.ban, lt, bad - 0.05, { dy: 50, s0: 0.8 });
  },
};

// ======================= 15. MOVEMENT ON SITE =======================
SCENES.move = {
  build(root, info) {
    const svg = stage(root);
    const c = {};
    let win = '';
    for (let i = 0; i < 6; i++) win += `<rect x="${40 + i * 175}" y="620" width="140" height="200" rx="6" fill="#16336a"/><rect x="${40 + i * 175}" y="620" width="140" height="200" rx="6" fill="url(#glowB)" opacity="0.25"/>`;
    layer(svg, `<rect width="1080" height="1920" fill="#0b1a3a"/>${win}
      <rect x="0" y="1000" width="1080" height="920" fill="#11213f"/>
      <rect x="0" y="1060" width="1080" height="140" fill="#26324a"/>${[...Array(9)].map((_, i) => `<rect x="${i * 130 + 20}" y="1126" width="70" height="8" fill="#fff" opacity="0.6"/>`).join('')}
      <rect x="0" y="1210" width="1080" height="110" fill="#1a6b46"/><rect x="0" y="1206" width="1080" height="8" fill="#ffd23f"/><rect x="0" y="1318" width="1080" height="8" fill="#ffd23f"/>
      ${[0, 1, 2, 3].map(i => `<g transform="translate(${130 + i * 260} 1265) scale(0.42)" opacity="0.5">${ICON.walk}</g>`).join('')}
      <rect x="0" y="1326" width="1080" height="600" fill="#0d1a33"/>
      <rect x="0" y="470" width="1080" height="20" fill="#1d3b72"/>`);
    // restricted zone (left back)
    c.zone = layer(svg, `<g transform="translate(150 1000)"><rect x="-130" y="-140" width="260" height="140" fill="#3a1220" opacity="0.6"/>
      <rect x="-140" y="-60" width="280" height="22" fill="url(#hazard)"/>${[-130, 0, 130].map(x => `<rect x="${x - 6}" y="-60" width="12" height="60" fill="#ffd23f"/>`).join('')}
      <g data-k="ns" transform="translate(0 -110)">${noSign(ICON.people.replace(/fill="#fff"/g, 'fill="#14213d"'), 52)}</g></g>`);
    c.zr = refs(c.zone);
    // working machine (right back)
    c.mach = layer(svg, `<g transform="translate(940 930)"><rect x="-100" y="-160" width="200" height="230" rx="14" fill="#2a56a0"/><circle cy="-50" r="70" fill="#0a1630"/>
      <g data-k="gear"><path d="${gearD(0, 0, 60, 46, 10)}" fill="#ff8a1f"/><circle r="18" fill="#0a1630"/></g>
      <g transform="translate(0 -210)">${warnSign(ICON.rotate.replace(/stroke="#fff"/g, 'stroke="#1a1a1a"'), 40)}</g></g>`);
    c.mr = refs(c.mach);
    // crane
    c.crane = layer(svg, `<rect x="0" y="500" width="1080" height="40" fill="url(#hazard)" opacity="0.85"/><rect x="0" y="536" width="1080" height="10" fill="#1d3b72"/>
      <g data-k="trolley"><rect x="-60" y="540" width="120" height="44" rx="6" fill="#ffb21f"/><line data-k="cab" x1="0" y1="584" x2="0" y2="800" stroke="#c9d3e0" stroke-width="5"/>
        <g data-k="load"><path d="M0 800 L-50 840 M0 800 L50 840" stroke="#c9d3e0" stroke-width="4"/><path d="M-10 790 Q0 780 10 790 L4 806 L-4 806Z" fill="#ffd23f"/>
        <rect x="-80" y="840" width="160" height="110" fill="#b97a3c"/><rect x="-80" y="840" width="160" height="14" fill="#d29653"/><path d="M-80 895 H80 M0 840 V950" stroke="#8a5523" stroke-width="4"/></g></g>`);
    c.cr = refs(c.crane);
    c.dz = layer(svg, `<ellipse data-k="e" cx="0" cy="1130" rx="150" ry="34" fill="#e8262b" opacity="0.35" stroke="#ff3b3b" stroke-width="5" stroke-dasharray="16 10"/>`);
    // forklift
    c.fg = layer(svg, ''); c.fl = svgFrag(forkliftSVG('fk')); c.fg.appendChild(c.fl); c.fr = refs(c.fl);
    // walker
    c.wkg = layer(svg, ''); c.wk = new Walker(c.wkg, 'mvw');
    c.H = header(root, '16', 'Аумақта<br><span class="o">қауіпсіз жүру</span>', null, { chip: 'ҚОЗҒАЛЫС' });
    const signs = [['walk', 'Жаяу жүргінші жолы', '#1a6b46', 'v1'], ['alert', 'Жүк астында тұрма!', '#c9161c', 'v2'], ['noEntry', 'Қауіпті аймаққа кірме!', '#c9161c', 'v3']];
    c.signs = signs.map(([ic, tx, col, cue], i) => {
      const el = html(`<div class="abs" style="left:${40 + i * 340}px;top:1420px;width:320px;padding:14px;border-radius:22px;display:flex;gap:12px;align-items:center;background:${col};border:3px solid #ffd23f;font-weight:800;font-size:25px;line-height:1.15">
        <svg width="56" height="56" viewBox="-50 -50 100 100" style="flex:none">${ICON[ic]}</svg>${tx}</div>`);
      root.appendChild(el); return { el, cue };
    });
    c.signs.forEach((s, i) => { s.el.style.left = '40px'; s.el.style.width = '360px'; s.el.style.top = (530 + i * 96) + 'px'; s.el.style.zIndex = 2; });
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const v1 = info.cue('v1'), v2 = info.cue('v2'), v3 = info.cue('v3');
    // crane trolley travel & load sway
    const tx = 620 + 160 * Math.sin(lt * 0.35);
    const sway = 4 * Math.sin(lt * 1.4);
    T(c.cr.trolley, tx, 0, 1);
    T(c.cr.load, 0, 0, 1, 0); c.cr.load.setAttribute('transform', `rotate(${sway.toFixed(2)} 0 584)`); c.cr.cab.setAttribute('transform', `rotate(${sway.toFixed(2)} 0 584)`);
    T(c.dz, tx, 0, 1, 0, ep(lt, v2, 0.4) * (0.6 + 0.4 * pulse(lt, 1.4)));
    T(c.mr.gear, 0, -50, 1, lt * 120);
    // forklift drives right -> left on the road, loops
    const fx = 1350 - ((lt * 220 + 300) % 1900);
    T(c.fl, fx, 1150, 0.55);
    T(c.fr.fkwh0, 0, 0, 1, -lt * 400); T(c.fr.fkwh1, 0, 0, 1, -lt * 400); O(c.fr.fkbeac, pulse(lt, 1.6));
    // pedestrian: walks on walkway, pauses during v2, stops before restricted area at v3
    let x;
    const walkRate = 140;
    const p1 = Math.min(lt, v2 + 0.5) * walkRate;
    const paused = lt > v2 + 0.5 && lt < v2 + 3.0;
    const p2 = Math.max(0, lt - (v2 + 3.0)) * walkRate;
    x = 80 + ((p1 + p2) % 1000);
    c.wk.set({ x, y: 1316, s: 0.4, phase: lt * 1.5, amp: paused ? 0 : 1, tilt: paused ? -10 : 0 });
    const zoneOn = ep(lt, v3, 0.4);
    T(c.zr.ns, 0, -110 - (1 - ep(lt, v3, 0.5, E.outBack)) * 40, 0.6 + 0.4 * ep(lt, v3, 0.5, E.outBack) + 0.05 * pulse(lt, 2) * zoneOn, 0, 0.5 + 0.5 * zoneOn);
    c.signs.forEach(s => popIn(s.el, lt, info.cue(s.cue) - 0.1, { dx: -60, dy: 0, s0: 0.8 }));
  },
};

// ======================= 16. CHECKLIST =======================
const CHECK = [
  ['ЖҰМЫСҚА ДЕЙІН', '#2f86ff', ['Жеке қорғаныс құралдары (СИЗ)', 'Наряд-рұқсат', 'Жұмыс орнын тексеру', 'Жеткілікті жарық', 'Құралдарды тексеру', 'Жабдықтың күйі', 'Қысым мен температура', 'Қорғаныш қоршаулары']],
  ['ЖҰМЫС КЕЗІНДЕ', '#ff8a1f', ['Бекітілген тәртіпті сақтау', 'Қысым мен температураны бақылау', 'Ағуды тексеру', 'Діріл мен шуды бақылау', 'Қауіпсіз жарықты сақтау', 'Қорғаныс құралдарын қолдану', 'Ақаулар туралы хабарлау']],
  ['ЖҰМЫСТАН КЕЙІН', '#2ecc71', ['Аяқталғаны туралы хабарлау', 'Құралдарды жинау', 'Жұмыс орнын тазалау', 'Қоршауларды орнына қою', 'Құжаттарды толтыру', 'Келесі ауысымға ақпарат беру']],
];
SCENES.checklist = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/><rect width="1080" height="1920" fill="url(#gridS)"/>`);
    const c = {};
    c.H = header(root, '18', 'Қауіпсіздік<br><span class="o">чек-парағы</span>', null, { chip: 'ЧЕК-ПАРАҚ' });
    c.tabs = CHECK.map(([t, col], i) => {
      const el = html(`<div class="abs" style="left:${60 + i * 325}px;top:470px;width:305px;padding:14px 6px;border-radius:20px;text-align:center;font-weight:900;font-size:25px;border:3px solid ${col};background:rgba(10,22,48,.9)">${i + 1}. ${t}</div>`);
      root.appendChild(el); return el;
    });
    c.cards = CHECK.map(([t, col, items], i) => {
      const el = html(`<div class="card" style="left:60px;right:60px;top:570px;padding:22px 30px;border-color:${col}">
        ${items.map((it, j) => `<div style="display:flex;align-items:center;gap:20px;height:${items.length > 7 ? 86 : 96}px;border-bottom:${j < items.length - 1 ? '2px solid rgba(255,255,255,.08)' : 'none'}">
          <div data-k="b${j}" style="flex:none;width:58px;height:58px;border-radius:16px;border:4px solid rgba(255,255,255,.45);display:grid;place-items:center">
            <svg width="44" height="44" viewBox="-50 -50 100 100"><path data-k="c${j}" pathLength="1" d="M-30 0 L-8 22 L32 -22" stroke="${col}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <div data-k="t${j}" style="font-weight:800;font-size:34px">${it}</div></div>`).join('')}</div>`);
      root.appendChild(el); return { el, r: refs(el), n: items.length, col };
    });
    // intro: three phases
    c.phases = html(`<div class="abs" style="left:60px;right:60px;top:700px;display:flex;justify-content:space-between;align-items:center">
      ${[['list', 'Дайындық', '#2f86ff'], ['eye', 'Бақылау', '#ff8a1f'], ['check', 'Аяқтау', '#2ecc71']].map(([ic, t, col], i) => `${i ? '<div data-k="ar' + i + '" style="font-size:60px;color:#ffd23f;font-weight:900">→</div>' : ''}
        <div data-k="ph${i}" style="text-align:center;width:250px"><div style="width:170px;height:170px;margin:0 auto;border-radius:44px;display:grid;place-items:center;background:${col};box-shadow:0 16px 40px rgba(0,0,0,.4)"><svg width="110" height="110" viewBox="-50 -50 100 100">${ICON[ic]}</svg></div>
        <div style="font-weight:900;font-size:36px;margin-top:16px">${t}</div></div>`).join('')}</div>`);
    root.appendChild(c.phases); c.pr = refs(c.phases);
    c.done = html(`<div class="abs" style="left:110px;right:110px;top:760px;padding:40px;border-radius:40px;text-align:center;background:linear-gradient(160deg,#1a8a52,#0c4a2c);border:5px solid #b8ffd0;box-shadow:0 30px 80px rgba(0,0,0,.6)">
      <svg width="150" height="150" viewBox="-50 -50 100 100">${ICON.shield}</svg>
      <div style="font-weight:900;font-size:48px;line-height:1.1;margin-top:14px">8/8 · 7/7 · 6/6</div><div style="font-weight:900;font-size:44px;color:#d8ffe6;margin-top:10px">ҚАУІПСІЗДІК —<br>МІНДЕТТІ!</div></div>`);
    root.appendChild(c.done);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    const segs = ['c1', 'c2', 'c3'].map(k => info.segs.find(s => s.cue === k)), c4 = info.cue('c4');
    const pw = ['дайындық', 'бақылау', 'аяқтау'].map((p, i) => info.word(0, p, 1 + i * 1.5));
    c.pr && [0, 1, 2].forEach(i => popIn(c.pr['ph' + i], lt, pw[i] - 0.1, { dy: 40, s0: 0.5 }));
    [1, 2].forEach(i => O(c.pr['ar' + i], ep(lt, pw[i] - 0.3, 0.3)));
    O(c.phases, 1 - ep(lt, segs[0].s - 0.4, 0.3));
    c.tabs.forEach((el, i) => {
      popIn(el, lt, segs[0].s - 0.3 + i * 0.1, { dy: -20, s0: 0.9 });
      const act = lt >= segs[i].s - 0.3 && (i === 2 || lt < segs[i + 1].s - 0.3) && lt < c4 - 0.3;
      el.style.background = act ? CHECK[i][1] : 'rgba(10,22,48,.9)';
      el.style.color = act && i !== 1 ? '#fff' : act ? '#1a0d00' : '#fff';
    });
    c.cards.forEach((cd, i) => {
      const s = segs[i], a = s.s - 0.3, b = i < 2 ? segs[i + 1].s - 0.3 : c4 - 0.3;
      const kin = ep(lt, a, 0.5, E.outCubic), kout = ep(lt, b, 0.4, E.inCubic);
      T(cd.el, (1 - kin) * 900 - kout * 900, 0, 1, 0, kin * (1 - kout));
      for (let j = 0; j < cd.n; j++) {
        const tj = s.s + (j + 0.7) / cd.n * (s.e - s.s);
        const k = ep(lt, tj, 0.3);
        draw(cd.r['c' + j], k);
        cd.r['b' + j].style.borderColor = k > 0 ? cd.col : 'rgba(255,255,255,.45)';
        cd.r['t' + j].style.opacity = lt > tj - 0.6 ? 1 : 0.55;
      }
    });
    popIn(c.done, lt, c4 - 0.1, { dy: 50, s0: 0.7 });
  },
};

// ======================= 17. QUIZ =======================
const QUIZ = [
  ['Жарық жеткіліксіз болса не істеу керек?', ['Жұмысты жалғастыру', 'Жұмысты тоқтатып, ауысым басшысына хабарлау', 'Телефон жарығымен жұмыс істеу'], 1],
  ['Құбырдан бу шығып жатса не істейсің?', ['Қауіпті аймақтан шығып, басшыға дереу хабарлау', 'Ағып жатқан жерді қолмен жабу', 'Назар аудармай жұмысты жалғастыру'], 0],
  ['Жарамсыз инструментті қолдануға бола ма?', ['Иә, абайлап қолдануға болады', 'Иә, басқа құрал болмаса', 'Жоқ, қолдануға болмайды'], 2],
  ['Кәсіпорын аумағында қай жермен жүру керек?', ['Ең қысқа жолмен', 'Белгіленген жаяу жүргінші жолымен', 'Көлік жүретін жолмен'], 1],
  ['Қысым астындағы құбырды өз бетіңше ашуға бола ма?', ['Иә, жөндеу тез болу үшін', 'Иә, қолғап киген болсаң', 'Жоқ — тек наряд-рұқсатпен, қысым түсірілгеннен кейін'], 2],
];
SCENES.quiz = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#bgNavy)"/>`);
    const c = {};
    bgGlow(svg, 540, 900, 560, 'spot', 1);
    c.dust = new Dust(svg, 30, { a: 0.4, r: 3, speed: 16, seed: 17, color: '#ffd23f' });
    c.H = header(root, '17', 'Білімді<br><span class="o">тексер!</span>', null, { chip: 'ТЕСТ' });
    c.dots = html(`<div class="abs" style="left:60px;right:60px;top:450px;display:flex;gap:14px;justify-content:center">${QUIZ.map((_, i) => `<div data-k="d${i}" style="width:120px;height:14px;border-radius:7px;background:rgba(255,255,255,.2)"></div>`).join('')}</div>`);
    root.appendChild(c.dots); c.dr = refs(c.dots);
    c.qs = QUIZ.map(([q, opts, ok], i) => {
      const el = html(`<div class="abs" style="left:60px;right:60px;top:500px">
        <div class="card" style="position:relative;padding:26px 30px;border-color:#ffd23f">
          <div style="font-weight:800;font-size:26px;color:#ffd23f;letter-spacing:3px">СҰРАҚ ${i + 1} / 5</div>
          <div style="font-weight:900;font-size:44px;line-height:1.15;margin-top:10px">${q}</div></div>
        ${opts.map((o, j) => `<div data-k="o${j}" class="pill" style="position:relative;margin-top:22px;font-size:33px;padding:16px 22px;min-height:120px">
          <div data-k="ic${j}" class="ic" style="width:74px;height:74px;font-weight:900;font-size:38px;color:#fff;background:linear-gradient(140deg,#2f86ff,#1f5fbf)">${'ABC'[j]}</div><div style="flex:1">${o}</div></div>`).join('')}
        <div data-k="tm" class="abs" style="left:50%;margin-left:-60px;top:${(QUIZ[i][1].length) * 142 + 300}px;width:120px;height:120px">
          <svg width="120" height="120" viewBox="-60 -60 120 120"><circle r="50" fill="rgba(10,22,48,.9)" stroke="rgba(255,255,255,.2)" stroke-width="10"/><path data-k="ring" pathLength="1" d="${arcPath(0, 0, 50, -90, 269.9)}" stroke="#ffd23f" stroke-width="10" fill="none" stroke-linecap="round"/>
          <text data-k="num" y="14" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="40" fill="#fff">3</text></svg></div></div>`);
      root.appendChild(el); return { el, r: refs(el), ok };
    });
    c.intro = html(`<div class="abs" style="left:0;right:0;top:700px;text-align:center"><div style="display:inline-grid;place-items:center;width:300px;height:300px;border-radius:80px;background:linear-gradient(140deg,#ff8a1f,#e0600a);box-shadow:0 30px 80px rgba(0,0,0,.5)">
      <svg width="200" height="200" viewBox="-50 -50 100 100">${ICON.quiz}</svg></div><div style="font-weight:900;font-size:60px;margin-top:30px">5 СҰРАҚ</div></div>`);
    root.appendChild(c.intro);
    return c;
  },
  update(c, lt, info) {
    animHeader(c.H, lt);
    c.dust.update(lt);
    const q = QUIZ.map((_, i) => info.segs.find(s => s.cue === 'q' + (i + 1)));
    const a = QUIZ.map((_, i) => info.cue('a' + (i + 1)));
    popIn(c.intro, lt, 0.4, { dy: 40, s0: 0.5, out: q[0].s - 0.4 });
    O(c.dots, ep(lt, q[0].s - 0.4, 0.3));
    c.qs.forEach((Q, i) => {
      const start = q[i].s - 0.3, end = i < 4 ? q[i + 1].s - 0.35 : info.dur + 1;
      const kin = ep(lt, start, 0.5, E.outCubic), kout = ep(lt, end, 0.35, E.inCubic);
      T(Q.el, (1 - kin) * 900 - kout * 900, 0, 1, 0, kin * (1 - kout));
      c.dr['d' + i].style.background = lt >= a[i] ? '#2ecc71' : lt >= start ? '#ffd23f' : 'rgba(255,255,255,.2)';
      const rev = ep(lt, a[i] - 0.05, 0.35);
      for (let j = 0; j < 3; j++) {
        const o = Q.r['o' + j], ic = Q.r['ic' + j];
        popIn(o, lt, start + 0.4 + j * 0.15, { dx: 80, dy: 0, s0: 1 });
        if (rev > 0) {
          const good = j === Q.ok;
          o.style.borderColor = good ? '#2ecc71' : '#ff4d4d';
          o.style.background = good ? 'linear-gradient(120deg,rgba(26,138,82,.95),rgba(12,74,44,.95))' : 'linear-gradient(120deg,rgba(90,14,20,.9),rgba(40,8,12,.9))';
          if (good) o.style.transform += ` scale(${lerp(1, 1.04, ep(lt, a[i], 0.3, E.outBack))})`;
          else o.style.opacity = 0.7;
          if (!ic.dataset.done) {
            ic.dataset.done = 1;
            ic.style.background = good ? '#2ecc71' : '#e8262b';
            ic.innerHTML = good ? `<svg width="50" height="50" viewBox="-50 -50 100 100">${ICON.check}</svg>` : `<svg width="54" height="54" viewBox="-50 -50 100 100">${ICON.alert.replace('fill="#fff"', 'fill="#ffd23f"').replace(/#e0600a/g, '#1a1a1a')}</svg>`;
          }
        } else if (ic.dataset.done) {
          delete ic.dataset.done; ic.style.background = 'linear-gradient(140deg,#2f86ff,#1f5fbf)'; ic.textContent = 'ABC'[j]; o.style.borderColor = 'rgba(99,179,255,0.35)'; o.style.background = '';
        }
      }
      // countdown between question and answer
      const t0 = q[i].e, t1 = a[i];
      const cd = clamp((lt - t0) / Math.max(0.1, t1 - t0));
      O(Q.r.tm, env(lt, t0 - 0.2, t1 + 0.1, 0.2, 0.2));
      draw(Q.r.ring, 1 - cd);
      Q.r.num.textContent = String(Math.max(1, Math.ceil(3 * (1 - cd))));
    });
  },
};

// ======================= FINAL (boiler room) =======================
SCENES.final2 = {
  build(root, info) {
    const svg = stage(root);
    const c = {};
    c.room = new BoilerRoom(svg, 'f2r');
    layer(svg, `<rect x="0" y="1240" width="1080" height="680" fill="url(#glowB)" opacity="0.15"/>`);
    c.sh = layer(svg, [...Array(5)].map((_, i) => `<path d="M${200 + i * 170} 1300 l12 -24 l12 24 l-12 24z" fill="#fff" opacity="0"/>`).join(''));
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'f2w');
    c.ok = html(`<div class="abs" style="left:220px;width:640px;top:560px;padding:12px 0;border-radius:40px;background:rgba(46,204,113,.2);border:3px solid #2ecc71;text-align:center;font-weight:800;font-size:28px;color:#d8ffe6;white-space:nowrap">● ҚАЗАНДЫҚ ЦЕХІ ҚАЛЫПТЫ ЖҰМЫС ІСТЕУДЕ</div>`);
    root.appendChild(c.ok);
    c.t0 = html(`<div class="abs" style="left:50px;right:50px;top:160px;text-align:center;padding:22px;border-radius:30px;background:rgba(6,13,32,.78)"><div style="font-weight:900;font-size:56px;line-height:1.1">НАҒЫЗ МАМАН —<br><span style="color:#ff8a1f">ҚАУІПСІЗДІКТІ САҚТАЙДЫ</span></div></div>`);
    root.appendChild(c.t0);
    c.duty = html(`<div class="abs" style="left:0;right:0;top:640px;display:flex;gap:24px;justify-content:center">
      <div class="card" style="position:relative;padding:14px 34px;font-weight:900;font-size:56px;border-color:#ff8a1f">ПТЭ</div><div style="font-weight:900;font-size:56px;color:#ffd23f;align-self:center">+</div>
      <div class="card" style="position:relative;padding:14px 44px;font-weight:900;font-size:56px;border-color:#ff8a1f">ТБ</div></div>`);
    root.appendChild(c.duty);
    c.title = html(`<div class="abs" style="left:40px;right:40px;top:170px;text-align:center;padding:30px 20px;border-radius:36px;background:rgba(6,13,32,.75);border:4px solid #ffd23f">
      <div style="font-weight:900;font-size:84px;line-height:1.02;color:#ffd23f">ҚАУІПСІЗДІК</div><div style="font-weight:900;font-size:64px;line-height:1.08;margin-top:10px">ӨЗІҢНЕН<br>БАСТАЛАДЫ!</div></div>`);
    root.appendChild(c.title);
    c.end = html(`<div class="abs" style="left:60px;right:60px;top:1420px;text-align:center">
      <div style="display:inline-flex;gap:14px;align-items:center;font-weight:900;font-size:44px;letter-spacing:6px"><i style="width:22px;height:22px;border-radius:50%;background:#ff8a1f;display:block"></i>ПТЭ · ТБ</div>
      <div style="font-weight:800;font-size:40px;margin-top:16px;line-height:1.2">Қауіпсіз жұмыс —<br><span style="color:#ff8a1f">баршамызға ортақ міндет!</span></div></div>`);
    root.appendChild(c.end);
    c.black = html(`<div class="abs" style="inset:0;background:#040915;z-index:50"></div>`); root.appendChild(c.black);
    return c;
  },
  update(c, lt, info) {
    c.room.update(lt);
    const duty = info.cue('duty'), sl = info.cue('slogan');
    const thumbs = ep(lt, sl, 0.5, E.outBack);
    c.w.set({ x: 540, y: 1420 + (1 - ep(lt, 0.3, 0.8, E.outBack)) * 60, s: 1.0, o: ep(lt, 0.3, 0.4), blink: blinkAt(lt), tilt: Math.sin(lt * 0.8) * 2,
      aL: [lerp(28, 20, thumbs), lerp(-70, -150, thumbs)], aR: [lerp(-28, -20, thumbs), lerp(70, 150, thumbs)], thumbL: thumbs > 0.5, thumbR: thumbs > 0.5 });
    [...c.sh.children].forEach((s, i) => O(s, 0.8 * Math.pow(pulse(lt * 0.6 + i * 0.27, 0.5), 8)));
    popIn(c.ok, lt, 1.2, { dy: 20, s0: 0.8 });
    popIn(c.t0, lt, 0.5, { dy: 50, s0: 0.9, out: sl - 0.3 });
    popIn(c.duty, lt, duty - 0.1, { dy: 40, s0: 0.6, out: sl - 0.3 });
    const k = ep(lt, sl - 0.1, 0.6, E.outBack);
    T(c.title, 0, 0, lerp(1.5, 1, k), 0, ep(lt, sl - 0.1, 0.25));
    popIn(c.end, lt, info.segs[info.segs.length - 1].e + 0.4, { dy: 40 });
    O(c.black, ep(lt, info.dur - 0.9, 0.8, E.inOutSine));
  },
};
