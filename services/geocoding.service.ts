import "server-only";
import { z } from "zod";
import { WeatherApiError } from "@/lib/errors";
import {
  openMeteoGeocodingResponseSchema,
  openMeteoGeocodingResultSchema,
} from "@/lib/schemas/open-meteo";
import type {
  GeocodingResult,
  ReverseGeocodingResult,
} from "@/types/geocoding";

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

// --- Reverse geocoding (coords -> city name) ---
// Open-Meteo's geocoding API is forward-only, so this uses BigDataCloud's
// free client-reverse-geocode endpoint instead (no key required).

const REVERSE_BASE_URL =
  process.env.REVERSE_GEOCODING_API_BASE_URL ??
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

const reverseGeocodeSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  city: z.string().optional(),
  locality: z.string().optional(),
  principalSubdivision: z.string().optional(),
  countryName: z.string().optional(),
  countryCode: z.string().optional(),
});

export interface ReverseGeocodeParams {
  latitude: number;
  longitude: number;
}

export async function reverseGeocode({
  latitude,
  longitude,
}: ReverseGeocodeParams): Promise<ReverseGeocodingResult> {
  const url = new URL(REVERSE_BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("localityLanguage", "fa");

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 86400 } });
  } catch {
    throw new WeatherApiError(
      "NETWORK_ERROR",
      "اتصال به سرویس موقعیت مکانی برقرار نشد.",
      503,
    );
  }
  if (!response.ok) {
    throw new WeatherApiError(
      "UPSTREAM_ERROR",
      "سرویس موقعیت مکانی در دسترس نیست.",
      502,
    );
  }

  const json: unknown = await response.json();
  const parsed = reverseGeocodeSchema.safeParse(json);
  if (!parsed.success) {
    throw new WeatherApiError(
      "VALIDATION_ERROR",
      "ساختار پاسخ موقعیت مکانی نامعتبر است.",
      502,
    );
  }

  const d = parsed.data;
  return {
    name: d.city || d.locality || d.principalSubdivision || "موقعیت نامشخص",
    country: d.countryName ?? null,
    countryCode: d.countryCode ?? null,
    admin1: d.principalSubdivision ?? null,
    latitude: d.latitude,
    longitude: d.longitude,
  };
}
