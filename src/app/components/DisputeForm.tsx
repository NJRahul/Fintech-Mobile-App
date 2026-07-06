import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { T, font } from "../tokens";
import { TRANSACTIONS } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Amount } from "./ui/Amount";
import { Button } from "./ui/Button";

interface DisputeFormProps {
  txnId?: string;
  onBack: () => void;
  onSubmitted: () => void;
}

const REASONS = [
  "I didn't authorise this transaction",
  "Wrong amount charged",
  "Duplicate charge",
  "Merchant didn't deliver product/service",
  "Refund not received",
  "Something else",
];

export function DisputeForm({ txnId, onBack, onSubmitted }: DisputeFormProps) {
  const txn = TRANSACTIONS.find((t) => t.id === txnId) ?? TRANSACTIONS[0];
  const [reason, setReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Dispute filed" onBack={onSubmitted} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.success50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={32} color={T.success600} strokeWidth={1.5} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: font, fontSize: 18, lineHeight: "26px", fontWeight: 600, color: T.gray900, margin: 0 }}>Dispute filed</p>
            <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "4px 0 0" }}>Case DIS-2024-00022</p>
          </div>
          <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray700, textAlign: "center", margin: 0 }}>
            Expected resolution within 7 business days. You'll receive push updates as the case progresses.
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={onSubmitted}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
      <ScreenHeader title="Raise a dispute" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 16, marginBottom: 12 }}>
          <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Transaction</p>
          <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: T.gray900, margin: "4px 0 2px" }}>{txn.description}</p>
          <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
            {txn.date} · {txn.channel} · {txn.reference}
          </p>
          <div style={{ marginTop: 8 }}>
            <Amount value={txn.amount} size="lg" type={txn.type} showSign weight={700} />
          </div>
        </div>

        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Reason
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden", marginBottom: 12 }}>
          {REASONS.map((r, i) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "12px 16px", background: reason === r ? T.blue50 : T.white,
                border: "none", borderBottom: i < REASONS.length - 1 ? `1px solid ${T.gray200}` : "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${reason === r ? T.blue600 : T.gray300}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {reason === r && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue600 }} />}
              </div>
              <span style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", color: T.gray900, fontWeight: reason === r ? 600 : 500 }}>{r}</span>
            </button>
          ))}
        </div>

        <label style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", fontWeight: 500, color: T.gray700 }}>Additional notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe the issue in detail…"
          style={{ marginTop: 6, width: "100%", minHeight: 100, border: `1px solid ${T.gray300}`, borderRadius: T.radiusInput, padding: 12, fontFamily: font, fontSize: 14, color: T.gray900, outline: "none", resize: "vertical", boxSizing: "border-box", background: T.white, marginBottom: 16 }}
        />

        <Button variant="primary" size="lg" fullWidth disabled={!reason} onClick={() => setSubmitted(true)}>Submit dispute</Button>
      </div>
    </div>
  );
}
