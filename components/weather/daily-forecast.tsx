"use client";

import { useState } from "react";
import { Sun, Sunrise, Sunset } from "lucide-react";
import { formatTime, toPersianDigits } from "@/lib/format";
import { ConditionIcon } from "@/components/weather/condition-icon";
import { cn } from "@/lib/utils";
import type { DailyForecastEntry } from "@/types/weather";

function dayLabel(dateStr: string, isToday: boolean) {
  if (isToday) return "امروز";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(
    new Date(y, m - 1, d),
  );
}

export function DailyForecast({ daily }: { daily: DailyForecastEntry[] }) {
  const [selected, setSelected] = useState(0);
  if (daily.length === 0) return null;

  const overallMax = Math.max(...daily.map((d) => d.temperatureMax));
  const overallMin = Math.min(...daily.map((d) => d.temperatureMin));
  const range = Math.max(overallMax - overallMin, 1);
  const active = daily[selected];

  return (
    <div className="mt-4">
      <h2 className="text-foreground mb-3 text-sm font-bold">پیش‌بینی هفتگی</h2>

      <div className="border-border bg-card shadow-soft-sm divide-border divide-y rounded-2xl border">
        {daily.map((day, i) => {
          const barStart = ((day.temperatureMin - overallMin) / range) * 100;
          const barWidth =
            ((day.temperatureMax - day.temperatureMin) / range) * 100;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors",
                i === selected ? "bg-muted" : "hover:bg-muted/60",
              )}
            >
              <span className="w-16 shrink-0 text-start font-medium">
                {dayLabel(day.date, i === 0)}
              </span>
              <ConditionIcon
                conditionKey={day.condition.key}
                className="h-5 w-5 shrink-0"
              />
              <span className="tabular text-muted-foreground w-10 shrink-0 text-xs">
                {day.precipitationProbability > 0
                  ? `${toPersianDigits(Math.round(day.precipitationProbability))}٪`
                  : ""}
              </span>
              <span className="tabular text-muted-foreground w-8 shrink-0 text-end text-xs">
                {toPersianDigits(Math.round(day.temperatureMin))}°
              </span>
              <span className="bg-muted relative h-1.5 flex-1 rounded-full">
                <span
                  className="bg-primary/70 absolute h-full rounded-full"
                  style={{
                    insetInlineStart: `${barStart}%`,
                    width: `${barWidth}%`,
                  }}
                />
              </span>
              <span className="tabular w-8 shrink-0 text-end text-xs font-bold">
                {toPersianDigits(Math.round(day.temperatureMax))}°
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="border-border bg-card shadow-soft-sm mt-3 grid grid-cols-3 gap-3 rounded-2xl border p-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <Sun className="text-muted-foreground h-5 w-5" />
            <p className="tabular text-sm font-bold">
              {toPersianDigits(active.uvIndexMax.toFixed(1))}
            </p>
            <p className="text-muted-foreground text-xs">حداکثر UV</p>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Sunrise className="text-muted-foreground h-5 w-5" />
            <p className="tabular text-sm font-bold">
              {formatTime(active.sunrise)}
            </p>
            <p className="text-muted-foreground text-xs">طلوع</p>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Sunset className="text-muted-foreground h-5 w-5" />
            <p className="tabular text-sm font-bold">
              {formatTime(active.sunset)}
            </p>
            <p className="text-muted-foreground text-xs">غروب</p>
          </div>
        </div>
      )}
    </div>
  );
}
