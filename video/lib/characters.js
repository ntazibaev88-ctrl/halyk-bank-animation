/* Character rigs. Each rig is a set of parameters drawn as a pure function of
   time, so scenes key poses and expressions and the rig does the rest.

   Human rig (Tim, Anya) — origin at the feet, ~810 px tall at s = 1.
     x, y, s, flip, lean, squash      placement and body
     headTilt, turn (-1..1), bob      head motion; turn slides the face sideways
     look [x,y] (-1..1), blink, lid   eyes; lid = resting upper lid (suspicious / sleepy)
     eyes: normal | happy | shut | dots     eyeOpen (wide/narrow), pupil (size)
     browL, browR (raise), brow (−1 angry … +1 worried)
     mouth: smile | grin | open | o | flat | frown | smirk | cringe | wavy ; mouthOpen, smile
     armL / armR [shoulder, elbow] radians (0 = hanging; + = outward / forward)
     propL / propR: function(ctx) drawn in the hand
     blush, sweat (0..1), legs: stand | walk, phase
   Brain rig — origin at its centre, ~360 px wide at s = 1.
     mood 0 (sinister: violet, glowing slit eyes, sharp grin) … 1 (friendly: pink, round eyes)
     look, open, blink, mouth: grin | smile | o | talk | smirk ; mouthOpen
     armL / armR [a1, a2], arms (0..1 visibility), glow, tilt, squash  */
