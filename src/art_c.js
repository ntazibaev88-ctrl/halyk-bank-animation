// Art for the practical module: boiler room interior, tools, forklift, overhead crane.

ICON.bulb = `<path d="M-24 -10 A26 26 0 1 1 24 -10 Q24 6 12 18 L12 28 L-12 28 L-12 18 Q-24 6 -24 -10Z" fill="#fff"/><rect x="-12" y="32" width="24" height="10" rx="4" fill="#fff"/><path d="M-8 4 L0 -8 L8 4" stroke="#e0600a" stroke-width="5" fill="none"/>`;
ICON.quiz = `<circle r="42" fill="#fff"/><path d="M-14 -14 Q-14 -30 0 -30 Q16 -30 16 -16 Q16 -6 4 0 Q0 4 0 12" stroke="#e0600a" stroke-width="9" fill="none" stroke-linecap="round"/><circle cy="26" r="6" fill="#e0600a"/>`;
ICON.walk = `<circle cx="4" cy="-34" r="9" fill="#fff"/><path d="M2 -20 L-6 6 L8 18 L4 42 M-6 6 L-22 40 M2 -20 L18 -4 L30 -8 M-2 -14 L-20 -2" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
ICON.list = `<rect x="-34" y="-42" width="68" height="84" rx="8" fill="#fff"/><path d="M-20 -20 L-14 -14 L-4 -26 M-20 4 L-14 10 L-4 -2 M-20 28 L-14 34 L-4 22" stroke="#2ecc71" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M4 -20 H22 M4 4 H22 M4 28 H22" stroke="#e0600a" stroke-width="5" stroke-linecap="round"/>`;
ICON.cool = `<path d="M0 -42 V42 M-36 -21 L36 21 M-36 21 L36 -21" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M-10 -34 L0 -24 L10 -34 M-10 34 L0 24 L10 34" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`;

