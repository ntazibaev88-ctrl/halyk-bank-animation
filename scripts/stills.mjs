// Renders preview stills for QC: node scripts/stills.mjs outDir frame1 frame2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';

const [outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium'});
const composition = await selectComposition({serveUrl, id: 'UsaVsChina', puppeteerInstance: browser});
for (const fr of frames) {
  const out = path.join(outDir, `f${fr}.png`);
  await renderStill({serveUrl, composition, frame: Number(fr), output: out, puppeteerInstance: browser, browserExecutable: '/opt/pw-browsers/chromium'});
  console.log(out);
}
await browser.close({silent: true});
