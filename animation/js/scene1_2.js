// Chapter 1 — Ұлы дала (emotional introduction), 0–14 s
const Scene1 = (() => {
  const stars = makeStars(11, 220, H * 0.55);
  const far = new Ridge({ seed: 3, base: 660, amp: 340, scale: 330, step: 5, kind: 'ridged', pow: 1.5 });
  const far2 = new Ridge({ seed: 21, base: 700, amp: 200, scale: 260, step: 5, kind: 'ridged', pow: 1.3 });
  const mid = new Ridge({ seed: 9, base: 780, amp: 120, scale: 380, step: 8 });
  const hills = new Ridge({ seed: 15, base: 880, amp: 60, scale: 600, step: 10, width: W + 900 });
  const grass = makeGrass(5, 520, -200, W + 200, 900, 1080, 26, 70);
  const near = makeGrass(7, 140, -200, W + 200, 1040, 1160, 120, 230);
  const herd = Array.from({ length: 9 }, (_, i) => ({ dx: i * 95 + hash(i) * 60, dy: hash(i + 9) * 34, s: 0.55 + hash(i + 3) * 0.12, ph: hash(i + 5) }));

  return function (ctx, t) {
    const dawn = smooth(0, 10, t), p = inv(0, 14.5, t);
    ctx.save();
    const z = 1 + 0.07 * ease(p);
    ctx.translate(W / 2, H * 0.6); ctx.scale(z, z); ctx.translate(-W / 2, -H * 0.6 + 26 * ease(p));

    sky(ctx, [[0, mix('#091530', '#1d4a7c', dawn)], [0.45, mix('#1f2a55', '#5f86b0', dawn)],
      [0.62, mix('#4b3c63', '#f2b46e', dawn)], [0.72, mix('#7a5560', '#ffd89a', dawn)], [1, mix('#30283a', '#c88a4e', dawn)]]);
    drawStars(ctx, stars, t, 1 - smooth(1, 7, t));

    const sx = 1210, sy = lerp(780, 470, ease(inv(0.5, 12.5, t)));
    glow(ctx, sx, sy, 900, P.amber, 0.35 * dawn);
    glow(ctx, sx, sy, 260, P.sun, 0.7 * dawn);
    ctx.fillStyle = rgba(P.sun, 0.95 * smooth(1, 4, t)); ctx.beginPath(); ctx.arc(sx, sy, 58, 0, TAU); ctx.fill();
    godRays(ctx, sx, sy, 18, 1400, 0.03, P.goldL, 0.06 * dawn, t * 0.02);

    for (let i = 0; i < 6; i++) {
      const cx = ((i * 420 + t * (12 + i * 3)) % (W + 800)) - 400, cy = 250 + i * 38;
      cloud(ctx, cx, cy, 300 + i * 30, 26, mix('#6a5a7a', '#ffd2a0', dawn), 0.35);
    }

    far.fillGrad(ctx, mix('#8b8db0', '#fbe6d0', dawn), mix('#2c3358', '#8a7a96', dawn), 0.22, -50 * p);
    haze(ctx, 470, 700, mix('#4b3c63', '#f6c48a', dawn), 0.45);
    far2.fillGrad(ctx, mix('#6c6f96', '#e9cdb6', dawn), mix('#262c4b', '#6f6278', dawn), 0.2, -80 * p);
    mid.fill(ctx, rgba(mix('#22263f', '#7b6461', dawn)), -120 * p);
    hills.fill(ctx, rgba(mix('#2b2a2e', '#a77d47', dawn)), -180 * p);

    // herd galloping across the steppe, kicking up golden dust
    const hx = lerp(W + 250, -1100, inv(2.5, 13.5, t));
    for (const hh of herd) {
      const x = hx + hh.dx, y = hills.yAt(x + 180 * p) + 10 + hh.dy;
      glow(ctx, x + 50, y + 4, 90, P.amber, 0.12 * dawn, 'source-over');
      horse(ctx, x, y - 30 * hh.s * 2, hh.s, (t * 1.9 + hh.ph) % 1, mix('#1a1716', '#3a2a1d', dawn * 0.5), P.goldL);
    }
    ctx.fillStyle = rgba(mix('#2a2622', '#c09050', dawn));
    ctx.fillRect(-W, 905, 3 * W, H);
    const g = ctx.createLinearGradient(0, 880, 0, H);
    g.addColorStop(0, rgba(mix('#3a3128', '#d2a25d', dawn), 0.9)); g.addColorStop(1, rgba(mix('#141210', '#5a4024', dawn)));
    ctx.fillStyle = g; ctx.fillRect(-W, 880, 3 * W, 400);
    drawGrass(ctx, grass, t, mix('#1c1a17', '#7a5a30', dawn), mix('#3c3a40', '#fff0c8', dawn), 1, -40 * p);

    // eagle soaring across the dawn sky
    const ep = inv(4, 12.5, t);
    if (ep > 0 && ep < 1) {
      const ex = lerp(-250, W + 250, ep), ey = 330 - Math.sin(ep * Math.PI) * 120;
      eagle(ctx, ex, ey, 0.55 + 0.25 * Math.sin(ep * Math.PI), t, mix('#141824', '#2b2220', dawn), -0.18 + Math.cos(ep * Math.PI) * 0.15, 0.6);
    }
    ctx.restore();

    drawGrass(ctx, near, t, mix('#0c0b0a', '#2a1d10', dawn), mix('#1f1d20', '#e8cf9a', dawn), 1.2, 0, 0.5);
    motes(ctx, 3, 70, t, P.goldL, 0.55 * dawn, [0, 300, W, H], 14, 2.2);

    // Opening title
    const ta = smooth(11.6, 12.8, t) * (1 - smooth(13.6, 14.4, t));
    if (ta > 0) {
      ctx.save(); ctx.globalAlpha = ta; ctx.textAlign = 'center';
      glow(ctx, W / 2, 330, 700, '#1a1426', 0.55, 'source-over');
      ctx.shadowColor = 'rgba(30,15,0,0.7)'; ctx.shadowBlur = 30;
      ctx.letterSpacing = `${lerp(46, 22, easeOut(inv(11.6, 14, t)))}px`;
      ctx.font = '600 156px "Cormorant Garamond"';
      const tg = ctx.createLinearGradient(0, 250, 0, 390); tg.addColorStop(0, '#fff6dc'); tg.addColorStop(1, '#f2c45a');
      ctx.fillStyle = tg; ctx.fillText('ҚАЗАҚСТАН', W / 2 + 11, 370);
      ctx.shadowBlur = 0; ctx.letterSpacing = '0px';
      ornamentLine(ctx, W / 2, 418, 620, inv(11.9, 13.2, t), P.goldL);
      ctx.restore();
    }
  };
})();

