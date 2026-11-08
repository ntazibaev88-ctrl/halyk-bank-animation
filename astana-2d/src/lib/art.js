// Vector illustration library (SVG strings). Every element that animates gets
// a class so scenes can target it with GSAP. Deterministic: seeded randomness.
import { rng, g, path, rect, circle, linGrad, radGrad, id, W, H } from './core.js';

// ------------------------------------------------------------------ palettes
export const PAL = {
  _glass: 0,
  dawn: { glass: ['#7f8fc4', '#9a86b8', '#6f9cc0'], sky: ['#0b1736', '#3a3f6e', '#c9707a', '#f6b47a'], sun: '#ffd9a0', hills: ['#5b4b77', '#3f3a63', '#2c2a4c', '#1c1b35'], river: ['#f0b98a', '#5a5d8f'], bld: ['#6f6a96', '#4d4a77', '#2f2e55'], win: '#ffcf8a', winA: 0.0 },
  sepia: { glass: ['#b39a72', '#a38a62'], sky: ['#e9d9b6', '#efe2c4', '#f4e7cc', '#f6ead2'], sun: '#fff1cf', hills: ['#cdb58a', '#b89c6c', '#9c8056', '#7f6544'], river: ['#d7c7a2', '#9f8e6b'], bld: ['#a88f69', '#8c734f', '#6d5638'], win: '#4a3a26', winA: 0.5 },
  day: { glass: ['#5fa8d8', '#3f86b8', '#7cc3d8', '#a5c8e4', '#4f9db0'], sky: ['#2f86c8', '#5fb0e0', '#a9dcf2', '#e2f4fa'], sun: '#fff6d8', hills: ['#a7c4a0', '#86ad7c', '#6a945f', '#4f7b46'], river: ['#8fd2ee', '#2f7fb3'], bld: ['#c9d9e6', '#9fbcd4', '#6d93b6'], win: '#2c4f75', winA: 0.45 },
  golden: { glass: ['#5f8fbf', '#7aa3c9', '#4a7aa8', '#c89a6a', '#8fb3cf'], sky: ['#2c4f86', '#7c86b0', '#f0a874', '#ffd59a'], sun: '#fff0c4', hills: ['#c99a6d', '#a77b58', '#835f47', '#5e4537'], river: ['#ffd3a0', '#56609a'], bld: ['#e7b98f', '#b98b74', '#7d5f63'], win: '#3a2d3d', winA: 0.45 },
  dusk: { glass: ['#3c5a9a', '#4d4a8a', '#2f6f9a'], sky: ['#0a1430', '#23305e', '#7a4e78', '#e48a6c'], sun: '#ffb27a', hills: ['#3d3a62', '#2d2b4f', '#1f1e3b', '#14132a'], river: ['#e48a6c', '#1d2650'], bld: ['#4b4f7d', '#33365f', '#1f2244'], win: '#ffd28a', winA: 0.85 },
  night: { glass: ['#22396e', '#2b2f66', '#1d4a72'], sky: ['#030816', '#0a1430', '#16224a', '#2a3366'], sun: '#cfe1ff', hills: ['#1a1d3a', '#13152c', '#0d0f22', '#080a18'], river: ['#2e3f7a', '#0a1028'], bld: ['#252b55', '#1a1f42', '#11152f'], win: '#ffd890', winA: 0.95 },
};

// ------------------------------------------------------------------ sky
export function sky(D, pal, { sunX = 540, sunY = 1100, sunR = 70, stars = false, seed = 1 } = {}) {
  const sg = linGrad([[0, pal.sky[0]], [0.45, pal.sky[1]], [0.75, pal.sky[2]], [1, pal.sky[3]]]);
  const glow = radGrad([[0, pal.sun, 0.95], [0.18, pal.sun, 0.55], [1, pal.sun, 0]]);
  D.push(sg.def, glow.def);
  let st = '';
  if (stars) {
    const r = rng(seed);
    for (let i = 0; i < 140; i++) st += circle((r() * W).toFixed(1), (r() * H * 0.55).toFixed(1), (0.6 + r() * 1.8).toFixed(2), { fill: '#fff', opacity: (0.3 + r() * 0.7).toFixed(2) });
  }
  return g(rect(-200, -200, W + 400, H + 400, { fill: sg.url }) +
    g(circle(sunX, sunY, sunR * 6, { fill: glow.url }) + circle(sunX, sunY, sunR, { fill: pal.sun }), { class: 'sun' }) +
    g(st, { class: 'stars' }), { class: 'sky' });
}

