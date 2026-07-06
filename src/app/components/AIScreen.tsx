import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Sparkles } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";

interface Props {
  onBack: () => void;
}

const SUGGESTIONS = [
  "What's my account balance?",
  "How much did I spend on food this month?",
  "When is my next EMI due?",
  "How are my investments performing?",
];

function getAIResponse(msg: string, balance: number, spent: number, emi: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("balance")) return `Your savings account balance is ₹${balance.toLocaleString("en-IN")}. Your net worth across all accounts is higher — want the full breakdown?`;
  if (lower.includes("food") || lower.includes("dining")) return `You've spent ₹${spent.toLocaleString("en-IN")} on food & dining this month. You're at ${Math.round((spent / 8000) * 100)}% of your ₹8,000 budget.`;
  if (lower.includes("emi") || lower.includes("loan")) return `Your next EMI of ₹30,714 is due on ${emi}. Auto-debit is enabled, so it'll be processed automatically.`;
  if (lower.includes("invest")) return `Your portfolio is up 16.95% overall. Your Nifty 50 Index Fund and Axis Bluechip are performing well. Digital gold has gained 10.7%.`;
  if (lower.includes("hi") || lower.includes("hello")) return `Hello Priya! How can I help you today? I can answer questions about your balance, spending, loans, investments, and more.`;
  return `I can help you with account balances, spending analysis, EMI schedules, and investment performance. What would you like to know?`;
}

export function AIScreen({ onBack }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [state.chatMessages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    dispatch({ type: "SEND_AI_MESSAGE", text });
    setIsTyping(true);

    const balance = state.accounts[0]?.balance ?? 0;
    const foodBudget = state.budgets.find(b => b.category === "Food & Dining")?.spent ?? 0;
    const emiDate = state.loans.find(l => l.status === "Active")?.nextEmiDate ?? "N/A";

    setTimeout(() => {
      setIsTyping(false);
      dispatch({ type: "RECEIVE_AI_RESPONSE", text: getAIResponse(text, balance, foodBudget, emiDate) });
    }, 1200);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(74,158,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={18} strokeWidth={1.6} color={C.blue} />
          </div>
          <div>
            <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Meridian AI</p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.green, margin: 0 }}>● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {state.chatMessages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
            {msg.from === "ai" && (
              <div style={{ width: 28, height: 28, borderRadius: 10, background: "rgba(74,158,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8, alignSelf: "flex-end" }}>
                <Sparkles size={14} strokeWidth={1.6} color={C.blue} />
              </div>
            )}
            <div style={{ maxWidth: "78%", background: msg.from === "user" ? C.text : C.surface2, borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px" }}>
              <p style={{ fontFamily: font, fontSize: 14, color: msg.from === "user" ? C.bg : C.text, margin: 0, lineHeight: 1.6 }}>{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: "rgba(74,158,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={14} strokeWidth={1.6} color={C.blue} />
            </div>
            <div style={{ background: C.surface2, borderRadius: "18px 18px 18px 4px", padding: "14px 18px" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: C.textMute, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {state.chatMessages.length <= 1 && (
        <div style={{ padding: "0 20px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setInput(s); }}
              style={{ flexShrink: 0, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "8px 14px", fontFamily: font, fontSize: 13, color: C.textSub, cursor: "pointer", whiteSpace: "nowrap" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 20px 32px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything…"
          style={{ ...S.input, flex: 1, height: 48, padding: "0 16px", fontSize: 14 }}
        />
        <button onClick={handleSend} disabled={!input.trim()}
          style={{ width: 48, height: 48, borderRadius: 12, background: input.trim() ? C.blue : C.surface2, border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms", flexShrink: 0 }}>
          <Send size={18} strokeWidth={1.8} color={input.trim() ? "#fff" : C.textMute} />
        </button>
      </div>

      <style>{`@keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
