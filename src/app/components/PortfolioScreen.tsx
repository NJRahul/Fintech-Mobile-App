import { ChevronLeft, TrendingUp, TrendingDown } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 }); }

export function PortfolioScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const totalInvested = state.holdings.reduce((s, h) => s + h.investedAmount, 0);
  const totalCurrent  = state.holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalReturns  = totalCurrent - totalInvested;
  const returnsPct    = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : "0.00";
  const isPositive    = totalReturns >= 0;

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>Portfolio</p>
        </div>

        {/* Hero */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px 20px", marginBottom: 20 }}>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Current value</p>
          <p style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-1.5px" }}>{fmt(totalCurrent)}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isPositive ? <TrendingUp size={16} color={C.green} /> : <TrendingDown size={16} color={C.red} />}
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: isPositive ? C.green : C.red }}>
              {isPositive ? "+" : ""}{fmt(totalReturns)} ({isPositive ? "+" : ""}{returnsPct}%)
            </span>
            <span style={{ fontFamily: font, fontSize: 12, color: C.textMute }}>total returns</span>
          </div>
        </div>

        {/* Quick nav */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Mutual Funds", screen: "mutual-funds" as Screen, value: fmt(state.holdings.reduce((s, h) => s + h.currentValue, 0)) },
            { label: "Digital Gold",  screen: "digital-gold" as Screen,  value: `${state.goldHolding.grams}g` },
          ].map(({ label, screen, value }) => (
            <button key={label} onClick={() => onNav(screen)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", textAlign: "left" }}>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{value}</p>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0 }}>{label}</p>
            </button>
          ))}
          <button onClick={() => onNav("mutual-funds")}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 12px", cursor: "pointer", textAlign: "left" }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{state.holdings.filter(h => h.isSIP).length}</p>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0 }}>Active SIPs</p>
          </button>
        </div>

        {/* Holdings */}
        <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Holdings</p>
        {state.holdings.map(holding => {
          const fund = state.mutualFunds.find(f => f.id === holding.fundId);
          if (!fund) return null;
          const isUp = holding.returns >= 0;
          return (
            <button key={holding.fundId} onClick={() => onNav("fund-detail", { fundId: holding.fundId })}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", textAlign: "left", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{fund.name}</p>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0 }}>{fund.category} · {fund.house}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{fmt(holding.currentValue)}</p>
                  <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: isUp ? C.green : C.red }}>
                    {isUp ? "+" : ""}{holding.returnsPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{holding.units.toFixed(3)} units · NAV {fmt(holding.currentNav)}</p>
                {holding.isSIP && <span style={{ fontFamily: font, fontSize: 11, color: C.blue, background: "rgba(74,158,255,0.1)", padding: "2px 8px", borderRadius: 10 }}>SIP ₹{holding.sipAmount?.toLocaleString("en-IN")}/mo</span>}
              </div>
            </button>
          );
        })}

        {/* Gold */}
        <button onClick={() => onNav("digital-gold")}
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>Digital Gold</p>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0 }}>{state.goldHolding.grams}g · ₹{state.goldHolding.currentPrice.toLocaleString("en-IN")}/g</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{fmt(state.goldHolding.currentValue)}</p>
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: C.green }}>+{(((state.goldHolding.currentPrice - state.goldHolding.avgBuyPrice) / state.goldHolding.avgBuyPrice) * 100).toFixed(2)}%</span>
          </div>
        </button>
      </div>
    </div>
  );
}
