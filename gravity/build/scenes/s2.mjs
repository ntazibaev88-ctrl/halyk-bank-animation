import { sceneFile, character, lookVars, bedroom, phone, mug, grain, rng, f } from "../components.mjs";
// Scene 2 — abs 7.0–20.5 (local = abs − 7). Floating in the room; force, inertia, Earth turning away.
const T0 = 7;
export default () => {
  const R = rng(21);
  let stars = "";
  for (let i = 0; i < 120; i++) stars += `<circle cx="${f(R() * 1080)}" cy="${f(R() * 1300)}" r="${f(0.6 + Math.pow(R(), 3) * 2.4)}" fill="#dfe9ff" opacity="${f(0.3 + R() * 0.7)}"/>`;
  const obj = (id, x, y, inner, vx, vy) => {
    const ang = Math.atan2(vy, vx) * 180 / Math.PI;
    return `<line class="s2-path" x1="${x}" y1="${y}" x2="${f(x + vx * 3.2)}" y2="${f(y + vy * 3.2)}" stroke="#7fd8ff" stroke-width="2.5" stroke-dasharray="8 10" opacity="0"/>
    <g id="${id}-mv"><g id="${id}-rot">${inner}</g>
      <g class="s2-vec" opacity="0" transform="translate(${x} ${y}) rotate(${f(ang)})"><line x1="40" y1="0" x2="118" y2="0" stroke="#7fd8ff" stroke-width="5" stroke-linecap="round"/><path d="M118 -11 L138 0 L118 11 Z" fill="#7fd8ff"/></g></g>`;
  };
  const book = `<g transform="translate(180 430)"><path d="M-70 -10 Q-35 -34 0 -14 Q35 -34 70 -10 L70 34 Q35 12 0 30 Q-35 12 -70 34 Z" fill="#f2efe6"/><path d="M0 -14 L0 30" stroke="#b8b2a0" stroke-width="3"/><path d="M-60 0 Q-32 -16 -8 -2 M-60 12 Q-32 -4 -8 10 M8 -2 Q32 -16 60 0 M8 10 Q32 -4 60 12" stroke="#9aa0b5" stroke-width="2.5" fill="none"/><path d="M-72 34 Q-35 14 0 32 Q35 14 72 34 L72 40 Q35 20 0 38 Q-35 20 -72 40 Z" fill="#c2492f"/></g>`;
  const pen = `<g transform="translate(880 880)"><rect x="-56" y="-6" width="112" height="12" rx="6" fill="#ffb547"/><path d="M56 -6 L74 0 L56 6 Z" fill="#2a2a2a"/><rect x="-56" y="-6" width="18" height="12" rx="4" fill="#3fa9ff"/></g>`;
  const body = `
<div id="s2-in" style="position:absolute;inset:0">
<div id="s2-cam" style="position:absolute;inset:0;transform-origin:540px 960px">
<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <g style="filter:blur(6px) brightness(.7)" transform="translate(-120 -330) scale(1.22)">${bedroom("s2", { r: 3 })}</g>
  <rect x="-300" y="-300" width="1680" height="2520" fill="#04102e" opacity=".35"/>
  <ellipse id="s2-shadow" cx="560" cy="1500" rx="120" ry="18" fill="#000" opacity=".35" style="filter:blur(8px)"/>
  ${obj("s2-book", 180, 430, book, 40, -26)}
  ${obj("s2-mug", 840, 400, `<g transform="translate(-27 -36)">${mug("s2-mugi", 840, 400)}</g>`, -34, 22)}
  <g id="s2-water"><ellipse id="s2-blob" cx="742" cy="520" rx="34" ry="30" fill="#7fd0ff" opacity=".8"/><ellipse cx="732" cy="508" rx="10" ry="7" fill="#fff" opacity=".7"/>
    <circle class="s2-drop" cx="700" cy="560" r="9" fill="#7fd0ff" opacity=".8"/><circle class="s2-drop" cx="790" cy="560" r="6" fill="#7fd0ff" opacity=".8"/><circle class="s2-drop" cx="770" cy="470" r="5" fill="#7fd0ff" opacity=".8"/></g>
  ${obj("s2-pen", 880, 880, pen, -42, -36)}
  ${obj("s2-ph", 190, 980, `<g transform="translate(-29 -52)">${phone("s2-phone", 190, 980)}</g>`, 34, -40)}
  <g transform="translate(540 820) scale(1.25)" style="${lookVars("hero")};--rim:#ffb27a">${character("s2m")}</g>
</svg>
</div>
<svg id="s2-fx" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <defs><filter id="s2-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g id="s2-force" filter="url(#s2-glow)"><line x1="540" y1="830" x2="540" y2="1090" stroke="#3fa9ff" stroke-width="12" stroke-linecap="round"/><path d="M516 1086 L540 1130 L564 1086 Z" fill="#3fa9ff"/><circle cx="540" cy="830" r="11" fill="#fff"/></g>
  <g id="s2-rocket" filter="url(#s2-glow)"><line id="s2-rline" x1="540" y1="470" x2="540" y2="240" stroke="#ff4a3d" stroke-width="9" stroke-dasharray="22 14" stroke-linecap="round"/><path id="s2-rhead" d="M514 252 L540 200 L566 252 Z" fill="#ff4a3d"/></g>
  <g id="s2-x" filter="url(#s2-glow)"><path d="M470 270 L610 410 M610 270 L470 410" stroke="#ff4a3d" stroke-width="20" stroke-linecap="round"/></g>
</svg>
<div class="hud" id="s2-tagF" style="left:70px;top:900px"><div class="hud-tag"><span class="hud-dot"></span>СИЛА ТЯЖЕСТИ <span class="v" id="s2-fval">686&nbsp;Н</span></div></div>
<div class="hud" id="s2-tagR" style="left:640px;top:250px"><div class="hud-tag warn">КАК РАКЕТА?</div></div>
<div class="hud" id="s2-tagI" style="left:0;right:0;top:210px;text-align:center"><div class="hud-tag"><span class="hud-dot"></span>ИНЕРЦИЯ</div><div class="hud-small" style="margin-top:14px">скорость и направление сохраняются</div></div>
<div id="s2-dia" style="position:absolute;inset:0;transform-origin:923px 906px">
<svg width="1080" height="1920" viewBox="0 180 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <defs>
    <radialGradient id="s2-earth" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="#2f8fe8"/><stop offset=".25" stop-color="#145aa8"/><stop offset="1" stop-color="#04163a"/></radialGradient>
    <clipPath id="s2-clip"><circle cx="540" cy="1900" r="898"/></clipPath>
    <radialGradient id="s2-atm" cx=".5" cy=".5" r=".5"><stop offset=".9" stop-color="#6fc3ff" stop-opacity=".0"/><stop offset=".93" stop-color="#6fc3ff" stop-opacity=".6"/><stop offset="1" stop-color="#6fc3ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect x="-200" y="-200" width="1480" height="2400" fill="#030716"/>
  ${stars}
  <g id="s2-earthg">
    <circle cx="540" cy="1900" r="980" fill="url(#s2-atm)"/>
    <circle cx="540" cy="1900" r="900" fill="url(#s2-earth)"/>
    <g clip-path="url(#s2-clip)" fill="#3f8a4f" opacity=".9">
      <path d="M250 1060 Q300 1012 380 1030 Q430 1046 470 1024 Q520 1004 560 1010 Q640 1000 700 1030 Q760 1060 800 1110 Q760 1160 680 1140 Q600 1120 520 1150 Q420 1170 330 1130 Q260 1110 250 1060 Z"/>
      <path d="M-40 1300 Q20 1220 120 1240 Q180 1270 160 1330 Q100 1380 20 1360 Z"/>
      <path d="M900 1180 Q980 1170 1060 1230 Q1110 1300 1040 1330 Q960 1320 920 1260 Z"/>
      <path d="M380 1240 Q430 1220 470 1250 Q480 1290 430 1300 Q380 1290 380 1240 Z"/>
    </g>
    <g id="s2-house"><path d="M522 1002 L540 986 L558 1002 L558 1002 Z" fill="#ff8a3d"/><rect x="526" y="1000" width="28" height="18" fill="#f2e6d0"/><rect x="536" y="1006" width="8" height="12" fill="#2b5c9e"/></g>
    <g id="s2-rotarrow" opacity="0"><path d="M300 1140 A880 880 0 0 1 780 1140" stroke="#7fd8ff" stroke-width="5" fill="none" stroke-dasharray="4 10" transform="rotate(0 540 1900)"/><path d="M772 1124 L800 1146 L768 1158 Z" fill="#7fd8ff"/></g>
  </g>
  <line id="s2-tan" x1="540" y1="985" x2="980" y2="985" stroke="#7fd8ff" stroke-width="4" stroke-dasharray="12 12" opacity="0"/>
  <line id="s2-gap" x1="540" y1="985" x2="540" y2="1000" stroke="#ff8a3d" stroke-width="6" stroke-linecap="round" opacity="0"/>
  <g id="s2-dot"><circle cx="0" cy="0" r="22" fill="#7fd8ff" opacity=".25"/><circle cx="0" cy="0" r="11" fill="#e8f7ff"/></g>
</svg>
<div class="hud" id="s2-dT" style="left:520px;top:700px"><span class="hud-small">ПО ИНЕРЦИИ — ПРЯМО</span></div>
<div class="hud" id="s2-dR" style="left:0;right:0;top:930px;text-align:center"><span class="hud-small">ВРАЩЕНИЕ ЗЕМЛИ →</span></div>
<div class="hud" id="s2-dG" style="left:380px;top:430px"><div class="hud-tag warn"><span class="hud-dot"></span>ЗЕМЛЯ УХОДИТ<br>ИЗ-ПОД НОГ</div></div>
<div class="hud" id="s2-dN" style="left:0;right:0;top:230px;text-align:center"><span class="hud-small" style="opacity:.6">схема, не в масштабе</span></div>
</div>
<div class="vignette"></div>

</div>`;
  const css = `#s2-tagF,#s2-tagR,#s2-tagI,#s2-dT,#s2-dR,#s2-dG,#s2-dN{opacity:0}`;
  const js = `
const A = (t) => +(t - ${T0}).toFixed(3);
const cam = $("#s2-cam");
Kit.rigInit("s2m"); gsap.set("#s2m-root",{svgOrigin:"0 0"});
Kit.poseSet("s2m","surprise"); gsap.set("#s2m-mouthN",{opacity:0}); gsap.set("#s2m-mouthO",{opacity:1});

gsap.set(["#s2-force","#s2-rocket","#s2-x","#s2-dia"],{opacity:0});
// entrance: blur swap over the last frames of scene 1
tl.fromTo("#s2-in",{opacity:0,filter:"blur(14px)"},{opacity:1,filter:"blur(0px)",duration:.45,ease:"power2.out"},0);
Kit.cam(tl,cam,{cx:540,cy:900,s:1.12},0,0);
Kit.cam(tl,cam,{cx:540,cy:930,s:1.0},0,5.2,"sine.inOut");
Kit.cam(tl,cam,{cx:540,cy:880,s:0.84},A(12.7),1.1,"power2.inOut");
// the man: slow inertial drift and turn, acting through the beats
tl.fromTo("#s2m-root",{y:20,rotation:-4},{y:-60,rotation:18,duration:8.6,ease:"none"},0);
Kit.pose(tl,"s2m","float",0.3,1.4,"sine.inOut");
Kit.pose(tl,"s2m","swim",A(10.2),1.6,"sine.inOut");
Kit.pose(tl,"s2m","float",A(13.4),1.8,"sine.inOut");
tl.to("#s2-shadow",{opacity:.12,scaleX:.6,svgOrigin:"560 1500",duration:6,ease:"none"},0);
// force of gravity: 686 N → 0
tl.fromTo("#s2-force",{opacity:0,scaleY:0,svgOrigin:"540 830"},{opacity:1,scaleY:1,duration:.45,ease:"expo.out"},A(7.45));
tl.fromTo("#s2-tagF",{opacity:0,x:-30},{opacity:1,x:0,duration:.4,ease:"expo.out"},A(7.55));
const fv={v:686}; const fel=$("#s2-fval");
tl.fromTo(fv,{v:686},{v:0,duration:1.1,ease:"power2.inOut",onUpdate:()=>{fel.textContent=Math.round(fv.v)+"\\u00a0Н";}},A(8.3));
tl.to("#s2-force",{scaleY:0,duration:1.1,ease:"power2.inOut"},A(8.3));
tl.to("#s2-tagF",{opacity:0,filter:"blur(8px)",duration:.25},A(9.9));
// not like a rocket
tl.set("#s2-rocket",{opacity:1},A(10.3));
tl.fromTo("#s2-rline",{attr:{y2:470}},{attr:{y2:240},duration:.5,ease:"power3.out"},A(10.3));
tl.fromTo("#s2-rhead",{y:230,opacity:0},{y:0,opacity:1,duration:.5,ease:"power3.out"},A(10.3));
tl.fromTo("#s2-tagR",{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:"expo.out"},A(10.75));
tl.fromTo("#s2-x",{opacity:0,scale:1.6,svgOrigin:"540 340"},{opacity:1,scale:1,duration:.22,ease:"power4.out"},A(11.94));
tl.to("#s2-rocket",{opacity:.25,duration:.2},A(12.0));
tl.to(["#s2-rocket","#s2-x","#s2-tagR"],{opacity:0,filter:"blur(8px)",duration:.3},A(12.75));
// inertia: straight lines, constant speed, constant spin
const mv=(id,dx,dy,rot,ox,oy)=>{tl.fromTo(id+"-mv",{x:0,y:0},{x:dx,y:dy,duration:13.5,ease:"none"},0);tl.fromTo(id+"-rot",{rotation:0},{rotation:rot,svgOrigin:ox+" "+oy,duration:13.5,ease:"none"},0);};
mv("#s2-book",40*3.2,-26*3.2,28,180,440); mv("#s2-mug",-34*3.2,22*3.2,-50,840,400); mv("#s2-pen",-42*3.2,-36*3.2,300,880,880); mv("#s2-ph",34*3.2,-40*3.2,80,190,980);
tl.fromTo("#s2-water",{x:0,y:0},{x:-170,y:36,duration:13.5,ease:"none"},0);
tl.fromTo("#s2-blob",{attr:{rx:34,ry:30}},{attr:{rx:28,ry:36},duration:.45,ease:"sine.inOut",yoyo:true,repeat:27},0);
tl.fromTo(".s2-drop",{x:0,y:0},{x:(i)=>[-60,50,30][i],y:(i)=>[40,30,-50][i],duration:13.5,ease:"none"},0);
tl.to(".s2-path",{opacity:.7,duration:.5,stagger:.08},A(13.1));
tl.to(".s2-vec",{opacity:1,duration:.4,stagger:.08,ease:"power2.out"},A(13.4));
tl.fromTo("#s2-tagI",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:.3,ease:"power2.out"},A(13.5));
// the room shrinks into a house on the curved Earth
tl.to("#s2-tagI",{opacity:0,duration:.2},A(15.55));
tl.to(cam,{scale:.04,x:0,y:60,opacity:0,duration:.7,ease:"power3.in"},A(15.6));
tl.to(".s2-path,.s2-vec",{opacity:0,duration:.2},A(15.6));
tl.fromTo("#s2-dia",{opacity:0,scale:1.5},{opacity:1,scale:1,duration:.8,ease:"power3.out"},A(15.95));
tl.fromTo("#s2-tan",{opacity:0},{opacity:.85,duration:.4},A(16.5));
tl.fromTo("#s2-dT",{opacity:0},{opacity:1,duration:.35},A(16.6));
tl.fromTo("#s2-rotarrow",{opacity:0},{opacity:1,duration:.35},A(16.4));
tl.fromTo("#s2-dR",{opacity:0},{opacity:1,duration:.35},A(16.5));
tl.fromTo("#s2-dN",{opacity:0},{opacity:1,duration:.35},A(16.7));
const th={a:0}; const eg=$("#s2-earthg"), dot=$("#s2-dot"), gap=$("#s2-gap");
const RR=900, CX=540, CY=1900;
const upd=()=>{const a=th.a; eg.setAttribute("transform",\`rotate(\${(a*180/Math.PI).toFixed(3)} \${CX} \${CY})\`);
  const x=CX+RR*a, y=CY-RR-14; dot.setAttribute("transform",\`translate(\${x.toFixed(2)} \${y})\`);
  const d=Math.hypot(x-CX,y-CY); const sx=CX+(x-CX)/d*(RR+2), sy=CY+(y-CY)/d*(RR+2);
  gap.setAttribute("x1",x.toFixed(2));gap.setAttribute("y1",(y+12).toFixed(2));gap.setAttribute("x2",sx.toFixed(2));gap.setAttribute("y2",sy.toFixed(2));};
upd();
tl.fromTo(th,{a:0},{a:0.44,duration:A(19.5)-A(16.3),ease:"none",onUpdate:upd},A(16.3));
tl.to("#s2-gap",{opacity:1,duration:.3},A(17.4));
tl.fromTo("#s2-dG",{opacity:0,y:16},{opacity:1,y:0,duration:.4,ease:"expo.out"},A(17.55));
// dive into the city
tl.to(["#s2-dT","#s2-dR","#s2-dG","#s2-dN"],{opacity:0,duration:.2},A(19.45));
tl.to("#s2-dia",{scale:7,filter:"blur(10px)",duration:.9,ease:"power3.in"},A(19.55));
`;
  return { id: "s2", dur: 13.5, file: sceneFile({ id: "s2", dur: 13.5, css, body, js }) };
};
