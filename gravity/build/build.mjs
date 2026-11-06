import fs from "node:fs";
const only = process.argv[2];
const names = only ? [only] : fs.readFileSync(new URL("./scenes.txt", import.meta.url), "utf8").split(/\s+/).filter(Boolean);
for (const n of names) {
  const mod = await import(`./scenes/${n}.mjs?${Date.now()}`);
  const s = await mod.default();
  fs.writeFileSync(`compositions/${s.id}.html`, s.file);
  console.log("wrote", s.id);
}
