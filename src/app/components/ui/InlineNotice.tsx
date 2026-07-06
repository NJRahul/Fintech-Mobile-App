import type { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { T, font } from "../../tokens";

type NoticeTone = "info" | "success" | "warning" | "danger";

const CFG: Record<NoticeTone, { bg: string; fg: string; border: string; Icon: typeof Info }> = {
  info: { bg: T.blue50, fg: T.blue600, border: T.blue600, Icon: Info },
  success: { bg: T.success50, fg: T.success600, border: T.success600, Icon: CheckCircle2 },
  warning: { bg: T.warning50, fg: T.warning600, border: T.warning600, Icon: AlertTriangle },
  danger: { bg: T.danger50, fg: T.danger600, border: T.danger600, Icon: XCircle },
};

interface InlineNoticeProps {
  tone?: NoticeTone;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function InlineNotice({ tone = "info", title, children, action }: InlineNoticeProps) {
  const { bg, fg, border, Icon } = CFG[tone];
  return (
    <div
      style={{
        background: bg,
        borderRadius: T.radiusInput,
        borderLeft: `4px solid ${border}`,
        padding: "12px 14px",
        display: "flex",
        gap: 10,
      }}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon size={18} color={fg} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: fg, margin: "0 0 2px" }}>
            {title}
          </p>
        )}
        <div style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", color: T.gray700 }}>
          {children}
        </div>
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
    </div>
  );
}
