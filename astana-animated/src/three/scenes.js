// Shot list for the whole film. Each scene = list of shots (camera move + light +
// grade) on the global timeline. Neighbouring shots overlap for cross-dissolves.
import * as THREE from 'three';
import { mixGrade, DEFAULT_LOOK, DEFAULT_GRADE } from './engine.js';
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
LOOK.morning = { ...LOOK.sunrise, fogMul: 0.7, sunColor: [1, 0.78, 0.55], sunElev: 7, sunAzim: 62, sunIntensity: 3.2, hemiIntensity: 0.85, envIntensity: 1.0, clouds: 0.45, cloudDensity: 0.4 };
LOOK.sunny = { ...LOOK.day, sunElev: 30, sunAzim: 215, hemiIntensity: 0.9, envIntensity: 1.1, clouds: 0.5, cloudDensity: 0.4 };
LOOK.warm = { ...LOOK.golden, sunElev: 16, sunAzim: 238, hemiIntensity: 0.85, envIntensity: 1.0, clouds: 0.45 };
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
const STORY = { saturation: 1.2, contrast: 1.0, temp: 0.22, vignette: 0.4, grain: 0.012, chroma: 0.003, bloom: 0.55, bloomThreshold: 1.8, lift: 0.015, shadowTint: [0.05, 0.12, 0.3], highTint: [0.35, 0.22, 0.05] };
G.story = STORY;
G.storyWarm = { ...STORY, temp: 0.4, saturation: 1.22 };
G.storyDawn = { ...STORY, temp: 0.18, saturation: 1.12, bloom: 0.5, bloomThreshold: 2.2 };
G.vintage = { ...STORY, saturation: 0.82, temp: 0.4, sepia: 0.22, grain: 0.03, vignette: 0.7, lift: 0.025 };
G.storyNight = { ...G.night, saturation: 1.2, grain: 0.012, vignette: 0.45, bloom: 0.6, bloomThreshold: 1.3 };
G.storyMap = { ...G.map, grain: 0.01 };
const DEF = { ...DEFAULT_LOOK, ...DEFAULT_GRADE };
const mixObj = (a, b, u) => { const o = { ...a }; for (const k of Object.keys(b)) { const av = a[k] ?? DEF[k] ?? b[k]; if (Array.isArray(b[k])) o[k] = av.map((v, i) => lerp(v, b[k][i], u)); else if (typeof b[k] === 'number') o[k] = lerp(av, b[k], u); } return o; };


// ---------------------------------------------------------------- years per scene
const YEARS = {
  s1: [[0, 1830], [5.6, 1830], [7.9, 2026]],
  s2: [[0, 1830], [16.9, 1838], [17.3, 1862], [20.4, 1905], [20.9, 1961], [22.0, 1992], [22.4, 1997], [26.6, 1998.1], [31, 2000.2]],
  s3: [[0, 2000.2], [30.4, 2000.4], [33.8, 2002.2], [39.0, 2014], [43.0, 2025.5], [50, 2026]],
};
export const yearFor = (t, scene) => (YEARS[scene] ? piecewise(YEARS[scene], t) : 2026);
export const YEAR = (t) => yearFor(t, t < 12 ? 's1' : t < 30 ? 's2' : t < 45 ? 's3' : 's4');

const yawTo = (from, to) => Math.atan2(to[0] - from[0], to[2] - from[2]);
const [KX, KZ] = LM.khanShatyr;
const [OX, OZ] = LM.opera;
const [MX, MZ] = LM.mosque;
const [VX, VZ] = LM.viewpoint;
const TC = cues.tourCuts;
const G1 = [-238, 0.3, 1209.5];                 // S1 guide on the boulevard plaza
const G2 = [FX - 30, 0.0, FZ + 215];           // S2 guide by the Ishim in 1830
const G7 = [150, 0.7, riverZ(150) + 93];        // S7 guide on the embankment
const G8 = [VX + 12, 45.2, VZ];                 // S8 guide on the viewpoint terrace
const walkX = (t) => -470 + 1.25 * (t - 44.5);  // S4 walk along the boulevard
const cbdX = (t) => 118 + 1.3 * (t - 59.5);     // S5 walk through the business district

