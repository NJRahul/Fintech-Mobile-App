import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { C, font, S } from "../theme";

interface Props {
  onBack: () => void;
  onDone: () => void;
}

const LOAN_TYPES = [
  { id: "personal", label: "Personal Loan", sub: "Up to ₹8L · from 10.99%", rate: "10.99%" },
  { id: "home",     label: "Home Loan",     sub: "Up to ₹2Cr · from 8.50%", rate: "8.50%" },
  { id: "car",      label: "Car Loan",      sub: "Up to ₹30L · from 9.25%", rate: "9.25%" },
  { id: "edu",      label: "Education Loan",sub: "Up to ₹20L · from 9.50%", rate: "9.50%" },
] as const;

export function LoanApplyScreen({ onBack, onDone }: Props) {
  const [loanType, setLoanType] = useState<typeof LOAN_TYPES[number]["id"]>("personal");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState(24);
  const [step, setStep] = useState<"form" | "submitted">("form");
  const [loading, setLoading] = useState(false);

  const selectedType = LOAN_TYPES.find(l => l.id === loanType)!;
  const principal = parseFloat(amount) || 0;
  const rate = parseFloat(selectedType.rate) / 100 / 12;
  const emi = principal > 0 ? Math.round((principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1)) : 0;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("submitted"); }, 1500);
  };

  if (step === "submitted") {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Check size={32} strokeWidth={2} color={C.green} />
        </div>
        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 10px", textAlign: "center" }}>Application submitted!</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, textAlign: "center", lineHeight: 1.6, margin: "0 0 40px" }}>We'll process your application and update you within 2 working days.</p>
        <button onClick={onDone} style={{ ...S.btnPrimary }}>View loans</button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Apply for a loan</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>Instant approval · 100% digital</p>

        {/* Loan type */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {LOAN_TYPES.map(lt => (
            <button key={lt.id} onClick={() => setLoanType(lt.id)}
              style={{ background: loanType === lt.id ? C.surface2 : C.surface, border: `1px solid ${loanType === lt.id ? C.borderMd : C.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", transition: "all 150ms" }}>
              <div>
                <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{lt.label}</p>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{lt.sub}</p>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${loanType === lt.id ? C.text : C.border}`, background: loanType === lt.id ? C.text : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {loanType === lt.id && <Check size={12} strokeWidth={3} color={C.bg} />}
              </div>
            </button>
          ))}
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 8 }}>Loan amount</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 18, color: C.textSub }}>₹</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" style={{ ...S.input, paddingLeft: 36, fontSize: 20, fontWeight: 700 }} />
          </div>
        </div>

        {/* Tenure */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 12 }}>Tenure</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[12, 24, 36, 48, 60].map(t => (
              <button key={t} onClick={() => setTenure(t)}
                style={{ background: tenure === t ? C.text : C.surface2, color: tenure === t ? C.bg : C.textSub, border: `1px solid ${tenure === t ? C.text : C.border}`, borderRadius: 20, padding: "8px 16px", fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 150ms" }}>
                {t} mo
              </button>
            ))}
          </div>
        </div>

        {/* EMI preview */}
        {emi > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 4px" }}>Estimated EMI</p>
                <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>₹{emi.toLocaleString("en-IN")}/mo</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 4px" }}>Interest rate</p>
                <p style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{selectedType.rate} p.a.</p>
              </div>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={principal <= 0 || loading}
          style={{ ...S.btnPrimary, opacity: principal <= 0 || loading ? 0.4 : 1 }}>
          {loading ? "Submitting…" : "Apply now"}
        </button>
        <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          Subject to credit check and KYC verification
        </p>
      </div>
    </div>
  );
}
