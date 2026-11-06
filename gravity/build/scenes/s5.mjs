import { sceneFile, grain, rng, f } from "../components.mjs";
// Scene 5 — abs 48.0–63.5 (local = abs − 48). Cutaway: gravity squeezes the planet; remove it; slow break-up.
const T0 = 48, CX = 540, CY = 880, RP = 400;
export default () => {
  const R = rng(55);
  // fracture lines from near the centre outwards
  const K = 7, angs = [];
  for (let i = 0; i < K; i++) angs.push(-Math.PI / 2 + (i / K) * Math.PI * 2 + (R() - 0.5) * 0.5);
  const bounds = angs.map((a) => {
    const pts = [[CX + (R() - 0.5) * 30, CY + (R() - 0.5) * 30]];
    for (let r = 70; r <= 560; r += 50 + R() * 30) { const aa = a + (R() - 0.5) * 0.22; pts.push([CX + Math.cos(aa) * r, CY + Math.sin(aa) * r]); }
    return pts;
  });
  const P = (pts) => pts.map((p) => `${f(p[0])},${f(p[1])}`).join(" ");
  let clips = "", frags = "", cracks = "";
  for (let i = 0; i < K; i++) {
    const a0 = angs[i], a1 = i + 1 < K ? angs[i + 1] : angs[0] + Math.PI * 2;
    const arc = []; for (let k = 0; k <= 6; k++) { const a = a0 + (a1 - a0) * (k / 6); arc.push([CX + Math.cos(a) * 800, CY + Math.sin(a) * 800]); }
    const poly = [...bounds[i], ...arc, ...[...bounds[(i + 1) % K]].reverse()];
    clips += `<clipPath id="s5-c${i}"><polygon points="${P(poly)}"/></clipPath>`;
    const mid = (a0 + a1) / 2;
    frags += `<g class="s5-frag" data-dx="${f(Math.cos(mid))}" data-dy="${f(Math.sin(mid))}" data-r="${f((R() - 0.5) * 8)}"><g clip-path="url(#s5-c${i})"><use href="#s5-art"/></g></g>`;
    const inside = bounds[i].filter((p) => Math.hypot(p[0] - CX, p[1] - CY) < RP + 10);
    cracks += `<polyline class="s5-crack" points="${P(inside)}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none" stroke="#ffb05a" stroke-width="5" stroke-linejoin="round"/>`;
  }
  let arrowsIn = "", arrowsOut = "";
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 360;
    arrowsIn += `<g transform="rotate(${a} ${CX} ${CY})"><g class="s5-ai"><line x1="${CX}" y1="${CY - 520}" x2="${CX}" y2="${CY - 446}" stroke="#7fd8ff" stroke-width="7" stroke-linecap="round"/><path d="M${CX - 13} ${CY - 452} L${CX} ${CY - 426} L${CX + 13} ${CY - 452} Z" fill="#7fd8ff"/></g></g>`;
    arrowsOut += `<g transform="rotate(${a + 11.25} ${CX} ${CY})"><g class="s5-ao"><line x1="${CX}" y1="${CY - 430}" x2="${CX}" y2="${CY - 500}" stroke="#ff8a3d" stroke-width="7" stroke-linecap="round"/><path d="M${CX - 13} ${CY - 494} L${CX} ${CY - 520} L${CX + 13} ${CY - 494} Z" fill="#ff8a3d"/></g></g>`;
  }
  let debris = "";
  for (let i = 0; i < 40; i++) { const a = R() * Math.PI * 2, r = 380 + R() * 30; debris += `<circle class="s5-deb" cx="${f(CX + Math.cos(a) * r)}" cy="${f(CY + Math.sin(a) * r)}" r="${f(2 + R() * 5)}" fill="${R() < 0.5 ? "#8a6a4a" : "#ffb05a"}" data-dx="${f(Math.cos(a))}" data-dy="${f(Math.sin(a))}" opacity="0"/>`; }
  const sector = (r) => `M${CX} ${CY} L${CX - r} ${CY} A${r} ${r} 0 0 1 ${CX} ${CY - r} Z`;
  const label = (id, y, x2, text) => `<g id="${id}" opacity="0"><line x1="${CX + 6}" y1="${y}" x2="${x2}" y2="${y}" stroke="#eaf4ff" stroke-width="2.5"/><circle cx="${CX + 6}" cy="${y}" r="6" fill="#eaf4ff"/><rect x="${x2}" y="${y - 24}" width="${text.length * 23 + 34}" height="48" rx="10" fill="rgba(4,10,30,.78)" stroke="rgba(127,216,255,.5)" stroke-width="1.5"/><text x="${x2 + 17}" y="${y + 10}" font-family="Mont" font-weight="800" font-size="30" letter-spacing="1.5" fill="#fff">${text}</text></g>`;
  const body = `
<div id="s5-in" style="position:absolute;inset:0">
<canvas id="s5-stars" width="1080" height="1920" style="position:absolute;inset:0"></canvas>
<div id="s5-cam" style="position:absolute;inset:0;transform-origin:540px 880px">
<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <defs>
    <radialGradient id="s5-surf" cx=".32" cy=".3" r=".8"><stop offset="0" stop-color="#7a6c58"/><stop offset=".5" stop-color="#4a4236"/><stop offset="1" stop-color="#15120f"/></radialGradient>
    <radialGradient id="s5-man" cx="${CX}" cy="${CY}" r="388" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#ff7a2a"/><stop offset="1" stop-color="#9c2a14"/></radialGradient>
    <radialGradient id="s5-oc" cx="${CX}" cy="${CY}" r="218" gradientUnits="userSpaceOnUse"><stop offset=".35" stop-color="#ffd27a"/><stop offset="1" stop-color="#ff8a24"/></radialGradient>
    <radialGradient id="s5-ic" cx="${CX}" cy="${CY}" r="77" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffe08a"/></radialGradient>
    <radialGradient id="s5-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".9"/><stop offset=".6" stop-color="#ff6a2a" stop-opacity=".5"/><stop offset="1" stop-color="#ff4a1a" stop-opacity="0"/></radialGradient>
    <linearGradient id="s5-shade" x1="0" y1="0" x2="1" y2="1"><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>
    <clipPath id="s5-wedge"><path id="s5-wp" d="M${CX} ${CY} L${CX} ${CY - 600} L${CX} ${CY - 600} Z"/></clipPath>
    ${clips}
    <g id="s5-art">
      <circle cx="${CX}" cy="${CY}" r="${RP}" fill="url(#s5-surf)"/>
      <g fill="#6b6a3e" opacity=".75"><path d="M600 560 Q700 520 800 600 Q860 680 820 760 Q760 800 700 760 Q640 700 600 560 Z"/><path d="M620 980 Q700 940 760 1000 Q800 1100 730 1180 Q650 1160 640 1080 Z"/><path d="M300 1000 Q360 960 420 1010 Q440 1080 380 1120 Q310 1110 300 1000 Z"/></g>
      <g fill="#2a2620" opacity=".55"><ellipse cx="760" cy="880" rx="70" ry="40"/><ellipse cx="520" cy="1140" rx="110" ry="50"/><ellipse cx="420" cy="880" rx="50" ry="70"/></g>
      <circle cx="${CX}" cy="${CY}" r="${RP}" fill="url(#s5-shade)"/>
      <g clip-path="url(#s5-wedge)">
        <path d="${sector(400)}" fill="#6b4a35"/><path d="${sector(388)}" fill="url(#s5-man)"/><path d="${sector(218)}" fill="url(#s5-oc)"/><path d="${sector(77)}" fill="url(#s5-ic)"/>
        <path d="M${CX} ${CY} L${CX - 400} ${CY} M${CX} ${CY} L${CX} ${CY - 400}" stroke="rgba(255,240,200,.6)" stroke-width="3"/>
        <circle id="s5-coreglow" cx="${CX}" cy="${CY}" r="140" fill="url(#s5-glow)" opacity=".5"/>
      </g>
      <circle cx="${CX}" cy="${CY}" r="${RP}" fill="none" stroke="#9fdcff" stroke-width="3" opacity=".35"/>
    </g>
  </defs>
  <circle id="s5-magma" cx="${CX}" cy="${CY}" r="420" fill="url(#s5-glow)" opacity="0"/>
  <g id="s5-in-arrows">${arrowsIn}</g>
  <g id="s5-out-arrows">${arrowsOut}</g>
  <g id="s5-frags">${frags}</g>
  <g id="s5-cracks" style="filter:drop-shadow(0 0 8px #ff7a2a)">${cracks}</g>
  ${debris}
  ${label("s5-lb0", 486, 660, "КОРА")}${label("s5-lb1", 585, 600, "МАНТИЯ")}${label("s5-lb2", 735, 600, "ВНЕШНЕЕ ЯДРО")}${label("s5-lb3", 845, 600, "ВНУТРЕННЕЕ ЯДРО")}
</svg></div>
<div class="hud" id="s5-tG" style="left:0;right:0;top:215px;text-align:center"><div class="hud-tag"><span class="hud-dot"></span>ГРАВИТАЦИЯ СЖИМАЕТ НЕДРА</div></div>
<div class="hud" id="s5-tP" style="left:0;right:0;top:215px;text-align:center"><div class="hud-tag warn"><span class="hud-dot"></span>В ЦЕНТРЕ <span class="v">≈ 3,6 млн атм</span></div></div>
<div class="hud" id="s5-tM" style="left:0;right:0;top:205px;text-align:center"><div class="hud-small" style="font-size:28px;color:#eaf4ff;font-weight:800">ГРАВИТАЦИЯ ЗЕМЛИ <span id="s5-pct" style="color:#7fd8ff">100%</span></div>
  <div style="margin:16px auto 0;width:560px;height:18px;border-radius:9px;background:rgba(127,216,255,.15);border:1.5px solid rgba(127,216,255,.5);overflow:hidden"><div id="s5-bar" style="width:100%;height:100%;background:linear-gradient(90deg,#3fa9ff,#7fd8ff);transform-origin:0 50%"></div></div></div>
<div class="hud" id="s5-tE" style="left:0;right:0;top:215px;text-align:center"><div class="hud-tag warn" style="position:relative"><span class="hud-dot"></span>МГНОВЕННЫЙ ВЗРЫВ<span id="s5-strike" style="position:absolute;left:14px;right:14px;top:50%;height:5px;background:#ff4a3d;transform-origin:0 50%"></span></div></div>
<div class="hud" id="s5-tD" style="left:0;right:0;top:215px;text-align:center"><div class="hud-tag"><span class="hud-dot"></span>МЕДЛЕННЫЙ РАСПАД</div></div>
<div class="vignette"></div>

</div>`;
  const css = `#s5-tG,#s5-tP,#s5-tM,#s5-tE,#s5-tD{opacity:0}`;
  const js = `
const A = (t) => +(t - ${T0}).toFixed(3);

Kit.stars($("#s5-stars"),505,650);
const cam=$("#s5-cam");
tl.fromTo(cam,{scale:2.4,filter:"blur(14px)",opacity:.4},{scale:1,filter:"blur(0px)",opacity:1,duration:1.1,ease:"expo.out"},0);
tl.to(cam,{scale:1.06,duration:A(58)-A(49.1),ease:"sine.inOut"},A(49.1));
tl.to(cam,{scale:.94,duration:A(63.5)-A(58),ease:"sine.inOut"},A(58));
// the wedge opens
const wp=$("#s5-wp"), w={a:0};
const setW=()=>{const a=w.a, r=600, x=${CX}-Math.sin(a)*r, y=${CY}-Math.cos(a)*r;
  wp.setAttribute("d",\`M${CX} ${CY} L${CX} \${${CY}-r} A\${r} \${r} 0 0 0 \${x.toFixed(2)} \${y.toFixed(2)} Z\`);};
setW();
tl.fromTo(w,{a:0},{a:Math.PI/2,duration:1.2,ease:"power3.inOut",onUpdate:setW},A(48.3));
["#s5-lb0","#s5-lb1","#s5-lb2","#s5-lb3"].forEach((s,i)=>tl.fromTo(s,{opacity:0,x:-14},{opacity:1,x:0,duration:.35,ease:"expo.out"},A(49.3)+i*.18));
// gravity squeezes
tl.fromTo("#s5-in-arrows",{opacity:0},{opacity:1,duration:.4},A(50.15));
tl.fromTo(".s5-ai",{y:-16},{y:6,duration:.55,ease:"sine.inOut",yoyo:true,repeat:7},A(50.15));
tl.fromTo("#s5-tG",{opacity:0,y:-14},{opacity:1,y:0,duration:.4,ease:"expo.out"},A(50.3));
tl.to("#s5-tG",{opacity:0,duration:.15},A(52.4));
tl.fromTo("#s5-tP",{opacity:0,scale:.9},{opacity:1,scale:1,duration:.35,ease:"expo.out"},A(52.55));
tl.fromTo("#s5-coreglow",{opacity:.5,scale:1,svgOrigin:"${CX} ${CY}"},{opacity:1,scale:1.25,duration:.5,ease:"sine.inOut",yoyo:true,repeat:2},A(52.7));
tl.to("#s5-tP",{opacity:0,duration:.15},A(54.3));
tl.to(["#s5-lb0","#s5-lb1","#s5-lb2","#s5-lb3"],{opacity:0,duration:.3},A(54.0));
// remove gravity: 100% → 0%
tl.fromTo("#s5-tM",{opacity:0},{opacity:1,duration:.3},A(54.45));
const g={v:100}, pct=$("#s5-pct");
tl.fromTo(g,{v:100},{v:0,duration:2,ease:"power2.inOut",onUpdate:()=>{pct.textContent=Math.round(g.v)+"%";}},A(54.45));
tl.fromTo("#s5-bar",{scaleX:1},{scaleX:0,duration:2,ease:"power2.inOut"},A(54.45));
tl.to(".s5-ai",{opacity:0,duration:1.6,ease:"power2.in",stagger:.03},A(54.6));
tl.to("#s5-tM",{opacity:0,duration:.25},A(57.8));
// compressed matter expands
tl.fromTo("#s5-frags",{scale:1,svgOrigin:"${CX} ${CY}"},{scale:1.07,duration:A(63.5)-A(56.9),ease:"sine.in"},A(56.9));
tl.fromTo("#s5-out-arrows",{opacity:0,scale:.9,svgOrigin:"${CX} ${CY}"},{opacity:1,scale:1.1,duration:1.4,ease:"power2.out"},A(56.9));
tl.to("#s5-out-arrows",{opacity:0,duration:.5},A(59.2));
tl.to("#s5-coreglow",{opacity:1,duration:1},A(56.9));
// not an instant explosion — a slow break-up
tl.fromTo("#s5-tE",{opacity:0},{opacity:1,duration:.25},A(58.15));
tl.fromTo("#s5-strike",{scaleX:0},{scaleX:1,duration:.3,ease:"power3.out"},A(58.75));
tl.to("#s5-tE",{opacity:0,filter:"blur(6px)",duration:.25},A(59.6));
tl.fromTo("#s5-tD",{opacity:0,y:12},{opacity:1,y:0,duration:.35,ease:"expo.out"},A(59.85));
tl.to(".s5-crack",{attr:{"stroke-dashoffset":0},duration:1.3,ease:"power2.inOut",stagger:.09},A(59.4));
tl.to("#s5-magma",{opacity:.9,duration:2.5,ease:"power1.in"},A(60.3));
$$(".s5-frag").forEach((el)=>{const dx=+el.dataset.dx, dy=+el.dataset.dy, r=+el.dataset.r;
  tl.to(el,{x:dx*70,y:dy*70,rotation:r,svgOrigin:"${CX} ${CY}",duration:A(63.5)-A(60.4),ease:"power1.in"},A(60.4));});
tl.to(".s5-crack",{opacity:0,duration:.8},A(61));
$$(".s5-deb").forEach((el,i)=>{tl.fromTo(el,{opacity:0,x:0,y:0},{opacity:1,x:+el.dataset.dx*(90+i%5*25),y:+el.dataset.dy*(90+i%5*25),duration:2.6,ease:"power1.in"},A(60.6)+(i%8)*.06);});
`;
  return { id: "s5", dur: 15.5, file: sceneFile({ id: "s5", dur: 15.5, css, body, js }) };
};
