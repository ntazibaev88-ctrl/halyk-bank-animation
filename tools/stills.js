// Save PNG stills at given times: node stills.js outdir t1 t2 ...
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const root = path.resolve(__dirname, '..');
  const tl = JSON.parse(fs.readFileSync(path.join(root, 'build/timeline.json'), 'utf8'));
  const [dir, ...times] = process.argv.slice(2);
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => console.error('PAGE ERROR', e.message));
  page.on('console', (m) => console.log('console:', m.text()));
  await page.goto('file://' + path.join(root, 'web/index.html'));
  await page.evaluate((t) => window.setup(t), tl);
  for (const t of times) {
    await page.evaluate((t) => window.draw(t), parseFloat(t));
    await page.screenshot({ path: path.join(dir, `t${String(t).padStart(6, '0')}.png`) });
  }
  await browser.close();
})();
