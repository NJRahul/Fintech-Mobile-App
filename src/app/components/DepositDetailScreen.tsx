import { ChevronLeft } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";

interface Props {
  depositId: string;
  onBack: () => void;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function DepositDetailScreen({ depositId, onBack }: Props) {
  const state = useAppState();
  const dep = state.deposits.find(d => d.id === depositId) ?? state.deposits[0];
  const acc = state.accounts.find(a => a.id === dep.linkedAccountId) ?? state.accounts[0];
  const interest = dep.maturityAmount - dep.principal;

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: "-0.5px" }}>{dep.type} · {dep.id}</p>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{dep.tenureMonths} months · {dep.interestRate}% p.a.</p>
          </div>
          <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.green, background: "rgba(0,200,150,0.1)", padding: "4px 12px", borderRadius: 20 }}>{dep.status}</span>
        </div>

        {/* Amounts */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Principal</p>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>{fmt(dep.principal)}</p>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Maturity amount</p>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.green, margin: 0 }}>{fmt(dep.maturityAmount)}</p>
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Interest earned</p>
            <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.green, margin: 0 }}>+{fmt(interest)}</p>
          </div>
          {dep.monthlyAmount && (
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Monthly amount</p>
              <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{fmt(dep.monthlyAmount)}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          {[
            { label: "Start date",    value: dep.startDate },
            { label: "Maturity date", value: dep.maturityDate },
            { label: "Linked account",value: `${acc.nickname} · ${acc.numberMasked}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border2}` }}>
              <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>{label}</p>
              <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, textAlign: "center", lineHeight: 1.6 }}>
          Premature withdrawal subject to penalty. Interest rates are subject to revision.
        </p>
      </div>
    </div>
  );
}
