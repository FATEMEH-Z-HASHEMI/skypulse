import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="bg-condition-gradient flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
        پ
      </span>
      <span className="text-base font-bold tracking-tight">پیش‌بین</span>
    </Link>
  );
}
