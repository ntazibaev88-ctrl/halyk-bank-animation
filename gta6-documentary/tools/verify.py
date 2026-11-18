"""Automated QC of the exported MP4 (+ subtitle/timeline consistency).

Checks: duration, resolution, fps, frame count, codecs, black frames, frozen
frames, loudness / true peak, subtitle cue lengths and overlaps, shot lengths.
Writes deliverables/QC_report.md and exits non-zero on a hard failure.
"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
path = sys.argv[1]
tl = json.load(open(os.path.join(ROOT, "build", "timeline.json")))
comp = json.load(open(os.path.join(ROOT, "build", "compose_report.json")))
res, fails = [], []


def check(name, ok, detail, hard=True):
    res.append((name, "PASS" if ok else ("FAIL" if hard else "WARN"), detail))
    if not ok and hard:
        fails.append(name)


pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", path],
                               capture_output=True, text=True, check=True).stdout)
v = next(s for s in pr["streams"] if s["codec_type"] == "video")
a = next((s for s in pr["streams"] if s["codec_type"] == "audio"), None)
dur = float(pr["format"]["duration"])
check("Duration", abs(dur - 80.0) <= 0.05, f"{dur:.3f} s")
check("Resolution", (v["width"], v["height"]) == (2160, 3840), f"{v['width']}x{v['height']}")
check("Frame rate", v["r_frame_rate"] == "30/1" and v["avg_frame_rate"] == "30/1", f"r={v['r_frame_rate']} avg={v['avg_frame_rate']}")
check("Frame count", int(v["nb_read_frames"]) == 2400, f"{v['nb_read_frames']} frames")
check("Video codec", v["codec_name"] in ("h264", "hevc"), f"{v['codec_name']} {v.get('profile')} L{v.get('level')} {v['pix_fmt']}")
br = int(pr["format"]["bit_rate"]) / 1e6
check("Bitrate", br >= 15, f"{br:.1f} Mb/s overall", hard=False)
check("Audio", a is not None and a["codec_name"] == "aac" and a["sample_rate"] == "48000",
      f"{a['codec_name']} {a['sample_rate']} Hz {a.get('channels')} ch {int(a.get('bit_rate', 0)) // 1000} kb/s" if a else "missing")

err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-vf", "scale=540:-2,blackdetect=d=0.1:pix_th=0.06:pic_th=0.98,freezedetect=n=0.0005:d=1.0",
                      "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)
check("Black frames", not blacks, "none" if not blacks else ", ".join(f"{s}-{e}s" for s, e in blacks))
freezes = re.findall(r"freeze_start: ([\d.]+)", err)
check("Frozen frames (>1 s static)", not freezes, "none" if not freezes else ", ".join(freezes))
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])
TP = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", err)[-1])
check("Loudness", -15.0 <= I <= -13.0, f"{I} LUFS integrated (target -14)")
check("True peak / clipping", TP <= -1.0, f"{TP} dBTP")

subs = tl["subtitles"]
bad_len = [c for c in subs if c["end"] - c["start"] < 0.5]
overl = [i for i in range(len(subs) - 1) if subs[i]["end"] > subs[i + 1]["start"]]
check("Subtitle cues", not overl and len(subs) > 0, f"{len(subs)} cues, max 2 lines, overlaps: {len(overl)}")
check("Subtitle min duration", not bad_len, f"shortest {min(c['end'] - c['start'] for c in subs):.2f} s", hard=False)
check("Subtitle max lines", all(len(c["lines"]) <= 2 for c in subs), "≤ 2 lines per cue")
shots = tl["shots"]
check("Shot count", 25 <= len(shots) <= 35, f"{len(shots)} shots, avg {80 / len(shots):.2f} s, "
      f"min {min(s['dur'] for s in shots):.2f} s, max {max(s['dur'] for s in shots):.2f} s")
check("Narration fits", tl["words"][-1]["end"] <= 79.0, f"last word ends {tl['words'][-1]['end']:.2f} s")
miss = comp["missing_footage"]
check("GTA VI footage present", not miss, "all slots filled" if not miss else
      f"{len(miss)}/{len(shots)} slots are ANIMATIC slates (no official footage supplied)", hard=False)

with open(os.path.join(ROOT, "deliverables", "QC_report.md"), "w") as f:
    f.write(f"# QC report — {os.path.basename(path)}\n\n| Check | Result | Detail |\n|---|---|---|\n")
    for n, r, d in res:
        f.write(f"| {n} | {r} | {d} |\n")
for n, r, d in res:
    print(f"{r:4s}  {n}: {d}")
sys.exit(1 if fails else 0)
