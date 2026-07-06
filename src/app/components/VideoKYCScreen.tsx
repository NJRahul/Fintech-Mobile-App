// ⚠️ REGULATORY PLACEHOLDER — Video KYC (VCIP)
// Production: integrate a SEBI/RBI-approved VCIP provider:
// Options: IDfy, Signzy, Jalpan, Karza Technologies
// Requirements: Scheduled between 9 AM – 6 PM IST, face-match, liveness check,
//               agent-assisted or AI-assisted session, recording stored for 2+ years.

import { useState } from "react";
import { ChevronLeft, Video, Wifi, Sun, User } from "lucide-react";
import { C, font, S } from "../theme";

interface VideoKYCScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const TIPS = [
  { Icon: Sun,  text: "Good lighting — face clearly visible" },
  { Icon: Wifi, text: "Stable internet connection" },
  { Icon: User, text: "Original PAN card in hand" },
];

export function VideoKYCScreen({ onBack, onComplete }: VideoKYCScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onComplete(); }, 1200);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px", overflowY: "auto" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4, marginTop: 56, marginBottom: 32, width: "fit-content" }}
      >
        <ChevronLeft size={18} strokeWidth={2} color={C.textSub} />
        <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
      </button>

      {/* Progress dots — step 2 of 2 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
        {[0,1].map(i => (
          <div key={i} style={{ height: 3, flex: i === 0 ? 1 : 2, background: C.text, borderRadius: 999 }} />
        ))}
      </div>

      {/* Heading */}
      <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
        Video KYC
      </p>
      <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 32px", lineHeight: 1.6 }}>
        A quick 3-minute video call to verify your identity.
      </p>

      {/* Camera placeholder */}
      <div style={{
        width: "100%",
        aspectRatio: "4/3",
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Corner brackets */}
        {[["0","0","right","bottom"],["auto","0","left","bottom"],["0","auto","right","top"],["auto","auto","left","top"]].map(([b,r,br,tr], i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: b === "auto" ? undefined : 12,
            top: b !== "auto" ? undefined : 12,
            right: r === "auto" ? undefined : 12,
            left: r !== "auto" ? undefined : 12,
            width: 24, height: 24,
            borderBottom: b !== "auto" ? `2px solid ${C.borderMd}` : undefined,
            borderTop: b === "auto" ? `2px solid ${C.borderMd}` : undefined,
            borderRight: r !== "auto" ? `2px solid ${C.borderMd}` : undefined,
            borderLeft: r === "auto" ? `2px solid ${C.borderMd}` : undefined,
            borderRadius: br === "right" && tr === "bottom" ? "0 0 4px 0" :
                          br === "left" && tr === "bottom" ? "0 0 0 4px" :
                          br === "right" && tr === "top" ? "0 4px 0 0" : "4px 0 0 0",
          }} />
        ))}

        <div style={{ width: 56, height: 56, borderRadius: 999, background: C.surface3, border: `1px solid ${C.borderMd}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Video size={24} color={C.textSub} strokeWidth={1.6} />
        </div>
        <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>Camera preview</p>
      </div>

      {/* Tips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {TIPS.map(({ Icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={16} color={C.textSub} strokeWidth={1.6} />
            </div>
            <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Production note */}
      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 28 }}>
        <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: C.textSub }}>⚠️ Production:</strong> This screen will initiate a VCIP-compliant video session via an RBI-approved provider. Sessions are recorded and available 9 AM – 6 PM IST on working days.
        </p>
      </div>

      {/* CTAs */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={handleStart} style={{ ...S.btnPrimary, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Starting session…" : "Start Video KYC"}
        </button>
        <button onClick={onComplete} style={{ ...S.btnText, textAlign: "center", color: C.textMute, fontSize: 14 }}>
          Schedule for later
        </button>
      </div>
    </div>
  );
}
