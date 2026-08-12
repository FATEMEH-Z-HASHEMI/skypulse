import { Droplets, Wind } from "lucide-react";
import { toPersianDigits } from "@/lib/format";
import { ConditionIcon } from "@/components/weather/condition-icon";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { HourlyForecastEntry } from "@/types/weather";

function findCurrentIndex(hourly: HourlyForecastEntry[], currentTime: string) {
  const truncated = currentTime.slice(0, 13); // "YYYY-MM-DDTHH"
  const i = hourly.findIndex((h) => h.time.startsWith(truncated));
  return i === -1 ? 0 : i;
}

export function HourlyForecast({
  hourly,
  currentTime,
}: {
  hourly: HourlyForecastEntry[];
  currentTime: string;
}) {
  const start = findCurrentIndex(hourly, currentTime);
  const items = hourly.slice(start, start + 24);
  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <h2 className="text-foreground mb-3 text-sm font-bold">پیش‌بینی ساعتی</h2>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {items.map((hour, i) => (
          <Card
            key={hour.time}
            className={cn(
              "shadow-soft-sm flex w-24 shrink-0 snap-start flex-col items-center gap-2 p-3 text-center",
              i === 0 && "border-primary bg-primary/5",
            )}
          >
            <p className="text-muted-foreground text-xs font-medium">
              {i === 0 ? "اکنون" : toPersianDigits(hour.time.slice(11, 16))}
            </p>
            <ConditionIcon
              conditionKey={hour.condition.key}
              className="text-foreground h-6 w-6"
            />
            <p className="tabular text-sm font-bold">
              {toPersianDigits(Math.round(hour.temperature))}°
            </p>
            <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
              {hour.precipitationProbability > 0 && (
                <span className="tabular flex items-center gap-0.5">
                  <Droplets className="h-3 w-3" />
                  {toPersianDigits(Math.round(hour.precipitationProbability))}٪
                </span>
              )}
              <span className="tabular flex items-center gap-0.5">
                <Wind className="h-3 w-3" />
                {toPersianDigits(Math.round(hour.windSpeed))}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
