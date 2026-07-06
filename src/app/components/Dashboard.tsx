import { useState } from "react";
import { Bell, Eye, EyeOff, ChevronRight, ArrowUpRight, QrCode, Plus, Receipt, AlertTriangle, Clock, Wallet, TrendingUp, Zap } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import type { Screen } from "../App";

interface DashboardProps {
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function fmtAmt(n: number) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n;
}
function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

const QUICK_ACTIONS = [
  { id: "send-money", label: "Send", Icon: ArrowUpRight },
  { id: "upi", label: "Scan & Pay", Icon: QrCode },
  { id: "deposits", label: "Add Money", Icon: Plus },
  { id: "loans", label: "Loans", Icon: Receipt },
] as const;

export function Dashboard({ onNav }: DashboardProps) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [balanceHidden, setBalanceHidden] = useState(false);

  const primaryAcc = state.accounts[0];
  const totalBalance = state.accounts.reduce((s, a) => s + a.balance, 0);
  const netWorth = totalBalance
    + state.holdings.reduce((s, h) => s + h.currentValue, 0)
    + state.goldHolding.currentValue
    + state.deposits.reduce((s, d) => s + d.principal, 0)
    + state.pots.reduce((s, p) => s + p.currentAmount, 0);
  const unreadCount = state.notifications.filter(n => !n.read).length;
  const fraudAlert = state.fraudAlerts[0];
  const emiLoan = state.loans.find(l => l.status === "Active");
  const recentTxns = state.transactions.slice(0, 5);

  const debits = state.transactions.filter(t => t.type === "debit");
  const monthSpend = debits.reduce((s, t) => s + t.amount, 0);
  const categorySpend = debits.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  const topCategories = Object.entries(categorySpend).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>

      {/* Header */}
      <div style={{ padding: "56px 20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>Good morning</p>
          <p style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.text, margin: "2px 0 0" }}>
            {state.user.name.split(" ")[0]} 👋
          </p>
        </div>
        <button onClick={() => onNav("notifications")} style={{ ...S.btnText, position: "relative" }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={18} strokeWidth={1.6} color={C.textSub} />
          </div>
          {unreadCount > 0 && (
            <div style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: 8, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: font, fontSize: 9, fontWeight: 700, color: "#fff" }}>{unreadCount}</span>
            </div>
          )}
        </button>
      </div>

      {/* Balance hero */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "24px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>Total balance</p>
            <button onClick={() => setBalanceHidden(h => !h)} style={{ ...S.btnText }}>
              {balanceHidden ? <Eye size={16} strokeWidth={1.5} color={C.textMute} /> : <EyeOff size={16} strokeWidth={1.5} color={C.textMute} />}
            </button>
          </div>
          <p style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: "-1.5px" }}>
            {balanceHidden ? "₹••,•••" : fmt(totalBalance)}
          </p>
          <p style={{ fontFamily: font, fontSize: 13, color: C.textSub, margin: "0 0 20px" }}>Net worth {balanceHidden ? "₹••,•••" : fmtAmt(netWorth)}</p>

          {/* Quick actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {QUICK_ACTIONS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => onNav(id as Screen)}
                style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <Icon size={18} strokeWidth={1.6} color={C.text} />
                <span style={{ fontFamily: font, fontSize: 11, color: C.textSub, fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fraud alert */}
      {fraudAlert && (
        <div onClick={() => onNav("fraud")}
          style={{ margin: "0 20px 16px", background: "rgba(255,77,77,0.08)", border: `1px solid rgba(255,77,77,0.2)`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={18} strokeWidth={1.8} color={C.red} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.red, margin: "0 0 2px" }}>Suspicious activity detected</p>
            <p style={{ fontFamily: font, fontSize: 12, color: "rgba(255,77,77,0.7)", margin: 0 }}>{fraudAlert.description.slice(0, 55)}…</p>
          </div>
          <ChevronRight size={16} color={C.red} />
        </div>
      )}

      {/* EMI due */}
      {emiLoan && (
        <div onClick={() => onNav("loan-detail", { loanId: emiLoan.id })}
          style={{ margin: "0 20px 20px", background: "rgba(245,166,35,0.07)", border: `1px solid rgba(245,166,35,0.15)`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <Clock size={18} strokeWidth={1.8} color={C.amber} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.amber, margin: "0 0 2px" }}>EMI due {emiLoan.nextEmiDate}</p>
            <p style={{ fontFamily: font, fontSize: 12, color: "rgba(245,166,35,0.7)", margin: 0 }}>{emiLoan.type} · {fmt(emiLoan.emiAmount)}</p>
          </div>
          <ChevronRight size={16} color={C.amber} />
        </div>
      )}

      {/* Monthly spend */}
      <div style={{ margin: "0 20px 20px" }}>
        <button onClick={() => onNav("spend")}
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", cursor: "pointer", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Spent this month</p>
              <p style={{ fontFamily: font, fontSize: 26, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-1px" }}>{balanceHidden ? "₹•••" : fmt(monthSpend)}</p>
            </div>
            <ChevronRight size={16} color={C.textDim} />
          </div>
          {topCategories.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              {topCategories.map(([cat, amt]) => (
                <div key={cat} style={{ flex: 1, background: C.surface2, borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <p style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{fmtAmt(amt)}</p>
                  <p style={{ fontFamily: font, fontSize: 10, color: C.textMute, margin: 0, textTransform: "capitalize" }}>{cat}</p>
                </div>
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Accounts */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Accounts</p>
          <button onClick={() => onNav("account-detail", { accountId: primaryAcc.id })} style={{ ...S.btnText, color: C.textMute, fontSize: 13 }}>See all</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.accounts.map(acc => (
            <button key={acc.id} onClick={() => onNav("account-detail", { accountId: acc.id })}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.surface3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wallet size={16} strokeWidth={1.6} color={C.textSub} />
                </div>
                <div>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{acc.nickname}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>{acc.type} · {acc.numberMasked}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{balanceHidden ? "••••" : fmt(acc.balance)}</p>
                <p style={{ fontFamily: font, fontSize: 11, color: acc.status === "Active" ? C.green : C.amber, margin: "2px 0 0" }}>{acc.status}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Invest snapshot */}
      <div style={{ margin: "0 20px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Investments</p>
          <button onClick={() => onNav("portfolio")} style={{ ...S.btnText, color: C.textMute, fontSize: 13 }}>View all</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Mutual Funds", value: fmtAmt(state.holdings.reduce((s, h) => s + h.currentValue, 0)), icon: <TrendingUp size={14} strokeWidth={1.6} color={C.blue} />, screen: "mutual-funds" as Screen },
            { label: "Digital Gold", value: `${state.goldHolding.grams}g`, icon: <Zap size={14} strokeWidth={1.6} color={C.amber} />, screen: "digital-gold" as Screen },
            { label: "Fixed Deposits", value: fmtAmt(state.deposits.reduce((s, d) => s + d.principal, 0)), icon: <Receipt size={14} strokeWidth={1.6} color={C.green} />, screen: "deposits" as Screen },
          ].map(({ label, value, icon, screen }) => (
            <button key={label} onClick={() => onNav(screen)}
              style={{ background: C.surface2, borderRadius: 12, padding: "12px 10px", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ marginBottom: 6 }}>{icon}</div>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{value}</p>
              <p style={{ fontFamily: font, fontSize: 10, color: C.textMute, margin: 0 }}>{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ padding: "0 20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Recent</p>
          <button onClick={() => onNav("account-detail", { accountId: primaryAcc.id })} style={{ ...S.btnText, color: C.textMute, fontSize: 13 }}>All transactions</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recentTxns.map(txn => (
            <button key={txn.id} onClick={() => onNav("txn-detail", { txnId: txn.id })}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border2}`, cursor: "pointer", textAlign: "left" }}>
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
              <p style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: txn.type === "credit" ? C.green : C.text, margin: 0, flexShrink: 0 }}>
                {txn.type === "credit" ? "+" : "−"}{fmt(txn.amount)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
