/* Original vector art for "Kaspi vs Halyk". Every builder returns an SVG/HTML string.
   Brand names are set as plain text in brand colours — no official logos are reproduced. */
(function () {
  const C = {
    kaspi: "#F14635", kaspiDark: "#A8121C", kaspiLight: "#FF8A7A",
    halyk: "#14A75E", halykDark: "#0A5C35", halykLight: "#49DB93",
    gold: "#FFC83D", goldDark: "#C98A12", ink: "#FFFFFF", navy: "#0A1024",
    skin: "#E3A87F", skinShade: "#C98C66", hair: "#17110E", jacket: "#2F3D73", jacketDark: "#222D57",
  };

  // Deterministic random numbers so every render is identical.
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Main character: a young Kazakh man ---------- */
  function hero(opts = {}) {
    const back = !!opts.back;
    const face = back ? `
      <path d="M68,108 C60,52 92,34 122,34 C156,34 182,56 172,110 C176,140 164,166 120,170 C78,166 64,140 68,108 Z" fill="${C.hair}"/>
      <path d="M86,150 C100,160 140,160 154,150" stroke="#2a201b" stroke-width="3" fill="none" opacity=".6"/>` : `
      <ellipse cx="120" cy="114" rx="50" ry="57" fill="${C.skin}"/>
      <path d="M72,122 C74,150 92,170 120,171 C148,170 166,150 168,122 C160,150 142,164 120,164 C98,164 80,150 72,122Z" fill="${C.skinShade}" opacity=".45"/>
      <path d="M66,104 C58,52 92,34 124,35 C160,36 182,58 173,106 C170,90 162,80 152,74 C138,84 106,86 86,76 C76,82 70,92 66,104 Z" fill="${C.hair}"/>
      <path d="M86,76 C96,58 130,48 160,62 C150,52 126,44 104,50 C92,54 86,64 86,76Z" fill="#2c221d"/>
      <path d="M88,98 Q100,91 112,97" stroke="${C.hair}" stroke-width="5" stroke-linecap="round" fill="none" class="browL"/>
      <path d="M128,97 Q140,91 152,98" stroke="${C.hair}" stroke-width="5" stroke-linecap="round" fill="none" class="browR"/>
      <g class="eyes">
        <path d="M89,114 Q100,105 112,113 Q100,119 89,114Z" fill="#24160F"/>
        <path d="M128,113 Q140,105 151,114 Q140,119 128,113Z" fill="#24160F"/>
        <circle cx="104" cy="111" r="2.2" fill="#fff"/><circle cx="143" cy="111" r="2.2" fill="#fff"/>
      </g>
      <path d="M118,120 Q114,134 121,137" stroke="${C.skinShade}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="92" cy="133" rx="9" ry="5" fill="#E9806B" opacity=".25"/><ellipse cx="148" cy="133" rx="9" ry="5" fill="#E9806B" opacity=".25"/>
      <path class="mouth" d="M106,146 Q120,156 134,146" stroke="#7E3326" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    return `<svg class="hero" viewBox="0 0 240 520" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <ellipse class="shadow" cx="120" cy="506" rx="72" ry="12" fill="#000" opacity=".35"/>
      <g class="body">
        <g class="legL"><rect x="88" y="318" width="30" height="166" rx="14" fill="#1E2740"/>
          <path d="M80,478 Q82,466 100,466 L118,466 Q122,486 118,494 L84,494 Q78,490 80,478Z" fill="#F2F4F8"/><rect x="80" y="489" width="40" height="6" rx="3" fill="#B9C0D0"/></g>
        <g class="legR"><rect x="122" y="318" width="30" height="166" rx="14" fill="#1A2238"/>
          <path d="M122,466 L140,466 Q158,466 160,478 Q162,490 156,494 L122,494 Q118,486 122,466Z" fill="#F2F4F8"/><rect x="120" y="489" width="40" height="6" rx="3" fill="#B9C0D0"/></g>
        <g class="armL"><rect x="50" y="190" width="32" height="128" rx="16" fill="${C.jacketDark}"/><circle cx="66" cy="320" r="15" fill="${C.skin}"/></g>
        <g class="armR"><rect x="158" y="190" width="32" height="128" rx="16" fill="${C.jacketDark}"/><circle cx="174" cy="320" r="15" fill="${C.skin}"/></g>
        <g class="torso">
          <rect x="66" y="178" width="108" height="166" rx="40" fill="${C.jacket}"/>
          <path d="M104,180 L120,236 L136,180Z" fill="#ECEFF6"/>
          <line x1="120" y1="238" x2="120" y2="336" stroke="#1B2448" stroke-width="3"/>
          <rect x="70" y="326" width="100" height="18" rx="9" fill="${C.jacketDark}"/>
          <path d="M84,186 Q120,204 156,186" stroke="#3E4E8C" stroke-width="7" fill="none" stroke-linecap="round"/>
          <rect x="140" y="250" width="22" height="5" rx="2" fill="#4A5BA0"/>
        </g>
        <rect x="108" y="158" width="24" height="28" rx="8" fill="${C.skinShade}"/>
        <g class="head">
          <ellipse cx="70" cy="120" rx="11" ry="14" fill="${C.skinShade}"/><ellipse cx="170" cy="120" rx="11" ry="14" fill="${C.skinShade}"/>
          ${face}
        </g>
      </g>
    </svg>`;
  }

  /* ---------- Bank towers ---------- */
  function windows(x0, y0, cols, rows, dx, dy, w, h, seed, color) {
    const r = rng(seed); let s = "";
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const lit = r() > 0.28;
      s += `<rect class="win${lit ? " lit" : ""}" x="${x0 + i * dx}" y="${y0 + j * dy}" width="${w}" height="${h}" rx="3" fill="${color}" opacity="${lit ? (0.55 + r() * 0.45).toFixed(2) : 0.12}"/>`;
    }
    return s;
  }

  function kaspiTower() {
    return `<svg class="tower kaspi-tower" viewBox="0 0 360 1100" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs><linearGradient id="kt" x1="0" x2="1"><stop offset="0" stop-color="#FF6A55"/><stop offset=".55" stop-color="${C.kaspi}"/><stop offset="1" stop-color="${C.kaspiDark}"/></linearGradient>
      <radialGradient id="kglow"><stop offset="0" stop-color="${C.kaspi}" stop-opacity=".7"/><stop offset="1" stop-color="${C.kaspi}" stop-opacity="0"/></radialGradient></defs>
      <ellipse class="glow" cx="180" cy="520" rx="330" ry="620" fill="url(#kglow)" opacity=".35"/>
      <line x1="180" y1="-60" x2="180" y2="40" stroke="#ffd7d0" stroke-width="6"/>
      <circle class="beacon" cx="180" cy="-64" r="11" fill="#fff"/>
      <path d="M24,1100 L24,190 Q24,48 180,36 Q336,48 336,190 L336,1100 Z" fill="url(#kt)"/>
      <path d="M180,36 Q336,48 336,190 L336,1100 L262,1100 L262,180 Q262,70 180,36Z" fill="#000" opacity=".16"/>
      ${[70, 125, 235, 290].map(x => `<rect x="${x}" y="200" width="3" height="900" fill="#fff" opacity=".10"/>`).join("")}
      ${windows(52, 262, 5, 18, 54, 46, 34, 22, 7, "#FFF1EC")}
      <rect x="84" y="112" width="192" height="70" rx="35" fill="#fff"/>
      <text x="180" y="160" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="${C.kaspi}">KASPI</text>
    </svg>`;
  }

  function halykTower() {
    return `<svg class="tower halyk-tower" viewBox="0 0 380 1100" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs><linearGradient id="ht" x1="0" x2="1"><stop offset="0" stop-color="#36D18A"/><stop offset=".5" stop-color="${C.halyk}"/><stop offset="1" stop-color="${C.halykDark}"/></linearGradient>
      <radialGradient id="hglow"><stop offset="0" stop-color="${C.halyk}" stop-opacity=".7"/><stop offset="1" stop-color="${C.halyk}" stop-opacity="0"/></radialGradient></defs>
      <ellipse class="glow" cx="190" cy="520" rx="340" ry="620" fill="url(#hglow)" opacity=".35"/>
      <path d="M190,-70 L198,60 L182,60Z" fill="#d6ffe9"/>
      <circle class="beacon" cx="190" cy="-74" r="11" fill="#fff"/>
      <path d="M0,1100 L0,360 L36,360 L36,250 L76,250 L76,140 L110,140 L110,60 L270,60 L270,140 L304,140 L304,250 L344,250 L344,360 L380,360 L380,1100Z" fill="url(#ht)"/>
      <path d="M270,60 L270,140 L304,140 L304,250 L344,250 L344,360 L380,360 L380,1100 L300,1100 L300,360 L270,360 Z" fill="#000" opacity=".16"/>
      ${windows(40, 400, 6, 14, 52, 46, 32, 22, 11, "#EFFFF6")}
      ${windows(120, 170, 3, 4, 52, 44, 32, 20, 5, "#EFFFF6")}
      ${[30, 92, 154, 216, 278, 340].map(x => `<rect x="${x}" y="1010" width="14" height="90" rx="4" fill="#fff" opacity=".22"/>`).join("")}
      <rect x="96" y="80" width="188" height="64" rx="14" fill="#fff"/>
      <text x="190" y="126" text-anchor="middle" font-family="Unb" font-weight="900" font-size="38" fill="${C.halyk}">HALYK</text>
    </svg>`;
  }

  function skyline(seed, color, h) {
    const r = rng(seed); let x = -40, s = "";
    while (x < 1120) {
      const w = 60 + r() * 110, bh = h * (0.35 + r() * 0.65);
      s += `<rect x="${x.toFixed(0)}" y="${(h - bh).toFixed(0)}" width="${w.toFixed(0)}" height="${bh.toFixed(0)}" fill="${color}"/>`;
      for (let k = 0; k < 6; k++) if (r() > 0.55) s += `<rect x="${(x + 10 + r() * (w - 24)).toFixed(0)}" y="${(h - bh + 16 + r() * (bh - 30)).toFixed(0)}" width="8" height="10" fill="#FFE7B0" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`;
      x += w + 6;
    }
    return `<svg viewBox="0 0 1080 ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  }

  /* ---------- Bank card ---------- */
  function card(brand) {
    const k = brand === "kaspi";
    const a = k ? "#FF6B57" : "#35D08A", b = k ? C.kaspiDark : C.halykDark;
    const name = k ? "KASPI" : "HALYK";
    return `<svg class="card" viewBox="0 0 340 214" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="cg-${brand}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
      <rect width="340" height="214" rx="22" fill="url(#cg-${brand})"/>
      <circle cx="300" cy="-10" r="120" fill="#fff" opacity=".08"/><circle cx="20" cy="230" r="90" fill="#000" opacity=".10"/>
      <rect x="28" y="70" width="52" height="40" rx="8" fill="#F7D57A"/><path d="M28,90 H80 M54,70 V110" stroke="#C9A040" stroke-width="2"/>
      <path d="M100,78 q10,12 0,24 M112,72 q16,18 0,36 M124,66 q22,24 0,48" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>
      <text x="28" y="48" font-family="Unb" font-weight="900" font-size="28" fill="#fff">${name}</text>
      <text x="28" y="160" font-family="Mont" font-weight="700" font-size="22" fill="#fff" letter-spacing="3" opacity=".9">•••• •••• •••• 2026</text>
      <text x="28" y="192" font-family="Mont" font-weight="600" font-size="14" fill="#fff" opacity=".75">KZT · ТЕНГЕ</text>
    </svg>`;
  }

  /* ---------- Coin ---------- */
  function coin(size) {
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${C.goldDark}"/><circle cx="50" cy="46" r="44" fill="${C.gold}"/>
      <circle cx="50" cy="46" r="34" fill="none" stroke="#FFE7A0" stroke-width="4"/>
      <text x="50" y="62" text-anchor="middle" font-family="Mont" font-weight="900" font-size="44" fill="${C.goldDark}">₸</text></svg>`;
  }

  /* ---------- Vault ---------- */
  function vault(brand) {
    const col = brand === "kaspi" ? C.kaspi : C.halyk;
    const bolts = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2; return `<circle cx="${(200 + Math.cos(a) * 128).toFixed(1)}" cy="${(200 + Math.sin(a) * 128).toFixed(1)}" r="8" fill="#8D97B0"/>`;
    }).join("");
    const bars = [0, 1, 2].map(r => [0, 1, 2, 3].slice(0, 4 - r).map(i =>
      `<path d="M${118 + i * 42 + r * 21},${300 - r * 28} l8,-24 h28 l8,24z" fill="${C.gold}" stroke="${C.goldDark}" stroke-width="3"/>`).join("")).join("");
    return `<svg class="vault" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs><radialGradient id="vi-${brand}"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".6" stop-color="#7A5A12"/><stop offset="1" stop-color="#1A1408"/></radialGradient>
        <linearGradient id="vd-${brand}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4E9F5"/><stop offset="1" stop-color="#7C86A2"/></linearGradient></defs>
      <rect x="10" y="10" width="380" height="380" rx="44" fill="#1C2236" stroke="${col}" stroke-width="10"/>
      <circle cx="200" cy="200" r="160" fill="url(#vi-${brand})"/>
      <g class="gold">${bars}</g>
      <g class="door">
        <circle cx="200" cy="200" r="160" fill="url(#vd-${brand})" stroke="${col}" stroke-width="12"/>
        <circle cx="200" cy="200" r="112" fill="none" stroke="#9AA4BE" stroke-width="6"/>
        ${bolts}
        <g class="wheel"><circle cx="200" cy="200" r="58" fill="none" stroke="#4D5772" stroke-width="12"/>
          <path d="M200,138 V262 M138,200 H262 M156,156 L244,244 M244,156 L156,244" stroke="#4D5772" stroke-width="10" stroke-linecap="round"/>
          <circle cx="200" cy="200" r="20" fill="${col}"/></g>
      </g>
    </svg>`;
  }

  /* ---------- Gear path ---------- */
  function gearPath(cx, cy, r, teeth, depth) {
    let d = "";
    for (let i = 0; i < teeth * 2; i++) {
      const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
      const rr = i % 2 ? r - depth : r;
      d += `${i ? "L" : "M"}${(cx + Math.cos(a0) * rr).toFixed(1)},${(cy + Math.sin(a0) * rr).toFixed(1)} L${(cx + Math.cos(a1) * rr).toFixed(1)},${(cy + Math.sin(a1) * rr).toFixed(1)} `;
    }
    return d + "Z";
  }

  /* ---------- Money factory ---------- */
  function factory(brand) {
    const k = brand === "kaspi", col = k ? C.kaspi : C.halyk, dark = k ? C.kaspiDark : C.halykDark;
    const notes = Array.from({ length: 5 }, (_, i) => `<g class="note" data-i="${i}"><rect x="-34" y="-18" width="68" height="36" rx="5" fill="#9BE3B0" stroke="#3D8C57" stroke-width="3"/><circle cx="0" cy="0" r="11" fill="#3D8C57"/><text x="0" y="6" font-family="Mont" font-weight="900" font-size="16" text-anchor="middle" fill="#E9FFF0">₸</text></g>`).join("");
    return `<svg class="factory" viewBox="0 0 440 420" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <g class="smokeG">${[0, 1, 2].map(i => `<circle class="smoke" cx="${330}" cy="${40}" r="${18 + i * 6}" fill="#CBD3E6" opacity="0"/>`).join("")}</g>
      <rect x="306" y="40" width="48" height="150" fill="${dark}"/><rect x="300" y="36" width="60" height="16" rx="4" fill="#333B57"/>
      <path d="M40,330 L40,180 L110,120 L110,180 L180,120 L180,180 L250,120 L250,180 L380,180 L380,330Z" fill="${col}"/>
      <path d="M40,180 L110,120 L110,180Z M110,180 L180,120 L180,180Z M180,180 L250,120 L250,180Z" fill="#fff" opacity=".25"/>
      ${[70, 150, 230, 310].map(x => `<rect x="${x}" y="210" width="44" height="40" rx="6" fill="#FFF5D6" opacity=".85"/>`).join("")}
      <rect x="160" y="262" width="80" height="68" rx="8" fill="#1B2136"/>
      <g transform="translate(100 292)"><g class="gear"><path d="${gearPath(0, 0, 46, 10, 10)}" fill="#ECEFF6"/><circle r="14" fill="${dark}"/></g></g>
      <g transform="translate(158 252)"><g class="gear2"><path d="${gearPath(0, 0, 28, 8, 8)}" fill="#C7CDDD"/><circle r="9" fill="${dark}"/></g></g>
      <text x="210" y="168" text-anchor="middle" font-family="Unb" font-weight="900" font-size="30" fill="#fff">${k ? "KASPI" : "HALYK"}</text>
      <rect x="0" y="352" width="440" height="22" rx="11" fill="#2A3150"/>
      ${[20, 80, 140, 200, 260, 320, 380, 420].map(x => `<circle class="roller" cx="${x}" cy="363" r="8" fill="#5C6688"/>`).join("")}
      <g class="notes">${notes}</g>
    </svg>`;
  }

  /* ---------- Tech props ---------- */
  function phone(id) {
    return `<svg class="phone" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <rect x="0" y="0" width="300" height="600" rx="44" fill="#0F1428" stroke="#5E6A95" stroke-width="6"/>
      <rect x="16" y="16" width="268" height="568" rx="32" fill="#151C38"/>
      <rect x="110" y="26" width="80" height="18" rx="9" fill="#0F1428"/>
      <g class="ui">
        <rect class="u u1" x="34" y="66" width="232" height="120" rx="18" fill="${C.kaspi}"/>
        <text class="u u1t" x="54" y="112" font-family="Unb" font-weight="800" font-size="20" fill="#fff">Баланс</text>
        <rect class="u u1b" x="54" y="130" width="140" height="22" rx="6" fill="#fff" opacity=".85"/>
        <rect class="u u2" x="34" y="204" width="110" height="110" rx="18" fill="${C.halyk}"/>
        <rect class="u u3" x="156" y="204" width="110" height="110" rx="18" fill="#3B4A86"/>
        <rect class="u u4" x="34" y="332" width="232" height="64" rx="16" fill="#2A3460"/>
        <rect class="u u5" x="34" y="410" width="232" height="64" rx="16" fill="#2A3460"/>
        <rect class="u u6" x="34" y="488" width="232" height="64" rx="16" fill="${C.gold}" opacity=".9"/>
        <path class="u u2i" d="M66,262 l20,-26 l20,16 l22,-30" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle class="u u3i" cx="211" cy="259" r="26" fill="none" stroke="#fff" stroke-width="7"/>
      </g>
    </svg>`;
  }

  function server() {
    const leds = Array.from({ length: 6 }, (_, j) => [0, 1, 2].map(i =>
      `<rect class="led" x="${120 + i * 16}" y="${34 + j * 70}" width="10" height="10" rx="2" fill="${i === 2 ? C.kaspi : C.halykLight}"/>`).join("")).join("");
    const units = Array.from({ length: 6 }, (_, j) => `<rect x="20" y="${18 + j * 70}" width="160" height="56" rx="8" fill="#232B4A"/><rect x="34" y="${36 + j * 70}" width="70" height="8" rx="4" fill="#3A4570"/><rect x="34" y="${50 + j * 70}" width="50" height="6" rx="3" fill="#3A4570"/>`).join("");
    return `<svg class="server" viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="450" rx="18" fill="#141A31" stroke="#46507A" stroke-width="4"/>${units}${leds}</svg>`;
  }

  function dev(brand, seed) {
    // A seated developer with a laptop and code lines.
    const col = brand === "kaspi" ? C.kaspi : C.halyk;
    const r = rng(seed);
    const code = Array.from({ length: 5 }, (_, i) => `<rect class="code" x="${40 + (i % 2) * 14}" y="${26 + i * 16}" width="${(60 + r() * 90).toFixed(0)}" height="7" rx="3" fill="${i % 3 === 0 ? col : "#9FB0E8"}"/>`).join("");
    return `<svg class="dev" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <rect x="20" y="10" width="220" height="110" rx="12" fill="#10162D" stroke="#3C4775" stroke-width="4"/>${code}
      <circle cx="150" cy="168" r="34" fill="${brand === "kaspi" ? "#C88A63" : C.skin}"/>
      <path d="M116,160 C114,128 186,128 184,160 C176,146 126,146 116,160Z" fill="${C.hair}"/>
      <path d="M92,300 C92,226 208,226 208,300Z" fill="${col}"/>
      <rect x="60" y="250" width="180" height="16" rx="6" fill="#C9D0E2"/><path d="M84,250 L104,196 H196 L216,250Z" fill="#8892B0"/>
      <circle cx="150" cy="223" r="7" fill="#fff" opacity=".8"/>
      <rect x="0" y="266" width="300" height="14" rx="7" fill="#3A3150"/>
    </svg>`;
  }

  function megaphone() {
    return `<svg class="mega" viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <path d="M40,80 L150,30 L150,170 L40,120Z" fill="${C.gold}"/><rect x="14" y="76" width="34" height="48" rx="8" fill="#E0A21E"/>
      <path d="M60,118 L74,170 L96,166 L86,124Z" fill="#C98A12"/>
      <path class="wave w1" d="M176,70 Q196,100 176,130" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path class="wave w2" d="M200,50 Q232,100 200,150" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path class="wave w3" d="M224,30 Q268,100 224,170" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  /* ---------- Line icons (white stroke) ---------- */
  const ICON = {
    chip: `<rect x="22" y="22" width="56" height="56" rx="8"/><rect x="38" y="38" width="24" height="24" rx="3"/><path d="M34,10v12M50,10v12M66,10v12M34,78v12M50,78v12M66,78v12M10,34h12M10,50h12M10,66h12M78,34h12M78,50h12M78,66h12"/>`,
    app: `<rect x="26" y="8" width="48" height="84" rx="10"/><path d="M44,80h12"/><rect x="36" y="22" width="12" height="12" rx="3"/><rect x="52" y="22" width="12" height="12" rx="3"/><rect x="36" y="40" width="12" height="12" rx="3"/><rect x="52" y="40" width="12" height="12" rx="3"/>`,
    shield: `<path d="M50,8 L84,20 V46 C84,70 68,86 50,92 C32,86 16,70 16,46 V20Z"/><rect x="36" y="46" width="28" height="22" rx="4"/><path d="M42,46 v-8 a8,8 0 0 1 16,0 v8"/>`,
    rocket: `<path d="M50,8 C68,22 74,44 66,70 H34 C26,44 32,22 50,8Z"/><circle cx="50" cy="38" r="8"/><path d="M34,58 L20,74 L34,72 M66,58 L80,74 L66,72 M42,78 L50,94 L58,78"/>`,
    phone: `<rect x="28" y="8" width="44" height="84" rx="10"/><path d="M44,80h12"/>`,
    transfer: `<path d="M14,34 H78 M64,20 L78,34 L64,48 M86,66 H22 M36,52 L22,66 L36,80"/>`,
    cashback: `<circle cx="50" cy="50" r="22"/><path d="M50,38 v24 M44,44 h12"/><path d="M84,40 A36,36 0 1 0 82,64 M84,24 V42 H66"/>`,
    deposit: `<path d="M20,46 C20,30 34,22 52,22 C72,22 84,32 86,46 L94,48 V60 L86,62 C84,70 78,76 72,80 V90 H60 V84 H44 V90 H32 V80 C24,74 20,62 20,46Z"/><circle cx="68" cy="42" r="3"/><path d="M44,22 V14 H60 V22"/>`,
    loan: `<path d="M36,22 L44,8 H56 L64,22"/><path d="M30,30 C10,52 14,92 50,92 C86,92 90,52 70,30Z"/><path d="M50,46 v30 M42,54 h16 M42,62 h16"/>`,
    installment: `<rect x="12" y="18" width="76" height="70" rx="10"/><path d="M12,38 H88 M32,8 v20 M68,8 v20"/><path d="M28,52h10M45,52h10M62,52h10M28,68h10M45,68h10"/>`,
    qr: `<rect x="12" y="12" width="28" height="28" rx="4"/><rect x="60" y="12" width="28" height="28" rx="4"/><rect x="12" y="60" width="28" height="28" rx="4"/><path d="M60,60h10v10h-10z M78,60h10 M60,78h10 M78,72v16h-8"/>`,
    comment: `<path d="M14,18 H86 Q92,18 92,24 V66 Q92,72 86,72 H44 L24,90 V72 H14 Q8,72 8,66 V24 Q8,18 14,18Z"/><path d="M28,38h44M28,52h30"/>`,
    scale: `<path d="M50,10 V88 M24,88 H76 M14,30 H86"/><path d="M14,30 L4,58 H24Z M86,30 L76,58 H96Z"/>`,
    profit: `<path d="M10,88 H90"/><path d="M18,70 L40,48 L56,60 L84,26"/><path d="M68,26 H84 V42"/>`,
    eco: `<circle cx="50" cy="50" r="12"/><circle cx="20" cy="22" r="9"/><circle cx="80" cy="22" r="9"/><circle cx="20" cy="80" r="9"/><circle cx="80" cy="80" r="9"/><path d="M27,29 L41,42 M73,29 L59,42 M27,73 L41,58 M73,73 L59,58"/>`,
    bank: `<path d="M10,38 L50,12 L90,38Z M14,88 H86 M22,44 V80 M40,44 V80 M60,44 V80 M78,44 V80"/>`,
    hand: `<path d="M30,92 V52 C30,46 40,46 40,52 V30 C40,24 50,24 50,30 V48 V26 C50,20 60,20 60,26 V50 V34 C60,28 70,28 70,34 V64 C70,80 62,92 48,92Z"/>`,
  };
  function icon(name, size, color) {
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" stroke="${color || "#fff"}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${ICON[name]}</svg>`;
  }

  function qrCode(seed, size) {
    const r = rng(seed); let s = "";
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (finder) continue;
      if (r() > 0.52) s += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#111"/>`;
    return `<svg viewBox="-1 -1 23 23" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect x="-1" y="-1" width="23" height="23" rx="2" fill="#fff"/><g fill="#111">${s}</g>${f(0, 0)}${f(14, 0)}${f(0, 14)}</svg>`;
  }

  function atm() {
    return `<svg class="atm" viewBox="0 0 220 360" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="200" height="340" rx="22" fill="${C.halyk}"/><rect x="10" y="10" width="200" height="60" rx="22" fill="${C.halykDark}"/>
      <text x="110" y="52" text-anchor="middle" font-family="Unb" font-weight="900" font-size="26" fill="#fff">HALYK</text>
      <rect x="36" y="90" width="148" height="100" rx="10" fill="#0E1A2C"/><rect x="52" y="110" width="90" height="12" rx="6" fill="${C.halykLight}"/><rect x="52" y="132" width="116" height="10" rx="5" fill="#2E4A66"/><rect x="52" y="150" width="70" height="10" rx="5" fill="#2E4A66"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${52 + (i % 3) * 40}" y="${206 + Math.floor(i / 3) * 30}" width="34" height="22" rx="5" fill="#E6FFF1" opacity=".85"/>`).join("")}
      <rect x="60" y="310" width="100" height="14" rx="7" fill="#08331D"/>
    </svg>`;
  }

  function bag(color) {
    return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><path d="M14,34 H86 L80,104 H20Z" fill="${color}"/><path d="M34,34 V24 a16,16 0 0 1 32,0 V34" stroke="#fff" stroke-width="7" fill="none"/><rect x="14" y="34" width="72" height="12" fill="#000" opacity=".15"/></svg>`;
  }

  window.ART = { C, rng, hero, kaspiTower, halykTower, skyline, card, coin, vault, factory, phone, server, dev, megaphone, icon, qrCode, atm, bag };
})();
