import { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { C, font, S } from "../theme";

interface Props {
  onBack: () => void;
}

const FAQS = [
  { q: "How do I send money?",                  a: "Go to the Payments tab and tap 'Send Money'. Select a saved payee or enter a UPI ID, enter the amount, and confirm." },
  { q: "How do I freeze my card?",               a: "Open the Cards tab, select the card, and tap 'Freeze card'. You can unfreeze it at any time." },
  { q: "What is a Savings Pot?",                 a: "A Savings Pot is a ring-fenced savings goal within your account. Your money earns interest and stays separate from your main balance." },
  { q: "How do I update my PIN?",                a: "Go to Profile → Security → Change PIN. Enter your current PIN and set a new 4-digit PIN." },
  { q: "How long does an IMPS transfer take?",   a: "IMPS transfers are instant — typically credited within seconds, 24/7 including holidays." },
  { q: "How do I dispute a transaction?",        a: "Find the transaction in your account history, tap on it, and select 'Raise a dispute'. Our team will investigate within 7 working days." },
  { q: "What is the UPI limit per day?",         a: "The default UPI limit is ₹1,00,000 per transaction. Daily limits may vary based on your account tier." },
  { q: "How are my investments protected?",       a: "Your mutual fund investments are held by the respective AMCs in your name. Digital gold is stored in insured vaults by MMTC-PAMP." },
];

export function FAQScreen({ onBack }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: "-0.5px" }}>FAQs</p>
        <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: "0 0 24px" }}>Frequently asked questions</p>

        {FAQS.map((faq, idx) => (
          <div key={idx} style={{ background: C.surface, border: `1px solid ${open === idx ? C.borderMd : C.border}`, borderRadius: 14, marginBottom: 10, overflow: "hidden", transition: "border 150ms" }}>
            <button onClick={() => setOpen(open === idx ? null : idx)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: C.text, margin: 0, paddingRight: 16, flex: 1 }}>{faq.q}</p>
              {open === idx ? <ChevronUp size={18} strokeWidth={1.8} color={C.textMute} /> : <ChevronDown size={18} strokeWidth={1.8} color={C.textMute} />}
            </button>
            {open === idx && (
              <div style={{ padding: "0 16px 16px" }}>
                <p style={{ fontFamily: font, fontSize: 14, color: C.textSub, margin: 0, lineHeight: 1.65 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
