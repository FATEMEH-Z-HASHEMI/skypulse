"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSettings } from "@/hooks/use-settings";
import type { GeocodingResult } from "@/types/geocoding";

type Status = "idle" | "loading" | "success" | "error";

export function useCitySearch(query: string) {
  const { settings } = useSettings();
  const debounced = useDebounce(query.trim(), 300);
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<GeocodingResult[]>([]);

  useEffect(() => {
    if (debounced.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting on debounced-query change, not a render-time computation
      setStatus("idle");
      setResults([]);
      return;
    }
    let cancelled = false;
    setStatus("loading");

    fetch(
      `/api/geocoding?query=${encodeURIComponent(debounced)}&language=${settings.language}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("search failed");
        return res.json();
      })
      .then((data: { results?: GeocodingResult[] }) => {
        if (cancelled) return;
        setResults(data.results ?? []);
        setStatus("success");
      })
      .catch(() => {
        if (cancelled) return;
        setResults([]);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, settings.language]);

  return { status, results };
}
