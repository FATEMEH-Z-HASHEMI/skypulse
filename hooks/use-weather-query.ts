"use client";
import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "@/hooks/use-geolocation";
import { useSettings } from "@/hooks/use-settings";
import type { WeatherSnapshot } from "@/types/weather";
import type { AppSettings } from "@/types/settings";

async function fetchWeatherSnapshot(
  coords: Coordinates,
  units: Pick<AppSettings, "temperatureUnit" | "windUnit">,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    temperature_unit: units.temperatureUnit,
    wind_speed_unit: units.windUnit,
  });
  const res = await fetch(`/api/weather?${params.toString()}`);
  if (!res.ok) throw new Error("weather fetch failed");
  return res.json();
}

export function useWeatherQuery(coords: Coordinates | null) {
  const { settings } = useSettings();
  const { temperatureUnit, windUnit } = settings;

  return useQuery({
    queryKey: [
      "weather",
      coords?.latitude,
      coords?.longitude,
      temperatureUnit,
      windUnit,
    ],
    queryFn: () =>
      fetchWeatherSnapshot(coords as Coordinates, {
        temperatureUnit,
        windUnit,
      }),
    enabled: coords !== null,
  });
}
