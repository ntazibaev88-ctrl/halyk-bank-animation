import React from 'react';
import {ShotDef} from './components/Shot';
import {Archival, Float3D, Photo, Vid} from './components/Media';
import {Globe} from './mg/Globe';
import {DinerNotes, Founders, Wordmark} from './mg/Founders';
import {Wireframe} from './mg/Wireframe';
import {NeuralNet} from './mg/NeuralNet';
import {Label} from './components/Typography';
import {Taiwan} from './mg/Taiwan';
import {FirstJob} from './mg/FirstJob';
import HAS from './assets.generated.json';

// Credits: every non-original visual is labelled with author + licence; archive / reconstruction are marked explicitly.
const CR = {
  dasilva: 'Фото: Peter Dasilva · CC BY 4.0',
  sic66: 'Видео: SIC66SIC66 · CC BY 3.0 · кристалл GPU под микроскопом',
  lawrence: 'Видео: Lawrence Systems · CC BY 3.0 · дата-центр',
  charbax: 'Видео: Charbax · CC BY 3.0 · серверы, Computex',
  modi: 'Видео: канал Narendra Modi · CC BY 3.0 · Нью-Йорк, 2024',
  retro: 'Видео: Retro Tech · CC BY 3.0 · компьютер 1980-х (атмосфера эпохи)',
  zmaslo: 'Видео: ZMASLO · CC BY 3.0 · современная видеокарта',
  geekerwan: 'Видео: 极客湾 Geekerwan · CC BY 3.0 · стенд NVIDIA, Computex',
  robot: 'Видео: newscreators · CC BY 3.0 · гуманоидный робот',
  mg: 'Графика',
};

