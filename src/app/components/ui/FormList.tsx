import type { ReactNode } from "react";
import { T, font } from "../../tokens";

interface Row {
  label: string;
  value: ReactNode;
}

interface FormListProps {
  rows: Row[];
}

export function FormList({ rows }: FormListProps) {
  return (
    <div>
      {rows.map((r, i) => (
        <div
          key={r.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            padding: "12px 0",
            borderBottom: i < rows.length - 1 ? `1px solid ${T.gray200}` : "none",
          }}
        >
          <span style={{ fontFamily: font, fontSize: 13, lineHeight: "18px", color: T.gray500, flexShrink: 0 }}>{r.label}</span>
          <span style={{ fontFamily: font, fontSize: 14, lineHeight: "20px", color: T.gray900, fontWeight: 500, textAlign: "right" }} className="tabular">
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
