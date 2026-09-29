import { FormEvent, useState } from "react";
import { STRINGS } from "../constants/strings";
import { fetchUserById } from "../services/user.service";
import { User } from "../types/user.types";

/**
 * Return interface for the useUserDetail custom hook.
 */
export interface UseUserDetailResult {
  /** The current search input for user ID. */
  searchId: string;
  /** The loaded user entity or null if not loaded. */
  user: User | null;
  /** Whether the user lookup request is loading. */
  isLoading: boolean;
  /** Error message encountered during lookup, or null. */
  error: string | null;
  /** Update the search ID input state. */
  setSearchId: (id: string) => void;
  /** Lookup user by ID from a form event or manual trigger. */
  handleLookup: (e?: FormEvent) => Promise<void>;
  /** Programmatically fetch and load a specific user by their ID. */
  loadUserById: (id: string) => Promise<void>;
  /** Clear the loaded user detail and errors. */
  clearUser: () => void;
}

/**
 * Custom hook to manage fetching and inspecting details of a single user by their ID.
 *
 * @returns An object providing user lookup state and inspection actions.
 */
export function useUserDetail(): UseUserDetailResult {
  const [searchId, setSearchId] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserById = async (id: string) => {
    const trimmedId = id.trim();
    if (!trimmedId) {
      setError(STRINGS.ERRORS.USER_ID_REQUIRED);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUserById(trimmedId);
      setUser(data);
      setSearchId(trimmedId);
    } catch (err) {
      setUser(null);
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
    await loadUserById(searchId);
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
    setSearchId("");
  };

  return {
    searchId,
    user,
    isLoading,
    error,
    setSearchId,
    handleLookup,
    loadUserById,
    clearUser,
  };
}
