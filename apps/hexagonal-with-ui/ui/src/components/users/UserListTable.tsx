import { STRINGS } from "../../constants/strings";
import { User } from "../../types/user.types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";

/**
 * Props for the UserListTable component.
 */
export interface UserListTableProps {
  /** Array of users to display in the table. */
  users: User[];
  /** Whether the users list is loading. */
  isLoading: boolean;
  /** Callback fired when the user clicks to view details for a specific user ID. */
  onSelectUser: (userId: string) => void;
  /** Optional callback fired when the user clicks to view notifications for a specific user ID. */
  onViewNotifications?: (userId: string) => void;
  /** Callback to trigger a data refresh. */
  onRefresh: () => void;
}

/**
 * Table component displaying all registered users with action buttons to inspect user details and notifications.
 *
 * @param props - UserListTableProps configuration.
 * @returns A rendered table component within a card container.
 */
export function UserListTable({
  users,
  isLoading,
  onSelectUser,
  onViewNotifications,
  onRefresh,
}: UserListTableProps) {
  return (
    <Card
      title={STRINGS.USERS.LIST_TITLE}
      actions={
        <Button variant="outline" size="sm" onClick={onRefresh} isLoading={isLoading}>
          {STRINGS.COMMON.REFRESH}
        </Button>
      }
    >
      {isLoading && users.length === 0 ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <EmptyState message={STRINGS.USERS.LIST_EMPTY} />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{STRINGS.COMMON.ID}</th>
                <th>{STRINGS.USERS.DETAIL_NAME}</th>
                <th>{STRINGS.USERS.DETAIL_EMAIL}</th>
                <th>{STRINGS.COMMON.CREATED_AT}</th>
                <th>{STRINGS.COMMON.ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="mono">{user.id}</td>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectUser(user.id)}
                      >
                        {STRINGS.USERS.VIEW_USER_BUTTON}
                      </Button>
                      {onViewNotifications ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewNotifications(user.id)}
                        >
                          {STRINGS.USERS.VIEW_NOTIFICATIONS_BUTTON}
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
