export const C = {
  gold: "#F2B93B", goldSoft: "#D9A441", white: "#FFFFFF", ink: "#07090D", ink2: "#10141C", mute: "#9AA3B2",
};
export const F = { sans: "'FactumSans', 'Montserrat', 'DejaVu Sans', sans-serif", serif: "'FactumSerif', 'Playfair Display', Georgia, serif" };
// TikTok / Reels safe zones for 1080x1920 (keep text inside)
export const SAFE = { top: 220, bottom: 480, left: 80, right: 150 };
export const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
