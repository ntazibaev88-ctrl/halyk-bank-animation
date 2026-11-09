"""Generates the eight scene compositions (compositions/s1..s8.html) from the SHOTS spec below.
Layer kinds: sat (real Sentinel-2 image with camera move + labels pinned to real coordinates), clip (baked 3D video),
map (animated vector map of Kazakhstan), ruler (1991–2026 timeline), art (gold line-art), chapter (chapter card),
text kinds: kicker | title | big | chip | fact | year | words.   Times are absolute film seconds.
Run: python3 tools/build_scenes.py"""
import html, json, os
from pyproj import Transformer

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(R, "script/timeline.json")))
SC = {s["id"]: s for s in TL["scenes"]}

def sat_meta(name):
    return json.load(open(os.path.join(R, "assets/sat", name + ".json")))
def px_of(name, lat, lon):
    m = sat_meta(name); x0, y0, x1, y1 = m["bbox_utm"]; w, h = m["px"]
    X, Y = Transformer.from_crs("EPSG:4326", m["crs"], always_xy=True).transform(lon, lat)
    return ((X - x0) / (x1 - x0) * w, (y1 - Y) / (y1 - y0) * h)
def coord(lat, lon):
    f = lambda v: f"{int(v)}°{int(round((v - int(v)) * 60)):02d}′"
    return f"{f(lat)} С.Е. · {f(lon)} Ш.Б."

# ------------------------------------------------------------------ the film
LAND = {"Бәйтерек": (51.1283, 71.4305), "Хан Шатыр": (51.1323, 71.4036), "Ақорда": (51.1258, 71.4462), "ЭКСПО-2017": (51.0890, 71.4161)}
CITY = {"astana": ("АСТАНА", 51.128, 71.43), "almaty": ("АЛМАТЫ", 43.238, 76.945), "shymkent": ("ШЫМКЕНТ", 42.32, 69.60), "turkistan": ("ТҮРКІСТАН", 43.297, 68.268),
        "karaganda": ("ҚАРАҒАНДЫ", 49.82, 73.10), "aktau": ("АҚТАУ", 43.66, 51.19), "oskemen": ("ӨСКЕМЕН", 49.96, 82.62)}
CREDIT = "Спутниктік түсірілім: Copernicus Sentinel-2 (ESA), 2024–2025"

