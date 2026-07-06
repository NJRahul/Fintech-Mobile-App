import { useState } from "react";
import { Lock, Fingerprint, Snowflake, LogOut, ShieldAlert, Smartphone, ChevronRight, CheckCircle2 } from "lucide-react";
import { T, font } from "../tokens";
import { DEVICES } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Button } from "./ui/Button";
import { InlineNotice } from "./ui/InlineNotice";
import { FormList } from "./ui/FormList";
import { formatINR } from "../format";

interface SecurityCenterProps {
  onBack: () => void;
}

export function SecurityCenter({ onBack }: SecurityCenterProps) {
  const [devices, setDevices] = useState(DEVICES);

  const revoke = (id: string) => setDevices((d) => d.filter((x) => x.id !== id));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
      <ScreenHeader title="Security center" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Account status */}
        <div style={{ background: T.success50, border: `1px solid ${T.success600}`, borderRadius: T.radiusCard, padding: 14, marginBottom: 12, display: "flex", gap: 10 }}>
          <CheckCircle2 size={20} color={T.success600} strokeWidth={1.5} />
          <div>
            <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: T.success600, margin: 0 }}>Account healthy</p>
            <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray700, margin: 0 }}>No open security incidents. Biometric login enabled.</p>
          </div>
        </div>

        {/* PIN / biometric */}
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "8px 0 8px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Authentication
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden", marginBottom: 12 }}>
          {[
            { Icon: Lock, label: "Change login PIN", sub: "Last changed 42 days ago" },
            { Icon: Fingerprint, label: "Biometric login", sub: "Face ID enabled on this device" },
            { Icon: Lock, label: "Change UPI PIN", sub: "Verify with debit card" },
          ].map((r, i, arr) => (
            <button
              key={r.label}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px", background: "none", border: "none", borderBottom: i < arr.length - 1 ? `1px solid ${T.gray200}` : "none", cursor: "pointer", textAlign: "left" }}
            >
              <r.Icon size={18} color={T.gray700} strokeWidth={1.5} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 500, color: T.gray900, margin: 0 }}>{r.label}</p>
                <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>{r.sub}</p>
              </div>
              <ChevronRight size={16} color={T.gray500} strokeWidth={1.5} />
            </button>
          ))}
        </div>

        {/* Freeze */}
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "8px 0 8px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Account safety
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.radiusInput, background: T.danger50, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Snowflake size={20} color={T.danger600} strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: T.gray900, margin: 0 }}>Freeze account</p>
              <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>Instantly block all outgoing transactions.</p>
            </div>
          </div>
          <Button variant="danger" size="sm">Freeze all accounts</Button>
        </div>

        {/* Limits */}
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px", marginBottom: 12 }}>
          <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "8px 0 4px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Transaction limits</p>
          <FormList
            rows={[
              { label: "Daily transfer", value: <span className="tabular">{formatINR(500000, { decimals: 0 })}</span> },
              { label: "Daily ATM withdrawal", value: <span className="tabular">{formatINR(100000, { decimals: 0 })}</span> },
              { label: "Contactless per-txn", value: <span className="tabular">{formatINR(5000, { decimals: 0 })}</span> },
            ]}
          />
          <div style={{ padding: "8px 0" }}>
            <button style={{ background: "none", border: "none", color: T.blue600, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
              Request a limit change →
            </button>
          </div>
        </div>

        {/* Devices */}
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "8px 0 8px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Logged-in devices
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden", marginBottom: 12 }}>
          {devices.map((d, i) => (
            <div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 14, borderBottom: i < devices.length - 1 ? `1px solid ${T.gray200}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: T.radiusInput, background: d.current ? T.blue50 : T.gray100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Smartphone size={18} color={d.current ? T.blue600 : T.gray700} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: T.gray900, margin: 0 }}>{d.name}</p>
                  {d.current && (
                    <span style={{ background: T.blue50, color: T.blue600, borderRadius: 999, padding: "2px 8px", fontFamily: font, fontSize: 10, fontWeight: 600 }}>THIS DEVICE</span>
                  )}
                </div>
                <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "2px 0 0" }}>{d.os}</p>
                <p className="tabular" style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray500, margin: 0 }}>{d.location} · {d.lastActive}</p>
              </div>
              {!d.current && (
                <Button variant="secondary" size="sm" leftIcon={<LogOut size={14} strokeWidth={1.5} />} onClick={() => revoke(d.id)}>Log out</Button>
              )}
            </div>
          ))}
        </div>

        <InlineNotice tone="warning">
          If you see a device you don't recognise, revoke it immediately and change your PIN.
        </InlineNotice>
      </div>
    </div>
  );
}
