import "server-only";
import { WeatherApiError } from "@/lib/errors";
import {
  openMeteoGeocodingResponseSchema,
  openMeteoGeocodingResultSchema,
} from "@/lib/schemas/open-meteo";
import type { z } from "zod";
import type { GeocodingResult } from "@/types/geocoding";

const BASE_URL =
  process.env.GEOCODING_API_BASE_URL ??
  "https://geocoding-api.open-meteo.com/v1/search";

export interface SearchCitiesParams {
  query: string;
  count?: number;
  /** ISO 639-1 language code for localized city/country names. */
  language?: string;
}

export async function searchCities({
  query,
  count = 8,
  language = "fa",
}: SearchCitiesParams): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL(BASE_URL);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", String(count));
  url.searchParams.set("language", language);
  url.searchParams.set("format", "json");

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 3600 } });
  } catch {
    throw new WeatherApiError(
      "NETWORK_ERROR",
      "اتصال به سرویس جستجوی شهر برقرار نشد.",
      503,
    );
  }

  if (!response.ok) {
    throw new WeatherApiError(
      "UPSTREAM_ERROR",
      "سرویس جستجوی شهر در دسترس نیست.",
      502,
    );
  }

  const json: unknown = await response.json();
  const parsed = openMeteoGeocodingResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new WeatherApiError(
      "VALIDATION_ERROR",
      "ساختار پاسخ جستجوی شهر نامعتبر است.",
      502,
    );
  }

  return (parsed.data.results ?? []).map(transformGeocodingResult);
}

type OpenMeteoGeocodingResult = z.infer<typeof openMeteoGeocodingResultSchema>;

function transformGeocodingResult(
  result: OpenMeteoGeocodingResult,
): GeocodingResult {
  return {
    id: result.id,
    name: result.name,
    country: result.country ?? null,
    countryCode: result.country_code ?? null,
    admin1: result.admin1 ?? null,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    population: result.population ?? null,
  };
}
