import { useState } from "react";
import { ChevronLeft, Check, CreditCard } from "lucide-react";
import { C, font, S } from "../theme";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

const CARD_TYPES = [
  { id: "debit", label: "Debit Card", sub: "Linked to your savings account", fee: "Free", color: "#0E1B33", recommended: false },
  { id: "credit-essential", label: "Essential Credit", sub: "Up to ₹1L limit · 45 days interest-free", fee: "Free", color: "#1A1A2E", recommended: false },
  { id: "credit-prime", label: "Prime Credit", sub: "Up to ₹5L limit · Rewards & lounge access", fee: "₹499/yr", color: "#4A2EC4", recommended: true },
];

export function ApplyCardScreen({ onBack, onNav }: Props) {
  const [selected, setSelected] = useState("credit-prime");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("done"); }, 1500);
  };

  if (step === "done") {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Check size={32} strokeWidth={2} color={C.green} />
        </div>
        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 10px", textAlign: "center", letterSpacing: "-0.5px" }}>Application submitted!</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, textAlign: "center", lineHeight: 1.6, margin: "0 0 40px" }}>We'll review your application and update you within 2 working days.</p>
        <button onClick={() => onNav("cards")} style={{ ...S.btnPrimary }}>Back to cards</button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Apply for a card</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 28px" }}>Choose the card that fits your needs</p>

        {CARD_TYPES.map(ct => (
          <div key={ct.id} onClick={() => setSelected(ct.id)}
            style={{ background: selected === ct.id ? C.surface2 : C.surface, border: `1px solid ${selected === ct.id ? C.borderMd : C.border}`, borderRadius: 16, padding: "16px", marginBottom: 12, cursor: "pointer", transition: "all 150ms", position: "relative" }}>
            {ct.recommended && (
              <span style={{ position: "absolute", top: -10, right: 16, fontFamily: font, fontSize: 11, fontWeight: 700, color: C.bg, background: C.green, padding: "3px 10px", borderRadius: 20 }}>Popular</span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 34, borderRadius: 8, background: ct.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={18} strokeWidth={1.4} color="rgba(255,255,255,0.7)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{ct.label}</p>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{ct.sub}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: ct.fee === "Free" ? C.green : C.textSub, margin: 0 }}>{ct.fee}</p>
                <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${selected === ct.id ? C.text : C.border}`, background: selected === ct.id ? C.text : "transparent", marginTop: 6, marginLeft: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selected === ct.id && <Check size={12} strokeWidth={3} color={C.bg} />}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 24 }}>
          <button onClick={handleApply} disabled={loading}
            style={{ ...S.btnPrimary, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Submitting…" : "Apply now"}
          </button>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
            Subject to credit approval and KYC verification
          </p>
        </div>
      </div>
    </div>
  );
}
