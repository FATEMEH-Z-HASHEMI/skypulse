import { Skeleton } from "@/components/ui";

export function HeroSkeleton() {
  return (
    <div className="border-border bg-card shadow-soft-md rounded-3xl border p-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-6 h-16 w-40" />
      <Skeleton className="mt-4 h-4 w-32" />
    </div>
  );
}
