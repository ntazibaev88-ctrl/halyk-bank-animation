// Corporate opening: Kazakhmys Distribution — ПТЭ ЖӘНЕ ТБ. Typography only (no logo).
SCENES.intro = {
  build(root, info) {
    const svg = stage(root, `<rect width="1080" height="1920" fill="url(#skyNight)"/>`);
    const c = {};
    let st = '';
    for (let i = 0; i < 70; i++) st += `<circle cx="${(rnd(i + 300) * 1080).toFixed(0)}" cy="${(rnd(i + 400) * 800).toFixed(0)}" r="${(0.8 + rnd(i + 500) * 2).toFixed(1)}" fill="#cfe3ff" opacity="${(0.3 + rnd(i + 600) * 0.6).toFixed(2)}"/>`;
    c.stars = layer(svg, st);
    // exterior (plant + foreground pipes), with its own camera
    c.ext = layer(svg, '');
    c.cam = layer(c.ext, '');
    c.pg = layer(c.cam, ''); c.plant = new Plant(c.pg, 'inp', 'night'); T(c.pg, -20, 1250, 1);
    c.ground = layer(c.cam, `<rect x="-200" y="1250" width="1480" height="700" fill="#081633"/><rect x="-200" y="1246" width="1480" height="10" fill="#1d3b72"/>`);
    c.fg = layer(c.ext, `
      <rect x="-100" y="1330" width="1300" height="120" rx="60" fill="url(#pipeO)"/>
      <rect x="-100" y="1490" width="1300" height="90" rx="45" fill="url(#pipeB)"/>
      ${[160, 520, 880].map(x => `<rect x="${x}" y="1312" width="44" height="156" rx="8" fill="#c95f0a"/><rect x="${x + 50}" y="1312" width="44" height="156" rx="8" fill="#b8560a"/>`).join('')}
      ${[300, 760].map(x => `<rect x="${x}" y="1470" width="36" height="130" rx="6" fill="#1f5fbf"/>`).join('')}
      <rect x="0" y="1600" width="1080" height="320" fill="url(#grate)"/><rect x="0" y="1596" width="1080" height="8" fill="#ffd23f" opacity="0.6"/>`);
    c.steam = [new Puffs(c.ext, 16, { x: 236, y: 1312, life: 2.4, rise: 320, wind: 70, r0: 16, r1: 90, a: 0.45, spread: 20, seed: 81 }),
      new Puffs(c.ext, 16, { x: 955, y: 1312, life: 2.8, rise: 360, wind: 50, r0: 16, r1: 100, a: 0.4, spread: 20, seed: 82 })];
    // interior (boiler room)
    c.int = layer(svg, ''); c.room = new BoilerRoom(c.int, 'inr');
    c.dim = layer(svg, `<rect width="1080" height="1920" fill="#040a1c"/>`);
    c.band = layer(svg, `<rect x="0" y="0" width="1080" height="1920" fill="url(#fade)" transform="rotate(180 540 960)" opacity="0.9"/>`);
    // worker
    c.wg = layer(svg, ''); c.w = new Worker(c.wg, 'inw');
    // typography
    c.panel = html(`<div class="abs" style="left:0;right:0;top:0;height:520px;background:linear-gradient(180deg,rgba(4,10,28,.92) 0%,rgba(4,10,28,.85) 70%,rgba(4,10,28,0) 100%)"></div>`);
    root.appendChild(c.panel);
    c.name = html(`<div class="abs" style="left:0;right:0;top:760px;text-align:center">
      <div data-k="n1" class="shine" style="font-weight:900;font-size:96px;line-height:1;letter-spacing:14px">KAZAKHMYS</div>
      <div data-k="line" style="height:5px;width:640px;margin:22px auto 20px;background:linear-gradient(90deg,rgba(255,138,31,0),#ff8a1f 20%,#ffb347 50%,#ff8a1f 80%,rgba(255,138,31,0))"></div>
      <div data-k="n2" style="font-weight:700;font-size:46px;line-height:1;letter-spacing:22px;color:#cfe0f7;padding-left:22px">DISTRIBUTION</div></div>`);
    root.appendChild(c.name); c.nr = refs(c.name);
    c.title = html(`<div class="abs" style="left:0;right:0;top:820px;text-align:center">
      <div data-k="t1" style="font-weight:900;font-size:108px;line-height:1;letter-spacing:1px;text-shadow:0 10px 40px rgba(0,0,0,.5)"><span style="color:#ff8a1f">ПТЭ</span> ЖӘНЕ <span style="color:#ff8a1f">ТБ</span></div>
      <div data-k="t2" style="display:flex;align-items:center;justify-content:center;gap:22px;margin-top:22px">
        <i data-k="l1" style="display:block;width:90px;height:4px;background:#ff8a1f"></i>
        <span style="font-weight:800;font-size:50px;letter-spacing:6px">ҚАУІПСІЗДІК ЕРЕЖЕЛЕРІ</span>
        <i data-k="l2" style="display:block;width:90px;height:4px;background:#ff8a1f"></i></div></div>`);
    root.appendChild(c.title); c.tr = refs(c.title);
    c.sub = html(`<div class="abs" style="left:60px;right:60px;top:560px;padding:20px 26px;border-radius:24px;text-align:center;background:rgba(10,22,48,.86);border:3px solid #ff8a1f;box-shadow:0 18px 50px rgba(0,0,0,.45)">
      <div style="font-weight:900;font-size:40px;line-height:1.18">КОТЕЛЬНЫЙ ЦЕХТАҒЫ ЖҰМЫСТЫ<br><span style="color:#ffb347">ҚАУІПСІЗ ОРЫНДАУ ТӘРТІБІ</span></div></div>`);
    root.appendChild(c.sub);
    const ag = [['list', 'Жұмысты қауіпсіз<br>орындау тәртібі', 'today'], ['gearCheck', 'Жабдықтарды пайдалану<br>талаптары', 'eq'], ['shield', 'Өндірістік қауіпсіздік<br>ережелері', 'rules']];
    c.agenda = ag.map(([ic, t, cue], i) => {
      const el = html(`<div class="pill" style="left:440px;top:${800 + i * 165}px;width:580px;font-size:31px;padding:16px 22px">
        <div class="ic"><svg viewBox="-50 -50 100 100">${ICON[ic]}</svg></div><div><span style="color:#ffb347;font-weight:900">${i + 1}.</span> ${t}</div></div>`);
      root.appendChild(el); return { el, cue };
    });
    return c;
  },
  update(c, lt, info) {
    // camera: slow cinematic push/pan over the plant (0..8s), then fly into the boiler-house (7.6..9.2)
    const go = ep(lt, 7.6, 1.6, E.inOutCubic);
    const pan = E.inOutSine(clamp(lt / 8));
    const zs = lerp(1.18, 1.06, pan) * lerp(1, 2.6, go);
    const fx = 500, fy = 1000; // focus: boiler house
    T(c.cam, fx - fx * zs + lerp(-50, 20, pan), fy - fy * zs + lerp(30, 0, pan), zs);
    T(c.fg, lerp(-60, 40, pan) - go * 300, go * 500, 1 + go * 0.4);
    O(c.ext, 1 - ep(lt, 8.3, 0.8));
    O(c.stars, 1 - go);
    c.plant.update(lt + 3);
    c.steam.forEach(s => s.update(lt));
    // boiler room comes in
    const ik = ep(lt, 8.0, 1.4, E.outCubic);
    T(c.int, 540 - 540 * lerp(1.35, 1, ik), 1000 - 1000 * lerp(1.35, 1, ik), lerp(1.35, 1, ik), 0, ik);
    c.room.update(lt);
    O(c.dim, 1 - ep(lt, 0, 1.2));
    O(c.band, 0.85 * (1 - ep(lt, 8.5, 1)) * ep(lt, 1.6, 0.6) + 0.35 * ep(lt, 9.0, 1));
    // company name: 2..4 centre, then rises to the top
    const nIn = ep(lt, 1.9, 1.1, E.outCubic), nUp = ep(lt, 4.0, 1.0, E.inOutCubic);
    T(c.name, 0, lerp(0, -620, nUp), lerp(1, 0.48, nUp), 0, ep(lt, 1.9, 0.5));
    c.nr.n1.style.letterSpacing = lerp(40, 14, nIn).toFixed(1) + 'px';
    c.nr.n1.style.backgroundPosition = `${lerp(160, -60, clamp((lt - 2.2) / 1.6))}% 0`;
    c.nr.line.style.transform = `scaleX(${ep(lt, 2.0, 0.9, E.outExpo).toFixed(3)})`;
    O(c.nr.n2, ep(lt, 2.5, 0.6)); c.nr.n2.style.letterSpacing = lerp(36, 22, ep(lt, 2.5, 1.0)).toFixed(1) + 'px';
    // main title 4..6, rises at 8
    const tIn = ep(lt, 4.1, 0.8, E.outExpo), tUp = ep(lt, 7.9, 1.1, E.inOutCubic);
    const tMid = ep(lt, 5.8, 0.9, E.inOutCubic);
    T(c.title, 0, lerp(lerp(0, -300, tMid), -560, tUp), lerp(lerp(1, 0.86, tMid), 0.66, tUp), 0, ep(lt, 4.1, 0.3));
    c.tr.t1.style.clipPath = `inset(0 0 ${((1 - tIn) * 100).toFixed(1)}% 0)`;
    T(c.tr.t1, 0, (1 - tIn) * 50, 1);
    O(c.tr.t2, ep(lt, 4.6, 0.5)); T(c.tr.t2, 0, (1 - ep(lt, 4.6, 0.6, E.outCubic)) * 30, 1);
    [c.tr.l1, c.tr.l2].forEach(l => l.style.transform = `scaleX(${ep(lt, 4.8, 0.6, E.outExpo).toFixed(3)})`);
    // worker 6..8 at centre, then steps left inside the boiler room
    const wIn = ep(lt, 6.0, 0.9, E.outBack), wMove = ep(lt, 8.4, 1.2, E.inOutCubic);
    c.w.set({ x: lerp(540, 230, wMove), y: lerp(1640, 1420, wMove) + (1 - wIn) * 200, s: lerp(1.05, 0.9, wMove), o: ep(lt, 6.0, 0.4), helmet: 1, glasses: 1, uniform: 1, gloves: 1, boots: 1,
      blink: blinkAt(lt), tilt: Math.sin(lt * 0.7) * 2, look: wMove * 6, aL: [10, 0], aR: lt > 9.6 ? [lerp(-10, -95, ep(lt, 9.6, 0.5)), lerp(0, -10, ep(lt, 9.6, 0.5))] : [-10, 0] });
    O(c.panel, ep(lt, 8.2, 0.8));
    // additional title + agenda (boiler room)
    popIn(c.sub, lt, 8.9, { dy: 30, s0: 0.9 });
    c.agenda.forEach((a, i) => {
      const at = info.cue(a.cue) - 0.15;
      popIn(a.el, lt, at, { dx: 120, dy: 0 });
      const nx = i < 2 ? info.cue(c.agenda[i + 1].cue) - 0.15 : info.dur;
      a.el.style.borderColor = lt >= at && lt < nx ? '#ff8a1f' : 'rgba(99,179,255,0.35)';
    });
  },
};
