/* SCENE 2 — 0:05-0:12 — the emergency broadcast.
 * A room   0.00-3.00  the TV glows in the dark flat; the hero asleep on the couch in foreground
 * B screen 3.00-5.60  push into the broadcast: banner, the city map bleeding red, the ticker
 * C signal 5.60-7.00  "НЕ ВЫХОДИТЕ ИЗ ДОМА", then the signal breaks into static */
(function () {
  const F = window.FILM, { W, H, seg, lerp } = F, A = F.apt;

  function room(ctx, t) {
    const lt = t;
    const z = lerp(1, 1.14, F.easeInOut(seg(lt, 0, 3)));
    const hh = F.handheld(t, 0.35, 11);
    ctx.save();
    F.applyCam(ctx, { z, x: hh.x, y: hh.y, r: hh.r, px: -60, py: -60 });
    // back wall + floor
    const wall = ctx.createLinearGradient(0, -200, 0, 1150);
    wall.addColorStop(0, "#030406"); wall.addColorStop(1, "#0b0f15");
    ctx.fillStyle = wall; ctx.fillRect(-200, -200, W + 400, 1350);
    const fl = ctx.createLinearGradient(0, 1150, 0, 2000);
    fl.addColorStop(0, "#0b0e13"); fl.addColorStop(1, "#020203");
    ctx.fillStyle = fl; ctx.fillRect(-200, 1150, W + 400, 1000);
    // window (right of the TV), blinds half open
    A.window(ctx, t + 5, 700, 330, 290, 720, { open: 0.3 });
    A.slats(ctx, 620, 1180, 500, 300, 8, -70, 0.07);
    // TV
    const flick = 0.75 + 0.25 * F.flicker(t, 3);
    const tvx = 110, tvy = 780, tvw = 480;
    const tvh = A.tv(ctx, t, tvx, tvy, tvw, { content: (c, x, y, w, h) => { A.broadcast(c, t + 5, x, y, w, h, { detail: 0.3 }); A.screenFX(c, t, x, y, w, h, { static: 0.08 }); } });
    // TV light: falls off fast, reflects on the floor
    F.glow(ctx, tvx + tvw / 2, tvy + tvh / 2, 620, `rgba(120,160,220,${0.3 * flick})`, 1);
    F.glow(ctx, tvx + tvw * 0.3, tvy + tvh * 0.2, 220, `rgba(220,40,40,${0.16 * flick})`, 1);
    ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.filter = "blur(14px)";
    const rg = ctx.createLinearGradient(0, 1180, 0, 1420);
    rg.addColorStop(0, `rgba(120,150,200,${0.28 * flick})`); rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg; ctx.fillRect(tvx + 40, 1180, tvw - 80, 240); ctx.restore();
    F.dust(ctx, t, { count: 40, seed: 12, alpha: 0.3, size: 2 });
    // couch backrest in the foreground; the hero asleep on it, head on the armrest, lit by the TV
    const cy = 1470;
    A.couch(ctx, -60, cy, 1200, 520, { color: "#050608" });
    ctx.save();
    ctx.translate(560, cy - 30);
    F.heroProfile(ctx, 0, 0, 250, { rot: -Math.PI / 2 + 0.1, eye: 0, light: { color: `rgba(150,185,235,${0.75 * flick})`, mid: "rgba(40,60,90,0.3)", from: "front" } });
    ctx.restore();
    // blanket over the shoulder
    ctx.fillStyle = "#06080a";
    ctx.beginPath(); ctx.moveTo(140, cy + 30); ctx.quadraticCurveTo(300, cy - 100, 470, cy - 20); ctx.lineTo(500, cy + 60); ctx.lineTo(140, cy + 60); ctx.fill();
    ctx.strokeStyle = `rgba(150,185,235,${0.35 * flick})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(150, cy + 25); ctx.quadraticCurveTo(300, cy - 102, 468, cy - 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(700, cy + 3); ctx.lineTo(1100, cy + 3); ctx.stroke();
    ctx.restore();
    F.fog(ctx, t, { seed: 5, alpha: 0.05, scale: 5, speed: 8 });
  }

  function screen(ctx, t, warning) {
    const lt = t - 3;
    const z = lerp(1.0, 1.1, seg(lt, 0, 4));
    ctx.fillStyle = "#020304"; ctx.fillRect(0, 0, W, H);
    ctx.save();
    F.applyCam(ctx, { z, r: -0.025 + lt * 0.004, y: -20 });
    const x = -60, y = 120, w = W + 120, h = 1120;
    A.broadcast(ctx, t + 5, x, y, w, h, { detail: 1, mapTop: 0.27, mapH: 0.5, warning, t0: 2 });
    let st = 0.06;
    if (lt < 0.12) st = 0.9;
    if (warning) st = 0.1 + 0.85 * F.easeIn(seg(t, 6.3, 6.95)) + (F.flicker(t, 9) > 0.8 ? 0.4 : 0);
    A.screenFX(ctx, t, x, y, w, h, { static: Math.min(1, st) });
    // pixel grid
    ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgba(150,150,170,0.25)";
    for (let xx = x; xx < x + w; xx += 6) ctx.fillRect(xx, y, 2, h);
    ctx.globalCompositeOperation = "source-over";
    // bezel
    ctx.strokeStyle = "#030405"; ctx.lineWidth = 40; ctx.strokeRect(x - 20, y - 20, w + 40, h + 40);
    ctx.restore();
    // screen light falling into the dark room below
    F.glow(ctx, W / 2, 1300, 700, "rgba(110,150,210,0.18)", 1);
    // glass reflection
    const g = ctx.createLinearGradient(0, 0, W, H * 0.6);
    g.addColorStop(0, "rgba(255,255,255,0.05)"); g.addColorStop(0.4, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  F.scenes.s2 = function (ctx, t) {
    F.clear(ctx);
    if (t < 3) room(ctx, t);
    else screen(ctx, t, t >= 5.6);
    F.finish(ctx, t, { seed: 2, vignette: 0.75, grain: 0.2 });
    if (t > 6.85) { ctx.fillStyle = `rgba(0,0,0,${seg(t, 6.85, 7)})`; ctx.fillRect(0, 0, W, H); }
  };
})();
