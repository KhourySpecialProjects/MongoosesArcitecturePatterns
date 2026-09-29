import { FormEvent } from "react";
import { STRINGS } from "../../constants/strings";
import { User } from "../../types/user.types";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { InputField } from "../common/InputField";
import { SelectField, SelectOption } from "../common/SelectField";

/**
 * Props for the NotificationUserSelector component.
 */
export interface NotificationUserSelectorProps {
  /** The currently targeted user ID. */
  userId: string;
  /** List of registered users available for quick selection. */
  users: User[];
  /** Whether notifications are loading. */
  isLoading: boolean;
  /** Callback fired when user ID is updated. */
  onUserIdChange: (value: string) => void;
  /** Callback to trigger notification fetching. */
  onSubmit: (e: FormEvent) => Promise<void>;
}

/**
 * Component allowing selection of a target user by dropdown or manual UUID input to inspect notifications.
 *
 * @param props - NotificationUserSelectorProps configuration.
 * @returns A rendered user selector card element.
 */
export function NotificationUserSelector({
  userId,
  users,
  isLoading,
  onUserIdChange,
  onSubmit,
}: NotificationUserSelectorProps) {
  const userOptions: SelectOption[] = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.email})`,
  }));

  return (
    <Card title={STRINGS.NOTIFICATIONS.SECTION_TITLE}>
      <form onSubmit={onSubmit}>
        <SelectField
          id="notif-select-user"
          label={STRINGS.NOTIFICATIONS.SELECT_USER_LABEL}
          placeholder={STRINGS.NOTIFICATIONS.SELECT_USER_PLACEHOLDER}
          value={userId}
          options={userOptions}
          onChange={onUserIdChange}
          disabled={isLoading}
        />
        <InputField
          id="notif-manual-id"
          label={STRINGS.NOTIFICATIONS.MANUAL_USER_ID_LABEL}
          placeholder={STRINGS.NOTIFICATIONS.MANUAL_USER_ID_PLACEHOLDER}
          value={userId}
          onChange={onUserIdChange}
          disabled={isLoading}
        />
        <div className="form-actions">
          <Button type="submit" isLoading={isLoading}>
            {STRINGS.NOTIFICATIONS.LOAD_BUTTON}
          </Button>
        </div>
      </form>
    </Card>
  );
}
