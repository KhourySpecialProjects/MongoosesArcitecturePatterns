import { useCallback, useEffect, useState } from "react";
import { fetchTasks } from "../services/task.service";
import { TaskWithAssignee } from "../types/task.types";

/**
 * Return interface for the useTasks custom hook.
 */
export interface UseTasksResult {
  /** List of all loaded tasks with assignee information. */
  tasks: TaskWithAssignee[];
  /** Whether the tasks list is currently being fetched. */
  isLoading: boolean;
  /** Error message if task retrieval failed, or null. */
  error: string | null;
  /** Function to manually re-fetch all tasks. */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to load and manage the list of tasks.
 *
 * @returns An object containing the tasks array, loading status, error status, and refetch handler.
 */
export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: loadTasks,
  };
}
