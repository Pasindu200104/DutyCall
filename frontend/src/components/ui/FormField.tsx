// Import the React types for inputs.
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// The shared Tailwind classes for every input. A red border is used when there is an error.
function getInputClass(hasError: boolean): string {
  return `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 ${
    hasError ? "border-red-500" : "border-gray-300"
  }`;
}

// A wrapper that puts a label above a field and the error message below it.
function FieldWrapper({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
      {/* The error is linked to the field with aria-describedby so screen readers read it. */}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// A text input with a label and an error message.
export function TextInput({ id, label, error, ...inputProps }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string }) {
  return (
    <FieldWrapper id={id} label={label} error={error}>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={getInputClass(Boolean(error))} {...inputProps} />
    </FieldWrapper>
  );
}

// A multi line text box with a label and an error message.
export function TextArea({ id, label, error, ...textAreaProps }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string; error?: string }) {
  return (
    <FieldWrapper id={id} label={label} error={error}>
      <textarea id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={getInputClass(Boolean(error))} {...textAreaProps} />
    </FieldWrapper>
  );
}

// A drop down list with a label and an error message.
export function SelectInput({ id, label, error, children, ...selectProps }: SelectHTMLAttributes<HTMLSelectElement> & { id: string; label: string; error?: string }) {
  return (
    <FieldWrapper id={id} label={label} error={error}>
      <select id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={getInputClass(Boolean(error))} {...selectProps}>
        {children}
      </select>
    </FieldWrapper>
  );
}
