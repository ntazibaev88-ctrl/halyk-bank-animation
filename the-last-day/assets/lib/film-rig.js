/* THE LAST DAY — character rig.
 * The hero ("Artyom"): ~22, slim, short messy hair, charcoal hoodie with the hood down
 * and pale drawstrings, dark joggers. Same proportions and outline in every shot.
 * Zombies: hunched, head hanging, one arm reaching, torn hems. */
(function () {
  const F = window.FILM;
  const { lerp, clamp } = F;

  // joint solver. Angles in radians from straight down; positive swings toward +x.
  function solve(o) {
    const h = o.h, p = o.pose || {};
    const thigh = 0.245 * h, shin = 0.245 * h, torso = 0.30 * h, upper = 0.165 * h, fore = 0.16 * h;
    const front = o.facing === "front" || o.facing === "back";
    const hipW = front ? 0.1 * h : 0.02 * h, shW = front ? 0.22 * h : 0.03 * h;
    const legs = ["L", "R"].map((k, i) => {
      const [a, b, lift] = p["h" + k] || [0, 0, 0];
      const side = i === 0 ? -1 : 1;
      const hx = side * hipW / 2;
      const fl = 1 - (lift || 0) * 0.45; // foreshortening for legs lifted toward camera
      const kx = hx + Math.sin(a) * thigh, ky = Math.cos(a) * thigh * fl;
      const fx = kx + Math.sin(a + b) * shin, fy = ky + Math.cos(a + b) * shin * fl;
      return { hx, hy: 0, kx, ky, fx, fy };
    });
    const ground = Math.max(legs[0].fy, legs[1].fy);
    const ox = o.x, oy = o.y - ground; // hip centre in screen
    const lean = p.lean || 0;
    const sx = ox + Math.sin(lean) * torso, sy = oy - Math.cos(lean) * torso;
    const headTilt = lean + (p.neck || 0);
    const neckLen = 0.05 * h;
    const nx = sx + Math.sin(headTilt) * neckLen, ny = sy - Math.cos(headTilt) * neckLen;
    const hr = 0.062 * h;
    const hcx = nx + Math.sin(headTilt) * hr * 0.9, hcy = ny - Math.cos(headTilt) * hr * 0.9;
    const arms = ["L", "R"].map((k, i) => {
      const [a, b] = p["s" + k] || [0, 0];
      const side = i === 0 ? -1 : 1;
      const ax = sx + side * shW / 2 * Math.cos(lean), ay = sy + side * shW / 2 * Math.sin(lean) + 0.02 * h;
      const ex = ax + Math.sin(a) * upper, ey = ay + Math.cos(a) * upper;
      const wx = ex + Math.sin(a + b) * fore, wy = ey + Math.cos(a + b) * fore;
      return { ax, ay, ex, ey, wx, wy };
    });
    return {
      h, ox, oy, sx, sy, nx, ny, hcx, hcy, hr, headTilt, hipW, shW, front,
      legs: legs.map((l) => ({ hx: ox + l.hx, hy: oy, kx: ox + l.kx, ky: oy + l.ky, fx: ox + l.fx, fy: oy + l.fy })),
      arms,
    };
  }

  function limb(ctx, pts, w0, w1) {
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = w0; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.lineTo(pts[2], pts[3]); ctx.stroke();
    ctx.lineWidth = w1; ctx.beginPath(); ctx.moveTo(pts[2], pts[3]); ctx.lineTo(pts[4], pts[5]); ctx.stroke();
  }

  function shape(ctx, j, o, color) {
    const h = j.h, kind = o.kind || "hero";
    ctx.fillStyle = color; ctx.strokeStyle = color;
    const zombie = kind === "zombie";
    // legs
    j.legs.forEach((l) => {
      limb(ctx, [l.hx, l.hy, l.kx, l.ky, l.fx, l.fy], 0.085 * h, 0.065 * h);
      // feet
      ctx.beginPath();
      const dir = o.facing === "left" ? -1 : 1;
      if (!j.front) ctx.ellipse(l.fx + dir * 0.03 * h, l.fy - 0.008 * h, 0.05 * h, 0.018 * h, 0, 0, 6.283);
      else ctx.ellipse(l.fx, l.fy - 0.01 * h, 0.03 * h, 0.02 * h, 0, 0, 6.283);
      ctx.fill();
    });
    // torso (hoodie is boxy; zombie clothing ragged)
    const lean = (o.pose && o.pose.lean) || 0;
    const tw0 = j.front ? 0.2 * h : 0.15 * h, tw1 = j.front ? 0.26 * h : 0.16 * h;
    const cx = Math.cos(lean), sn = Math.sin(lean);
    ctx.beginPath();
    ctx.moveTo(j.ox - tw0 / 2 * cx, j.oy + 0.03 * h - tw0 / 2 * sn);
    ctx.lineTo(j.sx - tw1 / 2 * cx, j.sy - tw1 / 2 * sn);
    ctx.lineTo(j.sx + tw1 / 2 * cx, j.sy + tw1 / 2 * sn);
    ctx.lineTo(j.ox + tw0 / 2 * cx, j.oy + 0.03 * h + tw0 / 2 * sn);
    ctx.closePath(); ctx.lineWidth = 0.05 * h; ctx.lineJoin = "round"; ctx.fill(); ctx.stroke();
    if (zombie) {
      // torn hem
      const r = F.rng(o.seed || 9);
      ctx.beginPath();
      const n = 7;
      for (let i = 0; i <= n; i++) {
        const u = i / n - 0.5;
        const x = j.ox + u * tw0 * 1.1 * cx, y = j.oy + 0.05 * h + u * tw0 * sn;
        ctx.lineTo(x, y + (i % 2 ? 0.07 : 0.02) * h * (0.5 + r()));
      }
      ctx.lineTo(j.ox - tw0 / 2 * cx, j.oy); ctx.fill();
    }
    if (kind === "hero") {
      // hood bunched behind the neck
      ctx.beginPath();
      const back = j.front ? 0 : (o.facing === "left" ? 1 : -1);
      ctx.ellipse(j.sx + back * 0.045 * h, j.sy - 0.012 * h, j.front ? 0.11 * h : 0.07 * h, 0.045 * h, lean, 0, 6.283);
      ctx.fill();
    }
    // arms
    j.arms.forEach((a, i) => {
      limb(ctx, [a.ax, a.ay, a.ex, a.ey, a.wx, a.wy], 0.068 * h, 0.056 * h);
      ctx.beginPath(); ctx.arc(a.wx, a.wy, 0.03 * h, 0, 6.283); ctx.fill();
      if (zombie && i === 1) { // clawed fingers
        ctx.lineWidth = 0.012 * h;
        for (let k = -1; k <= 1; k++) {
          ctx.beginPath(); ctx.moveTo(a.wx, a.wy);
          const ang = Math.atan2(a.wy - a.ey, a.wx - a.ex) + k * 0.35;
          ctx.lineTo(a.wx + Math.cos(ang) * 0.06 * h, a.wy + Math.sin(ang) * 0.06 * h); ctx.stroke();
        }
      }
    });
    // neck + head
    ctx.lineWidth = 0.05 * h; ctx.beginPath(); ctx.moveTo(j.sx, j.sy); ctx.lineTo(j.nx, j.ny); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(j.hcx, j.hcy, j.hr * 0.88, j.hr * 1.08, j.headTilt, 0, 6.283); ctx.fill();
    if (kind === "hero") {
      // short messy hair: a few tufts on the crown
      const r = F.rng(4242);
      ctx.beginPath();
      for (let i = 0; i < 14; i++) {
        const a = -Math.PI * 0.95 + (i / 13) * Math.PI * 0.9 + j.headTilt + (r() - 0.5) * 0.1;
        const rr = j.hr * (1.0 + r() * 0.1);
        ctx.moveTo(j.hcx + Math.cos(a - 0.2) * j.hr * 0.85, j.hcy + Math.sin(a - 0.2) * j.hr * 1.0);
        ctx.quadraticCurveTo(j.hcx + Math.cos(a) * rr * 1.05, j.hcy + Math.sin(a) * rr * 1.12, j.hcx + Math.cos(a + 0.25) * rr, j.hcy + Math.sin(a + 0.25) * rr * 1.08);
        ctx.lineTo(j.hcx + Math.cos(a + 0.2) * j.hr * 0.85, j.hcy + Math.sin(a + 0.2) * j.hr * 1.0);
      }
      ctx.fill();
    }
    if (kind === "woman") {
      // ponytail flowing back
      const back = o.facing === "left" ? 1 : -1;
      ctx.lineWidth = 0.03 * h;
      ctx.beginPath(); ctx.moveTo(j.hcx, j.hcy - j.hr * 0.5);
      ctx.quadraticCurveTo(j.hcx + back * j.hr * 2, j.hcy - j.hr * 0.2 + (o.hairSwing || 0) * j.hr, j.hcx + back * j.hr * 2.4, j.hcy + j.hr * 0.6);
      ctx.stroke();
    }
    if (zombie) {
      // stringy hair
      ctx.lineWidth = 0.006 * h;
      const r = F.rng((o.seed || 9) + 1);
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI + r() * Math.PI;
        const x0 = j.hcx + Math.cos(a) * j.hr * 0.8, y0 = j.hcy + Math.sin(a) * j.hr;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (r() - 0.5) * 0.04 * h, y0 + 0.06 * h * r() + 0.03 * h); ctx.stroke();
      }
    }
  }

  // public: draw a figure with optional rim light and eyes
  F.figure = function (ctx, o) {
    const j = solve(o);
    ctx.save();
    if (o.alpha != null) ctx.globalAlpha = o.alpha;
    if (o.rim) {
      shape(ctx, j, o, o.rim.color);
      ctx.save(); ctx.translate(o.rim.dx || 0, o.rim.dy || 0);
      shape(ctx, j, o, o.color || "#07090c"); ctx.restore();
    } else shape(ctx, j, o, o.color || "#07090c");
    if (o.kind === "hero" && o.facing === "front" && o.strings) {
      ctx.strokeStyle = o.strings; ctx.lineWidth = 0.007 * j.h;
      [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(j.sx + s * 0.03 * j.h, j.sy + 0.01 * j.h); ctx.lineTo(j.sx + s * 0.034 * j.h, j.sy + 0.1 * j.h); ctx.stroke(); });
    }
    if (o.eyes) {
      const dx = j.hr * 0.32, ey = j.hcy + j.hr * 0.05;
      [-1, 1].forEach((s) => F.glow(ctx, j.hcx + s * dx + (o.eyeShift || 0) * j.hr, ey, j.hr * 0.42, o.eyes, 1));
      ctx.fillStyle = "#e8eef2";
      [-1, 1].forEach((s) => { ctx.beginPath(); ctx.arc(j.hcx + s * dx + (o.eyeShift || 0) * j.hr, ey, Math.max(1, j.hr * 0.07), 0, 6.283); ctx.fill(); });
    }
    ctx.restore();
    return j;
  };

  // ---------- gait cycles ----------
  F.gait = {
    run(ph, a = 1) {
      const s = Math.sin(ph), c = Math.cos(ph);
      return {
        lean: 0.28 * a, neck: -0.1,
        hL: [s * 0.75 * a, -Math.max(0, -c) * 1.4 * a - 0.2],
        hR: [-s * 0.75 * a, -Math.max(0, c) * 1.4 * a - 0.2],
        sL: [-s * 0.9 * a, 1.5], sR: [s * 0.9 * a, 1.5],
      };
    },
    runFront(ph) { // toward camera: knees lift, arms pump sideways
      const s = Math.sin(ph);
      return {
        lean: 0, neck: 0.04 * s,
        hL: [-0.04, 0.04, Math.max(0, s)], hR: [0.04, -0.04, Math.max(0, -s)],
        sL: [-0.35 - 0.25 * s, 1.0 + 0.4 * s], sR: [0.35 - 0.25 * s, -1.0 + 0.4 * s],
      };
    },
    walk(ph, a = 1) {
      const s = Math.sin(ph), c = Math.cos(ph);
      return {
        lean: 0.04, neck: 0,
        hL: [s * 0.35 * a, -Math.max(0, -c) * 0.6 * a],
        hR: [-s * 0.35 * a, -Math.max(0, c) * 0.6 * a],
        sL: [-s * 0.3 * a, 0.2], sR: [s * 0.3 * a, 0.2],
      };
    },
    shamble(ph, a = 1, reach = 1) {
      const s = Math.sin(ph), c = Math.cos(ph);
      return {
        lean: 0.32 + 0.05 * s, neck: 0.45 + 0.08 * c,
        hL: [s * 0.3 * a + 0.05, -Math.max(0, -c) * 0.5 * a],
        hR: [-s * 0.18 * a, -0.1],
        sL: [0.25 + 0.1 * c, 0.1], sR: [0.6 + reach * 0.8 + 0.1 * s, -0.2 * reach],
      };
    },
    shambleFront(ph) {
      const s = Math.sin(ph);
      return {
        lean: 0.12 * s, neck: 0.35 + 0.1 * s,
        hL: [-0.06, 0.05, Math.max(0, s) * 0.3], hR: [0.06, -0.05, Math.max(0, -s) * 0.3],
        sL: [-0.25, 0.4 + 0.2 * s], sR: [0.15 + 0.1 * s, -0.25],
      };
    },
  };

  // ---------- close-ups ----------
  // zombie face toward camera. s = face height in px. jaw 0..1. light -1 (from left) .. 1
  // Drawn on its own layer: mostly in shadow, one-sided key light, mottled skin, slight softness.
  F.zombieFace = function (ctx, t, x, y, s, o = {}) {
    const jaw = o.jaw ?? 0.6, lx = o.light ?? -0.6, r = F.rng(o.seed || 31);
    const S = Math.ceil(s * 1.5);
    if (!F._faceBuf || F._faceBuf.width < S) F._faceBuf = F.mk(S, S);
    const L = F._faceBuf, c = L.getContext("2d");
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = "source-over"; c.globalAlpha = 1; c.filter = "none";
    c.clearRect(0, 0, L.width, L.height);
    c.translate(S / 2, S / 2);
    const w = s * 0.68;
    const head = new Path2D();
    head.moveTo(-w * 0.52, -s * 0.3);
    head.bezierCurveTo(-w * 0.58, s * 0.02, -w * 0.47, s * 0.24, -w * 0.3, s * 0.36 + jaw * s * 0.13);
    head.quadraticCurveTo(-w * 0.05, s * 0.5 + jaw * s * 0.17, w * 0.27, s * 0.37 + jaw * s * 0.12);
    head.bezierCurveTo(w * 0.45, s * 0.22, w * 0.56, s * 0.04, w * 0.5, -s * 0.31);
    head.bezierCurveTo(w * 0.44, -s * 0.62, -w * 0.46, -s * 0.64, -w * 0.52, -s * 0.3);
    // ragged wet hair mass behind and around the head breaks the outline
    c.fillStyle = "#030404"; c.strokeStyle = "#030404"; c.lineCap = "round";
    c.beginPath(); c.ellipse(0, -s * 0.16, w * 0.6, s * 0.5, 0, 0, 6.283); c.fill();
    for (let i = 0; i < 46; i++) {
      const side = i % 2 ? 1 : -1, u = r();
      const x0 = side * w * (0.15 + u * 0.4), y0 = -s * (0.5 - u * 0.25);
      c.lineWidth = s * (0.012 + r() * 0.03);
      c.beginPath(); c.moveTo(x0, y0);
      c.bezierCurveTo(x0 + side * s * 0.08, y0 + s * 0.2, x0 + side * s * (0.02 + r() * 0.12), y0 + s * 0.45, x0 + side * s * (r() * 0.1), y0 + s * (0.55 + r() * 0.35));
      c.stroke();
    }
    // neck
    c.fillRect(-w * 0.25, s * 0.25, w * 0.5, s * 0.5);
    // base skin: grey-green, very dark
    c.fillStyle = "#2a302d"; c.fill(head);
    c.save(); c.clip(head);
    // mottled, bruised skin
    c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.9;
    c.drawImage(F.fogTex(17, [90, 96, 92], 3), -w, -s * 0.7, w * 2, s * 1.4);
    c.globalAlpha = 0.6; c.drawImage(F.fogTex(23, [120, 70, 70], 2.5), -w, -s * 0.7, w * 2.4, s * 1.6);
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
    // key light from one side; the far half falls to black
    const kx = lx * w * 0.55;
    const key = c.createRadialGradient(kx, -s * 0.12, s * 0.02, kx, -s * 0.05, s * 0.62);
    key.addColorStop(0, "rgba(190,200,192,0.75)"); key.addColorStop(0.4, "rgba(120,132,126,0.35)"); key.addColorStop(1, "rgba(0,0,0,0)");
    c.globalCompositeOperation = "overlay"; c.fillStyle = key; c.fillRect(-w, -s, w * 2, s * 2);
    if (o.bright) { c.globalCompositeOperation = "screen"; c.globalAlpha = o.bright; c.fillStyle = key; c.fillRect(-w, -s, w * 2, s * 2); c.globalAlpha = 1; }
    c.globalCompositeOperation = "source-over";
    const shade = c.createLinearGradient(lx * w * 0.6, 0, -lx * w * 0.6, 0);
    shade.addColorStop(0, "rgba(0,0,0,0)"); shade.addColorStop(0.55, "rgba(0,0,0,0.55)"); shade.addColorStop(1, "rgba(0,0,0,0.95)");
    c.fillStyle = shade; c.fillRect(-w, -s, w * 2, s * 2);
    const top = c.createLinearGradient(0, -s * 0.6, 0, -s * 0.1);
    top.addColorStop(0, "rgba(0,0,0,0.9)"); top.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = top; c.fillRect(-w, -s, w * 2, s);
    // veins
    c.strokeStyle = "rgba(10,14,18,0.6)"; c.lineWidth = Math.max(1, s * 0.0028);
    for (let i = 0; i < 22; i++) {
      let px = (r() - 0.5) * w, py = (r() - 0.55) * s * 0.75;
      c.beginPath(); c.moveTo(px, py);
      for (let k = 0; k < 6; k++) { px += (r() - 0.5) * s * 0.05; py += (r() - 0.35) * s * 0.04; c.lineTo(px, py); }
      c.stroke();
    }
    // sunken sockets
    [-1, 1].forEach((sd) => {
      const ex = sd * w * 0.21, ey = -s * 0.1;
      const sock = c.createRadialGradient(ex, ey, s * 0.01, ex, ey + s * 0.01, s * 0.14);
      sock.addColorStop(0, "rgba(0,0,0,0.95)"); sock.addColorStop(0.6, "rgba(0,0,0,0.6)"); sock.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = sock; c.fillRect(ex - s * 0.15, ey - s * 0.15, s * 0.3, s * 0.3);
    });
    // cheek hollows + nose shadow
    [-1, 1].forEach((sd) => { const g = c.createRadialGradient(sd * w * 0.3, s * 0.16, 0, sd * w * 0.3, s * 0.16, s * 0.12); g.addColorStop(0, "rgba(0,0,0,0.55)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(-w, -s, w * 2, s * 2); });
    c.fillStyle = "rgba(0,0,0,0.85)";
    c.beginPath(); c.ellipse(-s * 0.022, s * 0.085, s * 0.013, s * 0.022, 0.3, 0, 6.283); c.fill();
    c.beginPath(); c.ellipse(s * 0.022, s * 0.085, s * 0.013, s * 0.022, -0.3, 0, 6.283); c.fill();
    // mouth: lips pulled back, dark gums, uneven teeth
    const my = s * 0.215, mh = s * (0.02 + jaw * 0.17), mw = w * 0.27;
    const mouth = new Path2D();
    mouth.moveTo(-mw, my);
    mouth.bezierCurveTo(-mw * 0.6, my - mh * 0.55, mw * 0.5, my - mh * 0.6, mw * 1.05, my + mh * 0.05);
    mouth.bezierCurveTo(mw * 0.6, my + mh * 1.5, -mw * 0.5, my + mh * 1.55, -mw, my);
    c.fillStyle = "#020202"; c.fill(mouth);
    c.save(); c.clip(mouth);
    c.fillStyle = "#2a0b0b"; c.fillRect(-mw, my - mh, mw * 2.1, mh * 0.35); // gums
    for (let i = 0; i < 12; i++) {
      const u = -1 + (i + 0.5) / 6, tx = u * mw * 0.92;
      if (r() < 0.12) continue; // missing tooth
      const tw = mw * (0.07 + r() * 0.04), th = s * (0.026 + r() * 0.02);
      const shade2 = 0.45 + 0.55 * (1 - Math.abs(u - lx * 0.6) * 0.6);
      c.fillStyle = `rgba(${150 * shade2 | 0},${140 * shade2 | 0},${108 * shade2 | 0},1)`;
      c.beginPath(); c.roundRect(tx - tw, my - mh * 0.5 + (r() - 0.5) * s * 0.008, tw * 2, th, tw * 0.6); c.fill();
      if (jaw > 0.25 && r() < 0.8) { c.beginPath(); c.roundRect(tx - tw * 0.9, my + mh * 1.05 - th * 0.8, tw * 1.8, th * 0.8, tw * 0.5); c.fill(); }
    }
    const inner = c.createRadialGradient(0, my + mh * 0.5, 0, 0, my + mh * 0.5, mw);
    inner.addColorStop(0, "rgba(0,0,0,0.9)"); inner.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = inner; c.fillRect(-mw, my - mh, mw * 2, mh * 3);
    c.restore();
    // blood from the mouth
    c.fillStyle = "rgba(48,6,6,0.9)";
    for (let i = 0; i < 5; i++) {
      const bx = (r() - 0.5) * mw * 1.5, by = my + mh * 1.2;
      c.beginPath(); c.moveTo(bx - s * 0.008, by); c.quadraticCurveTo(bx + s * 0.006, by + s * 0.05, bx, by + s * (0.05 + r() * 0.14)); c.quadraticCurveTo(bx - s * 0.008, by + s * 0.04, bx - s * 0.008, by); c.fill();
    }
    c.restore();
    // milky eyes (drawn over sockets)
    [-1, 1].forEach((sd) => {
      const ex = sd * w * 0.21 + (o.look || 0) * s * 0.01, ey = -s * 0.098;
      const lit = sd === Math.sign(lx) ? 1 : 0.55;
      const eg = c.createRadialGradient(ex - s * 0.006, ey - s * 0.004, 0, ex, ey, s * 0.034);
      eg.addColorStop(0, `rgba(${235 * lit | 0},${238 * lit | 0},${228 * lit | 0},1)`); eg.addColorStop(0.65, `rgba(${170 * lit | 0},${176 * lit | 0},${168 * lit | 0},1)`); eg.addColorStop(1, "rgba(40,44,42,1)");
      c.fillStyle = eg; c.beginPath(); c.ellipse(ex, ey, s * 0.034, s * 0.021 * (o.eyeOpen ?? 1), sd * 0.08, 0, 6.283); c.fill();
      c.fillStyle = "rgba(150,156,150,0.55)"; c.beginPath(); c.arc(ex, ey, s * 0.012, 0, 6.283); c.fill();
      c.strokeStyle = "rgba(140,25,25,0.55)"; c.lineWidth = Math.max(1, s * 0.0018);
      for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(ex - sd * s * 0.032, ey + (k - 1.5) * s * 0.006); c.lineTo(ex - sd * s * 0.015, ey + (k - 1.5) * s * 0.003 + (r() - 0.5) * s * 0.004); c.stroke(); }
      c.fillStyle = "rgba(255,255,255,0.8)"; c.beginPath(); c.arc(ex + lx * s * 0.01, ey - s * 0.007, Math.max(1, s * 0.003), 0, 6.283); c.fill();
      // heavy lid shadow
      c.fillStyle = "rgba(0,0,0,0.55)"; c.beginPath(); c.ellipse(ex, ey - s * 0.016, s * 0.04, s * 0.013, 0, 0, 6.283); c.fill();
    });
    // thin wet hair hanging over the brow
    c.strokeStyle = "rgba(4,5,6,0.92)";
    for (let i = 0; i < 70; i++) {
      const hx = (r() - 0.5) * w * 1.15, len = s * (0.15 + r() * 0.4);
      c.lineWidth = Math.max(1, s * (0.0015 + r() * 0.003));
      c.beginPath(); c.moveTo(hx, -s * 0.5);
      c.bezierCurveTo(hx + (r() - 0.5) * s * 0.05, -s * 0.35, hx + (r() - 0.5) * s * 0.08, -s * 0.5 + len * 0.7, hx + (r() - 0.5) * s * 0.1, -s * 0.5 + len);
      c.stroke();
    }
    // rim light on the lit edge
    c.save(); c.clip(head);
    c.globalCompositeOperation = "screen";
    const rim = c.createLinearGradient(lx * w * 0.62, 0, lx * w * 0.35, 0);
    rim.addColorStop(0, o.rim || "rgba(150,175,205,0.55)"); rim.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = rim; c.fillRect(-w, -s, w * 2, s * 2);
    c.restore();
    // the face falls off into darkness at its edges
    c.save(); c.clip(head);
    const fall = c.createRadialGradient(lx * w * 0.2, -s * 0.02, s * 0.2, 0, 0, s * 0.62);
    fall.addColorStop(0, "rgba(0,0,0,0)"); fall.addColorStop(1, "rgba(0,0,0,0.92)");
    c.fillStyle = fall; c.fillRect(-w, -s, w * 2, s * 2);
    c.restore();
    // composite with a touch of lens softness
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    ctx.filter = `blur(${Math.max(0.6, s / 900)}px)`;
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.drawImage(L, 0, 0, S, S, -S / 2, -S / 2, S, S);
    ctx.restore();
  };

  // hero head in profile, facing right (mirror with scale(-1,1)). s = head height.
  // light: {color, from:'below'|'front'} paints a lit edge; eye 0..1 open, wide 0..1
  F.heroProfile = function (ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); if (o.flip) ctx.scale(-1, 1); ctx.rotate(o.rot || 0);
    const P = new Path2D();
    // forehead -> brow -> nose -> lips -> chin -> jaw -> neck (front), back of skull
    P.moveTo(-s * 0.05, -s * 0.52);
    P.bezierCurveTo(s * 0.18, -s * 0.52, s * 0.3, -s * 0.38, s * 0.31, -s * 0.2);
    P.quadraticCurveTo(s * 0.33, -s * 0.12, s * 0.315, -s * 0.09); // brow
    P.quadraticCurveTo(s * 0.33, -s * 0.02, s * 0.4, s * 0.06); // nose bridge to tip
    P.quadraticCurveTo(s * 0.41, s * 0.1, s * 0.34, s * 0.11); // under nose
    P.quadraticCurveTo(s * 0.36, s * 0.15, s * 0.35, s * 0.17); // upper lip
    P.quadraticCurveTo(s * 0.33, s * 0.2, s * 0.345, s * 0.23); // lower lip
    P.quadraticCurveTo(s * 0.33, s * 0.27, s * 0.31, s * 0.28);
    P.quadraticCurveTo(s * 0.33, s * 0.34, s * 0.27, s * 0.38); // chin
    P.quadraticCurveTo(s * 0.12, s * 0.42, s * 0.05, s * 0.33); // jaw
    P.lineTo(s * 0.07, s * 0.62); P.lineTo(-s * 0.25, s * 0.62);
    P.quadraticCurveTo(-s * 0.3, s * 0.2, -s * 0.33, -s * 0.05);
    P.bezierCurveTo(-s * 0.35, -s * 0.38, -s * 0.22, -s * 0.52, -s * 0.05, -s * 0.52);
    ctx.fillStyle = o.color || "#06080a"; ctx.fill(P);
    // lit skin
    if (o.light) {
      ctx.save(); ctx.clip(P);
      const L = o.light;
      const g = L.from === "below"
        ? ctx.createLinearGradient(s * 0.45, s * 0.4, s * 0.05, -s * 0.2)
        : ctx.createLinearGradient(s * 0.45, 0, s * 0.1, 0);
      g.addColorStop(0, L.color); g.addColorStop(0.55, L.mid || "rgba(40,55,70,0.35)"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(-s, -s, s * 2, s * 2);
      ctx.restore();
    }
    // hair mass on top and back
    ctx.fillStyle = o.color || "#06080a";
    const r = F.rng(4242);
    ctx.beginPath();
    ctx.moveTo(s * 0.25, -s * 0.36);
    for (let i = 0; i <= 12; i++) {
      const a = -0.35 - (i / 12) * 2.5;
      const rr = s * (0.5 + r() * 0.08);
      ctx.lineTo(Math.cos(a) * rr * 0.75 - s * 0.03, Math.sin(a) * rr * 0.95 - s * 0.05);
    }
    ctx.lineTo(-s * 0.32, s * 0.05); ctx.lineTo(s * 0.1, -s * 0.2); ctx.closePath(); ctx.fill();
    // hood around the neck
    ctx.beginPath(); ctx.ellipse(-s * 0.1, s * 0.62, s * 0.38, s * 0.16, -0.15, 0, 6.283); ctx.fill();
    // eye
    const open = o.eye ?? 1, wide = o.wide || 0;
    if (open > 0.05) {
      const ex = s * 0.255, ey = -s * 0.07;
      ctx.fillStyle = `rgba(215,225,232,${0.75 * (o.eyeLight ?? 1)})`;
      ctx.beginPath(); ctx.ellipse(ex, ey, s * 0.035, s * 0.016 * open * (1 + wide * 0.6), 0.05, 0, 6.283); ctx.fill();
      ctx.fillStyle = "#0b0e10"; ctx.beginPath(); ctx.ellipse(ex + s * 0.016, ey, s * 0.012, s * 0.014 * open * (1 + wide * 0.4), 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.9 * (o.eyeLight ?? 1)})`; ctx.beginPath(); ctx.arc(ex + s * 0.02, ey - s * 0.004, s * 0.004, 0, 6.283); ctx.fill();
    }
    ctx.restore();
  };

  // hand from the side, fist gripping something horizontal at (x,y). s = hand size.
  F.fist = function (ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); if (o.flip) ctx.scale(-1, 1);
    const col = o.color || "#2d3238";
    // sleeve (hoodie cuff)
    ctx.fillStyle = o.sleeve || "#101317";
    ctx.beginPath(); ctx.roundRect(-s * 2.6, -s * 0.55, s * 1.9, s * 1.15, s * 0.25); ctx.fill();
    ctx.fillStyle = "#171b20"; ctx.fillRect(-s * 0.9, -s * 0.5, s * 0.2, s * 1.05);
    // back of hand
    const g = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
    g.addColorStop(0, o.hi || "#6b7480"); g.addColorStop(1, col);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(-s * 0.75, -s * 0.45, s * 0.95, s * 0.95, s * 0.3); ctx.fill();
    // knuckles / curled fingers
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.roundRect(s * 0.05, -s * 0.48 + i * s * 0.245, s * 0.42, s * 0.23, s * 0.11); ctx.fill();
    }
    ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = s * 0.025;
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(s * 0.08, -s * 0.48 + i * s * 0.245); ctx.lineTo(s * 0.45, -s * 0.48 + i * s * 0.245); ctx.stroke(); }
    // thumb
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(-s * 0.35, -s * 0.62, s * 0.7, s * 0.24, s * 0.12); ctx.fill();
    ctx.restore();
  };
})();
