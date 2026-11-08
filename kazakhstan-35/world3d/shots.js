// The shot list. Each shot: [start, end] in film seconds, build() -> { scene, camera, update(lt, t), look }.
import { THREE, rng, clamp, lerp, smooth, seg, ease, makeSky, ClothFlag, makeWater, goldGlyphs, pointsCloud, softDot, canvasTex, noiseTex, noise1 } from "./engine.js";
import * as A from "./assets.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GLYPHS } from "./assets/glyphs.js";

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
let ENV = null;
const sunVec = (elevDeg, azDeg) => { const e = THREE.MathUtils.degToRad(elevDeg), a = THREE.MathUtils.degToRad(azDeg); return V3(Math.sin(a) * Math.cos(e), Math.sin(e), -Math.cos(a) * Math.cos(e)).normalize(); };
const cam = (fov = 42, near = 0.5, far = 60000) => new THREE.PerspectiveCamera(fov, 1080 / 1920, near, far);
const path = (c, t, pts, look) => { // piecewise smooth camera path: pts = [[time, pos, target], ...]
  let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
  const [t0, p0, l0] = pts[i], [t1, p1, l1] = pts[Math.min(i + 1, pts.length - 1)];
  const k = t1 > t0 ? ease.inOut(clamp((t - t0) / (t1 - t0), 0, 1)) : 0;
  c.position.lerpVectors(p0, p1, k); c.lookAt(new THREE.Vector3().lerpVectors(l0, l1, k));
};

/* ---------- scene helpers ---------- */
function world({ envm = null, sun, sunColor = 0xffd6a0, sunI = 3, hemiSky = 0xb0c4de, hemiGround = 0x3a3020, hemiI = 0.8, fog = 0xc8b49a, fogD = 0.00012, sky = {}, shadow = 400, shadowCenter = V3(0, 0, 0) }) {
  const scene = new THREE.Scene();
  scene.fog = fogD > 0 ? new THREE.FogExp2(fog, fogD) : null;
  scene.environment = (envm || ENV.sunset).env;
  const s = makeSky(); scene.add(s);
  const u = s.material.uniforms; u.sunDir.value.copy(sun);
  for (const k in sky) { if (u[k].value?.isColor) u[k].value.set(sky[k]); else if (u[k].value?.isVector2) u[k].value.set(...sky[k]); else u[k].value = sky[k]; }
  u.halo.value *= 0.55; u.sunInt.value *= 0.6;
  const hemi = new THREE.HemisphereLight(hemiSky, hemiGround, hemiI); scene.add(hemi);
  const dl = new THREE.DirectionalLight(sunColor, sunI); dl.position.copy(shadowCenter).addScaledVector(sun, 1500); dl.target.position.copy(shadowCenter); scene.add(dl, dl.target);
  if (shadow) { dl.castShadow = true; dl.shadow.mapSize.set(1024, 1024); Object.assign(dl.shadow.camera, { left: -shadow, right: shadow, top: shadow, bottom: -shadow, near: 10, far: 4000 }); dl.shadow.bias = -0.0008; dl.shadow.normalBias = 0.5; }
  return { scene, sky: s, sun: dl, hemi };
}
const flagTexture = () => { const c = window.KZ.flagCanvas(2048); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const flagMat = (tex) => new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.22, side: THREE.DoubleSide, roughness: 0.72, metalness: 0 });
function bannerFlags(n, seed, radius, center, h = 12) { // simple waving national-style banners (shader), not real flags
  const r = rng(seed), g = new THREE.Group(), cols = [0xc8102e, 0x1f4e9a, 0xf2b705, 0x2e8b57, 0xeef1f4, 0x8c1d40, 0x0f7aaf, 0xd35400, 0x00afca, 0x6a1b9a];
  const uni = { uTime: { value: 0 } };
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, x = center.x + Math.cos(a) * radius, z = center.z + Math.sin(a) * radius;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, h, 6), A.M.steel); pole.position.set(x, h / 2, z); g.add(pole);
    const c1 = cols[Math.floor(r() * cols.length)], c2 = cols[Math.floor(r() * cols.length)], c3 = cols[Math.floor(r() * cols.length)];
    const tex = canvasTex(64, 32, (c, w, hh) => { c.fillStyle = "#" + c1.toString(16).padStart(6, "0"); c.fillRect(0, 0, w, hh); c.fillStyle = "rgba(255,255,255,.85)"; c.beginPath(); c.arc(w / 2, hh / 2, hh * 0.22, 0, 6.3); c.fill(); });
    const mat = new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide });
    const ph = r() * 6;
    mat.onBeforeCompile = (sh) => { sh.uniforms.uTime = uni.uTime; sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      float k = (position.x + 1.5) / 3.0; transformed.z += sin(position.x * 2.2 - uTime * 6.0 + ${ph.toFixed(2)}) * 0.28 * k; transformed.y -= k * k * 0.25;`); };
    const f = new THREE.Mesh(new THREE.PlaneGeometry(3, 2, 12, 4), mat); f.position.set(x + 1.5 * Math.cos(a + 1.57), h - 1.2, z + 1.5 * Math.sin(a + 1.57)); f.rotation.y = -(a + 1.57); g.add(f);
  }
  g.userData.uni = uni; return g;
}
function snowfall(n, seed, box) {
  return pointsCloud(n, seed, (t, s) => { const y = box.y1 - ((s[1] * (box.y1 - box.y0) + t * (1.2 + s[3])) % (box.y1 - box.y0)); return [box.x0 + s[0] * (box.x1 - box.x0) + Math.sin(t * 0.8 + s[3] * 9) * 1.5, y, box.z0 + s[2] * (box.z1 - box.z0)]; }, { size: 0.35, color: 0xffffff, map: softDot(), additive: false, opacity: 0.9 });
}
function emblem3D() { // stylised State Emblem in gold and blue enamel
  const g = new THREE.Group(), gold = A.M.gold;
  const enamel = new THREE.MeshStandardMaterial({ color: 0x0aa3c2, metalness: 0.2, roughness: 0.35, envMap: gold.envMap, envMapIntensity: 0.8 });
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.6, 96), enamel); disk.rotation.x = Math.PI / 2; g.add(disk);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(9.4, 0.7, 16, 128), gold); g.add(rim);
  for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2; const ray = new THREE.Mesh(new THREE.BoxGeometry(0.28, 5.0, 0.35), gold); ray.position.set(Math.cos(a) * 5.6, Math.sin(a) * 5.6, 0.35); ray.rotation.z = a - Math.PI / 2; g.add(ray); }
  const shan = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.42, 16, 64), gold); shan.position.z = 0.5; g.add(shan);
  for (const v of [-1, 0, 1]) { const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.6, 0.3), gold); b1.position.set(v * 1.05, 0, 0.55); g.add(b1); const b2 = b1.clone(); b2.rotation.z = Math.PI / 2; b2.position.set(0, v * 1.05, 0.55); g.add(b2); }
  for (const s of [-1, 1]) { // wings of the tulpars
    for (let j = 0; j < 6; j++) { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 3.2 - j * 0.25, 4, 8), gold); const a = 0.35 + j * 0.24; f.position.set(s * (6.3 + j * 0.15) * Math.cos(a - 0.9), -1.5 + j * 1.35, 0.6); f.rotation.z = s * (0.5 + j * 0.15); g.add(f); }
  }
  const st = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 0.75 : 1.7; const x = Math.cos(a) * rr, y = -Math.sin(a) * rr; i ? st.lineTo(x, y) : st.moveTo(x, y); }
  const star = new THREE.Mesh(new THREE.ExtrudeGeometry(st, { depth: 0.4, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1, bevelSegments: 2 }), gold); star.position.set(0, 9.9, 0.2); g.add(star);
  return g;
}
function noteTexture(seed, base, accent) {
  return canvasTex(512, 256, (c, w, h) => {
    const r = rng(seed); const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, base); gr.addColorStop(1, accent); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 1; for (let i = 0; i < 60; i++) { c.beginPath(); c.arc(380, 128, 20 + i * 4, 0, Math.PI * 2); c.stroke(); }
    c.strokeStyle = "rgba(255,245,210,.7)"; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20);
    c.fillStyle = "rgba(255,255,255,.9)"; c.font = "900 120px 'KZ Sans', sans-serif"; c.fillText("₸", 340, 170);
    c.font = "700 30px 'KZ Sans', sans-serif"; c.fillText("ТЕҢГЕ", 40, 70);
    c.fillStyle = "rgba(255,255,255,.25)"; for (let i = 0; i < 5; i++) c.fillRect(40, 120 + i * 18, 180 - i * 22, 8);
  });
}
function kzShape(scale) {
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${window.KZMAP.kz}"/></svg>`);
  const shapes = []; data.paths.forEach((p) => SVGLoader.createShapes(p).forEach((s) => shapes.push(s)));
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: 14, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 2, curveSegments: 2 });
  geo.translate(-470, -310, 0); geo.scale(scale, -scale, scale); geo.rotateX(-Math.PI / 2); geo.computeVertexNormals();
  return geo;
}
const mapXZ = (k, scale) => { const p = window.KZMAP.cities[k]; return V3((p[0] - 470) * scale, 0, (p[1] - 310) * scale); };

