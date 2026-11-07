// Thermal power plant skyline. Ground at y=0, spans x≈-60..1140. mode: 'night' | 'day'
function plantSVG(p, mode = 'night') {
  const N = mode === 'night';
  const c = N ? { far: '#0d1f45', b1: '#10285a', b2: '#0c1f48', b3: '#163367', edge: '#25498a', win: '#ffcf6e', winOff: '#1a3366', tower: '#132d5e', towerSh: '#0b1d42' }
              : { far: '#2c5596', b1: '#24508f', b2: '#1c437c', b3: '#2d63ad', edge: '#5d93dc', win: '#bfe3ff', winOff: '#2a5a9c', tower: '#2f5f9f', towerSh: '#1e4680' };
  let wins = '';
  // turbine hall windows
  for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) {
    const lit = rnd(i * 7 + r * 31) > (N ? 0.35 : 0.6);
    wins += `<rect data-k="${p}win${r}_${i}" x="${70 + i * 40}" y="${-290 + r * 58}" width="24" height="34" rx="3" fill="${lit ? c.win : c.winOff}" opacity="${lit ? 0.9 : 0.8}"/>`;
  }
  // boiler house windows (vertical strips)
  let bw = '';
  for (let r = 0; r < 9; r++) for (let i = 0; i < 4; i++) {
    const lit = rnd(i * 13 + r * 17 + 5) > (N ? 0.4 : 0.65);
    bw += `<rect x="${388 + i * 58}" y="${-590 + r * 60}" width="30" height="34" rx="3" fill="${lit ? c.win : c.winOff}" opacity="0.88"/>`;
  }
  const chimney = (x, w0, w1, h, k) => `
    <path d="M${x - w0 / 2} 0 L${x - w1 / 2} ${-h} L${x + w1 / 2} ${-h} L${x + w0 / 2} 0Z" fill="${c.b3}"/>
    <path d="M${x} 0 L${x} ${-h} L${x + w1 / 2} ${-h} L${x + w0 / 2} 0Z" fill="${c.b2}" opacity="0.7"/>
    ${[0, 1, 2].map(i => `<path d="M${x - w1 / 2 - 2 + i * 0} ${-h + 30 + i * 60} L${x + w1 / 2 + 2} ${-h + 30 + i * 60} L${x + w1 / 2 + 3} ${-h + 60 + i * 60} L${x - w1 / 2 - 3} ${-h + 60 + i * 60}Z" fill="${i % 2 ? '#e9eef5' : '#e0412f'}" opacity="${N ? 0.75 : 0.95}"/>`).join('')}
    <rect x="${x - w1 / 2 - 4}" y="${-h - 8}" width="${w1 + 8}" height="12" rx="3" fill="${c.edge}"/>
    <circle data-k="${p}${k}" cx="${x}" cy="${-h - 12}" r="40" fill="url(#glowR)"/>
    <circle data-k="${p}${k}c" cx="${x}" cy="${-h - 12}" r="6" fill="#ff5050"/>`;
  return `
  <g data-k="${p}plant">
    <!-- far skyline -->
    <path d="M-80 0 L-80 -120 L-20 -120 L-20 -170 L40 -170 L40 -110 L120 -110 L120 -60 L980 -60 L980 -150 L1040 -150 L1040 -90 L1160 -90 L1160 0Z" fill="${c.far}" opacity="0.8"/>
    <!-- cooling tower -->
    <g>
      <path d="M770 0 C812 -190 830 -270 800 -420 L1000 -420 C972 -270 990 -190 1036 0Z" fill="${c.tower}"/>
      <path d="M903 0 L903 -420 L1000 -420 C972 -270 990 -190 1036 0Z" fill="${c.towerSh}" opacity="0.8"/>
      <path d="M800 -420 L1000 -420" stroke="${c.edge}" stroke-width="6"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${812 + i * 34}" y1="-410" x2="${790 + i * 48}" y2="-4" stroke="${c.edge}" stroke-opacity="0.25" stroke-width="2"/>`).join('')}
      <path d="M776 -24 L1030 -24" stroke="${c.edge}" stroke-opacity="0.5" stroke-width="5"/>
    </g>
    ${chimney(170, 72, 44, 900, 'bc1')}
    ${chimney(290, 60, 38, 780, 'bc2')}
    <!-- boiler house -->
    <rect x="370" y="-640" width="250" height="640" fill="${c.b1}"/>
    <rect x="560" y="-640" width="60" height="640" fill="${c.b2}"/>
    <rect x="362" y="-656" width="266" height="20" fill="${c.edge}"/>
    ${bw}
    <!-- turbine hall -->
    <path d="M40 -330 L740 -330 L760 -310 L760 0 L40 0Z" fill="${c.b3}"/>
    <path d="M40 -330 L740 -330 L760 -310 L40 -310Z" fill="${c.edge}" opacity="0.7"/>
    ${wins}
    <rect x="40" y="-60" width="720" height="60" fill="${c.b2}"/>
    <!-- pipe rack -->
    <g>
      <rect x="-60" y="-96" width="1220" height="16" rx="8" fill="url(#pipeB)" opacity="0.9"/>
      <rect x="-60" y="-66" width="1220" height="22" rx="11" fill="url(#pipeO)" opacity="0.9"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${-20 + i * 160}" y="-100" width="10" height="100" fill="${c.edge}"/>`).join('')}
    </g>
    <!-- transmission tower -->
    <g transform="translate(1060 0)" stroke="${c.edge}" stroke-width="5" fill="none" opacity="0.9">
      <path d="M-40 0 L-12 -360 L12 -360 L40 0 M-30 -120 L30 -120 M-22 -230 L22 -230 M-40 0 L22 -230 M40 0 L-22 -230 M-60 -300 L60 -300 M-50 -340 L50 -340"/>
    </g>
  </g>`;
}

// Plant with live elements: window flicker, chimney beacons, steam plumes
class Plant {
  constructor(parent, p, mode, opt = {}) {
    this.g = svgFrag(plantSVG(p, mode)); parent.appendChild(this.g);
    this.r = refs(this.g); this.p = p;
    this.plumes = [
      new Puffs(this.g, 26, { x: 900, y: -430, life: 6, rise: 520, wind: 120, r0: 50, r1: 170, a: mode === 'night' ? 0.42 : 0.6, spread: 120, seed: 11 }),
      new Puffs(this.g, 14, { x: 170, y: -920, life: 5, rise: 380, wind: 140, r0: 18, r1: 80, a: 0.35, fill: mode === 'night' ? 'url(#puffD)' : 'url(#puff)', spread: 20, seed: 12 }),
      new Puffs(this.g, 12, { x: 290, y: -800, life: 5, rise: 340, wind: 130, r0: 16, r1: 70, a: 0.3, fill: mode === 'night' ? 'url(#puffD)' : 'url(#puff)', spread: 18, seed: 13 }),
      new Puffs(this.g, 10, { x: 600, y: -660, life: 3.5, rise: 220, wind: 60, r0: 10, r1: 50, a: 0.45, spread: 10, seed: 14 }),
    ];
  }
  update(t, opt = {}) {
    const b = 0.5 + 0.5 * Math.sign(Math.sin(t * Math.PI * 1.2));
    ['bc1', 'bc2'].forEach((k, i) => { O(this.r[this.p + k], (i ? 1 - b : b) * 0.9 + 0.1); });
    this.plumes.forEach(pl => pl.update(t, opt.steam === undefined ? 1 : opt.steam));
  }
}
