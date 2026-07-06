import { useMemo, useState } from "react";
import { Search, Download, Copy, Check, Snowflake } from "lucide-react";
import { T, font } from "../tokens";
import { ACCOUNTS, TRANSACTIONS } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Amount } from "./ui/Amount";
import { TxnRow } from "./ui/TxnRow";
import { StatusBadge } from "./ui/StatusBadge";
import { FormList } from "./ui/FormList";
import { Button } from "./ui/Button";

interface AccountDetailProps {
  accountId: string;
  onBack: () => void;
  onTxnClick: (txnId: string) => void;
  onStatement: () => void;
}

const FILTERS = ["All", "Credits", "Debits", "Processing", "Flagged"] as const;
type Filter = typeof FILTERS[number];

export function AccountDetail({ accountId, onBack, onTxnClick, onStatement }: AccountDetailProps) {
  const acc = ACCOUNTS.find((a) => a.id === accountId) ?? ACCOUNTS[0];
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState(false);

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const matchFilter =
        filter === "All" ? true :
        filter === "Credits" ? t.type === "credit" :
        filter === "Debits" ? t.type === "debit" :
        filter === "Processing" ? t.status === "Processing" :
        filter === "Flagged" ? t.status === "Flagged" : true;
      const q = query.toLowerCase();
      const matchQuery = q
        ? t.description.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q) || t.counterparty.toLowerCase().includes(q)
        : true;
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.gray100 }}>
      <ScreenHeader title={acc.nickname} subtitle={`${acc.type} · ${acc.accountNumberMasked}`} onBack={onBack} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Balance summary */}
        <div style={{ background: T.white, padding: 20, borderBottom: `1px solid ${T.gray200}` }}>
          <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0, letterSpacing: "0.03em", textTransform: "uppercase", fontWeight: 600 }}>Available balance</p>
          <div style={{ marginTop: 4 }}>
            <Amount value={acc.availableBalance} size="hero" weight={700} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray500, margin: 0 }}>Total balance</p>
              <Amount value={acc.balance} size="sm" />
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray500, margin: 0 }}>On hold</p>
              <Amount value={acc.holdAmount} size="sm" color={acc.holdAmount > 0 ? T.warning600 : T.gray900} />
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray500, margin: 0 }}>Status</p>
              <div style={{ marginTop: 2 }}>
                <StatusBadge status={acc.status} size="sm" />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button variant="secondary" size="sm" fullWidth leftIcon={<Download size={16} strokeWidth={1.5} />} onClick={onStatement}>Statement</Button>
            <Button variant="secondary" size="sm" fullWidth leftIcon={<Snowflake size={16} strokeWidth={1.5} />}>Freeze</Button>
          </div>
        </div>

        {/* Account info */}
        <div style={{ padding: 16 }}>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px" }}>
            <FormList
              rows={[
                {
                  label: "Account number",
                  value: (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span className="tabular">
                        {showFullNumber ? acc.accountNumberFull : acc.accountNumberMasked}
                      </span>
                      <button
                        onClick={() => setShowFullNumber((v) => !v)}
                        style={{ background: "none", border: "none", color: T.blue600, fontFamily: font, fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                      >
                        {showFullNumber ? "Hide" : "Reveal"}
                      </button>
                      <button
                        onClick={() => copy(acc.accountNumberFull)}
                        aria-label="Copy account number"
                        style={{ background: "none", border: "none", cursor: "pointer", color: T.gray500, display: "flex" }}
                      >
                        {copied ? <Check size={14} strokeWidth={1.5} color={T.success600} /> : <Copy size={14} strokeWidth={1.5} />}
                      </button>
                    </span>
                  ),
                },
                { label: "IFSC", value: <span className="tabular">{acc.ifsc}</span> },
                { label: "Type", value: acc.type },
                { label: "Opened", value: <span className="tabular">{acc.openedDate}</span> },
                { label: "Interest rate", value: <span className="tabular">{acc.interestRate}% p.a.</span> },
                { label: "Daily transfer limit", value: <Amount value={acc.dailyTransferLimit} size="md" /> },
              ]}
            />
          </div>
        </div>

        {/* Search + filters */}
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.white, border: `1px solid ${T.gray300}`, borderRadius: T.radiusInput, padding: "0 12px", height: 44 }}>
            <Search size={16} color={T.gray500} strokeWidth={1.5} />
            <input
              placeholder="Search description or reference"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", fontFamily: font, fontSize: 14, color: T.gray900, flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  flexShrink: 0,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: filter === f ? `1px solid ${T.blue600}` : `1px solid ${T.gray300}`,
                  background: filter === f ? T.blue50 : T.white,
                  color: filter === f ? T.blue600 : T.gray700,
                  fontFamily: font, fontSize: 13, lineHeight: "18px",
                  fontWeight: filter === f ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 120ms ease-out",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger */}
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", color: T.gray500, margin: 0 }}>No transactions match your filter.</p>
              </div>
            ) : (
              filtered.map((txn, i) => (
                <TxnRow
                  key={txn.id}
                  title={txn.description}
                  meta={`${txn.date} · ${txn.channel} · ${txn.reference.split("/").slice(-1)[0]}`}
                  amount={txn.amount}
                  type={txn.type}
                  channel={txn.channelCategory}
                  status={txn.status}
                  onClick={() => onTxnClick(txn.id)}
                  isLast={i === filtered.length - 1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
