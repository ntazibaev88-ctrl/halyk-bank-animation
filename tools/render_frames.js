// Render frames [from, to) with headless Chromium and encode them to an H.264 chunk.
// usage: node render_frames.js <from> <to> <out.mp4>
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [from, to, out] = [parseInt(process.argv[2]), parseInt(process.argv[3]), process.argv[4]];
  const root = path.resolve(__dirname, '..');
  const tl = JSON.parse(fs.readFileSync(path.join(root, 'build/timeline.json'), 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(root, 'web/index.html'));
  await page.evaluate((t) => window.setup(t), tl);
  await page.evaluate(() => document.fonts.ready);
  const cdp = await page.context().newCDPSession(page);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(tl.fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(tl.fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let fr = from; fr < to; fr++) {
    await page.evaluate((t) => window.draw(t), fr / tl.fps);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 94 });
    if (!ff.stdin.write(Buffer.from(data, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
    if ((fr - from) % 150 === 0) console.log(`[${path.basename(out)}] frame ${fr}/${to}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
})();
