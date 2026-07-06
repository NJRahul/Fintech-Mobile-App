import { useState } from "react";
import { ChevronLeft, TrendingUp } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState, useAppDispatch } from "../../store/AppContext";
import { useToast } from "./Toast";

interface Props {
  onBack: () => void;
}

export function DigitalGoldScreen({ onBack }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const gold = state.goldHolding;

  const [mode, setMode] = useState<"view" | "buy" | "sell">("view");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const pricePerGram = gold.currentPrice;
  const amountNum = parseFloat(amount) || 0;
  const gramsForAmount = amountNum / pricePerGram;
  const totalReturn = gold.currentValue - gold.investedAmount;
  const returnPct = ((totalReturn / gold.investedAmount) * 100).toFixed(2);

  const handleBuy = () => {
    if (amountNum < 10) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "BUY_GOLD", grams: gramsForAmount, price: pricePerGram, amount: amountNum });
      toast(`${gramsForAmount.toFixed(4)}g gold purchased`, "success");
      setLoading(false);
      setMode("view");
      setAmount("");
    }, 800);
  };

  const handleSell = () => {
    const grams = amountNum;
    if (grams <= 0 || grams > gold.grams) return;
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "SELL_GOLD", grams, price: pricePerGram });
      toast(`${grams}g gold sold — ₹${(grams * pricePerGram).toLocaleString("en-IN")} credited`, "success");
      setLoading(false);
      setMode("view");
      setAmount("");
    }, 800);
  };

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "56px 20px 32px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(245,166,35,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🪙</div>
          <div>
            <p style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 2px", letterSpacing: "-0.5px" }}>Digital Gold</p>
            <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: 0 }}>₹{pricePerGram.toLocaleString("en-IN")}/gram · 24K 999 Pure</p>
          </div>
        </div>

        {/* Holdings */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.border2}` }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>You own</p>
              <p style={{ fontFamily: font, fontSize: 28, fontWeight: 800, color: C.text, margin: 0 }}>{gold.grams}g</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 4px" }}>Current value</p>
              <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>₹{gold.currentValue.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Invested</p>
              <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>₹{gold.investedAmount.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Returns</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <TrendingUp size={14} color={C.green} />
                <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.green, margin: 0 }}>+₹{totalReturn.toLocaleString("en-IN")} ({returnPct}%)</p>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: font, fontSize: 11, color: C.textMute, margin: "0 0 2px" }}>Avg buy price</p>
              <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>₹{gold.avgBuyPrice.toLocaleString("en-IN")}/g</p>
            </div>
          </div>
        </div>

        {mode === "view" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setMode("buy")} style={{ ...S.btnPrimary, height: 44, fontSize: 14 }}>Buy gold</button>
            <button onClick={() => setMode("sell")} style={{ ...S.btnGhost, height: 44, fontSize: 14 }}>Sell gold</button>
          </div>
        )}

        {mode === "buy" && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px" }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Buy gold (min ₹10)</p>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: font, fontSize: 18, color: C.textSub }}>₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" autoFocus
                style={{ ...S.input, paddingLeft: 36, fontSize: 20, fontWeight: 700, marginBottom: 0 }} />
            </div>
            {amountNum > 0 && <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 14px" }}>≈ {gramsForAmount.toFixed(4)}g of gold</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={handleBuy} disabled={amountNum < 10 || loading}
                style={{ ...S.btnPrimary, height: 44, fontSize: 14, opacity: amountNum < 10 || loading ? 0.4 : 1 }}>
                {loading ? "…" : "Buy"}
              </button>
              <button onClick={() => { setMode("view"); setAmount(""); }} style={{ ...S.btnGhost, height: 44, fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        )}

        {mode === "sell" && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px" }}>
            <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Sell gold (max {gold.grams}g)</p>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Grams to sell" autoFocus
                style={{ ...S.input, fontSize: 20, fontWeight: 700, marginBottom: 0 }} />
            </div>
            {amountNum > 0 && <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 14px" }}>≈ ₹{(amountNum * pricePerGram).toLocaleString("en-IN")}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={handleSell} disabled={amountNum <= 0 || amountNum > gold.grams || loading}
                style={{ ...S.btnPrimary, height: 44, fontSize: 14, opacity: (amountNum <= 0 || amountNum > gold.grams || loading) ? 0.4 : 1 }}>
                {loading ? "…" : "Sell"}
              </button>
              <button onClick={() => { setMode("view"); setAmount(""); }} style={{ ...S.btnGhost, height: 44, fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        )}

        <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          Stored in insured vaults. Delivered on request. MMTC-PAMP certified.
        </p>
      </div>
    </div>
  );
}
