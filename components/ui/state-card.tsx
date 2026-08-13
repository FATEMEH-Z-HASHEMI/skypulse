import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-card shadow-soft-sm flex flex-col items-center gap-2 rounded-2xl border p-6 text-center",
        className,
      )}
    >
      {Icon && (
        <Icon className="text-muted-foreground h-6 w-6" aria-hidden="true" />
      )}
      <p className="text-foreground text-sm font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-primary mt-1 text-xs font-medium underline-offset-4 hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
