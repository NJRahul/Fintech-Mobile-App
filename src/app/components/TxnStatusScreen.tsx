import { CheckCircle, XCircle, Clock, ArrowLeft, Share2 } from "lucide-react";
import { C, font, S } from "../theme";
import type { Screen } from "../App";

interface Props {
  type: "success" | "failed" | "processing";
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

const CONFIG = {
  success:    { Icon: CheckCircle, color: "#00C896", bg: "rgba(0,200,150,0.1)",  border: "rgba(0,200,150,0.25)",  title: "Payment successful",  sub: "Your money is on its way." },
  failed:     { Icon: XCircle,     color: "#FF4D4D", bg: "rgba(255,77,77,0.1)",  border: "rgba(255,77,77,0.25)",  title: "Payment failed",      sub: "Your money hasn't been deducted." },
  processing: { Icon: Clock,       color: "#F5A623", bg: "rgba(245,166,35,0.1)", border: "rgba(245,166,35,0.25)", title: "Payment processing",  sub: "We'll notify you once it's done." },
};

export function TxnStatusScreen({ type, onBack, onNav }: Props) {
  const cfg = CONFIG[type];

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", padding: "0 24px 40px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <cfg.Icon size={36} strokeWidth={1.6} color={cfg.color} />
        </div>
        <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 10px", textAlign: "center", letterSpacing: "-0.8px" }}>{cfg.title}</p>
        <p style={{ fontFamily: font, fontSize: 15, color: C.textSub, textAlign: "center", lineHeight: 1.6, margin: 0 }}>{cfg.sub}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => onNav("dashboard")} style={{ ...S.btnPrimary }}>Go to dashboard</button>
        <button onClick={() => onNav("send-money")} style={{ ...S.btnGhost, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <ArrowLeft size={16} strokeWidth={1.8} /> Send another payment
        </button>
      </div>
    </div>
  );
}
