/* Landmarks of Astana drawn as vector forms. Local origin = base centre, units ≈ px at scale 1, y up is negative. */
(function () {
  const { rgb, glow, lerp, clamp, strokeProgress } = KIT;
  const gold = ['#fff0b8', '#f0a830', '#8a4f10'];
  function sphere(ctx, x, y, r, c = gold) { const g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, c[0]); g.addColorStop(.55, c[1]); g.addColorStop(1, c[2]); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  // Baiterek: slender shaft, lattice cup, golden sphere
  function baiterek(ctx, x, y, s, night = 0, t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (night) glow(ctx, 0, -380, 260, [255, 190, 90], .35 * night);
    const sh = ctx.createLinearGradient(-40, 0, 40, 0); sh.addColorStop(0, '#9fb0c8'); sh.addColorStop(.5, '#f2f6fb'); sh.addColorStop(1, '#6e7f9a'); ctx.fillStyle = sh;
    ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-13, -300); ctx.lineTo(-20, -330); ctx.lineTo(20, -330); ctx.lineTo(13, -300); ctx.lineTo(34, 0); ctx.closePath(); ctx.fill();
    // lattice
    ctx.strokeStyle = 'rgba(60,80,110,.6)'; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 12; i++) { const y0 = -i * 25, w0 = lerp(30, 12, i / 12), w1 = lerp(30, 12, (i + 1) / 12); ctx.moveTo(-w0, y0); ctx.lineTo(w1, y0 - 25); ctx.moveTo(w0, y0); ctx.lineTo(-w1, y0 - 25); } ctx.stroke();
    // cup of branches
    ctx.strokeStyle = '#e9eef6'; ctx.lineWidth = 6; ctx.beginPath(); for (let i = -4; i <= 4; i++) { ctx.moveTo(i * 4, -325); ctx.quadraticCurveTo(i * 26, -380, i * 17, -440); } ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, -440, 70, 12, 0, 0, 7); ctx.stroke();
    sphere(ctx, 0, -462, 64); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.ellipse(0, -462, 64, Math.abs(k) * 16 + 6, 0, 0, 7); ctx.stroke(); }
    ctx.strokeStyle = '#e9eef6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -526); ctx.lineTo(0, -600); ctx.stroke();
    if (night) { glow(ctx, 0, -462, 120, [255, 200, 110], .55 * night); }
    ctx.restore();
  }
  // Khan Shatyr: asymmetric translucent tent with spire
  function khanShatyr(ctx, x, y, s, night = 0, t = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (night) glow(ctx, 0, -190, 380, [255, 170, 80], .35 * night);
    const g = ctx.createLinearGradient(-260, 0, 260, -380); g.addColorStop(0, night ? '#ffd48a' : '#cfe6f2'); g.addColorStop(.6, night ? '#e58a3a' : '#8fb8d0'); g.addColorStop(1, night ? '#7a3a28' : '#486c8a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-270, 0); ctx.bezierCurveTo(-200, -60, -110, -210, -40, -400); ctx.lineTo(-24, -400); ctx.lineTo(-10, -470); ctx.lineTo(0, -470); ctx.lineTo(8, -400); ctx.bezierCurveTo(60, -230, 160, -80, 270, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = night ? 'rgba(255,240,200,.55)' : 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 14; i++) { const u = i / 13; ctx.moveTo(lerp(-270, 270, u), 0); ctx.quadraticCurveTo(lerp(-150, 150, u) * .6, -150, -20 + u * 28, -400); } ctx.stroke();
    ctx.strokeStyle = night ? '#ffe2a0' : '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6, -470); ctx.lineTo(-4, -560); ctx.stroke();
    ctx.fillStyle = '#1c2438'; ctx.fillRect(-300, 0, 600, 24);
    ctx.restore();
  }
  // outline polylines for blueprint animation (screen units, origin bottom centre)
  const outlines = {
    baiterek: [[-34, 0], [-13, -300], [-20, -330], [-60, -440], [-64, -462], [-40, -515], [0, -526], [40, -515], [64, -462], [60, -440], [20, -330], [13, -300], [34, 0], [-34, 0]],
    shatyr: [[-270, 0], [-110, -210], [-40, -400], [-10, -470], [8, -400], [160, -80], [270, 0], [-270, 0]],
    pyramid: [[-170, 0], [0, -250], [170, 0], [-170, 0], [0, -130], [170, 0]],
    nurAlem: (() => { const a = []; for (let i = 0; i <= 40; i++) a.push([Math.cos(i / 40 * 6.283) * 110, -130 + Math.sin(i / 40 * 6.283) * 110]); return a; })(),
    tower: [[-45, 0], [-45, -420], [-10, -520], [30, -420], [30, 0]],
    mosque: [[-150, 0], [-150, -110], [-90, -110], [-90, -200], [-30, -250], [0, -290], [30, -250], [90, -200], [90, -110], [150, -110], [150, 0], [-150, 0]],
  };
  function drawOutline(ctx, name, x, y, s, p, col, w = 4) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = w / s; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 18; strokeProgress(ctx, outlines[name], p); ctx.restore(); }
  window.LM = { baiterek, khanShatyr, drawOutline, sphere, outlines };
})();
