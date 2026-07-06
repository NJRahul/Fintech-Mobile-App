import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  txnId: string;
  onBack: () => void;
  onDone: () => void;
}

const REASONS = [
  "I did not authorise this transaction",
  "Wrong amount charged",
  "Duplicate transaction",
  "Service/goods not received",
  "Refund not credited",
  "Other",
];

export function DisputeFormScreen({ txnId, onBack, onDone }: Props) {
  const state = useAppState();
  const txn = state.transactions.find(t => t.id === txnId) ?? state.transactions[0];

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!reason) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  if (submitted) {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Check size={32} strokeWidth={2} color={C.green} />
        </div>
        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 10px", textAlign: "center" }}>Dispute filed!</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, textAlign: "center", lineHeight: 1.6, margin: "0 0 8px" }}>Our team will investigate and respond within 7 working days.</p>
        <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, textAlign: "center", margin: "0 0 40px" }}>A confirmation will be sent to your registered email.</p>
        <button onClick={onDone} style={{ ...S.btnPrimary }}>Done</button>
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

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Raise a dispute</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>We'll investigate and resolve within 7 working days</p>

        {/* Txn summary */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
          <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Transaction</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textSub, margin: 0 }}>{txn.description} · {txn.date}</p>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>₹{txn.amount.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 12 }}>Reason for dispute</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {REASONS.map(r => (
            <button key={r} onClick={() => setReason(r)}
              style={{ display: "flex", alignItems: "center", gap: 12, background: reason === r ? C.surface2 : C.surface, border: `1px solid ${reason === r ? C.borderMd : C.border}`, borderRadius: 12, padding: "13px 14px", cursor: "pointer", textAlign: "left", transition: "all 150ms" }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${reason === r ? C.text : C.border}`, background: reason === r ? C.text : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {reason === r && <Check size={12} strokeWidth={3} color={C.bg} />}
              </div>
              <p style={{ fontFamily: font, fontSize: 14, color: C.text, margin: 0 }}>{r}</p>
            </button>
          ))}
        </div>

        <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 8 }}>Additional details (optional)</label>
        <textarea
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Provide any additional context…"
          rows={4}
          style={{ ...S.input, resize: "none", marginBottom: 24, lineHeight: 1.6 }}
        />

        <button onClick={handleSubmit} disabled={!reason || loading}
          style={{ ...S.btnPrimary, opacity: !reason || loading ? 0.4 : 1 }}>
          {loading ? "Submitting…" : "Submit dispute"}
        </button>

        <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          By submitting, you confirm this information is accurate. False disputes may result in account action.
        </p>
      </div>
    </div>
  );
}
