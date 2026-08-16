"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Swords,
  TrendingUp,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";

export function DesktopSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), href: "/", icon: Home },
    { label: t("nav.practice"), href: "/practice", icon: BookOpen, badge: t("nav.badge_youtube") },
    { label: t("nav.battle"), href: "/battle", icon: Swords, accent: true },
    { label: t("nav.progress"), href: "/progress", icon: TrendingUp },
    { label: t("nav.achievements"), href: "/achievements", icon: Award },
    { label: t("nav.profile"), href: "/profile", icon: User },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-200 h-screen sticky top-0 z-30 shrink-0",
        collapsed ? "w-[80px]" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border">
        <BrandLogo collapsed={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hidden lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Gamification / Streak Status Widget */}
      {!collapsed && (
        <div className="mx-4 my-4 p-3.5 rounded-lg bg-secondary border border-border flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-warning">
              <Zap className="h-4 w-4" />
              {t("nav.streak", { count: 5 })}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-card border border-warning/30 text-xs font-mono font-bold text-warning">
              <span>1,248 ELO</span>
            </div>
          </div>
          <div className="w-full bg-background rounded-sm h-1.5 overflow-hidden">
            <div className="bg-warning h-1.5 rounded-sm transition-all" style={{ width: "70%" }} />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-primary" : "")} />
              {!collapsed && (
                <span className="flex-1 truncate text-sm">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-foreground font-semibold border border-border">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Quick Action */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="default"
            className="w-full justify-center gap-2 border-primary/40 text-primary hover:bg-primary/10 text-sm font-semibold h-10"
            asChild
          >
            <Link href="/battle">
              <Swords className="h-4 w-4 text-warning" />
              Canlı Düello Oyna
            </Link>
          </Button>
        </div>
      )}
    </aside>
  );
}
