import { ReactNode } from "react";

/**
 * Props for the SectionHeader component.
 */
export interface SectionHeaderProps {
  /** The primary heading text of the section. */
  title: string;
  /** Optional secondary subtitle or context text. */
  subtitle?: string;
  /** Optional header actions such as buttons. */
  actions?: ReactNode;
}

/**
 * Reusable section heading component with title, subtitle, and action controls.
 *
 * @param props - SectionHeaderProps configuration.
 * @returns A rendered header element for major dashboard sections.
 */
export function SectionHeader({
  title,
  subtitle,
  actions,
}: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-main)" }}>{title}</h2>
        {subtitle ? <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{subtitle}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
