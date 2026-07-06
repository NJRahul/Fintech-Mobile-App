import { ChevronLeft, Bell, Shield, TrendingUp, Home, Gift, Tag } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

const NOTIF_ICONS: Record<string, typeof Bell> = {
  transaction: Bell,
  security: Shield,
  loan: Home,
  kyc: Shield,
  offer: Tag,
  reward: Gift,
};

export function NotificationsScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const unread = state.notifications.filter(n => !n.read).length;

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} style={{ ...S.btnText }}>
              <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
            </button>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.4px" }}>Notifications</p>
          </div>
          {unread > 0 && (
            <button onClick={() => dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" })}
              style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textMute, background: "none", border: "none", cursor: "pointer" }}>
              Mark all read
            </button>
          )}
        </div>

        {state.notifications.length === 0 && (
          <p style={{ fontFamily: font, fontSize: 14, color: C.textMute, textAlign: "center", marginTop: 60 }}>No notifications</p>
        )}

        {state.notifications.map(notif => {
          const Icon = NOTIF_ICONS[notif.type] ?? Bell;
          const iconBg = {
            transaction: "rgba(74,158,255,0.12)",
            security:    "rgba(255,77,77,0.12)",
            loan:        "rgba(245,166,35,0.12)",
            reward:      "rgba(0,200,150,0.12)",
            offer:       "rgba(74,158,255,0.12)",
            kyc:         "rgba(255,77,77,0.12)",
          }[notif.type] ?? C.surface2;
          const iconColor = {
            transaction: C.blue,
            security:    C.red,
            loan:        C.amber,
            reward:      C.green,
            offer:       C.blue,
            kyc:         C.red,
          }[notif.type] ?? C.textSub;

          return (
            <button key={notif.id}
              onClick={() => {
                dispatch({ type: "MARK_NOTIFICATION_READ", id: notif.id });
                if (notif.deepLink === "fraud") onNav("fraud");
                else if (notif.deepLink === "loan-counter") onNav("loans");
              }}
              style={{ width: "100%", display: "flex", gap: 14, padding: "16px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border2}`, cursor: "pointer", textAlign: "left", alignItems: "flex-start", position: "relative" }}>
              {!notif.read && (
                <div style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: 3, background: C.blue }} />
              )}
              <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} strokeWidth={1.6} color={iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: 14, fontWeight: notif.read ? 400 : 700, color: C.text, margin: "0 0 3px" }}>{notif.title}</p>
                <p style={{ fontFamily: font, fontSize: 13, color: C.textSub, margin: "0 0 4px", lineHeight: 1.5 }}>{notif.body}</p>
                <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: 0 }}>{notif.time}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
