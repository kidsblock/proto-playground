/**
 * CarClient is the control surface for the smart car.
 *
 * This prototype only ships MockCarClient. Numbers are invented in the page.
 * Nothing here opens a socket or reads a device.
 *
 * A later firmware client can implement the same interface against
 * ws://<car-ip>/ws. Illustrative frames, not a protocol spec:
 *   connect()                 open the socket, wait for a hello
 *   drive(x, y)               { "op": "drive", "x": number, "y": number }
 *   stop()                    { "op": "stop" }
 *   setPreset / setHorn / setHeadlights
 *   subscribe(listener)       telemetry frames mapped into CarSnapshot
 *
 * x is left (-1) to right (+1). y is back (-1) to forward (+1).
 */

export type LinkState = "offline" | "connecting" | "online";
export type MotionState = "idle" | "driving" | "stopped";
export type SpeedPreset = "slow" | "normal" | "fast";

export interface JoystickVector {
  x: number;
  y: number;
}

export interface CarSnapshot {
  name: string;
  link: LinkState;
  motion: MotionState;
  preset: SpeedPreset;
  horn: boolean;
  headlights: boolean;
  joystick: JoystickVector;
  /** Meters per second. Demo only. */
  speedMps: number;
  /** Degrees. 0 is forward, positive is right. Demo only. */
  headingDeg: number;
  /** Centimeters. Demo only. */
  distanceCm: number;
  /** Percent. Demo only. */
  batteryPct: number;
  /** dBm. Demo only. */
  wifiDbm: number;
  wifiLevel: 0 | 1 | 2 | 3;
  series: {
    distance: number[];
    battery: number[];
    wifi: number[];
  };
}

export interface CarClient {
  connect(): Promise<void>;
  drive(x: number, y: number): void;
  stop(): void;
  setPreset(preset: SpeedPreset): void;
  setHorn(on: boolean): void;
  setHeadlights(on: boolean): void;
  subscribe(listener: (snapshot: CarSnapshot) => void): () => void;
  getSnapshot(): CarSnapshot;
}

export const PRESET_MAX_MPS: Record<SpeedPreset, number> = {
  slow: 0.4,
  normal: 0.9,
  fast: 1.6,
};

const CONNECT_DELAY_MS = 2400;
const SENSOR_INTERVAL_MS = 500;
const SERIES_LENGTH = 28;
const DEADZONE = 0.08;
const CAR_NAME = "夜行";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampAxis(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return clamp(value, -1, 1);
}

export function levelFromDbm(dbm: number): 0 | 1 | 2 | 3 {
  if (dbm >= -52) return 3;
  if (dbm >= -64) return 2;
  if (dbm >= -75) return 1;
  return 0;
}

function seedWave(base: number, amplitude: number): number[] {
  return Array.from({ length: SERIES_LENGTH }, (_, index) => {
    const value =
      base +
      Math.sin(index / 2.5) * amplitude +
      Math.cos(index / 4.1) * (amplitude / 3);
    return Math.round(value * 10) / 10;
  });
}

function pushSample(samples: number[], value: number): number[] {
  const next =
    samples.length >= SERIES_LENGTH
      ? samples.slice(samples.length - SERIES_LENGTH + 1)
      : samples.slice();
  next.push(value);
  return next;
}

function initialSnapshot(): CarSnapshot {
  const distance = seedWave(86, 16);
  const battery = seedWave(78, 2.4);
  const wifi = seedWave(-52, 5);
  return {
    name: CAR_NAME,
    link: "offline",
    motion: "idle",
    preset: "normal",
    horn: false,
    headlights: false,
    joystick: { x: 0, y: 0 },
    speedMps: 0,
    headingDeg: 0,
    distanceCm: distance[distance.length - 1] ?? 86,
    batteryPct: battery[battery.length - 1] ?? 78,
    wifiDbm: wifi[wifi.length - 1] ?? -52,
    wifiLevel: 0,
    series: { distance, battery, wifi },
  };
}

