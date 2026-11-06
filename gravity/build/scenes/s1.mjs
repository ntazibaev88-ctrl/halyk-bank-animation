import { sceneFile, character, lookVars, bedroom, pillow, blanket, phone, mug, grain, rng, f } from "../components.mjs";
// Scene 1 — 0:00–0:07.5 — wake up, feet leave the floor (absolute time = local time)
export default () => {
  const R = rng(11);
  let dust = "";
  for (let i = 0; i < 34; i++) dust += `<circle class="s1-dust" cx="${f(420 + R() * 560)}" cy="${f(1150 + R() * 700)}" r="${f(1.5 + R() * 3.5)}" fill="#ffd6a8" opacity="${f(0.25 + R() * 0.5)}"/>`;
  let fdust = "";
  for (let i = 0; i < 14; i++) fdust += `<circle class="s1-fdust" cx="${f(470 + R() * 200)}" cy="${f(1630 + R() * 20)}" r="${f(1.5 + R() * 2.5)}" fill="#cfd8ff" opacity="${f(0.3 + R() * 0.5)}"/>`;
  const body = `
<div id="s1-cam" style="position:absolute;inset:0;transform-origin:540px 960px">
<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  ${bedroom("s1")}
  ${mug("s1-mug", 860, 1026)}
  ${pillow("s1-pillow")}
  <g transform="translate(500 1207) scale(1.25)" id="s1-a" style="${lookVars("hero")};--rim:#ffb27a">${character("s1a")}</g>
  ${blanket("s1-blanket", "s1")}
  ${phone("s1-phone", 352, 1150)}
  <circle id="s1-phglow" cx="381" cy="1200" r="90" fill="#6fb6ff" opacity="0" style="mix-blend-mode:screen;filter:blur(18px)"/>
  <ellipse id="s1-shadow" cx="560" cy="1645" rx="95" ry="14" fill="#000" opacity="0" style="filter:blur(4px)"/>
  <g id="s1-slip" opacity="0"><path d="M640 1612 Q690 1600 712 1618 Q716 1634 690 1636 L646 1636 Q630 1630 640 1612 Z" fill="#c8513a"/><path d="M650 1614 Q680 1606 700 1618" stroke="#ffb08a" stroke-width="4" fill="none"/></g>
  <g transform="translate(560 1391) scale(1.25)" id="s1-b" style="${lookVars("hero")};--rim:#ffb27a;opacity:0">${character("s1b")}</g>
  ${fdust}${dust}
</svg>
</div>
<div class="vignette"></div>
${grain("s1-grain")}
<div id="s1-title">
  <div class="s1-kicker"><span>ГИПОТЕТИЧЕСКИЙ СЦЕНАРИЙ</span></div>
  <div class="s1-l" id="s1-l1"><span class="s1-w" id="s1-w0">ЧТО,</span> <span class="s1-w" id="s1-w1">ЕСЛИ</span> <span class="s1-w" id="s1-w2">ЗАВТРА</span></div>
  <div class="s1-l s1-big" id="s1-l2"><span class="s1-w" id="s1-w3">ИСЧЕЗНЕТ</span></div>
  <div class="s1-l s1-hero" id="s1-l3"><span class="s1-w" id="s1-w4">ГРАВИТАЦИЯ</span></div>
  <div class="s1-l s1-big" id="s1-l4"><span class="s1-w" id="s1-w5">ЗЕМЛИ?</span></div>
</div>`;
  const css = `
#s1-title{position:absolute;left:0;right:0;top:186px;text-align:center;color:#fff;text-shadow:0 6px 30px rgba(0,0,0,.7),0 2px 4px rgba(0,0,0,.6);}
.s1-kicker{font-weight:700;font-size:24px;letter-spacing:.32em;color:#7fd8ff;margin-bottom:22px;}
.s1-kicker span{display:inline-block;padding:8px 18px;border:1.5px solid rgba(127,216,255,.6);border-radius:30px;background:rgba(5,14,40,.5)}
.s1-l{font-weight:800;font-size:62px;line-height:1.08;letter-spacing:.02em;}
.s1-big{font-weight:900;font-size:92px;line-height:1.02;}
.s1-hero{font-weight:900;font-size:104px;line-height:1.05;letter-spacing:.01em;}
.s1-w{display:inline-block;opacity:.55;}
#s1-w4{opacity:1;color:#ff8a3d;text-shadow:0 0 40px rgba(255,120,40,.55),0 6px 24px rgba(0,0,0,.6);}
`;
  const js = `
const cam = $("#s1-cam");
Kit.rigInit("s1a"); Kit.rigInit("s1b");
gsap.set(["#s1a-root","#s1b-root"], { svgOrigin: "0 0" });
gsap.set("#s1a-root", { rotation: -90 });
Kit.poseSet("s1a", "lie"); Kit.poseSet("s1b", "stand");
gsap.set("#s1a-eyeO", { opacity: 0 }); gsap.set("#s1a-eyeC", { opacity: 1 });
Kit.grain(tl, "#s1-grain", 7.5);
// camera: slow push, then whip to the feet, then pull back wide with a dutch tilt
Kit.cam(tl, cam, { cx: 540, cy: 1010, s: 1.0 }, 0, 0);
Kit.cam(tl, cam, { cx: 430, cy: 1130, s: 1.22 }, 0, 3.6, "sine.inOut");
Kit.cam(tl, cam, { cx: 360, cy: 1170, s: 1.42 }, 3.6, 0.95, "power2.inOut");
Kit.cam(tl, cam, { cx: 360, cy: 1420, s: 1.42, blur: 16 }, 4.55, 0.13, "power3.in");
Kit.cam(tl, cam, { cx: 565, cy: 1330, s: 2.55, blur: 16 }, 4.68, 0);
Kit.cam(tl, cam, { cx: 565, cy: 1545, s: 2.55, blur: 0 }, 4.68, 0.24, "power3.out");
Kit.cam(tl, cam, { cx: 560, cy: 1520, s: 2.65 }, 4.92, 1.0, "sine.inOut");
tl.to(cam, { rotation: 0.8, duration: 0.07, yoyo: true, repeat: 5, ease: "sine.inOut" }, 5.42);
Kit.cam(tl, cam, { cx: 545, cy: 1180, s: 1.06, rot: -2.5 }, 5.95, 1.15, "power3.inOut");
Kit.cam(tl, cam, { cx: 545, cy: 1140, s: 1.0, rot: -3.2 }, 7.1, 0.4, "none");
// title: words brighten as they are spoken, then blur away
${[0.40, 0.66, 0.98, 1.38, 1.91, 2.57].map((t, i) => i === 4 ? `tl.fromTo("#s1-w4",{scale:1},{scale:1.06,duration:.18,ease:"power2.out",yoyo:true,repeat:1},${t});` : `tl.to("#s1-w${i}",{opacity:1,duration:.16,ease:"power2.out"},${t});`).join("\n")}
["#s1-l1","#s1-l2","#s1-l3","#s1-l4"].forEach((s,i)=>tl.to(s,{opacity:0,y:-40,filter:"blur(12px)",duration:.32,ease:"power2.in"},3.05+i*.05));
tl.to(".s1-kicker",{opacity:0,duration:.25},3.0);
// sleeping: slow breath in the chest
tl.to("#s1a-torso",{rotation:-1.5,duration:1.1,ease:"sine.inOut",yoyo:true,repeat:2},0.2);
// alarm
tl.to("#s1-phone-scr",{fill:"#5fa8ff",duration:.2},3.3);
tl.fromTo("#s1-phglow",{opacity:0},{opacity:.85,duration:.25,ease:"power2.out"},3.3);
tl.to("#s1-phone",{x:3,duration:.05,yoyo:true,repeat:7,ease:"none"},3.35);
// wake up
tl.set("#s1a-eyeC",{opacity:0},3.72); tl.set("#s1a-eyeO",{opacity:1},3.72);
tl.to("#s1a-brow",{y:-4,duration:.2},3.72);
tl.to("#s1a-torso",{rotation:84,duration:.6,ease:"power2.out"},3.9);
tl.to("#s1a-head",{rotation:-6,duration:.5},4.0);
Kit.pose(tl,"s1a",{uArmB:150,fArmB:20,uArmF:160,fArmF:15},4.18,.38,"power2.out");
tl.set("#s1a-mouthN",{opacity:0},4.2); tl.set("#s1a-mouthO",{opacity:1},4.2);
tl.to("#s1-blanket",{y:20,x:30,rotation:3,svgOrigin:"620 1250",duration:.6,ease:"power2.out"},3.95);
// whip cut: hide bed rig, standing rig appears
tl.set("#s1-a",{opacity:0},4.68); tl.set("#s1-shadow",{opacity:.55},4.68); tl.set("#s1-b",{opacity:1},4.68); tl.set("#s1-slip",{opacity:1},4.68);
// feet leave the floor (word "отрываются" at 5.42)
tl.to("#s1b-root",{y:-22,duration:.6,ease:"power1.in"},5.42);
tl.to("#s1b-root",{y:-118,rotation:7,duration:1.48,ease:"none"},6.02);
tl.to("#s1-shadow",{opacity:.18,scaleX:.7,svgOrigin:"560 1645",duration:2,ease:"power1.out"},5.42);
Kit.pose(tl,"s1b",{footB:18,footF:22,shinB:6,shinF:8},5.4,.5,"power2.out");
Kit.pose(tl,"s1b","surprise",5.9,.8,"power2.out");
tl.to("#s1b-brow",{y:-6,duration:.2},5.6); tl.set("#s1b-mouthN",{opacity:0},5.7); tl.set("#s1b-mouthO",{opacity:1},5.7);
tl.to(".s1-fdust",{y:(i)=>-20-(i%5)*9,x:(i)=>(i%3-1)*6,duration:2,ease:"power1.in",stagger:.03},5.42);
tl.to("#s1-slip",{y:-34,rotation:-24,svgOrigin:"676 1624",duration:2,ease:"power1.in"},5.55);
// the room lets go
${[0,1,2,3,4,5,6,7].map(i=>`tl.to("#s1-book${i}",{y:${-30-((i*37)%60)},x:${((i*13)%21)-10},rotation:${((i*53)%70)-35},svgOrigin:"${230+i*28} 860",duration:2.2,ease:"power1.in"},${(5.5+i*0.05).toFixed(2)});`).join("\n")}
tl.to("#s1-pillow",{y:-46,rotation:-9,svgOrigin:"250 1210",duration:2,ease:"power1.in"},5.6);
tl.to("#s1-blanket",{y:-24,rotation:-4,duration:2,ease:"power1.in"},5.7);
tl.to("#s1-phone",{y:-110,x:30,rotation:58,svgOrigin:"381 1202",duration:2,ease:"power1.in"},5.55);
tl.to("#s1-phglow",{y:-110,x:30,duration:2,ease:"power1.in"},5.55);
tl.to("#s1-mug",{y:-40,rotation:-18,svgOrigin:"887 1060",duration:2,ease:"power1.in"},5.65);
tl.to("#s1-plant",{y:-16,rotation:4,svgOrigin:"1020 1392",duration:2,ease:"power1.in"},5.7);
tl.to(".s1-dust",{y:(i)=>-40-(i%7)*12,duration:7.5,ease:"none"},0);
`;
  return { id: "s1", dur: 7.5, file: sceneFile({ id: "s1", dur: 7.5, css, body, js }) };
};
