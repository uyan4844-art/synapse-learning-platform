import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showBadge?: boolean;
  collapsed?: boolean;
}

export function BrandLogo({ className, showBadge = true, collapsed = false }: BrandLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div className="relative flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground font-semibold">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 text-white"
        >
          <circle cx="12" cy="5" r="2.5" />
          <path d="M9 9.5c0-.8.7-1.5 1.5-1.5h3c.8 0 1.5.7 1.5 1.5 0 1.5-1 2.8-1 4.5h-4c0-1.7-1-3-1-4.5z" />
          <path d="M7 16.5c0-.8.7-1.5 1.5-1.5h7c.8 0 1.5.7 1.5 1.5v.5H7v-.5z" />
          <path d="M5.5 20c0-.8.7-1.5 1.5-1.5h10c.8 0 1.5.7 1.5 1.5v1H5.5v-1z" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tight text-base text-foreground leading-none">
              SYNAPSE
            </span>
            {showBadge && (
              <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
                BETA
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
            Adaptive Learning Platform
          </span>
        </div>
      )}
    </Link>
  );
}
