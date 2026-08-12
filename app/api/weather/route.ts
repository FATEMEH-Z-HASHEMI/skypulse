import { NextResponse, type NextRequest } from "next/server";
import { WeatherApiError } from "@/lib/errors";
import { fetchWeather } from "@/services/weather.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitudeParam = searchParams.get("latitude");
  const longitudeParam = searchParams.get("longitude");
  const latitude = latitudeParam !== null ? Number(latitudeParam) : NaN;
  const longitude = longitudeParam !== null ? Number(longitudeParam) : NaN;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "latitude و longitude معتبر لازم است.",
        },
      },
      { status: 400 },
    );
  }

  const temperatureUnit = searchParams.get("temperature_unit");
  const windSpeedUnit = searchParams.get("wind_speed_unit");

  try {
    const weather = await fetchWeather({
      latitude,
      longitude,
      units: {
        temperature:
          temperatureUnit === "fahrenheit" ? "fahrenheit" : "celsius",
        windSpeed: windSpeedUnit === "mph" ? "mph" : "kmh",
      },
    });

    return NextResponse.json(weather, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    if (error instanceof WeatherApiError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: { code: "UNKNOWN", message: "خطای غیرمنتظره رخ داد." } },
      { status: 500 },
    );
  }
}
