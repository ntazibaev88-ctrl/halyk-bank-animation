// Rendering engine: physical sky, sun + shadows, image-based reflections,
// HDR render targets, bloom, and a cinematic grade (ACES, split-tone, grain).
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { lerp } from './util.js';

const NIGHT_PATCH = `
  {
    float up = max(direction.y, 0.0);
    vec3 nightCol = mix(vec3(0.010, 0.022, 0.060), vec3(0.0015, 0.004, 0.014), pow(up, 0.55));
    nightCol += vec3(0.11, 0.06, 0.025) * cityGlow * pow(1.0 - up, 14.0);
    vec2 sp = floor(direction.xz / (direction.y + 0.35) * 420.0);
    float h = fract(sin(dot(sp, vec2(12.9898, 78.233))) * 43758.5453);
    float star = step(0.9982, h) * smoothstep(0.04, 0.35, direction.y) * (0.4 + 0.6 * fract(h * 91.7));
    nightCol += vec3(star) * 0.55;
    texColor = mix(texColor, nightCol, nightMix);
  }
  vec3 skyC = texColor * skyGain;
  float pk = max(max(skyC.r, skyC.g), skyC.b);
  skyC *= (1.0 + pk / 9.0) / (1.0 + pk / 1.4);
  gl_FragColor = vec4( skyC, 1.0 );`;

function makeSky() {
  const sky = new Sky();
  const m = sky.material;
  m.uniforms.nightMix = { value: 0 };
  m.uniforms.cityGlow = { value: 0 };
  m.uniforms.skyGain = { value: 1 };
  m.fragmentShader = m.fragmentShader
    .replace('uniform float time;', 'uniform float time;\nuniform float nightMix;\nuniform float cityGlow;\nuniform float skyGain;')
    .replace('gl_FragColor = vec4( texColor, 1.0 );', NIGHT_PATCH);
  sky.scale.setScalar(45000);
  sky.frustumCulled = false;
  return sky;
}

