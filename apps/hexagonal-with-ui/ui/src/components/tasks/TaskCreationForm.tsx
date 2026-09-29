import { FormEvent } from "react";
import { STRINGS } from "../../constants/strings";
import { User } from "../../types/user.types";
import { AlertBanner } from "../common/AlertBanner";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { InputField } from "../common/InputField";
import { SelectField, SelectOption } from "../common/SelectField";
import { TextAreaField } from "../common/TextAreaField";

/**
 * Props for the TaskCreationForm component.
 */
export interface TaskCreationFormProps {
  /** Current task title input. */
  title: string;
  /** Current task description input. */
  description: string;
  /** Currently selected assignee user ID. */
  assigneeId: string;
  /** List of registered users available for assignment. */
  users: User[];
  /** Whether the task creation is in-flight. */
  isSubmitting: boolean;
  /** Error message if creation failed, or null. */
  error: string | null;
  /** Success message after creation, or null. */
  successMessage: string | null;
  /** Title change handler. */
  onTitleChange: (value: string) => void;
  /** Description change handler. */
  onDescriptionChange: (value: string) => void;
  /** Assignee ID change handler. */
  onAssigneeIdChange: (value: string) => void;
  /** Form submission handler. */
  onSubmit: (e: FormEvent) => Promise<void>;
  /** Clear messages handler. */
  onReset: () => void;
}

/**
 * Form component enabling creation of a new task with optional assignee selection.
 *
 * @param props - TaskCreationFormProps configuration.
 * @returns A rendered task creation card and form.
 */
export function TaskCreationForm({
  title,
  description,
  assigneeId,
  users,
  isSubmitting,
  error,
  successMessage,
  onTitleChange,
  onDescriptionChange,
  onAssigneeIdChange,
  onSubmit,
  onReset,
}: TaskCreationFormProps) {
  const userOptions: SelectOption[] = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.email})`,
  }));

  return (
    <Card title={STRINGS.TASKS.CREATE_TITLE}>
      {error ? (
        <AlertBanner variant="error" onDismiss={onReset}>
          {error}
        </AlertBanner>
      ) : null}
      {successMessage ? (
        <AlertBanner variant="success" onDismiss={onReset}>
          {successMessage}
        </AlertBanner>
      ) : null}
      <form onSubmit={onSubmit}>
        <InputField
          id="task-create-title"
          label={STRINGS.TASKS.CREATE_TITLE_LABEL}
          placeholder={STRINGS.TASKS.CREATE_TITLE_PLACEHOLDER}
          value={title}
          onChange={onTitleChange}
          required
          disabled={isSubmitting}
        />
        <TextAreaField
          id="task-create-desc"
          label={STRINGS.TASKS.CREATE_DESC_LABEL}
          placeholder={STRINGS.TASKS.CREATE_DESC_PLACEHOLDER}
          value={description}
          onChange={onDescriptionChange}
          disabled={isSubmitting}
        />
        <SelectField
          id="task-create-assignee"
          label={STRINGS.TASKS.CREATE_ASSIGNEE_LABEL}
          placeholder={STRINGS.USERS.SELECT_USER_PROMPT}
          value={assigneeId}
          options={userOptions}
          onChange={onAssigneeIdChange}
          disabled={isSubmitting}
        />
        <div className="form-actions">
          <Button type="submit" isLoading={isSubmitting}>
            {STRINGS.TASKS.CREATE_SUBMIT_BUTTON}
          </Button>
        </div>
      </form>
    </Card>
  );
}
