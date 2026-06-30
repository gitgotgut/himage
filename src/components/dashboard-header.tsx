"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav, type SidebarNavItem } from "@/components/sidebar-nav";

export function DashboardHeader({ sidebarItems }: { sidebarItems: SidebarNavItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="border-b bg-card shrink-0">
        <div className="h-14 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/hub" className="flex items-center gap-2">
              <Images className="h-5 w-5 text-primary" />
              <span className="font-semibold tracking-tight text-sm">himage</span>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b">
            <SheetTitle className="flex items-center gap-2">
              <Images className="h-5 w-5 text-primary" />
              himage
            </SheetTitle>
          </SheetHeader>
          <SidebarNav items={sidebarItems} />
        </SheetContent>
      </Sheet>
    </>
  );
}
