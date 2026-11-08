// City life: pedestrians (families, students, tourists with phones), the national
// flag, and an elevated light-rail line with a moving train.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry, smooth } from '../util.js';
import { shared } from '../materials.js';

// ---------------------------------------------------------------- pedestrians
function bodyGeo() {
  const torso = new THREE.CapsuleGeometry(0.2, 0.52, 4, 8); torso.translate(0, 1.2, 0);
  const head = new THREE.SphereGeometry(0.115, 10, 8); head.translate(0, 1.66, 0);
  const armL = new THREE.CapsuleGeometry(0.06, 0.5, 3, 6); armL.translate(0.26, 1.18, 0);
  const armR = armL.clone(); armR.translate(-0.52, 0, 0);
  return mergeGeometries([torso, head, armL, armR].map((g) => g.toNonIndexed()));
}
function legGeo() { const g = new THREE.CapsuleGeometry(0.075, 0.72, 3, 6); g.translate(0, -0.42, 0); return g; }

export class Crowd {
  // spots: [{x, z, w, d, n, dir: [dx,dz], speed, photo: fraction, scale}]
  constructor(spots, seed = 3) {
    const r = mulberry(seed);
    this.people = [];
    for (const sp of spots) for (let i = 0; i < sp.n; i++) {
      const child = r() < (sp.kids || 0.12);
      const stand = r() < (sp.photo || 0);
      const ang = sp.dir ? Math.atan2(sp.dir[1], sp.dir[0]) + (r() < 0.5 ? Math.PI : 0) + (r() - 0.5) * 0.25 : r() * Math.PI * 2;
      this.people.push({
        sp, x: (r() - 0.5) * sp.w, z: (r() - 0.5) * sp.d, ang,
        speed: stand ? 0 : (sp.speed || 1.3) * (0.75 + r() * 0.5) * (child ? 0.9 : 1),
        h: child ? 0.6 + r() * 0.1 : 0.94 + r() * 0.12, phase: r() * 6.28, stand, hue: r(), light: r(),
        phoneFace: stand ? r() * Math.PI * 2 : 0,
      });
    }
    const N = this.people.length;
    const cloth = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    this.body = new THREE.InstancedMesh(bodyGeo(), cloth, N);
    this.legL = new THREE.InstancedMesh(legGeo(), new THREE.MeshStandardMaterial({ color: 0x24262c, roughness: 0.9 }), N);
    this.legR = new THREE.InstancedMesh(legGeo(), this.legL.material, N);
    const pg = new THREE.PlaneGeometry(0.075, 0.14);
    this.phone = new THREE.InstancedMesh(pg, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, 2.7, 3.0), side: THREE.DoubleSide }), N);
    const c = new THREE.Color();
    const pal = [0xd9d4ca, 0x1d2533, 0x6e3434, 0x3a5470, 0xa88f63, 0x46574a, 0x26272a, 0xe8e6e1, 0x55505e, 0x9a6a4e, 0x30353d, 0x8b8b88];
    this.people.forEach((p, i) => this.body.setColorAt(i, c.setHex(pal[Math.floor(p.hue * pal.length)])));
    this.object = new THREE.Group();
    for (const m of [this.body, this.legL, this.legR, this.phone]) { m.castShadow = m !== this.phone; m.frustumCulled = false; this.object.add(m); }
    this.tmp = { m4: new THREE.Matrix4(), q: new THREE.Quaternion(), q2: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), x: new THREE.Vector3(1, 0, 0) };
  }
  update(state) {
    const { m4, q, q2, p, s, up, x: ax } = this.tmp;
    const t = state.t;
    this.object.visible = state.year > 2000;
    if (!this.object.visible) return;
    this.people.forEach((pp, i) => {
      const sp = pp.sp;
      const dx = Math.cos(pp.ang), dz = -Math.sin(pp.ang);
      let lx = pp.x + dx * pp.speed * t, lz = pp.z + dz * pp.speed * t;
      lx = ((lx + sp.w / 2) % sp.w + sp.w) % sp.w - sp.w / 2;
      lz = ((lz + sp.d / 2) % sp.d + sp.d) % sp.d - sp.d / 2;
      const X = sp.x + lx, Z = sp.z + lz;
      const yaw = pp.stand ? pp.phoneFace : pp.ang;
      q.setFromAxisAngle(up, yaw + Math.PI / 2);
      const sc = pp.h * (sp.scale || 1);
      const cyc = t * pp.speed * 2.4 + pp.phase;
      const bob = pp.speed > 0 ? Math.abs(Math.sin(cyc)) * 0.04 : 0;
      this.body.setMatrixAt(i, m4.compose(p.set(X, bob, Z), q, s.set(sc, sc, sc)));
      const swing = pp.speed > 0 ? Math.sin(cyc) * 0.45 : 0;
      for (const [leg, sgn, off] of [[this.legL, 1, 0.1], [this.legR, -1, -0.1]]) {
        q2.setFromAxisAngle(ax, swing * sgn);
        const qq = q.clone().multiply(q2);
        const hip = new THREE.Vector3(off * sc, 0.86 * sc + bob, 0).applyQuaternion(q);
        leg.setMatrixAt(i, m4.compose(p.set(X + hip.x, hip.y, Z + hip.z), qq, s.set(sc, sc, sc)));
      }
      if (pp.stand) {
        const fwd = new THREE.Vector3(0, 0, 0.42 * sc).applyQuaternion(q);
        this.phone.setMatrixAt(i, m4.compose(p.set(X + fwd.x, 1.62 * sc, Z + fwd.z), q, s.set(sc * 1.4, sc * 1.4, sc)));
      } else this.phone.setMatrixAt(i, m4.makeScale(0, 0, 0));
    });
    for (const m of [this.body, this.legL, this.legR, this.phone]) m.instanceMatrix.needsUpdate = true;
  }
}

