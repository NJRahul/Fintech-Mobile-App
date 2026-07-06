import { useState } from "react";
import { ChevronLeft, Copy, Check, Share2 } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";

interface Props {
  onBack: () => void;
}

export function ReferralScreen({ onBack }: Props) {
  const state = useAppState();
  const [copied, setCopied] = useState(false);
  const code = "PRIYA2024";

  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 56, margin: "0 0 16px" }}>🎁</p>
          <p style={{ fontFamily: font, fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 10px", letterSpacing: "-0.6px" }}>Refer & earn</p>
          <p style={{ fontFamily: font, fontSize: 15, color: C.textSub, margin: 0, lineHeight: 1.6 }}>
            Invite friends and earn{"\n"}1,000 coins per successful referral
          </p>
        </div>

        {/* Code */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 10px" }}>Your referral code</p>
          <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 16px", letterSpacing: "0.15em" }}>{code}</p>
          <button onClick={copy}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: copied ? C.green : C.surface2, border: `1px solid ${copied ? C.green : C.border}`, borderRadius: 10, padding: "10px 20px", cursor: "pointer", transition: "all 200ms" }}>
            {copied ? <Check size={16} strokeWidth={2.5} color="#000" /> : <Copy size={16} strokeWidth={1.8} color={C.textSub} />}
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: copied ? "#000" : C.text }}>{copied ? "Copied!" : "Copy code"}</span>
          </button>
        </div>

        <button style={{ ...S.btnGhost, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          <Share2 size={18} strokeWidth={1.6} />
          Share invite link
        </button>

        {/* How it works */}
        <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>How it works</p>
        {[
          { step: "1", text: "Share your code with a friend" },
          { step: "2", text: "They sign up and complete KYC" },
          { step: "3", text: "Both of you earn 1,000 coins instantly" },
        ].map(({ step, text }) => (
          <div key={step} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text }}>{step}</span>
            </div>
            <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: 0, paddingTop: 6, lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}

        {/* Past referrals */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginTop: 8 }}>
          <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Recent referrals</p>
          {state.rewards.history.filter(e => e.description.startsWith("Referral")).map(e => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textSub, margin: 0 }}>{e.description}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.green, margin: 0 }}>+{e.points}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
