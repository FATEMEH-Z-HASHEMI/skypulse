"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";

export function SearchLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key === "k";
      if (!isShortcut) return;
      event.preventDefault();
      setOpen((current) => !current);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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
            type="text"
            placeholder="نام شهر را وارد کنید..."
            className="placeholder:text-muted-foreground h-14 flex-1 bg-transparent text-base focus-visible:outline-none"
          />
        </div>
        <div className="text-muted-foreground p-8 text-center text-sm">
          نتایج جستجو در Milestone 6 به این بخش اضافه می‌شوند.
        </div>
      </DialogContent>
    </Dialog>
  );
}
