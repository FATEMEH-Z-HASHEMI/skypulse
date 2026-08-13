import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui";

// recharts pulls in a sizeable chunk of its own (D3 internals) that isn't
// needed for the initial paint — the chart sits below the fold behind the
// hero/hourly/daily sections. Splitting it into its own chunk keeps it out
// of the main bundle; ssr:false because ResponsiveContainer measures the
// DOM on mount anyway, so there's nothing useful to render server-side.
export const WeatherChart = dynamic(
  () => import("./weather-chart").then((m) => m.WeatherChart),
  {
    ssr: false,
    loading: () => <Skeleton className="mt-4 h-[17.5rem] w-full rounded-2xl" />,
  },
);
