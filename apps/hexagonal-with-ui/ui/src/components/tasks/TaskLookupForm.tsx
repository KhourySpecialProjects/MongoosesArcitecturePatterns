import { FormEvent } from "react";
import { STRINGS } from "../../constants/strings";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { InputField } from "../common/InputField";

/**
 * Props for the TaskLookupForm component.
 */
export interface TaskLookupFormProps {
  /** Current task ID search input. */
  searchId: string;
  /** Whether the lookup request is loading. */
  isLoading: boolean;
  /** Search ID input change handler. */
  onSearchIdChange: (value: string) => void;
  /** Form submission handler. */
  onSubmit: (e: FormEvent) => Promise<void>;
}

/**
 * Form component allowing lookup of a task by UUID.
 *
 * @param props - TaskLookupFormProps configuration.
 * @returns A rendered task lookup card and form.
 */
export function TaskLookupForm({
  searchId,
  isLoading,
  onSearchIdChange,
  onSubmit,
}: TaskLookupFormProps) {
  return (
    <Card title={STRINGS.TASKS.LOOKUP_TITLE}>
      <form onSubmit={onSubmit}>
        <InputField
          id="task-lookup-id"
          label={STRINGS.TASKS.LOOKUP_ID_LABEL}
          placeholder={STRINGS.TASKS.LOOKUP_ID_PLACEHOLDER}
          value={searchId}
          onChange={onSearchIdChange}
          required
          disabled={isLoading}
        />
        <div className="form-actions">
          <Button type="submit" variant="secondary" isLoading={isLoading}>
            {STRINGS.TASKS.LOOKUP_BUTTON}
          </Button>
        </div>
      </form>
    </Card>
  );
}
