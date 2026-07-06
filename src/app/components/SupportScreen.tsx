import { ChevronLeft, ChevronRight, MessageCircle, Phone, HelpCircle, FileText, Plus } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

const STATUS_COLOR: Record<string, string> = {
  "Open": "#4A9EFF",
  "In Progress": "#F5A623",
  "Resolved": "#00C896",
  "Closed": "#666666",
};

export function SupportScreen({ onBack, onNav }: Props) {
  const state = useAppState();

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 24px", letterSpacing: "-0.5px" }}>Support</p>

        {/* Contact options */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Live Chat",   Icon: MessageCircle, color: C.blue,  sub: "Avg 2 min" },
            { label: "Call us",     Icon: Phone,         color: C.green, sub: "1800-xxx-xxxx" },
          ].map(({ label, Icon, color, sub }) => (
            <button key={label}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 16px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Icon size={20} strokeWidth={1.6} color={color} />
              </div>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 3px" }}>{label}</p>
              <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>{sub}</p>
            </button>
          ))}
        </div>

        {/* Tickets */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>My tickets</p>
          <button onClick={() => onNav("faq")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 12px", cursor: "pointer" }}>
            <Plus size={14} strokeWidth={2} color={C.text} />
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.text }}>New</span>
          </button>
        </div>

        {state.tickets.map(ticket => (
          <button key={ticket.id} onClick={() => onNav("ticket", { ticketId: ticket.id })}
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", textAlign: "left", display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{ticket.subject}</p>
              <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: STATUS_COLOR[ticket.status], background: `${STATUS_COLOR[ticket.status]}18`, padding: "2px 8px", borderRadius: 10, flexShrink: 0, marginLeft: 10 }}>{ticket.status}</span>
            </div>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 4px" }}>{ticket.category} · {ticket.id}</p>
            <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: 0 }}>Updated: {ticket.lastUpdate}</p>
          </button>
        ))}

        {/* Quick help */}
        <p style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: C.text, margin: "20px 0 14px" }}>Quick help</p>
        {[
          { label: "Frequently Asked Questions", Icon: HelpCircle, screen: "faq" as Screen },
        ].map(({ label, Icon, screen }) => (
          <button key={label} onClick={() => onNav(screen)}
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "15px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={17} strokeWidth={1.6} color={C.textSub} />
            </div>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, margin: 0, flex: 1 }}>{label}</p>
            <ChevronRight size={16} color={C.textDim} />
          </button>
        ))}
      </div>
    </div>
  );
}
