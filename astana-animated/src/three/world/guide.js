// «Ерлан» — the recurring guide: a stylised young Kazakh man (≈23 y.o.),
// built from smooth primitives with a small rig (walk, wave, point, present,
// selfie, idle), blinking eyes and lip movement driven by the voiceover.
import * as THREE from 'three';
import { clamp, smooth } from '../util.js';
import env from '../../data/vo_env.json';

const M = (color, rough = 0.6, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
const SKIN = M(0xd29a72, 0.5, { emissive: 0x401a0c, emissiveIntensity: 0.06 });
const SKIN_LID = M(0xc48a64, 0.55);
const HAIR = M(0x1a1310, 0.5);
const JACKET = M(0x2c4a7c, 0.6);
const JACKET_D = M(0x233c66, 0.6);
const TEE = M(0xf3f1ea, 0.8);
const PANTS = M(0xc6b087, 0.8);
const SHOE = M(0xf6f6f3, 0.45);
const SOLE = M(0x8d8f93, 0.7);
const DARK = M(0x2a1a12, 0.4);
const WHITE = M(0xffffff, 0.2);
const IRIS = M(0x4a2c18, 0.25);
const BLACK = M(0x0b0807, 0.3);
const LIP = M(0x7a3b2e, 0.5);
const MOUTH = M(0x3b1611, 0.7);
const GOLD = new THREE.MeshStandardMaterial({ color: 0xe0b04a, metalness: 1, roughness: 0.25 });
const PHONE = M(0x15171b, 0.3);

function mesh(geo, mat, pos = [0, 0, 0], scale = [1, 1, 1], rot = [0, 0, 0]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.scale.set(...scale); m.rotation.set(...rot);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
const sph = (r, ws = 32, hs = 24) => new THREE.SphereGeometry(r, ws, hs);
const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 16);

export class Guide {
  constructor() {
    const root = (this.object = new THREE.Group());
    this.rig = {};
    const hips = (this.rig.hips = new THREE.Group()); hips.position.y = 0.86; root.add(hips);
    // pelvis
    hips.add(mesh(sph(0.16), PANTS, [0, 0.02, 0], [1.05, 0.7, 0.75]));
    const chest = (this.rig.chest = new THREE.Group()); chest.position.y = 0.08; hips.add(chest);
    // torso: sculpted jacket (lathe profile), open front showing the tee
    const prof = [[0.001, 0], [0.165, 0.0], [0.178, 0.07], [0.182, 0.18], [0.2, 0.3], [0.212, 0.38], [0.2, 0.43], [0.16, 0.475], [0.09, 0.5], [0.001, 0.505]].map(([r, y]) => new THREE.Vector2(r, y));
    chest.add(mesh(new THREE.LatheGeometry(prof, 36), JACKET, [0, 0.0, 0], [1, 1, 0.68]));
    chest.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 24, 1, true, -0.15, 0.3), TEE, [0, 0.28, -0.268], [1, 1, 1]));
    for (const s of [-1, 1]) chest.add(mesh(new THREE.BoxGeometry(0.035, 0.36, 0.02), JACKET_D, [s * 0.075, 0.27, 0.132], [1, 1, 1], [0.08, s * 0.35, 0]));
    chest.add(mesh(new THREE.TorusGeometry(0.068, 0.018, 8, 24), JACKET_D, [0, 0.49, -0.005], [1.1, 1, 0.85], [Math.PI / 2 + 0.25, 0, 0]));
    chest.add(mesh(new THREE.CircleGeometry(0.011, 16), GOLD, [-0.115, 0.37, 0.124], [1, 1, 1], [0, -0.55, 0])); // ornament pin
    // neck + head
    chest.add(mesh(new THREE.CylinderGeometry(0.06, 0.066, 0.1, 16), SKIN, [0, 0.52, 0.005]));
    const head = (this.rig.head = new THREE.Group()); head.position.y = 0.535; head.scale.setScalar(1.22); chest.add(head);
    head.add(mesh(sph(0.142), SKIN, [0, 0.15, 0], [0.92, 1.04, 0.97]));               // cranium
    head.add(mesh(sph(0.105), SKIN, [0, 0.095, 0.018], [1.0, 0.88, 0.92]));          // cheeks / jaw
    head.add(mesh(sph(0.045), SKIN, [0, 0.05, 0.075], [1.1, 0.7, 0.8]));              // chin
    for (const s of [-1, 1]) head.add(mesh(sph(0.03, 16, 12), SKIN, [s * 0.128, 0.135, -0.01], [0.42, 1, 0.75]));
    // hair: short neat sides + textured side-swept top
    head.add(mesh(new THREE.SphereGeometry(0.148, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.43), HAIR, [0, 0.166, -0.02], [0.97, 1.0, 1.0], [-0.32, 0, 0]));
    head.add(mesh(new THREE.SphereGeometry(0.146, 36, 12, Math.PI * 0.85, Math.PI * 1.3, Math.PI * 0.26, Math.PI * 0.17), HAIR, [0, 0.152, -0.006], [0.965, 1.0, 1.0]));
    head.add(mesh(sph(0.09, 28, 18), HAIR, [0.018, 0.268, 0.055], [1.28, 0.52, 0.9], [0.42, 0.1, -0.2]));
    head.add(mesh(sph(0.07, 24, 16), HAIR, [-0.05, 0.262, 0.035], [1.1, 0.48, 1.0], [0.25, 0, 0.25]));
    head.add(mesh(sph(0.05, 20, 14), HAIR, [0.07, 0.25, 0.085], [1.1, 0.5, 0.8], [0.6, 0, -0.5]));
    // eyes (large, expressive)
    this.lids = [];
    for (const s of [-1, 1]) {
      const eye = new THREE.Group(); eye.position.set(s * 0.05, 0.148, 0.112); head.add(eye);
      eye.add(mesh(sph(0.028, 24, 18), WHITE, [0, 0, 0], [1, 0.9, 0.55]));
      eye.add(mesh(new THREE.CircleGeometry(0.0175, 28), IRIS, [0, -0.002, 0.0156]));
      eye.add(mesh(new THREE.CircleGeometry(0.009, 24), BLACK, [0, -0.002, 0.0158]));
      eye.add(mesh(new THREE.CircleGeometry(0.0042, 12), WHITE, [0.006, 0.005, 0.016]));
      eye.add(mesh(new THREE.CircleGeometry(0.002, 8), WHITE, [-0.005, -0.006, 0.016]));
      const lid = mesh(new THREE.SphereGeometry(0.0295, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), SKIN_LID, [0, 0, 0], [1.03, 0.2, 0.6]);
      eye.add(lid); this.lids.push(lid);
      head.add(mesh(cap(0.0095, 0.042), HAIR, [s * 0.052, 0.193, 0.118], [1, 1, 0.6], [0, 0, Math.PI / 2 + s * 0.16]));
    }
    head.add(mesh(sph(0.022, 16, 12), SKIN, [0, 0.112, 0.138], [0.95, 0.9, 1.0]));     // nose
    // mouth: closed friendly smile; opening only while speaking
    this.mouth = mesh(sph(0.017, 16, 12), MOUTH, [0, 0.064, 0.118], [1.15, 0.05, 0.4]);
    head.add(this.mouth);
    head.add(mesh(new THREE.TorusGeometry(0.022, 0.0032, 6, 24, Math.PI * 0.7), LIP, [0, 0.072, 0.121], [1, 0.55, 1], [0, 0, Math.PI * 1.15]));
    // arms
    this.arms = [];
    for (const s of [-1, 1]) {
      const sh = new THREE.Group(); sh.position.set(s * 0.205, 0.405, 0); chest.add(sh);
      sh.add(mesh(sph(0.056), JACKET, [0, -0.01, 0], [1, 0.9, 0.9]));
      sh.add(mesh(cap(0.056, 0.22), JACKET, [0, -0.14, 0]));
      const el = new THREE.Group(); el.position.y = -0.29; sh.add(el);
      el.add(mesh(cap(0.05, 0.2), JACKET, [0, -0.12, 0]));
      el.add(mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.03, 16), TEE, [0, -0.235, 0]));
      const hand = new THREE.Group(); hand.position.y = -0.27; el.add(hand);
      hand.add(mesh(sph(0.045, 20, 16), SKIN, [0, -0.035, 0], [0.75, 1.05, 0.55]));
      hand.add(mesh(cap(0.015, 0.03), SKIN, [s * -0.03, -0.03, 0.02], [1, 1, 1], [0, 0, s * 0.6])); // thumb
      this.arms.push({ sh, el, hand, s });
    }
    this.phone = mesh(new THREE.BoxGeometry(0.075, 0.15, 0.009), PHONE, [0, -0.08, 0.035]);
    this.phone.visible = false; this.arms[1].hand.add(this.phone);
    // legs
    this.legs = [];
    for (const s of [-1, 1]) {
      const hip = new THREE.Group(); hip.position.set(s * 0.095, -0.02, 0); hips.add(hip);
      hip.add(mesh(cap(0.08, 0.3), PANTS, [0, -0.19, 0]));
      const kn = new THREE.Group(); kn.position.y = -0.4; hip.add(kn);
      kn.add(mesh(cap(0.07, 0.29), PANTS, [0, -0.18, 0]));
      const ft = new THREE.Group(); ft.position.y = -0.39; kn.add(ft);
      ft.add(mesh(new THREE.BoxGeometry(0.11, 0.07, 0.26), SHOE, [0, -0.02, 0.045]));
      ft.add(mesh(new THREE.BoxGeometry(0.115, 0.025, 0.27), SOLE, [0, -0.058, 0.045]));
      ft.add(mesh(sph(0.055, 16, 12), SHOE, [0, -0.02, 0.16], [1, 0.62, 0.8]));
      this.legs.push({ hip, kn, ft, s });
    }
    root.visible = false;
  }

  // g = { pos:[x,y,z], yaw, action, speed, lookAt:[x,y,z] (camera), talk:bool, phase }
  update(state, cam) {
    const g = state.guide;
    this.object.visible = !!g;
    if (!g) return;
    const t = state.t;
    const R = this.rig;
    const walk = g.action === 'walk';
    const sp = g.speed ?? 1.2;
    const ph = t * sp * 4.6 + (g.phase || 0);
    const [x, y, z] = g.pos;
    this.object.position.set(x, y, z);
    this.object.rotation.y = g.yaw || 0;
    // breathing / bob
    const breathe = Math.sin(t * 2.1) * 0.006;
    R.hips.position.y = 0.86 + (walk ? Math.abs(Math.cos(ph)) * 0.035 - 0.02 : 0);
    R.hips.rotation.y = walk ? Math.sin(ph) * 0.08 : Math.sin(t * 0.7) * 0.02;
    R.chest.rotation.y = walk ? -Math.sin(ph) * 0.12 : 0;
    R.chest.rotation.x = 0.03 + breathe;
    R.chest.scale.setScalar(1 + breathe * 0.6);
    // legs
    this.legs.forEach(({ hip, kn, ft, s }) => {
      if (walk) {
        const a = Math.sin(ph + (s > 0 ? Math.PI : 0));
        hip.rotation.x = -a * 0.42;
        kn.rotation.x = Math.max(0, Math.sin(ph + (s > 0 ? Math.PI : 0) + 1.3)) * 0.75;
        ft.rotation.x = -0.15 * a;
      } else {
        hip.rotation.x = s > 0 ? -0.04 : 0.02; kn.rotation.x = 0.03; ft.rotation.x = 0;
        hip.rotation.z = s * 0.035;
      }
    });
    // arms
    const [L, Rr] = this.arms;
    const setArm = (a, sx, sz, ex, ez = 0, hz = 0) => { a.sh.rotation.set(sx, 0, sz); a.el.rotation.set(ex, 0, ez); a.hand.rotation.set(0, 0, hz); };
    const swing = walk ? Math.sin(ph) * 0.45 : 0;
    setArm(L, swing, -0.12 + Math.sin(t * 1.3) * 0.015, -0.25 - (walk ? Math.max(0, swing) * 0.4 : 0.05));
    setArm(Rr, -swing, 0.12 - Math.sin(t * 1.3) * 0.015, -0.25 - (walk ? Math.max(0, -swing) * 0.4 : 0.05));
    this.phone.visible = false;
    const k = g.blend ?? 1;
    if (g.action === 'wave') {
      const w = smooth(g.t0 ?? 0, (g.t0 ?? 0) + 0.45, t) * k;
      Rr.sh.rotation.set(-0.25 * w, 0, 0.12 + 2.55 * w);
      Rr.el.rotation.set(0, 0, w * (0.35 + Math.sin(t * 9) * 0.38));
    } else if (g.action === 'point') {
      const w = smooth(g.t0 ?? 0, (g.t0 ?? 0) + 0.5, t) * k;
      Rr.sh.rotation.set(-1.25 * w, 0, 0.12 + 0.35 * w);
      Rr.el.rotation.set(-0.15 * w, 0, 0);
    } else if (g.action === 'present') {
      const w = (0.6 + 0.4 * Math.sin(t * 1.6)) * k;
      for (const a of this.arms) { a.sh.rotation.set(-0.55 * w, 0, a.s * (0.12 + 0.45 * w)); a.el.rotation.set(-0.6 * w, 0, 0); }
    } else if (g.action === 'selfie') {
      Rr.sh.rotation.set(-1.45, 0.0, 0.55);
      Rr.el.rotation.set(-0.35, 0, 0.25);
      Rr.hand.rotation.set(0, Math.PI, 0);
      this.phone.visible = true;
      L.sh.rotation.set(0, 0, -0.25); L.el.rotation.set(-0.3, 0, 0);
    }
    // head looks toward the camera (or a target), clamped
    const look = g.lookAt || (cam ? [cam.position.x, cam.position.y, cam.position.z] : null);
    if (look) {
      const hp = new THREE.Vector3(); R.head.getWorldPosition(hp);
      const d = new THREE.Vector3(look[0] - hp.x, look[1] - hp.y - 0.12, look[2] - hp.z);
      const yawW = Math.atan2(d.x, d.z) - (g.yaw || 0) - R.hips.rotation.y - R.chest.rotation.y;
      const yawN = Math.atan2(Math.sin(yawW), Math.cos(yawW));
      R.head.rotation.y = clamp(yawN, -0.9, 0.9);
      R.head.rotation.x = clamp(-Math.atan2(d.y, Math.hypot(d.x, d.z)), -0.35, 0.35);
    }
    if (g.action === 'selfie') R.head.rotation.z = 0.12;
    else R.head.rotation.z = Math.sin(t * 0.9) * 0.03;
    // blink every ~3.3 s
    const bl = (t * 0.3 + (g.phase || 0)) % 1;
    const blink = bl < 0.045 ? Math.sin((bl / 0.045) * Math.PI) : 0;
    for (const lid of this.lids) { lid.scale.y = 0.2 + 0.8 * blink; lid.rotation.x = -0.35 * (1 - blink); }
    // lips follow the voiceover envelope
    const e = g.talk ? env.v[Math.min(env.v.length - 1, Math.max(0, Math.round(t * env.fps)))] : 0;
    this.mouth.scale.y = 0.05 + 0.45 * e;
    R.head.rotation.x += e * 0.05;
  }
}
