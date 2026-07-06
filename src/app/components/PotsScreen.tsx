import { ChevronLeft, Plus } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function PotsScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const totalSaved = state.pots.reduce((s, p) => s + p.currentAmount, 0);
  const totalTarget = state.pots.reduce((s, p) => s + p.targetAmount, 0);

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 2px", letterSpacing: "-0.5px" }}>Savings Pots</p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>Total saved: {fmt(totalSaved)}</p>
          </div>
          <button onClick={() => onNav("create-pot")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
            <Plus size={16} strokeWidth={2} color={C.text} />
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text }}>New pot</span>
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textSub, margin: 0 }}>Overall progress</p>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{Math.round(totalSaved / totalTarget * 100)}%</p>
          </div>
          <div style={{ height: 6, background: C.surface3, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(totalSaved / totalTarget) * 100}%`, background: C.green, borderRadius: 6 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{fmt(totalSaved)} saved</p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{fmt(totalTarget)} target</p>
          </div>
        </div>

        {/* Pots list */}
        {state.pots.map(pot => {
          const pct = Math.round((pot.currentAmount / pot.targetAmount) * 100);
          return (
            <button key={pot.id} onClick={() => onNav("pot-detail", { potId: pot.id })}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 12, cursor: "pointer", textAlign: "left", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${pot.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {pot.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{pot.name}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>Target by {pot.targetDate}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(pot.currentAmount)}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>of {fmt(pot.targetAmount)}</p>
                </div>
              </div>
              <div style={{ height: 4, background: C.surface3, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pot.color, borderRadius: 4 }} />
              </div>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{pct}% · Auto-save {fmt(pot.autoSaveAmount)}/{pot.autoSaveFrequency}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
