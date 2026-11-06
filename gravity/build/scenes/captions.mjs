import fs from "node:fs";
import { sceneFile, words } from "../components.mjs";
// Subtitles: one host holds every caption group; word timings come from the TTS alignment.
const SKIP = new Set(["1-0", "7-3"]); // spoken title and final question are already on screen as type
export default () => {
  const lines = JSON.parse(fs.readFileSync(new URL("../../audio-src/timing.json", import.meta.url), "utf8"));
  const groups = [];
  lines.forEach((L, li) => {
    if (SKIP.has(`${L.scene}-${L.i}`)) return;
    const ws = words(L.text);
    if (ws.length !== L.words.length) throw new Error("word mismatch " + L.text);
    const tws = ws.map((w, k) => ({ ...w, s: L.words[k].s, e: L.words[k].e }));
    const len = (arr) => arr.reduce((a, c) => a + c.w.length + 1, -1);
    // phrases split at punctuation
    const phrases = []; let cur = [];
    tws.forEach((w, k) => { cur.push(w); if (/[,:;.?!—]$/.test(w.w) && k < tws.length - 1) { phrases.push(cur); cur = []; } });
    if (cur.length) phrases.push(cur);
    // long phrases split into balanced parts
    const parts = [];
    for (const ph of phrases) {
      const n = Math.ceil(len(ph) / 44);
      if (n <= 1) { parts.push(ph); continue; }
      const target = len(ph) / n; let acc = [];
      ph.forEach((w) => { if (acc.length && len([...acc, w]) > target + 6 && parts.length < 99) { parts.push(acc); acc = []; } acc.push(w); });
      parts.push(acc);
    }
    // merge short neighbours
    const merged = [];
    for (const p of parts) {
      const last = merged[merged.length - 1];
      if (last && (len(p) < 12 || len(last) < 12) && len([...last, ...p]) <= 46) merged[merged.length - 1] = [...last, ...p];
      else merged.push(p);
    }
    merged.forEach((p) => groups.push({ li, ws: p }));
  });
  // window for each group: first word − 0.08 → next group start (same line) or line end + 0.4
  groups.forEach((g, i) => {
    g.start = Math.max(0.1, g.ws[0].s - 0.08);
    const L = lines[g.li], nx = groups[i + 1];
    const lineEnd = L.words[L.words.length - 1].e;
    let end = (nx && nx.li === g.li) ? nx.ws[0].s - 0.08 : lineEnd + 0.45;
    if (nx) end = Math.min(end, nx.ws[0].s - 0.08);
    g.end = end;
  });
  const body = groups.map((g, i) => `<div class="cap" id="cap${i}"><div class="cap-in${g.ws.reduce((a, c) => a + c.w.length + 1, -1) > 34 ? " long" : ""}">${g.ws.map((w, k) => `<span class="cw${w.hi ? " hi" : ""}" id="cap${i}-${k}">${w.w}</span>`).join(" ")}</div></div>`).join("\n");
  const css = `
#root{background:transparent !important;pointer-events:none}
.cap{position:absolute;left:100px;right:100px;bottom:600px;text-align:center;opacity:0;}
.cap-in{display:inline-block;font-family:"Mont",sans-serif;font-weight:800;font-size:62px;line-height:1.14;color:#fff;letter-spacing:.005em;
  text-shadow:0 3px 0 rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.75),0 6px 26px rgba(0,0,0,.6);}
.cap-in.long{font-size:56px;}
.cw{display:inline-block;}
.cw.hi{color:#ff8f3f;text-shadow:0 3px 0 rgba(60,20,0,.6),0 0 22px rgba(255,110,30,.45),0 6px 26px rgba(0,0,0,.6);}`;
  const js = groups.map((g, i) => {
    let s = `tl.set("#cap${i}",{opacity:1,visibility:"visible"},${g.start.toFixed(3)});\n`;
    g.ws.forEach((w, k) => { s += `tl.fromTo("#cap${i}-${k}",{opacity:0,y:14,filter:"blur(6px)"},{opacity:1,y:0,filter:"blur(0px)",duration:.14,ease:"power2.out"},${Math.max(g.start, w.s - 0.04).toFixed(3)});\n`; });
    s += `tl.to("#cap${i}",{opacity:0,duration:.12,ease:"power2.in"},${(g.end - 0.12).toFixed(3)});\ntl.set("#cap${i}",{opacity:0,visibility:"hidden"},${g.end.toFixed(3)});`;
    return s;
  }).join("\n");
  fs.writeFileSync(new URL("../../captions-groups.json", import.meta.url), JSON.stringify(groups.map((g) => ({ start: +g.start.toFixed(2), end: +g.end.toFixed(2), text: g.ws.map((w) => w.w).join(" ") })), null, 1));
  return { id: "captions", dur: 90, file: sceneFile({ id: "captions", dur: 90, css, body, js }) };
};
