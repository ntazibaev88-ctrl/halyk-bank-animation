/* Astana film — shared 2D illustration + motion helpers.
   Everything here is deterministic (seeded RNG) so every frame is a pure function of timeline time. */
(function () {
  const A = (window.Astana = {});
  let uidN = 0;
  const uid = (A.uid = (p) => (p || "g") + ++uidN);

  A.P = {
    deep: "#07142B", navy: "#0B1D3A", navy2: "#12305C", blue: "#2F7FD1", sky: "#4FA8E8", skyLight: "#BFE3FA",
    white: "#FFFFFF", gold: "#F2B84B", goldLight: "#F7C55A", goldDeep: "#D9952A", orange: "#F28C38", turq: "#3CC6C0",
  };

  A.rng = function (seed) {
    let s = seed >>> 0;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };

  /* ---------- voice clock ---------- */
  A.T = window.ASTANA_TIMING || {};
  // local time (seconds inside the scene) at which the nth word starting with `prefix` is spoken
  A.word = function (sid, prefix, nth, fallback) {
    const sc = A.T[sid];
    if (!sc) return fallback || 0;
    const p = prefix.toLowerCase();
    let n = nth || 0;
    for (const w of sc.words) {
      if (w.w.toLowerCase().indexOf(p) === 0) {
        if (n === 0) return w.t;
        n--;
      }
    }
    return fallback || 0;
  };

  /* ---------- themes ---------- */
  A.theme = {
    day: { body: "#F6FAFE", shade: "#D3E1F0", dark: "#8FA9C6", glass: "#8CCBF3", glass2: "#3E8FD6", gold: "#F2B84B", gold2: "#D9952A", line: "#1B3A66", win: "#7FBCE8", winOp: 0.75 },
    dusk: { body: "#FBEBDA", shade: "#E7BE9C", dark: "#A9785F", glass: "#F6B578", glass2: "#D9783E", gold: "#F7C55A", gold2: "#D9952A", line: "#5A2E22", win: "#FFE2A6", winOp: 0.9 },
    night: { body: "#1B3B6E", shade: "#132C55", dark: "#0A1A36", glass: "#2B62A6", glass2: "#1F4C86", gold: "#F7C55A", gold2: "#E09A2B", line: "#6FB7EA", win: "#F7C55A", winOp: 1 },
    future: { body: "#16406B", shade: "#0F2E55", dark: "#0A1F3D", glass: "#2FA9B8", glass2: "#1E7F9A", gold: "#F7C55A", gold2: "#E09A2B", line: "#6CE5DC", win: "#8EF0E6", winOp: 1 },
  };
  A.sil = function (color) {
    return { body: color, shade: color, dark: color, glass: color, glass2: color, gold: color, gold2: color, line: color, win: color, winOp: 0, sil: true };
  };

  /* ---------- placement ---------- */
  // art: {w,h,svg}; o: {x (centre), base (bottom y), s, id, cls, style}
  A.place = function (art, o) {
    const s = o.s || 1, w = art.w * s, h = art.h * s;
    return (
      '<div ' + (o.id ? 'id="' + o.id + '" ' : "") + 'class="lm ' + (o.cls || "") + '" style="left:' + (o.x - w / 2).toFixed(1) + "px;top:" + (o.base - h).toFixed(1) +
      "px;width:" + w.toFixed(1) + "px;height:" + h.toFixed(1) + "px;" + (o.style || "") + '"><svg viewBox="0 0 ' + art.w + " " + art.h + '" width="' + w.toFixed(1) +
      '" height="' + h.toFixed(1) + '">' + art.svg + "</svg></div>"
    );
  };

  /* ---------- landmarks ---------- */
  A.baiterek = function (c) {
    const g = uid(), W = 280, H = 640;
    let s = '<defs><radialGradient id="' + g + '" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="' + (c.sil ? c.gold : "#FFF6CF") + '"/><stop offset="0.45" stop-color="' + c.gold +
      '"/><stop offset="1" stop-color="' + c.gold2 + '"/></radialGradient></defs>';
    s += '<path d="M52 640 L84 596 H196 L228 640Z" fill="' + c.shade + '"/><rect x="40" y="628" width="200" height="12" rx="3" fill="' + c.dark + '"/>';
    s += '<path d="M96 600 C100 470 118 400 116 330 C112 250 60 200 32 118 L60 118 C92 190 132 215 140 250 C148 215 188 190 220 118 L248 118 C220 200 168 250 164 330 C162 400 180 470 184 600Z" fill="' + c.shade + '" opacity="' + (c.sil ? 1 : 0.55) + '"/>';
    for (let i = -3; i <= 3; i++) {
      const x0 = 140 + i * 14;
      s += '<path d="M' + x0 + " 600 C" + x0 + " 480 " + (140 + i * 5) + " 410 " + (140 + i * 8) + " 330 S" + (140 + i * 30) + " 200 " + (140 + i * 36) + ' 112" fill="none" stroke="' + c.body + '" stroke-width="' + (i === 0 ? 6 : 7) + '" stroke-linecap="round"/>';
    }
    [[540, 36], [470, 30], [400, 25], [330, 26], [262, 46]].forEach(function (r) {
      s += '<ellipse cx="140" cy="' + r[0] + '" rx="' + r[1] + '" ry="5" fill="none" stroke="' + c.body + '" stroke-width="3"/>';
    });
    s += '<circle cx="140" cy="108" r="76" fill="url(#' + g + ')"/>';
    if (!c.sil) s += '<ellipse cx="114" cy="80" rx="26" ry="16" fill="#fff" opacity="0.45" transform="rotate(-28 114 80)"/><path d="M70 130 A76 76 0 0 0 210 130" fill="none" stroke="' + c.gold2 + '" stroke-width="3" opacity="0.6"/>';
    return { w: W, h: H, svg: s };
  };

  A.akorda = function (c) {
    const g = uid();
    let s = '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + (c.sil ? c.glass2 : "#5CB0F0") + '"/><stop offset="1" stop-color="' + (c.sil ? c.glass2 : "#1F5FB0") + '"/></linearGradient></defs>';
    s += '<rect x="10" y="342" width="540" height="18" rx="3" fill="' + c.dark + '"/><rect x="30" y="328" width="500" height="16" fill="' + c.shade + '"/>';
    s += '<rect x="50" y="196" width="460" height="134" fill="' + c.body + '"/><rect x="42" y="184" width="476" height="14" fill="' + c.shade + '"/>';
    for (let x = 66; x < 500; x += 30) {
      if (x > 180 && x < 366) continue;
      s += '<rect x="' + x + '" y="214" width="13" height="98" rx="4" fill="' + c.glass2 + '" opacity="' + (c.sil ? 1 : 0.85) + '"/>';
    }
    s += '<rect x="188" y="134" width="184" height="196" fill="' + c.body + '"/><rect x="198" y="152" width="164" height="178" fill="' + c.glass2 + '"/>';
    for (let i = 0; i < 6; i++) s += '<rect x="' + (202 + i * 29.2) + '" y="150" width="11" height="180" fill="' + c.body + '"/>';
    s += '<rect x="180" y="122" width="200" height="14" fill="' + c.shade + '"/><rect x="188" y="112" width="184" height="10" fill="' + c.gold + '"/>';
    s += '<rect x="222" y="84" width="116" height="30" fill="' + c.body + '"/><path d="M218 86 A62 64 0 0 1 342 86Z" fill="url(#' + g + ')"/>';
    if (!c.sil) s += '<path d="M236 76 A44 46 0 0 1 276 28" fill="none" stroke="#fff" stroke-width="5" opacity="0.4" stroke-linecap="round"/>';
    s += '<rect x="278" y="0" width="4" height="26" fill="' + c.gold + '"/><circle cx="280" cy="10" r="6" fill="' + c.gold + '"/><rect x="266" y="276" width="28" height="54" rx="3" fill="' + c.gold2 + '"/>';
    return { w: 560, h: 360, svg: s };
  };

  A.khanShatyr = function (c) {
    const g = uid();
    let s = '<defs><linearGradient id="' + g + '" x1="0.2" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="' + (c.sil ? c.body : "#E9FBFA") + '"/><stop offset="0.55" stop-color="' + (c.sil ? c.body : c.glass) +
      '"/><stop offset="1" stop-color="' + (c.sil ? c.body : c.glass2) + '"/></linearGradient></defs>';
    s += '<path d="M18 440 C120 384 232 190 286 40 C322 196 402 384 464 440Z" fill="url(#' + g + ')"/>';
    if (!c.sil) {
      [50, 110, 170, 230, 300, 360, 420].forEach(function (x) {
        s += '<path d="M286 40 Q' + ((286 + x) / 2 + (x < 286 ? -22 : 16)) + " 250 " + x + ' 438" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.55"/>';
      });
      s += '<path d="M150 330 Q280 290 396 340" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.5"/><path d="M92 392 Q270 340 432 400" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.5"/><path d="M212 232 Q286 212 350 240" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.5"/>';
    }
    s += '<path d="M286 44 L298 0" stroke="' + c.gold + '" stroke-width="6" stroke-linecap="round"/><rect x="6" y="430" width="468" height="10" rx="4" fill="' + c.dark + '"/>';
    return { w: 480, h: 440, svg: s };
  };

  A.pyramid = function (c) {
    const g = uid(), cp = uid("c");
    let s = '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c.gold + '"/><stop offset="1" stop-color="' + (c.sil ? c.gold : c.glass) +
      '"/></linearGradient><clipPath id="' + cp + '"><path d="M200 10 L380 360 L20 360Z"/></clipPath></defs>';
    s += '<path d="M200 10 L380 360 L20 360Z" fill="' + c.body + '"/><path d="M200 10 L380 360 L200 360Z" fill="' + c.shade + '"/>';
    if (!c.sil) {
      s += '<g clip-path="url(#' + cp + ')" stroke="' + c.dark + '" stroke-width="2.5" opacity="0.55">';
      for (let k = -8; k <= 8; k++) s += '<path d="M' + (200 + k * 45) + " 360 L" + (200 + k * 45 + 180) + ' 10"/><path d="M' + (200 + k * 45) + " 360 L" + (200 + k * 45 - 180) + ' 10"/>';
      s += "</g>";
    }
    s += '<path d="M200 10 L266 138 L134 138Z" fill="url(#' + g + ')"/><rect x="178" y="318" width="44" height="42" rx="3" fill="' + c.dark + '"/><rect x="6" y="352" width="388" height="8" rx="3" fill="' + c.dark + '"/>';
    return { w: 400, h: 360, svg: s };
  };

  A.expo = function (c) {
    const g = uid(), cp = uid("c");
    let s = '<defs><radialGradient id="' + g + '" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stop-color="' + (c.sil ? c.glass2 : "#D9F6FF") + '"/><stop offset="0.5" stop-color="' + c.glass +
      '"/><stop offset="1" stop-color="' + c.glass2 + '"/></radialGradient><clipPath id="' + cp + '"><circle cx="200" cy="186" r="166"/></clipPath></defs>';
    s += '<path d="M0 420 L0 376 Q200 322 400 376 L400 420Z" fill="' + c.body + '"/><path d="M0 396 Q200 344 400 396 L400 420 L0 420Z" fill="' + c.shade + '"/>';
    s += '<circle cx="200" cy="186" r="166" fill="url(#' + g + ')"/>';
    if (!c.sil) {
      s += '<g clip-path="url(#' + cp + ')" fill="none" stroke="#fff" stroke-width="2.2" opacity="0.45">';
      [30, 75, 120, 166].forEach(function (rx) { s += '<ellipse cx="200" cy="186" rx="' + rx + '" ry="166"/>'; });
      [-110, -55, 0, 55, 110].forEach(function (dy) { s += '<path d="M20 ' + (186 + dy) + " Q200 " + (186 + dy + 44) + " 380 " + (186 + dy) + '"/>'; });
      s += '</g><ellipse cx="140" cy="106" rx="52" ry="28" fill="#fff" opacity="0.35" transform="rotate(-32 140 106)"/>';
    }
    return { w: 400, h: 420, svg: s };
  };

  A.mosque = function (c) {
    let s = "";
    [44, 150, 450, 556].forEach(function (x, i) {
      const top = i === 0 || i === 3 ? 70 : 110;
      s += '<rect x="' + (x - 9) + '" y="' + top + '" width="18" height="' + (420 - top) + '" fill="' + c.body + '"/><rect x="' + (x - 15) + '" y="' + (top + 90) + '" width="30" height="9" rx="2" fill="' + c.shade +
        '"/><rect x="' + (x - 15) + '" y="' + (top + 180) + '" width="30" height="9" rx="2" fill="' + c.shade + '"/><path d="M' + (x - 11) + " " + top + " L" + x + " " + (top - 54) + " L" + (x + 11) + " " + top + 'Z" fill="' + c.gold +
        '"/><rect x="' + (x - 1.5) + '" y="' + (top - 70) + '" width="3" height="18" fill="' + c.gold + '"/>';
    });
    s += '<rect x="100" y="262" width="400" height="158" fill="' + c.body + '"/><rect x="92" y="250" width="416" height="14" fill="' + c.shade + '"/>';
    for (let i = 0; i < 7; i++) {
      const x = 124 + i * 52;
      s += '<path d="M' + x + " 420 V330 A19 22 0 0 1 " + (x + 38) + ' 330 V420Z" fill="' + c.glass2 + '" opacity="' + (c.sil ? 1 : 0.85) + '"/>';
    }
    [186, 414].forEach(function (x) {
      s += '<path d="M' + (x - 44) + " 252 A44 46 0 0 1 " + (x + 44) + ' 252Z" fill="' + c.body + '"/><path d="M' + x + " 206 A44 46 0 0 1 " + (x + 44) + ' 252 H' + x + 'Z" fill="' + c.shade + '"/><rect x="' + (x - 1.5) + '" y="190" width="3" height="18" fill="' + c.gold + '"/>';
    });
    s += '<rect x="236" y="190" width="128" height="62" fill="' + c.body + '"/><rect x="228" y="182" width="144" height="10" fill="' + c.gold + '"/><path d="M226 184 A74 84 0 0 1 374 184Z" fill="' + c.body +
      '"/><path d="M300 100 A74 84 0 0 1 374 184 H300Z" fill="' + c.shade + '"/><path d="M252 150 A52 60 0 0 1 300 112" fill="none" stroke="' + c.gold + '" stroke-width="4" stroke-linecap="round"/><rect x="298" y="72" width="4" height="30" fill="' + c.gold +
      '"/><circle cx="300" cy="74" r="7" fill="' + c.gold + '"/>';
    return { w: 600, h: 420, svg: s };
  };

  A.opera = function (c) {
    let s = '<rect x="0" y="344" width="560" height="16" fill="' + c.dark + '"/><rect x="20" y="330" width="520" height="16" fill="' + c.shade + '"/>';
    s += '<rect x="36" y="206" width="488" height="126" fill="' + c.body + '"/><rect x="28" y="194" width="504" height="14" fill="' + c.shade + '"/>';
    for (let i = 0; i < 12; i++) {
      const x = 52 + i * 40;
      if (x > 130 && x < 420) continue;
      s += '<path d="M' + x + " 318 V246 A11 13 0 0 1 " + (x + 22) + ' 246 V318Z" fill="' + c.glass2 + '" opacity="' + (c.sil ? 1 : 0.85) + '"/>';
    }
    s += '<rect x="138" y="170" width="284" height="162" fill="' + (c.sil ? c.body : c.dark) + '"/>';
    for (let i = 0; i < 8; i++) s += '<rect x="' + (146 + i * 36.6) + '" y="170" width="14" height="162" fill="' + c.body + '"/><rect x="' + (143 + i * 36.6) + '" y="170" width="20" height="8" fill="' + c.shade + '"/>';
    s += '<rect x="126" y="148" width="308" height="24" fill="' + c.body + '"/><rect x="126" y="164" width="308" height="8" fill="' + c.shade + '"/><path d="M118 148 L280 84 L442 148Z" fill="' + c.body + '"/><path d="M160 142 L280 96 L400 142Z" fill="' + c.shade + '"/>';
    s += '<path d="M250 86 L256 60 L270 52 L276 36 L284 36 L290 52 L304 60 L310 86Z" fill="' + c.gold + '"/><circle cx="280" cy="30" r="8" fill="' + c.gold + '"/>';
    return { w: 560, h: 360, svg: s };
  };

  A.museum = function (c) {
    const cp = uid("c");
    let s = '<defs><clipPath id="' + cp + '"><path d="M70 320 L118 78 L330 40 L366 320Z"/></clipPath></defs>';
    s += '<rect x="14" y="226" width="100" height="94" fill="' + c.body + '"/><rect x="14" y="226" width="100" height="12" fill="' + c.shade + '"/>';
    s += '<path d="M300 320 L300 132 L530 156 L572 320Z" fill="' + c.body + '"/><path d="M300 132 L530 156 L536 180 L300 160Z" fill="' + c.shade + '"/>';
    s += '<rect x="408" y="18" width="46" height="302" fill="' + c.shade + '"/><rect x="408" y="18" width="46" height="12" fill="' + c.gold + '"/>';
    s += '<path d="M70 320 L118 78 L330 40 L366 320Z" fill="' + c.glass2 + '"/>';
    if (!c.sil) {
      s += '<g clip-path="url(#' + cp + ')" stroke="#fff" stroke-width="2.2" opacity="0.4">';
      for (let k = 0; k < 9; k++) s += '<path d="M' + (70 + k * 40) + " 320 L" + (118 + k * 40) + ' 30"/>';
      for (let k = 0; k < 7; k++) s += '<path d="M40 ' + (300 - k * 44) + " L380 " + (286 - k * 44) + '"/>';
      s += '</g><path d="M118 78 L330 40 L334 66 L114 104Z" fill="#fff" opacity="0.22"/>';
    }
    for (let i = 0; i < 4; i++) s += '<rect x="' + (470 + i * 22) + '" y="220" width="10" height="100" fill="' + c.glass2 + '" opacity="' + (c.sil ? 1 : 0.8) + '"/>';
    s += '<rect x="0" y="312" width="600" height="8" rx="3" fill="' + c.dark + '"/>';
    return { w: 600, h: 320, svg: s };
  };

  /* ---------- generic towers ---------- */
  // o: {windows:boolean, lit:boolean (adds .wl .wlN classes for staged lighting), green:boolean}
  A.tower = function (kind, w, h, c, rnd, o) {
    o = o || {};
    let s = "", top = 0, bodyX = 0, bodyW = w;
    const k = kind % 6;
    if (k === 1) {
      s += '<rect x="' + w * 0.3 + '" y="0" width="' + w * 0.4 + '" height="' + h + '" fill="' + c.body + '"/><rect x="' + w * 0.15 + '" y="' + h * 0.18 + '" width="' + w * 0.7 + '" height="' + h * 0.82 +
        '" fill="' + c.body + '"/><rect x="0" y="' + h * 0.4 + '" width="' + w + '" height="' + h * 0.6 + '" fill="' + c.body + '"/>';
      top = h * 0.4;
    } else if (k === 2) {
      s += '<path d="M0 ' + h + " V" + h * 0.16 + " L" + w + " 0 V" + h + 'Z" fill="' + c.body + '"/>';
      top = h * 0.2;
    } else if (k === 3) {
      s += '<path d="M0 ' + h + " V" + w * 0.5 + " A" + w * 0.5 + " " + w * 0.5 + " 0 0 1 " + w + " " + w * 0.5 + " V" + h + 'Z" fill="' + c.body + '"/>';
      top = w * 0.55;
    } else if (k === 4) {
      s += '<rect x="' + (w / 2 - 2) + '" y="0" width="4" height="' + h * 0.14 + '" fill="' + c.gold + '"/><path d="M' + w * 0.2 + " " + h * 0.14 + " H" + w * 0.8 + " L" + w + " " + h * 0.26 + " V" + h + " H0 V" + h * 0.26 + 'Z" fill="' + c.body + '"/>';
      top = h * 0.28;
    } else if (k === 5) {
      s += '<path d="M' + w * 0.12 + " " + h + " L0 " + h * 0.1 + " L" + w * 0.5 + " 0 L" + w + " " + h * 0.1 + " L" + w * 0.88 + " " + h + 'Z" fill="' + c.body + '"/>';
      top = h * 0.14; bodyX = w * 0.14; bodyW = w * 0.72;
    } else {
      s += '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="' + c.body + '"/><rect x="0" y="0" width="' + w + '" height="6" fill="' + c.shade + '"/>';
      top = 10;
    }
    if (!c.sil) s += '<rect x="' + (bodyX + bodyW * 0.62) + '" y="' + top + '" width="' + bodyW * 0.38 + '" height="' + (h - top) + '" fill="' + c.shade + '" opacity="0.55"/>';
    if (o.windows && !c.sil) {
      const cols = Math.max(2, Math.round(bodyW / 22)), cw = bodyW / cols, rh = 22;
      for (let y = top + 10; y < h - 14; y += rh) {
        for (let i = 0; i < cols; i++) {
          const r = rnd();
          if (o.lit) {
            if (r < 0.42) continue;
            s += '<rect class="wl wl' + Math.floor(rnd() * 4) + '" x="' + (bodyX + i * cw + cw * 0.22).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (cw * 0.56).toFixed(1) + '" height="11" rx="1.5" fill="' + (r > 0.9 ? "#BFE3FA" : c.win) + '"/>';
          } else {
            s += '<rect x="' + (bodyX + i * cw + cw * 0.2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (cw * 0.6).toFixed(1) + '" height="12" rx="1.5" fill="' + c.win + '" opacity="' + (c.winOp * (0.45 + r * 0.55)).toFixed(2) + '"/>';
          }
        }
      }
    }
    if (o.green && !c.sil) {
      for (let y = top + 40; y < h - 30; y += 88) s += '<rect x="-4" y="' + y + '" width="' + (w + 8) + '" height="9" rx="4" fill="#3CC6A0"/><circle cx="' + (w * 0.2) + '" cy="' + (y - 4) + '" r="10" fill="#3CC6A0"/><circle cx="' + (w * 0.74) + '" cy="' + (y - 6) + '" r="12" fill="#2FAE8C"/>';
    }
    return { w: w, h: h, svg: s };
  };

  // a strip of towers; returns art whose bottom is the ground line
  A.skyline = function (W, c, rnd, o) {
    o = Object.assign({ minH: 120, maxH: 420, minW: 50, maxW: 110, gap: 6, windows: false, lit: false }, o || {});
    let x = 0, s = "";
    const H = o.maxH;
    while (x < W) {
      const w = o.minW + rnd() * (o.maxW - o.minW), h = o.minH + Math.pow(rnd(), 1.6) * (o.maxH - o.minH);
      const t = A.tower(Math.floor(rnd() * 6), w, h, c, rnd, o);
      s += '<g transform="translate(' + x.toFixed(1) + " " + (H - h).toFixed(1) + ')">' + t.svg + "</g>";
      x += w + o.gap + rnd() * o.gap * 2;
    }
    return { w: W, h: H, svg: s };
  };

  /* ---------- nature / people / props ---------- */
  A.cloud = function (color, op) {
    const f = ' fill="' + (color || "#fff") + '"';
    return { w: 300, h: 110, svg: '<g opacity="' + (op == null ? 1 : op) + '"><ellipse cx="90" cy="74" rx="80" ry="30"' + f + '/><ellipse cx="150" cy="52" rx="66" ry="44"' + f + '/><ellipse cx="214" cy="72" rx="76" ry="32"' + f + '/><rect x="40" y="70" width="230" height="34" rx="17"' + f + "/></g>" };
  };
  A.tree = function (c1, c2, trunk) {
    return { w: 90, h: 130, svg: '<rect x="41" y="80" width="8" height="50" rx="3" fill="' + (trunk || "#6B4A3A") + '"/><circle cx="45" cy="52" r="40" fill="' + c1 + '"/><circle cx="26" cy="68" r="24" fill="' + c1 + '"/><circle cx="64" cy="66" r="26" fill="' + (c2 || c1) + '"/><circle cx="52" cy="34" r="22" fill="' + (c2 || c1) + '" opacity="0.8"/>' };
  };
  A.pine = function (c1) {
    return { w: 70, h: 140, svg: '<rect x="31" y="110" width="8" height="30" fill="#6B4A3A"/><path d="M35 0 L62 52 H8Z M35 34 L66 92 H4Z M35 70 L70 126 H0Z" fill="' + c1 + '"/>' };
  };
  // simple flat-design person; v: 0 adult, 1 adult with bag, 2 child, 3 adult with balloon
  A.person = function (body, legs, skin, v) {
    let s = '<rect x="13" y="62" width="9" height="38" rx="4" fill="' + legs + '"/><rect x="23" y="62" width="9" height="38" rx="4" fill="' + legs + '"/><rect x="9" y="24" width="27" height="46" rx="11" fill="' + body + '"/><circle cx="22.5" cy="12" r="10.5" fill="' + skin + '"/>';
    if (v === 1) s += '<rect x="32" y="44" width="14" height="18" rx="3" fill="' + legs + '"/>';
    if (v === 3) s += '<path d="M36 40 L48 -30" stroke="#fff" stroke-width="1.5"/><ellipse cx="50" cy="-48" rx="16" ry="20" fill="#F28C38"/>';
    return { w: 45, h: 100, svg: s };
  };
  A.stars = function (n, W, H, rnd) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const r = 0.8 + rnd() * 2;
      s += '<circle class="st st' + (i % 3) + '" cx="' + (rnd() * W).toFixed(1) + '" cy="' + (rnd() * H).toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#fff" opacity="' + (0.35 + rnd() * 0.6).toFixed(2) + '"/>';
    }
    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">' + s + "</svg>";
  };

  /* ---------- motion helpers ---------- */
  // "construction": the building rises out of the ground behind a moving wipe line
  A.build = function (tl, sel, t, dur, ease) {
    tl.fromTo(sel, { clipPath: "inset(100% -40% -6% -40%)" }, { clipPath: "inset(-40% -40% -6% -40%)", duration: dur || 1.2, ease: ease || "power3.out" }, t);
    tl.fromTo(sel, { y: 26 }, { y: 0, duration: dur || 1.2, ease: ease || "power3.out" }, t);
  };
  // self-drawing strokes: paths need pathLength="1"
  A.draw = function (tl, sel, t, dur, stagger, ease) {
    tl.fromTo(sel, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur || 1, ease: ease || "power2.inOut", stagger: stagger || 0 }, t);
  };
  A.fmt = function (n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  A.count = function (tl, sel, from, to, t, dur, fmt) {
    const el = typeof sel === "string" ? document.querySelector(sel) : sel, o = { v: from };
    const f = fmt || A.fmt;
    const upd = function () { el.textContent = f(o.v); };
    tl.fromTo(o, { v: from }, { v: to, duration: dur, ease: "power2.out", onUpdate: upd }, t);
    el.textContent = f(from);
  };
  // title words/letters: blur-in without sliding
  A.blurIn = function (tl, sel, t, stagger, dur) {
    tl.fromTo(sel, { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: dur || 0.3, ease: "power2.out", stagger: stagger == null ? 0.07 : stagger }, t);
  };
  A.out = function (tl, sel, t, dur) {
    tl.to(sel, { opacity: 0, filter: "blur(8px)", duration: dur || 0.22, ease: "power2.in" }, t);
  };
})();
