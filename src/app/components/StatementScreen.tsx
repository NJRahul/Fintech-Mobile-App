import { useState } from "react";
import { ChevronLeft, Download, Filter } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";

interface Props {
  accountId: string;
  onBack: () => void;
}

const PERIODS = ["Last 30 days", "Last 3 months", "Last 6 months", "This year"] as const;

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function StatementScreen({ accountId, onBack }: Props) {
  const state = useAppState();
  const acc = state.accounts.find(a => a.id === accountId) ?? state.accounts[0];
  const [period, setPeriod] = useState<typeof PERIODS[number]>("Last 30 days");
  const [downloaded, setDownloaded] = useState(false);

  const txns = state.transactions.filter(t => t.accountId === acc.id);
  const credits = txns.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const debits  = txns.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>Statement</p>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "4px 0 0" }}>{acc.nickname} · {acc.numberMasked}</p>
          </div>
          <button onClick={handleDownload}
            style={{ display: "flex", alignItems: "center", gap: 8, background: downloaded ? C.green : C.surface2, border: `1px solid ${downloaded ? C.green : C.border}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", transition: "all 200ms" }}>
            <Download size={16} strokeWidth={1.8} color={downloaded ? "#000" : C.textSub} />
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: downloaded ? "#000" : C.text }}>{downloaded ? "Downloaded" : "PDF"}</span>
          </button>
        </div>

        {/* Period filter */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ flexShrink: 0, background: period === p ? C.text : C.surface2, color: period === p ? C.bg : C.textSub, border: `1px solid ${period === p ? C.text : C.border}`, borderRadius: 20, padding: "8px 16px", fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 150ms" }}>
              {p}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          <div style={{ background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.15)", borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontFamily: font, fontSize: 11, color: C.green, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Credits</p>
            <p style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.green, margin: 0 }}>{fmt(credits)}</p>
          </div>
          <div style={{ background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.15)", borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontFamily: font, fontSize: 11, color: C.red, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Debits</p>
            <p style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: C.red, margin: 0 }}>{fmt(debits)}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>All transactions ({txns.length})</p>
          <button style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4 }}>
            <Filter size={14} strokeWidth={1.6} color={C.textMute} />
            <span style={{ fontFamily: font, fontSize: 13, color: C.textMute }}>Filter</span>
          </button>
        </div>
      </div>

      <div style={{ padding: "0 20px 32px" }}>
        {txns.map(txn => (
          <div key={txn.id}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: `1px solid ${C.border2}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.description}</p>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>{txn.date} · {txn.channel}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: txn.type === "credit" ? C.green : C.text, margin: 0 }}>
                {txn.type === "credit" ? "+" : "−"}₹{txn.amount.toLocaleString("en-IN")}
              </p>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "2px 0 0" }}>Bal: ₹{txn.runningBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
