import { Notification } from "../../entities/notification.entity.js";

/**
 * Data transfer object containing the necessary fields to create and persist a notification.
 */
export interface CreateNotificationDTO {
  /** The ID of the recipient user. */
  userId: string;
  /** The notification message content. */
  message: string;
}

/**
 * Driven port interface defining persistence operations for notification entities.
 */
export interface NotificationRepositoryPort {
  /**
   * Persists a new notification or updates an existing one in the data store.
   *
   * @param notification - The notification DTO to create or full notification entity to upsert.
   * @returns A promise that resolves to the saved notification entity.
   */
  save(notification: CreateNotificationDTO | Notification): Promise<Notification>;

  /**
   * Retrieves all notifications addressed to a specific user, ordered from newest to oldest.
   *
   * @param userId - The unique identifier of the user whose notifications are to be retrieved.
   * @returns A promise that resolves to an array of notification entities belonging to the user.
   */
  findByUserId(userId: string): Promise<Notification[]>;

  /**
   * Retrieves a single notification by its unique identifier.
   *
   * @param id - The unique identifier of the notification.
   * @returns A promise that resolves to the matching notification entity, or null if not found.
   */
  findById(id: string): Promise<Notification | null>;

  /**
   * Updates an existing notification entity in the data store.
   *
   * @param notification - The notification entity containing updated values.
   * @returns A promise that resolves to the updated notification entity.
   */
  update(notification: Notification): Promise<Notification>;
}
