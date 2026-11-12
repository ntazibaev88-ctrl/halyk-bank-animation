"""Builds src/timeline.json from the voiceover timings + the shot plan below, and lists the
per-shot preparation jobs (crop to 2:3, grade, trim) consumed by prep_shots.py.

Timing rules: scenes are driven by the narration (never the other way round). Each scene's length
= its sentences + natural pauses; the shots inside are distributed by weight over that length.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
vo = json.load(open(os.path.join(ROOT, "scripts/vo_timings.json"), encoding="utf-8"))

LEAD_IN = 0.55          # silence before the very first word (hook impact lands first)
GAP = 0.28              # pause between sentences inside a scene
SCENE_HEAD = 0.32       # breath after a scene cut before the next scene's first word
SCENE_TAIL = 0.38       # hold after the last word of a scene
END_CARD = 6.2          # final statement + CTA after the last sentence

NASA = "NASA"
T_TESLA = "TESLA MODEL X · NASA · 2020"

# --------------------------------------------------------------------------------------------- shots
# seg: footage/seg/<key>.mp4 | gfx:<mode>;  in: offset (s) into segment; fx: horizontal centre of the
# 2:3 crop (0..1); w: relative duration weight; tr: entrance transition; z: zoom from/to; p: pan px
PLAN = {
    "hook": [
        dict(seg="tour_talk", inn=7.3, fx=0.31, w=2.0, tr="cut", z=(1.24, 1.12), p=(-30, 20), tag="SPACEX · NASA · 2019"),
        dict(seg="fh_hs", inn=7.2, fx=0.50, w=1.5, tr="flash", z=(1.05, 1.18), p=(0, 0), rumble=True),
        dict(seg="convoy_side", inn=3.2, fx=0.50, w=1.35, tr="whip", z=(1.1, 1.18), p=(60, -60), tag=T_TESLA),
        dict(seg="super_boards", inn=4.0, fx=0.50, w=1.25, tr="zoom", z=(1.15, 1.3), p=(-40, 40)),
        dict(seg="im1_landing", inn=39.45, fx=0.50, w=1.3, tr="cut", z=(1.1, 1.2), p=(0, 0), rumble=True),
        dict(seg="tour_silhouette", inn=6.5, fx=0.79, w=2.6, tr="fade", z=(1.12, 1.02), p=(30, -30)),
    ],
    "childhood": [
        dict(seg="earth_iss", inn=1.0, fx=0.55, w=3.6, tr="dip", z=(1.05, 1.18), p=(-60, 60), tag="ЗЕМЛЯ С ОРБИТЫ · NASA"),
        dict(seg="gfx:code", w=4.3, tr="fade", z=(1.0, 1.0), p=(0, 0), tag="ИЛЛЮСТРАЦИЯ"),
        dict(seg="gfx:game", w=4.6, tr="zoom", z=(1.0, 1.0), p=(0, 0), tag="ИЛЛЮСТРАЦИЯ"),
    ],
    "paypal": [
        dict(seg="super_ext", inn=5.6, fx=0.55, w=3.0, tr="dip", z=(1.04, 1.14), p=(40, -40), tag="КРЕМНИЕВАЯ ДОЛИНА · NASA AMES"),
        dict(seg="gfx:web", w=3.9, tr="whip", z=(1.0, 1.0), p=(0, 0), tag="ИЛЛЮСТРАЦИЯ"),
        dict(seg="super_racks", inn=2.0, fx=0.42, w=5.0, tr="zoom", z=(1.08, 1.22), p=(-50, 50), dim=0.25),
    ],
    "spacex": [
        dict(seg="tour_f9_close", inn=4.9, fx=0.46, w=2.5, tr="dip", z=(1.02, 1.16), p=(0, 0), panY=(-40, 40), tag="FALCON 9 · LC-39A · NASA"),
        dict(seg="suitup_musk", inn=23.6, fx=0.25, w=2.6, tr="cut", z=(1.08, 1.0), p=(30, -30), tag="SPACEX · NASA · 2020"),
        dict(seg="fh_hs", inn=8.0, fx=0.52, w=2.7, tr="flash", z=(1.02, 1.14), p=(0, 0), rumble=True, tag="FALCON HEAVY · NASA"),
        dict(seg="im1_landing", inn=46.4, fx=0.50, w=2.4, tr="cut", z=(1.04, 1.14), p=(0, 0), rumble=True, tag="ПОСАДКА СТУПЕНИ · NASA"),
        dict(seg="starship_iss", inn=5.0, fx=0.42, w=2.4, tr="fade", z=(1.1, 1.22), p=(-30, 30), tag="STARSHIP · ВИД С МКС · NASA"),
        dict(seg="fh_drone", inn=6.0, fx=0.50, w=3.2, tr="zoom", z=(1.0, 1.12), p=(0, 0), rumble=True, dim=0.15),
    ],
    "tesla": [
        dict(seg="convoy_drone", inn=3.2, fx=0.55, w=2.6, tr="dip", z=(1.04, 1.12), p=(-40, 40), tag=T_TESLA),
        dict(seg="walkout_tesla", inn=3.2, fx=0.52, w=3.0, tr="cut", z=(1.04, 1.12), p=(40, -40), tag=T_TESLA),
        dict(seg="convoy_side", inn=2.0, fx=0.45, w=3.0, tr="whip", z=(1.06, 1.12), p=(-70, 70), tag=T_TESLA),
        dict(seg="convoy_top", inn=3.0, fx=0.50, w=3.0, tr="cut", z=(1.04, 1.14), p=(0, 0), tag=T_TESLA),
        dict(seg="walkout_tesla2", inn=5.5, fx=0.36, w=3.2, tr="fade", z=(1.02, 1.12), p=(40, -40), tag=T_TESLA),
    ],
    "ai": [
        dict(seg="super_boards", inn=8.0, fx=0.50, w=3.0, tr="dip", z=(1.06, 1.2), p=(-40, 40), tag="СУПЕРКОМПЬЮТЕР · NASA AMES"),
        dict(seg="super_cables", inn=2.0, fx=0.50, w=2.6, tr="zoom", z=(1.12, 1.28), p=(40, -40)),
        dict(seg="super_racks", inn=6.0, fx=0.30, w=3.8, tr="cut", z=(1.04, 1.14), p=(-30, 30), dim=0.35),
        dict(seg="super_boards", inn=18.0, fx=0.45, w=3.2, tr="fade", z=(1.18, 1.06), p=(30, -30), dim=0.2),
    ],
    "controversy": [
        dict(seg="press_wide", inn=3.0, fx=0.50, w=2.6, tr="dip", z=(1.0, 1.1), p=(0, 0), tag="ПРЕСС-КОНФЕРЕНЦИЯ · NASA · 2020", sat=0.7),
        dict(seg="press_musk_a", inn=7.6, fx=0.50, w=3.0, tr="cut", z=(1.12, 1.2), p=(10, -10), sat=0.62),
        dict(seg="press_musk_b", inn=14.6, fx=0.53, w=3.6, tr="zoom", z=(1.06, 1.14), p=(-20, 20), dim=0.42, sat=0.55),
        dict(seg="tour_group", inn=0.4, fx=0.52, w=3.2, tr="cut", z=(1.16, 1.06), p=(30, -30), tag="SPACEX · NASA · 2019"),
    ],
    "ending": [
        dict(seg="fh_drone", inn=0.3, fx=0.50, w=3.0, tr="flash", z=(1.0, 1.1), p=(0, 0), rumble=True),
        dict(seg="earth_iss", inn=12.0, fx=0.58, w=3.2, tr="fade", z=(1.06, 1.16), p=(40, -40), tag="ЗЕМЛЯ С ОРБИТЫ · NASA"),
        dict(seg="convoy_top", inn=11.0, fx=0.50, w=2.6, tr="cut", z=(1.06, 1.14), p=(0, 0)),
        dict(seg="tour_silhouette", inn=9.5, fx=0.80, w=4.0, tr="fade", z=(1.06, 1.16), p=(-20, 20)),
        # end card background (extended by END_CARD)
        dict(seg="tour_night", inn=6.0, fx=0.45, w=None, tr="dip", z=(1.0, 1.1), p=(0, 0), dim=0.25),
    ],
}

TITLES = {
    "hook": dict(text="ЧЕЛОВЕК, КОТОРЫЙ ХОЧЕТ ИЗМЕНИТЬ МИР", kicker="ДОКУМЕНТАЛЬНАЯ ИСТОРИЯ", variant="hook"),
    "childhood": dict(text="12 ЛЕТ —|ПЕРВЫЙ ПРОЕКТ", kicker="ГЛАВА 1 · ДЕТСТВО", variant="chapter"),
    "paypal": dict(text="PAYPAL —|ПЕРВЫЙ БОЛЬШОЙ УСПЕХ", kicker="ГЛАВА 2 · 1990-Е", variant="chapter"),
    "spacex": dict(text="SPACEX —|ПУТЬ К МАРСУ", kicker="ГЛАВА 3 · 2002", variant="chapter"),
    "tesla": dict(text="TESLA —|БУДУЩЕЕ АВТОМОБИЛЕЙ", kicker="ГЛАВА 4 · 2004 → 2008", variant="chapter"),
    "ai": dict(text="AI. NEURALINK.|TECHNOLOGIES.", kicker="ГЛАВА 5 · ТЕХНОЛОГИИ", variant="chapter"),
    "controversy": dict(text="ГЕНИЙ ИЛИ|ПРОВОКАТОР?", kicker="ГЛАВА 6 · СПОРЫ", variant="question"),
}


def norm(w):
    return re.sub(r"[^0-9a-zа-яё]", "", w.lower().replace("ё", "е"))


def align_chunks(sentence, t0):
    """Map display chunks onto TTS word timings. Chunk i ends at the TTS word equal to the
    chunk's last display word (searching forward); the final chunk ends at the last word."""
    words = sentence["words"]
    trim0 = sentence["trimStart"]
    out = []
    wi = 0
    chunks = sentence["subs"]
    for ci, ch in enumerate(chunks):
        start_w = wi
        if ci == len(chunks) - 1:
            end_w = len(words) - 1
        else:
            last = [norm(x) for x in ch.replace("*", "").split() if norm(x)][-1]
            end_w = None
            for j in range(wi, len(words)):
                if norm(words[j]["w"]) == last:
                    end_w = j
                    break
            if end_w is None:
                raise SystemExit(f"cannot align chunk {ch!r} in {sentence['tts']!r}")
        a = words[start_w]["t"] - trim0 + t0
        b = words[end_w]["t"] + words[end_w]["d"] - trim0 + t0
        out.append({"start": round(a - 0.06, 3), "end": round(b, 3), "text": ch})
        wi = end_w + 1
    return out


