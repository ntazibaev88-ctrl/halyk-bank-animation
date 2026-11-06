import React from 'react';
import {rand} from '../lib/anim';

/**
 * Articulated industrial robot arm. Angles in degrees (0 = straight up).
 * tool: welder draws sparks at the tip when `sparks` > 0.
 */
export const RobotArm: React.FC<{
  x: number;
  y: number;
  s?: number;
  a1: number;
  a2: number;
  a3: number;
  color?: string;
  dark?: string;
  tool?: 'welder' | 'gripper';
  sparks?: number;
  frame: number;
  grip?: number; // 0 open .. 1 closed
  L1?: number;
  L2?: number;
}> = ({x, y, s = 1, a1, a2, a3, color = '#f29f1d', dark = '#3a3f52', tool = 'welder', sparks = 0, frame, grip = 0.5, L1 = 170, L2 = 150}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={70} ry={12} fill="#000" opacity={0.25} />
    <rect x={-56} y={-20} width={112} height={26} rx={6} fill={dark} />
    <path d="M-40,-20 L-30,-62 L30,-62 L40,-20 Z" fill={color} />
    <circle cx={0} cy={-62} r={30} fill={dark} />
    <g transform={`translate(0 -62) rotate(${a1})`}>
      <rect x={-20} y={-L1} width={40} height={L1} rx={20} fill={color} />
      <rect x={-20} y={-L1} width={14} height={L1} rx={7} fill="#fff" opacity={0.25} />
      <circle cx={0} cy={0} r={14} fill="#fff" opacity={0.5} />
      <g transform={`translate(0 ${-L1}) rotate(${a2})`}>
        <circle r={26} fill={dark} />
        <rect x={-15} y={-L2} width={30} height={L2} rx={15} fill={color} />
        <rect x={-15} y={-L2} width={10} height={L2} rx={5} fill="#fff" opacity={0.25} />
        <circle r={10} fill="#fff" opacity={0.5} />
        <g transform={`translate(0 ${-L2}) rotate(${a3})`}>
          <circle r={17} fill={dark} />
          {tool === 'welder' ? (
            <g>
              <rect x={-8} y={-52} width={16} height={46} rx={4} fill="#c9d1de" />
              <rect x={-4} y={-66} width={8} height={16} fill="#6b7489" />
              {sparks > 0 && (
                <g transform="translate(0 -70)">
                  <circle r={16 + 6 * Math.sin(frame * 2.1)} fill="#fff7c2" opacity={0.85 * sparks} />
                  <circle r={34} fill="#ffcf4a" opacity={0.25 * sparks} />
                  {Array.from({length: 12}).map((_, i) => {
                    const p = ((frame * 0.11 + rand(i) ) % 1);
                    const ang = -Math.PI / 2 + (rand(i + 7) - 0.5) * 2.6;
                    const d = p * (40 + rand(i + 3) * 60);
                    const gx = Math.cos(ang) * d * -1;
                    const gy = -Math.sin(ang) * d * -1 + p * p * 40;
                    return <line key={i} x1={gx * 0.8} y1={gy * 0.8} x2={gx} y2={gy} stroke="#ffd25a" strokeWidth={3} opacity={(1 - p) * sparks} strokeLinecap="round" />;
                  })}
                </g>
              )}
            </g>
          ) : (
            <g>
              <rect x={-24} y={-22} width={48} height={14} rx={4} fill="#c9d1de" />
              <rect x={-24 + grip * 10} y={-50} width={10} height={30} rx={3} fill="#6b7489" />
              <rect x={14 - grip * 10} y={-50} width={10} height={30} rx={3} fill="#6b7489" />
            </g>
          )}
        </g>
      </g>
    </g>
  </g>
);
