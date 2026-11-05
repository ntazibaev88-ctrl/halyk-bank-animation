// Reads data/timeline.json + scans footage/ and audio/ -> src/generated/project.json
// Usage: node scripts/build-project.mjs [--report]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const T = JSON.parse(fs.readFileSync(path.join(ROOT, "data/timeline.json"), "utf8"));
const FPS = T.fps;
const pad = (n) => String(n).padStart(2, "0");
const VIDEO_EXT = [".mp4", ".mov", ".webm", ".mkv"];
const AUDIO_EXT = [".wav", ".mp3", ".m4a", ".aac", ".ogg"];

const ls = (d) => (fs.existsSync(d) ? fs.readdirSync(d) : []);
const probe = (file) => {
  try {
    const o = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=width,height", "-of", "json", file], { encoding: "utf8" });
    const j = JSON.parse(o);
    const v = (j.streams || []).find((s) => s.width);
    return { duration: parseFloat(j.format.duration), width: v?.width, height: v?.height };
  } catch { return null; }
};

// ---------- subtitle chunking ----------
const MAX_LINE = 21; // chars per line @ 66px Montserrat ExtraBold inside 880px
const norm = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
function chunkNarration(text, highlight) {
  const hl = new Set(highlight.map(norm));
  const words = text.split(/\s+/).map((raw) => ({ raw, t: raw, hl: hl.has(norm(raw)) }));
  // greedy lines
  const lines = []; let cur = [];
  const len = (ws) => ws.map((w) => w.raw).join(" ").length;
  for (const w of words) {
    if (cur.length && len([...cur, w]) > MAX_LINE) { lines.push(cur); cur = []; }
    cur.push(w);
    if (/[.!?…]$/.test(w.raw)) { lines.push(cur); cur = []; } // sentence end forces a line end
  }
  if (cur.length) lines.push(cur);
  // pair lines into cues (max 2 lines); never merge across a sentence end
  const cues = [];
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i]; const b = lines[i + 1];
    const aEnds = /[.!?…]$/.test(a[a.length - 1].raw);
    if (b && !aEnds) { cues.push([a, b]); i++; } else cues.push([a]);
  }
  return cues;
}
const weightOf = (cue) => {
  let w = 0;
  for (const line of cue) for (const x of line) {
    w += x.raw.length + 1;
    if (/[.!?…]$/.test(x.raw)) w += 7; else if (/[,;:—–]$/.test(x.raw)) w += 3;
  }
  return w;
};

