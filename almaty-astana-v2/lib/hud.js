/* HUD — mini-map card + coordinate ticker shared by city scenes. */
(function () {
  function miniMap(host, city) {
    const M = window.MAP, dot = city === 'almaty' ? M.almaty : M.astana, other = city === 'almaty' ? M.astana : M.almaty;
    host.innerHTML = `<svg viewBox="0 0 1080 1500" width="190" height="264" style="overflow:visible">
      <path d="${M.kz}" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.7)" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="${other[0]}" cy="${other[1]}" r="16" fill="rgba(255,255,255,.4)"/>
      <circle class="mm-pulse" cx="${dot[0]}" cy="${dot[1]}" r="30" fill="none" stroke="var(--accent)" stroke-width="8"/>
      <circle cx="${dot[0]}" cy="${dot[1]}" r="26" fill="var(--accent)"/></svg>`;
    return host.querySelector('.mm-pulse');
  }
  window.HUD = { miniMap };
})();
