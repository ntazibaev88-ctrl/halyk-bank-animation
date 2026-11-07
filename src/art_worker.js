// Recurring character: young Kazakh industrial worker. Origin = between the feet. Height ≈ 585 units.
const SKIN = '#d9a47a', SKIN_SH = '#bf8a62', HAIR = '#17110d';
const NAVY_U = '#1f4688', NAVY_U2 = '#183a73', NAVY_U3 = '#122d5b';

function armSVG(p, side, gloveColor) {
  // side: -1 left (viewer), 1 right. Arm drawn hanging down from pivot.
  return `
  <g data-k="${p}arm${side < 0 ? 'L' : 'R'}">
    <g data-k="${p}u${side < 0 ? 'L' : 'R'}">
      <rect x="-23" y="-8" width="46" height="128" rx="22" fill="${NAVY_U}"/>
      <rect x="${side < 0 ? -23 : 9}" y="0" width="14" height="112" rx="7" fill="${NAVY_U2}"/>
      <g data-k="${p}cU${side < 0 ? 'L' : 'R'}"><rect x="-23" y="-8" width="46" height="66" rx="22" fill="#e9edf2"/><rect x="-19" y="50" width="38" height="70" rx="17" fill="${SKIN}"/></g>
    </g>
    <g data-k="${p}f${side < 0 ? 'L' : 'R'}" transform="translate(0 110)">
      <rect x="-21" y="-10" width="42" height="112" rx="20" fill="${NAVY_U}"/>
      <rect x="-21" y="44" width="42" height="17" fill="#ff8a1f"/><rect x="-21" y="49" width="42" height="7" fill="#e3eaf2"/>
      <g data-k="${p}cF${side < 0 ? 'L' : 'R'}"><rect x="-19" y="-10" width="38" height="112" rx="17" fill="${SKIN}"/></g>
      <g data-k="${p}prop${side < 0 ? 'L' : 'R'}"></g>
      <g data-k="${p}hand${side < 0 ? 'L' : 'R'}" transform="translate(0 112)">
        <g data-k="${p}glove${side < 0 ? 'L' : 'R'}">
          <rect x="-24" y="-18" width="48" height="16" rx="5" fill="#2b2f36"/>
          <path d="M-22 -4 Q-26 26 -8 34 Q10 38 20 26 Q26 10 22 -4 Z" fill="${gloveColor}"/>
          <path d="M-22 -4 Q-26 18 -14 30 L-8 -4Z" fill="#000" opacity="0.12"/>
          <path data-k="${p}thumb${side < 0 ? 'L' : 'R'}" d="M${side * 14} 6 Q${side * 34} 0 ${side * 30} -22 Q${side * 26} -30 ${side * 18} -24 L${side * 12} 2Z" fill="${gloveColor}" opacity="0"/>
        </g>
        <g data-k="${p}bare${side < 0 ? 'L' : 'R'}">
          <path d="M-19 -6 Q-24 24 -6 32 Q10 36 18 24 Q23 10 19 -6 Z" fill="${SKIN}"/>
        </g>
      </g>
    </g>
  </g>`;
}

