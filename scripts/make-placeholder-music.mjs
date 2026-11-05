// Generates a SYNTHETIC ambient drone (A-minor pad) with FFmpeg so the mix/ducking can be tested.
// It is a placeholder, NOT the final cinematic score. Replace with a licensed track in audio/music/.
import { execFileSync } from "node:child_process";
import path from "node:path";
const out = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../audio/music/placeholder_ambient_drone.wav");
const D = 110;
const notes = [[55, 0.5], [82.41, 0.35], [110, 0.3], [130.81, 0.22], [164.81, 0.18], [220, 0.1]];
const inputs = notes.flatMap(([f]) => ["-f", "lavfi", "-i", `sine=frequency=${f}:duration=${D}:sample_rate=48000`]);
const trem = notes.map(([f, g], i) => `[${i}]volume=${g},tremolo=f=${(0.1 + i * 0.037).toFixed(3)}:d=0.45[a${i}]`).join(";");
const mix = notes.map((_, i) => `[a${i}]`).join("") + `amix=inputs=${notes.length}:normalize=0,lowpass=f=900,aecho=0.8:0.7:420|770:0.45|0.3,volume=1.6,afade=t=in:d=3,afade=t=out:st=${D - 5}:d=5,alimiter=limit=0.8[o]`;
execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", `${trem};${mix}`, "-map", "[o]", "-ac", "2", "-ar", "48000", out], { stdio: "inherit" });
console.log("wrote", out);
