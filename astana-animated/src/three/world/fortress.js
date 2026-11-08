// Akmola, 1830s-1900s: timber fortress on the Ishim, log houses, Kazakh auyls
// (yurts), herds, and horse-drawn carts on dirt tracks.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LM, riverDist } from '../geo.js';
import { facadeMaterial } from '../materials.js';
import { mulberry, smooth, clamp } from '../util.js';

const r = mulberry(1830);

function fac(geo, style, seed = 0.4) {
  const n = geo.attributes.position.count, a = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) a.set([style, seed, 0.6, 0], i * 4);
  geo.setAttribute('aFac', new THREE.BufferAttribute(a, 4));
  return geo;
}

function horseGeo() {
  const parts = [];
  const body = new THREE.CapsuleGeometry(0.42, 1.25, 4, 8); body.rotateZ(Math.PI / 2); body.translate(0, 1.35, 0); parts.push(body);
  const neck = new THREE.CylinderGeometry(0.17, 0.27, 0.95, 6); neck.rotateZ(-0.75); neck.translate(0.95, 1.75, 0); parts.push(neck);
  const head = new THREE.BoxGeometry(0.62, 0.26, 0.24); head.rotateZ(-0.35); head.translate(1.38, 2.0, 0); parts.push(head);
  for (const [x, z] of [[0.55, 0.2], [0.55, -0.2], [-0.6, 0.2], [-0.6, -0.2]]) { const l = new THREE.CylinderGeometry(0.07, 0.06, 1.05, 5); l.translate(x, 0.53, z); parts.push(l); }
  const tail = new THREE.CylinderGeometry(0.05, 0.12, 0.8, 5); tail.rotateZ(0.6); tail.translate(-1.15, 1.25, 0); parts.push(tail);
  // rider
  const torso = new THREE.CylinderGeometry(0.2, 0.26, 0.75, 6); torso.translate(-0.05, 2.2, 0); parts.push(torso);
  const hd = new THREE.SphereGeometry(0.15, 8, 6); hd.translate(-0.05, 2.72, 0); parts.push(hd);
  return mergeGeometries(parts.map((p) => p.toNonIndexed()));
}
function cartGeo() {
  const parts = [];
  const bed = new THREE.BoxGeometry(2.6, 0.6, 1.5); bed.translate(-2.2, 1.0, 0); parts.push(bed);
  const load = new THREE.BoxGeometry(2.3, 0.7, 1.3); load.translate(-2.2, 1.6, 0); parts.push(load);
  for (const z of [0.85, -0.85]) { const w = new THREE.CylinderGeometry(0.62, 0.62, 0.12, 12); w.rotateX(Math.PI / 2); w.translate(-2.2, 0.62, z); parts.push(w); }
  const shaft = new THREE.BoxGeometry(2.0, 0.08, 0.08); shaft.translate(-0.4, 1.0, 0.45); parts.push(shaft);
  return mergeGeometries(parts.map((p) => p.toNonIndexed()));
}

export class Fortress {
  constructor() {
    this.object = new THREE.Group();
    const [fx, fz] = LM.fortress;
    this.center = [fx, fz];
    const wood = new THREE.MeshStandardMaterial({ color: 0x6a5238, roughness: 0.95 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x4b4036, roughness: 0.9 });
    this.items = []; // {mesh|instance, from, to}

    // --- palisade with corner bastions
    const S = 100, Bn = 26;
    const outline = [];
    const corners = [[-S, -S], [S, -S], [S, S], [-S, S]];
    for (let c = 0; c < 4; c++) {
      const [ax, az] = corners[c], [bx, bz] = corners[(c + 1) % 4];
      // bastion: a diamond point outward at each corner
      const ox = Math.sign(ax), oz = Math.sign(az);
      outline.push([ax - ox * 0 + (bx - ax) * 0.0, az], [ax + ox * Bn, az + oz * Bn]);
      outline.push([ax + (bx - ax) * 0.12, az + (bz - az) * 0.12]);
      outline.push([ax + (bx - ax) * 0.88, az + (bz - az) * 0.88]);
    }
    const posts = [];
    for (let i = 0; i < outline.length; i++) {
      const [ax, az] = outline[i], [bx, bz] = outline[(i + 1) % outline.length];
      const L = Math.hypot(bx - ax, bz - az);
      const n = Math.floor(L / 0.55);
      for (let k = 0; k < n; k++) {
        const t = k / n;
        const x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        // gate gap in the south wall
        if (Math.abs(z - S) < 1 && Math.abs(x) < 6) continue;
        posts.push([fx + x, fz + z, 3.8 + r() * 0.8]);
      }
    }
    const postGeo = new THREE.CylinderGeometry(0.19, 0.21, 1, 6); postGeo.translate(0, 0.5, 0);
    this.posts = new THREE.InstancedMesh(postGeo, wood, posts.length);
    const m4 = new THREE.Matrix4();
    posts.forEach(([x, z, h], i) => this.posts.setMatrixAt(i, m4.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion(), new THREE.Vector3(1, h, 1))));
    this.posts.castShadow = this.posts.receiveShadow = true;
    this.object.add(this.posts);
    this.items.push({ obj: this.posts, from: 1829, to: 1878 });

