const NS="http://www.w3.org/2000/svg";
const G=(id)=>document.getElementById(id);
const SEL=(s)=>Array.from(document.querySelectorAll(s));
/* animated flow: dashed overlay path whose dash offset travels along the pipe (direction = path direction) */
function flow(tl,sel,t0,dur,speed){SEL(sel).forEach(p=>{p.setAttribute("pathLength","100");tl.fromTo(p,{strokeDashoffset:0},{strokeDashoffset:-(speed||120),duration:dur,ease:"none"},t0)})}
function spin(tl,sel,cx,cy,t0,dur,turns){SEL(sel).forEach(e=>tl.fromTo(e,{rotation:0,svgOrigin:cx+" "+cy},{rotation:360*turns,svgOrigin:cx+" "+cy,duration:dur,ease:"none"},t0))}
function pulse(tl,sel,t0,dur,lo,hi,per){const n=Math.floor(dur/per);SEL(sel).forEach(e=>tl.fromTo(e,{opacity:lo},{opacity:hi,duration:per/2,ease:"sine.inOut",yoyo:true,repeat:n*2-1,immediateRender:false},t0))}
function popIn(tl,sel,t0,o){o=o||{};SEL(sel).forEach((e,i)=>tl.fromTo(e,{opacity:0,y:o.y===undefined?24:o.y,scale:o.s||1},{opacity:1,y:0,scale:1,duration:o.d||.5,ease:o.e||"back.out(1.6)"},t0+i*(o.stag||0)))}
function draw(tl,sel,t0,dur,stag){SEL(sel).forEach((e,i)=>{e.setAttribute("pathLength","1");tl.fromTo(e,{strokeDasharray:"1 1",strokeDashoffset:1},{strokeDashoffset:0,duration:dur,ease:"power2.inOut"},t0+i*(stag||0))})}
/* gauge needle sweep */
function needle(tl,sel,cx,cy,t0,keys){SEL(sel).forEach(e=>{keys.forEach((k,i)=>tl.to(e,{rotation:k[1],svgOrigin:cx+" "+cy,duration:k[2],ease:k[3]||"sine.inOut"},k[0]))})}
function steamPuffs(tl,sel,t0,dur,per,rise,drift){SEL(sel).forEach((e,i)=>{const n=Math.max(1,Math.floor(dur/per));tl.fromTo(e,{opacity:0,y:0,x:0,scale:.4},{keyframes:[{opacity:.7,duration:per*.2},{opacity:0,duration:per*.8}],y:-rise,x:drift||0,scale:1.6,duration:per,ease:"none",repeat:n-1,repeatDelay:0},t0+i*per/(SEL(sel).length))})}
function mk(parent,html){const g=document.createElementNS(NS,"g");g.innerHTML=html;(typeof parent==="string"?G(parent):parent).appendChild(g);return g}
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=(n>>16)&255,g=(n>>8)&255,b=n&255;const f=k<0?0:255,t=Math.abs(k);r=Math.round((f-r)*t+r);g=Math.round((f-g)*t+g);b=Math.round((f-b)*t+b);return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
/* pseudo-3D box: front face + top + side */
function box(parent,x,y,w,h,d,fill,stroke){const t=shade(fill,.22),s=shade(fill,-.3),st=stroke||"#4a6794";
 return mk(parent,`<polygon points="${x},${y} ${x+d},${y-d*.55} ${x+w+d},${y-d*.55} ${x+w},${y}" fill="${t}" stroke="${st}" stroke-width="2"/><polygon points="${x+w},${y} ${x+w+d},${y-d*.55} ${x+w+d},${y+h-d*.55} ${x+w},${y+h}" fill="${s}" stroke="${st}" stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${st}" stroke-width="2.5"/>`)}
/* round gauge with needle (needle element id = id+"-n"); returns group */
function gauge(parent,id,cx,cy,r,col){col=col||"#35c4ff";let tk="";for(let i=0;i<=10;i++){const a=(-120+i*24)*Math.PI/180;const x1=cx+Math.sin(a)*r*.78,y1=cy-Math.cos(a)*r*.78,x2=cx+Math.sin(a)*r*.92,y2=cy-Math.cos(a)*r*.92;tk+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${i>8?"#ff3b3b":"#9fb4d6"}" stroke-width="${i%5?3:5}"/>`}
 return mk(parent,`<circle cx="${cx}" cy="${cy}" r="${r+10}" fill="#27354f" stroke="#6c7f9c" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#07101f" stroke="${col}" stroke-width="2" opacity="1"/>${tk}<path d="M${cx+Math.sin(96*Math.PI/180)*r*.62} ${cy-Math.cos(96*Math.PI/180)*r*.62} A${r*.62} ${r*.62} 0 0 1 ${cx+Math.sin(120*Math.PI/180)*r*.62} ${cy-Math.cos(120*Math.PI/180)*r*.62}" stroke="#ff3b3b" stroke-width="6" fill="none"/><g id="${id}-n"><line x1="${cx}" y1="${cy+r*.18}" x2="${cx}" y2="${cy-r*.74}" stroke="#ff8a1f" stroke-width="5" stroke-linecap="round"/></g><circle cx="${cx}" cy="${cy}" r="9" fill="#cfd8ea"/>`)}
