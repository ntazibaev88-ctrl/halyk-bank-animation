/* SCENE 3 — 0:12-0:22 — he wakes, goes to the window, sees the city is gone.
 * A eye     0.00-2.60  extreme close-up: his eye opens in the blue light from the blinds
 * B window  2.60-5.00  from behind: he walks to the window
 * C city    5.00-7.40  POV through the blinds: smoke, fires, a searchlight, sirens
 * D below   7.40-10.0  looking down: the street is full of them */
(function () {
  const F = window.FILM, { W, H, seg, lerp, rng } = F, A = F.apt;

  function eye(ctx, t) {
    const open = F.easeOut(seg(t, 0.8, 1.15)) * (1 - 0.7 * Math.max(0, Math.sin(seg(t, 1.25, 1.45) * Math.PI))) ;
    const z = lerp(1.0, 1.08, seg(t, 0, 2.6));
    ctx.save();
    F.applyCam(ctx, { z, y: Math.sin(t * 0.8) * 6 });
    const cx = 540, cy = 860, ew = 620, eh = 260;
    // skin
    const sk = ctx.createRadialGradient(cx - 100, cy - 100, 50, cx, cy, 900);
    sk.addColorStop(0, "#4a515a"); sk.addColorStop(0.5, "#22272d"); sk.addColorStop(1, "#08090b");
    ctx.fillStyle = sk; ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.7;
    ctx.drawImage(F.fogTex(41, [120, 120, 125], 1.6), -100, -100, W + 200, H + 200); ctx.restore();
    // brow
    ctx.strokeStyle = "rgba(8,9,10,0.85)"; const r = rng(5);
    for (let i = 0; i < 220; i++) {
      const u = r(), bx = cx - ew * 0.75 + u * ew * 1.5, by = cy - 330 - Math.sin(u * Math.PI) * 70 + r() * 40;
      ctx.lineWidth = 2 + r() * 3; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 30 + r() * 20, by - 12 - r() * 12); ctx.stroke();
    }
    // lid crease + socket shadow
    const sock = ctx.createRadialGradient(cx, cy - 40, 60, cx, cy, ew * 0.85);
    sock.addColorStop(0, "rgba(0,0,0,0.35)"); sock.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sock; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(cx - ew * 0.55, cy - 40); ctx.quadraticCurveTo(cx, cy - eh * 1.35, cx + ew * 0.55, cy - 30); ctx.stroke();
    // the eye opening
    const lidY = lerp(cy + eh * 0.05, cy - eh * 0.55, open);
    const almond = new Path2D();
    almond.moveTo(cx - ew / 2, cy);
    almond.quadraticCurveTo(cx - ew * 0.1, lidY - eh * 0.25 * open, cx + ew / 2, cy - 10);
    almond.quadraticCurveTo(cx, cy + eh * 0.55, cx - ew / 2, cy);
    if (open > 0.02) {
      ctx.save(); ctx.clip(almond);
      const sc = ctx.createRadialGradient(cx, cy, 20, cx, cy, ew * 0.5);
      sc.addColorStop(0, "#8d949b"); sc.addColorStop(0.7, "#5a6168"); sc.addColorStop(1, "#22262a");
      ctx.fillStyle = sc; ctx.fillRect(cx - ew, cy - eh, ew * 2, eh * 2);
      const dart = seg(t, 1.8, 1.9) * 40 - seg(t, 2.3, 2.4) * 20;
      const ix = cx + 10 + dart, iy = cy - 20, ir = 125;
      const ig = ctx.createRadialGradient(ix, iy, 10, ix, iy, ir);
      ig.addColorStop(0, "#3a2c20"); ig.addColorStop(0.55, "#5d6a72"); ig.addColorStop(0.9, "#2b3238"); ig.addColorStop(1, "#111");
      ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.283); ctx.fill();
      ctx.strokeStyle = "rgba(20,24,28,0.35)"; ctx.lineWidth = 2;
      for (let i = 0; i < 90; i++) { const a = (i / 90) * 6.283; ctx.beginPath(); ctx.moveTo(ix + Math.cos(a) * 45, iy + Math.sin(a) * 45); ctx.lineTo(ix + Math.cos(a + 0.05) * ir * 0.95, iy + Math.sin(a + 0.05) * ir * 0.95); ctx.stroke(); }
      const pr = lerp(40, 58, seg(t, 1.1, 1.6));
      ctx.fillStyle = "#050505"; ctx.beginPath(); ctx.arc(ix, iy, pr, 0, 6.283); ctx.fill();
      // catchlight: the window
      ctx.fillStyle = "rgba(220,230,245,0.7)"; ctx.beginPath(); ctx.roundRect(ix - 64, iy - 66, 18, 24, 4); ctx.fill();
      // upper lid shadow on the eyeball
      const ls = ctx.createLinearGradient(0, lidY - 40, 0, lidY + 90);
      ls.addColorStop(0, "rgba(0,0,0,0.85)"); ls.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ls; ctx.fillRect(cx - ew, lidY - 60, ew * 2, 160);
      ctx.restore();
    }
    // lashes
    ctx.strokeStyle = "rgba(6,6,6,0.8)"; ctx.lineCap = "round";
    for (let i = 0; i < 46; i++) {
      const u = i / 45, x = lerp(cx - ew * 0.45, cx + ew * 0.47, u);
      const y = (1 - u) * (1 - u) * cy + 2 * (1 - u) * u * (lidY - eh * 0.25 * open) + u * u * (cy - 10);
      ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 10, y - 30 - 25 * open, x + 26, y - 40 - 35 * open + (open < 0.3 ? 60 : 0)); ctx.stroke();
    }
    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.stroke(almond);
    ctx.restore();
    // light through the blinds, slanting across the face
    A.slats(ctx, -200, 300, 1500, 1500, 7, -260, 0.22);
  }

  function walk(ctx, t) {
    const lt = t - 2.6;
    const p = F.easeInOut(seg(lt, 0, 2.2));
    ctx.fillStyle = "#06080b"; ctx.fillRect(0, 0, W, H);
    const fl = ctx.createLinearGradient(0, 1300, 0, H);
    fl.addColorStop(0, "#0d1117"); fl.addColorStop(1, "#040506");
    ctx.fillStyle = fl; ctx.fillRect(0, 1300, W, 700);
    A.window(ctx, t + 12, 240, 260, 600, 1040, { open: 0.35 });
    A.slats(ctx, 120, 1310, 840, 520, 8, 0, 0.12);
    F.glow(ctx, 540, 780, 800, "rgba(110,140,180,0.25)", 1);
    const ph = lt * 7.5 * (1 - seg(lt, 1.9, 2.3));
    const s = Math.sin(ph);
    F.figure(ctx, {
      kind: "hero", facing: "back", x: lerp(700, 560, p), y: lerp(2050, 1470, p), h: lerp(1500, 1000, p),
      pose: { lean: 0.02 * s, neck: 0, hL: [-0.03, 0.03, Math.max(0, s) * 0.5], hR: [0.03, -0.03, Math.max(0, -s) * 0.5], sL: [-0.12 + 0.05 * s, 0.1], sR: [0.12 + 0.05 * s, -0.1] },
      color: "#06080a", rim: { color: "rgba(140,170,210,0.8)", dx: 0, dy: 4 },
    });
    F.dust(ctx, t, { count: 60, seed: 3, alpha: 0.35 });
  }

  function city(ctx, t, look) {
    const lt = t - 5;
    const z = lerp(1, 1.08, seg(lt, 0, 2.4));
    ctx.save();
    F.applyCam(ctx, { z, x: F.wobble(t, 4) * 5 });
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0b1018"); sky.addColorStop(0.45, "#2a3444"); sky.addColorStop(0.75, "#5a3a28"); sky.addColorStop(1, "#1a110c");
    ctx.fillStyle = sky; ctx.fillRect(-100, -100, W + 200, H + 200);
    // smoke columns, lit from below by fires
    const fires = [[220, 1180, 1], [760, 1120, 1.3], [980, 1260, 0.8], [470, 1300, 0.7]];
    fires.forEach(([fx, fy, k], i) => {
      F.glow(ctx, fx, fy, 380 * k, `rgba(255,110,40,${0.35 + 0.1 * F.wobble(t * 4, i)})`, 1);
      for (let j = 0; j < 16; j++) {
        const u = j / 15, rise = ((t * 0.05 + u) % 1);
        const px = fx + rise * 420 + Math.sin(t * 0.4 + j) * 30, py = fy - rise * 1300;
        const rad = (90 + rise * 380) * k;
        F.glow(ctx, px, py, rad, `rgba(18,16,18,${0.75 * (1 - rise * 0.6)})`, 1, "source-over");
        F.glow(ctx, px, py + rad * 0.3, rad * 0.8, `rgba(150,70,30,${0.18 * (1 - rise)})`, 1);
      }
    });
    // skyline
    const r = rng(500);
    let x = -60;
    while (x < W + 60) {
      const bw = 60 + r() * 160, bh = 300 + r() * 700, top = 1450 - bh;
      ctx.fillStyle = "#06090d"; ctx.fillRect(x, top, bw + 1, H);
      if (r() < 0.3) { ctx.fillRect(x + bw * 0.45, top - 80, 4, 80); if (Math.floor(t * 1.5 + x) % 2) F.glow(ctx, x + bw * 0.45, top - 80, 14, "rgba(255,40,40,0.9)", 1); }
      for (let k = 0; k < bh / 20; k++) if (r() < 0.1) { ctx.fillStyle = r() < 0.5 ? "rgba(255,170,90,0.6)" : "rgba(140,170,210,0.4)"; ctx.fillRect(x + r() * bw, top + r() * bh, 4, 5); }
      x += bw + 6;
    }
    fires.forEach(([fx, fy, k]) => { F.glow(ctx, fx, fy + 150, 200 * k, "rgba(255,120,40,0.55)", 1); for (let i = 0; i < 10; i++) F.glow(ctx, fx + Math.sin(t * 7 + i) * 18 + (i - 5) * 16 * k, fy + 170 - Math.abs(Math.sin(t * 9 + i * 2)) * 70 * k, 50 * k, "rgba(255,150,60,0.75)", 1); });
    // helicopter and its searchlight
    const hx = lerp(-80, 1150, seg(lt, 0, 5)), hy = 300 + Math.sin(lt) * 20;
    F.cone(ctx, t, hx, hy, 0.4 - lt * 0.1, 0.07, 1500, "200,215,235", 0.35, 9);
    ctx.fillStyle = "#020304"; ctx.beginPath(); ctx.ellipse(hx, hy, 30, 12, 0, 0, 6.283); ctx.fill(); ctx.fillRect(hx - 70, hy - 3, 50, 4);
    if (Math.floor(t * 3) % 2) F.glow(ctx, hx, hy + 10, 20, "rgba(255,50,50,1)", 1);
    // police lights on the street
    [[300, 1520], [820, 1560]].forEach(([px, py], i) => { const on = Math.floor(t * 6 + i) % 2; F.glow(ctx, px, py, 120, on ? "rgba(255,30,40,0.8)" : "rgba(40,90,255,0.8)", 1); });
    F.fog(ctx, t, { seed: 7, y0: 900, y1: 1700, alpha: 0.3, scale: 6, speed: 10, rgb: [120, 110, 110] });
    F.rain(ctx, t, { count: 120, seed: 15, speed: 2000, color: "rgba(190,205,225,0.12)" });
    ctx.restore();
    // foreground: the blinds pulled apart by his fingers
    // slats framing the view
    ctx.fillStyle = "#06080b"; ctx.fillRect(0, 0, W, 300); ctx.fillRect(0, 1640, W, 300);
    ctx.fillStyle = "rgba(140,165,200,0.25)"; ctx.fillRect(0, 298, W, 3); ctx.fillRect(0, 1640, W, 3);
    F.fist(ctx, 420, 1660, 70, { rot: -1.4, hi: "#3e4650" });
    F.fist(ctx, 640, 1660, 70, { rot: -1.7, hi: "#3e4650" });
  }

  function below(ctx, t) {
    const lt = t - 7.4;
    const cam = { vx: 540, vy: 140 - lt * 10, f: 900 + lt * 50, camH: 26 };
    const figs = [];
    const r = rng(808);
    for (let i = 0; i < 70; i++) {
      const X = -6 + r() * 12, Z = 12 + r() * 50;
      figs.push({ kind: "zombie", facing: "front", X: X + Math.sin(t * 0.5 + i) * 0.2, Z: Z - lt * (0.3 + r() * 0.5), ht: 1.7 + r() * 0.2, pose: F.gait.shambleFront(t * (2.5 + r() * 2) + i), seed: i });
    }
    F.street(ctx, t + 3, cam, { figures: figs });
    // burning car
    const P = F.persp(cam), bx = P.x(-2, 20), by = P.y(0, 20);
    F.glow(ctx, bx, by, 260, "rgba(255,120,40,0.6)", 1);
    for (let i = 0; i < 5; i++) F.glow(ctx, bx + (i - 2) * 14, by - 30 - Math.abs(Math.sin(t * 8 + i)) * 30, 40, "rgba(255,180,80,0.9)", 1);
    F.fog(ctx, t, { seed: 11, alpha: 0.3, scale: 5, speed: 12, rise: 20 });
    F.rain(ctx, t, { count: 200, seed: 16, speed: 2400, slant: 0.05 });
  }

  F.scenes.s3 = function (ctx, t) {
    F.clear(ctx);
    if (t < 2.6) eye(ctx, t);
    else if (t < 5) walk(ctx, t);
    else if (t < 7.4) city(ctx, t);
    else below(ctx, t);
    F.finish(ctx, t, { seed: 3, vignette: 0.8 });
    if (t < 0.5) { ctx.fillStyle = `rgba(0,0,0,${1 - seg(t, 0, 0.5)})`; ctx.fillRect(0, 0, W, H); }
  };
})();
