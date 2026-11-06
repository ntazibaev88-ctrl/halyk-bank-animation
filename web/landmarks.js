// Vector illustrations of Astana landmarks.
// Every function draws in local coordinates: x = 0 is the centre, y = 0 is the ground, negative y is up.
// One shared flat style: light from the left, shade on the right, soft gradients, no outlines.
'use strict';

const LM = {};

// Small helpers shared with scenes.js
const H = {
  clamp: (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
  lerp: (a, b, k) => a + (b - a) * k,
  prog: (t, a, b) => H.clamp((t - a) / (b - a)),
  easeOut: (k) => 1 - Math.pow(1 - k, 3),
  easeInOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  back: (k) => { const c = 1.6; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
  rnd: (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; },
  bez: (p0, p1, p2, p3, k) => {
    const m = 1 - k;
    return [m * m * m * p0[0] + 3 * m * m * k * p1[0] + 3 * m * k * k * p2[0] + k * k * k * p3[0],
            m * m * m * p0[1] + 3 * m * m * k * p1[1] + 3 * m * k * k * p2[1] + k * k * k * p3[1]];
  },
  f: (n) => (Math.round(n * 10) / 10).toString(),
};

// Gradients used by landmarks (inserted once into <defs>)
LM.defs = `
<linearGradient id="gWhite" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F1EEE8"/><stop offset="1" stop-color="#C9CED8"/></linearGradient>
<linearGradient id="gWhiteV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE0E8"/></linearGradient>
<radialGradient id="gGold" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4C2"/><stop offset=".35" stop-color="#FFD24A"/><stop offset=".8" stop-color="#E09A12"/><stop offset="1" stop-color="#9C6508"/></radialGradient>
<linearGradient id="gGoldL" x1="0" x2="1"><stop offset="0" stop-color="#FFE38A"/><stop offset=".5" stop-color="#F5B820"/><stop offset="1" stop-color="#B57A0A"/></linearGradient>
<linearGradient id="gBlueDome" x1="0" x2="1"><stop offset="0" stop-color="#8FD0FF"/><stop offset=".45" stop-color="#3D8EE0"/><stop offset="1" stop-color="#1D4F9A"/></linearGradient>
<linearGradient id="gTurqDome" x1="0" x2="1"><stop offset="0" stop-color="#B5ECFF"/><stop offset=".45" stop-color="#3CB4E6"/><stop offset="1" stop-color="#16659E"/></linearGradient>
<linearGradient id="gGlass" x1="0" x2="1"><stop offset="0" stop-color="#9FD8F5"/><stop offset=".5" stop-color="#4A9BD0"/><stop offset="1" stop-color="#1E4F80"/></linearGradient>
<linearGradient id="gGlassV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDEFFF"/><stop offset="1" stop-color="#3B7DB4"/></linearGradient>
<radialGradient id="gSphere" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#E8F8FF"/><stop offset=".4" stop-color="#7CC6EE"/><stop offset=".85" stop-color="#2A6FAF"/><stop offset="1" stop-color="#173F70"/></radialGradient>
<linearGradient id="gStone" x1="0" x2="1"><stop offset="0" stop-color="#F3E8D2"/><stop offset="1" stop-color="#CDBB98"/></linearGradient>
<linearGradient id="gStoneR" x1="0" x2="1"><stop offset="0" stop-color="#C6B28C"/><stop offset="1" stop-color="#9E8A68"/></linearGradient>
<linearGradient id="gStained" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset=".55" stop-color="#F7B733"/><stop offset="1" stop-color="#4FA3E0"/></linearGradient>
<linearGradient id="gTent" x1="0" x2="1"><stop offset="0" stop-color="#FFF7DC"/><stop offset=".5" stop-color="#F5DFA0"/><stop offset="1" stop-color="#C9A25A"/></linearGradient>
<linearGradient id="gConcrete" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9ECF1"/><stop offset="1" stop-color="#AEB6C2"/></linearGradient>
<linearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC66A"/><stop offset="1" stop-color="#4E8C46"/></linearGradient>
`;

// ---------------------------------------------------------------- Baiterek (2002) — 97 m
LM.baiterek = (t = 0) => {
  let s = '';
  // round base pavilion
  s += `<ellipse cx="0" cy="-4" rx="250" ry="22" fill="#C9CED8"/>`;
  s += `<path d="M-190 0 L-170 -70 L170 -70 L190 0 Z" fill="url(#gWhite)"/>`;
  s += `<rect x="-160" y="-58" width="320" height="26" fill="#3C6E9E" opacity=".85"/>`;
  for (let i = -150; i <= 150; i += 30) s += `<rect x="${i - 2}" y="-60" width="4" height="30" fill="#E8ECF2"/>`;
  s += `<ellipse cx="0" cy="-70" rx="170" ry="16" fill="#F7F7F7"/>`;
  // trunk: bundle of white columns, slim waist
  const trunk = 'M-62 -70 C-46 -260 -34 -420 -40 -560 L40 -560 C34 -420 46 -260 62 -70 Z';
  s += `<path d="${trunk}" fill="url(#gWhite)"/>`;
  for (let k = -4; k <= 4; k++) {
    const xb = k * 13, xt = k * 8.5;
    s += `<path d="M${xb} -72 C${xb * 0.75} -260 ${xt * 0.85} -420 ${xt} -560" stroke="${k > 1 ? '#B7BFCB' : '#D9DEE6'}" stroke-width="3" fill="none"/>`;
  }
  // crown branches behind the sphere
  const branch = (a, w, col) => {
    const x0 = Math.sin(a) * 30, tipx = Math.sin(a) * 165, tipy = -760 - Math.cos(a) * 140;
    return `<path d="M${x0} -555 C${Math.sin(a) * 120} -610 ${Math.sin(a) * 190} -690 ${tipx} ${tipy}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  for (let i = 0; i < 7; i++) s += branch(-1.25 + i * 0.42, 9, '#D3D8E0');
  // golden sphere (22 m diameter)
  s += `<circle cx="0" cy="-750" r="100" fill="url(#gGold)"/>`;
  for (let i = 1; i < 6; i++) s += `<ellipse cx="0" cy="-750" rx="${100 * Math.cos(-1.4 + i * 0.47)}" ry="100" fill="none" stroke="#B87A0C" stroke-width="1.5" opacity=".45"/>`;
  for (let i = 1; i < 6; i++) { const y = -750 - 100 + i * 33; const w = Math.sqrt(Math.max(0, 100 * 100 - (y + 750) ** 2)); s += `<line x1="${-w}" y1="${y}" x2="${w}" y2="${y}" stroke="#B87A0C" stroke-width="1.5" opacity=".4"/>`; }
  s += `<ellipse cx="-34" cy="-790" rx="28" ry="18" fill="#FFFBE6" opacity=".7"/>`;
  // front branches cradling the sphere
  for (let i = 0; i < 6; i++) s += branch(-1.05 + i * 0.42, 11, i > 3 ? '#C8CED8' : '#FFFFFF');
  return s;
};
LM.baiterek.h = 920;

// ---------------------------------------------------------------- Ak Orda (2004)
LM.akorda = () => {
  let s = '';
  // stairs
  for (let i = 0; i < 4; i++) s += `<rect x="${-300 + i * 12}" y="${-i * 8 - 8}" width="${600 - i * 24}" height="8" fill="${i % 2 ? '#E2E5EA' : '#CDD2DA'}"/>`;
  // wings
  for (const d of [-1, 1]) {
    const x = d < 0 ? -450 : 270;
    s += `<rect x="${x}" y="-230" width="180" height="230" fill="${d < 0 ? '#F6F4EF' : '#DADDE3'}"/>`;
    s += `<rect x="${x - 6}" y="-244" width="192" height="16" fill="#E8E8E8"/>`;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++)
      s += `<rect x="${x + 18 + c * 40}" y="${-210 + r * 66}" width="22" height="44" rx="11" fill="#5C86B4" opacity=".85"/>`;
  }
  // main block
  s += `<rect x="-270" y="-330" width="540" height="330" fill="url(#gWhite)"/>`;
  s += `<rect x="-285" y="-352" width="570" height="26" fill="#F7F7F7"/>`;
  s += `<rect x="-285" y="-330" width="570" height="8" fill="#C9A13A"/>`;
  // colonnade
  for (let i = 0; i < 10; i++) {
    const x = -232 + i * 51.5;
    s += `<rect x="${x - 14}" y="-300" width="44" height="270" fill="#3E5F86" opacity=".55"/>`;
    s += `<rect x="${x}" y="-306" width="16" height="282" fill="${i > 6 ? '#DCE0E6' : '#FFFFFF'}"/>`;
  }
  s += `<rect x="-255" y="-34" width="510" height="20" fill="#E9EBEF"/>`;
  // drum
  s += `<rect x="-120" y="-430" width="240" height="80" fill="url(#gWhite)"/>`;
  for (let i = 0; i < 8; i++) s += `<rect x="${-104 + i * 28}" y="-420" width="12" height="62" rx="6" fill="#5C86B4" opacity=".8"/>`;
  s += `<rect x="-132" y="-440" width="264" height="14" fill="#F2F2F2"/>`;
  // blue dome
  s += `<path d="M-128 -440 C-140 -540 -70 -615 0 -650 C70 -615 140 -540 128 -440 Z" fill="url(#gBlueDome)"/>`;
  for (let k = -3; k <= 3; k++) s += `<path d="M${k * 34} -440 C${k * 36} -540 ${k * 16} -615 0 -650" stroke="#BFE3FF" stroke-width="2.5" fill="none" opacity=".55"/>`;
  s += `<rect x="-130" y="-446" width="260" height="10" fill="#C9A13A"/>`;
  // golden spire with the sun
  s += `<rect x="-16" y="-690" width="32" height="44" fill="url(#gGoldL)"/>`;
  s += `<path d="M-10 -690 L0 -770 L10 -690 Z" fill="url(#gGoldL)"/>`;
  s += `<circle cx="0" cy="-786" r="17" fill="url(#gGold)"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += `<line x1="${Math.cos(a) * 22}" y1="${-786 + Math.sin(a) * 22}" x2="${Math.cos(a) * 32}" y2="${-786 + Math.sin(a) * 32}" stroke="#F5B820" stroke-width="3"/>`; }
  return s;
};
LM.akorda.h = 830;

// ---------------------------------------------------------------- Palace of Peace and Reconciliation (2006) — 62 m pyramid
LM.palace = () => {
  let s = '';
  s += `<path d="M-520 0 C-380 -70 -300 -78 0 -82 C300 -78 380 -70 520 0 Z" fill="url(#gGrass)"/>`;
  const A = [0, -720], L = [-340, -70], M = [130, -52], R = [330, -78];
  s += `<path d="M${A} L${L} L${M} Z" fill="url(#gStone)"/>`;
  s += `<path d="M${A} L${M} L${R} Z" fill="url(#gStoneR)"/>`;
  // facade grid
  const lp = (P, Q, k) => [P[0] + (Q[0] - P[0]) * k, P[1] + (Q[1] - P[1]) * k];
  for (let i = 1; i < 12; i++) {
    const k = i / 12;
    s += `<path d="M${lp(A, L, k)} L${lp(A, M, k)} L${lp(A, R, k)}" stroke="#A8936E" stroke-width="1.5" fill="none" opacity=".6"/>`;
  }
  for (let i = 1; i < 8; i++) { const k = i / 8; s += `<line x1="0" y1="-720" x2="${H.f(lp(L, M, k)[0])}" y2="${H.f(lp(L, M, k)[1])}" stroke="#A8936E" stroke-width="1.2" opacity=".45"/>`; }
  for (let i = 1; i < 4; i++) { const k = i / 4; s += `<line x1="0" y1="-720" x2="${H.f(lp(M, R, k)[0])}" y2="${H.f(lp(M, R, k)[1])}" stroke="#8C7856" stroke-width="1.2" opacity=".45"/>`; }
  // stained-glass apex with doves
  const k = 0.24;
  s += `<path d="M${A} L${lp(A, L, k)} L${lp(A, M, k)} Z" fill="url(#gStained)"/>`;
  s += `<path d="M${A} L${lp(A, M, k)} L${lp(A, R, k)} Z" fill="#D49A2A"/>`;
  for (const [x, y] of [[-26, -625], [8, -600], [-48, -585], [30, -578], [-8, -650]])
    s += `<path d="M${x - 9} ${y} q 5 -7 9 0 q 4 -7 9 0" stroke="#FFFFFF" stroke-width="2.4" fill="none"/>`;
  // entrance
  s += `<path d="M-60 -70 L-40 -120 L40 -120 L60 -70 Z" fill="#6A5A40" opacity=".55"/>`;
  return s;
};
LM.palace.h = 740;

// ---------------------------------------------------------------- Khan Shatyr (2010) — 150 m transparent tent
LM.khanshatyr = (t = 0, glow = 0) => {
  let s = '';
  const B0 = [-390, 0], B3 = [92, -760];
  const Lc = [[-390, 0], [-250, -110], [-40, -520], [92, -760]];
  const Rc = [[92, -760], [170, -560], [300, -150], [390, 0]];
  if (glow > 0) s += `<ellipse cx="0" cy="-260" rx="${430 + glow * 30}" ry="${420 + glow * 30}" fill="#FFD27A" opacity="${0.18 * glow}" filter="url(#blur30)"/>`;
  s += `<path d="M-390 0 C-250 -110 -40 -520 92 -760 C170 -560 300 -150 390 0 Z" fill="url(#gTent)" opacity=".96"/>`;
  // cable net: meridians
  for (let i = 1; i < 14; i++) {
    const bx = -390 + i * 780 / 14;
    s += `<path d="M${H.f(bx)} 0 Q ${H.f(bx * 0.45 + 40)} -380 92 -760" stroke="#B89356" stroke-width="1.6" fill="none" opacity=".55"/>`;
  }
  // rings
  for (let i = 1; i < 9; i++) {
    const k = i / 9;
    const p = H.bez(...Lc, k), q = H.bez(...Rc, 1 - k);
    s += `<path d="M${H.f(p[0])} ${H.f(p[1])} Q ${H.f((p[0] + q[0]) / 2)} ${H.f((p[1] + q[1]) / 2 + 26 * (1 - k))} ${H.f(q[0])} ${H.f(q[1])}" stroke="#B89356" stroke-width="1.4" fill="none" opacity=".5"/>`;
  }
  // light glow inside
  s += `<path d="M-200 0 C-120 -80 0 -300 70 -560 C110 -380 200 -120 260 0 Z" fill="#FFFFFF" opacity="${0.18 + glow * 0.2}"/>`;
  // leaning mast
  s += `<path d="M86 -760 L132 -905 L140 -903 L98 -758 Z" fill="#7E8693"/>`;
  s += `<line x1="92" y1="-760" x2="20" y2="-700" stroke="#8D95A1" stroke-width="2"/><line x1="92" y1="-760" x2="170" y2="-690" stroke="#8D95A1" stroke-width="2"/>`;
  // base / entrance
  s += `<path d="M-120 0 L-100 -50 L100 -50 L120 0 Z" fill="#E6E2D6"/><rect x="-80" y="-44" width="160" height="40" fill="#4C79A6" opacity=".7"/>`;
  return s;
};
LM.khanshatyr.h = 920;

// ---------------------------------------------------------------- minaret helper
function minaret(x, h, w, opts = {}) {
  const top = -h, fill = opts.back ? '#DCE1E9' : 'url(#gWhite)';
  const cap = opts.cap || 'url(#gWhite)';
  let s = `<path d="M${x - w / 2} 0 L${x - w * 0.38} ${top + 90} L${x + w * 0.38} ${top + 90} L${x + w / 2} 0 Z" fill="${fill}"/>`;
  const balconies = opts.balconies || [0.45, 0.78];
  for (const b of balconies) {
    const y = -h * b;
    s += `<rect x="${x - w * 0.75}" y="${y - 10}" width="${w * 1.5}" height="12" rx="3" fill="${opts.back ? '#C9D0DA' : '#E6E9EF'}"/>`;
    s += `<rect x="${x - w * 0.75}" y="${y - 12}" width="${w * 1.5}" height="3" fill="#C9A13A"/>`;
  }
  s += `<rect x="${x - w * 0.42}" y="${top + 70}" width="${w * 0.84}" height="26" fill="${opts.back ? '#D3D9E2' : '#F4F4F4'}"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${x - w * 0.3 + i * w * 0.24}" y="${top + 74}" width="${w * 0.12}" height="16" rx="3" fill="#5C86B4" opacity=".8"/>`;
  s += `<path d="M${x - w * 0.42} ${top + 70} Q ${x - w * 0.42} ${top + 20} ${x} ${top} Q ${x + w * 0.42} ${top + 20} ${x + w * 0.42} ${top + 70} Z" fill="${cap}"/>`;
  s += `<line x1="${x}" y1="${top}" x2="${x}" y2="${top - 26}" stroke="#E0A820" stroke-width="3"/>`;
  s += `<path d="M${x - 6} ${top - 34} a 7 7 0 1 0 10 -3 a 5 5 0 1 1 -10 3" fill="#F5B820"/>`;
  return s;
}

// ---------------------------------------------------------------- Hazrat Sultan Mosque (2012) — four 77 m minarets
LM.hazrat = () => {
  let s = '';
  s += minaret(-330, 640, 30, { back: true });
  s += minaret(330, 640, 30, { back: true });
  // side wings
  s += `<rect x="-430" y="-150" width="860" height="150" fill="#E3E7EE"/>`;
  for (let i = 0; i < 16; i++) s += `<path d="M${-410 + i * 52} -20 v-80 a 14 14 0 0 1 28 0 v80 Z" fill="#7FA9D1" opacity=".7"/>`;
  // main hall
  s += `<rect x="-290" y="-270" width="580" height="270" fill="url(#gWhite)"/>`;
  s += `<rect x="-300" y="-284" width="600" height="18" fill="#F7F7F7"/>`;
  for (let i = 0; i < 30; i++) s += `<path d="M${-290 + i * 19.33} -266 l9.6 10 l9.6 -10" fill="none" stroke="#3FA7C9" stroke-width="2"/>`;
  for (let i = 0; i < 7; i++) {
    const x = -255 + i * 85;
    s += `<path d="M${x} -10 v-150 a 34 40 0 0 1 68 0 v150 Z" fill="#5C93C4" opacity=".75"/>`;
    s += `<path d="M${x} -10 v-150 a 34 40 0 0 1 68 0 v150" fill="none" stroke="#FFFFFF" stroke-width="4"/>`;
  }
  // small domes
  for (const x of [-215, 215]) {
    s += `<rect x="${x - 55}" y="-320" width="110" height="40" fill="#EEF0F4"/>`;
    s += `<path d="M${x - 60} -318 C${x - 60} -380 ${x - 20} -400 ${x} -404 C${x + 20} -400 ${x + 60} -380 ${x + 60} -318 Z" fill="url(#gWhite)"/>`;
    s += `<line x1="${x}" y1="-404" x2="${x}" y2="-426" stroke="#E0A820" stroke-width="3"/>`;
  }
  // central drum + dome
  s += `<rect x="-160" y="-350" width="320" height="80" fill="url(#gWhite)"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${-145 + i * 33} -284 v-40 a 8 10 0 0 1 16 0 v40 Z" fill="#5C93C4" opacity=".8"/>`;
  s += `<rect x="-172" y="-360" width="344" height="12" fill="#C9A13A"/>`;
  s += `<path d="M-176 -358 C-176 -500 -86 -575 0 -592 C86 -575 176 -500 176 -358 Z" fill="url(#gWhite)"/>`;
  s += `<path d="M-176 -358 C-176 -500 -86 -575 0 -592 C86 -575 176 -500 176 -358 Z" fill="#9CC6E8" opacity=".18"/>`;
  for (let k = -3; k <= 3; k++) s += `<path d="M${k * 48} -358 C${k * 50} -480 ${k * 22} -570 0 -592" stroke="#C9D3E0" stroke-width="2" fill="none"/>`;
  s += `<path d="M-176 -372 C-120 -386 120 -386 176 -372" stroke="#C9A13A" stroke-width="5" fill="none"/>`;
  s += `<line x1="0" y1="-592" x2="0" y2="-640" stroke="#E0A820" stroke-width="5"/><circle cx="0" cy="-604" r="7" fill="#F5B820"/>`;
  s += `<path d="M-9 -652 a 11 11 0 1 0 16 -4 a 8 8 0 1 1 -16 4" fill="#F5B820"/>`;
  // front minarets
  s += minaret(-400, 680, 34);
  s += minaret(400, 680, 34);
  return s;
};
LM.hazrat.h = 740;

// ---------------------------------------------------------------- Nur Alem (EXPO 2017) — 80 m glass sphere
LM.nuralem = (t = 0) => {
  let s = '';
  const cy = -420, r = 330;
  // EXPO pavilions ring (behind)
  for (const d of [-1, 1]) {
    s += `<path d="M${d * 330} 0 L${d * 330} -150 Q ${d * 470} -170 ${d * 560} -120 L${d * 560} 0 Z" fill="${d < 0 ? '#E6EBF2' : '#C9D2DE'}"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${d < 0 ? -545 + i * 36 : 345 + i * 36}" y="-118" width="24" height="96" fill="#4F8EC4" opacity=".75"/>`;
  }
  // podium
  s += `<path d="M-300 0 L-270 -80 L270 -80 L300 0 Z" fill="url(#gWhite)"/>`;
  s += `<rect x="-250" y="-70" width="500" height="40" fill="#3E78AE" opacity=".8"/>`;
  // sphere
  s += `<circle cx="0" cy="${cy}" r="${r}" fill="url(#gSphere)"/>`;
  // slowly rotating meridians
  const ph = (t * 0.12) % (Math.PI / 6);
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + ph + i * Math.PI / 6;
    const rx = Math.abs(r * Math.sin(a));
    s += `<ellipse cx="0" cy="${cy}" rx="${H.f(rx)}" ry="${r}" fill="none" stroke="#D8F2FF" stroke-width="1.6" opacity=".45"/>`;
  }
  for (let i = 1; i < 8; i++) {
    const y = -r + i * (2 * r / 8), w = Math.sqrt(r * r - y * y);
    s += `<ellipse cx="0" cy="${cy + y}" rx="${H.f(w)}" ry="${H.f(w * 0.08)}" fill="none" stroke="#D8F2FF" stroke-width="1.6" opacity=".45"/>`;
  }
  s += `<path d="M${-r * 0.78} ${cy - r * 0.2} A ${r} ${r} 0 0 1 ${-r * 0.1} ${cy - r * 0.95} A ${r * 1.15} ${r * 1.15} 0 0 0 ${-r * 0.78} ${cy - r * 0.2} Z" fill="#FFFFFF" opacity=".35"/>`;
  s += `<circle cx="0" cy="${cy}" r="${r}" fill="none" stroke="#1D4F86" stroke-width="5"/>`;
  // top: wind turbine
  s += `<rect x="-60" y="${cy - r - 14}" width="120" height="20" rx="8" fill="#E6EBF2"/>`;
  s += `<rect x="-4" y="${cy - r - 90}" width="8" height="80" fill="#E6EBF2"/>`;
  const hub = [0, cy - r - 92];
  for (let i = 0; i < 3; i++) {
    const a = t * 2.2 + i * 2.094;
    s += `<line x1="${hub[0]}" y1="${hub[1]}" x2="${H.f(hub[0] + Math.cos(a) * 55)}" y2="${H.f(hub[1] + Math.sin(a) * 55)}" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>`;
  }
  s += `<circle cx="${hub[0]}" cy="${hub[1]}" r="7" fill="#C9D2DE"/>`;
  return s;
};
LM.nuralem.h = 860;

// ---------------------------------------------------------------- Abu Dhabi Plaza (Dec 2019) — 311 m tower
LM.abudhabi = (t = 0, lit = 0) => {
  let s = '';
  const tower = (x, w, h, crown, seed) => {
    let o = `<path d="M${x - w / 2} 0 L${x - w / 2} ${-h + crown} L${x - w * 0.18} ${-h} L${x + w * 0.18} ${-h} L${x + w / 2} ${-h + crown} L${x + w / 2} 0 Z" fill="url(#gGlass)"/>`;
    o += `<path d="M${x} 0 L${x} ${-h} L${x + w * 0.18} ${-h} L${x + w / 2} ${-h + crown} L${x + w / 2} 0 Z" fill="#163E66" opacity=".35"/>`;
    for (let i = 1; i < 6; i++) o += `<line x1="${x - w / 2 + i * w / 6}" y1="0" x2="${x - w / 2 + i * w / 6}" y2="${-h + crown + 6}" stroke="#D3EEFF" stroke-width="1.6" opacity=".55"/>`;
    if (lit > 0) {
      const r = H.rnd(seed);
      for (let y = -30; y > -h + crown; y -= 22) for (let i = 0; i < 6; i++) if (r() < 0.32)
        o += `<rect x="${x - w / 2 + 3 + i * w / 6}" y="${y}" width="${w / 6 - 6}" height="9" fill="#FFD98A" opacity="${lit * 0.85}"/>`;
    }
    return o;
  };
  s += tower(-300, 120, 470, 60, 3);
  s += tower(270, 130, 560, 70, 5);
  s += tower(-170, 110, 380, 50, 9);
  // podium
  s += `<rect x="-420" y="-90" width="840" height="90" fill="#D9DFE7"/><rect x="-400" y="-74" width="800" height="50" fill="#3F78AE" opacity=".75"/>`;
  // main tower
  const w = 150, h = 960;
  s += `<path d="M${-w / 2} 0 L${-w / 2} -820 L-52 -900 L-20 -960 L20 -960 L52 -900 L${w / 2} -820 L${w / 2} 0 Z" fill="url(#gGlass)"/>`;
  s += `<path d="M0 0 L0 -960 L20 -960 L52 -900 L${w / 2} -820 L${w / 2} 0 Z" fill="#163E66" opacity=".35"/>`;
  for (let i = 1; i < 8; i++) s += `<line x1="${-w / 2 + i * w / 8}" y1="-92" x2="${-w / 2 + i * w / 8}" y2="-820" stroke="#E2F4FF" stroke-width="1.8" opacity=".55"/>`;
  for (let y = -150; y > -820; y -= 120) s += `<line x1="${-w / 2}" y1="${y}" x2="${w / 2}" y2="${y}" stroke="#BFE3FF" stroke-width="2" opacity=".35"/>`;
  if (lit > 0) {
    const r = H.rnd(42);
    for (let y = -110; y > -810; y -= 20) for (let i = 0; i < 8; i++) if (r() < 0.3)
      s += `<rect x="${-w / 2 + 3 + i * w / 8}" y="${y}" width="${w / 8 - 6}" height="8" fill="#FFE2A0" opacity="${lit * 0.9}"/>`;
  }
  s += `<path d="M-52 -900 L-20 -960 L20 -960 L52 -900 Z" fill="#E6F3FF" opacity=".6"/>`;
  s += `<line x1="0" y1="-960" x2="0" y2="-1010" stroke="#C9D2DE" stroke-width="4"/><circle cx="0" cy="-1012" r="5" fill="#FF5A5A"/>`;
  return s;
};
LM.abudhabi.h = 1020;

// ---------------------------------------------------------------- Astana Grand Mosque (2022) — four 130 m minarets
LM.grandmosque = () => {
  let s = '';
  const cap = 'url(#gTurqDome)';
  s += minaret(-360, 800, 30, { back: true, cap, balconies: [0.3, 0.55, 0.8] });
  s += minaret(360, 800, 30, { back: true, cap, balconies: [0.3, 0.55, 0.8] });
  // courtyard galleries
  s += `<rect x="-470" y="-130" width="940" height="130" fill="#E3E7EE"/>`;
  for (let i = 0; i < 18; i++) s += `<path d="M${-455 + i * 51} -16 v-70 a 15 18 0 0 1 30 0 v70 Z" fill="#6FA3D2" opacity=".7"/>`;
  // main prayer hall
  s += `<rect x="-310" y="-270" width="620" height="270" fill="url(#gWhite)"/>`;
  s += `<rect x="-320" y="-286" width="640" height="18" fill="#F7F7F7"/><rect x="-320" y="-270" width="640" height="6" fill="#C9A13A"/>`;
  for (let i = 0; i < 6; i++) {
    const x = -280 + i * 98;
    s += `<path d="M${x} -16 v-160 a 40 50 0 0 1 80 0 v160 Z" fill="#4E8CC6" opacity=".75"/>`;
    s += `<path d="M${x} -16 v-160 a 40 50 0 0 1 80 0 v160" fill="none" stroke="#C9A13A" stroke-width="3"/>`;
  }
  // secondary domes
  for (const x of [-240, 240]) {
    s += `<path d="M${x - 62} -284 C${x - 62} -350 ${x - 22} -372 ${x} -376 C${x + 22} -372 ${x + 62} -350 ${x + 62} -284 Z" fill="${cap}"/>`;
    s += `<line x1="${x}" y1="-376" x2="${x}" y2="-398" stroke="#E0A820" stroke-width="3"/>`;
  }
  // drum
  s += `<rect x="-200" y="-372" width="400" height="90" fill="url(#gWhite)"/>`;
  for (let i = 0; i < 11; i++) s += `<path d="M${-186 + i * 34.5} -296 v-48 a 9 11 0 0 1 18 0 v48 Z" fill="#4E8CC6" opacity=".8"/>`;
  s += `<rect x="-212" y="-384" width="424" height="14" fill="#C9A13A"/>`;
  // main turquoise dome with golden ribs
  s += `<path d="M-215 -382 C-215 -560 -100 -650 0 -668 C100 -650 215 -560 215 -382 Z" fill="${cap}"/>`;
  for (let k = -4; k <= 4; k++) s += `<path d="M${k * 48} -382 C${k * 50} -540 ${k * 22} -646 0 -668" stroke="#F5C842" stroke-width="2.4" fill="none" opacity=".75"/>`;
  s += `<path d="M-200 -440 C-120 -458 120 -458 200 -440" stroke="#F5C842" stroke-width="4" fill="none"/>`;
  s += `<line x1="0" y1="-668" x2="0" y2="-720" stroke="#E0A820" stroke-width="6"/><circle cx="0" cy="-684" r="9" fill="#F5B820"/>`;
  s += `<path d="M-11 -734 a 13 13 0 1 0 19 -5 a 9 9 0 1 1 -19 5" fill="#F5B820"/>`;
  // front minarets (tallest elements)
  s += minaret(-450, 880, 36, { cap, balconies: [0.3, 0.55, 0.8] });
  s += minaret(450, 880, 36, { cap, balconies: [0.3, 0.55, 0.8] });
  return s;
};
LM.grandmosque.h = 960;

// ---------------------------------------------------------------- generic Soviet-era panel block (Akmola, 1990s)
LM.panelBlock = (x, w, h, floors, col = '#CFC6B8', win = '#6B7C8E', lit = 0, seed = 1) => {
  let s = `<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="${col}"/>`;
  s += `<rect x="${x + w * 0.62}" y="${-h}" width="${w * 0.38}" height="${h}" fill="#000" opacity=".1"/>`;
  const r = H.rnd(seed), fh = h / floors, cols = Math.max(2, Math.floor(w / 22));
  for (let f = 0; f < floors - 0.5; f++) for (let c = 0; c < cols; c++) {
    const on = lit > 0 && r() < 0.4;
    s += `<rect x="${H.f(x + 6 + c * (w - 8) / cols)}" y="${H.f(-h + 6 + f * fh)}" width="${H.f((w - 8) / cols - 6)}" height="${H.f(fh * 0.5)}" fill="${on ? '#FFD98A' : win}" opacity="${on ? lit : 0.8}"/>`;
  }
  return s;
};

// ---------------------------------------------------------------- Tarlan Astana LRT train (driverless)
LM.train = (cars = 3, carW = 250) => {
  let s = '';
  for (let i = 0; i < cars; i++) {
    const x = i * (carW + 8);
    const first = i === cars - 1;
    const body = first
      ? `M${x} -6 L${x} -86 Q ${x} -96 ${x + 10} -96 L${x + carW - 50} -96 Q ${x + carW + 6} -90 ${x + carW + 14} -30 L${x + carW + 14} -6 Z`
      : `M${x} -6 L${x} -86 Q ${x} -96 ${x + 10} -96 L${x + carW - 10} -96 Q ${x + carW} -96 ${x + carW} -86 L${x + carW} -6 Z`;
    s += `<path d="${body}" fill="url(#gWhiteV)"/>`;
    s += `<rect x="${x}" y="-34" width="${carW + (first ? 12 : 0)}" height="10" fill="#00A7C8"/>`;
    s += `<rect x="${x}" y="-24" width="${carW + (first ? 13 : 0)}" height="5" fill="#F5B820"/>`;
    for (let w = 0; w < 5; w++) s += `<rect x="${x + 14 + w * ((carW - 40) / 5)}" y="-80" width="${(carW - 40) / 5 - 10}" height="34" rx="5" fill="#1F3C5C"/>`;
    s += `<rect x="${x + carW / 2 - 12}" y="-82" width="24" height="60" rx="3" fill="#2E4A6A" opacity=".8"/>`;
    if (first) s += `<path d="M${x + carW - 30} -90 Q ${x + carW + 4} -86 ${x + carW + 10} -46 L${x + carW - 30} -46 Z" fill="#1F3C5C"/><circle cx="${x + carW + 6}" cy="-16" r="4" fill="#FFF6C8"/>`;
  }
  return s;
};

if (typeof module !== 'undefined') module.exports = { LM, H };
