import { Droplets, Eye, Gauge, Sun, Sunrise, Sunset, Wind } from "lucide-react";
import { formatTime, toPersianDigits } from "@/lib/format";
import { MetricCard } from "@/components/weather/metric-card";
import { ConditionEffects } from "@/components/weather/condition-effects";
import type { WeatherSnapshot } from "@/types/weather";

export function CurrentWeatherCard({
  cityName,
  weather,
  titleAs: CityTag = "p",
}: {
  cityName: string;
  weather: WeatherSnapshot;
  titleAs?: "h1" | "p";
}) {
  const { current, daily } = weather;
  const today = daily[0];

  return (
    <div>
      <div
        data-condition={current.condition.key}
        className="bg-condition-gradient shadow-soft-lg relative overflow-hidden rounded-3xl p-8"
      >
        <div className="pointer-events-none absolute inset-0">
          <ConditionEffects conditionKey={current.condition.key} />
        </div>

        <CityTag className="relative text-sm opacity-80">{cityName}</CityTag>

        <div className="relative mt-6 flex items-end gap-4">
          <p className="tabular text-7xl leading-none font-extrabold">
            {toPersianDigits(Math.round(current.temperature))}°
          </p>
          <div className="pb-2">
            <p className="text-lg font-semibold">{current.condition.label}</p>
            <p className="text-sm opacity-80">
              احساس می‌شود{" "}
              {toPersianDigits(Math.round(current.apparentTemperature))}°
            </p>
          </div>
        </div>

        {today && (
          <div className="tabular relative mt-4 flex gap-4 text-sm opacity-90">
            <span>
              بیشینه {toPersianDigits(Math.round(today.temperatureMax))}°
            </span>
            <span>
              کمینه {toPersianDigits(Math.round(today.temperatureMin))}°
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <MetricCard
          icon={Droplets}
          label="رطوبت"
          value={`${toPersianDigits(Math.round(current.humidity))}٪`}
        />
        <MetricCard
          icon={Wind}
          label="باد"
          value={`${toPersianDigits(Math.round(current.windSpeed))} ${
            weather.units.windSpeed === "mph" ? "mph" : "km/h"
          }`}
        />
        <MetricCard
          icon={Gauge}
          label="فشار"
          value={`${toPersianDigits(Math.round(current.pressure))} hPa`}
        />
        <MetricCard
          icon={Eye}
          label="دید افق"
          value={
            current.visibility !== null
              ? `${toPersianDigits((current.visibility / 1000).toFixed(1))} km`
              : "—"
          }
        />
        <MetricCard
          icon={Sun}
          label="UV"
          value={
            current.uvIndex !== null
              ? toPersianDigits(current.uvIndex.toFixed(1))
              : "—"
          }
        />
        {today && (
          <>
            <MetricCard
              icon={Sunrise}
              label="طلوع"
              value={formatTime(today.sunrise)}
            />
            <MetricCard
              icon={Sunset}
              label="غروب"
              value={formatTime(today.sunset)}
            />
          </>
        )}
      </div>
    </div>
  );
}
