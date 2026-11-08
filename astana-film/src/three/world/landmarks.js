// Procedural models of Astana landmarks (approximate real proportions).
// Each landmark carries its completion year so the time-lapse builds them in order.
import * as THREE from 'three';
import { LM } from '../geo.js';
import { facadeMaterial } from '../materials.js';
import { smooth, clamp } from '../util.js';

const white = () => new THREE.MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.32, metalness: 0.05 });
const goldGlass = () => new THREE.MeshStandardMaterial({ color: 0xe0a43e, roughness: 0.1, metalness: 1.0, emissive: 0xffa53a, emissiveIntensity: 0 });

function withFac(geo, style, lit = 0.5, seed = 0.3) {
  const n = geo.attributes.position.count;
  const a = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) a.set([style, seed, lit, 0], i * 4);
  geo.setAttribute('aFac', new THREE.BufferAttribute(a, 4));
  return geo;
}
function facadeMesh(geo, style, color, lit = 0.5, seed = 0.3) {
  const m = new THREE.Mesh(withFac(geo, style, lit, seed), facadeMaterial({ color }));
  m.castShadow = m.receiveShadow = true;
  return m;
}
function shadow(m) { m.castShadow = true; m.receiveShadow = true; return m; }

function canvasTex(w, h, draw, repeat = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// ---------------------------------------------------------------- Baiterek (97 m)
function baiterek() {
  const g = new THREE.Group();
  const wm = white();
  // plaza with stepped rings
  const stone = new THREE.MeshStandardMaterial({ color: 0xd6d0c4, roughness: 0.6 });
  for (let i = 0; i < 3; i++) {
    const p = shadow(new THREE.Mesh(new THREE.CylinderGeometry(70 - i * 14, 70 - i * 14, 0.6, 64), stone));
    p.position.y = 0.3 + i * 0.6; g.add(p);
  }
  const pav = shadow(new THREE.Mesh(new THREE.CylinderGeometry(10, 11, 7, 32), wm)); pav.position.y = 5; g.add(pav);
  const core = shadow(new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.6, 62, 16), wm)); core.position.y = 33; g.add(core);
  // twisted lattice trunk (hyperboloid of straight members)
  const N = 22, y0 = 6, y1 = 63, r0 = 6.5, r1 = 7.5, tw = 1.9;
  const memberGeo = new THREE.CylinderGeometry(0.42, 0.42, 1, 6); memberGeo.translate(0, 0.5, 0);
  const up = new THREE.Vector3(0, 1, 0);
  for (const dir of [1, -1]) for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const A = new THREE.Vector3(Math.cos(a) * r0, y0, Math.sin(a) * r0);
    const B = new THREE.Vector3(Math.cos(a + tw * dir) * r1, y1, Math.sin(a + tw * dir) * r1);
    const m = shadow(new THREE.Mesh(memberGeo, wm));
    const d = B.clone().sub(A);
    m.position.copy(A); m.scale.set(1, d.length(), 1);
    m.quaternion.setFromUnitVectors(up, d.normalize());
    g.add(m);
  }
  // rings
  for (const y of [6, 63]) { const r = shadow(new THREE.Mesh(new THREE.TorusGeometry(y < 10 ? r0 : r1, 0.6, 6, 40), wm)); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); }
  // crown branches cradling the golden sphere
  const SY = 86, SR = 11;
  const B = 24;
  for (let i = 0; i < B; i++) {
    const a = (i / B) * Math.PI * 2;
    const tw2 = 0.55;
    const P = (r, y, k) => new THREE.Vector3(Math.cos(a + tw2 * k) * r, y, Math.sin(a + tw2 * k) * r);
    const curve = new THREE.CatmullRomCurve3([P(7, 62, 0), P(10.5, 70, 0.2), P(14.5, 78, 0.45), P(15.0, 86, 0.7), P(13.2, 93, 0.9), P(9.5, 98, 1.0)]);
    g.add(shadow(new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.5, 5), wm)));
  }
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(SR, 64, 40), goldGlass());
  sphere.position.y = SY; shadow(sphere); g.add(sphere);
  g.userData.glow = [sphere.material];
  g.userData.lit = [wm];
  return g;
}

