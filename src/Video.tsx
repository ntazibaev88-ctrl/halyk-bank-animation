import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ensureFonts} from './lib/fonts';
import {POST, PRE, TL} from './lib/timeline';
import {SceneShell} from './components/SceneShell';
import {Subtitles} from './components/Subtitles';
import {HUD} from './components/HUD';
import {io} from './lib/anim';
import {Scene01Hook} from './scenes/Scene01Hook';
import {Scene02USA} from './scenes/Scene02USA';
import {Scene03China} from './scenes/Scene03China';
import {Scene04Chips} from './scenes/Scene04Chips';
import {Scene05AI} from './scenes/Scene05AI';
import {Scene06Trade} from './scenes/Scene06Trade';
import {Scene07Resources} from './scenes/Scene07Resources';
import {Scene08Interdependence} from './scenes/Scene08Interdependence';
import {Scene09Question} from './scenes/Scene09Question';
import {Scene10Final} from './scenes/Scene10Final';

ensureFonts();

export const SCENES: Record<string, React.FC> = {
  hook: Scene01Hook,
  usa: Scene02USA,
  china: Scene03China,
  chips: Scene04Chips,
  ai: Scene05AI,
  trade: Scene06Trade,
  resources: Scene07Resources,
  interdependence: Scene08Interdependence,
  question: Scene09Question,
  final: Scene10Final,
};

/** Light flash + streak on every cut. */
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = TL.scenes.slice(1).find((s) => Math.abs(frame - s.start) <= 10);
  if (!cut) return null;
  const d = frame - cut.start;
  const o = d < 0 ? io(d, [-8, 0], [0, 0.5]) : io(d, [0, 9], [0.5, 0]);
  const sx = io(d, [-8, 9], [-600, 1400]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, rgba(255,236,190,0.95), rgba(255,200,120,0.35) 45%, rgba(0,0,0,0) 75%)', opacity: o, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', top: -200, left: sx, width: 180, height: 2400, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))', opacity: o * 1.4}} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#05070f'}}>
      {TL.scenes.map((s, i) => {
        const Comp = SCENES[s.id];
        const from = Math.max(0, s.start - PRE);
        const end = Math.min(TL.totalFrames, s.start + s.frames + POST);
        return (
          <Sequence key={s.id} from={from} durationInFrames={end - from} name={`${String(i + 1).padStart(2, '0')} ${s.id}`}>
            <SceneShell offset={s.start - from} dur={s.frames} first={i === 0}>
              <Comp />
            </SceneShell>
          </Sequence>
        );
      })}
      <CutFlash />
      <HUD />
      <Subtitles />
      <Audio src={staticFile('audio/voiceover.wav')} volume={1} />
      <Audio src={staticFile('audio/music.wav')} volume={1} />
      <Audio src={staticFile('audio/sfx.wav')} volume={1} />
    </AbsoluteFill>
  );
};
