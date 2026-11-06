// Reusable build-time components: fonts, shared styles, the character rig SVG,
// seeded helpers. Scenes import these and the build writes plain HTML.

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const f = (n) => Math.round(n * 10) / 10;

export const PALETTE = {
  navy0: "#030716", navy1: "#071433", navy2: "#0d2152", blue: "#3fa9ff", cyan: "#7fd8ff",
  orange: "#ff8a3d", amber: "#ffb547", red: "#ff4a3d", ink: "#f4f7ff",
};

export const FONT_CSS = [500, 600, 700, 800, 900].map((w) => `
@font-face{font-family:"Mont";font-weight:${w};font-style:normal;font-display:block;src:url("assets/fonts/montserrat-cyrillic-${w}-normal.woff2") format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;}
@font-face{font-family:"Mont";font-weight:${w};font-style:normal;font-display:block;src:url("assets/fonts/montserrat-latin-${w}-normal.woff2") format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}`).join("");

// Shared HUD / infographic styles (prefix-free classes, used by every scene)
export const HUD_CSS = `
.hud{position:absolute;font-family:"Mont",sans-serif;color:#eaf4ff;letter-spacing:.06em;text-transform:uppercase;}
.hud-tag{display:inline-flex;align-items:center;gap:14px;padding:14px 22px;border:2px solid rgba(127,216,255,.75);border-radius:14px;background:rgba(5,14,40,.62);font-weight:800;font-size:34px;box-shadow:0 0 28px rgba(63,169,255,.35), inset 0 0 18px rgba(63,169,255,.15);}
.hud-tag.warn{border-color:rgba(255,120,60,.9);box-shadow:0 0 28px rgba(255,90,40,.4), inset 0 0 18px rgba(255,90,40,.18);}
.hud-tag .v{color:#ff9a4d;text-transform:none;}
.hud-small{font-weight:600;font-size:26px;letter-spacing:.08em;color:#9fd2ff;}
.hud-dot{width:14px;height:14px;border-radius:50%;background:#7fd8ff;box-shadow:0 0 12px #7fd8ff;}
.hud-tag.warn .hud-dot{background:#ff7a3d;box-shadow:0 0 12px #ff7a3d;}
.grain{position:absolute;inset:-10%;opacity:.07;mix-blend-mode:overlay;pointer-events:none;}
.vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 75% 62% at 50% 48%,rgba(0,0,0,0) 55%,rgba(0,2,10,.72) 100%);}
`;

export function sceneFile({ id, css = "", body, js, dur }) {
  return `<template>
<style>
${FONT_CSS}
${HUD_CSS}
#root{position:absolute;inset:0;overflow:hidden;background:#030716;font-family:"Mont",sans-serif;}
${css}
</style>
<div id="root" data-composition-id="${id}" data-width="1080" data-height="1920" data-start="0" data-duration="${dur}">
${body}
</div>
<script>
(function(){
const tl = gsap.timeline({ paused: true });
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
${js}
window.__timelines = window.__timelines || {};
window.__timelines["${id}"] = tl;
})();
</script>
</template>
`;
}

// Film grain as an inline SVG turbulence (static texture; moved per frame by GSAP)
export function grain(id) {
  return `<svg id="${id}" class="grain" viewBox="0 0 400 400" preserveAspectRatio="none"><filter id="${id}-f"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0"/></filter><rect width="400" height="400" filter="url(#${id}-f)"/></svg>`;
}

/* ---------------- Character rig ----------------
   Side view facing right, hip at (0,0), y down, ~380 units tall.
   Joint pivots match Kit.JOINTS in assets/lib/kit.js. Colours come from CSS vars
   on an ancestor so the same rig dresses as different people. */
