import { sceneFile, character, lookVars, grain, rng, f } from "../components.mjs";
// Scene 6 — abs 63.0–77.5 (local = abs − 63). A person adrift near Earth: no air, vacuum, radiation.
const T0 = 63;
export default () => {
  const R = rng(66);
  let vap = "";
  for (let i = 0; i < 7; i++) vap += `<circle class="s6-vap" cx="${46 + i * 3}" cy="${-172 + (i % 3 - 1) * 4}" r="${6 + i * 1.5}" fill="#e8f4ff" opacity="0"/>`;
  let rig = character("s6m");
  rig = rig.replace(`<g id="s6m-head">`, `<g id="s6m-head"><g style="filter:blur(3px)">${vap}</g>`);
  let rays = "";
  for (let i = 0; i < 14; i++) { const a = i * (360 / 14) + R() * 8, L = 380 + R() * 420; rays += `<path d="M0 -6 L${f(L)} -1.5 L${f(L)} 1.5 L0 6 Z" transform="rotate(${f(a)})" fill="#fff1d0" opacity="${f(0.12 + R() * 0.22)}"/>`; }
  const body = `
<div id="s6-in" style="position:absolute;inset:0">
<canvas id="s6-stars" width="1080" height="1920" style="position:absolute;inset:0"></canvas>
<div id="s6-cam" style="position:absolute;inset:0;transform-origin:540px 900px">
<canvas id="s6-cv" width="1080" height="1920" style="position:absolute;inset:0"></canvas>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <defs><radialGradient id="s6-sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".08" stop-color="#fff4d6"/><stop offset=".22" stop-color="#ffc070" stop-opacity=".55"/><stop offset=".6" stop-color="#ff7a3a" stop-opacity=".12"/><stop offset="1" stop-color="#ff7a3a" stop-opacity="0"/></radialGradient></defs>
  <g id="s6-sun" transform="translate(900 300)"><g id="s6-rays" style="mix-blend-mode:screen">${rays}</g><circle r="420" fill="url(#s6-sg)"/></g>
  <g id="s6-man" transform="translate(540 760) scale(1.55)" style="${lookVars("hero")};--rim:#ffc08a;filter:drop-shadow(-3px 3px 0 rgba(90,170,255,.35)) drop-shadow(4px -4px 10px rgba(255,150,70,.55))">${rig}</g>
</svg></div>
<div id="s6-warm" style="position:absolute;inset:0;background:radial-gradient(circle at 85% 15%,rgba(255,190,110,.55),rgba(255,120,60,.15) 45%,rgba(255,120,60,0) 75%);mix-blend-mode:screen;opacity:0"></div>
<div id="s6-dark" style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 48% at 50% 42%,rgba(0,0,0,0) 30%,rgba(0,0,0,.96) 100%);opacity:0"></div>
<div class="hud" id="s6-tO" style="left:70px;top:220px"><div class="hud-tag warn"><span class="hud-dot"></span>КИСЛОРОД <span class="v">0%</span></div></div>
<div class="hud" id="s6-tP" style="left:70px;top:310px"><div class="hud-tag warn"><span class="hud-dot"></span>ДАВЛЕНИЕ <span class="v">0&nbsp;кПа</span></div></div>
<div class="hud" id="s6-tC" style="left:60px;top:210px;text-align:center;width:330px">
  <svg width="170" height="170" viewBox="0 0 170 170" style="display:block;margin:0 auto"><circle cx="85" cy="85" r="70" fill="rgba(5,14,40,.6)" stroke="rgba(255,120,60,.25)" stroke-width="10"/><circle id="s6-ring" cx="85" cy="85" r="70" fill="none" stroke="#ff7a3d" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="0" transform="rotate(-90 85 85)"/><text x="85" y="97" text-anchor="middle" font-family="Mont" font-weight="900" font-size="38" fill="#fff">~15 с</text></svg>
  <div class="hud-small" style="margin-top:12px;color:#ffd2b0">до потери сознания</div></div>
<div class="hud" id="s6-tU" style="left:70px;top:220px"><div class="hud-tag warn"><span class="hud-dot"></span>УФ И РАДИАЦИЯ</div></div>
<div class="vignette"></div>

</div>`;
  const css = `#s6-tO,#s6-tP,#s6-tC,#s6-tU{opacity:0}`;
  const js = `
const A = (t) => +(t - ${T0}).toFixed(3);

Kit.stars($("#s6-stars"),606,800);
Kit.rigInit("s6m"); gsap.set("#s6m-root",{svgOrigin:"0 -40"}); Kit.poseSet("s6m","float");
const G = Kit.Globe($("#s6-cv"), 9), K = Kit, rg=(t,a,b)=>K.range(t,A(a),A(b));
const cr = K.rng(77), cracks=[];
for(let i=0;i<9;i++){const pts=[];let lon=cr()*120-60, lat=cr()*80-20;for(let k=0;k<7;k++){pts.push([lon,lat]);lon+=(cr()-.3)*14;lat+=(cr()-.5)*12;}cracks.push(pts);}
Kit.canvasClock(tl, 14.5, (t) => {
  G.draw({ cx: 540, cy: 2330, r: 1180, rotate: [20 - t*1.6, -38, 8], sun: [0.6,-0.8], dry: .85, atm: .3, clouds: .12, lights: .25, haze: .35, strip: .05,
    overlay: (ctx, proj) => { ctx.save(); ctx.globalCompositeOperation="lighter"; ctx.lineJoin="round";
      for (const c of cracks){ ctx.beginPath(); let first=true; for(const p of c){const xy=proj(p); if(!xy) continue; if(first){ctx.moveTo(xy[0],xy[1]);first=false;} else ctx.lineTo(xy[0],xy[1]);}
        ctx.strokeStyle="rgba(255,120,40,.35)"; ctx.lineWidth=14; ctx.stroke(); ctx.strokeStyle="rgba(255,200,120,.8)"; ctx.lineWidth=3; ctx.stroke(); }
      ctx.restore(); } });
});
tl.fromTo("#s6-in",{opacity:0},{opacity:1,duration:.3,ease:"power2.out"},0);
tl.fromTo("#s6-cam",{scale:1.25},{scale:1,duration:3,ease:"power2.out"},0);
tl.to("#s6-cam",{scale:1.12,y:-40,duration:A(72.8)-A(66),ease:"sine.inOut"},A(66));
tl.to("#s6-cam",{scale:1.0,y:0,duration:A(77.5)-A(72.8),ease:"sine.inOut"},A(72.8));
tl.fromTo("#s6m-root",{rotation:-10,x:-30,y:0},{rotation:30,x:40,y:-40,duration:14.5,ease:"none"},0);
tl.fromTo("#s6-rays",{rotation:0},{rotation:24,svgOrigin:"0 0",duration:14.5,ease:"none"},0);
Kit.pose(tl,"s6m","swim",A(64),1.6,"sine.inOut");
// no air: a gasp, the breath leaves as vapour
tl.set("#s6m-mouthN",{opacity:0},A(66.3)); tl.set("#s6m-mouthO",{opacity:1},A(66.3));
tl.to("#s6m-brow",{y:-5,rotation:-8,svgOrigin:"30 -208",duration:.25},A(66.3));
Kit.pose(tl,"s6m",{uArmF:30,fArmF:110,uArmB:60,fArmB:90,head:-12},A(66.4),.5,"power2.out");
tl.fromTo(".s6-vap",{opacity:0,x:0,y:0,scale:.4},{opacity:.85,x:(i)=>30+i*14,y:(i)=>(i%3-1)*16,scale:1.6,duration:.8,ease:"power2.out",stagger:.07},A(66.45));
tl.to(".s6-vap",{opacity:0,scale:3,duration:1.2,ease:"power1.out",stagger:.07},A(67.15));
tl.fromTo("#s6-tO",{opacity:0,x:-24},{opacity:1,x:0,duration:.4,ease:"expo.out"},A(66.42));
tl.fromTo("#s6-tP",{opacity:0,x:-24},{opacity:1,x:0,duration:.4,ease:"expo.out"},A(66.9));
tl.to(["#s6-tO","#s6-tP"],{opacity:0,filter:"blur(6px)",duration:.25},A(68.6));
// consciousness fades
tl.fromTo("#s6-tC",{opacity:0,scale:.9},{opacity:1,scale:1,duration:.35,ease:"expo.out"},A(69.0));
tl.fromTo("#s6-ring",{attr:{"stroke-dashoffset":0}},{attr:{"stroke-dashoffset":1},duration:A(72.6)-A(71.1),ease:"none"},A(71.1));
tl.to("#s6-tC",{opacity:0,duration:.3},A(72.7));
tl.to("#s6-dark",{opacity:.85,duration:A(72.4)-A(69.5),ease:"power1.in"},A(69.5));
tl.to("#s6-dark",{opacity:.35,duration:1.6,ease:"power2.out"},A(72.8));
Kit.pose(tl,"s6m","limp",A(71.2),1.8,"sine.inOut");
tl.set("#s6m-mouthO",{opacity:0},A(71.8)); tl.set("#s6m-mouthN",{opacity:1},A(71.8));
tl.set("#s6m-eyeO",{opacity:0},A(71.85)); tl.set("#s6m-eyeC",{opacity:1},A(71.85));
// silence, vacuum, the Sun's radiation
tl.fromTo("#s6-sun",{scale:1,svgOrigin:"900 300"},{scale:1.35,duration:A(76.8)-A(72.9),ease:"sine.inOut"},A(72.9));
tl.to("#s6-warm",{opacity:1,duration:A(76.5)-A(73.5),ease:"sine.inOut"},A(73.5));
tl.fromTo("#s6-tU",{opacity:0,y:12},{opacity:1,y:0,duration:.35,ease:"expo.out"},A(75.5));
tl.to("#s6-tU",{opacity:0,duration:.25},A(77.0));
`;
  return { id: "s6", dur: 14.5, file: sceneFile({ id: "s6", dur: 14.5, css, body, js }) };
};
