import type { ReactNode } from "react";
import { ChevronRight, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Wallet, Receipt, Building2 } from "lucide-react";
import { T, font } from "../../tokens";
import { Amount } from "./Amount";
import { StatusBadge } from "./StatusBadge";

export type TxnChannel = "transfer" | "card" | "upi" | "emi" | "wallet" | "cash";

const CHANNEL_ICON: Record<TxnChannel, typeof CreditCard> = {
  transfer: Building2,
  card: CreditCard,
  upi: Smartphone,
  emi: Receipt,
  wallet: Wallet,
  cash: ArrowDownLeft,
};

interface TxnRowProps {
  title: string;
  meta: string; // date · channel · reference
  amount: number;
  type: "credit" | "debit";
  channel?: TxnChannel;
  status?: string; // "completed" hides the badge per spec (right shows amount only)
  onClick?: () => void;
  isLast?: boolean;
  rightSlot?: ReactNode;
}

export function TxnRow({ title, meta, amount, type, channel = "transfer", status = "completed", onClick, isLast, rightSlot }: TxnRowProps) {
  const Icon = CHANNEL_ICON[channel];
  const isCompleted = status.toLowerCase() === "completed";
  const isClickable = !!onClick;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick!();
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: isLast ? "none" : `1px solid ${T.gray200}`,
        cursor: isClickable ? "pointer" : "default",
        background: T.white,
        transition: "background 120ms ease-out",
        minHeight: 64,
      }}
      onMouseEnter={(e) => { if (isClickable) (e.currentTarget as HTMLElement).style.background = T.gray50; }}
      onMouseLeave={(e) => { if (isClickable) (e.currentTarget as HTMLElement).style.background = T.white; }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: "50%",
          background: T.gray100, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon size={18} color={T.gray700} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 500, color: T.gray900, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </p>
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="tabular">
          {meta}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
        <Amount value={amount} type={type} showSign size="md" weight={600} />
        {!isCompleted && <StatusBadge status={status} size="sm" />}
        {rightSlot}
      </div>
      {isClickable && <ChevronRight size={16} color={T.gray500} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
    </div>
  );
}
