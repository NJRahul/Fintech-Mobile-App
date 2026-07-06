import { ChevronRight, User as UserIcon, CreditCard, Shield, Bell, HelpCircle, FileText, LogOut, Wallet, MessageSquareWarning, Globe, Smartphone, Building2 } from "lucide-react";
import { T, font } from "../tokens";
import { CUSTOMER, BANK } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { StatusBadge } from "./ui/StatusBadge";

interface MoreScreenProps {
  onLogout: () => void;
  onNav: (dest: "cards" | "wallet" | "upi" | "security" | "notifications" | "dispute" | "profile" | "crossborder") => void;
}

interface Section {
  title: string;
  items: { label: string; sub?: string; Icon: typeof UserIcon; dest: Parameters<MoreScreenProps["onNav"]>[0] }[];
}

export function MoreScreen({ onLogout, onNav }: MoreScreenProps) {
  const sections: Section[] = [
    {
      title: "Banking",
      items: [
        { label: "Cards", sub: "Debit + Credit card controls", Icon: CreditCard, dest: "cards" },
        { label: "Wallet", sub: "Instant payments wallet", Icon: Wallet, dest: "wallet" },
        { label: "UPI", sub: "Scan, pay, receive, mandates", Icon: Smartphone, dest: "upi" },
        { label: "Send abroad", sub: "Cross-border SWIFT / SEPA transfers", Icon: Globe, dest: "crossborder" },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Profile & KYC", sub: `${CUSTOMER.kycTier} verified`, Icon: UserIcon, dest: "profile" },
        { label: "Security center", sub: "PIN, biometric, devices, limits", Icon: Shield, dest: "security" },
        { label: "Notifications", sub: "Alert preferences and history", Icon: Bell, dest: "notifications" },
        { label: "Disputes", sub: "Open cases and history", Icon: MessageSquareWarning, dest: "dispute" },
      ],
    },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100, overflow: "hidden" }}>
      <div style={{ background: T.white, borderBottom: `1px solid ${T.gray200}`, padding: "12px 16px", flexShrink: 0 }}>
        <h1 style={{ fontFamily: font, fontSize: 20, lineHeight: "28px", fontWeight: 600, color: T.gray900, margin: 0 }}>More</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Profile header */}
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: T.blue600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: T.white }}>PS</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: font, fontSize: 15, lineHeight: "22px", fontWeight: 600, color: T.gray900, margin: 0 }}>{CUSTOMER.name}</p>
            <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>{CUSTOMER.id}</p>
            <div style={{ marginTop: 4 }}>
              <StatusBadge status="approved" label="KYC Verified" size="sm" />
            </div>
          </div>
          <button
            onClick={() => onNav("profile")}
            style={{ background: "none", border: "none", color: T.blue600, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            View
          </button>
        </div>

        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>{s.title}</p>
            <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden" }}>
              {s.items.map((it, i) => (
                <button
                  key={it.label}
                  onClick={() => onNav(it.dest)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%",
                    padding: "12px 16px", background: "none", border: "none",
                    borderBottom: i < s.items.length - 1 ? `1px solid ${T.gray200}` : "none",
                    cursor: "pointer", textAlign: "left", transition: "background 120ms ease-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = T.gray50)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <it.Icon size={20} color={T.gray700} strokeWidth={1.5} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 500, color: T.gray900, margin: 0 }}>{it.label}</p>
                    {it.sub && <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>{it.sub}</p>}
                  </div>
                  <ChevronRight size={16} color={T.gray500} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Support */}
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Support</p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden", marginBottom: 16 }}>
          {[
            { label: "Help & FAQ", Icon: HelpCircle },
            { label: "Chat with support", Icon: MessageSquareWarning },
            { label: "Terms & Privacy", Icon: FileText },
            { label: "About Meridian Bank", Icon: Building2 },
          ].map((it, i, arr) => (
            <button
              key={it.label}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "12px 16px", background: "none", border: "none",
                borderBottom: i < arr.length - 1 ? `1px solid ${T.gray200}` : "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <it.Icon size={20} color={T.gray700} strokeWidth={1.5} />
              <span style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 500, color: T.gray900, flex: 1 }}>{it.label}</span>
              <ChevronRight size={16} color={T.gray500} strokeWidth={1.5} />
            </button>
          ))}
        </div>

        <p className="tabular" style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray500, textAlign: "center", margin: "0 0 12px" }}>
          {BANK.name} · v4.2.1 · 2024-07-05
        </p>

        <button
          onClick={onLogout}
          style={{
            width: "100%", height: 48, background: T.danger50, border: `1px solid ${T.danger600}`,
            borderRadius: T.radiusInput, color: T.danger600, fontFamily: font, fontSize: 15, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <LogOut size={18} strokeWidth={1.5} /> Sign out
        </button>
      </div>
    </div>
  );
}
