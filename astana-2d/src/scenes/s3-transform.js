// S3 · 30–45 s · The city transforms: Baiterek rises with cranes, a bridge
// spans the Ishim, landmarks appear, day turns to evening and lights come on.
import { svgLayer, q, qa, g, path, rect, circle } from '../lib/core.js';
import { PAL, sky, clouds, hills, river, skyline, baiterek, khanShatyr, akOrda, crane } from '../lib/art.js';
import { scene, show, rise, draw } from '../lib/anim.js';

export function s3(stage, tl, C) {
  const el = scene(stage, 's3');
  const world = document.createElement('div'); world.className = 'world'; el.appendChild(world);
  const D = [], Dd = [];
  const skyDay = svgLayer(world, sky(D, PAL.day, { sunX: 900, sunY: 420, sunR: 55 }) + clouds(D, 71, 8, 220, 900, '#ffffff', 0.85), D.join(''), 'layer');
  const skyDusk = svgLayer(world, sky(Dd, PAL.dusk, { sunX: 160, sunY: 1180, sunR: 60, stars: true, seed: 9 }), Dd.join(''), 'layer');
  const D1 = [];
  const far = svgLayer(world, skyline(D1, 81, PAL.day, { y: 1180, hMin: 140, hMax: 420, tone: 0, glass: 0.6 }), D1.join(''), 'layer far');
  const D1n = [];
  const farN = svgLayer(world, skyline(D1n, 81, PAL.dusk, { y: 1180, hMin: 140, hMax: 420, tone: 0, glass: 0.6, lit: true }), D1n.join(''), 'layer far');
  const D2 = [];
  const marks = svgLayer(world, `<g class="ks">${khanShatyr(D2, 200, 1200, 1.4)}</g><g class="ao">${akOrda(D2, 880, 1200, 1.15)}</g><g class="bt">${baiterek(D2, 540, 1205, 7.2, { glow: 0.3 })}</g>`, D2.join(''), 'layer marks');
  const cranes = svgLayer(world, crane(330, 1210, 1.3) + crane(760, 1215, 1.15, '#e9a23b') + crane(980, 1220, 1.0), '', 'layer cranes');
  const D3 = [];
  const mid = svgLayer(world, skyline(D3, 82, PAL.day, { y: 1240, hMin: 90, hMax: 260, tone: 1, wMin: 70, wMax: 150, glass: 0.4 }), D3.join(''), 'layer mid');
  const D3n = [];
  const midN = svgLayer(world, skyline(D3n, 82, PAL.dusk, { y: 1240, hMin: 90, hMax: 260, tone: 1, wMin: 70, wMax: 150, glass: 0.4, lit: true }), D3n.join(''), 'layer mid');
  const D4 = [];
  const riv = svgLayer(world, river(D4, PAL.day, 1250, 1430, { bendA: 20, bendB: 20 }) + hills([], 83, 1700, 25, '#5d8a4f', '#3a6033'), D4.join(''), 'layer riv');
  // bridge + cars
  let cars = '';
  for (let i = 0; i < 14; i++) cars += rect(-80 - i * 140, 1296 - (i % 2) * 16, 34, 12, { fill: ['#e44', '#fff', '#ffd23f', '#3a7bd5', '#222'][i % 5], rx: 4, class: 'car' });
  const bridge = svgLayer(world,
    path('M -100 1310 L 1180 1310', { stroke: '#e6e2da', 'stroke-width': 18, class: 'deck', 'stroke-linecap': 'butt' }) +
    g([120, 400, 680, 960].map((x) => rect(x - 8, 1310, 16, 90, { fill: '#cfc8bc' })).join(''), { class: 'piers' }) +
    path('M 300 1302 L 540 1150 L 780 1302', { stroke: '#f2efe8', 'stroke-width': 5, fill: 'none', class: 'cable' }) +
    rect(530, 1130, 20, 172, { fill: '#f2efe8', class: 'pylon' }) + g(cars, { class: 'cars' }), '', 'layer bridge');
  const lights = svgLayer(world, g([...Array(24)].map((_, i) => circle(-20 + i * 48, 1300, 4, { fill: '#ffd27a' })).join(''), { class: 'lamps' }), '', 'layer lamps');

  show(tl, el, 29.6, 45.4, 0.4, 0.4);
  // camera: start close on Baiterek's site, pull back to the river panorama
  tl.fromTo(world, { scale: 1.55, y: 260, x: 0 }, { scale: 1.2, y: 90, duration: 5, ease: 'power2.inOut' }, 29.6);
  tl.to(world, { scale: 1.02, y: -40, duration: 6, ease: 'power2.inOut' }, 35);
  tl.to(world, { scale: 1.08, y: 0, duration: 4.4, ease: 'sine.inOut' }, 41);
  tl.set(marks, { clipPath: 'inset(0 0 715px 0)' }, 0);
  tl.fromTo(q(marks, '.bt'), { y: 760 }, { y: 0, duration: 3.2, ease: 'power2.inOut' }, 30.3);
  rise(tl, qa(far, '.bld'), 31.0, 1.0, 0.06);
  rise(tl, qa(mid, '.bld'), 33.0, 0.8, 0.05);
  rise(tl, [q(marks, '.ks'), q(marks, '.ao')], 35.2, 1.2, 0.4);
  qa(cranes, '.jib').forEach((j, i) => tl.fromTo(j, { rotation: -10 - i * 8, svgOrigin: '0 -360' }, { rotation: 20 + i * 6, duration: 3, repeat: 3, yoyo: true, ease: 'sine.inOut', svgOrigin: '0 -360' }, 30));
  tl.fromTo(cranes, { opacity: 1 }, { opacity: 0, duration: 1 }, 40.5);
  draw(tl, q(bridge, '.deck'), 35.4, 1.6, 'power2.out');
  tl.fromTo(q(bridge, '.piers'), { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.8, transformOrigin: '50% 0%' }, 35.2);
  tl.fromTo([q(bridge, '.pylon'), q(bridge, '.cable')], { opacity: 0 }, { opacity: 1, duration: 0.6 }, 36.4);
  tl.fromTo(q(bridge, '.cars'), { x: 0 }, { x: 2300, duration: 8, ease: 'none' }, 37);
  // day -> evening, windows light up
  tl.fromTo(skyDusk, { opacity: 0 }, { opacity: 1, duration: 3, ease: 'none' }, 40.6);
  tl.fromTo([farN, midN], { opacity: 0 }, { opacity: 1, duration: 2.6, ease: 'none' }, 41.2);
  tl.fromTo(q(lights, '.lamps'), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 42.4);
  tl.set([farN, midN], { opacity: 0 }, 0);
  tl.fromTo(q(marks, '.halo'), { opacity: 0.2 }, { opacity: 1, duration: 2 }, 42);
  tl.fromTo(q(marks, '.ksglow'), { opacity: 0 }, { opacity: 0.45, duration: 2 }, 42.2);
}
