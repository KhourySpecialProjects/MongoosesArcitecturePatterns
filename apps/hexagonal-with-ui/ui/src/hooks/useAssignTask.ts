import { FormEvent, useState } from "react";
import { STRINGS } from "../constants/strings";
import { assignTask } from "../services/task.service";
import { TaskWithAssignee } from "../types/task.types";

/**
 * Configuration options for the useAssignTask hook.
 */
export interface UseAssignTaskOptions {
  /** Optional callback invoked after a task is successfully assigned. */
  onSuccess?: (updatedTask: TaskWithAssignee) => void;
}

/**
 * Return interface for the useAssignTask custom hook.
 */
export interface UseAssignTaskResult {
  /** Current ID of the task to be assigned. */
  taskId: string;
  /** Current user ID of the selected assignee. */
  assigneeId: string;
  /** Whether the assignment request is in-flight. */
  isSubmitting: boolean;
  /** Error message if assignment failed, or null. */
  error: string | null;
  /** Success message after successful assignment, or null. */
  successMessage: string | null;
  /** Handler to update task ID state. */
  setTaskId: (taskId: string) => void;
  /** Handler to update assignee ID state. */
  setAssigneeId: (assigneeId: string) => void;
  /** Form submission handler to assign the task. */
  handleAssign: (e?: FormEvent) => Promise<void>;
  /** Clear form values, messages, and errors. */
  resetForm: () => void;
}

/**
 * Custom hook to manage assigning a task to a user.
 *
 * @param options - Configuration options including post-assignment callbacks.
 * @returns An object providing task assignment state and submission actions.
 */
export function useAssignTask(options: UseAssignTaskOptions = {}): UseAssignTaskResult {
  const [taskId, setTaskId] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTaskId("");
    setAssigneeId("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleAssign = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError(null);
    setSuccessMessage(null);

    const trimmedTaskId = taskId.trim();
    const trimmedAssigneeId = assigneeId.trim();

    if (!trimmedTaskId) {
      setError(STRINGS.ERRORS.TASK_ID_REQUIRED);
      return;
    }

    if (!trimmedAssigneeId) {
      setError(STRINGS.ERRORS.ASSIGNEE_REQUIRED);
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedTask = await assignTask(trimmedTaskId, {
        assigneeId: trimmedAssigneeId,
      });

      setSuccessMessage(STRINGS.TASKS.ASSIGN_SUCCESS);
      if (options.onSuccess) {
        options.onSuccess(updatedTask);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    taskId,
    assigneeId,
    isSubmitting,
    error,
    successMessage,
    setTaskId,
    setAssigneeId,
    handleAssign,
    resetForm,
  };
}
