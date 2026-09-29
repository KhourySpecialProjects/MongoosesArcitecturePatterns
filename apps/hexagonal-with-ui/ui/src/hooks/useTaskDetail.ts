import { FormEvent, useState } from "react";
import { STRINGS } from "../constants/strings";
import { fetchTaskById } from "../services/task.service";
import { TaskWithAssignee } from "../types/task.types";

/**
 * Return interface for the useTaskDetail custom hook.
 */
export interface UseTaskDetailResult {
  /** Current task ID search input. */
  searchId: string;
  /** The loaded task entity with assignee details, or null. */
  task: TaskWithAssignee | null;
  /** Whether the task details request is loading. */
  isLoading: boolean;
  /** Error message if loading failed, or null. */
  error: string | null;
  /** Update the search task ID input. */
  setSearchId: (id: string) => void;
  /** Trigger lookup from a form submit event or manual call. */
  handleLookup: (e?: FormEvent) => Promise<void>;
  /** Programmatically load a task by its ID. */
  loadTaskById: (id: string) => Promise<void>;
  /** Clear loaded task detail state. */
  clearTask: () => void;
}

/**
 * Custom hook to manage fetching and inspecting details of a single task by ID.
 *
 * @returns An object managing single task lookup state and actions.
 */
export function useTaskDetail(): UseTaskDetailResult {
  const [searchId, setSearchId] = useState<string>("");
  const [task, setTask] = useState<TaskWithAssignee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTaskById = async (id: string) => {
    const trimmedId = id.trim();
    if (!trimmedId) {
      setError(STRINGS.ERRORS.TASK_ID_REQUIRED);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTaskById(trimmedId);
      setTask(data);
      setSearchId(trimmedId);
    } catch (err) {
      setTask(null);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    await loadTaskById(searchId);
  };

  const clearTask = () => {
    setTask(null);
    setError(null);
    setSearchId("");
  };

  return {
    searchId,
    task,
    isLoading,
    error,
    setSearchId,
    handleLookup,
    loadTaskById,
    clearTask,
  };
}
