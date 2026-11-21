// Import the React types for button properties.
import type { ButtonHTMLAttributes, ReactNode } from "react";

// The looks a button can have.
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

// The Tailwind classes for each look.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-gray-600 hover:bg-gray-100",
};

// A reusable button used everywhere. It shows "Please wait" and disables itself while loading.
export default function Button({
  variant = "primary",
  isLoading = false,
  children,
  disabled,
  className = "",
  ...otherProps
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      {...otherProps}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
