// Shot list for the whole film. Each scene = list of shots (camera move + light +
// grade) on the global timeline. Neighbouring shots overlap for cross-dissolves.
import * as THREE from 'three';
import { mixGrade } from './engine.js';
import { piecewise, lerp, smooth, clamp, easeInOut, easeOut, easeSine } from './util.js';
import { LM, AXIS_Z, riverZ } from './geo.js';
import cues from '../data/cues.json';

const V = (a) => new THREE.Vector3(...a);
const P = (pts, u, ease = easeInOut) => {
  const c = new THREE.CatmullRomCurve3(pts.map((p) => V(p)), false, 'centripetal');
  return c.getPoint(clamp(ease(clamp(u))));
};
const L = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
const orbit = (c, r, h, a0, a1, u) => { const a = THREE.MathUtils.degToRad(lerp(a0, a1, u)); return V([c[0] + Math.cos(a) * r, h, c[2] + Math.sin(a) * r]); };

const [FX, FZ] = LM.fortress;
const [BX, BZ] = LM.baiterek;
const CUT = cues.landmarkCuts;

// ---------------------------------------------------------------- looks
const LOOK = {
  predawn: { fogMul: 0.9, sunElev: -3.2, sunAzim: 112, turbidity: 3, rayleigh: 2.6, mie: 0.003, mieG: 0.75, sunIntensity: 0, hemiIntensity: 1.0, hemiSky: [0.4, 0.5, 0.8], hemiGround: [0.14, 0.13, 0.15], envIntensity: 1.2, fogColor: [0.12, 0.16, 0.26], fogDensity: 0.000090, night: 0.25, cityGlow: 0.8, clouds: 0.25, skyGain: 7.0 },
  sunrise: { sunElev: 3.5, sunAzim: 118, turbidity: 4, rayleigh: 2.4, mie: 0.004, mieG: 0.76, sunIntensity: 3.0, sunColor: [1.0, 0.62, 0.32], hemiIntensity: 0.45, hemiSky: [0.55, 0.6, 0.85], hemiGround: [0.3, 0.22, 0.16], envIntensity: 0.8, fogColor: [0.62, 0.52, 0.48], fogDensity: 0.000065, night: 0.12, cityGlow: 0.2, clouds: 0.3 },
  history: { sunElev: 17, sunAzim: 235, turbidity: 5, rayleigh: 1.2, mie: 0.005, mieG: 0.8, sunIntensity: 3.4, sunColor: [1.0, 0.86, 0.66], hemiIntensity: 0.6, hemiSky: [0.7, 0.72, 0.8], hemiGround: [0.45, 0.38, 0.28], envIntensity: 0.6, fogColor: [0.74, 0.7, 0.62], fogDensity: 0.000110, clouds: 0.45, cloudDensity: 0.55 },
  day: { sunElev: 38, sunAzim: 200, turbidity: 2.6, rayleigh: 1.2, mie: 0.003, mieG: 0.78, sunIntensity: 3.4, sunColor: [1, 0.95, 0.88], hemiIntensity: 0.65, envIntensity: 1.0, fogColor: [0.66, 0.76, 0.9], fogDensity: 0.000045, clouds: 0.38 },
  golden: { sunElev: 8, sunAzim: 255, turbidity: 3.5, rayleigh: 1.8, mie: 0.004, mieG: 0.76, sunIntensity: 3.6, sunColor: [1, 0.72, 0.42], hemiIntensity: 0.5, hemiSky: [0.6, 0.66, 0.9], hemiGround: [0.4, 0.3, 0.2], envIntensity: 0.9, fogColor: [0.85, 0.7, 0.55], fogDensity: 0.000055, clouds: 0.32 },
  blueHour: { sunElev: -4.5, sunAzim: 260, turbidity: 3, rayleigh: 2.5, mie: 0.004, sunIntensity: 0, hemiIntensity: 0.22, hemiSky: [0.3, 0.42, 0.75], hemiGround: [0.08, 0.08, 0.1], envIntensity: 0.7, fogColor: [0.07, 0.11, 0.2], fogDensity: 0.000060, night: 0.85, cityGlow: 1.0, clouds: 0.2, skyGain: 1.7 },
  night: { sunElev: -12, sunAzim: 260, turbidity: 2, rayleigh: 2, sunIntensity: 0, hemiIntensity: 0.12, hemiSky: [0.25, 0.32, 0.6], hemiGround: [0.05, 0.05, 0.06], envIntensity: 0.5, fogColor: [0.03, 0.05, 0.1], fogDensity: 0.000055, night: 1.0, cityGlow: 1.0, clouds: 0.1, skyGain: 1.0 },
  map: { sunElev: -8, sunAzim: 200, sunIntensity: 0, hemiIntensity: 0.9, hemiSky: [0.5, 0.65, 1.0], hemiGround: [0.1, 0.12, 0.2], envIntensity: 0.6, fogColor: [0.02, 0.04, 0.09], fogDensity: 0.000015, night: 1.0, cityGlow: 0.4, clouds: 0, skyGain: 0.5 },
  finale: { sunElev: 4.5, sunAzim: 93, turbidity: 4, rayleigh: 2.4, mie: 0.0045, mieG: 0.78, sunIntensity: 3.4, sunColor: [1.0, 0.66, 0.36], hemiIntensity: 0.5, hemiSky: [0.6, 0.62, 0.85], hemiGround: [0.32, 0.24, 0.18], envIntensity: 0.9, fogColor: [0.75, 0.58, 0.48], fogDensity: 0.000060, night: 0.05, clouds: 0.36 },
};
const G = {
  cold: { exposure: 0.85, temp: -0.55, saturation: 0.85, contrast: 1.12, vignette: 0.85, bloom: 0.8, bloomThreshold: 1.2, shadowTint: [0, 0.12, 0.35], highTint: [0.1, 0.1, 0.2] },
  warm: { temp: 0.35, saturation: 1.1, contrast: 1.08, vignette: 0.6, bloom: 0.75, bloomThreshold: 2.0 },
  archive: { temp: 0.25, saturation: 0.55, contrast: 1.12, sepia: 0.62, grain: 0.075, vignette: 0.95, lift: 0.02, chroma: 0.012, bloom: 0.35 },
  soviet: { temp: -0.1, saturation: 0.6, contrast: 1.08, sepia: 0.22, grain: 0.06, vignette: 0.8, lift: 0.025, bloom: 0.35 },
  modern: { temp: 0.12, saturation: 1.08, contrast: 1.07, vignette: 0.6, bloom: 0.5 },
  night: { exposure: 0.75, temp: -0.15, saturation: 1.15, contrast: 1.12, vignette: 0.7, bloom: 0.55, bloomThreshold: 0.9, bloomRadius: 0.5, shadowTint: [0, 0.18, 0.35], highTint: [0.45, 0.25, 0.0] },
  map: { temp: -0.2, saturation: 1.1, contrast: 1.1, vignette: 0.75, bloom: 0.6, bloomThreshold: 0.8, grain: 0.02 },
  vivid: { temp: 0.08, saturation: 1.14, contrast: 1.08, vignette: 0.5, bloom: 0.45 },
  golden: { temp: 0.45, saturation: 1.12, contrast: 1.07, vignette: 0.6, bloom: 0.8, bloomThreshold: 2.0, highTint: [0.45, 0.25, 0.0] },
};
const mixObj = (a, b, u) => { const o = { ...a }; for (const k of Object.keys(b)) { if (Array.isArray(b[k])) o[k] = (a[k] || b[k]).map((v, i) => lerp(v, b[k][i], u)); else if (typeof b[k] === 'number') o[k] = lerp(a[k] ?? b[k], b[k], u); } return o; };

