import { ReactNode } from "react";
import { STRINGS } from "../../constants/strings";
import { NavigationTab } from "../../types/common.types";
import { Header } from "./Header";
import { NavigationTabs } from "./NavigationTabs";

/**
 * Props for the MainLayout shell component.
 */
export interface MainLayoutProps {
  /** The currently selected tab in navigation. */
  activeTab: NavigationTab;
  /** Callback to switch navigation tabs. */
  onSelectTab: (tab: NavigationTab) => void;
  /** Inner content to render within the main container. */
  children: ReactNode;
}

/**
 * Main application layout container providing the header, navigation, content wrapper, and footer.
 *
 * @param props - MainLayoutProps layout configuration.
 * @returns A rendered division structure wrapping the application view.
 */
export function MainLayout({
  activeTab,
  onSelectTab,
  children,
}: MainLayoutProps) {
  return (
    <div className="app-container">
      <Header />
      <NavigationTabs activeTab={activeTab} onSelectTab={onSelectTab} />
      <main className="main-content">{children}</main>
      <footer className="app-footer">
        <p>{STRINGS.APP.FOOTER_TEXT}</p>
      </footer>
    </div>
  );
}