SHOTS = {
 "s1-opening": [
   ("clip", dict(src="assets/clips/opening.mp4", t0=0.0, t1=6.0, fin=0, fout=0.6)),
   ("clip", dict(src="assets/clips/flag_dawn.mp4", t0=5.4, t1=10.4, fin=0.6, fout=0.6)),
   ("map", dict(t0=9.8, t1=13.9, draw=1.6, cities=["astana", "almaty", "shymkent", "karaganda", "aktau", "oskemen", "turkistan"], glow=True)),
   ("text", dict(id="t-kz", t0=1.25, t1=5.3, kind="hero", text="ҚАЗАҚСТАН", top=780)),
   ("text", dict(id="t-years", t0=5.9, t1=9.6, kind="kicker", text="1991 — 2026", top=300)),
   ("text", dict(id="t-title", t0=6.3, t1=9.6, kind="title", text="35 ЖЫЛДАҒЫ|*ДАМУ ЖОЛЫ*", top=360)),
   ("text", dict(id="t-1991", t0=8.25, t1=13.75, kind="year", text="1991", top=330)),
   ("text", dict(id="t-indep", t0=10.6, t1=13.75, kind="kicker", text="ТӘУЕЛСІЗДІК", top=520)),
 ],
 "s2-beginning": [
   ("clip", dict(src="assets/clips/flag_macro.mp4", t0=13.9, t1=18.6, fin=0.5, fout=0.5)),
   ("chapter", dict(t0=14.0, t1=17.9, num="I ТАРАУ", years="1991 — 2000", title="ЖАҢА МЕМЛЕКЕТТІҢ|*ДҮНИЕГЕ КЕЛУІ*")),
   ("ruler", dict(t0=18.1, t1=22.3, marks=[(1991, "ТӘУЕЛСІЗДІК"), (1997, "ЕЛОРДА"), (2017, "ЭКСПО"), (2026, "БҮГІН")])),
   ("text", dict(id="t-35", t0=18.3, t1=22.1, kind="title", text="*35 ЖЫЛ* —|ҮЛКЕН ӨЗГЕРІС", top=300)),
   ("map", dict(t0=22.0, t1=26.6, draw=2.6, border=True, cities=["astana"], tenge=True)),
   ("text", dict(id="t-border", t0=22.4, t1=24.3, kind="chip", text="МЕМЛЕКЕТТІК ШЕКАРА", top=320)),
   ("text", dict(id="t-1993", t0=24.4, t1=26.4, kind="year", text="1993", top=250)),
   ("text", dict(id="t-tenge", t0=24.6, t1=26.4, kind="chip", text="ҰЛТТЫҚ ВАЛЮТА — ТЕҢГЕ ₸", top=450)),
   ("clip", dict(src="assets/clips/earth_day.mp4", t0=26.2, t1=31.9, fin=0.4, fout=0.4)),
   ("text", dict(id="t-1992", t0=26.6, t1=31.4, kind="year", text="1992", top=250)),
   ("text", dict(id="t-un", t0=27.2, t1=31.4, kind="chip", text="БІРІККЕН ҰЛТТАР ҰЙЫМЫНА МҮШЕ", top=450)),
   ("text", dict(id="t-world", t0=28.4, t1=31.4, kind="kicker", text="ӘЛЕМГЕ ТАНЫЛҒАН ЕЛ", top=540)),
 ],
 "s3-cities": [
   ("sat", dict(name="astana_wide", t0=31.5, t1=34.4, fin=0.5, fout=0.6, s=(1.0, 1.55), focus=(51.128, 71.43))),
   ("sat", dict(name="astana", t0=34.0, t1=37.6, fin=0.6, fout=0.4, s=(1.0, 1.25), focus=(51.112, 71.43), labels=list(LAND.items()), lab_t=34.6)),
   ("text", dict(id="t-1997", t0=32.0, t1=34.3, kind="kicker", text="1997 · ЖАҢА ЕЛОРДА", top=260)),
   ("text", dict(id="t-astana", t0=32.4, t1=34.3, kind="title", text="*АСТАНА*", top=320)),
   ("text", dict(id="t-new", t0=34.6, t1=37.4, kind="title", text="ЖАҢА ҚАЛАЛАР", top=250)),
   *[("sat", dict(name=n, t0=37.4 + i * 1.0, t1=38.55 + i * 1.0, fin=0.25, fout=0.25, s=(1.08, 1.0), focus=(CITY[n][1], CITY[n][2]), city=CITY[n])) for i, n in enumerate(["almaty", "shymkent", "turkistan", "karaganda", "aktau", "oskemen"])],
   ("text", dict(id="t-infra", t0=37.6, t1=43.3, kind="chip", text="ЗАМАНАУИ ИНФРАҚҰРЫЛЫМ", top=250)),
 ],
 "s4-industry": [
   ("clip", dict(src="assets/clips/nature.mp4", t0=43.5, t1=47.0, fin=0.4, fout=0.4)),
   ("chapter", dict(t0=43.6, t1=46.4, num="II ТАРАУ", years="2000 — 2017", title="ДАМУ, ӨНДІРІС|*ЖӘНЕ ӨЗГЕРІС*")),
   ("text", dict(id="t-nat", t0=44.2, t1=46.6, kind="chip", text="ТАБИҒИ БАЙЛЫҚ", top=1000)),
   ("sat", dict(name="tengiz", t0=46.7, t1=48.7, fin=0.3, fout=0.3, s=(1.15, 1.0), tag=("МҰНАЙ · ГАЗ", "ТЕҢІЗ, АТЫРАУ ОБЛЫСЫ"))),
   ("sat", dict(name="ekibastuz", t0=48.5, t1=50.4, fin=0.3, fout=0.3, s=(1.0, 1.15), tag=("КӨМІР", "ЕКІБАСТҰЗ, ПАВЛОДАР ОБЛЫСЫ"))),
   ("sat", dict(name="balkhash", t0=50.2, t1=52.1, fin=0.3, fout=0.3, s=(1.15, 1.0), tag=("МЫС", "БАЛҚАШ, ҚАРАҒАНДЫ ОБЛЫСЫ"))),
   ("map", dict(t0=51.9, t1=53.9, draw=0.01, uranium=True, cities=[])),
   ("text", dict(id="t-uran", t0=52.1, t1=53.8, kind="chip", text="УРАН", top=300)),
   ("text", dict(id="t-uranf", t0=52.3, t1=53.8, kind="fact", text="ҚАЗАҚСТАН — УРАН ӨНДІРУДЕН ӘЛЕМДЕ 1-ОРЫНДА (2009 ЖЫЛДАН БЕРІ)", top=390)),
   ("sat", dict(name="temirtau", t0=53.8, t1=56.1, fin=0.3, fout=0.3, s=(1.0, 1.18), tag=("МЕТАЛЛУРГИЯ", "ТЕМІРТАУ, ҚАРАҒАНДЫ ОБЛЫСЫ"))),
   ("sat", dict(name="ekibastuz", t0=55.9, t1=57.9, fin=0.3, fout=0.3, s=(1.35, 1.6), rot=-4, tag=("ЭНЕРГЕТИКА", "ЕКІБАСТҰЗ, ПАВЛОДАР ОБЛЫСЫ"))),
   ("sat", dict(name="khorgos", t0=57.7, t1=59.6, fin=0.3, fout=0.3, s=(1.0, 1.15), tag=("ТЕМІР ЖОЛ · КӨЛІК", "ҚОРҒАС, ЖЕТІСУ ОБЛЫСЫ"))),
   ("sat", dict(name="charyn", t0=59.4, t1=60.9, fin=0.3, fout=0.3, s=(1.12, 1.0), tag=("ТАБИҒАТ", "ШАРЫН ШАТҚАЛЫ"))),
   ("sat", dict(name="burabay", t0=60.7, t1=62.5, fin=0.3, fout=0.4, s=(1.0, 1.12), tag=("ЕҢБЕК ЖӘНЕ ТАБИҒАТ", "БУРАБАЙ, АҚМОЛА ОБЛЫСЫ"))),
   ("text", dict(id="t-prod", t0=54.4, t1=61.9, kind="kicker", text="ӨНДІРІС · ЭНЕРГЕТИКА · ЕҢБЕК", top=250)),
 ],
 "s5-agro": [
   ("sat", dict(name="wheat", t0=62.3, t1=67.2, fin=0.5, fout=0.5, s=(1.0, 1.3), warm=True)),
   ("sat", dict(name="wheat2", t0=66.8, t1=71.8, fin=0.5, fout=0.4, s=(1.25, 1.0), warm=True)),
   ("text", dict(id="t-agro", t0=62.8, t1=71.5, kind="title", text="ҚАЗАҚСТАН —|*АГРАРЛЫҚ ӘЛЕУЕТІ*|ЗОР ЕЛ", top=226)),
   ("text", dict(id="t-wheat", t0=66.6, t1=71.5, kind="words", text="БИДАЙ|МАЛ ШАРУАШЫЛЫҒЫ|АЗЫҚ-ТҮЛІК", top=600, at=[66.9, 69.0, 69.9])),
   ("text", dict(id="t-agrocred", t0=62.3, t1=71.8, kind="note", text="Солтүстік Қазақстан егістіктері, тамыз", top=1360)),
 ],
 "s6-culture": [
   ("art", dict(t0=71.8, t1=78.2, kind="book", label="БІЛІМ", sub="ЖАҢА ОҚУ ОРЫНДАРЫ · ҒЫЛЫМ · ТЕХНОЛОГИЯ")),
   ("art", dict(t0=78.0, t1=81.4, kind="dombra", label="МӘДЕНИЕТ", sub="ТІЛ · ДӘСТҮР · ҰЛТТЫҚ ӨНЕР")),
   ("sat", dict(name="turkistan", t0=81.2, t1=82.9, fin=0.3, fout=0.3, s=(1.0, 1.25), focus=(43.2928, 68.2702), labels=[("Қожа Ахмет Ясауи кесенесі", (43.2928, 68.2702))], lab_t=81.4, tag=("ЮНЕСКО МҰРАСЫ · 2003", "ТҮРКІСТАН"))),
   ("art", dict(t0=82.7, t1=84.4, kind="medal", label="СПОРТ", sub="ЖАС ҰРПАҚ · ХАЛЫҚАРАЛЫҚ ЖЕҢІСТЕР")),
 ],
 "s7-modern": [
   ("sat", dict(name="astana", t0=84.2, t1=86.4, fin=0.4, fout=0.4, s=(1.4, 1.75), focus=(51.089, 71.416), labels=[("ЭКСПО-2017", (51.0890, 71.4161))], lab_t=84.6)),
   ("chapter", dict(t0=84.3, t1=86.3, num="III ТАРАУ", years="2017 — 2026", title="ЗАМАНАУИ ҚАЗАҚСТАН|*ЖӘНЕ БОЛАШАҚ*")),
   ("clip", dict(src="assets/clips/datacenter.mp4", t0=86.1, t1=89.4, fin=0.4, fout=0.4, illus=True)),
   ("text", dict(id="t-digital", t0=86.6, t1=89.2, kind="title", text="ЦИФРЛЫҚ|*ДАМУ*", top=260)),
   ("text", dict(id="t-ai", t0=87.6, t1=89.2, kind="chip", text="ЖАСАНДЫ ИНТЕЛЛЕКТ", top=470)),
   ("clip", dict(src="assets/clips/renewables.mp4", t0=89.0, t1=92.8, fin=0.4, fout=0.4, illus=True)),
   ("text", dict(id="t-inno", t0=89.4, t1=92.6, kind="title", text="*ИННОВАЦИЯ*", top=260)),
   ("text", dict(id="t-res", t0=90.1, t1=92.6, kind="chip", text="ЖАҢАРТЫЛАТЫН ЭНЕРГИЯ", top=380)),
   ("map", dict(t0=92.5, t1=94.2, draw=0.01, network=True, cities=["astana", "almaty", "shymkent", "karaganda", "aktau", "oskemen", "turkistan"])),
   ("text", dict(id="t-opp", t0=92.7, t1=94.0, kind="title", text="ЖАҢА|*МҮМКІНДІКТЕР*", top=260)),
 ],
 "s8-future": [
   ("clip", dict(src="assets/clips/earth_night.mp4", t0=93.9, t1=98.8, fin=0.4, fout=0.4)),
   ("text", dict(id="t-wealth", t0=95.4, t1=98.4, kind="title", text="ЕЛІМІЗДІҢ БАЙЛЫҒЫ —|*АДАМДАРЫ*", top=260)),
   *[("sat", dict(name=n, t0=98.4 + i * 1.65, t1=100.3 + i * 1.65, fin=0.3, fout=0.3, s=(1.06, 1.0), golden=True)) for i, n in enumerate(["almaty", "karaganda", "oskemen"])],
   ("text", dict(id="t-people", t0=98.2, t1=103.2, kind="words", text="ЕҢБЕКҚОР ХАЛЫҚ|ЖАСТАР|ҰРПАҚ", top=300, at=[98.1, 100.1, 101.9])),
   ("ruler", dict(t0=103.2, t1=110.6, marks=[(1991, "ТӘУЕЛСІЗДІК"), (1997, "ЕЛОРДА"), (2017, "ЭКСПО"), (2026, "БҮГІН")], big=True)),
   ("text", dict(id="t-35b", t0=103.6, t1=106.1, kind="title", text="*35 ЖЫЛ*", top=300)),
   ("text", dict(id="t-path", t0=106.3, t1=110.5, kind="words", text="ТӘЖІРИБЕ|ЖЕТІСТІК|МҮМКІНДІК", top=300, at=[106.4, 107.7, 108.7])),
   ("clip", dict(src="assets/clips/finale.mp4", t0=110.4, t1=120.0, fin=0.5, fout=0)),
   ("text", dict(id="t-final", t0=110.9, t1=120.0, kind="titleS", text="ҚАЗАҚСТАН — *35 ЖЫЛ*", top=958, hold=True)),
   ("text", dict(id="t-values", t0=111.6, t1=120.0, kind="words", text="БІРЛІК.|ЕҢБЕК.|ДАМУ.|БОЛАШАҚ.", top=1040, at=[111.6, 112.1, 112.6, 113.1], hold=True, row=True)),
   ("text", dict(id="t-ours", t0=116.0, t1=120.0, kind="box", text="*БІЗДІҢ ЕЛ.*|БІЗДІҢ БОЛАШАҚ.", top=1110, hold=True)),
   ("text", dict(id="t-yrs", t0=111.2, t1=120.0, kind="kicker", text="1991 — 2026", top=250, hold=True)),
   ("fade", dict(t0=118.6, t1=120.0)),
 ],
}

