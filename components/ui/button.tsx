import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

const variantClasses = {
  primary: "bg-primary text-primary-foreground shadow-soft-sm hover:opacity-90",
  secondary: "bg-muted text-foreground hover:bg-border",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  destructive: "bg-danger text-danger-foreground hover:opacity-90",
} as const;

const sizeClasses = {
  sm: "h-9 rounded-md px-3 text-xs",
  md: "h-10 rounded-lg px-4 text-sm",
  lg: "h-12 rounded-lg px-6 text-base",
  icon: "h-10 w-10 rounded-full p-0",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner(): ReactNode {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M21 12a9 9 0 0 0-9-9V0c6.627 0 12 5.373 12 12h-3Z"
      />
    </svg>
  );
}
