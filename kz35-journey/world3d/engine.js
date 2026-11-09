// Cinematic 3D engine for "Қазақстан — 35 жыл".
// Every frame is a pure function of film time t: renderAt(t) draws it. No clocks, no RAF loop.
import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { Reflector } from "three/addons/objects/Reflector.js";

export { THREE };
export const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
export const ease = {
  inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  out: (k) => 1 - Math.pow(1 - k, 3),
  in: (k) => k * k * k,
  sine: (k) => 0.5 - 0.5 * Math.cos(Math.PI * k),
};
export const seg = (t, a, b, f = ease.inOut) => f(clamp((t - a) / (b - a), 0, 1));
// value noise 1D for gusts
export const noise1 = (x, seed = 0) => {
  const h = (n) => { const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s); };
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(h(i), h(i + 1), u) * 2 - 1;
};

/* ------------------------------------------------------------------ renderer + post */
export class Engine {
  constructor(canvas, W, H) {
    this.W = W; this.H = H;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    r.setPixelRatio(1); r.setSize(W, H, false);
    r.toneMapping = THREE.NoToneMapping; r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap; r.shadowMap.autoUpdate = true;
    this.r = r;
    const rtOpts = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true };
    this.rtMain = new THREE.WebGLRenderTarget(W, H, rtOpts);
    this.rtMain.depthTexture = new THREE.DepthTexture(W, H, THREE.UnsignedIntType);
    this.rtAlt = new THREE.WebGLRenderTarget(W, H, { ...rtOpts }); // for cross-dissolves
    const q = (s) => new THREE.WebGLRenderTarget(Math.round(W / s), Math.round(H / s), { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    this.rtQ1 = q(4); this.rtQ2 = q(4); this.rtE1 = q(8); this.rtE2 = q(8); this.rtRays = q(4);
    this.fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.fsScene = new THREE.Scene();
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
    this.fsScene.add(this.quad);
    const V = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
    this.matCopy = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, mixT: { value: null }, mixK: { value: 0 } }, vertexShader: V,
      fragmentShader: `uniform sampler2D t; uniform sampler2D mixT; uniform float mixK; varying vec2 vUv;
        void main(){ vec3 c = texture2D(t, vUv).rgb; if (mixK > 0.0) c = mix(c, texture2D(mixT, vUv).rgb, mixK); gl_FragColor = vec4(min(c, vec3(60.0)), 1.0); }` });
    this.matBlur = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, dir: { value: new THREE.Vector2() } }, vertexShader: V,
      fragmentShader: `uniform sampler2D t; uniform vec2 dir; varying vec2 vUv;
        void main(){ vec3 c = texture2D(t, vUv).rgb * 0.227;
          c += (texture2D(t, vUv + dir * 1.385).rgb + texture2D(t, vUv - dir * 1.385).rgb) * 0.316;
          c += (texture2D(t, vUv + dir * 3.231).rgb + texture2D(t, vUv - dir * 3.231).rgb) * 0.070;
          gl_FragColor = vec4(c, 1.0); }` });
    this.matRays = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, sun: { value: new THREE.Vector2(0.5, 0.5) }, thr: { value: 1.0 } }, vertexShader: V,
      fragmentShader: `uniform sampler2D t; uniform vec2 sun; uniform float thr; varying vec2 vUv;
        void main(){ vec2 d = (sun - vUv) / 28.0; vec2 p = vUv; vec3 acc = vec3(0.0); float w = 1.0;
          for (int i = 0; i < 28; i++){ vec3 s = texture2D(t, p).rgb; acc += max(s - vec3(thr), vec3(0.0)) * w; w *= 0.955; p += d; }
          gl_FragColor = vec4(acc / 28.0, 1.0); }` });
    this.matFinal = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: null }, tDepth: { value: null }, tBlur: { value: null }, tWide: { value: null }, tRays: { value: null },
        near: { value: 0.5 }, far: { value: 30000 }, focus: { value: 100 }, focusRange: { value: 60 }, dof: { value: 1 },
        bloom: { value: 0.35 }, bloomThr: { value: 1.2 }, rays: { value: 0.0 }, raysTint: { value: new THREE.Color(1, 0.85, 0.6) },
        exposure: { value: 1 }, temp: { value: 0 }, tint: { value: 0 }, sat: { value: 1 }, contrast: { value: 1.05 },
        lift: { value: new THREE.Vector3() }, gain: { value: new THREE.Vector3(1, 1, 1) }, shadowTint: { value: new THREE.Vector3(0.0, 0.0, 0.02) }, highTint: { value: new THREE.Vector3(0.02, 0.01, 0.0) },
        vignette: { value: 0.35 }, grain: { value: 0.035 }, halation: { value: 0 }, frame: { value: 0 }, fade: { value: 0 }, fadeColor: { value: new THREE.Color(0, 0, 0) },
        sunUV: { value: new THREE.Vector2(0.5, 0.5) }, flare: { value: 0 }, ca: { value: 0.0015 }, aspect: { value: W / H },
      },
      vertexShader: V,
      fragmentShader: `
        uniform sampler2D tScene, tDepth, tBlur, tWide, tRays; uniform float near, far, focus, focusRange, dof, bloom, bloomThr, rays;
        uniform vec3 raysTint; uniform float exposure, temp, tint, sat, contrast; uniform vec3 lift, gain, shadowTint, highTint;
        uniform float vignette, grain, halation, frame, fade, flare, ca, aspect; uniform vec3 fadeColor; uniform vec2 sunUV; varying vec2 vUv;
        float linDepth(float z){ float n = near, f = far; return (n * f) / (f - z * (f - n)); }
        vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + frame * 0.618) * 43758.5453); }
        void main(){
          vec2 uv = vUv; vec2 cc = uv - 0.5;
          vec3 col;
          col.r = texture2D(tScene, uv - cc * ca).r; col.g = texture2D(tScene, uv).g; col.b = texture2D(tScene, uv + cc * ca).b;
          float z = linDepth(texture2D(tDepth, uv).r);
          float coc = dof * clamp(abs(z - focus) / max(focusRange, 0.001) - 0.15, 0.0, 1.0);
          vec3 b1 = texture2D(tBlur, uv).rgb, b2 = texture2D(tWide, uv).rgb;
          col = mix(col, mix(b1, b2, smoothstep(0.5, 1.0, coc)), smoothstep(0.0, 0.6, coc));
          vec3 glow = max(b1 - vec3(bloomThr), vec3(0.0)) * 0.6 + max(b2 - vec3(bloomThr * 0.8), vec3(0.0)) * 1.0;
          col += glow * bloom;
          col += halation * max(b2 - vec3(0.6), vec3(0.0)) * vec3(1.0, 0.35, 0.15);
          col += texture2D(tRays, uv).rgb * rays * raysTint * 4.0;
          // lens ghosts along the sun axis
          if (flare > 0.0) {
            vec2 axis = sunUV - vec2(0.5);
            for (int i = 1; i <= 4; i++) {
              vec2 gp = vec2(0.5) - axis * (float(i) * 0.42 - 0.2);
              float d = length((uv - gp) * vec2(aspect, 1.0));
              col += flare * vec3(0.9, 0.7, 0.45) * (0.05 / float(i)) * smoothstep(0.06 + 0.02 * float(i), 0.0, d);
            }
            float ds = length((uv - sunUV) * vec2(aspect, 1.0));
            col += flare * vec3(1.0, 0.8, 0.55) * 0.35 * exp(-ds * 7.0);
            col += flare * vec3(1.0, 0.75, 0.5) * 0.12 * exp(-abs(uv.y - sunUV.y) * 140.0) * exp(-abs(uv.x - sunUV.x) * 2.0);
          }
          col *= exposure;
          col *= vec3(1.0 + temp * 0.10 + tint * 0.02, 1.0 - tint * 0.05, 1.0 - temp * 0.10 + tint * 0.02);
          col = aces(col);
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          col = mix(vec3(l), col, sat);
          col += shadowTint * (1.0 - smoothstep(0.0, 0.5, l)) + highTint * smoothstep(0.5, 1.0, l);
          col = (col - 0.5) * contrast + 0.5;
          col = col * gain + lift * (1.0 - col);
          float v = smoothstep(0.95, 0.25, length(cc * vec2(1.0, 1.25)));
          col *= mix(1.0 - vignette, 1.0, v);
          col = clamp(col, 0.0, 1.0);
          col = pow(col, vec3(1.0 / 2.2));
          col += (hash(uv * vec2(1080.0, 1920.0)) - 0.5) * grain;
          col = mix(col, fadeColor, fade);
          gl_FragColor = vec4(col, 1.0);
        }` });
    this.post = this.matFinal.uniforms;
  }
  pass(mat, target) { this.quad.material = mat; this.r.setRenderTarget(target); this.r.render(this.fsScene, this.fsCam); }
  blur(src, a, b, dirScale = 1) {
    const u = this.matBlur.uniforms;
    u.t.value = src.texture; u.dir.value.set(dirScale / a.width, 0); this.pass(this.matBlur, b);
    u.t.value = b.texture; u.dir.value.set(0, dirScale / a.height); this.pass(this.matBlur, a);
  }
  // shot: { scene, camera, look:{...post uniforms}, sunWorld?:Vector3 }   mixShot optional for a dissolve
  draw(shot, frame, mix) {
    const r = this.r, P = this.post;
    r.setRenderTarget(this.rtMain); r.clear(); r.render(shot.scene, shot.camera);
    if (mix && mix.k > 0) {
      r.setRenderTarget(this.rtAlt); r.clear(); r.render(mix.shot.scene, mix.shot.camera);
      // blend alt into main through the quarter chain only (cheap): copy mix to Q then upsample in final
      this.matCopy.uniforms.t.value = this.rtMain.texture; this.matCopy.uniforms.mixT.value = this.rtAlt.texture; this.matCopy.uniforms.mixK.value = mix.k;
      this.pass(this.matCopy, this.rtMainMix || (this.rtMainMix = new THREE.WebGLRenderTarget(this.W, this.H, { type: THREE.HalfFloatType, depthBuffer: false })));
    }
    const src = mix && mix.k > 0 ? this.rtMainMix : this.rtMain;
    this.matCopy.uniforms.t.value = src.texture; this.matCopy.uniforms.mixK.value = 0; this.pass(this.matCopy, this.rtQ1);
    this.blur(this.rtQ1, this.rtQ1, this.rtQ2, 1.0);
    this.matCopy.uniforms.t.value = this.rtQ1.texture; this.pass(this.matCopy, this.rtE1);
    this.blur(this.rtE1, this.rtE1, this.rtE2, 1.4); this.blur(this.rtE1, this.rtE1, this.rtE2, 2.2);
    // god rays from the sun
    let sunUV = null;
    if (shot.sunWorld) {
      const p = shot.sunWorld.clone().project(shot.camera);
      const camDir = new THREE.Vector3(); shot.camera.getWorldDirection(camDir);
      const toSun = shot.sunWorld.clone().sub(shot.camera.position).normalize();
      if (camDir.dot(toSun) > 0.0) sunUV = new THREE.Vector2(p.x * 0.5 + 0.5, p.y * 0.5 + 0.5);
    }
    const look = shot.look || {};
    if (sunUV && (look.rays || 0) > 0) {
      this.matRays.uniforms.t.value = this.rtQ1.texture; this.matRays.uniforms.sun.value.copy(sunUV); this.matRays.uniforms.thr.value = look.raysThr ?? 1.0;
      this.pass(this.matRays, this.rtRays);
    } else { r.setRenderTarget(this.rtRays); r.setClearColor(0x000000, 1); r.clear(); }
    P.tScene.value = src.texture; P.tDepth.value = this.rtMain.depthTexture; P.tBlur.value = this.rtQ1.texture; P.tWide.value = this.rtE1.texture; P.tRays.value = this.rtRays.texture;
    P.near.value = shot.camera.near; P.far.value = shot.camera.far; P.frame.value = frame;
    const defaults = { focus: 100, focusRange: 60, dof: 1, bloom: 0.35, bloomThr: 1.2, rays: 0, exposure: 1, temp: 0, tint: 0, sat: 1, contrast: 1.05, vignette: 0.35, grain: 0.035, halation: 0, fade: 0, flare: 0, ca: 0.0015 };
    for (const k in defaults) P[k].value = look[k] ?? defaults[k];
    for (const k of ["lift", "gain", "shadowTint", "highTint"]) if (look[k]) P[k].value.set(...look[k]);
    else P[k].value.set(...({ lift: [0, 0, 0], gain: [1, 1, 1], shadowTint: [0, 0.005, 0.02], highTint: [0.02, 0.012, 0] }[k]));
    if (look.raysTint) P.raysTint.value.set(...look.raysTint);
    if (look.fadeColor) P.fadeColor.value.set(...look.fadeColor); else P.fadeColor.value.set(0, 0, 0);
    if (sunUV) P.sunUV.value.copy(sunUV); else P.flare.value = 0;
    this.pass(this.matFinal, null);
  }
}

