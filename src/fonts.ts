import { staticFile, delayRender, continueRender } from "remotion";
const faces: [string, string, string, string][] = [
  ["FactumSans", "montserrat-cyrillic-600-normal.woff2", "600", "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116"],
  ["FactumSans", "montserrat-cyrillic-800-normal.woff2", "800", "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116"],
  ["FactumSans", "montserrat-latin-600-normal.woff2", "600", "U+0000-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026"],
  ["FactumSans", "montserrat-latin-800-normal.woff2", "800", "U+0000-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026"],
  ["FactumSerif", "playfair-display-cyrillic-700-normal.woff2", "700", "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116"],
  ["FactumSerif", "playfair-display-latin-700-normal.woff2", "700", "U+0000-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026"],
];
const h = delayRender("fonts");
Promise.all(
  faces.map(async ([fam, file, weight, range]) => {
    const f = new FontFace(fam, `url(${staticFile("fonts/" + file)})`, { weight, unicodeRange: range });
    await f.load();
    document.fonts.add(f);
  })
).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
