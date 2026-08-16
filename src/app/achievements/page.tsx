"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Award, Flame, Swords, CheckCircle2, Lock, Zap, Target,
  BookOpen, Trophy, Shield, Sparkles, Check, ArrowRight,
  Clock, Star, Gift, Calendar
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import {
  AchievementItem,
  DailyQuest,
  UserGamificationState,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_DAILY_QUESTS,
  DEFAULT_GAMIFICATION_STATE
} from "@/types/gamification";

export default function AchievementsPage() {
  const { t, locale } = useTranslation();

  const [activeTab, setActiveTab] = React.useState<"badges" | "quests" | "leaderboard">("badges");
  const [userState, setUserState] = React.useState<UserGamificationState>(DEFAULT_GAMIFICATION_STATE);
  const [quests, setQuests] = React.useState<DailyQuest[]>(DEFAULT_DAILY_QUESTS);
  const [achievementsList, setAchievementsList] = React.useState<AchievementItem[]>(DEFAULT_ACHIEVEMENTS);
  const [claimedQuests, setClaimedQuests] = React.useState<string[]>([]);

  // Load gamification state from storage
  React.useEffect(() => {
    try {
      const storedState = localStorage.getItem("synapse_user_gamification");
      if (storedState) setUserState(JSON.parse(storedState));

      const storedClaimed = localStorage.getItem("synapse_claimed_quests");
      if (storedClaimed) setClaimedQuests(JSON.parse(storedClaimed));
    } catch {
      // fallback
    }
  }, []);

  const handleClaimQuest = (questId: string, xpReward: number) => {
    if (claimedQuests.includes(questId)) return;
    const newClaimed = [...claimedQuests, questId];
    setClaimedQuests(newClaimed);

    const updatedState = {
      ...userState,
      currentXp: userState.currentXp + xpReward,
    };
    setUserState(updatedState);

    try {
      localStorage.setItem("synapse_claimed_quests", JSON.stringify(newClaimed));
      localStorage.setItem("synapse_user_gamification", JSON.stringify(updatedState));
    } catch {
      // ignore
    }
  };

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;
  const xpPercentage = Math.round((userState.currentXp / userState.nextLevelXp) * 100);

  const getIcon = (name: string) => {
    switch (name) {
      case "Zap": return <Zap className="h-5 w-5" />;
      case "Flame": return <Flame className="h-5 w-5" />;
      case "Target": return <Target className="h-5 w-5" />;
      case "Swords": return <Swords className="h-5 w-5" />;
      case "Award": return <Award className="h-5 w-5" />;
      case "BookOpen": return <BookOpen className="h-5 w-5" />;
      case "Trophy": return <Trophy className="h-5 w-5" />;
      case "Shield": return <Shield className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-4 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="brand" className="text-xs px-2.5 py-0.5">
                <Trophy className="h-3.5 w-3.5 mr-1" />
                Ödüller &amp; Gamification Sistemi
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Rozetler, Görevler &amp; Seviye
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Pratik yaparak, düellolar kazanarak XP toplayın, liginizi yükseltin ve günlük ödülleri toplayın.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border flex items-center gap-3 shadow-sm">
              <Flame className="h-5 w-5 text-warning fill-warning" />
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Seri</div>
                <div className="text-base font-bold text-foreground">{userState.currentStreak} Gün</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border flex items-center gap-3 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-muted-foreground">Lig</div>
                <div className="text-base font-bold text-foreground">{userState.tier} Lig</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Banner */}
        <Card className="p-6 bg-card border-border shadow-elevated space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-md bg-primary text-primary-foreground font-mono font-bold text-xs flex items-center justify-center">
                  L{userState.currentLevel}
                </span>
                <h2 className="text-xl font-bold text-foreground">
                  Seviye {userState.currentLevel}: {userState.levelTitle}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bir sonraki seviyeye geçmek için <strong className="text-foreground">{userState.nextLevelXp - userState.currentXp} XP</strong> daha toplayın.
              </p>
            </div>

            <div className="text-right">
              <div className="text-base font-mono font-bold text-primary">
                {userState.currentXp.toLocaleString()} / {userState.nextLevelXp.toLocaleString()} XP
              </div>
              <span className="text-xs text-muted-foreground">%{xpPercentage} Tamamlandı</span>
            </div>
          </div>

          <Progress value={xpPercentage} className="h-2.5" indicatorClassName="bg-primary" />
        </Card>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === "badges"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tüm Rozetler ({unlockedCount} / {achievementsList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quests")}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "quests"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Gift className="h-3.5 w-3.5 text-warning" />
            Günlük Görevler ({quests.filter(q => q.completed).length}/{quests.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === "leaderboard"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Haftalık Sıralama &amp; Lig
          </button>
        </div>

        {/* ── 1. TAB: ACHIEVEMENTS / BADGES ────────────────────── */}
        {activeTab === "badges" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievementsList.map((item) => {
                return (
                  <Card
                    key={item.id}
                    className={`p-5 flex flex-col justify-between space-y-4 transition-all shadow-elevated ${
                      item.unlocked
                        ? "border-primary/50 bg-primary/5"
                        : "border-border bg-card opacity-70"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                            item.unlocked
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary text-muted-foreground border border-border"
                          }`}
                        >
                          {getIcon(item.iconName)}
                        </div>

                        {item.unlocked ? (
                          <Badge variant="success" className="text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Açıldı
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] font-mono">
                            <Lock className="h-3 w-3 mr-1" />
                            Kilitli
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-foreground mb-1 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-border">
                      {!item.unlocked && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>İlerleme</span>
                            <span className="font-mono">{item.progress}</span>
                          </div>
                          <Progress value={item.progressPercent} className="h-1.5" />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-muted-foreground font-mono">{item.category}</span>
                        <span className="font-bold text-primary">+{item.xpReward} XP</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 2. TAB: DAILY QUESTS ─────────────────────────────── */}
        {activeTab === "quests" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Bugünün Görevleri</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Her gece saat 00:00'da yenilenir</p>
              </div>
              <Badge variant="secondary" className="text-xs font-mono">
                Kalan Süre: 3s 45dk
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quests.map((quest) => {
                const isClaimed = claimedQuests.includes(quest.id);

                return (
                  <Card
                    key={quest.id}
                    className="p-5 bg-card border-border shadow-elevated flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[11px] font-mono">
                          {quest.category.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-bold text-primary">+{quest.xpReward} XP</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-foreground">{quest.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {quest.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                      <div className="text-xs font-mono text-muted-foreground">
                        {quest.current} / {quest.target} Tamamlandı
                      </div>

                      {quest.completed ? (
                        <Button
                          size="sm"
                          variant={isClaimed ? "secondary" : "brand"}
                          disabled={isClaimed}
                          onClick={() => handleClaimQuest(quest.id, quest.xpReward)}
                          className="h-9 px-4 text-xs font-semibold gap-1.5"
                        >
                          {isClaimed ? <Check className="h-3.5 w-3.5 text-success" /> : <Gift className="h-3.5 w-3.5" />}
                          {isClaimed ? "Ödül Alındı" : "Ödülü Al"}
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-semibold" asChild>
                          <Link href="/practice">Görevi Tamamla</Link>
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 3. TAB: LEADERBOARD & TIER ───────────────────────── */}
        {activeTab === "leaderboard" && (
          <Card className="p-6 bg-card border-border shadow-elevated space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Elmas Lig Haftalık Lider Tablosu</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Haftayı ilk 3'te bitirenler Şampiyon Ligine yükselir</p>
              </div>
              <Badge variant="brand" className="font-mono text-xs">Lig Sıranız: #4</Badge>
            </div>

            <div className="space-y-3">
              {[
                { rank: 1, name: "Eren Demir", xp: 4820, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eren", isMe: false },
                { rank: 2, name: "Ayşe Çelik", xp: 4210, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse", isMe: false },
                { rank: 3, name: "Burak Yılmaz", xp: 3790, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Burak", isMe: false },
                { rank: 4, name: "Ben (Öğrenci)", xp: userState.currentXp, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=UserMe", isMe: true },
                { rank: 5, name: "Zeynep Kaya", xp: 3120, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep", isMe: false },
              ].map((row) => (
                <div
                  key={row.rank}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    row.isMe
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-secondary/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold text-sm h-7 w-7 rounded-md flex items-center justify-center ${
                      row.rank === 1 ? "bg-warning text-warning-foreground" : (row.rank === 2 ? "bg-secondary text-foreground" : "bg-card text-muted-foreground border")
                    }`}>
                      #{row.rank}
                    </span>
                    <img src={row.avatar} alt={row.name} className="h-9 w-9 rounded-full border border-border bg-card" />
                    <div>
                      <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        {row.name}
                        {row.isMe && <Badge variant="brand" className="text-[10px] py-0">Siz</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">Elmas Lig Yarışçısı</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-foreground">{row.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
