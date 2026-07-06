// Shared design system — CRED-inspired premium dark theme
// Use this in all new screens. tokens.ts is kept only for legacy components.

export const C = {
  // ── Backgrounds
  bg:       "#0D0D0D",
  surface:  "#161616",
  surface2: "#1F1F1F",
  surface3: "#282828",

  // ── Borders
  border:   "rgba(255,255,255,0.07)",
  border2:  "rgba(255,255,255,0.04)",
  borderMd: "rgba(255,255,255,0.12)",

  // ── Text
  text:     "#FFFFFF",
  textSub:  "#AAAAAA",
  textMute: "#666666",
  textDim:  "#333333",

  // ── Semantic
  green:  "#00C896",
  red:    "#FF4D4D",
  amber:  "#F5A623",
  blue:   "#4A9EFF",

  // ── CTA (white button on dark bg — CRED signature)
  ctaBg:         "#FFFFFF",
  ctaText:       "#0D0D0D",
  ctaGhostBorder:"rgba(255,255,255,0.15)",
  ctaGhostText:  "#FFFFFF",
} as const;

export const font = "Inter, -apple-system, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif";

// Typography helpers
export const textStyle = {
  hero:    { fontFamily: font, fontSize: 40, fontWeight: 800 as const, letterSpacing: -1.5, lineHeight: 1.05, color: C.text },
  h1:      { fontFamily: font, fontSize: 28, fontWeight: 800 as const, letterSpacing: -0.8, color: C.text },
  h2:      { fontFamily: font, fontSize: 22, fontWeight: 700 as const, letterSpacing: -0.4, color: C.text },
  h3:      { fontFamily: font, fontSize: 18, fontWeight: 700 as const, letterSpacing: -0.2, color: C.text },
  body:    { fontFamily: font, fontSize: 15, fontWeight: 400 as const, color: C.textSub },
  bodyMd:  { fontFamily: font, fontSize: 14, fontWeight: 400 as const, color: C.textSub },
  label:   { fontFamily: font, fontSize: 12, fontWeight: 500 as const, color: C.textSub },
  caption: { fontFamily: font, fontSize: 11, fontWeight: 400 as const, color: C.textMute },
  overline:{ fontFamily: font, fontSize: 10, fontWeight: 600 as const, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.textMute },
};

// Reusable style fragments
export const S = {
  screen: {
    flex: 1,
    background: C.bg,
    display: "flex" as const,
    flexDirection: "column" as const,
    overflowY: "auto" as const,
    padding: "0 20px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "15px 16px",
    fontFamily: font,
    fontSize: 16,
    fontWeight: 500 as const,
    color: C.text,
    outline: "none",
  },
  inputFocus: {
    border: `1px solid ${C.borderMd}`,
  },
  btnPrimary: {
    width: "100%",
    height: 52,
    background: C.ctaBg,
    color: C.ctaText,
    border: "none",
    borderRadius: 12,
    fontFamily: font,
    fontSize: 16,
    fontWeight: 700 as const,
    cursor: "pointer",
    letterSpacing: "-0.2px",
  },
  btnGhost: {
    width: "100%",
    height: 52,
    background: "transparent",
    color: C.ctaGhostText,
    border: `1px solid ${C.ctaGhostBorder}`,
    borderRadius: 12,
    fontFamily: font,
    fontSize: 15,
    fontWeight: 600 as const,
    cursor: "pointer",
  },
  btnText: {
    background: "none",
    border: "none",
    fontFamily: font,
    fontSize: 14,
    fontWeight: 500 as const,
    color: C.textSub,
    cursor: "pointer",
    padding: 0,
  },
  card: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 16,
  },
} as const;
