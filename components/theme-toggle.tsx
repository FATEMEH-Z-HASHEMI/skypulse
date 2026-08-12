"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Cycles light -> dark -> system. Only two hand-rolled icons are needed
 * here, so this stays dependency-free for now; once an icon library is
 * introduced for the wider app (Milestone 2/3), these can be swapped
 * for consistency.
 */
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
        "border-border bg-card text-foreground hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none",
        className,
      )}
    >
      {!mounted ? (
        <span className="h-5 w-5" />
      ) : isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
    </svg>
  );
}
