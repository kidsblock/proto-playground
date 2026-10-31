import type { LinkState } from "../lib/mockCar";
import { wifiText, wifiTone } from "../lib/format";
import { CarGlyph } from "../components/CarGlyph";
import { StatusChip } from "../components/StatusChip";

type Props = {
  name: string;
  link: LinkState;
  level: 0 | 1 | 2 | 3;
  onConnect: () => void;
};

export function Connect({ name, link, level, onConnect }: Props) {
  const connecting = link === "connecting";
  return (
    <section className="connect">
      <p className="kicker m-0">ESP32 智能小车</p>
      <div className="connect-hero">
        <div className={connecting ? "medallion is-busy" : "medallion"}>
          <span className="medallion-ring" />
          <CarGlyph size="lg" />
        </div>
        <h1 className="title">{name}</h1>
        <p className="lede">
          {connecting
            ? "正在与演示小车握手…"
            : "手机就是遥控。先试转向、档位和传感器，固件以后再接。"}
        </p>
        <StatusChip
          label={wifiText(link, level)}
          tone={wifiTone(link, level)}
          level={connecting ? 1 : 0}
        />
      </div>
      <button
        type="button"
        className="btn-connect"
        onClick={onConnect}
        disabled={connecting}
      >
        {connecting ? (
          <>
            <span className="spinner" aria-hidden="true" />
            正在连接
          </>
        ) : (
          "连接"
        )}
      </button>
      <p className="fine">数字均为演示数据，不会连接真实网络。</p>
    </section>
  );
}