# ------------------------------------------------------------------ rendering helpers
CSS = """
    @font-face { font-family: "KZ Sans"; src: url("assets/fonts/Montserrat-Black.woff2") format("woff2"); font-weight: 900; }
    @font-face { font-family: "KZ Sans"; src: url("assets/fonts/Montserrat-Bold.woff2") format("woff2"); font-weight: 700; }
    @font-face { font-family: "KZ Sans"; src: url("assets/fonts/Montserrat-Medium.woff2") format("woff2"); font-weight: 500; }
    @font-face { font-family: "KZ Serif"; src: url("assets/fonts/CormorantGaramond-Bold.woff2") format("woff2"); font-weight: 700; }
    @font-face { font-family: "KZ Num"; src: url("assets/fonts/PlayfairDisplay-Black.woff2") format("woff2"); font-weight: 900; }
    #root { position: absolute; inset: 0; overflow: hidden; background: #050b18; }
    .lay { position: absolute; inset: 0; overflow: hidden; }
    .kb { position: absolute; left: 0; top: 0; transform-origin: 50% 50%; }
    .kb img { display: block; }
    .veil { position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(180deg, rgba(4,10,24,.78) 0%, rgba(4,10,24,.18) 24%, rgba(4,10,24,0) 45%, rgba(4,10,24,.12) 62%, rgba(4,10,24,.82) 100%); }
    .grade { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light; background: linear-gradient(180deg, rgba(20,60,140,.45), rgba(10,30,80,.25)); }
    .grade.warm { background: linear-gradient(180deg, rgba(255,190,90,.35), rgba(255,150,60,.25)); }
    .grade.golden { background: linear-gradient(180deg, rgba(255,200,120,.30), rgba(30,60,140,.35)); }
    .pin { position: absolute; width: 0; height: 0; }
    .pin i { position: absolute; left: -9px; top: -9px; width: 18px; height: 18px; border-radius: 50%; background: #E6B85C; box-shadow: 0 0 0 4px rgba(6,16,36,.55), 0 0 22px rgba(230,184,92,.9); }
    .pin b { position: absolute; left: -2px; bottom: 12px; width: 2px; height: 90px; background: linear-gradient(0deg, #E6B85C, rgba(230,184,92,.2)); transform-origin: 50% 100%; }
    .pin span { position: absolute; left: -400px; width: 800px; bottom: 108px; text-align: center; }
    .pin span em { display: inline-block; font: 700 30px/1.15 "KZ Sans", sans-serif; letter-spacing: .06em; color: #fff; font-style: normal; text-transform: uppercase;
      background: rgba(6,14,32,.72); border: 1.5px solid rgba(230,184,92,.85); padding: 8px 18px; border-radius: 10px; white-space: nowrap; }
    .city { position: absolute; left: 0; right: 0; top: 1010px; text-align: center; }
    .city .n { font: 900 96px/1 "KZ Sans", sans-serif; letter-spacing: .08em; color: #fff; text-shadow: 0 6px 40px rgba(0,0,0,.7); }
    .city .c { margin-top: 10px; font: 700 28px/1 "KZ Sans", sans-serif; letter-spacing: .22em; color: #E6B85C; text-shadow: 0 2px 10px rgba(0,0,0,.8); }
    .tag { position: absolute; left: 60px; right: 60px; top: 1000px; }
    .tag .k { display: inline-block; font: 900 64px/1 "KZ Sans", sans-serif; letter-spacing: .04em; color: #fff; text-shadow: 0 6px 30px rgba(0,0,0,.75); }
    .tag .p { margin-top: 12px; font: 700 28px/1.2 "KZ Sans", sans-serif; letter-spacing: .16em; color: #E6B85C; text-shadow: 0 2px 10px rgba(0,0,0,.85); }
    .tag::before { content: ""; display: block; width: 80px; height: 4px; background: #E6B85C; margin-bottom: 18px; }
    .credit { position: absolute; left: 0; right: 0; top: 1872px; text-align: center; font: 500 18px/1 "KZ Sans", sans-serif; letter-spacing: .06em; color: rgba(255,255,255,.55); }
    .illus { position: absolute; right: 40px; top: 190px; font: 700 20px/1 "KZ Sans", sans-serif; letter-spacing: .2em; color: rgba(255,255,255,.6); }
    .navy { position: absolute; inset: 0; background: radial-gradient(90% 60% at 50% 42%, #0f2a5e 0%, #071631 55%, #040a18 100%); }
    .map { position: absolute; left: 50px; top: 600px; width: 980px; height: 646px; overflow: visible; }
    .ov { position: absolute; left: 0; right: 0; text-align: center; }
    .ov > div { display: inline-block; }
    .hero { font: 900 128px/1 "KZ Sans", sans-serif; letter-spacing: .1em; color: #fff; text-shadow: 0 8px 50px rgba(0,0,0,.55); }
    .year { font: 900 170px/1 "KZ Num", serif; background: linear-gradient(180deg, #FFF1C9 0%, #E6B85C 50%, #A9782A 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 8px 30px rgba(0,0,0,.6)); }
    .kicker { font: 700 32px/1 "KZ Sans", sans-serif; letter-spacing: .3em; color: #F3D891; background: rgba(6,14,32,.55); padding: 9px 22px 9px 30px; border-radius: 30px; text-shadow: 0 2px 10px rgba(0,0,0,.6); }
    .title { font: 900 80px/1.04 "KZ Sans", sans-serif; letter-spacing: .02em; color: #fff; text-shadow: 0 4px 30px rgba(0,0,0,.7), 0 1px 3px rgba(0,0,0,.6); }
    .titleS { font: 900 62px/1 "KZ Sans", sans-serif; letter-spacing: .02em; color: #fff; white-space: nowrap; text-shadow: 0 4px 28px rgba(0,0,0,.75); }
    .g { color: #E6B85C; }
    .chip { font: 700 32px/1.2 "KZ Sans", sans-serif; letter-spacing: .08em; color: #fff; padding: 14px 26px; border-radius: 40px; background: rgba(6,14,32,.66); border: 1.5px solid rgba(230,184,92,.9); max-width: 940px; }
    .fact { font: 900 29px/1.25 "KZ Sans", sans-serif; letter-spacing: .03em; color: #071226; padding: 12px 22px; border-radius: 12px; background: linear-gradient(180deg, #F6DFA0, #E6B85C); max-width: 900px; }
    .note { font: 500 24px/1 "KZ Sans", sans-serif; letter-spacing: .08em; color: rgba(255,255,255,.75); }
    .word { display: block; font: 900 64px/1.15 "KZ Sans", sans-serif; letter-spacing: .06em; color: #fff; text-shadow: 0 4px 26px rgba(0,0,0,.75); }
    .word:nth-child(2n) { color: #E6B85C; }
    .row .word { display: inline-block; margin: 0 10px; font-size: 46px; color: #E6B85C; }
    .box { font: 900 50px/1.15 "KZ Sans", sans-serif; color: #fff; padding: 20px 40px 22px; border-radius: 26px; background: rgba(6,14,32,.62); border: 2px solid rgba(230,184,92,.9); }
    .chap { position: absolute; left: 0; right: 0; top: 560px; text-align: center; }
    .chap .num { font: 700 34px/1 "KZ Serif", serif; letter-spacing: .4em; color: #E6B85C; }
    .chap .yr { margin-top: 14px; font: 900 44px/1 "KZ Sans", sans-serif; letter-spacing: .2em; color: #fff; }
    .chap .rule { width: 0; height: 3px; margin: 26px auto; background: linear-gradient(90deg, rgba(230,184,92,0), #E6B85C, rgba(230,184,92,0)); }
    .chap .tt { font: 900 70px/1.08 "KZ Sans", sans-serif; color: #fff; letter-spacing: .02em; text-shadow: 0 6px 34px rgba(0,0,0,.7); }
    .chapbg { position: absolute; inset: 0; background: radial-gradient(70% 45% at 50% 42%, rgba(4,10,24,.82), rgba(4,10,24,.35) 70%, rgba(4,10,24,0)); }
    .ruler { position: absolute; left: 110px; right: 110px; top: 880px; height: 6px; }
    .ruler .ln { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: rgba(230,184,92,.85); transform-origin: 0 50%; }
    .ruler .mk { position: absolute; top: -12px; width: 2px; height: 28px; background: #E6B85C; }
    .ruler .yr { position: absolute; top: 40px; width: 200px; margin-left: -100px; text-align: center; font: 900 52px/1 "KZ Num", serif; color: #F3D891; }
    .ruler .lb { position: absolute; top: -70px; width: 240px; margin-left: -120px; text-align: center; font: 700 26px/1.1 "KZ Sans", sans-serif; letter-spacing: .1em; color: #fff; }
    .ruler .dot { position: absolute; top: -8px; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%; background: #E6B85C; box-shadow: 0 0 20px rgba(230,184,92,.9); }
    .art { position: absolute; left: 240px; top: 420px; width: 600px; height: 600px; overflow: visible; }
    .art path, .art circle, .art ellipse, .art line, .art rect { fill: none; stroke: #E6B85C; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
    .artlab { position: absolute; left: 0; right: 0; top: 1060px; text-align: center; }
    .artlab .t { font: 900 92px/1 "KZ Sans", sans-serif; letter-spacing: .08em; color: #fff; }
    .artlab .s { margin-top: 18px; font: 700 28px/1.2 "KZ Sans", sans-serif; letter-spacing: .16em; color: #E6B85C; }
    .orn { position: absolute; left: 0; right: 0; height: 60px; opacity: .55; }
    .fadeout { position: absolute; inset: 0; background: #000; }
"""

