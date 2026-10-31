import { DemoMark } from "./DemoMark";

type Tone = "signal" | "good" | "amber";

type Props = {
  label: string;
  detail: string;
  value: string;
  unit: string;
  series: number[];
  tone: Tone;
};

function sparkline(series: number[]): { line: string; area: string } {
  const width = 120;
  const height = 36;
  const data = series.length > 1 ? series : [series[0] ?? 0, series[0] ?? 0];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(max - min, 1);
  const line = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - 4 - ((value - min) / span) * (height - 8);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return { line, area: `0,${height} ${line} ${width},${height}` };
}

export function SensorCard({ label, detail, value, unit, series, tone }: Props) {
  const { line, area } = sparkline(series);
  return (
    <article className={`sensor tone-${tone}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="sensor-label m-0">{label}</h2>
        <DemoMark />
      </div>
      <p className="sensor-value num m-0">
        {value}
        <small>{unit}</small>
      </p>
      <svg className="spark" viewBox="0 0 120 36" role="img" aria-label={`${label}演示曲线`}>
        <polygon points={area} fill="currentColor" opacity="0.16" />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <p className="sensor-detail m-0">{detail}</p>
    </article>
  );
}