export function clouds(D, seed, n, y0, y1, color = '#fff', opacity = 0.8) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = -200 + r() * (W + 400), y = y0 + r() * (y1 - y0), w = 160 + r() * 260, h = w * (0.18 + r() * 0.1);
    let c = '';
    for (let k = 0; k < 5; k++) c += `<ellipse cx="${(x + (k - 2) * w * 0.18).toFixed(1)}" cy="${(y - Math.sin((k / 4) * Math.PI) * h * 0.6).toFixed(1)}" rx="${(w * (0.22 + r() * 0.1)).toFixed(1)}" ry="${(h * (0.55 + r() * 0.3)).toFixed(1)}"/>`;
    c += `<ellipse cx="${x}" cy="${y}" rx="${w * 0.55}" ry="${h * 0.45}"/>`;
    s += g(c, { class: 'cloud', fill: color, opacity: (opacity * (0.6 + r() * 0.4)).toFixed(2) });
  }
  return g(s, { class: 'clouds' });
}

// rolling hills band from x=-400..W+400
export function hills(D, seed, yBase, amp, color, color2 = null, freq = 1) {
  const r = rng(seed);
  const pts = [];
  const ph = [r() * 6, r() * 6, r() * 6];
  for (let x = -420; x <= W + 420; x += 40) {
    const y = yBase - amp * (0.55 * Math.sin(x / (260 / freq) + ph[0]) + 0.3 * Math.sin(x / (110 / freq) + ph[1]) + 0.15 * Math.sin(x / (55 / freq) + ph[2]));
    pts.push([x, y]);
  }
  let d = `M -420 ${H + 400} L ${pts.map(([x, y]) => `${x} ${y.toFixed(1)}`).join(' L ')} L ${W + 420} ${H + 400} Z`;
  let fill = color;
  if (color2) { const gg = linGrad([[0, color], [1, color2]]); D.push(gg.def); fill = gg.url; }
  return path(d, { fill });
}

// wind-blown grass blades (each blade a separate path for sway)
export function grass(seed, x0, x1, yBase, n, colors, hMin = 40, hMax = 110) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), h = hMin + r() * (hMax - hMin), w = 4 + r() * 5, bend = (r() - 0.3) * h * 0.4;
    const y = yBase + r() * 30;
    const d = `M ${x - w} ${y} Q ${x - w * 0.3 + bend * 0.5} ${y - h * 0.6} ${x + bend} ${y - h} Q ${x + w * 0.3 + bend * 0.5} ${y - h * 0.55} ${x + w} ${y} Z`;
    s += `<path class="blade" d="${d}" fill="${colors[Math.floor(r() * colors.length)]}" style="transform-origin:${x}px ${y}px"/>`;
  }
  return g(s, { class: 'grass' });
}

// ------------------------------------------------------------------ river
export function river(D, pal, yTop, yBot, { bendA = 60, bendB = 40, x0 = -400, x1 = W + 400 } = {}) {
  const rg = linGrad([[0, pal.river[0]], [1, pal.river[1]]]);
  D.push(rg.def);
  const top = `M ${x0} ${yTop} C ${W * 0.25} ${yTop - bendA}, ${W * 0.7} ${yTop + bendA}, ${x1} ${yTop - 10}`;
  const d = `${top} L ${x1} ${yBot} C ${W * 0.7} ${yBot + bendB}, ${W * 0.25} ${yBot - bendB}, ${x0} ${yBot} Z`;
  let rip = '';
  const r = rng(Math.round(yTop));
  for (let i = 0; i < 26; i++) {
    const y = yTop + 12 + r() * (yBot - yTop - 20), x = -100 + r() * (W + 200), w = 40 + r() * 140;
    rip += path(`M ${x} ${y} h ${w}`, { stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: (0.15 + r() * 0.35).toFixed(2), class: 'ripple' });
  }
  return g(path(d, { fill: rg.url }) + g(rip), { class: 'river' });
}

