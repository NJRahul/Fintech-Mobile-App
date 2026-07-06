import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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

const STATUS_COLOR: Record<string, string> = {
  "Active": "#00C896",
  "Approved": "#4A9EFF",
  "Counter-Offer": "#F5A623",
  "Pending": "#F5A623",
  "Closed": "#666666",
};

export function LoansScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const activeLoans = state.loans.filter(l => l.status === "Active");
  const otherLoans  = state.loans.filter(l => l.status !== "Active");

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px", flex: 1 }}>Loans</p>
          <button onClick={() => onNav("loan-apply")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}>
            <Plus size={16} strokeWidth={2} color={C.text} />
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text }}>Apply</span>
          </button>
        </div>

        {/* Active loans */}
        {activeLoans.map(loan => {
          const paidPct = Math.round((loan.totalPaid / loan.principalAmount) * 100);
          return (
            <button key={loan.id} onClick={() => onNav("loan-detail", { loanId: loan.id })}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 14, cursor: "pointer", textAlign: "left", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{loan.type}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{loan.interestRate}% p.a. · {loan.remainingMonths} months left</p>
                </div>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: STATUS_COLOR[loan.status] ?? C.textSub, background: `${STATUS_COLOR[loan.status] ?? C.textMute}18`, padding: "3px 10px", borderRadius: 20 }}>{loan.status}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Outstanding</p>
                  <p style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(loan.outstandingAmount)}</p>
                </div>
                <div>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>EMI due</p>
                  <p style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.amber, margin: 0 }}>{fmt(loan.emiAmount)}</p>
                </div>
              </div>
              <div style={{ height: 4, background: C.surface3, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${paidPct}%`, background: C.green, borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{paidPct}% paid</p>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>Next EMI: {loan.nextEmiDate}</p>
              </div>
            </button>
          );
        })}

        {/* Applications */}
        {otherLoans.length > 0 && (
          <>
            <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: "8px 0 14px" }}>Applications</p>
            {otherLoans.map(loan => (
              <button key={loan.id} onClick={() => onNav("loan-detail", { loanId: loan.id })}
                style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{loan.type}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{fmt(loan.principalAmount)} · {loan.interestRate}% p.a.</p>
                </div>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: STATUS_COLOR[loan.status] ?? C.textSub, background: `${STATUS_COLOR[loan.status] ?? C.textMute}18`, padding: "3px 10px", borderRadius: 20 }}>{loan.status}</span>
                <ChevronRight size={16} color={C.textDim} />
              </button>
            ))}
          </>
        )}

        {/* Pre-approved offer */}
        <div style={{ background: "rgba(74,158,255,0.07)", border: "1px solid rgba(74,158,255,0.15)", borderRadius: 16, padding: "16px", marginTop: 8 }}>
          <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.blue, margin: "0 0 4px" }}>Pre-approved offer</p>
          <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>₹8,00,000</p>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 14px" }}>Personal Loan at 10.99% p.a.</p>
          <button onClick={() => onNav("loan-apply")} style={{ ...S.btnPrimary, height: 44, fontSize: 14 }}>Check offer</button>
        </div>
      </div>
    </div>
  );
}
