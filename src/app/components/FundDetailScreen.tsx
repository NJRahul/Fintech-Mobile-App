import { useState } from "react";
import { ChevronLeft, TrendingUp } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  fundId: string;
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

export function FundDetailScreen({ fundId, onBack, onNav }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const fund = state.mutualFunds.find(f => f.id === fundId) ?? state.mutualFunds[0];
  const holding = state.holdings.find(h => h.fundId === fund.id);

  const [mode, setMode] = useState<"view" | "invest">("view");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const riskColor = fund.riskLevel === "Low" ? C.green : fund.riskLevel === "Moderate" ? C.amber : C.red;

  const handleBuy = () => {
    if (amountNum < fund.minLumpsum) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "BUY_FUND", fundId: fund.id, amount: amountNum, isSIP: false });
      setLoading(false);
      setMode("view");
      setAmount("");
    }, 800);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: "-0.4px" }}>{fund.name}</p>
          <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 8px" }}>{fund.house} · {fund.category}</p>
          <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: riskColor, background: `${riskColor}15`, padding: "3px 10px", borderRadius: 20 }}>{fund.riskLevel} risk</span>
        </div>

        {/* NAV & returns */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.border2}` }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Current NAV</p>
              <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>₹{fund.nav}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp size={16} color={C.green} />
              <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.green, margin: 0 }}>+{fund.returns1Y}%</p>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>1Y</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "1Y", value: `+${fund.returns1Y}%` },
              { label: "3Y", value: `+${fund.returns3Y}%` },
              { label: "5Y", value: `+${fund.returns5Y}%` },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.green, margin: "0 0 2px" }}>{value}</p>
                <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0 }}>{label} returns</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fund details */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          {[
            { label: "AUM",           value: fund.aum },
            { label: "Expense ratio", value: `${fund.expenseRatio}%` },
            { label: "Min SIP",       value: `₹${fund.minSIP.toLocaleString("en-IN")}` },
            { label: "Min lumpsum",   value: `₹${fund.minLumpsum.toLocaleString("en-IN")}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Holding */}
        {holding && (
          <div style={{ background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.15)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.green, margin: "0 0 10px" }}>Your holding</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Invested", value: "₹" + holding.investedAmount.toLocaleString("en-IN") },
                { label: "Current",  value: "₹" + holding.currentValue.toLocaleString("en-IN") },
                { label: "Units",    value: holding.units.toFixed(3) },
                { label: "Returns",  value: `+₹${holding.returns.toLocaleString("en-IN")} (${holding.returnsPercent.toFixed(2)}%)` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>{label}</p>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "view" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => setMode("invest")} style={{ ...S.btnPrimary, height: 44, fontSize: 14 }}>Invest lumpsum</button>
            <button onClick={() => onNav("sip-setup", { fundId: fund.id })} style={{ ...S.btnGhost, height: 44, fontSize: 14 }}>Start SIP</button>
          </div>
        ) : (
          <div>
            <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 10 }}>Lumpsum amount (min ₹{fund.minLumpsum.toLocaleString("en-IN")})</label>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 18, color: C.textSub }}>₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" autoFocus
                style={{ ...S.input, paddingLeft: 36, fontSize: 20, fontWeight: 700 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={handleBuy} disabled={amountNum < fund.minLumpsum || loading}
                style={{ ...S.btnPrimary, height: 44, fontSize: 14, opacity: amountNum < fund.minLumpsum || loading ? 0.4 : 1 }}>
                {loading ? "…" : "Invest"}
              </button>
              <button onClick={() => { setMode("view"); setAmount(""); }} style={{ ...S.btnGhost, height: 44, fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
