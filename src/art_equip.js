// Ten animated CHP equipment cutaways. Each builder fills group g (drawn around 0,0, ~±330 x ±280)
// and returns update(t) where t is local seconds.

// particles moving along an svg path
class Flow {
  constructor(parent, path, n, o = {}) {
    this.p = path; this.L = path.getTotalLength(); this.o = Object.assign({ r: 7, color: '#7cc4ff', speed: 0.25, color2: null }, o);
    this.els = [...Array(n)].map(() => { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('r', this.o.r); c.setAttribute('fill', this.o.color); parent.appendChild(c); return c; });
  }
  update(t, a = 1) {
    const n = this.els.length;
    this.els.forEach((c, i) => {
      const u = ((t * this.o.speed + i / n) % 1 + 1) % 1;
      const pt = this.p.getPointAtLength(u * this.L);
      c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1));
      if (this.o.color2) c.setAttribute('fill', mixColor(this.o.color, this.o.color2, u));
      c.setAttribute('opacity', (a * Math.min(1, Math.sin(Math.PI * u) * 3)).toFixed(2));
    });
  }
}
function mixColor(a, b, k) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, '0')).join('');
}
function arrow(x, y, ang, col = '#fff', s = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})"><path d="M-22 -9 L4 -9 L4 -20 L26 0 L4 20 L4 9 L-22 9Z" fill="${col}"/></g>`;
}
function lbl(x, y, txt, col = '#fff', size = 30) {
  return `<g transform="translate(${x} ${y})"><rect x="${-txt.length * size * 0.33 - 14}" y="${-size * 0.85}" width="${txt.length * size * 0.66 + 28}" height="${size * 1.35}" rx="${size * 0.5}" fill="#081329" opacity="0.8" stroke="${col}" stroke-width="2.5"/>
    <text x="0" y="${size * 0.22}" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="${size}" fill="${col}">${txt}</text></g>`;
}

const EQUIP = [];

// 1. Boiler
EQUIP.push({ name: 'ҚАЗАНДЫҚ', desc: 'Бу өндіреді', build(g) {
  g.innerHTML = `
    <rect x="-190" y="-230" width="380" height="490" rx="18" fill="url(#tankV)"/>
    <rect x="-150" y="-190" width="300" height="420" rx="10" fill="#0a1630"/>
    <rect x="-150" y="-190" width="300" height="420" rx="10" fill="url(#glowO)" opacity="0.35" data-k="heat"/>
    ${[...Array(8)].map((_, i) => `<rect x="${-140 + i * 38}" y="-185" width="14" height="300" rx="7" fill="url(#pipeBV)"/>`).join('')}
    <g data-k="flames">${[...Array(6)].map((_, i) => `<path data-k="fl${i}" d="M${-125 + i * 50} 225 Q${-150 + i * 50} 160 ${-125 + i * 50} 90 Q${-100 + i * 50} 160 ${-75 + i * 50} 225Z" fill="url(#flame)"/>`).join('')}</g>
    <g data-k="bub"></g>
    <rect x="-230" y="-300" width="460" height="96" rx="48" fill="url(#tankH)"/>
    <rect x="-200" y="-262" width="400" height="40" rx="20" fill="#5ab4ff" opacity="0.35"/>
    <rect x="200" y="-290" width="150" height="40" rx="10" fill="url(#pipeO)"/>
    <rect x="-200" y="240" width="400" height="30" rx="8" fill="#13264a"/>
    ${lbl(272, -330, 'БУ', '#ffb347')}
    ${lbl(0, 300, 'ОТЫН + АУА → ЖАЛЫН', '#ffb347', 26)}`;
  const r = refs(g);
  const bub = [...Array(16)].map((_, i) => { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('r', 5 + (i % 3) * 2); c.setAttribute('fill', '#cfe8ff'); r.bub.appendChild(c); return c; });
  const steam = new Puffs(g, 14, { x: 350, y: -270, life: 1.6, rise: 0, dirX: 1, wind: 0, r0: 14, r1: 60, a: 0.7, spread: 10, seed: 31 });
  steam.o.rise = 140; steam.o.dirY = -0.2;
  return t => {
    for (let i = 0; i < 6; i++) T(r['fl' + i], 0, 225 * (1 - (0.75 + 0.25 * Math.sin(t * 9 + i * 2))), [1, 0.75 + 0.25 * Math.sin(t * 9 + i * 2)]);
    O(r.heat, 0.5 + 0.3 * Math.sin(t * 5));
    bub.forEach((c, i) => { const ph = (t * 0.6 + i / 16) % 1; c.setAttribute('cx', -133 + (i % 8) * 38); c.setAttribute('cy', 110 - ph * 290); c.setAttribute('opacity', Math.sin(Math.PI * ph).toFixed(2)); });
    steam.update(t);
  };
} });

