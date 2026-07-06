import { ChevronLeft, ChevronRight, Star, Gift } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

const TIER_COLOR: Record<string, string> = {
  Bronze: "#CD7F32",
  Silver: "#C0C0C0",
  Gold: "#FFD700",
  Platinum: "#E5E4E2",
};

export function RewardsScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const { rewards, vouchers } = state;
  const tierColor = TIER_COLOR[rewards.tier] ?? "#AAAAAA";

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>Rewards</p>
        </div>

        {/* Points hero */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px 20px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${tierColor}15`, border: `1px solid ${tierColor}30`, borderRadius: 20, padding: "4px 14px", marginBottom: 16 }}>
            <Star size={14} strokeWidth={1.8} color={tierColor} />
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: tierColor }}>{rewards.tier}</span>
          </div>
          <p style={{ fontFamily: font, fontSize: 48, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-2px" }}>{rewards.points.toLocaleString("en-IN")}</p>
          <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: 0 }}>Meridian coins</p>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          <button onClick={() => onNav("redemption")}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <Gift size={18} strokeWidth={1.6} color={C.blue} />
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text }}>Redeem</span>
          </button>
          <button onClick={() => onNav("referral")}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <ChevronRight size={18} strokeWidth={1.6} color={C.green} />
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text }}>Refer & earn</span>
          </button>
        </div>

        {/* Vouchers preview */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Redeem for</p>
          <button onClick={() => onNav("redemption")} style={{ ...S.btnText, color: C.textMute, fontSize: 13 }}>See all</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {vouchers.slice(0, 4).map(v => (
            <button key={v.id} onClick={() => onNav("redemption")}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px", cursor: "pointer", textAlign: "left" }}>
              <p style={{ fontSize: 24, margin: "0 0 8px" }}>{v.emoji}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{v.brand}</p>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 8px" }}>{v.description}</p>
              <p style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: C.amber, margin: 0 }}>{v.pointsCost.toLocaleString("en-IN")} coins</p>
            </button>
          ))}
        </div>

        {/* History */}
        <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>History</p>
        {rewards.history.map(event => (
          <div key={event.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: `1px solid ${C.border2}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: event.type === "earned" ? "rgba(0,200,150,0.1)" : "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Star size={16} strokeWidth={1.6} color={event.type === "earned" ? C.green : C.amber} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: C.text, margin: "0 0 2px" }}>{event.description}</p>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{event.date}</p>
            </div>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: event.type === "earned" ? C.green : C.amber, margin: 0, flexShrink: 0 }}>
              {event.points > 0 ? "+" : ""}{event.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
