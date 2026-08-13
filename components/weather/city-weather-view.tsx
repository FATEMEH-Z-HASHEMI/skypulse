"use client";
import Link from "next/link";
import { AlertCircle, ArrowRight, Heart, MapPinOff } from "lucide-react";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import { useAirQualityQuery } from "@/hooks/use-air-quality-query";
import { makeCityId, useFavorites } from "@/hooks/use-favorites";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { WeatherChart } from "@/components/weather/weather-chart-lazy";
import { AirQualityCard } from "@/components/weather/air-quality-card";
import { HeroSkeleton } from "@/components/weather/hero-skeleton";
import { Skeleton, StateCard } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Coordinates } from "@/hooks/use-geolocation";

interface CityWeatherViewProps {
  cityName: string;
  admin1: string | null;
  country: string | null;
  timezone: string | null;
  coords: Coordinates | null;
}

export function CityWeatherView({
  cityName,
  admin1,
  country,
  timezone,
  coords,
}: CityWeatherViewProps) {
  const weatherQuery = useWeatherQuery(coords);
  const airQualityQuery = useAirQualityQuery(coords);
  const { isFavorite, toggle } = useFavorites();

  const favoriteId = coords
    ? makeCityId(coords.latitude, coords.longitude)
    : null;
  const location = [admin1, country].filter(Boolean).join("، ");

  function handleToggleFavorite() {
    if (!coords || !favoriteId) return;
    toggle({
      id: favoriteId,
      name: cityName,
      country,
      admin1,
      latitude: coords.latitude,
      longitude: coords.longitude,
      timezone: timezone ?? "",
    });
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground tap-scale inline-flex items-center gap-1 text-sm"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Link>

        {coords && favoriteId && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={
              isFavorite(favoriteId)
                ? `حذف ${cityName} از علاقه‌مندی‌ها`
                : `افزودن ${cityName} به علاقه‌مندی‌ها`
            }
            className="text-muted-foreground hover:text-danger tap-scale inline-flex h-9 w-9 items-center justify-center rounded-full"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite(favoriteId) && "fill-danger text-danger",
              )}
            />
          </button>
        )}
      </div>

      <div className="mb-4">
        <h1 className="text-foreground text-2xl font-extrabold">{cityName}</h1>
        {location && (
          <p className="text-muted-foreground text-sm">{location}</p>
        )}
      </div>

      {/* Empty: no coordinates could be resolved for this city. */}
      {!coords && (
        <StateCard
          icon={MapPinOff}
          title="مختصات این شهر مشخص نیست"
          description="از جستجو (⌘K) دوباره شهر را انتخاب کنید."
        />
      )}

      {/* Loading */}
      {coords && weatherQuery.isPending && <HeroSkeleton />}

      {/* Error */}
      {coords && weatherQuery.isError && (
        <StateCard
          icon={AlertCircle}
          title="دریافت اطلاعات آب‌وهوا با مشکل مواجه شد"
          actionLabel="تلاش دوباره"
          onAction={() => weatherQuery.refetch()}
        />
      )}

      {/* Success */}
      {coords && weatherQuery.data && (
        <div className="animate-[fade-in_200ms_ease-out]">
          <CurrentWeatherCard cityName={cityName} weather={weatherQuery.data} />
          <HourlyForecast
            hourly={weatherQuery.data.hourly}
            currentTime={weatherQuery.data.current.time}
          />
          <DailyForecast daily={weatherQuery.data.daily} />
          <WeatherChart
            hourly={weatherQuery.data.hourly}
            currentTime={weatherQuery.data.current.time}
          />

          {airQualityQuery.isPending && (
            <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
          )}
          {airQualityQuery.isError && (
            <StateCard
              icon={AlertCircle}
              title="دریافت کیفیت هوا با مشکل مواجه شد"
              actionLabel="تلاش دوباره"
              onAction={() => airQualityQuery.refetch()}
              className="mt-4"
            />
          )}
          {airQualityQuery.data && (
            <AirQualityCard data={airQualityQuery.data} />
          )}
        </div>
      )}
    </>
  );
}
