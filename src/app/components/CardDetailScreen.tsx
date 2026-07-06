import { useState } from "react";
import { ChevronLeft, Snowflake, Globe, Wifi, ShoppingCart, Building2, Smartphone } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import { useToast } from "./Toast";
import type { Screen } from "../App";

interface Props {
  cardId: string;
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const CONTROLS = [
  { key: "online"        as const, label: "Online payments",  Icon: ShoppingCart },
  { key: "contactless"   as const, label: "Contactless",      Icon: Wifi         },
  { key: "atm"           as const, label: "ATM withdrawals",  Icon: Building2    },
  { key: "international" as const, label: "International",    Icon: Globe        },
];

export function CardDetailScreen({ cardId, onBack, onNav }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const card = state.cards.find(c => c.id === cardId) ?? state.cards[0];

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        {/* Card visual */}
        <div style={{ background: card.color, borderRadius: 20, padding: "22px 22px 20px", marginBottom: 20, position: "relative", overflow: "hidden", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {card.frozen && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20 }}>
              <div style={{ textAlign: "center" }}>
                <Snowflake size={32} strokeWidth={1.5} color="#fff" />
                <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: "#fff", margin: "8px 0 0" }}>Card frozen</p>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0, textTransform: "uppercase" }}>{card.type} Card</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: "#fff", margin: "4px 0 0" }}>Meridian Bank</p>
            </div>
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{card.network}</span>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.9)", margin: "0 0 8px", letterSpacing: "0.15em" }}>{card.numberMasked}</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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

        {/* Freeze button */}
        <button
          onClick={() => {
            dispatch({ type: card.frozen ? "UNFREEZE_CARD" : "FREEZE_CARD", cardId: card.id });
            toast(card.frozen ? "Card unfrozen — ready to use" : "Card frozen — all transactions blocked", card.frozen ? "success" : "info");
          }}
          style={{ ...S.btnGhost, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Snowflake size={18} strokeWidth={1.6} color={card.frozen ? C.blue : C.text} />
          <span style={{ color: card.frozen ? C.blue : C.text }}>{card.frozen ? "Unfreeze card" : "Freeze card"}</span>
        </button>

        {/* Credit summary */}
        {card.type === "Credit" && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 20 }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Credit summary</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Credit limit</p>
                <p style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(card.creditLimit!)}</p>
              </div>
              <div>
                <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Available</p>
                <p style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: C.green, margin: 0 }}>{fmt(card.availableCredit!)}</p>
              </div>
            </div>
            <div style={{ height: 4, background: C.surface3, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${100 - (card.availableCredit! / card.creditLimit!) * 100}%`, background: C.amber, borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Total due</p>
                <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(card.totalDue!)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Due date</p>
                <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.amber, margin: 0 }}>{card.dueDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Card controls */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 20 }}>
          <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Card controls</p>
          {CONTROLS.map(({ key, label, Icon }, idx) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border2}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} strokeWidth={1.6} color={C.textSub} />
                </div>
                <p style={{ fontFamily: font, fontSize: 14, color: C.text, margin: 0 }}>{label}</p>
              </div>
              <button
                onClick={() => dispatch({ type: "TOGGLE_CARD_CONTROL", cardId: card.id, control: key })}
                style={{ width: 44, height: 26, borderRadius: 13, background: card.controls[key] ? C.green : C.surface3, border: "none", cursor: "pointer", position: "relative", transition: "background 200ms" }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3, left: card.controls[key] ? 21 : 3, transition: "left 200ms" }} />
              </button>
            </div>
          ))}
        </div>

        {/* Limits */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px" }}>
          <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Transaction limits</p>
          {Object.entries(card.limits).map(([key, value], idx) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0, textTransform: "capitalize" }}>{key} per day</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{fmt(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
