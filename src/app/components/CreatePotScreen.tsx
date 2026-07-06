import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppDispatch } from "../../store/AppContext";

interface Props {
  onBack: () => void;
  onDone: () => void;
}

const EMOJIS = ["✈️", "🏠", "💻", "🛡️", "💍", "🎓", "🚗", "🌴", "📱", "💰"];
const COLORS = ["#4A2EC4", "#059669", "#D97706", "#DC2626", "#7C3AED", "#0891B2", "#065F46", "#92400E"];

export function CreatePotScreen({ onBack, onDone }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [autoSave, setAutoSave] = useState("");
  const [emoji, setEmoji] = useState("✈️");
  const [color, setColor] = useState("#4A2EC4");
  const [loading, setLoading] = useState(false);

  const canCreate = name.trim() && parseFloat(targetAmount) > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: "CREATE_POT",
        pot: {
          name: name.trim(),
          emoji,
          color,
          targetAmount: parseFloat(targetAmount),
          currentAmount: 0,
          targetDate: targetDate || "Dec 2025",
          autoSaveAmount: parseFloat(autoSave) || 0,
          autoSaveFrequency: autoSave ? "monthly" : "none",
        },
      });
      setLoading(false);
      onDone();
    }, 600);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 28px", letterSpacing: "-0.5px" }}>Create a pot</p>

        {/* Emoji & Color */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 16 }}>
          <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, margin: "0 0 12px" }}>Icon</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                style={{ width: 44, height: 44, borderRadius: 12, background: emoji === e ? `${color}20` : C.surface2, border: `1px solid ${emoji === e ? color : C.border}`, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {e}
              </button>
            ))}
          </div>
          <p style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, margin: "0 0 12px" }}>Colour</p>
          <div style={{ display: "flex", gap: 10 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                style={{ width: 32, height: 32, borderRadius: 16, background: c, border: color === c ? `2px solid #fff` : "none", cursor: "pointer" }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 8 }}>Pot name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Goa trip" style={{ ...S.input }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 8 }}>Target amount</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 16, color: C.textSub }}>₹</span>
            <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0" style={{ ...S.input, paddingLeft: 34 }} />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 8 }}>Target date (optional)</label>
          <input type="text" value={targetDate} onChange={e => setTargetDate(e.target.value)} placeholder="e.g. Dec 2025" style={{ ...S.input }} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: C.textSub, display: "block", marginBottom: 8 }}>Monthly auto-save (optional)</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 16, color: C.textSub }}>₹</span>
            <input type="number" value={autoSave} onChange={e => setAutoSave(e.target.value)} placeholder="0" style={{ ...S.input, paddingLeft: 34 }} />
          </div>
        </div>

        <button onClick={handleCreate} disabled={!canCreate || loading}
          style={{ ...S.btnPrimary, opacity: !canCreate || loading ? 0.4 : 1 }}>
          {loading ? "Creating…" : "Create pot"}
        </button>
      </div>
    </div>
  );
}
