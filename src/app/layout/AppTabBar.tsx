import type { AppTab } from "../navigation";
import { APP_TABS } from "../navigation";

type Props = {
  tab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

export function AppTabBar({ tab, onTabChange }: Props) {
  return (
    <nav className="tabs" aria-label="Secciones">
      {APP_TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tab ${tab === t.id ? "active" : ""}`}
          onClick={() => onTabChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
