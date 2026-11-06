import React from 'react';
import {useCurrentFrame} from 'remotion';
import {TL} from '../lib/timeline';
import {FONT_BODY, FONT_TITLE} from '../theme';
import {io, easeOut} from '../lib/anim';

const LABELS: Record<string, string> = {
  hook: 'ГЛОБАЛЬНОЕ ПРОТИВОСТОЯНИЕ',
  usa: 'США · ЛИДЕРСТВО',
  china: 'КИТАЙ · РЫВОК',
  chips: 'МИКРОЧИПЫ',
  ai: 'ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ',
  trade: 'МИРОВАЯ ТОРГОВЛЯ',
  resources: 'РЕДКОЗЕМЕЛЬНЫЕ МЕТАЛЛЫ',
  interdependence: 'ВЗАИМОЗАВИСИМОСТЬ',
  question: 'ГЛАВНЫЙ ВОПРОС',
};

/** Brand tag + chapter label at the top, below the TikTok tab bar. */
export const HUD: React.FC = () => {
  const frame = useCurrentFrame();
  const i = TL.scenes.findIndex((s) => frame >= s.start && frame < s.start + s.frames);
  const s = TL.scenes[i];
  if (!s || !LABELS[s.id]) return null;
  const lf = frame - s.start;
  const inP = io(lf, [4, 18], [0, 1], easeOut);
  const outP = io(lf, [s.frames - 10, s.frames], [1, 0]);
  const o = inP * outP;
  const progress = (frame / TL.totalFrames) * 100;
  return (
    <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(4,6,16,0.75), rgba(4,6,16,0.35) 60%, rgba(4,6,16,0))', opacity: o}} />
    <div style={{position: 'absolute', left: 64, right: 64, top: 168, height: 70, opacity: Math.min(1, o + 0.0)}}>
      <div style={{position: 'absolute', left: 0, top: 6, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{fontFamily: FONT_TITLE, fontSize: 34, color: '#fff', letterSpacing: 3}}>
          NOIR<span style={{color: '#ffd400'}}>X</span>
        </div>
        <div style={{width: 3, height: 30, background: 'rgba(255,255,255,0.5)'}} />
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 800,
            fontSize: 25,
            color: '#fff',
            letterSpacing: 2.5,
            transform: `translateX(${(1 - inP) * -30}px)`,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          <span style={{color: '#ffd400'}}>{String(i + 1).padStart(2, '0')}</span>&nbsp;&nbsp;{LABELS[s.id]}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 58, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)'}}>
        <div style={{width: `${progress}%`, height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#3d6fe0,#ffd400,#de2910)'}} />
      </div>
    </div>
    </>
  );
};
