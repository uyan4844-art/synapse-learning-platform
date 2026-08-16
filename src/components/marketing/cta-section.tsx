"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background border-t border-border relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4 leading-tight">
          {t("cta.title")}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          {t("cta.description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="brand" size="lg" className="w-full sm:w-auto gap-2 px-8" asChild>
            <Link href="/register">
              <Sparkles className="h-4 w-4" />
              {t("cta.btn_register")}
            </Link>
          </Button>

          <Button variant="chessDark" size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/login">{t("cta.btn_login")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
