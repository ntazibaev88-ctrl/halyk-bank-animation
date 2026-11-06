/* Shared runtime kit for the gravity film: seeded random, easing, canvas helpers,
   the illustrated Earth globe renderer and the character rig driver. */
(function () {
  const Kit = {};

  Kit.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  Kit.clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  Kit.lerp = (a, b, t) => a + (b - a) * t;
  Kit.smooth = (t) => { t = Kit.clamp(t); return t * t * (3 - 2 * t); };
  Kit.inOut = (t) => { t = Kit.clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  Kit.outExpo = (t) => { t = Kit.clamp(t); return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };
  Kit.inQuad = (t) => { t = Kit.clamp(t); return t * t; };
  Kit.range = (t, a, b) => Kit.clamp((t - a) / (b - a));
  Kit.mix = (c1, c2, t) => {
    const p = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const A = p(c1), B = p(c2);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
  };

  /* Drive a canvas from timeline time. The GSAP proxy tween keeps the frame a pure
     function of local scene time; hf-seek is a second path for the same draw. */
  Kit.canvasClock = function (tl, duration, draw) {
    const proxy = { t: 0 };
    tl.fromTo(proxy, { t: 0 }, { t: duration, duration, ease: "none", onUpdate: () => draw(proxy.t) }, 0);
    draw(0);
    return proxy;
  };

  /* Static starfield painted once. */
  Kit.stars = function (canvas, seed, count, opts = {}) {
    const ctx = canvas.getContext("2d");
    const r = Kit.rng(seed);
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < count; i++) {
      const x = r() * W, y = r() * H, m = Math.pow(r(), 3);
      const s = 0.5 + m * (opts.big || 1.7);
      const hue = r();
      ctx.fillStyle = hue < 0.15 ? "rgba(255,200,150," : hue < 0.4 ? "rgba(170,205,255," : "rgba(235,240,255,";
      ctx.fillStyle += (0.25 + 0.75 * r()) + ")";
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      if (m > 0.7) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, s * 7);
        g.addColorStop(0, "rgba(150,200,255,0.35)"); g.addColorStop(1, "rgba(150,200,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 7, 0, Math.PI * 2); ctx.fill();
      }
    }
  };

  /* ---------- Earth globe (orthographic, real coastlines from Natural Earth) ---------- */
  Kit.Globe = function (canvas, seed = 7) {
    const ctx = canvas.getContext("2d");
    const proj = d3.geoOrthographic().clipAngle(90).precision(0.6);
    const path = d3.geoPath(proj, ctx);
    const land = window.LAND_GEO;
    const rnd = Kit.rng(seed);
    const clouds = [];
    for (let k = 0; k < 46; k++) {
      const bandR = rnd();
      const lat0 = bandR < 0.3 ? (rnd() - 0.5) * 24 : (rnd() < 0.5 ? -1 : 1) * (35 + rnd() * 25);
      const lon0 = rnd() * 360 - 180, n = 10 + Math.floor(rnd() * 18), spread = 6 + rnd() * 16;
      for (let i = 0; i < n; i++) {
        const u = (rnd() - 0.5) * 2;
        clouds.push({ c: [lon0 + u * spread + Math.sin(u * 3) * 3, lat0 + (rnd() - 0.5) * spread * 0.35 + u * 3 * (rnd() - 0.5)], r: 0.6 + Math.pow(rnd(), 2) * 2.6, a: 0.18 + rnd() * 0.3 });
      }
    }
    const cityPts = [], oceanPts = [];
    let guard = 0;
    while ((cityPts.length < 420 || oceanPts.length < 520) && guard++ < 20000) {
      const p = [rnd() * 360 - 180, Math.asin(rnd() * 2 - 1) * 180 / Math.PI * 0.85];
      const onLand = d3.geoContains(land, p);
      if (onLand && cityPts.length < 420 && Math.abs(p[1]) < 62) cityPts.push({ p, s: 0.6 + rnd() * 1.4 });
      if (!onLand && oceanPts.length < 520 && Math.abs(p[1]) < 70) oceanPts.push({ p, s: rnd(), d: rnd() });
    }
    const streams = [];
    for (let i = 0; i < 420; i++) streams.push({ a: rnd() * Math.PI * 2, v: 0.4 + rnd() * 1.2, d: rnd(), len: 0.5 + rnd(), w: 0.6 + rnd() * 1.6 });
    const off = document.createElement("canvas"); let off2 = null;

    function draw(o) {
      const W = canvas.width, H = canvas.height;
      const { cx, cy, r } = o;
      const rot = o.rotate || [0, -15, 0];
      const sun = o.sun || [-0.7, -0.5];
      const sl = Math.hypot(sun[0], sun[1]); const sx = sun[0] / sl, sy = sun[1] / sl;
      const dry = o.dry || 0, boil = o.boil || 0, strip = o.strip || 0, haze = o.haze || 0;
      ctx.clearRect(0, 0, W, H);
      proj.translate([cx, cy]).scale(r).rotate(rot);

      // outer atmosphere glow (expands and thins as it is stripped)
      const atmR = r * (1.07 + strip * 0.9);
      const atmA = (o.atm == null ? 1 : o.atm) * (1 - strip * 0.55);
      if (atmA > 0.01) {
        const g = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, atmR);
        g.addColorStop(0, `rgba(110,190,255,${0.75 * atmA})`);
        g.addColorStop(0.35, `rgba(70,150,255,${0.32 * atmA})`);
        g.addColorStop(1, "rgba(40,100,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, atmR, 0, Math.PI * 2); ctx.fill();
      }
      // escaping air streams
      if (strip > 0.001) {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        for (const s of streams) {
          const life = (strip * 2.2 * s.v + s.d) % 1;
          const rr = r * (1.0 + life * (0.25 + strip * 1.1));
          const len = r * 0.06 * s.len * (0.6 + strip);
          const a = Math.sin(life * Math.PI) * 0.55 * Math.min(1, strip * 3);
          const x1 = cx + Math.cos(s.a) * rr, y1 = cy + Math.sin(s.a) * rr;
          const x2 = cx + Math.cos(s.a) * (rr + len), y2 = cy + Math.sin(s.a) * (rr + len);
          ctx.strokeStyle = `rgba(140,205,255,${a})`; ctx.lineWidth = s.w;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }
        ctx.restore();
      }
      // vapour shell from boiling oceans
      if (haze > 0.001) {
        const hr = r * (1.02 + haze * 0.55);
        const g = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, hr);
        g.addColorStop(0, `rgba(220,235,255,${0.0})`);
        g.addColorStop(0.55, `rgba(215,230,250,${0.22 * haze})`);
        g.addColorStop(1, "rgba(200,220,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2); ctx.fill();
      }

      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
      // ocean
      const og = ctx.createRadialGradient(cx + sx * r * 0.45, cy + sy * r * 0.45, r * 0.05, cx, cy, r * 1.05);
      og.addColorStop(0, Kit.mix("#2f8fe8", "#5a5650", dry));
      og.addColorStop(0.55, Kit.mix("#11509e", "#3a3633", dry));
      og.addColorStop(1, Kit.mix("#061a44", "#181514", dry));
      ctx.fillStyle = og; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      // land
      ctx.beginPath(); path(land);
      const lg = ctx.createLinearGradient(cx + sx * r, cy + sy * r, cx - sx * r, cy - sy * r);
      lg.addColorStop(0, Kit.mix("#7fa857", "#9a7b55", dry * 0.6));
      lg.addColorStop(0.45, Kit.mix("#3f7a42", "#6d5640", dry * 0.6));
      lg.addColorStop(1, "#1d3322");
      ctx.fillStyle = lg; ctx.fill();
      ctx.strokeStyle = `rgba(200,230,170,${0.18})`; ctx.lineWidth = 1; ctx.stroke();
      // ice caps
      ctx.save(); ctx.clip();
      ctx.fillStyle = "rgba(235,245,255,0.85)";
      ctx.beginPath(); path(d3.geoCircle().center([0, -90]).radius(26)()); ctx.fill();
      ctx.beginPath(); path(d3.geoCircle().center([0, 90]).radius(14)()); ctx.fill();
      ctx.restore();
      // boiling speckles over the oceans
      if (boil > 0.001) {
        const center = [-rot[0], -rot[1]];
        for (const q of oceanPts) {
          if (d3.geoDistance(q.p, center) > 1.45) continue;
          const xy = proj(q.p); if (!xy) continue;
          const life = (boil * 3 + q.d) % 1;
          const s = 0.6 * (1.5 + q.s * 5) * (0.4 + life) * Math.min(1, boil * 2.5) * (r / 600);
          ctx.fillStyle = `rgba(235,245,255,${0.55 * Math.sin(life * Math.PI) * Math.min(1, boil * 2)})`;
          ctx.beginPath(); ctx.arc(xy[0], xy[1], s * 3, 0, Math.PI * 2); ctx.fill();
        }
      }
      // clouds (soft: drawn small then scaled up)
      const ca = o.clouds == null ? 1 : o.clouds;
      if (ca > 0.01) {
        const k = 0.2;
        off.width = Math.ceil(W * k); off.height = Math.ceil(H * k);
        const oc = off.getContext("2d");
        const p2 = d3.geoOrthographic().clipAngle(90).translate([cx * k, cy * k]).scale(r * k).rotate([rot[0] + (o.cloudShift || 0), rot[1], rot[2]]);
        const path2 = d3.geoPath(p2, oc);
        for (const c of clouds) {
          oc.fillStyle = `rgba(255,255,255,${c.a * ca})`;
          oc.beginPath(); path2(d3.geoCircle().center(c.c).radius(c.r).precision(20)()); oc.fill();
        }
        if (!off2) off2 = document.createElement("canvas");
        off2.width = off.width; off2.height = off.height;
        const o2 = off2.getContext("2d");
        o2.filter = `blur(${Math.max(0.6, r / 480).toFixed(2)}px)`;
        o2.drawImage(off, 0, 0);
        ctx.globalAlpha = 0.95; ctx.imageSmoothingQuality = "high";
        ctx.drawImage(off2, 0, 0, off.width, off.height, 0, 0, W, H);
        ctx.globalAlpha = 1;
      }
      // night side
      const ng = ctx.createLinearGradient(cx + sx * r, cy + sy * r, cx - sx * r, cy - sy * r);
      ng.addColorStop(0, "rgba(2,6,20,0)");
      ng.addColorStop(0.42, "rgba(2,6,20,0.05)");
      ng.addColorStop(0.62, "rgba(2,6,22,0.72)");
      ng.addColorStop(1, "rgba(1,3,12,0.94)");
      ctx.fillStyle = ng; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      // city lights on the night side
      const lights = o.lights == null ? 1 : o.lights;
      if (lights > 0.01) {
        const center = [-rot[0], -rot[1]];
        ctx.globalCompositeOperation = "lighter";
        for (const c of cityPts) {
          if (d3.geoDistance(c.p, center) > 1.5) continue;
          const xy = proj(c.p); if (!xy) continue;
          const dx = (xy[0] - cx) / r, dy = (xy[1] - cy) / r;
          const dark = Kit.clamp(-(dx * sx + dy * sy) * 2.2 - 0.1);
          if (dark <= 0) continue;
          ctx.fillStyle = `rgba(255,170,80,${0.7 * dark * lights})`;
          ctx.beginPath(); ctx.arc(xy[0], xy[1], c.s * (r / 700) * 2.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }
      // specular + limb darkening
      const sp = ctx.createRadialGradient(cx + sx * r * 0.5, cy + sy * r * 0.5, 0, cx + sx * r * 0.5, cy + sy * r * 0.5, r * 0.6);
      sp.addColorStop(0, `rgba(190,225,255,${0.22 * (1 - dry)})`); sp.addColorStop(1, "rgba(190,225,255,0)");
      ctx.fillStyle = sp; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      const limb = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r);
      limb.addColorStop(0, "rgba(0,10,30,0)"); limb.addColorStop(1, "rgba(0,10,40,0.45)");
      ctx.fillStyle = limb; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      if (o.overlay) o.overlay(ctx, proj, { cx, cy, r });
      ctx.restore();
      // rim light on the sunlit edge
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const ang = Math.atan2(sy, sx);
      const rg = ctx.createLinearGradient(cx + sx * r, cy + sy * r, cx, cy);
      rg.addColorStop(0, `rgba(150,215,255,${0.9 * (o.atm == null ? 1 : o.atm) * (1 - strip * 0.6)})`); rg.addColorStop(1, "rgba(150,215,255,0)");
      ctx.strokeStyle = rg; ctx.lineWidth = Math.max(2, r * 0.012);
      ctx.beginPath(); ctx.arc(cx, cy, r - ctx.lineWidth / 2, ang - 1.6, ang + 1.6); ctx.stroke();
      ctx.restore();
    }
    return { draw, proj };
  };

  /* ---------- Character rig ----------
     The SVG for a rig is built at authoring time (build/components). Each joint is an
     inner <g> rotated by GSAP about a pivot written in its own local coordinates. */
  Kit.JOINTS = {
    torso: [0, 0], head: [4, -150], uArmB: [4, -132], fArmB: [4, -66], uArmF: [4, -132], fArmF: [4, -66],
    thighB: [0, 0], shinB: [0, 96], footB: [0, 186], thighF: [0, 0], shinF: [0, 96], footF: [0, 186],
  };
  Kit.rigInit = function (prefix) {
    for (const [j, p] of Object.entries(Kit.JOINTS)) {
      const el = document.getElementById(`${prefix}-${j}`);
      if (el) gsap.set(el, { svgOrigin: `${p[0]} ${p[1]}` });
    }
  };
  Kit.POSES = {
    stand: { torso: 0, head: 0, uArmB: 6, fArmB: -8, uArmF: -4, fArmF: -10, thighB: 2, shinB: 0, footB: 0, thighF: -2, shinF: 0, footF: 0 },
    stretch: { torso: -4, head: -14, uArmB: 168, fArmB: 10, uArmF: 158, fArmF: 14, thighB: 2, shinB: 0, footB: 0, thighF: -2, shinF: 0, footF: 0 },
    surprise: { torso: 4, head: -8, uArmB: 70, fArmB: 40, uArmF: 95, fArmF: 55, thighB: 14, shinB: 16, footB: 10, thighF: -16, shinF: 30, footF: 12 },
    float: { torso: 6, head: -6, uArmB: 100, fArmB: 30, uArmF: 120, fArmF: 25, thighB: -20, shinB: 40, footB: 20, thighF: -42, shinF: 62, footF: 25 },
    swim: { torso: 10, head: -18, uArmB: 150, fArmB: 20, uArmF: 60, fArmF: 70, thighB: 20, shinB: 50, footB: 30, thighF: -30, shinF: 20, footF: 18 },
    flail: { torso: -8, head: 10, uArmB: 140, fArmB: -40, uArmF: 40, fArmF: 90, thighB: 35, shinB: 70, footB: 25, thighF: -50, shinF: 30, footF: 10 },
    limp: { torso: 14, head: 22, uArmB: 70, fArmB: 30, uArmF: 85, fArmF: 35, thighB: -18, shinB: 48, footB: 30, thighF: -28, shinF: 58, footF: 30 },
    sitBed: { torso: 0, head: 6, uArmB: 18, fArmB: -40, uArmF: 22, fArmF: -50, thighB: -88, shinB: 0, footB: 0, thighF: -90, shinF: 0, footF: 0 },
    lie: { torso: 0, head: 4, uArmB: 10, fArmB: -20, uArmF: 8, fArmF: -30, thighB: 0, shinB: 4, footB: -60, thighF: 0, shinF: 4, footF: -60 },
  };
  Kit.pose = function (tl, prefix, pose, at, dur = 0.6, ease = "power2.inOut", scale = 1) {
    const P = typeof pose === "string" ? Kit.POSES[pose] : pose;
    for (const [j, v] of Object.entries(P)) {
      const el = document.getElementById(`${prefix}-${j}`);
      if (!el) continue;
      if (dur <= 0) tl.set(el, { rotation: v * scale }, at);
      else tl.to(el, { rotation: v * scale, duration: dur, ease }, at);
    }
  };
  Kit.poseSet = function (prefix, pose) {
    const P = typeof pose === "string" ? Kit.POSES[pose] : pose;
    for (const [j, v] of Object.entries(P)) {
      const el = document.getElementById(`${prefix}-${j}`);
      if (el) gsap.set(el, { rotation: v });
    }
  };

  /* Camera on an HTML wrapper (transform-origin at frame centre): put world point
     (cx,cy) at the centre of the frame at scale s, rotated rot degrees. */
  Kit.shot = (o) => ({ x: -(o.s || 1) * (o.cx - 540), y: -(o.s || 1) * (o.cy - 960), scale: o.s || 1, rotation: o.rot || 0 });
  Kit.cam = function (tl, el, o, at, dur, ease = "power2.inOut") {
    const v = Kit.shot(o); if (o.blur != null) v.filter = `blur(${o.blur}px)`;
    if (dur <= 0) tl.set(el, v, at); else tl.to(el, Object.assign(v, { duration: dur, ease }), at);
  };
  Kit.grain = function (tl, el, dur) {
    const n = Math.max(1, Math.floor(dur / 0.5));
    tl.fromTo(el, { x: 0, y: 0 }, { x: -83, y: -57, duration: 0.5, ease: "steps(15)", repeat: n - 1 }, 0);
  };
  window.Kit = Kit;
})();
