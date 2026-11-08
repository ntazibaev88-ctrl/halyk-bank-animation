// Write one HyperFrames composition per scene plate (3D background only).
// Each plate covers its scene plus 0.5 s handles for cross-dissolves.
import fs from 'node:fs';
const cues = JSON.parse(fs.readFileSync(new URL('../src/data/cues.json', import.meta.url)));
const B = cues.scenes; // [0,10,30,47,62,80,100,112,120]
const scale = parseFloat(process.env.PLATE_SCALE || '0.75');
const plates = [];
for (let i = 0; i < 8; i++) {
  const t0 = Math.max(0, B[i] - 0.5), t1 = Math.min(120, B[i + 1] + 0.5);
  const id = 's' + (i + 1);
  plates.push({ id, t0, t1, dur: +(t1 - t0).toFixed(3) });
  fs.mkdirSync(new URL('../plate-project/', import.meta.url), { recursive: true });
  fs.writeFileSync(new URL(`../plate-project/${id}.html`, import.meta.url), `<!doctype html>
<html lang="kk" data-resolution="portrait"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<script src="gsap.min.js"></script>
<style>
@font-face{font-family:Montserrat;src:url("Montserrat[wght].ttf") format("truetype");font-weight:100 900;}
html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}
#gl{position:absolute;left:0;top:0;width:1080px;height:1920px;display:block}
</style></head><body>
<div id="root" data-composition-id="${id}" data-start="0" data-duration="${(t1 - t0).toFixed(3)}" data-width="1080" data-height="1920">
  <canvas id="gl" class="clip" data-start="0" data-duration="${(t1 - t0).toFixed(3)}"></canvas>
</div>
<script>window.PLATE = { scene: "${id}", t0: ${t0}, scale: ${scale} };</script>
<script src="film3d.js"></script>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  tl.to({}, { duration: ${(t1 - t0).toFixed(3)} }, 0);
  window.__timelines["${id}"] = tl;
</script>
</body></html>
`);
}
fs.copyFileSync(new URL('../vendor/gsap.min.js', import.meta.url), new URL('../plate-project/gsap.min.js', import.meta.url));
fs.copyFileSync(new URL('../assets/fonts/Montserrat[wght].ttf', import.meta.url), new URL('../plate-project/Montserrat[wght].ttf', import.meta.url));
fs.writeFileSync(new URL('../src/data/plates.json', import.meta.url), JSON.stringify(plates, null, 1));
console.log(plates);
