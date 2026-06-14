const STYLES: Record<string, string> = {
  LOW: "text-low border-low/30 bg-low/10",
  MEDIUM: "text-moderate border-moderate/30 bg-moderate/10",
  MODERATE: "text-moderate border-moderate/30 bg-moderate/10",
  HIGH: "text-high border-high/30 bg-high/10",
  BLOCKED: "text-high border-high/40 bg-high/15",
};

const LABELS: Record<string, string> = {
  LOW: "Looks safe",
  MEDIUM: "Worth a closer look",
  MODERATE: "Worth a closer look",
  HIGH: "Be careful",
  BLOCKED: "Blocked",
};

export function RiskBadge({ risk }: { risk: string }) {
  const style = STYLES[risk] || "text-text-dim border-border bg-surface-2";
  const label = LABELS[risk] || risk;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}