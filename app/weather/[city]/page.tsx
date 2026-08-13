import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { CityWeatherView } from "@/components/weather/city-weather-view";
import type { Coordinates } from "@/hooks/use-geolocation";

function parseCoords(
  lat?: string | string[],
  lon?: string | string[],
): Coordinates | null {
  const latitude = Number(Array.isArray(lat) ? lat[0] : lat);
  const longitude = Number(Array.isArray(lon) ? lon[0] : lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

function first(value?: string | string[]): string | null {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.length > 0 ? v : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/weather/[city]">): Promise<Metadata> {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  return {
    title: `آب‌وهوای ${cityName}`,
    description: `وضعیت فعلی، پیش‌بینی ساعتی و هفتگی، کیفیت هوا و اطلاعات باد و بارش برای ${cityName}.`,
  };
}

export default async function CityWeatherPage({
  params,
  searchParams,
}: PageProps<"/weather/[city]">) {
  const { city } = await params;
  const sp = await searchParams;

  const cityName = decodeURIComponent(city);
  const coords = parseCoords(sp.lat, sp.lon);

  return (
    <div className="bg-background flex-1 py-8">
      <Container className="max-w-3xl">
        <CityWeatherView
          cityName={cityName}
          admin1={first(sp.admin1)}
          country={first(sp.country)}
          timezone={first(sp.timezone)}
          coords={coords}
        />
      </Container>
    </div>
  );
}
