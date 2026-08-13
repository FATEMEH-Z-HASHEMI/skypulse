"use client";
import { useEffect } from "react";
import { AlertCircle, MapPin, MapPinOff } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useReverseGeocodeQuery } from "@/hooks/use-reverse-geocode-query";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import { useSettings } from "@/hooks/use-settings";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { Skeleton, StateCard } from "@/components/ui";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { WeatherChart } from "@/components/weather/weather-chart-lazy";

export function CurrentWeatherSection() {
  const { status, coords, request } = useGeolocation();
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.autoDetectLocation) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.autoDetectLocation]);

  const activeCoords = status === "granted" ? coords : null;
  const cityQuery = useReverseGeocodeQuery(activeCoords);
  const weatherQuery = useWeatherQuery(activeCoords);

  // Empty: auto-detect is off and nothing was requested yet.
  if (!settings.autoDetectLocation && status === "idle") {
    return (
      <StateCard
        icon={MapPin}
        title="موقعیت خودکار غیرفعال است"
        description="برای دیدن آب‌وهوای موقعیت فعلی، دستی درخواست بده یا از تنظیمات فعالش کن."
        actionLabel="دریافت موقعیت مکانی"
        onAction={request}
      />
    );
  }

  // Loading
  if (status === "idle" || status === "loading") return <HeroSkeleton />;

  // Error: geolocation denied/unsupported/failed.
  if (status === "denied" || status === "unsupported" || status === "error") {
    return (
      <StateCard
        icon={MapPinOff}
        title="موقعیت شما مشخص نشد"
        description="از جستجو (⌘K) برای انتخاب شهر استفاده کنید یا دوباره تلاش کنید."
        actionLabel="تلاش دوباره"
        onAction={request}
      />
    );
  }

  // Loading
  if (weatherQuery.isPending || cityQuery.isPending) return <HeroSkeleton />;

  // Error: weather fetch failed.
  if (weatherQuery.isError || !weatherQuery.data) {
    return (
      <StateCard
        icon={AlertCircle}
        title="دریافت اطلاعات آب‌وهوا با مشکل مواجه شد"
        actionLabel="تلاش دوباره"
        onAction={() => weatherQuery.refetch()}
      />
    );
  }

  // Success
  return (
    <div className="animate-[fade-in_200ms_ease-out]">
      <CurrentWeatherCard
        cityName={cityQuery.data?.name ?? "موقعیت شما"}
        weather={weatherQuery.data}
        titleAs="h1"
      />
      <HourlyForecast
        hourly={weatherQuery.data.hourly}
        currentTime={weatherQuery.data.current.time}
      />
      <DailyForecast daily={weatherQuery.data.daily} />
      <WeatherChart
        hourly={weatherQuery.data.hourly}
        currentTime={weatherQuery.data.current.time}
      />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="border-border bg-card shadow-soft-md rounded-3xl border p-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-6 h-16 w-40" />
      <Skeleton className="mt-4 h-4 w-32" />
    </div>
  );
}
