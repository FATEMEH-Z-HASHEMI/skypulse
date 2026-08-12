"use client";
import { useEffect } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useReverseGeocodeQuery } from "@/hooks/use-reverse-geocode-query";
import { useWeatherQuery } from "@/hooks/use-weather-query";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { Skeleton } from "@/components/ui";

export function CurrentWeatherSection() {
  const { status, coords, request } = useGeolocation();

  useEffect(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCoords = status === "granted" ? coords : null;
  const cityQuery = useReverseGeocodeQuery(activeCoords);
  const weatherQuery = useWeatherQuery(activeCoords);

  if (status === "idle" || status === "loading") return <HeroSkeleton />;
  if (status === "denied" || status === "unsupported" || status === "error")
    return <Fallback />;
  if (weatherQuery.isPending || cityQuery.isPending) return <HeroSkeleton />;
  if (weatherQuery.isError || !weatherQuery.data) {
    return <Fallback message="دریافت اطلاعات آب‌وهوا با مشکل مواجه شد." />;
  }

  return (
    <CurrentWeatherCard
      cityName={cityQuery.data?.name ?? "موقعیت شما"}
      weather={weatherQuery.data}
    />
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

function Fallback({ message }: { message?: string }) {
  return (
    <div className="border-border bg-card shadow-soft-md rounded-3xl border p-8 text-center">
      <p className="text-muted-foreground text-sm">
        {message ??
          "موقعیت شما مشخص نشد — از جستجو (⌘K) برای انتخاب شهر استفاده کنید."}
      </p>
    </div>
  );
}
