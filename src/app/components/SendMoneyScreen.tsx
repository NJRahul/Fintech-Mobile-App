import { useState } from "react";
import { ChevronLeft, Search, ChevronRight, AlertTriangle } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

type Step = "select-payee" | "enter-amount" | "review";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export function SendMoneyScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<Step>("select-payee");
  const [search, setSearch] = useState("");
  const [selectedPayeeId, setSelectedPayeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const primaryAcc = state.accounts[0];
  const payees = state.payees.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.upiId && p.upiId.toLowerCase().includes(search.toLowerCase()))
  );
  const selectedPayee = state.payees.find(p => p.id === selectedPayeeId);
  const amountNum = parseFloat(amount) || 0;
  const isInsufficient = amountNum > primaryAcc.availableBalance;

  const handlePay = () => {
    if (!selectedPayee || amountNum <= 0 || isInsufficient) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: "SEND_MONEY",
        accountId: primaryAcc.id,
        amount: amountNum,
        description: note || selectedPayee.name,
        counterparty: selectedPayee.name,
        channel: selectedPayee.upiId ? "UPI" : "NEFT",
      });
      setLoading(false);
      onNav("txn-status", { txnStatusType: "success" });
    }, 1200);
  };

  if (step === "enter-amount" && selectedPayee) {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 20px 32px" }}>
        <button onClick={() => setStep("select-payee")} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginTop: 56, marginBottom: 32, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: C.surface3, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text }}>{getInitials(selectedPayee.name)}</span>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{selectedPayee.name}</p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>{selectedPayee.upiId || `${selectedPayee.bank} · ${selectedPayee.accountMasked}`}</p>
          </div>
          {selectedPayee.cooling === "cooling" && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
              <AlertTriangle size={14} strokeWidth={1.6} color={C.amber} />
              <span style={{ fontFamily: font, fontSize: 11, color: C.amber }}>New payee</span>
            </div>
          )}
        </div>

        <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 10px", textAlign: "center" }}>Enter amount</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: font, fontSize: 32, fontWeight: 300, color: C.textSub }}>₹</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            autoFocus
            style={{ fontFamily: font, fontSize: 48, fontWeight: 800, color: isInsufficient ? C.red : C.text, background: "transparent", border: "none", outline: "none", width: "180px", textAlign: "center", letterSpacing: "-2px" }}
          />
        </div>
        {isInsufficient && <p style={{ fontFamily: font, fontSize: 13, color: C.red, textAlign: "center", margin: "0 0 8px" }}>Insufficient balance</p>}
        <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, textAlign: "center", margin: "0 0 28px" }}>Available: {fmt(primaryAcc.availableBalance)}</p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
          {[500, 1000, 2000, 5000].map(a => (
            <button key={a} onClick={() => setAmount(String(a))}
              style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "8px 14px", fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, cursor: "pointer" }}>
              +{fmt(a)}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          style={{ ...S.input, marginBottom: 20, fontSize: 14 }}
        />

        <div style={{ marginTop: "auto" }}>
          <button onClick={() => setStep("review")} disabled={amountNum <= 0 || isInsufficient}
            style={{ ...S.btnPrimary, opacity: amountNum <= 0 || isInsufficient ? 0.4 : 1 }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "review" && selectedPayee) {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 20px 32px" }}>
        <button onClick={() => setStep("enter-amount")} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginTop: 56, marginBottom: 32, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Review payment</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 28px" }}>Please confirm the transfer details</p>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
          {[
            { label: "To", value: selectedPayee.name },
            { label: "Via", value: selectedPayee.upiId || `${selectedPayee.bank} · ${selectedPayee.accountMasked}` },
            { label: "Amount", value: fmt(amountNum) },
            { label: "From", value: `${primaryAcc.nickname} · ${primaryAcc.numberMasked}` },
            ...(note ? [{ label: "Note", value: note }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, borderBottom: `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0, maxWidth: "60%", textAlign: "right" }}>{value}</p>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14 }}>
            <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Total debit</p>
            <p style={{ fontFamily: font, fontSize: 15, fontWeight: 800, color: C.text, margin: 0 }}>{fmt(amountNum)}</p>
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button onClick={handlePay} disabled={loading}
            style={{ ...S.btnPrimary, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Processing…" : `Pay ${fmt(amountNum)}`}
          </button>
        </div>
      </div>
    );
  }

  // Step 1: select payee
  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "56px 20px 16px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Send Money</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>Choose a payee or enter UPI ID</p>

        <div style={{ position: "relative", marginBottom: 20 }}>
          <Search size={16} strokeWidth={1.6} color={C.textMute} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or UPI ID"
            style={{ ...S.input, paddingLeft: 40 }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 32px" }}>
        {/* Recent contacts */}
        {!search && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textMute, margin: "0 0 12px" }}>Recent</p>
            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
              {state.payees.slice(0, 5).map(p => (
                <button key={p.id} onClick={() => { setSelectedPayeeId(p.id); setStep("enter-amount"); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 24, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text }}>{getInitials(p.name)}</span>
                  </div>
                  <p style={{ fontFamily: font, fontSize: 11, color: C.textSub, margin: 0, maxWidth: 52, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>{p.name.split(" ")[0]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {!search && <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textMute, margin: "0 0 4px" }}>All payees</p>}

        {payees.length === 0 && (
          <p style={{ fontFamily: font, fontSize: 14, color: C.textMute, textAlign: "center", marginTop: 40 }}>No payees found</p>
        )}
        {payees.map(payee => (
          <button key={payee.id} onClick={() => { setSelectedPayeeId(payee.id); setStep("enter-amount"); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border2}`, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text }}>{getInitials(payee.name)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{payee.name}</p>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>{payee.upiId || payee.bank}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {payee.cooling === "cooling" && <AlertTriangle size={14} strokeWidth={1.6} color={C.amber} />}
              <ChevronRight size={16} color={C.textDim} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
