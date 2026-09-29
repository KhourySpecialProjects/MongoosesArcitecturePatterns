import { ReactNode } from "react";

/**
 * Props for the Badge component.
 */
export interface BadgeProps {
  /** The color scheme variant of the badge. */
  variant?: "success" | "error" | "info" | "warning" | "neutral";
  /** Content to display inside the badge. */
  children: ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Reusable badge indicator component for status badges and tags.
 *
 * @param props - BadgeProps configuration.
 * @returns A rendered span element styled as a pill badge.
 */
export function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
