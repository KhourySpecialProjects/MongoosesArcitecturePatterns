import { STRINGS } from "../../constants/strings";
import { NavigationTab } from "../../types/common.types";

/**
 * Props for the NavigationTabs component.
 */
export interface NavigationTabsProps {
  /** The currently active tab. */
  activeTab: NavigationTab;
  /** Callback fired when the user selects a different navigation tab. */
  onSelectTab: (tab: NavigationTab) => void;
}

/**
 * Navigation tabs bar enabling switching between Users, Tasks, and Notifications domains.
 *
 * @param props - NavigationTabsProps configuration.
 * @returns A rendered navigation bar element.
 */
export function NavigationTabs({
  activeTab,
  onSelectTab,
}: NavigationTabsProps) {
  return (
    <nav className="nav-bar" aria-label="Main Navigation">
      <div className="nav-list">
        <button
          type="button"
          className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => onSelectTab("users")}
        >
          {STRINGS.APP.NAV_USERS}
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => onSelectTab("tasks")}
        >
          {STRINGS.APP.NAV_TASKS}
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => onSelectTab("notifications")}
        >
          {STRINGS.APP.NAV_NOTIFICATIONS}
        </button>
      </div>
    </nav>
  );
}
