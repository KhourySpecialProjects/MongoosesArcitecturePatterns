import { useEffect } from "react";
import { STRINGS } from "../../constants/strings";
import { useNotifications } from "../../hooks/useNotifications";
import { useUsers } from "../../hooks/useUsers";
import { AlertBanner } from "../common/AlertBanner";
import { SectionHeader } from "../common/SectionHeader";
import { NotificationList } from "./NotificationList";
import { NotificationUserSelector } from "./NotificationUserSelector";

/**
 * Props for the NotificationsManager component.
 */
export interface NotificationsManagerProps {
  /** Optional preselected user ID to view notifications for upon mount. */
  initialUserId?: string;
}

/**
 * High-level orchestration component for the User Notifications module.
 *
 * @param props - NotificationsManagerProps configuration.
 * @returns A rendered layout managing user selection and notification feed inspection.
 */
export function NotificationsManager({
  initialUserId,
}: NotificationsManagerProps) {
  const usersHook = useUsers();
  const notifHook = useNotifications();

  useEffect(() => {
    if (initialUserId) {
      notifHook.loadUserNotifications(initialUserId);
    }
  }, [initialUserId, notifHook.loadUserNotifications]);

  return (
    <div>
      <SectionHeader
        title={STRINGS.NOTIFICATIONS.SECTION_TITLE}
        subtitle="Inspect domain notifications dispatched to system users"
      />

      {notifHook.error ? (
        <AlertBanner variant="error" onDismiss={notifHook.clearNotifications}>
          {notifHook.error}
        </AlertBanner>
      ) : null}

      {notifHook.successMessage ? (
        <AlertBanner variant="success">
          {notifHook.successMessage}
        </AlertBanner>
      ) : null}

      <NotificationUserSelector
        userId={notifHook.userId}
        users={usersHook.users}
        isLoading={notifHook.isLoading}
        onUserIdChange={notifHook.setUserId}
        onSubmit={notifHook.handleLoad}
      />

      <NotificationList
        userId={notifHook.userId}
        notifications={notifHook.notifications}
        isLoading={notifHook.isLoading}
        onMarkAsRead={notifHook.handleMarkAsRead}
      />
    </div>
  );
}
