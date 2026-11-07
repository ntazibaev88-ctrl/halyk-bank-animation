// Shared SVG gradients (one global <defs>, referenced by every scene)
document.getElementById('gdefs').innerHTML = `
  <radialGradient id="puff"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.55" stop-color="#e8f0fa" stop-opacity="0.35"/><stop offset="1" stop-color="#dfe8f5" stop-opacity="0"/></radialGradient>
  <radialGradient id="puffD"><stop offset="0" stop-color="#9fb0c6" stop-opacity="0.8"/><stop offset="0.6" stop-color="#6d7f99" stop-opacity="0.3"/><stop offset="1" stop-color="#4c5d77" stop-opacity="0"/></radialGradient>
  <radialGradient id="smoke"><stop offset="0" stop-color="#5a5f68" stop-opacity="0.85"/><stop offset="0.6" stop-color="#3a3f48" stop-opacity="0.35"/><stop offset="1" stop-color="#2a2f38" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowO"><stop offset="0" stop-color="#ffb347" stop-opacity="0.95"/><stop offset="0.35" stop-color="#ff8a1f" stop-opacity="0.45"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowR"><stop offset="0" stop-color="#ff6b6b" stop-opacity="1"/><stop offset="0.3" stop-color="#ff3b3b" stop-opacity="0.5"/><stop offset="1" stop-color="#ff2020" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowB"><stop offset="0" stop-color="#9fd2ff" stop-opacity="0.9"/><stop offset="0.4" stop-color="#2f86ff" stop-opacity="0.35"/><stop offset="1" stop-color="#2f86ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowY"><stop offset="0" stop-color="#fff2b0" stop-opacity="1"/><stop offset="0.35" stop-color="#ffd23f" stop-opacity="0.5"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowG"><stop offset="0" stop-color="#b8ffd0" stop-opacity="1"/><stop offset="0.35" stop-color="#2ecc71" stop-opacity="0.5"/><stop offset="1" stop-color="#2ecc71" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowW"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <radialGradient id="spot" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#2a5db0" stop-opacity="0.55"/><stop offset="1" stop-color="#0a1630" stop-opacity="0"/></radialGradient>
  <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040a1c"/><stop offset="0.55" stop-color="#0b1d45"/><stop offset="0.8" stop-color="#16346e"/><stop offset="1" stop-color="#22457f"/></linearGradient>
  <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1f4d"/><stop offset="0.5" stop-color="#1f4f9a"/><stop offset="0.78" stop-color="#5d86c4"/><stop offset="0.92" stop-color="#f3a35a"/><stop offset="1" stop-color="#ffcf7a"/></linearGradient>
  <linearGradient id="bgNavy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#081329"/><stop offset="0.5" stop-color="#0d1f45"/><stop offset="1" stop-color="#081329"/></linearGradient>
  <linearGradient id="bgRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0710"/><stop offset="0.5" stop-color="#2a0b16"/><stop offset="1" stop-color="#0c0710"/></linearGradient>
  <linearGradient id="steelH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f6c95"/><stop offset="0.25" stop-color="#9db6d6"/><stop offset="0.5" stop-color="#5f7da6"/><stop offset="1" stop-color="#2a3e5f"/></linearGradient>
  <linearGradient id="steelV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a3e5f"/><stop offset="0.3" stop-color="#7f9cc4"/><stop offset="0.45" stop-color="#a9c0dd"/><stop offset="0.7" stop-color="#4f6c95"/><stop offset="1" stop-color="#22344f"/></linearGradient>
  <linearGradient id="pipeO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8560a"/><stop offset="0.3" stop-color="#ffab5c"/><stop offset="0.6" stop-color="#ff8a1f"/><stop offset="1" stop-color="#8a3d05"/></linearGradient>
  <linearGradient id="pipeOV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a3d05"/><stop offset="0.35" stop-color="#ffab5c"/><stop offset="0.6" stop-color="#ff8a1f"/><stop offset="1" stop-color="#8a3d05"/></linearGradient>
  <linearGradient id="pipeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#123a7a"/><stop offset="0.3" stop-color="#5aa2ff"/><stop offset="0.6" stop-color="#2f6fd0"/><stop offset="1" stop-color="#0d2b5c"/></linearGradient>
  <linearGradient id="pipeBV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d2b5c"/><stop offset="0.35" stop-color="#5aa2ff"/><stop offset="0.6" stop-color="#2f6fd0"/><stop offset="1" stop-color="#0d2b5c"/></linearGradient>
  <linearGradient id="tankV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b3766"/><stop offset="0.3" stop-color="#3f74c4"/><stop offset="0.42" stop-color="#6aa3f0"/><stop offset="0.7" stop-color="#2a56a0"/><stop offset="1" stop-color="#132a52"/></linearGradient>
  <linearGradient id="tankH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b3766"/><stop offset="0.25" stop-color="#6aa3f0"/><stop offset="0.5" stop-color="#3f74c4"/><stop offset="1" stop-color="#132a52"/></linearGradient>
  <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd23f"/><stop offset="0.45" stop-color="#ff8a1f"/><stop offset="1" stop-color="#ff3b1f" stop-opacity="0"/></linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ab4ff" stop-opacity="0.9"/><stop offset="1" stop-color="#1c5fc0" stop-opacity="0.95"/></linearGradient>
  <linearGradient id="hotgas" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff8a1f" stop-opacity="0"/><stop offset="0.5" stop-color="#ff8a1f" stop-opacity="0.9"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></linearGradient>
  <linearGradient id="cardG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c3d7a"/><stop offset="1" stop-color="#0c1c3d"/></linearGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e9f2"/></linearGradient>
  <linearGradient id="beamY" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd23f" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></linearGradient>
  <linearGradient id="beamR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff3b3b" stop-opacity="0.6"/><stop offset="1" stop-color="#ff3b3b" stop-opacity="0"/></linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#081329" stop-opacity="0"/><stop offset="1" stop-color="#081329" stop-opacity="1"/></linearGradient>
  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0 L0 0 0 60" fill="none" stroke="#3d7fd9" stroke-opacity="0.18" stroke-width="1.5"/></pattern>
  <pattern id="gridS" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 L0 0 0 20" fill="none" stroke="#3d7fd9" stroke-opacity="0.08" stroke-width="1"/></pattern>
  <pattern id="hazard" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="28" height="56" fill="#ffd23f"/><rect x="28" width="28" height="56" fill="#1a1a1a"/></pattern>
  <pattern id="grate" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#16253f"/><path d="M0 12 H24 M12 0 V24" stroke="#24395e" stroke-width="3"/></pattern>
`;