// Chapter 2 — Тәуелсіздік (16 December 1991), 14–30 s
const Scene2 = (() => {
  const stars = makeStars(23, 260, H * 0.6);
  const mts = new Ridge({ seed: 41, base: 710, amp: 280, scale: 300, step: 5, kind: 'ridged', pow: 1.5 });
  const hill = new Ridge({ seed: 52, base: 860, amp: 90, scale: 700, step: 8, width: W + 800 });
  const r = mulberry32(1991);
  const crowd = Array.from({ length: 70 }, (_, i) => {
    const x = 120 + (i / 70) * (W - 240) + (r() - 0.5) * 30;
    return { x, h: 120 + r() * 50, delay: r() * 1.6, hat: r() < 0.18 ? 'kalpak' : r() < 0.12 ? 'kimeshek' : (r() < 0.4 ? 'hair' : null), robe: r() < 0.4, dy: r() * 26, lean: (r() - 0.5) * 0.06 };
  });

  return function (ctx, t) {
    const dawn = smooth(19.2, 25.5, t), p = inv(14, 30, t);
    ctx.save();
    const tilt = 60 * ease(inv(24, 30, t));
    ctx.translate(0, tilt);
    sky(ctx, [[0, mix('#050d22', '#1b4b80', dawn)], [0.4, mix('#0c1c3d', '#4e86b8', dawn)],
      [0.62, mix('#1a2b52', '#f0b47a', dawn)], [0.75, mix('#2b3a62', '#ffd9a0', dawn)], [1, mix('#1a2440', '#e7c8a4', dawn)]]);
    drawStars(ctx, stars, t, 1 - dawn);

    const sunY = lerp(940, 520, ease(inv(19.3, 26, t)));
    glow(ctx, W / 2, sunY, 1100, P.amber, 0.4 * dawn);
    glow(ctx, W / 2, sunY, 320, P.sun, 0.85 * dawn);
    godRays(ctx, W / 2, sunY, 32, 1500, 0.022, P.goldL, 0.08 * dawn, t * 0.03);
    flagSun(ctx, W / 2, sunY, 70, mix(P.gold, P.sun, 0.5), smooth(19.5, 22, t), t * 0.05);

    mts.fillGrad(ctx, mix('#9fb0d0', '#fff1e2', dawn), mix('#1b2850', '#9a8ea8', dawn), 0.3, -40 * p);
    haze(ctx, 520, 760, mix('#1a2b52', '#ffcf9a', dawn), 0.4);
    // snowy hill with crowd on the crest
    hill.fillGrad(ctx, mix('#c9d6ea', '#fff3e4', dawn), mix('#5d6f94', '#c9b6b4', dawn), 0.05, -60 * p);
    for (const c of crowd) {
      const x = c.x - 60 * p, y = hill.yAt(x + 60 * p) + 22 + c.dy;
      const raise = easeOut(inv(20.4 + c.delay, 22.2 + c.delay, t));
      const wave = Math.sin(t * 3 + c.x) * 0.12 * raise;
      person(ctx, x, y, c.h * 0.62, { armL: lerp(0.12, 2.75 + wave, raise), armR: lerp(-0.12, -2.75 + wave, raise), hat: c.hat, robe: c.robe, lean: c.lean, hair: c.hat === 'hair' },
        mix('#0b1226', '#3a2a2a', dawn));
    }
    const fg = ctx.createLinearGradient(0, 900, 0, H + 60);
    fg.addColorStop(0, rgba(mix('#2a3a5e', '#d8c4b4', dawn))); fg.addColorStop(1, rgba(mix('#0d1530', '#6e5c5e', dawn)));
    ctx.fillStyle = fg; ctx.fillRect(-W, 955, 3 * W, 300);

    // eagle rising toward the sun
    const ep = inv(23.2, 30, t);
    if (ep > 0) {
      const ex = lerp(380, W / 2 + 60, easeOut(ep)), ey = lerp(820, sunY - 40, easeOut(ep));
      eagle(ctx, ex, ey, lerp(1.25, 0.28, easeOut(ep)), t, '#1b1a22', -0.7 + 0.5 * ep, 0.8);
    }
    ctx.restore();

    snowfall(ctx, 5, 260, t, 0.9 * (1 - 0.7 * dawn));

    // date medallion
    const ma = smooth(14.6, 15.6, t) * (1 - smooth(19.0, 20.0, t));
    if (ma > 0) {
      const cx = W / 2, cy = 420, R = 230, dp = easeOut(inv(14.6, 16.6, t));
      ctx.save(); ctx.globalAlpha = ma;
      glow(ctx, cx, cy, 520, P.gold, 0.25);
      ctx.strokeStyle = rgba(P.goldL, 0.95); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * dp); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R - 18, Math.PI / 2, Math.PI / 2 + TAU * dp); ctx.stroke();
      ctx.lineWidth = 2 / 20;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU + t * 0.08;
        ctx.save(); ctx.globalAlpha = ma * smooth(i / 16, i / 16 + 0.2, dp);
        ctx.translate(cx + Math.cos(a) * (R + 30), cy + Math.sin(a) * (R + 30)); ctx.rotate(a + Math.PI / 2);
        ramHorn(ctx, 20); ctx.restore();
      }
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(255,190,80,0.6)'; ctx.shadowBlur = 24;
      ctx.fillStyle = rgba(P.cream);
      ctx.font = '600 170px "Cormorant Garamond"';
      ctx.globalAlpha = ma * smooth(15.0, 16.0, t);
      ctx.fillText('16', cx, cy + 30);
      ctx.font = '500 34px "Montserrat"'; ctx.letterSpacing = '14px';
      ctx.fillText('ЖЕЛТОҚСАН', cx + 7, cy + 90);
      ctx.font = '600 64px "Cormorant Garamond"'; ctx.letterSpacing = '10px';
      ctx.fillStyle = rgba(P.goldL);
      ctx.globalAlpha = ma * smooth(15.8, 16.8, t);
      ctx.fillText('1991', cx + 5, cy - 110);
      ctx.restore();
    }
    // flash as independence is proclaimed
    const fl = smooth(19.0, 19.6, t) * (1 - smooth(19.6, 21.5, t));
    if (fl > 0) { ctx.fillStyle = `rgba(255,236,190,${0.35 * fl})`; ctx.fillRect(0, 0, W, H); }
    motes(ctx, 8, 50, t, P.goldL, 0.6 * dawn, [0, 200, W, H], 10, 2);
  };
})();