// 2. Turbine
EQUIP.push({ name: 'ТУРБИНА', desc: 'Бу энергиясын механикалық энергияға айналдырады', build(g) {
  g.innerHTML = `
    <path d="M-300 -110 L260 -200 L260 200 L-300 110Z" fill="url(#tankH)"/>
    <path d="M-280 -86 L240 -172 L240 172 L-280 86Z" fill="#0a1630"/>
    <rect x="-340" y="-14" width="720" height="28" rx="10" fill="url(#steelH)"/>
    <g data-k="rows"></g>
    <g data-k="flow"></g>
    <rect x="-380" y="-150" width="110" height="44" rx="10" fill="url(#pipeO)"/>
    <rect x="300" y="-40" width="60" height="80" rx="10" fill="#2a3e5f"/><g data-k="coup"></g>
    ${lbl(-300, -190, 'БУ КІРЕДІ', '#ffb347', 26)}
    ${lbl(250, 250, 'АЙНАЛУ', '#7cc4ff', 26)}`;
  const r = refs(g);
  const rows = [];
  for (let k = 0; k < 9; k++) {
    const x = -240 + k * 56, h = 70 + k * 11;
    const blades = [...Array(7)].map(() => { const b = document.createElementNS(SVGNS, 'rect'); b.setAttribute('x', x - 8); b.setAttribute('width', 16); b.setAttribute('rx', 4); b.setAttribute('fill', k % 2 ? '#9db6d6' : '#5f7da6'); r.rows.appendChild(b); return b; });
    rows.push({ h, blades });
  }
  const flow = new Puffs(r.flow, 18, { x: -260, y: 0, life: 1.4, rise: 520, dirX: 1, wind: 0, r0: 10, r1: 34, a: 0.5, spread: 140, seed: 33 });
  return t => {
    rows.forEach(({ h, blades }, k) => blades.forEach((b, i) => {
      const ph = ((t * 2.2 + i / 7 + k * 0.05) % 1) * Math.PI; // 0..pi around the drum
      const y = -Math.cos(ph) * h, hh = Math.max(4, Math.sin(ph) * 26);
      b.setAttribute('y', (y - hh / 2).toFixed(1)); b.setAttribute('height', hh.toFixed(1)); b.setAttribute('opacity', (0.35 + 0.65 * Math.sin(ph)).toFixed(2));
    }));
    flow.update(t);
    r.coup.innerHTML = [0, 1, 2].map(i => { const y = -32 + ((t * 120 + i * 22) % 64); return `<rect x="304" y="${y.toFixed(1)}" width="52" height="8" fill="#ff8a1f" opacity="0.8"/>`; }).join('');
  };
} });

