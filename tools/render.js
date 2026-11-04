// Usage: node tools/render.js <outDir> [startFrame endFrame] [--workers N] | node tools/render.js --still <t> <out.jpg>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const INDEX = 'file://' + path.resolve(__dirname, '../src/index.html');

async function renderRange(outDir, frames) {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--font-render-hinting=none'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(INDEX + '?t=0'); await page.evaluate(() => document.fonts.ready);
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  for (const f of frames) {
    const b64 = await page.evaluate(i => { window.renderFrame(i); return document.getElementById('cv').toDataURL('image/jpeg', 0.94).split(',')[1]; }, f);
    fs.writeFileSync(path.join(outDir, `f${String(f).padStart(5, '0')}.jpg`), Buffer.from(b64, 'base64'));
  }
  await browser.close();
}
if (isMainThread) {
  (async () => {
    const a = process.argv.slice(2);
    if (a[0] === '--still') { const t = parseFloat(a[1]); await renderRange(path.dirname(a[2]), [Math.round(t * 30)]); fs.renameSync(path.join(path.dirname(a[2]), `f${String(Math.round(t * 30)).padStart(5, '0')}.jpg`), a[2]); return; }
    const outDir = a[0]; fs.mkdirSync(outDir, { recursive: true });
    const s = a[1] ? +a[1] : 0, e = a[2] ? +a[2] : 1800, nw = a.includes('--workers') ? +a[a.indexOf('--workers') + 1] : 4;
    const ws = []; for (let w = 0; w < nw; w++) { const fr = []; for (let f = s + w; f < e; f += nw) fr.push(f); ws.push(new Promise((res, rej) => { const x = new Worker(__filename, { workerData: { outDir, fr } }); x.on('exit', res); x.on('error', rej); })); }
    await Promise.all(ws); console.log('done', s, e);
  })();
} else renderRange(workerData.outDir, workerData.fr);