// ---------------------------------------------------------------- years per scene
export const YEAR = (t) => piecewise([
  [0, 2026], [9.99, 2026],
  [10, 1830], [15, 1840], [19.0, 1862], [20.4, 1885], [21.2, 1961], [22.3, 1994], [23.5, 1997], [26.8, 1998.2], [30, 2000],
  [30.01, 2000], [44, 2025.5], [200, 2026],
], t);

// ---------------------------------------------------------------- shots
// cam(u, t) -> { pos: Vector3, target: Vector3, fov }
export const SHOTS = [
  // ===== S1 — introduction: dark steppe -> Ishim -> Baiterek at first light
  { id: 's1a', t0: 0, t1: 6.0, look: (u) => mixObj(LOOK.predawn, { sunElev: -3 }, u), grade: () => G.cold,
    cam: (u) => ({ pos: P([[-8200, 26, 760], [-7200, 30, 700], [-6100, 46, 640]], u, (x) => x), target: P([[-7000, 8, 650], [-6000, 14, 600], [-4800, 30, 520]], u, (x) => x), fov: 46 }) },
  { id: 's1b', t0: 5.0, t1: 10.6, dissolve: 0.9, look: (u) => mixObj(mixObj(LOOK.predawn, LOOK.sunrise, smooth(0, 0.75, u)), {}, 0),
    grade: (u) => mixObj(G.cold, G.warm, smooth(0.1, 0.8, u)),
    cam: (u) => ({ pos: P([[-1150, 70, 1330], [-760, 74, 1285], [-430, 70, 1248]], u, easeOut), target: P([[0, 60, 1200], [0, 70, 1200], [0, 76, 1200]], u), fov: lerp(36, 32, u) }),
    state: { baiterekGlow: 1.2 } },

  // ===== S2 — history: Akmola fortress 1830 -> Tselinograd -> capital
  { id: 's2a', t0: 9.4, t1: 15.6, look: () => LOOK.history, grade: () => G.archive, shadow: [FX, FZ, 900],
    cam: (u) => ({ pos: orbit([FX, 0, FZ], 980, lerp(520, 380, u), 115, 85, easeSine(u)), target: V([FX + 60, 0, FZ - 40]), fov: 34 }) },
  { id: 's2b', t0: 15.0, t1: 20.6, dissolve: 0.6, look: () => LOOK.history, grade: () => G.archive, shadow: [FX, FZ, 500],
    cam: (u) => ({ pos: P([[FX - 300, 30, FZ + 200], [FX - 60, 24, FZ + 205], [FX + 210, 34, FZ + 175]], u), target: P([[FX - 80, 4, FZ + 40], [FX + 40, 4, FZ + 20], [FX + 220, 8, FZ - 40]], u), fov: 40 }) },
  { id: 's2c', t0: 20.0, t1: 30.6, dissolve: 0.6, look: (u) => ({ ...mixObj(LOOK.history, LOOK.golden, smooth(0.25, 0.9, u)), sunElev: lerp(24, 30, u), sunAzim: 240 }),
    grade: (u, t) => {
      const yr = YEAR(t);
      if (yr < 1950) return G.archive;
      if (yr < 1995) return mixObj(G.archive, G.soviet, smooth(1940, 1965, yr));
      return mixObj(G.soviet, G.modern, smooth(1994, 1998.1, yr));
    },
    shadow: (u) => [lerp(FX, 0, u), lerp(FZ, 800, u), lerp(900, 2600, u)],
    cam: (u) => ({ pos: P([[FX + 180, 140, FZ - 640], [FX + 360, 300, FZ - 1100], [FX + 560, 560, FZ - 1650]], u), target: P([[FX, 0, FZ], [FX + 260, 0, FZ + 600], [0, 40, 1300]], u), fov: lerp(40, 44, u) }) },

  // ===== S3 — transformation time-lapse (2000 -> 2025)
  { id: 's3a', t0: 29.4, t1: 36.3, dissolve: 0.8, look: (u, t) => ({ ...LOOK.day, sunElev: lerp(16, 34, smooth(29.4, 47, t)), sunAzim: lerp(120, 200, smooth(29.4, 47, t)), cloudTime: t * 900, clouds: 0.42 }),
    grade: () => G.modern, state: { cranes: true }, shadow: [0, 1600, 2600],
    cam: (u) => ({ pos: orbit([0, 0, 1650], 2900, lerp(1000, 820, u), 112, 128, u), target: V([0, 40, 1500]), fov: 42 }) },
  { id: 's3b', t0: 35.7, t1: 41.3, dissolve: 0.6, look: (u, t) => ({ ...LOOK.day, sunElev: lerp(30, 14, smooth(35.7, 47, t)), sunAzim: lerp(200, 255, smooth(35.7, 47, t)), cloudTime: t * 900, clouds: 0.4 }),
    grade: () => G.modern, state: { cranes: true, carMode: 'trails' }, shadow: [700, 1200, 1300],
    cam: (u) => ({ pos: P([[-1950, 170, 1300], [-1250, 150, 1260], [-560, 125, 1230]], u, (x) => x), target: P([[-900, 40, 1200], [-150, 50, 1200], [600, 60, 1200]], u, (x) => x), fov: 46 }) },
  { id: 's3c', t0: 40.7, t1: 47.6, dissolve: 0.6, look: (u, t) => ({ ...LOOK.golden, sunElev: lerp(13, 5, u), sunAzim: lerp(250, 262, u), cloudTime: t * 400 }),
    grade: () => G.golden, state: { cranes: true }, shadow: [0, 1000, 2800],
    cam: (u) => ({ pos: P([[600, 80, 2700], [700, 300, 3300], [800, 640, 3950]], u), target: P([[0, 110, 1300], [0, 80, 1100], [0, 40, 900]], u), fov: 42 }) },

  // ===== S4 — population: 3D map, then the street
  { id: 's4a', t0: 46.4, t1: 56.0, dissolve: 0.7, look: (u) => mixObj(LOOK.golden, LOOK.map, smooth(0.0, 0.18, u)), grade: (u) => mixObj(G.golden, G.map, smooth(0, 0.18, u)),
    state: (u, t) => ({ map: smooth(47.0, 48.3, t), pop: popAt(t), cars: false }), shadow: [0, 600, 4000],
    cam: (u) => ({ pos: orbit([300, 0, 900], 4300, lerp(3900, 3300, u), lerp(102, 80, easeSine(u)), lerp(102, 80, easeSine(u)), 0), target: V([200, 0, 500]), fov: 46 }) },
  { id: 's4b', t0: 55.2, t1: 62.6, dissolve: 0.7, look: () => ({ ...LOOK.golden, sunAzim: 262, sunElev: 9 }), grade: () => G.golden,
    state: { map: 0, crowd: 'boulevard' }, shadow: [-200, 1200, 160], near: 0.2,
    cam: (u) => ({ pos: P([[-292, 1.75, 1204], [-262, 1.7, 1203], [-232, 1.68, 1202]], u, (x) => x), target: P([[0, 32, 1196], [0, 38, 1196], [0, 44, 1196]], u, (x) => x), fov: 36 }) },

  // ===== S5 — economy: financial district at blue hour
  { id: 's5a', t0: 61.9, t1: 68.4, dissolve: 0.7, look: () => LOOK.blueHour, grade: () => G.night, state: { carMode: 'trails', data: 0 }, shadow: [300, 1800, 1500],
    cam: (u) => ({ pos: P([[1450, 300, 2900], [950, 230, 2350], [560, 190, 2050]], u, (x) => easeOut(x)), target: P([[200, 120, 1800], [150, 130, 1750], [100, 140, 1700]], u), fov: 44 }) },
  { id: 's5b', t0: 67.8, t1: 74.2, dissolve: 0.6, look: () => ({ ...LOOK.blueHour, sunElev: -6, night: 0.95 }), grade: () => G.night, state: (u) => ({ carMode: 'trails', data: smooth(0.2, 1, u) * 0.6 }), shadow: [250, 1850, 800],
    cam: (u) => ({ pos: orbit([250, 0, 1850], 520, lerp(260, 300, u), 40, 85, u), target: V([250, 120, 1850]), fov: 46 }) },
  { id: 's5c', t0: 73.6, t1: 80.4, dissolve: 0.6, look: () => LOOK.night, grade: () => G.night, state: (u) => ({ carMode: 'trails', data: 0.6 + 0.4 * u }), shadow: [0, 1200, 3000],
    cam: (u) => ({ pos: P([[-500, 320, 2500], [-700, 600, 3100], [-900, 950, 3700]], u), target: P([[100, 60, 1500], [100, 40, 1200], [100, 0, 900]], u), fov: 44 }) },

  // ===== S6 — tourism & landmarks
  { id: 's6a', t0: 79.7, t1: CUT[0], dissolve: 0.7, look: () => ({ ...LOOK.day, sunAzim: 160 }), grade: () => G.vivid, state: { crowd: 'river' }, shadow: [300, riverZ(300) + 60, 500], near: 0.3,
    cam: (u) => ({ pos: P([[-120, 16, riverZ(-120) + 96], [60, 15, riverZ(60) + 94], [230, 14, riverZ(230) + 92]], u, (x) => x), target: P([[720, 120, -820], [740, 130, -820], [760, 140, -820]], u, (x) => x), fov: 44 }) },
  { id: 's6b', t0: CUT[0], t1: CUT[1], look: () => LOOK.day, grade: () => G.vivid, shadow: [BX, BZ, 250], near: 0.5,
    cam: (u) => ({ pos: V([BX - 70 + 10 * u, 3, BZ + 55 - 6 * u]), target: V([BX, lerp(40, 86, easeOut(u)), BZ]), fov: 52 }) },
  { id: 's6c', t0: CUT[1], t1: CUT[2], look: () => ({ ...LOOK.day, sunAzim: 215 }), grade: () => G.vivid, shadow: [LM.khanShatyr[0], LM.khanShatyr[1], 350],
    cam: (u) => ({ pos: orbit([LM.khanShatyr[0], 0, LM.khanShatyr[1]], 330, 30 + 10 * u, 35, 48, u), target: V([LM.khanShatyr[0] + 10, 70, LM.khanShatyr[1]]), fov: 46 }) },
  { id: 's6d', t0: CUT[2], t1: CUT[3], look: () => ({ ...LOOK.golden, sunElev: 14, sunAzim: 240 }), grade: () => G.golden, shadow: [LM.nurAlem[0], LM.nurAlem[1], 400],
    cam: (u) => ({ pos: orbit([LM.nurAlem[0], 0, LM.nurAlem[1]], 210 - 30 * u, 26 + 8 * u, 300, 315, u), target: V([LM.nurAlem[0], 58, LM.nurAlem[1]]), fov: 48 }) },
  { id: 's6e', t0: CUT[3], t1: CUT[4], look: () => ({ ...LOOK.day, sunAzim: 230 }), grade: () => G.vivid, shadow: [LM.museum[0], LM.museum[1], 300],
    cam: (u) => ({ pos: V([LM.museum[0] - 240 + 30 * u, 140 - 10 * u, LM.museum[1] + 250 - 20 * u]), target: V([LM.museum[0], 15, LM.museum[1] + 50]), fov: 38 }) },
  { id: 's6f', t0: CUT[4], t1: CUT[5], look: () => ({ ...LOOK.golden, sunElev: 12, sunAzim: 262 }), grade: () => G.golden, shadow: [LM.akOrda[0] - 100, LM.akOrda[1], 350],
    cam: (u) => ({ pos: V([LM.akOrda[0] - 470 + 70 * u, 18 + 6 * u, LM.akOrda[1] + 2]), target: V([LM.akOrda[0], 42, LM.akOrda[1]]), fov: 34 }) },
  { id: 's6g', t0: CUT[5], t1: 94.4, look: () => LOOK.night, grade: () => G.night, state: { crowd: 'baiterek' }, shadow: [BX, BZ, 400],
    cam: (u) => ({ pos: orbit([BX, 0, BZ], lerp(330, 270, u), lerp(140, 105, u), 200, 245, u), target: V([BX, 62, BZ]), fov: 44 }) },
  { id: 's6h', t0: 93.8, t1: 100.6, dissolve: 0.6, look: () => ({ ...LOOK.night, cityGlow: 1 }), grade: () => G.night, state: { crowd: 'khan' }, shadow: [LM.khanShatyr[0] + 300, LM.khanShatyr[1], 200], near: 0.3,
    cam: (u) => ({ pos: P([[LM.khanShatyr[0] + 360, 1.8, LM.khanShatyr[1] + 12], [LM.khanShatyr[0] + 336, 1.8, LM.khanShatyr[1] + 9]], u, (x) => x), target: V([LM.khanShatyr[0], 38, LM.khanShatyr[1] - 6]), fov: 42 }) },

  // ===== S7 — future: light rail, green spaces, golden skyline
  { id: 's7a', t0: 99.9, t1: 106.0, dissolve: 0.7, look: () => LOOK.golden, grade: () => G.golden, state: { data: 0.25 }, shadow: (u, t) => [trainX(t), 2060, 300],
    cam: (u, t) => { const x = trainX(t); return { pos: V([x + 55 - 30 * u, 17 + 3 * u, 2060 + 34]), target: V([x - 30, 14, 2058]), fov: 48 }; } },
  { id: 's7b', t0: 105.4, t1: 112.5, dissolve: 0.6, look: () => ({ ...LOOK.golden, sunElev: 6.5 }), grade: () => G.golden, state: (u) => ({ data: 0.3 + 0.4 * u, crowd: 'park' }), shadow: (u) => [-500, 1260, lerp(250, 1500, u)], near: 0.5,
    cam: (u) => ({ pos: P([[-660, 4, 1262], [-760, 60, 1340], [-980, 280, 1520]], u), target: P([[-200, 30, 1220], [0, 60, 1200], [300, 80, 1150]], u), fov: lerp(38, 44, u) }) },

  // ===== S8 — finale: the flag, sunrise behind the skyline
  { id: 's8a', t0: 111.9, t1: 120.5, dissolve: 0.6, look: (u) => ({ ...LOOK.finale, sunElev: lerp(3.5, 6.5, u) }), grade: () => ({ ...G.golden, bloom: 1.0, temp: 0.4 }), shadow: (u) => [-500, 1200, lerp(300, 1800, u)], near: 0.5,
    cam: (u) => ({ pos: P([[-752, 34, 1232], [-790, 62, 1244], [-860, 112, 1258]], u, easeSine), target: P([[-640, 47, 1196], [-560, 50, 1195], [-420, 52, 1192]], u, easeSine), fov: lerp(40, 46, u) }) },
];

