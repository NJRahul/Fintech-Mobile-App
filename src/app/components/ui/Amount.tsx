import { T, font } from "../../tokens";
import { formatINR } from "../../format";

interface AmountProps {
  value: number;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  /** credit: green +, debit: gray −, neutral: gray */
  type?: "credit" | "debit" | "neutral";
  showSign?: boolean;
  weight?: 400 | 500 | 600 | 700;
  className?: string;
  decimals?: 0 | 2;
  color?: string;
}

const SIZE_MAP: Record<NonNullable<AmountProps["size"]>, { fs: number; lh: number; symbolFs: number }> = {
  sm: { fs: 13, lh: 18, symbolFs: 13 },
  md: { fs: 14, lh: 20, symbolFs: 14 },
  lg: { fs: 16, lh: 24, symbolFs: 16 },
  xl: { fs: 20, lh: 28, symbolFs: 16 },
  hero: { fs: 32, lh: 40, symbolFs: 20 },
};

export function Amount({
  value,
  size = "md",
  type = "neutral",
  showSign = false,
  weight = 600,
  decimals = 2,
  color,
  className,
}: AmountProps) {
  const s = SIZE_MAP[size];
  const resolvedColor =
    color ??
    (type === "credit"
      ? T.success600
      : type === "debit"
      ? T.gray900
      : T.gray900);
  const formatted = formatINR(value, { showSign, type, decimals });

  // Separate ₹ from digits so we can size the currency symbol distinctly for hero amounts.
  const firstDigitIdx = formatted.search(/\d/);
  const symbolPart = formatted.slice(0, firstDigitIdx);
  const digitsPart = formatted.slice(firstDigitIdx);

  return (
    <span
      className={`tabular ${className ?? ""}`}
      style={{
        fontFamily: font,
        color: resolvedColor,
        fontVariantNumeric: "tabular-nums",
        fontWeight: weight,
        fontSize: s.fs,
        lineHeight: `${s.lh}px`,
        letterSpacing: size === "hero" ? "-0.5px" : undefined,
        display: "inline-flex",
        alignItems: "baseline",
        gap: 2,
      }}
    >
      <span style={{ fontSize: s.symbolFs, fontWeight: size === "hero" ? 500 : weight }}>
        {symbolPart}
      </span>
      <span>{digitsPart}</span>
    </span>
  );
}
