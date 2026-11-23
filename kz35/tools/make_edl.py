#!/usr/bin/env python3
"""Edit decision list: one entry per shot, cut to the narration's word timings.

Fields: id, start, end (film seconds), src, type (video|image), in (source s), speed,
mode (cover|framed), cx/cy/zoom (reframe), fgh/fgy (framed band), grade, mv (camera move:
[scale0, scale1, x0, x1, y0, y1] in px), tin (transition in: fade|cut|dip), tdur,
label (on-screen context label), narr (narration covered), desc, origin (archival|documentary|
illustrative stock|motion graphic), credit.
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = 'assets/img/'
NASA = 'NASA (public domain)'
MIX = 'Mixkit (Mixkit Stock Video Free License)'


def S(id, start, end, src, type='video', **k):
    d = dict(id=id, start=start, end=end, src=src, type=type)
    d.update(k)
    return d


shots = [
    # ---------------- SCENE 1 · Opening ----------------
    S('sh01', 0.00, 4.45, 'assets/mixkit/m17120.mp4', **{'in': 1.0}, speed=0.8, grade='warm', mv=[1.0, 1.06, 0, 0, 0, 0],
      tin='cut', desc='Golden grain field from the air at sunrise light', origin='illustrative stock', credit=MIX,
      narr='Тәуелсіздік... Бұл — жай ғана сөз емес.'),
    S('sh02', 4.45, 8.30, 'assets/mixkit/m16023.mp4', **{'in': 3.0}, speed=0.85, grade='warm', cx=0.45, mv=[1.02, 1.08, 0, 0, 0, 0],
      desc='Hands passing through ripe wheat', origin='illustrative stock', credit=MIX,
      narr='Бұл — тұтас бір халықтың ғасырлар бойы аңсаған арманы.'),
    S('sh03', 8.30, 13.07, 'assets/mixkit/flag_19069.mp4', **{'in': 0.0}, speed=0.85, grade='flag', cx=0.72, zoom=1.0,
      mv=[1.0, 1.07, 0, 0, 0, 0], desc='National flag of Kazakhstan waving (sky-blue, golden sun, steppe eagle, ornament)',
      origin='stock (CG flag)', credit=MIX, narr='Бұл — өз тағдырын өзі шешуге мүмкіндік алған елдің жаңа тарихы.'),
    # ---------------- SCENE 2 · December 1986 ----------------
    S('sh04', 13.07, 16.55, IMG + 'Republic_Square_2C_Almaty_1_jpg.jpg', 'image', grade='cold', cx=0.42, mv=[1.0, 1.05, 0, -40, 0, 0],
      tin='dip', tdur=0.7, label='РЕСПУБЛИКА АЛАҢЫ · АЛМАТЫ · ҚАЗІРГІ КӨРІНІС',
      desc='Republic (former Brezhnev) Square, Almaty – site of the December 1986 demonstrations; present-day photo',
      origin='documentary photo (present day)', credit='Wikimedia Commons, CC BY-SA 2.0', narr='1986 жылдың желтоқсаны.'),
    S('sh05', 16.55, 20.95, IMG + 'Independence_Monument_Zheltoksan_jpg.jpg', 'image', grade='cold', cx=0.5, zoom=1.0, dim=0.35,
      mv=[1.04, 1.0, 0, 0, 0, 0], label='ТӘУЕЛСІЗДІК МОНУМЕНТІ · ЖЕЛТОҚСАН БЕДЕРІ',
      desc='Bronze relief of the Jeltoqsan events on the Independence Monument, Almaty (+ animated map pin: Almaty)',
      origin='documentary photo of memorial', credit='Wikimedia Commons, CC BY-SA 3.0',
      narr='Алматы алаңына шыққан жастар ел тағдырына бейжай қарамайтынын көрсетті.'),
    S('sh06', 20.95, 26.05, IMG + 'Jeltoqsan_memorial_commencement_28Almaty_2C_2001_2.jpg', 'image', grade='cold', cx=0.55,
      mv=[1.0, 1.06, 30, -30, 0, 0], label='ЖЕЛТОҚСАН ҚҰРБАНДАРЫН ЕСКЕ АЛУ · АЛМАТЫ, 2001',
      desc='Commemoration of the 15th anniversary of Jeltoqsan, Almaty, December 2001', origin='archival photo (2001)',
      credit='Wikimedia Commons, CC BY 2.0', narr='Желтоқсан оқиғасы — халқымыздың тарихындағы ауыр әрі маңызды кезең.'),
    S('sh07', 26.05, 30.37, IMG + 'Dawn_of_Liberty_28AP4M2178_1PS_29_2829725981895_29.jpg', 'image', grade='cold', cx=0.55,
      mv=[1.08, 1.0, 0, 0, -30, 0], label='«ТӘУЕЛСІЗДІК ТАҢЫ» ЕСКЕРТКІШІ · АЛМАТЫ',
      desc='"Dawn of Independence" Jeltoqsan memorial, Almaty', origin='documentary photo of memorial',
      credit='Wikimedia Commons, CC BY 2.0', narr='Оның құрбандары мен қаһармандары ел жадында мәңгі сақталады.'),
    # ---------------- SCENE 3 · 16 December 1991 ----------------
    S('sh08', 30.37, 34.25, IMG + 'Independence_Monument_in_Almaty_28AP4M2204_1PS_29_.jpg', 'image', grade='doc', cy=0.35,
      mv=[1.0, 1.05, 0, 0, 60, -60], tin='dip', tdur=0.7, label='ТӘУЕЛСІЗДІК МОНУМЕНТІ · АЛМАТЫ',
      desc='Independence Monument on Republic Square, Almaty (erected 1996)', origin='documentary photo',
      credit='Wikimedia Commons, CC BY 2.0', narr='1991 жылдың 16 желтоқсаны.'),
    S('sh09', 34.25, 38.05, 'assets/mixkit/flag_19069.mp4', **{'in': 4.0}, speed=0.8, grade='flag', cx=0.78, zoom=1.1,
      mv=[1.0, 1.06, 0, 0, 0, 0], desc='Flag of Kazakhstan (sun and eagle detail)', origin='stock (CG flag)', credit=MIX,
      narr='Қазақстан Республикасының мемлекеттік тәуелсіздігі жарияланды.'),
    S('sh10', 38.05, 41.75, 'assets/nasa/n4.mp4', **{'in': 948.0}, speed=0.8, grade='doc', cx=0.5,
      mv=[1.0, 1.06, 0, 0, 0, 0], label='ЖЕР · ХАЛЫҚАРАЛЫҚ ҒАРЫШ СТАНЦИЯСЫНАН',
      desc='Earth seen from the International Space Station', origin='documentary (NASA)', credit=NASA,
      narr='Бұл күн халқымыздың тарихындағы жаңа дәуірдің бастауы болды.'),
    S('sh11', 41.75, 46.46, 'assets/nasa/n4.mp4', **{'in': 1040.0}, speed=0.7, grade='night', cx=0.5, dim=0.45,
      mv=[1.0, 1.04, 0, 0, 0, 0], desc='Earth limb from ISS (darkened) under animated globe locating Kazakhstan',
      origin='documentary (NASA) + motion graphic', credit=NASA,
      narr='Қазақстан әлем картасында дербес мемлекет ретінде өз жолын бастады.'),
    # ---------------- SCENE 4 · Building the state ----------------
    S('sh12', 46.46, 49.30, 'assets/mixkit/flag_49267.mp4', **{'in': 0.5}, speed=0.8, grade='doc', cx=0.5,
      mv=[1.0, 1.06, 0, 0, 0, 0], tin='dip', tdur=0.6, label='МЕМЛЕКЕТТІК ЕЛТАҢБА',
      desc='State Emblem of Kazakhstan on a banner (present-day Latin inscription)', origin='stock (present day)',
      credit=MIX, narr='Алдымызда үлкен міндеттер тұрды.'),
    S('sh13', 49.30, 51.05, IMG + '_D0_9F_D0_BB_D0_BE_D1_89_D0_B0_D0_B4_D1_8C_D0_A0_D.jpg', 'image', grade='doc', cx=0.5,
      mv=[1.0, 1.05, 0, 0, 0, 0], desc='Independence Monument and Republic Square, Almaty (2015)',
      origin='documentary photo', credit='Wikimedia Commons, CC BY-SA 4.0', narr='Өз мемлекеттілігімізді нығайту,'),
    S('sh14', 51.05, 52.05, IMG + 'Kazakhstan_1993_Bill_100_Obverse_jpg.jpg', 'image', grade='doc', mode='framed', fgh=1000,
      fgy=1880, bg='dark', zoom=1.0, mv=[1.0, 1.04, 0, 0, 0, 0], tdur=0.25, label='100 ТЕҢГЕ · 1993',
      desc='100 tenge banknote, first series (1993), Abylai Khan', origin='archival (banknote)',
      credit='Wikimedia Commons, public domain', narr='ұлттық валютамызды енгізу,'),
    S('sh15', 52.05, 52.95, IMG + 'Al_Farabi_2C_20_Tenge_2C_Kazakhstan_2C1993_jpg.jpg', 'image', grade='doc', mode='framed',
      fgh=1240, fgw=1240, fgy=1880, bg='dark', circle=True, zoom=1.0, mv=[1.0, 1.05, 0, 0, 0, 0], tdur=0.2,
      desc='20 tenge coin, 1993 (Al-Farabi)', origin='archival (coin)', credit='Wikimedia Commons, public domain',
      narr='(енгізу)'),
    S('sh16', 52.95, 56.50, 'assets/nasa/n5.mp4', **{'in': 32.0}, speed=0.55, grade='doc', cx=0.53, zoom=1.35,
      mv=[1.0, 1.05, 0, 0, 0, 0], label='БАЙҚОҢЫР · ХАЛЫҚАРАЛЫҚ ЫНТЫМАҚТАСТЫҚ',
      desc='Flag of Kazakhstan flying with partner flags at Baikonur Cosmodrome (2026)', origin='documentary (NASA)',
      credit=NASA, narr='халықаралық аренада өз орнымызды қалыптастыру қажет болды.'),
    S('sh17', 56.50, 60.05, 'assets/nasa/n5.mp4', **{'in': 1258.5}, speed=0.9, grade='doc', cx=0.62,
      mv=[1.0, 1.06, 0, 0, 0, 0], label='БАЙҚОҢЫР ҒАРЫШ АЙЛАҒЫ · ҚАЗАҚ ДАЛАСЫ',
      desc='Rocket rolled out by rail across the steppe at Baikonur', origin='documentary (NASA)', credit=NASA,
      narr='Қазақстан жаңа белестерге батыл қадам басты.'),
    # ---------------- SCENE 5 · The new capital ----------------
    S('sh18', 60.05, 62.75, IMG + 'Aerial_photographs_of_Astana_282026_11_07_29_0_jpg.jpg', 'image', grade='night', cx=0.5,
      mv=[1.0, 1.06, 0, 0, 40, -40], tin='fade', tdur=0.6, label='АСТАНА',
      desc='Astana at night from the air (November 2026)', origin='documentary photo', credit='Wikimedia Commons, CC BY-SA 4.0',
      narr='Жылдар өте еліміз өзгерді.'),
    S('sh19', 62.75, 67.60, IMG + 'Aerial_photographs_of_Astana_282026_11_07_29_0_1_j.jpg', 'image', grade='night', cx=0.5,
      dim=0.35, mv=[1.06, 1.0, 0, 0, 0, 0], desc='Astana city lights from the air; animated map Almaty → Astana',
      origin='documentary photo + motion graphic', credit='Wikimedia Commons, CC BY-SA 4.0',
      narr='Елордамыз бой көтеріп, жаңа қалалар мен заманауи ғимараттар пайда болды.'),
    S('sh20', 67.60, 70.40, IMG + 'Baiterek_August_jpg.jpg', 'image', grade='doc', cy=0.4, mv=[1.0, 1.06, 0, 0, 80, -40],
      label='«БӘЙТЕРЕК» МОНУМЕНТІ · АСТАНА', desc='Baiterek monument, Astana', origin='documentary photo',
      credit='Wikimedia Commons, CC0', narr='Астана тәуелсіз Қазақстанның дамуы мен'),
    S('sh21', 70.40, 73.06, IMG + 'Night_at_Esil_District_2C_Astana_28P1190721_29_jpg.jpg', 'image', grade='night', cx=0.72,
      mv=[1.0, 1.05, 0, 0, 0, 0], desc='Esil district and Baiterek at night, Astana', origin='documentary photo',
      credit='Wikimedia Commons, CC BY-SA 4.0', narr='болашаққа деген сенімінің символына айналды.'),
    # ---------------- SCENE 6 · People ----------------
    S('sh22', 73.06, 76.45, 'assets/nasa/n1.mp4', **{'in': 96.0}, speed=0.8, grade='night', mode='framed', fgh=1500, fgy=1900,
      cx=0.5, mv=[1.0, 1.04, 0, 0, 0, 0], tin='fade', tdur=0.6, label='ҚАРАҒАНДЫ · ҰЛТТЫҚ КИІМДЕГІ ҚАРСЫ АЛУ',
      desc='Hosts in Kazakh national dress welcoming guests, Karagandy International Airport (2020)',
      origin='documentary (NASA)', credit=NASA, narr='Елдің ең үлкен байлығы — оның халқы.'),
    S('sh23', 76.45, 78.75, 'assets/nasa/n5.mp4', **{'in': 1249.6}, speed=0.85, grade='doc', cx=0.4, zoom=1.0,
      mv=[1.0, 1.05, 0, 0, 0, 0], label='БАЙҚОҢЫР', desc='Workers watching the rocket rollout, Baikonur',
      origin='documentary (NASA)', credit=NASA, narr='Осы жылдар ішінде миллиондаған адам'),
    S('sh24', 78.75, 80.25, 'assets/mixkit/m48769.mp4', **{'in': 2.0}, speed=0.85, grade='warm', cx=0.55,
      mv=[1.0, 1.06, 0, 0, 0, 0], desc='Hands holding harvested grain', origin='illustrative stock', credit=MIX,
      narr='өз еңбегімен, білімімен'),
    S('sh25', 80.25, 83.45, 'assets/mixkit/m23781.mp4', **{'in': 4.0}, speed=0.9, grade='warm', cx=0.5,
      mv=[1.0, 1.06, 0, 0, 0, 0], desc='Combine harvesters working a grain field together (aerial)',
      origin='illustrative stock', credit=MIX, narr='және бірлігімен Қазақстанның дамуына үлес қосты.'),
    S('sh26', 83.45, 87.68, 'assets/nasa/n1.mp4', **{'in': 216.5}, speed=0.85, grade='doc', mode='framed', fgh=1500,
      fgy=1900, cx=0.5, mv=[1.0, 1.04, 0, 0, 0, 0], label='ҚОНАҚЖАЙЛЫҚ ДӘСТҮРІ · ШАПАН ЖАБУ',
      desc='Kazakh custom of honouring guests with a shapan and hat, Karagandy (2020)', origin='documentary (NASA)',
      credit=NASA, narr='Біздің күшіміз — татулықта, бірлікте және ортақ мақсатта.'),
    # ---------------- SCENE 7 · Modern Kazakhstan ----------------
    S('sh27', 87.68, 90.75, IMG + 'Central_Downtown_Astana_1_jpg.jpg', 'image', grade='doc', cx=0.5,
      mv=[1.0, 1.06, 0, 0, 0, 0], tin='fade', tdur=0.6, label='НҰРЖОЛ БУЛЬВАРЫ · АСТАНА',
      desc='Nurzhol Boulevard and Ak Orda, Astana', origin='documentary photo', credit='Wikimedia Commons, CC BY 2.0',
      narr='Бүгінгі Қазақстан — мүмкіндіктер елі.'),
    S('sh28', 90.75, 91.80, 'assets/mixkit/m17023.mp4', **{'in': 1.0}, speed=0.9, grade='doc', cx=0.35,
      mv=[1.0, 1.05, 0, 0, 0, 0], tdur=0.25, desc='Red-hot steel leaving a furnace', origin='illustrative stock',
      credit=MIX, narr='Өндіріс дамып,'),
    S('sh29', 91.80, 93.85, 'assets/nasa/n5.mp4', **{'in': 1108.0}, speed=0.85, grade='doc', cx=0.5,
      mv=[1.0, 1.05, 0, 0, 0, 0], tdur=0.3, label='БАЙҚОҢЫР ҒАРЫШ АЙЛАҒЫ',
      desc='Soyuz rocket being raised on the launch pad, Baikonur', origin='documentary (NASA)', credit=NASA,
      narr='білім мен технологияға жол ашылып,'),
    S('sh30', 93.85, 95.55, 'assets/nasa/n1.mp4', **{'in': 99.5}, speed=0.8, grade='night', mode='framed', fgh=1500,
      fgy=1900, cx=0.55, mv=[1.0, 1.04, 0, 0, 0, 0], tdur=0.3, desc='Kazakh national costume, Karagandy',
      origin='documentary (NASA)', credit=NASA, narr='спорт пен мәдениетте'),
    S('sh31', 95.55, 97.85, 'assets/nasa/n5.mp4', **{'in': 780.0}, speed=0.85, grade='doc', cx=0.5,
      mv=[1.0, 1.05, 0, 0, 0, 0], tdur=0.3, desc='Soyuz launcher on its transporter, Baikonur',
      origin='documentary (NASA)', credit=NASA, narr='жаңа жетістіктерге қол жеткізілуде.'),
    S('sh32', 97.85, 101.47, 'assets/nasa/n3.mp4', **{'in': 3204.5}, speed=1.0, grade='doc', cx=0.5,
      mv=[1.0, 1.06, 0, 0, 0, 0], label='БАЙҚОҢЫР · ҰШЫРЫЛЫМ', desc='Soyuz MS-20 lift-off from Baikonur (Dec 2021)',
      origin='documentary (NASA)', credit=NASA, narr='Әлі де атқарар ісіміз, бағындырар биігіміз көп.'),
    # ---------------- SCENE 8 · Next generation ----------------
    S('sh33', 101.47, 104.60, 'assets/mixkit/m48169.mp4', **{'in': 2.0}, speed=0.85, grade='warm', cx=0.5,
      mv=[1.0, 1.06, 0, 0, 0, 0], tin='fade', tdur=0.6, desc='Two children walking hand in hand toward the sunset',
      origin='illustrative stock', credit=MIX, narr='Тәуелсіздіктің ең үлкен аманаты — келер ұрпақ.'),
    S('sh34', 104.60, 108.25, 'assets/mixkit/m50116.mp4', **{'in': 0.5}, speed=0.9, grade='doc', cx=0.55,
      mv=[1.0, 1.06, 0, 0, 0, 0], desc='A student drawing a mathematical chart', origin='illustrative stock', credit=MIX,
      narr='Бүгінгі жастар — ертеңгі Қазақстанның иесі.'),
    S('sh35', 108.25, 110.90, 'assets/mixkit/m50109.mp4', **{'in': 1.0}, speed=0.9, grade='doc', cx=0.5,
      mv=[1.0, 1.05, 0, 0, 0, 0], desc='Student making notes and charts', origin='illustrative stock', credit=MIX,
      narr='Олардың білімі, арманы мен еңбегі'),
    S('sh36', 110.90, 113.01, IMG + 'Aerial_photographs_of_Astana_282026_11_07_29_0_2_j.jpg', 'image', grade='night',
      cx=0.5, mv=[1.0, 1.05, 0, 0, 0, 0], label='АСТАНА', desc='Astana at night from the air',
      origin='documentary photo', credit='Wikimedia Commons, CC BY-SA 4.0', narr='еліміздің болашағын қалыптастырады.'),
    # ---------------- SCENE 9 · Finale ----------------
    S('sh37', 113.01, 116.30, 'assets/mixkit/flag_19069.mp4', **{'in': 1.5}, speed=0.75, grade='flag', cx=0.74, zoom=1.0,
      mv=[1.0, 1.08, 0, 0, 0, 0], tin='fade', tdur=0.5, desc='Flag of Kazakhstan', origin='stock (CG flag)', credit=MIX,
      narr='Тәуелсіздігіміз мәңгі болсын!'),
    S('sh38', 116.30, 120.0, 'assets/mixkit/m17120.mp4', **{'in': 9.0}, speed=0.7, grade='warm', cx=0.5,
      mv=[1.0, 1.05, 0, 0, 0, 0], desc='Golden field at sunset under the final title', origin='illustrative stock',
      credit=MIX, narr='Қазақстан жасай берсін!'),
]

for s in shots:
    s.setdefault('tin', 'fade'); s.setdefault('tdur', 0.45); s.setdefault('in', 0.0)
json.dump(dict(plate=None, shots=shots), open(os.path.join(ROOT, 'edl.json'), 'w'), ensure_ascii=False, indent=1)
print(len(shots), 'shots')
