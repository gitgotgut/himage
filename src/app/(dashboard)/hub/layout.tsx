"use client";

import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarNav, type SidebarNavItem } from "@/components/sidebar-nav";
import { useT } from "@/lib/i18n";

export default function HubLayout({ children }: { children: ReactNode }) {
  const t = useT();

  const NAV_ITEMS: SidebarNavItem[] = [
    { href: "/hub", label: t("modules.hub"), icon: LayoutDashboard },
  ];

  return (
    <>
      <DashboardHeader sidebarItems={NAV_ITEMS} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex flex-col w-56 border-r bg-card shrink-0">
          <SidebarNav items={NAV_ITEMS} />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
