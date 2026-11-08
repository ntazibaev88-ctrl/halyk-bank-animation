// Procedural city: road map texture, buildings (with construction year), cranes,
// trees, bridges and traffic. Buildings grow floor-by-floor as the "year" advances.
import * as THREE from 'three';
import { mulberry, smooth, clamp } from '../util.js';
import { CITY, riverDist, riverZ, excluded, AXIS_Z, LM } from '../geo.js';
import { facadeMaterial, groundMaterial, shared } from '../materials.js';

const TEX = 4096;
const rnd = mulberry(1997);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

// ------------------------------------------------------------ zones & grids
const ZONES = [
  // name, origin, angle, spacing, test(x,z) -> bool, kind
  { name: 'old', ox: -600, oz: -1500, a: -0.14, sx: 230, sz: 190, test: (x, z) => x > -3900 && x < 1900 && z > -4300 && z < riverZ(x) - 95, kind: 'old' },
  { name: 'left', ox: 0, oz: AXIS_Z, a: 0, sx: 255, sz: 230, test: (x, z) => x > -3900 && x < 2150 && z > riverZ(x) + 95 && z < 4300, kind: 'left' },
  { name: 'east', ox: 2400, oz: 900, a: 0.32, sx: 240, sz: 220, test: (x, z) => x > 1950 && x < 5400 && z > -2400 && z < riverZ(x) - 95, kind: 'east' },
  { name: 'southeast', ox: 3200, oz: 3000, a: 0.08, sx: 260, sz: 240, test: (x, z) => x > 2150 && x < 5400 && z > riverZ(x) + 95 && z < 4300, kind: 'left' },
];
const CBD = [
  { x0: -350, x1: 900, z0: 1420, z1: 2250 },   // left-bank business core
  { x0: -1500, x1: -350, z0: 2300, z1: 3300 }, // EXPO / AIFC district
  { x0: 300, x1: 1300, z0: -1300, z1: -500 },  // right-bank river towers
];
const inCBD = (x, z) => CBD.some((c) => x > c.x0 && x < c.x1 && z > c.z0 && z < c.z1);

function toWorld(zn, i, j) {
  const c = Math.cos(zn.a), s = Math.sin(zn.a);
  const lx = i * zn.sx, lz = j * zn.sz;
  return [zn.ox + lx * c - lz * s, zn.oz + lx * s + lz * c];
}

const COLORS = {
  res: [0xf3e6cf, 0xf0d2b4, 0xe8b99a, 0xfaf3e6, 0xd98f6f, 0xcfe0d6, 0xbcd3e6, 0xf2d58f, 0xe6c3c9, 0xd9e2b9],
  sov: [0xd8cfbd, 0xc9c0ae, 0xe0d4bc, 0xcfd2cf, 0xe6d6b8],
  glass: [0x4f8fbf, 0x3f7fa8, 0x6aa7cf, 0x4e9fa6, 0x86b4d6, 0x3a6a96, 0x9cc6dc],
  stone: [0xe8e1d3, 0xd9cfbd, 0xc8c2b6],
};

