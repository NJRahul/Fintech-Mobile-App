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

export function DepositsScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const totalDeposited = state.deposits.reduce((s, d) => s + d.principal, 0);
  const totalMaturity  = state.deposits.reduce((s, d) => s + d.maturityAmount, 0);
  const totalGain      = totalMaturity - totalDeposited;

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 2px", letterSpacing: "-0.5px" }}>Deposits</p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>FD & RD</p>
          </div>
          <button onClick={() => onNav("create-deposit")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
            <Plus size={16} strokeWidth={2} color={C.text} />
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text }}>New deposit</span>
          </button>
        </div>

        {/* Summary */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Invested</p>
            <p style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(totalDeposited)}</p>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Maturity</p>
            <p style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(totalMaturity)}</p>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Interest</p>
            <p style={{ fontFamily: font, fontSize: 17, fontWeight: 700, color: C.green, margin: 0 }}>+{fmt(totalGain)}</p>
          </div>
        </div>

        {/* Deposits list */}
        {state.deposits.map(dep => {
          const totalDays = (new Date(dep.maturityDate.split(" ").reverse().join("-")).getTime() - new Date(dep.startDate.split(" ").reverse().join("-")).getTime()) / 86400000;
          const elapsed   = (Date.now() - new Date(dep.startDate.split(" ").reverse().join("-")).getTime()) / 86400000;
          const pct       = Math.min(Math.round((elapsed / totalDays) * 100), 100);

          return (
            <button key={dep.id} onClick={() => onNav("deposit-detail", { depositId: dep.id })}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 12, cursor: "pointer", textAlign: "left", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{dep.type} · {dep.interestRate}% p.a.</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>Matures {dep.maturityDate}</p>
                </div>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.green, background: "rgba(0,200,150,0.1)", padding: "3px 10px", borderRadius: 20, alignSelf: "flex-start" }}>{dep.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Principal</p>
                  <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(dep.principal)}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Maturity amount</p>
                  <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.green, margin: 0 }}>{fmt(dep.maturityAmount)}</p>
                </div>
              </div>
              <div style={{ height: 4, background: C.surface3, borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: C.green, borderRadius: 4 }} />
              </div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0 }}>{pct}% elapsed · {dep.tenureMonths} months</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
