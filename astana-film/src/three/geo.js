// Stylised geography of Astana (1 unit = 1 metre, +x east, +z south).
// The Ishim (Есіл) flows west -> east. Right bank (north, z<river) is the historic
// city (Akmola fortress, Tselinograd). Left bank (south) is the post-1997 capital
// with the Nurzhol axis: Khan Shatyr - Baiterek - Ak Orda.
import * as THREE from 'three';

export const RIVER_PTS = [
  [-11000, 700], [-8000, 600], [-6000, 500], [-4000, 250], [-2600, -60], [-1500, -330], [-500, -430],
  [400, -310], [1100, 40], [1500, 440], [1760, 900], [1960, 1350], [2300, 1760], [2900, 2060],
  [4000, 2260], [6000, 2400], [8500, 2500], [11000, 2650],
];
export const RIVER_WIDTH = 140;

const riverCurve = new THREE.CatmullRomCurve3(RIVER_PTS.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
export const RIVER_SAMPLES = riverCurve.getSpacedPoints(1400).map((p) => [p.x, p.z]);

export function riverDist(x, z) {
  let best = 1e9;
  for (let i = 0; i < RIVER_SAMPLES.length - 1; i++) {
    const [ax, az] = RIVER_SAMPLES[i], [bx, bz] = RIVER_SAMPLES[i + 1];
    const dx = bx - ax, dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    const px = ax + dx * t - x, pz = az + dz * t - z;
    const d = px * px + pz * pz;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

// z of the river centre at a given x (rivers here are functions of x)
export function riverZ(x) {
  for (let i = 0; i < RIVER_SAMPLES.length - 1; i++) {
    const [ax, az] = RIVER_SAMPLES[i], [bx, bz] = RIVER_SAMPLES[i + 1];
    if ((x >= ax && x <= bx) || (x <= ax && x >= bx)) return az + (bz - az) * ((x - ax) / (bx - ax || 1));
  }
  return 0;
}
export const isLeftBank = (x, z) => z > riverZ(x);

export const AXIS_Z = 1200;
export const LM = {
  baiterek: [0, AXIS_Z],
  khanShatyr: [-1800, AXIS_Z],
  akOrda: [1640, AXIS_Z],
  goldTowers: [1080, AXIS_Z],
  nurAlem: [-900, 2750],
  museum: [2480, 1250],
  pyramid: [2520, 620],
  mosque: [2850, 180],
  abuDhabi: [720, -820],
  emerald: [260, -760],
  triumph: [-1150, 250],
  fortress: [-640, -760],
  flag: [2280, 1080],
};

// Places where generic buildings must not be placed (x, z, radius)
export const EXCLUDE = [
  [...LM.baiterek, 160], [...LM.khanShatyr, 260], [...LM.akOrda, 220], [...LM.goldTowers, 150],
  [...LM.nurAlem, 300], [...LM.museum, 200], [...LM.pyramid, 170], [...LM.mosque, 160],
  [...LM.abuDhabi, 130], [...LM.emerald, 130], [...LM.triumph, 110], [...LM.flag, 120],
];

export function excluded(x, z, pad = 0) {
  for (const [ex, ez, r] of EXCLUDE) if ((x - ex) ** 2 + (z - ez) ** 2 < (r + pad) ** 2) return true;
  // Nurzhol boulevard corridor (linear park)
  if (Math.abs(z - AXIS_Z) < 95 + pad && x > -1750 && x < 1600) return true;
  // light-rail corridor
  if (Math.abs(z - 2060) < 80 + pad && x > -3300 && x < 3500) return true;
  return false;
}

export const CITY = { x0: -5000, x1: 5600, z0: -5000, z1: 5000 };
