import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, SAFE, ease, clamp01 } from "../theme";

export const DarkBg: React.FC<{ hue?: number }> = ({ hue = 38 }) => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 70) * 18, y = 40 + Math.cos(f / 90) * 12;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, hsl(${hue} 55% 16%) 0%, ${C.ink2} 45%, ${C.ink} 100%)` }}>
      {Array.from({ length: 26 }).map((_, i) => {
        const px = (i * 137.5) % 100, sp = 0.15 + (i % 5) * 0.06;
        const py = (100 - ((i * 53 + f * sp) % 110));
        return <div key={i} style={{ position: "absolute", left: `${px}%`, top: `${py}%`, width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: 9, background: C.gold, opacity: 0.12 + (i % 4) * 0.05 }} />;
      })}
    </AbsoluteFill>
  );
};

const Center: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 760 }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top, display: "flex", flexDirection: "column", alignItems: "center" }}>{children}</div>
);

// 02_03 — 0 → 2200 counter
export const Counter2200: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const n = Math.round(2200 * ease(f / (len * 0.7)));
  const line = ease(f / (len * 0.75));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Center top={640}>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 300, color: C.gold, lineHeight: 1, textShadow: "0 0 60px rgba(242,185,59,.35)", fontVariantNumeric: "tabular-nums" }}>{n}</div>
        <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 56, letterSpacing: 14, color: C.white, marginTop: 6, opacity: ease((f - 12) / 14) }}>ЛЕТ ИСТОРИИ</div>
        <div style={{ marginTop: 60, width: 780, height: 4, background: "rgba(255,255,255,.15)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, width: `${line * 100}%`, background: C.gold }} />
          <div style={{ position: "absolute", left: `${line * 100}%`, top: -9, width: 22, height: 22, background: C.gold, transform: "translateX(-50%) rotate(45deg)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: 780, marginTop: 22, fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.mute }}>
          <span>до н. э.</span><span>наши дни</span>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 04_02 — schematic Silk Road map (real coordinates, equirectangular w/ cos(lat) correction)
const CITIES = [
  { n: "Самарканд", lon: 66.96, lat: 39.65 }, { n: "Ташкент", lon: 69.24, lat: 41.3 },
  { n: "Шымкент", lon: 69.59, lat: 42.32, hero: true }, { n: "Тараз", lon: 71.37, lat: 42.9 }, { n: "Алматы", lon: 76.89, lat: 43.24 },
];
const OTHER = [{ n: "Туркестан", lon: 68.25, lat: 43.3 }];
export const SilkRoadMap: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const W = 900, kx = W / ((77.8 - 66.2) * Math.cos((42 * Math.PI) / 180));
  const px = (lon: number) => (lon - 66.2) * Math.cos((42 * Math.PI) / 180) * kx;
  const py = (lat: number) => (44.2 - lat) * kx;
  const H = py(39.2);
  const pts = CITIES.map((c) => [px(c.lon), py(c.lat)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const total = pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const prog = ease(f / (len * 0.8));
  // caravan dot position along polyline
  let rem = prog * total, dot = pts[0];
  for (let i = 1; i < pts.length; i++) { const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (rem <= seg) { dot = [pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * rem) / seg, pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * rem) / seg]; break; } rem -= seg; dot = pts[i]; }
  const pulse = 1 + 0.25 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <DarkBg hue={30} />
      <div style={{ position: "absolute", left: 90, top: 560 }}>
        <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow: "visible" }}>
          {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={0} x2={W} y1={(H / 5) * i} y2={(H / 5) * i} stroke="rgba(255,255,255,.06)" />)}
          <path d={d} fill="none" stroke="rgba(242,185,59,.25)" strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" />
          <path d={d} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={total} strokeDashoffset={total * (1 - prog)} />
          {OTHER.map((c) => (<g key={c.n} opacity={0.5}><circle cx={px(c.lon)} cy={py(c.lat)} r={7} fill="none" stroke={C.mute} strokeWidth={3} /><text x={px(c.lon) + 16} y={py(c.lat) + 8} fill={C.mute} fontSize={30} fontFamily={F.sans} fontWeight={600}>{c.n}</text></g>))}
          {CITIES.map((c, i) => {
            const shown = prog * (pts.length - 1) >= i - 0.05; const x = px(c.lon), y = py(c.lat);
            return (
              <g key={c.n} opacity={shown ? 1 : 0.25}>
                {c.hero && <circle cx={x} cy={y} r={26 * pulse} fill="rgba(242,185,59,.2)" />}
                <circle cx={x} cy={y} r={c.hero ? 13 : 9} fill={c.hero ? C.gold : C.white} />
                <text x={x + (i === 4 ? -20 : 22)} y={y + (c.hero ? 52 : -16)} textAnchor={i === 4 ? "end" : "start"} fill={c.hero ? C.gold : C.white} fontSize={c.hero ? 46 : 32} fontFamily={F.sans} fontWeight={800}>{c.n}</text>
              </g>
            );
          })}
          <circle cx={dot[0]} cy={dot[1]} r={11} fill={C.white} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 100, top: 470, fontFamily: F.sans, fontWeight: 600, fontSize: 28, letterSpacing: 6, color: C.mute }}>СХЕМА ТОРГОВЫХ МАРШРУТОВ</div>
    </AbsoluteFill>
  );
};

// 08_03 — rank graphic, no population numbers (they change yearly)
export const Rank3: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [{ n: "Алматы", r: 1 }, { n: "Астана", r: 2 }, { n: "Шымкент", r: 3, hero: true }];
  return (
    <AbsoluteFill>
      <DarkBg />
      <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 560, textAlign: "center" }}>
        <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: C.mute, opacity: ease(f / 10) }}>ПО ЧИСЛЕННОСТИ НАСЕЛЕНИЯ</div>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 340, color: C.gold, lineHeight: 1.05, transform: `scale(${0.8 + 0.2 * ease((f - 4) / 14)})`, opacity: ease((f - 4) / 10), textShadow: "0 0 70px rgba(242,185,59,.35)" }}>№3</div>
        <div style={{ marginTop: 30 }}>
          {rows.map((r, i) => {
            const t = ease((f - 14 - i * 6) / 12);
            return (
              <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 28, margin: "0 auto 16px", width: 640, padding: "16px 30px", borderRadius: 18, opacity: t, transform: `translateX(${(1 - t) * -60}px)`, background: r.hero ? "rgba(242,185,59,.16)" : "rgba(255,255,255,.05)", border: `2px solid ${r.hero ? C.gold : "rgba(255,255,255,.1)"}` }}>
                <span style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 54, color: r.hero ? C.gold : C.mute, width: 56 }}>{r.r}</span>
                <span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 50, color: r.hero ? C.white : "rgba(255,255,255,.7)" }}>{r.n}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 10_03 — final title + FACTUM logo
export const LogoEnd: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const line1 = "ШЫМКЕНТ —", line2 = "ГОРОД, КОТОРЫЙ", line3 = "СТОИТ УЗНАТЬ";
  const logoT = ease((f - 48) / 26);
  return (
    <AbsoluteFill>
      <DarkBg />
      <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 470, textAlign: "center" }}>
        {[line1, line2, line3].map((l, i) => {
          const t = ease((f - 4 - i * 8) / 16);
          return <div key={i} style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 84, lineHeight: 1.12, color: i === 2 ? C.gold : C.white, opacity: t, transform: `translateY(${(1 - t) * 34}px)` }}>{l}</div>;
        })}
        <div style={{ margin: "56px auto 0", height: 3, width: 300 * ease((f - 30) / 20), background: C.gold }} />
        <div style={{ marginTop: 52, opacity: logoT, transform: `scale(${0.9 + 0.1 * logoT})` }}>
          <div style={{ width: 54, height: 54, margin: "0 auto 22px", border: `5px solid ${C.gold}`, transform: `rotate(${45 + (1 - logoT) * 90}deg)`, boxShadow: "0 0 40px rgba(242,185,59,.35)" }} />
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 92, color: C.white, letterSpacing: 10 + (1 - logoT) * 40, paddingLeft: 10 }}>FACTUM</div>
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.mute, letterSpacing: 8, marginTop: 8 }}>ФАКТЫ, КОТОРЫЕ ВАЖНЫ</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 1 hook: fast counter slams in over the opening drone shot
export const HookNumber: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(2200 * ease(f / 36));
  const o = Math.min(ease(f / 4), ease((84 - f) / 14));
  const s = 1.18 - 0.18 * ease(f / 20);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", opacity: o, transform: `scale(${s})` }}>
      <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 250, color: C.gold, lineHeight: 1, textShadow: "0 6px 50px rgba(0,0,0,.8), 0 0 80px rgba(242,185,59,.4)", fontVariantNumeric: "tabular-nums" }}>{n}+</div>
      <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 54, letterSpacing: 16, color: C.white, textShadow: "0 3px 24px rgba(0,0,0,.9)" }}>ЛЕТ ИСТОРИИ</div>
    </div>
  );
};
