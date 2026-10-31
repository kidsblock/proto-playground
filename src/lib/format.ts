import type { LinkState, MotionState } from "./mockCar";

export function motionLabel(motion: MotionState): string {
  switch (motion) {
    case "driving":
      return "行驶中";
    case "stopped":
      return "已停止";
    case "idle":
      return "待命";
  }
}

export function headingCaption(deg: number, moving: boolean): string {
  if (!moving) return "居中";
  const abs = Math.abs(deg);
  if (abs >= 150) return "后退";
  if (abs <= 20) return "前进";
  return deg > 0 ? "右转" : "左转";
}

export function wifiText(link: LinkState, level: 0 | 1 | 2 | 3): string {
  if (link === "offline") return "未连接";
  if (link === "connecting") return "连接中";
  if (level >= 3) return "良好";
  if (level === 2) return "一般";
  return "较弱";
}

export function wifiTone(
  link: LinkState,
  level: number,
): "muted" | "warn" | "good" {
  if (link === "offline") return "muted";
  if (link === "connecting") return "warn";
  if (level >= 2) return "good";
  return "warn";
}

export const PRESET_LABEL = {
  slow: "慢速",
  normal: "正常",
  fast: "快速",
} as const;
