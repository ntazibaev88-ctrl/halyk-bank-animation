// Builds index.html (the HyperFrames composition) from:
//   data/timeline.json  scene + word timings from the voiceover
//   data/shots.json     footage slots
//   footage/<id>.mp4    real clips, when present (otherwise an animated 2D stand-in)
// Also writes data/cuts.json, which scripts/audio.py uses to place sound effects.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { geoMercator, geoPath } from "d3-geo";
import { contours } from "d3-contour";
import * as topojson from "topojson-client";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1080, H = 1920;
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const timeline = rd("data/timeline.json");
const { slots } = rd("data/shots.json");
const DUR = timeline.duration;
const sceneById = Object.fromEntries(timeline.scenes.map((s) => [s.id, s]));
const r3 = (x) => Math.round(x * 1000) / 1000;

// ---------- fonts (Montserrat: cyrillic + cyrillic-ext cover every Kazakh letter) ----------
const fontDir = path.join(ROOT, "assets/fonts");
fs.mkdirSync(fontDir, { recursive: true });
let fontCss = "";
function addFont(pkg, file) {
  const css = fs.readFileSync(require.resolve(`@fontsource/${pkg}/${file}`), "utf8");
  for (const block of css.match(/@font-face\s*{[^}]+}/g)) {
    if (!/(cyrillic|latin)/.test(block)) continue;
    const woff2 = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/)[1];
    if (!/(cyrillic-ext|cyrillic|latin-ext|latin)-\d/.test(woff2)) continue;
    fs.copyFileSync(require.resolve(`@fontsource/${pkg}/files/${woff2}`), path.join(fontDir, woff2));
    fontCss += block
      .replace(/src:[^;]+;/, `src: url(assets/fonts/${woff2}) format('woff2');`)
      .replace(/font-display:[^;]+;/, "font-display: block;") + "\n";
  }
}
for (const w of [300, 400, 500, 600, 700, 800]) addFont("montserrat", `${w}.css`);
addFont("montserrat", "300-italic.css");
addFont("montserrat", "500-italic.css");
addFont("ibm-plex-mono", "400.css");
addFont("ibm-plex-mono", "500.css");

// ---------- shot layout ----------
const XF = 0.5; // cross-dissolve length at cuts
const footageFor = (id) => {
  for (const ext of ["mp4", "mov", "webm", "m4v"]) {
    const p = path.join(ROOT, "footage", `${id}.${ext}`);
    if (fs.existsSync(p)) return `footage/${id}.${ext}`;
  }
  return null;
};
const shots = slots.map((s, i) => {
  const sc = sceneById[s.scene];
  const len = sc.end - sc.start;
  let start = sc.start + s.a * len;
  let end = sc.start + s.b * len;
  const first = i === 0, last = i === slots.length - 1;
  const t0 = first ? 0 : start - XF / 2;
  // the shot before a split screen stays up while the two panels slide in over it
  const t1 = last ? DUR : slots[i + 1].split === "top" ? end + 0.9 : end + XF / 2;
  return { ...s, start: r3(start), end: r3(end), t0: r3(t0), t1: r3(t1), src: footageFor(s.id) };
});
// A split-screen top panel is followed by the bottom panel taking over, so no tail needed.
const sceneCuts = timeline.scenes.slice(1).map((s) => s.start);

// ---------- Kazakhstan map ----------
const world = require("world-atlas/countries-50m.json");
const countries = topojson.feature(world, world.objects.countries).features;
const kz = countries.find((f) => f.id === "398");
const MAPW = 900, MAPH = 560;
const proj = geoMercator().fitExtent([[40, 40], [MAPW - 40, MAPH - 40]], kz);
const gp = geoPath(proj);
const neighborIds = ["860", "795", "643", "417", "156"]; // UZ TM RU KG CN
const kzPath = gp(kz);
const neighborPaths = countries.filter((f) => neighborIds.includes(f.id)).map((f) => gp(f));
const ALMATY = [76.8897, 43.2389];
const ASTANA = [71.4304, 51.1282];
const pA = proj(ALMATY).map(r3), pS = proj(ASTANA).map(r3);
// graticule lines every 5 degrees
const grat = [];
for (let lon = 45; lon <= 90; lon += 5) grat.push(gp({ type: "LineString", coordinates: Array.from({ length: 21 }, (_, k) => [lon, 38 + k]) }));
for (let lat = 40; lat <= 56; lat += 4) grat.push(gp({ type: "LineString", coordinates: Array.from({ length: 51 }, (_, k) => [44 + k, lat]) }));

