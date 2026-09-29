import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user.types";
import { fetchUsers } from "../services/user.service";

/**
 * Return interface for the useUsers custom hook.
 */
export interface UseUsersResult {
  /** The list of loaded users. */
  users: User[];
  /** Whether users are currently being fetched. */
  isLoading: boolean;
  /** Error message if user fetching failed, or null. */
  error: string | null;
  /** Function to manually trigger a re-fetch of users. */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to load and manage the full list of registered users.
 *
 * @returns An object containing the users list, loading state, error state, and refetch handler.
 */
export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: loadUsers,
  };
}
