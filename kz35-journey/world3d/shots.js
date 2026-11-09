// 3D shots for «Қазақстан — 35 жылдағы даму жолы». Film-time ranges; each range is baked to its own clip.
// Landscapes are REAL: Copernicus Sentinel-2 imagery draped over AWS Terrain Tiles elevation.
import { THREE, rng, clamp, lerp, seg, ease, makeSky, ClothFlag, goldGlyphs, pointsCloud, softDot } from "./engine.js";
import * as A from "./assets.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GLYPHS } from "./assets/glyphs.js";
import { KZ_RINGS } from "./assets/kz_lonlat.js";

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const sunVec = (e, a) => { const E = THREE.MathUtils.degToRad(e), Az = THREE.MathUtils.degToRad(a); return V3(Math.sin(Az) * Math.cos(E), Math.sin(E), -Math.cos(Az) * Math.cos(E)).normalize(); };
const cam = (fov = 42, near = 1, far = 200000) => new THREE.PerspectiveCamera(fov, 1080 / 1920, near, far);
const path = (c, t, pts) => { let i = 0; while (i < pts.length - 2 && t > pts[i + 1][0]) i++; const [t0, p0, l0] = pts[i], [t1, p1, l1] = pts[Math.min(i + 1, pts.length - 1)]; const k = t1 > t0 ? ease.inOut(clamp((t - t0) / (t1 - t0), 0, 1)) : 0; c.position.lerpVectors(p0, p1, k); c.lookAt(new THREE.Vector3().lerpVectors(l0, l1, k)); };
const flagTexture = () => { const c = window.KZ.flagCanvas(2048); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const flagMat = (env) => { const tex = flagTexture(); return new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.2, side: THREE.DoubleSide, roughness: 0.72, metalness: 0, envMap: env }); };

