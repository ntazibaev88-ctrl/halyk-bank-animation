// Boots the film: builds the engine, shared assets and shots, and exposes window.renderAt(t).
import { Engine, THREE, loadHDR } from "./engine.js";
import * as A from "./assets.js";
import { buildShots } from "./shots.js";

const Q = new URLSearchParams(location.search);
const SCALE = +(Q.get("scale") || 0.8);
const W = Math.round(1080 * SCALE), H = Math.round(1920 * SCALE);
const canvas = document.getElementById("c");
const E = new Engine(canvas, W, H);
const status = (s) => (window.__status = s);

async function boot() {
  status("fonts"); await document.fonts.load('900 64px "KZ Sans"'); await document.fonts.load('700 30px "KZ Sans"');
  status("env");
  const env = {
    sunrise: await loadHDR(E.r, "assets/spruit_sunrise_1k.hdr"),
    sunset: await loadHDR(E.r, "assets/venice_sunset_1k.hdr"),
    night: await loadHDR(E.r, "assets/moonless_golf_1k.hdr"),
    day: await loadHDR(E.r, "assets/quarry_01_1k.hdr"),
    studio: await loadHDR(E.r, "assets/blouberg_sunrise_2_1k.hdr"),
  };
  A.initMaterials(env.sunset);
  status("terrain");
  const terrain = await A.alatauTerrain("assets/alatau_512x384.f32", { width: 60000, depth: 45000 });
  const tl = new THREE.TextureLoader();
  const load = (u, srgb = true) => tl.loadAsync(u).then((t) => { if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; });
  const tex = { earthDay: await load("assets/earth_atmos_2048.jpg"), earthNight: await load("assets/earth_lights_2048.png"), earthClouds: await load("assets/earth_clouds_1024.png", false) };
  const waterNormals = await load("assets/waternormals.jpg", false);
  const shots = buildShots({ env, terrain, tex, waterNormals, R: E.r });
  shots.sort((a, b) => a.start - b.start);
  const live = new Map(); // lazily built shot instances
  const dispose = (inst) => inst.scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  const get = (i) => {
    if (!live.has(i)) {
      status("build " + i);
      live.set(i, shots[i].build());
      // keep at most 3 shots alive
      for (const k of [...live.keys()]) if (live.size > 3 && Math.abs(k - i) > 1) { dispose(live.get(k)); live.delete(k); }
    }
    return live.get(i);
  };
  window.__T = THREE; window.SHOTS = shots.map((s, i) => ({ i, start: s.start, end: s.end }));
  window.renderAt = (t) => {
    let i = 0; for (let k = 0; k < shots.length; k++) if (shots[k].start <= t) i = k;
    const cur = get(i); const lt = t - shots[i].start;
    cur.update(lt, t);
    let mix = null;
    const sh = shots[i];
    if (i > 0 && sh.xfade > 0 && t < sh.start + sh.xfade && shots[i - 1].end > t) {
      const prev = get(i - 1); prev.update(t - shots[i - 1].start, t);
      mix = { shot: prev, k: 1 - (t - sh.start) / sh.xfade };
      cur.update(lt, t); // restore shared material state for the current shot
    }
    window.__cur = cur; E.draw(cur, Math.round(t * 30), mix);
    return i;
  };
  window.grab = (t, q = 0.94) => { window.renderAt(t); return canvas.toDataURL("image/jpeg", q); };
  status("ready"); window.ready = true;
}
boot().catch((e) => { status("error " + e.message + "\n" + e.stack); console.error(e); });
