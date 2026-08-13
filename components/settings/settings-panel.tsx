"use client";
import { useTheme } from "next-themes";
import { Laptop, MapPin, Moon, Sun, X } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

function OptionGroup<T extends string>({
  groupLabel,
  options,
  value,
  onChange,
}: {
  groupLabel: string;
  options: { value: T; label: string; icon?: typeof Sun }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={groupLabel}
      className="bg-muted flex gap-1 rounded-lg p-1"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            opt.value === value
              ? "bg-card text-foreground shadow-soft-sm"
              : "text-muted-foreground",
          )}
        >
          {opt.icon && <opt.icon className="h-3.5 w-3.5" aria-hidden="true" />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border border-b p-6">
      <h3 className="text-foreground mb-3 text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { settings, update } = useSettings();
  const { items: favorites, remove: removeFavorite } = useFavorites();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <Section title="پوسته">
        <OptionGroup
          groupLabel="انتخاب پوسته"
          value={(theme as "light" | "dark" | "system") ?? "system"}
          onChange={setTheme}
          options={[
            { value: "light", label: "روشن", icon: Sun },
            { value: "dark", label: "تیره", icon: Moon },
            { value: "system", label: "سیستم", icon: Laptop },
          ]}
        />
      </Section>

      <Section title="واحد دما">
        <OptionGroup
          groupLabel="انتخاب واحد دما"
          value={settings.temperatureUnit}
          onChange={(v) => update({ temperatureUnit: v })}
          options={[
            { value: "celsius", label: "سلسیوس (°C)" },
            { value: "fahrenheit", label: "فارنهایت (°F)" },
          ]}
        />
      </Section>

      <Section title="واحد باد">
        <OptionGroup
          groupLabel="انتخاب واحد باد"
          value={settings.windUnit}
          onChange={(v) => update({ windUnit: v })}
          options={[
            { value: "kmh", label: "کیلومتر بر ساعت" },
            { value: "mph", label: "مایل بر ساعت" },
          ]}
        />
      </Section>

      <Section title="زبان">
        <OptionGroup
          groupLabel="انتخاب زبان"
          value={settings.language}
          onChange={(v) => update({ language: v })}
          options={[
            { value: "fa", label: "فارسی" },
            { value: "en", label: "English" },
          ]}
        />
      </Section>

      <Section title="موقعیت مکانی">
        <button
          type="button"
          role="switch"
          aria-checked={settings.autoDetectLocation}
          onClick={() =>
            update({ autoDetectLocation: !settings.autoDetectLocation })
          }
          className="border-border tap-scale flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm"
        >
          <span className="flex items-center gap-2">
            <MapPin
              className="text-muted-foreground h-4 w-4"
              aria-hidden="true"
            />
            تشخیص خودکار موقعیت
          </span>
          <span
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition-colors",
              settings.autoDetectLocation ? "bg-primary" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "bg-card absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-transform",
                settings.autoDetectLocation
                  ? "translate-x-0.5"
                  : "translate-x-4",
              )}
            />
          </span>
        </button>
      </Section>

      <Section title="شهرهای مورد علاقه">
        {favorites.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            هنوز شهری به علاقه‌مندی‌ها اضافه نکرده‌اید.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {favorites.map((city) => (
              <div
                key={city.id}
                className="border-border flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>
                  {city.name}
                  {city.admin1 && (
                    <span className="text-muted-foreground ms-1.5 text-xs">
                      {city.admin1}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => removeFavorite(city.id)}
                  aria-label={`حذف ${city.name}`}
                  className="text-muted-foreground hover:text-danger p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
