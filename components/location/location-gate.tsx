"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Skeleton } from "@/components/ui";

interface Resolved {
  cityName: string;
  temperature: number;
  conditionLabel: string;
}

export function LocationGate() {
  const { status, coords, request } = useGeolocation();
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    request();
    // Only ever run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "granted" || !coords) return;
    let cancelled = false;

    (async () => {
      try {
        const [cityRes, weatherRes] = await Promise.all([
          fetch(
            `/api/geocoding/reverse?latitude=${coords.latitude}&longitude=${coords.longitude}`,
          ),
          fetch(
            `/api/weather?latitude=${coords.latitude}&longitude=${coords.longitude}`,
          ),
        ]);
        if (!cityRes.ok || !weatherRes.ok) throw new Error("upstream error");
        const city = await cityRes.json();
        const weather = await weatherRes.json();
        if (cancelled) return;
        setResolved({
          cityName: city.name,
          temperature: Math.round(weather.current.temperature),
          conditionLabel: weather.current.condition.label,
        });
      } catch {
        if (!cancelled) setFetchFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, coords]);

  const isLoading =
    status === "idle" ||
    status === "loading" ||
    (status === "granted" && !resolved && !fetchFailed);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (
    status === "denied" ||
    status === "unsupported" ||
    status === "error" ||
    fetchFailed
  ) {
    return (
      <p className="text-muted-foreground text-sm">
        موقعیت شما مشخص نشد — از جستجو (⌘K) برای انتخاب شهر استفاده کنید.
      </p>
    );
  }

  if (!resolved) return null;

  return (
    <p className="text-sm">
      <span className="font-bold">{resolved.cityName}</span> —{" "}
      {resolved.temperature}°، {resolved.conditionLabel}
    </p>
  );
}
