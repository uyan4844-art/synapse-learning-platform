export interface QuizSessionRecord {
  id: string;
  subjectName: string;
  topicTitle: string;
  category: "academic" | "language" | "coding_tech" | "custom_hub";
  totalQuestions: number;
  correctAnswers: number;
  scoreAccuracy: number; // e.g. 80 (%)
  earnedXp: number;
  weakPoints: string[];
  recommendation: string;
  completedAt: string;
}

export interface SubjectMastery {
  subject: string;
  category: string;
  solvedQuestions: number;
  accuracy: number;
  lastStudied: string;
  masteryLevel: "Geliştirilmeli" | "İyi" | "Usta" | "Mükemmel";
}

export interface WeakConcept {
  id: string;
  subject: string;
  concept: string;
  accuracy: number;
  missedCount: number;
  reason: string;
  suggestedAction: string;
  urgency: "high" | "medium" | "low";
}

export const DEFAULT_USER_SESSIONS: QuizSessionRecord[] = [
  {
    id: "sess_1",
    subjectName: "Matematik",
    topicTitle: "İkinci Dereceden Denklemler & Diskriminant",
    category: "academic",
    totalQuestions: 10,
    correctAnswers: 6,
    scoreAccuracy: 60,
    earnedXp: 180,
    weakPoints: ["Kök katsayı bağıntıları", "Negatif diskriminant analizi"],
    recommendation: "Diskriminant Δ < 0 durumunda karmaşık kök analizi üzerinde pratik yapılması önerilir.",
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "sess_2",
    subjectName: "Fizik",
    topicTitle: "Newton'un Hareket Yasaları & Dinamik",
    category: "academic",
    totalQuestions: 5,
    correctAnswers: 5,
    scoreAccuracy: 100,
    earnedXp: 150,
    weakPoints: [],
    recommendation: "Mükemmel kavrayış! Sürtünmeli eğik düzlem gibi ileri düzey sorulara geçebilirsiniz.",
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "sess_3",
    subjectName: "Python Kodlama",
    topicTitle: "Veri Yapıları & Algoritmalar",
    category: "coding_tech",
    totalQuestions: 10,
    correctAnswers: 8,
    scoreAccuracy: 80,
    earnedXp: 240,
    weakPoints: ["List Comprehension optimizasyonu"],
    recommendation: "Bellek karmaşıklığı (Space Complexity) analizine dikkat edilmesi tavsiye edilir.",
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const DEFAULT_WEAK_CONCEPTS: WeakConcept[] = [
  {
    id: "weak_1",
    subject: "Matematik",
    concept: "İkinci Dereceden Denklemler (Δ < 0)",
    accuracy: 52,
    missedCount: 4,
    reason: "Diskriminant negatif olduğunda reel kök olmaması durumunda hata yapıldı.",
    suggestedAction: "10 Soruluk Hedefli Pekiştirme Testi",
    urgency: "high",
  },
  {
    id: "weak_2",
    subject: "Fizik",
    concept: "Eğik Düzlemde Sürtünme Kuvveti",
    accuracy: 64,
    missedCount: 3,
    reason: "Tepki kuvveti (N = mg*cosα) bileşen ayırmada işaret karmaşası yaşandı.",
    suggestedAction: "5 Soruluk Dinamik Odak Testi",
    urgency: "medium",
  },
  {
    id: "weak_3",
    subject: "İngilizce (B2)",
    concept: "Conditionals (Type 3 & Mixed)",
    accuracy: 68,
    missedCount: 2,
    reason: "Geçmişteki varsayımsal pişmanlık cümlelerinde 'would have V3' yapısı karıştırıldı.",
    suggestedAction: "Gramer Pekiştirme Seansı",
    urgency: "medium",
  },
];