export const SHOTS: ShotDef[] = [
  // ───────────── 1. HOOK ─────────────
  {
    id: 'hook-portrait', start: 0, end: 2.4, transition: 'cut', grade: 'cool', credit: CR.dasilva,
    cam: {s0: 1.34, s1: 1.2, y0: 120, y1: 80, ease: 'out'},
    el: () => <Photo src="media/jh_2024.jpg" pos="50% 22%" />,
  },
  {
    id: 'hook-die', start: 2.4, end: 4.1, transition: 'zoom', tIn: 0.3, grade: 'tech', credit: CR.sic66,
    cam: {s0: 1.05, s1: 1.32},
    el: ({fps}) => <Vid src="media/die_a.mp4" from={0.5} fps={fps} />,
  },
  {
    id: 'hook-cables', start: 4.1, end: 5.95, transition: 'whip', tIn: 0.28, grade: 'tech', credit: CR.lawrence,
    cam: {s0: 1.12, s1: 1.12, x0: -50, x1: 50, ease: 'linear'},
    el: ({fps}) => <Vid src="media/cables.mp4" from={0.4} fps={fps} />,
  },
  {
    id: 'hook-superchip', start: 5.95, end: 7.7, transition: 'flash', tIn: 0.12, grade: 'tech', credit: CR.charbax,
    cam: {s0: 1.06, s1: 1.22},
    el: ({fps}) => <Vid src="media/superchip.mp4" from={1.0} fps={fps} />,
  },
  {
    id: 'hook-hall', start: 7.7, end: 9.8, transition: 'zoom', tIn: 0.32, grade: 'tech', credit: CR.lawrence,
    cam: {s0: 1.18, s1: 1.04, ease: 'out'},
    el: ({fps}) => <Vid src="media/hall.mp4" from={0.5} fps={fps} />,
  },
  {
    id: 'hook-jensen', start: 9.8, end: 12.207, transition: 'fade', tIn: 0.35, grade: 'cool', credit: CR.modi,
    cam: {s0: 1.0, s1: 1.05, y0: 0, y1: 10},
    el: ({fps}) => <Vid src="media/modi_a.mp4" from={0.6} fps={fps} />,
  },

  // ───────────── 2. CHILDHOOD ─────────────
  ...(HAS.tainan_1960s && HAS.taipei_night_1960s ? [
  {
    id: 'tainan', start: 12.207, end: 15.0, transition: 'dip', tIn: 0.45, grade: 'archival',
    credit: 'АРХИВНОЕ ФОТО · Тайнань, Тайвань, 1960-е · Public Domain',
    cam: {s0: 1.0, s1: 1.1},
    el: ({frame}) => <Archival src="media/tainan_1960s.jpg" aspect={960 / 654} frame={frame} width={1010} y={-40} />,
  },
  {
    id: 'taipei-night', start: 15.0, end: 17.3, transition: 'fade', tIn: 0.4, grade: 'archival',
    credit: 'АРХИВНОЕ ФОТО · Тайбэй, 1960-е · Public Domain',
    cam: {s0: 1.12, s1: 1.0, y0: -30, y1: 20},
    el: ({frame}) => <Archival src="media/taipei_night_1960s.jpg" aspect={982 / 1246} frame={frame} width={820} y={-60} tilt={-1} />,
  },
] : [
  {
    id: 'taiwan-map', start: 12.207, end: 17.3, transition: 'dip', tIn: 0.45, grade: 'mg', credit: 'Графика · карта Тайваня',
    cam: {s0: 1.0, s1: 1.04},
    el: ({frame, dur, fps}) => <Taiwan frame={frame} dur={dur} fps={fps} />,
  },
]) as ShotDef[],
  {
    id: 'globe', start: 17.3, end: 21.1, transition: 'zoom', tIn: 0.35, grade: 'mg', credit: 'Графика · маршрут условный',
    cam: {s0: 1, s1: 1},
    el: ({frame, dur}) => <Globe frame={frame} dur={dur} />,
  },
  {
    id: 'obi', start: 21.1, end: 25.202, transition: 'fade', tIn: 0.4, grade: 'warm',
    credit: 'Фото: Principal01 · Public Domain · Oneida Baptist Institute, Кентукки',
    cam: {s0: 1.0, s1: 1.12},
    el: ({frame}) => (
      <>
        <Archival src="media/obi_sign.jpg" aspect={544 / 380} frame={frame} width={1060} y={-20} />
        <Label text="КЕНТУККИ, США" sub="здесь он учился после переезда" x={70} y={330} delay={0.6} />
      </>
    ),
  },

  // ───────────── 3. DENNY'S ─────────────
  ...(HAS.dennys_1970s && HAS.dennys_oregon && HAS.diner_doyles && HAS.diner_salem ? [
  {
    id: 'dennys-archive', start: 25.202, end: 28.5, transition: 'dip', tIn: 0.45, grade: 'warm',
    credit: "АРХИВНОЕ ФОТО · ресторан Denny's, 1970-е · Public Domain",
    cam: {s0: 1.0, s1: 1.1, y0: 20, y1: -10},
    el: ({frame}) => <Archival src="media/dennys_1970s.jpg" aspect={960 / 910} frame={frame} width={960} y={-50} />,
  },
  {
    id: 'diner-interior', start: 28.5, end: 31.1, transition: 'whip', tIn: 0.3, grade: 'warm',
    credit: 'Фото: Xanadu73 · CC0 · интерьер американского дайнера (иллюстрация)',
    cam: {s0: 1.12, s1: 1.12, x0: 140, x1: -140, ease: 'linear'},
    el: () => <Photo src="media/diner_doyles.jpg" pos="50% 50%" />,
  },
  {
    id: 'diner-counter', start: 31.1, end: 33.4, transition: 'fade', tIn: 0.3, grade: 'warm',
    credit: 'Фото: Xanadu73 · CC0 · американский дайнер (иллюстрация)',
    cam: {s0: 1.12, s1: 1.34, x0: 0, x1: -40},
    el: () => <Photo src="media/diner_salem.jpg" pos="60% 50%" />,
  },
  {
    id: 'diner-street', start: 33.4, end: 35.9, transition: 'fade', tIn: 0.35, grade: 'warm',
    credit: 'Видео: Shawn Reed · CC BY 3.0 · улица с дайнером, США (иллюстрация)',
    cam: {s0: 1.08, s1: 1.16},
    el: ({fps}) => <Vid src="media/diner_st.mp4" from={1} fps={fps} />,
  },
  {
    id: 'dennys-sign', start: 35.9, end: 38.346, transition: 'fade', tIn: 0.35, grade: 'cool',
    credit: "Фото: Rick Obst · CC BY 4.0 · вывеска Denny's, Орегон",
    cam: {s0: 1.06, s1: 1.28, x0: 0, x1: 20},
    el: () => <Photo src="media/dennys_oregon.jpg" pos="50% 40%" />,
  },

] : [
  {
    id: 'diner-street-a', start: 25.202, end: 28.5, transition: 'dip', tIn: 0.45, grade: 'warm',
    credit: 'Видео: Shawn Reed · CC BY 3.0 · улица с дайнером, США (иллюстрация)',
    cam: {s0: 1.18, s1: 1.06, ease: 'out'},
    el: ({fps}) => <Vid src="media/diner_st.mp4" from={0} fps={fps} />,
  },
  {
    id: 'first-job', start: 28.5, end: 33.4, transition: 'whip', tIn: 0.3, grade: 'mg',
    credit: 'Графика · роли в Denny’s — по рассказам самого Хуанга',
    cam: {s0: 1.0, s1: 1.04},
    el: ({frame, fps}) => <FirstJob frame={frame} fps={fps} />,
  },
  {
    id: 'diner-street-b', start: 33.4, end: 35.9, transition: 'fade', tIn: 0.35, grade: 'warm',
    credit: 'Видео: Shawn Reed · CC BY 3.0 · улица с дайнером, США (иллюстрация)',
    cam: {s0: 1.06, s1: 1.2},
    el: ({fps}) => <Vid src="media/diner_st.mp4" from={5.2} fps={fps} />,
  },
  {
    id: 'jensen-recalls', start: 35.9, end: 38.346, transition: 'fade', tIn: 0.35, grade: 'cool',
    credit: 'Фото: NVIDIA Taiwan · CC BY 2.0 · Computex, 2016',
    cam: {s0: 1.08, s1: 1.2, y0: 40, y1: 20},
    el: () => <Photo src="media/jh_computex2016a.jpg" pos="62% 40%" />,
  },
]) as ShotDef[],

  // ───────────── 4. NVIDIA 1993 ─────────────
  {
    id: 'crt-pc', start: 38.346, end: 41.3, transition: 'glitch', tIn: 0.35, grade: 'doc', credit: CR.retro,
    cam: {s0: 1.1, s1: 1.22},
    el: ({fps}) => <Vid src="media/crt_pc.mp4" from={0.3} fps={fps} />,
  },
  {
    id: 'founders', start: 41.3, end: 44.36, transition: 'fade', tIn: 0.3, grade: 'mg', credit: CR.mg,
    cam: {s0: 1.0, s1: 1.04},
    el: ({frame, fps}) => <Founders frame={frame} fps={fps} />,
  },
  {
    id: 'napkin', start: 44.36, end: 47.0, transition: 'whip', tIn: 0.28, grade: 'mg',
    credit: 'РЕКОНСТРУКЦИЯ · по воспоминаниям основателей, идею обсуждали за столиком Denny’s',
    cam: {s0: 1.04, s1: 1.14, r0: -1, r1: 1},
    el: ({frame, fps}) => <DinerNotes frame={frame} fps={fps} />,
  },
  {
    id: 'crt-grid', start: 47.0, end: 49.4, transition: 'glitch', tIn: 0.3, grade: 'doc', credit: CR.retro,
    cam: {s0: 1.25, s1: 1.05, ease: 'out'},
    el: ({fps}) => <Vid src="media/crt_grid.mp4" from={0.2} fps={fps} />,
  },
  {
    id: 'mobo', start: 49.4, end: 50.9, transition: 'zoom', tIn: 0.28, grade: 'tech', credit: CR.charbax,
    cam: {s0: 1.25, s1: 1.08, ease: 'out'},
    el: ({fps}) => <Vid src="media/mobo.mp4" from={0.5} fps={fps} />,
  },
  {
    id: 'wordmark', start: 50.9, end: 53.066, transition: 'flash', tIn: 0.12, grade: 'mg', credit: 'Графика · надпись набрана шрифтом проекта, не логотип',
    cam: {s0: 1.0, s1: 1.06},
    el: ({frame, fps}) => <Wordmark frame={frame} fps={fps} />,
  },

  // ───────────── 5. GPU 1999 ─────────────
  {
    id: 'gf256-card', start: 53.066, end: 56.5, transition: 'dip', tIn: 0.4, grade: 'mg',
    credit: 'Фото: Hyins · Public Domain · видеокарта на GeForce 256',
    cam: {s0: 1.0, s1: 1.06},
    el: ({p}) => (
      <>
        <Float3D src="media/gf256_card.jpg" aspect={2048 / 1216} p={p} width={960} />
        <Label text="GEFORCE 256" sub="1999" x={70} y={1060} delay={1.4} />
      </>
    ),
  },
  ...(HAS.gf256_die_a ? [
  {
    id: 'gf256-die', start: 56.5, end: 59.3, transition: 'zoom', tIn: 0.32, grade: 'tech',
    credit: 'Фото: Fritzchens Fritz · CC0 · кристалл GeForce 256 (NV10)',
    cam: {s0: 1.15, s1: 1.55, r0: -2, r1: 3},
    el: () => <Photo src="media/gf256_die_a.jpg" pos="50% 50%" />,
  },
] : [
  {
    id: 'gpu-die-video', start: 56.5, end: 59.3, transition: 'zoom', tIn: 0.32, grade: 'tech', credit: CR.sic66,
    cam: {s0: 1.1, s1: 1.4, r0: -2, r1: 2},
    el: ({fps}) => <Vid src="media/die_a.mp4" from={3.2} fps={fps} />,
  },
]) as ShotDef[],
  {
    id: 'wireframe', start: 59.3, end: 62.0, transition: 'fade', tIn: 0.3, grade: 'mg', credit: 'Графика · эволюция 3D-графики',
    cam: {s0: 1, s1: 1},
    el: ({frame, dur}) => <Wireframe frame={frame} dur={dur} />,
  },
  {
    id: 'die-macro', start: 62.0, end: 64.6, transition: 'zoom', tIn: 0.3, grade: 'tech', credit: CR.sic66,
    cam: {s0: 1.08, s1: 1.25, r0: 2, r1: -1},
    el: ({fps}) => <Vid src="media/die_b.mp4" from={0.5} fps={fps} />,
  },
  {
    id: 'rtx', start: 64.6, end: 67.426, transition: 'whip', tIn: 0.3, grade: 'tech', credit: CR.zmaslo,
    cam: {s0: 1.14, s1: 1.04, ease: 'out'},
    el: ({fps}) => <Vid src="media/rtx_b.mp4" from={0.2} fps={fps} />,
  },

  // ───────────── 6. AI ERA ─────────────
  {
    id: 'racks', start: 67.426, end: 70.1, transition: 'flash', tIn: 0.12, grade: 'tech', credit: CR.lawrence,
    cam: {s0: 1.06, s1: 1.2, ease: 'linear'},
    el: ({fps}) => <Vid src="media/racks.mp4" from={0.2} fps={fps} />,
  },
  {
    id: 'neural', start: 70.1, end: 72.9, transition: 'zoom', tIn: 0.3, grade: 'mg', credit: 'Графика · нейросеть (схема)',
    cam: {s0: 1.0, s1: 1.1},
    el: ({frame, fps}) => <NeuralNet frame={frame} fps={fps} />,
  },
  {
    id: 'hgx', start: 72.9, end: 75.6, transition: 'whip', tIn: 0.28, grade: 'tech', credit: CR.geekerwan,
    cam: {s0: 1.18, s1: 1.06, ease: 'out'},
    el: ({fps}) => <Vid src="media/hgx.mp4" from={0.4} fps={fps} />,
  },
  {
    id: 'board', start: 75.6, end: 78.3, transition: 'fade', tIn: 0.3, grade: 'tech', credit: CR.charbax,
    cam: {s0: 1.06, s1: 1.22, x0: 30, x1: -30},
    el: ({fps}) => <Vid src="media/board.mp4" from={0.4} fps={fps} />,
  },
  {
    id: 'hgx-hand', start: 78.3, end: 80.75, transition: 'zoom', tIn: 0.3, grade: 'tech', credit: CR.geekerwan,
    cam: {s0: 1.1, s1: 1.2},
    el: ({fps}) => <Vid src="media/hgx_hand.mp4" from={0.3} fps={fps} />,
  },
  {
    id: 'robot', start: 80.75, end: 83.546, transition: 'glitch', tIn: 0.3, grade: 'cool', credit: CR.robot,
    cam: {s0: 1.08, s1: 1.18},
    el: ({fps}) => <Vid src="media/robot.mp4" from={0} fps={fps} />,
  },

  // ───────────── 7. LEGACY ─────────────
  ...(HAS.dennys_1970s ? [
  {
    id: 'callback-diner', start: 83.546, end: 86.3, transition: 'dip', tIn: 0.45, grade: 'archival',
    credit: "АРХИВНОЕ ФОТО · ресторан Denny's, 1970-е · Public Domain",
    cam: {s0: 1.15, s1: 1.0, ease: 'out'},
    el: ({frame}) => <Archival src="media/dennys_1970s.jpg" aspect={960 / 910} frame={frame} width={960} y={-50} />,
  },
] : [
  {
    id: 'callback-street', start: 83.546, end: 86.3, transition: 'dip', tIn: 0.45, grade: 'archival',
    credit: 'Видео: Shawn Reed · CC BY 3.0 · улица с дайнером, США (иллюстрация)',
    cam: {s0: 1.2, s1: 1.04, ease: 'out'},
    el: ({fps}) => <Vid src="media/diner_st.mp4" from={2.5} fps={fps} />,
  },
]) as ShotDef[],
  {
    id: 'keynote', start: 86.3, end: 89.3, transition: 'fade', tIn: 0.4, grade: 'cool',
    credit: 'Фото: Masaru Kamikura · CC BY 2.0 · Computex, Тайбэй, 2010',
    cam: {s0: 1.1, s1: 1.3, y0: 40, y1: 60},
    el: () => <Photo src="media/jh_computex2010.jpg" pos="36% 50%" />,
  },
  {
    id: 'jensen-live', start: 89.3, end: 91.9, transition: 'fade', tIn: 0.35, grade: 'cool', credit: CR.modi,
    cam: {s0: 1.0, s1: 1.06, y0: 0, y1: 10},
    el: ({fps}) => <Vid src="media/modi_b.mp4" from={0.5} fps={fps} />,
  },
  {
    id: 'podium', start: 91.9, end: 94.6, transition: 'fade', tIn: 0.35, grade: 'cool',
    credit: 'Фото: Офис президента Тайваня · CC BY 2.0 · 2023',
    cam: {s0: 1.06, s1: 1.18, y0: 60, y1: 40},
    el: () => <Photo src="media/jh_2023.jpg" pos="45% 30%" />,
  },
  {
    id: 'future-die', start: 94.6, end: 97.3, transition: 'zoom', tIn: 0.3, grade: 'tech', credit: CR.sic66,
    cam: {s0: 1.1, s1: 1.4},
    el: ({fps}) => <Vid src="media/die_c.mp4" from={0.5} fps={fps} />,
  },
  {
    id: 'final-portrait', start: 97.3, end: 102.37, transition: 'dip', tIn: 0.5, grade: 'cool', credit: CR.dasilva,
    cam: {s0: 1.0, s1: 1.07, y0: -10, y1: 0},
    el: () => <Photo src="media/jh_2024.jpg" pos="50% 0%" />,
  },
];
