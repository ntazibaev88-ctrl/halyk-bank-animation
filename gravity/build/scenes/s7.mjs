import { sceneFile, grain } from "../components.mjs";
// Scene 7 — abs 77.0–90.0 (local = abs − 77). The debris keeps orbiting the Sun; fade; the next question.
const T0 = 77;
export default () => {
  const body = `
<div id="s7-in" style="position:absolute;inset:0">
<div id="s7-cam" style="position:absolute;inset:0;transform-origin:400px 900px">
<canvas id="s7-stars" width="1680" height="2720" style="position:absolute;left:-300px;top:-400px"></canvas>
<canvas id="s7-cv" width="1680" height="2720" style="position:absolute;left:-300px;top:-400px"></canvas>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  <circle id="s7-orbit" cx="130" cy="860" r="660" fill="none" stroke="#7fd8ff" stroke-width="3" stroke-dasharray="10 14" opacity="0"/>
  <g id="s7-arrow" opacity="0"><line x1="700" y1="990" x2="370" y2="905" stroke="#ff8a3d" stroke-width="6" stroke-linecap="round"/><path d="M372 888 L338 897 L366 920 Z" fill="#ff8a3d"/></g>
</svg></div>
<div class="hud" id="s7-tS" style="left:0;right:0;top:300px;text-align:center"><div class="hud-tag warn"><span class="hud-dot"></span>ГРАВИТАЦИЯ СОЛНЦА <span class="v">остаётся</span></div></div>
<div class="hud" id="s7-tO" style="left:620px;top:600px"><span class="hud-small" style="font-size:28px">орбита Земли</span></div>
<div id="s7-black" style="position:absolute;inset:0;background:#000;opacity:0"></div>
<div id="s7-q">
  <div id="s7-qglow"></div>
  <div class="s7-l"><span class="s7-w" id="s7-w0">А</span> <span class="s7-w" id="s7-w1">ЧТО,</span> <span class="s7-w" id="s7-w2">ЕСЛИ</span></div>
  <div class="s7-l s7-big"><span class="s7-w" id="s7-w3">ИСЧЕЗНЕТ</span></div>
  <div class="s7-l s7-hero"><span class="s7-w" id="s7-w4">СОЛНЦЕ?</span></div>
</div>
<div class="vignette"></div>

</div>`;
  const css = `#s7-tS,#s7-tO{opacity:0}
#s7-q{position:absolute;left:0;right:0;top:640px;text-align:center;color:#fff;font-weight:900;}
#s7-qglow{position:absolute;left:50%;top:268px;width:620px;height:620px;margin:-310px 0 0 -310px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,110,.75) 0%,rgba(255,140,60,.3) 30%,rgba(255,110,40,0) 65%);opacity:0;}
.s7-l{position:relative;font-size:70px;line-height:1.1;letter-spacing:.02em;font-weight:800;}
.s7-big{font-size:104px;font-weight:900;}
.s7-hero{font-size:124px;font-weight:900;color:#ff8a3d;text-shadow:0 0 50px rgba(255,120,40,.7);}
.s7-w{display:inline-block;opacity:0;}`;
  const js = `
const A = (t) => +(t - ${T0}).toFixed(3);

Kit.stars($("#s7-stars"),707,1300);
const cv=$("#s7-cv"), ctx=cv.getContext("2d"), K=Kit, rg=(t,a,b)=>K.range(t,A(a),A(b));
const SX=130, SY=860, OR=660, EA=Math.atan2(990-SY,700-SX);
const pr=K.rng(808), parts=[];
for(let i=0;i<700;i++) parts.push({da:(pr()-.5)*2, dr:(pr()-.5), s:.6+pr()*2.2, hot:pr()<.3, sp:.3+pr()});
const frags=[]; for(let i=0;i<9;i++){const pts=[];const n=5+Math.floor(pr()*3),rr=10+pr()*22;for(let k=0;k<n;k++){const a=k/n*Math.PI*2;pts.push([Math.cos(a)*rr*(.6+pr()*.5),Math.sin(a)*rr*(.6+pr()*.5)]);}frags.push({pts,a:pr()*Math.PI*2,d:pr(),rot:(pr()-.5)*2});}
Kit.canvasClock(tl,13,(t)=>{
  ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,1680,2720); ctx.setTransform(1,0,0,1,300,400);
  // the Sun
  const g=ctx.createRadialGradient(SX,SY,0,SX,SY,560); g.addColorStop(0,"rgba(255,250,235,1)"); g.addColorStop(.1,"rgba(255,226,160,.95)"); g.addColorStop(.22,"rgba(255,170,80,.45)"); g.addColorStop(.55,"rgba(255,110,40,.1)"); g.addColorStop(1,"rgba(255,90,30,0)");
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(SX,SY,560,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#fff8e8"; ctx.beginPath(); ctx.arc(SX,SY,58,0,Math.PI*2); ctx.fill();
  const spread=.04+.5*K.inOut(rg(t,79.8,89)), glow=1-.6*K.inOut(rg(t,82.8,85));
  // debris spreading along the orbit
  ctx.globalCompositeOperation="lighter";
  for(const p of parts){const a=EA+p.da*spread*(.4+p.sp*.6), r=OR+p.dr*(18+spread*60);
    const x=SX+Math.cos(a)*r, y=SY+Math.sin(a)*r;
    ctx.fillStyle=p.hot?\`rgba(255,150,70,\${.65*glow})\`:\`rgba(200,180,160,\${.45})\`;
    ctx.beginPath(); ctx.arc(x,y,p.s*(p.hot?1:.8),0,Math.PI*2); ctx.fill();}
  ctx.globalCompositeOperation="source-over";
  // the larger fragments of Earth
  const ex=SX+Math.cos(EA)*OR, ey=SY+Math.sin(EA)*OR;
  const hg=ctx.createRadialGradient(ex,ey,0,ex,ey,120); hg.addColorStop(0,\`rgba(255,140,60,\${.5*glow})\`); hg.addColorStop(1,"rgba(255,140,60,0)");
  ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(ex,ey,120,0,Math.PI*2); ctx.fill();
  for(const fr of frags){const d=(20+fr.d*50)*(1+t*.12), x=ex+Math.cos(fr.a)*d, y=ey+Math.sin(fr.a)*d;
    ctx.save(); ctx.translate(x,y); ctx.rotate(fr.rot*t*.15);
    ctx.beginPath(); fr.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.closePath();
    const fg=ctx.createLinearGradient(-30,-30,30,30); fg.addColorStop(0,"#b39070"); fg.addColorStop(.5,"#5a4636"); fg.addColorStop(1,"#1c140e");
    ctx.fillStyle=fg; ctx.fill(); ctx.strokeStyle=\`rgba(255,140,60,\${.7*glow})\`; ctx.lineWidth=2; ctx.stroke(); ctx.restore();}
});
tl.fromTo("#s7-in",{opacity:0},{opacity:1,duration:.35,ease:"power2.out"},0);
tl.fromTo("#s7-cam",{scale:1.3},{scale:1.04,duration:2.2,ease:"power3.out"},0);
tl.to("#s7-cam",{scale:.86,duration:A(85.4)-A(79.2),ease:"sine.inOut"},A(79.2));
tl.fromTo("#s7-arrow",{opacity:0},{opacity:1,duration:.4},A(77.4));
tl.fromTo("#s7-tS",{opacity:0,y:12},{opacity:1,y:0,duration:.4,ease:"expo.out"},A(77.4));
tl.to(["#s7-tS","#s7-arrow"],{opacity:0,duration:.3},A(79.6));
tl.fromTo("#s7-orbit",{opacity:0,attr:{"stroke-dashoffset":300}},{opacity:.7,attr:{"stroke-dashoffset":0},duration:2.5,ease:"power2.out"},A(79.85));
tl.fromTo("#s7-tO",{opacity:0},{opacity:1,duration:.4},A(80.4));
tl.to(["#s7-tO","#s7-orbit"],{opacity:0,duration:.6},A(82.9));
// fade to black, then the question
tl.to("#s7-black",{opacity:1,duration:.9,ease:"power2.inOut"},A(84.5));
${[85.75, 85.89, 86.18, 86.59, 87.29].map((t, i) => `tl.fromTo("#s7-w${i}",{opacity:0,filter:"blur(10px)",scale:${i === 4 ? 1.15 : 1}},{opacity:1,filter:"blur(0px)",scale:1,duration:${i === 4 ? .35 : .18},ease:"power3.out"},A(${t}));`).join("\n")}
tl.fromTo("#s7-qglow",{opacity:0,scale:.6},{opacity:1,scale:1,duration:.6,ease:"power2.out"},A(87.3));
tl.to("#s7-qglow",{keyframes:[{opacity:.4,duration:.12},{opacity:.9,duration:.1},{opacity:.25,duration:.15},{opacity:.6,duration:.1},{opacity:0,duration:1.1}],ease:"none"},A(88.4));
`;
  return { id: "s7", dur: 13, file: sceneFile({ id: "s7", dur: 13, css, body, js }) };
};