ART = {
 "book": """<path d="M300 470 C230 430 140 425 70 450 L70 190 C140 165 230 170 300 210 Z"/><path d="M300 470 C370 430 460 425 530 450 L530 190 C460 165 370 170 300 210 Z"/><path d="M300 210 L300 470"/>
   <path d="M110 240 C170 225 225 230 270 252 M110 290 C170 275 225 280 270 302 M110 340 C170 325 225 330 270 352 M330 252 C375 230 430 225 490 240 M330 302 C375 280 430 275 490 290 M330 352 C375 330 430 325 490 340"/>
   <path d="M300 60 L430 110 L300 160 L170 110 Z"/><path d="M220 130 L220 175 C260 200 340 200 380 175 L380 130"/><path d="M430 110 L430 170"/>""",
 "dombra": """<path d="M300 560 C190 560 150 470 175 390 C195 330 245 300 285 250 L315 250 C355 300 405 330 425 390 C450 470 410 560 300 560 Z"/>
   <ellipse cx="300" cy="430" rx="22" ry="22"/><path d="M285 250 L289 40 L311 40 L315 250"/><path d="M289 40 L282 10 L318 10 L311 40"/>
   <path d="M282 22 L262 18 M318 22 L338 18"/><path d="M296 40 L296 520 M304 40 L304 520"/><path d="M270 520 L330 520"/>
   <path d="M292 80 L308 80 M292 110 L308 110 M292 140 L308 140 M292 170 L308 170 M292 200 L308 200 M292 228 L308 228"/>""",
 "medal": """<path d="M220 40 L270 250 M380 40 L330 250 M260 40 L300 200 L340 40"/><circle cx="300" cy="380" r="140"/><circle cx="300" cy="380" r="105"/>
   <path d="M300 310 L318 358 L370 360 L329 391 L344 441 L300 412 L256 441 L271 391 L230 360 L282 358 Z"/>""",
}

