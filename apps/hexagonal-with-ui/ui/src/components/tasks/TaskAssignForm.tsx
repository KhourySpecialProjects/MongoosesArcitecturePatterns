import { FormEvent } from "react";
import { STRINGS } from "../../constants/strings";
import { TaskWithAssignee } from "../../types/task.types";
import { User } from "../../types/user.types";
import { AlertBanner } from "../common/AlertBanner";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { SelectField, SelectOption } from "../common/SelectField";

/**
 * Props for the TaskAssignForm component.
 */
export interface TaskAssignFormProps {
  /** The currently selected task ID. */
  taskId: string;
  /** The currently selected assignee user ID. */
  assigneeId: string;
  /** List of existing tasks available for assignment. */
  tasks: TaskWithAssignee[];
  /** List of registered users available to become assignees. */
  users: User[];
  /** Whether the assignment operation is currently in-flight. */
  isSubmitting: boolean;
  /** Error message if assignment failed, or null. */
  error: string | null;
  /** Success message after assignment, or null. */
  successMessage: string | null;
  /** Task ID change callback. */
  onTaskIdChange: (value: string) => void;
  /** Assignee ID change callback. */
  onAssigneeIdChange: (value: string) => void;
  /** Form submission callback. */
  onSubmit: (e: FormEvent) => Promise<void>;
  /** Clear status messages callback. */
  onReset: () => void;
}

/**
 * Form component enabling assignment of a task to a user.
 *
 * @param props - TaskAssignFormProps configuration.
 * @returns A rendered task assignment card and form.
 */
export function TaskAssignForm({
  taskId,
  assigneeId,
  tasks,
  users,
  isSubmitting,
  error,
  successMessage,
  onTaskIdChange,
  onAssigneeIdChange,
  onSubmit,
  onReset,
}: TaskAssignFormProps) {
  const taskOptions: SelectOption[] = tasks.map((t) => ({
    value: t.id,
    label: `${t.title} [${t.status}]`,
  }));

  const userOptions: SelectOption[] = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.email})`,
  }));

  return (
    <Card title={STRINGS.TASKS.ASSIGN_TITLE}>
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
        <SelectField
          id="task-assign-task"
          label={STRINGS.TASKS.ASSIGN_TASK_SELECT_LABEL}
          placeholder="Select a task to assign..."
          value={taskId}
          options={taskOptions}
          onChange={onTaskIdChange}
          required
          disabled={isSubmitting}
        />
        <SelectField
          id="task-assign-user"
          label={STRINGS.TASKS.ASSIGN_USER_SELECT_LABEL}
          placeholder={STRINGS.USERS.SELECT_USER_PROMPT}
          value={assigneeId}
          options={userOptions}
          onChange={onAssigneeIdChange}
          required
          disabled={isSubmitting}
        />
        <div className="form-actions">
          <Button type="submit" variant="secondary" isLoading={isSubmitting}>
            {STRINGS.TASKS.ASSIGN_SUBMIT_BUTTON}
          </Button>
        </div>
      </form>
    </Card>
  );
}
