import { ChangeEvent, InputHTMLAttributes } from "react";

/**
 * Props for the InputField component.
 */
export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** The descriptive text label for the input. */
  label: string;
  /** Unique ID for accessibility pairing. */
  id: string;
  /** Change event handler returning the raw string value. */
  onChange: (value: string) => void;
  /** Optional error message to display beneath input. */
  error?: string | null;
}

/**
 * Reusable form input component with label, styled input box, and error message rendering.
 *
 * @param props - InputFieldProps configuration.
 * @returns A rendered form group container containing label and input.
 */
export function InputField({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required,
  disabled,
  className = "",
  ...rest
}: InputFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-group ${className}`.trim()}>
      <label htmlFor={id} className="form-label">
        {label}
        {required ? <span style={{ color: "var(--error-color)", marginLeft: 4 }}>*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="form-input"
        {...rest}
      />
      {error ? <span style={{ color: "var(--error-color)", fontSize: "0.75rem", marginTop: 4, display: "block" }}>{error}</span> : null}
    </div>
  );
}
