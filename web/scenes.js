// Scene engine: render(t) draws the full 1080x1920 frame for time t (seconds) as SVG.
'use strict';

const W = 1080, HGT = 1920, GROUND = 1100;
let revEnd = 3;
const { clamp, lerp, prog, easeOut, easeInOut, back, rnd, f } = H;
let TL = null;

// ---------------------------------------------------------------- palette / skies
const SKY = {
  dawn:    { sky: ['#14214A', '#5B5A9A', '#F2A07B'], far: '#7C78A8', near: '#4B4A7E', ground: ['#3E5B52', '#1C2B33'], sun: '#FFD9A0', lit: .3 },
  morning: { sky: ['#4D9BDB', '#9CD2F2', '#EAF6FC'], far: '#B4CFE4', near: '#86A9C6', ground: ['#7DAA6A', '#2C4A3C'], sun: '#FFF6D8', lit: 0 },
  day:     { sky: ['#2A7FD2', '#78BDEE', '#D6EDF9'], far: '#A9C9E3', near: '#7EA2C2', ground: ['#78A867', '#2A4639'], sun: '#FFFFFF', lit: 0 },
  golden:  { sky: ['#365FAA', '#E7A877', '#FCE2B0'], far: '#D9AE90', near: '#A9857A', ground: ['#8C9A5C', '#33392C'], sun: '#FFE6A8', lit: .15 },
  dusk:    { sky: ['#1B1D4B', '#734691', '#F0895C'], far: '#86598C', near: '#4A386C', ground: ['#4A4560', '#1A1A2C'], sun: '#FFC08A', lit: .7 },
  night:   { sky: ['#040A1C', '#0D1C43', '#1E386A'], far: '#1B2C57', near: '#121F3E', ground: ['#16243A', '#0A1120'], sun: '#E8EEFF', lit: 1 },
};

// ---------------------------------------------------------------- the growing city (shared by every scene)
// Each building has a completion year, so the skyline grows from the 1997 Akmola to the 2026 capital.
const CITY = (() => {
  const r = rnd(1997), far = [], near = [];
  let x = -360;
  while (x < 1440) {
    const year = 1997 + Math.floor(Math.pow(r(), 0.8) * 30);
    const modern = year > 2001;
    const w = modern ? 50 + r() * 70 : 60 + r() * 60;
    const h = modern ? 160 + r() * 340 * Math.min(1, (year - 1997) / 22 + 0.3) : 60 + r() * 90;
    far.push({ x, w, h, year: year > 1998 ? year : 1990, modern, seed: (r() * 1e6) | 0, roof: r() });
    x += w * (0.55 + r() * 0.5);
  }
  x = -360;
  while (x < 1440) {
    const year = 1997 + Math.floor(Math.pow(r(), 0.9) * 30);
    const modern = year > 2001;
    const w = 70 + r() * 80, h = modern ? 120 + r() * 230 : 50 + r() * 70;
    near.push({ x, w, h, year: year > 1998 ? year : 1990, modern, seed: (r() * 1e6) | 0, roof: r() });
    x += w * (0.9 + r() * 0.7);
  }
  return { far, near };
})();

function skylineLayer(list, yearNow, color, lit, dx, scaleY = 1, growT = 1) {
  let s = '';
  for (const b of list) {
    if (b.year > Math.ceil(yearNow)) continue;
    // buildings of the current year rise during the scene
    const k = b.year > yearNow - 1 && b.year <= yearNow ? easeOut(growT) : 1;
    const h = b.h * scaleY * k;
    if (h < 2) continue;
    const x = b.x + dx;
    if (x > W + 40 || x + b.w < -40) continue;
    if (b.modern && b.roof > .6) s += `<path d="M${f(x)} ${GROUND} V${f(GROUND - h + 30)} L${f(x + b.w / 2)} ${f(GROUND - h)} L${f(x + b.w)} ${f(GROUND - h + 30)} V${GROUND} Z" fill="${color}"/>`;
    else s += `<rect x="${f(x)}" y="${f(GROUND - h)}" width="${f(b.w)}" height="${f(h)}" fill="${color}"/>`;
    if (b.modern && b.roof < .25) s += `<rect x="${f(x + b.w / 2 - 1.5)}" y="${f(GROUND - h - 40)}" width="3" height="40" fill="${color}"/>`;
    if (lit > 0 && h > 40) {
      const r = rnd(b.seed);
      for (let y = GROUND - h + 14; y < GROUND - 10; y += 18) for (let c = 6; c < b.w - 8; c += 14)
        if (r() < 0.22) s += `<rect x="${f(x + c)}" y="${f(y)}" width="6" height="7" fill="#FFD98A" opacity="${(lit * 0.75).toFixed(2)}"/>`;
    }
  }
  return s;
}

// ---------------------------------------------------------------- environment layers
function clouds(u, preset, seed = 3, n = 5) {
  const r = rnd(seed), P = SKY[preset];
  const col = preset === 'night' ? '#2A3A66' : preset === 'dusk' ? '#C98AA0' : preset === 'dawn' ? '#E9A9A0' : '#FFFFFF';
  let s = '';
  for (let i = 0; i < n; i++) {
    const y = 200 + r() * 650, sc = 0.6 + r() * 0.9, sp = 6 + r() * 14;
    const x = ((r() * 1500 + u * sp) % 1500) - 250;
    s += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(sc)})" opacity="${preset === 'night' ? .5 : .75}">`
      + `<ellipse cx="0" cy="0" rx="120" ry="26" fill="${col}"/><ellipse cx="-40" cy="-18" rx="55" ry="34" fill="${col}"/><ellipse cx="30" cy="-24" rx="65" ry="42" fill="${col}"/></g>`;
  }
  return s;
}

function sky(preset, u, sunPos = [820, 760]) {
  const P = SKY[preset];
  let s = `<defs><linearGradient id="sky_${preset}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".55" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${P.sky[2]}"/></linearGradient>`
    + `<linearGradient id="gr_${preset}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.ground[0]}"/><stop offset="1" stop-color="${P.ground[1]}"/></linearGradient></defs>`;
  s += `<rect x="-200" y="-200" width="${W + 400}" height="${GROUND + 400}" fill="url(#sky_${preset})"/>`;
  if (preset === 'night') {
    const r = rnd(77);
    for (let i = 0; i < 110; i++) { const tw = 0.5 + 0.5 * Math.sin(u * 2 + i); s += `<circle cx="${f(r() * W)}" cy="${f(r() * 1000)}" r="${f(r() * 2 + .6)}" fill="#FFFFFF" opacity="${f(0.3 + 0.5 * tw)}"/>`; }
  }
  s += `<circle cx="${sunPos[0]}" cy="${sunPos[1]}" r="190" fill="${P.sun}" opacity=".18" filter="url(#blur30)"/>`;
  s += `<circle cx="${sunPos[0]}" cy="${sunPos[1]}" r="${preset === 'night' ? 46 : 70}" fill="${P.sun}" opacity="${preset === 'day' || preset === 'morning' ? .85 : .95}"/>`;
  return s;
}

