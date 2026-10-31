type Props = {
  lit?: boolean;
  size?: "md" | "lg";
};

export function CarGlyph({ lit = false, size = "md" }: Props) {
  return (
    <svg
      className={size === "lg" ? "car car-lg" : "car car-md"}
      data-lit={lit ? "true" : "false"}
      viewBox="0 0 80 120"
      aria-hidden="true"
    >
      <rect className="wheel" x="6" y="24" width="14" height="26" rx="5" />
      <rect className="wheel" x="60" y="24" width="14" height="26" rx="5" />
      <rect className="wheel" x="6" y="72" width="14" height="26" rx="5" />
      <rect className="wheel" x="60" y="72" width="14" height="26" rx="5" />
      <rect className="body" x="18" y="8" width="44" height="104" rx="18" />
      <rect className="cabin" x="26" y="40" width="28" height="40" rx="8" />
      <circle className="lamp" cx="32" cy="22" r="4.5" />
      <circle className="lamp" cx="48" cy="22" r="4.5" />
    </svg>
  );
}
