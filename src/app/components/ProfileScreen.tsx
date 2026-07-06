import { ChevronLeft, ChevronRight, Shield, Bell, HelpCircle, Star, Users, LogOut, CreditCard, FileText } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
  onLogout: () => void;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { label: "Security",          Icon: Shield,      screen: "security"      as Screen },
      { label: "Notifications",     Icon: Bell,        screen: "notifications" as Screen },
      { label: "Cards",             Icon: CreditCard,  screen: "cards"         as Screen },
    ],
  },
  {
    title: "Rewards",
    items: [
      { label: "My Rewards",        Icon: Star,        screen: "rewards"   as Screen },
      { label: "Refer & Earn",      Icon: Users,       screen: "referral"  as Screen },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help & Support",    Icon: HelpCircle,  screen: "support"  as Screen },
      { label: "FAQs",              Icon: FileText,    screen: "faq"      as Screen },
    ],
  },
];

export function ProfileScreen({ onBack, onNav, onLogout }: Props) {
  const state = useAppState();
  const { user } = state;
  const unread = state.notifications.filter(n => !n.read).length;

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 24px", letterSpacing: "-0.5px" }}>Profile</p>

        {/* User card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 20, background: C.surface3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.text }}>{getInitials(user.name)}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: 18, fontWeight: 800, color: C.text, margin: "0 0 3px" }}>{user.name}</p>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 6px" }}>{user.mobile}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.green, background: "rgba(0,200,150,0.1)", padding: "2px 8px", borderRadius: 10 }}>KYC Verified</span>
              <span style={{ fontFamily: font, fontSize: 11, color: C.textMute, textTransform: "capitalize" }}>{user.accountTier}</span>
            </div>
          </div>
        </div>

        {/* Credit score */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 4px" }}>Credit score</p>
              <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: 0 }}>{user.creditScore}</p>
            </div>
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.green, background: "rgba(0,200,150,0.1)", padding: "4px 14px", borderRadius: 20 }}>{user.creditScoreCategory}</span>
          </div>
        </div>

        {/* KYC details */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
          <p style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Personal details</p>
          {[
            { label: "Email",    value: user.email },
            { label: "DOB",      value: user.dob },
            { label: "PAN",      value: user.panMasked },
            { label: "UPI ID",   value: user.upiId },
            { label: "Nominee",  value: user.nominee },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: C.text, margin: 0, maxWidth: "55%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Menu sections */}
        {MENU_SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.textMute, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{section.title}</p>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
              {section.items.map(({ label, Icon, screen }, idx) => (
                <button key={label} onClick={() => onNav(screen)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", background: "none", border: "none", borderBottom: idx < section.items.length - 1 ? `1px solid ${C.border2}` : "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={17} strokeWidth={1.6} color={C.textSub} />
                  </div>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, margin: 0, flex: 1 }}>{label}</p>
                  {label === "Notifications" && unread > 0 && (
                    <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: C.bg, background: C.red, width: 20, height: 20, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>
                  )}
                  <ChevronRight size={16} color={C.textDim} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button onClick={onLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "15px", background: "rgba(255,77,77,0.07)", border: "1px solid rgba(255,77,77,0.15)", borderRadius: 14, cursor: "pointer", marginTop: 8 }}>
          <LogOut size={18} strokeWidth={1.6} color={C.red} />
          <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: C.red }}>Log out</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, textAlign: "center", marginTop: 20 }}>
          {user.id} · Meridian Bank v2.4.1
        </p>
      </div>
    </div>
  );
}
