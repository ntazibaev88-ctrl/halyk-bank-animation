/* Props and icons drawn in the same ink-outline style as the characters.
   Each draws centred on (0,0) in the current transform. */
(function () {
  const { TAU, PAL, shape, line, circle, rrect, ellipsePts, rgba, text, glow, clamp, lerp } = HF;
  const ink = PAL.ink;

  function phone(ctx, o = {}) {
    const g = o.glow ?? 1;
    rrect(ctx, -34, -62, 68, 124, 14); ctx.fillStyle = PAL.navy2; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = ink; ctx.stroke();
    rrect(ctx, -26, -50, 52, 98, 8); ctx.fillStyle = HF.mix(PAL.navy2, "#8FE3FF", 0.25 + 0.6 * g); ctx.fill();
    if (o.notif) { circle(ctx, 22, -50, 13, "#FF4F7B", 5); }
    ctx.fillStyle = rgba(PAL.white, 0.8); [-28, -10, 8].forEach((y, i) => { rrect(ctx, -18, y, 36 - i * 8, 9, 4); ctx.fill(); });
  }
  function burger(ctx) {
    shape(ctx, [[-60, -6], [-50, -40], [0, -58], [50, -40], [60, -6]], { fill: "#F2A541", shade: ["#D9822B", 10, 8], seed: 301, tension: 0.8 });
    [[-34, -32], [-6, -42], [22, -34]].forEach(([x, y]) => circle(ctx, x, y, 3.5, PAL.cream));
    shape(ctx, [[-66, -6], [66, -6], [56, 6], [30, 2], [0, 8], [-30, 2], [-56, 6]], { fill: "#6FD06B", lw: 5, seed: 302 });
    rrect(ctx, -60, 4, 120, 22, 10); ctx.fillStyle = "#7A3B1E"; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = ink; ctx.stroke();
    shape(ctx, [[-60, 26], [60, 26], [54, 44], [-54, 44]], { fill: "#F2A541", lw: 6, seed: 303, tension: 0.5 });
  }
  function salad(ctx) {
    shape(ctx, [[-60, 0], [60, 0], [40, 46], [-40, 46]], { fill: PAL.cream, lw: 6, seed: 311, tension: 0.6 });
    [[-34, -8, "#5CC46B"], [0, -18, "#7EDB6E"], [32, -8, "#4FB060"], [-12, -2, "#FF6F61"], [18, -4, "#FFC93C"]].forEach(([x, y, c], i) =>
      shape(ctx, ellipsePts(x, y, 22, 16, 10), { fill: c, lw: 5, seed: 312 + i }));
  }
  function coffee(ctx) {
    shape(ctx, [[-36, -40], [36, -40], [30, 40], [-30, 40]], { fill: PAL.cream, shade: ["#E6D6B5", 10, 0], seed: 321, tension: 0.4 });
    rrect(ctx, -40, -50, 80, 16, 8); ctx.fillStyle = PAL.violet; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = ink; ctx.stroke();
    rrect(ctx, -33, -6, 66, 22, 4); ctx.fillStyle = PAL.yellow; ctx.fill();
  }
  function shirt(ctx, c = PAL.violet) {
    shape(ctx, [[-30, -46], [-62, -26], [-50, 0], [-36, -8], [-34, 46], [34, 46], [36, -8], [50, 0], [62, -26], [30, -46], [0, -34]], { fill: c, lw: 6, seed: 331, tension: 0.4 });
  }
  /* Rounded card with an icon slot. */
  function card(ctx, w, h, o = {}) {
    ctx.save(); ctx.shadowColor = rgba("#000000", 0.35); ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
    rrect(ctx, -w / 2, -h / 2, w, h, o.r ?? 28); ctx.fillStyle = o.fill || PAL.cream; ctx.fill(); ctx.restore();
    rrect(ctx, -w / 2, -h / 2, w, h, o.r ?? 28); ctx.lineWidth = 6; ctx.strokeStyle = o.stroke || ink; ctx.stroke();
  }
  /* Speech bubble with tail toward (tx, ty) relative to centre. */
  function bubble(ctx, w, h, tx, ty, o = {}) {
    const r = o.r ?? 40;
    ctx.save();
    ctx.beginPath();
    rrect(ctx, -w / 2, -h / 2, w, h, r);
    ctx.fillStyle = o.fill || PAL.white; ctx.fill();
    const bx = clamp(tx * 0.35, -w / 2 + r, w / 2 - r), by = ty > 0 ? h / 2 - 4 : -h / 2 + 4;
    ctx.beginPath(); ctx.moveTo(bx - 26, by); ctx.lineTo(tx, ty); ctx.lineTo(bx + 26, by); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 7; ctx.strokeStyle = o.stroke || ink; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(bx + 26, by); ctx.lineTo(tx, ty); ctx.lineTo(bx - 26, by); ctx.stroke();
    // outline without the tail gap
    ctx.save(); ctx.beginPath(); ctx.rect(-w, -h, w * 2, h * 2);
    ctx.moveTo(bx - 22, by); ctx.lineTo(bx + 22, by); ctx.lineTo(bx + 22, by + (ty > 0 ? -8 : 8)); ctx.lineTo(bx - 22, by + (ty > 0 ? -8 : 8)); ctx.closePath();
    ctx.restore();
    rrect(ctx, -w / 2, -h / 2, w, h, r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx - 21, by); ctx.lineTo(bx + 21, by); ctx.lineWidth = 9; ctx.strokeStyle = o.fill || PAL.white; ctx.stroke();
    ctx.restore();
  }
  /* Thought cloud made of puffs, with trailing dots toward (tx, ty). */
  function thought(ctx, w, h, tx, ty, fill = PAL.lilac, seed = 1) {
    const n = 12, pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * TAU; pts.push([Math.cos(a) * w / 2, Math.sin(a) * h / 2]); }
    pts.forEach(([x, y], i) => shape(ctx, ellipsePts(x * 0.86, y * 0.82, w * 0.17, h * 0.2, 10), { fill, lw: 7, seed: seed * 10 + i }));
    shape(ctx, ellipsePts(0, 0, w * 0.47, h * 0.43, 20), { fill, lw: 0, seed: seed * 10 + 99 });
    pts.forEach(([x, y], i) => shape(ctx, ellipsePts(x * 0.86, y * 0.82, w * 0.17 - 7, h * 0.2 - 7, 10), { fill, lw: 0, seed: seed * 10 + i }));
    [0.25, 0.5, 0.75].forEach((k, i) => {
      const x = lerp(0, tx, 0.55 + k * 0.45), y = lerp(h / 2, ty, k);
      shape(ctx, ellipsePts(x, y, 20 - i * 5, 16 - i * 4, 10), { fill, lw: 6, seed: seed * 10 + 50 + i });
    });
  }
  function heart(ctx, s = 1, c = "#FF5C8A") {
    ctx.save(); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -30, -60, 0, -26); ctx.bezierCurveTo(30, -60, 60, -10, 0, 30);
    ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 6 / s; ctx.strokeStyle = ink; ctx.stroke(); ctx.restore();
  }
  function battery(ctx, level, o = {}) {
    rrect(ctx, -90, -46, 170, 92, 18); ctx.fillStyle = PAL.navy2; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = o.stroke || PAL.cream; ctx.stroke();
    rrect(ctx, 84, -18, 18, 36, 6); ctx.fillStyle = o.stroke || PAL.cream; ctx.fill();
    rrect(ctx, -78, -34, 146 * clamp(level), 68, 10); ctx.fillStyle = o.fill || PAL.yellow; ctx.fill();
  }
  function star4(ctx, x, y, r, c = PAL.yellow) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU - Math.PI / 2, rr = i % 2 ? r * 0.28 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  }
  /* Comic burst behind a word. */
  function burst(ctx, r, c = PAL.yellow, n = 14, seed = 1) {
    const R = HF.rng(seed); ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * TAU, rr = i % 2 ? r * (0.62 + R() * 0.1) : r * (0.95 + R() * 0.12); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = ink; ctx.stroke();
  }
  /* Sparkle poof (transformations): ring of stars expanding with u 0..1. */
  function poof(ctx, x, y, u, r = 260) {
    if (u <= 0 || u >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - u;
    glow(ctx, x, y, r * (0.6 + u), PAL.cream, 0.9);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU + 0.3; star4(ctx, x + Math.cos(a) * r * HF.E.out3(u), y + Math.sin(a) * r * HF.E.out3(u), 34 * (1 - u * 0.5), i % 2 ? PAL.yellow : PAL.white); }
    ctx.restore();
  }
  window.PROP = { phone, burger, salad, coffee, shirt, card, bubble, thought, heart, battery, star4, burst, poof };
})();
