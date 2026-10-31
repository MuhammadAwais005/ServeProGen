import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "~/lib/cn";

const control =
  "w-full rounded-field border bg-surface px-4 text-body text-text placeholder:text-muted/70 " +
  "transition-[border-color,box-shadow] duration-(--duration-fast) ease-standard " +
  "focus:border-accent-soft focus:shadow-[0_0_0_3px_rgb(255_154_85/0.2)] focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (ids: {
    inputId: string;
    describedBy?: string;
    invalid: boolean;
  }) => ReactNode;
};

/**
 * Label, control, hint and error wired together for screen readers:
 * aria-describedby points at the hint and error, aria-invalid marks errors,
 * and the error text is announced when it appears (role="alert").
 */
function FieldShell({ label, hint, error, required, children }: FieldShellProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-small font-medium text-text">
        {label}
        {required && (
          <span className="text-muted">
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> (required)</span>
          </span>
        )}
      </label>
      {children({ inputId, describedBy, invalid: Boolean(error) })}
      {hint && (
        <p id={hintId} className="text-small text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

type BaseFieldProps = { label: string; hint?: string; error?: string };

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={props.required}>
      {({ inputId, describedBy, invalid }) => (
        <input
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            control,
            "h-12",
            invalid ? "border-danger" : "border-border-strong",
            className,
          )}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  className,
  rows = 5,
  ...props
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={props.required}>
      {({ inputId, describedBy, invalid }) => (
        <textarea
          id={inputId}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            control,
            "py-3",
            invalid ? "border-danger" : "border-border-strong",
            className,
          )}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  className,
  children,
  ...props
}: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={props.required}>
      {({ inputId, describedBy, invalid }) => (
        <select
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            control,
            "h-12",
            invalid ? "border-danger" : "border-border-strong",
            className,
          )}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
