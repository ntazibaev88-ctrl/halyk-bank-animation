import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing, random} from 'remotion';
import {GOLD, GOLD_DEEP, SKY, FONT, clamp} from './theme';

const ease = Easing.out(Easing.cubic);
const Backdrop: React.FC<{hue?: 'navy' | 'sky' | 'dusk'}> = ({hue = 'navy'}) => {
  const frame = useCurrentFrame();
  const gx = 50 + 18 * Math.sin(frame / 70), gy = 38 + 6 * Math.cos(frame / 90);
  const base = hue === 'sky' ? 'linear-gradient(180deg,#02263a 0%,#045a78 55%,#0a88a8 100%)' : hue === 'dusk' ? 'linear-gradient(180deg,#050b18 0%,#0d2440 48%,#3b3550 78%,#a8643c 100%)' : 'linear-gradient(180deg,#040a14 0%,#08182a 55%,#0c2238 100%)';
  return (
    <AbsoluteFill style={{background: base}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(242,193,78,0.20) 0%, rgba(242,193,78,0.05) 28%, rgba(0,0,0,0) 55%)`}} />
      {new Array(46).fill(0).map((_, i) => {
        const x = random('x' + i) * 1080, y0 = random('y' + i) * 1920, sp = 0.25 + random('s' + i) * 0.7, r = 1 + random('r' + i) * 2.6;
        const y = (y0 - frame * sp + 1920 * 4) % 1920;
        const tw = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 14 + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: GOLD, opacity: tw}} />;
      })}
    </AbsoluteFill>
  );
};
const Line: React.FC<{at: number; w?: number; style?: React.CSSProperties}> = ({at, w = 160, style}) => {
  const frame = useCurrentFrame();
  return <div style={{height: 4, background: GOLD, width: interpolate(frame, [at, at + 24], [0, w], {...clamp, easing: ease}), ...style}} />;
};
const Rise: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; d?: number}> = ({at, children, style, d = 30}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 18], [0, 1], clamp);
  const y = interpolate(frame, [at, at + 26], [d, 0], {...clamp, easing: ease});
  return <div style={{opacity: op, transform: `translateY(${y}px)`, ...style}}>{children}</div>;
};
const col: React.CSSProperties = {position: 'absolute', left: 70, right: 70, fontFamily: FONT, color: '#fff'};

// --- 16 December 1991 ---
const Date1991: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const yr = Math.round(interpolate(frame, [8, 58], [1986, 1991], {...clamp, easing: Easing.out(Easing.quad)}));
  const glow = interpolate(frame, [58, 70, 110], [0, 1, 0.35], clamp);
  const sc = interpolate(frame, [0, dur], [1, 1.05]);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{transform: `scale(${sc})`}}>
        <div style={{...col, top: 430}}>
          <Rise at={4} style={{fontSize: 46, letterSpacing: 12, color: GOLD, fontWeight: 500}}>16 ЖЕЛТОҚСАН</Rise>
          <div style={{fontSize: 330, fontWeight: 800, letterSpacing: -6, lineHeight: 1.0, marginTop: 6, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 ${90 * glow}px rgba(242,193,78,${0.75 * glow})`, opacity: interpolate(frame, [4, 20], [0, 1], clamp)}}>{yr}</div>
          <Line at={60} w={940} style={{marginTop: 18, height: 3}} />
          <Rise at={96} style={{fontSize: 62, fontWeight: 800, letterSpacing: 4, marginTop: 44, lineHeight: 1.15}}>МЕМЛЕКЕТТІК<br />ТӘУЕЛСІЗДІК</Rise>
          <Rise at={120} style={{fontSize: 33, fontWeight: 400, letterSpacing: 1.5, marginTop: 30, lineHeight: 1.4, color: 'rgba(255,255,255,0.82)'}}>«Қазақстан Республикасының мемлекеттік<br />тәуелсіздігі туралы» Конституциялық заң</Rise>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- UN 1992 ---
