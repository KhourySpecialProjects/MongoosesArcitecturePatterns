import { STRINGS } from "../../constants/strings";

/**
 * Props for the LoadingSpinner component.
 */
export interface LoadingSpinnerProps {
  /** Optional message displayed next to the spinner. */
  message?: string;
}

/**
 * Reusable loading indicator displaying an animated spinner and text.
 *
 * @param props - LoadingSpinnerProps configuration.
 * @returns A rendered loading indicator division.
 */
export function LoadingSpinner({
  message = STRINGS.COMMON.LOADING,
}: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <span className="spinner" />
      <span>{message}</span>
    </div>
  );
}