// 3. Generator
EQUIP.push({ name: 'ГЕНЕРАТОР', desc: 'Электр энергиясын өндіреді', build(g) {
  g.innerHTML = `
    <rect x="-320" y="-12" width="90" height="24" rx="8" fill="url(#steelH)"/>
    <rect x="-250" y="-170" width="430" height="340" rx="60" fill="url(#tankH)"/>
    <rect x="-220" y="-140" width="370" height="280" rx="40" fill="#0a1630"/>
    ${[...Array(9)].map((_, i) => `<rect x="${-205 + i * 40}" y="-132" width="26" height="40" rx="6" fill="#d9822b"/><rect x="${-205 + i * 40}" y="92" width="26" height="40" rx="6" fill="#d9822b"/>`).join('')}
    <rect x="-200" y="-80" width="330" height="160" rx="30" fill="url(#steelH)"/>
    <g data-k="rot"></g>
    <rect x="-260" y="150" width="460" height="40" rx="10" fill="#13264a"/>
    <g transform="translate(250 -40)"><g data-k="bolt"><circle r="80" fill="url(#glowY)"/><path d="M8 -52 L-26 6 L-2 6 L-12 52 L26 -10 L2 -10 L14 -52Z" fill="#ffd23f"/></g></g>
    <path data-k="line" d="M250 40 L250 120 L360 120" stroke="#ffd23f" stroke-width="8" fill="none" stroke-linecap="round"/>
    ${lbl(0, -215, 'ЭЛЕКТР ⚡', '#ffd23f', 28)}`;
  const r = refs(g);
  const sp = new Flow(g, r.line, 4, { r: 9, color: '#fff2b0', speed: 1.2 });
  return t => {
    r.rot.innerHTML = [...Array(5)].map((_, i) => { const ph = ((t * 2.5 + i / 5) % 1) * Math.PI; const y = -Math.cos(ph) * 66; return `<rect x="-196" y="${(y - 6).toFixed(1)}" width="322" height="${(Math.sin(ph) * 14 + 2).toFixed(1)}" fill="#0a1630" opacity="${(0.5 * Math.sin(ph)).toFixed(2)}"/>`; }).join('');
    T(r.bolt, 0, 0, 1 + 0.12 * pulse(t, 2.2), 0, 0.75 + 0.25 * pulse(t, 2.2));
    sp.update(t);
  };
} });

// helper: rotating impeller vanes
function vanes(n, r0, r1, curve, w, col) {
  return [...Array(n)].map((_, i) => { const a = i * 360 / n; return `<path d="M${pol(0, 0, r0, a).join(' ')} Q${pol(0, 0, (r0 + r1) / 2, a + curve).join(' ')} ${pol(0, 0, r1, a + curve * 1.6).join(' ')}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`; }).join('');
}

