"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Youtube, Swords, Check, PlayCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n/context";

export function HeroSection() {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = React.useState("https://www.youtube.com/watch?v=kYIPFmJ0j9M");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { t } = useTranslation();

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;
    setIsSubmitting(true);
    try {
      localStorage.setItem("synapse_hero_url", youtubeUrl);
    } catch {
      // ignore
    }
    setTimeout(() => {
      router.push(`/practice?url=${encodeURIComponent(youtubeUrl)}`);
    }, 400);
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Platform Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="secondary" className="py-1 px-3 text-xs font-medium border border-border">
            <Sparkles className="h-3 w-3 text-primary mr-1" />
            {t("hero.badge")} — 2026-2027 Müfredatı
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.15] max-w-3xl mx-auto mb-6">
          {t("hero.title_start")}{" "}
          <span className="text-primary">
            {t("hero.title_highlight")}
          </span>{" "}
          {t("hero.title_end")}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("hero.description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Button variant="brand" size="xl" className="w-full sm:w-auto gap-2 group" asChild>
            <Link href="/register">
              {t("hero.cta_practice")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>

          <Button variant="chessDark" size="xl" className="w-full sm:w-auto gap-2" asChild>
            <Link href="/battle">
              <Swords className="h-4 w-4 text-warning" />
              {t("hero.cta_battle")}
            </Link>
          </Button>
        </div>

        {/* Trust Badges - Using success (#2E9E5B) for positive confirmation */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-muted-foreground mb-12">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-border">
            <Check className="h-3.5 w-3.5 text-success" />
            <span>{t("hero.trust_no_card")}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-border">
            <Check className="h-3.5 w-3.5 text-success" />
            <span>{t("hero.trust_languages")}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-border">
            <Check className="h-3.5 w-3.5 text-success" />
            <span>{t("hero.trust_exams")}</span>
          </div>
        </div>

        {/* Clean Student-Friendly Interactive Product Card */}
        <Card className="max-w-3xl mx-auto p-5 sm:p-7 text-left border-border bg-card shadow-elevated">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border mb-5">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Ders Videosundan Anında Test Oluştur</h3>
                <p className="text-xs text-muted-foreground">YouTube linkini yapıştırın, yapay zeka sınav formatında test üretsin</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[11px] self-start sm:self-auto">
              Akıllı Müfredat Analizi
            </Badge>
          </div>

          <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500 flex items-center">
                <Youtube className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder={t("hero.input_placeholder")}
                required
              />
            </div>

            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              className="h-11 px-6 w-full sm:w-auto gap-2 shrink-0 font-semibold"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isSubmitting ? "Hazırlanıyor..." : t("hero.btn_generate")}
            </Button>
          </form>

          {/* Clean 4-Step Process Guide */}
          <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>1. Video Linki</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span>2. Konu & Seviye</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span>3. Soru Sentezi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span>4. Pekiştirme & Analiz</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