function skyScene({ sun, sky, fog, fogD }) {
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(fog, fogD);
  const s = makeSky(); s.scale.setScalar(150000); scene.add(s);
  const u = s.material.uniforms; u.sunDir.value.copy(sun);
  for (const k in sky) { if (u[k].value?.isColor) u[k].value.set(sky[k]); else u[k].value = sky[k]; }
  u.halo.value *= 0.6; u.sunInt.value *= 0.6;
  return { scene, sky: s };
}
// real terrain: Sentinel-2 photo draped on real elevation, unlit (the photo carries the real light)
function drape(ctx, { exag = 1.15, tint = 0xffffff } = {}) {
  const { dem, demMeta, tex } = ctx.drape;
  const G = demMeta.grid, geo = new THREE.PlaneGeometry(demMeta.width_m, demMeta.height_m, G - 1, G - 1); geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, dem[i] * exag);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, color: tint }));
  m.userData.h = (x, z) => { const u = clamp((x / demMeta.width_m + 0.5) * (G - 1), 0, G - 1), v = clamp((z / demMeta.height_m + 0.5) * (G - 1), 0, G - 1); return dem[Math.round(v) * G + Math.round(u)] * exag; };
  return m;
}
const ll = (lat, lon, r) => { const phi = THREE.MathUtils.degToRad(90 - lat), th = THREE.MathUtils.degToRad(lon + 180); return V3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th)); };
function earth(ctx, { night = false } = {}) {
  const kzDir = ll(47, 68, 1).normalize();
  const sunD = night ? kzDir.clone().negate().add(V3(0, 0.25, 0)).applyAxisAngle(V3(0, 1, 0), 0.9).normalize() : kzDir.clone().applyAxisAngle(V3(0, 1, 0), 0.55).add(V3(0, 0.15, 0)).normalize();
  const mat = new THREE.ShaderMaterial({ uniforms: { day: { value: ctx.tex.earthDay }, nightT: { value: ctx.tex.earthNight }, clouds: { value: ctx.tex.earthClouds }, sun: { value: sunD } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `uniform sampler2D day, nightT, clouds; uniform vec3 sun; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ float l = dot(normalize(vN), sun); float k = smoothstep(-0.15, 0.25, l);
        vec3 d = texture2D(day, vUv).rgb; vec3 n = texture2D(nightT, vUv).rgb * vec3(3.2, 2.4, 1.4); float cl = texture2D(clouds, vUv).r;
        vec3 c = mix(n, d * (0.18 + 0.85 * max(l, 0.0)), k); c = mix(c, vec3(0.92) * (0.1 + 0.8 * max(l, 0.0)), cl * 0.45 * (0.3 + 0.7 * k));
        float rim = pow(1.0 - max(dot(normalize(vN), vV), 0.0), 3.0); c += vec3(0.3, 0.55, 1.0) * rim * (0.25 + k * 1.1);
        gl_FragColor = vec4(c, 1.0); }` });
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(10, 128, 96), mat));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(10.45, 64, 32), new THREE.ShaderMaterial({ transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float r = pow(1.0 - abs(dot(normalize(vN), vV)), 2.0); gl_FragColor = vec4(vec3(0.35, 0.6, 1.0) * r * 2.0, r); }` })));
  // Kazakhstan border in gold
  const pts = []; KZ_RINGS.forEach((ring) => { for (let i = 0; i < ring.length - 1; i++) { const a = ll(ring[i][1], ring[i][0], 10.03), b = ll(ring[i + 1][1], ring[i + 1][0], 10.03); pts.push(a.x, a.y, a.z, b.x, b.y, b.z); } });
  const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const border = new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: new THREE.Color(5, 3.6, 1.2), transparent: true, opacity: 1 })); g.add(border);
  return { g, border, sunD };
}

export function buildShots(ctx) {
  const { env } = ctx, S = [];
  const add = (name, start, end, build) => S.push({ name, start, end, xfade: 0, build });

  /* ---- 01 · dawn over the Alatau (real Sentinel-2 + elevation) ---- */
  const dawn = sunVec(5, 100);
  const dawnLook = { exposure: 1.05, temp: 0.35, tint: 0.04, sat: 0.95, contrast: 1.08, lift: [0.01, 0.012, 0.03], gain: [1.03, 0.99, 0.94], shadowTint: [-0.01, 0.0, 0.035], highTint: [0.05, 0.02, -0.01], vignette: 0.45, grain: 0.03, bloom: 0.45, bloomThr: 1.0, rays: 0.2, raysThr: 1.2, flare: 0.3, dof: 0 };
  const dawnSky = { zenith: 0x13306a, horizon: 0xf0b48a, ground: 0x3a3040, sunColor: 0xffbf86, sunInt: 20, halo: 1.6, cloudCover: 0.35, cloudLit: 0xffc7a0, cloudDark: 0x4a5070, cloudScale: 1.0, haze: 0.12 };
  add("opening", 0, 6.0, () => {
    const w = skyScene({ sun: dawn, sky: dawnSky, fog: 0xc9a8a0, fogD: 0.000035 });
    const t = drape(ctx, { tint: 0xfff0e4 }); w.scene.add(t);
    const c = cam(46, 5, 200000);
    return { scene: w.scene, camera: c, look: dawnLook,
      update(lt) { path(c, lt, [[0, V3(-2500, 2900, -13500), V3(1500, 2400, 6000)], [6.0, V3(-1800, 2700, -8200), V3(1800, 2900, 8000)]]); w.sky.material.uniforms.cloudOff.value.set(lt * 0.01, 0); this.sunWorld = c.position.clone().addScaledVector(dawn, 100000); } };
  });
  /* ---- 02 · the flag at sunrise, mountains below ---- */
  add("flag_dawn", 5.4, 10.4, () => {
    const w = skyScene({ sun: dawn, sky: dawnSky, fog: 0xc9a8a0, fogD: 0.000035 });
    const t = drape(ctx, { tint: 0xfff0e4 }); w.scene.add(t);
    w.scene.add(new THREE.HemisphereLight(0xb0c0e8, 0x403028, 1.0));
    const sl = new THREE.DirectionalLight(0xffc690, 2.6); sl.position.copy(dawn).multiplyScalar(100); w.scene.add(sl);
    const base = V3(-1200, 3150, -6500);
    const pole = A.flagPole(16); pole.position.copy(base); w.scene.add(pole);
    const flag = new ClothFlag({ width: 6, height: 3, nx: 34, ny: 17, material: flagMat(env.sunrise.env), windDir: V3(1, 0, 0.3), wind: 9.5, seed: 1991 }); w.scene.add(flag.mesh);
    const anchor = () => V3(base.x + 0.2, base.y + 15.6, base.z);
    const c = cam(38, 0.3, 200000);
    return { scene: w.scene, camera: c, look: { ...dawnLook, dof: 0.6, focus: 15, focusRange: 25, rays: 0.3, flare: 0.4 },
      update(lt, tt) { flag.at(tt, 5.4, anchor); path(c, lt, [[0, base.clone().add(V3(-6, 6.5, 14)), base.clone().add(V3(2.5, 12.5, 0))], [5, base.clone().add(V3(-8.5, 8.0, 12)), base.clone().add(V3(3, 13.6, 0))]]); this.sunWorld = c.position.clone().addScaledVector(dawn, 100000); } };
  });
  /* ---- 03 · the flag's fabric (1991) ---- */
  add("flag_macro", 13.5, 18.8, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x04070e); scene.environment = env.studio.env;
    scene.add(new THREE.HemisphereLight(0x8899bb, 0x221a10, 0.6));
    const key = new THREE.DirectionalLight(0xffe2b0, 3.2); key.position.set(-4, 6, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0x88bbff, 1.4); rim.position.set(6, -2, -6); scene.add(rim);
    const flag = new ClothFlag({ width: 6, height: 3, nx: 40, ny: 20, material: flagMat(env.studio.env), windDir: V3(1, 0, 0.2), wind: 8, seed: 4 }); scene.add(flag.mesh);
    const c = cam(30, 0.1, 100);
    return { scene, camera: c, look: { exposure: 1.05, temp: 0.15, sat: 0.95, contrast: 1.06, vignette: 0.55, grain: 0.045, focus: 4.6, focusRange: 1.8, dof: 1, bloom: 0.3, bloomThr: 1.1 },
      update(lt, tt) { flag.at(tt, 13.5, () => V3(-3, 1.5, 0)); flag.geo.computeBoundingBox(); const bb = flag.geo.boundingBox, cx = (bb.min.x + bb.max.x) / 2 + 0.6, cy = (bb.min.y + bb.max.y) / 2 + 0.2;
        path(c, lt, [[0, V3(cx - 0.9, cy - 0.1, 5.6), V3(cx, cy, 0)], [5.3, V3(cx + 0.4, cy - 0.3, 4.4), V3(cx + 0.2, cy, 0)]]); } };
  });
  /* ---- 04 · Earth: a recognised member of the international community ---- */
  add("earth_day", 25.8, 31.9, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000207);
    const e = earth(ctx); scene.add(e.g);
    const stars = pointsCloud(1600, 3, (t, s) => { const a = s[0] * 6.283, b = Math.acos(2 * s[1] - 1); return [Math.sin(b) * Math.cos(a) * 400, Math.cos(b) * 400, Math.sin(b) * Math.sin(a) * 400]; }, { size: 1.1, color: 0xffffff, map: softDot(), opacity: 0.8 }); stars.update(0); scene.add(stars);
    const astana = ll(51.17, 71.43, 10.05);
    const caps = [[40.71, -74.0], [46.2, 6.14], [48.85, 2.35], [55.75, 37.62], [39.9, 116.4], [35.68, 139.69], [41.0, 28.97], [25.2, 55.27], [28.61, 77.21], [52.52, 13.4], [51.5, -0.12], [1.35, 103.82], [37.56, 126.97]];
    const arcs = caps.map(([la, lo], i) => { const b = ll(la, lo, 10.05), m = astana.clone().add(b).multiplyScalar(0.5); m.setLength(10 + astana.distanceTo(b) * 0.35); const cu = new THREE.QuadraticBezierCurve3(astana, m, b); const tb = new THREE.Mesh(new THREE.TubeGeometry(cu, 64, 0.022, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(4.5, 3.3, 1.1) })); e.g.add(tb); const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 5, 3) })); dot.position.copy(b); e.g.add(dot); return { tb, n: tb.geometry.index.count, dot, d: i * 0.13 }; });
    const c = cam(30, 0.1, 2000);
    return { scene, camera: c, look: { exposure: 0.95, temp: -0.05, sat: 1.1, contrast: 1.1, vignette: 0.45, grain: 0.025, bloom: 0.6, bloomThr: 1.0, dof: 0 },
      update(lt) { e.g.rotation.y = lerp(-0.35, 0.08, lt / 6.1);
        arcs.forEach((a) => { const k = seg(lt, 0.8 + a.d, 2.0 + a.d); a.tb.geometry.setDrawRange(0, Math.floor((a.n * k) / 3) * 3); a.dot.visible = k > 0.98; });
        const dir = ll(48, 68, 1).applyAxisAngle(V3(0, 1, 0), e.g.rotation.y).normalize();
        c.position.copy(dir.clone().multiplyScalar(lerp(66, 52, ease.inOut(clamp(lt / 6.1, 0, 1))))).add(V3(0, -8, 0)); c.lookAt(0, 0.5, 0); } };
  });
  /* ---- 05 · natural wealth: over the Big Almaty Lake and the peaks ---- */
  add("nature", 43.2, 47.0, () => {
    const sun = sunVec(38, 150);
    const w = skyScene({ sun, sky: { zenith: 0x1f5cb0, horizon: 0xc8daf0, ground: 0x404a50, sunColor: 0xfff2dc, sunInt: 10, halo: 0.8, cloudCover: 0.42, cloudLit: 0xffffff, cloudDark: 0x8a9ab8, haze: 0.06 }, fog: 0xbfd0e4, fogD: 0.00003 });
    const t = drape(ctx); w.scene.add(t);
    const lake = V3(-1200, 0, 3100); lake.y = t.userData.h(lake.x, lake.z);
    const c = cam(44, 5, 200000);
    return { scene: w.scene, camera: c, look: { exposure: 1.05, temp: 0.05, sat: 1.08, contrast: 1.1, vignette: 0.4, grain: 0.025, bloom: 0.3, bloomThr: 1.3, dof: 0 },
      update(lt) { path(c, lt, [[0, lake.clone().add(V3(-2600, 1700, -5200)), lake.clone().add(V3(0, 100, 0))], [3.8, lake.clone().add(V3(-1500, 1150, -3000)), lake.clone().add(V3(300, 300, 1200))]]); } };
  });
  /* ---- 06 · AI and digital infrastructure (illustrative) ---- */
  add("datacenter", 85.9, 89.4, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x02050c); scene.fog = new THREE.FogExp2(0x02060f, 0.035);
    scene.add(new THREE.HemisphereLight(0x3a5a8a, 0x05070a, 0.6));
    const ledT = (() => { const c = document.createElement("canvas"); c.width = 128; c.height = 512; const g = c.getContext("2d"); const r = rng(5); g.fillStyle = "#0b0f18"; g.fillRect(0, 0, 128, 512); for (let y = 6; y < 512; y += 14) { g.fillStyle = "#151b28"; g.fillRect(6, y, 116, 10); for (let x = 12; x < 116; x += 9) if (r() < 0.35) { g.fillStyle = r() < 0.8 ? "#36c9ff" : "#ffd36a"; g.fillRect(x, y + 3, 4, 3); } } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const rackM = new THREE.MeshLambertMaterial({ map: ledT, emissive: 0xffffff, emissiveMap: ledT, emissiveIntensity: 1.6 });
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
    net.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: new THREE.Color(0.6, 2.2, 3.5), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })));
    const pulses = pointsCloud(300, 8, (t, s) => { const i = Math.floor(s[0] * (lp.length / 6)), f = (t * (0.6 + s[1]) + s[2]) % 1, o = i * 6; return [lerp(lp[o], lp[o + 3], f), lerp(lp[o + 1], lp[o + 4], f), lerp(lp[o + 2], lp[o + 5], f)]; }, { size: 0.09, color: 0xffffff, map: softDot() });
    pulses.material.color.setRGB(4, 4, 3); net.add(pulses);
    const c = cam(42, 0.05, 200);
    return { scene, camera: c, look: { exposure: 1.1, temp: -0.2, sat: 1.0, contrast: 1.1, vignette: 0.45, grain: 0.03, focus: 7.5, focusRange: 3, dof: 1, bloom: 1.0, bloomThr: 0.8 },
      update(lt, tt) { net.rotation.y = tt * 0.25; pulses.update(tt); path(c, lt, [[0, V3(0.3, 1.5, 2.6), V3(0, 1.4, -10)], [3.5, V3(-0.2, 1.7, -1.6), V3(0, 1.5, -10)]]); } };
  });
  /* ---- 07 · renewable energy (illustrative) ---- */
  add("renewables", 89.0, 92.8, () => {
    A.setEnv(env.day);
    const sun = sunVec(22, 130);
    const w = skyScene({ sun, sky: { zenith: 0x1f5fb8, horizon: 0xcfe0f0, ground: 0x505848, sunColor: 0xfff0d8, sunInt: 12, halo: 1.0, cloudCover: 0.4, cloudLit: 0xffffff, cloudDark: 0x8090b0, haze: 0.05 }, fog: 0xc9d8ea, fogD: 0.00006 });
    w.scene.add(new THREE.HemisphereLight(0xb8cce8, 0x5a5040, 0.6));
    const dl = new THREE.DirectionalLight(0xfff0d8, 3.2); dl.position.copy(sun).multiplyScalar(800); w.scene.add(dl);
    w.scene.add(A.steppe(8000, 72, { color: [140, 135, 90], amp: 0 }));
    w.scene.add(A.solarField(26, 22, 3, env.day));
    const tbs = []; const r = rng(73);
    for (let i = 0; i < 14; i++) { const t = A.turbine(95); t.position.set(-700 + i * 120 + r() * 40, 0, -420 - (i % 3) * 180); t.rotation.y = 0.4; w.scene.add(t); tbs.push(t); }
    const c = cam(42, 1, 40000);
    return { scene: w.scene, camera: c, look: { exposure: 1.0, temp: 0.1, sat: 1.05, contrast: 1.1, vignette: 0.4, grain: 0.025, bloom: 0.4, bloomThr: 1.2, focus: 300, focusRange: 300, dof: 0.3, rays: 0.15, flare: 0.25 },
      update(lt, tt) { A.setEnv(env.day); tbs.forEach((tb, i) => (tb.userData.rotor.rotation.z = tt * 1.2 + i)); path(c, lt, [[0, V3(-90, 22, 130), V3(0, 2, -60)], [3.8, V3(10, 44, 70), V3(-50, 36, -520)]]); this.sunWorld = c.position.clone().addScaledVector(sun, 20000); } };
  });
  /* ---- 08 · the greatest wealth is its people: Kazakhstan's lights at night ---- */
  add("earth_night", 93.8, 98.8, () => {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000207);
    const e = earth(ctx, { night: true }); scene.add(e.g);
    const stars = pointsCloud(1600, 4, (t, s) => { const a = s[0] * 6.283, b = Math.acos(2 * s[1] - 1); return [Math.sin(b) * Math.cos(a) * 400, Math.cos(b) * 400, Math.sin(b) * Math.sin(a) * 400]; }, { size: 1.1, color: 0xffffff, map: softDot(), opacity: 0.8 }); stars.update(0); scene.add(stars);
    const c = cam(26, 0.1, 2000);
    return { scene, camera: c, look: { exposure: 1.15, temp: 0.1, sat: 1.05, contrast: 1.08, vignette: 0.5, grain: 0.025, bloom: 0.9, bloomThr: 0.7, dof: 0 },
      update(lt) { e.g.rotation.y = lerp(-0.12, 0.05, lt / 5); const dir = ll(47, 69, 1).applyAxisAngle(V3(0, 1, 0), e.g.rotation.y).normalize();
        c.position.copy(dir.clone().multiplyScalar(lerp(30, 24, ease.inOut(clamp(lt / 5, 0, 1))))).add(V3(0, -5, 0)); c.lookAt(dir.clone().multiplyScalar(9.5)); } };
  });
  /* ---- 09 · FINALE · sunrise over the mountains, the flag, the golden 35 ---- */
  add("finale", 110.4, 120.0, () => {
    const sun = sunVec(6, 95);
    const w = skyScene({ sun, sky: { ...dawnSky, zenith: 0x163a7c, horizon: 0xffc690, haze: 0.1 }, fog: 0xd4b8a4, fogD: 0.000032 });
    const t = drape(ctx, { tint: 0xfff2e6 }); w.scene.add(t);
    w.scene.add(new THREE.HemisphereLight(0xb0c0e8, 0x403028, 1.0));
    const sl = new THREE.DirectionalLight(0xffc690, 2.6); sl.position.copy(sun).multiplyScalar(100); w.scene.add(sl);
    const CP = V3(1500, 4700, 8500), CT = V3(-1500, 2500, -9000);
    const F = CT.clone().sub(CP).normalize(), Lf = new THREE.Vector3().crossVectors(V3(0, 1, 0), F).normalize();
    const POLE = CP.clone().addScaledVector(F, 150).addScaledVector(Lf, 34).add(V3(0, 64, 0));
    const pole = A.flagPole(80); pole.position.copy(POLE).add(V3(0, -60, 0)); w.scene.add(pole);
    const flag = new ClothFlag({ width: 40, height: 20, nx: 40, ny: 20, material: flagMat(env.sunrise.env), windDir: Lf.clone().negate(), wind: 12, seed: 2026 }); w.scene.add(flag.mesh);
    const anchor = () => POLE.clone().add(V3(0, 19.5, 0)).addScaledVector(Lf, -1);
    A.setEnv(env.sunrise);
    const n35 = goldGlyphs(SVGLoader, GLYPHS.n35, { size: 27, depth: 6, bevel: 1.1, material: A.M.gold }); w.scene.add(n35);
    const glint = new THREE.PointLight(0xffe2b0, 14000, 500, 1.8); w.scene.add(glint);
    const sparkle = pointsCloud(400, 35, (tt, s) => { const life = (tt * 0.1 + s[0]) % 1; return [n35.position.x + (s[1] - 0.5) * 70, n35.position.y - 40 + life * 100, n35.position.z + (s[2] - 0.5) * 70]; }, { size: 1.2, color: 0xffd27a, map: softDot() });
    sparkle.material.color.setRGB(4, 3, 1.4); w.scene.add(sparkle);
    const c = cam(44, 1, 200000);
    return { scene: w.scene, camera: c, look: { ...dawnLook, exposure: 1.0, sat: 1.0, rays: 0.2, flare: 0.35, focus: 150, focusRange: 3000, dof: 0.15, bloom: 0.6 },
      update(lt, tt) { A.setEnv(env.sunrise); flag.at(tt, 110.4, anchor);
        const k = ease.inOut(clamp(lt / 9.6, 0, 1));
        c.position.copy(CP).addScaledVector(F, lerp(-40, 20, k)).add(V3(0, lerp(0, 25, k), 0)); c.lookAt(CT.clone().add(V3(0, lerp(300, 450, k), 0)));
        const fwd = new THREE.Vector3(); c.getWorldDirection(fwd);
        const k35 = ease.out(clamp((lt - 0.2) / 1.8, 0, 1));
        n35.position.copy(c.position).addScaledVector(fwd, 140).add(V3(0, lerp(-80, 2, k35), 0));
        n35.quaternion.copy(c.quaternion); n35.rotateY(lerp(-1.0, 0, k35) + Math.sin(tt * 0.4) * 0.03);
        glint.position.copy(n35.position).add(V3(80, 60, -60)); sparkle.update(tt); sparkle.visible = lt > 0.5;
        this.sunWorld = c.position.clone().addScaledVector(sun, 100000); } };
  });
  return S;
}