// ------------------------------------------------------------------ historical
export function yurt(x, y, s, felt = '#efe4cc', trim = '#8a5a34') {
  return g(
    path(`M ${-50} 0 L ${-50} -38 Q ${-48} -78 0 -86 Q 48 -78 50 -38 L 50 0 Z`, { fill: felt }) +
    path(`M -50 -38 Q 0 -52 50 -38`, { stroke: trim, 'stroke-width': 4, fill: 'none' }) +
    path(`M -50 -14 Q 0 -24 50 -14`, { stroke: trim, 'stroke-width': 3, fill: 'none', opacity: 0.7 }) +
    rect(-11, -34, 22, 34, { fill: trim, rx: 2 }) +
    path(`M -8 -84 Q 0 -90 8 -84`, { stroke: trim, 'stroke-width': 4, fill: 'none' }) +
    path(`M -50 0 L -50 -38 Q -48 -78 0 -86 L 0 0 Z`, { fill: '#000', opacity: 0.08 }),
    { transform: `translate(${x} ${y}) scale(${s})` });
}

export function horseRider(x, y, s, col = '#4a3220', flip = false, cart = false) {
  const body = `M -46 -46 C -40 -62 20 -64 34 -52 C 42 -66 50 -82 62 -88 C 70 -92 78 -86 76 -80 C 72 -74 66 -72 62 -66 C 58 -56 54 -46 46 -40 L 44 -6 L 38 -6 L 38 -34 C 20 -30 -10 -30 -30 -34 L -34 -6 L -40 -6 L -40 -36 C -46 -38 -56 -34 -62 -26 C -60 -40 -52 -46 -46 -46 Z`;
  const rider = `M -6 -60 C -10 -76 -6 -96 4 -100 C 12 -102 16 -96 14 -88 C 20 -84 22 -72 18 -62 Z`;
  const head = circle(8, -108, 7, { fill: col });
  const hat = path(`M -2 -112 Q 8 -126 18 -112 Z`, { fill: col });
  let c = '';
  if (cart) c = rect(-150, -52, 92, 34, { fill: col, rx: 4 }) + circle(-128, -10, 13, { fill: 'none', stroke: col, 'stroke-width': 5 }) + circle(-80, -10, 13, { fill: 'none', stroke: col, 'stroke-width': 5 }) + path('M -58 -36 L -40 -40', { stroke: col, 'stroke-width': 4 });
  return g(g(path(body, { fill: col }) + (cart ? '' : path(rider, { fill: col }) + head + hat) + c, { transform: `translate(${x} ${y}) scale(${flip ? -s : s} ${s})` }), { class: 'mover' });
}

export function fortress(D, x, y, s, pal = { wood: '#7a5638', dark: '#5a3e28', roof: '#4a3a2c', light: '#a07a52' }) {
  let p = '';
  const L = 520, step = 11;
  for (let i = 0; i <= L / step; i++) {
    const px = -L / 2 + i * step;
    if (Math.abs(px) < 26) continue;
    const h = 64 + ((i * 37) % 9);
    p += path(`M ${px - 5} 0 L ${px - 5} ${-h + 6} L ${px} ${-h} L ${px + 5} ${-h + 6} L ${px + 5} 0 Z`, { fill: i % 2 ? pal.wood : pal.light });
  }
  const tower = (tx, th) => g(rect(tx - 34, -th, 68, th, { fill: pal.wood }) + rect(tx - 34, -th, 68, th, { fill: '#000', opacity: 0.12, 'clip-path': 'none', transform: `translate(34 0) scale(0.5 1)` }) +
    path(`M ${tx - 46} ${-th} L ${tx} ${-th - 52} L ${tx + 46} ${-th} Z`, { fill: pal.roof }) + rect(tx - 10, -th + 22, 20, 18, { fill: pal.dark }), { class: 'tower' });
  const gate = g(rect(-30, -96, 60, 96, { fill: pal.wood }) + path('M -42 -96 L 0 -140 L 42 -96 Z', { fill: pal.roof }) + rect(-18, -56, 36, 56, { fill: pal.dark, rx: 3 }));
  // houses behind the wall
  let houses = '';
  const r = rng(1830);
  for (let i = 0; i < 9; i++) {
    const hx = -220 + i * 52 + r() * 10, hw = 46 + r() * 20, hh = 30 + r() * 16, back = -58 - r() * 22;
    houses += g(rect(hx - hw / 2, back - hh, hw, hh, { fill: pal.light }) + path(`M ${hx - hw / 2 - 6} ${back - hh} L ${hx} ${back - hh - 26} L ${hx + hw / 2 + 6} ${back - hh} Z`, { fill: pal.roof }) + rect(hx - 6, back - hh + 10, 12, 10, { fill: pal.dark }));
  }
  return g(houses + p + tower(-L / 2, 120) + tower(L / 2, 120) + gate, { transform: `translate(${x} ${y}) scale(${s})`, class: 'fortress' });
}

