import { STRINGS } from "../../constants/strings";
import { User } from "../../types/user.types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

/**
 * Props for the UserDetailCard component.
 */
export interface UserDetailCardProps {
  /** The user entity details to display. */
  user: User;
  /** Callback fired when user clicks Close / Clear. */
  onClose: () => void;
  /** Optional callback to navigate to notifications for this user. */
  onViewNotifications?: (userId: string) => void;
}

/**
 * Card component displaying the detailed information of a selected user.
 *
 * @param props - UserDetailCardProps configuration.
 * @returns A rendered user details card element.
 */
export function UserDetailCard({
  user,
  onClose,
  onViewNotifications,
}: UserDetailCardProps) {
  const formattedDate = new Date(user.createdAt).toLocaleString();

  return (
    <Card
      title={STRINGS.USERS.DETAIL_TITLE}
      actions={
        <Button variant="outline" size="sm" onClick={onClose}>
          {STRINGS.COMMON.CLOSE}
        </Button>
      }
    >
      <div className="detail-row">
        <span className="detail-label">{STRINGS.USERS.DETAIL_ID}:</span>
        <span className="detail-value mono">{user.id}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.USERS.DETAIL_NAME}:</span>
        <span className="detail-value">{user.name}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.USERS.DETAIL_EMAIL}:</span>
        <span className="detail-value">{user.email}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{STRINGS.USERS.DETAIL_CREATED}:</span>
        <span className="detail-value">{formattedDate}</span>
      </div>
      {onViewNotifications ? (
        <div style={{ marginTop: "1rem" }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewNotifications(user.id)}
          >
            {STRINGS.USERS.VIEW_NOTIFICATIONS_BUTTON}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