// ---------------------------------------------------------------- Khan Shatyr (150 m tent)
function khanShatyr() {
  const g = new THREE.Group();
  const H = 150, a = 98, b = 84, P = 1.55;
  const seg = 96, rings = 60;
  const pos = [], uv = [], idx = [];
  for (let j = 0; j <= rings; j++) {
    const v = j / rings;
    const rf = Math.pow(1 - v, P);
    const tilt = 18 * v * v;
    for (let i = 0; i <= seg; i++) {
      const u = (i / seg) * Math.PI * 2;
      pos.push(Math.cos(u) * a * rf + tilt, H * v, Math.sin(u) * b * rf);
      uv.push(i / seg, v);
    }
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) {
    const p = j * (seg + 1) + i;
    idx.push(p, p + seg + 1, p + 1, p + 1, p + seg + 1, p + seg + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  const net = canvasTex(1024, 512, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f6efdc'); gr.addColorStop(1, '#e9dcc0');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(120,110,90,0.55)'; c.lineWidth = 2;
    for (let k = -40; k < 80; k++) {
      c.beginPath(); c.moveTo(k * 24, h); c.lineTo(k * 24 + 300, 0); c.stroke();
      c.beginPath(); c.moveTo(k * 24, h); c.lineTo(k * 24 - 300, 0); c.stroke();
    }
    c.strokeStyle = 'rgba(90,80,60,0.35)'; c.lineWidth = 3;
    for (let y = 0; y < h; y += 28) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  });
  const mat = new THREE.MeshStandardMaterial({ map: net, color: 0xffffff, roughness: 0.45, metalness: 0.0, emissive: 0xffd28a, emissiveMap: net, emissiveIntensity: 0, side: THREE.DoubleSide });
  const tent = shadow(new THREE.Mesh(geo, mat));
  g.add(tent);
  const mast = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.4, 34, 8), white()));
  mast.position.set(18 + 2, H + 10, 0); mast.rotation.z = -0.12; g.add(mast);
  // podium ring
  const pod = shadow(new THREE.Mesh(new THREE.CylinderGeometry(112, 116, 3, 64), new THREE.MeshStandardMaterial({ color: 0xbdb6aa, roughness: 0.7 })));
  pod.scale.z = 0.88; pod.position.y = 1.5; g.add(pod);
  g.userData.glow = [mat];
  return g;
}

// ---------------------------------------------------------------- EXPO Nur Alem (80 m sphere)
function nurAlem() {
  const g = new THREE.Group();
  const grid = canvasTex(1024, 512, (c, w, h) => {
    c.fillStyle = '#0d1a2a'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#9fb7cc'; c.lineWidth = 3;
    for (let x = 0; x <= w; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y <= h; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  });
  const glow = canvasTex(1024, 512, (c, w, h) => {
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#6fc8ff'; c.lineWidth = 2;
    for (let y = 0; y <= h; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.fillStyle = 'rgba(120,200,255,0.25)'; c.fillRect(0, h * 0.45, w, h * 0.1);
  });
  const mat = new THREE.MeshStandardMaterial({ map: grid, roughness: 0.08, metalness: 0.92, color: 0xbfd6ea, emissive: 0xffffff, emissiveMap: glow, emissiveIntensity: 0 });
  const s = shadow(new THREE.Mesh(new THREE.SphereGeometry(40, 72, 48), mat));
  s.position.y = 60; g.add(s);
  const base = shadow(new THREE.Mesh(new THREE.CylinderGeometry(22, 30, 22, 40), white())); base.position.y = 11; g.add(base);
  // EXPO pavilions ring
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = 175 + (i % 2) * 25;
    const m = facadeMesh(new THREE.BoxGeometry(70, 1, 34).translate(0, 0.5, 0), 0, 0x6f97b8, 0.4, i * 0.13);
    m.scale.y = 18 + (i % 3) * 6;
    m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); m.rotation.y = -a + Math.PI / 2;
    g.add(m);
  }
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(150, 150, 0.5, 64), new THREE.MeshStandardMaterial({ color: 0xcfcac1, roughness: 0.6 }));
  plaza.receiveShadow = true; plaza.position.y = 0.25; g.add(plaza);
  g.userData.glow = [mat];
  return g;
}