export const LOOKS = {
  hero: { skin: "#e8b08a", skinS: "#b97a5a", hair: "#1c140f", top: "#2b5c9e", topS: "#1b3b6c", pants: "#23262f", pantsS: "#16181e", shoe: "#dfe4ee", shoeS: "#9aa3b5", rim: "#9fdcff" },
  p1: { skin: "#c98d6a", skinS: "#94603f", hair: "#3a2416", top: "#c4512d", topS: "#8a3418", pants: "#2c3446", pantsS: "#1c2230", shoe: "#2a2a2a", shoeS: "#111", rim: "#ffc28a" },
  p2: { skin: "#f0c4a0", skinS: "#c08f6c", hair: "#c7a165", top: "#3d8a6e", topS: "#265b48", pants: "#4a3b5c", pantsS: "#30263d", shoe: "#ececec", shoeS: "#a0a0a0", rim: "#bfe9ff" },
  p3: { skin: "#8d5a3c", skinS: "#5f3a25", hair: "#120c08", top: "#e3b23c", topS: "#a77e22", pants: "#1f2a44", pantsS: "#131a2c", shoe: "#c33", shoeS: "#822", rim: "#ffd59a" },
};
export function lookVars(name) {
  const L = LOOKS[name];
  return Object.entries(L).map(([k, v]) => `--${k}:${v}`).join(";");
}

function limb(id, x1, y1, x2, y2, w, col, colS, inner = "", rim = true) {
  return `<g id="${id}">
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--${colS})" stroke-width="${w}" stroke-linecap="round"/>
  <line x1="${x1 + 2.5}" y1="${y1}" x2="${x2 + 2.5}" y2="${y2}" stroke="var(--${col})" stroke-width="${w - 6}" stroke-linecap="round"/>
  ${rim ? `<line x1="${x1 + w / 2 - 2}" y1="${y1 + 4}" x2="${x2 + w / 2 - 2}" y2="${y2 - 4}" stroke="var(--rim)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>` : ""}
  ${inner}
</g>`;
}

function leg(p, side) {
  const S = side === "B";
  const dim = S ? ' opacity="1" style="filter:brightness(.72)"' : "";
  const shoe = `<g id="${p}-foot${side}">
      <path d="M-13 176 Q-14 196 -6 199 L36 199 Q44 198 42 190 Q38 182 22 180 L8 172 Z" fill="var(--shoeS)"/>
      <path d="M-11 176 Q-12 192 -5 194 L35 194 Q41 193 39 188 Q35 182 21 181 L8 174 Z" fill="var(--shoe)"/>
      <path d="M-6 195 L38 195" stroke="var(--shoeS)" stroke-width="3"/>
    </g>`;
  const shin = limb(`${p}-shin${side}`, 0, 96, 0, 172, 30, "pants", "pantsS", shoe);
  return `<g${dim}>${limb(`${p}-thigh${side}`, 0, 4, 0, 96, 36, "pants", "pantsS", shin)}</g>`;
}

function arm(p, side) {
  const S = side === "B";
  const hand = `<g><ellipse cx="6" cy="-4" rx="11" ry="13" fill="var(--skinS)"/><ellipse cx="7" cy="-6" rx="9" ry="11" fill="var(--skin)"/><path d="M12 -12 Q18 -6 14 2" stroke="var(--skinS)" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  const fore = limb(`${p}-fArm${side}`, 4, -66, 5, -18, 23, "top", "topS", `<rect x="-7" y="-22" width="23" height="9" rx="4" fill="var(--topS)"/>${hand}`);
  return `<g${S ? ' style="filter:brightness(.68)"' : ""}>${limb(`${p}-uArm${side}`, 4, -132, 4, -66, 26, "top", "topS", fore)}</g>`;
}

