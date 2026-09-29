import { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Props for the Button component.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual style variant of the button. */
  variant?: "primary" | "secondary" | "outline";
  /** Size variant of the button. */
  size?: "sm" | "md";
  /** Whether the button is in a loading state. */
  isLoading?: boolean;
  /** Content to render inside the button. */
  children: ReactNode;
}

/**
 * Reusable button component providing consistent styles, variants, and loading state.
 *
 * @param props - ButtonProps configuring appearance, behavior, and content.
 * @returns A rendered HTML button element.
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === "sm" ? "btn-sm" : "";
  const combinedClassName = `btn ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, marginRight: 6 }} /> : null}
      {children}
    </button>
  );
}
