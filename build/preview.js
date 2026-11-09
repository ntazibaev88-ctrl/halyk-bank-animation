// Render selected timestamps to PNG stills: node build/preview.js out_dir 1.5 7 13 ...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [outDir, ...times] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '../animation/index.html') + '?render');
  await page.evaluate(() => window.ready);
  for (const ts of times) {
    const t = parseFloat(ts);
    const ms = await page.evaluate(t => { const a = performance.now(); window.renderFrame(t); return performance.now() - a; }, t);
    const el = await page.$('#c');
    await el.screenshot({ path: `${outDir}/t${ts.padStart(6, '0')}.jpg`, type: 'jpeg', quality: 85 });
    console.log(t, ms.toFixed(1) + 'ms');
  }
  await browser.close();
})();
