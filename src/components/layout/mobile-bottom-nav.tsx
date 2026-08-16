"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Swords, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/context";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.practice"), href: "/practice", icon: BookOpen },
    { label: t("nav.battle"), href: "/battle", icon: Swords, highlight: true },
    { label: t("nav.progress"), href: "/progress", icon: TrendingUp },
    { label: t("nav.profile"), href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 relative"
                aria-label={item.label}
              >
                <div
                  className={cn(
                    "h-11 w-11 rounded-lg flex items-center justify-center bg-primary text-primary-foreground transition-colors",
                    isActive ? "ring-2 ring-primary/30" : ""
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium mt-1 text-primary">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors min-w-[52px]",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
