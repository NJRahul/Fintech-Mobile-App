import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";

interface Props {
  fundId: string;
  onBack: () => void;
  onDone: () => void;
}

export function SIPSetupScreen({ fundId, onBack, onDone }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const fund = state.mutualFunds.find(f => f.id === fundId) ?? state.mutualFunds[0];

  const [amount, setAmount] = useState(String(fund.minSIP));
  const [date, setDate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const SIP_DATES = [1, 5, 10, 15, 20, 25];

  const handleSetup = () => {
    if (amountNum < fund.minSIP) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "BUY_FUND", fundId: fund.id, amount: amountNum, isSIP: true, sipDate: date });
      setLoading(false);
      setDone(true);
      setTimeout(onDone, 1500);
    }, 800);
  };

  if (done) {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Check size={32} strokeWidth={2} color={C.green} />
        </div>
        <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 8px", textAlign: "center" }}>SIP started!</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, textAlign: "center" }}>₹{amountNum.toLocaleString("en-IN")}/month on {date}th</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Set up SIP</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 8px" }}>{fund.name}</p>
        <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 28px" }}>Min SIP: ₹{fund.minSIP.toLocaleString("en-IN")}/month</p>

        <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 10 }}>Monthly amount</label>
        <div style={{ position: "relative", marginBottom: 24 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 18, color: C.textSub }}>₹</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
            style={{ ...S.input, paddingLeft: 36, fontSize: 22, fontWeight: 800 }} />
        </div>

        <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 12 }}>SIP date</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {SIP_DATES.map(d => (
            <button key={d} onClick={() => setDate(d)}
              style={{ width: 52, height: 52, borderRadius: 12, background: date === d ? C.text : C.surface2, color: date === d ? C.bg : C.textSub, border: `1px solid ${date === d ? C.text : C.border}`, fontFamily: font, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 150ms" }}>
              {d}
            </button>
          ))}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>First debit</p>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{date}th of next month</p>
          </div>
        </div>

        <button onClick={handleSetup} disabled={amountNum < fund.minSIP || loading}
          style={{ ...S.btnPrimary, opacity: amountNum < fund.minSIP || loading ? 0.4 : 1 }}>
          {loading ? "Setting up…" : "Start SIP"}
        </button>
      </div>
    </div>
  );
}
