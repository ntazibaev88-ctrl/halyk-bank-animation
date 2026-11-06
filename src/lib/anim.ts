import {Easing, interpolate, spring} from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Clamped interpolate with optional easing. */
export const io = (
  f: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) =>
  interpolate(f, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);
export const backOut = Easing.out(Easing.back(1.7));

/** Spring that starts at `delay` frames. */
export const pop = (f: number, delay = 0, damping = 12, stiffness = 120, mass = 0.8) =>
  spring({frame: f - delay, fps: 30, config: {damping, stiffness, mass}});

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Wrap value into [0, m). */
export const wrap = (v: number, m: number) => ((v % m) + m) % m;

/** Five-pointed star polygon points. rot in degrees, 0 = pointing up. */
export const starPoints = (cx: number, cy: number, R: number, rot = 0, inner = 0.382) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? R : R * inner;
    const a = ((-90 + rot + i * 36) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
};

export const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '');
