// S7 · 92–107 s · Tourism: Baiterek close-up, Khan Shatyr, Ak Orda, the Ishim
// embankment, visitors taking photos, then the evening skyline (counters in UI).
import { svgLayer, q, qa, g, path, rect, circle } from '../lib/core.js';
import { PAL, sky, clouds, hills, river, skyline, baiterek, khanShatyr, akOrda, person, tree } from '../lib/art.js';
import { scene, show, walk, rise } from '../lib/anim.js';

function shot(el, cls) { const d = document.createElement('div'); d.className = `world ${cls}`; el.appendChild(d); return d; }

export function s7(stage, tl, C) {
  const el = scene(stage, 's7');
  const T = C.tourCuts; // [Khan Shatyr, Ak Orda, embankment, tourists, evening]
  show(tl, el, 91.6, 107.4, 0.4, 0.4);

  // A — Baiterek close-up, tilt up to the golden sphere
  const a = shot(el, 'a');
  const Da = [];
  svgLayer(a, sky(Da, PAL.day, { sunX: 850, sunY: 300 }) + clouds(Da, 131, 7, 100, 1300, '#fff', 0.9) + baiterek(Da, 540, 3100, 22, { glow: 0.55 }), Da.join(''), 'layer');
  show(tl, a, 91.6, T[0] + 0.15, 0.01, 0.2);
  tl.fromTo(a, { y: -900, scale: 1.05 }, { y: 600, scale: 1.0, duration: T[0] - 91.6, ease: 'power1.inOut' }, 91.6);

  // B — Khan Shatyr
  const b = shot(el, 'b');
  const Db = [];
  svgLayer(b, sky(Db, PAL.golden, { sunX: 900, sunY: 900 }) + clouds(Db, 132, 5, 200, 700, '#ffe2c4', 0.6) + skyline(Db, 133, PAL.golden, { y: 1390, hMin: 60, hMax: 200, tone: 0 }) + khanShatyr(Db, 520, 1400, 5.2) + hills([], 134, 1500, 10, '#a5875e', '#6e5640'), Db.join(''), 'layer');
  show(tl, b, T[0] - 0.05, T[1] + 0.15, 0.15, 0.2);
  tl.fromTo(b, { scale: 1.15, x: 60 }, { scale: 1.02, x: -40, duration: T[1] - T[0] + 0.2, ease: 'power1.out' }, T[0]);

  // C — Ak Orda
  const c = shot(el, 'c');
  const Dc = [];
  let tr = ''; for (let i = 0; i < 8; i++) tr += tree(-40 + i * 160, 1370, 1.2, '#4f8a45', '#3b6e36');
  svgLayer(c, sky(Dc, PAL.day, { sunX: 200, sunY: 360 }) + clouds(Dc, 135, 6, 200, 900, '#fff', 0.85) + akOrda(Dc, 540, 1330, 5.0) + tr + rect(-100, 1360, 1300, 600, { fill: '#d8d0c2' }) + rect(-100, 1360, 1300, 10, { fill: '#bfb5a6' }), Dc.join(''), 'layer');
  show(tl, c, T[1] - 0.05, T[2] + 0.15, 0.15, 0.2);
  tl.fromTo(c, { scale: 1.12, y: 80 }, { scale: 1.0, y: 0, duration: T[2] - T[1] + 0.2, ease: 'power1.out' }, T[1]);

  // D — Ishim embankment with bridges and promenade
  const d = shot(el, 'd');
  const Dd = [];
  svgLayer(d, sky(Dd, PAL.day, { sunX: 820, sunY: 420 }) + clouds(Dd, 136, 6, 200, 800, '#fff', 0.8) + skyline(Dd, 137, PAL.day, { y: 1150, hMin: 160, hMax: 560, tone: 0, glass: 0.6 }) +
    river(Dd, PAL.day, 1160, 1460, { bendA: 30, bendB: 20 }) + path('M -100 1250 L 1180 1230', { stroke: '#f1ede6', 'stroke-width': 14 }) + path('M 260 1242 L 540 1110 L 820 1236', { stroke: '#f1ede6', 'stroke-width': 4, fill: 'none' }) + rect(532, 1100, 16, 140, { fill: '#f1ede6' }) +
    rect(-100, 1460, 1300, 500, { fill: '#cfc5b3' }) + rect(-100, 1460, 1300, 16, { fill: '#9e9585' }), Dd.join(''), 'layer');
  let walkers = '';
  for (let i = 0; i < 8; i++) walkers += person(80 + i * 130, 1640 + (i % 3) * 60, 1.3, { col: ['#2f4a7a', '#b5482f', '#3b6f4f', '#6a4c93'][i % 4], kind: i % 4 === 1 ? 'child' : 'adult', flip: i % 2 === 0 });
  const wl = svgLayer(d, walkers, '', 'layer');
  show(tl, d, T[2] - 0.05, T[3] + 0.15, 0.15, 0.2);
  tl.fromTo(d, { x: 40, scale: 1.08 }, { x: -40, scale: 1.0, duration: T[3] - T[2] + 0.2, ease: 'none' }, T[2]);
  walk(tl, wl, T[2] - 0.1, T[3] + 0.2, 50);

  // E — visitors taking photos in front of Baiterek
  const e = shot(el, 'e');
  const De = [];
  svgLayer(e, sky(De, PAL.golden, { sunX: 300, sunY: 900 }) + clouds(De, 138, 5, 200, 700, '#ffe2c4', 0.6) + baiterek(De, 560, 1450, 11, { glow: 0.6 }) + rect(-100, 1450, 1300, 500, { fill: '#d9ccb4' }), De.join(''), 'layer');
  let tourists = '';
  for (let i = 0; i < 7; i++) tourists += person(70 + i * 160, 1700 + (i % 2) * 60, 1.9, { col: ['#24313f', '#c7563f', '#2d6f8c', '#e0a12f', '#3b6f4f', '#6a4c93', '#b5482f'][i], kind: i % 2 ? 'photo' : 'adult', flip: false });
  const ts = svgLayer(e, tourists, '', 'layer');
  show(tl, e, T[3] - 0.05, T[4] + 0.2, 0.15, 0.3);
  tl.fromTo(e, { scale: 1.1 }, { scale: 1.0, duration: T[4] - T[3] + 0.3, ease: 'power1.out' }, T[3]);
  qa(ts, '.flash').forEach((f, i) => tl.fromTo(f, { fill: '#cfe8ff' }, { fill: '#ffffff', duration: 0.08, repeat: 3, yoyo: true }, T[3] + 0.4 + i * 0.27));

  // F — evening skyline panorama with reflections
  const f = shot(el, 'f');
  const Df = [];
  const city = skyline(Df, 139, PAL.dusk, { y: 1240, hMin: 160, hMax: 620, tone: 0, glass: 0.6, lit: true });
  const marks = khanShatyr(Df, 170, 1245, 1.5, { glow: 0.5 }) + baiterek(Df, 560, 1245, 6, { glow: 0.95 }) + akOrda(Df, 930, 1245, 1.2);
  svgLayer(f, sky(Df, PAL.dusk, { sunX: 120, sunY: 1210, sunR: 50, stars: true, seed: 13 }) + city + marks +
    river(Df, PAL.dusk, 1245, 1920, { bendA: 0, bendB: 0 }) +
    g(city + marks, { transform: 'translate(0 2490) scale(1 -1)', opacity: 0.22 }), Df.join(''), 'layer');
  show(tl, f, T[4] - 0.1, 107.4, 0.3, 0.3);
  tl.fromTo(f, { scale: 1.2, y: 120 }, { scale: 1.0, y: 0, duration: 107.4 - T[4], ease: 'sine.out' }, T[4] - 0.1);
}
