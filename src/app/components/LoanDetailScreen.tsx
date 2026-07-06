import { useState } from "react";
import { ChevronLeft, CheckCircle, Clock, Calendar } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import { useToast } from "./Toast";

interface Props {
  loanId: string;
  onBack: () => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function emiSchedule(nextEmiDate: string, count: number): string[] {
  const parts = nextEmiDate.split(" ");
  if (parts.length < 3) return [];
  const day = parseInt(parts[0]);
  const monthIdx = MONTHS.indexOf(parts[1]);
  const year = parseInt(parts[2]);
  if (monthIdx === -1) return [];
  return Array.from({ length: count }, (_, i) => {
    const total = monthIdx + i;
    return `${day} ${MONTHS[total % 12]} ${year + Math.floor(total / 12)}`;
  });
}

export function LoanDetailScreen({ loanId, onBack }: Props) {
  const state = useAppState();
  const toast = useToast();
  const loan = state.loans.find(l => l.id === loanId) ?? state.loans[0];
  const paidPct = loan.principalAmount > 0 ? Math.round((loan.totalPaid / loan.principalAmount) * 100) : 0;
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const handleAcceptOffer = () => {
    setAccepting(true);
    setTimeout(() => {
      setAccepting(false);
      setOfferAccepted(true);
      toast("Offer accepted! Loan will be disbursed within 24 hours", "success");
    }, 1200);
  };

  const schedule = loan.nextEmiDate ? emiSchedule(loan.nextEmiDate, 5) : [];

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: "-0.5px" }}>{loan.type}</p>
        <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 24px" }}>{loan.id}</p>

        {/* Counter-offer banner */}
        {loan.status === "Counter-Offer" && !offerAccepted && (
          <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 4px" }}>Counter-offer received</p>
            <p style={{ fontFamily: font, fontSize: 13, color: "rgba(245,166,35,0.8)", margin: "0 0 14px" }}>Review the updated loan terms below and accept to proceed.</p>
            <button onClick={handleAcceptOffer} disabled={accepting}
              style={{ ...S.btnPrimary, height: 40, fontSize: 14, opacity: accepting ? 0.6 : 1 }}>
              {accepting ? "Processing…" : "Accept offer"}
            </button>
          </div>
        )}

        {offerAccepted && (
          <div style={{ background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle size={18} strokeWidth={1.8} color={C.green} />
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.green, margin: 0 }}>Offer accepted — disbursement in progress</p>
          </div>
        )}

        {/* Key numbers */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Principal amount</p>
            <p style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>{fmt(loan.principalAmount)}</p>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Outstanding</p>
            <p style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.text, margin: 0 }}>{fmt(loan.outstandingAmount)}</p>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>EMI amount</p>
            <p style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.amber, margin: 0 }}>{fmt(loan.emiAmount)}</p>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Next EMI date</p>
            <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{loan.nextEmiDate || "—"}</p>
          </div>
        </div>

        {/* Progress */}
        {loan.status === "Active" && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textSub, margin: 0 }}>Repayment progress</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{paidPct}%</p>
            </div>
            <div style={{ height: 6, background: C.surface3, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${paidPct}%`, background: C.green, borderRadius: 6 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{fmt(loan.totalPaid)} paid</p>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{loan.remainingMonths} months left</p>
            </div>
          </div>
        )}

        {/* EMI Schedule */}
        {schedule.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Calendar size={16} strokeWidth={1.6} color={C.textSub} />
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Upcoming EMIs</p>
            </div>
            {schedule.map((date, idx) => (
              <div key={date} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border2}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: idx === 0 ? "rgba(245,166,35,0.1)" : C.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {idx === 0
                      ? <Clock size={14} strokeWidth={1.8} color={C.amber} />
                      : <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.textMute }}>{idx + 1}</span>
                    }
                  </div>
                  <p style={{ fontFamily: font, fontSize: 13, color: idx === 0 ? C.text : C.textSub, fontWeight: idx === 0 ? 600 : 400, margin: 0 }}>{date}</p>
                </div>
                <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: idx === 0 ? C.amber : C.textSub, margin: 0 }}>{fmt(loan.emiAmount)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Details */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          {[
            { label: "Interest rate",  value: `${loan.interestRate}% p.a.` },
            { label: "Tenure",         value: `${loan.tenureMonths} months` },
            { label: "EMI due day",    value: `${loan.emiDueDay}th of month` },
            { label: "Auto-debit",     value: loan.autoDebitEnabled ? "Enabled" : "Disabled" },
            ...(loan.disbursedDate ? [{ label: "Disbursed", value: loan.disbursedDate }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
