// S1 · 0–12 s · Hook: dawn over the steppe, a small fortress on the Ishim,
// then the modern skyline and Baiterek rise. Title «АСТАНА».
import { svgLayer, q, qa } from '../lib/core.js';
import { PAL, sky, clouds, hills, grass, river, fortress, skyline, baiterek, khanShatyr, akOrda } from '../lib/art.js';
import { scene, show, sway, rise } from '../lib/anim.js';

export function s1(stage, tl, C) {
  const el = scene(stage, 's1');
  const D = [], D2 = [], D3 = [];
  const skyDawn = svgLayer(el, sky(D, PAL.dawn, { sunY: 1230, sunR: 60, stars: true, seed: 3 }), D.join(''), 'layer sky-dawn');
  const skyGold = svgLayer(el, sky(D2, PAL.golden, { sunX: 820, sunY: 980, sunR: 56 }) + clouds(D2, 4, 6, 300, 760, '#ffe6c8', 0.55), D2.join(''), 'layer sky-gold');
  // world (camera) container
  const world = document.createElement('div'); world.className = 'world'; el.appendChild(world);
  const D4 = [];
  const far = svgLayer(world, hills(D4, 11, 1200, 30, '#7a6a9a', '#3e3a66'), D4.join(''), 'layer far');
  const D5 = [];
  const cityBack = svgLayer(world, skyline(D5, 21, PAL.golden, { y: 1210, n: 20, hMin: 160, hMax: 470, tone: 1, glass: 0.5 }), D5.join(''), 'layer city-back');
  const D6 = [];
  const landmarks = svgLayer(world,
    `<g class="ks">${khanShatyr(D6, 230, 1212, 1.25)}</g><g class="ao">${akOrda(D6, 860, 1212, 1.05)}</g><g class="bt">${baiterek(D6, 545, 1214, 5.2)}</g>`, D6.join(''), 'layer marks');
  const D7 = [];
  const cityFront = svgLayer(world, skyline(D7, 22, PAL.golden, { y: 1230, hMin: 90, hMax: 260, wMin: 70, wMax: 140, tone: 2, glass: 0.3 }), D7.join(''), 'layer city-front');
  const D8 = [];
  const riv = svgLayer(world, river(D8, PAL.dawn, 1238, 1360, { bendA: 30, bendB: 20 }), D8.join(''), 'layer riv');
  const D9 = [];
  const fort = svgLayer(world, fortress(D9, 520, 1236, 0.62, { wood: '#3b2f4a', dark: '#241c30', roof: '#2a2238', light: '#4a3c5c' }), D9.join(''), 'layer fort');
  const D10 = [];
  const mid = svgLayer(world, hills(D10, 12, 1440, 60, '#4b3f6c', '#231f3e'), D10.join(''), 'layer mid');
  const near = svgLayer(world, hills([], 13, 1700, 70, '#1d1a33') + grass(5, -300, 1380, 1600, 260, ['#3a3456', '#4a4068', '#2b2747', '#5a4a6e'], 70, 190), '', 'layer near');

  show(tl, el, 0, 12.4, 0.01, 0.4);
  // light: night -> dawn -> golden
  tl.fromTo(q(skyDawn, '.sun'), { y: 0 }, { y: -140, duration: 7, ease: 'sine.out' }, 0);
  tl.fromTo(q(skyDawn, '.stars'), { opacity: 1 }, { opacity: 0, duration: 4.5, ease: 'none' }, 0.5);
  tl.fromTo(skyGold, { opacity: 0 }, { opacity: 1, duration: 2.6, ease: 'none' }, 6.0);
  qa(skyGold, '.cloud').forEach((c, i) => tl.fromTo(c, { x: 0 }, { x: -60 - i * 15, duration: 12, ease: 'none' }, 0));
  // camera: low flight over the grass, then tilt up and push in
  tl.fromTo(world, { y: -260, scale: 1.18 }, { y: -40, scale: 1.0, duration: 6.5, ease: 'power2.inOut' }, 0);
  tl.to(world, { scale: 1.1, y: 70, duration: 5.5, ease: 'power1.inOut' }, 6.5);
  [[far, 20], [mid, 60], [near, 160], [riv, 40], [fort, 40]].forEach(([l, d]) => tl.fromTo(l, { x: 0 }, { x: -d, duration: 12, ease: 'none' }, 0));
  sway(tl, qa(near, '.blade'), 0, 12.5, 7, 2.0, 0.2);
  qa(riv, '.ripple').forEach((r, i) => tl.fromTo(r, { x: 0 }, { x: 40 + (i % 5) * 10, duration: 12, ease: 'none' }, 0));
  // the small fortress appears, then gives way to the city
  tl.fromTo(fort, { opacity: 0, scale: 0.9, transformOrigin: '540px 1240px' }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 2.4);
  tl.to(fort, { opacity: 0, y: 30, duration: 0.9, ease: 'power2.in' }, 6.4);
  tl.fromTo(riv, { opacity: 0.0 }, { opacity: 1, duration: 1.5, ease: 'none' }, 1.6);
  tl.set([cityBack, cityFront, landmarks], { opacity: 1 }, 0);
  rise(tl, qa(cityBack, '.bld'), 6.6, 0.9, 0.035);
  rise(tl, qa(cityFront, '.bld'), 7.0, 0.8, 0.03);
  rise(tl, [q(landmarks, '.ks'), q(landmarks, '.ao')], 7.4, 1.0, 0.15);
  tl.fromTo(q(landmarks, '.bt'), { y: 560 }, { y: 0, duration: 1.8, ease: 'power3.out' }, 7.2);
  tl.fromTo(q(landmarks, '.halo'), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 0.9, scale: 1.25, duration: 0.8, ease: 'power2.out' }, C.title1 - 0.2);
  tl.to(q(landmarks, '.halo'), { opacity: 0.55, scale: 1, duration: 1.6, ease: 'sine.inOut' }, C.title1 + 0.6);
  // landmarks sit behind a ground mask so they grow from the horizon
  tl.set(landmarks, { clipPath: 'inset(0 0 708px 0)' }, 0);
}
