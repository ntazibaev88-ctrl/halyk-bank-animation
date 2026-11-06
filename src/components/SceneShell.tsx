import React, {createContext, useContext} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {io, easeOut} from '../lib/anim';

type Ctx = {f: number; dur: number};
const SceneCtx = createContext<Ctx>({f: 0, dur: 1});
/** Frame relative to the official start of the current scene (may be negative during the incoming transition). */
export const useScene = () => useContext(SceneCtx);

export const SceneShell: React.FC<{
  offset: number; // frames between Sequence start and official scene start
  dur: number;
  first?: boolean;
  bg?: string;
  children: React.ReactNode;
}> = ({offset, dur, first, bg = '#070b17', children}) => {
  const f = useCurrentFrame() - offset;
  const inP = first ? 1 : io(f, [-offset, 6], [0, 1], easeOut);
  const scaleIn = first ? 1 : 1 + 0.09 * (1 - inP);
  const blur = first ? 0 : 12 * (1 - inP);
  const scaleOut = 1 + io(f, [dur - 8, dur + 12], [0, 0.06]);
  return (
    <SceneCtx.Provider value={{f, dur}}>
      <AbsoluteFill
        style={{
          backgroundColor: bg,
          opacity: inP,
          transform: `scale(${scaleIn * scaleOut})`,
          filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
          overflow: 'hidden',
        }}
      >
        {children}
      </AbsoluteFill>
    </SceneCtx.Provider>
  );
};
