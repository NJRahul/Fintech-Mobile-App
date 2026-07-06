import { useState } from "react";
import { ChevronLeft, Fingerprint, ShieldCheck } from "lucide-react";
import { C, font, S } from "../theme";
import { authService } from "../../services/auth";

interface BiometricSetupScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export function BiometricSetupScreen({ onBack, onComplete }: BiometricSetupScreenProps) {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    await authService.setupBiometric();
    setLoading(false);
    setEnabled(true);
    setTimeout(onComplete, 600);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4, marginTop: 56, marginBottom: 48, width: "fit-content" }}
      >
        <ChevronLeft size={18} strokeWidth={2} color={C.textSub} />
        <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
      </button>

      {/* Content — centered vertically */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
        {/* Icon */}
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: enabled ? `rgba(0,200,150,0.12)` : C.surface2,
          border: `1px solid ${enabled ? "rgba(0,200,150,0.25)" : C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 32,
          transition: "all 400ms ease",
        }}>
          {enabled
            ? <ShieldCheck size={44} color={C.green} strokeWidth={1.4} />
            : <Fingerprint size={44} color={C.textSub} strokeWidth={1.2} />
          }
        </div>

        {/* Heading */}
        <p style={{ fontFamily: font, fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 12px", letterSpacing: "-0.5px", textAlign: "center" }}>
          {enabled ? "All set!" : "Keep it secure"}
        </p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 48px", textAlign: "center", lineHeight: 1.65, maxWidth: 280 }}>
          {enabled
            ? "Biometric authentication is enabled. You can manage this in Settings anytime."
            : "Use Face ID or fingerprint to sign in instantly — no PIN needed every time."
          }
        </p>

        {/* Security bullets */}
        {!enabled && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginBottom: 48 }}>
            {[
              "Stored securely on your device",
              "Never sent to our servers",
              "Disable anytime in Settings",
            ].map(txt => (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: C.textMute, flexShrink: 0 }} />
                <span style={{ fontFamily: font, fontSize: 13, color: C.textMute }}>{txt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTAs */}
      {!enabled && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={handleEnable} disabled={loading} style={{ ...S.btnPrimary, opacity: loading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Fingerprint size={18} strokeWidth={1.8} color={C.ctaText} />
            {loading ? "Setting up…" : "Enable Biometric"}
          </button>
          <button onClick={onComplete} style={{ ...S.btnText, textAlign: "center", color: C.textMute, fontSize: 14 }}>
            I'll do this later
          </button>
        </div>
      )}
    </div>
  );
}