const Globe: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const R = size / 2, n = 7;
  const draw = interpolate(frame, [0, 50], [0, 1], {...clamp, easing: ease});
  const mer = new Array(n).fill(0).map((_, i) => {
    const ph = ((i / n) * Math.PI + frame / 85) % Math.PI;
    return Math.cos(ph) * R;
  });
  return (
    <svg width={size} height={size} viewBox={`${-R - 6} ${-R - 6} ${size + 12} ${size + 12}`} style={{opacity: draw}}>
      <circle r={R} fill="rgba(0,175,202,0.10)" stroke={GOLD} strokeWidth={3} />
      {mer.map((rx, i) => <ellipse key={i} rx={Math.abs(rx)} ry={R} fill="none" stroke={GOLD} strokeOpacity={0.55} strokeWidth={1.6} />)}
      {[-0.66, -0.33, 0, 0.33, 0.66].map((k, i) => <ellipse key={'p' + i} cy={k * R} rx={Math.sqrt(1 - k * k) * R} ry={Math.sqrt(1 - k * k) * R * 0.16} fill="none" stroke={GOLD} strokeOpacity={0.5} strokeWidth={1.6} />)}
    </svg>
  );
};
const UN1992: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{position: 'absolute', left: 190, top: 610, transform: `scale(${interpolate(frame, [0, dur], [1, 1.06])})`}}><Globe size={700} /></div>
      <div style={{...col, top: 190}}>
        <Rise at={6} style={{fontSize: 170, fontWeight: 800, lineHeight: 1, letterSpacing: -2}}>1992</Rise>
        <Line at={18} w={200} style={{margin: '22px 0 26px'}} />
        <Rise at={24} style={{fontSize: 46, fontWeight: 600, letterSpacing: 2, color: GOLD, lineHeight: 1.25}}>2 НАУРЫЗ — ҚАЗАҚСТАН<br />БҰҰ МҮШЕСІ</Rise>
      </div>
    </AbsoluteFill>
  );
};

// --- Tenge 1993 ---
const Tenge1993: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 54], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const fill = interpolate(frame, [46, 70], [0, 1], clamp);
  const L1 = 520, L2 = 520, L3 = 620;
  const shine = interpolate(frame, [60, 110], [-300, 900], clamp);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{position: 'absolute', left: 215, top: 600, transform: `scale(${interpolate(frame, [0, dur], [1, 1.06])})`}}>
        <svg width={650} height={706} viewBox="0 0 700 760">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE08A" /><stop offset="0.5" stopColor={GOLD} /><stop offset="1" stopColor={GOLD_DEEP} /></linearGradient>
            <clipPath id="cp"><rect x="90" y="110" width="520" height="62" /><rect x="90" y="250" width="520" height="62" /><rect x="317" y="250" width="66" height="430" /></clipPath>
          </defs>
          <circle cx="350" cy="390" r="340" fill="none" stroke={GOLD} strokeOpacity={0.45} strokeWidth={2.5} strokeDasharray={2140} strokeDashoffset={2140 * (1 - p)} transform="rotate(-90 350 390)" />
          <circle cx="350" cy="390" r="312" fill="none" stroke={GOLD} strokeOpacity={0.22} strokeWidth={1.5} />
          <g fill="url(#g)" opacity={fill}>
            <rect x="90" y="110" width="520" height="62" /><rect x="90" y="250" width="520" height="62" /><rect x="317" y="250" width="66" height="430" />
          </g>
          <g fill="none" stroke={GOLD} strokeWidth={3}>
            <rect x="90" y="110" width="520" height="62" strokeDasharray={1164} strokeDashoffset={1164 * (1 - p)} />
            <rect x="90" y="250" width="520" height="62" strokeDasharray={1164} strokeDashoffset={1164 * (1 - p)} />
            <rect x="317" y="250" width="66" height="430" strokeDasharray={992} strokeDashoffset={992 * (1 - p)} />
          </g>
          <g clipPath="url(#cp)"><rect x={shine} y="0" width="120" height="760" fill="rgba(255,255,255,0.55)" transform="skewX(-20)" /></g>
        </svg>
      </div>
      <div style={{...col, top: 190}}>
        <Rise at={10} style={{fontSize: 170, fontWeight: 800, lineHeight: 1, letterSpacing: -2}}>1993</Rise>
        <Line at={22} w={200} style={{margin: '22px 0 26px'}} />
        <Rise at={28} style={{fontSize: 46, fontWeight: 600, letterSpacing: 2, color: GOLD, lineHeight: 1.25}}>15 ҚАРАША — ҰЛТТЫҚ<br />ВАЛЮТА ТЕҢГЕ</Rise>
      </div>
    </AbsoluteFill>
  );
};

