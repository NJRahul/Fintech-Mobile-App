import { useState } from "react";
import { Share2, AlertCircle, Copy, Check, MessageSquareWarning, ShieldAlert } from "lucide-react";
import { T, font } from "../tokens";
import { TRANSACTIONS, ACCOUNTS } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Amount } from "./ui/Amount";
import { StatusBadge } from "./ui/StatusBadge";
import { FormList } from "./ui/FormList";
import { InlineNotice } from "./ui/InlineNotice";
import { Button } from "./ui/Button";

interface TransactionDetailProps {
  txnId: string;
  onBack: () => void;
  onDispute: () => void;
  onReportFraud: () => void;
}

export function TransactionDetail({ txnId, onBack, onDispute, onReportFraud }: TransactionDetailProps) {
  const txn = TRANSACTIONS.find((t) => t.id === txnId) ?? TRANSACTIONS[0];
  const account = ACCOUNTS.find((a) => a.id === txn.accountId);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(txn.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const timeline = [
    { label: "Initiated", time: `${txn.date}, ${txn.time}`, done: true },
    { label: "Bank clearing", time: txn.status === "Failed" ? "Failed to clear" : `${txn.date}, ${txn.time}`, done: txn.status !== "Failed" && txn.status !== "Processing" ? true : txn.status === "Failed" ? false : false, failed: txn.status === "Failed" },
    { label: "Posted to account", time: txn.status === "Completed" ? `${txn.date}, ${txn.time}` : txn.status === "Processing" ? "Estimated within 2 hrs" : "—", done: txn.status === "Completed" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.gray100 }}>
      <ScreenHeader title="Transaction detail" onBack={onBack} />

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Amount hero */}
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 24, textAlign: "center", marginBottom: 12 }}>
          <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: 0 }}>
            {txn.type === "credit" ? "Money received" : "Money sent"}
          </p>
          <div style={{ margin: "8px 0" }}>
            <Amount value={txn.amount} size="hero" type={txn.type} showSign weight={700} />
          </div>
          <p style={{ fontFamily: font, fontSize: 15, lineHeight: "22px", fontWeight: 600, color: T.gray900, margin: "8px 0 12px" }}>{txn.counterparty}</p>
          <div style={{ display: "inline-flex" }}>
            <StatusBadge status={txn.status} />
          </div>
        </div>

        {/* Fraud alert callout */}
        {txn.fraudFlag && (
          <div style={{ marginBottom: 12 }}>
            <InlineNotice
              tone="danger"
              title="Was this you?"
              action={
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="danger" size="sm" onClick={onReportFraud}>No, secure my account</Button>
                  <Button variant="secondary" size="sm">Yes, it was me</Button>
                </div>
              }
            >
              This ₹24,500 IMPS transfer at {txn.time} triggered our fraud rule ({txn.notes}).
            </InlineNotice>
          </div>
        )}

        {/* Timeline */}
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 16, marginBottom: 12 }}>
          <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 12px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
            Status timeline
          </p>
          {timeline.map((step, i) => (
            <div key={step.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: step.failed ? T.danger600 : step.done ? T.success600 : T.gray300,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {step.done && !step.failed && <Check size={10} color={T.white} strokeWidth={3} />}
                </div>
                {i < timeline.length - 1 && (
                  <div style={{ width: 2, height: 24, background: step.done ? T.success600 : T.gray200, marginTop: 2 }} />
                )}
              </div>
              <div style={{ paddingBottom: i < timeline.length - 1 ? 16 : 0, flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: step.done ? 600 : 500, color: step.failed ? T.danger600 : step.done ? T.gray900 : T.gray500, margin: 0 }}>{step.label}</p>
                <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px", marginBottom: 12 }}>
          <FormList
            rows={[
              { label: "From / To", value: txn.counterparty },
              { label: "Channel", value: txn.channel },
              { label: "Category", value: txn.category },
              { label: "Account", value: `${account?.nickname} (${account?.accountNumberMasked})` },
              { label: "Running balance", value: <Amount value={txn.runningBalance} size="md" /> },
              {
                label: "Reference",
                value: (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span className="tabular">{txn.reference}</span>
                    <button
                      onClick={copy}
                      aria-label="Copy reference"
                      style={{ background: "none", border: "none", cursor: "pointer", color: T.gray500, display: "flex" }}
                    >
                      {copied ? <Check size={14} strokeWidth={1.5} color={T.success600} /> : <Copy size={14} strokeWidth={1.5} />}
                    </button>
                  </span>
                ),
              },
              ...(txn.notes ? [{ label: "Notes", value: txn.notes }] : []),
            ]}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="md" fullWidth leftIcon={<Share2 size={16} strokeWidth={1.5} />}>Share receipt</Button>
          {!txn.fraudFlag && (
            <Button variant="secondary" size="md" fullWidth leftIcon={<MessageSquareWarning size={16} strokeWidth={1.5} />} onClick={onDispute}>Raise dispute</Button>
          )}
        </div>
        {!txn.fraudFlag && (
          <button
            onClick={onReportFraud}
            style={{ marginTop: 12, width: "100%", background: "none", border: "none", color: T.danger600, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <ShieldAlert size={14} strokeWidth={1.5} /> Report as fraud
          </button>
        )}
      </div>
    </div>
  );
}
