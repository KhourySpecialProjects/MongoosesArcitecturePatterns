import { FormEvent, useState } from "react";
import { STRINGS } from "../constants/strings";
import { registerUser } from "../services/user.service";
import { User } from "../types/user.types";

/**
 * Configuration options for the useCreateUser hook.
 */
export interface UseCreateUserOptions {
  /** Optional callback invoked after a user is successfully registered. */
  onSuccess?: (user: User) => void;
}

/**
 * Return interface for the useCreateUser custom hook.
 */
export interface UseCreateUserResult {
  /** Current name input value. */
  name: string;
  /** Current email input value. */
  email: string;
  /** Whether the user creation request is in-flight. */
  isSubmitting: boolean;
  /** Error message from validation or API failure, or null. */
  error: string | null;
  /** Success message upon successful registration, or null. */
  successMessage: string | null;
  /** Handler to update the name field value. */
  setName: (name: string) => void;
  /** Handler to update the email field value. */
  setEmail: (email: string) => void;
  /** Form submission event handler. */
  handleSubmit: (e: FormEvent) => Promise<void>;
  /** Clears any status or error messages and form inputs. */
  resetForm: () => void;
}

/**
 * Custom hook to manage user registration form interaction, validation, and submission logic.
 *
 * @param options - Configuration options including post-success callbacks.
 * @returns An object managing user creation form state and actions.
 */
export function useCreateUser(options: UseCreateUserOptions = {}): UseCreateUserResult {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError(STRINGS.ERRORS.USER_NAME_REQUIRED);
      return;
    }

    if (!trimmedEmail) {
      setError(STRINGS.ERRORS.USER_EMAIL_REQUIRED);
      return;
    }

    setIsSubmitting(true);
    try {
      const createdUser = await registerUser({
        name: trimmedName,
        email: trimmedEmail,
      });
      setName("");
      setEmail("");
      setSuccessMessage(STRINGS.USERS.REGISTER_SUCCESS);
      if (options.onSuccess) {
        options.onSuccess(createdUser);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    email,
    isSubmitting,
    error,
    successMessage,
    setName,
    setEmail,
    handleSubmit,
    resetForm,
  };
}
