import type { LinkState } from "../lib/mockCar";
import { wifiText, wifiTone } from "../lib/format";
import { CarGlyph } from "./CarGlyph";
import { StatusChip } from "./StatusChip";

type Props = {
  name: string;
  link: LinkState;
  level: 0 | 1 | 2 | 3;
  headlights: boolean;
};

export function Masthead({ name, link, level, headlights }: Props) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <CarGlyph lit={headlights} />
        <div className="min-w-0">
          <p className="kicker m-0">ESP32 智能小车</p>
          <h1 className="m-0 truncate text-xl font-bold leading-tight">{name}</h1>
        </div>
      </div>
      <StatusChip
        label={wifiText(link, level)}
        tone={wifiTone(link, level)}
        level={link === "online" ? level : 0}
      />
    </header>
  );
}
