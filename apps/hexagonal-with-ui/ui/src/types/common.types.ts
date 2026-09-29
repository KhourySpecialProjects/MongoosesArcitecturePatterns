/**
 * Generic API error response structure returned by backend endpoints.
 */
export interface ApiErrorResponse {
  /** Error message describing the failure. */
  error: string;
}

/**
 * Navigation tab options for switching between major functional modules.
 */
export type NavigationTab = "users" | "tasks" | "notifications";

/**
 * Status variant for alert notification badges and banners.
 */
export type StatusVariant = "success" | "error" | "info" | "warning";
