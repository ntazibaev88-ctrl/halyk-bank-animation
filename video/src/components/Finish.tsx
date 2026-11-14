import React, {useEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

// Film grain (deterministic per frame), vignette and legibility gradients.
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.08}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext('2d')!;
    const img = ctx.createImageData(c.width, c.height);
    let s = (frame * 2654435761) >>> 0;
    for (let i = 0; i < img.data.length; i += 4) {
      s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
      const v = s & 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [frame]);
  return <canvas ref={ref} width={360} height={640} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: 'overlay', imageRendering: 'auto'}} />;
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 65% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,10,20,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,8,16,0.62) 82%, rgba(0,8,16,0.7) 100%)'}} />
  </AbsoluteFill>
);
