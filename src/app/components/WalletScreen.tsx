import { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownLeft, QrCode, CheckCircle2, Info } from "lucide-react";
import { T, font } from "../tokens";
import { WALLET } from "../data/mockData";
import { Amount } from "./ui/Amount";
import { TxnRow } from "./ui/TxnRow";
import { Button } from "./ui/Button";
import { ScreenHeader } from "./ui/ScreenHeader";
import { InlineNotice } from "./ui/InlineNotice";
import { formatINR } from "../format";

interface WalletScreenProps {
  onUPIClick: () => void;
}

type Sub = "home" | "topup" | "success";

export function WalletScreen({ onUPIClick }: WalletScreenProps) {
  const [view, setView] = useState<Sub>("home");
  const [amt, setAmt] = useState("");
  const usagePct = (WALLET.usedThisMonth / WALLET.monthlyLimit) * 100;
  const num = parseFloat(amt) || 0;

  if (view === "topup" || view === "success") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Top up wallet" onBack={() => setView("home")} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {view === "success" ? (
            <>
              <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 24, textAlign: "center", marginBottom: 12 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.success50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <CheckCircle2 size={32} color={T.success600} strokeWidth={1.5} />
                </div>
                <p style={{ fontFamily: font, fontSize: 18, lineHeight: "26px", fontWeight: 600, color: T.gray900, margin: 0 }}>Wallet topped up</p>
                <div style={{ margin: "12px 0" }}>
                  <Amount value={num} size="hero" type="credit" showSign weight={700} />
                </div>
                <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
                  New balance {formatINR(WALLET.balance + num)}
                </p>
              </div>
              <Button variant="primary" size="lg" fullWidth onClick={() => setView("home")}>Done</Button>
            </>
          ) : (
            <>
              <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 20, marginBottom: 12 }}>
                <label style={{ fontFamily: font, fontSize: 12, fontWeight: 500, color: T.gray700 }}>Amount</label>
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, borderBottom: `2px solid ${T.blue600}`, paddingBottom: 6 }}>
                  <span className="tabular" style={{ fontFamily: font, fontSize: 28, fontWeight: 500, color: T.gray500 }}>₹</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    autoFocus
                    value={amt}
                    onChange={(e) => setAmt(e.target.value)}
                    placeholder="0.00"
                    className="tabular"
                    style={{ border: "none", outline: "none", fontFamily: font, fontSize: 28, fontWeight: 600, color: T.gray900, flex: 1, background: "transparent", textAlign: "right" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
                  {[500, 1000, 2000, 5000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmt(String(v))}
                      style={{ padding: "6px 12px", borderRadius: 999, background: amt === String(v) ? T.blue50 : T.gray50, border: `1px solid ${amt === String(v) ? T.blue600 : T.gray200}`, color: amt === String(v) ? T.blue600 : T.gray700, fontFamily: font, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                    >
                      ₹{v}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 14, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 11, color: T.gray500, margin: 0, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Fund source</p>
                  <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", color: T.gray900, margin: 0 }}>Everyday Savings</p>
                </div>
                <span className="tabular" style={{ fontFamily: font, fontSize: 12, color: T.gray500 }}>••4821</span>
              </div>
              <Button variant="primary" size="lg" fullWidth disabled={!num} onClick={() => setView("success")}>
                Top up {num ? formatINR(num, { decimals: 0 }) : ""}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100, overflow: "hidden" }}>
      <div style={{ background: T.white, borderBottom: `1px solid ${T.gray200}`, padding: "12px 16px", flexShrink: 0 }}>
        <h1 style={{ fontFamily: font, fontSize: 20, lineHeight: "28px", fontWeight: 600, color: T.gray900, margin: 0 }}>Wallet</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Balance */}
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 20 }}>
          <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Wallet balance</p>
          <div style={{ margin: "4px 0" }}>
            <Amount value={WALLET.balance} size="hero" weight={700} />
          </div>
          <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
            {WALLET.upiId} · {WALLET.tier}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 16 }}>
            {[
              { label: "Top up", Icon: Plus, action: () => setView("topup") },
              { label: "Send", Icon: ArrowUpRight, action: onUPIClick },
              { label: "Receive", Icon: ArrowDownLeft, action: onUPIClick },
              { label: "Scan", Icon: QrCode, action: onUPIClick },
            ].map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                style={{ background: T.gray50, border: `1px solid ${T.gray200}`, borderRadius: T.radiusInput, padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 999, background: T.blue50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <a.Icon size={16} color={T.blue600} strokeWidth={1.5} />
                </div>
                <span style={{ fontFamily: font, fontSize: 11, lineHeight: "14px", color: T.gray900, fontWeight: 500 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly limit */}
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", fontWeight: 600, color: T.gray900, margin: 0 }}>Monthly limit</p>
            <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
              {formatINR(WALLET.usedThisMonth, { decimals: 0 })} / {formatINR(WALLET.monthlyLimit, { decimals: 0 })}
            </p>
          </div>
          <div style={{ height: 6, background: T.gray100, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${usagePct}%`, background: T.blue600, borderRadius: 3 }} />
          </div>
        </div>

        {WALLET.tier === "Full KYC" ? null : (
          <InlineNotice tone="warning" title="Upgrade to Full KYC">
            Unlock higher balance and monthly limits by completing full KYC.
          </InlineNotice>
        )}

        {/* History */}
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "4px 0 0", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Recent activity
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden" }}>
          {WALLET.transactions.map((txn, i) => (
            <TxnRow
              key={txn.id}
              title={txn.description}
              meta={`${txn.date} · Wallet`}
              amount={txn.amount}
              type={txn.type}
              channel="wallet"
              status={txn.status}
              isLast={i === WALLET.transactions.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