// ---------------------------------------------------------------- national flag
export function flagTexture() {
  const W = 1024, H = 512;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#00afca'; g.fillRect(0, 0, W, H);
  const gold = '#fec50c';
  g.fillStyle = gold; g.strokeStyle = gold;
  // sun with 32 rays
  const cx = W * 0.5, cy = H * 0.4, R = H * 0.135;
  g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const a1 = a - 0.045, a2 = a + 0.045;
    g.beginPath();
    g.moveTo(cx + Math.cos(a1) * R * 1.17, cy + Math.sin(a1) * R * 1.17);
    g.lineTo(cx + Math.cos(a) * R * 1.62, cy + Math.sin(a) * R * 1.62);
    g.lineTo(cx + Math.cos(a2) * R * 1.17, cy + Math.sin(a2) * R * 1.17);
    g.closePath(); g.fill();
  }
  // steppe eagle (stylised silhouette) with wings spread below the sun
  g.save(); g.translate(cx, H * 0.69); g.scale(W / 1024, H / 512);
  g.beginPath();
  g.moveTo(0, -28);
  g.bezierCurveTo(30, -40, 90, -38, 175, -22);   // right wing top
  g.bezierCurveTo(150, -14, 160, -6, 132, -2);
  g.bezierCurveTo(150, 2, 128, 8, 104, 8);
  g.bezierCurveTo(118, 14, 92, 18, 64, 14);
  g.bezierCurveTo(46, 16, 30, 18, 16, 22);       // body right
  g.lineTo(22, 44); g.lineTo(8, 36); g.lineTo(0, 50); g.lineTo(-8, 36); g.lineTo(-22, 44); // tail
  g.lineTo(-16, 22);
  g.bezierCurveTo(-30, 18, -46, 16, -64, 14);
  g.bezierCurveTo(-92, 18, -118, 14, -104, 8);
  g.bezierCurveTo(-128, 8, -150, 2, -132, -2);
  g.bezierCurveTo(-160, -6, -150, -14, -175, -22);
  g.bezierCurveTo(-90, -38, -30, -40, 0, -28);
  g.closePath(); g.fill();
  g.beginPath(); g.ellipse(0, -30, 9, 11, 0, 0, Math.PI * 2); g.fill(); // head
  g.restore();
  // national ornament band at the hoist (stylised koshkar-muiz scrolls)
  g.lineWidth = 7; g.lineCap = 'round';
  const bx = W * 0.075, step = H / 7;
  for (let k = 0; k < 7; k++) {
    const y = step * (k + 0.5);
    for (const s of [-1, 1]) {
      g.beginPath();
      g.moveTo(bx, y - step * 0.32);
      g.bezierCurveTo(bx + s * 30, y - step * 0.32, bx + s * 34, y + 2, bx + s * 14, y + 6);
      g.bezierCurveTo(bx + s * 2, y + 8, bx + s * 4, y - 10, bx + s * 14, y - 6);
      g.stroke();
      g.beginPath();
      g.moveTo(bx, y + step * 0.32);
      g.bezierCurveTo(bx + s * 22, y + step * 0.3, bx + s * 26, y + step * 0.12, bx + s * 12, y + step * 0.1);
      g.stroke();
    }
    g.beginPath(); g.moveTo(bx, y - step * 0.36); g.lineTo(bx, y + step * 0.36); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

export class Flag {
  constructor(x, z, poleH = 52, w = 26) {
    this.object = new THREE.Group();
    const h = w / 2;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, poleH, 16), new THREE.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 0.9, roughness: 0.25 }));
    pole.position.set(0, poleH / 2, 0); pole.castShadow = true;
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), new THREE.MeshStandardMaterial({ color: 0xe2b04a, metalness: 1, roughness: 0.2 }));
    finial.position.y = poleH + 0.5;
    const geo = new THREE.PlaneGeometry(w, h, 80, 40); geo.translate(w / 2, 0, 0);
    this.uni = { uT: { value: 0 }, uW: { value: w } };
    const ftex = flagTexture();
    const mat = new THREE.MeshStandardMaterial({ map: ftex, emissiveMap: ftex, emissive: 0xffffff, emissiveIntensity: 0.22, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.0 });
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, this.uni);
      const wave = `
        float fx = position.x / uW;
        float ph = position.x * 0.32 - uT * 4.2 + position.y * 0.08;
        float amp = fx * (1.6 + 0.6 * sin(uT * 0.9));
        float dz = sin(ph) * amp + sin(ph * 2.1 + 1.3) * amp * 0.25;
        float dzdx = cos(ph) * 0.32 * amp + cos(ph * 2.1 + 1.3) * 0.32 * 2.1 * amp * 0.25;`;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uT; uniform float uW;')
        .replace('#include <beginnormal_vertex>', `${wave}\nvec3 objectNormal = normalize(vec3(-dzdx, 0.0, 1.0));\n#ifdef USE_TANGENT\nvec3 objectTangent = vec3( tangent.xyz );\n#endif`)
        .replace('#include <begin_vertex>', 'vec3 transformed = vec3(position.x - abs(dz) * 0.15, position.y - fx * fx * 1.2, dz);');
    };
    const flag = new THREE.Mesh(geo, mat);
    flag.position.set(0.3, poleH - h / 2 - 0.4, 0);
    flag.castShadow = true;
    this.object.add(pole, finial, flag);
    this.object.position.set(x, 0, z);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 1.2, 24), new THREE.MeshStandardMaterial({ color: 0xcfc8bc, roughness: 0.6 }));
    base.position.y = 0.6; base.receiveShadow = true; this.object.add(base);
  }
  update(state) { this.uni.uT.value = state.t; this.object.visible = state.year >= 1992; }
}

