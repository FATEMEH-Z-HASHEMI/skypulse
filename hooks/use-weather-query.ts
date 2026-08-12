"use client";
import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "@/hooks/use-geolocation";
import type { WeatherSnapshot } from "@/types/weather";

async function fetchWeatherSnapshot(
  coords: Coordinates,
): Promise<WeatherSnapshot> {
  const res = await fetch(
    `/api/weather?latitude=${coords.latitude}&longitude=${coords.longitude}`,
  );
  if (!res.ok) throw new Error("weather fetch failed");
  return res.json();
}

export function useWeatherQuery(coords: Coordinates | null) {
  return useQuery({
    queryKey: ["weather", coords?.latitude, coords?.longitude],
    queryFn: () => fetchWeatherSnapshot(coords as Coordinates),
    enabled: coords !== null,
  });
}
