import type { Route } from "next";

export interface CityHrefInput {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string | null;
  country?: string | null;
  timezone?: string | null;
}

/**
 * Builds the `/weather/[city]` link for a resolved city. Coordinates travel
 * as query params rather than a second lookup — see app/weather/[city]/page.tsx.
 */
export function cityHref(city: CityHrefInput): Route {
  const params = new URLSearchParams({
    lat: String(city.latitude),
    lon: String(city.longitude),
  });
  if (city.admin1) params.set("admin1", city.admin1);
  if (city.country) params.set("country", city.country);
  if (city.timezone) params.set("timezone", city.timezone);
  return `/weather/${encodeURIComponent(city.name)}?${params.toString()}` as Route;
}