// ---------- scenes ----------
const warnings = [];
const music = ls(path.join(ROOT, "audio/music")).filter((f) => AUDIO_EXT.includes(path.extname(f).toLowerCase())).sort()[0];
const scenes = [];
let shotCount = 0, graphicCount = 0;
for (const s of T.scenes) {
  const startF = Math.round(s.start * FPS), endF = Math.round(s.end * FPS);
  const dur = endF - startF;
  // shots
  let acc = startF; const shots = [];
  s.shots.forEach((sh, i) => {
    const id = `s${pad(s.id)}_${pad(i + 1)}`;
    const isLast = i === s.shots.length - 1;
    const from = acc; const to = isLast ? endF : Math.round(startF + s.shots.slice(0, i + 1).reduce((a, x) => a + x.sec, 0) * FPS);
    acc = to;
    let file = null, info = null;
    if (sh.kind === "footage") {
      const f = ls(path.join(ROOT, "footage")).find((n) => n.startsWith(id) && VIDEO_EXT.includes(path.extname(n).toLowerCase()));
      if (f) { file = `footage/${f}`; info = probe(path.join(ROOT, file)); }
      const need = (to - from) / FPS + T.transitionSec + 0.5;
      if (info && info.duration < need) warnings.push(`${id}: clip is ${info.duration.toFixed(1)}s, needs >= ${need.toFixed(1)}s`);
      if (info && info.width && info.height && Math.min(info.width, info.height) < 1080) warnings.push(`${id}: low resolution ${info.width}x${info.height} (want >=1080 short side)`);
      shotCount++;
    } else graphicCount++;
    shots.push({ id, from, to, kind: sh.kind, graphic: sh.graphic ?? null, cam: sh.cam ?? null, desc: sh.desc, file, info });
  });
  // voice-over
  const voFile = ls(path.join(ROOT, "audio/vo")).find((n) => n.startsWith(`scene_${pad(s.id)}`) && AUDIO_EXT.includes(path.extname(n).toLowerCase()));
  const voInfo = voFile ? probe(path.join(ROOT, "audio/vo", voFile)) : null;
  const voStart = startF + Math.round(T.voLeadSec * FPS);
  const voDurSec = voInfo ? voInfo.duration : (dur - Math.round(T.voLeadSec * FPS) - Math.round(0.55 * FPS)) / FPS; // estimated if no VO
  if (voInfo && voStart + voDurSec * FPS > endF + 3) warnings.push(`scene ${s.id}: VO is ${voInfo.duration.toFixed(1)}s, overruns scene window by ${(voStart / FPS + voInfo.duration - s.end).toFixed(1)}s — trim the VO or extend the scene`);
  const cps = s.narration.length / voDurSec;
  if (cps > 18) warnings.push(`scene ${s.id}: narration density ${cps.toFixed(1)} chars/s is too fast for a calm voice`);
  // cues (optional ASR/hand-timed override: audio/vo/scene_XX.cues.json = [{start,end}] seconds relative to VO start, same chunk order)
  const chunks = chunkNarration(s.narration, s.highlight);
  const total = chunks.reduce((a, c) => a + weightOf(c), 0);
  let override = null;
  const ovPath = path.join(ROOT, "audio/vo", `scene_${pad(s.id)}.cues.json`);
  if (fs.existsSync(ovPath)) override = JSON.parse(fs.readFileSync(ovPath, "utf8"));
  if (override && override.length !== chunks.length) { warnings.push(`scene ${s.id}: cues.json has ${override.length} cues but text chunks into ${chunks.length}; ignoring override`); override = null; }
  let cum = 0; const cues = [];
  chunks.forEach((c, i) => {
    const w = weightOf(c);
    let a = voStart + Math.round((cum / total) * voDurSec * FPS);
    let b = voStart + Math.round(((cum + w) / total) * voDurSec * FPS);
    if (override) { a = voStart + Math.round(override[i].start * FPS); b = voStart + Math.round(override[i].end * FPS); }
    cum += w;
    cues.push({ from: a, to: b, lines: c.map((l) => l.map((x) => ({ t: x.raw, hl: x.hl }))) });
  });
  // no overlaps, bridge tiny gaps, tail hold
  for (let i = 0; i < cues.length; i++) {
    const nxt = cues[i + 1];
    if (nxt) { if (nxt.from - cues[i].to < Math.round(0.5 * FPS)) cues[i].to = nxt.from - 1; else cues[i].to += 4; if (cues[i].to >= nxt.from) cues[i].to = nxt.from - 1; }
    else cues[i].to = Math.min(cues[i].to + 6, endF - 1);
    if (cues[i].to <= cues[i].from + 6) cues[i].to = cues[i].from + 7;
  }
  scenes.push({ id: s.id, slug: s.slug, name: s.name, from: startF, to: endF, title: s.title, narration: s.narration, sfx: s.sfx,
    vo: voFile ? { file: `audio/vo/${voFile}`, from: voStart, durationSec: voInfo?.duration ?? null } : null,
    shots, cues, density: +cps.toFixed(1) });
}
const totalFrames = Math.round(T.scenes.at(-1).end * FPS);
const project = {
  title: T.title, channel: T.channel, fps: FPS, width: T.width, height: T.height, durationInFrames: totalFrames,
  transitionFrames: Math.round(T.transitionSec * FPS),
  music: music ? { file: `audio/music/${music}`, placeholder: /placeholder/i.test(music) } : null,
  scenes,
  stats: {
    footageSlots: shotCount, footageFilled: scenes.flatMap((s) => s.shots).filter((x) => x.kind === "footage" && x.file).length,
    graphicShots: graphicCount, voFilled: scenes.filter((s) => s.vo).length,
  },
};
fs.mkdirSync(path.join(ROOT, "src/generated"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src/generated/project.json"), JSON.stringify(project, null, 2));

// ---------- overlap check ----------
const all = scenes.flatMap((s) => s.cues);
for (let i = 1; i < all.length; i++) if (all[i].from <= all[i - 1].to) warnings.push(`subtitle overlap at cue ${i}`);

// ---------- checklist ----------
const fmt = (f) => { const s = f / FPS; return `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`; };
let md = `# FACTUM · Шымкент — чек-лист ассетов\n\n_Сгенерировано \`npm run check\`. Не редактировать вручную._\n\n`;
md += `**Футаж:** ${project.stats.footageFilled}/${project.stats.footageSlots} · **Закадровый голос:** ${project.stats.voFilled}/10 сцен · **Музыка:** ${music ? (project.music.placeholder ? "только синтетический placeholder" : "есть") : "нет"}\n\n`;
md += `## Видеофутаж → \`footage/\`\n\nИмя файла **обязано начинаться с ID кадра** (например \`s03_02_shymqala_towers.mp4\`). Вертикаль 9:16 или горизонт 4K (будет кадрироваться). Длина ≥ длительность кадра + ${(T.transitionSec + 0.5).toFixed(1)} с запаса. Без водяных знаков.\n\n| ID | Время | Сек | Статус | Что нужно снять / найти |\n|---|---|---|---|---|\n`;
for (const s of scenes) for (const sh of s.shots) {
  if (sh.kind !== "footage") continue;
  md += `| \`${sh.id}\` | ${fmt(sh.from)}–${fmt(sh.to)} | ${((sh.to - sh.from) / FPS).toFixed(1)} | ${sh.file ? "✅ " + path.basename(sh.file) : "❌ нет"} | ${sh.desc} _(камера: ${sh.cam})_ |\n`;
}
md += `\n## Генерируемые кадры (графика, футаж не нужен)\n\n`;
for (const s of scenes) for (const sh of s.shots) if (sh.kind === "graphic") md += `- \`${sh.id}\` ${fmt(sh.from)}–${fmt(sh.to)} — ${sh.desc}\n`;
md += `\n## Закадровый голос → \`audio/vo/\`\n\nФайлы \`scene_01.wav\` … \`scene_10.wav\` (или mp3/m4a), 48 kHz, голос стартует с начала файла; в видео он ставится на +${T.voLeadSec} с от начала сцены. Субтитры сами растянутся по реальной длительности файла.\n\n| Файл | Окно сцены | Длина реплики | Статус | Текст |\n|---|---|---|---|---|\n`;
for (const s of scenes) md += `| \`scene_${pad(s.id)}\` | ${((s.to - s.from) / FPS).toFixed(0)} с | ~${(s.narration.length / s.density).toFixed(1)} с (оценка) | ${s.vo ? "✅" : "❌ нет"} | ${s.narration} |\n`;
md += `\n## Музыка → \`audio/music/\`\n\nОдин кинематографичный трек ≥ 105 с, без вокала, лицензия для коммерческого использования (TikTok/Reels). Сейчас: ${music ?? "нет"}.\n`;
fs.writeFileSync(path.join(ROOT, "ASSETS_CHECKLIST.md"), md);

if (process.argv.includes("--report") || warnings.length) {
  console.log(`Scenes: ${scenes.length} | frames: ${totalFrames} (${totalFrames / FPS}s) | cues: ${all.length}`);
  console.log(`Footage ${project.stats.footageFilled}/${project.stats.footageSlots} | graphics ${graphicCount} | VO ${project.stats.voFilled}/10 | music ${music ?? "none"}`);
  scenes.forEach((s) => console.log(`  scene ${pad(s.id)} density ${s.density} chars/s, ${s.cues.length} cues, ${s.shots.length} shots`));
  warnings.forEach((w) => console.log("WARN", w));
}
