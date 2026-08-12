import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="bg-background relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 py-16">
      {/* Quiet nod to the eventual hero surface — restrained on purpose */}
      <div
        aria-hidden="true"
        className="bg-condition-gradient pointer-events-none absolute -top-40 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
      />

      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      <div className="border-border bg-card shadow-soft-lg relative w-full max-w-md rounded-2xl border p-8 text-center">
        <span className="text-muted-foreground text-xs font-medium tracking-wide">
          در حال ساخت
        </span>

        <h1 className="text-card-foreground mt-3 text-2xl font-bold">
          داشبورد هوشمند آب‌وهوا
        </h1>

        <p className="text-muted-foreground mt-2 text-sm leading-6">
          پیش‌بینی ساعتی و هفتگی، کیفیت هوا و نمودارهای تعاملی — به‌زودی.
        </p>

        <div className="border-border mt-6 border-t pt-4">
          <p className="text-muted-foreground text-xs">
            Milestone 1 — پایه‌ی پروژه آماده است
          </p>
        </div>
      </div>
    </main>
  );
}
