"use client";

import { useId, type ComponentProps, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<ComponentProps<"input">, "id"> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  id?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  className,
  label,
  error,
  helperText,
  icon,
  id,
  ref,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-foreground mb-1.5 block text-sm font-medium"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-3 flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            "border-border bg-card text-foreground placeholder:text-muted-foreground h-10 w-full rounded-lg border px-3 text-sm transition-colors focus-visible:outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2",
            error &&
              "border-danger focus-visible:border-danger focus-visible:ring-danger/30",
            icon && "ps-9",
            className,
          )}
          {...props}
        />
      </div>

      {error ? (
        <p id={errorId} className="text-danger mt-1.5 text-xs">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-muted-foreground mt-1.5 text-xs">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