function workerSVG(p = 'w', o = {}) {
  const helm = o.helmet || '#f5f7fa', helmSh = o.helmetSh || '#cdd6e2';
  const glove = o.glove || '#f08a24';
  return `
<g data-k="${p}root">
  <ellipse cx="0" cy="2" rx="125" ry="20" fill="#000" opacity="0.32"/>
  <g data-k="${p}body">
    <!-- legs -->
    <g data-k="${p}legs">
      <g data-k="${p}legL"><rect x="-64" y="-268" width="60" height="238" rx="16" fill="${NAVY_U}"/><rect x="-20" y="-262" width="16" height="230" rx="8" fill="${NAVY_U2}"/>
        <rect x="-64" y="-132" width="60" height="19" fill="#ff8a1f"/><rect x="-64" y="-126" width="60" height="7" fill="#e3eaf2"/></g>
      <g data-k="${p}legR"><rect x="4" y="-268" width="60" height="238" rx="16" fill="${NAVY_U}"/><rect x="48" y="-262" width="16" height="230" rx="8" fill="${NAVY_U2}"/>
        <rect x="4" y="-132" width="60" height="19" fill="#ff8a1f"/><rect x="4" y="-126" width="60" height="7" fill="#e3eaf2"/></g>
      <g data-k="${p}cLegs"><rect x="-64" y="-268" width="60" height="238" rx="16" fill="#3c4a63"/><rect x="4" y="-268" width="60" height="238" rx="16" fill="#3c4a63"/>
        <rect x="-20" y="-262" width="16" height="230" rx="8" fill="#323e54"/><rect x="48" y="-262" width="16" height="230" rx="8" fill="#323e54"/></g>
    </g>
    <!-- footwear -->
    <g data-k="${p}boots">
      <path d="M-70 -2 L-68 -40 Q-67 -50 -56 -50 L-12 -50 Q-2 -50 -2 -38 L0 -2 Z" fill="#2a2420"/>
      <path d="M70 -2 L68 -40 Q67 -50 56 -50 L12 -50 Q2 -50 2 -38 L0 -2 Z" fill="#2a2420"/>
      <rect x="-72" y="-10" width="72" height="10" rx="4" fill="#111"/><rect x="0" y="-10" width="72" height="10" rx="4" fill="#111"/>
      <rect x="-72" y="-14" width="72" height="4" fill="#ff8a1f"/><rect x="0" y="-14" width="72" height="4" fill="#ff8a1f"/>
      <path d="M-64 -40 Q-50 -48 -36 -40" stroke="#5b4e46" stroke-width="4" fill="none"/><path d="M64 -40 Q50 -48 36 -40" stroke="#5b4e46" stroke-width="4" fill="none"/>
    </g>
    <g data-k="${p}shoes">
      <path d="M-68 -2 L-66 -34 Q-64 -42 -54 -42 L-12 -42 Q-3 -42 -3 -32 L-1 -2 Z" fill="#eef1f5"/>
      <path d="M68 -2 L66 -34 Q64 -42 54 -42 L12 -42 Q3 -42 3 -32 L1 -2 Z" fill="#eef1f5"/>
      <rect x="-70" y="-9" width="69" height="9" rx="4" fill="#9aa5b5"/><rect x="1" y="-9" width="69" height="9" rx="4" fill="#9aa5b5"/>
    </g>
    <!-- torso -->
    <g data-k="${p}torso">
      <path d="M-84 -398 Q-86 -412 -70 -418 L-30 -430 L30 -430 L70 -418 Q86 -412 84 -398 L76 -262 Q74 -248 60 -248 L-60 -248 Q-74 -248 -76 -262 Z" fill="${NAVY_U}"/>
      <path d="M40 -426 L70 -418 Q86 -412 84 -398 L76 -262 Q74 -248 60 -248 L46 -248 Z" fill="${NAVY_U2}"/>
      <rect x="-80" y="-352" width="160" height="24" fill="#ff8a1f"/><rect x="-80" y="-344" width="160" height="8" fill="#e3eaf2"/>
      <path d="M-30 -430 L0 -392 L30 -430 L18 -432 L0 -408 L-18 -432Z" fill="#2c62b8"/>
      <line x1="0" y1="-396" x2="0" y2="-262" stroke="${NAVY_U3}" stroke-width="4"/>
      <rect x="20" y="-396" width="40" height="34" rx="5" fill="${NAVY_U2}"/>
      <rect x="-60" y="-398" width="34" height="34" rx="17" fill="#ff8a1f"/>
      <path d="M-40 -392 L-50 -380 L-43 -380 L-47 -369 L-36 -383 L-43 -383 L-38 -392Z" fill="#fff"/>
      <rect x="-76" y="-272" width="152" height="20" rx="4" fill="${NAVY_U3}"/><rect x="-12" y="-274" width="24" height="24" rx="4" fill="#b9c3d1"/>
      <g data-k="${p}cTorso">
        <path d="M-84 -398 Q-86 -412 -70 -418 L-30 -430 L30 -430 L70 -418 Q86 -412 84 -398 L76 -262 Q74 -248 60 -248 L-60 -248 Q-74 -248 -76 -262 Z" fill="#e9edf2"/>
        <path d="M40 -426 L70 -418 Q86 -412 84 -398 L76 -262 Q74 -248 60 -248 L46 -248 Z" fill="#cfd6df"/>
        <path d="M-26 -430 Q0 -404 26 -430" fill="${SKIN_SH}"/>
      </g>
    </g>
    <!-- arms -->
    <g transform="translate(-80 -404)"><g data-k="${p}armLpivot">${armSVG(p, -1, glove)}</g></g>
    <g transform="translate(80 -404)"><g data-k="${p}armRpivot">${armSVG(p, 1, glove)}</g></g>
    <!-- head -->
    <g transform="translate(0 -432)"><g data-k="${p}head">
      <rect x="-17" y="-18" width="34" height="26" fill="${SKIN_SH}"/>
      <ellipse cx="-47" cy="-58" rx="10" ry="15" fill="${SKIN_SH}"/><ellipse cx="47" cy="-58" rx="10" ry="15" fill="${SKIN_SH}"/>
      <path d="M-46 -72 Q-48 -16 0 -4 Q48 -16 46 -72 Q46 -118 0 -120 Q-46 -118 -46 -72Z" fill="${SKIN}"/>
      <path d="M20 -116 Q46 -110 46 -72 Q46 -26 18 -8 Q34 -40 30 -80 Q28 -104 20 -116Z" fill="${SKIN_SH}" opacity="0.55"/>
      <path d="M-48 -70 Q-50 -96 -40 -106 L-42 -76 Z M48 -70 Q50 -96 40 -106 L42 -76 Z" fill="${HAIR}"/>
      <g data-k="${p}hair"><path d="M-50 -66 Q-58 -132 0 -134 Q56 -132 50 -66 Q46 -98 30 -104 Q8 -96 -16 -106 Q-40 -100 -50 -66Z" fill="${HAIR}"/></g>
      <path d="M-34 -84 Q-20 -92 -7 -84" stroke="${HAIR}" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M34 -84 Q20 -92 7 -84" stroke="${HAIR}" stroke-width="7" stroke-linecap="round" fill="none"/>
      <g data-k="${p}eyes">
        <path d="M-32 -66 Q-19 -76 -6 -66 Q-19 -59 -32 -66Z" fill="#fff"/><path d="M32 -66 Q19 -76 6 -66 Q19 -59 32 -66Z" fill="#fff"/>
        <g data-k="${p}pupils"><circle cx="-19" cy="-66" r="6.5" fill="#2a1a10"/><circle cx="19" cy="-66" r="6.5" fill="#2a1a10"/>
          <circle cx="-17" cy="-68" r="2" fill="#fff"/><circle cx="21" cy="-68" r="2" fill="#fff"/></g>
        <path d="M-33 -66 Q-19 -77 -5 -67" stroke="${HAIR}" stroke-width="3" fill="none"/><path d="M33 -66 Q19 -77 5 -67" stroke="${HAIR}" stroke-width="3" fill="none"/>
      </g>
      <g data-k="${p}lids" opacity="0"><path d="M-33 -66 Q-19 -62 -5 -66" stroke="${HAIR}" stroke-width="4" fill="none"/><path d="M33 -66 Q19 -62 5 -66" stroke="${HAIR}" stroke-width="4" fill="none"/>
        <path d="M-33 -67 Q-19 -76 -5 -67 Q-19 -64 -33 -67Z M33 -67 Q19 -76 5 -67 Q19 -64 33 -67Z" fill="${SKIN}"/></g>
      <path d="M-1 -64 Q-6 -42 -2 -38 Q4 -36 9 -40" stroke="${SKIN_SH}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="-28" cy="-44" rx="10" ry="6" fill="#e0866e" opacity="0.28"/><ellipse cx="28" cy="-44" rx="10" ry="6" fill="#e0866e" opacity="0.28"/>
      <path data-k="${p}smile" d="M-16 -26 Q0 -15 16 -26" stroke="#7d3424" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <ellipse data-k="${p}mouth" cx="0" cy="-24" rx="11" ry="7" fill="#6b2318" opacity="0"/>
      <g data-k="${p}glasses">
        <path d="M-42 -80 L42 -80 Q46 -80 45 -74 L41 -58 Q39 -52 32 -52 L10 -52 Q4 -52 2 -58 L0 -62 L-2 -58 Q-4 -52 -10 -52 L-32 -52 Q-39 -52 -41 -58 L-45 -74 Q-46 -80 -42 -80Z"
          fill="#8fd0ff" fill-opacity="0.32" stroke="#1d2b42" stroke-width="3.5"/>
        <path d="M-34 -76 L-24 -76 L-34 -58Z M14 -76 L22 -76 L12 -58Z" fill="#fff" opacity="0.55"/>
        <path d="M-45 -76 L-52 -72 M45 -76 L52 -72" stroke="#1d2b42" stroke-width="3.5"/>
      </g>
      <g data-k="${p}helmet">
        <path d="M-60 -92 Q-62 -166 0 -168 Q62 -166 60 -92 Z" fill="${helm}"/>
        <path d="M22 -164 Q60 -150 60 -92 L42 -92 Q42 -146 22 -164Z" fill="${helmSh}"/>
        <path d="M-10 -167 Q0 -170 10 -167 L12 -94 L-12 -94Z" fill="#fff" opacity="0.5"/>
        <path d="M-70 -92 Q0 -108 72 -92 Q78 -82 68 -80 Q0 -94 -66 -80 Q-78 -82 -70 -92Z" fill="${helmSh}"/>
        <circle cx="-30" cy="-120" r="13" fill="#1f5fbf"/><path d="M-28 -130 L-36 -118 L-30 -118 L-33 -110 L-24 -122 L-30 -122 L-26 -130Z" fill="#fff"/>
        <path d="M-50 -140 Q-40 -158 -20 -162" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8"/>
      </g>
    </g></g>
  </g>
</g>`;
}

