// Typographic and graphic shots. Each entry: build(host) -> state; draw(state, t, dur, gt).
(function (global) {
  const { clamp, lerp, ease, smooth, hash } = global.SCENES;
  const W = 2160, H = 3840;
  const div = (host, cls, html = '', style = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (style) d.style.cssText = style; host.appendChild(d); return d; };
  const cv = (host) => { const c = document.createElement('canvas'); c.width = W; c.height = H; c.className = 'layer'; host.appendChild(c); return c; };
  const fadeIO = (t, dur, a = 0.6, b = 0.6) => clamp(t / a) * clamp((dur - t) / b);
  // reveal: opacity + blur + rise, k in 0..1
  function reveal(e, k, rise = 40, blur = 18) {
    const kk = smooth(clamp(k));
    e.style.opacity = kk.toFixed(3);
    e.style.transform = `translateY(${((1 - kk) * rise).toFixed(1)}px)`;
    e.style.filter = kk < 0.999 ? `blur(${((1 - kk) * blur).toFixed(1)}px)` : 'none';
  }
  function snow(ctx, gt, n, opts = {}) {
    const { speed = 1, size = 1, alpha = 0.8, drift = 1 } = opts;
    for (let i = 0; i < n; i++) {
      const depth = 0.3 + hash(i + 3) * 0.7;
      const x0 = hash(i) * (W + 400) - 200;
      const vy = (90 + 160 * depth) * speed;
      const y = ((hash(i + 1) * (H + 400) + gt * vy) % (H + 400)) - 200;
      const x = x0 + Math.sin(gt * (0.4 + hash(i + 5)) + i) * 40 * drift * depth + gt * 25 * drift;
      const xx = ((x % (W + 400)) + W + 400) % (W + 400) - 200;
      const r = (2 + depth * 7) * size;
      ctx.globalAlpha = alpha * (0.35 + 0.65 * depth);
      ctx.beginPath(); ctx.arc(xx, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const G = {};

  // ---- 1986: memorial title over falling snow ----
  G.t1986 = {
    build(host) {
      const s = {};
      host.style.background = 'radial-gradient(ellipse at 50% 40%, #16202e 0%, #070a10 60%, #020304 100%)';
      s.c = cv(host);
      s.box = div(host, 'gfx-center', '', 'top:1250px');
      s.l1 = div(s.box, 'gfx-small', 'АЛМАТЫ');
      s.l2 = div(s.box, 'gfx-huge serif', 'ЖЕЛТОҚСАН');
      s.l3 = div(s.box, 'gfx-year serif gold', '1986');
      s.line = div(s.box, 'gfx-rule');
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#e8eef8';
      snow(ctx, gt, 260, { speed: 0.9, alpha: 0.75 });
      reveal(s.l1, (t - 0.3) / 1.0); reveal(s.l2, (t - 0.7) / 1.4, 30, 24); reveal(s.l3, (t - 1.5) / 1.4, 30, 24);
      s.line.style.transform = `scaleX(${smooth(clamp((t - 1.2) / 1.6))})`;
      s.box.style.transform = `scale(${1 + t * 0.006})`;
    }
  };

  // ---- Snow-only memorial insert (no imagery presented as archival) ----
  G.snowfall = {
    build(host) {
      const s = {};
      host.style.background = 'radial-gradient(ellipse at 50% 20%, #2a3446 0%, #0b1019 55%, #030406 100%)';
      s.c = cv(host);
      s.glow = div(host, 'gfx-lamp');
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#f4f7ff';
      snow(ctx, gt, 420, { speed: 0.7, size: 1.3, alpha: 0.85, drift: 0.6 });
      s.glow.style.opacity = 0.75 + 0.1 * Math.sin(gt * 3.1) * Math.sin(gt * 1.7);
    }
  };

  // ---- The Constitutional Law, set as typography ----
  G.law = {
    build(host) {
      const s = {};
      host.style.background = 'radial-gradient(ellipse at 50% 45%, #1d1a14 0%, #0b0a08 70%, #050403 100%)';
      s.c = cv(host);
      s.box = div(host, 'gfx-center', '', 'top:1180px');
      s.a = div(s.box, 'gfx-small', 'КОНСТИТУЦИЯЛЫҚ ЗАҢ');
      s.b = div(s.box, 'gfx-law serif', '«Қазақстан Республикасының<br>мемлекеттік тәуелсіздігі<br>туралы»');
      s.rule = div(s.box, 'gfx-rule');
      s.d = div(s.box, 'gfx-small', 'АЛМАТЫ · 1991');
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H);
      // drifting gold dust
      for (let i = 0; i < 120; i++) {
        const x = hash(i) * W + Math.sin(gt * 0.3 + i) * 30, y = ((hash(i + 9) * H - gt * (20 + hash(i + 2) * 40)) % H + H) % H;
        ctx.fillStyle = `rgba(242,193,78,${0.15 + 0.35 * hash(i + 4)})`; ctx.beginPath(); ctx.arc(x, y, 2 + hash(i + 6) * 4, 0, 7); ctx.fill();
      }
      reveal(s.a, (t - 0.2) / 0.9); reveal(s.b, (t - 0.6) / 1.6, 30, 20); reveal(s.d, (t - 1.6) / 1.0);
      s.rule.style.transform = `scaleX(${smooth(clamp((t - 1.0) / 1.5))})`;
      s.box.style.transform = `scale(${1.04 - t * 0.008})`;
    }
  };

  // ---- 16 ЖЕЛТОҚСАН 1991 ЖЫЛ ----
  G.date = {
    build(host) {
      const s = {};
      host.style.background = 'radial-gradient(ellipse at 50% 45%, #12233f 0%, #070d1a 60%, #020408 100%)';
      s.c = cv(host);
      s.box = div(host, 'gfx-center', '', 'top:1120px');
      s.n = div(s.box, 'gfx-day serif gold sweep', '16');
      s.m = div(s.box, 'gfx-huge serif', 'ЖЕЛТОҚСАН');
      s.y = div(s.box, 'gfx-year2 serif gold', '1991 ЖЫЛ');
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H);
      // light burst rays behind the date
      ctx.save(); ctx.translate(W / 2, 1700); ctx.globalCompositeOperation = 'lighter';
      const k = smooth(clamp((t - 0.5) / 2));
      for (let i = 0; i < 32; i++) {
        const a = i / 32 * Math.PI * 2 + gt * 0.03;
        const g = ctx.createLinearGradient(0, 0, Math.cos(a) * 1800, Math.sin(a) * 1800);
        g.addColorStop(0, `rgba(242,193,78,${0.16 * k})`); g.addColorStop(1, 'rgba(242,193,78,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a - 0.035) * 1900, Math.sin(a - 0.035) * 1900); ctx.lineTo(Math.cos(a + 0.035) * 1900, Math.sin(a + 0.035) * 1900); ctx.fill();
      }
      ctx.restore();
      reveal(s.n, (t - 0.2) / 1.2, 60, 30); reveal(s.m, (t - 0.8) / 1.2, 40, 20); reveal(s.y, (t - 1.4) / 1.2, 40, 20);
      s.n.style.backgroundPosition = `${lerp(-120, 220, clamp((t - 1.2) / 2.2))}% 0`;
      s.box.style.transform = `scale(${1 + t * 0.01})`;
    }
  };

  // ---- Flag raised against the sky (1992, State Flag) ----
  G.flagRise = {
    build(host) {
      const s = {};
      host.style.background = 'linear-gradient(180deg,#2f6fb5 0%,#5c9ad3 38%,#a9cdea 72%,#e8d9b8 100%)';
      s.clouds = div(host, 'gfx-clouds');
      s.c = cv(host);
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H);
      s.clouds.style.transform = `translate(${-gt * 18 % 1200}px,0)`;
      const camY = lerp(0, -260, ease(clamp(t / dur)));
      ctx.save(); ctx.translate(0, -camY * 0.6);
      const rise = ease(clamp(t / (dur * 0.85)));
      const top = 700, poleX = 520;
      global.FLAG.pole(ctx, poleX, top - 40, H + 400, 26, '#3a3d44', 'rgba(255,255,255,0.75)');
      const fy = lerp(2500, top, rise);
      global.FLAG.draw(ctx, poleX + 12, fy, 1500, gt, { wind: 0.9, light: 0.25 });
      ctx.restore();
    }
  };

  // ---- Tenge, the national currency (1993) ----
  G.tenge = {
    build(host) {
      const s = {};
      host.style.background = 'radial-gradient(ellipse at 50% 42%, #2a2211 0%, #0d0b06 62%, #050402 100%)';
      s.c = cv(host);
      s.sym = div(host, 'gfx-tenge serif gold sweep', '₸');
      s.box = div(host, 'gfx-center', '', 'top:2180px');
      s.a = div(s.box, 'gfx-huge serif', 'ТЕҢГЕ');
      s.b = div(s.box, 'gfx-small', 'ҰЛТТЫҚ ВАЛЮТА · 1993');
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2, 1500, 0, W / 2, 1500, 1100);
      g.addColorStop(0, `rgba(255,214,120,${0.35 * smooth(clamp(t / 1.5))})`); g.addColorStop(1, 'rgba(255,214,120,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      reveal(s.sym, t / 1.2, 60, 30);
      s.sym.style.transform += ` scale(${1.0 + t * 0.02}) rotateY(${lerp(-25, 8, ease(clamp(t / dur)))}deg)`;
      s.sym.style.backgroundPosition = `${lerp(-120, 220, clamp((t - 0.6) / 2.2))}% 0`;
      reveal(s.a, (t - 0.8) / 1.0); reveal(s.b, (t - 1.2) / 1.0);
    }
  };

  // ---- Waving flag close-up (today) ----
  G.flagWave = {
    build(host) {
      const s = {};
      host.style.background = 'linear-gradient(180deg,#1f5fa8 0%,#4f8fcf 45%,#9cc7ea 100%)';
      s.clouds = div(host, 'gfx-clouds');
      s.c = cv(host);
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H);
      s.clouds.style.transform = `translate(${-gt * 30 % 1200}px,0)`;
      const z = 1 + 0.05 * t / dur;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      global.FLAG.pole(ctx, 180, 900, H + 200, 34, '#3a3d44', 'rgba(255,255,255,0.75)');
      global.FLAG.draw(ctx, 196, 1000, 2600, gt * 1.1, { wind: 1, light: 0.3 });
      ctx.restore();
    }
  };

  // ---- 2 March 1992: Kazakhstan joins the United Nations ----
  G.un1992 = {
    build(host) {
      const s = {};
      host.style.background = 'radial-gradient(ellipse at 50% 40%, #12304f 0%, #071526 60%, #02060c 100%)';
      s.c = cv(host);
      s.box = div(host, 'gfx-center', '', 'top:1960px');
      s.a = div(s.box, 'gfx-year2 serif gold', '2 НАУРЫЗ 1992');
      s.b = div(s.box, 'gfx-small', 'БІРІККЕН ҰЛТТАР ҰЙЫМЫНА МҮШЕ БОЛДЫ', 'margin-top:40px');
      s.d = div(s.box, 'gfx-un serif', '');
      return s;
    },
    draw(s, t, dur, gt) {
      const ctx = s.c.getContext('2d'); ctx.clearRect(0, 0, W, H);
      // a slowly turning wire globe (meridians + parallels)
      const cx = W / 2, cy = 1200, R = 560, rot = gt * 0.18, k = smooth(clamp(t / 1.2));
      ctx.save(); ctx.globalAlpha = 0.85 * k; ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(160,205,255,0.55)';
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = rot + i * Math.PI / 12, rx = Math.abs(Math.cos(a)) * R;
        ctx.strokeStyle = `rgba(160,205,255,${0.15 + 0.35 * Math.abs(Math.sin(a))})`;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2); ctx.stroke();
      }
      for (let j = -3; j <= 3; j++) {
        const y = cy + j * R / 4, rr = Math.sqrt(R * R - (j * R / 4) ** 2);
        ctx.strokeStyle = 'rgba(160,205,255,0.28)';
        ctx.beginPath(); ctx.ellipse(cx, y, rr, rr * 0.12, 0, 0, Math.PI * 2); ctx.stroke();
      }
      // Kazakhstan's approximate place on the globe, gold point
      const px = cx + Math.sin(rot * 0.0 + 1.25) * R * 0.42, py = cy - R * 0.38;
      const g = ctx.createRadialGradient(px, py, 0, px, py, 90);
      g.addColorStop(0, 'rgba(242,193,78,0.95)'); g.addColorStop(1, 'rgba(242,193,78,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 90 * (0.8 + 0.2 * Math.sin(gt * 3)), 0, 7); ctx.fill();
      ctx.restore();
      reveal(s.a, (t - 0.3) / 1.0, 40, 20); reveal(s.b, (t - 0.8) / 0.9); reveal(s.d, (t - 1.2) / 0.9);
    }
  };

  // ---- End card text (drawn above the dawn scene) ----
  G.endcard = {
    build(host) {
      const s = {};
      s.title = div(host, 'gfx-endtitle serif gold sweep', 'АТАНЫҢ<br>АМАНАТЫ');
      s.rule = div(host, 'gfx-rule end');
      s.date = div(host, 'gfx-enddate', '16 ЖЕЛТОҚСАН — ҚАЗАҚСТАН РЕСПУБЛИКАСЫНЫҢ<br>ТӘУЕЛСІЗДІК КҮНІ');
      s.slogan = div(host, 'gfx-endslogan serif', 'ТӘУЕЛСІЗДІГІМІЗ МӘҢГІ БОЛСЫН!');
      s.ann = div(host, 'gfx-endann', 'Қазақстан Тәуелсіздігінің 35 жылдығына · 1991–2026');
      return s;
    },
    draw(s, t, dur, gt) {
      reveal(s.title, t / 1.6, 50, 26);
      s.title.style.backgroundPosition = `${lerp(-120, 220, clamp((t - 0.8) / 2.5))}% 0`;
      s.rule.style.transform = `scaleX(${smooth(clamp((t - 1.2) / 1.4))})`;
      reveal(s.date, (t - 3.3) / 0.9, 30, 12);
      reveal(s.slogan, (t - 4.1) / 0.9, 30, 14);
      reveal(s.ann, (t - 4.6) / 0.9, 20, 10);
    }
  };

  global.GFX = G;
})(window);