// ---------- topographic contours of a stylised Trans-Ili Alatau ----------
function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const GX = 135, GY = 240; // grid -> 8px cells over 1080x1920
const rnd = mulberry(7);
const waves = Array.from({ length: 9 }, () => ({ fx: 0.5 + rnd() * 5, fy: 0.5 + rnd() * 5, ph: rnd() * 6.28, a: 0.15 + rnd() * 0.5 }));
const peaks = [
  { x: 0.74, y: 0.6, h: 1.0, s: 0.09 },  // Talgar side (east)
  { x: 0.5, y: 0.63, h: 0.8, s: 0.1 },
  { x: 0.28, y: 0.61, h: 0.72, s: 0.09 },
  { x: 0.9, y: 0.66, h: 0.7, s: 0.08 },
  { x: 0.12, y: 0.65, h: 0.6, s: 0.08 },
];
const field = new Float64Array(GX * GY);
for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
  const x = i / GX, y = j / GY;
  const ridgeY = 0.62 + 0.03 * Math.sin(x * 5.2 + 0.7);
  let h = 0.85 * Math.exp(-((y - ridgeY) ** 2) / (2 * 0.075 ** 2)) + 0.25 * Math.max(0, y - 0.45);
  for (const p of peaks) h += p.h * 0.55 * Math.exp(-(((x - p.x) * 1.3) ** 2 + (y - p.y) ** 2) / (2 * p.s ** 2));
  for (const w of waves) h += 0.035 * w.a * Math.sin(x * w.fx * 6.28 + y * w.fy * 6.28 + w.ph);
  field[j * GX + i] = h;
}
const thresholds = Array.from({ length: 22 }, (_, k) => 0.12 + k * 0.065);
const cgen = contours().size([GX, GY]).thresholds(thresholds);
const sx = W / GX, sy = H / GY;
const topoPaths = cgen(Array.from(field)).map((c, k) => {
  const parts = [];
  for (const poly of c.coordinates) for (const ring of poly) {
    parts.push("M" + ring.map(([x, y]) => `${(x * sx).toFixed(1)},${(y * sy).toFixed(1)}`).join("L") + "Z");
  }
  return { k, d: parts.join("") };
}).filter((p) => p.d.length > 0);
const talgar = [peaks[0].x * W, peaks[0].y * H];

// ---------- stylised city map (Almaty's grid tilts slightly; mountains to the south) ----------
const cityLines = [];
const cr = mulberry(31);
for (let k = -6; k <= 6; k++) cityLines.push({ x1: 450 + k * 64, y1: -40, x2: 450 + k * 64 + 40, y2: 660, w: k % 3 === 0 ? 3.2 : 1.3 });
for (let k = 0; k <= 8; k++) cityLines.push({ x1: -40, y1: 30 + k * 62, x2: 940, y2: 30 + k * 62 - 50, w: k % 4 === 1 ? 3.2 : 1.3 });
const cityRivers = [
  "M300,700 C320,560 280,460 330,330 S360,120 340,-30",
  "M610,700 C590,580 640,470 600,340 S560,140 590,-30",
];
const cityHills = Array.from({ length: 6 }, (_, k) => `M-40,${560 + k * 22} C200,${520 + k * 22 - cr() * 30} 420,${545 + k * 22} 600,${520 + k * 22} S880,${540 + k * 22 - cr() * 20} 960,${530 + k * 22}`);

