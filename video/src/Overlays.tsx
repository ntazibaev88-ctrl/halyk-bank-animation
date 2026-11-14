import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import tl from './data/timeline.json';
import {Title, TitleLine} from './components/Title';
import {Ornament} from './components/Ornament';
import {C, SANS, SERIF, sec} from './theme';

const S: Record<number, any> = Object.fromEntries((tl as any).scenes.map((s: any) => [s.scene, s]));
const SENT: Record<string, any> = Object.fromEntries((tl as any).sentences.map((s: any) => [s.id, s]));

type T = {at: number; until: number; top: number; lines: TitleLine[]; kicker?: string; ornament?: boolean};

const titles: T[] = [
  {at: SENT.s1c.start + 0.3, until: S[1].end - 0.2, top: 250, lines: [
    {text: 'ҚАЗАҚСТАН —', font: 'sans', size: 70, tracking: 8},
    {text: 'ТӘУЕЛСІЗДІГІНЕ', font: 'serif', size: 88, tracking: 2},
    {text: '*35* ЖЫЛ', font: 'serif', size: 168},
  ]},
  {at: S[2].start + 0.6, until: SENT.s2b.start + 3.2, top: 300, lines: [
    {text: 'ҰЛЫ ДАЛА.', font: 'serif', size: 104},
    {text: 'ТЕРЕҢ ТАРИХ.', font: 'serif', size: 104},
    {text: '*АЗАТ* *РУХ.*', font: 'serif', size: 104},
  ]},
  {at: SENT.s5c.start - 0.2, until: S[5].end - 0.1, top: 290, kicker: '1997 · 1998', lines: [
    {text: '*АСТАНА* —', font: 'serif', size: 120},
    {text: 'ТӘУЕЛСІЗДІКТІҢ СИМВОЛЫ', font: 'sans', size: 56, tracking: 3},
  ]},
  {at: SENT.s6b.start + 0.4, until: S[6].end - 0.1, top: 300, lines: [
    {text: 'БІРЛІК.', font: 'serif', size: 112},
    {text: 'БЕЙБІТШІЛІК.', font: 'serif', size: 104},
    {text: '*БОЛАШАҚ.*', font: 'serif', size: 112},
  ]},
  {at: SENT.s7b.start - 0.4, until: S[7].end - 0.1, top: 300, lines: [
    {text: 'ЖАҢА ДӘУІР.', font: 'serif', size: 110},
    {text: '*ЖАҢА* *МҮМКІНДІКТЕР.*', font: 'sans', size: 64, tracking: 2},
  ]},
  {at: SENT.s8b.start - 0.3, until: S[8].end - 0.1, top: 300, lines: [
    {text: 'ҚАЗАҚСТАН —', font: 'sans', size: 72, tracking: 6},
    {text: 'ӘЛЕМГЕ ТАНЫЛҒАН *ЕЛ*', font: 'serif', size: 96},
  ]},
  {at: SENT.s9b.start + 0.2, until: S[9].end - 0.1, top: 300, lines: [
    {text: '*БОЛАШАҚ* —', font: 'serif', size: 116},
    {text: 'ЖАС ҰРПАҚТЫҢ ҚОЛЫНДА', font: 'sans', size: 60, tracking: 3},
  ]},
];

const EndCard: React.FC<{durF: number}> = ({durF}) => {
  const f = useCurrentFrame();
  const a = (t0: number, d = 20) => interpolate(f, [t0, t0 + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const words = ['35 ЖЫЛ.', 'БІР ЕЛ.', 'БІР БОЛАШАҚ.'];
  const fadeOut = interpolate(f, [durF - 20, durF], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,14,24,0.0) 0%, rgba(2,14,24,0.55) 30%, rgba(2,14,24,0.55) 62%, rgba(2,14,24,0.0) 85%)', opacity: a(0, 30)}} />
      <div style={{position: 'absolute', top: 520, left: 40, right: 40, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {words.map((w, i) => (
          <div key={i} style={{fontFamily: SERIF, fontWeight: 700, fontSize: i === 0 ? 150 : 112, lineHeight: 1.12,
            color: i === 0 ? C.goldBright : C.white, opacity: a(i * 14), transform: `translateY(${(1 - a(i * 14)) * 40}px)`,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)'}}>{w}</div>
        ))}
        <div style={{marginTop: 30}}><Ornament t0={40} dur={36} width={640} /></div>
        <div style={{marginTop: 34, fontFamily: SANS, fontWeight: 800, fontSize: 50, letterSpacing: 2, textAlign: 'center', lineHeight: 1.25,
          color: C.white, opacity: a(58), transform: `scale(${0.94 + 0.06 * a(58)})`, textShadow: '0 4px 24px rgba(0,0,0,0.7)'}}>
          ТӘУЕЛСІЗ <span style={{color: C.goldBright}}>ҚАЗАҚСТАН</span><br />ЖАСАЙ БЕРСІН!
        </div>
      </div>
      <div style={{position: 'absolute', left: 80, right: 150, bottom: 300, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 19,
        lineHeight: 1.45, color: 'rgba(255,255,255,0.6)', opacity: a(90)}}>
        Бейнематериалдар: Wikimedia Commons (CC BY / CC BY-SA), NASA (қоғамдық игілік).<br />Музыка — түпнұсқа. Толық тізім — сипаттамада.
      </div>
    </AbsoluteFill>
  );
};

export const END_AT = () => SENT.s10c.start - 0.3;

export const Overlays: React.FC = () => {
  const total = (tl as any).total;
  return (
    <AbsoluteFill>
      {titles.map((t, i) => (
        <Sequence key={i} from={sec(t.at)} durationInFrames={sec(t.until - t.at)}>
          <Title lines={t.lines} dur={sec(t.until - t.at)} top={t.top} kicker={t.kicker} ornament={t.ornament ?? true} />
        </Sequence>
      ))}
      <Sequence from={sec(END_AT())} durationInFrames={sec(total - END_AT())}>
        <EndCard durF={sec(total - END_AT())} />
      </Sequence>
    </AbsoluteFill>
  );
};
