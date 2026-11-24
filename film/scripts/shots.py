"""Single source of truth for the film's 33 shots.

kind: video    -> real footage, prepared by prep_shots.py into assets/shots/<id>.mp4
      interior -> animated Kazakh-home scene (silhouettes of Ata and Bala)
      dawn     -> animated dawn-steppe scene (Bala, flag, sunrise)
      gfx      -> typographic / graphic shot (graphics.js)
      endcard  -> final titles over the dawn scene
Times are film seconds. 'tail' keeps a shot visible under the next one's dissolve.
"""

SCENES = {
    1: "THE QUESTION", 2: "THE PAST", 3: "DECEMBER 1986", 4: "INDEPENDENCE",
    5: "A NEW COUNTRY", 6: "TODAY'S KAZAKHSTAN", 7: "THE GRANDFATHER'S MESSAGE", 8: "THE FUTURE",
}

ARCH = "МҰРАҒАТТЫҚ КАДР"
ILLU = "ИЛЛЮСТРАЦИЯЛЫҚ КАДР"

SHOTS = [
    # ---------------- Scene 1: THE QUESTION (0–12) ----------------
    dict(id="S01", scene=1, start=0.0, end=3.8, kind="video", src="mk_48634.mp4", src_in=1.5, cx=0.52,
         move=dict(from_=[1.04, 0, 20], to=[1.14, 0, -10]), tail=0.6,
         desc="Establishing: a herd of horses crossing the steppe at sunrise, mountains on the horizon; slow push-in, wind."),
    dict(id="S02", scene=1, start=3.8, end=8.6, kind="interior", in_=dict(type="dissolve", dur=0.6),
         p=dict(cam=dict(**{"from": [540, 990, 1.0], "to": [548, 955, 1.1]}), mood="sunset", balaAsk=[1.4, 4.0]),
         desc="Kazakh home at sunset. Ata and Bala by the window; slow dolly-in. Bala: «Ата, тәуелсіздік деген не?»"),
    dict(id="S03", scene=1, start=8.6, end=12.2, kind="interior",
         p=dict(cam={"from": [640, 800, 2.6], "to": [728, 690, 4.2]}, mood="sunset", ataLook=[0.0, 1.2], focus="flag"),
         desc="Close: Ata lifts his gaze to the window; rack focus to the blue flag waving outside."),
    # ---------------- Scene 2: THE PAST (12–27) ----------------
    dict(id="S04", alt=dict(src="mk_10055.mp4", src_in=1.0, grade="archival", mode="full", cx=0.45, label=ILLU, desc="Memory: horses crossing the open plain (sepia, illustrative)."), scene=2, start=12.2, end=16.0, kind="video", src="c30.webm", src_in=0.0, archival=True,
         move=dict(from_=[1.05, 0, 0], to=[1.12, 0, -20]), label=ARCH + " · ЖАМБЫЛ ЖАБАЕВ",
         desc="Archival film: akyn Jambyl Jabayev (Soviet era) — Zhambyl museum archive."),
    dict(id="S05", alt=dict(src="mk_25915.mp4", src_in=2.0, grade="archival", mode="full", label=ILLU, desc="Memory: ears of wheat in the wind (sepia, illustrative)."), scene=2, start=16.0, end=19.6, kind="video", src="c30.webm", src_in=0.0, archival=True,
         move=dict(from_=[1.12, 20, 0], to=[1.05, -20, 0]), label=ARCH + " · КЕҢЕС ДӘУІРІ",
         desc="Archival film, Soviet-era Kazakhstan (Jambyl archive)."),
    dict(id="S06", alt=dict(kind="interior", p=dict(cam={"from": [470, 985, 2.3], "to": [480, 975, 2.45]}, mood="sunset", speak=[[0, 3.6]]), desc="Close-up: Ata: «Оның артында тұтас бір халықтың арманы мен тағдыры жатыр.»"), scene=2, start=19.6, end=23.4, kind="video", src="c29.webm", src_in=0.0, archival=True,
         move=dict(from_=[1.04, 0, 0], to=[1.12, 0, 0]), label=ARCH + " · КЕҢЕС ДӘУІРІ",
         desc="Archival material from the Zhambyl museum film."),
    dict(id="S07", alt=dict(src="mk_35040.mp4", src_in=4.0, grade="night", mode="full", label=ILLU, desc="Winter comes: snow falling in a misty forest (illustrative)."), scene=2, start=23.4, end=27.0, kind="video", src="c31.webm", src_in=0.0, archival=False,
         move=dict(from_=[1.1, 0, 0], to=[1.2, 0, 0]), label="ЖАМБЫЛДЫҢ ДОМБЫРАСЫ",
         desc="Jambyl's own dombra, Zhambyl literary memorial museum — a link between generations."),
    # ---------------- Scene 3: DECEMBER 1986 (27–43) ----------------
    dict(id="S08", scene=3, start=27.0, end=31.2, kind="gfx", gfx="t1986",
         desc="Memorial title «АЛМАТЫ · ЖЕЛТОҚСАН · 1986» over falling snow."),
    dict(id="S09", alt=dict(kind="gfx", gfx="snowfall", label=None, desc="Night snowfall under a lamp (animated)."), scene=3, start=31.2, end=35.0, kind="video", src="c17.webm", src_in=2.0, in_=dict(type="dissolve", dur=0.6),
         move=dict(from_=[1.15, 0, 0], to=[1.25, 0, 40]), label=ILLU, tail=0.6,
         desc="Night snowfall under a street lamp (illustrative; not footage of the 1986 events)."),
    dict(id="S10", scene=3, start=35.0, end=38.8, kind="video", src="mk_3352.mp4", src_in=1.0, in_=dict(type="dissolve", dur=0.6), grade="night", mode="full",
         move=dict(from_=[1.05, 0, 60], to=[1.15, 0, -60]), label=ILLU, tail=0.7,
         desc="Snow falling through winter pines (illustrative)."),
    dict(id="S11", scene=3, start=38.8, end=43.2, kind="interior", in_=dict(type="dissolve", dur=0.7),
         p=dict(cam={"from": [455, 960, 2.2], "to": [460, 980, 2.35]}, mood="night", ataBow=0.4), tail=0.6,
         desc="Present day, night: Ata bows his head in remembrance."),
    # ---------------- Scene 4: INDEPENDENCE (43–58) ----------------
    dict(id="S12", scene=4, start=43.2, end=48.0, kind="gfx", gfx="date", in_=dict(type="dissolve", dur=0.6),
         desc="On-screen text «16 ЖЕЛТОҚСАН 1991 ЖЫЛ», gold, light rays."),
    dict(id="S13", scene=4, start=48.0, end=52.4, kind="gfx", gfx="law", in_=dict(type="dissolve", dur=0.5),
         desc="Typographic title of the Constitutional Law «On the State Independence of the Republic of Kazakhstan», Almaty 1991."),
    dict(id="S14", scene=4, start=52.4, end=55.4, kind="video", src="mk_6850.mp4", src_in=3.0, in_=dict(type="dissolve", dur=0.7),
         move=dict(from_=[1.0, 0, 40], to=[1.1, 0, -30]), tail=0.6,
         desc="«Сол күннен бастап…» A red sun rises over the plain — a new day, a new history."),
    dict(id="S15", scene=4, start=55.4, end=58.4, kind="video", src="mk_17547.mp4", src_in=1.0, in_=dict(type="dissolve", dur=0.6),
         move=dict(from_=[1.0, 0, 0], to=[1.1, 0, 0]), tail=0.5,
         desc="Morning light over a wheat field — the land waking up."),
    # ---------------- Scene 5: A NEW COUNTRY (58–73) ----------------
    dict(id="S16", scene=5, start=58.4, end=62.2, kind="gfx", gfx="flagRise", in_=dict(type="dissolve", dur=0.5),
         label="1992 · МЕМЛЕКЕТТІК ТУ",
         desc="«Біз өз туымызды көтердік.» The State Flag (adopted 4 June 1992) rises and unfurls."),
    dict(id="S17", scene=5, start=62.2, end=65.7, kind="gfx", gfx="tenge",
         desc="«Өз теңгемізді енгіздік.» The tenge, national currency introduced 15 November 1993."),
    dict(id="S18", alt=dict(kind="gfx", gfx="un1992", label=None, desc="«Әлемге … танылдық.» 2 March 1992 — Kazakhstan becomes a member of the United Nations."), scene=5, start=65.7, end=69.7, kind="video", src="c13.webm", src_in=0.0, archival=True,
         move=dict(from_=[1.04, 0, 0], to=[1.12, 0, 0]), label=ARCH + " · ВАШИНГТОН, 19.05.1992",
         desc="«Әлемге … танылдық.» Archival: first official visit of the President of independent Kazakhstan to the White House, 19 May 1992 (public domain)."),
    dict(id="S19", scene=5, start=69.7, end=73.2, kind="video", src="n_rollout.mp4", src_in=372.0, in_=dict(type="dissolve", dur=0.5),
         move=dict(from_=[1.0, 0, 0], to=[1.1, 0, 0]), label="БАЙҚОҢЫР",
         desc="«Алдымызда жаңа жол ашылды.» Rollout along the rails across the steppe, Baikonur."),
    # ---------------- Scene 6: TODAY'S KAZAKHSTAN (73–91) ----------------
    dict(id="S20", alt=dict(src="mk_31450.mp4", src_in=2.0, mode="full", cx=0.55, label=None, desc="Builders: cranes raising new buildings, mountains behind."), scene=6, start=73.2, end=75.8, kind="video", src="c12.webm", src_in=0.0, in_=dict(type="dissolve", dur=0.4),
         move=dict(from_=[1.02, 0, 0], to=[1.1, 0, 0]), label="АЛМАТЫ · КӨКТӨБЕ", fallback="mk_10055.mp4",
         desc="Almaty: Kok-Tobe cable car above the city, Ile-Alatau mountains behind."),
    dict(id="S21", alt=dict(src="mk_7853.mp4", src_in=2.0, mode="full", cx=0.6, label=None, desc="Green farmland and fields under a wide sky."), scene=6, start=75.8, end=78.2, kind="video", src="c26.webm", src_in=8.0, fallback="mk_10055.mp4",
         move=dict(from_=[1.0, 0, 0], to=[1.08, 0, 0]), label="БАТЫС ҚАЗАҚСТАН · ОРДА",
         desc="Aerial: saiga antelopes running across the West Kazakhstan steppe (Orda reserve)."),
    dict(id="S22", scene=6, start=78.2, end=80.4, kind="video", src="mk_23781.mp4", src_in=6.0, cx=0.5,
         move=dict(from_=[1.0, 0, 0], to=[1.08, 0, 0]),
         desc="«…еңбек еткен халық» Aerial: combines harvesting grain."),
    dict(id="S23", scene=6, start=80.4, end=81.6, kind="video", src="mk_47291.mp4", src_in=4.0, cx=0.42,
         move=dict(from_=[1.0, 0, 0], to=[1.06, 0, 0]),
         desc="Builders and engineers: welding sparks."),
    dict(id="S24", scene=6, start=81.6, end=82.8, kind="video", src="mk_6562.mp4", src_in=4.0, cx=0.58,
         move=dict(from_=[1.0, 0, 0], to=[1.05, 0, 0]),
         desc="Doctors: a physician listens to a patient's heartbeat."),
    dict(id="S25", scene=6, start=82.8, end=84.0, kind="video", src="mk_4616.mp4", src_in=1.0, cx=0.5,
         move=dict(from_=[1.0, 0, 0], to=[1.06, 0, 0]),
         desc="«…армандаған жастар» Teacher / scholar at a blackboard of equations."),
    dict(id="S26", scene=6, start=84.0, end=85.4, kind="video", src="mk_50109.mp4", src_in=0.5, cx=0.45,
         move=dict(from_=[1.0, 0, 0], to=[1.06, 0, 0]),
         desc="Young people studying: hands drawing charts in a notebook."),
    dict(id="S27", alt=dict(src="mk_8864.mp4", src_in=3.0, mode="full", cx=0.4, label=None, desc="«…болашаққа сенген ұрпақ» A hand brushing through ripe wheat at sunset."), scene=6, start=85.4, end=87.6, kind="video", src="c11.webm", src_in=1.0, label="АСТАНА", fallback="mk_8864.mp4",
         move=dict(from_=[1.02, 0, 0], to=[1.1, 0, 0]),
         desc="«…болашаққа сенген ұрпақ» Children playing on an ice slide in Astana."),
    dict(id="S28", alt=dict(src="n_rollout.mp4", src_in=402.0, mode="full", cx=0.5, label="БАЙҚОҢЫР", desc="Soyuz rocket raised on the launch pad, Baikonur."), scene=6, start=87.6, end=89.6, kind="video", src="c22.webm", src_in=4.0, label="БАЙҚОҢЫР", fallback="mk_8864.mp4",
         move=dict(from_=[1.0, 0, 0], to=[1.06, 0, 0]),
         desc="Soyuz launch from the Baikonur cosmodrome, time-lapse."),
    dict(id="S29", scene=6, start=89.6, end=91.4, kind="gfx", gfx="flagWave", tail=0.8,
         desc="The blue flag of Kazakhstan waving in the wind."),
    # ---------------- Scene 7: THE GRANDFATHER'S MESSAGE (91–106) ----------------
    dict(id="S30", scene=7, start=91.4, end=95.4, kind="interior", in_=dict(type="dissolve", dur=0.8),
         p=dict(cam={"from": [540, 1010, 1.02], "to": [548, 1030, 1.14]}, mood="dusk", speak=[[1.6, 4.2]]),
         desc="Back in the home at dusk, lamp light. Ata: «Балам, біз сендерге азат елді аманат еттік.»"),
    dict(id="S31", scene=7, start=95.4, end=99.2, kind="interior",
         p=dict(cam={"from": [580, 1120, 1.7], "to": [585, 1105, 1.82]}, mood="dusk", hand=[0.0, 1.8], speak=[[0, 3.8]]),
         desc="Two-shot: Ata gently places his hand on the grandson's shoulder."),
    dict(id="S32", scene=7, start=99.2, end=103.0, kind="interior",
         p=dict(cam={"from": [470, 985, 2.35], "to": [478, 995, 2.5]}, mood="dusk", handHold=1, speak=[[0, 3.7]]),
         desc="Close-up Ata: «Енді сол елді қорғау, дамыту, қадірлеу — сендердің қолдарыңда.»"),
    dict(id="S33", scene=7, start=103.0, end=106.4, kind="interior",
         p=dict(cam={"from": [700, 1060, 2.5], "to": [694, 1050, 2.65]}, mood="dusk", handHold=1, balaListen=0.2),
         desc="Close-up Bala listening in silence, looking up at his grandfather."),
    # ---------------- Scene 8: THE FUTURE (106–120) ----------------
    dict(id="S34", scene=8, start=106.4, end=110.4, kind="dawn", in_=dict(type="dissolve", dur=0.9),
         p=dict(cam={"from": [600, 1300, 1.25], "to": [590, 1060, 1.12]}, sunRise=6, gt0=106.4),
         desc="Sunrise over the steppe; Bala stands on a hill beside the flag; slow crane up."),
    dict(id="S35", scene=8, start=110.4, end=113.4, kind="dawn",
         p=dict(cam={"from": [520, 820, 1.9], "to": [540, 760, 2.05]}, sunRise=6, gt0=106.4),
         desc="Closer: the flag in the morning wind, sunlight through the cloth."),
    dict(id="S36", scene=8, start=113.4, end=120.0, kind="dawn",
         p=dict(cam={"from": [560, 760, 1.06], "to": [545, 640, 1.0]}, sunRise=6, gt0=106.4),
         desc="Wide dawn sky above Bala and the flag, the camera still rising; final titles."),
    dict(id="S37", scene=8, start=113.8, end=120.0, kind="endcard", gfx="endcard",
         desc="«АТАНЫҢ АМАНАТЫ» / «16 ЖЕЛТОҚСАН — ҚАЗАҚСТАН РЕСПУБЛИКАСЫНЫҢ ТӘУЕЛСІЗДІК КҮНІ» / «ТӘУЕЛСІЗДІГІМІЗ МӘҢГІ БОЛСЫН!»"),
]

DIPS = [
    dict(at=12.2, half=0.45, type="white"),   # window light carries us into the past
    dict(at=27.0, half=0.40, type="black"),
    dict(at=43.2, half=0.30, type="black"),
    dict(at=58.4, half=0.25, type="white"),
    dict(at=106.4, half=0.35, type="black"),
]


def _have(name):
    import os
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return any(os.path.exists(os.path.join(root, d, name)) for d in ("media/raw", "media/mixkit", "media/nasa"))

def resolve():
    """Use each shot's 'alt' definition when its preferred source has not been downloaded."""
    out = []
    for s in SHOTS:
        s = dict(s)
        alt = s.pop("alt", None)
        s.pop("fallback", None)
        if s["kind"] == "video" and not _have(s["src"]) and alt:
            base = {k: v for k, v in s.items() if k in ("id", "scene", "start", "end", "in_", "tail", "move")}
            if alt.get("kind", "video") != "video":
                base.pop("move", None)
            base.setdefault("kind", "video")
            base.update(alt)
            base["substituted_for"] = s["src"]
            s = base
        out.append(s)
    return out
