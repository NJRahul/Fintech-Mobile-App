import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";

interface Props {
  onBack: () => void;
}

export function BudgetScreen({ onBack }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (category: string, current: number) => {
    setEditing(category);
    setEditValue(String(current));
  };

  const saveEdit = (category: string) => {
    const val = parseFloat(editValue);
    if (val > 0) dispatch({ type: "UPDATE_BUDGET", category, limit: val });
    setEditing(null);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Monthly Budgets</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>Tap a category to edit the limit</p>

        {state.budgets.map(b => {
          const pct = (b.spent / b.limit) * 100;
          const isOver = b.spent > b.limit;
          const barColor = isOver ? C.red : pct > 80 ? C.amber : C.green;
          const isEditing = editing === b.category;

          return (
            <div key={b.category} style={{ background: C.surface, border: `1px solid ${isEditing ? C.borderMd : C.border}`, borderRadius: 16, padding: "16px", marginBottom: 12, transition: "border 150ms" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{b.emoji}</span>
                  <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{b.category}</p>
                </div>
                {!isEditing ? (
                  <button onClick={() => startEdit(b.category, b.limit)}
                    style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: C.textMute, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                    Edit
                  </button>
                ) : (
                  <button onClick={() => saveEdit(b.category)}
                    style={{ width: 32, height: 32, borderRadius: 8, background: C.green, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={16} strokeWidth={2.5} color="#000" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 16, color: C.textSub }}>₹</span>
                  <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus
                    style={{ ...S.input, paddingLeft: 34, fontSize: 18, fontWeight: 700, marginBottom: 0 }}
                    onKeyDown={e => e.key === "Enter" && saveEdit(b.category)}
                  />
                </div>
              ) : null}

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: font, fontSize: 13, color: C.textMute }}>Spent ₹{b.spent.toLocaleString("en-IN")}</span>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: isOver ? C.red : C.textSub }}>
                  {isOver ? "Over by ₹" + (b.spent - b.limit).toLocaleString("en-IN") : `₹${(b.limit - b.spent).toLocaleString("en-IN")} left`}
                </span>
              </div>
              <div style={{ height: 4, background: C.surface3, borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: barColor, borderRadius: 4 }} />
              </div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0, textAlign: "right" }}>Budget: ₹{b.limit.toLocaleString("en-IN")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
