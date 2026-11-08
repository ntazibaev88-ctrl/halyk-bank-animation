// Seek-safe animation helpers. Every tween is placed on the paused master
// timeline at an absolute time, with explicit start values (fromTo/set).
import { qa } from './core.js';

export function scene(stage, name) {
  const el = document.createElement('div');
  el.className = `scene ${name}`;
  stage.appendChild(el);
  return el;
}

// visible window with cross-fades
export function show(tl, el, t0, t1, fadeIn = 0.5, fadeOut = 0.5) {
  tl.set(el, { autoAlpha: 0 }, 0);
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: fadeIn, ease: 'none', immediateRender: false }, Math.max(0, t0));
  if (t1 < 999) tl.to(el, { autoAlpha: 0, duration: fadeOut, ease: 'none' }, t1 - fadeOut);
}

// looping sway for grass / flags (yoyo is deterministic under seek)
export function sway(tl, els, t0, t1, amp = 6, period = 2.2, seed = 1) {
  els.forEach((e, i) => {
    const ph = ((i * 0.6180339 + seed) % 1) * period;
    const n = Math.ceil((t1 - t0) / (period / 2)) + 1;
    tl.fromTo(e, { rotation: -amp * (0.6 + ((i * 7) % 5) / 10), transformOrigin: '50% 100%' }, { rotation: amp, duration: period / 2, ease: 'sine.inOut', repeat: n, yoyo: true, transformOrigin: '50% 100%' }, t0 - ph);
  });
}

// buildings rising from the ground, staggered
export function rise(tl, els, t, dur = 0.9, stagger = 0.05, ease = 'power3.out') {
  els.forEach((e, i) => tl.fromTo(e, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: dur, ease, transformOrigin: '50% 100%' }, t + i * stagger));
}

export function pop(tl, els, t, stagger = 0.06, dur = 0.5) {
  els.forEach((e, i) => tl.fromTo(e, { scale: 0, opacity: 0, transformOrigin: '50% 100%' }, { scale: 1, opacity: 1, duration: dur, ease: 'back.out(1.6)', transformOrigin: '50% 100%' }, t + i * stagger));
}

// pedestrians: move across + leg swing
export function walk(tl, root, t0, t1, speed = 60) {
  qa(root, '.person').forEach((p, i) => {
    const dir = +(p.getAttribute('data-dir') || 1);
    tl.fromTo(p, { x: 0 }, { x: dir * speed * (t1 - t0) * (0.8 + (i % 5) * 0.1), duration: t1 - t0, ease: 'none' }, t0);
    const legs = [p.querySelector('.legL'), p.querySelector('.legR')];
    const n = Math.ceil((t1 - t0) / 0.32);
    legs.forEach((l, k) => tl.fromTo(l, { rotation: k ? 18 : -18, svgOrigin: '0 -62' }, { rotation: k ? -18 : 18, duration: 0.32, repeat: n, yoyo: true, ease: 'sine.inOut', svgOrigin: '0 -62' }, t0 - (i % 3) * 0.1));
  });
}

// draw a stroke on
export function draw(tl, el, t, dur = 1.2, ease = 'power2.inOut') {
  const L = el.getTotalLength ? el.getTotalLength() : 2000;
  tl.fromTo(el, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, ease }, t);
}