// 4. Pump
EQUIP.push({ name: 'НАСОС', desc: 'Сұйықтықты айдайды', build(g) {
  g.innerHTML = `
    <rect x="-360" y="-34" width="230" height="68" fill="url(#pipeB)"/>
    <rect x="70" y="-300" width="76" height="200" fill="url(#pipeBV)"/>
    <path d="M0 -175 A175 175 0 1 1 -175 0 L-150 0 A150 150 0 0 0 0 150 A150 150 0 0 0 150 0 Q150 -100 70 -140 L146 -140 L146 -110 Q190 -60 175 0" fill="url(#steelV)"/>
    <circle r="168" fill="url(#tankV)"/><circle r="140" fill="#0a1630"/>
    <path d="M70 -175 L146 -175 L146 -110 Q150 -150 70 -175Z" fill="url(#tankV)"/>
    <g data-k="imp"><circle r="38" fill="#5f7da6"/>${vanes(6, 34, 128, 40, 16, '#9db6d6')}<circle r="16" fill="#ff8a1f"/></g>
    <path data-k="fp" d="M-360 0 L-40 0 Q60 40 110 -40 L110 -300" fill="none" stroke="none"/>
    <rect x="200" y="-90" width="160" height="180" rx="20" fill="#1f5fbf"/><rect x="170" y="-20" width="40" height="40" fill="#5f7da6"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${214 + i * 28}" y="-80" width="10" height="160" rx="5" fill="#174a99"/>`).join('')}
    ${lbl(280, 130, 'ҚОЗҒАЛТҚЫШ', '#7cc4ff', 22)}
    ${lbl(-250, -80, 'КІРІС', '#7cc4ff', 26)}${lbl(108, -340, 'ШЫҒЫС', '#7cc4ff', 26)}`;
  const r = refs(g);
  const fl = new Flow(g, r.fp, 22, { r: 9, color: '#9fd2ff', speed: 0.55 });
  return t => { T(r.imp, 0, 0, 1, t * 400); fl.update(t); };
} });

// 5. Induced draft fan (dymosos)
EQUIP.push({ name: 'ДЫМОСОС', desc: 'Түтін газдарын сорып шығарады', build(g) {
  g.innerHTML = `
    <rect x="-380" y="-60" width="260" height="120" fill="#3a4250"/><rect x="-380" y="-60" width="260" height="12" fill="#4b5566"/>
    <rect x="130" y="-330" width="110" height="200" fill="#3a4250"/>
    <path d="M150 -330 L170 -380 L210 -380 L230 -330Z" fill="#4b5566"/>
    <circle r="180" fill="#4b5566"/><circle r="160" fill="#20252e"/>
    <g data-k="imp"><circle r="44" fill="#6b7686"/>${[...Array(10)].map((_, i) => `<rect x="44" y="-9" width="104" height="18" rx="4" fill="#9aa5b5" transform="rotate(${i * 36})"/>`).join('')}<circle r="18" fill="#ff8a1f"/></g>
    <g data-k="sm"></g>
    ${lbl(-250, -110, 'ТҮТІН ГАЗДАРЫ', '#c2c9d4', 24)}${lbl(330, -280, 'МҰРЖАҒА ↑', '#c2c9d4', 24)}`;
  const r = refs(g);
  const inS = new Puffs(r.sm, 14, { x: -380, y: 0, life: 1.6, rise: 260, dirX: 1, wind: 0, r0: 18, r1: 40, a: 0.8, fill: 'url(#smoke)', spread: 60, seed: 35 });
  const outS = new Puffs(g, 14, { x: 185, y: -380, life: 2.2, rise: 120, wind: 70, r0: 20, r1: 80, a: 0.8, fill: 'url(#smoke)', spread: 40, seed: 36 });
  return t => { T(r.imp, 0, 0, 1, t * 330); inS.update(t); outS.update(t); };
} });

// 6. Fan (blower)
EQUIP.push({ name: 'ЖЕЛДЕТКІШ', desc: 'Ауа береді', build(g) {
  g.innerHTML = `
    <g data-k="air"></g>
    <circle r="230" fill="url(#steelV)"/><circle r="206" fill="#0a1630"/>
    <circle r="206" fill="url(#glowB)" opacity="0.4"/>
    <g data-k="blur" opacity="0.35"></g>
    <g data-k="imp">${[...Array(5)].map((_, i) => `<path d="M0 0 Q60 -60 40 -190 Q-10 -200 -30 -150 Q-30 -60 0 0Z" fill="#9db6d6" transform="rotate(${i * 72})"/>`).join('')}</g>
    <circle r="44" fill="#ff8a1f"/><circle r="18" fill="#fff"/>
    <path d="M-206 0 L206 0 M0 -206 L0 206" stroke="#2a3e5f" stroke-width="5" opacity="0.6"/>
    ${lbl(0, 280, 'АУА →', '#9fd2ff', 28)}`;
  const r = refs(g);
  r.blur.innerHTML = [1, 2].map(k => `<g data-k="b${k}">${[...Array(5)].map((_, i) => `<path d="M0 0 Q60 -60 40 -190 Q-10 -200 -30 -150 Q-30 -60 0 0Z" fill="#9db6d6" transform="rotate(${i * 72})"/>`).join('')}</g>`).join('');
  const rb = refs(r.blur);
  const streaks = [...Array(12)].map(() => { const l = document.createElementNS(SVGNS, 'path'); l.setAttribute('stroke', '#bfe3ff'); l.setAttribute('stroke-width', 6); l.setAttribute('stroke-linecap', 'round'); l.setAttribute('fill', 'none'); r.air.appendChild(l); return l; });
  return t => {
    const a = t * 520; T(r.imp, 0, 0, 1, a); T(rb.b1, 0, 0, 1, a - 12); T(rb.b2, 0, 0, 1, a - 24);
    streaks.forEach((l, i) => { const ph = (t * 0.9 + i / 12) % 1; const y = -200 + (i % 6) * 80; const x = 120 + ph * 260; l.setAttribute('d', `M${x.toFixed(0)} ${y} q40 ${i % 2 ? 14 : -14} 90 0`); l.setAttribute('opacity', (Math.sin(Math.PI * ph) * 0.8).toFixed(2)); });
  };
} });

// 7. Deaerator
EQUIP.push({ name: 'ДЕАЭРАТОР', desc: 'Судан еріген газдарды шығарады', build(g) {
  g.innerHTML = `
    <rect x="-300" y="40" width="600" height="200" rx="100" fill="url(#tankH)"/>
    <rect x="-270" y="66" width="540" height="150" rx="75" fill="#0a1630"/>
    <path data-k="wl" d="" fill="url(#water)"/>
    <rect x="-80" y="-280" width="160" height="350" rx="30" fill="url(#tankV)"/>
    <rect x="-60" y="-260" width="120" height="320" rx="18" fill="#0a1630"/>
    ${[...Array(5)].map((_, i) => `<rect x="${i % 2 ? -56 : -20}" y="${-220 + i * 56}" width="76" height="10" rx="4" fill="#7f9cc4"/>`).join('')}
    <g data-k="drops"></g>
    <rect x="-14" y="-330" width="28" height="56" fill="url(#steelV)"/>
    <rect x="-210" y="-210" width="130" height="32" rx="10" fill="url(#pipeB)"/>
    <rect x="80" y="20" width="160" height="30" rx="10" fill="url(#pipeO)"/>
    <g data-k="gas"></g>
    ${lbl(-200, -250, 'СУ', '#7cc4ff', 26)}${lbl(220, -10, 'БУ', '#ffb347', 26)}`;
  const r = refs(g);
  const drops = [...Array(14)].map(() => { const c = document.createElementNS(SVGNS, 'ellipse'); c.setAttribute('rx', 5); c.setAttribute('ry', 8); c.setAttribute('fill', '#7cc4ff'); r.drops.appendChild(c); return c; });
  const gas = [...Array(6)].map((_, i) => { const e = svgFrag(`<g><circle r="26" fill="#ffffff" opacity="0.15" stroke="#fff" stroke-width="3"/><text y="9" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="22" fill="#fff">${i % 2 ? 'CO₂' : 'O₂'}</text></g>`); r.gas.appendChild(e); return e; });
  return t => {
    drops.forEach((c, i) => { const ph = (t * 0.8 + i / 14) % 1; c.setAttribute('cx', (-45 + (i % 5) * 22).toFixed(0)); c.setAttribute('cy', (-240 + ph * 330).toFixed(0)); c.setAttribute('opacity', Math.sin(Math.PI * ph).toFixed(2)); });
    let d = 'M-262 140 '; for (let x = -262; x <= 262; x += 26) d += `L${x} ${(140 + Math.sin(x / 40 + t * 3) * 6).toFixed(1)} `;
    r.wl.setAttribute('d', d + 'L262 200 Q262 214 240 214 L-240 214 Q-262 214 -262 200Z');
    gas.forEach((e, i) => { const ph = (t * 0.45 + i / 6) % 1; T(e, Math.sin(t * 2 + i) * 30 + (i % 2 ? 60 : -60), -300 - ph * 110, 0.7 + ph * 0.4, 0, Math.sin(Math.PI * ph)); });
  };
} });

// 8. Economizer
EQUIP.push({ name: 'ЭКОНОМАЙЗЕР', desc: 'Қоректік суды қыздырады', build(g) {
  let d = 'M-220 230 ';
  for (let k = 0; k < 7; k++) { const y = 200 - k * 66; d += k % 2 ? `L-170 ${y} Q-200 ${y} -200 ${y - 33} Q-200 ${y - 66} -170 ${y - 66} ` : `L170 ${y} Q200 ${y} 200 ${y - 33} Q200 ${y - 66} 170 ${y - 66} `; }
  d += 'L-260 -262';
  g.innerHTML = `
    <rect x="-240" y="-300" width="480" height="560" rx="16" fill="#2a3e5f"/>
    <rect x="-220" y="-280" width="440" height="520" rx="10" fill="#0a1630"/>
    <g data-k="gasf"></g>
    <path d="${d}" stroke="url(#pipeBV)" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path data-k="coil" d="${d}" stroke="#ff8a1f" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" opacity="0.85"/>
    <path data-k="cp" d="${d}" fill="none"/>
    ${lbl(-290, 290, 'СУЫҚ СУ', '#7cc4ff', 24)}${lbl(-290, -310, 'ЫСТЫҚ СУ', '#ffb347', 24)}${lbl(250, -340, 'ЫСТЫҚ ГАЗ ↓', '#ffb347', 24)}`;
  const r = refs(g);
  const fl = new Flow(g, r.cp, 26, { r: 8, color: '#7cc4ff', color2: '#ff8a1f', speed: 0.25 });
  const gas = [...Array(10)].map(() => { const e = document.createElementNS(SVGNS, 'rect'); e.setAttribute('width', 14); e.setAttribute('height', 80); e.setAttribute('rx', 7); e.setAttribute('fill', '#ff8a1f'); r.gasf.appendChild(e); return e; });
  return t => {
    draw(r.coil, ep(t, 0.2, 2.2, E.inOutCubic));
    fl.update(t);
    gas.forEach((e, i) => { const ph = (t * 0.7 + i / 10) % 1; e.setAttribute('x', -200 + (i * 43) % 400); e.setAttribute('y', (-280 + ph * 440).toFixed(0)); e.setAttribute('opacity', (0.35 * Math.sin(Math.PI * ph)).toFixed(2)); });
  };
} });

// 9. Condenser
EQUIP.push({ name: 'КОНДЕНСАТОР', desc: 'Буды конденсациялайды', build(g) {
  let tubes = '';
  for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) tubes += `<circle cx="${-200 + i * 50 + (r % 2) * 25}" cy="${-40 + r * 40}" r="12" fill="#2f86ff" stroke="#9fd2ff" stroke-width="3"/>`;
  g.innerHTML = `
    <rect x="-100" y="-300" width="200" height="140" fill="url(#tankV)"/>
    <rect x="-300" y="-170" width="600" height="340" rx="80" fill="url(#tankH)"/>
    <rect x="-270" y="-145" width="540" height="290" rx="60" fill="#0a1630"/>
    ${tubes}
    <path data-k="wl" d="" fill="url(#water)"/>
    <g data-k="drops"></g>
    <rect x="-400" y="-10" width="110" height="44" rx="8" fill="url(#pipeB)"/><rect x="290" y="-10" width="110" height="44" rx="8" fill="url(#pipeB)"/>
    <rect x="-30" y="160" width="60" height="110" fill="url(#pipeBV)"/>
    ${arrow(-350, -40, 0, '#7cc4ff', 0.9)}${arrow(350, -40, 0, '#7cc4ff', 0.9)}
    ${lbl(0, -340, 'БУ', '#fff', 26)}${lbl(-330, 90, 'САЛҚЫН СУ', '#7cc4ff', 22)}${lbl(140, 230, 'КОНДЕНСАТ', '#7cc4ff', 22)}`;
  const r = refs(g);
  const steam = new Puffs(g, 16, { x: 0, y: -290, life: 1.6, rise: -220, wind: 0, r0: 20, r1: 46, a: 0.7, spread: 140, seed: 39 });
  const drops = [...Array(16)].map(() => { const c = document.createElementNS(SVGNS, 'ellipse'); c.setAttribute('rx', 5); c.setAttribute('ry', 8); c.setAttribute('fill', '#9fd2ff'); r.drops.appendChild(c); return c; });
  return t => {
    steam.update(t);
    drops.forEach((c, i) => { const ph = (t * 0.9 + i / 16) % 1; c.setAttribute('cx', (-200 + (i * 53) % 400).toFixed(0)); c.setAttribute('cy', (20 + ph * 100).toFixed(0)); c.setAttribute('opacity', Math.sin(Math.PI * ph).toFixed(2)); });
    let d = 'M-262 112 '; for (let x = -262; x <= 262; x += 26) d += `L${x} ${(112 + Math.sin(x / 40 + t * 3) * 4).toFixed(1)} `;
    r.wl.setAttribute('d', d + 'L262 120 Q240 145 200 145 L-200 145 Q-240 145 -262 120Z');
  };
} });

// 10. Pressure gauge
function gaugeSVG(p = 'g', R = 220, opt = {}) {
  let ticks = '';
  for (let i = 0; i <= 40; i++) { const a = 135 + i * 270 / 40, big = i % 5 === 0; const [x0, y0] = pol(0, 0, R * 0.78, a), [x1, y1] = pol(0, 0, R * (big ? 0.66 : 0.72), a);
    ticks += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="#14213d" stroke-width="${big ? 6 : 3}"/>`;
    if (big) { const [tx, ty] = pol(0, 0, R * 0.54, a); ticks += `<text x="${tx.toFixed(1)}" y="${(ty + R * 0.05).toFixed(1)}" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="${R * 0.12}" fill="#14213d">${i / 5 * 2}</text>`; } }
  return `<circle r="${R + 22}" fill="url(#steelV)"/><circle r="${R}" fill="#f4f7fb"/>
    <path d="${arcPath(0, 0, R * 0.84, 135, 135 + 270 * 0.6)}" stroke="#2ecc71" stroke-width="${R * 0.07}" fill="none"/>
    <path d="${arcPath(0, 0, R * 0.84, 135 + 270 * 0.6, 135 + 270 * 0.78)}" stroke="#ffd23f" stroke-width="${R * 0.07}" fill="none"/>
    <path d="${arcPath(0, 0, R * 0.84, 135 + 270 * 0.78, 405)}" stroke="#e8262b" stroke-width="${R * 0.07}" fill="none"/>
    ${ticks}<text y="${R * 0.4}" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="${R * 0.13}" fill="#14213d">${opt.unit || 'МПа'}</text>
    <g data-k="${p}needle"><path d="M-10 0 L0 ${-R * 0.8} L10 0Z" fill="#e8262b" transform="rotate(0)"/></g>
    <circle r="${R * 0.09}" fill="#14213d"/><circle r="${R * 0.04}" fill="#ff8a1f"/>
    <path d="M${-R * 0.7} ${-R * 0.55} Q0 ${-R * 1.05} ${R * 0.7} ${-R * 0.55}" stroke="#fff" stroke-width="${R * 0.05}" opacity="0.5" fill="none"/>`;
}
// value 0..1 → needle rotation (scale 0..16 over 270°, starting at 135°; needle drawn pointing up = -90°)
const needleRot = v => 135 + v * 270 + 90;
EQUIP.push({ name: 'МАНОМЕТР', desc: 'Қысымды өлшейді', build(g) {
  g.innerHTML = `<rect x="-30" y="230" width="60" height="70" fill="url(#steelV)"/><rect x="-200" y="290" width="400" height="44" rx="12" fill="url(#pipeB)"/>
    <g>${gaugeSVG('m', 220)}</g>${lbl(0, -290, 'ҚЫСЫМ', '#ffb347', 28)}`;
  const r = refs(g);
  return t => { const v = 0.48 + 0.08 * Math.sin(t * 1.3) + 0.015 * Math.sin(t * 13); T(r.mneedle, 0, 0, 1, needleRot(lerp(0.05, v, ep(t, 0.2, 1.0, E.outElastic)))); };
} });