function ground(preset, u, opts = {}) {
  const P = SKY[preset];
  let s = `<rect x="-200" y="${GROUND}" width="${W + 400}" height="${HGT - GROUND + 200}" fill="url(#gr_${preset})"/>`;
  // Ishim river with shimmer
  if (opts.river !== false) {
    const ry = GROUND + 70;
    s += `<path d="M-200 ${ry} C 200 ${ry - 20} 600 ${ry + 30} ${W + 200} ${ry + 5} L ${W + 200} ${ry + 70} C 600 ${ry + 95} 200 ${ry + 45} -200 ${ry + 70} Z" fill="${preset === 'night' ? '#1D3D6E' : preset === 'dusk' ? '#8C5F8E' : '#6FB3DE'}" opacity=".85"/>`;
    for (let i = 0; i < 14; i++) {
      const x = ((i * 97 + u * 40) % (W + 200)) - 100;
      s += `<rect x="${f(x)}" y="${ry + 20 + (i % 4) * 12}" width="${40 + (i % 3) * 20}" height="3" rx="1.5" fill="#FFFFFF" opacity=".35"/>`;
    }
  }
  // promenade trees (foreground parallax)
  if (opts.trees !== false) {
    const r = rnd(11), dx = -u * 26;
    for (let i = 0; i < 22; i++) {
      const x = ((i * 90 + dx) % 1980 + 1980) % 1980 - 450, sc = 0.7 + r() * 0.5;
      s += `<g transform="translate(${f(x)} ${GROUND + 8}) scale(${f(sc)})"><rect x="-3" y="-30" width="6" height="30" fill="#3B2F2A"/><ellipse cx="0" cy="-48" rx="26" ry="30" fill="${preset === 'night' ? '#1E3B2E' : preset === 'dusk' ? '#3E3A55' : '#3F7A45'}"/><ellipse cx="-7" cy="-56" rx="12" ry="12" fill="#FFFFFF" opacity=".08"/></g>`;
    }
  }
  {
    const ry = GROUND + 380;
    s += `<rect x="-200" y="${ry}" width="${W + 400}" height="96" fill="${preset === 'night' ? '#141C2C' : '#3A4150'}"/>`;
    for (let i = 0; i < 12; i++) s += `<rect x="${f(((i * 120 - u * 90) % 1440 + 1440) % 1440 - 180)}" y="${ry + 46}" width="60" height="5" fill="#E6E6E6" opacity=".55"/>`;
    const cr = rnd(23), cols = ['#E8443A', '#F5F5F5', '#2F7DD1', '#F5B820', '#3A3F4A'];
    for (let i = 0; i < 7; i++) {
      const lane = i % 2, sp = (lane ? -1 : 1) * (110 + cr() * 80), x0 = cr() * 1600;
      const x = ((x0 + u * sp) % 1600 + 1600) % 1600 - 260, y = ry + (lane ? 14 : 58), c = cols[i % 5];
      s += `<g transform="translate(${f(x)} ${y})"><rect x="0" y="0" width="86" height="26" rx="9" fill="${c}"/><rect x="18" y="-14" width="48" height="18" rx="6" fill="${c}"/><rect x="24" y="-10" width="16" height="11" rx="2" fill="#BFD9F2"/><rect x="44" y="-10" width="16" height="11" rx="2" fill="#BFD9F2"/><circle cx="20" cy="27" r="7" fill="#15181E"/><circle cx="66" cy="27" r="7" fill="#15181E"/>${preset === 'night' || preset === 'dusk' ? `<circle cx="${lane ? 2 : 84}" cy="12" r="5" fill="#FFF3B0"/>` : ''}</g>`;
    }
  }
  if (opts.trees !== false) {
    const dx2 = -u * 48;
    for (let i = 0; i < 10; i++) {
      const x = ((i * 210 + dx2) % 2100 + 2100) % 2100 - 500;
      s += `<g transform="translate(${f(x)} ${GROUND + 560}) scale(2.3)"><rect x="-3" y="-30" width="6" height="30" fill="#1E1A18"/><ellipse cx="0" cy="-50" rx="28" ry="32" fill="${preset === 'night' ? '#0F2219' : preset === 'dusk' ? '#24203A' : '#24502E'}"/></g>`;
    }
  }
  return s;
}

// Landmark with "architectural reveal": blueprint lines draw first, then the colour fill rises from the ground.
let clipN = 0;
function reveal(inner, x, y, scale, h, p, opts = {}) {
  const id = 'rv' + (clipN++);
  const draw = prog(p, 0, 0.5), fill = easeInOut(prog(p, 0.3, 1)), bpFade = 1 - prog(p, 0.8, 1);
  let s = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(scale)})">`;
  if (bpFade > 0 && opts.blueprint !== false)
    s += `<g class="bp" style="stroke-dashoffset:${f(2600 * (1 - draw))};opacity:${f(bpFade)}">${inner}</g>`;
  if (fill > 0) {
    const top = -h * 1.1 * fill;
    s += `<clipPath id="${id}"><rect x="-1200" y="${f(top)}" width="2400" height="${f(-top + 40)}"/></clipPath>`;
    s += `<g clip-path="url(#${id})">${inner}</g>`;
    if (fill < 1) s += `<rect x="-480" y="${f(top - 2)}" width="960" height="4" fill="#FFD24A" opacity=".9" filter="url(#glow)"/>`;
  }
  return s + '</g>';
}

// ---------------------------------------------------------------- overlays
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function textW(str, size, weight = 600) { return str.length * size * (weight >= 700 ? 0.6 : 0.56); }

function chip(x, y, text, k, opts = {}) {
  if (k <= 0) return '';
  const size = opts.size || 34, w = textW(text, size, 600) + 44, hh = size + 26;
  const e = back(clamp(k));
  const fill = opts.fill || 'rgba(8,20,48,.72)', col = opts.color || '#FFFFFF';
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(0.7 + 0.3 * e)})" opacity="${f(clamp(k * 1.6))}">`
    + `<rect x="0" y="${-hh / 2}" width="${f(w)}" height="${hh}" rx="${hh / 2}" fill="${fill}" stroke="${opts.stroke || 'rgba(255,210,74,.75)'}" stroke-width="2"/>`
    + `<text x="${f(w / 2)}" y="${f(size * 0.36)}" font-size="${size}" font-weight="600" fill="${col}" text-anchor="middle">${esc(text)}</text></g>`;
}

// Year + title header at the top of each chapter
function header(u, sc, year, title, chips = [], titleK = null) {
  let s = '';
  const k = easeOut(prog(u, 0.05, 0.7));
  const shadow = 'filter="url(#tshadow)"';
  if (year) {
    s += `<clipPath id="yc${clipN}"><rect x="0" y="140" width="${W}" height="190"/></clipPath>`;
    s += `<g clip-path="url(#yc${clipN++})"><text x="70" y="${f(300 + 160 * (1 - k))}" font-size="170" font-weight="800" fill="#FFFFFF" letter-spacing="-4" ${shadow}>${year}</text></g>`;
    s += `<rect x="72" y="320" width="${f(260 * easeOut(prog(u, 0.3, 1)))}" height="8" rx="4" fill="#FFD24A"/>`;
  }
  const tk = titleK === null ? easeOut(prog(u, 0.35, 1)) : titleK;
  if (title) {
    const size = title.length > 26 ? 48 : title.length > 20 ? 54 : 62;
    s += `<text x="${f(72 - 30 * (1 - tk))}" y="390" font-size="${size}" font-weight="700" fill="#FFFFFF" opacity="${f(tk)}" ${shadow}>${esc(title)}</text>`;
  }
  let cx = 72;
  chips.forEach((c, i) => {
    const kk = prog(u, (c.at ?? 0.9 + i * 0.25), (c.at ?? 0.9 + i * 0.25) + 0.45);
    s += chip(cx, 458, c.text, kk);
    cx += textW(c.text, 34) + 64;
  });
  return s;
}

function brand(t) {
  return `<g opacity=".85"><rect x="70" y="78" width="10" height="40" fill="#FFD24A"/><text x="94" y="110" font-size="30" font-weight="700" fill="#FFFFFF" letter-spacing="3" filter="url(#tshadow)">АСТАНА · 1997–2026</text></g>`;
}

const YEARS = [1997, 1998, 2002, 2004, 2006, 2010, 2012, 2017, 2019, 2022, 2026];
function timelineBar(pos, alpha) {
  if (alpha <= 0) return '';
  const x0 = 90, x1 = 870, y = 1290;
  const X = (i) => x0 + (x1 - x0) * i / (YEARS.length - 1);
  const px = lerp(X(Math.floor(pos)), X(Math.min(YEARS.length - 1, Math.floor(pos) + 1)), pos - Math.floor(pos));
  let s = `<g opacity="${f(alpha)}"><rect x="40" y="${y - 36}" width="880" height="76" rx="22" fill="rgba(6,14,34,.55)"/>`;
  s += `<line x1="${x0}" y1="${y - 8}" x2="${x1}" y2="${y - 8}" stroke="rgba(255,255,255,.3)" stroke-width="4" stroke-linecap="round"/>`;
  s += `<line x1="${x0}" y1="${y - 8}" x2="${f(px)}" y2="${y - 8}" stroke="#FFD24A" stroke-width="5" stroke-linecap="round"/>`;
  YEARS.forEach((yr, i) => {
    const act = 1 - clamp(Math.abs(pos - i)), done = i <= pos + 0.01;
    s += `<circle cx="${f(X(i))}" cy="${y - 8}" r="${f(7 + 6 * act)}" fill="${done ? '#FFD24A' : '#0B1A3A'}" stroke="#FFD24A" stroke-width="3"/>`;
    s += `<text x="${f(X(i))}" y="${y + 28}" font-size="${f(19 + 7 * act)}" font-weight="${act > .5 ? 800 : 600}" fill="${act > .5 ? '#FFD24A' : '#FFFFFF'}" opacity="${f(0.65 + 0.35 * act)}" text-anchor="middle">${yr}</text>`;
  });
  return s + '</g>';
}

