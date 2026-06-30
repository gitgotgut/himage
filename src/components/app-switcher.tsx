"use client";

import { useState } from "react";
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

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label="Switch app"
        onClick={() => setOpen((o) => !o)}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 rounded-lg border bg-card shadow-lg z-50 p-1">
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              hifamily apps
            </p>
            {APPS.map((app) => {
              const Icon = app.icon;
              const isCurrent = app.key === current;
              const inner = (
                <span className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{app.label}</span>
                  {isCurrent && <Check className="h-3.5 w-3.5 text-primary" />}
                </span>
              );
              return isCurrent ? (
                <div key={app.key} className="cursor-default opacity-70">
                  {inner}
                </div>
              ) : (
                <a key={app.key} href={app.url} className="block">
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
