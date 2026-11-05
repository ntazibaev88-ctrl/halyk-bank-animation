import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, SAFE, ease, clamp01 } from "../theme";

// Documentary-style animated title: gold rule draws, words rise out of a mask, then everything fades.
export const SceneTitle: React.FC<{ text: string; num: number; len: number; delay?: number }> = ({ text, num, len, delay = 10 }) => {
  const f = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const hold = len - delay;
  const out = ease((hold - f) / 12);
  const rule = ease(f / 18);
  return (
    <div style={{ position: "absolute", top: SAFE.top + 40, left: SAFE.left + 10, right: SAFE.right, opacity: out }}>
      <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 26, letterSpacing: 8, color: C.gold, opacity: ease(f / 10), marginBottom: 14 }}>
        {String(num).padStart(2, "0")} / 10
      </div>
      <div style={{ height: 3, width: 220 * rule, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginBottom: 22 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 18px" }}>
        {words.map((w, i) => {
          const t = ease((f - 6 - i * 4) / 16);
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 6 }}>
              <span style={{ display: "inline-block", fontFamily: F.serif, fontWeight: 700, fontSize: 78, lineHeight: 1.08, color: C.white, transform: `translateY(${(1 - t) * 105}%)`, opacity: t, textShadow: "0 4px 28px rgba(0,0,0,.7)" }}>{w}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
