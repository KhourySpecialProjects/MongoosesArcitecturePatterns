import { ChangeEvent, TextareaHTMLAttributes } from "react";

/**
 * Props for the TextAreaField component.
 */
export interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  /** The text label for the text area. */
  label: string;
  /** Unique ID for DOM element identification. */
  id: string;
  /** Change event handler returning updated text. */
  onChange: (value: string) => void;
  /** Optional validation error message to display. */
  error?: string | null;
}

/**
 * Reusable multi-line text input field with associated label and error feedback.
 *
 * @param props - TextAreaFieldProps configuring text area behavior.
 * @returns A rendered form group container element.
 */
export function TextAreaField({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  rows = 3,
  disabled,
  className = "",
  ...rest
}: TextAreaFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-group ${className}`.trim()}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="form-textarea"
        {...rest}
      />
      {error ? <span style={{ color: "var(--error-color)", fontSize: "0.75rem", marginTop: 4, display: "block" }}>{error}</span> : null}
    </div>
  );
}
