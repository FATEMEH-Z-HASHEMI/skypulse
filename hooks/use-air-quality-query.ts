"use client";
import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "@/hooks/use-geolocation";
import type { AirQualitySnapshot } from "@/types/air-quality";

async function fetchAirQuality(
  coords: Coordinates,
): Promise<AirQualitySnapshot> {
  const res = await fetch(
    `/api/air-quality?latitude=${coords.latitude}&longitude=${coords.longitude}`,
  );
  if (!res.ok) throw new Error("air quality fetch failed");
  return res.json();
}

export function useAirQualityQuery(coords: Coordinates | null) {
  return useQuery({
    queryKey: ["air-quality", coords?.latitude, coords?.longitude],
    queryFn: () => fetchAirQuality(coords as Coordinates),
    enabled: coords !== null,
  });
}
