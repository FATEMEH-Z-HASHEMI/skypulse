import "server-only";
import { WeatherApiError } from "@/lib/errors";
import { openMeteoAirQualitySchema } from "@/lib/schemas/open-meteo";
import type { AirQualitySnapshot } from "@/types/air-quality";

const BASE_URL =
  process.env.AIR_QUALITY_API_BASE_URL ??
  "https://air-quality-api.open-meteo.com/v1/air-quality";

const CURRENT_PARAMS = [
  "us_aqi",
  "pm2_5",
  "pm10",
  "carbon_monoxide",
  "nitrogen_dioxide",
  "sulphur_dioxide",
  "ozone",
].join(",");

export interface FetchAirQualityParams {
  latitude: number;
  longitude: number;
}

export async function fetchAirQuality({
  latitude,
  longitude,
}: FetchAirQualityParams): Promise<AirQualitySnapshot> {
  const url = new URL(BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", CURRENT_PARAMS);
  url.searchParams.set("timezone", "auto");

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 1800 } });
  } catch {
    throw new WeatherApiError(
      "NETWORK_ERROR",
      "اتصال به سرویس کیفیت هوا برقرار نشد.",
      503,
    );
  }
  if (!response.ok) {
    throw new WeatherApiError(
      "UPSTREAM_ERROR",
      "سرویس کیفیت هوا در دسترس نیست.",
      502,
    );
  }

  const json: unknown = await response.json();
  const parsed = openMeteoAirQualitySchema.safeParse(json);
  if (!parsed.success) {
    throw new WeatherApiError(
      "VALIDATION_ERROR",
      "ساختار پاسخ کیفیت هوا نامعتبر است.",
      502,
    );
  }

  const c = parsed.data.current;
  return {
    aqi: c.us_aqi,
    pm2_5: c.pm2_5,
    pm10: c.pm10,
    carbonMonoxide: c.carbon_monoxide,
    nitrogenDioxide: c.nitrogen_dioxide,
    sulphurDioxide: c.sulphur_dioxide,
    ozone: c.ozone,
  };
}