// ---------- subtitles ----------
const KEYWORDS = ["алматы", "қазақстан", "іле", "алатау", "медеу", "шымбұлақ", "көктөбе", "панфилов", "собор", "жүректе", "сезім", "арманға", "армандар", "ақбас"];
const isKey = (w) => KEYWORDS.some((k) => w.toLowerCase().replace(/[^\p{L}]/gu, "").startsWith(k));
const cues = [];
const lastSentence = timeline.sentences[timeline.sentences.length - 1];
for (const s of timeline.sentences) {
  if (s === lastSentence) continue; // the final line is shown as the closing title instead
  const toks = [];
  for (const t of s.text.split(/\s+/)) {
    if (/^[—–-]+$/.test(t) && toks.length) toks[toks.length - 1] += " " + t;
    else toks.push(t);
  }
  if (toks.length !== s.words.length) throw new Error(`word mismatch in: ${s.text}`);
  let cur = [];
  const flush = () => { if (cur.length) cues.push(cur); cur = []; };
  toks.forEach((t, i) => {
    const w = s.words[i];
    cur.push({ t, s: w.s, e: w.e, key: isKey(t) });
    const text = cur.map((c) => c.t).join(" ");
    const next = s.words[i + 1];
    const punct = /[,.:;!?—]$/.test(t);
    if (!next || text.length > 34 || (punct && text.length >= 14) || (next && next.s - w.e > 0.32 && text.length > 10)) flush();
  });
  flush();
}
const cueData = cues.map((c, i) => {
  const start = c[0].s - 0.12;
  const nextStart = cues[i + 1] ? cues[i + 1][0].s - 0.12 : Infinity;
  const end = Math.min(c[c.length - 1].e + 0.55, nextStart - 0.02);
  return { start: r3(start), end: r3(end), words: c.map((w) => ({ t: w.t, s: r3(w.s), k: w.key })) };
});

// ---------- HTML ----------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const gradeAttr = (preset) => esc(JSON.stringify({
  preset, intensity: 0.85,
  adjust: { contrast: 0.05, saturation: 0.04 },
  details: { vignette: 0.22, grain: 0.1 },
}));

let shotHtml = "";
shots.forEach((s, i) => {
  const box = s.split === "top" ? "split-top" : s.split === "bottom" ? "split-bottom" : "";
  const dur = r3(s.t1 - s.t0);
  const inner = s.src
    ? `<video id="v${s.id}" class="clip footage" data-start="${s.t0}" data-duration="${dur}" data-media-start="${s.in}" data-track-index="${1 + (i % 2)}" muted playsinline src="${s.src}" style="object-position:${s.focus}" data-color-grading="${gradeAttr(s.grade)}"></video>`
    : `<svg id="art${s.id}" class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" data-fallback='${JSON.stringify(s.fallback)}'></svg>`;
  shotHtml += `
      <div id="shot${s.id}" class="clip shot ${box}" data-start="${s.t0}" data-duration="${dur}" data-track-index="${1 + (i % 2)}" style="z-index:${10 + i}" data-want="${esc(s.want)}">${inner}</div>`;
});

const sceneMeta = {
  s2: { n: "02", name: "ҚАЛА ТЫНЫСЫ" },
  s3: { n: "03", name: "ТАУЛАР" },
  s4: { n: "04", name: "МЕДЕУ · ШЫМБҰЛАҚ" },
  s5: { n: "05", name: "КӨКТӨБЕ" },
  s6: { n: "06", name: "МӘДЕНИЕТ" },
};

const DATA = {
  W, H, duration: DUR, scenes: timeline.scenes, sentences: timeline.sentences,
  shots: shots.map(({ id, scene, start, end, t0, t1, split, fallback, src, enter }) => ({ id, scene, start, end, t0, t1, split, fallback, enter, real: !!src })),
  cues: cueData, sceneMeta, finalSentence: lastSentence,
  map: { pA, pS, w: MAPW, h: MAPH }, talgar,
};

