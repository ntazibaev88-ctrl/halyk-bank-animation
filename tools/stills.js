const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{
 const ts=process.argv.slice(3).map(Number), out=process.argv[2];
 const b=await chromium.launch({args:['--no-sandbox']}); const p=await b.newPage({viewport:{width:1080,height:1920}});
 p.on('pageerror',e=>console.error('ERR',e.message)); p.on('console',m=>{if(m.type()==='error')console.error(m.text())});
 await p.goto('file:///home/user/halyk-bank-animation/src/index.html?t=0'); await p.evaluate(()=>document.fonts.ready);
 for(const t of ts){ const d=await p.evaluate(i=>{window.renderFrame(i);return document.getElementById('cv').toDataURL('image/jpeg',.9).split(',')[1]},Math.round(t*30)); fs.writeFileSync(`${out}/t${String(t).padStart(5,'0')}.jpg`,Buffer.from(d,'base64')); }
 await b.close();
})();
