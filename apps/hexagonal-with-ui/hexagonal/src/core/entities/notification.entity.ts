import { User } from "./user.entity.js";

/**
 * Represents a notification record dispatched to a user regarding domain events or updates.
 */
export interface Notification {
  /** The unique identifier of the notification. */
  id: string;
  /** The unique identifier of the recipient user. */
  userId: string;
  /** The text content of the notification message. */
  message: string;
  /** Indicates whether the notification has been read by the user. */
  read: boolean;
  /** The timestamp when the notification was created. */
  createdAt: Date;
  /** Optional associated user entity details. */
  user?: User;
}