export function logHouse(x, y, s, col = '#9c7650', roof = '#5d4632') {
  return g(rect(-40, -44, 80, 44, { fill: col }) + path('M -48 -44 L 0 -78 L 48 -44 Z', { fill: roof }) + rect(-24, -32, 16, 14, { fill: '#3d2b1c' }) + rect(10, -32, 16, 14, { fill: '#3d2b1c' }) +
    [10, 20, 30, 40].map((yy) => path(`M -40 ${-yy} h 80`, { stroke: '#000', 'stroke-width': 1.5, opacity: 0.15 })).join(''), { transform: `translate(${x} ${y}) scale(${s})`, class: 'house' });
}

export function sovietBlock(x, y, w, h, col = '#c9c1b2', win = '#5a6670') {
  const pid = id('pw');
  return { def: `<pattern id="${pid}" width="22" height="26" patternUnits="userSpaceOnUse" x="${x}" y="${y - h}"><rect x="5" y="7" width="12" height="13" fill="${win}"/></pattern>`,
    svg: g(rect(x, y - h, w, h, { fill: col }) + rect(x, y - h, w, h, { fill: `url(#${pid})`, opacity: 0.75 }) + rect(x, y - h, w, 6, { fill: '#000', opacity: 0.15 }) + rect(x + w * 0.62, y - h, w * 0.38, h, { fill: '#000', opacity: 0.08 }), { class: 'bld' }) };
}

export function wheat(seed, x0, x1, yBase, n, col = '#d9a94a') {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), h = 120 + r() * 90, y = yBase + r() * 40, b = (r() - 0.5) * 30;
    let ear = '';
    for (let k = 0; k < 7; k++) ear += `<ellipse cx="${x + b + (k % 2 ? 5 : -5)}" cy="${y - h + k * 9}" rx="5" ry="9" transform="rotate(${k % 2 ? 25 : -25} ${x + b} ${y - h + k * 9})"/>`;
    s += `<g class="blade" style="transform-origin:${x}px ${y}px" fill="${col}">${path(`M ${x} ${y} Q ${x + b * 0.4} ${y - h * 0.5} ${x + b} ${y - h + 50}`, { stroke: col, 'stroke-width': 3, fill: 'none' })}${ear}</g>`;
  }
  return g(s, { class: 'grass' });
}

// ------------------------------------------------------------------ modern city
const winPatterns = {};
export function winPattern(D, color, alpha, lit = false) {
  const k = color + alpha + lit;
  if (winPatterns[k]) return winPatterns[k];
  const pid = id('wp');
  let cells = '';
  const r = rng(lit ? 7 : 3);
  for (let yy = 0; yy < 4; yy++) for (let xx = 0; xx < 4; xx++) {
    const on = !lit || r() < 0.55;
    cells += `<rect x="${xx * 16 + 4}" y="${yy * 20 + 5}" width="9" height="12" fill="${color}" opacity="${on ? alpha * (lit ? 0.6 + r() * 0.4 : 1) : alpha * 0.12}"/>`;
  }
  D.push(`<pattern id="${pid}" width="64" height="80" patternUnits="userSpaceOnUse">${cells}</pattern>`);
  return (winPatterns[k] = `url(#${pid})`);
}

