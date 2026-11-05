import React from "react";
import { C, F, SAFE } from "../theme";
export const BrandBug: React.FC = () => (
  <div style={{ position: "absolute", top: 150, left: SAFE.left + 10, display: "flex", alignItems: "center", gap: 14, opacity: 0.92 }}>
    <div style={{ width: 14, height: 14, background: C.gold, transform: "rotate(45deg)" }} />
    <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 9, color: C.white, textShadow: "0 2px 10px rgba(0,0,0,.7)" }}>FACTUM</div>
  </div>
);
