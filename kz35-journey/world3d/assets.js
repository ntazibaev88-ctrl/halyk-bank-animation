// 3D models for the film. Units are metres. Every random choice is seeded.
import { THREE, rng, canvasTex, facadeTex, noiseTex, lerp, clamp } from "./engine.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const M = {}; // shared materials, filled by initMaterials
export function initMaterials(env) {
  M.white = new THREE.MeshLambertMaterial({ color: 0xeef1f4 });
  M.concrete = new THREE.MeshLambertMaterial({ color: 0xbfc4c8 });
  M.dark = new THREE.MeshLambertMaterial({ color: 0x2a2f38 });
  M.steel = new THREE.MeshPhongMaterial({ color: 0x8c949e, shininess: 60, specular: 0x777777, envMap: env.cube, reflectivity: 0.25, combine: THREE.MixOperation });
  M.rust = new THREE.MeshLambertMaterial({ color: 0x5a4636 });
  M.gold = new THREE.MeshStandardMaterial({ color: 0xf3c35a, metalness: 1.0, roughness: 0.22, envMap: env.env, envMapIntensity: 1.2 });
  M.goldGlass = new THREE.MeshStandardMaterial({ color: 0xffbf47, metalness: 0.9, roughness: 0.1, envMap: env.env, envMapIntensity: 1.4, emissive: 0x3a2200 });
  M.glassBlue = new THREE.MeshPhongMaterial({ color: 0x6f93b8, specular: 0xbbccdd, shininess: 120, envMap: env.cube, reflectivity: 0.55, combine: THREE.MixOperation });
  M.domeBlue = new THREE.MeshPhongMaterial({ color: 0x2f7fd0, specular: 0x99bbee, shininess: 90, envMap: env.cube, reflectivity: 0.3, combine: THREE.MixOperation });
  M.tent = new THREE.MeshPhongMaterial({ color: 0xdfe6ee, specular: 0x8899aa, shininess: 40, transparent: true, opacity: 0.92, envMap: env.cube, reflectivity: 0.2, combine: THREE.MixOperation });
  M.granite = new THREE.MeshLambertMaterial({ color: 0xd9d2c5 });
  M.grass = new THREE.MeshLambertMaterial({ color: 0x6c7a3c });
  M.road = new THREE.MeshLambertMaterial({ color: 0x2b2d31 });
  M.tree = new THREE.MeshLambertMaterial({ color: 0x3d5a2a });
  M.person = new THREE.MeshLambertMaterial({ color: 0x07080b });
}
export function setEnv(env) { // swap reflections when a shot changes sky
  for (const k of ["steel", "glassBlue", "domeBlue", "tent"]) M[k].envMap = env.cube;
  for (const k of ["gold", "goldGlass"]) M[k].envMap = env.env;
}