// Boiler room interior. lamps are returned for dimming. Floor from y=1240.
function boilerRoomSVG(p, o = {}) {
  const boiler = (x, w) => `<g transform="translate(${x} 0)">
    <rect x="0" y="560" width="${w}" height="680" rx="14" fill="#1c3d78"/>
    <rect x="${w - 60}" y="560" width="60" height="680" rx="0" fill="#16336a"/>
    ${[0, 1, 2, 3].map(i => `<rect x="0" y="${640 + i * 150}" width="${w}" height="12" fill="#2a56a0"/>`).join('')}
    <circle cx="${w / 2}" cy="980" r="78" fill="#0d1d3c" stroke="#5d93dc" stroke-width="10"/>
    <circle data-k="${p}fire${x}" cx="${w / 2}" cy="980" r="54" fill="url(#glowO)"/>
    <circle cx="${w / 2}" cy="980" r="30" fill="#ffb347" opacity="0.7" data-k="${p}firec${x}"/>
    <g transform="translate(${w / 2} 760)"><circle r="44" fill="#c9d3e0"/><circle r="36" fill="#f4f7fb"/><path d="${arcPath(0, 0, 28, 135, 300)}" stroke="#2ecc71" stroke-width="7" fill="none"/>
      <path data-k="${p}gn${x}" d="M0 0 L0 -28" stroke="#e8262b" stroke-width="5"/><circle r="5" fill="#14213d"/></g>
    <rect x="${w / 2 - 22}" y="420" width="44" height="140" fill="#b9c6d8"/>${[0, 1, 2].map(i => `<rect x="${w / 2 - 24}" y="${440 + i * 40}" width="48" height="6" fill="#8a9ab0"/>`).join('')}
  </g>`;
  let lamps = '';
  [150, 540, 930].forEach((x, i) => { lamps += `<g data-k="${p}lamp${i}"><circle cx="${x}" cy="400" r="260" fill="url(#glowY)" opacity="0.35"/><rect x="${x - 70}" y="380" width="140" height="22" rx="8" fill="#e8eef6"/></g><rect x="${x - 76}" y="372" width="152" height="12" rx="4" fill="#3a4e70"/>`; });
  let tiles = '';
  for (let k = 0; k < 8; k++) { const y = 1240 + Math.pow(k / 7, 1.6) * 680; tiles += `<line x1="0" y1="${y.toFixed(0)}" x2="1080" y2="${y.toFixed(0)}" stroke="#3d7fd9" stroke-opacity="0.16" stroke-width="2"/>`; }
  for (let i = -6; i <= 6; i++) tiles += `<line x1="${540 + i * 60}" y1="1240" x2="${540 + i * 220}" y2="1920" stroke="#3d7fd9" stroke-opacity="0.14" stroke-width="2"/>`;
  return `<g>
    <rect width="1080" height="1920" fill="#0b1a3a"/>
    ${[...Array(10)].map((_, i) => `<rect x="${i * 120}" y="300" width="2" height="940" fill="#16336a"/>`).join('')}
    <rect x="0" y="440" width="1080" height="40" fill="#b9c6d8"/>${[...Array(12)].map((_, i) => `<rect x="${i * 96}" y="440" width="6" height="40" fill="#8a9ab0"/>`).join('')}
    <rect x="0" y="494" width="1080" height="26" fill="url(#pipeO)"/>
    ${boiler(40, 360)}${boiler(680, 360)}
    <g transform="translate(470 0)"><rect x="0" y="800" width="140" height="440" fill="#13264a"/><rect x="18" y="830" width="104" height="160" rx="10" fill="#0a1630" stroke="#2f86ff" stroke-width="3"/>
      ${[0, 1, 2].map(i => `<circle data-k="${p}led${i}" cx="${40 + i * 30}" cy="1030" r="9" fill="#2ecc71"/>`).join('')}
      <path d="M30 940 L50 900 L70 920 L95 870 L110 890" stroke="#2ecc71" stroke-width="4" fill="none"/></g>
    <rect x="0" y="1240" width="1080" height="680" fill="#0d1d3c"/>${tiles}
    <rect x="0" y="1262" width="1080" height="10" fill="#ffd23f" opacity="0.8"/>
    ${lamps}
  </g>`;
}
class BoilerRoom {
  constructor(parent, p) { this.g = svgFrag(boilerRoomSVG(p)); parent.appendChild(this.g); this.r = refs(this.g); this.p = p; }
  update(t, o = {}) {
    const r = this.r, p = this.p, light = o.light === undefined ? 1 : o.light;
    [0, 1, 2].forEach(i => O(r[p + 'lamp' + i], light * (o.flicker ? (Math.sin(t * 37 + i * 3) > 0.6 ? 0.25 : 1) : 1)));
    [40, 680].forEach((x, i) => { O(r[p + 'fire' + x], 0.6 + 0.4 * Math.sin(t * 8 + i)); T(r[p + 'gn' + x], 0, 0, 1, -30 + 8 * Math.sin(t * 1.2 + i)); });
    [0, 1, 2].forEach(i => O(r[p + 'led' + i], 0.5 + 0.5 * pulse(t, 0.7 + i * 0.3)));
  }
}