const GRADE_FRAG = `
precision highp float;
uniform sampler2D tA; uniform sampler2D tB; uniform float mixB;
uniform float exposure, contrast, saturation, temp, sepia, vignette, grain, time, fade, chroma, lift;
uniform vec3 shadowTint, highTint; uniform vec2 res;
varying vec2 vUv;
vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);}
float hash(vec2 p){ p = fract(p*vec2(443.897,441.423)); p += dot(p, p.yx+19.19); return fract((p.x+p.y)*p.x); }
vec3 sampleCA(sampler2D t, vec2 uv, vec2 dc, float ca){
  return vec3(texture2D(t, uv - dc*ca).r, texture2D(t, uv).g, texture2D(t, uv + dc*ca).b);
}
void main(){
  vec2 uv = vUv; vec2 dc = uv - 0.5;
  float ca = chroma * dot(dc, dc);
  vec3 col = sampleCA(tA, uv, dc, ca);
  if (mixB > 0.0) col = mix(col, sampleCA(tB, uv, dc, ca), mixB);
  col *= exposure;
  col *= vec3(1.0 + temp*0.12, 1.0 + temp*0.02, 1.0 - temp*0.12);
  col = aces(col);
  col = pow(col, vec3(1.0/2.2));
  float l = dot(col, vec3(0.2126,0.7152,0.0722));
  col = mix(vec3(l), col, saturation);
  col = (col - 0.5) * contrast + 0.5 + lift;
  l = dot(col, vec3(0.2126,0.7152,0.0722));
  col += shadowTint * (1.0 - smoothstep(0.0, 0.55, l)) * 0.10 + highTint * smoothstep(0.45, 1.0, l) * 0.10;
  vec3 sep = vec3(dot(col, vec3(.393,.769,.189)), dot(col, vec3(.349,.686,.168)), dot(col, vec3(.272,.534,.131)));
  col = mix(col, sep * vec3(1.0, 0.97, 0.9), sepia);
  float vg = smoothstep(1.05, 0.25, length(dc * vec2(1.0, 0.78)));
  col *= mix(1.0, vg, vignette);
  float g = hash(uv * res + fract(time * 7.13) * 100.0) - 0.5;
  col += g * grain * (0.6 + 0.4 * (1.0 - l));
  col *= (1.0 - fade);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

export const LIGHT_SCALE = 0.36;
export const DEFAULT_GRADE = {
  exposure: 0.62, contrast: 1.06, saturation: 1.05, temp: 0.0, sepia: 0, vignette: 0.55,
  grain: 0.035, fade: 0, chroma: 0.006, lift: 0.0,
  shadowTint: [0.0, 0.15, 0.3], highTint: [0.35, 0.22, 0.0],
  bloom: 0.55, bloomRadius: 0.55, bloomThreshold: 2.4,
};

export const DEFAULT_LOOK = {
  sunElev: 25, sunAzim: 200, turbidity: 4, rayleigh: 1.4, mie: 0.006, mieG: 0.82,
  sunIntensity: 3.2, sunColor: [1, 0.93, 0.82], hemiIntensity: 0.55, hemiSky: [0.62, 0.74, 1.0], hemiGround: [0.42, 0.36, 0.28],
  envIntensity: 0.9, fogColor: [0.62, 0.72, 0.86], fogDensity: 0.00012, night: 0, cityGlow: 0,
  clouds: 0.35, cloudDensity: 0.45, skyGain: 1.0, cloudTime: 0,
  shadowCenter: [0, 1200], shadowSize: 1500,
};

export class Engine {
  constructor(canvas, W, H) {
    this.W = W; this.H = H;
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }));
    r.setPixelRatio(1);
    r.setSize(W, H, false);
    r.toneMapping = THREE.NoToneMapping;
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.sky = makeSky();
    this.scene.add(this.sky);

    this.sun = new THREE.DirectionalLight(0xffffff, 3);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.6;
    this.scene.add(this.sun, this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xbcd4ff, 0x554433, 0.5);
    this.scene.add(this.hemi);
    this.scene.fog = new THREE.FogExp2(0x9fb3cc, 0.00012);

    // environment (reflections) from a copy of the sky
    this.envScene = new THREE.Scene();
    this.envSky = makeSky();
    this.envSky.material.uniforms = this.sky.material.uniforms; // shared
    this.envScene.add(this.envSky);
    this.pmrem = new THREE.PMREMGenerator(r);
    this.envCache = new Map();

    const rtOpts = { type: THREE.HalfFloatType, samples: 4, depthBuffer: true };
    this.rtA = new THREE.WebGLRenderTarget(W, H, rtOpts);
    this.rtB = new THREE.WebGLRenderTarget(W, H, rtOpts);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.5, 0.5, 0.9);

    this.gradeMat = new THREE.ShaderMaterial({
      uniforms: {
        tA: { value: this.rtA.texture }, tB: { value: this.rtB.texture }, mixB: { value: 0 },
        exposure: { value: 1 }, contrast: { value: 1 }, saturation: { value: 1 }, temp: { value: 0 }, sepia: { value: 0 },
        vignette: { value: 0.5 }, grain: { value: 0.03 }, time: { value: 0 }, fade: { value: 0 }, chroma: { value: 0.005 }, lift: { value: 0 },
        shadowTint: { value: new THREE.Vector3() }, highTint: { value: new THREE.Vector3() }, res: { value: new THREE.Vector2(W, H) },
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: GRADE_FRAG,
      depthTest: false, depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.gradeMat);
    this.quad.frustumCulled = false;
    this.postScene = new THREE.Scene();
    this.postScene.add(this.quad);
    this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.camera = new THREE.PerspectiveCamera(40, W / H, 2, 60000);
    // tiny render of the sky toward the horizon -> fog colour (aerial perspective)
    this.fogRT = new THREE.WebGLRenderTarget(8, 4, { type: THREE.FloatType });
    this.fogCam = new THREE.PerspectiveCamera(40, 2, 1, 100000);
    this.fogBuf = new Float32Array(8 * 4 * 4);
    this.components = [];
    this.lookListeners = [];
  }

  add(component) {
    this.components.push(component);
    if (component.object) this.scene.add(component.object);
    return component;
  }

  sunDir(look) {
    const el = THREE.MathUtils.degToRad(look.sunElev), az = THREE.MathUtils.degToRad(look.sunAzim);
    // azimuth measured from north (-z) clockwise toward east (+x)
    return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
  }

  applyLook(look) {
    const L = { ...DEFAULT_LOOK, ...look };
    const u = this.sky.material.uniforms;
    const dir = this.sunDir(L);
    u.sunPosition.value.copy(dir);
    u.turbidity.value = L.turbidity; u.rayleigh.value = L.rayleigh;
    u.mieCoefficient.value = L.mie; u.mieDirectionalG.value = L.mieG;
    u.cloudCoverage.value = L.clouds; u.cloudDensity.value = L.cloudDensity;
    u.time.value = L.cloudTime; u.nightMix.value = L.night; u.cityGlow.value = L.cityGlow; u.skyGain.value = L.skyGain;
    if (u.cloudScale) u.cloudScale.value = 0.00025;

    // environment map, cached by quantised sky state (deterministic across workers)
    const key = [Math.round(L.sunElev * 2), Math.round(L.sunAzim / 3), Math.round(L.turbidity), Math.round(L.night * 20), Math.round(L.clouds * 10), Math.round(L.skyGain * 10)].join(':');
    let env = this.envCache.get(key);
    if (!env) {
      u.showSunDisc.value = 0;
      const t = u.time.value; u.time.value = 0;
      env = this.pmrem.fromScene(this.envScene, 0, 1, 100000).texture;
      u.time.value = t;
      u.showSunDisc.value = 1;
      this.envCache.set(key, env);
    }
    this.scene.environment = env;
    this.scene.environmentIntensity = L.envIntensity * LIGHT_SCALE;

    const [cx, cz] = L.shadowCenter;
    this.sun.target.position.set(cx, 0, cz);
    this.sun.position.set(cx + dir.x * 6000, Math.max(dir.y, 0.03) * 6000, cz + dir.z * 6000);
    const s = L.shadowSize, sc = this.sun.shadow.camera;
    sc.left = -s; sc.right = s; sc.top = s; sc.bottom = -s; sc.near = 10; sc.far = 14000;
    sc.updateProjectionMatrix();
    const dayFade = THREE.MathUtils.smoothstep(L.sunElev, -4, 3);
    this.sun.intensity = L.sunIntensity * dayFade * LIGHT_SCALE;
    this.sun.color.setRGB(...L.sunColor);
    this.hemi.intensity = L.hemiIntensity * LIGHT_SCALE;
    this.hemi.color.setRGB(...L.hemiSky);
    this.hemi.groundColor.setRGB(...L.hemiGround);
    this.scene.fog.color.setRGB(...L.fogColor);
    this.scene.fog.density = L.fogDensity;
    this.look = L;
    for (const c of this.components) c.onLook && c.onLook(L, dir);
  }

  renderShot(shot, target) {
    this.applyLook(shot.look);
    const cam = this.camera;
    cam.fov = shot.fov || 40;
    cam.near = shot.near || 2;
    cam.far = 60000;
    cam.position.copy(shot.pos);
    if (shot.up) cam.up.copy(shot.up); else cam.up.set(0, 1, 0);
    cam.lookAt(shot.target);
    if (shot.roll) cam.rotateZ(shot.roll);
    cam.updateProjectionMatrix();
    for (const c of this.components) c.beforeRender && c.beforeRender(cam, shot);
    this.sky.position.copy(cam.position);
    // automatic fog colour = sky radiance just above the horizon in the view direction
    if (!shot.look.fixedFog) {
      const fwd = new THREE.Vector3(); cam.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
      this.fogCam.position.set(0, 0, 0);
      this.fogCam.lookAt(fwd.x, Math.tan(THREE.MathUtils.degToRad(3)), fwd.z);
      this.envSky.position.set(0, 0, 0);
      this.renderer.setRenderTarget(this.fogRT);
      this.renderer.render(this.envScene, this.fogCam);
      this.renderer.readRenderTargetPixels(this.fogRT, 0, 0, 8, 4, this.fogBuf);
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < 32; i++) { r += this.fogBuf[i * 4]; g += this.fogBuf[i * 4 + 1]; b += this.fogBuf[i * 4 + 2]; }
      const k = (this.look.fogMul ?? 0.75) / 32;
      this.scene.fog.color.setRGB(r * k, g * k, b * k);
    }
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    this.renderer.render(this.scene, cam);
  }

  // frame = { t, shots: [shotA, shotB?], mix, grade }
  render(frame) {
    const [a, b] = frame.shots;
    const mix = b ? frame.mix : 0;
    this.renderShot(a, this.rtA);
    if (b && mix > 0.001) this.renderShot(b, this.rtB);
    const G = { ...DEFAULT_GRADE, ...frame.grade, ...(window.__gradeOverride || {}) };
    if (window.__expScale) G.exposure *= window.__expScale;
    this.bloom.strength = G.bloom; this.bloom.radius = G.bloomRadius; this.bloom.threshold = G.bloomThreshold;
    if (G.bloom > 0) {
      this.bloom.render(this.renderer, null, this.rtA);
      if (b && mix > 0.001) this.bloom.render(this.renderer, null, this.rtB);
    }
    const u = this.gradeMat.uniforms;
    u.mixB.value = b && mix > 0.001 ? mix : 0;
    for (const k of ['exposure', 'contrast', 'saturation', 'temp', 'sepia', 'vignette', 'grain', 'fade', 'chroma', 'lift']) u[k].value = G[k];
    u.shadowTint.value.set(...G.shadowTint);
    u.highTint.value.set(...G.highTint);
    u.time.value = frame.t;
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCam);
  }
}

export function mixLook(a, b, t) {
  const out = {};
  const A = { ...DEFAULT_LOOK, ...a }, B = { ...DEFAULT_LOOK, ...b };
  for (const k of Object.keys(A)) {
    if (Array.isArray(A[k])) out[k] = A[k].map((v, i) => lerp(v, B[k][i], t));
    else if (typeof A[k] === 'number') out[k] = lerp(A[k], B[k], t);
    else out[k] = t < 0.5 ? A[k] : B[k];
  }
  return out;
}
export function mixGrade(a, b, t) {
  const A = { ...DEFAULT_GRADE, ...a }, B = { ...DEFAULT_GRADE, ...b };
  const out = {};
  for (const k of Object.keys(A)) out[k] = Array.isArray(A[k]) ? A[k].map((v, i) => lerp(v, B[k][i], t)) : lerp(A[k], B[k], t);
  return out;
}
