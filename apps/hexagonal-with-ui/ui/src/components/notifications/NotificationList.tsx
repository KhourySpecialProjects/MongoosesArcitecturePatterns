import { STRINGS } from "../../constants/strings";
import { Notification } from "../../types/notification.types";
import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { NotificationItem } from "./NotificationItem";

/**
 * Props for the NotificationList component.
 */
export interface NotificationListProps {
  /** Active user ID whose notifications are being displayed. */
  userId: string;
  /** Array of notifications to display. */
  notifications: Notification[];
  /** Whether notifications are loading. */
  isLoading: boolean;
  /** Callback fired to mark a notification as read. */
  onMarkAsRead: (notificationId: string) => Promise<void>;
}

/**
 * Component displaying the feed of notifications for a selected user.
 *
 * @param props - NotificationListProps configuration.
 * @returns A rendered notifications list container element.
 */
export function NotificationList({
  userId,
  notifications,
  isLoading,
  onMarkAsRead,
}: NotificationListProps) {
  const cardTitle = userId
    ? `${STRINGS.NOTIFICATIONS.NOTIFICATION_FOR_USER} (${userId})`
    : STRINGS.NOTIFICATIONS.LIST_TITLE;

  return (
    <Card title={cardTitle}>
      {!userId ? (
        <EmptyState message={STRINGS.NOTIFICATIONS.SELECT_PROMPT} />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState message={STRINGS.NOTIFICATIONS.LIST_EMPTY} />
      ) : (
        <div>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
