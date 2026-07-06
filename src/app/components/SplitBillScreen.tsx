import { useState } from "react";
import { ChevronLeft, Plus, Minus, Check } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export function SplitBillScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [totalAmount, setTotalAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const payees = state.payees.filter(p => p.cooling === "verified");
  const total = parseFloat(totalAmount) || 0;
  const splitCount = selected.length + 1; // +1 for self
  const perPerson = splitCount > 0 ? total / splitCount : 0;

  const togglePayee = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const handleSend = () => {
    if (!total || selected.length === 0) return;
    setSent(true);
    setTimeout(() => {
      onNav("dashboard");
    }, 1500);
  };

  if (sent) {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Check size={32} strokeWidth={2} color={C.green} />
        </div>
        <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 8px", textAlign: "center" }}>Requests sent!</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, textAlign: "center" }}>{selected.length} request{selected.length !== 1 ? "s" : ""} sent for ₹{perPerson.toFixed(0)} each</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Split Bill</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>Split expenses with friends</p>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What's it for? (Dinner, Cab, etc.)"
          style={{ ...S.input, marginBottom: 12 }}
        />

        <div style={{ position: "relative", marginBottom: 24 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 18, color: C.textSub, pointerEvents: "none" }}>₹</span>
          <input
            type="number"
            value={totalAmount}
            onChange={e => setTotalAmount(e.target.value)}
            placeholder="Total amount"
            style={{ ...S.input, paddingLeft: 36, fontSize: 20, fontWeight: 700 }}
          />
        </div>

        {total > 0 && selected.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 4px" }}>Each person pays</p>
              <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>₹{perPerson.toFixed(0)}</p>
            </div>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{splitCount} people</p>
          </div>
        )}

        <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Add people</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
        {payees.map(payee => {
          const isSelected = selected.includes(payee.id);
          return (
            <button key={payee.id} onClick={() => togglePayee(payee.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border2}`, cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: isSelected ? "rgba(0,200,150,0.15)" : C.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: isSelected ? "1px solid rgba(0,200,150,0.3)" : "none", transition: "all 150ms" }}>
                {isSelected
                  ? <Check size={18} strokeWidth={2} color={C.green} />
                  : <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text }}>{getInitials(payee.name)}</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{payee.name}</p>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>{payee.upiId || payee.bank}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "16px 20px 32px" }}>
        <button onClick={handleSend} disabled={!total || selected.length === 0}
          style={{ ...S.btnPrimary, opacity: !total || selected.length === 0 ? 0.4 : 1 }}>
          {selected.length === 0 ? "Select people to split" : `Send ₹${perPerson.toFixed(0)} request to ${selected.length} people`}
        </button>
      </div>
    </div>
  );
}
