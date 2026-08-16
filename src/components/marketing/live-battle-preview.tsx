"use client";

import * as React from "react";
import Link from "next/link";
import { Swords, Timer, Check, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/i18n/context";

import { chessAudio } from "@/lib/sound-effects";

export function LiveBattlePreview() {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = React.useState<string | null>("A");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (option === "A") {
      chessAudio.playCorrect();
    } else {
      chessAudio.playBlunder();
    }
  };

  return (
    <section id="battle" className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="warning" className="py-1 px-3 font-medium">
              <Swords className="h-3.5 w-3.5 mr-1" />
              {t("battle_preview.badge")}
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-tight">
              {t("battle_preview.title")}
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {t("battle_preview.desc")}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{t("battle_preview.feat1_title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("battle_preview.feat1_desc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-md bg-warning/15 text-warning flex items-center justify-center shrink-0 mt-0.5">
                  <Timer className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{t("battle_preview.feat2_title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("battle_preview.feat2_desc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{t("battle_preview.feat3_title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("battle_preview.feat3_desc")}</p>
                </div>
              </div>
            </div>

            <Button variant="brand" size="lg" className="gap-2" asChild>
              <Link href="/battle">
                <Swords className="h-4 w-4" />
                {t("battle_preview.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Right: Match Simulation */}
          <div className="lg:col-span-7">
            <Card className="p-6 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase">Oda:</span>
                  <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">
                    #SYN-8842
                  </span>
                  <Badge variant="warning" className="text-[10px]">
                    {t("battle_preview.live_match")}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary border border-border text-xs font-mono font-medium text-warning">
                  <Timer className="h-3.5 w-3.5" />
                  <span>Q 8 / 10 — 00:08s</span>
                </div>
              </div>

              {/* Players */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-md bg-primary/10 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center">
                        AL
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">Alex M.</div>
                        <div className="text-[10px] text-warning font-mono font-bold">1,310 ELO</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-mono">8 / 10</Badge>
                  </div>
                  <Progress value={80} className="h-1.5 mb-2" indicatorClassName="bg-primary" />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>80% İsabet</span>
                    <span className="font-semibold text-primary">Lider</span>
                  </div>
                </div>

                <div className="p-4 rounded-md bg-secondary border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-card text-foreground font-medium text-xs flex items-center justify-center border border-border">
                        SA
                      </div>
                      <div>
                        <div className="text-xs font-medium text-foreground">Sam K.</div>
                        <div className="text-[10px] text-warning font-mono font-bold">1,285 ELO</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-mono">7 / 10</Badge>
                  </div>
                  <Progress value={70} className="h-1.5 mb-2" indicatorClassName="bg-muted-foreground" />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>70% İsabet</span>
                    <span className="font-medium text-muted-foreground">Hızlı (1.4s)</span>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="p-4 rounded-md bg-background border border-border mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-primary font-mono">
                    Matematik: İkinci Dereceden Denklemler &amp; Kökler
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">Tıklayıp Deneyin</span>
                </div>
                <div className="text-sm font-medium text-foreground mb-3 leading-snug">
                  2x² - 8x + 6 = 0 denkleminin gerçel kökleri aşağıdakilerden hangisidir?
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelect("A")}
                    className={`p-3 rounded-md border text-left font-medium flex items-center justify-between transition-colors ${
                      selectedOption === "A"
                        ? "border-success bg-success/15 text-foreground font-semibold"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>A) x = 3, x = 1</span>
                    {selectedOption === "A" ? (
                      <span className="flex items-center gap-1 text-[11px] text-success font-semibold">
                        <Check className="h-3.5 w-3.5" /> Doğru
                      </span>
                    ) : (
                      <span className="text-[10px] text-success font-medium">Doğru Cevap</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect("B")}
                    className={`p-3 rounded-md border text-left font-medium flex items-center justify-between transition-colors ${
                      selectedOption === "B"
                        ? "border-destructive bg-destructive/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>B) x = 2, x = 4</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-secondary text-muted-foreground">Sam</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect("C")}
                    className={`p-3 rounded-md border text-left font-medium transition-colors ${
                      selectedOption === "C"
                        ? "border-destructive bg-destructive/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>C) x = -3, x = -1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect("D")}
                    className={`p-3 rounded-md border text-left font-medium transition-colors ${
                      selectedOption === "D"
                        ? "border-destructive bg-destructive/15 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>D) x = 1.5, x = 2</span>
                  </button>
                </div>
              </div>

              {/* NOVA Analysis */}
              <div className="p-3 rounded-md bg-secondary border border-border flex items-start gap-3">
                <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-xs leading-relaxed">
                  <span className="font-semibold text-foreground">NOVA Düello Analizi: </span>
                  <span className="text-muted-foreground">
                    Alex daha yüksek isabet sağladı (+%10), Sam ise soruları %28 daha hızlı yanıtladı. Her iki katılımcı da işaret değişimlerinde zorlandı.
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
