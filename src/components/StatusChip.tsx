type Tone = "muted" | "warn" | "good";

type Props = {
  label: string;
  tone: Tone;
  level?: 0 | 1 | 2 | 3;
};

export function StatusChip({ label, tone, level = 0 }: Props) {
  return (
    <span className="chip" data-tone={tone}>
      <span className="bars" data-level={level} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {tone === "warn" ? <span className="chip-dot" aria-hidden="true" /> : null}
      Wi-Fi {label}
    </span>
  );
}
