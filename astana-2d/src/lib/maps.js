// Stylised maps: Kazakhstan outline (approximate border, lon/lat) and Astana.
import { path, circle, g, rng } from './core.js';

// Approximate state border of Kazakhstan (lon, lat), clockwise from the Caspian.
const KZ = [
  [46.5, 48.5], [46.9, 49.9], [47.6, 50.4], [48.7, 50.6], [49.5, 51.1], [50.8, 51.7], [52.6, 51.5], [54.5, 51.0], [55.7, 50.6],
  [57.0, 51.1], [58.6, 51.0], [59.9, 50.6], [61.4, 51.0], [61.0, 52.0], [60.0, 52.4], [61.0, 53.0], [62.0, 53.9], [64.5, 54.0],
  [66.0, 54.8], [68.2, 55.0], [70.0, 55.2], [71.2, 54.1], [72.6, 54.2], [73.4, 53.5], [76.3, 54.2], [77.8, 53.4], [80.0, 50.9],
  [81.5, 51.0], [83.4, 51.0], [85.2, 50.0], [86.8, 49.6], [87.3, 49.1], [85.7, 48.4], [85.5, 47.0], [83.0, 47.2], [82.3, 45.5],
  [80.1, 45.0], [79.9, 44.5], [80.5, 43.0], [80.0, 42.6], [77.6, 42.9], [75.5, 42.8], [74.2, 43.3], [73.4, 42.4], [71.8, 42.8],
  [70.9, 42.3], [69.4, 41.5], [68.6, 40.7], [67.9, 41.2], [66.5, 41.2], [66.0, 42.9], [64.0, 43.6], [62.0, 43.5], [61.0, 44.4],
  [58.6, 45.6], [56.0, 45.0], [56.0, 41.3], [55.0, 41.3], [53.0, 42.1], [52.5, 41.8], [52.8, 42.9], [51.3, 43.2], [50.9, 44.0],
  [50.3, 44.4], [51.3, 44.6], [51.0, 45.3], [53.0, 45.3], [53.1, 46.8], [51.2, 47.0], [49.2, 46.4], [48.6, 46.6], [49.0, 47.0],
  [48.0, 47.7], [47.3, 47.7],
];
export const CITIES = { astana: [71.45, 51.17], almaty: [76.95, 43.24] };

export function kzProjector(x0, y0, width) {
  const lon0 = 46.3, lon1 = 87.5, lat1 = 55.6, k = Math.cos((48 * Math.PI) / 180);
  const sx = width / ((lon1 - lon0) * k);
  return ([lon, lat]) => [x0 + (lon - lon0) * k * sx, y0 + (lat1 - lat) * sx];
}

export function kazakhstan(x0, y0, width, { fill = '#e8d6ae', stroke = '#8a6a3e' } = {}) {
  const P = kzProjector(x0, y0, width);
  const d = 'M ' + KZ.map((p) => P(p).map((v) => v.toFixed(1)).join(' ')).join(' L ') + ' Z';
  return { svg: path(d, { fill, stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', class: 'kz' }), P, d };
}

// Stylised Astana map (not to scale): Ishim river + districts + roads
export function astanaMap(D, cx, cy, s) {
  const X = (v) => cx + v * s, Y = (v) => cy + v * s;
  const riverD = `M ${X(-520)} ${Y(-40)} C ${X(-300)} ${Y(-90)}, ${X(-160)} ${Y(-140)}, ${X(-40)} ${Y(-120)} S ${X(120)} ${Y(-20)}, ${X(170)} ${Y(80)} S ${X(300)} ${Y(220)}, ${X(520)} ${Y(250)}`;
  const districts = [
    ['САРЫАРҚА', 'M -460 -380 L -120 -420 L -60 -170 L -330 -90 L -480 -150 Z', [-290, -260]],
    ['БАЙҚОҢЫР', 'M -120 -420 L 220 -400 L 230 -120 L 60 -60 L -60 -150 Z', [70, -280]],
    ['АЛМАТЫ', 'M 220 -400 L 500 -300 L 520 180 L 300 160 L 200 20 L 230 -120 Z', [370, -110]],
    ['ЕСІЛ', 'M -330 -80 L -50 -110 L 150 30 L 260 200 L 120 330 L -260 260 Z', [-40, 120]],
    ['НҰРА', 'M -480 -140 L -330 -80 L -260 260 L -120 330 L -420 440 L -520 120 Z', [-360, 180]],
  ];
  const r = rng(51);
  let roads = '';
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI, len = 300 + r() * 600, x = -400 + r() * 800, y = -380 + r() * 760;
    roads += path(`M ${X(x - Math.cos(a) * len / 2)} ${Y(y - Math.sin(a) * len / 2)} L ${X(x + Math.cos(a) * len / 2)} ${Y(y + Math.sin(a) * len / 2)}`, { stroke: '#7fb4ff', 'stroke-width': 1.5, opacity: 0.18 });
  }
  const dist = districts.map(([n, dd, [lx, ly]], i) => g(
    path(dd.replace(/(-?\d+) (-?\d+)/g, (m, a, b) => `${X(+a)} ${Y(+b)}`), { fill: '#2b6fd6', opacity: 0.12, stroke: '#9cc7ff', 'stroke-width': 2, 'stroke-dasharray': '8 8', class: 'dfill' }) +
    `<text x="${X(lx)}" y="${Y(ly)}" class="dlabel" text-anchor="middle">${n}</text>`, { class: 'district' })).join('');
  return { svg: g(roads, { class: 'roads' }) + dist + path(riverD, { stroke: '#59d0ff', 'stroke-width': 16, fill: 'none', 'stroke-linecap': 'round', class: 'mapriver', opacity: 0.95 }) + path(riverD, { stroke: '#d8f6ff', 'stroke-width': 4, fill: 'none', opacity: 0.8 }), X, Y };
}

export function popDots(cx, cy, s, n, seed = 7) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 470;
    d += circle((cx + Math.cos(a) * rr * s).toFixed(1), (cy + Math.sin(a) * rr * s * 0.92).toFixed(1), (2 + r() * 3).toFixed(1), { fill: '#ffd27a', class: 'pd', opacity: 0 });
  }
  return g(d, { class: 'popdots' });
}
