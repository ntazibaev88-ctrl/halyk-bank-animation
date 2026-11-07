// Small deterministic animation helpers. Everything is a pure function of time.
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, d) => clamp((t - a) / d);
const E = {
  lin: t => t,
  inCubic: t => t * t * t,
  outCubic: t => 1 - Math.pow(1 - t, 3),
  outQuart: t => 1 - Math.pow(1 - t, 4),
  outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: t => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
};
// 0..1 eased progress of an event starting at `a` lasting `d`
const ep = (t, a, d, ease = E.outCubic) => ease(prog(t, a, d));
// in-hold-out envelope
const env = (t, a, b, fin = 0.3, fout = 0.3) => Math.min(ep(t, a, fin), 1 - ep(t, b - fout, fout, E.inCubic));
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pulse = (t, f = 1) => 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * f);

const SVGNS = 'http://www.w3.org/2000/svg';
function html(str) { const d = document.createElement('div'); d.innerHTML = str.trim(); return d.firstChild; }
function svgFrag(str) { // parse svg markup into a <g>
  const s = document.createElementNS(SVGNS, 'svg');
  s.innerHTML = str;
  const g = document.createElementNS(SVGNS, 'g');
  while (s.firstChild) g.appendChild(s.firstChild);
  return g;
}
// collect [data-k] refs
function refs(root) {
  const r = {};
  root.querySelectorAll('[data-k]').forEach(e => { r[e.getAttribute('data-k')] = e; });
  return r;
}
// set transform/opacity on svg or html elements
function T(el, x = 0, y = 0, s = 1, r = 0, o) {
  if (!el) return;
  const sx = Array.isArray(s) ? s[0] : s, sy = Array.isArray(s) ? s[1] : s;
  if (el instanceof SVGElement) {
    el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`);
  } else {
    el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
  }
  if (o !== undefined) O(el, o);
}
function O(el, o) {
  if (!el) return;
  o = clamp(o);
  if (el instanceof SVGElement) el.setAttribute('opacity', o.toFixed(3));
  else el.style.opacity = o.toFixed(3);
  const hide = o <= 0.001;
  if (el instanceof SVGElement) { if (el.style.display !== (hide ? 'none' : '')) el.style.display = hide ? 'none' : ''; }
  else el.style.visibility = hide ? 'hidden' : '';
}
// standard "pop in" for an element: fade + rise + scale
function popIn(el, t, at, opt = {}) {
  const d = opt.d || 0.55, k = ep(t, at, d, opt.ease || E.outBack);
  const ko = ep(t, at, d * 0.6);
  const x = opt.x || 0, y = opt.y || 0, dy = opt.dy === undefined ? 40 : opt.dy, dx = opt.dx || 0;
  const s0 = opt.s0 === undefined ? 0.85 : opt.s0, s = opt.s || 1;
  let o = ko;
  if (opt.out !== undefined) o *= 1 - ep(t, opt.out, opt.od || 0.35, E.inCubic);
  T(el, x + dx * (1 - k), y + dy * (1 - k), s * lerp(s0, 1, k), opt.r || 0, o);
  return k;
}
// polar point
const pol = (cx, cy, r, aDeg) => [cx + r * Math.cos(aDeg * Math.PI / 180), cy + r * Math.sin(aDeg * Math.PI / 180)];
// arc path for gauges
function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}
// stroke draw-on effect (needs pathLength=1 on the element)
function draw(el, k) { if (el) { el.setAttribute('stroke-dasharray', '1 1'); el.setAttribute('stroke-dashoffset', (1 - clamp(k)).toFixed(4)); } }

// gear path generator
function gearD(cx, cy, ro, ri, n) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 360, s = 360 / n;
    const pts = [[ri, a], [ro, a + s * 0.12], [ro, a + s * 0.42], [ri, a + s * 0.54]];
    pts.forEach(([r, aa], j) => { const [x, y] = pol(cx, cy, r, aa); d += (i === 0 && j === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' '; });
  }
  return d + 'Z';
}

