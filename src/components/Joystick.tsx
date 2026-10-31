import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

type Props = {
  x: number;
  y: number;
  onDrive: (x: number, y: number) => void;
};

type Vector = { x: number; y: number };

function vectorFrom(event: PointerEvent<HTMLDivElement>): Vector {
  const rect = event.currentTarget.getBoundingClientRect();
  const radius = rect.width / 2;
  let dx = event.clientX - (rect.left + radius);
  let dy = event.clientY - (rect.top + radius);
  const dist = Math.hypot(dx, dy);
  if (dist > radius && dist > 0) {
    dx = (dx / dist) * radius;
    dy = (dy / dist) * radius;
  }
  if (radius === 0) return { x: 0, y: 0 };
  return { x: dx / radius, y: -dy / radius };
}

export function Joystick({ x, y, onDrive }: Props) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [drag, setDrag] = useState<Vector | null>(null);
  const shown = drag ?? { x, y };

  useLayoutEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;
    const measure = () => {
      setTravel(Math.max(0, (base.clientWidth - knob.clientWidth) / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(base);
    return () => observer.disconnect();
  }, []);

  function update(event: PointerEvent<HTMLDivElement>) {
    const next = vectorFrom(event);
    setDrag(next);
    onDrive(next.x, next.y);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    update(event);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    update(event);
  }

  function end(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDrag(null);
  }

  const knobStyle: CSSProperties = {
    transform: `translate(calc(-50% + ${shown.x * travel}px), calc(-50% + ${-shown.y * travel}px))`,
  };

  return (
    <div
      ref={baseRef}
      className={drag ? "stick is-dragging" : "stick"}
      role="application"
      tabIndex={0}
      aria-label="转向摇杆。拖动以转向，松手后保持当前位置。"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        const step = 0.2;
        let nx = x;
        let ny = y;
        if (event.key === "ArrowRight") nx = Math.min(1, x + step);
        else if (event.key === "ArrowLeft") nx = Math.max(-1, x - step);
        else if (event.key === "ArrowUp") ny = Math.min(1, y + step);
        else if (event.key === "ArrowDown") ny = Math.max(-1, y - step);
        else return;
        event.preventDefault();
        onDrive(nx, ny);
      }}
    >
      <span className="cardinal n">前</span>
      <span className="cardinal e">右</span>
      <span className="cardinal s">后</span>
      <span className="cardinal w">左</span>
      <span className="stick-origin" />
      <div ref={knobRef} className="knob" style={knobStyle} />
    </div>
  );
}
