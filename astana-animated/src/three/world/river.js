// The Ishim (Есіл) river: water ribbon, natural banks, and a modern granite embankment.
import * as THREE from 'three';
import { RIVER_SAMPLES, RIVER_WIDTH } from '../geo.js';
import { waterMaterial } from '../materials.js';
import { smooth } from '../util.js';

function ribbon(width, y, step = 1) {
  const pts = RIVER_SAMPLES.filter((_, i) => i % step === 0);
  const pos = [], uv = [], idx = [];
  let acc = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x, z] = pts[i];
    const [xa, za] = pts[Math.max(0, i - 1)], [xb, zb] = pts[Math.min(pts.length - 1, i + 1)];
    let dx = xb - xa, dz = zb - za; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    const w = width * (1 + 0.12 * Math.sin(i * 0.05));
    if (i > 0) acc += Math.hypot(x - pts[i - 1][0], z - pts[i - 1][1]);
    pos.push(x - dz * w / 2, y, z + dx * w / 2, x + dz * w / 2, y, z - dx * w / 2);
    uv.push(acc / 50, 0, acc / 50, w / 50);
    if (i > 0) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // ensure normals point up
  const n = g.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0);
  return g;
}

// two strips along both banks, between offsets o0..o1 from the centre line
function strips(o0, o1, y) {
  const pts = RIVER_SAMPLES;
  const pos = [], idx = [];
  for (const side of [-1, 1]) {
    const base = pos.length / 3;
    for (let i = 0; i < pts.length; i++) {
      const [x, z] = pts[i];
      const [xa, za] = pts[Math.max(0, i - 1)], [xb, zb] = pts[Math.min(pts.length - 1, i + 1)];
      let dx = xb - xa, dz = zb - za; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      const w = 1 + 0.12 * Math.sin(i * 0.05);
      pos.push(x - dz * o0 * w * side, y, z + dx * o0 * w * side, x - dz * o1 * w * side, y, z + dx * o1 * w * side);
      if (i > 0) { const a = base + (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  const nrm = new Float32Array(pos.length); for (let i = 1; i < nrm.length; i += 3) nrm[i] = 1;
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  return g;
}

export class River {
  constructor() {
    this.object = new THREE.Group();
    this.water = new THREE.Mesh(ribbon(RIVER_WIDTH, 0.9), waterMaterial());
    this.water.receiveShadow = true; this.water.material.side = THREE.DoubleSide;
    const bankMat = new THREE.MeshStandardMaterial({ color: 0x7b7350, roughness: 1 });
    this.bank = new THREE.Mesh(ribbon(RIVER_WIDTH + 46, 0.35), bankMat);
    this.bank.receiveShadow = true; bankMat.side = THREE.DoubleSide;
    const embMat = new THREE.MeshStandardMaterial({ color: 0xb9b2a6, roughness: 0.75 });
    this.emb = new THREE.Mesh(strips(RIVER_WIDTH / 2 - 2, RIVER_WIDTH / 2 + 9, 1.8), embMat);
    this.emb.material.side = THREE.DoubleSide;
    this.emb.receiveShadow = true;
    // promenade strips either side (light paving)
    this.prom = new THREE.Mesh(strips(RIVER_WIDTH / 2 + 9, RIVER_WIDTH / 2 + 34, 0.7), new THREE.MeshStandardMaterial({ color: 0x9d9a92, roughness: 0.8 }));
    this.prom.receiveShadow = true; this.prom.material.side = THREE.DoubleSide;
    this.object.add(this.bank, this.prom, this.emb, this.water);
    this.water.renderOrder = 2;
  }
  update(state) {
    const m = smooth(1999, 2006, state.year);
    this.emb.visible = m > 0.5; this.prom.visible = m > 0.5;
    this.bank.visible = m <= 0.5;
  }
}
