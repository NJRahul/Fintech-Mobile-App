import { useState } from "react";
import { ChevronRight, CheckCircle2, ArrowRight, Timer } from "lucide-react";
import { T, font } from "../tokens";
import { CORRIDORS } from "../data/mockData";
import { ScreenHeader } from "./ui/ScreenHeader";
import { Amount } from "./ui/Amount";
import { Button } from "./ui/Button";
import { FormList } from "./ui/FormList";
import { InlineNotice } from "./ui/InlineNotice";
import { formatINR } from "../format";

interface CrossBorderScreenProps {
  onBack: () => void;
  onDone: () => void;
}

type Step = "corridor" | "compliance" | "fx-review" | "success";

const PURPOSES = [
  "Family maintenance",
  "Education fees",
  "Freelance / consulting income",
  "Business payment (goods/services)",
  "Investment",
  "Gift",
];

export function CrossBorderScreen({ onBack, onDone }: CrossBorderScreenProps) {
  const [step, setStep] = useState<Step>("corridor");
  const [corridor, setCorridor] = useState(CORRIDORS[0]);
  const [amount, setAmount] = useState("500");
  const [purpose, setPurpose] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState("John Smith");
  const [rateSeconds, setRateSeconds] = useState(90);

  const amountFx = parseFloat(amount) || 0;
  const amountInr = amountFx * corridor.fx;

  if (step === "success") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Payment initiated" onBack={onDone} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: 24, textAlign: "center", marginBottom: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.success50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <CheckCircle2 size={36} color={T.success600} strokeWidth={1.5} />
            </div>
            <p style={{ fontFamily: font, fontSize: 20, lineHeight: "28px", fontWeight: 600, color: T.gray900, margin: 0 }}>Payment initiated</p>
            <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: "4px 0 12px" }}>
              via <span style={{ fontWeight: 500 }}>{corridor.rail}</span> to {corridor.country}
            </p>
            <p className="tabular" style={{ fontFamily: font, fontSize: 20, lineHeight: "28px", fontWeight: 600, color: T.gray900, margin: 0 }}>
              {corridor.currency} {amountFx.toFixed(2)}
            </p>
            <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "2px 0 0" }}>
              ≈ {formatINR(amountInr)}
            </p>
          </div>

          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px", marginBottom: 12 }}>
            <FormList
              rows={[
                { label: "Reference", value: <span className="tabular">SWIFT/MT103/{Math.floor(100000000 + Math.random() * 900000000)}</span> },
                { label: "Beneficiary", value: beneficiary },
                { label: "Corridor", value: `${corridor.currency} · ${corridor.rail}` },
                { label: "Status", value: "Screening" },
                { label: "Expected delivery", value: "2–3 business days" },
              ]}
            />
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={onDone}>Done</Button>
        </div>
      </div>
    );
  }

  if (step === "fx-review") {
    const fee = corridor.feeFlat;
    const total = amountInr + fee;
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Review FX & fees" onBack={() => setStep("compliance")} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ background: T.warning50, border: `1px solid ${T.warning600}`, borderRadius: T.radiusInput, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Timer size={16} color={T.warning600} strokeWidth={1.5} />
            <p className="tabular" style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.warning600, margin: 0, fontWeight: 500 }}>
              Rate locked for {Math.floor(rateSeconds / 60)}:{String(rateSeconds % 60).padStart(2, "0")}
            </p>
          </div>

          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, padding: "8px 16px", marginBottom: 12 }}>
            <FormList
              rows={[
                { label: "You send", value: <span className="tabular">{corridor.currency} {amountFx.toFixed(2)}</span> },
                { label: "FX rate", value: <span className="tabular">1 {corridor.currency} = ₹{corridor.fx.toFixed(2)}</span> },
                { label: "Amount in INR", value: <Amount value={amountInr} size="md" /> },
                { label: "Transfer fee", value: <Amount value={fee} size="md" /> },
                { label: "Total debit", value: <Amount value={total} size="lg" weight={700} /> },
                { label: "Rail", value: corridor.rail },
                { label: "Beneficiary", value: beneficiary },
                { label: "Purpose", value: purpose ?? "—" },
              ]}
            />
          </div>

          <InlineNotice tone="info">
            {corridor.rail} transfers are screened for compliance and typically deliver in 2–3 business days.
          </InlineNotice>

          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight size={18} strokeWidth={1.5} />} onClick={() => setStep("success")}>
              Confirm — pay {formatINR(total, { decimals: 2 })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "compliance") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
        <ScreenHeader title="Purpose of payment" onBack={() => setStep("corridor")} />
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <p style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, margin: "0 0 12px" }}>
            Regulator requires you to declare the purpose of every cross-border payment.
          </p>
          <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden", marginBottom: 12 }}>
            {PURPOSES.map((p, i) => (
              <button
                key={p}
                onClick={() => setPurpose(p)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%",
                  padding: "14px 16px", background: purpose === p ? T.blue50 : T.white,
                  border: "none", borderBottom: i < PURPOSES.length - 1 ? `1px solid ${T.gray200}` : "none",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${purpose === p ? T.blue600 : T.gray300}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {purpose === p && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue600 }} />}
                </div>
                <span style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", color: T.gray900, fontWeight: purpose === p ? 600 : 500 }}>{p}</span>
              </button>
            ))}
          </div>

          <Button variant="primary" size="lg" fullWidth disabled={!purpose} onClick={() => { setStep("fx-review"); setRateSeconds(90); }}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.gray100 }}>
      <ScreenHeader title="Send abroad" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 10px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Destination
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusCard, boxShadow: T.shadowL1, overflow: "hidden", marginBottom: 16 }}>
          {CORRIDORS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setCorridor(c)}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "12px 16px", background: corridor.id === c.id ? T.blue50 : T.white,
                border: "none", borderBottom: i < CORRIDORS.length - 1 ? `1px solid ${T.gray200}` : "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 24 }}>{c.flag}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", fontWeight: 500, color: T.gray900, margin: 0 }}>{c.country}</p>
                <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
                  {c.currency} · {c.rail} · rate ₹{c.fx.toFixed(2)}
                </p>
              </div>
              <ChevronRight size={16} color={T.gray500} strokeWidth={1.5} />
            </button>
          ))}
        </div>

        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 10px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Beneficiary
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray300}`, borderRadius: T.radiusInput, padding: "0 12px", height: 44, display: "flex", alignItems: "center", marginBottom: 16 }}>
          <input
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            placeholder="Beneficiary name"
            style={{ border: "none", outline: "none", background: "transparent", fontFamily: font, fontSize: 14, color: T.gray900, flex: 1 }}
          />
        </div>

        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 10px", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          Amount ({corridor.currency})
        </p>
        <div style={{ background: T.white, border: `1px solid ${T.gray300}`, borderRadius: T.radiusInput, padding: "0 12px", height: 52, display: "flex", alignItems: "center", marginBottom: 8 }}>
          <span className="tabular" style={{ fontFamily: font, fontSize: 16, color: T.gray500, marginRight: 6 }}>{corridor.currency}</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="tabular"
            style={{ border: "none", outline: "none", background: "transparent", fontFamily: font, fontSize: 20, fontWeight: 600, color: T.gray900, flex: 1, textAlign: "right" }}
          />
        </div>
        <p className="tabular" style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: "0 0 16px" }}>
          ≈ {formatINR(amountInr)} at ₹{corridor.fx.toFixed(2)} / {corridor.currency}
        </p>

        <Button variant="primary" size="lg" fullWidth disabled={!amountFx || !beneficiary} onClick={() => setStep("compliance")}>
          Continue
        </Button>
      </div>
    </div>
  );
}
