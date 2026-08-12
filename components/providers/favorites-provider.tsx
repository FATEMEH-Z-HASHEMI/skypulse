"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FavoriteCity } from "@/types/favorite-city";

const KEY = "favorite-cities";

export function makeCityId(latitude: number, longitude: number) {
  return `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

interface FavoritesContextValue {
  items: FavoriteCity[];
  add: (city: FavoriteCity) => void;
  remove: (id: string) => void;
  toggle: (city: FavoriteCity) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteCity[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage read on mount
      if (raw) setItems(JSON.parse(raw) as FavoriteCity[]);
    } catch {
      // corrupted/unavailable storage — start empty
    }
  }, []);

  const add = useCallback((city: FavoriteCity) => {
    setItems((prev) => {
      if (prev.some((c) => c.id === city.id)) return prev;
      const next = [...prev, city];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const toggle = useCallback((city: FavoriteCity) => {
    setItems((prev) => {
      const exists = prev.some((c) => c.id === city.id);
      const next = exists
        ? prev.filter((c) => c.id !== city.id)
        : [...prev, city];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => items.some((c) => c.id === id),
    [items],
  );

  return (
    <FavoritesContext.Provider
      value={{ items, add, remove, toggle, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
