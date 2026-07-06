import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { C, font, S } from "../theme";
import { useAppState } from "../../store/AppContext";
import type { Screen } from "../App";

interface Props {
  onBack: () => void;
  onNav: (screen: Screen, params?: Record<string, unknown>) => void;
}

const CATEGORIES = ["All", "Equity", "Debt", "Hybrid", "Index"] as const;

export function MutualFundsScreen({ onBack, onNav }: Props) {
  const state = useAppState();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("All");

  const funds = state.mutualFunds.filter(f =>
    (category === "All" || f.category === category) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) || f.house.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "56px 20px 16px" }}>
        <button onClick={onBack} style={{ ...S.btnText, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, width: "fit-content" }}>
          <ChevronLeft size={20} strokeWidth={2} color={C.textSub} />
          <span style={{ fontFamily: font, fontSize: 14, color: C.textSub }}>Back</span>
        </button>
        <p style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 20px", letterSpacing: "-0.5px" }}>Mutual Funds</p>

        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search size={16} strokeWidth={1.6} color={C.textMute} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search funds"
            style={{ ...S.input, paddingLeft: 40 }} />
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 8 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ flexShrink: 0, background: category === cat ? C.text : C.surface2, color: category === cat ? C.bg : C.textSub, border: `1px solid ${category === cat ? C.text : C.border}`, borderRadius: 20, padding: "7px 14px", fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 32px" }}>
        {funds.map(fund => {
          const holding = state.holdings.find(h => h.fundId === fund.id);
          const riskColor = fund.riskLevel === "Low" ? C.green : fund.riskLevel === "Moderate" ? C.amber : C.red;
          return (
            <button key={fund.id} onClick={() => onNav("fund-detail", { fundId: fund.id })}
              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", textAlign: "left", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <p style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{fund.name}</p>
                  <p style={{ fontFamily: font, fontSize: 12, color: C.textMute, margin: "0 0 6px" }}>{fund.house} · {fund.category}</p>
                  <span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: riskColor, background: `${riskColor}15`, padding: "2px 8px", borderRadius: 10 }}>{fund.riskLevel} risk</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: font, fontSize: 13, color: C.textMute, margin: "0 0 2px" }}>NAV</p>
                  <p style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>₹{fund.nav}</p>
                  <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: C.green }}>+{fund.returns1Y}% 1Y</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${C.border2}` }}>
                <span style={{ fontFamily: font, fontSize: 12, color: C.textMute }}>Min SIP: ₹{fund.minSIP.toLocaleString("en-IN")}</span>
                {holding
                  ? <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: C.blue }}>Invested</span>
                  : <span style={{ fontFamily: font, fontSize: 12, color: C.textMute }}>AUM: {fund.aum}</span>
                }
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
