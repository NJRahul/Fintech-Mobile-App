import { ChevronLeft, ChevronRight, Snowflake, Plus, CreditCard } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import { useToast } from "./Toast";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function CardsScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px", flex: 1 }}>Cards</p>
          <button onClick={() => onNav("apply-card")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
            <Plus size={16} strokeWidth={2} color={C.text} />
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text }}>New card</span>
          </button>
        </div>

        {state.cards.map(card => (
          <div key={card.id} style={{ marginBottom: 16 }}>
            {/* Card visual */}
            <div
              style={{ background: card.color, borderRadius: 20, padding: "22px 22px 20px", marginBottom: 12, position: "relative", overflow: "hidden", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              onClick={() => onNav("card-detail", { cardId: card.id })}
            >
              {card.frozen && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, zIndex: 1 }}>
                  <div style={{ textAlign: "center" }}>
                    <Snowflake size={32} strokeWidth={1.5} color="#fff" />
                    <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: "#fff", margin: "8px 0 0" }}>Card frozen</p>
                  </div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.type} Card</p>
                  <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: "#fff", margin: "4px 0 0" }}>Meridian Bank</p>
                </div>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{card.network}</span>
              </div>
              <div>
                <p style={{ fontFamily: font, fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.9)", margin: "0 0 8px", letterSpacing: "0.15em" }}>{card.numberMasked}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <p style={{ fontFamily: font, fontSize: 10, color: "rgba(255,255,255,0.5)", margin: "0 0 2px" }}>CARDHOLDER</p>
                    <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>{card.holder}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: font, fontSize: 10, color: "rgba(255,255,255,0.5)", margin: "0 0 2px" }}>EXPIRES</p>
                    <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>{card.expiry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                onClick={() => {
                  dispatch({ type: card.frozen ? "UNFREEZE_CARD" : "FREEZE_CARD", cardId: card.id });
                  toast(card.frozen ? "Card unfrozen" : "Card frozen for security", card.frozen ? "success" : "info");
                }}
                style={{ background: card.frozen ? "rgba(74,158,255,0.12)" : C.surface, border: `1px solid ${card.frozen ? "rgba(74,158,255,0.3)" : C.border}`, borderRadius: 12, padding: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Snowflake size={16} strokeWidth={1.6} color={card.frozen ? C.blue : C.textSub} />
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: card.frozen ? C.blue : C.textSub }}>{card.frozen ? "Unfreeze" : "Freeze"}</span>
              </button>
              <button onClick={() => onNav("card-detail", { cardId: card.id })}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <CreditCard size={16} strokeWidth={1.6} color={C.textSub} />
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub }}>Manage</span>
              </button>
            </div>

            {/* Credit card due */}
            {card.type === "Credit" && card.totalDue && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 2px" }}>Total due</p>
                    <p style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(card.totalDue)}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 2px" }}>Min due</p>
                    <p style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.amber, margin: 0 }}>{fmt(card.minDue!)}</p>
                  </div>
                </div>
                <div style={{ height: 4, background: C.surface3, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${100 - (card.availableCredit! / card.creditLimit!) * 100}%`, background: C.amber, borderRadius: 4 }} />
                </div>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "8px 0 0" }}>Due {card.dueDate} · {fmt(card.availableCredit!)} available</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
