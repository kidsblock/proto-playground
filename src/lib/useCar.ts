import { useSyncExternalStore } from "react";
import type { CarClient, CarSnapshot } from "./mockCar";

export function useCarSnapshot(car: CarClient): CarSnapshot {
  return useSyncExternalStore(car.subscribe, car.getSnapshot, car.getSnapshot);
}
