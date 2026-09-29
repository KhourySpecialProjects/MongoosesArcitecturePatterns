import { FormEvent, useCallback, useState } from "react";
import { STRINGS } from "../constants/strings";
import { fetchNotificationsByUserId, markNotificationAsRead } from "../services/notification.service";
import { Notification } from "../types/notification.types";

/**
 * Return interface for the useNotifications custom hook.
 */
export interface UseNotificationsResult {
  /** The currently targeted user ID. */
  userId: string;
  /** List of notifications for the active user. */
  notifications: Notification[];
  /** Whether notifications are currently loading. */
  isLoading: boolean;
  /** Error message if loading or updating failed, or null. */
  error: string | null;
  /** Success status message if notification action succeeded, or null. */
  successMessage: string | null;
  /** Update the selected user ID. */
  setUserId: (id: string) => void;
  /** Load notifications for the current userId via form submission or manual trigger. */
  handleLoad: (e?: FormEvent) => Promise<void>;
  /** Programmatically fetch notifications for a specific user ID. */
  loadUserNotifications: (id: string) => Promise<void>;
  /** Mark a specific notification as read and update state. */
  handleMarkAsRead: (notificationId: string) => Promise<void>;
  /** Clear notifications list and error states. */
  clearNotifications: () => void;
}

/**
 * Custom hook to manage fetching and updating user notifications.
 *
 * @returns An object providing notification feed state and read status mutation actions.
 */
export function useNotifications(): UseNotificationsResult {
  const [userId, setUserId] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadUserNotifications = useCallback(async (id: string) => {
    const trimmedId = id.trim();
    if (!trimmedId) {
      setError(STRINGS.ERRORS.USER_ID_REQUIRED);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await fetchNotificationsByUserId(trimmedId);
      setNotifications(data);
      setUserId(trimmedId);
    } catch (err) {
      setNotifications([]);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoad = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    await loadUserNotifications(userId);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const updated = await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((item) => (item.id === updated.id ? { ...item, read: true } : item))
      );
      setSuccessMessage(STRINGS.NOTIFICATIONS.MARK_AS_READ_SUCCESS);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setError(null);
    setSuccessMessage(null);
    setUserId("");
  };

  return {
    userId,
    notifications,
    isLoading,
    error,
    successMessage,
    setUserId,
    handleLoad,
    loadUserNotifications,
    handleMarkAsRead,
    clearNotifications,
  };
}
