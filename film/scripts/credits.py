"""Write deliverables/CREDITS.md from the shots actually used (with licenses)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shots import resolve
SHOTS = resolve()

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
src = json.load(open("build/sources.json"))
used = json.load(open("build/used_sources.json")) if os.path.exists("build/used_sources.json") else {}

def locate(name):
    return any(os.path.exists(f"{d}/{name}") for d in ("media/raw", "media/mixkit", "media/nasa"))

ARCH_IDS = {s["id"] for s in SHOTS if s.get("archival")}
rows = []
for s in SHOTS:
    if s["kind"] != "video": continue
    name = used.get(s["id"], s["src"])
    info = src.get(name, {})
    rows.append((s["id"], name, info))

sa = sorted({i.get("lic", "") for _, _, i in rows if "BY-SA" in i.get("lic", "")})
out = ["# «АТАНЫҢ АМАНАТЫ» — credits and licenses", "",
       "Short film for the 35th anniversary of the Independence of the Republic of Kazakhstan (16 December 2026).", "",
       "## Footage", "", "| Shot | Source | Author | License |", "|---|---|---|---|"]
for sid, name, i in rows:
    out.append(f"| {sid} | [{i.get('title', name)}]({i.get('url', '')}) | {i.get('artist', '')} | {i.get('lic', '')} |")
out += ["", "## Music", "",
        f"- «{src['mm_594.mp3']['title']}» — {src['mm_594.mp3']['artist']} ({src['mm_594.mp3']['lic']}), edited to picture.",
        "- Dombra phrases and the low string drone are synthesised for this film (Karplus–Strong strings / additive pad).", "",
        "## Voice", "",
        "- Kazakh narration and dialogue: Microsoft Azure neural text-to-speech, voices kk-KZ-DauletNeural (Ata) and kk-KZ-AigulNeural",
        "  pitch/formant-shifted for the grandson. No human voice actor was recorded.", "",
        "## Sound effects", "",
        "- Wind, snow footsteps, room tone, clock, transitions and impacts are synthesised for this film.", "",
        "## Animation, graphics and fonts", "",
        "- Grandfather/grandson silhouettes, the Kazakh home interior, the dawn steppe, the waving flag and all titles are original",
        "  HyperFrames animation. The State Flag is drawn from the public-domain SVG on Wikimedia Commons (File:Flag_of_Kazakhstan.svg).",
        "- Fonts: Noto Serif Display, Montserrat (SIL Open Font License).", "",
        "## Historical accuracy notes", "",
        *([ "- Footage marked «МҰРАҒАТТЫҚ КАДР» is genuine archival material." ] if any(i.get("lic") and r[0] in ARCH_IDS for r in rows for i in [r[2]]) else [
          "- This cut contains NO archival footage. The intended archival sources (Soviet-era film of akyn Jambyl Jabayev from the",
          "  Zhambyl museum archive, and the 19 May 1992 White House visit, both on Wikimedia Commons) could not be downloaded",
          "  because Wikimedia rate-limited the production machine. Their places are taken by clearly labelled illustrative shots",
          "  («ИЛЛЮСТРАЦИЯЛЫҚ КАДР»), an animated close-up of Ata, and a factual graphic (Kazakhstan's UN membership, 2 March 1992)."]),
        "- Shots marked «ИЛЛЮСТРАЦИЯЛЫҚ КАДР» are modern stock footage and are NOT footage of historical events. No authentic,",
        "  freely licensed moving images of the December 1986 events were available, so that sequence uses typography and",
        "  illustrative snowfall only.",
        "- The current State Flag was adopted on 4 June 1992; it is therefore not shown in the 16 December 1991 sequence.",
        "- The tenge was introduced on 15 November 1993.", ""]
if sa:
    out += ["## License of this film", "",
            f"Some footage is licensed {', '.join(sa)} (ShareAlike). The finished film is an adaptation of that material and must be",
            "shared under CC BY-SA 4.0 with the attributions above (e.g. in the post description).", ""]
open("../deliverables/CREDITS.md", "w", encoding="utf-8").write("\n".join(out))
print("wrote CREDITS.md;", len(rows), "footage shots")
