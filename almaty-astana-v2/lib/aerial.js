/* Aerial drone views: perspective city plane flown forward. cfg decides palette and structure. */
(function () {
  const { W, H, clamp, lerp, ease, rng, mix, rgb, glow, gradient } = KIT;
  function plane(ctx, t, cfg) {
    const hy = cfg.hy, f = cfg.f, camH = cfg.camH, yaw = cfg.yaw ? Math.sin(t * .35 + 1) * cfg.yaw : 0, cz = t * cfg.speed + cfg.z0;
    const P = (X, Y, z) => [540 + (X + yaw * z) / z * f, hy + (camH - Y) / z * f];
    const quad = (a) => { ctx.beginPath(); ctx.moveTo(...a[0]); for (let i = 1; i < a.length; i++) ctx.lineTo(...a[i]); ctx.closePath(); };
    ctx.fillStyle = gradient(ctx, 0, hy, 0, H, [[0, rgb(cfg.ground0)], [1, rgb(cfg.ground1)]]); ctx.fillRect(0, hy, W, H - hy);
    const cell = cfg.cell, nx = cfg.nx, nz = cfg.nz; const zStart = Math.floor(cz / cell);
    const r = rng(cfg.seed);
    const hs = (ix, iz) => { const q = rng(cfg.seed * 7919 + ix * 131 + iz * 17)(); return q; };
    for (let iz = zStart + nz; iz >= zStart; iz--) for (let ix = -nx; ix <= nx; ix++) {
      const q = hs(ix, iz), z0 = iz * cell - cz + 2, z1 = z0 + cell * .72; if (z0 < .3 || z0 > nz * cell) continue;
      const x0 = ix * cell * 1.2, x1 = x0 + cell * .9; const kind = cfg.kind(ix, iz, q);
      if (!kind) continue; const h = kind.h, fog = clamp(z0 / (nz * cell));
      const base = mix(kind.c, cfg.fog, fog * .85);
      if (h <= 0) { ctx.fillStyle = rgb(base); quad([P(x0, 0, z0), P(x1, 0, z0), P(x1, 0, z1), P(x0, 0, z1)]); ctx.fill(); continue; }
      // roof + front face + side face
      ctx.fillStyle = rgb(mix(base, [0, 0, 0], .45)); quad([P(x0, 0, z0), P(x1, 0, z0), P(x1, h, z0), P(x0, h, z0)]); ctx.fill();
      if (x0 + (x1 - x0) / 2 > 0) { ctx.fillStyle = rgb(mix(base, [0, 0, 0], .6)); quad([P(x0, 0, z0), P(x0, 0, z1), P(x0, h, z1), P(x0, h, z0)]); ctx.fill(); } else { ctx.fillStyle = rgb(mix(base, [0, 0, 0], .6)); quad([P(x1, 0, z0), P(x1, 0, z1), P(x1, h, z1), P(x1, h, z0)]); ctx.fill(); }
      ctx.fillStyle = rgb(mix(base, [255, 255, 255], .12)); quad([P(x0, h, z0), P(x1, h, z0), P(x1, h, z1), P(x0, h, z1)]); ctx.fill();
      if (kind.lit && fog < .8) { ctx.fillStyle = rgb(kind.lit, .5 * (1 - fog)); const cols = 3; for (let c = 0; c < cols; c++) for (let rr = 1; rr < Math.max(2, h / 22); rr++) if ((c * 5 + rr * 3 + ix + iz) % 3) { const xa = x0 + (x1 - x0) * (c + .2) / cols, xb = x0 + (x1 - x0) * (c + .7) / cols, ya = rr * 22 - 8, yb = ya + 9; quad([P(xa, ya, z0), P(xb, ya, z0), P(xb, yb, z0), P(xa, yb, z0)]); ctx.fill(); } }
    }
  }
  window.AERIAL = { plane };
})();
