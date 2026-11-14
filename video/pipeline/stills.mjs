// Render QC stills: node pipeline/stills.mjs out/qc 12.5 30 ...  (seconds)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const [outDir, ...times] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const composition = await selectComposition({serveUrl, id: 'KZ35', browserExecutable});
for (const t of times) {
  const frame = Math.round(parseFloat(t) * 30);
  await renderStill({serveUrl, composition, frame, output: `${outDir}/f${String(frame).padStart(5, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 80, browserExecutable, scale: 0.4});
  console.log('ok', t);
}