// Tools (drawn in a -80..80 x -50..50 box). Element data-k="m" is the animated part.
const ST = 'url(#steelH)';
const TOOLS = [
  { kk: 'Гайка кілті', ru: 'гаечный ключ', use: 'Гайка, болт бұрау', svg: `<g data-k="m" transform="rotate(-25)"><rect x="-52" y="-8" width="104" height="16" rx="8" fill="${ST}"/>
      <path d="M-74 -18 A22 22 0 1 0 -52 12 L-60 4 L-60 -6 L-48 -12Z" fill="#9db6d6"/><path d="M74 -18 A22 22 0 1 1 52 12 L60 4 L60 -6 L48 -12Z" fill="#9db6d6"/></g>` },
  { kk: 'Жылжымалы кілт', ru: 'разводной ключ', use: 'Өлшемі реттеледі', svg: `<g transform="rotate(-20)"><rect x="-70" y="-9" width="100" height="18" rx="9" fill="#ff8a1f"/><rect x="20" y="-14" width="34" height="28" rx="6" fill="${ST}"/>
      <path d="M46 -14 L74 -30 L80 -20 L54 -8Z" fill="#9db6d6"/><g data-k="m"><path d="M46 14 L72 4 L76 14 L54 22Z" fill="#9db6d6"/></g><circle cx="34" cy="6" r="6" fill="#5f7da6"/></g>` },
  { kk: 'Динамометрлік кілт', ru: 'динамометрический ключ', use: 'Белгіленген күшпен тарту', svg: `<rect x="-78" y="-7" width="140" height="14" rx="7" fill="${ST}"/><rect x="-78" y="-10" width="44" height="20" rx="8" fill="#1f5fbf"/>
      <circle cx="0" cy="0" r="22" fill="#f4f7fb" stroke="#5f7da6" stroke-width="5"/><g data-k="m"><path d="M0 0 L0 -16" stroke="#e8262b" stroke-width="4"/></g><rect x="60" y="-12" width="22" height="24" rx="4" fill="#9db6d6"/>` },
  { kk: 'Бұрағыш', ru: 'отвёртка', use: 'Бұранда бұрау', svg: `<g data-k="m"><rect x="-76" y="-16" width="62" height="32" rx="14" fill="#ff8a1f"/>${[0, 1, 2].map(i => `<rect x="${-66 + i * 16}" y="-16" width="6" height="32" fill="#c95f0a"/>`).join('')}</g>
      <rect x="-14" y="-5" width="80" height="10" fill="${ST}"/><path d="M66 -5 L80 -2 L80 2 L66 5Z" fill="#9db6d6"/>` },
  { kk: 'Тістеуік', ru: 'пассатижи', use: 'Ұстау, сым кесу', svg: `<g data-k="m"><path d="M-78 -18 Q-30 -14 0 -3 L-6 6 Q-36 -2 -78 -4Z" fill="#ff8a1f"/></g><path d="M-78 18 Q-30 14 0 3 L-6 -6 Q-36 2 -78 4Z" fill="#e0600a"/>
      <path d="M-4 -8 L58 -10 Q72 -6 74 0 L0 6Z" fill="#9db6d6"/><path d="M-4 8 L58 10 Q72 6 74 0 L0 -2Z" fill="#7f9cc4"/><circle cx="0" cy="0" r="8" fill="#5f7da6"/>` },
  { kk: 'Рулетка', ru: 'рулетка', use: 'Ұзындық өлшеу', svg: `<g data-k="m"><rect x="-20" y="10" width="100" height="14" fill="#ffd23f"/>${[...Array(10)].map((_, i) => `<line x1="${-14 + i * 10}" y1="10" x2="${-14 + i * 10}" y2="${i % 5 ? 16 : 20}" stroke="#1a1a1a" stroke-width="2"/>`).join('')}</g>
      <rect x="-76" y="-40" width="66" height="66" rx="14" fill="#ffd23f"/><circle cx="-43" cy="-7" r="20" fill="#1a1a1a"/><circle cx="-43" cy="-7" r="8" fill="#ffd23f"/>` },
  { kk: 'Штангенциркуль', ru: 'штангенциркуль', use: 'Диаметр, қалыңдық өлшеу', svg: `<rect x="-78" y="-12" width="156" height="18" rx="3" fill="#c9d3e0"/>${[...Array(26)].map((_, i) => `<line x1="${-60 + i * 5}" y1="-12" x2="${-60 + i * 5}" y2="${i % 5 ? -6 : -2}" stroke="#14213d" stroke-width="1.5"/>`).join('')}
      <path d="M-78 -12 L-78 40 L-64 40 L-64 -12Z" fill="#9db6d6"/><g data-k="m"><rect x="-56" y="-18" width="30" height="30" rx="4" fill="#7f9cc4"/><path d="M-56 12 L-56 40 L-44 40 L-40 12Z" fill="#9db6d6"/></g>` },
  { kk: 'Құрылыс деңгейі', ru: 'строительный уровень', use: 'Көлденең, тік тексеру', svg: `<rect x="-78" y="-16" width="156" height="32" rx="6" fill="#2ecc71"/><rect x="-78" y="-16" width="156" height="8" rx="4" fill="#58e08f"/>
      <rect x="-22" y="-9" width="44" height="18" rx="9" fill="#e6ffd9" stroke="#14213d" stroke-width="2"/><line x1="-8" y1="-9" x2="-8" y2="9" stroke="#14213d"/><line x1="8" y1="-9" x2="8" y2="9" stroke="#14213d"/><g data-k="m"><circle r="6" fill="#ffd23f"/></g>` },
  { kk: 'Қол шамы', ru: 'фонарь', use: 'Жарықтандыру', svg: `<g data-k="m"><path d="M20 -16 L80 -40 L80 40 L20 16Z" fill="url(#beamY)"/></g><rect x="-70" y="-14" width="70" height="28" rx="8" fill="#1f5fbf"/><path d="M0 -14 L22 -22 L22 22 L0 14Z" fill="#2f86ff"/><rect x="18" y="-22" width="6" height="44" fill="#fff2b0"/><rect x="-50" y="-6" width="16" height="12" rx="3" fill="#ff8a1f"/>` },
  { kk: 'Балға', ru: 'молоток', use: 'Соғу жұмыстары', svg: `<g data-k="m" transform="rotate(-20)"><rect x="-70" y="-7" width="110" height="14" rx="7" fill="#ff8a1f"/><rect x="-70" y="-7" width="36" height="14" rx="7" fill="#c95f0a"/>
      <path d="M36 -30 L66 -30 L66 30 L36 30 Z" fill="${ST}"/><path d="M66 -24 L78 -20 L78 20 L66 24Z" fill="#9db6d6"/></g>` },
];

