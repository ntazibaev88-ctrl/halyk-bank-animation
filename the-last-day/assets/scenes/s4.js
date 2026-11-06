/* SCENE 4 — 0:22-0:32 — someone knocks.
 * A hall    0.00-3.20  down the hallway to the steel door; corridor light under it; a shadow stops; 3 soft knocks
 * B him     3.20-4.80  over his shoulder: he stares at the door; two more knocks
 * C door    4.80-7.60  close on the door: it is pounded, jumps in its frame, dust falls, the chain swings
 * D bolt    7.60-10.0  extreme close-up: his shaking hand slides the bolt home
 * A dim warm lamp is still on in the flat (he switches it off in scene 5). */
(function () {
  const F = window.FILM, { W, H, seg, lerp, rng } = F, A = F.apt;
  // knock / pound times (scene-local), mirrored by the SFX in index.html
  const SOFT = [0.4, 0.75, 1.1, 3.4, 3.8];
  const POUND = [4.9, 5.5, 6.0, 6.4, 6.8, 7.2];
  F.s4hits = { SOFT, POUND };

  function jolt(t, list, amp, dec) {
    let v = 0;
    list.forEach((h) => { const d = t - h; if (d >= 0 && d < dec * 5) v += Math.exp(-d / dec) * Math.sin(d * 70) * amp; });
    return v;
  }
  function lastHit(t, list) { let d = 99; list.forEach((h) => { if (t >= h) d = Math.min(d, t - h); }); return d; }

  function hall(ctx, t) {
    const z = lerp(1, 1.12, F.easeInOut(seg(t, 0, 3.2)));
    const hh = F.handheld(t, 0.4, 21);
    ctx.save();
    F.applyCam(ctx, { z, x: hh.x, y: hh.y, r: hh.r, py: 60 });
    // hallway in one-point perspective
    const dx = 380, dy = 640, dw = 320, dh = 760;
    ctx.fillStyle = "#07090c"; ctx.fillRect(-200, -200, W + 400, H + 400);
    const wallL = ctx.createLinearGradient(-200, 0, dx, 0);
    wallL.addColorStop(0, "#151514"); wallL.addColorStop(1, "#0a0b0c");
    ctx.fillStyle = wallL; ctx.beginPath(); ctx.moveTo(-200, -300); ctx.lineTo(dx - 40, dy - 60); ctx.lineTo(dx - 40, dy + dh + 20); ctx.lineTo(-200, H + 300); ctx.fill();
    const wallR = ctx.createLinearGradient(W + 200, 0, dx + dw, 0);
    wallR.addColorStop(0, "#121212"); wallR.addColorStop(1, "#08090a");
    ctx.fillStyle = wallR; ctx.beginPath(); ctx.moveTo(W + 200, -300); ctx.lineTo(dx + dw + 40, dy - 60); ctx.lineTo(dx + dw + 40, dy + dh + 20); ctx.lineTo(W + 200, H + 300); ctx.fill();
    ctx.fillStyle = "#0b0c0d"; ctx.beginPath(); ctx.moveTo(-200, H + 300); ctx.lineTo(dx - 40, dy + dh + 20); ctx.lineTo(dx + dw + 40, dy + dh + 20); ctx.lineTo(W + 200, H + 300); ctx.fill();
    // coats on hooks (left), shoe shelf (right)
    ctx.fillStyle = "#050607";
    ctx.beginPath(); ctx.ellipse(170, 900, 70, 260, 0.05, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.ellipse(260, 860, 55, 220, -0.04, 0, 6.283); ctx.fill();
    ctx.fillRect(820, 1480, 240, 30); ctx.fillRect(820, 1600, 260, 30);
    // warm lamp from the room behind camera
    F.glow(ctx, 540, 1100, 900, "rgba(200,150,90,0.16)", 1);
    const d = lastHit(t, SOFT);
    const feet = t < 1.3 ? [lerp(-0.2, 0.42, seg(t, 0, 0.35)), lerp(-0.05, 0.62, seg(t, 0.05, 0.4))] : [0.42, 0.62];
    A.door(ctx, t, dx, dy, dw, dh, { under: 1, feet, jolt: jolt(t, SOFT, 2, 0.04), chainSwing: 0.2, peep: 0.25 + (d < 0.1 ? 0.3 : 0) });
    ctx.restore();
    F.fog(ctx, t, { seed: 13, alpha: 0.08, scale: 5, speed: 6 });
    F.dust(ctx, t, { count: 40, seed: 21, alpha: 0.4, rgb: "220,190,150" });
  }

  function shoulder(ctx, t) {
    const lt = t - 3.2;
    ctx.fillStyle = "#08090b"; ctx.fillRect(0, 0, W, H);
    // the door, small and soft in the background
    ctx.save(); ctx.filter = "blur(5px)";
    ctx.fillStyle = "#0e1013"; ctx.fillRect(560, 560, 420, 1100);
    A.door(ctx, t, 640, 640, 250, 600, { under: 1, feet: [0.42, 0.62], jolt: jolt(t, SOFT, 2, 0.04) });
    ctx.restore();
    F.glow(ctx, 300, 1200, 800, "rgba(200,150,90,0.18)", 1);
    // his head in profile, foreground left, facing the door
    const br = 1 + 0.02 * Math.sin(lt * 5);
    F.heroProfile(ctx, 260 + lt * 10, 980, 760 * br, { eye: 1, wide: 0.4, eyeLight: 0.55, light: { color: "rgba(210,160,100,0.55)", mid: "rgba(60,40,30,0.3)", from: "front" } });
    ctx.fillStyle = "#050607"; ctx.beginPath(); ctx.ellipse(150, 1900, 480, 420, 0, 0, 6.283); ctx.fill(); // shoulder
  }

  function doorClose(ctx, t) {
    const lt = t - 4.8;
    const j = jolt(t, POUND, 26, 0.05);
    const sk = { x: jolt(t, POUND, 18, 0.06), y: jolt(t + 0.01, POUND, 12, 0.06) };
    ctx.save();
    F.applyCam(ctx, { z: 1.0 + lt * 0.015, x: sk.x, y: sk.y });
    ctx.fillStyle = "#0a0b0d"; ctx.fillRect(-100, -100, W + 200, H + 200);
    const d = lastHit(t, POUND);
    A.door(ctx, t, 140, 120, 800, 1700, { under: 0.9 + (d < 0.08 ? 0.4 : 0), feet: [0.35, 0.6], jolt: j, chainSwing: 1.2, lit: true, peep: 0.3 });
    // falling dust from the frame after each hit
    if (d < 1.2) {
      const r = rng(Math.floor(t * 1) + 3);
      ctx.fillStyle = "rgba(210,200,185,0.55)";
      for (let i = 0; i < 60; i++) { const x = 140 + r() * 820, y = 80 + (r() * 200 + d * (500 + r() * 400)); ctx.fillRect(x, y, 2, 2 + r() * 3); }
    }
    ctx.restore();
    F.glow(ctx, 540, 1900, 700, "rgba(230,190,140,0.18)", 1);
    F.glow(ctx, 540, 900, 1000, "rgba(200,150,90,0.12)", 1);
  }

  function bolt(ctx, t) {
    const lt = t - 7.6;
    const slide = F.easeInOut(seg(lt, 0.4, 1.0));
    const shakeX = Math.sin(t * 37) * 4 + Math.sin(t * 23) * 3;
    ctx.save();
    F.applyCam(ctx, { z: lerp(1.0, 1.06, seg(lt, 0, 2.4)), x: jolt(t, [8.6], 10, 0.05) });
    // steel door surface
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#2c333b"); g.addColorStop(1, "#0d1014");
    ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.5; ctx.drawImage(F.fogTex(61, [150, 150, 150], 1.4), -100, -100, W + 200, H + 200); ctx.restore();
    // bolt plate + keeper on the frame (right)
    ctx.fillStyle = "#1a1e23"; ctx.fillRect(80, 760, 700, 300);
    ctx.fillStyle = "#3d454e"; ctx.fillRect(80, 760, 700, 8);
    [[110, 790], [110, 1020], [750, 790], [750, 1020]].forEach(([x, y]) => { ctx.fillStyle = "#4b545e"; ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.283); ctx.fill(); });
    ctx.fillStyle = "#050607"; ctx.fillRect(900, 700, 260, 420);
    ctx.fillStyle = "#2b3137"; ctx.fillRect(900, 840, 120, 140);
    ctx.fillStyle = "#000"; ctx.fillRect(915, 870, 105, 80);
    // the bar
    const bx = lerp(180, 420, slide);
    const bg = ctx.createLinearGradient(0, 860, 0, 960);
    bg.addColorStop(0, "#c3ccd5"); bg.addColorStop(0.5, "#6d7782"); bg.addColorStop(1, "#2a3036");
    ctx.fillStyle = bg; ctx.fillRect(bx, 870, 600, 70);
    // knob
    ctx.fillStyle = "#8f99a4"; ctx.fillRect(bx + 120, 760, 46, 120);
    ctx.restore();
    // his hand on the knob
    F.fist(ctx, 300 + lerp(180, 420, slide) - 180 + shakeX, 720, 150, { rot: 1.35, hi: "#5a4f46", color: "#1f1a16" });
    // light: warm lamp from the left, corridor light seeping around the frame
    F.glow(ctx, 0, 600, 900, "rgba(210,160,100,0.2)", 1);
    F.glow(ctx, 1080, 900, 300, "rgba(230,190,140,0.25)", 1);
    if (lt > 1.0 && lt < 1.08) { ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, 0, W, H); }
  }

  F.scenes.s4 = function (ctx, t) {
    F.clear(ctx);
    if (t < 3.2) hall(ctx, t);
    else if (t < 4.8) shoulder(ctx, t);
    else if (t < 7.6) doorClose(ctx, t);
    else bolt(ctx, t);
    F.finish(ctx, t, { seed: 4, vignette: 0.85, tint: "#b9c2cc" });
  };
})();
