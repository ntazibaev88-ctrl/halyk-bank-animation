/* SCENE 5 — 0:32-0:45 — knife, lights out, hide.
 * A knife  0.00-2.20  close on the knife block: his hand draws the big knife; the blade catches the light
 * B switch 2.20-3.60  his finger on the switch; the warm lamp dies (cut to blue dark at 2.35)
 * C hide   3.60-8.60  floor level behind the kitchen island: his profile, the knife up; the door still pounds
 * D wide   8.60-13.0  high wide of the dark flat: him crouched behind the island, the door at the back.
 *                     The pounding stops (8.8). The shadow under the door walks away (10.2). Silence. */
(function () {
  const F = window.FILM, { W, H, seg, lerp, rng } = F, A = F.apt;
  const POUND = [4.0, 4.6, 5.3, 6.1, 7.0, 8.0, 8.7]; // scene-local; last hit, then nothing

  function jolt(t, list, amp, dec) {
    let v = 0;
    list.forEach((h) => { const d = t - h; if (d >= 0 && d < dec * 5) v += Math.exp(-d / dec) * Math.sin(d * 70) * amp; });
    return v;
  }

  function knife(ctx, t) {
    const pull = F.easeInOut(seg(t, 0.5, 1.5));
    const bx = 420, by = 1450, size = 760;
    ctx.save();
    F.applyCam(ctx, { z: lerp(0.9, 0.96, seg(t, 0, 2.2)), py: -250 - pull * 300 });
    // wall + counter
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#14100c"); g.addColorStop(1, "#08070a");
    ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200);
    ctx.fillStyle = "#1d2228"; ctx.fillRect(-100, 1450, W + 200, 40);
    ctx.fillStyle = "#0c0e11"; ctx.fillRect(-100, 1490, W + 200, 600);
    F.glow(ctx, 900, 200, 1200, "rgba(220,160,90,0.3)", 1); // the warm lamp
    // the knife: rotated 0.3 like the block slots
    const ang = 0.3 - pull * 0.2;
    const kx = bx + size * 0.1 + pull * 60, ky = by - size * 1.04 - pull * 520;
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(ang);
    // blade
    const bl = 820;
    const blade = ctx.createLinearGradient(-40, 0, 40, 0);
    blade.addColorStop(0, "#5b636c"); blade.addColorStop(0.5, "#c9d1d9"); blade.addColorStop(1, "#3b4148");
    ctx.fillStyle = blade;
    ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(42, 0); ctx.quadraticCurveTo(40, bl * 0.75, 0, bl); ctx.lineTo(-38, bl * 0.2); ctx.closePath(); ctx.fill();
    // specular sweep along the edge
    const sp = seg(t, 1.0, 1.6);
    if (sp > 0 && sp < 1) {
      const sy = lerp(0, bl, sp);
      const sg = ctx.createRadialGradient(10, sy, 0, 10, sy, 200);
      sg.addColorStop(0, "rgba(255,255,255,0.95)"); sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "screen"; ctx.fillStyle = sg; ctx.fillRect(-60, sy - 200, 120, 400);
      ctx.globalCompositeOperation = "source-over";
    }
    // handle + bolster
    ctx.fillStyle = "#6f7780"; ctx.fillRect(-42, -30, 86, 34);
    ctx.fillStyle = "#0b0b0c"; ctx.beginPath(); ctx.roundRect(-36, -330, 72, 300, 20); ctx.fill();
    ctx.fillStyle = "#8a929b"; [-260, -160, -70].forEach((y) => { ctx.beginPath(); ctx.arc(0, y, 7, 0, 6.283); ctx.fill(); });
    ctx.restore();
    // knife block drawn over the blade, so the blade slides out of it
        ctx.save(); ctx.translate(bx, by);
    ctx.fillStyle = "#2a1e15";
    ctx.beginPath(); ctx.moveTo(-size * 0.35, 0); ctx.lineTo(size * 0.35, 0); ctx.lineTo(size * 0.5, -size); ctx.lineTo(-size * 0.05, -size * 1.08); ctx.closePath(); ctx.fill();
    ctx.restore();
    // his fist around the handle
    if (pull > 0 || t > 0.35) {
      const hx = kx + Math.sin(ang) * 180, hy = ky - Math.cos(ang) * 180;
      F.fist(ctx, hx + 30, hy, 110, { rot: Math.PI / 2 + ang, hi: "#5a4f46", color: "#1f1a16" });
    }
    ctx.restore();
    F.dust(ctx, t, { count: 40, seed: 31, alpha: 0.4, rgb: "230,200,160" });
  }

  function lightSwitch(ctx, t) {
    const lt = t - 2.2;
    const off = lt > 0.15;
    ctx.fillStyle = off ? "#06080b" : "#1d1813"; ctx.fillRect(0, 0, W, H);
    if (!off) F.glow(ctx, 900, 300, 1300, "rgba(220,160,90,0.35)", 1);
    else F.glow(ctx, 0, 500, 1100, "rgba(90,120,170,0.18)", 1);
    // switch plate
    ctx.fillStyle = off ? "#20252c" : "#cfc6b6"; ctx.beginPath(); ctx.roundRect(330, 560, 420, 600, 30); ctx.fill();
    ctx.fillStyle = off ? "#161a1f" : "#e8e0d0";
    ctx.save(); ctx.translate(540, 860); ctx.rotate(off ? 0.12 : -0.12);
    ctx.beginPath(); ctx.roundRect(-120, -200, 240, 400, 18); ctx.fill(); ctx.restore();
    // the finger pressing the top of the rocker
    const press = F.easeIn(seg(lt, 0, 0.15));
    ctx.save(); ctx.translate(560, lerp(380, 640, press));
    ctx.fillStyle = off ? "#15171a" : "#6b5a4c";
    ctx.beginPath(); ctx.roundRect(-55, -700, 110, 700, 55); ctx.fill();
    ctx.fillStyle = off ? "#0d0f12" : "#3e342c"; ctx.beginPath(); ctx.roundRect(-160, -1400, 320, 760, 120); ctx.fill();
    ctx.restore();
  }

  function hide(ctx, t) {
    const lt = t - 3.6;
    const sk = { x: jolt(t, POUND, 9, 0.06), y: jolt(t + 0.02, POUND, 6, 0.06) };
    const beat = Math.max(0, Math.sin(t * Math.PI * 2 * 1.5)) ** 8 * 0.012;
    ctx.save();
    F.applyCam(ctx, { z: 1.02 + lt * 0.012 + beat, x: sk.x, y: sk.y });
    ctx.fillStyle = "#030405"; ctx.fillRect(-100, -100, W + 200, H + 200);
    // far background: the door at the end of the dark room, light under it
    ctx.save(); ctx.filter = "blur(4px)";
    A.door(ctx, t, 760, 560, 170, 400, { under: 1, feet: [0.4, 0.6], jolt: jolt(t, POUND, 5, 0.05) });
    ctx.restore();
    // the island edge, right foreground
    const ig = ctx.createLinearGradient(640, 0, 1080, 0);
    ig.addColorStop(0, "#0d1014"); ig.addColorStop(1, "#050608");
    ctx.fillStyle = ig; ctx.fillRect(700, 900, 500, 1100);
    ctx.fillStyle = "rgba(120,150,190,0.35)"; ctx.fillRect(700, 900, 4, 1100);
    // him: crouched, back to the island, head turned toward the door
    ctx.fillStyle = "#050607"; ctx.beginPath(); ctx.ellipse(420, 1750, 380, 420, -0.1, 0, 6.283); ctx.fill();
    F.heroProfile(ctx, 440, 1150, 640, { eye: 1, wide: 0.6 * seg(lt, 0, 1), eyeLight: 0.8, light: { color: "rgba(160,190,235,0.85)", mid: "rgba(40,55,80,0.4)", from: "front" } });
    // the knife held up by his face
    ctx.save(); ctx.translate(700, 1500); ctx.rotate(-0.25 + Math.sin(t * 13) * 0.01);
    const bl = ctx.createLinearGradient(-20, 0, 20, 0);
    bl.addColorStop(0, "#2d3238"); bl.addColorStop(0.5, "#9aa5b1"); bl.addColorStop(1, "#1a1d21");
    ctx.fillStyle = bl; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(26, 0); ctx.quadraticCurveTo(24, -380, 0, -470); ctx.lineTo(-24, -90); ctx.fill();
    ctx.fillStyle = "rgba(220,235,255,0.7)"; ctx.fillRect(14, -380 + Math.sin(t) * 40, 6, 120);
    ctx.restore();
    F.fist(ctx, 690, 1560, 95, { rot: -1.82, hi: "#3a4048", color: "#15181c" });
    // moonlight stripe across the eyes from the blinds
    A.slats(ctx, -100, 920, 1300, 520, 4, 120, 0.16);
    ctx.restore();
  }

  function wide(ctx, t) {
    const lt = t - 8.6;
    const stopped = t > 8.8;
    const walkAway = seg(t, 10.2, 11.6);
    ctx.save();
    F.applyCam(ctx, { z: lerp(1.0, 1.12, F.easeInOut(seg(lt, 0, 4.4))), py: 80, x: jolt(t, POUND, 6, 0.06) });
    // floor seen from high
    const fl = ctx.createLinearGradient(0, 0, 0, H);
    fl.addColorStop(0, "#07090c"); fl.addColorStop(1, "#0b0e12");
    ctx.fillStyle = fl; ctx.fillRect(-200, -200, W + 400, H + 400);
    // back wall strip with the door (top), window on the left wall
    ctx.fillStyle = "#040506"; ctx.fillRect(-200, -200, W + 400, 520);
    const under = 1 - seg(t, 11.4, 11.8) * 0.85; // corridor light goes out
    A.door(ctx, t, 640, 40, 200, 290, { under, feet: walkAway < 1 ? [lerp(0.4, 1.4, walkAway), lerp(0.6, 1.6, walkAway)] : [], jolt: jolt(t, POUND, 4, 0.05) });
    // moonlight from the window on the left falls as slats across the floor
    ctx.fillStyle = "#020304"; ctx.fillRect(-200, 300, 230, 1500);
    A.window(ctx, t + 32, 0, 520, 60, 820, { open: 0.3, frame: 8 });
    A.slats(ctx, 60, 700, 900, 900, 9, 260, 0.13);
    // kitchen island, seen from above
    ctx.fillStyle = "#0e1217"; ctx.fillRect(330, 820, 520, 300);
    ctx.fillStyle = "#151a20"; ctx.fillRect(330, 820, 520, 14);
    A.knifeBlock(ctx, 760, 880, 60, { missing: true });
    // couch (left) and TV (dark now)
    A.couch(ctx, 60, 1420, 520, 260, { color: "#07090b" });
    // him: small, crouched behind the island (between island and camera), knife up
    F.figure(ctx, { kind: "hero", facing: "left", x: 600, y: 1270, h: 330, pose: { lean: -0.45, neck: -0.2, hL: [-1.3, 2.2], hR: [-1.1, 2.0], sL: [-1.2, -1.4], sR: [-0.6, -1.9] }, color: "#050607", rim: { color: "rgba(130,160,205,0.7)", dx: 2, dy: 2 } });
    ctx.restore();
    F.fog(ctx, t, { seed: 19, alpha: 0.06, scale: 5, speed: 5 });
    F.dust(ctx, t, { count: 30, seed: 41, alpha: 0.3 });
  }

  F.scenes.s5 = function (ctx, t) {
    F.clear(ctx);
    let warm = false;
    if (t < 2.2) { knife(ctx, t); warm = true; }
    else if (t < 3.6) { lightSwitch(ctx, t); warm = t < 2.35; }
    else if (t < 8.6) hide(ctx, t);
    else wide(ctx, t);
    F.finish(ctx, t, { seed: 5, vignette: 0.85, tint: warm ? "#c9c3bb" : "#aebdd0" });
  };
})();
