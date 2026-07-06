import { ChevronLeft, ChevronRight } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

export function SpendScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const { budgets, transactions } = state;

  const totalSpent  = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit  = budgets.reduce((s, b) => s + b.limit, 0);
  const overBudget  = budgets.filter(b => b.spent > b.limit);

  const categorySpend = transactions
    .filter(t => t.type === "debit")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px", flex: 1 }}>Spend</p>
          <button onClick={() => onNav("budget")}
            style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
            Budgets
          </button>
        </div>

        {/* Month total */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Spent this month</p>
          <p style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-1px" }}>
            ₹{totalSpent.toLocaleString("en-IN")}
          </p>
          <div style={{ height: 4, background: C.surface3, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${Math.min((totalSpent / totalLimit) * 100, 100)}%`, background: totalSpent > totalLimit * 0.8 ? C.amber : C.green, borderRadius: 4 }} />
          </div>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>of ₹{totalLimit.toLocaleString("en-IN")} budget · {Math.round((totalSpent / totalLimit) * 100)}% used</p>
        </div>

        {/* Over budget alert */}
        {overBudget.length > 0 && (
          <div style={{ background: "rgba(255,77,77,0.07)", border: "1px solid rgba(255,77,77,0.15)", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.red, margin: "0 0 2px" }}>Over budget in {overBudget.length} categor{overBudget.length > 1 ? "ies" : "y"}</p>
            <p style={{ fontFamily: font, fontSize: 12, color: "rgba(255,100,100,0.8)", margin: 0 }}>{overBudget.map(b => b.category).join(", ")}</p>
          </div>
        )}

        {/* Budgets */}
        <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Budget overview</p>
        {budgets.map(b => {
          const pct = (b.spent / b.limit) * 100;
          const isOver = b.spent > b.limit;
          const barColor = isOver ? C.red : pct > 80 ? C.amber : C.green;
          return (
            <button key={b.category} onClick={() => onNav("budget")}
              style={{ width: "100%", background: "none", border: "none", borderBottom: `1px solid ${C.border2}`, padding: "14px 0", cursor: "pointer", textAlign: "left", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{b.emoji}</span>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, margin: 0 }}>{b.category}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: isOver ? C.red : C.text }}>₹{b.spent.toLocaleString("en-IN")}</span>
                  <span style={{ fontFamily: font, fontSize: 12, color: C.textMute }}> / ₹{b.limit.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div style={{ height: 3, background: C.surface3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: barColor, borderRadius: 3 }} />
              </div>
            </button>
          );
        })}

        {/* Category breakdown */}
        <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "24px 0 14px" }}>By category</p>
        {Object.entries(categorySpend).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
          <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border2}` }}>
            <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: 0, textTransform: "capitalize" }}>{cat}</p>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>₹{amt.toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