/* ------------------------------------------------------------------ sky */
export function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      sunDir: { value: new THREE.Vector3(0, 0.1, -1).normalize() }, zenith: { value: new THREE.Color(0.08, 0.2, 0.5) }, horizon: { value: new THREE.Color(0.9, 0.7, 0.5) },
      ground: { value: new THREE.Color(0.2, 0.18, 0.15) }, sunColor: { value: new THREE.Color(1.0, 0.8, 0.55) }, sunSize: { value: 0.012 }, sunInt: { value: 30 },
      halo: { value: 1.2 }, cloudCover: { value: 0.45 }, cloudScale: { value: 1.6 }, cloudLit: { value: new THREE.Color(1.0, 0.85, 0.7) }, cloudDark: { value: new THREE.Color(0.35, 0.38, 0.5) },
      cloudOff: { value: new THREE.Vector2() }, cloudAlpha: { value: 0.9 }, stars: { value: 0 }, horizonPow: { value: 0.45 }, haze: { value: 0.0 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz); gl_Position = projectionMatrix * viewMatrix * vec4((modelMatrix * vec4(position, 1.0)).xyz, 1.0); gl_Position.z = gl_Position.w; }`,
    fragmentShader: `
      uniform vec3 sunDir, zenith, horizon, ground, sunColor, cloudLit, cloudDark; uniform float sunSize, sunInt, halo, cloudCover, cloudScale, cloudAlpha, stars, horizonPow, haze; uniform vec2 cloudOff; varying vec3 vDir;
      float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * n2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
      void main(){
        vec3 d = normalize(vDir); float h = d.y;
        vec3 col = h > 0.0 ? mix(horizon, zenith, pow(clamp(h, 0.0, 1.0), horizonPow)) : mix(horizon, ground, clamp(-h * 6.0, 0.0, 1.0));
        float mu = dot(d, normalize(sunDir));
        col += sunColor * (halo * 0.35 * pow(max(mu, 0.0), 6.0) + halo * 0.9 * pow(max(mu, 0.0), 48.0));
        col += sunColor * sunInt * smoothstep(cos(sunSize), cos(sunSize * 0.7), mu);
        if (h > 0.0) {
          vec2 p = d.xz / (h + 0.12) * cloudScale + cloudOff;
          float c = fbm(p) * 0.65 + fbm(p * 3.1 + 4.0) * 0.35;
          float den = smoothstep(1.0 - cloudCover, 1.0 - cloudCover + 0.28, c);
          float lightK = clamp(0.35 + 0.65 * pow(max(mu, 0.0), 3.0) + (c - 0.5), 0.0, 1.0);
          vec3 cc = mix(cloudDark, cloudLit, lightK) + sunColor * pow(max(mu, 0.0), 16.0) * (1.0 - den) * 2.0 * den;
          float fadeH = smoothstep(0.0, 0.12, h);
          col = mix(col, cc, den * cloudAlpha * fadeH);
          if (stars > 0.0) { vec2 sp = floor(d.xz / (h + 0.3) * 420.0); float s = step(0.9975, h2(sp)); col += vec3(s) * stars * (1.0 - den) * smoothstep(0.05, 0.3, h); }
        }
        col = mix(col, horizon, haze * (1.0 - smoothstep(0.0, 0.25, abs(h))));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), mat);
  m.scale.setScalar(20000); m.frustumCulled = false; m.renderOrder = -10;
  m.onBeforeRender = (r, s, cam) => m.position.copy(cam.position);
  return m;
}