class Worker {
  constructor(parent, p = 'w', o = {}) {
    this.p = p;
    const g = svgFrag(workerSVG(p, o));
    parent.appendChild(g);
    const r = refs(g);
    const k = n => r[p + n];
    this.r = { root: k('root'), body: k('body'), head: k('head'), armL: k('armLpivot'), armR: k('armRpivot'), uL: k('uL'), uR: k('uR'),
      fL: k('fL'), fR: k('fR'), legL: k('legL'), legR: k('legR'), helmet: k('helmet'), glasses: k('glasses'), hair: k('hair'),
      gloveL: k('gloveL'), gloveR: k('gloveR'), bareL: k('bareL'), bareR: k('bareR'), thumbL: k('thumbL'), thumbR: k('thumbR'),
      boots: k('boots'), shoes: k('shoes'), cTorso: k('cTorso'), cLegs: k('cLegs'), cUL: k('cUL'), cUR: k('cUR'), cFL: k('cFL'), cFR: k('cFR'),
      lids: k('lids'), pupils: k('pupils'), mouth: k('mouth'), smile: k('smile'), propL: k('propL'), propR: k('propR') };
    this.set({});
  }
  // attach svg markup to a hand (drawn relative to hand position, hand at y≈112 of forearm)
  prop(side, markup) { const g = side === 'L' ? this.r.propL : this.r.propR; g.innerHTML = markup; return refs(g); }
  set(o) {
    const r = this.r;
    const s = o.s || 1;
    T(r.root, o.x || 0, o.y || 0, [s * (o.flip ? -1 : 1), s], 0, o.o === undefined ? 1 : o.o);
    T(r.body, 0, o.bob || 0, 1, o.lean || 0);
    T(r.head, 0, 0, 1, o.tilt || 0);
    const aL = o.aL || [10, 0], aR = o.aR || [-10, 0];
    T(r.armL, 0, 0, 1, aL[0]); T(r.fL, 0, 110, 1, aL[1]);
    T(r.armR, 0, 0, 1, aR[0]); T(r.fR, 0, 110, 1, aR[1]);
    T(r.legL, 0, -(o.stepL || 0), 1); T(r.legR, 0, -(o.stepR || 0), 1);
    const u = o.uniform === undefined ? 1 : o.uniform;
    [r.cTorso, r.cLegs, r.cUL, r.cUR, r.cFL, r.cFR].forEach(e => O(e, 1 - u));
    const hel = o.helmet === undefined ? 1 : o.helmet;
    T(r.helmet, 0, (1 - hel) * -260, 1, (1 - hel) * -12, hel > 0 ? Math.min(1, hel * 3) : 0);
    O(r.hair, hel >= 0.98 ? 0 : 1);
    const gl = o.glasses || 0;
    T(r.glasses, 0, (1 - gl) * -40, 1, 0, gl);
    const gv = o.gloves === undefined ? 1 : o.gloves;
    O(r.gloveL, gv); O(r.gloveR, gv); O(r.bareL, gv >= 0.98 ? 0 : 1); O(r.bareR, gv >= 0.98 ? 0 : 1);
    O(r.thumbL, o.thumbL ? 1 : 0); O(r.thumbR, o.thumbR ? 1 : 0);
    const bt = o.boots === undefined ? 1 : o.boots;
    O(r.boots, bt); O(r.shoes, bt >= 0.98 ? 0 : 1);
    O(r.lids, o.blink || 0);
    T(r.pupils, o.look || 0, o.lookY || 0, 1);
    O(r.mouth, o.mouth || 0); O(r.smile, 1 - (o.mouth || 0));
    if (o.mouth) T(r.mouth, 0, -24 * 0, [1, 0.4 + 0.6 * o.mouth]);
  }
}
// natural blink: returns 0..1 for time t
const blinkAt = (t, seed = 0) => { const p = (t + seed) % 3.7; return p > 3.55 ? 1 : 0; };
// talking mouth while voice segment plays
const talk = (t, segs) => { for (const s of segs) if (t > s.s && t < s.e) return 0.35 + 0.65 * Math.abs(Math.sin(t * 17 + Math.sin(t * 7))); return 0; };

