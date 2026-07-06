import { useState } from "react";
import { ChevronLeft, Delete, Check } from "lucide-react";
import { C, font, S } from "../theme";

interface Props {
  onBack: () => void;
}

const PAD = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

type Step = "current" | "new" | "confirm" | "done";

export function PINScreen({ onBack }: Props) {
  const [step, setStep] = useState<Step>("current");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [shake, setShake] = useState(false);

  const headings: Record<Step, string> = {
    current: "Enter current PIN",
    new:     "Set new PIN",
    confirm: "Confirm new PIN",
    done:    "PIN updated!",
  };

  const handleKey = (k: string) => {
    if (k === "⌫") { setPin(p => p.slice(0, -1)); return; }
    if (!k || pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      if (step === "current") {
        if (next === "1234") { setTimeout(() => { setPin(""); setStep("new"); }, 150); }
        else { setShake(true); setTimeout(() => { setPin(""); setShake(false); }, 500); }
      } else if (step === "new") {
        setTimeout(() => { setNewPin(next); setPin(""); setStep("confirm"); }, 150);
      } else if (step === "confirm") {
        if (next === newPin) { setTimeout(() => setStep("done"), 150); }
        else { setShake(true); setTimeout(() => { setPin(""); setShake(false); }, 500); }
      }
    }
  };

  if (step === "done") {
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Check size={32} strokeWidth={2} color={C.green} />
        </div>
        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 10px", textAlign: "center" }}>PIN updated!</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, textAlign: "center", margin: "0 0 40px" }}>Your new PIN has been set successfully.</p>
        <button onClick={onBack} style={{ ...S.btnPrimary }}>Done</button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px" }}>
      <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginTop: 56, marginBottom: 48, width: "fit-content" }}>
        <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
        <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
      </button>

      <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.8px" }}>{headings[step]}</p>
      {step === "current" && <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 48px" }}>Demo PIN: <span style={{ color: C.text, fontWeight: 600 }}>1234</span></p>}
      {step === "confirm" && <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 48px" }}>Enter your new PIN again</p>}
      {(step === "new") && <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 48px" }}>Choose a 4-digit PIN</p>}

      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 40, transform: shake ? "translateX(8px)" : "none", transition: shake ? "transform 60ms" : "transform 120ms ease-out" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 999, background: pin.length > i ? C.text : C.surface3, border: `1.5px solid ${shake ? C.red : pin.length > i ? C.text : C.borderMd}`, transition: "all 120ms" }} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {PAD.map((k, i) => (
          <button key={i} onClick={() => handleKey(k)} disabled={!k}
            style={{ height: 64, borderRadius: 14, background: k ? C.surface2 : "transparent", border: k ? `1px solid ${C.border}` : "none", color: C.text, fontFamily: font, fontSize: 22, fontWeight: 500, cursor: k ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {k === "⌫" ? <Delete size={20} strokeWidth={1.6} color={C.textSub} /> : k}
          </button>
        ))}
      </div>
    </div>
  );
}
