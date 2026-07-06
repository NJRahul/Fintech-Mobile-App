import { useState } from "react";
import { ChevronLeft, QrCode, Camera, Check, X, ChevronRight } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import { useToast } from "./Toast";

interface Props {
  onBack: () => void;
  initialView?: "scan";
}

type Tab = "id" | "scan" | "mandates" | "collect";

export function UPIScreen({ onBack, initialView }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>(initialView === "scan" ? "scan" : "id");

  const TABS: { id: Tab; label: string }[] = [
    { id: "id",       label: "UPI ID" },
    { id: "scan",     label: "Scan" },
    { id: "mandates", label: "Mandates" },
    { id: "collect",  label: "Collect" },
  ];

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "56px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.4px" }}>UPI</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: C.surface2, borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: "9px 0", borderRadius: 8, background: tab === t.id ? C.surface3 : "transparent", border: "none", fontFamily: font, fontSize: 13, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.text : C.textSub, cursor: "pointer", transition: "all 150ms" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 32px" }}>
        {/* UPI ID tab */}
        {tab === "id" && (
          <div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center" }}>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 8px" }}>Your UPI ID</p>
              <p style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 16px" }}>{state.user.upiId}</p>
              <div style={{ width: 120, height: 120, background: C.surface2, borderRadius: 12, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <QrCode size={72} strokeWidth={1.2} color={C.text} />
              </div>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>Scan to pay me</p>
            </div>
          </div>
        )}

        {/* Scan tab */}
        {tab === "scan" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 24px", marginBottom: 16 }}>
              <Camera size={64} strokeWidth={1.2} color={C.textMute} style={{ marginBottom: 16 }} />
              <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Camera access needed</p>
              <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 20px" }}>Point your camera at any UPI QR code</p>
              <button onClick={() => toast("Camera access not available in demo mode", "info")} style={{ ...S.btnPrimary }}>Open camera</button>
            </div>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute }}>Or enter UPI ID manually below</p>
            <input type="text" placeholder="Enter UPI ID" style={{ ...S.input, marginTop: 12 }} />
          </div>
        )}

        {/* Mandates tab */}
        {tab === "mandates" && (
          <div>
            <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 16px" }}>Auto-debit mandates</p>
            {state.upiMandates.map(mandate => (
              <div key={mandate.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{mandate.merchant}</p>
                  <button
                    onClick={() => dispatch({ type: "TOGGLE_MANDATE", mandateId: mandate.id })}
                    style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: mandate.status === "Active" ? C.red : C.green, background: "none", border: "none", cursor: "pointer" }}>
                    {mandate.status === "Active" ? "Pause" : "Activate"}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>Up to ₹{mandate.amountCap.toLocaleString("en-IN")} · {mandate.frequency}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: mandate.status === "Active" ? C.green : C.amber, margin: 0, fontWeight: 600 }}>{mandate.status}</p>
                </div>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "4px 0 0" }}>Next: {mandate.nextDebit}</p>
              </div>
            ))}
          </div>
        )}

        {/* Collect tab */}
        {tab === "collect" && (
          <div>
            <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 16px" }}>Pending collect requests</p>
            {state.collectRequests.filter(r => r.status === "Open").map(req => (
              <div key={req.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{req.from}</p>
                  <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>₹{req.amount.toLocaleString("en-IN")}</p>
                </div>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 12px" }}>{req.note} · {req.expiresIn}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button
                    onClick={() => {
                      dispatch({ type: "PAY_COLLECT", requestId: req.id, accountId: state.accounts[0].id });
                      toast(`₹${req.amount.toLocaleString("en-IN")} paid to ${req.from}`, "success");
                    }}
                    style={{ background: C.text, color: C.bg, border: "none", borderRadius: 10, padding: "10px", fontFamily: font, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Check size={14} strokeWidth={2.5} /> Pay
                  </button>
                  <button
                    onClick={() => {
                      dispatch({ type: "DECLINE_COLLECT", requestId: req.id });
                      toast("Request declined", "info");
                    }}
                    style={{ background: C.surface2, color: C.textSub, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px", fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <X size={14} strokeWidth={2} /> Decline
                  </button>
                </div>
              </div>
            ))}
            {state.collectRequests.filter(r => r.status === "Open").length === 0 && (
              <p style={{ fontFamily: font, fontSize: 14, color: C.textMute, textAlign: "center", marginTop: 40 }}>No pending requests</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
