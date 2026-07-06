import { Home, ArrowRightLeft, CreditCard, TrendingUp, User } from "lucide-react";
import { font } from "../theme";

export type NavTab = "home" | "payments" | "cards" | "invest" | "profile";

interface BottomNavProps {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const BG      = "#0D0D0D";
const BORDER  = "rgba(255,255,255,0.07)";
const ACTIVE  = "#FFFFFF";
const INACTIVE = "#444444";

const TABS: { id: NavTab; label: string; Icon: typeof Home }[] = [
  { id: "home",     label: "Home",     Icon: Home           },
  { id: "payments", label: "Payments", Icon: ArrowRightLeft  },
  { id: "cards",    label: "Cards",    Icon: CreditCard      },
  { id: "invest",   label: "Invest",   Icon: TrendingUp      },
  { id: "profile",  label: "Profile",  Icon: User            },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <div
      role="navigation"
      aria-label="Primary"
      style={{
        background: BG,
        borderTop: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "stretch",
        flexShrink: 0,
        paddingBottom: "env(safe-area-inset-bottom, 4px)",
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 5, padding: "10px 0 8px",
            }}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.2 : 1.6}
              color={isActive ? ACTIVE : INACTIVE}
            />
            <span style={{
              fontFamily: font, fontSize: 10,
              color: isActive ? ACTIVE : INACTIVE,
              fontWeight: isActive ? 700 : 400,
              letterSpacing: "0.01em",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
