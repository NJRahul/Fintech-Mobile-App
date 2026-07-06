import { ChevronLeft, AlertTriangle, CheckCircle, Clock, XCircle, Flag, Copy, Check } from "lucide-react";
import { useState } from "react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  txnId: string;
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

const STATUS_CONFIG = {
  Completed:   { color: "#00C896", Icon: CheckCircle, label: "Completed" },
  Processing:  { color: "#F5A623", Icon: Clock,       label: "Processing" },
  Failed:      { color: "#FF4D4D", Icon: XCircle,     label: "Failed" },
  Flagged:     { color: "#FF4D4D", Icon: AlertTriangle,label: "Flagged" },
  Disputed:    { color: "#F5A623", Icon: Flag,         label: "Disputed" },
  Reversed:    { color: "#AAAAAA", Icon: CheckCircle,  label: "Reversed" },
};

export function TransactionDetailScreen({ txnId, onBack, onNav }: Props) {
  const state = useAppState();
  const txn = state.transactions.find(t => t.id === txnId) ?? state.transactions[0];
  const [copied, setCopied] = useState(false);

  const cfg = STATUS_CONFIG[txn.status] ?? STATUS_CONFIG.Completed;
  const dispute = txn.disputeId ? state.disputes.find(d => d.id === txn.disputeId) : null;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, borderBottom: `1px solid ${C.border2}` }}>
        <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
        <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0, textAlign: "right", maxWidth: "55%", fontVariantNumeric: mono ? "tabular-nums" : "normal" }}>{value}</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        {/* Amount hero */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: txn.fraudFlag ? "rgba(255,77,77,0.12)" : C.surface2, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <cfg.Icon size={24} strokeWidth={1.6} color={cfg.color} />
          </div>
          <p style={{ fontFamily: font, fontSize: 34, fontWeight: 800, color: txn.type === "credit" ? C.green : C.text, margin: "0 0 6px", letterSpacing: "-1px" }}>
            {txn.type === "credit" ? "+" : "−"}{fmt(txn.amount)}
          </p>
          <p style={{ fontFamily: font, fontSize: 15, color: C.textSub, margin: "0 0 8px" }}>{txn.description}</p>
          <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: cfg.color, background: `${cfg.color}18`, padding: "4px 12px", borderRadius: 20 }}>
            {cfg.label}
          </span>
        </div>

        {/* Fraud warning */}
        {txn.fraudFlag && (
          <div style={{ background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.red, margin: "0 0 4px" }}>Suspicious transaction flagged</p>
            <p style={{ fontFamily: font, fontSize: 12, color: "rgba(255,100,100,0.8)", margin: "0 0 10px" }}>This transaction was flagged by our fraud detection system. Please review.</p>
            {!dispute && (
              <button onClick={() => onNav("dispute-form", { txnId: txn.id })}
                style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.red, background: "none", border: `1px solid rgba(255,77,77,0.3)`, borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                Raise a dispute
              </button>
            )}
          </div>
        )}

        {/* Details */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
          <Row label="Counterparty" value={txn.counterparty} />
          <Row label="Date & Time" value={`${txn.date}, ${txn.time}`} />
          <Row label="Channel" value={txn.channel} />
          <Row label="Category" value={txn.category.toUpperCase()} />
          <Row label="Running Balance" value={fmt(txn.runningBalance)} mono />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>Reference</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: C.text, margin: 0, maxWidth: 180, wordBreak: "break-all", textAlign: "right" }}>{txn.reference}</p>
              <button onClick={() => copy(txn.reference)} style={{ ...S.btnText, padding: 0 }}>
                {copied ? <Check size={14} color={C.green} /> : <Copy size={14} color={C.textMute} />}
              </button>
            </div>
          </div>
          {txn.notes && <Row label="Notes" value={txn.notes} />}
        </div>

        {/* Dispute status */}
        {dispute && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Dispute #{dispute.id}</p>
            <Row label="Status" value={dispute.status} />
            <Row label="Filed on" value={dispute.filedOn} />
            <Row label="Expected resolution" value={dispute.expectedResolutionBy} />
          </div>
        )}
      </div>
    </div>
  );
}