// a skyline layer; each building is <g class="bld"> so it can rise from the ground
export function skyline(D, seed, pal, { y = 1300, n = 16, hMin = 120, hMax = 520, wMin = 50, wMax = 120, tone = 0, x0 = -200, x1 = W + 200, lit = false, glass = 0.4 } = {}) {
  const r = rng(seed);
  const base = pal.bld[tone];
  const wp = winPattern(D, lit ? pal.win : pal.win, lit ? pal.winA : pal.winA * 0.7, lit);
  let s = '';
  let x = x0;
  while (x < x1) {
    const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin);
    const top = r();
    const isGlass = r() < glass;
    const pick = r();
    const col = isGlass && pal.glass ? pal.glass[Math.floor(pick * pal.glass.length)] : (pick < 0.5 ? base : pal.bld[Math.min(2, tone + (pick < 0.75 ? 0 : 1))] || base);
    const shade = tone * 0.12;
    const gl = linGrad([[0, isGlass ? lighten(col, 0.35) : lighten(col, 0.12)], [0.55, col], [1, darken(col, 0.18 + shade)]], 0, 0, 0.35, 1);
    D.push(gl.def);
    let b = rect(x, y - h, w, h, { fill: gl.url });
    b += rect(x, y - h, w, h, { fill: wp, opacity: isGlass ? 0.55 : 0.9 });
    if (isGlass) for (let k = 1; k < 4; k++) b += path(`M ${x + (w * k) / 4} ${y - h} V ${y}`, { stroke: lighten(base, 0.35), 'stroke-width': 1.2, opacity: 0.5 });
    b += rect(x + w * 0.66, y - h, w * 0.34, h, { fill: '#000', opacity: 0.16 });
    b += rect(x, y - h, 3, h, { fill: '#fff', opacity: isGlass ? 0.35 : 0.2 });
    b += rect(x, y - h, w, 4, { fill: '#fff', opacity: 0.25 });
    if (top < 0.25) b += path(`M ${x + w * 0.2} ${y - h} L ${x + w * 0.5} ${y - h - w * 0.6} L ${x + w * 0.8} ${y - h} Z`, { fill: lighten(base, 0.1) });
    else if (top < 0.45) b += rect(x + w * 0.25, y - h - h * 0.12, w * 0.5, h * 0.12, { fill: base }) + path(`M ${x + w / 2} ${y - h * 1.12} V ${y - h * 1.12 - 40}`, { stroke: lighten(base, 0.2), 'stroke-width': 3 });
    else if (top < 0.55) b += path(`M ${x} ${y - h} L ${x + w} ${y - h - w * 0.35} L ${x + w} ${y - h} Z`, { fill: lighten(base, 0.15) });
    s += `<g class="bld" style="transform-origin:${(x + w / 2).toFixed(0)}px ${y}px">${b}</g>`;
    x += w + 6 + r() * 30;
  }
  // atmospheric haze at the base of the layer
  const hz = linGrad([[0, pal.sky[3], 0], [1, pal.sky[3], 0.55 - tone * 0.18]]);
  D.push(hz.def);
  s += rect(-400, y - 220, W + 800, 230, { fill: hz.url, class: 'haze' });
  return g(s, { class: 'skyline' });
}

export function lighten(hex, k) { const c = parseInt(hex.slice(1), 16); let r = c >> 16, gg = (c >> 8) & 255, b = c & 255; r += (255 - r) * k; gg += (255 - gg) * k; b += (255 - b) * k; return `rgb(${r | 0},${gg | 0},${b | 0})`; }
export function darken(hex, k) { const c = parseInt(hex.slice(1), 16); return `rgb(${((c >> 16) * (1 - k)) | 0},${(((c >> 8) & 255) * (1 - k)) | 0},${((c & 255) * (1 - k)) | 0})`; }

