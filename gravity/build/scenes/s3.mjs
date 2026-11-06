import { sceneFile, character, lookVars, grain, rng, f } from "../components.mjs";
// Scene 3 — abs 20.0–34.5 (local = abs − 20). City: no friction, people and things drift, planes struggle.
const T0 = 20;
function buildings(seed, base, minH, maxH, col, winP, winCols, x0 = -300, x1 = 1380) {
  const R = rng(seed); let s = ""; let x = x0;
  while (x < x1) {
    const w = 90 + R() * 170, h = minH + R() * (maxH - minH), y = base - h;
    s += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h + 2600)}" fill="${col}"/>`;
    if (R() < 0.35) s += `<rect x="${f(x + w * 0.3)}" y="${f(y - 26)}" width="${f(w * 0.25)}" height="26" fill="${col}"/>`;
    if (R() < 0.3) s += `<line x1="${f(x + w * 0.7)}" y1="${f(y)}" x2="${f(x + w * 0.7)}" y2="${f(y - 70)}" stroke="${col}" stroke-width="4"/><circle cx="${f(x + w * 0.7)}" cy="${f(y - 70)}" r="4" fill="#ff4a3d"/>`;
    for (let wy = y + 22; wy < base - 30; wy += 30) for (let wx = x + 14; wx < x + w - 18; wx += 22) {
      const r = R(); if (r < winP) s += `<rect x="${f(wx)}" y="${f(wy)}" width="10" height="15" fill="${winCols[Math.floor(R() * winCols.length)]}" opacity="${f(0.45 + R() * 0.55)}"/>`;
    }
    x += w + 6 + R() * 20;
  }
  return s;
}
function car(id, color, flip) {
  const wheel = (cx, n) => `<g id="${id}-w${n}"><circle cx="${cx}" cy="0" r="34" fill="#111318"/><circle cx="${cx}" cy="0" r="20" fill="#9aa3b5"/><path d="M${cx - 20} 0 L${cx + 20} 0 M${cx} -20 L${cx} 20" stroke="#4a5266" stroke-width="5"/><circle cx="${cx}" cy="0" r="6" fill="#2a2f3a"/></g>`;
  return `<g id="${id}"><g transform="${flip ? "scale(-1 1)" : ""}">
    <polygon points="170,-70 560,-150 560,10 170,10" fill="url(#s3-beam)" opacity=".8"/>
    <path d="M-170 -10 L-176 -58 Q-170 -78 -140 -84 L-70 -92 L-24 -140 Q-6 -152 30 -152 L92 -152 Q122 -150 140 -128 L176 -92 Q200 -86 200 -62 L198 -14 Q196 0 180 0 L-160 0 Q-170 0 -170 -10 Z" fill="${color}"/>
    <path d="M-170 -40 L198 -40" stroke="rgba(0,0,0,.25)" stroke-width="4"/>
    <path d="M-56 -94 L-16 -136 Q-4 -144 22 -144 L50 -144 L50 -94 Z" fill="#1d2a48"/><path d="M60 -144 L90 -144 Q112 -142 124 -126 L148 -94 L60 -94 Z" fill="#1d2a48"/>
    <path d="M-40 -100 L-12 -132" stroke="rgba(255,255,255,.35)" stroke-width="5"/>
    <rect x="182" y="-72" width="18" height="14" rx="4" fill="#fff6d0"/>
    <rect id="${id}-brake" x="-176" y="-74" width="14" height="22" rx="4" fill="#5a1010"/>
    <circle id="${id}-bglow" cx="-178" cy="-63" r="40" fill="#ff3020" opacity="0" style="mix-blend-mode:screen;filter:blur(10px)"/>
    <g transform="translate(0 -4)">${wheel(-100, 0)}${wheel(120, 1)}</g>
  </g></g>`;
}
export default () => {
  const R = rng(31);
  let papers = "";
  for (let i = 0; i < 10; i++) papers += `<rect class="s3-paper" x="${f(-80 - R() * 300)}" y="${f(1200 + R() * 500)}" width="${f(26 + R() * 16)}" height="${f(34 + R() * 12)}" fill="#e9edf6" opacity=".9"/>`;
  let wind = "";
  for (let i = 0; i < 26; i++) wind += `<line class="s3-wind" x1="${f(R() * 1080)}" y1="${f(R() * 1900)}" x2="${f(R() * 1080)}" y2="0" stroke="#bfe3ff" stroke-width="${f(1 + R() * 2)}" opacity="0"/>`;
  wind = ""; for (let i = 0; i < 26; i++) { const x = R() * 1080, y = 300 + R() * 1500, L = 80 + R() * 180; wind += `<line class="s3-wind" x1="${f(x)}" y1="${f(y)}" x2="${f(x + 20)}" y2="${f(y - L)}" stroke="#d6ecff" stroke-width="${f(1.5 + R() * 2)}" stroke-linecap="round" opacity="0"/>`; }
  let clouds = "";
  for (let i = 0; i < 9; i++) clouds += `<ellipse class="s3-cloud" cx="${f(R() * 1080)}" cy="${f(-2900 + R() * 500)}" rx="${f(380 + R() * 320)}" ry="${f(140 + R() * 120)}" fill="#e8f0ff" opacity="${f(0.5 + R() * 0.4)}"/>`;
  const W = (k) => `style="position:absolute;inset:0;transform-origin:540px 960px"`;
  const body = `
<div id="s3-in" style="position:absolute;inset:0">
<div id="s3-sky" ${W()}><svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <defs><linearGradient id="s3-skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050b22"/><stop offset=".45" stop-color="#14265e"/><stop offset=".72" stop-color="#4b3f8a"/><stop offset=".86" stop-color="#e2774a"/><stop offset="1" stop-color="#ffc06a"/></linearGradient>
  <radialGradient id="s3-sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c8"/><stop offset=".25" stop-color="#ffc070" stop-opacity=".8"/><stop offset="1" stop-color="#ff7a3a" stop-opacity="0"/></radialGradient></defs>
  <rect x="-300" y="-2600" width="1680" height="4400" fill="url(#s3-skyg)"/>
  <ellipse cx="760" cy="1260" rx="420" ry="300" fill="url(#s3-sun)"/>
</svg></div>
<div id="s3-far" ${W()}><svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">${buildings(5, 1330, 260, 720, "#1b2554", 0.06, ["#ffc77a", "#9fd2ff"])}</svg></div>
<div id="s3-mid" ${W()}><svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">${buildings(9, 1430, 300, 980, "#0d1532", 0.2, ["#ffc77a", "#ffd9a0", "#8fd0ff"], -200, 1300)}
  <rect x="-300" y="1380" width="1680" height="50" fill="#141b38"/>
  ${[60, 380, 700, 980].map((x, i) => `<rect x="${x}" y="1330" width="200" height="60" fill="${["#ff8a3d", "#3fa9ff", "#ffb547", "#8a6bff"][i]}" opacity=".35"/>`).join("")}
</svg></div>
<div id="s3-street" ${W()}><svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <defs><linearGradient id="s3-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff2c0" stop-opacity=".55"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></linearGradient>
  <linearGradient id="s3-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#232a40"/><stop offset="1" stop-color="#151a2a"/></linearGradient></defs>
  <rect x="-300" y="1428" width="1680" height="44" fill="#2e3550"/><rect x="-300" y="1468" width="1680" height="8" fill="#4a5272"/>
  <rect x="-300" y="1476" width="1680" height="190" fill="url(#s3-road)"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="${-260 + i * 190}" y="1566" width="100" height="8" fill="#e9d27a" opacity=".7"/>`).join("")}
  <rect x="-300" y="1666" width="1680" height="10" fill="#4a5272"/><rect x="-300" y="1676" width="1680" height="300" fill="#262c44"/>
  <g id="s3-lamp1"><rect x="40" y="1060" width="14" height="380" fill="#0b0f1e"/><path d="M47 1060 Q60 1030 120 1034" stroke="#0b0f1e" stroke-width="10" fill="none"/><ellipse cx="124" cy="1042" rx="22" ry="9" fill="#ffd9a0"/><ellipse cx="124" cy="1060" rx="70" ry="30" fill="#ffd9a0" opacity=".25" style="filter:blur(8px)"/></g>
  <g id="s3-tree"><rect x="930" y="1260" width="18" height="180" fill="#2a1c13"/><circle id="s3-crown" cx="940" cy="1220" r="80" fill="#1f5b3c"/><circle cx="905" cy="1250" r="50" fill="#2a6e48"/><circle cx="975" cy="1245" r="48" fill="#174a31"/></g>
  <g id="s3-bench"><rect x="640" y="1404" width="150" height="12" rx="4" fill="#6b4a2e"/><rect x="650" y="1414" width="10" height="26" fill="#222"/><rect x="770" y="1414" width="10" height="26" fill="#222"/></g>
  <g id="s3-bin"><path d="M300 1384 L344 1384 L340 1444 L304 1444 Z" fill="#3b6e55"/><rect x="296" y="1378" width="52" height="10" rx="3" fill="#2f5a45"/></g>
  <g id="s3-bike"><circle cx="420" cy="1418" r="24" fill="none" stroke="#c7cede" stroke-width="5"/><circle cx="500" cy="1418" r="24" fill="none" stroke="#c7cede" stroke-width="5"/><path d="M420 1418 L450 1380 L490 1380 L500 1418 M450 1380 L460 1418 L490 1380 M486 1372 L496 1360" stroke="#ff8a3d" stroke-width="5" fill="none"/></g>
  <circle id="s3-ball" cx="600" cy="1428" r="16" fill="#f4f4f4"/>
  <g transform="translate(170 1291) scale(.8)" style="${lookVars("p1")}">${character("s3a")}</g>
  <g transform="translate(560 1291) scale(.8)" style="${lookVars("p2")}">${character("s3b")}</g>
  <g transform="translate(860 1291) scale(.8)" style="${lookVars("p3")}">${character("s3c")}</g>
  <g transform="translate(1250 1612)"><g id="s3-carB">${car("s3-cb", "#2f6db3", true)}</g></g>
  <ellipse id="s3-shA" cx="0" cy="1618" rx="200" ry="14" fill="#000" opacity=".5" style="filter:blur(6px)"/>
  <g transform="translate(0 1612)"><g id="s3-carA">${car("s3-ca", "#d23b2e", false)}</g></g>
  ${papers}
</svg></div>
<div id="s3-cl" ${W()}><svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible;filter:blur(14px)">${clouds}</svg></div>
<div id="s3-thin" style="position:absolute;inset:0;background:linear-gradient(#01030c,#060f2e 70%,#0b1840);opacity:0"></div>
<svg id="s3-fx" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">${wind}
  <g id="s3-planeM"><g id="s3-plane">
    <path id="s3-trail" d="M260 -6 Q600 -30 900 10 Q1200 40 1500 0" stroke="#e8f2ff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".35" style="filter:blur(4px)"/>
    <path d="M-250 0 Q-262 -26 -224 -34 L180 -34 Q222 -34 250 -86 L282 -86 L268 -30 Q262 6 230 12 L-200 12 Q-246 12 -250 0 Z" fill="#eef2f8"/>
    <path d="M-240 -2 L250 -2" stroke="#2b5c9e" stroke-width="7"/>
    ${Array.from({ length: 13 }, (_, i) => `<rect x="${-170 + i * 28}" y="-24" width="12" height="10" rx="4" fill="#1d2a48"/>`).join("")}
    <path d="M-236 -24 Q-230 -32 -210 -32 L-196 -32 L-206 -18 L-232 -18 Z" fill="#1d2a48"/>
    <path d="M-40 4 L90 4 L170 70 L130 70 Z" fill="#c7cfdd"/><rect x="40" y="18" width="80" height="26" rx="12" fill="#9aa3b5"/>
    <path d="M190 -30 L240 -30 L276 -4 L238 -4 Z" fill="#c7cfdd"/>
    <circle id="s3-strobe" cx="170" cy="70" r="7" fill="#ff4a3d"/>
  </g></g>
</svg>
<div class="hud" id="s3-tagF" style="left:0;right:0;top:250px;text-align:center"><div class="hud-tag warn"><span class="hud-dot"></span>ТРЕНИЕ <span class="v">= 0</span></div><div class="hud-small" style="margin-top:14px">без веса колёса не держат дорогу</div></div>
<div class="hud" id="s3-tagP" style="left:70px;top:230px"><div class="hud-tag warn"><span class="hud-dot"></span>ДАВЛЕНИЕ <span class="v" id="s3-pval">101&nbsp;кПа</span> ↓</div></div>
<div class="vignette"></div>

</div>`;
  const css = `#s3-tagF,#s3-tagP{opacity:0} .hud .v{text-transform:none}`;
  const js = `
const A = (t) => +(t - ${T0}).toFixed(3);

["s3a","s3b","s3c"].forEach(p=>{Kit.rigInit(p);gsap.set("#"+p+"-root",{svgOrigin:"0 0"});Kit.poseSet(p,"stand");});
gsap.set("#s3b-root",{scaleX:-1});
// parallax camera: each layer follows the camera by its own factor
const layers=[["#s3-sky",.12],["#s3-far",.35],["#s3-mid",.62],["#s3-street",1],["#s3-cl",1.25]];
const camL=(o,at,dur,ease)=>layers.forEach(([el,k])=>Kit.cam(tl,el,{cx:540+(o.cx-540)*k,cy:960+(o.cy-960)*k,s:1+(o.s-1)*k,rot:o.rot||0,blur:o.blur},at,dur,ease));
camL({cx:540,cy:1080,s:1.22},0,0);
camL({cx:540,cy:1090,s:1.05},0,.7,"power3.out");
camL({cx:560,cy:1100,s:1.0},.7,8,"sine.inOut");
camL({cx:540,cy:-420,s:1.0},A(28.9),2.1,"power2.inOut");
camL({cx:540,cy:-700,s:1.02},A(31.0),2.5,"sine.inOut");
camL({cx:540,cy:-2900,s:1.1,blur:6},A(33.5),1.0,"power3.in");
tl.fromTo("#s3-in",{opacity:0,filter:"blur(16px)"},{opacity:1,filter:"blur(0px)",duration:.5,ease:"power2.out"},0);
// chaos: papers gust through, shake
tl.to(".s3-paper",{x:(i)=>1300+i*20,y:(i)=>-200-(i%4)*110,rotation:(i)=>(i%2?1:-1)*(200+i*30),duration:3.4,ease:"none",stagger:.12},A(20.2));
tl.to("#s3-street",{rotation:.6,duration:.06,yoyo:true,repeat:5,ease:"sine.inOut"},A(20.79));
// car A: wheels lose grip at "сцепления", keeps sliding at constant speed, then drifts off the road
const ca=$("#s3-carA");
tl.fromTo(ca,{x:-420},{x:1250,duration:A(25.9)-A(20.2),ease:"none"},A(20.2));
tl.fromTo("#s3-shA",{x:-420},{x:1250,duration:A(25.9)-A(20.2),ease:"none"},A(20.2));
tl.fromTo(["#s3-ca-w0","#s3-ca-w1"],{rotation:0},{rotation:900,duration:A(22.7)-A(20.2),ease:"none",svgOrigin:(i)=>(i?"120 0":"-100 0")},A(20.2));
tl.to("#s3-ca-brake",{fill:"#ff3020",duration:.05},A(22.68)); tl.to("#s3-ca-bglow",{opacity:1,duration:.1},A(22.68));
tl.to(ca,{y:-150,rotation:-7,svgOrigin:"0 0",duration:A(25.9)-A(23.6),ease:"power1.in"},A(23.6));
tl.to("#s3-shA",{opacity:.1,duration:1.6},A(23.6));
tl.fromTo("#s3-tagF",{opacity:0,y:16},{opacity:1,y:0,duration:.4,ease:"expo.out"},A(22.68));
tl.to("#s3-tagF",{opacity:0,filter:"blur(8px)",duration:.25},A(25.4));
// car B: brakes, slides, lifts and turns
const cb=$("#s3-carB");
tl.fromTo(cb,{x:0},{x:-700,duration:7,ease:"none"},A(21.6));
tl.fromTo(["#s3-cb-w0","#s3-cb-w1"],{rotation:0},{rotation:-500,duration:A(23.9)-A(21.6),ease:"none",svgOrigin:(i)=>(i?"120 0":"-100 0")},A(21.6));
tl.to("#s3-cb-brake",{fill:"#ff3020",duration:.05},A(23.9)); tl.to("#s3-cb-bglow",{opacity:1,duration:.1},A(23.9));
tl.to(cb,{y:-260,rotation:12,svgOrigin:"0 0",duration:5,ease:"power1.in"},A(24.2));
// people: one push sends a person flying, others drift; unsecured things follow
Kit.pose(tl,"s3a",{thighB:-40,shinB:70,thighF:-46,shinF:76,torso:16,uArmB:-30,uArmF:-20},A(25.5),.3,"power2.out");
tl.to("#s3a-root",{y:46,duration:.3,ease:"power2.out"},A(25.5));
Kit.pose(tl,"s3a",{thighB:4,shinB:4,thighF:0,shinF:2,torso:-4,uArmB:170,uArmF:160,fArmB:0,fArmF:0},A(25.85),.25,"power3.out");
tl.to("#s3a-root",{y:-1250,rotation:-14,duration:4.3,ease:"none"},A(25.85));
Kit.pose(tl,"s3a","flail",A(26.7),1.2,"sine.inOut");
tl.to("#s3b-root",{y:-520,x:-60,rotation:-30,duration:5,ease:"power1.in"},A(26.2));
Kit.pose(tl,"s3b","surprise",A(26.2),.6,"power2.out"); Kit.pose(tl,"s3b","flail",A(27.4),1.4,"sine.inOut");
tl.to("#s3c-root",{y:-420,x:30,rotation:22,duration:5,ease:"power1.in"},A(26.6));
Kit.pose(tl,"s3c","float",A(26.6),.9,"power2.out"); Kit.pose(tl,"s3c","swim",A(28),1.5,"sine.inOut");
tl.to("#s3-bin",{y:-380,rotation:-50,svgOrigin:"322 1414",duration:4,ease:"power1.in"},A(27.7));
tl.to("#s3-bike",{y:-300,rotation:30,svgOrigin:"460 1400",duration:4,ease:"power1.in"},A(27.9));
tl.to("#s3-ball",{y:-520,x:60,duration:3.5,ease:"power1.in"},A(27.75));
tl.to("#s3-crown",{scale:1.06,svgOrigin:"940 1220",duration:.5,yoyo:true,repeat:5,ease:"sine.inOut"},A(26));
// sky: plane struggles, air thins
tl.set("#s3-planeM",{x:1350,y:640},0);
tl.to("#s3-planeM",{x:-420,y:700,duration:A(34.4)-A(29.9),ease:"none"},A(29.9));
tl.fromTo("#s3-plane",{rotation:0},{keyframes:[{rotation:-6,duration:.5},{rotation:8,duration:.55},{rotation:-10,duration:.5},{rotation:12,duration:.6},{rotation:-4,duration:.5}],ease:"sine.inOut",svgOrigin:"0 0"},A(30.9));
tl.to("#s3-trail",{attr:{d:"M260 -6 Q560 50 860 0 T1500 10"},duration:2,ease:"sine.inOut"},A(31));
tl.to("#s3-strobe",{opacity:.1,duration:.15,yoyo:true,repeat:13,ease:"steps(1)"},A(30));
tl.fromTo("#s3-tagP",{opacity:0,x:-30},{opacity:1,x:0,duration:.4,ease:"expo.out"},A(31.5));
const pv={v:101}; const pel=$("#s3-pval");
tl.fromTo(pv,{v:101},{v:84,duration:2.4,ease:"power1.in",onUpdate:()=>{pel.textContent=Math.round(pv.v)+"\\u00a0кПа";}},A(31.6));
tl.to("#s3-thin",{opacity:.6,duration:4,ease:"power1.in"},A(30));

tl.to("#s3-tagP",{opacity:0,duration:.2},A(33.6));
`;
  return { id: "s3", dur: 14.5, file: sceneFile({ id: "s3", dur: 14.5, css, body, js }) };
};