function wrapLines(text, max = 32) {
  const words = text.split(' '), lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length > max && cur) lines.push(w); else lines[lines.length - 1] = (cur + ' ' + w).trim();
  }
  // avoid a lone short last word
  if (lines.length === 2 && lines[1].length < 8) {
    const a = lines[0].split(' '); lines[1] = a.pop() + ' ' + lines[1]; lines[0] = a.join(' ');
  }
  return lines;
}

function subtitles(t) {
  const sub = TL.subs.find((s) => t >= s.start - 0.05 && t < s.end + 0.12);
  if (!sub) return '';
  const a = clamp(Math.min((t - sub.start + 0.05) / 0.12, (sub.end + 0.12 - t) / 0.12));
  const lines = wrapLines(sub.text, 27);
  const size = 44, lh = 58, y0 = 1180 - (lines.length - 1) * lh / 2;
  const w = Math.max(...lines.map((l) => textW(l, size, 600))) + 70;
  let s = `<g opacity="${f(a)}"><rect x="${f(500 - w / 2)}" y="${f(y0 - lh / 2 - 28)}" width="${f(w)}" height="${lines.length * lh + 34}" rx="22" fill="rgba(4,10,26,.72)"/>`;
  lines.forEach((l, i) => { s += `<text x="500" y="${f(y0 + i * lh + 4)}" font-size="${size}" font-weight="600" fill="#FFFFFF" text-anchor="middle">${esc(l)}</text>`; });
  return s + '</g>';
}

// Letter-by-letter name change sign (Akmola → Astana etc.)
function nameFlip(x, y, from, to, k, size = 120, alpha = 1) {
  if (alpha <= 0) return '';
  const n = Math.max(from.length, to.length);
  const cw = size * 0.68, x0 = x - (n * cw) / 2;
  let s = `<g opacity="${f(alpha)}" filter="url(#tshadow)">`;
  for (let i = 0; i < n; i++) {
    const li = clamp(k * (n + 4) - i, 0, 1), e = easeInOut(li);
    const a = from[i] || '', b = to[i] || '';
    const cx = x0 + cw * (i + 0.5);
    if (a && e < 1) s += `<text x="${f(cx)}" y="${f(y - e * size * 0.6)}" font-size="${size}" font-weight="800" fill="#FFFFFF" opacity="${f(1 - e)}" text-anchor="middle">${esc(a)}</text>`;
    if (b && e > 0) s += `<text x="${f(cx)}" y="${f(y + (1 - e) * size * 0.6)}" font-size="${size}" font-weight="800" fill="#FFD24A" opacity="${f(e)}" text-anchor="middle">${esc(b)}</text>`;
  }
  return s + '</g>';
}

