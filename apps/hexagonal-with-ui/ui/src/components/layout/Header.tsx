import { STRINGS } from "../../constants/strings";

/**
 * Main application header bar displaying the TaskFlow brand and hexagonal architecture badge.
 *
 * @returns A rendered header element.
 */
export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div>
          <h1 className="app-title">{STRINGS.APP.TITLE}</h1>
          <p className="app-subtitle">{STRINGS.APP.SUBTITLE}</p>
        </div>
        <span className="badge-tag">Hexagonal Ports &amp; Adapters</span>
      </div>
    </header>
  );
}
