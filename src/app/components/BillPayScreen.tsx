import { useState } from "react";
import { ChevronLeft, Zap, Wifi, Tv, Smartphone, Droplets, Building2 } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

const BILLERS = [
  { id: "electricity", label: "Electricity", Icon: Zap,       color: "#F5A623" },
  { id: "broadband",   label: "Broadband",   Icon: Wifi,       color: "#4A9EFF" },
  { id: "dth",         label: "DTH",         Icon: Tv,         color: "#A78BFA" },
  { id: "mobile",      label: "Mobile",      Icon: Smartphone, color: "#00C896" },
  { id: "water",       label: "Water",       Icon: Droplets,   color: "#38BDF8" },
  { id: "insurance",   label: "Insurance",   Icon: Building2,  color: "#F87171" },
] as const;

const SAMPLE_BILLS: Record<string, { biller: string; amount: number; due: string }> = {
  electricity: { biller: "BEST Undertaking", amount: 3840, due: "20 Jul 2024" },
  broadband:   { biller: "Airtel Xstream",   amount: 999,  due: "25 Jul 2024" },
  dth:         { biller: "Tata Play",         amount: 399,  due: "18 Jul 2024" },
  mobile:      { biller: "Jio Postpaid",      amount: 449,  due: "22 Jul 2024" },
  water:       { biller: "MCGM Water",        amount: 680,  due: "15 Jul 2024" },
  insurance:   { biller: "LIC Premium",       amount: 12450, due: "10 Aug 2024" },
};

export function BillPayScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const primaryAcc = state.accounts[0];

  const bill = selected ? SAMPLE_BILLS[selected] : null;

  const handlePay = () => {
    if (!bill || !selected) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "PAY_BILL", accountId: primaryAcc.id, amount: bill.amount, description: bill.biller, biller: bill.biller });
      setLoading(false);
      onNav("txn-status", { txnStatusType: "success" });
    }, 1200);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 24px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Bill Payments</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 28px" }}>Pay all your bills in one place</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
          {BILLERS.map(({ id, label, Icon, color }) => (
            <button key={id} onClick={() => setSelected(id === selected ? null : id)}
              style={{ background: selected === id ? `${color}15` : C.surface, border: `1px solid ${selected === id ? color + "40" : C.border}`, borderRadius: 14, padding: "16px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all 150ms" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} strokeWidth={1.6} color={color} />
              </div>
              <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: selected === id ? C.text : C.textSub }}>{label}</span>
            </button>
          ))}
        </div>

        {bill && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
            <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>Bill Details</p>
            {[
              { label: "Biller", value: bill.biller },
              { label: "Amount Due", value: "₹" + bill.amount.toLocaleString("en-IN") },
              { label: "Due Date", value: bill.due },
              { label: "Pay from", value: `${primaryAcc.nickname} · ${primaryAcc.numberMasked}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: `1px solid ${C.border2}` }}>
                <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
                <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{value}</p>
              </div>
            ))}

            <button onClick={handlePay} disabled={loading}
              style={{ ...S.btnPrimary, marginTop: 20, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Processing…" : `Pay ₹${bill.amount.toLocaleString("en-IN")}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
