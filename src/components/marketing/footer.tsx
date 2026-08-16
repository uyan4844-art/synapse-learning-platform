"use client";

import * as React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useTranslation, SUPPORTED_LOCALES, type Locale } from "@/i18n/context";

export function Footer() {
  const { t, setLocale } = useTranslation();

  return (
    <footer className="border-t border-border bg-card py-12 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <BrandLogo />
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              {t("footer.desc")}
            </p>
            <div className="text-[11px] text-muted-foreground font-mono">
              &copy; {new Date().getFullYear()} {t("footer.rights")}
            </div>
          </div>

          <div>
            <div className="font-semibold text-foreground mb-3 uppercase tracking-wider text-[11px]">
              {t("footer.col_product")}
            </div>
            <ul className="space-y-2">
              <li><Link href="/practice" className="hover:text-primary transition-colors">{t("nav.practice")}</Link></li>
              <li><Link href="/battle" className="hover:text-primary transition-colors">{t("nav.battle")}</Link></li>
              <li><Link href="/progress" className="hover:text-primary transition-colors">{t("nav.progress")}</Link></li>
              <li><Link href="/achievements" className="hover:text-primary transition-colors">{t("nav.achievements")}</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">{t("header.pricing")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground mb-3 uppercase tracking-wider text-[11px]">
              {t("footer.col_education")}
            </div>
            <ul className="space-y-2">
              <li><span className="hover:text-primary cursor-pointer">LGS & YKS (TYT/AYT)</span></li>
              <li><span className="hover:text-primary cursor-pointer">SAT & AP Program</span></li>
              <li><span className="hover:text-primary cursor-pointer">GCSE & A-Levels (UK)</span></li>
              <li><span className="hover:text-primary cursor-pointer">Abitur (Almanya)</span></li>
              <li><span className="hover:text-primary cursor-pointer">Baccalauréat (Fransa)</span></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground mb-3 uppercase tracking-wider text-[11px]">
              {t("footer.col_languages")}
            </div>
            <ul className="space-y-2">
              {SUPPORTED_LOCALES.map((l) => (
                <li key={l.code}>
                  <button
                    type="button"
                    onClick={() => setLocale(l.code)}
                    className="hover:text-primary transition-colors"
                  >
                    {l.nativeName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground">{t("footer.terms")}</Link>
            <Link href="/privacy" className="hover:text-foreground">{t("footer.privacy")}</Link>
            <Link href="/security" className="hover:text-foreground">{t("footer.security")}</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-medium">{t("footer.status")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
