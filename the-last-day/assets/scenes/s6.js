/* SCENE 6 — 0:45-0:55 — the message.
 * A floor  0.00-2.60  the phone on the floor beside him buzzes and lights the dark
 * B screen 2.60-8.00  the phone in his hands: "Неизвестный номер" is typing...
 *                     5.00 "Не открывай дверь."   7.30 "Я уже внутри."
 * C face   8.00-10.0  his face in the phone light; his eyes go wide and slide to the side */
(function () {
  const F = window.FILM, { W, H, seg, lerp, rng } = F, A = F.apt;
  const BUZZ = [[0.3, 0.45], [0.95, 0.45], [1.9, 0.45], [2.55, 0.45]];
  const MSG1 = 5.0, MSG2 = 7.3;
  const buzzing = (t) => BUZZ.some(([s, l]) => t >= s && t < s + l);

  function ui(ctx, t, x, y, w, h, o = {}) {
    // messenger, dark theme
    ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, w * 0.08); ctx.clip();
    ctx.fillStyle = "#0b0d10"; ctx.fillRect(x, y, w, h);
    const u = w / 700; // ui unit
    // header
    ctx.fillStyle = "#14171c"; ctx.fillRect(x, y, w, 190 * u);
    ctx.fillStyle = "#2a2f37"; ctx.beginPath(); ctx.arc(x + 90 * u, y + 115 * u, 42 * u, 0, 6.283); ctx.fill();
    ctx.fillStyle = "#8a93a0"; ctx.font = `800 ${46 * u}px Montserrat, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("?", x + 90 * u, y + 117 * u);
    ctx.textAlign = "left"; ctx.fillStyle = "#e9edf2"; ctx.font = `800 ${34 * u}px Montserrat, sans-serif`;
    ctx.fillText("Неизвестный номер", x + 155 * u, y + 100 * u);
    ctx.fillStyle = "#6f7a88"; ctx.font = `800 ${24 * u}px Montserrat, sans-serif`;
    const typing = (t > 3.6 && t < MSG1) || (t > 6.1 && t < MSG2);
    ctx.fillText(typing ? "печатает..." : "в сети", x + 155 * u, y + 142 * u);
    ctx.fillStyle = "#6f7a88"; ctx.textAlign = "center"; ctx.font = `800 ${22 * u}px Montserrat, sans-serif`;
    ctx.fillText("СЕГОДНЯ, 03:12", x + w / 2, y + 250 * u);
    // bubbles (incoming, left)
    let by = y + 330 * u;
    const bubble = (text, at, red) => {
      const k = F.easeOut(seg(t, at, at + 0.25));
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 30 * u);
      ctx.font = `800 ${48 * u}px Montserrat, sans-serif`; ctx.textAlign = "left";
      const tw = ctx.measureText(text).width;
      ctx.fillStyle = red ? "#3a0d10" : "#1f242b";
      ctx.beginPath(); ctx.roundRect(x + 40 * u, by, tw + 80 * u, 134 * u, 40 * u); ctx.fill();
      // glitch jitter on the second message
      const gj = red && t - at < 0.4 ? Math.sin(t * 90) * 6 * u : 0;
      if (gj) { ctx.fillStyle = "rgba(255,40,40,0.6)"; ctx.fillText(text, x + 80 * u + gj, by + 68 * u); }
      ctx.fillStyle = red ? "#ff5a5a" : "#f2f4f7"; ctx.textBaseline = "middle";
      ctx.fillText(text, x + 80 * u, by + 68 * u);
      ctx.fillStyle = "#5d6673"; ctx.font = `800 ${20 * u}px Montserrat, sans-serif`;
      ctx.fillText("03:12", x + 80 * u + tw - 40 * u, by + 160 * u);
      ctx.restore();
      by += 200 * u;
    };
    bubble("Не открывай дверь.", MSG1, false);
    bubble("Я уже внутри.", MSG2, true);
    if (typing) {
      ctx.fillStyle = "#1f242b"; ctx.beginPath(); ctx.roundRect(x + 40 * u, by, 150 * u, 80 * u, 30 * u); ctx.fill();
      for (let i = 0; i < 3; i++) { const a = 0.35 + 0.65 * Math.max(0, Math.sin(t * 8 - i * 0.9)); ctx.fillStyle = `rgba(200,208,218,${a})`; ctx.beginPath(); ctx.arc(x + (80 + i * 36) * u, by + 40 * u, 11 * u, 0, 6.283); ctx.fill(); }
    }
    // input bar
    ctx.fillStyle = "#14171c"; ctx.fillRect(x, y + h - 130 * u, w, 130 * u);
    ctx.fillStyle = "#1f242b"; ctx.beginPath(); ctx.roundRect(x + 30 * u, y + h - 105 * u, w - 60 * u, 76 * u, 38 * u); ctx.fill();
    ctx.restore();
  }

  function floor(ctx, t) {
    const jit = buzzing(t) ? { x: Math.sin(t * 160) * 4, r: Math.sin(t * 130) * 0.01 } : { x: 0, r: 0 };
    const lit = t > 0.3 ? 1 : 0;
    ctx.save();
    F.applyCam(ctx, { z: lerp(1.0, 1.1, seg(t, 0, 2.6)) });
    ctx.fillStyle = "#07090b"; ctx.fillRect(-100, -100, W + 200, H + 200);
    // floorboards
    ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.lineWidth = 3;
    for (let i = -6; i < 14; i++) { ctx.beginPath(); ctx.moveTo(i * 150, -100); ctx.lineTo(i * 150 + 500, H + 100); ctx.stroke(); }
    // light pool from the screen
    if (lit) F.glow(ctx, 560, 980, 700, "rgba(150,180,230,0.35)", 1);
    // his knee and the knife lying by it
    ctx.fillStyle = "#040506"; ctx.beginPath(); ctx.ellipse(130, 1500, 360, 300, 0.4, 0, 6.283); ctx.fill();
    // phone, face up
    ctx.save(); ctx.translate(560 + jit.x, 980); ctx.rotate(-0.35 + jit.r);
    ctx.fillStyle = "#020203"; ctx.beginPath(); ctx.roundRect(-170, -340, 340, 680, 46); ctx.fill();
    if (lit) {
      ctx.fillStyle = "#0b0d10"; ctx.beginPath(); ctx.roundRect(-155, -325, 310, 650, 36); ctx.fill();
      ctx.fillStyle = "#c9ced6"; ctx.font = "800 64px Montserrat, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("03:12", 0, -200);
      ctx.fillStyle = "rgba(40,46,55,0.95)"; ctx.beginPath(); ctx.roundRect(-140, -80, 280, 120, 22); ctx.fill();
      ctx.fillStyle = "#e9edf2"; ctx.font = "800 22px Montserrat, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Неизвестный номер", -120, -45);
      ctx.fillStyle = "#8a93a0"; ctx.font = "800 18px Montserrat, sans-serif"; ctx.fillText("Новое сообщение", -120, -10);
    }
    ctx.restore();
    // his hand reaching in
    if (t > 1.9) { const k = F.easeOut(seg(t, 1.9, 2.6)); F.fist(ctx, lerp(1200, 780, k), lerp(1500, 1180, k), 110, { rot: -2.5, hi: "#3a4048", color: "#15181c" }); }
    ctx.restore();
  }

  function screen(ctx, t) {
    const lt = t - 2.6;
    const sway = F.handheld(t, 0.6, 31);
    ctx.fillStyle = "#040506"; ctx.fillRect(0, 0, W, H);
    // the dark room behind, soft
    F.glow(ctx, 900, 400, 600, "rgba(90,120,170,0.12)", 1);
    ctx.save(); ctx.filter = "blur(10px)"; A.door(ctx, t, 820, 260, 140, 340, { under: 0.15 }); ctx.restore();
    ctx.save();
    F.applyCam(ctx, { z: lerp(1.0, 1.1, seg(lt, 0, 5.4)), x: sway.x, y: sway.y, r: sway.r + 0.03, py: -40 });
    const px = 200, py = 210, pw = 680, ph = 1360;
    F.glow(ctx, px + pw / 2, py + ph / 2, 900, "rgba(150,180,230,0.25)", 1);
    ctx.fillStyle = "#020203"; ctx.beginPath(); ctx.roundRect(px - 22, py - 22, pw + 44, ph + 44, 80); ctx.fill();
    ui(ctx, t, px, py, pw, ph);
    // glass glare
    const g = ctx.createLinearGradient(px, py, px + pw, py + ph * 0.5);
    g.addColorStop(0, "rgba(255,255,255,0.06)"); g.addColorStop(0.5, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 56); ctx.fill();
    // hands holding it at the bottom
    F.fist(ctx, px + 10, py + ph - 120, 130, { rot: -1.2, hi: "#454c55", color: "#15181c" });
    F.fist(ctx, px + pw - 10, py + ph - 120, 130, { rot: -1.95, flip: true, hi: "#454c55", color: "#15181c" });
    ctx.restore();
  }

  function face(ctx, t) {
    const lt = t - 8;
    ctx.fillStyle = "#030405"; ctx.fillRect(0, 0, W, H);
    ctx.save();
    F.applyCam(ctx, { z: lerp(1.0, 1.12, F.easeIn(seg(lt, 0, 2))) });
    F.glow(ctx, 760, 1500, 700, "rgba(150,180,230,0.28)", 1);
    ctx.fillStyle = "#050607"; ctx.beginPath(); ctx.ellipse(400, 1900, 560, 360, 0, 0, 6.283); ctx.fill();
    F.heroProfile(ctx, 470, 950, 900, { eye: 1, wide: seg(lt, 0.2, 0.8), eyeLight: 0.6, light: { color: "rgba(185,210,245,0.9)", mid: "rgba(40,55,80,0.4)", from: "below" } });
    ctx.restore();
    // phone glow edge in the bottom right
    F.glow(ctx, 1000, 1750, 400, "rgba(170,200,240,0.4)", 1);
  }

  F.scenes.s6 = function (ctx, t) {
    F.clear(ctx);
    if (t < 2.6) floor(ctx, t);
    else if (t < 8) screen(ctx, t);
    else face(ctx, t);
    F.finish(ctx, t, { seed: 6, vignette: 0.85 });
  };
})();
