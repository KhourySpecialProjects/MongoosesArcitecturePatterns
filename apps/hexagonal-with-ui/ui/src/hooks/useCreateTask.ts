import { FormEvent, useState } from "react";
import { STRINGS } from "../constants/strings";
import { createTask } from "../services/task.service";
import { TaskWithAssignee } from "../types/task.types";

/**
 * Configuration options for the useCreateTask hook.
 */
export interface UseCreateTaskOptions {
  /** Optional callback invoked after a task is successfully created. */
  onSuccess?: (task: TaskWithAssignee) => void;
}

/**
 * Return interface for the useCreateTask custom hook.
 */
export interface UseCreateTaskResult {
  /** Current task title value. */
  title: string;
  /** Current task description value. */
  description: string;
  /** Currently selected assignee ID or empty string. */
  assigneeId: string;
  /** Whether the task creation request is in-flight. */
  isSubmitting: boolean;
  /** Error message if creation failed, or null. */
  error: string | null;
  /** Success message after successful creation, or null. */
  successMessage: string | null;
  /** Handler to update title state. */
  setTitle: (title: string) => void;
  /** Handler to update description state. */
  setDescription: (description: string) => void;
  /** Handler to update assignee ID state. */
  setAssigneeId: (assigneeId: string) => void;
  /** Form submit handler. */
  handleSubmit: (e: FormEvent) => Promise<void>;
  /** Clears all form fields, errors, and messages. */
  resetForm: () => void;
}

/**
 * Custom hook managing task creation form state, validation, and submission.
 *
 * @param options - Configuration options including post-creation callbacks.
 * @returns An object providing form state and submission actions for new tasks.
 */
export function useCreateTask(options: UseCreateTaskOptions = {}): UseCreateTaskResult {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError(STRINGS.ERRORS.TASK_TITLE_REQUIRED);
      return;
    }

    setIsSubmitting(true);
    try {
      const createdTask = await createTask({
        title: trimmedTitle,
        description: description.trim() || undefined,
        assigneeId: assigneeId.trim() || undefined,
      });

      setTitle("");
      setDescription("");
      setAssigneeId("");
      setSuccessMessage(STRINGS.TASKS.CREATE_SUCCESS);

      if (options.onSuccess) {
        options.onSuccess(createdTask);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    description,
    assigneeId,
    isSubmitting,
    error,
    successMessage,
    setTitle,
    setDescription,
    setAssigneeId,
    handleSubmit,
    resetForm,
  };
}
