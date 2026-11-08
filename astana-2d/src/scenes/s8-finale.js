// S8 · 107–120 s · Finale: sunset turns into a sparkling night over Ak Orda,
// Baiterek and Khan Shatyr; the national flag waves in the foreground.
import { svgLayer, q, qa, g, path, rect, circle } from '../lib/core.js';
import { PAL, sky, clouds, river, skyline, baiterek, khanShatyr, akOrda, flag } from '../lib/art.js';
import { scene, show } from '../lib/anim.js';

export function s8(stage, tl, C) {
  const el = scene(stage, 's8');
  const world = document.createElement('div'); world.className = 'world'; el.appendChild(world);
  const Dg = [], Dn = [];
  svgLayer(world, sky(Dg, PAL.golden, { sunX: 300, sunY: 1180, sunR: 70 }) + clouds(Dg, 141, 6, 250, 800, '#ffd9b0', 0.6), Dg.join(''), 'layer');
  const night = svgLayer(world, sky(Dn, PAL.night, { sunX: 880, sunY: 260, sunR: 26, stars: true, seed: 21 }), Dn.join(''), 'layer');
  const D1 = [], D1n = [];
  const cityDay = skyline(D1, 151, PAL.golden, { y: 1260, hMin: 160, hMax: 560, tone: 0, glass: 0.6 });
  const cityNight = skyline(D1n, 151, PAL.night, { y: 1260, hMin: 160, hMax: 560, tone: 0, glass: 0.6, lit: true });
  const cd = svgLayer(world, cityDay, D1.join(''), 'layer');
  const cn = svgLayer(world, cityNight, D1n.join(''), 'layer');
  const Dm = [];
  const marks = svgLayer(world, khanShatyr(Dm, 170, 1268, 1.7) + baiterek(Dm, 560, 1268, 6.0, { glow: 0.4 }) + akOrda(Dm, 920, 1268, 1.4), Dm.join(''), 'layer');
  const Dr = [];
  const riv = svgLayer(world, river(Dr, PAL.golden, 1268, 1920, { bendA: 0, bendB: 0 }) + g(cityNight, { transform: 'translate(0 2536) scale(1 -1)', opacity: 0.2, class: 'refl' }), Dr.join(''), 'layer');
  // fireworks sparkles (deterministic bursts)
  let fw = '';
  [[260, 520, '#ffd27a'], [800, 430, '#7fd6ff'], [560, 330, '#ffffff']].forEach(([x, y, c], k) => {
    let rays = '';
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; rays += path(`M ${x + Math.cos(a) * 14} ${y + Math.sin(a) * 14} L ${x + Math.cos(a) * 70} ${y + Math.sin(a) * 70}`, { stroke: c, 'stroke-width': 3, 'stroke-linecap': 'round' }); }
    fw += g(rays + circle(x, y, 6, { fill: c }), { class: `fw fw${k}`, style: `transform-origin:${x}px ${y}px` });
  });
  const fws = svgLayer(world, fw, '', 'layer');
  // waving flag: the flag image split into vertical strips that ripple
  const FW = 520, FH = 260, N = 26;
  const flagWrap = document.createElement('div'); flagWrap.className = 'flagwrap'; el.appendChild(flagWrap);
  let strips = '';
  for (let i = 0; i < N; i++) {
    const x = (FW / N) * i;
    strips += `<g class="strip" clip-path="url(#fs${i})"><clipPath id="fs${i}"><rect x="${x - 0.5}" y="-20" width="${FW / N + 1}" height="${FH + 40}"/></clipPath>${flag(FW, FH)}</g>`;
  }
  flagWrap.innerHTML = `<svg width="620" height="980" viewBox="-40 -40 620 980"><rect x="-14" y="-30" width="10" height="980" rx="5" fill="#d9dde2"/><circle cx="-9" cy="-32" r="10" fill="#e2b04a"/><g class="flag" transform="translate(-4 0)">${strips}</g></svg>`;

  show(tl, el, 106.6, 999, 0.4);
  tl.fromTo(world, { scale: 1.22, y: 140 }, { scale: 1.0, y: 0, duration: 13.4, ease: 'sine.inOut' }, 106.6);
  tl.fromTo(night, { opacity: 0 }, { opacity: 1, duration: 5, ease: 'none' }, 109.5);
  tl.fromTo(cn, { opacity: 0 }, { opacity: 1, duration: 3.5, ease: 'none' }, 110.5);
  tl.fromTo(q(marks, '.halo'), { opacity: 0.3 }, { opacity: 1, duration: 3 }, 110.5);
  tl.fromTo(q(marks, '.ksglow'), { opacity: 0 }, { opacity: 0.55, duration: 3 }, 111);
  tl.fromTo(q(riv, '.refl'), { opacity: 0 }, { opacity: 0.22, duration: 3 }, 111);
  qa(fws, '.fw').forEach((f, k) => {
    const t0 = C.finalChord - 0.2 + k * 0.55;
    tl.fromTo(f, { scale: 0.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, t0);
    tl.to(f, { opacity: 0, scale: 1.25, duration: 1.0, ease: 'power1.in' }, t0 + 0.5);
  });
  tl.set(qa(fws, '.fw'), { opacity: 0 }, 0);
  // flag ripple: each strip moves vertically on a phase-shifted sine (yoyo)
  qa(flagWrap, '.strip').forEach((s, i) => {
    const amp = 4 + 22 * (i / N);
    tl.fromTo(s, { y: -amp }, { y: amp, duration: 0.55, repeat: 24, yoyo: true, ease: 'sine.inOut' }, 106.6 - (i / N) * 0.55 * 2);
  });
  tl.fromTo(flagWrap, { x: -200, rotation: -3 }, { x: 0, rotation: 0, duration: 2.2, ease: 'power3.out' }, 107.2);
  tl.set(flagWrap, { x: -200 }, 0);
}
