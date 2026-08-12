import Link from "next/link";
import { CurrentWeatherSection } from "@/components/weather/current-weather-section";
import { Container } from "@/components/ui";

export default function Home() {
  return (
    <div className="bg-background flex-1 py-8">
      <Container className="max-w-3xl">
        <CurrentWeatherSection />
        <p className="mt-6 text-center">
          <Link
            href="/design-system"
            className="text-primary text-xs font-medium underline-offset-4 hover:underline"
          >
            مشاهده‌ی Design System ←
          </Link>
        </p>
      </Container>
    </div>
  );
}
