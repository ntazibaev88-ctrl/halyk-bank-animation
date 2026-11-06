/* THE LAST DAY — the apartment. One studio flat, the same pieces in every shot:
 * a tall window with half-open blinds (city glow behind), a grey steel entry door with a
 * sliding bolt, a chain and a peephole, a dark couch, a flat TV on a low cabinet,
 * and a kitchen island with a knife block. */
(function () {
  const F = window.FILM, { W, H, rng, lerp } = F;
  const A = (F.apt = {});

  // night city seen through glass (used small in the window and full-frame in scene 3)
  A.cityGlow = function (ctx, t, x, y, w, h) {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "#0b121c"); g.addColorStop(0.6, "#1d2a3a"); g.addColorStop(1, "#3a2c26");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const r = rng(404);
    for (let i = 0; i < 9; i++) {
      const bw = w * (0.08 + r() * 0.16), bh = h * (0.25 + r() * 0.5), bx = x + r() * w;
      ctx.fillStyle = "#0a0f15"; ctx.fillRect(bx, y + h - bh, bw, bh);
      for (let k = 0; k < 10; k++) if (r() < 0.4) { ctx.fillStyle = r() < 0.6 ? "rgba(200,160,110,0.45)" : "rgba(130,160,200,0.35)"; ctx.fillRect(bx + r() * bw, y + h - bh + r() * bh, 2, 2); }
    }
    F.glow(ctx, x + w * 0.7, y + h * 0.9, w * 0.6, "rgba(255,110,50,0.25)", 0.7 + 0.3 * F.wobble(t * 3, 2));
  };

  // window with blinds. open 0..1 = slat gap. Returns nothing; draws frame, glass, slats.
  A.window = function (ctx, t, x, y, w, h, o = {}) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    A.cityGlow(ctx, t, x, y, w, h);
    // rain on glass
    ctx.save(); ctx.globalAlpha = 0.5; F.rain(ctx, t, { count: 60, seed: 31, speed: 600, slant: 0, len: 14, color: "rgba(180,200,220,0.25)" }); ctx.restore();
    // blinds
    const n = Math.round(h / (o.slat || 34)), sh = h / n, open = o.open ?? 0.45;
    ctx.fillStyle = o.slatColor || "#0c1016";
    for (let i = 0; i < n; i++) {
      const sy = y + i * sh;
      ctx.fillRect(x, sy, w, sh * (1 - open));
      ctx.fillStyle = "rgba(120,140,165,0.12)"; ctx.fillRect(x, sy + sh * (1 - open) - 2, w, 2);
      ctx.fillStyle = o.slatColor || "#0c1016";
    }
    ctx.restore();
    // frame and mullion
    ctx.strokeStyle = "#07090c"; ctx.lineWidth = o.frame || 18;
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.stroke();
    F.glow(ctx, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, "rgba(110,140,180,0.18)", 1);
  };

  // light from the blinds thrown across a surface as slanted stripes
  A.slats = function (ctx, x, y, w, h, n, skew, alpha, rgb = "140,165,200") {
    ctx.save(); ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(6px)";
    const sh = h / n;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = `rgba(${rgb},${alpha * (0.6 + 0.4 * ((i * 7) % 5) / 5)})`;
      ctx.beginPath();
      ctx.moveTo(x, y + i * sh); ctx.lineTo(x + w, y + i * sh + skew);
      ctx.lineTo(x + w, y + i * sh + skew + sh * 0.45); ctx.lineTo(x, y + i * sh + sh * 0.45); ctx.fill();
    }
    ctx.restore();
  };

  // steel entry door. bolt 0 (open) .. 1 (shot home). jolt = px shove. under = corridor light 0..1
  A.door = function (ctx, t, x, y, w, h, o = {}) {
    ctx.save();
    ctx.translate(x + (o.jolt || 0) * 0.3, y + (o.jolt || 0) * 0.1);
    // frame
    ctx.fillStyle = "#05070a"; ctx.fillRect(-w * 0.07, -h * 0.04, w * 1.14, h * 1.04);
    // leaf
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, o.lit ? "#3a424c" : "#1b2027"); g.addColorStop(0.5, o.lit ? "#2c333b" : "#14181e"); g.addColorStop(1, "#0c0f13");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // embossed panels
    ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = Math.max(1, w * 0.012);
    ctx.strokeRect(w * 0.12, h * 0.06, w * 0.76, h * 0.38); ctx.strokeRect(w * 0.12, h * 0.52, w * 0.76, h * 0.42);
    ctx.strokeStyle = "rgba(150,170,195,0.12)";
    ctx.strokeRect(w * 0.12 + 2, h * 0.06 + 2, w * 0.76, h * 0.38); ctx.strokeRect(w * 0.12 + 2, h * 0.52 + 2, w * 0.76, h * 0.42);
    // peephole
    ctx.fillStyle = "#0b0d10"; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.3, w * 0.03, 0, 6.283); ctx.fill();
    if (o.peep) F.glow(ctx, w * 0.5, h * 0.3, w * 0.06, `rgba(230,200,150,${o.peep})`, 1);
    // lever handle
    ctx.fillStyle = "#596370"; ctx.fillRect(w * 0.84, h * 0.5, w * 0.03, h * 0.07);
    ctx.fillRect(w * 0.72, h * 0.515, w * 0.15, h * 0.018);
    // sliding bolt (zasov) above the handle
    const bx = w * 0.62, by = h * 0.42, bw = w * 0.22, bh = h * 0.022;
    ctx.fillStyle = "#2a3038"; ctx.fillRect(bx, by - bh, bw, bh * 3);
    const shot = o.bolt || 0;
    ctx.fillStyle = "#8b96a3"; ctx.fillRect(bx + bw * 0.1 + shot * bw * 0.55, by, bw * 0.7, bh);
    ctx.fillStyle = "#0e1114"; ctx.fillRect(w * 1.0, by - bh, w * 0.05, bh * 3); // keeper on frame
    // chain
    ctx.strokeStyle = "#7d8792"; ctx.lineWidth = Math.max(1, w * 0.008);
    const swing = Math.sin(t * 9) * (o.chainSwing || 0);
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const u = i / 8;
      const cx = lerp(w * 0.66, w * 1.02, u), cy = h * 0.2 + Math.sin(u * Math.PI) * h * 0.05 * (1 + swing);
      i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
    }
    ctx.stroke();
    ctx.restore();
    // corridor light under the door, with shadows of feet passing through it
    if (o.under) {
      const uy = y + h + 2;
      ctx.save(); ctx.globalCompositeOperation = "screen";
      const lg = ctx.createLinearGradient(0, uy, 0, uy + h * 0.25);
      lg.addColorStop(0, `rgba(230,200,150,${0.55 * o.under})`); lg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.moveTo(x, uy); ctx.lineTo(x + w, uy); ctx.lineTo(x + w * 1.35, uy + h * 0.25); ctx.lineTo(x - w * 0.35, uy + h * 0.25); ctx.fill();
      ctx.fillStyle = `rgba(255,225,180,${0.9 * o.under})`; ctx.fillRect(x, uy - 3, w, 4);
      ctx.restore();
      (o.feet || []).forEach((fx) => {
        ctx.fillStyle = "rgba(0,0,0,0.92)";
        ctx.fillRect(x + fx * w - w * 0.08, uy - 4, w * 0.08, 6);
        ctx.beginPath(); ctx.moveTo(x + fx * w - w * 0.08, uy); ctx.lineTo(x + fx * w, uy); ctx.lineTo(x + fx * w + w * 0.2, uy + h * 0.25); ctx.lineTo(x + fx * w - w * 0.35, uy + h * 0.25); ctx.fill();
      });
    }
  };

  A.couch = function (ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.fillStyle = o.color || "#0d1015";
    ctx.beginPath(); ctx.roundRect(x, y + h * 0.15, w, h * 0.85, h * 0.12); ctx.fill(); // base
    ctx.fillStyle = "#11151b"; ctx.beginPath(); ctx.roundRect(x + w * 0.03, y, w * 0.94, h * 0.5, h * 0.12); ctx.fill(); // back
    ctx.fillStyle = "#0a0d11";
    ctx.beginPath(); ctx.roundRect(x - w * 0.02, y + h * 0.2, w * 0.1, h * 0.7, h * 0.08); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + w * 0.92, y + h * 0.2, w * 0.1, h * 0.7, h * 0.08); ctx.fill();
    ctx.strokeStyle = "rgba(120,140,170,0.15)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + w * 0.5, y + h * 0.5); ctx.lineTo(x + w * 0.5, y + h * 0.75); ctx.stroke();
    ctx.restore();
  };

  // flat TV on a low cabinet; draws screen content via o.content(ctx, x, y, w, h)
  A.tv = function (ctx, t, x, y, w, o = {}) {
    const h = w * 9 / 16;
    ctx.fillStyle = "#050608"; ctx.fillRect(x - w * 0.02, y - w * 0.02, w * 1.04, h + w * 0.04);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (o.content) o.content(ctx, x, y, w, h);
    ctx.restore();
    // cabinet
    ctx.fillStyle = "#0b0e12"; ctx.fillRect(x - w * 0.25, y + h + w * 0.12, w * 1.5, w * 0.28);
    ctx.fillStyle = "#07090b"; ctx.fillRect(x + w * 0.45, y + h, w * 0.1, w * 0.12);
    return h;
  };

  A.island = function (ctx, t, x, y, w, h, o = {}) {
    ctx.save();
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "#151a20"); g.addColorStop(1, "#06080a");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#222932"; ctx.fillRect(x - w * 0.02, y - h * 0.06, w * 1.04, h * 0.07); // worktop
    ctx.fillStyle = "rgba(150,175,205,0.25)"; ctx.fillRect(x - w * 0.02, y - h * 0.06, w * 1.04, 2);
    ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + (w * i) / 3, y + h * 0.05); ctx.lineTo(x + (w * i) / 3, y + h); ctx.stroke(); }
    if (o.knives !== false) A.knifeBlock(ctx, x + w * 0.72, y - h * 0.06, h * 0.32, o.knives);
    ctx.restore();
  };

  // knife block sitting on a surface at (x, y). size = block height. o.missing: the big knife is gone
  A.knifeBlock = function (ctx, x, y, size, o = {}) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#1a140f";
    ctx.beginPath(); ctx.moveTo(-size * 0.35, 0); ctx.lineTo(size * 0.35, 0); ctx.lineTo(size * 0.5, -size); ctx.lineTo(-size * 0.05, -size * 1.08); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 4; i++) {
      if (o && o.missing && i === 1) continue;
      const hx = -size * 0.02 + i * size * 0.12;
      ctx.fillStyle = "#0b0b0c";
      ctx.save(); ctx.translate(hx, -size * 1.02); ctx.rotate(0.3);
      ctx.beginPath(); ctx.roundRect(-size * 0.04, -size * 0.45, size * 0.08, size * 0.45, size * 0.03); ctx.fill();
      ctx.fillStyle = "rgba(150,170,195,0.3)"; ctx.fillRect(-size * 0.04, -size * 0.45, 2, size * 0.45);
      ctx.restore();
    }
    ctx.restore();
  };

  // the emergency broadcast, sized to any rect. detail 0 (tiny, no text) .. 1 (full frame)
  A.broadcast = function (ctx, t, x, y, w, h, o = {}) {
    const detail = o.detail ?? 1;
    ctx.save(); ctx.translate(x, y);
    // background: dark blue studio graphics
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#06121f"); bg.addColorStop(1, "#0c1a2c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // the city map: river + street grid, infection spreading in red
    const mx = w * 0.08, my = h * (o.mapTop ?? 0.22), mw = w * 0.84, mh = h * (o.mapH ?? 0.5);
    ctx.save(); ctx.beginPath(); ctx.rect(mx, my, mw, mh); ctx.clip();
    ctx.fillStyle = "#0a1626"; ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = "rgba(90,130,170,0.35)"; ctx.lineWidth = Math.max(1, w * 0.002);
    const r = rng(77);
    for (let i = 0; i < 26; i++) { const yy = my + r() * mh; ctx.beginPath(); ctx.moveTo(mx, yy); ctx.lineTo(mx + mw, yy + (r() - 0.5) * mh * 0.3); ctx.stroke(); }
    for (let i = 0; i < 20; i++) { const xx = mx + r() * mw; ctx.beginPath(); ctx.moveTo(xx, my); ctx.lineTo(xx + (r() - 0.5) * mw * 0.3, my + mh); ctx.stroke(); }
    ctx.strokeStyle = "rgba(40,90,140,0.9)"; ctx.lineWidth = Math.max(2, w * 0.02);
    ctx.beginPath(); ctx.moveTo(mx, my + mh * 0.3); ctx.bezierCurveTo(mx + mw * 0.3, my + mh * 0.6, mx + mw * 0.6, my + mh * 0.1, mx + mw, my + mh * 0.55); ctx.stroke();
    const spread = F.clamp((t + (o.t0 || 0)) / 6, 0, 1);
    const hs = rng(91);
    for (let i = 0; i < 9; i++) {
      const hx = mx + hs() * mw, hy = my + hs() * mh, grow = F.clamp(spread * 1.6 - i * 0.08, 0, 1);
      const pulse = 0.75 + 0.25 * Math.sin(t * 6 + i);
      F.glow(ctx, hx, hy, mw * (0.06 + 0.22 * grow), `rgba(230,30,30,${0.55 * pulse})`, 1, "source-over");
      if (detail > 0.5) { ctx.fillStyle = "rgba(255,90,80,0.95)"; ctx.beginPath(); ctx.arc(hx, hy, w * 0.006, 0, 6.283); ctx.fill(); }
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(220,40,40,0.8)"; ctx.lineWidth = Math.max(1, w * 0.003); ctx.strokeRect(mx, my, mw, mh);
    // top banner, blinking
    const blink = Math.floor(t * 2.5) % 2 === 0 ? 1 : 0.75;
    ctx.fillStyle = `rgba(200,16,22,${blink})`; ctx.fillRect(0, h * 0.06, w, h * 0.1);
    if (detail > 0.5) {
      ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `700 ${h * 0.055}px Oswald, "Arial Narrow", sans-serif`;
      ctx.fillText("ЭКСТРЕННОЕ СООБЩЕНИЕ", w / 2, h * 0.112);
      ctx.font = `500 ${h * 0.03}px Oswald, sans-serif`; ctx.fillStyle = "#ffd6d6";
      ctx.fillText("ВСПЫШКА НЕИЗВЕСТНОГО ВИРУСА", w / 2, my - h * 0.025);
      // live bug
      ctx.textAlign = "left"; ctx.font = `700 ${h * 0.026}px Oswald, sans-serif`; ctx.fillStyle = "#fff";
      ctx.fillText("ПРЯМОЙ ЭФИР", w * 0.1, h * 0.03);
      ctx.fillStyle = "#e01818"; ctx.beginPath(); ctx.arc(w * 0.075, h * 0.03, h * 0.009, 0, 6.283); ctx.fill();
      ctx.textAlign = "right"; ctx.fillStyle = "#cfd8e3"; ctx.fillText("05:47", w * 0.92, h * 0.03);
      // ticker
      const ty = my + mh + h * 0.06;
      ctx.fillStyle = "#f2f2f2"; ctx.fillRect(0, ty - h * 0.03, w, h * 0.06);
      ctx.fillStyle = "#b30d12"; ctx.fillRect(0, ty - h * 0.03, w * 0.2, h * 0.06);
      ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = `700 ${h * 0.03}px Oswald, sans-serif`;
      ctx.fillText("СРОЧНО", w * 0.1, ty);
      ctx.save(); ctx.beginPath(); ctx.rect(w * 0.2, ty - h * 0.03, w * 0.8, h * 0.06); ctx.clip();
      ctx.fillStyle = "#111"; ctx.textAlign = "left"; ctx.font = `500 ${h * 0.03}px Oswald, sans-serif`;
      const msg = "ОСТАВАЙТЕСЬ ДОМА  •  ЗАКРОЙТЕ ДВЕРИ И ОКНА  •  НЕ ОТКРЫВАЙТЕ ДВЕРЬ НЕЗНАКОМЦАМ  •  ЗАРАЖЁННЫЕ КРАЙНЕ АГРЕССИВНЫ  •  ";
      ctx.fillText(msg + msg, w * 0.22 - ((t * w * 0.18) % (w * 2.2)), ty);
      ctx.restore();
      if (o.warning) {
        ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, my, w, mh);
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = `700 ${h * 0.075}px Oswald, sans-serif`;
        ctx.fillText("НЕ ВЫХОДИТЕ", w / 2, my + mh * 0.42);
        ctx.fillText("ИЗ ДОМА", w / 2, my + mh * 0.6);
      }
    } else {
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(0, h * 0.86, w, h * 0.06);
    }
    ctx.restore();
  };

  // TV picture artefacts over a rect: scanlines, static, roll
  A.screenFX = function (ctx, t, x, y, w, h, o = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    const step = Math.max(2, h / 320);
    for (let yy = y; yy < y + h; yy += step * 2) ctx.fillRect(x, yy, w, step);
    const st = o.static || 0;
    if (st > 0) {
      const fr = F.grainFrames(), k = Math.floor(t * 30) % fr.length;
      ctx.globalAlpha = st; ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(fr[k], 0, 0, 360, 640, x, y, w, h);
      ctx.globalAlpha = 1;
    }
    // rolling bright band
    const by = y + ((t * h * 0.35) % (h * 1.4)) - h * 0.2;
    const g = ctx.createLinearGradient(0, by, 0, by + h * 0.15);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(200,220,255,0.06)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(x, by, w, h * 0.15);
    ctx.restore();
  };
})();
