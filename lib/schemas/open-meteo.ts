import { z } from "zod";

export const openMeteoCurrentSchema = z.object({
  time: z.string(),
  temperature_2m: z.number(),
  relative_humidity_2m: z.number(),
  apparent_temperature: z.number(),
  is_day: z.union([z.literal(0), z.literal(1)]),
  precipitation: z.number(),
  weather_code: z.number(),
  cloud_cover: z.number(),
  pressure_msl: z.number(),
  wind_speed_10m: z.number(),
  wind_direction_10m: z.number(),
  wind_gusts_10m: z.number(),
});

export const openMeteoHourlySchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number()),
  precipitation_probability: z.array(z.number()),
  weather_code: z.array(z.number()),
  wind_speed_10m: z.array(z.number()),
  visibility: z.array(z.number().nullable()),
  uv_index: z.array(z.number().nullable()),
});

export const openMeteoDailySchema = z.object({
  time: z.array(z.string()),
  weather_code: z.array(z.number()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  sunrise: z.array(z.string()),
  sunset: z.array(z.string()),
  precipitation_probability_max: z.array(z.number()),
  uv_index_max: z.array(z.number()),
});

export const openMeteoForecastResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  current: openMeteoCurrentSchema,
  hourly: openMeteoHourlySchema,
  daily: openMeteoDailySchema,
});

export type OpenMeteoForecastResponse = z.infer<
  typeof openMeteoForecastResponseSchema
>;

export const openMeteoGeocodingResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  admin1: z.string().optional(),
  timezone: z.string(),
  population: z.number().optional(),
});

export const openMeteoGeocodingResponseSchema = z.object({
  results: z.array(openMeteoGeocodingResultSchema).optional(),
});

export type OpenMeteoGeocodingResponse = z.infer<
  typeof openMeteoGeocodingResponseSchema
>;

export const openMeteoAirQualitySchema = z.object({
  current: z.object({
    us_aqi: z.number(),
    pm2_5: z.number(),
    pm10: z.number(),
    carbon_monoxide: z.number(),
    nitrogen_dioxide: z.number(),
    sulphur_dioxide: z.number(),
    ozone: z.number(),
  }),
});
