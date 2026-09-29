import { TaskAssignedEvent } from "../../entities/events.js";
import { Notification } from "../../entities/notification.entity.js";

/**
 * Driving (primary) port interface exposing use cases related to user notifications.
 */
export interface NotificationUseCasePort {
  /**
   * Retrieves all notifications sent to a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of notifications for the user.
   * @throws {@link NotFoundError} If the user does not exist.
   */
  listUserNotifications(userId: string): Promise<Notification[]>;

  /**
   * Marks a specific notification as read.
   *
   * @param notificationId - The unique identifier of the notification to mark as read.
   * @returns A promise that resolves to the updated notification.
   * @throws {@link NotFoundError} If the notification does not exist.
   */
  markAsRead(notificationId: string): Promise<Notification>;

  /**
   * Handles a {@link TaskAssignedEvent} by generating a notification for the assigned user.
   *
   * @param event - The task assignment domain event details.
   * @returns A promise that resolves when the notification has been handled and saved.
   */
  handleTaskAssigned(event: TaskAssignedEvent): Promise<void>;
}
