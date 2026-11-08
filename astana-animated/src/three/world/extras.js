// Scene-specific layers: Nurzhol boulevard paving + lamps, 3D map labels,
// population light-points, economic "data arcs".
import * as THREE from 'three';
import { mulberry, smooth, clamp } from '../util.js';
import { AXIS_Z, riverZ } from '../geo.js';

export class Boulevard {
  constructor() {
    this.object = new THREE.Group();
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#cfc7b9'; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 32) for (let x = 0; x < 512; x += 64) {
      const o = (y / 32) % 2 ? 32 : 0; const v = 190 + Math.floor(((x * 7 + y * 13) % 37) - 18);
      g.fillStyle = `rgb(${v + 8},${v + 2},${v - 8})`; g.fillRect(x + o + 1, y + 1, 62, 30);
    }
    const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3300 / 12, 140 / 12); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const pave = new THREE.Mesh(new THREE.PlaneGeometry(3300, 140), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.0 }));
    pave.rotation.x = -Math.PI / 2; pave.position.set(-75, 0.25, AXIS_Z); pave.receiveShadow = true;
    // lawns either side
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x4d7a32, roughness: 0.95 });
    for (const dz of [-40, 40]) {
      const l = new THREE.Mesh(new THREE.PlaneGeometry(3300, 22), lawnMat); l.rotation.x = -Math.PI / 2; l.position.set(-75, 0.32, AXIS_Z + dz); l.receiveShadow = true; this.object.add(l);
    }
    // water channel along the centre (reflective strip)
    const ch = new THREE.Mesh(new THREE.PlaneGeometry(2900, 6), new THREE.MeshStandardMaterial({ color: 0x0f2a36, roughness: 0.04, metalness: 0.2, envMapIntensity: 1.8 }));
    ch.rotation.x = -Math.PI / 2; ch.position.set(-75, 0.34, AXIS_Z + 24); ch.receiveShadow = true;
    this.object.add(pave, ch);
    // lamp posts
    const pts = [];
    for (let x = -1640; x < 1520; x += 30) for (const dz of [-26, 26]) if (Math.abs(x) > 80) pts.push([x, AXIS_Z + dz]);
    const pole = new THREE.CylinderGeometry(0.09, 0.13, 7, 6); pole.translate(0, 3.5, 0);
    const lamp = new THREE.SphereGeometry(0.32, 10, 8); lamp.translate(0, 7.1, 0);
    this.poles = new THREE.InstancedMesh(pole, new THREE.MeshStandardMaterial({ color: 0x2a2d31, metalness: 0.6, roughness: 0.4 }), pts.length);
    this.lampMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd9a0, emissiveIntensity: 0 });
    this.lamps = new THREE.InstancedMesh(lamp, this.lampMat, pts.length);
    const m4 = new THREE.Matrix4();
    pts.forEach(([x, z], i) => { m4.makeTranslation(x, 0, z); this.poles.setMatrixAt(i, m4); this.lamps.setMatrixAt(i, m4); });
    this.poles.castShadow = true;
    this.object.add(this.poles, this.lamps);
  }
  update(state) {
    this.object.visible = state.year >= 2003;
    this.lampMat.emissiveIntensity = 2.2 * state.night;
  }
}

function labelSprite(text, sub, color = '#ffffff') {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
  const g = c.getContext('2d');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,10,30,0.9)'; g.shadowBlur = 18;
  g.fillStyle = color; g.font = '600 74px Montserrat, Inter, sans-serif';
  g.fillText(text, 512, sub ? 100 : 128);
  if (sub) { g.font = '500 44px Montserrat, Inter, sans-serif'; g.fillStyle = 'rgba(200,225,255,0.9)'; g.fillText(sub, 512, 182); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, fog: false }));
  s.renderOrder = 10;
  return s;
}