/* ------------------------------------------------------------------ textures */
export function canvasTex(w, h, draw, srgb = true, repeat) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  return t;
}
export function noiseTex(seed, size = 256, base = [120, 110, 90], amp = 40, repeat = [1, 1]) {
  return canvasTex(size, size, (g, w, h) => {
    const r = rng(seed), img = g.createImageData(w, h);
    // blocky value noise layers for natural variation
    const layer = (cell) => { const n = Math.ceil(w / cell) + 1, v = []; for (let i = 0; i < n * n; i++) v.push(r()); return (x, y) => { const cx = x / cell, cy = y / cell, ix = Math.floor(cx), iy = Math.floor(cy), fx = cx - ix, fy = cy - iy; const at = (a, b) => v[((b % (n - 1)) * n + (a % (n - 1)))]; const s = (k) => k * k * (3 - 2 * k); return lerp(lerp(at(ix, iy), at(ix + 1, iy), s(fx)), lerp(at(ix, iy + 1), at(ix + 1, iy + 1), s(fx)), s(fy)); }; };
    const L = [layer(64), layer(16), layer(4)];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const n = L[0](x, y) * 0.5 + L[1](x, y) * 0.3 + L[2](x, y) * 0.2 + (r() - 0.5) * 0.15;
      const i = (y * w + x) * 4;
      img.data[i] = clamp(base[0] + (n - 0.5) * amp * 2, 0, 255); img.data[i + 1] = clamp(base[1] + (n - 0.5) * amp * 2, 0, 255); img.data[i + 2] = clamp(base[2] + (n - 0.5) * amp * 2, 0, 255); img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }, true, repeat);
}
// facade texture with windows: lit for night, glass tone for day
export function facadeTex(seed, { cols = 8, rows = 24, wall = "#9aa7b5", glass = "#3d5876", lit = 0.0, litColor = "#ffd28a", frame = "#c9d3de", band = false, emissiveOnly = false } = {}) {
  return canvasTex(256, 512, (g, w, h) => {
    const r = rng(seed);
    g.fillStyle = emissiveOnly ? "#000" : wall; g.fillRect(0, 0, w, h);
    const cw = w / cols, ch = h / rows;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const on = r() < lit;
      if (emissiveOnly) { if (on) { g.fillStyle = r() < 0.7 ? litColor : "#cfe6ff"; g.globalAlpha = 0.5 + r() * 0.5; g.fillRect(i * cw + cw * 0.08, j * ch + ch * 0.12, cw * 0.84, ch * 0.76); g.globalAlpha = 1; } continue; }
      const grd = g.createLinearGradient(0, j * ch, 0, (j + 1) * ch);
      if (on) { grd.addColorStop(0, litColor); grd.addColorStop(1, "#b9824a"); }
      else { grd.addColorStop(0, glass); grd.addColorStop(1, shade(glass, 0.75 + r() * 0.2)); }
      g.fillStyle = grd; g.fillRect(i * cw + cw * 0.08, j * ch + ch * 0.12, cw * 0.84, ch * 0.76);
    }
    if (emissiveOnly) return;
    g.fillStyle = frame; if (band) for (let j = 0; j < rows; j += 4) g.fillRect(0, j * ch, w, ch * 0.12);
  });
}
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k)); return `rgb(${c.join(",")})`; }

