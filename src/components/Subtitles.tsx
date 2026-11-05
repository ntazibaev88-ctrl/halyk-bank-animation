import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { C, F, SAFE, ease } from "../theme";
import type { Cue } from "../types";

const IN = 6, OUT = 5;
const CueView: React.FC<{ cue: Cue }> = ({ cue }) => {
  const f = useCurrentFrame();
  const len = cue.to - cue.from;
  const tin = ease(f / IN), tout = ease((len - f) / OUT);
  const o = Math.min(tin, tout);
  const y = (1 - tin) * 22 + (1 - tout) * -8;
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: SAFE.bottom, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${y}px) scale(${0.97 + 0.03 * o})` }}>
      <div style={{ background: "rgba(5,7,10,0.38)", borderRadius: 26, padding: "18px 34px 22px", textAlign: "center", backdropFilter: "blur(2px)" }}>
        {cue.lines.map((line, i) => (
          <div key={i} style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 68, lineHeight: 1.18, letterSpacing: -0.5, whiteSpace: "nowrap", textShadow: "0 3px 0 rgba(0,0,0,.55), 0 0 22px rgba(0,0,0,.85)" }}>
            {line.map((w, j) => (
              <span key={j} style={{ color: w.hl ? C.gold : C.white }}>{w.t}{j < line.length - 1 ? " " : ""}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export const Subtitles: React.FC<{ cues: Cue[] }> = ({ cues }) => (
  <>{cues.map((c, i) => (<Sequence key={i} from={c.from} durationInFrames={c.to - c.from + 1} layout="none"><CueView cue={c} /></Sequence>))}</>
);
