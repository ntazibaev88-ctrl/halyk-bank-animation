// S5 · 60–77 s · Economy: glass business district, traffic and trade, then the
// gross regional product figure over the skyline (number in the UI layer).
import { svgLayer, q, qa, g, path, rect, circle, linGrad } from '../lib/core.js';
import { PAL, sky, clouds, skyline, crane } from '../lib/art.js';
import { scene, show, rise } from '../lib/anim.js';

function vehicle(x, y, w, col, kind = 'car') {
  const h = kind === 'bus' ? 46 : kind === 'truck' ? 52 : 26;
  const body = kind === 'truck' ? rect(x, y - h, w * 0.68, h, { fill: '#e9e4da', rx: 4 }) + rect(x + w * 0.7, y - h * 0.75, w * 0.3, h * 0.75, { fill: col, rx: 6 }) : rect(x, y - h, w, h, { fill: col, rx: kind === 'bus' ? 10 : 9 });
  const win = kind === 'bus' ? [...Array(6)].map((_, i) => rect(x + 10 + i * (w - 20) / 6, y - h + 8, (w - 20) / 6 - 6, 16, { fill: '#cfe8ff', opacity: 0.85 })).join('') : kind === 'car' ? rect(x + w * 0.25, y - h - 12, w * 0.5, 14, { fill: col, rx: 6 }) : '';
  return g(body + win + circle(x + w * 0.2, y, 9, { fill: '#222' }) + circle(x + w * 0.8, y, 9, { fill: '#222' }), { class: 'veh' });
}

export function s5(stage, tl, C) {
  const el = scene(stage, 's5');
  const world = document.createElement('div'); world.className = 'world'; el.appendChild(world);
  const D = [];
  svgLayer(world, sky(D, PAL.golden, { sunX: 180, sunY: 900, sunR: 60 }) + clouds(D, 101, 6, 200, 700, '#ffe2c4', 0.5), D.join(''), 'layer');
  const D1 = [];
  const far = svgLayer(world, skyline(D1, 111, PAL.golden, { y: 1350, hMin: 300, hMax: 900, wMin: 90, wMax: 170, tone: 0, glass: 0.9 }), D1.join(''), 'layer far');
  const D2 = [];
  const near = svgLayer(world, skyline(D2, 112, PAL.golden, { y: 1430, hMin: 200, hMax: 640, wMin: 120, wMax: 220, tone: 1, glass: 0.95 }), D2.join(''), 'layer near');
  const sheenG = linGrad([[0, '#fff', 0], [0.5, '#fff', 0.35], [1, '#fff', 0]], 0, 0, 1, 0.2);
  D2.push(sheenG.def);
  const sheen = svgLayer(world, rect(-400, 0, 260, 1920, { fill: sheenG.url, transform: 'skewX(-18)', class: 'sheen' }), sheenG.def, 'layer sheen');
  const cr = svgLayer(world, crane(150, 1440, 1.6) + crane(930, 1450, 1.4, '#e9a23b'), '', 'layer cranes');
  const road = svgLayer(world, rect(-200, 1440, 1480, 500, { fill: '#3a3d48' }) + [...Array(14)].map((_, i) => rect(-100 + i * 110, 1600, 60, 8, { fill: '#f1e7c8' })).join('') + rect(-200, 1440, 1480, 10, { fill: '#c9c2b4' }), '', 'layer');
  const traffic = svgLayer(world,
    g(vehicle(-300, 1560, 240, '#2f7fbf', 'bus') + vehicle(-760, 1560, 110, '#d84a3a') + vehicle(-1080, 1560, 230, '#1f6f5c', 'truck') + vehicle(-1400, 1560, 110, '#f2c14e'), { class: 'laneA' }) +
    g(vehicle(1200, 1720, 120, '#ffffff') + vehicle(1560, 1720, 240, '#e07a2e', 'truck') + vehicle(1980, 1720, 110, '#3b4d7a') + vehicle(2300, 1720, 240, '#00a3c4', 'bus'), { class: 'laneB' }), '', 'layer traffic');
  show(tl, el, 59.6, 77.4, 0.4, 0.5);
  tl.fromTo(world, { y: 380, scale: 1.12 }, { y: 0, scale: 1.0, duration: 5, ease: 'power2.inOut' }, 59.6);
  tl.to(world, { y: -120, scale: 1.05, duration: 6, ease: 'sine.inOut' }, 64.6);
  tl.to(world, { y: 160, scale: 1.18, duration: 6.8, ease: 'sine.inOut' }, 70.6);
  rise(tl, qa(far, '.bld'), 59.8, 1.1, 0.05);
  rise(tl, qa(near, '.bld'), 60.3, 1.0, 0.06);
  tl.fromTo(q(sheen, '.sheen'), { x: 0 }, { x: 1700, duration: 2.4, ease: 'power1.inOut' }, 61.5);
  tl.to(q(sheen, '.sheen'), { x: 3400, duration: 2.4, ease: 'power1.inOut' }, 71.5);
  qa(cr, '.jib').forEach((j, i) => tl.fromTo(j, { rotation: -12, svgOrigin: '0 -360' }, { rotation: 16, duration: 2.6, repeat: 6, yoyo: true, ease: 'sine.inOut', svgOrigin: '0 -360' }, 59.6 + i * 0.7));
  tl.fromTo(q(traffic, '.laneA'), { x: 0 }, { x: 2600, duration: 17, ease: 'none' }, 59.6);
  tl.fromTo(q(traffic, '.laneB'), { x: 0 }, { x: -3200, duration: 17, ease: 'none' }, 59.6);
  // dim the city under the big number
  const dim = svgLayer(el, rect(0, 0, 1080, 1920, { fill: '#0a1430' }), '', 'layer');
  tl.fromTo(dim, { opacity: 0 }, { opacity: 0.45, duration: 0.8 }, C.grp - 0.4);
}
