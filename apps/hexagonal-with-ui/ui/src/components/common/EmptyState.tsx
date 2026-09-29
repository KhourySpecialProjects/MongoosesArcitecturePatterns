/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps {
  /** The message describing the empty condition. */
  message: string;
}

/**
 * Reusable placeholder rendered when data lists or searches return empty results.
 *
 * @param props - EmptyStateProps configuration.
 * @returns A rendered division element with empty state text.
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
}
