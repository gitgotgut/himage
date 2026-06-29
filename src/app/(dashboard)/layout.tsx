"use client";

import type { ReactNode } from "react";
import { Images } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarNav, type SidebarNavItem } from "@/components/sidebar-nav";

const NAV_ITEMS: SidebarNavItem[] = [
  { href: "/hub", label: "Albums", icon: Images },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader sidebarItems={NAV_ITEMS} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex flex-col w-56 border-r bg-card shrink-0">
          <SidebarNav items={NAV_ITEMS} />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