// Side-view walking silhouette (same palette) for wide shots. Faces right. Origin at feet.
function walkerSVG(p = 'wk') {
  const leg = (k) => `<g data-k="${p}${k}" ><rect x="-22" y="0" width="44" height="235" rx="18" fill="${k === 'legB' ? NAVY_U3 : NAVY_U}"/>
      <rect x="-22" y="128" width="44" height="16" fill="#ff8a1f" opacity="${k === 'legB' ? 0.6 : 1}"/>
      <path d="M-26 222 L-24 248 L48 248 Q52 232 30 226 L22 214Z" fill="#221d1a"/><rect x="-26" y="242" width="76" height="8" fill="#ff8a1f" opacity="0.85"/></g>`;
  const arm = (k) => `<g data-k="${p}${k}"><rect x="-19" y="-6" width="38" height="118" rx="18" fill="${k === 'armB' ? NAVY_U3 : NAVY_U}"/>
      <g data-k="${p}${k}f" transform="translate(0 104)"><rect x="-17" y="-6" width="34" height="100" rx="16" fill="${k === 'armB' ? NAVY_U3 : NAVY_U}"/>
      <rect x="-17" y="40" width="34" height="13" fill="#ff8a1f" opacity="${k === 'armB' ? 0.6 : 1}"/><circle cx="2" cy="104" r="20" fill="#f08a24"/></g></g>`;
  return `<g data-k="${p}root"><ellipse cx="0" cy="2" rx="90" ry="14" fill="#000" opacity="0.35"/>
   <g data-k="${p}body">
    <g transform="translate(0 -250)">${leg('legB')}</g>
    <g transform="translate(0 -410)">${arm('armB')}</g>
    <path d="M-48 -420 Q-52 -436 -30 -440 L28 -440 Q50 -436 48 -416 L44 -262 Q44 -246 28 -246 L-30 -246 Q-46 -246 -46 -262Z" fill="${NAVY_U}"/>
    <rect x="-48" y="-356" width="96" height="22" fill="#ff8a1f"/><rect x="-48" y="-349" width="96" height="8" fill="#e3eaf2"/>
    <rect x="-46" y="-272" width="92" height="18" fill="${NAVY_U3}"/>
    <g transform="translate(0 -440)"><g data-k="${p}head">
      <rect x="-14" y="-16" width="30" height="24" fill="${SKIN_SH}"/>
      <path d="M-40 -60 Q-42 -120 6 -118 Q46 -116 46 -70 L54 -54 L46 -48 Q48 -20 26 -10 Q-4 -2 -24 -14 Q-42 -28 -40 -60Z" fill="${SKIN}"/>
      <ellipse cx="-6" cy="-62" rx="10" ry="14" fill="${SKIN_SH}"/>
      <path d="M26 -78 Q34 -84 42 -78" stroke="${HAIR}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="35" cy="-68" r="4.5" fill="#2a1a10"/>
      <path d="M-46 -84 Q-46 -158 12 -156 Q62 -152 58 -84Z" fill="#f5f7fa"/>
      <path d="M-50 -86 L78 -86 Q82 -78 72 -76 L-48 -78Z" fill="#cdd6e2"/>
      <path d="M-30 -130 Q-14 -150 14 -152" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
    </g></g>
    <g transform="translate(0 -250)">${leg('legF')}</g>
    <g transform="translate(0 -410)">${arm('armF')}</g>
   </g></g>`;
}
class Walker {
  constructor(parent, p = 'wk') { const g = svgFrag(walkerSVG(p)); parent.appendChild(g); const r = refs(g); this.r = {};
    ['root', 'body', 'head', 'legB', 'legF', 'armB', 'armF', 'armBf', 'armFf'].forEach(k => this.r[k] = r[p + k]); }
  set(o) {
    const r = this.r, ph = (o.phase || 0) * Math.PI * 2, amp = o.amp === undefined ? 1 : o.amp;
    T(r.root, o.x || 0, o.y || 0, [o.s || 1, o.s || 1], 0, o.o === undefined ? 1 : o.o);
    T(r.body, 0, -Math.abs(Math.sin(ph)) * 10 * amp, 1);
    T(r.legF, 0, 0, 1, Math.sin(ph) * 26 * amp); T(r.legB, 0, 0, 1, -Math.sin(ph) * 26 * amp);
    T(r.armF, 0, 0, 1, -Math.sin(ph) * 24 * amp); T(r.armB, 0, 0, 1, Math.sin(ph) * 24 * amp);
    T(r.armFf, 0, 104, 1, -18 - Math.max(0, -Math.sin(ph)) * 20 * amp); T(r.armBf, 0, 104, 1, -18 - Math.max(0, Math.sin(ph)) * 20 * amp);
    T(r.head, 0, 0, 1, o.tilt || 0);
  }
}