// ---------------------------------------------------------------- Ak Orda (presidential palace)
function akOrda() {
  const g = new THREE.Group();
  const stoneCol = 0xf1ede4;
  const main = facadeMesh(new THREE.BoxGeometry(64, 1, 150).translate(0, 0.5, 0), 5, stoneCol, 0.6, 0.21);
  main.scale.y = 30; g.add(main);
  const wingL = facadeMesh(new THREE.BoxGeometry(50, 1, 46).translate(0, 0.5, 0), 5, stoneCol, 0.6, 0.31);
  wingL.scale.y = 22; wingL.position.set(-4, 0, -98); g.add(wingL);
  const wingR = wingL.clone(); wingR.position.z = 98; g.add(wingR);
  const portico = facadeMesh(new THREE.BoxGeometry(14, 1, 60).translate(0, 0.5, 0), 5, stoneCol, 0.6, 0.41);
  portico.scale.y = 26; portico.position.set(-38, 0, 0); g.add(portico);
  // colonnade on the west facade
  const colGeo = new THREE.CylinderGeometry(1.1, 1.2, 22, 12); colGeo.translate(0, 11, 0);
  const wm = white();
  for (let k = -9; k <= 9; k++) { const c = shadow(new THREE.Mesh(colGeo, wm)); c.position.set(-46, 2, k * 3.2); g.add(c); }
  const pediment = shadow(new THREE.Mesh(new THREE.BoxGeometry(18, 3, 64), wm)); pediment.position.set(-40, 27.5, 0); g.add(pediment);
  // drum, blue dome with golden ribs, spire
  const drum = shadow(new THREE.Mesh(new THREE.CylinderGeometry(17, 17, 12, 48), wm)); drum.position.y = 36; g.add(drum);
  const domeMat = new THREE.MeshStandardMaterial({ color: 0x2f74c0, roughness: 0.25, metalness: 0.55 });
  const dome = shadow(new THREE.Mesh(new THREE.SphereGeometry(17, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), domeMat));
  dome.scale.y = 1.35; dome.position.y = 42; g.add(dome);
  const gold = new THREE.MeshStandardMaterial({ color: 0xe2b04a, roughness: 0.2, metalness: 1 });
  for (let i = 0; i < 16; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(17.1, 0.25, 4, 24, Math.PI / 2), gold);
    rib.rotation.set(0, (i / 16) * Math.PI * 2, Math.PI / 2); rib.scale.set(1.35, 1, 1);
    rib.position.y = 42; g.add(rib);
  }
  const spire = shadow(new THREE.Mesh(new THREE.ConeGeometry(2.2, 34, 12), gold)); spire.position.y = 42 + 17 * 1.35 + 15; g.add(spire);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), gold); ball.position.y = 42 + 23 + 2; g.add(ball);
  // forecourt
  const court = new THREE.Mesh(new THREE.BoxGeometry(140, 0.5, 220), new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 0.55 }));
  court.position.set(-80, 0.25, 0); court.receiveShadow = true; g.add(court);
  g.userData.lit = [wm];
  return g;
}

// ---------------------------------------------------------------- twin golden towers
function goldTowers() {
  const g = new THREE.Group();
  for (const s of [-1, 1]) {
    const t = facadeMesh(new THREE.CylinderGeometry(17, 17, 1, 40).translate(0, 0.5, 0), 6, 0xd4a447, 0.45, 0.5 + s * 0.1);
    t.scale.y = 112; t.position.z = s * 118; g.add(t);
    const cap = shadow(new THREE.Mesh(new THREE.CylinderGeometry(12, 17, 6, 40), new THREE.MeshStandardMaterial({ color: 0xc89838, metalness: 1, roughness: 0.2 })));
    cap.position.set(0, 115, s * 118); g.add(cap);
  }
  // House of Ministries style long white block between the towers (offset east)
  const hm = facadeMesh(new THREE.BoxGeometry(60, 1, 150).translate(0, 0.5, 0), 3, 0xe4ddcf, 0.55, 0.77);
  hm.scale.y = 40; hm.position.x = 120; g.add(hm);
  return g;
}

