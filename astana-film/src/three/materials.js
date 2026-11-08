// Procedural materials: building facades, steppe/city ground, river water.
import * as THREE from 'three';
import { fbm2 } from './util.js';

export const shared = {
  uNight: { value: 0 },
  uTime: { value: 0 },
  uMap: { value: 0 },        // 0 = photoreal, 1 = stylised 3D map mode
  uSepia: { value: 0 },
};

// ---------------------------------------------------------------- facades
// Instance attribute aFac = (style, seed, litFraction, unused)
// styles: 0 glass curtain wall, 1 modern residential, 2 soviet panel, 3 stone office,
//         4 wooden log house, 5 white stone / palace, 6 gold glass
const FACADE_HEAD = `
varying vec3 vWPos; varying vec3 vWNorm; varying vec4 vFac;
uniform float uNight; uniform float uMap; uniform float uTime;
float hfh(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
`;

export function facadeMaterial(opts = {}) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, metalness: 0.0, ...opts });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = shared.uNight;
    sh.uniforms.uMap = shared.uMap;
    sh.uniforms.uTime = shared.uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aFac;\n' + FACADE_HEAD)
      .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
        vec4 hfW = vec4(transformed, 1.0);
        vec3 hfN = objectNormal;
        #ifdef USE_INSTANCING
          hfW = instanceMatrix * hfW;
          hfN = mat3(instanceMatrix) * hfN;
        #endif
        vWPos = (modelMatrix * hfW).xyz;
        vWNorm = normalize(mat3(modelMatrix) * hfN);
        vFac = aFac;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + FACADE_HEAD)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float st = vFac.x; float seed = vFac.y;
        vec3 nW = normalize(vWNorm);
        float wall = 1.0 - step(0.55, abs(nW.y));
        vec3 tg = normalize(vec3(-nW.z, 0.0, nW.x) + 1e-5);
        float fu = dot(vWPos.xz, tg.xz);
        float fv = vWPos.y;
        float floorH = 3.2, bayW = 2.8, winW = 0.6, winH = 0.55, glassAll = 0.0;
        vec3 glassCol = vec3(0.045, 0.06, 0.075);
        if (st < 0.5) { floorH = 3.9; bayW = 1.55; winW = 0.92; winH = 0.80; glassAll = 1.0; glassCol = diffuseColor.rgb * 0.55; }
        else if (st < 1.5) { floorH = 3.0; bayW = 3.1; winW = 0.52; winH = 0.56; }
        else if (st < 2.5) { floorH = 2.8; bayW = 3.3; winW = 0.42; winH = 0.46; glassCol = vec3(0.07,0.075,0.08); }
        else if (st < 3.5) { floorH = 4.0; bayW = 1.5; winW = 0.5; winH = 0.78; }
        else if (st < 4.5) { floorH = 3.0; bayW = 4.2; winW = 0.22; winH = 0.36; glassCol = vec3(0.03,0.025,0.02); }
        else if (st < 5.5) { floorH = 5.0; bayW = 4.0; winW = 0.34; winH = 0.6; glassCol = vec3(0.06,0.07,0.09); }
        else { floorH = 3.9; bayW = 1.6; winW = 0.9; winH = 0.8; glassAll = 1.0; glassCol = vec3(0.55, 0.36, 0.1); }
        vec2 fc = vec2(fu / bayW + seed * 7.0, fv / floorH);
        vec2 fid = floor(fc); vec2 ff = fract(fc);
        vec2 fw = max(fwidth(fc), vec2(1e-4));
        float mx = smoothstep(0.5 - winW*0.5 - fw.x, 0.5 - winW*0.5 + fw.x, ff.x) * (1.0 - smoothstep(0.5 + winW*0.5 - fw.x, 0.5 + winW*0.5 + fw.x, ff.x));
        float my = smoothstep(0.5 - winH*0.5 - fw.y, 0.5 - winH*0.5 + fw.y, ff.y) * (1.0 - smoothstep(0.5 + winH*0.5 - fw.y, 0.5 + winH*0.5 + fw.y, ff.y));
        float detail = 1.0 - smoothstep(0.3, 0.85, max(fw.x, fw.y));
        float win = mix(winW * winH, mx * my, detail) * wall;
        float rnd = hfh(fid + seed * 13.1);
        float rnd2 = hfh(fid.yx * 1.7 + seed * 3.3);
        float hfLit = step(rnd, vFac.z * 0.55) * win;
        float baseAO = mix(0.55, 1.0, smoothstep(0.0, 14.0, fv));
        vec3 wallCol = diffuseColor.rgb * baseAO * (0.92 + 0.16 * rnd2 * (1.0 - glassAll));
        vec3 roofCol = vec3(0.23, 0.235, 0.24) * (0.8 + 0.4 * hfh(floor(vWPos.xz / 9.0)));
        // glass varies per pane (reflection breakup)
        vec3 paneCol = glassCol * (0.75 + 0.5 * rnd2);
        vec3 facade = mix(wallCol, paneCol, win);
        if (glassAll > 0.5) {
          float slab = (1.0 - smoothstep(0.0, 0.10 + fw.y, ff.y)) * detail;
          facade = mix(paneCol, diffuseColor.rgb * 0.35, slab * wall);
          win = wall * (1.0 - slab);
        }
        diffuseColor.rgb = mix(roofCol, facade, wall);
        // stylised map mode: clean white-blue blocks
        diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.32, 0.4, 0.55), vec3(0.6,0.68,0.8), smoothstep(0.0, 120.0, fv)), uMap);
      `)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(mix(0.82, 0.55, glassAll), 0.05 + 0.08 * rnd2, win);
        roughnessFactor = mix(roughnessFactor, 0.5, uMap);`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
        metalnessFactor = mix(mix(0.0, 0.5, glassAll), 0.85, win) * (1.0 - uMap);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        {
          vec3 warm = mix(vec3(1.0, 0.62, 0.30), vec3(0.85, 0.9, 1.0), step(0.82, rnd2));
          float band = glassAll * step(0.72, hfh(vec2(fid.y, seed)));
          float lit = max(hfLit, band * win * 0.7);
          totalEmissiveRadiance += warm * lit * uNight * (0.35 + 0.6 * rnd2) * (1.0 - uMap);
          // street-level shop glow
          totalEmissiveRadiance += vec3(1.0, 0.7, 0.4) * wall * (1.0 - smoothstep(3.0, 5.5, fv)) * uNight * 0.15 * (1.0 - uMap);
          totalEmissiveRadiance += vec3(0.25, 0.55, 1.0) * uMap * 0.05 * smoothstep(0.0, 200.0, fv);
        }`);
  };
  mat.customProgramCacheKey = () => 'facade-v1';
  return mat;
}

// ---------------------------------------------------------------- ground
// cityMap RGBA: R = modern asphalt, G = soviet asphalt, B = park/green, A = dirt tracks
export function groundMaterial(cityTex, bounds) {
  const uni = {
    tCity: { value: cityTex },
    uBounds: { value: new THREE.Vector4(bounds.x0, bounds.z0, bounds.x1 - bounds.x0, bounds.z1 - bounds.z0) },
    uModern: { value: 0 }, uSoviet: { value: 0 }, uDirt: { value: 1 },
    uNight: shared.uNight, uMap: shared.uMap, uTime: shared.uTime,
    uSnow: { value: 0 },
  };
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 });
  mat.userData.uni = uni;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uni);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGW;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvGW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vGW; uniform sampler2D tCity; uniform vec4 uBounds;
        uniform float uModern, uSoviet, uDirt, uNight, uMap, uTime, uSnow;
        float gh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float gn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(gh(i), gh(i+vec2(1,0)), u.x), mix(gh(i+vec2(0,1)), gh(i+vec2(1,1)), u.x), u.y); }
        float gf(vec2 p){ return gn(p)*0.5 + gn(p*2.03)*0.25 + gn(p*4.1)*0.125 + gn(p*8.3)*0.0625; }
        float hfRoad = 0.0; float hfPark = 0.0;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          vec2 p = vGW.xz;
          float n1 = gf(p * 0.0012), n2 = gf(p * 0.011), n3 = gn(p * 0.09);
          // late-summer steppe: straw gold with sage patches
          vec3 straw = vec3(0.56, 0.47, 0.29), sage = vec3(0.36, 0.38, 0.22), dry = vec3(0.64, 0.56, 0.40);
          vec3 g = mix(straw, sage, smoothstep(0.35, 0.65, n1));
          g = mix(g, dry, smoothstep(0.55, 0.8, n2) * 0.6);
          g *= 0.86 + 0.28 * n3;
          vec2 uv = (p - uBounds.xy) / uBounds.zw;
          vec4 cm = vec4(0.0);
          if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) cm = texture2D(tCity, uv);
          float reveal = gn(p * 0.004) * 0.6 + gn(p * 0.02) * 0.4;
          float dirt = cm.a * uDirt;
          float sov = cm.g * smoothstep(reveal - 0.08, reveal + 0.08, uSoviet * 1.15 - 0.05);
          float mod_ = cm.r * smoothstep(reveal - 0.08, reveal + 0.08, uModern * 1.15 - 0.05);
          float park = cm.b * smoothstep(reveal - 0.08, reveal + 0.08, uModern * 1.15 - 0.05);
          g = mix(g, vec3(0.45, 0.38, 0.28) * (0.9 + 0.2 * n3), dirt * 0.85);
          vec3 urban = vec3(0.31, 0.30, 0.29) * (0.9 + 0.15 * n2);      // paved city ground
          float urbanMask = max(sov, mod_) ;
          g = mix(g, urban, smoothstep(0.0, 0.25, urbanMask) * 0.55);
          vec3 asphalt = vec3(0.13, 0.135, 0.14) * (0.9 + 0.2 * n3);
          float road = smoothstep(0.45, 0.75, max(sov, mod_));
          g = mix(g, asphalt, road);
          g = mix(g, vec3(0.17, 0.22, 0.11) * (0.85 + 0.3 * n2), park * 0.9);
          hfRoad = road; hfPark = park;
          // map mode: dark navy ground, glowing roads
          vec3 mapCol = mix(vec3(0.018, 0.035, 0.07), vec3(0.03, 0.06, 0.11), urbanMask);
          mapCol = mix(mapCol, vec3(0.06, 0.12, 0.2), road);
          g = mix(g, mapCol, uMap);
          diffuseColor.rgb = g;
        }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        {
          // street lights read as warm sodium/LED lines at night
          float flick = 0.75 + 0.25 * gn(vGW.xz * 0.15);
          totalEmissiveRadiance += vec3(1.0, 0.62, 0.28) * hfRoad * uNight * 0.16 * flick * (1.0 - uMap);
          totalEmissiveRadiance += vec3(0.15, 0.55, 1.0) * hfRoad * uMap * 0.12;
        }`);
  };
  mat.customProgramCacheKey = () => 'ground-v1';
  return mat;
}

