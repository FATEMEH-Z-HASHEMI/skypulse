import { NextResponse, type NextRequest } from "next/server";
import { WeatherApiError } from "@/lib/errors";
import { fetchAirQuality } from "@/services/air-quality.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("latitude");
  const lonParam = searchParams.get("longitude");
  const latitude = latParam !== null ? Number(latParam) : NaN;
  const longitude = lonParam !== null ? Number(lonParam) : NaN;

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

  try {
    const data = await fetchAirQuality({ latitude, longitude });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=1800, stale-while-revalidate=900",
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
