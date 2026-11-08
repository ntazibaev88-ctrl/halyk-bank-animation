// S2 · 12–30 s · History: Akmola fortress (1830) -> town (1862) -> Tselinograd
// (1961) -> capital moves from Almaty (1997) -> named Astana (1998).
import { svgLayer, q, qa, g, path, circle } from '../lib/core.js';
import { PAL, sky, clouds, hills, river, fortress, yurt, horseRider, logHouse, sovietBlock, wheat, skyline, baiterek } from '../lib/art.js';
import { kazakhstan, CITIES } from '../lib/maps.js';
import { scene, show, sway, rise, pop, draw } from '../lib/anim.js';

export function s2(stage, tl, C) {
  const el = scene(stage, 's2');
  const Y = C.years;
  // ---- panel A/B/C: the settlement grows (sepia illustration)
  const pa = document.createElement('div'); pa.className = 'world'; el.appendChild(pa);
  const D = [];
  svgLayer(pa, sky(D, PAL.sepia, { sunX: 250, sunY: 620, sunR: 70 }) + clouds(D, 31, 7, 280, 760, '#fff8e8', 0.7), D.join(''), 'layer');
  const far = svgLayer(pa, hills([], 41, 1080, 40, '#d6c39b'), '', 'layer far');
  const Ds = [];
  let blocks = '';
  for (let i = 0; i < 9; i++) { const b = sovietBlock(-60 + i * 135, 1170, 120, 160 + (i % 3) * 70, '#c9bda5', '#6f6658'); Ds.push(b.def); blocks += b.svg; }
  const soviet = svgLayer(pa, blocks, Ds.join(''), 'layer soviet');
  const Dh = [];
  let houses = '';
  const hp = [[150, 1200], [260, 1230], [840, 1210], [940, 1240], [80, 1260], [990, 1275], [380, 1275], [700, 1270], [560, 1285], [200, 1300], [880, 1305]];
  hp.forEach(([x, y], i) => { houses += logHouse(x, y, 0.85 + (i % 3) * 0.1); });
  const town = svgLayer(pa, houses, '', 'layer town');
  const Df = [];
  const fort = svgLayer(pa, fortress(Df, 540, 1250, 1.05), Df.join(''), 'layer fort');
  const yurts = svgLayer(pa, yurt(120, 1340, 1.1) + yurt(250, 1360, 0.95) + yurt(880, 1345, 1.05) + yurt(990, 1370, 0.9) + yurt(760, 1385, 0.8), '', 'layer yurts');
  const movers = svgLayer(pa, horseRider(-120, 1420, 1.0, '#5a3e28') + horseRider(-320, 1440, 0.9, '#6a4a30', false, true) + horseRider(1220, 1410, 0.85, '#4a3220', true), '', 'layer movers');
  const Dr = [];
  const riv = svgLayer(pa, river(Dr, PAL.sepia, 1470, 1640, { bendA: 40, bendB: 30 }), Dr.join(''), 'layer riv');
  const near = svgLayer(pa, hills([], 42, 1780, 40, '#a88a5c', '#7d6340'), '', 'layer near');
  const wheatL = svgLayer(pa, wheat(9, -200, 1300, 1820, 120, '#d9a94a'), '', 'layer wheat');

  show(tl, pa, 11.6, Y['1997'] + 0.3, 0.4, 0.5);
  tl.fromTo(pa, { scale: 1.12, x: 30 }, { scale: 1.0, x: -30, duration: Y['1997'] - 11.6, ease: 'sine.inOut' }, 11.6);
  [[far, 20], [riv, 50], [near, 90], [movers, 0]].forEach(([l, d]) => tl.fromTo(l, { x: 0 }, { x: -d, duration: 11, ease: 'none' }, 11.6));
  qa(movers, '.mover').forEach((m, i) => { const dir = i === 2 ? -1 : 1; tl.fromTo(m, { x: 0 }, { x: dir * (700 + i * 120), duration: 10, ease: 'none' }, 11.6); });
  // 1862: town grows around the fort
  tl.set(qa(town, '.house'), { scale: 0, opacity: 0 }, 0);
  pop(tl, qa(town, '.house'), Y['1862'] - 0.1, 0.12, 0.5);
  // 1961: Tselinograd — wheat of the Virgin Lands and Soviet blocks
  tl.set(soviet, { opacity: 0 }, 0);
  tl.to(soviet, { opacity: 1, duration: 0.3 }, Y['1961'] - 0.2);
  rise(tl, qa(soviet, '.bld'), Y['1961'] - 0.2, 0.7, 0.05);
  tl.to([fort, yurts, movers], { opacity: 0, duration: 0.6 }, Y['1961'] - 0.3);
  tl.to(town, { opacity: 0.35, duration: 0.6 }, Y['1961'] - 0.3);
  tl.fromTo(wheatL, { y: 300 }, { y: 0, duration: 0.9, ease: 'power3.out' }, Y['1961'] - 0.3);
  sway(tl, qa(wheatL, '.blade'), Y['1961'] - 0.4, Y['1997'] + 0.5, 5, 2.4, 0.5);
  tl.set(wheatL, { y: 300 }, 0);
  tl.fromTo(pa, { filter: 'saturate(1) hue-rotate(0deg)' }, { filter: 'saturate(0.75) hue-rotate(-12deg)', duration: 0.5 }, Y['1961'] - 0.3);

  // ---- panel D: the capital moves from Almaty to Akmola (1997)
  const pd = document.createElement('div'); pd.className = 'world mapbg'; el.appendChild(pd);
  const kz = kazakhstan(70, 800, 940, { fill: '#efe2c4', stroke: '#8a6a3e' });
  const [ax, ay] = kz.P(CITIES.almaty), [sx, sy] = kz.P(CITIES.astana);
  const arc = `M ${ax} ${ay} Q ${(ax + sx) / 2 + 140} ${(ay + sy) / 2 - 60} ${sx} ${sy}`;
  const mapL = svgLayer(pd,
    `<rect width="1080" height="1920" fill="#f3e7cc"/>` +
    kz.svg +
    path(arc, { stroke: '#c2462f', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', class: 'arc', 'stroke-dasharray': '1 0' }) +
    g(circle(ax, ay, 12, { fill: '#8a6a3e' }) + `<text x="${ax}" y="${ay + 52}" class="mapcity" text-anchor="middle">Алматы</text>`, { class: 'almaty' }) +
    g(circle(sx, sy, 30, { fill: '#e2b04a', opacity: 0.35, class: 'ping' }) + circle(sx, sy, 15, { fill: '#c2462f' }) + `<text x="${sx}" y="${sy - 34}" class="mapcity strong" text-anchor="middle">Ақмола</text>`, { class: 'astana' }),
    '', 'layer');
  show(tl, pd, Y['1997'] - 0.1, Y['1998'] + 0.4, 0.4, 0.5);
  draw(tl, q(mapL, '.kz'), Y['1997'] - 0.1, 1.2);
  tl.fromTo(q(mapL, '.kz'), { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.8 }, Y['1997'] + 0.6);
  tl.fromTo(q(mapL, '.almaty'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, Y['1997'] + 0.6);
  draw(tl, q(mapL, '.arc'), Y['1997'] + 1.2, 1.4);
  tl.fromTo(q(mapL, '.astana'), { opacity: 0, scale: 0.5, transformOrigin: `${sx}px ${sy}px` }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', transformOrigin: `${sx}px ${sy}px` }, Y['1997'] + 2.4);
  tl.fromTo(q(mapL, '.ping'), { scale: 0.6, opacity: 0.6, transformOrigin: `${sx}px ${sy}px` }, { scale: 2.6, opacity: 0, duration: 1, repeat: 2, ease: 'power1.out', transformOrigin: `${sx}px ${sy}px` }, Y['1997'] + 2.6);
  tl.fromTo(pd, { scale: 1 }, { scale: 1.08, duration: 5, ease: 'sine.inOut' }, Y['1997']);

  // ---- panel E: 1998 — the young capital gets its name
  const pe = document.createElement('div'); pe.className = 'world'; el.appendChild(pe);
  const De = [];
  svgLayer(pe, sky(De, PAL.golden, { sunX: 760, sunY: 1050 }) + clouds(De, 51, 5, 300, 700, '#ffe8cc', 0.5), De.join(''), 'layer');
  const De2 = [];
  const early = svgLayer(pe, skyline(De2, 61, PAL.golden, { y: 1300, hMin: 80, hMax: 300, tone: 1, glass: 0.2, wMin: 60, wMax: 120 }), De2.join(''), 'layer');
  const De3 = [];
  const rv = svgLayer(pe, river(De3, PAL.golden, 1300, 1420) + hills([], 62, 1650, 30, '#6a5040', '#3e2f28'), De3.join(''), 'layer');
  show(tl, pe, Y['1998'] - 0.2, 30.5, 0.5, 0.5);
  rise(tl, qa(early, '.bld'), Y['1998'] - 0.1, 0.9, 0.04);
  tl.fromTo(pe, { scale: 1.06, filter: 'sepia(0.7)' }, { scale: 1.0, filter: 'sepia(0)', duration: 3.4, ease: 'sine.inOut' }, Y['1998'] - 0.2);
}
