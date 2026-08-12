"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: ComponentProps<typeof RadixDialog.Content> & { showClose?: boolean }) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
          "data-[state=open]:animate-[fade-in_150ms_ease-out]",
        )}
      />
      <RadixDialog.Content
        className={cn(
          "border-border bg-card fixed top-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border shadow-2xl",
          "data-[state=open]:animate-[scale-in_150ms_ease-out]",
          "focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <RadixDialog.Close
            className="text-muted-foreground hover:bg-muted absolute end-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </RadixDialog.Close>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export const DialogTitle = RadixDialog.Title;
export const DialogDescription = RadixDialog.Description;
export const DialogClose = RadixDialog.Close;
