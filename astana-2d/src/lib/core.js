// Small shared helpers: seeded randomness, SVG string helpers, DOM mounting.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const W = 1080, H = 1920;
let uid = 0;
export const id = (p = 'g') => `${p}${++uid}`;

export const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => `${k}="${v}"`).join(' ');
export const g = (inner, o = {}) => `<g ${attrs(o)}>${inner}</g>`;
export const path = (d, o = {}) => `<path d="${d}" ${attrs(o)}/>`;
export const rect = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs(o)}/>`;
export const circle = (cx, cy, r, o = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs(o)}/>`;

export function linGrad(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  const gid = id('lg');
  return { id: gid, url: `url(#${gid})`, def: `<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>` };
}
export function radGrad(stops, cx = 0.5, cy = 0.5, r = 0.5) {
  const gid = id('rg');
  return { id: gid, url: `url(#${gid})`, def: `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>` };
}

// a full-frame SVG layer; returns the element
export function svgLayer(parent, inner, defs = '', cls = 'layer', viewBox = `0 0 ${W} ${H}`) {
  const wrap = document.createElement('div');
  wrap.className = cls;
  wrap.innerHTML = `<svg viewBox="${viewBox}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${inner}</svg>`;
  parent.appendChild(wrap);
  return wrap;
}
export function div(parent, cls, html = '') {
  const d = document.createElement('div');
  d.className = cls; d.innerHTML = html;
  parent.appendChild(d);
  return d;
}
export const q = (root, sel) => root.querySelector(sel);
export const qa = (root, sel) => [...root.querySelectorAll(sel)];
