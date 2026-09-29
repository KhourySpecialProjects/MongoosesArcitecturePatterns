import { FormEvent } from "react";
import { STRINGS } from "../../constants/strings";
import { AlertBanner } from "../common/AlertBanner";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { InputField } from "../common/InputField";

/**
 * Props for the UserRegistrationForm component.
 */
export interface UserRegistrationFormProps {
  /** The current name input value. */
  name: string;
  /** The current email input value. */
  email: string;
  /** Whether the registration request is currently submitting. */
  isSubmitting: boolean;
  /** Optional error message to display. */
  error: string | null;
  /** Optional success message to display. */
  successMessage: string | null;
  /** Callback fired when the name value changes. */
  onNameChange: (value: string) => void;
  /** Callback fired when the email value changes. */
  onEmailChange: (value: string) => void;
  /** Form submission callback. */
  onSubmit: (e: FormEvent) => Promise<void>;
  /** Callback to clear status messages. */
  onReset: () => void;
}

/**
 * Form component allowing registration of a new user account.
 *
 * @param props - UserRegistrationFormProps containing state and event handlers.
 * @returns A rendered user registration card and form.
 */
export function UserRegistrationForm({
  name,
  email,
  isSubmitting,
  error,
  successMessage,
  onNameChange,
  onEmailChange,
  onSubmit,
  onReset,
}: UserRegistrationFormProps) {
  return (
    <Card title={STRINGS.USERS.REGISTER_TITLE}>
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
          id="user-reg-name"
          label={STRINGS.USERS.REGISTER_NAME_LABEL}
          placeholder={STRINGS.USERS.REGISTER_NAME_PLACEHOLDER}
          value={name}
          onChange={onNameChange}
          required
          disabled={isSubmitting}
        />
        <InputField
          id="user-reg-email"
          type="email"
          label={STRINGS.USERS.REGISTER_EMAIL_LABEL}
          placeholder={STRINGS.USERS.REGISTER_EMAIL_PLACEHOLDER}
          value={email}
          onChange={onEmailChange}
          required
          disabled={isSubmitting}
        />
        <div className="form-actions">
          <Button type="submit" isLoading={isSubmitting}>
            {STRINGS.USERS.REGISTER_SUBMIT_BUTTON}
          </Button>
        </div>
      </form>
    </Card>
  );
}