// Forklift facing left. Origin at ground under rear wheel area.
function forkliftSVG(p) {
  return `<g data-k="${p}root">
    <ellipse cx="40" cy="4" rx="190" ry="14" fill="#000" opacity="0.35"/>
    <rect x="-190" y="-230" width="14" height="230" fill="#3a4250"/><rect x="-170" y="-230" width="14" height="230" fill="#3a4250"/>
    <g data-k="${p}fork"><rect x="-260" y="-22" width="90" height="10" fill="#2b2f36"/><rect x="-176" y="-80" width="10" height="68" fill="#2b2f36"/>
      <rect x="-250" y="-118" width="80" height="96" fill="#b97a3c"/><rect x="-250" y="-118" width="80" height="12" fill="#d29653"/><path d="M-250 -70 H-170" stroke="#8a5523" stroke-width="4"/></g>
    <path d="M-150 -40 L-150 -150 L-60 -150 L-20 -110 L160 -110 L160 -20 L-150 -20Z" fill="#ffb21f"/>
    <rect x="80" y="-170" width="90" height="70" rx="10" fill="#ffb21f"/><rect x="100" y="-160" width="60" height="50" rx="6" fill="#2b2f36"/>
    <path d="M-130 -150 L-130 -270 L60 -270 L60 -150" stroke="#2b2f36" stroke-width="10" fill="none"/><rect x="-140" y="-280" width="210" height="14" rx="6" fill="#2b2f36"/>
    <circle data-k="${p}beac" cx="-10" cy="-292" r="34" fill="url(#glowO)"/><rect x="-22" y="-302" width="24" height="18" rx="6" fill="#ff8a1f"/>
    <path d="M-40 -150 L-40 -200 Q-36 -214 -20 -214 L10 -214" stroke="#2b2f36" stroke-width="8" fill="none"/>
    <rect x="-150" y="-60" width="310" height="16" fill="url(#hazard)" opacity="0.9"/>
    ${[-90, 110].map((x, i) => `<g transform="translate(${x} -24)"><circle r="${i ? 46 : 38}" fill="#1a1a1a"/><circle r="${i ? 22 : 18}" fill="#7f8a99"/><g data-k="${p}wh${i}"><rect x="-3" y="${i ? -20 : -16}" width="6" height="${i ? 40 : 32}" fill="#3a4250"/></g></g>`).join('')}
  </g>`;
}
