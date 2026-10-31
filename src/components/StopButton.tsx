type Props = {
  stopped: boolean;
  onStop: () => void;
};

export function StopButton({ stopped, onStop }: Props) {
  return (
    <button
      type="button"
      className={stopped ? "stop is-stopped" : "stop"}
      onClick={onStop}
    >
      <span className="stop-icon" aria-hidden="true" />
      停止
    </button>
  );
}
