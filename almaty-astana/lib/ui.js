/* UI — reusable GSAP animation helpers for labels / HUD / counters (all seek-safe). */
(function () {
  const UI = {
    // reveal a .lbl card at `at`, hide at `out`
    label(tl, el, at, out) {
      const k = el.querySelector('.lbl-k'), t = el.querySelector('.lbl-t'), s = el.querySelector('.lbl-s'), l = el.querySelector('.lbl-line');
      tl.set(el, { opacity: 1 }, at);
      tl.fromTo(k, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .5, ease: 'power3.out' }, at);
      tl.fromTo(t, { clipPath: 'inset(0 100% 0 0)', y: 30, opacity: 0 }, { clipPath: 'inset(0 0% 0 0)', y: 0, opacity: 1, duration: .7, ease: 'power4.out' }, at + .08);
      tl.fromTo(s, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, at + .3);
      if (l) tl.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: .8, ease: 'power3.out' }, at + .2);
      if (out !== undefined) tl.to(el, { opacity: 0, x: -40, filter: 'blur(8px)', duration: .35, ease: 'power2.in' }, out);
    },
    fade(tl, el, at, out, from = {}) {
      tl.fromTo(el, Object.assign({ opacity: 0, y: 20 }, from), { opacity: 1, y: 0, x: 0, duration: .6, ease: 'power3.out' }, at);
      if (out !== undefined) tl.to(el, { opacity: 0, duration: .3 }, out);
    },
    // animated number counter: sets el.textContent with fmt(value)
    count(tl, el, from, to, at, dur, fmt = v => Math.round(v)) {
      const o = { v: from }; el.textContent = fmt(from);
      tl.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate() { el.textContent = fmt(o.v); } }, at);
    },
    // fade/slide a transition-free scene exit
    exit(tl, el, at, dur = .4) { tl.to(el, { opacity: 0, duration: dur, ease: 'power2.in' }, at); },
  };
  window.UI = UI;
})();
