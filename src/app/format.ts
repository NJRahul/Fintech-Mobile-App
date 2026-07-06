// Format ₹ in Indian digit grouping: 1,24,500.00
export function formatINR(amount: number, opts?: { showSign?: boolean; type?: "credit" | "debit" | "neutral"; decimals?: 0 | 2 }): string {
  const decimals = opts?.decimals ?? 2;
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(abs);
  const sign = opts?.showSign
    ? opts.type === "credit"
      ? "+"
      : opts.type === "debit"
      ? "−"
      : ""
    : "";
  return `${sign}₹${formatted}`;
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dd = String(date.getDate()).padStart(2, "0");
  return `${dd} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${formatDate(date)}, ${hh}:${mm}`;
}
