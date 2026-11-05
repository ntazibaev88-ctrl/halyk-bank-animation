/* ===== FUTURE 2045 — shared motion toolkit (inlined into every scene) =====
   Everything is a pure function of timeline time: seeded PRNG, no Date/Math.random. */
const SVGNS = "http://www.w3.org/2000/svg";
function rng(seed) { // mulberry32
  let a = seed >>> 0;
  return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function el(tag, attrs, parent) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in (attrs || {})) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
function div(cls, css, parent, html) {
  const n = document.createElement("div");
  if (cls) n.className = cls;
  if (css) n.style.cssText = css;
  if (html != null) n.innerHTML = html;
  if (parent) parent.appendChild(n);
  return n;
}
/* Split a .title into word spans (words marked with <b> become cyan) */
function splitTitle(sel) {
  const t = document.querySelector(sel);
  const out = [];
  const walk = (node, cyan) => {
    node.childNodes.forEach((ch) => {
      if (ch.nodeType === 3) {
        ch.textContent.split(/\s+/).filter(Boolean).forEach((w) => {
          const s = document.createElement("span"); s.className = "w" + (cyan ? " c" : ""); s.textContent = w; out.push(s);
        });
      } else if (ch.nodeName === "B") walk(ch, true);
      else if (ch.nodeName === "BR") out.push(document.createElement("br"));
    });
  };
  walk(t, false);
  t.innerHTML = "";
  out.forEach((s) => t.appendChild(s));
  return t.querySelectorAll(".w");
}
/* Standard on-screen headline: kicker slides, words rise out of blur, rule draws, then leaves */
function headline(tl, id, at, hold) {
  const words = splitTitle("#" + id + "-title");
  tl.fromTo("#" + id + "-kicker", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .6, ease: "power3.out" }, at);
  tl.fromTo("#" + id + "-kicker i", { scaleX: 0, transformOrigin: "0 50%" }, { scaleX: 1, duration: .7, ease: "power3.out" }, at + .1);
  tl.fromTo(words, { opacity: 0, y: 70, rotationX: -50, filter: "blur(14px)" },
    { opacity: 1, y: 0, rotationX: 0, filter: "blur(0px)", duration: .75, ease: "expo.out", stagger: .09 }, at + .15);
  tl.fromTo("#" + id + "-rule", { scaleX: 0, transformOrigin: "0 50%" }, { scaleX: 1, duration: .9, ease: "power3.inOut" }, at + .5);
  const end = at + hold;
  tl.to([ "#" + id + "-kicker", words, "#" + id + "-rule" ], { opacity: 0, y: -26, filter: "blur(10px)", duration: .45, ease: "power2.in", stagger: .03 }, end);
}
/* Floating dust / data particles that drift upward, finite and seeded */
function particles(parent, n, seed, dur, opts) {
  const o = Object.assign({ w: 1080, h: 1920, rmin: 1.5, rmax: 4.5, dx: 60, dy: -240, color: "" }, opts || {});
  const R = rng(seed), tl = gsap.timeline();
  for (let i = 0; i < n; i++) {
    const r = o.rmin + R() * (o.rmax - o.rmin);
    const d = div("dot", `left:${R() * o.w}px;top:${R() * o.h}px;width:${r}px;height:${r}px;opacity:0;${o.color ? "background:" + o.color + ";box-shadow:0 0 10px " + o.color : ""}`, parent);
    const x0 = (R() - .5) * 30, life = 3 + R() * 4, t0 = R() * dur;
    tl.fromTo(d, { opacity: 0, x: x0, y: 0 }, { opacity: .25 + R() * .6, x: x0 + (R() - .5) * o.dx, y: o.dy * (.4 + R() * .6), duration: life, ease: "sine.inOut" }, t0 * .9);
    tl.to(d, { opacity: 0, duration: life * .35, ease: "none" }, t0 * .9 + life * .65);
  }
  return tl;
}
/* Camera: slow push/drift for a "world" element */
function camera(tl, sel, d, o) {
  o = Object.assign({ s0: 1, s1: 1.1, x0: 0, x1: 0, y0: 0, y1: 0, at: 0, ease: "sine.inOut", origin: "50% 50%" }, o || {});
  tl.fromTo(sel, { scale: o.s0, x: o.x0, y: o.y0, transformOrigin: o.origin }, { scale: o.s1, x: o.x1, y: o.y1, duration: d, ease: o.ease }, o.at);
}
/* Scene in/out: punch-in settle at the start, push-through at the end (hidden by the root flash) */
function sceneInOut(tl, sel, d) {
  tl.fromTo(sel, { opacity: 0, filter: "brightness(2.2) blur(10px)" }, { opacity: 1, filter: "brightness(1) blur(0px)", duration: .55, ease: "power3.out" }, 0);
  tl.to(sel, { opacity: 0, filter: "brightness(1.6) blur(8px)", duration: .28, ease: "power2.in" }, d - .28);
}
/* Holographic data panel factory (HTML) */
function panel(id, css, head, value, sub, parent) {
  const p = div("holo", css, parent);
  p.id = id;
  p.innerHTML = (head ? `<div class="h">${head}</div>` : "") + (value ? `<div class="v">${value}</div>` : "") + (sub ? `<div class="r">${sub}</div>` : "");
  return p;
}
const RP = (n) => Math.max(0, Math.floor(n)); // finite, never -1 (= infinite) repeat count
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
/* Procedural skyline (SVG). Returns { bs: building <g>[], wins: lit window <rect>[] } */
function city(parent, o) {
  o = Object.assign({ x0: -40, x1: 1120, base: 1500, minW: 70, maxW: 130, minH: 300, maxH: 800, fill: "#0a2342", edge: "rgba(34,228,255,.35)",
    seed: 1, winProb: .5, winOn: 1, wcols: ["#8ff6ff", "#7ff3ff", "#ffe2a8", "#5aa8ff"], gap: 4, spire: .25, wstep: 22, winOpacity: 1 }, o);
  const R = rng(o.seed), bs = [], wins = [];
  let x = o.x0;
  while (x < o.x1) {
    const w = o.minW + R() * (o.maxW - o.minW), h = o.minH + R() * (o.maxH - o.minH);
    const g = el("g", {}, parent);
    el("rect", { x: x, y: o.base - h, width: w, height: h + 600, fill: o.fill }, g);
    el("rect", { x: x, y: o.base - h, width: w, height: 3, fill: o.edge }, g);
    if (R() < o.spire) { const sx = x + w * (.3 + R() * .4); el("rect", { x: sx, y: o.base - h - 60 - R() * 60, width: 3, height: 90, fill: o.edge }, g);
      el("circle", { cx: sx + 1.5, cy: o.base - h - 60, r: 4, fill: "#ff5b6e" }, g); }
    if (o.winProb > 0) {
      const cols = Math.max(1, Math.floor((w - 16) / o.wstep)), rows = Math.floor((h - 24) / (o.wstep * 1.35));
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (R() < o.winProb) {
          const wc = o.wcols[Math.floor(R() * o.wcols.length)];
          wins.push(el("rect", { x: x + 10 + c * o.wstep, y: o.base - h + 16 + r * o.wstep * 1.35, width: o.wstep * .42, height: o.wstep * .66, fill: wc, opacity: 0 }, g));
        }
      }
    }
    bs.push(g);
    x += w + o.gap;
  }
  return { bs: bs, wins: wins };
}
/* Human silhouette seen from behind (feet at 0,0, ~330 px tall) */
function human(parent, o) {
  o = Object.assign({ fill: "#020913", rim: "#22e4ff", rimOp: .55, s: 1 }, o);
  const g = el("g", {}, parent);
  const d = "M-44,-262 Q-50,-246 -49,-205 L-52,-150 L-60,-104 L-30,-100 L-30,-2 L-8,-2 L-5,-98 L5,-98 L8,-2 L30,-2 L30,-100 L60,-104 L52,-150 L49,-205 Q50,-246 44,-262 Q22,-278 0,-274 Q-22,-278 -44,-262 Z";
  const body = el("path", { d: d, fill: o.fill, stroke: o.rim, "stroke-opacity": o.rimOp, "stroke-width": 2 }, g);
  const head = el("ellipse", { cx: 0, cy: -296, rx: 22, ry: 26, fill: o.fill, stroke: o.rim, "stroke-opacity": o.rimOp, "stroke-width": 2 }, g);
  return { g: g, body: body, head: head };
}
/* Two-link inverse kinematics (rest pose hangs along +y). Angles in degrees, SVG-rotate convention. */
function ik2(bx, by, L1, L2, tx, ty, sign) {
  const dx = tx - bx, dy = ty - by;
  let d = Math.hypot(dx, dy); d = Math.min(d, L1 + L2 - .5); d = Math.max(d, Math.abs(L1 - L2) + .5);
  const k = sign * Math.acos(Math.max(-1, Math.min(1, (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2))));
  const th1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(k), L1 + L2 * Math.cos(k));
  return { a1: th1 * 180 / Math.PI - 90, a2: k * 180 / Math.PI };
}
/* Robotic arm with two links + gripper, driven by explicit rotate() attributes (seek-safe). */
function arm2(parent, o) {
  o = Object.assign({ x: 0, y: 0, L1: 300, L2: 280, w1: 16, w2: 12, c1: "#bcd6ee", c2: "#e8f7ff", joint: "#22e4ff", sign: 1, rest: null, base: true }, o);
  const g = el("g", {}, parent);
  if (o.base) el("rect", { x: o.x - 34, y: o.y - 12, width: 68, height: 18, rx: 7, fill: "#2a4a6e", stroke: o.joint, "stroke-opacity": .6 }, g);
  const l1 = el("g", {}, g);
  el("rect", { x: -o.w1 / 2, y: 0, width: o.w1, height: o.L1, rx: o.w1 / 2, fill: o.c1 }, l1);
  el("circle", { cx: 0, cy: 0, r: o.w1 * .75, fill: o.joint }, l1);
  const l2 = el("g", {}, l1);
  el("rect", { x: -o.w2 / 2, y: 0, width: o.w2, height: o.L2, rx: o.w2 / 2, fill: o.c2 }, l2);
  el("circle", { cx: 0, cy: 0, r: o.w2 * .8, fill: o.joint }, l2);
  const tip = el("g", { transform: `translate(0 ${o.L2})` }, l2);
  el("path", { d: "M-15,0 L-8,24 M15,0 L8,24", stroke: o.joint, "stroke-width": 5, "stroke-linecap": "round", fill: "none" }, tip);
  const st = { a1: 0, a2: 0 };
  const A = { g, st, tip, last: null };
  A.apply = () => { l1.setAttribute("transform", `translate(${o.x} ${o.y}) rotate(${st.a1})`); l2.setAttribute("transform", `translate(0 ${o.L1}) rotate(${st.a2})`); };
  A.pose = (tx, ty) => ik2(o.x, o.y, o.L1, o.L2, tx, ty, o.sign);
  A.set = (tx, ty) => { const p = A.pose(tx, ty); st.a1 = p.a1; st.a2 = p.a2; A.last = p; A.apply(); };
  A.reach = (tl, at, dur, tx, ty, ease) => {
    const p = A.pose(tx, ty), f = A.last || p;
    tl.fromTo(st, { a1: f.a1, a2: f.a2 }, { a1: p.a1, a2: p.a2, duration: dur, ease: ease || "power3.inOut", onUpdate: A.apply, immediateRender: false }, at);
    A.last = p;
  };
  return A;
}
