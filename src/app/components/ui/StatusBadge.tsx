import { T, font } from "../../tokens";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_MAP: Record<BadgeTone, { bg: string; fg: string }> = {
  success: { bg: T.success50, fg: T.success600 },
  warning: { bg: T.warning50, fg: T.warning600 },
  danger: { bg: T.danger50, fg: T.danger600 },
  info: { bg: T.blue50, fg: T.blue600 },
  neutral: { bg: T.gray100, fg: T.gray700 },
};

// Canonical status vocabulary
const STATUS_LABEL: Record<string, { tone: BadgeTone; label: string }> = {
  // Transactions
  processing: { tone: "info", label: "Processing" },
  completed: { tone: "success", label: "Completed" },
  failed: { tone: "danger", label: "Failed" },
  flagged: { tone: "danger", label: "Flagged" },
  disputed: { tone: "warning", label: "Disputed" },
  reversed: { tone: "neutral", label: "Reversed" },
  // KYC
  submitted: { tone: "info", label: "Submitted" },
  "in review": { tone: "warning", label: "In Review" },
  "more info needed": { tone: "warning", label: "More Info Needed" },
  approved: { tone: "success", label: "Approved" },
  rejected: { tone: "danger", label: "Rejected" },
  // Loans / EMI
  "credit assessment": { tone: "info", label: "Credit Assessment" },
  "counter-offer": { tone: "warning", label: "Counter-Offer" },
  disbursed: { tone: "info", label: "Disbursed" },
  closed: { tone: "neutral", label: "Closed" },
  upcoming: { tone: "info", label: "Upcoming" },
  paid: { tone: "success", label: "Paid" },
  overdue: { tone: "danger", label: "Overdue" },
  restructured: { tone: "warning", label: "Restructured" },
  // Fraud
  open: { tone: "warning", label: "Open" },
  "customer notified": { tone: "info", label: "Customer Notified" },
  "confirmed fraud": { tone: "danger", label: "Confirmed Fraud" },
  cleared: { tone: "success", label: "Cleared" },
  escalated: { tone: "danger", label: "Escalated" },
  // Dispute
  "under investigation": { tone: "warning", label: "Under Investigation" },
  "resolved – refunded": { tone: "success", label: "Resolved – Refunded" },
  "resolved – declined": { tone: "neutral", label: "Resolved – Declined" },
  // Cross-border
  screening: { tone: "info", label: "Screening" },
  sent: { tone: "info", label: "Sent" },
  "in transit": { tone: "info", label: "In Transit" },
  delivered: { tone: "success", label: "Delivered" },
  returned: { tone: "danger", label: "Returned" },
  // Account
  active: { tone: "success", label: "Active" },
  frozen: { tone: "danger", label: "Frozen" },
  dormant: { tone: "neutral", label: "Dormant" },
  // Generic
  pending: { tone: "warning", label: "Pending" },
  draft: { tone: "neutral", label: "Draft" },
  scheduled: { tone: "neutral", label: "Scheduled" },
};

interface StatusBadgeProps {
  status: string;
  tone?: BadgeTone;
  label?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, tone, label, size = "md" }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const cfg = STATUS_LABEL[key];
  const resolvedTone = tone ?? cfg?.tone ?? "neutral";
  const resolvedLabel = label ?? cfg?.label ?? status;
  const { bg, fg } = TONE_MAP[resolvedTone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: bg,
        color: fg,
        borderRadius: T.radiusPill,
        padding: size === "sm" ? "2px 8px" : "3px 10px",
        fontFamily: font,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {resolvedLabel}
    </span>
  );
}
