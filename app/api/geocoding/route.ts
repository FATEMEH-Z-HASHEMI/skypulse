import { NextResponse, type NextRequest } from "next/server";
import { WeatherApiError } from "@/lib/errors";
import { searchCities } from "@/services/geocoding.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  if (query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchCities({ query });
    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=3600, stale-while-revalidate=1800",
        },
      },
    );
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