function popAt(t) {
  // millions: 2017 -> 1.0, 2026 -> 1.538 (BNS, 1 Jan 2026)
  if (t < cues.pop2017) return 0.85 * smooth(47.5, cues.pop2017, t);
  if (t < cues.popCount) return 1.0;
  return lerp(1.0, 1.5382, easeOut(clamp((t - cues.popCount) / (cues.popFinal - cues.popCount))));
}
export function trainX(t) { const x0 = -3200, x1 = 3400; return x0 + 200 + ((t * 22) % (x1 - x0 - 400)) + 25; }

export const CROWDS = {
  boulevard: { x: -200, z: BZ, w: 220, d: 90, n: 170, dir: [1, 0], speed: 1.25, kids: 0.2, photo: 0.06 },
  river: { x: 120, z: riverZ(120) + 88, w: 600, d: 16, n: 150, dir: [1, 0.15], speed: 1.2, photo: 0.18 },
  baiterek: { x: BX, z: BZ, w: 140, d: 140, n: 150, speed: 1.0, photo: 0.25 },
  khan: { x: LM.khanShatyr[0] + 300, z: LM.khanShatyr[1] + 4, w: 70, d: 46, n: 120, dir: [1, 0.2], speed: 0.9, photo: 0.5 },
  park: { x: -560, z: 1265, w: 260, d: 40, n: 120, dir: [1, 0], speed: 1.2, kids: 0.1, photo: 0.05 },
};

