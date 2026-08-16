"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  GraduationCap, Languages, Code, Brain, Check, Sparkles,
  ArrowRight, ArrowLeft, Target, Globe, Clock, CheckCircle2, Loader2
} from "lucide-react";
import { useTranslation, SUPPORTED_LOCALES, type Locale } from "@/i18n/context";
import { LEARNING_TRACKS, DAILY_STUDY_TARGETS } from "@/config/learning-goals";
import { updateProfileServerAction } from "@/lib/supabase/profile-actions";

const trackIcons: Record<string, React.ReactNode> = {
  academic: <GraduationCap className="h-6 w-6" />,
  language: <Languages className="h-6 w-6" />,
  coding_tech: <Code className="h-6 w-6" />,
  general_knowledge: <Brain className="h-6 w-6" />,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { locale, contentLocale, setLocale, setContentLocale, t } = useTranslation();

  const [step, setStep] = React.useState(1);
  const totalSteps = 5;

  const [selectedCountry, setSelectedCountry] = React.useState("Turkey (Türkiye)");
  const [selectedGrade, setSelectedGrade] = React.useState("10. Sınıf (Lise)");
  const [selectedTrack, setSelectedTrack] = React.useState<string>("academic");
  const [selectedSubGoals, setSelectedSubGoals] = React.useState<string[]>(["yks_tyt", "school_math"]);
  const [dailyTarget, setDailyTarget] = React.useState("regular");
  const [isSaving, setIsSaving] = React.useState(false);

  const currentTrackData = LEARNING_TRACKS.find((t) => t.id === selectedTrack) || LEARNING_TRACKS[0];

  const toggleSubGoal = (id: string) => {
    setSelectedSubGoals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("synapse_user_track", selectedTrack);
      localStorage.setItem("synapse_user_subgoals", JSON.stringify(selectedSubGoals));
      localStorage.setItem("synapse_user_daily_target", dailyTarget);
      localStorage.setItem("synapse_onboarded", "true");

      // Sync with Supabase Profile if session exists
      await updateProfileServerAction({
        country: selectedCountry,
        grade: selectedGrade,
        interface_language: locale,
        content_language: contentLocale,
        learning_track: selectedTrack,
        sub_goals: selectedSubGoals,
        daily_target: dailyTarget,
      });
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
      router.push("/practice");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 md:p-10 relative">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <BrandLogo />
        <Badge variant="secondary" className="py-1 px-3 text-xs border border-border">
          Adım {step} / {totalSteps}
        </Badge>
      </div>

      {/* Wizard Card */}
      <div className="max-w-3xl w-full mx-auto my-8">
        <Card className="p-6 sm:p-10 relative animate-fade-in shadow-elevated">
          {/* Step 1: Language */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <Badge variant="secondary" className="mb-2 border border-border">
                  <Globe className="h-3.5 w-3.5 text-primary mr-1" />
                  1. Adım: Dil Tercihleri
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  Arayüz ve İçerik Dilinizi Belirleyin
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  SYNAPSE global bir platformdur. Menüleri kendi dilinizde kullanırken soruları farklı bir dilde çözebilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {/* Interface Language */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Arayüz Dili (Menüler &amp; Butonlar)
                  </label>
                  <div className="space-y-2">
                    {SUPPORTED_LOCALES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLocale(l.code)}
                        className={`w-full p-3 rounded-md border text-left text-xs transition-colors flex items-center justify-between ${
                          locale === l.code
                            ? "border-primary bg-primary/10 text-foreground font-semibold"
                            : "border-border hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        {locale === l.code && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Language */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    İçerik &amp; Soru Dili
                  </label>
                  <div className="space-y-2">
                    {SUPPORTED_LOCALES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setContentLocale(l.code)}
                        className={`w-full p-3 rounded-md border text-left text-xs transition-colors flex items-center justify-between ${
                          contentLocale === l.code
                            ? "border-primary bg-primary/10 text-foreground font-semibold"
                            : "border-border hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        {contentLocale === l.code && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Country & Grade */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <Badge variant="secondary" className="mb-2 border border-border">
                  <GraduationCap className="h-3.5 w-3.5 text-primary mr-1" />
                  2. Adım: Eğitim Seviyesi
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  Ülkeniz ve Hedef Sınıf Seviyeniz
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Soruların zorluk derecesi ve müfredat standartları seçiminize göre uyarlanır.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Bulunduğunuz Ülke</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  >
                    <option>Turkey (Türkiye)</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Germany (Deutschland)</option>
                    <option>France</option>
                    <option>Spain (España)</option>
                    <option>Other / International</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Eğitim Kademesi / Sınıf</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  >
                    <option>8. Sınıf (LGS Hazırlık)</option>
                    <option>9. Sınıf (Lise Başlangıç)</option>
                    <option>10. Sınıf (Lise)</option>
                    <option>11. Sınıf (YKS / TYT)</option>
                    <option>12. Sınıf (YKS / AYT / SAT)</option>
                    <option>Üniversite / Lisans</option>
                    <option>Genel Öğrenen / Yetişkin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Learning Tracks */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <Badge variant="secondary" className="mb-2 border border-border">
                  <Target className="h-3.5 w-3.5 text-primary mr-1" />
                  3. Adım: Ana Öğrenme Alanı
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  En Çok Hangi Alanda Gelişmek İstiyorsunuz?
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Daha sonra profilinizden dilediğiniz zaman değiştirebilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {LEARNING_TRACKS.map((trk) => {
                  const isSelected = selectedTrack === trk.id;
                  return (
                    <button
                      key={trk.id}
                      type="button"
                      onClick={() => {
                        setSelectedTrack(trk.id);
                        setSelectedSubGoals(trk.subGoals.slice(0, 2).map((s) => s.id));
                      }}
                      className={`p-5 rounded-md border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-md ${isSelected ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                          {trackIcons[trk.id] || <Brain className="h-6 w-6" />}
                        </div>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{trk.titleTr}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{trk.descTr}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Specific Sub-goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <Badge variant="secondary" className="mb-2 border border-border">
                  <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
                  4. Adım: Odak Konular &amp; Sınavlar
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  {currentTrackData.titleTr} İçin Hedefleriniz
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  NOVA, bu konulara öncelik vererek size özel testler önerecektir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {currentTrackData.subGoals.map((sub) => {
                  const isChecked = selectedSubGoals.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubGoal(sub.id)}
                      className={`p-4 rounded-md border text-left text-xs transition-colors flex items-center justify-between ${
                        isChecked
                          ? "border-primary bg-primary/10 text-foreground font-semibold"
                          : "border-border hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span>{sub.titleTr}</span>
                      <div className={`h-4 w-4 rounded border flex items-center justify-center ${isChecked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Daily Study Commitments */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <Badge variant="secondary" className="mb-2 border border-border">
                  <Clock className="h-3.5 w-3.5 text-primary mr-1" />
                  5. Adım: Günlük Çalışma Temposu
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  Günlük Hedefinizi Belirleyin
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Küçük ama düzenli adımlar, öğrenme serinizi (streak) güçlendirir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {DAILY_STUDY_TARGETS.map((tgt) => {
                  const isSelected = dailyTarget === tgt.id;
                  return (
                    <button
                      key={tgt.id}
                      type="button"
                      onClick={() => setDailyTarget(tgt.id)}
                      className={`p-5 rounded-md border text-center transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="text-2xl font-bold font-mono text-primary mb-1">{tgt.minutes} dk</div>
                      <div className="text-sm font-semibold text-foreground">{tgt.titleTr}</div>
                      <p className="text-xs text-muted-foreground mt-1">{tgt.descTr}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Nav Controls */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
            {step > 1 ? (
              <Button
                variant="outline"
                size="default"
                onClick={() => setStep((s) => s - 1)}
                className="gap-2 text-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                variant="brand"
                size="default"
                onClick={() => setStep((s) => s + 1)}
                className="gap-2 text-xs font-semibold px-6"
              >
                Devam Et
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="brand"
                size="lg"
                disabled={isSaving}
                onClick={handleFinish}
                className="gap-2 text-sm font-semibold px-8"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isSaving ? "Kaydediliyor..." : "Öğrenmeye Başla"}
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        SYNAPSE v1.0 • Kişiselleştirilmiş Öğrenme Mimarisi
      </div>
    </div>
  );
}
