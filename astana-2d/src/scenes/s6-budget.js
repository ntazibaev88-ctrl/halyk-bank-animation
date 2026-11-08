// S6 · 77–92 s · City budget: revenue flows from the city treasury to public
// services (illustrative directions, no shares). Figures in the UI layer.
import { svgLayer, q, qa, g, path, rect, circle, linGrad, radGrad } from '../lib/core.js';
import { PAL, sky, skyline, baiterek } from '../lib/art.js';
import { scene, show, draw } from '../lib/anim.js';
import { ICONS, SECTORS } from '../ui/content.js';

export const BUDGET_LAYOUT = { cx: 540, cy: 900, R: 330 };

export function s6(stage, tl, C) {
  const el = scene(stage, 's6');
  const world = document.createElement('div'); world.className = 'world'; el.appendChild(world);
  const D = [];
  svgLayer(world, sky(D, PAL.dusk, { sunX: 540, sunY: 1350, sunR: 50 }), D.join(''), 'layer');
  const D1 = [];
  const city = svgLayer(world, skyline(D1, 121, PAL.dusk, { y: 1700, hMin: 200, hMax: 640, tone: 0, glass: 0.6, lit: true }) + baiterek(D1, 540, 1705, 6, { glow: 0.8 }), D1.join(''), 'layer');
  const veil = linGrad([[0, '#061026', 0.92], [0.6, '#0a1838', 0.78], [1, '#0a1838', 0.3]]);
  const { cx, cy, R } = BUDGET_LAYOUT;
  const pos = SECTORS.map((_, i) => { const a = -Math.PI / 2 + Math.PI / 6 + (i / 6) * Math.PI * 2; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R * 1.08]; });
  const coinG = radGrad([[0, '#fff3c4'], [0.55, '#f2c14e'], [1, '#b37a17']], 0.35, 0.3, 0.8);
  let lines = '', nodes = '', dots = '';
  pos.forEach(([x, y], i) => {
    lines += path(`M ${cx} ${cy} Q ${(cx + x) / 2 + (i % 2 ? 60 : -60)} ${(cy + y) / 2} ${x} ${y}`, { stroke: '#f2c14e', 'stroke-width': 4, fill: 'none', opacity: 0.85, class: 'fl', 'stroke-linecap': 'round' });
    for (let k = 0; k < 3; k++) dots += circle(cx, cy, 7, { fill: '#ffe39a', class: `fd fd${i}` });
    nodes += g(circle(x, y, 74, { fill: '#0f2350', stroke: '#7fd6ff', 'stroke-width': 3 }) +
      `<g transform="translate(${x - 36} ${y - 40}) scale(3)" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[i]}</g>` +
      `<text x="${x}" y="${y + 112}" class="secname" text-anchor="middle">${SECTORS[i]}</text>`, { class: 'node', style: `transform-origin:${x}px ${y}px` });
  });
  const info = svgLayer(world, rect(0, 0, 1080, 1920, { fill: veil.url }) + lines + dots + nodes +
    g(circle(cx, cy, 150, { fill: '#f2c14e', opacity: 0.15, class: 'ring' }) + circle(cx, cy, 118, { fill: coinG.url }) + circle(cx, cy, 104, { fill: 'none', stroke: '#fff3c4', 'stroke-width': 3, opacity: 0.8 }) +
      `<text x="${cx}" y="${cy + 42}" class="coin" text-anchor="middle">₸</text>`, { class: 'core', style: `transform-origin:${cx}px ${cy}px` }),
  veil.def + coinG.def, 'layer');

  show(tl, el, 76.6, 92.4, 0.4, 0.4);
  tl.fromTo(city, { y: 0, scale: 1 }, { y: 80, scale: 1.08, duration: 16, ease: 'none' }, 76.6);
  tl.fromTo(q(info, '.core'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' }, C.budgetFlow - 0.3);
  tl.fromTo(q(info, '.ring'), { scale: 0.8, opacity: 0.4, transformOrigin: `${cx}px ${cy}px` }, { scale: 1.5, opacity: 0, duration: 1.4, repeat: 7, ease: 'power1.out', transformOrigin: `${cx}px ${cy}px` }, C.budget);
  const F = C.budgetFlow;
  qa(info, '.fl').forEach((l, i) => draw(tl, l, F + 0.2 + i * 0.5, 0.7));
  qa(info, '.node').forEach((n, i) => tl.fromTo(n, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)' }, F + 0.6 + i * 0.5));
  qa(info, '.fl').forEach((l, i) => {
    const L = l.getTotalLength();
    qa(info, `.fd${i}`).forEach((d, k) => {
      // dots travel along the path: sample positions into keyframes (seek-safe)
      const N = 12, kf = [];
      for (let j = 0; j <= N; j++) { const p = l.getPointAtLength((L * j) / N); kf.push({ x: p.x - cx, y: p.y - cy }); }
      const t0 = F + 0.9 + i * 0.5 + k * 0.47;
      tl.set(d, { x: 0, y: 0, opacity: 1 }, t0);
      tl.to(d, { keyframes: kf.slice(1).map((p) => ({ ...p, duration: 1.4 / N, ease: 'none' })), repeat: 5 }, t0);
    });
  });
  tl.set(qa(info, '.fd'), { opacity: 0 }, 0);
  tl.set(qa(info, '.fd'), { opacity: 0 }, 92.4);
}
