// ⚠️ REGULATORY PLACEHOLDER
// PAN verification: integrate NSDL API in production
// Aadhaar verification: integrate DigiLocker / UIDAI masked-Aadhaar OTP API
// Consent logging must be RBI-compliant and timestamped server-side

import { useState } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { C, font, S } from "../theme";
import { kycService } from "../../services/kyc";

interface KYCDetailsScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

type KYCStep = "pan" | "aadhaar" | "consent";

function ProgressDots({ step }: { step: KYCStep }) {
  const steps: KYCStep[] = ["pan", "aadhaar", "consent"];
  const idx = steps.indexOf(step);
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
      {steps.map((_, i) => (
        <div key={i} style={{
          height: 3, flex: i <= idx ? 2 : 1,
          background: i <= idx ? C.text : C.surface3,
          borderRadius: 999,
          transition: "all 300ms ease",
        }} />
      ))}
    </div>
  );
}

function DarkInput({ label, value, onChange, placeholder, type = "text", autoCapitalize = "off", maxLength }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoCapitalize?: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: C.textMute, letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...S.input,
          border: `1px solid ${focused ? C.borderMd : C.border}`,
          transition: "border-color 150ms",
        }}
      />
    </div>
  );
}

export function KYCDetailsScreen({ onBack, onComplete }: KYCDetailsScreenProps) {
  const [step, setStep] = useState<KYCStep>("pan");
  const [pan, setPan] = useState("");
  const [fullName, setFullName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [consentKYC, setConsentKYC] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePanContinue = async () => {
    setLoading(true); setError("");
    const result = await kycService.verifyPAN(pan.toUpperCase(), fullName);
    setLoading(false);
    if (!result.valid) { setError(result.error ?? "Invalid PAN"); return; }
    setStep("aadhaar");
  };

  const handleAadhaarContinue = async () => {
    setLoading(true); setError("");
    const result = await kycService.verifyAadhaar(aadhaar);
    setLoading(false);
    if (!result.valid) { setError(result.error ?? "Invalid Aadhaar"); return; }
    setStep("consent");
  };

  const handleConsentSubmit = () => {
    if (!consentKYC || !consentData) { setError("Please accept all consents to proceed."); return; }
    onComplete();
  };

  const formatAadhaar = (v: string) =>
    v.replace(/\D/g, "").slice(0, 12).replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (_,a,b,c) =>
      [a,b,c].filter(Boolean).join(" "));

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px", overflowY: "auto" }}>
      {/* Back */}
      <button
        onClick={step === "pan" ? onBack : () => { setStep(step === "consent" ? "aadhaar" : "pan"); setError(""); }}
        style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4, marginTop: 56, marginBottom: 32, width: "fit-content" }}
      >
        <ChevronLeft size={18} strokeWidth={2} color={C.textSub} />
        <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
      </button>

      <ProgressDots step={step} />

      {/* ── PAN step ── */}
      {step === "pan" && (
        <>
          <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Your PAN details
          </p>
          <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 36px", lineHeight: 1.6 }}>
            Enter your PAN exactly as printed on your card.
          </p>

          <DarkInput
            label="PAN Number"
            value={pan}
            onChange={v => setPan(v.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            placeholder="ABCDE1234F"
            autoCapitalize="characters"
            maxLength={10}
          />
          <DarkInput
            label="Full Name (as on PAN)"
            value={fullName}
            onChange={setFullName}
            placeholder="e.g. Priya Sharma"
          />

          {error && <p style={{ fontFamily: font, fontSize: 13, color: C.red, margin: "0 0 16px" }}>{error}</p>}

          <div style={{ marginTop: "auto", paddingTop: 24 }}>
            <button
              onClick={handlePanContinue}
              disabled={pan.length !== 10 || !fullName.trim() || loading}
              style={{ ...S.btnPrimary, opacity: (pan.length !== 10 || !fullName.trim() || loading) ? 0.45 : 1 }}
            >
              {loading ? "Verifying PAN…" : "Continue"}
            </button>
          </div>
        </>
      )}

      {/* ── Aadhaar step ── */}
      {step === "aadhaar" && (
        <>
          <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Link your Aadhaar
          </p>
          <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 36px", lineHeight: 1.6 }}>
            We use masked Aadhaar verification. Only the last 4 digits will be stored.
          </p>

          <DarkInput
            label="Aadhaar Number"
            value={aadhaar}
            onChange={v => setAadhaar(formatAadhaar(v))}
            placeholder="XXXX XXXX XXXX"
            type="tel"
            maxLength={14}
          />

          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginTop: 8, marginBottom: 24 }}>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0, lineHeight: 1.6 }}>
              ⚠️ <strong style={{ color: C.textSub }}>Production note:</strong> This will trigger a DigiLocker / UIDAI OTP-based verification. The Aadhaar number is never stored in plaintext.
            </p>
          </div>

          {error && <p style={{ fontFamily: font, fontSize: 13, color: C.red, margin: "0 0 16px" }}>{error}</p>}

          <div style={{ marginTop: "auto", paddingTop: 24 }}>
            <button
              onClick={handleAadhaarContinue}
              disabled={aadhaar.replace(/\s/g, "").length !== 12 || loading}
              style={{ ...S.btnPrimary, opacity: (aadhaar.replace(/\s/g, "").length !== 12 || loading) ? 0.45 : 1 }}
            >
              {loading ? "Verifying Aadhaar…" : "Continue"}
            </button>
          </div>
        </>
      )}

      {/* ── Consent step ── */}
      {step === "consent" && (
        <>
          <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Review & consent
          </p>
          <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 28px", lineHeight: 1.6 }}>
            Before we proceed, please review what you're sharing with us.
          </p>

          {/* Summary */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
            {[
              { label: "PAN", value: `${pan.slice(0, 2)}•••${pan.slice(-4)}` },
              { label: "Name", value: fullName },
              { label: "Aadhaar", value: `••••  ••••  ${aadhaar.replace(/\s/g, "").slice(-4)}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border2}` }}>
                <span style={{ fontFamily: font, fontSize: 13, color: C.textMute }}>{label}</span>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Consent checkboxes */}
          {[
            { key: "kyc", value: consentKYC, set: setConsentKYC, label: "I authorise Meridian Bank to perform e-KYC using my Aadhaar and PAN data." },
            { key: "data", value: consentData, set: setConsentData, label: "I consent to Meridian using my data for account opening and credit assessment as per RBI guidelines." },
          ].map(({ key, value, set, label }) => (
            <button
              key={key}
              onClick={() => set(v => !v)}
              style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "none", border: "none", cursor: "pointer", padding: "12px 0", textAlign: "left", width: "100%" }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: value ? C.text : "transparent",
                border: `1.5px solid ${value ? C.text : C.borderMd}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 150ms",
                marginTop: 1,
              }}>
                {value && <Check size={13} color={C.bg} strokeWidth={2.5} />}
              </div>
              <span style={{ fontFamily: font, fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{label}</span>
            </button>
          ))}

          {error && <p style={{ fontFamily: font, fontSize: 13, color: C.red, margin: "8px 0 0" }}>{error}</p>}

          <div style={{ marginTop: "auto", paddingTop: 24 }}>
            <button
              onClick={handleConsentSubmit}
              disabled={!consentKYC || !consentData}
              style={{ ...S.btnPrimary, opacity: (!consentKYC || !consentData) ? 0.45 : 1 }}
            >
              Submit KYC
            </button>
          </div>
        </>
      )}
    </div>
  );
}
