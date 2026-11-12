import {loadFont} from '@remotion/fonts';
import {staticFile, continueRender, delayRender} from 'remotion';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  green: '#76B900', // accent green (inspired by the GPU-industry palette, not an official asset)
  greenHi: '#9BE22D',
  greenDeep: '#2F4A00',
  ink: '#050706',
  white: '#F4F6F2',
  dim: 'rgba(244,246,242,0.62)',
};

export const F = {
  black: 'InterDisplayBlack',
  xbold: 'InterDisplayExtraBold',
  bold: 'InterDisplayBold',
  semi: 'InterDisplaySemiBold',
  medium: 'InterDisplayMedium',
  light: 'InterDisplayLight',
  hand: 'CaveatDoc',
};

const fonts: Array<[string, string, string?]> = [
  [F.black, 'fonts/InterDisplay-Black.otf'],
  [F.xbold, 'fonts/InterDisplay-ExtraBold.otf'],
  [F.bold, 'fonts/InterDisplay-Bold.otf'],
  [F.semi, 'fonts/InterDisplay-SemiBold.otf'],
  [F.medium, 'fonts/InterDisplay-Medium.otf'],
  [F.light, 'fonts/InterDisplay-Light.otf'],
  [F.hand, 'fonts/Caveat-Cyr-700.woff2', 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'],
  [F.hand, 'fonts/Caveat-Lat-700.woff2', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2212'],
];

let started = false;
export const ensureFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender('fonts');
  Promise.all(
    fonts.map(([family, url, unicodeRange]) =>
      loadFont({family, url: staticFile(url), unicodeRange: unicodeRange as string | undefined})
    )
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};

// deterministic pseudo random
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