export function createMockCar(): CarClient {
  let snapshot = initialSnapshot();
  let vector: JoystickVector = { x: 0, y: 0 };
  let phase = 0;
  let connectTask: Promise<void> | null = null;
  let sensorTimer: number | null = null;
  const listeners = new Set<(snapshot: CarSnapshot) => void>();

  function emit(): void {
    const current = snapshot;
    listeners.forEach((listener) => listener(current));
  }

  function commit(partial: Partial<CarSnapshot>): void {
    snapshot = { ...snapshot, ...partial };
    emit();
  }

  function tickSensors(): void {
    if (snapshot.link !== "online") return;
    phase += 1;
    const distanceCm = clamp(
      Math.round(88 + Math.sin(phase / 2.1) * 42 + Math.cos(phase / 3.3) * 14),
      18,
      180,
    );
    const batteryPct = clamp(
      Math.round((76 + Math.sin(phase / 5.5) * 6) * 10) / 10,
      62,
      92,
    );
    const wifiDbm = clamp(
      Math.round(-50 + Math.sin(phase / 2.8) * 12 + Math.cos(phase / 4) * 4),
      -78,
      -38,
    );
    commit({
      distanceCm,
      batteryPct,
      wifiDbm,
      wifiLevel: levelFromDbm(wifiDbm),
      series: {
        distance: pushSample(snapshot.series.distance, distanceCm),
        battery: pushSample(snapshot.series.battery, batteryPct),
        wifi: pushSample(snapshot.series.wifi, wifiDbm),
      },
    });
  }

  function startSensors(): void {
    if (sensorTimer !== null) return;
    sensorTimer = window.setInterval(tickSensors, SENSOR_INTERVAL_MS);
  }

  function applyVector(next: JoystickVector): void {
    if (snapshot.link !== "online") return;
    const x = clampAxis(next.x);
    const y = clampAxis(next.y);
    const magnitude = Math.min(1, Math.hypot(x, y));
    if (magnitude < DEADZONE) {
      vector = { x: 0, y: 0 };
      commit({
        joystick: { x: 0, y: 0 },
        speedMps: 0,
        headingDeg: 0,
        motion: snapshot.motion === "stopped" ? "stopped" : "idle",
      });
      return;
    }
    vector = { x, y };
    const speedMps =
      Math.round(magnitude * PRESET_MAX_MPS[snapshot.preset] * 10) / 10;
    const headingDeg = Math.round((Math.atan2(x, y) * 180) / Math.PI);
    commit({
      joystick: { x, y },
      speedMps,
      headingDeg,
      motion: "driving",
    });
  }

  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    connect() {
      if (snapshot.link === "online") return Promise.resolve();
      if (connectTask) return connectTask;
      commit({ link: "connecting", wifiLevel: 1 });
      connectTask = new Promise((resolve) => {
        window.setTimeout(() => {
          commit({
            link: "online",
            motion: "idle",
            wifiDbm: -48,
            wifiLevel: 3,
          });
          startSensors();
          connectTask = null;
          resolve();
        }, CONNECT_DELAY_MS);
      });
      return connectTask;
    },
    drive(x, y) {
      applyVector({ x, y });
    },
    stop() {
      if (snapshot.link !== "online") return;
      vector = { x: 0, y: 0 };
      commit({
        joystick: { x: 0, y: 0 },
        speedMps: 0,
        headingDeg: 0,
        motion: "stopped",
      });
    },
    setPreset(preset) {
      const magnitude = Math.min(1, Math.hypot(vector.x, vector.y));
      const speedMps =
        snapshot.motion === "driving" && magnitude >= DEADZONE
          ? Math.round(magnitude * PRESET_MAX_MPS[preset] * 10) / 10
          : snapshot.speedMps;
      commit({ preset, speedMps });
    },
    setHorn(on) {
      if (snapshot.link !== "online") return;
      commit({ horn: on });
    },
    setHeadlights(on) {
      if (snapshot.link !== "online") return;
      commit({ headlights: on });
    },
  };
}