function facadeLike() { return canvasTex(256, 512, (g, w, h) => { g.fillStyle = "#2f5e66"; g.fillRect(0, 0, w, h); const r = rng(12); for (let j = 0; j < 40; j++) for (let i = 0; i < 16; i++) { const v = 70 + r() * 40; g.fillStyle = `rgb(${v * 0.55},${v * 0.95},${v})`; g.fillRect(i * 16 + 1, j * 12.8 + 1, 14, 10.8); } g.fillStyle = "rgba(220,230,225,.6)"; for (let j = 0; j < 40; j += 10) g.fillRect(0, j * 12.8, w, 3); }); }
/* =============================================================== SHOTS */
export function buildShots(ctx) {
  const { env, terrain, R } = ctx, S = []; ENV = env;
  const add = (start, end, build, xfade = 0) => S.push({ start, end, xfade, build });

  /* ---- 1991 · dawn over the steppe and the Alatau ---- */
  const dawnSun = sunVec(3.5, 95);
  const dawnLook = { exposure: 1.1, temp: 0.5, tint: 0.08, sat: 0.82, contrast: 1.1, lift: [0.025, 0.018, 0.015], gain: [1.02, 0.98, 0.92], shadowTint: [0.02, 0.0, 0.03], highTint: [0.05, 0.02, 0.0], vignette: 0.5, grain: 0.06, halation: 0.35, bloom: 0.45, bloomThr: 1.0, rays: 0.30, raysThr: 0.9, raysTint: [1, 0.75, 0.5], flare: 0.30 };
  function dawnWorld() {
    const w = world({ envm: ENV.sunrise, sun: dawnSun, sunColor: 0xffb070, sunI: 3.0, hemiSky: 0x7f93bb, hemiGround: 0x3a2a1a, hemiI: 0.55, fog: 0xc89a7a, fogD: 0.00003, shadow: 0,
      sky: { zenith: 0x1a3570, horizon: 0xf0a878, ground: 0x4a3a30, sunColor: 0xffb070, sunInt: 18, halo: 1.6, cloudCover: 0.42, cloudLit: 0xffb487, cloudDark: 0x4a4a6a, cloudScale: 1.2, haze: 0.12 } });
    const ter = terrain.clone(); w.scene.add(ter);
    const mist = new THREE.Mesh(new THREE.PlaneGeometry(60000, 40000), new THREE.MeshBasicMaterial({ map: noiseTex(5, 256, [255, 220, 200], 120, [6, 4]), transparent: true, opacity: 0.1, depthWrite: false, fog: false, color: 0xffe0c8 }));
    mist.rotation.x = -Math.PI / 2; mist.position.y = 60; w.scene.add(mist);
    return { ...w, ter, mist };
  }
  add(0, 5.35, () => {
    const w = dawnWorld(), c = cam(48, 5, 80000);
    return { scene: w.scene, camera: c, look: { ...dawnLook, focus: 9000, focusRange: 20000, dof: 0.3 },
      update(lt) {
        const gy = (x, z) => terrain.userData.heightAt(x, z);
        path(c, lt, [[0, V3(-4200, gy(-4200, -9000) + 520, -9000), V3(2500, 2600, 9000)], [5.35, V3(-3600, gy(-3600, -6400) + 430, -6400), V3(2600, 2800, 9000)]]);
        w.sky.material.uniforms.cloudOff.value.set(lt * 0.02, lt * 0.01); w.mist.position.x = lt * 30;
        this.sunWorld = c.position.clone().addScaledVector(dawnSun, 20000);
      } };
  });
  add(5.2, 10.6, () => {
    const w = dawnWorld(), c = cam(40, 0.3, 80000);
    const base = V3(-1500, 0, -12000); base.y = terrain.userData.heightAt(base.x, base.z);
    const pole = A.flagPole(16); pole.position.copy(base); w.scene.add(pole);
    const flag = new ClothFlag({ width: 6, height: 3, nx: 34, ny: 17, texture: flagTexture(), material: flagMat(flagTexture()), windDir: V3(1, 0, -0.35), wind: 9, seed: 1991 });
    w.scene.add(flag.mesh);
    const anchor = (t) => V3(base.x + 0.25, base.y + lerp(5.0, 15.6, seg(t, 5.35, 8.4)), base.z);
    const hill = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ map: noiseTex(17, 128, [120, 100, 70], 25, [6, 6]) })); hill.scale.y = 0.12; hill.position.copy(base).add(V3(0, -1.5, 0)); w.scene.add(hill);
    w.sun.position.copy(base).addScaledVector(dawnSun, 300); w.sun.target.position.copy(base); w.sun.castShadow = false;
    return { scene: w.scene, camera: c, look: { ...dawnLook, focus: 15, focusRange: 10, dof: 1, rays: 0.44, flare: 0.40 },
      update(lt, t) {
        flag.at(t, 5.2, anchor);
        const p = base.clone();
        path(c, lt, [[0, p.clone().add(V3(-4, 2.0, 15)), p.clone().add(V3(2, 7.5, 0))], [3.2, p.clone().add(V3(-6, 2.6, 13.5)), p.clone().add(V3(2.5, 13.5, 0))], [5.4, p.clone().add(V3(-7.5, 3.0, 12.5)), p.clone().add(V3(3, 14.2, 0))]]);
        w.sky.material.uniforms.cloudOff.value.set(t * 0.02, t * 0.01);
        this.sunWorld = c.position.clone().addScaledVector(dawnSun, 20000);
      } };
  }, 0.5);

  /* ---- 1992 · Almaty winter dusk, panel blocks, snow ---- */
  const archLook = { exposure: 1.1, temp: 0.25, sat: 0.72, contrast: 1.02, lift: [0.04, 0.035, 0.035], gain: [1.0, 0.97, 0.93], vignette: 0.5, grain: 0.075, halation: 0.5, bloom: 0.5, bloomThr: 0.8 };
  add(10.0, 12.95, () => {
    const s = sunVec(-2, 250);
    const w = world({ sun: sunVec(8, 250), sunColor: 0x8899cc, sunI: 0.5, hemiSky: 0x5b6f99, hemiGround: 0x2a2a35, hemiI: 1.0, fog: 0x56627e, fogD: 0.00012, shadow: 0,
      sky: { zenith: 0x111c38, horizon: 0x7a6f8e, ground: 0x2a2a35, sunColor: 0xff9a6a, sunInt: 0, halo: 0.4, cloudCover: 0.75, cloudLit: 0x8a7f9e, cloudDark: 0x2c3048, haze: 0.4 } });
    const ter = terrain.clone(); ter.position.set(0, -60, -27000); w.scene.add(ter);
    const snowG = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshLambertMaterial({ map: noiseTex(23, 256, [215, 220, 232], 12, [40, 40]) })); snowG.rotation.x = -Math.PI / 2; snowG.position.set(0, 0, -15000); w.scene.add(snowG);
    const center = V3(0, 0, -15000);
    for (let i = 0; i < 14; i++) { const b = A.panelBlock(100 + i, true); b.position.set(center.x - 300 + (i % 7) * 95, 0, center.z - 120 + Math.floor(i / 7) * 110); if (i % 3 === 0) b.scale.y = 1.6; w.scene.add(b); }
    for (let i = 0; i < 40; i++) { const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 3.2, 1.6) })); lamp.position.set(center.x - 320 + i * 17, 6, center.z - 40); w.scene.add(lamp); }
    const snow = snowfall(2500, 92, { x0: center.x - 120, x1: center.x + 120, y0: 0, y1: 60, z0: center.z - 140, z1: center.z + 10 }); w.scene.add(snow);
    const c = cam(42, 0.5, 80000);
    return { scene: w.scene, camera: c, look: { ...archLook, focus: 120, focusRange: 120, dof: 0.6 },
      update(lt, t) { path(c, lt, [[0, V3(center.x - 20, 4, center.z + 150), V3(center.x - 120, 40, center.z - 3000)], [3, V3(center.x + 10, 5, center.z + 130), V3(center.x - 100, 44, center.z - 3000)]]); snow.update(t); } };
  }, 0.45);

  /* ---- 1992 · UN headquarters, New York ---- */
  add(12.9, 16.65, () => {
    const sun = sunVec(10, 250);
    const w = world({ envm: ENV.sunset, sun, sunColor: 0xffc68a, sunI: 2.8, hemiSky: 0x9fb4d6, hemiGround: 0x3a3530, hemiI: 0.6, fog: 0xc0b0a0, fogD: 0.00012, shadow: 220,
      sky: { zenith: 0x2a4f8a, horizon: 0xf0c08a, sunColor: 0xffc68a, sunInt: 10, halo: 1.0, cloudCover: 0.35, haze: 0.08 } });
    const unTex = facadeLike(); const sec = A.tower(88, 22, 154, new THREE.MeshPhongMaterial({ map: unTex, specular: 0x557766, shininess: 80, envMap: env.sunset.cube, reflectivity: 0.18, combine: THREE.MixOperation }), null); sec.position.set(0, 0, -60); w.scene.add(sec);
    for (const x of [-44, 44]) { const side = new THREE.Mesh(new THREE.BoxGeometry(2, 154, 22.2), A.M.granite); side.position.set(x, 77, -60); w.scene.add(side); }
    const ga = new THREE.Mesh(new THREE.CylinderGeometry(60, 70, 22, 32, 1, false, 0, Math.PI), A.M.granite); ga.rotation.y = Math.PI / 2; ga.position.set(-140, 11, -20); w.scene.add(ga);
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshLambertMaterial({ map: noiseTex(41, 256, [170, 166, 158], 10, [40, 40]) })); plaza.rotation.x = -Math.PI / 2; plaza.receiveShadow = true; w.scene.add(plaza);
    const water = makeWater([3000, 2000], { normals: ctx.waterNormals, color: new THREE.Color(0.02, 0.05, 0.08), sunDir: sun, sunColor: new THREE.Color(1, 0.75, 0.5), skyColor: new THREE.Color(0.6, 0.55, 0.5) }); water.position.set(0, -0.5, 1200); w.scene.add(water);
    // row of flags on the plaza (generic member-state banners) with Kazakhstan's flag being raised
    const banners = new THREE.Group(), uni = { uTime: { value: 0 } }; const r = rng(7);
    const cols = [0x2b5aa8, 0x7d8fa6, 0xb8a27a, 0x4f7a6a, 0xe6e1d6, 0x8a5a6a, 0x5b7fb0, 0xa47d4a];
    for (let i = 0; i < 18; i++) {
      const x = -150 + i * 17; if (i === 9) continue;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 14, 6), A.M.steel); pole.position.set(x, 7, 30); banners.add(pole);
      const a = cols[Math.floor(r() * 8)], b = cols[Math.floor(r() * 8)], cc = cols[Math.floor(r() * 8)];
      const tex = canvasTex(64, 32, (g, ww, hh) => { g.fillStyle = "#" + a.toString(16).padStart(6, "0"); g.fillRect(0, 0, ww, hh); });
      const mat = new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide }); const ph = r() * 6;
      mat.onBeforeCompile = (sh) => { sh.uniforms.uTime = uni.uTime; sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
        float k = (position.x + 1.5) / 3.0; transformed.z += sin(position.x * 2.4 - uTime * 6.5 + ${ph.toFixed(2)}) * 0.3 * k;`); };
      const f = new THREE.Mesh(new THREE.PlaneGeometry(3, 2, 12, 3), mat); f.position.set(x + 1.6, 12.6, 30); banners.add(f);
    }
    w.scene.add(banners);
    const kzPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 14, 6), A.M.steel); kzPole.position.set(3, 7, 30); w.scene.add(kzPole);
    const flag = new ClothFlag({ width: 3.2, height: 1.6, nx: 28, ny: 14, texture: flagTexture(), material: flagMat(flagTexture()), windDir: V3(1, 0, 0.1), wind: 6.5, seed: 1992 }); w.scene.add(flag.mesh);
    const anchor = (t) => V3(3.12, lerp(5.5, 13.4, seg(t, 13.6, 15.4)), 30);
    const c = cam(38, 0.5, 30000);
    return { scene: w.scene, camera: c, look: { ...archLook, temp: 0.3, sat: 0.85, focus: 170, focusRange: 120, dof: 0.5, rays: 0.14, flare: 0.15 },
      update(lt, t) {
        uni.uTime.value = t; flag.at(t, 12.9, anchor);
        path(c, lt, [[0, V3(-150, 2.4, 95), V3(10, 62, -60)], [3.7, V3(-122, 3.2, 84), V3(14, 60, -60)]]);
        water.material.uniforms.time.value = t; this.sunWorld = c.position.clone().addScaledVector(sun, 20000);
      } };
  }, 0.4);

  /* ---- 1992 · state symbols: flag fabric macro, then the gold emblem ---- */
  add(16.6, 18.15, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x05070c);
    scene.add(new THREE.HemisphereLight(0x8899bb, 0x221a10, 0.6));
    const key = new THREE.DirectionalLight(0xffe2b0, 3.2); key.position.set(-4, 6, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0x88bbff, 1.4); rim.position.set(6, -2, -6); scene.add(rim);
    const flag = new ClothFlag({ width: 6, height: 3, nx: 40, ny: 20, texture: flagTexture(), material: flagMat(flagTexture()), windDir: V3(1, 0, 0.2), wind: 8, seed: 4 }); scene.add(flag.mesh); scene.environment = env.studio.env;
    const anchor = () => V3(-3, 1.5, 0);
    const c = cam(30, 0.1, 100);
    return { scene, camera: c, look: { ...archLook, sat: 0.95, temp: 0.15, focus: 4.2, focusRange: 1.6, dof: 1, bloom: 0.3, grain: 0.06 },
      update(lt, t) { flag.at(t, 16.6, anchor); flag.geo.computeBoundingBox(); const bb = flag.geo.boundingBox, cx = (bb.min.x + bb.max.x) / 2 + 0.6, cy = (bb.min.y + bb.max.y) / 2 + 0.2; path(c, lt, [[0, V3(cx - 0.6, cy - 0.1, 5.4), V3(cx, cy, 0)], [1.6, V3(cx + 0.2, cy - 0.2, 4.6), V3(cx, cy, 0)]]); } };
  }, 0.35);
  add(18.1, 19.55, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x04060b); scene.environment = env.studio.env; A.setEnv(env.studio);
    const e = emblem3D(); scene.add(e);
    const key = new THREE.SpotLight(0xffe6c0, 600, 80, 0.5, 0.6); key.position.set(-12, 14, 22); scene.add(key);
    scene.add(new THREE.AmbientLight(0x223344, 0.6));
    const c = cam(30, 0.5, 200);
    return { scene, camera: c, look: { ...archLook, sat: 1.0, temp: 0.1, focus: 30, focusRange: 10, dof: 0.6, bloom: 0.55, bloomThr: 1.0, grain: 0.05 },
      update(lt) { A.setEnv(env.studio); e.rotation.y = lerp(-0.5, 0.15, ease.out(clamp(lt / 1.45, 0, 1))); path(c, lt, [[0, V3(0, 0.5, 48), V3(0, 0.8, 0)], [1.45, V3(0, 0.5, 43), V3(0, 1.0, 0)]]); } };
  }, 0.25);

  /* ---- 1993 · the tenge ---- */
  add(19.5, 23.45, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070a); scene.environment = env.studio.env;
    scene.add(new THREE.AmbientLight(0x30303a, 0.5));
    const key = new THREE.SpotLight(0xffe0b0, 900, 60, 0.45, 0.7); key.position.set(-6, 14, 10); scene.add(key);
    const back = new THREE.PointLight(0x6fa8ff, 60, 30); back.position.set(4, 3, -6); scene.add(back);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x101114, roughness: 0.35, metalness: 0.6, envMap: env.studio.env })); table.rotation.x = -Math.PI / 2; scene.add(table);
    const coin = new THREE.Group(); scene.add(coin);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.28, 96), A.M.gold); body.rotation.x = Math.PI / 2; coin.add(body);
    const ridge = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.08, 8, 96), A.M.gold); ridge.position.z = 0.15; coin.add(ridge);
    const tg = goldGlyphs(SVGLoader, GLYPHS.tenge, { size: 2.4, depth: 0.12, bevel: 0.03, material: A.M.gold }); tg.position.z = 0.17; coin.add(tg);
    const tg2 = tg.clone(); tg2.position.z = -0.17; tg2.rotation.y = Math.PI; coin.add(tg2);
    const notes = [];
    [["#2c8fb8", "#0e4e7a"], ["#6baf8e", "#2d6650"], ["#d9b26a", "#8e6526"], ["#b05a7a", "#5a2a44"], ["#2c8fb8", "#123a66"]].forEach(([a, b], i) => {
      const n = new THREE.Mesh(new THREE.PlaneGeometry(6, 3, 8, 2), new THREE.MeshStandardMaterial({ map: noteTexture(i + 3, a, b), side: THREE.DoubleSide, roughness: 0.6 })); scene.add(n); notes.push(n);
    });
    const bok = pointsCloud(60, 5, (t, s) => [(s[0] - 0.5) * 50, 2 + s[1] * 18, -18 - s[2] * 20], { size: 1.8, color: 0xffcf7a, map: softDot(), opacity: 0.5 }); bok.update(0); scene.add(bok);
    const c = cam(32, 0.1, 300);
    return { scene, camera: c, look: { ...archLook, sat: 0.95, temp: 0.2, focus: 11, focusRange: 4, dof: 1, bloom: 0.55, bloomThr: 1.0, grain: 0.06 },
      update(lt) {
        const k = ease.out(clamp(lt / 2.2, 0, 1));
        coin.position.set(0, lerp(6, 2.6, k), 0); coin.rotation.set(lerp(-1.2, -0.25, k), lt * 2.2 * (1 - k * 0.7), 0);
        notes.forEach((n, i) => { const tt = lt - 0.8 - i * 0.18; const y = 16 - Math.max(0, tt) * 4.2; n.position.set(-7 + i * 3.5 + Math.sin(tt * 1.5 + i) * 1.2, Math.max(0.05 + i * 0.02, y), -2 - i * 1.2); n.rotation.set(-Math.PI / 2 + (y > 0.2 ? Math.sin(tt * 2 + i) * 0.7 : 0), i * 0.7, Math.cos(tt * 1.7 + i) * (y > 0.2 ? 0.5 : 0)); });
        path(c, lt, [[0, V3(0, 5, 14), V3(0, 2.8, 0)], [3.4, V3(1.2, 3.6, 10.5), V3(0, 2.6, 0)], [3.95, V3(0.1, 2.75, 3.2), V3(0, 2.6, 0)]]);
      } };
  }, 0.35);

  /* ---- 1997 · 3D map: the capital moves north ---- */
  const goldenLook = { exposure: 1.1, temp: 0.35, sat: 0.92, contrast: 1.06, lift: [0.02, 0.015, 0.01], gain: [1.02, 1.0, 0.95], vignette: 0.42, grain: 0.05, halation: 0.25, bloom: 0.45, bloomThr: 1.0 };
  add(23.0, 27.45, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x050b16); scene.fog = new THREE.FogExp2(0x050b16, 0.0009);
    scene.add(new THREE.HemisphereLight(0x5a7ab0, 0x0a0a10, 0.8));
    const key = new THREE.DirectionalLight(0xffe0b0, 2.4); key.position.set(-300, 500, 300); scene.add(key);
    const sc = 1.0, geo = kzShape(sc);
    const map = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x1a7fa8, metalness: 0.25, roughness: 0.4, envMap: env.studio.env, envMapIntensity: 0.9, side: THREE.DoubleSide })); scene.add(map);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({ color: new THREE.Color(2.4, 1.7, 0.6) })); scene.add(edge);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshStandardMaterial({ color: 0x070d18, roughness: 0.3, metalness: 0.5, envMap: env.studio.env })); table.rotation.x = -Math.PI / 2; table.position.y = -2; scene.add(table);
    const top = 16.5;
    const al = mapXZ("almaty", sc).setY(top), ak = mapXZ("astana", sc).setY(top);
    const glowC = (col, s) => new THREE.Mesh(new THREE.SphereGeometry(s, 16, 12), new THREE.MeshBasicMaterial({ color: col }));
    const alm = glowC(new THREE.Color(6, 4.2, 1.2), 4.5); alm.position.copy(al); scene.add(alm);
    const akm = glowC(new THREE.Color(6, 6, 6), 4.5); akm.position.copy(ak); scene.add(akm);
    const mid = al.clone().add(ak).multiplyScalar(0.5).add(V3(60, 120, 0));
    const curve = new THREE.QuadraticBezierCurve3(al, mid, ak);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 1.6, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 3.5, 1.2) })); scene.add(tube);
    const head = glowC(new THREE.Color(10, 8, 4), 3.2); scene.add(head);
    const cityPts = ["shymkent", "karaganda", "atyrau", "aktobe", "pavlodar", "oskemen", "kostanay", "aktau", "kyzylorda", "taraz", "oral", "petropavl", "semey"].map((k) => mapXZ(k, sc).setY(top));
    cityPts.forEach((p) => { const d = glowC(new THREE.Color(1.5, 2.5, 3), 2.2); d.position.copy(p); scene.add(d); });
    const c = cam(40, 1, 6000);
    const total = tube.geometry.index.count;
    return { scene, camera: c, look: { ...goldenLook, temp: 0.1, sat: 1.0, focus: 900, focusRange: 600, dof: 0.4, bloom: 0.7, bloomThr: 0.9 },
      update(lt) {
        const k = seg(lt, 1.8, 3.4); tube.geometry.setDrawRange(0, Math.floor(total * k / 3) * 3); head.position.copy(curve.getPoint(k)); head.visible = k > 0 && k < 1;
        akm.scale.setScalar(1 + 1.5 * Math.max(0, Math.sin(clamp((lt - 3.3) * 3, 0, Math.PI))));
        path(c, lt, [[0, V3(-40, 900, 700), V3(30, 0, 40)], [3.5, V3(120, 620, 520), V3(110, 0, -10)], [4.45, V3(ak.x + 10, 140, ak.z + 120), ak]]);
      } };
  }, 0.35);

  /* ---- 1998–2010 · construction time-lapse on the Esil ---- */
  add(27.4, 31.05, () => {
    const sunA = sunVec(12, 230);
    const w = world({ envm: ENV.sunset, sun: sunA, sunColor: 0xffc890, sunI: 3.0, hemiSky: 0xa9bcd9, hemiGround: 0x5a4a32, hemiI: 0.55, fog: 0xd6b48c, fogD: 0.00011, shadow: 900,
      sky: { zenith: 0x2d5c9e, horizon: 0xf3c48e, sunColor: 0xffc890, sunInt: 14, halo: 1.2, cloudCover: 0.5, cloudLit: 0xffd2a8, cloudDark: 0x6a7090, haze: 0.25 } });
    const city = A.astanaCity({ night: false, seed: 98, extent: 1300, merge: false }); w.scene.add(city);
    const L = city.userData;
    const water = makeWater([600, 8000], { normals: ctx.waterNormals, color: new THREE.Color(0.03, 0.07, 0.1), sunDir: sunA }); water.position.set(L.riverX, 0.4, 0); w.scene.add(water);
    const growing = [L.baiterek, L.khan, L.akorda, L.pyramid, L.mosque, ...L.blocks.children];
    growing.forEach((o) => { o.userData.rise = o.userData.rise ?? 0.3; });
    const cranes = [];
    for (let i = 0; i < 9; i++) { const cr = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(2, 90, 2), new THREE.MeshLambertMaterial({ color: 0xe0a030 })); m.position.y = 45; cr.add(m); const jib = new THREE.Mesh(new THREE.BoxGeometry(70, 2, 2), m.material); jib.position.set(20, 90, 0); cr.add(jib); cr.position.set(-700 + i * 180, 0, -150 + (i % 3) * 120); w.scene.add(cr); cranes.push({ cr, jib }); }
    const c = cam(44, 1, 60000);
    return { scene: w.scene, camera: c, look: { ...goldenLook, focus: 900, focusRange: 600, dof: 0.4, rays: 0.17, flare: 0.20 },
      update(lt, t) {
        const k = clamp(lt / 3.4, 0, 1);
        growing.forEach((o, i) => { const s = clamp((k * 1.35 - (o.userData.rise || 0) * 0.6) * 1.6, 0.02, 1); o.scale.y = s; });
        cranes.forEach(({ cr }, i) => { cr.rotation.y = t * (0.8 + i * 0.1) + i; cr.visible = k < 0.92; });
        const sd = sunVec(lerp(30, 9, k), lerp(160, 235, k)); w.sky.material.uniforms.sunDir.value.copy(sd); w.sun.position.copy(sd).multiplyScalar(1500);
        w.sky.material.uniforms.cloudOff.value.set(t * 0.25, t * 0.08);
        water.material.uniforms.time.value = t * 4;
        path(c, lt, [[0, V3(-1500, 380, 1500), V3(0, 40, 0)], [3.65, V3(-1150, 300, 1050), V3(100, 60, -100)]]);
        this.sunWorld = c.position.clone().addScaledVector(sd, 20000);
      } };
  }, 0.4);

  /* ---- Baiterek hero rise (golden hour) ---- */
  const astanaGolden = () => {
    const sun = sunVec(9, 245);
    const w = world({ envm: ENV.sunset, sun, sunColor: 0xffc27a, sunI: 3.2, hemiSky: 0xa8bedb, hemiGround: 0x5a4a35, hemiI: 0.55, fog: 0xd8b892, fogD: 0.00009, shadow: 900,
      sky: { zenith: 0x2a5aa0, horizon: 0xf6c28c, sunColor: 0xffc27a, sunInt: 16, halo: 1.3, cloudCover: 0.42, cloudLit: 0xffd0a0, cloudDark: 0x6a7090, haze: 0.08 } });
    const city = A.astanaCity({ night: false, seed: 35 }); w.scene.add(city);
    const water = makeWater([520, 9000], { normals: ctx.waterNormals, color: new THREE.Color(0.03, 0.07, 0.1), sunDir: sun }); water.position.set(city.userData.riverX, 0.4, 0); w.scene.add(water);
    return { ...w, city, water, sunDir: sun };
  };
  add(31.0, 35.45, () => {
    const w = astanaGolden(), c = cam(40, 0.5, 60000);
    return { scene: w.scene, camera: c, look: { ...goldenLook, focus: 70, focusRange: 50, dof: 0.7, rays: 0.28, flare: 0.30, raysThr: 1.1 },
      update(lt, t) {
        w.water.material.uniforms.time.value = t;
        path(c, lt, [[0, V3(-55, 8, 42), V3(0, 40, 0)], [2.2, V3(-46, 70, 38), V3(0, 95, 0)], [4.45, V3(-210, 140, 260), V3(0, 80, 0)]]);
        w.sky.material.uniforms.cloudOff.value.set(t * 0.02, 0);
        this.sunWorld = c.position.clone().addScaledVector(w.sunDir, 20000);
      } };
  }, 0.35);

  /* ---- Industry · oil field at sunset ---- */
  const indLook = { exposure: 1.08, temp: 0.4, sat: 0.95, contrast: 1.12, lift: [0.0, 0.01, 0.02], gain: [1.03, 0.99, 0.93], shadowTint: [-0.01, 0.01, 0.03], highTint: [0.04, 0.015, -0.01], vignette: 0.45, grain: 0.045, bloom: 0.5, bloomThr: 1.0 };
  add(35.0, 38.85, () => {
    const sun = sunVec(6, 250);
    const w = world({ sun, sunColor: 0xff9c55, sunI: 2.6, hemiSky: 0x8a9cc0, hemiGround: 0x4a3420, hemiI: 0.6, fog: 0xd49260, fogD: 0.00025, shadow: 160,
      sky: { zenith: 0x23407a, horizon: 0xff9a50, sunColor: 0xff9c55, sunInt: 22, halo: 1.8, cloudCover: 0.35, cloudLit: 0xffa070, cloudDark: 0x4a3c55, haze: 0.4 } });
    w.scene.add(A.steppe(6000, 31, { color: [140, 110, 70], amp: 3 }));
    const jacks = [];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const p = A.pumpjack(); p.position.set(-60 + i * 45 + (j % 2) * 18, 0, -40 - j * 55); p.rotation.y = 0.3; w.scene.add(p); jacks.push(p); }
    const ref = A.refinery(5); ref.position.set(-320, 0, -460); w.scene.add(ref);
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 900, 10), A.M.steel); pipe.rotation.z = Math.PI / 2; pipe.rotation.y = 0.3; pipe.position.set(0, 1.2, -20); w.scene.add(pipe);
    const c = cam(40, 0.5, 30000);
    return { scene: w.scene, camera: c, look: { ...indLook, exposure: 0.95, focus: 45, focusRange: 50, dof: 0.5, rays: 0.33, flare: 0.35, raysThr: 1.0 },
      update(lt, t) {
        jacks.forEach((p, i) => { const a = t * 1.8 + i * 0.9; p.userData.beam.rotation.z = Math.sin(a) * 0.22; p.userData.crank.rotation.z = a; });
        ref.userData.flame.scale.set(1 + 0.15 * Math.sin(t * 13), 1 + 0.25 * Math.sin(t * 9 + 1), 1);
        path(c, lt, [[0, V3(-20, 3.2, 40), V3(-20, 7, -90)], [3.85, V3(-2, 4.2, 22), V3(-10, 7, -100)]]);
        this.sunWorld = c.position.clone().addScaledVector(sun, 20000);
      } };
  }, 0.35);

  /* ---- Industry · steel mill pour ---- */
  add(38.8, 41.65, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0605); scene.fog = new THREE.FogExp2(0x1a0e08, 0.012);
    scene.add(new THREE.HemisphereLight(0x553322, 0x110805, 0.5));
    const hot = new THREE.PointLight(0xff8a30, 900, 120, 1.6); hot.position.set(0, 6, 0); scene.add(hot);
    const hall = new THREE.Mesh(new THREE.BoxGeometry(160, 60, 120), new THREE.MeshLambertMaterial({ color: 0x2a1c16, side: THREE.BackSide })); hall.position.y = 28; scene.add(hall);
    for (let i = 0; i < 8; i++) { const col = new THREE.Mesh(new THREE.BoxGeometry(2, 60, 2), A.M.dark); col.position.set(-60 + i * 17, 28, -30); scene.add(col); }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(160, 2, 3), A.M.dark); beam.position.set(0, 34, -10); scene.add(beam);
    const ladle = new THREE.Group(); ladle.position.set(-4, 18, 0); scene.add(ladle);
    const lb = new THREE.Mesh(new THREE.CylinderGeometry(6, 4.6, 8, 32, 1, true), new THREE.MeshLambertMaterial({ color: 0x3a2a22, side: THREE.DoubleSide })); ladle.add(lb);
    const molten = new THREE.Mesh(new THREE.CircleGeometry(5.8, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(9, 4.2, 1.0) })); molten.rotation.x = -Math.PI / 2; molten.position.y = 3.6; ladle.add(molten);
    const streamMat = new THREE.ShaderMaterial({ uniforms: { t: { value: 0 } }, transparent: true,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float t; varying vec2 vUv; void main(){ float n = sin(vUv.y * 40.0 + t * 25.0) * 0.5 + 0.5; vec3 c = mix(vec3(9.0, 3.6, 0.8), vec3(12.0, 8.0, 3.0), n * 0.6); float a = smoothstep(0.0, 0.35, 1.0 - abs(vUv.x - 0.5) * 2.0); gl_FragColor = vec4(c, a); }` });
    const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 16, 16, 8, true), streamMat); stream.position.set(4.2, 10, 0); scene.add(stream);
    const mold = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 8), new THREE.MeshLambertMaterial({ color: 0x2a201a })); mold.position.set(4.5, 1.5, 0); scene.add(mold);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(8, 3.2, 0.7) })); pool.rotation.x = -Math.PI / 2; pool.position.set(4.5, 3.05, 0); scene.add(pool);
    const sparks = pointsCloud(900, 77, (t, s) => { const life = (t * 1.3 + s[0]) % 1, a = s[1] * Math.PI * 2, v = 6 + s[2] * 14; return [4.5 + Math.cos(a) * v * life, 3 + (8 + s[3] * 10) * life - 9.8 * life * life * 1.2, Math.sin(a) * v * life]; }, { size: 0.35, color: 0xffc070, map: softDot() });
    sparks.material.color.setRGB(6, 3.6, 1.4); scene.add(sparks);
    const steam = pointsCloud(140, 12, (t, s) => { const life = (t * 0.25 + s[0]) % 1; return [-10 + s[1] * 30 + life * 6, 8 + life * 40, -12 + s[2] * 18]; }, { size: 14, color: 0x6a4a3a, map: softDot(), additive: false, opacity: 0.25 }); scene.add(steam);
    const c = cam(38, 0.5, 2000);
    return { scene, camera: c, look: { ...indLook, temp: 0.2, focus: 26, focusRange: 14, dof: 0.9, bloom: 0.9, bloomThr: 1.0, halation: 0.3 },
      update(lt, t) { ladle.rotation.z = -lerp(0.35, 0.55, seg(lt, 0, 2.8)); streamMat.uniforms.t.value = t; sparks.update(t); steam.update(t); hot.intensity = 900 + 120 * Math.sin(t * 17); path(c, lt, [[0, V3(-22, 7, 26), V3(3, 8, 0)], [2.85, V3(-14, 5, 20), V3(4, 6, 0)]]); } };
  }, 0.3);

  /* ---- Industry · open-pit mine ---- */
  add(41.6, 43.15, () => {
    const sun = sunVec(14, 250);
    const w = world({ sun, sunColor: 0xffb070, sunI: 2.8, hemiSky: 0x9fb2d0, hemiGround: 0x4a3a2a, hemiI: 0.7, fog: 0xc8a07a, fogD: 0.00025, shadow: 500,
      sky: { zenith: 0x2a4f8a, horizon: 0xf0b07a, sunColor: 0xffb070, sunInt: 12, halo: 1.2, cloudCover: 0.3, haze: 0.3 } });
    const pitM = new THREE.MeshLambertMaterial({ map: noiseTex(62, 256, [160, 128, 92], 40, [24, 2]), side: THREE.DoubleSide });
    for (let i = 0; i < 12; i++) { const rr = 40 + i * 32, y = -120 + i * 10; const wall = new THREE.Mesh(new THREE.CylinderGeometry(rr + 6, rr, 10, 96, 1, true), pitM); wall.position.y = y + 5; w.scene.add(wall); const bench = new THREE.Mesh(new THREE.RingGeometry(rr + 6, rr + 32, 96), pitM); bench.rotation.x = -Math.PI / 2; bench.position.y = y + 10; w.scene.add(bench); }
    const floorP = new THREE.Mesh(new THREE.CircleGeometry(40, 48), pitM); floorP.rotation.x = -Math.PI / 2; floorP.position.y = -120; w.scene.add(floorP);
    const rim = new THREE.Mesh(new THREE.RingGeometry(424, 6000, 96, 1), new THREE.MeshLambertMaterial({ map: noiseTex(63, 256, [150, 125, 90], 26, [60, 60]) })); rim.rotation.x = -Math.PI / 2; rim.position.y = 0; w.scene.add(rim);
    const trucks = [];
    for (let i = 0; i < 6; i++) { const tr = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 10), new THREE.MeshLambertMaterial({ color: 0xe0b030 })); b.position.y = 3; tr.add(b); w.scene.add(tr); trucks.push({ tr, lvl: 2 + i * 1.6, ph: i * 1.1 }); }
    const c = cam(42, 1, 30000);
    return { scene: w.scene, camera: c, look: { ...indLook, focus: 500, focusRange: 400, dof: 0.3 },
      update(lt, t) {
        trucks.forEach(({ tr, lvl, ph }) => { const i = Math.floor(lvl), rr = 40 + i * 32 + 18, a = ph + t * 0.06; tr.position.set(Math.cos(a) * rr, -120 + i * 10 + 10.2, Math.sin(a) * rr); tr.rotation.y = -a; });
        path(c, lt, [[0, V3(-560, 330, 560), V3(40, -80, 0)], [1.55, V3(-500, 300, 500), V3(40, -85, 0)]]);
      } };
  }, 0.25);

  /* ---- Agriculture · golden wheat and a combine ---- */
  add(43.1, 44.65, () => {
    const sun = sunVec(7, 240);
    const w = world({ sun, sunColor: 0xffc070, sunI: 2.8, hemiSky: 0xa6bddc, hemiGround: 0x6a5530, hemiI: 0.8, fog: 0xe6c08a, fogD: 0.0009, shadow: 60,
      sky: { zenith: 0x3060a8, horizon: 0xffd29a, sunColor: 0xffc070, sunInt: 18, halo: 1.6, cloudCover: 0.3, cloudLit: 0xffe0b0, haze: 0.35 } });
    const ground = A.steppe(3000, 44, { color: [150, 115, 55], amp: 0 }); ground.position.y = -0.05; w.scene.add(ground);
    const wheat = A.wheatField(24000, [220, 220], 7); w.scene.add(wheat);
    const comb = A.combine(); w.scene.add(comb);
    const dust = pointsCloud(160, 9, (t, s) => { const life = (t * 0.6 + s[0]) % 1; return [comb.position.x + (s[1] - 0.5) * 8 + life * 6, 1 + life * 8, comb.position.z + 4 + s[2] * 6 + life * 10]; }, { size: 5, color: 0xd9b080, map: softDot(), additive: false, opacity: 0.35 }); w.scene.add(dust);
    const c = cam(38, 0.3, 20000);
    return { scene: w.scene, camera: c, look: { ...indLook, temp: 0.5, sat: 1.0, focus: 30, focusRange: 18, dof: 1, rays: 0.28, flare: 0.30 },
      update(lt, t) { wheat.userData.uni.uTime.value = t; comb.position.set(lerp(-30, -14, lt / 1.55), 0, -26); comb.rotation.y = Math.PI / 2 + 0.2; dust.update(t);
        path(c, lt, [[0, V3(-4, 1.4, 6), V3(-18, 2.4, -26)], [1.55, V3(-1, 1.6, 4), V3(-12, 2.8, -26)]]); this.sunWorld = c.position.clone().addScaledVector(sun, 20000); } };
  }, 0.25);

  /* ---- Rail across the steppe toward the mountains ---- */
  add(44.6, 47.65, () => {
    const sun = sunVec(9, 200);
    const w = world({ sun, sunColor: 0xffb070, sunI: 3.0, hemiSky: 0x9fb2d0, hemiGround: 0x4a3a2a, hemiI: 0.6, fog: 0xd8a87a, fogD: 0.00004, shadow: 300, shadowCenter: V3(0, 0, -16000),
      sky: { zenith: 0x2a4f8a, horizon: 0xf6b07a, sunColor: 0xffb070, sunInt: 16, halo: 1.5, cloudCover: 0.38, cloudLit: 0xffc8a0, haze: 0.3 } });
    const ter = terrain.clone(); ter.position.y = -25; w.scene.add(ter);
    const base = V3(0, 0, -16000); base.y = terrain.userData.heightAt(0, -16000) - 23;
    const flat = A.steppe(5000, 51, { color: [140, 120, 80], amp: 0.5 }); flat.position.copy(base).add(V3(0, -0.6, 0)); w.scene.add(flat);
    const rails = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 6000), new THREE.MeshLambertMaterial({ color: 0x4a4038 })); rails.position.copy(base); rails.rotation.y = Math.PI / 2; w.scene.add(rails);
    const tr = A.train(34, 4); tr.rotation.y = -Math.PI / 2; w.scene.add(tr);
    for (let i = 0; i < 30; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 11, 6), A.M.dark); p.position.copy(base).add(V3(-900 + i * 60, 5.5, -8)); w.scene.add(p); }
    const c = cam(36, 0.5, 80000);
    return { scene: w.scene, camera: c, look: { ...indLook, focus: 40, focusRange: 60, dof: 0.4, rays: 0.22, flare: 0.25 },
      update(lt, t) { tr.position.copy(base).add(V3(lerp(-200, 60, lt / 3.05) + 0, 0.4, 0)); tr.position.x -= 0; tr.position.x = base.x + lerp(-260, 40, lt / 3.05);
        const camP = base.clone().add(V3(lerp(-150, -70, lt / 3.05), 2.6, 16)); c.position.copy(camP); c.lookAt(tr.position.clone().add(V3(-40, 3.5, 0)));
        this.sunWorld = c.position.clone().addScaledVector(sun, 20000); } };
  }, 0.3);

  /* ---- People who built it ---- */
  add(47.6, 51.45, () => {
    const sun = sunVec(3, 180);
    const w = world({ sun, sunColor: 0xff9a50, sunI: 2.0, hemiSky: 0x7a8cb0, hemiGround: 0x3a2a1a, hemiI: 0.6, fog: 0xd48a58, fogD: 0.0006, shadow: 0,
      sky: { zenith: 0x1f3a70, horizon: 0xff9a50, sunColor: 0xffa060, sunInt: 26, halo: 2.0, cloudCover: 0.3, cloudLit: 0xffa070, cloudDark: 0x3a3048, haze: 0.45 } });
    w.scene.add(A.steppe(4000, 52, { color: [110, 90, 60], amp: 4 }));
    const ref = A.refinery(9); ref.position.set(0, 0, -420); w.scene.add(ref);
    const crew = new THREE.Group(); w.scene.add(crew);
    [[-2.4, 1.0, false, 0], [-1.0, 1.05, true, 0], [0.4, 1.08, false, 0.9], [1.7, 1.0, false, 0], [3.0, 0.96, true, 0]].forEach(([x, s, bag, raise], i) => {
      const p = A.person(i + 1, { height: 1.75 * s, bag, raise }); p.position.set(x, 0, 0); crew.add(p);
      const hat = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: i === 2 ? 0xffffff : 0xf0b020 })); hat.position.set(x, 1.84 * s, 0); hat.scale.set(1.15, 0.8, 1.2); crew.add(hat);
    });
    const c = cam(32, 0.3, 30000);
    return { scene: w.scene, camera: c, look: { ...indLook, temp: 0.6, focus: 7.5, focusRange: 4, dof: 1, rays: 0.55, flare: 0.45, raysThr: 0.9, bloom: 0.6 },
      update(lt, t) { ref.userData.flame.scale.set(1, 1 + 0.25 * Math.sin(t * 9), 1); path(c, lt, [[0, V3(0.4, 0.7, 8.8), V3(0.3, 1.5, 0)], [3.85, V3(0.2, 0.55, 6.8), V3(0.3, 1.55, 0)]]); this.sunWorld = c.position.clone().addScaledVector(sun, 20000); } };
  }, 0.4);

  /* ---- 2017 · EXPO at blue hour ---- */
  const expoLook = { exposure: 1.15, temp: -0.15, tint: 0.05, sat: 1.05, contrast: 1.08, lift: [0.0, 0.01, 0.03], gain: [0.98, 1.0, 1.04], shadowTint: [0.0, 0.01, 0.04], highTint: [0.03, 0.02, 0.0], vignette: 0.42, grain: 0.035, bloom: 0.75, bloomThr: 0.85 };
  const expoWorld = () => {
    const sun = sunVec(-3, 250);
    const w = world({ envm: ENV.night, sun: sunVec(15, 250), sunColor: 0x6680c0, sunI: 0.35, hemiSky: 0x4a6aa8, hemiGround: 0x1a1a28, hemiI: 0.7, fog: 0x1e2c52, fogD: 0.00016, shadow: 0,
      sky: { zenith: 0x0a1838, horizon: 0x5a6a9e, ground: 0x10141f, sunColor: 0xff8a5a, sunInt: 0, halo: 0.6, cloudCover: 0.35, cloudLit: 0x6a6a9a, cloudDark: 0x1a2040, stars: 0.6, haze: 0.2 } });
    w.sky.material.uniforms.sunDir.value.copy(sun);
    A.setEnv(env.night);
    const city = A.astanaCity({ night: true, seed: 2017 }); w.scene.add(city);
    const nur = city.userData.nur;
    const ring = new THREE.Group(); w.scene.add(ring);
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; const pv = new THREE.Mesh(new THREE.BoxGeometry(70, 16, 34), A.towerMat("glass", true, i)); pv.position.set(nur.position.x + Math.cos(a) * 190, 8, nur.position.z + Math.sin(a) * 190); pv.rotation.y = -a; ring.add(pv); }
    const lights = pointsCloud(600, 33, (t, s) => { const a = s[0] * Math.PI * 2, rr = 60 + s[1] * 110; return [nur.position.x + Math.cos(a) * rr, 1.5, nur.position.z + Math.sin(a) * rr]; }, { size: 2.2, color: 0xffd9a0, map: softDot() });
    lights.material.color.setRGB(3, 2.4, 1.6); lights.update(0); w.scene.add(lights);
    const fw = pointsCloud(1200, 21, (t, s, i) => { const burst = i % 6, bt = (t * 0.45 + burst * 0.37) % 1, cx = nur.position.x + (burst - 2.5) * 70, cz = nur.position.z - 80 + (burst % 2) * 120, cy = 180 + burst * 14; const a = s[0] * Math.PI * 2, b = Math.acos(2 * s[1] - 1), v = 55 * Math.pow(bt, 0.35); return [cx + Math.sin(b) * Math.cos(a) * v, cy + Math.cos(b) * v - 30 * bt * bt, cz + Math.sin(b) * Math.sin(a) * v]; }, { size: 3, color: 0xffffff, map: softDot() });
    const fwc = new Float32Array(1200 * 3), pal = [[6, 4.5, 1.5], [1.2, 4, 6], [6, 6, 6], [5, 1.5, 2], [2, 6, 3], [6, 3, 1]];
    for (let i = 0; i < 1200; i++) { const c3 = pal[i % 6]; fwc[i * 3] = c3[0]; fwc[i * 3 + 1] = c3[1]; fwc[i * 3 + 2] = c3[2]; }
    fw.geometry.setAttribute("color", new THREE.BufferAttribute(fwc, 3)); fw.material.vertexColors = true; fw.material.color.setRGB(1, 1, 1); w.scene.add(fw);
    const flags = bannerFlags(40, 17, 120, nur.position, 12); w.scene.add(flags);
    return { ...w, nur, fw, flags };
  };
  add(51.0, 55.95, () => {
    const w = expoWorld(), c = cam(42, 1, 60000), n = w.nur.position;
    return { scene: w.scene, camera: c, look: { ...expoLook, focus: 600, focusRange: 500, dof: 0.35 },
      update(lt, t) { A.setEnv(env.night); w.fw.update(t); w.flags.userData.uni.uTime.value = t; w.nur.userData.turbines.forEach((tb) => (tb.userData.rotor.rotation.z = t * 2));
        path(c, lt, [[0, V3(n.x + 700, 360, n.z + 900), V3(n.x, 60, n.z)], [4.95, V3(n.x + 330, 150, n.z + 420), V3(n.x, 55, n.z)]]); } };
  }, 0.3);
  add(55.9, 60.75, () => {
    const w = expoWorld(), c = cam(40, 1, 60000), n = w.nur.position;
    return { scene: w.scene, camera: c, look: { ...expoLook, focus: 150, focusRange: 90, dof: 0.6 },
      update(lt, t) { A.setEnv(env.night); w.fw.update(t); w.flags.userData.uni.uTime.value = t; w.nur.userData.turbines.forEach((tb) => (tb.userData.rotor.rotation.z = t * 2));
        const a = lerp(0.5, 1.4, lt / 4.85); c.position.set(n.x + Math.cos(a) * 170, lerp(14, 40, lt / 4.85), n.z + Math.sin(a) * 170); c.lookAt(n.x, 50, n.z); } };
  }, 0.4);

  /* ---- 2017 · Earth: open to the world ---- */
  add(60.7, 64.85, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000004);
    const sunD = V3(-0.6, 0.35, 0.7).normalize();
    const earthMat = new THREE.ShaderMaterial({ uniforms: { day: { value: ctx.tex.earthDay }, night: { value: ctx.tex.earthNight }, clouds: { value: ctx.tex.earthClouds }, sun: { value: sunD } },
      vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `uniform sampler2D day, night, clouds; uniform vec3 sun; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){ float l = dot(normalize(vN), sun); float k = smoothstep(-0.15, 0.25, l);
          vec3 d = texture2D(day, vUv).rgb; vec3 n = texture2D(night, vUv).rgb * vec3(3.0, 2.3, 1.4); float cl = texture2D(clouds, vUv).r;
          vec3 c = mix(n, d * (0.25 + 1.2 * max(l, 0.0)), k); c = mix(c, vec3(1.0) * (0.15 + 1.2 * max(l, 0.0)), cl * 0.75);
          float rim = pow(1.0 - max(dot(normalize(vN), vV), 0.0), 3.0); c += vec3(0.3, 0.55, 1.0) * rim * (0.3 + k * 1.2);
          gl_FragColor = vec4(c, 1.0); }` });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(10, 96, 64), earthMat); scene.add(earth);
    const atm = new THREE.Mesh(new THREE.SphereGeometry(10.45, 64, 32), new THREE.ShaderMaterial({ transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float r = pow(1.0 - abs(dot(normalize(vN), vV)), 2.0); gl_FragColor = vec4(vec3(0.35, 0.6, 1.0) * r * 2.2, r); }` })); scene.add(atm);
    const stars = pointsCloud(1500, 3, (t, s) => { const a = s[0] * Math.PI * 2, b = Math.acos(2 * s[1] - 1); return [Math.sin(b) * Math.cos(a) * 400, Math.cos(b) * 400, Math.sin(b) * Math.sin(a) * 400]; }, { size: 1.2, color: 0xffffff, map: softDot(), opacity: 0.8 }); stars.update(0); scene.add(stars);
    const ll = (lat, lon, r = 10.05) => { const phi = THREE.MathUtils.degToRad(90 - lat), th = THREE.MathUtils.degToRad(lon + 180); return V3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th)); };
    const astana = ll(51.17, 71.43);
    const caps = [[55.75, 37.62], [39.9, 116.4], [48.85, 2.35], [52.52, 13.4], [40.71, -74.0], [35.68, 139.69], [25.2, 55.27], [41.0, 28.97], [28.61, 77.21], [37.56, 126.97], [51.5, -0.12], [1.35, 103.82]];
    const arcs = caps.map(([la, lo], i) => { const b = ll(la, lo), m = astana.clone().add(b).multiplyScalar(0.5); m.setLength(10 + astana.distanceTo(b) * 0.35); const cu = new THREE.QuadraticBezierCurve3(astana, m, b); const tb = new THREE.Mesh(new THREE.TubeGeometry(cu, 64, 0.025, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 3.6, 1.2) })); scene.add(tb); const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 5, 3) })); dot.position.copy(b); scene.add(dot); return { tb, n: tb.geometry.index.count, dot, d: i * 0.12 }; });
    const home = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(8, 8, 8) })); home.position.copy(astana); scene.add(home);
    earth.add(home); arcs.forEach((a) => { earth.add(a.tb); earth.add(a.dot); });
    const c = cam(30, 0.1, 2000);
    return { scene, camera: c, look: { ...expoLook, exposure: 1.1, focus: 30, focusRange: 30, dof: 0.2, bloom: 0.9, bloomThr: 0.8, grain: 0.03 },
      update(lt) { earth.rotation.y = lerp(-0.25, 0.1, lt / 4.15);
        arcs.forEach((a) => { const k = seg(lt, 0.4 + a.d, 1.6 + a.d); a.tb.geometry.setDrawRange(0, Math.floor((a.n * k) / 3) * 3); a.dot.visible = k > 0.98; });
        const dir = astana.clone().applyMatrix4(earth.matrixWorld).normalize();
        c.position.copy(dir.clone().multiplyScalar(lerp(64, 56, ease.inOut(clamp(lt / 4.15, 0, 1))))).add(V3(0, -9, 0)); c.lookAt(0, 0.5, 0); } };
  }, 0.4);

  /* ---- 2026 · digital Astana at night ---- */
  const techLook = { exposure: 1.12, temp: -0.2, tint: 0.0, sat: 1.0, contrast: 1.1, lift: [0.0, 0.01, 0.025], gain: [0.98, 1.0, 1.04], shadowTint: [-0.01, 0.01, 0.04], highTint: [0.02, 0.015, 0.0], vignette: 0.4, grain: 0.03, bloom: 0.8, bloomThr: 0.85 };
  add(64.4, 67.85, () => {
    const w = expoWorld(), c = cam(44, 1, 60000);
    const trails = new THREE.Group(); w.scene.add(trails);
    const r = rng(64), trailMats = [];
    for (let i = 0; i < 60; i++) { const horiz = r() < 0.5, off = (Math.floor(r() * 22) - 11) * 220; const len = 2400; const geo = new THREE.PlaneGeometry(horiz ? len : 6, horiz ? 6 : len); geo.rotateX(-Math.PI / 2);
      const m = new THREE.ShaderMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: { t: { value: 0 }, ph: { value: r() }, col: { value: r() < 0.5 ? new THREE.Color(0.4, 2.4, 4) : new THREE.Color(4, 2.6, 0.8) }, hz: { value: horiz ? 1 : 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform float t, ph, hz; uniform vec3 col; varying vec2 vUv; void main(){ float s = hz > 0.5 ? vUv.x : vUv.y; float p = fract(s * 3.0 - t * 0.35 - ph); float a = smoothstep(0.0, 0.25, p) * smoothstep(1.0, 0.7, p) * smoothstep(0.0, 0.5, 1.0 - abs((hz > 0.5 ? vUv.y : vUv.x) - 0.5) * 2.0); gl_FragColor = vec4(col * a, a); }` });
      const mesh = new THREE.Mesh(geo, m); mesh.position.set(horiz ? 0 : off, 1.2, horiz ? off : 0); trails.add(mesh); trailMats.push(m); }
    return { scene: w.scene, camera: c, look: { ...techLook, focus: 900, focusRange: 800, dof: 0.3 },
      update(lt, t) { A.setEnv(env.night); trailMats.forEach((m) => (m.uniforms.t.value = t)); w.flags.userData.uni.uTime.value = t;
        path(c, lt, [[0, V3(-900, 520, 900), V3(0, 60, 0)], [3.45, V3(-520, 330, 600), V3(0, 80, 0)]]); } };
  }, 0.35);

  /* ---- AI: data centre with a living neural network ---- */
  add(67.8, 70.25, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x02050c); scene.fog = new THREE.FogExp2(0x02060f, 0.035);
    scene.add(new THREE.HemisphereLight(0x3a5a8a, 0x05070a, 0.6));
    const led = canvasTex(128, 512, (g, w, h) => { const r = rng(5); g.fillStyle = "#0b0f18"; g.fillRect(0, 0, w, h); for (let y = 6; y < h; y += 14) { g.fillStyle = "#151b28"; g.fillRect(6, y, w - 12, 10); for (let x = 12; x < w - 12; x += 9) if (r() < 0.35) { g.fillStyle = r() < 0.8 ? "#36c9ff" : "#ffd36a"; g.fillRect(x, y + 3, 4, 3); } } });
    const rackM = new THREE.MeshLambertMaterial({ map: led, emissive: 0xffffff, emissiveMap: led, emissiveIntensity: 1.6 });
    const rackG = new THREE.BoxGeometry(1.2, 2.4, 1.1); rackG.translate(0, 1.2, 0);
    const racks = new THREE.InstancedMesh(rackG, rackM, 120), m4 = new THREE.Matrix4(); let k = 0;
    for (let i = 0; i < 30; i++) for (const x of [-3.2, -2.0, 2.0, 3.2]) { m4.makeTranslation(x, 0, -i * 1.25); racks.setMatrixAt(k++, m4); }
    scene.add(racks);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 60), new THREE.MeshStandardMaterial({ color: 0x0a0d14, roughness: 0.25, metalness: 0.6, envMap: env.night.env })); floor.rotation.x = -Math.PI / 2; floor.position.z = -18; scene.add(floor);
    const net = new THREE.Group(); net.position.set(0, 1.5, -9); scene.add(net);
    const r = rng(68), nodes = [];
    for (let i = 0; i < 70; i++) { const p = V3((r() - 0.5) * 3.2, (r() - 0.5) * 2.2, (r() - 0.5) * 6); nodes.push(p); const s = new THREE.Mesh(new THREE.SphereGeometry(0.035 + r() * 0.03, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 4, 6) })); s.position.copy(p); net.add(s); }
    const lp = []; nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && a.distanceTo(b) < 1.2) lp.push(a.x, a.y, a.z, b.x, b.y, b.z); }));
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(lp, 3));
    const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: new THREE.Color(0.6, 2.2, 3.5), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })); net.add(lines);
    const pulses = pointsCloud(300, 8, (t, s) => { const i = Math.floor(s[0] * (lp.length / 6)), f = (t * (0.6 + s[1]) + s[2]) % 1, o = i * 6; return [lerp(lp[o], lp[o + 3], f), lerp(lp[o + 1], lp[o + 4], f), lerp(lp[o + 2], lp[o + 5], f)]; }, { size: 0.09, color: 0xffffff, map: softDot() });
    pulses.material.color.setRGB(4, 4, 3); net.add(pulses);
    const c = cam(42, 0.05, 200);
    return { scene, camera: c, look: { ...techLook, focus: 7.5, focusRange: 3, dof: 1, bloom: 1.0, bloomThr: 0.8 },
      update(lt, t) { net.rotation.y = t * 0.25; pulses.update(t); path(c, lt, [[0, V3(0.3, 1.5, 2.5), V3(0, 1.4, -10)], [2.45, V3(-0.2, 1.7, -1.2), V3(0, 1.5, -10)]]); } };
  }, 0.3);

  /* ---- campus (morning) ---- */
  const morningSun = sunVec(18, 130);
  const morningWorld = (sh = 300) => world({ envm: ENV.day, sun: morningSun, sunColor: 0xfff0d8, sunI: 3.4, hemiSky: 0xb8cce8, hemiGround: 0x5a5040, hemiI: 0.55, fog: 0xc9d8ea, fogD: 0.00005, shadow: sh,
    sky: { zenith: 0x1f5fb8, horizon: 0xcfe0f0, sunColor: 0xfff0d8, sunInt: 12, halo: 1.0, cloudCover: 0.4, cloudLit: 0xffffff, cloudDark: 0x8090b0, haze: 0.05 } });
  add(70.2, 71.65, () => {
    const w = morningWorld(200); A.setEnv(env.day);
    const g = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), A.M.grass); g.rotation.x = -Math.PI / 2; g.receiveShadow = true; w.scene.add(g);
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(200, 120), new THREE.MeshLambertMaterial({ map: noiseTex(71, 256, [200, 196, 186], 10, [20, 12]) })); plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, 0.1, 40); plaza.receiveShadow = true; w.scene.add(plaza);
    const uni = A.tower(160, 40, 34, A.towerMat("glass", false, 12), null); uni.position.set(0, 0, -30); w.scene.add(uni);
    const wing = A.tower(40, 80, 50, A.towerMat("glass", false, 13), "cap"); wing.position.set(-95, 0, -10); w.scene.add(wing);
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(80, 1.5, 22), A.M.white); canopy.position.set(0, 12, 0); w.scene.add(canopy);
    const students = new THREE.Group(); w.scene.add(students); const r = rng(70);
    for (let i = 0; i < 26; i++) { const p = A.person(200 + i, { height: 1.6 + r() * 0.3, hair: r() < 0.45 ? "long" : "short", bag: r() < 0.5 }); p.position.set((r() - 0.5) * 60, 0, 20 + r() * 40); p.rotation.y = r() * 6.28; p.userData.v = (r() - 0.5) * 1.4; students.add(p); }
    const c = cam(40, 0.5, 30000);
    return { scene: w.scene, camera: c, look: { ...techLook, temp: 0.12, exposure: 0.85, contrast: 1.14, focus: 70, focusRange: 60, dof: 0.4, bloom: 0.3, bloomThr: 1.4 },
      update(lt) { A.setEnv(env.day); students.children.forEach((p) => { p.position.x += 0; p.translateZ(p.userData.v * 0.0); });
        students.children.forEach((p, i) => { p.position.z = 20 + ((i * 7) % 40) + lt * p.userData.v; });
        path(c, lt, [[0, V3(-60, 4, 110), V3(10, 22, -30)], [1.45, V3(-44, 5, 100), V3(15, 24, -30)]]); } };
  }, 0.25);
  /* ---- new factories: robot cell ---- */
  add(71.6, 72.85, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0b0f16); scene.fog = new THREE.FogExp2(0x0b1018, 0.02); scene.environment = env.studio.env;
    scene.add(new THREE.HemisphereLight(0xb8c8e8, 0x1a1a22, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-10, 20, 10); scene.add(key);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x2a2e36, roughness: 0.4, metalness: 0.3, envMap: env.studio.env })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
    const orange = new THREE.MeshStandardMaterial({ color: 0xf08a1c, roughness: 0.35, metalness: 0.2, envMap: env.studio.env });
    const arms = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group(); g.position.set(-6 + i * 4, 0, -i * 3); scene.add(g);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 0.6, 20), orange); base.position.y = 0.3; g.add(base);
      const j1 = new THREE.Group(); j1.position.y = 0.6; g.add(j1);
      const a1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.0, 0.4), orange); a1.position.y = 1.0; j1.add(a1);
      const j2 = new THREE.Group(); j2.position.y = 2.0; j1.add(j2);
      const a2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.32, 0.32), orange); a2.position.x = 0.9; j2.add(a2);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 5, 8) })); tip.position.x = 1.85; j2.add(tip);
      arms.push({ g, j1, j2, ph: i * 1.3 });
      const car = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 4.2), new THREE.MeshStandardMaterial({ color: 0xd8dde4, metalness: 0.6, roughness: 0.25, envMap: env.studio.env })); car.position.set(-6 + i * 4 + 2.2, 0.8, -i * 3); scene.add(car);
    }
    const sparks = pointsCloud(300, 5, (t, s) => { const life = (t * 2 + s[0]) % 1, a = s[1] * 6.28; return [arms[1].g.position.x + 2.0 + Math.cos(a) * life * 1.5, 1.6 + life * 1.2 - life * life * 3, arms[1].g.position.z + Math.sin(a) * life * 1.5]; }, { size: 0.06, color: 0xffd080, map: softDot() });
    sparks.material.color.setRGB(6, 4, 1.5); scene.add(sparks);
    const c = cam(40, 0.1, 500);
    return { scene, camera: c, look: { ...techLook, exposure: 0.9, focus: 17, focusRange: 10, dof: 0.5, bloomThr: 1.2 },
      update(lt, t) { arms.forEach((a) => { a.j1.rotation.y = Math.sin(t * 1.4 + a.ph) * 0.8; a.j1.rotation.z = Math.sin(t * 1.1 + a.ph) * 0.25; a.j2.rotation.z = -0.4 + Math.sin(t * 1.7 + a.ph) * 0.35; }); sparks.update(t);
        path(c, lt, [[0, V3(-16, 4.2, 14), V3(-1, 1.2, -4)], [1.25, V3(-14, 4.4, 12.5), V3(0, 1.2, -4)]]); } };
  }, 0.2);

  /* ---- renewables: solar farm and wind ---- */
  add(72.8, 77.35, () => {
    const w = morningWorld(260); A.setEnv(env.day);
    w.scene.add(A.steppe(8000, 72, { color: [120, 125, 80], amp: 0 }));
    const solar = A.solarField(26, 22, 3, env.day); w.scene.add(solar);
    const tbs = []; const r = rng(73);
    for (let i = 0; i < 14; i++) { const t = A.turbine(95); t.position.set(-700 + i * 120 + r() * 40, 0, -420 - (i % 3) * 180); t.rotation.y = 0.4; w.scene.add(t); tbs.push(t); }
    const c = cam(42, 1, 40000);
    return { scene: w.scene, camera: c, look: { ...techLook, temp: 0.15, sat: 1.05, focus: 300, focusRange: 300, dof: 0.3, rays: 0.14, flare: 0.20, bloom: 0.5, bloomThr: 1.1 },
      update(lt, t) { A.setEnv(env.day); tbs.forEach((tb, i) => (tb.userData.rotor.rotation.z = t * 1.2 + i));
        path(c, lt, [[0, V3(-90, 22, 130), V3(0, 2, -60)], [4.55, V3(30, 48, 60), V3(-60, 40, -520)]]); this.sunWorld = c.position.clone().addScaledVector(morningSun, 20000); } };
  }, 0.35);

  /* ---- young people overlooking the city (golden light) ---- */
  const youthCity = () => {
    const w = astanaGolden(); A.setEnv(env.sunset);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(30, 120, 60), A.towerMat("glass", false, 21)); roof.position.set(1320, 60, 120); w.scene.add(roof);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(30.5, 0.6, 60.5), new THREE.MeshLambertMaterial({ color: 0x3a3e46 })); deck.position.set(1320, 120.3, 120); w.scene.add(deck);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 60), new THREE.MeshPhongMaterial({ color: 0x9fb8d0, transparent: true, opacity: 0.35 })); rail.position.set(1305.2, 121.2, 120); w.scene.add(rail);
    const crew = new THREE.Group(); crew.position.set(1307.5, 120.6, 120); crew.rotation.y = Math.PI / 2; w.scene.add(crew);
    const roles = [["engineer", 1.8, false], ["coder", 1.72, true], ["scientist", 1.66, false], ["founder", 1.78, false]];
    roles.forEach(([kind, h, bag], i) => { const p = A.person(300 + i, { height: h, hair: kind === "scientist" ? "long" : "short", bag }); p.position.set(-3.6 + i * 2.4, 0, 0); p.rotation.y = (i - 1.5) * 0.06; crew.add(p);
      if (kind === "engineer") { const hat = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xf0b020 })); hat.position.set(p.position.x, 1.86 * h / 1.75, 0); hat.scale.set(1.15, 0.8, 1.2); crew.add(hat); }
      if (kind === "coder") { const lap = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.25), A.M.dark); lap.position.set(p.position.x + 0.22, 1.1, -0.2); crew.add(lap); } });
    return { ...w, crew };
  };
  add(77.3, 83.35, () => {
    const w = youthCity(), c = cam(34, 0.3, 60000), cp = w.crew.position;
    return { scene: w.scene, camera: c, look: { ...goldenLook, temp: 0.4, exposure: 0.95, focus: 9, focusRange: 8, dof: 0.8, rays: 0.39, flare: 0.40, raysThr: 1.0, bloom: 0.6 },
      update(lt, t) { A.setEnv(env.sunset); w.water.material.uniforms.time.value = t;
        path(c, lt, [[0, cp.clone().add(V3(11, 1.2, 2.0)), cp.clone().add(V3(-60, -2, -2))], [6.05, cp.clone().add(V3(8.5, 1.5, -1.0)), cp.clone().add(V3(-60, -1, 1))]]);
        this.sunWorld = c.position.clone().addScaledVector(w.sunDir, 20000); } };
  }, 0.4);
  add(83.3, 86.85, () => {
    const w = youthCity(), c = cam(30, 0.3, 60000), cp = w.crew.position;
    return { scene: w.scene, camera: c, look: { ...goldenLook, temp: 0.4, exposure: 0.95, focus: 3.5, focusRange: 6, dof: 0.35, rays: 0.55, flare: 0.50, raysThr: 0.9, bloom: 0.7, exposure: 1.15 },
      update(lt) { A.setEnv(env.sunset); const k = ease.inOut(clamp(lt / 3.55, 0, 1)); const tgt = cp.clone().add(V3(0, 1.55, -1.2));
        c.position.copy(tgt.clone().add(V3(lerp(5.5, 2.4, k), lerp(-0.2, 0.0, k), lerp(-0.6, -0.2, k)))); c.lookAt(tgt.clone().add(V3(-30, 0, 0)));
        this.sunWorld = c.position.clone().addScaledVector(w.sunDir, 20000); } };
  }, 0.35);

  /* ---- FINALE · Astana at sunrise from the west, along the boulevard; the flag; the golden 35 ---- */
  const sunrise = sunVec(4.5, 98);
  const finaleLook = { exposure: 0.95, temp: 0.12, tint: -0.02, sat: 0.95, contrast: 1.1, lift: [0.0, 0.008, 0.022], gain: [1.03, 1.0, 0.96], shadowTint: [-0.005, 0.01, 0.04], highTint: [0.05, 0.025, 0.0], vignette: 0.42, grain: 0.035, bloom: 0.55, bloomThr: 1.05, rays: 0.22, raysThr: 1.35, flare: 0.40, halation: 0 };
  // final vantage: west of the city, looking east along the boulevard into the sunrise
  const FC = V3(-1760, 250, 230), FT = V3(0, 60, 0);
  const FF = FT.clone().sub(FC).normalize(), FL = new THREE.Vector3().crossVectors(V3(0, 1, 0), FF).normalize();
  const POLE = FC.clone().addScaledVector(FF, 150).addScaledVector(FL, 34).setY(0);
  const finaleWorld = () => {
    A.setEnv(env.sunrise);
    const w = world({ envm: ENV.sunrise, sun: sunrise, sunColor: 0xffc684, sunI: 3.0, hemiSky: 0x8fb0e0, hemiGround: 0x2a2a30, hemiI: 1.0, fog: 0xd9c4a6, fogD: 0.0001, shadow: 1300, shadowCenter: V3(-300, 0, 0),
      sky: { zenith: 0x1a4a96, horizon: 0xffcf96, sunColor: 0xffc684, sunInt: 24, halo: 1.6, cloudCover: 0.4, cloudLit: 0xffd2a8, cloudDark: 0x5a6a90, haze: 0.08 } });
    const city = A.astanaCity({ night: false, seed: 35 }); w.scene.add(city);
    const water = makeWater([520, 9000], { normals: ctx.waterNormals, color: new THREE.Color(0.04, 0.07, 0.11), sunDir: sunrise, sunColor: new THREE.Color(1.0, 0.7, 0.45), skyColor: new THREE.Color(0.75, 0.6, 0.5) }); water.position.set(city.userData.riverX, 0.4, 0); w.scene.add(water);
    const mist = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), new THREE.MeshBasicMaterial({ map: noiseTex(8, 256, [255, 225, 200], 120, [5, 5]), transparent: true, opacity: 0.12, depthWrite: false, color: 0xffd8b8 })); mist.rotation.x = -Math.PI / 2; mist.position.y = 22; w.scene.add(mist);
    const pole = A.flagPole(270); pole.position.copy(POLE); w.scene.add(pole);
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(9, 11, 3, 32), A.M.granite); plinth.position.copy(POLE).add(V3(0, 1.5, 0)); w.scene.add(plinth);
    const flag = new ClothFlag({ width: 40, height: 20, nx: 40, ny: 20, texture: flagTexture(), material: flagMat(flagTexture()), windDir: FL.clone().negate().add(V3(0, 0, 0)).normalize(), wind: 12, seed: 2026 }); w.scene.add(flag.mesh);
    flag.mesh.material.envMap = env.sunrise.env;
    const anchor = () => V3(POLE.x, 268.5, POLE.z).addScaledVector(FL, -1.0);
    return { ...w, city, water, mist, flag, anchor };
  };
  add(86.4, 96.05, () => {
    const w = finaleWorld(), c = cam(46, 1, 60000);
    return { scene: w.scene, camera: c, look: { ...finaleLook, focus: 200, focusRange: 500, dof: 0.6 },
      update(lt, t) { A.setEnv(env.sunrise); w.flag.at(t, 86.4, w.anchor); w.water.material.uniforms.time.value = t; w.mist.position.x = t * 4;
        path(c, lt, [[0, FC.clone().addScaledVector(FF, 60).add(V3(0, -40, 0)), POLE.clone().setY(250)], [4.0, FC.clone().addScaledVector(FF, 10).add(V3(0, -10, 0)), FT.clone().lerp(POLE.clone().setY(250), 0.5)], [9.65, FC.clone().addScaledVector(FF, -20), FT.clone().lerp(POLE.clone().setY(200), 0.18)]]);
        this.sunWorld = c.position.clone().addScaledVector(sunrise, 20000); } };
  }, 0.6);
  add(96.0, 98.75, () => {
    const w = finaleWorld(), c = cam(32, 0.3, 60000);
    const hill = new THREE.Mesh(new THREE.SphereGeometry(80, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ map: noiseTex(97, 128, [120, 110, 80], 25, [8, 8]) })); hill.scale.y = 0.18; hill.position.set(-2950, 0, -200); w.scene.add(hill);
    const crew = new THREE.Group(); crew.position.set(-2930, 14.2, -200); crew.rotation.y = Math.PI / 2 + 0.1; w.scene.add(crew);
    [[-2.4, 1.72, "short", false, 0], [-0.8, 1.64, "long", false, 0], [0.8, 1.8, "short", true, 0.9], [2.4, 1.68, "long", false, 0]].forEach(([x, h, hair, bag, raise], i) => { const p = A.person(400 + i, { height: h, hair, bag, raise }); p.position.set(x, 0, 0); p.rotation.y = (i - 1.5) * 0.08; crew.add(p); });
    return { scene: w.scene, camera: c, look: { ...finaleLook, focus: 10, focusRange: 12, dof: 0.45, rays: 0.18, flare: 0.35 },
      update(lt, t) { A.setEnv(env.sunrise); w.flag.at(t, 96.0, w.anchor); w.water.material.uniforms.time.value = t;
        const cp = crew.position; path(c, lt, [[0, cp.clone().add(V3(-10, 0.6, 3)), cp.clone().add(V3(300, 30, -10))], [2.75, cp.clone().add(V3(-8.5, 1.0, 1.5)), cp.clone().add(V3(300, 34, 0))]]);
        this.sunWorld = c.position.clone().addScaledVector(sunrise, 20000); } };
  }, 0.35);
  add(98.6, 109.0, () => {
    const w = finaleWorld(), c = cam(44, 1, 60000);
    const n35 = goldGlyphs(SVGLoader, GLYPHS.n35, { size: 34, depth: 7, bevel: 1.3, material: A.M.gold }); w.scene.add(n35);
    const sparkle = pointsCloud(500, 35, (t, s) => { const life = (t * 0.1 + s[0]) % 1; return [n35.position.x + (s[1] - 0.5) * 60, n35.position.y - 40 + life * 110, n35.position.z + (s[2] - 0.5) * 160]; }, { size: 1.3, color: 0xffd27a, map: softDot() });
    sparkle.material.color.setRGB(4, 3, 1.4); w.scene.add(sparkle);
    const glint = new THREE.PointLight(0xffe2b0, 12000, 500, 1.8); w.scene.add(glint);
    return { scene: w.scene, camera: c, look: { ...finaleLook, focus: 150, focusRange: 120, dof: 0.6, bloom: 0.7 },
      update(lt, t) { A.setEnv(env.sunrise); w.flag.at(t, 98.6, w.anchor); w.water.material.uniforms.time.value = t; w.mist.position.x = t * 4;
        const k = ease.inOut(clamp(lt / 10.4, 0, 1));
        c.position.copy(FC).addScaledVector(FF, lerp(-20, 10, k)).add(V3(0, lerp(0, 6, k), 0)); c.lookAt(FT.clone().lerp(POLE.clone().setY(200), 0.18).add(V3(0, lerp(10, 20, k), 0)));
        const fwd = new THREE.Vector3(); c.getWorldDirection(fwd);
        const k35 = ease.out(clamp((lt - 0.15) / 1.7, 0, 1));
        n35.position.copy(c.position).addScaledVector(fwd, 140).add(V3(0, lerp(-70, 12, k35), 0));
        n35.quaternion.copy(c.quaternion); n35.rotateY(lerp(-1.0, 0.0, k35) + Math.sin(t * 0.4) * 0.03);
        glint.position.copy(n35.position).add(V3(80, 60, -60));
        sparkle.update(t); sparkle.visible = lt > 0.5;
        this.sunWorld = c.position.clone().addScaledVector(sunrise, 20000);
      } };
  }, 0.3);
  return S;
}
