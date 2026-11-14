"""Writes pipeline/shots.json — the edit decision list (cut points in seconds on the VO timeline)."""
import json, os
V = 'Бейне'; P = 'Фото'
def vid(id, src, ss, start, **k): return dict(id=id, src=src, ss=ss, start=start, **k)
def pho(id, photo, start, credit, **k): return dict(id=id, photo=photo, start=start, credit=f'{P}: {credit}', **k)
yed = f'{V}: Yedil n / Wikimedia Commons · CC BY-SA 4.0'
nasa = f'{V}: NASA'
arch = f'{V}: George H. W. Bush Presidential Library · қоғамдық игілік'
shots = [
  # 1 — opening
  dict(id='s01_flag', gfx='flagWide', start=0, xf=0.8),
  vid('s02_steppe', 'c01.webm', 7.2, 4.0, xf=0.7, fx=0.5, motion={'s': [1.04, 1.12]}, credit=yed),
  vid('s03_saiga', 'c00.webm', 14.0, 7.6, xf=0.6, fx=0.42, motion={'s': [1.10, 1.03]}, credit=yed),
  vid('s04_steppe', 'c01.webm', 24.0, 11.2, xf=0.6, fx=0.5, motion={'s': [1.03, 1.10], 'y': [0, -20]}, credit=yed),
  # 2 — historical roots
  pho('s05_tamgaly', 'p22.jpg', 14.851, 'Stomac · CC BY 3.0', fx=0.45, zoom=1.15, trans='zoom', xf=0.8, motion={'s': [1.16, 1.02], 'r': [-1.2, 0]}, grade='contrast(1.1) saturate(0.95) sepia(0.12)'),
  vid('s06_herd', 'c00.webm', 26.0, 18.4, xf=0.6, fx=0.5, motion={'s': [1.04, 1.12]}, credit=yed, warm=0.4),
  pho('s07_goldman', 'p02.jpg', 21.4, 'Nurken · CC BY-SA 4.0', fx=0.5, fy=0.42, zoom=1.25, xf=0.6, motion={'s': [1.02, 1.12], 'y': [40, -10]}, warm=0.5),
  pho('s08_yasawi', 'p05.jpg', 24.4, 'Adam Harangozó · CC BY-SA 4.0', fx=0.66, fy=0.55, xf=0.6, motion={'s': [1.12, 1.02], 'x': [30, -30]}, warm=0.6),
  # 3 — 16 December 1991
  dict(id='s09_date', gfx='date1991', start=27.134, trans='flash', xf=0.4),
  dict(id='s10_flagclose', gfx='flagClose', start=34.9, xf=0.6),
  vid('s11_plain', 'c00.webm', 0.0, 38.6, xf=0.7, fx=0.5, motion={'s': [1.03, 1.10]}, credit=yed, warm=0.7),
  # 4 — building the state
  vid('s12_arch92a', 'c12.webm', 20.0, 42.231, mode='frame', trans='flash', xf=0.4, archive='АРХИВ · 19.05.1992 · ВАШИНГТОН', motion={'s': [1.0, 1.03]}, credit=arch),
  dict(id='s13_timeline', gfx='timeline9293', start=45.6, xf=0.5),
  vid('s14_arch92b', 'c12.webm', 68.0, 50.6, mode='frame', xf=0.5, archive='АРХИВ · 19.05.1992', motion={'s': [1.03, 1.0]}, credit=arch),
  # 5 — the new capital
  dict(id='s15_capmap', gfx='capitalMap', start=55.053, trans='wipe', xf=0.6),
  pho('s16_nurzhol', 'p08.jpg', 59.4, 'Ken and Nyetta · CC BY 2.0', fx=0.5, fy=0.5, zoom=1.05, xf=0.6, motion={'s': [1.02, 1.14], 'y': [20, -30]}),
  pho('s17_astananight', 'p10.jpg', 63.3, 'Matti Blume · CC BY-SA 4.0', fx=0.76, fy=0.5, xf=0.7, motion={'s': [1.14, 1.03], 'x': [-30, 20]}, grade='contrast(1.08) saturate(1.15)'),
  # 6 — people and unity
  pho('s18_girls', 'p13.jpg', 68.128, 'Talgat Orynbayev · CC BY-SA 4.0', fx=0.36, fy=0.5, xf=0.7, motion={'s': [1.03, 1.12], 'x': [25, -15]}, warm=0.4),
  pho('s19_swings', 'p14.jpg', 73.4, 'OlegShalun · CC BY-SA 4.0', fx=0.4, fy=0.5, xf=0.6, motion={'s': [1.12, 1.02], 'x': [-30, 30]}),
  # 7 — modern Kazakhstan
  vid('s20_rollout', 'n_rollout.mp4', 34.5, 78.772, trans='zoom', xf=0.6, fx=0.62, motion={'s': [1.04, 1.12]}, credit=f'{nasa} · Байқоңыр'),
  pho('s21_lab', 'p17.jpg', 82.4, 'Aidar Turlanov · CC BY 4.0', fx=0.47, fy=0.5, xf=0.6, motion={'s': [1.02, 1.12], 'x': [-25, 10]}),
  pho('s22_skyline', 'p09.jpg', 86.2, 'Jjm2311 · CC BY-SA 4.0', fx=0.5, fy=0.5, xf=0.7, motion={'s': [1.12, 1.02], 'y': [-20, 20]}, warm=0.5),
  # 8 — achievements
  vid('s23_launch', 'n_launch.mp4', 413.0, 90.626, trans='flash', xf=0.4, fx=0.52, motion={'s': [1.02, 1.08]}, credit=f'{nasa} · Байқоңыр'),
  pho('s24_dombra', 'p23.jpg', 93.9, 'Popolon · CC BY-SA 4.0', fx=0.5, fy=0.5, xf=0.6, motion={'s': [1.02, 1.11], 'y': [20, -10]}, warm=0.3),
  pho('s25_student', 'p18.jpg', 97.0, 'Kudaibergen Urinbayev · CC BY-SA 4.0', fx=0.6, fy=0.5, xf=0.6, motion={'s': [1.12, 1.02]}),
  # 9 — future generation
  pho('s26_girl', 'p11.jpg', 102.094, 'Daliya.Nurmukhammedova · CC BY-SA 4.0', fx=0.53, fy=0.5, xf=0.7, motion={'s': [1.02, 1.12], 'y': [10, -25]}, warm=0.3),
  pho('s27_family', 'p12.jpg', 105.9, 'Daliya.Nurmukhammedova · CC BY-SA 4.0', fx=0.5, fy=0.5, xf=0.6, motion={'s': [1.12, 1.02], 'y': [-20, 20]}),
  vid('s28_horizon', 'c01.webm', 28.8, 109.6, xf=0.7, fx=0.5, motion={'s': [1.03, 1.10]}, credit=yed, warm=0.8),
  # 10 — finale
  vid('s29_herd', 'c00.webm', 40.0, 113.122, xf=0.8, fx=0.5, motion={'s': [1.04, 1.11]}, credit=yed, warm=0.9),
  dict(id='s30_flagsunset', gfx='flagSunset', start=116.9, xf=1.0),
]
json.dump({'shots': shots}, open(os.path.join(os.path.dirname(__file__), 'shots.json'), 'w'), ensure_ascii=False, indent=1)
print(len(shots), 'shots;', sum(1 for s in shots if 'photo' in s), 'photos')