export const SHOTS = [
  // ===== S1 — steppe at sunrise -> settlement -> the modern capital, guide appears
  { id: 's1a', t0: 0, t1: 5.0, look: (u) => ({ ...LOOK.morning, sunElev: lerp(4.5, 6.5, u) }), grade: () => G.storyDawn, state: { grass: true }, shadow: [-7250, 700, 220], near: 0.2,
    cam: (u) => ({ pos: P([[-7420, 2.3, 702], [-7330, 2.9, 699], [-7240, 4.4, 696]], u, (x) => x), target: P([[-7300, -6, 699], [-7200, -4.5, 697], [-7100, -2, 694]], u, (x) => x), fov: 52 }) },
  { id: 's1b', t0: 4.4, t1: 8.8, dissolve: 0.6, look: (u) => ({ ...LOOK.morning, sunElev: lerp(9, 13, u) }), grade: () => G.storyDawn, state: { cranes: true }, shadow: (u) => [lerp(FX, -300, u), lerp(FZ, 600, u), lerp(700, 2400, u)],
    cam: (u) => ({ pos: P([[FX - 330, 110, FZ - 300], [FX - 260, 190, FZ - 260], [FX - 180, 300, FZ - 220]], u), target: P([[FX + 120, 0, FZ + 260], [FX + 420, 10, FZ + 1100], [0, 40, 1250]], u), fov: 46 }) },
  { id: 's1c', t0: 8.2, t1: 12.6, dissolve: 0.5, look: () => LOOK.warm, grade: () => G.storyWarm, shadow: [-230, 1210, 120], near: 0.2,
    state: (u, t) => ({ guide: { pos: G1, yaw: yawTo(G1, [-262, 0, 1213]), action: t > cues.title1 - 0.7 ? 'wave' : 'idle', t0: cues.title1 - 0.7, talk: true } }),
    cam: (u) => ({ pos: P([[-242.7, 1.5, 1211.2], [-242.1, 1.48, 1211.0]], u, (x) => x), target: P([[-200, 17, 1203.5], [-200, 18, 1203.5]], u, (x) => x), fov: 46 }) },

  // ===== S2 — history 1830 -> 1998
  { id: 's2a', t0: 11.5, t1: 17.3, look: () => ({ ...LOOK.history, sunElev: 24, sunAzim: 200, hemiIntensity: 0.8 }), grade: () => G.vintage, shadow: [FX - 60, FZ + 120, 260], near: 0.2,
    state: (u, t) => ({ guide: { pos: G2, yaw: yawTo(G2, [G2[0] + 0.6, 0, G2[2] + 5]), action: 'present', talk: true, phase: 1.3 } }),
    cam: (u) => ({ pos: P([[G2[0] + 0.5, 1.55, G2[2] + 5.0], [G2[0] + 1.1, 1.65, G2[2] + 4.4]], u, (x) => x), target: P([[G2[0] - 6, 9, G2[2] - 110], [G2[0] - 4, 10, G2[2] - 110]], u, (x) => x), fov: 46 }) },
  { id: 's2b', t0: 16.8, t1: 20.8, dissolve: 0.5, look: () => LOOK.history, grade: () => G.vintage, shadow: [FX + 100, FZ - 100, 700],
    cam: (u) => ({ pos: P([[FX - 380, 70, FZ + 300], [FX - 100, 95, FZ + 260], [FX + 220, 120, FZ + 200]], u), target: P([[FX, 0, FZ], [FX + 100, 0, FZ - 100], [FX + 250, 0, FZ - 200]], u), fov: 42 }) },
  { id: 's2c', t0: 20.2, t1: 30.6, dissolve: 0.6, look: (u) => ({ ...mixObj(LOOK.history, LOOK.golden, smooth(0.25, 0.9, u)), sunElev: lerp(24, 30, u), sunAzim: 240 }),
    grade: (u, t) => mixObj(G.vintage, G.story, smooth(21, 27, t)),
    shadow: (u) => [lerp(FX, 0, u), lerp(FZ, 800, u), lerp(900, 2600, u)],
    cam: (u) => ({ pos: P([[FX + 180, 140, FZ - 640], [FX + 360, 300, FZ - 1100], [FX + 560, 560, FZ - 1650]], u), target: P([[FX, 0, FZ], [FX + 260, 0, FZ + 600], [0, 40, 1300]], u), fov: lerp(40, 44, u) }) },

  // ===== S3 — Baiterek rises, the city transforms, lights come on
  { id: 's3a', t0: 29.4, t1: 34.6, look: (u, t) => ({ ...LOOK.sunny, cloudTime: t * 600 }), grade: () => G.story, shadow: [0, 1200, 220], state: { cranes: true },
    cam: (u) => ({ pos: orbit([0, 0, 1200], lerp(170, 140, u), lerp(30, 55, u), 200, 232, u), target: V([0, lerp(40, 62, u), 1200]), fov: 46 }) },
  { id: 's3b', t0: 34.0, t1: 39.6, dissolve: 0.6, look: (u, t) => ({ ...LOOK.sunny, sunElev: lerp(28, 16, u), sunAzim: lerp(215, 245, u), cloudTime: t * 900 }), grade: () => G.story, state: { cranes: true, carMode: 'trails' }, shadow: [-700, 1200, 1300],
    cam: (u) => ({ pos: P([[-1950, 170, 1300], [-1250, 150, 1260], [-560, 125, 1230]], u, (x) => x), target: P([[-900, 40, 1200], [-150, 50, 1200], [600, 60, 1200]], u, (x) => x), fov: 46 }) },
  { id: 's3c', t0: 39.0, t1: 45.6, dissolve: 0.6, look: (u, t) => ({ ...LOOK.golden, sunElev: lerp(10, 4.5, u), sunAzim: 262, cloudTime: t * 400 }),
    grade: (u) => mixObj(G.storyWarm, G.storyNight, smooth(0.8, 1, u) * 0.5), state: { cranes: true }, shadow: [0, 1000, 2800],
    cam: (u) => ({ pos: P([[600, 80, 2700], [700, 300, 3300], [800, 640, 3950]], u), target: P([[0, 110, 1300], [0, 80, 1100], [0, 40, 900]], u), fov: 42 }) },

  // ===== S4 — a city of people: walk with families, then the living map
  { id: 's4a', t0: 44.5, t1: 52.4, look: () => ({ ...LOOK.warm, sunElev: 18, sunAzim: 235 }), grade: () => G.storyWarm, near: 0.2,
    shadow: (u, t) => [walkX(t), 1215, 90],
    state: (u, t) => ({ crowd: 'family', guide: { pos: [walkX(t), 0.3, 1218], yaw: Math.PI / 2, action: 'walk', speed: 1.25, talk: true } }),
    cam: (u, t) => { const x = walkX(t); return { pos: V([x + 1.6, 1.45, 1218 + 4.6]), target: V([x + 0.25, 1.15, 1218]), fov: 40 }; } },
  { id: 's4b', t0: 51.8, t1: 60.6, dissolve: 0.7, look: (u) => mixObj(LOOK.golden, LOOK.map, smooth(0.0, 0.15, u)), grade: (u) => mixObj(G.storyWarm, G.storyMap, smooth(0, 0.15, u)),
    state: (u, t) => ({ map: smooth(52.0, 53.2, t), pop: popAt(t), cars: false }), shadow: [0, 600, 4000],
    cam: (u) => ({ pos: orbit([300, 0, 900], 4300, lerp(3900, 3300, u), lerp(102, 80, easeSine(u)), lerp(102, 80, easeSine(u)), 0), target: V([200, 0, 500]), fov: 46 }) },

  // ===== S5 — economy: guide in the business district, construction, the big number
  { id: 's5a', t0: 59.5, t1: 64.7, look: () => ({ ...LOOK.warm, sunElev: 22, sunAzim: 225 }), grade: () => G.storyWarm, near: 0.2,
    shadow: (u, t) => [cbdX(t), 1868, 160],
    state: (u, t) => ({ guide: { pos: [cbdX(t), 0.3, 1868], yaw: Math.PI / 2, action: 'walk', speed: 1.3, talk: true, phase: 2 } }),
    cam: (u, t) => { const x = cbdX(t); return { pos: V([x + 5.2, 0.85, 1868 + 2.6]), target: V([x - 0.6, 3.2, 1866.6]), fov: 52 }; } },
  { id: 's5b', t0: 64.1, t1: 69.6, dissolve: 0.6, look: () => ({ ...LOOK.sunny, sunElev: 24, sunAzim: 230 }), grade: () => G.story, state: { cranes: true }, shadow: [-1600, 3000, 1600],
    cam: (u) => ({ pos: orbit([-1600, 0, 3000], 1100, lerp(420, 360, u), 70, 95, u), target: V([-1600, 20, 3000]), fov: 44 }) },
  { id: 's5c', t0: 69.0, t1: 77.6, dissolve: 0.6, look: () => ({ ...LOOK.golden, sunElev: 10, sunAzim: 250 }), grade: () => G.storyWarm, shadow: [250, 1850, 900],
    cam: (u) => ({ pos: orbit([250, 0, 1850], 560, lerp(240, 300, u), 120, 165, u), target: V([250, 110, 1850]), fov: 46 }) },

  // ===== S6 — budget: calm city backgrounds behind the infographic
  { id: 's6a', t0: 76.5, t1: 81.6, look: () => LOOK.warm, grade: () => G.storyWarm, shadow: [-300, 1250, 1100],
    cam: (u) => ({ pos: P([[-950, 260, 1650], [-750, 245, 1620], [-520, 235, 1590]], u, (x) => x), target: V([0, 0, 1200]), fov: 44 }) },
  { id: 's6b', t0: 81.0, t1: 86.6, dissolve: 0.6, look: () => ({ ...LOOK.golden, sunElev: 12 }), grade: () => G.storyWarm, shadow: (u, t) => [trainX(t), 2060, 300],
    cam: (u, t) => { const x = trainX(t); return { pos: V([x + 60 - 30 * u, 18 + 4 * u, 2060 + 40]), target: V([x - 25, 14, 2058]), fov: 48 }; } },
  { id: 's6c', t0: 86.0, t1: 92.6, dissolve: 0.6, look: () => ({ ...LOOK.warm, sunElev: 12, sunAzim: 250 }), grade: () => G.storyWarm, shadow: [1700, 800, 1000],
    cam: (u) => ({ pos: P([[1250, 190, 250], [1380, 175, 330], [1500, 165, 420]], u, (x) => x), target: V([1850, 0, 950]), fov: 44 }) },

  // ===== S7 — tourism: landmarks, embankment selfie, evening skyline
  { id: 's7a', t0: 91.5, t1: TC[0], look: () => LOOK.sunny, grade: () => G.story, shadow: [BX, BZ, 250], near: 0.5,
    cam: (u) => ({ pos: orbit([BX, 0, BZ], 78, 3.5, 150, 175, u), target: V([BX, lerp(55, 84, easeOut(u)), BZ]), fov: 54 }) },
  { id: 's7b', t0: TC[0], t1: TC[1], look: () => ({ ...LOOK.sunny, sunAzim: 215 }), grade: () => G.story, shadow: [KX, KZ, 350],
    cam: (u) => ({ pos: orbit([KX, 0, KZ], 330, 30 + 12 * u, 30, 46, u), target: V([KX + 10, 70, KZ]), fov: 46 }) },
  { id: 's7c', t0: TC[1], t1: TC[2], look: () => ({ ...LOOK.warm, sunAzim: 255, sunElev: 20 }), grade: () => G.storyWarm, shadow: [OX - 40, OZ, 260],
    cam: (u) => ({ pos: V([OX - 175 + 18 * u, 16 + 3 * u, OZ - 55 + 12 * u]), target: V([OX - 40, 24, OZ]), fov: 44 }) },
  { id: 's7d', t0: TC[2], t1: TC[3], look: () => ({ ...LOOK.sunny, sunAzim: 200 }), grade: () => G.story, shadow: [MX, MZ, 260],
    cam: (u) => ({ pos: orbit([MX, 0, MZ], 210, 26 + 6 * u, 100, 115, u), target: V([MX, 38, MZ]), fov: 44 }) },
  { id: 's7e', t0: TC[3], t1: TC[4], look: () => ({ ...LOOK.sunny, sunAzim: 165, sunElev: 34 }), grade: () => G.story, near: 0.2, shadow: [G7[0], G7[2], 120],
    state: { crowd: 'river', guide: { pos: G7, yaw: 0.25, action: 'selfie', talk: false, phase: 0.6 } },
    cam: (u) => ({ pos: V([G7[0] - 0.7 - 0.25 * u, 1.75, G7[2] + 3.4 - 0.25 * u]), target: V([G7[0] - 0.45, 1.95, G7[2] - 4]), fov: 46 }) },
  { id: 's7f', t0: TC[4], t1: 107.6, look: (u) => ({ ...mixObj(LOOK.golden, LOOK.blueHour, smooth(0.55, 1.0, u) * 0.8), sunElev: lerp(7, 2.5, u), sunAzim: 262, cityGlow: 0.8 }),
    grade: (u) => mixObj(G.storyWarm, G.storyNight, smooth(0.5, 1.0, u)), shadow: [400, 0, 2000],
    cam: (u) => ({ pos: orbit([500, 0, 300], 1500, lerp(330, 420, u), 140, 115, u), target: V([300, 60, 500]), fov: 42 }) },

  // ===== S8 — the future: guide on the viewpoint, sunset to sparkling night, flag
  { id: 's8a', t0: 106.5, t1: 120.5, look: (u, t) => ({ ...mixObj(LOOK.golden, LOOK.night, smooth(110, 117.5, t)), sunElev: lerp(7, -7, smooth(107, 117.5, t)), sunAzim: 264, cityGlow: 1 }),
    grade: (u, t) => mixObj(G.storyWarm, G.storyNight, smooth(110, 117, t)), near: 0.15, shadow: [VX + 12, VZ, 70],
    state: (u, t) => ({ guide: { pos: G8, yaw: Math.PI / 2, action: t < 112 ? 'present' : 'idle', talk: true, lookAt: t < 109.5 ? null : [-1500, 70, 1200], phase: 0.4 } }),
    cam: (u) => ({ pos: P([[G8[0] - 2.9, 47.2, G8[2] + 0.35], [G8[0] - 8.5, 49.0, G8[2] + 0.8], [G8[0] - 26, 58, G8[2] + 2.2]], u, easeSine), target: P([[G8[0] + 40, 46.4, G8[2] + 3.5], [-1500, 47, 1210], [-1000, 38, 1205]], u, easeSine), fov: lerp(42, 46, u) }) },
];

function popAt(t) {
  // millions: 2017 -> 1.0, 1 Sep 2026 -> 1.700385 (BNS)
  if (t < cues.pop2017) return 0.85 * smooth(52.0, cues.pop2017 + 3.5, t);
  if (t < cues.popCount) return 1.0;
  return lerp(1.0, 1.700385, easeOut(clamp((t - cues.popCount) / (cues.popFinal - cues.popCount))));
}
export function trainX(t) { const x0 = -3200, x1 = 3400; return x0 + 200 + ((t * 22) % (x1 - x0 - 400)) + 25; }

export const CROWDS = {
  family: { x: -430, z: 1212, w: 240, d: 60, n: 190, dir: [1, 0], speed: 1.1, kids: 0.3, photo: 0.04 },
  river: { x: 150, z: riverZ(150) + 92, w: 260, d: 14, n: 120, dir: [1, 0.12], speed: 1.1, photo: 0.3 },
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