// ---------------------------------------------------------------- National Museum
function museum() {
  const g = new THREE.Group();
  const blocks = [[0, 0, 70, 70, 20, 5, 0xe9e4da], [-60, 40, 50, 60, 28, 0, 0x5b8fbf], [-20, 90, 46, 50, 36, 0, 0x4f84b8], [30, 120, 42, 44, 44, 0, 0x4a7fb5], [60, 30, 40, 50, 26, 5, 0xe9e4da], [90, -40, 60, 40, 18, 5, 0xe9e4da]];
  blocks.forEach(([x, z, w, d, h, st, col], i) => {
    const m = facadeMesh(new THREE.BoxGeometry(w, 1, d).translate(0, 0.5, 0), st, col, 0.5, 0.11 * i);
    m.scale.y = h; m.position.set(x, 0, z); g.add(m);
  });
  const dome = shadow(new THREE.Mesh(new THREE.SphereGeometry(16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x8fb6d8, roughness: 0.15, metalness: 0.8 })));
  dome.position.set(0, 20, 0); g.add(dome);
  return g;
}

// ---------------------------------------------------------------- Palace of Peace and Reconciliation
function pyramid() {
  const g = new THREE.Group();
  const H = 62, R = 62 / Math.SQRT2;
  const stone = new THREE.MeshStandardMaterial({ color: 0xd9d3c7, roughness: 0.5, metalness: 0.05 });
  const body = shadow(new THREE.Mesh(new THREE.CylinderGeometry(R * 0.28, R, H * 0.72, 4, 1), stone));
  body.rotation.y = Math.PI / 4; body.position.y = H * 0.36; g.add(body);
  const apexMat = new THREE.MeshStandardMaterial({ color: 0xf1d27a, roughness: 0.1, metalness: 0.6, emissive: 0xffc35a, emissiveIntensity: 0 });
  const apex = shadow(new THREE.Mesh(new THREE.ConeGeometry(R * 0.28, H * 0.28, 4), apexMat));
  apex.rotation.y = Math.PI / 4; apex.position.y = H * 0.72 + H * 0.14; g.add(apex);
  const mound = new THREE.Mesh(new THREE.CylinderGeometry(70, 95, 6, 4), new THREE.MeshStandardMaterial({ color: 0x5f7a3a, roughness: 1 }));
  mound.rotation.y = Math.PI / 4; mound.position.y = 0; mound.receiveShadow = true; g.add(mound);
  g.position.y = 3;
  g.userData.glow = [apexMat];
  return g;
}

// ---------------------------------------------------------------- Hazret Sultan mosque
function mosque() {
  const g = new THREE.Group();
  const wm = white();
  const hall = facadeMesh(new THREE.BoxGeometry(80, 1, 80).translate(0, 0.5, 0), 5, 0xf4f2ee, 0.6, 0.66);
  hall.scale.y = 22; g.add(hall);
  const drum = shadow(new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 10, 40), wm)); drum.position.y = 27; g.add(drum);
  const domeMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f2, roughness: 0.3, metalness: 0.1 });
  const dome = shadow(new THREE.Mesh(new THREE.SphereGeometry(15, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), domeMat));
  dome.scale.y = 1.25; dome.position.y = 32; g.add(dome);
  const gold = new THREE.MeshStandardMaterial({ color: 0xe2b04a, roughness: 0.2, metalness: 1 });
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.8, 7, 8), gold); fin.position.y = 54; g.add(fin);
  for (const [x, z] of [[-44, -44], [44, -44], [-44, 44], [44, 44]]) {
    const mn = shadow(new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.6, 72, 16), wm)); mn.position.set(x, 36, z); g.add(mn);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(2.3, 8, 16), gold); tip.position.set(x, 76, z); g.add(tip);
    for (const y of [40, 58]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 1.2, 16), wm); b.position.set(x, y, z); g.add(b); }
  }
  g.userData.lit = [wm];
  return g;
}

