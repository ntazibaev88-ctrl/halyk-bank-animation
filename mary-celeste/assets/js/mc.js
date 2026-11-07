/* Mary Celeste — shared motion helpers.
   Every helper is a pure function of timeline time: scenes seek frame by frame. */
(function () {
  const MC = (window.MC = {});

  /* Seeded PRNG (mulberry32): same numbers in preview and every render. */
  MC.rng = function (seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* Cue times written by tools/build.py from the voiceover timing. */
  MC.cues = (id) => JSON.parse(document.getElementById(id).textContent);
  /* Start (or end) of the first word in a segment that begins with `prefix`. */
  MC.word = (C, seg, prefix, which = "s") => {
    const w = C.seg[seg].w.find((x) => x[0].toLowerCase().replace(/[«»"]/g, "").startsWith(prefix.toLowerCase()));
    if (!w) throw new Error("cue word not found: " + seg + " " + prefix);
    return which === "s" ? w[1] : w[2];
  };

  /* Procedural layer: fn(t) runs on every seek with the scene-local time. */
  MC.drive = function (tl, dur, fn) {
    const p = { t: 0 };
    tl.fromTo(p, { t: 0 }, { t: dur, duration: dur, ease: "none", onUpdate: () => fn(p.t) }, 0);
    fn(0);
  };

  /* Keyframed values as a pure function of t: keys = [[t, {k: v}, "ease"], ...]
     (the ease names the move INTO that key). */
  MC.keys = function (keys) {
    const eases = keys.map((k) => gsap.parseEase(k[2] || "power2.inOut"));
    return function (t) {
      if (t <= keys[0][0]) return { ...keys[0][1] };
      for (let i = 1; i < keys.length; i++) {
        if (t <= keys[i][0]) {
          const [t0, a] = keys[i - 1], [t1, b] = keys[i];
          const k = eases[i]((t - t0) / (t1 - t0)), o = {};
          for (const key in b) o[key] = a[key] + (b[key] - a[key]) * k;
          return o;
        }
      }
      return { ...keys[keys.length - 1][1] };
    };
  };

  MC.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  MC.smooth = (x) => { x = MC.clamp(x); return x * x * (3 - 2 * x); };
  MC.lerp = (a, b, k) => a + (b - a) * k;

  /* Wrap the words of a title in .w spans (keeps <em>/<b> highlights as one word). */
  MC.split = function (el) {
    if (el.dataset.split) return [...el.querySelectorAll(".w")];
    const out = [];
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { out.push(document.createTextNode(" ")); return; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part; out.push(s);
        });
      } else if (n.nodeName === "BR") out.push(n);
      else { n.classList.add("w"); out.push(n); }
    });
    el.textContent = ""; out.forEach((n) => el.appendChild(n));
    el.dataset.split = "1";
    return [...el.querySelectorAll(".w")];
  };

  /* Title entrances — varied on purpose; a landed title holds still. */
  MC.blurWords = function (tl, el, at, o = {}) {
    const ws = MC.split(el);
    tl.fromTo(el, { opacity: 1 }, { opacity: 1, duration: 0.01 }, at);
    tl.fromTo(ws, { opacity: 0, filter: "blur(10px)" },
      { opacity: 1, filter: "blur(0px)", duration: o.dur || 0.22, ease: "power3.out", stagger: o.stagger || 0.08 }, at);
    return at + (o.stagger || 0.08) * ws.length + (o.dur || 0.22);
  };
  MC.slam = function (tl, el, at, o = {}) {
    tl.fromTo(el, { opacity: 0, scale: o.from || 1.35, filter: "blur(16px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: o.dur || 0.34, ease: "expo.out" }, at);
  };
  MC.letters = function (tl, el, at, o = {}) {
    const text = el.textContent; el.textContent = "";
    const ls = [...text].map((ch) => {
      const s = document.createElement("span"); s.className = "l"; s.textContent = ch; el.appendChild(s); return s;
    });
    tl.fromTo(el, { opacity: 1 }, { opacity: 1, duration: 0.01 }, at);
    tl.fromTo(ls, { opacity: 0.0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power2.out", stagger: o.stagger || 0.05 }, at);
  };
  MC.wipe = function (tl, el, at, o = {}) {
    tl.fromTo(el, { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: o.dur || 0.6, ease: "power3.inOut" }, at);
  };
  MC.out = function (tl, el, at, dur = 0.22) {
    tl.to(el, { opacity: 0, filter: "blur(8px)", duration: dur, ease: "power2.in" }, at);
  };
  /* Characters typed one by one (coordinates, dates). */
  MC.type = function (tl, el, at, cps = 28) {
    const text = el.textContent; const p = { n: 0 };
    el.textContent = "";
    tl.fromTo(el, { opacity: 1 }, { opacity: 1, duration: 0.01 }, at);
    tl.fromTo(p, { n: 0 }, { n: text.length, duration: text.length / cps, ease: "none",
      onUpdate: () => { el.textContent = text.slice(0, Math.round(p.n)); } }, at);
    return at + text.length / cps;
  };
  /* Number roll (years, counts). */
  MC.count = function (tl, el, at, from, to, dur, fmt = (v) => String(Math.round(v))) {
    const p = { v: from };
    el.textContent = fmt(from);
    tl.fromTo(p, { v: from }, { v: to, duration: dur, ease: "power2.inOut", onUpdate: () => { el.textContent = fmt(p.v); } }, at);
  };

  /* ───────────── layered 2.5D sea on a canvas ─────────────
     opts: { layers, storm (0..1), far, near, foam, seed }
     render(t, cam) where cam = { horizon, sway } */
  MC.sea = function (canvas, opts = {}) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const L = opts.layers || 7, storm = opts.storm ?? 0.6;
    const r = MC.rng(opts.seed || 7);
    const layers = [];
    for (let i = 0; i < L; i++) {
      const z = (i + 1) / L;
      layers.push({
        z,
        amp: (4 + 80 * Math.pow(z, 1.7)) * (0.45 + storm),
        len: 90 + 760 * Math.pow(z, 1.3),
        speed: (14 + 70 * z) * (0.6 + storm),
        ph: [r() * 6.28, r() * 6.28, r() * 6.28],
      });
    }
    const far = opts.far || [42, 64, 88], near = opts.near || [5, 10, 16];
    const col = (z, a = 1) => {
      const k = Math.pow(z, 0.8);
      return `rgba(${Math.round(MC.lerp(far[0], near[0], k))},${Math.round(MC.lerp(far[1], near[1], k))},${Math.round(MC.lerp(far[2], near[2], k))},${a})`;
    };
    function height(Ly, x, t) {
      const k = (2 * Math.PI) / Ly.len, w = t * Ly.speed;
      const a = Math.sin(k * (x + w) + Ly.ph[0]);
      const b = Math.sin(k * 0.47 * (x - w * 0.6) + Ly.ph[1]);
      const c = Math.sin(k * 2.3 * (x + w * 1.3) + Ly.ph[2]);
      const crest = 1 - Math.abs(a); // sharp crests, round troughs
      return -Ly.amp * (crest * crest * 0.9 + 0.35 * b + 0.12 * c);
    }
    const spread = opts.spread ?? 1.05;
    function baseY(Ly, horizon) { return horizon + Math.pow(Ly.z, 1.55) * (H - horizon) * spread + 8; }
    function render(t, cam = {}) {
      const horizon = cam.horizon ?? H * 0.45;
      ctx.clearRect(0, 0, W, H);
      const [i0, i1] = opts.only || [0, L - 1];
      for (let i = i0; i <= i1; i++) {
        const Ly = layers[i], by = baseY(Ly, horizon), sway = (cam.sway || 0) * Ly.z;
        ctx.beginPath(); ctx.moveTo(-20, H + 20);
        const step = 6;
        for (let x = -20; x <= W + 20; x += step) ctx.lineTo(x, by + height(Ly, x + sway, t));
        ctx.lineTo(W + 20, H + 20); ctx.closePath();
        const g = ctx.createLinearGradient(0, by - Ly.amp, 0, by + 260 * Ly.z + 40);
        g.addColorStop(0, col(Ly.z * 0.85)); g.addColorStop(1, col(Math.min(1, Ly.z * 1.25)));
        ctx.fillStyle = g; ctx.fill();
        if (Ly.z > 0.3) { // foam on the crests
          ctx.lineWidth = 1.5 + 4 * Ly.z;
          ctx.strokeStyle = `rgba(190,205,220,${(0.04 + 0.08 * Ly.z) * (opts.foam ?? 1)})`;
          ctx.beginPath();
          let pen = false;
          for (let x = -20; x <= W + 20; x += step) {
            const y = by + height(Ly, x + sway, t), y2 = by + height(Ly, x + sway + step, t);
            const steep = (y - y2) / step;
            if (steep > 0.12 + 0.2 * (1 - storm)) { if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y); }
            else pen = false;
          }
          ctx.stroke();
        }
      }
    }
    render.height = (layerIndex, x, t, horizon) => {
      const Ly = layers[layerIndex]; return baseY(Ly, horizon ?? H * 0.45) + height(Ly, x, t);
    };
    render.layers = layers;
    return render;
  };

  /* Drifting motes / rain / spray on a canvas, from t alone. */
  MC.motes = function (canvas, o = {}) {
    const ctx = canvas.getContext("2d"), W = canvas.width, H = canvas.height;
    const r = MC.rng(o.seed || 3), n = o.count || 120, ps = [];
    for (let i = 0; i < n; i++) ps.push({ x: r() * W, y: r() * H, z: 0.3 + r() * 0.7, ph: r() * 6.28, s: 0.6 + r() * 1.6 });
    const vx = o.vx ?? 8, vy = o.vy ?? -4, color = o.color || "220,228,236";
    return function (t, alpha = 1) {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        let x = (p.x + vx * t * p.z + 14 * Math.sin(t * 0.6 + p.ph)) % W; if (x < 0) x += W;
        let y = (p.y + vy * t * p.z + 10 * Math.cos(t * 0.5 + p.ph)) % H; if (y < 0) y += H;
        const tw = 0.55 + 0.45 * Math.sin(t * 1.7 + p.ph * 3);
        const a = alpha * (o.alpha ?? 0.5) * p.z * tw * (o.mask ? o.mask(x, y) : 1);
        if (a <= 0.003) continue;
        if (o.streak) {
          ctx.strokeStyle = `rgba(${color},${a})`; ctx.lineWidth = p.s * 0.8;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - o.streak * 0.35, y + o.streak * p.z); ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${color},${a})`;
          ctx.beginPath(); ctx.arc(x, y, p.s * p.z * (o.size || 1.6), 0, 6.283); ctx.fill();
        }
      }
    };
  };
})();
