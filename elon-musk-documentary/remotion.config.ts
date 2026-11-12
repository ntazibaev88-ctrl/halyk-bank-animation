import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setBrowserExecutable('/opt/pw-browsers/chromium');
Config.setConcurrency(3);
