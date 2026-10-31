import { useRef, useState } from "react";
import { TabBar, type RemoteTab } from "./components/TabBar";
import { createMockCar, type CarClient } from "./lib/mockCar";
import { useCarSnapshot } from "./lib/useCar";
import { Connect } from "./screens/Connect";
import { Drive } from "./screens/Drive";
import { Sensors } from "./screens/Sensors";

type Screen = "connect" | RemoteTab;

export function App() {
  const carRef = useRef<CarClient | null>(null);
  if (carRef.current === null) {
    carRef.current = createMockCar();
  }
  const car = carRef.current;
  const snapshot = useCarSnapshot(car);
  const [screen, setScreen] = useState<Screen>("connect");
  const lit = screen !== "connect" && snapshot.headlights;

  return (
    <div className="shell">
      <div className={lit ? "frame is-lit" : "frame"}>
        {screen === "connect" ? (
          <Connect
            name={snapshot.name}
            link={snapshot.link}
            level={snapshot.wifiLevel}
            onConnect={() => {
              void car.connect().then(() => setScreen("drive"));
            }}
          />
        ) : (
          <>
            <div className="sheet">
              {screen === "drive" ? (
                <Drive
                  snapshot={snapshot}
                  onDrive={(x, y) => car.drive(x, y)}
                  onPreset={(preset) => car.setPreset(preset)}
                  onHorn={(on) => car.setHorn(on)}
                  onHeadlights={(on) => car.setHeadlights(on)}
                  onStop={() => car.stop()}
                />
              ) : (
                <Sensors snapshot={snapshot} />
              )}
            </div>
            <TabBar tab={screen} onChange={setScreen} />
          </>
        )}
      </div>
    </div>
  );
}
