"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = RadixDialog.Root;
export const SheetTrigger = RadixDialog.Trigger;

export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof RadixDialog.Content>) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_150ms_ease-out]" />
      <RadixDialog.Content
        className={cn(
          // The app is RTL-only for now, so the panel's logical "end" edge
          // is physically the left — hence slide-in-from-left.
          "border-border bg-card fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col border-s shadow-2xl",
          "data-[state=open]:animate-[slide-in-from-left_200ms_ease-out]",
          "focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <RadixDialog.Close
          className="text-muted-foreground hover:bg-muted absolute end-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none"
          aria-label="بستن"
        >
          <X className="h-4 w-4" />
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export const SheetTitle = RadixDialog.Title;
export const SheetDescription = RadixDialog.Description;
export const SheetClose = RadixDialog.Close;
