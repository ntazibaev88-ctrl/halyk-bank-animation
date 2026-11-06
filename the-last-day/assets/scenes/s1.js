/* SCENE 1 — 0:00-0:05 — the attack on the empty street (hook).
 * A wide  0.00-1.70  low wet street, a woman runs at camera, shapes shamble behind her
 * B side  1.70-2.50  she glances back; a zombie lunges in from the dark; impact flash
 * C face  2.50-3.05  the zombie's face snaps into lens, red flash
 * D high  3.05-5.00  crane-high: the street is empty but for them; title card over it */
(function () {
  const F = window.FILM, { W, H, seg, lerp, smooth, rng } = F;

  // ---------- the street (shared with scene 3's street view) ----------
  const LAMPS = [8, 18, 28, 38, 48, 58, 70];
  F.street = function (ctx, t, cam, opt = {}) {
    const P = F.persp(cam);
    const zMin = 1.2;
    // sky with low city glow
    const sky = ctx.createLinearGradient(0, 0, 0, cam.vy + 40);
    sky.addColorStop(0, "#04070b"); sky.addColorStop(0.7, "#0d1520"); sky.addColorStop(1, "#2a2a2c");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, cam.vy + 60);
    F.glow(ctx, W / 2, cam.vy, 700, "rgba(120,70,40,0.35)", 1);
    // far skyline across the end of the street
    const r = rng(11);
    for (let i = 0; i < 16; i++) {
      const X = -40 + i * 5.5, Z = 95, hb = 14 + r() * 40;
      const x0 = P.x(X, Z), x1 = P.x(X + 5.5, Z), yt = P.y(hb, Z), yb = P.y(0, Z);
      ctx.fillStyle = "#0a0f16"; ctx.fillRect(x0, yt, x1 - x0 + 1, yb - yt);
      for (let k = 0; k < 18; k++) if (r() < 0.12) { ctx.fillStyle = r() < 0.5 ? "rgba(200,160,110,0.5)" : "rgba(130,160,200,0.4)"; ctx.fillRect(lerp(x0, x1, r()), lerp(yt, yb, r()), 2, 2); }
    }
    // side facades, far to near
    [-1, 1].forEach((side) => {
      const rr = rng(side > 0 ? 21 : 37);
      const blocks = []; let z = 4;
      while (z < 95) { const len = 7 + rr() * 9; blocks.push({ z0: z, z1: z + len, hb: 10 + rr() * 26, seed: Math.floor(rr() * 1e6) }); z += len; }
      blocks.reverse().forEach((b) => {
        const X = side * 7.2;
        const z0 = Math.max(b.z0, zMin), z1 = b.z1;
        if (z1 <= zMin) return;
        const a = [P.x(X, z1), P.y(0, z1)], bq = [P.x(X, z0), P.y(0, z0)];
        const c = [P.x(X, z0), P.y(b.hb, z0)], d = [P.x(X, z1), P.y(b.hb, z1)];
        const g = ctx.createLinearGradient(a[0], 0, bq[0], 0);
        g.addColorStop(0, "#111822"); g.addColorStop(1, "#06090d");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...bq); ctx.lineTo(...c); ctx.lineTo(...d); ctx.closePath(); ctx.fill();
        // windows
        const wr = rng(b.seed);
        for (let Y = 3.5; Y < b.hb - 1; Y += 3.2) {
          for (let Z = b.z0 + 0.8; Z < b.z1 - 1.6; Z += 2.6) {
            if (Z < zMin + 0.5) continue;
            const v = wr();
            const lit = v < 0.07, cold = v > 0.93;
            const q = [[P.x(X, Z), P.y(Y, Z)], [P.x(X, Z + 1.4), P.y(Y, Z + 1.4)], [P.x(X, Z + 1.4), P.y(Y + 1.6, Z + 1.4)], [P.x(X, Z), P.y(Y + 1.6, Z)]];
            if (Math.abs(q[0][0] - q[1][0]) < 1.5) continue;
            let col = "rgba(22,30,40,0.9)";
            if (lit) { const fl = F.flicker(t, b.seed + Z) > 0.08 ? 1 : 0.3; col = `rgba(190,150,100,${0.45 * fl})`; }
            if (cold) col = "rgba(110,140,180,0.35)";
            ctx.fillStyle = col;
            ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.fill();
          }
        }
      });
    });
    // ground: wet asphalt
    const gy = P.y(0, 95);
    const gr = ctx.createLinearGradient(0, gy, 0, H);
    gr.addColorStop(0, "#1b232e"); gr.addColorStop(0.25, "#0d1218"); gr.addColorStop(1, "#05070a");
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.moveTo(P.x(-7.2, 95), gy); ctx.lineTo(P.x(7.2, 95), gy); ctx.lineTo(P.x(7.2, zMin), P.y(0, zMin)); ctx.lineTo(P.x(-7.2, zMin), P.y(0, zMin)); ctx.closePath(); ctx.fill();
    ctx.fillRect(0, P.y(0, zMin) - 2, W, H);
    // curbs and the dashed centre line
    ctx.strokeStyle = "rgba(120,135,150,0.25)"; ctx.lineWidth = 2;
    [-5, 5].forEach((X) => { ctx.beginPath(); ctx.moveTo(P.x(X, 95), gy); ctx.lineTo(P.x(X, zMin), P.y(0, zMin)); ctx.stroke(); });
    for (let Z = 3; Z < 90; Z += 6) {
      const z0 = Math.max(Z, zMin), z1 = Z + 3;
      ctx.fillStyle = `rgba(170,175,160,${0.16 * F.seg(Z, 3, 14)})`;
      ctx.beginPath(); ctx.moveTo(P.x(-0.1, z0), P.y(0, z0)); ctx.lineTo(P.x(0.1, z0), P.y(0, z0)); ctx.lineTo(P.x(0.1, z1), P.y(0, z1)); ctx.lineTo(P.x(-0.1, z1), P.y(0, z1)); ctx.fill();
    }
    // street lamps (one flickering), cones of light and their reflections on the wet road
    [-1, 1].forEach((side) => {
      LAMPS.slice().reverse().forEach((Z, i) => {
        const z = Z + (side > 0 ? 5 : 0);
        if (z < zMin + 0.5) return;
        const s = P.s(z), X = side * 6.4;
        const dead = side > 0 && i === 3;
        const flick = side < 0 && i === 4 ? (F.flicker(t, 5) > 0.35 ? 1 : 0.15) : 1;
        const on = dead ? 0 : flick;
        const lx = P.x(X - side * 1.6, z), ly = P.y(6.2, z);
        ctx.strokeStyle = "#07090c"; ctx.lineWidth = Math.max(1, 0.14 * s);
        ctx.beginPath(); ctx.moveTo(P.x(X, z), P.y(0, z)); ctx.lineTo(P.x(X, z), ly); ctx.lineTo(lx, ly); ctx.stroke();
        if (!on) return;
        F.cone(ctx, t, lx, ly, side * 0.08, 0.32, 6.6 * s, "150,175,205", 0.22 * on, 3 + i);
        F.glow(ctx, lx, ly, 2.2 * s, "rgba(210,225,240,0.9)", on);
        F.glow(ctx, lx, ly, 0.5 * s, "rgba(255,255,255,1)", on);
        // reflection streak on wet asphalt
        if (z < 7) return;
        const ry = P.y(0, z), len = Math.min(700, 7 * s), fade = F.seg(z, 7, 16);
        const rg = ctx.createLinearGradient(0, ry, 0, ry + len);
        rg.addColorStop(0, `rgba(150,175,205,${0.3 * on * fade})`); rg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = rg;
        ctx.filter = `blur(${Math.max(2, 0.15 * s)}px)`; ctx.fillRect(lx - 0.25 * s, ry, 0.5 * s, len); ctx.restore();
      });
    });
    // abandoned car with hazards blinking (the only warm light)
    if (opt.car !== false) drawCar(ctx, t, P, 2.7, 11);
    // figures, sorted far -> near
    (opt.figures || []).slice().sort((a, b) => b.Z - a.Z).forEach((fg) => {
      if (fg.Z < zMin) return;
      const s = P.s(fg.Z);
      F.figure(ctx, Object.assign({ x: P.x(fg.X, fg.Z), y: P.y(0, fg.Z), h: fg.ht * s, rim: { color: "rgba(150,175,205,0.9)", dx: -Math.max(1, s * 0.03), dy: Math.max(1, s * 0.02) } }, fg));
      // wet reflection of the figure
      ctx.save(); ctx.globalAlpha = 0.18; ctx.translate(0, 2 * P.y(0, fg.Z)); ctx.scale(1, -1);
      F.figure(ctx, Object.assign({ x: P.x(fg.X, fg.Z), y: P.y(0, fg.Z), h: fg.ht * s }, fg, { eyes: null, rim: null }));
      ctx.restore();
    });
  };

  function drawCar(ctx, t, P, X, Z) {
    const s = P.s(Z), x = P.x(X, Z), y = P.y(0, Z), w = 1.85 * s;
    ctx.save();
    // body
    ctx.fillStyle = "#0a0d11";
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - 1.05 * s, w, 0.8 * s, 0.12 * s); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - w * 0.42, y - 1.0 * s); ctx.lineTo(x - w * 0.32, y - 1.45 * s); ctx.lineTo(x + w * 0.32, y - 1.45 * s); ctx.lineTo(x + w * 0.42, y - 1.0 * s); ctx.fill();
    // rear window catches the lamps
    const rw = ctx.createLinearGradient(0, y - 1.42 * s, 0, y - 1.05 * s);
    rw.addColorStop(0, "rgba(120,140,165,0.35)"); rw.addColorStop(1, "rgba(20,26,34,0.6)");
    ctx.fillStyle = rw; ctx.beginPath(); ctx.moveTo(x - w * 0.36, y - 1.05 * s); ctx.lineTo(x - w * 0.29, y - 1.4 * s); ctx.lineTo(x + w * 0.29, y - 1.4 * s); ctx.lineTo(x + w * 0.36, y - 1.05 * s); ctx.fill();
    // wheels
    ctx.fillStyle = "#030405"; [-0.36, 0.36].forEach((u) => ctx.fillRect(x + u * w - 0.12 * s, y - 0.3 * s, 0.24 * s, 0.3 * s));
    // hazards: 1.6 Hz
    const on = Math.floor(t * 3.2) % 2 === 0 ? 1 : 0.08;
    [-0.42, 0.42].forEach((u) => {
      const hx = x + u * w, hy = y - 0.85 * s;
      F.glow(ctx, hx, hy, 0.9 * s, "rgba(255,140,40,0.9)", on);
      ctx.fillStyle = `rgba(255,190,110,${on})`; ctx.fillRect(hx - 0.1 * s, hy - 0.05 * s, 0.2 * s, 0.1 * s);
      const rg = ctx.createLinearGradient(0, y, 0, y + 5 * s);
      rg.addColorStop(0, `rgba(255,130,40,${0.4 * on})`); rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = rg; ctx.fillRect(hx - 0.15 * s, y, 0.3 * s, 5 * s); ctx.restore();
    });
    ctx.restore();
  }

  // ---------- shots ----------
  function shotA(ctx, t) {
    const hh = F.handheld(t, 1.2, 1);
    const dolly = t * 0.5;
    const cam = { vx: 540 + hh.x, vy: 900 + hh.y, f: 1050, camH: 1.45 };
    const Zw = lerp(13.5, 4.2, F.easeIn(seg(t, 0, 1.7)) * 0.6 + seg(t, 0, 1.7) * 0.4) - dolly;
    const figs = [
      { kind: "woman", facing: "front", X: -0.7, Z: Zw, ht: 1.68, pose: F.gait.runFront(t * 13), color: "#0b0e12" },
      { kind: "zombie", facing: "front", X: -2.6, Z: 19 - t * 1.1 - dolly, ht: 1.8, pose: F.gait.shambleFront(t * 4), seed: 3, eyes: "rgba(200,215,220,0.5)" },
      { kind: "zombie", facing: "front", X: 0.9, Z: 21.5 - t * 1.4 - dolly, ht: 1.75, pose: F.gait.shambleFront(t * 4.6 + 2), seed: 5, eyes: "rgba(200,215,220,0.5)" },
      { kind: "zombie", facing: "front", X: 3.4, Z: 26 - t * 0.9 - dolly, ht: 1.85, pose: F.gait.shambleFront(t * 3.4 + 4), seed: 7 },
      { kind: "zombie", facing: "front", X: -4.2, Z: 30 - t - dolly, ht: 1.7, pose: F.gait.shambleFront(t * 3 + 1), seed: 8 },
    ];
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(hh.r); ctx.translate(-W / 2, -H / 2);
    F.street(ctx, t, Object.assign(cam, { vx: cam.vx }), { figures: figs });
    F.fog(ctx, t, { seed: 2, y0: 650, y1: 1250, alpha: 0.32, scale: 5, speed: 26 });
    F.fog(ctx, t, { seed: 4, y0: 1000, y1: 1920, alpha: 0.18, scale: 7, speed: -18 });
    ctx.restore();
    F.rain(ctx, t, { count: 320, seed: 7, speed: 2900 });
  }

  function shotB(ctx, t) {
    const lt = t - 1.7; // 0..0.8
    const hit = 0.56;
    const sk = F.shake(lt, hit, 46, 0.12);
    ctx.save(); ctx.translate(sk.x, sk.y);
    // background: soft lamp bokeh through rain and fog
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#070a0f"); bg.addColorStop(1, "#0e141c");
    ctx.fillStyle = bg; ctx.fillRect(-60, -60, W + 120, H + 120);
    const r = rng(81);
    for (let i = 0; i < 9; i++) {
      const bx = ((r() * 1500 - lt * 600) % 1500 + 1500) % 1500 - 200, by = 500 + r() * 600;
      F.glow(ctx, bx, by, 60 + r() * 90, "rgba(150,175,205,0.35)", 1);
    }
    F.glow(ctx, 860 - lt * 300, 900, 120, "rgba(255,140,40,0.35)", Math.floor(t * 3.2) % 2 ? 0.1 : 1);
    F.fog(ctx, t, { seed: 6, y0: 0, y1: H, alpha: 0.25, scale: 4, speed: 300 });
    // ground line
    ctx.fillStyle = "#06080b"; ctx.fillRect(-60, 1540, W + 120, 500);
    const wx = lerp(900, 520, seg(lt, 0, hit)), zx = lerp(-380, 360, F.easeIn(seg(lt, 0.18, hit)));
    const fallen = seg(lt, hit, 0.8);
    ctx.save();
    if (fallen > 0) { ctx.translate(wx, 1540); ctx.rotate(-fallen * 0.9); ctx.translate(-wx, -1540); }
    F.figure(ctx, { kind: "woman", facing: "left", x: wx, y: 1540, h: 900, pose: Object.assign(F.gait.run(lt * 13), { lean: -0.3, neck: 0.5 }), color: "#090b0e", rim: { color: "rgba(170,195,225,0.95)", dx: -6, dy: 3 }, hairSwing: Math.sin(lt * 13) });
    if (lt > 0.12) F.figure(ctx, { kind: "zombie", facing: "right", x: zx, y: 1560, h: 1050, pose: { lean: 0.55, neck: 0.25, hL: [0.6, -0.4], hR: [-0.5, -0.2], sL: [1.9, -0.2], sR: [2.2, -0.3] }, color: "#050608", seed: 4, rim: { color: "rgba(120,150,185,0.8)", dx: 5, dy: 3 } });
    ctx.restore();
    ctx.restore();
    F.rain(ctx, t, { count: 260, seed: 9, speed: 3100, slant: 0.2 });
    if (lt > 0.14 && lt < hit) F.smear(ctx, -18, 0, 3, 0.12);
  }

  function shotC(ctx, t) {
    const lt = t - 2.5; // 0..0.55
    const s = lerp(950, 1750, F.easeOut(seg(lt, 0, 0.5)));
    const sk = F.shake(lt, 0.02, 40, 0.1);
    ctx.fillStyle = "#050608"; ctx.fillRect(0, 0, W, H);
    F.fog(ctx, t, { seed: 8, alpha: 0.18, scale: 4, speed: 80 });
    F.glow(ctx, 200, 500, 900, "rgba(110,140,180,0.25)", 1);
    F.zombieFace(ctx, t, W / 2 + sk.x, 980 + sk.y, s, { jaw: 0.55 + 0.4 * seg(lt, 0, 0.25), light: -0.7, seed: 31 });
    F.smear(ctx, 0, 14, 3, 0.12);
    F.chroma(ctx, 14 * (1 - seg(lt, 0, 0.3)));
  }

  function shotD(ctx, t) {
    const lt = t - 3.05; // 0..1.95
    const hh = F.handheld(t, 0.5, 3);
    const cam = { vx: 540 + hh.x, vy: 560 + hh.y, f: 1250 + lt * 60, camH: 8.5 };
    F.street(ctx, t + 2, cam, {
      figures: [
        { kind: "zombie", facing: "front", X: 1.8, Z: 26 - lt * 0.4, ht: 1.8, pose: F.gait.shambleFront(t * 3), seed: 3 },
        { kind: "zombie", facing: "front", X: -3.4, Z: 33 - lt * 0.5, ht: 1.75, pose: F.gait.shambleFront(t * 3.5 + 1), seed: 5 },
        { kind: "zombie", facing: "front", X: 4.6, Z: 40, ht: 1.8, pose: F.gait.shambleFront(t * 2.5 + 2), seed: 7 },
      ],
    });
    // the victim on the asphalt and the thing bent over her
    const P = F.persp(cam), Z = 13, s = P.s(Z), bx = P.x(-0.8, Z), by = P.y(0, Z);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(-1.45);
    F.figure(ctx, { kind: "woman", facing: "left", x: 0, y: 0, h: 1.65 * s, pose: { lean: 0, hL: [0.3, 0], hR: [-0.1, 0.3], sL: [2.4, 0.4], sR: [0.6, 0.3] }, color: "#07090b" });
    ctx.restore();
    F.figure(ctx, { kind: "zombie", facing: "left", x: bx + 0.5 * s, y: by + 0.05 * s, h: 1.3 * s, pose: { lean: -1.05 + Math.sin(t * 9) * 0.06, neck: -0.4, hL: [-1.2, 1.9], hR: [-1.0, 1.7], sL: [-1.4, 0.3], sR: [-1.1, 0.4] }, color: "#050608", seed: 4, rim: { color: "rgba(150,175,205,0.9)", dx: 2, dy: 1 } });
    // dark pool spreading
    ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = "#1a0505";
    ctx.beginPath(); ctx.ellipse(bx + 0.2 * s, by + 0.05 * s, (0.6 + lt * 0.15) * s, (0.12 + lt * 0.03) * s, 0, 0, 6.283); ctx.fill(); ctx.restore();
    F.fog(ctx, t, { seed: 2, y0: 300, y1: 1300, alpha: 0.38, scale: 6, speed: 16 });
    F.fog(ctx, t, { seed: 4, y0: 900, y1: 1920, alpha: 0.2, scale: 8, speed: -10 });
    F.rain(ctx, t, { count: 260, seed: 12, speed: 2600, slant: 0.08 });
    // darken the lower third so the title reads
    const g = ctx.createLinearGradient(0, 600, 0, 1300);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.5, "rgba(0,0,0,0.45)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 600, W, 700);
  }

  F.scenes.s1 = function (ctx, t) {
    F.clear(ctx);
    let flash = null;
    if (t < 1.7) shotA(ctx, t);
    else if (t < 2.5) {
      shotB(ctx, t);
      const lt = t - 1.7;
      if (lt > 0.56 && lt < 0.64) flash = "rgba(235,240,245,0.85)";
    } else if (t < 3.05) {
      shotC(ctx, t);
      if (t < 2.58) flash = "rgba(160,10,10,0.45)";
    } else shotD(ctx, t);
    F.finish(ctx, t, { seed: 1, flash, vignette: 0.8 });
    // 1-frame black dips on the cuts give the edit its punch
    if (Math.abs(t - 1.7) < 0.017 || Math.abs(t - 3.05) < 0.017) { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H); }
  };
})();
