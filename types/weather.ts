import type { WeatherConditionInfo } from "@/constants/weather-codes";

export interface WeatherUnits {
  temperature: "celsius" | "fahrenheit";
  windSpeed: "kmh" | "mph";
  precipitation: "mm" | "inch";
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  cloudCover: number;
  /** Meters. Null when the upstream provider didn't return a value. */
  visibility: number | null;
  /** Null when the upstream provider didn't return a value. */
  uvIndex: number | null;
  condition: WeatherConditionInfo;
}

export interface HourlyForecastEntry {
  time: string;
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
  condition: WeatherConditionInfo;
}

export interface DailyForecastEntry {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  condition: WeatherConditionInfo;
}

export interface WeatherSnapshot {
  latitude: number;
  longitude: number;
  timezone: string;
  units: WeatherUnits;
  current: CurrentWeather;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
  /** ISO timestamp — when our server fetched this snapshot (for "به‌روزرسانی N دقیقه پیش"). */
  fetchedAt: string;
}