/* ---------- Baiterek: white lattice trunk, branch crown, golden sphere (≈105 m) ---------- */
export function baiterek() {
  const g = new THREE.Group();
  const prof = (y) => { // radius of the lattice at height y
    if (y < 8) return 9 - y * 0.25;
    if (y < 62) return lerp(7, 3.2, (y - 8) / 54);
    if (y < 74) return lerp(3.2, 6, (y - 62) / 12);
    return lerp(6, 13.5, Math.pow((y - 74) / 12, 0.8));
  };
  const ribs = [];
  const N = 28;
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2, pts = [];
    for (let y = 0; y <= 86; y += 4) { const a = a0 + y * 0.004 * (i % 2 ? 1 : -1); const r = prof(y); pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); }
    ribs.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.55, 5, false));
  }
  g.add(new THREE.Mesh(mergeGeometries(ribs), M.white));
  const core = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 4.5, 70, 16), M.white); core.position.y = 35; g.add(core);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(16, 18, 4, 40), M.granite); base.position.y = 2; g.add(base);
  const cradle = new THREE.Mesh(new THREE.TorusGeometry(12.6, 0.6, 6, 48), M.white); cradle.rotation.x = Math.PI / 2; cradle.position.y = 85; g.add(cradle);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(11, 48, 32), M.goldGlass); sphere.position.y = 95; g.add(sphere);
  g.userData.sphere = sphere;
  return g;
}
/* ---------- Khan Shatyr: tilted tent (≈150 m) ---------- */
export function khanShatyr() {
  const g = new THREE.Group();
  const geo = new THREE.ConeGeometry(95, 150, 64, 12, true);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) + 75, k = y / 150; p.setX(i, p.getX(i) * (1 + 0.22 * Math.cos(Math.atan2(p.getZ(i), p.getX(i)) * 2) * (1 - k)) + k * k * 22); p.setY(i, y); p.setZ(i, p.getZ(i) * 0.8); }
  geo.computeVertexNormals();
  const tex = canvasTex(256, 512, (c, w, h) => { c.fillStyle = "#e7edf3"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(90,110,130,.45)"; c.lineWidth = 2; for (let x = 0; x < w; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += 22) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } });
  const mat = M.tent.clone(); mat.map = tex; mat.side = THREE.DoubleSide;
  g.add(new THREE.Mesh(geo, mat));
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.2, 40, 8), M.steel); mast.position.set(24, 165, 0); mast.rotation.z = -0.18; g.add(mast);
  return g;
}
/* ---------- Palace of Peace and Reconciliation: pyramid 62 m ---------- */
export function pyramid() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(62 / Math.SQRT2, 62, 4, 1), M.granite); body.rotation.y = Math.PI / 4; body.position.y = 31; g.add(body);
  const apexMat = new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0x7a4a10, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.2 });
  const apex = new THREE.Mesh(new THREE.ConeGeometry((62 / Math.SQRT2) * 0.24, 62 * 0.24, 4, 1), apexMat); apex.rotation.y = Math.PI / 4; apex.position.y = 62 - 62 * 0.12 + 0.05; g.add(apex);
  return g;
}
/* ---------- Ak Orda: presidential palace with blue dome and gold spire ---------- */
export function akOrda() {
  const g = new THREE.Group();
  const wall = facadeTex(31, { cols: 18, rows: 6, wall: "#eef0f2", glass: "#7f95ad", frame: "#ffffff" });
  const bm = new THREE.MeshLambertMaterial({ map: wall });
  const main = new THREE.Mesh(new THREE.BoxGeometry(110, 26, 60), bm); main.position.y = 13; g.add(main);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(40, 32, 40), bm); wing.position.y = 16; g.add(wing);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 12, 40), M.white); drum.position.y = 38; g.add(drum);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(13.5, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), M.domeBlue); dome.position.y = 44; g.add(dome);
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.9, 26, 8), M.gold); spire.position.y = 70; g.add(spire);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 12), M.gold); ball.position.y = 60; g.add(ball);
  for (let i = 0; i < 10; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 22, 10), M.white); c.position.set(-27 + i * 6, 11, 31); g.add(c); }
  return g;
}
/* ---------- Hazret Sultan mosque ---------- */
export function mosque() {
  const g = new THREE.Group();
  const hall = new THREE.Mesh(new THREE.BoxGeometry(80, 22, 80), M.white); hall.position.y = 11; g.add(hall);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(26, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), M.white); dome.position.y = 22; dome.scale.y = 1.25; g.add(dome);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.2, 10, 8), M.gold); tip.position.y = 58; g.add(tip);
  for (const [x, z] of [[-46, -46], [46, -46], [-46, 46], [46, 46]]) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.8, 70, 12), M.white); m.position.set(x, 35, z); g.add(m);
    const t = new THREE.Mesh(new THREE.ConeGeometry(2.6, 9, 12), M.gold); t.position.set(x, 74.5, z); g.add(t);
  }
  for (const [x, z] of [[-30, 0], [30, 0], [0, -30], [0, 30]]) { const d = new THREE.Mesh(new THREE.SphereGeometry(8, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.white); d.position.set(x, 22, z); g.add(d); }
  return g;
}
/* ---------- Nur Alem (EXPO-2017 sphere, ≈80 m) ---------- */
export function nurAlem(night = false) {
  const g = new THREE.Group();
  const grid = canvasTex(1024, 512, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    if (night) { gr.addColorStop(0, "#0d2a52"); gr.addColorStop(0.5, "#123b6e"); gr.addColorStop(1, "#0a2244"); } else { gr.addColorStop(0, "#5d7c9a"); gr.addColorStop(1, "#3a5876"); }
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    const r = rng(80);
    for (let j = 0; j < 32; j++) for (let i = 0; i < 128; i++) { const v = r(); if (v < 0.08 && night) { c.fillStyle = "rgba(255,226,170,.55)"; c.fillRect(i * 8 + 1, j * 16 + 1, 6, 14); } else if (v < 0.4) { c.fillStyle = night ? "rgba(120,190,255,.10)" : "rgba(220,235,250,.18)"; c.fillRect(i * 8 + 1, j * 16 + 1, 6, 14); } }
    c.strokeStyle = night ? "rgba(140,220,255,.22)" : "rgba(235,242,248,.35)"; c.lineWidth = 1;
    for (let i = 0; i <= 128; i++) { c.beginPath(); c.moveTo(i * 8, 0); c.lineTo(i * 8, h); c.stroke(); }
    for (let j = 0; j <= 32; j++) { c.beginPath(); c.moveTo(0, j * 16); c.lineTo(w, j * 16); c.stroke(); }
  });
  const mat = new THREE.MeshPhongMaterial({ map: grid, emissive: night ? 0xffffff : 0x000000, emissiveMap: night ? grid : null, emissiveIntensity: night ? 0.6 : 0, specular: 0xccddee, shininess: 120, envMap: M.glassBlue.envMap, reflectivity: night ? 0.15 : 0.45, combine: THREE.MixOperation });
  const s = new THREE.Mesh(new THREE.SphereGeometry(40, 64, 32), mat); s.position.y = 48; g.add(s);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(22, 26, 10, 32), M.concrete); base.position.y = 5; g.add(base);
  const tb = [];
  for (const x of [-9, 9]) { const t = turbine(26); t.position.set(x, 86, 0); t.scale.setScalar(0.6); g.add(t); tb.push(t); }
  g.userData.turbines = tb; g.userData.sphere = s;
  return g;
}
/* ---------- generic towers ---------- */
const facCache = {};
export function towerMat(kind, night, seed) {
  const key = kind + night + (seed % 6);
  if (facCache[key]) return facCache[key];
  const pal = night
    ? { glass: ["#1a2433", "#0d1726"], res: ["#2a2a2e", "#14181f"], gold: ["#2e2618", "#151410"], old: ["#2a2824", "#14161a"], green: ["#16241f", "#0b1714"] }[kind]
    : { glass: ["#8fa3b8", "#26405e"], res: ["#d2c7b2", "#3e4f66"], gold: ["#c9ad7e", "#5a4a30"], old: ["#b8b0a2", "#3f4a58"], green: ["#93a8a2", "#1f4a48"] }[kind];
  const lay = { cols: kind === "glass" ? 10 : 8, rows: kind === "old" ? 10 : 28, wall: pal[0], glass: pal[1], band: kind !== "glass" };
  const tex = facadeTex(seed % 6 + 1, lay);
  const em = night ? facadeTex(seed % 6 + 11, { ...lay, lit: kind === "res" ? 0.35 : 0.22, emissiveOnly: true }) : null;
  const m = kind === "glass" || kind === "green" || kind === "gold"
    ? new THREE.MeshPhongMaterial({ map: tex, emissive: night ? 0xffffff : 0, emissiveMap: em, emissiveIntensity: night ? 1.6 : 0, specular: 0x6a7a8a, shininess: 90, envMap: M.glassBlue.envMap, reflectivity: night ? 0.3 : 0.45, combine: THREE.MixOperation })
    : new THREE.MeshLambertMaterial({ map: tex, emissive: night ? 0xffffff : 0, emissiveMap: em, emissiveIntensity: night ? 1.4 : 0 });
  if (em) { em.wrapS = em.wrapT = THREE.RepeatWrapping; }
  facCache[key] = m; return m;
}
export function tower(w, d, h, mat, crown) {
  h = h;
  const g = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d); geo.translate(0, h / 2, 0);
  const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * Math.max(1, w / 30), uv.getY(i) * Math.max(1, h / 90));
  mat.map && (mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping);
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; g.add(m);
  if (h > 90 && (Math.floor(w * 7 + h) % 3) !== 0) { // setback crown section
    const h2 = h * 0.22, g2 = new THREE.BoxGeometry(w * 0.72, h2, d * 0.72); g2.translate(0, h + h2 / 2, 0);
    const u2 = g2.attributes.uv; for (let i = 0; i < u2.count; i++) u2.setXY(i, u2.getX(i) * Math.max(1, w * 0.72 / 30), u2.getY(i) * Math.max(1, h2 / 90));
    const m2 = new THREE.Mesh(g2, mat); m2.castShadow = true; g.add(m2); h += h2;
  }
  const pod = new THREE.Mesh(new THREE.BoxGeometry(w * 1.35, 8, d * 1.35).translate(0, 4, 0), M.concrete); g.add(pod);
  if (crown === "spire") { const s = new THREE.Mesh(new THREE.ConeGeometry(w * 0.18, w * 1.6, 8), M.steel); s.position.y = h + w * 0.8; g.add(s); }
  if (crown === "slant") { const s = new THREE.Mesh(new THREE.CylinderGeometry(0, w * 0.72, w * 0.9, 4), mat); s.rotation.y = Math.PI / 4; s.position.y = h + w * 0.45; g.add(s); }
  if (crown === "cap") { const s = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, w * 0.4, d * 0.6), M.steel); s.position.y = h + w * 0.2; g.add(s); }
  return g;
}
/* ---------- Astana: landmarks + city blocks. River runs along z at x = riverX ---------- */
export function astanaCity({ night = false, seed = 35, riverX = 700, extent = 2600, merge = true } = {}) {
  const g = new THREE.Group(), r = rng(seed);
  const L = {};
  L.baiterek = baiterek(); L.baiterek.position.set(0, 0, 0); g.add(L.baiterek);
  L.khan = khanShatyr(); L.khan.position.set(-850, 0, 30); g.add(L.khan);
  L.akorda = akOrda(); L.akorda.position.set(520, 0, 0); L.akorda.rotation.y = -Math.PI / 2; g.add(L.akorda);
  L.pyramid = pyramid(); L.pyramid.position.set(riverX + 380, 0, -120); g.add(L.pyramid);
  L.mosque = mosque(); L.mosque.position.set(riverX + 420, 0, 260); g.add(L.mosque);
  L.nur = nurAlem(night); L.nur.position.set(-400, 0, 1300); g.add(L.nur);
  // Abu Dhabi Plaza and the emerald towers near the river
  const adp = tower(42, 42, 300, towerMat("glass", night, 2), "slant"); adp.position.set(330, 0, -520); g.add(adp);
  const adp2 = tower(30, 30, 210, towerMat("glass", night, 3), "slant"); adp2.position.set(390, 0, -470); g.add(adp2);
  for (let i = 0; i < 3; i++) { const t = tower(28, 28, 170 + i * 25, towerMat("green", night, 4 + i), "cap"); t.position.set(-180 + i * 60, 0, -420); g.add(t); }
  // the boulevard (Nurzhol) with lawns, fountains and trees
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(1700, 120), M.grass); lawn.rotation.x = -Math.PI / 2; lawn.position.set(-200, 0.2, 0); lawn.receiveShadow = true; g.add(lawn);
  const pathM = new THREE.MeshLambertMaterial({ color: night ? 0x5a5550 : 0xd7cfc0 });
  const path = new THREE.Mesh(new THREE.PlaneGeometry(1700, 26), pathM); path.rotation.x = -Math.PI / 2; path.position.set(-200, 0.3, 0); g.add(path);
  const treeGeo = mergeGeometries([new THREE.CylinderGeometry(0.4, 0.5, 4, 5).translate(0, 2, 0), new THREE.SphereGeometry(3.2, 7, 5).translate(0, 6, 0)]);
  const trees = new THREE.InstancedMesh(treeGeo, M.tree, 700); const mm = new THREE.Matrix4(); let ti = 0;
  for (let x = -1040; x < 640 && ti < 700; x += 14) for (const z of [-48, -36, 36, 48]) { if (ti >= 700) break; const s = 0.8 + r() * 0.5; mm.compose(new THREE.Vector3(x + r() * 4, 0, z + r() * 3), new THREE.Quaternion(), new THREE.Vector3(s, s, s)); trees.setMatrixAt(ti++, mm); }
  trees.count = ti; g.add(trees);
  // ground
  const groundTex = noiseTex(7, 256, night ? [40, 42, 46] : [150, 146, 128], 22, [60, 60]);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(extent * 3, extent * 3), new THREE.MeshLambertMaterial({ map: groundTex })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground);
  // road grid
  const roads = [];
  for (let x = -extent; x <= extent; x += 220) roads.push(new THREE.PlaneGeometry(18, extent * 2).rotateX(-Math.PI / 2).translate(x, 0.15, 0));
  for (let z = -extent; z <= extent; z += 220) if (Math.abs(z) > 80) roads.push(new THREE.PlaneGeometry(extent * 2, 18).rotateX(-Math.PI / 2).translate(0, 0.15, z));
  g.add(new THREE.Mesh(mergeGeometries(roads), M.road));
  // city blocks
  const blocks = new THREE.Group(); g.add(blocks); L.blocks = blocks;
  for (let bx = -extent; bx < extent; bx += 220) for (let bz = -extent; bz < extent; bz += 220) {
    const cx = bx + 110, cz = bz + 110;
    if (Math.abs(cz) < 140 && cx > -1100 && cx < 640) continue; // boulevard
    if (Math.abs(cx - riverX) < 230) continue; // river
    if (Math.hypot(cx + 400, cz - 1300) < 260) continue; // EXPO
    if (Math.hypot(cx - riverX - 400, cz - 70) < 330) continue; // pyramid/mosque park
    const dist = Math.hypot(cx, cz) / extent;
    const n = 2 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const w = 26 + r() * 30, d = 26 + r() * 30;
      const h = (dist < 0.35 ? 60 + r() * 140 : 25 + r() * 70) * (r() < 0.08 ? 1.8 : 1);
      const kind = h > 120 ? (r() < 0.6 ? "glass" : "gold") : "res";
      const t = tower(w, d, h, towerMat(kind, night, Math.floor(r() * 100)), h > 140 ? (r() < 0.5 ? "spire" : "slant") : null);
      t.position.set(cx + (r() - 0.5) * 150, 0, cz + (r() - 0.5) * 150);
      t.userData.h = h; t.userData.rise = r();
      blocks.add(t);
    }
  }
  if (merge) { // bake thousands of towers into a few meshes (one per material)
    blocks.updateMatrixWorld(true);
    const byMat = new Map();
    blocks.traverse((o) => { if (o.isMesh) { const gg = o.geometry.index ? o.geometry.clone() : o.geometry.clone(); gg.applyMatrix4(o.matrixWorld); for (const k of Object.keys(gg.attributes)) if (!["position", "normal", "uv"].includes(k)) gg.deleteAttribute(k); const key = o.material.uuid; if (!byMat.has(key)) byMat.set(key, { m: o.material, list: [] }); byMat.get(key).list.push(gg.index ? gg.toNonIndexed() : gg); } });
    g.remove(blocks); const merged = new THREE.Group();
    for (const { m, list } of byMat.values()) { const mm = new THREE.Mesh(mergeGeometries(list), m); mm.castShadow = true; mm.receiveShadow = true; merged.add(mm); }
    g.add(merged); L.blocks = merged;
  }
  L.riverX = riverX;
  g.userData = L;
  return g;
}

