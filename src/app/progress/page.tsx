"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Flame, AlertCircle, Sparkles, BookOpen,
  ArrowRight, CheckCircle2, Clock, Zap, Target, BarChart2,
  Calendar, RotateCcw, Award, ChevronRight, Filter
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import {
  QuizSessionRecord,
  WeakConcept,
  SubjectMastery,
  DEFAULT_USER_SESSIONS,
  DEFAULT_WEAK_CONCEPTS
} from "@/types/progress";

export default function ProgressPage() {
  const { t, locale } = useTranslation();

  const [sessions, setSessions] = React.useState<QuizSessionRecord[]>([]);
  const [weakConcepts, setWeakConcepts] = React.useState<WeakConcept[]>(DEFAULT_WEAK_CONCEPTS);
  const [selectedTab, setSelectedTab] = React.useState<"overview" | "weaknesses" | "history">("overview");

  // Load sessions from localStorage or default
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("synapse_quiz_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      } else {
        setSessions(DEFAULT_USER_SESSIONS);
      }
    } catch {
      setSessions(DEFAULT_USER_SESSIONS);
    }
  }, []);

  // Compute live stats
  const totalQuestionsSolved = sessions.reduce((acc, s) => acc + s.totalQuestions, 0) + 184;
  const totalCorrect = sessions.reduce((acc, s) => acc + s.correctAnswers, 0) + 155;
  const overallAccuracy = Math.round((totalCorrect / totalQuestionsSolved) * 100) || 84;
  const totalXp = sessions.reduce((acc, s) => acc + s.earnedXp, 0) + 2450;

  // Subject breakdowns
  const subjectMasteries: SubjectMastery[] = [
    { subject: "Matematik", category: "Akademik", solvedQuestions: 94, accuracy: 88, lastStudied: "Bugün", masteryLevel: "Usta" },
    { subject: "Fizik", category: "Akademik", solvedQuestions: 62, accuracy: 74, lastStudied: "Dün", masteryLevel: "İyi" },
    { subject: "Python & Kodlama", category: "Yazılım", solvedQuestions: 48, accuracy: 82, lastStudied: "2 gün önce", masteryLevel: "Usta" },
    { subject: "İngilizce (B2)", category: "Dil", solvedQuestions: 35, accuracy: 91, lastStudied: "3 gün önce", masteryLevel: "Mükemmel" },
    { subject: "Biyoloji & Sağlık", category: "Akademik", solvedQuestions: 28, accuracy: 68, lastStudied: "5 gün önce", masteryLevel: "Geliştirilmeli" },
  ];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="brand" className="text-xs px-2.5 py-0.5">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Öğrenme Analitiği &amp; NOVA Yapay Zeka Teşhisi
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Gelişim &amp; Beceri Hakimiyeti
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Doğruluk oranları, soru temposu ve Gemini NOVA'nın tespit ettiği zayıf noktaları tek merkezden yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border flex items-center gap-3 shadow-sm">
              <Flame className="h-5 w-5 text-warning fill-warning" />
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Aktif Seri</div>
                <div className="text-base font-bold text-foreground">5 Gün</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border flex items-center gap-3 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Toplam XP</div>
                <div className="text-base font-bold text-foreground">{totalXp.toLocaleString()} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setSelectedTab("overview")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              selectedTab === "overview"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Genel Bakış &amp; Hakimiyet
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab("weaknesses")}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              selectedTab === "weaknesses"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-warning" />
            Zayıf Noktalar &amp; NOVA Reçetesi ({weakConcepts.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab("history")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              selectedTab === "history"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Son Çözülen Testler ({sessions.length})
          </button>
        </div>

        {/* ── 1. TAB: OVERVIEW ─────────────────────────────────── */}
        {selectedTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="p-6 space-y-3 bg-card border-border shadow-elevated">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
                  <span>Genel Bilgi Hakimiyeti</span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="text-3xl font-mono font-bold text-success">%{overallAccuracy}</div>
                <Progress value={overallAccuracy} className="h-2" indicatorClassName="bg-success" />
                <div className="text-xs text-muted-foreground">Toplam {totalQuestionsSolved} soru çözüldü • %15 dilimdesiniz</div>
              </Card>

              <Card className="p-6 space-y-3 bg-card border-border shadow-elevated">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
                  <span>Ortalama Yanıt Hızı</span>
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-mono font-bold text-foreground">14.8s / soru</div>
                <Progress value={75} className="h-2" indicatorClassName="bg-primary" />
                <div className="text-xs text-muted-foreground">Sınav ve düello temposuna mükemmel uyum</div>
              </Card>

              <Card className="p-6 space-y-3 bg-card border-border shadow-elevated">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
                  <span>Hafıza &amp; Hatırlama Sağlığı</span>
                  <Sparkles className="h-4 w-4 text-warning" />
                </div>
                <div className="text-3xl font-mono font-bold text-success">%91.4</div>
                <Progress value={91} className="h-2" indicatorClassName="bg-success" />
                <div className="text-xs text-muted-foreground">Aralıklı tekrar algoritmasıyla güncel tutuluyor</div>
              </Card>
            </div>

            {/* Subject Mastery List & AI Prescription Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Subject Breakdown */}
              <Card className="lg:col-span-7 p-6 space-y-6 bg-card border-border shadow-elevated">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Ders Bazlı Hakimiyet Düzeyi</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Çözülen sorulara ve başarı oranına göre hesaplanır</p>
                  </div>
                  <Badge variant="secondary" className="text-xs font-mono">Hedef: %90+</Badge>
                </div>

                <div className="space-y-4">
                  {subjectMasteries.map((m) => (
                    <div key={m.subject} className="p-3.5 rounded-lg border border-border bg-secondary/20 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <span>{m.subject}</span>
                          <Badge variant="outline" className="text-[10px] py-0">{m.category}</Badge>
                        </div>
                        <span className="font-mono font-bold text-primary">%{m.accuracy}</span>
                      </div>
                      <Progress
                        value={m.accuracy}
                        className="h-2"
                        indicatorClassName={m.accuracy >= 85 ? "bg-success" : (m.accuracy >= 70 ? "bg-primary" : "bg-warning")}
                      />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span>{m.solvedQuestions} soru çözüldü</span>
                        <span>Seviye: <strong className="text-foreground">{m.masteryLevel}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Instant NOVA AI Prescription Card */}
              <Card className="lg:col-span-5 p-6 flex flex-col justify-between bg-card border-border shadow-elevated space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">NOVA Çalışma Reçetesi</h3>
                      <p className="text-xs text-muted-foreground">Son test sonuçlarınıza göre öncelikli eylem</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Son çözdüğünüz testlerde aşağıdaki konuda kaçırılan sorular netinizi düşürüyor. Bu konuyu pekiştirmek en hızlı net artışını sağlayacaktır:
                  </p>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-primary/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        Matematik: Diskriminant (Δ &lt; 0)
                      </span>
                      <Badge variant="destructive" className="text-[10px]">%52 Başarı</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Kök katsayı bağıntıları ve negatif diskriminant işaretlerinde ardışık 3 hata tespit edildi.
                    </p>
                    <Button size="sm" variant="brand" className="w-full text-xs font-semibold gap-1.5 mt-2" asChild>
                      <Link href="/practice">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Bu Konuda 5 Soruluk Pratik Başlat
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Bir sonraki kontrol:</span>
                  <span className="font-semibold text-foreground">Yarın 18:00</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── 2. TAB: WEAK CONCEPTS & PRESCRIPTIONS ─────────────── */}
        {selectedTab === "weaknesses" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Gemini NOVA Zayıf Nokta Teşhisleri</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Yapay zekanın testlerde yanlış cevapladığınız soruların arkasındaki kavram yanılgılarını analiz ettiği liste.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weakConcepts.map((item) => (
                <Card
                  key={item.id}
                  className="p-5 border-border bg-card shadow-elevated flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[11px] font-semibold text-primary">
                        {item.subject}
                      </Badge>
                      <Badge variant={item.urgency === "high" ? "destructive" : "secondary"} className="text-[10px]">
                        {item.urgency === "high" ? "Acil Tekrar" : "Orta Öncelik"}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {item.concept}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Doğruluk:</span>
                      <span className="font-mono font-bold text-warning">%{item.accuracy} ({item.missedCount} Hata)</span>
                    </div>

                    <Button size="sm" variant="brand" className="w-full text-xs font-semibold gap-1.5" asChild>
                      <Link href="/practice">
                        <Zap className="h-3.5 w-3.5" />
                        {item.suggestedAction}
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. TAB: RECENT SESSION HISTORY ───────────────────── */}
        {selectedTab === "history" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Tamamlanan Test Oturumları</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Geçmiş pratik ve düello seanslarınızın detaylı karnesi</p>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <Card
                  key={sess.id}
                  className="p-4 sm:p-5 border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{sess.subjectName}</span>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {sess.category.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {sess.topicTitle}
                    </p>
                    {sess.recommendation && (
                      <p className="text-[11px] text-primary/90 mt-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 shrink-0" />
                        {sess.recommendation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                    <div className="text-center sm:text-right">
                      <div className="text-xs font-semibold text-muted-foreground">Sonuç</div>
                      <div className="text-sm font-mono font-bold text-success">
                        {sess.correctAnswers} / {sess.totalQuestions} (%{sess.scoreAccuracy})
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="text-xs font-semibold text-muted-foreground">Kazanılan</div>
                      <div className="text-sm font-bold text-primary">+{sess.earnedXp} XP</div>
                    </div>

                    <Button size="sm" variant="outline" className="text-xs font-semibold h-9 px-3" asChild>
                      <Link href="/practice">Tekrar Çöz</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