// --- Astana skyline (line art, not a depiction claimed as footage) ---
const P: React.FC<{d: string; at: number; len?: number; w?: number; o?: number; fill?: string}> = ({d, at, len = 1600, w = 3, o = 1, fill}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 55], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <path d={d} fill={fill ?? 'none'} fillOpacity={fill ? interpolate(frame, [at + 40, at + 70], [0, 0.9], clamp) : 0} stroke={GOLD} strokeOpacity={o} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />;
};
const Astana: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, dur], [40, -40]);
  const sc = interpolate(frame, [0, dur], [1.0, 1.07]);
  const sun = interpolate(frame, [60, 120], [0, 1], clamp);
  const base = 1180;
  return (
    <AbsoluteFill>
      <Backdrop hue="dusk" />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', transform: `translateX(${pan}px) scale(${sc})`, transformOrigin: '50% 62%', top: -90}}>
        <defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE08A" /><stop offset="1" stopColor={GOLD_DEEP} /></linearGradient></defs>
        {/* ground */}
        <P d={`M -80 ${base} L 1160 ${base}`} at={0} len={1300} w={3} />
        {/* left towers */}
        <P d={`M 20 ${base} V 880 H 80 V ${base} M 95 ${base} V 800 L 125 770 L 155 800 V ${base} M 40 920 H 60 M 40 960 H 60 M 40 1000 H 60 M 40 1040 H 60 M 110 840 H 140 M 110 890 H 140 M 110 940 H 140 M 110 990 H 140 M 110 1040 H 140`} at={10} len={2400} w={2.4} o={0.8} />
        {/* Khan Shatyr style tent */}
        <P d={`M 170 ${base} C 215 1040 250 900 262 760 C 300 900 345 1050 372 ${base} M 262 760 L 262 700 M 215 ${base} C 240 1040 256 920 262 790 M 310 ${base} C 292 1040 272 930 262 790 M 262 ${base} V 800`} at={18} len={2600} w={2.6} />
        {/* twin towers */}
        <P d={`M 395 ${base} V 700 L 425 660 L 455 700 V ${base} M 470 ${base} V 760 H 520 V ${base} M 410 760 H 440 M 410 820 H 440 M 410 880 H 440 M 410 940 H 440 M 410 1000 H 440 M 410 1060 H 440 M 482 820 H 508 M 482 880 H 508 M 482 940 H 508 M 482 1000 H 508 M 482 1060 H 508`} at={26} len={3200} w={2.4} o={0.8} />
        {/* Baiterek */}
        <P d={`M 600 ${base} L 618 760 M 700 ${base} L 682 760 M 650 ${base} V 760 M 618 760 C 560 720 540 660 552 600 M 682 760 C 740 720 760 660 748 600 M 618 760 C 600 700 596 650 606 606 M 682 760 C 700 700 704 650 694 606 M 650 760 V 640 M 606 ${base - 190} H 694 M 610 ${base - 110} H 690`} at={34} len={3000} w={3.4} />
        <circle cx="650" cy="556" r={interpolate(frame, [70, 96], [0, 62], {...clamp, easing: ease})} fill="url(#gs)" />
        <circle cx="650" cy="556" r={62 + 60 * sun} fill="none" stroke={GOLD} strokeOpacity={0.35 * (1 - sun * 0.6)} strokeWidth={2} />
        <circle cx="650" cy="556" r={170 * sun} fill="rgba(242,193,78,0.10)" />
        {/* pyramid */}
        <P d={`M 760 ${base} L 850 1010 L 940 ${base} M 850 1010 V ${base} M 805 1095 H 895`} at={44} len={1400} w={2.6} />
        {/* right towers */}
        <P d={`M 960 ${base} V 840 C 985 800 1015 800 1040 840 V ${base} M 1055 ${base} V 920 H 1110 V ${base} M 980 900 H 1020 M 980 960 H 1020 M 980 1020 H 1020 M 980 1080 H 1020`} at={50} len={2200} w={2.4} o={0.8} />
        {/* river reflection */}
        {[].map((i: number) => <line key={i} x1={520 - i * 60 + 20 * Math.sin(frame / 20 + i)} x2={780 + i * 60 + 20 * Math.sin(frame / 20 + i)} y1={base + 40 + i * 34} y2={base + 40 + i * 34} stroke={GOLD} strokeOpacity={interpolate(frame, [70 + i * 6, 96 + i * 6], [0, 0.45 - i * 0.07], clamp)} strokeWidth={2.4} />)}
      </svg>
      <div style={{...col, top: 236}}>
        <Line at={8} w={120} style={{marginBottom: 22}} />
        <Rise at={14} style={{fontSize: 40, fontWeight: 500, letterSpacing: 5, color: GOLD}}>ТӘУЕЛСІЗДІКТІҢ ЖАҢА КЕЛБЕТІ</Rise>
      </div>
      <div style={{...col, top: 1128, textAlign: 'center'}}>
        <Rise at={56} style={{fontSize: 118, fontWeight: 800, letterSpacing: 14, lineHeight: 1.05, textShadow: '0 4px 30px rgba(0,0,0,0.6)'}}>АСТАНА</Rise>
        <Rise at={74} style={{fontSize: 34, fontWeight: 500, letterSpacing: 6, marginTop: 10, color: 'rgba(255,255,255,0.82)'}}>1997 ЖЫЛДАН — ЕЛОРДА</Rise>
      </div>
    </AbsoluteFill>
  );
};