// Particle system for steam/smoke puffs: deterministic, a function of time.
class Puffs {
  constructor(parent, n, o) {
    this.o = Object.assign({ x: 0, y: 0, life: 4, rise: 300, wind: 60, r0: 18, r1: 80, a: 0.7, fill: 'url(#puff)', spread: 10, seed: 1 }, o);
    this.g = document.createElementNS(SVGNS, 'g'); parent.appendChild(this.g);
    this.els = [];
    for (let i = 0; i < n; i++) { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('fill', this.o.fill); c.setAttribute('r', '1'); this.g.appendChild(c); this.els.push(c); }
  }
  update(t, intensity = 1) {
    const o = this.o, n = this.els.length;
    this.els.forEach((c, i) => {
      const sd = o.seed * 100 + i;
      const ph = ((t / o.life + i / n + rnd(sd) * 0.3) % 1 + 1) % 1;
      const wob = Math.sin(t * 1.3 + i) * 12 * ph;
      const x = o.x + (rnd(sd + 7) - 0.5) * o.spread + o.wind * ph + wob + (o.dirX || 0) * ph * o.rise;
      const y = o.y - (o.dirX ? 0 : o.rise * Math.pow(ph, 0.8)) + (o.dirY || 0) * ph * o.rise;
      const r = lerp(o.r0, o.r1, Math.pow(ph, 0.7)) * (0.8 + 0.4 * rnd(sd + 3));
      const a = o.a * Math.sin(Math.PI * Math.pow(ph, 0.6)) * intensity;
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', r.toFixed(1));
      c.setAttribute('opacity', clamp(a).toFixed(3));
      c.style.display = a < 0.005 ? 'none' : '';
    });
  }
}
// Floating dust / bokeh particles
class Dust {
  constructor(parent, n, o = {}) {
    this.o = Object.assign({ w: 1080, h: 1920, color: '#9fd2ff', a: 0.5, r: 3, speed: 20, seed: 3 }, o);
    this.g = document.createElementNS(SVGNS, 'g'); parent.appendChild(this.g);
    this.els = [];
    for (let i = 0; i < n; i++) { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('fill', this.o.color); this.g.appendChild(c); this.els.push(c); }
  }
  update(t) {
    const o = this.o;
    this.els.forEach((c, i) => {
      const sd = o.seed * 1000 + i, sp = o.speed * (0.5 + rnd(sd + 2));
      const x = (rnd(sd) * o.w + Math.sin(t * 0.3 + i) * 20 + o.w) % o.w;
      const y = ((rnd(sd + 1) * o.h - t * sp) % o.h + o.h) % o.h;
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1));
      c.setAttribute('r', (o.r * (0.4 + rnd(sd + 5))).toFixed(1));
      c.setAttribute('opacity', (o.a * (0.3 + 0.7 * pulse(t, 0.2 + rnd(sd + 6) * 0.3))).toFixed(3));
    });
  }
}
