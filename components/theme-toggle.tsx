"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Cycles light -> dark -> system. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: the real theme is only known client-side.
  // This is next-themes' documented pattern, not a state-sync anti-pattern —
  // the effect runs exactly once, purely to flip a "safe to read theme" flag.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  function cycleTheme() {
    if (theme === "system") setTheme(isDark ? "light" : "dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("dark");
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={isDark ? "روشن‌کردن حالت روز" : "روشن‌کردن حالت شب"}
      title={isDark ? "حالت روز" : "حالت شب"}
      className={cn(
        "border-border bg-card text-foreground hover:bg-muted tap-scale inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none",
        className,
      )}
    >
      {!mounted ? (
        <span className="h-4 w-4" />
      ) : isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
