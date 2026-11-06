/* SCENE 7 — 0:55-1:00 — the reveal, then hard cut to black.
 * A behind 0.00-3.40  behind him, low: he crouches in the phone glow (foreground, going soft as
 *                     focus racks past him). Deep in the room, by the window, someone is standing.
 *                     It has been there the whole time. Its head tilts; its eyes catch the light.
 * B flash  3.40-3.95  lightning through the window: it is right behind him. Face, teeth.
 * CUT      3.95       hard cut to black, held to the end. */
(function () {
  const F = window.FILM, { W, H, seg, lerp } = F, A = F.apt;
  const CUT = 3.95;

  function behind(ctx, t) {
    const p = F.easeInOut(seg(t, 0, 3.4));
    ctx.save();
    F.applyCam(ctx, { z: lerp(1.0, 1.35, p), px: lerp(0, 120, p), py: lerp(0, -120, p) });
    ctx.fillStyle = "#030405"; ctx.fillRect(-300, -300, W + 600, H + 600);
    // the window far back, faint
    A.window(ctx, t + 55, 560, 380, 260, 620, { open: 0.25, frame: 10 });
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(560, 380, 260, 620);
    F.glow(ctx, 690, 690, 500, "rgba(90,120,170,0.18)", 1);
    // the figure standing before the window: still, tall, rim-lit
    const tilt = F.easeInOut(seg(t, 1.2, 3.0)) * 0.35;
    F.figure(ctx, {
      kind: "zombie", facing: "front", x: 700, y: 1180, h: 760, seed: 77,
      pose: { lean: 0.03, neck: tilt, hL: [-0.04, 0.02], hR: [0.05, -0.02], sL: [-0.08, 0.05], sR: [0.1, -0.08] },
      color: "#020203", rim: { color: `rgba(110,140,185,${0.12 + 0.45 * seg(t, 0.8, 3.0)})`, dx: 0, dy: 3 },
      eyes: t > 2.0 ? `rgba(200,215,225,${0.35 * seg(t, 2.0, 2.6)})` : null, eyeShift: tilt * 0.6,
    });
    F.fog(ctx, t, { seed: 71, alpha: 0.07, scale: 5, speed: 4 });
    ctx.restore();
    // him, foreground: back of the head and shoulders, soft, phone light wrapping round his ear
    ctx.save();
    ctx.filter = `blur(${lerp(0, 9, p)}px)`;
    const hx = lerp(260, 120, p), hy = lerp(1500, 1650, p), hs = lerp(1.0, 1.25, p);
    ctx.translate(hx, hy); ctx.scale(hs, hs);
    ctx.fillStyle = "#020203";
    ctx.beginPath(); ctx.ellipse(0, 380, 520, 330, 0.1, 0, 6.283); ctx.fill(); // shoulders/hood
    ctx.beginPath(); ctx.ellipse(10, 0, 210, 250, 0.08, 0, 6.283); ctx.fill(); // head
    const turn = F.easeInOut(seg(t, 0.4, 2.2));
    ctx.strokeStyle = `rgba(170,200,240,${0.55})`; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(10, 0, 210, 250, 0.08, -0.6, 0.6 + turn * 0.4); ctx.stroke();
    // a sliver of cheek as he starts to turn
    if (turn > 0.1) { F.glow(ctx, 200, 60, 70 * turn, "rgba(170,200,240,0.6)", 1); }
    ctx.restore();
    F.glow(ctx, 0, 1900, 600, "rgba(160,190,235,0.25)", 1);
  }

  function flash(ctx, t) {
    const lt = t - 3.4;
    // flicker pattern: on, off, on and decaying
    const on = lt < 0.08 ? 1 : lt < 0.16 ? 0.1 : Math.exp(-(lt - 0.16) / 0.5);
    const sk = F.shake(lt, 0, 30, 0.12);
    ctx.save(); ctx.translate(sk.x, sk.y);
    ctx.fillStyle = `rgb(${6 + 40 * on},${8 + 52 * on},${12 + 70 * on})`; ctx.fillRect(-50, -50, W + 100, H + 100);
    F.glow(ctx, 770, 560, 900, `rgba(200,215,240,${0.55 * on})`, 1);
    // window blown out behind
    ctx.fillStyle = `rgba(235,242,255,${on})`; ctx.fillRect(560, 120, 420, 900);
    // it is right behind him: huge, face lit by the lightning
    const s = lerp(980, 1150, seg(lt, 0, 0.55));
    ctx.fillStyle = "#010102";
    ctx.beginPath(); ctx.ellipse(640, 1750, 620, 520, 0, 0, 6.283); ctx.fill(); // its shoulders
    F.zombieFace(ctx, t, 640, 860, s, { jaw: 0.3 + 0.6 * seg(lt, 0.1, 0.4), light: 0.7, seed: 77, rim: "rgba(220,230,255,0.8)", bright: 0.6 * on + 0.2 });
    // its hand reaching toward his shoulder
    ctx.fillStyle = "#020203";
    ctx.save(); ctx.translate(250, 1500); ctx.rotate(-0.5);
    ctx.beginPath(); ctx.roundRect(-60, -40, 340, 120, 50); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.roundRect(-210, -40 + i * 32, 170, 22, 11); ctx.fill(); }
    ctx.restore();
    // his head, foreground silhouette, half turned
    ctx.beginPath(); ctx.ellipse(170, 1700, 260, 320, 0.2, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.ellipse(120, 2050, 560, 300, 0, 0, 6.283); ctx.fill();
    ctx.restore();
    F.chroma(ctx, 10 * (1 - seg(lt, 0, 0.3)));
    if (on < 0.2) { ctx.fillStyle = `rgba(0,0,0,${0.6 - on * 2})`; ctx.fillRect(0, 0, W, H); }
  }

  F.scenes.s7 = function (ctx, t) {
    F.clear(ctx, "#000");
    if (t >= CUT) return; // hard cut to black
    if (t < 3.4) behind(ctx, t);
    else flash(ctx, t);
    F.finish(ctx, t, { seed: 7, vignette: t < 3.4 ? 0.9 : 0.6, tint: t < 3.4 ? "#aebdd0" : "#d0d8e4" });
  };
})();