export async function loadHDR(r, url) {
  const t = await new RGBELoader().loadAsync(url);
  t.mapping = THREE.EquirectangularReflectionMapping;
  const pm = new THREE.PMREMGenerator(r); const env = pm.fromEquirectangular(t).texture; pm.dispose();
  // reflection cube for cheap (Phong) materials: tone-compressed so glass never blows out
  const sc = new THREE.Scene();
  const sph = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 32), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { t: { value: t } },
    vertexShader: `varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform sampler2D t; varying vec3 vD; void main(){ vec3 d = normalize(vD); vec2 uv = vec2(atan(d.z, d.x) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5); vec3 c = texture2D(t, uv).rgb; c = c / (1.0 + c * 0.8) * 0.75; gl_FragColor = vec4(c, 1.0); }` }));
  sc.add(sph);
  const crt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
  new THREE.CubeCamera(0.1, 100, crt).update(r, sc);
  return { env, cube: crt.texture, raw: t };
}

/* ------------------------------------------------------------------ cloth flag (verlet, deterministic) */
export class ClothFlag {
  constructor({ width = 6, height = 3, nx = 36, ny = 18, texture, seed = 1, windDir = new THREE.Vector3(1, 0, 0.25), wind = 9, gust = 0.45, material }) {
    this.nx = nx; this.ny = ny; this.W = width; this.H = height; this.seed = seed;
    this.rest = width / (nx - 1);
    this.windDir = windDir.clone().normalize(); this.wind = wind; this.gust = gust;
    const geo = new THREE.PlaneGeometry(width, height, nx - 1, ny - 1);
    this.geo = geo;
    this.mesh = new THREE.Mesh(geo, material || new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, roughness: 0.78, metalness: 0.0 }));
    this.mesh.castShadow = true; this.mesh.frustumCulled = false;
    this.N = nx * ny; this.p = new Float32Array(this.N * 3); this.o = new Float32Array(this.N * 3);
    this.cache = new Map(); this.dt = 1 / 90; this.stepsPerFrame = 3;
    this.anchor = new THREE.Vector3(); // top of hoist in world space
  }
  idx(i, j) { return j * this.nx + i; }
  reset(anchor) {
    for (let j = 0; j < this.ny; j++) for (let i = 0; i < this.nx; i++) {
      const k = this.idx(i, j) * 3;
      // start hanging slightly folded down the pole
      this.p[k] = anchor.x + i * this.rest * 0.3; this.p[k + 1] = anchor.y - j * this.rest - i * this.rest * 0.9; this.p[k + 2] = anchor.z + Math.sin(i * 0.9) * 0.05;
      this.o[k] = this.p[k]; this.o[k + 1] = this.p[k + 1]; this.o[k + 2] = this.p[k + 2];
    }
  }
  step(time, anchorFn) {
    const { nx, ny, p, o, dt } = this;
    const a = anchorFn(time);
    // pin the hoist column
    for (let j = 0; j < ny; j++) { const k = this.idx(0, j) * 3; p[k] = a.x; p[k + 1] = a.y - j * this.rest; p[k + 2] = a.z; o[k] = p[k]; o[k + 1] = p[k + 1]; o[k + 2] = p[k + 2]; }
    const g = noise1(time * 0.6, this.seed), g2 = noise1(time * 1.7 + 10, this.seed);
    const ws = this.wind * (1 + this.gust * g);
    const wd = this.windDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), g2 * 0.35);
    const wx = wd.x * ws, wy = 0.6 * g2, wz = wd.z * ws;
    // aerodynamic force per quad (approx normal from neighbours)
    const acc = new Float32Array(this.N * 3);
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const A = this.idx(i, j) * 3, B = this.idx(i + 1, j) * 3, C = this.idx(i, j + 1) * 3;
      const ux = p[B] - p[A], uy = p[B + 1] - p[A + 1], uz = p[B + 2] - p[A + 2];
      const vx = p[C] - p[A], vy = p[C + 1] - p[A + 1], vz = p[C + 2] - p[A + 2];
      let nxv = uy * vz - uz * vy, nyv = uz * vx - ux * vz, nzv = ux * vy - uy * vx;
      const len = Math.hypot(nxv, nyv, nzv) || 1; nxv /= len; nyv /= len; nzv /= len;
      const flutter = 0.25 * Math.sin(i * 0.8 - time * 9.0 + j * 0.3);
      const d = (nxv * wx + nyv * wy + nzv * wz) * (1 + flutter);
      const fx = nxv * d * 0.9, fy = nyv * d * 0.9, fz = nzv * d * 0.9;
      for (const q of [A, B, C]) { acc[q] += fx; acc[q + 1] += fy; acc[q + 2] += fz; }
    }
    const damp = 0.985;
    for (let k = 0; k < this.N; k++) {
      const q = k * 3;
      if (k % nx === 0) continue;
      for (let c = 0; c < 3; c++) {
        const cur = p[q + c];
        const vel = (cur - o[q + c]) / dt, wc = c === 0 ? wx : c === 1 ? wy : wz;
        const a2 = acc[q + c] + (c === 1 ? -9.8 : 0) + (wc - vel) * 1.1;
        p[q + c] = cur + (cur - o[q + c]) * damp + a2 * dt * dt;
        o[q + c] = cur;
      }
    }
    // constraints: structural + shear-ish + bend
    const sat = (A, B, rest, stiff) => {
      const dx = p[B] - p[A], dy = p[B + 1] - p[A + 1], dz = p[B + 2] - p[A + 2];
      const dist = Math.hypot(dx, dy, dz) || 1e-6, diff = ((dist - rest) / dist) * 0.5 * stiff;
      const pinA = (A / 3) % nx === 0, pinB = (B / 3) % nx === 0;
      const wa = pinA ? 0 : pinB ? 2 : 1, wb = pinB ? 0 : pinA ? 2 : 1;
      p[A] += dx * diff * wa; p[A + 1] += dy * diff * wa; p[A + 2] += dz * diff * wa;
      p[B] -= dx * diff * wb; p[B + 1] -= dy * diff * wb; p[B + 2] -= dz * diff * wb;
    };
    const R = this.rest, D = R * Math.SQRT2;
    for (let it = 0; it < 12; it++) {
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const A = this.idx(i, j) * 3;
        if (i < nx - 1) sat(A, this.idx(i + 1, j) * 3, R, 1);
        if (j < ny - 1) sat(A, this.idx(i, j + 1) * 3, R, 1);
        if (it % 2 === 0 && i < nx - 1 && j < ny - 1) { sat(A, this.idx(i + 1, j + 1) * 3, D, 0.6); sat(this.idx(i + 1, j) * 3, this.idx(i, j + 1) * 3, D, 0.6); }
        if (it % 3 === 0 && i < nx - 2) sat(A, this.idx(i + 2, j) * 3, R * 2, 0.2);
        if (it % 3 === 0 && j < ny - 2) sat(A, this.idx(i, j + 2) * 3, R * 2, 0.2);
      }
    }
  }
  // simulate from t0 (with warm-up) to t; cached per frame index
  at(t, t0, anchorFn, fps = 30) {
    const f = Math.max(0, Math.round((t - t0) * fps));
    if (!this.cache.size) {
      this.reset(anchorFn(t0 - 3)); let tt = t0 - 3;
      while (tt < t0) { this.step(tt, anchorFn); tt += this.dt; }
      this.cache.set(0, this.p.slice()); this.oc0 = this.o.slice();
    }
    let k = f; while (k > 0 && !this.cache.has(k)) k--;
    this.p.set(this.cache.get(k));
    if (k === 0) this.o.set(this.oc0); else this.o.set(this.cache.get("o" + k));
    for (let fr = k; fr < f; fr++) {
      for (let s = 0; s < this.stepsPerFrame; s++) this.step(t0 + fr / fps + (s * this.dt), anchorFn);
      this.cache.set(fr + 1, this.p.slice()); this.cache.set("o" + (fr + 1), this.o.slice());
    }
    // write to mesh: plane vertex order is row-major from top-left
    const pos = this.geo.attributes.position;
    for (let j = 0; j < this.ny; j++) for (let i = 0; i < this.nx; i++) {
      const k3 = this.idx(i, j) * 3, v = j * this.nx + i;
      pos.setXYZ(v, this.p[k3], this.p[k3 + 1], this.p[k3 + 2]);
    }
    pos.needsUpdate = true; this.geo.computeVertexNormals(); this.geo.computeBoundingSphere();
  }
}

