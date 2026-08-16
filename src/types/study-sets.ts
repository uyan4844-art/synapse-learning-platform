export type StudyMaterialType = "pdf" | "transcript" | "text" | "youtube" | "topic";

export interface CustomStudySet {
  id: string;
  title: string;
  type: StudyMaterialType;
  content: string; // URL, extracted text, raw transcript, or topic name
  fileName?: string;
  createdAt: string;
  updatedAt?: string;
  questionCount?: number;
  difficulty?: string;
}

export const DEFAULT_CUSTOM_SETS: CustomStudySet[] = [
  {
    id: "set_1",
    title: "Meta Reklam Yöneticiliği & Dijital Pazarlama Stratejileri",
    type: "youtube",
    content: "https://www.youtube.com/watch?v=kYIPFmJ0j9M",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    difficulty: "Orta",
  },
  {
    id: "set_2",
    title: "11. Sınıf Biyoloji: Hücresel Solunum ve ATP Döngüsü",
    type: "text",
    content: "Glikoliz sitoplazmada gerçekleşir ve 2 ATP net kazanç sağlar. Krebs döngüsü mitokondri matriksinde yürütülür ve NADH, FADH2 üretir. ETS basamağı ise en yüksek ATP'nin üretildiği oksidatif fosforilasyon evresidir.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    difficulty: "Zor",
  },
];
