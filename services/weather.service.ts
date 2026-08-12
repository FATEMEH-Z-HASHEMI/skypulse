import "server-only";
import { mapWeatherCode } from "@/constants/weather-codes";
import { WeatherApiError } from "@/lib/errors";
import {
  openMeteoForecastResponseSchema,
  type OpenMeteoForecastResponse,
} from "@/lib/schemas/open-meteo";
import type {
  CurrentWeather,
  DailyForecastEntry,
  HourlyForecastEntry,
  WeatherSnapshot,
  WeatherUnits,
} from "@/types/weather";

const BASE_URL =
  process.env.WEATHER_API_BASE_URL ?? "https://api.open-meteo.com/v1/forecast";

// Only what each UI section actually needs — see Milestones 7–9.
const CURRENT_PARAMS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
].join(",");

// visibility/uv_index aren't in Open-Meteo's curated `current` set, so we
// pull them from `hourly` and index-match to the current hour instead
// (see findHourlyIndex below).
const HOURLY_PARAMS = [
  "temperature_2m",
  "precipitation_probability",
  "weather_code",
  "wind_speed_10m",
  "visibility",
  "uv_index",
].join(",");

const DAILY_PARAMS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "sunrise",
  "sunset",
  "precipitation_probability_max",
  "uv_index_max",
].join(",");

export interface FetchWeatherParams {
  latitude: number;
  longitude: number;
  units?: Partial<WeatherUnits>;
  forecastDays?: number;
}

export async function fetchWeather({
  latitude,
  longitude,
  units,
  forecastDays = 7,
}: FetchWeatherParams): Promise<WeatherSnapshot> {
  const resolvedUnits: WeatherUnits = {
    temperature: units?.temperature ?? "celsius",
    windSpeed: units?.windSpeed ?? "kmh",
    precipitation: units?.precipitation ?? "mm",
  };

  const url = new URL(BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", CURRENT_PARAMS);
  url.searchParams.set("hourly", HOURLY_PARAMS);
  url.searchParams.set("daily", DAILY_PARAMS);
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", String(forecastDays));
  url.searchParams.set("temperature_unit", resolvedUnits.temperature);
  url.searchParams.set("wind_speed_unit", resolvedUnits.windSpeed);
  url.searchParams.set("precipitation_unit", resolvedUnits.precipitation);

  let response: Response;
  try {
    // Cached at the edge/server for 10 minutes — weather doesn't need to
    // be fetched fresh on every request, and this keeps us well inside
    // Open-Meteo's fair-use limits.
    response = await fetch(url, { next: { revalidate: 600 } });
  } catch {
    throw new WeatherApiError(
      "NETWORK_ERROR",
      "اتصال به سرویس آب‌وهوا برقرار نشد.",
      503,
    );
  }

  if (response.status === 429) {
    throw new WeatherApiError(
      "RATE_LIMITED",
      "تعداد درخواست‌ها بیش از حد مجاز است.",
      429,
    );
  }
  if (!response.ok) {
    throw new WeatherApiError(
      "UPSTREAM_ERROR",
      "سرویس آب‌وهوا در دسترس نیست.",
      502,
    );
  }

  const json: unknown = await response.json();
  const parsed = openMeteoForecastResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new WeatherApiError(
      "VALIDATION_ERROR",
      "ساختار پاسخ سرویس آب‌وهوا نامعتبر است.",
      502,
    );
  }

  return transformForecastResponse(parsed.data, resolvedUnits);
}

function transformForecastResponse(
  data: OpenMeteoForecastResponse,
  units: WeatherUnits,
): WeatherSnapshot {
  const currentHourIndex = findHourlyIndex(data.hourly.time, data.current.time);

  const current: CurrentWeather = {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    isDay: data.current.is_day === 1,
    precipitation: data.current.precipitation,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    pressure: data.current.pressure_msl,
    cloudCover: data.current.cloud_cover,
    visibility:
      currentHourIndex !== null
        ? (data.hourly.visibility[currentHourIndex] ?? null)
        : null,
    uvIndex:
      currentHourIndex !== null
        ? (data.hourly.uv_index[currentHourIndex] ?? null)
        : null,
    condition: mapWeatherCode(data.current.weather_code),
  };

  const hourly: HourlyForecastEntry[] = data.hourly.time.map((time, i) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    precipitationProbability: data.hourly.precipitation_probability[i],
    windSpeed: data.hourly.wind_speed_10m[i],
    condition: mapWeatherCode(data.hourly.weather_code[i]),
  }));

  const daily: DailyForecastEntry[] = data.daily.time.map((date, i) => ({
    date,
    temperatureMax: data.daily.temperature_2m_max[i],
    temperatureMin: data.daily.temperature_2m_min[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
    uvIndexMax: data.daily.uv_index_max[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    condition: mapWeatherCode(data.daily.weather_code[i]),
  }));

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    units,
    current,
    hourly,
    daily,
    fetchedAt: new Date().toISOString(),
  };
}

/** Finds the hourly index matching current.time, truncated to the hour. */
function findHourlyIndex(
  hourlyTimes: string[],
  currentTime: string,
): number | null {
  const truncated = currentTime.slice(0, 13); // "YYYY-MM-DDTHH"
  const index = hourlyTimes.findIndex((t) => t.startsWith(truncated));
  return index === -1 ? null : index;
}
