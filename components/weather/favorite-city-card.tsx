"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import { ConditionIcon } from "@/components/weather/condition-icon";
import { toPersianDigits } from "@/lib/format";
import { cityHref } from "@/lib/city-href";
import { Card, Skeleton } from "@/components/ui";
import type { FavoriteCity } from "@/types/favorite-city";

export function FavoriteCityCard({
  city,
  onRemove,
}: {
  city: FavoriteCity;
  onRemove: () => void;
}) {
  const { data, isPending, isError, refetch } = useWeatherQuery({
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

  const href = cityHref(city);

  return (
    <Card className="shadow-soft-sm relative p-4">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`حذف ${city.name} از علاقه‌مندی‌ها`}
        className="text-muted-foreground hover:text-danger tap-scale absolute end-3 top-3"
      >
        <X className="h-4 w-4" />
      </button>

      <Link href={href} className="tap-scale block">
        <p className="font-bold">{city.name}</p>
        <p className="tabular text-muted-foreground text-xs">{localTime}</p>

        {isPending && <Skeleton className="mt-3 h-10 w-24" />}
        {isError && (
          <div className="mt-3">
            <p className="text-muted-foreground text-xs">
              خطا در دریافت آب‌وهوا
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                refetch();
              }}
              className="text-primary mt-1 text-xs font-medium underline-offset-4 hover:underline"
            >
              تلاش دوباره
            </button>
          </div>
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
      </Link>
    </Card>
  );
}