// ---------------------------------------------------------------- light rail (LRT)
export class Transit {
  constructor(z = 2060, x0 = -3200, x1 = 3400, y = 13) {
    this.object = new THREE.Group();
    this.z = z; this.x0 = x0; this.x1 = x1; this.y = y;
    const conc = new THREE.MeshStandardMaterial({ color: 0xd2cfc9, roughness: 0.7 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 2.2, 11), conc);
    beam.position.set((x0 + x1) / 2, y - 1.1, z); beam.castShadow = beam.receiveShadow = true;
    this.object.add(beam);
    const pillar = new THREE.CylinderGeometry(1.3, 1.6, y - 2.2, 10); pillar.translate(0, (y - 2.2) / 2, 0);
    const n = Math.floor((x1 - x0) / 36);
    const pim = new THREE.InstancedMesh(pillar, conc, n);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < n; i++) pim.setMatrixAt(i, m4.makeTranslation(x0 + 18 + i * 36, 0, z));
    pim.castShadow = true; this.object.add(pim);
    // train: 4 cars with window band
    const carGeo = new THREE.BoxGeometry(24, 3.6, 3.0); carGeo.translate(0, 1.9, 0);
    const body = new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.25, metalness: 0.3 });
    const band = new THREE.MeshStandardMaterial({ color: 0x0b2030, roughness: 0.05, metalness: 0.9, emissive: 0x9fd4ff, emissiveIntensity: 0 });
    this.train = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const c = new THREE.Mesh(carGeo, body); c.position.x = -k * 25; c.castShadow = true;
      const w = new THREE.Mesh(new THREE.BoxGeometry(23, 1.1, 3.05), band); w.position.set(-k * 25, 2.6, 0);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(23.5, 0.35, 3.06), new THREE.MeshStandardMaterial({ color: 0x00a3c4, emissive: 0x00a3c4, emissiveIntensity: 0.4 }));
      stripe.position.set(-k * 25, 1.3, 0);
      this.train.add(c, w, stripe);
    }
    this.band = band;
    this.object.add(this.train);
  }
  update(state) {
    this.object.visible = state.year >= 2023;
    const x = this.x0 + 200 + ((state.t * 22) % (this.x1 - this.x0 - 400));
    this.train.position.set(x, this.y, this.z);
    this.band.emissiveIntensity = 0.1 + 0.5 * state.night;
  }
}
