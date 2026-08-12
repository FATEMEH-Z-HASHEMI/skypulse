"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { Clock, MapPin, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from "@/components/ui";
import { useCitySearch } from "@/hooks/use-city-search";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { cn } from "@/lib/utils";
import type { GeocodingResult } from "@/types/geocoding";

export function SearchLauncher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { status, results } = useCitySearch(query);
  const { items: recent, add: addRecent } = useRecentSearches();

  const showingRecent = query.trim().length < 2;
  const list = showingRecent ? recent : results;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear query on dialog close, not derivable during render
    if (!open) setQuery("");
  }, [open]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset selection when the result list changes
  useEffect(() => setActiveIndex(0), [query, status]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key === "k";
      if (!isShortcut) return;
      event.preventDefault();
      setOpen((current) => !current);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSelect(city: GeocodingResult) {
    addRecent(city);
    setOpen(false);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, list.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const city = list[activeIndex];
      if (city) handleSelect(city);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-border bg-muted/60 text-muted-foreground hover:border-ring/40 hidden h-10 w-full max-w-sm items-center gap-2 rounded-lg border px-3 text-sm transition-colors md:flex"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-start">جستجوی شهر...</span>
          <kbd
            dir="ltr"
            className="border-border bg-card rounded border px-1.5 py-0.5 font-sans text-[10px]"
          >
            ⌘K
          </kbd>
        </button>
      </DialogTrigger>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="جستجوی شهر"
          className="border-border text-foreground hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="p-0" aria-describedby={undefined}>
        <DialogTitle className="sr-only">جستجوی شهر</DialogTitle>
        <DialogDescription className="sr-only">
          نام یک شهر را برای مشاهده‌ی آب‌وهوای آن تایپ کنید.
        </DialogDescription>

        <div className="border-border flex items-center gap-3 border-b px-4">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            type="text"
            placeholder="نام شهر را وارد کنید..."
            className="placeholder:text-muted-foreground h-14 flex-1 bg-transparent text-base focus-visible:outline-none"
            role="combobox"
            aria-expanded={list.length > 0}
            aria-controls="search-results-list"
            aria-activedescendant={
              list[activeIndex]
                ? `search-result-${list[activeIndex].id}`
                : undefined
            }
          />
        </div>

        <div
          id="search-results-list"
          role="listbox"
          className="max-h-80 overflow-y-auto p-2"
        >
          {showingRecent && recent.length > 0 && (
            <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
              جستجوهای اخیر
            </p>
          )}
          {showingRecent && recent.length === 0 && (
            <p className="text-muted-foreground p-6 text-center text-sm">
              نام یک شهر را تایپ کنید.
            </p>
          )}

          {!showingRecent && status === "loading" && (
            <div className="flex flex-col gap-2 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {!showingRecent && status === "error" && (
            <p className="text-danger p-6 text-center text-sm">
              مشکلی در جستجو پیش آمد. دوباره تلاش کنید.
            </p>
          )}
          {!showingRecent && status === "success" && results.length === 0 && (
            <p className="text-muted-foreground p-6 text-center text-sm">
              شهری با این نام پیدا نشد.
            </p>
          )}

          {list.map((city, i) => (
            <button
              key={city.id}
              id={`search-result-${city.id}`}
              type="button"
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
                i === activeIndex ? "bg-muted" : "hover:bg-muted/60",
              )}
            >
              {showingRecent ? (
                <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
              ) : (
                <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />
              )}
              <span className="flex-1">
                <span className="font-medium">{city.name}</span>
                {(city.admin1 || city.country) && (
                  <span className="text-muted-foreground ms-1.5 text-xs">
                    {[city.admin1, city.country].filter(Boolean).join("، ")}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