// ---------------------------------------------------------------- water
function waterNormalTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);
  const hgt = (x, y) => fbm2(x / 14, y / 14, 4) * 0.7 + fbm2(x / 5 + 31, y / 5, 3) * 0.3;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    // tileable by sampling a torus-like wrap
    const hx = hgt((x + 1) % size, y) - hgt((x - 1 + size) % size, y);
    const hy = hgt(x, (y + 1) % size) - hgt(x, (y - 1 + size) % size);
    const n = new THREE.Vector3(-hx * 6, -hy * 6, 1).normalize();
    const i = (y * size + x) * 4;
    data[i] = (n.x * 0.5 + 0.5) * 255; data[i + 1] = (n.y * 0.5 + 0.5) * 255; data[i + 2] = (n.z * 0.5 + 0.5) * 255; data[i + 3] = 255;
  }
  const t = new THREE.DataTexture(data, size, size);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

export function waterMaterial() {
  const normalMap = waterNormalTexture();
  normalMap.repeat.set(1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0a2129, roughness: 0.04, metalness: 0.0, normalMap, normalScale: new THREE.Vector2(0.14, 0.14), envMapIntensity: 1.3,
  });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = shared.uTime; sh.uniforms.uMap = shared.uMap; sh.uniforms.uNight = shared.uNight;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWW;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWW; uniform float uTime; uniform float uMap; uniform float uNight;')
      .replace('#include <normal_fragment_maps>', `
        vec3 mapN1 = texture2D(normalMap, vWW.xz / 38.0 + vec2(uTime * 0.012, uTime * 0.004)).xyz * 2.0 - 1.0;
        vec3 mapN2 = texture2D(normalMap, vWW.xz / 13.0 - vec2(uTime * 0.02, -uTime * 0.011)).xyz * 2.0 - 1.0;
        vec3 mapN = normalize(vec3((mapN1.xy + mapN2.xy) * normalScale, 1.0));
        normal = normalize(tbn * mapN);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += vec3(0.1, 0.75, 1.0) * uMap * 0.35;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0), uMap);`);
  };
  mat.customProgramCacheKey = () => 'water-v1';
  return mat;
}
