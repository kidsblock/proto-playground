import type { ReactNode } from "react";
import { DemoMark } from "../components/DemoMark";
import { Joystick } from "../components/Joystick";
import { Masthead } from "../components/Masthead";
import { SpeedPresets } from "../components/SpeedPresets";
import { StopButton } from "../components/StopButton";
import { PRESET_LABEL, headingCaption, motionLabel } from "../lib/format";
import { PRESET_MAX_MPS, type CarSnapshot, type SpeedPreset } from "../lib/mockCar";

type Props = {
  snapshot: CarSnapshot;
  onDrive: (x: number, y: number) => void;
  onPreset: (preset: SpeedPreset) => void;
  onHorn: (on: boolean) => void;
  onHeadlights: (on: boolean) => void;
  onStop: () => void;
};

export function Drive({
  snapshot,
  onDrive,
  onPreset,
  onHorn,
  onHeadlights,
  onStop,
}: Props) {
  const moving = snapshot.motion === "driving";
  const max = PRESET_MAX_MPS[snapshot.preset];
  const meter = max === 0 ? 0 : Math.min(100, (snapshot.speedMps / max) * 100);

  return (
    <section className="drive">
      <Masthead
        name={snapshot.name}
        link={snapshot.link}
        level={snapshot.wifiLevel}
        headlights={snapshot.headlights}
      />
      <p className="motion" data-motion={snapshot.motion} aria-live="polite">
        <span className="flex items-baseline gap-3">
          <span className="kicker">状态</span>
          <strong>{motionLabel(snapshot.motion)}</strong>
        </span>
        <DemoMark />
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="readout">
          <div className="flex items-center justify-between gap-2">
            <span className="kicker">速度</span>
            <DemoMark />
          </div>
          <p className="readout-value num m-0">
            {snapshot.speedMps.toFixed(1)}
            <small>m/s</small>
          </p>
          <div className="meter" aria-hidden="true">
            <span style={{ width: `${meter}%` }} />
          </div>
          <p className="kicker m-0 mt-2">{PRESET_LABEL[snapshot.preset]}</p>
        </div>
        <div className="readout">
          <div className="flex items-center justify-between gap-2">
            <span className="kicker">航向</span>
            <DemoMark />
          </div>
          <p className="readout-value num m-0">
            <span>
              {snapshot.headingDeg}
              <small>°</small>
            </span>
          </p>
          <p className="kicker m-0 mt-2">
            {headingCaption(snapshot.headingDeg, moving)}
          </p>
        </div>
      </div>
      <div className="stage">
        <Joystick
          x={snapshot.joystick.x}
          y={snapshot.joystick.y}
          onDrive={onDrive}
        />
      </div>
      <p className="hint text-center">松手保持，按停止回中。</p>
      <SpeedPresets value={snapshot.preset} onChange={onPreset} />
      <div className="toggles">
        <Toggle
          label="喇叭"
          on={snapshot.horn}
          onClick={() => onHorn(!snapshot.horn)}
          icon={<HornIcon />}
        />
        <Toggle
          label="前灯"
          on={snapshot.headlights}
          onClick={() => onHeadlights(!snapshot.headlights)}
          icon={<LampIcon />}
        />
      </div>
      <StopButton stopped={snapshot.motion === "stopped"} onStop={onStop} />
    </section>
  );
}

function Toggle({
  label,
  on,
  onClick,
  icon,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button type="button" className="toggle" role="switch" aria-checked={on} onClick={onClick}>
      {icon}
      <span>{label}</span>
      <span className="toggle-state">{on ? "开" : "关"}</span>
    </button>
  );
}

function HornIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 10h4l6-4v12l-6-4H3v-4zm14.5 2a3.5 3.5 0 0 0-1.5-2.9v5.8A3.5 3.5 0 0 0 17.5 12z"
      />
    </svg>
  );
}

function LampIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.1" fill="currentColor" />
      <path
        fill="currentColor"
        d="M11 2.5h2V6h-2zm0 16h2v3.5h-2zM2.5 11H6v2H2.5zm16 0h3.5v2H18.5zM5.1 5.1l2.5 2.5-1.4 1.4-2.5-2.5zm12.7 12.7 2.5 2.5-1.4 1.4-2.5-2.5zM18.9 5.1l1.4 1.4-2.5 2.5-1.4-1.4zM6.2 16.4l1.4 1.4-2.5 2.5-1.4-1.4z"
      />
    </svg>
  );
}
