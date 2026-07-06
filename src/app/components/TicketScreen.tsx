import { useState } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";

interface Props {
  ticketId: string;
  onBack: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  "Open": "#4A9EFF",
  "In Progress": "#F5A623",
  "Resolved": "#00C896",
  "Closed": "#666666",
};

export function TicketScreen({ ticketId, onBack }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const ticket = state.tickets.find(t => t.id === ticketId) ?? state.tickets[0];
  const [reply, setReply] = useState("");

  const handleSend = () => {
    if (!reply.trim()) return;
    dispatch({ type: "REPLY_TICKET", ticketId: ticket.id, text: reply.trim() });
    setReply("");
  };

  if (!ticket) return (
    <div style={{ flex: 1, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: font, color: C.textMute }}>Ticket not found</p>
    </div>
  );

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={onBack} style={{ ...S.btnText }}>
            <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{ticket.subject}</p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "2px 0 0" }}>{ticket.id} · {ticket.category}</p>
          </div>
          <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: STATUS_COLOR[ticket.status], background: `${STATUS_COLOR[ticket.status]}18`, padding: "3px 10px", borderRadius: 20 }}>{ticket.status}</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {ticket.messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 14 }}>
            <div style={{ maxWidth: "80%", background: msg.from === "user" ? C.text : C.surface2, borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "12px 16px" }}>
              <p style={{ fontFamily: font, fontSize: 14, color: msg.from === "user" ? C.bg : C.text, margin: "0 0 4px", lineHeight: 1.5 }}>{msg.text}</p>
              <p style={{ fontFamily: font, fontSize: 11, color: msg.from === "user" ? "rgba(0,0,0,0.4)" : C.textMute, margin: 0 }}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply */}
      {ticket.status !== "Resolved" && ticket.status !== "Closed" && (
        <div style={{ padding: "12px 20px 32px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 12 }}>
          <input
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Reply to support…"
            style={{ ...S.input, flex: 1, height: 48, padding: "0 16px", fontSize: 14 }}
          />
          <button onClick={handleSend} disabled={!reply.trim()}
            style={{ width: 48, height: 48, borderRadius: 12, background: reply.trim() ? C.text : C.surface2, border: "none", cursor: reply.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 150ms" }}>
            <Send size={18} strokeWidth={1.8} color={reply.trim() ? C.bg : C.textMute} />
          </button>
        </div>
      )}
    </div>
  );
}
