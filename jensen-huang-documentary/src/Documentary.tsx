import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SHOTS} from './shots';
import {ShotLayer} from './components/Shot';
import {ChapterTag, Dips, Flashes, Grain, Hud, LightLeak, Vignette} from './components/Overlays';
import {Credit, HeroTitle, SectionTitle} from './components/Typography';
import {Subtitles} from './components/Subtitles';
import timeline from './timeline.json';
import {C, ensureFonts, F} from './theme';

ensureFonts();

const S = timeline.sections as Record<string, {start: number; end: number; voiceStart: number; voiceEnd: number}>;

const At: React.FC<{t: number; len: number; children: React.ReactNode; fps: number}> = ({t, len, children, fps}) => (
  <Sequence from={Math.round(t * fps)} durationInFrames={Math.max(1, Math.round(len * fps))} layout="none">
    {children}
  </Sequence>
);

const chapters = [
  {k: '1', label: 'ПРОЛОГ'},
  {k: '2', label: 'ДЕТСТВО'},
  {k: '3', label: 'ПЕРВАЯ РАБОТА'},
  {k: '4', label: 'ОСНОВАНИЕ'},
  {k: '5', label: 'GPU'},
  {k: '6', label: 'ЭПОХА ИИ'},
  {k: '7', label: 'НАСЛЕДИЕ'},
];

const FinalCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cta = interpolate(t, [1.7, 2.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
  const disc = interpolate(t, [2.4, 3.0], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.9) 100%)'}} />
      <HeroTitle
        top={835}
        hold={99}
        stagger={0.16}
        lines={[
          {text: 'ОТ МОЙЩИКА ПОСУДЫ', size: 74},
          {text: 'ДО СОЗДАТЕЛЯ', size: 74},
          {text: 'ТЕХНОЛОГИЧЕСКОЙ', size: 74, green: true},
          {text: 'ИМПЕРИИ', size: 74, green: true},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 1205,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: cta,
          transform: `scale(${0.85 + 0.15 * cta})`,
        }}
      >
        <div
          style={{
            background: C.green,
            color: '#061000',
            fontFamily: F.black,
            fontSize: 46,
            letterSpacing: 3,
            padding: '14px 34px',
            borderRadius: 999,
            boxShadow: `0 0 50px rgba(118,185,0,0.6)`,
          }}
        >
          ПОДПИСЫВАЙСЯ
        </div>
        <div style={{marginTop: 22, fontFamily: F.bold, fontSize: 36, color: C.white, textAlign: 'center', lineHeight: 1.2, textShadow: '0 3px 14px #000'}}>
          ВПЕРЕДИ ЕЩЁ БОЛЬШЕ
          <br />
          НЕОБЫЧНЫХ ИСТОРИЙ
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 150,
          top: 1495,
          textAlign: 'center',
          fontFamily: F.medium,
          fontSize: 19,
          lineHeight: 1.35,
          color: 'rgba(244,246,242,0.55)',
          opacity: disc,
        }}
      >
        Независимый документальный проект. Не связан с NVIDIA и не спонсируется ею.
        <br />
        Материалы — по лицензиям Creative Commons и Public Domain, авторы указаны в кадре.
      </div>
    </>
  );
};

export const Documentary: React.FC = () => {
  const {fps} = useVideoConfig();
  const sorted = SHOTS;
  const flashTimes = sorted.filter((s) => s.transition === 'flash').map((s) => s.start);
  const dips = sorted.filter((s) => s.transition === 'dip').map((s) => ({t: s.start - (s.tIn ?? 0.4) / 2, len: (s.tIn ?? 0.4) * 0.9}));
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* picture */}
      {sorted.map((s) => {
        const tIn = s.transition === 'cut' ? 0 : s.tIn ?? 0.35;
        const from = Math.max(0, Math.round((s.start - tIn) * fps));
        const to = Math.round(s.end * fps);
        const tInFrames = Math.round(s.start * fps) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={to - from} name={s.id}>
            <ShotLayer shot={s} tInFrames={tInFrames} durFrames={to - from} />
          </Sequence>
        );
      })}

      {/* lens / grade layers */}
      <LightLeak strength={0.9} />
      <Vignette />
      <Grain opacity={0.085} />
      <Dips dips={[{t: 0, len: 0.5}, ...dips, {t: timeline.duration, len: 0.6}]} />
      <Flashes times={flashTimes} />
      <At t={S['5'].start} len={S['6'].end - S['5'].start} fps={fps}>
        <Hud opacity={0.55} />
      </At>

      {/* chapter tags */}
      {chapters.slice(1).map((c, i) => (
        <At key={c.k} t={S[c.k].start + 0.3} len={S[c.k].end - S[c.k].start - 0.5} fps={fps}>
          <ChapterTag index={i + 2} label={c.label} />
        </At>
      ))}

      {/* titles */}
      <At t={9.65} len={2.5} fps={fps}>
        <HeroTitle
          top={945}
          hold={2.5}
          lines={[
            {text: 'ОТ МОЙЩИКА', size: 92},
            {text: 'ПОСУДЫ', size: 92},
            {text: 'ДО РЕВОЛЮЦИИ ИИ', size: 80, green: true},
          ]}
        />
      </At>
      <At t={S['2'].start + 0.35} len={3.9} fps={fps}>
        <SectionTitle accent="1963" rest="ТАЙВАНЬ" hold={3.9} />
      </At>
      <At t={S['3'].start + 0.35} len={3.6} fps={fps}>
        <SectionTitle accent="DENNY’S" rest="ПЕРВАЯ РАБОТА" hold={3.6} />
      </At>
      <At t={S['4'].start + 0.3} len={2.7} fps={fps}>
        <SectionTitle accent="1993" rest="ОСНОВАНИЕ NVIDIA" hold={2.7} />
      </At>
      <At t={S['5'].start + 0.35} len={3.4} fps={fps}>
        <SectionTitle accent="1999" rest="РЕВОЛЮЦИЯ GPU" hold={3.4} />
      </At>
      <At t={S['6'].start + 0.35} len={3.5} fps={fps}>
        <SectionTitle accent="NVIDIA" rest="ДВИГАТЕЛЬ ЭПОХИ ИИ" hold={3.5} />
      </At>
      <At t={97.75} len={timeline.duration - 97.75} fps={fps}>
        <FinalCard />
      </At>

      {/* credits per shot */}
      {sorted.map((s) =>
        s.credit ? (
          <At key={'cr' + s.id} t={s.start + 0.15} len={s.end - s.start - 0.25} fps={fps}>
            <Credit text={s.credit} />
          </At>
        ) : null
      )}

      <Subtitles />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};