export function character(p, look = "hero", { face = true } = {}) {
  const head = `<g id="${p}-head">
    <path d="M-6 -146 L-6 -160 L14 -160 L14 -146 Z" fill="var(--skinS)"/>
    <path d="M-20 -196 Q-22 -224 6 -230 Q36 -232 42 -204 L44 -190 Q46 -176 40 -168 Q30 -156 12 -156 Q-6 -158 -14 -172 Q-22 -182 -20 -196 Z" fill="var(--skin)"/>
    <path d="M40 -196 L50 -184 Q51 -181 47 -180 L41 -180" fill="var(--skin)" stroke="var(--skinS)" stroke-width="2"/>
    <path d="M-14 -172 Q-6 -158 12 -156 Q26 -156 34 -162 Q20 -160 6 -166 Q-6 -172 -14 -186 Z" fill="var(--skinS)" opacity=".55"/>
    <ellipse cx="-2" cy="-190" rx="7" ry="10" fill="var(--skinS)"/>
    <path d="M-24 -192 Q-30 -222 -4 -236 Q24 -246 44 -224 Q50 -214 44 -206 Q34 -216 18 -214 Q8 -220 4 -208 Q2 -198 -6 -196 Q-12 -186 -16 -176 Q-22 -180 -24 -192 Z" fill="var(--hair)"/>
    <path d="M-10 -232 Q10 -244 34 -232" stroke="rgba(255,255,255,.18)" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${face ? `
    <g id="${p}-eyeO"><ellipse cx="30" cy="-196" rx="4.5" ry="5.5" fill="#fff"/><circle cx="32" cy="-196" r="3" fill="#1a1410"/><circle cx="33" cy="-197.5" r="1" fill="#fff"/></g>
    <path id="${p}-eyeC" d="M25 -195 Q30 -192 35 -195" stroke="#1a1410" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <path id="${p}-brow" d="M23 -207 Q31 -211 38 -207" stroke="var(--hair)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path id="${p}-mouthN" d="M34 -171 Q39 -171 42 -173" stroke="#7a3b2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse id="${p}-mouthO" cx="38" cy="-171" rx="4" ry="5" fill="#4a1d18" opacity="0"/>` : ""}
  </g>`;
  const torso = `<g id="${p}-torso">
    ${arm(p, "B")}
    <path d="M-30 -150 Q-38 -168 -20 -170 Q-4 -168 -2 -150 Z" fill="var(--topS)"/>
    <path d="M-24 10 Q-30 -60 -28 -128 Q-26 -148 -6 -150 L16 -150 Q30 -146 32 -126 Q36 -80 30 -30 Q28 -4 26 10 Z" fill="var(--top)"/>
    <path d="M-24 10 Q-30 -60 -28 -128 Q-26 -148 -10 -150 Q-16 -110 -14 -60 Q-12 -20 -6 10 Z" fill="var(--topS)" opacity=".8"/>
    <path d="M30 -122 Q34 -80 28 -32" stroke="var(--rim)" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>
    <path d="M-2 -40 L26 -40 L28 -6 L2 -6 Z" fill="var(--topS)" opacity=".55"/>
    <path d="M16 -146 L18 -118 M22 -146 L25 -122" stroke="#e8eef8" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
    <path d="M-26 4 L28 4" stroke="var(--topS)" stroke-width="6" stroke-linecap="round"/>
    ${head}
    ${arm(p, "F")}
  </g>`;
  return `<g id="${p}-root">${leg(p, "B")}${leg(p, "F")}${torso}</g>`;
}

// Words of a caption line: "[...]" marks highlighted words
export function words(text) {
  const out = []; let hi = false;
  for (const tok of text.split(/\s+/).filter(Boolean)) {
    if (tok === "—") { if (out.length) out[out.length - 1].w += " —"; continue; }
    let w = tok; let h = hi;
    if (w.startsWith("[")) { h = true; w = w.slice(1); }
    let end = false;
    if (/\]/.test(w)) { end = true; w = w.replace("]", ""); }
    out.push({ w, hi: h }); hi = h && !end;
  }
  return out;
}

/* ---------------- Bedroom set (world coords = 1080x1920 frame) ---------------- */
export function bedroom(p, { r: seed = 3 } = {}) {
  const R = rng(seed);
  let sky = "";
  let x = 600;
  while (x < 990) {
    const w = 24 + R() * 46, h = 60 + R() * 170;
    sky += `<rect x="${f(x)}" y="${f(1080 - h)}" width="${f(w)}" height="${f(h)}" fill="#0c1431"/>`;
    for (let wy = 1080 - h + 10; wy < 1070; wy += 14) for (let wx = x + 5; wx < x + w - 6; wx += 10) if (R() < 0.22) sky += `<rect x="${f(wx)}" y="${f(wy)}" width="4" height="6" fill="#ffc77a" opacity="${f(0.4 + R() * 0.6)}"/>`;
    x += w + 2;
  }
  const books = [
    ["#c2492f", 26, 112], ["#2f6db3", 22, 104], ["#e0b44a", 30, 118], ["#3c8c6a", 20, 96], ["#8a4fb8", 28, 110], ["#d9dde6", 24, 100], ["#c2492f", 18, 92], ["#244e86", 26, 114],
  ];
  let bx = 214, bk = "";
  books.forEach(([c, w, h], i) => {
    bk += `<g id="${p}-book${i}"><rect x="${bx}" y="${880 - h}" width="${w}" height="${h}" rx="3" fill="${c}"/><rect x="${bx + 3}" y="${880 - h + 12}" width="${w - 6}" height="5" fill="rgba(255,255,255,.35)"/><rect x="${bx}" y="${880 - h}" width="5" height="${h}" fill="rgba(0,0,0,.25)"/></g>`;
    bx += w + 3;
  });
  let planks = "";
  for (let i = 0; i < 9; i++) { const y = 1400 + i * i * 7 + i * 22; planks += `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="rgba(0,0,0,.35)" stroke-width="2"/>`; }
  return `
  <defs>
    <linearGradient id="${p}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060d24"/><stop offset=".6" stop-color="#0d1d47"/><stop offset="1" stop-color="#132a5e"/></linearGradient>
    <linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16265a"/><stop offset=".45" stop-color="#5a3f86"/><stop offset=".8" stop-color="#ff8a4a"/><stop offset="1" stop-color="#ffc06a"/></linearGradient>
    <linearGradient id="${p}-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1830"/><stop offset="1" stop-color="#0a0a16"/></linearGradient>
    <linearGradient id="${p}-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb070" stop-opacity=".32"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></linearGradient>
    <radialGradient id="${p}-sun" cx=".5" cy="1" r=".6"><stop offset="0" stop-color="#fff0c0" stop-opacity=".95"/><stop offset=".3" stop-color="#ffb060" stop-opacity=".55"/><stop offset="1" stop-color="#ff7a40" stop-opacity="0"/></radialGradient>
    <linearGradient id="${p}-curt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14204a"/><stop offset=".5" stop-color="#22367a"/><stop offset="1" stop-color="#101a3c"/></linearGradient>
    <linearGradient id="${p}-blank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a64b0"/><stop offset="1" stop-color="#22336e"/></linearGradient>
    <clipPath id="${p}-win"><rect x="600" y="560" width="380" height="520"/></clipPath>
  </defs>
  <rect x="-200" y="-200" width="1480" height="1620" fill="url(#${p}-wall)"/>
  <rect x="-200" y="1400" width="1480" height="700" fill="url(#${p}-floor)"/>${planks}
  <rect x="-200" y="1392" width="1480" height="12" fill="#0a0f24"/>
  <g clip-path="url(#${p}-win)">
    <rect x="600" y="560" width="380" height="520" fill="url(#${p}-sky)"/>
    <ellipse id="${p}-sunglow" cx="820" cy="1080" rx="260" ry="200" fill="url(#${p}-sun)"/>
    ${sky}
  </g>
  <rect x="588" y="548" width="404" height="544" rx="6" fill="none" stroke="#0a1022" stroke-width="22"/>
  <line x1="790" y1="560" x2="790" y2="1080" stroke="#0a1022" stroke-width="12"/><line x1="600" y1="800" x2="980" y2="800" stroke="#0a1022" stroke-width="12"/>
  <rect x="572" y="1090" width="436" height="22" rx="4" fill="#0e1630"/>
  <path d="M540 520 Q560 820 548 1180 L610 1180 Q630 820 600 520 Z" fill="url(#${p}-curt)"/>
  <path d="M980 520 Q962 820 990 1180 L1060 1180 Q1060 820 1050 520 Z" fill="url(#${p}-curt)"/>
  <rect x="520" y="508" width="560" height="14" rx="7" fill="#0b1229"/>
  <polygon points="600,1092 980,1092 1180,1920 330,1920" fill="url(#${p}-shaft)" style="mix-blend-mode:screen"/>
  <rect x="196" y="880" width="320" height="16" rx="4" fill="#2a1d18"/><rect x="214" y="896" width="12" height="26" fill="#1e1511"/><rect x="486" y="896" width="12" height="26" fill="#1e1511"/>
  ${bk}
  <g id="${p}-plant"><path d="M990 1300 L1050 1300 L1040 1392 L1000 1392 Z" fill="#a4553a"/>
    <path id="${p}-leaf1" d="M1020 1300 Q980 1220 990 1150 Q1030 1210 1020 1300" fill="#2f7d4f"/>
    <path id="${p}-leaf2" d="M1020 1300 Q1060 1210 1050 1160 Q1010 1220 1020 1300" fill="#3f9a5f"/>
    <path id="${p}-leaf3" d="M1020 1300 Q1000 1240 960 1230 Q990 1280 1020 1300" fill="#256b42"/></g>
  <g id="${p}-bed">
    <rect x="96" y="1000" width="46" height="420" rx="10" fill="#23170f"/><rect x="104" y="1008" width="30" height="404" rx="8" fill="#3a2719"/>
    <rect x="110" y="1300" width="720" height="110" rx="12" fill="#2a1c13"/><rect x="118" y="1300" width="704" height="20" fill="#3d2a1c"/>
    <rect x="130" y="1238" width="690" height="70" rx="22" fill="#d6dcec"/><rect x="130" y="1278" width="690" height="30" rx="14" fill="#aab3cc"/>
    <rect x="790" y="1400" width="22" height="40" fill="#1a110b"/><rect x="118" y="1400" width="22" height="40" fill="#1a110b"/>
  </g>`;
}
export function pillow(id) { return `<g id="${id}"><path d="M166 1206 Q160 1180 190 1176 L318 1180 Q346 1184 340 1212 Q338 1244 312 1244 L188 1242 Q164 1240 166 1206 Z" fill="#eef1fa"/><path d="M176 1232 Q250 1250 330 1230" stroke="#b9c1d8" stroke-width="5" fill="none"/></g>`; }
export function blanket(id, p) { return `<g id="${id}"><path d="M400 1180 Q520 1150 640 1170 Q760 1160 830 1190 L840 1330 Q780 1350 720 1328 Q640 1360 560 1334 Q480 1356 404 1330 Q388 1260 400 1180 Z" fill="url(#${p}-blank)"/><path d="M450 1200 Q520 1240 560 1330 M640 1180 Q660 1260 700 1330" stroke="rgba(10,20,60,.45)" stroke-width="6" fill="none"/><path d="M402 1186 Q520 1156 640 1174 Q760 1164 828 1194" stroke="#8aa2ff" stroke-width="4" fill="none" opacity=".5"/></g>`; }
export function phone(id, x, y) { return `<g id="${id}"><rect x="${x}" y="${y}" width="58" height="104" rx="10" fill="#0b0d14" stroke="#3b4256" stroke-width="3"/><rect id="${id}-scr" x="${x + 5}" y="${y + 8}" width="48" height="88" rx="6" fill="#1a2c5c"/><text x="${x + 29}" y="${y + 52}" text-anchor="middle" font-family="Mont" font-weight="800" font-size="15" fill="#fff">07:00</text><rect x="${x + 14}" y="${y + 66}" width="30" height="6" rx="3" fill="#ff8a3d"/></g>`; }
export function mug(id, x, y) { return `<g id="${id}"><path d="M${x} ${y} L${x + 54} ${y} L${x + 50} ${y + 64} Q${x + 27} ${y + 72} ${x + 4} ${y + 64} Z" fill="#e8ecf5"/><path d="M${x + 54} ${y + 14} Q${x + 76} ${y + 16} ${x + 70} ${y + 38} Q${x + 64} ${y + 50} ${x + 50} ${y + 46}" stroke="#e8ecf5" stroke-width="8" fill="none"/><rect x="${x + 8}" y="${y + 20}" width="38" height="10" fill="#ff8a3d"/></g>`; }