// Evaluate the frame at global time t (optionally restricted to one scene window)
export function evalFrame(t, scene) {
  const pool = scene ? SHOTS.filter((s) => s.id.startsWith(scene)) : SHOTS;
  const active = pool.filter((s) => t >= s.t0 && t < s.t1);
  if (!active.length) active.push(t < pool[0].t0 ? pool[0] : pool[pool.length - 1]);
  const build = (s) => {
    const u = clamp((t - s.t0) / (s.t1 - s.t0));
    const cam = s.cam(u, t);
    const st = typeof s.state === 'function' ? s.state(u, t) : (s.state || {});
    const sh = typeof s.shadow === 'function' ? s.shadow(u, t) : s.shadow;
    const look = { ...s.look(u, t) };
    if (sh) { look.shadowCenter = [sh[0], sh[1]]; look.shadowSize = sh[2]; }
    return { id: s.id, pos: cam.pos, target: cam.target, fov: cam.fov, near: s.near, look, grade: s.grade(u, t), state: st };
  };
  if (active.length === 1) { const a = build(active[0]); return { t, shots: [a], mix: 0, grade: a.grade }; }
  // two overlapping shots: the later one dissolves in (or hard cut if no dissolve)
  active.sort((a, b) => a.t0 - b.t0);
  const [a, b] = active.slice(-2);
  const d = b.dissolve || 0;
  const m = d ? smooth(b.t0, b.t0 + d, t) : 1;
  if (m >= 1) { const B = build(b); return { t, shots: [B], mix: 0, grade: B.grade }; }
  const A = build(a), B = build(b);
  return { t, shots: [A, B], mix: m, grade: mixGrade(A.grade, B.grade, m) };
}
