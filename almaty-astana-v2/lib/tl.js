/* TLX(sceneId) — scene-local narration cue helper. All times in seconds from the scene start. */
(function () {
  window.TLX = function (id) {
    const sc = TL.scenes.find(s => s.id === id);
    return { dur: sc.dur, start: sc.start,
      a: s => TL.segs[s].la, b: s => TL.segs[s].lb,                       // segment start / end
      pa: (s, k) => TL.segs[s].phr[k][0] - sc.start, pb: (s, k) => TL.segs[s].phr[k][1] - sc.start,  // phrase start / end
      // time of the n-th word (0-based) inside a phrase, by character weight
      wa(s, k, w) { const p = TL.segs[s].phr[k], ws = p[2].split(/\s+/), L = ws.map(x => x.replace(/\W/g, '').length + 1.2), tot = L.reduce((a, b) => a + b, 0); let acc = 0; for (let i = 0; i < w; i++) acc += L[i]; return p[0] - sc.start + (p[1] - p[0]) * acc / tot; } };
  };
})();
