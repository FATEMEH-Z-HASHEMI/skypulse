"use client";
import { useCallback, useEffect, useState } from "react";
import type { GeocodingResult } from "@/types/geocoding";

const KEY = "recent-searches";
const MAX = 5;

export function useRecentSearches() {
  const [items, setItems] = useState<GeocodingResult[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage read on mount
      if (raw) setItems(JSON.parse(raw) as GeocodingResult[]);
    } catch {
      // corrupted/unavailable storage — start empty
    }
  }, []);

  const add = useCallback((city: GeocodingResult) => {
    setItems((prev) => {
      const next = [city, ...prev.filter((c) => c.id !== city.id)].slice(
        0,
        MAX,
      );
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // quota/unavailable — keep in-memory only
      }
      return next;
    });
  }, []);

  return { items, add };
}
