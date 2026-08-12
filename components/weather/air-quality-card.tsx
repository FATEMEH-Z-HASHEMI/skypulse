import { getAqiLevel } from "@/constants/air-quality-levels";
import { toPersianDigits } from "@/lib/format";
import { Card } from "@/components/ui";
import type { AirQualitySnapshot } from "@/types/air-quality";

const POLLUTANTS: { key: keyof AirQualitySnapshot; label: string }[] = [
  { key: "pm2_5", label: "PM2.5" },
  { key: "pm10", label: "PM10" },
  { key: "carbonMonoxide", label: "CO" },
  { key: "nitrogenDioxide", label: "NO2" },
  { key: "sulphurDioxide", label: "SO2" },
  { key: "ozone", label: "O3" },
];

export function AirQualityCard({ data }: { data: AirQualitySnapshot }) {
  const level = getAqiLevel(data.aqi);
  const gaugePercent = Math.min((data.aqi / 300) * 100, 100);

  return (
    <div className="border-border bg-card shadow-soft-sm mt-4 rounded-2xl border p-4">
      <h2 className="text-foreground mb-3 text-sm font-bold">کیفیت هوا</h2>

      <div className="flex items-end gap-3">
        <p className="tabular text-4xl font-extrabold">
          {toPersianDigits(Math.round(data.aqi))}
        </p>
        <p className={`pb-1 text-sm font-semibold ${level.textClass}`}>
          {level.label}
        </p>
      </div>

      <div className="bg-muted relative mt-3 h-2 w-full overflow-hidden rounded-full">
        <div
          className={`absolute h-full rounded-full ${level.barClass}`}
          style={{ width: `${gaugePercent}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {POLLUTANTS.map((p) => (
          <Card
            key={p.key}
            className="shadow-soft-sm flex flex-col items-center gap-1 p-3 text-center"
          >
            <p className="text-muted-foreground text-[10px]">{p.label}</p>
            <p className="tabular text-sm font-bold">
              {toPersianDigits(Math.round(data[p.key] as number))}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
