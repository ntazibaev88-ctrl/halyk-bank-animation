// Icon set, drawn in a -50..50 box. White on colored tiles by default.
const ICON = {};
(() => {
  const S = 'stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const F = 'fill="#fff"';
  ICON.gearCheck = `<path d="${gearD(0, 0, 40, 31, 9)}" ${F}/><circle r="20" fill="#e0600a"/><path d="M-10 0 L-3 8 L11 -7" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  ICON.shield = `<path d="M0 -42 L34 -30 Q34 16 0 42 Q-34 16 -34 -30Z" ${F}/><path d="M-14 0 L-4 10 L16 -12" stroke="#e0600a" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  ICON.gauge = `<circle r="40" ${F}/><circle r="32" fill="#e0600a"/><path d="M-22 14 A26 26 0 1 1 22 14" stroke="#fff" stroke-width="5" fill="none"/><path d="M0 4 L16 -18" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cy="4" r="7" ${F}/>`;
  ICON.wrench = `<path d="M-30 30 L6 -6 M8 -36 A20 20 0 1 0 36 -8 L22 -10 L18 -22 L30 -32Z" ${S}/><path d="M18 -32 A16 16 0 1 0 32 -16" ${S}/>`;
  ICON.helmet = `<path d="M-38 12 Q-40 -34 0 -36 Q40 -34 38 12Z" ${F}/><rect x="-46" y="10" width="92" height="12" rx="6" ${F}/><rect x="-6" y="-36" width="12" height="40" fill="#e0600a" opacity="0.6"/>`;
  ICON.vest = `<path d="M-20 -40 L-36 -30 L-40 40 L-6 40 L-6 -10 L0 -24 L6 -10 L6 40 L40 40 L36 -30 L20 -40 L8 -20 L0 -30 L-8 -20Z" ${F}/><rect x="-40" y="6" width="34" height="8" fill="#e0600a"/><rect x="6" y="6" width="34" height="8" fill="#e0600a"/>`;
  ICON.doc = `<path d="M-28 -42 L14 -42 L30 -26 L30 42 L-28 42Z" ${F}/><path d="M-16 -18 H16 M-16 -2 H16 M-16 14 H6" stroke="#e0600a" stroke-width="6" stroke-linecap="round"/>`;
  ICON.noEntry = `<circle r="40" ${S}/><path d="M-28 -28 L28 28" ${S}/><path d="M-10 -24 L10 -24 L10 6 L-10 6Z" ${F} opacity="0.9"/>`;
  ICON.power = `<path d="M-22 -26 A32 32 0 1 0 22 -26" ${S}/><path d="M0 -42 L0 -4" ${S}/>`;
  ICON.noPower = `${ICON.power}<path d="M-38 -38 L38 38" stroke="#ff3b3b" stroke-width="10" stroke-linecap="round"/>`;
  ICON.valve = `<path d="M-44 -18 L-44 18 L0 0Z M44 -18 L44 18 L0 0Z" ${F}/><path d="M0 0 L0 -30 M-20 -32 L20 -32" ${S}/>`;
  ICON.hand = `<path d="M-20 40 L-30 4 Q-32 -6 -24 -6 L-16 8 L-16 -32 Q-16 -38 -10 -38 Q-4 -38 -4 -32 L-4 -4 L-4 -40 Q-4 -46 2 -46 Q8 -46 8 -40 L8 -4 L8 -34 Q8 -40 14 -40 Q20 -40 20 -34 L20 -2 L20 -24 Q20 -30 26 -30 Q32 -30 32 -24 L32 18 Q30 36 18 40Z" ${F}/>`;
  ICON.alert = `<path d="M0 -40 L42 36 L-42 36Z" ${F} stroke="#fff" stroke-width="6" stroke-linejoin="round"/><rect x="-5" y="-14" width="10" height="28" rx="4" fill="#e0600a"/><circle cy="24" r="6" fill="#e0600a"/>`;
  ICON.radio = `<rect x="-20" y="-24" width="40" height="66" rx="8" ${F}/><rect x="8" y="-46" width="7" height="26" rx="3" ${F}/><rect x="-12" y="-14" width="24" height="18" rx="3" fill="#e0600a"/><circle cx="0" cy="22" r="8" fill="#e0600a"/><path d="M28 -30 Q38 -20 28 -10 M36 -38 Q52 -20 36 -2" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  ICON.thermo = `<path d="M-8 -42 Q-8 -48 0 -48 Q8 -48 8 -42 L8 12 A18 18 0 1 1 -8 12Z" ${F}/><circle cy="26" r="10" fill="#e0600a"/><rect x="-3" y="-20" width="6" height="44" fill="#e0600a"/>`;
  ICON.calm = `<circle r="40" ${F}/><path d="M-18 -8 Q-12 -14 -6 -8 M6 -8 Q12 -14 18 -8" stroke="#e0600a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-16 12 Q0 24 16 12" stroke="#e0600a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  ICON.heart = `<path d="M0 38 Q-46 6 -40 -20 Q-34 -44 -10 -38 Q-2 -36 0 -26 Q2 -36 10 -38 Q34 -44 40 -20 Q46 6 0 38Z" ${F}/><path d="M-28 -2 L-12 -2 L-6 -14 L4 12 L10 -2 L28 -2" stroke="#e0600a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  ICON.check = `<path d="M-26 0 L-8 18 L28 -20" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  ICON.lock = `<rect x="-28" y="-6" width="56" height="46" rx="8" ${F}/><path d="M-17 -6 L-17 -20 A17 17 0 0 1 17 -20 L17 -6" ${S}/><circle cy="14" r="7" fill="#e0600a"/><rect x="-3" y="14" width="6" height="14" fill="#e0600a"/>`;
  ICON.eye = `<path d="M-44 0 Q0 -44 44 0 Q0 44 -44 0Z" ${F}/><circle r="16" fill="#e0600a"/><circle r="7" fill="#fff"/>`;
  ICON.drop = `<path d="M0 -42 Q30 -2 30 14 A30 30 0 1 1 -30 14 Q-30 -2 0 -42Z" ${F}/><path d="M-14 12 Q-14 26 0 28" stroke="#e0600a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  ICON.wave = `<path d="M-44 0 L-30 0 L-22 -26 L-10 28 L2 -34 L14 30 L24 -14 L32 0 L44 0" ${S}/>`;
  ICON.ear = `<path d="M-16 30 Q-6 40 4 30 Q10 20 16 10 Q30 -10 18 -30 Q2 -46 -18 -32 Q-30 -22 -28 -6" ${S}/><path d="M-10 -8 Q-8 -22 6 -20 Q16 -16 10 -2" ${S}/>`;
  ICON.level = `<rect x="-26" y="-42" width="52" height="84" rx="10" ${S}/><rect x="-18" y="2" width="36" height="32" rx="4" ${F}/><path d="M-38 2 L-30 2 M30 2 L38 2" ${S}/>`;
  ICON.status = `<rect x="-40" y="-36" width="80" height="60" rx="8" ${S}/><path d="M-26 6 L-12 -8 L0 4 L24 -20" ${S}/><path d="M-16 38 L16 38" ${S}/>`;
  ICON.phone = `<path d="M-30 -40 Q-40 -36 -38 -20 Q-30 20 18 38 Q34 42 38 32 L40 18 L18 8 L8 18 Q-12 6 -20 -10 L-10 -20 L-20 -42Z" ${F}/>`;
  ICON.fire = `<path d="M0 44 Q-34 40 -34 10 Q-34 -14 -12 -34 Q-12 -14 0 -8 Q2 -30 14 -44 Q36 -16 34 12 Q32 40 0 44Z" ${F}/><path d="M0 40 Q-14 38 -14 24 Q-14 12 0 2 Q14 14 14 24 Q14 38 0 40Z" fill="#e0600a"/>`;
  ICON.exit = `<circle cx="-4" cy="-32" r="9" ${F}/><path d="M-6 -18 L-14 6 L4 16 L0 40 M-14 6 L-30 10 M-6 -18 L14 -6 L26 -14 M-10 -2 L-26 -14" ${S}/><path d="M24 20 L40 20 M32 12 L40 20 L32 28" ${S}/>`;
  ICON.people = `<circle cx="-16" cy="-22" r="13" ${F}/><circle cx="18" cy="-22" r="13" ${F}/><path d="M-40 30 Q-40 -4 -16 -4 Q8 -4 8 30Z M-6 30 Q-6 -4 18 -4 Q42 -4 42 30Z" ${F}/>`;
  ICON.rotate = `<path d="M30 -10 A32 32 0 1 0 22 24" ${S}/><path d="M34 -30 L32 -8 L12 -12" ${S}/>`;
  ICON.height = `<path d="M-30 40 L-30 -40 M-40 -28 L-30 -40 L-20 -28 M-40 28 L-30 40 L-20 28" ${S}/><path d="M0 40 L0 -10 L36 -10 L36 40" ${S}/><path d="M0 14 H36" ${S}/>`;
  ICON.guard = `<rect x="-40" y="-30" width="80" height="60" rx="6" ${S}/><path d="M-26 -30 V30 M-8 -30 V30 M10 -30 V30 M28 -30 V30" stroke="#fff" stroke-width="5"/>`;
  ICON.pipe = `<rect x="-44" y="-14" width="88" height="28" rx="6" ${F}/><rect x="-10" y="-24" width="20" height="48" rx="4" fill="#e0600a"/><path d="M0 -24 L0 -40 M-14 -40 L14 -40" ${S}/>`;
  ICON.start = `<rect x="-36" y="-36" width="72" height="72" rx="14" ${S}/><path d="M-10 -18 L18 0 L-10 18Z" ${F}/>`;
  ICON.steam = `<path d="M-20 34 Q-34 14 -20 0 Q-6 -14 -20 -34 M4 34 Q-10 14 4 0 Q18 -14 4 -34 M28 34 Q14 14 28 0 Q42 -14 28 -34" ${S}/>`;
})();

// Prohibition sign wrapper (red circle with slash) over an icon
function noSign(inner, r = 100) {
  return `<circle r="${r}" fill="#fff"/><g transform="scale(${(r / 62).toFixed(3)})">${inner}</g>
    <circle r="${r - 9}" fill="none" stroke="#e8262b" stroke-width="20"/><path d="M${-r * 0.66} ${-r * 0.66} L${r * 0.66} ${r * 0.66}" stroke="#e8262b" stroke-width="20"/>`;
}
// Warning triangle sign
function warnSign(inner, s = 100) {
  return `<path d="M0 ${-s} L${s * 1.1} ${s * 0.85} L${-s * 1.1} ${s * 0.85}Z" fill="#ffd23f" stroke="#1a1a1a" stroke-width="${s * 0.1}" stroke-linejoin="round"/>
    <g transform="translate(0 ${s * 0.25}) scale(${(s / 120).toFixed(3)})">${inner}</g>`;
}
