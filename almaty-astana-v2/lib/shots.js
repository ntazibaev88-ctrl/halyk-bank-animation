/* SHOT — name-based registry over all procedural shots. */
(function () {
  const A = { mountains: 0, koktobe: 1, streets: 2, park: 3, skyline: 4 }, S = { baiterek: 0, shatyr: 1, blueprint: 2, avenue: 3, night: 4 };
  window.SHOT = {
    init() { ShotsAlmaty.init(); ShotsAstana.init(); ShotsExtra.init(); },
    draw(name, ctx, t, d) {
      if (name in A) return ShotsAlmaty.draw(A[name], ctx, t, d);
      if (name in S) return ShotsAstana.draw(S[name], ctx, t, d);
      return ShotsExtra[name](ctx, t, d);
    },
  };
})();
