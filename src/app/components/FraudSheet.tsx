import { useState } from "react";
import { AlertOctagon, ShieldCheck, CheckCircle2 } from "lucide-react";
import { T, font } from "../tokens";
import { FRAUD_ALERTS, TRANSACTIONS } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Amount } from "./ui/Amount";
import { Button } from "./ui/Button";
import { FormList } from "./ui/FormList";
import { InlineNotice } from "./ui/InlineNotice";

interface FraudSheetProps {
  onBack: () => void;
  onDone: () => void;
  onOpenCase: (disputeId: string) => void;
}

export function FraudSheet({ onBack, onDone, onOpenCase }: FraudSheetProps) {
  const alert = FRAUD_ALERTS[0];
  const txn = TRANSACTIONS.find((t) => t.id === alert.txnId)!;
  const [state, setState] = useState<"prompt" | "denied" | "confirmed">("prompt");

  if (state === "confirmed") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Marked as safe" onBack={onDone} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 24, textAlign: "center", marginBottom: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.success50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <ShieldCheck size={32} color={T.success600} strokeWidth={1.5} />
            </div>
            <p style={{ fontFamily: font, fontSize: 18, lineHeight: "26px", fontWeight: 600, color: T.gray900, margin: 0 }}>Thanks — no action needed</p>
            <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: "4px 0 0" }}>The transaction will process normally.</p>
          </div>
          <Button variant="primary" size="lg" fullWidth onClick={onDone}>Done</Button>
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Account protected" onBack={onDone} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 24, textAlign: "center", marginBottom: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.danger50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
              <AlertOctagon size={32} color={T.danger600} strokeWidth={1.5} />
            </div>
            <p style={{ fontFamily: font, fontSize: 18, lineHeight: "26px", fontWeight: 600, color: T.gray900, margin: 0 }}>Account protected</p>
            <p className="tabular" style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: "4px 0 0" }}>Case reference {alert.caseRef}</p>
          </div>

          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 16, marginBottom: 12 }}>
            <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 10px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
              What happens next
            </p>
            {[
              "Your Savings account has been partially frozen for outgoing transfers.",
              "Our fraud ops team will investigate within 48 hours.",
              "If confirmed as fraud, the amount will be refunded within 5 business days.",
              "You'll receive push updates as the case progresses.",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 3 ? 8 : 0 }}>
                <CheckCircle2 size={16} color={T.success600} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray700, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => onOpenCase("DIS-2024-00021")}>Track case</Button>
            <Button variant="secondary" size="md" fullWidth onClick={onDone}>Back to home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
      <ScreenHeader title="Was this you?" onBack={onBack} variant="dark" />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ background: T.danger600, borderRadius: T.radiusCard, padding: 20, marginBottom: 12, color: T.white, textAlign: "center" }}>
          <AlertOctagon size={40} color={T.white} strokeWidth={1.5} style={{ margin: "0 auto 10px", display: "block" }} />
          <p style={{ fontFamily: font, fontSize: 20, lineHeight: "28px", fontWeight: 700, color: T.white, margin: 0 }}>Suspicious transaction</p>
          <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: "rgba(255,255,255,0.85)", margin: "4px 0 12px" }}>
            {alert.ruleTriggered}
          </p>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: T.radiusInput, padding: 14 }}>
            <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: "rgba(255,255,255,0.8)", margin: 0, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Transaction</p>
            <div style={{ marginTop: 4 }}>
              <Amount value={txn.amount} size="xl" weight={700} color={T.white} />
            </div>
            <p className="tabular" style={{ fontFamily: font, fontSize: 12, color: "rgba(255,255,255,0.8)", margin: "2px 0 0" }}>
              {txn.date}, {txn.time} · {txn.channel}
            </p>
          </div>
        </div>

        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px", marginBottom: 16 }}>
          <FormList
            rows={[
              { label: "Beneficiary", value: txn.counterparty },
              { label: "Channel", value: txn.channel },
              { label: "Reference", value: <span className="tabular">{txn.reference}</span> },
            ]}
          />
        </div>

        <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray700, textAlign: "center", margin: "0 0 12px" }}>
          Did you authorise this transaction?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button variant="danger" size="lg" fullWidth onClick={() => setState("denied")}>No — this wasn't me</Button>
          <Button variant="secondary" size="lg" fullWidth onClick={() => setState("confirmed")}>Yes, it was me</Button>
        </div>
      </div>
    </div>
  );
}
