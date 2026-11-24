// Film runtime: drives every shot, transition, label, subtitle and overlay from one clock.
(function (global) {
  const { clamp, lerp, ease, smooth, hash } = global.SCENES;
  const DATA = global.FILM_DATA; // { shots, cues, duration }
  const $ = id => document.getElementById(id);
  const state = { interior: null, dawn: null, gfx: {} };

  function init() {
    state.interior = global.SCENES.buildInterior($('interior'));
    state.dawn = global.SCENES.buildDawn($('dawn'));
    for (const s of DATA.shots) {
      if ((s.kind === 'gfx' || s.kind === 'endcard') && $(s.id)) {
        const host = $(s.id);
        state.gfx[s.id] = global.GFX[s.gfx].build(host);
      }
    }
    // subtitle DOM (one node per cue, gold keywords)
    const sub = $('subs');
    for (const [i, c] of DATA.cues.entries()) {
      const d = document.createElement('div');
      d.className = 'cue' + (c.who === 'grandson' ? ' child' : '');
      d.id = 'cue' + i;
      d.innerHTML = c.words.map(w => w.gold ? `<span class="g">${w.t}</span>` : w.t).join(' ');
      sub.appendChild(d);
    }
  }

  // Opacity of a shot at film time t, given its in/out transitions.
  function shotAlpha(s, t) {
    const inD = s.in && s.in.type === 'dissolve' ? s.in.dur : 0;
    const a = inD > 0 ? smooth(clamp((t - s.start) / inD)) : (t >= s.start ? 1 : 0);
    const visEnd = s.end + (s.tail || 0);
    return t < s.start || t >= visEnd ? 0 : a;
  }

  function camera(s, t) {
    const m = s.move || { from: [1, 0, 0], to: [1, 0, 0] };
    const k = (m.ease === 'linear' ? clamp : (x => ease(clamp(x))))((t - s.start) / Math.max(0.01, (s.end + (s.tail || 0)) - s.start));
    const z = lerp(m.from[0], m.to[0], k), x = lerp(m.from[1], m.to[1], k), y = lerp(m.from[2], m.to[2], k);
    // natural handheld micro-motion (deterministic)
    const hh = s.handheld ?? 0.6;
    const jx = (Math.sin(t * 0.9 + s.seed) * 6 + Math.sin(t * 2.3 + s.seed * 2) * 2.5) * hh;
    const jy = (Math.sin(t * 0.7 + s.seed * 3) * 5 + Math.sin(t * 1.9 + s.seed) * 2) * hh;
    const r = Math.sin(t * 0.5 + s.seed) * 0.08 * hh;
    return `translate(${(x + jx).toFixed(2)}px, ${(y + jy).toFixed(2)}px) scale(${z.toFixed(5)}) rotate(${r.toFixed(3)}deg)`;
  }

  // Free 4K canvas backing stores while a host is hidden (keeps each render worker small).
  function setCanvases(host, on) {
    if (host.dataset.cv === (on ? '1' : '0')) return;
    host.dataset.cv = on ? '1' : '0';
    host.querySelectorAll('canvas').forEach(c => {
      if (on) { c.width = 2160; c.height = 3840; } else { c.width = 1; c.height = 1; }
    });
  }

  function render(t) {
    let interiorShot = null, dawnShot = null, labelText = '', labelA = 0;
    for (const s of DATA.shots) {
      const a = shotAlpha(s, t);
      const host = $(s.id);
      if (!host && s.kind !== 'interior' && s.kind !== 'dawn') continue;
      if (s.kind === 'interior') { if (a > 0) interiorShot = { s, a }; continue; }
      if (s.kind === 'dawn') { if (a > 0) dawnShot = { s, a }; continue; }
      if (s.kind === 'endcard') {
        if (t >= s.start) { host.style.display = 'block'; host.style.opacity = 1; setCanvases(host, true); global.GFX[s.gfx].draw(state.gfx[s.id], t - s.start, s.end - s.start, t); }
        else host.style.display = 'none';
        continue;
      }
      if (a <= 0) { host.style.display = 'none'; if (s.kind === 'gfx') setCanvases(host, false); continue; }
      host.style.display = 'block';
      if (s.kind === 'gfx') setCanvases(host, true);
      host.style.opacity = a.toFixed(4);
      if (s.kind === 'video') {
        host.style.transform = camera(s, t);
      } else if (s.kind === 'gfx') {
        global.GFX[s.gfx].draw(state.gfx[s.id], t - s.start, s.end - s.start, t);
      }
      if (s.label && t < s.end) { labelText = s.label; labelA = Math.max(labelA, a * clamp((t - s.start - 0.4) / 0.6) * clamp((s.end - t) / 0.4)); }
    }
    // shared animated scenes
    for (const [key, shot, draw] of [['interior', interiorShot, global.SCENES.drawInterior], ['dawn', dawnShot, global.SCENES.drawDawn]]) {
      const host = $(key);
      if (!shot) { host.style.display = 'none'; setCanvases(host, false); continue; }
      host.style.display = 'block'; host.style.opacity = shot.a.toFixed(4); setCanvases(host, true);
      host.style.zIndex = shot.s.z;
      const p = Object.assign({}, shot.s.p, { t: t - shot.s.start, dur: shot.s.end + (shot.s.tail || 0) - shot.s.start });
      draw(state[key], t, p);
      if (shot.s.label) { labelText = shot.s.label; labelA = Math.max(labelA, shot.a * clamp((t - shot.s.start - 0.4) / 0.6) * clamp((shot.s.end - t) / 0.4)); }
    }
    // label (source / honesty tag)
    const lab = $('label');
    if (labelA > 0.01) { lab.style.display = 'block'; lab.style.opacity = labelA.toFixed(3); if (lab.dataset.txt !== labelText) { lab.dataset.txt = labelText; lab.lastElementChild.textContent = labelText; } }
    else lab.style.display = 'none';
    // subtitles
    DATA.cues.forEach((c, i) => {
      const e = $('cue' + i);
      if (t < c.start - 0.01 || t > c.end) { e.style.display = 'none'; return; }
      e.style.display = 'block';
      const k = smooth(clamp((t - c.start) / 0.18)) * smooth(clamp((c.end - t) / 0.18));
      e.style.opacity = k.toFixed(3);
      e.style.transform = `translateY(${((1 - smooth(clamp((t - c.start) / 0.25))) * 18).toFixed(1)}px)`;
    });
    // global fades: from black at the head, dips listed in DATA.dips
    let black = 1 - smooth(clamp(t / 1.6));
    for (const d of DATA.dips) {
      const k = 1 - clamp(Math.abs(t - d.at) / d.half);
      if (k > 0) black = Math.max(black, d.type === 'black' ? smooth(k) : 0);
    }
    $('fadeblack').style.opacity = black.toFixed(4);
    let flash = 0;
    for (const d of DATA.dips) if (d.type === 'white') { const k = 1 - clamp(Math.abs(t - d.at) / d.half); flash = Math.max(flash, smooth(k)); }
    $('flash').style.opacity = (flash * 0.9).toFixed(4);
    // film grain: switch tile every frame (24 variations of offset)
    const f = Math.floor(t * 30);
    const g = $('grain');
    g.style.backgroundPosition = `${Math.floor(hash(f) * 512)}px ${Math.floor(hash(f + 7) * 512)}px`;
    g.style.backgroundImage = `url(assets/img/grain${f % 4}.png)`;
  }

  global.FILM = { init, render };
})(window);
