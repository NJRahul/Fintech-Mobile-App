import { useEffect, useState } from "react";
import { C, font } from "../theme";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setFading(true), 1800);
    const t3 = setTimeout(() => onComplete(), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div style={{
      flex: 1,
      background: C.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      opacity: fading ? 0 : visible ? 1 : 0,
      transition: fading ? "opacity 250ms ease-in" : "opacity 400ms ease-out",
    }}>
      {/* Logo mark */}
      <div style={{
        width: 64, height: 64,
        borderRadius: 18,
        background: C.surface3,
        border: `1px solid ${C.borderMd}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: visible && !fading ? "translateY(0)" : "translateY(8px)",
        transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M14 3V25" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 9L25 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 19L25 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Name */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: font, fontSize: 26, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>
          meridian
        </h1>
        <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "6px 0 0", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
          banking
        </p>
      </div>

      {/* Bottom tagline */}
      <p style={{
        position: "absolute", bottom: 48,
        fontFamily: font, fontSize: 11, color: C.textDim,
        margin: 0, letterSpacing: "0.04em",
      }}>
        256-bit encrypted · RBI licensed
      </p>
    </div>
  );
}
