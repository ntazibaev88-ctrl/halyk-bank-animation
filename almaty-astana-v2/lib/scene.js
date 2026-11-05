/* SCENE — shared builder for multi-shot canvas scenes (Almaty / Astana). */
(function () {
  window.SCENE = {
    // shots: [{n, a, b, label?:{el, k?}}]; draws with crossfade/whip between shots, labels appear on each shot start.
    shotScene({ tl, cv, dur, shots, tint, xfade = .4, labelOut = .2 }) {
      const { W, H, shotMix, bind, grade } = KIT;
      const wins = shots.map(s => ({ a: s.a, b: s.b }));
      bind(tl, cv, dur, (ctx, t) => { ctx.clearRect(0, 0, W, H); shotMix(ctx, t, wins, (i, c, lt, d) => SHOT.draw(shots[i].n, c, lt, d), xfade); grade(ctx, t, { vignette: .6, tint }); });
      shots.forEach(s => { if (s.el) UI.label(tl, s.el, s.la !== undefined ? s.la : s.a + .35, Math.max(s.a + .8, s.b - labelOut)); });
    },
    hud(tl, prefix, city, T) {
      const $ = id => document.getElementById(id);
      UI.fade(tl, $(prefix + '-h1'), .2); UI.fade(tl, $(prefix + '-h2'), .35);
      const pulse = HUD.miniMap($(prefix + '-map'), city);
      tl.fromTo($(prefix + '-map'), { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.6)' }, .5);
      tl.fromTo(pulse, { attr: { r: 26 }, opacity: 1 }, { attr: { r: 90 }, opacity: 0, duration: 1.1, repeat: Math.ceil(T.dur / 1.1), ease: 'power1.out' }, .6);
    },
  };
})();