def main():
    t = LEAD_IN
    scenes, vo_out, subs, titles, overlays, sfx, flashes, shots, jobs = [], [], [], [], [], [], [], [], []
    sentence_times = {}
    for si, sc in enumerate(vo["scenes"]):
        s_start = 0.0 if si == 0 else t
        if si > 0:
            t += SCENE_HEAD
        for k, s in enumerate(sc["sentences"]):
            w = s["words"]
            s["trimStart"] = max(0.0, w[0]["t"] - 0.06)
            s["trimEnd"] = min(s["duration"], w[-1]["t"] + w[-1]["d"] + 0.16)
            vo_out.append({"file": s["file"], "start": round(t, 3), "trimStart": s["trimStart"], "trimEnd": s["trimEnd"]})
            ch = align_chunks(s, t)
            # each chunk stays until the next one starts (no flicker in short pauses)
            subs.extend(ch)
            sentence_times[(sc["id"], k)] = (t, t + s["trimEnd"] - s["trimStart"])
            t += s["trimEnd"] - s["trimStart"]
            if k < len(sc["sentences"]) - 1:
                t += GAP
        t += SCENE_TAIL
        if sc["id"] == "ending":
            t += END_CARD
        scenes.append({"id": sc["id"], "index": si, "start": round(s_start, 3), "end": round(t, 3)})

    # smooth subtitle hand-offs
    for i in range(len(subs) - 1):
        if 0 < subs[i + 1]["start"] - subs[i]["end"] < 0.45:
            subs[i]["end"] = subs[i + 1]["start"]
        else:
            subs[i]["end"] = round(subs[i]["end"] + 0.25, 3)
    subs[-1]["end"] = round(subs[-1]["end"] + 0.3, 3)

    total = scenes[-1]["end"]
    last_vo_end = sentence_times[("ending", 2)][1]

    # ---------------------------------------------------------------- shots
    for sc in scenes:
        plan = PLAN[sc["id"]]
        a, b = sc["start"], sc["end"]
        if sc["id"] == "ending":
            card_start = last_vo_end + 0.35
            body = [p for p in plan if p["w"]]
            spans = [(card_start - a) * p["w"] / sum(x["w"] for x in body) for p in body]
            spans.append(b - card_start)
        else:
            spans = [(b - a) * p["w"] / sum(x["w"] for x in plan) for p in plan]
        cur = a
        for k, (p, d) in enumerate(zip(plan, spans)):
            tr = p["tr"]
            if k == 0 and sc["index"] == 0:
                tr = "cut"
            trans_dur = {"cut": 0, "flash": 0, "dip": 0.35, "fade": 0.4, "zoom": 0.32, "whip": 0.28}[tr]
            sid = f"{sc['index']:02d}_{k}_{p['seg'].replace(':', '_')}"
            shot = {
                "id": sid,
                "src": p["seg"] if p["seg"].startswith("gfx:") else f"shots/{sid}.mp4",
                "start": round(cur, 3),
                "end": round(cur + d, 3),
                "transIn": tr,
                "transDur": trans_dur,
                "zoom": list(p["z"]),
                "pan": list(p["p"]),
            }
            if p.get("panY"):
                shot["panY"] = list(p["panY"])
            if p.get("tag"):
                shot["tag"] = p["tag"]
            if p.get("dim"):
                shot["dim"] = p["dim"]
            shots.append(shot)
            if not p["seg"].startswith("gfx:"):
                jobs.append({"id": sid, "seg": p["seg"], "in": max(0.0, p["inn"] - trans_dur), "dur": round(d + trans_dur + 0.25, 3),
                             "fx": p["fx"], "sat": p.get("sat", 0.9)})
            # sound design hooks
            if k > 0 or sc["index"] > 0:
                if tr in ("whip", "zoom", "dip"):
                    sfx.append({"type": "whoosh", "at": round(cur, 3), "dur": 0.7 if tr != "dip" else 1.0, "gain": 0.9 if tr == "dip" else 0.7})
                if tr == "flash":
                    flashes.append({"at": round(cur, 3), "kind": "warm", "dur": 0.12})
                    sfx.append({"type": "impact", "at": round(cur, 3), "gain": 0.9})
                    sfx.append({"type": "riser", "at": round(cur - 1.2, 3), "dur": 1.2})
                if tr == "dip":
                    flashes.append({"at": round(cur - 0.02, 3), "kind": "dip", "dur": 0.2})
            if p.get("rumble"):
                sfx.append({"type": "rumble", "at": round(cur, 3), "dur": round(d, 3), "gain": 0.9})
            cur += d

    # ---------------------------------------------------------------- titles & graphics
    sc_by = {s["id"]: s for s in scenes}
    hook = sc_by["hook"]
    titles.append({"scene": "hook", **TITLES["hook"], "at": 0.12, "dur": round(sentence_times[("hook", 0)][1] - 0.1, 3)})
    flashes.append({"at": 0.0, "kind": "white", "dur": 0.001})
    sfx.append({"type": "impact", "at": 0.05, "gain": 1.0})
    q0, q1 = sentence_times[("hook", 1)]
    overlays.append({"type": "mainTitle", "at": round(q0 - 0.05, 3), "dur": round(hook["end"] - q0 + 0.05, 3)})
    sfx.append({"type": "impact", "at": round(q0 - 0.05, 3), "gain": 0.8})

    def chapter(scene_id, at, dur):
        titles.append({"scene": scene_id, **TITLES[scene_id], "at": round(at, 3), "dur": round(dur, 3)})
        sfx.append({"type": "impact", "at": round(at + 0.05, 3), "gain": 0.55})

    # childhood title lands on "В 12 лет..."
    c2 = sentence_times[("childhood", 2)]
    chapter("childhood", c2[0] - 0.2, c2[1] - c2[0] + 0.6)
    c0 = sentence_times[("childhood", 0)]
    overlays.append({"type": "location", "at": round(c0[0], 3), "dur": round(c0[1] - c0[0] + 0.6, 3),
                     "props": {"text": "ПРЕТОРИЯ · ЮАР", "sub": "ЮЖНАЯ АФРИКА"}})
    overlays.append({"type": "year", "at": round(c0[0] + 0.6, 3), "dur": round(c0[1] - c0[0] + 0.2, 3),
                     "props": {"from": 1900, "to": 1971, "label": "ГОД РОЖДЕНИЯ"}})

    for sid in ("paypal", "spacex", "tesla", "ai", "controversy"):
        s = sc_by[sid]
        chapter(sid, s["start"] + 0.25, min(4.2, s["end"] - s["start"] - 0.6))

    p2 = sentence_times[("paypal", 2)]
    overlays.append({"type": "payments", "at": round(p2[0] - 0.4, 3), "dur": round(sc_by["paypal"]["end"] - p2[0] + 0.3, 3)})
    s3 = sentence_times[("spacex", 3)]
    overlays.append({"type": "mars", "at": round(s3[0] + 0.2, 3), "dur": round(sc_by["spacex"]["end"] - s3[0] - 0.1, 3)})
    t2 = sentence_times[("tesla", 2)]
    overlays.append({"type": "battery", "at": round(t2[0], 3), "dur": round(sc_by["tesla"]["end"] - t2[0] - 0.1, 3)})
    a0 = sentence_times[("ai", 0)]
    overlays.append({"type": "scan", "at": round(sc_by["ai"]["start"] + 0.3, 3), "dur": round(a0[1] - sc_by["ai"]["start"], 3)})
    a1 = sentence_times[("ai", 1)]
    overlays.append({"type": "neural", "at": round(a1[0] + 0.2, 3), "dur": round(sc_by["ai"]["end"] - a1[0] - 0.2, 3)})
    k1 = sentence_times[("controversy", 1)]
    overlays.append({"type": "feed", "at": round(k1[0] - 0.2, 3), "dur": round(k1[1] - k1[0] + 0.2, 3)})

    final_at = last_vo_end + 0.35
    sfx.append({"type": "impact", "at": round(final_at, 3), "gain": 1.0})
    sfx.append({"type": "riser", "at": round(final_at - 1.5, 3), "dur": 1.5})
    sfx.append({"type": "whoosh", "at": round(final_at + 3.0, 3), "dur": 0.8, "gain": 0.8})

    srcs = json.load(open(os.path.join(ROOT, "footage/credits.json"), encoding="utf-8")) if os.path.exists(os.path.join(ROOT, "footage/credits.json")) else {}
    credits = "Видео: NASA (общественное достояние). Иллюстрации и музыка — оригинальные. " \
              "NASA не одобряет и не спонсирует данный материал."

    tl = {
        "fps": FPS, "width": 1080, "height": 1920,
        "durationInFrames": int(round(total * FPS)),
        "scenes": scenes, "shots": shots, "titles": titles, "subs": subs, "overlays": overlays,
        "flashes": flashes, "ending": {"finalAt": round(final_at, 3), "ctaAt": round(final_at + 2.6, 3)},
        "credits": credits, "vo": vo_out, "sfx": sfx,
    }
    json.dump(tl, open(os.path.join(ROOT, "src/timeline.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(jobs, open(os.path.join(ROOT, "footage/prep_jobs.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"total {total:.2f}s  shots {len(shots)}  subs {len(subs)}")
    for s in scenes:
        print(f"  {s['id']:12s} {s['start']:6.2f} -> {s['end']:6.2f}  ({s['end'] - s['start']:.2f}s)")
    longest = max(subs, key=lambda x: len(x["text"].replace('*', '')))
    print("longest subtitle:", len(longest["text"].replace('*', '')), longest["text"])
    for sh in shots:
        d = sh["end"] - sh["start"]
        if d > 6.0 or d < 1.0:
            print("  shot length warning", sh["id"], round(d, 2))


if __name__ == "__main__":
    main()