// ------------------------------------------------------------ generation
export function generateCity() {
  const roads = { modern: [], soviet: [], dirt: [], park: [] }; // segments [x0,z0,x1,z1,width]
  const buildings = []; // {boxes:[{x,z,w,d,y0,h,rot}], style, color, year, lit, kind}
  const carLanes = [];

  for (const zn of ZONES) {
    const R = 26;
    for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) {
      const [x, z] = toWorld(zn, i, j);
      const [xr, zr] = toWorld(zn, i + 1, j);
      const [xd, zd] = toWorld(zn, i, j + 1);
      const major = (i % 4 === 0) || (j % 3 === 0);
      const w = major ? 34 : 18;
      const layer = zn.kind === 'old' ? 'soviet' : 'modern';
      for (const [x2, z2] of [[xr, zr], [xd, zd]]) {
        const mx = (x + x2) / 2, mz = (z + z2) / 2;
        if (zn.test(x, z) && zn.test(x2, z2) && riverDist(mx, mz) > 100) {
          roads[layer].push([x, z, x2, z2, w]);
          if (major) carLanes.push([x, z, x2, z2]);
        }
      }
      // block inside this cell
      const [cx, cz] = toWorld(zn, i + 0.5, j + 0.5);
      if (!zn.test(cx, cz) || riverDist(cx, cz) < 170) continue;
      if (excluded(cx, cz, 40)) continue;
      const dist = Math.hypot(cx - 0, cz - 600);
      if (dist > 5600) continue;
      makeBlock(buildings, roads, zn, cx, cz, dist);
    }
  }
  // Nurzhol boulevard (linear park) + main avenue along it
  roads.park.push([-1700, AXIS_Z, 1560, AXIS_Z, 150]);
  roads.modern.push([-1750, AXIS_Z - 88, 1600, AXIS_Z - 88, 26], [-1750, AXIS_Z + 88, 1600, AXIS_Z + 88, 26]);
  carLanes.push([-1750, AXIS_Z - 88, 1600, AXIS_Z - 88], [1600, AXIS_Z + 88, -1750, AXIS_Z + 88]);
  // embankment promenades (parks along the river, modern era)
  // dirt tracks of the 1830s settlement (to the fortress and along the river)
  const [fx, fz] = LM.fortress;
  roads.dirt.push([fx - 2600, fz - 900, fx - 120, fz - 20, 9], [fx + 120, fz + 30, fx + 2400, fz - 300, 9], [fx, fz - 120, fx + 300, fz - 2600, 8], [fx - 60, fz + 120, fx - 200, fz + 420, 7]);
  return { roads, buildings, carLanes };
}

