"use client";
import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "@/hooks/use-geolocation";
import type { ReverseGeocodingResult } from "@/types/geocoding";

async function fetchCityName(
  coords: Coordinates,
): Promise<ReverseGeocodingResult> {
  const res = await fetch(
    `/api/geocoding/reverse?latitude=${coords.latitude}&longitude=${coords.longitude}`,
  );
  if (!res.ok) throw new Error("reverse geocode failed");
  return res.json();
}

export function useReverseGeocodeQuery(coords: Coordinates | null) {
  return useQuery({
    queryKey: ["reverse-geocode", coords?.latitude, coords?.longitude],
    queryFn: () => fetchCityName(coords as Coordinates),
    enabled: coords !== null,
    staleTime: 60 * 60_000,
  });
}
