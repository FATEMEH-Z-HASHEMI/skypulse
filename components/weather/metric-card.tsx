import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";

export function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="shadow-soft-sm flex flex-col items-center gap-1.5 p-4 text-center">
      <Icon className="text-muted-foreground h-5 w-5" />
      <p className="tabular text-sm font-bold">{value}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </Card>
  );
}
