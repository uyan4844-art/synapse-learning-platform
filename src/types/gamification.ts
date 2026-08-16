export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  category: "practice" | "battle" | "accuracy" | "streak";
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  iconName: "Zap" | "Flame" | "Target" | "Swords" | "Award" | "BookOpen" | "Trophy" | "Shield" | "Sparkles";
  unlocked: boolean;
  unlockedAt?: string;
  progress?: string;
  progressPercent: number;
  xpReward: number;
  category: "Genel" | "Seri" | "İsabet" | "Düello" | "Ders" | "Sınav Özel";
}

export interface UserGamificationState {
  currentLevel: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  currentStreak: number;
  longestStreak: number;
  totalQuizzesCompleted: number;
  totalDuelsWon: number;
  tier: "Bronz" | "Gümüş" | "Altın" | "Platin" | "Elmas" | "Şampiyon";
}

export const DEFAULT_GAMIFICATION_STATE: UserGamificationState = {
  currentLevel: 14,
  levelTitle: "Akademik Stratejist",
  currentXp: 3450,
  nextLevelXp: 5000,
  currentStreak: 5,
  longestStreak: 12,
  totalQuizzesCompleted: 42,
  totalDuelsWon: 18,
  tier: "Elmas",
};

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: "quest_1",
    title: "Günün Isınma Testi",
    description: "Herhangi bir dersten en az 5 soruluk 1 pratik testi tamamla.",
    target: 1,
    current: 1,
    xpReward: 100,
    completed: true,
    category: "practice",
  },
  {
    id: "quest_2",
    title: "Arena Gladyatörü",
    description: "Canlı Çok Oyunculu Düello modunda 1 maç kazan.",
    target: 1,
    current: 0,
    xpReward: 150,
    completed: false,
    category: "battle",
  },
  {
    id: "quest_3",
    title: "Keskin Nişancı",
    description: "Bir test oturumunu en az %80 doğruluk oranıyla bitir.",
    target: 1,
    current: 1,
    xpReward: 120,
    completed: true,
    category: "accuracy",
  },
  {
    id: "quest_4",
    title: "Konu Kaşifi",
    description: "Özel PDF veya YouTube transkriptinden 1 test üretip çöz.",
    target: 1,
    current: 0,
    xpReward: 200,
    completed: false,
    category: "practice",
  },
];

export const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "first_quiz",
    title: "İlk Kıvılcım",
    description: "İlk doğrulanmış testinizi başarıyla tamamlayın.",
    iconName: "Zap",
    unlocked: true,
    unlockedAt: "3 gün önce",
    progressPercent: 100,
    xpReward: 100,
    category: "Genel",
  },
  {
    id: "streak_7",
    title: "Azimli Öğrenci",
    description: "7 günlük kesintisiz çalışma serisini koruyun.",
    iconName: "Flame",
    unlocked: false,
    progress: "5 / 7 Gün",
    progressPercent: 71,
    xpReward: 250,
    category: "Seri",
  },
  {
    id: "perfect_10",
    title: "Kusursuz İcra",
    description: "10 soruluk bir testi sıfır ipucu kullanarak %100 doğrulukla bitirin.",
    iconName: "Target",
    unlocked: true,
    unlockedAt: "Dün",
    progressPercent: 100,
    xpReward: 300,
    category: "İsabet",
  },
  {
    id: "first_battle_win",
    title: "Arenada İlk Zafer",
    description: "İlk canlı çok oyunculu bilgi düellonuzu kazanın.",
    iconName: "Swords",
    unlocked: true,
    unlockedAt: "2 gün önce",
    progressPercent: 100,
    xpReward: 200,
    category: "Düello",
  },
  {
    id: "math_prodigy",
    title: "Matematik Başarısı",
    description: "50 soru üzerinde Matematik alanında %90+ Konu Hakimiyetine ulaşın.",
    iconName: "Award",
    unlocked: true,
    unlockedAt: "Bugün",
    progressPercent: 100,
    xpReward: 400,
    category: "Ders",
  },
  {
    id: "sat_readiness",
    title: "Sınav Hazırlığı (LGS/YKS/SAT)",
    description: "100 adet doğrulanmış ileri düzey sınav sorusu çözün.",
    iconName: "BookOpen",
    unlocked: false,
    progress: "42 / 100 Soru",
    progressPercent: 42,
    xpReward: 500,
    category: "Sınav Özel",
  },
  {
    id: "duel_master",
    title: "Arena Efsanesi",
    description: "Toplam 20 canlı bilgi düellosu kazanın.",
    iconName: "Trophy",
    unlocked: false,
    progress: "18 / 20 Zafer",
    progressPercent: 90,
    xpReward: 600,
    category: "Düello",
  },
  {
    id: "multimodal_scholar",
    title: "Çok Modlu Araştırmacı",
    description: "PDF, YouTube ve Serbest Metin kullanarak 10 farklı özel test çözün.",
    iconName: "Sparkles",
    unlocked: true,
    unlockedAt: "3 gün önce",
    progressPercent: 100,
    xpReward: 350,
    category: "Genel",
  },
];