function makeBlock(buildings, roads, zn, cx, cz, dist) {
  const rot = -zn.a;
  const bw = zn.sx - 70, bd = zn.sz - 70;
  const r = rnd();
  const periphery = smooth(3600, 5200, dist);
  if (zn.kind === 'old') {
    // Tselinograd: Soviet panel slabs (1957-1990) + later infill
    const n = 2 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const along = rnd() < 0.5;
      const len = 55 + rnd() * 70, dep = 12 + rnd() * 3;
      const floors = pick([5, 5, 5, 9, 9, 4, 12]);
      const off = (k / Math.max(1, n - 1) - 0.5) * (along ? bd - 20 : bw - 20);
      const lx = along ? 0 : off, lz = along ? off : 0;
      const [x, z] = rotXZ(lx, lz, -rot, cx, cz);
      if (riverDist(x, z) < 150 || excluded(x, z, 20)) continue;
      const modernInfill = rnd() < 0.18 && dist < 3500;
      const year = modernInfill ? 2002 + rnd() * 22 : 1958 + rnd() * 30;
      const h = modernInfill ? (12 + Math.floor(rnd() * 14)) * 3.0 : floors * 2.8 + 0.8;
      buildings.push({
        boxes: [{ x, z, w: along ? len : dep, d: along ? dep : len, y0: 0, h, rot }],
        style: modernInfill ? 1 : 2, color: modernInfill ? pick(COLORS.res) : pick(COLORS.sov),
        year, lit: 0.45 + rnd() * 0.3, kind: modernInfill ? 'modern' : 'soviet',
      });
    }
    if (rnd() < 0.25) roads.park.push([cx - 30, cz, cx + 30, cz, 60]);
    return;
  }
  // left bank & east: modern
  const cbd = inCBD(cx, cz);
  const coreYear = zn.kind === 'east' ? 2003 : 1999;
  const baseYear = coreYear + clamp((dist - 600) / 3800) * 19;
  if (cbd) {
    const n = 1 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const lx = (rnd() - 0.5) * (bw - 50), lz = (rnd() - 0.5) * (bd - 50);
      const [x, z] = rotXZ(lx, lz, -rot, cx, cz);
      if (excluded(x, z, 30)) continue;
      const H = 90 + rnd() * 150, w = 28 + rnd() * 18, d = 28 + rnd() * 18;
      const style = rnd() < 0.7 ? 0 : (rnd() < 0.5 ? 3 : 6);
      const color = style === 0 ? pick(COLORS.glass) : style === 3 ? pick(COLORS.stone) : 0xc9a24a;
      const podium = 14 + rnd() * 8;
      const boxes = [
        { x, z, w: w * 1.8, d: d * 1.6, y0: 0, h: podium, rot },
        { x, z, w, d, y0: podium, h: H * 0.72 - podium, rot },
        { x, z, w: w * 0.82, d: d * 0.82, y0: H * 0.72, h: H * 0.2, rot },
        { x, z, w: w * 0.6, d: d * 0.6, y0: H * 0.92, h: H * 0.08, rot },
      ];
      buildings.push({ boxes, style, color, year: 2005 + rnd() * 19, lit: 0.5, kind: 'tower', top: rnd() < 0.4 ? { x, z, w: w * 0.6, h: 18 + rnd() * 25, y: H, rot } : null });
    }
    return;
  }
  if (periphery > 0.6 && rnd() < 0.6) {
    // private houses on the outskirts
    for (let k = 0; k < 6; k++) {
      const lx = (rnd() - 0.5) * bw, lz = (rnd() - 0.5) * bd;
      const [x, z] = rotXZ(lx, lz, -rot, cx, cz);
      if (riverDist(x, z) < 160) continue;
      buildings.push({ boxes: [{ x, z, w: 10 + rnd() * 6, d: 9 + rnd() * 5, y0: 0, h: 4 + rnd() * 4, rot }], style: 1, color: pick(COLORS.res), year: 1975 + rnd() * 45, lit: 0.5, kind: 'house' });
    }
    return;
  }
  if (r < 0.55) {
    // perimeter residential complex (courtyard)
    const floors = Math.round(9 + rnd() * 12 * (1 - periphery * 0.6));
    const h = floors * 3.0;
    const t = 15;
    const color = pick(COLORS.res);
    const year = baseYear + rnd() * 5;
    const parts = [
      [0, -bd / 2 + t / 2, bw, t], [0, bd / 2 - t / 2, bw, t],
      [-bw / 2 + t / 2, 0, t, bd - 2 * t], [bw / 2 - t / 2, 0, t, bd - 2 * t],
    ];
    const boxes = [];
    parts.forEach(([lx, lz, w, d], idx) => {
      if (rnd() < 0.15) return;
      const [x, z] = rotXZ(lx, lz, -rot, cx, cz);
      const hh = h * (idx === 0 || rnd() < 0.3 ? 1.0 + rnd() * 0.5 : 0.75 + rnd() * 0.25);
      boxes.push({ x, z, w, d, y0: 0, h: hh, rot });
    });
    if (boxes.length) buildings.push({ boxes, style: 1, color, year, lit: 0.55 + rnd() * 0.25, kind: "modern" });
    roads.park.push([cx - 20, cz, cx + 20, cz, 45]);
  } else {
    // residential towers
    const n = 2 + Math.floor(rnd() * 3);
    const color = pick(COLORS.res);
    for (let k = 0; k < n; k++) {
      const lx = ((k % 2) - 0.5) * bw * 0.5 + (rnd() - 0.5) * 20, lz = (Math.floor(k / 2) - 0.5) * bd * 0.5 + (rnd() - 0.5) * 20;
      const [x, z] = rotXZ(lx, lz, -rot, cx, cz);
      if (excluded(x, z, 20) || riverDist(x, z) < 160) continue;
      const floors = Math.round(12 + rnd() * 16 * (1 - periphery));
      const w = 24 + rnd() * 10, d = 22 + rnd() * 10;
      buildings.push({ boxes: [{ x, z, w, d, y0: 0, h: floors * 3.0, rot }, { x, z, w: w * 0.7, d: d * 0.6, y0: floors * 3.0, h: 4, rot }], style: 1, color, year: baseYear + rnd() * 6, lit: 0.5 + rnd() * 0.3, kind: 'modern' });
    }
  }
}

function rotXZ(lx, lz, a, cx, cz) {
  const c = Math.cos(a), s = Math.sin(a);
  return [cx + lx * c + lz * s, cz - lx * s + lz * c];
}

