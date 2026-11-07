// Preview: node tools/shot.js out_dir t1 t2 ...  (writes half-size PNGs)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 0.5 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../src/index.html'));
  await p.evaluate(() => window.READY).catch(()=>{});
  if (errs.length) { console.log('LOAD ERRORS:\n' + errs.join('\n')); }
  for (const t of ts) {
    await p.evaluate(t => window.seek(t), parseFloat(t));
    await p.screenshot({ path: `${out}/f_${String(t).padStart(6, '0')}.png` });
  }
  if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
  await b.close();
})();
