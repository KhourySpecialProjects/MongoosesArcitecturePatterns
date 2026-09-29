import { STRINGS } from "../../constants/strings";
import { Notification } from "../../types/notification.types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

/**
 * Props for the NotificationItem component.
 */
export interface NotificationItemProps {
  /** The notification entity. */
  notification: Notification;
  /** Callback fired when user clicks to mark this notification as read. */
  onMarkAsRead: (notificationId: string) => Promise<void>;
}

/**
 * Component rendering an individual notification card with status badge and mark-as-read action.
 *
 * @param props - NotificationItemProps configuration.
 * @returns A rendered notification item element.
 */
export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const formattedDate = new Date(notification.createdAt).toLocaleString();

  return (
    <article className={`notification-card ${notification.read ? "read" : "unread"}`}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <Badge variant={notification.read ? "neutral" : "info"}>
            {notification.read ? STRINGS.NOTIFICATIONS.STATUS_READ : STRINGS.NOTIFICATIONS.STATUS_UNREAD}
          </Badge>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formattedDate}</span>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{notification.message}</p>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
          <span className="mono">ID: {notification.id}</span>
        </div>
      </div>

      {!notification.read ? (
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
          >
            {STRINGS.NOTIFICATIONS.MARK_AS_READ_BUTTON}
          </Button>
        </div>
      ) : null}
    </article>
  );
}
