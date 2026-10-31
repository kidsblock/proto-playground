import type { SpeedPreset } from "../lib/mockCar";
import { PRESET_LABEL } from "../lib/format";

const OPTIONS: SpeedPreset[] = ["slow", "normal", "fast"];

type Props = {
  value: SpeedPreset;
  onChange: (preset: SpeedPreset) => void;
};

export function SpeedPresets({ value, onChange }: Props) {
  return (
    <div className="presets" role="radiogroup" aria-label="速度档位">
      {OPTIONS.map((preset) => (
        <button
          key={preset}
          type="button"
          role="radio"
          aria-checked={value === preset}
          onClick={() => onChange(preset)}
        >
          {PRESET_LABEL[preset]}
        </button>
      ))}
    </div>
  );
}
