import { CheckCircle2, Clock, MessageSquareWarning } from "lucide-react";
import { T, font } from "../tokens";
import { DISPUTES, TRANSACTIONS } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Amount } from "./ui/Amount";
import { StatusBadge } from "./ui/StatusBadge";
import { FormList } from "./ui/FormList";
import { Button } from "./ui/Button";
import { InlineNotice } from "./ui/InlineNotice";

interface DisputeTrackerProps {
  disputeId?: string;
  onBack: () => void;
  onTxnClick: (txnId: string) => void;
}

export function DisputeTracker({ disputeId, onBack, onTxnClick }: DisputeTrackerProps) {
  const dispute = DISPUTES.find((d) => d.id === disputeId) ?? DISPUTES[0];
  const txn = TRANSACTIONS.find((t) => t.id === dispute.txnId);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
      <ScreenHeader title="Dispute case" subtitle={dispute.id} onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 20, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Disputed amount</p>
              <div style={{ marginTop: 4 }}>
                <Amount value={dispute.amount} size="xl" weight={700} />
              </div>
            </div>
            <StatusBadge status={dispute.status} />
          </div>
          <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray700, margin: 0 }}>{dispute.reason}</p>
        </div>

        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px", marginBottom: 12 }}>
          <FormList
            rows={[
              { label: "Filed on", value: <span className="tabular">{dispute.filedOn}</span> },
              { label: "Expected resolution", value: <span className="tabular">{dispute.expectedResolutionBy}</span> },
              { label: "Assigned to", value: dispute.assignedTo },
              { label: "Transaction", value: <button onClick={() => txn && onTxnClick(txn.id)} style={{ background: "none", border: "none", color: T.blue600, fontFamily: font, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0 }}>{txn?.id ?? dispute.txnId}</button> },
            ]}
          />
        </div>

        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Case timeline
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 16, marginBottom: 12 }}>
          {dispute.updates.map((u, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: i === dispute.updates.length - 1 ? T.warning600 : T.success600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === dispute.updates.length - 1 ? <Clock size={8} color={T.white} strokeWidth={3} /> : <CheckCircle2 size={9} color={T.white} strokeWidth={3} />}
                </div>
                {i < dispute.updates.length - 1 && <div style={{ width: 2, flex: 1, background: T.success600, marginTop: 2, minHeight: 24 }} />}
              </div>
              <div style={{ paddingBottom: i < dispute.updates.length - 1 ? 16 : 0 }}>
                <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray900, margin: 0, fontWeight: 500 }}>{u.note}</p>
                <p className="tabular" style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray500, margin: "2px 0 0" }}>{u.date} · {u.time}</p>
              </div>
            </div>
          ))}
        </div>

        <InlineNotice tone="info">
          You'll receive a push notification when the case is resolved. Refunds, if applicable, are credited back within 3 business days.
        </InlineNotice>

        <div style={{ marginTop: 12 }}>
          <Button variant="secondary" size="md" fullWidth leftIcon={<MessageSquareWarning size={16} strokeWidth={1.5} />}>Add evidence</Button>
        </div>
      </div>
    </div>
  );
}
