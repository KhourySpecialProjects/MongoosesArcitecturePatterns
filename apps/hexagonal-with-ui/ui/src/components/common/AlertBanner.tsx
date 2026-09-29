import { ReactNode } from "react";
import { STRINGS } from "../../constants/strings";

/**
 * Props for the AlertBanner component.
 */
export interface AlertBannerProps {
  /** The alert message type variant. */
  variant?: "success" | "error";
  /** Optional callback to dismiss the alert banner. */
  onDismiss?: () => void;
  /** Content of the alert message. */
  children: ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Reusable alert banner for displaying inline feedback messages such as errors or operation successes.
 *
 * @param props - AlertBannerProps configuration.
 * @returns A rendered alert banner division element.
 */
export function AlertBanner({
  variant = "info" as "success" | "error",
  onDismiss,
  children,
  className = "",
}: AlertBannerProps) {
  return (
    <div className={`alert alert-${variant} ${className}`.trim()} role="alert">
      <div>{children}</div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-outline btn-sm"
          style={{ padding: "0.15rem 0.4rem", marginLeft: "1rem" }}
          aria-label={STRINGS.COMMON.CLOSE}
        >
          &times;
        </button>
      ) : null}
    </div>
  );
}
