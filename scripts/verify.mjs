// usage: node scripts/verify.mjs <file.mp4>
import { execFileSync, spawnSync } from "node:child_process";
const f = process.argv[2] ?? "FACTUM_SHYMKENT_105SEC.mp4";
const j = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", f], { encoding: "utf8" }));
const v = j.streams.find((s) => s.codec_type === "video"), a = j.streams.find((s) => s.codec_type === "audio");
const dur = parseFloat(j.format.duration);
const [n, d] = v.r_frame_rate.split("/").map(Number);
let vol = "n/a";
vol = spawnSync("ffmpeg", ["-v", "info", "-i", f, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const mean = /mean_volume: ([-\d.]+)/.exec(vol)?.[1], max = /max_volume: ([-\d.]+)/.exec(vol)?.[1];
const checks = [
  ["resolution 1080x1920", v.width === 1080 && v.height === 1920, `${v.width}x${v.height}`],
  ["30 fps", Math.abs(n / d - 30) < 0.01, `${n / d}`],
  ["duration 105s ±0.5", Math.abs(dur - 105) <= 0.5, `${dur.toFixed(2)}s`],
  ["h264 yuv420p", v.codec_name === "h264" && v.pix_fmt === "yuv420p", `${v.codec_name} ${v.pix_fmt}`],
  ["audio stream present", !!a, a ? `${a.codec_name} ${a.sample_rate}Hz ${a.channels}ch` : "none"],
  ["audio not silent", mean !== undefined && parseFloat(mean) > -60, `mean ${mean} dB, peak ${max} dB`],
];
for (const [name, ok, info] of checks) console.log(`${ok ? "PASS" : "FAIL"}  ${name}  (${info})`);
process.exit(checks.every((c) => c[1]) ? 0 : 1);
