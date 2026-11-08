// Entry: builds every scene component on one paused, seekable GSAP timeline.
import cues from './data/cues.json';
import subs from './data/subtitles.json';
import { s1 } from './scenes/s1-hook.js';
import { s2 } from './scenes/s2-history.js';
import { s3 } from './scenes/s3-transform.js';
import { s4 } from './scenes/s4-people.js';
import { s5 } from './scenes/s5-economy.js';
import { s6 } from './scenes/s6-budget.js';
import { s7 } from './scenes/s7-tourism.js';
import { s8 } from './scenes/s8-finale.js';
import { buildUI, updateUI } from './ui/ui.js';
import { rng } from './lib/core.js';

const gsap = window.gsap;
const stage = document.getElementById('stage');
const ui = document.getElementById('ui');
const tl = gsap.timeline({ paused: true });
for (const s of [s1, s2, s3, s4, s5, s6, s7, s8]) s(stage, tl, cues);
const U = buildUI(ui, tl, cues, subs);

// film grain: seeded noise tile, jumped every frame-ish with stepped keyframes
const cv = document.createElement('canvas'); cv.width = cv.height = 256;
const cx = cv.getContext('2d'); const img = cx.createImageData(256, 256); const r = rng(42);
for (let i = 0; i < img.data.length; i += 4) { const v = (r() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
cx.putImageData(img, 0, 0);
const grain = document.getElementById('grain');
grain.style.backgroundImage = `url(${cv.toDataURL()})`;
const gr = rng(7);
tl.to(grain, { keyframes: [...Array(240)].map(() => ({ x: ((gr() * 256) | 0) - 128, y: ((gr() * 256) | 0) - 128, duration: 0.5, ease: 'steps(1)' })) }, 0);

tl.to({}, { duration: 120 }, 0);
window.__timelines = window.__timelines || {};
window.__timelines.main = tl;
window.addEventListener('hf-seek', (e) => updateUI(U, e.detail.time, cues));
window.__seek = (t) => { tl.seek(t, false); updateUI(U, t, cues); };
updateUI(U, 0, cues);
