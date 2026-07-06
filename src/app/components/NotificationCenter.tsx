import { useState } from "react";
import { Bell, ShieldAlert, CreditCard, Receipt, User } from "lucide-react";
import { T, font } from "../tokens";
import { NOTIFICATIONS } from "../data/mockData";
import type { NotifType } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";

interface NotificationCenterProps {
  onBack: () => void;
  onDeepLink: (link: string) => void;
}

const TYPE_MAP: Record<NotifType, { Icon: typeof Bell; bg: string; fg: string; label: string }> = {
  transaction: { Icon: Receipt, bg: T.blue50, fg: T.blue600, label: "Transaction" },
  security: { Icon: ShieldAlert, bg: T.danger50, fg: T.danger600, label: "Security" },
  loan: { Icon: CreditCard, bg: T.warning50, fg: T.warning600, label: "Loan" },
  kyc: { Icon: User, bg: T.success50, fg: T.success600, label: "KYC" },
  offer: { Icon: Bell, bg: T.gray100, fg: T.gray700, label: "Offer" },
};

const FILTERS: (NotifType | "all")[] = ["all", "transaction", "security", "loan", "kyc"];

export function NotificationCenter({ onBack, onDeepLink }: NotificationCenterProps) {
  const [filter, setFilter] = useState<NotifType | "all">("all");
  const list = NOTIFICATIONS.filter((n) => filter === "all" ? true : n.type === filter);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
      <ScreenHeader title="Notifications" onBack={onBack} />
      <div style={{ background: T.white, borderBottom: `1px solid ${T.gray200}`, padding: "10px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: 999,
                border: active ? `1px solid ${T.blue600}` : `1px solid ${T.gray300}`,
                background: active ? T.blue50 : T.white,
                color: active ? T.blue600 : T.gray700,
                fontFamily: font, fontSize: 13, fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {f === "all" ? "All" : TYPE_MAP[f].label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {list.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Bell size={32} color={T.gray300} strokeWidth={1.5} style={{ margin: "0 auto 8px", display: "block" }} />
            <p style={{ fontFamily: font, fontSize: 14, color: T.gray500, margin: 0 }}>No notifications in this category.</p>
          </div>
        ) : (
          list.map((n) => {
            const cfg = TYPE_MAP[n.type];
            const clickable = !!n.deepLink;
            return (
              <div
                key={n.id}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                onClick={() => clickable && onDeepLink(n.deepLink!)}
                onKeyDown={(e) => { if (clickable && (e.key === "Enter" || e.key === " ")) onDeepLink(n.deepLink!); }}
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${T.gray200}`,
                  display: "flex",
                  gap: 12,
                  background: n.read ? T.white : T.gray50,
                  cursor: clickable ? "pointer" : "default",
                  position: "relative",
                }}
              >
                {!n.read && (
                  <div style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: T.blue600 }} />
                )}
                <div style={{ width: 36, height: 36, borderRadius: T.radiusInput, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <cfg.Icon size={18} color={cfg.fg} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: T.gray900, margin: 0 }}>{n.title}</p>
                  <p className="tabular" style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray700, margin: "2px 0 0" }}>{n.body}</p>
                  <p className="tabular" style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray500, margin: "4px 0 0" }}>{n.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