export class MapLayer {
  constructor(buildings) {
    this.object = new THREE.Group();
    // district names (approximate positions, stylised map)
    const D = [['ЕСІЛ', 'ауданы', -300, 2350], ['НҰРА', 'ауданы', -2300, 3700], ['САРЫАРҚА', 'ауданы', -2500, -2300], ['БАЙҚОҢЫР', 'ауданы', 200, -2700], ['АЛМАТЫ', 'ауданы', 3200, -700]];
    this.labels = D.map(([n, s, x, z]) => { const l = labelSprite(n, s); l.position.set(x, 500, z); l.scale.set(1500, 375, 1); return l; });
    const river = labelSprite('ЕСІЛ ӨЗЕНІ', null, '#8fe3ff'); river.position.set(-3000, 300, riverZ(-3000) - 250); river.scale.set(1300, 325, 1);
    this.labels.push(river);
    this.labels.forEach((l) => this.object.add(l));
    // population light-points on residential buildings
    const r = mulberry(1538);
    const res = buildings.filter((b) => b.boxes.length && (b.kind === 'modern' || b.kind === 'soviet' || b.kind === 'tower'));
    const N = 6000;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const b = res[Math.floor(r() * res.length)].boxes[0];
      pos[i * 3] = b.x + (r() - 0.5) * b.w; pos[i * 3 + 1] = 5 + r() * (b.h + 20); pos[i * 3 + 2] = b.z + (r() - 0.5) * b.d;
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.dotMat = new THREE.PointsMaterial({ color: new THREE.Color(1.0, 0.75, 0.35), size: 2.2 * (window.PLATE?.scale || 0.75) / 0.5, sizeAttenuation: false, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    this.dots = new THREE.Points(geo, this.dotMat);
    this.N = N;
    this.object.add(this.dots);
  }
  update(state) {
    const m = state.map || 0;
    this.object.visible = m > 0.01;
    this.labels.forEach((l, i) => { l.material.opacity = smooth(0.4 + i * 0.08, 0.8 + i * 0.08, m) * (state.labels ?? 1); });
    // fraction of points shown follows population: 1.0M (2017) -> 1.538M (2026)
    const pop = state.pop || 0;
    this.dots.geometry.setDrawRange(0, Math.floor(this.N * clamp(pop / 1.6)));
    this.dotMat.opacity = 0.55 * m;
  }
}

export class DataArcs {
  constructor(buildings) {
    this.object = new THREE.Group();
    const r = mulberry(18);
    const towers = buildings.filter((b) => b.kind === 'tower' || (b.kind === 'modern' && b.boxes[0].h > 50));
    const anchors = towers.map((b) => { const bx = b.boxes[b.boxes.length - 1]; return [bx.x, bx.y0 + bx.h, bx.z]; });
    this.uni = { uT: { value: 0 }, uAmt: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute float aU; attribute float aSeed; varying float vU; varying float vS; void main(){ vU = aU; vS = aSeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform float uT; uniform float uAmt; varying float vU; varying float vS;
        void main(){ float head = fract(uT * 0.35 + vS); float d = vU - head; float pulse = exp(-abs(d) * 18.0);
          float grow = step(vU, uAmt * 1.2 - vS * 0.2);
          vec3 c = mix(vec3(0.2, 0.7, 1.0), vec3(1.0, 0.8, 0.35), step(0.5, fract(vS * 7.0)));
          gl_FragColor = vec4(c * (0.35 + 2.5 * pulse), (0.25 + pulse) * grow); }`,
    });
    const N = 90;
    for (let i = 0; i < N && anchors.length > 2; i++) {
      const a = anchors[Math.floor(r() * anchors.length)], b = anchors[Math.floor(r() * anchors.length)];
      const d = Math.hypot(a[0] - b[0], a[2] - b[2]);
      if (d < 300 || d > 3000) continue;
      const mid = [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + d * 0.25, (a[2] + b[2]) / 2];
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...a), new THREE.Vector3(...mid), new THREE.Vector3(...b));
      const pts = curve.getPoints(64);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const u = new Float32Array(pts.length).map((_, k) => k / (pts.length - 1));
      geo.setAttribute('aU', new THREE.BufferAttribute(u, 1));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(pts.length).fill(r()), 1));
      this.object.add(new THREE.Line(geo, mat));
    }
  }
  update(state) {
    this.uni.uT.value = state.t; this.uni.uAmt.value = state.data || 0;
    this.object.visible = (state.data || 0) > 0.01;
  }
}

// Wind-swept steppe grass (instanced 3-blade clumps) for low, close shots.
export class Grass {
  constructor(x0, x1, z0, z1, n = 60000) {
    const r = mulberry(77);
    const pos = [];
    for (let b = 0; b < 3; b++) {
      const a = (b / 3) * Math.PI + 0.3, w = 0.06, h = 1;
      const cx = Math.cos(a) * 0.05, cz = Math.sin(a) * 0.05;
      pos.push(cx - Math.sin(a) * w, 0, cz + Math.cos(a) * w, cx + Math.sin(a) * w, 0, cz - Math.cos(a) * w, cx * 3, h, cz * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(pos.length / 3).fill([0, 1, 0]).flat(), 3));
    this.uni = { uT: { value: 0 } };
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, side: THREE.DoubleSide });
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uT = this.uni.uT;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uT;')
        .replace('#include <begin_vertex>', `vec3 transformed = vec3(position);
          vec4 ip = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float k = position.y * position.y;
          float gust = sin(uT * 1.7 + ip.x * 0.045 + ip.z * 0.02) * 0.5 + 0.5;
          float wv = sin(uT * 3.1 + ip.x * 0.35 + ip.z * 0.21);
          transformed.x += k * (0.22 + 0.25 * gust + 0.08 * wv);
          transformed.z += k * 0.06 * wv;
          transformed.y -= k * 0.08 * gust;`);
    };
    mat.customProgramCacheKey = () => 'grass-v1';
    this.im = new THREE.InstancedMesh(geo, mat, n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), z = z0 + r() * (z1 - z0);
      const h = 0.45 + r() * 0.65;
      q.setFromAxisAngle(up, r() * Math.PI * 2);
      m4.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1 + r(), h, 1 + r()));
      this.im.setMatrixAt(i, m4);
      this.im.setColorAt(i, c.setHSL(0.15 + r() * 0.09, 0.5 + r() * 0.2, 0.36 + r() * 0.14));
    }
    this.im.castShadow = false; this.im.receiveShadow = true; this.im.frustumCulled = false;
    this.object = this.im;
  }
  update(state) { this.uni.uT.value = state.t; this.im.visible = !!state.grass; }
}