/* ------------------------------------------------------------------ water with real reflections */
export function makeWater(size, { color = new THREE.Color(0.02, 0.06, 0.1), normals, res = 0.33, W = 1080, H = 1920, sunDir = new THREE.Vector3(0, 0.2, -1), sunColor = new THREE.Color(1, 0.8, 0.6), skyColor = new THREE.Color(0.5, 0.6, 0.75) } = {}) {
  const shader = {
    uniforms: { color: { value: color }, tDiffuse: { value: null }, textureMatrix: { value: null }, tNormal: { value: normals }, time: { value: 0 }, sunDir: { value: sunDir }, sunColor: { value: sunColor }, skyColor: { value: skyColor }, eye: { value: new THREE.Vector3() } },
    vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW; void main(){ vUv = textureMatrix * vec4(position, 1.0); vW = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 color, sunDir, sunColor, skyColor, eye; uniform sampler2D tDiffuse, tNormal; uniform float time; varying vec4 vUv; varying vec3 vW;
      void main(){
        vec2 p = vW.xz;
        vec3 n1 = texture2D(tNormal, p * 0.012 + vec2(time * 0.01, time * 0.006)).rgb * 2.0 - 1.0;
        vec3 n2 = texture2D(tNormal, p * 0.031 - vec2(time * 0.007, -time * 0.011)).rgb * 2.0 - 1.0;
        vec3 n = normalize(vec3(n1.x + n2.x, 6.0, n1.y + n2.y));
        vec3 v = normalize(eye - vW);
        float fres = 0.04 + 0.96 * pow(1.0 - max(dot(v, n), 0.0), 5.0);
        vec4 uv = vUv; uv.xy += n.xz * 6.0;
        vec3 refl = texture2DProj(tDiffuse, uv).rgb;
        refl = mix(skyColor, refl, 0.9);
        vec3 h = normalize(normalize(sunDir) + v);
        float spec = pow(max(dot(n, h), 0.0), 260.0) * 14.0;
        vec3 col = mix(color, refl, clamp(fres * 1.6 + 0.25, 0.0, 1.0)) + sunColor * spec;
        gl_FragColor = vec4(col, 1.0);
      }`,
  };
  const w = new Reflector(new THREE.PlaneGeometry(size[0], size[1]), { color, textureWidth: Math.round(W * res), textureHeight: Math.round(H * res), clipBias: 0.003, shader, multisample: 0 });
  w.rotation.x = -Math.PI / 2;
  if (normals) { normals.wrapS = normals.wrapT = THREE.RepeatWrapping; w.material.uniforms.tNormal.value = normals; }
  const ob = w.onBeforeRender;
  w.onBeforeRender = function (r, s, cam) { w.material.uniforms.eye.value.copy(cam.position); ob.call(this, r, s, cam); };
  return w;
}

export function flipWinding(geo) { const ix = geo.index; if (ix) { for (let i = 0; i < ix.count; i += 3) { const a = ix.getX(i + 1); ix.setX(i + 1, ix.getX(i + 2)); ix.setX(i + 2, a); } ix.needsUpdate = true; } else { const p = geo.attributes; for (const k in p) { const at = p[k], n = at.itemSize; for (let i = 0; i < at.count; i += 3) for (let c = 0; c < n; c++) { const a = at.array[(i + 1) * n + c]; at.array[(i + 1) * n + c] = at.array[(i + 2) * n + c]; at.array[(i + 2) * n + c] = a; } at.needsUpdate = true; } } return geo; }
/* ------------------------------------------------------------------ extruded gold text from glyph outlines */
export function goldGlyphs(SVGLoader, glyph, { size = 10, depth = 1.6, bevel = 0.25, material }) {
  const loader = new SVGLoader();
  const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${glyph.d}"/></svg>`);
  const shapes = []; data.paths.forEach((p) => SVGLoader.createShapes(p).forEach((s) => shapes.push(s)));
  const k = size / glyph.upm;
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: depth / k, bevelEnabled: true, bevelThickness: bevel / k, bevelSize: (bevel * 0.8) / k, bevelSegments: 4, curveSegments: 10 });
  geo.scale(k, -k, k); flipWinding(geo); geo.computeBoundingBox();
  const bb = geo.boundingBox; geo.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -(bb.max.z + bb.min.z) / 2);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

/* ------------------------------------------------------------------ particles (deterministic) */
export function pointsCloud(n, seed, fn, { size = 2, color = 0xffffff, map, additive = true, opacity = 1 } = {}) {
  const g = new THREE.BufferGeometry(); const pos = new Float32Array(n * 3); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ size, color, map, transparent: true, opacity, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false;
  const r = rng(seed); const seeds = Array.from({ length: n }, () => [r(), r(), r(), r()]);
  pts.update = (t) => { for (let i = 0; i < n; i++) { const v = fn(t, seeds[i], i); pos[i * 3] = v[0]; pos[i * 3 + 1] = v[1]; pos[i * 3 + 2] = v[2]; } g.attributes.position.needsUpdate = true; };
  return pts;
}
export const softDot = () => canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }, false);