def markup(text):
    out = []
    for line in text.split("|"):
        parts = line.split("*")
        out.append("".join(f'<span class="g">{html.escape(p)}</span>' if i % 2 else html.escape(p) for i, p in enumerate(parts)))
    return "<br />".join(out)

def build(sid, layers):
    sc = SC[sid]; S0, S1 = sc["start"], sc["end"]; D = round(S1 - S0, 3)
    L = lambda t: round(t - S0, 3)
    body, js, z = [], [], 1
    has_sat = False
    for li, (kind, o) in enumerate(layers):
        lid = f"{sid[:2]}-{kind}{li}"
        t0, t1 = max(o.get("t0", S0), S0), min(o.get("t1", S1), S1)
        a, d = L(t0), round(t1 - t0, 3)
        if kind == "sat":
            has_sat = True
            m = sat_meta(o["name"]); w, h = m["px"]; f = 1080 / w
            fx, fy = (px_of(o["name"], *o["focus"]) if "focus" in o else (w / 2, h / 2))
            ox, oy = fx / w * 100, fy / h * 100
            grade = "warm" if o.get("warm") else ("golden" if o.get("golden") else "")
            pins = ""
            for k, (lab, (la, lo)) in enumerate(o.get("labels", [])):
                x, y = px_of(o["name"], la, lo)
                hh = 80 + k * 78
                pins += f'<div class="pin" id="{lid}-p{k}" style="left:{x * f:.1f}px;top:{y * f:.1f}px"><b style="height:{hh}px"></b><i></i><span style="bottom:{hh + 18}px"><em>{html.escape(lab)}</em></span></div>'
                js.append(f'  tl.fromTo("#{lid}-p{k}", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }}, {L(o.get("lab_t", t0 + 0.4) + k * 0.35)});')
            extra = ""
            if "city" in o:
                nm, la, lo = o["city"]; extra = f'<div class="city"><div class="n">{html.escape(nm)}</div><div class="c">{coord(la, lo)}</div></div>'
            if "tag" in o:
                extra = f'<div class="tag" id="{lid}-tag"><div class="k">{html.escape(o["tag"][0])}</div><div class="p">{html.escape(o["tag"][1])}</div></div>'
                js.append(f'  tl.fromTo("#{lid}-tag", {{ opacity: 0, x: -30 }}, {{ opacity: 1, x: 0, duration: 0.45, ease: "expo.out" }}, {round(a + 0.15, 3)});')
            body.append(f'    <div id="{lid}" class="clip lay" data-start="{a}" data-duration="{d}" data-track-index="{li % 2}" style="z-index:{z}">'
                        f'<div class="kb" id="{lid}-kb" style="width:{w * f:.0f}px;height:{h * f:.0f}px;top:{(1920 - h * f) / 2:.0f}px;transform-origin:{ox:.2f}% {oy:.2f}%">'
                        f'<img src="assets/sat/{o["name"]}.jpg" width="{w * f:.0f}" height="{h * f:.0f}" alt="" />{pins}</div>'
                        f'<div class="grade {grade}"></div><div class="veil"></div>{extra}</div>')
            s0, s1 = o.get("s", (1.0, 1.15))
            js.append(f'  tl.fromTo("#{lid}-kb", {{ scale: {s0}, rotation: {o.get("rot", 0)} }}, {{ scale: {s1}, rotation: 0, duration: {d}, ease: "sine.inOut" }}, {a});')
            js.append(f'  fade("#{lid}", {a}, {d}, {o.get("fin", 0.4)}, {o.get("fout", 0.4)});')
        elif kind == "clip":
            body.append(f'    <video id="{lid}" class="clip" src="{o["src"]}" data-hf-media-start-basis="local" data-start="{a}" data-duration="{d}" data-track-index="{2 + li % 2}" muted playsinline style="position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;z-index:{z}"></video>')
            if o.get("illus"):
                body.append(f'    <div id="{lid}-il" class="clip" data-start="{a}" data-duration="{d}" data-track-index="4" style="position:absolute;inset:0;z-index:{z}"><div class="illus">ИЛЛЮСТРАЦИЯ</div></div>')
            js.append(f'  fade("#{lid}", {a}, {d}, {o.get("fin", 0.4)}, {o.get("fout", 0.4)});')
        elif kind == "map":
            body.append(f'    <div id="{lid}" class="clip lay" data-start="{a}" data-duration="{d}" data-track-index="5" style="z-index:{z}"><div class="navy"></div>'
                        f'<svg class="map" id="{lid}-svg" viewBox="0 0 940 620"></svg></div>')
            cfg = {k: o.get(k) for k in ["cities", "border", "tenge", "uranium", "network", "glow"]}; cfg["draw"] = o.get("draw", 1.5)
            js.append(f'  buildMap("{lid}", {json.dumps(cfg)}, {a}, {d});')
            js.append(f'  fade("#{lid}", {a}, {d}, 0.4, 0.4);')
        elif kind == "ruler":
            yrs = o["marks"]; marks = ""
            for k, (y, lb) in enumerate(yrs):
                p = (y - 1991) / 35 * 100
                marks += f'<div class="mk" style="left:{p:.2f}%"></div><div class="yr" id="{lid}-y{k}" style="left:{p:.2f}%">{y}</div><div class="lb" id="{lid}-l{k}" style="left:{p:.2f}%">{html.escape(lb)}</div>'
            body.append(f'    <div id="{lid}" class="clip lay" data-start="{a}" data-duration="{d}" data-track-index="5" style="z-index:{z}"><div class="navy"></div>'
                        f'<div class="ruler" id="{lid}-r"><div class="ln" id="{lid}-ln"></div>{marks}<div class="dot" id="{lid}-dot" style="left:0%"></div></div></div>')
            js.append(f'  tl.fromTo("#{lid}-ln", {{ scaleX: 0 }}, {{ scaleX: 1, duration: {round(d * 0.7, 2)}, ease: "power2.inOut" }}, {round(a + 0.2, 3)});')
            js.append(f'  tl.fromTo("#{lid}-dot", {{ x: 0 }}, {{ x: 860, duration: {round(d * 0.7, 2)}, ease: "power2.inOut" }}, {round(a + 0.2, 3)});')
            for k, (y, lb) in enumerate(yrs):
                tt = round(a + 0.2 + d * 0.7 * ((y - 1991) / 35) ** 1.0, 3)
                js.append(f'  tl.fromTo(["#{lid}-y{k}", "#{lid}-l{k}"], {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "expo.out" }}, {tt});')
            js.append(f'  fade("#{lid}", {a}, {d}, 0.35, 0.35);')
        elif kind == "art":
            body.append(f'    <div id="{lid}" class="clip lay" data-start="{a}" data-duration="{d}" data-track-index="5" style="z-index:{z}"><div class="navy"></div>'
                        f'<div class="orn" id="{lid}-o1" style="top:230px"></div><div class="orn" id="{lid}-o2" style="top:1560px"></div>'
                        f'<svg class="art" id="{lid}-svg" viewBox="0 0 600 600">{ART[o["kind"]]}</svg>'
                        f'<div class="artlab"><div class="t" id="{lid}-t">{html.escape(o["label"])}</div><div class="s" id="{lid}-s">{html.escape(o["sub"])}</div></div></div>')
            js.append(f'  drawArt("{lid}", {a}, {d});')
            js.append(f'  fade("#{lid}", {a}, {d}, 0.4, 0.4);')
        elif kind == "chapter":
            body.append(f'    <div id="{lid}" class="clip lay" data-start="{a}" data-duration="{d}" data-track-index="6" style="z-index:{z + 20}"><div class="chapbg"></div><div class="chap">'
                        f'<div class="num" id="{lid}-n">{html.escape(o["num"])}</div><div class="yr" id="{lid}-y">{html.escape(o["years"])}</div><div class="rule" id="{lid}-r"></div>'
                        f'<div class="tt" id="{lid}-t">{markup(o["title"])}</div></div></div>')
            js.append(f'  chapter("{lid}", {a}, {d});')
        elif kind == "fade":
            body.append(f'    <div id="{lid}" class="clip lay" data-start="{a}" data-duration="{d}" data-track-index="7" style="z-index:90"><div class="fadeout" id="{lid}-f"></div></div>')
            js.append(f'  tl.fromTo("#{lid}-f", {{ opacity: 0 }}, {{ opacity: 1, duration: {d}, ease: "power1.in" }}, {a});')
        elif kind == "text":
            tid = o["id"]; k2 = o["kind"]
            if k2 == "words":
                ws = o["text"].split("|")
                spans = "".join(f'<span class="word" id="{tid}-{i}">{html.escape(w_)}</span>' for i, w_ in enumerate(ws))
                cls = "row" if o.get("row") else ""
                body.append(f'    <div id="{tid}" class="clip ov" data-start="{a}" data-duration="{d}" data-track-index="8" style="top:{o["top"]}px;z-index:{z + 40}"><div class="{cls}">{spans}</div></div>')
                for i, at in enumerate(o["at"]):
                    js.append(f'  tl.fromTo("#{tid}-{i}", {{ opacity: 0, y: 24, filter: "blur(8px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "expo.out" }}, {L(at)});')
                if not o.get("hold"): js.append(f'  tl.to("#{tid} > div", {{ opacity: 0, duration: 0.22 }}, {round(a + d - 0.24, 3)});')
            else:
                cls = {"hero": "hero", "year": "year", "kicker": "kicker", "title": "title", "titleS": "titleS", "chip": "chip", "fact": "fact", "note": "note", "box": "box"}[k2]
                body.append(f'    <div id="{tid}" class="clip ov" data-start="{a}" data-duration="{d}" data-track-index="8" style="top:{o["top"]}px;z-index:{z + 40}"><div class="{cls}">{markup(o["text"])}</div></div>')
                js.append(f'  inOut("#{tid} > div", {a}, {round(a + d, 3)}, "{k2}", {str(bool(o.get("hold"))).lower()});')
        z += 1
    if has_sat:
        body.append(f'    <div id="{sid[:2]}-credit" class="clip" data-start="0" data-duration="{D}" data-track-index="9" data-layout-ignore style="position:absolute;inset:0;z-index:95;pointer-events:none"><div class="credit">{html.escape(CREDIT)}</div></div>')
    return f'''<template>
  <style>{CSS}  </style>
  <div id="root" data-composition-id="{sid}" data-width="1080" data-height="1920" data-duration="{D}">
{chr(10).join(body)}
  </div>
  <script>
  const tl = gsap.timeline({{ paused: true }});
  const Q = (s) => document.querySelector(s);
  function fade(sel, a, d, fi, fo) {{
    if (fi > 0) tl.fromTo(sel, {{ opacity: 0 }}, {{ opacity: 1, duration: fi, ease: "power1.inOut" }}, a);
    if (fo > 0) tl.to(sel, {{ opacity: 0, duration: fo, ease: "power1.inOut" }}, a + d - fo);
  }}
  function inOut(sel, a, b, kind, hold) {{
    const big = ["year", "hero", "title", "titleS", "box"].includes(kind);
    tl.fromTo(sel, {{ opacity: 0, y: big ? 0 : 16, scale: big ? 1.1 : 1, filter: "blur(10px)" }}, {{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: big ? 0.7 : 0.45, ease: "expo.out" }}, a);
    if (!hold) tl.to(sel, {{ opacity: 0, filter: "blur(6px)", duration: 0.24, ease: "power2.in" }}, b - 0.26);
  }}
  function chapter(id, a, d) {{
    tl.fromTo("#" + id, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.35 }}, a);
    tl.fromTo("#" + id + "-n", {{ opacity: 0, y: -10 }}, {{ opacity: 1, y: 0, duration: 0.5 }}, a + 0.1);
    tl.fromTo("#" + id + "-y", {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }}, a + 0.25);
    tl.fromTo("#" + id + "-r", {{ width: 0 }}, {{ width: 420, duration: 0.8, ease: "power3.inOut" }}, a + 0.3);
    tl.fromTo("#" + id + "-t", {{ opacity: 0, filter: "blur(10px)", scale: 1.06 }}, {{ opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.7, ease: "expo.out" }}, a + 0.5);
    tl.to("#" + id, {{ opacity: 0, duration: 0.4 }}, a + d - 0.4);
  }}
  function drawArt(id, a, d) {{
    const els = Array.from(document.querySelectorAll("#" + id + "-svg *"));
    els.forEach((e, i) => {{ const L = (e.getTotalLength && e.getTotalLength()) || 600; e.style.strokeDasharray = L + " " + (L + 10); tl.fromTo(e, {{ strokeDashoffset: L }}, {{ strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }}, a + 0.15 + i * 0.08); }});
    tl.fromTo("#" + id + "-svg", {{ scale: 0.96 }}, {{ scale: 1.03, duration: d, ease: "none" }}, a);
    tl.fromTo("#" + id + "-t", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }}, a + 0.5);
    tl.fromTo("#" + id + "-s", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5 }}, a + 0.9);
    // national ornament bands (qoshqar müiiz)
    ["-o1", "-o2"].forEach((s, k) => {{ const el = Q("#" + id + s); let p = ""; for (let i = 0; i < 18; i++) {{ const x = 30 + i * 60; p += `M${{x}},30 c10,-24 34,-24 30,-6 c-3,10 -14,8 -12,-2 M${{x}},30 c-10,-24 -34,-24 -30,-6 c3,10 14,8 12,-2 M${{x}},30 c10,24 34,24 30,6 c-3,-10 -14,-8 -12,2 M${{x}},30 c-10,24 -34,24 -30,6 c3,-10 14,-8 12,2 `; }}
      el.innerHTML = `<svg viewBox="0 0 1080 60" width="1080" height="60"><path d="${{p}}" fill="none" stroke="#E6B85C" stroke-width="2.4"/></svg>`;
      tl.fromTo(el, {{ x: k ? -60 : 60, opacity: 0 }}, {{ x: 0, opacity: 0.55, duration: d, ease: "sine.out" }}, a); }});
  }}
  function buildMap(id, cfg, a, d) {{
    const M = window.KZMAP, svg = Q("#" + id + "-svg");
    let s = `<defs><linearGradient id="${{id}}-f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b6fb3" stop-opacity=".55"/><stop offset="1" stop-color="#0b3b78" stop-opacity=".45"/></linearGradient>
      <filter id="${{id}}-gl" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
    s += `<path d="${{M.neighbors}}" fill="none" stroke="#6d93c8" stroke-opacity=".22" stroke-width="1.2"/>`;
    s += `<path id="${{id}}-fill" d="${{M.kz}}" fill="url(#${{id}}-f)"/>`;
    s += `<path id="${{id}}-glow" d="${{M.kz}}" fill="none" stroke="#E6B85C" stroke-width="9" stroke-opacity=".45" filter="url(#${{id}}-gl)" pathLength="1000" stroke-dasharray="1000 1100"/>`;
    s += `<path id="${{id}}-line" d="${{M.kz}}" fill="none" stroke="#E6B85C" stroke-width="2.6" stroke-linejoin="round" pathLength="1000" stroke-dasharray="1000 1100"/>`;
    const names = {{ astana: "АСТАНА", almaty: "АЛМАТЫ", shymkent: "ШЫМКЕНТ", karaganda: "ҚАРАҒАНДЫ", aktau: "АҚТАУ", oskemen: "ӨСКЕМЕН", turkistan: "ТҮРКІСТАН" }};
    (cfg.cities || []).forEach((k, i) => {{ const p = M.cities[k]; s += `<g class="${{id}}-c" opacity="0"><circle cx="${{p[0]}}" cy="${{p[1]}}" r="${{k === "astana" ? 8 : 5.5}}" fill="#fff"/><circle cx="${{p[0]}}" cy="${{p[1]}}" r="14" fill="none" stroke="#E6B85C" stroke-width="2"/>
      <text x="${{p[0] + (k === "aktau" ? 16 : 0)}}" y="${{p[1] - 20}}" text-anchor="${{k === "aktau" ? "start" : "middle"}}" font-family="KZ Sans" font-weight="700" font-size="21" letter-spacing="2" fill="#fff">${{names[k]}}</text></g>`; }});
    if (cfg.network) {{ const ks = cfg.cities; for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) {{ const A = M.cities[ks[i]], B = M.cities[ks[j]]; if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 470) s += `<path class="${{id}}-n" d="M${{A[0]}},${{A[1]}} Q${{(A[0] + B[0]) / 2}},${{(A[1] + B[1]) / 2 - 60}} ${{B[0]}},${{B[1]}}" fill="none" stroke="#6fd3ff" stroke-width="2" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="100"/>`; }} }}
    if (cfg.uranium) {{ s += `<ellipse id="${{id}}-u" cx="470" cy="430" rx="150" ry="70" fill="#E6B85C" fill-opacity=".22" stroke="#E6B85C" stroke-width="2" stroke-dasharray="6 6"/><text x="470" y="438" text-anchor="middle" font-family="KZ Sans" font-weight="900" font-size="28" letter-spacing="4" fill="#F3D891">U</text>`; }}
    if (cfg.tenge) {{ s += `<g id="${{id}}-t" opacity="0"><circle cx="760" cy="120" r="58" fill="#E6B85C"/><text x="760" y="146" text-anchor="middle" font-family="KZ Sans" font-weight="900" font-size="74" fill="#071226">₸</text></g>`; }}
    svg.innerHTML = s;
    const dr = cfg.draw;
    if (dr > 0.05) {{ tl.fromTo(["#" + id + "-line", "#" + id + "-glow"], {{ attr: {{ "stroke-dashoffset": 1000 }} }}, {{ attr: {{ "stroke-dashoffset": 0 }}, duration: dr, ease: "power2.inOut" }}, a + 0.1);
      tl.fromTo("#" + id + "-fill", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.8 }}, a + dr * 0.7); }}
    else tl.set(["#" + id + "-line", "#" + id + "-glow"], {{ attr: {{ "stroke-dashoffset": 0 }} }}, a);
    tl.fromTo("." + id + "-c", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3, stagger: 0.12 }}, a + Math.max(0.3, dr * 0.8));
    if (cfg.network) tl.to("." + id + "-n", {{ attr: {{ "stroke-dashoffset": 0 }}, duration: 0.7, ease: "power2.out", stagger: 0.05 }}, a + 0.3);
    if (cfg.uranium) tl.fromTo("#" + id + "-u", {{ opacity: 0, scale: 0.7, transformOrigin: "50% 50%" }}, {{ opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }}, a + 0.3);
    if (cfg.tenge) tl.fromTo("#" + id + "-t", {{ opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }}, {{ opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }}, a + 2.5);
    tl.fromTo("#" + id + "-svg", {{ scale: 1.06 }}, {{ scale: 1.0, duration: d, ease: "sine.out" }}, a);
  }}
{chr(10).join(js)}
  window.__timelines["{sid}"] = tl;
  </script>
</template>
'''

if __name__ == "__main__":
    for sid, layers in SHOTS.items():
        open(os.path.join(R, "compositions", sid + ".html"), "w", encoding="utf-8").write(build(sid, layers))
        print(sid, len(layers))
