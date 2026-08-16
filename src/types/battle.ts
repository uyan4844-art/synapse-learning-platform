export interface BattlePlayer {
  id: string;
  name: string;
  avatar: string;
  elo: number;
  isHost: boolean;
  isReady: boolean;
  score?: number;
  status?: "answering" | "answered" | "idle";
}

export type BattleMaterialType = "curriculum" | "pdf" | "text" | "youtube";

export interface BattleRoomSettings {
  category: "academic" | "language" | "coding_tech" | "custom_hub";
  countryCode?: string;
  countryName?: string;
  grade?: string;
  subjectType?: string;
  subjectName: string;
  specificTopic?: string;
  customSetTitle?: string;
  materialType?: BattleMaterialType;
  materialContent?: string; // YouTube URL, PDF text, or raw text
  fileName?: string;
  privacy: "public" | "private";
  maxPlayers: 2 | 3 | 4 | 8;
  questionCount: 5 | 10 | 15;
  timePerQuestion: 15 | 30 | 45;
}

export interface BattleLobbyState {
  roomId: string;
  roomCode: string;
  hostId: string;
  hostName: string;
  settings: BattleRoomSettings;
  players: BattlePlayer[];
  isStarted: boolean;
  createdAt: string;
}

export const INITIAL_PUBLIC_LOBBIES: BattleLobbyState[] = [
  {
    roomId: "room_1",
    roomCode: "SYN-8492",
    hostId: "user_mert",
    hostName: "Mert Yılmaz",
    settings: {
      category: "academic",
      countryCode: "TR",
      countryName: "Türkiye (MEB)",
      grade: "11. Sınıf",
      subjectType: "Genel Dersler",
      subjectName: "Fizik",
      specificTopic: "Newton'un Hareket Yasaları & Dinamik",
      materialType: "curriculum",
      privacy: "public",
      maxPlayers: 4,
      questionCount: 5,
      timePerQuestion: 30,
    },
    players: [
      { id: "user_mert", name: "Mert Yılmaz (Kurucu)", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mert", elo: 1420, isHost: true, isReady: true },
      { id: "user_selin", name: "Selin Kaya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selin", elo: 1390, isHost: false, isReady: true },
      { id: "user_can", name: "Can Demir", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Can", elo: 1450, isHost: false, isReady: false },
    ],
    isStarted: false,
    createdAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    roomId: "room_2",
    roomCode: "SYN-3921",
    hostId: "user_alex",
    hostName: "Alexander V.",
    settings: {
      category: "academic",
      countryCode: "US",
      countryName: "United States (US)",
      grade: "11th Grade (Junior / SAT)",
      subjectType: "Genel Dersler",
      subjectName: "AP Calculus AB/BC",
      specificTopic: "Integration by Parts & Taylor Series",
      materialType: "curriculum",
      privacy: "public",
      maxPlayers: 2,
      questionCount: 10,
      timePerQuestion: 30,
    },
    players: [
      { id: "user_alex", name: "Alexander V. (Kurucu)", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", elo: 1680, isHost: true, isReady: true },
    ],
    isStarted: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    roomId: "room_3",
    roomCode: "SYN-7712",
    hostId: "user_zeynep",
    hostName: "Zeynep Arslan",
    settings: {
      category: "coding_tech",
      subjectName: "Python",
      specificTopic: "LeetCode Algoritmaları & OOP",
      materialType: "curriculum",
      privacy: "public",
      maxPlayers: 4,
      questionCount: 5,
      timePerQuestion: 45,
    },
    players: [
      { id: "user_zeynep", name: "Zeynep Arslan (Kurucu)", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep", elo: 1540, isHost: true, isReady: true },
      { id: "user_emre", name: "Emre Koç", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emre", elo: 1480, isHost: false, isReady: true },
    ],
    isStarted: false,
    createdAt: new Date(Date.now() - 450000).toISOString(),
  },
];
