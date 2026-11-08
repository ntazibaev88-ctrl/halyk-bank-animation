// Plate entry point: builds the world once, then renders the frame for each
// HyperFrames seek (hf-seek event). window.PLATE = { scene, t0, scale }.
import * as THREE from 'three';
import { Engine } from './engine.js';
import { shared } from './materials.js';
import { City } from './world/city.js';
import { River } from './world/river.js';
import { Landmarks } from './world/landmarks.js';
import { Fortress } from './world/fortress.js';
import { Crowd, Flag, Transit } from './world/life.js';
import { Boulevard, MapLayer, DataArcs, Grass } from './world/extras.js';
import { Guide } from './world/guide.js';
import { evalFrame, yearFor, CROWDS } from './scenes.js';

const PLATE = Object.assign({ scene: null, t0: 0, scale: 0.75 }, window.PLATE || {});
const W = Math.round(1080 * PLATE.scale / 2) * 2, H = Math.round(1920 * PLATE.scale / 2) * 2;
let engine, world;

async function init() {
  try { await Promise.all(['600 74px Montserrat', '500 44px Montserrat'].map((f) => document.fonts.load(f))); } catch (e) {}
  const canvas = document.getElementById('gl');
  engine = new Engine(canvas, W, H);
  const city = engine.add(new City());
  world = {
    city,
    river: engine.add(new River()),
    landmarks: engine.add(new Landmarks()),
    fortress: engine.add(new Fortress()),
    boulevard: engine.add(new Boulevard()),
    map: engine.add(new MapLayer(city.buildings)),
    arcs: engine.add(new DataArcs(city.buildings)),
    flag: engine.add(new Flag(-2331, 1236.5, 6.0, 2.8)),
    guide: engine.add(new Guide()),
    grass: engine.add(new Grass(-7470, -7020, 640, 760, 70000)),
    transit: engine.add(new Transit()),
    crowds: Object.fromEntries(Object.entries(CROWDS).map(([k, spot], i) => [k, engine.add(new Crowd([spot], 11 + i))])),
  };
  // warm plaza light for night crowd shots (always present so shaders never recompile)
  world.plazaLight = new THREE.PointLight(0xffc58a, 0, 160, 1.6);
  engine.scene.add(world.plazaLight);
  const origRender = engine.renderShot.bind(engine);
  engine.renderShot = (shot, target) => { applyState(shot, engine.__t); return origRender(shot, target); };
  window.__plateReady = true;
  window.__engine = engine;
}

function applyState(shot, t) {
  const st = shot.state || {};
  const year = yearFor(t, PLATE.scene);
  const night = shot.look.night || 0;
  const s = { ...st, t, year, night };
  shared.uTime.value = t;
  shared.uNight.value = night;
  shared.uMap.value = st.map || 0;
  world.city.update(s);
  world.river.update(s);
  world.landmarks.update(s);
  world.fortress.update(s);
  world.boulevard.update(s);
  world.map.update(s);
  world.arcs.update(s);
  world.flag.update(s); world.flag.object.position.y = 45.2; world.flag.object.rotation.y = Math.PI / 2;
  world.guide.update(s, { position: shot.pos });
  world.grass.update(s);
  world.transit.update(s);
  if (st.crowd === 'khan') { world.plazaLight.position.set(-1800 + 300, 9, 1200 + 4); world.plazaLight.intensity = 35; } else world.plazaLight.intensity = 0;
  for (const [k, c] of Object.entries(world.crowds)) { if (st.crowd === k) c.update(s); c.object.visible = st.crowd === k && year > 2000; }
}

function renderAt(local) {
  const t = PLATE.t0 + local;
  if (PLATE.auto) { const B = [0, 12, 30, 45, 60, 77, 92, 107, 999]; PLATE.scene = 's' + B.findIndex((b, i) => t >= b && t < B[i + 1]) + ''; PLATE.scene = 's' + (B.findIndex((b, i) => t >= b && t < B[i + 1]) + 1); }
  engine.__t = t;
  const frame = evalFrame(t, PLATE.scene);
  if (window.__debugCam) { const d = window.__debugCam; frame.shots = [frame.shots[frame.shots.length - 1]]; frame.mix = 0; Object.assign(frame.shots[0], { pos: new THREE.Vector3(...d.pos), target: new THREE.Vector3(...d.target), fov: d.fov || 30 }); frame.grade = frame.shots[0].grade; }
  engine.render(frame);
}

const ready = init();
window.__renderAt = (t) => ready.then(() => renderAt(t));
window.__debugLum = () => { const r = engine.renderer, rt = engine.rtA; const buf = new Uint16Array(4 * 64); r.readRenderTargetPixels(rt, rt.width/2|0, rt.height/2|0, 8, 8, buf); return buf; };
window.addEventListener('hf-seek', (e) => {
  const time = e.detail.time;
  if (!window.__plateReady) e.detail.waitUntil(ready.then(() => renderAt(time)));
  else renderAt(time);
});
