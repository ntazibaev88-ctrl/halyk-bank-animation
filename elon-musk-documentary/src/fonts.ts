import {continueRender, delayRender, staticFile} from 'remotion';

const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';

const faces: [string, string, number][] = [
  ['Oswald', 'oswald', 300], ['Oswald', 'oswald', 500], ['Oswald', 'oswald', 600], ['Oswald', 'oswald', 700],
  ['Montserrat', 'montserrat', 500], ['Montserrat', 'montserrat', 600], ['Montserrat', 'montserrat', 700],
  ['Montserrat', 'montserrat', 800], ['Montserrat', 'montserrat', 900],
  ['JetBrains Mono', 'jetbrains-mono', 400], ['JetBrains Mono', 'jetbrains-mono', 600],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  const handle = delayRender('fonts');
  const all: Promise<FontFace>[] = [];
  for (const [family, file, weight] of faces) {
    for (const [sub, range] of [['latin', LATIN], ['cyrillic', CYR]] as const) {
      const ff = new FontFace(family, `url(${staticFile(`fonts/${file}-${sub}-${weight}-normal.woff2`)}) format('woff2')`, {
        weight: String(weight),
        unicodeRange: range,
      });
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(ff);
      all.push(ff.load());
    }
  }
  Promise.all(all)
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
