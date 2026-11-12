import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {RetroCRT} from '../graphics/RetroCRT';
import type {ShotT} from '../types';

const ease = Easing.bezier(0.45, 0, 0.55, 1);

/**
 * One live-action shot. The pre-graded clip is 1280x1920 (2:3), the canvas 1080x1920, so there is
 * 200px of horizontal room for a slow lateral move on top of the push-in / pull-out.
 * Rendered inside a <Sequence> that starts `transDur` seconds before `start`.
 */
export const Shot: React.FC<{shot: ShotT}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tIn = shot.transDur * fps;
  const total = (shot.end - shot.start) * fps + tIn;
  const p = interpolate(frame, [0, total], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

  let scale = interpolate(p, [0, 1], shot.zoom);
  const x = interpolate(p, [0, 1], shot.pan);
  const y = shot.panY ? interpolate(p, [0, 1], shot.panY) : 0;

  // entrance transition
  let opacity = 1;
  let blur = shot.blur ?? 0;
  let tx = 0;
  if (tIn > 0) {
    const k = interpolate(frame, [0, tIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (shot.transIn === 'fade' || shot.transIn === 'dip') {
      opacity = Easing.inOut(Easing.cubic)(k);
    } else if (shot.transIn === 'zoom') {
      opacity = Easing.out(Easing.cubic)(Math.min(1, k * 1.6));
      scale *= interpolate(k, [0, 1], [1.28, 1], {easing: Easing.out(Easing.cubic)});
      blur += interpolate(k, [0, 1], [18, 0], {easing: Easing.out(Easing.quad)});
    } else if (shot.transIn === 'whip') {
      opacity = Math.min(1, k * 2.5);
      tx = interpolate(k, [0, 1], [380, 0], {easing: Easing.out(Easing.exp)});
      blur += interpolate(k, [0, 1], [26, 0], {easing: Easing.out(Easing.quad)});
    }
  }

  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden', backgroundColor: 'black'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${x + tx}px, ${y}px) scale(${scale})`,
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
          willChange: 'transform',
        }}
      >
        {shot.src.startsWith('gfx:') ? (
          <RetroCRT mode={shot.src.slice(4) as 'code' | 'game' | 'web'} dur={(shot.end - shot.start) + shot.transDur} />
        ) : (
          <OffthreadVideo
            src={staticFile(shot.src)}
            muted
            style={{position: 'absolute', width: 1280, height: 1920, left: -100, top: 0, objectFit: 'cover'}}
          />
        )}
      </AbsoluteFill>
      {shot.dim ? <AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${shot.dim})`}} /> : null}
    </AbsoluteFill>
  );
};
