// Overlay entry: build once, then update on every HyperFrames seek.
import { build, update } from './overlay.js';
const D = build();
const fontsReady = Promise.all(['700 100px Montserrat', '600 52px InterK', '500 40px Montserrat', '300 40px Montserrat'].map((f) => document.fonts.load(f))).catch(() => {});
window.__overlayAt = (t) => update(t, D);
window.addEventListener('hf-seek', (e) => {
  const t = e.detail.time;
  update(t, D);
  e.detail.waitUntil(fontsReady.then(() => update(t, D)));
});
update(0, D);
