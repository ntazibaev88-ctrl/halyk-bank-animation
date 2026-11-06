/* Timeline for "KASPI VS HALYK — КТО СИЛЬНЕЕ В 2026 ГОДУ?" (90 s, 1080x1920, 30 fps).
   One paused GSAP timeline drives everything; Hyperframes seeks it frame by frame. */
(function () {
  const A = window.ART, C = A.C;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const put = (sel, html) => { const e = $(sel); e.innerHTML = html; return e; };
  const tl = gsap.timeline({ paused: true });
  const VO = window.VO.scenes;
  const BOUNDS = [0, 8, 21, 34, 48, 64, 78, 90];

  // Absolute time of the n-th spoken word that starts with `prefix` in a scene.
  function W(scene, prefix, n = 0) {
    const ws = VO[scene - 1].words.filter(w => w.w.replace(/[^\wА-Яа-яЁё-]/g, "").toLowerCase().startsWith(prefix.toLowerCase()));
    if (!ws[n]) throw new Error(`word ${prefix} not found in scene ${scene}`);
    return ws[n].s;
  }
  const r = A.rng(2026);

  /* ---------------- counters (evaluated from the timeline clock) ---------------- */
  const counters = [];
  function counter(key, t0, dur, to, dec = 2) {
    $$(`[data-k="${key}"]`).forEach(el => counters.push({ el, t0, dur, to, dec }));
  }
  const fmt = (v, d) => v.toFixed(d).replace(".", ",");
  function renderCounters() {
    const t = tl.time();
    for (const c of counters) {
      let p = Math.min(1, Math.max(0, (t - c.t0) / c.dur));
      p = 1 - Math.pow(1 - p, 3);
      const txt = fmt(c.to * p, c.dec);
      if (c.el.textContent !== txt) c.el.textContent = txt;
    }
  }

  /* ---------------- character helpers ---------------- */
  function heroAt(sel, opts) { put(sel, A.hero(opts)); return sel; }
  function breathe(sel, t0, t1) {
    const n = Math.max(1, Math.floor((t1 - t0) / 1.3));
    tl.fromTo(`${sel} .torso`, { scaleY: 1 }, { scaleY: 1.025, svgOrigin: "120 340", duration: 0.65, ease: "sine.inOut", yoyo: true, repeat: n * 2 - 1 }, t0);
    tl.fromTo(`${sel} .head`, { y: 0 }, { y: -3, duration: 0.65, ease: "sine.inOut", yoyo: true, repeat: n * 2 - 1 }, t0);
  }
  function blink(sel, t) {
    tl.to(`${sel} .eyes`, { scaleY: 0.1, svgOrigin: "120 113", duration: 0.06, yoyo: true, repeat: 1 }, t);
  }
  function walk(sel, t0, t1, step = 0.3) {
    const n = Math.max(1, Math.round((t1 - t0) / step));
    tl.fromTo(`${sel} .legL`, { rotation: -16 }, { rotation: 16, svgOrigin: "103 322", duration: step, ease: "sine.inOut", yoyo: true, repeat: n - 1 }, t0);
    tl.fromTo(`${sel} .legR`, { rotation: 16 }, { rotation: -16, svgOrigin: "137 322", duration: step, ease: "sine.inOut", yoyo: true, repeat: n - 1 }, t0);
    tl.fromTo(`${sel} .armL`, { rotation: 14 }, { rotation: -14, svgOrigin: "66 200", duration: step, ease: "sine.inOut", yoyo: true, repeat: n - 1 }, t0);
    tl.fromTo(`${sel} .armR`, { rotation: -14 }, { rotation: 14, svgOrigin: "174 200", duration: step, ease: "sine.inOut", yoyo: true, repeat: n - 1 }, t0);
    tl.fromTo(`${sel} .body`, { y: 0 }, { y: -8, duration: step / 2, ease: "sine.inOut", yoyo: true, repeat: n * 2 - 1 }, t0);
    // settle limbs at the end
    tl.to([`${sel} .legL`, `${sel} .legR`, `${sel} .armL`, `${sel} .armR`], { rotation: 0, duration: 0.2 }, t0 + n * step);
  }
  function look(sel, t, deg, dur = 0.35) {
    tl.to(`${sel} .head`, { rotation: deg, svgOrigin: "120 170", duration: dur, ease: "power2.inOut" }, t);
  }

  /* ---------------- shared layers ---------------- */
  // stars
  const stars = $("#stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("div"); s.className = "star";
    const sz = 2 + r() * 4; Object.assign(s.style, { left: `${r() * 1080}px`, top: `${r() * 1250}px`, width: `${sz}px`, height: `${sz}px`, opacity: (0.2 + r() * 0.6).toFixed(2) });
    stars.appendChild(s);
    const d = 1.2 + r() * 2.2;
    tl.to(s, { opacity: 0.05, duration: d, ease: "sine.inOut", yoyo: true, repeat: Math.max(0, Math.floor(90 / d) - 1) }, r() * 2);
  }
  tl.to("#bg .glowK", { x: 180, y: -120, duration: 45, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
  tl.to("#bg .glowH", { x: -180, y: 120, duration: 45, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
  tl.fromTo("#bg .grid", { backgroundPositionY: "0px" }, { backgroundPositionY: "900px", duration: 90, ease: "none" }, 0);
  tl.fromTo("#topbar .prog", { scaleX: 0 }, { scaleX: 1, duration: 90, ease: "none" }, 0);
  tl.from("#topbar .tag, #topbar .yr", { opacity: 0, y: -20, duration: 0.6 }, 0.4);

  // scene visibility
  gsap.set(".scene", { autoAlpha: 0 });
  gsap.set("#s1", { autoAlpha: 1 });
  for (let i = 1; i < 7; i++) {
    tl.set(`#s${i}`, { autoAlpha: 0 }, BOUNDS[i]);
    tl.set(`#s${i + 1}`, { autoAlpha: 1 }, BOUNDS[i]);
  }
  // gentle camera drift on each scene
  for (let i = 2; i <= 6; i++) {
    tl.fromTo(`#s${i} .cam`, { scale: 1.035 }, { scale: 1, duration: BOUNDS[i] - BOUNDS[i - 1], ease: "sine.out" }, BOUNDS[i - 1]);
  }

  // transitions: red and green doors close on the cut, then open again
  function wipe(t) {
    tl.fromTo("#wipe .wk", { x: 0 }, { x: 1280, duration: 0.32, ease: "power3.in" }, t - 0.32);
    tl.fromTo("#wipe .wh", { x: 0 }, { x: -1280, duration: 0.32, ease: "power3.in" }, t - 0.32);
    tl.fromTo("#wipe .seam", { opacity: 0 }, { opacity: 1, duration: 0.08, yoyo: true, repeat: 1 }, t - 0.06);
    tl.to("#wipe .wk", { x: 0, duration: 0.42, ease: "power3.out" }, t + 0.04);
    tl.to("#wipe .wh", { x: 0, duration: 0.42, ease: "power3.out" }, t + 0.04);
  }
  [8, 21, 34, 48, 64, 78].forEach(wipe);

  function heading(s, t) {
    tl.from(`#s${s} .head .chip`, { y: -30, opacity: 0, duration: 0.4, ease: "power3.out" }, t);
    tl.from(`#s${s} .head .h`, { y: 40, opacity: 0, duration: 0.5, ease: "power3.out" }, t + 0.08);
    tl.from(`#s${s} .head .bar`, { scaleX: 0, duration: 0.5, ease: "power3.out" }, t + 0.25);
  }
  function flash(t, a = 0.7) { tl.fromTo("#flash", { opacity: a }, { opacity: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, t); }
  function shake(sel, t, amp = 14) {
    tl.to(sel, { keyframes: { x: [0, amp, -amp * 0.8, amp * 0.5, -amp * 0.3, 0], y: [0, -amp * 0.5, amp * 0.4, -amp * 0.2, 0, 0] }, duration: 0.4, ease: "none" }, t);
  }

  /* ================= SCENE 1 — HOOK (0–8) ================= */
  put("#s1 .far", A.skyline(3, "#1A2350", 640));
  put("#s1 .near", A.skyline(9, "#10172F", 420));
  put("#s1 .tk", A.kaspiTower()); put("#s1 .th", A.halykTower());
  heroAt("#s1 .heroW"); put("#s1 .cardK", A.card("kaspi")); put("#s1 .cardH", A.card("halyk"));
  tl.fromTo("#s1 .cam", { scale: 1.45 }, { scale: 1, transformOrigin: "50% 60%", duration: 3.0, ease: "power2.inOut" }, 0);
  tl.to("#s1 .cam", { scale: 1.06, duration: 5, ease: "sine.inOut" }, 3.0);
  tl.from("#s1 .far", { y: 120, duration: 3, ease: "power2.out" }, 0);
  tl.from("#s1 .near", { y: 200, duration: 3, ease: "power2.out" }, 0);
  tl.from("#s1 .tk", { y: 900, duration: 1.5, ease: "power3.out" }, 0.15);
  tl.from("#s1 .th", { y: 900, duration: 1.5, ease: "power3.out" }, 0.4);
  ["#s1 .tk", "#s1 .th"].forEach((sel, j) => {
    const lit = $$(`${sel} .win.lit`); const rr = A.rng(40 + j);
    const delays = lit.map(() => rr() * 1.3);
    tl.from(lit, { opacity: 0, duration: 0.15, stagger: (i) => delays[i] }, 0.9 + j * 0.2);
    tl.to(`${sel} .beacon`, { opacity: 0.15, duration: 0.5, yoyo: true, repeat: 15 }, 0.5);
  });
  breathe("#s1 .heroW", 0, 8);
  look("#s1 .heroW", 1.0, -9); look("#s1 .heroW", 1.9, 9); look("#s1 .heroW", 2.8, 0);
  blink("#s1 .heroW", 2.4); blink("#s1 .heroW", 5.6);
  tl.from("#s1 .heroW", { opacity: 0, y: 40, duration: 0.6 }, 0.05);
  // cards fly out of the towers towards the viewer
  tl.from("#s1 .cardK", { x: 140, y: -640, scale: 0.15, rotation: -120, opacity: 0, duration: 1.0, ease: "back.out(1.4)" }, 1.55);
  tl.from("#s1 .cardH", { x: -140, y: -640, scale: 0.15, rotation: 120, opacity: 0, duration: 1.0, ease: "back.out(1.4)" }, 1.95);
  tl.set("#s1 .cardK", { rotation: -10 }, 2.56); tl.set("#s1 .cardH", { rotation: 10 }, 2.96);
  tl.to("#s1 .cardK", { y: -18, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 3 }, 3.0);
  tl.to("#s1 .cardH", { y: -18, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 3 }, 3.3);
  // title slam
  tl.from("#s1 .t1", { x: -1100, duration: 0.42, ease: "power4.out" }, 2.85);
  tl.from("#s1 .t3", { x: 1100, duration: 0.42, ease: "power4.out" }, 2.85);
  tl.from("#s1 .t2", { scale: 4, opacity: 0, duration: 0.35, ease: "power4.in" }, 2.95);
  tl.from("#s1 .shade1", { opacity: 0, duration: 0.5 }, 2.75);
  flash(3.28, 0.8); shake("#s1 .cam", 3.28, 18); shake("#s1 .title", 3.28, 10);
  tl.from("#s1 .t4", { y: 40, opacity: 0, duration: 0.5, ease: "back.out(2)" }, 5.0);
  [[W(1, "kaspi"), ".t1", ".tk .glow"], [W(1, "halyk"), ".t3", ".th .glow"]].forEach(([t, txt, glow]) => {
    tl.to(`#s1 ${txt}`, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, t);
    tl.to(`#s1 ${glow}`, { opacity: 0.95, duration: 0.25, yoyo: true, repeat: 1 }, t);
  });

  /* ================= SCENE 2 — MONEY (8–21) ================= */
  heading(2, 8.15);
  put("#s2 .vK", A.vault("kaspi")); put("#s2 .vH", A.vault("halyk"));
  tl.from("#s2 .n2", { opacity: 0, duration: 0.5 }, 8.7);
  tl.from("#s2 .vK", { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(1.6)" }, 8.4);
  tl.from("#s2 .vH", { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(1.6)" }, 8.55);
  tl.from("#s2 .lK, #s2 .lH", { y: 20, opacity: 0, duration: 0.4, stagger: 0.12 }, 8.9);
  tl.to("#s2 .wheel", { rotation: 540, svgOrigin: "200 200", duration: 1.1, ease: "power2.inOut" }, 8.9);
  tl.to("#s2 .door", { scaleX: 0.08, skewY: -8, svgOrigin: "40 200", duration: 0.7, ease: "power2.in" }, 10.0);
  tl.from("#s2 .gold", { y: 140, opacity: 0, duration: 0.8, ease: "back.out(1.5)" }, 10.35);
  // coins rain
  const coinLayer = $("#s2 .coins");
  for (let i = 0; i < 26; i++) {
    const c = document.createElement("div"); c.className = "abs"; c.innerHTML = A.coin(44 + Math.round(r() * 30));
    Object.assign(c.style, { left: `${(i % 2 ? 560 : 30) + r() * 460}px`, top: "-120px" }); coinLayer.appendChild(c);
    const t0 = 10.3 + r() * 9.2, d = 2.2 + r() * 1.2;
    tl.fromTo(c, { y: 0, rotation: 0, opacity: 0.85 }, { y: 1500, rotation: (r() - 0.5) * 720, duration: d, ease: "power1.in" }, t0);
  }
  const tA = W(2, "активы") - 0.25, tE = W(2, "капитал") - 0.45;
  tl.from("#s2 .m1", { y: 60, opacity: 0, duration: 0.5, ease: "power3.out" }, tA);
  tl.fromTo("#s2 .m1 .row:nth-of-type(2) .fill", { scaleX: 0 }, { scaleX: 11.08 / 20.91, duration: 1.6, ease: "power3.out" }, tA + 0.25);
  tl.fromTo("#s2 .m1 .row:nth-of-type(3) .fill", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power3.out" }, tA + 0.25);
  counter("a1", tA + 0.25, 1.6, 11.08); counter("a2", tA + 0.25, 1.6, 20.91);
  tl.from("#s2 .m2", { y: 60, opacity: 0, duration: 0.5, ease: "power3.out" }, tE);
  tl.fromTo("#s2 .m2 .row:nth-of-type(2) .fill", { scaleX: 0 }, { scaleX: 2.60 / 3.50, duration: 1.6, ease: "power3.out" }, tE + 0.25);
  tl.fromTo("#s2 .m2 .row:nth-of-type(3) .fill", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power3.out" }, tE + 0.25);
  counter("e1", tE + 0.25, 1.6, 2.60); counter("e2", tE + 0.25, 1.6, 3.50);
  const tS = W(2, "удивить") - 0.15;
  tl.to("#s2 .lK, #s2 .lH", { opacity: 0, duration: 0.2 }, tS - 0.2);
  tl.from("#s2 .sbadge", { scale: 0.2, opacity: 0, duration: 0.45, ease: "back.out(2.2)" }, tS);
  tl.to("#s2 .m1 .row:nth-of-type(3) .val", { scale: 1.15, duration: 0.25, yoyo: true, repeat: 3, transformOrigin: "100% 50%" }, tS + 0.2);

  /* ================= SCENE 3 — PROFIT (21–34) ================= */
  heading(3, 21.15);
  put("#s3 .fK", A.factory("kaspi")); put("#s3 .fH", A.factory("halyk")); heroAt("#s3 .heroW");
  tl.from("#s3 .n3", { opacity: 0, duration: 0.5 }, 21.6);
  tl.from("#s3 .fK", { y: 260, opacity: 0, duration: 0.7, ease: "back.out(1.3)" }, 21.3);
  tl.from("#s3 .fH", { y: 260, opacity: 0, duration: 0.7, ease: "back.out(1.3)" }, 21.45);
  tl.from("#s3 .heroW", { y: 120, opacity: 0, duration: 0.6 }, 21.6);
  ["#s3 .fK", "#s3 .fH"].forEach((f, j) => {
    tl.fromTo(`${f} .gear`, { rotation: 0 }, { rotation: 720, transformOrigin: "50% 50%", duration: 13, ease: "none" }, 21);
    tl.fromTo(`${f} .gear2`, { rotation: 0 }, { rotation: -1180, transformOrigin: "50% 50%", duration: 13, ease: "none" }, 21);
    $$(`${f} .smoke`).forEach((s, i) => tl.fromTo(s, { y: 0, scale: 0.6, opacity: 0.75 }, { y: -105, scale: 1.5, opacity: 0, duration: 1.7, ease: "power1.out", repeat: 6, svgOrigin: "330 40" }, 21.4 + i * 0.57 + j * 0.2));
    $$(`${f} .note`).forEach((n, i) => tl.fromTo(n, { x: 200, y: 336, scale: 0.4, opacity: 0 }, { keyframes: { x: [200, 300, 400, 470], y: [336, 336, 336, 300], scale: [0.4, 1, 1, 1], opacity: [0, 1, 1, 0] }, duration: 2.0, ease: "none", repeat: 1 }, 21.9 + i * 0.42 + j * 0.15));
  });
  breathe("#s3 .heroW", 21.6, 25.5);
  look("#s3 .heroW", 22.4, -10); look("#s3 .heroW", 23.4, 10); look("#s3 .heroW", 24.4, 0); blink("#s3 .heroW", 23.0);
  const tC = 25.2;
  tl.to("#s3 .fK, #s3 .fH, #s3 .heroW", { y: 380, opacity: 0, scale: 0.8, duration: 0.6, ease: "power2.in", stagger: 0.05 }, tC - 0.3);
  // build chart
  const chart = $("#s3 .chart");
  const data = [["2023", 0.85, 0.69], ["2024", 1.06, 0.92], ["2025", 1.07, 1.06]];
  data.forEach(([yr, k, h], i) => {
    const g = document.createElement("div"); g.className = "grp"; g.style.left = `${56 + i * 293}px`;
    const hk = (k / 1.12) * 330, hh = (h / 1.12) * 330;
    g.innerHTML = `<div class="bar bk" style="left:24px;height:${hk}px;background:linear-gradient(180deg,#FF6B57,${C.kaspiDark})"></div>
      <div class="bar bh" style="left:140px;height:${hh}px;background:linear-gradient(180deg,#36D18A,${C.halykDark})"></div>
      <div class="bv vk" style="left:2px;top:${360 - hk - 42}px">${fmt(k, 2)}</div><div class="bv vh" style="left:118px;top:${360 - hh - 42}px">${fmt(h, 2)}</div>`;
    chart.appendChild(g);
    const y = document.createElement("div"); y.className = "yr"; y.style.left = `${56 + i * 293}px`; y.textContent = yr; chart.appendChild(y);
  });
  const eq = document.createElement("div"); eq.className = "abs pill eq";
  Object.assign(eq.style, { left: "640px", top: "52px", fontSize: "22px", background: C.gold, color: "#1A1408" }); eq.textContent = "≈ ПОРОВНУ";
  chart.appendChild(eq);
  const legend = $("#s3 .legend"); legend.style.top = "516px"; legend.style.right = "auto"; legend.style.left = "0"; legend.style.width = "960px"; legend.style.textAlign = "center";
  $("#s3 .chart").style.height = "560px";
  tl.from("#s3 .chart", { y: 80, opacity: 0, duration: 0.55, ease: "power3.out" }, tC);
  $$("#s3 .grp").forEach((g, i) => {
    tl.from($$(".bar", g), { scaleY: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }, tC + 0.5 + i * 0.6);
    tl.from($$(".bv", g), { opacity: 0, y: 20, duration: 0.3, stagger: 0.12 }, tC + 0.95 + i * 0.6);
  });
  tl.from("#s3 .yr", { opacity: 0, duration: 0.4, stagger: 0.2 }, tC + 0.4);
  tl.from("#s3 .eq", { scale: 0.3, opacity: 0, duration: 0.4, ease: "back.out(2)" }, tC + 2.6);
  const tG = W(3, "зарабатывает") - 0.2;
  tl.from("#s3 .g1", { y: 30, opacity: 0, duration: 0.4, ease: "back.out(2)" }, tG);
  tl.from("#s3 .g2", { y: 30, opacity: 0, duration: 0.4, ease: "back.out(2)" }, tG + 0.3);
  const tR = W(3, "расходов") - 0.1;
  tl.from("#s3 .rk", { x: -80, opacity: 0, duration: 0.5, ease: "power3.out" }, tR);
  tl.from("#s3 .rh", { x: 80, opacity: 0, duration: 0.5, ease: "power3.out" }, tR + 0.25);
  counter("r1", tR + 0.2, 1.3, 4.05); counter("r2", tR + 0.45, 1.3, 1.29);

  /* ================= SCENE 4 — DEVELOPMENT (34–48) ================= */
  heading(4, 34.15);
  put("#s4 .svL", A.server()); put("#s4 .svR", A.server()); put("#s4 .ph", A.phone());
  put("#s4 .dvL", A.dev("kaspi", 3)); put("#s4 .dvR", A.dev("halyk", 8)); put("#s4 .mg", A.megaphone());
  tl.from("#s4 .svL", { x: -200, opacity: 0, duration: 0.6, ease: "power3.out" }, 34.3);
  tl.from("#s4 .svR", { x: 200, opacity: 0, duration: 0.6, ease: "power3.out" }, 34.4);
  $$("#s4 .led").forEach((l, i) => { const d = 0.18 + r() * 0.5; tl.to(l, { opacity: 0.15, duration: d, yoyo: true, repeat: Math.floor(7 / d) }, 34.5 + r() * 0.6); });
  tl.from("#s4 .ph", { y: 260, scale: 0.8, opacity: 0, duration: 0.7, ease: "back.out(1.4)" }, 34.5);
  tl.from($$("#s4 .ph .u"), { y: -60, opacity: 0, duration: 0.35, ease: "back.out(2)", stagger: 0.17 }, 35.1);
  tl.from("#s4 .dvL", { x: -300, opacity: 0, duration: 0.6, ease: "power3.out" }, 34.8);
  tl.from("#s4 .dvR", { x: 300, opacity: 0, duration: 0.6, ease: "power3.out" }, 35.0);
  $$("#s4 .code").forEach((c, i) => tl.fromTo(c, { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 0.4, ease: "steps(6)", repeat: 4, repeatDelay: 0.9 }, 35.3 + (i % 5) * 0.22));
  tl.from("#s4 .mg", { scale: 0, rotation: -30, opacity: 0, duration: 0.5, ease: "back.out(2)" }, 36.6);
  $$("#s4 .wave").forEach((w, i) => tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: 0.25, yoyo: true, repeat: 9, ease: "none" }, 36.9 + i * 0.12));
  // icon badges for the spoken keywords
  const icons = $("#s4 .icons");
  const iconDefs = [["chip", "ТЕХНОЛОГИИ", 228, 560, W(4, "технологии")], ["app", "ПРИЛОЖЕНИЯ", 702, 560, W(4, "приложения")],
    ["shield", "БЕЗОПАСНОСТЬ", 228, 760, W(4, "безопасность")], ["rocket", "РАЗВИТИЕ", 702, 760, W(4, "развитие")]];
  iconDefs.forEach(([ic, label, x, y, t], i) => {
    const d = document.createElement("div"); d.className = "abs ib";
    Object.assign(d.style, { left: `${x}px`, top: `${y}px`, width: "150px", textAlign: "center" });
    const col = i % 2 ? C.halyk : C.kaspi;
    d.innerHTML = `<div style="margin:0 auto;width:112px;height:112px;border-radius:30px;background:${col};display:flex;align-items:center;justify-content:center;box-shadow:0 14px 40px rgba(0,0,0,.45)">${A.icon(ic, 72)}</div><div style="margin-top:10px;font-family:Mont;font-weight:900;font-size:17px;letter-spacing:.5px">${label}</div>`;
    icons.appendChild(d);
    tl.from(d, { scale: 0, opacity: 0, rotation: -25, duration: 0.45, ease: "back.out(2.4)" }, t - 0.05);
    tl.to(d, { y: -10, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 3 }, t + 0.5);
  });
  // data packets between servers and the phone
  const lines = $("#s4 .lines");
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("div"); p.className = "abs";
    const left = i % 2 === 0;
    Object.assign(p.style, { left: left ? "210px" : "850px", top: `${560 + (i % 4) * 70}px`, width: "16px", height: "16px", borderRadius: "50%", background: left ? "#FF8A7A" : "#49DB93", boxShadow: `0 0 18px 4px ${left ? "rgba(241,70,53,.8)" : "rgba(20,167,94,.8)"}` });
    lines.appendChild(p);
    tl.fromTo(p, { x: 0, opacity: 0 }, { keyframes: { x: [0, left ? 90 : -90, left ? 180 : -180], opacity: [0, 1, 0] }, duration: 0.9, ease: "none", repeat: 5, repeatDelay: 0.25 }, 35.2 + i * 0.17);
  }
  const tT = W(4, "но") - 0.15;
  tl.to("#s4 .lab", { opacity: 0.1, scale: 0.94, duration: 0.6, ease: "power2.inOut" }, tT);
  [".d1", ".d2", ".d3"].forEach((d, i) => {
    tl.from(`#s4 ${d}`, { y: 70, opacity: 0, duration: 0.5, ease: "power3.out" }, tT + 0.2 + i * 1.0);
    tl.from(`#s4 ${d} .cell.nd`, { scale: 1.35, rotation: -4, opacity: 0, duration: 0.3, ease: "power4.in", stagger: 0.1 }, tT + 0.6 + i * 1.0);
  });
  tl.from("#s4 .fn4", { opacity: 0, duration: 0.5 }, tT + 3.2);
  tl.from("#s4 .tbl .note:last-child", { opacity: 0, duration: 0.5 }, tT + 3.5);

  /* ================= SCENE 5 — SERVICES (48–64) ================= */
  heading(5, 48.15);
  put("#s5 .kPhone", A.phone()); put("#s5 .kPhone2", A.phone()); put("#s5 .kCoin", A.coin(60)); put("#s5 .kQr", A.qrCode(77, 170));
  put("#s5 .kBag1", A.bag(C.kaspi)); put("#s5 .kBag2", A.bag("#FF8A7A")); put("#s5 .hAtm", A.atm()); put("#s5 .hCard", A.card("halyk"));
  put("#s5 .hWaves", `<svg viewBox="0 0 140 140">${[0, 1, 2].map(i => `<path class="hw" d="M${30 + i * 26},${40 - i * 12} q${24 + i * 10},${30 + i * 12} 0,${60 + i * 24}" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>`).join("")}</svg>`);
  put("#s5 .hPig", `<div style="width:150px;height:150px;border-radius:44px;background:${C.halykDark};display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(0,0,0,.4)">${A.icon("deposit", 110)}</div>`);
  put("#s5 .hCoin", A.coin(56)); heroAt("#s5 .heroW");
  tl.from("#s5 .wK", { x: -700, duration: 0.8, ease: "power3.out" }, 48.2);
  tl.from("#s5 .wH", { x: 700, duration: 0.8, ease: "power3.out" }, 48.2);
  const props = ["kPhone", "kPhone2", "kQr", "kBag1", "kBag2", "hAtm", "hCard", "hPig"].map(c => `#s5 .${c}`);
  tl.from(props, { scale: 0, opacity: 0, duration: 0.45, ease: "back.out(2)", stagger: 0.1 }, 48.6);
  tl.from("#s5 .kBeam, #s5 .kCoin, #s5 .hWaves, #s5 .hCoin", { opacity: 0, duration: 0.2 }, 49.6);
  // hero walks in between the two worlds
  tl.fromTo("#s5 .heroW", { y: 560, scale: 0.75 }, { y: 0, scale: 1, duration: 2.2, ease: "power1.out" }, 48.4);
  walk("#s5 .heroW", 48.4, 50.6, 0.3);
  breathe("#s5 .heroW", 50.8, 56.2);
  look("#s5 .heroW", 51.0, -12); look("#s5 .heroW", 52.6, 12); look("#s5 .heroW", 54.2, 0);
  tl.to("#s5 .heroW .armL", { rotation: 40, svgOrigin: "66 200", duration: 0.35, yoyo: true, repeat: 1, repeatDelay: 0.8 }, 51.1);
  tl.to("#s5 .heroW .armR", { rotation: -40, svgOrigin: "174 200", duration: 0.35, yoyo: true, repeat: 1, repeatDelay: 0.8 }, 52.7);
  blink("#s5 .heroW", 53.2); blink("#s5 .heroW", 55.4);
  // mini examples: transfer, QR scan, card tap, deposit
  tl.fromTo("#s5 .kCoin", { x: 0, y: 0 }, { keyframes: { x: [0, 60, 120, 150], y: [0, -90, -60, 20] }, duration: 0.9, ease: "none", repeat: 4, repeatDelay: 0.45 }, 49.8);
  tl.fromTo("#s5 .kBeam", { y: 0 }, { y: 162, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 9 }, 49.6);
  tl.fromTo("#s5 .hCard", { x: 0, rotation: 0 }, { x: 70, rotation: 10, duration: 0.45, ease: "power2.inOut", yoyo: true, repeat: 7, repeatDelay: 0.2 }, 49.7);
  $$("#s5 .hw").forEach((w, i) => tl.fromTo(w, { opacity: 0.1 }, { opacity: 1, duration: 0.3, yoyo: true, repeat: 11, ease: "none" }, 49.8 + i * 0.1));
  tl.fromTo("#s5 .hCoin", { y: -60, opacity: 1 }, { y: 70, opacity: 0, duration: 0.75, ease: "power2.in", repeat: 5, repeatDelay: 0.3 }, 50.0);
  tl.to("#s5 .kBag1, #s5 .kBag2", { y: -16, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: 9, stagger: 0.2 }, 49.6);
  // services grid
  const tGrid = 56.45;
  tl.to("#s5 .worlds", { opacity: 0.12, scale: 0.92, duration: 0.6, ease: "power2.inOut" }, tGrid - 0.2);
  tl.from("#s5 .sgrid", { y: 90, opacity: 0, duration: 0.55, ease: "power3.out" }, tGrid);
  const svc = [["app", "Мобильное приложение"], ["transfer", "Переводы"], ["cashback", "Кешбэк и бонусы"], ["deposit", "Депозиты"], ["loan", "Кредиты"], ["installment", "Рассрочка"], ["qr", "QR-платежи"]];
  const grid = $("#s5 .sgrid");
  const tick = `<svg viewBox="0 0 100 100" width="40" height="40"><path d="M22,54 L42,72 L78,30" stroke="#fff" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  svc.forEach(([ic, label], i) => {
    const row = document.createElement("div"); row.className = "srow"; row.style.top = `${92 + i * 118}px`;
    row.innerHTML = `<div class="ic">${A.icon(ic, 64)}</div><div class="t">${label}</div>
      <div class="chk ck" style="left:576px;background:${C.kaspi};box-shadow:0 0 24px rgba(241,70,53,.6)">${tick}</div>
      <div class="chk ch" style="left:776px;background:${C.halyk};box-shadow:0 0 24px rgba(20,167,94,.6)">${tick}</div>`;
    grid.appendChild(row);
    const t = tGrid + 0.5 + i * 0.72;
    tl.from(row, { x: -60, opacity: 0, duration: 0.4, ease: "power3.out" }, t);
    tl.from($(".ic", row), { rotation: -30, scale: 0.4, duration: 0.45, ease: "back.out(3)" }, t);
    tl.from($(".ck", row), { scale: 0, duration: 0.35, ease: "back.out(3)" }, t + 0.22);
    tl.from($(".ch", row), { scale: 0, duration: 0.35, ease: "back.out(3)" }, t + 0.4);
  });
  tl.from("#s5 .fn5", { opacity: 0, duration: 0.5 }, tGrid + 5.7);

  /* ================= SCENE 6 — WINNERS (64–78) ================= */
  heading(6, 64.15);
  const BAD = {
    halyk: [`background:${C.halyk}`, "HALYK", ""], kaspi: [`background:${C.kaspi}`, "KASPI", ""],
    tie: [`background:${C.gold};color:#1A1408`, "ПОЧТИ<br>ПОРОВНУ", "small"],
    dep: ["background:rgba(255,255,255,.1);border:3px solid rgba(255,255,255,.75)", "ЗАВИСИТ ОТ ПОТРЕБНОСТЕЙ КЛИЕНТА", "small"],
    nd: ["background:rgba(255,255,255,.04);border:3px dashed rgba(255,255,255,.4);color:#C9D0E8", "НЕТ СОПОСТАВИМЫХ ДАННЫХ", "small"],
  };
  const cats = [["bank", "Финансовый масштаб", "активы 20,91 vs 11,08 трлн ₸", "halyk"],
    ["profit", "Чистая прибыль 2025", "1,07 vs 1,06 трлн ₸ — разница ≈1%", "tie"],
    ["eco", "Цифровая экосистема", "супер-приложение и маркетплейс", "kaspi"],
    ["bank", "Банковские услуги", "базовый набор есть у обоих", "dep"],
    ["chip", "Развитие технологий", "Halyk не раскрывает ИТ-расходы", "nd"],
    ["hand", "Повседневное удобство", "зависит от привычек и задач клиента", "dep"]];
  const score = $("#s6 .score");
  cats.forEach(([ic, t, d, b], i) => {
    const row = document.createElement("div"); row.className = "sb"; row.style.top = `${10 + i * 138}px`;
    const [st, txt, cls] = BAD[b];
    row.innerHTML = `<div class="ic">${A.icon(ic, 72)}</div><div class="t">${t}</div><div class="d">${d}</div><div class="badge ${cls}" style="${st}">${txt}</div>`;
    score.appendChild(row);
    tl.from(row, { x: -90, opacity: 0, duration: 0.45, ease: "power3.out" }, 64.45 + i * 0.13);
    const ts = 65.7 + i * 1.25;
    tl.from($(".badge", row), { scale: 2.4, rotation: -10, opacity: 0, duration: 0.3, ease: "power4.in" }, ts);
    tl.to(row, { keyframes: { x: [0, 8, -6, 3, 0] }, duration: 0.25, ease: "none" }, ts + 0.3);
    if (b === "halyk" || b === "kaspi") tl.fromTo(row, { boxShadow: "0 0 0 rgba(0,0,0,0)" }, { boxShadow: `0 0 40px ${b === "halyk" ? "rgba(20,167,94,.55)" : "rgba(241,70,53,.55)"}`, duration: 0.4 }, ts + 0.3);
  });
  const tTally = 73.4;
  tl.from("#s6 .tally", { y: 50, opacity: 0, duration: 0.5, ease: "back.out(2)" }, tTally);
  tl.from("#s6 .tn1, #s6 .tn2", { scale: 0, duration: 0.4, ease: "back.out(3)", stagger: 0.25 }, tTally + 0.3);
  tl.to("#s6 .tally", { scale: 1.08, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 3 }, tTally + 1.0);

  /* ================= SCENE 7 — VERDICT (78–90) ================= */
  put("#s7 .far", A.skyline(21, "#1A2350", 600));
  put("#s7 .tk", A.kaspiTower().replace(/id="(k\w+)"/g, 'id="$1b"').replace(/url\(#(k\w+)\)/g, "url(#$1b)"));
  put("#s7 .th", A.halykTower().replace(/id="(h\w+)"/g, 'id="$1b"').replace(/url\(#(h\w+)\)/g, "url(#$1b)"));
  heroAt("#s7 .heroB", { back: true }); heroAt("#s7 .heroW");
  tl.fromTo("#s7 .cam", { scale: 1.18 }, { scale: 1, transformOrigin: "50% 65%", duration: 3.2, ease: "power2.out" }, 78);
  tl.to("#s7 .cam", { scale: 1.05, duration: 8.8, ease: "sine.inOut" }, 81.2);
  tl.from("#s7 .tk", { x: -200, opacity: 0, duration: 1.0, ease: "power3.out" }, 78.1);
  tl.from("#s7 .th", { x: 200, opacity: 0, duration: 1.0, ease: "power3.out" }, 78.2);
  ["#s7 .tk", "#s7 .th"].forEach((sel, j) => tl.to(`${sel} .beacon`, { opacity: 0.15, duration: 0.5, yoyo: true, repeat: 11 }, 78.3 + j * 0.25));
  // turn around to face the camera
  gsap.set("#s7 .heroW", { scaleX: 0 });
  breathe("#s7 .heroB", 78, 79.2);
  tl.to("#s7 .heroB", { scaleX: 0, duration: 0.14, ease: "power2.in" }, W(7, "так") + 0.45);
  tl.to("#s7 .heroW", { scaleX: 1, duration: 0.16, ease: "power2.out" }, W(7, "так") + 0.59);
  breathe("#s7 .heroW", 79.2, 89.8);
  blink("#s7 .heroW", 80.6); blink("#s7 .heroW", 84.9); blink("#s7 .heroW", 88.2);
  const tShrug = W(7, "всё") - 0.1;
  tl.to("#s7 .heroW .armL", { rotation: 48, svgOrigin: "66 200", duration: 0.35, ease: "back.out(2)" }, tShrug);
  tl.to("#s7 .heroW .armR", { rotation: -48, svgOrigin: "174 200", duration: 0.35, ease: "back.out(2)" }, tShrug);
  tl.to("#s7 .heroW .head", { rotation: -8, svgOrigin: "120 170", duration: 0.35 }, tShrug);
  tl.to("#s7 .heroW .browL, #s7 .heroW .browR", { y: -6, duration: 0.25 }, tShrug);
  tl.to("#s7 .heroW .armL, #s7 .heroW .armR, #s7 .heroW .head", { rotation: 0, duration: 0.4, ease: "power2.inOut" }, tShrug + 1.5);
  tl.to("#s7 .heroW .browL, #s7 .heroW .browR", { y: 0, duration: 0.3 }, tShrug + 1.5);
  const tL1 = W(7, "финансовая") - 0.1, tL2 = W(7, "удобство") - 0.1;
  tl.from("#s7 .lab1", { y: 40, scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(2)" }, tL1);
  tl.to("#s7 .th .glow", { opacity: 0.9, duration: 0.3, yoyo: true, repeat: 1 }, tL1);
  tl.to("#s7 .tk .glow", { opacity: 0.9, duration: 0.3, yoyo: true, repeat: 1 }, tL1 + 0.3);
  tl.from("#s7 .lab2", { y: 40, scale: 0.6, opacity: 0, duration: 0.4, ease: "back.out(2)" }, tL2);
  look("#s7 .heroW", tL1, -10); look("#s7 .heroW", tL2, 10); look("#s7 .heroW", tL2 + 1.2, 0);
  const tF = 86.25;
  tl.to("#s7 .lab1, #s7 .lab2", { opacity: 0, y: -30, duration: 0.3 }, tF - 0.45);
  tl.from("#s7 .f1", { x: -1100, duration: 0.4, ease: "power4.out" }, tF - 0.4);
  tl.from("#s7 .f3", { x: 1100, duration: 0.4, ease: "power4.out" }, tF - 0.4);
  tl.from("#s7 .f2", { scale: 3.5, opacity: 0, duration: 0.3, ease: "power4.in" }, tF - 0.3);
  tl.from("#s7 .shade7", { opacity: 0, duration: 0.5 }, tF - 0.5);
  tl.to("#s7 .tk, #s7 .th", { y: 300, duration: 0.7, ease: "power2.inOut" }, tF - 0.6);
  flash(tF, 0.75); shake("#s7 .cam", tF, 16);
  // confetti burst
  const conf = $("#s7 .confetti"); const rc = A.rng(99);
  for (let i = 0; i < 70; i++) {
    const p = document.createElement("div"); p.className = "abs";
    const col = [C.kaspi, C.halyk, C.gold, "#fff"][i % 4];
    Object.assign(p.style, { left: "530px", top: "520px", width: `${10 + rc() * 12}px`, height: `${16 + rc() * 14}px`, background: col, borderRadius: "3px", opacity: 0 });
    conf.appendChild(p);
    const a = rc() * Math.PI * 2, v = 380 + rc() * 520;
    const dx = Math.cos(a) * v, dy = Math.sin(a) * v * 0.8 - 200;
    tl.fromTo(p, { x: 0, y: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [0, dx * 0.7, dx], y: [0, dy * 0.7, dy + 900], rotation: [0, 360 * (rc() - 0.5) * 2, 720 * (rc() - 0.5)], opacity: [1, 1, 0] }, duration: 2.8 + rc(), ease: "power1.out", immediateRender: false }, tF + 0.02);
  }
  const tCta = 87.2;
  $("#s7 .cta .pill").insertAdjacentHTML("afterbegin", `<span style="display:inline-block;vertical-align:-10px;margin-right:16px">${A.icon("comment", 54)}</span>`);
  tl.from("#s7 .cta", { scale: 0.3, opacity: 0, duration: 0.45, ease: "back.out(2.2)" }, tCta);
  tl.to("#s7 .cta", { scale: 1.06, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: 3 }, tCta + 0.6);
  tl.to("#s7 .heroW .armR", { rotation: -150, svgOrigin: "174 200", duration: 0.35, ease: "back.out(1.6)" }, tCta + 0.1);
  tl.to("#s7 .heroW .armR", { rotation: -125, svgOrigin: "174 200", duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 5 }, tCta + 0.45);

  /* ================= SUBTITLES ================= */
  const PLUS = /^(триллион|актив|миллиард|прибыл|капитал|мощ|зарабатыва|денег|выгод|масштаб)/i;
  const MINUS = /^(расход|тратят|инвестиру|комисси)/i;
  const chunks = [];
  VO.forEach(sc => {
    let cur = [];
    const flush = () => { if (cur.length) { chunks.push(cur); cur = []; } };
    sc.words.forEach(w => {
      const len = cur.map(x => x.w).join(" ").length;
      if (cur.length && len + 1 + w.w.length > 28) flush();
      cur.push(w);
      const L = cur.map(x => x.w).join(" ").length;
      if (/[.?!]$/.test(w.w)) flush();
      else if (/[,—]$/.test(w.w) && L >= 12) flush();
    });
    flush();
  });
  const subs = $("#subs");
  chunks.forEach((ch, i) => {
    const d = document.createElement("div"); d.className = "sub";
    d.innerHTML = `<span class="box">${ch.map(w => {
      const clean = w.w.replace(/[^\wА-Яа-яЁё-]/g, "");
      let cls = "";
      if (/^kaspi$/i.test(clean)) cls = "kaspi"; else if (/^halyk$/i.test(clean)) cls = "halyk";
      else if (PLUS.test(clean)) cls = "plus"; else if (MINUS.test(clean)) cls = "minus";
      return `<span class="w ${cls}">${w.w}</span>`;
    }).join(" ")}</span>`;
    subs.appendChild(d);
    const st = ch[0].s - 0.08;
    const next = chunks[i + 1];
    let en = ch[ch.length - 1].e + 0.45;
    if (next && next[0].s - 0.08 < en + 0.25) en = next[0].s - 0.1;
    tl.fromTo(d, { opacity: 0, y: 26, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" }, st);
    tl.to(d, { opacity: 0, y: -12, duration: 0.12, ease: "power1.in" }, Math.max(st + 0.3, en - 0.12));
    $$(".w", d).forEach((s, j) => tl.to(s, { opacity: 1, duration: 0.08 }, ch[j].s - 0.03));
  });

  /* ---------------- finish ---------------- */
  tl.to({}, { duration: 90 }, 0);           // pin total length to exactly 90 s
  tl.eventCallback("onUpdate", renderCounters);
  renderCounters();
  window.__timelines = window.__timelines || {};
  window.__timelines["root"] = tl;
  window.__KVH = { tl, chunks };
})();
