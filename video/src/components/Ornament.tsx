import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C} from '../theme';

// Stylised "қошқар мүйіз" (ram's horn) motif, drawn as a gold line.
const HORN = 'M0,0 C0,-38 38,-62 70,-44 C96,-29 90,4 66,8 C47,11 40,-10 54,-18';
const unit = (
  <>
    <path d={HORN} />
    <path d={HORN} transform="scale(-1,1)" />
    <path d={HORN} transform="scale(1,-1)" />
    <path d={HORN} transform="scale(-1,-1)" />
    <path d="M0,-58 L0,58" />
  </>
);

export const Ornament: React.FC<{t0?: number; dur?: number; width?: number; color?: string; repeat?: number; opacity?: number}> = ({t0 = 0, dur = 36, width = 520, color = C.gold, repeat = 1, opacity = 1}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t0, t0 + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const unitW = 200;
  const total = unitW * repeat;
  const lineLen = 240;
  return (
    <svg width={width} height={width * 130 / (total + lineLen * 2)} viewBox={`${-total / 2 - lineLen} -65 ${total + lineLen * 2} 130`} style={{overflow: 'visible', opacity}}>
      <g fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" style={{strokeDashoffset: 1 - p}}>
        {Array.from({length: repeat}).map((_, i) => (
          <g key={i} transform={`translate(${-total / 2 + unitW / 2 + i * unitW},0)`}>
            {React.Children.map(unit.props.children, (ch: any) => React.cloneElement(ch, {pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - p}))}
          </g>
        ))}
        <path d={`M${-total / 2 - 20},0 L${-total / 2 - lineLen},0`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <path d={`M${total / 2 + 20},0 L${total / 2 + lineLen},0`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <circle cx={-total / 2 - lineLen - 10} cy={0} r={5} fill={color} opacity={p} />
        <circle cx={total / 2 + lineLen + 10} cy={0} r={5} fill={color} opacity={p} />
      </g>
    </svg>
  );
};
