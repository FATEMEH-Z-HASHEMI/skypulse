export interface AqiLevel {
  max: number;
  label: string;
  textClass: string;
  barClass: string;
}

export const AQI_LEVELS: AqiLevel[] = [
  { max: 50, label: "خوب", textClass: "text-success", barClass: "bg-success" },
  {
    max: 100,
    label: "متوسط",
    textClass: "text-warning",
    barClass: "bg-warning",
  },
  {
    max: 150,
    label: "ناسالم برای گروه‌های حساس",
    textClass: "text-[#e8792b]",
    barClass: "bg-[#e8792b]",
  },
  {
    max: 200,
    label: "ناسالم",
    textClass: "text-danger",
    barClass: "bg-danger",
  },
  {
    max: 300,
    label: "خیلی ناسالم",
    textClass: "text-[#8f3f97]",
    barClass: "bg-[#8f3f97]",
  },
  {
    max: Infinity,
    label: "خطرناک",
    textClass: "text-[#7e0023]",
    barClass: "bg-[#7e0023]",
  },
];

export function getAqiLevel(aqi: number): AqiLevel {
  return (
    AQI_LEVELS.find((l) => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1]
  );
}
