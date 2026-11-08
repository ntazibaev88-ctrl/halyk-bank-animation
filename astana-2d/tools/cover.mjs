// TikTok cover: the title frame with subtitles hidden and a kicker added.
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(0);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(`http://localhost:${srv.address().port}/index.html`);
await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => {
  window.__seek(11.4);
  document.querySelector('.subs').style.display = 'none';
  document.getElementById('grain').style.display = 'none';
  const k = document.querySelector('.kicker');
  k.style.visibility = 'visible'; k.style.opacity = 1; k.style.top = '250px';
  const tag = document.createElement('div');
  tag.style.cssText = 'position:absolute;left:0;right:0;top:1500px;text-align:center;font:700 40px Montserrat;letter-spacing:.18em;color:#fff;text-shadow:0 3px 18px rgba(0,0,0,.7)';
  tag.innerHTML = '1830 → 2026<br><span style="color:#f2c14e;font-size:34px;letter-spacing:.12em">ТАРИХ · ХАЛЫҚ · ЭКОНОМИКА · ТУРИЗМ</span>';
  document.getElementById('ui').appendChild(tag);
});
await p.waitForTimeout(300);
await p.screenshot({ path: path.join(root, 'cover.png') });
await b.close(); srv.close();
