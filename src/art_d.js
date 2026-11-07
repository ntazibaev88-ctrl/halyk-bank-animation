// Machinery module art: detailed pump unit (motor, coupling under guard, shaft, bearings, seal, impeller),
// rotation integrator, extra icons.

ICON.bottle = `<path d="M-8 -46 H8 V-28 Q22 -18 22 0 V38 Q22 46 14 46 H-14 Q-22 46 -22 38 V0 Q-22 -18 -8 -28Z" fill="#fff"/><rect x="-22" y="4" width="44" height="22" fill="#e0600a"/>`;
ICON.pills = `<g transform="rotate(-35)"><rect x="-34" y="-14" width="68" height="28" rx="14" fill="#fff"/><rect x="0" y="-14" width="34" height="28" rx="14" fill="#e0600a"/><rect x="-2" y="-14" width="6" height="28" fill="#e0600a"/></g><circle cx="22" cy="26" r="14" fill="#fff"/><line x1="12" y1="26" x2="32" y2="26" stroke="#e0600a" stroke-width="4"/>`;
ICON.lever = `<rect x="-40" y="16" width="80" height="22" rx="6" fill="#fff"/><path d="M0 20 L18 -30" stroke="#fff" stroke-width="10" stroke-linecap="round"/><circle cx="20" cy="-34" r="12" fill="#e0600a"/>`;
ICON.sick = `<circle r="40" fill="#fff"/><path d="M-22 -14 l10 8 M-22 -6 l10 -8 M12 -14 l10 8 M12 -6 l10 -8" stroke="#e0600a" stroke-width="5" stroke-linecap="round"/><path d="M-16 20 Q-8 12 0 20 Q8 28 16 20" stroke="#e0600a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
ICON.bolt = `<path d="M8 -44 L-24 6 L-2 6 L-10 44 L24 -8 L2 -8 L12 -44Z" fill="#fff"/>`;

// speed profile → angle (deg). ramps: [[t0, t1, v0, v1], ...] (speed in deg/s, piecewise linear; before first ramp: 0)
function spinAngle(t, ramps) {
  const sp = x => { let v = 0; for (const [a, b, v0, v1] of ramps) { if (x >= b) v = v1; else if (x >= a) v = lerp(v0, v1, (x - a) / (b - a)); } return v; };
  let ang = 0; const dt = 1 / 30;
  for (let x = 0; x < t; x += dt) ang += sp(x) * Math.min(dt, t - x);
  return { ang, speed: sp(t) };
}

function pumpUnitSVG(p) {
  let fins = ''; for (let i = 0; i < 12; i++) fins += `<rect x="${-400 + i * 24}" y="-110" width="8" height="220" rx="4" fill="#174a99"/>`;
  return `<g data-k="${p}root"><g data-k="${p}vib">
    <rect x="-450" y="112" width="910" height="30" rx="6" fill="#2a3e5f"/>${[-420, -150, 60, 420].map(x => `<circle cx="${x}" cy="127" r="7" fill="#9db6d6"/>`).join('')}
    <rect x="-400" y="96" width="40" height="18" fill="#2a3e5f"/><rect x="-170" y="96" width="40" height="18" fill="#2a3e5f"/>
    <!-- motor -->
    <rect x="-420" y="-112" width="310" height="224" rx="40" fill="url(#tankH)"/>${fins}
    <rect x="-446" y="-96" width="34" height="192" rx="14" fill="#2a3e5f"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="-440" y1="${-80 + i * 32}" x2="-418" y2="${-80 + i * 32}" stroke="#5f7da6" stroke-width="5"/>`).join('')}
    <rect x="-330" y="-158" width="110" height="50" rx="8" fill="#1f5fbf"/><rect x="-316" y="-148" width="82" height="30" rx="4" fill="#13264a"/>
    <g data-k="${p}smokeAt" transform="translate(-275 -160)"></g>
    <rect x="-110" y="-16" width="56" height="32" fill="url(#steelH)"/>
    <!-- coupling -->
    <g transform="translate(-36 0)"><rect x="-22" y="-62" width="22" height="124" rx="6" fill="#9db6d6"/><rect x="6" y="-62" width="22" height="124" rx="6" fill="#7f9cc4"/>
      <g data-k="${p}cpl"></g></g>
    <!-- shaft + bearings -->
    <rect x="-8" y="-15" width="190" height="30" fill="url(#steelH)"/><g data-k="${p}sh"></g>
    ${[[20, 'b1'], [104, 'b2']].map(([x, k]) => `<g><rect x="${x}" y="-62" width="62" height="124" rx="12" fill="#3f74c4"/><rect x="${x - 6}" y="-70" width="74" height="18" rx="6" fill="#2a56a0"/><rect x="${x - 6}" y="52" width="74" height="18" rx="6" fill="#2a56a0"/>
      <circle data-k="${p}${k}" cx="${x + 31}" cy="0" r="80" fill="url(#glowR)" opacity="0"/></g>`).join('')}
    <rect x="178" y="-44" width="22" height="88" rx="4" fill="#5f7da6"/><g data-k="${p}drip"></g>
    <!-- pump casing (cutaway) -->
    <rect x="350" y="-290" width="70" height="170" fill="url(#pipeBV)"/><rect x="340" y="-300" width="90" height="20" rx="4" fill="#5c7fb5"/>
    <circle cx="330" cy="0" r="142" fill="url(#tankV)"/><circle cx="330" cy="0" r="112" fill="#0a1630"/>
    <g transform="translate(330 0)"><g data-k="${p}imp"><circle r="26" fill="#5f7da6"/>${vanes(7, 24, 100, 38, 14, '#9db6d6')}<circle r="12" fill="#ff8a1f"/></g></g>
    <g data-k="${p}water"></g>
    <!-- guard over coupling -->
    <g data-k="${p}guard"><rect x="-84" y="-88" width="96" height="176" rx="14" fill="#ff8a1f" fill-opacity="0.18" stroke="#ff8a1f" stroke-width="7"/>
      ${[0, 1, 2, 3, 4].map(i => `<line x1="${-78 + i * 20}" y1="-84" x2="${-78 + i * 20}" y2="84" stroke="#ff8a1f" stroke-opacity="0.45" stroke-width="3"/>`).join('')}</g>
    <g data-k="${p}lockTag" opacity="0"><g transform="translate(-265 -170)"><path d="M-14 0 L-14 -16 A14 14 0 0 1 14 -16 L14 0" stroke="#c9d3e0" stroke-width="7" fill="none"/><rect x="-22" y="-2" width="44" height="36" rx="7" fill="#ff8a1f"/><circle cy="14" r="5" fill="#1a0d00"/></g></g>
  </g></g>`;
}
class PumpUnit {
  constructor(parent, p, o = {}) {
    this.g = svgFrag(pumpUnitSVG(p)); parent.appendChild(this.g); this.r = refs(this.g); this.p = p;
    const k = n => this.r[p + n];
    this.k = k;
    this.cpl = [...Array(5)].map(() => { const e = document.createElementNS(SVGNS, 'rect'); e.setAttribute('x', -22); e.setAttribute('width', 50); e.setAttribute('fill', '#1f3f7a'); k('cpl').appendChild(e); return e; });
    this.sh = [...Array(5)].map(() => { const e = document.createElementNS(SVGNS, 'rect'); e.setAttribute('x', -8); e.setAttribute('width', 190); e.setAttribute('fill', '#2a3e5f'); k('sh').appendChild(e); return e; });
    this.drops = [...Array(6)].map(() => { const e = document.createElementNS(SVGNS, 'ellipse'); e.setAttribute('rx', 5); e.setAttribute('ry', 8); e.setAttribute('fill', '#7cc4ff'); k('drip').appendChild(e); return e; });
    this.smoke = new Puffs(k('smokeAt'), 10, { x: 0, y: 0, life: 2.2, rise: 200, wind: 30, r0: 10, r1: 50, a: 0.7, fill: 'url(#smoke)', spread: 30, seed: 91 });
    this.waterPath = document.createElementNS(SVGNS, 'path'); this.waterPath.setAttribute('d', 'M330 0 Q390 -60 385 -130 L385 -300'); this.waterPath.setAttribute('fill', 'none'); k('water').appendChild(this.waterPath);
    this.flow = new Flow(k('water'), this.waterPath, 12, { r: 8, color: '#9fd2ff', speed: 0.6 });
  }
  set(o) {
    const k = this.k, t = o.t || 0, ang = o.ang || 0, sp = clamp((o.speed || 0) / 600);
    T(k('root'), o.x || 0, o.y || 0, o.s || 1, 0, o.o === undefined ? 1 : o.o);
    const v = o.vib || 0;
    T(k('vib'), Math.sin(t * 60) * 5 * v, Math.cos(t * 47) * 4 * v, 1);
    T(k('imp'), 0, 0, 1, ang);
    const stripes = (els, h, offs) => els.forEach((e, i) => {
      const ph = ((ang / 360 + i / els.length + offs) % 1 + 1) % 1 * Math.PI; const y = -Math.cos(ph) * h, hh = Math.max(2, Math.sin(ph) * h * 0.35);
      e.setAttribute('y', (y - hh / 2).toFixed(1)); e.setAttribute('height', hh.toFixed(1)); e.setAttribute('opacity', (0.15 + 0.6 * Math.sin(ph)).toFixed(2));
    });
    stripes(this.cpl, 58, 0); stripes(this.sh, 13, 0.1);
    O(k('guard'), o.guard === undefined ? 1 : o.guard);
    O(k('b1'), (o.heat || 0) * (0.7 + 0.3 * pulse(t, 1.5))); O(k('b2'), (o.heat || 0) * 0.6 * (0.7 + 0.3 * pulse(t, 1.5)));
    this.drops.forEach((d, i) => { const ph = (t * 0.9 + i / 6) % 1; d.setAttribute('cx', 189 + (i % 2 ? 6 : -6)); d.setAttribute('cy', (40 + ph * 70).toFixed(0)); d.setAttribute('opacity', ((o.leak || 0) * Math.sin(Math.PI * ph)).toFixed(2)); });
    this.smoke.update(t, o.smoke || 0);
    this.flow.update(t, sp);
    O(k('lockTag'), o.locked ? 1 : 0);
  }
}
