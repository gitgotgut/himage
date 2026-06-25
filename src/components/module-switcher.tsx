"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Shield } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MODULES = [
  { key: "hub", href: "/hub", icon: LayoutDashboard },
  { key: "subscriptions", href: "/dashboard", icon: CreditCard },
  { key: "insurance", href: "/insurance", icon: Shield },
] as const;

export function ModuleSwitcher() {
  const t = useT();
  const pathname = usePathname();

  return (
    <nav className="border-b bg-card">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-0">
        {MODULES.map((mod) => {
          const active = mod.href === "/dashboard" || mod.href === "/hub"
            ? pathname === mod.href
            : pathname.startsWith(mod.href);
          const Icon = mod.icon;
          return (
            <Link
              key={mod.key}
              href={mod.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(`modules.${mod.key}`)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
