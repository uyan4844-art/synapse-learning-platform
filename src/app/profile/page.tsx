"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, Globe, Moon, Sun, Laptop, Sparkles, Flame, Check,
  Target, GraduationCap, Languages, Code, Brain, Clock,
  CheckCircle2, Crown, Zap, Shield, Save, RefreshCw
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation, SUPPORTED_LOCALES, type Locale } from "@/i18n/context";
import { LEARNING_TRACKS, DAILY_STUDY_TARGETS, GRANULAR_CURRICULUM_DATA } from "@/config/learning-goals";

const trackIcons: Record<string, React.ReactNode> = {
  academic: <GraduationCap className="h-5 w-5" />,
  language: <Languages className="h-5 w-5" />,
  coding_tech: <Code className="h-5 w-5" />,
  general_knowledge: <Brain className="h-5 w-5" />,
};

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { locale, contentLocale, setLocale, setContentLocale, t } = useTranslation();

  const [displayName, setDisplayName] = React.useState("Alex Mercer");
  const [username, setUsername] = React.useState("alexm");
  const [countryCode, setCountryCode] = React.useState<"TR" | "US" | "UK" | "DE" | "GLOBAL_IB">("TR");
  const currentCurriculum = GRANULAR_CURRICULUM_DATA[countryCode] || GRANULAR_CURRICULUM_DATA.TR;

  const [grade, setGrade] = React.useState(currentCurriculum.grades[10] || currentCurriculum.grades[0]);

  // Goal & Track Selection
  const [selectedTrack, setSelectedTrack] = React.useState("academic");
  const [selectedSubGoals, setSelectedSubGoals] = React.useState<string[]>(["yks_tyt", "school_math"]);
  const [dailyTarget, setDailyTarget] = React.useState("regular");
  const [saved, setSaved] = React.useState(false);

  // Pro Subscription State
  const [isProUser, setIsProUser] = React.useState(true);

  React.useEffect(() => {
    try {
      const savedName = localStorage.getItem("synapse_display_name");
      if (savedName) setDisplayName(savedName);

      const savedUser = localStorage.getItem("synapse_username");
      if (savedUser) setUsername(savedUser);

      const savedCountry = localStorage.getItem("synapse_user_country") as any;
      if (savedCountry && GRANULAR_CURRICULUM_DATA[savedCountry]) setCountryCode(savedCountry);

      const savedGrade = localStorage.getItem("synapse_user_grade");
      if (savedGrade) setGrade(savedGrade);

      const savedTrack = localStorage.getItem("synapse_user_track");
      if (savedTrack) setSelectedTrack(savedTrack);

      const savedSubs = localStorage.getItem("synapse_user_subgoals");
      if (savedSubs) setSelectedSubGoals(JSON.parse(savedSubs));

      const savedTarget = localStorage.getItem("synapse_user_daily_target");
      if (savedTarget) setDailyTarget(savedTarget);
    } catch {
      // ignore
    }
  }, []);

  const toggleSubGoal = (id: string) => {
    setSelectedSubGoals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("synapse_display_name", displayName);
      localStorage.setItem("synapse_username", username);
      localStorage.setItem("synapse_user_country", countryCode);
      localStorage.setItem("synapse_user_grade", grade);
      localStorage.setItem("synapse_user_track", selectedTrack);
      localStorage.setItem("synapse_user_subgoals", JSON.stringify(selectedSubGoals));
      localStorage.setItem("synapse_user_daily_target", dailyTarget);
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentTrackData = LEARNING_TRACKS.find((t) => t.id === selectedTrack) || LEARNING_TRACKS[0];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 px-2 sm:px-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="brand" className="text-xs px-2.5 py-0.5">
                <User className="h-3.5 w-3.5 mr-1" />
                Öğrenci Profili &amp; Tercihler
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Profil &amp; Hedef Ayarları
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Müfredat ülkenizi, hedef sınavlarınızı, günlük temponuzu ve tema tercihlerinizi yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="brand" className="py-1.5 px-3 text-xs gap-1.5 font-semibold">
              <Crown className="h-3.5 w-3.5 text-warning" />
              PRO Üye (Sınırsız)
            </Badge>
          </div>
        </div>

        {/* Profile Card Banner */}
        <Card className="p-6 bg-card border-border shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/40">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=UserMe" alt="Avatar" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {currentTrackData.titleTr.split("&")[0]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">@{username} • Elmas Lig Yarışçısı</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 text-warning font-semibold">
                  <Flame className="h-3.5 w-3.5 fill-warning" /> 5 Günlük Seri
                </span>
                <span className="flex items-center gap-1 text-primary font-bold font-mono">
                  1,450 ELO
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="text-xs font-semibold">
              Avatarı Yenile
            </Button>
          </div>
        </Card>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* SECTION 1: Academic & Granular Country Info */}
          <Card className="p-6 space-y-6 bg-card border-border shadow-elevated">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Eğitim Sistemi &amp; Sınıf Seviyesi
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pratik ve Düello ekranlarında varsayılan olarak seçilecek ülke ve sınıfınız.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Görünen Ad</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Kullanıcı Adı</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 text-sm font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Ülke / Müfredat</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-semibold text-primary focus:ring-2 focus:ring-ring focus:outline-none"
                >
                  <option value="TR">Türkiye (MEB &amp; YKS/LGS)</option>
                  <option value="US">United States (SAT, ACT, AP)</option>
                  <option value="UK">United Kingdom (GCSE &amp; A-Levels)</option>
                  <option value="DE">Deutschland (Abitur &amp; Gymnasium)</option>
                  <option value="GLOBAL_IB">Global / International (IB DP &amp; Cambridge)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Sınıf / Seviye</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs focus:ring-2 focus:ring-ring focus:outline-none"
                >
                  {currentCurriculum.grades.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* SECTION 2: Learning Goal Tracks */}
          <Card className="p-6 space-y-6 bg-card border-border shadow-elevated">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Ana Öğrenme Hedefi &amp; Odak Alanı
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Platformun soru önerileri ve çalışma planı bu hedefe göre uyarlanır.
                </p>
              </div>
              <Badge variant="secondary" className="font-mono text-primary">{currentTrackData.badgeTr}</Badge>
            </div>

            {/* 4 Core Track Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LEARNING_TRACKS.map((track) => {
                const isSelected = selectedTrack === track.id;
                const Icon = trackIcons[track.code] || <Target className="h-5 w-5" />;

                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      setSelectedTrack(track.id);
                      setSelectedSubGoals([track.subGoals[0]?.id || "", track.subGoals[1]?.id || ""]);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30 shadow-sm"
                        : "border-border hover:bg-secondary/40 bg-card"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-9 w-9 rounded-lg bg-secondary text-foreground flex items-center justify-center border border-border">
                          {Icon}
                        </div>
                        <Badge variant={isSelected ? "brand" : "secondary"} className="text-[10px]">
                          {track.badgeTr}
                        </Badge>
                      </div>

                      <div className="text-sm font-bold text-foreground">{track.titleTr}</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {track.descTr}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-2 border-t border-primary/20 flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Aktif Odak Alanı
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Daily Target Picker */}
            <div className="pt-3 border-t border-border">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground block mb-3">
                Günlük Çalışma Temposu &amp; Seri Hedefi:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DAILY_STUDY_TARGETS.map((target) => {
                  const isSelected = dailyTarget === target.id;
                  return (
                    <div
                      key={target.id}
                      onClick={() => setDailyTarget(target.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30 shadow-sm"
                          : "border-border hover:bg-secondary text-muted-foreground bg-card"
                      }`}
                    >
                      <Clock className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? "text-primary" : ""}`} />
                      <div>
                        <div className="text-xs font-bold text-foreground">{target.titleTr}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{target.descTr}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* SECTION 3: Appearance & Language Preferences */}
          <Card className="p-6 space-y-6 bg-card border-border shadow-elevated">
            <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Arayüz &amp; Dil Tercihleri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Interface Language */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Arayüz Dili (UI Language)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {SUPPORTED_LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLocale(l.code)}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                        locale === l.code
                          ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                          : "border-border hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {l.flag} {l.code.toUpperCase()} ({l.nativeName.split(" ")[0]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Tema Modu</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" /> Koyu (Dark)
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" /> Açık (Light)
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      theme === "system"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Laptop className="h-3.5 w-3.5" /> Sistem
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {saved && (
                <span className="text-xs text-success font-semibold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="h-4 w-4" />
                  Profil tercihleri başarıyla kaydedildi!
                </span>
              )}
            </div>

            <Button type="submit" variant="brand" size="lg" className="font-semibold h-11 px-8 gap-2 shadow-md">
              <Save className="h-4 w-4" />
              Değişiklikleri Kaydet
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
