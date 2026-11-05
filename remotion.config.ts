import { Config } from "@remotion/cli/config";
import fs from "node:fs";
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
// Use the pre-installed headless Chromium if present (no download needed).
const shell = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (process.env.CHROME_PATH || fs.existsSync(shell)) Config.setBrowserExecutable(process.env.CHROME_PATH ?? shell);