(function () {
  const { TAU, clamp, lerp, PAL, shape, line, circle, ellipsePts, rgba, mix, glow, rng, hash, noise, smooth, boil } = HF;

  const TIM = {
    name: "tim", skin: PAL.skin, skinS: PAL.skinS, hair: "#261C4E", hairHi: "#4A3792",
    top: "#FFC93C", topS: "#E39A1B", topD: "#C97E10", pants: "#27316F", pantsS: "#1A2152",
    shoe: "#F4F0FF", sole: "#7B45D6", iris: "#24174F",
  };
  const ANYA = {
    name: "anya", skin: "#F7D0B0", skinS: "#E3A887", hair: "#5A2270", hairHi: "#8E46AE",
    top: "#B996FF", topS: "#8B67DE", topD: "#6E4CC0", pants: "#1E2457", pantsS: "#151A40",
    shoe: "#FFFDF6", sole: "#FFC93C", iris: "#3A1450",
  };

  const HEAD_Y = -640, NECK_Y = -470;

  function headPts() {
    return ellipsePts(0, 0, 150, 162, 26, (a) => {
      const s = Math.sin(a); // lower half narrows into a soft jaw
      return 1 - 0.1 * Math.max(0, s) * Math.max(0, s);
    });
  }
  const HEAD = headPts();

  function hairTim(ctx, p) {
    const tx = (p.turn || 0) * 14;
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const a = Math.PI * (1.02 + i / 14 * 0.96);
      pts.push([Math.cos(a) * 166 + tx * 0.5, Math.sin(a) * 178 - 6]);
    }
    const fr = [[150, -20], [128, -58], [96, -40], [76, -86], [44, -56], [14, -96], [-18, -60], [-50, -98], [-78, -58], [-112, -82], [-136, -36], [-156, -12]];
    fr.forEach(([x, y]) => pts.push([x + tx, y]));
    shape(ctx, pts, { fill: p.st.hair, shade: [p.st.hairHi, -10, -12], seed: 21, tension: 0.9 });
    // signature curl on top
    line(ctx, [[10 + tx, -168], [30 + tx, -214], [62 + tx, -222], [70 + tx, -196], [50 + tx, -184]], 13, PAL.ink, { seed: 22 });
    line(ctx, [[10 + tx, -168], [30 + tx, -214], [62 + tx, -222], [70 + tx, -196], [50 + tx, -184]], 6, p.st.hairHi, { seed: 22 });
  }
  function hairAnyaBack(ctx, p) {
    const pts = [];
    for (let i = 0; i <= 16; i++) { const a = Math.PI * (0.96 + i / 16 * 1.08); pts.push([Math.cos(a) * 178, Math.sin(a) * 182 - 4]); }
    pts.push([186, 40], [178, 118], [120, 130], [130, 40]);
    pts.unshift([-130, 40], [-120, 130], [-178, 118], [-186, 40]);
    shape(ctx, pts, { fill: p.st.hair, shade: [mix(p.st.hair, "#000000", 0.25), 14, 10], seed: 31, tension: 0.8 });
  }
  function hairAnyaFront(ctx, p) {
    const tx = (p.turn || 0) * 14;
    const pts = [];
    for (let i = 0; i <= 14; i++) { const a = Math.PI * (1.0 + i / 14); pts.push([Math.cos(a) * 168 + tx * 0.4, Math.sin(a) * 176 - 4]); }
    [[150, -30], [110, -62], [60, -54], [10, -66], [-40, -56], [-90, -66], [-140, -40], [-160, 0]].forEach(([x, y]) => pts.push([x + tx, y]));
    shape(ctx, pts, { fill: p.st.hair, shade: [p.st.hairHi, -12, -14], seed: 32, tension: 0.9 });
    // yellow clip
    ctx.save(); ctx.translate(-92 + tx, -96); ctx.rotate(-0.5);
    HF.rrect(ctx, -26, -9, 52, 18, 9); ctx.fillStyle = PAL.yellow; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.stroke();
    ctx.restore();
  }

  function eye(ctx, p, side, t) {
    const turn = p.turn || 0;
    const ex = side * 60 + turn * 40, ey = 8;
    const far = side * turn > 0 ? side * turn : 0;
    const sx = 1 - 0.28 * far;
    const open = p.eyeOpen ?? 1;
    const rx = 33 * sx, ry = 41 * open;
    const mode = p.eyes || "normal";
    ctx.save(); ctx.translate(ex, ey);
    if (mode === "happy" || mode === "shut") {
      if (mode === "happy") line(ctx, [[-rx, 8], [0, -18], [rx, 8]], 9, PAL.ink, { seed: 40 + side });
      else line(ctx, [[-side * rx, -16], [side * rx * 0.55, 0], [-side * rx, 16]], 9, PAL.ink, { seed: 44 + side, tension: 0.3 });
      ctx.restore(); return;
    }
    const blink = clamp(Math.max(p.blink || 0, p.lid || 0));
    const sclera = ellipsePts(0, 0, rx, ry, 18);
    shape(ctx, sclera, { fill: PAL.white, lw: 0, boil: 0.6, seed: 50 + side });
    ctx.save(); ctx.beginPath(); smooth(ctx, sclera, true); ctx.clip();
    const lx = (p.look?.[0] || 0) * 13 * sx, ly = (p.look?.[1] || 0) * 15;
    const pr = p.pupil ?? 1;
    if (mode === "dots") { circle(ctx, lx, ly, 8, PAL.ink); }
    else {
      circle(ctx, lx, ly, 23 * pr, p.st.iris);
      circle(ctx, lx, ly, 15 * pr, "#0A0720");
      circle(ctx, lx + 1, ly + 7 * pr, 12 * pr, rgba(PAL.violet, 0.35));
      circle(ctx, lx - 8 * pr, ly - 9 * pr, 7 * pr, PAL.white);
      circle(ctx, lx + 7 * pr, ly + 6 * pr, 3 * pr, PAL.white);
    }
    // upper lid
    if (blink > 0.01) {
      const yl = -ry + 2 * ry * blink;
      ctx.fillStyle = p.st.skinS; ctx.fillRect(-rx - 4, -ry - 4, rx * 2 + 8, yl + ry + 4);
      ctx.beginPath(); ctx.moveTo(-rx - 4, yl); ctx.quadraticCurveTo(0, yl + 6, rx + 4, yl);
      ctx.lineWidth = 7; ctx.strokeStyle = PAL.ink; ctx.stroke();
    }
    if (p.squint) {
      const yb = ry - 2 * ry * p.squint * 0.45;
      ctx.fillStyle = p.st.skin; ctx.fillRect(-rx - 4, yb, rx * 2 + 8, ry * 2);
      ctx.beginPath(); ctx.moveTo(-rx, yb + 4); ctx.quadraticCurveTo(0, yb - 8, rx, yb + 4); ctx.lineWidth = 5; ctx.strokeStyle = PAL.ink; ctx.stroke();
    }
    ctx.restore();
    ctx.beginPath(); smooth(ctx, boil(sclera, 0.6, 60 + side), true); ctx.lineWidth = 6; ctx.strokeStyle = PAL.ink; ctx.stroke();
    // lash flick (Anya) / crease
    if (p.st.name === "anya") line(ctx, [[side * rx * 0.7, -ry * 0.75], [side * (rx + 12), -ry - 6]], 6, PAL.ink, { seed: 70 + side });
    ctx.restore();
  }

  function brows(ctx, p, side) {
    const turn = p.turn || 0, ex = side * 60 + turn * 40;
    const raise = side < 0 ? p.browL ?? 0 : p.browR ?? 0;
    const b = p.brow || 0; // + worried (inner up), − angry (inner down)
    const base = -52 - raise * 18 - (p.eyeOpen ?? 1) * 10 + 10;
    const inner = [ex - side * 30, base - b * 14], outer = [ex + side * 32, base + b * 7 + 2];
    const mid = [(inner[0] + outer[0]) / 2, (inner[1] + outer[1]) / 2 - 8];
    line(ctx, [inner, mid, outer], 14, p.st.name === "anya" ? p.st.hair : PAL.ink, { seed: 80 + side });
  }

  function mouth(ctx, p, t) {
    const turn = p.turn || 0;
    ctx.save(); ctx.translate(turn * 42, 98);
    const m = p.mouth || "smile", o = clamp(p.mouthOpen ?? 0.5), sm = p.smile ?? 1;
    const ink = PAL.ink, dark = "#3B0E2E", tongue = "#FF7FA2";
    if (m === "smile") line(ctx, [[-36, -4 * sm], [0, 14 * sm], [36, -4 * sm]], 8, ink, { seed: 90 });
    else if (m === "flat") line(ctx, [[-26, 2], [0, 4], [26, 1]], 8, ink, { seed: 91 });
    else if (m === "frown") line(ctx, [[-30, 12], [0, -6], [30, 12]], 8, ink, { seed: 92 });
    else if (m === "smirk") line(ctx, [[-30, 6], [6, 10], [34, -10]], 8, ink, { seed: 93 });
    else if (m === "wavy") line(ctx, [[-34, 4], [-17, -4], [0, 4], [17, -4], [34, 4]], 7, ink, { seed: 94 });
    else if (m === "o") {
      const pts = ellipsePts(0, 4, 14 + o * 8, 16 + o * 16, 14);
      shape(ctx, pts, { fill: dark, lw: 7, seed: 95 });
    } else if (m === "open" || m === "grin") {
      const w = m === "grin" ? 48 : 40, d = 12 + o * 46;
      const top = m === "grin" ? -6 : -2;
      const pts = [[-w, top], [-w * 0.5, top + 4], [0, top + 5], [w * 0.5, top + 4], [w, top], [w * 0.7, top + d * 0.7], [0, top + d], [-w * 0.7, top + d * 0.7]];
      ctx.save(); ctx.beginPath(); smooth(ctx, boil(pts, 1, 96), true, 0.9); ctx.fillStyle = dark; ctx.fill(); ctx.clip();
      circle(ctx, 0, top + d + 6, w * 0.6, tongue);
      if (m === "grin") { ctx.fillStyle = PAL.white; ctx.fillRect(-w, top - 4, w * 2, 16); }
      ctx.restore();
      ctx.beginPath(); smooth(ctx, boil(pts, 1, 96), true, 0.9); ctx.lineWidth = 7; ctx.strokeStyle = ink; ctx.lineJoin = "round"; ctx.stroke();
    } else if (m === "cringe") {
      const w = 52, h = 20 + o * 10;
      HF.rrect(ctx, -w, -h / 2, w * 2, h, 10); ctx.fillStyle = PAL.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = ink; ctx.stroke();
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w + 6, 0); ctx.lineTo(w - 6, 0);
      for (let i = -2; i <= 2; i++) { ctx.moveTo(i * 17, -h / 2 + 2); ctx.lineTo(i * 17, h / 2 - 2); }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHead(ctx, p, t) {
    const st = p.st;
    const turn = p.turn || 0;
    if (st.name === "anya") hairAnyaBack(ctx, p);
    // ears
    [-1, 1].forEach((s) => {
      const ex = s * 146 - turn * 18;
      shape(ctx, ellipsePts(ex, 18, 26, 38, 12), { fill: st.skin, shade: [st.skinS, s * 8, 4], seed: 10 + s, lw: 6 });
    });
    shape(ctx, HEAD, { fill: st.skin, shade: [st.skinS, 22 + turn * 10, 18], rim: [rgba(PAL.lav, 0.35), -10, 0], seed: 11 });
    // blush
    const bl = p.blush ?? 0.25;
    if (bl > 0) [-1, 1].forEach((s) => { ctx.save(); ctx.globalAlpha = bl; ctx.beginPath(); ctx.ellipse(s * 88 + turn * 36, 66, 26, 14, 0, 0, TAU); ctx.fillStyle = "#FF8C9E"; ctx.fill(); ctx.restore(); });
    eye(ctx, p, -1, t); eye(ctx, p, 1, t);
    brows(ctx, p, -1); brows(ctx, p, 1);
    // nose
    line(ctx, [[turn * 46 - 4, 44], [turn * 46 + 8, 60], [turn * 46 - 6, 66]], 6, rgba(PAL.ink, 0.75), { seed: 12 });
    mouth(ctx, p, t);
    if (st.name === "anya") hairAnyaFront(ctx, p); else hairTim(ctx, p);
    if (p.sweat > 0) {
      ctx.save(); ctx.globalAlpha = clamp(p.sweat); ctx.translate(132 + turn * 10, -40 + (1 - p.sweat) * -20);
      shape(ctx, [[0, -34], [16, 0], [10, 16], [-10, 16], [-16, 0]], { fill: "#9FE3FF", lw: 5, seed: 13, tension: 1 });
      circle(ctx, -4, 2, 4, PAL.white); ctx.restore();
    }
  }

  function limb(ctx, a, b, c, w, fill, seed) {
    line(ctx, [a, b, c], w + 12, PAL.ink, { seed, tension: 0.6 });
    line(ctx, [a, b, c], w, fill, { seed, tension: 0.6 });
  }

  function arm(ctx, p, side, t) {
    const st = p.st, A = side < 0 ? p.armL || [0.12, -0.2] : p.armR || [0.12, -0.2];
    const sh = [side * 112, -432], L1 = 128, L2 = 120;
    const e = [sh[0] + side * Math.sin(A[0]) * L1, sh[1] + Math.cos(A[0]) * L1];
    const a2 = A[0] + A[1];
    const h = [e[0] + side * Math.sin(a2) * L2, e[1] + Math.cos(a2) * L2];
    limb(ctx, sh, e, h, 46, st.top, 100 + side);
    // cuff
    const cx = lerp(e[0], h[0], 0.82), cy = lerp(e[1], h[1], 0.82);
    circle(ctx, cx, cy, 25, st.topS, 6);
    const prop = side < 0 ? p.propL : p.propR;
    ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(-side * a2);
    if (prop) prop(ctx, side, a2);
    shape(ctx, ellipsePts(0, 6, 24, 26, 12), { fill: st.skin, shade: [st.skinS, 6, 6], lw: 6, seed: 105 + side });
    shape(ctx, ellipsePts(-side * 20, -4, 9, 13, 10), { fill: st.skin, lw: 5, seed: 107 + side });
    ctx.restore();
    return h;
  }

  function legs(ctx, p, t) {
    const st = p.st;
    const walk = p.legs === "walk", ph = p.phase ?? t * 6;
    [-1, 1].forEach((s) => {
      const sw = walk ? Math.sin(ph + (s > 0 ? Math.PI : 0)) * 0.38 : 0;
      const hip = [s * 52, -215];
      const knee = [hip[0] + Math.sin(sw) * 96, hip[1] + Math.cos(sw) * 96];
      const lift = walk ? Math.max(0, -Math.sin(ph + (s > 0 ? Math.PI : 0))) * 0.5 : 0;
      const ank = [knee[0] + Math.sin(sw - lift) * 92, knee[1] + Math.cos(sw - lift) * 92];
      limb(ctx, hip, knee, ank, 58, st.pants, 120 + s);
      ctx.save(); ctx.translate(ank[0], ank[1] + 10);
      shape(ctx, [[-30, -18], [24, -22], [56, -4], [58, 14], [-34, 14]].map(([x, y]) => [x * (s > 0 ? 1 : -1) * 0.92, y]), { fill: st.shoe, lw: 6, seed: 125 + s, tension: 0.7 });
      ctx.fillStyle = st.sole; ctx.fillRect(-34, 8, 92 * 0.92, 8);
      ctx.restore();
    });
  }

  function torso(ctx, p, t) {
    const st = p.st, br = Math.sin(t * 2.3 + (st.name === "anya" ? 1 : 0)) * 0.012;
    ctx.save(); ctx.translate(0, -215); ctx.scale(1 - br * 0.5, 1 + br); ctx.translate(0, 215);
    // neck
    shape(ctx, [[-30, -500], [30, -500], [34, -440], [-34, -440]], { fill: st.skinS, lw: 6, seed: 130, tension: 0.4 });
    const body = [[-118, -452], [-60, -470], [0, -472], [60, -470], [118, -452], [134, -360], [122, -206], [0, -196], [-122, -206], [-134, -360]];
    shape(ctx, body, { fill: st.top, shade: [st.topS, 26, 10], seed: 131, tension: 0.8 });
    // hem band + pocket
    line(ctx, [[-118, -232], [0, -226], [118, -232]], 6, rgba(PAL.ink, 0.6), { seed: 132 });
    if (st.name === "tim") {
      line(ctx, [[-66, -232], [-58, -304], [58, -304], [66, -232]], 6, rgba(PAL.ink, 0.55), { seed: 133 });
      // hood collar + drawstrings
      shape(ctx, [[-86, -470], [-40, -440], [0, -432], [40, -440], [86, -470], [60, -492], [0, -482], [-60, -492]], { fill: st.topD, lw: 6, seed: 134 });
      line(ctx, [[-24, -440], [-26, -380]], 7, PAL.navy2, { seed: 135 }); line(ctx, [[24, -440], [28, -376]], 7, PAL.navy2, { seed: 136 });
      circle(ctx, -26, -376, 7, PAL.white, 4); circle(ctx, 28, -372, 7, PAL.white, 4);
    } else {
      // cardigan opening + buttons
      shape(ctx, [[-50, -470], [0, -400], [50, -470]], { fill: st.skinS, lw: 6, seed: 137, closed: true });
      line(ctx, [[0, -400], [0, -206]], 6, rgba(PAL.ink, 0.6), { seed: 138 });
      [-370, -320, -270].forEach((y) => circle(ctx, 14, y, 7, PAL.yellow, 4));
    }
    ctx.restore();
  }

  function drawHuman(ctx, p, t) {
    p.st = p.st || TIM;
    ctx.save();
    ctx.translate(p.x || 0, p.y || 0);
    const sq = p.squash || 0;
    ctx.scale((p.s || 1) * (p.flip || 1) * (1 + sq * 0.5), (p.s || 1) * (1 - sq));
    ctx.rotate(p.lean || 0);
    if (p.legs !== "none") legs(ctx, p, t);
    torso(ctx, p, t);
    const hands = {};
    hands.L = arm(ctx, p, -1, t); hands.R = arm(ctx, p, 1, t);
    ctx.save();
    ctx.translate(0, NECK_Y); ctx.rotate(p.headTilt || 0); ctx.translate(0, HEAD_Y - NECK_Y + (p.bob || 0) + Math.sin(t * 2.3) * 3);
    drawHead(ctx, p, t);
    ctx.restore();
    ctx.restore();
    return hands;
  }
  /* Head only, centred on the head; for close-ups and the bed scene. */
  function drawFace(ctx, p, t) {
    p.st = p.st || TIM;
    ctx.save(); ctx.translate(p.x || 0, p.y || 0); ctx.scale((p.s || 1) * (p.flip || 1), p.s || 1); ctx.rotate(p.headTilt || 0);
    drawHead(ctx, p, t); ctx.restore();
  }
  /* World position of a body point (for strings, props) given rig placement. */
  function bodyPoint(p, lx, ly) { const s = p.s || 1; return [(p.x || 0) + lx * s * (p.flip || 1), (p.y || 0) + ly * s]; }

  /* ---------------- Brain ---------------- */
  const R0 = rng(777);
  const GYRI = [];
  // folds: short curly arcs scattered over each hemisphere
  for (let h = -1; h <= 1; h += 2) {
    const spots = [[0.30, -0.55], [0.62, -0.38], [0.22, -0.12], [0.55, 0.0], [0.80, -0.05], [0.35, 0.28], [0.68, 0.32]];
    spots.forEach(([fx, fy], k) => {
      const cx = h * fx * 165, cy = fy * 130, r = 22 + R0() * 14, a0 = R0() * TAU, sw = Math.PI * (1.1 + R0() * 0.6);
      const pts = [];
      for (let j = 0; j <= 6; j++) { const a = a0 + (sw * j) / 6, rr = r * (1 - j * 0.07); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8]); }
      GYRI.push(pts);
    });
  }
  const BRAIN_OUT = ellipsePts(0, 0, 186, 140, 44, (a) => (1 + 0.045 * Math.sin(7 * a + 0.5) + 0.02 * Math.sin(13 * a + 1)) * (Math.sin(a) > 0 ? 1 - 0.12 * Math.sin(a) * Math.sin(a) : 1));

  function drawBrain(ctx, b, t) {
    const m = clamp(b.mood ?? 0);
    const base = mix("#7A3FD6", "#FF9CC6", m), dark = mix("#41188E", "#E0679E", m), hi = mix("#B48CFF", "#FFD3E6", m), gy = mix("#2D0F6E", "#C04880", m);
    const bob = Math.sin(t * 2.1 + (b.seed || 0)) * 10;
    ctx.save(); ctx.translate(b.x || 0, (b.y || 0) + (b.still ? 0 : bob));
    const sq = b.squash || 0;
    ctx.scale((b.s || 1) * (1 + sq * 0.5), (b.s || 1) * (1 - sq)); ctx.rotate(b.tilt || 0);
    if ((b.glow ?? 0.6) > 0) glow(ctx, 0, 0, 420, m < 0.5 ? PAL.violet : PAL.yellow, (b.glow ?? 0.6) * (0.55 + 0.1 * Math.sin(t * 3)));
    // arms behind the body
    const arms = b.arms ?? 1;
    const hands = {};
    if (arms > 0) {
      [-1, 1].forEach((s) => {
        const A = (s < 0 ? b.armL : b.armR) || [0.35, 0.9];
        const sh = [s * 160, 40];
        const L = (b.armLen || 95) * arms;
        const e = [sh[0] + s * Math.sin(A[0]) * L, sh[1] + Math.cos(A[0]) * L];
        const h = [e[0] + s * Math.sin(A[0] + A[1]) * L * 0.9, e[1] + Math.cos(A[0] + A[1]) * L * 0.9];
        line(ctx, [sh, e, h], 26, PAL.ink, { seed: 200 + s, tension: 0.8 });
        line(ctx, [sh, e, h], 13, dark, { seed: 200 + s, tension: 0.8 });
        shape(ctx, ellipsePts(h[0], h[1], 22, 20, 10), { fill: PAL.white, lw: 6, seed: 203 + s });
        hands[s < 0 ? "L" : "R"] = h;
      });
    }
    shape(ctx, BRAIN_OUT, { fill: base, shade: [dark, 22, 24], rim: [hi, -14, -16], seed: 210, tension: 1, lw: 8 });
    // fissure + gyri
    line(ctx, [[0, -134], [-8, -100], [6, -66], [-6, -36], [0, -10]], 8, gy, { seed: 211 });
    GYRI.forEach((g, i) => line(ctx, g, 8, rgba(gy, 0.8), { seed: 220 + i }));
    
    // face
    const open = clamp(1 - Math.max(b.blink || 0, 1 - (b.open ?? 1)));
    const lx = (b.look?.[0] || 0) * 12, ly = (b.look?.[1] || 0) * 10;
    [-1, 1].forEach((s) => {
      ctx.save(); ctx.translate(s * 64, 18);
      if (m < 0.5) {
        // sinister almond eyes, glowing
        ctx.save(); ctx.shadowColor = PAL.yellow; ctx.shadowBlur = 30 * (b.eyeGlow ?? 1);
        const h = 26 * open;
        ctx.beginPath(); ctx.moveTo(-40 * s, -8); ctx.quadraticCurveTo(0, -h - 14, 40 * s, 10); ctx.quadraticCurveTo(0, h + 6, -40 * s, -8);
        ctx.fillStyle = "#FFD445"; ctx.fill(); ctx.restore();
        ctx.lineWidth = 6; ctx.strokeStyle = PAL.ink; ctx.stroke();
        if (open > 0.15) { ctx.save(); ctx.clip(); HF.rrect(ctx, lx - 5, ly - 26, 10, 52, 5); ctx.fillStyle = PAL.ink; ctx.fill(); ctx.restore(); }
        line(ctx, [[-46 * s, -36], [6 * s, -24], [40 * s, -6]], 11, PAL.ink, { seed: 230 + s });
      } else {
        const r = 36, ry = r * open;
        shape(ctx, ellipsePts(0, 0, r, Math.max(2, ry), 16), { fill: PAL.white, lw: 6, seed: 240 + s, boil: 0.6 });
        if (open > 0.2) {
          ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, r, ry, 0, 0, TAU); ctx.clip();
          circle(ctx, lx, ly + 2, 20, "#2A0E3A"); circle(ctx, lx - 7, ly - 6, 7, PAL.white); circle(ctx, lx + 6, ly + 8, 3, PAL.white);
          ctx.restore();
        }
        ctx.save(); ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(s * 52, 46, 20, 11, 0, 0, TAU); ctx.fillStyle = "#FF6F98"; ctx.fill(); ctx.restore();
      }
      ctx.restore();
    });
    // mouth
    ctx.save(); ctx.translate(0, 78);
    const mo = b.mouth || (m < 0.5 ? "grin" : "smile"), o = clamp(b.mouthOpen ?? 0.5);
    if (mo === "grin") {
      const w = 74, d = 22 + o * 26;
      ctx.beginPath(); ctx.moveTo(-w, -14); ctx.quadraticCurveTo(0, 6, w, -14); ctx.quadraticCurveTo(0, d + 10, -w, -14);
      ctx.fillStyle = "#1A0630"; ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = PAL.white;
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 20 - 10, -12); ctx.lineTo(i * 20 + 10, -12); ctx.lineTo(i * 20, 6); ctx.fill(); }
      ctx.restore();
      ctx.beginPath(); ctx.moveTo(-w, -14); ctx.quadraticCurveTo(0, 6, w, -14); ctx.quadraticCurveTo(0, d + 10, -w, -14);
      ctx.lineWidth = 7; ctx.strokeStyle = PAL.ink; ctx.stroke();
    } else if (mo === "smile") {
      const d = 10 + o * 30;
      ctx.beginPath(); ctx.moveTo(-40, -6); ctx.quadraticCurveTo(0, d * 1.6, 40, -6); ctx.closePath();
      ctx.fillStyle = "#4A0F2E"; ctx.fill(); ctx.save(); ctx.clip(); circle(ctx, 0, d + 6, 22, "#FF7FA2"); ctx.restore();
      ctx.lineWidth = 7; ctx.strokeStyle = PAL.ink; ctx.stroke();
    } else if (mo === "o" || mo === "talk") {
      const oo = mo === "talk" ? o : 0.6;
      shape(ctx, ellipsePts(0, 0, 16 + oo * 10, 6 + oo * 24, 14), { fill: "#2A0A30", lw: 7, seed: 250 });
    } else if (mo === "smirk") {
      line(ctx, [[-44, 0], [10, 12], [52, -16]], 9, PAL.ink, { seed: 251 });
    }
    ctx.restore();
    ctx.restore();
    // hands in world space for strings
    const s = b.s || 1, y0 = (b.y || 0) + (b.still ? 0 : bob);
    return { L: hands.L && [(b.x || 0) + hands.L[0] * s, y0 + hands.L[1] * s], R: hands.R && [(b.x || 0) + hands.R[0] * s, y0 + hands.R[1] * s] };
  }

  /* Glowing puppet string between two points, with a slight sag and sway. */
  function string(ctx, a, b, t, alpha = 1, seed = 0) {
    if (alpha <= 0) return;
    const mx = (a[0] + b[0]) / 2 + Math.sin(t * 2 + seed) * 18, my = (a[1] + b[1]) / 2 + 40;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.shadowColor = PAL.yellow; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(mx, my, b[0], b[1]);
    ctx.lineWidth = 5; ctx.strokeStyle = "#FFE08A"; ctx.stroke(); ctx.restore();
  }

  window.CHAR = { TIM, ANYA, drawHuman, drawFace, drawBrain, string, bodyPoint };
})();
