import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { T, font } from "../../tokens";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: ReactNode;
  variant?: "light" | "dark";
}

export function ScreenHeader({ title, subtitle, onBack, action, variant = "light" }: ScreenHeaderProps) {
  const dark = variant === "dark";
  return (
    <div
      style={{
        background: dark ? T.navy900 : T.white,
        height: 56,
        padding: "0 12px 0 8px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderBottom: dark ? "none" : `1px solid ${T.gray200}`,
        flexShrink: 0,
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 40, height: 40, borderRadius: T.radiusInput, border: "none",
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color={dark ? T.white : T.gray900} strokeWidth={1.5} />
        </button>
      ) : (
        <div style={{ width: 8 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ fontFamily: font, fontSize: 16, lineHeight: "24px", fontWeight: 600, color: dark ? T.white : T.gray900, margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: dark ? "rgba(255,255,255,0.6)" : T.gray500, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
