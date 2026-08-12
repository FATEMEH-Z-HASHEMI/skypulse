/**
 * WMO weather interpretation codes, as used by Open-Meteo's `weather_code`
 * field (current/hourly/daily). Reference:
 * https://open-meteo.com/en/docs — "WMO Weather interpretation codes".
 *
 * `key` maps every code down to the 5 condition tokens defined in
 * globals.css (`data-condition="…"`), so the hero surface and icons never
 * need to know about raw WMO numbers.
 */

import type { WeatherConditionKey } from "@/types/weather-condition";

export interface WeatherConditionInfo {
  key: WeatherConditionKey;
  label: string;
  code: number;
}

const WEATHER_CODE_TABLE: Record<
  number,
  { key: WeatherConditionKey; label: string }
> = {
  0: { key: "sunny", label: "صاف" },
  1: { key: "sunny", label: "کمی ابری" },
  2: { key: "cloudy", label: "نیمه‌ابری" },
  3: { key: "cloudy", label: "ابری" },
  45: { key: "cloudy", label: "مه‌آلود" },
  48: { key: "cloudy", label: "مه یخ‌زده" },
  51: { key: "rain", label: "نم‌نم باران سبک" },
  53: { key: "rain", label: "نم‌نم باران" },
  55: { key: "rain", label: "نم‌نم باران شدید" },
  56: { key: "rain", label: "باران یخ‌زای سبک" },
  57: { key: "rain", label: "باران یخ‌زا" },
  61: { key: "rain", label: "باران سبک" },
  63: { key: "rain", label: "باران" },
  65: { key: "rain", label: "باران شدید" },
  66: { key: "rain", label: "باران یخ‌زای سبک" },
  67: { key: "rain", label: "باران یخ‌زا" },
  71: { key: "snow", label: "برف سبک" },
  73: { key: "snow", label: "برف" },
  75: { key: "snow", label: "برف شدید" },
  77: { key: "snow", label: "دانه‌های برف" },
  80: { key: "rain", label: "رگبار سبک" },
  81: { key: "rain", label: "رگبار" },
  82: { key: "rain", label: "رگبار شدید" },
  85: { key: "snow", label: "رگبار برف سبک" },
  86: { key: "snow", label: "رگبار برف شدید" },
  95: { key: "storm", label: "طوفان تندری" },
  96: { key: "storm", label: "طوفان تندری با تگرگ سبک" },
  99: { key: "storm", label: "طوفان تندری با تگرگ شدید" },
};

const FALLBACK: { key: WeatherConditionKey; label: string } = {
  key: "cloudy",
  label: "نامشخص",
};

export function mapWeatherCode(code: number): WeatherConditionInfo {
  const entry = WEATHER_CODE_TABLE[code] ?? FALLBACK;
  return { ...entry, code };
}
