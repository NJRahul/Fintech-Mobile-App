import { ChevronLeft, Fingerprint, Lock, Smartphone, ShieldCheck, AlertTriangle, ChevronRight } from "lucide-react";
import { C, font, S } from "../theme";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
}

export function SecurityScreen({ onBack }: Props) {
  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Security</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>Protect your account</p>

        {/* Security score */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <ShieldCheck size={20} strokeWidth={1.6} color={C.green} />
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.green }}>Account secure</span>
          </div>
          <p style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>87/100</p>
          <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>Security score · Good</p>
        </div>

        {[
          {
            title: "Authentication",
            items: [
              { label: "Biometric login",    sub: "Fingerprint enabled", Icon: Fingerprint, enabled: true  },
              { label: "PIN",                sub: "4-digit app PIN",      Icon: Lock,        enabled: true  },
              { label: "2-step verification",sub: "SMS OTP on login",     Icon: Smartphone,  enabled: true  },
            ],
          },
          {
            title: "Alerts",
            items: [
              { label: "Transaction alerts",    sub: "Push & SMS",    Icon: AlertTriangle, enabled: true  },
              { label: "Login alerts",          sub: "Push only",     Icon: ShieldCheck,   enabled: true  },
              { label: "Large transfer alerts", sub: "Above ₹50,000", Icon: AlertTriangle, enabled: false },
            ],
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.textMute, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{section.title}</p>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
              {section.items.map(({ label, sub, Icon, enabled }, idx) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", borderBottom: idx < section.items.length - 1 ? `1px solid ${C.border2}` : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} strokeWidth={1.6} color={C.textSub} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, margin: "0 0 2px" }}>{label}</p>
                    <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{sub}</p>
                  </div>
                  <div style={{ width: 44, height: 26, borderRadius: 13, background: enabled ? C.green : C.surface3, position: "relative" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3, left: enabled ? 21 : 3, transition: "left 200ms" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Linked devices */}
        <p style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.textMute, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Linked devices</p>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px" }}>
          {[
            { device: "iPhone 15 Pro",    time: "Current session",   current: true },
            { device: "MacBook Pro",      time: "Last seen 2d ago",  current: false },
          ].map(({ device, time, current }) => (
            <div key={device} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border2}` }}>
              <div>
                <p style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, margin: "0 0 2px" }}>{device}</p>
                <p style={{ fontFamily: font, fontSize: 12, color: current ? C.green : C.textMute, margin: 0 }}>{time}</p>
              </div>
              {!current && <button style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.red, background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
