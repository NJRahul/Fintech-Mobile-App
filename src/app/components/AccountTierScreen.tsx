import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { C, font, S } from "../theme";

interface AccountTierScreenProps {
  onBack: () => void;
  onSelect: (tier: "essential" | "savings" | "prime") => void;
}

const TIERS = [
  {
    id: "essential" as const,
    name: "Essential",
    subtitle: "Get started, no frills",
    kyc: "Min KYC",
    price: "Free",
    features: ["₹10,000 wallet limit", "₹5,000/day transfers", "UPI payments", "Basic statements"],
    badge: null,
  },
  {
    id: "savings" as const,
    name: "Savings",
    subtitle: "Full banking in your pocket",
    kyc: "Full KYC",
    price: "Free",
    features: ["Full bank account", "₹5L/day transfers", "Debit card included", "FDs & RDs", "Instant loans", "24/7 support"],
    badge: "Most popular",
  },
  {
    id: "prime" as const,
    name: "Prime",
    subtitle: "Banking meets wealth management",
    kyc: "Full KYC",
    price: "₹499/mo",
    features: ["Everything in Savings", "Mutual funds & gold", "Zero forex charges", "Priority support", "Dedicated RM", "Lounge access"],
    badge: "Premium",
  },
];

export function AccountTierScreen({ onBack, onSelect }: AccountTierScreenProps) {
  const [selected, setSelected] = useState<"essential" | "savings" | "prime">("savings");

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 20px 32px", overflowY: "auto" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4, marginTop: 56, marginBottom: 32, width: "fit-content" }}
      >
        <ChevronLeft size={18} strokeWidth={2} color={C.textSub} />
        <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
      </button>

      {/* Heading */}
      <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
        Choose your plan
      </p>
      <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 32px", lineHeight: 1.6 }}>
        You can upgrade or downgrade anytime from your profile.
      </p>

      {/* Tier cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {TIERS.map(({ id, name, subtitle, kyc, price, features, badge }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              style={{
                background: isSelected ? C.surface2 : C.surface,
                border: `1.5px solid ${isSelected ? C.borderMd : C.border}`,
                borderRadius: 18,
                padding: "18px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 150ms ease",
                position: "relative",
              }}
            >
              {/* Badge */}
              {badge && (
                <span style={{
                  position: "absolute", top: -1, right: 16,
                  background: isSelected ? C.text : C.surface3,
                  color: isSelected ? C.bg : C.textSub,
                  fontFamily: font, fontSize: 10, fontWeight: 700,
                  padding: "3px 10px", borderRadius: "0 0 8px 8px",
                  letterSpacing: "0.04em", textTransform: "uppercase",
                  transition: "all 150ms",
                }}>
                  {badge}
                </span>
              )}

              {/* Header row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{name}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{subtitle}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 999,
                    background: isSelected ? C.text : "transparent",
                    border: `1.5px solid ${isSelected ? C.text : C.borderMd}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 150ms",
                    flexShrink: 0,
                  }}>
                    {isSelected && <Check size={12} color={C.bg} strokeWidth={2.5} />}
                  </div>
                </div>
              </div>

              {/* KYC + price row */}
              <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.textMute, background: C.surface3, padding: "3px 8px", borderRadius: 6 }}>
                  {kyc}
                </span>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: isSelected ? C.text : C.textMute, background: isSelected ? C.surface3 : C.surface2, padding: "3px 8px", borderRadius: 6 }}>
                  {price}
                </span>
              </div>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 999, background: isSelected ? "rgba(255,255,255,0.12)" : C.surface3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={9} color={isSelected ? C.text : C.textMute} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontFamily: font, fontSize: 13, color: isSelected ? C.textSub : C.textMute }}>{f}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ marginTop: "auto" }}>
        <button onClick={() => onSelect(selected)} style={{ ...S.btnPrimary }}>
          Continue with {TIERS.find(t => t.id === selected)?.name}
        </button>
        <p style={{ fontFamily: font, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
          Min KYC accounts have wallet limits per RBI guidelines.{"\n"}Full KYC unlocks a complete bank account.
        </p>
      </div>
    </div>
  );
}
