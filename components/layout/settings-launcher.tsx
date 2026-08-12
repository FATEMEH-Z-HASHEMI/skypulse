"use client";

import { Settings as SettingsIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";

export function SettingsLauncher() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="تنظیمات"
          className="border-border text-foreground hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-full border"
        >
          <SettingsIcon className="h-4 w-4" />
        </button>
      </SheetTrigger>

      <SheetContent aria-describedby={undefined}>
        <div className="border-border border-b p-6">
          <SheetTitle className="text-lg font-bold">تنظیمات</SheetTitle>
          <SheetDescription className="text-muted-foreground mt-1 text-sm">
            واحد دما، زبان، تم و مدیریت شهرهای ذخیره‌شده.
          </SheetDescription>
        </div>
        <div className="text-muted-foreground flex flex-1 items-center justify-center p-8 text-center text-sm">
          محتوای این بخش در Milestone 14 اضافه می‌شود.
        </div>
      </SheetContent>
    </Sheet>
  );
}
