"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, AlertCircle, ArrowUpRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";

export function AnalyticsPreview() {
  const { t } = useTranslation();

  const subjects = [
    { name: "Matematik", score: 92, status: "Usta", isHigh: true },
    { name: "Türkçe / Edebiyat", score: 88, status: "Yetkin", isHigh: true },
    { name: "Fizik & Mekanik", score: 61, status: "Pratik Gerekli", isHigh: false },
  ];

  const weakTopics = [
    { topic: "İkinci Dereceden Denklemler", subject: "Matematik", accuracy: 52, questionsNeeded: 10 },
    { topic: "Polinomlar & Çarpanlara Ayırma", subject: "Matematik", accuracy: 61, questionsNeeded: 8 },
    { topic: "Newton'un Hareket Yasaları", subject: "Fizik", accuracy: 64, questionsNeeded: 12 },
  ];

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="py-1 px-3 mb-3 font-medium border border-border">
            <TrendingUp className="h-3.5 w-3.5 text-primary mr-1" />
            {t("analytics_preview.badge")}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {t("analytics_preview.title")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
            {t("analytics_preview.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Mastery */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">{t("analytics_preview.mastery_title")}</h3>
                <p className="text-xs text-muted-foreground">{t("analytics_preview.mastery_subtitle")}</p>
              </div>
              <Badge variant="secondary">10. Sınıf</Badge>
            </div>

            <div className="space-y-5">
              {subjects.map((subj) => (
                <div key={subj.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{subj.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{subj.status}</span>
                      <span className={`font-mono font-semibold ${subj.isHigh ? "text-success" : "text-foreground"}`}>
                        {subj.score}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={subj.score}
                    className="h-1.5"
                    indicatorClassName={subj.isHigh ? "bg-success" : "bg-primary"}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>12 dk önce güncellendi</span>
              <Link href="/progress" className="font-medium text-primary hover:underline flex items-center gap-1">
                Tüm Raporu İncele <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

          {/* Weak Topics */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    {t("analytics_preview.weak_topics_title")}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t("analytics_preview.weak_topics_subtitle")}</p>
                </div>
                <Badge variant="secondary">3 Uyarı</Badge>
              </div>

              <div className="space-y-3">
                {weakTopics.map((item) => (
                  <div
                    key={item.topic}
                    className="p-3 rounded-md bg-secondary border border-border flex items-center justify-between panel-hover"
                  >
                    <div>
                      <div className="text-xs font-medium text-foreground">{item.topic}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.subject} — %{item.accuracy} Doğruluk ({item.questionsNeeded} soru gerekli)
                      </div>
                    </div>

                    <Button size="sm" variant="brand" className="h-7 text-xs gap-1.5" asChild>
                      <Link href="/practice">
                        <Sparkles className="h-3 w-3" />
                        {t("analytics_preview.fix_btn")}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-3 rounded-md bg-primary/5 border border-primary/20 text-xs text-foreground">
              {t("analytics_preview.nova_strategy")}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
