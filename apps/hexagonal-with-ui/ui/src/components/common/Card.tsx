import { ReactNode } from "react";

/**
 * Props for the Card container component.
 */
export interface CardProps {
  /** Optional title displayed at the top of the card. */
  title?: string;
  /** Optional subtitle displayed below the title. */
  subtitle?: string;
  /** Optional action elements to render in the card header. */
  actions?: ReactNode;
  /** Body content of the card. */
  children: ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Reusable card container component providing consistent background, border, header, and content padding.
 *
 * @param props - CardProps container configuration.
 * @returns A rendered section element styled as a card.
 */
export function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: CardProps) {
  const hasHeader = Boolean(title || subtitle || actions);

  return (
    <section className={`card ${className}`.trim()}>
      {hasHeader ? (
        <header className="card-header">
          <div>
            {title ? <h3 className="card-title">{title}</h3> : null}
            {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
