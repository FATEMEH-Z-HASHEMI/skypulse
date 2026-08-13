"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudOff } from "lucide-react";
import { toPersianDigits } from "@/lib/format";
import { StateCard } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { HourlyForecastEntry } from "@/types/weather";

type Metric = "temperature" | "precipitation" | "wind";

const METRICS: { key: Metric; label: string; unit: string }[] = [
  { key: "temperature", label: "دما", unit: "°" },
  { key: "precipitation", label: "بارش", unit: "٪" },
  { key: "wind", label: "باد", unit: " km/h" },
];

const AXIS_TICK = { fontSize: 11, fill: "var(--color-muted-foreground)" };
const TOOLTIP_STYLE = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.75rem",
  color: "var(--color-foreground)",
  fontSize: 12,
};

function findCurrentIndex(hourly: HourlyForecastEntry[], currentTime: string) {
  const truncated = currentTime.slice(0, 13);
  const i = hourly.findIndex((h) => h.time.startsWith(truncated));
  return i === -1 ? 0 : i;
}

export function WeatherChart({
  hourly,
  currentTime,
}: {
  hourly: HourlyForecastEntry[];
  currentTime: string;
}) {
  const [metric, setMetric] = useState<Metric>("temperature");
  const start = findCurrentIndex(hourly, currentTime);
  const items = hourly.slice(start, start + 24);

  if (items.length === 0) {
    return (
      <StateCard
        icon={CloudOff}
        title="نموداری برای نمایش موجود نیست"
        description="داده‌ی ۲۴ ساعت آینده برای این موقعیت در دسترس نیست."
        className="mt-4"
      />
    );
  }

  const data = items.map((h) => ({
    time: toPersianDigits(h.time.slice(11, 16)),
    temperature: Math.round(h.temperature),
    precipitation: Math.round(h.precipitationProbability),
    wind: Math.round(h.windSpeed),
  }));

  const active = METRICS.find((m) => m.key === metric)!;

  return (
    <div className="border-border bg-card shadow-soft-sm mt-4 rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-foreground text-sm font-bold">
          نمودار ۲۴ ساعت آینده
        </h2>
        <div
          role="tablist"
          aria-label="نوع نمودار"
          className="bg-muted flex gap-1 rounded-lg p-1"
        >
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              id={`chart-tab-${m.key}`}
              aria-selected={m.key === metric}
              aria-controls="chart-panel"
              onClick={() => setMetric(m.key)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                m.key === metric
                  ? "bg-card text-foreground shadow-soft-sm"
                  : "text-muted-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="chart-panel"
        role="img"
        aria-label={`نمودار ${active.label} برای ۲۴ ساعت آینده`}
        className="h-56 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          {metric === "precipitation" ? (
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                formatter={(value) => [
                  `${toPersianDigits(Number(value))}${active.unit}`,
                  active.label,
                ]}
                contentStyle={TOOLTIP_STYLE}
              />
              <Bar
                dataKey="precipitation"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                formatter={(value) => [
                  `${toPersianDigits(Number(value))}${active.unit}`,
                  active.label,
                ]}
                contentStyle={TOOLTIP_STYLE}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#chart-fill)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
