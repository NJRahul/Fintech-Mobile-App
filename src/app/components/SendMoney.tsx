import { useMemo, useState } from "react";
import { Search, ChevronRight, CheckCircle2, ArrowRight, Clock, Plus } from "lucide-react";
import { T, font } from "../tokens";
import { PAYEES, ACCOUNTS } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Amount } from "./ui/Amount";
import { Button } from "./ui/Button";
import { FormList } from "./ui/FormList";
import { InlineNotice } from "./ui/InlineNotice";
import { formatINR } from "../format";

interface SendMoneyProps {
  onBack: () => void;
  onDone: () => void;
}

type Step = "select" | "amount" | "review" | "processing" | "success";
type Rail = "internal" | "UPI" | "IMPS" | "NEFT" | "RTGS";

const RAILS: { id: Rail; label: string; sub: string; fee: string }[] = [
  { id: "internal", label: "Meridian → Meridian", sub: "Instant · Free", fee: "Free" },
  { id: "UPI", label: "UPI", sub: "Instant · 24×7", fee: "Free" },
  { id: "IMPS", label: "IMPS", sub: "Instant · 24×7", fee: "₹5" },
  { id: "NEFT", label: "NEFT", sub: "2–4 hours", fee: "Free" },
  { id: "RTGS", label: "RTGS", sub: "Instant · Business hours only", fee: "₹25" },
];

