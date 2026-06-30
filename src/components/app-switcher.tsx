"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGrid, Heart, CreditCard, CalendarDays, Images, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AppKey = "hifamily" | "hugo" | "plans" | "photo";

const APPS: {
  key: AppKey;
  label: string;
  icon: typeof Heart;
  url: string;
}[] = [
  { key: "hifamily", label: "hifamily", icon: Heart, url: process.env.NEXT_PUBLIC_HIFAMILY_URL || "http://localhost:3000" },
  { key: "hugo", label: "Subscriptions", icon: CreditCard, url: process.env.NEXT_PUBLIC_HUGO_URL || "http://localhost:3001" },
  { key: "plans", label: "Events", icon: CalendarDays, url: process.env.NEXT_PUBLIC_PLANS_URL || "http://localhost:3002" },
  { key: "photo", label: "Photos", icon: Images, url: process.env.NEXT_PUBLIC_PHOTO_URL || "http://localhost:3003" },
];

// Cross-platform launcher menu shared by every hifamily app's header.
export function AppSwitcher({ current }: { current: AppKey }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function items(): HTMLElement[] {
      return Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? []
      );
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const list = items();
        if (list.length === 0) return;
        const idx = list.indexOf(document.activeElement as HTMLElement);
        const next =
          e.key === "ArrowDown"
            ? (idx + 1) % list.length
            : (idx - 1 + list.length) % list.length;
        list[next]?.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    // Move focus into the menu when it opens.
    items()[0]?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Switch app"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            role="menu"
            aria-label="hifamily apps"
            className="absolute right-0 mt-2 w-52 rounded-lg border bg-card shadow-lg z-50 p-1"
          >
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              hifamily apps
            </p>
            {APPS.map((app) => {
              const Icon = app.icon;
              const isCurrent = app.key === current;
              const inner = (
                <span className="flex items-center gap-2 px-3 py-2 rounded-md text-sm">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{app.label}</span>
                  {isCurrent && <Check className="h-3.5 w-3.5 text-primary" />}
                </span>
              );
              return isCurrent ? (
                <div
                  key={app.key}
                  role="menuitem"
                  aria-current="true"
                  tabIndex={-1}
                  className="cursor-default opacity-70 outline-none"
                >
                  {inner}
                </div>
              ) : (
                <a
                  key={app.key}
                  role="menuitem"
                  href={app.url}
                  tabIndex={0}
                  className="block rounded-md outline-none hover:bg-muted focus:bg-muted"
                >
                  {inner}
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