const html = `<!doctype html>
<html lang="kk" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>Алматы — жүректе қалатын қала</title>
    <script src="vendor/gsap.min.js"></script>
    <style>
${fontCss}
    </style>
    <link rel="stylesheet" href="assets/film.css" />
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}" data-fps="30">
      <audio id="vo" class="clip" data-start="0" data-duration="${DUR}" data-track-index="20" data-volume="1" src="assets/audio/voiceover.wav"></audio>
      <audio id="music" class="clip" data-start="0" data-duration="${DUR}" data-track-index="21" data-volume="0.45" src="assets/audio/music.wav"></audio>
      <audio id="fx" class="clip" data-start="0" data-duration="${DUR}" data-track-index="22" data-volume="0.8" src="assets/audio/fx.wav"></audio>

      <div id="stage">${shotHtml}
      </div>
      <div id="splitline"></div>

      <!-- finishing layers -->
      <div id="haze"></div>
      <div id="vignette"></div>
      <div id="shade-top"></div>
      <div id="shade-bottom"></div>
      <div id="leak"></div>

      <!-- SCENE 1: topo lines + title -->
      <svg id="topo-lines" viewBox="0 0 ${W} ${H}">
        ${topoPaths.filter((_, k) => k % 2 === 0).map((p) => `<path d="${p.d}" />`).join("\n        ")}
      </svg>
      <div id="title-block">
        <div id="pin"><svg viewBox="0 0 48 64"><path d="M24 2C12 2 3 11 3 23c0 15 21 37 21 37s21-22 21-37C45 11 36 2 24 2z" /><circle cx="24" cy="23" r="8" /></svg><span class="ring"></span><span class="ring r2"></span></div>
        <div id="coords" class="mono">43.2389° N &nbsp;·&nbsp; 76.8897° E</div>
        <h1 id="title">${[..."АЛМАТЫ"].map((c) => `<span class="ch">${c}</span>`).join("")}</h1>
        <div id="tagline"><span class="rule"></span><span class="tg">ТАУЛАР МЕН АРМАНДАР ҚАЛАСЫ</span><span class="rule"></span></div>
      </div>

      <!-- SCENE 1b: Kazakhstan map card -->
      <div id="kzcard" class="card">
        <div class="card-head"><span class="mono dim">01</span><span>ҚАЗАҚСТАН</span><span class="mono dim right">43°N · 77°E</span></div>
        <svg id="kzmap" viewBox="0 0 ${MAPW} ${MAPH}">
          <g class="grat">${grat.map((d) => `<path d="${d}" />`).join("")}</g>
          <g class="nb">${neighborPaths.map((d) => `<path d="${d}" />`).join("")}</g>
          <path id="kz-fill" d="${kzPath}" />
          <path id="kz-line" d="${kzPath}" pathLength="1" />
          <g id="astana" transform="translate(${pS[0]} ${pS[1]})"><circle r="5" /><text x="12" y="5">Астана</text></g>
          <g id="almaty-pin" transform="translate(${pA[0]} ${pA[1]})">
            <circle class="pulse p1" r="10" /><circle class="pulse p2" r="10" /><circle class="dot" r="9" />
          </g>
          <g id="almaty-label" transform="translate(${pA[0]} ${pA[1]})">
            <path class="leader" d="M0,0 L-60,-70 L-290,-70" pathLength="1" />
            <text class="big" x="-290" y="-84">АЛМАТЫ</text>
            <text class="small mono" x="-290" y="-46">43.24°N  76.89°E</text>
          </g>
        </svg>
        <div class="card-foot"><div class="stat"><b>2 млн+</b><span>тұрғын</span></div><div class="stat"><b>№1</b><span>ең үлкен қала</span></div><div class="stat"><b>1854</b><span>негізі қаланды</span></div></div>
      </div>

      <!-- SCENE 3: topographic interlude -->
      <div id="topo" class="full">
        <svg id="topo-map" viewBox="0 0 ${W} ${H}">
          <rect width="${W}" height="${H}" fill="url(#topoBg)" />
          <defs><radialGradient id="topoBg" cx="0.6" cy="0.55" r="0.8"><stop offset="0" stop-color="#16303a"/><stop offset="1" stop-color="#071318"/></radialGradient></defs>
          <g id="topo-grid">${Array.from({ length: 9 }, (_, k) => `<line x1="${k * 135}" y1="0" x2="${k * 135}" y2="${H}" />`).join("")}${Array.from({ length: 15 }, (_, k) => `<line x1="0" y1="${k * 137}" x2="${W}" y2="${k * 137}" />`).join("")}</g>
          <g id="topo-c">${topoPaths.map((p) => `<path class="c${p.k}" d="${p.d}" pathLength="1" />`).join("")}</g>
          <g id="topo-city" transform="translate(${0.42 * W} ${0.36 * H})"><circle class="halo" r="70" /><circle r="11" /><text x="26" y="10">Алматы</text></g>
          <g transform="translate(${talgar[0]} ${talgar[1]})"><g id="topo-peak"><path d="M0,-16 L14,10 L-14,10Z" /><text x="-24" y="-4" text-anchor="end">Талғар шыңы</text><text class="mono sm" x="-24" y="30" text-anchor="end">4979 м</text></g></g>
        </svg>
        <div id="topo-title"><span class="mono dim">03 · ГЕОГРАФИЯ</span><h2>ІЛЕ АЛАТАУЫ</h2><span class="mono dim">Тянь-Шань тау жүйесі</span></div>
        <div id="topo-north" class="mono">N ↑</div>
      </div>

      <!-- SCENE 4: Medeu -> Shymbulak route band -->
      <div id="route">
        <svg viewBox="0 0 1080 120">
          <line class="base" x1="150" y1="60" x2="930" y2="60" />
          <line id="route-line" x1="150" y1="60" x2="930" y2="60" pathLength="1" />
          <circle class="stop" cx="150" cy="60" r="10" /><circle class="stop" cx="930" cy="60" r="10" />
          <g id="gondola"><rect x="-13" y="-9" width="26" height="22" rx="5" /><line x1="0" y1="-9" x2="0" y2="-20" /></g>
        </svg>
        <div class="rl left"><b>МЕДЕУ</b><span class="mono">1691 м</span></div>
        <div class="rl right"><b>ШЫМБҰЛАҚ</b><span class="mono">2260 м</span></div>
      </div>

      <!-- SCENE 5: city map card -->
      <div id="citycard" class="card">
        <div class="card-head"><span class="mono dim">05</span><span>КЕШКІ ҚАЛА</span><span class="mono dim right">N ↑</span></div>
        <svg id="citymap" viewBox="0 0 900 640">
          <g class="hills">${cityHills.map((d) => `<path d="${d}" />`).join("")}</g>
          <g class="streets">${cityLines.map((l) => `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke-width="${l.w}" pathLength="1" />`).join("")}</g>
          <g class="rivers">${cityRivers.map((d) => `<path d="${d}" pathLength="1" />`).join("")}</g>
          <g class="cpin" id="cp-center" transform="translate(430 250)"><circle r="7" /><text x="16" y="6">Орталық</text></g>
          <g class="cpin main" id="cp-koktobe" transform="translate(640 430)"><circle class="pulse p1" r="12" /><circle r="11" /><text x="22" y="8">Көктөбе</text></g>
          <g class="cpin" id="cp-medeu" transform="translate(810 560)"><circle r="7" /><text x="-92" y="6">Медеу</text></g>
        </svg>
      </div>
      <div id="evening-word"><span>КЕШКІ</span><span>АЛМАТЫ</span></div>

      <!-- SCENE 6: editorial year -->
      <div id="year"><span class="mono dim">ВОЗНЕСЕНИЕ СОБОРЫ</span><b>1907</b><span class="cap">ағаштан салынған әйгілі ғимарат</span></div>

      <!-- chapter labels + location labels -->
      <div id="chapter"><span class="n mono"></span><span class="bar"></span><span class="nm"></span></div>
      <div id="loc" class="loc"><span class="ico"></span><span class="txt"></span><span class="sub mono"></span></div>

      <!-- subtitles -->
      <div id="subs"></div>

      <!-- finale -->
      <div id="final">
        <div class="l1">АЛМАТЫ —</div>
        <div class="l2">ЖҮРЕКТЕ ҚАЛАТЫН</div>
        <div class="l3">ҚАЛА.</div>
        <div class="sig mono">43.2389° N · 76.8897° E</div>
      </div>
      <div id="black"></div>
    </div>
    <script>window.__DATA = ${JSON.stringify(DATA)};</script>
    <script src="assets/illustrations.js"></script>
    <script src="assets/film.js"></script>
  </body>
</html>
`;
fs.writeFileSync(path.join(ROOT, "index.html"), html);

// cut points for the sound designer script
fs.writeFileSync(path.join(ROOT, "data/cuts.json"), JSON.stringify({
  duration: DUR,
  sceneCuts,
  shotCuts: shots.slice(1).map((s) => s.start),
  scenes: timeline.scenes,
  final: lastSentence.start,
}, null, 1));

const real = shots.filter((s) => s.src).length;
console.log(`index.html written: ${DUR}s, ${shots.length} shots (${real} real clips, ${shots.length - real} animated stand-ins), ${cueData.length} subtitle cues`);