export function SendMoney({ onBack, onDone }: SendMoneyProps) {
  const [step, setStep] = useState<Step>("select");
  const [payee, setPayee] = useState<typeof PAYEES[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [rail, setRail] = useState<Rail>("internal");
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");

  const account = ACCOUNTS[0];
  const num = parseFloat(amount) || 0;
  const filtered = useMemo(() => PAYEES.filter((p) =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.bank.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const suggestRail = (p: typeof PAYEES[0]): Rail =>
    p.bank === "Meridian Bank" ? "internal" : p.upiId ? "UPI" : "IMPS";

  const startAmount = (p: typeof PAYEES[0]) => {
    setPayee(p);
    setRail(suggestRail(p));
    setStep("amount");
  };

  const submit = () => {
    setStep("processing");
    setTimeout(() => setStep("success"), 1600);
  };

  if (step === "success" && payee) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Transfer sent" onBack={onDone} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 24, textAlign: "center", marginBottom: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.success50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <CheckCircle2 size={36} color={T.success600} strokeWidth={1.5} />
            </div>
            <p style={{ fontFamily: font, fontSize: 20, lineHeight: "28px", fontWeight: 600, color: T.gray900, margin: 0 }}>Transfer sent</p>
            <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: "4px 0 12px" }}>to {payee.name}</p>
            <Amount value={num} size="hero" type="credit" showSign weight={700} />
          </div>

          <div style={{ background: T.gray50, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, padding: "8px 16px", marginBottom: 12 }}>
            <FormList
              rows={[
                { label: "To", value: `${payee.name} · ${payee.accountMasked}` },
                { label: "Via", value: rail },
                { label: "Reference", value: <span className="tabular">MRD/{Math.floor(100000 + Math.random() * 900000)}/OUT</span> },
                { label: "Date", value: <span className="tabular">05 Jul 2024, 14:38</span> },
              ]}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Button variant="primary" size="lg" fullWidth onClick={onDone}>Done</Button>
            <Button variant="secondary" size="md" fullWidth onClick={() => { setStep("select"); setAmount(""); setPayee(null); setNote(""); }}>Send another</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: T.gray100 }}>
        <div style={{ width: 48, height: 48, border: `3px solid ${T.gray200}`, borderTopColor: T.blue600, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <p style={{ fontFamily: font, fontSize: 16, lineHeight: "24px", fontWeight: 600, color: T.gray900, margin: 0 }}>Processing transfer…</p>
        <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: 0 }}>Verifying with {rail}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (step === "review" && payee) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Review transfer" onBack={() => setStep("amount")} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 20, marginBottom: 12, textAlign: "center" }}>
            <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>You're transferring</p>
            <div style={{ margin: "6px 0 4px" }}>
              <Amount value={num} size="hero" weight={700} />
            </div>
            <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: 0 }}>
              from {account.nickname} <span className="tabular">({account.accountNumberMasked})</span>
            </p>
            <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: 0 }}>
              to <span style={{ color: T.gray900, fontWeight: 500 }}>{payee.name}</span> · <span className="tabular">{payee.accountMasked}</span>
            </p>
          </div>

          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px", marginBottom: 12 }}>
            <FormList
              rows={[
                { label: "Beneficiary bank", value: payee.bank },
                { label: "IFSC", value: <span className="tabular">{payee.ifsc}</span> },
                { label: "Payment rail", value: rail },
                { label: "Fee", value: RAILS.find((r) => r.id === rail)?.fee ?? "Free" },
                ...(note ? [{ label: "Remarks", value: note }] : []),
              ]}
            />
          </div>

          {num > 50000 && (
            <div style={{ marginBottom: 12 }}>
              <InlineNotice tone="warning">Transfers over ₹50,000 require biometric or PIN confirmation.</InlineNotice>
            </div>
          )}

          <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight size={18} strokeWidth={1.5} />} onClick={submit}>
            Confirm — {formatINR(num)}
          </Button>
        </div>
      </div>
    );
  }

  if (step === "amount" && payee) {
    const insufficient = num > account.availableBalance;
    const cooling = payee.cooling === "cooling";
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Enter amount" onBack={() => setStep("select")} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {/* Payee summary */}
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: T.blue50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: T.blue600 }}>
                {payee.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: T.gray900, margin: 0 }}>{payee.name}</p>
              <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
                {payee.bank} · {payee.accountMasked}
              </p>
            </div>
          </div>

          {cooling && (
            <div style={{ marginBottom: 12 }}>
              <InlineNotice tone="warning" title="30-minute cooling period">
                This payee was added recently — transfers are enabled after <span className="tabular">28 min</span>. This is a safety measure against fraud.
              </InlineNotice>
            </div>
          )}

          {/* Amount input */}
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 20, marginBottom: 12 }}>
            <label style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", fontWeight: 500, color: T.gray700 }}>Amount (₹)</label>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, borderBottom: `2px solid ${insufficient ? T.danger600 : T.blue600}`, paddingBottom: 6 }}>
              <span className="tabular" style={{ fontFamily: font, fontSize: 28, fontWeight: 500, color: T.gray500 }}>₹</span>
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="tabular"
                style={{ border: "none", outline: "none", fontFamily: font, fontSize: 28, fontWeight: 600, color: T.gray900, flex: 1, background: "transparent", textAlign: "right" }}
              />
            </div>
            <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: insufficient ? T.danger600 : T.gray500, margin: "6px 0 0" }}>
              {insufficient ? `Insufficient balance — shortfall ${formatINR(num - account.availableBalance)}` : <>Available: <span className="tabular" style={{ color: T.gray700, fontWeight: 500 }}>{formatINR(account.availableBalance)}</span></>}
            </p>
          </div>

          {/* Rail selection */}
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ padding: "10px 16px", background: T.gray50, borderBottom: `1px solid ${T.gray200}` }}>
              <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Payment rail</p>
            </div>
            {RAILS.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setRail(r.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "12px 16px",
                  background: rail === r.id ? T.blue50 : T.white,
                  border: "none", borderBottom: i < RAILS.length - 1 ? `1px solid ${T.gray200}` : "none",
                  cursor: "pointer", textAlign: "left", transition: "background 120ms ease-out",
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${rail === r.id ? T.blue600 : T.gray300}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {rail === r.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue600 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", color: T.gray900, margin: 0, fontWeight: 500 }}>{r.label}</p>
                  <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>{r.sub}</p>
                </div>
                <span className="tabular" style={{ fontFamily: font, fontSize: 12, color: T.gray700 }}>{r.fee}</span>
              </button>
            ))}
          </div>

          {/* Note */}
          <div style={{ background: T.white, border: `1px solid ${T.gray300}`, borderRadius: T.radiusInput, padding: "0 12px", height: 44, display: "flex", alignItems: "center", marginBottom: 16 }}>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add remarks (optional)"
              style={{ border: "none", outline: "none", background: "transparent", fontFamily: font, fontSize: 14, color: T.gray900, flex: 1 }}
            />
          </div>

          <Button variant="primary" size="lg" fullWidth disabled={!num || insufficient || cooling} onClick={() => setStep("review")}>
            Review transfer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
      <ScreenHeader title="Send money" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.white, border: `1px solid ${T.gray300}`, borderRadius: T.radiusInput, padding: "0 12px", height: 44, marginBottom: 16 }}>
          <Search size={16} color={T.gray500} strokeWidth={1.5} />
          <input
            placeholder="Search payee, UPI ID, or account number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", fontFamily: font, fontSize: 14, color: T.gray900, flex: 1 }}
          />
        </div>

        {/* Add new payee */}
        <button
          style={{
            width: "100%", background: T.white, border: `1px dashed ${T.gray300}`, borderRadius: T.radiusCard,
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 16,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 999, background: T.blue50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={18} color={T.blue600} strokeWidth={1.5} />
          </div>
          <span style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 600, color: T.gray900 }}>Add new payee</span>
          <ChevronRight size={16} color={T.gray500} strokeWidth={1.5} style={{ marginLeft: "auto" }} />
        </button>

        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 10px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Saved payees
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden" }}>
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => startAmount(p)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "12px 16px",
                background: "none", border: "none",
                borderBottom: i < filtered.length - 1 ? `1px solid ${T.gray200}` : "none",
                cursor: "pointer", textAlign: "left", transition: "background 120ms ease-out",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.gray50)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: 40, height: 40, borderRadius: 999, background: T.blue50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: T.blue600 }}>
                  {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 500, color: T.gray900, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
                <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
                  {p.bank} · {p.accountMasked}
                </p>
              </div>
              {p.cooling === "cooling" && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: T.warning600, fontFamily: font, fontSize: 11, fontWeight: 600 }}>
                  <Clock size={12} strokeWidth={1.5} /> Cooling
                </span>
              )}
              <ChevronRight size={16} color={T.gray500} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