// ------------------------------------------------------------ map texture
export function buildCityTexture(roads) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = TEX;
  const g = cv.getContext('2d');
  const sx = TEX / (CITY.x1 - CITY.x0), sz = TEX / (CITY.z1 - CITY.z0);
  const P = (x, z) => [(x - CITY.x0) * sx, (z - CITY.z0) * sz];
  const out = new Uint8Array(TEX * TEX * 4);
  const layers = [['modern', 0], ['soviet', 1], ['park', 2], ['dirt', 3]];
  for (const [name, ch] of layers) {
    g.fillStyle = '#000'; g.fillRect(0, 0, TEX, TEX);
    g.strokeStyle = '#fff'; g.lineCap = name === 'park' ? 'round' : 'square';
    for (const [x0, z0, x1, z1, w] of roads[name]) {
      g.lineWidth = Math.max(1.5, w * sx);
      g.beginPath(); g.moveTo(...P(x0, z0)); g.lineTo(...P(x1, z1)); g.stroke();
    }
    if (name === 'modern') {
      // paved city blocks (lighter ground) around roads: thick translucent strokes
      g.globalAlpha = 0.35;
      for (const [x0, z0, x1, z1, w] of roads.modern) { g.lineWidth = Math.max(2, (w + 120) * sx); g.beginPath(); g.moveTo(...P(x0, z0)); g.lineTo(...P(x1, z1)); g.stroke(); }
      g.globalAlpha = 1;
    }
    if (name === 'soviet') {
      g.globalAlpha = 0.35;
      for (const [x0, z0, x1, z1, w] of roads.soviet) { g.lineWidth = Math.max(2, (w + 110) * sx); g.beginPath(); g.moveTo(...P(x0, z0)); g.lineTo(...P(x1, z1)); g.stroke(); }
      g.globalAlpha = 1;
      // re-stroke the asphalt so it stays fully opaque
      for (const [x0, z0, x1, z1, w] of roads.soviet) { g.lineWidth = Math.max(1.5, w * sx); g.beginPath(); g.moveTo(...P(x0, z0)); g.lineTo(...P(x1, z1)); g.stroke(); }
    }
    if (name === 'modern') for (const [x0, z0, x1, z1, w] of roads.modern) { g.lineWidth = Math.max(1.5, w * sx); g.beginPath(); g.moveTo(...P(x0, z0)); g.lineTo(...P(x1, z1)); g.stroke(); }
    const img = g.getImageData(0, 0, TEX, TEX).data;
    for (let i = 0, j = ch; i < img.length; i += 4, j += 4) out[j] = img[i];
  }
  const tex = new THREE.DataTexture(out, TEX, TEX, THREE.RGBAFormat);
  tex.flipY = false;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// ------------------------------------------------------------ component
export class City {
  constructor() {
    const { roads, buildings, carLanes } = generateCity();
    { const rr = mulberry(2026); buildings.forEach((b) => { if (b.kind === 'modern' && b.year > 2019 && rr() < 0.12) b.year = 2025.0 + rr() * 0.7; }); }
    this.roads = roads; this.buildings = buildings; this.carLanes = carLanes;
    this.object = new THREE.Group();
    this.mat = facadeMaterial();

    // ground
    const cityTex = buildCityTexture(roads);
    this.groundMat = groundMaterial(cityTex, CITY);
    const gGeo = new THREE.PlaneGeometry(90000, 90000, 1, 1);
    gGeo.rotateX(-Math.PI / 2);
    this.ground = new THREE.Mesh(gGeo, this.groundMat);
    this.ground.receiveShadow = true;
    this.object.add(this.ground);

    // building instances (one draw call for all boxes)
    const boxes = [];
    buildings.forEach((b, bi) => b.boxes.forEach((bx) => boxes.push({ ...bx, b, bi })));
    this.boxes = boxes;
    const geo = new THREE.BoxGeometry(1, 1, 1); geo.translate(0, 0.5, 0);
    const im = (this.im = new THREE.InstancedMesh(geo, this.mat, boxes.length));
    const fac = new Float32Array(boxes.length * 4);
    const col = new THREE.Color();
    boxes.forEach((bx, i) => {
      fac.set([bx.b.style, (bx.bi * 0.6180339) % 1, bx.b.lit, 0], i * 4);
      im.setColorAt(i, col.setHex(bx.b.color));
    });
    geo.setAttribute('aFac', new THREE.InstancedBufferAttribute(fac, 4));
    im.castShadow = true; im.receiveShadow = true;
    im.frustumCulled = false;
    this.object.add(im);

    // spires / crowns on some towers
    const tops = buildings.filter((b) => b.top);
    this.tops = tops;
    const tgeo = new THREE.ConeGeometry(0.5, 1, 4, 1); tgeo.rotateY(Math.PI / 4); tgeo.translate(0, 0.5, 0);
    const tfac = new Float32Array(tops.length * 4);
    tops.forEach((b, i) => tfac.set([b.style, i * 0.37 % 1, 0.3, 0], i * 4));
    tgeo.setAttribute('aFac', new THREE.InstancedBufferAttribute(tfac, 4));
    this.topIM = new THREE.InstancedMesh(tgeo, this.mat, Math.max(1, tops.length));
    tops.forEach((b, i) => this.topIM.setColorAt(i, col.setHex(b.color)));
    this.topIM.castShadow = true; this.topIM.frustumCulled = false;
    this.object.add(this.topIM);

    this.buildCranes();
    this.buildTrees();
    this.buildCars();
    this.buildBridges();
    this.year = -1;
    this.m4 = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.e = new THREE.Euler();
  }

