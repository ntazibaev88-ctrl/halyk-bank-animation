import { sceneFile, grain } from "../components.mjs";
// Scene 4 — abs 34.0–48.5 (local = abs − 34). Earth from space: atmosphere leaves, oceans boil.
const T0 = 34;
export default () => {
  const body = `
<div id="s4-in" style="position:absolute;inset:0">
<canvas id="s4-stars" width="1080" height="1920" style="position:absolute;inset:0"></canvas>
<div id="s4-sun" style="position:absolute;left:-420px;top:-380px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,200,.55) 0%,rgba(255,170,90,.18) 28%,rgba(255,140,60,0) 62%)"></div>
<div id="s4-gw" style="position:absolute;inset:0;transform-origin:540px 900px"><canvas id="s4-cv" data-layout-allow-overflow width="1080" height="1920" style="position:absolute;inset:0"></canvas></div>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <g id="s4-lead1" opacity="0"><path id="s4-l1p" d="M250 420 L250 470 L196 560" stroke="#7fd8ff" stroke-width="3" fill="none"/><circle cx="196" cy="560" r="8" fill="#7fd8ff"/></g>
  <g id="s4-lead2" opacity="0"><path d="M700 1060 L790 1130" stroke="#ff8a3d" stroke-width="3" fill="none"/><circle cx="700" cy="1060" r="8" fill="#ff8a3d"/></g>
</svg>
<div class="hud" id="s4-tA" style="left:90px;top:330px"><div class="hud-tag"><span class="hud-dot"></span>АТМОСФЕРА</div></div>
<div class="hud" id="s4-tP" style="left:0;right:0;top:215px;text-align:center"><div class="hud-tag warn"><span class="hud-dot"></span>ДАВЛЕНИЕ <span class="v" id="s4-pv">101&nbsp;кПа</span> ↓</div></div>
<div class="hud" id="s4-tX" style="left:560px;top:330px"><span class="hud-small">воздух уходит<br>в космос →</span></div>
<div class="hud" id="s4-tO" style="left:0;right:0;top:320px;text-align:center"><div class="hud-tag warn"><span class="hud-dot"></span>ОКЕАНЫ КИПЯТ</div><div class="hud-small" style="margin-top:14px;text-transform:none;font-size:27px">при низком давлении вода кипит даже при +20&nbsp;°C</div></div>
<div id="s4-flash" style="position:absolute;inset:0;background:#eef4ff"></div>
<div class="vignette"></div>

</div>`;
  const css = `#s4-tA,#s4-tP,#s4-tX,#s4-tO{opacity:0}`;
  const js = `
const A = (t) => +(t - ${T0}).toFixed(3);

Kit.stars($("#s4-stars"),404,700);
const G = Kit.Globe($("#s4-cv"), 7);
const K = Kit, rg = (t,a,b)=>K.range(t,A(a),A(b));
Kit.canvasClock(tl, 14.5, (t) => {
  const zin = K.outExpo(rg(t,34.0,36.6));
  const zout = K.inQuad(rg(t,47.7,48.5));
  const r = K.lerp(1500, 480, zin) - 40*K.inOut(rg(t,36.6,47.5)) + 1400*zout;
  const cy = K.lerp(1750, 910, zin) + 300*zout;
  G.draw({ cx: 540, cy, r, rotate: [-8 - t*2.2, -20, 0], sun: [-0.75,-0.6],
    strip: K.inOut(rg(t,37.4,47.8)), boil: K.inOut(rg(t,41.2,48)), haze: K.inOut(rg(t,44.2,48.3)),
    dry: 0.75*K.inOut(rg(t,43,48.3)), clouds: 1 - 0.75*K.inOut(rg(t,40.5,47.5)), cloudShift: t*1.2 });
});
tl.fromTo("#s4-flash",{opacity:.8},{opacity:0,duration:.6,ease:"power2.out"},0);
tl.fromTo("#s4-sun",{opacity:.5,scale:.8},{opacity:1,scale:1,duration:4,ease:"sine.out"},0);
tl.to("#s4-gw",{filter:"blur(10px)",duration:.6,ease:"power2.in"},A(47.9));
// atmosphere label
tl.to("#s4-lead1",{opacity:1,duration:.3},A(34.3));
tl.fromTo("#s4-tA",{opacity:0,x:-24},{opacity:1,x:0,duration:.4,ease:"expo.out"},A(34.3));
tl.to(["#s4-tA","#s4-lead1"],{opacity:0,filter:"blur(6px)",duration:.25},A(40.6));
// pressure falls
tl.fromTo("#s4-tP",{opacity:0,y:-16},{opacity:1,y:0,duration:.4,ease:"expo.out"},A(37.4));
const pv={v:101}, pel=$("#s4-pv");
tl.fromTo(pv,{v:101},{v:1,duration:A(47.6)-A(38),ease:"power1.inOut",onUpdate:()=>{pel.textContent=Math.max(1,Math.round(pv.v))+"\\u00a0кПа";}},A(38));
tl.fromTo("#s4-tX",{opacity:0},{opacity:1,duration:.35},A(38.6));
tl.to("#s4-tX",{opacity:0,duration:.25},A(40.6));
// oceans boil
tl.fromTo("#s4-tO",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:.3,ease:"power2.out"},A(43.0));
tl.fromTo("#s4-lead2",{opacity:0},{opacity:0,duration:.1},A(43.0));
tl.to(["#s4-tP","#s4-tO"],{opacity:0,filter:"blur(8px)",duration:.3},A(47.6));
`;
  return { id: "s4", dur: 14.5, file: sceneFile({ id: "s4", dur: 14.5, css, body, js }) };
};
