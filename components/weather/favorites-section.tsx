"use client";
import { useFavorites } from "@/hooks/use-favorites";
import { FavoriteCityCard } from "@/components/weather/favorite-city-card";

export function FavoritesSection() {
  const { items, remove } = useFavorites();

  return (
    <div className="mt-4">
      <h2 className="text-foreground mb-3 text-sm font-bold">
        شهرهای مورد علاقه
      </h2>

      {items.length === 0 ? (
        <div className="border-border bg-card shadow-soft-sm rounded-2xl border p-6 text-center">
          <p className="text-muted-foreground text-sm">
            هنوز شهری اضافه نکرده‌اید.
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            از جستجو (⌘K) یک شهر پیدا کنید و روی آیکون قلب بزنید.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((city) => (
            <FavoriteCityCard
              key={city.id}
              city={city}
              onRemove={() => remove(city.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
