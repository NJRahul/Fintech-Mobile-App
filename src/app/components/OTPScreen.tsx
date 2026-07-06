import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { C, font, S } from "../theme";

interface OTPScreenProps {
  channel: "sms" | "email";
  target: string;
  onBack: () => void;
  onVerified: () => void;
}

export function OTPScreen({ channel, target, onBack, onVerified }: OTPScreenProps) {
  const [digits, setDigits] = useState<string[]>(["","","","","",""]);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    setError("");
    if (digit && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d)) {
      const otp = next.join("");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (otp === "123456") {
          onVerified();
        } else {
          setError("Wrong OTP. For this demo, use 123456.");
          setDigits(["","","","","",""]);
          setTimeout(() => refs.current[0]?.focus(), 50);
        }
      }, 500);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...digits];
    text.split("").forEach((ch, idx) => { if (idx < 6) next[idx] = ch; });
    setDigits(next);
    if (next.every(d => d)) {
      const otp = next.join("");
      setTimeout(() => {
        if (otp === "123456") onVerified();
        else setError("Wrong OTP. For this demo, use 123456.");
      }, 200);
    } else {
      const focusIdx = Math.min(text.length, 5);
      refs.current[focusIdx]?.focus();
    }
  };

  const maskedTarget = target.replace(/(\+91\s?\d{5})\d{3}/, "$1•••");

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 32px" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 4, marginTop: 56, marginBottom: 48, width: "fit-content" }}
      >
        <ChevronLeft size={18} strokeWidth={2} color={C.textSub} />
        <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
      </button>

      {/* Heading */}
      <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
        Verify your number
      </p>
      <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 40px", lineHeight: 1.6 }}>
        We sent a 6-digit code via {channel === "sms" ? "SMS" : "email"} to{" "}
        <span style={{ color: C.text, fontWeight: 600 }}>{maskedTarget}</span>
      </p>

      {/* OTP boxes */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            style={{
              width: 44,
              height: 52,
              flexShrink: 0,
              textAlign: "center",
              fontFamily: font,
              fontSize: 20,
              fontWeight: 700,
              color: C.text,
              background: C.surface2,
              border: `1.5px solid ${error ? C.red : d ? C.borderMd : C.border}`,
              borderRadius: 12,
              outline: "none",
              caretColor: "transparent",
              transition: "border-color 120ms",
            }}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontFamily: font, fontSize: 13, color: C.red, margin: "0 0 16px", textAlign: "center" }}>
          {error}
        </p>
      )}

      {/* Resend */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        {countdown > 0 ? (
          <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>
            Resend code in{" "}
            <span style={{ color: C.textSub, fontWeight: 600 }}>
              0:{String(countdown).padStart(2, "0")}
            </span>
          </p>
        ) : (
          <button
            onClick={() => { setCountdown(30); setDigits(["","","","","",""]); setTimeout(() => refs.current[0]?.focus(), 50); }}
            style={{ ...S.btnText, color: C.text, fontWeight: 600, fontSize: 14 }}
          >
            Resend code
          </button>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={onVerified}
          disabled={loading || digits.some(d => !d)}
          style={{
            ...S.btnPrimary,
            opacity: loading || digits.some(d => !d) ? 0.45 : 1,
            transition: "opacity 150ms",
          }}
        >
          {loading ? "Verifying…" : "Verify & Continue"}
        </button>

        <p style={{ fontFamily: font, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
          Never share this code with anyone — Meridian will never ask for it.
        </p>
      </div>
    </div>
  );
}
