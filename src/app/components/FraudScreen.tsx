import { ChevronLeft, AlertTriangle, ShieldOff, Phone } from "lucide-react";
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

export function FraudScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const alerts = state.fraudAlerts;

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,77,77,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={22} strokeWidth={1.6} color={C.red} />
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.4px" }}>Fraud Alerts</p>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "2px 0 0" }}>{alerts.length} alert{alerts.length !== 1 ? "s" : ""} detected</p>
          </div>
        </div>

        {alerts.map(alert => {
          const txn = state.transactions.find(t => t.id === alert.txnId);
          const dispute = txn?.disputeId ? state.disputes.find(d => d.id === txn.disputeId) : null;

          return (
            <div key={alert.id} style={{ background: C.surface, border: `1px solid rgba(255,77,77,0.2)`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.red, background: "rgba(255,77,77,0.1)", padding: "3px 10px", borderRadius: 20 }}>
                  {alert.severity.toUpperCase()} RISK
                </span>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{alert.date}, {alert.time}</p>
              </div>

              <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>{alert.description}</p>
              {txn && (
                <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 14px" }}>Amount: {fmt(txn.amount)} · Ref: {txn.reference}</p>
              )}

              {alert.autoFrozen && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.15)", borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
                  <ShieldOff size={16} strokeWidth={1.6} color={C.red} />
                  <p style={{ fontFamily: font, fontSize: 13, color: C.red, margin: 0 }}>Account partially frozen as a precaution</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {txn && !dispute && (
                  <button onClick={() => onNav("dispute-form", { txnId: txn.id })} style={{ ...S.btnPrimary, height: 44, fontSize: 14, background: C.red, color: "#fff" }}>
                    Dispute this transaction
                  </button>
                )}
                {dispute && (
                  <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.amber, margin: "0 0 2px" }}>Dispute #{dispute.id}</p>
                    <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{dispute.status} · Expected by {dispute.expectedResolutionBy}</p>
                  </div>
                )}
                <button style={{ ...S.btnGhost, height: 44, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Phone size={16} strokeWidth={1.6} /> Call fraud helpline
                </button>
              </div>

              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "12px 0 0" }}>Case Ref: {alert.caseRef}</p>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>🛡️</p>
            <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>No alerts</p>
            <p style={{ fontFamily: font, fontSize: 14, color: C.textMute }}>Your account looks secure</p>
          </div>
        )}
      </div>
    </div>
  );
}
