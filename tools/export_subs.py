#!/usr/bin/env python3
"""Exports data/timing.json -> subtitles/pte.srt, subtitles/pte.vtt and voiceover/SCRIPT.md"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(f"{ROOT}/data/timing.json")); S = json.load(open(f"{ROOT}/voiceover/script.json", encoding="utf-8"))
os.makedirs(f"{ROOT}/subtitles", exist_ok=True)
def ts(x, sep):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f"{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)):03d}"
srt, vtt = [], ["WEBVTT\n"]
for i, c in enumerate(T["cues"], 1):
    txt = " ".join(w["t"] for w in c["words"])
    srt.append(f"{i}\n{ts(c['start'], ',')} --> {ts(c['end'], ',')}\n{txt}\n")
    vtt.append(f"{ts(c['start'], '.')} --> {ts(c['end'], '.')}\n{txt}\n")
open(f"{ROOT}/subtitles/pte.srt", "w", encoding="utf-8").write("\n".join(srt))
open(f"{ROOT}/subtitles/pte.vtt", "w", encoding="utf-8").write("\n".join(vtt))
sc = {s["id"]: s for s in T["scenes"]}
md = ["# Сценарий дикторского текста (диктор: мужской, глубокий, уверенный)\n",
      "Тайм-коды рассчитываются автоматически (`tools/timing.py`) по фактической длительности озвучки.\n"]
for s in S["scenes"]:
    t0 = sc[s["id"]]["start"]; t1 = t0 + sc[s["id"]]["dur"]
    md.append(f"## Сцена {s['id']} — {s['title']} ({t0:.1f}–{t1:.1f} c)\n")
    md.append(" ".join(s["sentences"]) + "\n")
open(f"{ROOT}/voiceover/SCRIPT.md", "w", encoding="utf-8").write("\n".join(md))
print("exported", len(T["cues"]), "cues")
