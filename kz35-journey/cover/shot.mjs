import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto("http://localhost:8765/kz35-journey/cover/cover.html"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({ path: process.argv[2] }); await b.close();
