// S4 · 45–60 s · A city of people: a park with families and students, then a
// glowing city map where population lights multiply (counter in the UI layer).
import { svgLayer, q, qa, g, rect } from '../lib/core.js';
import { PAL, sky, clouds, hills, skyline, baiterek, person, tree } from '../lib/art.js';
import { astanaMap, popDots } from '../lib/maps.js';
import { scene, show, walk, draw } from '../lib/anim.js';

export function s4(stage, tl, C) {
  const el = scene(stage, 's4');
  // ---- park
  const park = document.createElement('div'); park.className = 'world'; el.appendChild(park);
  const D = [];
  svgLayer(park, sky(D, PAL.golden, { sunX: 880, sunY: 760, sunR: 50 }) + clouds(D, 91, 6, 250, 700, '#ffe9d0', 0.6), D.join(''), 'layer');
  const D2 = [];
  const bg = svgLayer(park, skyline(D2, 92, PAL.golden, { y: 1150, hMin: 140, hMax: 420, tone: 0, glass: 0.5 }) + baiterek(D2, 600, 1160, 4.8, { glow: 0.5 }), D2.join(''), 'layer far');
  let trees = '';
  for (let i = 0; i < 9; i++) trees += tree(-40 + i * 145, 1290 + (i % 2) * 20, 1.6 + (i % 3) * 0.25, '#5f9a4c', '#477d3d');
  const tr = svgLayer(park, hills([], 93, 1300, 12, '#88b16a', '#5f8f4a') + trees, '', 'layer mid');
  const ground = svgLayer(park, rect(-200, 1420, 1480, 600, { fill: '#d9c9ad' }) + rect(-200, 1420, 1480, 14, { fill: '#c2b090' }), '', 'layer');
  const cols = ['#2f4a7a', '#b5482f', '#3b6f4f', '#6a4c93', '#e0a12f', '#24313f', '#c7563f', '#2d6f8c'];
  let crowd = '';
  for (let i = 0; i < 16; i++) {
    const kind = i % 5 === 1 ? 'child' : i % 4 === 2 ? 'student' : 'adult';
    crowd += person(-150 + i * 95 + (i % 3) * 20, 1520 + (i % 4) * 70, 1.25 + (i % 4) * 0.12, { col: cols[i % cols.length], kind, flip: i % 3 === 0 });
  }
  const ppl = svgLayer(park, crowd, '', 'layer people');
  show(tl, park, 44.6, 52.3, 0.4, 0.5);
  tl.fromTo(park, { scale: 1.08 }, { scale: 1.0, duration: 8, ease: 'sine.inOut' }, 44.6);
  tl.fromTo(bg, { x: 0 }, { x: -30, duration: 8, ease: 'none' }, 44.6);
  tl.fromTo(tr, { x: 0 }, { x: -80, duration: 8, ease: 'none' }, 44.6);
  tl.fromTo(ppl, { x: 0 }, { x: -120, duration: 8, ease: 'none' }, 44.6);
  walk(tl, ppl, 44.6, 52.4, 45);

  // ---- living map
  const mp = document.createElement('div'); mp.className = 'world mapdark'; el.appendChild(mp);
  const Dm = [];
  const m = astanaMap(Dm, 540, 1000, 1.0);
  const mapL = svgLayer(mp, rect(0, 0, 1080, 1920, { fill: '#061026' }) + m.svg + popDots(540, 1000, 1.0, 520), Dm.join(''), 'layer');
  show(tl, mp, 51.9, 60.4, 0.5, 0.4);
  tl.fromTo(mp, { scale: 1.25, rotation: -4 }, { scale: 1.0, rotation: 0, duration: 8.5, ease: 'power2.out' }, 51.9);
  draw(tl, q(mapL, '.mapriver'), 52.0, 1.6);
  qa(mapL, '.district').forEach((d, i) => tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 52.4 + i * 0.3));
  // population lights: ~1.0 M at 2017 (shown during the count), growing to 1.7 M
  const dots = qa(mapL, '.pd');
  const start = C.popCount, end = C.popFinal;
  dots.forEach((d, i) => {
    const f = i / dots.length; // 0..1
    const tt = f < 0.59 ? 52.4 + f * 2.5 : start + ((f - 0.59) / 0.41) * (end - start);
    tl.fromTo(d, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 0.95, scale: 1, duration: 0.4, ease: 'back.out(3)', transformOrigin: '50% 50%' }, tt);
  });
  qa(mapL, '.dfill').forEach((d, i) => tl.fromTo(d, { opacity: 0.08 }, { opacity: 0.32, duration: end - start, ease: 'none' }, start));
}
