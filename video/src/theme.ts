export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  blue: '#00ABC2', // flag sky-blue (official SVG)
  blueDeep: '#03314a',
  navy: '#041b2b',
  gold: '#E9C46A',
  goldBright: '#FFD86B',
  sun: '#FFEC2D', // flag gold (official SVG)
  white: '#FFFFFF',
  ink: '#02121d',
};

export const SERIF = '"Noto Serif Display", serif';
export const SANS = '"Montserrat", sans-serif';

// TikTok / Reels safe zones (px at 1080x1920)
export const SAFE = {top: 210, bottom: 420, left: 72, right: 150};

export const sec = (s: number) => Math.round(s * FPS);