// ------------------------------------------------------------------ landmarks
// Baiterek: 97 m. s = px per metre. (cx, y) = base centre.
export function baiterek(D, cx, y, s, { white = '#f7f5f0', shade = '#cfd6df', glow = 0.6 } = {}) {
  const gold = radGrad([[0, '#fff3c4'], [0.35, '#f6c453'], [0.75, '#d08b1f'], [1, '#8a5310']], 0.38, 0.32, 0.7);
  const halo = radGrad([[0, '#ffd27a', 0.8], [0.4, '#ffb347', 0.25], [1, '#ffb347', 0]]);
  const trunkClip = id('tc');
  const Y = (m) => y - m * s, X = (m) => cx + m * s;
  const trunk = `M ${X(-7.5)} ${Y(3)} C ${X(-5)} ${Y(25)}, ${X(-4.2)} ${Y(45)}, ${X(-5.6)} ${Y(62)} L ${X(5.6)} ${Y(62)} C ${X(4.2)} ${Y(45)}, ${X(5)} ${Y(25)}, ${X(7.5)} ${Y(3)} Z`;
  D.push(gold.def, halo.def, `<clipPath id="${trunkClip}"><path d="${trunk}"/></clipPath>`);
  let lattice = '';
  for (let k = -14; k <= 14; k++) {
    lattice += path(`M ${X(k * 1.1)} ${Y(2)} L ${X(k * 1.1 + 11)} ${Y(63)}`, { stroke: white, 'stroke-width': Math.max(1.2, s * 0.45) });
    lattice += path(`M ${X(k * 1.1)} ${Y(2)} L ${X(k * 1.1 - 11)} ${Y(63)}`, { stroke: white, 'stroke-width': Math.max(1.2, s * 0.45) });
  }
  let crown = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2, c = Math.cos(a), sg = Math.sin(a) > 0 ? 1 : 0.55;
    const pts = [[5.6, 62], [11, 70], [14.5, 80], [14.8, 88], [12.5, 95], [8, 99.5]].map(([rr, h]) => [X(rr * c), Y(h)]);
    crown += path(`M ${pts[0]} C ${pts[1]} ${pts[2]} ${pts[3]} S ${pts[4]} ${pts[5]}`, { stroke: white, 'stroke-width': Math.max(1.4, s * 0.55), fill: 'none', opacity: sg.toFixed(2), 'stroke-linecap': 'round' });
  }
  return g(
    circle(X(0), Y(86), 36 * s, { fill: halo.url, class: 'halo', opacity: glow }) +
    path(`M ${X(-30)} ${Y(0)} L ${X(30)} ${Y(0)} L ${X(24)} ${Y(-2)} L ${X(-24)} ${Y(-2)} Z`, { fill: shade }) +
    rect(X(-10), Y(6), 20 * s, 6 * s, { fill: white, rx: 2 * s }) +
    path(trunk, { fill: shade, opacity: 0.55 }) +
    g(lattice, { 'clip-path': `url(#${trunkClip})` }) +
    path(trunk, { fill: 'none', stroke: white, 'stroke-width': Math.max(1.5, s * 0.6) }) +
    circle(X(0), Y(86), 11 * s, { fill: gold.url, class: 'sphere' }) +
    crown,
    { class: 'baiterek' });
}

export function khanShatyr(D, cx, y, s, { fabric = ['#fbf2dc', '#e8d6ae'], line = '#b59a6a', glow = 0 } = {}) {
  const fg = linGrad([[0, fabric[0]], [1, fabric[1]]], 0, 0, 1, 0.3);
  const clip = id('ks');
  const X = (m) => cx + m * s, Y = (m) => y - m * s;
  const tent = `M ${X(-100)} ${Y(0)} C ${X(-55)} ${Y(14)}, ${X(-12)} ${Y(70)}, ${X(8)} ${Y(150)} C ${X(18)} ${Y(70)}, ${X(55)} ${Y(14)}, ${X(98)} ${Y(0)} Z`;
  D.push(fg.def, `<clipPath id="${clip}"><path d="${tent}"/></clipPath>`);
  let net = '';
  for (let k = -12; k <= 12; k++) {
    net += path(`M ${X(k * 9)} ${Y(-2)} Q ${X(k * 4 + 20)} ${Y(70)} ${X(8 + k * 0.5)} ${Y(152)}`, { stroke: line, 'stroke-width': 1.4, fill: 'none', opacity: 0.6 });
    net += path(`M ${X(k * 9)} ${Y(-2)} Q ${X(k * 4 - 18)} ${Y(70)} ${X(8 + k * 0.5)} ${Y(152)}`, { stroke: line, 'stroke-width': 1.4, fill: 'none', opacity: 0.6 });
  }
  for (let h = 10; h < 150; h += 14) net += path(`M ${X(-110)} ${Y(h)} L ${X(110)} ${Y(h - 4)}`, { stroke: line, 'stroke-width': 1, opacity: 0.35 });
  return g(path(tent, { fill: fg.url }) + g(net, { 'clip-path': `url(#${clip})` }) +
    path(tent, { fill: '#ffcf6e', opacity: glow, class: 'ksglow' }) +
    path(`M ${X(8)} ${Y(150)} L ${X(10)} ${Y(172)}`, { stroke: '#e8e8e8', 'stroke-width': 3 }) +
    path(`M ${X(8)} ${Y(150)} C ${X(18)} ${Y(70)}, ${X(55)} ${Y(14)}, ${X(98)} ${Y(0)} L ${X(8)} ${Y(0)} Z`, { fill: '#000', opacity: 0.07 }),
  { class: 'khanshatyr' });
}

