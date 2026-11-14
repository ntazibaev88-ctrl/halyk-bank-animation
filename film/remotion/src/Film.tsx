import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, Img} from 'remotion';
import {GOLD, FONT, clamp, INK} from './theme';
import {Subtitles} from './Subtitles';
import {SceneTitle} from './SceneTitle';
import {Graphic} from './Graphics';

type Shot = {id: string; start: number; end: number; kind: 'video' | 'graphic'; file?: string; graphic?: string; label?: string; labelY?: number; credit?: string; drift?: number; fade?: number};
export type Plan = {total: number; shots: Shot[]; titles: {start: number; end: number; lines: string[]; scene: number}[]; subs: any[]; final: {start: number}};
const FPS = 30;
export const XF = 10; // crossfade frames

const ShotLayer: React.FC<{shot: Shot; first: boolean; last: boolean}> = ({shot, first, last}) => {
  const frame = useCurrentFrame();
  const dur = Math.round((shot.end - shot.start) * FPS) + XF;
  const fin = shot.fade ? Math.round(shot.fade * FPS) : XF;
  const op = first ? interpolate(frame, [0, 36], [0, 1], clamp) : interpolate(frame, [0, fin], [0, 1], {...clamp, easing: Easing.inOut(Easing.ease)});
  const d = shot.drift ?? 0.045;
  const sc = 1 + d * (frame / dur);
  return (
    <AbsoluteFill style={{opacity: op}}>
      {shot.kind === 'video' ? (
        <AbsoluteFill style={{transform: `scale(${sc})`}}>
          <OffthreadVideo src={staticFile(shot.file!)} muted style={{width: 1080, height: 1920, objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : (
        <Graphic name={shot.graphic!} dur={dur} />
      )}
      {shot.label ? <Label text={shot.label} y={shot.labelY ?? 1196} /> : null}
    </AbsoluteFill>
  );
};

const Label: React.FC<{text: string; y: number}> = ({text, y}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [14, 30], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 44, top: y, opacity: op, fontFamily: FONT, fontSize: 30, letterSpacing: 3, color: 'rgba(255,255,255,0.88)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 16, textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
      <div style={{width: 5, height: 34, background: GOLD}} />{text}
    </div>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame * 137) % 512, y = (frame * 251) % 512;
  return <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundPosition: `${x}px ${y}px`, opacity: 0.11, mixBlendMode: 'overlay'}} />;
};

export const Film: React.FC<{plan: Plan}> = ({plan}) => {
  const frame = useCurrentFrame();
  const total = Math.round(plan.total * FPS);
  const fadeOut = interpolate(frame, [total - 28, total - 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: INK}}>
      <AbsoluteFill style={{opacity: fadeOut}}>
        {plan.shots.map((s, i) => {
          const from = Math.round(s.start * FPS);
          const dur = Math.round((s.end - s.start) * FPS) + XF + 2;
          return (
            <Sequence key={s.id} from={from} durationInFrames={Math.min(dur, total - from)}>
              <ShotLayer shot={s} first={i === 0} last={i === plan.shots.length - 1} />
            </Sequence>
          );
        })}
        {/* cinematic finishing */}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.5) 100%)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 56%, rgba(0,0,0,0.62) 82%, rgba(0,0,0,0.75) 100%)'}} />
        <Grain />
        {plan.titles.map((t, i) => (
          <Sequence key={i} from={Math.round(t.start * FPS)} durationInFrames={Math.round((t.end - t.start) * FPS)}>
            <SceneTitle lines={t.lines} scene={t.scene} />
          </Sequence>
        ))}
        <Subtitles subs={plan.subs} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
