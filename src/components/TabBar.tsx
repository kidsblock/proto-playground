export type RemoteTab = "drive" | "sensors";

type Props = {
  tab: RemoteTab;
  onChange: (tab: RemoteTab) => void;
};

const TABS: { id: RemoteTab; label: string }[] = [
  { id: "drive", label: "驾驶" },
  { id: "sensors", label: "传感器" },
];

export function TabBar({ tab, onChange }: Props) {
  return (
    <nav className="tabbar" aria-label="页面">
      {TABS.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-current={tab === item.id ? "page" : undefined}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
