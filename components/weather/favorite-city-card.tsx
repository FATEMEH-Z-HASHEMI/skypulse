"use client";
import { X } from "lucide-react";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import { ConditionIcon } from "@/components/weather/condition-icon";
import { toPersianDigits } from "@/lib/format";
import { Card, Skeleton } from "@/components/ui";
import type { FavoriteCity } from "@/types/favorite-city";

export function FavoriteCityCard({
  city,
  onRemove,
}: {
  city: FavoriteCity;
  onRemove: () => void;
}) {
  const { data, isPending, isError } = useWeatherQuery({
    latitude: city.latitude,
    longitude: city.longitude,
  });

  const localTime = toPersianDigits(
    new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: city.timezone || undefined,
    }).format(new Date()),
  );

  return (
    <Card className="shadow-soft-sm relative p-4">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`حذف ${city.name} از علاقه‌مندی‌ها`}
        className="text-muted-foreground hover:text-danger absolute end-3 top-3"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="font-bold">{city.name}</p>
      <p className="tabular text-muted-foreground text-xs">{localTime}</p>

      {isPending && <Skeleton className="mt-3 h-10 w-24" />}
      {isError && (
        <p className="text-muted-foreground mt-3 text-xs">
          خطا در دریافت آب‌وهوا
        </p>
      )}
      {data && (
        <div className="mt-3 flex items-center gap-3">
          <ConditionIcon
            conditionKey={data.current.condition.key}
            className="h-8 w-8"
          />
          <p className="tabular text-2xl font-extrabold">
            {toPersianDigits(Math.round(data.current.temperature))}°
          </p>
          {data.daily[0] && (
            <p className="tabular text-muted-foreground text-xs">
              {toPersianDigits(Math.round(data.daily[0].temperatureMax))}° /{" "}
              {toPersianDigits(Math.round(data.daily[0].temperatureMin))}°
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
