import { sceneFile } from "../components.mjs";
// Film grain over the whole film: a seeded noise tile, repeated and stepped each frame.
export default () => ({ id: "grade", dur: 90, file: sceneFile({ id: "grade", dur: 90,
  css: `#root{pointer-events:none} #gr-grain{position:absolute;left:-256px;top:-256px;width:1592px;height:2432px;opacity:.09;mix-blend-mode:overlay;background-repeat:repeat;}`,
  body: `<div id="gr-grain"></div>`,
  js: `
const c=document.createElement("canvas"); c.width=c.height=256; const x=c.getContext("2d"), im=x.createImageData(256,256), r=Kit.rng(4242);
for(let i=0;i<im.data.length;i+=4){const v=Math.floor(r()*255); im.data[i]=im.data[i+1]=im.data[i+2]=v; im.data[i+3]=255;}
x.putImageData(im,0,0); $("#gr-grain").style.backgroundImage="url("+c.toDataURL()+")";
tl.fromTo("#gr-grain",{x:0,y:0},{x:173,y:211,duration:.5,ease:"steps(15)",repeat:179},0);` }) });
