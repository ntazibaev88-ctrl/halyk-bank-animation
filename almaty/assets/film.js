// Master GSAP timeline for the Almaty film. Every animation is placed at an absolute
// film time, so the HyperFrames runtime can seek to any frame.
(function () {
  const D = window.__DATA;
  const tl = gsap.timeline({ paused: true });
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const scene = Object.fromEntries(D.scenes.map((s) => [s.id, s]));
  const shot = Object.fromEntries(D.shots.map((s) => [s.id, s]));
  const root = $("#root");
  // split text into glyph spans so "tracking" animations move glyphs with transforms
  function glyphs(sel) {
    $$(sel).forEach((el) => {
      el.innerHTML = [...el.textContent].map((ch) => '<span class="gl">' + (ch === " " ? "&nbsp;" : ch) + "</span>").join("");
    });
  }
  function trackIn(sel, at, spread, dur = 1.2) {
    $$(sel).forEach((el) => {
      const g = $$(".gl", el);
      const mid = (g.length - 1) / 2;
      tl.fromTo(g, { x: (i) => (i - mid) * spread, opacity: 0 }, { x: 0, opacity: 1, duration: dur, ease: "power3.out" }, at);
    });
  }
  glyphs("#coords"); glyphs("#tagline .tg"); glyphs("#evening-word > span"); glyphs("#final .l2");
  const div = (cls, html, parent = root) => { const e = document.createElement("div"); e.className = cls; e.innerHTML = html; parent.appendChild(e); return e; };

  // ---------------- footage + stand-ins ----------------
  const sceneStarts = new Set(D.scenes.map((s) => s.id));
  let prevScene = null;
  D.shots.forEach((s, i) => {
    const wrap = $("#shot" + s.id);
    const dur = s.t1 - s.t0;
    const media = wrap.firstElementChild;
    if (s.real) {
      const pull = s.fallback && s.fallback.pullback;
      tl.fromTo(media, { scale: pull ? 1.12 : 1.0, x: 0 }, { scale: pull ? 1.0 : 1.09, x: i % 2 ? -18 : 18, duration: dur, ease: "sine.inOut" }, s.t0);
    } else {
      window.Illus.build(media, s.fallback, tl, s.t0, dur);
    }
    if (i === 0) { prevScene = s.scene; return; }
    if (s.enter === "under-graphic") {
      // revealed by the topographic map fading away above it
    } else if (s.split === "top") {
      // full-frame clip shown through the top half; content shifted so its centre sits in the panel
      tl.fromTo(wrap, { clipPath: "inset(0px 0px 972px 0px)", x: -1080 }, { clipPath: "inset(0px 0px 972px 0px)", x: 0, duration: 0.8, ease: "power3.out" }, s.t0);
      tl.fromTo(media, { y: -486 }, { y: -486, duration: 0.05 }, s.t0);
      tl.to(wrap, { y: -980, duration: 0.7, ease: "power3.in" }, s.end - 0.45);
    } else if (s.split === "bottom") {
      const topShot = D.shots[i - 1];
      tl.fromTo(wrap, { clipPath: "inset(972px 0px 0px 0px)", x: 1080 }, { clipPath: "inset(972px 0px 0px 0px)", x: 0, duration: 0.8, ease: "power3.out" }, s.t0 + 0.08);
      tl.fromTo(media, { y: 486 }, { y: 486, duration: 0.05 }, s.t0);
      tl.to(media, { y: 0, duration: 0.9, ease: "power3.inOut" }, topShot.end - 0.45);
      tl.to(wrap, { clipPath: "inset(0px 0px 0px 0px)", duration: 0.9, ease: "power3.inOut" }, topShot.end - 0.45);
      tl.fromTo("#splitline", { opacity: 0 }, { opacity: 1, duration: 0.4 }, s.t0 + 0.3);
      tl.to("#splitline", { opacity: 0, duration: 0.3 }, topShot.end - 0.45);
    } else if (s.scene !== prevScene && Math.abs(s.start - scene[s.scene].start) < 0.01) {
      // scene change: rise + settle with a light leak
      tl.fromTo(wrap, { opacity: 0, y: 90, scale: 1.06 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power2.out" }, s.t0);
      tl.fromTo("#leak", { opacity: 0, x: -120 }, { opacity: 0.6, x: 0, duration: 0.45, ease: "sine.out", immediateRender: false }, s.start - 0.4);
      tl.to("#leak", { opacity: 0, x: 120, duration: 0.6, ease: "sine.in" }, s.start + 0.05);
    } else {
      tl.fromTo(wrap, { opacity: 0 }, { opacity: 1, duration: s.t0 < s.start ? s.start - s.t0 + 0.25 : 0.5, ease: "sine.inOut" }, s.t0);
    }
    prevScene = s.scene;
  });

  // ---------------- opening: black -> title ----------------
  tl.to("#black", { opacity: 0, duration: 1.4, ease: "sine.out" }, 0.05);
  tl.fromTo("#topo-lines", { opacity: 0, y: 30 }, { opacity: 0.55, y: 0, duration: 2, ease: "sine.out" }, 0.3);
  tl.to("#topo-lines", { y: -40, duration: 5, ease: "none" }, 2.3);
  tl.to("#topo-lines", { opacity: 0, duration: 1 }, 5.6);
  tl.fromTo("#pin", { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "bounce.out" }, 0.9);
  $$("#pin .ring").forEach((r, k) => tl.fromTo(r, { scale: 0.3, opacity: 0.9 }, { scale: 1.8, opacity: 0, duration: 1.4, ease: "sine.out", repeat: 2 }, 1.5 + k * 0.7));
  trackIn("#coords", 1.1, 9);
  tl.fromTo("#title .ch", { yPercent: 70, opacity: 0, filter: "blur(10px)" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", stagger: 0.07 }, 1.35);
  tl.fromTo("#tagline .rule", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 2.85);
  trackIn("#tagline .tg", 2.85, 10, 1.3);
  tl.to("#title-block", { opacity: 0, y: -60, filter: "blur(8px)", duration: 0.7, ease: "power2.in" }, shot["02"].start - 0.6);

  // ---------------- Kazakhstan map card ----------------
  const k0 = shot["02"].start + 0.35;
  tl.fromTo("#kzcard", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, k0);
  tl.fromTo("#kz-line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, k0 + 0.3);
  tl.fromTo("#kz-fill", { opacity: 0 }, { opacity: 1, duration: 0.8 }, k0 + 1.4);
  tl.fromTo("#kzmap .nb", { opacity: 0 }, { opacity: 1, duration: 1 }, k0 + 0.2);
  tl.fromTo("#astana", { opacity: 0 }, { opacity: 1, duration: 0.5 }, k0 + 1.6);
  tl.fromTo("#almaty-pin .dot", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.6, ease: "back.out(3)" }, k0 + 1.8);
  $$("#almaty-pin .pulse").forEach((p, k) => tl.fromTo(p, { scale: 0.6, opacity: 1, transformOrigin: "50% 50%" }, { scale: 4, opacity: 0, duration: 1.5, repeat: 2, ease: "sine.out" }, k0 + 2 + k * 0.75));
  tl.fromTo("#almaty-label .leader", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, k0 + 2.1);
  tl.fromTo("#almaty-label text", { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12 }, k0 + 2.4);
  tl.fromTo("#kzcard .stat", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.18, ease: "power2.out" }, k0 + 2.8);
  tl.to("#kzcard", { opacity: 0, y: -40, duration: 0.6, ease: "power2.in" }, scene.s1.end - 0.9);

  // ---------------- chapter labels ----------------
  const chapterTpl = $("#chapter");
  function chapter(sc, at, hold = 3.4) {
    const m = D.sceneMeta[sc];
    if (!m) return;
    const c = chapterTpl.cloneNode(true);
    c.removeAttribute("id");
    c.classList.add("chapter");
    c.id = "chapter-" + sc;
    $(".n", c).textContent = m.n;
    $(".nm", c).textContent = m.name;
    root.appendChild(c);
    tl.fromTo(c, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, at);
    tl.fromTo($(".bar", c), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.out" }, at + 0.1);
    tl.to(c, { opacity: 0, x: 20, duration: 0.5, ease: "power2.in" }, at + hold);
  }
  chapter("s2", scene.s2.start + 0.5);
  chapter("s3", shot["06"].start + 0.4);
  chapter("s4", scene.s4.start + 0.5, 3);
  chapter("s5", scene.s5.start + 0.5);
  chapter("s6", scene.s6.start + 0.5, 3);
  chapterTpl.remove();

  // ---------------- location labels ----------------
  const locTpl = $("#loc");
  function loc(id, txt, sub, at, until) {
    const l = locTpl.cloneNode(true);
    l.id = "loc-" + id;
    $(".txt", l).textContent = txt;
    $(".sub", l).textContent = sub || "";
    root.appendChild(l);
    tl.fromTo(l, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, at);
    tl.fromTo($(".ico", l), { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, at + 0.15);
    tl.to(l, { opacity: 0, x: -20, duration: 0.45, ease: "power2.in" }, until);
  }
  const L = (id, txt, sub, lead = 0.6) => { const s = shot[id]; loc(id, txt, sub, s.start + lead, s.end - 0.5); };
  L("03", "ҚАЛА ОРТАЛЫҒЫ", "", 1.0);
  L("04", "ЗАМАНАУИ СӘУЛЕТ", "");
  L("05", "ЖАСЫЛ САЯБАҚТАР", "");
  L("06", "ІЛЕ АЛАТАУЫ", "ТЯНЬ-ШАНЬ", 1.2);
  L("07", "ТЯНЬ-ШАНЬ ШЫРШАСЫ", "");
  L("08", "МЕДЕУ", "1691 м", 1.0);
  loc("10", "ШЫМБҰЛАҚ", "2260 м", shot["09"].end + 0.6, shot["10"].end - 0.5);
  L("11", "КӨКТӨБЕ", "КӨРІНІС АЛАҢЫ", 1.0);
  L("14", "ПАНФИЛОВШЫЛАР САЯБАҒЫ", "", 0.8);
  L("15", "ЖАЯУЛАР КӨШЕСІ", "");
  locTpl.remove();

  // ---------------- topographic interlude (scene 3) ----------------
  const t3 = scene.s3.start - 0.3, t3end = shot["06"].start;
  tl.fromTo("#topo", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "sine.inOut" }, t3);
  tl.fromTo("#topo-map", { scale: 1.0, transformOrigin: "62% 58%" }, { scale: 1.55, duration: t3end - t3 + 0.9, ease: "power1.in" }, t3);
  $$("#topo-c path").forEach((p, k) => tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.out" }, t3 + 0.2 + (k % 11) * 0.09));
  tl.fromTo("#topo-title > *", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" }, t3 + 0.5);
  tl.fromTo("#topo-north", { opacity: 0 }, { opacity: 0.7, duration: 0.6 }, t3 + 0.8);
  tl.fromTo("#topo-city", { opacity: 0, scale: 0.4, transformOrigin: "0 0" }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, t3 + 1.0);
  tl.fromTo("#topo-peak", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, t3 + 1.6);
  tl.to("#topo", { opacity: 0, duration: 0.8, ease: "sine.inOut" }, shot["06"].t0);
  tl.fromTo("#shot06", { scale: 1.18 }, { scale: 1, duration: 2.4, ease: "power2.out" }, shot["06"].t0);

  // ---------------- route band (scene 4 split screen) ----------------
  const r0 = shot["09"].start + 0.4, r1 = shot["09"].end - 0.5;
  tl.fromTo("#route", { opacity: 0 }, { opacity: 1, duration: 0.5 }, r0);
  tl.fromTo("#route-line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: r1 - r0 - 0.4, ease: "sine.inOut" }, r0 + 0.2);
  tl.fromTo("#gondola", { x: 150, y: 60 }, { x: 930, y: 60, duration: r1 - r0 - 0.4, ease: "sine.inOut" }, r0 + 0.2);
  tl.fromTo("#route .rl", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.25 }, r0 + 0.2);
  tl.to("#route", { opacity: 0, duration: 0.4 }, r1);

  // ---------------- city map card + evening type (scene 5) ----------------
  const c0 = shot["12"].start + 0.1, c1 = shot["12"].end - 0.35;
  tl.fromTo("#citycard", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, c0);
  $$("#citymap .streets line").forEach((l, k) => tl.fromTo(l, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" }, c0 + 0.2 + (k % 9) * 0.05));
  tl.fromTo("#citymap .rivers path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "sine.inOut" }, c0 + 0.4);
  tl.fromTo("#citymap .hills", { opacity: 0 }, { opacity: 1, duration: 1 }, c0 + 0.3);
  tl.fromTo("#citymap .cpin", { opacity: 0, scale: 0.4, transformOrigin: "0 0" }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.25, ease: "back.out(2)" }, c0 + 1.1);
  tl.fromTo("#citymap .cpin .pulse", { scale: 0.6, opacity: 1, transformOrigin: "50% 50%" }, { scale: 3.2, opacity: 0, duration: 1.2, repeat: 1, ease: "sine.out" }, c0 + 1.6);
  tl.to("#citycard", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, c1);
  const e0 = shot["13"].start + 0.2;
  tl.fromTo("#evening-word", { opacity: 0 }, { opacity: 1, duration: 0.5 }, e0);
  trackIn("#evening-word > span:first-child", e0, 26, 1.4);
  trackIn("#evening-word > span:last-child", e0 + 0.35, 26, 1.4);
  tl.to("#evening-word", { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" }, shot["13"].end - 0.55);

  // ---------------- editorial year (scene 6) ----------------
  const y0 = shot["14"].start + 1.2;
  tl.fromTo("#year > *", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: "power3.out" }, y0);
  tl.fromTo("#year", { opacity: 0 }, { opacity: 1, duration: 0.3 }, y0);
  tl.to("#year", { opacity: 0, duration: 0.5 }, shot["14"].end - 0.6);

  // ---------------- subtitles ----------------
  const subs = $("#subs");
  D.cues.forEach((cue, i) => {
    const el = document.createElement("div");
    el.className = "cue";
    el.innerHTML = cue.words.map((w) => `<span class="w${w.k ? " k" : ""}">${w.t}</span>`).join(" ");
    subs.appendChild(el);
    tl.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, cue.start);
    $$(".w", el).forEach((w, k) => tl.fromTo(w, { opacity: 0.42 }, { opacity: 1, duration: 0.16, ease: "none" }, cue.words[k].s - 0.04));
    tl.to(el, { opacity: 0, duration: 0.18, ease: "power1.in" }, cue.end - 0.18);
  });

  // ---------------- finale ----------------
  const fw = D.finalSentence.words;
  tl.fromTo("#final .l1", { opacity: 0, y: 40, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }, fw[0].s - 0.15);
  tl.fromTo("#final .l2", { opacity: 0 }, { opacity: 1, duration: 0.2 }, fw[1].s - 0.1);
  trackIn("#final .l2", fw[1].s - 0.1, 14, 1.1);
  tl.fromTo("#final .l3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, fw[3].s - 0.1);
  tl.fromTo("#final .sig", { opacity: 0 }, { opacity: 0.75, duration: 1 }, fw[3].e + 0.4);
  tl.to("#black", { opacity: 1, duration: 2.6, ease: "sine.inOut" }, D.duration - 2.7);

  tl.seek(0);
})();
