import { FormEvent } from "react";
import { STRINGS } from "../../constants/strings";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { InputField } from "../common/InputField";

/**
 * Props for the UserLookupForm component.
 */
export interface UserLookupFormProps {
  /** The current search user ID input value. */
  searchId: string;
  /** Whether the user lookup is currently loading. */
  isLoading: boolean;
  /** Callback fired when the search ID input changes. */
  onSearchIdChange: (value: string) => void;
  /** Form submission callback. */
  onSubmit: (e: FormEvent) => Promise<void>;
}

/**
 * Form component allowing lookup of a user by UUID.
 *
 * @param props - UserLookupFormProps configuration.
 * @returns A rendered user lookup card and form.
 */
export function UserLookupForm({
  searchId,
  isLoading,
  onSearchIdChange,
  onSubmit,
}: UserLookupFormProps) {
  return (
    <Card title={STRINGS.USERS.LOOKUP_TITLE}>
      <form onSubmit={onSubmit}>
        <InputField
          id="user-lookup-id"
          label={STRINGS.USERS.LOOKUP_ID_LABEL}
          placeholder={STRINGS.USERS.LOOKUP_ID_PLACEHOLDER}
          value={searchId}
          onChange={onSearchIdChange}
          required
          disabled={isLoading}
        />
        <div className="form-actions">
          <Button type="submit" variant="secondary" isLoading={isLoading}>
            {STRINGS.USERS.LOOKUP_BUTTON}
          </Button>
        </div>
      </form>
    </Card>
  );
}
