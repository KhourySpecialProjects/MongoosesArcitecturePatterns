import { Notification } from "../types/notification.types";
import { request } from "./api-client";

/**
 * Fetches all notifications for a specific user ID.
 *
 * @param userId - The UUID of the user whose notifications are requested.
 * @returns A promise resolving to an array of Notification entities.
 */
export async function fetchNotificationsByUserId(userId: string): Promise<Notification[]> {
  return request<Notification[]>(`/notifications/${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}

/**
 * Marks an unread notification as read.
 *
 * @param notificationId - The unique identifier of the notification to mark read.
 * @returns A promise resolving to the updated Notification entity.
 */
export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  return request<Notification>(`/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: "PATCH",
    body: "{}",
  });
}
