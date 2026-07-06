import { T, font } from "../../tokens";

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  const pct = ((current + 1) / steps.length) * 100;
  return (
    <div style={{ padding: "12px 16px", background: T.white, borderBottom: `1px solid ${T.gray200}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray500, margin: 0 }}>
          Step {current + 1} of {steps.length}
        </p>
        <p style={{ fontFamily: font, fontSize: 12, lineHeight: "16px", color: T.gray900, margin: 0, fontWeight: 500 }}>
          {steps[current]}
        </p>
      </div>
      <div style={{ height: 4, background: T.gray100, borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: T.blue600,
            transition: "width 200ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
