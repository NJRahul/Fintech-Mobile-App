import { useState } from "react";
import { ChevronLeft, Trash2, Plus, Minus } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import { useToast } from "./Toast";

interface Props {
  potId: string;
  onBack: () => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function PotDetailScreen({ potId, onBack }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const pot = state.pots.find(p => p.id === potId) ?? state.pots[0];
  const primaryAcc = state.accounts[0];

  const [mode, setMode] = useState<"view" | "add" | "withdraw">("view");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const pct = Math.round((pot.currentAmount / pot.targetAmount) * 100);
  const amountNum = parseFloat(amount) || 0;

  const handleAction = () => {
    if (amountNum <= 0) return;
    setLoading(true);
    setTimeout(() => {
      if (mode === "add") {
        dispatch({ type: "ADD_TO_POT", potId: pot.id, amount: amountNum, accountId: primaryAcc.id });
        toast(`₹${amountNum.toLocaleString("en-IN")} added to ${pot.name}`, "success");
      } else {
        dispatch({ type: "WITHDRAW_FROM_POT", potId: pot.id, amount: amountNum, accountId: primaryAcc.id });
        toast(`₹${amountNum.toLocaleString("en-IN")} withdrawn from ${pot.name}`, "success");
      }
      setLoading(false);
      setAmount("");
      setMode("view");
    }, 600);
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_POT", potId: pot.id });
    toast(`${pot.name} deleted`, "info");
    onBack();
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6 }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
            <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
          </button>
          <button onClick={handleDelete} style={{ ...S.btnText }}>
            <Trash2 size={18} strokeWidth={1.6} color={C.red} />
          </button>
        </div>

        {/* Pot hero */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${pot.color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 32 }}>
            {pot.emoji}
          </div>
          <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: "-0.5px" }}>{pot.name}</p>
          <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>Target by {pot.targetDate}</p>
        </div>

        {/* Progress */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: 0 }}>{fmt(pot.currentAmount)}</p>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.textMute, margin: 0, alignSelf: "flex-end" }}>of {fmt(pot.targetAmount)}</p>
          </div>
          <div style={{ height: 6, background: C.surface3, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pot.color, borderRadius: 6, transition: "width 300ms" }} />
          </div>
          <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{pct}% · {fmt(pot.targetAmount - pot.currentAmount)} remaining</p>
        </div>

        {/* Details */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          {[
            { label: "Auto-save", value: pot.autoSaveFrequency === "none" ? "Off" : `${fmt(pot.autoSaveAmount)} / ${pot.autoSaveFrequency}` },
            { label: "Linked account", value: `${primaryAcc.nickname} · ${primaryAcc.numberMasked}` },
            { label: "Created", value: pot.createdDate },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Action area */}
        {mode === "view" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => setMode("add")} style={{ ...S.btnPrimary, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Plus size={16} strokeWidth={2} /> Add money
            </button>
            <button onClick={() => setMode("withdraw")} style={{ ...S.btnGhost, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Minus size={16} strokeWidth={2} /> Withdraw
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 12px" }}>
              {mode === "add" ? "Add to pot" : "Withdraw from pot"}
            </p>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 18, color: C.textSub }}>₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" autoFocus
                style={{ ...S.input, paddingLeft: 36, fontSize: 20, fontWeight: 700 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={handleAction} disabled={amountNum <= 0 || loading}
                style={{ ...S.btnPrimary, opacity: amountNum <= 0 || loading ? 0.4 : 1 }}>
                {loading ? "…" : mode === "add" ? "Add" : "Withdraw"}
              </button>
              <button onClick={() => { setMode("view"); setAmount(""); }} style={{ ...S.btnGhost }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
