import { Masthead } from "../components/Masthead";
import { SensorCard } from "../components/SensorCard";
import type { CarSnapshot } from "../lib/mockCar";

type Props = {
  snapshot: CarSnapshot;
};

export function Sensors({ snapshot }: Props) {
  return (
    <section className="sensors">
      <Masthead
        name={snapshot.name}
        link={snapshot.link}
        level={snapshot.wifiLevel}
        headlights={snapshot.headlights}
      />
      <p className="lede m-0">超声波、电量和 Wi-Fi 会自己变化。读数都是演示数据。</p>
      <div className="flex flex-col gap-3">
        <SensorCard
          label="超声波距离"
          detail="前方障碍物距离"
          value={String(Math.round(snapshot.distanceCm))}
          unit="厘米"
          series={snapshot.series.distance}
          tone="signal"
        />
        <SensorCard
          label="电量"
          detail="电池剩余电量"
          value={String(Math.round(snapshot.batteryPct))}
          unit="%"
          series={snapshot.series.battery}
          tone="good"
        />
        <SensorCard
          label="Wi-Fi 信号"
          detail="无线信号强度"
          value={String(Math.round(snapshot.wifiDbm))}
          unit="dBm"
          series={snapshot.series.wifi}
          tone="amber"
        />
      </div>
    </section>
  );
}
