import { User } from "./user.types";

/**
 * Domain entity representing a user notification.
 */
export interface Notification {
  /** The unique identifier of the notification. */
  id: string;
  /** The identifier of the recipient user. */
  userId: string;
  /** The content of the notification message. */
  message: string;
  /** Whether the notification has been read by the user. */
  read: boolean;
  /** Timestamp when the notification was created. */
  createdAt: string;
  /** Optional associated user details. */
  user?: User;
}
