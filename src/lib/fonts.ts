import {continueRender, delayRender, staticFile} from 'remotion';

const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
const LAT =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

const defs: {family: string; weight: string; file: string; range: string}[] = [];
for (const w of ['700', '800', '900']) {
  defs.push({family: 'Montserrat', weight: w, file: `montserrat-cyrillic-${w}-normal.woff2`, range: CYR});
  defs.push({family: 'Montserrat', weight: w, file: `montserrat-latin-${w}-normal.woff2`, range: LAT});
}
defs.push({family: 'Russo One', weight: '400', file: 'russo-one-cyrillic-400-normal.woff2', range: CYR});
defs.push({family: 'Russo One', weight: '400', file: 'russo-one-latin-400-normal.woff2', range: LAT});

let started = false;
export const ensureFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    defs.map((d) =>
      new FontFace(d.family, `url(${staticFile('fonts/' + d.file)}) format('woff2')`, {
        weight: d.weight,
        unicodeRange: d.range,
      })
        .load()
        .then((f) => (document.fonts as unknown as {add: (x: FontFace) => void}).add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
