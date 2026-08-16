import * as React from "react";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { AppHeader } from "@/components/layout/app-header";

interface AppShellProps {
  children: React.ReactNode;
  isMarketing?: boolean;
}

export function AppShell({ children, isMarketing = false }: AppShellProps) {
  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-600">
        <AppHeader isMarketing={true} />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Persistent Sidebar */}
      <DesktopSidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <AppHeader isMarketing={false} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Ergonomic Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
