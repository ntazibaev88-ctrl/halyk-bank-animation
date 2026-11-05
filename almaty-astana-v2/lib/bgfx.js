/* BGFX — living background for infographic scenes: bokeh lights + mountain (Almaty) / skyline (Astana) silhouettes. */
(function () {
  let L = null;
  function build() {
    const { ridge, skyline } = KIT;
    L = { mtn: ridge({ w: 1300, h: 560, base: 520, amp: 330, freq: .0046, seed: 515, rock: ['#14505a', '#4fc2ac'], snowAlt: 250, snow: ['#7fd8c8', '#d8fff4'], hazeAmt: .45, haze: [8, 40, 50] }),
      sky: skyline({ w: 1300, h: 560, seed: 616, baseY: 520, minW: 36, maxW: 84, minH: 70, maxH: 330, body: ['#46386a', '#1c1436'], win: ['#ffc870', '#ff9a50'], winDensity: .42, edge: 'rgba(255,190,110,.55)' }) };
  }
  function attach(tl, cv, dur) {
    const { W, H, rng, glow, ease } = KIT; if (!L) build();
    KIT.bind(tl, cv, dur, (ctx, t) => {
      ctx.clearRect(0, 0, W, H);
      const r = rng(21);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 26; i++) { const left = i % 2 === 0, x = (left ? 40 + r() * 460 : 580 + r() * 460) + Math.sin(t * .4 + i) * 30, y = H - ((r() * H + t * (18 + r() * 26)) % (H + 200)) + 100, s = 40 + r() * 90;
        glow(ctx, x, y, s, left ? [55, 224, 176] : [255, 180, 60], .07 + .05 * Math.sin(t + i)); }
      ctx.restore();
      // bottom silhouettes: mountains left half, skyline right half
      const yb = 1340, dx = Math.sin(t * .25) * 24;
      ctx.save(); ctx.beginPath(); ctx.rect(0, yb, 540, H - yb); ctx.clip(); ctx.drawImage(L.mtn, -380 + dx, yb - 60); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(540, yb, 540, H - yb); ctx.clip(); ctx.drawImage(L.sky, 140 - dx, yb - 60); ctx.restore();
      const g = ctx.createLinearGradient(0, yb, 0, H); g.addColorStop(0, 'rgba(5,11,22,0)'); g.addColorStop(.5, 'rgba(5,11,22,.38)'); g.addColorStop(1, 'rgba(5,11,22,.9)'); ctx.fillStyle = g; ctx.fillRect(0, yb, W, H - yb);
      const sg = ctx.createLinearGradient(0, 0, W, 0); sg.addColorStop(0, 'rgba(55,224,176,.9)'); sg.addColorStop(1, 'rgba(255,180,60,.9)'); ctx.fillStyle = sg; ctx.fillRect(0, yb + 58, W, 2);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const q = rng(33); for (let i = 0; i < 40; i++) { const x = 560 + q() * 500, y = yb + 90 + q() * 150, a = .5 + .5 * Math.sin(t * 2.4 + i * 1.7); glow(ctx, x, y, 10, [255, 210, 130], .3 * a); } ctx.restore();
    });
  }
  window.BGFX = { attach };
})();
