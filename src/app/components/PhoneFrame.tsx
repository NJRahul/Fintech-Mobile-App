import type { ReactNode } from "react";
import { T } from "../tokens";

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.gray100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "Inter, -apple-system, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: 390,
          height: 844,
          background: T.gray100,
          borderRadius: 44,
          boxShadow: `0 24px 80px rgba(14,27,51,0.30), 0 0 0 12px ${T.navy900}, inset 0 0 0 2px rgba(255,255,255,0.06)`,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            background: T.white,
            padding: "12px 28px 8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            zIndex: 10,
            position: "relative",
          }}
        >
          <span style={{ color: T.gray900, fontSize: 13, fontWeight: 600 }}>9:41</span>
          <div
            style={{
              width: 120,
              height: 26,
              background: T.gray900,
              borderRadius: 13,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 8,
            }}
          />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="3" width="3" height="9" rx="1" fill={T.gray900} opacity="0.4" />
              <rect x="4.5" y="2" width="3" height="10" rx="1" fill={T.gray900} opacity="0.6" />
              <rect x="9" y="0" width="3" height="12" rx="1" fill={T.gray900} opacity="0.8" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill={T.gray900} />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12">
              <rect x="0" y="3" width="16" height="6" rx="2" fill={T.gray900} fillOpacity="0.3" />
              <rect x="1" y="4" width="11" height="4" rx="1.5" fill={T.gray900} />
              <rect x="14" y="5" width="2" height="2" rx="1" fill={T.gray900} />
            </svg>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
