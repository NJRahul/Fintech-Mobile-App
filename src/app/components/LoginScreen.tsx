import { useState, useRef } from "react";
import { ChevronLeft, Delete, Fingerprint } from "lucide-react";
import { C, font, S } from "../theme";

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const PAD = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

type Step = "landing" | "signin-phone" | "signin-pin" | "signup-phone";

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [step, setStep] = useState<Step>("landing");
  const [phone, setPhone] = useState("");
  const [pin, setPin]   = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  const reset = () => { setPhone(""); setPin(""); setLoading(false); };

  // ── Shared phone input block ─────────────────
  function PhoneEntry({ heading, sub, onContinue }: { heading: string; sub: string; onContinue: () => void }) {
    return (
      <>
        <button
          onClick={() => { reset(); setStep("landing"); }}
          style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4, marginTop: 56, marginBottom: 48, width: "fit-content" }}
        >
          <ChevronLeft size={18} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 30, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.7px", lineHeight: 1.15 }}>
          {heading}
        </p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 36px", lineHeight: 1.6 }}>
          {sub}
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{ height: 52, minWidth: 72, borderRadius: 12, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, gap: 6 }}>
            🇮🇳 +91
          </div>
          <input
            ref={phoneRef}
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            onKeyDown={e => { if (e.key === "Enter" && phone.length === 10) onContinue(); }}
            placeholder="Mobile number"
            inputMode="numeric"
            autoFocus
            style={{ ...S.input, height: 52, padding: "0 16px", flex: 1, fontSize: 18, fontWeight: 600, letterSpacing: "0.04em" }}
          />
        </div>

        <button
          onClick={onContinue}
          disabled={phone.length < 10 || loading}
          style={{ ...S.btnPrimary, opacity: phone.length < 10 || loading ? 0.4 : 1, transition: "opacity 150ms" }}
        >
          {loading ? "Sending OTP…" : "Send OTP"}
        </button>
      </>
    );
  }

  // ── Sign-in: phone ───────────────────────────
  if (step === "signin-phone") {
    const handleContinue = () => {
      if (phone.length < 10) return;
      setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(); }, 600);
    };
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px" }}>
        <PhoneEntry
          heading="Welcome back."
          sub="Enter your registered mobile number to receive a one-time password."
          onContinue={handleContinue}
        />
        <button
          onClick={() => { reset(); setStep("signin-pin"); }}
          style={{ ...S.btnText, textAlign: "center", color: C.textMute, fontSize: 13, marginTop: 20 }}
        >
          Use PIN instead
        </button>
      </div>
    );
  }

  // ── Sign-in: PIN ─────────────────────────────
  if (step === "signin-pin") {
    const handleKey = (k: string) => {
      if (k === "⌫") { setPin(p => p.slice(0, -1)); return; }
      if (!k || pin.length >= 4) return;
      const next = pin + k;
      setPin(next);
      if (next.length === 4) {
        if (next === "1234") setTimeout(onLogin, 150);
        else {
          setShake(true);
          setTimeout(() => { setPin(""); setShake(false); }, 500);
        }
      }
    };

    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px" }}>
        <button
          onClick={() => { reset(); setStep("signin-phone"); }}
          style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4, marginTop: 56, marginBottom: 48, width: "fit-content" }}
        >
          <ChevronLeft size={18} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 30, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.7px" }}>Enter your PIN</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 48px" }}>
          Demo PIN: <span style={{ color: C.text, fontWeight: 600 }}>1234</span>
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 40, transform: shake ? "translateX(8px)" : "none", transition: shake ? "transform 60ms" : "transform 120ms ease-out" }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 999, background: pin.length > i ? C.text : C.surface3, border: `1.5px solid ${shake ? C.red : pin.length > i ? C.text : C.borderMd}`, transition: "all 120ms" }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {PAD.map((k, i) => (
            <button key={i} onClick={() => handleKey(k)} disabled={!k}
              style={{ height: 64, borderRadius: 14, background: k ? C.surface2 : "transparent", border: k ? `1px solid ${C.border}` : "none", color: C.text, fontFamily: font, fontSize: 22, fontWeight: 500, cursor: k ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseDown={e => k && ((e.currentTarget as HTMLButtonElement).style.background = C.surface3)}
              onMouseUp={e => k && ((e.currentTarget as HTMLButtonElement).style.background = C.surface2)}
            >
              {k === "⌫" ? <Delete size={20} strokeWidth={1.6} color={C.textSub} /> : k}
            </button>
          ))}
        </div>

        <button onClick={onLogin} style={{ ...S.btnGhost, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Fingerprint size={18} strokeWidth={1.6} /> Use Biometric
        </button>
      </div>
    );
  }

  // ── Sign-up: phone ───────────────────────────
  if (step === "signup-phone") {
    const handleContinue = () => {
      if (phone.length < 10) return;
      setLoading(true);
      setTimeout(() => { setLoading(false); onRegister(); }, 600);
    };
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px" }}>
        <PhoneEntry
          heading="Open an account."
          sub="Start with your mobile number — we'll send an OTP to verify."
          onContinue={handleContinue}
        />
        <p style={{ fontFamily: font, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: "auto", marginBottom: 0, lineHeight: 1.6 }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    );
  }

  // ── Landing ──────────────────────────────────
  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 40px" }}>
      {/* Logo */}
      <div style={{ marginTop: 64 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: C.surface3, border: `1px solid ${C.borderMd}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Headline */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.text, margin: "0 0 12px", letterSpacing: "-1px", lineHeight: 1.1 }}>
          Banking,{"\n"}reimagined.
        </p>
        <p style={{ fontFamily: font, fontSize: 15, color: C.textSub, margin: 0, lineHeight: 1.65 }}>
          A smarter, faster way to manage{"\n"}your money — all in one place.
        </p>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={() => { reset(); setStep("signup-phone"); }}
          style={{ ...S.btnPrimary }}
        >
          Open an account
        </button>
        <button
          onClick={() => { reset(); setStep("signin-phone"); }}
          style={{ ...S.btnGhost }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
