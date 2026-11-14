import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import shotsData from './data/shots.json';
import tl from './data/timeline.json';
import {ShotView, ShotSpec} from './components/Shot';
import {CapitalMap, Date1991, DeepBg, FlagHero, Particles, Timeline9293} from './components/Graphics';
import {Subtitles} from './components/Subtitles';
import {Grain, Vignette} from './components/Finish';
import {Overlays} from './Overlays';
import {sec} from './theme';

type S = ShotSpec & {dur: number; gfx?: string};
const shots = (shotsData as any).shots as S[];

const Gfx: React.FC<{name: string; durF: number}> = ({name, durF}) => {
  switch (name) {
    case 'flagWide': return <FlagHero variant="wide" durF={durF} />;
    case 'flagClose': return <FlagHero variant="close" durF={durF} />;
    case 'flagSunset': return <FlagHero variant="sunset" durF={durF} />;
    case 'date1991': return <Date1991 durF={durF} />;
    case 'capitalMap': return <CapitalMap durF={durF} />;
    case 'timeline9293': return <AbsoluteFill><DeepBg hue="navy" /><Particles n={40} seed="tl" /><Timeline9293 durF={durF} /></AbsoluteFill>;
    default: return null;
  }
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots.map((s) => {
        const from = sec(s.start);
        const durF = sec(s.dur);
        const xfF = sec(s.xf ?? 0.5);
        return (
          <Sequence key={s.id} from={from} durationInFrames={durF} name={s.id}>
            <ShotView spec={s} durF={durF} xfF={s.trans === 'cut' ? 0 : xfF}>
              {s.gfx ? <Gfx name={s.gfx} durF={durF} /> : null}
            </ShotView>
          </Sequence>
        );
      })}
      <Vignette />
      <Overlays />
      <Subtitles />
      <Grain opacity={0.07} />
      <Audio src={staticFile('audio/final_mix.wav')} />
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = Math.ceil((tl as any).total * 30);