export function akOrda(D, cx, y, s, { stone = '#f5f1e8', dome = '#2f74c0', gold = '#e2b04a', win = '#7d8ea3' } = {}) {
  const X = (m) => cx + m * s, Y = (m) => y - m * s;
  const dg = radGrad([[0, '#8ec2f2'], [0.5, dome], [1, '#1a3f75']], 0.35, 0.3, 0.8);
  D.push(dg.def);
  let cols = '';
  for (let k = -8; k <= 8; k++) cols += rect(X(k * 3.4 - 0.8), Y(26), 1.6 * s, 24 * s, { fill: '#fff' }) + rect(X(k * 3.4 - 0.8), Y(26), 0.5 * s, 24 * s, { fill: '#000', opacity: 0.08 });
  let wins = '';
  for (let row = 0; row < 3; row++) for (let k = -10; k <= 10; k++) if (Math.abs(k) > 6) wins += rect(X(k * 4.2 - 1), Y(8 + row * 7), 2 * s, 4 * s, { fill: win });
  return g(
    rect(X(-75), Y(30), 150 * s, 30 * s, { fill: stone }) +
    rect(X(-95), Y(22), 20 * s, 22 * s, { fill: stone }) + rect(X(75), Y(22), 20 * s, 22 * s, { fill: stone }) +
    wins + cols +
    rect(X(-30), Y(30), 60 * s, 4 * s, { fill: '#fff' }) +
    path(`M ${X(-32)} ${Y(30)} L ${X(0)} ${Y(38)} L ${X(32)} ${Y(30)} Z`, { fill: '#fff' }) +
    rect(X(-17), Y(48), 34 * s, 14 * s, { fill: stone }) +
    path(`M ${X(-17)} ${Y(48)} C ${X(-17)} ${Y(66)}, ${X(17)} ${Y(66)}, ${X(17)} ${Y(48)} Z`, { fill: dg.url }) +
    [-12, -6, 0, 6, 12].map((k) => path(`M ${X(k)} ${Y(48)} Q ${X(k * 0.45)} ${Y(62)} ${X(0)} ${Y(65.5)}`, { stroke: gold, 'stroke-width': Math.max(1, s * 0.4), fill: 'none' })).join('') +
    path(`M ${X(-1.2)} ${Y(65)} L ${X(0)} ${Y(92)} L ${X(1.2)} ${Y(65)} Z`, { fill: gold }) + circle(X(0), Y(68), 1.8 * s, { fill: gold }) +
    rect(X(-75), Y(30), 150 * s, 30 * s, { fill: '#000', opacity: 0.05 }),
  { class: 'akorda' });
}

// Kazakhstan national flag (sky-blue field, golden sun with 32 rays, steppe eagle, ornament)
export function flag(w, h) {
  const cx = w * 0.5, cy = h * 0.4, R = h * 0.135;
  let rays = '';
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2, a1 = a - 0.045, a2 = a + 0.045;
    rays += `<path d="M ${cx + Math.cos(a1) * R * 1.17} ${cy + Math.sin(a1) * R * 1.17} L ${cx + Math.cos(a) * R * 1.62} ${cy + Math.sin(a) * R * 1.62} L ${cx + Math.cos(a2) * R * 1.17} ${cy + Math.sin(a2) * R * 1.17} Z"/>`;
  }
  const k = w / 1024;
  const eagle = `<g transform="translate(${cx} ${h * 0.69}) scale(${k})"><path d="M0 -28 C30 -40 90 -38 175 -22 C150 -14 160 -6 132 -2 C150 2 128 8 104 8 C118 14 92 18 64 14 C46 16 30 18 16 22 L22 44 L8 36 L0 50 L-8 36 L-22 44 L-16 22 C-30 18 -46 16 -64 14 C-92 18 -118 14 -104 8 C-128 8 -150 2 -132 -2 C-160 -6 -150 -14 -175 -22 C-90 -38 -30 -40 0 -28 Z"/><ellipse cx="0" cy="-30" rx="9" ry="11"/></g>`;
  let orn = '';
  const bx = w * 0.075, st = h / 7;
  for (let i = 0; i < 7; i++) {
    const yy = st * (i + 0.5);
    for (const sg of [-1, 1]) orn += `<path d="M ${bx} ${yy - st * 0.32} C ${bx + sg * 30 * k} ${yy - st * 0.32} ${bx + sg * 34 * k} ${yy + 2} ${bx + sg * 14 * k} ${yy + 6} C ${bx + sg * 2 * k} ${yy + 8} ${bx + sg * 4 * k} ${yy - 10} ${bx + sg * 14 * k} ${yy - 6}"/><path d="M ${bx} ${yy + st * 0.32} C ${bx + sg * 22 * k} ${yy + st * 0.3} ${bx + sg * 26 * k} ${yy + st * 0.12} ${bx + sg * 12 * k} ${yy + st * 0.1}"/>`;
    orn += `<path d="M ${bx} ${yy - st * 0.36} L ${bx} ${yy + st * 0.36}"/>`;
  }
  return `<rect width="${w}" height="${h}" fill="#00afca"/><g fill="#fec50c"><circle cx="${cx}" cy="${cy}" r="${R}"/>${rays}${eagle}</g><g fill="none" stroke="#fec50c" stroke-width="${7 * k}" stroke-linecap="round">${orn}</g>`;
}