    // --- watch towers at bastion points and gate
    const towerSpots = [[-S - Bn, -S - Bn], [S + Bn, -S - Bn], [S + Bn, S + Bn], [-S - Bn, S + Bn], [0, S + 3]];
    for (const [x, z] of towerSpots) {
      const t = new THREE.Group();
      const body = new THREE.Mesh(fac(new THREE.BoxGeometry(6, 9, 6).translate(0, 4.5, 0), 4, 0.2), facadeMaterial({ color: 0x705638 }));
      const roof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 4, 4).rotateY(Math.PI / 4).translate(0, 11, 0), roofMat);
      body.castShadow = roof.castShadow = true; body.receiveShadow = true;
      t.add(body, roof); t.position.set(fx + x, 0, fz + z);
      this.object.add(t);
      this.items.push({ obj: t, from: 1829, to: 1878 });
    }

    // --- log houses (inside fortress first, then the growing town outside)
    const houses = [];
    for (let i = 0; i < 22; i++) houses.push([fx + (r() - 0.5) * 150, fz + (r() - 0.5) * 150, 1830 + r() * 6, 1958 + r() * 14, r() < 0.15 ? 1.5 : 1]);
    // town growth 1840-1910 along tracks, mostly north/east of the fort and along the river
    for (let i = 0; i < 230; i++) {
      const a = r() * Math.PI * 2, d = 140 + Math.pow(r(), 0.7) * 750;
      const x = fx + Math.cos(a) * d * 1.3, z = fz + Math.sin(a) * d * 0.8 - 120;
      if (riverDist(x, z) < 120) continue;
      houses.push([x, z, 1836 + (d / 900) * 60 + r() * 12, 1955 + r() * 20, r() < 0.12 ? 1.6 : 1]);
    }
    this.houses = houses;
    const hb = fac(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), 4, 0.5);
    this.houseIM = new THREE.InstancedMesh(hb, facadeMaterial({ color: 0x6e5539 }), houses.length);
    const roof = new THREE.CylinderGeometry(0.5, 0.5, 1, 3, 1); roof.rotateZ(Math.PI / 2); roof.rotateX(-Math.PI / 2); roof.translate(0, 0.25, 0);
    roof.scale(1, 1, 1);
    this.roofIM = new THREE.InstancedMesh(roof, roofMat, houses.length);
    const c = new THREE.Color();
    houses.forEach((h, i) => this.houseIM.setColorAt(i, c.setHSL(0.08, 0.3 + r() * 0.15, 0.24 + r() * 0.1)));
    for (const m of [this.houseIM, this.roofIM]) { m.castShadow = m.receiveShadow = true; m.frustumCulled = false; this.object.add(m); }
    this.houseRot = houses.map(() => (r() < 0.5 ? 0 : Math.PI / 2) + (r() - 0.5) * 0.1);
    this.houseSize = houses.map((h) => [8 + r() * 5, 6 + r() * 2, (3 + r() * 0.8) * h[4]]);

    // --- yurts (Kazakh auyls) outside the walls, near the river
    const yurts = [];
    const camps = [[fx - 520, fz + 260], [fx + 480, fz + 180], [fx - 260, fz - 420], [fx + 760, fz - 260], [fx - 900, fz - 120]];
    for (const [cx, cz] of camps) for (let k = 0; k < 9; k++) {
      const x = cx + (r() - 0.5) * 120, z = cz + (r() - 0.5) * 90;
      if (riverDist(x, z) < 95) continue;
      yurts.push([x, z, 2.8 + r() * 0.9]);
    }
    this.yurts = yurts;
    const ywall = new THREE.CylinderGeometry(1, 1, 1, 18); ywall.translate(0, 0.5, 0);
    const ydome = new THREE.SphereGeometry(1, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const felt = new THREE.MeshStandardMaterial({ color: 0xe6dfcf, roughness: 0.95 });
    this.yWall = new THREE.InstancedMesh(ywall, felt, yurts.length);
    this.yDome = new THREE.InstancedMesh(ydome, felt, yurts.length);
    yurts.forEach(([x, z, s], i) => {
      this.yWall.setMatrixAt(i, m4.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion(), new THREE.Vector3(s, 1.7, s)));
      this.yDome.setMatrixAt(i, m4.compose(new THREE.Vector3(x, 1.7, z), new THREE.Quaternion(), new THREE.Vector3(s, 1.5, s)));
    });
    for (const m of [this.yWall, this.yDome]) { m.castShadow = m.receiveShadow = true; this.object.add(m); this.items.push({ obj: m, from: 1700, to: 1935 }); }

    // --- grazing herds (sheep / horses as small shapes)
    const herd = [];
    for (const [cx, cz] of camps) for (let k = 0; k < 70; k++) {
      const x = cx + 120 + (r() - 0.5) * 260, z = cz + 140 + (r() - 0.5) * 200;
      if (riverDist(x, z) < 90) continue;
      herd.push([x, z, r() * 6.28]);
    }
    const sheep = new THREE.SphereGeometry(0.55, 6, 4); sheep.scale(1.4, 0.8, 0.8); sheep.translate(0, 0.6, 0);
    this.herd = new THREE.InstancedMesh(sheep, new THREE.MeshStandardMaterial({ color: 0xd8d0bd, roughness: 1 }), herd.length);
    herd.forEach(([x, z, a], i) => this.herd.setMatrixAt(i, m4.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a), new THREE.Vector3(1, 1, 1))));
    this.herd.castShadow = true; this.object.add(this.herd);
    this.items.push({ obj: this.herd, from: 1700, to: 1935 });

    // --- horse riders & carts travelling on the tracks
    const tracks = [[[fx - 2600, fz - 900], [fx - 120, fz - 20]], [[fx + 120, fz + 30], [fx + 2400, fz - 300]], [[fx, fz - 120], [fx + 300, fz - 2600]]];
    this.movers = [];
    for (let i = 0; i < 26; i++) this.movers.push({ tr: tracks[i % 3], off: r(), sp: (0.006 + r() * 0.006) * (r() < 0.5 ? 1 : -1), cart: r() < 0.45, lat: (r() - 0.5) * 4 });
    const hmat = new THREE.MeshStandardMaterial({ color: 0x4a3426, roughness: 0.9 });
    this.horseIM = new THREE.InstancedMesh(horseGeo(), hmat, this.movers.length);
    this.cartIM = new THREE.InstancedMesh(cartGeo(), new THREE.MeshStandardMaterial({ color: 0x7a6248, roughness: 0.95 }), this.movers.length);
    for (const m of [this.horseIM, this.cartIM]) { m.castShadow = true; m.frustumCulled = false; this.object.add(m); }
    this.tmp = { m4, q: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) };
  }

  update(state) {
    const { year, t } = state;
    const { m4, q, p, s, up } = this.tmp;
    for (const it of this.items) {
      const vis = smooth(it.from, it.from + 1, year) * (1 - smooth(it.to - 4, it.to, year));
      it.obj.visible = vis > 0.02;
      if (it.obj.isGroup) it.obj.scale.y = Math.max(0.01, vis);
    }
    this.houses.forEach(([x, z, y0, y1], i) => {
      const g = smooth(y0, y0 + 2, year) * (1 - smooth(y1 - 3, y1, year));
      const [w, d, h] = this.houseSize[i];
      if (g < 0.02) { m4.makeScale(0, 0, 0); this.houseIM.setMatrixAt(i, m4); this.roofIM.setMatrixAt(i, m4); return; }
      q.setFromAxisAngle(up, this.houseRot[i]);
      this.houseIM.setMatrixAt(i, m4.compose(p.set(x, 0, z), q, s.set(w, h * g, d)));
      this.roofIM.setMatrixAt(i, m4.compose(p.set(x, h * g, z), q, s.set(w * 1.08, 2.6 * g, d * 1.12)));
    });
    this.houseIM.instanceMatrix.needsUpdate = true; this.roofIM.instanceMatrix.needsUpdate = true;
    const moverVis = 1 - smooth(1925, 1950, year);
    this.horseIM.visible = this.cartIM.visible = moverVis > 0.01;
    this.movers.forEach((mv, i) => {
      const [[ax, az], [bx, bz]] = mv.tr;
      const u = (((mv.off + t * mv.sp) % 1) + 1) % 1;
      const dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz);
      const x = ax + dx * u - (dz / L) * mv.lat, z = az + dz * u + (dx / L) * mv.lat;
      const yaw = Math.atan2(-dz, dx) + (mv.sp < 0 ? Math.PI : 0);
      q.setFromAxisAngle(up, yaw);
      const bob = Math.abs(Math.sin(t * 9 + i)) * 0.08;
      this.horseIM.setMatrixAt(i, m4.compose(p.set(x, bob, z), q, s.set(1, 1, 1)));
      if (mv.cart) this.cartIM.setMatrixAt(i, m4.compose(p.set(x, 0, z), q, s.set(1, 1, 1)));
      else this.cartIM.setMatrixAt(i, m4.makeScale(0, 0, 0));
    });
    this.horseIM.instanceMatrix.needsUpdate = true; this.cartIM.instanceMatrix.needsUpdate = true;
  }
}