// --- Final title ---
const Final: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const L = ['35 ЖЫЛ.', 'БІР ЕЛ.', 'БІР БОЛАШАҚ.'];
  return (
    <AbsoluteFill>
      <Backdrop hue="sky" />
      <div style={{...col, top: 520, textAlign: 'center'}}>
        {L.map((l, i) => <Rise key={i} at={8 + i * 16} style={{fontSize: i === 0 ? 170 : 112, fontWeight: 800, letterSpacing: 3, lineHeight: 1.16, color: i === 0 ? GOLD : '#fff', textShadow: '0 6px 40px rgba(0,0,0,0.45)'}}>{l}</Rise>)}
        <div style={{display: 'flex', justifyContent: 'center'}}><Line at={62} w={420} style={{margin: '54px 0 46px', height: 3}} /></div>
        <Rise at={74} style={{fontSize: 46, fontWeight: 600, letterSpacing: 5, lineHeight: 1.35}}>ТӘУЕЛСІЗ ҚАЗАҚСТАН<br />ЖАСАЙ БЕРСІН!</Rise>
      </div>
    </AbsoluteFill>
  );
};

export const Graphic: React.FC<{name: string; dur: number}> = ({name, dur}) => {
  switch (name) {
    case 'date1991': return <Date1991 dur={dur} />;
    case 'un1992': return <UN1992 dur={dur} />;
    case 'tenge1993': return <Tenge1993 dur={dur} />;
    case 'astana': return <Astana dur={dur} />;
    case 'final': return <Final dur={dur} />;
    default: return <Backdrop />;
  }
};