/* ---------- old Soviet panel housing (1990s) ---------- */
export function panelBlock(seed, night) {
  const tex = facadeTex(seed, { cols: 12, rows: 5, wall: "#b9b2a5", glass: "#4b5662", lit: night ? 0.55 : 0, litColor: "#ffcf80", frame: "#a59c8c", band: true });
  const mat = new THREE.MeshLambertMaterial({ map: tex, emissive: night ? 0xffffff : 0, emissiveMap: night ? tex : null, emissiveIntensity: night ? 0.7 : 0 });
  const geo = new THREE.BoxGeometry(70, 15, 12); geo.translate(0, 7.5, 0);
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
  return m;
}

/* ---------- industry ---------- */
export function pumpjack() {
  const g = new THREE.Group(), body = new THREE.MeshLambertMaterial({ color: 0x2c3138 }), accent = new THREE.MeshLambertMaterial({ color: 0xb8892f });
  const base = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 3), M.concrete); base.position.y = 0.4; g.add(base);
  for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.4, 0.4), body); leg.position.set(0, 4.2, s * 1.1); leg.rotation.x = s * 0.14; g.add(leg); }
  const beam = new THREE.Group(); beam.position.set(0, 7.6, 0); g.add(beam);
  const bm = new THREE.Mesh(new THREE.BoxGeometry(11, 0.8, 0.7), body); bm.position.x = -0.5; beam.add(bm);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.9, 16, 1, false, -Math.PI / 2.5, Math.PI / 1.25), accent); head.rotation.x = Math.PI / 2; head.position.set(-5.8, -0.6, 0); beam.add(head);
  const crank = new THREE.Group(); crank.position.set(4.2, 2.6, 0); g.add(crank);
  const cw = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 0.6), accent); cw.position.set(1.0, 0, 1.0); crank.add(cw);
  const cw2 = cw.clone(); cw2.position.z = -1.0; crank.add(cw2);
  const gear = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 1.4), body); gear.position.set(5.6, 1.6, 0); g.add(gear);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6, 4), M.steel); rod.position.set(-6.6, 3.5, 0); g.add(rod);
  const well = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.2, 8), M.steel); well.position.set(-6.6, 0.6, 0); g.add(well);
  g.userData = { beam, crank };
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}
export function refinery(seed = 3) {
  const g = new THREE.Group(), r = rng(seed);
  const tankM = new THREE.MeshPhongMaterial({ color: 0xd8dde2, specular: 0x555555, shininess: 30 });
  for (let i = 0; i < 7; i++) { const t = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 16, 28), tankM); t.position.set(-120 + i * 34, 8, 60 + (i % 2) * 34); t.castShadow = true; g.add(t); }
  for (let i = 0; i < 5; i++) {
    const h = 40 + r() * 35, rad = 2.5 + r() * 2;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h, 16), M.steel); col.position.set(-40 + i * 16, h / 2, -20); col.castShadow = true; g.add(col);
    for (let y = 8; y < h; y += 9) { const ring = new THREE.Mesh(new THREE.TorusGeometry(rad + 1.2, 0.25, 4, 16), M.dark); ring.rotation.x = Math.PI / 2; ring.position.set(-40 + i * 16, y, -20); g.add(ring); }
  }
  for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 160, 8), M.steel); p.rotation.z = Math.PI / 2; p.position.set(-30, 4 + i * 2.2, 10 + i * 3); g.add(p); }
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 70, 10), M.steel); stack.position.set(70, 35, -40); g.add(stack);
  const flameM = new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  flameM.color.multiplyScalar(4);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(2.4, 12, 12, 1, true), flameM); flame.position.set(70, 76, -40); g.add(flame);
  g.userData = { flame };
  return g;
}
export function turbine(h = 90) {
  const g = new THREE.Group();
  const tw = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.012, h * 0.03, h, 14), M.white); tw.position.y = h / 2; tw.castShadow = true; g.add(tw);
  const nac = new THREE.Mesh(new THREE.BoxGeometry(h * 0.04, h * 0.04, h * 0.1), M.white); nac.position.set(0, h, -h * 0.02); g.add(nac);
  const rotor = new THREE.Group(); rotor.position.set(0, h, h * 0.04); g.add(rotor);
  const bladeGeo = new THREE.BufferGeometry();
  const L = h * 0.55, pts = [0, 0, 0, h * 0.035, L * 0.18, 0, h * 0.01, L, 0, -h * 0.012, L * 0.25, 0];
  bladeGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); bladeGeo.setIndex([0, 1, 2, 0, 2, 3]); bladeGeo.computeVertexNormals();
  const bm = M.white.clone(); bm.side = THREE.DoubleSide;
  for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(bladeGeo, bm); b.rotation.z = (i * Math.PI * 2) / 3; rotor.add(b); }
  const hub = new THREE.Mesh(new THREE.SphereGeometry(h * 0.025, 10, 8), M.white); rotor.add(hub);
  g.userData.rotor = rotor;
  return g;
}
export function solarField(rows, cols, seed, env) {
  const tex = canvasTex(128, 64, (c, w, h) => { c.fillStyle = "#13305a"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(170,200,230,.55)"; c.lineWidth = 1; for (let x = 0; x <= w; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y <= h; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } });
  const mat = new THREE.MeshPhongMaterial({ map: tex, specular: 0xffffff, shininess: 200, envMap: env.cube, reflectivity: 0.5, combine: THREE.MixOperation });
  const geo = new THREE.BoxGeometry(10, 0.15, 4.2);
  const im = new THREE.InstancedMesh(geo, mat, rows * cols); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, 0, 0));
  let k = 0; for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { m4.compose(new THREE.Vector3(j * 11 - cols * 5.5, 1.8, i * 7 - rows * 3.5), q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(k++, m4); }
  im.receiveShadow = true; im.castShadow = true;
  const legs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 1.8, 0.2).translate(0, 0.9, 0), M.steel, rows * cols); k = 0;
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { m4.makeTranslation(j * 11 - cols * 5.5, 0, i * 7 - rows * 3.5); legs.setMatrixAt(k++, m4); }
  const g = new THREE.Group(); g.add(im, legs); return g;
}
/* wheat: instanced crossed cards with an alpha texture; wind sways in the vertex shader */
export function wheatField(n, size, seed) {
  const tex = canvasTex(128, 256, (c, w, h) => {
    const r = rng(seed);
    for (let k = 0; k < 9; k++) {
      const x = 10 + r() * 108, top = 20 + r() * 60;
      c.strokeStyle = `rgb(${200 + r() * 40},${150 + r() * 30},${60 + r() * 20})`; c.lineWidth = 2.2;
      c.beginPath(); c.moveTo(x, h); c.quadraticCurveTo(x + (r() - 0.5) * 20, (h + top) / 2, x + (r() - 0.5) * 10, top + 40); c.stroke();
      for (let s = 0; s < 9; s++) { c.fillStyle = `rgb(${225 + r() * 30},${175 + r() * 35},${80 + r() * 30})`; c.beginPath(); c.ellipse(x + (s % 2 ? 3 : -3), top + s * 5, 3, 6, s % 2 ? 0.4 : -0.4, 0, Math.PI * 2); c.fill(); }
    }
  }, true);
  const card = (rot) => new THREE.PlaneGeometry(1.4, 1.3).translate(0, 0.65, 0).rotateY(rot);
  const geo = mergeGeometries([card(0), card(Math.PI / 3), card(-Math.PI / 3)]);
  const mat = new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.45, side: THREE.DoubleSide });
  const uni = { uTime: { value: 0 } };
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uni.uTime;
    sh.vertexShader = "uniform float uTime;\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      vec4 wp = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
      float wave = sin(wp.x * 0.08 + uTime * 2.2) * 0.6 + sin(wp.z * 0.13 + uTime * 1.3 + wp.x * 0.02) * 0.4;
      transformed.x += wave * 0.35 * position.y; transformed.z += wave * 0.12 * position.y;`);
  };
  const im = new THREE.InstancedMesh(geo, mat, n), r = rng(seed + 1), m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) { const s = 0.8 + r() * 0.45; m4.compose(new THREE.Vector3((r() - 0.5) * size[0], 0, (r() - 0.5) * size[1]), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6.28), new THREE.Vector3(s, s * (0.85 + r() * 0.3), s)); im.setMatrixAt(i, m4); }
  im.userData.uni = uni;
  return im;
}
export function combine() {
  const g = new THREE.Group(), green = new THREE.MeshLambertMaterial({ color: 0x2f7d46 }), y = new THREE.MeshLambertMaterial({ color: 0xd9a531 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(5, 3.4, 8), green); body.position.set(0, 3.2, 0); g.add(body);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.4, 2.6), M.glassBlue); cab.position.set(0, 5.9, -2.2); g.add(cab);
  const header = new THREE.Mesh(new THREE.BoxGeometry(9, 1.0, 2.0), y); header.position.set(0, 1.2, -5.4); g.add(header);
  const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 8.6, 10), y); reel.rotation.z = Math.PI / 2; reel.position.set(0, 2.1, -5.6); g.add(reel);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 6, 8), green); pipe.rotation.z = 1.2; pipe.position.set(3.8, 5.2, 1); g.add(pipe);
  for (const [x, z, rr] of [[-2.6, -1.5, 1.4], [2.6, -1.5, 1.4], [-2.4, 2.8, 1.0], [2.4, 2.8, 1.0]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.8, 16), M.dark); w.rotation.z = Math.PI / 2; w.position.set(x, rr, z); g.add(w); }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData.reel = reel;
  return g;
}
export function train(wagons = 30, seed = 4) {
  const g = new THREE.Group(), r = rng(seed), cols = [0x9c3b2e, 0x2e6fa8, 0xc7a23a, 0x3b7d4f, 0x6b4c8a, 0x8a8f96];
  const loco = new THREE.Group();
  const lb = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4, 20), new THREE.MeshLambertMaterial({ color: 0x1f5fa8 })); lb.position.y = 3; loco.add(lb);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.5, 20.05), new THREE.MeshLambertMaterial({ color: 0xf0c040 })); stripe.position.y = 2.2; loco.add(stripe);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 5, 3) })); lamp.position.set(0, 4.2, -10.1); loco.add(lamp);
  g.add(loco);
  for (let i = 1; i <= wagons; i++) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.2, 14), new THREE.MeshLambertMaterial({ color: cols[Math.floor(r() * cols.length)] }));
    w.position.set(0, 2.6, i * 15); w.castShadow = true; g.add(w);
  }
  return g;
}
/* ---------- people (backlit silhouettes) ---------- */
export function person(seed, { height = 1.75, hair = "short", bag = false, raise = 0 } = {}) {
  const r = rng(seed), g = new THREE.Group(), m = M.person, s = height / 1.75;
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.45, 4, 10), m); torso.position.y = 1.22; torso.scale.set(1.15, 1, 0.7); g.add(torso);
  const hips = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.1, 4, 8), m); hips.position.y = 0.92; hips.scale.set(1.1, 1, 0.75); g.add(hips);
  for (const x of [-0.1, 0.1]) { const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.78, 4, 8), m); leg.position.set(x, 0.47, 0); g.add(leg); }
  for (const x of [-0.27, 0.27]) {
    const up = x > 0 && raise > 0;
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.58, 4, 8), m);
    if (up) { arm.position.set(x + 0.12, 1.62, -0.05); arm.rotation.z = -2.5 * raise; } else { arm.position.set(x, 1.08, 0); arm.rotation.z = x > 0 ? 0.08 : -0.08; }
    g.add(arm);
  }
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), m); neck.position.y = 1.58; g.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), m); head.position.y = 1.72; head.scale.set(0.9, 1.08, 1); g.add(head);
  if (hair === "long") { const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.25, 4, 8), m); h.position.set(0, 1.55, 0.06); g.add(h); }
  if (bag) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.38, 0.14), m); b.position.set(0, 1.22, 0.2); g.add(b); }
  g.scale.setScalar(s);
  return g;
}

/* ---------- terrain from the real Alatau DEM ---------- */
export async function alatauTerrain(url, { width = 60000, depth = 45000, vscale = 1.0, seg = [255, 191] } = {}) {
  const buf = await (await fetch(url)).arrayBuffer();
  const h = new Float32Array(buf), W = 512, H = 384;
  const geo = new THREE.PlaneGeometry(width, depth, seg[0], seg[1]); geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position, col = new Float32Array(p.count * 3);
  const sample = (u, v) => { const x = clamp(u * (W - 1), 0, W - 1), y = clamp(v * (H - 1), 0, H - 1); const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(W - 1, x0 + 1), y1 = Math.min(H - 1, y0 + 1), fx = x - x0, fy = y - y0; return lerp(lerp(h[y0 * W + x0], h[y0 * W + x1], fx), lerp(h[y1 * W + x0], h[y1 * W + x1], fx), fy); };
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) / width + 0.5, v = p.getZ(i) / depth + 0.5;
    const e = sample(u, v); p.setY(i, (e - 700) * vscale);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const e = p.getY(i) / vscale + 700, slope = 1 - nrm.getY(i);
    let c = e < 900 ? [0.52, 0.47, 0.33] : e < 1700 ? [0.36, 0.38, 0.22] : e < 2900 ? [0.38, 0.34, 0.3] : [0.42, 0.4, 0.4];
    if (slope > 0.35) c = [0.33, 0.3, 0.28];
    if (e > 3300 && slope < 0.55) c = [0.92, 0.94, 0.98];
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, map: noiseTex(91, 256, [200, 200, 200], 30, [40, 30]) });
  const mesh = new THREE.Mesh(geo, mat); mesh.receiveShadow = true;
  mesh.userData.heightAt = (x, z) => sample(x / width + 0.5, z / depth + 0.5) - 700;
  return mesh;
}
/* rolling steppe ground with grass texture */
export function steppe(size, seed, { color = [128, 118, 78], amp = 6 } = {}) {
  const geo = new THREE.PlaneGeometry(size, size, 160, 160); geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, amp * (Math.sin(x * 0.0021 + 1.3) * Math.cos(z * 0.0017) + 0.5 * Math.sin(x * 0.0063 + z * 0.0041))); }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: noiseTex(seed, 256, color, 26, [size / 80, size / 80]) }));
  m.receiveShadow = true;
  return m;
}
export const flagPole = (h) => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * h / 20, 0.2 * h / 20, h, 12), M.steel); p.position.y = h / 2; g.add(p); const b = new THREE.Mesh(new THREE.SphereGeometry(0.35 * h / 20, 16, 12), M.gold); b.position.y = h + 0.2; g.add(b); return g; };
