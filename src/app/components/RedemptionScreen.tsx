import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import { useToast } from "./Toast";

interface Props {
  onBack: () => void;
}

export function RedemptionScreen({ onBack }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { rewards, vouchers } = state;
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const handleRedeem = (voucherId: string, cost: number, brand: string) => {
    if (rewards.points < cost) return;
    dispatch({ type: "REDEEM_VOUCHER", voucherId });
    toast(`${brand} voucher redeemed! Check your email for details`, "success");
    setRedeemed(voucherId);
    setTimeout(() => setRedeemed(null), 2000);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Redeem rewards</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>Balance: <span style={{ color: C.text, fontWeight: 700 }}>{rewards.points.toLocaleString("en-IN")} coins</span></p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {vouchers.map(v => {
            const canAfford = rewards.points >= v.pointsCost;
            const isRedeemed = redeemed === v.id;
            return (
              <div key={v.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                  {v.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{v.brand}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 6px" }}>{v.description}</p>
                  <p style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: C.amber, margin: 0 }}>{v.pointsCost.toLocaleString("en-IN")} coins · {v.value} value</p>
                </div>
                <button
                  onClick={() => handleRedeem(v.id, v.pointsCost, v.brand)}
                  disabled={!canAfford || !!isRedeemed}
                  style={{ flexShrink: 0, background: isRedeemed ? C.green : canAfford ? C.text : C.surface3, color: isRedeemed ? "#000" : canAfford ? C.bg : C.textMute, border: "none", borderRadius: 10, padding: "10px 16px", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: canAfford && !isRedeemed ? "pointer" : "not-allowed", transition: "all 200ms", display: "flex", alignItems: "center", gap: 6 }}>
                  {isRedeemed ? <><Check size={14} strokeWidth={2.5} /> Done!</> : canAfford ? "Redeem" : "Need more coins"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
