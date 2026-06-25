"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, CreditCard, Shield, Menu } from "lucide-react";
import { HugoLogo } from "@/components/hugo-logo";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageToggle } from "@/components/language-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav, type SidebarNavItem } from "@/components/sidebar-nav";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "SEK", "NOK", "DKK", "CHF", "CAD", "AUD", "JPY"];

const MODULES = [
  { key: "hub", href: "/hub", icon: LayoutDashboard },
  { key: "subscriptions", href: "/subscriptions", icon: CreditCard },
  { key: "insurance", href: "/insurance", icon: Shield },
] as const;

export function DashboardHeader({ sidebarItems }: { sidebarItems: SidebarNavItem[] }) {
  const t = useT();
  const pathname = usePathname();
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((u) => {
        if (u?.displayCurrency) setDisplayCurrency(u.displayCurrency);
      })
      .catch(() => {});
  }, []);

  async function handleChangeCurrency(val: string) {
    setDisplayCurrency(val);
    await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayCurrency: val }),
    });
  }

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="border-b bg-card shrink-0">
        <div className="h-14 px-4 flex items-center justify-between gap-4">
          {/* Left: hamburger + logo + module tabs */}
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
              <HugoLogo size={22} />
              <span className="font-semibold tracking-tight text-sm">Hugo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {MODULES.map((mod) => {
                const active =
                  mod.href === "/hub"
                    ? pathname === "/hub"
                    : pathname.startsWith(mod.href);
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.key}
                    href={mod.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t(`modules.${mod.key}`)}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: currency + language + sign out */}
          <div className="flex items-center gap-2">
            <Select value={displayCurrency} onValueChange={handleChangeCurrency}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("common.signOut")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b">
            <SheetTitle className="flex items-center gap-2">
              <HugoLogo size={20} />
              Hugo
            </SheetTitle>
          </SheetHeader>
          {/* Module tabs in mobile */}
          <div className="px-3 pt-3 pb-1 flex flex-col gap-1">
            {MODULES.map((mod) => {
              const active =
                mod.href === "/hub"
                  ? pathname === "/hub"
                  : pathname.startsWith(mod.href);
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.key}
                  href={mod.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(`modules.${mod.key}`)}
                </Link>
              );
            })}
          </div>
          <div className="border-t mt-2">
            <SidebarNav items={sidebarItems} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
