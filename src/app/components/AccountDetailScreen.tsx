import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Copy, Check, ArrowUpRight, AlertTriangle } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  accountId: string;
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

type TxnFilter = "all" | "credit" | "debit";

export function AccountDetailScreen({ accountId, onBack, onNav }: Props) {
  const state = useAppState();
  const acc = state.accounts.find(a => a.id === accountId) ?? state.accounts[0];
  const allTxns = state.transactions.filter(t => t.accountId === acc.id);
  const [filter, setFilter] = useState<TxnFilter>("all");
  const txns = filter === "all" ? allTxns : allTxns.filter(t => t.type === filter);
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 0" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>{acc.nickname}</p>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "4px 0 0" }}>{acc.type} Account · {acc.numberMasked}</p>
          </div>
          <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: acc.status === "Active" ? C.green : C.amber, background: acc.status === "Active" ? "rgba(0,200,150,0.1)" : "rgba(245,166,35,0.1)", padding: "4px 10px", borderRadius: 20 }}>
            {acc.status}
          </span>
        </div>

        {/* Balance card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px", marginBottom: 20 }}>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Available balance</p>
          <p style={{ fontFamily: font, fontSize: 32, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: "-1px" }}>{fmt(acc.availableBalance)}</p>
          {acc.holdAmount > 0 && (
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 16px" }}>{fmt(acc.holdAmount)} on hold</p>
          )}
          <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Account number</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{acc.numberFull}</p>
                <button onClick={() => copy(acc.numberFull)} style={{ ...S.btnText }}>
                  {copied ? <Check size={14} color={C.green} /> : <Copy size={14} color={C.textMute} />}
                </button>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>IFSC</p>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{acc.ifsc}</p>
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Interest rate</p>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{acc.interestRate}% p.a.</p>
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Opened</p>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{acc.openedDate}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          <button onClick={() => onNav("send-money")} style={{ ...S.btnPrimary, height: 44, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <ArrowUpRight size={16} strokeWidth={2} /> Send Money
          </button>
          <button onClick={() => onNav("statement", { accountId: acc.id })} style={{ ...S.btnGhost, height: 44, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Download size={16} strokeWidth={1.8} /> Statement
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Transactions</p>
          <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{txns.length} shown</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", background: C.surface2, borderRadius: 10, padding: 3, marginBottom: 16, gap: 2 }}>
          {(["all", "credit", "debit"] as TxnFilter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: filter === f ? C.surface3 : "transparent", border: "none", fontFamily: font, fontSize: 12, fontWeight: filter === f ? 700 : 500, color: filter === f ? C.text : C.textMute, cursor: "pointer", textTransform: "capitalize" }}>
              {f === "credit" ? "Credits" : f === "debit" ? "Debits" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ padding: "0 20px 32px" }}>
        {txns.length === 0 && (
          <p style={{ fontFamily: font, fontSize: 14, color: C.textMute, textAlign: "center", marginTop: 40 }}>No transactions yet</p>
        )}
        {txns.map(txn => (
          <button key={txn.id} onClick={() => onNav("txn-detail", { txnId: txn.id })}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "13px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border2}`, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: txn.fraudFlag ? "rgba(255,77,77,0.12)" : C.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {txn.fraudFlag
                ? <AlertTriangle size={16} strokeWidth={1.6} color={C.red} />
                : <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: C.textSub }}>{getInitials(txn.description)}</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.description}</p>
              <p style={{ fontFamily: font, fontSize: 12, color: txn.status === "Flagged" ? C.red : txn.status === "Processing" ? C.amber : C.textMute, margin: "2px 0 0" }}>
                {txn.date} · {txn.status !== "Completed" ? txn.status : txn.channel}
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: txn.type === "credit" ? C.green : C.text, margin: 0 }}>
                {txn.type === "credit" ? "+" : "−"}₹{txn.amount.toLocaleString("en-IN")}
              </p>
              <ChevronRight size={14} color={C.textDim} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