function fmtNum(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

// ---------------------------------------------------------------- generic landmark chapter
function landmarkScene(u, sc, o) {
  const d = sc.end - sc.start;
  const P = SKY[o.sky];
  const cam = 1 + 0.06 * easeInOut(prog(u, 0, d)), camX = -16 * u;
  let s = sky(o.sky, u, o.sun);
  s += clouds(u, o.sky, o.seed || 3);
  s += `<g transform="translate(540 ${GROUND}) scale(${f(cam)}) translate(-540 ${-GROUND})">`;
  s += `<g>${skylineLayer(CITY.far, o.cityYear, P.far, P.lit * 0.6, camX * 0.25 + 40, 1, prog(u, 0.2, 2.5))}</g>`;
  s += `<g>${skylineLayer(CITY.near.filter((b) => Math.abs(b.x + b.w / 2 - 540) > (o.gap || 330)), o.cityYear, P.near, P.lit, camX * 0.5, 0.9, prog(u, 0.2, 2.5))}</g>`;
  if (o.extraBack) s += o.extraBack(u);
  const rd = o.revealDur ?? clamp(d * 0.38, 2.4, 3.6);
  const p = prog(u, o.revealAt ?? 0.2, (o.revealAt ?? 0.2) + rd);
  revEnd = (o.revealAt ?? 0.2) + rd;
  s += `<g transform="translate(540 ${GROUND}) scale(.8) translate(-540 ${-GROUND})">`;
  s += reveal(o.draw(u), 540 + (o.dx || 0), GROUND + 2, o.scale || 1, o.h, p);
  if (o.extraFront) s += o.extraFront(u, p);
  s += '</g>';
  s += ground(o.sky, u);
  s += '</g>';
  return s;
}

function dimLine(x, yTop, yBot, label, k) {
  if (k <= 0) return '';
  const y = lerp(yBot, yTop, easeOut(k));
  return `<g opacity="${f(clamp(k * 2))}"><line x1="${x}" y1="${yBot}" x2="${x}" y2="${f(y)}" stroke="#FFD24A" stroke-width="3"/>`
    + `<line x1="${x - 16}" y1="${yBot}" x2="${x + 16}" y2="${yBot}" stroke="#FFD24A" stroke-width="3"/><line x1="${x - 16}" y1="${f(y)}" x2="${x + 16}" y2="${f(y)}" stroke="#FFD24A" stroke-width="3"/>`
    + `<g transform="translate(${x > 880 ? x - 26 - textW(label, 40, 700) - 30 : x + 26} ${f((y + yBot) / 2)})"><rect x="0" y="-30" width="${textW(label, 40, 700) + 30}" height="60" rx="14" fill="rgba(8,20,48,.75)"/><text x="15" y="14" font-size="40" font-weight="800" fill="#FFD24A">${label}</text></g></g>`;
}

// ---------------------------------------------------------------- scenes
const SCENES = {};

SCENES.title = (u0, sc) => {
  const u = u0 + 1.4;
  const P = SKY.dusk, cam = 1.08 - 0.08 * easeInOut(prog(u0, 0, 7.5));
  let s = sky('dusk', u, [540, 900]);
  s += clouds(u, 'dusk', 5, 4);
  s += `<g transform="translate(540 ${GROUND}) scale(${f(cam)}) translate(-540 ${-GROUND})">`;
  s += `<g>${skylineLayer(CITY.far, 2026, P.far, .8, 30 - u0 * 6, 1.1, 1)}</g>`;
  const row = [['palace', 80, .3, -10], ['akorda', 225, .27, -12], ['baiterek', 350, .42, -14], ['abudhabi', 480, .46, -16], ['khanshatyr', 625, .36, -18], ['hazrat', 770, .3, -20], ['grandmosque', 915, .3, -22], ['nuralem', 1045, .3, -24]];
  row.forEach(([n, x, scl, sp], i) => {
    const k = easeOut(prog(u, 0.1 + i * 0.12, 1.3 + i * 0.12));
    s += `<g transform="translate(${f(x + sp * u0 * 0.4)} ${f(GROUND + 2 + 120 * (1 - k))}) scale(${scl})" opacity="${f(k)}">${LM[n](u, 0.8)}</g>`;
  });
  s += `<g>${skylineLayer(CITY.near.filter((b, i) => i % 3 === 0), 2026, P.near, 1, -u0 * 14, 0.55, 1)}</g>`;
  s += ground('dusk', u);
  s += '</g>';
  const k2 = easeOut(prog(u, 0.9, 2.0)), k3 = easeOut(prog(u, 1.4, 2.6));
  s += `<g filter="url(#tshadow)">`;
  [...'АСТАНА'].forEach((ch, i) => {
    const kk = easeOut(prog(u, 0.15 + i * 0.08, 0.95 + i * 0.08));
    s += `<text x="${f(540 + (i - 2.5) * 142)}" y="${f(420 + 60 * (1 - kk))}" font-size="200" font-weight="800" fill="#FFFFFF" opacity="${f(kk)}" text-anchor="middle">${ch}</text>`;
  });
  s += `<rect x="${f(540 - 380 * k2)}" y="470" width="${f(760 * k2)}" height="8" rx="4" fill="#FFD24A"/>`;
  s += `<text x="540" y="590" font-size="110" font-weight="800" fill="#FFD24A" text-anchor="middle" opacity="${f(k2)}" letter-spacing="4">1997–2026</text>`;
  s += `<text x="540" y="680" font-size="54" font-weight="700" fill="#FFFFFF" text-anchor="middle" opacity="${f(k3)}" letter-spacing="4">ЕЛОРДАНЫҢ ӨЗГЕРУ ЖОЛЫ</text>`;
  s += `</g>`;
  return s;
};

// Kazakhstan outline (lon, lat), simplified
const KZ = [[46.5,48.4],[47.6,50.4],[48.7,50.6],[50.8,51.6],[52.3,51.8],[55.7,50.6],[58.3,51.1],[59.9,50.8],[61.4,50.8],[61.0,52.0],[60.0,52.4],[61.0,53.0],[62.0,53.9],[65.2,54.6],[68.2,55.0],[69.2,55.4],[70.8,55.3],[73.4,53.5],[76.3,54.1],[77.8,53.3],[80.0,50.8],[83.4,51.0],[85.1,50.1],[87.3,49.1],[85.7,47.1],[83.0,47.2],[82.4,45.5],[80.1,45.0],[80.0,42.6],[77.6,42.9],[75.6,42.8],[74.2,43.3],[71.8,42.9],[70.9,42.3],[69.1,41.4],[68.6,40.7],[66.0,42.0],[66.0,43.0],[64.9,43.7],[62.0,43.5],[58.6,45.6],[56.0,45.0],[56.0,41.3],[55.0,41.3],[52.8,41.5],[52.4,42.3],[52.7,42.6],[51.3,43.2],[50.8,44.6],[51.3,45.4],[53.0,45.3],[53.2,46.2],[51.2,47.0],[49.2,46.4],[48.6,46.6],[48.9,47.6],[47.0,48.0]];
const proj = ([lon, lat]) => [70 + (lon - 46.5) * 23.1, 1030 - (lat - 40.5) * 34.5];

SCENES.y1997 = (u, sc) => {
  const d = sc.end - sc.start, sp = sc.sentences[0];
  let s = `<rect width="${W}" height="${HGT}" fill="#0A1838"/>`;
  // subtle grid
  for (let x = 0; x < W; x += 60) s += `<line x1="${x}" y1="0" x2="${x}" y2="${HGT}" stroke="#16295A" stroke-width="1"/>`;
  for (let y = 0; y < HGT; y += 60) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#16295A" stroke-width="1"/>`;
  const zoom = 1 + 0.9 * easeInOut(prog(u, d - 2.4, d));
  const ak = proj([71.43, 51.13]), al = proj([76.9, 43.25]);
  s += `<g transform="translate(${f(lerp(540, 540 - (ak[0] - 540) * 0, 1))} 0) translate(${f(ak[0] - 540)} ${f(ak[1])}) scale(${f(zoom)}) translate(${f(-ak[0])} ${f(-ak[1])})">`;
  const mk = easeOut(prog(u, 0, 1.4));
  const pts = KZ.map(proj).map((p) => p.map(f).join(' ')).join(' L');
  s += `<path d="M${pts} Z" fill="#14407A" stroke="#5FC8FF" stroke-width="4" opacity="${f(mk)}" style="stroke-dasharray:4000;stroke-dashoffset:${f(4000 * (1 - mk))}"/>`;
  s += `<path d="M${pts} Z" fill="url(#mapHatch)" opacity="${f(0.5 * mk)}"/>`;
  // Ishim river hint near Akmola
  s += `<path d="M${f(ak[0] - 90)} ${f(ak[1] - 30)} C ${f(ak[0] - 30)} ${f(ak[1] + 10)} ${f(ak[0] + 20)} ${f(ak[1] - 20)} ${f(ak[0] + 110)} ${f(ak[1] + 30)}" stroke="#5FC8FF" stroke-width="3" fill="none" opacity="${f(0.6 * mk)}"/>`;
  // Almaty
  const ka = easeOut(prog(u, 0.8, 1.6));
  s += `<circle cx="${f(al[0])}" cy="${f(al[1])}" r="${f(12 * ka)}" fill="#FFFFFF"/><text x="${f(al[0] - 30)}" y="${f(al[1] - 26)}" font-size="40" font-weight="700" fill="#FFFFFF" opacity="${f(ka)}" text-anchor="middle">Алматы</text>`;
  // arc Almaty → Akmola
  const kArc = easeInOut(prog(u, sp.start - sc.start + 1.5, sp.start - sc.start + 4.2));
  const c = [(al[0] + ak[0]) / 2 + 210, (al[1] + ak[1]) / 2 + 10];
  s += `<path d="M${f(al[0])} ${f(al[1])} Q ${f(c[0])} ${f(c[1])} ${f(ak[0])} ${f(ak[1])}" stroke="#FFD24A" stroke-width="6" fill="none" stroke-dasharray="1000" stroke-dashoffset="${f(1000 * (1 - kArc))}" stroke-linecap="round" pathLength="1000"/>`;
  if (kArc > 0 && kArc < 1) {
    const m = 1 - kArc, px = m * m * al[0] + 2 * m * kArc * c[0] + kArc * kArc * ak[0], py = m * m * al[1] + 2 * m * kArc * c[1] + kArc * kArc * ak[1];
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="14" fill="#FFD24A" filter="url(#glow)"/>`;
  }
  // Akmola star
  const kk = back(prog(u, sp.start - sc.start + 4.0, sp.start - sc.start + 4.8));
  if (kk > 0) {
    const pulse = 1 + 0.25 * Math.sin(u * 5);
    s += `<circle cx="${f(ak[0])}" cy="${f(ak[1])}" r="${f(40 * kk * pulse)}" fill="#FFD24A" opacity=".25"/>`;
    s += `<path transform="translate(${f(ak[0])} ${f(ak[1])}) scale(${f(kk)})" d="M0 -26 L7 -8 L26 -8 L11 4 L17 23 L0 12 L-17 23 L-11 4 L-26 -8 L-7 -8 Z" fill="#FFD24A"/>`;
    s += `<text x="${f(ak[0])}" y="${f(ak[1] - 46)}" font-size="${f(46)}" font-weight="800" fill="#FFD24A" text-anchor="middle" opacity="${f(clamp(kk))}">Ақмола</text>`;
  }
  s += '</g>';
  s += header(u, sc, 1997, 'Жаңа елорда — Ақмола', [{ text: '10 желтоқсан 1997' }, { text: 'Алматы → Ақмола', at: 2.4 }]);
  return s;
};

SCENES.y1998 = (u, sc) => {
  const d = sc.end - sc.start, s1 = 2.2;
  const P = SKY.morning;
  let s = sky('morning', u, [850, 700]);
  s += clouds(u, 'morning', 8);
  s += `<g>${skylineLayer(CITY.far, 1998, P.far, 0, -u * 4 + 20, 0.8, 1)}</g>`;
  // Akmola: Soviet-era panel blocks
  const r = rnd(5);
  let blocks = '';
  for (let i = 0; i < 9; i++) {
    const x = -60 + i * 135 - u * 10, w = 110 + r() * 30, fl = 5 + Math.floor(r() * 5);
    blocks += LM.panelBlock(x, w, fl * 26, fl, ['#D7CCBC', '#C9C3B8', '#DCD3C2'][i % 3], '#6B7C8E', 0, i + 3);
  }
  s += `<g transform="translate(0 ${GROUND})">${blocks}</g>`;
  s += ground('morning', u);
  // name change sign
  const k = prog(u, 1.2, 3.2);
  s += `<rect x="90" y="${640}" width="900" height="200" rx="30" fill="rgba(8,20,48,.6)" opacity="${f(easeOut(prog(u, 0.4, 1)))}"/>`;
  s += nameFlip(540, 785, 'АҚМОЛА', 'АСТАНА', k, 140, easeOut(prog(u, 0.4, 1)));
  // meaning card
  const km = prog(u, s1 + 0.3, s1 + 0.9);
  if (km > 0) {
    s += `<g opacity="${f(clamp(km * 1.5))}" transform="translate(540 ${f(960 + 30 * (1 - easeOut(km)))})">`
      + `<rect x="-340" y="-62" width="680" height="124" rx="24" fill="#FFFFFF" opacity=".92"/>`
      + `<text x="0" y="-8" font-size="36" font-weight="600" fill="#2A3A5A" text-anchor="middle">«Астана» сөзі —</text>`
      + `<text x="0" y="44" font-size="48" font-weight="800" fill="#0B5FA5" text-anchor="middle">«бас қала»</text></g>`;
  }
  s += header(u, sc, 1998, 'Ақмола → Астана', [{ text: '6 мамыр 1998' }]);
  return s;
};

SCENES.baiterek = (u, sc) => landmarkScene(u, sc, { sky: 'golden', sun: [880, 820], cityYear: 2002, draw: () => LM.baiterek(u), h: LM.baiterek.h, scale: 0.98, revealAt: 0.2,
  extraFront: (uu) => dimLine(860, GROUND - 0.98 * 870, GROUND - 2, '97 м', prog(uu, revEnd + 0.1, revEnd + 0.9)) })
  + header(u, sc, 2002, 'Бәйтерек', [{ text: '97 метр' }, { text: 'алтын шар', at: 1.4 }]);

SCENES.akorda = (u, sc) => landmarkScene(u, sc, { sky: 'day', sun: [180, 640], cityYear: 2004, draw: () => LM.akorda(), h: LM.akorda.h, scale: 1.05, revealAt: 0.2, gap: 470,
  extraFront: (uu, p) => {
    // Kazakh flag on the roof
    if (p < .9) return '';
    const wv = Math.sin(uu * 4) * 6;
    return `<g transform="translate(${540 - 250 * 1.05} ${GROUND - 352 * 1.05})"><rect x="-2" y="-110" width="4" height="110" fill="#DDD"/><path d="M2 -110 q 50 ${f(wv)} 100 0 v60 q -50 ${f(-wv)} -100 0 Z" fill="#00AFCA"/><circle cx="52" cy="-80" r="12" fill="#FEC50C"/></g>`;
  } })
  + header(u, sc, 2004, 'Ақорда', [{ text: 'Президент резиденциясы' }, { text: 'көгілдір күмбез', at: 1.4 }]);

SCENES.palace = (u, sc) => landmarkScene(u, sc, { sky: 'day', sun: [860, 620], cityYear: 2006, draw: () => LM.palace(), h: LM.palace.h, scale: 1.12, revealAt: 0.2, seed: 9, gap: 520,
  extraFront: (uu) => {
    const t2 = sc.sentences[1].start - sc.start;
    let s = dimLine(940, GROUND - 1.12 * 720, GROUND - 1.12 * 70, '62 м', prog(uu, revEnd + 0.1, revEnd + 0.9));
    // doves circling the apex during the 2nd sentence
    const kd = prog(uu, t2 - 0.4, t2 + 0.6);
    for (let i = 0; i < 5; i++) {
      const a = uu * 0.9 + i * 1.25, x = 540 + Math.cos(a) * (160 + i * 18), y = GROUND - 860 + Math.sin(a) * 50 - i * 10;
      s += `<path transform="translate(${f(x)} ${f(y)})" d="M-14 0 q 7 -${f(8 + 5 * Math.sin(uu * 9 + i))} 14 0 q 7 -${f(8 + 5 * Math.sin(uu * 9 + i))} 14 0" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="${f(kd)}"/>`;
    }
    return s;
  } })
  + header(u, sc, 2006, 'Бейбітшілік және келісім сарайы', [{ text: '62 метр' }, { text: 'сәулетші Норман Фостер', at: 1.2 }]);

SCENES.khanshatyr = (u, sc) => landmarkScene(u, sc, { sky: 'dusk', sun: [200, 900], cityYear: 2010, draw: () => LM.khanshatyr(u, prog(u, 4, 6)), h: LM.khanshatyr.h, scale: 0.95, revealAt: 0.2, seed: 4,
  extraFront: (uu) => {
    const t2 = sc.sentences[1].start - sc.start;
    let s = dimLine(980, GROUND - 0.95 * 905, GROUND - 2, '150 м', prog(uu, revEnd + 0.1, revEnd + 0.9));
    const icons = [['🌳', 'саябақ'], ['🛍', 'дүкендер'], ['🏖', 'жағажай']];
    icons.forEach(([ic, label], i) => {
      const kk = back(prog(uu, t2 + 0.3 + i * 0.5, t2 + 0.8 + i * 0.5));
      if (kk <= 0) return;
      const x = 290 + i * 250, y = GROUND - 250;
      s += `<g transform="translate(${x} ${y}) scale(${f(kk)})"><circle r="70" fill="rgba(8,20,48,.78)" stroke="#FFD24A" stroke-width="3"/><text y="18" font-size="56" text-anchor="middle">${ic}</text><text y="112" font-size="34" font-weight="700" fill="#FFFFFF" text-anchor="middle" filter="url(#tshadow)">${label}</text></g>`;
    });
    return s;
  } })
  + header(u, sc, 2010, 'Хан Шатыр', [{ text: '150 метр' }, { text: 'сәулетші Норман Фостер', at: 1.2 }]);

SCENES.hazrat = (u, sc) => landmarkScene(u, sc, { sky: 'golden', sun: [180, 760], cityYear: 2012, draw: () => LM.hazrat(), h: LM.hazrat.h, scale: 1.08, revealAt: 0.2, seed: 12, gap: 520,
  extraFront: (uu) => dimLine(1000, GROUND - 1.08 * 720, GROUND - 2, '77 м', prog(uu, revEnd + 0.1, revEnd + 0.9)) })
  + header(u, sc, 2012, 'Әзірет Сұлтан мешіті', [{ text: '4 мұнара' }, { text: '77 метр', at: 1.2 }]);

SCENES.expo = (u, sc) => landmarkScene(u, sc, { sky: 'day', sun: [900, 560], cityYear: 2017, draw: () => LM.nuralem(u), h: LM.nuralem.h, scale: 1.0, revealAt: 0.2, seed: 21, gap: 600,
  extraFront: (uu) => {
    const t2 = sc.sentences[1].start - sc.start;
    const kk = prog(uu, t2 + 0.6, t2 + 1.6);
    if (kk <= 0) return '';
    // diameter marker across the sphere
    const cy = GROUND - 420, w = 330 * easeOut(kk);
    return `<g opacity="${f(clamp(kk * 2))}"><line x1="${f(540 - w)}" y1="${cy}" x2="${f(540 + w)}" y2="${cy}" stroke="#FFD24A" stroke-width="4" stroke-dasharray="14 10"/>`
      + `<circle cx="${f(540 - w)}" cy="${cy}" r="8" fill="#FFD24A"/><circle cx="${f(540 + w)}" cy="${cy}" r="8" fill="#FFD24A"/>`
      + `<rect x="430" y="${cy - 100}" width="220" height="70" rx="16" fill="rgba(8,20,48,.8)"/><text x="540" y="${cy - 52}" font-size="44" font-weight="800" fill="#FFD24A" text-anchor="middle">Ø 80 м</text></g>`;
  } })
  + header(u, sc, 2017, 'EXPO-2017 · Нұр Әлем', [{ text: '«Болашақ энергиясы»' }, { text: 'шар Ø 80 м', at: sc.sentences[1].start - sc.start + 0.4 }]);

// 2019: rename to Nur-Sultan, then Abu Dhabi Plaza rises
SCENES.y2019 = (u, sc) => {
  const t2 = sc.sentences[1].start - sc.start;
  const signA = 1 - prog(u, t2 - 0.6, t2 + 0.2);
  let s = landmarkScene(u, sc, { sky: 'dusk', sun: [860, 980], cityYear: 2019, draw: () => LM.abudhabi(u, prog(u, t2 + 2, t2 + 4)), h: LM.abudhabi.h, scale: 0.86, revealAt: t2 - 0.3, revealDur: 2.3, seed: 30, gap: 420,
    extraFront: (uu) => dimLine(890, GROUND - 0.86 * 1010, GROUND - 2, '311 м', prog(uu, t2 + 1.8, t2 + 2.6)) });
  s += `<rect x="40" y="${700}" width="1000" height="200" rx="30" fill="rgba(8,20,48,.62)" opacity="${f(signA * easeOut(prog(u, 0.3, 0.9)))}"/>`;
  s += nameFlip(540, 845, 'АСТАНА', 'НҰР-СҰЛТАН', prog(u, 1.0, 3.0), 118, signA * easeOut(prog(u, 0.3, 0.9)));
  const tA = 1 - prog(u, t2 - 0.4, t2), tB = prog(u, t2, t2 + 0.6);
  s += header(u, sc, 2019, null, []);
  s += `<text x="72" y="390" font-size="62" font-weight="700" fill="#FFFFFF" opacity="${f(tA * easeOut(prog(u, .35, 1)))}" filter="url(#tshadow)">Астана → Нұр-Сұлтан</text>`;
  s += `<text x="72" y="390" font-size="62" font-weight="700" fill="#FFFFFF" opacity="${f(tB)}" filter="url(#tshadow)">Абу-Даби Плаза</text>`;
  s += chip(72, 458, 'наурыз 2019', prog(u, 0.9, 1.4) * tA);
  s += chip(72, 458, 'желтоқсан 2019', prog(u, t2 + 0.3, t2 + 0.8));
  s += chip(400, 458, 'Орталық Азиядағы ең биік', prog(u, t2 + 2.2, t2 + 2.7));
  return s;
};

// 2022: back to Astana + Grand Mosque
SCENES.y2022 = (u, sc) => {
  const t2 = sc.sentences[1].start - sc.start;
  const signA = 1 - prog(u, t2 - 0.7, t2);
  let s = landmarkScene(u, sc, { sky: 'morning', sun: [880, 640], cityYear: 2022, draw: () => LM.grandmosque(), h: LM.grandmosque.h, scale: 0.96, revealAt: t2 - 0.3, revealDur: 2.6, seed: 40, gap: 560,
    extraFront: (uu) => dimLine(1010, GROUND - 0.96 * 880, GROUND - 2, '130 м', prog(uu, t2 + 1.8, t2 + 2.6)) });
  s += `<rect x="40" y="${700}" width="1000" height="200" rx="30" fill="rgba(8,20,48,.62)" opacity="${f(signA * easeOut(prog(u, 0.3, 0.9)))}"/>`;
  s += nameFlip(540, 845, 'НҰР-СҰЛТАН', 'АСТАНА', prog(u, 1.0, 3.0), 118, signA * easeOut(prog(u, 0.3, 0.9)));
  const tA = 1 - prog(u, t2 - 0.4, t2), tB = prog(u, t2, t2 + 0.6);
  s += header(u, sc, 2022, null, []);
  s += `<text x="72" y="390" font-size="62" font-weight="700" fill="#FFFFFF" opacity="${f(tA * easeOut(prog(u, .35, 1)))}" filter="url(#tshadow)">Нұр-Сұлтан → Астана</text>`;
  s += `<text x="72" y="390" font-size="56" font-weight="700" fill="#FFFFFF" opacity="${f(tB)}" filter="url(#tshadow)">Астана Бас мешіті</text>`;
  s += chip(72, 458, 'қыркүйек 2022', prog(u, 0.9, 1.4) * tA);
  s += chip(72, 458, 'Орталық Азиядағы ең ірі', prog(u, t2 + 0.6, t2 + 1.1));
  return s;
};

SCENES.population = (u, sc) => {
  const d = sc.end - sc.start, S = sc.sentences.map((x) => x.start - sc.start);
  const P = SKY.night;
  const steps = [[S[0], 0, 326000], [S[1], 326000, 1262000], [S[2], 1262000, 1700385]];
  let val = 0, yearLabel = '1998';
  for (const [t0, a, b] of steps) if (u >= t0 - 0.2) { val = lerp(a, b, easeOut(prog(u, t0 + 0.2, t0 + 2.2))); }
  if (u >= S[1] - 0.2) yearLabel = '2022';
  if (u >= S[2] - 0.2) yearLabel = '1 қыркүйек 2026';
  // city grows with the counter
  const cityYear = lerp(1997, 2026, clamp(val / 1700385));
  let s = sky('night', u, [880, 640]);
  s += `<g>${skylineLayer(CITY.far, cityYear, P.far, .9, 20 - u * 3, 1.25, 1)}</g>`;
  s += `<g>${skylineLayer(CITY.near, cityYear, P.near, 1, -u * 6, 1.3, 1)}</g>`;
  // landmarks silhouettes join as the counter grows
  const sil = (fn, x, sc2, yr) => cityYear >= yr ? `<g transform="translate(${x} ${GROUND}) scale(${sc2})" opacity="${f(clamp((cityYear - yr) / 2))}" style="filter:brightness(.55)">${fn()}</g>` : '';
  s += sil(() => LM.baiterek(u), 160, 0.38, 2002) + sil(() => LM.khanshatyr(u, 1), 380, 0.34, 2010) + sil(() => LM.abudhabi(u, 1), 640, 0.4, 2019) + sil(() => LM.nuralem(u), 880, 0.32, 2017);
  s += ground('night', u);
  // counter
  const kc = easeOut(prog(u, 0, 0.8));
  s += `<g opacity="${f(kc)}" filter="url(#tshadow)">`;
  s += `<text x="540" y="470" font-size="46" font-weight="700" fill="#FFD24A" text-anchor="middle" letter-spacing="2">${esc(yearLabel)}</text>`;
  const big = fmtNum(val);
  s += `<text x="540" y="630" font-size="${big.length > 9 ? 150 : 160}" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-3">${big}</text>`;
  s += `<text x="540" y="695" font-size="44" font-weight="600" fill="#FFFFFF" opacity=".85" text-anchor="middle">тұрғын</text></g>`;
  // bar chart
  const bars = [['1998', 326000, S[0]], ['2022', 1262000, S[1]], ['2026', 1700385, S[2]]];
  bars.forEach(([lab, v, t0], i) => {
    const k = easeOut(prog(u, t0 + 0.2, t0 + 2.2));
    if (k <= 0) return;
    const x = 300 + i * 200, hh = 240 * v / 1700385 * k;
    s += `<rect x="${x - 55}" y="${f(1040 - hh)}" width="110" height="${f(hh)}" rx="10" fill="${i === 2 ? '#FFD24A' : '#5FC8FF'}" opacity=".92"/>`;
    s += `<text x="${x}" y="1074" font-size="34" font-weight="700" fill="#FFFFFF" text-anchor="middle" filter="url(#tshadow)">${lab}</text>`;
    s += `<text x="${x}" y="${f(1025 - hh)}" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle" opacity="${f(k)}">${v >= 1e6 ? (v / 1e6).toFixed(2).replace('.', ',') + ' млн' : Math.round(v / 1000) + ' мың'}</text>`;
  });
  // ×5 badge
  const kx = back(prog(u, S[3] + 0.1, S[3] + 0.7));
  if (kx > 0) s += `<g transform="translate(830 840) scale(${f(kx)}) rotate(-8)"><circle r="96" fill="#FFD24A"/><text y="10" font-size="62" font-weight="800" fill="#0B1A3A" text-anchor="middle">×5,2</text><text y="52" font-size="24" font-weight="700" fill="#0B1A3A" text-anchor="middle">өсім</text></g>`;
  s += header(u, sc, null, null);
  s += `<text x="72" y="300" font-size="92" font-weight="800" fill="#FFFFFF" opacity="${f(easeOut(prog(u, 0.05, 0.7)))}" filter="url(#tshadow)">ХАЛЫҚ САНЫ</text>`;
  s += `<rect x="72" y="330" width="${f(260 * easeOut(prog(u, 0.3, 1)))}" height="8" rx="4" fill="#FFD24A"/>`;
  return s;
};

// LRT route: schematic polyline from Airport to Nurly Zhol, 18 stations
const LRT_ROUTE = [[120, 745], [200, 698], [260, 662], [300, 626], [330, 592], [380, 570], [450, 560], [520, 556], [575, 576], [600, 606], [630, 640], [650, 668], [660, 694]];
function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
function polyAt(pts, k) {
  let L = polyLen(pts) * k;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (L <= seg) return [lerp(pts[i - 1][0], pts[i][0], L / seg), lerp(pts[i - 1][1], pts[i][1], L / seg)];
    L -= seg;
  }
  return pts[pts.length - 1];
}

SCENES.lrt = (u, sc) => {
  const d = sc.end - sc.start, S = sc.sentences.map((x) => x.start - sc.start);
  const P = SKY.morning;
  let s = sky('morning', u, [880, 560]);
  s += clouds(u, 'morning', 50, 4);
  s += `<g>${skylineLayer(CITY.far, 2026, P.far, 0, 20 - u * 5, 1, 1)}</g>`;
  // landmark silhouettes on the horizon
  s += `<g opacity=".55" style="filter:saturate(.5) brightness(1.1)"><g transform="translate(${f(170 - u * 7)} ${GROUND}) scale(.33)">${LM.baiterek()}</g><g transform="translate(${f(420 - u * 7)} ${GROUND}) scale(.3)">${LM.khanshatyr(u)}</g><g transform="translate(${f(700 - u * 7)} ${GROUND}) scale(.32)">${LM.abudhabi()}</g><g transform="translate(${f(960 - u * 7)} ${GROUND}) scale(.3)">${LM.grandmosque()}</g></g>`;
  s += `<g>${skylineLayer(CITY.near.filter((b, i) => i % 2), 2026, P.near, 0, -u * 12, 0.7, 1)}</g>`;
  s += ground('morning', u, { trees: false });
  // elevated guideway (viaduct)
  const deckY = GROUND - 110, build = easeInOut(prog(u, 0.2, 2.2));
  let via = '';
  const off = -(u * 40) % 220;
  for (let x = off - 220; x < W + 220; x += 220) {
    const kp = clamp((build * (W + 400) - (x + 200)) / 200);
    if (kp <= 0) continue;
    via += `<path d="M${f(x - 22)} ${GROUND + 6} L${f(x - 16)} ${deckY + 30} L${f(x - 60)} ${deckY + 10} L${f(x + 60)} ${deckY + 10} L${f(x + 16)} ${deckY + 30} L${f(x + 22)} ${GROUND + 6} Z" fill="url(#gConcrete)" opacity="${f(kp)}"/>`;
  }
  const dw = W * build + 200;
  via += `<rect x="-100" y="${deckY - 6}" width="${f(dw)}" height="30" fill="#E8ECF1"/><rect x="-100" y="${deckY + 24}" width="${f(dw)}" height="10" fill="#9EA8B6"/>`;
  via += `<rect x="-100" y="${deckY - 14}" width="${f(dw)}" height="8" fill="#C5CCD6"/>`;
  // station canopy
  const stX = 780 - u * 40 % 2000;
  via += `<g transform="translate(${f(760)} ${deckY - 6}) scale(.8)" opacity="${f(build)}"><rect x="-170" y="-150" width="340" height="14" rx="6" fill="#FFFFFF"/><path d="M-180 -150 Q 0 -200 180 -150" fill="#00A7C8" opacity=".9"/><rect x="-150" y="-140" width="8" height="134" fill="#B9C2CE"/><rect x="142" y="-140" width="8" height="134" fill="#B9C2CE"/><rect x="-170" y="-6" width="340" height="14" fill="#D4DAE2"/></g>`;
  s += via;
  // driverless train glides in and stops at the station, then departs
  const stopX = 930 - 776;
  let tx = lerp(-800, stopX, easeOut(prog(u, 1.2, S[2])));
  if (u > S[3]) tx = lerp(stopX, 1150, easeInOut(prog(u, S[3], d + 0.3)));
  s += `<g transform="translate(${f(tx)} ${deckY - 14})">${LM.train(3, 250)}</g>`;
  // route map card (top)
  const km = easeOut(prog(u, 0.6, 1.4));
  s += `<g opacity="${f(km)}" transform="translate(0 ${f(30 * (1 - km))})">`;
  s += `<rect x="40" y="500" width="640" height="300" rx="28" fill="rgba(6,16,40,.82)"/>`;
  s += `<text x="70" y="548" font-size="28" font-weight="700" fill="#9FDCF5" letter-spacing="2">ЖЕЛІ СЫЗБАСЫ</text>`;
  // Ishim river on the schematic
  s += `<path d="M60 680 C 200 630 300 615 420 655 S 600 745 670 720" stroke="#3E86C8" stroke-width="14" fill="none" opacity=".55" stroke-linecap="round"/>`;
  const lineK = easeInOut(prog(u, S[1] - 0.2, S[1] + 2.4));
  const pts = LRT_ROUTE.map(([x, y]) => [x, y]);
  const Lp = polyLen(pts);
  s += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#00C2E0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f(Lp)}" stroke-dashoffset="${f(Lp * (1 - lineK))}"/>`;
  for (let i = 0; i < 18; i++) {
    const k = i / 17;
    if (k > lineK + 1e-6) continue;
    const [x, y] = polyAt(pts, k), end = i === 0 || i === 17;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${end ? 13 : 8}" fill="${end ? '#FFD24A' : '#FFFFFF'}" stroke="#00C2E0" stroke-width="4"/>`;
  }
  const kEnds = prog(u, S[3] - 0.2, S[3] + 0.5);
  s += `<text x="150" y="784" font-size="28" font-weight="700" fill="#FFD24A" opacity="${f(Math.max(kEnds, 0.0))}">✈ Әуежай</text>`;
  s += `<text x="600" y="738" font-size="28" font-weight="700" fill="#FFD24A" text-anchor="middle" opacity="${f(kEnds)}">Нұрлы жол 🚉</text>`;
  if (kEnds > 0 && kEnds < 1.01) {
    const pk = (u - S[3]) * 0.45 % 1;
    const [x, y] = polyAt(pts, clamp(pk));
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="#FFD24A" filter="url(#glow)" opacity="${f(kEnds)}"/>`;
  }
  s += '</g>';
  // stat cards (right column), each synced to the narration
  const cards = [['≈ 22,4 км', 'желі ұзындығы', S[1] + 0.2], ['18', 'бекет', S[1] + 1.8], ['Жүргізушісіз', 'автоматты пойыздар', S[2]], ['Әуежай ⇄', 'Нұрлы жол', S[3] + 0.2]];
  cards.forEach(([big, small, t0], i) => {
    const k = back(prog(u, t0, t0 + 0.5));
    if (k <= 0) return;
    const y = 500 + i * 76;
    s += `<g transform="translate(${f(700 + 360 * (1 - clamp(k)))} ${y})" opacity="${f(clamp(k * 1.5))}"><rect width="340" height="68" rx="18" fill="#FFFFFF" opacity=".94"/><rect width="10" height="68" rx="5" fill="#00A7C8"/>`
      + `<text x="28" y="34" font-size="${big.length > 10 ? 28 : 32}" font-weight="800" fill="#0B1A3A">${esc(big)}</text><text x="28" y="58" font-size="20" font-weight="600" fill="#45607F">${esc(small)}</text></g>`;
  });
  s += header(u, sc, 2026, 'Tarlan Astana LRT', [{ text: 'мамыр 2026' }, { text: 'алғашқы желі', at: 1.6 }]);
  return s;
};

const RECAP = [
  [1997, 'Ақмола — астана'], [1998, 'Қала Астана атанды'], [2002, 'Бәйтерек'], [2004, 'Ақорда'],
  [2006, 'Бейбітшілік және келісім сарайы'], [2010, 'Хан Шатыр'], [2012, 'Әзірет Сұлтан мешіті'], [2017, 'EXPO-2017 және Нұр Әлем'],
  [2019, 'Нұр-Сұлтан; Абу-Даби Плаза'], [2022, 'Қайтадан Астана; Бас мешіт'], [2026, 'Tarlan Astana LRT іске қосылды'],
];

SCENES.outro = (u, sc) => {
  const d = sc.end - sc.start, endT = sc.speechEnd - sc.start;
  let s = sky('golden', u, [540, 1000]);
  s += clouds(u, 'golden', 60, 4);
  s += `<g>${skylineLayer(CITY.far, 2026, SKY.golden.far, .2, -u * 4, 1, 1)}</g>`;
  // full panorama of all landmarks rising one after another
  const row = [['palace', 70, .30], ['akorda', 215, .27], ['baiterek', 345, .42], ['abudhabi', 470, .46], ['khanshatyr', 610, .36], ['hazrat', 760, .3], ['grandmosque', 905, .3], ['nuralem', 1035, .3]];
  row.forEach(([n, x, scl], i) => {
    const p = prog(u, 0.2 + i * 0.35, 1.6 + i * 0.35);
    s += reveal(LM[n](u, 0.6), x, GROUND + 2, scl, LM[n].h, p, { blueprint: true });
  });
  s += ground('golden', u);
  // vertical timeline recap
  const fade = 1 - prog(u, endT + 0.2, endT + 0.9);
  s += `<g opacity="${f(fade)}"><rect x="40" y="150" width="1000" height="${RECAP.length * 62 + 60}" rx="30" fill="rgba(6,14,34,.7)"/>`;
  s += `<line x1="170" y1="200" x2="170" y2="${f(200 + (RECAP.length - 1) * 62 * easeOut(prog(u, 0.2, 5)))}" stroke="#FFD24A" stroke-width="4"/>`;
  RECAP.forEach(([y, label], i) => {
    const k = easeOut(prog(u, 0.2 + i * 0.42, 0.7 + i * 0.42));
    const yy = 200 + i * 62;
    s += `<g opacity="${f(k)}" transform="translate(${f(30 * (1 - k))} 0)"><text x="70" y="${yy + 12}" font-size="34" font-weight="800" fill="#FFD24A">${y}</text><circle cx="170" cy="${yy}" r="10" fill="#FFD24A"/><text x="200" y="${yy + 12}" font-size="34" font-weight="600" fill="#FFFFFF">${esc(label)}</text></g>`;
  });
  s += '</g>';
  // end card
  const ke = easeOut(prog(u, endT + 0.4, endT + 1.6));
  if (ke > 0) {
    s += `<rect width="${W}" height="${HGT}" fill="#06102A" opacity="${f(0.55 * ke)}"/>`;
    s += `<g opacity="${f(ke)}" transform="translate(0 ${f(40 * (1 - ke))})" filter="url(#tshadow)">`;
    s += `<text x="540" y="620" font-size="170" font-weight="800" fill="#FFFFFF" text-anchor="middle">АСТАНА</text>`;
    s += `<text x="540" y="740" font-size="100" font-weight="800" fill="#FFD24A" text-anchor="middle" letter-spacing="4">1997–2026</text>`;
    s += `<rect x="${f(540 - 300 * ke)}" y="780" width="${f(600 * ke)}" height="6" rx="3" fill="#FFD24A"/>`;
    s += `<text x="540" y="860" font-size="54" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">ЕЛОРДАНЫҢ ӨЗГЕРУ ЖОЛЫ</text></g>`;
  }
  return s;
};

// ---------------------------------------------------------------- frame composition
const DEFS = `<defs>${LM.defs}
<filter id="blur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="tshadow" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity=".45"/></filter>
<pattern id="mapHatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="16" stroke="#2F6DB0" stroke-width="3"/></pattern>
<linearGradient id="topScrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030A1E" stop-opacity=".55"/><stop offset=".7" stop-color="#030A1E" stop-opacity=".18"/><stop offset="1" stop-color="#030A1E" stop-opacity="0"/></linearGradient>
<radialGradient id="vign" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
</defs>`;

function sceneAt(t) { return TL.scenes.findIndex((s) => t >= s.start && t < s.end); }

function drawScene(i, t) {
  const sc = TL.scenes[i];
  return SCENES[sc.id](t - sc.start, sc);
}

function timelinePos(t) {
  const idx = (sc) => (sc.year ? YEARS.indexOf(sc.year) : null);
  const i = Math.max(0, sceneAt(t));
  const sc = TL.scenes[i];
  if (sc.id === 'population') {
    const S = sc.sentences.map((x) => x.start);
    return 1 + 8 * easeInOut(prog(t, S[1] + 0.2, S[1] + 2.2)) + easeInOut(prog(t, S[2] + 0.2, S[2] + 2.2));
  }
  const cur = idx(sc);
  if (cur === null) return 0;
  // slide from previous year marker during the first second
  const prev = i > 0 && TL.scenes[i - 1].year ? YEARS.indexOf(TL.scenes[i - 1].year) : cur;
  return lerp(prev, cur, easeInOut(prog(t, sc.start, sc.start + 1.0)));
}

function render(t) {
  clipN = 0;
  t = clamp(t, 0, TL.total - 1e-6);
  const i = Math.max(0, sceneAt(t));
  const TR = 0.7; // transition length (s), centred on the cut
  let body = '';
  const sc = TL.scenes[i];
  const next = TL.scenes[i + 1], prev = TL.scenes[i - 1];
  let k = null, a = null, b = null;
  if (next && t > sc.end - TR / 2) { a = i; b = i + 1; k = (t - (sc.end - TR / 2)) / TR; }
  else if (prev && t < sc.start + TR / 2) { a = i - 1; b = i; k = (t - (sc.start - TR / 2)) / TR; }
  if (k === null) body = drawScene(i, t);
  else {
    // push transition with a diagonal golden wipe
    const e = easeInOut(clamp(k));
    const outer = `<g transform="translate(${f(-220 * e)} 0)">${drawScene(a, t)}</g>`;
    const xEdge = lerp(W + 500, -500, e);
    const id = 'wipe' + (clipN++);
    body = outer + `<clipPath id="${id}"><path d="M${f(xEdge)} 0 L${W + 900} 0 L${W + 900} ${HGT} L${f(xEdge - 420)} ${HGT} Z"/></clipPath>`
      + `<g clip-path="url(#${id})"><g transform="translate(${f(160 * (1 - e))} 0)">${drawScene(b, t)}</g></g>`
      + `<path d="M${f(xEdge)} 0 L${f(xEdge + 26)} 0 L${f(xEdge - 394)} ${HGT} L${f(xEdge - 420)} ${HGT} Z" fill="#FFD24A" opacity=".95"/>`;
  }
  // persistent UI
  const tlAlpha = (() => {
    const showIdx = (j) => !['title', 'outro'].includes(TL.scenes[j].id);
    const cur = showIdx(i) ? 1 : 0;
    if (k !== null) { const ea = showIdx(a) ? 1 : 0, eb = showIdx(b) ? 1 : 0; return lerp(ea, eb, clamp(k)); }
    return cur;
  })();
  let ui = `<rect width="${W}" height="${HGT}" fill="url(#vign)"/><rect width="${W}" height="600" fill="url(#topScrim)"/>`;
  ui += timelineBar(timelinePos(t), tlAlpha);
  ui += subtitles(t);
  // global fade in / out
  const fade = clamp((TL.total - t) / 1.0);
  ui += `<rect width="${W}" height="${HGT}" fill="#000" opacity="${f(1 - fade)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${HGT}" viewBox="0 0 ${W} ${HGT}" font-family="Inter, 'DejaVu Sans', sans-serif">${DEFS}${body}${ui}</svg>`;
}

function setup(timeline) { TL = timeline; }
if (typeof window !== 'undefined') { window.setup = setup; window.render = render; }
