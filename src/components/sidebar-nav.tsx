"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href + "/"));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <span className="ml-auto text-xs bg-primary/15 text-primary rounded-full px-1.5 py-0.5 tabular-nums">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
