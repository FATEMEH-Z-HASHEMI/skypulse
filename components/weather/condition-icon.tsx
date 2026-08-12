import { Cloud, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react";
import type { WeatherConditionKey } from "@/types/weather-condition";

const ICONS: Record<WeatherConditionKey, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudLightning,
  snow: CloudSnow,
};

export function ConditionIcon({
  conditionKey,
  className,
}: {
  conditionKey: WeatherConditionKey;
  className?: string;
}) {
  const Icon = ICONS[conditionKey];
  return <Icon className={className} aria-hidden="true" />;
}
