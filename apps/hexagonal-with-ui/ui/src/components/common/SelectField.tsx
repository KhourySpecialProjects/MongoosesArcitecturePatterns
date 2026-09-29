import { ChangeEvent, SelectHTMLAttributes } from "react";

/**
 * Option format for select fields.
 */
export interface SelectOption {
  /** The option value string. */
  value: string;
  /** The user-facing label for the option. */
  label: string;
}

/**
 * Props for the SelectField component.
 */
export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  /** Descriptive label for the dropdown. */
  label: string;
  /** Unique DOM ID for the select element. */
  id: string;
  /** List of selectable options. */
  options: SelectOption[];
  /** Callback fired when the selected value changes. */
  onChange: (value: string) => void;
  /** Optional placeholder text shown as the first empty option. */
  placeholder?: string;
  /** Optional validation error message. */
  error?: string | null;
}

/**
 * Reusable dropdown select field with label and placeholder option support.
 *
 * @param props - SelectFieldProps dropdown configuration.
 * @returns A rendered form group container element.
 */
export function SelectField({
  label,
  id,
  value,
  options,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  className = "",
  ...rest
}: SelectFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-group ${className}`.trim()}>
      <label htmlFor={id} className="form-label">
        {label}
        {required ? <span style={{ color: "var(--error-color)", marginLeft: 4 }}>*</span> : null}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className="form-select"
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <span style={{ color: "var(--error-color)", fontSize: "0.75rem", marginTop: 4, display: "block" }}>{error}</span> : null}
    </div>
  );
}