  buildCranes() {
    const N = 70;
    const mat = new THREE.MeshStandardMaterial({ color: 0xe8b21c, roughness: 0.6, metalness: 0.2 });
    const mast = new THREE.BoxGeometry(2.2, 1, 2.2); mast.translate(0, 0.5, 0);
    const jib = new THREE.BoxGeometry(60, 1.6, 1.6); jib.translate(16, 0, 0);
    this.craneMast = new THREE.InstancedMesh(mast, mat, N);
    this.craneJib = new THREE.InstancedMesh(jib, mat, N);
    for (const m of [this.craneMast, this.craneJib]) { m.castShadow = true; m.frustumCulled = false; this.object.add(m); }
  }

  buildTrees() {
    const r = mulberry(77);
    let pts = [];
    // boulevard rows
    for (let x = -1480; x < 1500; x += 14) for (const dz of [-70, -50, 50, 70]) if (Math.abs(x) > 120 && Math.abs(x - 1080) > 90) pts.push([x + r() * 4, AXIS_Z + dz + r() * 4, 2003 + r() * 6]);
    // parks from the map (sample park segments)
    for (const [x0, z0, x1, z1, w] of this.roads.park) {
      const n = Math.min(60, Math.floor((Math.hypot(x1 - x0, z1 - z0) + w) * w / 900));
      for (let k = 0; k < n; k++) {
        const t = r();
        const x = x0 + (x1 - x0) * t + (r() - 0.5) * w * 0.8, z = z0 + (z1 - z0) * t + (r() - 0.5) * w * 0.8;
        if (Math.abs(z - AXIS_Z) < 40 && Math.abs(x) < 1600) continue;
        pts.push([x, z, 2000 + r() * 20]);
      }
    }
    // river embankment trees
    for (let x = -3500; x < 3800; x += 22) {
      const rz = riverZ(x);
      for (const s of [-1, 1]) if (r() < 0.7) pts.push([x + r() * 8, rz + s * (95 + r() * 25), 2001 + r() * 15]);
    }
    const [kx, kz] = LM.khanShatyr;
    this.treePts = pts.filter(([x, z]) => Math.hypot(x - kx, z - kz) > 420);
    const canopy = new THREE.IcosahedronGeometry(1, 1);
    canopy.scale(1, 1.15, 1); canopy.translate(0, 1.55, 0);
    const trunk = new THREE.CylinderGeometry(0.06, 0.09, 1, 5); trunk.translate(0, 0.5, 0);
    pts = this.treePts;
    this.treeTop = new THREE.InstancedMesh(canopy, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: false }), pts.length);
    this.treeTrunk = new THREE.InstancedMesh(trunk, new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 1 }), pts.length);
    const c = new THREE.Color();
    pts.forEach((p, i) => this.treeTop.setColorAt(i, c.setHSL(0.22 + r() * 0.08, 0.45 + r() * 0.2, 0.2 + r() * 0.08)));
    for (const m of [this.treeTop, this.treeTrunk]) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; this.object.add(m); }
  }

  buildCars() {
    const lanes = this.carLanes.filter(() => true);
    const r = mulberry(5);
    const N = 1800;
    this.cars = [];
    for (let i = 0; i < N; i++) {
      const L = lanes[Math.floor(r() * lanes.length)];
      this.cars.push({ L, off: r(), speed: (0.04 + r() * 0.05) * (r() < 0.5 ? 1 : -1), side: r() < 0.5 ? -1 : 1, hue: r() });
    }
    const body = new THREE.BoxGeometry(4.4, 1.4, 1.9); body.translate(0, 0.9, 0);
    this.carIM = new THREE.InstancedMesh(body, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.6 }), N);
    const c = new THREE.Color();
    const palette = [0xf2f2f2, 0x1a1a1a, 0x8a8f96, 0xb8bcc2, 0x23324a, 0x6b1f1f, 0xdedad0];
    this.cars.forEach((car, i) => this.carIM.setColorAt(i, c.setHex(palette[Math.floor(car.hue * palette.length)])));
    this.carIM.frustumCulled = false; this.carIM.castShadow = false;
    // light streaks for night / time-lapse
    const lg = new THREE.PlaneGeometry(1, 1); lg.rotateX(-Math.PI / 2);
    this.lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: true });
    this.lightIM = new THREE.InstancedMesh(lg, this.lightMat, N);
    this.cars.forEach((car, i) => this.lightIM.setColorAt(i, c.setRGB(...(car.speed > 0 ? [1.4, 1.05, 0.7] : [1.4, 0.18, 0.1]))));
    this.lightIM.frustumCulled = false;
    this.object.add(this.carIM, this.lightIM);
  }

  buildBridges() {
    const mat = new THREE.MeshStandardMaterial({ color: 0xcfcac2, roughness: 0.7 });
    this.bridges = new THREE.Group();
    const xs = [[-2650, 1999], [-1050, 2003], [560, 2008], [2250, 2005], [3300, 2013], [-300, 2016]];
    for (const [x, year] of xs) {
      const rz = riverZ(x);
      // estimate local river direction to orient the deck across it
      const dz = riverZ(x + 20) - riverZ(x - 20);
      const ang = Math.atan2(dz, 40);
      const deck = new THREE.Mesh(new THREE.BoxGeometry(32, 3, 260), mat);
      deck.position.set(x, 7, rz); deck.rotation.y = -ang;
      deck.castShadow = deck.receiveShadow = true;
      deck.userData.year = year;
      this.bridges.add(deck);
      if (year === 2013) {
        // cable-stayed signature bridge: tall white pylon
        const py = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 70, 8), mat);
        py.position.set(x, 42, rz); py.userData.year = year; py.castShadow = true;
        this.bridges.add(py);
        const cableMat = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
        for (let k = -6; k <= 6; k++) {
          if (!k) continue;
          const len = Math.hypot(k * 18, 60);
          const cb = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, len, 3), cableMat);
          cb.position.set(x, 9 + 30, rz + k * 9);
          cb.rotation.x = Math.atan2(k * 18, 60);
          cb.userData.year = year;
          this.bridges.add(cb);
        }
      }
    }
    this.object.add(this.bridges);
  }

  // state: { year, t, night, carMode: 'normal'|'trails', cranes: bool }
  update(state) {
    const year = state.year;
    const m4 = this.m4, q = this.q, e = this.e;
    const pos = new THREE.Vector3(), scl = new THREE.Vector3();
    const growing = [];
    // buildings
    const bHeights = this.buildings.map((b) => {
      const g = smooth(b.year, b.year + 1.4, year);
      const total = Math.max(...b.boxes.map((bx) => bx.y0 + bx.h));
      if (g > 0.02 && g < 0.98 && b.kind !== 'house') growing.push([b, g, total]);
      return [g, total];
    });
    this.boxes.forEach((bx, i) => {
      const [g, total] = bHeights[bx.bi];
      const cur = total * g;
      const vis = clamp(cur - bx.y0, 0, bx.h);
      if (vis < 0.05) { m4.makeScale(0, 0, 0); this.im.setMatrixAt(i, m4); return; }
      e.set(0, bx.rot, 0); q.setFromEuler(e);
      pos.set(bx.x, bx.y0, bx.z); scl.set(bx.w, vis, bx.d);
      m4.compose(pos, q, scl); this.im.setMatrixAt(i, m4);
    });
    this.im.instanceMatrix.needsUpdate = true;
    this.tops.forEach((b, i) => {
      const g = smooth(b.year + 1.3, b.year + 1.6, year);
      const t = b.top;
      if (g < 0.01) { m4.makeScale(0, 0, 0); } else {
        e.set(0, t.rot, 0); q.setFromEuler(e);
        m4.compose(pos.set(t.x, t.y, t.z), q, scl.set(t.w, t.h * g, t.w));
      }
      this.topIM.setMatrixAt(i, m4);
    });
    this.topIM.instanceMatrix.needsUpdate = true;

    // cranes on buildings under construction
    growing.sort((a, b) => b[2] - a[2]);
    for (let i = 0; i < this.craneMast.count; i++) {
      const gi = growing[i];
      if (!gi || !state.cranes) { m4.makeScale(0, 0, 0); this.craneMast.setMatrixAt(i, m4); this.craneJib.setMatrixAt(i, m4); continue; }
      const [b, g, total] = gi;
      const bx = b.boxes[0];
      const h = total * g + 18;
      const ox = bx.x + Math.cos(bx.rot) * (bx.w / 2 + 6), oz = bx.z - Math.sin(bx.rot) * (bx.w / 2 + 6);
      m4.compose(pos.set(ox, 0, oz), q.identity(), scl.set(1, h, 1)); this.craneMast.setMatrixAt(i, m4);
      e.set(0, (b.year * 7.3 + state.t * 0.25) % (Math.PI * 2), 0); q.setFromEuler(e);
      m4.compose(pos.set(ox, h, oz), q, scl.set(1, 1, 1)); this.craneJib.setMatrixAt(i, m4);
    }
    this.craneMast.instanceMatrix.needsUpdate = true; this.craneJib.instanceMatrix.needsUpdate = true;

    // trees
    const tsize = 1;
    this.treePts.forEach(([x, z, y0], i) => {
      const g = smooth(y0, y0 + 2, year) * tsize;
      const s = (4 + ((i * 0.618) % 1) * 3) * g;
      if (s < 0.05) m4.makeScale(0, 0, 0); else m4.compose(pos.set(x, 0, z), q.identity(), scl.set(s, s * 1.1, s));
      this.treeTop.setMatrixAt(i, m4);
      if (s >= 0.05) m4.compose(pos.set(x, 0, z), q.identity(), scl.set(s * 2, s * 1.7, s * 2));
      this.treeTrunk.setMatrixAt(i, m4);
    });
    this.treeTop.instanceMatrix.needsUpdate = true; this.treeTrunk.instanceMatrix.needsUpdate = true;

    // traffic
    const trails = state.carMode === 'trails';
    const carVis = smooth(1999, 2003, year) * (state.cars === false ? 0 : 1);
    this.cars.forEach((car, i) => {
      const [x0, z0, x1, z1] = car.L;
      const len = Math.hypot(x1 - x0, z1 - z0);
      const u = (((car.off + state.t * car.speed * (trails ? 6 : 1) * 30 / len) % 1) + 1) % 1;
      const dx = (x1 - x0) / len, dz = (z1 - z0) / len;
      const nx = -dz * 4 * car.side, nz = dx * 4 * car.side;
      const x = x0 + (x1 - x0) * u + nx, z = z0 + (z1 - z0) * u + nz;
      const yaw = Math.atan2(-dz, dx) + (car.speed < 0 ? Math.PI : 0);
      e.set(0, yaw, 0); q.setFromEuler(e);
      if (carVis < 0.5 || trails) m4.makeScale(0, 0, 0); else m4.compose(pos.set(x, 0, z), q, scl.set(1, 1, 1));
      this.carIM.setMatrixAt(i, m4);
      const L = trails ? 60 : 5;
      const lightOn = carVis > 0.5 && (state.night > 0.2 || trails);
      if (!lightOn) m4.makeScale(0, 0, 0); else m4.compose(pos.set(x - dx * L * 0.5 * Math.sign(car.speed), 1.2, z - dz * L * 0.5 * Math.sign(car.speed)), q, scl.set(L, 1, trails ? 1.2 : 1.6));
      this.lightIM.setMatrixAt(i, m4);
    });
    this.carIM.instanceMatrix.needsUpdate = true; this.lightIM.instanceMatrix.needsUpdate = true;
    this.lightMat.opacity = trails ? 0.85 : 0.8 * clamp(state.night * 1.5);

    // bridges
    this.bridges.children.forEach((m) => { m.visible = year >= m.userData.year; });

    // ground layers
    const u = this.groundMat.userData.uni;
    u.uSoviet.value = smooth(1956, 1975, year);
    u.uModern.value = smooth(1998, 2022, year);
    u.uDirt.value = 1 - smooth(1960, 1990, year) * 0.8;
  }
}