// ---------------------------------------------------------------- skyline towers
function abuDhabi() {
  const g = new THREE.Group();
  const main = facadeMesh(new THREE.CylinderGeometry(15, 27, 1, 8).translate(0, 0.5, 0), 0, 0x7f9fb8, 0.5, 0.91);
  main.scale.y = 282; g.add(main);
  const crown = shadow(new THREE.Mesh(new THREE.CylinderGeometry(4, 15, 26, 8), new THREE.MeshStandardMaterial({ color: 0xaab8c4, metalness: 0.9, roughness: 0.2 })));
  crown.position.y = 295; g.add(crown);
  const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.5, 22, 6), new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1, roughness: 0.3 }));
  needle.position.y = 318; g.add(needle);
  for (const [x, z, h, c] of [[70, 40, 150, 0x6d8ea8], [-60, 60, 170, 0x5e7f99], [10, -75, 130, 0x8aa6bb]]) {
    const t = facadeMesh(new THREE.BoxGeometry(34, 1, 30).translate(0, 0.5, 0), 0, c, 0.5, x * 0.01);
    t.scale.y = h; t.position.set(x, 0, z); g.add(t);
  }
  return g;
}
function emerald() {
  const g = new THREE.Group();
  for (const [x, z, h] of [[0, 0, 205], [62, 40, 168], [-55, 50, 150]]) {
    const t = facadeMesh(new THREE.BoxGeometry(32, 1, 32).translate(0, 0.5, 0), 0, 0x3d7d6b, 0.5, x * 0.02 + 0.3);
    t.scale.y = h; t.position.set(x, 0, z); g.add(t);
    const top = facadeMesh(new THREE.ConeGeometry(22.6, 30, 4).rotateY(Math.PI / 4).translate(0, 15, 0), 0, 0x4a9a82, 0.3, 0.7);
    top.position.set(x, h, z); g.add(top);
  }
  return g;
}
function triumph() {
  const g = new THREE.Group();
  const col = 0xd9ccb2;
  for (const [w, y0, h] of [[54, 0, 42], [36, 42, 48], [24, 90, 26], [14, 116, 10]]) {
    const m = facadeMesh(new THREE.BoxGeometry(w, 1, w).translate(0, 0.5, 0), 5, col, 0.6, w * 0.01);
    m.scale.y = h; m.position.y = y0; g.add(m);
  }
  const sp = new THREE.Mesh(new THREE.ConeGeometry(2.4, 26, 8), new THREE.MeshStandardMaterial({ color: 0xe2b04a, metalness: 1, roughness: 0.25 }));
  sp.position.y = 139; g.add(sp);
  return g;
}

export const LANDMARK_DEFS = [
  ['baiterek', baiterek, 2002],
  ['akOrda', akOrda, 2004],
  ['goldTowers', goldTowers, 2004],
  ['pyramid', pyramid, 2006],
  ['triumph', triumph, 2006],
  ['khanShatyr', khanShatyr, 2010],
  ['emerald', emerald, 2011],
  ['mosque', mosque, 2012],
  ['museum', museum, 2014],
  ['nurAlem', nurAlem, 2017],
  ['abuDhabi', abuDhabi, 2018],
];

export class Landmarks {
  constructor() {
    this.object = new THREE.Group();
    this.items = {};
    for (const [name, fn, year] of LANDMARK_DEFS) {
      const g = fn();
      const [x, z] = LM[name];
      g.position.x = x; g.position.z = z;
      if (name === 'akOrda') g.rotation.y = 0; // portico faces west, toward the boulevard
      g.userData.year = year;
      this.items[name] = g;
      this.object.add(g);
    }
  }
  update(state) {
    const y = state.year;
    for (const g of Object.values(this.items)) {
      const k = smooth(g.userData.year - 1.6, g.userData.year, y);
      g.visible = k > 0.01;
      g.scale.y = Math.max(0.001, k);
      for (const m of g.userData.glow || []) m.emissiveIntensity = (m.map && m.emissiveMap ? 0.45 : 0.7) * state.night;
      for (const m of g.userData.lit || []) { m.emissive = m.emissive || new THREE.Color(); m.emissive.setRGB(1, 0.92, 0.8); m.emissiveIntensity = 0.08 * state.night; }
    }
    const b = this.items.baiterek.userData.glow[0];
    b.emissiveIntensity = 0.05 + 0.8 * state.night + (state.baiterekGlow || 0) * 0.3;
  }
}