// ------------------------------------------------------------------ people
export function person(x, y, s, { col = '#2a3550', skin = '#c99a76', kind = 'adult', flip = false } = {}) {
  const k = kind === 'child' ? 0.62 : 1;
  const bag = kind === 'student' ? rect(-15, -118, 12, 30, { fill: '#c0563f', rx: 4 }) : '';
  const phone = kind === 'photo' ? rect(10, -142, 9, 14, { fill: '#cfe8ff', class: 'flash' }) + path('M 6 -120 L 14 -134', { stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }) : '';
  return g(
    `<g class="legL" style="transform-origin:0px -62px">${path('M -4 -64 L -8 -2', { stroke: '#2b2d35', 'stroke-width': 10, 'stroke-linecap': 'round' })}</g>` +
    `<g class="legR" style="transform-origin:0px -62px">${path('M 4 -64 L 8 -2', { stroke: '#2b2d35', 'stroke-width': 10, 'stroke-linecap': 'round' })}</g>` +
    bag + path('M -14 -66 C -16 -100 -12 -122 0 -124 C 12 -122 16 -100 14 -66 Z', { fill: col }) +
    circle(0, -136, 12, { fill: skin }) + path('M -12 -138 C -12 -152 12 -152 12 -138 C 8 -146 -6 -146 -12 -138 Z', { fill: '#1d1612' }) + phone,
    { transform: `translate(${x} ${y}) scale(${(flip ? -1 : 1) * s * k} ${s * k})` }).replace(/^<g /, `<g class="person" data-dir="${flip ? -1 : 1}"><g `) + '</g>';
}

export function tree(x, y, s, col = '#4f8a45', col2 = '#3b6e36') {
  return g(rect(-4, -40, 8, 40, { fill: '#5b4330' }) + circle(0, -62, 30, { fill: col }) + circle(-18, -48, 20, { fill: col2 }) + circle(18, -50, 22, { fill: col2 }) + circle(6, -78, 18, { fill: col }), { transform: `translate(${x} ${y}) scale(${s})`, class: 'tree' });
}

export function crane(x, y, s, col = '#f0b429') {
  let lat = '';
  for (let i = 0; i < 18; i++) lat += path(`M ${-6} ${-i * 20} L ${6} ${-i * 20 - 20} M ${6} ${-i * 20} L ${-6} ${-i * 20 - 20}`, { stroke: col, 'stroke-width': 1.6 });
  return g(rect(-7, -360, 14, 360, { fill: 'none', stroke: col, 'stroke-width': 3 }) + lat +
    `<g class="jib" style="transform-origin:0px -360px">${rect(-60, -372, 260, 10, { fill: col })}${rect(-60, -380, 50, 22, { fill: '#555' })}${path('M 150 -362 V -260', { stroke: '#444', 'stroke-width': 2 })}${rect(140, -262, 20, 14, { fill: '#666' })}</g>`,
  { transform: `translate(${x} ${y}) scale(${s})`, class: 'crane' });
}
