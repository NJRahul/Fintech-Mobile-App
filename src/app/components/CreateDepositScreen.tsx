import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";

interface Props {
  onBack: () => void;
  onDone: () => void;
}

const TENURES = [3, 6, 12, 18, 24, 36];

function getRate(months: number, type: "FD" | "RD") {
  if (type === "RD") return 6.8;
  if (months <= 3) return 6.0;
  if (months <= 6) return 6.5;
  if (months <= 12) return 7.25;
  if (months <= 18) return 7.4;
  if (months <= 24) return 7.0;
  return 6.8;
}

export function CreateDepositScreen({ onBack, onDone }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const primaryAcc = state.accounts[0];

  const [type, setType] = useState<"FD" | "RD">("FD");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState(12);
  const [loading, setLoading] = useState(false);

  const principal = parseFloat(amount) || 0;
  const rate = getRate(tenure, type);
  const maturityAmount = type === "FD"
    ? Math.round(principal * Math.pow(1 + rate / 400, tenure / 3))
    : Math.round(principal * tenure * (1 + rate / 1200));
  const interest = maturityAmount - (type === "FD" ? principal : principal * tenure);

  const today = new Date();
  const maturityDate = new Date(today);
  maturityDate.setMonth(maturityDate.getMonth() + tenure);

  const handleCreate = () => {
    if (principal <= 0) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: "CREATE_DEPOSIT",
        deposit: {
          type,
          principal: type === "FD" ? principal : 0,
          interestRate: rate,
          tenureMonths: tenure,
          startDate: today.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          maturityDate: maturityDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          maturityAmount,
          status: "Active",
          monthlyAmount: type === "RD" ? principal : undefined,
          linkedAccountId: primaryAcc.id,
        },
      });
      setLoading(false);
      onDone();
    }, 800);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 28px", letterSpacing: "-0.5px" }}>Open a deposit</p>

        {/* Type toggle */}
        <div style={{ display: "flex", background: C.surface2, borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {(["FD", "RD"] as const).map(t => (
            <button key={t} onClick={() => setType(t)}
              style={{ flex: 1, padding: "10px", borderRadius: 8, background: type === t ? C.surface3 : "transparent", border: "none", fontFamily: font, fontSize: 14, fontWeight: 700, color: type === t ? C.text : C.textSub, cursor: "pointer", transition: "all 150ms" }}>
              {t === "FD" ? "Fixed Deposit" : "Recurring Deposit"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 8 }}>
            {type === "FD" ? "Deposit amount" : "Monthly instalment"}
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 18, color: C.textSub }}>₹</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ ...S.input, paddingLeft: 36, fontSize: 20, fontWeight: 700 }} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 12 }}>Tenure</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TENURES.map(t => (
              <button key={t} onClick={() => setTenure(t)}
                style={{ background: tenure === t ? C.text : C.surface2, color: tenure === t ? C.bg : C.textSub, border: `1px solid ${tenure === t ? C.text : C.border}`, borderRadius: 20, padding: "8px 16px", fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 150ms" }}>
                {t} mo
              </button>
            ))}
          </div>
        </div>

        {/* Calculation */}
        {principal > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 24 }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Returns at maturity</p>
            {[
              { label: "Interest rate", value: `${rate}% p.a.` },
              { label: "Maturity amount", value: "₹" + maturityAmount.toLocaleString("en-IN") },
              { label: "Interest earned", value: "₹" + Math.abs(interest).toLocaleString("en-IN") },
              { label: "Maturity date", value: maturityDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border2}` }}>
                <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
                <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: label === "Interest earned" ? C.green : C.text, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleCreate} disabled={principal <= 0 || loading}
          style={{ ...S.btnPrimary, opacity: principal <= 0 || loading ? 0.4 : 1 }}>
          {loading ? "Opening…" : `Open ${type}`}
        </button>
      </div>
    </div>
  );
}
