"use client";

import * as React from "react";
import { BookOpen, Target, BarChart3, Zap, Swords } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n/context";

export function ProductPillars() {
  const { t } = useTranslation();

  const pillars = [
    { step: "01", title: t("pillars.p1_title"), description: t("pillars.p1_desc"), icon: BookOpen, tag: "Multi-Source" },
    { step: "02", title: t("pillars.p2_title"), description: t("pillars.p2_desc"), icon: Target, tag: "Adaptive" },
    { step: "03", title: t("pillars.p3_title"), description: t("pillars.p3_desc"), icon: BarChart3, tag: "NOVA AI" },
    { step: "04", title: t("pillars.p4_title"), description: t("pillars.p4_desc"), icon: Zap, tag: "Remediation" },
    { step: "05", title: t("pillars.p5_title"), description: t("pillars.p5_desc"), icon: Swords, tag: "Elo Arena" },
  ];

  return (
    <section id="features" className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-primary">
            {t("pillars.tag")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mt-2 mb-4">
            {t("pillars.title")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t("pillars.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.step}
                className="group relative p-5 border-border hover:border-primary panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {pillar.step}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded-sm bg-secondary text-muted-foreground border border-border">
                      {pillar.tag}
                    </span>
                  </div>

                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-sm font-semibold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-border text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Öğrenmeye Başla &rarr;
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
