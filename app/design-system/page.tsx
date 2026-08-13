import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Input,
  Skeleton,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Design System",
};

// Literal class strings on purpose — Tailwind's build-time scanner can't
// see classes assembled from a template string like `bg-${name}`.
const colorSwatches = [
  { className: "bg-background", label: "Background" },
  { className: "bg-card", label: "Card" },
  { className: "bg-border", label: "Border" },
  { className: "bg-muted", label: "Muted" },
  { className: "bg-primary", label: "Primary" },
  { className: "bg-success", label: "Success" },
  { className: "bg-warning", label: "Warning" },
  { className: "bg-danger", label: "Danger" },
] as const;

const conditionSwatches = [
  { key: "sunny", label: "آفتابی" },
  { key: "cloudy", label: "ابری" },
  { key: "rain", label: "بارانی" },
  { key: "storm", label: "طوفانی" },
  { key: "snow", label: "برفی" },
] as const;

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-10">
      <h2 className="text-foreground text-xl font-bold">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="bg-background pb-24">
      <Container>
        <header className="border-border border-b py-10">
          <span className="text-muted-foreground text-xs font-medium tracking-wide">
            Milestone 2
          </span>
          <h1 className="text-foreground mt-2 text-3xl font-bold">
            سیستم طراحی
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
            رنگ‌ها، تایپوگرافی، و کامپوننت‌های پایه‌ای که بقیه‌ی داشبورد از روی
            آن‌ها ساخته می‌شود.
          </p>
        </header>

        <Section
          title="تایپوگرافی"
          description="یک خانواده‌فونت Variable (Vazirmatn)، متمایزشده با وزن و اندازه."
        >
          <div className="flex flex-col gap-4">
            <p className="text-4xl font-extrabold tracking-tight">
              پیش‌بینی امروز
            </p>
            <p className="text-2xl font-bold">تهران، صاف</p>
            <p className="text-base leading-7">
              متن معمولی برای پاراگراف‌ها و توضیحات با خوانایی مناسب در اندازه‌ی
              پایه.
            </p>
            <p className="text-muted-foreground text-sm">
              متن ثانویه و کم‌رنگ‌تر برای برچسب‌ها و جزئیات کم‌اهمیت‌تر.
            </p>
            <p className="tabular text-6xl font-extrabold">
              ۲۴<span className="align-top text-3xl font-medium">°</span>
            </p>
          </div>
        </Section>

        <Section
          title="رنگ‌ها"
          description="توکن‌های سیمانتیک — بین حالت روشن و تاریک جابه‌جا می‌شوند."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {colorSwatches.map((c) => (
              <div key={c.className} className="flex flex-col gap-2">
                <div
                  className={`border-border h-16 rounded-lg border ${c.className}`}
                />
                <span className="text-muted-foreground text-xs">{c.label}</span>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground mt-8 mb-3 text-sm">
            گرادیان‌های وضعیت آب‌وهوا — فقط روی کارت اصلی استفاده می‌شوند
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {conditionSwatches.map((c) => (
              <div key={c.key} className="flex flex-col gap-2">
                <div
                  data-condition={c.key}
                  className="bg-condition-gradient h-16 rounded-lg"
                />
                <span className="text-muted-foreground text-xs">{c.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="دکمه‌ها">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">دکمه‌ی اصلی</Button>
            <Button variant="secondary">ثانویه</Button>
            <Button variant="outline">حاشیه‌دار</Button>
            <Button variant="ghost">شبح</Button>
            <Button variant="destructive">حذف</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">کوچک</Button>
            <Button size="md">متوسط</Button>
            <Button size="lg">بزرگ</Button>
            <Button size="icon" variant="outline" aria-label="افزودن">
              +
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button isLoading>در حال بارگذاری</Button>
            <Button disabled>غیرفعال</Button>
          </div>
        </Section>

        <Section title="ورودی‌ها">
          <div className="grid max-w-lg gap-4">
            <Input label="جستجوی شهر" placeholder="مثلاً تهران" />
            <Input
              label="جستجو"
              placeholder="نام شهر را وارد کنید"
              icon={<SearchIcon />}
            />
            <Input
              label="ایمیل"
              placeholder="you@example.com"
              helperText="فقط برای اعلان‌های هوا استفاده می‌شود."
            />
            <Input
              label="نام شهر"
              defaultValue="Atlantiss"
              error="شهری با این نام پیدا نشد."
            />
          </div>
        </Section>

        <Section title="نشان‌ها (Badge)">
          <div className="flex flex-wrap gap-2">
            <Badge>پیش‌فرض</Badge>
            <Badge variant="primary">اطلاعات</Badge>
            <Badge variant="success">هوای پاک</Badge>
            <Badge variant="warning">احتمال بارش ۶۰٪</Badge>
            <Badge variant="danger">هشدار طوفان</Badge>
            <Badge variant="outline">حاشیه‌دار</Badge>
          </div>
        </Section>

        <Section title="کارت">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>تهران</CardTitle>
                <CardDescription>به‌روزرسانی ۲ دقیقه پیش</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="tabular text-5xl font-extrabold">۲۴°</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  صاف، احساس مانند ۲۲°
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Badge variant="primary">رطوبت ۴۵٪</Badge>
                <Badge variant="outline">باد ۱۲ km/h</Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حالت بارگذاری</CardTitle>
                <CardDescription>
                  Skeleton برای زمان دریافت داده
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          </div>
        </Section>
      </Container>
    </div>
  );
}
